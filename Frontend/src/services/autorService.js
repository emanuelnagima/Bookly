const API_BASE_URL = 'http://localhost:3000/api/autores';

const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    
    try {
      const errorText = await response.text();
      if (errorText) {
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error || errorText;
        } catch (e) {
          errorMessage = errorText;
        }
      }
    } catch (e) {
      console.error('Erro ao ler resposta:', e);
    }
    
    // Cria objeto estruturado de erro
    const errorObj = new Error(errorMessage);
    errorObj.status = response.status;
    
    // Adiciona tipo baseado no status
    if (response.status === 401) {
      errorObj.type = 'unauthorized';
      errorObj.title = 'Não Autorizado';
    } else if (response.status === 409) {
      errorObj.type = 'duplicate';
      errorObj.title = 'Registro Duplicado';
    } else if (response.status === 422) {
      errorObj.type = 'validation';
      errorObj.title = 'Dados Inválidos';
    } else if (response.status === 404) {
      errorObj.type = 'not_found';
      errorObj.title = 'Não Encontrado';
    } else if (response.status === 400 && errorMessage.includes('idade')) {
      errorObj.type = 'age_validation';
      errorObj.title = 'Idade Inválida';
    } else {
      errorObj.type = 'server_error';
      errorObj.title = 'Erro no Servidor';
    }
    
    throw errorObj;
  }
  
  const data = await response.json();
  return data.data || data;
};

const getAll = async () => {
  try {
    const response = await fetch(API_BASE_URL, {
      credentials: 'include'
    });    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Retorna os dados, verificando se vem em data.data ou data
    return data.data || data || [];
  } catch (error) {
    console.error('Erro no serviço autorService.getAll:', error);
    throw error;
  }
};
const getById = async (id) => {
  try {
    console.log(`Buscando autor com ID: ${id}`);
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      credentials: 'include'
    });
    
    const result = await handleResponse(response);
    console.log('Autor encontrado:', result);
    
    // O handleResponse já retorna os dados extraídos
    return result; // ← Retorna o resultado diretamente
  } catch (error) {
    console.error(`Erro ao buscar autor ${id}:`, error);
    throw error;
  }
};

const add = async (autor) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(autor),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Erro ao adicionar autor:', error);
    throw error;
  }
};

const update = async (autor) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${autor.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(autor),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`Erro ao atualizar autor ${autor.id}:`, error);
    throw error;
  }
};

const remove = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, { 
      method: 'DELETE',
      credentials: 'include'
    });
    
    const responseData = await response.json().catch(() => null);
    
    if (!response.ok) {
      // CORREÇÃO: busca a mensagem no campo "message" 
      if (responseData && responseData.message) {
        throw new Error(responseData.message);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return responseData?.message || 'Autor excluído com sucesso';
  } catch (error) {
    console.error(`Erro ao remover autor ${id}:`, error);
    throw error;
  }
};

const autorService = {
  getAll,
  getById,
  add,
  update,
  remove,
};

export default autorService;