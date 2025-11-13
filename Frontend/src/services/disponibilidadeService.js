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

            // 2. Verificar disponibilidade geral do livro
            const disponibilidade = await emprestimosService.verificarDisponibilidade(livroId, 1);
            
            if (!disponibilidade.data.podeEmprestar) {
                return {
                    podeReservar: false,
                    motivo: 'Livro indisponível no momento'
                };
            }

            return {
                podeReservar: true
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
            const todasReservas = await reservasService.getAll();
            
            return todasReservas.filter(reserva => 
                reserva.status === 'ativa' && 
                reserva.usuario_id === parseInt(usuarioId) && 
                reserva.usuario_tipo === usuarioTipo &&
                reserva.livros.some(livro => livro.livro_id === parseInt(livroId))
            );
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