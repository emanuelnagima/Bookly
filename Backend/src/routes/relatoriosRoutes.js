const express = require('express');
const router = express.Router();

const relatoriosController = require('../controllers/RelatoriosController');
const { authenticate, authorize } = require('../middlewares/auth');

// Rotas existentes
router.get('/filtros/:tipo', authenticate, authorize('admin', 'operador'), relatoriosController.getFiltrosDisponiveis);
router.post('/:tipo', authenticate, authorize('admin', 'operador'), relatoriosController.gerarRelatorio);

router.get('/buscar-livros', authenticate, authorize('admin', 'operador'), relatoriosController.buscarLivros);
router.get('/buscar-usuarios', authenticate, authorize('admin', 'operador'), relatoriosController.buscarUsuarios);
router.get('/estatisticas-gerais',  authenticate, authorize('admin', 'operador'), relatoriosController.getEstatisticasGerais);
router.post('/estoque', authenticate, authorize('admin', 'operador'), relatoriosController.getRelatorioEstoque);

module.exports = router;