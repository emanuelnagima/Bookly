import { useState, useEffect } from 'react';
import { Card, Form, InputGroup, Button, Image, Row, Col, Table } from 'react-bootstrap';
import { FaEdit, FaTrash, FaSearch, FaChevronLeft, FaChevronRight, FaImage, FaTh, FaList } from 'react-icons/fa';
import entradaSaidaService from '../services/entradaSaidaService';
import { FaBook } from "react-icons/fa";

const ITENS_POR_PAGINA = 12;

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
  const [visualizacao, setVisualizacao] = useState('cards');

  useEffect(() => setPaginaAtual(1), [termoBusca]);

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

  const livrosFiltrados = livrosComEstoque.filter((livro) => {
    const termo = termoBusca.toLowerCase();
    return (
      (livro.titulo || livro.title || '').toLowerCase().includes(termo) ||
      (livro.autor_nome || livro.author || '').toLowerCase().includes(termo) ||
      (livro.editora_nome || livro.publisher || '').toLowerCase().includes(termo) ||
      (livro.isbn || '').toString().toLowerCase().includes(termo) ||
      (livro.genero || livro.genre || '').toLowerCase().includes(termo) ||
      (livro.ano_publicacao || livro.year || '').toString().includes(termo)
    );
  });

  const totalPaginas = Math.ceil(livrosFiltrados.length / ITENS_POR_PAGINA);

  const livrosPaginaAtual = [...livrosFiltrados]
    .sort((a, b) => formatarTexto(a.titulo || a.title || '').localeCompare(formatarTexto(b.titulo || b.title || '')))
    .slice((paginaAtual - 1) * ITENS_POR_PAGINA, paginaAtual * ITENS_POR_PAGINA);

  // Renderização em Cards 
  const renderCards = () => (
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
                <div className="livrolist-sem-imagem d-flex justify-content-center align-items-center" style={{ height: '150px' }}>
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
  );

  const renderLista = () => (
    <div className="table-responsive">
      <Table striped hover className="mb-0">
        <thead className="table">
          <tr>
            <th width="80px" className="text-center">Capa</th>
            <th>Título</th>
            <th>ID</th>
            <th>ISBN</th>
            <th>Autor</th>
            <th>Editora</th>
            <th>Gênero</th>
            <th width="100px" className="text-center">Estoque</th>
            <th width="120px" className="text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {livrosPaginaAtual.map((livro) => (
            <tr key={livro.id} className="align-middle">
              <td className="text-center">
                {livro.imagem ? (
                  <Image
                    src={`http://localhost:3000${livro.imagem}`}
                    alt={livro.titulo || livro.title || ''}
                    className="livrolist-lista-livro-imagem mx-auto"
                    onError={e => { e.target.style.display = 'none' }}
                  />
                ) : (
                  <div className="d-flex justify-content-center align-items-center bg-light mx-auto"
                    style={{ width: '60px', height: '80px', borderRadius: '4px' }}>
                    <FaImage size={20} className="text-muted" />
                  </div>
                )}
              </td>
              <td className="align-middle">
                <div className="fw" title={livro.titulo || livro.title || ''}>
                  {formatarTexto(livro.titulo || livro.title || '')}
                </div>
              </td>
              <td className="align-middle">{livro.id}</td>
              <td className="align-middle">{livro.isbn || '-'}</td>
              <td className="align-middle">{formatarTexto(livro.autor_nome || livro.author || '')}</td>
              <td className="align-middle">{formatarTexto(livro.editora_nome || livro.publisher || '')}</td>
              <td className="align-middle">{formatarTexto(livro.genero || livro.genre || '')}</td>
              <td className="text-center align-middle">
                <span className={livro.estoque > 0 ? 'text' : 'text'}>
                  {livro.estoque || 0}
                </span>
              </td>
              <td className="text-center align-middle">
                <div className="d-flex gap-2 justify-content-center">
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
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );

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
          <h5 className="mb-0">Livros Cadastrados</h5>
        </div>

        <div className="d-flex align-items-center gap-3">
          <div className="btn-group" role="group">
            <Button
              className={visualizacao === 'cards' ? 'btn-outline' : 'btn-paginacao'}
              size="sm"
              onClick={() => setVisualizacao('cards')}
              title="Visualização em cards"
            >
              <FaTh className="me-1" />
              Cards
            </Button>
            <Button
              className={visualizacao === 'lista' ? 'btn-outline' : 'btn-paginacao'}
              size="sm"
              onClick={() => setVisualizacao('lista')}
              title="Visualização em lista"
            >
              <FaList className="me-1" />
              Lista
            </Button>
          </div>
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
          <p className="text-center text-muted">Carregando livros...</p>
        ) : livrosPaginaAtual.length === 0 ? (
          <p className="text-center text-muted">{termoBusca ? 'Nenhum livro encontrado' : 'Nenhum livro cadastrado'}</p>
        ) : visualizacao === 'cards' ? (
          renderCards()
        ) : (
          renderLista()
        )}

        {totalPaginas > 1 && (
          <div className="d-flex justify-content-center justify-content-md-end align-items-center mt-3 gap-2 flex-wrap">
            <Button
              className="btn-paginacao"
              onClick={() => setPaginaAtual(p => Math.max(p - 1, 1))}
              disabled={paginaAtual === 1}
            >
              <FaChevronLeft className="me-1" /> Anterior
            </Button>
            <Button
              className="btn-paginacao"
              onClick={() => setPaginaAtual(p => Math.min(p + 1, totalPaginas))}
              disabled={paginaAtual === totalPaginas}
            >
              Próxima <FaChevronRight className="ms-1" />
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default LivroList;