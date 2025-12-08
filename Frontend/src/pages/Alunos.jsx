import { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Modal, Spinner, Toast } from 'react-bootstrap'
import AlunoList from '../components/AlunoList'
import CadAluno from '../components/CadAluno'
import alunoService from '../services/alunoService';
import { FaTimes } from 'react-icons/fa';

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
      setError({
        type: 'carregamento_falhou',
        title: 'Erro ao Carregar',
        message: 'Falha ao carregar alunos',
        detalhe: 'Tente recarregar a página',
        style: 'danger'
      })
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
        setError({
          type: 'email_duplicado',
          title: 'E-mail Duplicado',
          message: `Já existe um aluno com este e-mail`,
          email: aluno.email,
          style: 'warning'
        });
        setLoading(false);
        return;
      }

      const matriculaExistente = alunos.find(a =>
        a.matricula === aluno.matricula && a.id !== aluno.id
      );
      if (matriculaExistente) {
        setError({
          type: 'matricula_duplicada',
          title: 'Matrícula Duplicada',
          message: `Já existe um aluno com esta matrícula`,
          matricula: aluno.matricula,
          style: 'warning'
        });
        setLoading(false);
        return;
      }

      const telefoneExistente = alunos.find(a =>
        a.telefone === aluno.telefone && a.id !== aluno.id
      );
      if (telefoneExistente) {
        setError({
          type: 'telefone_duplicado',
          title: 'Telefone Duplicado',
          message: `Já existe um aluno com este telefone`,
          telefone: aluno.telefone,
          style: 'warning'
        });
        setLoading(false);
        return;
      }

      const cpfExistente = alunos.find(a =>
        a.cpf === aluno.cpf && a.id !== aluno.id
      );
      if (cpfExistente) {
        setError({
          type: 'cpf_duplicado',
          title: 'CPF Duplicado',
          message: `Já existe um aluno com este CPF`,
          cpf: aluno.cpf,
          style: 'warning'
        });
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
          message: `Falha ao ${aluno.id ? 'atualizar' : 'cadastrar'} aluno`,
          detalhe: 'Um registro duplicado foi encontrado',
          style: 'warning'
        };
      } else if (error.message?.includes('CPF inválido') || error.message?.includes('cpf inválido')) {
        errorObject = {
          type: 'cpf_invalido',
          title: 'CPF Inválido',
          message: 'O CPF informado não é válido',
          detalhe: 'Verifique o número e tente novamente',
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
      } else if (error.message?.includes('E-mail inválido') || error.message?.includes('email inválido')) {
        errorObject = {
          type: 'email_invalido',
          title: 'E-mail Inválido',
          message: 'O e-mail informado não é válido',
          detalhe: 'Verifique o formato do e-mail',
          style: 'warning'
        };
      } else if (error.message?.includes('Turma') && error.message?.includes('inválida')) {
        errorObject = {
          type: 'turma_invalida',
          title: 'Turma Inválida',
          message: 'A turma selecionada não é válida',
          detalhe: 'Selecione uma turma da lista',
          style: 'warning'
        };
      } else if (error.message?.includes('Idade mínima') || error.message?.includes('idade mínima')) {
        errorObject = {
          type: 'idade_minima',
          title: 'Idade Insuficiente',
          message: 'A idade do aluno não atende os requisitos',
          detalhe: 'Verifique a data de nascimento',
          style: 'warning'
        };
      } else {
        errorObject = {
          type: 'erro_servidor',
          title: 'Erro no Sistema',
          message: `Falha ao ${aluno.id ? 'atualizar' : 'cadastrar'} aluno`,
          detalhe: error.message || 'Tente novamente',
          style: 'danger'
        };
      }

      setError(errorObject);
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
      setError({
        type: 'aluno_nao_encontrado',
        title: 'Aluno Não Encontrado',
        message: 'Erro ao carregar aluno para edição',
        detalhe: 'O aluno pode ter sido removido',
        style: 'warning'
      })
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
      setError({
        type: 'exclusao_falhou',
        title: 'Erro na Exclusão',
        message: 'Não foi possível excluir o aluno',
        detalhe: error.message || 'Tente novamente',
        style: 'danger'
      })
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
                    {error.email && (
                      <div className="mt-1">
                        <strong>E-mail:</strong> {error.email}
                      </div>
                    )}
                    {error.matricula && (
                      <div className="mt-1">
                        <strong>Matrícula:</strong> {error.matricula}
                      </div>
                    )}
                    {error.telefone && (
                      <div className="mt-1">
                        <strong>Telefone:</strong> {error.telefone}
                      </div>
                    )}
                    {error.cpf && (
                      <div className="mt-1">
                        <strong>CPF:</strong> {error.cpf}
                      </div>
                    )}
                    {error.turma && (
                      <div className="mt-1">
                        <strong>Turma:</strong> {error.turma}
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
                <i className="fas fa-user-graduate fa-2x" style={{ color: '#0b192c' }}></i>
              </div>
              <div>
                <h4 className="fw-bold text-dark mb-1">Alunos</h4>
                <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>
                  Cadastro e gerenciamento de alunos do sistema
                </p>
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