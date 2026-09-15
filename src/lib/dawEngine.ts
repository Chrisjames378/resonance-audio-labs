import { DAWTrack, SynthParameters } from '../types';
import { audioEngine } from './audioEngine';

export const TOTAL_STEPS = 32;

export const DEFAULT_TRACKS: DAWTrack[] = [
  {
    id: 't1',
    name: 'Kick Drum',
    sound: 'kick',
    steps: [
      1, 0, 0, 0,  1, 0, 0, 0,  1, 0, 0, 0,  1, 0, 0, 0,
      1, 0, 0, 0,  1, 0, 0, 0,  1, 0, 0, 0,  1, 0, 0, 1
    ]
  },
  {
    id: 't2',
    name: 'Snare Drum',
    sound: 'snare',
    steps: [
      0, 0, 0, 0,  1, 0, 0, 0,  0, 0, 0, 0,  1, 0, 0, 0,
      0, 0, 0, 0,  1, 0, 0, 0,  0, 0, 0, 0,  1, 0, 1, 0
    ]
  },
  {
    id: 't3',
    name: 'Closed HiHat',
    sound: 'hihat',
    steps: [
      1, 0, 1, 0,  1, 0, 1, 0,  1, 0, 1, 0,  1, 0, 1, 0,
      1, 0, 1, 0,  1, 0, 1, 0,  1, 0, 1, 0,  1, 1, 1, 1
    ]
  },
  {
    id: 't4',
    name: 'Analog Clap',
    sound: 'clap',
    steps: [
      0, 0, 0, 0,  0, 0, 0, 0,  0, 0, 0, 0,  0, 0, 1, 0,
      0, 0, 0, 0,  0, 0, 0, 0,  0, 0, 0, 0,  0, 1, 0, 1
    ]
  },
  {
    id: 't5',
    name: 'PolyBLEP Bass C2',
    sound: 'bass',
    steps: [
      1, 0, 0, 1,  0, 0, 1, 0,  1, 0, 0, 1,  0, 1, 0, 0,
      1, 0, 0, 1,  0, 0, 1, 0,  1, 0, 1, 0,  0, 1, 1, 0
    ]
  },
];

export class DAWSequencer {
  private isPlaying = false;
  private currentStep = 0;
  private bpm = 124;
  private timerId: any = null;
  private tracks: DAWTrack[] = JSON.parse(JSON.stringify(DEFAULT_TRACKS));
  private onStepChange?: (step: number, isPlaying: boolean) => void;
  private synthParamsProvider?: () => SynthParameters;

  constructor(
    onStepChange?: (step: number, isPlaying: boolean) => void,
    synthParamsProvider?: () => SynthParameters
  ) {
    this.onStepChange = onStepChange;
    this.synthParamsProvider = synthParamsProvider;
  }

  public getTracks(): DAWTrack[] {
    return this.tracks;
  }

  public setTracks(newTracks: DAWTrack[]) {
    this.tracks = newTracks;
  }

  public toggleStep(trackIndex: number, stepIndex: number) {
    if (this.tracks[trackIndex] && stepIndex >= 0 && stepIndex < TOTAL_STEPS) {
      this.tracks[trackIndex].steps[stepIndex] = this.tracks[trackIndex].steps[stepIndex] ? 0 : 1;
    }
  }

  public clearAllSteps() {
    this.tracks.forEach(track => {
      track.steps = Array(TOTAL_STEPS).fill(0);
    });
  }

  public getBPM(): number {
    return this.bpm;
  }

  public setBPM(newBpm: number) {
    this.bpm = Math.max(60, Math.min(240, newBpm));
    if (this.isPlaying) {
      this.stop();
      this.start();
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public togglePlay() {
    audioEngine.ensureAudioContext();
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
  }

  public start() {
    this.isPlaying = true;
    this.currentStep = 0;
    const stepTimeMs = (60 / this.bpm / 4) * 1000;

    this.timerId = setInterval(() => {
      this.step();
    }, stepTimeMs);

    if (this.onStepChange) {
      this.onStepChange(this.currentStep, true);
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    if (this.onStepChange) {
      this.onStepChange(this.currentStep, false);
    }
  }

  private step() {
    this.tracks.forEach((track) => {
      if (track.steps[this.currentStep]) {
        this.playSound(track.sound, this.currentStep);
      }
    });

    if (this.onStepChange) {
      this.onStepChange(this.currentStep, true);
    }
    this.currentStep = (this.currentStep + 1) % TOTAL_STEPS;
  }

  private playSound(soundType: 'kick' | 'snare' | 'hihat' | 'clap' | 'bass' | 'lead', stepIndex: number) {
    const ctx = audioEngine.ensureAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const outputNode = audioEngine.filterNode || ctx.destination;

    if (soundType === 'kick') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.16);
      gain.gain.setValueAtTime(0.9, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);
      osc.connect(gain);
      gain.connect(outputNode);
      osc.start(now);
      osc.stop(now + 0.16);
    } else if (soundType === 'snare') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(230, now);
      gain.gain.setValueAtTime(0.55, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.13);
      osc.connect(gain);
      gain.connect(outputNode);
      osc.start(now);
      osc.stop(now + 0.13);
    } else if (soundType === 'hihat') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(9000, now);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
      osc.connect(gain);
      gain.connect(outputNode);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (soundType === 'clap') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1200, now);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);
      osc.connect(gain);
      gain.connect(outputNode);
      osc.start(now);
      osc.stop(now + 0.09);
    } else if (soundType === 'bass' || soundType === 'lead') {
      const defaultParams: SynthParameters = { wave1: 'sawtooth', wave2: 'square', cutoff: 2500, resonance: 1.5, attack: 0.01, release: 0.5, volume: 0.75 };
      const params = this.synthParamsProvider
        ? this.synthParamsProvider()
        : defaultParams;
      
      // Dynamic pitch transposition across 32 steps (C2, D#2, F2, G#2)
      const pitches = ['C2', 'C2', 'D#2', 'F2', 'G#2', 'A#2', 'C3'];
      const noteToPlay = pitches[stepIndex % pitches.length] || 'C2';

      audioEngine.noteOn(noteToPlay, params);
      setTimeout(() => audioEngine.noteOff(noteToPlay, params.release), 120);
    }
  }
}
