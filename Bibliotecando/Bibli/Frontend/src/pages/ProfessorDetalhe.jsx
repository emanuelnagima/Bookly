import { Container, Card, Badge } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import professorService from '../services/professorService';
import { useEffect, useState } from 'react'

const ProfessorDetalhe = () => {
  const { id } = useParams()
  const [professor, setProfessor] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const carregarProfessor = async () => {
      try {
        const data = await professorService.getById(id)
        if (data) {
          setProfessor(data)
        }
      } catch (error) {
        console.error('Erro ao carregar professor:', error)
      } finally {
        setLoading(false)
      }
    }
    
    carregarProfessor()
  }, [id])

  if (loading) {
    return (
      <Container className="py-4">
        <p>Carregando...</p>
      </Container>
    )
  }

  if (!professor) {
    return (
      <Container className="py-4">
        <p>Professor não encontrado</p>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <Card>
        <Card.Header className="bg-primary text-white">
          <h3>{professor.nome} <Badge bg="secondary">#{professor.id}</Badge></h3>
        </Card.Header>
        <Card.Body>
          <p><strong>Matrícula:</strong> {professor.matricula}</p>
          <p><strong>Departamento:</strong> <Badge bg="info">{professor.departamento}</Badge></p>
          <p><strong>E-mail:</strong> {professor.email}</p>
          <p><strong>Telefone:</strong> {professor.telefone || 'Não informado'}</p>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default ProfessorDetalhe