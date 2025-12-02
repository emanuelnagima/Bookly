const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuariosEspeciaisController');
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/', authenticate, authorize('admin', 'operador'), controller.getAll);
router.get('/:id', authenticate, authorize('admin', 'operador'), controller.getById);
router.post('/', authenticate, authorize('admin', 'operador'), controller.create);
router.put('/:id', authenticate, authorize('admin', 'operador'), controller.update);
router.delete('/:id', authenticate, authorize('admin', 'operador'), controller.delete);

module.exports = router;