import { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Modal, Spinner, Toast } from 'react-bootstrap'
import AutorList from '../components/AutorList' 
import CadastroAutores from './cadastros/CadastroAutores'
import autorService from '../services/autorService';

const Autores = () => {
  const [showForm, setShowForm] = useState(false)
  const [autores, setAutores] = useState([])
  const [autorToDelete, setAutorToDelete] = useState(null)
  const [autorToEdit, setAutorToEdit] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [operationType, setOperationType] = useState('')

  const loadAutores = async () => {
    try {
      setLoading(true)
      const dados = await autorService.getAll()
      setAutores(dados)
      setError(null)
    } catch (error) {
      console.error('Erro ao carregar autores:', error)
      setError('Falha ao carregar autores. Tente recarregar a página.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAutores()
  }, [])

  const handleSaveAutor = async (autor) => {
    try {
      setLoading(true)
      if (autor.id) {
        await autorService.update(autor)
        setToastMessage('Autor atualizado com sucesso!')
        setOperationType('update')
      } else {
        await autorService.add(autor)
        setToastMessage('Autor cadastrado com sucesso!')
        setOperationType('create')
      }
      
      await loadAutores()
      setShowSuccessToast(true)
      setShowForm(false)
      setAutorToEdit(null)
    } catch (error) {
      console.error('Erro ao salvar autor:', error)
      setError(`Falha ao ${autor.id ? 'atualizar' : 'cadastrar'} autor. Tente novamente.`)
    } finally {
      setLoading(false)
    }
  }

  const handleEditAutor = async (id) => {
    try {
      setLoading(true)
      const autor = await autorService.getById(id)
      setAutorToEdit(autor)
      setShowForm(true)
    } catch (error) {
      console.error('Erro ao buscar autor:', error)
      setError('Erro ao carregar autor para edição.')
    } finally {
      setLoading(false)
    }
  }

  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirmDelete = (id) => {
    setAutorToDelete(id)
    setShowDeleteModal(true)
  }

  const handleDeleteAutor = async () => {
    if (!autorToDelete || isDeleting) return

    setIsDeleting(true)
    setLoading(true)

    try {
      await autorService.remove(autorToDelete)
      setToastMessage('Autor excluído com sucesso!')
      setOperationType('delete')
      setShowSuccessToast(true)
      await loadAutores()
    } catch (error) {
      console.error("Falha na exclusão:", error)
      setError("Não foi possível excluir o autor. Tente novamente.")
    } finally {
      setIsDeleting(false)
      setLoading(false)
      setShowDeleteModal(false)
      setAutorToDelete(null)
    }
  }

  return (
    <Container className="py-4">
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
          <Toast.Body className="text-white">
            {toastMessage}
          </Toast.Body>
        </Toast>
      </div>

      {loading && !isDeleting && (
        <div className="text-center my-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Carregando...</span>
          </Spinner>
        </div>
      )}
      
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

      <Row className="mb-4">
        <Col className="d-flex justify-content-between align-items-center">
          <h1>Gerenciamento de Autores</h1>
          <Button 
            variant="success" 
            onClick={() => {
              setAutorToEdit(null)
              setShowForm(!showForm)
            }}
            disabled={loading}
          >
            Adicionar Autor
          </Button>
        </Col>
      </Row>

      {showForm && (
        <Row className="mb-4">
          <Col>
            <CadastroAutores
                autor={autorToEdit}   // <-- aqui
                onSave={handleSaveAutor}  // alterar de onSubmit para onSave
                onCancel={() => {
                  setShowForm(false)
                  setAutorToEdit(null)
                }}
              />
          </Col>
        </Row>
      )}

      <Row>
        <Col>
          <AutorList
            autores={autores}
            onDelete={handleConfirmDelete}
            onEdit={handleEditAutor}
          />
        </Col>
      </Row>

      <Modal show={showDeleteModal} onHide={() => !isDeleting && setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja excluir este autor?
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="paginacao" 
            onClick={() => setShowDeleteModal(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteAutor}
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

export default Autores