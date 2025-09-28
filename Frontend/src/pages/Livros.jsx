import { Button, Col, Container, Row, Modal, Spinner, Toast, Alert } from 'react-bootstrap'
import { useState, useEffect, useCallback } from 'react'
import LivroForm from '../components/CadLivro'
import LivroList from '../components/LivroList'
import livroService from '../services/livroService'

const Livros = () => {
  const [showForm, setShowForm] = useState(false)
  const [livros, setLivros] = useState([])
  const [livroToDelete, setLivroToDelete] = useState(null)
  const [livroToEdit, setLivroToEdit] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [operationType, setOperationType] = useState('')

  // Carregar livros com useCallback para evitar loops
  const loadLivros = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const dados = await livroService.getAll()
      setLivros(dados)
    } catch (error) {
      console.error('Erro ao carregar livros:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadLivros()
  }, [loadLivros])

  const handleSaveLivro = async (livro) => {
    try {
      setLoading(true)
      setError('')

      let savedLivro
      
      if (livroToEdit) {
        // Modo edição
        savedLivro = await livroService.update({ ...livro, id: livroToEdit.id })
        setToastMessage('Livro atualizado com sucesso!')
        setOperationType('update')
      } else {
        // Modo cadastro
        savedLivro = await livroService.add(livro)
        setToastMessage('Livro cadastrado com sucesso!')
        setOperationType('create')
      }
      
      console.log('Livro salvo com sucesso:', savedLivro)
      
      // Recarrega a lista e limpa o estado
      await loadLivros()
      setShowSuccessToast(true)
      setShowForm(false)
      setLivroToEdit(null)
      
    } catch (error) {
      console.error('Erro ao salvar livro:', error)
      
      // Tratamento específico para erros de duplicação
      if (error.message.includes('Duplicate') || error.message.includes('duplicidade') || error.message.includes('já existe') || error.message.includes('ISBN')) {
        setError('ISBN já cadastrado! Por favor, use um ISBN diferente.')
      } else {
        setError(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleEditLivro = async (id) => {
    try {
      setLoading(true)
      setError('')
      
      const livro = await livroService.getById(id)
      
      if (!livro) {
        throw new Error('Livro não encontrado')
      }
      
      setLivroToEdit({
        id: livro.id,
        titulo: livro.titulo || '',
        autor_id: livro.autor_id?.toString() || '',
        editora_id: livro.editora_id?.toString() || '',
        isbn: livro.isbn || '',
        genero: livro.genero || '',
        ano_publicacao: livro.ano_publicacao?.toString() || '',
        imagem: livro.imagem || null
      })
      
      setShowForm(true)
    } catch (error) {
      console.error('Erro ao buscar livro:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirmDelete = (id) => {
    setLivroToDelete(id)
    setShowDeleteModal(true)
  }

  const handleDeleteLivro = async () => {
    if (!livroToDelete || isDeleting) return

    setIsDeleting(true)
    setError('')

    try {
      await livroService.remove(livroToDelete)
      setToastMessage('Livro excluído com sucesso!')
      setOperationType('delete')
      setShowSuccessToast(true)
      await loadLivros()
    } catch (error) {
      console.error("Falha na exclusão:", error)
      setError(error.message)
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
      setLivroToDelete(null)
    }
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setLivroToEdit(null)
    setError('')
  }

  const handleOpenForm = () => {
    setLivroToEdit(null)
    setShowForm(true)
    setError('')
  }

  return (
    <Container className="py-4">
      {/* Toast de Sucesso */}
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999 }}>
        <Toast 
          show={showSuccessToast} 
          onClose={() => setShowSuccessToast(false)} 
          delay={3000} 
          autohide
          bg={operationType === 'delete' ? 'danger' : 'success'}
        >
          <Toast.Header className={`bg-${operationType === 'delete' ? 'danger' : 'success'} text-white`}>
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

      {/* Loading Global */}
      {loading && !isDeleting && (
        <div className="text-center my-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Carregando...</p>
        </div>
      )}
      
      {/* Alert de Erro */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')} className="mt-3">
          <Alert.Heading>Erro</Alert.Heading>
          {error}
        </Alert>
      )}

      {/* Cabeçalho */}
      <Row className="mb-4 align-items-center">
        <Col md={8}>
          <h4 className="display-30 fw-bold text-primary">Acervo de Livros</h4>
          <p className="text-muted">
            Cadastre e gerencie todos os livros do acervo bibliográfico e acompanhe o estoque em tempo real.
          </p>
        </Col>
        <Col md={4} className="text-md-end mt-3 mt-md-0">
          <Button 
            variant="success"
            onClick={handleOpenForm}
            disabled={loading}
            className="px-4"
          >
            Adicionar Livro
          </Button>
        </Col>
      </Row>    

      {/* Formulário */}
      {showForm && (
        <Row className="mb-4">
          <Col>
            <LivroForm
              livro={livroToEdit}
              onSave={handleSaveLivro}
              onCancel={handleCloseForm}
              loading={loading}
            />
          </Col>
        </Row>
      )}

      {/* Lista de Livros */}
      <Row>
        <Col>
          <LivroList
            livros={livros}
            onDelete={handleConfirmDelete}
            onEdit={handleEditLivro}
            loading={loading}
          />
        </Col>
      </Row>

      {/* Modal de Confirmação de Exclusão */}
      <Modal show={showDeleteModal} onHide={() => !isDeleting && setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja excluir este livro?
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
            onClick={handleDeleteLivro}
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

export default Livros