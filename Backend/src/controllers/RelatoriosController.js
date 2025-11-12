const relatoriosRepository = require('../repository/relatoriosRepository');

class RelatoriosController {

  async gerarRelatorio(req, res) {
    try {
      const { tipo } = req.params;
      const filtros = req.body;

      console.log(`=== GERANDO RELATÓRIO: ${tipo} ===`);
      console.log('Filtros recebidos:', filtros);

      // 🔧 LIMPEZA DOS FILTROS - remover valores vazios
      const filtrosLimpos = {};
      Object.keys(filtros).forEach(key => {
        if (filtros[key] !== '' && filtros[key] !== null && filtros[key] !== undefined) {
          filtrosLimpos[key] = filtros[key];
        }
      });

      console.log('Filtros limpos para busca:', filtrosLimpos);

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

      console.log(`Executando query para relatório: ${tipo}`);

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
        default:
          return res.status(400).json({
            success: false,
            message: 'Tipo de relatório inválido'
          });
      }

      console.log(`✅ Relatório ${tipo} retornou ${dados.length} registros`);

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

  async getFiltrosDisponiveis(req, res) {
    try {
      const { tipo } = req.params;
      
      console.log(`Buscando filtros para: ${tipo}`);

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
          filtros.status = ['ativo', 'atrasado', 'finalizado'];
          filtros.usuario_tipo = ['aluno', 'professor', 'usuario_especial'];
          break;

        case 'reservas':
          filtros.status = ['ativa', 'cancelada', 'concluida', 'expirada'];
          break;

        case 'entrada':
          filtros.origem = ['Compra', 'Doação', 'Ajuste de Inventário'];
          break;

        case 'saida':
          filtros.origem = ['Venda', 'Descarte', 'Ajuste de Inventário'];
          break;

        default:
          filtros = {};
      }

      console.log(`Filtros para ${tipo}:`, filtros);

      res.json({
        success: true,
        data: filtros
      });

    } catch (error) {
      console.error(`Erro ao buscar filtros:`, error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new RelatoriosController();