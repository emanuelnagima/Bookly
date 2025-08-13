import { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Modal } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import CadLivro from '../../components/CadLivro'
import LivroList from '../../components/LivroList'
import livroService from '../../services/livroService'

const CadastroLivros = () => {
  const [showForm, setShowForm] = useState(false)
  const [livros, setLivros] = useState([])
  const [livroToDelete, setLivroToDelete] = useState(null)
  const [livroToEdit, setLivroToEdit] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    loadLivros()
  }, [])

  const loadLivros = () => {
    setLivros(livroService.getAll())
  }

  const handleSave = (livro) => {
    if (livroToEdit) {
      const updated = livroService.update(livroToEdit.id, livro)
      setLivros(livros.map(l => l.id === livroToEdit.id ? updated : l))
      setLivroToEdit(null)
    } else {
      livroService.add(livro)
    }
    loadLivros()
    setShowForm(false)
  }

  const handleEdit = (id) => {
    const livro = livroService.getById(id)
    setLivroToEdit(livro)
    setShowForm(true)
  }

  const handleDelete = () => {
    livroService.remove(livroToDelete)
    loadLivros()
    setShowDeleteModal(false)
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col className="d-flex justify-content-between align-items-center">
          <h1>Cadastro de Livros</h1>
          <div>
            <Button variant="secondary" onClick={() => navigate('/cadastros')} className="me-2">
              Voltar
            </Button>
            {livroToEdit && (
              <Button 
                variant="success" 
                onClick={() => {
                  setLivroToEdit(null)
                  setShowForm(true)
                }}
                className="me-2"
              >
                Novo Livro
              </Button>
            )}
            <Button 
              variant={livroToEdit ? "warning" : "success"} 
              onClick={() => setShowForm(true)}
            >
              {livroToEdit ? 'Editar' : 'Novo'} Livro
            </Button>
          </div>
        </Col>
      </Row>

      {showForm && (
        <Row className="mb-4">
          <Col>
            <CadLivro 
              onSave={handleSave} 
              onCancel={() => {
                setShowForm(false)
                setLivroToEdit(null)
              }}
              livroToEdit={livroToEdit}
            />
          </Col>
        </Row>
      )}

      <Row>
        <Col>
          <LivroList 
            livros={livros}
            onDelete={(id) => {
              setLivroToDelete(id)
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
          Tem certeza que deseja excluir este livro permanentemente?
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

export default CadastroLivros;