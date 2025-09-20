import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/livros';

const handleResponse = (response) => {
  if (response.data && response.data.success) {
    return response.data.data;
  }
  throw new Error(response.data?.message || 'Erro na requisição');
};

const handleError = (error) => {
  console.error('Erro no service:', error.response?.data || error.message);
  throw error;
};

const getAll = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const getById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const add = async (livro) => {  
  try {
    const formData = new FormData();
    
    formData.append('titulo', livro.titulo);
    formData.append('autor_id', livro.autor_id);
    formData.append('editora_id', livro.editora_id);
    formData.append('isbn', livro.isbn);
    formData.append('genero', livro.genero);
    formData.append('ano_publicacao', livro.ano_publicacao);
    
    if (livro.imagem && livro.imagem instanceof File) {
      formData.append('imagem', livro.imagem);
    }
    
    const response = await axios.post(API_BASE_URL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const update = async (livro) => {
  try {
    const formData = new FormData();
    
    formData.append('titulo', livro.titulo);
    formData.append('autor_id', livro.autor_id);
    formData.append('editora_id', livro.editora_id);
    formData.append('isbn', livro.isbn);
    formData.append('genero', livro.genero);
    formData.append('ano_publicacao', livro.ano_publicacao);
    
    if (livro.imagem && livro.imagem instanceof File) {
      formData.append('imagem', livro.imagem);
    }
    
    const response = await axios.put(`${API_BASE_URL}/${livro.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const remove = async (id) => { 
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
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