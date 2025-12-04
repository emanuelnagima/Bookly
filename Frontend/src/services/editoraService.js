const API_BASE_URL = 'http://localhost:3000/api/editoras';

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  
  if (!response.ok) {
    if (data && data.errors && Array.isArray(data.errors)) {
      // Juntar todos os erros em uma string
      const errorMessage = data.errors.join(', ');
      throw new Error(errorMessage);
    }
    
    // Se não tiver errors, usa message normalmente
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
    return result.data || result;
  } catch (error) {
    console.error('Erro ao buscar editoras:', error);
    throw error;
  }
};

const getById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      credentials: 'include'
    });
    const result = await handleResponse(response);
    return result.data || result;
  } catch (error) {
    console.error(`Erro ao buscar editora ${id}:`, error);
    throw error;
  }
};

const add = async (editora) => {  
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(editora),
    });
    
    const result = await handleResponse(response);
    return result.data || result;
  } catch (error) {
    console.error('Erro ao adicionar editora:', error); 
    throw error;
  }
};

const update = async (editora) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${editora.id}`, { 
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(editora)
    })

    const result = await handleResponse(response)
    return result.data || result
  } catch (error) {
    console.error(`Erro ao atualizar editora ${editora.id}:`, error)
    throw error; 
  }
}

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
    
    return responseData?.message || 'Editora excluída com sucesso';
  } catch (error) {
    console.error(`Erro ao remover editora ${id}:`, error);
    throw error;
  }
};

const editoraService = {
  getAll,
  getById,
  update,
  add,
  remove
};

export default editoraService;