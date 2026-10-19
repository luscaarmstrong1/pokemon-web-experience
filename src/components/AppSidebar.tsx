import React from 'react';
import { NavLink } from 'react-router-dom';

interface Props {
  paginaAtual?: 'pokedex' | 'arena' | 'tipos' | 'quiz' | 'safari' | 'offline';
}

export const AppSidebar: React.FC<Props> = () => {
  return (
    <aside className="app-sidebar" aria-label="Navegação Principal do Sistema">
      {/* 1. Brand Logo & Creator Signature */}
      <div className="sidebar-brand">
        <div className="pokeball-badge">
          <div className="pokeball-core">
            <div className="pokeball-button" />
          </div>
          <div className="pokeball-orbit" />
        </div>
        <div className="creator-badge" title="Desenvolvido por Lucas Armstrong (luscaarmstrong)">
          <span className="creator-pulse" />
          <span className="creator-text">luscaarmstrong</span>
        </div>
      </div>

      {/* 2. Menu de Módulos Vertical */}
      <nav className="sidebar-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `sidebar-btn ${isActive ? 'active' : ''}`}
          title="Pokédex Nacional"
        >
          <span className="sidebar-icon">📖</span>
          <span className="sidebar-label">Pokédex</span>
          <div className="sidebar-indicator" />
        </NavLink>

        <NavLink
          to="/arena"
          className={({ isActive }) => `sidebar-btn ${isActive ? 'active' : ''}`}
          title="Arena de Batalha"
        >
          <span className="sidebar-icon">⚔️</span>
          <span className="sidebar-label">Arena</span>
          <div className="sidebar-indicator" />
        </NavLink>

        <NavLink
          to="/tipos"
          className={({ isActive }) => `sidebar-btn ${isActive ? 'active' : ''}`}
          title="Tabela de Tipos & Análise"
        >
          <span className="sidebar-icon">🛡️</span>
          <span className="sidebar-label">Tipos</span>
          <div className="sidebar-indicator" />
        </NavLink>

        <NavLink
          to="/quiz"
          className={({ isActive }) => `sidebar-btn ${isActive ? 'active' : ''}`}
          title="Quiz Pokémon"
        >
          <span className="sidebar-icon">❓</span>
          <span className="sidebar-label">Quiz</span>
          <div className="sidebar-indicator" />
        </NavLink>

        <NavLink
          to="/safari"
          className={({ isActive }) => `sidebar-btn ${isActive ? 'active' : ''}`}
          title="Zona Safari RPG"
        >
          <span className="sidebar-icon">🌿</span>
          <span className="sidebar-label">Safari</span>
          <div className="sidebar-indicator" />
        </NavLink>

        <NavLink
          to="/offline"
          className={({ isActive }) => `sidebar-btn ${isActive ? 'active' : ''}`}
          title="Central Offline & PWA"
        >
          <span className="sidebar-icon">⚡</span>
          <span className="sidebar-label">Offline</span>
          <div className="sidebar-indicator" />
        </NavLink>
      </nav>

      <style>{`
        .app-sidebar {
          position: absolute;
          left: 12px;
          top: 14px;
          bottom: 14px;
          width: 66px;
          background: rgba(14, 19, 31, 0.92);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 14px 6px;
          box-sizing: border-box;
          z-index: 100;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(0, 240, 255, 0.12);
          transition: width 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
          overflow: hidden;
        }

        .sidebar-brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          margin-bottom: 22px;
          flex-shrink: 0;
        }

        .pokeball-badge {
          position: relative;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pokeball-core {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(#FF334B 0 46%, #0B0E14 46% 54%, #FFFFFF 54%);
          border: 2px solid #0B0E14;
          box-shadow: 0 0 18px rgba(255, 51, 75, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pokeball-button {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 2px solid #0B0E14;
          box-shadow: 0 0 6px rgba(255, 255, 255, 0.9);
        }
        .pokeball-orbit {
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          border: 1px dashed rgba(0, 240, 255, 0.4);
          animation: orbit-spin 20s linear infinite;
        }
        @keyframes orbit-spin {
          to { transform: rotate(360deg); }
        }

        .creator-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 3px;
          font-size: 7.5px;
          font-weight: 800;
          letter-spacing: .02em;
          color: #00F0FF;
          background: rgba(0, 240, 255, 0.08);
          border: 1px solid rgba(0, 240, 255, 0.3);
          padding: 2px 4px;
          border-radius: 999px;
          max-width: 58px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .creator-pulse {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #00F0FF;
          box-shadow: 0 0 6px #00F0FF;
          animation: pulse-dot 2s ease-in-out infinite;
          flex-shrink: 0;
        }
        .creator-text {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* Nav Vertical */
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
          align-items: center;
          flex: 1;
        }

        .sidebar-btn {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
          text-decoration: none;
          color: #94A3B8;
          transition: all 0.2s cubic-bezier(0.2, 0.8, 0.4, 1);
          cursor: pointer;
        }

        .sidebar-icon {
          font-size: 19px;
          line-height: 1;
          filter: drop-shadow(0 2px 6px rgba(0,0,0,0.5));
          transition: transform 0.2s ease;
        }

        .sidebar-label {
          font-size: 8.5px;
          font-weight: 800;
          letter-spacing: .04em;
          margin-top: 3px;
          color: inherit;
          text-transform: uppercase;
        }

        .sidebar-indicator {
          position: absolute;
          left: -6px;
          top: 50%;
          transform: translateY(-50%) scaleY(0);
          width: 4px;
          height: 24px;
          background: #FFCB05;
          border-radius: 0 4px 4px 0;
          box-shadow: 0 0 10px #FFCB05;
          transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.4, 1);
        }

        .sidebar-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #FFFFFF;
          border-color: rgba(0, 240, 255, 0.3);
          transform: translateY(-1px);
        }
        .sidebar-btn:hover .sidebar-icon {
          transform: scale(1.15);
        }

        .sidebar-btn.active {
          background: linear-gradient(135deg, rgba(255, 203, 5, 0.18), rgba(255, 222, 89, 0.08));
          border-color: #FFCB05;
          color: #FFCB05;
          box-shadow: 0 0 20px rgba(255, 203, 5, 0.3), inset 0 0 12px rgba(255, 203, 5, 0.1);
        }
        .sidebar-btn.active .sidebar-label {
          color: #FFFFFF;
          font-weight: 900;
        }
        .sidebar-btn.active .sidebar-indicator {
          transform: translateY(-50%) scaleY(1);
        }
      `}</style>
    </aside>
  );
};
