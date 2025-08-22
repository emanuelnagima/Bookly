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

  //  Carregar editoras
  const loadEditoras = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3000/api/editoras')
      if (!response.ok) throw new Error('Erro ao carregar editoras')
      const data = await response.json()

      // Pega o array certo vindo da API
      setEditoras(Array.isArray(data.data) ? data.data : [])
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

  //  Salvar editora - MÉTODO MELHORADO
  const handleSaveEditora = async (editora) => {
    try {
      setLoading(true)
      
      // 1. VERIFICAÇÃO NO FRONTEND (rápida e instantânea)
      const editoraExistente = editoras.find(e => 
        e.nome.toLowerCase().trim() === editora.nome.toLowerCase().trim() && 
        e.id !== editora.id
      )
      
      if (editoraExistente) {
        setError(`Já existe uma editora com o nome "${editora.nome}" cadastrada. Por favor, utilize um nome diferente.`)
        setLoading(false)
        return
      }

      // 2. ENVIO PARA O SERVIDOR
      const method = editora.id ? 'PUT' : 'POST'
      const url = editora.id
        ? `http://localhost:3000/api/editoras/${editora.id}`
        : 'http://localhost:3000/api/editoras'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editora)
      })

      const responseData = await response.json()

      if (!response.ok) {
        // 3. TRATAMENTO DE ERRO DO BACKEND (segurança)
        if (responseData.message && responseData.message.includes('Duplicate entry')) {
          throw new Error('Já existe uma editora com este nome cadastrada no sistema. Utilize um nome diferente.')
        }
        throw new Error(responseData.message || 'Erro ao salvar editora')
      }

      // 4. SUCESSO
      await loadEditoras()

      setToastMessage(editora.id ? 'Editora atualizada com sucesso!' : 'Editora cadastrada com sucesso!')
      setOperationType(editora.id ? 'update' : 'create')
      setShowSuccessToast(true)

      setShowForm(false)
      setEditoraToEdit(null)
      setError(null) // Limpa erros anteriores
      
    } catch (error) {
      console.error('Erro ao salvar editora:', error)
      setError(error.message || `Falha ao ${editora.id ? 'atualizar' : 'cadastrar'} editora. Tente novamente.`)
    } finally {
      setLoading(false)
    }
  }

  //  Editar
  const handleEditEditora = async (id) => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:3000/api/editoras/${id}`)
      if (!response.ok) throw new Error('Erro ao buscar editora')
      const data = await response.json()
      setEditoraToEdit(data.data) // pega editora do campo data
      setShowForm(true)
      setError(null) // Limpa erros ao abrir edição
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
      const response = await fetch(`http://localhost:3000/api/editoras/${editoraToDelete}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Erro ao excluir editora')
      await loadEditoras()

      setToastMessage('Editora excluída com sucesso!')
      setOperationType('delete')
      setShowSuccessToast(true)
      setError(null) // Limpa erros
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
      <Row className="mb-4">
        <Col className="d-flex justify-content-between align-items-center">
          <h1>Gerenciamento de Editoras</h1>
          <Button
            variant="success"
            onClick={() => {
              setEditoraToEdit(null)
              setShowForm(!showForm)
              setError(null) // Limpa erros ao abrir formulário
            }}
            disabled={loading}
          >
            Adicionar Editora
          </Button>
        </Col>
      </Row>

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
                setError(null) // Limpa erros ao cancelar
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
          <Button variant="paginacao  " onClick={() => setShowDeleteModal(false)} disabled={isDeleting}>
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