import arenaDataRaw from '../data/arena_dados.json';
import { ArenaDados, Golpe } from '../types/pokemon';

export const ARENA_DADOS = arenaDataRaw as unknown as ArenaDados;
export const NIVEL = 50;

export interface Combatant {
  id: number;
  nome: string;
  esp: number;
  t: string[];
  b: { hp: number; atk: number; def: number; spa: number; spd: number; spe: number };
  total: number;
  padrao: boolean;
  gen: number;
  lend: boolean;
  st: { hp: number; atk: number; def: number; spa: number; spd: number; spe: number };
  hpMax: number;
  hp: number;
  golpes: Golpe[];
  base?: any;
  forma?: 'mega' | 'gmax' | null;
  gmax?: number;
}

export interface TeamSide {
  time: Combatant[];
  ativo: number;
  transformou: boolean;
}

// Mapa de Golpes estruturado
const G: Record<string, Golpe> = {};
ARENA_DADOS.gp.forEach((r) => {
  G[`${r[0]}|${r[1]}|${r[2]}`] = {
    t: r[0],
    c: r[1],
    papel: r[2],
    nome: r[3],
    pw: r[4],
    ac: r[5],
    pr: r[6],
  };
});

// Mapa de Pokémons da Arena
export const POKEMON_ARENA_MAP: Record<number, any> = {};
export const POKEMON_ARENA_LIST: any[] = [];

ARENA_DADOS.pk.forEach((r) => {
  const p = {
    id: r[0],
    nome: r[1],
    esp: r[2],
    t: r[4] ? [r[3], r[4]] : [r[3]],
    b: { hp: r[5], atk: r[6], def: r[7], spa: r[8], spd: r[9], spe: r[10] },
    padrao: r[11] === 1,
    gen: r[12] || 0,
    lend: r[13] === 1,
    total: r[5] + r[6] + r[7] + r[8] + r[9] + r[10],
  };
  POKEMON_ARENA_MAP[p.id] = p;
  POKEMON_ARENA_LIST.push(p);
});

export function ef(a: string, d: string): number {
  const x = ARENA_DADOS.ef[`${a}>${d}`];
  return x === undefined ? 1 : x;
}

export function efTotal(tipo: string, tiposDef: string[]): number {
  return tiposDef.reduce((m, d) => m * ef(tipo, d), 1);
}

export function corTipo(t: string): string {
  return (ARENA_DADOS.tp[t] || ['', '#888'])[1];
}

export function nomeTipo(t: string): string {
  return (ARENA_DADOS.tp[t] || [t])[0];
}

export function golpe(t: string, c: 'F' | 'E', papel: 'forte' | 'medio' | 'prio'): Golpe | null {
  return (
    G[`${t}|${c}|${papel}`] ||
    G[`${t}|${c === 'F' ? 'E' : 'F'}|${papel}`] ||
    null
  );
}

export function golpesDe(p: any): Golpe[] {
  const cat: 'F' | 'E' = p.b.atk >= p.b.spa ? 'F' : 'E';
  const outra: 'F' | 'E' = cat === 'F' ? 'E' : 'F';
  const t1 = p.t[0];
  const t2 = p.t[1];

  const cand: (Golpe | null)[] = [
    golpe(t1, cat, 'forte'),
    t2 ? golpe(t2, cat, 'forte') : golpe(t1, outra, 'forte'),
    golpe(t1, cat, 'medio'),
    G[`${t1}|F|prio`] || (t2 && G[`${t2}|F|prio`]) || G['normal|F|prio'],
    golpe('normal', cat, 'forte'),
    golpe('normal', cat, 'medio'),
  ];

  const vistos: Record<string, boolean> = {};
  const out: Golpe[] = [];
  cand.forEach((g) => {
    if (g && !vistos[g.nome] && out.length < 4) {
      vistos[g.nome] = true;
      out.push(g);
    }
  });
  return out;
}

export function statusDe(b: { hp: number; atk: number; def: number; spa: number; spd: number; spe: number }) {
  const f = (x: number) => Math.floor(((2 * x + 31) * NIVEL) / 100) + 5;
  return {
    hp: Math.floor(((2 * b.hp + 31) * NIVEL) / 100) + NIVEL + 10,
    atk: f(b.atk),
    def: f(b.def),
    spa: f(b.spa),
    spd: f(b.spd),
    spe: f(b.spe),
  };
}

