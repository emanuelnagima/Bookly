import { Container, Row, Col } from "react-bootstrap";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter ,
  FaLinkedinIn,
  FaChevronRight,
  FaMapMarkerAlt,
  FaEnvelope,
  FaCommentDots,
  FaArrowUp,
} from "react-icons/fa";

const Footer = () => {
  //  link específico formulário do Google Forms
  const GOOGLE_FORM_FEEDBACK =
    "https://docs.google.com/forms/d/e/1FAIpQLSdile2sE5o6hre6OHWinb7Vi8WS_ZsXP0FseoYQ85MVEhaJDA/viewform?usp=pp_url";

  // Função para voltar ao topo
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="rodape-principal mt-5 bg-light pt-4">
      <Container>
        <Row className="g-4">
          {/* Coluna 1 - Sobre */}
          <Col md={4}>
            <div className="d-flex flex-column h-100">
              <span className="logo-rodape fw-bold fs-4 mb-3 text-primary">
                BiBliotecando - Bibli
              </span>
              <p className="texto-rodape text-muted mb-3">
                Sistema de gerenciamento bibliotecário desenvolvido para
                facilitar o controle de acervos, empréstimos e cadastros.
              </p>

              <div className="redes-sociais d-flex gap-3 mb-3">
                <a href="#" className="text-dark fs-5">
                  <FaFacebookF />
                </a>
                <a href="#" className="text-dark fs-5">
                  <FaInstagram />
                </a>
                <a href="#" className="text-dark fs-5">
                  <FaTwitter  />
                </a>
                <a href="#" className="text-dark fs-5">
                  <FaLinkedinIn />
                </a>
              </div>
            </div>
          </Col>

          {/* Coluna 2 - Links Úteis */}
          <Col md={4}>
            <h3 className="h5 mb-3 fw-bold">Links Úteis</h3>
            <ul className="lista-rodape list-unstyled">
              <li className="mb-2">
                <a
                  href="#"
                  className="text-decoration-none text-muted d-flex align-items-center"
                >
                  <FaChevronRight className="me-2 text-primary" size={10} />
                  Política de Privacidade
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#"
                  className="text-decoration-none text-muted d-flex align-items-center"
                >
                  <FaChevronRight className="me-2 text-primary" size={10} />
                  Termos de Uso
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#"
                  className="text-decoration-none text-muted d-flex align-items-center"
                >
                  <FaChevronRight className="me-2 text-primary" size={10} />
                  Documentação
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#"
                  className="text-decoration-none text-muted d-flex align-items-center"
                >
                  <FaChevronRight className="me-2 text-primary" size={10} />
                  FAQs
                </a>
              </li>
            </ul>
          </Col>

          {/* Coluna 3 - Contato + Feedback */}
          <Col md={4}>
            <h3 className="h5 mb-3 fw-bold">Contato</h3>

            <div className="mb-3 d-flex">
              <FaMapMarkerAlt className="me-3 mt-1 text-primary" />
              <div>
                <p className="mb-0 text-muted">
                  Universidade do Oeste Paulista - UNOESTE
                </p>
                <p className="mb-0 text-muted">Presidente Prudente - SP</p>
              </div>
            </div>

            <div className="mb-3 d-flex">
              <FaEnvelope className="me-3 text-primary" />
              <a
                href="mailto:bibliotecando@unoeste.br"
                className="text-muted text-decoration-none"
              >
                bibliotecandosuporte@gmail.com
              </a>
            </div>

            {/* Botão de Feedback com seu Google Forms */}
            <div className="feedback-section">
              <a
                href={GOOGLE_FORM_FEEDBACK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
              >
                <FaCommentDots size={12} />
                Ajude-nos a melhorar
              </a>
              <p className="small text-muted mt-2 mb-0">
                Sua opinião é valiosa para nós!
              </p>
            </div>
          </Col>
        </Row>

        {/* Botão Voltar ao Topo */}
        <div className="text-center my-4">
          <button
            onClick={scrollToTop}
              className="btn btn-paginacao btn-sm d-flex align-items-center mx-auto px-4"
            aria-label="Voltar ao topo"
          > 
         Voltar ao topo 
          </button>
        </div>
        {/* Créditos */}
        <div className="creditos-rodape py-3 border-top text-center">
          <p className="mb-0 small text-muted">
            &copy; Bibliotecando. Todos os direitos reservados.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
