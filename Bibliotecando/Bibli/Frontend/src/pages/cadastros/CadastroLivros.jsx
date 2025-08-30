import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Form, Button, Card, Spinner, Image } from 'react-bootstrap'

const CadastroLivro = () => {
  const { id } = useParams()     
  const navigate = useNavigate()
  const [livro, setLivro] = useState({
    titulo: '',
    autor: '',
    editora: '',
    isbn: '',
    genero: '',
    ano_publicacao: '',
    imagem: null
  })
  const [imagemPreview, setImagemPreview] = useState('')
  const [loading, setLoading] = useState(false)

  // Função para buscar o livro pelo id
  const fetchLivro = async (id) => {
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:3000/api/livros/${id}`)
      if (!res.ok) throw new Error('Erro ao buscar livro')
      const data = await res.json()
      
      if (data.success) {
        setLivro({
          titulo: data.data.titulo || '',
          autor: data.data.autor || '',
          editora: data.data.editora || '',
          isbn: data.data.isbn || '',
          genero: data.data.genero || '',
          ano_publicacao: data.data.ano_publicacao || '',
          imagem: null
        })
        
        // Se já existe uma imagem, mostrar preview
        if (data.data.imagem) {
          setImagemPreview(`http://localhost:3000${data.data.imagem}`)
        }
      }
    } catch (error) {
      console.error(error)
      alert('Não foi possível carregar os dados do livro.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchLivro(id)
    }
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setLivro(prev => ({ ...prev, [name]: value }))
  }

  const handleImagemChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setLivro(prev => ({
        ...prev,
        imagem: file
      }))

      // Criar preview da imagem
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagemPreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const formData = new FormData()
      
      // Adicionar campos ao formData
      formData.append('titulo', livro.titulo)
      formData.append('autor', livro.autor)
      formData.append('editora', livro.editora)
      formData.append('isbn', livro.isbn)
      formData.append('genero', livro.genero)
      formData.append('ano_publicacao', livro.ano_publicacao)
      
      // Adicionar imagem se existir
      if (livro.imagem) {
        formData.append('imagem', livro.imagem)
      }

      const method = id ? 'PUT' : 'POST'
      const url = id ? `http://localhost:3000/api/livros/${id}` : 'http://localhost:3000/api/livros'
      
      const res = await fetch(url, {
        method,
        body: formData
      })
      
      if (!res.ok) throw new Error('Erro ao salvar livro')
      
      const result = await res.json()
      if (result.success) {
        alert(id ? 'Livro atualizado com sucesso!' : 'Livro cadastrado com sucesso!')
        navigate('/livros') // volta para a lista de livros depois de salvar
      } else {
        throw new Error(result.message || 'Erro ao salvar livro')
      }
    } catch (error) {
      console.error(error)
      alert('Não foi possível salvar o livro.')
    }
  }

  if (loading) return (
    <Container className="py-5 text-center">
      <Spinner animation="border" />
      <p>Carregando dados do livro...</p>
    </Container>
  )

  return (
    <Container className="py-4">
      <Card>
        <Card.Header>
          <h4>{id ? 'Editar Livro' : 'Cadastrar Novo Livro'}</h4>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Título </Form.Label>
              <Form.Control
                type="text"
                name="titulo"
                value={livro.titulo}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Autor </Form.Label>
              <Form.Control
                type="text"
                name="autor"
                value={livro.autor}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Editora </Form.Label>
              <Form.Control
                type="text"
                name="editora"
                value={livro.editora}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>ISBN</Form.Label>
              <Form.Control
                type="text"
                name="isbn"
                value={livro.isbn}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Gênero </Form.Label>
              <Form.Select
                name="genero"
                value={livro.genero}
                onChange={handleChange}
                required
              >
                <option value="">Selecione...</option>
                <option value="Romance">Romance</option>
                <option value="Ficção">Ficção</option>
                <option value="Drama">Drama</option>
                <option value="Suspense">Suspense</option>
                <option value="Fantasia">Fantasia</option>
                <option value="Biografia">Biografia</option>
                <option value="Terror">Terror</option>
                <option value="Educação">Educação</option>
                <option value="Outro">Outro</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ano de Publicação </Form.Label>
              <Form.Control
                type="number"
                name="ano_publicacao"
                value={livro.ano_publicacao}
                onChange={handleChange}
                required
                min="0"
                max={new Date().getFullYear()}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Imagem do Livro</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImagemChange}
              />
            </Form.Group>

            {imagemPreview && (
              <Form.Group className="mb-3">
                <Form.Label>Preview da Imagem:</Form.Label>
                <div>
                  <Image 
                    src={imagemPreview} 
                    alt="Preview" 
                    fluid 
                    style={{ maxHeight: '200px' }}
                  />
                </div>
              </Form.Group>
            )}

            <Button variant="primary" type="submit">
              {id ? 'Salvar Alterações' : 'Cadastrar'}
            </Button>
            
            <Button 
              variant="secondary" 
              className="ms-2"
              onClick={() => navigate('/livros')}
            >
              Cancelar
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default CadastroLivro