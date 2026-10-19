export interface ArenaCenario {
  id: string;
  nome: string;
  descricao: string;
  bgGradiente: string;
  pisoGradiente: string;
  particulaTipo: 'brasas' | 'folhas' | 'bolhas' | 'cristais' | 'raios' | 'neve' | 'poeira' | 'sombras' | 'neon' | 'estrelas';
  corDestaque: string;
  climaPadrao: 'limpo' | 'chuva' | 'sol' | 'neve' | 'tempestade' | 'nevoa';
  elementosVisuais: string[];
}

export const ARENAS_TEMATICAS: ArenaCenario[] = [
  {
    id: 'estadio',
    nome: 'Estádio Pokémon Clássico',
    descricao: 'Campo de batalha oficial com refletores, arquibancadas e telões.',
    bgGradiente: 'radial-gradient(circle at 50% 25%, #1E3A8A 0%, #0F172A 70%, #020617 100%)',
    pisoGradiente: 'linear-gradient(180deg, #10B981 0%, #059669 45%, #047857 100%)',
    particulaTipo: 'estrelas',
    corDestaque: '#3B82F6',
    climaPadrao: 'limpo',
    elementosVisuais: ['refletores', 'telao', 'linhas_campo'],
  },
  {
    id: 'viridian',
    nome: 'Floresta de Viridian',
    descricao: 'Árvores frondosas, folhas em suspensão e iluminação solar natural.',
    bgGradiente: 'radial-gradient(circle at 50% 30%, #166534 0%, #14532D 60%, #052E16 100%)',
    pisoGradiente: 'linear-gradient(180deg, #22C55E 0%, #15803D 50%, #166534 100%)',
    particulaTipo: 'folhas',
    corDestaque: '#4ADE80',
    climaPadrao: 'sol',
    elementosVisuais: ['arvores_camadas', 'folhas_vento', 'raios_luz'],
  },
  {
    id: 'vulcao',
    nome: 'Cratera Vulcânica',
    descricao: 'Rochas de magma incandescente, calor sufocante e brasas voláteis.',
    bgGradiente: 'radial-gradient(circle at 50% 40%, #991B1B 0%, #7F1D1D 50%, #450A0A 100%)',
    pisoGradiente: 'linear-gradient(180deg, #DC2626 0%, #B91C1C 40%, #7F1D1D 100%)',
    particulaTipo: 'brasas',
    corDestaque: '#EF4444',
    climaPadrao: 'sol',
    elementosVisuais: ['fissuras_magma', 'fumaca_vulcanica', 'brilho_calor'],
  },
  {
    id: 'oceano',
    nome: 'Praia e Oceano Tropical',
    descricao: 'Ondas oceânicas límpidas, brisa marítima e reflexos cintilantes.',
    bgGradiente: 'radial-gradient(circle at 50% 35%, #0284C7 0%, #0369A1 50%, #082F49 100%)',
    pisoGradiente: 'linear-gradient(180deg, #FDE047 0%, #EAB308 30%, #38BDF8 60%, #0284C7 100%)',
    particulaTipo: 'bolhas',
    corDestaque: '#38BDF8',
    climaPadrao: 'chuva',
    elementosVisuais: ['espuma_mar', 'areia_dourada', 'reflexo_agua'],
  },
  {
    id: 'caverna',
    nome: 'Caverna de Cristais Luminosos',
    descricao: 'Ambiente subterrâneo resplandecente com cristais que emitem fluorescência.',
    bgGradiente: 'radial-gradient(circle at 50% 30%, #581C87 0%, #3B0764 55%, #18022B 100%)',
    pisoGradiente: 'linear-gradient(180deg, #9333EA 0%, #6B21A8 50%, #3B0764 100%)',
    particulaTipo: 'cristais',
    corDestaque: '#C084FC',
    climaPadrao: 'nevoa',
    elementosVisuais: ['estalactites', 'gemas_brilhantes', 'nevoa_mistica'],
  },
  {
    id: 'neve',
    nome: 'Montanha Nevada de Sinnoh',
    descricao: 'Cumes gelados com nevasca perpétua e cristais de gelo cortantes.',
    bgGradiente: 'radial-gradient(circle at 50% 30%, #38BDF8 0%, #0284C7 45%, #0F172A 100%)',
    pisoGradiente: 'linear-gradient(180deg, #F8FAFC 0%, #E2E8F0 45%, #CBD5E1 100%)',
    particulaTipo: 'neve',
    corDestaque: '#BAE6FD',
    climaPadrao: 'neve',
    elementosVisuais: ['nevasca_particulas', 'montanhas_fundo', 'geada'],
  },
  {
    id: 'deserto',
    nome: 'Deserto de Hoenn',
    descricao: 'Dunas infinitas com tempestade de areia e sol escaldante.',
    bgGradiente: 'radial-gradient(circle at 50% 40%, #B45309 0%, #92400E 50%, #451A03 100%)',
    pisoGradiente: 'linear-gradient(180deg, #FDE68A 0%, #F59E0B 40%, #D97706 100%)',
    particulaTipo: 'poeira',
    corDestaque: '#FBBF24',
    climaPadrao: 'sol',
    elementosVisuais: ['dunas_parallax', 'turbilhao_areia', 'calor_ondulante'],
  },
  {
    id: 'ruinas',
    nome: 'Ruínas Fantasmas Ancestrais',
    descricao: 'Pilares caídos, névoa espectral e orbes de espíritos errantes.',
    bgGradiente: 'radial-gradient(circle at 50% 35%, #4A044E 0%, #2E1065 55%, #0F051D 100%)',
    pisoGradiente: 'linear-gradient(180deg, #6B21A8 0%, #4C1D95 50%, #1E1B4B 100%)',
    particulaTipo: 'sombras',
    corDestaque: '#E879F9',
    climaPadrao: 'nevoa',
    elementosVisuais: ['pilares_derruidos', 'fogos_fatuos', 'runas_antigas'],
  },
  {
    id: 'laboratorio',
    nome: 'Laboratório Silph Co. Tech',
    descricao: 'Piso de contenção metálico, painéis holográficos e matrizes quânticas.',
    bgGradiente: 'radial-gradient(circle at 50% 30%, #0369A1 0%, #0F172A 60%, #020617 100%)',
    pisoGradiente: 'linear-gradient(180deg, #334155 0%, #1E293B 50%, #0F172A 100%)',
    particulaTipo: 'raios',
    corDestaque: '#00F0FF',
    climaPadrao: 'limpo',
    elementosVisuais: ['circuitos_piso', 'holograma_hud', 'luzes_led'],
  },
  {
    id: 'campeao',
    nome: 'Arena do Campeão Supremo',
    descricao: 'O palco supremo dos Mestres Pokémon, cercado por milhares de espectadores e efeitos dourados.',
    bgGradiente: 'radial-gradient(circle at 50% 25%, #854D0E 0%, #1E1B4B 50%, #09090B 100%)',
    pisoGradiente: 'linear-gradient(180deg, #FEF08A 0%, #EAB308 30%, #713F12 100%)',
    particulaTipo: 'estrelas',
    corDestaque: '#FFCB05',
    climaPadrao: 'limpo',
    elementosVisuais: ['fogos_artificio', 'estatua_campeao', 'aura_dourada'],
  },
];
