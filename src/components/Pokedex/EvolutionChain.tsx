import React from 'react';
import { Pokemon } from '../../types/pokemon';

interface Props {
  currentPokemon: Pokemon;
  allPokemon: Pokemon[];
  modo: 1 | 2 | 3;
  onSelectPokemon: (p: Pokemon, isEvolutionAction?: boolean) => void;
}

export const EvolutionChain: React.FC<Props> = ({
  currentPokemon,
  allPokemon,
  modo,
  onSelectPokemon,
}) => {
  // Membros padrão da mesma cadeia evolutiva
  const chainMembers = React.useMemo(() => {
    return allPokemon
      .filter((p) => p.chainId === currentPokemon.chainId && p.isDefault)
      .sort((a, b) => a.estagio - b.estagio || a.speciesId - b.speciesId);
  }, [allPokemon, currentPokemon.chainId]);

  // Agrupa membros por estágio (ex: Eevee estágio 1 -> Vaporeon/Jolteon/Flareon estágio 2)
  const estagiosMap = React.useMemo(() => {
    const map = new Map<number, Pokemon[]>();
    chainMembers.forEach((p) => {
      const list = map.get(p.estagio) || [];
      list.push(p);
      map.set(p.estagio, list);
    });
    return map;
  }, [chainMembers]);

  const estagios = Array.from(estagiosMap.keys()).sort((a, b) => a - b);
  const isCompact = chainMembers.length > 4;

  return (
    <div className="pn evo-panel">
      <div className="pn-head">
        <span className={`pn-ico bg-${currentPokemon.tipo1Slug} sh-${currentPokemon.tipo1Slug}`} />
        <span className="pn-tit">EVOLUÇÃO</span>
        <span className="pn-sub">clique no próximo estágio para evoluir · de novo para voltar</span>
      </div>

      <div className="evo-items-container">
        {estagios.map((est, idx) => {
          const pokes = estagiosMap.get(est) || [];
          return (
            <React.Fragment key={est}>
              {idx > 0 && <span className={`ev-seta ${isCompact ? 'ev-p' : ''}`}>›</span>}
              <div className="evo-group">
                {pokes.map((p) => {
                  const isCurrent = p.speciesId === currentPokemon.speciesId;
                  const isNext = p.estagio === currentPokemon.estagio + 1;
                  const img = modo === 2 ? p.imgGifShiny : p.imgGif;

                  return (
                    <div
                      key={p.pokemonId}
                      className={`ev ${isCompact ? 'ev-p' : ''} ${isCurrent ? 'ev-atual' : ''} ${
                        isNext ? 'ev-prox' : ''
                      }`}
                      onClick={() => onSelectPokemon(p, isNext)}
                    >
                      <div className="ev-card">
                        {isNext && <span className="ev-evoluir">EVOLUIR ›</span>}
                        <div className={`ev-img gl-${p.tipo1Slug}`}>
                          <img
                            src={img}
                            alt={p.nomeEspecie}
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (target.src !== p.imgHome) {
                                target.src = p.imgHome;
                              }
                            }}
                          />
                        </div>
                        <span className="ev-nome">{p.nomeEspecie}</span>
                        {p.nivelEvolucao ? (
                          <span className="ev-nv">Nv. {p.nivelEvolucao}</span>
                        ) : p.estagio > 1 ? (
                          <span className="ev-nv">Especial</span>
                        ) : (
                          <span className="ev-nv ev-nv0">Base</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <style>{`
        .evo-panel {
          position: absolute;
          left: 360px;
          top: 486px;
          width: 480px;
          height: 218px;
          z-index: 10;
        }
        .evo-items-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          overflow-x: auto;
          overflow-y: hidden;
        }
        .evo-group {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .ev {
          display: flex;
          align-items: center;
          cursor: pointer;
        }
        .ev-seta {
          font-size: 34px;
          font-weight: 300;
          color: #5C6575;
          margin: 0 4px 18px;
        }
        .ev-card {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          padding: 6px 10px 8px;
          border-radius: 16px;
          transition: background .15s, transform .15s;
        }
        .ev-card:hover {
          background: rgba(255,255,255,.06);
          transform: translateY(-2px);
        }
        .ev-img {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ev-img img {
          max-width: 80px;
          max-height: 80px;
        }
        .ev-nome {
          font-size: 11.5px;
          font-weight: 800;
          color: #E9ECF2;
        }
        .ev-nv {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .06em;
          color: #C9CFDA;
          background: rgba(255,255,255,.07);
          border: 1px solid rgba(255,255,255,.12);
          padding: 1px 9px;
          border-radius: 999px;
        }
        .ev-nv0 {
          color: #737C8C;
        }
        .ev-atual .ev-card {
          background: rgba(255,255,255,.07);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.20);
        }
        .ev-evoluir {
          position: absolute;
          top: -2px;
          right: -4px;
          z-index: 2;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: .10em;
          color: #11151D;
          background: #FFCB05;
          padding: 2px 7px;
          border-radius: 999px;
          box-shadow: 0 0 12px rgba(255,203,5,.55);
          animation: chama 1.6s ease-in-out infinite;
        }
        .ev-prox .ev-img {
          animation: respira 1.6s ease-in-out infinite;
        }

        .ev-p .ev-seta { font-size: 20px; margin: 0 2px 10px; }
        .ev-p .ev-card { padding: 3px 4px 5px; }
        .ev-p .ev-img { width: 50px; height: 50px; }
        .ev-p .ev-img img { max-width: 44px; max-height: 44px; }
        .ev-p .ev-nome { font-size: 9px; }
        .ev-p .ev-nv { font-size: 7.5px; padding: 0 5px; }
        .ev-p .ev-evoluir { font-size: 6px; padding: 1px 4px; right: -4px; }

        @keyframes chama { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        @keyframes respira { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.06); } }
      `}</style>
    </div>
  );
};
