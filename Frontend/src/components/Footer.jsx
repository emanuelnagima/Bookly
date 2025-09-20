import { useState } from "react";
import { Container, Row, Col, Modal, Button } from "react-bootstrap";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaChevronRight,
  FaMapMarkerAlt,
  FaEnvelope,
  FaCommentDots,
  FaInfoCircle,
  FaBriefcase,
} from "react-icons/fa";

const Footer = () => {
  const GOOGLE_FORM_FEEDBACK =
    "https://docs.google.com/forms/d/e/1FAIpQLSdile2sE5o6hre6OHWinb7Vi8WS_ZsXP0FseoYQ85MVEhaJDA/viewform?usp=pp_url";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [showHelpModal, setShowHelpModal] = useState(false);
  const handleCloseHelpModal = () => setShowHelpModal(false);

  return (
    <footer className="rodape-principal">
      <Container>
        <Row
          className="g-4 mt-5"
          style={{
            padding: "40px",
          }}
        >
          {/* Coluna 1 - Sobre */}
          <Col md={3}>
            <div className="d-flex flex-column h-100">
              <span className="logo-rodape fw-bold fs-5 mb-2 text-primary">
                Bookly
              </span>
              <p className="texto-rodape small text-muted mb-3">
                Sistema de gerenciamento bibliotecário para controle de acervos,
                empréstimos e cadastros.
              </p>

              <div className="redes-sociais d-flex gap-3 mb-3">
                <a href="#" className="text-dark fs-6">
                  <FaFacebookF />
                </a>
                <a href="#" className="text-dark fs-6">
                  <FaInstagram />
                </a>
                <a href="#" className="text-dark fs-6">
                  <FaTwitter />
                </a>
                <a href="#" className="text-dark fs-6">
                  <FaLinkedinIn />
                </a>
              </div>
            </div>
          </Col>

          {/* Coluna 2 - Acesso Rápido + Links Úteis */}
          <Col md={6}>
            <Row className="g-3">
              {/* Cadastros */}
              <Col>
                <h6 className="fw-bold mb-2">Cadastros</h6>
                <ul className="lista-rodape list-unstyled ps-2">
                  <li>
                    <a
                      href="/usuarios-especiais"
                      className="small text-muted hover-underline"
                    >
                      Usuários
                    </a>
                  </li>
                  <li>
                    <a
                      href="/professores"
                      className="small text-muted hover-underline"
                    >
                      Professores
                    </a>
                  </li>
                  <li>
                    <a
                      href="/alunos"
                      className="small text-muted hover-underline"
                    >
                      Alunos
                    </a>
                  </li>
                  <li>
                    <a
                      href="/livros"
                      className="small text-muted hover-underline"
                    >
                      Livros
                    </a>
                  </li>
                  <li>
                    <a
                      href="/autores"
                      className="small text-muted hover-underline"
                    >
                      Autores
                    </a>
                  </li>
                  <li>
                    <a
                      href="/editoras"
                      className="small text-muted hover-underline"
                    >
                      Editoras
                    </a>
                  </li>
                </ul>
              </Col>

              {/* Movimentações */}
              <Col>
                <h6 className="fw-bold mb-2">Movimentações</h6>
                <ul className="lista-rodape list-unstyled ps-2">
                  <li>
                    <a
                      href="/entrada"
                    className="small text-muted hover-underline"
                    >
                      Entrada
                    </a>
                  </li>
                  <li>
                    <a
                      href="/saida"
                    className="small text-muted hover-underline"
                    >
                      Saída
                    </a>
                  </li>
                  <li>
                    <a
                      href="/reservas"
                      className="small text-muted hover-underline"
                    >
                      Reservas
                    </a>
                  </li>
                  <li>
                    <a
                      href="/emprestimos"
                    className="small text-muted hover-underline"
                    >
                      Empréstimos
                    </a>
                  </li>
                  <li>
                    <a
                      href="/renovacoes"
                    className="small text-muted hover-underline"
                    >
                      Renovações
                    </a>
                  </li>
                  <li>
                    <a
                      href="/devolucoes"
                      className="small text-muted hover-underline"
                    >
                      Devoluções
                    </a>
                  </li>
                  <li>
                    <a
                      href="/relatorios"
                      className="small text-muted hover-underline"
                    >
                      Relatórios
                    </a>
                  </li>
                </ul>
              </Col>

              {/* Acesso Rápido */}
              <Col>
                <h6 className="fw-bold mb-2">Acesso Rápido</h6>
                <ul className="lista-rodape list-unstyled ps-2">
                  <li>
                    <a
                      href="/sobre"
                      className="small text-muted hover-underline"
                    >
                      Sobre
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowHelpModal(true);
                      }}
                    className="small text-muted hover-underline"
                    >
                      Ajuda
                    </a>
                  </li>
                  <li>
                    <a
                      href="/login"
                      className="small text-muted hover-underline"
                    >
                      Sair do sistema
                    </a>
                  </li>
                  <li>
                    <a
                      href={GOOGLE_FORM_FEEDBACK}
                      className="small text-muted hover-underline"
                    >
                      Formulário
                    </a>
                  </li>
                </ul>
              </Col>

              {/* Links Úteis */}
              <Col>
                <h6 className="fw-bold mb-2">Links Úteis</h6>
                <ul className="lista-rodape list-unstyled ps-2">
                  <li>
                    <a
                      href="#"
                      className="small text-muted hover-underline"
                    >
                      <FaChevronRight className="me-2 text-primary" size={10} />
                      Privacidade
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="small text-muted hover-underline"
                    >
                      <FaChevronRight className="me-2 text-primary" size={10} />
                      Termos
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="small text-muted hover-underline"
                    >
                      <FaChevronRight className="me-2 text-primary" size={10} />
                      Documentação
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="small text-muted hover-underline"
                    >
                      <FaChevronRight className="me-2 text-primary" size={10} />
                      FAQs
                    </a>
                  </li>
                </ul>
              </Col>
            </Row>
          </Col>

          {/* Coluna 4 - Contato + Feedback */}
          <Col md={3}>
            <h3 className="h6 mb-3 fw-bold">Contato</h3>

            <div className="mb-3 d-flex">
              <FaMapMarkerAlt className="me-2 mt-1 text-primary" size={15} />
              <div>
                <p className="mb-0 small text-muted">
                  Unoeste - Universidade do Oeste Paulista
                </p>
                <p className="mb-0 small text-muted">
                  R. José Bongiovani, 700 - Cidade Universitária, Pres. Prudente - SP, 19050-920</p>
              </div>
            </div>

            <div className="small text-muted text-decoration-none">
                booklysuporte@gmail.com
            </div>

            <div className="feedback-section mt-3">
              <a
                href={GOOGLE_FORM_FEEDBACK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary d-flex align-items-center justify-content-center gap-2"
                style={{
                  fontSize: "12px",
                  padding: "4px 10px",
                  borderRadius: "4px",
                }}
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
        <div className="creditos-rodape py-3 text-center">
          <p className="mb-0 small text-muted">
            &copy; {new Date().getFullYear()} Bookly. Todos os direitos
            reservados. <br />
            Versão 1.0.0 em desenvolvimento 
          </p>
        </div>

        {/* Modal de Ajuda */}
        <Modal
          show={showHelpModal}
          onHide={handleCloseHelpModal}
          centered
          className="help-modal"
        >
          <Modal.Header closeButton className="modal-header-help">
            <Modal.Title className="text-white">
              <FaInfoCircle className="me-2" /> Precisa de ajuda?
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
                    href="mailto:booklysuporte@gmail.com"
                    className="contact-link"
                  >
                    Booklysuporte@gmail.com
                  </a>
                </div>
              </div>
              <div className="contact-method mt-3">
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
    </footer>
  );
};

export default Footer;
