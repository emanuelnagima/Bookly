const express = require('express');
const router = express.Router();
const controller = require('../controllers/emprestimosController');
const { authenticate, authorize } = require('../middlewares/auth');

// Rotas públicas (se necessário)
router.get('/ativos', controller.getAtivos);
router.get('/atrasados', controller.getAtrasados);
router.get('/cancelados', controller.getCancelados); 

// Rotas protegidas
router.get('/', authenticate, authorize('admin', 'bibliotecario'), controller.getAll);
router.get('/opcoes-usuarios', authenticate, authorize('admin', 'bibliotecario'), controller.getOpcoesUsuarios);
router.get('/:id', authenticate, authorize('admin', 'bibliotecario'), controller.getById);
router.get('/:id/verificar-edicao', authenticate, authorize('admin', 'bibliotecario'), controller.verificarEdicao);
router.get('/disponibilidade/:livroId', authenticate, authorize('admin', 'bibliotecario'), controller.verificarDisponibilidade);
router.post('/', authenticate, authorize('admin', 'bibliotecario'), controller.create);
router.put('/:id', authenticate, authorize('admin', 'bibliotecario'), controller.update);
router.put('/atualizar-status', authenticate, authorize('admin','bibliotecario'), controller.atualizarStatus);
router.put('/:id/renovar', authenticate, authorize('admin', 'bibliotecario'), controller.renovar);
router.put('/:id/finalizar', authenticate, authorize('admin', 'bibliotecario'), controller.finalizar);
router.put('/:id/cancelar', authenticate, authorize('admin', 'bibliotecario'), controller.cancelar);


module.exports = router;