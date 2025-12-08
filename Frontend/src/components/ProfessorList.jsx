import { useState, useEffect } from 'react';
import { Card, Table, Form, InputGroup, Button, Row, Col, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaSearch, FaChevronLeft, FaChevronRight, FaUserTie, FaInfoCircle, FaUser, FaEnvelope, FaRegCalendarPlus, FaPhone, FaIdCard, FaBuilding, FaAddressCard, FaBook, FaCalendarAlt } from 'react-icons/fa';

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

const formatarCPF = (cpf) => {
  if (!cpf) return '-';

  const cpfLimpo = cpf.toString().replace(/\D/g, '');

  if (cpfLimpo.length === 11) {
    return `${cpfLimpo.substring(0, 3)}.${cpfLimpo.substring(3, 6)}.${cpfLimpo.substring(6, 9)}-${cpfLimpo.substring(9)}`;
  }

  return cpf;
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

const ProfessorList = ({ professores, onDelete, onEdit, loading }) => {
  const [termoBusca, setTermoBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [ordenacao, setOrdenacao] = useState('nome_asc');
  const [filtroDepartamento, setFiltroDepartamento] = useState('todos');
  const [showDetalhesModal, setShowDetalhesModal] = useState(false);
  const [professorSelecionado, setProfessorSelecionado] = useState(null);

  // Resetar página quando filtros mudarem
  useEffect(() => {
    setPaginaAtual(1);
  }, [termoBusca, ordenacao, filtroDepartamento]);

  // Função de ordenação
  const ordenarProfessores = (professores) => {
    return [...professores].sort((a, b) => {
      switch (ordenacao) {
        case 'nome_asc':
          return formatarTexto(a.nome).localeCompare(formatarTexto(b.nome));
        case 'nome_desc':
          return formatarTexto(b.nome).localeCompare(formatarTexto(a.nome));
        case 'matricula_asc':
          return (a.matricula || '').localeCompare(b.matricula || '');
        case 'matricula_desc':
          return (b.matricula || '').localeCompare(a.matricula || '');
        case 'departamento_asc':
          return (a.departamento || '').localeCompare(b.departamento || '');
        case 'departamento_desc':
          return (b.departamento || '').localeCompare(a.departamento || '');
        case 'data_cadastro_asc':
          return new Date(a.data_cadastro || a.createdAt) - new Date(b.data_cadastro || b.createdAt);
        case 'data_cadastro_desc':
          return new Date(b.data_cadastro || b.createdAt) - new Date(a.data_cadastro || a.createdAt);
        default:
          return formatarTexto(a.nome).localeCompare(formatarTexto(b.nome));
      }
    });
  };

  // Filtrar professores
  const professoresFiltrados = professores.filter(professor => {
    if (!termoBusca && filtroDepartamento === 'todos') return true;

    const termo = termoBusca.toLowerCase();
    const matchesBusca = !termoBusca || (
      (professor.nome || '').toLowerCase().includes(termo) ||
      (professor.matricula || '').toString().toLowerCase().includes(termo) ||
      (professor.departamento || '').toLowerCase().includes(termo) ||
      (professor.email || '').toLowerCase().includes(termo) ||
      (professor.telefone || '').toString().includes(termo) ||
      (professor.cpf || '').toString().includes(termo)
    );

    const matchesDepartamento = filtroDepartamento === 'todos' || (professor.departamento || '') === filtroDepartamento;

    return matchesBusca && matchesDepartamento;
  });

  // Aplicar ordenação
  const professoresOrdenados = ordenarProfessores(professoresFiltrados);

  // Calcular paginação
  const totalPaginas = Math.ceil(professoresOrdenados.length / ITENS_POR_PAGINA);

  // Garantir que a página atual seja válida
  const paginaValida = Math.max(1, Math.min(paginaAtual, totalPaginas));
  if (paginaValida !== paginaAtual) {
    setPaginaAtual(paginaValida);
  }

  const inicio = (paginaValida - 1) * ITENS_POR_PAGINA;
  const fim = inicio + ITENS_POR_PAGINA;
  const professoresPaginaAtual = professoresOrdenados.slice(inicio, fim);

  const handlePaginaAnterior = () => {
    if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1);
  };

  const handleProximaPagina = () => {
    if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1);
  };

  // Função para abrir modal com detalhes do professor
  const handleVerDetalhes = (professor) => {
    console.log('Dados do professor:', professor);
    setProfessorSelecionado(professor);
    setShowDetalhesModal(true);
  };

  // Fechar modal
  const handleCloseDetalhesModal = () => {
    setShowDetalhesModal(false);
    setProfessorSelecionado(null);
  };

  // Obter departamentos únicos para o filtro
  const departamentosUnicos = [...new Set(professores.map(professor => professor.departamento).filter(Boolean))];

  return (
    <Card>
      <Card.Header className="bg-primary text-white d-flex flex-wrap justify-content-between align-items-center">
        <div className="d-flex align-items-center mb-2 mb-md-0">
          <FaUserTie
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
          <h5 className="mb-0">Professores</h5>
        </div>

        <div className="d-flex align-items-center gap-3">
          {/* Filtro de Departamento */}
          <Form.Select
            value={filtroDepartamento}
            onChange={(e) => setFiltroDepartamento(e.target.value)}
            style={{ width: 'auto', minWidth: '150px' }}
            size="sm"
          >
            <option value="todos">Todos os departamentos</option>
            {departamentosUnicos.map(departamento => (
              <option key={departamento} value={departamento}>{departamento}</option>
            ))}
          </Form.Select>

          {/* Seletor de Ordenação */}
          <Form.Select
            value={ordenacao}
            onChange={(e) => setOrdenacao(e.target.value)}
            style={{ width: 'auto', minWidth: '200px' }}
            size="sm"
          >
            <option value="nome_asc">Nome (A-Z)</option>
            <option value="nome_desc">Nome (Z-A)</option>
            <option value="matricula_asc">Matrícula (crescente)</option>
            <option value="matricula_desc">Matrícula (decrescente)</option>
            <option value="departamento_asc">Departamento (A-Z)</option>
            <option value="departamento_desc">Departamento (Z-A)</option>
            <option value="data_cadastro_asc">Data Cad. (mais antigo)</option>
            <option value="data_cadastro_desc">Data Cad. (mais recente)</option>
          </Form.Select>

          {/* Barra de pesquisa */}
          <div style={{ minWidth: '200px', maxWidth: '300px' }}>
            <InputGroup size="sm">
              <InputGroup.Text className="bg-light text-primary">
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Buscar professores..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
              />
            </InputGroup>
          </div>
        </div>
      </Card.Header>

      <Card.Body>
        {loading ? (
          <p className="text-center text-muted py-4">Carregando professores...</p>
        ) : professoresPaginaAtual.length === 0 ? (
          <p className="text-muted text-center py-4">
            {termoBusca || filtroDepartamento !== 'todos' ? 'Nenhum professor encontrado' : 'Nenhum professor cadastrado'}
          </p>
        ) : (
          <>
            <Table striped hover responsive className="align-middle">
              <thead>
                <tr>
                  <th width="80px">ID</th>
                  <th>Nome Completo</th>
                  <th width="120px">Matrícula</th>
                  <th width="140px">Data Nasc.</th>
                  <th width="120px">Departamento</th>
                  <th width="140px">Telefone</th>
                  <th width="200px" className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {professoresPaginaAtual.map(professor => (
                  <tr key={professor.id}>
                    <td className="fw-bold">#{professor.id}</td>

                    {/* Coluna Nome */}
                    <td>
                      <div className="fw-semibold">{formatarTexto(professor.nome)}</div>
                      <small className="text-muted">{professor.email}</small>
                    </td>

                    {/* Coluna Matrícula */}
                    <td>
                      <span>
                        {professor.matricula}
                      </span>
                    </td>

                    {/* Coluna Data de Nascimento */}
                    <td className="text-nowrap">
                      {professor.data_nascimento || professor.dataNascimento ?
                        formatarData(professor.data_nascimento || professor.dataNascimento) :
                        '-'
                      }
                    </td>

                    {/* Coluna Departamento */}
                    <td>
                      {professor.departamento ? (
                        <span>
                          {professor.departamento}
                        </span>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>

                    {/* Coluna Telefone */}
                    <td className="text-nowrap">
                      {formatarTelefone(professor.telefone)}
                    </td>

                    {/* Coluna Ações */}
                    <td>
                      <div className="d-flex gap-2 justify-content-center">
                        <button
                          className="btn-sm-custom btn-renovar"
                          onClick={() => handleVerDetalhes(professor)}
                          title="Ver detalhes do professor"
                        >
                          <FaInfoCircle />
                        </button>

                        <button
                          className="btn-sm-custom btn-edit"
                          onClick={() => onEdit(professor.id)}
                          title="Editar professor"
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="btn-sm-custom btn-danger"
                          onClick={() => onDelete(professor.id)}
                          title="Excluir professor"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Modal para mostrar detalhes do professor */}
            <Modal show={showDetalhesModal} onHide={handleCloseDetalhesModal} size="lg">
              <Modal.Header closeButton closeVariant="white" className="bg-primary text-white">
                <Modal.Title className="d-flex align-items-center">
                  <FaUserTie className="me-2" />
                  Professor #{professorSelecionado?.id} - Detalhes
                </Modal.Title>
              </Modal.Header>

              <Modal.Body className="p-4">
                {/* SEÇÃO: Informações Pessoais */}
                <div className="mb-4 p-3 border rounded bg-white">
                  <h5 className="fw-bold mb-3 text-primary border-bottom pb-2 d-flex align-items-center">
                    <FaUser className="me-2" />
                    Informações Pessoais
                  </h5>
                  <Row>
                    <Col md={6}>
                      <p className="mb-2">
                        <strong><FaUser className="me-2 text-muted" />Nome:</strong> {formatarTexto(professorSelecionado?.nome)}
                      </p>
                      <p className="mb-2">
                        <strong><FaIdCard className="me-2 text-muted" />CPF:</strong>
                        {professorSelecionado?.cpf ? formatarCPF(professorSelecionado.cpf) : 'Não informado'}
                      </p>
                      {professorSelecionado?.data_nascimento && (
                        <p className="mb-2">
                          <strong><FaCalendarAlt className="me-2 text-muted" />Data de Nascimento:</strong> {formatarData(professorSelecionado.data_nascimento)}
                        </p>
                      )}
                    </Col>
                    <Col md={6}>
                      <p className="mb-2">
                        <strong><FaEnvelope className="me-2 text-muted" />Email:</strong> {professorSelecionado?.email || 'Não informado'}
                      </p>
                      <p className="mb-2">
                        <strong><FaPhone className="me-2 text-muted" />Telefone:</strong> {formatarTelefone(professorSelecionado?.telefone) || 'Não informado'}
                      </p>
                    </Col>
                  </Row>
                </div>

                {/* SEÇÃO: Informações Profissionais */}
                <div className="p-3 border rounded bg-white">
                  <h5 className="fw-bold mb-3 text-primary border-bottom pb-2 d-flex align-items-center">
                    <FaUserTie className="me-2" />
                    Informações Profissionais
                  </h5>
                  <Row>
                    <Col md={6}>
                      <p className="mb-2">
                        <FaAddressCard className="me-1" />
                        <strong>Matrícula:</strong>
                        <span className="ms-2 fw-semibold">
                          {professorSelecionado?.matricula}
                        </span>
                      </p>
                      <p className="mb-2">
                        <strong><FaBuilding className="me-1 text-muted" />Departamento:</strong>
                        <span className="ms-2">
                          {professorSelecionado?.departamento || 'Não informado'}
                        </span>
                      </p>
                    </Col>
                    <Col md={6}>
                      {professorSelecionado?.data_cadastro && (
                        <p className="mb-2">
                          <FaRegCalendarPlus className="me-1" />
                          <strong>Data de Cadastro:</strong>
                          <span className="ms-2">
                            {formatarData(professorSelecionado.data_cadastro)}
                          </span>
                        </p>
                      )}
                      {professorSelecionado?.tipo_especial && (
                        <p className="mb-2">
                          <strong>Tipo Especial:</strong>
                          <span className="ms-2">
                            {formatarTexto(professorSelecionado.tipo_especial)}
                          </span>
                        </p>
                      )}
                    </Col>
                  </Row>
                </div>
              </Modal.Body>

              <Modal.Footer>
                <Button variant="paginacao" onClick={handleCloseDetalhesModal}>
                  Fechar
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Paginação */}
            {totalPaginas > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-4">
                <div className="text-muted small">
                  Mostrando {inicio + 1} a {Math.min(fim, professoresOrdenados.length)} de {professoresOrdenados.length} professores
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

export default ProfessorList;