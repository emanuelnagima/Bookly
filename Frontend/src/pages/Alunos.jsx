import { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Modal, Spinner, Toast } from 'react-bootstrap'
import AlunoList from '../components/AlunoList'
import CadAluno from '../components/CadAluno'
import alunoService from '../services/alunoService';

const Alunos = () => {
  const [showForm, setShowForm] = useState(false)
  const [alunos, setAlunos] = useState([])
  const [alunoToDelete, setAlunoToDelete] = useState(null)
  const [alunoToEdit, setAlunoToEdit] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [operationType, setOperationType] = useState('')

  const loadAlunos = async () => {
    try {
      setLoading(true)
      const dados = await alunoService.getAll()
      setAlunos(dados)
      setError(null)
    } catch (error) {
      console.error('Erro ao carregar alunos:', error)
      setError('Falha ao carregar alunos. Tente recarregar a página.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAlunos()
  }, [])

const handleSaveAluno = async (aluno) => {
  try {
    setLoading(true);

    // VERIFICAÇÃO DE DUPLICIDADE ESPECÍFICA COMO NO PROFESSOR
    const emailExistente = alunos.find(a =>
      a.email.toLowerCase().trim() === aluno.email.toLowerCase().trim() && a.id !== aluno.id
    );
    if (emailExistente) {
      setError(`Já existe um aluno com o e-mail "${aluno.email}" cadastrado.`);
      setLoading(false);
      return;
    }

    const matriculaExistente = alunos.find(a =>
      a.matricula === aluno.matricula && a.id !== aluno.id
    );
    if (matriculaExistente) {
      setError(`Já existe um aluno com a matrícula "${aluno.matricula}" cadastrado.`);
      setLoading(false);
      return;
    }

    const telefoneExistente = alunos.find(a =>
      a.telefone === aluno.telefone && a.id !== aluno.id
    );
    if (telefoneExistente) {
      setError(`Já existe um aluno com o telefone "${aluno.telefone}" cadastrado.`);
      setLoading(false);
      return;
    }

    const cpfExistente = alunos.find(a =>
      a.cpf === aluno.cpf && a.id !== aluno.id
    );
    if (cpfExistente) {
      setError(`Já existe um aluno com o CPF "${aluno.cpf}" cadastrado.`);
      setLoading(false);
      return;
    }

    let responseData;
    if (aluno.id) {
      responseData = await alunoService.update(aluno);
    } else {
      responseData = await alunoService.add(aluno);
    }

    await loadAlunos();

    setToastMessage(aluno.id ? 'Aluno atualizado com sucesso!' : 'Aluno cadastrado com sucesso!');
    setOperationType(aluno.id ? 'update' : 'create');
    setShowSuccessToast(true);

    setShowForm(false);
    setAlunoToEdit(null);
    setError(null);

  } catch (error) {
    console.error('Erro ao salvar aluno:', error);

    // Tratamento específico para erro 401
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      setError('Sessão expirada. Faça login novamente.');
      // Opcional: redirecionar para login
      // navigate('/login');
    } else {
      setError(error.message || `Falha ao ${aluno.id ? 'atualizar' : 'cadastrar'} aluno. Tente novamente.`);
    }
  } finally {
    setLoading(false);
  }
};
  const handleEditAluno = async (id) => {
    try {
      setLoading(true)
      const aluno = await alunoService.getById(id)
      setAlunoToEdit(aluno)
      setShowForm(true)
      setError(null)
    } catch (error) {
      console.error('Erro ao buscar aluno:', error)
      setError('Erro ao carregar aluno para edição.')
    } finally {
      setLoading(false)
    }
  }

  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirmDelete = (id) => {
    setAlunoToDelete(id)
    setShowDeleteModal(true)
  }

  const handleDeleteAluno = async () => {
    if (!alunoToDelete || isDeleting) return

    setIsDeleting(true)
    setLoading(true)

    try {
      await alunoService.remove(alunoToDelete)
      setToastMessage('Aluno excluído com sucesso!')
      setOperationType('delete')
      setShowSuccessToast(true)
      await loadAlunos()
    } catch (error) {
      console.error("Falha na exclusão:", error)
      setError("Não foi possível excluir o aluno. Tente novamente.")
    } finally {
      setIsDeleting(false)
      setLoading(false)
      setShowDeleteModal(false)
      setAlunoToDelete(null)
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
                <i className="fas fa-user-graduate fa-2x" style={{ color: '#0b192c' }}></i>
              </div>
              <div>
                <h4 className="fw-bold text-dark mb-1">Alunos</h4>
              </div>
            </div>
          </Col>

          <Col md={4} className="text-md-end">
            <Button
              variant="success"
              className="fw-semibold px-4"
              onClick={() => {
                setAlunoToEdit(null)
                setShowForm(!showForm)
                setError(null)
              }}
              disabled={loading}
            >
              <i className="fas fa-plus-circle me-2"></i>
              Adicionar Aluno
            </Button>
          </Col>
        </Row>
      </div>
      <p className="text-muted mb-1" style={{ fontSize: '0.9rem', marginLeft: '2px' }}>
        Esta seção permite o <strong>cadastro e gerenciamento de alunos</strong>. Você pode adicionar novos alunos, atualizar informações existentes ou remover registros, mantendo o sistema sempre atualizado e organizado.
      </p>
      <div className="d-flex flex-wrap justify-content-start align-items-center gap-4 py-3 border-bottom rounded-3">
        <div className="text-center px-3 py-2">
          <h6 className="mb-0 text-primary fw-bold">{alunos.length}</h6>
          <small className="text-muted">Alunos cadastrados</small>
        </div>
      </div>
      {showForm && (
        <Row className="mb-4">
          <Col>
            <CadAluno
              aluno={alunoToEdit}
              onSave={handleSaveAluno}
              onCancel={() => {
                setShowForm(false)
                setAlunoToEdit(null)
                setError(null)
              }}
              loading={loading}
            />
          </Col>
        </Row>
      )}

      <Row>
        <Col>
          <AlunoList
            alunos={alunos}
            onDelete={handleConfirmDelete}
            onEdit={handleEditAluno}
            loading={loading}
          />
        </Col>
      </Row>

      <Modal show={showDeleteModal} onHide={() => !isDeleting && setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja excluir este aluno?
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
            onClick={handleDeleteAluno}
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

export default Alunos