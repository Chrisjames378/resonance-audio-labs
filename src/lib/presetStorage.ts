import { SynthPreset } from '../types';

export const FACTORY_PRESETS: SynthPreset[] = [
  {
    id: 'factory_brass_80s',
    name: 'PolyBLEP 80s Brass',
    category: 'Lead',
    description: 'Warm dual-sawtooth vintage analog brass with smooth filter opening.',
    isFactory: true,
    createdAt: 1700000000000,
    params: {
      wave1: 'sawtooth',
      wave2: 'sawtooth',
      cutoff: 2800,
      resonance: 1.8,
      attack: 0.08,
      release: 0.6,
      volume: 0.75,
    },
  },
  {
    id: 'factory_acid_303',
    name: 'Cyberpunk Acid 303',
    category: 'Bass',
    description: 'High resonance squelchy 303-style bassline with snappy punch.',
    isFactory: true,
    createdAt: 1700000001000,
    params: {
      wave1: 'sawtooth',
      wave2: 'square',
      cutoff: 1400,
      resonance: 7.5,
      attack: 0.01,
      release: 0.35,
      volume: 0.8,
    },
  },
  {
    id: 'factory_shimmer_glass',
    name: 'Ethereal Shimmer Glass',
    category: 'Pad',
    description: 'Lush atmospheric pad with soft attack and shimmering tail.',
    isFactory: true,
    createdAt: 1700000002000,
    params: {
      wave1: 'sine',
      wave2: 'triangle',
      cutoff: 5400,
      resonance: 2.2,
      attack: 0.5,
      release: 1.8,
      volume: 0.7,
    },
  },
  {
    id: 'factory_sub_808',
    name: 'Sub-Terran 808 Bass',
    category: 'Bass',
    description: 'Deep sinusoidal sub bass foundation for low-end club weight.',
    isFactory: true,
    createdAt: 1700000003000,
    params: {
      wave1: 'sine',
      wave2: 'square',
      cutoff: 950,
      resonance: 3.2,
      attack: 0.01,
      release: 0.9,
      volume: 0.85,
    },
  },
  {
    id: 'factory_dx_keys',
    name: 'DX Crystal FM Keys',
    category: 'Keys',
    description: 'Bright digital electric piano emulation with pure overtone presence.',
    isFactory: true,
    createdAt: 1700000004000,
    params: {
      wave1: 'sine',
      wave2: 'sine',
      cutoff: 6200,
      resonance: 3.5,
      attack: 0.04,
      release: 1.1,
      volume: 0.75,
    },
  },
  {
    id: 'factory_overdrive_lead',
    name: 'Overdrive Monolith Lead',
    category: 'Lead',
    description: 'Aggressive cutting sync lead for fast arpeggios and solos.',
    isFactory: true,
    createdAt: 1700000005000,
    params: {
      wave1: 'sawtooth',
      wave2: 'triangle',
      cutoff: 4200,
      resonance: 5.0,
      attack: 0.005,
      release: 0.45,
      volume: 0.8,
    },
  },
  {
    id: 'factory_chiptune_pulse',
    name: 'Vintage Chiptune Pulse',
    category: 'FX',
    description: '8-bit arcade style dual pulse wave with zero attack.',
    isFactory: true,
    createdAt: 1700000006000,
    params: {
      wave1: 'square',
      wave2: 'square',
      cutoff: 7200,
      resonance: 1.2,
      attack: 0.002,
      release: 0.2,
      volume: 0.7,
    },
  },
  {
    id: 'factory_nebular_drone',
    name: 'Dark Nebular Drone',
    category: 'Pad',
    description: 'Slow-evolving cinematic ambient drone with rich low-mid harmonic mass.',
    isFactory: true,
    createdAt: 1700000007000,
    params: {
      wave1: 'triangle',
      wave2: 'sawtooth',
      cutoff: 1900,
      resonance: 4.8,
      attack: 0.8,
      release: 2.5,
      volume: 0.75,
    },
  },
];

const STORAGE_KEY = 'resonance_synth_presets_v2';

export function loadSavedPresets(): SynthPreset[] {
  if (typeof window === 'undefined') return FACTORY_PRESETS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(FACTORY_PRESETS));
      return FACTORY_PRESETS;
    }
    const parsed: SynthPreset[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) return FACTORY_PRESETS;

    // Ensure factory presets exist
    const factoryIds = new Set(parsed.map((p) => p.id));
    const missingFactory = FACTORY_PRESETS.filter((fp) => !factoryIds.has(fp.id));
    const merged = [...parsed, ...missingFactory];
    return merged;
  } catch (err) {
    console.error('Failed to load presets from localStorage:', err);
    return FACTORY_PRESETS;
  }
}

export function savePresetsToStorage(presets: SynthPreset[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  } catch (err) {
    console.error('Failed to save presets to localStorage:', err);
  }
}

export function exportPresetsToFile(presets: SynthPreset[]): void {
  try {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(presets, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `resonance-synth-presets-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  } catch (err) {
    console.error('Failed to export presets JSON:', err);
  }
}
