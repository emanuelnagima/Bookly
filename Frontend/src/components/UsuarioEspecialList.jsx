import { useState, useEffect } from 'react';
import { Card, Table, Form, InputGroup, Button, Row, Col, Modal, Badge } from 'react-bootstrap';
import { FaEdit, FaTrash, FaSearch, FaChevronLeft, FaChevronRight, FaUsers, FaInfoCircle, FaUser, FaEnvelope, FaPhone, FaIdCard, FaUserTag, FaCalendarAlt  } from 'react-icons/fa';

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
  }
  return telefone;
};

const getTipoUsuarioBadge = (tipo) => {
  switch (tipo?.toLowerCase()) {
    case 'administrador':
      return <Badge bg="danger">Administrador</Badge>;
    case 'bibliotecario':
      return <Badge bg="info" className="text-dark">Bibliotecário</Badge>;
    case 'funcionario':
      return <Badge bg="warning" className="text-dark">Funcionário</Badge>;
    case 'visitante':
      return <Badge bg="secondary">Visitante</Badge>;
    default:
      return <Badge bg="light" className="text-dark">{tipo || 'Não definido'}</Badge>;
  }
};

const UsuarioEspecialList = ({ usuarios, onDelete, onEdit, loading }) => {
  const [termoBusca, setTermoBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [ordenacao, setOrdenacao] = useState('nome_asc');
  const [filtroTipo, setFiltroTipo] = useState('todos');

  const [showDetalhesModal, setShowDetalhesModal] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);

  // Resetar página quando filtros mudarem
  useEffect(() => {
    setPaginaAtual(1);
  }, [termoBusca, ordenacao, filtroTipo]);

  // Função de ordenação
const ordenarUsuarios = (usuarios) => {
  return [...usuarios].sort((a, b) => {
    switch (ordenacao) {
      case 'nome_asc':
        return formatarNome(a.nome_completo).localeCompare(formatarNome(b.nome_completo));
      case 'nome_desc':
        return formatarNome(b.nome_completo).localeCompare(formatarNome(a.nome_completo));
      case 'tipo_asc':
        return (a.tipo_usuario || '').localeCompare(b.tipo_usuario || '');
      case 'tipo_desc':
        return (b.tipo_usuario || '').localeCompare(a.tipo_usuario || '');
      case 'data_nascimento_asc':
        return new Date(a.data_nascimento || 0) - new Date(b.data_nascimento || 0);
      case 'data_nascimento_desc':
        return new Date(b.data_nascimento || 0) - new Date(a.data_nascimento || 0);
      case 'data_cadastro_asc':
        return new Date(a.data_cadastro || a.createdAt) - new Date(b.data_cadastro || b.createdAt);
      case 'data_cadastro_desc':
        return new Date(b.data_cadastro || b.createdAt) - new Date(a.data_cadastro || a.createdAt);
      default:
        return formatarNome(a.nome_completo).localeCompare(formatarNome(b.nome_completo));
    }
  });
};
  // Filtrar usuários
  const usuariosFiltrados = usuarios.filter(usuario => {
    if (!termoBusca && filtroTipo === 'todos') return true;

    const termo = termoBusca.toLowerCase();
    const matchesBusca = !termoBusca || (
      (usuario.nome_completo || '').toLowerCase().includes(termo) ||
      (usuario.email || '').toLowerCase().includes(termo) ||
      (usuario.tipo_usuario || '').toLowerCase().includes(termo) ||
      (usuario.cpf || '').toString().includes(termo) ||
      (usuario.telefone || '').toString().includes(termo) ||
      (usuario.departamento || '').toLowerCase().includes(termo)
    );

    const matchesTipo = filtroTipo === 'todos' || (usuario.tipo_usuario || '') === filtroTipo;

    return matchesBusca && matchesTipo;
  });

  // Aplicar ordenação
  const usuariosOrdenados = ordenarUsuarios(usuariosFiltrados);

  // Calcular paginação
  const totalPaginas = Math.ceil(usuariosOrdenados.length / ITENS_POR_PAGINA);
  
  // Garantir que a página atual seja válida
  const paginaValida = Math.max(1, Math.min(paginaAtual, totalPaginas));
  if (paginaValida !== paginaAtual) {
    setPaginaAtual(paginaValida);
  }

  const inicio = (paginaValida - 1) * ITENS_POR_PAGINA;
  const fim = inicio + ITENS_POR_PAGINA;
  const usuariosPaginaAtual = usuariosOrdenados.slice(inicio, fim);

  const handlePaginaAnterior = () => {
    if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1);
  };

  const handleProximaPagina = () => {
    if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1);
  };

  // Função para abrir modal com detalhes do usuário
  const handleVerDetalhes = (usuario) => {
    setUsuarioSelecionado(usuario);
    setShowDetalhesModal(true);
  };

  // Fechar modal
  const handleCloseDetalhesModal = () => {
    setShowDetalhesModal(false);
    setUsuarioSelecionado(null);
  };

  // Obter tipos únicos para o filtro
  const tiposUnicos = [...new Set(usuarios.map(usuario => usuario.tipo_usuario).filter(Boolean))];

  return (
    <Card>
      <Card.Header className="bg-primary text-white d-flex flex-wrap justify-content-between align-items-center">
        <div className="d-flex align-items-center mb-2 mb-md-0">
          <FaUsers
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
          <h5 className="mb-0">Usuários Especiais</h5>
        </div>

        <div className="d-flex align-items-center gap-3">
          {/* Filtro de Tipo */}
          <Form.Select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            style={{ width: 'auto', minWidth: '150px' }}
            size="sm"
          >
            <option value="todos">Todos os tipos</option>
            {tiposUnicos.map(tipo => (
              <option key={tipo} value={tipo}>{tipo}</option>
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
            <option value="tipo_asc">Tipo (A-Z)</option>
            <option value="tipo_desc">Tipo (Z-A)</option>
            <option value="data_nascimento_asc">Data Nasc. (mais antigo)</option>
            <option value="data_nascimento_desc">Data Nasc. (mais recente)</option>
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
                placeholder="Buscar usuários..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
              />
            </InputGroup>
          </div>
        </div>
      </Card.Header>

      <Card.Body>
        {loading ? (
          <p className="text-center text-muted py-4">Carregando usuários...</p>
        ) : usuariosPaginaAtual.length === 0 ? (
          <p className="text-muted text-center py-4">
            {termoBusca || filtroTipo !== 'todos' ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado'}
          </p>
        ) : (
          <>
            <Table striped hover responsive className="align-middle">
              <thead>
                  <tr>
                    <th width="80px">ID</th>
                    <th>Nome Completo</th>
                    <th width="120px">CPF</th>
                    <th width="140px">Data Nasc.</th>
                    <th width="120px">Tipo</th>
                    <th width="140px">Telefone</th>
                    <th width="200px" className="text-center">Ações</th>
                  </tr>
                </thead>
              <tbody>
                {usuariosPaginaAtual.map(usuario => (
               <tr key={usuario.id}>
                  <td className="fw-bold">#{usuario.id}</td>

                  {/* Coluna Nome */}
                  <td>
                    <div className="fw-semibold">{formatarNome(usuario.nome_completo)}</div>
                    <small className="text-muted">{usuario.email}</small>
                  </td>

                  {/* Coluna CPF */}
                  <td className="text-nowrap">
                    {usuario.cpf ? formatarCPF(usuario.cpf) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>

                  {/* Coluna Data de Nascimento */}
                  <td className="text-nowrap">
                    {usuario.data_nascimento ? formatarData(usuario.data_nascimento) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>

                  {/* Coluna Tipo */}
                  <td>
                    {usuario.tipo_usuario ? (
                      <span>
                        {usuario.tipo_usuario}
                      </span>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>

                  {/* Coluna Telefone */}
                  <td className="text-nowrap">
                    {formatarTelefone(usuario.telefone)}
                  </td>

                  {/* Coluna Ações */}
                  <td>
                    <div className="d-flex gap-2 justify-content-center">
                      <button
                        className="btn-sm-custom btn-renovar"
                        onClick={() => handleVerDetalhes(usuario)}
                        title="Ver detalhes do usuário"
                      >
                        <FaInfoCircle />
                      </button>

                      <button
                        className="btn-sm-custom btn-edit"
                        onClick={() => onEdit(usuario.id)}
                        title="Editar usuário"
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="btn-sm-custom btn-danger"
                        onClick={() => onDelete(usuario.id)}
                        title="Excluir usuário"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
                ))}
              </tbody>
            </Table>

            {/* Modal para mostrar detalhes do usuário */}
            <Modal show={showDetalhesModal} onHide={handleCloseDetalhesModal} size="lg">
              <Modal.Header closeButton closeVariant="white" className="bg-primary text-white">
  <Modal.Title className="d-flex align-items-center">
    <FaUser className="me-2" />
    Usuário #{usuarioSelecionado?.id} - Detalhes
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
                      <strong><FaUser className="me-2 text-muted" />Nome:</strong> {formatarNome(usuarioSelecionado?.nome_completo)}
                    </p>
                    <p className="mb-2">
                      <strong><FaIdCard className="me-2 text-muted" />CPF: </strong> 
                      {usuarioSelecionado?.cpf ? formatarCPF(usuarioSelecionado.cpf) : 'Não informado'}
                    </p>
                    {usuarioSelecionado?.data_nascimento && (
                      <p className="mb-2">
                        <strong><FaCalendarAlt className="me-2 text-muted" />Data de Nascimento:</strong> {formatarData(usuarioSelecionado.data_nascimento)}
                      </p>
                    )}
                  </Col>
                  <Col md={6}>
                    <p className="mb-2">
                      <strong><FaEnvelope className="me-2 text-muted" />Email:</strong> {usuarioSelecionado?.email || 'Não informado'}
                    </p>
                    <p className="mb-2">
                      <strong><FaPhone className="me-2 text-muted" />Telefone:</strong> {formatarTelefone(usuarioSelecionado?.telefone) || 'Não informado'}
                    </p>
                  </Col>
                </Row>
                </div>

                {/* SEÇÃO: Informações do Usuário */}
                <div className="p-3 border rounded bg-white">
                  <h5 className="fw-bold mb-3 text-primary border-bottom pb-2 d-flex align-items-center">
                    <FaUserTag className="me-2" />
                    Informações do Usuário
                  </h5>
                  <Row>
                    <Col md={6}>
                      <p className="mb-2">
                        <strong>Tipo:</strong> 
                        <span className="ms-2">
                          {(usuarioSelecionado?.tipo_usuario)}
                        </span>
                      </p>
                      {usuarioSelecionado?.departamento && (
                        <p className="mb-2">
                          <strong>Departamento:</strong> 
                          <span className="ms-2">
                            {usuarioSelecionado.departamento}
                          </span>
                        </p>
                      )}
                    </Col>
                    <Col md={6}>
                      {usuarioSelecionado?.data_cadastro && (
                        <p className="mb-2">
                          <strong>Data de Cadastro:</strong> 
                          <span className="ms-2">
                            {formatarData(usuarioSelecionado.data_cadastro)}
                          </span>
                        </p>
                      )}
                      {usuarioSelecionado?.status && (
                        <p className="mb-2">
                          <strong>Status:</strong> 
                          <Badge bg={usuarioSelecionado.status === 'ativo' ? 'success' : 'secondary'} className="ms-2">
                            {usuarioSelecionado.status === 'ativo' ? 'Ativo' : 'Inativo'}
                          </Badge>
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

            {/* Paginação  */}
            {totalPaginas > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-4">
                <div className="text-muted small">
                  Mostrando {inicio + 1} a {Math.min(fim, usuariosOrdenados.length)} de {usuariosOrdenados.length} usuários
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

export default UsuarioEspecialList;