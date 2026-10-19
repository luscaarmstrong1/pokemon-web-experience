export interface SafariRegion {
  id: string;
  nome: string;
  subtitulo: string;
  largura: number; // ex: 80
  altura: number;  // ex: 60
  corFundo: string;
  corCaminho: string;
  corObstaculo: string;
  corMato: string;
  corAgua: string;
  bioma: 'vila' | 'floresta' | 'montanha' | 'praia' | 'ruinas';
  clima: 'sol' | 'chuva' | 'nevoa' | 'vento' | 'espectral';
  npcs: Array<{ x: number; y: number; nome: string; fala: string; sprite: string }>;
  encontrosRaros: number[]; // IDs de Pokémon específicos dessa região
  mapaLinhas: string[];
}

// Gerador procedural de mapas 80x60 para cada região
function gerarMapaRegiao(
  bioma: 'vila' | 'floresta' | 'montanha' | 'praia' | 'ruinas',
  W = 80,
  H = 60
): string[] {
  const mapa: string[][] = [];

  for (let y = 0; y < H; y++) {
    const linha: string[] = [];
    for (let x = 0; x < W; x++) {
      // Bordas do mapa sempre parede/árvores 't' exceto saídas
      const borda = x === 0 || x === W - 1 || y === 0 || y === H - 1;
      const saidaNorte = y === 0 && x >= 38 && x <= 42;
      const saidaSul = y === H - 1 && x >= 38 && x <= 42;
      const saidaLeste = x === W - 1 && y >= 28 && y <= 32;
      const saidaOeste = x === 0 && y >= 28 && y <= 32;

      if (borda && !(saidaNorte || saidaSul || saidaLeste || saidaOeste)) {
        linha.push('t');
        continue;
      }

      if (saidaNorte || saidaSul || saidaLeste || saidaOeste) {
        linha.push('c'); // Caminho de passagem entre regiões
        continue;
      }

      // Vias centrais pavimentadas
      const naCruz = (x >= 38 && x <= 42) || (y >= 28 && y <= 32);

      if (bioma === 'vila') {
        // Casas 'H', Flores 'f', Caminhos 'c', Grama '.'
        if (naCruz) {
          linha.push('c');
        } else if ((x >= 15 && x <= 22 && y >= 12 && y <= 18) || (x >= 55 && x <= 62 && y >= 12 && y <= 18) || (x >= 20 && x <= 27 && y >= 40 && y <= 46)) {
          // Casas
          linha.push(x === 18 && y === 18 ? 'D' : 'H');
        } else if ((x % 6 === 0) && (y % 6 === 0)) {
          linha.push('f');
        } else if (Math.random() < 0.12 && x > 45 && y > 35) {
          linha.push('m'); // Pequena reserva de grama
        } else {
          linha.push('.');
        }
      } else if (bioma === 'floresta') {
        // Floresta densa com muito mato alto 'm', árvores 't', lagos 'a'
        if (naCruz && Math.random() < 0.85) {
          linha.push('c');
        } else if ((x - 20) ** 2 + (y - 45) ** 2 < 49 || (x - 65) ** 2 + (y - 20) ** 2 < 36) {
          linha.push('a'); // Lagos naturais
        } else if (Math.random() < 0.42) {
          linha.push('m'); // Mato alto selvagem
        } else if (Math.random() < 0.18) {
          linha.push('t'); // Árvores espalhadas
        } else if (Math.random() < 0.05) {
          linha.push('f'); // Flores silvestres
        } else {
          linha.push('.');
        }
      } else if (bioma === 'montanha') {
        // Rochas 'r', Cavernas 'H', Cristais 'f', Caminhos rochosos 'c'
        if (naCruz) {
          linha.push('c');
        } else if ((x - 40) ** 2 + (y - 20) ** 2 < 64) {
          linha.push('r'); // Formação rochosa maciça
        } else if (Math.random() < 0.28) {
          linha.push('r');
        } else if (Math.random() < 0.25) {
          linha.push('m');
        } else {
          linha.push('.');
        }
      } else if (bioma === 'praia') {
        // Mar profundo 'a', Areia '.', Mato costeiro 'm', Coqueiros 't'
        if (x < 18) {
          linha.push('a'); // Oceano
        } else if (x >= 18 && x <= 22) {
          linha.push(y % 7 === 0 ? 'c' : '.'); // Orla da praia
        } else if (naCruz) {
          linha.push('c');
        } else if (Math.random() < 0.25) {
          linha.push('m');
        } else if (Math.random() < 0.08) {
          linha.push('t');
        } else {
          linha.push('.');
        }
      } else {
        // Ruínas Misteriosas: Pilares 'r', Fogueiras 'H', Névoa, Mato antigo 'm'
        if (naCruz) {
          linha.push('c');
        } else if ((x % 8 === 0) && (y % 8 === 0)) {
          linha.push('r'); // Pilares ancestrais
        } else if (Math.random() < 0.35) {
          linha.push('m');
        } else if (Math.random() < 0.06) {
          linha.push('H');
        } else {
          linha.push('.');
        }
      }
    }
    mapa.push(linha);
  }

  return mapa.map((l) => l.join(''));
}

