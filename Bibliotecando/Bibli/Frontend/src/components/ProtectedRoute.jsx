import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const loginExpires = parseInt(localStorage.getItem('loginExpires'), 10) || 0;

  // Se não estiver logado ou se a sessão expirou
  if (!isLoggedIn || new Date().getTime() > loginExpires) {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loginExpires');
    return <Navigate to="/login" replace />;
  }

  // Permite acessar as rotas internas
  return children;
};

export default ProtectedRoute;
