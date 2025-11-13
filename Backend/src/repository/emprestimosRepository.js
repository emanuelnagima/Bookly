const db = require('../../config/database');
const Emprestimo = require('../models/emprestimo');

class EmprestimosRepository {
async findAll() {
    try {
        const [rows] = await db.execute(`
            SELECT 
                e.*,
                COUNT(el.livro_id) as total_livros,
                -- Dados completos do usuário
                CASE 
                    WHEN e.usuario_tipo = 'aluno' THEN (SELECT nome FROM alunos WHERE id = e.usuario_id)
                    WHEN e.usuario_tipo = 'professor' THEN (SELECT nome FROM professores WHERE id = e.usuario_id)
                    WHEN e.usuario_tipo = 'usuario_especial' THEN (SELECT nome_completo FROM usuarios_especiais WHERE id = e.usuario_id)
                END as usuario,  -- ← MANTENHA COMO 'usuario' PARA COMPATIBILIDADE
                CASE 
                    WHEN e.usuario_tipo = 'aluno' THEN (SELECT email FROM alunos WHERE id = e.usuario_id)
                    WHEN e.usuario_tipo = 'professor' THEN (SELECT email FROM professores WHERE id = e.usuario_id)
                    WHEN e.usuario_tipo = 'usuario_especial' THEN (SELECT email FROM usuarios_especiais WHERE id = e.usuario_id)
                END as usuario_email,
                CASE 
                    WHEN e.usuario_tipo = 'aluno' THEN (SELECT telefone FROM alunos WHERE id = e.usuario_id)
                    WHEN e.usuario_tipo = 'professor' THEN (SELECT telefone FROM professores WHERE id = e.usuario_id)
                    WHEN e.usuario_tipo = 'usuario_especial' THEN (SELECT telefone FROM usuarios_especiais WHERE id = e.usuario_id)
                END as usuario_telefone,
                -- Dados específicos por tipo
                CASE 
                    WHEN e.usuario_tipo = 'aluno' THEN (SELECT turma FROM alunos WHERE id = e.usuario_id)
                END as usuario_turma,
                CASE 
                    WHEN e.usuario_tipo = 'professor' THEN (SELECT departamento FROM professores WHERE id = e.usuario_id)
                END as usuario_departamento,
                CASE 
                    WHEN e.usuario_tipo = 'usuario_especial' THEN (SELECT tipo_usuario FROM usuarios_especiais WHERE id = e.usuario_id)
                END as usuario_tipo_especial
            FROM emprestimos e
            LEFT JOIN emprestimo_livros el ON e.id = el.emprestimo_id
            GROUP BY e.id
            ORDER BY e.data_emprestimo DESC
        `);

        // Para cada empréstimo, buscar os livros
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

                const resultado = {
                    ...new Emprestimo(row),
                    livros: livros,
                    total_livros: livros.length,
                    // Adicionar dados completos do usuário
                    usuario_detalhes: {
                        nome: row.usuario,  // ← AGORA USA O CAMPO 'usuario'
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

        return emprestimosComLivros;
    } catch (error) {
        throw new Error(`Erro ao buscar empréstimos: ${error.message}`);
    }
}
async findById(id) {
    try {
        // Buscar dados básicos do empréstimo com todos os dados do usuário
        const [emprestimoRows] = await db.execute(`
            SELECT e.*,
                   CASE 
                       WHEN e.usuario_tipo = 'aluno' THEN (SELECT nome FROM alunos WHERE id = e.usuario_id)
                       WHEN e.usuario_tipo = 'professor' THEN (SELECT nome FROM professores WHERE id = e.usuario_id)
                       WHEN e.usuario_tipo = 'usuario_especial' THEN (SELECT nome_completo FROM usuarios_especiais WHERE id = e.usuario_id)
                   END as usuario,  -- ← MANTENHA COMO 'usuario'
                   CASE 
                       WHEN e.usuario_tipo = 'aluno' THEN (SELECT email FROM alunos WHERE id = e.usuario_id)
                       WHEN e.usuario_tipo = 'professor' THEN (SELECT email FROM professores WHERE id = e.usuario_id)
                       WHEN e.usuario_tipo = 'usuario_especial' THEN (SELECT email FROM usuarios_especiais WHERE id = e.usuario_id)
                   END as usuario_email,
                   CASE 
                       WHEN e.usuario_tipo = 'aluno' THEN (SELECT telefone FROM alunos WHERE id = e.usuario_id)
                       WHEN e.usuario_tipo = 'professor' THEN (SELECT telefone FROM professores WHERE id = e.usuario_id)
                       WHEN e.usuario_tipo = 'usuario_especial' THEN (SELECT telefone FROM usuarios_especiais WHERE id = e.usuario_id)
                   END as usuario_telefone,
                   CASE 
                       WHEN e.usuario_tipo = 'aluno' THEN (SELECT turma FROM alunos WHERE id = e.usuario_id)
                   END as usuario_turma,
                   CASE 
                       WHEN e.usuario_tipo = 'professor' THEN (SELECT departamento FROM professores WHERE id = e.usuario_id)
                   END as usuario_departamento,
                   CASE 
                       WHEN e.usuario_tipo = 'usuario_especial' THEN (SELECT tipo_usuario FROM usuarios_especiais WHERE id = e.usuario_id)
                   END as usuario_tipo_especial
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
        emprestimo.usuario_detalhes = {
            nome: emprestimoRows[0].usuario,  // ← USA O CAMPO 'usuario'
            email: emprestimoRows[0].usuario_email,
            telefone: emprestimoRows[0].usuario_telefone,
            turma: emprestimoRows[0].usuario_turma,
            departamento: emprestimoRows[0].usuario_departamento,
            tipo_especial: emprestimoRows[0].usuario_tipo_especial
        };
        
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
        
        // **VERIFICAÇÃO POR DISPONIBILIDADE REAL**
        for (const livro of emprestimo.livros) {
            const livroId = livro.livro_id;
            const quantidadeSolicitada = livro.quantidade || 1;
            
            // 1. Verificar se livro existe
            const [livroRows] = await connection.execute(
                'SELECT id, titulo, estoque FROM livros WHERE id = ?',
                [livroId]
            );

            if (livroRows.length === 0) {
                throw new Error(`Livro ID ${livroId} não encontrado`);
            }

            const livroInfo = livroRows[0];

            // 2. Calcular estoque disponível (considerando empréstimos ativos)
            const [emprestimosAtivos] = await connection.execute(
                `SELECT SUM(el.quantidade) as total_emprestado
                 FROM emprestimo_livros el
                 JOIN emprestimos e ON el.emprestimo_id = e.id
                 WHERE el.livro_id = ? AND e.status = 'ativo'`,
                [livroId]
            );

            const totalEmprestado = emprestimosAtivos[0].total_emprestado || 0;
            
            // Calcular estoque REALMENTE disponível
            const estoqueDisponivel = livroInfo.estoque - totalEmprestado;

            // Usar estoqueDisponivel em vez de livroInfo.estoque
            if (quantidadeSolicitada > estoqueDisponivel) {
                throw new Error(`Estoque disponível insuficiente para "${livroInfo.titulo}". Disponível: ${estoqueDisponivel}, Solicitado: ${quantidadeSolicitada}`);
            }

            // 4. VALIDAÇÃO: Quantidade mínima
            if (quantidadeSolicitada < 1) {
                throw new Error(`Quantidade inválida para "${livroInfo.titulo}". Mínimo: 1`);
            }
        }

        // Inserir empréstimo
        const [result] = await connection.execute(
            'INSERT INTO emprestimos (usuario_id, usuario_tipo, data_devolucao_prevista, observacoes) VALUES (?, ?, ?, ?)',
            [emprestimo.usuario_id, emprestimo.usuario_tipo, emprestimo.data_devolucao_prevista, emprestimo.observacoes]
        );

        const emprestimoId = result.insertId;

        // **REMOVER A ATUALIZAÇÃO DE ESTOQUE FÍSICO - SÓ DEVE ATUALIZAR NA ENTRADA/SAÍDA**
        for (const livro of emprestimo.livros) {
            const livroId = livro.livro_id;
            const quantidade = livro.quantidade || 1;
            
            // Vincular ao empréstimo (APENAS ISSO)
            await connection.execute(
                'INSERT INTO emprestimo_livros (emprestimo_id, livro_id, quantidade) VALUES (?, ?, ?)',
                [emprestimoId, livroId, quantidade]
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
async verificarDisponibilidadeComQuantidade(livroId, quantidade = 1) {
    try {
        const diagnostico = await this.diagnosticarEstoque(livroId);
        
        return {
            disponivel: diagnostico.disponivel >= quantidade,
            estoqueFisico: diagnostico.estoqueFisico,
            totalEmprestado: diagnostico.totalEmprestado,
            disponivelExato: diagnostico.disponivel,
            podeEmprestar: diagnostico.disponivel >= quantidade
        };
    } catch (error) {
        throw new Error(`Erro ao verificar disponibilidade: ${error.message}`);
    }
}
async diagnosticarEstoque(livroId) {
    try {
        // 1. Estoque físico
        const [estoqueRows] = await db.execute(
            'SELECT id, titulo, estoque FROM livros WHERE id = ?',
            [livroId]
        );
        
        // 2. Empréstimos ativos detalhados
        const [emprestimosAtivos] = await db.execute(`
            SELECT 
                e.id as emprestimo_id,
                el.quantidade,
                e.usuario_id,
                e.usuario_tipo,
                e.data_devolucao_prevista
            FROM emprestimo_livros el
            JOIN emprestimos e ON el.emprestimo_id = e.id
            WHERE el.livro_id = ? AND e.status = 'ativo'
        `, [livroId]);
        
        const totalEmprestado = emprestimosAtivos.reduce((sum, emp) => sum + emp.quantidade, 0);        
        const disponivel = estoqueRows[0].estoque - totalEmprestado;

        return {
            estoqueFisico: estoqueRows[0].estoque,
            emprestimosAtivos: emprestimosAtivos,
            totalEmprestado: totalEmprestado,
            disponivel: disponivel
        };

    } catch (error) {
        throw error;
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

        await connection.execute(
            'UPDATE emprestimos SET status = "finalizado", data_devolucao_real = NOW() WHERE id = ?',
            [id]
        );

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
            WHERE e.status = 'atrasado'  // ← CORRIGIDO: buscar por 'atrasado'
            GROUP BY e.id
            ORDER BY e.data_devolucao_prevista ASC
        `);

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

        // **REMOVER RESTAURAÇÃO DE ESTOQUE - SÓ DEVE SER FEITO NA ENTRADA/SAÍDA**
        // if (emprestimo.status === 'ativo') {
        //     for (const livro of emprestimo.livros) {
        //         await connection.execute(
        //             'UPDATE livros SET estoque = estoque + ? WHERE id = ?',
        //             [livro.quantidade || 1, livro.livro_id]
        //         );
        //     }
        // }

        // ... resto do código ...
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
async atualizarStatusAtrasados() {
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();


        // 1. Atualizar para 'atrasado' onde está ativo e data passou
        const [resultAtrasados] = await connection.execute(
            `UPDATE emprestimos 
             SET status = 'atrasado' 
             WHERE status = 'ativo' 
             AND data_devolucao_prevista < CURDATE()`
        );

        // 2. Reverter para 'ativo' onde está atrasado mas data foi renovada
        const [resultAtivos] = await connection.execute(
            `UPDATE emprestimos 
             SET status = 'ativo' 
             WHERE status = 'atrasado' 
             AND data_devolucao_prevista >= CURDATE()`
        );
        await connection.commit();
        
        return {
            success: true,
            atrasados: resultAtrasados.affectedRows,
            ativos: resultAtivos.affectedRows,
            message: `Status atualizados: ${resultAtrasados.affectedRows} atrasados, ${resultAtivos.affectedRows} ativos`
        };

    } catch (error) {
        if (connection) await connection.rollback();
        throw new Error(`Erro ao atualizar status: ${error.message}`);
    } finally {
        if (connection) connection.release();
    }
}
}

module.exports = new EmprestimosRepository();