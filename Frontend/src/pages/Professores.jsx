import { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Modal, Spinner, Toast } from 'react-bootstrap'
import ProfessorList from '../components/ProfessorList'
import CadProfessor from '../components/CadProfessor'
import professorService from '../services/professorService'

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
  const [isDeleting, setIsDeleting] = useState(false)

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

      // Verificação de duplicidade por e-mail, matrícula e telefone
      const emailExistente = professores.find(p =>
        p.email.toLowerCase().trim() === professor.email.toLowerCase().trim() && p.id !== professor.id
      )
      if (emailExistente) {
        setError(`Já existe um professor com o e-mail "${professor.email}" cadastrado.`)
        setLoading(false)
        return
      }

      const matriculaExistente = professores.find(p =>
        p.matricula === professor.matricula && p.id !== professor.id
      )
      if (matriculaExistente) {
        setError(`Já existe um professor com a matrícula "${professor.matricula}" cadastrado.`)
        setLoading(false)
        return
      }

      const telefoneExistente = professores.find(p =>
        p.telefone === professor.telefone && p.id !== professor.id
      )
      if (telefoneExistente) {
        setError(`Já existe um professor com o telefone "${professor.telefone}" cadastrado.`)
        setLoading(false)
        return
      }

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
      setError(null)
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
      setProfessorToEdit(professor)
      setShowForm(true)
      setError(null)
    } catch (error) {
      console.error('Erro ao buscar professor:', error)
      setError('Erro ao carregar professor para edição.')
    } finally {
      setLoading(false)
    }
  }

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
      setError(null)
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
      {/* Toast de sucesso */}
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
                <i className="fas fa-chalkboard-teacher fa-2x" style={{ color: '#0b192c' }}></i>
              </div>
              <div>
                <h4 className="fw-bold text-dark mb-1">Professores</h4>
                <p className="text-muted mb-0">
                  Total de <strong>{professores.length}</strong> professores cadastrados
                </p>
              </div>
            </div>
          </Col>

          <Col md={4} className="text-md-end">
            <Button
              variant="success"
              className="fw-semibold px-4"
              onClick={() => {
                setProfessorToEdit(null)
                setShowForm(!showForm)
                setError(null)
              }}
              disabled={loading}
            >
              <i className="fas fa-plus-circle me-2"></i>
              Adicionar Professor
            </Button>
          </Col>
        </Row>
      </div>

      <p className="text-muted mb-4" style={{ fontSize: '0.9rem', marginLeft: '2px' }}>
        Esta seção permite o <strong>cadastro e gerenciamento de professores</strong>. Você pode adicionar novos professores, atualizar informações existentes ou remover registros, mantendo o sistema sempre atualizado e organizado.
      </p>

      {/* Formulário */}
      {showForm && (
        <Row className="mb-4">
          <Col>
            <CadProfessor
              professor={professorToEdit}
              onSave={handleSaveProfessor}
              onCancel={() => {
                setShowForm(false)
                setProfessorToEdit(null)
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
          <ProfessorList
            professores={professores}
            onDelete={handleConfirmDelete}
            onEdit={handleEditProfessor}
            loading={loading}
          />
        </Col>
      </Row>

      {/* Modal de confirmação */}
      <Modal show={showDeleteModal} onHide={() => !isDeleting && setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja excluir este professor?
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
