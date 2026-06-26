// Web Audio API procedural sound engine for Resonance Singular Portal

class ResonanceAudioEngine {
  private ctx: AudioContext | null = null;
  private humOsc1: OscillatorNode | null = null;
  private humOsc2: OscillatorNode | null = null;
  private humGain: GainNode | null = null;
  private humFilter: BiquadFilterNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private mainGain: GainNode | null = null;
  private isHumPlaying = false;
  public enabled = true;

  // Initialize Audio Context and permanent nodes
  public init() {
    if (this.ctx) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      
      this.ctx = new AudioContextClass();
      
      // Main output chain
      this.mainGain = this.ctx.createGain();
      this.mainGain.gain.setValueAtTime(0.3, this.ctx.currentTime); // Limit global volume
      this.mainGain.connect(this.ctx.destination);

      // Create procedural reverb impulse response
      this.reverbNode = this.ctx.createConvolver();
      this.reverbNode.buffer = this.createReverbBuffer(2.5, 2.0); // 2.5s decay
      this.reverbNode.connect(this.mainGain);
    } catch (e) {
      console.warn("Failed to initialize Web Audio API:", e);
    }
  }

  // Procedural noise buffer for algorithmic reverb
  private createReverbBuffer(duration: number, decay: number): AudioBuffer {
    if (!this.ctx) throw new Error("Context not ready");
    const sampleRate = this.ctx.sampleRate;
    const length = sampleRate * duration;
    const impulse = this.ctx.createBuffer(2, length, sampleRate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const percent = i / length;
      // Exponentially decaying white noise
      const val = (Math.random() * 2 - 1) * Math.pow(1 - percent, decay);
      left[i] = val;
      right[i] = val;
    }
    return impulse;
  }

  // Start low frequency ambient hum with slow beat frequency
  public startAmbientHum() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx || this.isHumPlaying) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;

    // Filter to keep hum sub-bass and warm
    this.humFilter = this.ctx.createBiquadFilter();
    this.humFilter.type = 'lowpass';
    this.humFilter.frequency.setValueAtTime(450, now);
    this.humFilter.connect(this.mainGain!);

    // Gain for hum
    this.humGain = this.ctx.createGain();
    this.humGain.gain.setValueAtTime(0, now);
    // Smooth ramp up
    this.humGain.gain.linearRampToValueAtTime(0.015, now + 2.0);
    this.humGain.connect(this.humFilter);

    // Binaural beat: 55Hz (A1) and 55.3Hz (A1 + 0.3Hz beat)
    this.humOsc1 = this.ctx.createOscillator();
    this.humOsc1.type = 'sawtooth'; // Sawtooth for rich harmonics to filter
    this.humOsc1.frequency.setValueAtTime(55, now);
    this.humOsc1.connect(this.humGain);

    this.humOsc2 = this.ctx.createOscillator();
    this.humOsc2.type = 'sine';
    this.humOsc2.frequency.setValueAtTime(55.3, now);
    this.humOsc2.connect(this.humGain);

    this.humOsc1.start();
    this.humOsc2.start();
    this.isHumPlaying = true;
  }

  // Dynamically update the hum frequency / filter based on page intensity
  public setHumIntensity(intensity: 'neutral' | 'high-resistance' | 'reflective' | 'low-intensity') {
    if (!this.ctx || !this.humFilter || !this.humGain) return;
    const now = this.ctx.currentTime;

    switch (intensity) {
      case 'high-resistance':
        // Pitch shift up and raise filter to create mild structural tension
        this.humOsc1?.frequency.exponentialRampToValueAtTime(65, now + 1.5);
        this.humFilter.frequency.exponentialRampToValueAtTime(700, now + 1.5);
        this.humGain.gain.linearRampToValueAtTime(0.02, now + 1.0);
        break;
      case 'reflective':
        // Lower pitch and drop filter for a deep meditative state
        this.humOsc1?.frequency.exponentialRampToValueAtTime(48.99, now + 2.0); // G1
        this.humFilter.frequency.exponentialRampToValueAtTime(250, now + 2.0);
        this.humGain.gain.linearRampToValueAtTime(0.012, now + 1.5);
        break;
      case 'low-intensity':
        this.humOsc1?.frequency.exponentialRampToValueAtTime(55, now + 1.0);
        this.humFilter.frequency.exponentialRampToValueAtTime(300, now + 1.0);
        this.humGain.gain.linearRampToValueAtTime(0.008, now + 1.0);
        break;
      default:
        // Reset to default neutral hum
        this.humOsc1?.frequency.exponentialRampToValueAtTime(55, now + 1.5);
        this.humFilter.frequency.exponentialRampToValueAtTime(450, now + 1.5);
        this.humGain.gain.linearRampToValueAtTime(0.015, now + 1.5);
    }
  }

  // Play magical cascading C-E-G chord chime
  public playTransitionChime() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    // C5 (523.25), E5 (659.25), G5 (783.99)
    const notes = [523.25, 659.25, 783.99];

    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      // Routing through Reverb Convolver
      osc.connect(gain);
      gain.connect(this.reverbNode!);
      gain.connect(this.mainGain!); // Dry mix

      // Volume envelope
      gain.gain.setValueAtTime(0, now + idx * 0.12);
      gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.12 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 1.8);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 2.0);
    });
  }

  // Plays a deep, resonant C-E-G-B major 7th chord that decays over time
  // while sweeping down the ambient hum filter to 100Hz
  public playDecayExitSound(durationSeconds: number = 3.5) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // 1. Sweep down the filter of the background hum
    if (this.humFilter && this.humGain) {
      this.humFilter.frequency.exponentialRampToValueAtTime(100, now + durationSeconds - 0.5);
      this.humGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSeconds);
    }

    // 2. Play deep exit resonance chord (C3: 130.81, E3: 164.81, G3: 196.00, B3: 246.94)
    const exitNotes = [130.81, 164.81, 196.00, 246.94];
    exitNotes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      // Deep triangular wave for a warm, hollow wind chime/flute effect
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      osc.connect(gain);
      gain.connect(this.reverbNode!);
      gain.connect(this.mainGain!);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.08 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSeconds);

      osc.start(now + idx * 0.08);
      osc.stop(now + durationSeconds + 0.5);
    });
  }

  // Stop hum and clean up
  public stopAmbientHum() {
    if (!this.isHumPlaying) return;
    const now = this.ctx ? this.ctx.currentTime : 0;
    
    if (this.humGain && this.ctx) {
      this.humGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.0);
    }
    
    setTimeout(() => {
      try {
        this.humOsc1?.stop();
        this.humOsc2?.stop();
        this.humOsc1?.disconnect();
        this.humOsc2?.disconnect();
        this.humGain?.disconnect();
        this.humFilter?.disconnect();
      } catch (e) {}
      this.isHumPlaying = false;
    }, 1200);
  }
}

export const audioEngine = new ResonanceAudioEngine();
