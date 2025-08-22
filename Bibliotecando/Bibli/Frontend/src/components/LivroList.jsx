import { useState, useEffect } from 'react'
import { Card, Table, Form, InputGroup, Button } from 'react-bootstrap'
import { FaEdit, FaTrash, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const ITENS_POR_PAGINA = 12

const formatarTexto = texto =>
  (texto || '')
    .toLowerCase()
    .split(' ')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ')

// Estilos CSS inline para centralizar a coluna
const styles = `
  .ano-publicacao {
    text-align: center !important;
  }
`

const LivroList = ({ livros, onDelete, onEdit }) => {
  const [termoBusca, setTermoBusca] = useState('')
  const [paginaAtual, setPaginaAtual] = useState(1)

  useEffect(() => {
    setPaginaAtual(1)
  }, [termoBusca])

  // Adicionar estilo ao documento
  useEffect(() => {
    const styleSheet = document.createElement('style')
    styleSheet.innerText = styles
    document.head.appendChild(styleSheet)
    
    return () => {
      document.head.removeChild(styleSheet)
    }
  }, [])

  // Filtra TODOS os livros com base no termo de busca
  const livrosFiltrados = livros.filter(livro => {
    if (!termoBusca) return true

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

  // Ordenar os livros filtrados alfabeticamente 
  const livrosOrdenados = [...livrosFiltrados].sort((a, b) =>
    formatarTexto(a.titulo || a.title || '').localeCompare(
      formatarTexto(b.titulo || b.title || '')
    )
  )

  // Pegar apenas os itens da página atual
  const livrosPaginaAtual = livrosOrdenados.slice(
    (paginaAtual - 1) * ITENS_POR_PAGINA,
    paginaAtual * ITENS_POR_PAGINA
  )

  const handlePaginaAnterior = () => {
    if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1)
  }

  const handleProximaPagina = () => {
    if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1)
  }

  return (
    <Card>
      <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <h5 className="mb-0">Livros Cadastrados</h5>
          <span className="badge bg-light text-primary ms-3">
            {livrosFiltrados.length} {livrosFiltrados.length === 1 ? 'livro' : 'livros'} •
            Página {paginaAtual} de {totalPaginas || 1}
          </span>
        </div>
        <div style={{ width: '300px' }}>
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
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>Autor</th>
                  <th>Editora</th>
                  <th>ISBN</th>
                  <th>Gênero</th>
                  <th className="ano-publicacao">Ano de Publicação</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {livrosPaginaAtual.map(livro => (
                  <tr key={livro.id}>
                    <td>{livro.id}</td>
                    <td>{formatarTexto(livro.titulo || livro.title || livro.nome || '')}</td>
                    <td>{formatarTexto(livro.autor || livro.author || '')}</td>
                    <td>{formatarTexto(livro.editora || livro.publisher || '')}</td>
                    <td>{livro.isbn || ''}</td>
                    <td>{formatarTexto(livro.genero || livro.genre || '')}</td>
                    <td className="ano-publicacao">{livro.ano_publicacao || livro.year || ''}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn-sm-custom btn-edit"
                          onClick={() => onEdit(livro.id)}
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="btn-sm-custom btn-delete"
                          onClick={() => onDelete(livro.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* PAGINAÇÃO COM CLASSES btn-paginacao */}
            {totalPaginas > 1 && (
              <div className="d-flex justify-content-end align-items-center mt-3 gap-2">
                <Button
                  className="btn-paginacao"
                  onClick={handlePaginaAnterior}
                  disabled={paginaAtual === 1}
                >
                  <FaChevronLeft className="me-1" />
                  Anterior
                </Button>
                <Button
                  className="btn-paginacao"
                  onClick={handleProximaPagina}
                  disabled={paginaAtual === totalPaginas}
                >
                  Próxima
                  <FaChevronRight className="ms-1" />
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