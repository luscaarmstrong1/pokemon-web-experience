import React from 'react';

interface Props {
  modo: 1 | 2 | 3;
  onChangeModo: (modo: 1 | 2 | 3) => void;
}

export const ModeSelector: React.FC<Props> = ({ modo, onChangeModo }) => {
  return (
    <div className="mode-selector">
      <button
        type="button"
        className={`mode-btn ${modo === 1 ? 'active' : ''}`}
        onClick={() => onChangeModo(1)}
      >
        Normal
      </button>
      <button
        type="button"
        className={`mode-btn ${modo === 2 ? 'active' : ''}`}
        onClick={() => onChangeModo(2)}
      >
        ✨ Shiny
      </button>
      <button
        type="button"
        className={`mode-btn ${modo === 3 ? 'active' : ''}`}
        onClick={() => onChangeModo(3)}
      >
        🃏 Cartas
      </button>

      <style>{`
        .mode-selector {
          position: absolute;
          left: 520px;
          top: 18px;
          width: 316px;
          height: 30px;
          display: flex;
          background: rgba(20, 25, 34, 0.85);
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 999px;
          padding: 2px;
          gap: 2px;
          z-index: 20;
        }
        .mode-btn {
          flex: 1;
          height: 100%;
          border: none;
          background: transparent;
          border-radius: 999px;
          color: #C9CFDA;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .05em;
          cursor: pointer;
          transition: all .15s ease;
        }
        .mode-btn:hover {
          color: #FFFFFF;
          background: rgba(255,255,255,.05);
        }
        .mode-btn.active {
          background: #FFCB05;
          color: #11151D;
          font-weight: 900;
          box-shadow: 0 0 14px rgba(255,203,5,.4);
        }
      `}</style>
    </div>
  );
};
