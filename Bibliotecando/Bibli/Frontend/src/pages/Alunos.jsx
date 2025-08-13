import { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Modal, Spinner, Toast } from 'react-bootstrap'
import AlunoList from '../components/AlunoList'
import CadAluno from '../components/CadAluno'
import alunoService from '../services/alunoService';
const Alunos = () => {
  const [showForm, setShowForm] = useState(false)
  const [alunos, setAlunos] = useState([])
  const [alunoToDelete, setAlunoToDelete] = useState(null)
  const [alunoToEdit, setAlunoToEdit] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [operationType, setOperationType] = useState('')

  const loadAlunos = async () => {
    try {
      setLoading(true)
      const dados = await alunoService.getAll()
      setAlunos(dados)
      setError(null)
    } catch (error) {
      console.error('Erro ao carregar alunos:', error)
      setError('Falha ao carregar alunos. Tente recarregar a página.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAlunos()
  }, [])

  const handleSaveAluno = async (aluno) => {
    try {
      setLoading(true)
      if (aluno.id) {
        await alunoService.update(aluno)
        setToastMessage('Aluno atualizado com sucesso!')
        setOperationType('update')
      } else {
        await alunoService.add(aluno)
        setToastMessage('Aluno cadastrado com sucesso!')
        setOperationType('create')
      }
      
      await loadAlunos()
      setShowSuccessToast(true)
      setShowForm(false)
      setAlunoToEdit(null)
    } catch (error) {
      console.error('Erro ao salvar aluno:', error)
      setError(`Falha ao ${aluno.id ? 'atualizar' : 'cadastrar'} aluno. Tente novamente.`)
    } finally {
      setLoading(false)
    }
  }

  const handleEditAluno = async (id) => {
    try {
      setLoading(true)
      const aluno = await alunoService.getById(id)
      setAlunoToEdit(aluno)
      setShowForm(true)
    } catch (error) {
      console.error('Erro ao buscar aluno:', error)
      setError('Erro ao carregar aluno para edição.')
    } finally {
      setLoading(false)
    }
  }

  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirmDelete = (id) => {
    setAlunoToDelete(id)
    setShowDeleteModal(true)
  }

  const handleDeleteAluno = async () => {
    if (!alunoToDelete || isDeleting) return

    setIsDeleting(true)
    setLoading(true)

    try {
      await alunoService.remove(alunoToDelete)
      setToastMessage('Aluno excluído com sucesso!')
      setOperationType('delete')
      setShowSuccessToast(true)
      await loadAlunos()
    } catch (error) {
      console.error("Falha na exclusão:", error)
      setError("Não foi possível excluir o aluno. Tente novamente.")
    } finally {
      setIsDeleting(false)
      setLoading(false)
      setShowDeleteModal(false)
      setAlunoToDelete(null)
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
          <h1>Gerenciamento de Alunos</h1>
          <Button 
            variant="success" 
            onClick={() => {
              setAlunoToEdit(null)
              setShowForm(!showForm)
            }}
            disabled={loading}
          >
            {showForm ? 'Cancelar' : 'Adicionar Aluno'}
          </Button>
        </Col>
      </Row>

      {showForm && (
        <Row className="mb-4">
          <Col>
            <CadAluno
              aluno={alunoToEdit}
              onSave={handleSaveAluno}
              onCancel={() => {
                setShowForm(false)
                setAlunoToEdit(null)
              }}
              loading={loading}
            />
          </Col>
        </Row>
      )}

      <Row>
        <Col>
          <AlunoList
            alunos={alunos}
            onDelete={handleConfirmDelete}
            onEdit={handleEditAluno}
            loading={loading}
          />
        </Col>
      </Row>

      <Modal show={showDeleteModal} onHide={() => !isDeleting && setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja excluir este aluno?
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
            onClick={handleDeleteAluno}
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

export default Alunos