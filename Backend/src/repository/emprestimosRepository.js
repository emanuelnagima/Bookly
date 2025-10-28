const db = require('../../config/database');
const Emprestimo = require('../models/emprestimo');

class EmprestimosRepository {
  async findAll() {
    try {
        console.log('=== REPOSITORY: Executando query principal ===');
        const [rows] = await db.execute(`
            SELECT 
                e.*,
                COUNT(el.livro_id) as total_livros,
                CASE 
                    WHEN e.usuario_tipo = 'aluno' THEN (SELECT nome FROM alunos WHERE id = e.usuario_id)
                    WHEN e.usuario_tipo = 'professor' THEN (SELECT nome FROM professores WHERE id = e.usuario_id)
                    WHEN e.usuario_tipo = 'usuario_especial' THEN (SELECT nome_completo FROM usuarios_especiais WHERE id = e.usuario_id)
                END as usuario
            FROM emprestimos e
            LEFT JOIN emprestimo_livros el ON e.id = el.emprestimo_id
            GROUP BY e.id
            ORDER BY e.data_emprestimo DESC
        `);
        
        console.log('Resultado da query principal:', rows);
        console.log('Primeira linha - usuario:', rows[0]?.usuario);
        console.log('Primeira linha - usuario_id:', rows[0]?.usuario_id);
        console.log('Primeira linha - usuario_tipo:', rows[0]?.usuario_tipo);

        // Para cada empréstimo, buscar os livros
        const emprestimosComLivros = await Promise.all(
            rows.map(async (row) => {
                console.log(`Buscando livros para empréstimo ${row.id}`);
                const [livros] = await db.execute(`
                    SELECT 
                        l.titulo as livro_titulo, 
                        l.imagem as livro_imagem, 
                        l.isbn as livro_isbn,
                        a.nome as autor_nome,
                        el.quantidade,
                        el.livro_id
                    FROM emprestimo_livros el
                    JOIN livros l ON el.livro_id = l.id
                    LEFT JOIN autores a ON l.autor_id = a.id
                    WHERE el.emprestimo_id = ?
                `, [row.id]);

                const resultado = {
                    ...new Emprestimo(row),
                    livros: livros,
                    total_livros: livros.length
                };

                return resultado;
            })
        );

        return emprestimosComLivros;
    } catch (error) {
        throw new Error(`Erro ao buscar empréstimos: ${error.message}`);
    }
}
    async findById(id) {
        try {
            // Buscar dados básicos do empréstimo
            const [emprestimoRows] = await db.execute(`
                SELECT e.*,
                       CASE 
                           WHEN e.usuario_tipo = 'aluno' THEN (SELECT nome FROM alunos WHERE id = e.usuario_id)
                           WHEN e.usuario_tipo = 'professor' THEN (SELECT nome FROM professores WHERE id = e.usuario_id)
                           WHEN e.usuario_tipo = 'usuario_especial' THEN (SELECT nome_completo FROM usuarios_especiais WHERE id = e.usuario_id)
                       END as usuario_nome
                FROM emprestimos e
                WHERE e.id = ?
            `, [id]);

            if (emprestimoRows.length === 0) return null;

            // Buscar livros do empréstimo
            const [livrosRows] = await db.execute(`
                SELECT el.*, l.titulo, l.isbn, l.imagem, a.nome as autor_nome
                FROM emprestimo_livros el
                JOIN livros l ON el.livro_id = l.id
                LEFT JOIN autores a ON l.autor_id = a.id
                WHERE el.emprestimo_id = ?
            `, [id]);

            const emprestimo = new Emprestimo(emprestimoRows[0]);
            emprestimo.livros = livrosRows;
            
            return emprestimo;
        } catch (error) {
            throw new Error(`Erro ao buscar empréstimo por ID: ${error.message}`);
        }
    }

    async create(emprestimoData) {
        let connection;
        try {
            connection = await db.getConnection();
            await connection.beginTransaction();

            const emprestimo = new Emprestimo(emprestimoData);
            
            // Inserir empréstimo
            const [result] = await connection.execute(
                'INSERT INTO emprestimos (usuario_id, usuario_tipo, data_devolucao_prevista, observacoes) VALUES (?, ?, ?, ?)',
                [emprestimo.usuario_id, emprestimo.usuario_tipo, emprestimo.data_devolucao_prevista, emprestimo.observacoes]
            );

            const emprestimoId = result.insertId;

            // Inserir livros do empréstimo
            for (const livro of emprestimo.livros) {
                await connection.execute(
                    'INSERT INTO emprestimo_livros (emprestimo_id, livro_id, quantidade) VALUES (?, ?, ?)',
                    [emprestimoId, livro.livro_id, livro.quantidade || 1]
                );

                // Atualizar estoque do livro
                await connection.execute(
                    'UPDATE livros SET estoque = estoque - ? WHERE id = ?',
                    [livro.quantidade || 1, livro.livro_id]
                );
            }

            await connection.commit();
            return this.findById(emprestimoId);

        } catch (error) {
            if (connection) await connection.rollback();
            throw new Error(`Erro ao criar empréstimo: ${error.message}`);
        } finally {
            if (connection) connection.release();
        }
    }

