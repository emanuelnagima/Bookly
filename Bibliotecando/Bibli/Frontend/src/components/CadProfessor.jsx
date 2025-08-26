import { useState, useEffect } from 'react'
import { Card, Form, Col, Row, Button, Spinner } from 'react-bootstrap'


const maskTelefone = (value) => {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 15)
}

const maskMatricula = (value) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .slice(0, 11)
}

const CadProfessor = ({ onSave, onCancel, professor, loading }) => {
  const [professorData, setProfessorData] = useState({
    id: null,
    nome: '',
    matricula: '',
    email: '',
    telefone: '',
    departamento: ''
  })

  const [validated, setValidated] = useState(false)

  const formatarTelefone = (telefone) => {
    if (!telefone) return ''
    const nums = telefone.replace(/\D/g, '')
    if (nums.length === 11) {
      return nums.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }
    return telefone
  }

  const formatarMatricula = (matricula) => {
    if (!matricula) return ''
    const nums = matricula.replace(/\D/g, '')
    if (nums.length === 9) {
      return nums.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3')
    }
    return matricula
  }

  useEffect(() => {
    if (professor) {
      setProfessorData({
        id: professor.id,
        nome: professor.nome || '',
        matricula: formatarMatricula(professor.matricula),
        email: professor.email || '',
        telefone: formatarTelefone(professor.telefone),
        departamento: professor.departamento || ''
      })
    } else {
      setProfessorData({
        id: null,
        nome: '',
        matricula: '',
        email: '',
        telefone: '',
        departamento: ''
      })
    }
  }, [professor])

  const handleChange = (e) => {
    const { name, value } = e.target

    let maskedValue = value
    if (name === 'telefone') maskedValue = maskTelefone(value)
    if (name === 'matricula') maskedValue = maskMatricula(value)

    setProfessorData(prev => ({
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

    const dataToSave = {
      ...professorData,
      matricula: professorData.matricula.replace(/\D/g, ''),
      telefone: professorData.telefone.replace(/\D/g, '')
    }

    onSave(dataToSave)
  }

  return (
    <Card>
      <Card.Header className='bg-primary text-white'>
        <h5 className='mb-0'>{professorData.id ? 'Editar Professor' : 'Cadastrar Professor'}</h5>
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
                  value={professorData.nome}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <Form.Control.Feedback type='invalid'>
                  Informe o nome
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='matricula'>
                <Form.Label>Matrícula</Form.Label>
                <Form.Control
                  type='text'
                  name='matricula'
                  value={professorData.matricula}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
                <Form.Control.Feedback type='invalid'>
                  Informe a matrícula no formato 000.000.000
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='email'>
                <Form.Label>E-mail</Form.Label>
                <Form.Control
                  type='email'
                  name='email'
                  value={professorData.email}
                  onChange={handleChange}
                  placeholder='professor@exemplo.com'
                  required
                  disabled={loading}
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                />
                <Form.Control.Feedback type='invalid'>
                  Informe um e-mail válido (exemplo: nome@escola.com)
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='telefone'>
                <Form.Label>Telefone</Form.Label>
                <Form.Control
                  type='text'
                  name='telefone'
                  value={professorData.telefone}
                  onChange={handleChange}
                  placeholder='(00) 00000-0000'
                  disabled={loading}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='departamento'>
                <Form.Label>Departamento</Form.Label>
                <Form.Select
                  name='departamento'
                  value={professorData.departamento}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value=''>Selecione...</option>
                  <option value='Matemática'>Matemática</option>
                  <option value='Ciências'>Ciências</option>
                  <option value='Português'>Português</option>
                  <option value='História'>História</option>
                  <option value='Geografia'>Geografia</option>
                  <option value='Inglês'>Inglês</option>
                  <option value='Educação Física'>Educação Física</option>
                  <option value='Artes'>Artes</option>
                </Form.Select>
                <Form.Control.Feedback type='invalid'>
                  Selecione o departamento
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
                  {professorData.id ? ' Atualizando...' : ' Salvando...'}
                </>
              ) : (
                professorData.id ? 'Atualizar' : 'Salvar'
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default CadProfessor
