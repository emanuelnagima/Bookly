import { useState, useEffect } from 'react';
import { Card, Table, Form, InputGroup, Button, Badge, Row, Col } from 'react-bootstrap';
import { FaEdit, FaTrash, FaSearch, FaChevronLeft, FaChevronRight, FaSyncAlt, FaCheckCircle } from 'react-icons/fa';
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

  useEffect(() => {
    setPaginaAtual(1);
  }, [termoBusca, filtroStatus]);

  const emprestimosFiltrados = emprestimos.filter(emprestimo => {
    if (!termoBusca && filtroStatus === 'todos') return true;

    const termo = termoBusca.toLowerCase();
    const matchesBusca = !termoBusca || (
      (emprestimo.usuario_nome || '').toLowerCase().includes(termo) ||
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
      return <Badge bg="secondary">Finalizado</Badge>;
    }
    
    if (status === 'atrasado') {
      return <Badge bg="danger">Atrasado</Badge>;
    }
    
    if (devolucao < hoje) {
      return <Badge bg="danger">Atrasado</Badge>;
    }
    
    return <Badge bg="success">Ativo</Badge>;
  };

  const isAtrasado = (dataDevolucao, status) => {
    if (status === 'finalizado') return false;
    const hoje = new Date();
    const devolucao = new Date(dataDevolucao);
    return devolucao < hoje;
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
                  <th>Data Empréstimo</th>
                  <th>Data Devolução</th>
                  <th>Livros</th>
                  <th>Status</th>
                  <th width="180px">Ações</th>
                </tr>
              </thead>
              <tbody>
                {emprestimosPaginaAtual.map(emprestimo => {
                  const atrasado = isAtrasado(emprestimo.data_devolucao_prevista, emprestimo.status);
                  
                  return (
                    <tr key={emprestimo.id} className={atrasado ? 'table-warning' : ''}>
                      <td>{emprestimo.id}</td>
                      <td>{formatarTexto(emprestimo.usuario_nome)}</td>
                      <td>
                        <Badge bg="info" text="dark">
                          {emprestimo.usuario_tipo}
                        </Badge>
                      </td>
                      <td>{formatarData(emprestimo.data_emprestimo)}</td>
                      <td className={atrasado ? 'text-danger fw-bold' : ''}>
                        {formatarData(emprestimo.data_devolucao_prevista)}
                      </td>
                      <td>
                        <Badge bg="primary">
                          {emprestimo.total_livros || 1} livro(s)
                        </Badge>
                      </td>
                      <td>
                        {getStatusBadge(emprestimo.status, emprestimo.data_devolucao_prevista)}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          {emprestimo.status === 'ativo' && (
                            <>
                              <button
                                className="btn-sm-custom btn-edit"
                                onClick={() => onEdit(emprestimo.id)}
                                title="Editar empréstimo"
                              >
                                <FaEdit />
                              </button>
                              <button
                                className="btn-sm-custom btn-success"
                                onClick={() => onRenovar(emprestimo.id)}
                                title="Renovar empréstimo"
                              >
                                <FaSyncAlt />
                              </button>
                              <button
                                className="btn-sm-custom btn-primary"
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