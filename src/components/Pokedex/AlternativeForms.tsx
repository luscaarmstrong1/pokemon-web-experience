import React from 'react';
import { Pokemon } from '../../types/pokemon';

interface Props {
  currentPokemon: Pokemon;
  allPokemon: Pokemon[];
  modo: 1 | 2 | 3;
  onSelectForm: (p: Pokemon) => void;
}

export const AlternativeForms: React.FC<Props> = ({
  currentPokemon,
  allPokemon,
  modo,
  onSelectForm,
}) => {
  // Todas as formas da espécie do Pokémon atual (SpeciesId)
  const formas = React.useMemo(() => {
    return allPokemon
      .filter((p) => p.speciesId === currentPokemon.speciesId)
      .sort((a, b) => a.ordemDex - b.ordemDex);
  }, [allPokemon, currentPokemon.speciesId]);

  const qtd = formas.length;
  const rotuloQtd = `${qtd} ${qtd === 1 ? 'forma' : 'formas'}`;

  return (
    <div className="pn forms-panel">
      <div className="pn-head">
        <span className={`pn-ico bg-${currentPokemon.tipo1Slug} sh-${currentPokemon.tipo1Slug}`} />
        <span className="pn-tit">FORMAS</span>
        <span className="pn-sub">{rotuloQtd}</span>
      </div>

      <div className="forms-list">
        {formas.map((p) => {
          const isSelected = p.pokemonId === currentPokemon.pokemonId;
          const img = modo === 2 ? p.imgGifShiny : p.imgGif;

          return (
            <div
              key={p.pokemonId}
              className={`fm ${isSelected ? 'fm-atual' : ''}`}
              onClick={() => onSelectForm(p)}
            >
              <div className={`fm-img gl-${p.tipo1Slug}`}>
                <img
                  src={img}
                  alt={p.forma}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== p.imgHome) {
                      target.src = p.imgHome;
                    }
                  }}
                />
              </div>
              <span title={p.forma}>{p.forma}</span>
            </div>
          );
        })}
      </div>

      <style>{`
        .forms-panel {
          position: relative;
          width: 100%;
          min-height: 140px;
          flex-shrink: 0;
          box-sizing: border-box;
          z-index: 10;
        }
        .forms-list {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 6px;
          overflow-x: auto;
          overflow-y: hidden;
          padding-bottom: 4px;
        }
        .forms-list::-webkit-scrollbar {
          height: 5px;
        }
        .forms-list::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,.18);
          border-radius: 5px;
        }
        .fm {
          width: 86px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          padding: 4px 2px 6px;
          border-radius: 14px;
          cursor: pointer;
          transition: background .15s, transform .15s;
        }
        .fm:hover {
          background: rgba(255,255,255,.06);
          transform: translateY(-2px);
        }
        .fm-img {
          width: 62px;
          height: 62px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .fm-img img {
          max-width: 56px;
          max-height: 56px;
        }
        .fm span {
          max-width: 82px;
          font-size: 10px;
          font-weight: 700;
          color: #C9CFDA;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .fm-atual {
          background: rgba(255,255,255,.07);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.20);
        }
        .fm-atual span {
          color: #fff;
          font-weight: 800;
        }
      `}</style>
    </div>
  );
};
