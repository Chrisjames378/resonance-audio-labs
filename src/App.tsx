import React, { useEffect, useState } from 'react';
import { EngineModel, SynthParameters, TabId, ToastState } from './types';
import { audioEngine } from './lib/audioEngine';
import { Header } from './components/Header';
import { NavigationTabs } from './components/NavigationTabs';
import { SynthSandboxTab } from './components/SynthSandboxTab';
import { LandingTab } from './components/LandingTab';
import { ProposalTab } from './components/ProposalTab';
import { BudgetTab } from './components/BudgetTab';
import { FinancialsTab } from './components/FinancialsTab';
import { ArchitectureTab } from './components/ArchitectureTab';
import { AddEngineModal } from './components/AddEngineModal';
import { Toast } from './components/Toast';

const INITIAL_ENGINES: EngineModel[] = [
  {
    id: 'polyblep',
    name: 'BLEP-Dual Subtractive Synth',
    type: 'synth',
    wave1: 'sawtooth',
    wave2: 'square',
    cutoff: 2500,
    resonance: 1.5,
    attack: 0.01,
    release: 0.5,
    desc: 'Dual-oscillator PolyBLEP anti-aliased subtractive synthesis model.',
  },
  {
    id: 'fm_synth',
    name: 'DX-Matrix FM Digital Synth',
    type: 'synth',
    wave1: 'sine',
    wave2: 'sine',
    cutoff: 5500,
    resonance: 3.2,
    attack: 0.05,
    release: 1.2,
    desc: '2-Operator frequency modulation digital synth engine for crystal keys and brass.',
  },
  {
    id: 'cyber_lead',
    name: 'CyberPulse Wavetable Lead',
    type: 'synth',
    wave1: 'sawtooth',
    wave2: 'triangle',
    cutoff: 4200,
    resonance: 5.0,
    attack: 0.005,
    release: 0.4,
    desc: 'High-resonance aggressive wavetable lead synth built for fast arpeggios.',
  },
  {
    id: 'daw_step_seq',
    name: 'Resonance Studio 16-Step DAW',
    type: 'daw',
    bpm: 120,
    desc: 'Real-time multi-track Web Audio API 16-step drum & bass sequencer workstation.',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('tab-landing');
  const [engines, setEngines] = useState<EngineModel[]>(INITIAL_ENGINES);
  const [currentEngineId, setCurrentEngineId] = useState<string>('polyblep');
  const [isAddEngineModalOpen, setIsAddEngineModalOpen] = useState(false);
  const [audioStatus, setAudioStatus] = useState('Audio Engine: Standby');

  const [synthParams, setSynthParams] = useState<SynthParameters>({
    wave1: 'sawtooth',
    wave2: 'square',
    cutoff: 2500,
    resonance: 1.5,
    attack: 0.01,
    release: 0.5,
    volume: 0.75,
  });

  const [toast, setToast] = useState<ToastState>({
    message: '',
    type: 'info',
    visible: false,
  });

  useEffect(() => {
    audioEngine.onStatusChange((status) => {
      setAudioStatus(status);
    });
  }, []);

  const showToast = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3500);
  };

  const handleUpdateParams = (newParams: Partial<SynthParameters>) => {
    setSynthParams((prev) => ({ ...prev, ...newParams }));
  };

  const handleSelectEngine = (engineId: string) => {
    setCurrentEngineId(engineId);
    const engine = engines.find((e) => e.id === engineId);
    if (!engine) return;

    if (engine.type === 'synth') {
      setSynthParams((prev) => ({
        ...prev,
        wave1: engine.wave1 || 'sawtooth',
        wave2: engine.wave2 || 'square',
        cutoff: engine.cutoff || 2500,
        resonance: engine.resonance || 1.5,
        attack: engine.attack || 0.01,
        release: engine.release || 0.5,
      }));
      showToast(`Loaded ${engine.name}`, 'info');
    } else if (engine.type === 'daw') {
      showToast(`Activated ${engine.name} Workstation`, 'success');
    }
  };

  const handleAddEngine = (newEngine: EngineModel) => {
    setEngines((prev) => [...prev, newEngine]);
    setCurrentEngineId(newEngine.id);
    if (newEngine.type === 'synth') {
      setSynthParams((prev) => ({
        ...prev,
        wave1: newEngine.wave1 || 'sawtooth',
        wave2: newEngine.wave2 || 'square',
        cutoff: newEngine.cutoff || 2500,
        resonance: newEngine.resonance || 1.5,
        attack: newEngine.attack || 0.01,
        release: newEngine.release || 0.5,
      }));
    }
    showToast(`Registered & loaded custom engine '${newEngine.name}'`, 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyActiveDoc = () => {
    const el = document.getElementById(activeTab);
    if (el) {
      navigator.clipboard.writeText(el.innerText);
      showToast('Document text copied to clipboard!', 'success');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Toast toast={toast} />

      {/* Top Header */}
      <Header
        audioStatus={audioStatus}
        onOpenAddEngineModal={() => setIsAddEngineModalOpen(true)}
        onPrint={handlePrint}
        onCopyActiveDoc={handleCopyActiveDoc}
      />

      {/* Navigation Tabs */}
      <NavigationTabs activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {activeTab === 'tab-landing' && <LandingTab onNavigate={setActiveTab} />}

        {activeTab === 'tab-sandbox' && (
          <SynthSandboxTab
            engines={engines}
            currentEngineId={currentEngineId}
            onSelectEngine={handleSelectEngine}
            onOpenAddEngineModal={() => setIsAddEngineModalOpen(true)}
            synthParams={synthParams}
            onUpdateParams={handleUpdateParams}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'tab-proposal' && <ProposalTab />}

        {activeTab === 'tab-budget' && <BudgetTab onShowToast={showToast} />}

        {activeTab === 'tab-financials' && <FinancialsTab />}

        {activeTab === 'tab-architecture' && <ArchitectureTab onShowToast={showToast} />}
      </main>

      {/* Add Custom Engine Modal */}
      <AddEngineModal
        isOpen={isAddEngineModalOpen}
        onClose={() => setIsAddEngineModalOpen(false)}
        onAddEngine={handleAddEngine}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/80 py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Resonance Audio Labs Ltd • <a href="mailto:resonanceaudiolabs@gmail.com" className="text-indigo-400 hover:underline">resonanceaudiolabs@gmail.com</a> • <code className="text-indigo-400 font-mono">uniagant.website</code> • Pukekohe, NZ</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="hover:text-white cursor-pointer" onClick={() => setActiveTab('tab-landing')}>
              Landing
            </span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer" onClick={() => setActiveTab('tab-proposal')}>
              Proposal
            </span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer" onClick={() => setActiveTab('tab-sandbox')}>
              Synth Sandbox
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
