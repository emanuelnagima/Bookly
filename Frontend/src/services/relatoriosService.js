const API_BASE_URL = 'http://localhost:3000/api/relatorios';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Erro HTTP:', response.status, errorText);
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || 'Erro na requisição');
  }
  return data;
};

const gerarRelatorio = async (tipo, filtros = {}) => {
  try {    
    const response = await fetch(`${API_BASE_URL}/${tipo}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(filtros),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error(`Erro ao gerar relatório de ${tipo}:`, error);
    throw error;
  }
};

const buscarUsuarios = async (tipo, termo) => {
  try {
    const response = await fetch(`${API_BASE_URL}/buscar-usuarios?tipo=${tipo}&termo=${encodeURIComponent(termo)}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error(`Erro ao buscar usuários por ${tipo}:`, error);
    return { success: true, data: [] };
  }
};

const buscarLivros = async (tipo, termo) => {
  try {
    const response = await fetch(`${API_BASE_URL}/buscar-livros?tipo=${tipo}&termo=${encodeURIComponent(termo)}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error(`Erro ao buscar livros por ${tipo}:`, error);
    return { success: true, data: [] };
  }
};

const getFiltrosDisponiveis = async (tipo) => {
  try {    
    const response = await fetch(`${API_BASE_URL}/filtros/${tipo}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error(`Erro ao buscar filtros para ${tipo}:`, error);
    return { success: true, data: {} };
  }
};

const getEstatisticasGerais = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/estatisticas-gerais`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Erro ao buscar estatísticas gerais:', error);
    return { 
      success: true, 
      data: {} 
    };
  }
};

const getRelatorioEstoque = async (filtros = {}) => {
  try {
    // Usar a rota padrão de relatórios em vez da rota específica
    const response = await fetch(`${API_BASE_URL}/estoque`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(filtros),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Erro ao gerar relatório de estoque:', error);
    throw error;
  }
};

const relatoriosService = {
  gerarRelatorio,
  getFiltrosDisponiveis,
  buscarLivros,
  buscarUsuarios,
  getEstatisticasGerais,
  getRelatorioEstoque 
};

export default relatoriosService;