import { Container, Card, Badge, Spinner } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

const EditoraDetalhe = () => {
  const { id } = useParams()
  const [editora, setEditora] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const carregarEditora = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/editoras/${id}`)
        if (!response.ok) throw new Error('Erro ao carregar editora')
        const data = await response.json()
        if (!data || !data.data) throw new Error('Editora não encontrada')
        setEditora(data.data)
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    carregarEditora()
  }, [id])

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
        <p>Carregando dados da editora...</p>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="py-4">
        <div className="alert alert-danger">{error}</div>
      </Container>
    )
  }

  if (!editora) {
    return (
      <Container className="py-4">
        <div className="alert alert-warning">Editora não encontrada</div>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <Card>
        <Card.Header className="bg-primary text-white">
          <h3 className="mb-0">
            {editora.nome} <Badge bg="light" text="dark">#{editora.id}</Badge>
          </h3>
        </Card.Header>
        <Card.Body>
          <p><strong>CNPJ:</strong> {editora.cnpj || 'Não informado'}</p>
          <p><strong>Endereço:</strong> {editora.endereco || 'Não informado'}</p>
          <p><strong>Telefone:</strong> {editora.telefone || 'Não informado'}</p>
          <p><strong>Email:</strong> {editora.email || 'Não informado'}</p>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default EditoraDetalhe
