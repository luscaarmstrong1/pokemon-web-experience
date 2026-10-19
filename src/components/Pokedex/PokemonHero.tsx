import React, { useState } from 'react';
import { Pokemon, CartaTCG } from '../../types/pokemon';
import { ModeSelector } from './ModeSelector';

interface Props {
  pokemon: Pokemon;
  modo: 1 | 2 | 3; // 1 Normal, 2 Shiny, 3 Cartas
  onChangeModo?: (modo: 1 | 2 | 3) => void;
  cartas: CartaTCG[];
  isEvolving?: boolean;
  prevPokemon?: Pokemon | null;
}

export const PokemonHero: React.FC<Props> = ({
  pokemon,
  modo,
  onChangeModo,
  cartas,
  isEvolving,
  prevPokemon,
}) => {
  const [hoveredCard, setHoveredCard] = useState<CartaTCG | null>(null);

  // Filtragem de cartas: casando com a forma exibida (Mega, Gigantamax, Alola...), idêntico ao DAX
  const cartasValidas = React.useMemo(() => {
    const temForma = cartas.some((c) => c.tagForma === pokemon.tagCarta);
    const filtered = temForma ? cartas.filter((c) => c.tagForma === pokemon.tagCarta) : cartas;
    return filtered;
  }, [cartas, pokemon.tagCarta]);

  const defaultTopCard = cartasValidas[0] || null;
  const activeCard = hoveredCard || defaultTopCard;

  const numFmt = `#${String(pokemon.speciesId).padStart(3, '0')}`;
  const alturaFmt = `${pokemon.alturaM.toFixed(1).replace('.', ',')} m`;
  const pesoFmt = `${pokemon.pesoKg.toFixed(1).replace('.', ',')} kg`;
  const totalFmt = String(pokemon.total);
  const estagioTx = `Estágio ${pokemon.estagio}/${pokemon.estagiosCadeia}`;

  const raridadeClass =
    pokemon.raridade === 'Lendário'
      ? 'rar-lendario'
      : pokemon.raridade === 'Mítico'
      ? 'rar-mitico'
      : '';

  const nomeLen = pokemon.nome.length;
  const nomeClass = nomeLen > 18 ? 'hn-p' : nomeLen > 12 ? 'hn-m' : '';

  const heroImg = modo === 2 ? pokemon.imgArteShiny : pokemon.imgArte;
  const prevImg = prevPokemon ? (modo === 2 ? prevPokemon.imgArteShiny : prevPokemon.imgArte) : '';

  return (
    <div className={`hero ${isEvolving ? 'evo' : ''} ${modo === 2 ? 'shiny' : ''}`}>
      {/* Topo do Card com Número e Seletor de Modos (Normal / Shiny / Cartas) */}
      <div className="hero-top">
        <span className="hero-num">{numFmt}</span>
        {onChangeModo && (
          <div className="hero-mode-container">
            <ModeSelector modo={modo} onChangeModo={onChangeModo} />
          </div>
        )}
      </div>

      {/* Nome e Categoria do Pokémon */}
      <div className={`hero-nome ${nomeClass}`}>{pokemon.nome}</div>
      {pokemon.categoria && <div className="hero-cat">{pokemon.categoria}</div>}

      {/* Pills de informação */}
      <div className="hero-pills">
        <span className="pill">{pokemon.geracaoLabel}</span>
        <span className="pill">{estagioTx}</span>
        <span className={`pill ${raridadeClass}`}>{pokemon.raridade}</span>
        {modo === 2 && <span className="pill pill-shiny">✨ SHINY</span>}
      </div>

      {/* Modo Cartas vs Palco de Batalha */}
      {modo === 3 ? (
        <div className="cartas-wrapper">
          <div className="cg-head">
            CARTAS DE {pokemon.nomeEspecie.toUpperCase()}
            <b>{cartasValidas.length}</b>
          </div>

          {cartasValidas.length === 0 ? (
            <div className="cg-vazio">Nenhuma carta encontrada para este Pokémon.</div>
          ) : (
            <div className="cg">
              <div className="cg-lista">
                {cartasValidas.map((c) => (
                  <div
                    key={c.id}
                    className="cg-item"
                    onMouseEnter={() => setHoveredCard(c)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <img className="cg-thumb" loading="lazy" src={c.img} alt={c.nome} />
                  </div>
                ))}
              </div>

              {activeCard && (
                <div className="cg-padrao">
                  <div className="holo">
                    <img src={activeCard.imgGrande || activeCard.img} alt={activeCard.nome} />
                  </div>
                  <span>
                    <b>{activeCard.raridadePT}</b>
                    {activeCard.colecao} · {new Date(activeCard.lancamento).getFullYear()}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Palco Principal */
        <>
          <div className="hero-palco">
            <div className={`hero-glow gl-${pokemon.tipo1Slug}`} />
            <div className={`hero-anel bc-${pokemon.tipo1Slug}`} />

            {/* Efeitos de evolução */}
            {isEvolving && prevPokemon && (
              <>
                <div className="evo-raios" />
                <img className="evo-antes" src={prevImg} alt="Antes" />
                <div className="evo-flash" />
                <div className="evo-msg">
                  {prevPokemon.nomeEspecie} evoluiu para {pokemon.nomeEspecie}!
                </div>
              </>
            )}

            <img
              className="hero-img"
              src={heroImg}
              alt={pokemon.nome}
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== pokemon.imgHome) {
                  target.src = pokemon.imgHome;
                }
              }}
            />
            <div className="hero-chao" />

            {/* Brilhos cintilantes no modo Shiny */}
            {modo === 2 && (
              <div className="brilhos">
                <i style={{ left: '22%', top: '18%', animationDelay: '0s' }} />
                <i style={{ left: '74%', top: '24%', animationDelay: '0.6s' }} />
                <i style={{ left: '30%', top: '72%', animationDelay: '1.1s' }} />
                <i style={{ left: '68%', top: '66%', animationDelay: '0.3s' }} />
                <i style={{ left: '50%', top: '8%', animationDelay: '1.5s' }} />
                <i style={{ left: '84%', top: '48%', animationDelay: '0.9s' }} />
                <i style={{ left: '14%', top: '46%', animationDelay: '1.8s' }} />
                <i style={{ left: '58%', top: '84%', animationDelay: '0.4s' }} />
              </div>
            )}
          </div>

          {/* Badges de Tipo */}
          <div className="hero-tipos">
            <span className={`tp bg-${pokemon.tipo1Slug} sh-${pokemon.tipo1Slug}`}>
              {pokemon.tipo1.toUpperCase()}
            </span>
            {pokemon.tipo2 && pokemon.tipo2Slug && (
              <span className={`tp bg-${pokemon.tipo2Slug} sh-${pokemon.tipo2Slug}`}>
                {pokemon.tipo2.toUpperCase()}
              </span>
            )}
          </div>

          {/* Fatos: Altura, Peso, Total */}
          <div className="hero-fatos">
            <div className="fato">
              <span>ALTURA</span>
              <b>{alturaFmt}</b>
            </div>
            <div className="fato">
              <span>PESO</span>
              <b>{pesoFmt}</b>
            </div>
            <div className="fato">
              <span>TOTAL BASE</span>
              <b>{totalFmt}</b>
            </div>
          </div>
        </>
      )}

      <style>{`
        .hero {
          position: absolute;
          left: 364px;
          top: 14px;
          width: 472px;
          height: 462px;
          box-sizing: border-box;
          padding: 4px 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 10;
        }
        .hero-top {
          width: 100%;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2px;
        }
        .hero-mode-container {
          display: flex;
          align-items: center;
        }
        .hero-num {
          font-size: 24px;
          font-weight: 900;
          font-style: italic;
          color: rgba(255,255,255,.50);
        }
        .hero-pills {
          display: flex;
          gap: 6px;
          margin-top: 6px;
        }
        .pill {
          font-size: 10px;
          font-weight: 700;
          color: #D5DAE3;
          background: rgba(255,255,255,.07);
          border: 1px solid rgba(255,255,255,.10);
          padding: 3px 10px;
          border-radius: 999px;
        }
        .rar-lendario {
          color: #FFD86B;
          border-color: rgba(255,216,107,.55);
          background: rgba(255,216,107,.10);
        }
        .rar-mitico {
          color: #E7A8FF;
          border-color: rgba(231,168,255,.55);
          background: rgba(231,168,255,.10);
        }
        .pill-shiny {
          color: #FFE27A;
          border-color: rgba(255,226,122,.65);
          background: rgba(255,226,122,.14);
        }
        .hero-nome {
          margin-top: 0;
          font-size: 44px;
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -.01em;
          color: #fff;
          text-align: center;
          text-shadow: 0 6px 24px rgba(0,0,0,.45);
        }
        .hero-nome.hn-m { font-size: 36px; }
        .hero-nome.hn-p { font-size: 28px; }
        .shiny .hero-nome {
          background: linear-gradient(90deg, #fff 0%, #FFE58A 40%, #fff 60%, #FFE58A 100%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          color: transparent;
          animation: ouro 3s linear infinite;
        }
        .hero-cat {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: #9AA3B2;
        }

        .hero-palco {
          position: relative;
          width: 100%;
          flex: 1 1 auto;
          min-height: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hero-glow {
          position: absolute;
          width: 360px;
          height: 360px;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
        .hero-anel {
          position: absolute;
          width: 226px;
          height: 226px;
          left: 50%;
          top: 50%;
          margin: -115px 0 0 -115px;
          border-radius: 50%;
          border: 2px dashed;
          opacity: .40;
          animation: gira 40s linear infinite;
        }
        .hero-img {
          position: relative;
          z-index: 2;
          height: 210px;
          max-width: 80%;
          object-fit: contain;
          filter: drop-shadow(0 18px 22px rgba(0,0,0,.55));
          animation: flutua 4.5s ease-in-out infinite;
          cursor: pointer;
        }
        .hero-palco:hover .hero-img {
          animation: agita .55s ease-in-out infinite;
        }
        .hero-chao {
          position: absolute;
          bottom: 2px;
          left: 50%;
          width: 200px;
          height: 18px;
          transform: translateX(-50%);
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(0,0,0,.60), rgba(0,0,0,0) 70%);
        }
        .hero-tipos {
          display: flex;
          gap: 10px;
          margin: 6px 0 10px;
        }
        .tp {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: .14em;
          color: #fff;
          padding: 6px 20px;
          border-radius: 999px;
          text-shadow: 0 1px 2px rgba(0,0,0,.40);
        }
        .hero-fatos {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .fato {
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 14px;
          padding: 7px 10px;
          text-align: center;
        }
        .fato span {
          display: block;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .16em;
          color: #8A93A3;
        }
        .fato b {
          font-size: 17px;
          font-weight: 800;
          color: #fff;
        }

        /* Animações de Evolução */
        .evo-antes {
          position: absolute;
          z-index: 2;
          height: 210px;
          max-width: 80%;
          object-fit: contain;
          filter: brightness(0) invert(1) drop-shadow(0 0 16px rgba(255,255,255,.9));
          animation: evo-antigo 3s ease-in-out 1 both;
        }
        .evo .hero-img {
          animation: evo-novo 3s ease-in-out 1 both, flutua 4.5s ease-in-out 3s infinite;
        }
        .evo-raios {
          position: absolute;
          width: 440px;
          height: 440px;
          left: 50%;
          top: 50%;
          margin: -220px 0 0 -220px;
          border-radius: 50%;
          background: repeating-conic-gradient(rgba(255,255,255,.18) 0 6deg, transparent 6deg 22deg);
          -webkit-mask-image: radial-gradient(circle, #000 20%, transparent 70%);
          animation: raios 3s ease-in-out 1 both;
        }
        .evo-flash {
          position: absolute;
          z-index: 4;
          width: 320px;
          height: 320px;
          left: 50%;
          top: 50%;
          margin: -160px 0 0 -160px;
          border-radius: 50%;
          background: radial-gradient(circle, #fff 0%, rgba(255,255,255,.6) 35%, rgba(255,255,255,0) 70%);
          pointer-events: none;
          animation: flash 3s ease-out 1 both;
        }
        .evo-msg {
          position: absolute;
          z-index: 5;
          bottom: 6px;
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
          font-size: 12px;
          font-weight: 800;
          color: #fff;
          background: rgba(10,12,18,.80);
          border: 1px solid rgba(255,255,255,.18);
          padding: 6px 14px;
          border-radius: 999px;
          animation: msg 3s ease-out 1 both;
        }

        @keyframes evo-antigo {
          0%, 12% { opacity: 1; }
          13%, 22% { opacity: 0; }
          23%, 30% { opacity: 1; }
          31%, 38% { opacity: 0; }
          39%, 44% { opacity: 1; }
          45%, 50% { opacity: 0; }
          51%, 54% { opacity: 1; }
          55%, 58% { opacity: 0; }
          59%, 60% { opacity: 1; }
          61%, 100% { opacity: 0; }
        }
        @keyframes evo-novo {
          0%, 12% { opacity: 0; }
          13%, 22% { opacity: 1; filter: brightness(0) invert(1) drop-shadow(0 0 16px rgba(255,255,255,.9)); }
          23%, 30% { opacity: 0; }
          31%, 38% { opacity: 1; }
          39%, 44% { opacity: 0; }
          45%, 50% { opacity: 1; }
          51%, 54% { opacity: 0; }
          55%, 58% { opacity: 1; }
          59%, 60% { opacity: 0; }
          61% { opacity: 1; transform: scale(1); filter: brightness(0) invert(1) drop-shadow(0 0 16px rgba(255,255,255,.9)); }
          70% { transform: scale(1.12); filter: brightness(0) invert(1) drop-shadow(0 0 34px rgba(255,255,255,1)); }
          80% { transform: scale(1); filter: brightness(1.6) invert(0) drop-shadow(0 0 30px rgba(255,255,255,.9)); }
          100% { opacity: 1; transform: scale(1); filter: brightness(1) invert(0) drop-shadow(0 18px 22px rgba(0,0,0,.55)); }
        }
        @keyframes raios {
          0% { opacity: 0; transform: rotate(0); }
          15%, 65% { opacity: 1; }
          80% { opacity: 0; transform: rotate(120deg); }
          100% { opacity: 0; transform: rotate(140deg); }
        }
        @keyframes flash {
          0%, 62% { opacity: 0; transform: scale(.3); }
          68% { opacity: .95; transform: scale(1.6); }
          100% { opacity: 0; transform: scale(2.2); }
        }
        @keyframes msg {
          0%, 75% { opacity: 0; transform: translate(-50%, 8px); }
          88%, 100% { opacity: 1; transform: translate(-50%, 0); }
        }

        /* Galeria TCG */
        .cartas-wrapper {
          width: 100%;
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .cg-head {
          width: 100%;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .16em;
          color: #8A93A3;
          margin: 8px 0 6px;
        }
        .cg-head b {
          color: #fff;
          margin-left: 8px;
        }
        .cg {
          position: relative;
          width: 100%;
          flex: 1 1 auto;
          min-height: 0;
          display: grid;
          grid-template-columns: 1fr 180px;
          gap: 14px;
        }
        .cg-lista {
          overflow-y: auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          align-content: start;
          padding: 2px 6px 6px 2px;
          max-height: 330px;
        }
        .cg-thumb {
          display: block;
          width: 100%;
          border-radius: 5px;
          box-shadow: 0 4px 10px rgba(0,0,0,.45);
          transition: transform .15s, box-shadow .15s;
          cursor: pointer;
        }
        .cg-item:hover .cg-thumb {
          transform: translateY(-3px);
          box-shadow: 0 0 0 2px #FFCB05, 0 8px 16px rgba(0,0,0,.5);
        }
        .cg-padrao {
          width: 180px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .holo {
          position: relative;
          border-radius: 9px;
          overflow: hidden;
          box-shadow: 0 14px 30px rgba(0,0,0,.6);
        }
        .holo img {
          display: block;
          width: 180px;
        }
        .holo::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(115deg, transparent 30%, rgba(255,255,255,.35) 45%, rgba(255,140,255,.18) 50%, transparent 62%);
          background-size: 260% 100%;
          mix-blend-mode: screen;
          animation: holo 3.2s linear infinite;
        }
        .cg-padrao span {
          font-size: 10px;
          color: #A9B1BF;
          line-height: 1.4;
        }
        .cg-padrao b {
          display: block;
          font-size: 11px;
          color: #fff;
        }
        .cg-vazio {
          margin-top: 40px;
          font-size: 12px;
          color: #737C8C;
          text-align: center;
        }
      `}</style>
    </div>
  );
};
