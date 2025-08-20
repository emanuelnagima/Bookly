import { useState, useEffect } from 'react'
import { Card, Form, Col, Row, Button, Spinner } from 'react-bootstrap'

const CadLivro = ({ onSave, onCancel, livro, loading }) => {
  const [livroData, setLivroData] = useState({
    id: null,
    titulo: '',
    autor: '',
    editora: '',
    isbn: '',
    genero: '',
    ano_publicacao: ''
  })

  const [validated, setValidated] = useState(false)

  useEffect(() => {
    if (livro) {
      setLivroData({
        id: livro.id,
        titulo: livro.titulo,
        autor: livro.autor,
        editora: livro.editora,
        isbn: livro.isbn,
        genero: livro.genero,
        ano_publicacao: livro.ano_publicacao
      })
    } else {
      setLivroData({
        id: null,
        titulo: '',
        autor: '',
        editora: '',
        isbn: '',
        genero: '',
        ano_publicacao: ''
      })
    }
  }, [livro])

  const handleChange = (e) => {
    const { name, value } = e.target
    setLivroData(prev => ({
      ...prev,
      [name]: name === 'ano_publicacao' ? parseInt(value) || '' : value
    }))
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
              <Form.Group className='mb-3' controlId='autor'>
                <Form.Label>Autor</Form.Label>
                <Form.Control
                  type='text'
                  name='autor'
                  value={livroData.autor}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <Form.Control.Feedback type='invalid'>
                  Informe o autor
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='editora'>
                <Form.Label>Editora</Form.Label>
                <Form.Control
                  type='text'
                  name='editora'
                  value={livroData.editora}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <Form.Control.Feedback type='invalid'>
                  Informe a editora
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
              <Form.Group className='mb-3' controlId='genero'>
                <Form.Label>Gênero</Form.Label>
                <Form.Select
                  name='genero'
                  value={livroData.genero}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value=''>Selecione...</option>
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
                  disabled={loading}
                />
                <Form.Control.Feedback type='invalid'>
                  Informe o ano de publicação
                </Form.Control.Feedback>
              </Form.Group>
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

export default CadLivro