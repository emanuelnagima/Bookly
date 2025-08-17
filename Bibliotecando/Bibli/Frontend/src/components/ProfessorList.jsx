import { useState, useEffect } from 'react'
import { Card, Table, Form, InputGroup, Button } from 'react-bootstrap'
import { FaEdit, FaTrash, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const ITENS_POR_PAGINA = 10

const formatarTexto = texto =>
  (texto || '')
    .toLowerCase()
    .split(' ')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ')

const ProfessorList = ({ professores, onDelete, onEdit }) => {
  const [termoBusca, setTermoBusca] = useState('')
  const [paginaAtual, setPaginaAtual] = useState(1)

  // Resetar página quando o termo de busca mudar
  useEffect(() => {
    setPaginaAtual(1)
  }, [termoBusca])

  const filtrarProfessores = () => {
    if (!termoBusca) return professores

    const termo = termoBusca.toLowerCase()
    return professores.filter(professor => {
      return (
        (professor.nome || '').toLowerCase().includes(termo) ||
        (professor.matricula || '').toString().includes(termo) ||
        (professor.departamento || '').toLowerCase().includes(termo) ||
        (professor.email || '').toLowerCase().includes(termo) ||
        (professor.telefone || '').toString().includes(termo)
      )
    })
  }

  const professoresFiltrados = filtrarProfessores()
  const totalPaginas = Math.ceil(professoresFiltrados.length / ITENS_POR_PAGINA)

  // Ordena os professores filtrados
  const professoresOrdenados = [...professoresFiltrados].sort((a, b) =>
    formatarTexto(a.nome).localeCompare(formatarTexto(b.nome))
  )

  // Pegar apenas os itens da página atual
  const professoresPaginaAtual = professoresOrdenados.slice(
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
          <h5 className="mb-0">Professores Cadastrados</h5>
          <span className="badge bg-light text-primary ms-3">
            {professoresFiltrados.length} {professoresFiltrados.length === 1 ? 'professor' : 'professores'} •
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
              placeholder="Buscar professores..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
          </InputGroup>
        </div>
      </Card.Header>
      <Card.Body>
        {professoresPaginaAtual.length === 0 ? (
          <p className="text-muted text-center py-4">
            {termoBusca ? 'Nenhum professor encontrado' : 'Nenhum professor cadastrado'}
          </p>
        ) : (
          <>
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Matrícula</th>
                  <th>Departamento</th>
                  <th>E-mail</th>
                  <th>Telefone</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {professoresPaginaAtual.map(professor => (
                  <tr key={professor.id}>
                    <td>{professor.id}</td>
                    <td>
                      <Link
                        to={`/professor/${professor.id}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        {formatarTexto(professor.nome)}
                      </Link>
                    </td>
                    <td>{professor.matricula}</td>
                    <td>{formatarTexto(professor.departamento)}</td>
                    <td>{professor.email}</td>
                    <td>{professor.telefone || '-'}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn-sm-custom btn-edit"
                          onClick={() => onEdit(professor.id)}
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="btn-sm-custom btn-delete"
                          onClick={() => onDelete(professor.id)}
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

export default ProfessorList