const express = require('express');
const entradaSaidaController = require('../controllers/entradaSaidaController');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

// Rotas para Entradas
router.post('/entradas', authenticate, authorize('admin', 'bibliotecario'), entradaSaidaController.registrarEntrada);
router.get('/entradas', authenticate, authorize('admin', 'bibliotecario'), entradaSaidaController.getAllEntradas);
router.get('/entradas/livro/:livroId', authenticate, authorize('admin', 'bibliotecario'), entradaSaidaController.getEntradasPorLivro);

// Rotas para Saídas
router.post('/saidas', authenticate, authorize('admin', 'bibliotecario'), entradaSaidaController.registrarSaida);
router.get('/saidas', authenticate, authorize('admin', 'bibliotecario'), entradaSaidaController.getAllSaidas);
router.get('/saidas/livro/:livroId', authenticate, authorize('admin', 'bibliotecario'), entradaSaidaController.getSaidasPorLivro);

// Rotas para opções
router.get('/opcoes/entrada', authenticate, authorize('admin', 'bibliotecario'), entradaSaidaController.getOpcoesEntrada);
router.get('/opcoes/saida', authenticate, authorize('admin', 'bibliotecario'), entradaSaidaController.getOpcoesSaida);

// Rotas para estatísticas e histórico
router.get('/estatisticas', authenticate, authorize('admin', 'bibliotecario'), entradaSaidaController.getEstatisticas);
router.get('/historico', authenticate, authorize('admin', 'bibliotecario'), entradaSaidaController.getHistoricoCompleto);
router.get('/estoque/:livroId', authenticate, authorize('admin', 'bibliotecario'), entradaSaidaController.verificarEstoque);
router.get('/estoque-disponivel/:livroId', authenticate, authorize('admin', 'bibliotecario'), entradaSaidaController.verificarEstoqueDisponivel);
// NOVA ROTA: Processamento de inventário em lote
router.post('/inventario', authenticate, authorize('admin','bibliotecario'), entradaSaidaController.processarInventario);

module.exports = router;