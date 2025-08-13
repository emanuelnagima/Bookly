import { useState } from 'react'
import { Card, Table, Form, InputGroup } from 'react-bootstrap'
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const formatarNome = (nome) =>
  (nome || '')
    .toLowerCase()
    .split(' ')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ')

const AlunoList = ({ alunos, onDelete, onEdit }) => {
  const [termoBusca, setTermoBusca] = useState('')

  // Filtra os   alunos localmente
  const filtrarAlunos = () => {
    if (!termoBusca) return alunos

    const termo = termoBusca.toLowerCase()
    return alunos.filter(aluno => {
      return (
        (aluno.nome || '').toLowerCase().includes(termo) ||
        (aluno.matricula || '').toString().includes(termo) ||
        (aluno.turma || '').toLowerCase().includes(termo) ||
        (aluno.email || '').toLowerCase().includes(termo)
      )
    })
  }

  // Ordena os  alunos     filtrados
  const alunosOrdenados = [...filtrarAlunos()].sort((a, b) =>
    formatarNome(a.nome).localeCompare(formatarNome(b.nome))
  )

  return (
    <Card>
      <Card.Header className="bg-primary text-white">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Alunos Cadastrados</h5>
          <Form.Group className="mb-0" style={{ width: '300px' }}>
            <div className="input-group">
              <Form.Control
                type="text"
                placeholder="Buscar alunos..."
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
        {alunosOrdenados.length === 0 ? (
          <p className="text-muted">
            {termoBusca ? 'Nenhum aluno encontrado' : 'Nenhum aluno cadastrado'}
          </p>
        ) : (
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Matrícula</th>
                <th>Turma</th>
                <th>E-mail</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {alunosOrdenados.map(aluno => (
                <tr key={aluno.id}>
                  <td>{aluno.id}</td>
                  <td>
                    <Link
                      to={`/aluno/${aluno.id}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {formatarNome(aluno.nome)}
                    </Link>
                  </td>
                  <td>{aluno.matricula}</td>
                  <td>{aluno.turma}</td>
                  <td>{aluno.email}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => onEdit(aluno.id)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onDelete(aluno.id)}
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

export default AlunoList