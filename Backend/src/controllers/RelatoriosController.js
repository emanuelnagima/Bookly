const relatoriosRepository = require('../repository/relatoriosRepository');

class RelatoriosController {

  async gerarRelatorio(req, res) {
    try {
      const { tipo } = req.params;
      const filtros = req.body;

      const filtrosLimpos = {};
      Object.keys(filtros).forEach(key => {
        if (filtros[key] !== '' && filtros[key] !== null && filtros[key] !== undefined) {
          filtrosLimpos[key] = filtros[key];
        }
      });

      let dados = [];
      let estatisticas = {};

      // Validação de datas apenas se ambas forem fornecidas
      if (filtrosLimpos.dataInicio && filtrosLimpos.dataFim) {
        const dataInicio = new Date(filtrosLimpos.dataInicio);
        const dataFim = new Date(filtrosLimpos.dataFim);
        
        if (dataInicio > dataFim) {
          return res.status(400).json({
            success: false,
            message: 'Data início não pode ser maior que data fim'
          });
        }
      }

      // Buscar dados com filtros limpos
      switch (tipo) {
        case 'emprestimos':
          dados = await relatoriosRepository.getRelatorioEmprestimos(filtrosLimpos);
          break;
        case 'entrada':
          dados = await relatoriosRepository.getRelatorioEntradas(filtrosLimpos);
          break;
        case 'saida':
          dados = await relatoriosRepository.getRelatorioSaidas(filtrosLimpos);
          break;
        case 'cadastros':
          dados = await relatoriosRepository.getRelatorioCadastros(filtrosLimpos);
          break;
        case 'reservas':
          dados = await relatoriosRepository.getRelatorioReservas(filtrosLimpos);
          break;
        case 'professores':
          dados = await relatoriosRepository.getRelatorioProfessores(filtrosLimpos);
          break;
        case 'alunos':
          dados = await relatoriosRepository.getRelatorioAlunos(filtrosLimpos);
          break;
        case 'usuarios-especiais':
          dados = await relatoriosRepository.getRelatorioUsuariosEspeciais(filtrosLimpos);
          break;
        case 'editoras':
          dados = await relatoriosRepository.getRelatorioEditoras(filtrosLimpos);
          break;
        case 'autores':
          dados = await relatoriosRepository.getRelatorioAutores(filtrosLimpos);
          break;
          case 'estoque':
            const resultadoEstoque = await relatoriosRepository.getRelatorioEstoque(filtrosLimpos);
            dados = resultadoEstoque.dados || [];
            estatisticas = resultadoEstoque.estatisticas || {};
            break;
        default:
          return res.status(400).json({
            success: false,
            message: 'Tipo de relatório inválido'
          });
      }

      // Mensagem quando não há registros
      if (!dados || dados.length === 0) {
        return res.json({
          success: true,
          relatorio: [],
          estatisticas: { total_registros: 0 },
          total: 0,
          message: 'Nenhum registro encontrado para os filtros selecionados'
        });
      }

      // Estatísticas básicas
      estatisticas.total_registros = dados.length;

      res.json({
        success: true,
        relatorio: dados,
        estatisticas,
        total: dados.length
      });

    } catch (error) {
      console.error(` ERRO CRÍTICO ao gerar relatório ${req.params.tipo}:`, error);
      console.error('Stack trace:', error.stack);
      
      res.status(500).json({
        success: false,
        message: `Erro interno do servidor: ${error.message}`,
        details: process.env.NODE_ENV === 'development' ? {
          stack: error.stack,
          sqlMessage: error.sqlMessage
        } : undefined
      });
    }
  }

