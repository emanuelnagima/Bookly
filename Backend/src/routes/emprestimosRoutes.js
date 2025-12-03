const express = require('express');
const router = express.Router();
const controller = require('../controllers/emprestimosController');
const { authenticate, authorize } = require('../middlewares/auth');

// Rotas públicas (se necessário)
router.get('/ativos', controller.getAtivos);
router.get('/atrasados', controller.getAtrasados);
router.get('/cancelados', controller.getCancelados); 

// Rotas protegidas
router.get('/', authenticate, authorize('admin', 'operador'), controller.getAll);
router.get('/opcoes-usuarios', authenticate, authorize('admin', 'operador'), controller.getOpcoesUsuarios);
router.get('/:id', authenticate, authorize('admin', 'operador'), controller.getById);
router.get('/:id/verificar-edicao', authenticate, authorize('admin', 'operador'), controller.verificarEdicao);
router.get('/disponibilidade/:livroId', authenticate, authorize('admin', 'operador'), controller.verificarDisponibilidade);
router.post('/', authenticate, authorize('admin', 'operador'), controller.create);
router.put('/:id', authenticate, authorize('admin', 'operador'), controller.update);
router.put('/atualizar-status', authenticate, authorize('admin','operador'), controller.atualizarStatus);
router.put('/:id/renovar', authenticate, authorize('admin', 'operador'), controller.renovar);
router.put('/:id/finalizar', authenticate, authorize('admin', 'operador'), controller.finalizar);
router.put('/:id/cancelar', authenticate, authorize('admin', 'operador'), controller.cancelar);


module.exports = router;