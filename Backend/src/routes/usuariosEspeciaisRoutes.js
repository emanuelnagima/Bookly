const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuariosEspeciaisController');
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/', authenticate, authorize('admin', 'bibliotecario'), controller.getAll);
router.get('/:id', authenticate, authorize('admin', 'bibliotecario'), controller.getById);
router.post('/', authenticate, authorize('admin', 'bibliotecario'), controller.create);
router.put('/:id', authenticate, authorize('admin', 'bibliotecario'), controller.update);
router.delete('/:id', authenticate, authorize('admin', 'bibliotecario'), controller.delete);

module.exports = router;