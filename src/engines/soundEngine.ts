// Gerador de Áudio Web Audio API Procedural sem dependências externas nem arquivos pesados
// 100% legal, sintetizado em tempo real no navegador

class SoundEngine {
  private ctx: AudioContext | null = null;
  private habilitado: boolean = false;
  private volumeGeral: number = 0.5;

  constructor() {
    try {
      const salvo = localStorage.getItem('pk_audio_settings');
      if (salvo) {
        const { habilitado, volume } = JSON.parse(salvo);
        this.habilitado = !!habilitado;
        this.volumeGeral = volume !== undefined ? volume : 0.5;
      }
    } catch {
      // Ignora erro de parsing
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setHabilitado(h: boolean) {
    this.habilitado = h;
    if (h) this.initCtx();
    this.salvar();
  }

  public isHabilitado(): boolean {
    return this.habilitado;
  }

  public setVolume(v: number) {
    this.volumeGeral = Math.max(0, Math.min(1, v));
    this.salvar();
  }

  public getVolume(): number {
    return this.volumeGeral;
  }

  private salvar() {
    try {
      localStorage.setItem(
        'pk_audio_settings',
        JSON.stringify({ habilitado: this.habilitado, volume: this.volumeGeral })
      );
    } catch {
      // Storage cheio ou desativado
    }
  }

  // Efeito sonoro: Clique em Botão / Navegação
  public playClick() {
    if (!this.habilitado) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const t = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.06);

    gain.gain.setValueAtTime(this.volumeGeral * 0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.06);
  }

  // Efeito sonoro: Lançamento de Golpe / Ataque
  public playAtaque(tipoGolpe: string = 'normal') {
    if (!this.habilitado) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    if (tipoGolpe === 'fire' || tipoGolpe === 'dragon') {
      // Efeito de Chamas / Explosão
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.linearRampToValueAtTime(40, t + 0.35);

      gain.gain.setValueAtTime(this.volumeGeral * 0.28, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.35);
    } else if (tipoGolpe === 'electric') {
      // Efeito de Choque / Raio
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, t);
      osc.frequency.setValueAtTime(1200, t + 0.05);
      osc.frequency.setValueAtTime(300, t + 0.12);

      gain.gain.setValueAtTime(this.volumeGeral * 0.22, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.25);
    } else if (tipoGolpe === 'water' || tipoGolpe === 'ice') {
      // Efeito fluido / cristalino
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, t);
      osc.frequency.exponentialRampToValueAtTime(950, t + 0.22);

      gain.gain.setValueAtTime(this.volumeGeral * 0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.25);
    } else {
      // Ataque físico padrão
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, t);
      osc.frequency.exponentialRampToValueAtTime(60, t + 0.2);

      gain.gain.setValueAtTime(this.volumeGeral * 0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.2);
    }
  }

  // Efeito sonoro: Dano / Impacto
  public playImpacto(critico: boolean = false) {
    if (!this.habilitado) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = critico ? 'sawtooth' : 'square';
    osc.frequency.setValueAtTime(critico ? 160 : 120, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.28);

    gain.gain.setValueAtTime(this.volumeGeral * (critico ? 0.35 : 0.25), t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.28);
  }

  // Efeito sonoro: Pokébola lançada
  public playLancarBola() {
    if (!this.habilitado) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, t);
    osc.frequency.exponentialRampToValueAtTime(900, t + 0.18);

    gain.gain.setValueAtTime(this.volumeGeral * 0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.2);
  }

  // Efeito sonoro: Gotcha! Captura realizada com sucesso
  public playCapturaSucesso() {
    if (!this.habilitado) return;
    this.initCtx();
    if (!this.ctx) return;

    const notas = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notas.forEach((freq, idx) => {
      const t = this.ctx!.currentTime + idx * 0.12;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(this.volumeGeral * 0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t);
      osc.stop(t + 0.18);
    });
  }

  // Efeito sonoro: Vitória na Arena / Acerto no Quiz
  public playVitoria() {
    if (!this.habilitado) return;
    this.initCtx();
    if (!this.ctx) return;

    const notas = [440, 554.37, 659.25, 880];
    notas.forEach((freq, idx) => {
      const t = this.ctx!.currentTime + idx * 0.14;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(this.volumeGeral * 0.28, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + (idx === 3 ? 0.45 : 0.16));

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t);
      osc.stop(t + (idx === 3 ? 0.45 : 0.16));
    });
  }

  // Efeito sonoro: Erro no Quiz / Derrota
  public playErro() {
    if (!this.habilitado) return;
    this.initCtx();
    if (!this.ctx) return;

    const notas = [330, 311, 293, 277];
    notas.forEach((freq, idx) => {
      const t = this.ctx!.currentTime + idx * 0.1;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(this.volumeGeral * 0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t);
      osc.stop(t + 0.14);
    });
  }
}

export const soundEngine = new SoundEngine();
