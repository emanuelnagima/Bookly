import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useEffect } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  
useEffect(() => {
    document.title = "Bookly - Login"; 
  }, []);

  // Se já estiver logado, redireciona
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (error) {
      console.log(error);
      setError('Email ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };


  
  return (
    <div className="login-container">
      <div className="login-form">
        <div>
          <h1 style={{
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: '600',
            fontSize: '3.8rem',
            color: '#372ee0',
            marginBottom: '0.2rem',
            letterSpacing: '-10px',
            marginLeft: '-1.2rem'
          }}>
            Bookly
          </h1>
        </div>
        <p>Faça login para acessar a plataforma</p>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>E-mail:</label>
            <input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Senha:</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="login-button" 
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="privacy-links">
          <div className="privacy-link">
            <a
              href="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted small"
            >
              Veja nossa política de privacidade
            </a>
          </div>

          <div className="privacy-link">
            <a
              href="/terms-of-use"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted small"
            >
              Termos de uso
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          font-family: var(--font-sans);
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #6F00FF, #19183B);
        }

        .login-form {
          background-color: var(--color-bg);
          padding: 2.5rem 3rem;
          border-radius: var(--round-big);
          box-shadow: var(--shadow-card-hover);
          width: 100%;
          max-width: 400px;
          text-align: center;
          position: relative;
          z-index: 1;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .login-form:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-card-hover);
        }

        .login-form h2 {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          color: var(--color-accent);
          font-size: 1.8rem;
          font-weight: 600;
        }

        .login-form p {
          margin-bottom: 1rem;
          color: var(--color-muted);
          font-size: 0.95rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          margin-bottom: 1.5rem;
          width: 100%;
        }

        .form-group label {
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: var(--color-foreground);
        }

        .form-group input {
          width: 100%;
          padding: 0.65rem 0.75rem;
          border: 1px solid var(--color-card-border);
          border-radius: var(--border-radius);
          font-size: 1rem;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          color: var(--color-foreground);
        }

        .form-group input::placeholder {
          color: var(--color-muted);
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px rgba(33,25,180,0.15);
        }

        .login-button {
          width: 100%;
          background-color: var(--color-accent);
          color: var(--color-white);
          padding: 0.75rem;
          border: none;
          border-radius: var(--border-radius);
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
          box-shadow: var(--shadow-card);
        }

        .login-button:hover:not(:disabled) {
          background-color: #372ee0;
          transform: translateY(-2px);
          box-shadow: var(--shadow-card-hover);
        }

        .login-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .password-wrapper {
          position: relative;
          width: 100%;
        }

        .password-toggle {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: var(--color-muted);
          font-size: 1.1rem;
        }

        .alert-danger {
          background-color: #f8d7da;
          border-color: #f5c6cb;
          color: #721c24;
          padding: 0.75rem;
          border-radius: 0.375rem;
          margin-bottom: 1rem;
          text-align: left;
        }

        .privacy-links {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 1rem; 
        }

        .privacy-link a {
          color: var(--color-muted);
          text-decoration: none;
          font-size: 0.85rem;
          transition: color 0.3s ease;
        }

        .privacy-link a:hover {
          color: var(--color-accent);
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .login-form {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;