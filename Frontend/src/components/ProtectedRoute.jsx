import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  // Se não estiver logado, redireciona para login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se tem roles específicas, verifica se o usuário tem permissão
  if (roles.length > 0 && !roles.includes(user.role)) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4>Acesso Negado</h4>
          <p>Você não tem permissão para acessar esta página. Verifique sua permissão de usuario</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;