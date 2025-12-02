const API_BASE_URL = 'http://localhost:3000/api/emprestimos';

// services/emprestimosService.js - Atualize a função handleResponse

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
    console.error('Erro ao buscar empréstimos:', error);
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
    console.error(`Erro ao buscar empréstimo ${id}:`, error);
    throw error;
  }
};

const getAtivos = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/ativos`, {
      credentials: 'include'
    });
    const result = await handleResponse(response);
    return result.data || [];
  } catch (error) {
    console.error('Erro ao buscar empréstimos ativos:', error);
    throw error;
  }
};

const getAtrasados = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/atrasados`, {
      credentials: 'include'
    });
    const result = await handleResponse(response);
    return result.data || [];
  } catch (error) {
    console.error('Erro ao buscar empréstimos atrasados:', error);
    throw error;
  }
};

const getOpcoesUsuarios = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/opcoes-usuarios`, {
      credentials: 'include'
    });
    const result = await handleResponse(response);
    return result.data;
  } catch (error) {
    console.error('Erro ao buscar opções de usuários:', error);
    throw error;
  }
};

const add = async (emprestimo) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(emprestimo),
    });
    const result = await handleResponse(response);
    return result.data;
  } catch (error) {
    console.error('Erro ao adicionar empréstimo:', error);
    throw error;
  }
};

const update = async (id, emprestimo) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(emprestimo),
    });
    const result = await handleResponse(response);
    return result.data;
  } catch (error) {
    console.error(`Erro ao atualizar empréstimo ${id}:`, error);
    throw error;
  }
};

const renovar = async (id, dataDevolucao) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}/renovar`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ data_devolucao_prevista: dataDevolucao }),
    });
    const result = await handleResponse(response);
    return result.data;
  } catch (error) {
    console.error(`Erro ao renovar empréstimo ${id}:`, error);
    throw error;
  }
};

const finalizar = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}/finalizar`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    const result = await handleResponse(response);
    return result.data;
  } catch (error) {
    console.error(`Erro ao finalizar empréstimo ${id}:`, error);
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
    console.error(`Erro ao remover empréstimo ${id}:`, error);
    throw error;
  }
};
const verificarDisponibilidade = async (livroId, quantidade = 1) => {
  try {
    const response = await fetch(`${API_BASE_URL}/disponibilidade/${livroId}?quantidade=${quantidade}`, {
      credentials: 'include'
    });
    
    if (!response.ok) {
      // Se a rota não existir ainda, usa fallback
      const livroResponse = await fetch(`http://localhost:3000/api/livros/${livroId}`, {
        credentials: 'include'
      });
      
      if (livroResponse.ok) {
        const livroData = await livroResponse.json();
        return {
          success: true,
          data: {
            podeReservar: (livroData.data.estoque || 0) >= quantidade,
            disponivelExato: livroData.data.estoque || 0,
            estoqueFisico: livroData.data.estoque || 0,
            totalReservado: 0,
            livro: livroData.data.titulo
          }
        };
      }
      
      throw new Error('Erro ao verificar disponibilidade');
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`Erro ao verificar disponibilidade do livro ${livroId}:`, error);
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
    console.error(`Erro ao verificar edição do empréstimo ${id}:`, error);
    throw error;
  }
  
};

const gerarRelatorio = async (filtros) => {
  try {
    const response = await fetch('http://localhost:3000/api/emprestimos/relatorios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filtros)
    });

    if (!response.ok) {
      throw new Error('Erro ao gerar relatório');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};



const emprestimosService = {
  getAll,
  getById,
  getAtivos,
  getAtrasados,
  getOpcoesUsuarios,
  add,
  update,
  renovar,
  finalizar,
  remove,
  verificarEdicao,
  verificarDisponibilidade,
  gerarRelatorio
};

export default emprestimosService;