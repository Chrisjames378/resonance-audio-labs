import React, { useEffect, useRef, useState, useCallback } from 'react';
import { audioEngine } from '../lib/audioEngine';
import { SynthParameters } from '../types';

export type VisualizerDisplayMode = 'dual' | 'frequency' | 'waveform' | 'radial';
export type VisualizerColorTheme = 'cyber' | 'quantum' | 'amber' | 'ocean';

interface AudioVisualizerProps {
  currentEngineId?: string;
  engineName?: string;
  synthParams?: SynthParameters;
  activeNotes?: string[];
  className?: string;
  analyserNode?: AnalyserNode | null;
}

const COLOR_THEMES: Record<
  VisualizerColorTheme,
  {
    name: string;
    primary: string;
    secondary: string;
    glow: string;
    background: string;
    grid: string;
    badge: string;
    barsGradient: [string, string, string];
  }
> = {
  cyber: {
    name: 'Cyberpunk Neon',
    primary: '#06b6d4', // cyan-500
    secondary: '#10b981', // emerald-500
    glow: 'rgba(6, 182, 212, 0.45)',
    background: '#04121a',
    grid: 'rgba(6, 182, 212, 0.12)',
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    barsGradient: ['#06b6d4', '#10b981', '#f59e0b'],
  },
  quantum: {
    name: 'Quantum Violet',
    primary: '#a855f7', // purple-500
    secondary: '#ec4899', // pink-500
    glow: 'rgba(168, 85, 247, 0.45)',
    background: '#12071f',
    grid: 'rgba(168, 85, 247, 0.12)',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    barsGradient: ['#8b5cf6', '#ec4899', '#f43f5e'],
  },
  amber: {
    name: 'Solar Amber',
    primary: '#f59e0b', // amber-500
    secondary: '#ef4444', // red-500
    glow: 'rgba(245, 158, 11, 0.45)',
    background: '#180f03',
    grid: 'rgba(245, 158, 11, 0.12)',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    barsGradient: ['#f59e0b', '#fb923c', '#ef4444'],
  },
  ocean: {
    name: 'Abyssal Blue',
    primary: '#3b82f6', // blue-500
    secondary: '#06b6d4', // cyan-500
    glow: 'rgba(59, 130, 246, 0.45)',
    background: '#030f1e',
    grid: 'rgba(59, 130, 246, 0.12)',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    barsGradient: ['#3b82f6', '#06b6d4', '#38bdf8'],
  },
};

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  currentEngineId,
  engineName = 'Rippler-X PolyBLEP Synth',
  synthParams,
  activeNotes = [],
  className = '',
  analyserNode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const peakHoldRef = useRef<Float32Array | null>(null);

  // Visualizer configuration state
  const [displayMode, setDisplayMode] = useState<VisualizerDisplayMode>('dual');
  const [theme, setTheme] = useState<VisualizerColorTheme>('cyber');
  const [fftSize, setFftSize] = useState<number>(2048);
  const [sensitivity, setSensitivity] = useState<number>(1.2);
  const [smoothing, setSmoothing] = useState<number>(0.82);
  const [isFrozen, setIsFrozen] = useState<boolean>(false);
  const [isAudioActive, setIsAudioActive] = useState<boolean>(false);

  // Live telemetry metrics
  const [metrics, setMetrics] = useState({
    peakFreqHz: 0,
    dominantPitch: '--',
    rmsDbfs: -96,
    peakAmplitude: 0,
    sampleRate: 48000,
    isClipping: false,
  });

  // Calculate note name from frequency
  const getNoteNameFromFreq = useCallback((freq: number): string => {
    if (freq < 20 || freq > 15000) return '--';
    const noteStrings = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const midi = Math.round(12 * (Math.log(freq / 440) / Math.log(2))) + 69;
    if (midi < 12 || midi > 127) return '--';
    const note = noteStrings[midi % 12];
    const octave = Math.floor(midi / 12) - 1;
    return `${note}${octave}`;
  }, []);

  // Update AnalyserNode parameters whenever settings change
  useEffect(() => {
    const analyser = analyserNode || audioEngine.getAnalyser();
    if (analyser) {
      try {
        analyser.fftSize = fftSize;
        analyser.smoothingTimeConstant = smoothing;
      } catch (err) {
        console.warn('Failed to apply analyser properties:', err);
      }
    }
  }, [analyserNode, fftSize, smoothing]);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;
    let localFrame = 0;

    const render = () => {
      if (!isRunning) return;

      const analyser = analyserNode || audioEngine.getAnalyser();
      const currentTheme = COLOR_THEMES[theme];

      // Handle Device Pixel Ratio for crystal sharp rendering
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (width > 0 && height > 0) {
        if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
          canvas.width = width * dpr;
          canvas.height = height * dpr;
        }
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Clear Canvas Background
      ctx.fillStyle = currentTheme.background;
      ctx.fillRect(0, 0, width, height);

      // Draw Bathymetric / Frequency Grid Lines
      ctx.strokeStyle = currentTheme.grid;
      ctx.lineWidth = 1;

      // Horizontal grid lines (-12dB, -24dB, -48dB, etc.)
      const gridDivisions = 6;
      for (let i = 1; i < gridDivisions; i++) {
        const y = (height / gridDivisions) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();

        ctx.fillStyle = 'rgba(148, 163, 184, 0.35)';
        ctx.font = '9px monospace';
        const dbLabel = `-${(gridDivisions - i) * 12} dB`;
        ctx.fillText(dbLabel, 6, y - 3);
      }

      // Vertical frequency grid markers (100Hz, 500Hz, 1kHz, 5kHz, 10kHz, 20kHz)
      const freqMarkers = [
        { freq: 100, label: '100Hz' },
        { freq: 500, label: '500Hz' },
        { freq: 1000, label: '1kHz' },
        { freq: 5000, label: '5kHz' },
        { freq: 10000, label: '10kHz' },
        { freq: 20000, label: '20kHz' },
      ];

      const sampleRate = analyser?.context?.sampleRate || 48000;
      const nyquist = sampleRate / 2;

      freqMarkers.forEach((marker) => {
        // Logarithmic frequency scale positioning
        const logMin = Math.log10(20);
        const logMax = Math.log10(nyquist);
        const logPos = (Math.log10(marker.freq) - logMin) / (logMax - logMin);
        const x = Math.max(10, Math.min(width - 40, logPos * width));

        ctx.beginPath();
        ctx.setLineDash([2, 4]);
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.font = '8px monospace';
        ctx.fillText(marker.label, x + 3, height - 6);
      });

      if (!analyser || isFrozen) {
        // Fallback or Frozen display
        ctx.restore();
        if (!isFrozen) {
          animationFrameRef.current = requestAnimationFrame(render);
        }
        return;
      }

      const bufferLength = analyser.frequencyBinCount;
      const freqData = new Uint8Array(bufferLength);
      const timeData = new Uint8Array(bufferLength);

      analyser.getByteFrequencyData(freqData);
      analyser.getByteTimeDomainData(timeData);

      // Calculate Real-time Audio Metrics
      let sumSquares = 0;
      let maxAmp = 0;
      let peakBin = 0;
      let maxFreqVal = 0;

      for (let i = 0; i < bufferLength; i++) {
        // RMS calculation from time-domain
        const norm = (timeData[i] - 128) / 128;
        sumSquares += norm * norm;
        if (Math.abs(norm) > maxAmp) {
          maxAmp = Math.abs(norm);
        }

        // Peak frequency bin detection
        if (freqData[i] > maxFreqVal) {
          maxFreqVal = freqData[i];
          peakBin = i;
        }
      }

      const rms = Math.sqrt(sumSquares / bufferLength);
      const rmsDb = rms > 0.00001 ? Math.round(20 * Math.log10(rms)) : -96;
      const peakFreq = Math.round((peakBin * nyquist) / bufferLength);
      const dominantPitch = peakFreq > 30 ? getNoteNameFromFreq(peakFreq) : '--';
      const isClipping = maxAmp >= 0.98;
      const hasAudio = maxAmp > 0.015 || maxFreqVal > 10;

      // Update UI metrics every 4 frames to avoid React overhead
      localFrame++;
      if (localFrame % 4 === 0) {
        setIsAudioActive(hasAudio);
        setMetrics({
          peakFreqHz: peakFreq,
          dominantPitch,
          rmsDbfs: Math.max(-96, rmsDb),
          peakAmplitude: Math.min(1, maxAmp),
          sampleRate,
          isClipping,
        });
      }

      // Initialize or resize peak-hold buffer
      if (!peakHoldRef.current || peakHoldRef.current.length !== bufferLength) {
        peakHoldRef.current = new Float32Array(bufferLength);
      }
      const peakHold = peakHoldRef.current;

      // Decay peak hold
      for (let i = 0; i < bufferLength; i++) {
        if (freqData[i] >= peakHold[i]) {
          peakHold[i] = freqData[i];
        } else {
          peakHold[i] = Math.max(0, peakHold[i] - 1.2);
        }
      }

      // RENDER MODES
      if (displayMode === 'frequency') {
        renderFrequencyBars(ctx, width, height, freqData, peakHold, bufferLength, currentTheme, sensitivity);
      } else if (displayMode === 'waveform') {
        renderWaveformScope(ctx, width, height, timeData, bufferLength, currentTheme, sensitivity);
      } else if (displayMode === 'radial') {
        renderRadialMandala(ctx, width, height, freqData, timeData, bufferLength, currentTheme, sensitivity);
      } else {
        // Dual Mode: Top half = Frequency spectrum bars, Bottom half = Waveform Oscilloscope
        const halfHeight = height / 2;

        ctx.save();
        renderFrequencyBars(ctx, width, halfHeight - 2, freqData, peakHold, bufferLength, currentTheme, sensitivity);
        ctx.restore();

        // Dividing hairline separator
        ctx.strokeStyle = currentTheme.primary;
        ctx.lineWidth = 1;
        ctx.shadowColor = currentTheme.glow;
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.moveTo(0, halfHeight);
        ctx.lineTo(width, halfHeight);
        ctx.stroke();

        ctx.save();
        ctx.translate(0, halfHeight);
        renderWaveformScope(ctx, width, halfHeight, timeData, bufferLength, currentTheme, sensitivity);
        ctx.restore();
      }

      ctx.restore();
      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [displayMode, theme, fftSize, sensitivity, smoothing, isFrozen, analyserNode, getNoteNameFromFreq]);

  // Helper: Render Frequency Spectrum Bars with Peak Decay Caps
  const renderFrequencyBars = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    freqData: Uint8Array,
    peakHold: Float32Array,
    bufferLength: number,
    currentTheme: (typeof COLOR_THEMES)[VisualizerColorTheme],
    gain: number
  ) => {
    const barCount = Math.min(96, Math.floor(width / 5));
    const barWidth = Math.max(2, (width / barCount) - 1.5);
    const step = Math.floor(bufferLength / barCount);

    // Gradient for the bars
    const gradient = ctx.createLinearGradient(0, height, 0, 0);
    gradient.addColorStop(0, currentTheme.barsGradient[0]);
    gradient.addColorStop(0.65, currentTheme.barsGradient[1]);
    gradient.addColorStop(1, currentTheme.barsGradient[2]);

    for (let i = 0; i < barCount; i++) {
      // Logarithmic index grouping for musical frequency representation
      const logIndex = Math.min(
        bufferLength - 1,
        Math.floor(Math.pow(i / barCount, 2.2) * (bufferLength - 1))
      );
      const val = Math.min(255, freqData[logIndex] * gain);
      const barHeight = Math.max(2, (val / 255) * (height - 12));
      const x = i * (barWidth + 1.5);
      const y = height - barHeight;

      // Draw Main Bar
      ctx.fillStyle = gradient;
      ctx.shadowColor = currentTheme.glow;
      ctx.shadowBlur = val > 150 ? 6 : 0;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Draw Peak Cap
      const peakVal = Math.min(255, peakHold[logIndex] * gain);
      const peakY = height - Math.max(2, (peakVal / 255) * (height - 12));
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 3;
      ctx.fillRect(x, Math.max(2, peakY - 1.5), barWidth, 1.5);
    }
  };

  // Helper: Render Oscilloscope Time-Domain Waveform with Zero-Crossing Lock
  const renderWaveformScope = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    timeData: Uint8Array,
    bufferLength: number,
    currentTheme: (typeof COLOR_THEMES)[VisualizerColorTheme],
    gain: number
  ) => {
    const centerY = height / 2;

    // Trigger on zero-crossing to stabilize oscilloscope waveform display
    let startIndex = 0;
    for (let i = 0; i < bufferLength - 1; i++) {
      if (timeData[i] < 128 && timeData[i + 1] >= 128) {
        startIndex = i;
        break;
      }
    }

    const availableSamples = bufferLength - startIndex;
    const sliceWidth = width / availableSamples;

    // Draw Filled Under-Wave Area
    ctx.beginPath();
    ctx.moveTo(0, height);
    for (let i = 0; i < availableSamples; i++) {
      const idx = startIndex + i;
      const normalized = (timeData[idx] - 128) / 128;
      const scaled = normalized * gain;
      const y = centerY + scaled * (centerY - 4);
      const x = i * sliceWidth;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.lineTo(width, height);
    ctx.closePath();

    const fillGrad = ctx.createLinearGradient(0, 0, 0, height);
    fillGrad.addColorStop(0, `${currentTheme.primary}40`);
    fillGrad.addColorStop(1, `${currentTheme.primary}05`);
    ctx.fillStyle = fillGrad;
    ctx.fill();

    // Draw Main Waveform Line with Bloom Glow
    ctx.beginPath();
    for (let i = 0; i < availableSamples; i++) {
      const idx = startIndex + i;
      const normalized = (timeData[idx] - 128) / 128;
      const scaled = normalized * gain;
      const y = Math.max(2, Math.min(height - 2, centerY + scaled * (centerY - 4)));
      const x = i * sliceWidth;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.strokeStyle = currentTheme.primary;
    ctx.lineWidth = 2.2;
    ctx.shadowColor = currentTheme.glow;
    ctx.shadowBlur = 8;
    ctx.stroke();

    // Draw secondary highlight line
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 0.8;
    ctx.shadowBlur = 0;
    ctx.stroke();
  };

  // Helper: Render Radial Mandala 360-degree Frequency & Phase Scope
  const renderRadialMandala = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    freqData: Uint8Array,
    timeData: Uint8Array,
    bufferLength: number,
    currentTheme: (typeof COLOR_THEMES)[VisualizerColorTheme],
    gain: number
  ) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const baseRadius = Math.min(centerX, centerY) * 0.45;
    const maxRadiusDelta = Math.min(centerX, centerY) * 0.48;

    const points = 128;
    const angleStep = (Math.PI * 2) / points;

    // Draw outer frequency ring
    ctx.beginPath();
    for (let i = 0; i <= points; i++) {
      const angle = i * angleStep;
      const dataIndex = Math.floor((i % points) * (bufferLength / points));
      const amp = (freqData[dataIndex] / 255) * gain;
      const r = baseRadius + amp * maxRadiusDelta;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();

    ctx.strokeStyle = currentTheme.secondary;
    ctx.lineWidth = 2.2;
    ctx.shadowColor = currentTheme.glow;
    ctx.shadowBlur = 10;
    ctx.stroke();

    // Draw inner time-domain waveform ring
    ctx.beginPath();
    for (let i = 0; i <= points; i++) {
      const angle = i * angleStep;
      const dataIndex = Math.floor((i % points) * (bufferLength / points));
      const norm = ((timeData[dataIndex] - 128) / 128) * gain;
      const r = Math.max(10, baseRadius * 0.65 + norm * (baseRadius * 0.35));
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();

    ctx.strokeStyle = currentTheme.primary;
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Center Core Pulser
    ctx.beginPath();
    ctx.arc(centerX, centerY, Math.max(6, baseRadius * 0.2 * gain), 0, Math.PI * 2);
    ctx.fillStyle = currentTheme.primary;
    ctx.shadowBlur = 15;
    ctx.fill();
  };

  // Test Tone Trigger to test synth audio engine directly
  const handleTestTone = () => {
    const defaultParams: SynthParameters = synthParams || {
      wave1: 'sawtooth',
      wave2: 'square',
      cutoff: 2500,
      resonance: 2.0,
      attack: 0.05,
      release: 0.3,
      volume: 0.75,
      timbreShift: 0,
    };
    audioEngine.noteOn('C4', defaultParams);
    setTimeout(() => {
      audioEngine.noteOff('C4', defaultParams.release);
    }, 450);
  };

  return (
    <div
      className={`bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-2xl relative overflow-hidden flex flex-col gap-3.5 ${className}`}
    >
      {/* Top Header Bar: Active Synth Title, Status Badge & Quick Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isAudioActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'
              }`}
            />
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-white">
              AudioVisualizer
            </span>
          </div>

          <span className="text-slate-600 font-mono text-xs">•</span>

          {/* Active Selected Synth Engine Badge */}
          <span
            className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold border ${
              COLOR_THEMES[theme].badge
            }`}
            title={`Active Synth Engine ID: ${currentEngineId || 'default'}`}
          >
            <i className="fas fa-microchip mr-1.5 opacity-80" />
            {engineName}
          </span>

          {/* Playing Voice Pill */}
          {activeNotes.length > 0 && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
              VOICES: {activeNotes.join(', ')}
            </span>
          )}
        </div>

        {/* View Mode Controls */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto flex-wrap">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-0.5 flex items-center gap-0.5">
            <button
              onClick={() => setDisplayMode('dual')}
              className={`px-2 py-1 rounded text-[10px] font-mono font-semibold transition-all ${
                displayMode === 'dual'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Dual View: Frequency Spectrum + Waveform Scope"
            >
              Dual Mode
            </button>
            <button
              onClick={() => setDisplayMode('frequency')}
              className={`px-2 py-1 rounded text-[10px] font-mono font-semibold transition-all ${
                displayMode === 'frequency'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Frequency Spectrum (FFT)"
            >
              Frequency
            </button>
            <button
              onClick={() => setDisplayMode('waveform')}
              className={`px-2 py-1 rounded text-[10px] font-mono font-semibold transition-all ${
                displayMode === 'waveform'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Waveform Oscilloscope (Time-Domain)"
            >
              Waveform
            </button>
            <button
              onClick={() => setDisplayMode('radial')}
              className={`px-2 py-1 rounded text-[10px] font-mono font-semibold transition-all ${
                displayMode === 'radial'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Radial Mandala 360° Scope"
            >
              Radial
            </button>
          </div>

          {/* Freeze / Live Toggle */}
          <button
            onClick={() => setIsFrozen(!isFrozen)}
            className={`px-2 py-1 rounded-lg text-[10px] font-mono font-semibold border transition-all flex items-center gap-1 ${
              isFrozen
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
            title="Freeze / Pause Frame Analysis"
          >
            <i className={`fas ${isFrozen ? 'fa-play' : 'fa-pause'} text-[9px]`} />
            <span>{isFrozen ? 'Resume' : 'Freeze'}</span>
          </button>

          {/* Audio Test Tone Button */}
          <button
            onClick={handleTestTone}
            className="px-2 py-1 rounded-lg text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all flex items-center gap-1"
            title="Trigger test tone (C4 261.6Hz) through current synth"
          >
            <i className="fas fa-volume-up text-[9px]" />
            <span>Test C4</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Display Area */}
      <div className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden border border-slate-800/80 bg-slate-950 shadow-inner group">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Live Audio Telemetry HUD Overlay (Top-Right) */}
        <div className="absolute top-2.5 right-2.5 bg-slate-900/85 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-lg text-[10px] font-mono flex items-center gap-3 text-slate-300 pointer-events-none shadow-lg">
          <div>
            <span className="text-slate-500 mr-1">PEAK:</span>
            <span className="text-cyan-400 font-bold">{metrics.peakFreqHz}Hz</span>
          </div>
          <div>
            <span className="text-slate-500 mr-1">NOTE:</span>
            <span className="text-emerald-400 font-bold">{metrics.dominantPitch}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-slate-500 mr-1">RMS:</span>
            <span
              className={`font-bold ${
                metrics.isClipping
                  ? 'text-red-400 animate-ping'
                  : metrics.rmsDbfs > -12
                  ? 'text-amber-400'
                  : 'text-slate-300'
              }`}
            >
              {metrics.rmsDbfs} dB
            </span>
          </div>
          {metrics.isClipping && (
            <span className="px-1.5 py-0.2 rounded bg-red-500 text-white font-bold text-[9px]">
              CLIP
            </span>
          )}
        </div>

        {/* Selected Synth Overlay Banner (Bottom-Left) */}
        <div className="absolute bottom-2.5 left-2.5 bg-slate-900/80 backdrop-blur-sm border border-slate-800 px-2.5 py-1 rounded-md text-[9px] font-mono text-slate-400 pointer-events-none flex items-center gap-2">
          <span>
            SYNTH: <strong className="text-white font-semibold">{engineName}</strong>
          </span>
          <span>•</span>
          <span>FFT: {fftSize}</span>
          <span>•</span>
          <span>{metrics.sampleRate / 1000} kHz</span>
        </div>
      </div>

      {/* Interactive Controls & DSP Tuning Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 pt-1 text-[11px] font-mono">
        {/* Sensitivity Gain */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span>Gain Scale</span>
            <span className="text-cyan-400 font-bold">{sensitivity.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="3.0"
            step="0.1"
            value={sensitivity}
            onChange={(e) => setSensitivity(parseFloat(e.target.value))}
            className="w-full accent-cyan-500 h-1 bg-slate-800 rounded cursor-pointer"
          />
        </div>

        {/* Smoothing Constant */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span>Smoothing</span>
            <span className="text-indigo-400 font-bold">{Math.round(smoothing * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="0.95"
            step="0.05"
            value={smoothing}
            onChange={(e) => setSmoothing(parseFloat(e.target.value))}
            className="w-full accent-indigo-500 h-1 bg-slate-800 rounded cursor-pointer"
          />
        </div>

        {/* FFT Size Selector */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-2.5 flex flex-col justify-between">
          <span className="text-slate-400 mb-1">FFT Resolution</span>
          <select
            value={fftSize}
            onChange={(e) => setFftSize(parseInt(e.target.value, 10))}
            className="bg-slate-950 border border-slate-800 text-slate-200 rounded px-2 py-0.5 text-[10px] focus:outline-none focus:border-cyan-500"
          >
            <option value="512">512 bins</option>
            <option value="1024">1024 bins</option>
            <option value="2048">2048 bins (Std)</option>
            <option value="4096">4096 bins (Hi-Res)</option>
          </select>
        </div>

        {/* Visual Color Theme */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-2.5 flex flex-col justify-between">
          <span className="text-slate-400 mb-1">Color Palette</span>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as VisualizerColorTheme)}
            className="bg-slate-950 border border-slate-800 text-slate-200 rounded px-2 py-0.5 text-[10px] focus:outline-none focus:border-cyan-500"
          >
            <option value="cyber">Cyberpunk Neon</option>
            <option value="quantum">Quantum Violet</option>
            <option value="amber">Solar Amber</option>
            <option value="ocean">Abyssal Blue</option>
          </select>
        </div>

        {/* Connected Federated Studio: Synth Horizons PWA */}
        <div className="bg-gradient-to-r from-purple-950/30 to-indigo-950/30 border border-purple-500/30 rounded-xl p-2.5 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[10px] uppercase font-bold text-purple-400 flex items-center gap-1">
              <i className="fas fa-layer-group text-[9px]" />
              <span>Federated Studio</span>
            </div>
            <a
              href="https://synth-horizons-gen-pwa-app-builder.ai.studio"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-purple-200 hover:text-white truncate block flex items-center gap-1 transition-colors"
              title="Open Synth Horizons Gen PWA App Builder"
            >
              <span>synth-horizons</span>
              <i className="fas fa-external-link-alt text-[9px] text-purple-400" />
            </a>
          </div>
          <a
            href="https://synth-horizons-gen-pwa-app-builder.ai.studio"
            target="_blank"
            rel="noreferrer"
            className="px-2 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-mono font-semibold transition-all shrink-0 shadow-sm"
          >
            PWA
          </a>
        </div>

        {/* Connected Federated Studio: Universal AI Shopping Agent */}
        <div className="bg-gradient-to-r from-amber-950/30 to-yellow-950/30 border border-amber-500/30 rounded-xl p-2.5 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
              <i className="fas fa-shopping-bag text-[9px]" />
              <span>Commerce Agent</span>
            </div>
            <a
              href="https://universal-ai-shopping-agent.ai.studio"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-amber-200 hover:text-white truncate block flex items-center gap-1 transition-colors"
              title="Open Universal AI Shopping Agent Studio"
            >
              <span>shopping-agent</span>
              <i className="fas fa-external-link-alt text-[9px] text-amber-400" />
            </a>
          </div>
          <a
            href="https://universal-ai-shopping-agent.ai.studio"
            target="_blank"
            rel="noreferrer"
            className="px-2 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-mono font-semibold transition-all shrink-0 shadow-sm"
          >
            Launch
          </a>
        </div>
      </div>
    </div>
  );
};
