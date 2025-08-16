const API_BASE_URL = 'http://localhost:3000/api/autores';

// Trata a resposta da API
const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json().catch(() => ({}));
  return data.data ?? data;
};

// Busca todos os autores
const getAll = async () => {
  try {
    const response = await fetch(API_BASE_URL);
    return await handleResponse(response);
  } catch (error) {
    console.error('Erro ao buscar autores:', error);
    throw error;
  }
};

// Busca autor por ID
const getById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    return await handleResponse(response);
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
    });
    return await handleResponse(response);
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
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`Erro ao atualizar autor ${autor.id}:`, error);
    throw error;
  }
};

// Remove um autor
const remove = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
    const data = await handleResponse(response);
    return data.message || 'Autor excluído com sucesso';
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
