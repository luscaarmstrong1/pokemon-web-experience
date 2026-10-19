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
        <span className="dot" />
        Normal
      </button>
      <button
        type="button"
        className={`mode-btn ${modo === 2 ? 'active' : ''}`}
        onClick={() => onChangeModo(2)}
      >
        <span className="dot shiny" />
        ✨ Shiny
      </button>
      <button
        type="button"
        className={`mode-btn ${modo === 3 ? 'active' : ''}`}
        onClick={() => onChangeModo(3)}
      >
        <span className="dot card" />
        🃏 Cartas
      </button>

      <style>{`
        .mode-selector {
          position: absolute;
          left: 520px;
          top: 18px;
          width: 316px;
          height: 32px;
          display: flex;
          background: rgba(14, 19, 31, 0.75);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          padding: 3px;
          gap: 3px;
          z-index: 20;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
        }
        .mode-btn {
          flex: 1;
          height: 100%;
          border: none;
          background: transparent;
          border-radius: 999px;
          color: #94A3B8;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .05em;
          cursor: pointer;
          transition: all .2s cubic-bezier(0.2, 0.8, 0.4, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }
        .mode-btn .dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #64748B;
          transition: all .2s ease;
        }
        .mode-btn:hover {
          color: #FFFFFF;
          background: rgba(255, 255, 255, 0.05);
        }
        .mode-btn.active {
          background: linear-gradient(135deg, #FFDE59, #FFCB05);
          color: #0F141F;
          font-weight: 900;
          box-shadow: 0 0 16px rgba(255, 203, 5, 0.45);
        }
        .mode-btn.active .dot {
          background: #0F141F;
        }
      `}</style>
    </div>
  );
};
