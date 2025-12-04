const API_BASE_URL = 'http://localhost:3000/api/autores';

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  
  if (!response.ok) {
    // busca em "message" primeiro, depois em "error"
    const errorMessage = data?.message || data?.error || `HTTP error! status: ${response.status}`;
    throw new Error(errorMessage);
  }
  
  return data;
};

const getAll = async () => {
  try {
    const response = await fetch(API_BASE_URL, {
      credentials: 'include'
    });
    const result = await handleResponse(response);
    return result.data || [];
  } catch (error) {
    console.error('Erro ao buscar autores:', error);
    throw error;
  }
};

const getById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      credentials: 'include'
    });
    const result = await handleResponse(response);
    return result.data;
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
      // busca a mensagem no campo "message" 
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