import { Row, Col } from "react-bootstrap";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaChevronRight,
  FaMapMarkerAlt,
  FaEnvelope,
  FaCommentDots,
  FaArrowUp,
} from "react-icons/fa";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const quickLinks = [
    { label: "Home", path: "/" },
    { label: "Sobre", path: "/sobre" },
    { label: "Livros", path: "/livros" },
    { label: "Professores", path: "/professores" },
    { label: "Alunos", path: "/alunos" },
    { label: "Autores", path: "/autores" },
    { label: "Editoras", path: "/editoras" },
    { label: "Usuários Especiais", path: "/usuarios-especiais" },
    { 
      label: "Formulário de Feedback", 
      url: "https://docs.google.com/forms/d/e/1FAIpQLSdile2sE5o6hre6OHWinb7Vi8WS_ZsXP0FseoYQ85MVEhaJDA/viewform?usp=pp_url" 
    },
  ];

  return (
    <footer className="rodape-principal">
      <div className="footer-inner">
        <Row className="gy-4">
          {/* Coluna 1 - Sobre + redes sociais */}
          <Col md={3}>
            <div className="d-flex flex-column h-100">
              <span className="logo-rodape mb-3">BiBliotecando</span>
              <p className="texto-rodape mb-3">
                Sistema de gerenciamento bibliotecário para facilitar o controle de acervos, empréstimos e cadastros.
              </p>
              <div className="redes-sociais d-flex gap-3">
                <a href="#"><FaFacebookF /></a>
                <a href="#"><FaInstagram /></a>
                <a href="#"><FaTwitter /></a>
                <a href="#"><FaLinkedinIn /></a>
              </div>
            </div>
          </Col>

          {/* Coluna 2 - Links Úteis */}
          <Col md={3}>
            <h5 className="mb-3">Links Úteis</h5>
            <ul className="lista-rodape list-unstyled">
              <li><a href="#"><FaChevronRight size={12}/> Política de Privacidade</a></li>
              <li><a href="#"><FaChevronRight size={12}/> Termos de Uso</a></li>
              <li><a href="#"><FaChevronRight size={12}/> Documentação</a></li>
              <li><a href="#"><FaChevronRight size={12}/> FAQs</a></li>
            </ul>
          </Col>

          {/* Coluna 3 - Acesso Rápido */}
          <Col md={3}>
            <h5 className="mb-3">Acesso Rápido</h5>
            <ul className="lista-rodape list-unstyled">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.url || link.path}
                    target={link.url ? "_blank" : "_self"}
                    rel={link.url ? "noopener noreferrer" : ""}
                  >
                    <FaChevronRight size={12}/> {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </Col>

          {/* Coluna 4 - Contato */}
          <Col md={3}>
            <h5 className="mb-3">Contato</h5>
            <div className="mb-3 d-flex align-items-start">
              <FaMapMarkerAlt className="me-2 mt-1" />
              <div>
                <p className="mb-0">Universidade do Oeste Paulista - UNOESTE</p>
                <p className="mb-0">Presidente Prudente - SP</p>
              </div>
            </div>
            <div className="mb-3 d-flex align-items-center">
              <FaEnvelope className="me-2" />
              <a href="mailto:bibliotecandosuporte@gmail.com">bibliotecandosuporte@gmail.com</a>
            </div>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSdile2sE5o6hre6OHWinb7Vi8WS_ZsXP0FseoYQ85MVEhaJDA/viewform?usp=pp_url"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-feedback w-100 d-flex align-items-center justify-content-center gap-2"
            >
              <FaCommentDots /> Ajude-nos a melhorar
            </a>
            <p className="small mt-2">Sua opinião é valiosa para nós!</p>
          </Col>
        </Row>

        {/* Botão Voltar ao Topo */}
        <div className="text-center my-4">
          <button onClick={scrollToTop} className="btn btn-voltar-topo">
            <FaArrowUp className="me-2" /> Voltar ao topo
          </button>
        </div>

        {/* Créditos */}
        <div className="creditos-rodape text-center py-3">
          <p className="mb-0 small">&copy; Bibliotecando. Todos os direitos reservados.</p>
        </div>
      </div>

      {/* === ESTILO === */}
      <style jsx>{`
        .rodape-principal {
          background-color: #0B192C;
          color: #f5f5f5;
          padding: 60px 15px 30px;
          font-family: 'Segoe UI', sans-serif;
        }
        .footer-inner { max-width: 1140px; margin: 0 auto; }
        .rodape-principal a { color: #f5f5f5; text-decoration: none; transition: color 0.3s; }
        .rodape-principal a:hover { color: #1E90FF; }
        .logo-rodape { font-size: 1.5rem; font-weight: bold; color: #fff; }
        .texto-rodape { font-size: 0.95rem; color: #d1d1d1; line-height: 1.5; }
        .redes-sociais a { color: #fff; transition: transform 0.3s; font-size: 1.1rem; }
        .redes-sociais a:hover { color: #1E90FF; transform: scale(1.2); }
        .lista-rodape li { margin-bottom: 0.6rem; }
        .lista-rodape li a { display: flex; align-items: center; gap: 8px; font-size: 0.95rem; }
        .btn-feedback {
          background-color: #1E90FF;
          border: none;
          font-weight: 500;
          transition: background-color 0.3s;
          margin-top: 0.5rem;
        }
        .btn-feedback:hover { background-color: #63B3ED; }
        .btn-voltar-topo {
          background-color: #1E90FF;
          color: #fff;
          border: none;
          font-weight: 500;
          padding: 0.5rem 1.2rem;
          transition: background-color 0.3s;
        }
        .btn-voltar-topo:hover { background-color: #63B3ED; }
        .creditos-rodape { border-top: 1px solid #1a2a44; color: #d1d1d1; font-size: 0.85rem; margin-top: 2rem; }
        @media (max-width: 768px) { .rodape-principal { padding: 40px 15px; } }
      `}</style>
    </footer>
  );
};

export default Footer;
