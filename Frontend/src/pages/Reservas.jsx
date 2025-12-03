import { Button, Col, Container, Row, Modal, Spinner, Toast, Alert, Form } from 'react-bootstrap'
import { useState, useEffect, useCallback } from 'react'
import CadReserva from '../components/CadReserva'
import ReservaList from '../components/ReservaList'
import reservasService from '../services/reservasService'
import disponibilidadeService from '../services/disponibilidadeService';

const Reservas = () => {
  const [showForm, setShowForm] = useState(false)
  const [reservas, setReservas] = useState([])
  const [reservaToDelete, setReservaToDelete] = useState(null)
  const [reservaToEdit, setReservaToEdit] = useState(null)
  const [reservaToCancelar, setReservaToCancelar] = useState(null)
  const [reservaToConcluir, setReservaToConcluir] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showCancelarModal, setShowCancelarModal] = useState(false)
  const [showConcluirModal, setShowConcluirModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [operationType, setOperationType] = useState('')
  const [motivoCancelamento, setMotivoCancelamento] = useState('')
  
  const totalAtivas = reservas.filter(r => r.status === 'ativa').length;
  const totalCanceladas = reservas.filter(r => r.status === 'cancelada').length;
  const totalConcluidas = reservas.filter(r => r.status === 'concluida').length;
  const [reservaParaConverter, setReservaParaConverter] = useState(null);
  const [showConverterModal, setShowConverterModal] = useState(false);
  const [dataDevolucaoPrevista, setDataDevolucaoPrevista] = useState('');

  useEffect(() => {
    document.title = "Bookly - Reservas";
  }, []);

  const calcularDataPadrao = () => {
    const data = new Date();
    data.setDate(data.getDate() + 14);
    return data.toISOString().split('T')[0];
  };

  const handleConverterEmprestimo = async (id) => {
    setReservaParaConverter(id);
    setDataDevolucaoPrevista(calcularDataPadrao());
    setShowConverterModal(true);
  };

  const handleConfirmarConversao = async () => {
    if (!reservaParaConverter || !dataDevolucaoPrevista) {
      setError('Data de devolução é obrigatória');
      return;
    }

    const hoje = new Date();
    const dataSelecionada = new Date(dataDevolucaoPrevista);
    if (dataSelecionada <= hoje) {
      setError('Data de devolução deve ser futura');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const resultado = await disponibilidadeService.converterReservaEmEmprestimo(
        reservaParaConverter, 
        dataDevolucaoPrevista
      );
      
      setToastMessage('Reserva convertida em empréstimo com sucesso!');
      setOperationType('conversao');
      setShowSuccessToast(true);

      await loadReservas();
    } catch (error) {
      console.error("Falha na conversão:", error);
      setError(error.message);
    } finally {
      setLoading(false);
      setShowConverterModal(false);
      setReservaParaConverter(null);
      setDataDevolucaoPrevista('');
    }
  };

  const totalExpiradas = reservas.filter(r => {
    if (r.status !== 'ativa') return false;
    const hoje = new Date();
    const validade = new Date(r.data_validade);
    return validade < hoje;
  }).length;

  const totalGeral = reservas.length;

  const loadReservas = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const dados = await reservasService.getAll()
      setReservas(dados)
    } catch (error) {
      console.error('Erro ao carregar reservas:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadReservas()
  }, [loadReservas])

  const handleSaveReserva = async (reserva) => {
    try {
      setLoading(true);
      setError('');

      if (reservaToEdit) {
        await reservasService.update(reservaToEdit.id, reserva);
        setToastMessage('Reserva atualizada com sucesso!');
        setOperationType('update');
      } else {
        await reservasService.add(reserva);
        setToastMessage('Reserva registrada com sucesso!');
        setOperationType('create');
      }

      await loadReservas();
      setShowSuccessToast(true);
      setShowForm(false);
      setReservaToEdit(null);

    } catch (err) {
      console.error('Erro completo:', err);
      let errorMessage = err.message;
      errorMessage = errorMessage.replace(/<br\/>/g, '\n');
      errorMessage = errorMessage.replace(/^Falha ao (?:registrar|atualizar) reserva: /, '');
      errorMessage = errorMessage.replace(/^HTTP error! status: \d+ - /, '');
      errorMessage = errorMessage.replace(/^Erro ao processar reserva \(\d+\): /, '');
      errorMessage = errorMessage.replace(/^Não foi possível completar a reserva: /, '');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEditReserva = async (id) => {
    try {
      setLoading(true)
      setError('')

      const podeEditar = await reservasService.verificarEdicao(id)
      if (!podeEditar) {
        throw new Error('Esta reserva não pode ser editada (já cancelada, concluída ou expirada)')
      }

      const reserva = await reservasService.getById(id)
      setReservaToEdit(reserva)
      setShowForm(true)
    } catch (error) {
      console.error('Erro ao buscar reserva:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelarReserva = async (id) => {
    setReservaToCancelar(id)
    setMotivoCancelamento('')
    setShowCancelarModal(true)
  }

  const handleConfirmarCancelamento = async () => {
    if (!reservaToCancelar) return

    if (!motivoCancelamento.trim()) {
      setError('Por favor, informe o motivo do cancelamento');
      return;
    }

    try {
      setLoading(true)
      setError('')

      await reservasService.cancelar(reservaToCancelar, motivoCancelamento)
      setToastMessage('Reserva cancelada com sucesso!')
      setOperationType('cancelamento')
      setShowSuccessToast(true)

      await loadReservas()
    } catch (error) {
      console.error("Falha no cancelamento:", error)
      setError(error.message)
    } finally {
      setLoading(false)
      setShowCancelarModal(false)
      setReservaToCancelar(null)
      setMotivoCancelamento('')
    }
  }

  const handleConcluirReserva = async (id) => {
    setReservaToConcluir(id)
    setShowConcluirModal(true)
  }

  const handleConfirmarConclusao = async () => {
    if (!reservaToConcluir) return

    try {
      setLoading(true)
      setError('')

      await reservasService.concluir(reservaToConcluir)
      setToastMessage('Reserva concluída com sucesso!')
      setOperationType('conclusao')
      setShowSuccessToast(true)

      await loadReservas()
    } catch (error) {
      console.error("Falha na conclusão:", error)
      setError(error.message)
    } finally {
      setLoading(false)
      setShowConcluirModal(false)
      setReservaToConcluir(null)
    }
  }

  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirmDelete = (id) => {
    setReservaToDelete(id)
    setShowDeleteModal(true)
  }

  const handleDeleteReserva = async () => {
    if (!reservaToDelete || isDeleting) return

    setIsDeleting(true)
    setError('')

    try {
      await reservasService.remove(reservaToDelete)
      setToastMessage('Reserva excluída com sucesso!')
      setOperationType('delete')
      setShowSuccessToast(true)
      await loadReservas()
    } catch (error) {
      console.error("Falha na exclusão:", error)
      setError(error.message)
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
      setReservaToDelete(null)
    }
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setReservaToEdit(null)
    setError('')
  }

  const handleOpenForm = () => {
    setReservaToEdit(null)
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
          bg={operationType === 'delete' ? 'danger' : 
              operationType === 'cancelamento' ? 'warning' : 'success'}
        >
          <Toast.Header>
            <strong className="me-auto">
              {operationType === 'create' && 'Cadastro realizado'}
              {operationType === 'update' && 'Atualização realizada'}
              {operationType === 'cancelamento' && 'Cancelamento realizado'}
              {operationType === 'conclusao' && 'Conclusão realizada'}
              {operationType === 'conversao' && 'Conversão realizada'}
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
                <i className="fas fa-calendar-alt fa-2x" style={{ color: '#0b192c' }}></i>
              </div>
              <div>
                <h4 className="fw-bold text-dark mb-1">Gestão de Reservas</h4>
                <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>
                  Registro e acompanhamento de reservas de livros do sistema
                </p>
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
              Nova Reserva
            </Button>
          </Col>
        </Row>
      </div>

      <p className="text-muted mb-1" style={{ fontSize: '0.9rem', marginLeft: '2px' }}>
        Esta seção permite o <strong>registro e gerenciamento de reservas de livros</strong>. Você pode registrar novas reservas, cancelar, concluir e acompanhar o status de cada operação.
      </p>
      
      <div className="d-flex justify-content-begin align-items-center gap-4 py-3 border-bottom">
        <div className="text-center px-3 py-2">
          <h6 className="mb-0 text-primary fw-bold">{totalGeral}</h6>
          <small className="text-muted">Total de Reservas</small>
        </div>
        <div className="text-center px-3 py-2">
          <h6 className="mb-0 text-success fw-bold">{totalAtivas}</h6>
          <small className="text-muted">Ativas</small>
        </div>
        <div className="text-center px-3 py-2">
          <h6 className="mb-0 text-danger fw-bold">{totalCanceladas}</h6>
          <small className="text-muted">Canceladas</small>
        </div>
        <div className="text-center px-3 py-2">
          <h6 className="mb-0 text-secondary fw-bold">{totalConcluidas}</h6>
          <small className="text-muted">Concluídas</small>
        </div>
        <div className="text-center px-3 py-2">
          <h6 className="mb-0 text-warning fw-bold">{totalExpiradas}</h6> 
          <small className="text-muted">Expiradas</small>
        </div>
      </div>
      
      {showForm && (
        <Row className="mb-4">
          <Col>
            <CadReserva
              reserva={reservaToEdit}
              onSave={handleSaveReserva}
              onCancel={handleCloseForm}
              loading={loading}
            />
          </Col>
        </Row>
      )}

      <Row>
        <Col>
          <ReservaList
            reservas={reservas}
            onDelete={handleConfirmDelete}
            onEdit={handleEditReserva}
            onCancelar={handleCancelarReserva}
            onConcluir={handleConcluirReserva}
            onConverterEmprestimo={handleConverterEmprestimo}
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
          Tem certeza que deseja excluir esta reserva? Esta ação não pode ser desfeita.
          <Alert variant="warning" className="mt-2">
            <strong>Atenção:</strong> Esta ação é permanente e não poderá ser desfeita. 
            A reserva será <strong>excluída definitivamente</strong>.
          </Alert>
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
            onClick={handleDeleteReserva}
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

      {/* Modal de cancelamento com motivo */}
      <Modal show={showCancelarModal} onHide={() => setShowCancelarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cancelar Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>
              <strong>Motivo do Cancelamento:</strong>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={motivoCancelamento}
              onChange={(e) => setMotivoCancelamento(e.target.value)}
              placeholder="Informe o motivo do cancelamento..."
              required
            />
            <Form.Text className="text-muted">
              Este motivo será registrado no histórico da reserva.
            </Form.Text>
          </Form.Group>
          
          <Alert variant="warning" className="mt-3">
            <strong>Atenção:</strong> O cancelamento é definitivo e não poderá ser desfeito. 
            O motivo será registrado para controle.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="cancelar"
            onClick={() => setShowCancelarModal(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmarCancelamento}
            disabled={loading || !motivoCancelamento.trim()}
          >
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span className="ms-2">Cancelando...</span>
              </>
            ) : 'Confirmar Cancelamento'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de conclusão */}
      <Modal show={showConcluirModal} onHide={() => setShowConcluirModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Concluir Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja concluir esta reserva? Esta ação marca a reserva como finalizada.
          <Alert variant="info" className="mt-2">
            <strong>Atenção:</strong> Após concluir a reserva, lembre-se de realizar o empréstimo do livro. 
            A conclusão não cria automaticamente o empréstimo.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="cancelar"
            onClick={() => setShowConcluirModal(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="success"
            onClick={handleConfirmarConclusao}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span className="ms-2">Concluindo...</span>
              </>
            ) : 'Concluir'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de conversão para empréstimo */}
      <Modal show={showConverterModal} onHide={() => setShowConverterModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Transformar Reserva em Empréstimo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>
              <strong>Data de Devolução Prevista:</strong>
            </Form.Label>
            <Form.Control
              type="date"
              value={dataDevolucaoPrevista}
              onChange={(e) => setDataDevolucaoPrevista(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
            <Form.Text className="text-muted">
              Informe até quando o usuário deve devolver o livro
            </Form.Text>

            <Alert variant="info" className="mt-2">
              <strong>Atenção:</strong> Ao transformar esta reserva, a ação será definitiva:
              a reserva será marcada como concluída e um empréstimo será criado. 
              Verifique se a data de devolução está correta antes de confirmar.
            </Alert>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConverterModal(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="success"
            onClick={handleConfirmarConversao}
            disabled={loading || !dataDevolucaoPrevista}
          >
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span className="ms-2">Transformando...</span>
              </>
            ) : 'Transformar em Empréstimo'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default Reservas