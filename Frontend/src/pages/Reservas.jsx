import { Button, Col, Container, Row, Modal, Spinner, Toast, Alert } from 'react-bootstrap'
import { useState, useEffect, useCallback } from 'react'
import CadReserva from '../components/CadReserva'
import ReservaList from '../components/ReservaList'
import reservasService from '../services/reservasService'

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

  // Carregar reservas
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

  // Salvar reserva
  const handleSaveReserva = async (reserva) => {
    try {
      setLoading(true)
      setError('')

      if (reservaToEdit) {
        // Verificar se pode editar
        const podeEditar = await reservasService.verificarEdicao(reservaToEdit.id)
        if (!podeEditar) {
          throw new Error('Esta reserva não pode ser editada (já cancelada, concluída ou expirada)')
        }

        await reservasService.update(reservaToEdit.id, reserva)
        setToastMessage('Reserva atualizada com sucesso!')
        setOperationType('update')
      } else {
        await reservasService.add(reserva)
        setToastMessage('Reserva registrada com sucesso!')
        setOperationType('create')
      }

      await loadReservas()
      setShowSuccessToast(true)
      setShowForm(false)
      setReservaToEdit(null)

    } catch (err) {
      setError(`Falha ao ${reservaToEdit ? 'atualizar' : 'registrar'} reserva: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Editar reserva
  const handleEditReserva = async (id) => {
    try {
      setLoading(true)
      setError('')

      // Verificar se pode editar
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

  // Cancelar reserva
  const handleCancelarReserva = async (id) => {
    setReservaToCancelar(id)
    setShowCancelarModal(true)
  }

  const handleConfirmarCancelamento = async () => {
    if (!reservaToCancelar) return

    try {
      setLoading(true)
      setError('')

      await reservasService.cancelar(reservaToCancelar)
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
    }
  }

  // Concluir reserva
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

  // Excluir reserva
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
          bg={operationType === 'delete' ? 'danger' : 'success'}
        >
          <Toast.Header>
            <strong className="me-auto">
              {operationType === 'create' && 'Cadastro realizado'}
              {operationType === 'update' && 'Atualização realizada'}
              {operationType === 'cancelamento' && 'Cancelamento realizado'}
              {operationType === 'conclusao' && 'Conclusão realizada'}
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
                <p className="text-muted mb-0">
                  Total de <strong>{reservas.length}</strong> reservas registradas
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

      <p className="text-muted mb-4" style={{ fontSize: '0.9rem', marginLeft: '2px' }}>
        Esta seção permite o <strong>registro e gerenciamento de reservas de livros</strong>. Você pode registrar novas reservas, cancelar, concluir e acompanhar o status de cada operação.
      </p>

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

      {/* Modal de cancelamento */}
      <Modal show={showCancelarModal} onHide={() => setShowCancelarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cancelar Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja cancelar esta reserva?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="paginacao"
            onClick={() => setShowCancelarModal(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="warning"
            onClick={handleConfirmarCancelamento}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span className="ms-2">Cancelando...</span>
              </>
            ) : 'Cancelar Reserva'}
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
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="paginacao"
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
    </Container>
  )
}

export default Reservas