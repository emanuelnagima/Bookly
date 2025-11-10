const reservasRepository = require('../repository/reservasRepository');
const Reserva = require('../models/Reserva');

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

  async create(req, res) {
    try {
        const reserva = new Reserva(req.body);
        const erros = reserva.validar();
        
        if (erros !== true) {
            return res.status(400).json({ success: false, message: 'Dados inválidos', errors: erros });
        }

        const novaReserva = await reservasRepository.create(reserva); 
        res.status(201).json({ success: true, data: novaReserva, message: 'Reserva criada com sucesso!' });
        
    } catch (error) {
        
        // **Enviar mensagem de erro detalhada**
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
}

    // ** todos os outros métodos inalterados**
    async cancelar(req, res) {
        try {
            const { id } = req.params;
            const reservaCancelada = await reservasRepository.cancelar(id);
            res.json({ success: true, data: reservaCancelada, message: 'Reserva cancelada com sucesso!' });
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
}


module.exports = new ReservasController();