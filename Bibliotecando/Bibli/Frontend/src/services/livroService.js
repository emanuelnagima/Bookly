const API_BASE_URL = 'http://localhost:3000/api/livros';

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
    return result.data;
  } catch (error) {
    console.error('Erro ao buscar livros:', error);
    throw error;
  }
};

const getById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    const result = await handleResponse(response);
    return result.data;
  } catch (error) {
    console.error(`Erro ao buscar livro ${id}:`, error);
    throw error;
  }
};

const add = async (livro) => {  
  try {
    const formData = new FormData();
    
    // 
    formData.append('titulo', livro.titulo);
    formData.append('autor', livro.autor);
    formData.append('editora', livro.editora);
    formData.append('isbn', livro.isbn);
    formData.append('genero', livro.genero);
    formData.append('ano_publicacao', livro.ano_publicacao);
    
    // 
    if (livro.imagem && livro.imagem instanceof File) {
      formData.append('imagem', livro.imagem);
    } else if (livro.imagem) {
      console.log('⚠️  Imagem não é um arquivo válido:', livro.imagem);
    }
    
    for (let [key, value] of formData.entries()) {
      console.log(`   ${key}:`, value);
    }
    
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      body: formData,
    });
    
    const result = await handleResponse(response);
    return result.data;
  } catch (error) {
    console.error('Erro ao adicionar livro:', error); 
    throw error;
  }
};

const update = async (livro) => {
  try {
    const formData = new FormData();
    
    formData.append('titulo', livro.titulo);
    formData.append('autor', livro.autor);
    formData.append('editora', livro.editora);
    formData.append('isbn', livro.isbn);
    formData.append('genero', livro.genero);
    formData.append('ano_publicacao', livro.ano_publicacao);
    
    if (livro.imagem && livro.imagem instanceof File) {
      formData.append('imagem', livro.imagem);
    }
    
    const response = await fetch(`${API_BASE_URL}/${livro.id}`, {
      method: 'PUT',
      body: formData,
    });
    
    const result = await handleResponse(response);
    return result.data;
  } catch (error) {
    console.error(`Erro ao atualizar livro ${livro.id}:`, error);
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