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

const ProfessorList = ({ professores, onDelete, onEdit }) => {
  const [termoBusca, setTermoBusca] = useState('')

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

  // Ordena    os  professores filtrados
  const professoresOrdenados = [...filtrarProfessores()].sort((a, b) =>
    formatarTexto(a.nome).localeCompare(formatarTexto(b.nome))
  )

  return (
    <Card>
      <Card.Header className="bg-primary text-white">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Professores Cadastrados</h5>
          <Form.Group className="mb-0" style={{ width: '300px' }}>
            <div className="input-group">
              <Form.Control
                type="text"
                placeholder="Buscar professores..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
              />
              <span className="input-group-text">
                <FaSearch />
              </span>
            </div>
          </Form.Group>
        </div>
      </Card.Header>
      <Card.Body>
        {professoresOrdenados.length === 0 ? (
          <p className="text-muted">
            {termoBusca ? 'Nenhum professor encontrado' : 'Nenhum professor cadastrado'}
          </p>
        ) : (
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
              {professoresOrdenados.map(professor => (
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
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => onEdit(professor.id)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
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
        )}
      </Card.Body>
    </Card>
  )
}

export default ProfessorList