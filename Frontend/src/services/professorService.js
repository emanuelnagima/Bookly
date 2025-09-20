const API_BASE_URL = 'http://localhost:3000/api/professores';

const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'Erro na requisição');
  }
  return data;
};

const getAll = async () => {
  try {
    const response = await fetch(API_BASE_URL);
    const result = await handleResponse(response);
    return result.data; 
  } catch (error) {
    console.error('Erro ao buscar professores:', error);
    throw error;
  }
};

const getById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    const result = await handleResponse(response);
    return result.data;
  } catch (error) {
    console.error(`Erro ao buscar professor ${id}:`, error);
    throw error;
  }
};

const add = async (professor) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(professor),
    });

    const result = await handleResponse(response);
    return result.data;
  } catch (error) {
    console.error('Erro ao adicionar professor:', error);
    throw error;
  }
};

const update = async (professor) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${professor.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(professor),
    });

    const result = await handleResponse(response);
    return result.data;
  } catch (error) {
    console.error(`Erro ao atualizar professor ${professor.id}:`, error);
    throw error;
  }
};

const remove = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    const result = await handleResponse(response);
    return result.message;
  } catch (error) {
    console.error(`Erro ao remover professor ${id}:`, error);
    throw error;
  }
};

const professorService = {
  getAll,
  getById,
  update,
  add,
  remove,
};

export default professorService;
