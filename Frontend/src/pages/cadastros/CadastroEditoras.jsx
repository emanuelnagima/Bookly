import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Form, Button, Card, Spinner } from 'react-bootstrap'

const CadastroEditoras = () => {
  const { id } = useParams()     
  const navigate = useNavigate()
  const [editora, setEditora] = useState({
    nome: '',
    cnpj: '',
    endereco: '',
    telefone: '',
    email: ''
  })
  const [loading, setLoading] = useState(false)

  const fetchEditora = async (id) => {
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:3000/api/editoras/${id}`)
      if (!res.ok) throw new Error('Erro ao buscar editora')
      const data = await res.json()
      setEditora(data)
    } catch (error) {
      console.error(error)
      alert('Não foi possível carregar os dados da editora.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchEditora(id)
    }
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditora(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const method = id ? 'PUT' : 'POST'
      const url = id ? `http://localhost:3000/api/editoras/${id}` : 'http://localhost:3000/api/editoras'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editora)
      })
      if (!res.ok) throw new Error('Erro ao salvar editora')
      navigate('/editoras')
    } catch (error) {
      console.error(error)
      alert('Não foi possível salvar a editora.')
    }
  }

  if (loading) return (
    <Container className="py-5 text-center">
      <Spinner animation="border" />
      <p>Carregando dados da editora...</p>
    </Container>
  )

  return (
    <Container className="py-4">
      <Card>
        <Card.Header>
          <h4>{id ? 'Editar Editora' : 'Cadastrar Nova Editora'}</h4>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nome da Editora</Form.Label>
              <Form.Control
                type="text"
                name="nome"
                value={editora.nome}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>CNPJ</Form.Label>
              <Form.Control
                type="text"
                name="cnpj"
                value={editora.cnpj}
                onChange={handleChange}
                placeholder="00.000.000/0000-00"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Endereço</Form.Label>
              <Form.Control
                type="text"
                name="endereco"
                value={editora.endereco}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Telefone</Form.Label>
              <Form.Control
                type="text"
                name="telefone"
                value={editora.telefone}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={editora.email}
                onChange={handleChange}
                placeholder="editora@exemplo.com"
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              {id ? 'Salvar Alterações' : 'Cadastrar'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default CadastroEditoras