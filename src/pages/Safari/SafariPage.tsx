import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import pokemonDataRaw from '../../data/pokemon.json';
import { Pokemon } from '../../types/pokemon';
import '../../styles/safari.css';

const allPokes = (pokemonDataRaw as Pokemon[]).filter((p) => p.isDefault);

const TL = 32;
const COLS = 30;
const LINS = 20;

// Mapa 30x20 conforme safari.js original
const MAPA = [
  'tttttttttttttttttttttttttttttt',
  't....mmmmm....cc....mmmmmmm..t',
  't..mmmmmmmm...cc...mmmmmmmmm.t',
  't..mmmmmmmm...cc...mmmmmmmmm.t',
  't...mmmmmm..f.cc.f..mmmmmmm..t',
  't.ff.........ccc.........ff..t',
  't.ff..HHHH....cc..raaaaar....t',
  't.....HHHH....cc..aaaaaaa..mmt',
  't.....HHDH....cc..aaaaaaa..mmt',
  't.......cc....cc..raaaaar..mmt',
  'tcccccccccccccccccccccccccccct',
  't.....mmmmm...cc....f..mmmmm.t',
  't..mmmmmmmmm..cc...ff.mmmmmmmt',
  't..mmmmmmmmm..cc.......mmmmmmt',
  't..mmmmmmmmm..cc..p....mmmmmmt',
  't...mmmmmmm...cc.......mmmmm.t',
  't.r...........cc..ttt.......ft',
  't..ff..mmmm...cc..ttt..mmm..ft',
  't..ff..mmmm...cc.......mmm...t',
  'tttttttttttttttttttttttttttttt',
].map((l) => l.split(''));

