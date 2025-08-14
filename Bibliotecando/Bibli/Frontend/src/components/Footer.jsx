import { Container, Row, Col } from "react-bootstrap";
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

    <footer className="rodape-principal mt-5">
      <Container className="container-rodape">
        <Row className="linha-rodape">
          <Col md={4} className="coluna-rodape">
            <span className="logo-rodape">BIBLIOTECANDO</span>
            <p className="texto-rodape">
              Sistema de gerenciamento bibliotecário desenvolvido para facilitar o controle de acervos, empréstimos e cadastros.
            </p>
            <div className="redes-sociais d-flex gap-3">
              <a href="#"><FaFacebookF /></a>
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaLinkedinIn /></a>
            </div>
          </Col>

          <Col md={4} className="coluna-rodape">
            <h3 className="titulo-rodape">Links Úteis</h3>
            <ul className="lista-rodape list-unstyled">
              <li>
                <a href="#"><FaChevronRight className="me-2" />Política de Privacidade</a>
              </li>
              <li>
                <a href="#"><FaChevronRight className="me-2" />Termos de Uso</a>
              </li>
              <li>
                <a href="#"><FaChevronRight className="me-2" />Documentação</a>
              </li>
              <li>
                <a href="#"><FaChevronRight className="me-2" />FAQs</a>
              </li>
            </ul>
          </Col>

          <Col md={4} className="coluna-rodape">
            <h3 className="titulo-rodape">Contato</h3>
            <p className="texto-rodape">
              <FaMapMarkerAlt className="me-2" />
              Universidade do Oeste Paulista - UNOESTE<br />
              Presidente Prudente - SP
            </p>
            <p className="texto-rodape">
              <FaEnvelope className="me-2" /> bibliotecando@unoeste.br
            </p>
            <p className="texto-rodape">
              <FaPhoneAlt className="me-2" /> (18) 3229-2000
            </p>
          </Col>
        </Row>
      </Container>

      <div className="creditos-rodape py-3">
        <Container className="container-rodape text-center">
       
          <p>&copy; 2025 Bibliotecando. Todos os direitos reservados.</p>
        </Container>
      </div>
    </footer>
  )
}

export default Footer
