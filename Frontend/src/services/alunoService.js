const API_BASE_URL = 'http://localhost:3000/api/alunos';

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
    console.error('Erro ao buscar alunos:', error);
    throw error;
  }
};

const getById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    const result = await handleResponse(response);
    return result.data;
  } catch (error) {
    console.error(`Erro ao buscar aluno ${id}:`, error);
    throw error;
  }
};

const add = async (aluno) => {  
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(aluno),
    });
    
    const result = await handleResponse(response);
    return result.data;
  } catch (error) {
    console.error('Erro ao adicionar aluno:', error); 
    throw error;
  }
};

const update = async (aluno) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${aluno.id}`, { 
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(aluno)
    })

    const result = await handleResponse(response)
    return result.data;

  } catch (error) {
    console.error(`Erro ao atualizar aluno ${aluno.id}:`, error)
    throw error; 
  }
}

const remove = async (id) => { 
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    const result = await handleResponse(response); 
    return result.message;
  } catch (error) {
    console.log(`Erro ao remover aluno ${id}:`, error);
    throw error;
  }
};

const alunoService = {
  getAll,
  getById,
  update,
  add,
  remove
};

export default alunoService;