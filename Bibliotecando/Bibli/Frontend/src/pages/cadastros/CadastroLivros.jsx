import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Form, Button, Card, Spinner } from 'react-bootstrap'

const CadastroLivro = () => {
  const { id } = useParams()     
  const navigate = useNavigate()
  const [livro, setLivro] = useState({
    titulo: '',
    autor: '',
    editora: '',
    isbn: '',
    genero: '',
    ano_publicacao: ''
  })
  const [loading, setLoading] = useState(false)

  // Função para buscar o livro pelo id
  const fetchLivro = async (id) => {
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:3000/livros/${id}`)
      if (!res.ok) throw new Error('Erro ao buscar livro')
      const data = await res.json()
      setLivro(data)
    } catch (error) {
      console.error(error)
      alert('Não foi possível carregar os dados do livro.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchLivro(id)
    }
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setLivro(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const method = id ? 'PUT' : 'POST'
      const url = id ? `http://localhost:3000/livros/${id}` : 'http://localhost:3000/livros'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(livro)
      })
      if (!res.ok) throw new Error('Erro ao salvar livro')
      navigate('/') // volta para home depois de salvar
    } catch (error) {
      console.error(error)
      alert('Não foi possível salvar o livro.')
    }
  }

  if (loading) return (
    <Container className="py-5 text-center">
      <Spinner animation="border" />
      <p>Carregando dados do livro...</p>
    </Container>
  )

  return (
    <Container className="py-4">
      <Card>
        <Card.Header>
          <h4>{id ? 'Editar Livro' : 'Cadastrar Novo Livro'}</h4>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                name="titulo"
                value={livro.titulo}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Autor</Form.Label>
              <Form.Control
                type="text"
                name="autor"
                value={livro.autor}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Editora</Form.Label>
              <Form.Control
                type="text"
                name="editora"
                value={livro.editora}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>ISBN</Form.Label>
              <Form.Control
                type="text"
                name="isbn"
                value={livro.isbn}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Gênero</Form.Label>
              <Form.Control
                type="text"
                name="genero"
                value={livro.genero}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ano de Publicação</Form.Label>
              <Form.Control
                type="number"
                name="ano_publicacao"
                value={livro.ano_publicacao}
                onChange={handleChange}
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

export default CadastroLivro
