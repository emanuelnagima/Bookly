  import { Button, Col, Container, Row, Modal, Spinner, Toast, Alert, Form } from 'react-bootstrap'
  import { useState, useEffect, useCallback } from 'react'
  import CadEmprestimo from '../components/CadEmprestimo'
  import EmprestimoList from '../components/EmprestimoList'
  import emprestimosService from '../services/emprestimosService'

  const Emprestimos = () => {
    const [showForm, setShowForm] = useState(false)
    const [emprestimos, setEmprestimos] = useState([])
    const [emprestimoToEdit, setEmprestimoToEdit] = useState(null)
    const [emprestimoToRenovar, setEmprestimoToRenovar] = useState(null)
    const [emprestimoToFinalizar, setEmprestimoToFinalizar] = useState(null)
    const [emprestimoToCancelar, setEmprestimoToCancelar] = useState(null)
    
    const [showRenovarModal, setShowRenovarModal] = useState(false)
    const [showFinalizarModal, setShowFinalizarModal] = useState(false)
    const [showCancelarModal, setShowCancelarModal] = useState(false)
    
    const [novaDataDevolucao, setNovaDataDevolucao] = useState('')
    const [motivoCancelamento, setMotivoCancelamento] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showSuccessToast, setShowSuccessToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const [operationType, setOperationType] = useState('')

    useEffect(() => {
      document.title = "Bookly - Empréstimos";
    }, []);

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
      try {
        const emprestimoCompleto = emprestimos.find(emp => emp.id === id);
        
        if (emprestimoCompleto) {
          setEmprestimoToFinalizar(emprestimoCompleto);
          setShowFinalizarModal(true);
        } else {
          const emprestimoDoServico = await emprestimosService.getById(id);
          setEmprestimoToFinalizar(emprestimoDoServico);
          setShowFinalizarModal(true);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do empréstimo:', error);
        setError('Erro ao carregar informações do empréstimo');
      }
    }

    const handleConfirmarFinalizacao = async () => {
      if (!emprestimoToFinalizar?.id) return;

      try {
        setLoading(true);
        setError('');

        await emprestimosService.finalizar(emprestimoToFinalizar.id);
        setToastMessage('Empréstimo finalizado com sucesso!');
        setOperationType('finalizacao');
        setShowSuccessToast(true);

        await loadEmprestimos();
      } catch (error) {
        console.error("Falha na finalização:", error);
        setError(error.message);
      } finally {
        setLoading(false);
        setShowFinalizarModal(false);
        setEmprestimoToFinalizar(null);
      }
    }

    // Cancelar empréstimo
    const handleCancelarEmprestimo = async (id) => {
      setEmprestimoToCancelar(id);
      setShowCancelarModal(true);
    }

    const handleConfirmarCancelamento = async () => {
      if (!emprestimoToCancelar) return;

      try {
        setLoading(true);
        setError('');

        await emprestimosService.cancelar(emprestimoToCancelar, motivoCancelamento);
        setToastMessage('Empréstimo cancelado com sucesso!');
        setOperationType('cancelamento');
        setShowSuccessToast(true);

        await loadEmprestimos();
      } catch (error) {
        console.error("Falha no cancelamento:", error);
        setError(error.message);
      } finally {
        setLoading(false);
        setShowCancelarModal(false);
        setEmprestimoToCancelar(null);
        setMotivoCancelamento('');
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

    // Função para verificar prazo
// Função para verificar prazo - VERSÃO CORRIGIDA
const verificarPrazo = (dataDevolucaoPrevista, dataDevolucaoReal, status) => {
  // Status cancelado tem prioridade
  if (status === 'cancelado') {
    return { 
      situacao: 'cancelado', 
      classe: 'text-danger', 
      texto: 'Cancelado',
      badge: 'danger'
    };
  }

  // Status finalizado
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

  // Remover horário para comparar apenas datas
  hoje.setHours(0, 0, 0, 0);
  devolucao.setHours(0, 0, 0, 0);

  // ATRASADO: se a data de devolução já passou E o empréstimo ainda está ativo
  if (devolucao < hoje && status === 'ativo') {
    return { 
      situacao: 'atrasado', 
      classe: 'text-warning', 
      texto: 'Atrasado',
      badge: 'warning'
    };
  }

  // Verificar se está próximo do vencimento (3 dias ou menos)
  const diasRestantes = Math.ceil((devolucao - hoje) / (1000 * 60 * 60 * 24));
  if (diasRestantes <= 3 && diasRestantes >= 0) {
    return { 
      situacao: 'proximo_vencimento', 
      classe: 'text-warning', 
      texto: `Vence em ${diasRestantes} dia(s)`,
      badge: 'warning'
    };
  }

  // Se a data já passou mas o status ainda é 'ativo', também é atrasado
  if (devolucao < hoje) {
    return { 
      situacao: 'atrasado', 
      classe: 'text-warning', 
      texto: 'Atrasado',
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
    // Estatísticas de status
    const totalAtivos = emprestimos.filter(e => e.status === 'ativo').length;
    const totalFinalizados = emprestimos.filter(e => e.status === 'finalizado').length;
    const totalCancelados = emprestimos.filter(e => e.status === 'cancelado').length;
    const totalAtrasados = emprestimos.filter(e => {
      const situacao = verificarPrazo(e.data_devolucao_prevista, e.data_devolucao_real, e.status);
      return situacao.situacao === 'atrasado';
    }).length;

    const totalGeral = emprestimos.length;

    const hoje = new Date().toISOString().split('T')[0];

    return (
      <Container className="py-4">
          {/* Toast de Sucesso */}
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
                borderLeft: `4px solid ${
                  operationType === 'delete' 
                    ? '#dc3545'
                    : operationType === 'cancelamento'
                    ? '#ffc107'
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
                          : operationType === 'cancelamento'
                          ? '#ffc107'
                          : '#28a745',
                        fontSize: '1rem'
                      }}
                    >
                      {operationType === 'delete' ? (
                        <i className="fas fa-trash"></i>
                      ) : operationType === 'cancelamento' ? (
                        <i className="fas fa-ban"></i>
                      ) : operationType === 'renovacao' ? (
                        <i className="fas fa-sync-alt"></i>
                      ) : operationType === 'finalizacao' ? (
                        <i className="fas fa-flag-checkered"></i>
                      ) : operationType === 'update' ? (
                        <i className="fas fa-edit"></i>
                      ) : (
                        <i className="fas fa-check"></i>
                      )}
                    </div>
                    
                    {/* Conteúdo de texto */}
                    <div>
                      <h6 className="mb-1 fw-semibold text-dark">
                        {operationType === 'create' ? 'Sucesso!' : 
                        operationType === 'update' ? 'Atualizado!' : 
                        operationType === 'renovacao' ? 'Renovado!' : 
                        operationType === 'finalizacao' ? 'Finalizado!' : 
                        operationType === 'cancelamento' ? 'Cancelado!' : 
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
          {loading && (
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
                  <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>
                    Registro e controle completo de empréstimos, renovações e devoluções 
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
                Novo Empréstimo
              </Button>
            </Col>
          </Row>
        </div>

        <p className="text-muted mb-2" style={{ fontSize: '0.9rem', marginLeft: '10px' }}>
          Esta seção permite o <strong>registro e gerenciamento de empréstimos de livros</strong>. 
          Você pode registrar novos empréstimos, renovar prazos, finalizar devoluções, 
          cancelar empréstimos e acompanhar o status de cada operação.
        </p>

        <div className="d-flex justify-content-begin align-items-center gap-4 py-3 border-bottom">
          <div className="text-center px-3 py-2">
            <h6 className="mb-0 text-primary fw-bold">{totalGeral}</h6>
            <small className="text-muted">Total de Empréstimos</small>
          </div>
          <div className="text-center px-3 py-2">
            <h6 className="mb-0 text-success fw-bold">{totalAtivos}</h6>
            <small className="text-muted">Ativos</small>
          </div>
          <div className="text-center px-3 py-2">
            <h6 className="mb-0 text-warning fw-bold">{totalAtrasados}</h6>
            <small className="text-muted">Atrasados</small>
          </div>
          <div className="text-center px-3 py-2">
            <h6 className="mb-0 text-secondary fw-bold">{totalFinalizados}</h6>
            <small className="text-muted">Finalizados</small>
          </div>
          <div className="text-center px-3 py-2">
            <h6 className="mb-0 text-danger fw-bold">{totalCancelados}</h6>
            <small className="text-muted">Cancelados</small>
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
              onCancelar={handleCancelarEmprestimo}
              onEdit={handleEditEmprestimo}
              onRenovar={handleRenovarEmprestimo}
              onFinalizar={handleFinalizarEmprestimo}
              loading={loading}
            />
          </Col>
        </Row>

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

              <Alert variant="warning" className="mt-2">
                <strong>Atenção:</strong> A renovação <strong>é definitiva</strong> e não poderá ser desfeita.
                Certifique-se de que a nova data de devolução está correta antes de confirmar.
              </Alert>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="btn btn-cancelar"
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
        <Modal show={showFinalizarModal} onHide={() => setShowFinalizarModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title className="d-flex align-items-center">
              <i className="fas fa-check-circle me-2"></i>
              Finalizar Empréstimo #{emprestimoToFinalizar?.id}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="p-4">
            {/* SEÇÃO: Informações do Usuário */}
            <div className="mb-4 p-3 border rounded bg-white">
              <h5 className="fw-bold mb-3 text-primary border-bottom pb-2">
                Informações do Usuário
              </h5>
              <Row>
                <Col md={6}>
                  <p className="mb-2">
                    <strong>Nome:</strong> {emprestimoToFinalizar?.usuario_detalhes?.nome || emprestimoToFinalizar?.usuario || 'N/A'}
                  </p>
                  <p className="mb-2">
                    <strong>Email:</strong> {emprestimoToFinalizar?.usuario_detalhes?.email || 'Não informado'}
                  </p>
                  <p className="mb-2">
                    <strong>Telefone:</strong> {emprestimoToFinalizar?.usuario_detalhes?.telefone || 'Não informado'}
                  </p>
                </Col>
                <Col md={6}>
                  <p className="mb-2">
                    <strong>Tipo:</strong> {emprestimoToFinalizar?.usuario_tipo ? emprestimoToFinalizar.usuario_tipo.charAt(0).toUpperCase() + emprestimoToFinalizar.usuario_tipo.slice(1) : 'N/A'}
                  </p>
                  {emprestimoToFinalizar?.usuario_detalhes?.turma && (
                    <p className="mb-2">
                      <strong>Turma:</strong> {emprestimoToFinalizar.usuario_detalhes.turma}
                    </p>
                  )}
                  {emprestimoToFinalizar?.usuario_detalhes?.departamento && (
                    <p className="mb-2">
                      <strong>Departamento:</strong> {emprestimoToFinalizar.usuario_detalhes.departamento}
                    </p>
                  )}
                </Col>
              </Row>
            </div>

            {/* SEÇÃO: Informações do Empréstimo */}
            <div className="mb-4 p-3 border rounded bg-white">
              <h5 className="fw-bold mb-3 text-primary border-bottom pb-2">
                Informações do Empréstimo
              </h5>
              <Row>
                <Col md={6}>
                  <p className="mb-2">
                    <strong>Data do Empréstimo:</strong> {new Date(emprestimoToFinalizar?.data_emprestimo).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="mb-2">
                    <strong>Data de Devolução Prevista:</strong> {new Date(emprestimoToFinalizar?.data_devolucao_prevista).toLocaleDateString('pt-BR')}
                  </p>
                </Col>
                <Col md={6}>
                  <p className="mb-2">
                    <strong>Status:</strong> 
                    <span className={`badge ${emprestimoToFinalizar?.status === 'ativo' ? 'bg-success' : 'bg-secondary'} ms-2`}>
                      {emprestimoToFinalizar?.status === 'ativo' ? 'Ativo' : 'Finalizado'}
                    </span>
                  </p>
                  
                  <p className="mb-2 d-flex align-items-center">
                    <strong>Situação:</strong>
                    {(() => {
                      const situacao = verificarPrazo(
                        emprestimoToFinalizar?.data_devolucao_prevista,
                        emprestimoToFinalizar?.data_devolucao_real,
                        emprestimoToFinalizar?.status
                      );
                      return (
                        <span className={`badge bg-${situacao.badge} ms-2`}>
                          {situacao.texto}
                        </span>
                      );
                    })()}
                  </p>
                </Col>
              </Row>
            </div>

            {/* SEÇÃO: Livros do Empréstimo */}
            <div className="p-3 border rounded bg-white">
              <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                <h5 className="fw-bold text-primary mb-0">Livros para Devolução</h5>
                <small className="text-muted">
                  <strong>Total de livros:</strong> {emprestimoToFinalizar?.livros?.length || 0}
                </small>
              </div>

              {emprestimoToFinalizar?.livros && emprestimoToFinalizar.livros.length > 0 ? (
                <div className="row">
                  {emprestimoToFinalizar.livros.map((livro, index) => (
                    <div key={livro.livro_id || index} className="col-12 mb-3">
                      <div className="card border-0 bg-light rounded-3 p-3">
                        <div className="d-flex align-items-start">
                          {/* Imagem do livro */}
                          <div
                            className="me-3 rounded overflow-hidden border bg-white d-flex align-items-center justify-content-center"
                            style={{
                              width: '70px',
                              height: '100px',
                              flexShrink: 0,
                            }}
                          >
                            {livro.livro_imagem ? (
                              <img
                                src={`http://localhost:3000${livro.livro_imagem}`}
                                alt={livro.livro_titulo}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                }}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  const placeholder = e.target.parentNode.querySelector('.livro-placeholder');
                                  if (placeholder) placeholder.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div
                              className="livro-placeholder d-flex align-items-center justify-content-center text-muted"
                              style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#f8f9fa',
                                display: livro.livro_imagem ? 'none' : 'flex',
                              }}
                            >
                              <i className="fas fa-book" style={{ fontSize: '22px' }}></i>
                            </div>
                          </div>

                          {/* Informações do livro */}
                          <div className="flex-grow-1">
                            <h6 className="fw-bold text-primary mb-2">
                              {livro.livro_titulo || 'Livro sem título'}
                            </h6>
                            <div className="row small text-muted">
                              <div className="col-md-6">
                                <p className="mb-1"><strong>Autor:</strong> {livro.autor_nome || 'Não informado'}</p>
                                <p className="mb-1"><strong>ISBN:</strong> {livro.livro_isbn || 'Não informado'}</p>
                              </div>
                              <div className="col-md-6">
                                <p className="mb-1"><strong>Quantidade:</strong> {livro.quantidade || 1}</p>
                                <p className="mb-0"><strong>ID do Livro:</strong> {livro.livro_id}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center py-3">Nenhum livro encontrado neste empréstimo</p>
              )}
            </div>

            {/* Mensagem de confirmação */}
            <div className="alert alert-warning mt-4 mb-0">
              <div className="d-flex align-items-center">
                <i className="fas fa-exclamation-triangle text-warning me-3 fs-5"></i>
                <div>
                  <strong>Atenção: Esta ação não pode ser desfeita.</strong>
                  <ul className="mb-0 mt-2">
                    <li>O empréstimo será marcado como <strong>Finalizado</strong></li>
                    <li>Os livros serão liberados para novos empréstimos</li>
                    <li>O acervo será atualizado</li>
                    <li>A data de devolução real será registrada automaticamente</li>
                  </ul>
                </div>
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer className="border-top">
            <Button
              variant="btn btn-cancelar"
              onClick={() => setShowFinalizarModal(false)}
              disabled={loading}
              className="px-4"
            >
              Cancelar
            </Button>
            <Button
              variant="success"
              onClick={handleConfirmarFinalizacao}
              disabled={loading || !emprestimoToFinalizar}
              className="px-4"
            >
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  <span className="ms-2">Finalizando...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-check-circle me-2"></i>
                  Concluir Devolução
                </>
              )}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal de cancelamento */}
        <Modal show={showCancelarModal} onHide={() => setShowCancelarModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Cancelar Empréstimo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Motivo do Cancelamento</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={motivoCancelamento}
                onChange={(e) => setMotivoCancelamento(e.target.value)}
                placeholder="Informe o motivo do cancelamento..."
                required
              />
              <Form.Text className="text-muted">
                Esta ação marcará o empréstimo como cancelado, mas manterá o histórico.
              </Form.Text>
            </Form.Group>
            <Alert variant="warning" className="mt-3">
              <div className="d-flex align-items-center">
                <i className="fas fa-exclamation-triangle text-warning me-3 fs-5"></i>
                <div>
                  <strong>Atenção: Esta ação não pode ser desfeita.</strong>
                  <ul className="mb-0 mt-2">
                    <li>O empréstimo será marcado como <strong>Cancelado</strong></li>
                    <li>Os livros serão liberados para novos empréstimos</li>
                    <li>O motivo do cancelamento será registrado</li>
                    <li>O histórico do empréstimo será mantido</li>
                  </ul>
                </div>
              </div>
            </Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="btn btn-cancelar"
              onClick={() => setShowCancelarModal(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmarCancelamento}
              disabled={loading || !motivoCancelamento}
            >
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  <span className="ms-2">Cancelando...</span>
                </>
              ) : 'Cancelar Empréstimo'}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    )
  }

  export default Emprestimos