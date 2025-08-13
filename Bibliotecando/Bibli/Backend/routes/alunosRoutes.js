const express = require('express');
const router = express.Router();
const alunosController = require('../controllers/alunosController');

router.get('/', alunosController.getAll);
router.get('/:id', alunosController.getById);
router.post('/', alunosController.create);
router.put('/:id', alunosController.update);
router.delete('/:id', alunosController.delete);

module.exports = router;