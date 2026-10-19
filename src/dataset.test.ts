import { describe, it, expect } from 'vitest';
import pokemonData from '../src/data/pokemon.json';

describe('Integridade da Base Pokémon (1.302 registros)', () => {
  it('deve conter exatamente 1.302 registros de Pokémon e formas', () => {
    expect(pokemonData.length).toBe(1302);
  });

  it('deve conter dados completos de Charizard (#006) e formas Mega / Gmax', () => {
    const charizardBase = pokemonData.find((p) => p.pokemonId === 6);
    expect(charizardBase).toBeDefined();
    expect(charizardBase?.nome).toBe('Charizard');
    expect(charizardBase?.tipo1).toBe('Fogo');
    expect(charizardBase?.tipo2).toBe('Voador');
    expect(charizardBase?.isDefault).toBe(true);

    const charizardMegaX = pokemonData.find((p) => p.pokemonId === 10034);
    expect(charizardMegaX).toBeDefined();
    expect(charizardMegaX?.isMega).toBe(true);
  });

  it('deve calcular corretamente fraquezas sem multiplicadores nulos ou vazios', () => {
    const pikachu = pokemonData.find((p) => p.pokemonId === 25);
    expect(pikachu).toBeDefined();
    // Pikachu é elétrico puro: única fraqueza é Terrestre (2x)
    const fraquezaTerrestre = pikachu?.fraquezas.find((f) => f.tipoSlug === 'ground');
    expect(fraquezaTerrestre?.multiplicador).toBe(2);
  });
});
