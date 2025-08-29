import { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Modal } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import CadUsuarioEspecial from '../../components/CadUsuarioEspecial'
import UsuarioEspecialList from '../../components/UsuarioEspecialList'
import usuarioEspecialService from '../../services/usuarioEspecialService';

const CadastroUsuariosEspeciais = () => {
  const [showForm, setShowForm] = useState(false)
  const [usuarios, setUsuarios] = useState([])
  const [usuarioToDelete, setUsuarioToDelete] = useState(null)
  const [usuarioToEdit, setUsuarioToEdit] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    loadUsuarios()
  }, [])

  const loadUsuarios = () => {
    usuarioEspecialService.getAll()
      .then(data => setUsuarios(data))
      .catch(error => console.error('Erro ao carregar usuários especiais:', error))
  }

  const handleSave = (usuario) => {
    const operation = usuarioToEdit ? 
      usuarioEspecialService.update(usuarioToEdit.id, usuario) : 
      usuarioEspecialService.add(usuario)

    operation
      .then(() => {
        loadUsuarios()
        setShowForm(false)
        setUsuarioToEdit(null)
      })
      .catch(error => console.error('Erro ao salvar usuário especial:', error))
  }

  const handleEdit = (id) => {
    usuarioEspecialService.getById(id)
      .then(usuario => {
        setUsuarioToEdit(usuario)
        setShowForm(true)
      })
      .catch(error => console.error('Erro ao buscar usuário especial:', error))
  }

  const handleDelete = () => {
    usuarioEspecialService.remove(usuarioToDelete)
      .then(() => {
        loadUsuarios()
        setShowDeleteModal(false)
      })
      .catch(error => console.error('Erro ao excluir usuário especial:', error))
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col className="d-flex justify-content-between align-items-center">
          <h1>Cadastro de Usuários Especiais</h1>
          <div>
            <Button variant="secondary" onClick={() => navigate('/cadastros')} className="me-2">
              Voltar
            </Button>
            <Button 
              variant={usuarioToEdit ? "warning" : "success"} 
              onClick={() => setShowForm(true)}
            >
              {usuarioToEdit ? 'Editar' : 'Novo'} Usuário
            </Button>
          </div>
        </Col>
      </Row>

      {showForm && (
        <Row className="mb-4">
          <Col>
            <CadUsuarioEspecial 
              onSave={handleSave} 
              onCancel={() => {
                setShowForm(false)
                setUsuarioToEdit(null)
              }}
              usuario={usuarioToEdit}
            />
          </Col>
        </Row>
      )}

      <Row>
        <Col>
          <UsuarioEspecialList 
            usuarios={usuarios}
            onDelete={(id) => {
              setUsuarioToDelete(id)
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
          Tem certeza que deseja excluir este usuário permanentemente?
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

export default CadastroUsuariosEspeciais