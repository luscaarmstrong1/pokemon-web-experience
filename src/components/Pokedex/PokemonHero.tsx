import React, { useState } from 'react';
import { createPortal } from 'react-dom';
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
  const [modalCard, setModalCard] = useState<CartaTCG | null>(null);
  const [downloading, setDownloading] = useState<boolean>(false);

  const handleDownloadCard = async (c: CartaTCG) => {
    setDownloading(true);
    const downloadUrl = c.imgGrande || c.img;
    const fileName = `${c.nome.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${c.id}_hd.png`;

    try {
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setDownloading(false);
    }
  };

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

      {/* Modal de Alta Resolução / Download da Carta via Portal */}
      {modalCard && createPortal(
        <div className="card-modal-overlay" onClick={() => setModalCard(null)}>
          <div className="card-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="card-modal-close"
              onClick={() => setModalCard(null)}
              title="Fechar (Esc)"
            >
              ✕
            </button>
            <div className="card-modal-body">
              <div className="card-modal-holo">
                <img
                  src={modalCard.imgGrande || modalCard.img}
                  alt={modalCard.nome}
                  className="card-modal-img"
                />
              </div>
              <div className="card-modal-info">
                <span className="card-modal-badge-top">TCG OFFICIAL CARD</span>
                <h3 className="card-modal-title">{modalCard.nome}</h3>
                <div className="card-modal-pills">
                  <span className="pill-badge">{modalCard.raridadePT || modalCard.raridade}</span>
                  <span className="pill-badge">{modalCard.colecao}</span>
                  <span className="pill-badge">#{modalCard.numero}</span>
                  <span className="pill-badge">{modalCard.serie}</span>
                  {modalCard.lancamento && (
                    <span className="pill-badge">
                      {new Date(modalCard.lancamento).toLocaleDateString('pt-BR')}
                    </span>
                  )}
                </div>
                <div className="card-modal-actions">
                  <button
                    className="btn-download-hd"
                    disabled={downloading}
                    onClick={() => handleDownloadCard(modalCard)}
                  >
                    <span className="btn-icon">⬇</span>
                    <span>{downloading ? 'BAIXANDO CARTA HD...' : 'DOWNLOAD CARTA EM ALTA QUALIDADE (PNG HD)'}</span>
                  </button>
                  <a
                    href={modalCard.imgGrande || modalCard.img}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-open-direct"
                  >
                    <span>ABRIR ORIGINAL HD</span>
                    <span className="btn-icon">↗</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Modo Cartas vs Palco de Batalha */}
      {modo === 3 ? (
        <div className="cartas-wrapper">
          <div className="cg-head">
            CARTAS DE {pokemon.nomeEspecie.toUpperCase()}
            <b>{cartasValidas.length}</b>
            <span className="cg-hint">Clique para abrir & baixar em HD</span>
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
                    onClick={() => setModalCard(c)}
                    onMouseEnter={() => setHoveredCard(c)}
                    onMouseLeave={() => setHoveredCard(null)}
                    title={`Clique para ver e baixar: ${c.nome} (${c.colecao})`}
                  >
                    <img className="cg-thumb" loading="lazy" src={c.img} alt={c.nome} />
                    <span className="cg-item-zoom">🔍 HD</span>
                  </div>
                ))}
              </div>

              {activeCard && (
                <div className="cg-padrao" onClick={() => setModalCard(activeCard)} style={{ cursor: 'pointer' }}>
                  <div className="holo" title="Clique para ampliar e baixar em alta qualidade">
                    <img src={activeCard.imgGrande || activeCard.img} alt={activeCard.nome} />
                    <div className="holo-overlay-hint">
                      <span>VER EM ALTA DEFINIÇÃO & BAIXAR</span>
                    </div>
                  </div>
                  <span>
                    <b>{activeCard.raridadePT}</b>
                    {activeCard.colecao} · {new Date(activeCard.lancamento).getFullYear()}
                  </span>
                  <button
                    type="button"
                    className="btn-quick-download"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadCard(activeCard);
                    }}
                    title="Baixar imagem em resolução máxima"
                  >
                    📥 Baixar Carta HD
                  </button>
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
          position: relative;
          width: 100%;
          flex: 1;
          min-height: 0;
          box-sizing: border-box;
          padding: 8px 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          z-index: 10;
        }
        .hero-top {
          width: 100%;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4px;
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
          min-height: 220px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hero-glow {
          position: absolute;
          width: 440px;
          height: 440px;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
        .hero-anel {
          position: absolute;
          width: 280px;
          height: 280px;
          left: 50%;
          top: 50%;
          margin: -140px 0 0 -140px;
          border-radius: 50%;
          border: 2px dashed;
          opacity: .40;
          animation: gira 40s linear infinite;
        }
        .hero-img {
          position: relative;
          z-index: 2;
          height: min(290px, 42vh);
          max-width: 90%;
          object-fit: contain;
          filter: drop-shadow(0 20px 26px rgba(0,0,0,.65));
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
          gap: 6px;
        }
        .holo {
          position: relative;
          border-radius: 9px;
          overflow: hidden;
          box-shadow: 0 14px 30px rgba(0,0,0,.6);
          transition: transform 0.2s ease;
        }
        .cg-padrao:hover .holo {
          transform: scale(1.02);
          box-shadow: 0 16px 36px rgba(0, 240, 255, 0.25);
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
        .holo-overlay-hint {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(2px);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s ease;
          z-index: 2;
          padding: 12px;
          text-align: center;
        }
        .holo-overlay-hint span {
          color: #FFCB05;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.08em;
          border: 1px solid #FFCB05;
          padding: 4px 8px;
          border-radius: 6px;
          background: rgba(255, 203, 5, 0.12);
        }
        .holo:hover .holo-overlay-hint {
          opacity: 1;
        }
        .btn-quick-download {
          width: 100%;
          background: linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(0, 240, 255, 0.08));
          border: 1px solid #00F0FF;
          border-radius: 8px;
          color: #00F0FF;
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: 0.04em;
          padding: 6px 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .btn-quick-download:hover {
          background: #00F0FF;
          color: #0B0E14;
          box-shadow: 0 0 14px rgba(0, 240, 255, 0.4);
          transform: translateY(-1px);
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

        /* Modal Overlay & Card Fullview */
        .card-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(4, 7, 13, 0.88);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: modal-fade 0.2s ease-out;
        }
        @keyframes modal-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .card-modal-content {
          position: relative;
          background: linear-gradient(160deg, #141B2B, #0A0D15);
          border: 1px solid rgba(0, 240, 255, 0.3);
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 240, 255, 0.15);
          border-radius: 20px;
          padding: 24px;
          max-width: 680px;
          width: 90%;
          animation: modal-scale 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes modal-scale {
          from { transform: scale(0.92); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .card-modal-close {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #fff;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }
        .card-modal-close:hover {
          background: #FF334B;
          border-color: #FF334B;
          transform: rotate(90deg);
        }
        .card-modal-body {
          display: flex;
          gap: 24px;
          align-items: center;
        }
        .card-modal-holo {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.7);
          flex-shrink: 0;
        }
        .card-modal-img {
          display: block;
          max-height: 400px;
          width: auto;
          border-radius: 12px;
        }
        .card-modal-info {
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1;
        }
        .card-modal-badge-top {
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.15em;
          color: #FFCB05;
        }
        .card-modal-title {
          font-size: 20px;
          font-weight: 900;
          color: #FFFFFF;
          margin: 0;
          line-height: 1.2;
        }
        .card-modal-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .pill-badge {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 10px;
          font-weight: 700;
          color: #E2E8F0;
        }
        .card-modal-actions {
          margin-top: 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .btn-download-hd {
          background: linear-gradient(135deg, #00F0FF, #00A3FF);
          border: none;
          color: #07090E;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.04em;
          padding: 12px 18px;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 6px 20px rgba(0, 240, 255, 0.35);
          transition: all 0.2s ease;
        }
        .btn-download-hd:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 26px rgba(0, 240, 255, 0.55);
        }
        .btn-download-hd:disabled {
          opacity: 0.6;
          cursor: wait;
        }
        .btn-open-direct {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #FFFFFF;
          text-decoration: none;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.04em;
          padding: 10px 16px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
        }
        .btn-open-direct:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: #FFCB05;
          color: #FFCB05;
        }
        .btn-icon {
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};
