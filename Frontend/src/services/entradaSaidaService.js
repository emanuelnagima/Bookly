const API_BASE_URL = 'http://localhost:3000/api/entrada-saida';

const handleResponse = async (response) => {
  
  // Verifica se a resposta é JSON
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    console.error(' A resposta não é JSON:', text.substring(0, 200));
    throw new Error('Resposta do servidor não é JSON');
  }
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error(' Erro da API:', errorData);
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  return data;
};

// ENTRADAS
const registrarEntrada = async (entradaData) => {
  try {
    console.log('📤 Enviando entrada:', entradaData);
    const response = await fetch(`${API_BASE_URL}/entradas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entradaData),
    });
    const result = await handleResponse(response);
    return result.data;
  } catch (error) {
    console.error('❌ Erro ao registrar entrada:', error);
    throw error;
  }
};

const getEntradas = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/entradas`);
    const result = await handleResponse(response);
    return result.data;
  } catch (error) {
    console.error('Erro ao buscar entradas:', error);
    throw error;
  }
};

const getEntradasPorLivro = async (livroId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/entradas/livro/${livroId}`);
    const result = await handleResponse(response);
    return result.data;
  } catch (error) {
    console.error('Erro ao buscar entradas do livro:', error);
    throw error;
  }
};

// SAÍDAS
const registrarSaida = async (saidaData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/saidas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(saidaData),
    });
    const result = await handleResponse(response);
    return result.data;
  } catch (error) {
    console.error('Erro ao registrar saída:', error);
    throw error;
  }
};

const getSaidas = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/saidas`);
    const result = await handleResponse(response);
    return result.data;
  } catch (error) {
    console.error('Erro ao buscar saídas:', error);
    throw error;
  }
};

const getSaidasPorLivro = async (livroId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/saidas/livro/${livroId}`);
    const result = await handleResponse(response);
    return result.data;
  } catch (error) {
    console.error('Erro ao buscar saídas do livro:', error);
    throw error;
  }
};

// OPÇÕES
const getOpcoesEntrada = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/opcoes/entrada`);
    const result = await handleResponse(response);
    return result.data;
  } catch (error) {
    console.error('Erro ao buscar opções de entrada:', error);
    throw error;
  }
};

const getOpcoesSaida = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/opcoes/saida`);
    const result = await handleResponse(response);
    return result.data;
  } catch (error) {
    console.error('Erro ao buscar opções de saída:', error);
    throw error;
  }
};

// ESTATÍSTICAS E HISTÓRICO
const getEstatisticas = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/estatisticas`);
    const result = await handleResponse(response);
    return result.data;
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    throw error;
  }
};

const getHistorico = async (livroId = null) => {
  try {
    const url = livroId ? `${API_BASE_URL}/historico?livroId=${livroId}` : `${API_BASE_URL}/historico`;
    const response = await fetch(url);
    const result = await handleResponse(response);
    return result.data;
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    throw error;
  }
};

const verificarEstoque = async (livroId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/estoque/${livroId}`);
    const result = await handleResponse(response);
    return result.data.estoque;
  } catch (error) {
    console.error('Erro ao verificar estoque:', error);
    throw error;
  }
};

// INVENTÁRIO
const processarInventario = async (inventarioData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/inventario`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inventarioData),
    });
    const result = await handleResponse(response);
    return result.data;
  } catch (error) {
    console.error('Erro ao processar inventário:', error);
    throw error;
  }
};

const entradaSaidaService = {
  // Entradas
  registrarEntrada,
  getEntradas,
  getEntradasPorLivro,
  
  // Saídas
  registrarSaida,
  getSaidas,
  getSaidasPorLivro,
  
  // Opções
  getOpcoesEntrada,
  getOpcoesSaida,
  
  // Estatísticas
  getEstatisticas,
  getHistorico,
  verificarEstoque,
  
  // Inventário
  processarInventario
};

export default entradaSaidaService;