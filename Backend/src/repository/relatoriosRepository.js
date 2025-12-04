const db = require('../../config/database');

class RelatoriosRepository {
  
  // Métodos para buscar filtros dinamicamente do banco
  async getDepartamentosProfessores() {
    try {
      const query = `SELECT DISTINCT departamento FROM professores WHERE departamento IS NOT NULL AND departamento != '' ORDER BY departamento`;
      const [rows] = await db.execute(query);
      return rows.map(row => row.departamento);
    } catch (error) {
      console.error('Erro ao buscar departamentos:', error);
      return [];
    }
  }

  async getTurmasAlunos() {
    try {
      const query = `SELECT DISTINCT turma FROM alunos WHERE turma IS NOT NULL AND turma != '' ORDER BY turma`;
      const [rows] = await db.execute(query);
      return rows.map(row => row.turma);
    } catch (error) {
      console.error('Erro ao buscar turmas:', error);
      return [];
    }
  }

  async getTiposUsuariosEspeciais() {
    try {
      const query = `SELECT DISTINCT tipo_usuario FROM usuarios_especiais WHERE tipo_usuario IS NOT NULL AND tipo_usuario != '' ORDER BY tipo_usuario`;
      const [rows] = await db.execute(query);
      return rows.map(row => row.tipo_usuario);
    } catch (error) {
      console.error('Erro ao buscar tipos de usuários:', error);
      return [];
    }
  }

  async getNacionalidadesAutores() {
    try {
      const query = `SELECT DISTINCT nacionalidade FROM autores WHERE nacionalidade IS NOT NULL AND nacionalidade != '' ORDER BY nacionalidade`;
      const [rows] = await db.execute(query);
      return rows.map(row => row.nacionalidade);
    } catch (error) {
      console.error('Erro ao buscar nacionalidades:', error);
      return [];
    }
  }

  async getGenerosLivros() {
    try {
      const query = `SELECT DISTINCT genero FROM livros WHERE genero IS NOT NULL AND genero != '' ORDER BY genero`;
      const [rows] = await db.execute(query);
      return rows.map(row => row.genero);
    } catch (error) {
      console.error('Erro ao buscar gêneros:', error);
      return [];
    }
  }


  async getRelatorioEmprestimos(filtros = {}) {
    try {
        // Query corrigida usando LEFT JOIN e subquery para livros
        let query = `
            SELECT 
                e.id,
                e.data_emprestimo,
                e.data_devolucao_prevista,
                e.data_devolucao_real,
                e.status,
                e.usuario_tipo,
                e.data_cancelamento,
                e.motivo_cancelamento,
                COALESCE(
                    (SELECT GROUP_CONCAT(DISTINCT l.titulo SEPARATOR ', ') 
                     FROM emprestimo_livros el 
                     JOIN livros l ON el.livro_id = l.id 
                     WHERE el.emprestimo_id = e.id),
                    'Livro não registrado'
                ) as livro,
                CASE 
                    WHEN e.usuario_tipo = 'aluno' THEN (SELECT nome FROM alunos WHERE id = e.usuario_id)
                    WHEN e.usuario_tipo = 'professor' THEN (SELECT nome FROM professores WHERE id = e.usuario_id)
                    WHEN e.usuario_tipo = 'usuario_especial' THEN (SELECT nome_completo FROM usuarios_especiais WHERE id = e.usuario_id)
                    ELSE 'Não identificado'
                END as usuario,
                e.usuario_id,
                -- CAMPO CALCULADO: mantém o status existente
                CASE 
                    WHEN e.status = 'ativo' AND e.data_devolucao_prevista < CURDATE() THEN 'atrasado'
                    ELSE e.status
                END as status_calculado
            FROM emprestimos e
            WHERE 1=1
        `;
        
        const params = [];

        // Filtros de data (mantenha como estava)
        if (filtros.dataInicio && !filtros.dataFim) {
            query += ' AND DATE(e.data_emprestimo) = ?';
            params.push(filtros.dataInicio);
        } 
        else if (filtros.dataInicio && filtros.dataFim) {
            query += ' AND e.data_emprestimo >= ? AND e.data_emprestimo <= ?';
            params.push(filtros.dataInicio, filtros.dataFim + ' 23:59:59');
        }
        else if (!filtros.dataInicio && filtros.dataFim) {
            query += ' AND DATE(e.data_emprestimo) = ?';
            params.push(filtros.dataFim);
        }

        // Filtro de status
        if (filtros.status) {
            if (filtros.status === 'atrasado') {
                // Inclui tanto os marcados como 'atrasado' quanto os 'ativos' com data vencida
                query += ' AND (e.status = "atrasado" OR (e.status = "ativo" AND e.data_devolucao_prevista < CURDATE()))';
            } else if (filtros.status === 'cancelado') {
                query += ' AND e.status = "cancelado"';
            } else {
                query += ' AND e.status = ?';
                params.push(filtros.status);
            }
        }

        if (filtros.usuario_tipo) {
            query += ' AND e.usuario_tipo = ?';
            params.push(filtros.usuario_tipo);
        }

        // Filtro por nome do usuário
        if (filtros.nome_usuario) {
            query += ` AND (
                (e.usuario_tipo = 'aluno' AND EXISTS (SELECT 1 FROM alunos WHERE id = e.usuario_id AND nome LIKE ?)) OR
                (e.usuario_tipo = 'professor' AND EXISTS (SELECT 1 FROM professores WHERE id = e.usuario_id AND nome LIKE ?)) OR
                (e.usuario_tipo = 'usuario_especial' AND EXISTS (SELECT 1 FROM usuarios_especiais WHERE id = e.usuario_id AND nome_completo LIKE ?))
            )`;
            params.push(`%${filtros.nome_usuario}%`, `%${filtros.nome_usuario}%`, `%${filtros.nome_usuario}%`);
        }

        query += ' ORDER BY e.data_emprestimo DESC LIMIT 1000';
        
        console.log('Query corrigida:', query);
        console.log('Parâmetros:', params);
        
        const [rows] = await db.execute(query, params);
        
        console.log('Total de resultados encontrados:', rows.length);
        
        // Atualizar o status nos dados retornados
        const rowsAtualizados = rows.map(row => ({
            ...row,
            status: row.status_calculado || row.status
        }));
        
        return rowsAtualizados;
    } catch (error) {
        console.error('Erro na query corrigida:', error);
        throw new Error(`Erro ao buscar relatório de empréstimos: ${error.message}`);
    }
}
  
