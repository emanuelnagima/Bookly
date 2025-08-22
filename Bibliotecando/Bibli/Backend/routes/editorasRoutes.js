const express = require('express');
const editorasController = require('../controllers/editorasController');

const router = express.Router();

router.get('/', editorasController.getAll);
router.get('/:id', editorasController.getById);
router.post('/', editorasController.create);
router.put('/:id', editorasController.update);
router.delete('/:id', editorasController.delete);

module.exports = router;
