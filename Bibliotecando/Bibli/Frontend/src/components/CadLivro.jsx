import { useState, useEffect } from 'react';
import { Card, Form, Col, Row, Button, Spinner, Image, Alert } from 'react-bootstrap';
import axios from 'axios';

const CadLivro = ({ onSave, onCancel, livro, loading }) => {
  const [livroData, setLivroData] = useState({
    id: null,
    titulo: '',
    autor_id: '',
    editora_id: '',
    isbn: '',
    genero: '',
    ano_publicacao: '',
    imagem: null
  });

  const [editoras, setEditoras] = useState([]);
  const [autores, setAutores] = useState([]);
  const [imagemPreview, setImagemPreview] = useState('');
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState('');

  // Carregar opções de editoras e autores
  useEffect(() => {
    carregarOpcoes();
  }, []);

  // Preencher dados se for edição
  useEffect(() => {
    if (livro) {
      setLivroData({
        id: livro.id,
        titulo: livro.titulo,
        autor_id: livro.autor_id,
        editora_id: livro.editora_id,
        isbn: livro.isbn,
        genero: livro.genero,
        ano_publicacao: livro.ano_publicacao,
        imagem: null
      });

      if (livro.imagem) {
        setImagemPreview(`http://localhost:3000${livro.imagem}`);
      }
    } else {
      setLivroData({
        id: null,
        titulo: '',
        autor_id: '',
        editora_id: '',
        isbn: '',
        genero: '',
        ano_publicacao: '',
        imagem: null
      });
      setImagemPreview('');
    }
  }, [livro]);

  const carregarOpcoes = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/livros/options');
      setEditoras(response.data.data.editoras);
      setAutores(response.data.data.autores);
    } catch (err) {
      console.error('Erro ao carregar opções:', err);
      setError('Erro ao carregar editoras e autores');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLivroData(prev => ({
      ...prev,
      [name]: name === 'ano_publicacao' ? parseInt(value) || '' : value
    }));
  };

  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLivroData(prev => ({ ...prev, imagem: file }));

      const reader = new FileReader();
      reader.onload = (e) => setImagemPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('titulo', livroData.titulo);
      formData.append('autor_id', livroData.autor_id);
      formData.append('editora_id', livroData.editora_id);
      formData.append('isbn', livroData.isbn);
      formData.append('genero', livroData.genero);
      formData.append('ano_publicacao', livroData.ano_publicacao);
      if (livroData.imagem) formData.append('imagem', livroData.imagem);

      let response;
      if (livroData.id) {
        // Atualizar livro
        response = await axios.put(`http://localhost:3000/api/livros/${livroData.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // Criar livro
        response = await axios.post('http://localhost:3000/api/livros', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (response.data.success) {
        onSave(response.data.data);
      } else {
        setError('Erro ao salvar livro');
      }
    } catch (err) {
      console.error('Erro ao salvar livro:', err);
      setError('Erro ao salvar livro');
    }
  };

  return (
    <Card>
      <Card.Header className='bg-primary text-white'>
        <h5 className='mb-0'>{livroData.id ? 'Editar Livro' : 'Cadastrar Livro'}</h5>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='titulo'>
                <Form.Label>Título</Form.Label>
                <Form.Control
                  type='text'
                  name='titulo'
                  value={livroData.titulo}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <Form.Control.Feedback type='invalid'>Informe o título</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='isbn'>
                <Form.Label>ISBN</Form.Label>
                <Form.Control
                  type='text'
                  name='isbn'
                  value={livroData.isbn}
                  placeholder='000-00-000-000-0'
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <Form.Control.Feedback type='invalid'>Informe o ISBN</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='autor_id'>
                <Form.Label>Autor</Form.Label>
                <Form.Select
          name="autor_id"
          value={livroData.autor_id}
          onChange={handleChange}
          required
        >
  <option value="">Selecione um autor...</option>
  {autores.map(autor => <option key={autor.id} value={autor.id}>{autor.nome}</option>)}
</Form.Select>
                <Form.Control.Feedback type='invalid'>Selecione um autor</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='editora_id'>
                <Form.Label>Editora</Form.Label>
                <Form.Select
                  name='editora_id'
                  value={livroData.editora_id}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value=''>Selecione uma editora...</option>
                  {editoras.map(editora => <option key={editora.id} value={editora.id}>{editora.nome}</option>)}
                </Form.Select>
                <Form.Control.Feedback type='invalid'>Selecione uma editora</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='genero'>
                <Form.Label>Gênero</Form.Label>
                <Form.Select
                  name='genero'
                  value={livroData.genero}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value=''>Selecione um gênero...</option>
                  <option value='Romance'>Romance</option>
                  <option value='Ficção'>Ficção</option>
                  <option value='Drama'>Drama</option>
                  <option value='Suspense'>Suspense</option>
                  <option value='Fantasia'>Fantasia</option>
                  <option value='Biografia'>Biografia</option>
                  <option value='Terror'>Terror</option>
                  <option value='Educação'>Educação</option>
                  <option value='Outro'>Outro</option>
                </Form.Select>
                <Form.Control.Feedback type='invalid'>Selecione um gênero</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='ano_publicacao'>
                <Form.Label>Ano de Publicação</Form.Label>
                <Form.Control
                  type='number'
                  name='ano_publicacao'
                  placeholder='0000'
                  value={livroData.ano_publicacao}
                  onChange={handleChange}
                  required
                  min="0"
                  max={new Date().getFullYear()}
                  disabled={loading}
                />
                <Form.Control.Feedback type='invalid'>Informe um ano válido</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='imagem'>
                <Form.Label>Imagem do Livro</Form.Label>
                <Form.Control
                  type='file'
                  accept='image/*'
                  onChange={handleImagemChange}
                  disabled={loading}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              {imagemPreview && (
  <div className='mt-3'>
    <p>Preview:</p>
    <div
      style={{
        width: '150px',          // largura fixa tipo capa
        height: '220px',         // altura proporcional típica de livro
        border: '1px solid #ccc',
        borderRadius: '5px',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
      }}
    >
      <img
        src={imagemPreview}
        alt='Capa do Livro'
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',    // mantém a proporção e preenche o container
        }}
      />
    </div>
  </div>
)}
            </Col>
          </Row>

          <div className='d-flex justify-content-end gap-2'>
            <Button variant='danger' onClick={onCancel} disabled={loading}>Cancelar</Button>
            <Button variant='primary' type='submit' disabled={loading}>
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  {livroData.id ? ' Atualizando...' : ' Salvando...'}
                </>
              ) : (livroData.id ? 'Atualizar' : 'Salvar')}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CadLivro;
