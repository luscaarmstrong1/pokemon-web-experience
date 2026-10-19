import React from 'react';
import { Pokemon } from '../../types/pokemon';

interface Props {
  pokemon: Pokemon;
}

export const StatsRadar: React.FC<Props> = ({ pokemon }) => {
  const { hp, ataque, defesa, atqEsp, defEsp, velocidade, total, tipo1Slug } = pokemon;

  const cx = 100;
  const cy = 100;
  const r = 62;
  const escala = 200;

  // Eixos na ordem exata do DAX:
  // (0, "HP", _hp, 1), (1, "ATQ", _atk, 2), (2, "DEF", _def, 3),
  // (3, "VEL", _vel, 6), (4, "A.ESP", _atkEsp, 4), (5, "D.ESP", _defEsp, 5)
  const eixos = [
    { k: 0, rotulo: 'HP', valor: hp, ordem: 1 },
    { k: 1, rotulo: 'ATQ', valor: ataque, ordem: 2 },
    { k: 2, rotulo: 'DEF', valor: defesa, ordem: 3 },
    { k: 3, rotulo: 'VEL', valor: velocidade, ordem: 6 },
    { k: 4, rotulo: 'A.ESP', valor: atqEsp, ordem: 4 },
    { k: 5, rotulo: 'D.ESP', valor: defEsp, ordem: 5 },
  ];

  const niveis = [0.25, 0.5, 0.75, 1];

  // Grade hexagonal
  const gradePolygons = niveis.map((f, idx) => {
    const points = [0, 1, 2, 3, 4, 5]
      .map((k) => {
        const a = ((-90 + 60 * k) * Math.PI) / 180;
        const x = (cx + r * f * Math.cos(a)).toFixed(1);
        const y = (cy + r * f * Math.sin(a)).toFixed(1);
        return `${x},${y}`;
      })
      .join(' ');
    return <polygon key={idx} className="rd-grid" points={points} />;
  });

  // Linhas dos eixos
  const linhasEixo = [0, 1, 2, 3, 4, 5].map((k) => {
    const a = ((-90 + 60 * k) * Math.PI) / 180;
    const x2 = (cx + r * Math.cos(a)).toFixed(1);
    const y2 = (cy + r * Math.sin(a)).toFixed(1);
    return <line key={k} className="rd-ax" x1={cx} y1={cy} x2={x2} y2={y2} />;
  });

  // Pontos do polígono preenchido do Pokémon
  const pontosPokemon = eixos
    .map(({ k, valor }) => {
      const a = ((-90 + 60 * k) * Math.PI) / 180;
      const rv = r * Math.min(Math.max(valor / escala, 0.06), 1);
      const x = (cx + rv * Math.cos(a)).toFixed(1);
      const y = (cy + rv * Math.sin(a)).toFixed(1);
      return `${x},${y}`;
    })
    .join(' ');

  // Bolinhas dos vértices
  const bolinhas = eixos.map(({ k, valor }) => {
    const a = ((-90 + 60 * k) * Math.PI) / 180;
    const rv = r * Math.min(Math.max(valor / escala, 0.06), 1);
    const cxDot = (cx + rv * Math.cos(a)).toFixed(1);
    const cyDot = (cy + rv * Math.sin(a)).toFixed(1);
    return <circle key={k} className="rd-dot" r="3" cx={cxDot} cy={cyDot} />;
  });

  // Rótulos do radar
  const rotulosSvg = eixos.map(({ k, rotulo }) => {
    const a = ((-90 + 60 * k) * Math.PI) / 180;
    const x = (cx + 84 * Math.cos(a)).toFixed(1);
    const y = (cy + 84 * Math.sin(a) + 3).toFixed(1);
    return (
      <text key={k} className="rd-lb" textAnchor="middle" x={x} y={y}>
        {rotulo}
      </text>
    );
  });

  // Barras de status ordenadas por ordem natural (HP, ATQ, DEF, A.ESP, D.ESP, VEL)
  const barrasOrdenadas = [...eixos].sort((a, b) => a.ordem - b.ordem);

  return (
    <div className="pn stats-panel">
      {/* Cabeçalho */}
      <div className="pn-head">
        <span className={`pn-ico bg-${tipo1Slug} sh-${tipo1Slug}`} />
        <span className="pn-tit">ATRIBUTOS BASE</span>
        <span className="pn-total">
          TOTAL <b>{total}</b>
        </span>
      </div>

      <div className="stats-content">
        {/* Radar SVG */}
        <div className="radar-box">
          <svg className="rd-svg" viewBox="0 0 200 200">
            {gradePolygons}
            {linhasEixo}
            <polygon className={`rd-poly fl-${tipo1Slug}`} points={pontosPokemon} />
            {bolinhas}
            {rotulosSvg}
          </svg>
        </div>

        {/* Barras de Atributo */}
        <div className="bars-box">
          {barrasOrdenadas.map(({ rotulo, valor }) => {
            const larg = Math.min((valor / escala) * 100, 100);
            return (
              <div key={rotulo} className="br">
                <span className="br-l">{rotulo}</span>
                <div className="br-t">
                  <div className={`br-f bg-${tipo1Slug}`} style={{ width: `${larg}%` }} />
                </div>
                <span className="br-v">{valor}</span>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .stats-panel {
          position: relative;
          width: 100%;
          min-height: 220px;
          flex-shrink: 0;
          box-sizing: border-box;
          z-index: 10;
        }
        .stats-content {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
        }
        .radar-box {
          width: 175px;
          height: 175px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .rd-svg {
          width: 100%;
          height: 100%;
        }
        .rd-grid {
          fill: none;
          stroke: rgba(255,255,255,.08);
          stroke-width: 1;
        }
        .rd-ax {
          stroke: rgba(255,255,255,.08);
          stroke-width: 1;
        }
        .rd-poly {
          fill-opacity: 0.35;
          stroke-width: 2;
        }
        .rd-dot {
          fill: #fff;
          filter: drop-shadow(0 0 2px rgba(255,255,255,.8));
        }
        .rd-lb {
          font-size: 8.5px;
          font-weight: 800;
          fill: #8A93A3;
          letter-spacing: .05em;
        }

        .bars-box {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding-right: 4px;
        }
        .br {
          display: flex;
          align-items: center;
          gap: 8px;
          height: 20px;
        }
        .br-l {
          width: 44px;
          font-size: 9.5px;
          font-weight: 800;
          color: #8A93A3;
        }
        .br-t {
          flex: 1;
          height: 6px;
          background: rgba(255,255,255,.06);
          border-radius: 999px;
          overflow: hidden;
        }
        .br-f {
          height: 100%;
          border-radius: 999px;
          transition: width .3s ease;
        }
        .br-v {
          width: 28px;
          text-align: right;
          font-size: 11px;
          font-weight: 800;
          color: #fff;
        }
      `}</style>
    </div>
  );
};
