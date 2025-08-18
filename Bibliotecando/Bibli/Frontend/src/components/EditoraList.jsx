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

const EditoraList = ({ editoras, onDelete, onEdit }) => {
  const [termoBusca, setTermoBusca] = useState('')
  const [paginaAtual, setPaginaAtual] = useState(1)

  useEffect(() => {
    setPaginaAtual(1)
  }, [termoBusca])

  const editorasFiltradas = editoras.filter(editora => {
    if (!termoBusca) return true

    const termo = termoBusca.toLowerCase()
    return (
      (editora.nome || '').toLowerCase().includes(termo) ||
      (editora.cnpj || '').toString().toLowerCase().includes(termo) ||
      (editora.endereco || '').toLowerCase().includes(termo) ||
      (editora.telefone || '').toString().toLowerCase().includes(termo) ||
      (editora.email || '').toLowerCase().includes(termo))
  })

  const totalPaginas = Math.ceil(editorasFiltradas.length / ITENS_POR_PAGINA)

  const editorasOrdenadas = [...editorasFiltradas].sort((a, b) =>
    formatarTexto(a.nome || '').localeCompare(formatarTexto(b.nome || ''))
  )

  const editorasPaginaAtual = editorasOrdenadas.slice(
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
          <h5 className="mb-0">Editoras Cadastradas</h5>
          <span className="badge bg-light text-primary ms-3">
            {editorasFiltradas.length} {editorasFiltradas.length === 1 ? 'editora' : 'editoras'} •
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
              placeholder="Buscar editoras..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
          </InputGroup>
        </div>
      </Card.Header>
      <Card.Body>
        {editorasPaginaAtual.length === 0 ? (
          <p className="text-muted text-center py-4">
            {termoBusca ? 'Nenhuma editora encontrada' : 'Nenhuma editora cadastrada'}
          </p>
        ) : (
          <>
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>CNPJ</th>
                  <th>Telefone</th>
                  <th>Email</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {editorasPaginaAtual.map(editora => (
                  <tr key={editora.id}>
                    <td>{editora.id}</td>
                    <td>
                      <Link
                        to={`/editora/${editora.id}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        {formatarTexto(editora.nome || '')}
                      </Link>
                    </td>
                    <td>{editora.cnpj || '-'}</td>
                    <td>{editora.telefone || '-'}</td>
                    <td>{editora.email || '-'}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn-sm-custom btn-edit"
                          onClick={() => onEdit(editora.id)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn-sm-custom btn-delete"
                          onClick={() => onDelete(editora.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

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

export default EditoraList