import { Container, Card, Badge } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import livroService from '../services/livroService'
import { useEffect, useState } from 'react'

const LivroDetalhe = () => {
  const { id } = useParams()
  const [livro, setLivro] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const carregarLivros = async () => {
      const data = await livroService.getById(id)
      if (data) {
        setLivro(data)
      }
      setLoading(false)
    }
    
    carregarLivros()
  }, [id])

  if (loading) {
    return (
      <Container className="py-4">
        <p>Carregando...</p>
      </Container>
    )
  }

  if (!livro) {
    return (
      <Container className="py-4">
        <p>Livro não encontrado</p>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <Card>
        <Card.Header className="bg-primary text-white">
          <h3>{livro.titulo} <Badge bg="secondary">#{livro.id}</Badge></h3>
        </Card.Header>
        <Card.Body>
          <p><strong>Autor:</strong> {livro.autor}</p>
          <p><strong>Editora:</strong> {livro.editora}</p>
          <p><strong>ISBN:</strong> {livro.isbn}</p>
          <p><strong>Gênero:</strong> <Badge bg="info">{livro.genero}</Badge></p>
          <p><strong>Ano Publicação:</strong> {livro.ano_publicacao}</p>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default LivroDetalhe