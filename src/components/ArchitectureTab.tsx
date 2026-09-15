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
  const handleCopySQL = () => {
    navigator.clipboard.writeText(SQL_SCHEMA);
    onShowToast('PostgreSQL Schema copied to clipboard!', 'success');
  };

  return (
    <section id="tab-architecture" className="tab-content space-y-6">
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
