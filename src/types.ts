export type WaveformType = 'sawtooth' | 'square' | 'sine' | 'triangle';

export type TabId = 'tab-landing' | 'tab-conveyor' | 'tab-portfolio' | 'tab-sandbox' | 'tab-proposal' | 'tab-budget' | 'tab-financials' | 'tab-architecture' | 'tab-hiring';

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

export interface SynthPreset {
  id: string;
  name: string;
  category: 'Lead' | 'Bass' | 'Pad' | 'Keys' | 'FX' | 'Custom';
  description?: string;
  params: SynthParameters;
  isFactory?: boolean;
  createdAt: number;
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
  sound: 'kick' | 'snare' | 'hihat' | 'clap' | 'bass' | 'lead';
  steps: number[]; // 32 elements (0 or 1)
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
