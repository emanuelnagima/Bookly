// UsuariosEspeciais.jsx
import { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Modal, Spinner, Toast } from 'react-bootstrap'

import UsuarioEspecialList from '../components/UsuarioEspecialList';
import CadUsuarioEspecial from '../components/CadUsuarioEspecial';
import usuarioEspecialService from '../services/usuarioEspecialService';

const UsuariosEspeciais = () => {
  const [showForm, setShowForm] = useState(false)
  const [usuarios, setUsuarios] = useState([])
  const [usuarioToDelete, setUsuarioToDelete] = useState(null)
  const [usuarioToEdit, setUsuarioToEdit] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [operationType, setOperationType] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

 useEffect(() => {
    document.title = "Bookly - Usuários Especiais";
  }, []);

  const loadUsuarios = async () => {
    try {
      setLoading(true)
      const dados = await usuarioEspecialService.getAll()
      setUsuarios(dados)
      setError(null)
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
      setError('Falha ao carregar usuários. Tente recarregar a página.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsuarios()
  }, [])

const handleSaveUsuario = async (usuario) => {
  try {
    setLoading(true);
    setError(null);

    // VERIFICAÇÃO DE DUPLICIDADE ESPECÍFICA - IGUAL AO ALUNO
    const emailExistente = usuarios.find(u =>
      u.email.toLowerCase().trim() === usuario.email.toLowerCase().trim() && u.id !== usuario.id
    );
    if (emailExistente) {
      setError(`Já existe um usuário com o e-mail "${usuario.email}" cadastrado.`);
      setLoading(false);
      return;
    }

    const cpfExistente = usuarios.find(u =>
      u.cpf === usuario.cpf && u.id !== usuario.id
    );
    if (cpfExistente) {
      setError(`Já existe um usuário com o CPF "${usuario.cpf}" cadastrado.`);
      setLoading(false);
      return;
    }

    const telefoneExistente = usuarios.find(u =>
      u.telefone === usuario.telefone && u.id !== usuario.id
    );
    if (telefoneExistente) {
      setError(`Já existe um usuário com o telefone "${usuario.telefone}" cadastrado.`);
      setLoading(false);
      return;
    }

    // Envio para o servidor
    let responseData;
    if (usuario.id) {
      responseData = await usuarioEspecialService.update(usuario.id, usuario);
      setToastMessage('Usuário atualizado com sucesso!');
      setOperationType('update');
    } else {
      responseData = await usuarioEspecialService.add(usuario);
      setToastMessage('Usuário cadastrado com sucesso!');
      setOperationType('create');
    }

    await loadUsuarios();
    setShowSuccessToast(true);
    setShowForm(false);
    setUsuarioToEdit(null);
    setError(null);

  } catch (error) {
    console.error('Erro ao salvar usuário:', error);
    
    // Tratamento específico para erro 401
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      setError('Sessão expirada. Faça login novamente.');
    } else {
      setError(error.message || `Falha ao ${usuario.id ? 'atualizar' : 'cadastrar'} usuário. Tente novamente.`);
    }
  } finally {
    setLoading(false);
  }
}

  const handleEditUsuario = async (id) => {
    try {
      setLoading(true)
      const usuario = await usuarioEspecialService.getById(id)
      setUsuarioToEdit(usuario)
      setShowForm(true)
      setError(null)
    } catch (error) {
      console.error('Erro ao buscar usuário:', error)
      setError('Erro ao carregar usuário para edição.')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmDelete = (id) => {
    setUsuarioToDelete(id)
    setShowDeleteModal(true)
  }

  const handleDeleteUsuario = async () => {
    if (!usuarioToDelete || isDeleting) return

    setIsDeleting(true)
    setLoading(true)

    try {
      await usuarioEspecialService.remove(usuarioToDelete)
      setToastMessage('Usuário excluído com sucesso!')
      setOperationType('delete')
      setShowSuccessToast(true)
      await loadUsuarios()
    } catch (error) {
      console.error("Falha na exclusão:", error)
      setError("Não foi possível excluir o usuário. Tente novamente.")
    } finally {
      setIsDeleting(false)
      setLoading(false)
      setShowDeleteModal(false)
      setUsuarioToDelete(null)
    }
  }

  return (
    <Container className="py-4">
      {/* Toast */}
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
      
      {/* Cabeçalho */}
      <div
        className="rounded-3 p-4 mb-4"
        style={{
          border: '1px solid #e6e6e6' 
        }}>
        <Row className="align-items-center">
          <Col md={8}>
            <div className="d-flex align-items-center">
              <div className="me-3">
                <i className="fas fa-users fa-2x" style={{ color: '#0b192c' }}></i>
              </div>
             <div>
                <h4 className="fw-bold text-dark mb-1">Usuários Especiais</h4>
                <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>
                  Cadastro e gerenciamento de usuários espeicias do sistema
                </p>
              </div>
            </div>
          </Col>

          <Col md={4} className="text-md-end">
            <Button
              variant="success"
              className="fw-semibold px-4"
              onClick={() => {
                setUsuarioToEdit(null)
                setShowForm(!showForm)
                setError(null)
              }}
              disabled={loading}
            >
              <i className="fas fa-plus-circle me-2"></i>
              Adicionar Usuário
            </Button>
          </Col>
        </Row>
      </div>
            
       <p className="text-muted mb-1" style={{ fontSize: '0.9rem', marginLeft: '2px' }}>
        Esta seção permite o <strong>cadastro e gerenciamento de usuários</strong>. Você pode adicionar novos usuários, atualizar informações existentes ou remover registros, mantendo o sistema sempre atualizado e organizado.
      </p>
      <div className="d-flex flex-wrap justify-content-start align-items-center gap-4 py-3 border-bottom rounded-3">
        <div className="text-center px-3 py-2">
          <h6 className="mb-0 text-primary fw-bold">{usuarios.length}</h6>
          <small className="text-muted">Usuários especiais cadastrados</small>
        </div>

      </div>

      {/* Formulário */}
      {showForm && (
        <Row className="mb-4">
          <Col>
            <CadUsuarioEspecial
              usuario={usuarioToEdit}
              onSave={handleSaveUsuario}
              onCancel={() => {
                setShowForm(false)
                setUsuarioToEdit(null)
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
          <UsuarioEspecialList
            usuarios={usuarios}
            onDelete={handleConfirmDelete}
            onEdit={handleEditUsuario}
            loading={loading}
          />
        </Col>
      </Row>

      {/* Modal de exclusão */}
      <Modal show={showDeleteModal} onHide={() => !isDeleting && setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja excluir este usuário?
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
            onClick={handleDeleteUsuario}
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

export default UsuariosEspeciais
