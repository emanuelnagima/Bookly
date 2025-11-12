import { Button, Col, Container, Row, Modal, Spinner, Toast, Alert, Form } from 'react-bootstrap'
import { useState, useEffect, useCallback } from 'react'
import CadEmprestimo from '../components/CadEmprestimo'
import EmprestimoList from '../components/EmprestimoList'
import emprestimosService from '../services/emprestimosService'

const Emprestimos = () => {
  const [showForm, setShowForm] = useState(false)
  const [emprestimos, setEmprestimos] = useState([])
  const [emprestimoToDelete, setEmprestimoToDelete] = useState(null)
  const [emprestimoToEdit, setEmprestimoToEdit] = useState(null)
  const [emprestimoToRenovar, setEmprestimoToRenovar] = useState(null)
  const [emprestimoToFinalizar, setEmprestimoToFinalizar] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showRenovarModal, setShowRenovarModal] = useState(false)
  const [showFinalizarModal, setShowFinalizarModal] = useState(false)
  const [novaDataDevolucao, setNovaDataDevolucao] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [operationType, setOperationType] = useState('')

  // Carregar empréstimos
  const loadEmprestimos = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const dados = await emprestimosService.getAll()
      setEmprestimos(dados)
    } catch (error) {
      console.error('Erro ao carregar empréstimos:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadEmprestimos()
  }, [loadEmprestimos])

  // Salvar empréstimo
  const handleSaveEmprestimo = async (emprestimo) => {
    try {
      setLoading(true)
      setError('')

      if (emprestimoToEdit) {
        // Verificar se pode editar
        const podeEditar = await emprestimosService.verificarEdicao(emprestimoToEdit.id)
        if (!podeEditar) {
          throw new Error('Este empréstimo não pode ser editado (já finalizado ou não encontrado)')
        }

        await emprestimosService.update(emprestimoToEdit.id, emprestimo)
        setToastMessage('Empréstimo atualizado com sucesso!')
        setOperationType('update')
      } else {
        await emprestimosService.add(emprestimo)
        setToastMessage('Empréstimo registrado com sucesso!')
        setOperationType('create')
      }

      await loadEmprestimos()
      setShowSuccessToast(true)
      setShowForm(false)
      setEmprestimoToEdit(null)

    } catch (err) {
      setError(`Falha ao ${emprestimoToEdit ? 'atualizar' : 'registrar'} empréstimo: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleAtualizarStatus = async () => {
    try {
        setLoading(true);
        const resultado = await emprestimosService.atualizarStatus();
        setToastMessage(resultado.message || 'Status atualizado com sucesso!');
        setShowSuccessToast(true);
        await loadEmprestimos(); // Recarrega a lista
    } catch (error) {
        setError(error.message);
    } finally {
        setLoading(false);
    }
};
  // Editar empréstimo
  const handleEditEmprestimo = async (id) => {
    try {
      setLoading(true)
      setError('')

      // Verificar se pode editar
      const podeEditar = await emprestimosService.verificarEdicao(id)
      if (!podeEditar) {
        throw new Error('Este empréstimo não pode ser editado (já finalizado ou não encontrado)')
      }

      const emprestimo = await emprestimosService.getById(id)
      setEmprestimoToEdit(emprestimo)
      setShowForm(true)
    } catch (error) {
      console.error('Erro ao buscar empréstimo:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Renovar empréstimo
  const handleRenovarEmprestimo = async (id) => {
    setEmprestimoToRenovar(id)
    setShowRenovarModal(true)
    // Define a data padrão para 7 dias a partir de hoje
    const dataPadrao = new Date();
    dataPadrao.setDate(dataPadrao.getDate() + 7);
    setNovaDataDevolucao(dataPadrao.toISOString().split('T')[0]);
  }

  const handleConfirmarRenovacao = async () => {
    if (!emprestimoToRenovar || !novaDataDevolucao) return

    try {
      setLoading(true)
      setError('')

      await emprestimosService.renovar(emprestimoToRenovar, novaDataDevolucao)
      setToastMessage('Empréstimo renovado com sucesso!')
      setOperationType('renovacao')
      setShowSuccessToast(true)

      await loadEmprestimos()
    } catch (error) {
      console.error("Falha na renovação:", error)
      setError(error.message)
    } finally {
      setLoading(false)
      setShowRenovarModal(false)
      setEmprestimoToRenovar(null)
      setNovaDataDevolucao('')
    }
  }

  // Finalizar empréstimo
  const handleFinalizarEmprestimo = async (id) => {
    setEmprestimoToFinalizar(id)
    setShowFinalizarModal(true)
  }

  const handleConfirmarFinalizacao = async () => {
    if (!emprestimoToFinalizar) return

    try {
      setLoading(true)
      setError('')

      await emprestimosService.finalizar(emprestimoToFinalizar)
      setToastMessage('Empréstimo finalizado com sucesso!')
      setOperationType('finalizacao')
      setShowSuccessToast(true)

      await loadEmprestimos()
    } catch (error) {
      console.error("Falha na finalização:", error)
      setError(error.message)
    } finally {
      setLoading(false)
      setShowFinalizarModal(false)
      setEmprestimoToFinalizar(null)
    }
  }
  // Estatísticas de status
// Estatísticas de status - USANDO A MESMA LÓGICA DO EmprestimoList
const totalAtivos = emprestimos.filter(e => e.status === 'ativo').length;

// Função verificarPrazo igual à do EmprestimoList
const verificarPrazo = (dataDevolucaoPrevista, dataDevolucaoReal, status) => {
  if (status === 'finalizado') {
    return { 
      situacao: 'finalizado', 
      classe: 'text-dark', 
      texto: 'Devolvido',
      badge: 'dark'
    };
  }

  const hoje = new Date();
  const devolucao = new Date(dataDevolucaoPrevista);

  if (devolucao < hoje) {
    return { 
      situacao: 'atrasado', 
      classe: 'text-warning', 
      texto: 'Atrasado',
      badge: 'warning'
    };
  }

  // Verificar se está próximo do vencimento (3 dias ou menos)
  const diasRestantes = Math.ceil((devolucao - hoje) / (1000 * 60 * 60 * 24));
  if (diasRestantes <= 3) {
    return { 
      situacao: 'proximo_vencimento', 
      classe: 'text-warning', 
      texto: `Vence em ${diasRestantes} dia(s)`,
      badge: 'warning'
    };
  }

  return { 
    situacao: 'no_prazo', 
    classe: 'text-success', 
    texto: 'No prazo',
    badge: 'success'
  };
};

// Total de atrasados usando a mesma lógica
const totalAtrasados = emprestimos.filter(e => {
  const situacao = verificarPrazo(e.data_devolucao_prevista, e.data_devolucao_real, e.status);
  return situacao.situacao === 'atrasado';
}).length;

const totalFinalizados = emprestimos.filter(e => e.status === 'finalizado').length;
const totalGeral = emprestimos.length;

  // Excluir empréstimo
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirmDelete = (id) => {
    setEmprestimoToDelete(id)
    setShowDeleteModal(true)
  }

  const handleDeleteEmprestimo = async () => {
    if (!emprestimoToDelete || isDeleting) return

    setIsDeleting(true)
    setError('')

    try {
      await emprestimosService.remove(emprestimoToDelete)
      setToastMessage('Empréstimo excluído com sucesso!')
      setOperationType('delete')
      setShowSuccessToast(true)
      await loadEmprestimos()
    } catch (error) {
      console.error("Falha na exclusão:", error)
      setError(error.message)
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
      setEmprestimoToDelete(null)
    }
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEmprestimoToEdit(null)
    setError('')
  }

  const handleOpenForm = () => {
    setEmprestimoToEdit(null)
    setShowForm(true)
    setError('')
  }

  const hoje = new Date().toISOString().split('T')[0];

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
          <Toast.Header>
            <strong className="me-auto">
              {operationType === 'create' && 'Cadastro realizado'}
              {operationType === 'update' && 'Atualização realizada'}
              {operationType === 'renovacao' && 'Renovação realizada'}
              {operationType === 'finalizacao' && 'Finalização realizada'}
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
            onClick={() => setError('')}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Cabeçalho */}
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
                <i className="fas fa-handshake fa-2x" style={{ color: '#0b192c' }}></i>
              </div>
              <div>
                <h4 className="fw-bold text-dark mb-1">Gestão de Empréstimos</h4>

              </div>
            </div>
          </Col>

          <Col md={4} className="text-md-end">
            <Button
              variant="success"
              className="fw-semibold px-4"
              onClick={handleOpenForm}
              disabled={loading}
            >
              <i className="fas fa-plus-circle me-2"></i>
              Novo Empréstimo
            </Button>
          </Col>
        </Row>
      </div>

      <p className="text-muted mb-2" style={{ fontSize: '0.9rem', marginLeft: '10px' }}>
        Esta seção permite o <strong>registro e gerenciamento de empréstimos de livros</strong>. Você pode registrar novos empréstimos, renovar prazos, finalizar devoluções e acompanhar o status de cada operação.
      </p>

     <div className="d-flex justify-content-begin align-items-center gap-4 py-3 border-bottom">
  <div className="text-center px-3 py-2 bg- rounded -sm">
    <h6 className="mb-0 text-primary fw-bold">{totalGeral}</h6>
    <small className="text-muted">Total de Empréstimos</small>
  </div>
  <div className="text-center px-3 py-2 bg- rounded -sm">
    <h6 className="mb-0 text-success fw-bold">{totalAtivos}</h6>
    <small className="text-muted">Ativos</small>
  </div>
  <div className="text-center px-3 py-2 bg- rounded -sm">
    <h6 className="mb-0 text-warning fw-bold">{totalAtrasados}</h6>
    <small className="text-muted">Atrasados</small>
  </div>
  <div className="text-center px-3 py-2 bg- rounded -sm">
    <h6 className="mb-0 text-secondary fw-bold">{totalFinalizados}</h6>
    <small className="text-muted">Finalizados</small>
  </div>
</div>


      {showForm && (
        <Row className="mb-4">
          <Col>
            <CadEmprestimo
              emprestimo={emprestimoToEdit}
              onSave={handleSaveEmprestimo}
              onCancel={handleCloseForm}
              loading={loading}
            />
          </Col>
        </Row>
      )}

      <Row>
        <Col>
          <EmprestimoList
            emprestimos={emprestimos}
            onDelete={handleConfirmDelete}
            onEdit={handleEditEmprestimo}
            onRenovar={handleRenovarEmprestimo}
            onFinalizar={handleFinalizarEmprestimo}
            loading={loading}
          />
        </Col>
      </Row>

      {/* Modal de confirmação de exclusão */}
      <Modal show={showDeleteModal} onHide={() => !isDeleting && setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja excluir este empréstimo? Esta ação não pode ser desfeita.
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
            onClick={handleDeleteEmprestimo}
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

      {/* Modal de renovação */}
      <Modal show={showRenovarModal} onHide={() => setShowRenovarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Renovar Empréstimo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Nova Data de Devolução</Form.Label>
            <Form.Control
              type="date"
              value={novaDataDevolucao}
              onChange={(e) => setNovaDataDevolucao(e.target.value)}
              min={hoje}
              required
            />
            <Form.Text className="text-muted">
              Selecione a nova data limite para devolução
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="cancelar"
            onClick={() => setShowRenovarModal(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="success"
            onClick={handleConfirmarRenovacao}
            disabled={loading || !novaDataDevolucao}
          >
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span className="ms-2">Renovando...</span>
              </>
            ) : 'Renovar'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de finalização */}
      <Modal show={showFinalizarModal} onHide={() => setShowFinalizarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Finalizar Empréstimo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja finalizar este empréstimo? Esta ação registrará a devolução dos livros.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="cancelar"
            onClick={() => setShowFinalizarModal(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="success"
            onClick={handleConfirmarFinalizacao}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span className="ms-2">Finalizando...</span>
              </>
            ) : 'Finalizar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default Emprestimos