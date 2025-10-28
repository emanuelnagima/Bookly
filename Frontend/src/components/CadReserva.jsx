import { useState, useEffect } from 'react';
import { Card, Form, Col, Row, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { BsCheckCircle } from "react-icons/bs";
import { FaBook, FaUser, FaExclamationTriangle } from "react-icons/fa";
import livroService from '../services/livroService';
import emprestimosService from '../services/emprestimosService';

const CadReserva = ({ onSave, onCancel, reserva, loading }) => {
  const [formData, setFormData] = useState({
    usuario_id: '',
    usuario_tipo: '',
    livro_id: '',
    data_validade: '',
    observacoes: ''
  });

  const [opcoesUsuarios, setOpcoesUsuarios] = useState({
    alunos: [],
    professores: [],
    usuarios_especiais: []
  });
  
  const [livrosDisponiveis, setLivrosDisponiveis] = useState([]);
  const [livroSelecionado, setLivroSelecionado] = useState(null);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState('');
  const [optionsLoading, setOptionsLoading] = useState(false);

  // Carregar opções
  useEffect(() => {
    const carregarOpcoes = async () => {
      try {
        setOptionsLoading(true);
        
        // Carregar usuários
        const usuariosData = await emprestimosService.getOpcoesUsuarios();
        setOpcoesUsuarios(usuariosData.data || usuariosData);
        
        // Carregar livros
        const livrosData = await livroService.getAll();
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

  // Preencher dados se for edição
  useEffect(() => {
    if (reserva) {
      setFormData({
        usuario_id: reserva.usuario_id?.toString() || '',
        usuario_tipo: reserva.usuario_tipo || '',
        livro_id: reserva.livro_id?.toString() || '',
        data_validade: reserva.data_validade || '',
        observacoes: reserva.observacoes || ''
      });
      
      // Buscar dados do usuário e livro selecionados
      if (reserva.usuario_id && reserva.usuario_tipo) {
        buscarUsuario(reserva.usuario_id, reserva.usuario_tipo);
      }
      if (reserva.livro_id) {
        const livro = livrosDisponiveis.find(l => l.id === parseInt(reserva.livro_id));
        setLivroSelecionado(livro);
      }
    }
  }, [reserva, livrosDisponiveis]);

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

    // Quando selecionar usuário, buscar dados
    if (name === 'usuario_id' && formData.usuario_tipo) {
      buscarUsuario(value, formData.usuario_tipo);
    }
    
    if (name === 'usuario_tipo' && formData.usuario_id) {
      buscarUsuario(formData.usuario_id, value);
    }

    // Quando selecionar livro, buscar dados
    if (name === 'livro_id') {
      const livro = livrosDisponiveis.find(l => l.id === parseInt(value));
      setLivroSelecionado(livro);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      setError('');
      await onSave(formData);
    } catch (err) {
      console.error('Erro no formulário:', err);
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
          {/* Seleção do Usuário */}
          <Row>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='usuario_tipo'>
                <Form.Label>Tipo de Usuário</Form.Label>
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
                <Form.Label>Usuário</Form.Label>
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
                      {usuario.nome}
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
            <Alert variant="info" className="py-2">
              <div className="d-flex align-items-center">
                <FaUser className="me-2" />
                <div>
                  <strong>Usuário selecionado:</strong> {usuarioSelecionado.nome}
                  <Badge bg="secondary" className="ms-2">
                    {formData.usuario_tipo}
                  </Badge>
                </div>
              </div>
            </Alert>
          )}

          {/* Seleção do Livro */}
          <Row>
            <Col md={12}>
              <Form.Group className='mb-3' controlId='livro_id'>
                <Form.Label>Livro</Form.Label>
                <Form.Select
                  name="livro_id"
                  value={formData.livro_id}
                  onChange={handleChange}
                  required
                  disabled={loading || optionsLoading}
                >
                  <option value="">Selecione um livro</option>
                  {livrosDisponiveis.map(livro => (
                    <option key={livro.id} value={livro.id}>
                      {livro.titulo} - {livro.autor_nome} 
                      {livro.estoque > 0 ? 
                        ` (Disponível: ${livro.estoque})` : 
                        ' (Indisponível)'
                      }
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type='invalid'>
                  Selecione um livro
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          {/* Informações do Livro Selecionado */}
          {livroSelecionado && (
            <Alert 
              variant={livroSelecionado.estoque > 0 ? "success" : "warning"} 
              className="py-2"
            >
              <div className="d-flex align-items-center">
                <FaBook className="me-2" />
                <div>
                  <strong>Livro selecionado:</strong> {livroSelecionado.titulo}
                  <br />
                  <small>
                    <strong>Autor:</strong> {livroSelecionado.autor_nome} | 
                    <strong> Editora:</strong> {livroSelecionado.editora_nome} | 
                    <strong> ISBN:</strong> {livroSelecionado.isbn}
                  </small>
                  <br />
                  {livroSelecionado.estoque > 0 ? (
                    <Badge bg="success">
                      Disponível: {livroSelecionado.estoque} unidade(s)
                    </Badge>
                  ) : (
                    <Badge bg="warning" text="dark">
                      <FaExclamationTriangle className="me-1" />
                      Indisponível para empréstimo
                    </Badge>
                  )}
                </div>
              </div>
            </Alert>
          )}

          {/* Data de Validade */}
          <Row>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='data_validade'>
                <Form.Label>Data de Validade da Reserva</Form.Label>
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

          {/* Observações */}
          <Form.Group className='mb-3' controlId='observacoes'>
            <Form.Label>Observações</Form.Label>
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
            <Button variant='danger' onClick={onCancel} disabled={loading}>
              Cancelar
            </Button>
            <Button variant='primary' type='submit' disabled={loading}>
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