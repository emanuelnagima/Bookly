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
  FaBriefcase,
  FaBookOpen
} from "react-icons/fa";

import livroService from "../services/livroService";

// Função utilitária para formatar texto com capitalização de cada palavra
const formatarTexto = texto =>
  (texto || '')
    .toLowerCase()
    .split(' ')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');

// Constante para controle de paginação
const ITENS_POR_PAGINA = 8;

const Home = () => {
  // Estados do componente
  const [currentDate, setCurrentDate] = useState(""); // Data atual formatada
  const [showWelcome, setShowWelcome] = useState(true); // Controla exibição da mensagem de boas-vindas
  const [livros, setLivros] = useState([]); // Lista completa de livros
  const [termoBusca, setTermoBusca] = useState(""); // Termo de busca para filtrar livros
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [paginaAtual, setPaginaAtual] = useState(1); // Página atual na paginação
  const [showHelpModal, setShowHelpModal] = useState(false); // Controla visibilidade do modal de ajuda
  const [isButtonActive, setIsButtonActive] = useState(false); // Estado de animação do botão de ajuda

  // Efeito para configurar data atual e temporizador de boas-vindas
  useEffect(() => {
    const options = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
    setCurrentDate(new Date().toLocaleDateString("pt-BR", options));

    // Temporizador para esconder mensagem de boas-vindas após 10 segundos
    const welcomeTimer = setTimeout(() => setShowWelcome(false), 10000);
    return () => clearTimeout(welcomeTimer); // Cleanup do temporizador
  }, []);

  // Efeito para carregar livros do serviço ao montar o componente
  useEffect(() => {
    const fetchLivros = async () => {
      try {
        const data = await livroService.getAll();
        setLivros(data);
      } catch (error) {
        console.error("Erro ao carregar livros:", error);
      } finally {
        setLoading(false); // Finaliza estado de carregamento independente do resultado
      }
    };
    fetchLivros();
  }, []);

  // Efeito para resetar página quando o termo de busca mudar
  useEffect(() => {
    setPaginaAtual(1);
  }, [termoBusca]);

  // Filtra livros com base no termo de busca (case insensitive)
  const livrosFiltrados = livros.filter(l =>
    (l.titulo || "").toLowerCase().includes(termoBusca.toLowerCase()) ||
    (l.autor || "").toLowerCase().includes(termoBusca.toLowerCase()) ||
    (l.editora || "").toLowerCase().includes(termoBusca.toLowerCase()) ||
    (l.isbn || "").toLowerCase().includes(termoBusca.toLowerCase()) ||
    (l.genero || "").toLowerCase().includes(termoBusca.toLowerCase()) ||
    (l.ano_publicacao || "").toString().includes(termoBusca)
  );

  // Calcula total de páginas baseado nos itens filtrados
  const totalPaginas = Math.ceil(livrosFiltrados.length / ITENS_POR_PAGINA);

  // Ordena e seleciona os livros para a página atual
  const livrosExibidos = livrosFiltrados
    .sort((a, b) => (a.titulo || "").localeCompare(b.titulo || ""))
    .slice(
      (paginaAtual - 1) * ITENS_POR_PAGINA,
      paginaAtual * ITENS_POR_PAGINA
    );

  // Handlers para navegação de paginação
  const handlePaginaAnterior = () => {
    if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1);
  };

  const handleProximaPagina = () => {
    if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1);
  };

  // Handler para botão de ajuda com efeito visual
  const handleHelpClick = () => {
    setIsButtonActive(true);
    setTimeout(() => setIsButtonActive(false), 200); // Reset do estado ativo após 200ms
    setShowHelpModal(true);
  };

  const handleCloseHelpModal = () => {
    setShowHelpModal(false);
  };

  // Estrutura de dados para os cards de funcionalidades organizados por categoria
  const categoriasCards = [
    {
      titulo: "Gestão de Pessoas",
      cards: [
        { icone: FaUserTie, titulo: "Professores", descricao: "Cadastre e atualize informações de professores", link: "/professores" },
        { icone: FaUserGraduate, titulo: "Alunos", descricao: "Cadastre e acompanhe os alunos da turma", link: "/alunos" },
        { icone: FaIdBadge, titulo: "Leitores", descricao: "Cadastre e gerencie outros tipos de usuários ", link: "/leitores" },
      ]
    },
    {
      titulo: "Gestão de Acervo",
      cards: [
        { icone: FaBook, titulo: "Livros", descricao: "Cadastre e gerencie todos os livros do acervo", link: "/livros" },
        { icone: FaPenFancy, titulo: "Autores", descricao: "Cadastre e atualize informações sobre autores", link: "/autores" },
        { icone: FaBuilding, titulo: "Editoras", descricao: "Cadastre e organize as editoras do acervo", link: "/editoras" },
      ]
    },
    {
      titulo: "Operações",
      cards: [
        { icone: FaDoorOpen, titulo: "Entrada", descricao: "Registre a entrada de novos livros no acervo", link: "/entrada" },
        { icone: FaSignOutAlt, titulo: "Saída", descricao: "Registre a saída de livros do acervo do sistema", link: "/saida" },
        { icone: FaCalendarAlt, titulo: "Reservas", descricao: "Gerencie e acompanhe as reservas de livros", link: "/reservas" },
        { icone: FaHandshake, titulo: "Empréstimos", descricao: "Controle os empréstimos de livros do sistema", link: "/emprestimos" },
        { icone: FaSyncAlt, titulo: "Renovações", descricao: "Registre e gerencie as renovações de empréstimos", link: "/renovacoes" },
        { icone: FaReply, titulo: "Devoluções", descricao: "Registre e acompanhe as devoluções de livros", link: "/devolucoes" },
      ]
    },
    {
      titulo: "Relatórios",
      cards: [
        { icone: FaChartBar, titulo: "Relatórios", descricao: "Veja estatísticas e relatórios do acervo", link: "/relatorios" },
      ]
    }
  ];

  return (
    <Container className="py-4">
      {/* CABEÇALHO COM NOME DO SISTEMA E DATA */}
      <Row className="mb-4 animate__animated animate__fadeIn">
        <Col>
          <div className="d-flex align-items-center justify-content-between p-4 rounded" style={{ borderBottom: '3px solid #169976' }}>
            <div>
              <h1 className="h4 fw-bold text-primary mb-1">
                <FaBookOpen className="me-2" />
                BiBli
              </h1>
              <p className="text-muted mb-0">Sua plataforma completa de gestão bibliotecária</p>
            </div>
            <div className="text-end">
              {showWelcome && <h3 className="mb-1 fw-bold text-primary">Seja bem-vindo!</h3>}
              <p className="text-muted mb-0">
                <FaCalendarAlt className="me-1" />
                {currentDate}
              </p>
            </div>
          </div>
        </Col>
      </Row>

      {/* BARRA DE PESQUISA DO ACERVO */}
      <Row className="mb-0">
        <Col>
          <div className="p-3" style={{  maxWidth: '700px' }}>
            <h5 className="mb-3 text-primary">Pesquisar Acervo</h5>
            <InputGroup>
              <InputGroup.Text className="bg-primary text-white border-0">
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="search"
                placeholder="Pesquise por livros, autores, editoras, gêneros, ISBN..."
                value={termoBusca}
                onChange={e => setTermoBusca(e.target.value)}
              />
            </InputGroup>
          </div>
        </Col>
      </Row>

      {/* LISTA DE LIVROS COM PAGINAÇÃO */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center py-2">
              <h5 className="mb-1">
                <FaBook className="me-2" />
                Acervo de Livros
              </h5>
              <span className="badge bg-light text-primary">
                {livrosFiltrados.length} {livrosFiltrados.length === 1 ? 'livro' : 'livros'} •
                Página {paginaAtual} de {totalPaginas || 1}
              </span>
            </Card.Header>
            <Card.Body className="p-3">
              {loading ? (
                // Estado de carregamento
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                  </div>
                  <p className="mt-2 text-muted">Carregando livros...</p>
                </div>
              ) : livrosExibidos.length === 0 ? (
                // Estado vazio (com ou sem busca)
                <p className="text-muted text-center py-4">
                  {termoBusca ? "Nenhum livro encontrado com esse termo de busca" : "Nenhum livro cadastrado no acervo"}
                </p>
              ) : (
                // Tabela com livros e controles de paginação
                <>
                  <Table striped hover responsive className="mb-1">
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

                  {/* CONTROLES DE PAGINAÇÃO */}
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

      {/* CARDS DE FUNCIONALIDADES ORGANIZADOS POR CATEGORIA */}
      {categoriasCards.map((categoria, index) => (
        <div key={index} className="mb-4">
          <h5 className="mb-3 pb-2 text-primary border-bottom">{categoria.titulo}</h5>
          <Row className="g-3">
            {categoria.cards.map((card, cardIndex) => {
              const Icone = card.icone;
              return (
                <Col md={6} lg={4} xl={3} key={cardIndex}>
                  <Card className="h-100 text-center card-hover">
                    <Card.Body className="d-flex flex-column p-3">
                      <Icone size={30} className="mb-2 text-primary mx-auto" />
                      <Card.Title className="h3 mb-1">{card.titulo}</Card.Title>
                      <div className="text-muted flex-grow-1">
                        <p className="mb-">{card.descricao}</p>
                        <hr className="my-2" />
                      </div>
                      <Link to={card.link} className="btn btn-primary mt-2">Acessar</Link>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </div>
      ))}

      {/* BOTÃO FLUTUANTE DE AJUDA COM EFEITO VISUAL */}
      <div className="help-button-container">
        <button
          className={`help-button ${isButtonActive ? 'active' : ''}`}
          onClick={handleHelpClick}
          aria-label="Botão de ajuda"
          title="Ajuda"
        >
          <FaEnvelope size={18} className="icon" />
          <span className="pulse-effect"></span>
        </button>
      </div>

      {/* MODAL DE AJUDA COM INFORMAÇÕES DE CONTATO */}
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