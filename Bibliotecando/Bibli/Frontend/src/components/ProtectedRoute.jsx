import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

const ProtectedRoute = ({ children }) => {
  const [autenticado, setAutenticado] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    verificarSessao();
  }, []);

  const verificarSessao = async () => {
    try {
      const resposta = await axios.get(`${API_URL}/api/verificar-sessao`, {
        withCredentials: true
      });
      setAutenticado(resposta.data.autenticado);
    } catch (erro) {
      setAutenticado(false);
    } finally {
      setCarregando(false);
    }
  };

  if (carregando) {
    return <div>Carregando...</div>;
  }

  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;