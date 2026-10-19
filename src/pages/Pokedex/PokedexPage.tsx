import React, { useState, useEffect } from 'react';
import pokemonDataRaw from '../../data/pokemon.json';
import { Pokemon, CartaTCG } from '../../types/pokemon';
import { DynamicBackground } from '../../components/Pokedex/DynamicBackground';
import { PokemonSelector } from '../../components/Pokedex/PokemonSelector';
import { PokemonHero } from '../../components/Pokedex/PokemonHero';
import { StatsRadar } from '../../components/Pokedex/StatsRadar';
import { WeaknessGrid } from '../../components/Pokedex/WeaknessGrid';
import { EvolutionChain } from '../../components/Pokedex/EvolutionChain';
import { AlternativeForms } from '../../components/Pokedex/AlternativeForms';

const allPokemonList = pokemonDataRaw as Pokemon[];

export const PokedexPage: React.FC = () => {
  // Estado de seleção
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon>(allPokemonList[0]);
  const [prevPokemon, setPrevPokemon] = useState<Pokemon | null>(null);
  const [isEvolving, setIsEvolving] = useState<boolean>(false);

  // Filtros
  const [selectedGen, setSelectedGen] = useState<number | 'all'>('all');
  const [selectedTipo, setSelectedTipo] = useState<string | 'all'>('all');
  const [onlyLegendary, setOnlyLegendary] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modo (1: Normal, 2: Shiny, 3: Cartas)
  const [modo, setModo] = useState<1 | 2 | 3>(1);

  // Cartas TCG carregadas sob demanda para economizar memória e performance
  const [cardsMap, setCardsMap] = useState<Record<number, CartaTCG[]>>({});
  const [loadingCards, setLoadingCards] = useState<boolean>(false);

  useEffect(() => {
    if (modo === 3 && Object.keys(cardsMap).length === 0 && !loadingCards) {
      setLoadingCards(true);
      fetch('/data/cartas_tcg.json')
        .then((res) => res.json())
        .then((data) => {
          setCardsMap(data);
          setLoadingCards(false);
        })
        .catch(() => {
          setLoadingCards(false);
        });
    }
  }, [modo, cardsMap, loadingCards]);

  const currentCards = cardsMap[selectedPokemon.speciesId] || [];

  const handleSelectPokemon = (p: Pokemon, isEvolutionAction = false) => {
    if (isEvolutionAction) {
      setPrevPokemon(selectedPokemon);
      setIsEvolving(true);
      setSelectedPokemon(p);
      setTimeout(() => {
        setIsEvolving(false);
      }, 3200);
    } else {
      setIsEvolving(false);
      setSelectedPokemon(p);
    }
  };

  return (
    <div className="pk-palco pokedex-fullscreen-layout">
      {/* Fundo Dinâmico com Partículas por Tipo */}
      <DynamicBackground
        tipo1Slug={selectedPokemon.tipo1Slug}
        tipo2Slug={selectedPokemon.tipo2Slug}
        speciesId={selectedPokemon.speciesId}
        isShiny={modo === 2}
      />

      {/* Grade de 3 Colunas Fluida */}
      <div className="pokedex-grid-container">
        {/* Coluna 1: Seletor de Pokémon com Filtros e Rolagem Independente */}
        <aside className="pokedex-col-selector">
          <PokemonSelector
            pokemons={allPokemonList}
            selectedId={selectedPokemon.pokemonId}
            onSelect={(p) => handleSelectPokemon(p, false)}
            selectedGen={selectedGen}
            onSelectGen={setSelectedGen}
            selectedTipo={selectedTipo}
            onSelectTipo={setSelectedTipo}
            onlyLegendary={onlyLegendary}
            onToggleLegendary={() => setOnlyLegendary(!onlyLegendary)}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </aside>

        {/* Coluna 2: Apresentação Central do Pokémon e Linha Evolutiva */}
        <section className="pokedex-col-center">
          <div className="hero-display-area">
            <PokemonHero
              pokemon={selectedPokemon}
              modo={modo}
              onChangeModo={setModo}
              cartas={currentCards}
              isEvolving={isEvolving}
              prevPokemon={prevPokemon}
            />
          </div>
          <div className="hero-evolution-dock">
            <EvolutionChain
              currentPokemon={selectedPokemon}
              allPokemon={allPokemonList}
              modo={modo}
              onSelectPokemon={handleSelectPokemon}
            />
          </div>
        </section>

        {/* Coluna 3: Painéis de Atributos, Fraquezas e Formas Alternativas */}
        <aside className="pokedex-col-info">
          <div className="info-scroll-area">
            <StatsRadar pokemon={selectedPokemon} />
            <WeaknessGrid pokemon={selectedPokemon} />
            <AlternativeForms
              currentPokemon={selectedPokemon}
              allPokemon={allPokemonList}
              modo={modo}
              onSelectForm={(p) => handleSelectPokemon(p, false)}
            />
          </div>
        </aside>
      </div>

      <style>{`
        .pokedex-fullscreen-layout {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .pokedex-grid-container {
          position: relative;
          z-index: 10;
          width: 100%;
          height: 100%;
          display: grid;
          grid-template-columns: minmax(260px, 290px) minmax(420px, 1fr) minmax(320px, 400px);
          gap: 14px;
          padding: 12px 16px 12px 14px;
          box-sizing: border-box;
          overflow: hidden;
        }

        .pokedex-col-selector {
          height: 100%;
          min-height: 0;
          display: flex;
          flex-direction: column;
        }

        .pokedex-col-center {
          height: 100%;
          min-height: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
          overflow: hidden;
        }

        .hero-display-area {
          flex: 1 1 auto;
          min-height: 0;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        .hero-evolution-dock {
          flex: 0 0 170px;
          min-height: 170px;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .pokedex-col-info {
          height: 100%;
          min-height: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .info-scroll-area {
          height: 100%;
          min-height: 0;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-right: 4px;
        }

        @media (max-width: 1120px) {
          .pokedex-grid-container {
            grid-template-columns: 260px 1fr;
            grid-template-rows: 1fr;
          }
          .pokedex-col-info {
            grid-column: 1 / -1;
            height: auto;
            max-height: 400px;
          }
          .pokedex-fullscreen-layout {
            overflow-y: auto;
            height: auto;
            min-height: 100vh;
          }
        }

        @media (max-width: 768px) {
          .pokedex-grid-container {
            display: flex;
            flex-direction: column;
            gap: 14px;
            padding: 10px;
            overflow-y: auto;
            height: auto;
          }
          .pokedex-col-selector,
          .pokedex-col-center,
          .pokedex-col-info {
            height: auto;
            min-height: auto;
          }
          .hero-scroll-area,
          .info-scroll-area {
            overflow-y: visible;
            height: auto;
          }
        }
      `}</style>
    </div>
  );
};
