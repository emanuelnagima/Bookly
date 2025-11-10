import { useState, useEffect } from 'react';
import { Card, Table, Form, InputGroup, Button, Row, Col, Modal, Image } from 'react-bootstrap';
import { FaEdit, FaTrash, FaSearch, FaChevronLeft, FaChevronRight, FaBook, FaInfoCircle, FaImage, FaTh, FaList, FaUser, FaBuilding, FaTags, FaCalendarAlt, FaHashtag } from 'react-icons/fa';
import entradaSaidaService from '../services/entradaSaidaService';

const ITENS_POR_PAGINA = 7;

const formatarTexto = (texto = '') =>
  texto
    .toLowerCase()
    .split(' ')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');

const LivroList = ({ livros, loading, onDelete, onEdit }) => {
  const [termoBusca, setTermoBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [livrosComEstoque, setLivrosComEstoque] = useState([]);
  const [visualizacao, setVisualizacao] = useState('lista'); // Alterado para 'lista' como padrão
  const [ordenacao, setOrdenacao] = useState('titulo_asc');
  const [filtroGenero, setFiltroGenero] = useState('todos');

  const [showDetalhesModal, setShowDetalhesModal] = useState(false);
  const [livroSelecionado, setLivroSelecionado] = useState(null);

  useEffect(() => {
    setPaginaAtual(1);
  }, [termoBusca, ordenacao, filtroGenero]);

  useEffect(() => {
    const fetchEstoque = async () => {
      const livrosAtualizados = await Promise.all(
        livros.map(async (livro) => {
          try {
            const estoque = await entradaSaidaService.verificarEstoque(livro.id);
            return { ...livro, estoque: estoque ?? 0 };
          } catch {
            return { ...livro, estoque: 0 };
          }
        })
      );
      setLivrosComEstoque(livrosAtualizados);
    };
    fetchEstoque();
  }, [livros]);

  // Função de ordenação
  const ordenarLivros = (livros) => {
    return [...livros].sort((a, b) => {
      switch (ordenacao) {
        case 'titulo_asc':
          return formatarTexto(a.titulo || a.title || '').localeCompare(formatarTexto(b.titulo || b.title || ''));
        case 'titulo_desc':
          return formatarTexto(b.titulo || b.title || '').localeCompare(formatarTexto(a.titulo || a.title || ''));
        case 'autor_asc':
          return formatarTexto(a.autor_nome || a.author || '').localeCompare(formatarTexto(b.autor_nome || b.author || ''));
        case 'autor_desc':
          return formatarTexto(b.autor_nome || b.author || '').localeCompare(formatarTexto(a.autor_nome || a.author || ''));
        case 'estoque_asc':
          return (a.estoque || 0) - (b.estoque || 0);
        case 'estoque_desc':
          return (b.estoque || 0) - (a.estoque || 0);
        case 'ano_asc':
          return (a.ano_publicacao || a.year || 0) - (b.ano_publicacao || b.year || 0);
        case 'ano_desc':
          return (b.ano_publicacao || b.year || 0) - (a.ano_publicacao || a.year || 0);
        default:
          return formatarTexto(a.titulo || a.title || '').localeCompare(formatarTexto(b.titulo || b.title || ''));
      }
    });
  };

  // Filtrar livros
  const livrosFiltrados = livrosComEstoque.filter((livro) => {
    if (!termoBusca && filtroGenero === 'todos') return true;

    const termo = termoBusca.toLowerCase();
    const matchesBusca = !termoBusca || (
      (livro.titulo || livro.title || '').toLowerCase().includes(termo) ||
      (livro.autor_nome || livro.author || '').toLowerCase().includes(termo) ||
      (livro.editora_nome || livro.publisher || '').toLowerCase().includes(termo) ||
      (livro.isbn || '').toString().toLowerCase().includes(termo) ||
      (livro.genero || livro.genre || '').toLowerCase().includes(termo) ||
      (livro.ano_publicacao || livro.year || '').toString().includes(termo)
    );

    const matchesGenero = filtroGenero === 'todos' || (livro.genero || livro.genre || '') === filtroGenero;

    return matchesBusca && matchesGenero;
  });

  // Aplicar ordenação
  const livrosOrdenados = ordenarLivros(livrosFiltrados);

  // Calcular paginação
  const totalPaginas = Math.ceil(livrosOrdenados.length / ITENS_POR_PAGINA);

  // Garantir que a página atual seja válida
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

  // Função para abrir modal com detalhes do livro
  const handleVerDetalhes = (livro) => {
    setLivroSelecionado(livro);
    setShowDetalhesModal(true);
  };

  // Fechar modal
  const handleCloseDetalhesModal = () => {
    setShowDetalhesModal(false);
    setLivroSelecionado(null);
  };

  // Obter gêneros únicos para o filtro
  const generosUnicos = [...new Set(livros.map(livro => livro.genero || livro.genre).filter(Boolean))];

  return (
    <Card>
      <Card.Header className="bg-primary text-white d-flex flex-wrap justify-content-between align-items-center">
        <div className="d-flex align-items-center mb-2 mb-md-0">
          <FaBook
            style={{
              marginRight: '8px',
              fontSize: '26px',
              color: '#ffffff',
              border: '2px solid #585858',
              borderRadius: '50%',
              padding: '4px',
              display: 'inline-flex',
              verticalAlign: 'middle'
            }}
          />
          <h5 className="mb-0">Livros</h5>
        </div>

        <div className="d-flex align-items-center gap-3">
          {/* Seletor de Visualização */}
          <div className="btn-group" role="group">
            <Button
              className={visualizacao === 'lista' ? 'btn-light active' : 'btn-outline-light'}
              size="sm"
              onClick={() => setVisualizacao('lista')}
              title="Visualização em lista"
            >
              <FaList className="me-1" />
              Lista
            </Button>

            <Button
              className={visualizacao === 'cards' ? 'btn-light active' : 'btn-outline-light'}
              size="sm"
              onClick={() => setVisualizacao('cards')}
              title="Visualização em cards"
            >
              <FaTh className="me-1" />
              Cards
            </Button>
          </div>

          {/* Filtro de Gênero */}
          <Form.Select
            value={filtroGenero}
            onChange={(e) => setFiltroGenero(e.target.value)}
            style={{ width: 'auto', minWidth: '150px' }}
            size="sm"
          >
            <option value="todos">Todos os gêneros</option>
            {generosUnicos.map(genero => (
              <option key={genero} value={genero}>{genero}</option>
            ))}
          </Form.Select>

          {/* Seletor de Ordenação */}
          <Form.Select
            value={ordenacao}
            onChange={(e) => setOrdenacao(e.target.value)}
            style={{ width: 'auto', minWidth: '200px' }}
            size="sm"
          >
            <option value="titulo_asc">Título (A-Z)</option>
            <option value="titulo_desc">Título (Z-A)</option>
            <option value="autor_asc">Autor (A-Z)</option>
            <option value="autor_desc">Autor (Z-A)</option>
            <option value="estoque_asc">Estoque (menor)</option>
            <option value="estoque_desc">Estoque (maior)</option>
            <option value="ano_asc">Ano (mais antigo)</option>
            <option value="ano_desc">Ano (mais recente)</option>
          </Form.Select>

          {/* Barra de pesquisa */}
          <div style={{ minWidth: '200px', maxWidth: '300px' }}>
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
          <p className="text-center text-muted py-4">Carregando livros...</p>
        ) : livrosPaginaAtual.length === 0 ? (
          <p className="text-muted text-center py-4">
            {termoBusca || filtroGenero !== 'todos' ? 'Nenhum livro encontrado' : 'Nenhum livro cadastrado'}
          </p>
        ) : visualizacao === 'lista' ? (
          // Renderização em Lista 
          <div className="table-responsive">
            <Table striped hover responsive className="align-middle">
              <thead>
                <tr>
                  <th width="80px">ID</th>
                  <th width="70px">Capa</th>
                  <th>Título</th>
                  <th width="120px">ISBN</th>
                  <th width="140px">Autor</th>
                  <th width="120px">Editora</th>
                  <th width="120px">Gênero</th>
                  <th width="100px">Estoque</th>
                  <th width="200px" className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {livrosPaginaAtual.map((livro) => (
                  <tr key={livro.id}>
                    <td className="fw-bold">#{livro.id}</td>

                    {/* Coluna Capa */}
                    <td>
                      {livro.imagem ? (
                        <Image
                          src={`http://localhost:3000${livro.imagem}`}
                          alt={livro.titulo || livro.title || ''}
                          className="livrolist-lista-livro-imagem"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : (
                        <div className="livrolist-lista-sem-imagem">
                          <FaImage size={14} />
                        </div>
                      )}
                    </td>

                    {/* Coluna Título */}
                    <td>
                      <div className="fw-semibold" style={{ maxWidth: '200px' }}>
                        {formatarTexto(livro.titulo || livro.title || '')}
                      </div>
                    </td>

                    {/* Coluna ISBN */}
                    <td className="text-nowrap">
                      {livro.isbn || '-'}
                    </td>

                    {/* Coluna Autor */}
                    <td>
                      {formatarTexto(livro.autor_nome || livro.author || '')}
                    </td>

                    {/* Coluna Editora */}
                    <td>
                      {formatarTexto(livro.editora_nome || livro.publisher || '')}
                    </td>

                    {/* Coluna Gênero */}
                    <td>
                      {formatarTexto(livro.genero || livro.genre || '')}
                    </td>

                    {/* Coluna Estoque */}
                    <td>
                      <span className={livro.estoque > 0 ? 'text-success fw-bold' : 'text-warning fw-bold'}>
                        {livro.estoque || 0}
                      </span>
                    </td>

                    {/* Coluna Ações */}
                    <td>
                      <div className="d-flex gap-2 justify-content-center">
                        <button
                          className="btn-sm-custom btn-renovar"
                          onClick={() => handleVerDetalhes(livro)}
                          title="Ver detalhes do livro"
                        >
                          <FaInfoCircle />
                        </button>

                        <button
                          className="btn-sm-custom btn-edit"
                          onClick={() => onEdit(livro.id)}
                          title="Editar livro"
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="btn-sm-custom btn-danger"
                          onClick={() => onDelete(livro.id)}
                          title="Excluir livro"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          // Renderização em Cards (opcional)
          <Row>
            {livrosPaginaAtual.map((livro) => (
              <Col key={livro.id} md={6} lg={4} xl={3} className="mb-4">
                <Card className="h-100 livro-card">
                  <div className="p-3 text-center">
                    {livro.imagem ? (
                      <Image
                        src={`http://localhost:3000${livro.imagem}`}
                        alt={livro.titulo || livro.title || ''}
                        className="livrolist-livro-imagem"
                        onError={e => { e.target.style.display = 'none' }}
                      />
                    ) : (
                      <div className="livrolist-sem-imagem">
                        <FaImage size={24} />
                      </div>
                    )}
                  </div>
                  <Card.Body className="livrolist-livro-card-body d-flex flex-column">
                    <h6 title={livro.titulo || livro.title || ''}>
                      {formatarTexto(livro.titulo || livro.title || '')}
                    </h6>
                    <div className="livro-detalhes flex-grow-1">
                      <div><strong>ID:</strong> {livro.id}</div>
                      <div><strong>Autor:</strong> {formatarTexto(livro.autor_nome || livro.author || '')}</div>
                      <div><strong>Editora:</strong> {formatarTexto(livro.editora_nome || livro.publisher || '')}</div>
                      <div><strong>Gênero:</strong> {formatarTexto(livro.genero || livro.genre || '')}</div>
                      {livro.isbn && <div><strong>ISBN:</strong> {livro.isbn}</div>}
                      <div><strong>Ano:</strong> {livro.ano_publicacao || livro.year || ''}</div>
                      <div><strong>Estoque:</strong> {livro.estoque || 0}</div>
                    </div>

                    <div className="d-flex gap-2 mt-2">
                      <button
                        className="btn-sm-custom btn-edit"
                        onClick={() => onEdit(livro.id)}
                        title="Editar livro"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn-sm-custom btn-delete"
                        onClick={() => onDelete(livro.id)}
                        title="Excluir livro"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Modal para mostrar detalhes do livro */}
        <Modal show={showDetalhesModal} onHide={handleCloseDetalhesModal} size="lg">
          <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title className="d-flex align-items-center">
              <FaBook className="me-2" />
              Livro #{livroSelecionado?.id} - Detalhes
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="p-4">
            <Row>
              <Col md={4}>
                <div className="text-center mb-4">
                  {livroSelecionado?.imagem ? (
                    <Image
                      src={`http://localhost:3000${livroSelecionado.imagem}`}
                      alt={livroSelecionado?.titulo || livroSelecionado?.title || ''}
                      className="livrolist-modal-imagem img-fluid"
                    />
                  ) : (
                    <div className="livrolist-modal-sem-imagem">
                      <FaImage size={40} />
                    </div>
                  )}
                </div>
              </Col>
              <Col md={8}>
                {/* SEÇÃO: Informações do Livro */}
                <div className="mb-4 p-3 border rounded bg-white">
                  <h5 className="fw-bold mb-3 text-primary border-bottom pb-2 d-flex align-items-center">
                    <FaBook className="me-2" />
                    Informações do Livro
                  </h5>
                  <Row>
                    <Col md={6}>
                      <p className="mb-2">
                        <strong><FaHashtag className="me-2 text-muted" />ID:</strong> {livroSelecionado?.id}
                      </p>
                      <p className="mb-2">
                        <strong>Título:</strong> {formatarTexto(livroSelecionado?.titulo || livroSelecionado?.title || '')}
                      </p>
                      <p className="mb-2">
                        <strong><FaUser className="me-2 text-muted" />Autor:</strong> {formatarTexto(livroSelecionado?.autor_nome || livroSelecionado?.author || '')}
                      </p>
                    </Col>
                    <Col md={6}>
                      <p className="mb-2">
                        <strong><FaBuilding className="me-2 text-muted" />Editora:</strong> {formatarTexto(livroSelecionado?.editora_nome || livroSelecionado?.publisher || '')}
                      </p>
                      <p className="mb-2">
                        <strong><FaTags className="me-2 text-muted" />Gênero:</strong> {formatarTexto(livroSelecionado?.genero || livroSelecionado?.genre || '')}
                      </p>
                      <p className="mb-2">
                        <strong><FaCalendarAlt className="me-2 text-muted" />Ano:</strong> {livroSelecionado?.ano_publicacao || livroSelecionado?.year || ''}
                      </p>
                    </Col>
                  </Row>
                </div>

                {/* SEÇÃO: Informações Adicionais */}
                <div className="p-3 border rounded bg-white">
                  <h5 className="fw-bold mb-3 text-primary border-bottom pb-2">
                    Informações Adicionais
                  </h5>
                  <Row>
                    <Col md={6}>
                      <p className="mb-2">
                        <strong>ISBN:</strong> {livroSelecionado?.isbn || 'Não informado'}
                      </p>
                    </Col>
                    <Col md={6}>
                      <p className="mb-2">
                        <strong>Estoque:</strong>
                        <span className={`ms-2 fw-bold ${(livroSelecionado?.estoque || 0) > 0 ? 'text-success' : 'text-warning'}`}>
                          {livroSelecionado?.estoque || 0}
                        </span>
                      </p>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="paginacao" onClick={handleCloseDetalhesModal}>
              Fechar
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Paginação Melhorada */}
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
      </Card.Body>
    </Card>
  );
};

export default LivroList;