import { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Modal, Spinner, Toast } from 'react-bootstrap'
import AutorList from '../components/AutorList'
import autorService from '../services/autorService';
import { FaTimes } from 'react-icons/fa';

const Autores = () => {
  const [showForm, setShowForm] = useState(false)
  const [autores, setAutores] = useState([])
  const [autorToDelete, setAutorToDelete] = useState(null)
  const [autorToEdit, setAutorToEdit] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [operationType, setOperationType] = useState('')

  useEffect(() => {
    document.title = "Bookly - Autores";
  }, []);

  const loadAutores = async () => {
    try {
      setLoading(true)
      const dados = await autorService.getAll()
      setAutores(dados)
      setError(null)
    } catch (error) {
      console.error('Erro ao carregar autores:', error)
      setError({
        type: 'carregamento_falhou',
        title: 'Erro ao Carregar',
        message: 'Falha ao carregar autores',
        detalhe: 'Tente recarregar a página',
        style: 'danger'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAutores()
  }, [])

  const handleSaveAutor = async (autor) => {
    try {
      setLoading(true)
      setError(null)



      // Envio para o servidor
      if (autor.id) {
        await autorService.update(autor)
        setToastMessage('Autor atualizado com sucesso!')
        setOperationType('update')
      } else {
        await autorService.add(autor)
        setToastMessage('Autor cadastrado com sucesso!')
        setOperationType('create')
      }

      await loadAutores()
      setShowSuccessToast(true)
      setShowForm(false)
      setAutorToEdit(null)
      setError(null)

    } catch (error) {
      console.error('Erro ao salvar autor:', error)

      let errorObject = {};

      // Tratamento específico para erro 401
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        errorObject = {
          type: 'sessao_expirada',
          title: 'Sessão Expirada',
          message: 'Sua sessão expirou',
          detalhe: 'Faça login novamente para continuar',
          style: 'danger'
        };
      } else if (error.message?.includes('already exists') || error.message?.includes('já existe') || error.message?.includes('duplicat')) {
        errorObject = {
          type: 'registro_duplicado',
          title: 'Registro Duplicado',
          message: `Falha ao ${autor.id ? 'atualizar' : 'cadastrar'} autor`,
          detalhe: 'Um registro duplicado foi encontrado',
          style: 'warning'
        };
      } else if (error.message?.includes('Data inválida') || error.message?.includes('data inválida')) {
        errorObject = {
          type: 'data_invalida',
          title: 'Data Inválida',
          message: 'A data de nascimento não é válida',
          detalhe: 'Verifique a data informada',
          style: 'warning'
        };
      } else if (error.message?.includes('Nacionalidade') || error.message?.includes('nacionalidade')) {
        errorObject = {
          type: 'nacionalidade_invalida',
          title: 'Nacionalidade Inválida',
          message: 'A nacionalidade informada não é válida',
          detalhe: 'Selecione uma nacionalidade da lista',
          style: 'warning'
        };
      } else if (error.message?.includes('Nome') && error.message?.includes('inválido')) {
        errorObject = {
          type: 'nome_invalido',
          title: 'Nome Inválido',
          message: 'O nome informado não é válido',
          detalhe: 'O nome deve ter pelo menos 2 caracteres',
          style: 'warning'
        };
      } else {
        errorObject = {
          type: 'erro_servidor',
          title: 'Erro no Sistema',
          message: `Falha ao ${autor.id ? 'atualizar' : 'cadastrar'} autor`,
          detalhe: error.message || 'Tente novamente',
          style: 'danger'
        };
      }

      setError(errorObject);
    } finally {
      setLoading(false);
    }
  }

  const handleEditAutor = async (id) => {
    try {
      setLoading(true)
      const autor = await autorService.getById(id)
      setAutorToEdit(autor)
      setShowForm(true)
      setError(null)
    } catch (error) {
      console.error('Erro ao buscar autor:', error)
      setError({
        type: 'autor_nao_encontrado',
        title: 'Autor Não Encontrado',
        message: 'Erro ao carregar autor para edição',
        detalhe: 'O autor pode ter sido removido',
        style: 'warning'
      })
    } finally {
      setLoading(false)
    }
  }

  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirmDelete = (id) => {
    setAutorToDelete(id)
    setShowDeleteModal(true)
  }

  const handleDeleteAutor = async () => {
    if (!autorToDelete || isDeleting) return

    setIsDeleting(true)
    setLoading(true)

    try {
      await autorService.remove(autorToDelete)
      setToastMessage('Autor excluído com sucesso!')
      setOperationType('delete')
      setShowSuccessToast(true)
      await loadAutores()
      setError(null)
    } catch (error) {
      console.error("Falha na exclusão:", error)
      setError({
        type: 'exclusao_falhou',
        title: 'Erro na Exclusão',
        message: 'Não foi possível excluir o autor',
        detalhe: error.message || 'Tente novamente',
        style: 'danger'
      })
    } finally {
      setIsDeleting(false)
      setLoading(false)
      setShowDeleteModal(false)
      setAutorToDelete(null)
    }
  }

  return (
    <Container className="py-4">
      {/* TOAST ESTILIZADO */}
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999 }}>
        <Toast
          show={showSuccessToast}
          onClose={() => setShowSuccessToast(false)}
          delay={6000}
          autohide
          className="shadow-sm"
          style={{
            minWidth: '320px',
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            borderLeft: `4px solid ${operationType === 'delete'
                ? '#dc3545'
                : operationType === 'update'
                  ? '#17a2b8'
                  : '#28a745'
              }`,
            animation: showSuccessToast ? 'slideInRight 0.3s ease-out' : 'none'
          }}
        >
          <Toast.Body className="p-3">
            <div className="d-flex justify-content-between align-items-start">
              <div className="d-flex align-items-start">
                {/* Ícone pequeno e discreto */}
                <div
                  className="me-3 mt-1"
                  style={{
                    color: operationType === 'delete'
                      ? '#dc3545'
                      : operationType === 'update'
                        ? '#17a2b8'
                        : '#28a745',
                    fontSize: '1rem'
                  }}
                >
                  {operationType === 'delete' ? (
                    <i className="fas fa-trash"></i>
                  ) : operationType === 'update' ? (
                    <i className="fas fa-check"></i>
                  ) : (
                    <i className="fas fa-check"></i>
                  )}
                </div>

                {/* Conteúdo de texto */}
                <div>
                  <h6 className="mb-1 fw-semibold text-dark">
                    {operationType === 'create' ? 'Sucesso!' :
                      operationType === 'update' ? 'Atualizado!' :
                        'Excluído!'}
                  </h6>
                  <p className="mb-0 text-secondary" style={{ fontSize: '0.9rem' }}>
                    {toastMessage}
                  </p>
                  <small className="text-muted mt-1 d-block">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </small>
                </div>
              </div>

              {/* Botão de fechar bem discreto */}
              <button
                onClick={() => setShowSuccessToast(false)}
                className="btn-close btn-close-sm opacity-50"
                style={{
                  fontSize: '0.6rem',
                  padding: '5px',
                  marginTop: '-2px',
                  marginRight: '-5px'
                }}
              />
            </div>
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
        (() => {
          // Se for objeto estruturado (novos erros)
          if (typeof error === 'object' && error.title) {
            return (
              <div className={`alert alert-${error.style === 'danger' ? 'danger' : 'warning'} py-2 mb-3 d-flex align-items-center`}>
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center">
                    <div className={`${error.style === 'danger' ? 'bg-danger' : 'bg-warning'} text-white rounded-circle d-flex align-items-center justify-content-center me-2`}
                      style={{ width: '20px', height: '20px', fontSize: '12px' }}>
                      !
                    </div>
                    <strong className="text-dark">{error.title}</strong>
                  </div>
                  <div className="mt-1 small">
                    {error.message}
                    {error.nome && (
                      <div className="mt-1">
                        <strong>Nome:</strong> {error.nome}
                      </div>
                    )}
                    {error.detalhe && (
                      <div className="mt-1">
                        {error.detalhe}
                      </div>
                    )}
                  </div>
                </div>
                <FaTimes
                  className="text-muted ms-2"
                  onClick={() => setError(null)}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            );
          }

          return (
            <div className="alert alert-danger py-2 mb-3 d-flex align-items-center">
              <div className="flex-grow-1">
                <strong>Erro:</strong> {error}
              </div>
              <FaTimes
                className="text-muted ms-2"
                onClick={() => setError(null)}
                style={{ cursor: 'pointer' }}
              />
            </div>
          );
        })()
      )}

      {/* Cabeçalho com borda completa e ícone */}
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
                <h4 className="fw-bold text-dark mb-1">Autores</h4>
                <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>
                  Cadastro e gerenciamento de autores do sistema
                </p>
              </div>
            </div>
          </Col>

          <Col md={4} className="text-md-end">
            <Button
              variant="success"
              className="fw-semibold px-4"
              onClick={() => {
                setAutorToEdit(null)
                setShowForm(!showForm)
                setError(null)
              }}
              disabled={loading}
            >
              <i className="fas fa-plus-circle me-2"></i>
              Adicionar Autor
            </Button>
          </Col>
        </Row>
      </div>
      <p className="text-muted mb-1" style={{ fontSize: '0.9rem', marginLeft: '2px' }}>
        Esta seção permite o <strong>cadastro e gerenciamento de autores</strong>. Você pode adicionar novos autores, atualizar informações existentes ou remover registros, mantendo o sistema sempre atualizado e organizado.
      </p>
      <div className="d-flex flex-wrap justify-content-start align-items-center gap-4 py-3 border-bottom rounded-3">
        <div className="text-center px-3 py-2">
          <h6 className="mb-0 text-primary fw-bold">{autores.length}</h6>
          <small className="text-muted">Autores cadastrados</small>
        </div>
      </div>
      {showForm && (
        <Row className="mb-4">
          <Col>
            <CadastroAutores
              autor={autorToEdit}
              onSave={handleSaveAutor}
              onCancel={() => {
                setShowForm(false)
                setAutorToEdit(null)
              }}
            />
          </Col>
        </Row>
      )}

      <Row>
        <Col>
          <AutorList
            autores={autores}
            onDelete={handleConfirmDelete}
            onEdit={handleEditAutor}
          />
        </Col>
      </Row>

      <Modal show={showDeleteModal} onHide={() => !isDeleting && setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja excluir este autor?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="cancelar"
            onClick={() => setShowDeleteModal(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteAutor}
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

export default Autores