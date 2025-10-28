import { useState, useEffect } from 'react';
import { Card, Table, Form, InputGroup, Button, Badge, Row, Col, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaSearch, FaChevronLeft, FaChevronRight, FaSyncAlt, FaCheckCircle, FaBook, FaList } from 'react-icons/fa';
import { FaHandshake } from "react-icons/fa";

const ITENS_POR_PAGINA = 12;

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

const EmprestimoList = ({ emprestimos, onDelete, onEdit, onRenovar, onFinalizar, loading }) => {
  const [termoBusca, setTermoBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [showLivrosModal, setShowLivrosModal] = useState(false);
  const [livrosSelecionados, setLivrosSelecionados] = useState([]);
  const [emprestimoSelecionado, setEmprestimoSelecionado] = useState(null);


  useEffect(() => {
    setPaginaAtual(1);
  }, [termoBusca, filtroStatus]);

  const emprestimosFiltrados = emprestimos.filter(emprestimo => {
    if (!termoBusca && filtroStatus === 'todos') return true;

    const termo = termoBusca.toLowerCase();
    const matchesBusca = !termoBusca || (
      (emprestimo.usuario || '').toLowerCase().includes(termo) ||
      (emprestimo.id || '').toString().toLowerCase().includes(termo)
    );

    const matchesStatus = filtroStatus === 'todos' || emprestimo.status === filtroStatus;

    return matchesBusca && matchesStatus;
  });

  const totalPaginas = Math.ceil(emprestimosFiltrados.length / ITENS_POR_PAGINA);

  const emprestimosOrdenados = [...emprestimosFiltrados].sort((a, b) => 
    new Date(b.data_emprestimo) - new Date(a.data_emprestimo)
  );

  const emprestimosPaginaAtual = emprestimosOrdenados.slice(
    (paginaAtual - 1) * ITENS_POR_PAGINA,
    paginaAtual * ITENS_POR_PAGINA
  );

  const handlePaginaAnterior = () => {
    if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1);
  };

  const handleProximaPagina = () => {
    if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1);
  };

  const getStatusBadge = (status, dataDevolucao) => {
    const hoje = new Date();
    const devolucao = new Date(dataDevolucao);
    
    if (status === 'finalizado') {
      return <Badge bg="dark">Finalizado</Badge>;
    }
    
    if (status === 'atrasado') {
      return <Badge bg="danger">Atrasado</Badge>;
    }
    
    if (devolucao < hoje) {
      return <Badge bg="danger">Atrasado</Badge>;
    }
    
    return <Badge bg="success">Emprestado</Badge>;
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
console.log('Dados dos empréstimos:', emprestimosPaginaAtual);

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
          <span className="badge bg-light text-primary ms-3">
            {emprestimosFiltrados.length} {emprestimosFiltrados.length === 1 ? 'empréstimo' : 'empréstimos'} / Página {paginaAtual} de {totalPaginas || 1}
          </span>
        </div>

        <div className="d-flex align-items-center gap-3">
          {/* Filtro de Status */}
          <Form.Select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            style={{ width: 'auto' }}
            size="sm"
          >
            <option value="todos">Todos os status</option>
            <option value="ativo">Ativos</option>
            <option value="atrasado">Atrasados</option>
            <option value="finalizado">Finalizados</option>
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
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuário</th>
                  <th>Tipo</th>
                  <th>Livros</th>
                  <th>Data Empréstimo</th>
                  <th>Data Devolução</th>
                  <th>Status</th>
                  <th width="200px">Ações</th>
                </tr>
              </thead>
              <tbody>
                {emprestimosPaginaAtual.map(emprestimo => {
                  const atrasado = isAtrasado(emprestimo.data_devolucao_prevista, emprestimo.status);
                  
                  return (
                    <tr key={emprestimo.id} className={atrasado ? 'table-warning' : ''}>
                      <td>{emprestimo.id}</td>
                      
                      {/* Coluna Usuário */}
                      <td>
                        <div>{formatarTexto(emprestimo.usuario)}</div>
                      </td>
                      
                      {/* Coluna Tipo */}
                      <td>
                          {formatarTexto(emprestimo.usuario_tipo)}
                      </td>
                      
                      {/* Coluna Livros - COM BOTÃO PARA VER LIVROS */}
                      <td>
                        <div className="d-flex align-items-center justify-content-between">
                          <div>
                            <Badge bg="primary" className="me-2">
                              {emprestimo.total_livros || 0} livro(s)
                            </Badge>
                          </div>
                          <Button
                            variant="outline-dark"
                            size="sm"
                            onClick={() => handleVerLivros(emprestimo)}
                            title="Ver livros do empréstimo"
                            className="d-flex align-items-center"
                          >
                            <FaList className="me-1" />
                            Ver Livros
                          </Button>
                        </div>
                      </td>
                      
                      <td>{formatarData(emprestimo.data_emprestimo)}</td>
                      <td className={atrasado ? 'text-danger fw-bold' : ''}>
                        {formatarData(emprestimo.data_devolucao_prevista)}
                      </td>
                      <td>
                        {getStatusBadge(emprestimo.status, emprestimo.data_devolucao_prevista)}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          {emprestimo.status === 'ativo' && (
                            <>
                              <button
                                className="btn-sm-custom btn-warning"
                                onClick={() => onRenovar(emprestimo.id)}
                                title="Renovar empréstimo"
                              >
                                <FaSyncAlt />
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
                          <button
                            className="btn-sm-custom btn-delete"
                            onClick={() => onDelete(emprestimo.id)}
                            title="Excluir empréstimo"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
                
            {/* Modal para mostrar os livros */}
            <Modal show={showLivrosModal} onHide={handleCloseLivrosModal} size="lg">
              <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title className="d-flex align-items-center">
                  <FaBook className="me-2" />
                  Livros do Empréstimo #{emprestimoSelecionado?.id}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="mb-3">
                  <p className="mb-1"><strong>Usuário:</strong> {formatarTexto(emprestimoSelecionado?.usuario)}</p>
                  <p className="mb-1"><strong>Tipo:</strong> {formatarTexto(emprestimoSelecionado?.usuario_tipo)}</p>
                  <p className="mb-0"><strong>Total de livros:</strong> {livrosSelecionados.length}</p>
                </div>
                
                {livrosSelecionados.length === 0 ? (
                  <p className="text-muted text-center py-3">Nenhum livro encontrado neste empréstimo</p>
                ) : (
                  <div className="row">
                    {livrosSelecionados.map((livro, index) => (
                      <div key={livro.livro_id || index} className="col-12 mb-3">
                        <div className="card border-0">
                          <div className="card-body p-3">
                            <div className="d-flex align-items-start">
                              {/* Imagem do livro */}
                              {livro.livro_imagem ? (
                                <img 
                                  src={`http://localhost:3000${livro.livro_imagem}`}
                                  alt={livro.livro_titulo}
                                  className="me-3 rounded border"
                                  style={{ 
                                    width: '60px', 
                                    objectFit: 'cover'
                                  }}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    const placeholder = e.target.parentNode.querySelector('.livro-placeholder');
                                    if (placeholder) placeholder.style.display = 'flex';
                                  }}
                                />
                              ) : (
                                <div 
                                  className="livro-placeholder d-flex align-items-center justify-content-center bg-light text-muted rounded border me-3"
                                  style={{ 
                                    width: '60px', 
                                    height: '80px'
                                  }}
                                >
                                  <FaBook size={20} />
                                </div>
                              )}
                              
                              {/* Informações do livro */}
                              <div className="flex-grow-1">
                                <h6 className="card-title mb-2 text-primary">
                                  {formatarTexto(livro.livro_titulo) || 'Livro sem título'}
                                </h6>
                                
                                <div className="row small text-muted">
                                  <div className="col-md-6">
                                    <p className="mb-1">
                                      <strong>Autor:</strong> {formatarTexto(livro.autor_nome) || 'Não informado'}
                                    </p>
                                    <p className="mb-1">
                                      <strong>ISBN:</strong> {livro.livro_isbn || 'Não informado'}
                                    </p>
                                  </div>
                                  <div className="col-md-6">
                                    <p className="mb-1">
                                      <strong>Quantidade: </strong> 
                                        {livro.quantidade || 1}
                                    </p>
                                    <p className="mb-0">
                                      <strong>ID do Livro: </strong> 
                                        {livro.livro_id}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="paginacao" onClick={handleCloseLivrosModal}>
                  Fechar
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Paginação */}
            {totalPaginas > 1 && (
              <div className="d-flex justify-content-end align-items-center mt-3 gap-2">
                <Button
                  className="btn-paginacao"
                  onClick={handlePaginaAnterior}
                  disabled={paginaAtual === 1}
                >
                  <FaChevronLeft className="me-1" />
                  Anterior
                </Button>
                <Button
                  className="btn-paginacao"
                  onClick={handleProximaPagina}
                  disabled={paginaAtual === totalPaginas}
                >
                  Próxima
                  <FaChevronRight className="ms-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default EmprestimoList;