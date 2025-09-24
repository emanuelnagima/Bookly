import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, InputGroup, Form, Button, Image, Modal, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'
import entradaSaidaService from '../services/entradaSaidaService'

import {
  FaBookOpen,
  FaCalendarAlt,
  FaSearch,
  FaImage,
  FaChevronLeft,
  FaChevronRight,
  FaUserTie,
  FaUserCircle,
  FaUserGraduate,
  FaBook,
  FaPenFancy,
  FaBuilding,
  FaDoorOpen,
  FaSignOutAlt,
  FaHandshake,
  FaSyncAlt,
  FaReply,
  FaBox,
  FaChartBar,
  FaInfoCircle,
  FaEnvelope,
  FaBriefcase,
  FaUsers,
  FaChalkboardTeacher,
  FaGraduationCap,
  FaFeatherAlt,
  FaUniversity
} from 'react-icons/fa'
import livroService from '../services/livroService'
import professorService from '../services/professorService'
import alunoService from '../services/alunoService'
import autorService from '../services/autorService'
import editoraService from '../services/editoraService'
import usuarioEspecialService from "../services/usuarioEspecialService";
// Função utilitária para formatar texto
const formatarTexto = (texto = '') =>
  texto
    .toLowerCase()
    .split(' ')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ')

const ITENS_POR_PAGINA = 4

