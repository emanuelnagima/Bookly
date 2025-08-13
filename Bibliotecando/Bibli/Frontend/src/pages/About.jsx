import { Container, Row, Col } from "react-bootstrap";
import {
  FaBookOpen,
  FaUsers,
  FaReact,
  FaNodeJs,
  FaDatabase,
  FaHtml5,
  FaCss3Alt,
  FaJsSquare
} from "react-icons/fa";

const devs = [
  {
    name: "Daniel Pereira Viana de Sena",
    role: "Desenvolvedor Backend",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "Especialista em APIs REST e arquitetura robusta para sistemas escaláveis.",
  },
  {
    name: "Emanuel Nepomuceno Nagima",
    role: "Desenvolvedor Frontend",
    photo: "https://randomuser.me/api/portraits/men/45.jpg",
    bio: "Focado em interfaces intuitivas, responsivas e experiências fluidas para o usuário.",
  },
  {
    name: "Rodrigo Brasil Rodrigues",
    role: "DevOps / Infraestrutura",
    photo: "https://randomuser.me/api/portraits/men/68.jpg",
    bio: "Cuida da infraestrutura e automatização para garantir estabilidade e deploys rápidos.",
  },
  {
    name: "Maria Clara Garcia",
    role: "UX/UI Designer",
    photo: "https://randomuser.me/api/portraits/women/65.jpg",
    bio: "Design centrado no usuário, criando layouts modernos e acessíveis para todos.",
  },
];

const technologies = [
  { name: "HTML5", icon: <FaHtml5 size={28} color="#E44D26" /> },
  { name: "CSS3", icon: <FaCss3Alt size={28} color="#264DE4" /> },
  { name: "JavaScript", icon: <FaJsSquare size={28} color="#F0DB4F" /> },
  { name: "React", icon: <FaReact size={28} color="#61DBFB" /> },
  { name: "Node.js", icon: <FaNodeJs size={28} color="#68A063" /> },
  { name: "Banco de Dados", icon: <FaDatabase size={28} color="#336791" /> },
];

export default function About() {
  return (
    <Container className="about-container py-5">
      
      {/* Sobre o sistema */}
      <section className="about-section text-center">
        <FaBookOpen size={60} className="mb-3 text-primary" />
        <h2>Sobre o Bibliotecando</h2>
        <p className="about-text mt-3">
          O <strong>Bibliotecando</strong> é uma solução moderna para gestão de bibliotecas,
          simplificando o controle de acervo e usuários. Nosso foco é a eficiência,
          segurança e facilidade de uso para bibliotecários, professores e leitores.
        </p>
      </section>

      {/* Missão, Visão e Valores */}
      <section className="about-section text-center">
        <Row className="g-4">
          {[
            { title: "Missão", text: "Facilitar o acesso à informação através de uma plataforma simples e eficiente, promovendo o hábito da leitura." },
            { title: "Visão", text: "Ser referência em soluções digitais para bibliotecas, contribuindo para o desenvolvimento educacional e cultural." },
            { title: "Valores", text: "Inovação, transparência, acessibilidade e compromisso com a comunidade acadêmica e leitores." },
          ].map((item, i) => (
            <Col key={i} md={4}>
              <div className="mvv-card">
                <h4>{item.title}</h4>
                <p>{item.text}</p>
              </div>
            </Col>
          ))}
        </Row>
      </section>

      {/* Tecnologias */}
      <section className="about-section text-center">
        <h3>Tecnologias Utilizadas</h3>
        <div className="tech-list mt-4">
          {technologies.map((tech, i) => (
            <div key={i} className="tech-item">
              {tech.icon}
              <span>{tech.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Equipe */}
      <section className="about-section text-center">
        <FaUsers size={60} className="mb-3 text-primary" />
        <h2>Nossa Equipe</h2>
        <Row className="g-4 mt-4">
          {devs.map((dev, i) => (
            <Col key={i} xs={12} sm={6} md={3}>
              <div className="team-card h-100">
                <img
                  src={dev.photo}
                  alt={`Foto de ${dev.name}`}
                  className="rounded-circle mb-3"
                  style={{ width: 120, height: 120, objectFit: "cover" }}
                />
                <h5>{dev.name}</h5>
                <h6>{dev.role}</h6>
                <p className="text-muted small">{dev.bio}</p>
              </div>
            </Col>
          ))}
        </Row>
      </section>

      {/* Call to Action */}
      <section className="about-section">
        <div className="about-cta">
          <h4>Quer saber mais ou contribuir com o projeto?</h4>
          <p>
            Entre em contato pelo e-mail{" "}
            <a href="mailto:suportebibli@gmail.com">suportebibli@gmail.com</a>
          </p>
        </div>
      </section>
    </Container>
  );
}
