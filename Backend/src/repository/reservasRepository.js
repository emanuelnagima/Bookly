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
        connection = await db.getConnection();
        await connection.beginTransaction();

        const reserva = new Reserva(reservaData);
        
        if (!reserva.livros || reserva.livros.length === 0) {
            throw {
                type: 'sem_livros',
                message: 'Nenhum livro foi informado para a reserva'
            };
        }

        console.log(`Criando reserva para ${reserva.livros.length} livro(s)...`);

        // **VALIDAÇÃO 1: Verificar disponibilidade para TODOS os livros**
        for (const livroItem of reserva.livros) {
            const livroId = livroItem.livro_id;
            const quantidadeSolicitada = livroItem.quantidade || 1;

            console.log(`Validando livro ID ${livroId}, quantidade: ${quantidadeSolicitada}`);

            // Verificar se livro existe
            const [livroRows] = await connection.execute(
                'SELECT id, titulo, estoque FROM livros WHERE id = ?',
                [livroId]
            );

            if (livroRows.length === 0) {
                throw {
                    type: 'livro_nao_encontrado',
                    message: `Livro ID ${livroId} não encontrado`
                };
            }

            const livroInfo = livroRows[0];

            // **CALCULAR DISPONIBILIDADE REAL**
            // Estoque físico
            const estoqueFisico = livroInfo.estoque || 0;

            // Empréstimos ativos
            const [emprestimosAtivos] = await connection.execute(
                `SELECT COALESCE(SUM(el.quantidade), 0) as total_emprestado
                 FROM emprestimo_livros el
                 JOIN emprestimos e ON el.emprestimo_id = e.id
                 WHERE el.livro_id = ? 
                 AND e.status IN ('ativo', 'atrasado')`,
                [livroId]
            );
            
            const totalEmprestado = Number(emprestimosAtivos[0].total_emprestado) || 0;

            // Reservas ativas (excluindo possíveis do próprio usuário para conversão)
            const [reservasAtivas] = await connection.execute(
                `SELECT COALESCE(SUM(rl.quantidade), 0) as total_reservado
                 FROM reserva_livros rl
                 JOIN reservas r ON rl.reserva_id = r.id
                 WHERE rl.livro_id = ? 
                 AND r.status = 'ativa'
                 AND r.data_validade >= CURDATE()
                 AND NOT (r.usuario_id = ? AND r.usuario_tipo = ?)`, // Excluir do próprio usuário
                [livroId, reserva.usuario_id, reserva.usuario_tipo]
            );
            
            const totalReservado = Number(reservasAtivas[0].total_reservado) || 0;

            // Calcular disponibilidade REAL
            const disponivelReal = estoqueFisico - totalEmprestado - totalReservado;

            console.log(`Disponibilidade livro ${livroId}: 
              Estoque: ${estoqueFisico}
              Emprestados: ${totalEmprestado}
              Reservados: ${totalReservado}
              Disponível: ${disponivelReal}
              Solicitado: ${quantidadeSolicitada}`);

            // Verificar se há estoque disponível REAL
            if (disponivelReal < quantidadeSolicitada) {
                let situacaoDetalhada = '';
                
                if (totalEmprestado > 0 && totalReservado > 0) {
                    situacaoDetalhada = `Todos os ${estoqueFisico} exemplares estão em uso: ${totalEmprestado} emprestado(s) e ${totalReservado} reservado(s)`;
                } else if (totalEmprestado > 0) {
                    situacaoDetalhada = `${totalEmprestado} exemplar(es) emprestado(s). Disponível: ${disponivelReal}`;
                } else if (totalReservado > 0) {
                    situacaoDetalhada = `${totalReservado} exemplar(es) reservado(s). Disponível: ${disponivelReal}`; 
                } else {
                    situacaoDetalhada = `Estoque insuficiente. Disponível: ${disponivelReal}`;
                }
                
                throw {
                    type: 'estoque_insuficiente',
                    title: 'Livro Indisponível',
                    message: `Não é possível reservar "${livroInfo.titulo}"`,
                    situacao: situacaoDetalhada,
                    disponivel: disponivelReal,
                    estoqueFisico: estoqueFisico,
                    emprestadosAtivos: totalEmprestado,
                    reservadosAtivos: totalReservado,
                    livro: livroInfo.titulo,
                    solicitado: quantidadeSolicitada
                };
            }

            // **VALIDAÇÃO 2: Verificar reserva duplicada para ESTE livro específico**
            console.log(`Verificando reservas existentes para usuário ${reserva.usuario_id}, livro ${livroId}`);
            
            const [reservasExistentes] = await connection.execute(
                `SELECT r.id, r.status, r.data_validade
                 FROM reservas r
                 JOIN reserva_livros rl ON r.id = rl.reserva_id
                 WHERE r.usuario_id = ? 
                 AND r.usuario_tipo = ? 
                 AND rl.livro_id = ? 
                 AND r.status = 'ativa'
                 AND r.data_validade >= CURDATE()`,
                [reserva.usuario_id, reserva.usuario_tipo, livroId] // CORRETO: usar livroId do loop atual
            );

            if (reservasExistentes.length > 0) {
                const reservaExistente = reservasExistentes[0];
                const dataValidadeFormatada = new Date(reservaExistente.data_validade)
                    .toLocaleDateString('pt-BR');
                
                throw {
                    type: 'reserva_duplicada',
                    title: 'Reserva Duplicada',
                    message: `Você já possui uma reserva ativa para "${livroInfo.titulo}"`,
                    detalhe: `Validade: ${dataValidadeFormatada}. Cada usuário pode ter apenas uma reserva ativa por livro.`,
                    livro: livroInfo.titulo,
                    validade: dataValidadeFormatada
                };
            }
        }

        // **INSERIR RESERVA PRINCIPAL**
        // Usar o primeiro livro como referência principal (para compatibilidade com estrutura existente)
        const primeiroLivroId = reserva.livros[0].livro_id;
        
        // Calcular data de validade (padrão: 7 dias)
        let dataValidade = reserva.data_validade;
        if (!dataValidade) {
            const hoje = new Date();
            hoje.setDate(hoje.getDate() + 7);
            dataValidade = hoje.toISOString().split('T')[0];
        }

        console.log('Inserindo reserva principal...');
        const [result] = await connection.execute(
            `INSERT INTO reservas 
             (usuario_id, usuario_tipo, livro_id, data_validade, observacoes, status) 
             VALUES (?, ?, ?, ?, ?, 'ativa')`,
            [
                reserva.usuario_id,
                reserva.usuario_tipo,
                primeiroLivroId, // livro_id principal
                dataValidade,
                reserva.observacoes || ''
            ]
        );

        const reservaId = result.insertId;
        console.log(`Reserva criada com ID: ${reservaId}`);

        // **INSERIR LIVROS NA TABELA reserva_livros**
        console.log('Inserindo livros na tabela reserva_livros...');
        for (const livroItem of reserva.livros) {
            await connection.execute(
                `INSERT INTO reserva_livros 
                 (reserva_id, livro_id, quantidade) 
                 VALUES (?, ?, ?)`,
                [reservaId, livroItem.livro_id, livroItem.quantidade || 1]
            );
            console.log(`Livro ${livroItem.livro_id} adicionado à reserva`);
        }

        await connection.commit();
        console.log('Reserva criada com sucesso!');
        
        // Retornar reserva completa
        return await this.findById(reservaId);

    } catch (error) {
        console.error('=== ERRO AO CRIAR RESERVA ===');
        console.error('Tipo de erro:', error.type || 'desconhecido');
        console.error('Mensagem:', error.message);
        
        if (connection) {
            console.log('Realizando rollback...');
            await connection.rollback();
        }
        
        // Se já for objeto estruturado, repassa para o controller
        if (error.type && error.title) {
            throw error;
        }
        
        // Converter erro genérico para estruturado
        throw {
            type: 'erro_geral',
            title: 'Erro na Reserva',
            message: error.message || 'Erro desconhecido ao criar reserva'
        };
    } finally {
        if (connection) {
            connection.release();
        }
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

        // ** Usar primeiro livro como livro_id obrigatório**
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
            WHERE 
                r.status = 'ativa'
                AND r.data_validade < CURDATE()
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