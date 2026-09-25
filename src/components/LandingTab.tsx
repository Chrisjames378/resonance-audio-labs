import React from 'react';
import { TabId } from '../types';

interface LandingTabProps {
  onNavigate: (tab: TabId) => void;
}

export const LandingTab: React.FC<LandingTabProps> = ({ onNavigate }) => {
  return (
    <section id="tab-landing" className="tab-content space-y-10">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/20 rounded-3xl p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>RESONANCE AUDIO LABS • PLATFORM V1.0.1</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Next-Generation Web Audio Synthesis & AI Sound Engineering
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-sans">
            High-performance browser-native synthesizers, 32-step DAW workstations, and intelligent sound design matrices powered by server-side Gemini AI. Built in Pukekohe, New Zealand for global creators.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('tab-sandbox')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <i className="fas fa-sliders-h text-base" />
              <span>Launch Synth & DAW Sandbox</span>
            </button>

            <button
              onClick={() => onNavigate('tab-proposal')}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors"
            >
              <i className="fas fa-file-contract text-base text-indigo-400" />
              <span>View Business Proposal</span>
            </button>

            <a
              href="mailto:resonanceaudiolabs@gmail.com"
              className="px-5 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-indigo-300 border border-indigo-500/30 font-mono text-xs flex items-center gap-2 transition-colors"
            >
              <i className="fas fa-envelope text-emerald-400" />
              <span>resonanceaudiolabs@gmail.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* Key Feature Pillars (4 Grid Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 shadow-xl hover:border-indigo-500/30 transition-all">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-xl font-bold">
            <i className="fas fa-wave-square" />
          </div>
          <h3 className="text-base font-bold text-white">PolyBLEP Audio Engine</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Client-side zero-latency Web Audio API subtractive & FM synthesis with band-limited anti-aliasing residual functions.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 shadow-xl hover:border-indigo-500/30 transition-all">
          <div className="w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-400 flex items-center justify-center text-xl font-bold">
            <i className="fas fa-robot" />
          </div>
          <h3 className="text-base font-bold text-white">Gemini AI Patch Design</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Server-side AI sound patch generator using <code className="text-indigo-300">gemini-3.8-flash</code> to convert natural language into DSP parameters.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 shadow-xl hover:border-indigo-500/30 transition-all">
          <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl font-bold">
            <i className="fas fa-sliders" />
          </div>
          <h3 className="text-base font-bold text-white">32-Step DAW Sequencer</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Multi-track 32-step sequencer with kick, snare, hi-hat, analog clap, and synth bass pattern arrangement at configurable tempos.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 shadow-xl hover:border-indigo-500/30 transition-all">
          <div className="w-12 h-12 rounded-xl bg-amber-600/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-xl font-bold">
            <i className="fas fa-chart-line" />
          </div>
          <h3 className="text-base font-bold text-white">Commercial Scalability</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Low cloud overhead (~$65 NZD/mo), PostgreSQL 15+ database architecture, and global B2C subscription growth trajectory.
          </p>
        </div>
      </div>

      {/* Platform Specification & Contact Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Specifications Box */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <i className="fas fa-microchip text-indigo-400" />
            Core Technical Platform Metrics
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] uppercase">Audio Sample Rate</span>
              <div className="text-base font-bold text-emerald-400">44.1 kHz / 48 kHz</div>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] uppercase">Buffer Latency</span>
              <div className="text-base font-bold text-indigo-400">&lt; 5 ms</div>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] uppercase">Fixed Overhead</span>
              <div className="text-base font-bold text-purple-400">~$65 NZD / mo</div>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] uppercase">AI Model</span>
              <div className="text-base font-bold text-indigo-300">gemini-3.8-flash</div>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] uppercase">Database Engine</span>
              <div className="text-base font-bold text-amber-400">PostgreSQL 15+</div>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] uppercase">Cloud Run Microservice</span>
              <a
                href="https://agentic-sound-labs-886212716638.us-west1.run.app"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-emerald-400 hover:text-white truncate block transition-colors"
              >
                agentic-sound-labs.run.app
              </a>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 space-y-1">
              <span className="text-emerald-400 text-[10px] uppercase font-semibold">Sonorus Melodious v12.3</span>
              <a
                href="https://sonorus-melodious-v12-3.ai.studio"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-emerald-300 hover:text-white truncate block transition-colors flex items-center gap-1"
              >
                <span>sonorus-melodious-v12-3</span>
                <i className="fas fa-external-link-alt text-[9px]"></i>
              </a>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] uppercase">AI Studio Host</span>
              <a
                href="https://quindecim-mente.ai.studio"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-indigo-300 hover:text-white truncate block transition-colors"
              >
                quindecim-mente.ai.studio
              </a>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] uppercase">Target Domain</span>
              <div className="text-xs font-bold text-emerald-400 truncate">uniagant.website</div>
            </div>
          </div>
        </div>

        {/* Corporate & Operations Contact Box */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <i className="fas fa-building text-emerald-400" />
              Corporate Identity & Contact
            </h3>

            <div className="space-y-2 text-xs font-sans text-slate-300">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5 font-mono">
                <p className="text-indigo-400 font-bold">Resonance Audio Labs Ltd.</p>
                <p className="text-slate-400">Principal Founder: Christopher James McKay</p>
                <p className="text-slate-400">Location: Pukekohe 2676, Auckland, New Zealand</p>
                <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
                  <i className="fas fa-envelope text-emerald-400" />
                  <a
                    href="mailto:resonanceaudiolabs@gmail.com"
                    className="text-white hover:text-indigo-300 underline font-semibold transition-colors"
                  >
                    resonanceaudiolabs@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('tab-budget')}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors mt-4"
          >
            <i className="fas fa-calculator" />
            <span>Explore WINZ Capital Grant Allocations ($4.3k NZD Cap)</span>
          </button>
        </div>
      </div>
    </section>
  );
};
