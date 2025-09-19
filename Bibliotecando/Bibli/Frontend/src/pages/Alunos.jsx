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

      // VERIFICAÇÃO DE DUPLICIDADE NO FRONTEND
      // Verifica por CPF, email ou outro campo único que identifique um aluno
      const alunoExistente = alunos.find(a =>
        (a.cpf === aluno.cpf ||
         a.email.toLowerCase().trim() === aluno.email.toLowerCase().trim() ||
         a.matricula === aluno.matricula) &&
        a.id !== aluno.id
      )

      if (alunoExistente) {
        setError(
          `O aluno "${alunoExistente.nome}" já está cadastrado no sistema. Verifique os dados e tente novamente.`
        )
        setLoading(false)
        return
      }

      // ENVIO PARA O SERVIDOR
      const method = aluno.id ? 'PUT' : 'POST'
      const url = aluno.id
        ? `http://localhost:3000/api/alunos/${aluno.id}`
        : 'http://localhost:3000/api/alunos'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aluno)
      })

      const responseData = await response.json()

      if (!response.ok) {
        if (responseData.message && responseData.message.includes('Duplicate entry')) {
          throw new Error(`O aluno "${aluno.nome}" já está cadastrado no sistema. Verifique os dados e tente novamente.`)
        }
        throw new Error(responseData.message || 'Erro ao salvar aluno')
      }

      await loadAlunos()

      setToastMessage(aluno.id ? 'Aluno atualizado com sucesso!' : 'Aluno cadastrado com sucesso!')
      setOperationType(aluno.id ? 'update' : 'create')
      setShowSuccessToast(true)

      setShowForm(false)
      setAlunoToEdit(null)
      setError(null)

    } catch (error) {
      console.error('Erro ao salvar aluno:', error)
      setError(error.message || `Falha ao ${aluno.id ? 'atualizar' : 'cadastrar'} aluno. Tente novamente.`)
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
      setError(null)
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

      <Row className="mb-4 align-items-center">
          <Col md={8}>
            <h4 className="display-30 fw-bold text">Alunos</h4>
            <p className="text-muted fs-10">
              Cadastre e gerencie os alunos que têm acesso ao sistema.
            </p>
          </Col>
          <Col md={4} className="text-md-end mt-3 mt-md-0">
            <Button
              variant="success"
              onClick={() => {
                setAlunoToEdit(null)
                setShowForm(!showForm)
                setError(null)
              }}
              disabled={loading}
            >
              Adicionar Aluno
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
                setError(null)
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
            variant="paginacao" 
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