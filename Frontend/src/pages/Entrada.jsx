import { useState, useEffect } from 'react';
import { Card, Table, Form, InputGroup, Button, Row, Col, Badge, Alert, Spinner, Toast, Container } from 'react-bootstrap';
import { FaPlus, FaInfoCircle, FaSearch, FaChevronLeft, FaChevronRight, FaBook, FaBoxOpen } from 'react-icons/fa';
import entradaSaidaService from '../services/entradaSaidaService';
import livroService from '../services/livroService';

const ITENS_POR_PAGINA = 7;

const Entrada = () => {
  const [loading, setLoading] = useState(false);
  const [livros, setLivros] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [ordenacao, setOrdenacao] = useState('titulo_asc');
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

 useEffect(() => {
    document.title = "Bookly - Entrada de Livros";
  }, []);

// FUNÇÃO PARA FORMATAR TEXTO COM PRIMEIRA LETRA MAIÚSCULA
// Função universal para formatar textos
const formatarTexto = (texto) => {
  if (!texto || texto === '-') return '-';

  // Se for número ou elemento React, retorna como está
  if (typeof texto === 'number' || typeof texto === 'object') return texto;

  const textoString = texto.toString().trim();

  // Casos especiais que precisam de tratamento específico
  if (textoString.toLowerCase() === 'usuario_especial') {
    return 'Usuário Especial';
  }

  // Para nomes próprios (pessoas), converter para formato de nome
  if (textoString.includes(' ')) {
    // Verificar se é um nome de pessoa (usuário) ou título de livro
    // Para nomes de usuários, aplicar capitalização normal
    if (
      textoString.toLowerCase().includes('harry') ||
      textoString.toLowerCase().includes('potter') ||
      // Aqui você pode adicionar outras pistas de que é um título de livro
      textoString.toLowerCase().includes('o ') ||
      textoString.toLowerCase().includes('a ') ||
      textoString.toLowerCase().includes('de ') ||
      textoString.toLowerCase().includes('da ') ||
      textoString.toLowerCase().includes('do ') ||
      textoString.toLowerCase().includes('dos ') ||
      textoString.toLowerCase().includes('das ') ||
      textoString.toLowerCase().includes('e ')
    ) {
      // É provavelmente um título de livro - manter como está ou aplicar regras específicas
      return textoString
        .split(' ')
        .map(palavra => {
          // Palavras que devem ser mantidas em letra minúscula (artigos, preposições, conjunções)
          const palavrasMinusculas = ['o', 'a', 'os', 'as', 'de', 'da', 'do', 'dos', 'das', 'e', 'em', 'para', 'por', 'com', 'sem'];
          
          if (palavrasMinusculas.includes(palavra.toLowerCase())) {
            return palavra.toLowerCase();
          }
          
          // Manter siglas em maiúsculo (ex: ISBN, CPF, etc)
          if (palavra.length <= 4 && /^[A-Z]+$/.test(palavra.toUpperCase())) {
            return palavra.toUpperCase();
          }
          
          // Capitalizar outras palavras
          return palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase();
        })
        .join(' ');
    } else {
      // É um nome de pessoa - aplicar formatação normal
      return textoString
        .toLowerCase()
        .split(' ')
        .map(palavra => {
          // Manter siglas em maiúsculo (ex: CPF, ISBN, etc)
          if (palavra.length <= 4 && /^[A-Z]+$/.test(palavra.toUpperCase())) {
            return palavra.toUpperCase();
          }
          return palavra.charAt(0).toUpperCase() + palavra.slice(1);
        })
        .join(' ');
    }
  }

  // Para textos sem espaços, verificar se é um nome próprio ou sigla
  if (textoString.length <= 4 && /^[A-Z]+$/.test(textoString)) {
    // É uma sigla, manter em maiúsculo
    return textoString.toUpperCase();
  }

  // Para textos simples, capitalizar apenas a primeira letra
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

  // Selecionar livro
  // Atualize a função selecionarLivro
  const selecionarLivro = async (livro) => {
    setLivroSelecionado(livro);
    setFormData(prev => ({ ...prev, livro_id: livro.id }));

    try {
      // Busca informações completas do estoque
      const estoqueInfo = await entradaSaidaService.verificarEstoqueDisponivel(livro.id);

      setLivroSelecionado(prev => ({
        ...prev,
        estoque: estoqueInfo.estoqueFisico,
        totalEmprestado: estoqueInfo.totalEmprestado
      }));
      setError('');
    } catch (err) {
      console.error(err);
      // Fallback se não conseguir buscar as informações detalhadas
      const estoque = await entradaSaidaService.verificarEstoque(livro.id);
      setLivroSelecionado(prev => ({ ...prev, estoque, totalEmprestado: 0 }));
      setError('Erro ao buscar informações detalhadas do estoque');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.observacoes.trim()) {
      setError('O campo observações é obrigatório para registrar a entrada.');
      return;
    }

    setLoading(true);
    try {
      const resultado = await entradaSaidaService.registrarEntrada(formData);

      setShowSuccess(true);
      setFormData({ livro_id: '', origem: '', observacoes: '', quantidade: 1 });
      setLivroSelecionado(null);
      setError('');
    } catch (err) {
      console.error(' Erro ao registrar entrada:', err);
      setError(err.message || 'Erro ao registrar entrada');
    } finally {
      setLoading(false);
      await loadLivros();
    }
  };

  return (
    <Container className="py-4">
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
          <Col md={4} className="text-md-end">
            <div className="d-flex justify-content-end flex-wrap gap-2">
          
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
                {/* Seletor de Ordenação */}
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

                {/* Barra de pesquisa */}
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
                            <tr
                              key={livro.id}
                              className={isSelected ? 'table-active' : ''}
                            >
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

                              <td>
                                <span>
                                  {livro.estoque || 0}
                                </span>
                              </td>

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

                  {/* Paginação Padronizada */}
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

        {/* Formulário de Entrada*/}
        <Col lg={6}>
          {livroSelecionado ? (
            <>
              {/* Card do Livro Selecionado */}
              <Card className="mb-3">
                <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">
                    Livro Selecionado
                  </h6>
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

                      {/* SEÇÃO DE ESTOQUE ORGANIZADA */}
                      <div className="mt-3 pt-2 border-top">
                        <div className="row small">
                          <div className="col-12 mb-0">
                            <div className="d-flex justify-content-between align-items-center">
                              <strong>
                                Estoque físico total:
                              </strong>
                              <Badge bg="primary">
                                {livroSelecionado.estoque || 0} unidades
                              </Badge>
                            </div>
                          </div>
                          <div className="col-12 mb-2">

                          </div>
                          <div className="col-12">
                            <div className="d-flex justify-content-between align-items-center">
                              <strong className="text-success">Após entrada:</strong>
                              <Badge bg="success">
                                {livroSelecionado.estoque + formData.quantidade} unidades
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>


              {/* Formulário de Registro */}
              <Card>
                <Card.Header className="bg-primary text-white">
                  <h6 className="mb-0">
                    Registrar Entrada
                  </h6>
                </Card.Header>
                <Card.Body>
                  <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Label className="fw-semibold">Origem</Form.Label>
                        <Form.Select
                          value={formData.origem}
                          onChange={e => setFormData({ ...formData, origem: e.target.value })}
                          required
                        >
                          <option value="">Selecione a origem</option>
                          {opcoes.origens.map(origem => (
                            <option key={origem} value={origem}>{origem}</option>
                          ))}
                        </Form.Select>
                      </Col>
                      <Col md={6}>
                        <Form.Label className="fw-semibold">Quantidade</Form.Label>
                        <Form.Control
                          type="number"
                          min="1"
                          value={formData.quantidade}
                          onChange={e => setFormData({ ...formData, quantidade: parseInt(e.target.value) || 1 })}
                          required
                        />
                      </Col>
                    </Row>

                   <Form.Group className="mb-3">

                    <Alert variant="" className="py-2 mb-2">
                      <FaInfoCircle
                        className="me-1"
                        style={{ color: "var(--color-accent)" }}
                      />

                      <small style={{ opacity: 0.9 }}>
                        <strong style={{ color: "var(--color-accent)" }}>Obrigatório:</strong>{" "}
                        Informe o motivo desta entrada.
                      </small>

                      <p
                        style={{
                          fontSize: "0.7rem",
                          marginTop: "2px",
                          opacity: 0.7,
                          lineHeight: "1.2",
                        }}
                      >
                        O motivo da entrada deve ser informado para assegurar o registro rastreável da
                        movimentação e manter o histórico do acervo atualizado.
                      </p>
                    </Alert>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="(ex: comprado da loja X, recebido por doação, reposição, ajuste de inventário...)"
                      value={formData.observacoes}
                      onChange={e => setFormData({ ...formData, observacoes: e.target.value })}
                    />
                  </Form.Group>


                    {error && (
                      <Alert variant="danger" className="mb-3">{error}</Alert>
                    )}

                    <div className="d-flex gap-2">
                      <Button
                        type="submit"
                        variant="success"
                        disabled={loading || !formData.observacoes.trim()}
                      >
                        {loading ? (
                          <><Spinner animation="border" size="sm" /> Registrando...</>
                        ) : (
                          <> Registrar Entrada</>
                        )}
                      </Button>

                      <Button
                        variant="cancelar"
                        onClick={() => {
                          setLivroSelecionado(null);
                          setFormData({ livro_id: '', origem: '', observacoes: '', quantidade: 1 });
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </>
          ) : (
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