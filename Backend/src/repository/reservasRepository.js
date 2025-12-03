const db = require('../../config/database');
const Reserva = require('../models/Reserva');

class ReservasRepository {
   async findAll() {
        try {
            const [rows] = await db.execute(`
                SELECT 
                    r.*,
                    COUNT(rl.livro_id) as total_livros,
                    -- Dados completos do usuário
                    CASE 
                        WHEN r.usuario_tipo = 'aluno' THEN (SELECT nome FROM alunos WHERE id = r.usuario_id)
                        WHEN r.usuario_tipo = 'professor' THEN (SELECT nome FROM professores WHERE id = r.usuario_id)
                        WHEN r.usuario_tipo = 'usuario_especial' THEN (SELECT nome_completo FROM usuarios_especiais WHERE id = r.usuario_id)
                    END as usuario,
                    CASE 
                        WHEN r.usuario_tipo = 'aluno' THEN (SELECT email FROM alunos WHERE id = r.usuario_id)
                        WHEN r.usuario_tipo = 'professor' THEN (SELECT email FROM professores WHERE id = r.usuario_id)
                        WHEN r.usuario_tipo = 'usuario_especial' THEN (SELECT email FROM usuarios_especiais WHERE id = r.usuario_id)
                    END as usuario_email,
                    CASE 
                        WHEN r.usuario_tipo = 'aluno' THEN (SELECT telefone FROM alunos WHERE id = r.usuario_id)
                        WHEN r.usuario_tipo = 'professor' THEN (SELECT telefone FROM professores WHERE id = r.usuario_id)
                        WHEN r.usuario_tipo = 'usuario_especial' THEN (SELECT telefone FROM usuarios_especiais WHERE id = r.usuario_id)
                    END as usuario_telefone,
                    -- Dados específicos por tipo
                    CASE 
                        WHEN r.usuario_tipo = 'aluno' THEN (SELECT turma FROM alunos WHERE id = r.usuario_id)
                    END as usuario_turma,
                    CASE 
                        WHEN r.usuario_tipo = 'professor' THEN (SELECT departamento FROM professores WHERE id = r.usuario_id)
                    END as usuario_departamento,
                    CASE 
                        WHEN r.usuario_tipo = 'usuario_especial' THEN (SELECT tipo_usuario FROM usuarios_especiais WHERE id = r.usuario_id)
                    END as usuario_tipo_especial
                FROM reservas r
                LEFT JOIN reserva_livros rl ON r.id = rl.reserva_id
                GROUP BY r.id
                ORDER BY r.data_reserva DESC
            `);
            
            // Para cada reserva, buscar os livros
            const reservasComLivros = await Promise.all(
                rows.map(async (row) => {
                    const [livros] = await db.execute(`
                        SELECT 
                            rl.livro_id, 
                            rl.quantidade,
                            l.titulo as livro_titulo,
                            l.isbn as livro_isbn,
                            l.imagem as livro_imagem,
                            a.nome as autor_nome
                        FROM reserva_livros rl
                        JOIN livros l ON rl.livro_id = l.id
                        LEFT JOIN autores a ON l.autor_id = a.id
                        WHERE rl.reserva_id = ?
                    `, [row.id]);

                    const resultado = {
                        ...new Reserva(row),
                        livros: livros,
                        total_livros: livros.length,
                        // Adicionar dados completos do usuário
                        usuario_detalhes: {
                            nome: row.usuario,
                            email: row.usuario_email,
                            telefone: row.usuario_telefone,
                            turma: row.usuario_turma,
                            departamento: row.usuario_departamento,
                            tipo_especial: row.usuario_tipo_especial
                        }
                    };

                    return resultado;
                })
            );

            return reservasComLivros;
        } catch (error) {
            throw new Error(`Erro ao buscar reservas: ${error.message}`);
        }
    }
 async findById(id) {
        try {
            // Buscar dados básicos da reserva com todos os dados do usuário
            const [reservaRows] = await db.execute(`
                SELECT r.*,
                       CASE 
                           WHEN r.usuario_tipo = 'aluno' THEN (SELECT nome FROM alunos WHERE id = r.usuario_id)
                           WHEN r.usuario_tipo = 'professor' THEN (SELECT nome FROM professores WHERE id = r.usuario_id)
                           WHEN r.usuario_tipo = 'usuario_especial' THEN (SELECT nome_completo FROM usuarios_especiais WHERE id = r.usuario_id)
                       END as usuario,
                       CASE 
                           WHEN r.usuario_tipo = 'aluno' THEN (SELECT email FROM alunos WHERE id = r.usuario_id)
                           WHEN r.usuario_tipo = 'professor' THEN (SELECT email FROM professores WHERE id = r.usuario_id)
                           WHEN r.usuario_tipo = 'usuario_especial' THEN (SELECT email FROM usuarios_especiais WHERE id = r.usuario_id)
                       END as usuario_email,
                       CASE 
                           WHEN r.usuario_tipo = 'aluno' THEN (SELECT telefone FROM alunos WHERE id = r.usuario_id)
                           WHEN r.usuario_tipo = 'professor' THEN (SELECT telefone FROM professores WHERE id = r.usuario_id)
                           WHEN r.usuario_tipo = 'usuario_especial' THEN (SELECT telefone FROM usuarios_especiais WHERE id = r.usuario_id)
                       END as usuario_telefone,
                       CASE 
                           WHEN r.usuario_tipo = 'aluno' THEN (SELECT turma FROM alunos WHERE id = r.usuario_id)
                       END as usuario_turma,
                       CASE 
                           WHEN r.usuario_tipo = 'professor' THEN (SELECT departamento FROM professores WHERE id = r.usuario_id)
                       END as usuario_departamento,
                       CASE 
                           WHEN r.usuario_tipo = 'usuario_especial' THEN (SELECT tipo_usuario FROM usuarios_especiais WHERE id = r.usuario_id)
                       END as usuario_tipo_especial
                FROM reservas r
                WHERE r.id = ?
            `, [id]);

            if (reservaRows.length === 0) return null;

            // Buscar livros da reserva
            const [livrosRows] = await db.execute(`
                SELECT 
                    rl.livro_id, 
                    rl.quantidade,
                    l.titulo as livro_titulo,
                    l.isbn as livro_isbn,
                    l.imagem as livro_imagem,
                    a.nome as autor_nome
                FROM reserva_livros rl
                JOIN livros l ON rl.livro_id = l.id
                LEFT JOIN autores a ON l.autor_id = a.id
                WHERE rl.reserva_id = ?
            `, [id]);

            const reserva = new Reserva(reservaRows[0]);
            reserva.livros = livrosRows;
            reserva.usuario_detalhes = {
                nome: reservaRows[0].usuario,
                email: reservaRows[0].usuario_email,
                telefone: reservaRows[0].usuario_telefone,
                turma: reservaRows[0].usuario_turma,
                departamento: reservaRows[0].usuario_departamento,
                tipo_especial: reservaRows[0].usuario_tipo_especial
            };
            
            return reserva;
        } catch (error) {
            throw new Error(`Erro ao buscar reserva por ID: ${error.message}`);
        }
    }

async cancelar(id, motivo = '') {
    try {
        console.log(`Cancelando reserva ${id} com motivo:`, motivo);
        
        const query = `
            UPDATE reservas 
            SET 
                status = 'cancelada',
                data_cancelamento = NOW(),
                motivo_cancelamento = ?
            WHERE id = ? AND status = 'ativa'
        `;
        
        const [result] = await db.execute(query, [motivo || null, id]);
        
        if (result.affectedRows === 0) {
            console.log(`Reserva ${id} não encontrada ou já não está ativa`);
            return null;
        }
        
        console.log(`Reserva ${id} cancelada com sucesso`);
        return await this.findById(id);
        
    } catch (error) {
        console.error(`Erro ao cancelar reserva ${id}:`, error);
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

async create(reservaData) {
    let connection;
    try {
        console.log('=== REPOSITORY: Criando reserva ===');
        connection = await db.getConnection();
        await connection.beginTransaction();

        const reserva = new Reserva(reservaData);
        
        if (!reserva.livros || reserva.livros.length === 0) {
            throw new Error('Nenhum livro foi informado para a reserva');
        }

        console.log(`Verificando ${reserva.livros.length} livro(s)...`);
        
        // **VERIFICAÇÃO COMPLETA DE ESTOQUE E RESERVAS ATIVAS**
        for (const livro of reserva.livros) {
            console.log(`Verificando livro ID: ${livro.livro_id}`);
            
            // 1. Verificar se livro existe
            const [livroRows] = await connection.execute(
                'SELECT id, titulo, estoque FROM livros WHERE id = ?',
                [livro.livro_id]
            );

            if (livroRows.length === 0) {
                throw new Error(`Livro ID ${livro.livro_id} não encontrado`);
            }

            const livroInfo = livroRows[0];
            const quantidadeSolicitada = livro.quantidade || 1;

            // 2. **VERIFICAÇÃO CRÍTICA: Calcular estoque disponível considerando reservas ativas**
            const [reservasAtivas] = await connection.execute(
                `SELECT SUM(rl.quantidade) as total_reservado
                 FROM reserva_livros rl
                 JOIN reservas r ON rl.reserva_id = r.id
                 WHERE rl.livro_id = ? AND r.status = 'ativa'`,
                [livro.livro_id]
            );

            const totalReservado = reservasAtivas[0].total_reservado || 0;
            const estoqueDisponivel = livroInfo.estoque - totalReservado;

            // 3. Verificar se há estoque disponível
            // No método create do ReservasRepository
                if (estoqueDisponivel < quantidadeSolicitada) {
                throw new Error(`
                    ESTOQUE INSUFICIENTE
                    Livro: "${livroInfo.titulo}"
                    Disponível: ${estoqueDisponivel} exemplar(es)
                    Solicitado: ${quantidadeSolicitada}
                    
                    Todos os exemplares estão atualmente emprestados.
                    Aguarde a devolução ou escolha outro livro.
                `);
                }

            // 4. Verificar se já existe reserva ativa para este livro e usuário
            const [reservasExistentes] = await connection.execute(
                `SELECT r.id 
                 FROM reservas r
                 JOIN reserva_livros rl ON r.id = rl.reserva_id
                 WHERE r.usuario_id = ? AND r.usuario_tipo = ? AND rl.livro_id = ? AND r.status = 'ativa'`,
                [reserva.usuario_id, reserva.usuario_tipo, livro.livro_id]
            );

            if (reservasExistentes.length > 0) {
                throw new Error(`Já existe uma reserva ativa para o livro "${livroInfo.titulo}"`);
            }
        }

        // Resto do código permanece igual...
        const primeiroLivroId = reserva.livros[0].livro_id;

        console.log('Inserindo reserva principal...');
        const [result] = await connection.execute(
            `INSERT INTO reservas 
             (usuario_id, usuario_tipo, livro_id, data_validade, observacoes, status) 
             VALUES (?, ?, ?, ?, ?, 'ativa')`,
            [
                reserva.usuario_id,
                reserva.usuario_tipo,
                primeiroLivroId,
                reserva.data_validade,
                reserva.observacoes || ''
            ]
        );

        const reservaId = result.insertId;

        // Inserir livros da reserva
        for (const livro of reserva.livros) {
            await connection.execute(
                `INSERT INTO reserva_livros 
                 (reserva_id, livro_id, quantidade) 
                 VALUES (?, ?, ?)`,
                [reservaId, livro.livro_id, livro.quantidade || 1]
            );
        }

        await connection.commit();        
        const reservaCompleta = await this.findById(reservaId);
        return reservaCompleta;

    } catch (error) {
        if (connection) await connection.rollback();
        throw new Error(error.message);
    } finally {
        if (connection) connection.release();
    }
}
    // ** Atualizar outros métodos para usar reserva_livros**
 async getReservasAtivas() {
    try {
        const [rows] = await db.execute(`
            SELECT 
                r.*,
                COUNT(rl.livro_id) as total_livros,
                CASE 
                    WHEN r.usuario_tipo = 'aluno' THEN (SELECT nome FROM alunos WHERE id = r.usuario_id)
                    WHEN r.usuario_tipo = 'professor' THEN (SELECT nome FROM professores WHERE id = r.usuario_id)
                    WHEN r.usuario_tipo = 'usuario_especial' THEN (SELECT nome_completo FROM usuarios_especiais WHERE id = r.usuario_id)
                END as usuario
            FROM reservas r
            LEFT JOIN reserva_livros rl ON r.id = rl.reserva_id
            WHERE r.status = 'ativa' AND r.data_validade >= CURDATE()
            GROUP BY r.id
            ORDER BY r.data_reserva ASC
        `);
        
        const reservasComLivros = await Promise.all(
            rows.map(async (row) => {
                const [livros] = await db.execute(`
                    SELECT 
                        rl.livro_id, 
                        rl.quantidade,
                        l.titulo as livro_titulo,
                        l.isbn as livro_isbn,
                        l.imagem as livro_imagem,
                        a.nome as autor_nome
                    FROM reserva_livros rl
                    JOIN livros l ON rl.livro_id = l.id
                    LEFT JOIN autores a ON l.autor_id = a.id
                    WHERE rl.reserva_id = ?
                `, [row.id]);

                return new Reserva({
                    ...row,
                    livros: livros
                });
            })
        );

        return reservasComLivros;
    } catch (error) {
        throw new Error(`Erro ao buscar reservas ativas: ${error.message}`);
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

        // **CORREÇÃO: Usar primeiro livro como livro_id obrigatório**
        const primeiroLivroId = reserva.livros.length > 0 ? reserva.livros[0].livro_id : null;
        if (!primeiroLivroId) {
            throw new Error('Pelo menos um livro deve ser selecionado');
        }

        // Verificar se já existe outra reserva ativa para o mesmo livro e usuário
        const [reservasConflito] = await db.execute(`
            SELECT id FROM reservas 
            WHERE usuario_id = ? AND usuario_tipo = ? AND livro_id = ? AND status = 'ativa' AND id != ?
        `, [reserva.usuario_id, reserva.usuario_tipo, primeiroLivroId, id]);

        if (reservasConflito.length > 0) {
            throw new Error('Já existe uma reserva ativa para este livro');
        }

        // Atualizar reserva
        await db.execute(
            'UPDATE reservas SET usuario_id = ?, usuario_tipo = ?, livro_id = ?, data_validade = ?, observacoes = ? WHERE id = ?',
            [reserva.usuario_id, reserva.usuario_tipo, primeiroLivroId, reserva.data_validade, reserva.observacoes, id]
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
                       l.titulo as livro_titulo,
                       l.imagem as livro_imagem,
                       a.nome as autor_nome,
                       CASE 
                           WHEN r.usuario_tipo = 'aluno' THEN (SELECT nome FROM alunos WHERE id = r.usuario_id)
                           WHEN r.usuario_tipo = 'professor' THEN (SELECT nome FROM professores WHERE id = r.usuario_id)
                           WHEN r.usuario_tipo = 'usuario_especial' THEN (SELECT nome_completo FROM usuarios_especiais WHERE id = r.usuario_id)
                       END as usuario
                FROM reservas r
                JOIN livros l ON r.livro_id = l.id
                LEFT JOIN autores a ON l.autor_id = a.id
                WHERE r.livro_id = ? AND r.status = 'ativa' AND r.data_validade >= CURDATE()
                ORDER BY r.data_reserva ASC
            `, [livroId]);
            return rows.map(row => new Reserva(row));
        } catch (error) {
            throw new Error(`Erro ao buscar reservas por livro: ${error.message}`);
        }
    }

   async getReservasExpiradas() {
    try {
        const [rows] = await db.execute(`
            SELECT 
                r.*,
                COUNT(rl.livro_id) as total_livros,
                CASE 
                    WHEN r.usuario_tipo = 'aluno' THEN (SELECT nome FROM alunos WHERE id = r.usuario_id)
                    WHEN r.usuario_tipo = 'professor' THEN (SELECT nome FROM professores WHERE id = r.usuario_id)
                    WHEN r.usuario_tipo = 'usuario_especial' THEN (SELECT nome_completo FROM usuarios_especiais WHERE id = r.usuario_id)
                END as usuario
            FROM reservas r
            LEFT JOIN reserva_livros rl ON r.id = rl.reserva_id
            WHERE r.status = 'ativa' AND r.data_validade < CURDATE()
            GROUP BY r.id
            ORDER BY r.data_validade ASC
        `);
        
        const reservasComLivros = await Promise.all(
            rows.map(async (row) => {
                const [livros] = await db.execute(`
                    SELECT 
                        rl.livro_id, 
                        rl.quantidade,
                        l.titulo as livro_titulo,
                        l.isbn as livro_isbn,
                        l.imagem as livro_imagem,
                        a.nome as autor_nome
                    FROM reserva_livros rl
                    JOIN livros l ON rl.livro_id = l.id
                    LEFT JOIN autores a ON l.autor_id = a.id
                    WHERE rl.reserva_id = ?
                `, [row.id]);

                return new Reserva({
                    ...row,
                    livros: livros
                });
            })
        );

        return reservasComLivros;
    } catch (error) {
        throw new Error(`Erro ao buscar reservas expiradas: ${error.message}`);
    }
}
    async getReservasPorUsuario(usuarioId, usuarioTipo) {
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
                       END as usuario
                FROM reservas r
                JOIN livros l ON r.livro_id = l.id
                LEFT JOIN autores a ON l.autor_id = a.id
                WHERE r.usuario_id = ? AND r.usuario_tipo = ?
                ORDER BY r.data_reserva DESC
            `, [usuarioId, usuarioTipo]);
            return rows.map(row => new Reserva(row));
        } catch (error) {
            throw new Error(`Erro ao buscar reservas por usuário: ${error.message}`);
        }
    }
     async expirarReservas() {
        let connection;
        try {
            connection = await db.getConnection();
            await connection.beginTransaction();

            // Primeiro: buscar reservas que serão expiradas (para log)
            const [reservasParaExpirar] = await connection.execute(
                `SELECT id, usuario_id, data_validade 
                 FROM reservas 
                 WHERE status = 'ativa' 
                 AND data_validade < CURDATE()`
            );

            reservasParaExpirar.forEach(reserva => {
                console.log(`- Reserva ${reserva.id} (usuário ${reserva.usuario_id}) - vencida em ${reserva.data_validade}`);
            });

            // Atualizar status para expirada
            const [result] = await connection.execute(
                `UPDATE reservas 
                 SET status = 'expirada' 
                 WHERE status = 'ativa' 
                 AND data_validade < CURDATE()`
            );

            await connection.commit();
            
            return result.affectedRows;

        } catch (error) {
            if (connection) await connection.rollback();
            throw new Error(`Erro ao expirar reservas: ${error.message}`);
        } finally {
            if (connection) connection.release();
        }
    }

    // **NOVO: Buscar reservas por status específico**
    async getReservasPorStatus(status) {
        try {
            const [rows] = await db.execute(`
                SELECT 
                    r.*,
                    COUNT(rl.livro_id) as total_livros,
                    CASE 
                        WHEN r.usuario_tipo = 'aluno' THEN (SELECT nome FROM alunos WHERE id = r.usuario_id)
                        WHEN r.usuario_tipo = 'professor' THEN (SELECT nome FROM professores WHERE id = r.usuario_id)
                        WHEN r.usuario_tipo = 'usuario_especial' THEN (SELECT nome_completo FROM usuarios_especiais WHERE id = r.usuario_id)
                    END as usuario
                FROM reservas r
                LEFT JOIN reserva_livros rl ON r.id = rl.reserva_id
                WHERE r.status = ?
                GROUP BY r.id
                ORDER BY r.data_reserva DESC
            `, [status]);
            
            const reservasComLivros = await Promise.all(
                rows.map(async (row) => {
                    const [livros] = await db.execute(`
                        SELECT 
                            rl.livro_id, 
                            rl.quantidade,
                            l.titulo as livro_titulo,
                            l.isbn as livro_isbn,
                            l.imagem as livro_imagem,
                            a.nome as autor_nome
                        FROM reserva_livros rl
                        JOIN livros l ON rl.livro_id = l.id
                        LEFT JOIN autores a ON l.autor_id = a.id
                        WHERE rl.reserva_id = ?
                    `, [row.id]);

                    return new Reserva({
                        ...row,
                        livros: livros
                    });
                })
            );

            return reservasComLivros;
        } catch (error) {
            throw new Error(`Erro ao buscar reservas com status ${status}: ${error.message}`);
        }
    }
    // Em ambos ReservasRepository e EmprestimosRepository
async verificarDisponibilidadeLivro(livroId, quantidade = 1) {
    try {
        // Para reservas: estoque - reservas ativas
        const [livroRows] = await db.execute(
            'SELECT estoque, titulo FROM livros WHERE id = ?',
            [livroId]
        );

        if (livroRows.length === 0) return { disponivel: false, motivo: 'Livro não encontrado' };

        const livro = livroRows[0];
        
        // Calcular já reservado/emprestado
        const [usoAtivo] = await db.execute(
            `SELECT SUM(quantidade) as total_uso 
             FROM ${this.constructor.name.includes('Reserva') ? 'reserva_livros rl JOIN reservas r ON rl.reserva_id = r.id WHERE r.status = "ativa"' : 'emprestimo_livros el JOIN emprestimos e ON el.emprestimo_id = e.id WHERE e.status = "ativo"'} 
             AND livro_id = ?`,
            [livroId]
        );

        const totalUso = usoAtivo[0].total_uso || 0;
        const disponivel = livro.estoque - totalUso;

        return {
            disponivel: disponivel >= quantidade,
            estoqueTotal: livro.estoque,
            jaUsado: totalUso,
            disponivelExato: disponivel,
            livro: livro.titulo
        };
    } catch (error) {
        throw new Error(`Erro ao verificar disponibilidade: ${error.message}`);
    }
}
}

module.exports = new ReservasRepository();