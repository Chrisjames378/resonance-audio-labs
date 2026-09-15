import React from 'react';

interface HeaderProps {
  audioStatus: string;
  onOpenAddEngineModal: () => void;
  onPrint: () => void;
  onCopyActiveDoc: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  audioStatus,
  onOpenAddEngineModal,
  onPrint,
  onCopyActiveDoc,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-emerald-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">
              🧬
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Resonance Audio Labs
                <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  PWA Platform v1.0.1
                </span>
              </h1>
              <p className="text-xs text-slate-400 font-mono">
                <a href="mailto:resonanceaudiolabs@gmail.com" className="hover:text-indigo-300 transition-colors">resonanceaudiolabs@gmail.com</a> • <a href="https://quindecim-mente.ai.studio" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">quindecim-mente.ai.studio</a> • Pukekohe, NZ
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/50 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span id="audio-engine-status">{audioStatus}</span>
            </div>

            <button
              onClick={onOpenAddEngineModal}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 text-xs font-medium flex items-center gap-2 transition-colors"
            >
              <i className="fas fa-plus-circle"></i>
              <span>Add Built Engine</span>
            </button>

            <button
              onClick={onPrint}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-2 transition-colors"
            >
              <i className="fas fa-print"></i>
              <span>Print Proposal</span>
            </button>

            <button
              onClick={onCopyActiveDoc}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
            >
              <i className="fas fa-copy"></i>
              <span>Copy Active Doc</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
