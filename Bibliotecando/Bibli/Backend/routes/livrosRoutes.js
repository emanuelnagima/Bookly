const express = require ('express');
const livrosController = require('../controllers/livrosController.js');

const router = express.Router();

//Rotas crud
router.get('/',livrosController.getAll)
router.get('/:id', livrosController.getById)
router.post('/',livrosController.create)
router.put('/:id',livrosController.update)
router.delete('/:id',livrosController.delete)
//rota especifica para atualizar status
router.patch('/:id/status',livrosController.updateStatus)
module.exports=router