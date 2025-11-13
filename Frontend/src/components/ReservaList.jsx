import { useState, useEffect } from 'react';
import { Card, Table, Form, InputGroup, Button, Badge, Row, Col, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaSearch, FaChevronLeft, FaChevronRight, FaTimesCircle, FaCheckCircle, FaBook, FaList, FaExclamationTriangle, FaClipboardList } from 'react-icons/fa';
import { FaCalendarAlt } from "react-icons/fa";
import { FaExchangeAlt } from 'react-icons/fa';
import disponibilidadeService from '../services/disponibilidadeService';
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

const ReservaList = ({ reservas, onDelete, onCancelar, onConcluir, onConverterEmprestimo, loading }) => {  const [termoBusca, setTermoBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [ordenacao, setOrdenacao] = useState('data_reserva_desc');

  const [showLivroModal, setShowLivroModal] = useState(false);
  const [livroSelecionado, setLivroSelecionado] = useState(null);
  const [reservaSelecionada, setReservaSelecionada] = useState(null);

  // Resetar página quando filtros mudarem
  useEffect(() => {
    setPaginaAtual(1);
  }, [termoBusca, filtroStatus, ordenacao]);

  // Função de ordenação consistente
  const ordenarReservas = (reservas) => {
    return [...reservas].sort((a, b) => {
      switch (ordenacao) {
        case 'data_reserva_desc':
          return new Date(b.data_reserva) - new Date(a.data_reserva);
        case 'data_reserva_asc':
          return new Date(a.data_reserva) - new Date(b.data_reserva);
        case 'data_validade_desc':
          return new Date(b.data_validade) - new Date(a.data_validade);
        case 'data_validade_asc':
          return new Date(a.data_validade) - new Date(b.data_validade);
        case 'usuario_asc':
          return (a.usuario || '').localeCompare(b.usuario || '', 'pt-BR', { sensitivity: 'base' });
        case 'usuario_desc':
          return (b.usuario || '').localeCompare(a.usuario || '', 'pt-BR', { sensitivity: 'base' });
        default:
          return new Date(b.data_reserva) - new Date(a.data_reserva);
      }
    });
  };

  // Filtrar reservas
  const reservasFiltradas = reservas.filter(reserva => {
    if (!termoBusca && filtroStatus === 'todos') return true;

    const termo = termoBusca.toLowerCase();
    const matchesBusca = !termoBusca || (
      (reserva.usuario || '').toLowerCase().includes(termo) ||
      (reserva.livro_titulo || '').toLowerCase().includes(termo) ||
      (reserva.id || '').toString().toLowerCase().includes(termo)
    );

    const hoje = new Date();
    const validade = new Date(reserva.data_validade);

    //  Calcula status dinâmico
    let statusCalculado = reserva.status;
    if (reserva.status === 'ativa' && validade < hoje) {
      statusCalculado = 'expirada';
    }

    const matchesStatus =
      filtroStatus === 'todos' || statusCalculado === filtroStatus;

    return matchesBusca && matchesStatus;
  });

  // Aplicar ordenação
  const reservasOrdenadas = ordenarReservas(reservasFiltradas);

  // Calcular paginação
  const totalPaginas = Math.ceil(reservasOrdenadas.length / ITENS_POR_PAGINA);
  
  // Garantir que a página atual seja válida
  const paginaValida = Math.max(1, Math.min(paginaAtual, totalPaginas));
  if (paginaValida !== paginaAtual) {
    setPaginaAtual(paginaValida);
  }

  const inicio = (paginaValida - 1) * ITENS_POR_PAGINA;
  const fim = inicio + ITENS_POR_PAGINA;
  const reservasPaginaAtual = reservasOrdenadas.slice(inicio, fim);

  const handlePaginaAnterior = () => {
    if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1);
  };

  const handleProximaPagina = () => {
    if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1);
  };

  // Função para verificar situação da reserva - ATUALIZADA
  const verificarSituacao = (dataValidade, status) => {
    if (status === 'concluida') {
      return { situacao: 'concluida', classe: 'text-dark', texto: 'Concluída' };
    }

    if (status === 'cancelada') {
      return { situacao: 'cancelada', classe: 'text-dark', texto: 'Cancelada' };
    }

    const hoje = new Date();
    const validade = new Date(dataValidade);

    if (validade < hoje) {
      return { situacao: 'expirada', classe: 'text-warning', texto: 'Expirada' };
    }

    // Verificar se está próximo do vencimento (2 dias ou menos)
    const diasRestantes = Math.ceil((validade - hoje) / (1000 * 60 * 60 * 24));
    if (diasRestantes <= 2) {
      return { situacao: 'proximo_vencimento', classe: 'text-warning', texto: `Vence em ${diasRestantes} dia(s)` };
    }

    return { situacao: 'ativa', classe: '', texto: 'Ativa' };
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
    // **CORREÇÃO: Pegar o primeiro livro da lista de livros**
    const primeiroLivro = reserva.livros && reserva.livros.length > 0 ? reserva.livros[0] : null;

    if (primeiroLivro) {
      setLivroSelecionado({
        titulo: primeiroLivro.livro_titulo,
        imagem: primeiroLivro.livro_imagem,
        isbn: primeiroLivro.livro_isbn,
        autor: primeiroLivro.autor_nome
      });
    } else {
      setLivroSelecionado(null);
    }

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
            <option value="ativa">Ativas</option>
            <option value="expirada">Expiradas</option>
            <option value="cancelada">Canceladas</option>
            <option value="concluida">Finalizados</option>
          </Form.Select>

          {/* Seletor de Ordenação Melhorado */}
          <Form.Select
            value={ordenacao}
            onChange={(e) => setOrdenacao(e.target.value)}
            style={{ width: 'auto', minWidth: '200px' }}
            size="sm"
          >
            <option value="data_reserva_desc">Data reserva (mais recente)</option>
            <option value="data_reserva_asc">Data reserva (mais antigo)</option>
            <option value="data_validade_asc">Data validade (mais próxima)</option>
            <option value="data_validade_desc">Data validade (mais distante)</option>
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
            <Table striped hover responsive className="align-middle">
              <thead>
                <tr>
                  <th width="80px">ID</th>
                  <th>Usuário</th>
                  <th width="120px">Tipo</th>
                  <th width="150px">Livro</th>
                  <th width="140px">Data Reserva</th>
                  <th width="140px">Data Validade</th>
                  <th width="120px">Status</th>
                  <th width="120px">Situação</th>
                  <th width="200px" className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {reservasPaginaAtual.map(reserva => {
                  const expirada = isExpirada(reserva.data_validade, reserva.status);
                  const situacao = verificarSituacao(reserva.data_validade, reserva.status);

                  return (
                    <tr key={reserva.id} className={expirada ? 'linha-atrasada' : ''}>
                      <td className="fw-bold">#{reserva.id}</td>

                      <td>
                        <div className="fw-semibold">{formatarTexto(reserva.usuario)}</div>
                      </td>

                      <td>
                        {reserva.usuario_tipo
                          ? (reserva.usuario_tipo.split('_')[0].toLowerCase() === 'usuario'
                            ? 'Usuário'
                            : reserva.usuario_tipo.split('_')[0].charAt(0).toUpperCase() + reserva.usuario_tipo.split('_')[0].slice(1))
                          : ''
                        }
                      </td>

                      <td>
                        <Button
                          variant="paginacao"
                          size="sm"
                          onClick={() => handleVerLivro(reserva)}
                          title="Ver detalhes do livro"
                          className="d-flex align-items-center w-100 justify-content-center"
                        >
                          <FaClipboardList className="me-1" />
                          Ver Detalhes
                        </Button>
                      </td>

                      <td className="text-nowrap">{formatarData(reserva.data_reserva)}</td>
                      
                      <td className={`text-nowrap ${expirada ? 'text-warning fw-bold' : ''}`}>
                        {expirada && <FaExclamationTriangle className="me-1" />}
                        {formatarData(reserva.data_validade)}
                      </td>

                      <td>
                        {getStatusBadge(reserva.status, reserva.data_validade)}
                      </td>

                      {/* Coluna Situação - ATUALIZADA */}
                     {/* Coluna Situação - ATUALIZADA */}
<td>
  <span className={`small ${situacao.classe}`}>
    {situacao.texto}
  </span>
</td>

                      <td>
                        <div className="d-flex gap-2 justify-content-center">
                          {reserva.status === 'ativa' && (
                            <>
                             <button
                                className="btn-sm-custom btn-primary"
                                onClick={() => onConverterEmprestimo(reserva.id)}
                                title="Converter em empréstimo"
                                disabled={loading}
                              >
                                <FaExchangeAlt />
                              </button>
                              <button
                                className="btn-sm-custom btn-renovar"
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

                              <button
                                className="btn-sm-custom btn-danger"
                                onClick={() => onDelete(reserva.id)}
                                title="Excluir reserva"
                              >
                                <FaTrash />
                              </button>
                            </>
                          )}
                          {reserva.status !== 'ativa' && (
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

            {/* Modal para mostrar detalhes do livro */}
            <Modal show={showLivroModal} onHide={handleCloseLivroModal} size="lg">
              <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title className="d-flex align-items-center">
                  <FaBook className="me-2" />
                  Reserva #{reservaSelecionada?.id} - Detalhes
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
                        <strong>Nome:</strong> {formatarTexto(reservaSelecionada?.usuario)}
                      </p>
                      <p className="mb-2">
                        <strong>Email:</strong> {reservaSelecionada?.usuario_detalhes?.email || 'Não informado'}
                      </p>
                      <p className="mb-2">
                        <strong>Telefone:</strong> {formatarTelefone(reservaSelecionada?.usuario_detalhes?.telefone) || 'Não informado'}
                      </p>
                    </Col>
                    <Col md={6}>
                      <p className="mb-2">
                        <strong>Tipo:</strong> {formatarTexto(reservaSelecionada?.usuario_tipo)}
                      </p>
                      {reservaSelecionada?.usuario_detalhes?.turma && (
                        <p className="mb-2">
                          <strong>Turma:</strong> {reservaSelecionada.usuario_detalhes.turma}
                        </p>
                      )}
                      {reservaSelecionada?.usuario_detalhes?.departamento && (
                        <p className="mb-2">
                          <strong>Departamento:</strong> {reservaSelecionada.usuario_detalhes.departamento}
                        </p>
                      )}
                      {reservaSelecionada?.usuario_detalhes?.tipo_especial && (
                        <p className="mb-2">
                          <strong>Tipo Especial:</strong> {formatarTexto(reservaSelecionada.usuario_detalhes.tipo_especial)}
                        </p>
                      )}
                    </Col>
                  </Row>
                </div>

                {/* SEÇÃO: Informações da Reserva - ATUALIZADA */}
                <div className="mb-4 p-3 border rounded bg-white">
                  <h5 className="fw-bold mb-3 text-primary border-bottom pb-2">
                    Informações da Reserva
                  </h5>
                  <Row>
                    <Col md={6}>
                      <p className="mb-2">
                        <strong>Data da Reserva:</strong> {formatarData(reservaSelecionada?.data_reserva)}
                      </p>
                      <p className="mb-2">
                        <strong>Data de Validade:</strong> {formatarData(reservaSelecionada?.data_validade)}
                      </p>
                    </Col>
                    <Col md={6}>
                      <p className="mb-2">
                        <strong>Status:</strong> {getStatusBadge(reservaSelecionada?.status, reservaSelecionada?.data_validade)}
                      </p>
                      <p className="mb-2">
                        <strong>Situação:</strong>
                        <span className={`ms-2 ${verificarSituacao(reservaSelecionada?.data_validade, reservaSelecionada?.status).classe}`}>
                          {verificarSituacao(reservaSelecionada?.data_validade, reservaSelecionada?.status).texto}
                        </span>
                      </p>
                    </Col>
                  </Row>
                </div>

                {/* SEÇÃO: Livros Reservados */}
                <div className="p-3 border rounded bg-white">
                  <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                    <h5 className="fw-bold text-primary mb-0">Livros da Reserva</h5>
                    <small className="text-muted">
                      <strong>Total de livros:</strong> {reservaSelecionada?.livros?.length || 0}
                    </small>
                  </div>

                  {reservaSelecionada?.livros && reservaSelecionada.livros.length > 0 ? (
                    <div className="row">
                      {reservaSelecionada.livros.map((livro, index) => (
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
                                    <p className="mb-1">
                                      <strong>Autor:</strong> {formatarTexto(livro.autor_nome) || 'Não informado'}
                                    </p>
                                    <p className="mb-1">
                                      <strong>ISBN:</strong> {livro.livro_isbn || 'Não informado'}
                                    </p>
                                  </div>
                                  <div className="col-md-6">
                                    <p className="mb-1">
                                      <strong>Quantidade:</strong> {livro.quantidade || 1}
                                    </p>
                                    <p className="mb-0">
                                      <strong>ID do Livro:</strong> {livro.livro_id}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted text-center py-3">Nenhum livro encontrado nesta reserva</p>
                  )}
                </div>
              </Modal.Body>

              <Modal.Footer>
                <Button variant="paginacao" onClick={handleCloseLivroModal}>
                  Fechar
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Paginação Melhorada */}
            {totalPaginas > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-4">
                <div className="text-muted small">
                  Mostrando {inicio + 1} a {Math.min(fim, reservasOrdenadas.length)} de {reservasOrdenadas.length} reservas
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

export default ReservaList;