  async getRelatorioEntradas(filtros = {}) {
    try {
      let query = `
        SELECT 
          e.id,
          e.quantidade,
          e.origem,
          e.observacoes,
          e.data_aquisicao,
          l.titulo,
          l.id as livro_id,
          a.nome as autor_nome
        FROM entradas e
        JOIN livros l ON e.livro_id = l.id
        LEFT JOIN autores a ON l.autor_id = a.id
        WHERE 1=1
      `;
      
      const params = [];

      // Filtros de data
      if (filtros.dataInicio && !filtros.dataFim) {
        query += ' AND DATE(e.data_aquisicao) = ?';
        params.push(filtros.dataInicio);
      } 
      else if (filtros.dataInicio && filtros.dataFim) {
        query += ' AND e.data_aquisicao >= ? AND e.data_aquisicao <= ?';
        params.push(filtros.dataInicio, filtros.dataFim + ' 23:59:59');
      }
      else if (!filtros.dataInicio && filtros.dataFim) {
        query += ' AND DATE(e.data_aquisicao) = ?';
        params.push(filtros.dataFim);
      }

      // Filtro de origem
      if (filtros.origem) {
        query += ' AND e.origem = ?';
        params.push(filtros.origem);
      }

      // NOVO: Filtro por título do livro
      if (filtros.titulo_livro) {
        query += ' AND l.titulo LIKE ?';
        params.push(`%${filtros.titulo_livro}%`);
      }

      // NOVO: Filtro por autor
      if (filtros.autor_livro) {
        query += ' AND a.nome LIKE ?';
        params.push(`%${filtros.autor_livro}%`);
      }

      query += ' ORDER BY e.data_aquisicao DESC LIMIT 1000';

      const [rows] = await db.execute(query, params);
      return rows;
    } catch (error) {
      throw new Error(`Erro ao buscar relatório de entradas: ${error.message}`);
    }
  }

  async getRelatorioSaidas(filtros = {}) {
    try {
      let query = `
        SELECT 
          s.id,
          s.quantidade,
          s.origem,
          s.observacoes,
          s.data_saida,
          l.titulo,
          l.id as livro_id,
          a.nome as autor_nome
        FROM saidas s
        JOIN livros l ON s.livro_id = l.id
        LEFT JOIN autores a ON l.autor_id = a.id
        WHERE 1=1
      `;
        
      const params = [];

      // Filtros de data
      if (filtros.dataInicio && !filtros.dataFim) {
        query += ' AND DATE(s.data_saida) = ?';
        params.push(filtros.dataInicio);
      } 
      else if (filtros.dataInicio && filtros.dataFim) {
        query += ' AND s.data_saida >= ? AND s.data_saida <= ?';
        params.push(filtros.dataInicio, filtros.dataFim + ' 23:59:59');
      }
      else if (!filtros.dataInicio && filtros.dataFim) {
        query += ' AND DATE(s.data_saida) = ?';
        params.push(filtros.dataFim);
      }

      // Filtro de origem
      if (filtros.origem) {
        query += ' AND s.origem = ?';
        params.push(filtros.origem);
      }

      // NOVO: Filtro por título do livro
      if (filtros.titulo_livro) {
        query += ' AND l.titulo LIKE ?';
        params.push(`%${filtros.titulo_livro}%`);
      }

      // NOVO: Filtro por autor
      if (filtros.autor_livro) {
        query += ' AND a.nome LIKE ?';
        params.push(`%${filtros.autor_livro}%`);
      }

      query += ' ORDER BY s.data_saida DESC LIMIT 1000';

      const [rows] = await db.execute(query, params);
      return rows;
    } catch (error) {
      throw new Error(`Erro ao buscar relatório de saídas: ${error.message}`);
    }
  }

