import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Card, Spinner, Toast, InputGroup, FormControl, Badge, Alert, Table } from 'react-bootstrap';
import { FaPlus, FaInfoCircle, FaSearch } from 'react-icons/fa';
import entradaSaidaService from '../services/entradaSaidaService';
import livroService from '../services/livroService';

const Entrada = () => {
  const [loading, setLoading] = useState(false);
  const [livros, setLivros] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [livroSelecionado, setLivroSelecionado] = useState(null);
  const [opcoes, setOpcoes] = useState({ origens: [] });
  const [formData, setFormData] = useState({
    livro_id: '',
    origem: '',
    observacoes: '',
    quantidade: 1
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  // Carrega livros com estoque
  const loadLivros = async () => {
    try {
      setLoading(true);
      const data = await livroService.getAll();
      const livrosComEstoque = await Promise.all(
        data.map(async livro => {
          try {
            const estoque = await entradaSaidaService.verificarEstoque(livro.id);
            return { ...livro, estoque: estoque ?? 0 };
          } catch {
            return { ...livro, estoque: 0 };
          }
        })
      );
      setLivros(livrosComEstoque);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar livros');
    } finally {
      setLoading(false);
    }
  };

  // Carrega opções de entrada
  const loadOpcoes = async () => {
    try {
      const data = await entradaSaidaService.getOpcoesEntrada();
      setOpcoes(data);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar opções');
    }
  };

  useEffect(() => {
    loadLivros();
    loadOpcoes();
  }, []);

  const selecionarLivro = async (livro) => {
    setLivroSelecionado(livro);
    setFormData(prev => ({ ...prev, livro_id: livro.id }));

    try {
      const estoque = await entradaSaidaService.verificarEstoque(livro.id);
      setLivroSelecionado(prev => ({ ...prev, estoque }));
      setError('');
    } catch (err) {
      console.error(err);
      setError('Erro ao buscar estoque');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.observacoes.trim()) {
      setError('O campo observações é obrigatório para registrar a entrada.');
      return;
    }

    if (!formData.livro_id || !formData.origem || !formData.quantidade || formData.quantidade <= 0) {
      setError('Preencha todos os campos obrigatórios corretamente');
      return;
    }

    setLoading(true);
    try {
      await entradaSaidaService.registrarEntrada(formData);
      setShowSuccess(true);
      setFormData({ livro_id: '', origem: '', observacoes: '', quantidade: 1 });
      setLivroSelecionado(null);
      setError('');
    } catch (err) {
      setError(err.message || 'Erro ao registrar entrada');
    } finally {
      setLoading(false);
      await loadLivros();
    }
  };

  // Filtro SIMPLES - só título, ID e estoque na busca
  const livrosFiltrados = livros.filter(livro => {
    const termo = termoBusca.toLowerCase();
    return (
      (livro.titulo || '').toLowerCase().includes(termo) ||
      (livro.id || '').toString().toLowerCase().includes(termo) ||
      (livro.estoque || '').toString().includes(termo)
    );
  });

  return (
    <Container className="py-4">
      <div className="rounded-3 p-4 mb-4 border">
        <Row className="align-items-center">
          <Col md={8}>
            <h4 className="display-30 fw-bold text-success">Entrada de Livros</h4>
          </Col>
          <Col md={4} className="text-md-end">
            <div className="d-flex justify-content-end flex-wrap gap-2">
              <Badge bg="primary" className="px-3 py-2">
                Livros: {livros.length}
              </Badge>
              <Badge bg="primary" className="px-3 py-2">
                Total no acervo: {livros.reduce((acc, l) => acc + (l.estoque || 0), 0)}
              </Badge>
              {livroSelecionado && (
                <Badge bg="success" className="px-3 py-2">
                  Livro Selecionado
                </Badge>
              )}
            </div>
          </Col>
        </Row>
      </div>

      <p className="text-muted mb-4" style={{ fontSize: '0.9rem' }}>
        Esta seção permite o <strong>registro de entrada de livros no acervo</strong>. Você pode adicionar novos exemplares, controlar o estoque em tempo real e gerenciar o movimento de livros no sistema.
      </p>

      {/* Toast de sucesso */}
      <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999 }}>
        <Toast show={showSuccess} onClose={() => setShowSuccess(false)} delay={4000} autohide bg="success">
          <Toast.Header>
            <strong className="me-auto">Entrada registrada</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            Entrada de livro registrada com sucesso!
          </Toast.Body>
        </Toast>
      </div>

      <Row>
        {/* Lista de Livros - SIMPLIFICADA */}
        <Col lg={5}>
          <Card className="mb-3">
            <Card.Header className="bg-primary text-white">
              <h6 className="mb-0">Selecionar Livro</h6>
            </Card.Header>
            <Card.Body>
              {/* Barra de pesquisa */}
              <InputGroup className="mb-3">
                <InputGroup.Text className="bg-light">
                  <FaSearch />
                </InputGroup.Text>
                <FormControl
                  placeholder="Buscar por título..."
                  value={termoBusca}
                  onChange={e => setTermoBusca(e.target.value)}
                />
              </InputGroup>

              {/* Lista em tabela simples */}
              <div className="table-responsive" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                <Table striped hover className="mb-0">
                  <thead className="table">
                    <tr>
                      <th width="60px" className="text-center">Capa</th>
                      <th>Título</th>
                      <th width="50px" className="text-center">ID</th>
                      <th width="100px" className="text-center">Estoque</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="4" className="text-center py-4">
                          <Spinner animation="border" size="sm" /> Carregando...
                        </td>
                      </tr>
                    ) : livrosFiltrados.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-4 text-muted">
                          {termoBusca ? 'Nenhum livro encontrado' : 'Nenhum livro cadastrado'}
                        </td>
                      </tr>
                    ) : (
                      livrosFiltrados.map(livro => {
                        const isSelected = livroSelecionado?.id === livro.id;
                        return (
                          <tr
                            key={livro.id}
                            className={`align-middle ${isSelected ? 'table-success' : ''}`}
                            onClick={() => selecionarLivro(livro)}
                            style={{ cursor: 'pointer' }}
                          >
                            <td className="text-center">
                              {livro.imagem ? (
                                <img
                                  src={`http://localhost:3000${livro.imagem}`}
                                  alt={livro.titulo}
                                  className={`entrada-lista-livro-imagem ${isSelected ? 'selecionada' : ''}`}
                                  onError={e => { e.target.style.display = 'none' }}
                                />
                              ) : (
                                <div className="entrada-sem-imagem d-flex justify-content-center align-items-center" style={{ width: '80px', height: '120px', margin: '0 auto' }}>
                                  <FaPlus />
                                </div>
                              )}
                            </td>
                            <td className="align-middle">
                              <div title={livro.titulo} className="fw-medium">
                                {livro.titulo}
                              </div>
                              <small className="text-muted">
                                {livro.autor_nome}
                              </small>
                            </td>
                            <td className="text-center align-middle">
                              {livro.id}
                            </td>
                            <td className="text-center align-middle">
                              {livro.estoque || 0}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
        {/* Formulário de Entrada */}
        <Col lg={7}>
          {livroSelecionado && (
            <Card className="mb-3">
              <Card.Header className="bg-success text-white">
                <h6 className="mb-0"> Livro Selecionado</h6>
              </Card.Header>
              <Card.Body>
                <Row className="align-items-start">
                  <Col md={3} className="text-center">
                    {livroSelecionado.imagem ? (
                      <img
                        src={`http://localhost:3000${livroSelecionado.imagem}`}
                        alt={livroSelecionado.titulo}
                        className="entrada-livro-imagem"
                      />
                    ) : (
                      <div className="entrada-sem-imagem">
                        <FaPlus size={24} />
                        <div>Sem imagem</div>
                      </div>
                    )}
                  </Col>
                  <Col md={9}>
                    <div className="livro-info">
                      <h6 className="fw-bold text-primary mb-3">{livroSelecionado.titulo}</h6>

                      <div className="row">
                        <div className="col-6">
                          <div className="info-item mb-2">
                            <span className="text-muted small">Autor:</span>
                            <div className="fw-medium">{livroSelecionado.autor_nome}</div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="info-item mb-2">
                            <span className="text-muted small">Editora:</span>
                            <div className="fw-medium">{livroSelecionado.editora_nome}</div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-6">
                          <div className="info-item mb-2">
                            <span className="text-muted small">ISBN:</span>
                            <div>{livroSelecionado.isbn || 'Não informado'}</div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="info-item mb-2">
                            <span className="text-muted small">Gênero:</span>
                            <div>{livroSelecionado.genero}</div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-12">
                          <div className="info-item mb-2">
                            <span className="text-muted small">Estoque atual:</span>
                            <div className="d-flex align-items-center gap-2">
                              <span className="">{livroSelecionado.estoque}</span>
                              <span className="text-muted small">unidades</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-end mt-3 pt-2 border-top">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          setLivroSelecionado(null);
                          setFormData(prev => ({ ...prev, livro_id: '' }));
                        }}
                      >
                        Remover seleção
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}

          <Card>
            <Card.Header><h5>Registrar Entrada</h5></Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Label>Origem</Form.Label>
                    <Form.Select
                      value={formData.origem}
                      onChange={e => setFormData({ ...formData, origem: e.target.value })}
                      required
                      disabled={!livroSelecionado}
                    >
                      <option value="">Selecione a origem</option>
                      {opcoes.origens.map(origem => (
                        <option key={origem} value={origem}>{origem}</option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={6}>
                    <Form.Label>Quantidade</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      value={formData.quantidade}
                      onChange={e => setFormData({ ...formData, quantidade: parseInt(e.target.value) || 1 })}
                      required
                      disabled={!livroSelecionado}
                    />
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>
                    Observações
                    <span className="ms-2">
                      <Badge bg="warning" text="dark">Obrigatório</Badge>
                    </span>
                  </Form.Label>

                  <Alert variant="info" className="py-2 mb-2">
                    <FaInfoCircle className="me-1" />
                    <small>
                      <strong>Registro obrigatório:</strong> Informe o motivo desta entrada. <br />
                      Exemplos: doação da editora X, compra de 10 unidades, ajuste de inventário, contagem física
                    </small>
                  </Alert>

                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Descreva o motivo da entrada..."
                    value={formData.observacoes}
                    onChange={e => setFormData({ ...formData, observacoes: e.target.value })}
                    disabled={!livroSelecionado}
                    className={!formData.observacoes.trim() ? 'border' : ''}
                  />
                </Form.Group>

                {error && (
                  <Alert variant="danger" className="mb-3">{error}</Alert>
                )}

                <Button
                  type="submit"
                  variant="success"
                  className="w-30"
                  disabled={loading || !livroSelecionado || !formData.observacoes.trim()}
                >
                  {loading ? (
                    <><Spinner animation="border" size="sm" /> Registrando...</>
                  ) : (
                    <> Registrar Entrada</>
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Entrada;