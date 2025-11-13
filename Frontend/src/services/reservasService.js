const API_BASE_URL = 'http://localhost:3000/api/reservas';

// Função handleResponse melhorada (use em ambos os services)
const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    
    try {
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } else {
        const errorText = await response.text();
        if (errorText) errorMessage = errorText;
      }
    } catch (e) {
      console.error('Erro ao ler resposta de erro:', e);
    }
    
    throw new Error(errorMessage);
  }
  
  // Para respostas vazias (como em alguns DELETE)
  if (response.status === 204) {
    return { success: true };
  }
  
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'Erro na requisição');
  }
  return data;
};
const getAll = async () => {
  try {
    const response = await fetch(API_BASE_URL, {
      credentials: 'include'
    });
    const result = await handleResponse(response);
    return result.data || [];
  } catch (error) {
    console.error('Erro ao buscar reservas:', error);
    throw error;
  }
};

const getById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      credentials: 'include'
    });
    const result = await handleResponse(response);
    return result.data;
  } catch (error) {
    console.error(`Erro ao buscar reserva ${id}:`, error);
    throw error;
  }
};

const getAtivas = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/ativas`, {
      credentials: 'include'
    });
    const result = await handleResponse(response);
    return result.data || [];
  } catch (error) {
    console.error('Erro ao buscar reservas ativas:', error);
    throw error;
  }
};

const getPorLivro = async (livroId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/livro/${livroId}`, {
      credentials: 'include'
    });
    const result = await handleResponse(response);
    return result.data || [];
  } catch (error) {
    console.error(`Erro ao buscar reservas do livro ${livroId}:`, error);
    throw error;
  }
};


const add = async (reserva) => {
  try {    
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(reserva),
    });
        
    if (!response.ok) {
      let errorMessage = `Erro ao processar reserva (${response.status})`;
      
      try {
        // Tenta ler a resposta como texto primeiro
        const errorText = await response.text();
        console.log('🔴 Resposta de erro do servidor:', errorText);
        
        // Tenta parsear como JSON
        if (errorText) {
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorData.error || errorText;
          } catch (e) {
            // Se não for JSON, usa o texto direto
            errorMessage = errorText;
          }
        }
      } catch (e) {
        console.error('Erro ao ler resposta:', e);
      }
      
      throw new Error(errorMessage);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Erro ao processar reserva');
    }
    return result.data;
  } catch (error) {
    console.error('🔴 Erro ao adicionar reserva:', error);
    
    // Mensagens mais amigáveis
    let friendlyMessage = error.message;
    
    if (error.message.includes('Estoque insuficiente') || error.message.includes('ESTOQUE INSUFICIENTE')) {
      // Extrai o nome do livro da mensagem
      const livroMatch = error.message.match(/Livro: "([^"]+)"/);
      const livroNome = livroMatch ? livroMatch[1] : 'o livro selecionado';
      
      friendlyMessage = `
         ESTOQUE INSUFICIENTE
        - Livro: "${livroNome}"
        - Situação: Todos os exemplares estão emprestados.
        * Tente outro livro ou aguarde devolução
      `;
    } else if (error.message.includes('já possui reserva ativa')) {
      friendlyMessage = 'Você já possui uma reserva ativa para este livro';
    }
    
    throw new Error(friendlyMessage);
  }
};

const update = async (id, reserva) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(reserva),
    });
    const result = await handleResponse(response);
    return result.data;
  } catch (error) {
    console.error(`Erro ao atualizar reserva ${id}:`, error);
    throw error;
  }
};

const cancelar = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}/cancelar`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    const result = await handleResponse(response);
    return result.data;
  } catch (error) {
    console.error(`Erro ao cancelar reserva ${id}:`, error);
    throw error;
  }
};

const concluir = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}/concluir`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    const result = await handleResponse(response);
    return result.data;
  } catch (error) {
    console.error(`Erro ao concluir reserva ${id}:`, error);
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
    return result.message;
  } catch (error) {
    console.error(`Erro ao remover reserva ${id}:`, error);
    throw error;
  }
};

const verificarEdicao = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}/verificar-edicao`, {
      credentials: 'include'
    });
    const result = await handleResponse(response);
    return result.data.pode_editar;
  } catch (error) {
    console.error(`Erro ao verificar edição da reserva ${id}:`, error);
    throw error;
  }
};

const reservasService = {
  getAll,
  getById,
  getAtivas,
  getPorLivro,
  add,
  update,
  cancelar,
  concluir,
  remove,
  verificarEdicao
};

export default reservasService;