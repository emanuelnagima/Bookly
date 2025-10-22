const express = require('express');
const router = express.Router();
const professoresController = require('../controllers/professoresController');
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/', professoresController.getAll);
router.get('/:id', professoresController.getById);
router.post('/', authenticate, authorize('admin'), professoresController.create);
router.put('/:id', authenticate, authorize('admin'), professoresController.update);
router.delete('/:id', authenticate, authorize('admin'), professoresController.delete);

module.exports = router;