const COR = {
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

const TREINADOR_DOWN = [
  '....kkkkkkk.....', '...krrrrrrrk....', '..krrwwrrrrrk...', '..krrrrrrrrrk...',
  '.kRRRRRRRRRRRk..', '..khsssssssshk..', '..ksskssssksk...', '..kssssssssssk..',
  '...ksssssssk....', '..kbbwbbbbwbbk..', '.ksbbwbbbbwbbsk.', '.ksbbbbbbbbbbsk.',
  '..kBBBBBBBBBBk..', '...kggggggggk...', '...kggk..kggk...', '...kkkk..kkkk...'
];

export const SafariPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Estado do Jogador
  const [posX, setPosX] = useState<number>(14);
  const [posY, setPosY] = useState<number>(10);
  const [direcao, setDirecao] = useState<'baixo' | 'cima' | 'esq' | 'dir'>('baixo');
  const [quadro, setQuadro] = useState<number>(0);

  // Inventário e Capturas
  const [bolsa, setBolsa] = useState({ poke: 15, grande: 8, ultra: 4, fruta: 5 });
  const [caixa, setCaixa] = useState<Pokemon[]>([]);
  const [selvagem, setSelvagem] = useState<{ pokemon: Pokemon; shiny: boolean; hpAtual: number; capturado: boolean; fugiu: boolean } | null>(null);
  const [mensagem, setMensagem] = useState<string>('Use as setas ou WASD para caminhar. O mato alto esconde Pokémon!');
  const [animBola, setAnimBola] = useState<boolean>(false);

  const tileAt = (x: number, y: number) => {
    if (x < 0 || x >= COLS || y < 0 || y >= LINS) return 't';
    return MAPA[y][x];
  };

  const isBloqueado = (c: string) => 'tarHpx'.includes(c);

  // Renderização Pixel Art no Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, 960, 640);

    // Desenha Mapa Tile a Tile
    for (let y = 0; y < LINS; y++) {
      for (let x = 0; x < COLS; x++) {
        const t = MAPA[y][x];
        const X = x * TL;
        const Y = y * TL;

        if (t === 'c') {
          ctx.fillStyle = '#E3C088';
          ctx.fillRect(X, Y, TL, TL);
        } else if (t === 'a') {
          ctx.fillStyle = '#3B82F6';
          ctx.fillRect(X, Y, TL, TL);
        } else if (t === 't') {
          ctx.fillStyle = '#166534';
          ctx.fillRect(X, Y, TL, TL);
        } else if (t === 'm') {
          // Mato alto
          ctx.fillStyle = '#15803D';
          ctx.fillRect(X, Y, TL, TL);
          ctx.fillStyle = '#166534';
          ctx.fillRect(X + 4, Y + 4, TL - 8, TL - 8);
        } else if (t === 'f') {
          ctx.fillStyle = '#86EFAC';
          ctx.fillRect(X, Y, TL, TL);
          ctx.fillStyle = '#EF4444';
          ctx.fillRect(X + 10, Y + 10, 8, 8);
        } else if (t === 'H' || t === 'D') {
          ctx.fillStyle = '#DC2626';
          ctx.fillRect(X, Y, TL, TL);
        } else {
          ctx.fillStyle = '#86EFAC';
          ctx.fillRect(X, Y, TL, TL);
        }
      }
    }

    // Desenha Treinador Pixel Art
    const pX = posX * TL;
    const pY = posY * TL;
    const e = 2;
    for (let y = 0; y < 16; y++) {
      const linha = TREINADOR_DOWN[y];
      for (let x = 0; x < 16; x++) {
        const ch = linha.charAt(x);
        if (ch !== '.' && (COR as any)[ch]) {
          ctx.fillStyle = (COR as any)[ch];
          ctx.fillRect(pX + x * e, pY + y * e, e, e);
        }
      }
    }
  }, [posX, posY, direcao, quadro]);

  // Teclado (Setas / WASD)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selvagem) return; // Em batalha de captura, movimento pausado

      let dx = 0;
      let dy = 0;
      let dir: 'baixo' | 'cima' | 'esq' | 'dir' = direcao;

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
      } else {
        return;
      }

      setDirecao(dir);
      setQuadro((q) => (q === 1 ? 2 : 1));

      const nx = posX + dx;
      const ny = posY + dy;
      const tile = tileAt(nx, ny);

      if (!isBloqueado(tile)) {
        setPosX(nx);
        setPosY(ny);

        // Se pisar no mato alto ('m'), chance de encontro Pokémon
        if (tile === 'm') {
          if (Math.random() < 0.22) {
            gerarEncontro();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [posX, posY, direcao, selvagem]);

  const gerarEncontro = () => {
    const p = allPokes[Math.floor(Math.random() * allPokes.length)];
    const isShiny = Math.random() < 0.08; // 1 em 12 no Safari rápido
    setSelvagem({
      pokemon: p,
      shiny: isShiny,
      hpAtual: p.hp,
      capturado: false,
      fugiu: false,
    });
    setMensagem(`Um ${p.nomeEspecie} selvagem ${isShiny ? '✨ SHINY ' : ''}apareceu!`);
  };

  const tentarCapturar = (tipoBola: 'poke' | 'grande' | 'ultra') => {
    if (!selvagem || bolsa[tipoBola] <= 0) return;

    setBolsa((b) => ({ ...b, [tipoBola]: b[tipoBola] - 1 }));
    setAnimBola(true);

    const multBola = tipoBola === 'ultra' ? 2.0 : tipoBola === 'grande' ? 1.5 : 1.0;
    const taxaBase = selvagem.pokemon.lendario ? 0.15 : 0.45;
    const chance = Math.min(0.95, taxaBase * multBola);

    setTimeout(() => {
      setAnimBola(false);
      if (Math.random() < chance) {
        setSelvagem({ ...selvagem, capturado: true });
        setCaixa((c) => [...c, selvagem.pokemon]);
        setMensagem(`Gotcha! ${selvagem.pokemon.nomeEspecie} foi capturado!`);
        setTimeout(() => setSelvagem(null), 1600);
      } else {
        if (Math.random() < 0.35) {
          setSelvagem({ ...selvagem, fugiu: true });
          setMensagem(`Oh não! O ${selvagem.pokemon.nomeEspecie} fugiu!`);
          setTimeout(() => setSelvagem(null), 1400);
        } else {
          setMensagem(`O Pokémon escapou da ${tipoBola === 'ultra' ? 'Ultra Bola' : tipoBola === 'grande' ? 'Grande Bola' : 'Pokébola'}!`);
        }
      }
    }, 1200);
  };

  const jogarFruta = () => {
    if (!selvagem || bolsa.fruta <= 0) return;
    setBolsa((b) => ({ ...b, fruta: b.fruta - 1 }));
    setMensagem(`Você jogou uma Fruta! ${selvagem.pokemon.nomeEspecie} está distraído.`);
  };

  return (
    <div className="pk-palco">
      {/* Topo / Header com navegação */}
      <div className="topo">
        <nav className="pk-nav" style={{ position: 'static' }}>
          <NavLink to="/" end className="pk-nav-item">
            Pokédex
          </NavLink>
          <NavLink to="/arena" className="pk-nav-item">
            Arena
          </NavLink>
          <NavLink to="/tipos" className="pk-nav-item">
            Tipos
          </NavLink>
          <NavLink to="/quiz" className="pk-nav-item">
            Quiz
          </NavLink>
          <NavLink to="/safari" className="pk-nav-item active">
            Safari
          </NavLink>
          <NavLink to="/offline" className="pk-nav-item">
            Offline
          </NavLink>
        </nav>

        <div className="titulo">
          <b>ZONA SAFARI</b>
          <span>EXPLORAÇÃO E CAPTURA</span>
        </div>
      </div>

      <div style={{ position: 'absolute', inset: '60px 16px 14px 16px', display: 'flex', gap: '16px' }}>
        {/* Tela do Mapa (Canvas 960x640) */}
        <div className="vidro" style={{ width: '960px', height: '640px', position: 'relative', overflow: 'hidden' }}>
          <canvas
            ref={canvasRef}
            width={960}
            height={640}
            style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }}
          />

          {/* Modal / Encontro Selvagem Sobreposto */}
          {selvagem && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(11, 14, 20, 0.88)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                zIndex: 20,
              }}
            >
              <div style={{ position: 'relative', width: '180px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={selvagem.shiny ? selvagem.pokemon.imgArteShiny : selvagem.pokemon.imgArte}
                  alt={selvagem.pokemon.nomeEspecie}
                  style={{ maxHeight: '160px', maxWidth: '160px', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,.6))' }}
                />
                {animBola && (
                  <div
                    style={{
                      position: 'absolute',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, #E3350D 50%, #fff 50%)',
                      border: '2px solid #000',
                      animation: 'pulsa 0.4s ease-in-out infinite',
                    }}
                  />
                )}
              </div>

              <div style={{ textAlign: 'center' }}>
                <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: 900 }}>
                  {selvagem.pokemon.nomeEspecie} {selvagem.shiny ? '✨' : ''}
                </h2>
                <p style={{ color: '#8A93A3', fontSize: '13px', marginTop: '4px' }}>
                  {mensagem}
                </p>
              </div>

              {/* Botões de Ação */}
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

        {/* Painel Lateral: Inventário e Mochila */}
        <div className="vidro" style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <span style={{ fontSize: '10px', color: '#8A93A3', fontWeight: 800, letterSpacing: '.12em' }}>INVENTÁRIO SAFARI</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
              <div className="fato">
                <span>POKÉBOLAS</span>
                <b>{bolsa.poke}</b>
              </div>
              <div className="fato">
                <span>GRANDE BOLAS</span>
                <b>{bolsa.grande}</b>
              </div>
              <div className="fato">
                <span>ULTRA BOLAS</span>
                <b>{bolsa.ultra}</b>
              </div>
              <div className="fato">
                <span>FRUTAS</span>
                <b>{bolsa.fruta}</b>
              </div>
            </div>
          </div>

          {/* D-Pad na tela para toque / mobile */}
          <div>
            <span style={{ fontSize: '10px', color: '#8A93A3', fontWeight: 800, letterSpacing: '.12em' }}>CONTROLES</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', maxWidth: '140px', margin: '8px auto' }}>
              <div />
              <button
                type="button"
                className="bt bt-sec"
                style={{ height: '36px', padding: 0 }}
                onClick={() => {
                  const ny = posY - 1;
                  if (!isBloqueado(tileAt(posX, ny))) setPosY(ny);
                  setDirecao('cima');
                }}
              >
                ▲
              </button>
              <div />
              <button
                type="button"
                className="bt bt-sec"
                style={{ height: '36px', padding: 0 }}
                onClick={() => {
                  const nx = posX - 1;
                  if (!isBloqueado(tileAt(nx, posY))) setPosX(nx);
                  setDirecao('esq');
                }}
              >
                ◀
              </button>
              <button
                type="button"
                className="bt bt-sec"
                style={{ height: '36px', padding: 0 }}
                onClick={() => {
                  const ny = posY + 1;
                  if (!isBloqueado(tileAt(posX, ny))) setPosY(ny);
                  setDirecao('baixo');
                }}
              >
                ▼
              </button>
              <button
                type="button"
                className="bt bt-sec"
                style={{ height: '36px', padding: 0 }}
                onClick={() => {
                  const nx = posX + 1;
                  if (!isBloqueado(tileAt(nx, posY))) setPosX(nx);
                  setDirecao('dir');
                }}
              >
                ▶
              </button>
            </div>
          </div>

          {/* Caixa de Capturados */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <span style={{ fontSize: '10px', color: '#8A93A3', fontWeight: 800, letterSpacing: '.12em', marginBottom: '6px' }}>
              POKÉMON CAPTURADOS ({caixa.length})
            </span>
            <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              {caixa.map((p, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: 'rgba(255,255,255,.05)',
                    padding: '6px',
                    borderRadius: '8px',
                  }}
                >
                  <img src={p.imgSprite} alt={p.nomeEspecie} style={{ width: '40px', height: '40px' }} />
                  <span style={{ fontSize: '9px', fontWeight: 800, color: '#fff', textAlign: 'center' }}>
                    {p.nomeEspecie}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
