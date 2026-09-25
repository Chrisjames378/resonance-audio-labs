import React, { useState, useRef } from 'react';
import { SynthParameters, SynthPreset } from '../types';
import { exportPresetsToFile, FACTORY_PRESETS } from '../lib/presetStorage';

interface PresetManagerProps {
  presets: SynthPreset[];
  currentPresetId: string | null;
  synthParams: SynthParameters;
  onSelectPreset: (preset: SynthPreset) => void;
  onSavePreset: (newPreset: SynthPreset) => void;
  onDeletePreset: (presetId: string) => void;
  onImportPresets: (imported: SynthPreset[]) => void;
  onResetFactoryPresets: () => void;
  onShowToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const PresetManager: React.FC<PresetManagerProps> = ({
  presets,
  currentPresetId,
  synthParams,
  onSelectPreset,
  onSavePreset,
  onDeletePreset,
  onImportPresets,
  onResetFactoryPresets,
  onShowToast,
}) => {
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [presetToDelete, setPresetToDelete] = useState<SynthPreset | null>(null);
  const [isBrowserOpen, setIsBrowserOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Save form fields
  const [newPresetName, setNewPresetName] = useState('');
  const [newCategory, setNewCategory] = useState<SynthPreset['category']>('Lead');
  const [newDescription, setNewDescription] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const activePreset = presets.find((p) => p.id === currentPresetId) || null;

  const filteredPresets = presets.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat =
      selectedCategory === 'All'
        ? true
        : selectedCategory === 'Custom'
        ? !p.isFactory
        : p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleOpenSaveModal = () => {
    setNewPresetName(activePreset ? `${activePreset.name} (Custom)` : 'New Synth Sound');
    setNewCategory(activePreset ? activePreset.category : 'Lead');
    setNewDescription(activePreset?.description || 'Custom crafted subtractive synthesis patch');
    setIsSaveModalOpen(true);
  };

  const handleConfirmSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPresetName.trim()) {
      onShowToast('Please provide a preset name', 'warning');
      return;
    }

    const newPreset: SynthPreset = {
      id: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: newPresetName.trim(),
      category: newCategory,
      description: newDescription.trim(),
      isFactory: false,
      createdAt: Date.now(),
      params: { ...synthParams },
    };

    onSavePreset(newPreset);
    setIsSaveModalOpen(false);
    onShowToast(`Preset "${newPreset.name}" saved!`, 'success');
  };

