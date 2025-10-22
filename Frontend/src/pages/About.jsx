import { Container, Row, Col, Button } from "react-bootstrap";
import {
  FaBookOpen,
  FaUsers,
  FaDatabase,
  FaSearch,
  FaClock,
  FaChartBar,
  FaUserCheck,
  FaExchangeAlt,
  FaRegCalendarCheck,
  FaRegCalendarTimes,
  FaRegFileAlt,
  FaReact,
  FaNodeJs,
  FaHtml5,
  FaCss3Alt,
  FaJsSquare,
  FaGithub,
  FaBootstrap,
  FaFigma
} from "react-icons/fa";
import "/src/css/about.css";
import photoEmanuel from "../images/emanuel.jpg";
import photoMaria from "../images/maria.jpg";
import photoDaniel from "../images/daniel.jpg";
import photoRodrigo from "../images/rodrigo.jpg";

// Equipe
const devs = [
  { name: "Emanuel Nepomuceno Nagima", photo: photoEmanuel },
  { name: "Daniel Pereira Viana de Sena", photo: photoDaniel },
  { name: "Rodrigo Brasil Rodrigues", photo: photoRodrigo },
  { name: "Maria Clara Garcia de Oliveira", photo: photoMaria },
];

// Funcionalidades baseadas na ERD
const features = [
  {
    icon: <FaBookOpen className="fa-book-open" />,
    title: "Gestão Completa do Acervo",
    description: "Cadastro completo de livros, autores e editoras com controle de entrada e saída de exemplares"
  },
  {
    icon: <FaUserCheck className="fa-user-check" />,
    title: "Controle de Usuários",
    description: "Cadastro diferenciado para alunos, professores e administradores da biblioteca"
  },
  {
    icon: <FaRegCalendarCheck className="fa-reg-calendar-check" />,
    title: "Sistema de Reservas",
    description: "Reserva de livros com notificação quando estiverem disponíveis para retirada"
  },
  {
    icon: <FaExchangeAlt className="fa-exchange-alt" />,
    title: "Empréstimos",
    description: "Controle de empréstimos por usuário e verificação de disponibilidade"
  },
  {
    icon: <FaClock className="fa-clock" />,
    title: "Renovações",
    description: "Prorrogação de prazo quando o livro não está reservado, dentro dos limites permitidos"
  },
  {
    icon: <FaSearch className="fa-search" />,
    title: "Consultas em Tempo Real",
    description: "Acesso rápido a informações sobre acervo, empréstimos, reservas e devoluções"
  },
  {
    icon: <FaRegFileAlt className="fa-reg-file-alt" />,
    title: "Baixa de Exemplares",
    description: "Registro de descarte de livros com manutenção do controle histórico"
  },
  {
    icon: <FaChartBar className="fa-chart-bar" />,
    title: "Relatórios Detalhados",
    description: "Emissão de relatórios sobre reservas, estoque, empréstimos e devoluções"
  },
  {
    icon: <FaChartBar className="fa-chart-bar" />,
    title: "Segurança de Dados",
    description: "Proteção contra acessos não autorizados e preservação de informações sensíveis"
  },
  {
    icon: <FaDatabase className="fa-database" />,
    title: "Controle de Aquisições",
    description: "Registro de novas aquisições com atualização automática do acervo"
  },
];

// Tecnologias
const technologies = [
  { name: "HTML5", icon: <FaHtml5 size={40} color="#E44D26" />, description: "Estrutura semântica" },
  { name: "CSS3", icon: <FaCss3Alt size={40} color="#264DE4" />, description: "Estilos e layout" },
  { name: "JavaScript", icon: <FaJsSquare size={40} color="#F0DB4F" />, description: "Interatividade" },
  { name: "React", icon: <FaReact size={40} color="#61DBFB" />, description: "Interface moderna" },
  { name: "Node.js", icon: <FaNodeJs size={40} color="#68A063" />, description: "Backend robusto" },
  { name: "MySQL", icon: <FaDatabase size={40} color="#336791" />, description: "Banco de dados" },
  { name: "Git", icon: <FaGithub size={40} color="#171515" />, description: "Controle de versão" },
  { name: "Bootstrap", icon: <FaBootstrap size={40} color="#7952B3" />, description: "Design responsivo" },
  { name: "Figma", icon: <FaFigma size={40} color="#6699CC" />, description: "Design e prototipagem" }
];

