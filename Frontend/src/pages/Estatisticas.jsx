import { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Badge,
  Spinner,
  Container,
  Button,
} from 'react-bootstrap';
import {
  FaChartBar,
  FaSyncAlt,
  FaClock,
  FaUserTie,
  FaBox ,
  FaBook ,
  FaGraduationCap,
  FaUsers,
  FaBuilding,
  FaExclamationTriangle,
  FaUserEdit,
} from 'react-icons/fa';
import relatoriosService from '../services/relatoriosService';
import { BsCheckCircle } from 'react-icons/bs'; // Adicione esta linha

const Estatisticas = () => {
  const [estatisticasGerais, setEstatisticasGerais] = useState({});
  const [loadingEstatisticas, setLoadingEstatisticas] = useState(false);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState(null);

  useEffect(() => {
    document.title = "Bookly - Dashboard e Estatísticas";
  }, []);

  // Buscar estatísticas gerais
  const carregarEstatisticas = async () => {
    try {
      setLoadingEstatisticas(true);
      const response = await relatoriosService.getEstatisticasGerais();

      if (response.success) {
        setEstatisticasGerais(response.data || {});
        setUltimaAtualizacao(new Date());
      } else {
        console.error('Erro na resposta das estatísticas:', response.message);
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas gerais:', error);
      setEstatisticasGerais({});
    } finally {
      setLoadingEstatisticas(false);
    }
  };

  useEffect(() => {
    carregarEstatisticas();
  }, []);

  // Atualizar estatísticas manualmente
  const atualizarEstatisticas = async () => {
    await carregarEstatisticas();
  };

  const stats = estatisticasGerais;

  const renderEstatisticasGerais = () => {
    if (loadingEstatisticas) {
      return (
        <div className="mb-4 text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted mb-0">Carregando estatísticas do sistema...</p>
        </div>
      );
    }

    if (Object.keys(estatisticasGerais).length === 0) {
      return (
        <div className="mb-4 text-center py-5">
          <p className="text-muted">Nenhuma estatística disponível no momento.</p>
          <Button variant="primary" onClick={atualizarEstatisticas}>
            <FaSyncAlt className="me-2" />
            Carregar Estatísticas
          </Button>
        </div>
      );
    }

    return (
      <div className="mb-4">
        {/* Título com ícone e botão de atualizar */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <FaChartBar className="text-primary me-2 fs-4" />
            <h4 className="text-dark mb-0 fw-bold">Dashboard do Sistema</h4>
          </div>
          <Button 
            variant="success" 
            size="sm" 
            onClick={atualizarEstatisticas}
            disabled={loadingEstatisticas}
          >
            <FaSyncAlt className={loadingEstatisticas ? "me-2 spin" : "me-2"} />
            {loadingEstatisticas ? 'Atualizando...' : 'Atualizar'}
          </Button>
        </div>

        <Row>
          {/* CARD 1: LIVROS*/}
      <Col md={6} lg={4} className="mb-4">
          <Card>
            <Card.Header className="bg-primary text-white d-flex align-items-center">
              <h6 className="mb-0">Livros - Situação Completa</h6>
            </Card.Header>
            <Card.Body className="p-3">
              <div className="d-flex flex-column gap-2">
                {/* Total de títulos cadastrados */}
                <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                  <span className="text-muted">Títulos Cadastrados</span>
                  <span className="fw-bold text-primary fs-5">{stats.total_livros || 0}</span>
                </div>
                
                {/* Títulos com estoque > 0 */}
                <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{backgroundColor: '#e7f1ff'}}>
                  <span className="text-muted">
                    Com Estoque
                  </span>
                  <div className="d-flex align-items-center">
                    <Badge bg="info" className="fs-6 me-2">
                      {stats.livros_com_estoque || 0}
                    </Badge>
                    <small className="text-muted">
                      {stats.total_livros > 0 ? 
                        Math.round((stats.livros_com_estoque / stats.total_livros) * 100) : 0}%
                    </small>
                  </div>
                </div>
                
                {/* Títulos SEM estoque (estoque = 0) */}
                <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{backgroundColor: '#fff3cd'}}>
                  <span className="text-muted">
                    Sem Estoque
                  </span>
                  <div className="d-flex align-items-center">
                    <Badge bg="warning" className="fs-6 me-2">
                      {stats.livros_sem_estoque || 0}
                    </Badge>
                    {stats.percentual_livros_sem_estoque > 0 && (
                      <small className="text-warning">
                        {stats.percentual_livros_sem_estoque}%
                      </small>
                    )}
                  </div>
                </div>
                
                {/* Títulos disponíveis para empréstimo */}
                <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{backgroundColor: '#d4edda'}}>
                  <span className="text-muted">
                    Títulos para Empréstimo
                  </span>
                  <div className="d-flex align-items-center">
                    <Badge bg="success" className="fs-6 me-2">
                      {stats.livros_disponiveis_titulos || 0}
                    </Badge>
                    {stats.percentual_disponivel_titulos > 0 && (
                      <small className="text-success">
                        {stats.percentual_disponivel_titulos}%
                      </small>
                    )}
                  </div>
                </div>
                
                {/* Separador visual */}
                <hr className="my-1" />
                
                {/* Total de exemplares no acervo */}
                <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                  <span className="text-muted"> Exemplares no Acervo</span>
                  <span className="fw-bold text-primary fs-5">{stats.total_estoque || 0}</span>
                </div>
                
                {/* Exemplares emprestados */}
                <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{backgroundColor: '#f8d7da'}}>
                  <span className="text-muted"> Exemplares Emprestados</span>
                  <Badge bg="warning" className="fs-6">
                    {stats.exemplares_emprestados || 0}
                  </Badge>
                </div>
              
                
                {/* Exemplares disponíveis */}
                <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{backgroundColor: '#d4edda'}}>
                  <span className="text-muted">
                     Exemplares Disponíveis
                  </span>
                  <div className="d-flex align-items-center">
                    <Badge bg="success" className="fs-6 me-2">
                      {stats.exemplares_disponiveis || 0}
                    </Badge>
                    {stats.percentual_disponivel_exemplares > 0 && (
                      <small className="text-success">
                        {stats.percentual_disponivel_exemplares}%
                      </small>
                    )}
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

          {/* CARD 2: EMPRÉSTIMOS */}
          <Col md={6} lg={4} className="mb-4">
          <Card>
            <Card.Header className="bg-primary text-white d-flex align-items-center">
              <h6 className="mb-0">Empréstimos</h6>
            </Card.Header>
            <Card.Body className="p-3">
              <div className="d-flex flex-column gap-2">
                <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                  <span className="text-muted">Total</span>
                  <span className="fw-bold text-primary fs-5">{stats.emprestimos_totais || 0}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{backgroundColor: '#e7f1ff'}}>
                  <span className="text-muted">Ativos</span>
                  <Badge bg="primary" className="fs-6">{stats.emprestimos_ativos || 0}</Badge>
                </div>
                
                {/* Empréstimos cancelados */}
                <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{backgroundColor: '#e7f1ff'}}>
                  <span className="text-muted">Cancelados</span>
                  <Badge bg="danger" className="fs-6">{stats.emprestimos_cancelados || 0}</Badge>
                </div>
                <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{backgroundColor: '#e7f1ff'}}>
                  <span className="text-muted">Finalizados</span>
                  <Badge bg="success" className="fs-6">{stats.emprestimos_finalizados || 0}</Badge>
                </div>
                <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{backgroundColor: '#e7f1ff'}}>
                  <span className="text-muted">Atrasados</span>
                  <Badge bg="warning" className="text-dark fs-6">{stats.emprestimos_atrasados || 0}</Badge>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

          {/* CARD 3: RESERVAS */}
          <Col md={6} lg={4} className="mb-4">
          <Card>
            <Card.Header className="bg-primary text-white d-flex align-items-center">
              <h6 className="mb-0">Reservas</h6>
            </Card.Header>
            <Card.Body className="p-3">
              <div className="d-flex flex-column gap-2">
                <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                  <span className="text-muted">Total</span>
                  <span className="fw-bold text-primary fs-5">{stats.reservas_totais || 0}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{backgroundColor: '#e7f1ff'}}>
                  <span className="text-muted">Ativas</span>
                  <Badge bg="primary" className="fs-6">{stats.reservas_ativas || 0}</Badge>
                </div>
                <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{backgroundColor: '#e7f1ff'}}>
                  <span className="text-muted">Canceladas</span>
                  <Badge bg="danger" className="fs-6">{stats.reservas_canceladas || 0}</Badge>
                </div>
                {/* Reservas finalizadas */}
                <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{backgroundColor: '#e7f1ff'}}>
                  <span className="text-muted">Finalizadas</span>
                  <Badge bg="success" className="fs-6">{stats.reservas_finalizadas || 0}</Badge>
                </div>
                
                <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{backgroundColor: '#e7f1ff'}}>
                  <span className="text-muted">Expiradas</span>
                  <Badge bg="warning" className="text-dark fs-6">{stats.reservas_expiradas || 0}</Badge>
                </div>
                
              </div>
            </Card.Body>
          </Card>
        </Col>

          {/* CARD 4: USUÁRIOS */}
          <Col md={6} lg={4} className="mb-4">
            <Card>
              <Card.Header className="bg-primary text-white d-flex align-items-center">
                <h6 className="mb-0">Usuários</h6>
              </Card.Header>
              <Card.Body className="p-3">
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                    <span className="text-muted">Total</span>
                    <span className="fw-bold text-primary fs-5">{stats.total_usuarios || 0}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{backgroundColor: '#e7f1ff'}}>
                    <span className="text-muted">
                      <FaGraduationCap className="me-1" />
                      Alunos
                    </span>
                    <span className="fw-bold text-primary">{stats.total_alunos || 0}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{backgroundColor: '#e7f1ff'}}>
                    <span className="text-muted">
                      <FaUserTie className="me-1" />
                      Professores
                    </span>
                    <span className="fw-bold text-primary">{stats.total_professores || 0}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{backgroundColor: '#e7f1ff'}}>
                    <span className="text-muted">
                      <FaUserEdit className="me-1" />
                      Usuários Especiais
                    </span>
                    <span className="fw-bold text-primary">{stats.total_usuarios_especiais || 0}</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* CARD 5: MOVIMENTAÇÃO */}
          <Col md={6} lg={4} className="mb-4">
            <Card>
              <Card.Header className="bg-primary text-white d-flex align-items-center">
                <h6 className="mb-0">Movimentação</h6>
              </Card.Header>
              <Card.Body className="p-3">
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                    <span className="text-muted">Entradas</span>
                    <span className="fw-bold text-primary fs-5">{stats.total_entradas || 0}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                    <span className="text-muted">Saídas</span>
                    <span className="fw-bold text-primary fs-5">{stats.total_saidas || 0}</span>
                  </div>
                </div>
                <div className="mt-3">
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* CARD 6: CADASTROS */}
          <Col md={6} lg={4} className="mb-4">
            <Card>
              <Card.Header className="bg-primary text-white d-flex align-items-center">
                <h6 className="mb-0">Cadastros</h6>
              </Card.Header>
              <Card.Body className="p-3">
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                    <span className="text-muted">Editoras</span>
                    <span className="fw-bold text-primary fs-5">{stats.total_editoras || 0}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                    <span className="text-muted">Autores</span>
                    <span className="fw-bold text-primary fs-5">{stats.total_autores || 0}</span>
                  </div>
                </div>                
              </Card.Body>
            </Card>
            <div className="mt-3 text-center">
                  <small className="text-muted">
                    <FaClock className="me-1" />
                    Última atualização
                  </small>
                  <div className="mt-1">
                    {ultimaAtualizacao ? 
                      <span className="text-primary">
                        {ultimaAtualizacao.toLocaleTimeString('pt-BR')}
                      </span> : 
                      <span className="text-muted">N/A</span>
                    }
                  </div>
                </div>
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <Container className="py-4">
      <div className="rounded-3 p-4 mb-4 border bg-white">
        <Row className="align-items-center">
          <Col md={8}>
           <div className="d-flex align-items-center">
  <div className="me-3">
    <i className="fas fa-chart-pie fa-2x" style={{ color: '#0b192c' }}></i>
  </div>
  <div>
    <h4 className="fw-bold text-dark mb-1">Dashboard e Estatísticas do Sistema</h4>
    <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>
      Visão geral dos principais indicadores e métricas do sistema
    </p>
  </div>
</div>

            
          </Col>
          <Col md={4} className="text-md-end">
            <div className="d-flex justify-content-end flex-wrap gap-2">
              <Button 
                variant="paginacao" 
                size="sm"
                onClick={() => window.location.href = '/relatorios'}
              >
                <FaChartBar className="me-1" />
                Ver Relatórios
              </Button>
            </div>
          </Col>
        </Row>
      </div>

      <p className="text-muted mb-4" style={{ fontSize: '0.9rem' }}>
        Esta seção apresenta um <strong>dashboard completo</strong> com todas as estatísticas do sistema em tempo real. 
        Os dados são atualizados automaticamente e refletem o estado atual do Bookly.
      </p>

      {/* Estatísticas Gerais */}
      {renderEstatisticasGerais()}
    </Container>
  );
};

export default Estatisticas;