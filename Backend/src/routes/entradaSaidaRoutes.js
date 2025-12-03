const express = require('express');
const entradaSaidaController = require('../controllers/entradaSaidaController');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

// Rotas para Entradas
router.post('/entradas', authenticate, authorize('admin', 'operador'), entradaSaidaController.registrarEntrada);
router.get('/entradas', authenticate, authorize('admin', 'operador'), entradaSaidaController.getAllEntradas);
router.get('/entradas/livro/:livroId', authenticate, authorize('admin', 'operador'), entradaSaidaController.getEntradasPorLivro);

// Rotas para Saídas
router.post('/saidas', authenticate, authorize('admin', 'operador'), entradaSaidaController.registrarSaida);
router.get('/saidas', authenticate, authorize('admin', 'operador'), entradaSaidaController.getAllSaidas);
router.get('/saidas/livro/:livroId', authenticate, authorize('admin', 'operador'), entradaSaidaController.getSaidasPorLivro);

// Rotas para opções
router.get('/opcoes/entrada', authenticate, authorize('admin', 'operador'), entradaSaidaController.getOpcoesEntrada);
router.get('/opcoes/saida', authenticate, authorize('admin', 'operador'), entradaSaidaController.getOpcoesSaida);

// Rotas para estatísticas e histórico
router.get('/estatisticas', authenticate, authorize('admin', 'operador'), entradaSaidaController.getEstatisticas);
router.get('/historico', authenticate, authorize('admin', 'operador'), entradaSaidaController.getHistoricoCompleto);
router.get('/estoque/:livroId', authenticate, authorize('admin', 'operador'), entradaSaidaController.verificarEstoque);
router.get('/estoque-disponivel/:livroId', authenticate, authorize('admin', 'operador'), entradaSaidaController.verificarEstoqueDisponivel);
// NOVA ROTA: Processamento de inventário em lote
router.post('/inventario', authenticate, authorize('admin','operador'), entradaSaidaController.processarInventario);

module.exports = router;