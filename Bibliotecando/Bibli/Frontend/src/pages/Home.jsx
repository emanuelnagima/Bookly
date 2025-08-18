import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  InputGroup,
  Table,
  Button,
  Modal
} from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaCalendarAlt,
  FaEnvelope,
  FaBook,
  FaUserTie,
  FaUserGraduate,
  FaPenFancy,
  FaBuilding,
  FaDoorOpen,
  FaSignOutAlt,
  FaHandshake,
  FaSyncAlt,
  FaReply,
  FaChartBar,
  FaSearch,
  FaIdBadge,
  FaChevronLeft,
  FaChevronRight,
  FaInfoCircle,
  FaBriefcase
} from "react-icons/fa";

import livroService from "../services/livroService";

const formatarTexto = texto =>
  (texto || '')
    .toLowerCase()
    .split(' ')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');

const ITENS_POR_PAGINA = 7;

const Home = () => {
  const [currentDate, setCurrentDate] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [livros, setLivros] = useState([]);
  const [termoBusca, setTermoBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);

  useEffect(() => {
    const options = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
    setCurrentDate(new Date().toLocaleDateString("pt-BR", options));

    const welcomeTimer = setTimeout(() => setShowWelcome(false), 10000);
    return () => clearTimeout(welcomeTimer);
  }, []);

  useEffect(() => {
    const fetchLivros = async () => {
      try {
        const data = await livroService.getAll();
        setLivros(data);
      } catch (error) {
        console.error("Erro ao carregar livros:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLivros();
  }, []);

  // Resetar página quando o termo de busca mudar
  useEffect(() => {
    setPaginaAtual(1);
  }, [termoBusca]);

  const livrosFiltrados = livros.filter(l =>
    (l.titulo || "").toLowerCase().includes(termoBusca.toLowerCase()) ||
    (l.autor || "").toLowerCase().includes(termoBusca.toLowerCase()) ||
    (l.editora || "").toLowerCase().includes(termoBusca.toLowerCase()) ||
    (l.isbn || "").toLowerCase().includes(termoBusca.toLowerCase()) ||
    (l.genero || "").toLowerCase().includes(termoBusca.toLowerCase()) ||
    (l.ano_publicacao || "").toString().includes(termoBusca)
  );

  const totalPaginas = Math.ceil(livrosFiltrados.length / ITENS_POR_PAGINA);

  const livrosExibidos = livrosFiltrados
    .sort((a, b) => (a.titulo || "").localeCompare(b.titulo || ""))
    .slice(
      (paginaAtual - 1) * ITENS_POR_PAGINA,
      paginaAtual * ITENS_POR_PAGINA
    );

  const handlePaginaAnterior = () => {
    if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1);
  };

  const handleProximaPagina = () => {
    if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1);
  };

  const handleHelpClick = () => {
    setIsButtonActive(true);
    setTimeout(() => setIsButtonActive(false), 200);
    setShowHelpModal(true);
  };

  const handleCloseHelpModal = () => {
    setShowHelpModal(false);
  };

  return (
    <Container className="py-4">
      {/* CABEÇALHO */}
      <Row className="mb-3 animate__animated animate__fadeIn">
        <Col>
          {showWelcome && <h5 className="mb-1 fw-bold">Seja bem-vindo!</h5>}
          <p className="text-muted small mb-0">
            <FaCalendarAlt className="me-2" />
            {currentDate}
          </p>
        </Col>
      </Row>

      {/* TÍTULO + PESQUISA */}
      <Row className="mb-4 text-center">
        <Col>
          <div className="title-wrapper d-flex align-items-center justify-content-center mb-0">
            <h1 className="display-4 fw-bold text-primary">BiBli</h1>
          </div>
          <p className="lead text-muted mb-2">Sua plataforma de gestão bibliotecária</p>

          <div className="mt-1 mx-auto" style={{ maxWidth: "750px" }}>
            <InputGroup className="shadow-sm">
              <InputGroup.Text className="bg-primary text-white border-0">
                <FaSearch size={18} className="header-icon me-0" />
              </InputGroup.Text>
              <Form.Control
                type="search"
                placeholder="Pesquise por livros, editoras, gêneros..."
                className="py-2 border-0"
                value={termoBusca}
                onChange={e => setTermoBusca(e.target.value)}
              />
            </InputGroup>
          </div>
        </Col>
      </Row>

      {/* LISTA DE LIVROS */}
      <Row className="mb-5">
        <Col>
          <Card>
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Acervo de Livros</h5>
              <span className="badge bg-light text-primary">
                {livrosFiltrados.length} {livrosFiltrados.length === 1 ? 'livro' : 'livros'} •
                Página {paginaAtual} de {totalPaginas || 1}
              </span>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                  </div>
                  <p className="mt-2 text-muted">Carregando livros...</p>
                </div>
              ) : livrosExibidos.length === 0 ? (
                <p className="text-muted text-center py-4">
                  {termoBusca ? "Nenhum livro encontrado com esse termo de busca" : "Nenhum livro cadastrado no acervo"}
                </p>
              ) : (
                <>
                  <Table striped hover responsive className="mb-0">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Título</th>
                        <th>Autor</th>
                        <th>Editora</th>
                        <th>ISBN</th>
                        <th>Gênero</th>
                      </tr>
                    </thead>
                    <tbody>
                      {livrosExibidos.map(livro => (
                        <tr key={livro.id}>
                          <td>{livro.id}</td>
                          <td>{formatarTexto(livro.titulo)}</td>
                          <td>{formatarTexto(livro.autor)}</td>
                          <td>{formatarTexto(livro.editora)}</td>
                          <td>{livro.isbn}</td>
                          <td>{formatarTexto(livro.genero)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  {/* PAGINAÇÃO DOS LIVROS */}
                  {totalPaginas > 1 && (
                    <div className="d-flex justify-content-end align-items-center mt-3 gap-2">
                      <Button
                        className="btn-paginacao"
                        onClick={handlePaginaAnterior}
                        disabled={paginaAtual === 1}
                      >
                        <FaChevronLeft className="me-1" />
                        Anterior
                      </Button>
                      <Button
                        className="btn-paginacao"
                        onClick={handleProximaPagina}
                        disabled={paginaAtual === totalPaginas}
                      >
                        Próxima
                        <FaChevronRight className="ms-1" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* CARDS DE FUNCIONALIDADES */}
      <Row className="g-3">
        {/* Livros */}
        <Col md={6} lg={4} xl={3}>
          <Card className="h-100 text-center">
            <Card.Body>
              <FaBook size={48} className="mb-3 text-primary" />
              <Card.Title>Livros</Card.Title>
              <div className="text-muted">
                <p className="mb-2">Cadastre e gerencie todos os livros do acervo</p>
                <hr className="my-2" />
              </div>
              <Link to="/livros" className="btn btn-primary mt-3">Acessar Livros</Link>
            </Card.Body>
          </Card>
        </Col>

        {/* Professores */}
        <Col md={6} lg={4} xl={3}>
          <Card className="h-100 text-center">
            <Card.Body>
              <FaUserTie size={48} className="mb-3 text-primary" />
              <Card.Title>Professores</Card.Title>
              <div className="text-muted">
                <p className="mb-2">Cadastre e atualize informações de professores</p>
                <hr className="my-2" />
              </div>
              <Link to="/professores" className="btn btn-primary mt-3">Acessar Professores</Link>
            </Card.Body>
          </Card>
        </Col>

        {/* Alunos */}
        <Col md={6} lg={4} xl={3}>
          <Card className="h-100 text-center">
            <Card.Body>
              <FaUserGraduate size={48} className="mb-3 text-primary" />
              <Card.Title>Alunos</Card.Title>
              <div className="text-muted">
                <p className="mb-2">Cadastre e acompanhe os alunos da turma</p>
                <hr className="my-2" />
              </div>
              <Link to="/alunos" className="btn btn-primary mt-3">Acessar Alunos</Link>
            </Card.Body>
          </Card>
        </Col>

        {/* Leitores */}
        <Col md={6} lg={4} xl={3}>
          <Card className="h-100 text-center">
            <Card.Body>
              <FaIdBadge size={48} className="mb-3 text-primary" />
              <Card.Title>Leitores</Card.Title>
              <div className="text-muted">
                <p className="mb-2">Cadastre e gerencie usuários especiais</p>
                <hr className="my-2" />
              </div>
              <Link to="/leitores" className="btn btn-primary mt-3">Acessar Leitores</Link>
            </Card.Body>
          </Card>
        </Col>

        {/* Autores */}
        <Col md={6} lg={4} xl={3}>
          <Card className="h-100 text-center">
            <Card.Body>
              <FaPenFancy size={48} className="mb-3 text-primary" />
              <Card.Title>Autores</Card.Title>
              <div className="text-muted">
                <p className="mb-2">Cadastre e atualize informações sobre autores</p>
                <hr className="my-2" />
              </div>
              <Link to="/autores" className="btn btn-primary mt-3">Acessar Autores</Link>
            </Card.Body>
          </Card>
        </Col>

        {/* Editoras */}
        <Col md={6} lg={4} xl={3}>
          <Card className="h-100 text-center">
            <Card.Body>
              <FaBuilding size={48} className="mb-3 text-primary" />
              <Card.Title>Editoras</Card.Title>
              <div className="text-muted">
                <p className="mb-2">Cadastre e organize as editoras do acervo</p>
                <hr className="my-2" />
              </div>
              <Link to="/editoras" className="btn btn-primary mt-3">Acessar Editoras</Link>
            </Card.Body>
          </Card>
        </Col>

        {/* Entrada */}
        <Col md={6} lg={4} xl={3}>
          <Card className="h-100 text-center">
            <Card.Body>
              <FaDoorOpen size={48} className="mb-3 text-primary" />
              <Card.Title>Entrada</Card.Title>
              <div className="text-muted">
                <p className="mb-2">Registre a entrada de novos livros no acervo</p>
                <hr className="my-2" />
              </div>
              <Link to="/entrada" className="btn btn-primary mt-3">Registrar Entrada</Link>
            </Card.Body>
          </Card>
        </Col>

        {/* Saída */}
        <Col md={6} lg={4} xl={3}>
          <Card className="h-100 text-center">
            <Card.Body>
              <FaSignOutAlt size={48} className="mb-3 text-primary" />
              <Card.Title>Saída</Card.Title>
              <div className="text-muted">
                <p className="mb-2">Registre a saída de livros do acervo</p>
                <hr className="my-2" />
              </div>
              <Link to="/saida" className="btn btn-primary mt-3">Registrar Saída</Link>
            </Card.Body>
          </Card>
        </Col>

        {/* Reservas */}
        <Col md={6} lg={4} xl={3}>
          <Card className="h-100 text-center">
            <Card.Body>
              <FaCalendarAlt size={48} className="mb-3 text-primary" />
              <Card.Title>Reservas</Card.Title>
              <div className="text-muted">
                <p className="mb-2">Gerencie e acompanhe as reservas de livros</p>
                <hr className="my-2" />
              </div>
              <Link to="/reservas" className="btn btn-primary mt-3">Acessar Reservas</Link>
            </Card.Body>
          </Card>
        </Col>

        {/* Empréstimos */}
        <Col md={6} lg={4} xl={3}>
          <Card className="h-100 text-center">
            <Card.Body>
              <FaHandshake size={48} className="mb-3 text-primary" />
              <Card.Title>Empréstimos</Card.Title>
              <div className="text-muted">
                <p className="mb-2">Controle os empréstimos de livros do sistema</p>
                <hr className="my-2" />
              </div>
              <Link to="/emprestimos" className="btn btn-primary mt-3">Acessar Empréstimos</Link>
            </Card.Body>
          </Card>
        </Col>

        {/* Renovações */}
        <Col md={6} lg={4} xl={3}>
          <Card className="h-100 text-center">
            <Card.Body>
              <FaSyncAlt size={48} className="mb-3 text-primary" />
              <Card.Title>Renovações</Card.Title>
              <div className="text-muted">
                <p className="mb-2">Registre e gerencie as renovações de empréstimos</p>
                <hr className="my-2" />
              </div>
              <Link to="/renovacoes" className="btn btn-primary mt-3">Acessar Renovações</Link>
            </Card.Body>
          </Card>
        </Col>

        {/* Devoluções */}
        <Col md={6} lg={4} xl={3}>
          <Card className="h-100 text-center">
            <Card.Body>
              <FaReply size={48} className="mb-3 text-primary" />
              <Card.Title>Devoluções</Card.Title>
              <div className="text-muted">
                <p className="mb-2">Registre e acompanhe as devoluções de livros</p>
                <hr className="my-2" />
              </div>
              <Link to="/devolucoes" className="btn btn-primary mt-3">Acessar Devoluções</Link>
            </Card.Body>
          </Card>
        </Col>

        {/* Relatórios */}
        <Col md={6} lg={4} xl={3}>
          <Card className="h-100 text-center">
            <Card.Body>
              <FaChartBar size={48} className="mb-3 text-primary" />
              <Card.Title>Relatórios</Card.Title>
              <div className="text-muted">
                <p className="mb-2">Veja estatísticas e relatórios do acervo</p>
                <hr className="my-2" />
              </div>
              <Link to="/relatorios" className="btn btn-primary mt-3">Acessar Relatórios</Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* BOTÃO FLUTUANTE DE AJUDA */}
      <div className="help-button-container">
        <button
          className={`help-button ${isButtonActive ? 'active' : ''}`}
          onClick={handleHelpClick}
          aria-label="Botão de ajuda"
          title="Ajuda"
        >
          <FaEnvelope size={24} className="icon" />
          <span className="pulse-effect"></span>
        </button>
      </div>

      {/* MODAL DE AJUDA */}
      <Modal
        show={showHelpModal}
        onHide={handleCloseHelpModal}
        centered
        className="help-modal"
      >
        <Modal.Header closeButton className="modal-header-help">
          <Modal.Title className="text-white">
            <FaInfoCircle className="me-2" />
            Precisa de ajuda?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-help">
          <div className="contact-options">
            <div className="contact-method">
              <div className="method-icon email-icon">
                <FaEnvelope size={32} />
              </div>
              <div className="method-info">
                <h5>E-mail de suporte</h5>
                <a
                  href="mailto:bibliotecandosuporte@gmail.com"
                  className="contact-link"
                >
                  bibliotecandosuporte@gmail.com
                </a>
              </div>
            </div>

            <div className="contact-method">
              <div className="method-icon hours-icon">
                <FaBriefcase size={32} />
              </div>
              <div className="method-info">
                <h5>Horário de atendimento</h5>
                <p>Segunda a sexta, das 8h às 18h</p>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="modal-footer-help">
          <Button
            variant="light"
            onClick={handleCloseHelpModal}
            className="btn-paginacao"
          >
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Home;