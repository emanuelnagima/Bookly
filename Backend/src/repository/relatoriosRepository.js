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
        l.titulo as livro, 
        CASE 
          WHEN e.usuario_tipo = 'aluno' THEN (SELECT nome FROM alunos WHERE id = e.usuario_id)
          WHEN e.usuario_tipo = 'professor' THEN (SELECT nome FROM professores WHERE id = e.usuario_id)
          WHEN e.usuario_tipo = 'usuario_especial' THEN (SELECT nome_completo FROM usuarios_especiais WHERE id = e.usuario_id)
          ELSE 'Não identificado'
        END as usuario
      FROM emprestimos e
      INNER JOIN emprestimo_livros el ON e.id = el.emprestimo_id  -- ✅ JOIN com a tabela de relação
      INNER JOIN livros l ON el.livro_id = l.id  -- ✅ JOIN com livros para pegar o título
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

    if (filtros.status) {
      query += ' AND e.status = ?';
      params.push(filtros.status);
    }

    if (filtros.usuario_tipo) {
      query += ' AND e.usuario_tipo = ?';
      params.push(filtros.usuario_tipo);
    }

    query += ' ORDER BY e.data_emprestimo DESC LIMIT 1000';
    const [rows] = await db.execute(query, params);
    if (rows.length > 0) {
    }
    
    return rows;
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
          e.data_aquisicao,
          l.titulo
        FROM entradas e
        JOIN livros l ON e.livro_id = l.id
        WHERE 1=1
      `;
      
      const params = [];

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

      if (filtros.origem) {
        query += ' AND e.origem = ?';
        params.push(filtros.origem);
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
          s.data_saida,
          l.titulo
        FROM saidas s
        JOIN livros l ON s.livro_id = l.id
        WHERE 1=1
      `;
      
      const params = [];

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

      if (filtros.origem) {
        query += ' AND s.origem = ?';
        params.push(filtros.origem);
      }

      query += ' ORDER BY s.data_saida DESC LIMIT 1000';

      const [rows] = await db.execute(query, params);
      return rows;
    } catch (error) {
      throw new Error(`Erro ao buscar relatório de saídas: ${error.message}`);
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

      if (filtros.genero) {
        query += ' AND l.genero = ?';
        params.push(filtros.genero);
      }

      query += ' ORDER BY l.titulo LIMIT 1000';

      console.log('Query executada:', query);
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
          l.titulo as livro,
          CASE 
            WHEN r.usuario_tipo = 'aluno' THEN (SELECT nome FROM alunos WHERE id = r.usuario_id)
            WHEN r.usuario_tipo = 'professor' THEN (SELECT nome FROM professores WHERE id = r.usuario_id)
            WHEN r.usuario_tipo = 'usuario_especial' THEN (SELECT nome_completo FROM usuarios_especiais WHERE id = r.usuario_id)
            ELSE 'Não identificado'
          END as usuario
        FROM reservas r
        JOIN reserva_livros rl ON r.id = rl.reserva_id
        JOIN livros l ON rl.livro_id = l.id
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

      if (filtros.status) {
        query += ' AND r.status = ?';
        params.push(filtros.status);
      }

      query += ' ORDER BY r.data_reserva DESC LIMIT 1000';

      const [rows] = await db.execute(query, params);
      return rows;
    } catch (error) {
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
}

module.exports = new RelatoriosRepository();