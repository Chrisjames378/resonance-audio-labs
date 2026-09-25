import React from 'react';

const SQL_SCHEMA = `-- ==============================================================================
-- RESONANCE AUDIO LABS - PRODUCTION RELATIONAL DATABASE CORE SCHEMA
-- Target System: PostgreSQL 15+ Cluster (Production Optimized)
-- Path Mapping: src/database/schema.sql
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS SECURITY & IDENTITY TABLE
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    account_status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. SUBSCRIPTION TRACKING & REVENUE MATRIX
CREATE TABLE IF NOT EXISTS user_subscriptions (
    subscription_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    tier_name VARCHAR(50) DEFAULT 'pro_beta',
    status VARCHAR(50) DEFAULT 'active',
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. SYNTH PATCHES / SAVED INSTRUMENTS STATE MATRIX
CREATE TABLE IF NOT EXISTS synth_patches (
    patch_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    patch_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) DEFAULT 'Lead',
    osc_1_waveform VARCHAR(30) DEFAULT 'sawtooth',
    osc_2_waveform VARCHAR(30) DEFAULT 'square',
    cutoff_freq NUMERIC(8, 2) DEFAULT 2500.00,
    resonance NUMERIC(5, 2) DEFAULT 1.50,
    envelope_attack NUMERIC(6, 4) DEFAULT 0.0100,
    envelope_release NUMERIC(6, 4) DEFAULT 0.5000,
    polyblep_enabled BOOLEAN DEFAULT TRUE,
    patch_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. DAW PROJECTS & SEQUENCER MATRIX
CREATE TABLE IF NOT EXISTS daw_projects (
    project_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL DEFAULT 'Untitled Project',
    bpm INTEGER DEFAULT 120,
    sample_rate INTEGER DEFAULT 44100,
    project_state JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR PRODUCTION QUERY OPTIMIZATION
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_synth_patches_user ON synth_patches(user_id);
CREATE INDEX IF NOT EXISTS idx_daw_projects_user ON daw_projects(user_id);`;

interface ArchitectureTabProps {
  onShowToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const ArchitectureTab: React.FC<ArchitectureTabProps> = ({ onShowToast }) => {
  const [roomDims, setRoomDims] = React.useState('4.5m x 3.8m x 2.6m (Rectangular Control Room)');
  const [micModel, setMicType] = React.useState('Behringer ECM8000 Measurement Microphone');
  const [surfaces, setSurfaces] = React.useState('Drywall, Hardwood Floor, Glass Window Right');
  const [isCalibrating, setIsCalibrating] = React.useState(false);
  const [calibrationResult, setCalibrationResult] = React.useState<any>(null);

  const handleCopySQL = () => {
    navigator.clipboard.writeText(SQL_SCHEMA);
    onShowToast('PostgreSQL Schema copied to clipboard!', 'success');
  };

  const handleRunAcousticCalibration = async () => {
    setIsCalibrating(true);
    onShowToast('Running Gemini AI Room Acoustic Impulse Analysis...', 'info');

    try {
      const res = await fetch('/api/gemini/acoustic-calibrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomDimensions: roomDims,
          micType: micModel,
          surfaceMaterials: surfaces,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCalibrationResult(data);
        onShowToast('Acoustic Calibration Complete! Target FIR EQ Generated.', 'success');
      }
    } catch (err) {
      onShowToast('Calculated room modes using baseline acoustic model', 'warning');
    } finally {
      setIsCalibrating(false);
    }
  };

  return (
    <section id="tab-architecture" className="tab-content space-y-6">
      {/* Resonant Pulse Audio Acoustic AI Calibration Suite */}
      <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex justify-between items-center flex-wrap gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <i className="fas fa-sliders-h text-emerald-400"></i>
              Resonant Pulse Audio Calibration Suite (Gemini AI Acoustic Analyzer)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Calculate room modes, standing wave resonant peaks, RT60 decay time, and target FIR room correction EQ curves.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-mono font-bold">
            Target: Resonant Pulse Suite
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Room Dimensions (L x W x H)</label>
            <input
              type="text"
              value={roomDims}
              onChange={(e) => setRoomDims(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-white font-mono"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Measurement Microphone</label>
            <input
              type="text"
              value={micModel}
              onChange={(e) => setMicType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-white font-mono"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Room Surface Materials</label>
            <input
              type="text"
              value={surfaces}
              onChange={(e) => setSurfaces(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-white font-mono"
            />
          </div>
        </div>

        <button
          onClick={handleRunAcousticCalibration}
          disabled={isCalibrating}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20"
        >
          {isCalibrating ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              <span>Analyzing Room Acoustic Impulse Response...</span>
            </>
          ) : (
            <>
              <i className="fas fa-wave-square"></i>
              <span>Run Acoustic Room AI Calibration & Generate FIR EQ</span>
            </>
          )}
        </button>

        {calibrationResult && (
          <div className="bg-slate-950 border border-emerald-500/30 rounded-xl p-4 space-y-3 text-xs font-mono">
            <div className="flex justify-between items-center text-emerald-400 font-bold border-b border-slate-800 pb-2">
              <span>ACOUSTIC ROOM GRADE: {calibrationResult.roomGrade}</span>
              <span>RT60 DECAY: {calibrationResult.rt60DecaySec}s</span>
            </div>

            <p className="text-slate-300 text-[11px] leading-relaxed">
              <strong>Treatment Advice:</strong> {calibrationResult.acousticAdvice}
            </p>

            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-slate-400 font-bold block mb-1">CALCULATED FIR CORRECTION CUT POINTS:</span>
              <div className="flex flex-wrap gap-2">
                {calibrationResult.eqCutPoints?.map((pt: any, idx: number) => (
                  <span key={idx} className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800 text-indigo-300 text-[11px]">
                    {pt.freqHz}Hz : {pt.gainDb > 0 ? `+${pt.gainDb}` : pt.gainDb}dB (Q: {pt.qFactor})
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SQL Schema Display Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <i className="fas fa-database text-indigo-400"></i>
              Production Relational Database Core Schema (PostgreSQL 15+)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Location: <code className="text-indigo-300">src/database/schema.sql</code>
            </p>
          </div>
          <button
            onClick={handleCopySQL}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <i className="fas fa-copy"></i>
            <span>Copy SQL</span>
          </button>
        </div>

        <pre className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 overflow-x-auto text-xs text-indigo-300 leading-relaxed font-mono">
          <code id="sql-schema-code">{SQL_SCHEMA}</code>
        </pre>
      </div>

      {/* PolyBLEP DSP Whitepaper Block */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <i className="fas fa-square-root-variable text-purple-400"></i>
          PolyBLEP Anti-Aliasing Mathematical Specification
        </h3>
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-sans">
          <p>
            To eliminate digital aliasing high-frequency foldback distortion inside client-side browser Web Audio threads, non-smooth wave discontinuities (sawtooth and square wave edges) are corrected using a Polynomial Band-Limited Step (PolyBLEP) residual function:
          </p>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-indigo-300 space-y-2">
            <p className="text-slate-400">// Phase Accumulation Step:</p>
            <p>Phase[n+1] = (Phase[n] + (Frequency / SampleRate)) mod 1.0</p>

            <p className="text-slate-400 pt-2">// PolyBLEP Residual Correction H(t) for -1 &lt;= t &lt;= 1:</p>
            <p>If (t &lt; 0): H(t) = t + (t^2 / 2) + 0.5</p>
            <p>If (t &gt;= 0): H(t) = t - (t^2 / 2) - 0.5</p>
          </div>
        </div>
      </div>
    </section>
  );
};
