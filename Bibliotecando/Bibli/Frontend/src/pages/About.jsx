import { Container, Row, Col } from "react-bootstrap";
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
  
} from "react-icons/fa";

import photoEmanuel from "../images/emanuel.jpg";
import photoMaria from "../images/maria.jpg";
import photoDaniel from "../images/daniel.jpg";
import photoRodrigo from "../images/rodrigo.jpg";

const devs = [
  {
    name: "Emanuel Nepomuceno Nagima",
    role: "Estudante de ADS - UNOESTE | Desenvolvedor Júnior",
    photo: photoEmanuel,
    bio: [
      "Experiência como Dev Júnior em projetos reais",
      "Foco em Frontend e experiência do usuário",
      "Estudante de Análise e Desenvolvimento de Sistemas"
    ],
  },
  {
    name: "Daniel Pereira Viana de Sena",
    role: "Estudante de ADS - UNOESTE",
    photo: photoDaniel,
    bio: [
      "Interesse em Backend e APIs REST",
      "Explorando arquitetura de sistemas escaláveis",
      "Estudante de Análise e Desenvolvimento de Sistemas "
    ],
  },
  {
    name: "Rodrigo Brasil Rodrigues",
    role: "Estudante de ADS - UNOESTE",
    photo: photoRodrigo,
    bio: [
      "Explorando DevOps e infraestrutura",
      "Interesse em automação de processos",
      "Estudante de Análise e Desenvolvimento de Sistemas"
    ],
  },
  {
    name: "Maria Clara Garcia de Oliveira",
    role: "Estudante de ADS - UNOESTE",
    photo: photoMaria,
    bio: [
      "Foco em UX/UI design",
      "Criação de interfaces modernas e acessíveis",
      "Estudante de Análise e Desenvolvimento de Sistemas "
    ],
  },
];

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
    text: "Inovação, transparência, acessibilidade e compromisso com a comunidade acadêmica e leitores.",
    icon: <FaHeart size={30} className="text-primary" />
  }
];

const technologies = [
  { name: "HTML5", icon: <FaHtml5 size={55} color="#E44D26" /> },
  { name: "CSS3", icon: <FaCss3Alt size={55} color="#264DE4" /> },
  { name: "JavaScript", icon: <FaJsSquare size={55} color="#F0DB4F" /> },
  { name: "React", icon: <FaReact size={55} color="#61DBFB" /> },
  { name: "Node.js", icon: <FaNodeJs size={55} color="#68A063" /> },
  { name: "MySQL", icon: <FaDatabase size={55} color="#336791" /> },
  { name: "Git", icon: <FaGithub size={55} color="#F1502F" /> },
];

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
    description: "Dados sobre circulação de livros e tomada de decisão informada."
  },
  {
    icon: <FaMobileAlt size={40} />,
    title: "Responsividade Total",
    description: "Interface adaptável a qualquer dispositivo, desde computadores até tablets e smartphones."
  },
  {
    icon: <FaHandsHelping size={40} />,
    title: "Suporte e Ajuda",
    description: "Equipe especializada disponível para ajudar com qualquer dúvida ou necessidade técnica."
  }
];

export default function About() {
  return (
    <Container className="about-container py-5">

      {/* Sobre o sistema */}
      <section className="about-section text-center">
        <h2>Sobre o Bibliotecando</h2>
        <p className="about-text mt-3">O <strong>Bibliotecando</strong> nasceu em 2025 como projeto acadêmico na UNOESTE,
          evoluindo para uma solução real após identificar as necessidades
          de bibliotecas locais em instituições.
          O Bibliotecando é uma solução moderna para gestão de bibliotecas,
          simplificando o controle de acervo e usuários. Nosso foco é a eficiência,
          segurança e facilidade de uso para bibliotecários, reunindo as principais funcionalidades em uma única aplicação.

        </p>
      </section>

      {/* Recursos */}
      <section className="about-section mb-5">
        <h3 className="text-center mb-4">Nossos Recursos</h3>
        <Row className="g-4">
          {features.map((feature, i) => (
            <Col key={i} md={6} lg={4}>
              <div className="feature-card p-4 h-100">
                <div className="feature-icon mb-3">
                  {feature.icon}
                </div>
                <h5>{feature.title}</h5>
                <p>{feature.description}</p>
              </div>
            </Col>
          ))}
        </Row>
      </section>

      {/* Missão, Visão e Valores */}
      <section className="about-section text-center">
          <h3 className="text-center mb-4">Futuro</h3>
        <Row className="g-4">
          {mvvItems.map((item, i) => (
            <Col key={i} md={4}>
              <div className="mvv-card p-4 h-100">
                <div className="mvv-icon mb-3">
                  {item.icon}
                </div>
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
                <ul className="text-muted small text-start" style={{ paddingLeft: "1rem" }}>
                  {dev.bio.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </Col>
          ))}
        </Row>
      </section>

      {/* CTA */}
      <section className="about-section text-center">
        <div className="about-cta p-4 rounded">
          <h3 className="mb-3">Faça parte dessa jornada!</h3>
          <p className="mb-3">
            Quer implementar o Bibliotecando em sua instituição ou contribuir com o projeto?
          </p>
          <p>
            Entre em contato pelo e-mail <a href="#">bibliotecandosuporte@gmail.com</a>
          </p>
          <p className="mt-3 small">
            Estamos abertos a parcerias com desenvolvedores e instituições de ensino.
          </p>
        </div>
      </section>
    </Container>
  );
}