export function criarLutador(id: number): Combatant {
  const p = POKEMON_ARENA_MAP[id] || POKEMON_ARENA_LIST[0];
  const st = statusDe(p.b);
  return {
    ...p,
    st,
    hpMax: st.hp,
    hp: st.hp,
    golpes: golpesDe(p),
  };
}

export function criarLado(ids: number[]): TeamSide {
  return {
    time: ids.map(criarLutador),
    ativo: 0,
    transformou: false,
  };
}

export function ativo(l: TeamSide): Combatant {
  return l.time[l.ativo];
}

export function vivos(l: TeamSide): Combatant[] {
  return l.time.filter((m) => m.hp > 0);
}

export function formasDe(p: Combatant, tipo: 'mega' | 'gmax'): any[] {
  const chave = tipo === 'mega' ? ' Mega' : ' Gigantamax';
  return POKEMON_ARENA_LIST.filter(
    (x) => x.esp === p.esp && !x.padrao && x.nome.indexOf(chave) > 0
  );
}

export function opcoesTransformar(l: TeamSide): Array<{ tipo: 'mega' | 'gmax'; p: any }> {
  const m = ativo(l);
  if (l.transformou || m.hp <= 0 || m.base) return [];
  const megas = formasDe(m, 'mega').map((f) => ({ tipo: 'mega' as const, p: f }));
  const gmaxs = formasDe(m, 'gmax').map((f) => ({ tipo: 'gmax' as const, p: f }));
  return [...megas, ...gmaxs];
}

export function aplicarForma(m: Combatant, op: { tipo: 'mega' | 'gmax'; p: any }) {
  const razao = m.hp / m.hpMax;
  m.base = { ...m };
  m.forma = op.tipo;
  m.t = op.p.t;
  m.nome = op.p.nome;
  m.st = statusDe(op.p.b);
  m.hpMax = m.st.hp;
  m.golpes = golpesDe(op.p);

  if (op.tipo === 'gmax') {
    m.hpMax *= 2;
    m.gmax = 3;
    m.golpes = m.golpes.map((g) => ({
      t: g.t,
      c: g.c,
      papel: g.papel,
      nome: `Max ${nomeTipo(g.t)}`,
      pw: Math.round(g.pw * 1.3),
      ac: 0,
      pr: 0,
    }));
  }
  m.hp = Math.max(1, Math.round(razao * m.hpMax));
}

export function desfazerGmax(m: Combatant) {
  if (!m.base) return;
  const razao = m.hp / m.hpMax;
  const base = m.base;
  m.t = base.t;
  m.nome = base.nome;
  m.st = statusDe(base.b);
  m.hpMax = m.st.hp;
  m.golpes = golpesDe(base);
  m.gmax = 0;
  m.base = null;
  m.forma = null;
  m.hp = m.hp <= 0 ? 0 : Math.max(1, Math.round(razao * m.hpMax));
}

export function danoBase(a: Combatant, d: Combatant, g: Golpe): number {
  const A = g.c === 'F' ? a.st.atk : a.st.spa;
  const Df = g.c === 'F' ? d.st.def : d.st.spd;
  return Math.floor(Math.floor(Math.floor(((2 * NIVEL) / 5 + 2) * g.pw * A) / Df) / 50) + 2;
}

export function calcularAtaque(
  a: Combatant,
  d: Combatant,
  g: Golpe
): { erro: boolean; dano: number; ef: number; crit: boolean } {
  const e = efTotal(g.t, d.t);
  if (!(g.ac === 0 || Math.random() * 100 < g.ac)) {
    return { erro: true, dano: 0, ef: e, crit: false };
  }
  const stab = a.t.includes(g.t) ? 1.5 : 1;
  const crit = Math.random() < 1 / 24;
  const dano =
    e === 0
      ? 0
      : Math.max(
          1,
          Math.floor(danoBase(a, d, g) * stab * e * (crit ? 1.5 : 1) * (0.85 + Math.random() * 0.15))
        );
  return { erro: false, dano, ef: e, crit };
}

export function esperado(a: Combatant, d: Combatant, g: Golpe): number {
  const stab = a.t.includes(g.t) ? 1.5 : 1;
  return danoBase(a, d, g) * stab * efTotal(g.t, d.t) * (g.ac === 0 ? 1 : g.ac / 100) * 0.925;
}

