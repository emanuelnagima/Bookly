import { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Modal } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import CadAluno from '../../components/CadAluno'
import AlunoList from '../../components/AlunoList'
import alunoService from '../../services/alunoService';

const CadastroAlunos = () => {
  const [showForm, setShowForm] = useState(false)
  const [alunos, setAlunos] = useState([])
  const [alunoToDelete, setAlunoToDelete] = useState(null)
  const [alunoToEdit, setAlunoToEdit] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    loadAlunos()
  }, [])

  const loadAlunos = () => {
    alunoService.getAll()
      .then(data => setAlunos(data))
      .catch(error => console.error('Erro ao carregar alunos:', error))
  }

  const handleSave = (aluno) => {
    const operation = alunoToEdit ? 
      alunoService.update(alunoToEdit.id, aluno) : 
      alunoService.add(aluno)

    operation
      .then(() => {
        loadAlunos()
        setShowForm(false)
        setAlunoToEdit(null)
      })
      .catch(error => console.error('Erro ao salvar aluno:', error))
  }

  const handleEdit = (id) => {
    alunoService.getById(id)
      .then(aluno => {
        setAlunoToEdit(aluno)
        setShowForm(true)
      })
      .catch(error => console.error('Erro ao buscar aluno:', error))
  }

  const handleDelete = () => {
    alunoService.remove(alunoToDelete)
      .then(() => {
        loadAlunos()
        setShowDeleteModal(false)
      })
      .catch(error => console.error('Erro ao excluir aluno:', error))
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col className="d-flex justify-content-between align-items-center">
          <h1>Cadastro de Alunos</h1>
          <div>
            <Button variant="secondary" onClick={() => navigate('/cadastros')} className="me-2">
              Voltar
            </Button>
            <Button 
              variant={alunoToEdit ? "warning" : "success"} 
              onClick={() => setShowForm(true)}
            >
              {alunoToEdit ? 'Editar' : 'Novo'} Aluno
            </Button>
          </div>
        </Col>
      </Row>

      {showForm && (
        <Row className="mb-4">
          <Col>
            <CadAluno 
              onSave={handleSave} 
              onCancel={() => {
                setShowForm(false)
                setAlunoToEdit(null)
              }}
              aluno={alunoToEdit}
            />
          </Col>
        </Row>
      )}

      <Row>
        <Col>
          <AlunoList 
            alunos={alunos}
            onDelete={(id) => {
              setAlunoToDelete(id)
              setShowDeleteModal(true)
            }}
            onEdit={handleEdit}
          />
        </Col>
      </Row>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja excluir este aluno permanentemente?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Confirmar Exclusão
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default CadastroAlunos