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
    console.log('=== reservasService.add INÍCIO ===');
    console.log('Dados da reserva:', reserva);
    
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(reserva),
    });
    
    const responseText = await response.text();
    console.log('Resposta do servidor (texto):', responseText);
    console.log('Status:', response.status);
    
    // Tentar parsear como JSON
    let responseData;
    try {
      responseData = JSON.parse(responseText);
      console.log('Resposta parseada:', responseData);
    } catch (e) {
      console.error('Erro ao parsear resposta como JSON:', e);
      // Se não for JSON válido, tratar como texto
      if (!response.ok) {
        const erro = {
          type: 'erro_http',
          title: 'Erro na Solicitação',
          message: `Erro ${response.status}: ${responseText}`,
          style: 'danger'
        };
        console.log('Lançando erro HTTP:', erro);
        throw erro;
      }
      throw new Error('Resposta inválida do servidor');
    }
    
    // Se não foi bem sucedido
    if (!response.ok || !responseData.success) {
      console.log('Resposta não foi bem sucedida');
      
      // VERIFICAR SE TEM ERRO ESTRUTURADO
      if (responseData.error && typeof responseData.error === 'object') {
        console.log('Tem erro estruturado:', responseData.error);
        const erroEstruturado = responseData.error;
        
        // Garantir que tem as propriedades necessárias
        if (!erroEstruturado.style) {
          erroEstruturado.style = 'warning';
        }
        
        throw erroEstruturado;
      } 
      // Se tiver message mas não for objeto estruturado
      else if (responseData.message) {
        console.log('Tem message:', responseData.message);
        const erro = {
          type: 'erro_api',
          title: 'Erro no Sistema',
          message: responseData.message,
          style: 'danger'
        };
        throw erro;
      }
      // Erro genérico
      else {
        console.log('Erro genérico');
        const erro = {
          type: 'erro_desconhecido',
          title: 'Erro Desconhecido',
          message: 'Não foi possível processar a reserva',
          style: 'danger'
        };
        throw erro;
      }
    }
    
    // Sucesso
    console.log('=== reservasService.add SUCESSO ===');
    return responseData.data;
    
  } catch (error) {
    console.error('=== reservasService.add ERRO ===');
    console.error('Tipo do erro:', typeof error);
    console.error('Erro:', error);
    
    // SE JÁ FOR OBJETO ESTRUTURADO (com type e title), repassa diretamente
    if (error.type && error.title) {
      console.log('Erro já estruturado, repassando:', error);
      // Garantir que tem style
      if (!error.style) {
        error.style = 'warning';
      }
      throw error;
    }
    
    // Se for string ou outro tipo, converter para objeto estruturado
    const mensagem = error.message || String(error);
    console.log('Convertendo para objeto estruturado:', mensagem);
    
    // Criar objeto de erro padrão
    const errorObject = { 
      type: 'erro_desconhecido',
      title: 'Erro na Reserva',
      message: mensagem,
      style: 'danger'
    };
    
    throw errorObject;
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

const cancelar = async (id, motivo = '') => {
  try {
    console.log(`Service: Cancelando reserva ${id} com motivo: "${motivo}"`);
    
    const response = await fetch(`${API_BASE_URL}/${id}/cancelar`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ motivo }), // motivo no corpo
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