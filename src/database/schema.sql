-- ==============================================================================
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
CREATE INDEX IF NOT EXISTS idx_daw_projects_user ON daw_projects(user_id);
