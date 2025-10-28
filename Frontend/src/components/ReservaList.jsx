import { useState, useEffect } from 'react';
import { Card, Table, Form, InputGroup, Button, Badge, Row, Col, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaSearch, FaChevronLeft, FaChevronRight, FaTimesCircle, FaCheckCircle, FaBook, FaList } from 'react-icons/fa';
import { FaCalendarAlt } from "react-icons/fa";

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

const ReservaList = ({ reservas, onDelete, onEdit, onCancelar, onConcluir, loading }) => {
  const [termoBusca, setTermoBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [showLivroModal, setShowLivroModal] = useState(false);
  const [livroSelecionado, setLivroSelecionado] = useState(null);
  const [reservaSelecionada, setReservaSelecionada] = useState(null);

  useEffect(() => {
    setPaginaAtual(1);
  }, [termoBusca, filtroStatus]);

  const reservasFiltradas = reservas.filter(reserva => {
    if (!termoBusca && filtroStatus === 'todos') return true;

    const termo = termoBusca.toLowerCase();
    const matchesBusca = !termoBusca || (
      (reserva.usuario || '').toLowerCase().includes(termo) ||
      (reserva.livro_titulo || '').toLowerCase().includes(termo) ||
      (reserva.id || '').toString().toLowerCase().includes(termo)
    );

    const matchesStatus = filtroStatus === 'todos' || reserva.status === filtroStatus;

    return matchesBusca && matchesStatus;
  });

  const totalPaginas = Math.ceil(reservasFiltradas.length / ITENS_POR_PAGINA);

  const reservasOrdenadas = [...reservasFiltradas].sort((a, b) => 
    new Date(b.data_reserva) - new Date(a.data_reserva)
  );

  const reservasPaginaAtual = reservasOrdenadas.slice(
    (paginaAtual - 1) * ITENS_POR_PAGINA,
    paginaAtual * ITENS_POR_PAGINA
  );

  const handlePaginaAnterior = () => {
    if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1);
  };

  const handleProximaPagina = () => {
    if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1);
  };

  const getStatusBadge = (status, dataValidade) => {
    const hoje = new Date();
    const validade = new Date(dataValidade);
    
    switch (status) {
      case 'ativa':
        if (validade < hoje) {
          return <Badge bg="warning" text="dark">Expirada</Badge>;
        }
        return <Badge bg="success">Reservado</Badge>;
      case 'cancelada':
        return <Badge bg="secondary">Cancelada</Badge>;
      case 'concluida':
        return <Badge bg="dark">Finalizado</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const isExpirada = (dataValidade, status) => {
    if (status !== 'ativa') return false;
    const hoje = new Date();
    const validade = new Date(dataValidade);
    return validade < hoje;
  };

  const handleVerLivro = (reserva) => {
    setLivroSelecionado({
      titulo: reserva.livro_titulo,
      imagem: reserva.livro_imagem,
      isbn: reserva.livro_isbn,
      autor: reserva.autor_nome
    });
    setReservaSelecionada(reserva);
    setShowLivroModal(true);
  };

  const handleCloseLivroModal = () => {
    setShowLivroModal(false);
    setLivroSelecionado(null);
    setReservaSelecionada(null);
  };

  return (
    <Card>
      <Card.Header className="bg-primary text-white d-flex flex-wrap justify-content-between align-items-center">
        <div className="d-flex align-items-center mb-2 mb-md-0">
          <FaCalendarAlt
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
          <h5 className="mb-0">Reservas</h5>
          <span className="badge bg-light text-primary ms-3">
            {reservasFiltradas.length} {reservasFiltradas.length === 1 ? 'reserva' : 'reservas'} / Página {paginaAtual} de {totalPaginas || 1}
          </span>
        </div>

        <div className="d-flex align-items-center gap-3">
          <Form.Select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            style={{ width: 'auto' }}
            size="sm"
          >
            <option value="todos">Todos os status</option>
            <option value="ativa">Ativas</option>
            <option value="cancelada">Canceladas</option>
            <option value="concluida">Finalizados</option>
          </Form.Select>

          <div style={{ minWidth: '200px', maxWidth: '300px' }}>
            <InputGroup size="sm">
              <InputGroup.Text className="bg-light text-primary">
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Buscar reservas..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
              />
            </InputGroup>
          </div>
        </div>
      </Card.Header>

      <Card.Body>
        {loading ? (
          <p className="text-center text-muted py-4">Carregando reservas...</p>
        ) : reservasPaginaAtual.length === 0 ? (
          <p className="text-muted text-center py-4">
            {termoBusca || filtroStatus !== 'todos' ? 'Nenhuma reserva encontrada' : 'Nenhuma reserva cadastrada'}
          </p>
        ) : (
          <>
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuário</th>
                  <th>Tipo</th>
                  <th>Livro</th>
                  <th>Data Reserva</th>
                  <th>Data Validade</th>
                  <th>Status</th>
                  <th width="200px">Ações</th>
                </tr>
              </thead>
              <tbody>
                {reservasPaginaAtual.map(reserva => {
                  const expirada = isExpirada(reserva.data_validade, reserva.status);
                  
                  return (
                    <tr key={reserva.id} className={expirada ? 'table-warning' : ''}>
                      <td>{reserva.id}</td>
                      
                      <td>
                        <div>{formatarTexto(reserva.usuario)}</div>
                      </td>
                      
                      <td>
                          {formatarTexto(reserva.usuario_tipo)}
                      </td>
                      
                      <td>
                        <div className="d-flex align-items-center justify-content-between">
                          <div>
                            <div className="fw-medium small">
                              {formatarTexto(reserva.livro_titulo)}
                            </div>
                            <Badge bg="primary" className="mt-1">
                              1 livro
                            </Badge>
                          </div>
                          <Button
                            variant="outline-dark"
                            size="sm"
                            onClick={() => handleVerLivro(reserva)}
                            title="Ver detalhes do livro"
                            className="d-flex align-items-center"
                          >
                            <FaList className="me-1" />
                            Ver Livro
                          </Button>
                        </div>
                      </td>
                      
                      <td>{formatarData(reserva.data_reserva)}</td>
                      <td className={expirada ? 'text-danger fw-bold' : ''}>
                        {formatarData(reserva.data_validade)}
                      </td>
                      <td>
                        {getStatusBadge(reserva.status, reserva.data_validade)}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          {reserva.status === 'ativa' && (
                            <>
                              <button
                                className="btn-sm-custom btn-warning"
                                onClick={() => onCancelar(reserva.id)}
                                title="Cancelar reserva"
                              >
                                <FaTimesCircle />
                              </button>
                              <button
                                className="btn-sm-custom btn-success"
                                onClick={() => onConcluir(reserva.id)}
                                title="Concluir reserva"
                              >
                                <FaCheckCircle />
                              </button>
                            </>
                          )}
                          <button
                            className="btn-sm-custom btn-delete"
                            onClick={() => onDelete(reserva.id)}
                            title="Excluir reserva"
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

            {/* Modal para mostrar detalhes do livro */}
            <Modal show={showLivroModal} onHide={handleCloseLivroModal} size="md">
              <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title className="d-flex align-items-center">
                  <FaBook className="me-2" />
                  Livro da Reserva #{reservaSelecionada?.id}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="mb-3">
                  <p className="mb-1"><strong>Usuário:</strong> {formatarTexto(reservaSelecionada?.usuario)}</p>
                  <p className="mb-1"><strong>Tipo:</strong> {formatarTexto(reservaSelecionada?.usuario_tipo)}</p>
                  <p className="mb-0"><strong>Status:</strong> {getStatusBadge(reservaSelecionada?.status, reservaSelecionada?.data_validade)}</p>
                </div>
                
                {livroSelecionado ? (
                  <div className="card border-0">
                    <div className="card-body p-3">
                      <div className="d-flex align-items-start">
                        {livroSelecionado.imagem ? (
                          <img 
                            src={`http://localhost:3000${livroSelecionado.imagem}`}
                            alt={livroSelecionado.titulo}
                            className="me-3 rounded border"
                            style={{ 
                              width: '80px', 
                              height: '100px', 
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
                              width: '80px', 
                              height: '100px'
                            }}
                          >
                            <FaBook size={24} />
                          </div>
                        )}
                        
                        <div className="flex-grow-1">
                          <h6 className="card-title mb-2 text-primary">
                            {formatarTexto(livroSelecionado.titulo) || 'Livro sem título'}
                          </h6>
                          
                          <div className="small text-muted">
                            <p className="mb-1">
                              <strong>Autor:</strong> {formatarTexto(livroSelecionado.autor) || 'Não informado'}
                            </p>
                            <p className="mb-1">
                              <strong>ISBN:</strong> {livroSelecionado.isbn || 'Não informado'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted text-center py-3">Nenhuma informação do livro disponível</p>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="paginacao" onClick={handleCloseLivroModal}>
                  Fechar
                </Button>
              </Modal.Footer>
            </Modal>

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

export default ReservaList;