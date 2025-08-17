import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaBook, FaUserTie, FaUserGraduate, FaPenFancy, FaBuilding, FaIdBadge } from 'react-icons/fa';

const Cadastros = () => {
  return (
    <Container className="py-4">
      <h1 className="mb-4">Gerenciamento de Cadastros</h1>
      
      <Row className="gy-4">
        {/* Livros */}
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <FaBook size={48} className="mb-3 text-primary" />
              <Card.Title>Livros</Card.Title>
              <Card.Text className="text-muted">
                Cadastre e gerencie todos os livros do acervo
              </Card.Text>
              <hr />
              <Link to="/livros" className="btn btn-primary mt-2">
                Gerenciar Livros
              </Link>
            </Card.Body>
          </Card>
        </Col>
        
        {/* Professores */}
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <FaUserTie size={48} className="mb-3 text-primary" />
              <Card.Title>Professores</Card.Title>
              <Card.Text className="text-muted">
                Cadastre e atualize informações de professores
              </Card.Text>
              <hr />
              <Link to="/professores" className="btn btn-primary mt-2">
                Gerenciar Professores
              </Link>
            </Card.Body>
          </Card>
        </Col>

        {/* Alunos */}
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <FaUserGraduate size={48} className="mb-3 text-primary" />
              <Card.Title>Alunos</Card.Title>
              <Card.Text className="text-muted">
                Cadastre e acompanhe os alunos da turma
              </Card.Text>
              <hr />
              <Link to="/alunos" className="btn btn-primary mt-2">
                Gerenciar Alunos
              </Link>
            </Card.Body>
          </Card>
        </Col>

        {/* Leitores */}
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <FaIdBadge size={48} className="mb-3 text-primary" />
              <Card.Title>Leitores</Card.Title>
              <Card.Text className="text-muted">
                Cadastre e gerencie usuários especiais
              </Card.Text>
              <hr />
              <Link to="/leitores" className="btn btn-primary mt-2">
                Gerenciar Leitores
              </Link>
            </Card.Body>
          </Card>
        </Col>

        {/* Autores */}
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <FaPenFancy size={48} className="mb-3 text-primary" />
              <Card.Title>Autores</Card.Title>
              <Card.Text className="text-muted">
                Cadastre e atualize informações sobre autores
              </Card.Text>
              <hr />
              <Link to="/autores" className="btn btn-primary mt-2">
                Gerenciar Autores
              </Link>
            </Card.Body>
          </Card>
        </Col>

        {/* Editoras */}
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <FaBuilding size={48} className="mb-3 text-primary" />
              <Card.Title>Editoras</Card.Title>
              <Card.Text className="text-muted">
                Cadastre e organize as editoras do acervo
              </Card.Text>
              <hr />
              <Link to="/editoras" className="btn btn-primary mt-2">
                Gerenciar Editoras
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cadastros;