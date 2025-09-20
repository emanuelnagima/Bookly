const API_BASE_URL = 'http://localhost:3000/api/editoras';

const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data;
};

const getAll = async () => {
  try {
    const response = await fetch(API_BASE_URL);
    const result = await handleResponse(response);
    return result.data || result;
  } catch (error) {
    console.error('Erro ao buscar editoras:', error);
    throw error;
  }
};

const getById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
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
    });
    const result = await handleResponse(response); 
    return result.message || 'Editora excluída com sucesso';
  } catch (error) {
    console.log(`Erro ao remover editora ${id}:`, error);
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