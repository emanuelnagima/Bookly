import { Container, Card, Badge } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import alunoService from '../services/alunoService';
import { useEffect, useState } from 'react'

const AlunoDetalhe = () => {
  const { id } = useParams()
  const [aluno, setAluno] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const carregarAluno = async () => {
      try {
        const data = await alunoService.getById(id)
        if (data) {
          setAluno(data)
        }
      } catch (error) {
        console.error('Erro ao carregar aluno:', error)
      } finally {
        setLoading(false)
      }
    }
    
    carregarAluno()
  }, [id])

  if (loading) {
    return (
      <Container className="py-4">
        <p>Carregando...</p>
      </Container>
    )
  }

  if (!aluno) {
    return (
      <Container className="py-4">
        <p>Aluno não encontrado</p>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <Card>
        <Card.Header className="bg-primary text-white">
          <h3>{aluno.nome} <Badge bg="secondary">#{aluno.id}</Badge></h3>
        </Card.Header>
        <Card.Body>
          <p><strong>Matrícula:</strong> {aluno.matricula}</p>
          <p><strong>CPF:</strong> {aluno.cpf}</p>
          <p><strong>Data de Nascimento:</strong> {aluno.data_nascimento}</p>
          <p><strong>E-mail:</strong> {aluno.email}</p>
          <p><strong>Telefone:</strong> {aluno.telefone || 'Não informado'}</p>
          <p><strong>Turma:</strong> <Badge bg="info">{aluno.turma}</Badge></p>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default AlunoDetalhe