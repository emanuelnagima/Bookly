import { useState, useEffect } from 'react';
import { Card, Form, Col, Row, Button, Spinner, Alert, Badge, Table } from 'react-bootstrap';
import { BsCheckCircle, BsPlusCircle, BsTrash } from "react-icons/bs";
import { FaBook, FaUser } from "react-icons/fa";
import livroService from '../services/livroService';
import emprestimosService from '../services/emprestimosService';

const CadEmprestimo = ({ onSave, onCancel, emprestimo, loading }) => {
  const [formData, setFormData] = useState({
    usuario_id: '',
    usuario_tipo: '',
    data_devolucao_prevista: '',
    observacoes: '',
    livros: []
  });

  const [opcoesUsuarios, setOpcoesUsuarios] = useState({
    alunos: [],
    professores: [],
    usuarios_especiais: []
  });
  
  const [livrosDisponiveis, setLivrosDisponiveis] = useState([]);
  const [livroSelecionado, setLivroSelecionado] = useState('');
  const [quantidadeLivro, setQuantidadeLivro] = useState(1);
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState('');
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);

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
    if (emprestimo) {
      setFormData({
        usuario_id: emprestimo.usuario_id?.toString() || '',
        usuario_tipo: emprestimo.usuario_tipo || '',
        data_devolucao_prevista: emprestimo.data_devolucao_prevista || '',
        observacoes: emprestimo.observacoes || '',
        livros: emprestimo.livros || []
      });
      
      // Buscar dados do usuário selecionado
      if (emprestimo.usuario_id && emprestimo.usuario_tipo) {
        buscarUsuario(emprestimo.usuario_id, emprestimo.usuario_tipo);
      }
    }
  }, [emprestimo]);

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
  };

  const adicionarLivro = () => {
    if (!livroSelecionado || quantidadeLivro < 1) {
      setError('Selecione um livro e informe a quantidade');
      return;
    }

    const livro = livrosDisponiveis.find(l => l.id === parseInt(livroSelecionado));
    if (!livro) {
      setError('Livro não encontrado');
      return;
    }

    // Verificar se livro já foi adicionado
    if (formData.livros.some(l => l.livro_id === parseInt(livroSelecionado))) {
      setError('Este livro já foi adicionado ao empréstimo');
      return;
    }

    const novoLivro = {
      livro_id: parseInt(livroSelecionado),
      quantidade: parseInt(quantidadeLivro),
      titulo: livro.titulo,
      autor_nome: livro.autor_nome,
      isbn: livro.isbn
    };

    setFormData(prev => ({
      ...prev,
      livros: [...prev.livros, novoLivro]
    }));

    setLivroSelecionado('');
    setQuantidadeLivro(1);
    setError('');
  };

  const removerLivro = (index) => {
    setFormData(prev => ({
      ...prev,
      livros: prev.livros.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    if (formData.livros.length === 0) {
      setError('Adicione pelo menos um livro ao empréstimo');
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
          {emprestimo ? 'Editar Empréstimo' : 'Novo Empréstimo'}
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

          {/* Data de Devolução */}
          <Row>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='data_devolucao_prevista'>
                <Form.Label>Data de Devolução Prevista</Form.Label>
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

          {/* Adicionar Livros */}
          <Card className="mb-3">
            <Card.Header className="bg-primary">
              <h6 className="mb-0">
                <FaBook className="me-2" />
                Livros do Empréstimo
              </h6>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId='livro_selecionado'>
                    <Form.Label>Selecionar Livro</Form.Label>
                    <Form.Select
                      value={livroSelecionado}
                      onChange={(e) => setLivroSelecionado(e.target.value)}
                      disabled={loading || optionsLoading}
                    >
                      <option value="">Selecione um livro</option>
                      {livrosDisponiveis.map(livro => (
                        <option key={livro.id} value={livro.id}>
                          {livro.titulo} - {livro.autor_nome} (Estoque: {livro.estoque || 0})
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group controlId='quantidade_livro'>
                    <Form.Label>Quantidade</Form.Label>
                    <Form.Control
                      type='number'
                      min="1"
                      value={quantidadeLivro}
                      onChange={(e) => setQuantidadeLivro(e.target.value)}
                      disabled={loading}
                    />
                  </Form.Group>
                </Col>
                <Col md={3} className="d-flex align-items-end">
                  <Button
                    variant="outline-primary"
                    onClick={adicionarLivro}
                    disabled={loading || !livroSelecionado}
                    className="w-100"
                  >
                    <BsPlusCircle className="me-1" />
                    Adicionar
                  </Button>
                </Col>
              </Row>

              {/* Lista de Livros Adicionados */}
              {formData.livros.length > 0 && (
                <div className="mt-3">
                  <h6>Livros no Empréstimo:</h6>
                  <Table striped bordered size="sm">
                    <thead>
                      <tr>
                        <th>Livro</th>
                        <th width="100">Quantidade</th>
                        <th width="80">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.livros.map((livro, index) => (
                        <tr key={index}>
                          <td>
                            <div>
                              <strong>{livro.titulo}</strong>
                              <br />
                              <small className="text-muted">
                                {livro.autor_nome} - ISBN: {livro.isbn}
                              </small>
                            </div>
                          </td>
                          <td className="text-center">{livro.quantidade}</td>
                          <td className="text-center">
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => removerLivro(index)}
                              disabled={loading}
                            >
                              <BsTrash />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <Badge bg="primary">
                    Total de livros: {formData.livros.length}
                  </Badge>
                </div>
              )}
            </Card.Body>
          </Card>

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
              placeholder="Observações sobre o empréstimo..."
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