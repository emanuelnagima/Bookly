import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, InputGroup, Form, Button, Image, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
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
  FaChartBar,
  FaInfoCircle,
  FaEnvelope,
  FaBriefcase
} from 'react-icons/fa'
import livroService from '../services/livroService'

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
    const fetchLivros = async () => {
      try {
        const data = await livroService.getAll()
        setLivros(data)
      } catch (error) {
        console.error('Erro ao carregar livros:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchLivros()
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
          <div className="d-flex align-items-center justify-content-between p-4 rounded">
            <div>
              <h1 className="h4 fw-bold text-primary mb-1">
                <FaBookOpen className="me-2" /> BiBliotecando
              </h1>
              <p className="text-muted mb-0">Sua plataforma completa de gestão bibliotecária</p>
            </div>
            <div className="text-end">
              {showWelcome && <h3 className="mb-1 fw-bold text-primary">Seja bem-vindo!</h3>}
              <p className="text-muted mb-0">
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
                              style={{ border: '1px solid #dee2e6', borderRadius: '16px' }}
                            >
                           <div className="d-flex flex-column p-3 h-100">
                              <Icone size={43} className="mb-2 text-primary mx-auto" />
                              <Card.Title className="h4 mb-1">{card.titulo}</Card.Title>
                              <div className="text-muted flex-grow-1">
                                  <p style={{ fontSize: "12px" }}>{card.descricao}</p>
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
                <a href="mailto:bibliotecandosuporte@gmail.com" className="contact-link">bibliotecandosuporte@gmail.com</a>
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
