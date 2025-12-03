const express = require('express');
const router = express.Router();
const alunosController = require('../controllers/alunosController');
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/', authenticate, authorize('admin', 'operador'), alunosController.getAll);
router.get('/:id', authenticate, authorize('admin', 'operador'), alunosController.getById);
router.post('/', authenticate, authorize('admin','operador'), alunosController.create);
router.put('/:id', authenticate, authorize('admin','operador'), alunosController.update);
router.delete('/:id', authenticate, authorize('admin','operador'), alunosController.delete);

module.exports = router;