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

 useEffect(() => {
    document.title = "Bookly - Autores";
  }, []);

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
    setError(error.message)
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

      {/* Cabeçalho com borda completa e ícone */}
      <div
        className="rounded-3 p-4 mb-4"
        style={{
          border: '1px solid #e6e6e6',
          borderRadius: '0.75rem'
        }}
      >
        <Row className="align-items-center">
          <Col md={8}>
            <div className="d-flex align-items-center">
              <div className="me-3">
                <i className="fas fa-book fa-2x" style={{ color: '#0b192c' }}></i>
              </div>
              <div>
                <h4 className="fw-bold text-dark mb-1">Autores</h4>
                <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>
                  Cadastro e gerenciamento de autores do sistema
                </p>
              </div>
            </div>
          </Col>

          <Col md={4} className="text-md-end">
            <Button
              variant="success"
              className="fw-semibold px-4"
              onClick={() => {
                setAutorToEdit(null)
                setShowForm(!showForm)
                setError(null)
              }}
              disabled={loading}
            >
              <i className="fas fa-plus-circle me-2"></i>
              Adicionar Autor
            </Button>
          </Col>
        </Row>
      </div>
        <p className="text-muted mb-1" style={{ fontSize: '0.9rem', marginLeft: '2px' }}>
        Esta seção permite o <strong>cadastro e gerenciamento de autores</strong>. Você pode adicionar novos autores, atualizar informações existentes ou remover registros, mantendo o sistema sempre atualizado e organizado.
      </p>
       <div className="d-flex flex-wrap justify-content-start align-items-center gap-4 py-3 border-bottom rounded-3">
  <div className="text-center px-3 py-2">
    <h6 className="mb-0 text-primary fw-bold">{autores.length}</h6>
    <small className="text-muted">Autores cadastrados</small>
  </div>
</div>
      {showForm && (
        <Row className="mb-4">
          <Col>
            <CadastroAutores
              autor={autorToEdit}
              onSave={handleSaveAutor}
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
            variant="cancelar"
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