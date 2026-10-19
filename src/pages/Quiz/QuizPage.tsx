import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { AppHeader } from '../../components/AppHeader';
import pokemonDataRaw from '../../data/pokemon.json';
import { Pokemon } from '../../types/pokemon';
import confetti from 'canvas-confetti';
import { soundEngine } from '../../engines/soundEngine';
import '../../styles/quiz.css';

const allPokes = (pokemonDataRaw as Pokemon[]).filter((p) => p.isDefault);
const TEMPO_RODADA = 20;

export const QuizPage: React.FC = () => {
  const [modo, setModo] = useState<'opcoes' | 'digitar'>('opcoes');
  const [gens, setGens] = useState<number[]>([]);
  const [pontos, setPontos] = useState<number>(0);
  const [seq, setSeq] = useState<number>(0);
  const [recorde, setRecorde] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('pkQuizRecorde') || 0);
    } catch {
      return 0;
    }
  });
  const [acertos, setAcertos] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [historico, setHistorico] = useState<Array<{ id: number; nome: string; ok: boolean }>>([]);

  const [atual, setAtual] = useState<Pokemon | null>(null);
  const [opcoes, setOpcoes] = useState<Pokemon[]>([]);
  const [dicas, setDicas] = useState<number>(0);
  const [fase, setFase] = useState<'inicio' | 'pergunta' | 'revelado'>('inicio');
  const [resposta, setResposta] = useState<number | null>(null);
  const [restante, setRestante] = useState<number>(TEMPO_RODADA);
  const [ganho, setGanho] = useState<number>(0);
  const [inputNome, setInputNome] = useState<string>('');

  const timerRef = useRef<any>(null);

  const pool = React.useMemo(() => {
    return allPokes.filter((p) => gens.length === 0 || gens.includes(p.geracao));
  }, [gens]);

  const novaRodada = () => {
    if (pool.length === 0) return;
    const escolhido = pool[Math.floor(Math.random() * pool.length)];

    // 3 alternativas parecidas (mesma geração ou mesmo tipo)
    const parecidos = pool.filter(
      (x) => x.pokemonId !== escolhido.pokemonId && (x.geracao === escolhido.geracao || x.tipo1Slug === escolhido.tipo1Slug)
    );
    const outros = (parecidos.length >= 3 ? parecidos : pool.filter((x) => x.pokemonId !== escolhido.pokemonId))
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const todasOpcoes = [escolhido, ...outros].sort(() => Math.random() - 0.5);

    setAtual(escolhido);
    setOpcoes(todasOpcoes);
    setDicas(0);
    setFase('pergunta');
    setResposta(null);
    setInputNome('');
    setRestante(TEMPO_RODADA);
  };

  // Temporizador de contagem regressiva
  useEffect(() => {
    if (fase === 'pergunta') {
      const inicio = Date.now();
      timerRef.current = setInterval(() => {
        const decorrido = (Date.now() - inicio) / 1000;
        const res = Math.max(0, TEMPO_RODADA - decorrido);
        setRestante(res);

        if (res <= 0) {
          clearInterval(timerRef.current);
          responder(null);
        }
      }, 100);

      return () => clearInterval(timerRef.current);
    }
  }, [fase, atual]);

  const responder = (id: number | null) => {
    if (fase !== 'pergunta' || !atual) return;
    clearInterval(timerRef.current);

    const acertou = id === atual.pokemonId;
    setFase('revelado');
    setResposta(id);
    setTotal((t) => t + 1);

    if (acertou) {
      soundEngine.playVitoria();
      setAcertos((a) => a + 1);
      const novaSeq = seq + 1;
      setSeq(novaSeq);

      const pts =
        Math.max(10, 100 + Math.round(restante) * 5 - dicas * 30) +
        (novaSeq >= 3 ? 25 * Math.min(novaSeq - 2, 4) : 0);
      setGanho(pts);
      setPontos((p) => p + pts);

      if (novaSeq > recorde) {
        setRecorde(novaSeq);
        try {
          localStorage.setItem('pkQuizRecorde', String(novaSeq));
        } catch {}
      }

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } else {
      soundEngine.playErro();
      setSeq(0);
      setGanho(0);
    }

    setHistorico((h) => [{ id: atual.pokemonId, nome: atual.nomeEspecie, ok: acertou }, ...h.slice(0, 11)]);
  };

  const handleDigitarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputNome.trim() || !atual) return;

    const norm = (s: string) =>
      s
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '');

    const chute = norm(inputNome);
    const correto = norm(atual.nomeEspecie);

    if (chute === correto) {
      responder(atual.pokemonId);
    } else {
      responder(-1);
    }
  };

  const alternarGen = (g: number) => {
    if (gens.includes(g)) {
      setGens(gens.filter((x) => x !== g));
    } else {
      setGens([...gens, g]);
    }
  };

  return (
    <div className="pk-palco">
      {/* Topo / Header unificado */}
      <AppHeader
        paginaAtual="quiz"
        titulo="QUIZ POKÉMON"
        subtitulo="QUEM É ESSE POKÉMON?"
      />

      <div style={{ position: 'absolute', inset: '60px 16px 14px 16px', display: 'flex', gap: '16px' }}>
        {/* Painel Esquerdo / Central do Jogo */}
        <div className="qz-painel" style={{ flex: 1, position: 'relative' }}>
          {fase === 'inicio' ? (
            <div className="qz-ini">
              <div className="qz-logo">
                QUEM É ESSE
                <br />
                POKÉMON?
              </div>
              <div className="qz-ini-tx">
                Descubra o Pokémon pela silhueta! Escolha as opções ou digite o nome exato.
              </div>
              <button
                type="button"
                className="bt bt-go"
                onClick={novaRodada}
              >
                ▶ COMEÇAR
              </button>
            </div>
          ) : atual ? (
            <>
              {/* Barra de Tempo */}
              <div className="qz-tempo-trilha">
                <div
                  className={`qz-tempo-f ${restante < 6 ? 'pouco' : ''}`}
                  style={{ width: `${(restante / TEMPO_RODADA) * 100}%` }}
                />
              </div>

              {/* Área da Silhueta / Revelação */}
              <div className="qz-palco">
                <div className={`qz-mon-box ${fase === 'revelado' ? 'rev' : ''}`}>
                  <img
                    className="qz-mon"
                    src={atual.imgArte}
                    alt="Quem é esse Pokémon?"
                  />
                </div>
                <div className="qz-seg">{Math.ceil(restante)}s</div>
              </div>

              {/* Dicas reveladas */}
              <div className="qz-dicas">
                {dicas >= 1 && (
                  <span className="qz-dica-item">
                    Tipo: {atual.tipo1} {atual.tipo2 ? `/ ${atual.tipo2}` : ''}
                  </span>
                )}
                {dicas >= 2 && <span className="qz-dica-item">Geração: {atual.geracao}</span>}
                {dicas >= 3 && (
                  <span className="qz-dica-item">
                    Nome: {atual.nomeEspecie.charAt(0)}{' '}
                    {atual.nomeEspecie
                      .slice(1)
                      .split('')
                      .map((c) => (/[a-zA-Z]/.test(c) ? '_' : c))
                      .join(' ')}
                  </span>
                )}
              </div>

              {/* Controles de Resposta */}
              {fase === 'pergunta' ? (
                modo === 'opcoes' ? (
                  <div className="qz-ops">
                    {opcoes.map((op) => (
                      <div
                        key={op.pokemonId}
                        className="qz-op"
                        onClick={() => responder(op.pokemonId)}
                      >
                        {op.nomeEspecie}
                      </div>
                    ))}
                  </div>
                ) : (
                  <form onSubmit={handleDigitarSubmit} className="qz-dig">
                    <input
                      type="text"
                      className="busca"
                      placeholder="Digite o nome do Pokémon e aperte Enter..."
                      value={inputNome}
                      onChange={(e) => setInputNome(e.target.value)}
                      autoFocus
                    />
                    <button type="submit" className="bt bt-gold">
                      Responder
                    </button>
                  </form>
                )
              ) : (
                /* Resultado da Rodada */
                <div className={`qz-res ${resposta === atual.pokemonId ? 'ok' : 'erro'}`}>
                  <div className="qz-res-tit">
                    {resposta === atual.pokemonId ? `ACERTOU! +${ganho} PONTOS` : 'NÃO FOI DESSA VEZ!'}
                  </div>
                  <div className="qz-res-nome">
                    É o <b>{atual.nomeEspecie}</b>!
                  </div>
                  <button
                    type="button"
                    className="bt bt-gold"
                    style={{ marginTop: '12px' }}
                    onClick={novaRodada}
                  >
                    Próximo Pokémon ›
                  </button>
                </div>
              )}

              {/* Ações Auxiliares: Dica e Pular */}
              {fase === 'pergunta' && (
                <div className="qz-dicas-bt">
                  <button
                    type="button"
                    disabled={dicas >= 3}
                    className={`bt bt-sec ${dicas >= 3 ? 'off' : ''}`}
                    onClick={() => setDicas((d) => d + 1)}
                  >
                    💡 Pedir Dica ({3 - dicas}) · −30 pts
                  </button>
                  <button
                    type="button"
                    className="bt bt-sec"
                    onClick={() => responder(null)}
                  >
                    Pular Rodada
                  </button>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Painel Direito: Pontuação, Modos e Histórico */}
        <div className="vidro" style={{ width: '280px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Placar */}
          <div>
            <span style={{ fontSize: '10px', color: '#8A93A3', fontWeight: 800, letterSpacing: '.12em' }}>PONTUAÇÃO</span>
            <div style={{ fontSize: '32px', fontWeight: 900, color: '#FFCB05' }}>{pontos}</div>
            <div style={{ fontSize: '12px', color: '#C9CFDA', marginTop: '2px' }}>
              Sequência: <b>{seq}</b> · Recorde: <b>{recorde}</b>
            </div>
            <div style={{ fontSize: '11px', color: '#8A93A3', marginTop: '4px' }}>
              Taxa de acertos: {total > 0 ? `${Math.round((acertos / total) * 100)}%` : '0%'} ({acertos}/{total})
            </div>
          </div>

          {/* Seleção do Modo */}
          <div>
            <span style={{ fontSize: '10px', color: '#8A93A3', fontWeight: 800, letterSpacing: '.12em' }}>MODO DE JOGO</span>
            <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
              <button
                type="button"
                className={`bt bt-sec ${modo === 'opcoes' ? 'on' : ''}`}
                style={{ flex: 1, height: '30px', fontSize: '11px' }}
                onClick={() => setModo('opcoes')}
              >
                4 Opções
              </button>
              <button
                type="button"
                className={`bt bt-sec ${modo === 'digitar' ? 'on' : ''}`}
                style={{ flex: 1, height: '30px', fontSize: '11px' }}
                onClick={() => setModo('digitar')}
              >
                Digitação
              </button>
            </div>
          </div>

          {/* Filtro por Geração */}
          <div>
            <span style={{ fontSize: '10px', color: '#8A93A3', fontWeight: 800, letterSpacing: '.12em' }}>FILTRO DE GERAÇÕES</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', marginTop: '6px' }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((g) => (
                <button
                  key={g}
                  type="button"
                  className={`gc ${gens.includes(g) ? 'on' : ''}`}
                  style={{ height: '24px' }}
                  onClick={() => alternarGen(g)}
                >
                  G{g}
                </button>
              ))}
            </div>
          </div>

          {/* Histórico Recente */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <span style={{ fontSize: '10px', color: '#8A93A3', fontWeight: 800, letterSpacing: '.12em', marginBottom: '6px' }}>
              HISTÓRICO RECENTE
            </span>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {historico.map((h, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    background: 'rgba(255,255,255,.04)',
                    fontSize: '11px',
                  }}
                >
                  <span>{h.nome}</span>
                  <span style={{ color: h.ok ? '#22C55E' : '#EF4444', fontWeight: 900 }}>
                    {h.ok ? '✓ Acertou' : '✗ Errou'}
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
