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
  const [operationType, setOperationType] = useState('')

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

      // VERIFICAÇÃO DE DUPLICIDADE NO FRONTEND
      // Verifica por ISBN ou título/autor 
      const livroExistente = livros.find(l =>
        (l.isbn === livro.isbn || 
         (l.titulo.toLowerCase().trim() === livro.titulo.toLowerCase().trim() && 
          l.autor.toLowerCase().trim() === livro.autor.toLowerCase().trim())) &&
        l.id !== livro.id
      )

      if (livroExistente) {
        setError(
          `O livro "${livroExistente.titulo}" já está cadastrado no sistema. Verifique os dados e tente novamente.`
        )
        setLoading(false)
        return
      }

      // ENVIO PARA O SERVIDOR
      let savedLivro
      
      if (livro.id) {
        // Edição
        savedLivro = await livroService.update(livro)
        setToastMessage('Livro atualizado com sucesso!')
        setOperationType('update')
      } else {
        // Cadastro
        savedLivro = await livroService.add(livro)
        setToastMessage('Livro cadastrado com sucesso!')
        setOperationType('create')
      }
      
      // Verifica se o livro foi salvo corretamente
      if (!savedLivro || !savedLivro.id) {
        throw new Error('Erro ao salvar livro: resposta inválida')
      }
      
      await loadLivros()
      setShowSuccessToast(true)
      setShowForm(false)
      setLivroToEdit(null)
      setError(null)
    } catch (error) {
      console.error('Erro ao salvar livro:', error)
      
      // Verifica se é um erro de duplicidade do backend
      if (error.message && error.message.includes('Duplicate entry') || 
          error.message && error.message.includes('duplicidade')) {
        setError('Este livro já está cadastrado no sistema. Verifique os dados e tente novamente.')
      } else {
        setError(`Falha ao ${livro.id ? 'atualizar' : 'cadastrar'} livro: ${error.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleEditLivro = async (id) => {
    try {
      setLoading(true)
      const livro = await livroService.getById(id)
      
      if (!livro || !livro.id) {
        throw new Error('Livro não encontrado')
      }
      
      setLivroToEdit({
  id: livro.id,
  titulo: livro.titulo || livro.title || '',
  autor_id: livro.autor_id,       
  editora_id: livro.editora_id,   
  isbn: livro.isbn || '',
  genero: livro.genero || livro.genre || '',
  ano_publicacao: livro.ano_publicacao || livro.year || '',
  imagem: livro.imagem || null
})
      setShowForm(true)
      setError(null)
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

      <Row className="mb-4 align-items-center">
        <Col md={8}>
          <h4 className="display-30 fw-bold text">Acervo de Livros</h4>
          <p className="text-muted fs-10">
            Cadastre e gerencie todos os livros do acervo bibliográfico e acompanhe o estoque em tempo real.
          </p>
        </Col>
        <Col md={4} className="text-md-end mt-3 mt-md-0">
          <Button 
            variant="success"
            onClick={() => {
              setLivroToEdit(null)
              setShowForm(!showForm)
              setError(null)
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
                setError(null)
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