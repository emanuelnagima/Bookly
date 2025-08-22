import { useState, useEffect } from 'react'
import { Card, Form, Col, Row, Button, Spinner } from 'react-bootstrap'

const CadEditora = ({ onSave, onCancel, editora, loading }) => {
  const [editoraData, setEditoraData] = useState({
    id: null,
    nome: '',
    cnpj: '',
    endereco: '',
    telefone: '',
    email: ''
  })

  const [validated, setValidated] = useState(false)

  useEffect(() => {
    if (editora) {
      setEditoraData({
        id: editora.id,
        nome: editora.nome,
        cnpj: editora.cnpj || '',
        endereco: editora.endereco || '',
        telefone: editora.telefone || '',
        email: editora.email || ''
      })
    } else {
      setEditoraData({
        id: null,
        nome: '',
        cnpj: '',
        endereco: '',
        telefone: '',
        email: ''
      })
    }
  }, [editora])

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditoraData(prev => ({
      ...prev,
      [name]: value
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

    onSave(editoraData)
  }

  return (
    <Card>
      <Card.Header className='bg-primary text-white'>
        <h5 className='mb-0'>{editoraData.id ? 'Editar Editora' : 'Cadastrar Editora'}</h5>
      </Card.Header>
      <Card.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row>
            <Col md={12}>
              <Form.Group className='mb-3' controlId='nome'>
                <Form.Label>Nome da Editora</Form.Label>
                <Form.Control
                  type='text'
                  name='nome'
                  value={editoraData.nome}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <Form.Control.Feedback type='invalid'>
                  Informe o nome da editora
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='cnpj'>
                <Form.Label>CNPJ</Form.Label>
                <Form.Control
                  type='text'
                  name='cnpj'
                  value={editoraData.cnpj}
                  onChange={handleChange}
                  placeholder='00.000.000/0000-00'
                  disabled={loading}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='telefone'>
                <Form.Label>Telefone</Form.Label>
                <Form.Control
                  type='text'
                  name='telefone'
                  value={editoraData.telefone}
                  onChange={handleChange}
                  placeholder='(00) 00000-0000'
                  disabled={loading}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group className='mb-3' controlId='endereco'>
                <Form.Label>Endereço</Form.Label>
                <Form.Control
                  type='text'
                  name='endereco'
                  value={editoraData.endereco}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group className='mb-3' controlId='email'>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type='email'
                  name='email'
                  value={editoraData.email}
                  onChange={handleChange}
                  placeholder='editora@exemplo.com'
                  disabled={loading}
                />
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
                  {editoraData.id ? ' Atualizando...' : ' Salvando...'}
                </>
              ) : (
                editoraData.id ? 'Atualizar' : 'Salvar'
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default CadEditora