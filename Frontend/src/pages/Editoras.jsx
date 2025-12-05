import { Button, Col, Container, Row, Modal, Spinner, Toast } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import CadEditora from '../components/CadEditora'
import EditoraList from '../components/EditoraList'
import editoraService from '../services/editoraService'
import { FaTimes } from 'react-icons/fa';

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
      setError({
        type: 'carregamento_falhou',
        title: 'Erro ao Carregar',
        message: 'Falha ao carregar editoras',
        detalhe: 'Tente recarregar a página',
        style: 'danger'
      })
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
      setError(null)

      // VERIFICAÇÃO DE DUPLICIDADE NO FRONTEND
      const cnpjExistente = editoras.find(e =>
        e.cnpj === editora.cnpj && e.id !== editora.id
      );
      if (cnpjExistente && editora.cnpj) {
        setError({
          type: 'cnpj_duplicado',
          title: 'CNPJ Duplicado',
          message: `Já existe uma editora com este CNPJ`,
          cnpj: editora.cnpj,
          style: 'warning'
        });
        setLoading(false);
        return;
      }

      const emailExistente = editoras.find(e =>
        e.email?.toLowerCase().trim() === editora.email?.toLowerCase().trim() &&
        e.id !== editora.id &&
        editora.email
      );
      if (emailExistente && editora.email) {
        setError({
          type: 'email_duplicado',
          title: 'E-mail Duplicado',
          message: `Já existe uma editora com este e-mail`,
          email: editora.email,
          style: 'warning'
        });
        setLoading(false);
        return;
      }

      const telefoneExistente = editoras.find(e =>
        e.telefone === editora.telefone && e.id !== editora.id && editora.telefone
      );
      if (telefoneExistente && editora.telefone) {
        setError({
          type: 'telefone_duplicado',
          title: 'Telefone Duplicado',
          message: `Já existe uma editora com este telefone`,
          telefone: editora.telefone,
          style: 'warning'
        });
        setLoading(false);
        return;
      }

      // ENVIO PARA O SERVIDOR
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
          message: `Falha ao ${editora.id ? 'atualizar' : 'cadastrar'} editora`,
          detalhe: 'Um registro duplicado foi encontrado',
          style: 'warning'
        };
      } else if (error.message?.includes('CNPJ inválido') || error.message?.includes('cnpj inválido')) {
        errorObject = {
          type: 'cnpj_invalido',
          title: 'CNPJ Inválido',
          message: 'O CNPJ informado não é válido',
          detalhe: 'Verifique o número e tente novamente',
          style: 'warning'
        };
      } else if (error.message?.includes('E-mail inválido') || error.message?.includes('email inválido')) {
        errorObject = {
          type: 'email_invalido',
          title: 'E-mail Inválido',
          message: 'O e-mail informado não é válido',
          detalhe: 'Verifique o formato do e-mail',
          style: 'warning'
        };
      } else {
        errorObject = {
          type: 'erro_servidor',
          title: 'Erro no Sistema',
          message: `Falha ao ${editora.id ? 'atualizar' : 'cadastrar'} editora`,
          detalhe: error.message || 'Tente novamente',
          style: 'danger'
        };
      }

      setError(errorObject);
    } finally {
      setLoading(false);
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
      setError({
        type: 'editora_nao_encontrada',
        title: 'Editora Não Encontrada',
        message: 'Erro ao carregar editora para edição',
        detalhe: 'A editora pode ter sido removida',
        style: 'warning'
      })
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
      setError({
        type: 'exclusao_falhou',
        title: 'Erro na Exclusão',
        message: 'Não foi possível excluir a editora',
        detalhe: error.message || 'Tente novamente',
        style: 'danger'
      })
    } finally {
      setIsDeleting(false)
      setLoading(false)
      setShowDeleteModal(false)
      setEditoraToDelete(null)
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
                    {error.email && (
                      <div className="mt-1">
                        <strong>E-mail:</strong> {error.email}
                      </div>
                    )}
                    {error.cnpj && (
                      <div className="mt-1">
                        <strong>CNPJ:</strong> {error.cnpj}
                      </div>
                    )}
                    {error.telefone && (
                      <div className="mt-1">
                        <strong>Telefone:</strong> {error.telefone}
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

          // Se for string (erros antigos - mantém compatibilidade)
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