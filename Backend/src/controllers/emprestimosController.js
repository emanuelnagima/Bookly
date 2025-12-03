const emprestimosRepository = require('../repository/emprestimosRepository');
const Emprestimo = require('../models/emprestimo');

class EmprestimosController {
    async getAll(req, res) {
        try {
            const emprestimos = await emprestimosRepository.findAll();
            res.json({ success: true, data: emprestimos, total: emprestimos.length });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getById(req, res) {
        try {
            const emprestimo = await emprestimosRepository.findById(req.params.id);
            emprestimo
                ? res.json({ success: true, data: emprestimo })
                : res.status(404).json({ success: false, message: 'Empréstimo não encontrado' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

async create(req, res) {
    try {
        const emprestimo = new Emprestimo(req.body);
        const erros = emprestimo.validar();
        
        if (erros !== true) {
            return res.status(400).json({ 
                success: false, 
                message: 'Dados inválidos', 
                errors: erros,
                debug: {
                    data_recebida: req.body,
                    data_validacao: new Date().toISOString()
                }
            });
        }

        for (const livro of emprestimo.livros) {
            const quantidade = livro.quantidade || 1;
            if (quantidade < 1) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Quantidade inválida para o livro "${livro.titulo || livro.livro_id}"` 
                });
            }
        }

        const novoEmprestimo = await emprestimosRepository.create(emprestimo);
        
        res.status(201).json({ 
            success: true, 
            data: novoEmprestimo, 
            message: 'Empréstimo criado com sucesso!' 
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
}

async verificarDisponibilidade(req, res) {
  try {
    const { livroId } = req.params;
    const { quantidade = 1 } = req.query;
    
    const disponibilidade = await emprestimosRepository.verificarDisponibilidadeComQuantidade(
      livroId, 
      parseInt(quantidade)
    );
    
    res.json({ success: true, data: disponibilidade });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
    async renovar(req, res) {
        try {
            const { id } = req.params;
            const { data_devolucao_prevista } = req.body;

            if (!data_devolucao_prevista) {
                return res.status(400).json({ success: false, message: 'Nova data de devolução é obrigatória' });
            }

            const emprestimoRenovado = await emprestimosRepository.renovar(id, data_devolucao_prevista);
            res.json({ success: true, data: emprestimoRenovado, message: 'Empréstimo renovado com sucesso!' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async finalizar(req, res) {
        try {
            const { id } = req.params;
            const emprestimoFinalizado = await emprestimosRepository.finalizar(id);
            res.json({ success: true, data: emprestimoFinalizado, message: 'Empréstimo finalizado com sucesso!' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getAtivos(req, res) {
        try {
            const emprestimos = await emprestimosRepository.getEmprestimosAtivos();
            res.json({ success: true, data: emprestimos, total: emprestimos.length });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
     async update(req, res) {
        try {
            const { id } = req.params;
            
            // Verificar se empréstimo pode ser editado
            const podeEditar = await emprestimosRepository.podeEditar(id);
            if (!podeEditar) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Empréstimo não pode ser editado (já finalizado ou não encontrado)' 
                });
            }

            const emprestimo = new Emprestimo(req.body);
            const erros = emprestimo.validar();
            
            if (erros !== true) {
                return res.status(400).json({ success: false, message: 'Dados inválidos', errors: erros });
            }

            // Verificar disponibilidade dos livros (exceto os que já estão no empréstimo)
            const emprestimoAtual = await emprestimosRepository.findById(id);
            const livrosAtuaisIds = emprestimoAtual.livros.map(l => l.livro_id);
            
            for (const livro of emprestimo.livros) {
                if (!livrosAtuaisIds.includes(livro.livro_id)) {
                    const disponivel = await emprestimosRepository.verificarDisponibilidadeLivro(livro.livro_id);
                    if (!disponivel) {
                        return res.status(400).json({ 
                            success: false, 
                            message: `Livro "${livro.titulo || livro.livro_id}" não está disponível` 
                        });
                    }
                }
            }

            const emprestimoAtualizado = await emprestimosRepository.update(id, emprestimo);
            res.json({ success: true, data: emprestimoAtualizado, message: 'Empréstimo atualizado com sucesso!' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
async verificarEstoqueDisponivel(req, res) {
  try {
    const { livroId } = req.params;
    
    // 1. Estoque físico
    const estoqueFisico = await entradaSaidaRepository.verificarEstoque(livroId);
    
    // 2. Empréstimos ativos
    const [emprestimosAtivos] = await db.execute(
      `SELECT SUM(quantidade) as total_emprestado
       FROM emprestimo_livros el
       JOIN emprestimos e ON el.emprestimo_id = e.id
       WHERE el.livro_id = ? AND e.status = 'ativo'`,
      [livroId]
    );
    
    const totalEmprestado = emprestimosAtivos[0].total_emprestado || 0;
    const estoqueDisponivel = estoqueFisico - totalEmprestado;
    
    res.json({ 
      success: true, 
      data: { 
        estoqueDisponivel,
        estoqueFisico,
        totalEmprestado
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

    async delete(req, res) {
        try {
            // Redirecionar para cancelamento em vez de exclusão
            return this.cancelar(req, res);
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }


    async verificarEdicao(req, res) {
        try {
            const { id } = req.params;
            const podeEditar = await emprestimosRepository.podeEditar(id);
            
            res.json({ 
                success: true, 
                data: { pode_editar: podeEditar } 
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async getAtrasados(req, res) {
        try {
            const emprestimos = await emprestimosRepository.getEmprestimosAtrasados();
            res.json({ success: true, data: emprestimos, total: emprestimos.length });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }


async cancelar(req, res) {
    try {
        const { id } = req.params;
        const { motivo_cancelamento } = req.body;
        
        const emprestimoCancelado = await emprestimosRepository.cancelar(id, motivo_cancelamento);
        res.json({ 
            success: true, 
            data: emprestimoCancelado, 
            message: 'Empréstimo cancelado com sucesso!' 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

async getCancelados(req, res) {
    try {
        const emprestimos = await emprestimosRepository.getEmprestimosCancelados();
        res.json({ 
            success: true, 
            data: emprestimos, 
            total: emprestimos.length 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

    async getOpcoesUsuarios(req, res) {
        try {
            // Buscar alunos, professores e usuários especiais para seleção
            const [alunos, professores, usuariosEspeciais] = await Promise.all([
                require('../repository/alunosRepository').findAll(),
                require('../repository/professoresRepository').findAll(),
                require('../repository/usuariosEspeciaisRepository').findAll()
            ]);

            res.json({
                success: true,
                data: {
                    alunos: alunos.map(a => ({ id: a.id, nome: a.nome, tipo: 'aluno' })),
                    professores: professores.map(p => ({ id: p.id, nome: p.nome, tipo: 'professor' })),
                    usuarios_especiais: usuariosEspeciais.map(u => ({ id: u.id, nome: u.nome_completo, tipo: 'usuario_especial' }))
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

async atualizarStatus(req, res) {
    try {
        const resultado = await emprestimosRepository.atualizarStatusAtrasados();
        
        res.json({ 
            success: true, 
            message: 'Status dos empréstimos atualizados com sucesso!',
            data: resultado 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
}

}

module.exports = new EmprestimosController();