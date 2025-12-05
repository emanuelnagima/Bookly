const express = require('express');
const router = express.Router();
const controller = require('../controllers/reservasController');
const { authenticate, authorize } = require('../middlewares/auth');

// Rotas públicas 
router.get('/ativas', controller.getAtivas);
// Rotas protegidas
router.get('/', authenticate, authorize('admin', 'bibliotecario'), controller.getAll);
router.get('/livro/:livroId', authenticate, authorize('admin', 'bibliotecario'), controller.getPorLivro);
router.get('/:id', authenticate, authorize('admin', 'bibliotecario'), controller.getById);
router.get('/:id/verificar-edicao', authenticate, authorize('admin', 'bibliotecario'), controller.verificarEdicao);
router.get('/status/expiradas', authenticate, authorize('admin', 'bibliotecario'), controller.getExpiradas);
router.get('/status/canceladas', authenticate, authorize('admin', 'bibliotecario'), controller.getCanceladas);
router.get('/status/concluidas', authenticate, authorize('admin', 'bibliotecario'), controller.getConcluidas);
router.patch('/acoes/expirar', authenticate, authorize('admin', 'bibliotecario'), controller.expirarReservas);

// Rotas de criação e manipulação
router.post('/', authenticate, authorize('admin', 'bibliotecario'), controller.create);
router.put('/:id', authenticate, authorize('admin', 'bibliotecario'), controller.update);
router.put('/:id/cancelar', authenticate, authorize('admin', 'bibliotecario'), controller.cancelar);
router.put('/:id/concluir', authenticate, authorize('admin', 'bibliotecario'), controller.concluir);
router.delete('/:id', authenticate, authorize('admin', 'bibliotecario'), controller.delete);
router.post('/:id/converter-emprestimo', authenticate, authorize('admin', 'bibliotecario'), controller.converterEmEmprestimo);
router.get('/status/expiradas', authenticate, authorize('admin', 'bibliotecario'), controller.getExpiradas);

module.exports = router;