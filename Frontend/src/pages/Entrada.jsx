import { useState, useEffect } from 'react';
import { Card, Table, Form, InputGroup, Button, Row, Col, Badge, Alert, Spinner, Toast, Container } from 'react-bootstrap';
import { FaPlus, FaInfoCircle, FaSearch, FaChevronLeft, FaChevronRight, FaBook, FaBoxOpen } from 'react-icons/fa';
import entradaSaidaService from '../services/entradaSaidaService';
import livroService from '../services/livroService';

const ITENS_POR_PAGINA = 7;

const Entrada = () => {
  const [loading, setLoading] = useState(false);
  const [livros, setLivros] = useState([]);
  const [passoAtual, setPassoAtual] = useState(1);
  const [termoBusca, setTermoBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [ordenacao, setOrdenacao] = useState('titulo_asc');
  const [livroSelecionado, setLivroSelecionado] = useState(null);
  const [opcoes, setOpcoes] = useState({ origens: [] });
  const [dadosEntrada, setDadosEntrada] = useState({
    livro_id: '',
    origem: '',
    observacoes: '',
    quantidade: 0
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = "Bookly - Entrada de Livros";
  }, []);

  // FUNÇÃO PARA FORMATAR TEXTO
  const formatarTexto = (texto) => {
    if (!texto || texto === '-') return '-';
    if (typeof texto === 'number' || typeof texto === 'object') return texto;

    const textoString = texto.toString().trim();
    
    if (textoString.toLowerCase() === 'usuario_especial') {
      return 'Usuário Especial';
    }

    if (textoString.includes(' ')) {
      if (
        textoString.toLowerCase().includes('harry') ||
        textoString.toLowerCase().includes('potter') ||
        textoString.toLowerCase().includes('o ') ||
        textoString.toLowerCase().includes('a ') ||
        textoString.toLowerCase().includes('de ') ||
        textoString.toLowerCase().includes('da ') ||
        textoString.toLowerCase().includes('do ') ||
        textoString.toLowerCase().includes('dos ') ||
        textoString.toLowerCase().includes('das ') ||
        textoString.toLowerCase().includes('e ')
      ) {
        return textoString
          .split(' ')
          .map(palavra => {
            const palavrasMinusculas = ['o', 'a', 'os', 'as', 'de', 'da', 'do', 'dos', 'das', 'e', 'em', 'para', 'por', 'com', 'sem'];
            if (palavrasMinusculas.includes(palavra.toLowerCase())) {
              return palavra.toLowerCase();
            }
            if (palavra.length <= 4 && /^[A-Z]+$/.test(palavra.toUpperCase())) {
              return palavra.toUpperCase();
            }
            return palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase();
          })
          .join(' ');
      } else {
        return textoString
          .toLowerCase()
          .split(' ')
          .map(palavra => {
            if (palavra.length <= 4 && /^[A-Z]+$/.test(palavra.toUpperCase())) {
              return palavra.toUpperCase();
            }
            return palavra.charAt(0).toUpperCase() + palavra.slice(1);
          })
          .join(' ');
      }
    }

    if (textoString.length <= 4 && /^[A-Z]+$/.test(textoString)) {
      return textoString.toUpperCase();
    }

    return textoString.charAt(0).toUpperCase() + textoString.slice(1).toLowerCase();
  };

  // Carrega livros com estoque 
  const loadLivros = async () => {
    try {
      setLoading(true);
      const data = await livroService.getAll();

      const estoquesPromises = data.map(livro =>
        entradaSaidaService.verificarEstoque(livro.id).catch(() => 0)
      );
      const estoques = await Promise.all(estoquesPromises);

      const livrosComEstoque = data.map((livro, index) => ({
        ...livro,
        estoque: estoques[index]
      }));

      setLivros(livrosComEstoque);
    } catch (err) {
      console.error('Erro detalhado:', err);
      setError(`Erro ao carregar livros: ${err.message}`);
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

  // Resetar página quando filtros mudarem
  useEffect(() => {
    setPaginaAtual(1);
  }, [termoBusca, ordenacao]);

  // Função de ordenação
  const ordenarLivros = (livros) => {
    return [...livros].sort((a, b) => {
      switch (ordenacao) {
        case 'titulo_asc':
          return (a.titulo || '').localeCompare(b.titulo || '');
        case 'titulo_desc':
          return (b.titulo || '').localeCompare(a.titulo || '');
        case 'estoque_asc':
          return (a.estoque || 0) - (b.estoque || 0);
        case 'estoque_desc':
          return (b.estoque || 0) - (a.estoque || 0);
        case 'id_asc':
          return a.id - b.id;
        case 'id_desc':
          return b.id - a.id;
        default:
          return (a.titulo || '').localeCompare(b.titulo || '');
      }
    });
  };

  // Filtrar livros 
  const livrosFiltrados = livros.filter(livro => {
    const termo = termoBusca.toLowerCase();
    return (
      (livro.titulo || '').toLowerCase().includes(termo) ||
      (livro.id || '').toString().toLowerCase().includes(termo) ||
      (livro.estoque || '').toString().includes(termo)
    );
  });

  // Aplicar ordenação
  const livrosOrdenados = ordenarLivros(livrosFiltrados);

  // Calcular paginação
  const totalPaginas = Math.ceil(livrosOrdenados.length / ITENS_POR_PAGINA);
  const paginaValida = Math.max(1, Math.min(paginaAtual, totalPaginas));
  if (paginaValida !== paginaAtual) {
    setPaginaAtual(paginaValida);
  }

  const inicio = (paginaValida - 1) * ITENS_POR_PAGINA;
  const fim = inicio + ITENS_POR_PAGINA;
  const livrosPaginaAtual = livrosOrdenados.slice(inicio, fim);

  const handlePaginaAnterior = () => {
    if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1);
  };

  const handleProximaPagina = () => {
    if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1);
  };

  // Funções para navegação entre passos
  const avancarParaMotivo = () => {
    if (dadosEntrada.quantidade <= 0) {
      setError('A quantidade deve ser maior que zero');
      return;
    }
    if (!dadosEntrada.origem) {
      setError('Selecione a origem da entrada');
      return;
    }
    setError('');
    setPassoAtual(2);
  };

  const voltarParaQuantidade = () => {
    setPassoAtual(1);
    setError('');
  };

  // Selecionar livro
  const selecionarLivro = async (livro) => {
    setLivroSelecionado(livro);
    setPassoAtual(1);
    setDadosEntrada({
      livro_id: livro.id,
      origem: '',
      observacoes: '',
      quantidade: 0
    });

    try {
      const estoqueInfo = await entradaSaidaService.verificarEstoqueDisponivel(livro.id);
      setLivroSelecionado(prev => ({
        ...prev,
        estoque: estoqueInfo.estoqueFisico,
        totalEmprestado: estoqueInfo.totalEmprestado
      }));
      setError('');
    } catch (err) {
      console.error(err);
      const estoque = await entradaSaidaService.verificarEstoque(livro.id);
      setLivroSelecionado(prev => ({ ...prev, estoque, totalEmprestado: 0 }));
      setError('Erro ao buscar informações detalhadas do estoque');
    }
  };

  // Submeter formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dadosEntrada.observacoes.trim()) {
      setError('O campo observações é obrigatório para registrar a entrada.');
      return;
    }

    setLoading(true);
    try {
      const resultado = await entradaSaidaService.registrarEntrada(dadosEntrada);
      setShowSuccess(true);
      setDadosEntrada({ livro_id: '', origem: '', observacoes: '', quantidade: 0 });
      setLivroSelecionado(null);
      setPassoAtual(1);
      setError('');
    } catch (err) {
      console.error('Erro ao registrar entrada:', err);
      setError(err.message || 'Erro ao registrar entrada');
    } finally {
      setLoading(false);
      await loadLivros();
    }
  };

  return (
    <Container className="py-4">
      {/* Toast de sucesso */}
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999 }}>
        <Toast
          show={showSuccess}
          onClose={() => setShowSuccess(false)}
          delay={6000}
          autohide
          className="shadow-sm"
          style={{
            minWidth: '320px',
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            borderLeft: '4px solid #28a745',
            animation: showSuccess ? 'slideInRight 0.3s ease-out' : 'none'
          }}
        >
          <Toast.Body className="p-3">
            <div className="d-flex justify-content-between align-items-start">
              <div className="d-flex align-items-start">
                <div 
                  className="me-3 mt-1"
                  style={{
                    color: '#28a745',
                    fontSize: '1rem'
                  }}
                >
                  <i className="fas fa-check"></i>
                </div>
                <div>
                  <h6 className="mb-1 fw-semibold text-dark">
                    Entrada Registrada!
                  </h6>
                  <p className="mb-0 text-secondary" style={{ fontSize: '0.9rem' }}>
                    Entrada de livro registrada com sucesso!
                  </p>
                  <small className="text-muted mt-1 d-block">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </small>
                </div>
              </div>
              <button
                onClick={() => setShowSuccess(false)}
                className="btn-close btn-close-sm opacity-50"
                style={{
                  fontSize: '0.6rem',
                  padding: '5px',
                  marginTop: '-2px',
                  marginRight: '-5px'
                }}
              />
            </div>
          </Toast.Body>
        </Toast>
      </div>

      <div className="rounded-3 p-4 mb-4 border">
        <Row className="align-items-center">
          <Col md={8}>
            <div className="d-flex align-items-center">
              <div className="me-3">
                <i className="fas fa-book-open fa-2x" style={{ color: '#0b192c' }}></i>
              </div>
              <div>
                <h4 className="fw-bold text-dark mb-1">Entrada de Livros</h4>
                <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>
                  Registro e controle de novas entradas no acervo
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <p className="text-muted mb-1" style={{ fontSize: '0.9rem' }}>
        Esta seção permite o <strong>registro de entrada de livros no acervo</strong>. Você pode adicionar novos exemplares, controlar o estoque em tempo real e gerenciar o movimento de livros no sistema.
      </p>

      <div className="d-flex flex-wrap justify-content-start align-items-center gap-4 py-3 ">
        <div className="text-center px-3 py-2">
          <h6 className="mb-0 text-primary fw-bold">{livros.length}</h6>
          <small className="text-muted">Livros cadastrados</small>
        </div>
        <div className="text-center px-3 py-2">
          <h6 className="mb-0 text-success fw-bold">
            {livros.reduce((acc, l) => acc + (l.estoque || 0), 0)}
          </h6>
          <small className="text-muted">Total no acervo</small>
        </div>
      </div>

      <Row>
        {/* Lista de Livros */}
        <Col lg={6}>
          <Card>
            <Card.Header className="bg-primary text-white d-flex flex-wrap justify-content-between align-items-center">
              <h6 className="mb-0">Selecionar Livro</h6>
              <div className="d-flex align-items-center gap-3">
                <Form.Select
                  value={ordenacao}
                  onChange={(e) => setOrdenacao(e.target.value)}
                  style={{ width: 'auto', minWidth: '180px' }}
                  size="sm"
                >
                  <option value="titulo_asc">Título (A-Z)</option>
                  <option value="titulo_desc">Título (Z-A)</option>
                  <option value="estoque_asc">Estoque (menor)</option>
                  <option value="estoque_desc">Estoque (maior)</option>
                  <option value="id_asc">ID (crescente)</option>
                  <option value="id_desc">ID (decrescente)</option>
                </Form.Select>
                <div style={{ minWidth: '200px', maxWidth: '250px' }}>
                  <InputGroup size="sm">
                    <InputGroup.Text className="bg-light text-primary">
                      <FaSearch />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Buscar livros..."
                      value={termoBusca}
                      onChange={(e) => setTermoBusca(e.target.value)}
                    />
                  </InputGroup>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" />
                  <p className="text-muted mt-2">Carregando livros...</p>
                </div>
              ) : livrosPaginaAtual.length === 0 ? (
                <p className="text-muted text-center py-4">
                  {termoBusca ? 'Nenhum livro encontrado' : 'Nenhum livro cadastrado'}
                </p>
              ) : (
                <>
                  <div className="table-responsive">
                    <Table striped hover responsive className="align-middle">
                      <thead>
                        <tr>
                          <th width="70px">Capa</th>
                          <th>Título</th>
                          <th width="80px">ID</th>
                          <th width="100px">Estoque</th>
                          <th width="120px" className="text-center">Selecionar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {livrosPaginaAtual.map((livro) => {
                          const isSelected = livroSelecionado?.id === livro.id;
                          return (
                            <tr key={livro.id} className={isSelected ? 'table-active' : ''}>
                              <td>
                                {livro.imagem ? (
                                  <img
                                    src={`http://localhost:3000${livro.imagem}`}
                                    alt={livro.titulo}
                                    className="livrolist-lista-livro-imagem"
                                    onError={e => { e.target.style.display = 'none' }}
                                  />
                                ) : (
                                  <div className="livrolist-lista-sem-imagem">
                                    <FaBook size={12} />
                                  </div>
                                )}
                              </td>
                              <td>
                                <div className="fw-semibold" style={{ maxWidth: '200px' }}>
                                  {formatarTexto(livro.titulo)}
                                </div>
                                <small className="text-muted">
                                  {formatarTexto(livro.autor_nome)} 
                                </small>
                              </td>
                              <td className="fw-bold">#{livro.id}</td>
                              <td>{livro.estoque || 0}</td>
                              <td className="text-center">
                                <Button
                                  variant={isSelected ? 'success' : 'paginacao'}
                                  size="sm"
                                  onClick={() => selecionarLivro(livro)}
                                  disabled={isSelected}
                                >
                                  {isSelected ? 'Selecionado' : 'Selecionar'}
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>

                  {/* Paginação */}
                  {totalPaginas > 1 && (
                    <div className="d-flex justify-content-between align-items-center mt-4">
                      <div className="text-muted small">
                        Mostrando {inicio + 1} a {Math.min(fim, livrosOrdenados.length)} de {livrosOrdenados.length} livros
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <Button
                          className="btn-paginacao"
                          onClick={handlePaginaAnterior}
                          disabled={paginaAtual === 1}
                        >
                          <FaChevronLeft className="me-1" />
                          Anterior
                        </Button>
                        <span className="mx-3 text-muted">
                          Página <strong>{paginaAtual}</strong> de <strong>{totalPaginas}</strong>
                        </span>
                        <Button
                          className="btn-paginacao"
                          onClick={handleProximaPagina}
                          disabled={paginaAtual === totalPaginas}
                        >
                          Próxima
                          <FaChevronRight className="ms-1" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Coluna Direita - Formulário ou Mensagem */}
        <Col lg={6}>
          {livroSelecionado ? (
            <>
              {/* Card do Livro Selecionado */}
              <Card className="mb-3">
                <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">Livro Selecionado</h6>
                  <Badge bg="light" text="dark">
                    ID: #{livroSelecionado.id}
                  </Badge>
                </Card.Header>
                <Card.Body>
                  <Row className="align-items-center">
                    <Col md={4} className="text-center">
                      {livroSelecionado.imagem ? (
                        <img
                          src={`http://localhost:3000${livroSelecionado.imagem}`}
                          alt={livroSelecionado.titulo}
                          className="livrolist-livro-imagem"
                        />
                      ) : (
                        <div className="livrolist-sem-imagem">
                          <FaBook size={32} />
                        </div>
                      )}
                    </Col>
                    <Col md={8}>
                      <h6 className="fw-bold text-primary mb-2">{formatarTexto(livroSelecionado.titulo)}</h6> 
                      <div className="row small">
                        <div className="col-6 mb-1">
                          <strong>Autor:</strong>
                          <div>{formatarTexto(livroSelecionado.autor_nome)}</div> 
                        </div>
                        <div className="col-6 mb-1">
                          <strong>Editora:</strong>
                          <div>{formatarTexto(livroSelecionado.editora_nome)}</div> 
                        </div>
                        <div className="col-6 mb-1">
                          <strong>ISBN:</strong>
                          <div>{livroSelecionado.isbn || 'Não informado'}</div>
                        </div>
                        <div className="col-6 mb-1">
                          <strong>Gênero:</strong>
                          <div>{formatarTexto(livroSelecionado.genero)}</div> 
                        </div>
                      </div>
                      <div className="mt-3 pt-2 border-top">
                        <div className="row small">
                          <div className="col-12 mb-2">
                            <div className="d-flex justify-content-between align-items-center">
                              <strong>Estoque atual:</strong>
                              <Badge bg="primary">
                                {livroSelecionado.estoque || 0} unidades
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Formulário em 2 Passos */}
              {passoAtual === 1 ? (
                // PASSO 1: Quantidade e Origem
                <Card>
                  <Card.Header className="bg-primary text-white">
                    <h6 className="mb-0">Definir Quantidade e Origem</h6>
                  </Card.Header>
                  <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Label className="fw-semibold">Origem</Form.Label>
                        <Form.Select
                          value={dadosEntrada.origem}
                          onChange={e => setDadosEntrada({ ...dadosEntrada, origem: e.target.value })}
                          required
                        >
                          <option value="">Selecione...</option>
                          {opcoes.origens.map(origem => (
                            <option key={origem} value={origem}>{origem}</option>
                          ))}
                        </Form.Select>
                      </Col>
                      <Col md={6}>
                        <Form.Label className="fw-semibold">Quantidade</Form.Label>
                        <div className="input-group">
                          <Form.Control
                            type="number"
                            min="0"
                            value={dadosEntrada.quantidade}
                            onChange={e => {
                              const val = parseInt(e.target.value) || 0;
                              setDadosEntrada({ ...dadosEntrada, quantidade: Math.max(0, val) });
                            }}
                            placeholder="0"
                            className="form-control"
                          />
                          <span className="input-group-text">Unidades</span>
                        </div>
                        {dadosEntrada.quantidade === 0 && (
                          <Form.Text className="text-danger small">
                            Informe a quantidade (maior que zero)
                          </Form.Text>
                        )}
                      </Col>
                    </Row>
                    <div className="d-flex justify-content-between">
                      <Button
                        variant="cancelar"
                        onClick={() => {
                          setLivroSelecionado(null);
                          setPassoAtual(1);
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="primary"
                        onClick={avancarParaMotivo}
                        disabled={dadosEntrada.quantidade <= 0 || !dadosEntrada.origem}
                      >
                        Avançar para Motivo
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ) : (
                // PASSO 2: Motivo e Confirmação
                <Card>
                  <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">Registrar Entrada</h6>
                    <Badge bg="light" text="dark">
                      {dadosEntrada.quantidade} unidade{dadosEntrada.quantidade !== 1 ? 's' : ''}
                    </Badge>
                  </Card.Header>
                  <Card.Body>
                    <Form onSubmit={handleSubmit}>
                     <div className="mb-4">
                          <h6 className="fw-semibold mb-3">Detalhes da Entrada</h6>
                          
                          <Table borderless className="bg-light rounded">
                            <tbody>
                              <tr>
                                <td width="40%" className="border-bottom py-2">
                                  <div className="d-flex align-items-center gap-2">
                                    <i className="fas fa-tag fa-sm text-muted"></i>
                                    <span className="text-muted">Origem</span>
                                  </div>
                                </td>
                                <td className="border-bottom py-2">
                                  <Badge bg="info" className="fw-normal">
                                    {dadosEntrada.origem}
                                  </Badge>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-bottom py-2">
                                  <div className="d-flex align-items-center gap-2">
                                    <i className="fas fa-box fa-sm text-muted"></i>
                                    <span className="text-muted">Estoque Atual</span>
                                  </div>
                                </td>
                                <td className="border-bottom py-2 fw-semibold">
                                  {livroSelecionado.estoque || 0} unidades
                                </td>
                              </tr>
                              <tr>
                                <td className="border-bottom py-2">
                                  <div className="d-flex align-items-center gap-2">
                                    <i className="fas fa-arrow-right fa-sm text-success"></i>
                                    <span className="text-muted">Entrada Registrada</span>
                                  </div>
                                </td>
                                <td className="border-bottom py-2">
                                  <span className="fw-semibold text-success">
                                    +{dadosEntrada.quantidade} unidades
                                  </span>
                                </td>
                              </tr>
                              <tr className="bg-primary-subtle">
                                  <td className="py-3">
                                <div className="d-flex align-items-center gap-2">
                                  <i className="fas fa-calculator fa-sm text-warning"></i>
                                  <strong className="text-warning">Estoque Final</strong>
                                </div>
                              </td>
                                <td className="py-3">
                                  <div className="d-flex align-items-baseline gap-2">
                                  <span className="fs-4 fw-bold text-warning">
                                      {(livroSelecionado.estoque || 0) + dadosEntrada.quantidade}
                                    </span>
                                    <span className="text-muted">unidades</span>
                                  </div>
                                  <div className="small text-muted">
                                    {livroSelecionado.estoque || 0} + {dadosEntrada.quantidade}
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        </div>
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold">
                          Motivo da Entrada <span className="text-danger"></span>
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="(ex: comprado da loja X, recebido por doação, reposição...)"
                          value={dadosEntrada.observacoes}
                          onChange={e => setDadosEntrada({ ...dadosEntrada, observacoes: e.target.value })}
                          required
                        />
                        <Form.Text className="text-muted">
                          Informe detalhes sobre esta entrada para manter o histórico do acervo.
                        </Form.Text>
                      </Form.Group>

                      {error && <Alert variant="danger">{error}</Alert>}

                      <div className="d-flex justify-content-between">
                        <Button
                          variant="paginacao"
                          onClick={voltarParaQuantidade}
                          disabled={loading}
                        >
                          Voltar
                        </Button>
                        <div className="d-flex gap-2">
                          <Button
                            variant="cancelar"
                            onClick={() => {
                              setLivroSelecionado(null);
                              setPassoAtual(1);
                            }}
                            disabled={loading}
                          >
                            Cancelar
                          </Button>
                          <Button
                            type="submit"
                            variant="success"
                            disabled={loading || !dadosEntrada.observacoes.trim()}
                          >
                            {loading ? (
                              <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Registrando...
                              </>
                            ) : (
                              'Registrar Entrada'
                            )}
                          </Button>
                        </div>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              )}
            </>
          ) : (
            // Se nenhum livro selecionado
            <Card className="text-center py-5">
              <Card.Body>
                <h5 className="text-muted">Nenhum livro selecionado</h5>
                <p className="text-muted">
                  Selecione um livro da lista ao lado para registrar uma entrada.
                </p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Entrada;