import React from 'react';
import { ARENAS_TEMATICAS, ArenaCenario } from '../../data/arenasData';

interface Props {
  cenarioSelecionado: ArenaCenario;
  onSelecionar: (c: ArenaCenario) => void;
  horario: 'amanhecer' | 'dia' | 'entardecer' | 'noite';
  onChangeHorario: (h: 'amanhecer' | 'dia' | 'entardecer' | 'noite') => void;
  clima: 'limpo' | 'chuva' | 'sol' | 'neve' | 'tempestade' | 'nevoa';
  onChangeClima: (cl: 'limpo' | 'chuva' | 'sol' | 'neve' | 'tempestade' | 'nevoa') => void;
}

export const ArenaSelectorModal: React.FC<Props> = ({
  cenarioSelecionado,
  onSelecionar,
  horario,
  onChangeHorario,
  clima,
  onChangeClima,
}) => {
  return (
    <div className="arena-selector-panel">
      <div className="arena-sel-header">
        <div className="arena-sel-title">
          <span>🏟️ AMBIENTAÇÃO & CLIMA</span>
          <b>{cenarioSelecionado.nome}</b>
        </div>

        {/* Controles de Horário */}
        <div className="arena-options-row">
          <div className="time-chips">
            {(['dia', 'amanhecer', 'entardecer', 'noite'] as const).map((h) => (
              <button
                key={h}
                type="button"
                className={`time-chip ${horario === h ? 'active' : ''}`}
                onClick={() => onChangeHorario(h)}
              >
                {h === 'dia' ? '☀️ Dia' : h === 'amanhecer' ? '🌅 Alvorada' : h === 'entardecer' ? '🌇 Ocaso' : '🌙 Noite'}
              </button>
            ))}
          </div>

          {/* Controles de Clima */}
          <div className="time-chips">
            {(['limpo', 'chuva', 'sol', 'neve', 'nevoa'] as const).map((cl) => (
              <button
                key={cl}
                type="button"
                className={`time-chip ${clima === cl ? 'active' : ''}`}
                onClick={() => onChangeClima(cl)}
              >
                {cl === 'limpo' ? '✨ Limpo' : cl === 'chuva' ? '🌧️ Chuva' : cl === 'sol' ? '☀️ Sol' : cl === 'neve' ? '❄️ Neve' : '🌫️ Névoa'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Carrossel / Grade das 10 Arenas */}
      <div className="arena-cards-scroll">
        {ARENAS_TEMATICAS.map((arena) => {
          const isAtivo = arena.id === cenarioSelecionado.id;
          return (
            <div
              key={arena.id}
              className={`arena-preview-card ${isAtivo ? 'selected' : ''}`}
              onClick={() => onSelecionar(arena)}
              style={{
                background: arena.bgGradiente,
                borderColor: isAtivo ? arena.corDestaque : 'rgba(255, 255, 255, 0.1)',
                boxShadow: isAtivo ? `0 0 20px ${arena.corDestaque}66` : 'none',
              }}
            >
              <div
                className="arena-floor-thumb"
                style={{ background: arena.pisoGradiente }}
              />
              <div className="arena-card-badge" style={{ color: arena.corDestaque }}>
                {isAtivo ? 'SELECIONADO' : 'CENÁRIO'}
              </div>
              <b className="arena-card-name">{arena.nome}</b>
              <p className="arena-card-desc">{arena.descricao}</p>
            </div>
          );
        })}
      </div>

      <style>{`
        .arena-selector-panel {
          display: flex;
          flex-direction: column;
          gap: 10px;
          background: rgba(14, 19, 31, 0.75);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 12px 16px;
          margin-top: 6px;
        }
        .arena-sel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
        }
        .arena-sel-title span {
          display: block;
          font-size: 10px;
          font-weight: 800;
          color: #8A93A3;
          letter-spacing: .1em;
        }
        .arena-sel-title b {
          font-size: 14px;
          color: #FFFFFF;
        }
        .arena-options-row {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .time-chips {
          display: flex;
          gap: 4px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 999px;
          padding: 2px;
        }
        .time-chip {
          border: none;
          background: transparent;
          color: #94A3B8;
          font-size: 10px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .time-chip:hover {
          color: #FFFFFF;
          background: rgba(255, 255, 255, 0.08);
        }
        .time-chip.active {
          color: #0B0E14;
          background: #FFCB05;
          font-weight: 800;
        }
        .arena-cards-scroll {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 4px;
        }
        .arena-cards-scroll::-webkit-scrollbar {
          height: 4px;
        }
        .arena-preview-card {
          flex: 0 0 170px;
          height: 105px;
          border-radius: 12px;
          border: 1.5px solid transparent;
          padding: 10px;
          box-sizing: border-box;
          cursor: pointer;
          position: relative;
          display: flex;
          flex-direction: column;
          justifyContent: flex-end;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .arena-preview-card:hover {
          transform: translateY(-2px);
        }
        .arena-floor-thumb {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 38%;
          opacity: 0.65;
          clip-path: polygon(0 40%, 100% 10%, 100% 100%, 0 100%);
        }
        .arena-card-badge {
          position: absolute;
          top: 6px;
          left: 8px;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: .08em;
          background: rgba(0, 0, 0, 0.5);
          padding: 1px 5px;
          border-radius: 4px;
        }
        .arena-card-name {
          font-size: 11px;
          color: #FFFFFF;
          position: relative;
          z-index: 2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .arena-card-desc {
          font-size: 8.5px;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.2;
          position: relative;
          z-index: 2;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};
