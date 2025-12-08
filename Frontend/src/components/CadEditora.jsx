import { useState, useEffect } from 'react'
import { Card, Form, Col, Row, Button, Spinner } from 'react-bootstrap'
import { BsCheckCircle } from "react-icons/bs";

const maskCNPJ = (value) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4')
    .replace(/(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5')
    .slice(0, 18)
}

const maskTelefone = (value) => {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 15)
}

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
        cnpj: maskCNPJ(editora.cnpj || ''),
        endereco: editora.endereco || '',
        telefone: maskTelefone(editora.telefone || ''),
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

    let maskedValue = value
    if (name === 'cnpj') maskedValue = maskCNPJ(value)
    if (name === 'telefone') maskedValue = maskTelefone(value)

    setEditoraData(prev => ({
      ...prev,
      [name]: maskedValue
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

    // Verificar se telefone existe
    const cleanedData = {
      ...editoraData,
      cnpj: editoraData.cnpj.replace(/\D/g, ''),
      telefone: editoraData.telefone ? editoraData.telefone.replace(/\D/g, '') : ''
    }

    onSave(cleanedData)
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
                <Form.Label>Nome </Form.Label>
                <Form.Control
                  type='text'
                  placeholder="Digite o nome da editora"
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
                  required
                  disabled={loading}
                />
                <Form.Control.Feedback type='invalid'>
                  CNPJ é obrigatório
                </Form.Control.Feedback>
                <Form.Text className='text-muted'>
                  Formato: 14 dígitos
                </Form.Text>
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
                  placeholder='(00) 00000-0000 (opcional)'
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
                  placeholder="Ex: Rua das Flores, 123, Bairro Centro, Cidade - SP (opcional)"
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
                  placeholder='editora@exemplo.com (opcional)'
                  disabled={loading}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className='d-flex justify-content-end gap-2'>
            <Button
              variant='cancelar'
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
                    className="me-2"
                  />
                  {editoraData.id ? ' Atualizando...' : ' Salvando...'}
                </>
              ) : (
                <>
                  <BsCheckCircle style={{ marginRight: '8px', color: '#fff', fontSize: '18px' }} />
                  {editoraData.id ? 'Atualizar Editora' : 'Cadastrar Editora'}
                </>
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default CadEditora