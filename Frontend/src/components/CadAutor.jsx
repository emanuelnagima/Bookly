import { useState, useEffect } from 'react'
import { Card, Form, Col, Row, Button, Spinner } from 'react-bootstrap'

// Lista de nacionalidades (com "Outra" sempre no final)
const nacionalidades = [
  "Brasil",
  "Estados Unidos",
  "China",
  "Japão",
  "Alemanha",
  "Reino Unido",
  "França",
  "Índia",
  "Outra" // sempre a última
];

const CadAutor = ({ onSave, onCancel, autor, loading }) => {
  const [autorData, setAutorData] = useState({
    id: null,
    nome: '',
    nacionalidade: '',
    data_nascimento: ''
  })

  const [validated, setValidated] = useState(false)

  useEffect(() => {
    if (autor) {
      setAutorData({
        id: autor.id,
        nome: autor.nome || '',
        nacionalidade: autor.nacionalidade || '',
        data_nascimento: autor.data_nascimento || ''
      })
    } else {
      setAutorData({
        id: null,
        nome: '',
        nacionalidade: '',
        data_nascimento: ''
      })
    }
  }, [autor])

  const handleChange = (e) => {
    const { name, value } = e.target
    setAutorData(prev => ({
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

    onSave(autorData)
  }

  return (
    <Card>
      <Card.Header className='bg-primary text-white'>
        <h5 className='mb-0'>{autorData.id ? 'Editar Autor' : 'Cadastrar Autor'}</h5>
      </Card.Header>
      <Card.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='nome'>
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type='text'
                  name='nome'
                  value={autorData.nome}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <Form.Control.Feedback type='invalid'>
                  Informe o nome do autor
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='nacionalidade'>
                <Form.Label>Nacionalidade</Form.Label>
                <Form.Select
                  name='nacionalidade'
                  value={autorData.nacionalidade}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value=''>Selecione...</option>
                  {nacionalidades.map((nac) => (
                    <option key={nac} value={nac}>
                      {nac}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type='invalid'>
                  Informe a nacionalidade
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='data_nascimento'>
                <Form.Label>Data de Nascimento</Form.Label>
                <Form.Control
                  type='date'
                  name='data_nascimento'
                  value={autorData.data_nascimento}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <Form.Control.Feedback type='invalid'>
                  Informe a data de nascimento
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
                  {autorData.id ? ' Atualizando...' : ' Salvando...'}
                </>
              ) : (
                autorData.id ? 'Atualizar' : 'Salvar'
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default CadAutor
