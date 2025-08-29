const API_BASE_URL = 'http://localhost:3000/api/usuarios-especiais';

const handleResponse = async (response) => {
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  const data = await response.json();
  if (!data.success) throw new Error(data.message || 'Erro na requisição');
  return data;
};

const getAll = async () => {
  const response = await fetch(API_BASE_URL);
  const result = await handleResponse(response);
  return result.data;
};

const getById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  const result = await handleResponse(response);
  return result.data;
};

const add = async (usuario) => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuario),
  });
  const result = await handleResponse(response);
  return result.data;
};

const update = async (id, usuario) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuario),
  });
  const result = await handleResponse(response);
  return result.data;
};

const remove = async (id) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
  const result = await handleResponse(response);
  return result.message;
};

const usuarioEspecialService = { getAll, getById, add, update, remove };
export default usuarioEspecialService;
