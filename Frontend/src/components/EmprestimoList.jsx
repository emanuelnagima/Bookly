import { useState, useEffect } from 'react';
import { Card, Table, Form, InputGroup, Button, Badge, Row, Col, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaSearch, FaChevronLeft, FaChevronRight, FaSyncAlt, FaCheckCircle, FaBook, FaList,FaTimesCircle , FaInfoCircle, FaExclamationTriangle, FaClipboardList } from 'react-icons/fa';
import { FaHandshake } from "react-icons/fa";

const ITENS_POR_PAGINA = 7;

const formatarTexto = texto =>
  (texto || '')
    .toLowerCase()
    .split(' ')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');

const formatarData = (data) => {
  if (!data) return '-';
  return new Date(data).toLocaleDateString('pt-BR');
};

const formatarTelefone = (telefone) => {
  if (!telefone) return '-';

  const numeros = telefone.toString().replace(/\D/g, '');

  if (numeros.length === 11) {
    return `(${numeros.substring(0, 2)}) ${numeros.substring(2, 7)}-${numeros.substring(7)}`;
  } else if (numeros.length === 10) {
    return `(${numeros.substring(0, 2)}) ${numeros.substring(2, 6)}-${numeros.substring(6)}`;
  } else if (numeros.length === 8) {
    return `${numeros.substring(0, 4)}-${numeros.substring(4)}`;
  } else if (numeros.length === 9) {
    return `${numeros.substring(0, 5)}-${numeros.substring(5)}`;
  }

  return telefone;
};

