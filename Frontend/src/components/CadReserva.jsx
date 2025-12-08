import { useState, useEffect } from 'react';
import { Card, Form, Col, Row, Button, Spinner, Alert, Badge, ListGroup } from 'react-bootstrap';
import { BsCheckCircle, BsPlusCircle, BsTrash, BsExclamationTriangle } from "react-icons/bs";
import { FaBook, FaUser, FaExclamationTriangle, FaTimes } from "react-icons/fa";
import livroService from '../services/livroService';
import emprestimosService from '../services/emprestimosService';
import disponibilidadeService from '../services/disponibilidadeService';

const CadReserva = ({ onSave, onCancel, reserva, loading }) => {
  const [formData, setFormData] = useState({
    usuario_id: '',
    usuario_tipo: '',
    data_validade: '',
    observacoes: ''
  });

  const [livrosSelecionados, setLivrosSelecionados] = useState([]);
  const [livroAtual, setLivroAtual] = useState({ livro_id: '' });
  const [opcoesUsuarios, setOpcoesUsuarios] = useState({
    alunos: [],
    professores: [],
    usuarios_especiais: []
  });

  const [livrosDisponiveis, setLivrosDisponiveis] = useState([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState('');
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [verificandoDisponibilidade, setVerificandoDisponibilidade] = useState(false);
  const [disponibilidadeGeral, setDisponibilidadeGeral] = useState({});

  // Carregar opções e disponibilidade
  useEffect(() => {
    const carregarOpcoes = async () => {
      try {
        setOptionsLoading(true);

        const usuariosData = await emprestimosService.getOpcoesUsuarios();
        setOpcoesUsuarios(usuariosData.data || usuariosData);

        const livrosData = await livroService.getAllComEstoque();
        setLivrosDisponiveis(livrosData);

        // Verificar disponibilidade de todos os livros
        await verificarDisponibilidadeTodosLivros(livrosData);

      } catch (err) {
        console.error('Erro ao carregar opções:', err);
        setError('Erro ao carregar dados');
      } finally {
        setOptionsLoading(false);
      }
    };

    carregarOpcoes();
  }, []);

  // VERIFICAR DISPONIBILIDADE DE TODOS OS LIVROS 
  const verificarDisponibilidadeTodosLivros = async (livros) => {
    try {
      setVerificandoDisponibilidade(true);
      const novaDisponibilidade = {};

      for (const livro of livros) {
        try {
          // Verificar disponibilidade básica usando o mesmo método do empréstimo
          if (emprestimosService.verificarDisponibilidade) {
            const result = await emprestimosService.verificarDisponibilidade(livro.id, 1);
            novaDisponibilidade[livro.id] = {
              ...result.data,
              podeReservar: result.data.podeEmprestar // Para reservas, usa a mesma lógica de disponibilidade
            };
          } else {
            // Fallback: usar estoque físico
            novaDisponibilidade[livro.id] = {
              podeReservar: (livro.estoque || 0) >= 1,
              disponivelExato: livro.estoque || 0,
              estoqueFisico: livro.estoque || 0,
              totalEmprestado: 0
            };
          }
        } catch (error) {
          console.error(`Erro ao verificar disponibilidade livro ${livro.id}:`, error);
          // Fallback em caso de erro
          novaDisponibilidade[livro.id] = {
            podeReservar: (livro.estoque || 0) >= 1,
            disponivelExato: livro.estoque || 0,
            estoqueFisico: livro.estoque || 0,
            totalEmprestado: 0
          };
        }
      }

      setDisponibilidadeGeral(novaDisponibilidade);
    } catch (error) {
      console.error('Erro ao verificar disponibilidade geral:', error);
    } finally {
      setVerificandoDisponibilidade(false);
    }
  };

  const recarregarLivrosDisponiveis = async () => {
    try {
      const livrosData = await livroService.getAllComEstoque();
      setLivrosDisponiveis(livrosData);
      await verificarDisponibilidadeTodosLivros(livrosData);
    } catch (err) {
      console.error('Erro ao recarregar livros:', err);
    }
  };

  // Preencher dados se for edição
  useEffect(() => {
    if (reserva) {
      setFormData({
        usuario_id: reserva.usuario_id?.toString() || '',
        usuario_tipo: reserva.usuario_tipo || '',
        data_validade: reserva.data_validade || '',
        observacoes: reserva.observacoes || ''
      });

      if (reserva.livros && reserva.livros.length > 0) {
        setLivrosSelecionados(reserva.livros);
      } else if (reserva.livro_id) {
        setLivrosSelecionados([{
          livro_id: reserva.livro_id,
          quantidade: 1,
          livro_titulo: reserva.livro_titulo,
          livro_isbn: reserva.livro_isbn,
          autor_nome: reserva.autor_nome
        }]);
      }

      if (reserva.usuario_id && reserva.usuario_tipo) {
        buscarUsuario(reserva.usuario_id, reserva.usuario_tipo);
      }
    }
  }, [reserva]);

  // Re-verificar disponibilidade quando usuário mudar 
  useEffect(() => {
    if (livrosDisponiveis.length > 0) {
      verificarDisponibilidadeTodosLivros(livrosDisponiveis);
    }
  }, [formData.usuario_id, formData.usuario_tipo]);

  const formatarNome = (nome) => {
    if (!nome) return '';
    return nome
      .toLowerCase()
      .split(' ')
      .map(p => p.charAt(0).toUpperCase() + p.slice(1))
      .join(' ');
  };

  const buscarUsuario = async (usuarioId, usuarioTipo) => {
    try {
      let usuario = null;

      switch (usuarioTipo) {
        case 'aluno':
          usuario = opcoesUsuarios.alunos?.find(a => a.id === parseInt(usuarioId));
          break;
        case 'professor':
          usuario = opcoesUsuarios.professores?.find(p => p.id === parseInt(usuarioId));
          break;
        case 'usuario_especial':
          usuario = opcoesUsuarios.usuarios_especiais?.find(u => u.id === parseInt(usuarioId));
          break;
      }

      setUsuarioSelecionado(usuario);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'usuario_id' && formData.usuario_tipo) {
      buscarUsuario(value, formData.usuario_tipo);
    }

    if (name === 'usuario_tipo' && formData.usuario_id) {
      buscarUsuario(formData.usuario_id, value);
    }
  };

  const handleLivroChange = (e) => {
    const { name, value } = e.target;
    setLivroAtual(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getLivrosOrganizados = () => {
    const livrosParaAdicionar = getLivrosDisponiveisParaAdicionar();

    return livrosParaAdicionar.sort((a, b) => {
      const aDisponivel = podeReservarLivro(a.id);
      const bDisponivel = podeReservarLivro(b.id);

      // Disponíveis primeiro (true vem antes de false)
      if (aDisponivel && !bDisponivel) return -1;
      if (!aDisponivel && bDisponivel) return 1;

      // Se ambos têm mesma disponibilidade, ordena por título
      return a.titulo.localeCompare(b.titulo);
    });
  };

  // FUNÇÃO PARA VERIFICAR SE PODE RESERVAR 
  const podeReservarLivro = (livroId) => {
    const info = disponibilidadeGeral[livroId];
    if (!info) {
      // Se não tem info, verifica estoque básico
      const livro = livrosDisponiveis.find(l => l.id === parseInt(livroId));
      return livro ? (livro.estoque || 0) >= 1 : false;
    }
    return info.podeReservar && info.disponivelExato >= 1;
  };

  // FUNÇÃO PARA CALCULAR DISPONIBILIDADE
  const calcularDisponibilidade = (livroId) => {
    const info = disponibilidadeGeral[livroId];
    if (!info) {
      // Se não tem info de disponibilidade, mostra estoque físico
      const livro = livrosDisponiveis.find(l => l.id === parseInt(livroId));
      return livro ? (livro.estoque || 0) : '...';
    }
    return info.disponivelExato;
  };

  // FUNÇÃO PARA OBTER STATUS DE DISPONIBILIDADE (para estilização) 
  const getStatusDisponibilidade = (livroId) => {
    const podeReservar = podeReservarLivro(livroId);
    const disponivel = calcularDisponibilidade(livroId);

    if (disponivel === '...' || disponivel === undefined) {
      return {
        texto: 'Carregando...',
        classe: 'text-muted',
        badge: 'secondary',
        icon: <Spinner animation="border" size="sm" className="me-1" />
      };
    }

    if (podeReservar) {
      return {
        texto: `Disponível (${disponivel})`,
        icon: <BsCheckCircle className="me-1" />
      };
    } else {
      return {
        texto: `Indisponível (${disponivel})`,
        icon: <BsExclamationTriangle className="me-1" />
      };
    }
  };

  const adicionarLivro = async () => {
    if (!livroAtual.livro_id) {
      setError({
        type: 'livro_nao_selecionado',
        title: 'Livro Não Selecionado',
        message: 'Selecione um livro para adicionar',
        style: 'warning'
      });
      return;
    }

    // Verificar se o livro já foi adicionado
    const livroExistente = livrosSelecionados.find(l => l.livro_id === parseInt(livroAtual.livro_id));
    if (livroExistente) {
      setError({
        type: 'livro_duplicado',
        title: 'Livro Duplicado',
        message: 'Este livro já foi adicionado à reserva',
        style: 'warning'
      });
      return;
    }

    const livroCompleto = livrosDisponiveis.find(l => l.id === parseInt(livroAtual.livro_id));
    if (!livroCompleto) {
      setError({
        type: 'livro_nao_encontrado',
        title: 'Livro Não Encontrado',
        message: 'Livro não encontrado no sistema',
        style: 'danger'
      });
      return;
    }

    // VERIFICAÇÃO DE DISPONIBILIDADE COM MENSAGENS PADRONIZADAS
    try {
      const verificacao = await disponibilidadeService.verificarPodeReservar(
        formData.usuario_id,
        formData.usuario_tipo,
        livroAtual.livro_id
      );

      if (!verificacao.podeReservar) {
        let errorObject = {};

        // MENSAGENS PADRONIZADAS IGUAIS AO EMPRÉSTIMO
        if (verificacao.motivo?.includes('limite')) {
          errorObject = {
            type: 'limite_reservas_usuario',
            title: 'Limite de Reservas',
            message: `Não é possível reservar "${livroCompleto.titulo}"`,
            detalhe: 'Você atingiu o limite máximo de reservas ativas',
            style: 'warning'
          };
        } else if (verificacao.motivo?.includes('Estoque')) {
          errorObject = {
            type: 'estoque_insuficiente_reserva',
            title: 'Estoque Insuficiente',
            message: `Não há exemplares disponíveis de "${livroCompleto.titulo}"`,
            disponivel: verificacao.disponivelExato || 0,
            estilo: 'warning'
          };
        } else if (verificacao.motivo?.includes('já possui')) {
          errorObject = {
            type: 'reserva_ativa_usuario',
            title: 'Reserva Ativa',
            message: `Usuário já possui uma reserva para "${livroCompleto.titulo}"`,
            detalhe: 'Cada usuário pode ter apenas uma reserva por livro',
            style: 'warning'
          };
        } else {
          errorObject = {
            type: 'indisponivel_reserva',
            title: 'Livro Indisponível',
            message: `Não é possível reservar "${livroCompleto.titulo}"`,
            detalhe: verificacao.motivo,
            style: 'warning'
          };
        }

        setError(errorObject);
        return;
      }
    } catch (error) {
      console.error('Erro na verificação:', error);
      setError({
        type: 'erro_verificacao',
        title: 'Erro de Verificação',
        message: 'Erro ao verificar disponibilidade do livro',
        detalhe: error.message,
        style: 'danger'
      });
      return;
    }

    const novoLivro = {
      livro_id: parseInt(livroAtual.livro_id),
      quantidade: 1, // SEMPRE 1 para reservas
      livro_titulo: livroCompleto.titulo,
      livro_isbn: livroCompleto.isbn,
      autor_nome: livroCompleto.autor_nome,
      livro_imagem: livroCompleto.imagem
    };

    setLivrosSelecionados(prev => [...prev, novoLivro]);
    setLivroAtual({ livro_id: '' });
    setError('');
  };
  const removerLivro = (livroId) => {
    setLivrosSelecionados(prev => prev.filter(l => l.livro_id !== livroId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.usuario_id || !formData.usuario_tipo || !formData.data_validade) {
      setValidated(true);
      return;
    }

    if (livrosSelecionados.length === 0) {
      setError({
        type: 'sem_livros',
        title: 'Livros Necessários',
        message: 'Adicione pelo menos um livro à reserva',
        style: 'warning'
      });
      return;
    }

    try {
      setError('');

      const dadosReserva = {
        usuario_id: formData.usuario_id,
        usuario_tipo: formData.usuario_tipo,
        data_validade: formData.data_validade,
        observacoes: formData.observacoes,
        livros: livrosSelecionados
      };

      console.log('Enviando reserva...');
      await onSave(dadosReserva);
      await recarregarLivrosDisponiveis();

    } catch (err) {
      console.error('=== ERRO NO handleSubmit (CadReserva) ===');
      console.error('Tipo do erro:', typeof err);
      console.error('Erro completo:', err);

      if (err instanceof Error) {
        console.log('É instância de Error, message:', err.message);
        // Se a mensagem for JSON, tente parsear
        if (err.message && err.message.startsWith('{')) {
          try {
            const parsed = JSON.parse(err.message);
            if (parsed.type && parsed.title) {
              setError(parsed);
              return;
            }
          } catch (e) {
            // Não é JSON, continuar
          }
        }
        // Se não, usar como mensagem simples
        setError({
          type: 'erro_generico',
          title: 'Erro',
          message: err.message,
          style: 'danger'
        });
      }
      // **Se for objeto estruturado (deve ser este caso)**
      else if (err && typeof err === 'object' && err.type && err.title) {
        console.log('É objeto estruturado, definindo error');
        setError(err);
      }
      // **Se for string (fallback)**
      else if (typeof err === 'string') {
        console.log('É string simples');
        setError({
          type: 'erro_string',
          title: 'Erro na Reserva',
          message: err,
          style: 'danger'
        });
      }
      // **Se for qualquer outra coisa**
      else {
        console.log('Erro desconhecido, usando fallback');
        setError({
          type: 'erro_desconhecido',
          title: 'Erro Desconhecido',
          message: 'Não foi possível completar a reserva',
          style: 'danger'
        });
      }
    }
  };

  const getUsuariosPorTipo = () => {
    switch (formData.usuario_tipo) {
      case 'aluno':
        return opcoesUsuarios.alunos || [];
      case 'professor':
        return opcoesUsuarios.professores || [];
      case 'usuario_especial':
        return opcoesUsuarios.usuarios_especiais || [];
      default:
        return [];
    }
  };

  const formatarTipoUsuario = (tipo) => {
    if (!tipo) return '';
    const textoFormatado = tipo.replace('_', ' ');
    return textoFormatado
      .split(' ')
      .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
      .join(' ');
  };

  const getLivrosDisponiveisParaAdicionar = () => {
    const livrosAdicionadosIds = livrosSelecionados.map(l => l.livro_id);
    return livrosDisponiveis.filter(livro => !livrosAdicionadosIds.includes(livro.id));
  };

  const hoje = new Date().toISOString().split('T')[0];

  return (
    <Card className="shadow-sm">
      <Card.Header className='bg-primary text-white'>
        <h5 className='mb-0'>
          {reserva ? 'Editar Reserva' : 'Nova Reserva'}
        </h5>
      </Card.Header>
      <Card.Body>

        {error && (
          (() => {
            // Se for objeto estruturado
            if (typeof error === 'object' && error.title) {
              return (
                <div className={`alert alert-${error.style || 'warning'} py-2 mb-3 d-flex align-items-center`}>
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center">
                      <div className={`bg-${error.style || 'warning'} text-white rounded-circle d-flex align-items-center justify-content-center me-2`}
                        style={{ width: '20px', height: '20px', fontSize: '12px' }}>
                        {error.style === 'danger' ? '✗' : '!'}
                      </div>
                      <strong className="text-dark">{error.title}</strong>
                    </div>
                    <div className="mt-1 small">
                      {error.message}

                      {/* SITUAÇÃO DETALHADA - NOVO */}
                      {error.situacao && (
                        <div className="mt-2 p-2">
                          <small className="text-muted d-block mb-1"><strong>Situação:</strong></small>
                          <div>{error.situacao}</div>
                        </div>
                      )}

                      {/* LIVRO (se tiver) */}
                      {error.livro && (
                        <div className="mt-1">
                          <strong>Livro:</strong> "{error.livro}"
                        </div>
                      )}

                      {/* SUGESTÃO (se tiver) */}
                      {error.sugestao && (
                        <div className="mt-1 text">
                          <em>{error.sugestao}</em>
                        </div>
                      )}

                      {/* DETALHE (se tiver) - removendo o antigo detalhe técnico */}
                      {error.detalhe && !error.situacao && (
                        <div className="mt-1">
                          {error.detalhe}
                        </div>
                      )}
                    </div>
                  </div>
                  <FaTimes
                    className="text-muted ms-2"
                    onClick={() => setError('')}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              );
            }

            return (
              <Alert variant="danger" dismissible onClose={() => setError('')}>
                <div className="d-flex align-items-start">
                  <div>
                    <div style={{ whiteSpace: 'pre-line' }}>
                      {error}
                    </div>
                  </div>
                </div>
              </Alert>
            );
          })()
        )}
        {verificandoDisponibilidade && (
          <Alert variant="info" className="py-2">
            <Spinner animation="border" size="sm" className="me-2" />
            Verificando disponibilidade dos livros...
          </Alert>
        )}

        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          {/* 1. SELEÇÃO DO USUÁRIO */}
          <Row>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='usuario_tipo'>
                <Form.Label>Tipo de Usuário:</Form.Label>
                <Form.Select
                  name="usuario_tipo"
                  value={formData.usuario_tipo}
                  onChange={handleChange}
                  required
                  disabled={loading || optionsLoading}
                >
                  <option value="">{optionsLoading ? 'Carregando...' : 'Selecione o tipo'}</option>
                  <option value="aluno">Aluno</option>
                  <option value="professor">Professor</option>
                  <option value="usuario_especial">Usuário Especial</option>
                </Form.Select>
                <Form.Control.Feedback type='invalid'>
                  Selecione o tipo de usuário
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='usuario_id'>
                <Form.Label>Usuário:</Form.Label>
                <Form.Select
                  name="usuario_id"
                  value={formData.usuario_id}
                  onChange={handleChange}
                  required
                  disabled={loading || optionsLoading || !formData.usuario_tipo}
                >
                  <option value="">Selecione um usuário</option>
                  {getUsuariosPorTipo().map(usuario => (
                    <option key={usuario.id} value={usuario.id}>
                      {formatarNome(usuario.nome)}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type='invalid'>
                  Selecione um usuário
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          {/* Informações do Usuário Selecionado */}
          {usuarioSelecionado && (
            <Alert variant="info" className="py-2 d-inline-block">
              <div className="d-flex align-items-center">
                <FaUser className="me-2" />
                <div>
                  <strong>Usuário selecionado:</strong> {usuarioSelecionado.nome}
                  <span className="ms-2 text-muted fst-italic">
                    ({formatarTipoUsuario(formData.usuario_tipo)})
                  </span>
                </div>
              </div>
            </Alert>
          )}

          {/* 2. DATA DE VALIDADE */}
          <Row>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='data_validade'>
                <Form.Label>Data de Expiração da Reserva:</Form.Label>
                <Form.Control
                  type='date'
                  name='data_validade'
                  value={formData.data_validade}
                  onChange={handleChange}
                  required
                  min={hoje}
                  disabled={loading}
                />
                <Form.Control.Feedback type='invalid'>
                  Informe uma data de validade válida
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  A reserva será válida até esta data
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          {/* 3. LIVROS DA RESERVA */}
          <Card className="mb-3">
            <Card.Header className="bg-primary">
              <h6 className="mb-0">Livros da Reserva</h6>
            </Card.Header>
            <Card.Body>
              {/* Lista de Livros Selecionados */}
              {livrosSelecionados.length > 0 && (
                <ListGroup className="mb-3">
                  {livrosSelecionados.map((livro, index) => (
                    <ListGroup.Item key={livro.livro_id} className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{livro.livro_titulo}</strong>
                        <br />
                        <small className="text-muted">
                          Autor: {livro.autor_nome} | ISBN: {livro.livro_isbn}
                        </small>
                      </div>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removerLivro(livro.livro_id)}
                        title="Remover livro"
                      >
                        <BsTrash />
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}

              {/* Adicionar Novo Livro */}
              <Card className="border-dashed">
                <Row className="align-items-end">
                  <Col md={10}>
                    <Form.Label>Adicionar Livro:</Form.Label>
                    <Form.Select
                      name="livro_id"
                      value={livroAtual.livro_id}
                      onChange={handleLivroChange}
                      disabled={loading || optionsLoading || verificandoDisponibilidade}
                    >
                      <option value="">
                        {verificandoDisponibilidade ? 'Carregando disponibilidade...' : 'Selecione um livro para adicionar'}
                      </option>

                      {/* GRUPO DE LIVROS DISPONÍVEIS */}
                      <optgroup label=" Livros Disponíveis">
                        {getLivrosOrganizados()
                          .filter(livro => podeReservarLivro(livro.id))
                          .map(livro => {
                            const status = getStatusDisponibilidade(livro.id);
                            return (
                              <option
                                key={livro.id}
                                value={livro.id}
                              >
                                {formatarNome(livro.titulo)} - {formatarNome(livro.autor_nome)}
                                {' - '}
                                <span className={status.classe}>
                                  {status.icon}
                                  {status.texto}
                                </span>
                              </option>
                            );
                          })}
                      </optgroup>

                      {/* GRUPO DE LIVROS INDISPONÍVEIS */}
                      <optgroup label=" Livros Indisponíveis" className="text-muted">
                        {getLivrosOrganizados()
                          .filter(livro => !podeReservarLivro(livro.id))
                          .map(livro => {
                            const status = getStatusDisponibilidade(livro.id);
                            return (
                              <option
                                key={livro.id}
                                value={livro.id}
                                disabled
                                className={status.classe}
                              >
                                {formatarNome(livro.titulo)} - {formatarNome(livro.autor_nome)}
                                {' - '}
                                <span className={status.classe}>
                                  {status.icon}
                                  {status.texto}
                                </span>
                              </option>
                            );
                          })}
                      </optgroup>
                    </Form.Select>

                    {/* FEEDBACK VISUAL  */}
                    {livroAtual.livro_id && (
                      <div className="mt-2">
                        {disponibilidadeGeral[livroAtual.livro_id] && (
                          <Alert
                            variant={podeReservarLivro(livroAtual.livro_id) ? "success" : "danger"}
                            className="py-2 mb-0"
                          >
                            <div className="d-flex align-items-center">
                              {podeReservarLivro(livroAtual.livro_id) ? (
                                <>
                                  <BsCheckCircle className="me-2" />
                                  <strong>Disponível para reserva</strong>
                                </>
                              ) : (
                                <>
                                  <BsExclamationTriangle className="me-2" />
                                  <strong>Indisponível para reserva</strong>
                                </>
                              )}
                              <span className="ms-2">
                                (Disponível: {calcularDisponibilidade(livroAtual.livro_id)} unidade(s))
                              </span>
                            </div>
                          </Alert>
                        )}
                      </div>
                    )}
                  </Col>

                  <Col md={2}>
                    <Button
                      variant="primary"
                      onClick={adicionarLivro}
                      disabled={
                        loading ||
                        !livroAtual.livro_id ||
                        !podeReservarLivro(livroAtual.livro_id) ||
                        verificandoDisponibilidade
                      }
                      className="w-100 fw-semibold d-flex align-items-center justify-content-center gap-2 custom-add-btn mt-4"
                    >
                      {verificandoDisponibilidade ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        <BsPlusCircle style={{ fontSize: '1.2rem' }} />
                      )}
                      {verificandoDisponibilidade ? 'Verificando...' : 'Adicionar'}
                    </Button>
                  </Col>
                </Row>
              </Card>

              {livrosSelecionados.length === 0 && (
                <Form.Text className="text-danger">
                  Adicione pelo menos um livro à reserva
                </Form.Text>
              )}
            </Card.Body>
          </Card>

          {/* 4. OBSERVAÇÕES */}
          <Form.Group className='mb-3' controlId='observacoes'>
            <Form.Label>Observações:</Form.Label>
            <Form.Control
              as='textarea'
              rows={3}
              name='observacoes'
              value={formData.observacoes}
              onChange={handleChange}
              disabled={loading}
              placeholder="Observações sobre a reserva..."
            />
          </Form.Group>

          <div className='d-flex justify-content-end gap-2'>
            <Button variant='cancelar' onClick={onCancel} disabled={loading}>
              Cancelar
            </Button>
            <Button variant='primary' type='submit' disabled={loading || livrosSelecionados.length === 0}>
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" className="me-2" />
                  {reserva ? 'Atualizando...' : 'Salvando...'}
                </>
              ) : (
                <>
                  <BsCheckCircle style={{ marginRight: '8px', color: '#fff', fontSize: '18px' }} />
                  {reserva ? 'Atualizar Reserva' : 'Registrar Reserva'}
                </>
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CadReserva;