  async getLivrosPorTitulo(titulo) {
    try {
      const query = `SELECT id, titulo FROM livros WHERE titulo LIKE ? ORDER BY titulo LIMIT 50`;
      const [rows] = await db.execute(query, [`%${titulo}%`]);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar livros por título:', error);
      return [];
    }
  }

  async getLivrosPorAutor(autor) {
    try {
      const query = `
        SELECT l.id, l.titulo, a.nome as autor 
        FROM livros l 
        LEFT JOIN autores a ON l.autor_id = a.id 
        WHERE a.nome LIKE ? 
        ORDER BY a.nome, l.titulo 
        LIMIT 50
      `;
      const [rows] = await db.execute(query, [`%${autor}%`]);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar livros por autor:', error);
      return [];
    }
  }

  async getRelatorioCadastros(filtros = {}) {
    try {      
      let query = `
        SELECT 
          l.id,
          l.titulo,
          l.isbn,
          l.genero,
          l.ano_publicacao as ano,
          l.estoque,
          l.data_cadastro,
          a.nome as autor,
          e.nome as editora
        FROM livros l
        LEFT JOIN autores a ON l.autor_id = a.id
        LEFT JOIN editoras e ON l.editora_id = e.id
        WHERE 1=1
      `;
      
      const params = [];

      // Filtros de data
      if (filtros.dataInicio && !filtros.dataFim) {
        query += ' AND DATE(l.data_cadastro) = ?';
        params.push(filtros.dataInicio);
      } 
      else if (filtros.dataInicio && filtros.dataFim) {
        query += ' AND l.data_cadastro >= ? AND l.data_cadastro <= ?';
        params.push(filtros.dataInicio, filtros.dataFim + ' 23:59:59');
      }
      else if (!filtros.dataInicio && filtros.dataFim) {
        query += ' AND DATE(l.data_cadastro) = ?';
        params.push(filtros.dataFim);
      }

      // Filtro de gênero
      if (filtros.genero) {
        query += ' AND l.genero = ?';
        params.push(filtros.genero);
      }

      // NOVO: Filtro por título do livro
      if (filtros.titulo_livro) {
        query += ' AND l.titulo LIKE ?';
        params.push(`%${filtros.titulo_livro}%`);
      }

      // NOVO: Filtro por autor
      if (filtros.autor_livro) {
        query += ' AND a.nome LIKE ?';
        params.push(`%${filtros.autor_livro}%`);
      }

      query += ' ORDER BY l.titulo LIMIT 1000';

      console.log('Query Cadastros executada:', query);
      console.log('Parâmetros:', params);

      const [rows] = await db.execute(query, params);
      
      console.log(`Retornando ${rows.length} livros`);
      
      return rows;
    } catch (error) {
      console.error('Erro no relatório de cadastros:', error);
      throw new Error(`Erro ao buscar relatório de cadastros: ${error.message}`);
    }
  }

async getRelatorioReservas(filtros = {}) {
    try {
        let query = `
            SELECT 
                r.id,
                r.data_reserva,
                r.data_validade,
                r.status,
                r.usuario_tipo,
                -- PRIORIDADE: primeiro busca do reserva_livros, depois da própria reserva
                COALESCE(
                    (SELECT GROUP_CONCAT(DISTINCT l.titulo SEPARATOR ', ') 
                     FROM reserva_livros rl 
                     JOIN livros l ON rl.livro_id = l.id 
                     WHERE rl.reserva_id = r.id),
                    (SELECT titulo FROM livros WHERE id = r.livro_id),
                    'Sem livro informado'
                ) as livro,
                CASE 
                    WHEN r.usuario_tipo = 'aluno' THEN (SELECT nome FROM alunos WHERE id = r.usuario_id)
                    WHEN r.usuario_tipo = 'professor' THEN (SELECT nome FROM professores WHERE id = r.usuario_id)
                    WHEN r.usuario_tipo = 'usuario_especial' THEN (SELECT nome_completo FROM usuarios_especiais WHERE id = r.usuario_id)
                    ELSE 'Não identificado'
                END as usuario,
                r.usuario_id,
                -- CAMPO CALCULADO: verifica se está expirada
                CASE 
                    WHEN r.status = 'ativa' AND r.data_validade < CURDATE() THEN 'expirada'
                    ELSE r.status
                END as status_calculado
            FROM reservas r
            WHERE 1=1
        `;
        
        const params = [];

        if (filtros.dataInicio && !filtros.dataFim) {
            query += ' AND DATE(r.data_reserva) = ?';
            params.push(filtros.dataInicio);
        } 
        else if (filtros.dataInicio && filtros.dataFim) {
            query += ' AND r.data_reserva >= ? AND r.data_reserva <= ?';
            params.push(filtros.dataInicio, filtros.dataFim + ' 23:59:59');
        }
        else if (!filtros.dataInicio && filtros.dataFim) {
            query += ' AND DATE(r.data_reserva) = ?';
            params.push(filtros.dataFim);
        }

        // MODIFICAÇÃO AQUI: Filtrar por status_calculado também
        if (filtros.status) {
            if (filtros.status === 'expirada') {
                // Incluir tanto os marcados como 'expirada' no banco quanto os 'ativas' com data vencida
                query += ' AND (r.status = "expirada" OR (r.status = "ativa" AND r.data_validade < CURDATE()))';
            } else {
                query += ' AND r.status = ?';
                params.push(filtros.status);
            }
        }

        // Filtro por nome do usuário
        if (filtros.nome_usuario) {
            query += ` AND (
                (r.usuario_tipo = 'aluno' AND EXISTS (SELECT 1 FROM alunos WHERE id = r.usuario_id AND nome LIKE ?)) OR
                (r.usuario_tipo = 'professor' AND EXISTS (SELECT 1 FROM professores WHERE id = r.usuario_id AND nome LIKE ?)) OR
                (r.usuario_tipo = 'usuario_especial' AND EXISTS (SELECT 1 FROM usuarios_especiais WHERE id = r.usuario_id AND nome_completo LIKE ?))
            )`;
            params.push(`%${filtros.nome_usuario}%`, `%${filtros.nome_usuario}%`, `%${filtros.nome_usuario}%`);
        }

        query += ' ORDER BY r.data_reserva DESC LIMIT 1000';

        console.log('Query Reservas com cálculo de expirada:', query);
        console.log('Parâmetros:', params);

        const [rows] = await db.execute(query, params);
        
        // Atualizar o status nos dados retornados para usar o status_calculado
        const rowsAtualizados = rows.map(row => ({
            ...row,
            status: row.status_calculado || row.status
        }));
        
        console.log(`Retornando ${rowsAtualizados.length} reservas (filtro status: ${filtros.status || 'todos'})`);
        
        return rowsAtualizados;
    } catch (error) {
        console.error('Erro detalhado no relatório de reservas:', error);
        throw new Error(`Erro ao buscar relatório de reservas: ${error.message}`);
    }
}

