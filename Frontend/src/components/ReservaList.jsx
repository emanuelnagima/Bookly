import { useState, useEffect } from 'react';
import { Card, Table, Form, InputGroup, Button, Badge, Row, Col } from 'react-bootstrap';
import { FaEdit, FaTrash, FaSearch, FaChevronLeft, FaChevronRight, FaTimesCircle, FaCheckCircle } from 'react-icons/fa';
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

  useEffect(() => {
    setPaginaAtual(1);
  }, [termoBusca, filtroStatus]);

  const reservasFiltradas = reservas.filter(reserva => {
    if (!termoBusca && filtroStatus === 'todos') return true;

    const termo = termoBusca.toLowerCase();
    const matchesBusca = !termoBusca || (
      (reserva.usuario_nome || '').toLowerCase().includes(termo) ||
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
        return <Badge bg="success">Ativa</Badge>;
      case 'cancelada':
        return <Badge bg="secondary">Cancelada</Badge>;
      case 'concluida':
        return <Badge bg="info">Concluída</Badge>;
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
          {/* Filtro de Status */}
          <Form.Select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            style={{ width: 'auto' }}
            size="sm"
          >
            <option value="todos">Todos os status</option>
            <option value="ativa">Ativas</option>
            <option value="cancelada">Canceladas</option>
            <option value="concluida">Concluídas</option>
          </Form.Select>

          {/* Barra de pesquisa */}
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
                  <th width="180px">Ações</th>
                </tr>
              </thead>
              <tbody>
                {reservasPaginaAtual.map(reserva => {
                  const expirada = isExpirada(reserva.data_validade, reserva.status);
                  
                  return (
                    <tr key={reserva.id} className={expirada ? 'table-warning' : ''}>
                      <td>{reserva.id}</td>
                      <td>{formatarTexto(reserva.usuario_nome)}</td>
                      <td>
                        <Badge bg="info" text="dark">
                          {reserva.usuario_tipo}
                        </Badge>
                      </td>
                      <td>
                        <div>
                          <strong>{formatarTexto(reserva.livro_titulo)}</strong>
                          <br />
                          <small className="text-muted">
                            {reserva.autor_nome}
                          </small>
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
                                className="btn-sm-custom btn-edit"
                                onClick={() => onEdit(reserva.id)}
                                title="Editar reserva"
                              >
                                <FaEdit />
                              </button>
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