import { useState, useEffect } from 'react';
import { Card, Table, Form, InputGroup, Button, Row, Col, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaSearch, FaChevronLeft, FaChevronRight, FaFeatherAlt, FaInfoCircle, FaUser, FaGlobeAmericas, FaCalendarAlt, FaRegCalendarPlus, FaBook } from 'react-icons/fa';

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

const AutorList = ({ autores, onDelete, onEdit, loading }) => {
  const [termoBusca, setTermoBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [ordenacao, setOrdenacao] = useState('nome_asc');
  const [filtroNacionalidade, setFiltroNacionalidade] = useState('todos');

  const [showDetalhesModal, setShowDetalhesModal] = useState(false);
  const [autorSelecionado, setAutorSelecionado] = useState(null);

  // Resetar página quando filtros mudarem
  useEffect(() => {
    setPaginaAtual(1);
  }, [termoBusca, ordenacao, filtroNacionalidade]);

  // Função de ordenação
  const ordenarAutores = (autores) => {
    return [...autores].sort((a, b) => {
      switch (ordenacao) {
        case 'nome_asc':
          return formatarNome(a.nome).localeCompare(formatarNome(b.nome));
        case 'nome_desc':
          return formatarNome(b.nome).localeCompare(formatarNome(a.nome));
        case 'nacionalidade_asc':
          return (a.nacionalidade || '').localeCompare(b.nacionalidade || '');
        case 'nacionalidade_desc':
          return (b.nacionalidade || '').localeCompare(a.nacionalidade || '');
        case 'data_nascimento_asc':
          return new Date(a.data_nascimento) - new Date(b.data_nascimento);
        case 'data_nascimento_desc':
          return new Date(b.data_nascimento) - new Date(a.data_nascimento);
        default:
          return formatarNome(a.nome).localeCompare(formatarNome(b.nome));
      }
    });
  };

  // Filtrar autores
  const autoresFiltrados = autores.filter(autor => {
    if (!termoBusca && filtroNacionalidade === 'todos') return true;

    const termo = termoBusca.toLowerCase();
    const matchesBusca = !termoBusca || (
      (autor.nome || '').toLowerCase().includes(termo) ||
      (autor.nacionalidade || '').toLowerCase().includes(termo) ||
      (autor.data_nascimento || '').toLowerCase().includes(termo) ||
      (autor.biografia || '').toLowerCase().includes(termo)
    );

    const matchesNacionalidade = filtroNacionalidade === 'todos' || (autor.nacionalidade || '') === filtroNacionalidade;

    return matchesBusca && matchesNacionalidade;
  });

  // Aplicar ordenação
  const autoresOrdenados = ordenarAutores(autoresFiltrados);

  // Calcular paginação
  const totalPaginas = Math.ceil(autoresOrdenados.length / ITENS_POR_PAGINA);
  
  // Garantir que a página atual seja válida
  const paginaValida = Math.max(1, Math.min(paginaAtual, totalPaginas));
  if (paginaValida !== paginaAtual) {
    setPaginaAtual(paginaValida);
  }

  const inicio = (paginaValida - 1) * ITENS_POR_PAGINA;
  const fim = inicio + ITENS_POR_PAGINA;
  const autoresPaginaAtual = autoresOrdenados.slice(inicio, fim);

  const handlePaginaAnterior = () => {
    if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1);
  };

  const handleProximaPagina = () => {
    if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1);
  };

  // Função para abrir modal com detalhes do autor
  const handleVerDetalhes = (autor) => {
    setAutorSelecionado(autor);
    setShowDetalhesModal(true);
  };

  // Fechar modal
  const handleCloseDetalhesModal = () => {
    setShowDetalhesModal(false);
    setAutorSelecionado(null);
  };

  // Obter nacionalidades únicas para o filtro
  const nacionalidadesUnicas = [...new Set(autores.map(autor => autor.nacionalidade).filter(Boolean))];

  return (
    <Card>
      <Card.Header className="bg-primary text-white d-flex flex-wrap justify-content-between align-items-center">
        <div className="d-flex align-items-center mb-2 mb-md-0">
          <FaFeatherAlt
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
          <h5 className="mb-0">Autores</h5>
        </div>

        <div className="d-flex align-items-center gap-3">
          {/* Filtro de Nacionalidade */}
          <Form.Select
            value={filtroNacionalidade}
            onChange={(e) => setFiltroNacionalidade(e.target.value)}
            style={{ width: 'auto', minWidth: '150px' }}
            size="sm"
          >
            <option value="todos">Todas as nacionalidades</option>
            {nacionalidadesUnicas.map(nacionalidade => (
              <option key={nacionalidade} value={nacionalidade}>{nacionalidade}</option>
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
            <option value="nacionalidade_asc">Nacionalidade (A-Z)</option>
            <option value="nacionalidade_desc">Nacionalidade (Z-A)</option>
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
                placeholder="Buscar autores..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
              />
            </InputGroup>
          </div>
        </div>
      </Card.Header>

      <Card.Body>
        {loading ? (
          <p className="text-center text-muted py-4">Carregando autores...</p>
        ) : autoresPaginaAtual.length === 0 ? (
          <p className="text-muted text-center py-4">
            {termoBusca || filtroNacionalidade !== 'todos' ? 'Nenhum autor encontrado' : 'Nenhum autor cadastrado'}
          </p>
        ) : (
          <>
            <Table striped hover responsive className="align-middle">
              <thead>
                <tr>
                  <th width="80px">ID</th>
                  <th>Nome Completo</th>
                  <th width="120px">Nacionalidade</th>
                  <th width="140px">Data Nasc.</th>
                  <th width="140px">Data Cadastro</th> 
                  <th width="200px" className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {autoresPaginaAtual.map(autor => (
                  <tr key={autor.id}>
                    <td className="fw-bold">#{autor.id}</td>

                    {/* Coluna Nome */}
                    <td>
                      <div className="fw-semibold">{formatarNome(autor.nome)}</div>
                      {autor.biografia && (
                        <small className="text-muted" style={{ 
                          display: 'block',
                          maxWidth: '300px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {autor.biografia}
                        </small>
                      )}
                    </td>

                    {/* Coluna Nacionalidade */}
                    <td>
                      {autor.nacionalidade ? (
                        <span>
                          {formatarNome(autor.nacionalidade)}
                        </span>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>

                    {/* Coluna Data Nascimento */}
                    <td className="text-nowrap">
                      {formatarData(autor.data_nascimento)}
                    </td>
                      <td className="text-nowrap">
  <div>
    {formatarData(autor.data_cadastro)}
  </div>
</td>
                    {/* Coluna Ações */}
                    <td>
                      <div className="d-flex gap-2 justify-content-center">
                        <button
                          className="btn-sm-custom btn-renovar"
                          onClick={() => handleVerDetalhes(autor)}
                          title="Ver detalhes do autor"
                        >
                          <FaInfoCircle />
                        </button>

                        <button
                          className="btn-sm-custom btn-edit"
                          onClick={() => onEdit(autor.id)}
                          title="Editar autor"
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="btn-sm-custom btn-danger"
                          onClick={() => onDelete(autor.id)}
                          title="Excluir autor"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Modal para mostrar detalhes do autor */}
            <Modal show={showDetalhesModal} onHide={handleCloseDetalhesModal} size="lg">
              <Modal.Header closeButton closeVariant="white" className="bg-primary text-white">
                <Modal.Title className="d-flex align-items-center">
                  <FaUser className="me-2" />
                  Autor #{autorSelecionado?.id} - Detalhes
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
                        <strong><FaUser className="me-2 text-muted" />Nome:</strong> {formatarNome(autorSelecionado?.nome)}
                      </p>
                      <p className="mb-2">
                        <strong><FaGlobeAmericas className="me-2 text-muted" />Nacionalidade:</strong> {formatarNome(autorSelecionado?.nacionalidade) || 'Não informada'}
                      </p>
                    </Col>
                    <Col md={6}>
                      <p className="mb-2">
                        <strong><FaCalendarAlt className="me-2 text-muted" />Data de Nascimento:</strong> {formatarData(autorSelecionado?.data_nascimento)}
                      </p>
                      <p className="mb-2">
                        <FaRegCalendarPlus className="me-1" />
                         <strong> Data de Cadastro:</strong> 
                          <span className="ms-2">
                            {autorSelecionado?.data_cadastro ? 
                              formatarData(autorSelecionado.data_cadastro) : 
                              'Não disponível'
                            }
                          </span>
                        </p>
                    </Col>
                  </Row>
                </div>

                {/* SEÇÃO: Biografia */}
                {autorSelecionado?.biografia && (
                  <div className="p-3 border rounded bg-white">
                    <h5 className="fw-bold mb-3 text-primary border-bottom pb-2 d-flex align-items-center">
                      <FaFeatherAlt className="me-2" />
                      Biografia
                    </h5>
                    <Row>
                      <Col md={12}>
                        <p className="mb-0" style={{ textAlign: 'justify', lineHeight: '1.6' }}>
                          {autorSelecionado.biografia}
                        </p>
                      </Col>
                    </Row>
                  </div>
                )}
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
                  Mostrando {inicio + 1} a {Math.min(fim, autoresOrdenados.length)} de {autoresOrdenados.length} autores
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

export default AutorList;