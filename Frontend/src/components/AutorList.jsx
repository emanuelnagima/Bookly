import { useState, useEffect } from 'react';
import { Card, Table, Form, InputGroup, Button } from 'react-bootstrap';
import { FaEdit, FaTrash, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ITENS_POR_PAGINA = 10;

const formatarNome = (nome) =>
  (nome || '')
    .toLowerCase()
    .split(' ')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');

const formatarData = (data) => {
  if (!data) return '';
  const d = new Date(data);
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
};

const AutorList = ({ autores, onDelete, onEdit }) => {
  const [termoBusca, setTermoBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);

  useEffect(() => {
    setPaginaAtual(1);
  }, [termoBusca]);

  // Filtra TODOS os autores com base no termo de busca
  const autoresFiltrados = autores.filter(autor => {
    if (!termoBusca) return true;

    const termo = termoBusca.toLowerCase();
    return (
      (autor.nome || '').toLowerCase().includes(termo) ||
      (autor.nacionalidade || '').toLowerCase().includes(termo) ||
      (autor.data_nascimento || '').toLowerCase().includes(termo)
    );
  });

  const totalPaginas = Math.ceil(autoresFiltrados.length / ITENS_POR_PAGINA);

  // Ordena por nome
  const autoresOrdenados = [...autoresFiltrados].sort((a, b) =>
    formatarNome(a.nome || '').localeCompare(formatarNome(b.nome || ''))
  );

  // Pegar apenas os itens da página atual
  const autoresPaginaAtual = autoresOrdenados.slice(
    (paginaAtual - 1) * ITENS_POR_PAGINA,
    paginaAtual * ITENS_POR_PAGINA
  );

  const handlePaginaAnterior = () => {
    if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1);
  };

  const handleProximaPagina = () => {
    if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1);
  };

  return (
    <Card>
      <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <h5 className="mb-0">Autores Cadastrados</h5>
          <span className="badge bg-light text-primary ms-3">
            {autoresFiltrados.length} {autoresFiltrados.length === 1 ? 'autor' : 'autores'} •
            Página {paginaAtual} de {totalPaginas || 1}
          </span>
        </div>
        <div style={{ width: '300px' }}>
          <InputGroup>
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
      </Card.Header>

      <Card.Body>
        {autoresPaginaAtual.length === 0 ? (
          <p className="text-muted text-center py-4">
            {termoBusca ? 'Nenhum autor encontrado' : 'Nenhum autor cadastrado'}
          </p>
        ) : (
          <>
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome Completo</th>
                  <th>Nacionalidade</th>
                  <th>Data de Nascimento</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {autoresPaginaAtual.map(autor => (
                  <tr key={autor.id}>
                    <td>{autor.id}</td>
                    <td>
                    <td>{formatarNome(autor.nome)}</td>

                    </td>
                    <td>{formatarNome(autor.nacionalidade)}</td>
                    <td>{formatarData(autor.data_nascimento)}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn-sm-custom btn-edit"
                          onClick={() => onEdit(autor.id)}
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="btn-sm-custom btn-delete"
                          onClick={() => onDelete(autor.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* PAGINAÇÃO COM CLASSES btn-paginacao */}
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

export default AutorList;