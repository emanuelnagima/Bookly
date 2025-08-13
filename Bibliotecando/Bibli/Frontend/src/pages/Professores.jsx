import { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Modal, Spinner, Toast } from 'react-bootstrap'
import ProfessorList from '../components/ProfessorList'
import CadProfessor from '../components/CadProfessor'
import professorService from '../services/professorService';

const Professores = () => {
  const [showForm, setShowForm] = useState(false)
  const [professores, setProfessores] = useState([])
  const [professorToDelete, setProfessorToDelete] = useState(null)
  const [professorToEdit, setProfessorToEdit] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [operationType, setOperationType] = useState('') // 'create', 'update', 'delete'

  const loadProfessores = async () => {
    try {
      setLoading(true)
      const dados = await professorService.getAll()
      setProfessores(dados)
      setError(null)
    } catch (error) {
      console.error('Erro ao carregar professores:', error)
      setError('Falha ao carregar professores. Tente recarregar a página.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfessores()
  }, [])

  const handleSaveProfessor = async (professor) => {
    try {
      setLoading(true)
      if (professor.id) {
        // Edição
        await professorService.update(professor)
        setToastMessage('Professor atualizado com sucesso!')
        setOperationType('update')
      } else {
        // Cadastro
        await professorService.add(professor)
        setToastMessage('Professor cadastrado com sucesso!')
        setOperationType('create')
      }
      await loadProfessores()
      setShowSuccessToast(true)
      setShowForm(false)
      setProfessorToEdit(null)
    } catch (error) {
      console.error('Erro ao salvar professor:', error)
      setError(`Falha ao ${professor.id ? 'atualizar' : 'cadastrar'} professor. Tente novamente.`)
    } finally {
      setLoading(false)
    }
  }

  const handleEditProfessor = async (id) => {
    try {
      setLoading(true)
      const professor = await professorService.getById(id)
      // Aqui você pode mapear campos, se necessário, igual ao livro
      setProfessorToEdit(professor)
      setShowForm(true)
    } catch (error) {
      console.error('Erro ao buscar professor:', error)
      setError('Erro ao carregar professor para edição.')
    } finally {
      setLoading(false)
    }
  }

  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirmDelete = (id) => {
    setProfessorToDelete(id)
    setShowDeleteModal(true)
  }

  const handleDeleteProfessor = async () => {
    if (!professorToDelete || isDeleting) return

    setIsDeleting(true)
    setLoading(true)

    try {
      await professorService.remove(professorToDelete)
      setToastMessage('Professor excluído com sucesso!')
      setOperationType('delete')
      setShowSuccessToast(true)
      await loadProfessores()
    } catch (error) {
      console.error("Falha na exclusão:", error)
      setError("Não foi possível excluir o professor. Tente novamente.")
    } finally {
      setIsDeleting(false)
      setLoading(false)
      setShowDeleteModal(false)
      setProfessorToDelete(null)
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
          <h1>Gerenciamento de Professores</h1>
          <Button 
            variant="success" 
            onClick={() => {
              setProfessorToEdit(null)
              setShowForm(!showForm)
            }}
            disabled={loading}
          >
            {showForm ? 'Cancelar' : 'Adicionar Professor'}
          </Button>
        </Col>
      </Row>

      {showForm && (
        <Row className="mb-4">
          <Col>
            <CadProfessor
              professor={professorToEdit}
              onSave={handleSaveProfessor}
              onCancel={() => {
                setShowForm(false)
                setProfessorToEdit(null)
              }}
              loading={loading}
            />
          </Col>
        </Row>
      )}

      <Row>
        <Col>
          <ProfessorList
            professores={professores}
            onDelete={handleConfirmDelete}
            onEdit={handleEditProfessor}
            loading={loading}
          />
        </Col>
      </Row>

      <Modal show={showDeleteModal} onHide={() => !isDeleting && setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja excluir este professor?
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
            onClick={handleDeleteProfessor}
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

export default Professores
