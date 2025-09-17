import { Container, Row, Col, Button } from "react-bootstrap";
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
  FaHandshake,
  FaBootstrap,
  FaFigma
} from "react-icons/fa";

import photoEmanuel from "../images/emanuel.jpg";
import photoMaria from "../images/maria.jpg";
import photoDaniel from "../images/daniel.jpg";
import photoRodrigo from "../images/rodrigo.jpg";

const devs = [
  {
    name: "Emanuel Nepomuceno Nagima",
    photo: photoEmanuel,
   

  },
  {
    name: "Daniel Pereira Viana de Sena",
    photo: photoDaniel,
    

  },
  {
    name: "Rodrigo Brasil Rodrigues",
    photo: photoRodrigo,
    
  },
  {
    name: "Maria Clara Garcia de Oliveira",
    photo: photoMaria,
    
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
  { name: "Git", icon: <FaGithub size={55} color="#171515" /> },
  { name: "Bootstrap", icon: <FaBootstrap size={55} color="#0000FF" /> },
  { name: "Figma", icon: <FaFigma size={55} color="#6699CC" /> },

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

      {/* Sobre o sistema com imagem */}
      <section className="about-section mb-5">
        <Row className="align-items-center">
          <Col md={6}>
            <h2>Sobre o Bibliotecando</h2>
            <p className="about-text mt-3">O <strong>Bibliotecando</strong> nasceu em 2025 como projeto acadêmico na UNOESTE,
              após identificar as necessidades
              de bibliotecas locais em instituições.
            </p>
            <p className="about-text">
        Nossa solução oferece <strong>controle integrado</strong> de todo o acervo bibliográfico, 
        incluindo empréstimos, reservas, devoluções e renovações, tudo vinculado 
        digitalmente para maior eficiência e organização.
      </p>
      
      <div className="about-text mt-1">
        <h5>Principais funcionalidades:</h5>
        <ul className="list-unstyled">
          <li>✓ Cadastro completo de livros, autores e editoras</li>
          <li>✓ Sistema de reservas inteligente </li>
          <li>✓ Controle de empréstimos e renovações</li>
          <li>✓ Gestão de usuários (alunos, professores e outros tipos)</li>
          <li>✓ Relatórios e consultas em tempo real</li>
          <li>✓ Controle de prazos </li>
        </ul>
      </div>
      
      <p className="about-text">
        Desenvolvido para garantir <strong>segurança, praticidade e eficiência</strong>, 
        o Bibliotecando assegura que toda a comunidade escolar e instituições tenham a melhor 
        experiência com os serviços da biblioteca.
      </p>
          </Col>
          <Col md={6} className="text-center">
            <img 
              src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80" 
              alt="Biblioteca" 
              className="img-fluid rounded shadow"
              style={{ maxHeight: '300px', width: '100%', objectFit: 'cover' }}
            />
          </Col>
        </Row>
      </section>

      {/* Recursos */}
      <section className="about-section mb-5">
        <h3 className="text-center mb-4">Nossos Recursos</h3>
        <Row className="g-4">
          {features.map((feature, i) => (
            <Col key={i} md={6} lg={4}>
              <div className="feature-card p-4 h-100 text-center">
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
      <section className="about-section mb-5">
        <h3 className="text-center mb-4">Nossa Cultura</h3>
        <Row className="g-4">
          {mvvItems.map((item, i) => (
            <Col key={i} md={4}>
              <div className="mvv-card p-4 h-100 text-center">
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
      <section className="about-section text-center mb-5">
        <h3 className="mb-4">Tecnologias Utilizadas</h3>
        <Row className="justify-content-center">
          {technologies.map((tech, i) => (
            <Col key={i} xs={6} sm={4} md={3} lg={2} className="mb-4">
              <div className="tech-item p-3">
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
        <p className="mb-4">Conheça os desenvolvedores por trás do Bibliotecando</p>
        <Row className="g-4 mt-4">
          {devs.map((dev, i) => (
            <Col key={i} xs={12} sm={6} md={3}>
              <div className="team-card p-4 h-100">
                <img
                  src={dev.photo}
                  alt={`Foto de ${dev.name}`}
                  className="rounded-circle mb-3 img-thumbnail"
                  style={{ width: 120, height: 120, objectFit: "cover" }}
                />
                <h5>{dev.name}</h5>

              </div>
            </Col>
          ))}
        </Row>
      </section>

      {/* Seção CTA - */}
      <section className="about-section mb-5">
        <Row className="align-items-center journey-section rounded p-4 p-md-5">
          <Col md={6} className="journey-content">
            <div className="journey-text">
              <FaHandshake size={40} className="journey-icon mb-3 text-primary" />
              <h2 className="mb-4">Faça Parte Desta Jornada!</h2>
              <p className="journey-description">
                O Bibliotecando está transformando a forma como instituições educacionais 
                gerenciam seus acervos e promovem a leitura. Junte-se a nós nessa missão!
              </p>
              
              <div className="journey-options mt-4">
                <div className="option-item mb-3 p-3 rounded">
                  <h5> Para Instituições</h5>
                  <p className="mb-0">Implemente o Bibliotecando em sua biblioteca e modernize sua gestão</p>
                </div>
                
                <div className="option-item mb-3 p-3 rounded">
                  <h5> Para Desenvolvedores</h5>
                  <p className="mb-0">Contribua com nosso projeto open source e faça parte da comunidade</p>
                </div>
                
                <div className="option-item p-3 rounded">
                  <h5> Parcerias</h5>
                  <p className="mb-0">Vamos colaborar para expandir o acesso à leitura e tecnologia</p>
                </div>
              </div>
              
              <div className="journey-cta mt-4">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="me-3 mb-3"
                  href="mailto:bibliotecandosuporte@gmail.com"
                >
                  <FaEnvelope className="me-2" />
                  Entre em Contato
                </Button>
                <Button 
                  variant="paginacao" 
                  size="lg"
                  href="#equipe"
                >
                  Conheça Nossa Equipe
                </Button>
              </div>
            </div>
          </Col>
          
          <Col md={6} className="journey-image text-center">
            <img 
  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=700&q=80" 
  alt="Pessoas colaborando em projeto" 
  className="img-fluid rounded shadow"
style={{ width: '100%', height: 'auto', marginTop: '10px' }}
/>
          </Col>
        </Row>
      </section>
    </Container>
  );
}