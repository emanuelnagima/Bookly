const express = require('express');
const router = express.Router();
const controller = require('../controllers/emprestimosController');
const { authenticate, authorize } = require('../middlewares/auth');

// Rotas públicas (se necessário)
router.get('/ativos', controller.getAtivos);
router.get('/atrasados', controller.getAtrasados);

// Rotas protegidas
router.get('/', authenticate, authorize('admin', 'operador'), controller.getAll);
router.get('/opcoes-usuarios', authenticate, authorize('admin', 'operador'), controller.getOpcoesUsuarios);
router.get('/:id', authenticate, authorize('admin', 'operador'), controller.getById);
router.get('/:id/verificar-edicao', authenticate, authorize('admin', 'operador'), controller.verificarEdicao);
router.post('/', authenticate, authorize('admin', 'operador'), controller.create);
router.put('/:id', authenticate, authorize('admin', 'operador'), controller.update);
router.put('/:id/renovar', authenticate, authorize('admin', 'operador'), controller.renovar);
router.put('/:id/finalizar', authenticate, authorize('admin', 'operador'), controller.finalizar);
router.delete('/:id', authenticate, authorize('admin', 'operador'), controller.delete);

module.exports = router;