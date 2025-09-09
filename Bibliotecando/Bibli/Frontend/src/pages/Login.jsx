import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBookOpen, FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

const Login = () => {
  const [email, setEmail] = useState('adm@gmail.com');
  const [password, setPassword] = useState('L!vr0$V00@2025');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Digite um e-mail válido');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('Fazendo login com:', { email, password });
      
      const resposta = await axios.post(`${API_URL}/api/login`, 
        { email, password },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Resposta do login:', resposta.data);
      
      if (resposta.data.sucesso) {
        setTimeout(() => {
          setIsLoading(false);
          navigate('/');
        }, 1000);
      }
    } catch (erro) {
      setIsLoading(false);
      console.error('Erro completo:', erro);
      console.error('Resposta do erro:', erro.response?.data);
      console.error('Status do erro:', erro.response?.status);
      
      if (erro.response?.status === 401) {
        setError('Credenciais inválidas. Verifique e-mail e senha.');
      } else if (erro.response?.status === 500) {
        setError('Erro no servidor. Tente novamente.');
      } else if (erro.code === 'NETWORK_ERROR') {
        setError('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
      } else {
        setError(erro.response?.data?.mensagem || 'Erro ao fazer login. Verifique o console.');
      }
    }
  };

  // Teste automático ao carregar a página (para debug)
  useEffect(() => {
    const testarConexao = async () => {
      try {
        const response = await fetch(`${API_URL}/api/verificar-sessao`, {
          credentials: 'include'
        });
        console.log('Teste de conexão:', response.status);
      } catch (error) {
        console.log('Servidor pode não estar respondendo');
      }
    };
    
    testarConexao();
  }, []);

  // Fundo animado de partículas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray = [];
    const numParticles = 80;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }
      draw() {
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function init() {
      particlesArray = [];
      for (let i = 0; i < numParticles; i++) {
        particlesArray.push(new Particle());
      }
    }

    function animate() {
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-sidebar') || '#0B192C';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      particlesArray.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    }

    init();
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="login-container">
      <canvas ref={canvasRef} className="bg-canvas"></canvas>

      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <FaSpinner className="spinner-icon" />
            <p>Carregando, aguarde...</p>
          </div>
        </div>
      )}

      <style>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          font-family: var(--font-sans);
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #0B192C 0%, #1a365d 100%);
        }

        .bg-canvas {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 0;
        }

        .login-form {
          background-color: var(--color-bg, #ffffff);
          padding: 2.5rem 3rem;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 400px;
          text-align: center;
          position: relative;
          z-index: 1;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 1px solid var(--color-card-border, #e2e8f0);
        }

        .login-form:hover {
          transform: translateY(-4px);
          box-shadow: 0 25px 50px rgba(0,0,0,0.15);
        }

        .login-form h2 {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          color: var(--color-accent, #3182ce);
          font-size: 1.8rem;
          font-weight: 600;
        }

        .login-form p {
          margin-bottom: 2rem;
          color: var(--color-muted, #718096);
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
          color: var(--color-foreground, #2d3748);
        }

        .form-group input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--color-card-border, #e2e8f0);
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          color: var(--color-foreground, #2d3748);
          background: var(--color-input-bg, #ffffff);
        }

        .form-group input::placeholder {
          color: var(--color-muted, #a0aec0);
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--color-accent, #3182ce);
          box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.15);
        }

        .error-message {
          color: #e53e3e;
          font-size: 0.875rem;
          margin-bottom: 1rem;
          text-align: left;
          background: rgba(229, 62, 62, 0.1);
          padding: 0.75rem;
          border-radius: 8px;
          border-left: 4px solid #e53e3e;
        }

        .login-button {
          width: 100%;
          background-color: var(--color-accent, #3182ce);
          color: white;
          padding: 0.875rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(49, 130, 206, 0.2);
        }

        .login-button:hover:not(:disabled) {
          background-color: #2c5282;
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(49, 130, 206, 0.3);
        }

        .login-button:disabled {
          background-color: #a0aec0;
          cursor: not-allowed;
          transform: none;
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
          color: var(--color-muted, #a0aec0);
          font-size: 1.1rem;
          padding: 0.25rem;
          border-radius: 4px;
          transition: color 0.3s ease;
        }

        .password-toggle:hover {
          color: var(--color-foreground, #2d3748);
        }

        small {
          margin-top: 0.25rem;
          color: var(--color-muted, #718096);
          font-size: 0.8rem;
        }

        /* Loading Overlay */
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(11, 25, 44, 0.95);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          color: white;
        }

        .spinner-icon {
          font-size: 3rem;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-spinner p {
          color: white;
          font-size: 1.2rem;
          margin: 0;
        }

        .debug-info {
          margin-top: 1rem;
          padding: 1rem;
          background: rgba(0, 0, 0, 0.05);
          border-radius: 8px;
          font-size: 0.8rem;
          color: #718096;
        }

        @media (max-width: 480px) {
          .login-form {
            padding: 2rem 1.5rem;
            margin: 1rem;
          }
        }
      `}</style>

      <div className="login-form">
        <h2><FaBookOpen /> Bibliotecando</h2>
        <p>Faça login para acessar a plataforma</p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>E-mail:</label>
            <input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
            <small>Utilize: <strong>adm@gmail.com</strong></small>
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
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <small>Utilize: <strong>L!vr0$V00@2025</strong></small>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="login-button" 
            disabled={isLoading}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="debug-info">
          <strong>Debug:</strong> Conectando em {API_URL}/api/login
        </div>
      </div>
    </div>
  );
};

export default Login;