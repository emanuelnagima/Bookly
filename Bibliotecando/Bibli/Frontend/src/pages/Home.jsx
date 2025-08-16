import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaReply,
  FaChartBar,
  FaCalendarAlt,
  FaSyncAlt,
  FaDoorOpen,
  FaSignOutAlt,
  FaHandshake,
  FaEnvelope,
  FaBook,
  FaUserTie,
  FaSearch,
  FaUserGraduate,
  FaUserEdit
} from "react-icons/fa";

const Home = () => {
  // Estado para armazenar a data formatada (fica visível sempre)
  const [currentDate, setCurrentDate] = useState("");

  // Estado para controlar se a mensagem "Seja bem-vindo!" aparece (some após 10s)
  const [showWelcome, setShowWelcome] = useState(true);

  // Efeito para formatar a data e definir o timer da mensagem de boas-vindas
  useEffect(() => {
    // Formata a data em PT-BR (ex: "quarta-feira, 14 de agosto de 2024")
    const options = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    setCurrentDate(new Date().toLocaleDateString('pt-BR', options));

    // Configura um timer para esconder "Seja bem-vindo!" após 10 segundos
    const welcomeTimer = setTimeout(() => {
      setShowWelcome(false);
    }, 10000);

    // Limpa o timer quando o componente é desmontado 
    return () => clearTimeout(welcomeTimer);
  }, []);

  // Função para o botão de ajuda (flutuante)
  const handleHelpClick = () => {
    alert("Precisa de ajuda? Fale com nosso suporte: suportebibli@gmail.com");
  };

  return (
    <Container className="py-4">
      {/* ===== CABEÇALHO (DATA + MENSAGEM DE BOAS-VINDAS) ===== */}
      <Row className="mb-3 animate__animated animate__fadeIn">
        <Col>
          {/* Exibe "Seja bem-vindo!" apenas se `showWelcome` for true */}
          {showWelcome && (
            <h5 className="mb-1 fw-bold">Seja bem-vindo!</h5>
          )}
          
          {/* Data SEMPRE visível (não depende do estado `showWelcome`) */}
          <p className="text-muted small mb-0">
            <FaCalendarAlt className="me-2" />
            {currentDate}
          </p>
        </Col>
      </Row>

      {/* ===== TÍTULO + BARRA DE PESQUISA ===== */}
      <Row className="mb-5 text-center">
        <Col>
          <div className="title-wrapper d-flex align-items-center justify-content-center mb-0">
            <h1 className="display-4 fw-bold text-primary">BiBli</h1>
          </div>
          <p className="lead text-muted mb-2">
            Sua plataforma de gestão bibliotecária
          </p>

          {/* Barra de pesquisa centralizada */}
          <div className="mt-1 mx-auto" style={{ maxWidth: "750px" }}>
            <InputGroup className="shadow-sm">
              <InputGroup.Text className="bg-primary text-white border-0">
                <FaSearch size={18} className="header-icon me-0" />
              </InputGroup.Text>
              <Form.Control
                type="search"
                placeholder="Pesquise por livros, autores, editoras..."
                className="py-2 border-0"
              />
              <button className="btn btn-primary border-0">Buscar</button>
            </InputGroup>
          </div>
        </Col>
      </Row>

      {/* ===== CARDS DE FUNCIONALIDADES ===== */}
      <Row className="g-3">
        {/* Card: Livros */}
        <Col md={6} lg={4} xl={3}>
          <Card className="h-100 text-center">
            <Card.Body>
              <FaBook size={48} className="mb-3 text-primary" />
              <Card.Title>Livros</Card.Title>
              <Card.Text className="text-muted">
                Explore o catálogo completo e gerencie o cadastro de livros
                <hr />
              </Card.Text>
              <Link to="/livros" className="btn btn-primary mt-3">
                Acessar Livros
              </Link>
            </Card.Body>
          </Card>
        </Col>

        {/* Card: Professores */}
        <Col md={6} lg={4} xl={3}>
          <Card className="h-100 text-center">
            <Card.Body>
              <FaUserTie size={48} className="mb-3 text-primary" />
              <Card.Title>Professores</Card.Title>
              <Card.Text className="text-muted">
                Gerencie o cadastro de professores
                <hr />
              </Card.Text>
              <Link to="/professores" className="btn btn-primary mt-3">
                Acessar Professores
              </Link>
            </Card.Body>
          </Card>
        </Col>

        {/* Card: Alunos */}
        <Col md={6} lg={4} xl={3}>
          <Card className="h-100 text-center">
            <Card.Body>
              <FaUserGraduate size={48} className="mb-3 text-primary" />
              <Card.Title>Alunos</Card.Title>
              <Card.Text className="text-muted">
                Gerencie o cadastro de alunos da turma
                <hr />
              </Card.Text>
              <Link to="/alunos" className="btn btn-primary mt-3">
                Acessar Alunos
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4} xl={3}>
          <Card className="h-100 text-center">
            <Card.Body>
              <FaUserEdit size={48} className="mb-3 text-primary" />
              <Card.Title>Autores</Card.Title>
              <Card.Text className="text-muted">
                Gerencie o cadastro de autores dos livros
                <hr />
              </Card.Text>
              <Link to="/autores" className="btn btn-primary mt-3">
                Acessar Autores
              </Link>
            </Card.Body>
          </Card>
        </Col>

        {/* Card: Entrada de Livros */}
        <Col md={6} lg={4} xl={3}>
          <Card className="h-100 text-center">
            <Card.Body>
              <FaDoorOpen size={48} className="mb-3 text-primary" />
              <Card.Title>Entrada</Card.Title>
              <Card.Text className="text-muted">
                Registre a entrada de novos livros no acervo
                <hr />
              </Card.Text>
              <Link to="/entrada" className="btn btn-primary mt-3">
                Registrar Entrada
              </Link>
            </Card.Body>
          </Card>
        </Col>

        {/* Card: Saída de Livros */}
        <Col md={6} lg={4} xl={3}>
          <Card className="h-100 text-center">
            <Card.Body>
              <FaSignOutAlt size={48} className="mb-3 text-primary" />
              <Card.Title>Saída</Card.Title>
              <Card.Text className="text-muted">
                Registre a saída de livros do acervo
                <hr />
              </Card.Text>
              <Link to="/saida" className="btn btn-primary mt-3">
                Registrar Saída
              </Link>
            </Card.Body>
          </Card>
        </Col>

        {/* Card: Reservas */}
        <Col md={6} lg={4} xl={3}>
          <Card className="h-100 text-center">
            <Card.Body>
              <FaCalendarAlt size={48} className="mb-3 text-primary" />
              <Card.Title>Reservas</Card.Title>
              <Card.Text className="text-muted">
                Controle as reservas de livros pelos usuários
                <hr />
              </Card.Text>
              <Link to="/reservas" className="btn btn-primary mt-3">
                Acessar Reservas
              </Link>
            </Card.Body>
          </Card>
        </Col>

        {/* Card: Empréstimos */}
        <Col md={6} lg={4} xl={3}>
          <Card className="h-100 text-center">
            <Card.Body>
              <FaHandshake size={48} className="mb-3 text-primary" />
              <Card.Title>Empréstimos</Card.Title>
              <Card.Text className="text-muted">
                Controle os empréstimos de livros do sistema
                <hr />
              </Card.Text>
              <Link to="/emprestimos" className="btn btn-primary mt-3">
                Acessar Empréstimos
              </Link>
            </Card.Body>
          </Card>
        </Col>

        {/* Card: Renovações */}
        <Col md={6} lg={4} xl={3}>
          <Card className="h-100 text-center">
            <Card.Body>
              <FaSyncAlt size={48} className="mb-3 text-primary" />
              <Card.Title>Renovações</Card.Title>
              <Card.Text className="text-muted">
                Gerencie as renovações de empréstimos de livros
                <hr />
              </Card.Text>
              <Link to="/renovacoes" className="btn btn-primary mt-3">
                Acessar Renovações
              </Link>
            </Card.Body>
          </Card>
        </Col>

        {/* Card: Devoluções */}
        <Col md={6} lg={4} xl={3}>
          <Card className="h-100 text-center">
            <Card.Body>
              <FaReply size={48} className="mb-3 text-primary" />
              <Card.Title>Devoluções</Card.Title>
              <Card.Text className="text-muted">
                Registre e acompanhe as devoluções de livros
                <hr />
              </Card.Text>
              <Link to="/devolucoes" className="btn btn-primary mt-3">
                Acessar Devoluções
              </Link>
            </Card.Body>
          </Card>
        </Col>

        {/* Card: Relatórios */}
        <Col md={6} lg={4} xl={3}>
          <Card className="h-100 text-center">
            <Card.Body>
              <FaChartBar size={48} className="mb-3 text-primary" />
              <Card.Title>Relatórios</Card.Title>
              <Card.Text className="text-muted">
                Acesse relatórios e estatísticas do sistema
                <hr />
              </Card.Text>
              <Link to="/relatorios" className="btn btn-primary mt-3">
                Ver Relatórios
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ===== BOTÃO FLUTUANTE DE AJUDA ===== */}
      <button
        className="help-button"
        onClick={handleHelpClick}
        aria-label="Botão de ajuda"
        title="Ajuda"
      >
        <FaEnvelope size={24} />
      </button>
    </Container>
  );
};

export default Home;