const Home = () => {
  const [currentDate, setCurrentDate] = useState('')
  const [showWelcome, setShowWelcome] = useState(true)
  const [livros, setLivros] = useState([])
  const [professores, setProfessores] = useState([])
  const [alunos, setAlunos] = useState([])
  const [autores, setAutores] = useState([])
  const [estoqueTotal, setEstoqueTotal] = useState(0)
  const [editoras, setEditoras] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [termoBusca, setTermoBusca] = useState('')
  const [loading, setLoading] = useState(true)
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [isButtonActive, setIsButtonActive] = useState(false)

  useEffect(() => {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    setCurrentDate(new Date().toLocaleDateString('pt-BR', options))
    const timer = setTimeout(() => setShowWelcome(false), 10000)
    return () => clearTimeout(timer)
  }, [])
    
useEffect(() => {
  const fetchTodosDados = async () => {
    try {
      const [
        livrosData, 
        professoresData, 
        alunosData, 
        autoresData, 
        editorasData,
        usuariosData
      ] = await Promise.all([
        livroService.getAll(),
        professorService.getAll(),
        alunoService.getAll(),
        autorService.getAll(),
        editoraService.getAll(),
        usuarioEspecialService.getAll()
      ])

      // calcula estoque total
      const livrosComEstoque = await Promise.all(
        livrosData.map(async livro => {
          try {
            const estoque = await entradaSaidaService.verificarEstoque(livro.id)
            return { ...livro, estoque: estoque ?? 0 }
          } catch {
            return { ...livro, estoque: 0 }
          }
        })
      )

      setLivros(livrosComEstoque)
      setProfessores(professoresData)
      setAlunos(alunosData)
      setAutores(autoresData)
      setEditoras(editorasData)
      setUsuarios(usuariosData.data || usuariosData)

      // soma de todos os estoques
      const total = livrosComEstoque.reduce((acc, l) => acc + (l.estoque || 0), 0)
      setEstoqueTotal(total)

    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  fetchTodosDados()
}, [])

  useEffect(() => setPaginaAtual(1), [termoBusca])

  const livrosFiltrados = livros.filter(livro => {
  const termo = termoBusca.toLowerCase()
  return (
    (livro.titulo || livro.title || '').toLowerCase().includes(termo) ||
    (livro.autor_nome || livro.author || '').toLowerCase().includes(termo) ||
    (livro.editora_nome || livro.publisher || '').toLowerCase().includes(termo) ||
    (livro.isbn || '').toString().toLowerCase().includes(termo) ||
    (livro.genero || livro.genre || '').toLowerCase().includes(termo) ||
    (livro.ano_publicacao || livro.year || '').toString().includes(termo)
  )
})


  const totalPaginas = Math.ceil(livrosFiltrados.length / ITENS_POR_PAGINA)

  const livrosPaginaAtual = [...livrosFiltrados]
    .sort((a, b) =>
      formatarTexto(a.titulo || a.title || '').localeCompare(formatarTexto(b.titulo || b.title || ''))
    )
    .slice((paginaAtual - 1) * ITENS_POR_PAGINA, paginaAtual * ITENS_POR_PAGINA)

  const handlePaginaAnterior = () => setPaginaAtual(p => Math.max(p - 1, 1))
  const handleProximaPagina = () => setPaginaAtual(p => Math.min(p + 1, totalPaginas))

  const handleHelpClick = () => {
    setIsButtonActive(true)
    setTimeout(() => setIsButtonActive(false), 200)
    setShowHelpModal(true)
  }
  const handleCloseHelpModal = () => setShowHelpModal(false)
    
  const estatisticas = [
    { 
      titulo: "Livros", 
      valor: livros.length, 
      icone: FaBookOpen, 
      cor: "#4e54c8", // azul moderno
      descricao: "Acervo Cadastrado"
    },

    { 
      titulo: "Estoque Total", 
      valor: estoqueTotal, 
      icone: FaBox, 
      cor: "#ff6b7fff", // vermelho suave
      descricao: "Livros disponíveis em estoque"
    },

    { 
      titulo: "Usuários", 
      valor: usuarios.length, 
      icone: FaUsers, 
      cor: "#1ae36eff", // verde
      descricao: "Usuários cadastrados"
    },

    { 
      titulo: "Professores", 
      valor: professores.length, 
      icone: FaChalkboardTeacher, 
      cor: "#000000ff", // azul claro
      descricao: "Professores cadastrados"
    },

    { 
      titulo: "Alunos", 
      valor: alunos.length, 
      icone: FaGraduationCap, 
      cor: "#f1c40f", // amarelo
      descricao: "Alunos cadastrados"
    },

    { 
      titulo: "Autores", 
      valor: autores.length, 
      icone: FaFeatherAlt, 
      cor: "#e62222ff", // laranja
      descricao: "Autores cadastrados"
    },

    { 
      titulo: "Editoras", 
      valor: editoras.length, 
      icone: FaUniversity, 
      cor: "#9b59b6", // roxo
      descricao: "Editoras cadastradas"
    }
  ]

  const categoriasCards = [
    {
      titulo: "Gestão de Pessoas",
      cards: [
        { icone: FaUserTie, titulo: "Professores", descricao: "Cadastre e atualize informações de professores", link: "/professores" },
        { icone: FaUserCircle, titulo: "Usuários", descricao: "Cadastre e gerencie outros tipos de usuários ", link: "/usuarios-especiais" },
        { icone: FaUserGraduate, titulo: "Alunos", descricao: "Cadastre e acompanhe os alunos da turma", link: "/alunos" },
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
  ]

  return (
    <Container className="py-4">
      {/* CABEÇALHO */}
     <Row className="mb-4">
        <Col>
          <div
            className="d-flex align-items-center justify-content-between p-4 rounded"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {/* Logo SVG */}
              
                
              

              {/* Texto estilo logo */}
              <div>
                <h1 style={{
              fontFamily: '"Montserrat", sans-serif',
              fontWeight: '600',
              fontSize: '3.8rem',
              color: '#000000ff', 
              marginBottom: '0.2rem',
              letterSpacing: '-8.5px',
              marginLeft:'-1.2rem'
            }}> {/* nome */}
              Bookly
                </h1>
                <p
                  className="text-muted mb-0"
                  style={{ fontSize: '0.95rem', marginTop: '-5px', marginLeft: '-1.1rem' }}
                >
                  Sua plataforma completa de gestão bibliotecária
                </p>
              </div>
            </div>

            {/*  boas-vindas e data */}
            <div className="text-end">
              {showWelcome && (
                <h3 className="mb-3 fw-bold text-primary">Seja bem-vindo!</h3>
              )}
              <p className="text-muted mb-5">
                <FaCalendarAlt className="me-1" /> {currentDate}
              </p>
            </div>
          </div>
        </Col>
      </Row>

      {/* LISTA DE LIVROS COM BARRA DE PESQUISA */}
      <Row className="mb-4">
        <Col>
          <Card>
           <Card.Header className="bg-primary text-white d-flex flex-column flex-md-row justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-2 mb-2 mb-md-0">
                <h5 className="mb-0">Acervo de Livros</h5>
                <span className="badge bg-light text-primary">
                  {livrosFiltrados.length} {livrosFiltrados.length === 1 ? 'livro' : 'livros'} / Página {paginaAtual} de {totalPaginas || 1}
                </span>
              </div>
              <div className="mt-2 mt-md-0 flex-grow-1" style={{ minWidth: '300px', maxWidth: '600px' }}>
                <InputGroup>
                  <InputGroup.Text className="bg-light text-primary">
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Pesquise por título, autor, editora ou ISBN..."
                    value={termoBusca}
                    onChange={e => setTermoBusca(e.target.value)}
                  />
                </InputGroup>
              </div>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <p className="text-center text-muted">Carregando livros...</p>
              ) : livrosPaginaAtual.length === 0 ? (
                <p className="text-center text-muted">{termoBusca ? 'Nenhum livro encontrado' : 'Nenhum livro cadastrado'}</p>
              ) : (
                <Row>
                  {livrosPaginaAtual.map(livro => (
                    <Col key={livro.id} md={6} lg={4} xl={3} className="mb-4">
                      <Card className="h-100 livro-card">
                        <div className="p-3 text-center">
                          {livro.imagem ? (
                            <Image
                              src={`http://localhost:3000${livro.imagem}`}
                              alt={livro.titulo || livro.title || ''}
                              className="livro-imagem"
                              onError={e => { e.target.style.display = 'none' }}
                            />
                          ) : ( 
                            <div className="sem-imagem">
                              <FaImage size={24} />
                            </div>
                          )}
                        </div>
                        <Card.Body className="livro-card-body">
                          <h6 title={livro.titulo || livro.title || ''}>
                            {formatarTexto(livro.titulo || livro.title || '')}
                          </h6>
                          <div className="livro-detalhes">
                            <div><strong>ID:</strong> {livro.id}</div>
                            <div><strong>Autor:</strong> {formatarTexto(livro.autor_nome || livro.author || '')}</div>
                            <div><strong>Editora:</strong> {formatarTexto(livro.editora_nome || livro.publisher || '')}</div>

                            <div><strong>Gênero:</strong> {formatarTexto(livro.genero || livro.genre || '')}</div>
                            {livro.isbn && <div><strong>ISBN:</strong> {livro.isbn}</div>}
                            <div><strong>Ano:</strong> {livro.ano_publicacao || livro.year || ''}</div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}

              {/* PAGINAÇÃO */}
                  {totalPaginas > 1 && (
                    <div className="d-flex justify-content-center justify-content-md-end align-items-center mt-3 gap-2 flex-wrap">
                      <Button
                        className="btn-paginacao"
                        onClick={handlePaginaAnterior}
                        disabled={paginaAtual === 1}
                      >
                        <FaChevronLeft className="me-1" /> Anterior
                      </Button>
                      <Button
                        className="btn-paginacao"
                        onClick={handleProximaPagina}
                        disabled={paginaAtual === totalPaginas}
                      >
                        Próxima <FaChevronRight className="ms-1" />
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>


            <Row className="mb-4">
              <Col>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="mb-0">Estatísticas do Sistema</h4>
                  <Badge bg="light" text="dark" className="fs-6 p-2">
                    Atualizado em tempo real
                  </Badge>
                </div>

                 <Row className="g-0">
                    {estatisticas.map((estatistica, index) => (
                      <Col xs={12} sm={6} md={4} lg={3} key={index}>
                        <div
                          className="estatistica-card text-center h-100"
                          style={{
                            padding: '1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          {/* Valor */}
                          <h3 className="fw-bold" style={{ color: estatistica.cor }}>
                            {estatistica.valor}
                          </h3>

                          {/* Título e descrição */}
                          <h6 className="mb-1">{estatistica.titulo}</h6>
                          <small className="text-muted">{estatistica.descricao}</small>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Col>
              </Row>


             {/* CARDS DE FUNCIONALIDADES */}
            {categoriasCards.map((categoria, index) => (
              <div key={index} className="mb-4">
                <h5 className="mb-3 text-primary">{categoria.titulo}</h5>
                <Row className="g-3">
                  {categoria.cards.map((card, i) => {
                    const Icone = card.icone
                    return (
                      <Col md={6} lg={4} xl={3} key={i}>
                        <Card 
                          className="h-100 text-center card-funcionalidade" 
                          style={{ border: '1px solid rgba(171, 171, 171, 1)', borderRadius: '16px', overflow: 'visible' }} 
                        >
                          <div className="d-flex flex-column p-3 h-100">
                            {/* Ícone clicável com tooltip */}
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip id={`tooltip-${i}`}>Gerenciar {card.titulo}</Tooltip>}
                            >
                              <Link 
                                to={card.link} 
                                className="mb-2 mx-auto icone-dinamico" 
                                style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}
                              > {/* tamanhos dos icones */}
                                <Icone size={26} />
                              </Link>
                            </OverlayTrigger>
                            {/* titulo e descrição  */}
                            <Card.Title className="h4 mb-1">{card.titulo}</Card.Title>
                            <div className="text-muted flex-grow-1">
                              <p style={{ fontSize: "12px", color:'#454545' }}>{card.descricao}</p>
                              <hr className="my-2" />
                            </div>

                            <Link to={card.link} className="btn btn-primary mt-2">
                              Acessar
                            </Link>
                          </div>
                        </Card>
                      </Col>
                    )
                  })}
                </Row>
              </div>
            ))}

      {/* BOTÃO DE AJUDA */}
      <div className="help-button-container">
        <button className={`help-button ${isButtonActive ? 'active' : ''}`} onClick={handleHelpClick} aria-label="Botão de ajuda" title="Ajuda">
          <FaEnvelope size={18} className="icon" />
          <span className="pulse-effect"></span>
        </button>
      </div>

      <Modal show={showHelpModal} onHide={handleCloseHelpModal} centered className="help-modal">
        <Modal.Header closeButton className="modal-header-help">
          <Modal.Title className="text-white"><FaInfoCircle className="me-2" />Precisa de ajuda?</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-help">
          <div className="contact-options">
            <div className="contact-method">
              <div className="method-icon email-icon"><FaEnvelope size={32} /></div>
              <div className="method-info">
                <h5>E-mail de suporte</h5>
                <a href="mailto:booklysuporte@gmail.com" className="contact-link">booklysuporte@gmail.com</a>
              </div>
            </div>
            <div className="contact-method">
              <div className="method-icon hours-icon"><FaBriefcase size={32} /></div>
              <div className="method-info">
                <h5>Horário de atendimento</h5>
                <p>Segunda a sexta, das 8h às 18h</p>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="modal-footer-help">
          <Button variant="light" onClick={handleCloseHelpModal} className="btn-paginacao">Fechar</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default Home
