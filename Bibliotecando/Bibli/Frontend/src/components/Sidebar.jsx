import { Nav } from "react-bootstrap";
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
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useState } from "react";

const Sidebar = () => {
  const [showMovimentacoes, setShowMovimentacoes] = useState(false);

  return (
    <div className="sidebar">
      {/* Cabeçalho */}
      <div className="sidebar-header">
        <div className="header-content">
          <div className="title-wrapper d-flex align-items-center">
            <h4>Bibliotecando</h4>
          </div>
          <p className="system-description">
            Solução integrada para bibliotecas
          </p>
        </div>
      </div>

      {/* Menu */}
      <Nav className="flex-column mt-3">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `nav-link py-3 ${isActive ? "active" : ""}`
          }
        >
          <FaHome className="me-2" />
          Home
        </NavLink>

        {/* Seção Cadastros */}
        <div className="sidebar-section-title mt-3 mb-2 ps-3 text-uppercase small text-muted">
          Cadastros
        </div>
        <NavLink
          to="/cadastros"
          className={({ isActive }) =>
            `nav-link py-3 ${isActive ? "active" : ""}`
          }
        >
          <FaClipboardList className="me-2" />
          Cadastros
        </NavLink>

        {/* Seção Acervo */}
        <div className="sidebar-section-title mt-3 mb-2 ps-3 text-uppercase small text-muted">
          Acervo
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
          {showMovimentacoes ? (
            <FaChevronUp size={12} />
          ) : (
            <FaChevronDown size={12} />
          )}
        </div>

        {showMovimentacoes && (
          <div className="submenu ps-4">
            <NavLink
              to="/entrada"
              className={({ isActive }) =>
                `nav-link py-2 ${isActive ? "active" : ""}`
              }
            >
              <FaDoorOpen className="me-2" />
              Entrada
            </NavLink>
            <NavLink
              to="/saida"
              className={({ isActive }) =>
                `nav-link py-2 ${isActive ? "active" : ""}`
              }
            >
              <FaSignOutAlt className="me-2" />
              Saída
            </NavLink>
            <NavLink
              to="/reservas"
              className={({ isActive }) =>
                `nav-link py-2 ${isActive ? "active" : ""}`
              }
            >
              <FaCalendarAlt className="me-2" />
              Reservas
            </NavLink>
            <NavLink
              to="/emprestimos"
              className={({ isActive }) =>
                `nav-link py-2 ${isActive ? "active" : ""}`
              }
            >
              <FaHandshake className="me-2" />
              Empréstimos
            </NavLink>
            <NavLink
              to="/renovacoes"
              className={({ isActive }) =>
                `nav-link py-2 ${isActive ? "active" : ""}`
              }
            >
              <FaSyncAlt className="me-2" />
              Renovações
            </NavLink>
            <NavLink
              to="/devolucoes"
              className={({ isActive }) =>
                `nav-link py-2 ${isActive ? "active" : ""}`
              }
            >
              <FaReply className="me-2" />
              Devoluções
            </NavLink>
          </div>
        )}

        {/* Seção Relatórios */}
        <div className="sidebar-section-title mt-3 mb-2 ps-3 text-uppercase small text-muted">
          Relatórios
        </div>
        <NavLink
          to="/relatorios"
          className={({ isActive }) =>
            `nav-link py-3 ${isActive ? "active" : ""}`
          }
        >
          <FaChartBar className="me-2" />
          Relatórios
        </NavLink>

        {/* Seção Sistema */}
        <div className="sidebar-section-title mt-3 mb-2 ps-3 text-uppercase small text-muted">
          Sistema
        </div>
        <NavLink
          to="/sobre"
          className={({ isActive }) =>
            `nav-link py-3 ${isActive ? "active" : ""}`
          }
        >
          <FaQuestionCircle className="me-2" />
          Sobre
        </NavLink>
      </Nav>
    </div>
  );
};

export default Sidebar;
