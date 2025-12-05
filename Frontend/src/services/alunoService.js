const API_BASE_URL = 'http://localhost:3000/api/alunos';

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
    } else if (response.status === 400 && errorMessage.includes('idade')) {
      errorObj.type = 'age_validation';
      errorObj.title = 'Idade Inválida';
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
    console.error('Erro ao buscar alunos:', error);
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
    console.error(`Erro ao buscar aluno ${id}:`, error);
    throw error;
  }
};

const add = async (aluno) => {  
  try {
    // NÃO enviar matrícula - será gerada no backend
    const dadosParaEnviar = {
      nome: aluno.nome,
      cpf: aluno.cpf,
      data_nascimento: aluno.data_nascimento,
      email: aluno.email,
      telefone: aluno.telefone,
      turma: aluno.turma
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
    console.error('Erro ao adicionar aluno:', error); 
    throw error;
  }
};

const update = async (aluno) => {
  try {
    // Manter matrícula original na edição
    const dadosParaEnviar = {
      nome: aluno.nome,
      cpf: aluno.cpf,
      data_nascimento: aluno.data_nascimento,
      email: aluno.email,
      telefone: aluno.telefone,
      turma: aluno.turma
    };
    
    const response = await fetch(`${API_BASE_URL}/${aluno.id}`, { 
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', 
      body: JSON.stringify(dadosParaEnviar)
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
      credentials: 'include' 
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