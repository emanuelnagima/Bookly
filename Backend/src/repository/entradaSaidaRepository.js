const db = require('../../config/database');
const { Entrada, Saida } = require('../models/entradasaida');

class EntradaSaidaRepository {
    // ENTRADAS
    async registrarEntrada(entradaData) {
        let connection;
        try {
            connection = await db.getConnection();
            await connection.beginTransaction();

            const entrada = new Entrada(entradaData);

            // Verificar se livro existe
            const [livroRows] = await connection.execute(
                'SELECT id FROM livros WHERE id = ?',
                [entrada.livro_id]
            );

            if (livroRows.length === 0) {
                throw new Error('Livro não encontrado');
            }

            // Registrar entrada
            const [result] = await connection.execute(
                'INSERT INTO entradas (livro_id, origem, observacoes, quantidade) VALUES (?, ?, ?, ?)',
                [entrada.livro_id, entrada.origem, entrada.observacoes, entrada.quantidade]
            );

            // Atualizar estoque
            await connection.execute(
                'UPDATE livros SET estoque = estoque + ? WHERE id = ?',
                [entrada.quantidade, entrada.livro_id]
            );

            await connection.commit();
            return result.insertId;

        } catch (error) {
            if (connection) await connection.rollback();
            throw new Error(`Erro ao registrar entrada: ${error.message}`);
        } finally {
            if (connection) connection.release();
        }
    }

    async getEntradasPorLivro(livroId) {
        try {
            const [rows] = await db.execute(`
                SELECT e.*, l.titulo, l.isbn, l.estoque,
                       a.nome as autor_nome
                FROM entradas e
                JOIN livros l ON e.livro_id = l.id
                LEFT JOIN autores a ON l.autor_id = a.id
                WHERE e.livro_id = ?
                ORDER BY e.data_aquisicao DESC
            `, [livroId]);

            return rows;
        } catch (error) {
            throw new Error(`Erro ao buscar entradas: ${error.message}`);
        }
    }

    async getAllEntradas() {
        try {
            const [rows] = await db.execute(`
                SELECT e.*, l.titulo, l.isbn, l.estoque,
                       a.nome as autor_nome
                FROM entradas e
                JOIN livros l ON e.livro_id = l.id
                LEFT JOIN autores a ON l.autor_id = a.id
                ORDER BY e.data_aquisicao DESC
            `);

            return rows;
        } catch (error) {
            throw new Error(`Erro ao buscar entradas: ${error.message}`);
        }
    }

