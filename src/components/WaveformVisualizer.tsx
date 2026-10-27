import React, { useEffect, useRef, useState, useCallback } from 'react';
import { audioEngine } from '../lib/audioEngine';
import { SynthParameters } from '../types';

export type VisualizerMode = 'oscilloscope' | 'spectrum' | 'lissajous' | 'polar';
export type VisualizerTheme = 'emerald' | 'cyan' | 'violet' | 'amber' | 'rose';

interface WaveformVisualizerProps {
  synthParams?: SynthParameters;
  activeNotes?: string[];
  className?: string;
}

const THEME_CONFIG: Record<
  VisualizerTheme,
  {
    name: string;
    stroke: string;
    glow: string;
    fill: string;
    accent: string;
    grid: string;
    bg: string;
    badge: string;
  }
> = {
  emerald: {
    name: 'Cyber Emerald',
    stroke: '#10b981',
    glow: 'rgba(16, 185, 129, 0.45)',
    fill: 'rgba(16, 185, 129, 0.12)',
    accent: 'text-emerald-400',
    grid: 'rgba(16, 185, 129, 0.12)',
    bg: '#04130d',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
  cyan: {
    name: 'Neon Cyan',
    stroke: '#06b6d4',
    glow: 'rgba(6, 182, 212, 0.5)',
    fill: 'rgba(6, 182, 212, 0.12)',
    accent: 'text-cyan-400',
    grid: 'rgba(6, 182, 212, 0.12)',
    bg: '#03141a',
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  },
  violet: {
    name: 'Laser Violet',
    stroke: '#8b5cf6',
    glow: 'rgba(139, 92, 246, 0.5)',
    fill: 'rgba(139, 92, 246, 0.12)',
    accent: 'text-purple-400',
    grid: 'rgba(139, 92, 246, 0.12)',
    bg: '#0e0b1c',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  },
  amber: {
    name: 'Solar Amber',
    stroke: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.5)',
    fill: 'rgba(245, 158, 11, 0.12)',
    accent: 'text-amber-400',
    grid: 'rgba(245, 158, 11, 0.12)',
    bg: '#181104',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
  rose: {
    name: 'Plasma Rose',
    stroke: '#f43f5e',
    glow: 'rgba(244, 63, 94, 0.5)',
    fill: 'rgba(244, 63, 94, 0.12)',
    accent: 'text-rose-400',
    grid: 'rgba(244, 63, 94, 0.12)',
    bg: '#19060b',
    badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  },
};

// Note names for pitch estimation
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function frequencyToNote(freq: number): { note: string; octave: number; cents: number } | null {
  if (freq < 20 || freq > 10000 || !isFinite(freq)) return null;
  const midi = 69 + 12 * Math.log2(freq / 440);
  const roundedMidi = Math.round(midi);
  const noteIndex = ((roundedMidi % 12) + 12) % 12;
  const octave = Math.floor(roundedMidi / 12) - 1;
  const cents = Math.round((midi - roundedMidi) * 100);
  return {
    note: `${NOTE_NAMES[noteIndex]}${octave}`,
    octave,
    cents,
  };
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  synthParams,
  activeNotes = [],
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // User controls
  const [mode, setMode] = useState<VisualizerMode>('oscilloscope');
  const [theme, setTheme] = useState<VisualizerTheme>('cyan');
  const [gain, setGain] = useState<number>(1.2);
  const [timebase, setTimebase] = useState<number>(1); // 1 = normal, 2 = 2x zoom in, 4 = 4x zoom in
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [isFrozen, setIsFrozen] = useState<boolean>(false);
  const [triggerSync, setTriggerSync] = useState<boolean>(true);

  // Live telemetry metrics
  const [telemetry, setTelemetry] = useState<{
    peakDb: number;
    rmsDb: number;
    fundamentalHz: number;
    noteName: string;
    sampleRate: number;
    isClipping: boolean;
  }>({
    peakDb: -96,
    rmsDb: -96,
    fundamentalHz: 0,
    noteName: '--',
    sampleRate: 48000,
    isClipping: false,
  });

  // Stored frozen frame for inspection
  const frozenBufferRef = useRef<Uint8Array | null>(null);
  const frozenFreqBufferRef = useRef<Uint8Array | null>(null);

  // Peak hold array for spectrum mode
  const peakHoldRef = useRef<number[]>(new Array(64).fill(0));

  // Render loop
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = audioEngine.getAnalyser();
    const currentTheme = THEME_CONFIG[theme];

    // High-DPI Canvas scaling
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = canvas.clientWidth || 600;
    const displayHeight = canvas.clientHeight || 220;

    if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
    }

    const w = canvas.width;
    const h = canvas.height;

    // Buffer preparation
    const bufferLength = analyser ? analyser.frequencyBinCount : 1024;
    let timeData = new Uint8Array(bufferLength);
    let freqData = new Uint8Array(bufferLength);

    if (analyser && !isFrozen) {
      analyser.getByteTimeDomainData(timeData);
      analyser.getByteFrequencyData(freqData);
      frozenBufferRef.current = new Uint8Array(timeData);
      frozenFreqBufferRef.current = new Uint8Array(freqData);
    } else if (frozenBufferRef.current && frozenFreqBufferRef.current) {
      timeData = frozenBufferRef.current;
      freqData = frozenFreqBufferRef.current;
    } else {
      // Default idle midpoint
      timeData.fill(128);
      freqData.fill(0);
    }

    // 1. Calculate Peak and RMS for telemetry
    let sumSquares = 0;
    let peakValue = 0;
    for (let i = 0; i < timeData.length; i++) {
      const normalized = (timeData[i] - 128) / 128.0;
      const absVal = Math.abs(normalized);
      if (absVal > peakValue) peakValue = absVal;
      sumSquares += normalized * normalized;
    }
    const rms = Math.sqrt(sumSquares / timeData.length);
    const peakDb = peakValue > 0.0001 ? Math.max(-96, Math.round(20 * Math.log10(peakValue))) : -96;
    const rmsDb = rms > 0.0001 ? Math.max(-96, Math.round(20 * Math.log10(rms))) : -96;
    const isClipping = peakValue >= 0.98;

    // 2. Estimate Fundamental Frequency (F0) using zero-crossing detection
    let fundamentalHz = 0;
    let noteName = '--';
    const audioCtx = audioEngine.getContext();
    const sampleRate = audioCtx ? audioCtx.sampleRate : 48000;

    if (peakValue > 0.04) {
      // Find zero crossings
      let crossings = 0;
      let firstCrossing = -1;
      let lastCrossing = -1;
      for (let i = 1; i < timeData.length; i++) {
        if (timeData[i - 1] <= 128 && timeData[i] > 128) {
          if (firstCrossing === -1) firstCrossing = i;
          lastCrossing = i;
          crossings++;
        }
      }
      if (crossings > 1 && lastCrossing > firstCrossing) {
        const periodSamples = (lastCrossing - firstCrossing) / (crossings - 1);
        fundamentalHz = Math.round(sampleRate / periodSamples);
        const noteInfo = frequencyToNote(fundamentalHz);
        if (noteInfo) {
          noteName = `${noteInfo.note} (${noteInfo.cents >= 0 ? '+' : ''}${noteInfo.cents}¢)`;
        }
      }
    }

    // Update telemetry throttle
    if (Math.random() < 0.25) {
      setTelemetry({
        peakDb,
        rmsDb,
        fundamentalHz,
        noteName,
        sampleRate,
        isClipping,
      });
    }

    // 3. Clear Background
    ctx.fillStyle = currentTheme.bg;
    ctx.fillRect(0, 0, w, h);

    // 4. Draw Oscilloscope Reticle / Graticule Grid
    if (showGrid) {
      ctx.strokeStyle = currentTheme.grid;
      ctx.lineWidth = 1 * dpr;

      // Vertical divisions (8 columns)
      const numCols = 8;
      for (let c = 1; c < numCols; c++) {
        const x = (w / numCols) * c;
        ctx.beginPath();
        ctx.setLineDash([2 * dpr, 4 * dpr]);
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // Horizontal divisions (voltage levels: +1.0, +0.5, 0, -0.5, -1.0)
      const numRows = 6;
      for (let r = 1; r < numRows; r++) {
        const y = (h / numRows) * r;
        ctx.beginPath();
        ctx.setLineDash(r === numRows / 2 ? [] : [2 * dpr, 4 * dpr]);
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Center reference zero-voltage line with subtle accent
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();

      // Axis labels
      ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
      ctx.font = `${Math.floor(9 * dpr)}px monospace`;
      ctx.fillText('+1.0V', 6 * dpr, 14 * dpr);
      ctx.fillText(' 0.0V', 6 * dpr, h / 2 - 4 * dpr);
      ctx.fillText('-1.0V', 6 * dpr, h - 8 * dpr);
    }

    // 5. Render Selected Mode
    if (mode === 'oscilloscope') {
      // Zero-crossing trigger lock to stabilize periodic synth waves
      let startIndex = 0;
      if (triggerSync && peakValue > 0.02) {
        for (let i = 0; i < timeData.length - 200; i++) {
          if (timeData[i] <= 128 && timeData[i + 1] > 128) {
            startIndex = i;
            break;
          }
        }
      }

      const availableLength = Math.max(64, Math.floor((timeData.length - startIndex) / timebase));
      const sliceWidth = w / (availableLength - 1);

      // Glow effect pass
      ctx.save();
      ctx.shadowColor = currentTheme.glow;
      ctx.shadowBlur = 12 * dpr;
      ctx.strokeStyle = currentTheme.stroke;
      ctx.lineWidth = 2.2 * dpr;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      for (let i = 0; i < availableLength; i++) {
        const dataIdx = startIndex + i;
        const raw = timeData[dataIdx] ?? 128;
        // Apply user gain and center on canvas
        const normalized = (raw - 128) / 128.0;
        const amplified = Math.max(-1.1, Math.min(1.1, normalized * gain));
        const y = h / 2 - amplified * (h * 0.42);
        const x = i * sliceWidth;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.restore();

      // Sharp core line pass
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1 * dpr;
      ctx.beginPath();
      for (let i = 0; i < availableLength; i++) {
        const dataIdx = startIndex + i;
        const raw = timeData[dataIdx] ?? 128;
        const normalized = (raw - 128) / 128.0;
        const amplified = Math.max(-1.1, Math.min(1.1, normalized * gain));
        const y = h / 2 - amplified * (h * 0.42);
        const x = i * sliceWidth;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Subtle underfill gradient
      ctx.save();
      const fillGrad = ctx.createLinearGradient(0, 0, 0, h);
      fillGrad.addColorStop(0, currentTheme.fill);
      fillGrad.addColorStop(0.5, 'rgba(0,0,0,0)');
      fillGrad.addColorStop(1, currentTheme.fill);
      ctx.fillStyle = fillGrad;
      ctx.lineTo(w, h / 2);
      ctx.lineTo(0, h / 2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    } else if (mode === 'spectrum') {
      // 64 logarithmic frequency bands
      const numBands = 64;
      const barWidth = (w - (numBands - 1) * 2 * dpr) / numBands;

      for (let b = 0; b < numBands; b++) {
        // Logarithmic frequency mapping
        const freqBin = Math.floor(Math.pow(b / numBands, 2) * (freqData.length * 0.75));
        const val = freqData[freqBin] || 0;
        const normalized = Math.min(1.0, (val / 255.0) * gain);
        const barHeight = normalized * (h * 0.85);
        const x = b * (barWidth + 2 * dpr);
        const y = h - barHeight;

        // Peak hold decay
        if (barHeight > (peakHoldRef.current[b] || 0)) {
          peakHoldRef.current[b] = barHeight;
        } else {
          peakHoldRef.current[b] = Math.max(0, (peakHoldRef.current[b] || 0) - 1.2 * dpr);
        }

        // Bar gradient
        const barGrad = ctx.createLinearGradient(0, h, 0, y);
        barGrad.addColorStop(0, currentTheme.stroke);
        barGrad.addColorStop(0.7, currentTheme.glow);
        barGrad.addColorStop(1, '#ffffff');

        ctx.fillStyle = barGrad;
        ctx.fillRect(x, y, barWidth, barHeight);

        // Peak cap
        const peakY = h - (peakHoldRef.current[b] || 0);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x, Math.max(4 * dpr, peakY - 2 * dpr), barWidth, 2 * dpr);
      }

      // Frequency range indicators
      ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
      ctx.font = `${Math.floor(8 * dpr)}px monospace`;
      ctx.fillText('20Hz (Sub)', 4 * dpr, h - 6 * dpr);
      ctx.fillText('250Hz (Bass)', w * 0.25, h - 6 * dpr);
      ctx.fillText('1kHz (Mids)', w * 0.5, h - 6 * dpr);
      ctx.fillText('4kHz (Pres)', w * 0.75, h - 6 * dpr);
      ctx.fillText('20kHz (Air)', w - 60 * dpr, h - 6 * dpr);
    } else if (mode === 'lissajous') {
      // X-Y Phase Scope
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) * 0.42;

      ctx.save();
      ctx.strokeStyle = currentTheme.stroke;
      ctx.lineWidth = 1.8 * dpr;
      ctx.shadowColor = currentTheme.glow;
      ctx.shadowBlur = 10 * dpr;

      ctx.beginPath();
      const step = 2;
      const shift = Math.floor(timeData.length / 4); // 90-degree phase quadrature
      for (let i = 0; i < timeData.length - shift; i += step) {
        const xNorm = ((timeData[i] - 128) / 128.0) * gain;
        const yNorm = ((timeData[i + shift] - 128) / 128.0) * gain;

        const px = cx + xNorm * radius;
        const py = cy - yNorm * radius;

        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.stroke();
      ctx.restore();

      // Center crosshair
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
    } else if (mode === 'polar') {
      // Circular 360-degree radar oscillogram
      const cx = w / 2;
      const cy = h / 2;
      const baseRadius = Math.min(w, h) * 0.28;

      ctx.save();
      ctx.strokeStyle = currentTheme.stroke;
      ctx.lineWidth = 2 * dpr;
      ctx.shadowColor = currentTheme.glow;
      ctx.shadowBlur = 10 * dpr;

      ctx.beginPath();
      const points = 360;
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const bufIdx = Math.floor((i / points) * (timeData.length - 1));
        const raw = (timeData[bufIdx] - 128) / 128.0;
        const r = baseRadius + raw * (baseRadius * 0.8) * gain;

        const px = cx + Math.cos(angle) * r;
        const py = cy + Math.sin(angle) * r;

        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      // Center ring
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 6. Clipping Warning Banner
    if (isClipping) {
      ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
      ctx.fillRect(w - 75 * dpr, 6 * dpr, 65 * dpr, 18 * dpr);
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.floor(9 * dpr)}px monospace`;
      ctx.fillText('CLIP 0dB', w - 70 * dpr, 19 * dpr);
    }
  }, [theme, mode, gain, timebase, showGrid, isFrozen, triggerSync]);

  useEffect(() => {
    let active = true;
    const loop = () => {
      if (!active) return;
      render();
      animFrameRef.current = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      active = false;
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [render]);

  const currentTheme = THEME_CONFIG[theme];

  return (
    <div className={`bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden ${className}`}>
      {/* Top Header & Telemetry Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <i className="fas fa-wave-square text-sm"></i>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                Real-Time Web Audio Waveform Analyser
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              </h3>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${currentTheme.badge}`}>
                {mode.toUpperCase()}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono flex items-center gap-2 flex-wrap mt-0.5">
              <span>Node: AnalyserNode (FFT 2048)</span>
              <span>•</span>
              <span className={currentTheme.accent}>Rate: {telemetry.sampleRate / 1000} kHz</span>
              <span>•</span>
              <span>Trigger: {triggerSync ? 'Zero-Crossing Locked' : 'Free-Run'}</span>
            </p>
          </div>
        </div>

        {/* Live Audio Telemetry Badges */}
        <div className="flex items-center gap-2 flex-wrap font-mono text-[11px]">
          {/* Pitch detector readout */}
          <div className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
            <span className="text-slate-500 uppercase text-[9px]">PITCH:</span>
            <span className={`font-bold ${telemetry.fundamentalHz > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
              {telemetry.fundamentalHz > 0 ? `${telemetry.fundamentalHz}Hz` : '--'}
            </span>
            <span className="text-slate-400 text-[10px]">
              {telemetry.noteName !== '--' ? `[${telemetry.noteName}]` : ''}
            </span>
          </div>

          {/* Peak dBFS readout */}
          <div className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
            <span className="text-slate-500 uppercase text-[9px]">PEAK:</span>
            <span className={`font-bold ${telemetry.isClipping ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
              {telemetry.peakDb} dB
            </span>
          </div>

          {/* RMS dBFS readout */}
          <div className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
            <span className="text-slate-500 uppercase text-[9px]">RMS:</span>
            <span className="text-indigo-400 font-bold">
              {telemetry.rmsDb} dB
            </span>
          </div>

          {/* Active voices badge */}
          {activeNotes.length > 0 && (
            <div className="bg-indigo-950/80 border border-indigo-500/40 px-2 py-1 rounded-lg text-indigo-300 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping"></span>
              <span>{activeNotes.join(', ')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Canvas Display with Glassmorphic CRT Graticule */}
      <div className="relative my-3 rounded-xl overflow-hidden border border-slate-800 bg-[#020617] shadow-inner">
        <canvas
          ref={canvasRef}
          className="w-full h-44 sm:h-52 block cursor-crosshair"
        />

        {/* Floating status overlays */}
        <div className="absolute top-2 left-2 pointer-events-none flex items-center gap-2 font-mono text-[10px] text-slate-400 bg-slate-950/80 px-2 py-1 rounded border border-slate-800/80 backdrop-blur-sm">
          <i className="fas fa-wave-square text-indigo-400"></i>
          <span>
            {synthParams ? `${synthParams.wave1.toUpperCase()} + ${synthParams.wave2.toUpperCase()} | FLT ${Math.round(synthParams.cutoff)}Hz (Q:${synthParams.resonance.toFixed(1)})` : 'MASTER BUS OUTPUT'}
          </span>
        </div>

        {isFrozen && (
          <div className="absolute top-2 right-2 bg-amber-500/90 text-slate-950 font-mono font-bold text-[10px] px-2.5 py-0.5 rounded shadow">
            BUFFER FROZEN
          </div>
        )}
      </div>

      {/* Control Bar: Modes, Scale, Gain, Color Themes, and Freeze */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2 text-xs font-mono">
        {/* Mode Selector */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-500 text-[10px] uppercase font-bold mr-1">MODE:</span>
          {(
            [
              { id: 'oscilloscope', label: 'Oscilloscope', icon: 'fa-wave-square' },
              { id: 'spectrum', label: 'FFT RTA', icon: 'fa-chart-bar' },
              { id: 'lissajous', label: 'X-Y Lissajous', icon: 'fa-circle-notch' },
              { id: 'polar', label: 'Polar Radar', icon: 'fa-compass' },
            ] as const
          ).map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                mode === m.id
                  ? `${currentTheme.badge} shadow-sm`
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <i className={`fas ${m.icon} text-[10px]`}></i>
              <span>{m.label}</span>
            </button>
          ))}
        </div>

        {/* Secondary controls: Sensitivity, Timebase, Theme, Freeze, Grid */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Zoom / Timebase */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <span className="text-[10px] text-slate-500 px-1.5 uppercase font-bold">ZOOM:</span>
            {[1, 2, 4].map((tb) => (
              <button
                key={tb}
                onClick={() => setTimebase(tb)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  timebase === tb ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tb}x
              </button>
            ))}
          </div>

          {/* Gain / Sensitivity */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <span className="text-[10px] text-slate-500 px-1.5 uppercase font-bold">GAIN:</span>
            {[
              { val: 0.8, lbl: '0.8x' },
              { val: 1.2, lbl: '1.2x' },
              { val: 2.0, lbl: '2.0x' },
            ].map((g) => (
              <button
                key={g.lbl}
                onClick={() => setGain(g.val)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  gain === g.val ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {g.lbl}
              </button>
            ))}
          </div>

          {/* Color Theme Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 gap-1">
            <span className="text-[10px] text-slate-500 px-1 uppercase font-bold">THEME:</span>
            {(['cyan', 'emerald', 'violet', 'amber', 'rose'] as VisualizerTheme[]).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                title={THEME_CONFIG[t].name}
                className={`w-4 h-4 rounded-full transition-transform ${
                  theme === t ? 'scale-125 ring-2 ring-white' : 'opacity-60 hover:opacity-100'
                }`}
                style={{ backgroundColor: THEME_CONFIG[t].stroke }}
              />
            ))}
          </div>

          {/* Trigger Sync Toggle */}
          <button
            onClick={() => setTriggerSync(!triggerSync)}
            title="Toggle zero-crossing oscilloscope trigger stabilization"
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
              triggerSync
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <i className="fas fa-crosshairs mr-1"></i>
            SYNC
          </button>

          {/* Grid Toggle */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            title="Toggle oscilloscope reticle graticule grid"
            className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
              showGrid
                ? 'bg-indigo-950/60 border-indigo-500/40 text-indigo-300'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <i className="fas fa-border-all"></i>
          </button>

          {/* Freeze Frame Button */}
          <button
            onClick={() => setIsFrozen(!isFrozen)}
            title="Freeze buffer to inspect current waveform cycle"
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border flex items-center gap-1 transition-colors ${
              isFrozen
                ? 'bg-amber-600 text-slate-950 border-amber-400'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <i className={`fas ${isFrozen ? 'fa-play' : 'fa-pause'}`}></i>
            <span>{isFrozen ? 'RESUME' : 'FREEZE'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
