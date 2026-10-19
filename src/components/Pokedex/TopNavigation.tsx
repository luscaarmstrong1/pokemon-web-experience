import React from 'react';
import { NavLink } from 'react-router-dom';

interface Props {
  totalPokemon?: number;
}

export const TopNavigation: React.FC<Props> = ({ totalPokemon }) => {
  return (
    <>
      {/* Navegador das páginas no topo esquerdo com visual moderno */}
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

      {/* Marca Pokédex com badge exclusiva de engenharia luscaarmstrong */}
      <div className="mk">
        <div className="mk-ball">
          <div className="mk-ball-pulse" />
        </div>
        <div className="mk-txt">
          <div className="mk-tit-linha">
            <b>POKÉDEX</b>
            <div className="badge-eng">
              <span className="badge-dot" />
              <span>luscaarmstrong</span>
            </div>
          </div>
          <span className="mk-sub">
            {totalPokemon !== undefined ? (
              <>
                <b style={{ color: '#fff' }}>{totalPokemon.toLocaleString('pt-BR')}</b> Pokémon catalogados · Gen 1 a 9
              </>
            ) : (
              'Carregando dados...'
            )}
          </span>
        </div>
      </div>

      <style>{`
        .pk-nav {
          position: absolute;
          left: 16px;
          top: 12px;
          width: 332px;
          height: 32px;
          display: flex;
          align-items: center;
          gap: 4px;
          z-index: 20;
          background: rgba(14, 19, 31, 0.65);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 999px;
          padding: 2px;
        }
        .pk-nav-item {
          flex: 1;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          color: #94A3B8;
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: .04em;
          text-decoration: none;
          transition: all .2s ease;
        }
        .pk-nav-item:hover {
          color: #FFFFFF;
          background: rgba(255, 255, 255, 0.06);
        }
        .pk-nav-item.active {
          background: linear-gradient(135deg, #FFDE59, #FFCB05);
          color: #0B0E14;
          font-weight: 900;
          box-shadow: 0 0 14px rgba(255, 203, 5, 0.45);
        }

        .mk {
          position: absolute;
          left: 20px;
          top: 48px;
          width: 332px;
          height: 44px;
          display: flex;
          align-items: center;
          gap: 12px;
          z-index: 20;
        }
        .mk-ball {
          position: relative;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(#FF3B30 0 46%, #0B0E14 46% 56%, #F8FAFC 56%);
          border: 2px solid #0B0E14;
          box-shadow: 0 0 24px rgba(255, 59, 48, 0.5), inset 0 0 4px rgba(255,255,255,0.4);
          animation: balanca 4s ease-in-out infinite;
        }
        .mk-ball::after {
          content: '';
          position: absolute;
          width: 10px;
          height: 10px;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: #FFFFFF;
          border: 2px solid #0B0E14;
          box-shadow: 0 0 6px rgba(255,255,255,0.9);
        }
        .mk-ball-pulse {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 1px solid rgba(255, 59, 48, 0.35);
          animation: pulsa 2.5s infinite;
        }
        .mk-txt {
          display: flex;
          flex-direction: column;
        }
        .mk-tit-linha {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .mk-tit-linha b {
          font-size: 21px;
          font-weight: 900;
          letter-spacing: .22em;
          background: linear-gradient(135deg, #FFFFFF, #CBD5E1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1.1;
        }
        .badge-eng {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .06em;
          color: #00F0FF;
          background: rgba(0, 240, 255, 0.1);
          border: 1px solid rgba(0, 240, 255, 0.35);
          padding: 2px 8px;
          border-radius: 999px;
          box-shadow: 0 0 10px rgba(0, 240, 255, 0.2);
        }
        .badge-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #00F0FF;
          box-shadow: 0 0 6px #00F0FF;
        }
        .mk-sub {
          font-size: 10.5px;
          font-weight: 600;
          color: #94A3B8;
          margin-top: 2px;
          letter-spacing: .02em;
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
