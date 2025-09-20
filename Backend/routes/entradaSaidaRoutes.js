const express = require('express');
const entradaSaidaController = require('../controllers/entradaSaidaController');

const router = express.Router();

// Rotas para Entradas
router.post('/entradas', entradaSaidaController.registrarEntrada);
router.get('/entradas', entradaSaidaController.getAllEntradas);
router.get('/entradas/livro/:livroId', entradaSaidaController.getEntradasPorLivro);

// Rotas para Saídas
router.post('/saidas', entradaSaidaController.registrarSaida);
router.get('/saidas', entradaSaidaController.getAllSaidas);
router.get('/saidas/livro/:livroId', entradaSaidaController.getSaidasPorLivro);

// Rotas para opções
router.get('/opcoes/entrada', entradaSaidaController.getOpcoesEntrada);
router.get('/opcoes/saida', entradaSaidaController.getOpcoesSaida);

// Rotas para estatísticas e histórico
router.get('/estatisticas', entradaSaidaController.getEstatisticas);
router.get('/historico', entradaSaidaController.getHistoricoCompleto);
router.get('/estoque/:livroId', entradaSaidaController.verificarEstoque);

// NOVA ROTA: Processamento de inventário em lote
router.post('/inventario', entradaSaidaController.processarInventario);

module.exports = router;