export function melhorEsperado(a: Combatant, d: Combatant): number {
  return Math.max(...a.golpes.map((g) => esperado(a, d, g)));
}

export function iaEscolherGolpe(a: Combatant, d: Combatant): number {
  const rapido = a.st.spe >= d.st.spe;
  let melhor = 0;
  let nota = -1;
  a.golpes.forEach((g, i) => {
    let v = esperado(a, d, g);
    if (g.pr > 0 && !rapido && v >= d.hp) {
      v += 1000;
    }
    v *= 0.9 + Math.random() * 0.2;
    if (v > nota) {
      nota = v;
      melhor = i;
    }
  });
  return melhor;
}

export function iaMelhorReserva(l: TeamSide, foe: Combatant): number {
  let melhor = -1;
  let nota = -1e9;
  l.time.forEach((m, i) => {
    if (m.hp <= 0 || i === l.ativo) return;
    const v = melhorEsperado(m, foe) / foe.hp - melhorEsperado(foe, m) / m.hp;
    if (v > nota) {
      nota = v;
      melhor = i;
    }
  });
  return melhor;
}

export function iaDecidirAcao(
  l: TeamSide,
  foeLado: TeamSide
): { tipo: 'troca'; indice: number } | { tipo: 'golpe'; indice: number } {
  const eu = ativo(l);
  const foe = ativo(foeLado);
  if (vivos(l).length > 1) {
    const ameaca = melhorEsperado(foe, eu) / eu.hp;
    const forca = melhorEsperado(eu, foe) / foe.hp;
    if (ameaca > 0.8 && forca < 0.4 && Math.random() < 0.75) {
      const troca = iaMelhorReserva(l, foe);
      if (troca >= 0) return { tipo: 'troca', indice: troca };
    }
  }
  return { tipo: 'golpe', indice: iaEscolherGolpe(eu, foe) };
}

// Simulação de Monte Carlo para 1.000 batalhas
export function simular1000Batalhas(timeJogadorIds: number[], timeCpuIds: number[]): number {
  let vitorias = 0;
  const IT = 1000;

  for (let s = 0; s < IT; s++) {
    const l1 = criarLado(timeJogadorIds);
    const l2 = criarLado(timeCpuIds);
    let rounds = 0;

    while (vivos(l1).length > 0 && vivos(l2).length > 0 && rounds < 100) {
      rounds++;
      const m1 = ativo(l1);
      const m2 = ativo(l2);

      const g1Idx = iaEscolherGolpe(m1, m2);
      const g2Idx = iaEscolherGolpe(m2, m1);

      const g1 = m1.golpes[g1Idx];
      const g2 = m2.golpes[g2Idx];

      const p1 = g1.pr;
      const p2 = g2.pr;
      const rapido = p1 !== p2 ? p1 > p2 : m1.st.spe !== m2.st.spe ? m1.st.spe > m2.st.spe : Math.random() < 0.5;

      const primeiro = rapido ? { a: m1, d: m2, g: g1, lD: l2 } : { a: m2, d: m1, g: g2, lD: l1 };
      const segundo = rapido ? { a: m2, d: m1, g: g2, lD: l1 } : { a: m1, d: m2, g: g1, lD: l2 };

      // Primeiro ataca
      const res1 = calcularAtaque(primeiro.a, primeiro.d, primeiro.g);
      primeiro.d.hp = Math.max(0, primeiro.d.hp - res1.dano);

      if (primeiro.d.hp <= 0) {
        // Desmaiou, troca se houver reserva
        const vivo = primeiro.lD.time.findIndex((x) => x.hp > 0);
        if (vivo >= 0) primeiro.lD.ativo = vivo;
        continue;
      }

      // Segundo ataca
      const res2 = calcularAtaque(segundo.a, segundo.d, segundo.g);
      segundo.d.hp = Math.max(0, segundo.d.hp - res2.dano);

      if (segundo.d.hp <= 0) {
        const vivo = segundo.lD.time.findIndex((x) => x.hp > 0);
        if (vivo >= 0) segundo.lD.ativo = vivo;
      }
    }

    if (vivos(l1).length > 0) {
      vitorias++;
    }
  }

  return (vitorias / IT) * 100;
}
