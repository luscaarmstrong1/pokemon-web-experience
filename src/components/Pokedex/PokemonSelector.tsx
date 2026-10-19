import React, { useMemo } from 'react';
import { Pokemon } from '../../types/pokemon';

interface Props {
  pokemons: Pokemon[];
  selectedId: number;
  onSelect: (p: Pokemon) => void;
  selectedGen: number | 'all';
  onSelectGen: (gen: number | 'all') => void;
  selectedTipo: string | 'all';
  onSelectTipo: (tipo: string | 'all') => void;
  onlyLegendary: boolean;
  onToggleLegendary: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const PokemonSelector: React.FC<Props> = ({
  pokemons,
  selectedId,
  onSelect,
  selectedGen,
  onSelectGen,
  selectedTipo,
  onSelectTipo,
  onlyLegendary,
  onToggleLegendary,
  searchTerm,
  onSearchChange,
}) => {
  // Lista de gerações
  const generations = [
    { label: 'Todas as Gerações', val: 'all' as const },
    { label: 'Kanto - Gen 1', val: 1 },
    { label: 'Johto - Gen 2', val: 2 },
    { label: 'Hoenn - Gen 3', val: 3 },
    { label: 'Sinnoh - Gen 4', val: 4 },
    { label: 'Unova - Gen 5', val: 5 },
    { label: 'Kalos - Gen 6', val: 6 },
    { label: 'Alola - Gen 7', val: 7 },
    { label: 'Galar - Gen 8', val: 8 },
    { label: 'Paldea - Gen 9', val: 9 },
  ];

  // Lista dos 18 tipos
  const tipos = [
    'Normal', 'Fogo', 'Água', 'Planta', 'Elétrico', 'Gelo',
    'Lutador', 'Venenoso', 'Terrestre', 'Voador', 'Psíquico', 'Inseto',
    'Pedra', 'Fantasma', 'Dragão', 'Sombrio', 'Aço', 'Fada'
  ];

  // Apenas Pokémon padrão (isDefault) aparecem na lista lateral esquerda, conforme FILTRO_PAGINA original
  const filteredList = useMemo(() => {
    return pokemons.filter((p) => {
      if (!p.isDefault) return false;
      if (selectedGen !== 'all' && p.geracao !== selectedGen) return false;
      if (selectedTipo !== 'all' && p.tipo1 !== selectedTipo && p.tipo2 !== selectedTipo) return false;
      if (onlyLegendary && !(p.lendario || p.mitico)) return false;
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchName = p.nome.toLowerCase().includes(term);
        const matchNum = p.numero.includes(term) || String(p.speciesId).includes(term);
        if (!matchName && !matchNum) return false;
      }
      return true;
    });
  }, [pokemons, selectedGen, selectedTipo, onlyLegendary, searchTerm]);

  return (
    <div className="selector-container">
      {/* Controles de Filtros */}
      <div className="filters-row">
        {/* Dropdown Geração (16, 94, 118, 32) */}
        <select
          className="filter-select select-gen"
          value={selectedGen}
          onChange={(e) => onSelectGen(e.target.value === 'all' ? 'all' : Number(e.target.value))}
        >
          {generations.map((g) => (
            <option key={g.label} value={g.val}>
              {g.label}
            </option>
          ))}
        </select>

        {/* Dropdown Tipo (140, 94, 118, 32) */}
        <select
          className="filter-select select-tipo"
          value={selectedTipo}
          onChange={(e) => onSelectTipo(e.target.value)}
        >
          <option value="all">Todos os Tipos</option>
          {tipos.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* Botão Lendários (264, 94, 84, 32) */}
        <button
          type="button"
          className={`filter-btn-lend ${onlyLegendary ? 'active' : ''}`}
          onClick={onToggleLegendary}
        >
          ★ Lendários
        </button>
      </div>

      {/* Caixa de busca */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Buscar Pokémon..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Grid 3 colunas x 5 linhas com scroll (16, 134, 332, 570) */}
      <div className="pokemon-grid">
        {filteredList.map((p) => {
          const isSelected = p.pokemonId === selectedId;
          return (
            <div
              key={p.pokemonId}
              className={`pokemon-tile ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelect(p)}
            >
              <div className="tile-img-wrap">
                <img
                  src={p.imgSprite}
                  alt={p.nome}
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== p.imgArte) {
                      target.src = p.imgArte;
                    }
                  }}
                />
              </div>
              <span className="tile-nome">{p.nome}</span>
            </div>
          );
        })}
      </div>

      <style>{`
        .selector-container {
          position: absolute;
          left: 88px;
          top: 68px;
          width: 268px;
          height: 636px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          z-index: 15;
        }
        .filters-row {
          display: flex;
          align-items: center;
          gap: 4px;
          height: 32px;
        }
        .filter-select {
          background: #141922;
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 8px;
          color: #C9CFDA;
          font-size: 10px;
          font-weight: 600;
          height: 32px;
          padding: 0 6px;
          outline: none;
          cursor: pointer;
        }
        .select-gen {
          flex: 1.1;
          min-width: 0;
        }
        .select-tipo {
          flex: 1;
          min-width: 0;
        }
        .filter-btn-lend {
          flex: 0.9;
          min-width: 0;
          height: 32px;
          background: #141922;
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 8px;
          color: #C9CFDA;
          font-size: 9.5px;
          font-weight: 800;
          cursor: pointer;
          transition: all .15s ease;
          white-space: nowrap;
        }
        .filter-btn-lend:hover {
          border-color: #FFCB05;
          color: #fff;
        }
        .filter-btn-lend.active {
          background: #FFCB05;
          border-color: #FFCB05;
          color: #11151D;
          box-shadow: 0 0 10px rgba(255,203,5,.35);
        }

        .search-box {
          height: 30px;
          width: 100%;
        }
        .search-input {
          width: 100%;
          height: 100%;
          background: rgba(20, 25, 34, 0.85);
          border: 1px solid rgba(255,255,255,.10);
          border-radius: 8px;
          color: #fff;
          font-size: 11px;
          padding: 0 10px;
          outline: none;
        }
        .search-input:focus {
          border-color: #FFCB05;
          box-shadow: 0 0 8px rgba(255,203,5,.25);
        }

        .pokemon-grid {
          flex: 1;
          overflow-y: auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-auto-rows: 96px;
          gap: 6px;
          padding-right: 2px;
        }
        .pokemon-tile {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          background: rgba(20, 25, 34, 0.75);
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 12px;
          cursor: pointer;
          transition: all .15s ease;
          padding: 6px 4px;
        }
        .pokemon-tile:hover {
          background: rgba(35, 43, 58, 0.9);
          border-color: rgba(255,255,255,.2);
          transform: translateY(-2px);
        }
        .pokemon-tile.selected {
          background: rgba(255, 203, 5, 0.16);
          border-color: #FFCB05;
          box-shadow: 0 0 14px rgba(255,203,5,.3);
        }
        .tile-img-wrap {
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .tile-img-wrap img {
          max-width: 100%;
          max-height: 100%;
          image-rendering: pixelated;
        }
        .tile-nome {
          font-size: 9.5px;
          font-weight: 700;
          color: #E9ECF2;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 90px;
        }
        .pokemon-tile.selected .tile-nome {
          color: #FFCB05;
        }
      `}</style>
    </div>
  );
};
