import { Button, Col, Container, Row, Modal, Spinner, Toast } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import CadEditora from '../components/CadEditora'
import EditoraList from '../components/EditoraList'
import editoraService from '../services/editoraService'

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

 useEffect(() => {
    document.title = "Bookly - Editoras";
  }, []);

  // Carregar editoras
  const loadEditoras = async () => {
    try {
      setLoading(true)
      const dados = await editoraService.getAll()
      setEditoras(Array.isArray(dados) ? dados : [])
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

  // Salvar editora
  const handleSaveEditora = async (editora) => {
    try {
      setLoading(true)

      // VERIFICAÇÃO NO FRONTEND 
      const editoraExistente = editoras.find(e =>
        e.nome.toLowerCase().trim() === editora.nome.toLowerCase().trim() &&
        e.id !== editora.id
      )

      if (editoraExistente) {
        setError(`Já existe uma editora com o nome "${editora.nome}" cadastrada. Por favor, utilize um nome diferente.`)
        setLoading(false)
        return
      }

      // ENVIO PARA O SERVIDOR USANDO SERVICE
      if (editora.id) {
        await editoraService.update(editora)
      } else {
        await editoraService.add(editora)
      }

      // SUCESSO
      await loadEditoras()

      setToastMessage(editora.id ? 'Editora atualizada com sucesso!' : 'Editora cadastrada com sucesso!')
      setOperationType(editora.id ? 'update' : 'create')
      setShowSuccessToast(true)

      setShowForm(false)
      setEditoraToEdit(null)
      setError(null)

    } catch (error) {
      console.error('Erro ao salvar editora:', error)
      setError(error.message || `Falha ao ${editora.id ? 'atualizar' : 'cadastrar'} editora. Tente novamente.`)
    } finally {
      setLoading(false)
    }
  }

  // Editar
  const handleEditEditora = async (id) => {
    try {
      setLoading(true)
      const editora = await editoraService.getById(id)
      setEditoraToEdit(editora)
      setShowForm(true)
      setError(null)
    } catch (error) {
      console.error('Erro ao buscar editora:', error)
      setError('Erro ao carregar editora para edição.')
    } finally {
      setLoading(false)
    }
  }

  // Deletar
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
      await editoraService.remove(editoraToDelete)
      setToastMessage('Editora excluída com sucesso!')
      setOperationType('delete')
      setShowSuccessToast(true)
      await loadEditoras()
      setError(null)
    } catch (error) {
      console.error("Falha na exclusão:", error)
      setError(error.message) // MOSTRA A MENSAGEM ESPECÍFICA
    } finally {
      setIsDeleting(false)
      setLoading(false)
      setShowDeleteModal(false)
      setEditoraToDelete(null)
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
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
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

      {/* Cabeçalho + botão */}
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
                <h4 className="fw-bold text-dark mb-1">Editoras</h4>
                <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>
                  Cadastro e gerenciamento de editoras do sistema
                </p>
              </div>
            </div>
          </Col>

          <Col md={4} className="text-md-end">
            <Button
              variant="success"
              className="fw-semibold px-4"
              onClick={() => {
                setEditoraToEdit(null)
                setShowForm(!showForm)
                setError(null)
              }}
              disabled={loading}
            >
              <i className="fas fa-plus-circle me-2"></i>
              Adicionar Editora
            </Button>
          </Col>
        </Row>
      </div>
      {/* Descrição */}
      <p className="text-muted mb-1" style={{ fontSize: '0.9rem', marginLeft: '2px' }}>
        Esta seção permite o <strong>cadastro e gerenciamento de editoras</strong>. Você pode adicionar novas editoras, atualizar informações existentes ou remover registros, mantendo o sistema sempre atualizado e organizado.
      </p>
<div className="d-flex flex-wrap justify-content-start align-items-center gap-4 py-3 border-bottom rounded-3">
  <div className="text-center px-3 py-2">
    <h6 className="mb-0 text-primary fw-bold">{editoras.length}</h6>
    <small className="text-muted">Editoras cadastradas</small>
  </div>
</div>
      {/* Formulário */}
      {showForm && (
        <Row className="mb-4">
          <Col>
            <CadEditora
              editora={editoraToEdit}
              onSave={handleSaveEditora}
              onCancel={() => {
                setShowForm(false)
                setEditoraToEdit(null)
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
          <EditoraList
            editoras={editoras}
            onDelete={handleConfirmDelete}
            onEdit={handleEditEditora}
            loading={loading}
          />
        </Col>
      </Row>

      {/* Modal de confirmação */}
      <Modal show={showDeleteModal} onHide={() => !isDeleting && setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>Tem certeza que deseja excluir esta editora?</Modal.Body>
        <Modal.Footer>
          <Button variant="cancelar" onClick={() => setShowDeleteModal(false)} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteEditora} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span className="ms-2">Excluindo...</span>
              </>
            ) : (
              'Excluir'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default Editoras