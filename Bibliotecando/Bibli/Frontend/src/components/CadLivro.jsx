import { useState, useEffect } from 'react'
import { Card, Form, Col, Row, Button, Spinner, Image, Alert } from 'react-bootstrap'
import axios from 'axios'

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
  })

  const [editoras, setEditoras] = useState([])
  const [autores, setAutores] = useState([])
  const [imagemPreview, setImagemPreview] = useState('')
  const [validated, setValidated] = useState(false)
  const [error, setError] = useState('')

  // Carregar opções de editoras e autores
  useEffect(() => {
    carregarOpcoes()
  }, [])

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
      })
      
      // Se já existe uma imagem, mostrar preview
      if (livro.imagem) {
        setImagemPreview(`http://localhost:3001${livro.imagem}`)
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
      })
      setImagemPreview('')
    }
  }, [livro])

  const carregarOpcoes = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/livros/options')
      setEditoras(response.data.data.editoras)
      setAutores(response.data.data.autores)
    } catch (error) {
      console.error('Erro ao carregar opções:', error)
      setError('Erro ao carregar editoras e autores')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setLivroData(prev => ({
      ...prev,
      [name]: name === 'ano_publicacao' ? parseInt(value) || '' : value
    }))
  }

  const handleImagemChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setLivroData(prev => ({
        ...prev,
        imagem: file
      }))

      // Criar preview da imagem
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagemPreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = e.currentTarget

    if (form.checkValidity() === false) {
      e.stopPropagation()
      setValidated(true)
      return
    }

    onSave(livroData)
  }

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
                <Form.Control.Feedback type='invalid'>
                  Informe o título
                </Form.Control.Feedback>
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
                <Form.Control.Feedback type='invalid'>
                  Informe o ISBN
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='autor_id'>
                <Form.Label>Autor</Form.Label>
                <Form.Select
                  name='autor_id'
                  value={livroData.autor_id}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value=''>Selecione um autor...</option>
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
                <Form.Label>Editora</Form.Label>
                <Form.Select
                  name='editora_id'
                  value={livroData.editora_id}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value=''>Selecione uma editora...</option>
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
                <Form.Control.Feedback type='invalid'>
                  Selecione um gênero
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='ano_publicacao'>
                <Form.Label>Ano Publicação</Form.Label>
                <Form.Control
                  type='number'
                  name='ano_publicacao'
                  value={livroData.ano_publicacao}
                  onChange={handleChange}
                  required
                  placeholder='0000'
                  min="0"
                  max={new Date().getFullYear()}
                  disabled={loading}
                />
                <Form.Control.Feedback type='invalid'>
                  Informe um ano de publicação válido
                </Form.Control.Feedback>
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
                  <Image 
                    src={imagemPreview} 
                    alt='Preview' 
                    fluid 
                    style={{ maxHeight: '200px' }}
                  />
                </div>
              )}
            </Col>
          </Row>

          <div className='d-flex justify-content-end gap-2'>
            <Button 
              variant='danger' 
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              variant='primary' 
              type='submit'
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  {livroData.id ? ' Atualizando...' : ' Salvando...'}
                </>
              ) : (
                livroData.id ? 'Atualizar' : 'Salvar'
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
}


/* alterar banco


ALTER TABLE livros 
ADD COLUMN autor_id INT,
ADD COLUMN editora_id INT,
ADD FOREIGN KEY (autor_id) REFERENCES autores(id),
ADD FOREIGN KEY (editora_id) REFERENCES editoras(id);


 */
export default CadLivro