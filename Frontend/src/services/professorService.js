const API_BASE_URL = 'http://localhost:3000/api/professores';

const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    
    try {
      const errorText = await response.text();
      if (errorText) {
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error || errorText;
        } catch (e) {
          errorMessage = errorText;
        }
      }
    } catch (e) {
      console.error('Erro ao ler resposta:', e);
    }
    
    // Cria objeto estruturado de erro
    const errorObj = new Error(errorMessage);
    errorObj.status = response.status;
    
    // Adiciona tipo baseado no status
    if (response.status === 401) {
      errorObj.type = 'unauthorized';
      errorObj.title = 'Não Autorizado';
    } else if (response.status === 409) {
      errorObj.type = 'duplicate';
      errorObj.title = 'Registro Duplicado';
    } else if (response.status === 422) {
      errorObj.type = 'validation';
      errorObj.title = 'Dados Inválidos';
    } else if (response.status === 404) {
      errorObj.type = 'not_found';
      errorObj.title = 'Não Encontrado';
    } else {
      errorObj.type = 'server_error';
      errorObj.title = 'Erro no Servidor';
    }
    
    throw errorObj;
  }
  
  const data = await response.json();
  if (!data.success) {
    const error = new Error(data.message || 'Erro na requisição');
    error.type = 'request_error';
    error.title = 'Erro na Requisição';
    throw error;
  }
  return data;
};

const getAll = async () => {
  try {
    const response = await fetch(API_BASE_URL, {
      credentials: 'include' 
    });
    const result = await handleResponse(response);
    return result.data; 
  } catch (error) {
    console.error('Erro ao buscar professores:', error);
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
    console.error(`Erro ao buscar professor ${id}:`, error);
    throw error;
  }
};

const add = async (professor) => {
  try {
    // NÃO enviar matrícula - será gerada no backend
    const dadosParaEnviar = {
      nome: professor.nome,
      cpf: professor.cpf,
      data_nascimento: professor.data_nascimento,
      email: professor.email,
      telefone: professor.telefone,
      departamento: professor.departamento
    };
    
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', 
      body: JSON.stringify(dadosParaEnviar),
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
    // NÃO enviar matrícula na atualização
    const dadosParaEnviar = {
      nome: professor.nome,
      cpf: professor.cpf,
      data_nascimento: professor.data_nascimento,
      email: professor.email,
      telefone: professor.telefone,
      departamento: professor.departamento
    };
    
    const response = await fetch(`${API_BASE_URL}/${professor.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', 
      body: JSON.stringify(dadosParaEnviar),
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
      credentials: 'include' 
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