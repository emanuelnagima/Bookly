const entradaSaidaRepository = require('../repository/entradaSaidaRepository');
const { Entrada, Saida } = require('../models/entradasaida');

class EntradaSaidaController {
    // ENTRADAS
    async registrarEntrada(req, res) {
        try {
            const entrada = new Entrada(req.body);
            
            const erros = entrada.validar();
            if (erros !== true) {
                return res.status(400).json({ success: false, message: 'Dados inválidos', errors: erros });
            }
            
            const entradaId = await entradaSaidaRepository.registrarEntrada(entrada);
            
            res.status(201).json({
                success: true,
                message: 'Entrada registrada com sucesso',
                data: { id: entradaId }
            });
            
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getEntradasPorLivro(req, res) {
        try {
            const { livroId } = req.params;
            const entradas = await entradaSaidaRepository.getEntradasPorLivro(livroId);
            
            res.json({ success: true, data: entradas });
            
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getAllEntradas(req, res) {
        try {
            const entradas = await entradaSaidaRepository.getAllEntradas();
            
            res.json({ success: true, data: entradas, total: entradas.length });
            
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // SAÍDAS
    async registrarSaida(req, res) {
        try {
            const saida = new Saida(req.body);
            
            const erros = saida.validar();
            if (erros !== true) {
                return res.status(400).json({ success: false, message: 'Dados inválidos', errors: erros });
            }
            
            const saidaId = await entradaSaidaRepository.registrarSaida(saida);
            
            res.status(201).json({
                success: true,
                message: 'Saída registrada com sucesso',
                data: { id: saidaId }
            });
            
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getSaidasPorLivro(req, res) {
        try {
            const { livroId } = req.params;
            const saidas = await entradaSaidaRepository.getSaidasPorLivro(livroId);
            
            res.json({ success: true, data: saidas });
            
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getAllSaidas(req, res) {
        try {
            const saidas = await entradaSaidaRepository.getAllSaidas();
            
            res.json({ success: true, data: saidas, total: saidas.length });
            
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // ESTATÍSTICAS
    async getEstatisticas(req, res) {
        try {
            const estatisticas = await entradaSaidaRepository.getEstatisticas();
            
            res.json({ success: true, data: estatisticas });
            
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // HISTÓRICO COMPLETO
    async getHistoricoCompleto(req, res) {
        try {
            const { livroId } = req.query;
            const historico = await entradaSaidaRepository.getHistoricoCompleto(livroId || null);
            
            res.json({ success: true, data: historico, total: historico.length });
            
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // VERIFICAR ESTOQUE
    async verificarEstoque(req, res) {
        try {
            const { livroId } = req.params;
            const estoque = await entradaSaidaRepository.verificarEstoque(livroId);
            
            res.json({ success: true, data: { estoque } });
            
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // OPÇÕES PARA SELECTS
    async getOpcoesEntrada(req, res) {
        try {
            const opcoes = {
                origens: ['Compra', 'Doação', 'PNLD/PMD', 'Ajuste de Inventário', 'Outro']
            };
            
            res.json({ success: true, data: opcoes });
            
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getOpcoesSaida(req, res) {
        try {
            const opcoes = {
                origens: [
                    'Livro danificado',
                    'Livro perdido ou extraviado', 
                    'Doação para terceiros',
                    'Baixa administrativa / descarte',
                    'Ajuste de Inventário',
                    'Outro'
                ]
            };
            
            res.json({ success: true, data: opcoes });
            
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // PROCESSAR INVENTÁRIO COMPLETO
    async processarInventario(req, res) {
        try {
            const { inventario } = req.body;
            
            if (!inventario || !Array.isArray(inventario)) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Dados de inventário inválidos' 
                });
            }

            const resultados = [];
            
            for (const item of inventario) {
                try {
                    const { livro_id, quantidade_fisica, observacoes = 'Ajuste de inventário' } = item;
                    
                    // Verificar estoque atual no sistema
                    const estoqueAtual = await entradaSaidaRepository.verificarEstoque(livro_id);
                    const diferenca = quantidade_fisica - estoqueAtual;
                    
                    if (diferenca > 0) {
                        // Registrar entrada
                        const entrada = new Entrada({
                            livro_id,
                            origem: 'Ajuste de Inventário',
                            observacoes: `${observacoes} - Estoque físico: ${quantidade_fisica}, Sistema: ${estoqueAtual}`,
                            quantidade: diferenca
                        });
                        
                        const entradaId = await entradaSaidaRepository.registrarEntrada(entrada);
                        resultados.push({
                            livro_id,
                            tipo: 'entrada',
                            quantidade: diferenca,
                            success: true,
                            entrada_id: entradaId
                        });
                        
                    } else if (diferenca < 0) {
                        // Registrar saída
                        const saida = new Saida({
                            livro_id,
                            origem: 'Ajuste de Inventário',
                            observacoes: `${observacoes} - Estoque físico: ${quantidade_fisica}, Sistema: ${estoqueAtual}`,
                            quantidade: Math.abs(diferenca)
                        });
                        
                        const saidaId = await entradaSaidaRepository.registrarSaida(saida);
                        resultados.push({
                            livro_id,
                            tipo: 'saida', 
                            quantidade: Math.abs(diferenca),
                            success: true,
                            saida_id: saidaId
                        });
                        
                    } else {
                        // Estoque correto
                        resultados.push({
                            livro_id,
                            tipo: 'nenhum',
                            quantidade: 0,
                            success: true,
                            message: 'Estoque correto'
                        });
                    }
                    
                } catch (error) {
                    resultados.push({
                        livro_id: item.livro_id,
                        success: false,
                        error: error.message
                    });
                }
            }
            
            res.json({
                success: true,
                message: 'Inventário processado com sucesso',
                data: resultados
            });
            
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new EntradaSaidaController();