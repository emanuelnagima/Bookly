import { Container, Row, Col, Button, Carousel } from "react-bootstrap";
import {
  FaBookOpen,
  FaUsers,
  FaReact,
  FaNodeJs,
  FaDatabase,
  FaHtml5,
  FaCss3Alt,
  FaJsSquare,
  FaGithub,
  FaChartLine,
  FaMobileAlt,
  FaHandsHelping,
  FaBullseye,
  FaEye,
  FaHeart,
  FaEnvelope,
  FaBootstrap,
  FaFigma,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";

import photoEmanuel from "../images/emanuel.jpg";
import photoMaria from "../images/maria.jpg";
import photoDaniel from "../images/daniel.jpg";
import photoRodrigo from "../images/rodrigo.jpg";

// Importando as imagens do carrossel
import img2 from "../images/img2.jpg";
import img3 from "../images/img3.jpg";
import img16 from "../images/img16.jpg";
import img21 from "../images/img21.jpg";

// Equipe
const devs = [
  { name: "Emanuel Nepomuceno Nagima", photo: photoEmanuel },
  { name: "Daniel Pereira Viana de Sena", photo: photoDaniel },
  { name: "Rodrigo Brasil Rodrigues", photo: photoRodrigo },
  { name: "Maria Clara Garcia de Oliveira", photo: photoMaria },
];

// Missão, Visão, Valores
const mvvItems = [
  {
    title: "Missão",
    text: "Facilitar o acesso à informação através de uma plataforma simples e eficiente, promovendo o hábito da leitura.",
    icon: <FaBullseye size={30} className="text-primary" />
  },
  {
    title: "Visão",
    text: "Ser referência em soluções digitais para bibliotecas, contribuindo para o desenvolvimento educacional e cultural.",
    icon: <FaEye size={30} className="text-primary" />
  },
  {
    title: "Valores",
    text: "Inovação, transparência, acessibilidade e compromisso com la comunidad acadêmica e leitores.",
    icon: <FaHeart size={30} className="text-primary" />
  }
];

// Tecnologias
const technologies = [
  { name: "HTML5", icon: <FaHtml5 size={55} color="#E44D26" /> },
  { name: "CSS3", icon: <FaCss3Alt size={55} color="#264DE4" /> },
  { name: "JavaScript", icon: <FaJsSquare size={55} color="#F0DB4F" /> },
  { name: "React", icon: <FaReact size={55} color="#61DBFB" /> },
  { name: "Node.js", icon: <FaNodeJs size={55} color="#68A063" /> },
  { name: "MySQL", icon: <FaDatabase size={55} color="#336791" /> },
  { name: "Git", icon: <FaGithub size={55} color="#171515" /> },
  { name: "Bootstrap", icon: <FaBootstrap size={55} color="#7952B3" /> },
  { name: "Figma", icon: <FaFigma size={55} color="#6699CC" /> },
];

// Funcionalidades
const features = [
  {
    icon: <FaBookOpen size={40} />,
    title: "Gestão Completa de Acervo",
    description: "Controle total sobre livros com categorização."
  },
  {
    icon: <FaUsers size={40} />,
    title: "Controle de Usuários",
    description: "Cadastro para bibliotecários, professores e alunos."
  },
  {
    icon: <FaChartLine size={40} />,
    title: "Relatórios e Analytics",
    description: "Dados sobre circulação de livros para decisões informadas."
  },
  {
    icon: <FaMobileAlt size={40} />,
    title: "Responsividade Total",
    description: "Interface adaptável a qualquer dispositivo."
  },
  {
    icon: <FaHandsHelping size={40} />,
    title: "Suporte Especializado",
    description: "Equipe disponível para ajudar com dúvidas e necessidades."
  }
];

const galleryImages = [
  { src: img2,},
  { src: img3,},
  { src: img16,},

];


const creativeCarouselImages = [

  {
    src: img21,
  },
  {
    src: img2
  },

];

// Componente About
export default function About() {
  return (
    <Container className="about-container py-5">

      {/* Sobre o sistema */}
      <section className="about-section mb-5">
        <Row className="align-items-center g-4">
          <Col md={6}>
            <h2>Sobre o Bookly</h2>
            <p className="about-text mt-3">
              <strong>O Bookly</strong> nasceu em 2025, na Unoeste, como um projeto integrador com o objetivo de administrar bibliotecas e tornar a leitura mais acessível.
            </p>
            <p className="about-text">
              Nossa plataforma oferece <strong>controle completo</strong> do acervo: empréstimos, reservas, devoluções e renovações com facilidade e segurança.
            </p>

            <h5 className="mt-3">Principais funcionalidades:</h5>
            <ul className="list-unstyled about-text">
              <li> Cadastro completo de livros, autores e editoras</li>
              <li> Sistema de reservas e empréstimos inteligente</li>
              <li> Gestão de usuários (alunos, professores e outros)</li>
              <li> Relatórios e consultas em tempo real</li>
              <li> Controle de prazos e renovações</li>
            </ul>

            <p className="about-text mt-2">
              Com <strong>praticidade, segurança e eficiência</strong>, garantimos a melhor experiência para toda a comunidade.
            </p>
          </Col>

          <Col md={6}>
            <div className="gallery-grid">
              {galleryImages.map((image, index) => (
                <div key={index} className={`gallery-item gallery-item-${index + 1}`}>
                  <img src={image.src} alt={image.alt} />
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </section>

      {/* Recursos */}
      <section className="about-section mb-5 text-center">
        <h3 className="mb-4">Nossos Recursos</h3>
        <Row className="g-4">
          {features.map((feature, i) => (
            <Col key={i} md={6} lg={4}>
              <div className="hover-card feature-item p-3 rounded text-center">
                <div className="feature-icon mb-3">{feature.icon}</div>
                <h5>{feature.title}</h5>
                <p>{feature.description}</p>
              </div>
            </Col>
          ))}
        </Row>
      </section>

      {/* Missão, Visão e Valores */}
      <section className="about-section mb-5 text-center">
        <h3 className="mb-4">Nossa Cultura</h3>
        <Row className="g-4">
          {mvvItems.map((item, i) => (
            <Col key={i} md={4}>
              <div className="hover-card mvv-item p-3 rounded text-center">
                <div className="mvv-icon mb-3">{item.icon}</div>
                <h4>{item.title}</h4>
                <p>{item.text}</p>
              </div>
            </Col>
          ))}
        </Row>
      </section>

      {/* Tecnologias */}
      <section className="about-section text-center mb-5">
        <h3 className="mb-4">Tecnologias Utilizadas</h3>
        <Row className="justify-content-center g-3">
          {technologies.map((tech, i) => (
            <Col key={i} xs={6} sm={4} md={3} lg={2}>
              <div className="tech-item">
                {tech.icon}
                <div className="mt-2">{tech.name}</div>
              </div>
            </Col>
          ))}
        </Row>
      </section>

      {/* Equipe */}
      <section id="equipe" className="about-section text-center mb-5">
        <FaUsers size={60} className="mb-3 text-primary" />
        <h2>Nossa Equipe</h2>
        <p className="mb-4">Conheça os desenvolvedores por trás do Bookly</p>
        <Row className="g-4 mt-4">
          {devs.map((dev, i) => (
            <Col key={i} xs={12} sm={6} md={3}>
              <div className="team-card">
                <img src={dev.photo} alt={dev.name} className="team-photo" />
                <h5>{dev.name}</h5>
              </div>
            </Col>
          ))}
        </Row>
      </section>

      {/* CTA com Carrossel Criativo */}
      <section className="about-section mb-5">
        <Row className="align-items-center journey-section g-4">
          <Col md={6}>
            <h2 className="mb-3">Junte-se à nossa Jornada!</h2>
            <p className="journey-description">
              Transformamos a forma como instituições gerenciam acervos e promovem a leitura. Faça parte desta missão!
            </p>

            <Row className="g-3 mt-3">
              <Col xs={12} sm={6}>
                <div>
                  <h5> Instituições</h5>
                  <p>Modernize sua biblioteca com o Bookly</p>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div className="option-item">
                  <h5>Desenvolvedores</h5>
                  <p>Contribua com nosso projeto open source</p>
                </div>
              </Col>
              <Col xs={12}>
                <div>
                  <h5> Parcerias</h5>
                  <p>Expanda o acesso à leitura e tecnologia</p>
                </div>
              </Col>
            </Row>

            <div className="mt-4 text-center text-md-start">
              <Button variant="primary" size="lg" className="me-3 mb-3" href="mailto:booklysuporte@gmail.com">
                <FaEnvelope className="me-2" /> Entre em Contato
              </Button>
              <Button variant="btn btn-paginacao" size="lg" href="#equipe">Conheça a Equipe</Button>
            </div>
          </Col>

          <Col md={6}>
            <div className="creative-carousel-container">
              <Carousel 
                indicators 
                interval={4000}
                prevIcon={<FaChevronLeft className="carousel-control-icon" />}
                nextIcon={<FaChevronRight className="carousel-control-icon" />}
              >
                {creativeCarouselImages.map((image, index) => (
                  <Carousel.Item key={index}>
                    <div className="creative-carousel-item">
                      <img
                        className="d-block w-100"
                        src={image.src}
                        alt={image.alt}
                      />
                      <Carousel.Caption>
                        <h5>{image.title}</h5>
                        <p>{image.caption}</p>
                      </Carousel.Caption>
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>
          </Col>
        </Row>
      </section>

      {/* CSS local */}
      <style>{`

        /* Títulos com efeito de sublinhado */
        .about-section h2,
        .about-section h3 {
          font-weight: 700;
          margin-bottom: 1rem;
          position: relative;
        }

        .about-section h2::after,
        .about-section h3::after {
          content: "";
          display: block;
          width: 60px;
          height: 4px;
          background-color: #0d6efd;
          margin: 0.5rem auto 0;
          border-radius: 2px;
        }

        /* Texto sobre */
        .about-text {
          max-width: 700px;
          margin: 0 auto;
          font-size: 1.05rem;
          line-height: 1.6;
          color: #555;
        }

        /* Cards de Missão, Visão e Valores */
        .mvv-card {
          border-radius: 15px;
          padding: 2rem;
          height: 100%;
        }

        .mvv-card h4 {
          color: #ff4894;
        }

        .mvv-card p {
          color: #666;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        /* Lista de tecnologias */
        .tech-list {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1rem;
          margin-top: 2rem;
        }

        .tech-item {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          padding: 0.8rem 1rem;
        }

        .tech-item:hover {
          transform: translateY(-4px);
        }

        /* Cards de equipe */
        .team-card {
          padding: 1.5rem 1rem;
          transition: transform 0.3s ease, box-shadow 0.5s ease;
        }

        .team-card:hover {
          transform: translateY(-20px) scale(1.1); 
        }

        /* Avatar da equipe */
        .team-card img {
          width: 120px;
          height: 120px;
          object-fit: cover;
          border-radius: 50%;
          border: 3px solid #0d6efd;
          margin-bottom: 1rem;
          transition: transform 0.1s ease, border-color 0.6s ease;
        }

        .team-card:hover img {
          transform: scale(1.05);
          border-color: #7bff00;
        }

        /* Textos no card de equipe */
        .team-card h5 {
          margin-bottom: 0.3rem;
          font-weight: 600;
        }

        .team-card h6 {
          color: #1DCD9F;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .team-card p {
          font-size: 0.9rem;
          color: #666;
          text-align: center;
        }

        /* Responsividade para a página Sobre */
        @media (max-width: 768px) {

          .mvv-card,
          .team-card,
          .tech-item {
            padding: 1rem;
          }

          .about-text {
            font-size: 1rem;
          }
        }

        .about-container {
          font-family: 'Poppins', sans-serif;
          color: #222;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        /* ====== TEXTOS ====== */
        .about-text {
          font-size: 1rem;
          line-height: 1.7;
          color: #555;
        }

        /* ====== MURAL DE IMAGENS ====== */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: repeat(3, 1fr);
          gap: 12px;
          height: 400px;
        }

        .gallery-item {
          border-radius: 8px;
          overflow: hidden;
          transition: transform 0.3s ease;
        }

        .gallery-item:hover {
          transform: scale(1.03);
        }

        .gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          border-radius: 8px;


        }

        /* ====== EQUIPE ====== */
        .team-card {
          text-align: center;
        }

        .team-photo {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          padding: 5px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
        }

        /* ====== FEATURES, MVV, TECNOLOGIAS, OPÇÕES ====== */
        .feature-item,
        .mvv-item,
        .tech-item {
          border-radius: 12px;
          padding: 1rem;
        }

        /* animação ícones */
        .feature-item .feature-icon,
        .mvv-item .mvv-icon {
          transition: transform 0.3s ease, color 0.3s ease;
        }

        .feature-item:hover .feature-icon,
        .mvv-item:hover .mvv-icon {
          transform: scale(1.2);
          color: rgba(105, 105, 105, 0.33);
        }

        /* ====== ICONES ====== */
        .feature-icon,
        .mvv-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: rgba(0, 0, 0, 0.94);
        }

        /* ====== TECNOLOGIAS ====== */
        .tech-item {
          text-align: center;
          }

        .tech-item div {
          margin-top: 0.5rem;
        }

        .tech-item:hover {
          transform: scale(1.10);
        }

        /* ====== CARROSSEL CRIATIVO ====== */
        .creative-carousel-container {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          transition: transform 0.3s ease;
        }

        .creative-carousel-container:hover {
          transform: translateY(-5px);
        }

        .creative-carousel-item {
          position: relative;
          height: 350px;
          overflow: hidden;
        }

        .creative-carousel-item img {
          object-fit: cover;
          height: 100%;
          width: 100%;
          filter: brightness(0.7);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          border-radius: 8px;
        }

        .carousel-control-icon {
          font-size: 1.5rem;
          color: #fff;
          background: rgba(0, 0, 0, 0.3);
          padding: 10px;
          border-radius: 50%;
        }

        .carousel-caption {
          background: rgba(0, 0, 0, 0.5);
          border-radius: 8px;
          padding: 15px;
          max-width: 80%;
          margin: 0 auto;
        }

        .carousel-caption h5 {
          font-weight: 600;
          margin-bottom: 5px;
        }

        /* ====== RESPONSIVO ====== */
        @media (min-width: 768px) {
          .gallery-grid {
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: repeat(2, 1fr);
            height: 300px;
          }
          
          .creative-carousel-item {
            height: 400px;
          }
        }

        @media (max-width: 767px) {
          .creative-carousel-container {
            margin-top: 2rem;
          }
        }
      `}</style>
    </Container>
  );
}