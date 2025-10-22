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
  FaUsers,
  FaHandshake,
  FaQuestionCircle,
  FaBook,
  FaUserTie,
  FaUserGraduate,
  FaGraduationCap,
  FaPenFancy,
  FaFeatherAlt,
  FaBuilding,
  FaUserAlt,
  FaBars,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth"; // IMPORTE O USE AUTH
import "../css/Sidebar.css";

const Sidebar = () => {
  const [showCadastros, setShowCadastros] = useState(false);
  const [showMovimentacoes, setShowMovimentacoes] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  
  // USE O HOOK DE AUTENTICAÇÃO
  const { user, logout } = useAuth();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Overlay para mobile */}
      <div
        className={`sidebar-overlay ${sidebarOpen && isMobile ? 'mobile-open' : ''}`}
        onClick={closeSidebar}
      />

      {/* Botão hamburger para mobile */}
      <button
        className="sidebar-toggle"
        onClick={toggleSidebar}
      >
        <FaBars size={20} />
      </button>

      <div className={`sidebar-modern ${sidebarOpen ? 'mobile-open' : ''}`}>
        {/* Header */}
        <div className="sidebar-header-modern">
          <div className="header-content-modern">
            <div className="logo-container">
              <div className="logo-text">
                <h4 className="logo-title">Bookly</h4>
                <p className="system-description">Sistema de Gestão Bibliotecária</p>
                <p className="system-version">v1.0.0 em desenvolvimento</p>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Principal */}
        <div className="sidebar-menu">
          <Nav className="flex-column">
            {/* Home */}
            <NavLink
              to="/"
              className={({ isActive }) => `nav-link-modern ${isActive ? "active" : ""}`}
              onClick={closeSidebar}
            >
              <div className="nav-icon">
                <FaHome />
              </div>
              <span className="nav-text">Home</span>
            </NavLink>

            {/* Seção Gestão */}
            <div className="menu-section">
              <div className="section-divider"></div>
              <span className="section-title">Gestão</span>
            </div>

            {/* Cadastros - Accordion */}
            <div className="accordion-item">
              <div
                className={`accordion-header ${showCadastros ? 'open' : ''}`}
                onClick={() => setShowCadastros(!showCadastros)}
              >
                <div className="accordion-trigger">
                  <div className="nav-icon">
                    <FaClipboardList />
                  </div>
                  <span className="nav-text">Cadastros</span>
                </div>
                <div className="accordion-arrow">
                  {showCadastros ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                </div>
              </div>

              {showCadastros && (
                <div className="accordion-content">
                  {/* Subseção Pessoas */}
                  <div className="submenu-section">
                    <span className="submenu-title">Pessoas</span>
                  </div>

                  <NavLink to="/usuarios-especiais" className="submenu-link" onClick={closeSidebar}>
                    <div className="nav-icon small">
                      <FaUsers />
                    </div>
                    <span>Usuários</span>
                  </NavLink>

                  <NavLink to="/professores" className="submenu-link" onClick={closeSidebar}>
                    <div className="nav-icon small">
                      <FaUserTie />
                    </div>
                    <span>Professores</span>
                  </NavLink>

                  <NavLink to="/alunos" className="submenu-link" onClick={closeSidebar}>
                    <div className="nav-icon small">
                      <FaGraduationCap />
                    </div>
                    <span>Alunos</span>
                  </NavLink>

                  {/* Subseção Acervo */}
                  <div className="submenu-section">
                    <span className="submenu-title">Acervo</span>
                  </div>

                  <NavLink to="/livros" className="submenu-link" onClick={closeSidebar}>
                    <div className="nav-icon small">
                      <FaBook />
                    </div>
                    <span>Livros</span>
                  </NavLink>

                  <NavLink to="/autores" className="submenu-link" onClick={closeSidebar}>
                    <div className="nav-icon small">
                      <FaFeatherAlt />
                    </div>
                    <span>Autores</span>
                  </NavLink>

                  <NavLink to="/editoras" className="submenu-link" onClick={closeSidebar}>
                    <div className="nav-icon small">
                      <FaBuilding />
                    </div>
                    <span>Editoras</span>
                  </NavLink>
                </div>
              )}
            </div>

            {/* Seção Movimentações */}
            <div className="menu-section">
              <div className="section-divider"></div>
              <span className="section-title">Movimentações</span>
            </div>

            {/* Movimentações - Accordion */}
            <div className="accordion-item">
              <div
                className={`accordion-header ${showMovimentacoes ? 'open' : ''}`}
                onClick={() => setShowMovimentacoes(!showMovimentacoes)}
              >
                <div className="accordion-trigger">
                  <div className="nav-icon">
                    <FaTasks />
                  </div>
                  <span className="nav-text">Movimentações</span>
                </div>
                <div className="accordion-arrow">
                  {showMovimentacoes ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                </div>
              </div>

              {showMovimentacoes && (
                <div className="accordion-content">
                  <NavLink to="/entrada" className="submenu-link" onClick={closeSidebar}>
                    <div className="nav-icon small">
                      <FaDoorOpen />
                    </div>
                    <span>Entrada</span>
                  </NavLink>

                  <NavLink to="/saida" className="submenu-link" onClick={closeSidebar}>
                    <div className="nav-icon small">
                      <FaSignOutAlt />
                    </div>
                    <span>Saída</span>
                  </NavLink>

                  <NavLink to="/reservas" className="submenu-link" onClick={closeSidebar}>
                    <div className="nav-icon small">
                      <FaCalendarAlt />
                    </div>
                    <span>Reservas</span>
                  </NavLink>

                  <NavLink to="/emprestimos" className="submenu-link" onClick={closeSidebar}>
                    <div className="nav-icon small">
                      <FaHandshake />
                    </div>
                    <span>Empréstimos</span>
                  </NavLink>

                  <NavLink to="/renovacoes" className="submenu-link" onClick={closeSidebar}>
                    <div className="nav-icon small">
                      <FaSyncAlt />
                    </div>
                    <span>Renovações</span>
                  </NavLink>

                  <NavLink to="/devolucoes" className="submenu-link" onClick={closeSidebar}>
                    <div className="nav-icon small">
                      <FaReply />
                    </div>
                    <span>Devoluções</span>
                  </NavLink>
                </div>
              )}
            </div>

            {/* Seção Relatórios */}
            <div className="menu-section">
              <div className="section-divider"></div>
              <span className="section-title">Relatórios</span>
            </div>

            <NavLink to="/relatorios" className="nav-link-modern" onClick={closeSidebar}>
              <div className="nav-icon">
                <FaChartBar />
              </div>
              <span className="nav-text">Relatórios</span>
            </NavLink>

            {/* Seção Sistema */}
            <div className="menu-section">
              <div className="section-divider"></div>
              <span className="section-title">Sistema</span>
            </div>

            <NavLink to="/sobre" className="nav-link-modern" onClick={closeSidebar}>
              <div className="nav-icon">
                <FaQuestionCircle />
              </div>
              <span className="nav-text">Sobre</span>
            </NavLink>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="nav-link-modern logout-btn"
            >
              <div className="nav-icon">
                <FaSignOutAlt />
              </div>
              <span className="nav-text">Sair</span>
            </button>
          </Nav>
        </div>

        {/* User Profile - ATUALIZADO COM DADOS REAIS DO USUÁRIO */}
        <div className="user-profile-modern">
          <div className="user-info">
            <div className="avatar-container">
              <img
                src={avatarImg}
                alt="Foto do Usuário"
                className="user-avatar"
              />
              <div className="online-indicator"></div>
            </div>
            <div className="user-details">
              <h6 className="user-name">
                {user ? user.email : 'Usuário'}
              </h6>
              <p className="user-role">
                <FaUserAlt size={10} />
                {user ? user.role : 'Carregando...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;