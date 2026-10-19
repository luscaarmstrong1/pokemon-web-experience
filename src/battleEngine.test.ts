import { describe, it, expect } from 'vitest';
import {
  ef,
  efTotal,
  danoBase,
  statusDe,
  criarLutador,
  calcularAtaque,
} from '../src/engines/battleEngine';

describe('Engine de Batalha e Regras Pokémon', () => {
  it('deve calcular a eficácia correta dos tipos elementares', () => {
    // Água causa dano super efetivo em Fogo (2x)
    expect(ef('water', 'fire')).toBe(2);
    // Fogo causa dano não muito efetivo em Água (0.5x)
    expect(ef('fire', 'water')).toBe(0.5);
    // Elétrico não tem efeito em Terrestre (0x)
    expect(ef('electric', 'ground')).toBe(0);
  });

  it('deve calcular multiplicador composto para Pokémon com 2 tipos', () => {
    // Charizard é Fogo / Voador:
    // Água causa 2x em Fogo e 1x em Voador => 2x
    expect(efTotal('water', ['fire', 'flying'])).toBe(2);
    // Pedra causa 2x em Fogo e 2x em Voador => 4x
    expect(efTotal('rock', ['fire', 'flying'])).toBe(4);
    // Planta causa 0.5x em Fogo e 0.5x em Voador => 0.25x
    expect(efTotal('grass', ['fire', 'flying'])).toBe(0.25);
    // Terrestre não afeta Voador (0x) => 0x
    expect(efTotal('ground', ['fire', 'flying'])).toBe(0);
  });

  it('deve calcular os atributos exatos de Nível 50', () => {
    // Exemplo: base stat 100
    const b = { hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100 };
    const st = statusDe(b);
    // HP: floor((2 * 100 + 31) * 50 / 100) + 50 + 10 = 115 + 60 = 175
    expect(st.hp).toBe(175);
    // Stats: floor((2 * 100 + 31) * 50 / 100) + 5 = 115 + 5 = 120
    expect(st.atk).toBe(120);
  });

  it('deve calcular dano base maior que zero em ataques normais', () => {
    const charizard = criarLutador(6);
    const blastoise = criarLutador(9);
    const golpe = charizard.golpes[0];

    const dano = danoBase(charizard, blastoise, golpe);
    expect(dano).toBeGreaterThan(0);
  });
});
