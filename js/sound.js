/**
 * Web Audio API Sound Synthesizer
 * Provides realistic mechanical keyboard switch sounds (Blue, Brown/Thocky),
 * error thuds, and completion chimes with zero external audio assets.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.soundProfile = 'blue'; // 'blue', 'thocky', 'soft', 'off'
    this.volume = 0.6;
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  }

  resumeIfNeeded() {
    if (!this.ctx) this.initAudioContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setProfile(profile) {
    this.soundProfile = profile;
    this.enabled = profile !== 'off';
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  playKeySound(isSpace = false) {
    if (!this.enabled || !this.ctx || this.soundProfile === 'off') return;
    this.resumeIfNeeded();

    const t = this.ctx.currentTime;

    if (this.soundProfile === 'blue') {
      this.playClickySound(t, isSpace);
    } else if (this.soundProfile === 'thocky') {
      this.playThockySound(t, isSpace);
    } else if (this.soundProfile === 'soft') {
      this.playSoftSound(t, isSpace);
    }
  }

  playClickySound(t, isSpace) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    filter.type = 'highpass';
    filter.frequency.value = isSpace ? 800 : 1800;

    const baseFreq = isSpace ? 280 : 750 + Math.random() * 200;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.04);

    const clickVol = (isSpace ? 0.35 : 0.25) * this.volume;
    gain.gain.setValueAtTime(clickVol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.05);

    this.playNoiseTransient(t, 0.02, isSpace ? 1200 : 3500, 0.15 * this.volume);
  }

  playThockySound(t, isSpace) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.value = isSpace ? 350 : 650;

    const baseFreq = isSpace ? 120 : 180 + Math.random() * 30;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.06);

    const vol = (isSpace ? 0.45 : 0.35) * this.volume;
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.065);

    this.playNoiseTransient(t, 0.03, 800, 0.1 * this.volume);
  }

  playSoftSound(t, isSpace) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const baseFreq = isSpace ? 200 : 320 + Math.random() * 60;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.03);

    const vol = 0.15 * this.volume;
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.04);
  }

  playNoiseTransient(t, duration, cutoff, level) {
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = cutoff;
    filter.Q.value = 1.5;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(level, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
    noise.stop(t + duration);
  }

  playErrorSound() {
    if (!this.enabled || !this.ctx || this.soundProfile === 'off') return;
    this.resumeIfNeeded();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(90, t + 0.12);

    gain.gain.setValueAtTime(0.2 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.13);
  }

  playSuccessChime() {
    if (!this.enabled || !this.ctx || this.soundProfile === 'off') return;
    this.resumeIfNeeded();

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const t = this.ctx.currentTime + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.25 * this.volume, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.36);
    });
  }
}

window.soundEngine = new SoundEngine();
