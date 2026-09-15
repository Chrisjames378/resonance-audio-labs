import { DAWTrack, SynthParameters } from '../types';
import { audioEngine } from './audioEngine';

export const DEFAULT_TRACKS: DAWTrack[] = [
  { id: 't1', name: 'Kick Drum', sound: 'kick', steps: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0] },
  { id: 't2', name: 'Snare Drum', sound: 'snare', steps: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0] },
  { id: 't3', name: 'Closed HiHat', sound: 'hihat', steps: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
  { id: 't4', name: 'Synth Bass C2', sound: 'bass', steps: [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0] },
];

export class DAWSequencer {
  private isPlaying = false;
  private currentStep = 0;
  private bpm = 120;
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
    if (this.tracks[trackIndex]) {
      this.tracks[trackIndex].steps[stepIndex] = this.tracks[trackIndex].steps[stepIndex] ? 0 : 1;
    }
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
        this.playSound(track.sound);
      }
    });

    if (this.onStepChange) {
      this.onStepChange(this.currentStep, true);
    }
    this.currentStep = (this.currentStep + 1) % 16;
  }

  private playSound(soundType: 'kick' | 'snare' | 'hihat' | 'bass') {
    const ctx = audioEngine.ensureAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const outputNode = audioEngine.filterNode || ctx.destination;

    if (soundType === 'kick') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.15);
      gain.gain.setValueAtTime(0.85, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.connect(gain);
      gain.connect(outputNode);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (soundType === 'snare') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.connect(gain);
      gain.connect(outputNode);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (soundType === 'hihat') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(8500, now);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.connect(gain);
      gain.connect(outputNode);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (soundType === 'bass') {
      const defaultParams: SynthParameters = { wave1: 'sawtooth', wave2: 'square', cutoff: 2500, resonance: 1.5, attack: 0.01, release: 0.5, volume: 0.75 };
      const params = this.synthParamsProvider
        ? this.synthParamsProvider()
        : defaultParams;
      audioEngine.noteOn('C4', params);
      setTimeout(() => audioEngine.noteOff('C4', params.release), 130);
    }
  }
}
