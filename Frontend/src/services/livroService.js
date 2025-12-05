import entradaSaidaService from './entradaSaidaService';

const API_BASE_URL = 'http://localhost:3000/api/livros';

const handleResponse = async (response) => {
  const data = await response.json().catch(() => null);
  
  if (!response.ok) {
    const errorMessage = data?.message || `Erro ${response.status}: ${response.statusText}`;
    throw new Error(errorMessage);
  }
  
  if (!data || !data.success) {
    throw new Error(data?.message || 'Resposta inválida do servidor');
  }
  
  return data;
};

const getAll = async () => {
  try {
    const response = await fetch(API_BASE_URL, {
      credentials: 'include' // ADICIONAR
    });
    const result = await handleResponse(response);
    return result.data || [];
  } catch (error) {
    console.error('Erro ao buscar livros:', error);
    throw new Error(`Falha ao carregar livros: ${error.message}`);
  }
};

const getById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      credentials: 'include' // ADICIONAR
    });
    const result = await handleResponse(response);
    return result.data;
  } catch (error) {
    console.error(`Erro ao buscar livro ${id}:`, error);
    throw new Error(`Livro não encontrado: ${error.message}`);
  }
};

const add = async (livro) => {  
  try {
    const formData = new FormData();
    
    // Validações básicas
    if (!livro.titulo?.trim()) throw new Error('Título é obrigatório');
    if (!livro.isbn?.trim()) throw new Error('ISBN é obrigatório');
    
    formData.append('titulo', livro.titulo.trim());
    formData.append('autor_id', parseInt(livro.autor_id));
    formData.append('editora_id', parseInt(livro.editora_id));
    formData.append('isbn', livro.isbn.trim());
    formData.append('genero', livro.genero);
    formData.append('ano_publicacao', parseInt(livro.ano_publicacao));
    
    // Apenas adiciona imagem se for um arquivo válido
    if (livro.imagem instanceof File) {
      formData.append('imagem', livro.imagem);
    }
    
    console.log('Enviando dados para cadastro:');
    for (let [key, value] of formData.entries()) {
      console.log(`   ${key}:`, value instanceof File ? `File(${value.name})` : value);
    }
    
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      credentials: 'include', // ADICIONAR
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
    if (!livro.id) throw new Error('ID do livro é obrigatório para atualização');
    
    const formData = new FormData();
    
    formData.append('titulo', livro.titulo.trim());
    formData.append('autor_id', parseInt(livro.autor_id));
    formData.append('editora_id', parseInt(livro.editora_id));
    formData.append('isbn', livro.isbn.trim());
    formData.append('genero', livro.genero);
    formData.append('ano_publicacao', parseInt(livro.ano_publicacao));
    
    if (livro.imagem instanceof File) {
      formData.append('imagem', livro.imagem);
    }
    
    console.log('Enviando dados para atualização:');
    for (let [key, value] of formData.entries()) {
      console.log(`   ${key}:`, value instanceof File ? `File(${value.name})` : value);
    }
    
    const response = await fetch(`${API_BASE_URL}/${livro.id}`, {
      method: 'PUT',
      credentials: 'include', // ADICIONAR
      body: formData,
    });
    
    const result = await handleResponse(response);
    return result.data;
  } catch (error) {
    console.error(`Erro ao atualizar livro ${livro.id}:`, error);
    throw error;
  }
};
export const getAllComEstoque = async () => {
  try {
    const livros = await getAll();
    
    // Buscar estoque atualizado para cada livro
    const livrosComEstoque = await Promise.all(
      livros.map(async (livro) => {
        try {
          const estoqueData = await entradaSaidaService.verificarEstoque(livro.id);
          return {
            ...livro,
            estoque: estoqueData || 0
          };
        } catch (error) {
          console.error(`Erro ao buscar estoque do livro ${livro.id}:`, error);
          return {
            ...livro,
            estoque: 0
          };
        }
      })
    );
    
    return livrosComEstoque;
  } catch (error) {
    console.error('Erro ao carregar livros com estoque:', error);
    throw error;
  }
};
const remove = async (id) => { 
  try {
    if (!id) throw new Error('ID é obrigatório para exclusão');
    
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      credentials: 'include' // ADICIONAR
    });
    
    const result = await handleResponse(response);
    return result.message || 'Livro excluído com sucesso';
  } catch (error) {
    console.error(`Erro ao remover livro ${id}:`, error);
    throw new Error(`Falha ao excluir livro: ${error.message}`);
  }
};

const livroService = {
  getAll,
  getById,
  update,
  add,
  remove,
  getAllComEstoque,
};

export default livroService;