import { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Modal } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import CadProfessor from '../../components/CadProfessor'
import ProfessorList from '../../components/ProfessorList'
import professorService from '../../services/professorService'

const CadastroProfessores = () => {
  const [showForm, setShowForm] = useState(false)
  const [professores, setProfessores] = useState([])
  const [professorToDelete, setProfessorToDelete] = useState(null)
  const [professorToEdit, setProfessorToEdit] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    loadProfessores()
  }, [])

  const loadProfessores = () => {
    setProfessores(professorService.getAll())
  }

  const handleSave = (professor) => {
    if (professorToEdit) {
      
      const updated = professorService.update(professorToEdit.id, professor)
      setProfessores(professores.map(p => p.id === professorToEdit.id ? updated : p))
      setProfessorToEdit(null)
    } else {
      
      professorService.add(professor)
    }
    loadProfessores()
    setShowForm(false)
  }

  const handleEdit = (id) => {
    const professor = professorService.getById(id)
    setProfessorToEdit(professor)
    setShowForm(true)
  }

  const handleDelete = () => {
    professorService.remove(professorToDelete)
    loadProfessores()
    setShowDeleteModal(false)
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col className="d-flex justify-content-between align-items-center">
          <h1>Cadastro de Professores</h1>
          <div>
            <Button variant="secondary" onClick={() => navigate('/cadastros')} className="me-2">
              Voltar
            </Button>
            {professorToEdit && (
              <Button 
                variant="success" 
                onClick={() => {
                  setProfessorToEdit(null)
                  setShowForm(true)
                }}
                className="me-2"
              >
                Novo Professor
              </Button>
            )}
            <Button 
              variant={professorToEdit ? "warning" : "success"} 
              onClick={() => setShowForm(true)}
            >
              {professorToEdit ? 'Editar' : 'Novo'} Professor
            </Button>
          </div>
        </Col>
      </Row>

      {showForm && (
        <Row className="mb-4">
          <Col>
            <CadProfessor 
              onSave={handleSave} 
              onCancel={() => {
                setShowForm(false)
                setProfessorToEdit(null)
              }}
              professorToEdit={professorToEdit}
            />
          </Col>
        </Row>
      )}

      <Row>
        <Col>
          <ProfessorList 
            professores={professores}
            onDelete={(id) => {
              setProfessorToDelete(id)
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
          Tem certeza que deseja excluir este professor?
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

export default CadastroProfessores