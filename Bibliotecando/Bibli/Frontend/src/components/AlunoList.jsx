import { useState, useEffect } from 'react'
import { Card, Table, Form, InputGroup, Button } from 'react-bootstrap'
import { FaEdit, FaTrash, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const ITENS_POR_PAGINA = 10

const formatarNome = (nome) =>
  (nome || '')
    .toLowerCase()
    .split(' ')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ')

// Função para formatar data no padrão brasileiro
const formatarData = (data) => {
  if (!data) return '-'
  
  try {
    // Tenta converter para formato brasileiro
    const dataObj = new Date(data)
    if (isNaN(dataObj.getTime())) return data
    
    return dataObj.toLocaleDateString('pt-BR')
  } catch {
    return data
  }
}

// Função para formatar CPF
const formatarCPF = (cpf) => {
  if (!cpf) return '-'
  
  const cpfLimpo = cpf.toString().replace(/\D/g, '')
  
  if (cpfLimpo.length === 11) {
    return `${cpfLimpo.substring(0, 3)}.${cpfLimpo.substring(3, 6)}.${cpfLimpo.substring(6, 9)}-${cpfLimpo.substring(9)}`
  }
  
  return cpf
}

// Função para formatar telefone
const formatarTelefone = (telefone) => {
  if (!telefone) return '-'
  
  const numeros = telefone.toString().replace(/\D/g, '')
  
  if (numeros.length === 11) {
    return `(${numeros.substring(0, 2)}) ${numeros.substring(2, 7)}-${numeros.substring(7)}`
  } else if (numeros.length === 10) {
    return `(${numeros.substring(0, 2)}) ${numeros.substring(2, 6)}-${numeros.substring(6)}`
  } else if (numeros.length === 8) {
    return `${numeros.substring(0, 4)}-${numeros.substring(4)}`
  } else if (numeros.length === 9) {
    return `${numeros.substring(0, 5)}-${numeros.substring(5)}`
  }
  
  return telefone
}

const AlunoList = ({ alunos, onDelete, onEdit }) => {
  const [termoBusca, setTermoBusca] = useState('')
  const [paginaAtual, setPaginaAtual] = useState(1)

  useEffect(() => {
    setPaginaAtual(1)
  }, [termoBusca])

  // Filtra TODOS os alunos com base no termo de busca
  const alunosFiltrados = alunos.filter(aluno => {
    if (!termoBusca) return true

    const termo = termoBusca.toLowerCase()
    return (
      (aluno.nome || '').toLowerCase().includes(termo) ||
      (aluno.matricula || '').toString().includes(termo) ||
      (aluno.turma || '').toLowerCase().includes(termo) ||
      (aluno.email || '').toLowerCase().includes(termo) ||
      (aluno.data_nascimento || aluno.dataNascimento || '').toString().includes(termo) ||
      (aluno.cpf || '').toString().includes(termo) ||
      (aluno.telefone || '').toString().includes(termo)
    )
  })

  const totalPaginas = Math.ceil(alunosFiltrados.length / ITENS_POR_PAGINA)

  // Ordena os alunos filtrados
  const alunosOrdenados = [...alunosFiltrados].sort((a, b) =>
    formatarNome(a.nome).localeCompare(formatarNome(b.nome))
  )

  // Pegar apenas os itens da página atual
  const alunosPaginaAtual = alunosOrdenados.slice(
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
          <h5 className="mb-0">Alunos Cadastrados</h5>
          <span className="badge bg-light text-primary ms-3">
            {alunosFiltrados.length} {alunosFiltrados.length === 1 ? 'aluno' : 'alunos'} •
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
              placeholder="Buscar alunos..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
          </InputGroup>
        </div>
      </Card.Header>
      <Card.Body>
        {alunosPaginaAtual.length === 0 ? (
          <p className="text-muted text-center py-4">
            {termoBusca ? 'Nenhum aluno encontrado' : 'Nenhum aluno cadastrado'}
          </p>
        ) : (
          <>
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome Completo</th>
                  <th>Matrícula</th>
                  <th>Turma</th>
                  <th>E-mail</th>
                  <th>Data Nasc.</th>
                  <th>CPF</th>
                  <th>Telefone</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {alunosPaginaAtual.map(aluno => (
                  <tr key={aluno.id}>
                    <td>{aluno.id}</td>
                    <td>{formatarNome(aluno.nome)}</td>
                    <td>{aluno.matricula}</td>
                    <td>{aluno.turma}</td>
                    <td>{aluno.email}</td>
                    <td>{formatarData(aluno.data_nascimento || aluno.dataNascimento)}</td>
                    <td>{formatarCPF(aluno.cpf)}</td>
                    <td>{formatarTelefone(aluno.telefone)}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn-sm-custom btn-edit"
                          onClick={() => onEdit(aluno.id)}
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="btn-sm-custom btn-delete"
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

export default AlunoList