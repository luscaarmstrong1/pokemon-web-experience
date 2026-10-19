import React, { useState, useEffect, useRef } from 'react';
import { AppHeader } from '../../components/AppHeader';
import pokemonDataRaw from '../../data/pokemon.json';
import { Pokemon } from '../../types/pokemon';
import { SAFARI_REGIOES, SafariRegion } from '../../data/safariRegioes';
import { soundEngine } from '../../engines/soundEngine';
import '../../styles/safari.css';

const allPokes = (pokemonDataRaw as Pokemon[]).filter((p) => p.isDefault);

const TL = 32; // Tamanho do tile em pixels
const VIEWPORT_W = 960;
const VIEWPORT_H = 640;
const TILES_VIEW_X = Math.ceil(VIEWPORT_W / TL); // 30 tiles
const TILES_VIEW_Y = Math.ceil(VIEWPORT_H / TL); // 20 tiles

const COR: Record<string, string> = {
  k: '#1F2028',
  r: '#E8383D',
  R: '#A51D22',
  w: '#F8F8F8',
  s: '#F8C898',
  h: '#5A3418',
  b: '#3A78E0',
  B: '#2650A8',
  g: '#3C4458',
  y: '#F8D030',
};

// Treinador 4 Direções Pixel Art 16x16
const SPRITES_TREINADOR = {
  baixo: [
    '....kkkkkkk.....', '...krrrrrrrk....', '..krrwwrrrrrk...', '..krrrrrrrrrk...',
    '.kRRRRRRRRRRRk..', '..khsssssssshk..', '..ksskssssksk...', '..kssssssssssk..',
    '...ksssssssk....', '..kbbwbbbbwbbk..', '.ksbbwbbbbwbbsk.', '.ksbbbbbbbbbbsk.',
    '..kBBBBBBBBBBk..', '...kggggggggk...', '...kggk..kggk...', '...kkkk..kkkk...'
  ],
  cima: [
    '....kkkkkkk.....', '...krrrrrrrk....', '..krrrrrrrrrk...', '..krrrrrrrrrk...',
    '.kRRRRRRRRRRRk..', '..khhhhhhhhhhk..', '..khhhhhhhhhhk..', '..khhhhhhhhhhk..',
    '...khhhhhhhk....', '..kbbbbbbbbbbk..', '.ksbbbbbbbbbbsk.', '.ksbbbbbbbbbbsk.',
    '..kBBBBBBBBBBk..', '...kggggggggk...', '...kggk..kggk...', '...kkkk..kkkk...'
  ],
  esq: [
    '.....kkkkkk.....', '....krrrrrrk....', '...krrrwwrrk....', '...krrrrrrrk....',
    '..kRRRRRRRRk....', '...khsssssshk...', '...kssksksssk...', '...kssssssssk...',
    '....ksssssk.....', '...kbbbbbbk.....', '..ksbbbbbbk.....', '..ksbbbbbbsk....',
    '...kBBBBBBk.....', '...kgggggk......', '...kggk.kggk....', '...kkk...kkk....'
  ],
  dir: [
    '.....kkkkkk.....', '....krrrrrrk....', '....krrwwrrrk...', '....krrrrrrrk...',
    '....kRRRRRRRRk..', '...khsssssshk...', '...kssskssksk...', '...kssssssssk...',
    '.....ksssssk....', '.....kbbbbbbk...', '.....kbbbbbbsk..', '....ksbbbbbbsk..',
    '.....kBBBBBBk...', '......kgggggk...', '....kggk.kggk...', '....kkk...kkk...'
  ],
};