  async getRelatorioProfessores(filtros = {}) {
    try {
      let query = `
        SELECT 
          p.id,
          p.nome,
          p.departamento,
          p.email,
          p.telefone,
          p.data_cadastro
        FROM professores p
        WHERE 1=1
      `;
      
      const params = [];

      if (filtros.dataInicio && !filtros.dataFim) {
        query += ' AND DATE(p.data_cadastro) = ?';
        params.push(filtros.dataInicio);
      } 
      else if (filtros.dataInicio && filtros.dataFim) {
        query += ' AND p.data_cadastro >= ? AND p.data_cadastro <= ?';
        params.push(filtros.dataInicio, filtros.dataFim + ' 23:59:59');
      }
      else if (!filtros.dataInicio && filtros.dataFim) {
        query += ' AND DATE(p.data_cadastro) = ?';
        params.push(filtros.dataFim);
      }

      if (filtros.departamento) {
        query += ' AND p.departamento = ?';
        params.push(filtros.departamento);
      }

      query += ' ORDER BY p.data_cadastro DESC, p.nome LIMIT 1000';

      console.log('Query Professores:', query, params);
      const [rows] = await db.execute(query, params);
      return rows;
    } catch (error) {
      console.error('Erro detalhado no relatório de professores:', error);
      throw new Error(`Erro ao buscar relatório de professores: ${error.message}`);
    }
  }

