import React, { useState, useEffect } from 'react';
import pokemonDataRaw from '../../data/pokemon.json';
import { Pokemon, CartaTCG } from '../../types/pokemon';
import { DynamicBackground } from '../../components/Pokedex/DynamicBackground';
import { TopNavigation } from '../../components/Pokedex/TopNavigation';
import { PokemonSelector } from '../../components/Pokedex/PokemonSelector';
import { PokemonHero } from '../../components/Pokedex/PokemonHero';
import { ModeSelector } from '../../components/Pokedex/ModeSelector';
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
    <div className="pk-palco">
      {/* Fundo Dinâmico com Partículas por Tipo */}
      <DynamicBackground
        tipo1Slug={selectedPokemon.tipo1Slug}
        tipo2Slug={selectedPokemon.tipo2Slug}
        speciesId={selectedPokemon.speciesId}
        isShiny={modo === 2}
      />

      {/* Topo: Navegação e Marca Pokédex */}
      <TopNavigation totalPokemon={allPokemonList.length} />

      {/* Segmentador de Modos: Normal / Shiny / Cartas */}
      <ModeSelector modo={modo} onChangeModo={setModo} />

      {/* Painel Esquerdo: Lista de Pokémon com Busca e Filtros */}
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

      {/* Centro Superior: Hero Stage com Sprite/Arte, Fatos e Galeria de Cartas */}
      <PokemonHero
        pokemon={selectedPokemon}
        modo={modo}
        cartas={currentCards}
        isEvolving={isEvolving}
        prevPokemon={prevPokemon}
      />

      {/* Centro Inferior: Painel de Evolução Interativa */}
      <EvolutionChain
        currentPokemon={selectedPokemon}
        allPokemon={allPokemonList}
        modo={modo}
        onSelectPokemon={handleSelectPokemon}
      />

      {/* Painel Direito Superior: Radar de Atributos SVG e Barras */}
      <StatsRadar pokemon={selectedPokemon} />

      {/* Painel Direito Meio: Fraquezas, Resistências e Imunidades */}
      <WeaknessGrid pokemon={selectedPokemon} />

      {/* Painel Direito Inferior: Formas Alternativas (Mega, Gigantamax, Regionais) */}
      <AlternativeForms
        currentPokemon={selectedPokemon}
        allPokemon={allPokemonList}
        modo={modo}
        onSelectForm={(p) => handleSelectPokemon(p, false)}
      />
    </div>
  );
};
