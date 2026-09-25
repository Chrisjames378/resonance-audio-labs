import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';

export interface ImprovementVectorData {
  id: string;
  label: string;
  description: string;
  estimatedDevHours: number;
  projectedValuationDelta: number;
  category: 'Feature Expansion' | 'Monetization' | 'Platform Wrapper' | 'Integration';
}

export interface AppRoiConfig {
  id: string;
  title: string;
  category: string;
  platform: string;
  emailOwner: string;
  currentValuation: number;
  baseImprovedValuation: number;
  vectors: ImprovementVectorData[];
}

const PROJECT_ROI_DATA: AppRoiConfig[] = [
  {
    id: 'p1',
    title: 'Resonance Studio Operations Hub',
    category: 'SaaS Platform',
    platform: 'AI Studio',
    emailOwner: 'chris.james378@gmail.com',
    currentValuation: 45000,
    baseImprovedValuation: 180000,
    vectors: [
      {
        id: 'v1_1',
        label: 'Stripe Automated Recurring Subscriptions',
        description: 'Multi-tier pricing, metered API usage billing, and automated invoice PDF generation.',
        estimatedDevHours: 60,
        projectedValuationDelta: 45000,
        category: 'Monetization',
      },
      {
        id: 'v1_2',
        label: 'Multi-Team Enterprise Permission Roles',
        description: 'RBAC user management, contractor role delegation, and audit logging.',
        estimatedDevHours: 50,
        projectedValuationDelta: 35000,
        category: 'Feature Expansion',
      },
      {
        id: 'v1_3',
        label: 'White-Label Audio Studio Branding & Custom Domains',
        description: 'Custom domain SSL routing and white-label client portal theme engine.',
        estimatedDevHours: 75,
        projectedValuationDelta: 55000,
        category: 'Feature Expansion',
      },
    ],
  },
  {
    id: 'p2',
    title: 'PolyBLEP Subtractive Synth Core Engine',
    category: 'Synth Engine',
    platform: 'GitHub',
    emailOwner: 'resonanceaudiolabs@gmail.com',
    currentValuation: 25000,
    baseImprovedValuation: 85000,
    vectors: [
      {
        id: 'v2_1',
        label: 'JUCE C++ VST3 / AU Desktop Binary Wrapper',
        description: 'Native compiled desktop plugins for Ableton Live, Logic Pro X, and FL Studio.',
        estimatedDevHours: 80,
        projectedValuationDelta: 35000,
        category: 'Platform Wrapper',
      },
      {
        id: 'v2_2',
        label: 'Preset Cloud Library Sync & Artist Soundbanks',
        description: 'Cloud preset browsing, community sharing, and artist expansion pack monetization.',
        estimatedDevHours: 35,
        projectedValuationDelta: 15000,
        category: 'Monetization',
      },
      {
        id: 'v2_3',
        label: 'MPE (MIDI Polyphonic Expression) Support',
        description: '3D expressivity per note for ROLI and LinnStrument hardware controllers.',
        estimatedDevHours: 25,
        projectedValuationDelta: 10000,
        category: 'Feature Expansion',
      },
    ],
  },
  {
    id: 'p3',
    title: 'DX-Matrix 2-Operator FM Synthesizer',
    category: 'Synth Engine',
    platform: 'Vercel',
    emailOwner: 'resonanceaudiolabs@gmail.com',
    currentValuation: 18000,
    baseImprovedValuation: 65000,
    vectors: [
      {
        id: 'v3_1',
        label: '6-Operator FM Core & Yamaha DX7 SysEx Import',
        description: '6-operator algorithm matrix with direct DX7 patch file decoding.',
        estimatedDevHours: 60,
        projectedValuationDelta: 27000,
        category: 'Feature Expansion',
      },
      {
        id: 'v3_2',
        label: 'iOS Audio Unit v3 (AUv3) App Store Listing',
        description: 'Mobile iOS plugin binary for GarageBand iOS and AUM host application.',
        estimatedDevHours: 45,
        projectedValuationDelta: 20000,
        category: 'Platform Wrapper',
      },
    ],
  },
  {
    id: 'p4',
    title: 'Resonance Studio 32-Step Web DAW Sequencer',
    category: 'DAW Workstation',
    platform: 'AI Studio',
    emailOwner: 'chris.james378@gmail.com',
    currentValuation: 35000,
    baseImprovedValuation: 125000,
    vectors: [
      {
        id: 'v4_1',
        label: 'Hardware MIDI Clock In/Out & WebMIDI Routing',
        description: 'Low-jitter hardware clock sync with external synthesizers and drum machines.',
        estimatedDevHours: 35,
        projectedValuationDelta: 25000,
        category: 'Integration',
      },
      {
        id: 'v4_2',
        label: 'Multi-Track Stem Audio Export (24-bit WAV & FLAC)',
        description: 'Parallel offline rendering of separate track stems for studio mixing.',
        estimatedDevHours: 30,
        projectedValuationDelta: 20000,
        category: 'Feature Expansion',
      },
      {
        id: 'v4_3',
        label: 'WebRTC Real-Time Collaborative Jam Sessions',
        description: 'Peer-to-peer multiplayer audio and pattern sync across web browsers.',
        estimatedDevHours: 90,
        projectedValuationDelta: 45000,
        category: 'Feature Expansion',
      },
    ],
  },
  {
    id: 'p5',
    title: 'UniAgent Autonomous Multi-Agent Mesh',
    category: 'AI Agent & Mesh',
    platform: 'Emergent',
    emailOwner: 'uniagent.website',
    currentValuation: 50000,
    baseImprovedValuation: 220000,
    vectors: [
      {
        id: 'v5_1',
        label: 'Multi-Tenant API Key Tiering on uniagent.website',
        description: 'Developer dashboard with usage quotas, API key token gating, and Stripe billing.',
        estimatedDevHours: 65,
        projectedValuationDelta: 70000,
        category: 'Monetization',
      },
      {
        id: 'v5_2',
        label: 'Enterprise B2B Webhook Event Pipeline & SLA',
        description: '99.9% uptime guaranteed event delivery, retries, and high-throughput queuing.',
        estimatedDevHours: 75,
        projectedValuationDelta: 60000,
        category: 'Integration',
      },
      {
        id: 'v5_3',
        label: 'Domain-Specific Fine-Tuned Audio DSP Agent Models',
        description: 'Fine-tuned Gemini agent adapters for automated acoustic mixing and mastering.',
        estimatedDevHours: 50,
        projectedValuationDelta: 40000,
        category: 'Feature Expansion',
      },
    ],
  },
  {
    id: 'p6',
    title: 'Claude Legal Agreement & Contract Generator',
    category: 'AI Agent',
    platform: 'Claude',
    emailOwner: 'resonanceaudiolabs@gmail.com',
    currentValuation: 20000,
    baseImprovedValuation: 75000,
    vectors: [
      {
        id: 'v6_1',
        label: 'Native DocuSign / HelloSign E-Signature API',
        description: 'One-click contract generation, signature dispatch, and tracking.',
        estimatedDevHours: 40,
        projectedValuationDelta: 30000,
        category: 'Integration',
      },
      {
        id: 'v6_2',
        label: 'Regional Legal Jurisdiction & Compliance Auditor',
        description: 'Automatic clause adaptation for US, EU, and NZ employment laws.',
        estimatedDevHours: 55,
        projectedValuationDelta: 25000,
        category: 'Feature Expansion',
      },
    ],
  },
  {
    id: 'p7',
    title: 'Gemini Multimodal Voice Synthesizer Assistant',
    category: 'AI Agent',
    platform: 'Gemini',
    emailOwner: 'chris.james378@gmail.com',
    currentValuation: 30000,
    baseImprovedValuation: 110000,
    vectors: [
      {
        id: 'v7_1',
        label: 'Low-Latency Gemini Live WebSocket Streaming',
        description: 'Bi-directional live voice interaction for real-time stage synth sound design.',
        estimatedDevHours: 85,
        projectedValuationDelta: 50000,
        category: 'Feature Expansion',
      },
      {
        id: 'v7_2',
        label: 'Stage Performance Hardware MIDI CC Mapping',
        description: 'Voice command translation directly into MIDI CC automation messages.',
        estimatedDevHours: 40,
        projectedValuationDelta: 30000,
        category: 'Integration',
      },
    ],
  },
  {
    id: 'p8',
    title: 'Mobile Audio Field Recorder & Sampler PWA',
    category: 'Mobile PWA',
    platform: 'Vercel',
    emailOwner: 'resonanceaudiolabs@gmail.com',
    currentValuation: 15000,
    baseImprovedValuation: 55000,
    vectors: [
      {
        id: 'v8_1',
        label: 'Capacitor iOS App Store & Google Play Listing',
        description: 'Native mobile shell packaging for app store discoverability and in-app purchases.',
        estimatedDevHours: 40,
        projectedValuationDelta: 25000,
        category: 'Platform Wrapper',
      },
      {
        id: 'v8_2',
        label: 'Cloud Audio Sample Sync & AI Auto-Tagging',
        description: 'Automatic speech-to-text tagging and multi-device cloud sample storage.',
        estimatedDevHours: 30,
        projectedValuationDelta: 15000,
        category: 'Feature Expansion',
      },
    ],
  },
  {
    id: 'p9',
    title: 'Client Onboarding & License Commerce Portal',
    category: 'SaaS Platform',
    platform: 'Vercel',
    emailOwner: 'chris.james378@gmail.com',
    currentValuation: 40000,
    baseImprovedValuation: 150000,
    vectors: [
      {
        id: 'v9_1',
        label: 'White-Label Audio Studio Sub-Portals',
        description: 'SaaS license portal rentals for 3rd party audio software creators.',
        estimatedDevHours: 80,
        projectedValuationDelta: 65000,
        category: 'Monetization',
      },
      {
        id: 'v9_2',
        label: 'Affiliate Referral Commission & Automated License Keys',
        description: 'Automated affiliate tracking, payouts, and RSA key signing servers.',
        estimatedDevHours: 50,
        projectedValuationDelta: 45000,
        category: 'Monetization',
      },
    ],
  },
  {
    id: 'p10',
    title: 'Resonance Microservice Edge API Router',
    category: 'Utility & API',
    platform: 'GitHub',
    emailOwner: 'uniagent.website',
    currentValuation: 12000,
    baseImprovedValuation: 45000,
    vectors: [
      {
        id: 'v10_1',
        label: 'Global Cloudflare Worker Edge Node Deployment',
        description: '<10ms global edge latency routing across multi-region serverless endpoints.',
        estimatedDevHours: 30,
        projectedValuationDelta: 18000,
        category: 'Integration',
      },
      {
        id: 'v10_2',
        label: 'Rate-Limiting Analytics & Metered Billing Gateway',
        description: 'Granular usage analytics dashboard and pay-as-you-go rate limiting.',
        estimatedDevHours: 40,
        projectedValuationDelta: 15000,
        category: 'Monetization',
      },
    ],
  },
  {
    id: 'p11',
    title: 'Rippler-X 101 AI Neural Synth Studio',
    category: 'AI Neural Synth',
    platform: 'AI Studio',
    emailOwner: 'chris.james378@gmail.com',
    currentValuation: 38000,
    baseImprovedValuation: 140000,
    vectors: [
      {
        id: 'v11_1',
        label: 'WebGPU Acceleration for Real-Time Latent Morphing',
        description: 'Hardware GPU shader pipeline for zero-latency neural wavetable interpolation.',
        estimatedDevHours: 80,
        projectedValuationDelta: 55000,
        category: 'Feature Expansion',
      },
      {
        id: 'v11_2',
        label: 'VST3 Desktop Wrapper & Cloud Soundbank Marketplace',
        description: 'Native DAW plugin binary export and community soundbank preset sales.',
        estimatedDevHours: 90,
        projectedValuationDelta: 47000,
        category: 'Platform Wrapper',
      },
    ],
  },
  {
    id: 'p12',
    title: 'Resonant Pulse Audio Calibration Suite',
    category: 'Acoustic Calibration',
    platform: 'AI Studio',
    emailOwner: 'resonanceaudiolabs@gmail.com',
    currentValuation: 28000,
    baseImprovedValuation: 95000,
    vectors: [
      {
        id: 'v12_1',
        label: 'Measurement Microphone Calibration Curves & Multi-Mic Array',
        description: 'Import USB measurement mic profiles for precision studio room correction.',
        estimatedDevHours: 45,
        projectedValuationDelta: 35000,
        category: 'Integration',
      },
      {
        id: 'v12_2',
        label: 'Hardware EQ Plugin Preset Export (AU / VST3 / AAX)',
        description: 'Export room correction filter FIR coefficients directly into studio monitors or DAWs.',
        estimatedDevHours: 65,
        projectedValuationDelta: 32000,
        category: 'Feature Expansion',
      },
    ],
  },
];

