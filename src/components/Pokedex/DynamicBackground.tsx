import React, { useMemo } from 'react';

interface Props {
  tipo1Slug: string;
  tipo2Slug?: string | null;
  speciesId: number;
  isShiny?: boolean;
}

export const DynamicBackground: React.FC<Props> = ({ tipo1Slug, tipo2Slug, speciesId, isShiny }) => {
  const numFmt = String(speciesId).padStart(3, '0');
  const slugB = tipo2Slug || tipo1Slug;

  // Gerador determinístico de partículas idêntico ao DAX
  const camada1 = useMemo(() => {
    const items = [];
    for (let i = 1; i <= 22; i++) {
      const x = (i * 37 + 11) % 100;
      const y = (i * 53 + 7) % 100;
      const tam = 4 + ((i * 7) % 10);
      const dur = (5 + ((i * 13) % 60) / 10).toFixed(1);
      const atr = ((i * 29) % 80 / 10).toFixed(1);
      items.push(
        <i
          key={i}
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: `${tam}px`,
            height: `${tam}px`,
            animationDuration: `${dur}s`,
            animationDelay: `-${atr}s`
          }}
        />
      );
    }
    return items;
  }, []);

  const camada2 = useMemo(() => {
    const items = [];
    for (let i = 1; i <= 10; i++) {
      const x = (i * 41 + 23) % 100;
      const y = (i * 67 + 31) % 100;
      const tam = 4 + ((i * 5) % 8);
      const dur = (6 + ((i * 17) % 50) / 10).toFixed(1);
      const atr = ((i * 31) % 70 / 10).toFixed(1);
      items.push(
        <i
          key={i}
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: `${tam}px`,
            height: `${tam}px`,
            animationDuration: `${dur}s`,
            animationDelay: `-${atr}s`
          }}
        />
      );
    }
    return items;
  }, []);

  return (
    <div className="bg-container">
      <div className={`bg-g1 gl-${tipo1Slug}`} />
      <div className={`bg-g2 gl-${slugB}`} />
      <div className="bg-dots" />
      <div className="bg-ball">
        <i />
      </div>
      <div className="bg-num">{numFmt}</div>

      {/* Partículas Tipo 1 */}
      <div className={`fx fx-${tipo1Slug}`}>{camada1}</div>

      {/* Partículas Tipo 2 se existir */}
      {tipo2Slug && <div className={`fx fx2 fx-${tipo2Slug}`}>{camada2}</div>}

      {/* Partículas Shiny */}
      {isShiny && (
        <div className="fx fx-shiny">
          {camada2}
          {camada2}
        </div>
      )}

      <style>{`
        .bg-container {
          position: absolute;
          inset: 0;
          overflow: hidden;
          background: linear-gradient(180deg, #0E121A 0%, #08090D 100%);
          z-index: 0;
          pointer-events: none;
        }
        .bg-g1 {
          position: absolute;
          width: 1000px;
          height: 1000px;
          left: 100px;
          top: -270px;
          opacity: 0.80;
        }
        .bg-g2 {
          position: absolute;
          width: 820px;
          height: 820px;
          left: 720px;
          top: 280px;
          opacity: 0.40;
        }
        .bg-dots {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255,255,255,.08) 1px, transparent 1.4px);
          background-size: 22px 22px;
          -webkit-mask-image: radial-gradient(circle at 47% 38%, #000 0%, rgba(0,0,0,.25) 45%, transparent 75%);
        }
        .bg-ball {
          position: absolute;
          width: 540px;
          height: 540px;
          left: 330px;
          top: -30px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,.05);
          animation: gira 90s linear infinite;
        }
        .bg-ball::before {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          height: 2px;
          background: rgba(255,255,255,.05);
        }
        .bg-ball i {
          position: absolute;
          width: 120px;
          height: 120px;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,.05);
        }
        .bg-num {
          position: absolute;
          left: 352px;
          bottom: 210px;
          font-size: 230px;
          font-weight: 900;
          line-height: 1;
          letter-spacing: -.04em;
          color: transparent;
          -webkit-text-stroke: 2px rgba(255,255,255,.045);
        }
      `}</style>
    </div>
  );
};
