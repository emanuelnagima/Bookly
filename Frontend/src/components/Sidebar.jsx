import { Nav } from "react-bootstrap";
import avatarImg from '../images/avatar.png';
import {
  FaHome,
  FaReply,
  FaChartBar,
  FaCalendarAlt,
  FaSyncAlt,
  FaTasks,
  FaDoorOpen,
  FaSignOutAlt,
  FaClipboardList,
  FaChevronDown,
  FaChevronUp,
  FaHandshake,
  FaQuestionCircle,
  FaBook,
  FaUserTie,
  FaUserGraduate,
  FaPenFancy,
  FaBuilding,
  FaUserAlt,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

// Defina as credenciais diretamente neste arquivo
const ADMIN_CREDENTIALS = {
  email: 'adm@gmail.com',
  password: 'L!vr0$V00@2025'
};

const Sidebar = () => {
  const [showCadastros, setShowCadastros] = useState(false);
  const [showMovimentacoes, setShowMovimentacoes] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  return (
    <div className="sidebar">
      {/* Cabeçalho com logo */}
      <div className="sidebar-header">
        <div className="header-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.2rem' }}>
          {/* Título */}
          <h4 style={{
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 600,
            fontSize: '1.5rem',
            color: '#fff',
            margin: 0,
            letterSpacing: '-2.2px',
          }}>
            Bookly
          </h4>
          {/* Descrição */}
          <p className="system-description" style={{
            fontSize: '0.8rem',
            color: '#b0b0b0',
            margin: 0,
          }}>
            Solução integrada para bibliotecas
          </p>
        </div>
      </div>

      {/* Menu */}
      <Nav className="flex-column mt-3">
        <NavLink to="/" className={({ isActive }) => `nav-link py-3 ${isActive ? "active" : ""}`}>
          <FaHome className="me-2" />
          Home
        </NavLink>

        {/* Cadastros */}
        <div className="sidebar-section-title mt-3 mb-2 ps-3 text-uppercase small text-muted">
          Gestão
        </div>
        <div
          className="nav-link py-3 d-flex justify-content-between align-items-center"
          onClick={() => setShowCadastros(!showCadastros)}
          style={{ cursor: "pointer" }}
        >
          <div>
            <FaClipboardList className="me-2" />
            Cadastros
          </div>
          {showCadastros ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
        </div>

        {showCadastros && (
          <div className="submenu ps-4">
            <div className="sidebar-section-title mt-3 mb-2 ps-3 text-uppercase small text-muted">
              Pessoas
            </div>
            <NavLink to="/usuarios-especiais" className="nav-link py-2">
              <FaUserAlt className="me-2" />
              Usuários
            </NavLink>
            <NavLink to="/professores" className="nav-link py-2">
              <FaUserTie className="me-2" />
              Professores
            </NavLink>
            <NavLink to="/alunos" className="nav-link py-2">
              <FaUserGraduate className="me-2" />
              Alunos
            </NavLink>

            <div className="sidebar-section-title mt-3 mb-2 ps-3 text-uppercase small text-muted">
              Acervo
            </div>
            <NavLink to="/livros" className="nav-link py-2">
              <FaBook className="me-2" />
              Livros
            </NavLink>
            <NavLink to="/autores" className="nav-link py-2">
              <FaPenFancy className="me-2" />
              Autores
            </NavLink>
            <NavLink to="/editoras" className="nav-link py-2">
              <FaBuilding className="me-2" />
              Editoras
            </NavLink>
          </div>
        )}

        {/* Movimentações */}
        <div className="sidebar-section-title mt-3 mb-2 ps-3 text-uppercase small text-muted">
          Movimentações
        </div>
        <div
          className="nav-link py-3 d-flex justify-content-between align-items-center"
          onClick={() => setShowMovimentacoes(!showMovimentacoes)}
          style={{ cursor: "pointer" }}
        >
          <div>
            <FaTasks className="me-2" />
            Movimentações
          </div>
          {showMovimentacoes ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
        </div>

        {showMovimentacoes && (
          <div className="submenu ps-4">
            <NavLink to="/entrada" className="nav-link py-2">
              <FaDoorOpen className="me-2" />
              Entrada
            </NavLink>
            <NavLink to="/saida" className="nav-link py-2">
              <FaSignOutAlt className="me-2" />
              Saída
            </NavLink>
            <NavLink to="/reservas" className="nav-link py-2">
              <FaCalendarAlt className="me-2" />
              Reservas
            </NavLink>
            <NavLink to="/emprestimos" className="nav-link py-2">
              <FaHandshake className="me-2" />
              Empréstimos
            </NavLink>
            <NavLink to="/renovacoes" className="nav-link py-2">
              <FaSyncAlt className="me-2" />
              Renovações
            </NavLink>
            <NavLink to="/devolucoes" className="nav-link py-2">
              <FaReply className="me-2" />
              Devoluções
            </NavLink>
          </div>
        )}

        {/* Relatórios */}
        <div className="sidebar-section-title mt-3 mb-2 ps-3 text-uppercase small text-muted">
          Relatórios
        </div>
        <NavLink to="/relatorios" className="nav-link py-3">
          <FaChartBar className="me-2" />
          Relatórios
        </NavLink>

        {/* Sistema */}
        <div className="sidebar-section-title mt-3 mb-2 ps-3 text-uppercase small text-muted">
          Sistema
        </div>
        <NavLink to="/sobre" className="nav-link py-3">
          <FaQuestionCircle className="me-2" />
          Sobre
        </NavLink>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="nav-link py-3 text-start"
          style={{ cursor: "pointer", color: "#ff6b6b", width: '100%' }}
        >
          <FaSignOutAlt className="me-2" />
          Sair
        </button>
        
        {/* Área do perfil do usuário */}
        <div className="user-profile-section p-3 mb-3">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {/* Imagem ícone */}
            <img 
              src={avatarImg} 
              alt="Foto do Bibliotecário" 
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #ffffff'
              }}
            />
            <div style={{ textAlign: 'left' }}>
              <h6 style={{ color: '#ffffff', margin: '0 0 3px 0', fontWeight: '600', fontSize: '0.95rem' }}>
                Bibliotecário
              </h6>
              <p style={{ 
                color: '#b0b0b0', 
                fontSize: '0.75rem', 
                margin: '0',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <FaUserAlt size={10} />
                {ADMIN_CREDENTIALS.email} {/* Email puxado das credenciais */}
              </p>
            </div>
          </div>
        </div>
      </Nav>
    </div>
  );
};

export default Sidebar;