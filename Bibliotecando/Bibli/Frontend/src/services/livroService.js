const API_BASE_URL = 'http://localhost:3000/api/livros';

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
    return result.data.map(livro => ({ 
      ...livro, 
      dailyValue: livro.daily_Value
    }));
  } catch (error) {
    console.error('Erro ao buscar livros:', error);
    throw error;
  }
};

const getById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    const result = await handleResponse(response);
    return {
      ...result.data,
      dailyValue: result.data.daily_Value 
    };
  } catch (error) {
    console.error(`Erro ao buscar livro ${id}:`, error);
    throw error;
  }
};

const add = async (livro) => {  
  try {
    const livroData = {
      ...livro,
      daily_Value: livro.dailyValue || livro.daily_Value 
    };
    delete livroData.dailyValue; 
    
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(livroData),
    });
    
    const result = await handleResponse(response);
    return {
      ...result.data,
      dailyValue: result.data.daily_Value
    };
  } catch (error) {
    console.error('Erro ao adicionar livro:', error); 
    throw error;
  }
};

const update = async (livro) => {
  try {
    const livroData = {
      ...livro,
      id: parseInt(livro.id), 
      daily_Value: livro.dailyValue || livro.daily_Value
    };

    delete livroData.dailyValue;

    const response = await fetch(`${API_BASE_URL}/${livro.id}`, { 
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(livroData)
    })

    const result = await handleResponse(response)

    return {
      ...result.data,
      dailyValue: result.data.daily_Value 
    }

  } catch (error) {
    console.error(`Erro ao atualizar livro ${livro.id}:`, error)
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
    console.log(`Erro ao remover livro ${id}:`, error);
    throw error;
  }
};


const livroService = {
  getAll,
  getById,
  update,
  add,
  remove
};

export default livroService;