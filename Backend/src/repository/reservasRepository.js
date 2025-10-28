const db = require('../../config/database');
const Reserva = require('../models/Reserva');

class ReservasRepository {
    async findAll() {
        try {
            const [rows] = await db.execute(`
                SELECT r.*, 
                       l.titulo as livro_titulo,
                       l.isbn as livro_isbn,
                       l.imagem as livro_imagem,
                       a.nome as autor_nome,
                       CASE 
                           WHEN r.usuario_tipo = 'aluno' THEN (SELECT nome FROM alunos WHERE id = r.usuario_id)
                           WHEN r.usuario_tipo = 'professor' THEN (SELECT nome FROM professores WHERE id = r.usuario_id)
                           WHEN r.usuario_tipo = 'usuario_especial' THEN (SELECT nome_completo FROM usuarios_especiais WHERE id = r.usuario_id)
                       END as usuario_nome
                FROM reservas r
                JOIN livros l ON r.livro_id = l.id
                LEFT JOIN autores a ON l.autor_id = a.id
                ORDER BY r.data_reserva DESC
            `);
            return rows.map(row => new Reserva(row));
        } catch (error) {
            throw new Error(`Erro ao buscar reservas: ${error.message}`);
        }
    }

    async findById(id) {
        try {
            const [rows] = await db.execute(`
                SELECT r.*, 
                       l.titulo as livro_titulo,
                       l.isbn as livro_isbn,
                       l.imagem as livro_imagem,
                       a.nome as autor_nome,
                       CASE 
                           WHEN r.usuario_tipo = 'aluno' THEN (SELECT nome FROM alunos WHERE id = r.usuario_id)
                           WHEN r.usuario_tipo = 'professor' THEN (SELECT nome FROM professores WHERE id = r.usuario_id)
                           WHEN r.usuario_tipo = 'usuario_especial' THEN (SELECT nome_completo FROM usuarios_especiais WHERE id = r.usuario_id)
                       END as usuario_nome
                FROM reservas r
                JOIN livros l ON r.livro_id = l.id
                LEFT JOIN autores a ON l.autor_id = a.id
                WHERE r.id = ?
            `, [id]);

            if (rows.length === 0) return null;
            return new Reserva(rows[0]);
        } catch (error) {
            throw new Error(`Erro ao buscar reserva por ID: ${error.message}`);
        }
    }

    async create(reservaData) {
        try {
            const reserva = new Reserva(reservaData);
            
            // Verificar se já existe reserva ativa para o mesmo livro e usuário
            const [reservasExistentes] = await db.execute(`
                SELECT id FROM reservas 
                WHERE usuario_id = ? AND usuario_tipo = ? AND livro_id = ? AND status = 'ativa'
            `, [reserva.usuario_id, reserva.usuario_tipo, reserva.livro_id]);

            if (reservasExistentes.length > 0) {
                throw new Error('Já existe uma reserva ativa para este livro');
            }

            // Verificar disponibilidade do livro
            const [livroRows] = await db.execute(
                'SELECT estoque FROM livros WHERE id = ?',
                [reserva.livro_id]
            );

            if (livroRows.length === 0) {
                throw new Error('Livro não encontrado');
            }

            if (livroRows[0].estoque > 0) {
                throw new Error('Livro está disponível para empréstimo imediato');
            }

            const [result] = await db.execute(
                'INSERT INTO reservas (usuario_id, usuario_tipo, livro_id, data_validade, observacoes) VALUES (?, ?, ?, ?, ?)',
                [reserva.usuario_id, reserva.usuario_tipo, reserva.livro_id, reserva.data_validade, reserva.observacoes]
            );

            return this.findById(result.insertId);

        } catch (error) {
            throw new Error(`Erro ao criar reserva: ${error.message}`);
        }
    }

    async cancelar(id) {
        try {
            await db.execute(
                'UPDATE reservas SET status = "cancelada" WHERE id = ?',
                [id]
            );
            return this.findById(id);
        } catch (error) {
            throw new Error(`Erro ao cancelar reserva: ${error.message}`);
        }
    }

    async concluir(id) {
        try {
            await db.execute(
                'UPDATE reservas SET status = "concluida" WHERE id = ?',
                [id]
            );
            return this.findById(id);
        } catch (error) {
            throw new Error(`Erro ao concluir reserva: ${error.message}`);
        }
    }