    async renovar(id, novaDataDevolucao) {
        let connection;
        try {
            connection = await db.getConnection();
            await connection.beginTransaction();

            // Verificar se empréstimo existe e está ativo
            const [emprestimoRows] = await connection.execute(
                'SELECT * FROM emprestimos WHERE id = ? AND status = "ativo"',
                [id]
            );

            if (emprestimoRows.length === 0) {
                throw new Error('Empréstimo não encontrado ou já finalizado');
            }

            // Atualizar data de devolução
            await connection.execute(
                'UPDATE emprestimos SET data_devolucao_prevista = ? WHERE id = ?',
                [novaDataDevolucao, id]
            );

            await connection.commit();
            return this.findById(id);

        } catch (error) {
            if (connection) await connection.rollback();
            throw new Error(`Erro ao renovar empréstimo: ${error.message}`);
        } finally {
            if (connection) connection.release();
        }
    }

    async finalizar(id) {
        let connection;
        try {
            connection = await db.getConnection();
            await connection.beginTransaction();

            // Buscar empréstimo e seus livros
            const emprestimo = await this.findById(id);
            if (!emprestimo) {
                throw new Error('Empréstimo não encontrado');
            }

            // Atualizar status do empréstimo
            await connection.execute(
                'UPDATE emprestimos SET status = "finalizado", data_devolucao_real = NOW() WHERE id = ?',
                [id]
            );

            // Restaurar estoque dos livros
            for (const livro of emprestimo.livros) {
                await connection.execute(
                    'UPDATE livros SET estoque = estoque + ? WHERE id = ?',
                    [livro.quantidade || 1, livro.livro_id]
                );
            }

            await connection.commit();
            return this.findById(id);

        } catch (error) {
            if (connection) await connection.rollback();
            throw new Error(`Erro ao finalizar empréstimo: ${error.message}`);
        } finally {
            if (connection) connection.release();
        }
    }
    
    async getEmprestimosAtivos() {
        try {
            const [rows] = await db.execute(`
                SELECT 
                    e.*,
                    COUNT(el.livro_id) as total_livros,
                    CASE 
                        WHEN e.usuario_tipo = 'aluno' THEN (SELECT nome FROM alunos WHERE id = e.usuario_id)
                        WHEN e.usuario_tipo = 'professor' THEN (SELECT nome FROM professores WHERE id = e.usuario_id)
                        WHEN e.usuario_tipo = 'usuario_especial' THEN (SELECT nome_completo FROM usuarios_especiais WHERE id = e.usuario_id)
                    END as usuario_nome
                FROM emprestimos e
                LEFT JOIN emprestimo_livros el ON e.id = el.emprestimo_id
                WHERE e.status = 'ativo'
                GROUP BY e.id
                ORDER BY e.data_devolucao_prevista ASC
            `);

            const emprestimosComLivros = await Promise.all(
                rows.map(async (row) => {
                    const [livros] = await db.execute(`
                        SELECT 
                            l.titulo as livro_titulo, 
                            l.imagem as livro_imagem, 
                            l.isbn as livro_isbn,
                            a.nome as autor_nome,
                            el.quantidade,
                            el.livro_id
                        FROM emprestimo_livros el
                        JOIN livros l ON el.livro_id = l.id
                        LEFT JOIN autores a ON l.autor_id = a.id
                        WHERE el.emprestimo_id = ?
                    `, [row.id]);

                    return {
                        ...new Emprestimo(row),
                        livros: livros,
                        total_livros: livros.length
                    };
                })
            );

            return emprestimosComLivros;
        } catch (error) {
            throw new Error(`Erro ao buscar empréstimos ativos: ${error.message}`);
        }
    }

    async getEmprestimosAtrasados() {
        try {
            const [rows] = await db.execute(`
                SELECT 
                    e.*,
                    COUNT(el.livro_id) as total_livros,
                    CASE 
                        WHEN e.usuario_tipo = 'aluno' THEN (SELECT nome FROM alunos WHERE id = e.usuario_id)
                        WHEN e.usuario_tipo = 'professor' THEN (SELECT nome FROM professores WHERE id = e.usuario_id)
                        WHEN e.usuario_tipo = 'usuario_especial' THEN (SELECT nome_completo FROM usuarios_especiais WHERE id = e.usuario_id)
                    END as usuario_nome
                FROM emprestimos e
                LEFT JOIN emprestimo_livros el ON e.id = el.emprestimo_id
                WHERE e.status = 'ativo' AND e.data_devolucao_prevista < CURDATE()
                GROUP BY e.id
                ORDER BY e.data_devolucao_prevista ASC
            `);

            const emprestimosComLivros = await Promise.all(
                rows.map(async (row) => {
                    const [livros] = await db.execute(`
                        SELECT 
                            l.titulo as livro_titulo, 
                            l.imagem as livro_imagem, 
                            l.isbn as livro_isbn,
                            a.nome as autor_nome,
                            el.quantidade,
                            el.livro_id
                        FROM emprestimo_livros el
                        JOIN livros l ON el.livro_id = l.id
                        LEFT JOIN autores a ON l.autor_id = a.id
                        WHERE el.emprestimo_id = ?
                    `, [row.id]);

                    return {
                        ...new Emprestimo(row),
                        livros: livros,
                        total_livros: livros.length
                    };
                })
            );

            return emprestimosComLivros;
        } catch (error) {
            throw new Error(`Erro ao buscar empréstimos atrasados: ${error.message}`);
        }
    }

