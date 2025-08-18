import { Button, Col, Container, Row, Modal, Spinner, Toast } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import CadEditora from '../components/CadEditora'
import EditoraList from '../components/EditoraList'

const Editoras = () => {
  const [showForm, setShowForm] = useState(false)
  const [editoras, setEditoras] = useState([])
  const [editoraToDelete, setEditoraToDelete] = useState(null)
  const [editoraToEdit, setEditoraToEdit] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [operationType, setOperationType] = useState('')

  const loadEditoras = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3000/api/editoras')
      if (!response.ok) throw new Error('Erro ao carregar editoras')
      const data = await response.json()
      setEditoras(data)
      setError(null)
    } catch (error) {
      console.error('Erro ao carregar editoras:', error)
      setError('Falha ao carregar editoras. Tente recarregar a página.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEditoras()
  }, [])

  const handleSaveEditora = async (editora) => {
    try {
      setLoading(true)
      const method = editora.id ? 'PUT' : 'POST'
      const url = editora.id ? `http://localhost:3000/api/editoras/${editora.id}` : 'http://localhost:3000/api/editoras'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editora)
      })
      
      if (!response.ok) throw new Error('Erro ao salvar editora')
      
      setToastMessage(editora.id ? 'Editora atualizada com sucesso!' : 'Editora cadastrada com sucesso!')
      setOperationType(editora.id ? 'update' : 'create')
      setShowSuccessToast(true)
      
      await loadEditoras()
      setShowForm(false)
      setEditoraToEdit(null)
    } catch (error) {
      console.error('Erro ao salvar editora:', error)
      setError(`Falha ao ${editora.id ? 'atualizar' : 'cadastrar'} editora. Tente novamente.`)
    } finally {
      setLoading(false)
    }
  }

  const handleEditEditora = async (id) => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:3000/api/editoras/${id}`)
      if (!response.ok) throw new Error('Erro ao buscar editora')
      const data = await response.json()
      setEditoraToEdit(data)
      setShowForm(true)
    } catch (error) {
      console.error('Erro ao buscar editora:', error)
      setError('Erro ao carregar editora para edição.')
    } finally {
      setLoading(false)
    }
  }

  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirmDelete = (id) => {
    setEditoraToDelete(id)
    setShowDeleteModal(true)
  }

  const handleDeleteEditora = async () => {
    if (!editoraToDelete || isDeleting) return

    setIsDeleting(true)
    setLoading(true)

    try {
      const response = await fetch(`http://localhost:3000/api/editoras/${editoraToDelete}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) throw new Error('Erro ao excluir editora')
      
      setToastMessage('Editora excluída com sucesso!')
      setOperationType('delete')
      setShowSuccessToast(true)
      
      await loadEditoras()
    } catch (error) {
      console.error("Falha na exclusão:", error)
      setError("Não foi possível excluir a editora. Tente novamente.")
    } finally {
      setIsDeleting(false)
      setLoading(false)
      setShowDeleteModal(false)
      setEditoraToDelete(null)
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
          <h1>Gerenciamento de Editoras</h1>
          <Button 
            variant="success" 
            onClick={() => {
              setEditoraToEdit(null)
              setShowForm(!showForm)
            }}
            disabled={loading}
          >
            Adicionar Editora
          </Button>
        </Col>
      </Row>

      {showForm && (
        <Row className="mb-4">
          <Col>
            <CadEditora
              editora={editoraToEdit}
              onSave={handleSaveEditora}
              onCancel={() => {
                setShowForm(false)
                setEditoraToEdit(null)
              }}
              loading={loading}
            />
          </Col>
        </Row>
      )}

      <Row>
        <Col>
          <EditoraList
            editoras={editoras}
            onDelete={handleConfirmDelete}
            onEdit={handleEditEditora}
            loading={loading}
          />
        </Col>
      </Row>

      <Modal show={showDeleteModal} onHide={() => !isDeleting && setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja excluir esta editora?
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
            onClick={handleDeleteEditora}
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

export default Editoras