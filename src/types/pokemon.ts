export interface PokemonType {
  slug: string;
  nome: string;
  cor: string;
  ordem: number;
}

export interface Fraqueza {
  tipo: string;
  tipoSlug: string;
  ordem: number;
  multiplicador: number;
}

export interface Pokemon {
  pokemonId: number;
  slug: string;
  speciesId: number;
  isDefault: boolean;
  formaSlug: string;
  isMega: boolean;
  alturaM: number;
  pesoKg: number;
  tipo1: string;
  tipo1Slug: string;
  cor1: string;
  tipo2: string | null;
  tipo2Slug: string | null;
  cor2: string | null;
  hp: number;
  ataque: number;
  defesa: number;
  atqEsp: number;
  defEsp: number;
  velocidade: number;
  total: number;
  slugEspecie: string;
  nomeEspecie: string;
  categoria: string;
  descricao: string;
  geracao: number;
  regiao: string;
  geracaoLabel: string;
  chainId: number;
  evoluiDe: number | null;
  nivelEvolucao: number | null;
  lendario: boolean;
  mitico: boolean;
  estagio: number;
  estagiosCadeia: number;
  forma: string;
  nome: string;
  numero: string;
  raridade: string;
  especial: string;
  tagCarta: string;
  ordemDex: number;
  imgArte: string;
  imgHome: string;
  imgSprite: string;
  imgGif: string;
  imgArteShiny: string;
  imgHomeShiny: string;
  imgGifShiny: string;
  fraquezas: Fraqueza[];
}

export interface CartaTCG {
  id: string;
  nome: string;
  raridade: string;
  raridadePT: string;
  raridadeOrdem: number;
  numero: string;
  colecao: string;
  serie: string;
  lancamento: string;
  img: string;
  imgGrande: string;
  tagForma: string;
}

export interface Golpe {
  t: string;       // tipo slug
  c: 'F' | 'E';    // categoria: Físico ou Especial
  papel: 'forte' | 'medio' | 'prio';
  nome: string;
  pw: number;      // poder
  ac: number;      // precisao (0 = nunca erra)
  pr: number;      // prioridade (1 ou 0)
}

export interface ArenaDados {
  v: number;
  pk: Array<[
    number,  // 0: id
    string,  // 1: nome
    number,  // 2: especie id
    string,  // 3: tipo 1
    string | null, // 4: tipo 2
    number,  // 5: hp
    number,  // 6: atk
    number,  // 7: def
    number,  // 8: spa
    number,  // 9: spd
    number,  // 10: spe
    number,  // 11: padrao (1/0)
    number,  // 12: geracao
    number   // 13: lendario/mitico (1/0)
  ]>;
  ef: Record<string, number>;
  gp: Array<[string, 'F' | 'E', 'forte' | 'medio' | 'prio', string, number, number, number]>;
  tp: Record<string, [string, string]>; // slug -> [nome, cor]
}