  async getRelatorioAlunos(filtros = {}) {
    try {
      let query = `
        SELECT 
          a.id,
          a.nome,
          a.matricula,
          a.turma,
          a.email,
          a.telefone,
          a.data_cadastro
        FROM alunos a
        WHERE 1=1
      `;
      
      const params = [];

      if (filtros.dataInicio && !filtros.dataFim) {
        query += ' AND DATE(a.data_cadastro) = ?';
        params.push(filtros.dataInicio);
      } 
      else if (filtros.dataInicio && filtros.dataFim) {
        query += ' AND a.data_cadastro >= ? AND a.data_cadastro <= ?';
        params.push(filtros.dataInicio, filtros.dataFim + ' 23:59:59');
      }
      else if (!filtros.dataInicio && filtros.dataFim) {
        query += ' AND DATE(a.data_cadastro) = ?';
        params.push(filtros.dataFim);
      }

      if (filtros.turma) {
        query += ' AND a.turma = ?';
        params.push(filtros.turma);
      }

      query += ' ORDER BY a.data_cadastro DESC, a.nome LIMIT 1000';

      console.log('Query Alunos:', query, params);
      const [rows] = await db.execute(query, params);
      return rows;
    } catch (error) {
      console.error('Erro detalhado no relatório de alunos:', error);
      throw new Error(`Erro ao buscar relatório de alunos: ${error.message}`);
    }
  }

  async getRelatorioUsuariosEspeciais(filtros = {}) {
    try {
      let query = `
        SELECT 
          ue.id,
          ue.nome_completo as nome,
          ue.tipo_usuario as tipo,
          ue.cpf,
          ue.email,
          ue.telefone,
          ue.data_cadastro
        FROM usuarios_especiais ue
        WHERE 1=1
      `;
      
      const params = [];

      if (filtros.dataInicio && !filtros.dataFim) {
        query += ' AND DATE(ue.data_cadastro) = ?';
        params.push(filtros.dataInicio);
      } 
      else if (filtros.dataInicio && filtros.dataFim) {
        query += ' AND ue.data_cadastro >= ? AND ue.data_cadastro <= ?';
        params.push(filtros.dataInicio, filtros.dataFim + ' 23:59:59');
      }
      else if (!filtros.dataInicio && filtros.dataFim) {
        query += ' AND DATE(ue.data_cadastro) = ?';
        params.push(filtros.dataFim);
      }

      if (filtros.tipo_usuario) {
        query += ' AND ue.tipo_usuario = ?';
        params.push(filtros.tipo_usuario);
      }

      query += ' ORDER BY ue.nome_completo LIMIT 1000';

      const [rows] = await db.execute(query, params);
      return rows;
    } catch (error) {
      console.error('Erro detalhado no relatório de usuários especiais:', error);
      throw new Error(`Erro ao buscar relatório de usuários especiais: ${error.message}`);
    }
  }

  async getRelatorioEditoras(filtros = {}) {
    try {
      let query = `
        SELECT 
          e.id,
          e.nome,
          e.cnpj,
          e.email,
          e.telefone,
          e.data_cadastro
        FROM editoras e
        WHERE 1=1
      `;
      
      const params = [];

      if (filtros.dataInicio && !filtros.dataFim) {
        query += ' AND DATE(e.data_cadastro) = ?';
        params.push(filtros.dataInicio);
      } 
      else if (filtros.dataInicio && filtros.dataFim) {
        query += ' AND e.data_cadastro >= ? AND e.data_cadastro <= ?';
        params.push(filtros.dataInicio, filtros.dataFim + ' 23:59:59');
      }
      else if (!filtros.dataInicio && filtros.dataFim) {
        query += ' AND DATE(e.data_cadastro) = ?';
        params.push(filtros.dataFim);
      }

      query += ' ORDER BY e.data_cadastro DESC, e.nome LIMIT 1000';

      console.log('Query Editoras:', query, params);
      const [rows] = await db.execute(query, params);
      return rows;
    } catch (error) {
      throw new Error(`Erro ao buscar relatório de editoras: ${error.message}`);
    }
  }

  async getRelatorioAutores(filtros = {}) {
    try {
      let query = `
        SELECT 
          a.id,
          a.nome,
          a.nacionalidade,
          a.data_nascimento,
          a.data_cadastro
        FROM autores a
        WHERE 1=1
      `;
      
      const params = [];

      if (filtros.dataInicio && !filtros.dataFim) {
        query += ' AND DATE(a.data_cadastro) = ?';
        params.push(filtros.dataInicio);
      } 
      else if (filtros.dataInicio && filtros.dataFim) {
        query += ' AND a.data_cadastro >= ? AND a.data_cadastro <= ?';
        params.push(filtros.dataInicio, filtros.dataFim + ' 23:59:59');
      }
      else if (!filtros.dataInicio && filtros.dataFim) {
        query += ' AND DATE(a.data_cadastro) = ?';
        params.push(filtros.dataFim);
      }

      if (filtros.nacionalidade) {
        query += ' AND a.nacionalidade = ?';
        params.push(filtros.nacionalidade);
      }

      query += ' ORDER BY a.data_cadastro DESC, a.nome LIMIT 1000';
      const [rows] = await db.execute(query, params);
      return rows;
    } catch (error) {
      console.error('Erro detalhado no relatório de autores:', error);
      throw new Error(`Erro ao buscar relatório de autores: ${error.message}`);
    }
  }