export default function About() {
  return (
    <Container className="about-page py-4">
      {/* Header Institucional */}
      <section className="institutional-header text-center mb-5">
        <h1 className="display-5 fw-bold mb-3">Sistema Bookly</h1>
        <p className="lead mb-4">
          Sistema exclusivo de gestão bibliotecária para <strong>instituições educacionais</strong>
        </p>
        <div className="institutional-divider"></div>
      </section>

      {/* Sobre o Sistema */}
      <section className="system-description mb-5">
        <Row className="align-items-center">
          <Col lg={8} className="mx-auto">
            <div className="description-content">
              <h2 className="section-title mb-4">Sobre o Bookly</h2>
              <p className="system-text">
                O <strong>Bookly</strong> é um sistema desenvolvido especificamente para atender às necessidades 
                de bibliotecas de instituições educacionais, oferecendo controle completo 
                sobre todo o processo de gestão do acervo bibliográfico.
              </p>
              
              <div className="system-highlights mt-4">
                <h5 className="mb-3">Principais Objetivos:</h5>
                <ul className="system-list">
                  <li>Gerenciamento integral do acervo bibliográfico</li>
                  <li>Controle de empréstimos, reservas e devoluções</li>
                  <li>Vinculação de todas as operações ao processo de empréstimo</li>
                  <li>Garantia de disponibilidade e controle de exemplares</li>
                  <li>Segurança e privacidade dos dados</li>
                </ul>
              </div>
            </div>
          </Col>
        </Row>
      </section>

      {/* Fluxo de Trabalho */}
      <section className="workflow-section mb-5">
        <h2 className="section-title text-center mb-5">Fluxo de Trabalho</h2>
        <Row className="g-4">
          <Col md={6} lg={3}>
            <div className="workflow-step">
              <div className="step-number">1</div>
              <h5>Cadastro</h5>
              <p>Registro de livros, usuários, autores e editoras no sistema</p>
            </div>
          </Col>
          <Col md={6} lg={3}>
            <div className="workflow-step">
              <div className="step-number">2</div>
              <h5>Reserva</h5>
              <p>Usuários reservam livros disponíveis por período determinado</p>
            </div>
          </Col>
          <Col md={6} lg={3}>
            <div className="workflow-step">
              <div className="step-number">3</div>
              <h5>Empréstimo</h5>
              <p>Retirada de exemplares com controle de prazos automático</p>
            </div>
          </Col>
          <Col md={6} lg={3}>
            <div className="workflow-step">
              <div className="step-number">4</div>
              <h5>Devolução</h5>
              <p>Registro de devolução com atualização em tempo real</p>
            </div>
          </Col>
        </Row>
      </section>

      {/* Funcionalidades */}
      <section className="features-section mb-5">
        <h2 className="section-title text-center mb-5">Funcionalidades</h2>
        <Row className="g-3">
          {features.map((feature, index) => (
            <Col key={index} xs={12} sm={6} lg={4}>
              <div className="feature-item">
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <div className="feature-content">
                  <h6>{feature.title}</h6>
                  <p>{feature.description}</p>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </section>

      {/* Tecnologias */}
      <section className="technologies-section mb-5">
        <h2 className="section-title text-center mb-4">Tecnologias Utilizadas</h2>
        <Row className="justify-content-center g-4">
          {technologies.map((tech, index) => (
            <Col key={index} xs={6} sm={4} md={3} lg={2}>
              <div className="tech-item text-center">
                <div className="tech-icon mb-2">
                  {tech.icon}
                </div>
                <h6 className="mb-1">{tech.name}</h6>
                <p className="tech-description">{tech.description}</p>
              </div>
            </Col>
          ))}
        </Row>
      </section>

      {/* Equipe */}
      <section className="team-section mb-5">
        <h2 className="section-title text-center mb-4">Equipe de Desenvolvimento</h2>
        <p className="text-center mb-4">Conheça os desenvolvedores responsáveis pelo sistema Bookly</p>
        <Row className="g-4 justify-content-center">
          {devs.map((dev, index) => (
            <Col key={index} xs={12} sm={6} md={3}>
              <div className="team-member text-center">
                <img 
                  src={dev.photo} 
                  alt={dev.name}
                  className="member-photo"
                />
                <h6 className="mt-3">{dev.name}</h6>
              </div>
            </Col>
          ))}
        </Row>
      </section>

      {/* Informações Institucionais */}
      <section className="info text-center">
        <div className="info-content">
          <h5 className="mb-3">Sistema Bookly - Gestão Bibliotecária</h5>
          <p className="mb-3">
            Desenvolvido para uso interno de bibliotecas educacionais
          </p>
        </div>
      </section>
    </Container>
  );
}