  async buscarLivros(req, res) {
    try {
      const { tipo, termo } = req.query;
      
      if (!tipo || !termo) {
        return res.status(400).json({
          success: false,
          message: 'Tipo e termo são obrigatórios'
        });
      }

      let resultados = [];

      if (tipo === 'titulo') {
        resultados = await relatoriosRepository.getLivrosPorTitulo(termo);
      } else if (tipo === 'autor') {
        resultados = await relatoriosRepository.getLivrosPorAutor(termo);
      } else {
        return res.status(400).json({
          success: false,
          message: 'Tipo de busca inválido. Use "titulo" ou "autor"'
        });
      }

      res.json({
        success: true,
        data: resultados
      });

    } catch (error) {
      console.error('Erro ao buscar livros:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getRelatorioEstoque(req, res) {
    try {
      const filtros = req.body;

      console.log('=== GERANDO RELATÓRIO DE ESTOQUE ===');
      console.log('Filtros recebidos:', filtros);

      // 🔧 LIMPEZA DOS FILTROS
      const filtrosLimpos = {};
      Object.keys(filtros).forEach(key => {
        if (filtros[key] !== '' && filtros[key] !== null && filtros[key] !== undefined) {
          filtrosLimpos[key] = filtros[key];
        }
      });

      console.log('Filtros limpos para busca:', filtrosLimpos);

      const resultado = await relatoriosRepository.getRelatorioEstoque(filtrosLimpos);

      if (!resultado.dados || resultado.dados.length === 0) {
        return res.json({
          success: true,
          dados: [],
          estatisticas: resultado.estatisticas || {},
          message: 'Nenhum livro encontrado para os filtros selecionados'
        });
      }

      res.json({
        success: true,
        dados: resultado.dados,
        estatisticas: resultado.estatisticas,
        total: resultado.dados.length
      });

    } catch (error) {
      console.error('ERRO CRÍTICO ao gerar relatório de estoque:', error);
      console.error('Stack trace:', error.stack);
      
      res.status(500).json({
        success: false,
        message: `Erro interno do servidor: ${error.message}`,
        details: process.env.NODE_ENV === 'development' ? {
          stack: error.stack,
          sqlMessage: error.sqlMessage
        } : undefined
      });
    }
  }

  async getFiltrosDisponiveis(req, res) {
    try {
      const { tipo } = req.params;
      let filtros = {};

      switch (tipo) {
        case 'professores':
          filtros.departamentos = await relatoriosRepository.getDepartamentosProfessores();
          break;

        case 'alunos':
          filtros.turmas = await relatoriosRepository.getTurmasAlunos();
          break;

        case 'usuarios-especiais':
          filtros.tiposUsuario = await relatoriosRepository.getTiposUsuariosEspeciais();
          break;

        case 'autores':
          filtros.nacionalidades = await relatoriosRepository.getNacionalidadesAutores();
          break;

        case 'cadastros':
          filtros.generos = await relatoriosRepository.getGenerosLivros();
          break;

        case 'emprestimos':
          filtros.status = ['ativo', 'atrasado', 'finalizado','cancelado'];
          filtros.usuario_tipo = ['aluno', 'professor', 'usuario_especial'];
          break;

        case 'reservas':
          filtros.status = ['ativa', 'cancelada', 'concluida', 'expirada'];
          break;

        case 'entrada':
          filtros.origem = [
            'Compra',
            'Doação', 
            'PNLD/PMD',
            'Ajuste de Inventário',
            'Outro'
          ];
          filtros.sugestoesLivros = [];
          break;

        case 'saida':
          filtros.origem = [
            'Livro danificado',
            'Livro perdido ou extraviado', 
            'Doação para terceiros',
            'Baixa administrativa / descarte',
            'Ajuste de Inventário',
            'Outro'
          ];
          filtros.sugestoesLivros = [];
          break;

        case 'estoque':
          filtros.generos = await relatoriosRepository.getGenerosLivros();
          filtros.situacoes = ['disponivel', 'zerado', 'baixo'];
          break;

        default:
          filtros = {};
      }

      res.json({
        success: true,
        data: filtros
      });

    } catch (error) {
      console.error(` Erro ao buscar filtros para ${tipo}:`, error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async buscarUsuarios(req, res) {
    try {
      const { tipo, termo } = req.query;
      
      if (!tipo || !termo) {
        return res.status(400).json({
          success: false,
          message: 'Tipo e termo são obrigatórios'
        });
      }

      let resultados = [];

      if (tipo === 'aluno') {
        resultados = await relatoriosRepository.getUsuariosPorNome('alunos', termo);
      } else if (tipo === 'professor') {
        resultados = await relatoriosRepository.getUsuariosPorNome('professores', termo);
      } else if (tipo === 'usuario_especial') {
        resultados = await relatoriosRepository.getUsuariosPorNome('usuarios_especiais', termo);
      } else {
        return res.status(400).json({
          success: false,
          message: 'Tipo de usuário inválido'
        });
      }

      res.json({
        success: true,
        data: resultados
      });

    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getEstatisticasGerais(req, res) {
    try {
      console.log('=== BUSCANDO ESTATÍSTICAS GERAIS DO SISTEMA ===');
      
      const estatisticas = await relatoriosRepository.getEstatisticasGerais();
      
      res.json({
        success: true,
        data: estatisticas
      });
      
    } catch (error) {
      console.error('Erro ao buscar estatísticas gerais:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new RelatoriosController();