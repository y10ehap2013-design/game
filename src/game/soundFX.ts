/**
 * Procedural Web Audio API sound synthesis and dynamic match commentary.
 * Zero external audio files or 404 dependencies.
 */

class SoundFXEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private crowdNode: AudioBufferSourceNode | null = null;
  private crowdGain: GainNode | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.crowdGain && this.ctx) {
      this.crowdGain.gain.setValueAtTime(muted ? 0 : 0.08, this.ctx.currentTime);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Powerful kick impact sound with sub-bass punch
   */
  public playKick(power: number = 1.0) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140 + power * 40, t);
    osc.frequency.exponentialRampToValueAtTime(32, t + 0.12);

    gain.gain.setValueAtTime(0.35 * Math.min(1.2, power), t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.15);
  }

  /**
   * FC 27 HyperMotion Power Shot rocket impact sound
   */
  public playPowerShot() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(28, t + 0.28);

    gain.gain.setValueAtTime(0.55, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.33);
  }

  /**
   * FC 27 Green Timed Finishing confirmation chime
   */
  public playGreenTimedFinish() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, t); // A5
    osc.frequency.setValueAtTime(1760, t + 0.08); // A6 bright harmonic

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.26);
  }

  /**
   * Ball striking post or crossbar (crisp metallic clack)
   */
  public playPostHit() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(420, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.25);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.26);
  }

  /**
   * Goal explosion with roaring crowd swell and whistle
   */
  public playGoalScore() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    this.playWhistle(true);

    // Roar burst
    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 1.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.9));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, t);
    filter.Q.setValueAtTime(1.2, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.5, t + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 1.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
    noise.stop(t + 1.5);
  }

  /**
   * Referee whistle
   */
  public playWhistle(isDouble: boolean = false) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const playBurst = (startAt: number, dur: number) => {
      if (!this.ctx) return;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.frequency.setValueAtTime(2850, startAt);
      osc2.frequency.setValueAtTime(3200, startAt);

      gain.gain.setValueAtTime(0.18, startAt);
      gain.gain.linearRampToValueAtTime(0.18, startAt + dur * 0.8);
      gain.gain.exponentialRampToValueAtTime(0.001, startAt + dur);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(startAt);
      osc2.start(startAt + dur);
      osc1.stop(startAt + dur);
      osc2.stop(startAt + dur);
    };

    playBurst(t, 0.25);
    if (isDouble) {
      playBurst(t + 0.32, 0.4);
    }
  }

  /**
   * Ambient crowd murmur loop
   */
  public startAmbientStadium() {
    if (this.crowdNode || this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      this.crowdNode = this.ctx.createBufferSource();
      this.crowdNode.buffer = buffer;
      this.crowdNode.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, this.ctx.currentTime);

      this.crowdGain = this.ctx.createGain();
      this.crowdGain.gain.setValueAtTime(0.06, this.ctx.currentTime);

      this.crowdNode.connect(filter);
      filter.connect(this.crowdGain);
      this.crowdGain.connect(this.ctx.destination);

      this.crowdNode.start();
    } catch {
      // Audio autoplay policy fallback
    }
  }

  /**
   * Dynamic live match speech commentary
   */
  public speakCommentary(phrase: string) {
    if (this.isMuted) return;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(phrase);
        utterance.rate = 1.05;
        utterance.pitch = 1.0;
        utterance.volume = 0.85;
        window.speechSynthesis.speak(utterance);
      } catch {
        // Speech synthesis disabled in some environments
      }
    }
  }

  /**
   * UEFA Champions League Anthem Fanfare Synthesizer
   * (Regal brass harmony & rising arpeggio)
   */
  public playUCLAnthemFanfare() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = [
      { f: 349.23, time: 0.0, dur: 0.25 },
      { f: 440.0, time: 0.2, dur: 0.25 },
      { f: 523.25, time: 0.4, dur: 0.25 },
      { f: 698.46, time: 0.6, dur: 0.7 },
      { f: 659.25, time: 1.25, dur: 0.25 },
      { f: 587.33, time: 1.48, dur: 0.25 },
      { f: 698.46, time: 1.72, dur: 1.1 },
    ];

    notes.forEach((n) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc2.type = 'triangle';

      osc.frequency.setValueAtTime(n.f, t + n.time);
      osc2.frequency.setValueAtTime(n.f * 1.003, t + n.time);

      gain.gain.setValueAtTime(0.001, t + n.time);
      gain.gain.linearRampToValueAtTime(0.18, t + n.time + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + n.time + n.dur);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + n.time);
      osc2.start(t + n.time);
      osc.stop(t + n.time + n.dur);
      osc2.stop(t + n.time + n.dur);
    });
  }

  /**
   * UEFA Europa League Official Anthem Fanfare Synthesizer
   * (Driving energetic brass & acoustic electric hybrid pulse)
   */
  public playUELAnthemFanfare() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = [
      { f: 261.63, time: 0.0, dur: 0.18 }, // C4
      { f: 311.13, time: 0.15, dur: 0.18 }, // Eb4
      { f: 349.23, time: 0.3, dur: 0.22 }, // F4
      { f: 392.0, time: 0.48, dur: 0.35 }, // G4
      { f: 466.16, time: 0.8, dur: 0.2 }, // Bb4
      { f: 523.25, time: 0.98, dur: 0.75 }, // C5
      { f: 466.16, time: 1.7, dur: 0.2 }, // Bb4
      { f: 523.25, time: 1.9, dur: 0.9 }, // C5 final triumphant hold
    ];

    notes.forEach((n) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const oscSub = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      oscSub.type = 'triangle';

      osc.frequency.setValueAtTime(n.f, t + n.time);
      oscSub.frequency.setValueAtTime(n.f * 0.5, t + n.time);

      gain.gain.setValueAtTime(0.001, t + n.time);
      gain.gain.linearRampToValueAtTime(0.2, t + n.time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + n.time + n.dur);

      osc.connect(gain);
      oscSub.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + n.time);
      oscSub.start(t + n.time);
      osc.stop(t + n.time + n.dur);
      oscSub.stop(t + n.time + n.dur);
    });
  }

  /**
   * TotalEnergies CAF Champions League Official Anthem Fanfare
   * (Triumphant African brass fanfare with syncopated harmonic vitality)
   */
  public playCAFAnthemFanfare() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = [
      { f: 349.23, time: 0.0, dur: 0.16 }, // F4
      { f: 415.3, time: 0.14, dur: 0.16 }, // Ab4
      { f: 466.16, time: 0.28, dur: 0.24 }, // Bb4
      { f: 523.25, time: 0.5, dur: 0.4 }, // C5
      { f: 466.16, time: 0.85, dur: 0.18 }, // Bb4
      { f: 523.25, time: 1.02, dur: 0.22 }, // C5
      { f: 622.25, time: 1.25, dur: 0.35 }, // Eb5
      { f: 698.46, time: 1.55, dur: 1.1 }, // F5 high triumphant finale
    ];

    notes.forEach((n) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc2.type = 'triangle';

      osc.frequency.setValueAtTime(n.f, t + n.time);
      osc2.frequency.setValueAtTime(n.f * 1.002, t + n.time);

      gain.gain.setValueAtTime(0.001, t + n.time);
      gain.gain.linearRampToValueAtTime(0.22, t + n.time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + n.time + n.dur);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + n.time);
      osc2.start(t + n.time);
      osc.stop(t + n.time + n.dur);
      osc2.stop(t + n.time + n.dur);
    });
  }

  /**
   * TotalEnergies CAF Confederation Cup Official Anthem Fanfare
   * (Dynamic African continental fanfare with rhythmic brass power)
   */
  public playCAFConfedFanfare() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = [
      { f: 293.66, time: 0.0, dur: 0.16 }, // D4
      { f: 369.99, time: 0.14, dur: 0.16 }, // F#4
      { f: 440.0, time: 0.28, dur: 0.22 }, // A4
      { f: 587.33, time: 0.48, dur: 0.38 }, // D5
      { f: 554.37, time: 0.82, dur: 0.18 }, // C#5
      { f: 587.33, time: 1.0, dur: 0.24 }, // D5
      { f: 659.25, time: 1.24, dur: 0.32 }, // E5
      { f: 739.99, time: 1.54, dur: 1.0 }, // F#5 grand finale
    ];

    notes.forEach((n) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc2.type = 'triangle';

      osc.frequency.setValueAtTime(n.f, t + n.time);
      osc2.frequency.setValueAtTime(n.f * 1.003, t + n.time);

      gain.gain.setValueAtTime(0.001, t + n.time);
      gain.gain.linearRampToValueAtTime(0.2, t + n.time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + n.time + n.dur);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + n.time);
      osc2.start(t + n.time);
      osc.stop(t + n.time + n.dur);
      osc2.stop(t + n.time + n.dur);
    });
  }
}

export const soundFX = new SoundFXEngine();
