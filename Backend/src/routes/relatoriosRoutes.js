const express = require('express');
const router = express.Router();

const relatoriosController = require('../controllers/RelatoriosController');
const { authenticate, authorize } = require('../middlewares/auth');

// Rotas existentes
router.get('/filtros/:tipo', authenticate, authorize('admin', 'bibliotecario'), relatoriosController.getFiltrosDisponiveis);
router.post('/:tipo', authenticate, authorize('admin', 'bibliotecario'), relatoriosController.gerarRelatorio);

router.get('/buscar-livros', authenticate, authorize('admin', 'bibliotecario'), relatoriosController.buscarLivros);
router.get('/buscar-usuarios', authenticate, authorize('admin', 'bibliotecario'), relatoriosController.buscarUsuarios);
router.get('/estatisticas-gerais',  authenticate, authorize('admin', 'bibliotecario'), relatoriosController.getEstatisticasGerais);
router.post('/estoque', authenticate, authorize('admin', 'bibliotecario'), relatoriosController.getRelatorioEstoque);

module.exports = router;