  async getUsuariosPorNome(tipoTabela, nome) {
    try {
      let query = '';
      let params = [`%${nome}%`];

      switch (tipoTabela) {
        case 'alunos':
          query = `SELECT id, nome FROM alunos WHERE nome LIKE ? ORDER BY nome LIMIT 50`;
          break;
        case 'professores':
          query = `SELECT id, nome FROM professores WHERE nome LIKE ? ORDER BY nome LIMIT 50`;
          break;
        case 'usuarios_especiais':
          query = `SELECT id, nome_completo as nome FROM usuarios_especiais WHERE nome_completo LIKE ? ORDER BY nome_completo LIMIT 50`;
          break;
        default:
          return [];
      }

      const [rows] = await db.execute(query, params);
      return rows;
    } catch (error) {
      console.error(`Erro ao buscar usuários por nome (${tipoTabela}):`, error);
      return [];
    }
  }


async getEstatisticasGerais() {
  try {
    // Query única com subqueries para melhor performance 
    const [result] = await db.execute(`
      SELECT 
        -- Usuários
        (SELECT COUNT(*) FROM alunos) as total_alunos,
        (SELECT COUNT(*) FROM professores) as total_professores,
        (SELECT COUNT(*) FROM usuarios_especiais) as total_usuarios_especiais,
        
        -- Livros - NOVO: Adicionado títulos sem estoque
        (SELECT COUNT(*) FROM livros) as total_livros,
        (SELECT COUNT(*) FROM livros WHERE estoque > 0) as livros_com_estoque,
        (SELECT COUNT(*) FROM livros WHERE estoque <= 0 OR estoque IS NULL) as livros_sem_estoque, 
        (SELECT COALESCE(SUM(estoque), 0) FROM livros) as total_estoque,
        
        -- Títulos disponíveis (considerando empréstimos E reservas ativas)
        (
          SELECT COUNT(DISTINCT l.id)
          FROM livros l
          WHERE l.estoque > 0
          AND (l.estoque - COALESCE(
            (SELECT SUM(el.quantidade) 
             FROM emprestimo_livros el
             JOIN emprestimos e ON el.emprestimo_id = e.id
             WHERE el.livro_id = l.id AND e.status IN ('ativo', 'atrasado')
            ), 0) > 0)
        ) as livros_disponiveis_titulos,
        
        -- Exemplares disponíveis (considerando empréstimos E reservas)
        (
          SELECT COALESCE(SUM(l.estoque), 0) 
          - COALESCE(SUM(emprestados.total_emprestado), 0)
          - COALESCE(SUM(reservas.total_reservado), 0)
          FROM livros l
          LEFT JOIN (
            SELECT el.livro_id, SUM(el.quantidade) as total_emprestado
            FROM emprestimo_livros el
            JOIN emprestimos e ON el.emprestimo_id = e.id
            WHERE e.status IN ('ativo', 'atrasado')
            GROUP BY el.livro_id
          ) emprestados ON l.id = emprestados.livro_id
          LEFT JOIN (
            SELECT r.livro_id, COUNT(r.id) as total_reservado
            FROM reservas r
            WHERE r.status = 'ativa'
            AND r.data_validade >= CURDATE()
            GROUP BY r.livro_id
          ) reservas ON l.id = reservas.livro_id
        ) as exemplares_disponiveis,
        
        -- Empréstimos
        (SELECT COUNT(*) FROM emprestimos WHERE status = 'ativo') as emprestimos_ativos,
        (SELECT COUNT(*) FROM emprestimos WHERE status = 'atrasado' OR (status = 'ativo' AND data_devolucao_prevista < CURDATE())) as emprestimos_atrasados,
        (SELECT COUNT(*) FROM emprestimos WHERE status = 'finalizado') as emprestimos_finalizados,
        (SELECT COUNT(*) FROM emprestimos WHERE status = 'cancelado') as emprestimos_cancelados,
        (SELECT COUNT(*) FROM emprestimos) as emprestimos_totais,
        
        -- Reservas
        (SELECT COUNT(*) FROM reservas WHERE status = 'ativa') as reservas_ativas,
        (SELECT COUNT(*) FROM reservas WHERE status = 'cancelada') as reservas_canceladas,
        (SELECT COUNT(*) FROM reservas WHERE status = 'expirada' OR (status = 'ativa' AND data_validade < CURDATE())) as reservas_expiradas,
        (SELECT COUNT(*) FROM reservas WHERE status = 'concluida') as reservas_finalizadas,
        (SELECT COUNT(*) FROM reservas) as reservas_totais,
        
        -- Cadastros
        (SELECT COUNT(*) FROM editoras) as total_editoras,
        (SELECT COUNT(*) FROM autores) as total_autores,
        
        -- Movimentação
        (SELECT COUNT(*) FROM entradas) as total_entradas,
        (SELECT COUNT(*) FROM saidas) as total_saidas,
        
        -- Último mês
        (SELECT COUNT(*) FROM emprestimos WHERE data_emprestimo >= DATE_SUB(NOW(), INTERVAL 30 DAY)) as emprestimos_ultimo_mes,
        (SELECT COUNT(*) FROM reservas WHERE data_reserva >= DATE_SUB(NOW(), INTERVAL 30 DAY)) as reservas_ultimo_mes,
        
        -- Empréstimos ativos detalhados
        (SELECT COALESCE(SUM(el.quantidade), 0) FROM emprestimo_livros el JOIN emprestimos e ON el.emprestimo_id = e.id WHERE e.status IN ('ativo', 'atrasado')) as total_exemplares_emprestados,
        
        -- Reservas ativas detalhadas
        (SELECT COUNT(*) FROM reservas WHERE status = 'ativa' AND data_validade >= CURDATE()) as reservas_ativas_validas
    `);

    const stats = result[0];
    const totalUsuarios = 
      (stats.total_alunos || 0) + 
      (stats.total_professores || 0) + 
      (stats.total_usuarios_especiais || 0);

    // Calcular valores
    const exemplaresEmprestados = stats.total_exemplares_emprestados || 0;
    const exemplaresDisponiveis = stats.exemplares_disponiveis || 0;
    const exemplaresTotal = stats.total_estoque || 0;
    const reservasAtivasValidas = stats.reservas_ativas_validas || 0;
    
    // NOVO: Calcular percentual de livros sem estoque
    const percentualSemEstoque = stats.total_livros > 0 
      ? Math.round((stats.livros_sem_estoque / stats.total_livros) * 100) 
      : 0;

    return {
      // Usuários
      total_usuarios: totalUsuarios,
      total_alunos: stats.total_alunos || 0,
      total_professores: stats.total_professores || 0,
      total_usuarios_especiais: stats.total_usuarios_especiais || 0,
      
      // Livros - COMPLETO
      total_livros: stats.total_livros || 0,
      livros_com_estoque: stats.livros_com_estoque || 0,
      livros_sem_estoque: stats.livros_sem_estoque || 0,  // NOVO
      livros_disponiveis_titulos: stats.livros_disponiveis_titulos || 0,  
      total_estoque: exemplaresTotal,
      exemplares_disponiveis: exemplaresDisponiveis,
      exemplares_emprestados: exemplaresEmprestados,
      
      // Reservas
      reservas_ativas: stats.reservas_ativas || 0,
      reservas_ativas_validas: reservasAtivasValidas,
      reservas_canceladas: stats.reservas_canceladas || 0,
      reservas_expiradas: stats.reservas_expiradas || 0,
      reservas_finalizadas: stats.reservas_finalizadas || 0,
      reservas_totais: stats.reservas_totais || 0,
      
      // Empréstimos
      emprestimos_ativos: stats.emprestimos_ativos || 0,
      emprestimos_atrasados: stats.emprestimos_atrasados || 0,
      emprestimos_finalizados: stats.emprestimos_finalizados || 0,
      emprestimos_cancelados: stats.emprestimos_cancelados || 0,
      emprestimos_totais: stats.emprestimos_totais || 0,
      
      // Cadastros
      total_editoras: stats.total_editoras || 0,
      total_autores: stats.total_autores || 0,
      
      // Movimentação
      total_entradas: stats.total_entradas || 0,
      total_saidas: stats.total_saidas || 0,
      
      // Atividade recente
      emprestimos_ultimo_mes: stats.emprestimos_ultimo_mes || 0,
      reservas_ultimo_mes: stats.reservas_ultimo_mes || 0,
      
      // Percentuais calculados
      percentual_disponivel_titulos: stats.total_livros > 0 
        ? Math.round((stats.livros_disponiveis_titulos / stats.total_livros) * 100) 
        : 0,
      
      percentual_disponivel_exemplares: exemplaresTotal > 0 
        ? Math.round((exemplaresDisponiveis / exemplaresTotal) * 100) 
        : 0,
      
      percentual_livros_sem_estoque: percentualSemEstoque,
      
      percentual_emprestimos_atrasados: stats.emprestimos_totais > 0 
        ? Math.round((stats.emprestimos_atrasados / stats.emprestimos_totais) * 100) 
        : 0,
      
      percentual_reservas_finalizadas: stats.reservas_totais > 0 
        ? Math.round((stats.reservas_finalizadas / stats.reservas_totais) * 100) 
        : 0,
      
      // Timestamps
      ultima_atualizacao: new Date().toISOString(),
      ultima_atualizacao_formatada: new Date().toLocaleString('pt-BR')
    };

  } catch (error) {
    console.error('Erro ao buscar estatísticas gerais:', error);
    console.error('Stack trace:', error.stack);
    
    // Retornar objeto vazio em caso de erro
    return {
      total_usuarios: 0,
      total_alunos: 0,
      total_professores: 0,
      total_usuarios_especiais: 0,
      total_livros: 0,
      livros_com_estoque: 0,
      livros_sem_estoque: 0, // NOVO
      livros_disponiveis_titulos: 0,
      total_estoque: 0,
      exemplares_disponiveis: 0,
      exemplares_emprestados: 0,
      reservas_ativas: 0,
      reservas_ativas_validas: 0,
      reservas_canceladas: 0,
      reservas_expiradas: 0,
      reservas_finalizadas: 0,
      reservas_totais: 0,
      emprestimos_ativos: 0,
      emprestimos_atrasados: 0,
      emprestimos_finalizados: 0,
      emprestimos_cancelados: 0,
      emprestimos_totais: 0,
      total_editoras: 0,
      total_autores: 0,
      total_entradas: 0,
      total_saidas: 0,
      percentual_disponivel_titulos: 0,
      percentual_disponivel_exemplares: 0,
      percentual_livros_sem_estoque: 0, 
      percentual_emprestimos_atrasados: 0,
      percentual_reservas_finalizadas: 0,
      ultima_atualizacao: new Date().toISOString(),
      ultima_atualizacao_formatada: new Date().toLocaleString('pt-BR'),
      erro: error.message
    };
  }
}

