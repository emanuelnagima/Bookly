// components/RelatoriosGerais.js - VERSÃO FINAL LIMPA
import { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Form, 
  Button, 
  Table, 
  Badge, 
  Spinner,
  Container,
  Alert
} from 'react-bootstrap';
import { 
  FaSearch,
  FaChartBar,
  FaSyncAlt,
  FaUserTie,
  FaGraduationCap,
  FaUsers,
  FaBuilding,
  FaUserEdit,
  FaBook
} from 'react-icons/fa';
import relatoriosService from '../services/relatoriosService';

// Funções auxiliares de formatação
const formatarTelefone = (telefone) => {
  if (!telefone) return '-';
  const numeros = telefone.toString().replace(/\D/g, '');
  if (numeros.length === 11) {
    return `(${numeros.substring(0, 2)}) ${numeros.substring(2, 7)}-${numeros.substring(7)}`;
  } else if (numeros.length === 10) {
    return `(${numeros.substring(0, 2)}) ${numeros.substring(2, 6)}-${numeros.substring(6)}`;
  }
  return telefone;
};

const formatarCPF = (cpf) => {
  if (!cpf) return '-';
  const cpfLimpo = cpf.toString().replace(/\D/g, '');
  if (cpfLimpo.length === 11) {
    return `${cpfLimpo.substring(0, 3)}.${cpfLimpo.substring(3, 6)}.${cpfLimpo.substring(6, 9)}-${cpfLimpo.substring(9)}`;
  }
  return cpf;
};

const formatarCNPJ = (cnpj) => {
  if (!cnpj) return '-';
  const cnpjLimpo = cnpj.toString().replace(/\D/g, '');
  if (cnpjLimpo.length === 14) {
    return `${cnpjLimpo.substring(0, 2)}.${cnpjLimpo.substring(2, 5)}.${cnpjLimpo.substring(5, 8)}/${cnpjLimpo.substring(8, 12)}-${cnpjLimpo.substring(12)}`;
  }
  return cnpj;
};

