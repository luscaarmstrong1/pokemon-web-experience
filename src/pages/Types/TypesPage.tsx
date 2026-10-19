import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AppSidebar } from '../../components/AppSidebar';
import { AppHeader } from '../../components/AppHeader';
import tiposDataRaw from '../../data/tipos.json';
import arenaDadosRaw from '../../data/arena_dados.json';
import { PokemonType, ArenaDados } from '../../types/pokemon';
import '../../styles/tipos.css';

const TIPOS_LIST = tiposDataRaw as PokemonType[];
const ARENA_DADOS = arenaDadosRaw as unknown as ArenaDados;
const SLUGS = TIPOS_LIST.map((t) => t.slug);

export const TypesPage: React.FC = () => {
  const [aba, setAba] = useState<'roda' | 'matriz' | 'rankings' | 'calc'>('roda');
  const [modoRoda, setModoRoda] = useState<'ataque' | 'defesa'>('ataque');
  const [atkSelecionado, setAtkSelecionado] = useState<string>('fire');
  const [defSelecionados, setDefSelecionados] = useState<string[]>(['grass']);
  const [focoHover, setFocoHover] = useState<string | null>(null);

  // Calculadora
  const [calcAtk, setCalcAtk] = useState<string>('fire');
  const [calcDef1, setCalcDef1] = useState<string>('grass');
  const [calcDef2, setCalcDef2] = useState<string | 'none'>('none');

  // Coordenadas trigonométricas da roda (632x600, centro em 316, 300, raio 238)
  const CX = 316;
  const CY = 300;
  const R = 238;

  const ponto = (slug: string) => {
    const idx = SLUGS.indexOf(slug);
    const a = -Math.PI / 2 + (2 * Math.PI * idx) / SLUGS.length;
    return { x: CX + R * Math.cos(a), y: CY + R * Math.sin(a) };
  };

  const getEf = (a: string, d: string): number => {
    const factor = ARENA_DADOS.ef[`${a}>${d}`];
    return factor !== undefined ? factor : 1;
  };

  const getEfTotal = (a: string, defs: string[]): number => {
    return defs.reduce((acc, d) => acc * getEf(a, d), 1);
  };

  const getTipoInfo = (slug: string) => {
    return TIPOS_LIST.find((t) => t.slug === slug) || TIPOS_LIST[0];
  };

  // Gerador de curva de Bézier para as setas animadas
  const renderSeta = (de: string, para: string, classe: string, delayIdx: number) => {
    const a = ponto(de);
    const b = ponto(para);
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const cx = CX + (mx - CX) * 0.35;
    const cy = CY + (my - CY) * 0.35;

    const dx = b.x - cx;
    const dy = b.y - cy;
    const d = Math.hypot(dx, dy) || 1;
    const bx = b.x - (dx / d) * 28;
    const by = b.y - (dy / d) * 28;

    const ax = a.x + ((cx - a.x) / Math.hypot(cx - a.x, cy - a.y)) * 26;
    const ay = a.y + ((cy - a.y) / Math.hypot(cx - a.x, cy - a.y)) * 26;

    return (
      <path
        key={`${de}-${para}-${classe}`}
        className={`seta ${classe}`}
        pathLength="1"
        style={{ animationDelay: `${delayIdx * 40}ms` }}
        markerEnd={`url(#m-${classe})`}
        d={`M${ax.toFixed(1)},${ay.toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${bx.toFixed(1)},${by.toFixed(1)}`}
      />
    );
  };

  // Setas calculadas da Roda
  const setas = React.useMemo(() => {
    const itens: React.ReactNode[] = [];
    let idx = 0;

    if (modoRoda === 'ataque') {
      const a = focoHover || atkSelecionado;
      SLUGS.forEach((d) => {
        const x = getEf(a, d);
        if (x > 1) itens.push(renderSeta(a, d, 'sup', idx++));
        else if (x === 0) itens.push(renderSeta(a, d, 'nul', idx++));
        else if (x < 1) itens.push(renderSeta(a, d, 'pou', idx++));
      });
    } else {
      const def = focoHover ? [focoHover] : defSelecionados;
      if (def.length > 0) {
        SLUGS.forEach((t) => {
          const x = getEfTotal(t, def);
          if (x > 1) itens.push(renderSeta(t, def[0], x >= 4 ? 'sup4' : 'sup', idx++));
          else if (x === 0) itens.push(renderSeta(t, def[0], 'nul', idx++));
          else if (x < 1) itens.push(renderSeta(t, def[0], 'pou', idx++));
        });
      }
    }
    return itens;
  }, [modoRoda, atkSelecionado, defSelecionados, focoHover]);

  // Rankings das 171 combinações de tipos possíveis
  const rankings = React.useMemo(() => {
    const combos: Array<{ t1: string; t2: string | null; fraquezas: number; resistencias: number; imunidades: number; score: number }> = [];

    // Individuais (18)
    SLUGS.forEach((t1) => {
      let fr = 0, res = 0, im = 0;
      SLUGS.forEach((atk) => {
        const x = getEf(atk, t1);
        if (x > 1) fr++;
        else if (x === 0) im++;
        else if (x < 1) res++;
      });
      combos.push({ t1, t2: null, fraquezas: fr, resistencias: res, imunidades: im, score: res + im * 2 - fr });
    });

    // Pares distintos (153)
    for (let i = 0; i < SLUGS.length; i++) {
      for (let j = i + 1; j < SLUGS.length; j++) {
        const t1 = SLUGS[i];
        const t2 = SLUGS[j];
        let fr = 0, res = 0, im = 0;
        SLUGS.forEach((atk) => {
          const x = getEf(atk, t1) * getEf(atk, t2);
          if (x > 1) fr++;
          else if (x === 0) im++;
          else if (x < 1) res++;
        });
        combos.push({ t1, t2, fraquezas: fr, resistencias: res, imunidades: im, score: res + im * 2 - fr });
      }
    }

    return combos.sort((a, b) => b.score - a.score);
  }, []);

  return (
    <div className="pk-palco">
      {/* Barra Lateral Vertical de Módulos (Esquerda) */}
      <AppSidebar paginaAtual="tipos" />

      {/* Topo / Header com navegação e abas */}
      <AppHeader
        paginaAtual="tipos"
        titulo="ANÁLISE DE TIPOS"
        subtitulo="EFICÁCIA · FRAQUEZAS · RESISTÊNCIAS"
        centerContent={
          <div className="abas" style={{ position: 'static', margin: 0, padding: 0 }}>
            <span className={aba === 'roda' ? 'on' : ''} onClick={() => setAba('roda')}>
              Roda
            </span>
            <span className={aba === 'matriz' ? 'on' : ''} onClick={() => setAba('matriz')}>
              Matriz 18×18
            </span>
            <span className={aba === 'rankings' ? 'on' : ''} onClick={() => setAba('rankings')}>
              Rankings (171)
            </span>
            <span className={aba === 'calc' ? 'on' : ''} onClick={() => setAba('calc')}>
              Calculadora
            </span>
          </div>
        }
      />

      {/* ABA 1: RODA DE TIPOS */}
      {aba === 'roda' && (
        <div style={{ position: 'absolute', inset: '60px 0 0 0', display: 'flex', justifyContent: 'center' }}>
          {/* Segmentador de modo Ataque / Defesa */}
          <div className="roda-modos modos">
            <span
              className={modoRoda === 'ataque' ? 'on' : ''}
              onClick={() => setModoRoda('ataque')}
            >
              ⚔ Modo Ataque
            </span>
            <span
              className={modoRoda === 'defesa' ? 'on' : ''}
              onClick={() => setModoRoda('defesa')}
            >
              🛡 Modo Defesa
            </span>
          </div>

          {/* Legenda das setas */}
          <div className="roda-leg">
            {modoRoda === 'ataque' ? (
              <>
                <span><i className="l-sup" /> Dano dobrado (×2)</span>
                <span><i className="l-pou" /> Metade (½)</span>
                <span><i className="l-nul" /> Sem efeito (0)</span>
              </>
            ) : (
              <>
                <span><i className="l-sup" /> Ameaça (×2)</span>
                <span><i className="l-sup4" /> Ameaça (×4)</span>
                <span><i className="l-pou" /> Resistido (½)</span>
                <span><i className="l-nul" /> Imune (0)</span>
              </>
            )}
          </div>

          <div className="roda">
            <svg className="roda-svg" width="632" height="600">
              <defs>
                <marker id="m-sup" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" fill="#22C55E" />
                </marker>
                <marker id="m-sup4" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" fill="#86EFAC" />
                </marker>
                <marker id="m-pou" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" fill="#EF4444" />
                </marker>
                <marker id="m-nul" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" fill="#94A3B8" />
                </marker>
              </defs>
              <circle cx={CX} cy={CY} r={R} className="roda-aro" />
              <g id="tp-setas">{setas}</g>
            </svg>

            {/* Centro da Roda */}
            <div className="roda-centro">
              {modoRoda === 'ataque' ? (
                (() => {
                  const a = focoHover || atkSelecionado;
                  const info = getTipoInfo(a);
                  const vence = SLUGS.filter((d) => getEf(a, d) > 1).length;
                  const fraco = SLUGS.filter((d) => getEf(a, d) > 0 && getEf(a, d) < 1).length;
                  return (
                    <>
                      <div className="rc-ico">
                        <img src={`/icons/${a}.svg`} style={{ width: '64px', height: '64px' }} alt={info.nome} />
                      </div>
                      <b style={{ color: info.cor }}>{info.nome}</b>
                      <span>
                        vence <em className="v">{vence}</em> · fraco em <em className="f">{fraco}</em>
                      </span>
                    </>
                  );
                })()
              ) : (
                (() => {
                  const def = focoHover ? [focoHover] : defSelecionados;
                  const ameaca = SLUGS.filter((t) => getEfTotal(t, def) > 1).length;
                  const resiste = SLUGS.filter((t) => getEfTotal(t, def) < 1).length;
                  return (
                    <>
                      <div className="rc-ico">
                        {def.map((d) => (
                          <img
                            key={d}
                            src={`/icons/${d}.svg`}
                            style={{ width: def.length > 1 ? '48px' : '64px', height: def.length > 1 ? '48px' : '64px' }}
                            alt={d}
                          />
                        ))}
                      </div>
                      <b>{def.map((d) => getTipoInfo(d).nome).join(' / ')}</b>
                      <span>
                        ameaças <em className="f">{ameaca}</em> · resiste a <em className="v">{resiste}</em>
                      </span>
                    </>
                  );
                })()
              )}
            </div>

            {/* Nós circulares dos 18 tipos */}
            {SLUGS.map((slug) => {
              const p = ponto(slug);
              const info = getTipoInfo(slug);
              const isSelected = modoRoda === 'ataque' ? slug === atkSelecionado : defSelecionados.includes(slug);

              return (
                <div
                  key={slug}
                  className={`no ${isSelected ? 'on' : ''}`}
                  style={{
                    left: `${p.x - 25}px`,
                    top: `${p.y - 25}px`,
                    '--c': info.cor,
                  } as React.CSSProperties}
                  onMouseEnter={() => setFocoHover(slug)}
                  onMouseLeave={() => setFocoHover(null)}
                  onClick={() => {
                    if (modoRoda === 'ataque') {
                      setAtkSelecionado(slug);
                    } else {
                      if (defSelecionados.includes(slug)) {
                        if (defSelecionados.length > 1) {
                          setDefSelecionados(defSelecionados.filter((x) => x !== slug));
                        }
                      } else {
                        if (defSelecionados.length >= 2) {
                          setDefSelecionados([defSelecionados[1], slug]);
                        } else {
                          setDefSelecionados([...defSelecionados, slug]);
                        }
                      }
                    }
                  }}
                >
                  <img src={`/icons/${slug}.svg`} style={{ width: '44px', height: '44px' }} alt={info.nome} />
                  <span>{info.nome}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ABA 2: MATRIZ 18x18 */}
      {aba === 'matriz' && (
        <div style={{ position: 'absolute', inset: '70px 16px 16px 16px', overflow: 'auto', display: 'flex', justifyContent: 'center' }}>
          <div className="matriz">
            <div className="canto">
              <span>DEFENSOR →</span>
              <span>ATACANTE ↓</span>
            </div>

            {/* Cabeçalho Colunas (Defensores) */}
            {SLUGS.map((d) => (
              <div
                key={`cab-d-${d}`}
                className={`cab cab-d ${defSelecionados.includes(d) ? 'on' : ''}`}
                onClick={() => setDefSelecionados([d])}
              >
                <img src={`/icons/${d}.svg`} style={{ width: '22px', height: '22px' }} alt={d} />
              </div>
            ))}

            {/* Linhas (Atacantes) */}
            {SLUGS.map((a) => (
              <React.Fragment key={`linha-${a}`}>
                <div
                  className={`cab cab-a ${a === atkSelecionado ? 'on' : ''}`}
                  onClick={() => setAtkSelecionado(a)}
                >
                  <img src={`/icons/${a}.svg`} style={{ width: '22px', height: '22px' }} alt={a} />
                </div>
                {SLUGS.map((d) => {
                  const x = getEf(a, d);
                  const cls = x > 1 ? 'c2' : x === 0 ? 'c0' : x < 1 ? 'cm' : 'c1';
                  return (
                    <div
                      key={`cel-${a}-${d}`}
                      className={`cel ${cls} ${a === atkSelecionado ? 'ra' : ''} ${defSelecionados.includes(d) ? 'cd' : ''}`}
                      title={`${getTipoInfo(a).nome} ataca ${getTipoInfo(d).nome}: ${x}×`}
                    >
                      {x > 1 ? '2' : x === 0 ? '0' : x < 1 ? '½' : ''}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* ABA 3: RANKINGS DAS 171 COMBINAÇÕES */}
      {aba === 'rankings' && (
        <div style={{ position: 'absolute', inset: '70px 24px 20px 24px', overflowY: 'auto' }}>
          <div className="vidro" style={{ padding: '16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,.1)', color: '#8A93A3', fontSize: '11px', letterSpacing: '.1em' }}>
                  <th style={{ padding: '8px' }}>#</th>
                  <th style={{ padding: '8px' }}>COMBINAÇÃO DE TIPOS</th>
                  <th style={{ padding: '8px', color: '#8BE39D' }}>RESISTÊNCIAS</th>
                  <th style={{ padding: '8px', color: '#9BE7A6' }}>IMUNIDADES</th>
                  <th style={{ padding: '8px', color: '#FF7B7B' }}>FRAQUEZAS</th>
                  <th style={{ padding: '8px', color: '#FFCB05' }}>PONTUAÇÃO DEFENSIVA</th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((rk, idx) => (
                  <tr
                    key={idx}
                    style={{ borderBottom: '1px solid rgba(255,255,255,.04)', height: '40px' }}
                  >
                    <td style={{ padding: '8px', color: '#737C8C' }}>{idx + 1}</td>
                    <td style={{ padding: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className={`pk-chip`} style={{ '--c': getTipoInfo(rk.t1).cor } as React.CSSProperties}>
                        {getTipoInfo(rk.t1).nome}
                      </span>
                      {rk.t2 && (
                        <span className={`pk-chip`} style={{ '--c': getTipoInfo(rk.t2).cor } as React.CSSProperties}>
                          {getTipoInfo(rk.t2).nome}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '8px', color: '#8BE39D', fontWeight: 800 }}>{rk.resistencias}</td>
                    <td style={{ padding: '8px', color: '#9BE7A6', fontWeight: 800 }}>{rk.imunidades}</td>
                    <td style={{ padding: '8px', color: '#FF7B7B', fontWeight: 800 }}>{rk.fraquezas}</td>
                    <td style={{ padding: '8px', color: '#FFCB05', fontWeight: 900 }}>+{rk.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ABA 4: CALCULADORA DE CONFRONTO */}
      {aba === 'calc' && (
        <div style={{ position: 'absolute', inset: '80px 24px 20px 24px', display: 'flex', justifyContent: 'center' }}>
          <div className="vidro" style={{ width: '600px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ color: '#FFCB05', fontSize: '18px', letterSpacing: '.1em' }}>CALCULADORA DE EFICÁCIA</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#8A93A3', marginBottom: '6px', fontWeight: 800 }}>
                  TIPO ATACANTE
                </label>
                <select
                  className="filter-select"
                  style={{ width: '100%', height: '36px' }}
                  value={calcAtk}
                  onChange={(e) => setCalcAtk(e.target.value)}
                >
                  {SLUGS.map((s) => (
                    <option key={s} value={s}>
                      {getTipoInfo(s).nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#8A93A3', marginBottom: '6px', fontWeight: 800 }}>
                  TIPO DEFENSOR 1
                </label>
                <select
                  className="filter-select"
                  style={{ width: '100%', height: '36px' }}
                  value={calcDef1}
                  onChange={(e) => setCalcDef1(e.target.value)}
                >
                  {SLUGS.map((s) => (
                    <option key={s} value={s}>
                      {getTipoInfo(s).nome}
                    </option>
                  ))}
                </select>

                <label style={{ display: 'block', fontSize: '11px', color: '#8A93A3', marginTop: '12px', marginBottom: '6px', fontWeight: 800 }}>
                  TIPO DEFENSOR 2 (OPCIONAL)
                </label>
                <select
                  className="filter-select"
                  style={{ width: '100%', height: '36px' }}
                  value={calcDef2}
                  onChange={(e) => setCalcDef2(e.target.value)}
                >
                  <option value="none">Nenhum (Tipo Puro)</option>
                  {SLUGS.map((s) => (
                    <option key={s} value={s}>
                      {getTipoInfo(s).nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Resultado do Cálculo */}
            {(() => {
              const defs = calcDef2 !== 'none' ? [calcDef1, calcDef2] : [calcDef1];
              const mult = getEfTotal(calcAtk, defs);
              return (
                <div
                  style={{
                    marginTop: '20px',
                    padding: '16px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,.05)',
                    textAlign: 'center',
                  }}
                >
                  <span style={{ fontSize: '12px', color: '#8A93A3' }}>MULTIPLICADOR DE DANO RESULTANTE</span>
                  <div
                    style={{
                      fontSize: '48px',
                      fontWeight: 900,
                      color: mult > 1 ? '#22C55E' : mult === 0 ? '#94A3B8' : mult < 1 ? '#EF4444' : '#fff',
                      margin: '8px 0',
                    }}
                  >
                    {mult === 0.5 ? '½×' : mult === 0.25 ? '¼×' : `${mult}×`}
                  </div>
                  <div style={{ fontSize: '13px', color: '#C9CFDA' }}>
                    {mult > 1 ? 'Super Efetivo!' : mult === 0 ? 'Sem Efeito (Imune)!' : mult < 1 ? 'Não é muito efetivo...' : 'Dano Regular'}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
