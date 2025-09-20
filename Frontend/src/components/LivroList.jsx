  import { useState, useEffect } from 'react';
  import { Card, Form, InputGroup, Button, Image, Row, Col } from 'react-bootstrap';
  import { FaEdit, FaTrash, FaSearch, FaChevronLeft, FaChevronRight, FaImage } from 'react-icons/fa';
  import entradaSaidaService from '../services/entradaSaidaService';

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

    useEffect(() => setPaginaAtual(1), [termoBusca]);

    // Carrega estoque de cada livro mantendo todas as classes e tamanhos
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

    return (
      <Card>
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center flex-wrap">
          <div className="d-flex align-items-center mb-2 mb-md-0">
            <h5 className="mb-0">Livros Cadastrados</h5>
            <span className="badge bg-light text-primary ms-3">
              {livrosComEstoque.length} {livrosComEstoque.length === 1 ? 'livro' : 'livros'} • Página {paginaAtual} de {totalPaginas || 1}
            </span>
          </div>
          <div style={{ minWidth: '250px', width: '100%', maxWidth: '300px' }}>
            <InputGroup>
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
        </Card.Header>

        <Card.Body>
          {loading ? (
            <p className="text-center text-muted">Carregando livros...</p>
          ) : livrosPaginaAtual.length === 0 ? (
            <p className="text-center text-muted">{termoBusca ? 'Nenhum livro encontrado' : 'Nenhum livro cadastrado'}</p>
          ) : (
            <Row>
              {livrosPaginaAtual.map((livro) => (
                <Col key={livro.id} md={6} lg={4} xl={3} className="mb-4">
                  <Card className="h-100 livro-card">
                    <div className="p-3 text-center">
                      {livro.imagem ? (
                        <Image
                          src={`http://localhost:3000${livro.imagem}`}
                          alt={livro.titulo || livro.title || ''}
                          className="livro-imagem"
                          onError={e => { e.target.style.display = 'none' }}
                        />
                      ) : (
                        <div className="sem-imagem d-flex justify-content-center align-items-center" style={{ height: '150px' }}>
                          <FaImage size={24} />
                        </div>
                      )}
                    </div>

                    <Card.Body className="livro-card-body d-flex flex-column">
                      <h6 title={livro.titulo || livro.title || ''}>
                        {formatarTexto(livro.titulo || livro.title || '')}
                      </h6>
                      <div className="livro-detalhes flex-grow-1">
                        <div><strong>Autor:</strong> {formatarTexto(livro.autor_nome || livro.author || '')}</div>
                        <div><strong>Editora:</strong> {formatarTexto(livro.editora_nome || livro.publisher || '')}</div>
                        <div><strong>Gênero:</strong> {formatarTexto(livro.genero || livro.genre || '')}</div>
                        {livro.isbn && <div><strong>ISBN:</strong> {livro.isbn}</div>}
                        <div><strong>Ano:</strong> {livro.ano_publicacao || livro.year || ''}</div>
                        <div><strong>Estoque:</strong> {livro.estoque || 0}</div>
                      </div>

                      <div className="d-flex gap-2 mt-2">
                        <button
                          className="btn-sm-custom btn-edit d-flex align-items-center justify-content-center"
                          onClick={() => onEdit(livro.id)}
                          title="Editar livro"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn-sm-custom btn-delete d-flex align-items-center justify-content-center"
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