interface FinancialsTabProps {
  onShowToast?: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export const FinancialsTab: React.FC<FinancialsTabProps> = ({ onShowToast }) => {
  const [subscribers, setSubscribers] = useState(500);
  const [fee, setFee] = useState(15);

  // ROI Calculator States
  const [selectedAppId, setSelectedAppId] = useState<string>('p1'); // 'all' or app id
  const [devHourlyRate, setDevHourlyRate] = useState<number>(45); // $45 / hour contractor rate
  const [activeVectorIds, setActiveVectorIds] = useState<Record<string, boolean>>(() => {
    const initialMap: Record<string, boolean> = {};
    PROJECT_ROI_DATA.forEach((app) => {
      app.vectors.forEach((v) => {
        initialMap[v.id] = true; // all vectors active by default
      });
    });
    return initialMap;
  });

  const mrr = subscribers * fee;
  const arr = mrr * 12;
  const valMin = arr * 3.0;
  const valMax = arr * 5.0;

  // ROI Calculator Calculations
  const selectedApps = selectedAppId === 'all'
    ? PROJECT_ROI_DATA
    : PROJECT_ROI_DATA.filter((a) => a.id === selectedAppId);

  const currentValuationTotal = selectedApps.reduce((sum, a) => sum + a.currentValuation, 0);

  // Available vectors for selected app(s)
  const availableVectors = selectedApps.flatMap((a) =>
    a.vectors.map((v) => ({ ...v, appTitle: a.title, appId: a.id }))
  );

  // Selected vectors
  const selectedVectorsList = availableVectors.filter((v) => activeVectorIds[v.id]);

  const totalDevHoursNeeded = selectedVectorsList.reduce((sum, v) => sum + v.estimatedDevHours, 0);
  const totalDevCapitalCost = totalDevHoursNeeded * devHourlyRate;
  const totalProjectedValuationDelta = selectedVectorsList.reduce((sum, v) => sum + v.projectedValuationDelta, 0);
  const totalProjectedValuation = currentValuationTotal + totalProjectedValuationDelta;

  const netProfitGain = totalProjectedValuationDelta - totalDevCapitalCost;
  const roiPercentage = totalDevCapitalCost > 0 ? (netProfitGain / totalDevCapitalCost) * 100 : 0;
  const capitalEfficiencyRatio = totalDevCapitalCost > 0 ? totalProjectedValuationDelta / totalDevCapitalCost : 0;
  
  // Payback estimate in months based on projected monthly revenue contribution ($)
  const estimatedMonthlyRevContribution = (totalProjectedValuationDelta * 0.05) / 12; // 5% ARR yield
  const paybackMonths = estimatedMonthlyRevContribution > 0 ? totalDevCapitalCost / estimatedMonthlyRevContribution : 0;

  const toggleVector = (vectorId: string) => {
    setActiveVectorIds((prev) => ({
      ...prev,
      [vectorId]: !prev[vectorId],
    }));
  };

  const selectAllVectorsForCurrentApp = () => {
    setActiveVectorIds((prev) => {
      const next = { ...prev };
      availableVectors.forEach((v) => {
        next[v.id] = true;
      });
      return next;
    });
    if (onShowToast) onShowToast('All improvement vectors enabled', 'info');
  };

  const deselectAllVectorsForCurrentApp = () => {
    setActiveVectorIds((prev) => {
      const next = { ...prev };
      availableVectors.forEach((v) => {
        next[v.id] = false;
      });
      return next;
    });
    if (onShowToast) onShowToast('All vectors cleared', 'info');
  };

  // Recharts Chart Data Mapping
  const [chartMode, setChartMode] = useState<'grouped' | 'stacked'>('grouped');

  const rechartsData = PROJECT_ROI_DATA.map((app) => {
    const gain = app.baseImprovedValuation - app.currentValuation;
    const growthPct = Math.round((gain / app.currentValuation) * 100);

    return {
      name: app.title
        .replace('Resonance Studio ', '')
        .replace(' Subtractive Synth Core Engine', '')
        .replace(' Autonomous Multi-Agent Mesh', '')
        .replace(' Agreement & Contract Generator', '')
        .replace(' Multimodal Voice Synthesizer Assistant', '')
        .replace(' Audio Field Recorder & Sampler PWA', '')
        .replace(' Onboarding & License Commerce Portal', '')
        .replace(' Microservice Edge API Router', ''),
      fullName: app.title,
      category: app.category,
      platform: app.platform,
      currentValue: app.currentValuation,
      futureValue: app.baseImprovedValuation,
      valuationDelta: gain,
      growthPct: growthPct,
    };
  });

  return (
    <section id="tab-financials" className="tab-content space-y-6">
      {/* Revenue Simulator Widget */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 border border-indigo-500/20 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <i className="fas fa-calculator text-emerald-400"></i>
              Live B2C Subscriber Revenue & Exit Valuation Simulator
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Adjust target active user tiers to calculate dynamic monthly recurring revenue (MRR), annual recurring revenue (ARR), and strategic exit multiples.
            </p>
          </div>

          {/* Presets */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-mono">Tiers:</span>
            <button
              onClick={() => setSubscribers(50)}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-colors"
            >
              50 Users
            </button>
            <button
              onClick={() => setSubscribers(150)}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-colors"
            >
              150 Users
            </button>
            <button
              onClick={() => setSubscribers(350)}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-colors"
            >
              350 Users
            </button>
            <button
              onClick={() => setSubscribers(500)}
              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs text-white font-bold shadow-lg shadow-emerald-600/20 transition-colors"
            >
              500 Users (Scale Goal)
            </button>
          </div>
        </div>

        {/* Slider Controls & Outputs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: Sliders (6 cols) */}
          <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-5">
            {/* Subscribers Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">Active Monthly Subscribers</span>
                <span className="font-mono text-emerald-400 font-bold text-sm" id="sim-user-count-display">
                  {subscribers.toLocaleString()} Users
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={subscribers}
                onChange={(e) => setSubscribers(Number(e.target.value))}
                className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Price Per Month Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">Monthly Subscription Fee (NZD)</span>
                <span className="font-mono text-indigo-400 font-bold text-sm" id="sim-fee-display">
                  ${fee.toFixed(2)} / mo
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={fee}
                onChange={(e) => setFee(Number(e.target.value))}
                className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Overhead Expense Display */}
            <div className="pt-2 border-t border-slate-800 text-xs flex justify-between items-center text-slate-400 font-mono">
              <span>Estimated Monthly Fixed Cloud Liabilities:</span>
              <span className="text-rose-400 font-bold">-$65.00 NZD/mo</span>
            </div>
          </div>

          {/* Right: Dynamic Output Metrics Cards (6 cols) */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* MRR Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase">Monthly Recurring Revenue (MRR)</span>
              <div id="sim-mrr" className="text-2xl font-extrabold font-mono text-emerald-400">
                ${mrr.toLocaleString('en-US')} NZD
              </div>
              <p className="text-[10px] text-slate-500">Gross subscriber income per month</p>
            </div>

            {/* ARR Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase">Annual Recurring Run-Rate (ARR)</span>
              <div id="sim-arr" className="text-2xl font-extrabold font-mono text-indigo-400">
                ${arr.toLocaleString('en-US')} NZD
              </div>
              <p className="text-[10px] text-slate-500">Projected 12-month gross trajectory</p>
            </div>

            {/* Asset Buyout Valuation Multiplier */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1 sm:col-span-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-mono text-slate-400 uppercase">
                  Target Acquisition Exit Multiple (3.0x - 5.0x ARR)
                </span>
                <span className="text-xs text-purple-400 font-mono">Strategic IP Buyout Target</span>
              </div>
              <div id="sim-valuation" className="text-2xl font-extrabold font-mono text-purple-300">
                ${valMin.toLocaleString('en-US')} – ${valMax.toLocaleString('en-US')} NZD
              </div>
              <p className="text-[10px] text-slate-500">Target M&A portfolios: Native Instruments, Splice, BandLab, Ableton</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Year Ramp Up Projection Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl print-card">
        <h3 className="text-lg font-bold text-white print-text">3-Year Ramp-Up Projection Schedule</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase border-b border-slate-800">
              <tr>
                <th className="p-3">Phase / Milestone</th>
                <th className="p-3">Active User Cohort</th>
                <th className="p-3">Monthly Rate</th>
                <th className="p-3">Gross MRR</th>
                <th className="p-3 text-right">Net Operational Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              <tr>
                <td className="p-3 font-semibold text-white">Months 1–3 (Beta Launch)</td>
                <td className="p-3 text-slate-300">25 – 50 Subscribers</td>
                <td className="p-3 text-slate-400">$15.00 / mo</td>
                <td className="p-3 text-emerald-400">$375 – $750 / mo</td>
                <td className="p-3 text-right text-indigo-400">Flexi-Wage Supported</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">Months 4–6 (Transition)</td>
                <td className="p-3 text-slate-300">100 – 150 Subscribers</td>
                <td className="p-3 text-slate-400">$15.00 / mo</td>
                <td className="p-3 text-emerald-400">$1,500 – $2,250 / mo</td>
                <td className="p-3 text-right text-emerald-400">Benefit Off-Ramp Threshold</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">Year 2 (Platform Scale)</td>
                <td className="p-3 text-slate-300">350 Subscribers</td>
                <td className="p-3 text-slate-400">$15.00 / mo</td>
                <td className="p-3 text-emerald-400">$5,250 / mo ($63,000/yr)</td>
                <td className="p-3 text-right text-emerald-400">Commercially Autonomous</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">Year 3 (Maturity & M&A Target)</td>
                <td className="p-3 text-slate-300">500+ Subscribers</td>
                <td className="p-3 text-slate-400">$15.00 / mo</td>
                <td className="p-3 text-emerald-400">$7,500 / mo ($90,000/yr)</td>
                <td className="p-3 text-right text-purple-400">M&A Acquisition Window</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Project Improvement ROI & Capital Efficiency Calculator */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1.5">
                <i className="fas fa-chart-pie"></i> Interactive ROI Simulator
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono">
                Improvement Vector Engine
              </span>
            </div>
            <h3 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <i className="fas fa-calculator text-emerald-400"></i> Project Improvement ROI & Capital Efficiency Calculator
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Analyze current project baseline value vs. projected growth based on identified improvement vectors for each app. Toggle specific vectors and adjust engineering hourly rates to simulate net profit return and capital efficiency multipliers.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={selectAllVectorsForCurrentApp}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono transition-all shadow-md shadow-emerald-600/20"
            >
              <i className="fas fa-check-double mr-1.5"></i> Enable All Vectors
            </button>
            <button
              onClick={deselectAllVectorsForCurrentApp}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold font-mono border border-slate-700 transition-all"
            >
              <i className="fas fa-times mr-1.5"></i> Clear Vectors
            </button>
          </div>
        </div>

        {/* Controls Bar: App Selector & Contractor Rate Slider */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-950/80 border border-slate-800 p-5 rounded-xl items-center">
          {/* App Selector Dropdown / Pills */}
          <div className="lg:col-span-7 space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Select App / Portfolio Scope</span>
              <span className="text-indigo-400 font-mono text-[11px]">
                Showing {selectedAppId === 'all' ? 'All 12 Apps' : PROJECT_ROI_DATA.find((a) => a.id === selectedAppId)?.title}
              </span>
            </label>

            <select
              value={selectedAppId}
              onChange={(e) => setSelectedAppId(e.target.value)}
              className="w-full bg-slate-900 border border-indigo-500/40 rounded-xl px-4 py-2.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-emerald-400"
            >
              <option value="all">🌟 ALL 12 APPS COMBINED PORTFOLIO ($356,000 ➔ $1,345,000)</option>
              {PROJECT_ROI_DATA.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.title} ({app.category}) — Base: ${app.currentValuation.toLocaleString()} ➔ Upgraded: ${app.baseImprovedValuation.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          {/* Contractor Rate Slider */}
          <div className="lg:col-span-5 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-300">Contractor / Engineering Rate</span>
              <span className="font-mono text-emerald-400 font-bold text-sm">
                ${devHourlyRate}.00 / hour
              </span>
            </div>
            <input
              type="range"
              min="25"
              max="120"
              step="5"
              value={devHourlyRate}
              onChange={(e) => setDevHourlyRate(Number(e.target.value))}
              className="w-full accent-emerald-400 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>$25/hr (Junior)</span>
              <span>$45/hr (Standard NZ)</span>
              <span>$120/hr (Senior Specialist)</span>
            </div>
          </div>
        </div>

        {/* Dynamic Improvement Vector Checklist for Selected App */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <i className="fas fa-list-check text-indigo-400"></i> Identified Improvement Vectors & Capital Requirements
            </span>
            <span className="text-slate-400 font-mono text-[11px]">
              {selectedVectorsList.length} of {availableVectors.length} Vectors Selected
            </span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableVectors.map((vector) => {
              const isChecked = !!activeVectorIds[vector.id];
              const vectorCost = vector.estimatedDevHours * devHourlyRate;
              const vectorRoi = vectorCost > 0 ? ((vector.projectedValuationDelta - vectorCost) / vectorCost) * 100 : 0;

              return (
                <div
                  key={vector.id}
                  onClick={() => toggleVector(vector.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 flex flex-col justify-between ${
                    isChecked
                      ? 'bg-slate-950/90 border-emerald-500/60 shadow-lg shadow-emerald-500/5'
                      : 'bg-slate-950/40 border-slate-800/80 opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // handled by div click
                          className="mt-0.5 accent-emerald-500 h-4 w-4 rounded border-slate-700 cursor-pointer"
                        />
                        <div>
                          <h5 className="text-xs font-bold text-white leading-tight">
                            {vector.label}
                          </h5>
                          {selectedAppId === 'all' && (
                            <span className="text-[10px] text-indigo-400 font-mono font-semibold block">
                              {vector.appTitle}
                            </span>
                          )}
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] font-mono whitespace-nowrap">
                        {vector.category}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed pl-7">
                      {vector.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono pl-7">
                    <div className="text-slate-400">
                      <span>{vector.estimatedDevHours} hrs</span> • <span className="text-slate-200 font-bold">${vectorCost.toLocaleString()} Cost</span>
                    </div>
                    <div className="text-emerald-400 font-bold flex items-center gap-1">
                      <span>+${vector.projectedValuationDelta.toLocaleString()} Value</span>
                      <span className="text-[10px] text-indigo-300">({vectorRoi.toFixed(0)}% ROI)</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Calculated ROI Output Banner Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          {/* Card 1: Dev Cost */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1">
            <span className="text-[10px] uppercase text-slate-400 tracking-wider flex items-center gap-1">
              <i className="fas fa-coins text-amber-400"></i> Dev Capital Investment
            </span>
            <p className="text-2xl font-extrabold text-amber-400">
              ${totalDevCapitalCost.toLocaleString()} <span className="text-xs font-normal text-slate-400">USD</span>
            </p>
            <p className="text-[10px] text-slate-500 font-sans">
              {totalDevHoursNeeded} total engineering hours @ ${devHourlyRate}/hr
            </p>
          </div>

          {/* Card 2: Projected Value Gain */}
          <div className="bg-slate-950 border border-emerald-500/40 p-4 rounded-xl space-y-1">
            <span className="text-[10px] uppercase text-emerald-400 tracking-wider flex items-center gap-1 font-bold">
              <i className="fas fa-arrow-up-right-dots"></i> Projected Valuation Delta
            </span>
            <p className="text-2xl font-extrabold text-emerald-400">
              +${totalProjectedValuationDelta.toLocaleString()} <span className="text-xs font-normal text-emerald-300/70">USD</span>
            </p>
            <p className="text-[10px] text-slate-500 font-sans">
              Target Value: ${totalProjectedValuation.toLocaleString()} USD
            </p>
          </div>

          {/* Card 3: Net Return & ROI % */}
          <div className="bg-slate-950 border border-indigo-500/40 p-4 rounded-xl space-y-1">
            <span className="text-[10px] uppercase text-indigo-400 tracking-wider flex items-center gap-1 font-bold">
              <i className="fas fa-bolt"></i> Return on Investment (ROI)
            </span>
            <p className="text-2xl font-extrabold text-indigo-300">
              +{roiPercentage.toFixed(1)}%
            </p>
            <p className="text-[10px] text-indigo-400/80 font-sans">
              Net Value Gain: +${netProfitGain.toLocaleString()} USD
            </p>
          </div>

          {/* Card 4: Capital Efficiency Ratio */}
          <div className="bg-slate-950 border border-purple-500/40 p-4 rounded-xl space-y-1">
            <span className="text-[10px] uppercase text-purple-400 tracking-wider flex items-center gap-1 font-bold">
              <i className="fas fa-scale-balanced"></i> Capital Efficiency Ratio
            </span>
            <p className="text-2xl font-extrabold text-purple-300">
              {capitalEfficiencyRatio.toFixed(2)}x
            </p>
            <p className="text-[10px] text-purple-400/80 font-sans">
              ${capitalEfficiencyRatio.toFixed(2)} asset value created per $1.00 spent
            </p>
          </div>
        </div>

        {/* Visual Valuation & Investment Growth Bar */}
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-3">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center text-xs font-mono gap-2">
            <span className="text-slate-300 font-bold">
              Baseline vs. Capital Invested vs. Upgraded Value Progression
            </span>
            <span className="text-emerald-400 font-semibold">
              Payback Horizon: ~{paybackMonths > 0 ? paybackMonths.toFixed(1) : 0} Months (from revenue contribution)
            </span>
          </div>

          <div className="w-full bg-slate-900 h-5 rounded-lg overflow-hidden flex font-mono text-[10px] text-white font-bold">
            <div
              style={{
                width: `${totalProjectedValuation > 0 ? Math.min(100, (currentValuationTotal / totalProjectedValuation) * 100) : 30}%`,
              }}
              className="bg-indigo-600 h-full flex items-center justify-center border-r border-slate-950"
              title={`Baseline Value: $${currentValuationTotal.toLocaleString()}`}
            >
              Baseline ${currentValuationTotal.toLocaleString()}
            </div>
            <div
              style={{
                width: `${totalProjectedValuation > 0 ? Math.min(100, (totalDevCapitalCost / totalProjectedValuation) * 100) : 10}%`,
              }}
              className="bg-amber-500 h-full flex items-center justify-center border-r border-slate-950 text-slate-950 font-black"
              title={`Dev Capital: $${totalDevCapitalCost.toLocaleString()}`}
            >
              Dev Cost
            </div>
            <div
              style={{
                width: `${totalProjectedValuation > 0 ? Math.min(100, (netProfitGain / totalProjectedValuation) * 100) : 60}%`,
              }}
              className="bg-emerald-500 h-full flex items-center justify-center text-slate-950 font-black"
              title={`Net Gain: $${netProfitGain.toLocaleString()}`}
            >
              Net Profit Gain +${netProfitGain.toLocaleString()}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-indigo-600 inline-block"></span> Current Baseline Value
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block"></span> Engineering Capital Cost
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block"></span> Pure Net Asset Value Created
            </span>
          </div>
        </div>
      </div>

      {/* Recharts Visual Growth ROI Chart */}
      <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold flex items-center gap-1.5">
                <i className="fas fa-chart-column"></i> Recharts Visualization Engine
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono">
                Current Value vs. Potential Future Value
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <i className="fas fa-chart-line text-emerald-400"></i> Project Growth ROI Visual Graph
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              Visual comparison plotting current baseline asset valuation vs. projected future valuation for all 10 ecosystem projects to demonstrate return on investment.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setChartMode('grouped')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                chartMode === 'grouped'
                  ? 'bg-indigo-600 border-indigo-500 text-white font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Side-by-Side Comparison
            </button>
            <button
              onClick={() => setChartMode('stacked')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                chartMode === 'stacked'
                  ? 'bg-emerald-600 border-emerald-500 text-white font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Stacked Growth Delta
            </button>
          </div>
        </div>

        {/* Chart Container */}
        <div className="h-[400px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={rechartsData}
              margin={{ top: 20, right: 30, left: 10, bottom: 65 }}
            >
              <defs>
                <linearGradient id="currentValGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#312e81" stopOpacity={0.6} />
                </linearGradient>
                <linearGradient id="futureValGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#047857" stopOpacity={0.7} />
                </linearGradient>
                <linearGradient id="deltaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#059669" stopOpacity={0.5} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                interval={0}
                angle={-35}
                textAnchor="end"
                height={70}
              />
              <YAxis
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-950/95 border border-indigo-500/50 p-4 rounded-xl shadow-2xl backdrop-blur-md space-y-2 font-mono text-xs max-w-xs">
                        <div className="border-b border-slate-800 pb-2">
                          <p className="font-extrabold text-white text-sm">{data.fullName}</p>
                          <div className="flex items-center gap-2 text-[10px] text-indigo-400 mt-0.5">
                            <span>{data.category}</span>
                            <span>•</span>
                            <span>{data.platform}</span>
                          </div>
                        </div>

                        <div className="space-y-1.5 pt-1">
                          <div className="flex justify-between items-center text-slate-300">
                            <span>Current Value:</span>
                            <span className="font-bold text-slate-100">${data.currentValue.toLocaleString()} USD</span>
                          </div>

                          <div className="flex justify-between items-center text-emerald-400">
                            <span className="font-semibold">Potential Future Value:</span>
                            <span className="font-bold text-emerald-300">${data.futureValue.toLocaleString()} USD</span>
                          </div>

                          <div className="flex justify-between items-center text-indigo-300 pt-1.5 border-t border-slate-800">
                            <span>Net Value Gain:</span>
                            <span className="font-extrabold text-emerald-400">+${data.valuationDelta.toLocaleString()} (+{data.growthPct}%)</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: '15px', fontSize: '12px', fontFamily: 'monospace' }}
              />
              {chartMode === 'grouped' ? (
                <>
                  <Bar
                    dataKey="currentValue"
                    name="Current Baseline Value ($)"
                    fill="url(#currentValGrad)"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="futureValue"
                    name="Potential Future Value ($)"
                    fill="url(#futureValGrad)"
                    radius={[6, 6, 0, 0]}
                  />
                </>
              ) : (
                <>
                  <Bar
                    dataKey="currentValue"
                    name="Current Baseline Value ($)"
                    stackId="a"
                    fill="url(#currentValGrad)"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="valuationDelta"
                    name="Projected Value Creation ($)"
                    stackId="a"
                    fill="url(#deltaGrad)"
                    radius={[6, 6, 0, 0]}
                  />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Highlight Insights Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs pt-2 border-t border-slate-800">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Highest Growth Multiplier:</span>
            <span className="font-bold text-emerald-400">UniAgent Mesh (+340%)</span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Largest Dollar Value Delta:</span>
            <span className="font-bold text-indigo-300">UniAgent Mesh (+$170k)</span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Average Portfolio ROI:</span>
            <span className="font-bold text-purple-300">+282.8% Growth</span>
          </div>
        </div>
      </div>

      {/* Individual Project Valuation & Improvement Upside Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl print-card">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-semibold">
                Individual Project Financials
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-mono">
                12 Active Builds
              </span>
            </div>
            <h3 className="text-xl font-bold text-white print-text flex items-center gap-2">
              <i className="fas fa-coins text-amber-400"></i> Individual Project Asset Valuation & Growth Potential Breakdown
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Estimated standalone asset valuation for every project in your ecosystem right now vs. potential market value if improved and scaled with target features.
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-indigo-500/30 font-mono text-xs text-right">
            <span className="text-slate-400 text-[10px] uppercase block">All Projects Combined Potential</span>
            <span className="text-emerald-400 font-extrabold text-base">$1,345,000 USD/NZD</span>
          </div>
        </div>

        {/* Valuation Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase border-b border-slate-800">
              <tr>
                <th className="p-3">Project Title & Category</th>
                <th className="p-3">Source & Managed Account</th>
                <th className="p-3 text-right">Current Value</th>
                <th className="p-3 text-right text-emerald-400 font-bold">If Improved Value</th>
                <th className="p-3 text-right text-indigo-400">Potential Upside</th>
                <th className="p-3">Improvement Roadmap & Features</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {[
                {
                  title: 'Resonance Studio Operations Hub',
                  cat: 'SaaS Platform',
                  platform: 'AI Studio',
                  email: 'chris.james378@gmail.com',
                  curr: 45000,
                  impr: 180000,
                  strategy: 'Add Stripe automated billing, enterprise workspace roles, and multi-studio white-labeling.',
                },
                {
                  title: 'PolyBLEP Subtractive Synth Core Engine',
                  cat: 'Synth Engine',
                  platform: 'GitHub',
                  email: 'resonanceaudiolabs@gmail.com',
                  curr: 25000,
                  impr: 85000,
                  strategy: 'Compile to JUCE C++ VST3/AU desktop plugin binaries for Ableton Live, Logic Pro, and FL Studio.',
                },
                {
                  title: 'DX-Matrix 2-Operator FM Synthesizer',
                  cat: 'Synth Engine',
                  platform: 'Vercel',
                  email: 'resonanceaudiolabs@gmail.com',
                  curr: 18000,
                  impr: 65000,
                  strategy: 'Expand to 6-Operator DX7 SysEx patch import and iOS AUv3 mobile plugin store distribution.',
                },
                {
                  title: 'Resonance Studio 32-Step Web DAW',
                  cat: 'DAW Workstation',
                  platform: 'AI Studio',
                  email: 'chris.james378@gmail.com',
                  curr: 35000,
                  impr: 125000,
                  strategy: 'Add MIDI clock sync, WAV/FLAC stem export, and WebRTC real-time multiplayer jam sessions.',
                },
                {
                  title: 'UniAgent Autonomous Multi-Agent Mesh',
                  cat: 'AI Agent & Mesh',
                  platform: 'Emergent',
                  email: 'uniagent.website',
                  curr: 50000,
                  impr: 220000,
                  strategy: 'Monetize API key access on uniagent.website, offer enterprise B2B webhooks, and custom domain models.',
                },
                {
                  title: 'Claude Legal Agreement Generator',
                  cat: 'AI Agent',
                  platform: 'Claude',
                  email: 'resonanceaudiolabs@gmail.com',
                  curr: 20000,
                  impr: 75000,
                  strategy: 'Integrate native DocuSign e-signatures, CRM sync, and automated jurisdiction compliance checks.',
                },
                {
                  title: 'Gemini Multimodal Voice Synthesizer',
                  cat: 'AI Agent',
                  platform: 'Gemini',
                  email: 'chris.james378@gmail.com',
                  curr: 30000,
                  impr: 110000,
                  strategy: 'Add real-time Gemini Live WebSocket audio streaming for live stage parameter modulation.',
                },
                {
                  title: 'Mobile Audio Field Recorder PWA',
                  cat: 'Mobile PWA',
                  platform: 'Vercel',
                  email: 'resonanceaudiolabs@gmail.com',
                  curr: 15000,
                  impr: 55000,
                  strategy: 'Package via Capacitor for Apple App Store & Google Play listing with cloud audio sample sync.',
                },
                {
                  title: 'Client Onboarding & License Commerce',
                  cat: 'SaaS Platform',
                  platform: 'Vercel',
                  email: 'chris.james378@gmail.com',
                  curr: 40000,
                  impr: 150000,
                  strategy: 'Enable white-label audio studio portal licenses, affiliate payouts, and key servers.',
                },
                {
                  title: 'Resonance Microservice Edge API Router',
                  cat: 'Utility & API',
                  platform: 'GitHub',
                  email: 'uniagent.website',
                  curr: 12000,
                  impr: 45000,
                  strategy: 'Deploy global Cloudflare Worker edge nodes with rate-limiting billing analytics.',
                },
              ].map((row, idx) => {
                const gain = row.impr - row.curr;
                const gainPct = ((gain / row.curr) * 100).toFixed(0);

                return (
                  <tr key={idx} className="hover:bg-slate-950/40">
                    <td className="p-3">
                      <div className="font-bold text-white">{row.title}</div>
                      <div className="text-[10px] text-slate-400 font-sans">{row.cat}</div>
                    </td>
                    <td className="p-3 font-sans">
                      <div className="text-slate-200 font-bold">{row.platform}</div>
                      <div className="text-[10px] text-indigo-400 font-mono">{row.email}</div>
                    </td>
                    <td className="p-3 text-right font-bold text-slate-200">${row.curr.toLocaleString()}</td>
                    <td className="p-3 text-right font-bold text-emerald-400">${row.impr.toLocaleString()}</td>
                    <td className="p-3 text-right font-bold text-indigo-300">
                      +${gain.toLocaleString()} <span className="text-[10px] text-emerald-400 font-normal">({gainPct}%)</span>
                    </td>
                    <td className="p-3 font-sans text-slate-300 text-[11px] leading-relaxed max-w-xs">
                      {row.strategy}
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* Combined Grand Totals Row */}
            <tfoot className="bg-slate-950 border-t-2 border-indigo-500/40 font-mono text-xs">
              <tr className="font-extrabold">
                <td className="p-4 text-white text-sm" colSpan={2}>
                  <i className="fas fa-calculator text-indigo-400 mr-2"></i>
                  COMBINED GRAND TOTAL (ALL 12 PROJECTS)
                </td>
                <td className="p-4 text-right text-white text-sm">
                  $356,000
                </td>
                <td className="p-4 text-right text-emerald-400 text-sm">
                  $1,345,000
                </td>
                <td className="p-4 text-right text-indigo-300 text-sm">
                  +$989,000 <span className="text-xs font-normal text-emerald-400">(+277.8%)</span>
                </td>
                <td className="p-4 font-sans text-[11px] text-slate-400 font-normal">
                  Total portfolio asset valuation scaling from baseline to fully upgraded roadmap state across all 12 active builds.
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </section>
  );
};
