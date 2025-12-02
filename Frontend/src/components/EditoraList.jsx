import { useState, useEffect } from 'react';
import { Card, Table, Form, InputGroup, Button, Row, Col, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaSearch, FaChevronLeft, FaChevronRight, FaBuilding, FaInfoCircle, FaEnvelope, FaPhone, FaIdCard, FaMapMarkerAlt } from 'react-icons/fa';

const ITENS_POR_PAGINA = 7;

const formatarTexto = texto =>
  (texto || '')
    .toLowerCase()
    .split(' ')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');

const formatarCNPJ = (cnpj) => {
  if (!cnpj) return '-';

  const cnpjLimpo = cnpj.toString().replace(/\D/g, '');

  if (cnpjLimpo.length === 14) {
    return `${cnpjLimpo.substring(0, 2)}.${cnpjLimpo.substring(2, 5)}.${cnpjLimpo.substring(5, 8)}/${cnpjLimpo.substring(8, 12)}-${cnpjLimpo.substring(12)}`;
  }

  return cnpj;
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

const EditoraList = ({ editoras, onDelete, onEdit, loading }) => {
  const [termoBusca, setTermoBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [ordenacao, setOrdenacao] = useState('nome_asc');

  const [showDetalhesModal, setShowDetalhesModal] = useState(false);
  const [editoraSelecionada, setEditoraSelecionada] = useState(null);

  // Resetar página quando filtros mudarem
  useEffect(() => {
    setPaginaAtual(1);
  }, [termoBusca, ordenacao]);

  // Função de ordenação
  const ordenarEditoras = (editoras) => {
    return [...editoras].sort((a, b) => {
      switch (ordenacao) {
        case 'nome_asc':
          return formatarTexto(a.nome).localeCompare(formatarTexto(b.nome));
        case 'nome_desc':
          return formatarTexto(b.nome).localeCompare(formatarTexto(a.nome));
        case 'cnpj_asc':
          return (a.cnpj || '').localeCompare(b.cnpj || '');
        case 'cnpj_desc':
          return (b.cnpj || '').localeCompare(a.cnpj || '');
        default:
          return formatarTexto(a.nome).localeCompare(formatarTexto(b.nome));
      }
    });
  };

  // Filtrar editoras
  const editorasFiltradas = editoras.filter(editora => {
    if (!termoBusca) return true;

    const termo = termoBusca.toLowerCase();
    const matchesBusca = !termoBusca || (
      (editora.nome || '').toLowerCase().includes(termo) ||
      (editora.cnpj || '').toString().toLowerCase().includes(termo) ||
      (editora.endereco || '').toLowerCase().includes(termo) ||
      (editora.telefone || '').toString().toLowerCase().includes(termo) ||
      (editora.email || '').toLowerCase().includes(termo)
    );

    return matchesBusca;
  });

  // Aplicar ordenação
  const editorasOrdenadas = ordenarEditoras(editorasFiltradas);

  // Calcular paginação
  const totalPaginas = Math.ceil(editorasOrdenadas.length / ITENS_POR_PAGINA);

  // Garantir que a página atual seja válida
  const paginaValida = Math.max(1, Math.min(paginaAtual, totalPaginas));
  if (paginaValida !== paginaAtual) {
    setPaginaAtual(paginaValida);
  }

  const inicio = (paginaValida - 1) * ITENS_POR_PAGINA;
  const fim = inicio + ITENS_POR_PAGINA;
  const editorasPaginaAtual = editorasOrdenadas.slice(inicio, fim);

  const handlePaginaAnterior = () => {
    if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1);
  };

  const handleProximaPagina = () => {
    if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1);
  };

  // Função para abrir modal com detalhes da editora
  const handleVerDetalhes = (editora) => {
    setEditoraSelecionada(editora);
    setShowDetalhesModal(true);
  };

  // Fechar modal
  const handleCloseDetalhesModal = () => {
    setShowDetalhesModal(false);
    setEditoraSelecionada(null);
  };

  return (
    <Card>
      <Card.Header className="bg-primary text-white d-flex flex-wrap justify-content-between align-items-center">
        <div className="d-flex align-items-center mb-2 mb-md-0">
          <FaBuilding
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
          <h5 className="mb-0">Editoras</h5>
        </div>

        <div className="d-flex align-items-center gap-3">
          {/* Seletor de Ordenação */}
          <Form.Select
            value={ordenacao}
            onChange={(e) => setOrdenacao(e.target.value)}
            style={{ width: 'auto', minWidth: '200px' }}
            size="sm"
          >
            <option value="nome_asc">Nome (A-Z)</option>
            <option value="nome_desc">Nome (Z-A)</option>
            <option value="cnpj_asc">CNPJ (crescente)</option>
            <option value="cnpj_desc">CNPJ (decrescente)</option>
          </Form.Select>

          {/* Barra de pesquisa */}
          <div style={{ minWidth: '200px', maxWidth: '300px' }}>
            <InputGroup size="sm">
              <InputGroup.Text className="bg-light text-primary">
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Buscar editoras..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
              />
            </InputGroup>
          </div>
        </div>
      </Card.Header>

      <Card.Body>
        {loading ? (
          <p className="text-center text-muted py-4">Carregando editoras...</p>
        ) : editorasPaginaAtual.length === 0 ? (
          <p className="text-muted text-center py-4">
            {termoBusca ? 'Nenhuma editora encontrada' : 'Nenhuma editora cadastrada'}
          </p>
        ) : (
          <>
            <Table striped hover responsive className="align-middle">
              <thead>
                <tr>
                  <th width="80px">ID</th>
                  <th>Nome</th>
                  <th width="180px">CNPJ</th>
                  <th width="140px">Telefone</th>
                  <th width="200px" className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {editorasPaginaAtual.map(editora => (
                  <tr key={editora.id}>
                    <td className="fw-bold">#{editora.id}</td>

                    {/* Coluna Nome */}
                    <td>
                      <div className="fw-semibold">{formatarTexto(editora.nome)}</div>
                      <small className="text-muted">{editora.email || 'Sem email'}</small>
                    </td>

                    {/* Coluna CNPJ */}
                    <td>
                      <span>
                        {formatarCNPJ(editora.cnpj)}
                      </span>
                    </td>

                    {/* Coluna Telefone */}
                    <td className="text-nowrap">
                      {formatarTelefone(editora.telefone)}
                    </td>

                    {/* Coluna Ações */}
                    <td>
                      <div className="d-flex gap-2 justify-content-center">
                        <button
                          className="btn-sm-custom btn-renovar"
                          onClick={() => handleVerDetalhes(editora)}
                          title="Ver detalhes da editora"
                        >
                          <FaInfoCircle />
                        </button>

                        <button
                          className="btn-sm-custom btn-edit"
                          onClick={() => onEdit(editora.id)}
                          title="Editar editora"
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="btn-sm-custom btn-danger"
                          onClick={() => onDelete(editora.id)}
                          title="Excluir editora"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Modal para mostrar detalhes da editora */}
            <Modal show={showDetalhesModal} onHide={handleCloseDetalhesModal} size="lg">
              <Modal.Header closeButton closeVariant="white" className="bg-primary text-white">
                <Modal.Title className="d-flex align-items-center">
                  <FaBuilding className="me-2" />
                  Editora #{editoraSelecionada?.id} - Detalhes
                </Modal.Title>
              </Modal.Header>

              <Modal.Body className="p-4">
                {/* SEÇÃO: Informações da Editora */}
                <div className="mb-4 p-3 border rounded bg-white">
                  <h5 className="fw-bold mb-3 text-primary border-bottom pb-2 d-flex align-items-center">
                    <FaBuilding className="me-2" />
                    Informações da Editora
                  </h5>
                  <Row>
                    <Col md={6}>
                      <p className="mb-2">
                        <strong><FaBuilding className="me-2 text-muted" />Nome:</strong> {formatarTexto(editoraSelecionada?.nome)}
                      </p>
                      <p className="mb-2">
                        <strong><FaIdCard className="me-2 text-muted" />CNPJ:</strong> {formatarCNPJ(editoraSelecionada?.cnpj)}
                      </p>
                    </Col>
                    <Col md={6}>
                      <p className="mb-2">
                        <strong><FaEnvelope className="me-2 text-muted" />Email:</strong> {editoraSelecionada?.email || 'Não informado'}
                      </p>
                      <p className="mb-2">
                        <strong><FaPhone className="me-2 text-muted" />Telefone:</strong> {formatarTelefone(editoraSelecionada?.telefone) || 'Não informado'}
                      </p>
                    </Col>
                  </Row>
                </div>

                {/* SEÇÃO: Endereço */}
                {editoraSelecionada?.endereco && (
                  <div className="p-3 border rounded bg-white">
                    <h5 className="fw-bold mb-3 text-primary border-bottom pb-2 d-flex align-items-center">
                      <FaMapMarkerAlt className="me-2" />
                      Endereço
                    </h5>
                    <Row>
                      <Col md={12}>
                        <p className="mb-0">
                          {editoraSelecionada.endereco}
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

            {/* Paginação Melhorada */}
            {totalPaginas > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-4">
                <div className="text-muted small">
                  Mostrando {inicio + 1} a {Math.min(fim, editorasOrdenadas.length)} de {editorasOrdenadas.length} editoras
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

export default EditoraList;