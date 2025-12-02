import { useState, useEffect } from 'react'
import { Card, Form, Col, Row, Button, Spinner, InputGroup } from 'react-bootstrap'
import { BsCheckCircle } from "react-icons/bs";
import { FaLock } from 'react-icons/fa';

// Máscaras (REMOVER maskMatricula)
const maskCPF = (value) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4')
    .slice(0, 14)
}

const maskTelefone = (value) => {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 15)
}

const CadAluno = ({ onSave, onCancel, aluno, loading }) => {
  const [alunoData, setAlunoData] = useState({
    id: null,
    nome: '',
    cpf: '',
    data_nascimento: '',
    email: '',
    telefone: '',
    turma: ''
  })

  const [validated, setValidated] = useState(false)

  useEffect(() => {
    if (aluno) {
      setAlunoData({
        id: aluno.id,
        nome: aluno.nome || '',
        // NÃO incluir matrícula aqui - ela virá do backend
        cpf: maskCPF(aluno.cpf),
        data_nascimento: aluno.data_nascimento || '',
        email: aluno.email || '',
        telefone: maskTelefone(aluno.telefone),
        turma: aluno.turma || ''
      })
    } else {
      setAlunoData({
        id: null,
        nome: '',
        cpf: '',
        data_nascimento: '',
        email: '',
        telefone: '',
        turma: ''
      })
    }
  }, [aluno])

  const handleChange = (e) => {
    const { name, value } = e.target

    let maskedValue = value
    if (name === 'cpf') maskedValue = maskCPF(value)
    if (name === 'telefone') maskedValue = maskTelefone(value)
    // REMOVER tratamento de matrícula

    setAlunoData(prev => ({
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

    const cleanedData = {
      ...alunoData,
      cpf: alunoData.cpf.replace(/\D/g, ''),
      telefone: alunoData.telefone.replace(/\D/g, ''),
      // NÃO enviar matrícula - será gerada no backend
    }

    onSave(cleanedData)
  }

  return (
    <Card>
      <Card.Header className='bg-primary text-white'>
        <h5 className='mb-0'>{alunoData.id ? 'Editar Aluno' : 'Cadastrar Aluno'}</h5>
      </Card.Header>
      <Card.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          
          {/* SEÇÃO DE MATRÍCULA (somente leitura para edição) */}
          {alunoData.id && aluno?.matricula && (
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
                      value={aluno.matricula}
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
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type='text'
                  name='nome'
                  placeholder='Digite o nome do aluno'
                  value={alunoData.nome}
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
                  value={alunoData.cpf}
                  onChange={handleChange}
                  placeholder='000.000.000-00'
                  required
                  disabled={loading}
                />
                <Form.Control.Feedback type='invalid'>
                  Informe o CPF
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
                  value={alunoData.data_nascimento}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <Form.Control.Feedback type='invalid'>
                  Informe a data de nascimento
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='email'>
                <Form.Label>E-mail</Form.Label>
                <Form.Control
                  type='email'
                  name='email'
                  value={alunoData.email}
                  placeholder='aluno@exemplo.com'
                  onChange={handleChange}
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
                  value={alunoData.telefone}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                  disabled={loading}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='turma'>
                <Form.Label>Turma</Form.Label>
                <Form.Select
                  name='turma'
                  value={alunoData.turma}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value=''>Selecione...</option>
                  <option value='1º Ano'>1º Ano</option>
                  <option value='2º Ano'>2º Ano</option>
                  <option value='3º Ano'>3º Ano</option>
                  <option value='4º Ano'>4º Ano</option>
                  <option value='5º Ano'>5º Ano</option>
                  <option value='6º Ano'>6º Ano</option>
                  <option value='7º Ano'>7º Ano</option>
                  <option value='8º Ano'>8º Ano</option>
                  <option value='9º Ano'>9º Ano</option>
                  <option value='1º Colegial'>1º Colegial</option>
                  <option value='2º Colegial'>2º Colegial</option>
                  <option value='3º Colegial'>3º Colegial</option>
                </Form.Select>
                <Form.Control.Feedback type='invalid'>
                  Selecione a turma
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
                    className="me-2"
                  />
                  {alunoData.id ? ' Atualizando...' : ' Salvando...'}
                </>
              ) : (
                <>
                  <BsCheckCircle style={{ marginRight: '8px', color: '#fff', fontSize: '18px' }} />
                  {alunoData.id ? 'Atualizar Aluno' : 'Cadastrar Aluno'}
                </>
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default CadAluno