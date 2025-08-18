import { Button, Col, Container, Row, Modal, Spinner, Toast } from 'react-bootstrap'
import { useState, useEffect } from 'react'
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
  const [error, setError] = useState(null)
  

  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [operationType, setOperationType] = useState('') // 'create', 'update', 'delete'

  const loadLivros = async () => {
    try {
      setLoading(true)
      const dados = await livroService.getAll()
      setLivros(dados)
      setError(null)
    } catch (error) {
      console.error('Erro ao carregar livros:', error)
      setError('Falha ao carregar livros. Tente recarregar a página.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLivros()
  }, [])

  const handleSaveLivro = async (livro) => {
    try {
      setLoading(true)
      if (livro.id > 0) {
        // Edição
        await livroService.update(livro)
        setToastMessage('Livro atualizado com sucesso!')
        setOperationType('update')
      } else {
        // Cadastro
        await livroService.add(livro)
        setToastMessage('Livro cadastrado com sucesso!')
        setOperationType('create')
      }
      
      await loadLivros()
      setShowSuccessToast(true)
      setShowForm(false)
      setLivroToEdit(null)
    } catch (error) {
      console.error('Erro ao salvar livro:', error)
      setError(`Falha ao ${livro.id > 0 ? 'atualizar' : 'cadastrar'} livro. Tente novamente.`)
    } finally {
      setLoading(false)
    }
  }

  const handleEditLivro = async (id) => {
    try {
      setLoading(true)
      const livro = await livroService.getById(id)
      setLivroToEdit({
        id: livro.id,
        titulo: livro.titulo || livro.title || '',
        autor: livro.autor || livro.author || '',
        editora: livro.editora || livro.publisher || '',
        isbn: livro.isbn || '',
        genero: livro.genero || livro.genre || '',
        ano_publicacao: livro.ano_publicacao || livro.year || ''
      })
      setShowForm(true)
    } catch (error) {
      console.error('Erro ao buscar livro:', error)
      setError('Erro ao carregar livro para edição.')
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
    setLoading(true)

    try {
      await livroService.remove(livroToDelete)
      setToastMessage('Livro excluído com sucesso!')
      setOperationType('delete')
      setShowSuccessToast(true)
      await loadLivros()
    } catch (error) {
      console.error("Falha na exclusão:", error)
      setError("Não foi possível excluir o livro. Tente novamente.")
    } finally {
      setIsDeleting(false)
      setLoading(false)
      setShowDeleteModal(false)
      setLivroToDelete(null)
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
          <h1>Gerenciamento de Livros</h1>
          <Button 
            variant="success" 
            onClick={() => {
              setLivroToEdit(null)
              setShowForm(!showForm)
            }}
            disabled={loading}
          >
            Adicionar Livro
          </Button>
        </Col>
      </Row>

      {showForm && (
        <Row className="mb-4">
          <Col>
            <LivroForm
              livro={livroToEdit}
              onSave={handleSaveLivro}
              onCancel={() => {
                setShowForm(false)
                setLivroToEdit(null)
              }}
              loading={loading}
            />
          </Col>
        </Row>
      )}

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

      <Modal show={showDeleteModal} onHide={() => !isDeleting && setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja excluir este livro?
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