import { useState, useEffect } from 'react';
import { Card, Form, Col, Row, Button, Spinner, Alert, Badge, ListGroup } from 'react-bootstrap';
import { BsCheckCircle, BsPlusCircle, BsTrash } from "react-icons/bs";
import { FaBook, FaUser, FaExclamationTriangle } from "react-icons/fa";
import livroService from '../services/livroService';
import emprestimosService from '../services/emprestimosService';

const CadReserva = ({ onSave, onCancel, reserva, loading }) => {
  const [formData, setFormData] = useState({
    usuario_id: '',
    usuario_tipo: '',
    data_validade: '',
    observacoes: ''
  });

  const [livrosSelecionados, setLivrosSelecionados] = useState([]);
  const [livroAtual, setLivroAtual] = useState({ livro_id: '', quantidade: 1 });
  
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

  // Carregar opções
  useEffect(() => {
    const carregarOpcoes = async () => {
      try {
        setOptionsLoading(true);
        
        const usuariosData = await emprestimosService.getOpcoesUsuarios();
        setOpcoesUsuarios(usuariosData.data || usuariosData);
        
        const livrosData = await livroService.getAllComEstoque();
        setLivrosDisponiveis(livrosData);
        
      } catch (err) {
        console.error('Erro ao carregar opções:', err);
        setError('Erro ao carregar dados');
      } finally {
        setOptionsLoading(false);
      }
    };

    carregarOpcoes();
  }, []);

  const recarregarLivrosDisponiveis = async () => {
    try {
      const livrosData = await livroService.getAllComEstoque();
      setLivrosDisponiveis(livrosData);
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

  const adicionarLivro = () => {
    if (!livroAtual.livro_id) {
      setError('Selecione um livro para adicionar');
      return;
    }

    const livroExistente = livrosSelecionados.find(l => l.livro_id === parseInt(livroAtual.livro_id));
    if (livroExistente) {
      setError('Este livro já foi adicionado à reserva');
      return;
    }

    const livroCompleto = livrosDisponiveis.find(l => l.id === parseInt(livroAtual.livro_id));
    if (!livroCompleto) {
      setError('Livro não encontrado');
      return;
    }

    const novoLivro = {
      livro_id: parseInt(livroAtual.livro_id),
      quantidade: parseInt(livroAtual.quantidade) || 1,
      livro_titulo: livroCompleto.titulo,
      livro_isbn: livroCompleto.isbn,
      autor_nome: livroCompleto.autor_nome,
      livro_imagem: livroCompleto.imagem
    };

    setLivrosSelecionados(prev => [...prev, novoLivro]);
    setLivroAtual({ livro_id: '', quantidade: 1 });
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
      setError('Adicione pelo menos um livro à reserva');
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
      
      await onSave(dadosReserva);
      await recarregarLivrosDisponiveis();
      
    } catch (err) {
      console.error('Erro no formulário:', err);
      setError(err.message || 'Erro ao salvar reserva');
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
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
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
                <Form.Label>Data de Validade da Reserva:</Form.Label>
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
                    <Col md={8}>
                      <Form.Label>Adicionar Livro:</Form.Label>
                      <Form.Select
                        name="livro_id"
                        value={livroAtual.livro_id}
                        onChange={handleLivroChange}
                        disabled={loading || optionsLoading}
                      >
                        <option value="">Selecione um livro para adicionar</option>
                        {getLivrosDisponiveisParaAdicionar().map(livro => (
                          <option 
                            key={livro.id} 
                            value={livro.id}
                            disabled={livro.estoque <= 0}
                          >
                            {formatarNome(livro.titulo)} - {formatarNome(livro.autor_nome)} 
                            {livro.estoque > 0 ? 
                              ` (Estoque: ${livro.estoque})` : 
                              ' (Indisponível)'
                            }
                          </option>
                        ))}
                      </Form.Select>
                    </Col>
                    <Col md={2}>
                      <Form.Label>Quantidade:</Form.Label>
                      <Form.Control
                        type="number"
                        name="quantidade"
                        value={livroAtual.quantidade}
                        onChange={handleLivroChange}
                        min="1"
                        max="10"
                        disabled={loading}
                      />
                    </Col>
                    <Col md={2}>
                     <Button
  variant="primary"
  onClick={adicionarLivro}
  disabled={loading || !livroAtual.livro_id}
  className="w-100 fw-semibold d-flex align-items-center justify-content-center gap-2 custom-add-btn"
>
  <BsPlusCircle style={{ fontSize: '1.2rem' }} />
  Adicionar Livro:
</Button>

                    </Col>
                  </Row>
                </Card.Body>
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