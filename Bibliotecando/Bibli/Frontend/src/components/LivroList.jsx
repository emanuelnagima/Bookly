import { useState, useEffect } from 'react'
import { Card, Form, InputGroup, Button, Image, Row, Col } from 'react-bootstrap'
import { FaEdit, FaTrash, FaSearch, FaChevronLeft, FaChevronRight, FaImage } from 'react-icons/fa'

const ITENS_POR_PAGINA = 12

const formatarTexto = (texto = '') =>
  texto
    .toLowerCase()
    .split(' ')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ')

const LivroList = ({ livros, onDelete, onEdit }) => {
  const [termoBusca, setTermoBusca] = useState('')
  const [paginaAtual, setPaginaAtual] = useState(1)

  useEffect(() => setPaginaAtual(1), [termoBusca])

  // Filtra livros com base no termo de busca
  const livrosFiltrados = livros.filter(livro => {
    const termo = termoBusca.toLowerCase()
    return (
      (livro.titulo || livro.title || '').toLowerCase().includes(termo) ||
      (livro.autor || livro.author || '').toLowerCase().includes(termo) ||
      (livro.editora || livro.publisher || '').toLowerCase().includes(termo) ||
      (livro.isbn || '').toString().toLowerCase().includes(termo) ||
      (livro.genero || livro.genre || '').toLowerCase().includes(termo) ||
      (livro.ano_publicacao || livro.year || '').toString().includes(termo)
    )
  })

  const totalPaginas = Math.ceil(livrosFiltrados.length / ITENS_POR_PAGINA)

  // Ordena alfabeticamente pelo título
  const livrosOrdenados = [...livrosFiltrados].sort((a, b) =>
    formatarTexto(a.titulo || a.title || '').localeCompare(formatarTexto(b.titulo || b.title || ''))
  )

  // Pega apenas os livros da página atual
  const livrosPaginaAtual = livrosOrdenados.slice(
    (paginaAtual - 1) * ITENS_POR_PAGINA,
    paginaAtual * ITENS_POR_PAGINA
  )

  return (
    <Card>
      <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center flex-wrap">
        <div className="d-flex align-items-center mb-2 mb-md-0">
          <h5 className="mb-0">Livros Cadastrados</h5>
          <span className="badge bg-light text-primary ms-3">
            {livrosFiltrados.length} {livrosFiltrados.length === 1 ? 'livro' : 'livros'} •
            Página {paginaAtual} de {totalPaginas || 1}
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
        {livrosPaginaAtual.length === 0 ? (
          <p className="text-muted text-center py-4">
            {termoBusca ? 'Nenhum livro encontrado' : 'Nenhum livro cadastrado'}
          </p>
        ) : (
          <>
            <Row>
              {livrosPaginaAtual.map((livro) => (
                <Col key={livro.id} md={6} lg={4} xl={3} className="mb-4">
                  <Card className="livro-card h-100">
                    <div className="p-3 text-center">
                      {livro.imagem ? (
                        <Image
                          src={`http://localhost:3000${livro.imagem}`}
                          alt={livro.titulo || livro.title || ''}
                          className="livro-imagem"
                          onError={(e) => { e.target.style.display = 'none' }}
                        />
                      ) : (
                        <div className="sem-imagem">
                          <FaImage size={24} />
                        </div>
                      )}
                    </div>

                    <Card.Body className="livro-info">
                      <h6 className="livro-titulo" title={livro.titulo || livro.title || livro.nome || ''}>
                        {formatarTexto(livro.titulo || livro.title || livro.nome || '')}
                      </h6>

                      <div className="livro-detalhes">
                        <div className="detalhes-linha">
                          <div>Autor:</div>
                          <div title={livro.autor || livro.author || ''}>
                            {formatarTexto(livro.autor || livro.author || '')}
                          </div>
                        </div>
                        <div className="detalhes-linha">
                          <div>Editora:</div>
                          <div title={livro.editora || livro.publisher || ''}>
                            {formatarTexto(livro.editora || livro.publisher || '')}
                          </div>
                        </div>
                        <div className="detalhes-linha">
                          <div>Gênero:</div>
                          <div title={livro.genero || livro.genre || ''}>
                            {formatarTexto(livro.genero || livro.genre || '')}
                          </div>
                        </div>
                        {livro.isbn && (
                          <div className="detalhes-linha">
                            <div>ISBN:</div>
                            <div title={livro.isbn}>{livro.isbn}</div>
                          </div>
                        )}
                        <div className="detalhes-linha">
                          <div>Ano:</div>
                          <div>{livro.ano_publicacao || livro.year || ''}</div>
                        </div>
                      </div>

                      <div className="livro-actions">
                        <div className="d-flex gap-2">
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
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {totalPaginas > 1 && (
              <div className="d-flex justify-content-center justify-content-md-end align-items-center mt-3 gap-2 flex-wrap">
                <Button
                  className="btn-paginacao"
                  onClick={() => setPaginaAtual((p) => Math.max(p - 1, 1))}
                  disabled={paginaAtual === 1}
                >
                  <FaChevronLeft className="me-1" /> Anterior
                </Button>
                <Button
                  className="btn-paginacao"
                  onClick={() => setPaginaAtual((p) => Math.min(p + 1, totalPaginas))}
                  disabled={paginaAtual === totalPaginas}
                >
                  Próxima <FaChevronRight className="ms-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  )
}

export default LivroList
