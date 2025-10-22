const express = require('express');
const router = express.Router();
const autoresController = require('../controllers/autoresController');
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/', autoresController.getAll);
router.get('/:id', autoresController.getById);
router.post('/', authenticate, authorize('admin'), autoresController.create);
router.put('/:id', authenticate, authorize('admin'), autoresController.update);
router.delete('/:id', authenticate, authorize('admin'), autoresController.delete);

module.exports = router;