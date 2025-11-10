import { useState, useEffect } from 'react';
import { Card, Table, Form, InputGroup, Button, Row, Col, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaSearch, FaChevronLeft, FaChevronRight, FaGraduationCap, FaInfoCircle, FaBook, FaUser, FaEnvelope, FaPhone, FaIdCard, FaCalendarAlt, FaUsers } from 'react-icons/fa';

const ITENS_POR_PAGINA = 7;

const formatarNome = (nome) =>
  (nome || '')
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

const AlunoList = ({ alunos, onDelete, onEdit, loading }) => {
  const [termoBusca, setTermoBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [ordenacao, setOrdenacao] = useState('nome_asc');
  const [filtroTurma, setFiltroTurma] = useState('todos');

  const [showDetalhesModal, setShowDetalhesModal] = useState(false);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);

  // Resetar página quando filtros mudarem
  useEffect(() => {
    setPaginaAtual(1);
  }, [termoBusca, ordenacao, filtroTurma]);

  // Função de ordenação
  const ordenarAlunos = (alunos) => {
    return [...alunos].sort((a, b) => {
      switch (ordenacao) {
        case 'nome_asc':
          return formatarNome(a.nome).localeCompare(formatarNome(b.nome));
        case 'nome_desc':
          return formatarNome(b.nome).localeCompare(formatarNome(a.nome));
        case 'matricula_asc':
          return (a.matricula || '').localeCompare(b.matricula || '');
        case 'matricula_desc':
          return (b.matricula || '').localeCompare(a.matricula || '');
        case 'turma_asc':
          return (a.turma || '').localeCompare(b.turma || '');
        case 'turma_desc':
          return (b.turma || '').localeCompare(a.turma || '');
        case 'data_nascimento_asc':
          return new Date(a.data_nascimento || a.dataNascimento) - new Date(b.data_nascimento || b.dataNascimento);
        case 'data_nascimento_desc':
          return new Date(b.data_nascimento || b.dataNascimento) - new Date(a.data_nascimento || a.dataNascimento);
        default:
          return formatarNome(a.nome).localeCompare(formatarNome(b.nome));
      }
    });
  };

  // Filtrar alunos
  const alunosFiltrados = alunos.filter(aluno => {
    if (!termoBusca && filtroTurma === 'todos') return true;

    const termo = termoBusca.toLowerCase();
    const matchesBusca = !termoBusca || (
      (aluno.nome || '').toLowerCase().includes(termo) ||
      (aluno.matricula || '').toString().toLowerCase().includes(termo) ||
      (aluno.turma || '').toLowerCase().includes(termo) ||
      (aluno.email || '').toLowerCase().includes(termo) ||
      (aluno.cpf || '').toString().includes(termo) ||
      (aluno.telefone || '').toString().includes(termo)
    );

    const matchesTurma = filtroTurma === 'todos' || (aluno.turma || '') === filtroTurma;

    return matchesBusca && matchesTurma;
  });

  // Aplicar ordenação
  const alunosOrdenados = ordenarAlunos(alunosFiltrados);

  // Calcular paginação
  const totalPaginas = Math.ceil(alunosOrdenados.length / ITENS_POR_PAGINA);
  
  // Garantir que a página atual seja válida
  const paginaValida = Math.max(1, Math.min(paginaAtual, totalPaginas));
  if (paginaValida !== paginaAtual) {
    setPaginaAtual(paginaValida);
  }

  const inicio = (paginaValida - 1) * ITENS_POR_PAGINA;
  const fim = inicio + ITENS_POR_PAGINA;
  const alunosPaginaAtual = alunosOrdenados.slice(inicio, fim);

  const handlePaginaAnterior = () => {
    if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1);
  };

  const handleProximaPagina = () => {
    if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1);
  };

  // Função para abrir modal com detalhes do aluno
  const handleVerDetalhes = (aluno) => {
    setAlunoSelecionado(aluno);
    setShowDetalhesModal(true);
  };

  // Fechar modal
  const handleCloseDetalhesModal = () => {
    setShowDetalhesModal(false);
    setAlunoSelecionado(null);
  };

  // Obter turmas únicas para o filtro
  const turmasUnicas = [...new Set(alunos.map(aluno => aluno.turma).filter(Boolean))];

  return (
    <Card>
      <Card.Header className="bg-primary text-white d-flex flex-wrap justify-content-between align-items-center">
        <div className="d-flex align-items-center mb-2 mb-md-0">
          <FaGraduationCap
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
          <h5 className="mb-0">Alunos</h5>
        </div>

        <div className="d-flex align-items-center gap-3">
          {/* Filtro de Turma */}
          <Form.Select
            value={filtroTurma}
            onChange={(e) => setFiltroTurma(e.target.value)}
            style={{ width: 'auto', minWidth: '150px' }}
            size="sm"
          >
            <option value="todos">Todas as turmas</option>
            {turmasUnicas.map(turma => (
              <option key={turma} value={turma}>{turma}</option>
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
            <option value="turma_asc">Turma (A-Z)</option>
            <option value="turma_desc">Turma (Z-A)</option>
            <option value="data_nascimento_asc">Data Nasc. (mais antigo)</option>
            <option value="data_nascimento_desc">Data Nasc. (mais recente)</option>
          </Form.Select>

          {/* Barra de pesquisa */}
          <div style={{ minWidth: '200px', maxWidth: '300px' }}>
            <InputGroup size="sm">
              <InputGroup.Text className="bg-light text-primary">
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Buscar alunos..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
              />
            </InputGroup>
          </div>
        </div>
      </Card.Header>

      <Card.Body>
        {loading ? (
          <p className="text-center text-muted py-4">Carregando alunos...</p>
        ) : alunosPaginaAtual.length === 0 ? (
          <p className="text-muted text-center py-4">
            {termoBusca || filtroTurma !== 'todos' ? 'Nenhum aluno encontrado' : 'Nenhum aluno cadastrado'}
          </p>
        ) : (
          <>
            <Table striped hover responsive className="align-middle">
              <thead>
                <tr>
                  <th width="80px">ID</th>
                  <th>Nome Completo</th>
                  <th width="120px">Matrícula</th>
                  <th width="120px">Turma</th>
                  <th width="140px">Data Nasc.</th>
                  <th width="200px" className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {alunosPaginaAtual.map(aluno => (
                  <tr key={aluno.id}>
                    <td className="fw-bold">#{aluno.id}</td>

                    {/* Coluna Nome */}
                    <td>
                      <div className="fw-semibold">{formatarNome(aluno.nome)}</div>
                      <small className="text-muted">{aluno.email}</small>
                    </td>

                    {/* Coluna Matrícula */}
                    <td>
                      <span>
                        {aluno.matricula}
                      </span>
                    </td>

                    {/* Coluna Turma */}
                    <td>
                      {aluno.turma ? (
                        <span>
                          {aluno.turma}
                        </span>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>

                    {/* Coluna Data Nascimento */}
                    <td className="text-nowrap">
                      {formatarData(aluno.data_nascimento || aluno.dataNascimento)}
                    </td>

                    {/* Coluna Ações */}
                    <td>
                      <div className="d-flex gap-2 justify-content-center">
                        <button
                          className="btn-sm-custom btn-renovar"
                          onClick={() => handleVerDetalhes(aluno)}
                          title="Ver detalhes do aluno"
                        >
                          <FaInfoCircle />
                        </button>

                        <button
                          className="btn-sm-custom btn-edit"
                          onClick={() => onEdit(aluno.id)}
                          title="Editar aluno"
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="btn-sm-custom btn-danger"
                          onClick={() => onDelete(aluno.id)}
                          title="Excluir aluno"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Modal para mostrar detalhes do aluno */}
            <Modal show={showDetalhesModal} onHide={handleCloseDetalhesModal} size="lg">
              <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title className="d-flex align-items-center">
                  <FaUser className="me-2" />
                  Aluno #{alunoSelecionado?.id} - Detalhes
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
                        <strong><FaUser className="me-2 text-muted" />Nome:</strong> {formatarNome(alunoSelecionado?.nome)}
                      </p>
                      <p className="mb-2">
                        <strong><FaIdCard className="me-2 text-muted" />CPF:</strong> {formatarCPF(alunoSelecionado?.cpf)}
                      </p>
                      <p className="mb-2">
                        <strong><FaCalendarAlt className="me-2 text-muted" />Data de Nascimento:</strong> {formatarData(alunoSelecionado?.data_nascimento || alunoSelecionado?.dataNascimento)}
                      </p>
                    </Col>
                    <Col md={6}>
                      <p className="mb-2">
                        <strong><FaEnvelope className="me-2 text-muted" />Email:</strong> {alunoSelecionado?.email || 'Não informado'}
                      </p>
                      <p className="mb-2">
                        <strong><FaPhone className="me-2 text-muted" />Telefone:</strong> {formatarTelefone(alunoSelecionado?.telefone) || 'Não informado'}
                      </p>
                      <p className="mb-2">
                        <strong><FaUsers className="me-2 text-muted" />Turma:</strong> {alunoSelecionado?.turma ? (
                          <span> {alunoSelecionado.turma}</span>
                        ) : 'Não informada'}
                      </p>
                    </Col>
                  </Row>
                </div>

                {/* SEÇÃO: Informações Acadêmicas */}
                <div className="p-3 border rounded bg-white">
                  <h5 className="fw-bold mb-3 text-primary border-bottom pb-2 d-flex align-items-center">
                    <FaGraduationCap className="me-2" />
                    Informações Acadêmicas
                  </h5>
                  <Row>
                    <Col md={6}>
                      <p className="mb-2">
                        <strong>Matrícula:</strong> 
                        <span>
                          {alunoSelecionado?.matricula}
                        </span>
                      </p>
                    </Col>
                    <Col md={6}>
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

            {/* Paginação Melhorada */}
            {totalPaginas > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-4">
                <div className="text-muted small">
                  Mostrando {inicio + 1} a {Math.min(fim, alunosOrdenados.length)} de {alunosOrdenados.length} alunos
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

export default AlunoList;