import { Container, Card, Badge } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import autorService from '../services/autorService'
import { useEffect, useState } from 'react'

const formatDate = (isoDate) => {
  if (!isoDate) return 'Data desconhecida'
  const options = { day: 'numeric', month: 'long', year: 'numeric' }
  return new Date(isoDate).toLocaleDateString('pt-BR', options)
}

const AutorDetalhe = () => {
  const { id } = useParams()
  const [autor, setAutor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const carregarAutor = async () => {
      try {
        const data = await autorService.getById(id)
        setAutor(data)
      } catch (error) {
        console.error('Erro ao carregar autor:', error)
        setError('Não foi possível carregar os dados do autor.')
      } finally {
        setLoading(false)
      }
    }
    
    carregarAutor()
  }, [id])

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
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

  if (!autor) {
    return (
      <Container className="py-4">
        <div className="alert alert-warning">Autor não encontrado</div>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <Card>
        <Card.Header className="bg-primary text-white">
          <h3 className="mb-0">
            {autor.nome} <Badge bg="light" text="dark">#{autor.id}</Badge>
          </h3>
        </Card.Header>
        <Card.Body>
          <Card.Text>
            <strong>Nacionalidade:</strong> {autor.nacionalidade || 'Não informada'}
          </Card.Text>
          <Card.Text>
            <strong>Data de Nascimento:</strong> {formatDate(autor.data_nascimento)}
          </Card.Text>
          {autor.biografia && (
            <div className="mt-4">
              <h5>Biografia</h5>
              <p className="text-muted">{autor.biografia}</p>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  )
}

export default AutorDetalhe