import { Container, Card, Badge } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

const EditoraDetalhe = () => {
  const { id } = useParams()
  const [editora, setEditora] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const carregarEditora = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/editoras/${id}`)
        if (!response.ok) throw new Error('Erro ao carregar editora')
        const data = await response.json()
        setEditora(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    
    carregarEditora()
  }, [id])

  if (loading) {
    return (
      <Container className="py-4">
        <p>Carregando...</p>
      </Container>
    )
  }

  if (!editora) {
    return (
      <Container className="py-4">
        <p>Editora não encontrada</p>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <Card>
        <Card.Header className="bg-primary text-white">
          <h3>{editora.nome} <Badge bg="secondary">#{editora.id}</Badge></h3>
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