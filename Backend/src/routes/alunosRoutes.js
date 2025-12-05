const express = require('express');
const router = express.Router();
const alunosController = require('../controllers/alunosController');
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/', authenticate, authorize('admin', 'bibliotecario'), alunosController.getAll);
router.get('/:id', authenticate, authorize('admin', 'bibliotecario'), alunosController.getById);
router.post('/', authenticate, authorize('admin','bibliotecario'), alunosController.create);
router.put('/:id', authenticate, authorize('admin','bibliotecario'), alunosController.update);
router.delete('/:id', authenticate, authorize('admin','bibliotecario'), alunosController.delete);

module.exports = router;