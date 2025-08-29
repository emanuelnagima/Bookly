import { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Modal, Spinner, Toast } from 'react-bootstrap'

import UsuarioEspecialList from '../components/UsuarioEspecialList';
import CadUsuarioEspecial from '../components/CadUsuarioEspecial';
import usuarioEspecialService from '../services/usuarioEspecialService';

const UsuariosEspeciais = () => {
  const [showForm, setShowForm] = useState(false)
  const [usuarios, setUsuarios] = useState([])
  const [usuarioToDelete, setUsuarioToDelete] = useState(null)
  const [usuarioToEdit, setUsuarioToEdit] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [operationType, setOperationType] = useState('')

  const loadUsuarios = async () => {
    try {
      setLoading(true)
      const dados = await usuarioEspecialService.getAll()
      setUsuarios(dados)
      setError(null)
    } catch (error) {
      console.error('Erro ao carregar usuários especiais:', error)
      setError('Falha ao carregar usuários. Tente recarregar a página.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsuarios()
  }, [])

  const handleSaveUsuario = async (usuario) => {
    try {
      setLoading(true)

      // VERIFICAÇÃO DE DUPLICIDADE NO FRONTEND
      const usuarioExistente = usuarios.find(u =>
        (u.nome_completo.toLowerCase().trim() === usuario.nome_completo.toLowerCase().trim() ||
         u.email.toLowerCase().trim() === usuario.email.toLowerCase().trim() ||
         u.cpf === usuario.cpf) &&
        u.id !== usuario.id
      )

      if (usuarioExistente) {
        setError(
          `O usuário "${usuarioExistente.nome_completo}" já está cadastrado no sistema. Verifique os dados e tente novamente.`
        )
        setLoading(false)
        return
      }

      // ENVIO PARA O SERVIDOR
      const method = usuario.id ? 'PUT' : 'POST'
      const url = usuario.id
        ? `http://localhost:3000/api/usuarios-especiais/${usuario.id}`
        : 'http://localhost:3000/api/usuarios-especiais'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario)
      })

      const responseData = await response.json()

      if (!response.ok) {
        if (responseData.message && responseData.message.includes('Duplicate entry')) {
          throw new Error(`O usuário "${usuario.nome_completo}" já está cadastrado no sistema. Verifique os dados e tente novamente.`)
        }
        throw new Error(responseData.message || 'Erro ao salvar usuário')
      }

      await loadUsuarios()

      setToastMessage(usuario.id ? 'Usuário atualizado com sucesso!' : 'Usuário cadastrado com sucesso!')
      setOperationType(usuario.id ? 'update' : 'create')
      setShowSuccessToast(true)

      setShowForm(false)
      setUsuarioToEdit(null)
      setError(null)

    } catch (error) {
      console.error('Erro ao salvar usuário:', error)
      setError(error.message || `Falha ao ${usuario.id ? 'atualizar' : 'cadastrar'} usuário. Tente novamente.`)
    } finally {
      setLoading(false)
    }
  }

  const handleEditUsuario = async (id) => {
    try {
      setLoading(true)
      const usuario = await usuarioEspecialService.getById(id)
      setUsuarioToEdit(usuario)
      setShowForm(true)
      setError(null)
    } catch (error) {
      console.error('Erro ao buscar usuário:', error)
      setError('Erro ao carregar usuário para edição.')
    } finally {
      setLoading(false)
    }
  }

  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirmDelete = (id) => {
    setUsuarioToDelete(id)
    setShowDeleteModal(true)
  }

  const handleDeleteUsuario = async () => {
    if (!usuarioToDelete || isDeleting) return

    setIsDeleting(true)
    setLoading(true)

    try {
      await usuarioEspecialService.remove(usuarioToDelete)
      setToastMessage('Usuário excluído com sucesso!')
      setOperationType('delete')
      setShowSuccessToast(true)
      await loadUsuarios()
    } catch (error) {
      console.error("Falha na exclusão:", error)
      setError("Não foi possível excluir o usuário. Tente novamente.")
    } finally {
      setIsDeleting(false)
      setLoading(false)
      setShowDeleteModal(false)
      setUsuarioToDelete(null)
    }
  }

  return (
    <Container className="py-4">
      {/* Toast */}
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999 }}>
        <Toast 
          show={showSuccessToast} 
          onClose={() => setShowSuccessToast(false)} 
          delay={3000} 
          autohide
          bg={operationType === 'delete' ? 'danger' : 'success'}
        >
          <Toast.Header>
            <strong className="me-auto">
              {operationType === 'create' && 'Cadastro realizado'}
              {operationType === 'update' && 'Atualização realizada'}
              {operationType === 'delete' && 'Exclusão realizada'}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </div>

      {/* Loading */}
      {loading && !isDeleting && (
        <div className="text-center my-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Carregando...</span>
          </Spinner>
        </div>
      )}

      {/* Erros */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
          <button 
            type="button" 
            className="btn-close float-end" 
            onClick={() => setError(null)}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Cabeçalho */}
      <Row className="mb-4">
        <Col className="d-flex justify-content-between align-items-center">
          <h1>Gerenciamento de Usuários Especiais</h1>
          <Button 
            variant="success" 
            onClick={() => {
              setUsuarioToEdit(null)
              setShowForm(!showForm)
              setError(null)
            }}
            disabled={loading}
          >
            Adicionar Usuário
          </Button>
        </Col>
      </Row>

      {/* Formulário */}
      {showForm && (
        <Row className="mb-4">
          <Col>
            <CadUsuarioEspecial
              usuario={usuarioToEdit}
              onSave={handleSaveUsuario}
              onCancel={() => {
                setShowForm(false)
                setUsuarioToEdit(null)
                setError(null)
              }}
              loading={loading}
            />
          </Col>
        </Row>
      )}

      {/* Lista */}
      <Row>
        <Col>
          <UsuarioEspecialList
            usuarios={usuarios}
            onDelete={handleConfirmDelete}
            onEdit={handleEditUsuario}
            loading={loading}
          />
        </Col>
      </Row>

      {/* Modal de exclusão */}
      <Modal show={showDeleteModal} onHide={() => !isDeleting && setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja excluir este usuário?
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowDeleteModal(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteUsuario}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span className="ms-2">Excluindo...</span>
              </>
            ) : 'Excluir'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default UsuariosEspeciais
