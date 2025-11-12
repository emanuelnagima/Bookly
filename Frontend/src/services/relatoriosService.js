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
    // Retorna objeto vazio em caso de erro para não quebrar a interface
    return { success: true, data: {} };
  }
};

const relatoriosService = {
  gerarRelatorio,
  getFiltrosDisponiveis
};

export default relatoriosService;