import React, { useState } from 'react';
import { EngineModel, WaveformType } from '../types';

interface AddEngineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEngine: (engine: EngineModel) => void;
}

export const AddEngineModal: React.FC<AddEngineModalProps> = ({ isOpen, onClose, onAddEngine }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'synth' | 'daw'>('synth');
  const [wave1, setWave1] = useState<WaveformType>('sawtooth');
  const [wave2, setWave2] = useState<WaveformType>('square');
  const [cutoff, setCutoff] = useState(2500);
  const [resonance, setResonance] = useState(2.0);
  const [attack, setAttack] = useState(0.01);
  const [release, setRelease] = useState(0.5);
  const [bpm, setBpm] = useState(120);
  const [desc, setDesc] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const id = `custom_${Date.now()}`;
    const newEngine: EngineModel = {
      id,
      name: name.trim(),
      type,
      wave1,
      wave2,
      cutoff: Number(cutoff),
      resonance: Number(resonance),
      attack: Number(attack),
      release: Number(release),
      bpm: Number(bpm),
      desc: desc.trim() || (type === 'synth' ? 'Custom subtractive synthesis model.' : 'Custom 16-step DAW workstation.'),
    };

    onAddEngine(newEngine);
    setName('');
    setDesc('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <i className="fas fa-plus-circle text-indigo-400"></i>
              Add Custom Built Engine / Model
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Register new software audio models into the interactive sandbox array live or view code specs.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>

        {/* Live Creation Form */}
        <form onSubmit={handleSubmit} className="space-y-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <h4 className="text-xs font-bold font-mono text-indigo-300 uppercase tracking-wider">
            Quick Live Builder
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Model Name</label>
              <input
                type="text"
                required
                placeholder="e.g., Deep Sub Bass Engine"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Engine Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'synth' | 'daw')}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500 font-sans"
              >
                <option value="synth">Synthesizer Model</option>
                <option value="daw">DAW Sequencer Engine</option>
              </select>
            </div>
          </div>

          {type === 'synth' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Osc 1 Wave</label>
                <select
                  value={wave1}
                  onChange={(e) => setWave1(e.target.value as WaveformType)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white"
                >
                  <option value="sawtooth">Sawtooth</option>
                  <option value="square">Square</option>
                  <option value="sine">Sine</option>
                  <option value="triangle">Triangle</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Osc 2 Wave</label>
                <select
                  value={wave2}
                  onChange={(e) => setWave2(e.target.value as WaveformType)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white"
                >
                  <option value="square">Square</option>
                  <option value="sawtooth">Sawtooth</option>
                  <option value="sine">Sine</option>
                  <option value="triangle">Triangle</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Cutoff (Hz)</label>
                <input
                  type="number"
                  value={cutoff}
                  onChange={(e) => setCutoff(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Resonance Q</label>
                <input
                  type="number"
                  step="0.1"
                  value={resonance}
                  onChange={(e) => setResonance(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Attack (s)</label>
                <input
                  type="number"
                  step="0.01"
                  value={attack}
                  onChange={(e) => setAttack(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Release (s)</label>
                <input
                  type="number"
                  step="0.05"
                  value={release}
                  onChange={(e) => setRelease(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white"
                />
              </div>
            </div>
          )}

          {type === 'daw' && (
            <div>
              <label className="block text-slate-400 text-xs mb-1">Sequencer Tempo (BPM)</label>
              <input
                type="number"
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs"
              />
            </div>
          )}

          <div>
            <label className="block text-slate-400 text-xs mb-1">Short Description</label>
            <input
              type="text"
              placeholder="e.g. Deep sub-bass synthesizer with tight cutoff envelope"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <i className="fas fa-plus"></i>
            <span>Register Engine Model</span>
          </button>
        </form>

        {/* Instructions */}
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed border-t border-slate-800 pt-4">
          <span className="font-bold text-white block">Code Standard Integration Guide:</span>
          <p className="text-slate-400">
            Engine models are structured objects in <code className="text-indigo-300 font-mono">builtEngines</code> array:
          </p>
          <pre className="bg-slate-950 border border-slate-800 p-3 rounded-lg text-indigo-300 font-mono text-[11px] overflow-x-auto">
{`{
  id: 'my_custom_synth',
  name: 'My Analog Bass Synth',
  type: 'synth',
  wave1: 'sawtooth',
  wave2: 'sine',
  cutoff: 1800,
  resonance: 3.5,
  attack: 0.02,
  release: 0.6,
  desc: 'Deep warm sub-bass synthesizer with tight envelope.'
}`}
          </pre>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
