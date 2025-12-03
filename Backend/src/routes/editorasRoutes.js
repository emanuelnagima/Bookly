const express = require('express');
const editorasController = require('../controllers/editorasController');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

router.get('/', editorasController.getAll);
router.get('/:id', editorasController.getById);
router.post('/', authenticate, authorize('admin','operador'), editorasController.create);
router.put('/:id', authenticate, authorize('admin','operador'), editorasController.update);
router.delete('/:id', authenticate, authorize('admin','operador'), editorasController.delete);

module.exports = router;