    async update(id, emprestimoData) {
        let connection;
        try {
            connection = await db.getConnection();
            await connection.beginTransaction();

            const emprestimo = new Emprestimo(emprestimoData);
            
            // Verificar se empréstimo existe
            const emprestimoExistente = await this.findById(id);
            if (!emprestimoExistente) {
                throw new Error('Empréstimo não encontrado');
            }

            // Atualizar dados básicos do empréstimo
            await connection.execute(
                'UPDATE emprestimos SET usuario_id = ?, usuario_tipo = ?, data_devolucao_prevista = ?, observacoes = ? WHERE id = ?',
                [emprestimo.usuario_id, emprestimo.usuario_tipo, emprestimo.data_devolucao_prevista, emprestimo.observacoes, id]
            );

            // Remover livros antigos e restaurar estoque
            const [livrosAntigos] = await connection.execute(
                'SELECT * FROM emprestimo_livros WHERE emprestimo_id = ?',
                [id]
            );

            for (const livroAntigo of livrosAntigos) {
                await connection.execute(
                    'UPDATE livros SET estoque = estoque + ? WHERE id = ?',
                    [livroAntigo.quantidade, livroAntigo.livro_id]
                );
            }

            // Deletar livros antigos
            await connection.execute(
                'DELETE FROM emprestimo_livros WHERE emprestimo_id = ?',
                [id]
            );

            // Adicionar novos livros e atualizar estoque
            for (const livro of emprestimo.livros) {
                // Verificar disponibilidade
                const [estoqueRows] = await connection.execute(
                    'SELECT estoque FROM livros WHERE id = ?',
                    [livro.livro_id]
                );

                if (estoqueRows.length === 0 || estoqueRows[0].estoque < (livro.quantidade || 1)) {
                    throw new Error(`Livro ID ${livro.livro_id} não disponível em quantidade suficiente`);
                }

                await connection.execute(
                    'INSERT INTO emprestimo_livros (emprestimo_id, livro_id, quantidade) VALUES (?, ?, ?)',
                    [id, livro.livro_id, livro.quantidade || 1]
                );

                await connection.execute(
                    'UPDATE livros SET estoque = estoque - ? WHERE id = ?',
                    [livro.quantidade || 1, livro.livro_id]
                );
            }

            await connection.commit();
            return this.findById(id);

        } catch (error) {
            if (connection) await connection.rollback();
            throw new Error(`Erro ao atualizar empréstimo: ${error.message}`);
        } finally {
            if (connection) connection.release();
        }
    }

    async delete(id) {
        let connection;
        try {
            connection = await db.getConnection();
            await connection.beginTransaction();

            // Buscar empréstimo e livros
            const emprestimo = await this.findById(id);
            if (!emprestimo) {
                throw new Error('Empréstimo não encontrado');
            }

            // Restaurar estoque dos livros (se empréstimo estava ativo)
            if (emprestimo.status === 'ativo') {
                for (const livro of emprestimo.livros) {
                    await connection.execute(
                        'UPDATE livros SET estoque = estoque + ? WHERE id = ?',
                        [livro.quantidade || 1, livro.livro_id]
                    );
                }
            }

            // Deletar livros do empréstimo
            await connection.execute(
                'DELETE FROM emprestimo_livros WHERE emprestimo_id = ?',
                [id]
            );

            // Deletar empréstimo
            const [result] = await connection.execute(
                'DELETE FROM emprestimos WHERE id = ?',
                [id]
            );

            await connection.commit();
            return result.affectedRows > 0;

        } catch (error) {
            if (connection) await connection.rollback();
            throw new Error(`Erro ao deletar empréstimo: ${error.message}`);
        } finally {
            if (connection) connection.release();
        }
    }

    async podeEditar(id) {
        try {
            const [rows] = await db.execute(
                'SELECT status FROM emprestimos WHERE id = ?',
                [id]
            );
            
            if (rows.length === 0) return false;
            
            // Permitir edição apenas se estiver ativo
            return rows[0].status === 'ativo';
        } catch (error) {
            throw new Error(`Erro ao verificar permissão de edição: ${error.message}`);
        }
    }

    async verificarDisponibilidadeLivro(livroId) {
        try {
            const [rows] = await db.execute(
                'SELECT estoque FROM livros WHERE id = ?',
                [livroId]
            );
            return rows.length > 0 ? rows[0].estoque > 0 : false;
        } catch (error) {
            throw new Error(`Erro ao verificar disponibilidade: ${error.message}`);
        }
    }
}

module.exports = new EmprestimosRepository();