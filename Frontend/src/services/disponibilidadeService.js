import emprestimosService from './emprestimosService';
import reservasService from './reservasService';

const API_BASE_URL = 'http://localhost:3000/api';

class DisponibilidadeService {
    
    async verificarDisponibilidadeParaEmprestimo(livroId, quantidade = 1, usuarioIgnorar = null) {
        try {
            // Verificar disponibilidade básica
            const disponibilidade = await emprestimosService.verificarDisponibilidade(livroId, quantidade);
            
            if (!disponibilidade.data.podeEmprestar) {
                return {
                    podeEmprestar: false,
                    motivo: 'Estoque insuficiente',
                    disponivelExato: disponibilidade.data.disponivelExato
                };
            }

            // VERIFICAÇÃO CRÍTICA: Se quantidade_disponivel = 1, verificar se há reservas ativas de outros usuários
            if (disponibilidade.data.disponivelExato === 1) {
                const reservasAtivas = await this.verificarReservasAtivas(livroId, usuarioIgnorar);
                
                if (reservasAtivas.length > 0) {
                    return {
                        podeEmprestar: false,
                        motivo: 'Livro reservado por outro usuário (último exemplar)',
                        reservasAtivas: reservasAtivas,
                        disponivelExato: 1
                    };
                }
            }

            return {
                podeEmprestar: true,
                disponivelExato: disponibilidade.data.disponivelExato
            };

        } catch (error) {
            console.error('Erro ao verificar disponibilidade:', error);
            throw error;
        }
    }

    async verificarReservasAtivas(livroId, usuarioIgnorar = null) {
        try {
            // Buscar reservas ativas para o livro
            const todasReservas = await reservasService.getAll();
            
            return todasReservas.filter(reserva => 
                reserva.status === 'ativa' && 
                new Date(reserva.data_validade) >= new Date() &&
                reserva.livros.some(livro => livro.livro_id === parseInt(livroId)) &&
                // Ignorar reservas do próprio usuário (para conversão)
                !(usuarioIgnorar && 
                  reserva.usuario_id === usuarioIgnorar.id && 
                  reserva.usuario_tipo === usuarioIgnorar.tipo)
            );
        } catch (error) {
            console.error('Erro ao buscar reservas ativas:', error);
            return [];
        }
    }

async verificarPodeReservar(usuarioId, usuarioTipo, livroId) {
    try {
        
        // 1. Verificar se usuário já tem reserva ativa para este livro
        const reservasAtivasUsuario = await this.verificarReservasAtivasPorUsuario(usuarioId, usuarioTipo, livroId);
        
        if (reservasAtivasUsuario.length > 0) {
            return {
                podeReservar: false,
                motivo: 'Usuário já possui reserva ativa para este livro'
            };
        }

        const estoqueInfo = await this.calcularDisponibilidadeDireta(livroId);
        
        
        if (estoqueInfo.disponivelReal < 1) {
            return {
                podeReservar: false,
                motivo: `Estoque insuficiente. Disponível: ${estoqueInfo.disponivelReal}`,
                disponivelExato: estoqueInfo.disponivelReal
            };
        }

        return {
            podeReservar: true,
            disponivelExato: estoqueInfo.disponivelReal
        };

    } catch (error) {
        console.error('Erro ao verificar se pode reservar:', error);
        return { 
            podeReservar: false, 
            motivo: 'Erro ao verificar disponibilidade' 
        };
    }
}


async verificarReservasAtivasPorUsuario(usuarioId, usuarioTipo, livroId) {
    try {
        console.log(`Verificando reservas ativas para usuário ${usuarioId} (${usuarioTipo}), livro ${livroId}`);
        
        const todasReservas = await reservasService.getAll();
        console.log(`Total de reservas carregadas: ${todasReservas.length}`);
        
        const reservasFiltradas = todasReservas.filter(reserva => {
            console.log(`Reserva ${reserva.id}: status=${reserva.status}, usuario_id=${reserva.usuario_id}, usuario_tipo=${reserva.usuario_tipo}`);
            
            // Verificar status
            const hoje = new Date();
            const dataValidade = new Date(reserva.data_validade);
            const estaExpirada = dataValidade < hoje;
            const statusEfetivo = estaExpirada ? 'expirada' : reserva.status;
            
            // Verificar se é do mesmo usuário
            const mesmoUsuario = parseInt(reserva.usuario_id) === parseInt(usuarioId) && 
                                 reserva.usuario_tipo === usuarioTipo;
            
            // Verificar se contém o livro
            const temLivro = reserva.livros && 
                            reserva.livros.some(livro => parseInt(livro.livro_id) === parseInt(livroId));
            
            // Verificar se está realmente ativa (não expirada, não cancelada, não concluída)
            const estaAtiva = statusEfetivo === 'ativa';
            
            const resultado = estaAtiva && mesmoUsuario && temLivro;
            
            if (resultado) {
                console.log(`ENCONTRADA reserva ativa: ${reserva.id} para livro ${livroId}`);
            }
            
            return resultado;
        });
        
        console.log(`Reservas ativas encontradas: ${reservasFiltradas.length}`);
        return reservasFiltradas;
    } catch (error) {
        console.error('Erro ao buscar reservas do usuário:', error);
        return [];
    }
}

