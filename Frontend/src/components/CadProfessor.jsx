import { useState, useEffect } from 'react'
import { Card, Form, Col, Row, Button, Spinner, InputGroup } from 'react-bootstrap'
import { BsCheckCircle } from "react-icons/bs";
import { FaLock } from 'react-icons/fa';
import { FaTimes } from 'react-icons/fa';

const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  
  if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateString;
  }
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return '';
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return '';
  }
}

// MÁSCARAS
const maskTelefone = (value) => {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 15)
}

const maskCPF = (value) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4')
    .slice(0, 14)
}

// COMPONENTE CADPROFESSOR 
const CadProfessor = ({ onSave, onCancel, professor, loading }) => {
  const [professorData, setProfessorData] = useState({
    id: null,
    nome: '',
    cpf: '',
    data_nascimento: '',
    email: '',
    telefone: '',
    departamento: ''
  })

  const [validated, setValidated] = useState(false)

  useEffect(() => {
    if (professor) {
      setProfessorData({
        id: professor.id,
        nome: professor.nome || '',
        cpf: maskCPF(professor.cpf || ''),
        data_nascimento: formatDateForInput(professor.data_nascimento),
        email: professor.email || '',
        telefone: maskTelefone(professor.telefone || ''),
        departamento: professor.departamento || ''
      })
    } else {
      setProfessorData({
        id: null,
        nome: '',
        cpf: '',
        data_nascimento: '',
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
    if (name === 'cpf') maskedValue = maskCPF(value)

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
      telefone: professorData.telefone.replace(/\D/g, ''),
      cpf: professorData.cpf.replace(/\D/g, '')
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
          
          {/* SEÇÃO DE MATRÍCULA */}
          {professorData.id && professor?.matricula && (
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId='matricula'>
                  <Form.Label>Matrícula</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaLock />
                    </InputGroup.Text>
                    <Form.Control
                      type='text'
                      value={professor.matricula}
                      readOnly
                      disabled
                      className='bg-light'
                    />
                  </InputGroup>
                  <Form.Text className='text-muted'>
                    Matrícula gerada automaticamente pelo sistema
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          )}

          <Row>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='nome'>
                <Form.Label>Nome Completo</Form.Label>
                <Form.Control
                  type='text'
                  name='nome'
                  placeholder='Digite o nome do professor'
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
              <Form.Group className='mb-3' controlId='cpf'>
                <Form.Label>CPF</Form.Label>
                <Form.Control
                  type='text'
                  name='cpf'
                  placeholder='000.000.000-00'
                  value={professorData.cpf}
                  onChange={handleChange}
                  required  
                  disabled={loading}
                />
                <Form.Text className='text-muted'>
                      Formato: 11 dígitos
                  </Form.Text>
                <Form.Control.Feedback type='invalid'>
                  CPF é obrigatório
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
                  value={professorData.data_nascimento}
                  onChange={handleChange}
                  required  
                  disabled={loading}
                />
                <Form.Control.Feedback type='invalid'>
                  Data de nascimento é obrigatória
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
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
                  Informe um e-mail válido
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
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
                />
                <Form.Text className='text-muted'>
                      Formato: 11 dígitos
                  </Form.Text>
              </Form.Group>
            </Col>
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
                  <option value='Espanhol'>Espanhol</option>
                  <option value='Educação Física'>Educação Física</option>
                  <option value='Artes'>Artes</option>
                  <option value='Música'>Música</option>
                  <option value='Teatro'>Teatro</option>
                  <option value='Filosofia'>Filosofia</option>
                  <option value='Sociologia'>Sociologia</option>
                  <option value='Biologia'>Biologia</option>
                  <option value='Física'>Física</option>
                  <option value='Química'>Química</option>
                  <option value='Informática'>Informática</option>
                  <option value='Programação'>Programação</option>
                  <option value='Administração'>Administração</option>
                  <option value='Psicologia'>Psicologia</option>
                  <option value='Pedagogia'>Pedagogia</option>
                </Form.Select>
                <Form.Control.Feedback type='invalid'>
                  Selecione o departamento
                </Form.Control.Feedback>
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
                  />
                  {professorData.id ? ' Atualizando...' : ' Salvando...'}
                </>
              ) : (
                <>
                  <BsCheckCircle style={{ marginRight: '8px', color: '#fff', fontSize: '18px' }} />
                  {professorData.id ? 'Atualizar Professor' : 'Cadastrar Professor'}
                </>
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default CadProfessor  