export const SAFARI_REGIOES: SafariRegion[] = [
  {
    id: 'vila',
    nome: 'Vila Inicial de Pallet',
    subtitulo: 'Centro de Apoio e Treinamento Pokémon',
    largura: 80,
    altura: 60,
    corFundo: '#2D8A4E',
    corCaminho: '#D8B168',
    corObstaculo: '#144A29',
    corMato: '#1F6B38',
    corAgua: '#2B75BB',
    bioma: 'vila',
    clima: 'sol',
    encontrosRaros: [25, 133, 1, 4, 7], // Pikachu, Eevee, Bulbasaur, Charmander, Squirtle
    npcs: [
      {
        x: 42,
        y: 29,
        nome: 'Professor Carvalho',
        fala: 'Bem-vindo ao Safari Expandido! Use WASD ou as setas para explorar as 5 regiões interligadas!',
        sprite: 'prof',
      },
      {
        x: 20,
        y: 20,
        nome: 'Guia da Vila',
        fala: 'Para o Norte fica a Grande Floresta; para o Leste, a Costa e a Praia!',
        sprite: 'guia',
      },
    ],
    mapaLinhas: gerarMapaRegiao('vila'),
  },
  {
    id: 'floresta',
    nome: 'Grande Floresta de Viridian',
    subtitulo: 'Santuário Natural de Pokémon Inseto e Planta',
    largura: 80,
    altura: 60,
    corFundo: '#1C5B32',
    corCaminho: '#B08850',
    corObstaculo: '#0E361C',
    corMato: '#134724',
    corAgua: '#1D639E',
    bioma: 'floresta',
    clima: 'vento',
    encontrosRaros: [123, 127, 212, 214, 251], // Scyther, Pinsir, Scizor, Heracross, Celebi
    npcs: [
      {
        x: 40,
        y: 30,
        nome: 'Guarda Florestal',
        fala: 'O mato alto desta floresta esconde espécies raríssimas! Fique atento aos movimentos.',
        sprite: 'guarda',
      },
    ],
    mapaLinhas: gerarMapaRegiao('floresta'),
  },
  {
    id: 'montanha',
    nome: 'Picos Rochosos & Cavernas',
    subtitulo: 'Desfiladeiros de Pedra, Fósseis e Tesouros',
    largura: 80,
    altura: 60,
    corFundo: '#695E50',
    corCaminho: '#A89F91',
    corObstaculo: '#3D3429',
    corMato: '#4D5E3B',
    corAgua: '#3B738F',
    bioma: 'montanha',
    clima: 'chuva',
    encontrosRaros: [95, 246, 248, 448, 142], // Onix, Larvitar, Tyranitar, Lucario, Aerodactyl
    npcs: [
      {
        x: 40,
        y: 31,
        nome: 'Montanhista Bruno',
        fala: 'Aqui em cima o ar é rarefeito e as rochas guardam Pokémon do tipo Pedra e Dragão!',
        sprite: 'montanhista',
      },
    ],
    mapaLinhas: gerarMapaRegiao('montanha'),
  },
  {
    id: 'praia',
    nome: 'Costa Tropical de Cinnabar',
    subtitulo: 'Águas Cristalinas e Ilhas Selvagens',
    largura: 80,
    altura: 60,
    corFundo: '#D4B87A',
    corCaminho: '#EAD7A4',
    corObstaculo: '#1E693D',
    corMato: '#3E8C4A',
    corAgua: '#1E88E5',
    bioma: 'praia',
    clima: 'sol',
    encontrosRaros: [130, 131, 148, 382, 395], // Gyarados, Lapras, Dragonair, Kyogre, Empoleon
    npcs: [
      {
        x: 39,
        y: 29,
        nome: 'Pescador Ned',
        fala: 'As ondas aqui trazem espécies magníficas do mar profundo. Experimente usar a Ultra Bola!',
        sprite: 'pescador',
      },
    ],
    mapaLinhas: gerarMapaRegiao('praia'),
  },
  {
    id: 'ruinas',
    nome: 'Ruínas Antigas de Alph',
    subtitulo: 'Monólitos Espectrais e Segredos Milenares',
    largura: 80,
    altura: 60,
    corFundo: '#2D223B',
    corCaminho: '#69587D',
    corObstaculo: '#1A1224',
    corMato: '#442B59',
    corAgua: '#473A75',
    bioma: 'ruinas',
    clima: 'espectral',
    encontrosRaros: [94, 201, 354, 442, 491], // Gengar, Unown, Banette, Spiritomb, Darkrai
    npcs: [
      {
        x: 40,
        y: 30,
        nome: 'Arqueólogo Lucas',
        fala: 'Dizem que lendas antigas despertam nestas ruínas sob a névoa...',
        sprite: 'arqueologo',
      },
    ],
    mapaLinhas: gerarMapaRegiao('ruinas'),
  },
];
