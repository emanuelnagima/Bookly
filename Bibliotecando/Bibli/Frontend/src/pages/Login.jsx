import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBookOpen, FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const ADMIN_CREDENTIALS = {
    email: 'adm@gmail.com',
    password: 'adm123'
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Digite um e-mail válido');
      return;
    }

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setIsLoading(true);
      
      // Simula um carregamento de 4 segundos
      setTimeout(() => {
        const expirationTime = new Date().getTime() + 60 * 60 * 1000; // 1 hora
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('loginExpires', expirationTime.toString());
        setIsLoading(false);
        navigate('/');
      }, 4000);
    } else {
      setError('Credenciais inválidas');
    }
  };

  // Fundo animado de partículas
  useEffect(() => {
    const canvas = canvasRef.current;
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
        }

        .bg-canvas {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 0;
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
          margin-bottom: 2rem;
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

        .error-message {
          color: #ca1313;
          font-size: 0.875rem;
          margin-bottom: 1rem;
          text-align: left;
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

        .login-button:hover {
          background-color: #372ee0;
          transform: translateY(-2px);
          box-shadow: var(--shadow-card-hover);
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

        small {
          margin-top: 0.25rem;
          color: var(--color-muted);
        }

        /* Loading Overlay */
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(11, 25, 44, 0.9);
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

        @media (max-width: 480px) {
          .login-form {
            padding: 2rem 1.5rem;
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
            />
            <small>Utilize: <strong>{ADMIN_CREDENTIALS.email}</strong></small>
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
            <small>Utilize: <strong>{ADMIN_CREDENTIALS.password}</strong></small>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Carregando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;