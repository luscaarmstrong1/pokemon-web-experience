import React from 'react';

interface Props {
  paginaAtual?: 'pokedex' | 'arena' | 'tipos' | 'quiz' | 'safari' | 'offline';
  titulo?: string;
  subtitulo?: string;
  totalPokemon?: number;
  centerContent?: React.ReactNode;
  rightExtra?: React.ReactNode;
}

export const AppHeader: React.FC<Props> = ({
  titulo,
  subtitulo,
  totalPokemon,
  centerContent,
  rightExtra,
}) => {
  return (
    <header className="app-header-unified">
      {/* 1. Informações de Título e Módulo */}
      <div className="header-brand-info">
        <div className="header-titles">
          {titulo ? (
            <h1 className="header-main-title">{titulo}</h1>
          ) : (
            <span className="brand-name">POKÉDEX NACIONAL</span>
          )}
          <div className="header-sub-row">
            {totalPokemon !== undefined ? (
              <span className="brand-sub">
                <b>{totalPokemon.toLocaleString('pt-BR')}</b> POKÉMON CADASTRADOS · GERAÇÕES 1 A 9
              </span>
            ) : subtitulo ? (
              <span className="brand-sub">{subtitulo}</span>
            ) : null}
          </div>
        </div>
      </div>

      {/* 2. Conteúdo Central Customizado (ex: filtros ou abas quando aplicável) */}
      {centerContent && (
        <div className="header-center-area">
          {centerContent}
        </div>
      )}

      {/* 3. Lado Direito: Status / Badge / Ações Extras */}
      <div className="header-right-area">
        {rightExtra}
        <div className="signature-pill" title="Desenvolvido por luscaarmstrong">
          <span className="sig-dot" />
          <span className="sig-author">luscaarmstrong</span>
        </div>
      </div>

      <style>{`
        .app-header-unified {
          position: relative;
          width: 100%;
          height: 48px;
          min-height: 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 16px;
          box-sizing: border-box;
          z-index: 40;
          pointer-events: auto;
        }

        .header-brand-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-titles {
          display: flex;
          flex-direction: column;
        }

        .header-main-title {
          margin: 0;
          font-size: 17px;
          font-weight: 900;
          letter-spacing: .12em;
          background: linear-gradient(135deg, #FFFFFF 30%, #E2E8F0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1.1;
        }

        .brand-name {
          font-size: 16px;
          font-weight: 900;
          letter-spacing: .14em;
          background: linear-gradient(135deg, #FFFFFF 30%, #E2E8F0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1.1;
        }

        .header-sub-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 2px;
        }

        .brand-sub {
          font-size: 9.5px;
          font-weight: 700;
          color: #8A93A3;
          letter-spacing: .08em;
          text-transform: uppercase;
        }
        .brand-sub b {
          color: #FFCB05;
        }

        .header-center-area {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .header-right-area {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .signature-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 9.5px;
          font-weight: 800;
          letter-spacing: .08em;
          color: #00F0FF;
          background: rgba(0, 240, 255, 0.08);
          border: 1px solid rgba(0, 240, 255, 0.35);
          padding: 3px 10px;
          border-radius: 999px;
          box-shadow: 0 0 14px rgba(0, 240, 255, 0.15);
        }

        .sig-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #00F0FF;
          box-shadow: 0 0 6px #00F0FF;
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
        }
      `}</style>
    </header>
  );
};
