const reservasRepository = require('../repository/reservasRepository');
const Reserva = require('../models/Reserva');
const emprestimosRepository = require('../repository/emprestimosRepository'); 
class ReservasController {
    async getAll(req, res) {
        try {
            const reservas = await reservasRepository.findAll();
            res.json({ success: true, data: reservas, total: reservas.length });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getById(req, res) {
        try {
            const reserva = await reservasRepository.findById(req.params.id);
            reserva
                ? res.json({ success: true, data: reserva })
                : res.status(404).json({ success: false, message: 'Reserva não encontrada' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
''
async create(req, res) {
    try {
        const reserva = new Reserva(req.body);
        const erros = reserva.validar();
        
        if (erros !== true) {
            return res.status(400).json({ 
                success: false, 
                message: 'Dados inválidos', 
                errors: erros 
            });
        }

        const novaReserva = await reservasRepository.create(reserva);
        
        // Se chegou aqui, a reserva foi criada com sucesso
        res.status(201).json({ 
            success: true, 
            data: novaReserva, 
            message: 'Reserva criada com sucesso!' 
        });
        
    } catch (error) {
        console.error('Erro no controller ao criar reserva:', error);
        
        // **SE O ERRO JÁ FOR UM OBJETO ESTRUTURADO (do repository)**
        if (error.type && error.title) {
            return res.status(400).json({
                success: false,
                error: error  // Repassa o objeto completo
            });
        }
        
        // Para erros antigos (string)
        const mensagem = error.message || 'Erro ao processar reserva';
        
        return res.status(500).json({ 
            success: false, 
            message: mensagem 
        });
    }
}

async cancelar(req, res) {
    try {
        const { id } = req.params;
        const { motivo } = req.body; // Receber motivo do frontend
        
        console.log(`Cancelando reserva ${id} com motivo:`, motivo);
        
        const reservaCancelada = await reservasRepository.cancelar(id, motivo);
        
        if (!reservaCancelada) {
            return res.status(400).json({ 
                success: false, 
                message: 'Reserva não encontrada ou já não está ativa' 
            });
        }
        
        res.json({ 
            success: true, 
            data: reservaCancelada, 
            message: 'Reserva cancelada com sucesso!' 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

    async concluir(req, res) {
        try {
            const { id } = req.params;
            const reservaConcluida = await reservasRepository.concluir(id);
            res.json({ success: true, data: reservaConcluida, message: 'Reserva concluída com sucesso!' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            
            const podeEditar = await reservasRepository.podeEditar(id);
            if (!podeEditar) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Reserva não pode ser editada (já cancelada, concluída ou expirada)' 
                });
            }

            const reserva = new Reserva(req.body);
            const erros = reserva.validar();
            
            if (erros !== true) {
                return res.status(400).json({ success: false, message: 'Dados inválidos', errors: erros });
            }

            const reservaAtualizada = await reservasRepository.update(id, reserva);
            res.json({ success: true, data: reservaAtualizada, message: 'Reserva atualizada com sucesso!' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            
            const reserva = await reservasRepository.findById(id);
            if (!reserva) {
                return res.status(404).json({ success: false, message: 'Reserva não encontrada' });
            }

            const deleted = await reservasRepository.delete(id);
            if (deleted) {
                res.json({ success: true, message: 'Reserva excluída com sucesso!' });
            } else {
                res.status(500).json({ success: false, message: 'Erro ao excluir reserva' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async verificarEdicao(req, res) {
        try {
            const { id } = req.params;
            const podeEditar = await reservasRepository.podeEditar(id);
            
            res.json({ 
                success: true, 
                data: { pode_editar: podeEditar } 
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getAtivas(req, res) {
        try {
            const reservas = await reservasRepository.getReservasAtivas();
            res.json({ success: true, data: reservas, total: reservas.length });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getPorLivro(req, res) {
        try {
            const { livroId } = req.params;
            const reservas = await reservasRepository.getReservasPorLivro(livroId);
            res.json({ success: true, data: reservas, total: reservas.length });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    // * Buscar reservas expiradas**
    async getExpiradas(req, res) {
        try {
            const reservas = await reservasRepository.getReservasExpiradas();
            res.json({ 
                success: true, 
                data: reservas, 
                total: reservas.length,
                message: `${reservas.length} reservas expiradas encontradas`
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // **Buscar reservas canceladas**
    async getCanceladas(req, res) {
        try {
            const reservas = await reservasRepository.getReservasPorStatus('cancelada');
            res.json({ 
                success: true, 
                data: reservas, 
                total: reservas.length,
                message: `${reservas.length} reservas canceladas encontradas`
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // **Buscar reservas concluídas**
    async getConcluidas(req, res) {
        try {
            const reservas = await reservasRepository.getReservasPorStatus('concluida');
            res.json({ 
                success: true, 
                data: reservas, 
                total: reservas.length,
                message: `${reservas.length} reservas concluídas encontradas`
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // **Expirar reservas automaticamente**
    async expirarReservas(req, res) {
        try {
            const totalExpiradas = await reservasRepository.expirarReservas();
            res.json({ 
                success: true, 
                message: `${totalExpiradas} reservas expiradas automaticamente`,
                total: totalExpiradas
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
async converterEmEmprestimo(req, res) {
    try {
        const { id } = req.params;
        const { data_devolucao_prevista } = req.body;                    
        
        // 1. Buscar reserva
        const reserva = await reservasRepository.findById(id);
        
        if (!reserva) {
            return res.status(404).json({ success: false, message: 'Reserva não encontrada' });
        }

        // CORREÇÃO: Permitir tanto 'ativa' quanto 'expirada'
        if (reserva.status !== 'ativa' && reserva.status !== 'expirada') {
            return res.status(400).json({ 
                success: false, 
                message: 'Apenas reservas ativas ou expiradas podem ser convertidas em empréstimo' 
            });
        }

        // 2. Verificar disponibilidade para cada livro
        for (const livro of reserva.livros) {
            const disponibilidade = await emprestimosRepository.verificarDisponibilidadeComQuantidade(
                livro.livro_id, 
                livro.quantidade || 1
            );
                        
            if (!disponibilidade.podeEmprestar) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Livro "${livro.livro_titulo}" não está disponível para empréstimo. Disponível: ${disponibilidade.disponivelExato}` 
                });
            }
        }

        // 3. VALIDAÇÃO: Verificar se data de devolução foi fornecida
        if (!data_devolucao_prevista) {
            return res.status(400).json({
                success: false,
                message: 'Data de devolução prevista é obrigatória para conversão'
            });
        }

        // 4. Validar se a data é futura
        const hoje = new Date();
        const dataDevolucao = new Date(data_devolucao_prevista);
        if (dataDevolucao <= hoje) {
            return res.status(400).json({
                success: false,
                message: 'Data de devolução deve ser futura'
            });
        }

        // 5. Criar empréstimo
        const emprestimoData = {
            usuario_id: reserva.usuario_id,
            usuario_tipo: reserva.usuario_tipo,
            data_devolucao_prevista: data_devolucao_prevista, //  USAR DATA DO FRONTEND
            observacoes: `Convertido da reserva #${reserva.id}` + (reserva.observacoes ? ` - ${reserva.observacoes}` : ''),
            livros: reserva.livros.map(livro => ({
                livro_id: livro.livro_id,
                quantidade: livro.quantidade || 1
            }))
        };

        console.log('Criando empréstimo...');
        const novoEmprestimo = await emprestimosRepository.create(emprestimoData);

        // 6. Atualizar status da reserva para "concluida"
        console.log('Atualizando status da reserva...');
        await reservasRepository.concluir(id);
        
        res.json({
            success: true,
            data: {
                emprestimo: novoEmprestimo,
                reserva: await reservasRepository.findById(id)
            },
            message: 'Reserva convertida em empréstimo com sucesso'
        });

    } catch (error) {
        console.error('Erro detalhado ao transformar reserva em empréstimo:', error);
        if (connection) await connection.rollback();
        res.status(500).json({ 
            success: false, 
            message: `Erro ao converter reserva: ${error.message}` 
        });
    }
}
}


exports.getExpiradas = async (req, res) => {
    try {
        const expiradas = await reservasRepository.getReservasExpiradas();
        res.json(expiradas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = new ReservasController();