// NO ARQUIVO CadUsuarioEspecial.jsx (APENAS ESTE COMPONENTE!)

import { useState, useEffect } from 'react'
import { Card, Form, Col, Row, Button, Spinner } from 'react-bootstrap'
import { BsCheckCircle } from "react-icons/bs";

// ADICIONE ESTA FUNÇÃO NO TOPO ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
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

// Máscaras 
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

const CadUsuarioEspecial = ({ onSave, onCancel, usuario, loading }) => {
  const [usuarioData, setUsuarioData] = useState({
    id: null,
    nome_completo: '',
    email: '',
    telefone: '',
    cpf: '',
    data_nascimento: '',
    tipo_usuario: ''
  })

  const [validated, setValidated] = useState(false)

  useEffect(() => {
    if (usuario) {
      setUsuarioData({
        id: usuario.id,
        nome_completo: usuario.nome_completo || '',
        email: usuario.email || '',
        telefone: maskTelefone(usuario.telefone || ''),
        cpf: maskCPF(usuario.cpf || ''),
        data_nascimento: formatDateForInput(usuario.data_nascimento), 
        tipo_usuario: usuario.tipo_usuario || ''
      })
    } else {
      setUsuarioData({
        id: null,
        nome_completo: '',
        email: '',
        telefone: '',
        cpf: '',
        data_nascimento: '',
        tipo_usuario: ''
      })
    }
  }, [usuario])

  const handleChange = (e) => {
    const { name, value } = e.target

    let maskedValue = value
    if (name === 'cpf') maskedValue = maskCPF(value)
    if (name === 'telefone') maskedValue = maskTelefone(value)

    setUsuarioData(prev => ({
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
      ...usuarioData,
      cpf: usuarioData.cpf.replace(/\D/g, ''),
      telefone: usuarioData.telefone.replace(/\D/g, '')
    }

    onSave(cleanedData)
  }

  // Calcular data máxima (hoje) e mínima (100 anos atrás)
  const hoje = new Date().toISOString().split('T')[0];
  const dataMinima = new Date();
  dataMinima.setFullYear(dataMinima.getFullYear() - 100);
  const dataMinimaFormatada = dataMinima.toISOString().split('T')[0];

  return (
    <Card>
      <Card.Header className='bg-primary text-white'>
        <h5 className='mb-0'>{usuarioData.id ? 'Editar Usuário ' : 'Cadastrar Usuário'}</h5>
      </Card.Header>
      <Card.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className='mb-3' controlId='nome_completo'>
                <Form.Label>Nome Completo</Form.Label>
                <Form.Control
                  type='text'
                  name='nome_completo'
                  placeholder='Digite o nome do usuário'
                  value={usuarioData.nome_completo}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <Form.Control.Feedback type='invalid'>
                  Informe o nome completo
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
             <Col md={6}>
            <Form.Group className='mb-3' controlId='cpf'>
              <Form.Label>CPF</Form.Label>
              <Form.Control
                type='text'
                name='cpf'
                value={usuarioData.cpf}
                onChange={handleChange}
                placeholder='000.000.000-00'
                required
                disabled={loading}
                maxLength={14}
              />
              <Form.Text className='text-muted'>
                      Formato: 11 dígitos
                  </Form.Text>
              <Form.Control.Feedback type='invalid'>
                Informe o CPF (000.000.000-00)
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
                value={usuarioData.data_nascimento} 
                onChange={handleChange}
                required
                disabled={loading}
                max={hoje}
                min={dataMinimaFormatada}
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
                value={usuarioData.email}
                placeholder='usuário@exemplo.com'
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
                value={usuarioData.telefone}
                onChange={handleChange}
                placeholder='(00) 00000-0000'
                required
                disabled={loading}
              />
              <Form.Text className='text-muted'>
                      Formato: 11 dígitos
                  </Form.Text>
              <Form.Control.Feedback type='invalid'>
                Informe o telefone
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className='mb-3' controlId='tipo_usuario'>
              <Form.Label>Tipo de Usuário</Form.Label>
              <Form.Select
                name='tipo_usuario'
                value={usuarioData.tipo_usuario}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value=''>Selecione...</option>
                <option value='Diretor'>Diretor</option>
                <option value='Coordenador'>Coordenador</option>
                <option value='Secretário'>Secretário</option>
                <option value='Bibliotecário'>Bibliotecário</option>
                <option value='Orientador'>Orientador</option>
                <option value='Funcionário'>Funcionário</option>
                <option value='Assistente Administrativo'>Assistente Administrativo</option>
                <option value='Ex-aluno'>Ex-aluno</option>
                <option value='Pais ou Responsável'>Pais ou Responsável</option>
                <option value='Outro'>Outro</option>
              </Form.Select>
              <Form.Control.Feedback type='invalid'>
                Selecione o tipo de usuário
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
              variant="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  {usuarioData.id ? ' Atualizando...' : ' Salvando...'}
                </>
              ) : (
                <>
                  <BsCheckCircle className="me-2 text" />
                  {usuarioData.id ? 'Atualizar Usuário' : 'Cadastrar Usuário'}
                </>
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default CadUsuarioEspecial