const EmprestimoList = ({ emprestimos, onCancelar, onRenovar, onFinalizar, loading }) => {
  const [termoBusca, setTermoBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [ordenacao, setOrdenacao] = useState('data_emprestimo_desc');


  const [showLivrosModal, setShowLivrosModal] = useState(false);
  const [livrosSelecionados, setLivrosSelecionados] = useState([]);
  const [emprestimoSelecionado, setEmprestimoSelecionado] = useState(null);

  // Resetar página quando filtros mudarem
  useEffect(() => {
    setPaginaAtual(1);
  }, [termoBusca, filtroStatus, ordenacao]);

  // Função de ordenação consistente
  const ordenarEmprestimos = (emprestimos) => {
    return [...emprestimos].sort((a, b) => {
      switch (ordenacao) {
        case 'data_emprestimo_desc':
          return new Date(b.data_emprestimo) - new Date(a.data_emprestimo);
        case 'data_emprestimo_asc':
          return new Date(a.data_emprestimo) - new Date(b.data_emprestimo);
        case 'data_devolucao_desc':
          return new Date(b.data_devolucao_prevista) - new Date(a.data_devolucao_prevista);
        case 'data_devolucao_asc':
          return new Date(a.data_devolucao_prevista) - new Date(b.data_devolucao_prevista);
        case 'usuario_asc':
          return (a.usuario || '').localeCompare(b.usuario || '', 'pt-BR', { sensitivity: 'base' });
        case 'usuario_desc':
          return (b.usuario || '').localeCompare(a.usuario || '', 'pt-BR', { sensitivity: 'base' });
        default:
          return new Date(b.data_emprestimo) - new Date(a.data_emprestimo);
      }
    });
  };

const normalizarTexto = texto =>
  (texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .trim(); // Filtrar empréstimos
    
const emprestimosFiltrados = emprestimos.filter(emprestimo => {
  if (!termoBusca && filtroStatus === 'todos') return true;

  const termo = normalizarTexto(termoBusca);
  
  // Busca no usuário e ID
  const buscaUsuario = normalizarTexto(emprestimo.usuario || '').includes(termo);
  const buscaId = (emprestimo.id || '').toString().includes(termo);
  
  // Busca nos títulos dos livros
  const buscaLivros = (emprestimo.livros || []).some(livro => 
    normalizarTexto(livro.livro_titulo || '').includes(termo)
  );
  
  const matchesBusca = !termoBusca || buscaUsuario || buscaId || buscaLivros;

  const hoje = new Date();
  const devolucao = new Date(emprestimo.data_devolucao_prevista);

  // Cálculo dinâmico do status
  let statusCalculado = emprestimo.status;
  if (emprestimo.status === 'ativo' && devolucao < hoje) {
    statusCalculado = 'atrasado';
  }

  const matchesStatus =
    filtroStatus === 'todos' || statusCalculado === filtroStatus;

  return matchesBusca && matchesStatus;
});
  // Aplicar ordenação
  const emprestimosOrdenados = ordenarEmprestimos(emprestimosFiltrados);

  // Calcular paginação
  const totalPaginas = Math.ceil(emprestimosOrdenados.length / ITENS_POR_PAGINA);
  
  // Garantir que a página atual seja válida
  const paginaValida = Math.max(1, Math.min(paginaAtual, totalPaginas));
  if (paginaValida !== paginaAtual) {
    setPaginaAtual(paginaValida);
  }

  const inicio = (paginaValida - 1) * ITENS_POR_PAGINA;
  const fim = inicio + ITENS_POR_PAGINA;
  const emprestimosPaginaAtual = emprestimosOrdenados.slice(inicio, fim);

  const handlePaginaAnterior = () => {
    if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1);
  };

  const handleProximaPagina = () => {
    if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1);
  };

  // Função para verificar se está no prazo
const verificarPrazo = (dataDevolucaoPrevista, dataDevolucaoReal, status) => {
  // Status cancelado tem prioridade
  if (status === 'cancelado') {
    return { 
      situacao: 'cancelado', 
      classe: 'text-danger', 
      texto: 'Cancelado',
      dataDisplay: 'Cancelado',
      badge: 'danger'
    };
  }

  if (status === 'finalizado') {
    return { 
      situacao: 'finalizado', 
      classe: 'text-dark', 
      texto: 'Devolvido',
      dataDisplay: dataDevolucaoReal ? formatarData(dataDevolucaoReal) : 'Devolvido',
      badge: 'dark'
    };
  }

  const hoje = new Date();
  const devolucao = new Date(dataDevolucaoPrevista);

  if (devolucao < hoje) {
    return { 
      situacao: 'atrasado', 
      classe: 'text-warning', 
      texto: 'Atrasado',
      dataDisplay: formatarData(dataDevolucaoPrevista),
      badge: 'warning'
    };
  }

  // Verificar se está próximo do vencimento (3 dias ou menos)
  const diasRestantes = Math.ceil((devolucao - hoje) / (1000 * 60 * 60 * 24));
  if (diasRestantes <= 3) {
    return { 
      situacao: 'proximo_vencimento', 
      classe: 'text-warning', 
      texto: `Vence em ${diasRestantes} dia(s)`,
      dataDisplay: formatarData(dataDevolucaoPrevista),
      badge: 'warning'
    };
  }

  return { 
    situacao: 'no_prazo', 
    classe: '', 
    texto: 'No prazo',
    dataDisplay: formatarData(dataDevolucaoPrevista),
    badge: 'success'
  };
};
const getStatusBadge = (status, dataDevolucao) => {
  const hoje = new Date();
  const devolucao = new Date(dataDevolucao);
  
  // Função para capitalizar (primeira letra maiúscula)
  const capitalizar = (texto) => {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  };

  switch (status) {
    case 'finalizado':
      return <Badge bg="dark">{capitalizar('finalizado')}</Badge>;
    
    case 'cancelado':
      return <Badge bg="danger">{capitalizar('cancelado')}</Badge>;
    
    case 'atrasado':
      return <Badge bg="warning" className="text-dark">{capitalizar('atrasado')}</Badge>;
    
    case 'ativo':
      if (devolucao < hoje) {
        return <Badge bg="warning" className="text-dark">{capitalizar('atrasado')}</Badge>;
      }
      return <Badge bg="success">{capitalizar('emprestado')}</Badge>;
    
    default:
      return <Badge bg="secondary">{capitalizar(status || 'desconhecido')}</Badge>;
  }
};
  const isAtrasado = (dataDevolucao, status) => {
    if (status === 'finalizado') return false;
    const hoje = new Date();
    const devolucao = new Date(dataDevolucao);
    return devolucao < hoje;
  };

  // Função para abrir modal com livros do empréstimo
  const handleVerLivros = (emprestimo) => {
    setLivrosSelecionados(emprestimo.livros || []);
    setEmprestimoSelecionado(emprestimo);
    setShowLivrosModal(true);
  };

  // Fechar modal
  const handleCloseLivrosModal = () => {
    setShowLivrosModal(false);
    setLivrosSelecionados([]);
    setEmprestimoSelecionado(null);
  };

  return (
    <Card>
      <Card.Header className="bg-primary text-white d-flex flex-wrap justify-content-between align-items-center">
        <div className="d-flex align-items-center mb-2 mb-md-0">
          <FaHandshake
            style={{
              marginRight: '8px',
              fontSize: '26px',
              color: '#ffffff',
              border: '2px solid #585858',
              borderRadius: '50%',
              padding: '4px',
              display: 'inline-flex',
              verticalAlign: 'middle'
            }}
          />
          <h5 className="mb-0">Empréstimos</h5>
        </div>

        <div className="d-flex align-items-center gap-3">
          {/* Filtro de Status */}
          <Form.Select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            style={{ width: 'auto', minWidth: '150px' }}
            size="sm"
          >
            <option value="todos">Todos os status</option>
            <option value="ativo">Ativos</option>
            <option value="atrasado">Atrasados</option>
            <option value="finalizado">Finalizados</option>
             <option value="cancelado">Cancelados</option> 

          </Form.Select>

          {/* Seletor de Ordenação */}
          <Form.Select
            value={ordenacao}
            onChange={(e) => setOrdenacao(e.target.value)}
            style={{ width: 'auto', minWidth: '200px' }}
            size="sm"
          >
            <option value="data_emprestimo_desc">Data empréstimo (mais recente)</option>
            <option value="data_emprestimo_asc">Data empréstimo (mais antigo)</option>
            <option value="data_devolucao_asc">Data devolução (mais próxima)</option>
            <option value="data_devolucao_desc">Data devolução (mais distante)</option>
            <option value="usuario_asc">Usuário (A-Z)</option>
            <option value="usuario_desc">Usuário (Z-A)</option>
          </Form.Select>

          {/* Barra de pesquisa */}
          <div style={{ minWidth: '200px', maxWidth: '300px' }}>
            <InputGroup size="sm">
              <InputGroup.Text className="bg-light text-primary">
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Buscar empréstimos..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
              />
            </InputGroup>
          </div>
        </div>
      </Card.Header>

      <Card.Body>
        {loading ? (
          <p className="text-center text-muted py-4">Carregando empréstimos...</p>
        ) : emprestimosPaginaAtual.length === 0 ? (
          <p className="text-muted text-center py-4">
            {termoBusca || filtroStatus !== 'todos' ? 'Nenhum empréstimo encontrado' : 'Nenhum empréstimo cadastrado'}
          </p>
        ) : (
          <>
            <Table striped hover responsive className="align-middle">
              <thead>
                <tr>
                  <th width="80px">ID</th>
                  <th>Usuário</th>
                  <th width="120px">Tipo</th>
                  <th width="150px">Livros</th>
                  <th width="140px">Data Empréstimo</th>
                  <th width="140px">Data Devolução</th>
                  <th width="120px">Status</th>
                  <th width="120px">Situação</th>
                  <th width="200px" className="text-center">Ações</th>
                </tr>
              </thead>
             <tbody>
                {emprestimosPaginaAtual.map(emprestimo => {
                  const atrasado = isAtrasado(emprestimo.data_devolucao_prevista, emprestimo.status);
                  const situacao = verificarPrazo(
                    emprestimo.data_devolucao_prevista, 
                    emprestimo.data_devolucao_real,
                    emprestimo.status
                  );

                  return (
                    <tr key={emprestimo.id} className={atrasado ? 'linha-atrasada' : ''}>
                      <td className="fw-bold">#{emprestimo.id}</td>

                     {/* Coluna Usuário */}
                        <td>
                          <div className="fw-semibold">{formatarTexto(emprestimo.usuario)}</div>
                        </td>

                      {/* Coluna Tipo */}
                        <td>
                          {emprestimo.usuario_tipo
                            ? (() => {
                                // Formatar o tipo de usuário
                                let tipoFormatado = emprestimo.usuario_tipo;
                                
                                // Remover underline e capitalizar
                                if (tipoFormatado === 'usuario_especial') {
                                  tipoFormatado = 'Usuário Especial';
                                } else {
                                  tipoFormatado = tipoFormatado.charAt(0).toUpperCase() + tipoFormatado.slice(1);
                                }
                                
                                return tipoFormatado;
                              })()
                            : ''
                          }
                        </td>

                      {/* Coluna Livros */}
                      <td>
                        <Button
                          variant="paginacao"
                          size="sm"
                          onClick={() => handleVerLivros(emprestimo)}
                          title="Ver livros do empréstimo"
                          className="d-flex align-items-center w-100 justify-content-center"
                        >
                          <FaClipboardList className="me-1" />
                          Ver Detalhes
                        </Button>
                      </td>

                      <td className="text-nowrap">{formatarData(emprestimo.data_emprestimo)}</td>
                      
                      {/* Coluna Data Devolução */}
                      <td className={`text-nowrap ${atrasado ? 'text-warning fw-bold' : ''}`}>
                        {atrasado && <FaExclamationTriangle className="me-1" />}
                        {/* EXIBIR DATA CORRETA: real se finalizado, prevista se ativo/atrasado */}
                        {emprestimo.status === 'finalizado' && emprestimo.data_devolucao_real 
                          ? formatarData(emprestimo.data_devolucao_real) // DATA REAL
                          : formatarData(emprestimo.data_devolucao_prevista) // DATA PREVISTA
                        }
                      </td>

                      <td>
                        {getStatusBadge(emprestimo.status, emprestimo.data_devolucao_prevista)}
                      </td>

                      {/*  Coluna Situação  */}
                      <td>
                        <span className={`small ${situacao.classe}`}>
                          {situacao.texto}
                        </span>
                        {/* Mostrar data de devolução real quando disponível */}
                        {emprestimo.status === 'finalizado' && emprestimo.data_devolucao_real && (
                          <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                            Em {formatarData(emprestimo.data_devolucao_real)}
                          </div>
                        )}
                      </td>

                      <td>
                        <div className="d-flex gap-2 justify-content-center">
                          {emprestimo.status === 'ativo' && (
                            <>
                              <button
                                className="btn-sm-custom btn-primary"
                                onClick={() => onRenovar(emprestimo.id)}
                                title="Renovar empréstimo"
                              >
                                <FaSyncAlt />
                              </button>
                               <button
                                  className="btn-sm-custom btn-renovar"
                                  onClick={() => onCancelar(emprestimo.id)}
                                  title="Cancelar empréstimo"
                                >
                                  <FaTimesCircle /> {/* Ícone de cancelar */}
                                </button>
                              <button
                                className="btn-sm-custom btn-success"
                                onClick={() => onFinalizar(emprestimo.id)}
                                title="Finalizar empréstimo"
                              >
                                <FaCheckCircle />
                              </button>

              
                            </>
                          )}
                          {emprestimo.status !== 'ativo' && (
                            <span className="text-muted small d-flex align-items-center">
                              Sem ações
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>

            {/* Modal para mostrar os livros */}
            <Modal show={showLivrosModal} onHide={handleCloseLivrosModal} size="lg">
              <Modal.Header closeButton closeVariant="white" className="bg-primary text-white">
                <Modal.Title className="d-flex align-items-center">
                  <FaBook className="me-2" />
                  Empréstimo #{emprestimoSelecionado?.id} - Detalhes
                </Modal.Title>
              </Modal.Header>

              <Modal.Body className="p-4">
                {/* SEÇÃO: Informações do Usuário */}
                <div className="mb-4 p-3 border rounded bg-white">
                  <h5 className="fw-bold mb-3 text-primary border-bottom pb-2">
                    Informações do Usuário
                  </h5>
                  <Row>
                    <Col md={6}>
                      <p className="mb-2">
                        <strong>Nome:</strong> {formatarTexto(emprestimoSelecionado?.usuario_detalhes?.nome || emprestimoSelecionado?.usuario)}
                      </p>
                      <p className="mb-2">
                        <strong>Email:</strong> {emprestimoSelecionado?.usuario_detalhes?.email || 'Não informado'}
                      </p>
                      <p className="mb-2">
                        <strong>Telefone:</strong> {formatarTelefone(emprestimoSelecionado?.usuario_detalhes?.telefone) || 'Não informado'}
                      </p>
                    </Col>
                    <Col md={6}>
                      <p className="mb-2">
                        <strong>Tipo:</strong> {formatarTexto(emprestimoSelecionado?.usuario_tipo)}
                      </p>
                      {emprestimoSelecionado?.usuario_detalhes?.turma && (
                        <p className="mb-2">
                          <strong>Turma:</strong> {emprestimoSelecionado.usuario_detalhes.turma}
                        </p>
                      )}
                      {emprestimoSelecionado?.usuario_detalhes?.departamento && (
                        <p className="mb-2">
                          <strong>Departamento:</strong> {emprestimoSelecionado.usuario_detalhes.departamento}
                        </p>
                      )}
                      {emprestimoSelecionado?.usuario_detalhes?.tipo_especial && (
                        <p className="mb-2">
                          <strong>Tipo Especial:</strong> {formatarTexto(emprestimoSelecionado.usuario_detalhes.tipo_especial)}
                        </p>
                      )}
                    </Col>
                  </Row>
                </div>

                {/* SEÇÃO: Informações do Empréstimo */}
                    <div className="mb-4 p-3 border rounded bg-white">
                      <h5 className="fw-bold mb-3 text-primary border-bottom pb-2">
                        Informações do Empréstimo
                      </h5>
                      <Row>
                        <Col md={6}>
                          <p className="mb-2">
                            <strong>Data do Empréstimo:</strong> {formatarData(emprestimoSelecionado?.data_emprestimo)}
                          </p>
                          <p className="mb-2">
                            <strong>Data de Devolução Prevista:</strong> {formatarData(emprestimoSelecionado?.data_devolucao_prevista)}
                          </p>
                        </Col>
                        <Col md={6}>
                          <p className="mb-2">
                            <strong>Status:</strong> {getStatusBadge(emprestimoSelecionado?.status, emprestimoSelecionado?.data_devolucao_prevista)}
                          </p>
                          
                          {/* Data de Devolução Real (se disponível) */}
                          {emprestimoSelecionado?.data_devolucao_real && (
                            <p className="mb-2">
                              <strong>Data de Devolução Real:</strong> 
                              <span className="text-success fw-bold ms-2">
                                {formatarData(emprestimoSelecionado.data_devolucao_real)}
                              </span>
                            </p>
                          )}
                          
                          <p className="mb-2 d-flex align-items-center">
                            <strong>Situação:</strong>
                            {(() => {
                              const situacao = verificarPrazo(
                                emprestimoSelecionado?.data_devolucao_prevista,
                                emprestimoSelecionado?.data_devolucao_real,
                                emprestimoSelecionado?.status
                              );
                              return (
                                <Badge bg={situacao.badge} className="ms-2">
                                  {situacao.texto}
                                </Badge>
                              );
                            })()}
                          </p>
                        </Col>
                      </Row>
                    </div>

                {/* SEÇÃO: Livros do Empréstimo */}
                <div className="p-3 border rounded bg-white">
                  <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                    <h5 className="fw-bold text-primary mb-0">Livros do Empréstimo</h5>
                    <small className="text-muted"><strong>Total de livros:</strong> {livrosSelecionados.length}</small>
                  </div>

                  {livrosSelecionados.length === 0 ? (
                    <p className="text-muted text-center py-3">Nenhum livro encontrado neste empréstimo</p>
                  ) : (
                    <div className="row">
                      {livrosSelecionados.map((livro, index) => (
                        <div key={livro.livro_id || index} className="col-12 mb-3">
                          <div className="card border-0 bg-light rounded-3 p-3">
                            <div className="d-flex align-items-start">
                              {/* Imagem do livro */}
                              <div
                                className="me-3 rounded overflow-hidden border bg-white d-flex align-items-center justify-content-center"
                                style={{
                                  width: '70px',
                                  height: '100px',
                                  flexShrink: 0,
                                }}
                              >
                                {livro.livro_imagem ? (
                                  <img
                                    src={`http://localhost:3000${livro.livro_imagem}`}
                                    alt={livro.livro_titulo}
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover',
                                    }}
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      const placeholder = e.target.parentNode.querySelector('.livro-placeholder');
                                      if (placeholder) placeholder.style.display = 'flex';
                                    }}
                                  />
                                ) : (
                                  <div
                                    className="livro-placeholder d-flex align-items-center justify-content-center text-muted"
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      backgroundColor: '#f8f9fa',
                                    }}
                                  >
                                    <FaBook size={22} />
                                  </div>
                                )}
                              </div>

                              {/* Informações do livro */}
                              <div className="flex-grow-1">
                                <h6 className="fw-bold text-primary mb-2">
                                  {formatarTexto(livro.livro_titulo) || 'Livro sem título'}
                                </h6>
                                <div className="row small text-muted">
                                  <div className="col-md-6">
                                    <p className="mb-1"><strong>Autor:</strong> {formatarTexto(livro.autor_nome) || 'Não informado'}</p>
                                    <p className="mb-1"><strong>ISBN:</strong> {livro.livro_isbn || 'Não informado'}</p>
                                  </div>
                                  <div className="col-md-6">
                                    <p className="mb-1"><strong>Quantidade:</strong> {livro.quantidade || 1}</p>
                                    <p className="mb-0"><strong>ID do Livro:</strong> {livro.livro_id}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Modal.Body>

              <Modal.Footer>
                <Button variant="paginacao" onClick={handleCloseLivrosModal}>
                  Fechar
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Paginação  */}
            {totalPaginas > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-4">
                <div className="text-muted small">
                  Mostrando {inicio + 1} a {Math.min(fim, emprestimosOrdenados.length)} de {emprestimosOrdenados.length} empréstimos
                </div>
                
                <div className="d-flex align-items-center gap-2">
                  <Button
                    className="btn-paginacao"
                    onClick={handlePaginaAnterior}
                    disabled={paginaAtual === 1}
                  >
                    <FaChevronLeft className="me-1" />
                    Anterior
                  </Button>
                  
                  <span className="mx-3 text-muted">
                    Página <strong>{paginaAtual}</strong> de <strong>{totalPaginas}</strong>
                  </span>
                  
                  <Button
                    className="btn-paginacao"
                    onClick={handleProximaPagina}
                    disabled={paginaAtual === totalPaginas}
                  >
                    Próxima
                    <FaChevronRight className="ms-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default EmprestimoList;