// Função universal para formatar textos
const formatarTexto = (texto) => {
  if (!texto || texto === '-') return '-';
  
  // Se for número ou elemento React, retorna como está
  if (typeof texto === 'number' || typeof texto === 'object') return texto;
  
  const textoString = texto.toString().trim();
  
  // Casos especiais que precisam de tratamento específico
  if (textoString.toLowerCase() === 'usuario_especial') {
    return 'Usuário Especial';
  }
  
  return textoString.charAt(0).toUpperCase() + textoString.slice(1);
};
const RelatoriosGerais = () => {
  const [tipoRelatorio, setTipoRelatorio] = useState('emprestimos');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [filtrosAdicionais, setFiltrosAdicionais] = useState({});
  const [filtrosDisponiveis, setFiltrosDisponiveis] = useState({});
  const [dadosRelatorio, setDadosRelatorio] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [estatisticas, setEstatisticas] = useState({});

// Configurações completas para todos os relatórios 
const configRelatorios = {
  emprestimos: {
    titulo: 'Relatório de Empréstimos',
    colunas: ['ID', 'Usuário', 'Tipo', 'Livro', 'Data Empréstimo', 'Data Devolução', 'Status'], 
    icone: FaBook
  },
  entrada: {
    titulo: 'Relatório de Entradas',
    colunas: ['ID', 'Livro', 'Origem', 'Quantidade', 'Data Aquisição'],
    icone: FaBook
  },
  saida: {
    titulo: 'Relatório de Saídas',
    colunas: ['ID', 'Livro', 'Origem', 'Quantidade', 'Data Saída' ],
    icone: FaBook
  },
  cadastros: {
    titulo: 'Relatório de Cadastros de Livros',
    colunas: ['ID', 'Título', 'Autor', 'Editora', 'ISBN', 'Gênero', 'Ano', 'Estoque'],
    icone: FaBook
  },
  reservas: {
    titulo: 'Relatório de Reservas',
    colunas: ['ID', 'Usuário', 'Livro', 'Data Reserva', 'Data Validade', 'Status'],
    icone: FaBook
  },
  professores: {
    titulo: 'Relatório de Professores',
    colunas: ['ID', 'Nome', 'Departamento', 'Email', 'Telefone', 'Data Cadastro'],
    icone: FaUserTie
  },
  alunos: {
    titulo: 'Relatório de Alunos',
    colunas: ['ID', 'Nome', 'Matrícula', 'Turma', 'Email', 'Telefone', 'Data Cadastro'],
    icone: FaGraduationCap
  },
  'usuarios-especiais': {
    titulo: 'Relatório de Usuários Especiais',
    colunas: ['ID', 'Nome', 'Tipo', 'CPF', 'Email', 'Telefone', 'Data Cadastro'],
    icone: FaUserEdit
  },
  editoras: {
    titulo: 'Relatório de Editoras',
    colunas: ['ID', 'Nome', 'CNPJ', 'Email', 'Telefone', 'Data Cadastro'],
    icone: FaBuilding
  },
  autores: {
    titulo: 'Relatório de Autores',
    colunas: ['ID', 'Nome', 'Nacionalidade', 'Data Nascimento', 'Data Cadastro'],
    icone: FaUsers
  }
};
  // Buscar filtros disponíveis quando o tipo mudar
  useEffect(() => {
    const carregarFiltros = async () => {
      try {
        const response = await relatoriosService.getFiltrosDisponiveis(tipoRelatorio);
        if (response.success) {
          setFiltrosDisponiveis(response.data || {});
        }
      } catch (error) {
        console.error('Erro ao carregar filtros:', error);
        setFiltrosDisponiveis({});
      }
    };

    carregarFiltros();
    setFiltrosAdicionais({});
    setDadosRelatorio([]);
    setEstatisticas({});
    setError('');
    setSuccess('');
  }, [tipoRelatorio]);

  // Buscar dados do relatório
// components/RelatoriosGerais.js - ADICIONAR DEBUG
const buscarRelatorio = async () => {
  try {
    setLoading(true);
    setError('');
    setSuccess('');

    // CORREÇÃO: Criar objeto de filtros sem datas vazias
    const filtros = {
      ...filtrosAdicionais
    };

    // Só adiciona dataInicio se não estiver vazia
    if (dataInicio) {
      filtros.dataInicio = dataInicio;
    }

    // Só adiciona dataFim se não estiver vazia
    if (dataFim) {
      filtros.dataFim = dataFim;
    }


    const response = await relatoriosService.gerarRelatorio(tipoRelatorio, filtros);
    
    
    if (response.success) {
      setDadosRelatorio(response.relatorio || []);
      setEstatisticas(response.estatisticas || {});
      
      if (response.relatorio && response.relatorio.length === 0) {
        setSuccess(response.message || 'Nenhum registro encontrado para os filtros selecionados');
      } else {
        setSuccess('Relatório gerado com sucesso!');
      }
    } else {
      setError(response.message || 'Erro ao gerar relatório');
    }
    
  } catch (err) {
    console.error(' ERRO COMPLETO:', err);
    setError(`Erro ao gerar relatório: ${err.message}`);
  } finally {
    setLoading(false);
  }
};

  // Limpar filtros
  const limparFiltros = () => {
    setDataInicio('');
    setDataFim('');
    setFiltrosAdicionais({});
    setDadosRelatorio([]);
    setEstatisticas({});
    setError('');
    setSuccess('');
  };

  // Renderizar filtros específicos COM SELECT
  const renderFiltrosEspecificos = () => {
    switch (tipoRelatorio) {
      case 'emprestimos':
        return (
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={filtrosAdicionais.status || ''}
                  onChange={(e) => setFiltrosAdicionais({
                    ...filtrosAdicionais,
                    status: e.target.value
                  })}
                >
                  <option value="">Todos</option>
                  <option value="ativo">Ativos</option>
                  <option value="atrasado">Atrasados</option>
                  <option value="finalizado">Finalizados</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Tipo de Usuário</Form.Label>
                <Form.Select
                  value={filtrosAdicionais.usuario_tipo || ''}
                  onChange={(e) => setFiltrosAdicionais({
                    ...filtrosAdicionais,
                    usuario_tipo: e.target.value
                  })}
                >
                  <option value="">Todos</option>
                  <option value="aluno">Aluno</option>
                  <option value="professor">Professor</option>
                  <option value="usuario_especial">Usuário Especial</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        );

      case 'entrada':
      case 'saida':
        return (
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Origem</Form.Label>
                <Form.Select
                  value={filtrosAdicionais.origem || ''}
                  onChange={(e) => setFiltrosAdicionais({
                    ...filtrosAdicionais,
                    origem: e.target.value
                  })}
                >
                  <option value="">Todas</option>
                  <option value="Compra">Compra</option>
                  <option value="Doação">Doação</option>
                  <option value="Ajuste de Inventário">Ajuste de Inventário</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        );

      case 'reservas':
        return (
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={filtrosAdicionais.status || ''}
                  onChange={(e) => setFiltrosAdicionais({
                    ...filtrosAdicionais,
                    status: e.target.value
                  })}
                >
                  <option value="">Todos</option>
                  <option value="ativa">Ativas</option>
                  <option value="cancelada">Canceladas</option>
                  <option value="concluida">Concluídas</option>
                  <option value="expirada">Expiradas</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        );

      case 'professores':
        return (
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Departamento</Form.Label>
                <Form.Select
                  value={filtrosAdicionais.departamento || ''}
                  onChange={(e) => setFiltrosAdicionais({
                    ...filtrosAdicionais,
                    departamento: e.target.value
                  })}
                >
                  <option value="">Todos os departamentos</option>
                  {filtrosDisponiveis.departamentos?.map((depto, index) => (
                    <option key={index} value={depto}>{depto}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        );

      case 'alunos':
        return (
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Turma</Form.Label>
                <Form.Select
                  value={filtrosAdicionais.turma || ''}
                  onChange={(e) => setFiltrosAdicionais({
                    ...filtrosAdicionais,
                    turma: e.target.value
                  })}
                >
                  <option value="">Todas as turmas</option>
                  {filtrosDisponiveis.turmas?.map((turma, index) => (
                    <option key={index} value={turma}>{turma}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        );

      case 'usuarios-especiais':
        return (
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Tipo de Usuário</Form.Label>
                <Form.Select
                  value={filtrosAdicionais.tipo_usuario || ''}
                  onChange={(e) => setFiltrosAdicionais({
                    ...filtrosAdicionais,
                    tipo_usuario: e.target.value
                  })}
                >
                  <option value="">Todos os tipos</option>
                  {filtrosDisponiveis.tiposUsuario?.map((tipo, index) => (
                    <option key={index} value={tipo}>{tipo}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        );

      case 'autores':
        return (
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Nacionalidade</Form.Label>
                <Form.Select
                  value={filtrosAdicionais.nacionalidade || ''}
                  onChange={(e) => setFiltrosAdicionais({
                    ...filtrosAdicionais,
                    nacionalidade: e.target.value
                  })}
                >
                  <option value="">Todas as nacionalidades</option>
                  {filtrosDisponiveis.nacionalidades?.map((nacionalidade, index) => (
                    <option key={index} value={nacionalidade}>{nacionalidade}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        );

      default:
        return null;
    }
  };

  // Formatar dados para exibição na tabela
const formatarDadosTabela = (dados) => {
  return dados.map(item => {
    //  FUNÇÃO AUXILIAR PARA DATA DE CADASTRO 
    const formatarDataCadastro = (item) => {
      return item.data_cadastro ? new Date(item.data_cadastro).toLocaleDateString('pt-BR') : '-';
    };

    switch (tipoRelatorio) {
      case 'emprestimos':
        return {
          id: item.id,
          usuario: item.usuario || 'Não informado',
          tipo: (() => {
            if (!item.usuario_tipo) return 'Não informado';
            
            let tipoFormatado = item.usuario_tipo;
            
            if (tipoFormatado === 'usuario_especial') {
              tipoFormatado = 'Usuário Especial';
            } else {
              tipoFormatado = tipoFormatado.charAt(0).toUpperCase() + tipoFormatado.slice(1);
            }
            
            return tipoFormatado;
          })(),
          livro: item.livro || 'Não informado', 
          data_emprestimo: item.data_emprestimo ? new Date(item.data_emprestimo).toLocaleDateString('pt-BR') : '-',
          data_devolucao: item.data_devolucao_real 
            ? new Date(item.data_devolucao_real).toLocaleDateString('pt-BR')
            : item.data_devolucao_prevista 
              ? new Date(item.data_devolucao_prevista).toLocaleDateString('pt-BR')
              : '-',
          status: (
            <Badge bg={
              item.status === 'ativo' ? 'success' : 
              item.status === 'atrasado' ? 'warning' : 'dark'
            } className={item.status === 'atrasado' ? 'text-dark' : ''}>
              {item.status === 'ativo' ? 'Emprestado' : 
              item.status === 'atrasado' ? 'Atrasado' : 
              item.status === 'finalizado' ? 'Finalizado' : item.status}
            </Badge>
          )
        };

      case 'entrada':
        return {
          id: item.id,
          livro: item.titulo || 'Não informado',
          origem: item.origem || 'Não informado',
          quantidade: item.quantidade || 0,
          data_aquisicao: item.data_aquisicao ? new Date(item.data_aquisicao).toLocaleDateString('pt-BR') : '-',
          data_cadastro: formatarDataCadastro(item) 
        };

      case 'saida':
        return {
          id: item.id,
          livro: item.titulo || 'Não informado',
          origem: item.origem || 'Não informado',
          quantidade: item.quantidade || 0,
          data_saida: item.data_saida ? new Date(item.data_saida).toLocaleDateString('pt-BR') : '-',
          data_cadastro: formatarDataCadastro(item) 
        };

      case 'cadastros':
        return {
          id: item.id,
          titulo: item.titulo || 'Não informado',
          autor: item.autor || 'Não informado',
          editora: item.editora || 'Não informado',
          isbn: item.isbn || 'Não informado',
          genero: item.genero || 'Não informado',
          ano: item.ano || 'Não informado',
          estoque: item.estoque || 0,
          data_cadastro: formatarDataCadastro(item) 
        };

    case 'reservas':
  return {
    id: item.id,
    usuario: item.usuario || 'Não informado',
    livro: item.livro || 'Não informado',
    data_reserva: item.data_reserva ? new Date(item.data_reserva).toLocaleDateString('pt-BR') : '-',
    data_validade: item.data_validade ? new Date(item.data_validade).toLocaleDateString('pt-BR') : '-',
    status: (
      <Badge bg={
        item.status === 'ativa' ? 'success' : 
        item.status === 'expirada' ? 'warning' : 'dark'
      } className={item.status === 'expirada' ? 'text-dark' : ''}>
        {item.status === 'ativa' ? 'Ativa' : 
         item.status === 'cancelada' ? 'Cancelada' : 
         item.status === 'concluida' ? 'Concluída' : 
         item.status === 'expirada' ? 'Expirada' : item.status}
      </Badge>
    )
  };
      
      case 'professores':
        return {
          id: item.id,
          nome: item.nome || 'Não informado',
          departamento: item.departamento || 'Não informado',
          email: item.email || 'Não informado',
          telefone: formatarTelefone(item.telefone) || 'Não informado',
          data_cadastro: formatarDataCadastro(item) 
        };

      case 'alunos':
        return {
          id: item.id,
          nome: item.nome || 'Não informado',
          matricula: item.matricula || 'Não informado',
          turma: item.turma || 'Não informado',
          email: item.email || 'Não informado',
          telefone: formatarTelefone(item.telefone) || 'Não informado',
          data_cadastro: formatarDataCadastro(item) 
        };

      case 'usuarios-especiais':
        return {
          id: item.id,
          nome: item.nome || 'Não informado',
          tipo: item.tipo || 'Não informado',
          cpf: formatarCPF(item.cpf) || 'Não informado',
          email: item.email || 'Não informado',
          telefone: formatarTelefone(item.telefone) || 'Não informado',
          data_cadastro: formatarDataCadastro(item) 
        };

      case 'editoras':
        return {
          id: item.id,
          nome: item.nome || 'Não informado',
          cnpj: formatarCNPJ(item.cnpj) || 'Não informado',
          email: item.email || 'Não informado',
          telefone: formatarTelefone(item.telefone) || 'Não informado',
          data_cadastro: formatarDataCadastro(item) 
        };

      case 'autores':
        return {
          id: item.id,
          nome: item.nome || 'Não informado',
          nacionalidade: item.nacionalidade || 'Não informado',
          data_nascimento: item.data_nascimento ? 
            new Date(item.data_nascimento).toLocaleDateString('pt-BR') : '-',
          data_cadastro: formatarDataCadastro(item) 
        };

      default:
        return {
          ...item,
          data_cadastro: formatarDataCadastro(item) 
        };
    }
  });
};
// Função auxiliar para mapear colunas para propriedade
const getValorPorColuna = (linha, coluna) => {
  const mapeamento = {
    'ID': 'id',
    'Usuário': 'usuario',
    'Tipo': 'tipo',
    'Data Empréstimo': 'data_emprestimo',
    'Data Devolução': 'data_devolucao',
    'Status': 'status',
    'Data Cadastro': 'data_cadastro',
    'Livros': 'livros',
    'Livro': 'livro',
    'Origem': 'origem',
    'Quantidade': 'quantidade',
    'Data Aquisição': 'data_aquisicao',
    'Data Saída': 'data_saida',
    'Data': 'data',
    'Título': 'titulo',
    'Autor': 'autor',
    'Editora': 'editora',
    'Gênero': 'genero',
    'ISBN': 'isbn',
    'Ano': 'ano',
    'Estoque': 'estoque',
    'Data Reserva': 'data_reserva',
    'Data Validade': 'data_validade',
    'Nome': 'nome',
    'Departamento': 'departamento',
    'Email': 'email',
    'Telefone': 'telefone',
    'Empréstimos': 'emprestimos',
    'Reservas': 'reservas',
    'Matrícula': 'matricula',
    'Turma': 'turma',
    'CPF': 'cpf',
    'CNPJ': 'cnpj',
    'Total Livros': 'total_livros',
    'Estoque Total': 'estoque_total',
    'Nacionalidade': 'nacionalidade',
    'Data Nascimento': 'data_nascimento'
  };

  const propriedade = mapeamento[coluna];
  const valor = linha[propriedade];
  
  // Aplicar formatação universal a todos os valores de texto
  if (valor !== undefined && valor !== null && valor !== '-') {
    return formatarTexto(valor);
  }
  
  return '-';
};
  const IconeRelatorio = configRelatorios[tipoRelatorio]?.icone || FaChartBar;

  return (
     <Container className="py-4">
      {/* NOVO CABEÇALHO ADICIONADO AQUI */}
      <div className="rounded-3 p-4 mb-4 border">
        <Row className="align-items-center">
          <Col md={8}>
            <div className="d-flex align-items-center">
              <div className="me-3">
                <i className="fas fa-chart-bar fa-2x" style={{ color: '#0b192c' }}></i>
              </div>
              <div>
                <h4 className="fw-bold text-dark mb-1">Relatórios Gerais</h4>
              </div>
            </div>
          </Col>
          <Col md={4} className="text-md-end">
            <div className="d-flex justify-content-end flex-wrap gap-2">
              {/* Você pode adicionar botões extras aqui se quiser */}
            </div>
          </Col>
        </Row>
      </div>

      <p className="text-muted mb-4" style={{ fontSize: '0.9rem' }}>
        Esta seção permite a <strong>geração de relatórios do sistema</strong>. Você pode filtrar por período, e obter estatísticas detalhadas sobre empréstimos, reservas, cadastros e movimentações.
      </p>

      {/* CARD PRINCIPAL DO RELATÓRIO (mantém o código existente) */}
      <Card>
        <Card.Header className="bg-primary text-white">
          <div className="d-flex align-items-center">
            <IconeRelatorio className="me-2" />
            <h5 className="mb-0">Gerador de Relatórios</h5>
          </div>
        </Card.Header>

        <Card.Body>
          {/* Alertas */}
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          {/* Filtros Principais */}
          <Row className="mb-4">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Tipo de Relatório</Form.Label>
                <Form.Select
                  value={tipoRelatorio}
                  onChange={(e) => setTipoRelatorio(e.target.value)}
                >
                  <option value="emprestimos">Empréstimos</option>
                  <option value="entrada">Entradas</option>
                  <option value="saida">Saídas</option>
                  <option value="reservas">Reservas</option>
                  <option value="cadastros">Livros</option>
                  <option value="professores">Professores</option>
                  <option value="alunos">Alunos</option>
                  <option value="usuarios-especiais">Usuários Especiais</option>
                  <option value="editoras">Editoras</option>
                  <option value="autores">Autores</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label>Data Início</Form.Label>
                <Form.Control
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label>Data Fim</Form.Label>
                <Form.Control
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={2} className="d-flex align-items-end">
              <Button
                variant="primary"
                onClick={buscarRelatorio}
                disabled={loading}
                className="w-100"
              >
                {loading ? <Spinner size="sm" /> : <><FaSearch className="me-1" />Gerar</>}
              </Button>
            </Col>
          </Row>

          {/* Filtros Específicos COM SELECT */}
          {renderFiltrosEspecificos()}

          {/* Botão Limpar */}
          {dadosRelatorio.length > 0 && (
            <div className="mb-3">
              <Button
                variant="paginacao"
                onClick={limparFiltros}
                size="sm"
              >
                <FaSyncAlt className="me-1" /> Limpar Filtros
              </Button>
            </div>
          )}

          {/* Estatísticas */}
          {Object.keys(estatisticas).length > 0 && (
            <Row className="mb-4">
              <Col>
                <Card className="bg-light">
                  <Card.Body>
                    <h6 className="mb-3"> Estatísticas do Relatório</h6>
                    <Row>
                      {Object.entries(estatisticas).map(([key, value]) => (
                        <Col key={key} md={3} className="text-center mb-2">
                          <div className="border rounded p-2 bg-white">
                            <div className="fw-bold text-primary">{value}</div>
                            <small className="text-muted text-capitalize">
                              {key.replace(/_/g, ' ')}
                            </small>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* Tabela de Resultados */}
          {dadosRelatorio.length > 0 ? (
            <Card>
              <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">
                    <IconeRelatorio className="me-2" />
                    {configRelatorios[tipoRelatorio].titulo}
                  </h6>
                  <small className="text-muted">
                    Total: {dadosRelatorio.length} registros
                  </small>
                </div>
              </Card.Header>
              <Card.Body className="p-0">
                <Table striped hover responsive>
                  <thead>
                    <tr>
                      {configRelatorios[tipoRelatorio].colunas.map(coluna => (
                        <th key={coluna}>{coluna}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {formatarDadosTabela(dadosRelatorio).map((linha, index) => (
                      <tr key={index}>
                        {configRelatorios[tipoRelatorio].colunas.map(coluna => (
                          <td key={coluna}>
                            {getValorPorColuna(linha, coluna)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          ) : (
            !loading && (
              <div className="text-center py-5 text-muted">
                <IconeRelatorio size={48} className="mb-3" />
                <p>Selecione os filtros e clique em "Gerar Relatório" para visualizar os dados.</p>
              </div>
            )
          )}

          {loading && dadosRelatorio.length === 0 && (
            <div className="text-center py-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Carregando...</span>
              </Spinner>
              <p className="mt-2">Gerando relatório...</p>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RelatoriosGerais;