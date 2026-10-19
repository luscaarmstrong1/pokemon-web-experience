import React from 'react';
import { Pokemon } from '../../types/pokemon';

interface Props {
  pokemon: Pokemon;
}

export const WeaknessGrid: React.FC<Props> = ({ pokemon }) => {
  const { fraquezas, tipo1Slug } = pokemon;

  // Classifica fraquezas por multiplicador:
  // Fraquezas: 4x, 2x
  // Resistências: 0.5x, 0.25x
  // Imunidades: 0x
  const superFraquezas = fraquezas.filter((f) => f.multiplicador > 1);
  const resistencias = fraquezas.filter((f) => f.multiplicador > 0 && f.multiplicador < 1);
  const imunidades = fraquezas.filter((f) => f.multiplicador === 0);

  const formatMult = (m: number) => {
    if (m === 4) return '4×';
    if (m === 2) return '2×';
    if (m === 0.5) return '½×';
    if (m === 0.25) return '¼×';
    if (m === 0) return '0×';
    return `${m}×`;
  };

  return (
    <div className="pn weakness-panel">
      <div className="pn-head">
        <span className={`pn-ico bg-${tipo1Slug} sh-${tipo1Slug}`} />
        <span className="pn-tit">FRAQUEZAS E RESISTÊNCIAS</span>
        <span className="pn-sub">multiplicador de dano recebido</span>
      </div>

      <div className="weakness-content">
        {/* Fraquezas */}
        <div className="wk-section">
          <span className="wk-label f-danger">FRAQUEZAS</span>
          <div className="wk-chips">
            {superFraquezas.length === 0 ? (
              <span className="fx-vazio">Nenhuma fraqueza</span>
            ) : (
              superFraquezas.map((f) => (
                <span
                  key={f.tipoSlug}
                  className={`ch bg-${f.tipoSlug} ${f.multiplicador >= 4 ? 'ch-x4' : ''}`}
                >
                  {f.tipo}
                  <b>{formatMult(f.multiplicador)}</b>
                </span>
              ))
            )}
          </div>
        </div>

        {/* Resistências */}
        <div className="wk-section">
          <span className="wk-label f-res">RESISTÊNCIAS</span>
          <div className="wk-chips">
            {resistencias.length === 0 ? (
              <span className="fx-vazio">Nenhuma resistência</span>
            ) : (
              resistencias.map((f) => (
                <span key={f.tipoSlug} className={`ch bg-${f.tipoSlug} ch-res`}>
                  {f.tipo}
                  <b>{formatMult(f.multiplicador)}</b>
                </span>
              ))
            )}
          </div>
        </div>

        {/* Imunidades */}
        {imunidades.length > 0 && (
          <div className="wk-section">
            <span className="wk-label f-imune">IMUNIDADES</span>
            <div className="wk-chips">
              {imunidades.map((f) => (
                <span key={f.tipoSlug} className={`ch bg-${f.tipoSlug} ch-imune`}>
                  {f.tipo}
                  <b>0×</b>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .weakness-panel {
          position: relative;
          width: 100%;
          min-height: 180px;
          flex-shrink: 0;
          box-sizing: border-box;
          z-index: 10;
        }
        .weakness-content {
          display: flex;
          flex-direction: column;
          gap: 6px;
          overflow-y: auto;
          flex: 1;
          padding-right: 2px;
        }
        .wk-section {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .wk-label {
          font-size: 8.5px;
          font-weight: 900;
          letter-spacing: .12em;
        }
        .f-danger { color: #FF7B7B; }
        .f-res { color: #8BE39D; }
        .f-imune { color: #9BE7A6; }

        .wk-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }
        .ch {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 10px;
          font-weight: 700;
          color: #fff;
          padding: 2px 3px 2px 10px;
          border-radius: 999px;
          text-shadow: 0 1px 1px rgba(0,0,0,.35);
        }
        .ch b {
          font-size: 9px;
          font-weight: 900;
          background: rgba(0,0,0,.30);
          padding: 2px 6px;
          border-radius: 999px;
        }
        .ch-x4 {
          box-shadow: 0 0 0 2px #fff, 0 0 16px rgba(255,255,255,.35);
        }
        .ch-res {
          opacity: .85;
        }
        .ch-imune {
          opacity: 1;
          box-shadow: inset 0 0 0 2px rgba(0,0,0,.35);
        }
        .ch-imune b {
          background: #0B0E14;
          color: #9BE7A6;
        }
        .fx-vazio {
          font-size: 9.5px;
          color: #5C6575;
          margin-left: 2px;
        }
      `}</style>
    </div>
  );
};
