const API_BASE_URL = 'http://localhost:3000/api/autores';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data;
};

// Busca todos os autores
const getAll = async () => {
  try {
    const response = await fetch(API_BASE_URL, {
      credentials: 'include'
    });
    const result = await handleResponse(response);
    return result.data || result;
  } catch (error) {
    console.error('Erro ao buscar autores:', error);
    throw error;
  }
};

// Busca autor por ID
const getById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      credentials: 'include'
    });
    const result = await handleResponse(response);
    return result.data || result;
  } catch (error) {
    console.error(`Erro ao buscar autor ${id}:`, error);
    throw error;
  }
};

// Adiciona um autor
const add = async (autor) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(autor),
      credentials: 'include'
    });
    const result = await handleResponse(response);
    return result.data || result;
  } catch (error) {
    console.error('Erro ao adicionar autor:', error);
    throw error;
  }
};

// Atualiza um autor
const update = async (autor) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${autor.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(autor),
      credentials: 'include'
    });
    const result = await handleResponse(response);
    return result.data || result;
  } catch (error) {
    console.error(`Erro ao atualizar autor ${autor.id}:`, error);
    throw error;
  }
};

// Remove um autor
const remove = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    const result = await handleResponse(response);
    return result.message || 'Autor excluído com sucesso';
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