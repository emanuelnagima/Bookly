import { useState, useEffect } from 'react';
import { Card, Form, Col, Row, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { BsCheckCircle } from "react-icons/bs";

const CadLivro = ({ onSave, onCancel, livro, loading }) => {
  const [formData, setFormData] = useState({
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
  const [optionsLoading, setOptionsLoading] = useState(false);

  // Carregar opções de editoras e autores
  useEffect(() => {
    const carregarOpcoes = async () => {
      try {
        setOptionsLoading(true);
        const response = await axios.get('http://localhost:3000/api/livros/options');
        setEditoras(response.data.data.editoras || []);
        setAutores(response.data.data.autores || []);
      } catch (err) {
        console.error('Erro ao carregar opções:', err);
        setError('Erro ao carregar editoras e autores');
      } finally {
        setOptionsLoading(false);
      }
    };

    carregarOpcoes();
  }, []);

  // Preencher dados se for edição
  useEffect(() => {
    if (livro) {
      console.log('Editando livro:', livro);
      setFormData({
        titulo: livro.titulo || '',
        autor_id: livro.autor_id?.toString() || '',
        editora_id: livro.editora_id?.toString() || '',
        isbn: livro.isbn || '',
        genero: livro.genero || '',
        ano_publicacao: livro.ano_publicacao?.toString() || '',
        imagem: null
      });

      if (livro.imagem) {
        setImagemPreview(`http://localhost:3000${livro.imagem}`);
      }
    } else {
      console.log('Novo cadastro de livro');
      setFormData({
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validação básica do arquivo
      if (!file.type.startsWith('image/')) {
        setError('Por favor, selecione um arquivo de imagem válido');
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB
        setError('A imagem deve ter menos de 5MB');
        return;
      }

      setFormData(prev => ({ ...prev, imagem: file }));
      setError('');

      const reader = new FileReader();
      reader.onload = (e) => setImagemPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    // Validação do formulário
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      setError('');

      console.log('Dados do formulário:', formData);

      // Prepara os dados para envio
      const livroParaEnviar = {
        ...formData,
        autor_id: parseInt(formData.autor_id),
        editora_id: parseInt(formData.editora_id),
        ano_publicacao: parseInt(formData.ano_publicacao),
        imagem: formData.imagem
      };

      console.log('Enviando livro:', livroParaEnviar);

      // Chama a função de salvamento do componente pai
      if (typeof onSave === 'function') {
        await onSave(livroParaEnviar);
      } else {
        throw new Error('Função de salvamento não disponível');
      }

    } catch (err) {
      console.error('Erro no formulário:', err);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <Card className="shadow-sm">
      <Card.Header className='bg-primary text-white'>
        <h5 className='mb-0'>
          {livro ? 'Editar Livro' : 'Cadastrar Livro'}
        </h5>
      </Card.Header>
      <Card.Body>
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='titulo'>
                <Form.Label>Título </Form.Label>
                <Form.Control
                  type='text'
                  name='titulo'
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Digite o título do livro"
                />
                <Form.Control.Feedback type='invalid'>
                  Informe o título do livro
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='isbn'>
                <Form.Label>ISBN </Form.Label>
                <Form.Control
                  type='text'
                  name='isbn'
                  value={formData.isbn}
                  placeholder='000-00-000-0000-0'
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <Form.Control.Feedback type='invalid'>
                  Informe o ISBN do livro
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='autor_id'>
                <Form.Label>Autor </Form.Label>
                <Form.Select
                  name="autor_id"
                  value={formData.autor_id}
                  onChange={handleChange}
                  required
                  disabled={loading || optionsLoading}
                >
                  <option value="">{optionsLoading ? 'Carregando...' : 'Selecione um autor'}</option>
                  {autores.map(autor => (
                    <option key={autor.id} value={autor.id}>
                      {autor.nome}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type='invalid'>
                  Selecione um autor
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='editora_id'>
                <Form.Label>Editora </Form.Label>
                <Form.Select
                  name='editora_id'
                  value={formData.editora_id}
                  onChange={handleChange}
                  required
                  disabled={loading || optionsLoading}
                >
                  <option value="">{optionsLoading ? 'Carregando...' : 'Selecione uma editora'}</option>
                  {editoras.map(editora => (
                    <option key={editora.id} value={editora.id}>
                      {editora.nome}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type='invalid'>
                  Selecione uma editora
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='genero'>
                <Form.Label>Gênero </Form.Label>
                <Form.Select
                  name='genero'
                  value={formData.genero}
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
                <Form.Control.Feedback type='invalid'>
                  Selecione um gênero
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='ano_publicacao'>
                <Form.Label>Ano de Publicação </Form.Label>
                <Form.Control
                  type='number'
                  name='ano_publicacao'
                  placeholder={currentYear}
                  value={formData.ano_publicacao}
                  onChange={handleChange}
                  required
                  min="1000"
                  max={currentYear}
                  disabled={loading}
                />
                <Form.Control.Feedback type='invalid'>
                  Informe um ano válido
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='imagem'>
                <Form.Label>Imagem da Capa</Form.Label>
                <Form.Control
                  type='file'
                  accept='image/*'
                  onChange={handleImagemChange}
                  disabled={loading}
                />
                <Form.Text className="text-muted">
                  Formatos suportados: JPG, PNG, GIF. Tamanho máximo: 5MB
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              {imagemPreview && (
                <div className='mt-4'>
                  <p className="small text-muted mb-2">Preview:</p>
                  <div
                    style={{
                      width: '150px',
                      height: '220px',
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
                      alt='Preview da capa'
                      className="img-fluid"
                      style={{ maxHeight: '200px', objectFit: 'cover' }}
                    />
                  </div>
                </div>
              )}
            </Col>
          </Row>

          <div className='d-flex justify-content-end gap-2'>
            <Button variant='danger' onClick={onCancel} disabled={loading}>
              Cancelar
            </Button>
            <Button variant='primary' type='submit' disabled={loading}>
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" className="me-2" />
                  {livro ? 'Atualizando...' : 'Salvando...'}
                </>
              ) : (
                <>
                  <BsCheckCircle style={{ marginRight: '8px', color: '#fff', fontSize: '18px' }} />
                  {livro ? 'Atualizar Livro' : 'Cadastrar Livro'}
                </>
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CadLivro;