const API_BASE_URL = 'http://localhost:3000/api/usuarios-especiais';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
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
    console.error('Erro ao buscar usuários especiais:', error);
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
    console.error(`Erro ao buscar usuário especial ${id}:`, error);
    throw error;
  }
};

const add = async (usuario) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario),
      credentials: 'include'
    });
    const result = await handleResponse(response);
    return result.data || result;
  } catch (error) {
    console.error('Erro ao adicionar usuário especial:', error);
    throw error;
  }
};

const update = async (id, usuario) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario),
      credentials: 'include'
    });
    const result = await handleResponse(response);
    return result.data || result;
  } catch (error) {
    console.error(`Erro ao atualizar usuário especial ${id}:`, error);
    throw error;
  }
};

const remove = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    const result = await handleResponse(response);
    return result.message || 'Usuário especial excluído com sucesso';
  } catch (error) {
    console.error(`Erro ao remover usuário especial ${id}:`, error);
    throw error;
  }
};

const usuarioEspecialService = { getAll, getById, add, update, remove };
export default usuarioEspecialService;