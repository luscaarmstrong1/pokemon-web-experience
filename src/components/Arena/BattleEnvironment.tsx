import React, { useMemo } from 'react';
import { ArenaCenario } from '../../data/arenasData';

interface Props {
  cenario: ArenaCenario;
  horario: 'amanhecer' | 'dia' | 'entardecer' | 'noite';
  clima: 'limpo' | 'chuva' | 'sol' | 'neve' | 'tempestade' | 'nevoa';
}

export const BattleEnvironment: React.FC<Props> = ({ cenario, horario, clima }) => {
  // Efeito de iluminação por horário
  const filtroHorario = useMemo(() => {
    switch (horario) {
      case 'amanhecer':
        return 'sepia(0.2) hue-rotate(-20deg) brightness(0.95)';
      case 'entardecer':
        return 'sepia(0.4) hue-rotate(-35deg) saturate(1.2) brightness(0.9)';
      case 'noite':
        return 'brightness(0.65) hue-rotate(190deg) saturate(0.85)';
      case 'dia':
      default:
        return 'none';
    }
  }, [horario]);

  // Partículas ambientais procedurais (15 elementos leves com animação CSS)
  const particulas = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: `${(i * 5.8) % 100}%`,
      top: `${(i * 7.3) % 90}%`,
      duration: `${3 + (i % 5) * 1.2}s`,
      delay: `${(i % 7) * 0.4}s`,
      size: `${6 + (i % 4) * 4}px`,
    }));
  }, []);

  return (
    <div
      className="battle-environment-root"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1,
        filter: filtroHorario,
        transition: 'filter 1s ease',
      }}
    >
      {/* 1. Céu / Fundo Temático */}
      <div
        className="env-sky"
        style={{
          position: 'absolute',
          inset: 0,
          background: cenario.bgGradiente,
          transition: 'background 0.8s ease',
        }}
      />

      {/* 2. Camadas de profundidade e elementos cenográficos específicos */}
      {cenario.id === 'estadio' && (
        <div className="cen-estadio-elem">
          <div className="arquibancadas" />
          <div className="refletor refletor-esq" />
          <div className="refletor refletor-dir" />
        </div>
      )}

      {cenario.id === 'viridian' && (
        <div className="cen-viridian-elem">
          <div className="silhueta-arvores" />
          <div className="raios-sol-canopy" />
        </div>
      )}

      {cenario.id === 'vulcao' && (
        <div className="cen-vulcao-elem">
          <div className="fissuras-lava" />
          <div className="brilho-magma" />
        </div>
      )}

      {cenario.id === 'oceano' && (
        <div className="cen-oceano-elem">
          <div className="ondas-mar" />
          <div className="espuma-cristalina" />
        </div>
      )}

      {cenario.id === 'caverna' && (
        <div className="cen-caverna-elem">
          <div className="estalactites-topo" />
          <div className="cristais-brilhantes" />
        </div>
      )}

      {cenario.id === 'neve' && (
        <div className="cen-neve-elem">
          <div className="picos-nevados" />
          <div className="vento-congelante" />
        </div>
      )}

      {cenario.id === 'deserto' && (
        <div className="cen-deserto-elem">
          <div className="dunas-camadas" />
          <div className="onda-calor" />
        </div>
      )}

      {cenario.id === 'ruinas' && (
        <div className="cen-ruinas-elem">
          <div className="colunas-antigas" />
          <div className="fogos-fatuos-anim" />
        </div>
      )}

      {cenario.id === 'laboratorio' && (
        <div className="cen-lab-elem">
          <div className="grid-holografico" />
          <div className="feixes-laser" />
        </div>
      )}

      {cenario.id === 'campeao' && (
        <div className="cen-campeao-elem">
          <div className="estadio-dourado" />
          <div className="feixes-vitoria" />
        </div>
      )}

      {/* 3. Chão / Plataforma da Arena */}
      <div
        className="env-ground"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '48%',
          background: cenario.pisoGradiente,
          clipPath: 'polygon(0 35%, 100% 15%, 100% 100%, 0 100%)',
          boxShadow: `inset 0 15px 40px rgba(0,0,0,0.6)`,
        }}
      >
        <div className="ground-texture" />
      </div>

      {/* 4. Partículas Ambientais baseadas no Bioma */}
      <div className="env-particles">
        {particulas.map((p) => (
          <div
            key={p.id}
            className={`ambient-particle p-tipo-${cenario.particulaTipo}`}
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDuration: p.duration,
              animationDelay: p.delay,
              '--cor-destaque': cenario.corDestaque,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* 5. Overlay de Clima (Chuva, Neve, Tempestade de Areia, Sol, Névoa) */}
      {clima === 'chuva' && <div className="weather-overlay weather-rain" />}
      {clima === 'neve' && <div className="weather-overlay weather-snow" />}
      {clima === 'tempestade' && <div className="weather-overlay weather-storm" />}
      {clima === 'nevoa' && <div className="weather-overlay weather-fog" />}
      {clima === 'sol' && <div className="weather-overlay weather-sun" />}

      {/* Estilos CSS scoped inline do ambiente */}
      <style>{`
        .ground-texture {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            60deg,
            rgba(255, 255, 255, 0.04) 0 1px,
            transparent 1px 40px
          );
        }

        /* Partículas Ambientais */
        .ambient-particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          opacity: 0.8;
          animation: float-ambient infinite alternate ease-in-out;
        }
        .p-tipo-brasas {
          background: radial-gradient(circle, #FFF3B0, #FF5722);
          box-shadow: 0 0 10px #FF5722;
          animation-name: rise-ember;
        }
        .p-tipo-folhas {
          border-radius: 0 80% 0 80%;
          background: linear-gradient(135deg, #86EFAC, #15803D);
          animation-name: sway-leaf;
        }
        .p-tipo-bolhas {
          border: 1.5px solid rgba(255, 255, 255, 0.7);
          background: radial-gradient(circle at 30% 30%, #fff 10%, rgba(56, 189, 248, 0.4) 60%);
          animation-name: float-bubble;
        }
        .p-tipo-cristais {
          clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
          background: linear-gradient(135deg, #fff, var(--cor-destaque));
          box-shadow: 0 0 8px var(--cor-destaque);
        }
        .p-tipo-raios {
          background: #00F0FF;
          box-shadow: 0 0 12px #00F0FF;
          animation-name: pulse-spark;
        }
        .p-tipo-neve {
          background: #FFFFFF;
          box-shadow: 0 0 6px #FFFFFF;
          animation-name: fall-snow;
        }
        .p-tipo-poeira {
          background: rgba(245, 158, 11, 0.5);
          filter: blur(1px);
        }
        .p-tipo-sombras {
          background: radial-gradient(circle, #9333EA, transparent);
          filter: blur(2px);
        }
        .p-tipo-estrelas {
          background: #FFCB05;
          box-shadow: 0 0 10px #FFCB05;
        }

        @keyframes float-ambient {
          0% { transform: translate(0, 0) scale(0.9); }
          100% { transform: translate(20px, -25px) scale(1.15); }
        }
        @keyframes rise-ember {
          0% { transform: translate(0, 0) scale(0.8); opacity: 0.9; }
          100% { transform: translate(15px, -80px) scale(0.2); opacity: 0; }
        }
        @keyframes sway-leaf {
          0% { transform: translate(0, 0) rotate(0deg); }
          100% { transform: translate(-30px, 40px) rotate(180deg); }
        }
        @keyframes float-bubble {
          0% { transform: translateY(0); opacity: 0.8; }
          100% { transform: translateY(-70px); opacity: 0; }
        }
        @keyframes pulse-spark {
          0%, 100% { opacity: 0.2; transform: scale(0.6); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        @keyframes fall-snow {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-25px, 90px); }
        }

        /* Overlays Climáticos */
        .weather-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .weather-rain {
          background: repeating-linear-gradient(
            105deg,
            transparent,
            transparent 20px,
            rgba(255, 255, 255, 0.08) 20px,
            rgba(255, 255, 255, 0.12) 22px
          );
          animation: rain-anim 0.3s linear infinite;
        }
        @keyframes rain-anim {
          from { transform: translateY(-50px); }
          to { transform: translateY(50px); }
        }
        .weather-fog {
          background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.04) 80%);
          backdrop-filter: blur(1.5px);
        }
        .weather-sun {
          background: radial-gradient(circle at 80% 20%, rgba(255, 203, 5, 0.22), transparent 60%);
        }
      `}</style>
    </div>
  );
};
