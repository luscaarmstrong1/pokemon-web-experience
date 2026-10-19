import React from 'react';
import { NavLink } from 'react-router-dom';

interface Props {
  totalPokemon?: number;
}

export const TopNavigation: React.FC<Props> = ({ totalPokemon }) => {
  return (
    <>
      {/* Navegador das páginas no topo esquerdo (posição 16, 12, 332, 30) */}
      <nav className="pk-nav">
        <NavLink to="/" end className={({ isActive }) => `pk-nav-item ${isActive ? 'active' : ''}`}>
          Pokédex
        </NavLink>
        <NavLink to="/arena" className={({ isActive }) => `pk-nav-item ${isActive ? 'active' : ''}`}>
          Arena
        </NavLink>
        <NavLink to="/tipos" className={({ isActive }) => `pk-nav-item ${isActive ? 'active' : ''}`}>
          Tipos
        </NavLink>
        <NavLink to="/quiz" className={({ isActive }) => `pk-nav-item ${isActive ? 'active' : ''}`}>
          Quiz
        </NavLink>
        <NavLink to="/safari" className={({ isActive }) => `pk-nav-item ${isActive ? 'active' : ''}`}>
          Safari
        </NavLink>
        <NavLink to="/offline" className={({ isActive }) => `pk-nav-item ${isActive ? 'active' : ''}`}>
          Offline
        </NavLink>
      </nav>

      {/* Marca Pokédex (posição 24, 48, 320, 40) */}
      <div className="mk">
        <div className="mk-ball" />
        <div className="mk-txt">
          <b>POKÉDEX</b>
          <span>{totalPokemon !== undefined ? `${totalPokemon.toLocaleString('pt-BR')} Pokémon encontrados` : 'Carregando...'}</span>
        </div>
      </div>

      <style>{`
        .pk-nav {
          position: absolute;
          left: 16px;
          top: 12px;
          width: 332px;
          height: 30px;
          display: flex;
          align-items: center;
          gap: 4px;
          z-index: 20;
        }
        .pk-nav-item {
          flex: 1;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #1A2030;
          border: 1px solid #283041;
          border-radius: 999px;
          color: #C9CFDA;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .05em;
          text-decoration: none;
          transition: all .15s ease;
        }
        .pk-nav-item:hover {
          background: #252D40;
          border-color: #FFFFFF;
          color: #FFFFFF;
        }
        .pk-nav-item.active {
          background: #FFCB05;
          border-color: #FFCB05;
          color: #11151D;
          font-weight: 900;
          box-shadow: 0 0 12px rgba(255,203,5,.35);
        }

        .mk {
          position: absolute;
          left: 24px;
          top: 48px;
          width: 320px;
          height: 40px;
          display: flex;
          align-items: center;
          gap: 12px;
          z-index: 20;
        }
        .mk-ball {
          position: relative;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(#E3350D 0 46%, #15171C 46% 56%, #F2F2F2 56%);
          border: 2px solid #15171C;
          box-shadow: 0 0 20px rgba(227,53,13,.45);
          animation: balanca 3.5s ease-in-out infinite;
        }
        .mk-ball::after {
          content: '';
          position: absolute;
          width: 9px;
          height: 9px;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: #F2F2F2;
          border: 2px solid #15171C;
        }
        .mk-txt b {
          display: block;
          font-size: 20px;
          font-weight: 900;
          letter-spacing: .20em;
          color: #fff;
          line-height: 1.1;
        }
        .mk-txt span {
          font-size: 11px;
          font-weight: 600;
          color: #8A93A3;
        }
        @keyframes balanca {
          0%, 70%, 100% { transform: rotate(0); }
          75% { transform: rotate(-14deg); }
          80% { transform: rotate(12deg); }
          85% { transform: rotate(-8deg); }
          90% { transform: rotate(4deg); }
        }
      `}</style>
    </>
  );
};
