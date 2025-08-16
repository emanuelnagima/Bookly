import { useState } from 'react';
import { Card, Table, Form, InputGroup } from 'react-bootstrap';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Função para capitalizar nomes
const formatarNome = (nome) =>
  (nome || '')
    .toLowerCase()
    .split(' ')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');

// Função para formatar datas no padrão DD/MM/YYYY
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

  // Filtra autores pelo termo de busca
  const filtrarAutores = () => {
    if (!termoBusca) return autores;

    const termo = termoBusca.toLowerCase();
    return autores.filter(autor => {
      return (
        (autor.nome || '').toLowerCase().includes(termo) ||
        (autor.nacionalidade || '').toLowerCase().includes(termo) ||
        (autor.data_nascimento || '').toLowerCase().includes(termo)
      );
    });
  };

  // Ordena por nome
  const autoresOrdenados = [...filtrarAutores()].sort((a, b) =>
    formatarNome(a.nome || '').localeCompare(formatarNome(b.nome || ''))
  );

  return (
    <Card>
      <Card.Header className="bg-primary text-white">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Autores Cadastrados</h5>
          <div style={{ width: '300px' }}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Buscar autores..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
              />
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
            </InputGroup>
          </div>
        </div>
      </Card.Header>

      <Card.Body>
        {autoresOrdenados.length === 0 ? (
          <p className="text-muted">
            {termoBusca ? 'Nenhum autor encontrado' : 'Nenhum autor cadastrado'}
          </p>
        ) : (
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
              {autoresOrdenados.map(autor => (
                <tr key={autor.id}>
                  <td>{autor.id}</td>
                  <td>
                    <Link
                      to={`/autor/${autor.id}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {formatarNome(autor.nome)}
                    </Link>
                  </td>
                  <td>{formatarNome(autor.nacionalidade)}</td>
                  <td>{formatarData(autor.data_nascimento)}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => onEdit && onEdit(autor.id)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onDelete && onDelete(autor.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
};

export default AutorList;
