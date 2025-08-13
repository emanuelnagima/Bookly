const express = require('express');
const router = express.Router();
const professoresController = require('../controllers/professoresController');

router.get('/', professoresController.getAll);
router.get('/:id', professoresController.getById);
router.post('/', professoresController.create);
router.put('/:id', professoresController.update);
router.delete('/:id', professoresController.delete);

module.exports = router;