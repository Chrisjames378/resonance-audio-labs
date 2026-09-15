import { SynthParameters, WaveformType } from '../types';

export const NOTE_FREQUENCIES: Record<string, number> = {
  'C4': 261.63,
  'C#4': 277.18,
  'D4': 293.66,
  'D#4': 311.13,
  'E4': 329.63,
  'F4': 349.23,
  'F#4': 369.99,
  'G4': 392.00,
  'G#4': 415.30,
  'A4': 440.00,
  'A#4': 466.16,
  'B4': 493.88,
  'C5': 523.25,
};

export const KEY_BINDINGS: Record<string, string> = {
  'a': 'C4',
  'w': 'C#4',
  's': 'D4',
  'e': 'D#4',
  'd': 'E4',
  'f': 'F4',
  't': 'F#4',
  'g': 'G4',
  'y': 'G#4',
  'h': 'A4',
  'u': 'A#4',
  'j': 'B4',
  'k': 'C5',
};

class AudioEngine {
  private audioCtx: AudioContext | null = null;
  public filterNode: BiquadFilterNode | null = null;
  public masterGain: GainNode | null = null;
  public analyser: AnalyserNode | null = null;
  private activeOscillators: Record<string, { osc1: OscillatorNode; osc2: OscillatorNode; noteGain: GainNode }> = {};
  private animationFrameId: number | null = null;
  private statusListeners: Array<(status: string) => void> = [];

  public onStatusChange(listener: (status: string) => void) {
    this.statusListeners.push(listener);
  }

  private notifyStatus(status: string) {
    this.statusListeners.forEach((l) => l(status));
  }

  public getContext(): AudioContext | null {
    return this.audioCtx;
  }

  public ensureAudioContext(): AudioContext | null {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        console.error('Web Audio API is not supported in this browser');
        return null;
      }
      this.audioCtx = new AudioContextClass();

      // Master Gain
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.value = 0.75;

      // Biquad Filter
      this.filterNode = this.audioCtx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(2500, this.audioCtx.currentTime);
      this.filterNode.Q.setValueAtTime(1.5, this.audioCtx.currentTime);

      // Analyser
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 2048;

      // Routing: Osc -> Filter -> MasterGain -> Analyser -> Output
      this.filterNode.connect(this.masterGain);
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.audioCtx.destination);

      this.notifyStatus(`Audio Engine: Active (${this.audioCtx.sampleRate / 1000}kHz)`);
    } else if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
      this.notifyStatus('Audio Engine: Active');
    }
    return this.audioCtx;
  }

  public updateParameters(params: SynthParameters) {
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;

    if (this.filterNode) {
      this.filterNode.frequency.setTargetAtTime(params.cutoff, now, 0.01);
      this.filterNode.Q.setTargetAtTime(params.resonance, now, 0.01);
    }
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(params.volume, now, 0.01);
    }
  }

  public noteOn(noteName: string, params: SynthParameters, onActiveKeyChange?: (activeNotes: string[]) => void) {
    const ctx = this.ensureAudioContext();
    if (!ctx) return;
    if (this.activeOscillators[noteName]) return; // Prevent duplicate trigger

    const freq = NOTE_FREQUENCIES[noteName];
    if (!freq) return;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const noteGain = ctx.createGain();

    osc1.type = params.wave1;
    osc2.type = params.wave2;

    osc1.frequency.setValueAtTime(freq, ctx.currentTime);
    osc2.frequency.setValueAtTime(freq * 1.0015, ctx.currentTime); // Slight detune for analog warmth

    // Envelope Attack
    const now = ctx.currentTime;
    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.linearRampToValueAtTime(0.5, now + Math.max(0.001, params.attack));

    osc1.connect(noteGain);
    osc2.connect(noteGain);

    if (this.filterNode) {
      noteGain.connect(this.filterNode);
    } else {
      noteGain.connect(ctx.destination);
    }

    osc1.start(now);
    osc2.start(now);

    this.activeOscillators[noteName] = { osc1, osc2, noteGain };
    if (onActiveKeyChange) {
      onActiveKeyChange(Object.keys(this.activeOscillators));
    }
  }

  public noteOff(noteName: string, releaseTime: number, onActiveKeyChange?: (activeNotes: string[]) => void) {
    if (!this.activeOscillators[noteName] || !this.audioCtx) return;

    const { osc1, osc2, noteGain } = this.activeOscillators[noteName];
    const now = this.audioCtx.currentTime;
    const rel = Math.max(0.05, releaseTime);

    noteGain.gain.cancelScheduledValues(now);
    noteGain.gain.setValueAtTime(noteGain.gain.value, now);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + rel);

    setTimeout(() => {
      try {
        osc1.stop();
        osc2.stop();
        osc1.disconnect();
        osc2.disconnect();
        noteGain.disconnect();
      } catch (e) {
        // Ignored
      }
    }, rel * 1000 + 50);

    delete this.activeOscillators[noteName];
    if (onActiveKeyChange) {
      onActiveKeyChange(Object.keys(this.activeOscillators));
    }
  }

  private canvasTargets: Map<HTMLCanvasElement, { strokeColor: string; fillColor: string; lineWidth?: number }> = new Map();

  public attachOscilloscope(
    canvas: HTMLCanvasElement,
    options?: { strokeColor?: string; fillColor?: string; lineWidth?: number }
  ) {
    if (!canvas) return;
    this.canvasTargets.set(canvas, {
      strokeColor: options?.strokeColor || '#6366f1',
      fillColor: options?.fillColor || '#020617',
      lineWidth: options?.lineWidth || 2,
    });

    if (this.animationFrameId === null) {
      this.startRenderLoop();
    }
  }

  public detachOscilloscope(canvas: HTMLCanvasElement) {
    if (!canvas) return;
    this.canvasTargets.delete(canvas);
    if (this.canvasTargets.size === 0 && this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  public startOscilloscope(canvas: HTMLCanvasElement) {
    this.attachOscilloscope(canvas, { strokeColor: '#6366f1', fillColor: '#020617', lineWidth: 2 });
  }

  public stopOscilloscope() {
    this.canvasTargets.clear();
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private startRenderLoop() {
    const renderFrame = () => {
      this.animationFrameId = requestAnimationFrame(renderFrame);
      if (!this.analyser || this.canvasTargets.size === 0) return;

      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      this.analyser.getByteTimeDomainData(dataArray);

      const dpr = window.devicePixelRatio || 1;

      this.canvasTargets.forEach((opts, canvas) => {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        if (canvas.width !== (canvas.clientWidth || 300) * dpr) {
          canvas.width = (canvas.clientWidth || 300) * dpr;
          canvas.height = (canvas.clientHeight || 80) * dpr;
        }

        ctx.fillStyle = opts.fillColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.lineWidth = (opts.lineWidth || 2) * dpr;
        ctx.strokeStyle = opts.strokeColor;
        ctx.beginPath();

        const sliceWidth = (canvas.width * 1.0) / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * canvas.height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
      });
    };

    renderFrame();
  }
}

export const audioEngine = new AudioEngine();
