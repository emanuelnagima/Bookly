const express = require('express');
const router = express.Router();
const controller = require('../controllers/reservasController');
const { authenticate, authorize } = require('../middlewares/auth');

// Rotas públicas 
router.get('/ativas', controller.getAtivas);
// Rotas protegidas
router.get('/', authenticate, authorize('admin', 'operador'), controller.getAll);
router.get('/livro/:livroId', authenticate, authorize('admin', 'operador'), controller.getPorLivro);
router.get('/:id', authenticate, authorize('admin', 'operador'), controller.getById);
router.get('/:id/verificar-edicao', authenticate, authorize('admin', 'operador'), controller.verificarEdicao);
router.get('/status/expiradas', authenticate, authorize('admin', 'operador'), controller.getExpiradas);
router.get('/status/canceladas', authenticate, authorize('admin', 'operador'), controller.getCanceladas);
router.get('/status/concluidas', authenticate, authorize('admin', 'operador'), controller.getConcluidas);
router.patch('/acoes/expirar', authenticate, authorize('admin', 'operador'), controller.expirarReservas);

// Rotas de criação e manipulação
router.post('/', authenticate, authorize('admin', 'operador'), controller.create);
router.put('/:id', authenticate, authorize('admin', 'operador'), controller.update);
router.put('/:id/cancelar', authenticate, authorize('admin', 'operador'), controller.cancelar);
router.put('/:id/concluir', authenticate, authorize('admin', 'operador'), controller.concluir);
router.delete('/:id', authenticate, authorize('admin', 'operador'), controller.delete);
router.post('/:id/converter-emprestimo', authenticate, authorize('admin', 'operador'), controller.converterEmEmprestimo);
module.exports = router;