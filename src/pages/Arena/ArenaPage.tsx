import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { AppHeader } from '../../components/AppHeader';
import { ARENAS_TEMATICAS, ArenaCenario } from '../../data/arenasData';
import { BattleEnvironment } from '../../components/Arena/BattleEnvironment';
import { ArenaSelectorModal } from '../../components/Arena/ArenaSelectorModal';
import { soundEngine } from '../../engines/soundEngine';
import {
  POKEMON_ARENA_LIST,
  POKEMON_ARENA_MAP,
  criarLado,
  ativo,
  vivos,
  opcoesTransformar,
  aplicarForma,
  desfazerGmax,
  calcularAtaque,
  iaDecidirAcao,
  simular1000Batalhas,
  corTipo,
  nomeTipo,
  TeamSide,
  Combatant,
} from '../../engines/battleEngine';
import '../../styles/arena.css';

export const ArenaPage: React.FC = () => {
  // Configuração da Batalha
  const [fase, setFase] = useState<'selecao' | 'vs' | 'luta' | 'fim'>('selecao');
  const [modo, setModo] = useState<1 | 3>(1); // 1x1 ou 3x3
  const [ladoAtivo, setLadoAtivo] = useState<'j' | 'o'>('j');
  const [timeJogadorIds, setTimeJogadorIds] = useState<number[]>([6]); // Charizard padrão
  const [timeCpuIds, setTimeCpuIds] = useState<number[]>([9]); // Blastoise padrão
  const [busca, setBusca] = useState('');
  const [genFiltro, setGenFiltro] = useState<number | 0>(0);
  const [tipoFiltro, setTipoFiltro] = useState<string | null>(null);

  // Estado da Luta
  const [ladoJ, setLadoJ] = useState<TeamSide | null>(null);
  const [ladoO, setLadoO] = useState<TeamSide | null>(null);
  const [logBatalha, setLogBatalha] = useState<string[]>([]);
  const [narracao, setNarracao] = useState<string>('');
  const [animJ, setAnimJ] = useState<string>('');
  const [animO, setAnimO] = useState<string>('');
  const [fxGolpe, setFxGolpe] = useState<{ tipo: string; classe: string } | null>(null);
  const [vencedor, setVencedor] = useState<'j' | 'o' | null>(null);
  const [bloquearAcoes, setBloquearAcoes] = useState<boolean>(false);
  const [previsaoWinrate, setPrevisaoWinrate] = useState<number | null>(null);
  const [calculandoPrevisao, setCalculandoPrevisao] = useState<boolean>(false);
  const [cenario, setCenario] = useState<ArenaCenario>(ARENAS_TEMATICAS[0]);
  const [horario, setHorario] = useState<'amanhecer' | 'dia' | 'entardecer' | 'noite'>('dia');
  const [clima, setClima] = useState<'limpo' | 'chuva' | 'sol' | 'neve' | 'tempestade' | 'nevoa'>('limpo');
  const [cameraShake, setCameraShake] = useState<boolean>(false);
  const [mostrarSeletorArena, setMostrarSeletorArena] = useState<boolean>(false);
  const [audioAtivo, setAudioAtivo] = useState<boolean>(() => soundEngine.isHabilitado());

  // Atualizar simulação de vitória quando a seleção mudar
  useEffect(() => {
    if (fase === 'selecao' && timeJogadorIds.length > 0 && timeCpuIds.length > 0) {
      setCalculandoPrevisao(true);
      const timer = setTimeout(() => {
        const wr = simular1000Batalhas(timeJogadorIds, timeCpuIds);
        setPrevisaoWinrate(Math.round(wr));
        setCalculandoPrevisao(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [timeJogadorIds, timeCpuIds, fase]);

  // Filtros de seleção de Pokémon na Arena
  const listaFiltrada = React.useMemo(() => {
    return POKEMON_ARENA_LIST.filter((p) => {
      if (!p.padrao) return false;
      if (genFiltro !== 0 && p.gen !== genFiltro) return false;
      if (tipoFiltro && !p.t.includes(tipoFiltro)) return false;
      if (busca.trim()) {
        const term = busca.toLowerCase();
        if (!p.nome.toLowerCase().includes(term) && !String(p.id).includes(term)) return false;
      }
      return true;
    });
  }, [busca, genFiltro, tipoFiltro]);

  const alternarSlot = (id: number) => {
    const alvo = ladoAtivo === 'j' ? timeJogadorIds : timeCpuIds;
    const setter = ladoAtivo === 'j' ? setTimeJogadorIds : setTimeCpuIds;

    if (alvo.includes(id)) {
      if (alvo.length > 1) {
        setter(alvo.filter((x) => x !== id));
      }
    } else {
      if (alvo.length < modo) {
        setter([...alvo, id]);
      } else {
        // Substitui o último ou o único
        const novo = [...alvo];
        novo[novo.length - 1] = id;
        setter(novo);
      }
    }
  };

  const sortearTime = (lado: 'j' | 'o') => {
    const sorteados: number[] = [];
    const pool = POKEMON_ARENA_LIST.filter((p) => p.padrao);
    while (sorteados.length < modo) {
      const p = pool[Math.floor(Math.random() * pool.length)];
      if (!sorteados.includes(p.id)) {
        sorteados.push(p.id);
      }
    }
    if (lado === 'j') setTimeJogadorIds(sorteados);
    else setTimeCpuIds(sorteados);
  };

  // Iniciar Batalha com tela VS
  const iniciarBatalha = () => {
    if (timeJogadorIds.length === 0 || timeCpuIds.length === 0) return;
    const jSide = criarLado(timeJogadorIds);
    const oSide = criarLado(timeCpuIds);
    setLadoJ(jSide);
    setLadoO(oSide);
    setLogBatalha([]);
    setVencedor(null);
    setBloquearAcoes(false);
    setFase('vs');

    setTimeout(() => {
      setFase('luta');
      setNarracao(`A batalha começou! Vai, ${ativo(jSide).nome}!`);
    }, 1800);
  };

  // Execução do turno de combate
  const executarTurno = (acaoJogador: { tipo: 'golpe' | 'troca'; indice: number }) => {
    if (!ladoJ || !ladoO || bloquearAcoes) return;
    setBloquearAcoes(true);

    const mJ = ativo(ladoJ);
    const mO = ativo(ladoO);
    const acaoCpu = iaDecidirAcao(ladoO, ladoJ);

    // Ordem de ações: Trocas ocorrem primeiro, depois golpes por prioridade e velocidade
    const passos: Array<() => Promise<void>> = [];

    // Troca do Jogador
    if (acaoJogador.tipo === 'troca') {
      passos.push(async () => {
        setAnimJ('sai');
        await delay(400);
        ladoJ.ativo = acaoJogador.indice;
        setLadoJ({ ...ladoJ });
        setAnimJ('entra');
        setNarracao(`Jogador trocou para ${ativo(ladoJ).nome}!`);
        await delay(700);
        setAnimJ('');
      });
    }

    // Troca da CPU
    if (acaoCpu.tipo === 'troca') {
      passos.push(async () => {
        setAnimO('sai');
        await delay(400);
        ladoO.ativo = acaoCpu.indice;
        setLadoO({ ...ladoO });
        setAnimO('entra');
        setNarracao(`Adversário trocou para ${ativo(ladoO).nome}!`);
        await delay(700);
        setAnimO('');
      });
    }

    // Se ambos atacarem
    if (acaoJogador.tipo === 'golpe' && acaoCpu.tipo === 'golpe') {
      const gJ = mJ.golpes[acaoJogador.indice];
      const gO = mO.golpes[acaoCpu.indice];

      const pJ = gJ.pr;
      const pO = gO.pr;
      const jMaisRapido =
        pJ !== pO ? pJ > pO : mJ.st.spe !== mO.st.spe ? mJ.st.spe > mO.st.spe : Math.random() < 0.5;

      const primeiro = jMaisRapido
        ? { atacante: 'j' as const, golpe: gJ, atkM: mJ, defM: mO }
        : { atacante: 'o' as const, golpe: gO, atkM: mO, defM: mJ };
      const segundo = jMaisRapido
        ? { atacante: 'o' as const, golpe: gO, atkM: mO, defM: mJ }
        : { atacante: 'j' as const, golpe: gJ, atkM: mJ, defM: mO };

      // Executa primeiro ataque
      passos.push(async () => {
        await aplicarGolpe(primeiro.atacante, primeiro.golpe, primeiro.atkM, primeiro.defM);
      });

      // Executa segundo ataque se defensor ainda estiver vivo
      passos.push(async () => {
        if (segundo.atkM.hp > 0) {
          await aplicarGolpe(segundo.atacante, segundo.golpe, segundo.atkM, segundo.defM);
        }
      });
    } else if (acaoJogador.tipo === 'troca' && acaoCpu.tipo === 'golpe') {
      // Jogador trocou, CPU ataca o novo Pokémon
      passos.push(async () => {
        const novoMJ = ativo(ladoJ);
        await aplicarGolpe('o', mO.golpes[acaoCpu.indice], mO, novoMJ);
      });
    } else if (acaoCpu.tipo === 'troca' && acaoJogador.tipo === 'golpe') {
      // CPU trocou, Jogador ataca o novo Pokémon
      passos.push(async () => {
        const novoMO = ativo(ladoO);
        await aplicarGolpe('j', mJ.golpes[acaoJogador.indice], mJ, novoMO);
      });
    }

    // Executa a fila assíncrona
    (async () => {
      for (const passo of passos) {
        await passo();
        // Checar fim de jogo imediato
        if (vivos(ladoJ).length === 0 || vivos(ladoO).length === 0) break;
      }

      // Decrementa turnos de Gigantamax se aplicável
      if (mJ.forma === 'gmax') {
        mJ.gmax = (mJ.gmax || 0) - 1;
        if (mJ.gmax <= 0) {
          desfazerGmax(mJ);
          setNarracao(`${mJ.nome} retornou à forma normal!`);
          await delay(600);
        }
      }
      if (mO.forma === 'gmax') {
        mO.gmax = (mO.gmax || 0) - 1;
        if (mO.gmax <= 0) {
          desfazerGmax(mO);
          setNarracao(`${mO.nome} do adversário retornou à forma normal!`);
          await delay(600);
        }
      }

      // Checa desmaios e substituições forçadas
      const vivoJ = vivos(ladoJ);
      const vivoO = vivos(ladoO);

      if (vivoJ.length === 0) {
        setVencedor('o');
        setNarracao('Você foi derrotado!');
        setFase('fim');
      } else if (vivoO.length === 0) {
        setVencedor('j');
        setNarracao('Parabéns! Você venceu a batalha!');
        setFase('fim');
      } else {
        if (ativo(ladoJ).hp <= 0) {
          const prox = ladoJ.time.findIndex((x) => x.hp > 0);
          ladoJ.ativo = prox;
          setLadoJ({ ...ladoJ });
          setAnimJ('entra');
          setNarracao(`Vai, ${ativo(ladoJ).nome}!`);
          await delay(600);
          setAnimJ('');
        }
        if (ativo(ladoO).hp <= 0) {
          const prox = ladoO.time.findIndex((x) => x.hp > 0);
          ladoO.ativo = prox;
          setLadoO({ ...ladoO });
          setAnimO('entra');
          setNarracao(`O adversário enviou ${ativo(ladoO).nome}!`);
          await delay(600);
          setAnimO('');
        }
      }

      setBloquearAcoes(false);
    })();
  };

  const aplicarGolpe = async (
    atacante: 'j' | 'o',
    golpe: any,
    a: Combatant,
    d: Combatant
  ) => {
    setNarracao(`${a.nome} usou ${golpe.nome}!`);
    soundEngine.playAtaque(golpe.t);

    if (atacante === 'j') setAnimJ('investe-j');
    else setAnimO('investe-o');
    await delay(250);
    setAnimJ('');
    setAnimO('');

    const res = calcularAtaque(a, d, golpe);
    if (res.erro) {
      setNarracao(`${a.nome} errou o ataque!`);
      soundEngine.playErro();
      await delay(700);
      return;
    }

    // Efeito visual de dano e camera shake
    soundEngine.playImpacto(res.crit);
    setCameraShake(true);
    setTimeout(() => setCameraShake(false), res.crit ? 500 : 350);

    if (atacante === 'j') setAnimO('dano');
    else setAnimJ('dano');

    d.hp = Math.max(0, d.hp - res.dano);
    if (atacante === 'j' && ladoO) setLadoO({ ...ladoO });
    if (atacante === 'o' && ladoJ) setLadoJ({ ...ladoJ });

    let txtEf = '';
    if (res.ef > 1) txtEf = ' É super efetivo!';
    else if (res.ef === 0) txtEf = ' Não teve efeito...';
    else if (res.ef < 1) txtEf = ' Não foi muito efetivo...';
    if (res.crit) txtEf += ' Um acerto crítico!';

    setNarracao(`${a.nome} causou ${res.dano} de dano!${txtEf}`);
    await delay(800);
    setAnimJ('');
    setAnimO('');

    if (d.hp <= 0) {
      if (atacante === 'j') setAnimO('desmaio');
      else setAnimJ('desmaio');
      setNarracao(`${d.nome} desmaiou!`);
      await delay(900);
      setAnimJ('');
      setAnimO('');
    }
  };

  const transformarPokemon = (op: { tipo: 'mega' | 'gmax'; p: any }) => {
    if (!ladoJ || bloquearAcoes) return;
    const m = ativo(ladoJ);
    aplicarForma(m, op);
    ladoJ.transformou = true;
    setLadoJ({ ...ladoJ });
    setNarracao(`${m.nome} se transformou em ${op.p.nome}!`);
  };

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  return (
    <div className="pk-palco">
      {/* Topo / Header unificado */}
      <AppHeader
        paginaAtual="arena"
        titulo="ARENA POKÉMON"
        subtitulo="BATALHAS ESTATÍSTICAS · NÍVEL 50"
      />

      {/* FASE 1: SELEÇÃO DE EQUIPES */}
      {fase === 'selecao' && (
        <div className="arena-selection-container">
          <div className="sel-bg" />

          {/* Coluna do Jogador (Esquerda) */}
          <div
            className={`sel-col sel-col-j ${ladoAtivo === 'j' ? 'ativo' : ''}`}
            onClick={() => setLadoAtivo('j')}
          >
            <div className="sel-col-tit">
              <span>SEU TIME</span>
              <button
                type="button"
                className="bt bt-sec"
                style={{ height: '26px', padding: '0 10px', fontSize: '10px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  sortearTime('j');
                }}
              >
                🎲 Sortear
              </button>
            </div>

            <div className={`sel-slots ${modo === 1 ? 'm1' : 'm3'}`}>
              {Array.from({ length: modo }).map((_, i) => {
                const id = timeJogadorIds[i];
                const p = id ? POKEMON_ARENA_MAP[id] : null;
                return p ? (
                  <div
                    key={i}
                    className="sl sl-cheio"
                    style={{ '--c': corTipo(p.t[0]) } as React.CSSProperties}
                  >
                    <i
                      onClick={(e) => {
                        e.stopPropagation();
                        alternarSlot(p.id);
                      }}
                    >
                      ×
                    </i>
                    <div className="sl-arte">
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`}
                        alt={p.nome}
                      />
                    </div>
                    <div className="sl-info">
                      <b>{p.nome}</b>
                      <span>{p.t.map(nomeTipo).join(' / ')}</span>
                      <div style={{ fontSize: '10px', color: '#FFCB05', marginTop: '2px' }}>
                        ATK {p.b.atk} · DEF {p.b.def} · VEL {p.b.spe}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key={i} className="sl sl-vazio">
                    <b>+</b>
                    <span>Escolha um Pokémon</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Coluna Central: Busca e Grade de Seleção */}
          <div className="sel-meio">
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="text"
                className="busca"
                placeholder="Buscar por nome ou número..."
                style={{ flex: 1 }}
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
              <button
                type="button"
                className={`bt ${mostrarSeletorArena ? 'bt-gold' : 'bt-sec'}`}
                style={{ height: '42px', padding: '0 12px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                onClick={() => setMostrarSeletorArena(!mostrarSeletorArena)}
                title="Configurar Arena e Clima"
              >
                <span>🏟️ {cenario.nome.split(' ')[0]}</span>
              </button>
              <button
                type="button"
                className={`bt ${audioAtivo ? 'bt-gold' : 'bt-sec'}`}
                style={{ height: '42px', width: '42px', padding: 0, fontSize: '14px' }}
                onClick={() => {
                  const novo = !audioAtivo;
                  setAudioAtivo(novo);
                  soundEngine.setHabilitado(novo);
                  if (novo) soundEngine.playClick();
                }}
                title={audioAtivo ? 'Áudio Ativo' : 'Áudio Mudo'}
              >
                {audioAtivo ? '🔊' : '🔇'}
              </button>
              <div className="modos">
                <span className={modo === 1 ? 'on' : ''} onClick={() => setModo(1)}>
                  1 vs 1
                </span>
                <span className={modo === 3 ? 'on' : ''} onClick={() => setModo(3)}>
                  Time de 3
                </span>
              </div>
            </div>

            {/* Painel expansível de Seleção de Arena */}
            {mostrarSeletorArena && (
              <ArenaSelectorModal
                cenarioSelecionado={cenario}
                onSelecionar={(c) => {
                  setCenario(c);
                  setMostrarSeletorArena(false);
                }}
                horario={horario}
                onChangeHorario={setHorario}
                clima={clima}
                onChangeClima={setClima}
              />
            )}

            {/* Filtros de Geração */}
            <div className="gens">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((g) => (
                <div
                  key={g}
                  className={`gc ${genFiltro === g ? 'on' : ''}`}
                  onClick={() => setGenFiltro(g)}
                >
                  {g === 0 ? 'TODAS' : `GEN ${g}`}
                </div>
              ))}
            </div>

            {/* Grid dos Pokémons */}
            <div className="grade">
              {listaFiltrada.slice(0, 120).map((p) => {
                const noJ = timeJogadorIds.includes(p.id);
                const noO = timeCpuIds.includes(p.id);
                return (
                  <div
                    key={p.id}
                    className={`cd ${noJ ? 'no-j' : ''} ${noO ? 'no-o' : ''}`}
                    style={{ '--c': corTipo(p.t[0]) } as React.CSSProperties}
                    onClick={() => alternarSlot(p.id)}
                  >
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`}
                      alt={p.nome}
                      loading="lazy"
                    />
                    <span>{p.nome}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Coluna do Adversário (Direita) */}
          <div
            className={`sel-col sel-col-o ${ladoAtivo === 'o' ? 'ativo' : ''}`}
            onClick={() => setLadoAtivo('o')}
          >
            <div className="sel-col-tit">
              <span>ADVERSÁRIO</span>
              <button
                type="button"
                className="bt bt-sec"
                style={{ height: '26px', padding: '0 10px', fontSize: '10px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  sortearTime('o');
                }}
              >
                🎲 Sortear
              </button>
            </div>

            <div className={`sel-slots ${modo === 1 ? 'm1' : 'm3'}`}>
              {Array.from({ length: modo }).map((_, i) => {
                const id = timeCpuIds[i];
                const p = id ? POKEMON_ARENA_MAP[id] : null;
                return p ? (
                  <div
                    key={i}
                    className="sl sl-cheio"
                    style={{ '--c': corTipo(p.t[0]) } as React.CSSProperties}
                  >
                    <i
                      onClick={(e) => {
                        e.stopPropagation();
                        alternarSlot(p.id);
                      }}
                    >
                      ×
                    </i>
                    <div className="sl-arte">
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`}
                        alt={p.nome}
                      />
                    </div>
                    <div className="sl-info">
                      <b>{p.nome}</b>
                      <span>{p.t.map(nomeTipo).join(' / ')}</span>
                      <div style={{ fontSize: '10px', color: '#FF5A36', marginTop: '2px' }}>
                        ATK {p.b.atk} · DEF {p.b.def} · VEL {p.b.spe}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key={i} className="sl sl-vazio">
                    <b>+</b>
                    <span>Escolha um Pokémon</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rodapé da Seleção: Previsão de Vitória e Botão BATALHAR */}
          <div className="sel-rodape">
            <div className="pv">
              <span className="pv-tit">PREVISÃO (1.000 BATALHAS)</span>
              {calculandoPrevisao ? (
                <span className="pv-dica">Simulando...</span>
              ) : previsaoWinrate !== null ? (
                <div className="pv-barra">
                  <div className="pv-j" style={{ width: `${previsaoWinrate}%` }}>
                    Você {previsaoWinrate}%
                  </div>
                  <div className="pv-o">{100 - previsaoWinrate}% Oponente</div>
                </div>
              ) : null}
            </div>

            <button
              type="button"
              className="bt bt-go"
              onClick={iniciarBatalha}
              disabled={timeJogadorIds.length === 0 || timeCpuIds.length === 0}
            >
              ⚔ BATALHAR!
            </button>
          </div>
        </div>
      )}

      {/* FASE 2: INTRO VS */}
      {fase === 'vs' && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="vs" style={{ width: '130px', height: '130px', margin: 0 }}>
            <span style={{ width: '60px', height: '60px', fontSize: '22px' }}>VS</span>
          </div>
        </div>
      )}

      {/* FASE 3 E 4: BATALHA E RESULTADO */}
      {(fase === 'luta' || fase === 'fim') && ladoJ && ladoO && (
        <div className={`arena-combat-stage ${cameraShake ? 'treme-forte' : ''}`}>
          {/* Cenário Cinematográfico Dinâmico (10 Arenas + Clima + Horário) */}
          <BattleEnvironment
            cenario={cenario}
            horario={horario}
            clima={clima}
          />
          <div className="campo-luz" />
          <div className="diag" />

          {/* HUD do Jogador */}
          <div className="hud hud-j">
            <div className="hud-foto" style={{ '--c': corTipo(ativo(ladoJ).t[0]) } as React.CSSProperties}>
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${ativo(ladoJ).id}.png`}
                alt={ativo(ladoJ).nome}
              />
            </div>
            <div className="hud-corpo">
              <div className="hud-nome">
                <b>{ativo(ladoJ).nome}</b>
                <span>Nv. 50</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,.1)', borderRadius: '999px', overflow: 'hidden', marginTop: '4px' }}>
                <div
                  style={{
                    height: '100%',
                    background: ativo(ladoJ).hp / ativo(ladoJ).hpMax > 0.5 ? '#22C55E' : ativo(ladoJ).hp / ativo(ladoJ).hpMax > 0.2 ? '#EAB308' : '#EF4444',
                    width: `${Math.max(0, (ativo(ladoJ).hp / ativo(ladoJ).hpMax) * 100)}%`,
                    transition: 'width .3s ease',
                  }}
                />
              </div>
              <div style={{ fontSize: '10px', color: '#C9CFDA', marginTop: '3px', fontWeight: 800 }}>
                {ativo(ladoJ).hp} / {ativo(ladoJ).hpMax} HP
              </div>
            </div>
          </div>

          {/* HUD do Adversário */}
          <div className="hud hud-o">
            <div className="hud-foto" style={{ '--c': corTipo(ativo(ladoO).t[0]) } as React.CSSProperties}>
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${ativo(ladoO).id}.png`}
                alt={ativo(ladoO).nome}
              />
            </div>
            <div className="hud-corpo">
              <div className="hud-nome">
                <b>{ativo(ladoO).nome}</b>
                <span>Nv. 50</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,.1)', borderRadius: '999px', overflow: 'hidden', marginTop: '4px' }}>
                <div
                  style={{
                    height: '100%',
                    background: ativo(ladoO).hp / ativo(ladoO).hpMax > 0.5 ? '#22C55E' : ativo(ladoO).hp / ativo(ladoO).hpMax > 0.2 ? '#EAB308' : '#EF4444',
                    width: `${Math.max(0, (ativo(ladoO).hp / ativo(ladoO).hpMax) * 100)}%`,
                    transition: 'width .3s ease',
                  }}
                />
              </div>
              <div style={{ fontSize: '10px', color: '#C9CFDA', marginTop: '3px', fontWeight: 800 }}>
                {ativo(ladoO).hp} / {ativo(ladoO).hpMax} HP
              </div>
            </div>
          </div>

          {/* Plataformas e Sprites dos Pokémon */}
          <div className="plat plat-o" style={{ '--c': corTipo(ativo(ladoO).t[0]) } as React.CSSProperties} />
          <div className="plat plat-j" style={{ '--c': corTipo(ativo(ladoJ).t[0]) } as React.CSSProperties} />

          <div className="mon mon-o">
            <img
              className={`spr ${animO}`}
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${ativo(ladoO).id}.gif`}
              alt={ativo(ladoO).nome}
              onError={(e) => {
                e.currentTarget.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${ativo(ladoO).id}.png`;
              }}
            />
          </div>

          <div className="mon mon-j">
            <img
              className={`spr ${animJ}`}
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/${ativo(ladoJ).id}.gif`}
              alt={ativo(ladoJ).nome}
              onError={(e) => {
                e.currentTarget.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${ativo(ladoJ).id}.gif`;
              }}
            />
          </div>

          {/* Painel Inferior: Golpes, Transformações, Trocas e Narração */}
          <div
            style={{
              position: 'absolute',
              left: '16px',
              right: '16px',
              bottom: '14px',
              height: '160px',
              display: 'flex',
              gap: '12px',
              zIndex: 10,
            }}
          >
            {/* Caixa de Texto / Narração */}
            <div
              className="vidro"
              style={{
                flex: 1,
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                fontSize: '15px',
                fontWeight: 700,
                color: '#fff',
                lineHeight: 1.5,
              }}
            >
              {narracao}
              {fase === 'fim' && (
                <div style={{ marginTop: '12px' }}>
                  <button
                    type="button"
                    className="bt bt-gold"
                    onClick={() => setFase('selecao')}
                  >
                    🔄 Nova Partida
                  </button>
                </div>
              )}
            </div>

            {/* Painel de Ações do Jogador (se a partida estiver em andamento) */}
            {fase === 'luta' && (
              <div
                className="vidro"
                style={{
                  width: '460px',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                {/* 4 Golpes */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', flex: 1 }}>
                  {ativo(ladoJ).golpes.map((g, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={bloquearAcoes || ativo(ladoJ).hp <= 0}
                      className="bt bt-sec"
                      style={{
                        height: 'auto',
                        padding: '8px 12px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        borderLeft: `4px solid ${corTipo(g.t)}`,
                      }}
                      onClick={() => executarTurno({ tipo: 'golpe', indice: idx })}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <b style={{ color: '#fff', fontSize: '12px' }}>{g.nome}</b>
                        <span style={{ fontSize: '10px', color: '#FFCB05' }}>PW {g.pw}</span>
                      </div>
                      <span style={{ fontSize: '9.5px', color: '#8A93A3', marginTop: '2px' }}>
                        {nomeTipo(g.t)} · {g.c === 'F' ? 'Físico' : 'Especial'}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Linha de Transformação e Troca */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  {opcoesTransformar(ladoJ).map((op, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={bloquearAcoes}
                      className="bt bt-gold"
                      style={{ flex: 1, fontSize: '11px', height: '30px' }}
                      onClick={() => transformarPokemon(op)}
                    >
                      {op.tipo === 'gmax' ? '🔴 Gigantamax' : '💎 Mega Evolução'}
                    </button>
                  ))}

                  {/* Trocas de Pokémon no time de 3 */}
                  {ladoJ.time.map((m, idx) => {
                    if (idx === ladoJ.ativo || m.hp <= 0) return null;
                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={bloquearAcoes}
                        className="bt bt-sec"
                        style={{ height: '30px', padding: '0 10px', fontSize: '10px' }}
                        onClick={() => executarTurno({ tipo: 'troca', indice: idx })}
                      >
                        Trocar › {m.nome} ({m.hp} HP)
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
