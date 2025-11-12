const express = require('express');
const router = express.Router();
const relatoriosController = require('../controllers/RelatoriosController');
const { authenticate, authorize } = require('../middlewares/auth');


router.get('/filtros/:tipo', authenticate, authorize('admin', 'operador'), relatoriosController.getFiltrosDisponiveis);
router.post('/:tipo', authenticate, authorize('admin', 'operador'), relatoriosController.gerarRelatorio);

module.exports = router;