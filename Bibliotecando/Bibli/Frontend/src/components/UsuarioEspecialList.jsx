import { useState, useEffect } from 'react'
import { Card, Table, Form, InputGroup, Button } from 'react-bootstrap'
import { FaEdit, FaTrash, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const ITENS_POR_PAGINA = 10

const formatarNome = (nome) =>
  (nome || '')
    .toLowerCase()
    .split(' ')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ')

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
  }
  return telefone
}

const UsuarioEspecialList = ({ usuarios, onDelete, onEdit }) => {
  const [termoBusca, setTermoBusca] = useState('')
  const [paginaAtual, setPaginaAtual] = useState(1)

  useEffect(() => {
    setPaginaAtual(1)
  }, [termoBusca])

  // Filtra usuários pelo termo de busca
  const usuariosFiltrados = usuarios.filter(usuario => {
    if (!termoBusca) return true
    const termo = termoBusca.toLowerCase()
    return (
      (usuario.nome_completo || '').toLowerCase().includes(termo) ||
      (usuario.email || '').toLowerCase().includes(termo) ||
      (usuario.tipo_usuario || '').toLowerCase().includes(termo) ||
      (usuario.cpf || '').toString().includes(termo) ||
      (usuario.telefone || '').toString().includes(termo)
    )
  })

  const totalPaginas = Math.ceil(usuariosFiltrados.length / ITENS_POR_PAGINA)

  // Ordena os usuários alfabeticamente
  const usuariosOrdenados = [...usuariosFiltrados].sort((a, b) =>
    formatarNome(a.nome_completo).localeCompare(formatarNome(b.nome_completo))
  )

  // Pega apenas os itens da página atual
  const usuariosPaginaAtual = usuariosOrdenados.slice(
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
          <h5 className="mb-0">Usuários Especiais Cadastrados</h5>
          <span className="badge bg-light text-primary ms-3">
            {usuariosFiltrados.length} {usuariosFiltrados.length === 1 ? 'usuário' : 'usuários'} •
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
              placeholder="Buscar usuários..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
          </InputGroup>
        </div>
      </Card.Header>

      <Card.Body>
        {usuariosPaginaAtual.length === 0 ? (
          <p className="text-muted text-center py-4">
            {termoBusca ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado'}
          </p>
        ) : (
          <>
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome Completo</th>
                  <th>E-mail</th>
                  <th>CPF</th>
                  <th>Telefone</th>
                  <th>Tipo de Usuário</th>
                  <th className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuariosPaginaAtual.map(usuario => (
                  <tr key={usuario.id}>
                    <td>{usuario.id}</td>
                    <td>{formatarNome(usuario.nome_completo)}</td>
                    <td>{usuario.email}</td>
                    <td>{formatarCPF(usuario.cpf)}</td>
                    <td>{formatarTelefone(usuario.telefone)}</td>
                    <td>{usuario.tipo_usuario}</td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn-sm-custom btn-edit"
                          onClick={() => onEdit(usuario.id)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn-sm-custom btn-delete"
                          onClick={() => onDelete(usuario.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Paginação */}
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

export default UsuarioEspecialList