  const handleTriggerDelete = (preset: SynthPreset, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (preset.isFactory) {
      onShowToast('Factory presets cannot be deleted', 'warning');
      return;
    }
    setPresetToDelete(preset);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!presetToDelete) return;
    onDeletePreset(presetToDelete.id);
    setIsDeleteModalOpen(false);
    setPresetToDelete(null);
    onShowToast(`Preset "${presetToDelete.name}" deleted`, 'info');
  };

  // Step to Next/Previous preset
  const handleStepPreset = (direction: 'next' | 'prev') => {
    if (presets.length === 0) return;
    const currentIndex = presets.findIndex((p) => p.id === currentPresetId);
    let nextIndex = 0;
    if (currentIndex !== -1) {
      if (direction === 'next') {
        nextIndex = (currentIndex + 1) % presets.length;
      } else {
        nextIndex = (currentIndex - 1 + presets.length) % presets.length;
      }
    }
    onSelectPreset(presets[nextIndex]);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0) {
          onImportPresets(parsed);
          onShowToast(`Successfully imported ${parsed.length} presets`, 'success');
        } else {
          onShowToast('Invalid preset JSON file format', 'error');
        }
      } catch (err) {
        onShowToast('Error reading preset file', 'error');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const categories = ['All', 'Custom', 'Lead', 'Bass', 'Pad', 'Keys', 'FX'];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-3 shadow-md">
      {/* Top Bar: Active Preset Display & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
            <i className="fas fa-bookmark text-indigo-400"></i> PRESET:
          </span>

          {/* Quick cycle buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleStepPreset('prev')}
              className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center border border-slate-700 transition-colors"
              title="Previous Preset"
            >
              <i className="fas fa-chevron-left text-[10px]"></i>
            </button>
            <button
              onClick={() => handleStepPreset('next')}
              className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center border border-slate-700 transition-colors"
              title="Next Preset"
            >
              <i className="fas fa-chevron-right text-[10px]"></i>
            </button>
          </div>

          {/* Active Preset Pill / Selector Trigger */}
          <button
            onClick={() => setIsBrowserOpen(!isBrowserOpen)}
            className="px-3 py-1 rounded-lg bg-slate-950 border border-indigo-500/40 hover:border-indigo-400 text-slate-200 flex items-center gap-2 transition-all shadow-inner"
          >
            <span className="text-indigo-400 font-bold">
              {activePreset ? activePreset.name : 'Custom / Unsaved Parameters'}
            </span>
            {activePreset && (
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded font-sans uppercase font-bold ${
                  activePreset.isFactory
                    ? 'bg-slate-800 text-slate-400 border border-slate-700'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {activePreset.isFactory ? 'Factory' : 'Custom'}
              </span>
            )}
            <i className={`fas fa-chevron-down text-[10px] text-slate-400 transition-transform ${isBrowserOpen ? 'rotate-180' : ''}`}></i>
          </button>
        </div>

        {/* Action Buttons: Save, Delete, Browser, Utilities */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleOpenSaveModal}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20 text-xs"
            title="Save current synth parameters as a new named preset"
          >
            <i className="fas fa-plus"></i>
            <span>SAVE PRESET</span>
          </button>

          {activePreset && !activePreset.isFactory && (
            <button
              onClick={() => handleTriggerDelete(activePreset)}
              className="px-2.5 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 text-rose-300 font-bold flex items-center gap-1.5 transition-all text-xs"
              title="Delete current custom preset"
            >
              <i className="fas fa-trash-alt text-[10px]"></i>
              <span className="hidden sm:inline">DELETE</span>
            </button>
          )}

          <button
            onClick={() => setIsBrowserOpen(!isBrowserOpen)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-colors ${
              isBrowserOpen
                ? 'bg-slate-800 border-indigo-500 text-indigo-300'
                : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-300'
            }`}
          >
            <i className="fas fa-list-ul text-[10px]"></i>
            <span>BROWSER ({presets.length})</span>
          </button>
        </div>
      </div>

      {/* Preset Browser Accordion / Drawer */}
      {isBrowserOpen && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-3 mt-2 animate-fadeIn font-mono">
          {/* Search & Category Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            <div className="relative flex-1">
              <i className="fas fa-search absolute left-3 top-2.5 text-slate-500 text-xs"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search presets by name or description..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold transition-colors ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Presets Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
            {filteredPresets.length === 0 ? (
              <div className="col-span-full py-6 text-center text-xs text-slate-500">
                No presets found matching "{searchQuery}"
              </div>
            ) : (
              filteredPresets.map((preset) => {
                const isSelected = preset.id === currentPresetId;
                return (
                  <div
                    key={preset.id}
                    onClick={() => {
                      onSelectPreset(preset);
                      onShowToast(`Loaded preset "${preset.name}"`, 'info');
                    }}
                    className={`p-2.5 rounded-lg border cursor-pointer transition-all flex flex-col justify-between group text-left ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-600/20 ring-1 ring-indigo-500/50'
                        : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-1">
                        <span className={`text-xs font-bold truncate ${isSelected ? 'text-indigo-300' : 'text-slate-200'}`}>
                          {preset.name}
                        </span>
                        <span
                          className={`text-[8px] px-1 py-0.2 rounded font-sans uppercase font-bold shrink-0 ${
                            preset.isFactory
                              ? 'bg-slate-800 text-slate-400'
                              : 'bg-emerald-500/20 text-emerald-300'
                          }`}
                        >
                          {preset.category}
                        </span>
                      </div>
                      {preset.description && (
                        <p className="text-[10px] text-slate-400 font-sans line-clamp-2 leading-tight">
                          {preset.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[9px] text-slate-500">
                      <span>
                        {preset.params.wave1.slice(0, 3)} / {preset.params.wave2.slice(0, 3)} • {preset.params.cutoff}Hz
                      </span>

                      {!preset.isFactory && (
                        <button
                          onClick={(e) => handleTriggerDelete(preset, e)}
                          className="opacity-60 hover:opacity-100 hover:text-rose-400 p-1 text-[10px] transition-opacity"
                          title="Delete preset"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Preset Browser Footer: Import / Export / Reset Utilities */}
          <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400">
            <div className="flex items-center gap-2">
              <button
                onClick={() => exportPresetsToFile(presets)}
                className="hover:text-indigo-300 flex items-center gap-1 transition-colors"
                title="Export all presets as a JSON file"
              >
                <i className="fas fa-file-export"></i>
                <span>Export Presets JSON</span>
              </button>
              <span>•</span>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="hover:text-indigo-300 flex items-center gap-1 transition-colors"
                title="Import presets from JSON file"
              >
                <i className="fas fa-file-import"></i>
                <span>Import JSON</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </div>

            <button
              onClick={() => {
                if (window.confirm('Restore factory presets? Your custom presets will be preserved.')) {
                  onResetFactoryPresets();
                  onShowToast('Factory presets refreshed', 'success');
                }
              }}
              className="hover:text-amber-400 flex items-center gap-1 transition-colors"
            >
              <i className="fas fa-undo"></i>
              <span>Refresh Factory Bank</span>
            </button>
          </div>
        </div>
      )}

      {/* SAVE PRESET MODAL */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative font-sans text-xs">
            <button
              onClick={() => setIsSaveModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <i className="fas fa-times text-sm"></i>
            </button>

            <div className="flex items-center gap-2 text-white font-bold text-base">
              <i className="fas fa-bookmark text-indigo-400"></i>
              <h3>Save Custom Synth Preset</h3>
            </div>
            <p className="text-slate-400 text-xs">
              Save your current oscillator, filter cutoff, resonance, and envelope parameters as a reusable sound patch.
            </p>

            {/* Current Parameters Snapshot Summary */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[11px] grid grid-cols-2 gap-2 text-slate-300">
              <div>
                <span className="text-slate-500 uppercase text-[9px]">Oscillators:</span>
                <p className="text-indigo-300 font-bold">{synthParams.wave1} + {synthParams.wave2}</p>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[9px]">Filter Cutoff:</span>
                <p className="text-indigo-300 font-bold">{synthParams.cutoff} Hz</p>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[9px]">Resonance (Q):</span>
                <p className="text-purple-300 font-bold">{synthParams.resonance.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[9px]">Envelope (A/R):</span>
                <p className="text-emerald-300 font-bold">{synthParams.attack.toFixed(2)}s / {synthParams.release.toFixed(2)}s</p>
              </div>
            </div>

            <form onSubmit={handleConfirmSave} className="space-y-3 font-sans">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Preset Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  placeholder="e.g. Neon Cyber Lead"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as SynthPreset['category'])}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-sans"
                >
                  <option value="Lead">Lead</option>
                  <option value="Bass">Bass</option>
                  <option value="Pad">Pad</option>
                  <option value="Keys">Keys</option>
                  <option value="FX">FX</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe the sonic character or recommended musical context..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSaveModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/20"
                >
                  Save Preset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && presetToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn font-sans">
          <div className="bg-slate-900 border border-rose-500/30 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center text-xl mx-auto">
              <i className="fas fa-trash-alt"></i>
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white">Delete Custom Preset?</h3>
              <p className="text-xs text-slate-400">
                Are you sure you want to delete <span className="text-rose-400 font-bold">"{presetToDelete.name}"</span>? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setPresetToDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