    async getReservasAtivas() {
        try {
            const [rows] = await db.execute(`
                SELECT r.*, 
                       l.titulo as livro_titulo,
                       l.isbn as livro_isbn,
                       a.nome as autor_nome,
                       CASE 
                           WHEN r.usuario_tipo = 'aluno' THEN (SELECT nome FROM alunos WHERE id = r.usuario_id)
                           WHEN r.usuario_tipo = 'professor' THEN (SELECT nome FROM professores WHERE id = r.usuario_id)
                           WHEN r.usuario_tipo = 'usuario_especial' THEN (SELECT nome_completo FROM usuarios_especiais WHERE id = r.usuario_id)
                       END as usuario_nome
                FROM reservas r
                JOIN livros l ON r.livro_id = l.id
                LEFT JOIN autores a ON l.autor_id = a.id
                WHERE r.status = 'ativa' AND r.data_validade >= CURDATE()
                ORDER BY r.data_reserva ASC
            `);
            return rows.map(row => new Reserva(row));
        } catch (error) {
            throw new Error(`Erro ao buscar reservas ativas: ${error.message}`);
        }
    }
      async update(id, reservaData) {
        try {
            const reserva = new Reserva(reservaData);
            
            // Verificar se reserva existe e pode ser editada
            const reservaExistente = await this.findById(id);
            if (!reservaExistente) {
                throw new Error('Reserva não encontrada');
            }

            if (reservaExistente.status !== 'ativa') {
                throw new Error('Apenas reservas ativas podem ser editadas');
            }

            // Verificar se já existe outra reserva ativa para o mesmo livro e usuário
            const [reservasConflito] = await db.execute(`
                SELECT id FROM reservas 
                WHERE usuario_id = ? AND usuario_tipo = ? AND livro_id = ? AND status = 'ativa' AND id != ?
            `, [reserva.usuario_id, reserva.usuario_tipo, reserva.livro_id, id]);

            if (reservasConflito.length > 0) {
                throw new Error('Já existe uma reserva ativa para este livro');
            }

            // Atualizar reserva
            await db.execute(
                'UPDATE reservas SET usuario_id = ?, usuario_tipo = ?, livro_id = ?, data_validade = ?, observacoes = ? WHERE id = ?',
                [reserva.usuario_id, reserva.usuario_tipo, reserva.livro_id, reserva.data_validade, reserva.observacoes, id]
            );

            return this.findById(id);

        } catch (error) {
            throw new Error(`Erro ao atualizar reserva: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            // Verificar se reserva existe
            const reserva = await this.findById(id);
            if (!reserva) {
                throw new Error('Reserva não encontrada');
            }

            // Deletar reserva
            const [result] = await db.execute(
                'DELETE FROM reservas WHERE id = ?',
                [id]
            );

            return result.affectedRows > 0;

        } catch (error) {
            throw new Error(`Erro ao deletar reserva: ${error.message}`);
        }
    }

    async podeEditar(id) {
        try {
            const [rows] = await db.execute(
                'SELECT status, data_validade FROM reservas WHERE id = ?',
                [id]
            );
            
            if (rows.length === 0) return false;
            
            // Permitir edição apenas se estiver ativa e dentro da validade
            const hoje = new Date();
            const dataValidade = new Date(rows[0].data_validade);
            return rows[0].status === 'ativa' && dataValidade >= hoje;
        } catch (error) {
            throw new Error(`Erro ao verificar permissão de edição: ${error.message}`);
        }
    }
    async getReservasPorLivro(livroId) {
        try {
            const [rows] = await db.execute(`
                SELECT r.*,
                       CASE 
                           WHEN r.usuario_tipo = 'aluno' THEN (SELECT nome FROM alunos WHERE id = r.usuario_id)
                           WHEN r.usuario_tipo = 'professor' THEN (SELECT nome FROM professores WHERE id = r.usuario_id)
                           WHEN r.usuario_tipo = 'usuario_especial' THEN (SELECT nome_completo FROM usuarios_especiais WHERE id = r.usuario_id)
                       END as usuario_nome
                FROM reservas r
                WHERE r.livro_id = ? AND r.status = 'ativa' AND r.data_validade >= CURDATE()
                ORDER BY r.data_reserva ASC
            `, [livroId]);
            return rows.map(row => new Reserva(row));
        } catch (error) {
            throw new Error(`Erro ao buscar reservas por livro: ${error.message}`);
        }
    }
}

module.exports = new ReservasRepository();