    // SAÍDAS
async registrarSaida(saidaData) {
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        const saida = new Saida(saidaData);

        //  VERIFICAÇÃO COMPLETA: Considera estoque físico, empréstimos E reservas
        const estoqueInfo = await this.verificarEstoqueDisponivel(saida.livro_id);
        
        if (estoqueInfo.estoqueDisponivel < saida.quantidade) {
            throw new Error(`Estoque disponível insuficiente. Disponível: ${estoqueInfo.estoqueDisponivel}, Solicitado: ${saida.quantidade}. Livro: "${estoqueInfo.livro}"`);
        }

        // Registrar saída
        const [result] = await connection.execute(
            'INSERT INTO saidas (livro_id, origem, observacoes, quantidade) VALUES (?, ?, ?, ?)',
            [saida.livro_id, saida.origem, saida.observacoes, saida.quantidade]
        );

        // Atualizar estoque físico
        await connection.execute(
            'UPDATE livros SET estoque = estoque - ? WHERE id = ?',
            [saida.quantidade, saida.livro_id]
        );

        await connection.commit();
        return result.insertId;

    } catch (error) {
        if (connection) await connection.rollback();
        throw new Error(`Erro ao registrar saída: ${error.message}`);
    } finally {
        if (connection) connection.release();
    }
}
    async getSaidasPorLivro(livroId) {
        try {
            const [rows] = await db.execute(`
                SELECT s.*, l.titulo, l.isbn, l.estoque,
                       a.nome as autor_nome
                FROM saidas s
                JOIN livros l ON s.livro_id = l.id
                LEFT JOIN autores a ON l.autor_id = a.id
                WHERE s.livro_id = ?
                ORDER BY s.data_saida DESC
            `, [livroId]);

            return rows;
        } catch (error) {
            throw new Error(`Erro ao buscar saídas: ${error.message}`);
        }
    }

    async getAllSaidas() {
        try {
            const [rows] = await db.execute(`
                SELECT s.*, l.titulo, l.isbn, l.estoque,
                       a.nome as autor_nome
                FROM saidas s
                JOIN livros l ON s.livro_id = l.id
                LEFT JOIN autores a ON l.autor_id = a.id
                ORDER BY s.data_saida DESC
            `);

            return rows;
        } catch (error) {
            throw new Error(`Erro ao buscar saídas: ${error.message}`);
        }
    }

    // ESTATÍSTICAS
    async getEstatisticas() {
        try {
            const [entradas] = await db.execute(`
                SELECT COUNT(*) as total_entradas, SUM(quantidade) as total_exemplares_entrada
                FROM entradas
            `);

            const [saidas] = await db.execute(`
                SELECT COUNT(*) as total_saidas, SUM(quantidade) as total_exemplares_saida
                FROM saidas
            `);

            const [livros] = await db.execute(`
                SELECT COUNT(*) as total_livros, SUM(estoque) as total_estoque
                FROM livros
            `);

            return {
                entradas: entradas[0],
                saidas: saidas[0],
                livros: livros[0]
            };
        } catch (error) {
            throw new Error(`Erro ao buscar estatísticas: ${error.message}`);
        }
    }

    // HISTÓRICO COMPLETO (apenas entradas e saídas)
    async getHistoricoCompleto(livroId = null) {
        try {
            let query = `
                SELECT 
                    'entrada' as tipo,
                    id,
                    livro_id,
                    origem as descricao,
                    observacoes,
                    quantidade,
                    data_aquisicao as data
                FROM entradas
                UNION ALL
                SELECT 
                    'saida' as tipo,
                    id,
                    livro_id,
                    origem as descricao,
                    observacoes,
                    quantidade,
                    data_saida as data
                FROM saidas
            `;

            const params = [];

            if (livroId) {
                query += ' WHERE livro_id = ?';
                params.push(livroId);
            }

            query += ' ORDER BY data DESC';

            const [rows] = await db.execute(query, params);
            return rows;
        } catch (error) {
            throw new Error(`Erro ao buscar histórico: ${error.message}`);
        }
    }

    // VERIFICAR ESTOQUE
    async verificarEstoque(livroId) {
        try {
            const [rows] = await db.execute(
                'SELECT estoque FROM livros WHERE id = ?',
                [livroId]
            );

            if (rows.length === 0) {
                throw new Error('Livro não encontrado');
            }

            return rows[0].estoque;
        } catch (error) {
            throw new Error(`Erro ao verificar estoque: ${error.message}`);
        }
    }

async verificarEstoqueDisponivel(livroId) {
    try {
        // 1. Estoque físico
        const [estoqueRows] = await db.execute(
            'SELECT estoque, titulo FROM livros WHERE id = ?',
            [livroId]
        );

        if (estoqueRows.length === 0) {
            throw new Error('Livro não encontrado');
        }

        const estoqueFisico = estoqueRows[0].estoque || 0;

        // 2. Empréstimos ativos
        const [emprestimosAtivos] = await db.execute(
            `SELECT COALESCE(SUM(el.quantidade), 0) as total_emprestado
             FROM emprestimo_livros el
             JOIN emprestimos e ON el.emprestimo_id = e.id
             WHERE el.livro_id = ? AND e.status = 'ativo'`,
            [livroId]
        );

        // 3. RESERVAS ATIVAS - NOVA VERIFICAÇÃO
        const [reservasAtivas] = await db.execute(
            `SELECT COALESCE(COUNT(*), 0) as total_reservado
             FROM reservas r
             JOIN reserva_livros rl ON r.id = rl.reserva_id
             WHERE rl.livro_id = ? AND r.status = 'ativa'`,
            [livroId]
        );

        const totalEmprestado = Number(emprestimosAtivos[0].total_emprestado) || 0;
        const totalReservado = Number(reservasAtivas[0].total_reservado) || 0;
        
        // Estoque disponível = físico - emprestados - reservados
        const estoqueDisponivel = Math.max(0, estoqueFisico - totalEmprestado - totalReservado);

        return {
            estoqueDisponivel,
            estoqueFisico,
            totalEmprestado,
            totalReservado, 
            livro: estoqueRows[0].titulo
        };
    } catch (error) {
        throw new Error(`Erro ao verificar estoque disponível: ${error.message}`);
    }
}
}

module.exports = new EntradaSaidaRepository();