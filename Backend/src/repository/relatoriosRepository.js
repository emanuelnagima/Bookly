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
        let query = `
            SELECT 
                e.id,
                e.data_emprestimo,
                e.data_devolucao_prevista,
                e.data_devolucao_real,
                e.status,
                e.usuario_tipo,
                e.data_cancelamento,  -- NOVO: Data do cancelamento
                e.motivo_cancelamento,  -- NOVO: Motivo do cancelamento
                l.titulo as livro, 
                CASE 
                    WHEN e.usuario_tipo = 'aluno' THEN (SELECT nome FROM alunos WHERE id = e.usuario_id)
                    WHEN e.usuario_tipo = 'professor' THEN (SELECT nome FROM professores WHERE id = e.usuario_id)
                    WHEN e.usuario_tipo = 'usuario_especial' THEN (SELECT nome_completo FROM usuarios_especiais WHERE id = e.usuario_id)
                    ELSE 'Não identificado'
                END as usuario,
                e.usuario_id,
                -- CAMPO CALCULADO: verifica se está atrasado
                CASE 
                    WHEN e.status = 'ativo' AND e.data_devolucao_prevista < CURDATE() THEN 'atrasado'
                    ELSE e.status
                END as status_calculado
            FROM emprestimos e
            INNER JOIN emprestimo_livros el ON e.id = el.emprestimo_id
            INNER JOIN livros l ON el.livro_id = l.id
            WHERE 1=1
        `;
        
        const params = [];

        // Filtros de data
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

        // MODIFICAÇÃO AQUI: Incluir status 'cancelado' no filtro
        if (filtros.status) {
            if (filtros.status === 'atrasado') {
                // Incluir tanto os marcados como 'atrasado' quanto os 'ativos' com data vencida
                query += ' AND (e.status = "atrasado" OR (e.status = "ativo" AND e.data_devolucao_prevista < CURDATE()))';
            } else if (filtros.status === 'cancelado') {
                // Filtro específico para cancelados
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
        
        const [rows] = await db.execute(query, params);
        
        // Atualizar o status nos dados retornados
        const rowsAtualizados = rows.map(row => ({
            ...row,
            status: row.status_calculado || row.status
        }));
        
        return rowsAtualizados;
    } catch (error) {
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
    const [
      [totalUsuarios],
      [totalLivros],
      [totalEmprestimosAtivos],
      [totalEmprestimosAtrasados],
      [totalEmprestimosFinalizados],
      [totalEmprestimosCancelados],
      [totalEmprestimos],
      [totalReservasAtivas],
      [totalReservasCanceladas],
      [totalReservasExpiradas],
      [totalReservas],
      [totalEditoras],
      [totalAutores],
      [livrosDisponiveis],
      [totalEstoque],
      [totalEntradas],
      [totalSaidas]
    ] = await Promise.all([
      // Total de usuários
      db.execute(`
        SELECT 
          (SELECT COUNT(*) FROM alunos) as total_alunos,
          (SELECT COUNT(*) FROM professores) as total_professores,
          (SELECT COUNT(*) FROM usuarios_especiais) as total_usuarios_especiais
      `),
      
      // Total de livros cadastrados (títulos)
      db.execute(`SELECT COUNT(*) as total FROM livros`),
      
      // Empréstimos ativos
      db.execute(`SELECT COUNT(*) as total FROM emprestimos WHERE status = 'ativo'`),
      
      // Empréstimos atrasados
      db.execute(`
        SELECT COUNT(*) as total 
        FROM emprestimos 
        WHERE status = 'atrasado' 
        OR (status = 'ativo' AND data_devolucao_prevista < CURDATE())
      `),
      
      // Empréstimos finalizados
      db.execute(`SELECT COUNT(*) as total FROM emprestimos WHERE status = 'finalizado'`),
      
      // NOVO: Empréstimos cancelados
      db.execute(`SELECT COUNT(*) as total FROM emprestimos WHERE status = 'cancelado'`),
      
      // Total de empréstimos
      db.execute(`SELECT COUNT(*) as total FROM emprestimos`),
      
      // Reservas ativas
      db.execute(`SELECT COUNT(*) as total FROM reservas WHERE status = 'ativa'`),
      
      // Reservas canceladas
      db.execute(`SELECT COUNT(*) as total FROM reservas WHERE status = 'cancelada'`),
      
      // Reservas expiradas
      db.execute(`
        SELECT COUNT(*) as total 
        FROM reservas 
        WHERE status = 'expirada' 
        OR (status = 'ativa' AND data_validade < CURDATE())
      `),
      
      // Total de reservas
      db.execute(`SELECT COUNT(*) as total FROM reservas`),
      
      // Total de editoras
      db.execute(`SELECT COUNT(*) as total FROM editoras`),
      
      // Total de autores
      db.execute(`SELECT COUNT(*) as total FROM autores`),
      
      // Livros disponíveis (títulos com estoque > 0)
      db.execute(`SELECT COUNT(*) as total FROM livros WHERE estoque > 0`),
      
      // Total do estoque (soma de todos os exemplares)
      db.execute(`SELECT COALESCE(SUM(estoque), 0) as total_estoque FROM livros`),
      
      // Total de entradas
      db.execute(`SELECT COUNT(*) as total FROM entradas`),
      
      // Total de saídas
      db.execute(`SELECT COUNT(*) as total FROM saidas`)
    ]);

    const estatisticas = {
      // Estatísticas de usuários
      total_usuarios: 
        (totalUsuarios[0].total_alunos || 0) + 
        (totalUsuarios[0].total_professores || 0) + 
        (totalUsuarios[0].total_usuarios_especiais || 0),
      
      total_alunos: totalUsuarios[0].total_alunos || 0,
      total_professores: totalUsuarios[0].total_professores || 0,
      total_usuarios_especiais: totalUsuarios[0].total_usuarios_especiais || 0,
      
      // Estatísticas de livros
      total_livros: totalLivros[0].total || 0,
      livros_disponiveis: livrosDisponiveis[0].total || 0,
      total_estoque: totalEstoque[0].total_estoque || 0,
      
      // Estatísticas de empréstimos (COM CANCELADOS)
      emprestimos_ativos: totalEmprestimosAtivos[0].total || 0,
      emprestimos_atrasados: totalEmprestimosAtrasados[0].total || 0,
      emprestimos_finalizados: totalEmprestimosFinalizados[0].total || 0,
      emprestimos_cancelados: totalEmprestimosCancelados[0].total || 0, 
      emprestimos_totais: totalEmprestimos[0].total || 0,
      
      // Estatísticas de reservas
      reservas_ativas: totalReservasAtivas[0].total || 0,
      reservas_canceladas: totalReservasCanceladas[0].total || 0,
      reservas_expiradas: totalReservasExpiradas[0].total || 0,
      reservas_totais: totalReservas[0].total || 0,
      
      // Estatísticas de cadastros
      total_editoras: totalEditoras[0].total || 0,
      total_autores: totalAutores[0].total || 0,
      
      // Estatísticas de movimentação
      total_entradas: totalEntradas[0].total || 0,
      total_saidas: totalSaidas[0].total || 0,
      
      // Timestamp da última atualização
      ultima_atualizacao: new Date().toISOString()
    };

    return estatisticas;

  } catch (error) {
    console.error('Erro ao buscar estatísticas gerais:', error);
    throw new Error(`Erro ao buscar estatísticas: ${error.message}`);
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

      console.log('Query Estoque executada:', query);
      console.log('Parâmetros:', params);

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