  async getRelatorioEstoque(filtros = {}) {
    try {
      let query = `
        SELECT 
          l.id,
          l.titulo,
          l.isbn,
          l.genero,
          l.ano_publicacao as ano,
          l.estoque,
          l.data_cadastro,
          a.nome as autor,
          e.nome as editora
        FROM livros l
        LEFT JOIN autores a ON l.autor_id = a.id
        LEFT JOIN editoras e ON l.editora_id = e.id
        WHERE 1=1
      `;
      
      const params = [];

      // Filtro por situação do estoque
      if (filtros.situacao) {
        switch (filtros.situacao) {
          case 'disponivel':
            query += ' AND l.estoque > 0';
            break;
          case 'zerado':
            query += ' AND l.estoque = 0';
            break;
          case 'baixo':
            query += ' AND l.estoque <= 5 AND l.estoque > 0';
            break;
        }
      }

      // Filtro por gênero
      if (filtros.genero) {
        query += ' AND l.genero = ?';
        params.push(filtros.genero);
      }

      // Filtro por título do livro
      if (filtros.titulo_livro) {
        query += ' AND l.titulo LIKE ?';
        params.push(`%${filtros.titulo_livro}%`);
      }

      // Filtro por autor
      if (filtros.autor_livro) {
        query += ' AND a.nome LIKE ?';
        params.push(`%${filtros.autor_livro}%`);
      }

      // Ordenar por estoque (do menor para o maior, para mostrar os críticos primeiro)
      query += ' ORDER BY l.estoque ASC, l.titulo LIMIT 1000';

      const [rows] = await db.execute(query, params);
      
      // Calcular estatísticas
      const estatisticas = {
        total_livros: rows.length,
        total_estoque: rows.reduce((sum, livro) => sum + (livro.estoque || 0), 0),
        livros_disponiveis: rows.filter(l => l.estoque > 0).length,
        livros_esgotados: rows.filter(l => l.estoque === 0).length,
        livros_baixo_estoque: rows.filter(l => l.estoque > 0 && l.estoque <= 5).length,
      };
            
      return { dados: rows, estatisticas };
      
    } catch (error) {
      console.error('Erro no relatório de estoque:', error);
      throw new Error(`Erro ao buscar relatório de estoque: ${error.message}`);
    }
  }

  async getGenerosLivros() {
    try {
      const query = `SELECT DISTINCT genero FROM livros WHERE genero IS NOT NULL AND genero != '' ORDER BY genero`;
      const [rows] = await db.execute(query);
      return rows.map(row => row.genero);
    } catch (error) {
      console.error('Erro ao buscar gêneros:', error);
      return [];
    }
  }
}

module.exports = new RelatoriosRepository();