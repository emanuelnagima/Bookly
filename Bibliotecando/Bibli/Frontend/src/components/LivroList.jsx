import { useState } from 'react'
import { Card, Table, Form, InputGroup } from 'react-bootstrap'
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const formatarTexto = texto =>
  (texto || '')
    .toLowerCase()
    .split(' ')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ')

const LivroList = ({ livros, onDelete, onEdit }) => {
  const [termoBusca, setTermoBusca] = useState('')

  const filtrarLivros = () => {
    if (!termoBusca) return livros

    const termo = termoBusca.toLowerCase()
    return livros.filter(livro => {
      return (
        (livro.titulo || livro.title || '').toLowerCase().includes(termo) ||
        (livro.autor || livro.author || '').toLowerCase().includes(termo) ||
        (livro.editora || livro.publisher || '').toLowerCase().includes(termo) ||
        (livro.isbn || '').toString().toLowerCase().includes(termo) ||
        (livro.genero || livro.genre || '').toLowerCase().includes(termo) ||
        (livro.ano_publicacao || livro.year || '').toString().includes(termo)
      )
    })
  }

  // Ordenar  os   livros filtrados alfabeticamente 
  const livrosOrdenados = [...filtrarLivros()].sort((a, b) =>
    formatarTexto(a.titulo || a.title || '').localeCompare(
      formatarTexto(b.titulo || b.title || '')
    )
  )

  return (
    <Card>
      <Card.Header className="bg-primary text-white">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Livros Cadastrados</h5>
          <div style={{ width: '300px' }}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Buscar livros..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
              />
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
            </InputGroup>
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        {livrosOrdenados.length === 0 ? (
          <p className="text-muted">
            {termoBusca ? 'Nenhum livro encontrado' : 'Nenhum livro cadastrado'}
          </p>
        ) : (
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Autor</th>
                <th>Editora</th>
                <th>ISBN</th>
                <th>Gênero</th>
                <th>Ano de Publicação</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {livrosOrdenados.map(livro => (
                <tr key={livro.id}>
                  <td>{livro.id}</td>
                  <td>
                    <Link
                      to={`/livro/${livro.id}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {formatarTexto(livro.titulo || livro.title || '')}
                    </Link>
                  </td>
                  <td>{formatarTexto(livro.autor || livro.author || '')}</td>
                  <td>{formatarTexto(livro.editora || livro.publisher || '')}</td>
                  <td>{livro.isbn || ''}</td>
                  <td>{formatarTexto(livro.genero || livro.genre || '')}</td>
                  <td>{livro.ano_publicacao || livro.year || ''}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => onEdit(livro.id)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
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
        )}
      </Card.Body>
    </Card>
  )
}

export default LivroList