export const SafariPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Região Atual do Safari
  const [regiaoAtualIdx, setRegiaoAtualIdx] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('pk_safari_regiao') || 0);
    } catch {
      return 0;
    }
  });

  const regiao: SafariRegion = SAFARI_REGIOES[regiaoAtualIdx] || SAFARI_REGIOES[0];

  // Posição no Mapa Expandido (80x60)
  const [posX, setPosX] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('pk_safari_x') || 40);
    } catch {
      return 40;
    }
  });

  const [posY, setPosY] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('pk_safari_y') || 30);
    } catch {
      return 30;
    }
  });

  const [direcao, setDirecao] = useState<'baixo' | 'cima' | 'esq' | 'dir'>('baixo');
  const [passoAnim, setPassoAnim] = useState<number>(0);
  const [npcDialogo, setNpcDialogo] = useState<{ nome: string; fala: string } | null>(null);

  // Inventário e Capturas Persistidas
  const [bolsa, setBolsa] = useState({ poke: 30, grande: 15, ultra: 5, fruta: 20 });
  const [caixa, setCaixa] = useState<Pokemon[]>(() => {
    try {
      const salvo = localStorage.getItem('pk_safari_capturados');
      return salvo ? JSON.parse(salvo) : [];
    } catch {
      return [];
    }
  });

  // Estado de Encontro com Pokémon Selvagem
  const [selvagem, setSelvagem] = useState<{
    pokemon: Pokemon;
    shiny: boolean;
    hpAtual: number;
    capturado: boolean;
    fugiu: boolean;
    balancos: number;
  } | null>(null);

  const [mensagem, setMensagem] = useState<string>('Explore as 5 regiões do Safari. O mato alto esconde Pokémon raros!');
  const [animBola, setAnimBola] = useState<boolean>(false);
  const [mostrarMinimap, setMostrarMinimap] = useState<boolean>(true);
  const [mostrarCaixaModal, setMostrarCaixaModal] = useState<boolean>(false);

  // Persistência local de coordenadas
  useEffect(() => {
    try {
      localStorage.setItem('pk_safari_x', String(posX));
      localStorage.setItem('pk_safari_y', String(posY));
      localStorage.setItem('pk_safari_regiao', String(regiaoAtualIdx));
      localStorage.setItem('pk_safari_capturados', JSON.stringify(caixa));
    } catch {
      // Ignora erro
    }
  }, [posX, posY, regiaoAtualIdx, caixa]);

  // Consulta do Tile no Mapa Expandido
  const tileAt = (x: number, y: number): string => {
    if (x < 0 || x >= regiao.largura || y < 0 || y >= regiao.altura) return 't';
    const linha = regiao.mapaLinhas[y];
    return linha ? linha.charAt(x) : 't';
  };

  const isBloqueado = (c: string) => 'tHrx'.includes(c);

  // Render Loop Canvas com Câmera Centralizada
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, VIEWPORT_W, VIEWPORT_H);

    // Câmera dinâmica suavizada acompanhando o jogador
    const cameraX = Math.max(0, Math.min(regiao.largura * TL - VIEWPORT_W, posX * TL - VIEWPORT_W / 2));
    const cameraY = Math.max(0, Math.min(regiao.altura * TL - VIEWPORT_H, posY * TL - VIEWPORT_H / 2));

    const startCol = Math.floor(cameraX / TL);
    const endCol = Math.min(regiao.largura, startCol + TILES_VIEW_X + 2);
    const startRow = Math.floor(cameraY / TL);
    const endRow = Math.min(regiao.altura, startRow + TILES_VIEW_Y + 2);

    // 1. Renderiza os tiles visíveis na câmera
    for (let y = startRow; y < endRow; y++) {
      for (let x = startCol; x < endCol; x++) {
        const t = tileAt(x, y);
        const drawX = Math.round(x * TL - cameraX);
        const drawY = Math.round(y * TL - cameraY);

        if (t === 'c') {
          // Caminho
          ctx.fillStyle = regiao.corCaminho;
          ctx.fillRect(drawX, drawY, TL, TL);
          ctx.fillStyle = 'rgba(0,0,0,0.06)';
          ctx.fillRect(drawX + 2, drawY + 2, TL - 4, TL - 4);
        } else if (t === 'a') {
          // Água animada
          ctx.fillStyle = regiao.corAgua;
          ctx.fillRect(drawX, drawY, TL, TL);
          ctx.fillStyle = 'rgba(255,255,255,0.2)';
          ctx.fillRect(drawX + 4, drawY + 8, TL - 8, 3);
        } else if (t === 't') {
          // Árvore / Parede
          ctx.fillStyle = regiao.corObstaculo;
          ctx.fillRect(drawX, drawY, TL, TL);
          ctx.fillStyle = 'rgba(255,255,255,0.1)';
          ctx.fillRect(drawX + 4, drawY + 4, TL - 8, TL - 8);
        } else if (t === 'm') {
          // Mato Alto (Local de Encontro)
          ctx.fillStyle = regiao.corMato;
          ctx.fillRect(drawX, drawY, TL, TL);
          ctx.fillStyle = 'rgba(255,255,255,0.18)';
          ctx.fillRect(drawX + 6, drawY + 4, 4, 16);
          ctx.fillRect(drawX + 16, drawY + 8, 4, 16);
        } else if (t === 'r') {
          // Rocha
          ctx.fillStyle = '#64748B';
          ctx.fillRect(drawX, drawY, TL, TL);
          ctx.fillStyle = '#334155';
          ctx.fillRect(drawX + 6, drawY + 6, TL - 12, TL - 12);
        } else if (t === 'f') {
          // Flores
          ctx.fillStyle = regiao.corFundo;
          ctx.fillRect(drawX, drawY, TL, TL);
          ctx.fillStyle = '#F43F5E';
          ctx.beginPath();
          ctx.arc(drawX + TL / 2, drawY + TL / 2, 5, 0, Math.PI * 2);
          ctx.fill();
        } else if (t === 'H' || t === 'D') {
          // Casa / Centro Pokémon
          ctx.fillStyle = '#E11D48';
          ctx.fillRect(drawX, drawY, TL, TL);
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(drawX + 6, drawY + 6, TL - 12, TL - 12);
        } else {
          // Solo padrão do bioma
          ctx.fillStyle = regiao.corFundo;
          ctx.fillRect(drawX, drawY, TL, TL);
        }
      }
    }

    // 2. Renderiza NPCs da Região
    regiao.npcs.forEach((npc) => {
      const npcX = Math.round(npc.x * TL - cameraX);
      const npcY = Math.round(npc.y * TL - cameraY);
      if (npcX >= -TL && npcX <= VIEWPORT_W && npcY >= -TL && npcY <= VIEWPORT_H) {
        ctx.fillStyle = '#FFCB05';
        ctx.beginPath();
        ctx.arc(npcX + 16, npcY + 12, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1E293B';
        ctx.fillRect(npcX + 8, npcY + 16, 16, 16);
        // Balãozinho de diálogo sobre o NPC
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText('💬', npcX + 8, npcY - 4);
      }
    });

    // 3. Renderiza Treinador Pixel Art 16x16 com direção e passo
    const pDrawX = Math.round(posX * TL - cameraX);
    const pDrawY = Math.round(posY * TL - cameraY);
    const spriteLinhas = SPRITES_TREINADOR[direcao] || SPRITES_TREINADOR.baixo;
    const escala = 2;

    for (let y = 0; y < 16; y++) {
      const linha = spriteLinhas[y];
      for (let x = 0; x < 16; x++) {
        const ch = linha.charAt(x);
        if (ch !== '.' && COR[ch]) {
          ctx.fillStyle = COR[ch];
          ctx.fillRect(pDrawX + x * escala, pDrawY + y * escala, escala, escala);
        }
      }
    }
  }, [posX, posY, direcao, passoAnim, regiao, regiaoAtualIdx]);

  // Teclado (WASD / Setas / Espaço para falar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selvagem) return; // Em batalha de captura, não anda

      let dx = 0;
      let dy = 0;
      let dir = direcao;

      if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') {
        dy = -1;
        dir = 'cima';
      } else if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') {
        dy = 1;
        dir = 'baixo';
      } else if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
        dx = -1;
        dir = 'esq';
      } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
        dx = 1;
        dir = 'dir';
      } else if (e.key === ' ' || e.key.toLowerCase() === 'e') {
        // Interagir com NPC adjacente
        const npcProximo = regiao.npcs.find(
          (n) => Math.abs(n.x - posX) <= 1 && Math.abs(n.y - posY) <= 1
        );
        if (npcProximo) {
          soundEngine.playClick();
          setNpcDialogo({ nome: npcProximo.nome, fala: npcProximo.fala });
        } else {
          setNpcDialogo(null);
        }
        return;
      } else {
        return;
      }

      setNpcDialogo(null);
      setDirecao(dir);
      setPassoAnim((p) => (p + 1) % 4);

      const nx = posX + dx;
      const ny = posY + dy;

      // Transição entre regiões nas extremidades
      if (ny < 0) {
        // Saiu pelo Norte: vai para floresta ou montanha
        trocarRegiao((regiaoAtualIdx + 1) % SAFARI_REGIOES.length, 40, 58);
        return;
      } else if (ny >= regiao.altura) {
        // Saiu pelo Sul
        trocarRegiao((regiaoAtualIdx - 1 + SAFARI_REGIOES.length) % SAFARI_REGIOES.length, 40, 1);
        return;
      } else if (nx >= regiao.largura) {
        // Saiu pelo Leste: vai para praia
        trocarRegiao(3, 1, 30);
        return;
      } else if (nx < 0) {
        // Saiu pelo Oeste: vai para ruínas
        trocarRegiao(4, 78, 30);
        return;
      }

      const tile = tileAt(nx, ny);
      if (!isBloqueado(tile)) {
        setPosX(nx);
        setPosY(ny);

        // Se pisar no mato alto ('m'), chance de encontro Pokémon selvagem
        if (tile === 'm') {
          if (Math.random() < 0.22) {
            gerarEncontro();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [posX, posY, direcao, selvagem, regiao, regiaoAtualIdx]);

  const trocarRegiao = (novoIdx: number, targetX: number, targetY: number) => {
    soundEngine.playClick();
    setRegiaoAtualIdx(novoIdx);
    setPosX(targetX);
    setPosY(targetY);
    setMensagem(`Entrando em: ${SAFARI_REGIOES[novoIdx].nome}`);
  };

  const gerarEncontro = () => {
    // 35% de chance de encontrar um dos Pokémon raros da região atual
    const poolRegiao = regiao.encontrosRaros;
    let escolhido: Pokemon;

    if (Math.random() < 0.35 && poolRegiao.length > 0) {
      const idRaro = poolRegiao[Math.floor(Math.random() * poolRegiao.length)];
      escolhido = allPokes.find((p) => p.pokemonId === idRaro) || allPokes[0];
    } else {
      escolhido = allPokes[Math.floor(Math.random() * allPokes.length)];
    }

    const isShiny = Math.random() < 0.08; // 1 em 12 no Safari
    soundEngine.playClick();

    setSelvagem({
      pokemon: escolhido,
      shiny: isShiny,
      hpAtual: escolhido.hp,
      capturado: false,
      fugiu: false,
      balancos: 0,
    });
    setMensagem(`Um ${escolhido.nomeEspecie} selvagem ${isShiny ? '✨ SHINY ' : ''}apareceu!`);
  };

  const tentarCapturar = (tipoBola: 'poke' | 'grande' | 'ultra') => {
    if (!selvagem || bolsa[tipoBola] <= 0 || animBola) return;

    soundEngine.playLancarBola();
    setBolsa((b) => ({ ...b, [tipoBola]: b[tipoBola] - 1 }));
    setAnimBola(true);

    const multBola = tipoBola === 'ultra' ? 2.2 : tipoBola === 'grande' ? 1.6 : 1.0;
    const taxaBase = selvagem.pokemon.lendario ? 0.18 : 0.5;
    const chance = Math.min(0.95, taxaBase * multBola);

    // Animação dos balanços da Pokébola (1, 2, 3... Gotcha!)
    let bCount = 0;
    const interval = setInterval(() => {
      bCount++;
      setSelvagem((prev) => (prev ? { ...prev, balancos: bCount } : null));
      if (bCount >= 3) {
        clearInterval(interval);
      }
    }, 400);

    setTimeout(() => {
      setAnimBola(false);
      if (Math.random() < chance) {
        soundEngine.playCapturaSucesso();
        setSelvagem({ ...selvagem, capturado: true, balancos: 3 });
        setCaixa((c) => [...c, selvagem.pokemon]);
        setMensagem(`Gotcha! ${selvagem.pokemon.nomeEspecie} foi capturado com sucesso!`);
        setTimeout(() => setSelvagem(null), 1800);
      } else {
        soundEngine.playErro();
        if (Math.random() < 0.35) {
          setSelvagem({ ...selvagem, fugiu: true });
          setMensagem(`Oh não! O ${selvagem.pokemon.nomeEspecie} fugiu para a mata!`);
          setTimeout(() => setSelvagem(null), 1400);
        } else {
          setMensagem(
            `O Pokémon escapou da ${
              tipoBola === 'ultra' ? 'Ultra Bola' : tipoBola === 'grande' ? 'Grande Bola' : 'Pokébola'
            }!`
          );
        }
      }
    }, 1400);
  };

  const jogarFruta = () => {
    if (!selvagem || bolsa.fruta <= 0 || animBola) return;
    soundEngine.playClick();
    setBolsa((b) => ({ ...b, fruta: b.fruta - 1 }));
    setMensagem(`Você jogou uma Fruta! ${selvagem.pokemon.nomeEspecie} está comendo e distraído.`);
  };

  return (
    <div className="pk-palco">
      {/* Topo / Header unificado */}
      <AppHeader
        paginaAtual="safari"
        titulo={regiao.nome.toUpperCase()}
        subtitulo={regiao.subtitulo.toUpperCase()}
      />

      <div className="safari-layout-container">
        {/* Tela do Mapa (Canvas com Câmera) */}
        <div className="vidro safari-canvas-wrapper">
          <canvas
            ref={canvasRef}
            width={VIEWPORT_W}
            height={VIEWPORT_H}
            style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }}
          />

          {/* Minimap Flutuante no Canto Superior Direito */}
          {mostrarMinimap && (
            <div
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                width: '130px',
                padding: '8px',
                background: 'rgba(10, 14, 22, 0.85)',
                backdropFilter: 'blur(8px)',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.15)',
                boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
                zIndex: 8,
              }}
            >
              <div style={{ fontSize: '9px', fontWeight: 900, color: '#FFCB05', letterSpacing: '.1em', marginBottom: '4px' }}>
                MINIMAP ({posX}, {posY})
              </div>
              <div
                style={{
                  width: '100%',
                  height: '75px',
                  background: regiao.corFundo,
                  borderRadius: '6px',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {/* Ponto indicador do jogador */}
                <div
                  style={{
                    position: 'absolute',
                    left: `${(posX / regiao.largura) * 100}%`,
                    top: `${(posY / regiao.altura) * 100}%`,
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#FF334B',
                    boxShadow: '0 0 6px #FF334B',
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              </div>
              <div style={{ fontSize: '8px', color: '#8A93A3', marginTop: '4px', textAlign: 'center' }}>
                {regiao.nome.split(' ')[0]} · Bioma {regiao.bioma}
              </div>
            </div>
          )}

          {/* Caixa de Diálogo com NPCs */}
          {npcDialogo && (
            <div
              className="vidro"
              style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                right: '20px',
                padding: '16px 20px',
                background: 'rgba(10, 14, 24, 0.95)',
                border: '2px solid #FFCB05',
                borderRadius: '16px',
                zIndex: 15,
                animation: 'entra .3s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <b style={{ color: '#FFCB05', fontSize: '13px' }}>💬 {npcDialogo.nome}</b>
                <button
                  type="button"
                  className="bt bt-sec"
                  style={{ height: '22px', padding: '0 8px', fontSize: '10px' }}
                  onClick={() => setNpcDialogo(null)}
                >
                  Fechar (ESC)
                </button>
              </div>
              <p style={{ color: '#FFFFFF', fontSize: '13px', lineHeight: '1.4' }}>{npcDialogo.fala}</p>
            </div>
          )}

          {/* Modal de Batalha / Encontro Selvagem Cinematográfico */}
          {selvagem && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(5, 7, 12, 0.92)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                zIndex: 20,
              }}
            >
              <div style={{ position: 'relative', width: '220px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {animBola && (
                  <div
                    style={{
                      position: 'absolute',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(#FF334B 0 50%, #FFFFFF 50%)',
                      border: '2px solid #000',
                      animation: 'flut 0.6s infinite alternate',
                      boxShadow: '0 0 20px rgba(255, 51, 75, 0.8)',
                      zIndex: 5,
                    }}
                  />
                )}
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
                    selvagem.shiny ? 'shiny/' : ''
                  }${selvagem.pokemon.pokemonId}.png`}
                  alt={selvagem.pokemon.nomeEspecie}
                  style={{
                    width: '180px',
                    height: '180px',
                    objectFit: 'contain',
                    filter: animBola ? 'brightness(0.3) blur(2px)' : 'drop-shadow(0 10px 20px rgba(0,0,0,0.6))',
                    transition: 'filter 0.3s',
                  }}
                />
              </div>

              <div style={{ textAlign: 'center' }}>
                <h2 style={{ color: '#FFFFFF', fontSize: '24px', fontWeight: 900 }}>
                  {selvagem.pokemon.nomeEspecie} {selvagem.shiny ? '✨' : ''}
                </h2>
                <p style={{ color: '#8A93A3', fontSize: '13px', marginTop: '4px' }}>{mensagem}</p>
              </div>

              {/* Botões de Ação na Captura */}
              {!selvagem.capturado && !selvagem.fugiu && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    disabled={bolsa.poke <= 0 || animBola}
                    className="bt bt-sec"
                    onClick={() => tentarCapturar('poke')}
                  >
                    🔴 Pokébola ({bolsa.poke})
                  </button>
                  <button
                    type="button"
                    disabled={bolsa.grande <= 0 || animBola}
                    className="bt bt-sec"
                    onClick={() => tentarCapturar('grande')}
                  >
                    🔵 Grande Bola ({bolsa.grande})
                  </button>
                  <button
                    type="button"
                    disabled={bolsa.ultra <= 0 || animBola}
                    className="bt bt-gold"
                    onClick={() => tentarCapturar('ultra')}
                  >
                    🟡 Ultra Bola ({bolsa.ultra})
                  </button>
                  <button
                    type="button"
                    disabled={bolsa.fruta <= 0 || animBola}
                    className="bt bt-sec"
                    onClick={jogarFruta}
                  >
                    🍇 Fruta ({bolsa.fruta})
                  </button>
                  <button
                    type="button"
                    className="bt bt-sec"
                    onClick={() => {
                      setMensagem('Você fugiu com segurança!');
                      setTimeout(() => setSelvagem(null), 500);
                    }}
                  >
                    Fugir
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Painel Lateral Direito: Inventário, Troca Rápida de Região e Caixa */}
        <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Seletor de Região */}
          <div className="vidro" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '10px', fontWeight: 900, color: '#FFCB05', letterSpacing: '.14em' }}>
              REGIÕES DO MUNDO (5 BIOMAS)
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {SAFARI_REGIOES.map((r, idx) => (
                <button
                  key={r.id}
                  type="button"
                  className={`bt ${idx === regiaoAtualIdx ? 'bt-gold' : 'bt-sec'}`}
                  style={{ height: '32px', justifyContent: 'flex-start', padding: '0 10px', fontSize: '11px' }}
                  onClick={() => trocarRegiao(idx, 40, 30)}
                >
                  <span>{r.nome}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Inventário do Treinador */}
          <div className="vidro" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '10px', fontWeight: 900, color: '#8A93A3', letterSpacing: '.14em' }}>
              BOLSA DO EXPLORADOR
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '6px 8px', borderRadius: '8px' }}>
                🔴 Pokébola: <b>{bolsa.poke}</b>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '6px 8px', borderRadius: '8px' }}>
                🔵 Grande Bola: <b>{bolsa.grande}</b>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '6px 8px', borderRadius: '8px' }}>
                🟡 Ultra Bola: <b>{bolsa.ultra}</b>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '6px 8px', borderRadius: '8px' }}>
                🍇 Fruta: <b>{bolsa.fruta}</b>
              </div>
            </div>
          </div>

          {/* Coleção / Caixa Pokémon Capturados */}
          <div className="vidro" style={{ flex: 1, padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px', minHeight: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '10px', fontWeight: 900, color: '#8A93A3', letterSpacing: '.14em' }}>
                CAIXA DE CAPTURAS ({caixa.length})
              </span>
              <button
                type="button"
                className="bt bt-sec"
                style={{ height: '20px', padding: '0 6px', fontSize: '9px' }}
                onClick={() => setMostrarCaixaModal(true)}
              >
                Ver Todas
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              {caixa.map((p, i) => (
                <div
                  key={i}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '8px',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title={p.nomeEspecie}
                >
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.pokemonId}.png`}
                    alt={p.nomeEspecie}
                    style={{ width: '42px', height: '42px', imageRendering: 'pixelated' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .safari-layout-container {
          position: relative;
          flex: 1;
          display: flex;
          gap: 14px;
          padding: 8px 16px 14px 14px;
          box-sizing: border-box;
          overflow: hidden;
          z-index: 10;
        }

        .safari-canvas-wrapper {
          flex: 1;
          height: 100%;
          min-height: 0;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 900px) {
          .safari-layout-container {
            flex-direction: column;
            overflow-y: auto;
          }
          .safari-canvas-wrapper {
            height: 480px;
            flex-shrink: 0;
          }
        }
      `}</style>
    </div>
  );
};
