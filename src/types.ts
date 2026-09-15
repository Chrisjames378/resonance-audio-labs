export type WaveformType = 'sawtooth' | 'square' | 'sine' | 'triangle';

export type TabId = 'tab-landing' | 'tab-sandbox' | 'tab-proposal' | 'tab-budget' | 'tab-financials' | 'tab-architecture';

export interface SynthParameters {
  wave1: WaveformType;
  wave2: WaveformType;
  cutoff: number;
  resonance: number;
  attack: number;
  release: number;
  volume: number;
}

export interface SynthPatch {
  patchName: string;
  osc1Wave: WaveformType;
  osc2Wave: WaveformType;
  cutoff: number;
  resonance: number;
  attack: number;
  release: number;
  description: string;
}

export interface EngineModel {
  id: string;
  name: string;
  type: 'synth' | 'daw';
  wave1?: WaveformType;
  wave2?: WaveformType;
  cutoff?: number;
  resonance?: number;
  attack?: number;
  release?: number;
  bpm?: number;
  desc: string;
}

export interface DAWTrack {
  id: string;
  name: string;
  sound: 'kick' | 'snare' | 'hihat' | 'bass';
  steps: number[]; // 16 elements (0 or 1)
}

export interface EquipmentItem {
  id: string;
  category: string;
  name: string;
  purpose: string;
  cost: number;
  enabled: boolean;
}

export interface ToastState {
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  visible: boolean;
}
