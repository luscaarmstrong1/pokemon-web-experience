import React from 'react';
import { NavLink } from 'react-router-dom';

interface Props {
  paginaAtual: 'pokedex' | 'arena' | 'tipos' | 'quiz' | 'safari' | 'offline';
  titulo?: string;
  subtitulo?: string;
  totalPokemon?: number;
  centerContent?: React.ReactNode;
}

export const AppHeader: React.FC<Props> = ({
  paginaAtual,
  titulo,
  subtitulo,
  totalPokemon,
  centerContent,
}) => {
  return (
    <header className="app-header-unified">
      {/* 1. Brand Logo & Creator Signature (Esquerda) */}
      <div className="header-brand">
        <div className="pokeball-badge">
          <div className="pokeball-core">
            <div className="pokeball-button" />
          </div>
          <div className="pokeball-orbit" />
        </div>

        <div className="brand-text">
          <div className="brand-title-row">
            <span className="brand-name">POKÉDEX</span>
            <div className="creator-badge" title="Desenvolvido por Lucas Armstrong (luscaarmstrong)">
              <span className="creator-pulse" />
              <span className="creator-text">luscaarmstrong</span>
            </div>
          </div>
          <span className="brand-sub">
            {totalPokemon !== undefined ? (
              <><b>{totalPokemon.toLocaleString('pt-BR')}</b> POKÉMON · GEN 1–9</>
            ) : (
              'ADVANCED WEB PLATFORM'
            )}
          </span>
        </div>
      </div>

      {/* 2. Navegador Central de Módulos (Centro) */}
      <div className="header-center-area">
        <nav className="header-nav" aria-label="Navegação Principal">
          <NavLink to="/" end className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">📖</span>
            <span>Pokédex</span>
          </NavLink>
          <NavLink to="/arena" className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">⚔️</span>
            <span>Arena</span>
          </NavLink>
          <NavLink to="/tipos" className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">🛡️</span>
            <span>Tipos</span>
          </NavLink>
          <NavLink to="/quiz" className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">❓</span>
            <span>Quiz</span>
          </NavLink>
          <NavLink to="/safari" className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">🌿</span>
            <span>Safari</span>
          </NavLink>
          <NavLink to="/offline" className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">⚡</span>
            <span>Offline</span>
          </NavLink>
        </nav>
        {centerContent && <div className="header-custom-center">{centerContent}</div>}
      </div>

      {/* 3. Título do Módulo Atual e Status (Direita) */}
      <div className="header-context">
        {titulo && <b className="context-title">{titulo}</b>}
        {subtitulo && <span className="context-subtitle">{subtitulo}</span>}
      </div>

      <style>{`
        .app-header-unified {
          position: absolute;
          left: 16px;
          right: 16px;
          top: 12px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 50;
          pointer-events: auto;
        }

        /* Marca Esquerda */
        .header-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .pokeball-badge {
          position: relative;
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pokeball-core {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: linear-gradient(#FF334B 0 46%, #0B0E14 46% 54%, #FFFFFF 54%);
          border: 2px solid #0B0E14;
          box-shadow: 0 0 16px rgba(255, 51, 75, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
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
          border: 1px dashed rgba(0, 240, 255, 0.35);
          animation: orbit-spin 20s linear infinite;
        }
        @keyframes orbit-spin {
          to { transform: rotate(360deg); }
        }

        .brand-text {
          display: flex;
          flex-direction: column;
        }
        .brand-title-row {
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .brand-name {
          font-size: 16px;
          font-weight: 900;
          letter-spacing: .18em;
          background: linear-gradient(135deg, #FFFFFF 30%, #CBD5E1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1;
        }
        .creator-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 8.5px;
          font-weight: 800;
          letter-spacing: .06em;
          color: #00F0FF;
          background: rgba(0, 240, 255, 0.08);
          border: 1px solid rgba(0, 240, 255, 0.3);
          padding: 1px 6px;
          border-radius: 999px;
          box-shadow: 0 0 10px rgba(0, 240, 255, 0.15);
          text-transform: lowercase;
        }
        .creator-pulse {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #00F0FF;
          box-shadow: 0 0 5px #00F0FF;
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
        }
        .brand-sub {
          font-size: 9px;
          font-weight: 700;
          color: #8A93A3;
          letter-spacing: .06em;
          margin-top: 2px;
        }

        /* 2. Menu Central */
        .header-center-area {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .header-custom-center {
          display: flex;
          align-items: center;
        }
        .header-nav {
          display: flex;
          align-items: center;
          gap: 3px;
          background: rgba(14, 19, 31, 0.85);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 999px;
          padding: 3px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.45);
        }
        .nav-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          height: 28px;
          padding: 0 11px;
          border-radius: 999px;
          font-size: 10.5px;
          font-weight: 700;
          color: #94A3B8;
          text-decoration: none;
          transition: all .2s cubic-bezier(0.2, 0.8, 0.4, 1);
          white-space: nowrap;
        }
        .nav-icon {
          font-size: 10px;
        }
        .nav-btn:hover {
          color: #FFFFFF;
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-1px);
        }
        .nav-btn.active {
          background: linear-gradient(135deg, #FFDE59, #FFCB05);
          color: #0B0E14;
          font-weight: 900;
          box-shadow: 0 0 16px rgba(255, 203, 5, 0.45);
        }

        /* 3. Título do Contexto */
        .header-context {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          flex-shrink: 0;
          text-align: right;
        }
        .context-title {
          font-size: 16px;
          font-weight: 900;
          letter-spacing: .2em;
          color: #FFFFFF;
          line-height: 1.1;
        }
        .context-subtitle {
          font-size: 9.5px;
          font-weight: 700;
          color: #8A93A3;
          letter-spacing: .08em;
          margin-top: 2px;
        }
      `}</style>
    </header>
  );
};
