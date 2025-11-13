import { useState, useEffect } from 'react';
import { Card, Form, Col, Row, Button, Spinner, Alert, Badge, ListGroup } from 'react-bootstrap';
import { BsCheckCircle, BsPlusCircle, BsTrash, BsExclamationTriangle } from "react-icons/bs";
import { FaBook, FaUser, FaExclamationTriangle } from "react-icons/fa";
import livroService from '../services/livroService';
import emprestimosService from '../services/emprestimosService';

const CadEmprestimo = ({ onSave, onCancel, emprestimo, loading }) => {
  const [formData, setFormData] = useState({
    usuario_id: '',
    usuario_tipo: '',
    data_devolucao_prevista: '',
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
  
  // ESTADO PARA DISPONIBILIDADE DE TODOS OS LIVROS
  const [disponibilidade, setDisponibilidade] = useState({});
  const [verificandoDisponibilidade, setVerificandoDisponibilidade] = useState(false);
  const [disponibilidadeGeral, setDisponibilidadeGeral] = useState({});

  // Carregar opções E disponibilidade de todos os livros
  useEffect(() => {
    const carregarOpcoes = async () => {
      try {
        setOptionsLoading(true);
        
        const usuariosData = await emprestimosService.getOpcoesUsuarios();
        setOpcoesUsuarios(usuariosData.data || usuariosData);
        
        const livrosData = await livroService.getAllComEstoque();
        setLivrosDisponiveis(livrosData);
        
        // VERIFICAR DISPONIBILIDADE DE TODOS OS LIVROS AO CARREGAR
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

  // FUNÇÃO PARA VERIFICAR DISPONIBILIDADE DE TODOS OS LIVROS
  const verificarDisponibilidadeTodosLivros = async (livros) => {
    try {
      setVerificandoDisponibilidade(true);
      const novaDisponibilidade = {};
      
      // Verificar disponibilidade para cada livro
      for (const livro of livros) {
        try {
          if (emprestimosService.verificarDisponibilidade) {
            const result = await emprestimosService.verificarDisponibilidade(livro.id, 1);
            novaDisponibilidade[livro.id] = result.data;
          } else {
            // Fallback: usar estoque físico
            novaDisponibilidade[livro.id] = {
              podeEmprestar: (livro.estoque || 0) >= 1,
              disponivelExato: livro.estoque || 0,
              estoqueFisico: livro.estoque || 0,
              totalEmprestado: 0
            };
          }
        } catch (error) {
          console.error(`Erro ao verificar disponibilidade livro ${livro.id}:`, error);
          // Fallback em caso de erro
          novaDisponibilidade[livro.id] = {
            podeEmprestar: (livro.estoque || 0) >= 1,
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
      // RECARREGAR DISPONIBILIDADE TAMBÉM
      await verificarDisponibilidadeTodosLivros(livrosData);
    } catch (err) {
      console.error('Erro ao recarregar livros:', err);
    }
  };

  // Preencher dados se for edição
  useEffect(() => {
    if (emprestimo) {
      setFormData({
        usuario_id: emprestimo.usuario_id?.toString() || '',
        usuario_tipo: emprestimo.usuario_tipo || '',
        data_devolucao_prevista: emprestimo.data_devolucao_prevista || '',
        observacoes: emprestimo.observacoes || ''
      });
      
      if (emprestimo.livros && emprestimo.livros.length > 0) {
        setLivrosSelecionados(emprestimo.livros);
      }
      
      if (emprestimo.usuario_id && emprestimo.usuario_tipo) {
        buscarUsuario(emprestimo.usuario_id, emprestimo.usuario_tipo);
      }
    }
  }, [emprestimo]);

  // VERIFICAR DISPONIBILIDADE QUANDO MUDAR LIVRO OU QUANTIDADE (apenas para o livro atual)
  useEffect(() => {
    const verificarDisponibilidade = async () => {
      if (livroAtual.livro_id && livroAtual.quantidade > 0) {
        setVerificandoDisponibilidade(true);
        try {
          await verificarDisponibilidadeLivro(livroAtual.livro_id, livroAtual.quantidade);
        } catch (error) {
          console.error('Erro ao verificar disponibilidade:', error);
        } finally {
          setVerificandoDisponibilidade(false);
        }
      }
    };

    verificarDisponibilidade();
  }, [livroAtual.livro_id, livroAtual.quantidade]);

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

  // FUNÇÃO PARA VERIFICAR DISPONIBILIDADE DE UM LIVRO ESPECÍFICO
  const verificarDisponibilidadeLivro = async (livroId, quantidade = 1) => {
    try {
      if (!emprestimosService.verificarDisponibilidade) {
        console.warn('Serviço de verificação de disponibilidade não disponível');
        return false;
      }

      const result = await emprestimosService.verificarDisponibilidade(livroId, quantidade);
      setDisponibilidade(prev => ({
        ...prev,
        [livroId]: result.data
      }));
      return result.data.podeEmprestar;
    } catch (error) {
      console.error('Erro ao verificar disponibilidade:', error);
      
      // Fallback: usar disponibilidade geral ou estoque físico
      const infoGeral = disponibilidadeGeral[livroId];
      if (infoGeral) {
        const podeEmprestar = infoGeral.disponivelExato >= quantidade;
        setDisponibilidade(prev => ({
          ...prev,
          [livroId]: {
            ...infoGeral,
            podeEmprestar,
            disponivelExato: infoGeral.disponivelExato
          }
        }));
        return podeEmprestar;
      }
      
      const livro = livrosDisponiveis.find(l => l.id === parseInt(livroId));
      if (livro) {
        const podeEmprestar = (livro.estoque || 0) >= quantidade;
        setDisponibilidade(prev => ({
          ...prev,
          [livroId]: {
            podeEmprestar,
            disponivelExato: livro.estoque || 0,
            estoqueFisico: livro.estoque || 0,
            totalEmprestado: 0
          }
        }));
        return podeEmprestar;
      }
      
      return false;
    }
  };

  //  FUNÇÃO PARA CALCULAR DISPONIBILIDADE 
  const calcularDisponibilidade = (livroId) => {
    const info = disponibilidade[livroId] || disponibilidadeGeral[livroId];
    if (!info) {
      // Se não tem info de disponibilidade, mostra estoque físico
      const livro = livrosDisponiveis.find(l => l.id === parseInt(livroId));
      return livro ? (livro.estoque || 0) : '...';
    }
    return info.disponivelExato;
  };

  //  FUNÇÃO PARA VERIFICAR SE PODE EMPRESTAR 
const podeEmprestarLivro = (livroId) => {
  const info = disponibilidade[livroId] || disponibilidadeGeral[livroId];
  if (!info) {
    // Se não tem info, verifica estoque 
    const livro = livrosDisponiveis.find(l => l.id === parseInt(livroId));
    return livro ? (livro.estoque || 0) >= 1 : false; 
  }
  return info.podeEmprestar && info.disponivelExato >= 1; 
};

  // FUNÇÃO PARA OBTER STATUS DE DISPONIBILIDADE (para estilização)
  const getStatusDisponibilidade = (livroId) => {
    const podeEmprestar = podeEmprestarLivro(livroId, 1);
    const disponivel = calcularDisponibilidade(livroId);
    
    if (disponivel === '...' || disponivel === undefined) {
      return { 
        texto: 'Carregando...', 
        classe: 'text-muted', 
        badge: 'secondary',
        icon: <Spinner animation="border" size="sm" className="me-1" />
      };
    }
    
    if (podeEmprestar) {
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

const getLivrosOrganizados = () => {
    const livrosParaAdicionar = getLivrosDisponiveisParaAdicionar();
    
    return livrosParaAdicionar.sort((a, b) => {
      const aDisponivel = podeEmprestarLivro(a.id, 1);
      const bDisponivel = podeEmprestarLivro(b.id, 1);
      
      // Disponíveis primeiro (true vem antes de false)
      if (aDisponivel && !bDisponivel) return -1;
      if (!aDisponivel && bDisponivel) return 1;
      
      // Se ambos têm mesma disponibilidade, ordena por título
      return a.titulo.localeCompare(b.titulo);
    });
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

  const adicionarLivro = async () => {
    if (!livroAtual.livro_id) {
      setError('Selecione um livro para adicionar');
      return;
    }

    const livroExistente = livrosSelecionados.find(l => l.livro_id === parseInt(livroAtual.livro_id));
    if (livroExistente) {
      setError('Este livro já foi adicionado ao empréstimo');
      return;
    }

    const livroCompleto = livrosDisponiveis.find(l => l.id === parseInt(livroAtual.livro_id));
    if (!livroCompleto) {
      setError('Livro não encontrado');
      return;
    }

    // VERIFICAR DISPONIBILIDADE ANTES DE ADICIONAR (sempre quantidade = 1)
    const podeAdicionar = podeEmprestarLivro(livroAtual.livro_id, 1); // Sempre 1
    
    if (!podeAdicionar) {
      const disponivel = calcularDisponibilidade(livroAtual.livro_id);
      setError(`Livro não disponível para empréstimo. Disponível: ${disponivel} unidades`);
      return;
    }

    const novoLivro = {
      livro_id: parseInt(livroAtual.livro_id),
      quantidade: 1, // SEMPRE 1
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
    
    if (!formData.usuario_id || !formData.usuario_tipo || !formData.data_devolucao_prevista) {
      setValidated(true);
      return;
    }

    if (livrosSelecionados.length === 0) {
      setError('Adicione pelo menos um livro ao empréstimo');
      return;
    }

    try {
      setError('');
      
      const dadosEmprestimo = {
        usuario_id: formData.usuario_id,
        usuario_tipo: formData.usuario_tipo,
        data_devolucao_prevista: formData.data_devolucao_prevista,
        observacoes: formData.observacoes,
        livros: livrosSelecionados
      };      
      await onSave(dadosEmprestimo);
      await recarregarLivrosDisponiveis();
      
    } catch (err) {
      console.error('Erro no formulário:', err);
      setError(err.message || 'Erro ao salvar empréstimo');
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
          {emprestimo ? 'Editar Empréstimo' : 'Novo Empréstimo'}
        </h5>
      </Card.Header>
      <Card.Body>
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
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

          {/* 2. DATA DE DEVOLUÇÃO PREVISTA - mantém igual */}
          <Row>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='data_devolucao_prevista'>
                <Form.Label>Data de Devolução Prevista:</Form.Label>
                <Form.Control
                  type='date'
                  name='data_devolucao_prevista'
                  value={formData.data_devolucao_prevista}
                  onChange={handleChange}
                  required
                  min={hoje}
                  disabled={loading}
                />
                <Form.Control.Feedback type='invalid'>
                  Informe uma data de devolução válida
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  A data deve ser futura
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          {/* 3. LIVROS DO EMPRÉSTIMO - MODIFICADO */}
          <Card className="mb-3">
            <Card.Header className="bg-primary">
              <h6 className="mb-0">Livros do Empréstimo</h6>
            </Card.Header>
            <Card.Body>
              {/* Lista de Livros Selecionados - mantém igual */}
              {livrosSelecionados.length > 0 && (
                <ListGroup className="mb-3">
                  {livrosSelecionados.map((livro, index) => (
                    <ListGroup.Item key={livro.livro_id} className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{livro.livro_titulo}</strong>
                        <br />
                        <small className="text-muted">
                          Autor: {livro.autor_nome} | ISBN: {livro.livro_isbn} | 
                          Quantidade: {livro.quantidade}
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
                  <Card.Body>
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
                              .filter(livro => podeEmprestarLivro(livro.id))
                              .map(livro => {
                                const status = getStatusDisponibilidade(livro.id);
                                return (
                                  <option 
                                    key={livro.id} 
                                    value={livro.id}
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

                          {/* GRUPO DE LIVROS INDISPONÍVEIS */}
                          <optgroup label=" Livros Indisponíveis" className="text-muted">
                            {getLivrosOrganizados()
                              .filter(livro => !podeEmprestarLivro(livro.id))
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
                        
                        {/* FEEDBACK VISUAL - ATUALIZADO */}
                        {livroAtual.livro_id && (
                          <div className="mt-2">
                            {(disponibilidade[livroAtual.livro_id] || disponibilidadeGeral[livroAtual.livro_id]) && (
                              <Alert 
                                variant={podeEmprestarLivro(livroAtual.livro_id) ? "success" : "danger"} 
                                className="py-2 mb-0"
                              >
                                <div className="d-flex align-items-center">
                                  {podeEmprestarLivro(livroAtual.livro_id) ? (
                                    <>
                                      <BsCheckCircle className="me-2" />
                                      <strong>Disponível para empréstimo</strong>
                                    </>
                                  ) : (
                                    <>
                                      <BsExclamationTriangle className="me-2" />
                                      <strong>Indisponível para empréstimo</strong>
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
                            !podeEmprestarLivro(livroAtual.livro_id) ||
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
                  </Card.Body>
                </Card>

                            
            </Card.Body>
          </Card>

          {/* OBSERVAÇÕES  */}
          <Form.Group className='mb-3' controlId='observacoes'>
            <Form.Label>Observações:</Form.Label>
            <Form.Control
              as='textarea'
              rows={3}
              name='observacoes'
              value={formData.observacoes}
              onChange={handleChange}
              disabled={loading}
              placeholder="Observações sobre o empréstimo..."
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
                  {emprestimo ? 'Atualizando...' : 'Salvando...'}
                </>
              ) : (
                <>
                  <BsCheckCircle style={{ marginRight: '8px', color: '#fff', fontSize: '18px' }} />
                  {emprestimo ? 'Atualizar Empréstimo' : 'Registrar Empréstimo'}
                </>
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CadEmprestimo;