    async converterReservaEmEmprestimo(reservaId, dataDevolucaoPrevista) {
        try {
            console.log(`=== SERVICE: Convertendo reserva ${reservaId} ===`);
            
            // VALIDAR DATA ANTES DE ENVIAR
            if (!dataDevolucaoPrevista) {
                throw new Error('Data de devolução prevista é obrigatória');
            }

            const hoje = new Date();
            const dataDevolucao = new Date(dataDevolucaoPrevista);
            if (dataDevolucao <= hoje) {
                throw new Error('Data de devolução deve ser futura');
            }

            const response = await fetch(`${API_BASE_URL}/reservas/${reservaId}/converter-emprestimo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    data_devolucao_prevista: dataDevolucaoPrevista
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Erro ao converter reserva em empréstimo:', error);
            throw error;
        }
    }
async calcularDisponibilidadeDireta(livroId) {
    try {
        // Usar a mesma lógica do ReservasRepository.create()
        const response = await fetch(`http://localhost:3000/api/entrada-saida/estoque-disponivel/${livroId}`, {
            credentials: 'include'
        });
        
        if (response.ok) {
            const result = await response.json();
            return {
                estoqueFisico: result.data.estoqueFisico || 0,
                totalEmprestado: result.data.totalEmprestado || 0,
                totalReservado: result.data.totalReservado || 0,
                disponivelReal: result.data.estoqueDisponivel || 0
            };
        }
        
        // Fallback: cálculo manual
        console.warn('API de estoque não disponível, usando cálculo manual');
        const [livroRows] = await db.execute(
            'SELECT estoque FROM livros WHERE id = ?',
            [livroId]
        );
        
        const estoqueFisico = livroRows[0]?.estoque || 0;
        
        // Calcular empréstimos ativos (mesma lógica do ReservasRepository)
        const [emprestimosAtivos] = await db.execute(
            `SELECT COALESCE(SUM(el.quantidade), 0) as total_emprestado
             FROM emprestimo_livros el
             JOIN emprestimos e ON el.emprestimo_id = e.id
             WHERE el.livro_id = ? 
             AND e.status IN ('ativo', 'atrasado')`,
            [livroId]
        );
        
        const totalEmprestado = emprestimosAtivos[0]?.total_emprestado || 0;
        
        // Calcular reservas ativas (mesma lógica do ReservasRepository)
        const [reservasAtivas] = await db.execute(
            `SELECT COALESCE(SUM(rl.quantidade), 0) as total_reservado
             FROM reserva_livros rl
             JOIN reservas r ON rl.reserva_id = r.id
             WHERE rl.livro_id = ? 
             AND r.status = 'ativa'
             AND r.data_validade >= CURDATE()`,
            [livroId]
        );
        
        const totalReservado = reservasAtivas[0]?.total_reservado || 0;
        
        const disponivelReal = estoqueFisico - totalEmprestado - totalReservado;
        
        return {
            estoqueFisico,
            totalEmprestado,
            totalReservado,
            disponivelReal
        };
        
    } catch (error) {
        console.error('Erro ao calcular disponibilidade direta:', error);
        throw error;
    }
}
    // Verificação completa para novo empréstimo
    async verificarPodeEmprestar(livroId, quantidade = 1, usuario = null) {
        try {
            // 1. Verificar disponibilidade básica
            const disponibilidadeBasica = await this.verificarDisponibilidadeParaEmprestimo(
                livroId, 
                quantidade, 
                usuario
            );

            if (!disponibilidadeBasica.podeEmprestar) {
                return {
                    podeEmprestar: false,
                    motivo: disponibilidadeBasica.motivo,
                    disponivelExato: disponibilidadeBasica.disponivelExato,
                    tipo: 'estoque_insuficiente'
                };
            }

            // 2. Verificar se é o último exemplar e há reservas de outros usuários
            if (disponibilidadeBasica.disponivelExato === 1) {
                const reservasAtivas = await this.verificarReservasAtivas(livroId, usuario);
                
                if (reservasAtivas.length > 0) {
                    return {
                        podeEmprestar: false,
                        motivo: 'Último exemplar está reservado para outro usuário',
                        reservasAtivas: reservasAtivas,
                        disponivelExato: 1,
                        tipo: 'reserva_ativa_outro_usuario'
                    };
                }
            }

            // 3. Verificar se há reservas ativas em geral (para qualquer quantidade)
            const todasReservasAtivas = await this.verificarReservasAtivas(livroId);
            if (todasReservasAtivas.length > 0 && disponibilidadeBasica.disponivelExato <= todasReservasAtivas.length) {
                return {
                    podeEmprestar: false,
                    motivo: `Existem ${todasReservasAtivas.length} reserva(s) ativa(s) para este livro`,
                    reservasAtivas: todasReservasAtivas,
                    disponivelExato: disponibilidadeBasica.disponivelExato,
                    tipo: 'reservas_ativas'
                };
            }

            return {
                podeEmprestar: true,
                disponivelExato: disponibilidadeBasica.disponivelExato,
                tipo: 'disponivel'
            };

        } catch (error) {
            console.error('Erro na verificação completa:', error);
            throw error;
        }
    }
}

export default new DisponibilidadeService();