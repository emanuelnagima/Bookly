import { Container, Row, Col, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FaBook, FaUserTie, FaUserGraduate } from 'react-icons/fa'

const Cadastros = () => {
  return (
    <Container className="py-4">
      <h1 className="mb-4">Gerenciamento de Cadastros</h1>
      
      <Row className="gy-4">
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <FaBook size={48} className="mb-3 text-primary" />
              <Card.Title>Livros</Card.Title>
              <Link to="/livros" className="btn btn-primary">
                Gerenciar Livros
              </Link>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <FaUserTie size={48} className="mb-3 text-primary" />
              <Card.Title>Professores</Card.Title>
              <Link to="/professores" className="btn btn-primary">
                Gerenciar Professores
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <FaUserGraduate size={48} className="mb-3 text-primary" />
              <Card.Title>Alunos</Card.Title>
              <Link to="/alunos" className="btn btn-primary">
                Gerenciar Alunos
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Cadastros