import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Card, Spinner, Toast, InputGroup, FormControl, Badge, Alert } from 'react-bootstrap';
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
    
    if (formData.origem === 'Ajuste de Inventário' && !formData.observacoes.trim()) {
      setError('Para "Ajuste de Inventário", o campo observações é obrigatório.');
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

  // Filtro avançado igual LivroList
  const livrosFiltrados = livros.filter(livro => {
    const termo = termoBusca.toLowerCase();
    return (
      (livro.titulo || '').toLowerCase().includes(termo) ||
      (livro.autor_nome || '').toLowerCase().includes(termo) ||
      (livro.editora_nome || '').toLowerCase().includes(termo) ||
      (livro.isbn || '').toString().toLowerCase().includes(termo) ||
      (livro.genero || '').toLowerCase().includes(termo) ||
      (livro.ano_publicacao || '').toString().includes(termo)
    );
  });

  return (
    <Container className="py-4">
      <Row className="mb-4 align-items-center">
        <Col md={8}>
          <h4 className="display-30 fw-bold text-success">Entrada de Livros</h4>
          <p className="text-muted fs-10">
            Registre a entrada de livros no acervo e acompanhe o estoque em tempo real.
          </p>
        </Col>
        <Col md={4} className="text-md-end mt-3 mt-md-0">
          <div className="d-flex justify-content-end flex-wrap gap-2">
            <Badge bg="secondary" className="p-2">
               Livros Cadastrados: {livros.length}
            </Badge>
            <Badge bg="success" className="p-2">
              Livros Selecionados: {livroSelecionado ? 1 : 0}
            </Badge>
            <Badge bg="info" className="p-2 text-dark">
              Estoque Total: {livros.reduce((acc, l) => acc + (l.estoque || 0), 0)}
            </Badge>
          </div>
        </Col>
     </Row>


      <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999 }}>
        <Toast show={showSuccess} onClose={() => setShowSuccess(false)} delay={4000} autohide bg="success">
          <Toast.Header>
            <strong className="me-auto">Entrada registrada!</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            {formData.origem === 'Ajuste de Inventário' 
              ? 'Ajuste de inventário registrado com sucesso!'
              : 'Entrada de livro registrada com sucesso!'}
          </Toast.Body>
        </Toast>
      </div>

      <Row>
        {/* Lista + Pesquisa */}
        <Col lg={5}>
          <InputGroup className="mb-3">
            <InputGroup.Text className="bg-light"><FaSearch /></InputGroup.Text>
            <FormControl
              placeholder="Buscar livros..."
              value={termoBusca}
              onChange={e => setTermoBusca(e.target.value)}
            />
          </InputGroup>

          <div style={{ maxHeight: '720vh', overflowY: 'auto' }}>
            {livrosFiltrados.map(livro => {
              const isSelected = livroSelecionado?.id === livro.id;
              return (
                <Card
                  key={livro.id}
                  className={`mb-2 d-flex flex-row align-items-center ${isSelected ? 'border-success' : ''}`}
                  onClick={() => selecionarLivro(livro)}
                  style={{
                    cursor: 'pointer',
                    height: isSelected ? '60px' : '90px',
                    transition: 'height 0.2s ease'
                  }}
                >
                  <div style={{ width: 80, height: 120, overflow: 'hidden', flexShrink: 0 }}>
                    {livro.imagem ? (
                      <img
                        src={`http://localhost:3000${livro.imagem}`}
                        alt={livro.titulo}
                        className={`livro-imagem lista-livro-imagem ${isSelected ? 'selecionada' : ''}`}
                        onError={e => e.target.style.display = 'none'}
                      />
                    ) : (
                      <div className="sem-imagem d-flex justify-content-center align-items-center" style={{ width: '100%', height: '100%' }}>
                        <FaPlus />
                      </div>
                    )}
                  </div>
                  <Card.Body className="ps-3 py-2">
                    <h6 className="mb-0">{livro.titulo}</h6>
                    <p className="mb-0">{livro.autor_nome}</p>
                    <p className="mb-0" style={{ color: '#555' }}>Estoque: {livro.estoque || 0}</p>
                  </Card.Body>
                </Card>
              );
            })}
          </div>
        </Col>

        {/* Formulário de Entrada */}
        <Col lg={7}>
          {livroSelecionado && (
            <Card className="mb-2">
              <Card.Header className="bg-success text-white"><h5>Livro Selecionado</h5></Card.Header>
              <Card.Body>
                <Row>
                  <Col md={3} className="text-center">
                    {livroSelecionado.imagem ? (
                      <img
                        src={`http://localhost:3000${livroSelecionado.imagem}`}
                        alt={livroSelecionado.titulo}
                        className="livro-imagem"
                      />
                    ) : (
                      <div className="sem-imagem">
                        <FaPlus size={24} />
                        <div>Sem imagem</div>
                      </div>
                    )}
                  </Col>
                  <Col md={9}>
                    <h6>{livroSelecionado.titulo}</h6>
                    <p className="mb-1"><strong>Autor:</strong> {livroSelecionado.autor_nome}</p>
                    <p className="mb-1"><strong>Editora:</strong> {livroSelecionado.editora_nome}</p>
                    <p className="mb-1"><strong>ISBN:</strong> {livroSelecionado.isbn}</p>
                    <p className="mb-1"><strong>Gênero:</strong> {livroSelecionado.genero}</p>
                    <p className="mb-1"><strong>Estoque atual:</strong> {livroSelecionado.estoque} unidades</p>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end mt-3">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      setLivroSelecionado(null);
                      setFormData(prev => ({ ...prev, livro_id: '' }));
                    }}
                  >
                    Remover seleção
                  </Button>
                </div>
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
                  {formData.origem === 'Ajuste de Inventário' && (
                    <span className="ms-2">
                      <Badge bg="warning" text="dark">Obrigatório</Badge>
                    </span>
                  )}
                </Form.Label>

                {formData.origem === 'Ajuste de Inventário' && (
                  <Alert variant="info" className="py-2 mb-2">
                    <FaInfoCircle className="me-1" />
                    <small>
                      <strong>Importante:</strong> Para ajustes de inventário, descreva o motivo da alteração 
                      (ex: "Inventário físico realizado", "Correção de lançamento", etc.)
                    </small>
                  </Alert>
                )}

                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder={formData.origem === 'Ajuste de Inventário' 
                    ? 'Descreva o motivo do ajuste de inventário...' 
                    : 'Ex: Doação recebida, compra realizada...'}
                  value={formData.observacoes}
                  onChange={e => setFormData({ ...formData, observacoes: e.target.value })}
                  disabled={!livroSelecionado}
                  className={formData.origem === 'Ajuste de Inventário' && !formData.observacoes.trim() ? 'border-warning' : ''}
                />
              </Form.Group>


                {error && (
                  <Alert variant="danger" className="mb-3">{error}</Alert>
                )}

                <Button 
                  type="submit" 
                  variant="success" 
                  className="w-30" 
                  disabled={loading || !livroSelecionado || (formData.origem === 'Ajuste de Inventário' && !formData.observacoes.trim())}
                >
                  {loading ? (
                    <><Spinner animation="border" size="sm" /> Registrando...</>
                  ) : (
                    <><FaPlus className="me-2" /> Registrar Entrada</>
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
