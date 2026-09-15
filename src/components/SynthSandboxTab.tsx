import React, { useEffect, useRef, useState } from 'react';
import { EngineModel, SynthParameters, WaveformType } from '../types';
import { audioEngine, KEY_BINDINGS, NOTE_FREQUENCIES } from '../lib/audioEngine';
import { DAWSequencer } from '../lib/dawEngine';

interface SynthSandboxTabProps {
  engines: EngineModel[];
  currentEngineId: string;
  onSelectEngine: (id: string) => void;
  onOpenAddEngineModal: () => void;
  synthParams: SynthParameters;
  onUpdateParams: (newParams: Partial<SynthParameters>) => void;
  onShowToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const SynthSandboxTab: React.FC<SynthSandboxTabProps> = ({
  engines,
  currentEngineId,
  onSelectEngine,
  onOpenAddEngineModal,
  synthParams,
  onUpdateParams,
  onShowToast,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dawCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeNotes, setActiveNotes] = useState<string[]>([]);
  const [patchPrompt, setPatchPrompt] = useState('');
  const [patchName, setPatchName] = useState('Default PolyBLEP');
  const [patchDesc, setPatchDesc] = useState(
    'Standard dual oscillator sawtooth/square template with standard lowpass filter response.'
  );
  const [isGenerating, setIsGenerating] = useState(false);

  // DAW Sequencer state
  const [dawSeq] = useState(() => new DAWSequencer(undefined, () => synthParams));
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [bpm, setBpm] = useState(120);
  const [tracks, setTracks] = useState(() => dawSeq.getTracks());

  useEffect(() => {
    // Synchronize DAW state listener
    const seq = new DAWSequencer(
      (step, playing) => {
        setCurrentStep(step);
        setIsPlaying(playing);
      },
      () => synthParams
    );
    seq.setBPM(bpm);
    seq.setTracks(tracks);
    return () => {
      seq.stop();
    };
  }, []);

  useEffect(() => {
    audioEngine.updateParameters(synthParams);
  }, [synthParams]);

  useEffect(() => {
    if (canvasRef.current) {
      audioEngine.attachOscilloscope(canvasRef.current, { strokeColor: '#6366f1', fillColor: '#020617', lineWidth: 2 });
    }
    if (dawCanvasRef.current) {
      audioEngine.attachOscilloscope(dawCanvasRef.current, { strokeColor: '#10b981', fillColor: '#090d16', lineWidth: 1.5 });
    }
    return () => {
      if (canvasRef.current) audioEngine.detachOscilloscope(canvasRef.current);
      if (dawCanvasRef.current) audioEngine.detachOscilloscope(dawCanvasRef.current);
    };
  }, [canvasRef.current, dawCanvasRef.current]);

  // Keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const key = e.key.toLowerCase();
      const note = KEY_BINDINGS[key];
      if (note) {
        audioEngine.noteOn(note, synthParams, setActiveNotes);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const key = e.key.toLowerCase();
      const note = KEY_BINDINGS[key];
      if (note) {
        audioEngine.noteOff(note, synthParams.release, setActiveNotes);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [synthParams]);

  const handleToggleStep = (trackIdx: number, stepIdx: number) => {
    const updated = [...tracks];
    updated[trackIdx].steps[stepIdx] = updated[trackIdx].steps[stepIdx] ? 0 : 1;
    setTracks(updated);
    dawSeq.setTracks(updated);
  };

  const handleTogglePlay = () => {
    audioEngine.ensureAudioContext();
    if (isPlaying) {
      dawSeq.stop();
      setIsPlaying(false);
    } else {
      dawSeq.setTracks(tracks);
      dawSeq.setBPM(bpm);
      dawSeq.start();
      setIsPlaying(true);
    }
  };

  const handleBpmChange = (newBpm: number) => {
    const val = Math.max(60, Math.min(240, newBpm));
    setBpm(val);
    dawSeq.setBPM(val);
  };

  const handleActivateAudio = () => {
    audioEngine.ensureAudioContext();
    onShowToast('Web Audio API Engine Initialized Successfully', 'success');
  };

  // Gemini AI Sound Patch Generator API call
  const generateAIPatch = async () => {
    if (!patchPrompt.trim()) {
      onShowToast('Please enter a sound description prompt first', 'warning');
      return;
    }

    setIsGenerating(true);

    try {
      const res = await fetch('/api/gemini/patch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: patchPrompt.trim() }),
      });

      const data = await res.json();

      if (data.success && data.patch) {
        const p = data.patch;
        onUpdateParams({
          wave1: (p.osc1Wave as WaveformType) || 'sawtooth',
          wave2: (p.osc2Wave as WaveformType) || 'square',
          cutoff: Math.max(100, Math.min(10000, Number(p.cutoff) || 2500)),
          resonance: Math.max(0.1, Math.min(15, Number(p.resonance) || 1.5)),
          attack: Math.max(0.001, Math.min(2, Number(p.attack) || 0.01)),
          release: Math.max(0.05, Math.min(4, Number(p.release) || 0.5)),
        });

        setPatchName(p.patchName || 'Custom AI Sound');
        setPatchDesc(p.description || patchPrompt);

        onShowToast(`Patch '${p.patchName}' generated & loaded!`, 'success');

        // Play demo chord preview
        audioEngine.ensureAudioContext();
        const demoParams: SynthParameters = {
          wave1: (p.osc1Wave as WaveformType) || 'sawtooth',
          wave2: (p.osc2Wave as WaveformType) || 'square',
          cutoff: Number(p.cutoff) || 2500,
          resonance: Number(p.resonance) || 1.5,
          attack: Number(p.attack) || 0.01,
          release: Number(p.release) || 0.5,
          volume: synthParams.volume,
        };

        setTimeout(() => audioEngine.noteOn('C4', demoParams, setActiveNotes), 100);
        setTimeout(() => audioEngine.noteOn('E4', demoParams, setActiveNotes), 250);
        setTimeout(() => audioEngine.noteOn('G4', demoParams, setActiveNotes), 400);
        setTimeout(() => {
          audioEngine.noteOff('C4', demoParams.release, setActiveNotes);
          audioEngine.noteOff('E4', demoParams.release, setActiveNotes);
          audioEngine.noteOff('G4', demoParams.release, setActiveNotes);
        }, 1200);
      } else if (data.fallbackNeeded) {
        throw new Error(data.error || 'Fallback requested');
      } else {
        throw new Error(data.error || 'Failed to generate patch');
      }
    } catch (err: any) {
      console.warn('Gemini Patch Generator Fallback triggered:', err);
      onShowToast('Gemini API offline mode. Applying preset synth patch.', 'info');

      // Offline preset logic
      onUpdateParams({
        wave1: 'sawtooth',
        wave2: 'square',
        cutoff: 3800,
        resonance: 4.2,
        attack: 0.02,
        release: 0.8,
      });

      setPatchName('Cyberpunk Bass (Offline Mode)');
      setPatchDesc('Punchy dual-oscillator analog synth bass with filter resonance curve.');
    } finally {
      setIsGenerating(false);
    }
  };

  const notesList = [
    { name: 'C4', isBlack: false, key: 'A' },
    { name: 'C#4', isBlack: true, key: 'W' },
    { name: 'D4', isBlack: false, key: 'S' },
    { name: 'D#4', isBlack: true, key: 'E' },
    { name: 'E4', isBlack: false, key: 'D' },
    { name: 'F4', isBlack: false, key: 'F' },
    { name: 'F#4', isBlack: true, key: 'T' },
    { name: 'G4', isBlack: false, key: 'G' },
    { name: 'G#4', isBlack: true, key: 'Y' },
    { name: 'A4', isBlack: false, key: 'H' },
    { name: 'A#4', isBlack: true, key: 'U' },
    { name: 'B4', isBlack: false, key: 'J' },
    { name: 'C5', isBlack: false, key: 'K' },
  ];

  return (
    <section id="tab-sandbox" className="tab-content space-y-6">
      {/* Header banner with Built Engines Selector */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-indigo-500/5 blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <i className="fas fa-wave-square text-indigo-400"></i>
              Interactive Web Audio Engine & DAW Sandbox
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Test client-side zero-latency Web Audio API synthesis natively running inside the browser. Use your
              computer keyboard keys (<code className="bg-slate-800 px-1.5 py-0.5 rounded text-indigo-300">A, W, S, E, D, F, T, G, Y, H, U, J, K</code>) or click the keys below.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onOpenAddEngineModal}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5"
            >
              <i className="fas fa-code-branch"></i>
              <span>How to Add Custom Models</span>
            </button>
            <button
              onClick={handleActivateAudio}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2"
            >
              <i className="fas fa-power-off"></i>
              <span>Activate Audio Engine</span>
            </button>
          </div>
        </div>

        {/* Active Engine Selector Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-mono text-slate-400 shrink-0">
            <i className="fas fa-layer-group text-indigo-400 mr-1"></i> SELECT BUILT MODEL:
          </span>
          <div className="flex items-center gap-2">
            {engines.map((eng) => {
              const isActive = eng.id === currentEngineId;
              const activeClass = isActive
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700';
              const icon = eng.type === 'daw' ? 'fa-sliders' : 'fa-microchip';
              return (
                <button
                  key={eng.id}
                  onClick={() => {
                    onSelectEngine(eng.id);
                    if (eng.type === 'synth') {
                      setPatchName(eng.name);
                      setPatchDesc(eng.desc);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-all whitespace-nowrap ${activeClass}`}
                >
                  <i className={`fas ${icon}`}></i>
                  <span>{eng.name}</span>
                  {eng.type === 'daw' && (
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1 rounded ml-1 font-mono">
                      DAW
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Synth Interface Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel: Synthesis Controls (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          {/* Oscilloscope Screen */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                REALTIME ANALYSER OSCILLOSCOPE (FFT 2048)
              </span>
              <span className="text-xs font-mono text-slate-500">60 FPS Render Active</span>
            </div>
            <canvas ref={canvasRef} className="w-full h-32 bg-slate-950 rounded-lg border border-slate-800/80" />
          </div>

          {/* DAW Sequencer Workstation Panel */}
          <div className="bg-slate-950 border border-indigo-500/30 rounded-xl p-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
                <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                  16-Step Web DAW Sequencer Engine
                </h3>
                <a
                  href="https://agentic-sound-labs-886212716638.us-west1.run.app"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono hover:bg-emerald-500/20 transition-colors"
                >
                  <i className="fas fa-server text-[9px] text-emerald-400"></i>
                  <span>agentic-sound-labs.run.app</span>
                </a>
                <a
                  href="https://quindecim-mente.ai.studio"
                  target="_blank"
                  rel="noreferrer"
                  className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[10px] font-mono hover:bg-indigo-500/20 transition-colors"
                >
                  <i className="fas fa-external-link-alt text-[9px]"></i>
                  <span>quindecim-mente.ai.studio</span>
                </a>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="https://quindecim-mente.ai.studio"
                  target="_blank"
                  rel="noreferrer"
                  className="md:hidden inline-flex items-center gap-1 px-2 py-1 rounded bg-indigo-950 border border-indigo-500/30 text-indigo-300 text-[10px] font-mono"
                >
                  <i className="fas fa-external-link-alt text-[9px]"></i>
                  <span>AI Studio</span>
                </a>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-slate-400">BPM:</span>
                  <input
                    type="number"
                    value={bpm}
                    min="60"
                    max="200"
                    onChange={(e) => handleBpmChange(Number(e.target.value))}
                    className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-indigo-300 font-bold text-center"
                  />
                </div>
                <button
                  onClick={handleTogglePlay}
                  className={`px-3 py-1 rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 shadow-md ${
                    isPlaying
                      ? 'bg-rose-600 hover:bg-rose-500 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  <i className={`fas ${isPlaying ? 'fa-stop' : 'fa-play'}`}></i>
                  <span>{isPlaying ? 'STOP SEQ' : 'START SEQ'}</span>
                </button>
              </div>
            </div>

            {/* DAW Master Bus Realtime Mini-Oscilloscope */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[11px] font-mono">
                <i className="fas fa-wave-square text-emerald-400 animate-pulse"></i>
                <span className="text-slate-200 font-semibold">MASTER BUS VISUALIZER:</span>
                <span className="text-slate-400 text-[10px] hidden sm:inline">60 FPS Real-time Output FFT</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-emerald-400/80 uppercase hidden md:inline">Live Analyser</span>
                <canvas
                  ref={dawCanvasRef}
                  className="w-40 sm:w-56 h-8 bg-slate-950 rounded border border-emerald-500/30"
                />
              </div>
            </div>

            {/* Step Sequencer Grid */}
            <div className="space-y-2 overflow-x-auto">
              {tracks.map((track, tIdx) => (
                <div key={track.id} className="flex items-center gap-2">
                  <span className="w-28 text-xs font-mono font-semibold text-slate-300 truncate">
                    {track.name}
                  </span>
                  <div className="flex items-center gap-1 flex-1">
                    {track.steps.map((stepVal, sIdx) => {
                      const isActive = stepVal === 1;
                      const isCurrent = isPlaying && currentStep === sIdx;
                      return (
                        <button
                          key={sIdx}
                          onClick={() => handleToggleStep(tIdx, sIdx)}
                          className={`w-7 h-7 rounded border text-[10px] font-mono transition-all flex items-center justify-center ${
                            isActive
                              ? 'bg-indigo-600 border-indigo-400 text-white'
                              : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'
                          } ${isCurrent ? 'ring-2 ring-emerald-400' : ''}`}
                        >
                          {isActive ? '•' : ''}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Synth Parameter Knobs / Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Osc 1 Waveform */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3.5 space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Oscillator 1</span>
                <i className="fas fa-microchip text-indigo-400"></i>
              </label>
              <select
                value={synthParams.wave1}
                onChange={(e) => onUpdateParams({ wave1: e.target.value as WaveformType })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
              >
                <option value="sawtooth">Sawtooth (PolyBLEP)</option>
                <option value="square">Square / Pulse</option>
                <option value="sine">Pure Sine</option>
                <option value="triangle">Triangle Wave</option>
              </select>
            </div>

            {/* Osc 2 Waveform */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3.5 space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Oscillator 2</span>
                <i className="fas fa-layer-group text-purple-400"></i>
              </label>
              <select
                value={synthParams.wave2}
                onChange={(e) => onUpdateParams({ wave2: e.target.value as WaveformType })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
              >
                <option value="square">Square / Pulse</option>
                <option value="sawtooth">Sawtooth</option>
                <option value="sine">Sine Sub</option>
                <option value="triangle">Triangle</option>
              </select>
            </div>

            {/* Filter Cutoff */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3.5 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">Filter Cutoff</span>
                <span className="font-mono text-indigo-400">{synthParams.cutoff} Hz</span>
              </div>
              <input
                type="range"
                min="100"
                max="10000"
                step="50"
                value={synthParams.cutoff}
                onChange={(e) => onUpdateParams({ cutoff: Number(e.target.value) })}
                className="w-full accent-indigo-500 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Filter Resonance */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3.5 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">Resonance (Q)</span>
                <span className="font-mono text-purple-400">{synthParams.resonance.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="15"
                step="0.1"
                value={synthParams.resonance}
                onChange={(e) => onUpdateParams({ resonance: Number(e.target.value) })}
                className="w-full accent-purple-500 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Envelope Attack */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3.5 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">Attack</span>
                <span className="font-mono text-emerald-400">{synthParams.attack.toFixed(2)} s</span>
              </div>
              <input
                type="range"
                min="0.001"
                max="2.0"
                step="0.01"
                value={synthParams.attack}
                onChange={(e) => onUpdateParams({ attack: Number(e.target.value) })}
                className="w-full accent-emerald-500 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Envelope Release */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3.5 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">Release</span>
                <span className="font-mono text-amber-400">{synthParams.release.toFixed(2)} s</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="4.0"
                step="0.05"
                value={synthParams.release}
                onChange={(e) => onUpdateParams({ release: Number(e.target.value) })}
                className="w-full accent-amber-500 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Master Volume */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3.5 space-y-2 col-span-1 sm:col-span-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">Master Level Output</span>
                <span className="font-mono text-emerald-400">{Math.round(synthParams.volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={synthParams.volume}
                onChange={(e) => onUpdateParams({ volume: Number(e.target.value) })}
                className="w-full accent-emerald-500 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Piano Keybed Display */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>OCTAVE 4 PIANO KEYBED</span>
              <span>Click key or use computer keyboard</span>
            </div>

            <div className="relative flex justify-center h-36 bg-slate-950 p-3 rounded-xl border border-slate-800 select-none overflow-x-auto">
              {notesList.map((n) => {
                const isActive = activeNotes.includes(n.name);
                if (n.isBlack) {
                  return (
                    <div
                      key={n.name}
                      onMouseDown={() => audioEngine.noteOn(n.name, synthParams, setActiveNotes)}
                      onMouseUp={() => audioEngine.noteOff(n.name, synthParams.release, setActiveNotes)}
                      onMouseLeave={() => audioEngine.noteOff(n.name, synthParams.release, setActiveNotes)}
                      onTouchStart={(e) => {
                        e.preventDefault();
                        audioEngine.noteOn(n.name, synthParams, setActiveNotes);
                      }}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        audioEngine.noteOff(n.name, synthParams.release, setActiveNotes);
                      }}
                      className={`piano-key-black w-8 h-20 -mx-4 z-20 rounded-b-md flex flex-col justify-end items-center pb-2 text-[10px] font-mono cursor-pointer ${
                        isActive ? 'active' : ''
                      }`}
                    >
                      <span>{n.key}</span>
                    </div>
                  );
                }
                return (
                  <div
                    key={n.name}
                    onMouseDown={() => audioEngine.noteOn(n.name, synthParams, setActiveNotes)}
                    onMouseUp={() => audioEngine.noteOff(n.name, synthParams.release, setActiveNotes)}
                    onMouseLeave={() => audioEngine.noteOff(n.name, synthParams.release, setActiveNotes)}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      audioEngine.noteOn(n.name, synthParams, setActiveNotes);
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      audioEngine.noteOff(n.name, synthParams.release, setActiveNotes);
                    }}
                    className={`piano-key-white w-11 h-32 rounded-b-lg flex flex-col justify-end items-center pb-2 text-xs font-mono font-bold cursor-pointer ${
                      isActive ? 'active' : ''
                    }`}
                  >
                    <span className="text-slate-400 text-[10px] font-normal">{n.key}</span>
                    <span>{n.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Panel: AI Sound Patch Generator (Gemini API) (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <i className="fas fa-robot text-lg"></i>
              <h3>Gemini AI Synth Patch Generator</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Describe any synth sound in natural language. Server-side Gemini AI (<code className="text-indigo-300">gemini-3.8-flash</code>) will design matching DSP oscillator, filter, and envelope parameters in real time.
            </p>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-500 font-mono">QUICK PRESETS:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setPatchPrompt('Punchy 80s Cyberpunk Bassline')}
                  className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 border border-slate-700 transition-colors"
                >
                  Cyberpunk Bass
                </button>
                <button
                  onClick={() => setPatchPrompt('Lush Ethereal Ambient Synth Pad')}
                  className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 border border-slate-700 transition-colors"
                >
                  Ambient Pad
                </button>
                <button
                  onClick={() => setPatchPrompt('Screaming Acid Lead Synth with Resonance')}
                  className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 border border-slate-700 transition-colors"
                >
                  Acid Lead
                </button>
              </div>
            </div>

            {/* Prompt Input */}
            <div className="space-y-2">
              <textarea
                rows={3}
                value={patchPrompt}
                onChange={(e) => setPatchPrompt(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none font-mono"
                placeholder="e.g. 'Warm analog brass pad with slow attack and high filter resonance'"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={generateAIPatch}
              disabled={isGenerating}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Designing Sound Matrix...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-wand-magic-sparkles"></i>
                  <span>Generate & Apply Sound Patch</span>
                </>
              )}
            </button>
          </div>

          {/* AI Generated Output Preview Box */}
          <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3.5 space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>CURRENT PATCH:</span>
              <span className="text-indigo-400 font-bold">{patchName}</span>
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-3 leading-tight">{patchDesc}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
