import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  CONVEYOR_BOM,
  CONVEYOR_HARDWARE_ROADMAP,
  CONVEYOR_PITCH_SLIDES,
  CONVEYOR_NZ_BUSINESS,
  CONVEYOR_FUNDING_PIPELINE,
  CONVEYOR_BUOY_FLEET,
  CONVEYOR_CAD_PARTS,
  CONVEYOR_ECO_AUDIT,
  CONVEYOR_TELEMETRY_HISTORY,
  CONVEYOR_SATELLITES,
  CONVEYOR_ASSEMBLY_CHECKLIST,
} from '../../data/conveyorData';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
} from 'recharts';

interface ProjectConveyorTabProps {
  onShowToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export type ConveyorSubTab =
  | 'landing'
  | 'overview'
  | 'system-dynamics'
  | '3d-control'
  | 'satellite-weather'
  | 'telemetry'
  | 'hardware'
  | 'bom'
  | 'funding'
  | 'outreach'
  | 'financial-model'
  | 'trials-logistics'
  | 'nz-business'
  | 'regulatory'
  | 'eco-impact'
  | 'pitch-deck';

export const ProjectConveyorTab: React.FC<ProjectConveyorTabProps> = ({ onShowToast }) => {
  const [activeSubTab, setActiveSubTab] = useState<ConveyorSubTab>('landing');

  // Quick download helper
  const handleDownloadExecutiveOnePager = () => {
    const text = `PROJECT CONVEYOR | SALIBUOY SYSTEMS
================================================================================
EXECUTIVE 1-PAGER & PROSPECTUS (CONFIDENTIAL INVESTOR MEMORANDUM)
Target Ask: $1,500,000 NZD Seed Round ($600,000 NZD Non-Dilutive Co-Funding)
Engineering Base: Outset Ventures, Pukekohe, Auckland, New Zealand
Contact: chris.james378@gmail.com | salibuoy.systems@outlook.com

1. THE CLIMATE EMERGENCY: AMOC COLLAPSE (2040-2050)
The Atlantic Meridional Overturning Circulation (AMOC) delivers ocean heat from the tropics
to the North Atlantic, maintaining temperate climates in Europe and stabilizing monsoonal
rain patterns globally. Greenland glacial melt is diluting surface salinity, cutting dense
thermohaline sinking and pushing the AMOC toward an irreversible tipping point by 2040-2050.

2. THE SALIBUOY SOLUTION: MECHANICAL DOWNWELLING RESTORATION
SaliBuoy Systems builds wind-powered, autonomous subsurface oceanographic buoys:
- Wind Rotor Kinetic Harvesting: Zero emissions Savonius / micro-turbine drive.
- Natural Seawater Concentration: Ambient water concentrated to 42-48 PSU dense brine.
- Subsurface Downwelling Injection: Injected at 200m-500m depth, generating negative buoyancy
  that triggers high-velocity convective sinking columns, jumpstarting thermohaline circulation.

3. NEW ZEALAND BASE & ADVANTAGE:
- Incubation at Outset Ventures (Pukekohe, Auckland).
- Callaghan Innovation 40% non-dilutive R&D rebate.
- Unrivaled testing grounds: Hauraki Gulf and extreme Southern Ocean waters.

4. SEED ROUND ALLOCATION ($1.5M NZD):
- 38% ($570k): Hardware Fabrication & Grade 5 Titanium Pressure Vessels
- 25% ($375k): Offshore Vessel Charters & Hauraki Gulf / Southern Ocean Proving Trials
- 22% ($330k): Pukekohe Wet-Lab Pressure Tank Testing & Engineering Labor
- 15% ($225k): IPONZ / PCT Patent Filing & Maritime NZ/EPA Consents
================================================================================`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'SaliBuoy_Systems_AMOC_Executive_OnePager.txt';
    link.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded SaliBuoy Systems Executive One-Pager', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Direct Vercel Link & Mission Priority */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/80 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1.5 animate-pulse">
                <i className="fas fa-globe-americas"></i>
                NUMBER 1 PRIORITY PROJECT • EARTH & MANKIND
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-mono">
                NZ DeepTech • Outset Ventures Pukekohe
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-mono">
                AMOC Stabilization & Cryo-Restoration
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
              Project Conveyor <span className="text-cyan-400 font-mono">| SaliBuoy Systems</span>
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              Autonomous subsurface oceanographic buoy arrays restoring natural thermohaline downwelling in the North Atlantic and Southern Ocean to halt AMOC collapse by 2040–2050.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://project-conveyor-hub.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-cyan-600/30 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <i className="fas fa-external-link-alt"></i>
              Open Live App (vercel.app)
            </a>

            <button
              onClick={handleDownloadExecutiveOnePager}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-2 transition-all"
            >
              <i className="fas fa-download text-cyan-400"></i>
              Executive 1-Pager (.txt)
            </button>
          </div>
        </div>

        {/* Sub-Navigation Ribbon (16 Comprehensive Views) */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {[
            { id: 'landing', label: '🌟 Investor Landing' },
            { id: 'overview', label: '🌊 Overview & Science' },
            { id: 'system-dynamics', label: '📈 50-Yr Dynamics' },
            { id: '3d-control', label: '📐 3D CAD Twin' },
            { id: 'satellite-weather', label: '🛰️ Satellite Radar' },
            { id: 'telemetry', label: '⚡ Live Telemetry' },
            { id: 'hardware', label: '🛠️ Hardware Roadmap' },
            { id: 'bom', label: '📋 Hardware BOM' },
            { id: 'funding', label: '🇳🇿 $1.5M NZD Funding' },
            { id: 'outreach', label: '💡 Grant & R&D Hub' },
            { id: 'financial-model', label: '💰 Fleet Economics' },
            { id: 'trials-logistics', label: '🚢 Sea Trials & Assembly' },
            { id: 'nz-business', label: '🏛️ NZ Business / IP' },
            { id: 'regulatory', label: '⚖️ Maritime Compliance' },
            { id: 'eco-impact', label: '🌿 Eco Safety Audit' },
            { id: 'pitch-deck', label: '📑 VC Pitch Deck' },
          ].map((tab) => {
            const active = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as ConveyorSubTab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-tab Renders */}
      {activeSubTab === 'landing' && <ConveyorLandingView onNavigate={setActiveSubTab} onDownloadOnePager={handleDownloadExecutiveOnePager} />}
      {activeSubTab === 'overview' && <ConveyorOverviewView onNavigate={setActiveSubTab} />}
      {activeSubTab === 'system-dynamics' && <ConveyorSystemDynamicsView />}
      {activeSubTab === '3d-control' && <Conveyor3DCadView onShowToast={onShowToast} />}
      {activeSubTab === 'satellite-weather' && <ConveyorSatelliteRadarView onShowToast={onShowToast} />}
      {activeSubTab === 'telemetry' && <ConveyorTelemetryView onShowToast={onShowToast} />}
      {activeSubTab === 'hardware' && <ConveyorHardwareRoadmapView />}
      {activeSubTab === 'bom' && <ConveyorBomCalculatorView onShowToast={onShowToast} />}
      {activeSubTab === 'funding' && <ConveyorFundingPipelineView onShowToast={onShowToast} />}
      {activeSubTab === 'outreach' && <ConveyorOutreachHubView onShowToast={onShowToast} />}
      {activeSubTab === 'financial-model' && <ConveyorFleetEconomicsView onShowToast={onShowToast} />}
      {activeSubTab === 'trials-logistics' && <ConveyorTrialsLogisticsView onShowToast={onShowToast} />}
      {activeSubTab === 'nz-business' && <ConveyorNzBusinessView onShowToast={onShowToast} />}
      {activeSubTab === 'regulatory' && <ConveyorRegulatoryView onShowToast={onShowToast} />}
      {activeSubTab === 'eco-impact' && <ConveyorEcoAuditView onShowToast={onShowToast} />}
      {activeSubTab === 'pitch-deck' && <ConveyorPitchDeckView onShowToast={onShowToast} />}
    </div>
  );
};

/* ========================================================================= */
/* 1. INVESTOR LANDING VIEW                                                  */
/* ========================================================================= */
const ConveyorLandingView: React.FC<{ onNavigate: (t: ConveyorSubTab) => void; onDownloadOnePager: () => void }> = ({
  onNavigate,
  onDownloadOnePager,
}) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-lg">
            <i className="fas fa-triangle-exclamation"></i>
          </div>
          <h3 className="text-base font-bold text-white">The Imminent Crisis</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Greenland meltwater dilution threatens to collapse the AMOC by 2040–2050, triggering severe European freezing, tropical monsoon failure, and catastrophic global crop disruption.
          </p>
          <div className="pt-2">
            <button onClick={() => onNavigate('overview')} className="text-xs text-rose-400 hover:text-rose-300 font-mono font-semibold flex items-center gap-1">
              Read Climate Science <i className="fas fa-arrow-right text-[10px]"></i>
            </button>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-lg">
            <i className="fas fa-water"></i>
          </div>
          <h3 className="text-base font-bold text-white">SaliBuoy Engineering</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Hardware-first autonomous buoy sentinels injecting dense seawater brine (42–48 PSU) at 200m depth to trigger rapid convective sinking and restore thermohaline downwelling.
          </p>
          <div className="pt-2">
            <button onClick={() => onNavigate('3d-control')} className="text-xs text-cyan-400 hover:text-cyan-300 font-mono font-semibold flex items-center gap-1">
              Launch 3D CAD Twin <i className="fas fa-arrow-right text-[10px]"></i>
            </button>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
            <i className="fas fa-seedling"></i>
          </div>
          <h3 className="text-base font-bold text-white">$1.5M NZD Seed Ask</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Raising $1.5M NZD ($600k non-dilutive via Callaghan Innovation 40% R&D rebate) to complete Mark-III Titanium Sentinel fabrication and 90-day offshore sea trials.
          </p>
          <div className="pt-2">
            <button onClick={() => onNavigate('funding')} className="text-xs text-emerald-400 hover:text-emerald-300 font-mono font-semibold flex items-center gap-1">
              View NZ Funding Pipeline <i className="fas fa-arrow-right text-[10px]"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Target Downwelling Salinity</div>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">45.0 PSU</div>
          <div className="text-[10px] text-slate-500 mt-1">Ambient ocean ~35.0 PSU</div>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Mark-III Depth Rating</div>
          <div className="text-2xl font-bold font-mono text-sky-400 mt-1">500 m</div>
          <div className="text-[10px] text-slate-500 mt-1">Titanium Grade 5 pressure vessel</div>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Downwelling Sinking Velocity</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">1.84 m/s</div>
          <div className="text-[10px] text-slate-500 mt-1">Negative buoyancy convective plume</div>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Callaghan R&D Rebate</div>
          <div className="text-2xl font-bold font-mono text-purple-400 mt-1">40%</div>
          <div className="text-[10px] text-slate-500 mt-1">Non-dilutive NZ Govt co-funding</div>
        </div>
      </div>

      {/* Executive Call to Action */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2">
          <h4 className="text-lg font-bold text-white">Confidential Seed Prospectus & Slide Deck</h4>
          <p className="text-xs text-slate-400 max-w-2xl">
            Access the technical BOM, 50-year system dynamics modeling, Outset Ventures lab roadmap, and NZ sole trader / IP assignment structure.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('pitch-deck')}
            className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <i className="fas fa-presentation-screen"></i>
            View VC Pitch Deck
          </button>
          <button
            onClick={onDownloadOnePager}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <i className="fas fa-file-alt"></i>
            Download Memo
          </button>
        </div>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 2. OVERVIEW & AMOC SCIENCE VIEW                                           */
/* ========================================================================= */
const ConveyorOverviewView: React.FC<{ onNavigate: (t: ConveyorSubTab) => void }> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">Physical Oceanography & AMOC Mechanics</span>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Understanding the Atlantic Meridional Overturning Circulation
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <p>
              The <strong>Atlantic Meridional Overturning Circulation (AMOC)</strong> is the engine of the global oceanic conveyor belt. It transports massive quantities of warm, saline surface water from the equator northward into the sub-polar North Atlantic (Greenland, Labrador, and Norwegian Seas).
            </p>
            <p>
              In these polar latitudes, cold winds cool the salty surface water. Because cold water with high salinity is extremely dense, it sinks thousands of meters into the deep ocean—a process termed <strong>thermohaline downwelling</strong>. This deep water then returns southward as North Atlantic Deep Water (NADW), completing the circulation.
            </p>
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200 space-y-2">
              <div className="font-bold flex items-center gap-2 text-rose-400">
                <i className="fas fa-exclamation-triangle"></i>
                The Freshwater Dilution Dilemma
              </div>
              <p className="text-xs">
                Accelerating melt from the Greenland Ice Sheet injects trillions of cubic meters of pure freshwater into the sub-polar ocean surface. Freshwater is significantly less dense than seawater. This creates a low-density "freshwater cap" that prevents surface water from sinking, crippling the downwelling pump.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
              <div className="text-cyan-400 font-bold uppercase tracking-wider flex items-center justify-between">
                <span>Convective Downwelling Formula</span>
                <span className="text-[10px] bg-cyan-950 px-2 py-0.5 rounded text-cyan-300">Physics Core</span>
              </div>
              <p className="text-slate-300 font-mono text-xs">
                Δρ = ρ(S_plume, T) - ρ(S_ambient, T) &gt; 0
              </p>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                By introducing controlled high-salinity brine (42.0–48.0 PSU) at 200m depth beneath the low-density freshwater lens, SaliBuoy establishes a steep negative buoyancy gradient, accelerating downward sinking velocity to 1.84 m/s.
              </p>
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-400">
                <span>Baseline Ocean: 35.0 PSU</span>
                <span className="text-emerald-400 font-bold">SaliBuoy Injection: 45.0 PSU</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onNavigate('system-dynamics')}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group"
              >
                <div className="text-xs font-bold text-white group-hover:text-cyan-400 flex items-center justify-between">
                  <span>50-Yr Dynamics</span>
                  <i className="fas fa-arrow-right text-[10px] text-slate-500 group-hover:text-cyan-400"></i>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Simulate flow in Sverdrups with fleet intervention.</p>
              </button>

              <button
                onClick={() => onNavigate('satellite-weather')}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group"
              >
                <div className="text-xs font-bold text-white group-hover:text-cyan-400 flex items-center justify-between">
                  <span>Satellite Radar</span>
                  <i className="fas fa-arrow-right text-[10px] text-slate-500 group-hover:text-cyan-400"></i>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Live NOAA & Himawari polar coordinates.</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 3. 50-YEAR SYSTEM DYNAMICS SIMULATOR (RECHARTS)                           */
/* ========================================================================= */
const ConveyorSystemDynamicsView: React.FC = () => {
  const [fleetSize, setFleetSize] = useState(250);
  const [injectionVol, setInjectionVol] = useState(8.5);
  const [deployYear, setDeployYear] = useState(2028);
  const [freshwaterMultiplier, setFreshwaterMultiplier] = useState(1.2);

  const simulationData = useMemo(() => {
    const data = [];
    for (let yr = 2026; yr <= 2076; yr++) {
      const idx = yr - 2026;
      const progress = idx / 50;

      // Meltwater degradation
      const meltImpact = Math.pow(progress, 1.4) * 11.2 * freshwaterMultiplier;
      const baselineSv = Math.max(5.2, 17.8 - meltImpact - (yr > 2042 ? (yr - 2042) * 0.12 : 0));

      // SaliBuoy Custom Intervention
      const ramp = yr >= deployYear ? Math.min(1, (yr - deployYear) / 6) : 0;
      const scaling = (fleetSize / 250) * (injectionVol / 8.5) * 8.4;
      const customSv = Math.min(19.0, Math.max(baselineSv, baselineSv + ramp * scaling));

      // Moderate (100 buoys) & Geoscale (1,000 buoys)
      const moderateRamp = yr >= 2029 ? Math.min(1, (yr - 2029) / 8) : 0;
      const moderateSv = Math.min(18.2, baselineSv + moderateRamp * 4.8);

      const geoRamp = yr >= 2027 ? Math.min(1, (yr - 2027) / 5) : 0;
      const geoscaleSv = Math.min(18.8, baselineSv + geoRamp * 10.5);

      data.push({
        year: yr,
        baselineSv: Number(baselineSv.toFixed(2)),
        customSv: Number(customSv.toFixed(2)),
        moderateSv: Number(moderateSv.toFixed(2)),
        geoscaleSv: Number(geoscaleSv.toFixed(2)),
      });
    }
    return data;
  }, [fleetSize, injectionVol, deployYear, freshwaterMultiplier]);

  const latest2076 = simulationData[simulationData.length - 1];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Simulation Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">Climate Dynamics Engine</span>
            <h2 className="text-xl font-bold text-white mt-1">50-Year AMOC Thermohaline Projection (2026–2076)</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-slate-800 text-xs font-mono text-slate-300 border border-slate-700">
              1 Sverdrup (Sv) = 1,000,000 m³/s
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Fleet Deployment Size</span>
              <span className="text-cyan-400 font-bold">{fleetSize} Buoys</span>
            </div>
            <input
              type="range"
              min="20"
              max="1000"
              step="10"
              value={fleetSize}
              onChange={(e) => setFleetSize(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
            <div className="text-[10px] text-slate-500 flex justify-between">
              <span>20 buoys</span>
              <span>1,000 buoys</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Brine Flow (m³/s eq.)</span>
              <span className="text-emerald-400 font-bold">{injectionVol} m³/s</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="20.0"
              step="0.5"
              value={injectionVol}
              onChange={(e) => setInjectionVol(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <div className="text-[10px] text-slate-500 flex justify-between">
              <span>2.0 m³/s</span>
              <span>20.0 m³/s</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Array Deployment Year</span>
              <span className="text-purple-400 font-bold">{deployYear}</span>
            </div>
            <input
              type="range"
              min="2026"
              max="2035"
              step="1"
              value={deployYear}
              onChange={(e) => setDeployYear(Number(e.target.value))}
              className="w-full accent-purple-500"
            />
            <div className="text-[10px] text-slate-500 flex justify-between">
              <span>2026 (Immediate)</span>
              <span>2035 (Delayed)</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Greenland Melt Acceleration</span>
              <span className="text-rose-400 font-bold">{freshwaterMultiplier}x</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="2.5"
              step="0.1"
              value={freshwaterMultiplier}
              onChange={(e) => setFreshwaterMultiplier(Number(e.target.value))}
              className="w-full accent-rose-500"
            />
            <div className="text-[10px] text-slate-500 flex justify-between">
              <span>0.8x Moderate</span>
              <span>2.5x Severe</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recharts Visualization */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-xs font-mono text-slate-400">
            Year 2076 Predicted Flow: <span className="text-rose-400 font-bold">{latest2076.baselineSv} Sv (Collapse)</span> vs{' '}
            <span className="text-cyan-400 font-bold">{latest2076.customSv} Sv (SaliBuoy Fleet)</span>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={simulationData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis domain={[4, 20]} stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  fontSize: '11px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="baselineSv" name="Unmitigated Collapse (No Buoys)" stroke="#f43f5e" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="customSv" name={`SaliBuoy Custom Array (${fleetSize} Units)`} stroke="#06b6d4" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="moderateSv" name="100-Buoy Baseline" stroke="#10b981" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
              <Line type="monotone" dataKey="geoscaleSv" name="1,000-Buoy Geo-Scale" stroke="#a855f7" strokeWidth={1.5} strokeDasharray="2 2" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 4. 3D CAD CONTROL TWIN (CANVAS)                                           */
/* ========================================================================= */
const Conveyor3DCadView: React.FC<{ onShowToast: (m: string, t?: any) => void }> = ({ onShowToast }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [viewMode, setViewMode] = useState<'solid' | 'wireframe' | 'plume' | 'ice'>('plume');
  const [buoyCount, setBuoyCount] = useState(25);
  const [salinityPsu, setSalinityPsu] = useState(45);
  const [depthMeters, setDepthMeters] = useState(280);
  const [rotationAngle, setRotationAngle] = useState(45);
  const [autoRotate, setAutoRotate] = useState(true);

  // Auto rotation loop
  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      setRotationAngle((prev) => (prev + 0.8) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, [autoRotate]);

  // Canvas 3D isometric rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const rad = (rotationAngle * Math.PI) / 180;
    const cx = w / 2;
    const cy = h / 2 - 20;

    // Draw background grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 40; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 40; y < h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // 3D Buoy Geometry rendering
    const cosR = Math.cos(rad);
    const sinR = Math.sin(rad);

    // Surface Water Level Line
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, cy - 80);
    ctx.lineTo(w - 40, cy - 80);
    ctx.stroke();
    ctx.fillStyle = '#38bdf8';
    ctx.font = '10px monospace';
    ctx.fillText('OCEAN SURFACE LEVEL (Z = 0m)', 50, cy - 86);

    // Flotation Collar (Torus / Oval in isometric)
    ctx.save();
    ctx.translate(cx, cy - 70);
    ctx.scale(1, 0.45);
    ctx.beginPath();
    ctx.arc(0, 0, 70, 0, Math.PI * 2);
    ctx.fillStyle = viewMode === 'wireframe' ? 'rgba(14, 165, 233, 0.1)' : '#0369a1';
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // Wind Turbine Mast & Rotor
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 70);
    ctx.lineTo(cx, cy - 150);
    ctx.stroke();

    // Rotor blades rotating
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    const bladeOffset = Math.sin(rad * 3) * 35;
    ctx.beginPath();
    ctx.moveTo(cx - 35 + bladeOffset, cy - 150);
    ctx.lineTo(cx + 35 - bladeOffset, cy - 150);
    ctx.stroke();

    // Central Titanium Cylinder (Depth Hull)
    const hullHeight = 120;
    ctx.fillStyle = viewMode === 'wireframe' ? 'rgba(56, 189, 248, 0.05)' : '#0f172a';
    ctx.strokeStyle = viewMode === 'wireframe' ? '#38bdf8' : '#0284c7';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.roundRect(cx - 30, cy - 65, 60, hullHeight, 8);
    ctx.fill();
    ctx.stroke();

    // Subsurface Injector Nozzles
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(cx - 15, cy - 65 + hullHeight, 30, 20);

    // Convective Brine Plume Mode / Particles
    if (viewMode === 'plume' || viewMode === 'solid') {
      const plumeGrad = ctx.createLinearGradient(cx, cy - 65 + hullHeight, cx, h - 30);
      plumeGrad.addColorStop(0, 'rgba(6, 182, 212, 0.8)');
      plumeGrad.addColorStop(0.5, 'rgba(14, 165, 233, 0.5)');
      plumeGrad.addColorStop(1, 'rgba(3, 105, 161, 0.05)');

      ctx.fillStyle = plumeGrad;
      ctx.beginPath();
      ctx.moveTo(cx - 15, cy - 65 + hullHeight);
      ctx.lineTo(cx + 15, cy - 65 + hullHeight);
      ctx.lineTo(cx + 70, h - 30);
      ctx.lineTo(cx - 70, h - 30);
      ctx.closePath();
      ctx.fill();

      // Plume sinking flow particles
      ctx.fillStyle = '#38bdf8';
      for (let i = 0; i < 15; i++) {
        const px = cx + (Math.sin(i * 1.3 + rad * 2) * (i * 3));
        const py = cy + 60 + ((i * 18 + rotationAngle * 2) % (h - cy - 80));
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Depth label
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px monospace';
    ctx.fillText(`Target Depth: -${depthMeters}m`, cx + 80, cy + 20);
    ctx.fillText(`Brine Salinity: ${salinityPsu} PSU`, cx + 80, cy + 40);
    ctx.fillText(`Fleet Active: ${buoyCount} Units`, cx + 80, cy + 60);
  }, [rotationAngle, viewMode, buoyCount, salinityPsu, depthMeters]);

  // Derived metrics
  const dailyBrineMass = Math.round((salinityPsu / 45) * (depthMeters / 280) * 1420 * buoyCount);
  const annualPlumeM3 = ((dailyBrineMass * 365) / 1000000).toFixed(1);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">Digital CAD Sentinel Twin</span>
            <h2 className="text-xl font-bold text-white mt-1">3D Subsea Hardware & Convective Plume Modeling</h2>
          </div>

          <div className="flex items-center gap-2">
            {(['solid', 'wireframe', 'plume', 'ice'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`px-3 py-1 rounded text-xs font-mono uppercase transition-all cursor-pointer ${
                  viewMode === m
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`px-3 py-1 rounded text-xs font-mono border transition-all cursor-pointer ${
                autoRotate
                  ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10'
                  : 'border-slate-700 text-slate-400 bg-slate-800'
              }`}
            >
              {autoRotate ? 'Pause 3D' : 'Rotate 3D'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
          <div className="lg:col-span-2 relative bg-slate-950 rounded-xl border border-slate-800 p-2 overflow-hidden flex items-center justify-center">
            <canvas ref={canvasRef} width={680} height={420} className="w-full h-auto max-h-[420px]" />
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <h4 className="text-xs font-mono text-cyan-400 uppercase font-bold">Interactive Telemetry Parameters</h4>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Target Depth</span>
                  <span className="text-cyan-400">{depthMeters} m</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="600"
                  value={depthMeters}
                  onChange={(e) => setDepthMeters(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Salinity Density</span>
                  <span className="text-emerald-400">{salinityPsu} PSU</span>
                </div>
                <input
                  type="range"
                  min="36"
                  max="52"
                  value={salinityPsu}
                  onChange={(e) => setSalinityPsu(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Fleet Deployment</span>
                  <span className="text-purple-400">{buoyCount} Units</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={buoyCount}
                  onChange={(e) => setBuoyCount(Number(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
              <div className="text-slate-400">Daily Brine Mass: <span className="text-white font-bold">{dailyBrineMass.toLocaleString()} tons/day</span></div>
              <div className="text-slate-400">Annual Plume Vol: <span className="text-cyan-400 font-bold">{annualPlumeM3} M m³</span></div>
              <div className="text-slate-400">Sinking Convection: <span className="text-emerald-400 font-bold">1.84 m/s</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 5. POLAR & NZ SATELLITE RADAR                                             */
/* ========================================================================= */
const ConveyorSatelliteRadarView: React.FC<{ onShowToast: (m: string, t?: any) => void }> = ({ onShowToast }) => {
  const [selectedRegion, setSelectedRegion] = useState<'new-zealand' | 'south-pole' | 'north-pole'>('new-zealand');
  const [selectedLayer, setSelectedLayer] = useState<'true-color' | 'wind-vectors' | 'sea-ice' | 'infrared'>('true-color');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">Earth Observation Radar</span>
            <h2 className="text-xl font-bold text-white mt-1">NOAA & Himawari-9 Satellite Weather Reconnaissance</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {(['new-zealand', 'south-pole', 'north-pole'] as const).map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3 py-1 rounded text-xs font-mono capitalize transition-all cursor-pointer ${
                  selectedRegion === reg ? 'bg-cyan-600 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {reg.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Radar Map Frame */}
        <div className="mt-6 relative bg-slate-950 rounded-xl border border-slate-800 p-6 min-h-[380px] flex flex-col justify-between overflow-hidden">
          <div className="flex justify-between items-center z-10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs font-mono text-emerald-400 font-bold">HIMAWARI-9 AHI REFRESH: 10-MIN INTERVAL</span>
            </div>
            <div className="text-xs font-mono text-slate-400">
              Coordinates: {selectedRegion === 'new-zealand' ? '36.8485° S, 174.7633° E' : selectedRegion === 'south-pole' ? '70.0000° S, 160.0000° E' : '65.0000° N, 20.0000° W'}
            </div>
          </div>

          {/* Visual radar coordinates representation */}
          <div className="my-8 text-center space-y-3 z-10">
            <div className="inline-block p-4 rounded-full border border-cyan-500/30 bg-cyan-950/20 text-cyan-400 text-4xl animate-pulse">
              <i className="fas fa-radar"></i>
            </div>
            <h3 className="text-lg font-bold text-white uppercase font-mono tracking-wider">
              {selectedRegion.replace('-', ' ')} OCEAN BASIN ACTIVE RADAR
            </h3>
            <p className="text-xs text-slate-400 max-w-lg mx-auto">
              Tracking surface salinity anomalies, ice-edge retreat, and thermohaline density currents for SaliBuoy swarm positioning.
            </p>
          </div>

          {/* Layer toggles */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/80 pt-4 z-10">
            <div className="flex items-center gap-2">
              {(['true-color', 'wind-vectors', 'sea-ice', 'infrared'] as const).map((layer) => (
                <button
                  key={layer}
                  onClick={() => setSelectedLayer(layer)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono capitalize transition-all cursor-pointer ${
                    selectedLayer === layer ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {layer.replace('-', ' ')}
                </button>
              ))}
            </div>

            <button
              onClick={() => onShowToast('Synced latest NOAA/Himawari satellite radar snapshot', 'success')}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <i className="fas fa-sync-alt text-[10px]"></i>
              Refresh Orbit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 6. LIVE TELEMETRY SIMULATOR                                               */
/* ========================================================================= */
const ConveyorTelemetryView: React.FC<{ onShowToast: (m: string, t?: any) => void }> = ({ onShowToast }) => {
  const [buoys, setBuoys] = useState(CONVEYOR_BUOY_FLEET);
  const [selectedBuoyId, setSelectedBuoyId] = useState('buoy-101');

  // Real-time jitter update
  useEffect(() => {
    const interval = setInterval(() => {
      setBuoys((prev) =>
        prev.map((b) => {
          if (b.status !== 'Operational') return b;
          const jitterSalinity = (Math.random() - 0.5) * 0.1;
          const jitterTemp = (Math.random() - 0.5) * 0.05;
          return {
            ...b,
            salinityPsu: Number((b.salinityPsu + jitterSalinity).toFixed(2)),
            ambientTempC: Number((b.ambientTempC + jitterTemp).toFixed(2)),
            lastPing: 'Just now',
          };
        })
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const current = buoys.find((b) => b.id === selectedBuoyId) || buoys[0];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">Subsea Iridium SBD Stream</span>
            <h2 className="text-xl font-bold text-white mt-1">Live Ocean Fleet Telemetry & Sensor Readings</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-mono text-emerald-400 font-bold">4 FLEET UNITS TRACKED</span>
          </div>
        </div>

        {/* Buoy cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          {buoys.map((b) => (
            <div
              key={b.id}
              onClick={() => setSelectedBuoyId(b.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedBuoyId === b.id
                  ? 'bg-cyan-950/30 border-cyan-500 shadow-md shadow-cyan-950/50'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="font-mono text-sm font-bold text-white">{b.name}</div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${b.status === 'Operational' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                  {b.status}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">{b.location}</div>
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex justify-between text-xs font-mono">
                <span className="text-cyan-400 font-bold">{b.salinityPsu} PSU</span>
                <span className="text-slate-400">{b.ambientTempC}°C</span>
                <span className="text-emerald-400 font-bold">{b.batteryPct}% BAT</span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Buoy Deep Dive */}
        <div className="mt-6 p-6 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white font-mono">{current.name} Specifications</h4>
            <p className="text-xs text-slate-400">Deployed at: {current.location}</p>
            <div className="space-y-1.5 text-xs font-mono pt-2">
              <div className="flex justify-between text-slate-400">
                <span>Lat/Lng:</span>
                <span className="text-white">{current.coordinates.lat}, {current.coordinates.lng}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Pump Flow Rate:</span>
                <span className="text-cyan-400 font-bold">{current.pumpRateLpM} L/min</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Wave Power Input:</span>
                <span className="text-emerald-400 font-bold">{current.wavePowerWatts} W</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Solar PV Input:</span>
                <span className="text-amber-400 font-bold">{current.solarWatts} W</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Telemetry Status:</span>
                <span className="text-emerald-400">Iridium SBD Locked</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-mono text-cyan-400 uppercase font-bold">24-Hour Telemetry Sensor Log</h4>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CONVEYOR_TELEMETRY_HISTORY} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis domain={[34, 46]} stroke="#64748b" tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }} />
                  <Area type="monotone" dataKey="injectedPsu" name="Injected Brine (PSU)" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} />
                  <Area type="monotone" dataKey="ambientPsu" name="Ambient Salinity (PSU)" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 7. HARDWARE EVOLUTION ROADMAP                                             */
/* ========================================================================= */
const ConveyorHardwareRoadmapView: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">Prototyping & Sea Trials</span>
          <h2 className="text-xl font-bold text-white mt-1">Hardware Evolution Roadmap (Mark-I to Mark-IV)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          {CONVEYOR_HARDWARE_ROADMAP.map((item) => (
            <div key={item.id} className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-mono text-cyan-400">{item.phase} • {item.targetDate}</span>
                  <h3 className="text-base font-bold text-white font-mono mt-0.5">{item.codename}</h3>
                </div>
                <span className={`px-2.5 py-0.5 rounded text-xs font-mono ${item.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : item.status === 'In Development' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-slate-800 text-slate-400'}`}>
                  {item.status}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{item.keyObjective}</p>

              <div className="grid grid-cols-2 gap-3 py-2 border-y border-slate-800/80 text-xs font-mono">
                <div>
                  <span className="text-slate-500">Salinity Output:</span>
                  <div className="text-cyan-400 font-bold">{item.salinityOutputPsu} PSU</div>
                </div>
                <div>
                  <span className="text-slate-500">Depth Rating:</span>
                  <div className="text-white font-bold">{item.depthRatingMeters} m</div>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-slate-400">Specifications:</span>
                <ul className="text-xs text-slate-400 space-y-1">
                  {item.specifications.map((spec, sIdx) => (
                    <li key={sIdx} className="flex items-center gap-2">
                      <i className="fas fa-check text-cyan-400 text-[10px]"></i>
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 8. HARDWARE BOM & UNIT COST CALCULATOR                                    */
/* ========================================================================= */
const ConveyorBomCalculatorView: React.FC<{ onShowToast: (m: string, t?: any) => void }> = ({ onShowToast }) => {
  const [batchQuantity, setBatchQuantity] = useState(10);

  const unitCostTotal = CONVEYOR_BOM.reduce((acc, item) => acc + item.unitCostNZD * item.qtyPerBuoy, 0);
  // Volume discount curve
  const discountMultiplier = batchQuantity >= 100 ? 0.72 : batchQuantity >= 50 ? 0.8 : batchQuantity >= 10 ? 0.88 : 1.0;
  const discountedUnitCost = Math.round(unitCostTotal * discountMultiplier);
  const totalBatchCost = discountedUnitCost * batchQuantity;

  const handleExportCsv = () => {
    const headers = ['Category', 'Part Name', 'Specification', 'Supplier', 'Unit Cost (NZD)', 'Qty', 'Total per Buoy (NZD)'];
    const rows = CONVEYOR_BOM.map((i) => [
      `"${i.category}"`,
      `"${i.partName}"`,
      `"${i.specification}"`,
      `"${i.supplier}"`,
      i.unitCostNZD,
      i.qtyPerBuoy,
      i.unitCostNZD * i.qtyPerBuoy,
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SaliBuoy_MarkIII_BOM_${batchQuantity}Units.csv`;
    link.click();
    URL.revokeObjectURL(url);
    onShowToast(`Exported Hardware BOM CSV for ${batchQuantity} units`, 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">Fabrication Economics</span>
            <h2 className="text-xl font-bold text-white mt-1">Mark-III Bill of Materials & Volume Scaling</h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono">
              <span className="text-slate-400">Batch:</span>
              {[1, 10, 50, 100].map((q) => (
                <button
                  key={q}
                  onClick={() => setBatchQuantity(q)}
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                    batchQuantity === q ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {q}x
                </button>
              ))}
            </div>

            <button
              onClick={handleExportCsv}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <i className="fas fa-file-csv"></i>
              Export CSV
            </button>
          </div>
        </div>

        {/* Financial Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-xs font-mono text-slate-400">Baseline Unit Cost (1x)</div>
            <div className="text-2xl font-bold font-mono text-white mt-1">${unitCostTotal.toLocaleString()} NZD</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-xs font-mono text-slate-400">Discounted Unit Cost ({batchQuantity}x)</div>
            <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">${discountedUnitCost.toLocaleString()} NZD</div>
            <div className="text-[10px] text-emerald-400 font-mono mt-0.5">{Math.round((1 - discountMultiplier) * 100)}% Volume Savings</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-xs font-mono text-slate-400">Total Batch CAPEX</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">${totalBatchCost.toLocaleString()} NZD</div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3">Component / Part</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Specification</th>
                <th className="pb-3">Supplier</th>
                <th className="pb-3 text-right">Unit (NZD)</th>
                <th className="pb-3 text-right">Qty</th>
                <th className="pb-3 text-right">Total (NZD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {CONVEYOR_BOM.map((item) => (
                <tr key={item.id} className="hover:bg-slate-950/40">
                  <td className="py-3 font-bold text-white">{item.partName}</td>
                  <td className="py-3 text-cyan-400">{item.category}</td>
                  <td className="py-3 text-slate-400 max-w-xs truncate">{item.specification}</td>
                  <td className="py-3 text-slate-300">{item.supplier}</td>
                  <td className="py-3 text-right text-slate-300">${item.unitCostNZD.toLocaleString()}</td>
                  <td className="py-3 text-right text-slate-400">{item.qtyPerBuoy}</td>
                  <td className="py-3 text-right text-emerald-400 font-bold">${(item.unitCostNZD * item.qtyPerBuoy).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 9. 12-MONTH NZ FUNDING PIPELINE ($1.5M NZD)                               */
/* ========================================================================= */
const ConveyorFundingPipelineView: React.FC<{ onShowToast: (m: string, t?: any) => void }> = ({ onShowToast }) => {
  const totalTarget = CONVEYOR_FUNDING_PIPELINE.reduce((a, b) => a + b.targetAmountNZD, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">Capital Strategy</span>
            <h2 className="text-xl font-bold text-white mt-1">12-Month NZ Funding Pipeline ($1.5M NZD Seed Ask)</h2>
          </div>
          <div className="text-right font-mono">
            <span className="text-xs text-slate-400">Total Pipeline Target: </span>
            <span className="text-lg font-bold text-emerald-400">${(totalTarget / 1000000).toFixed(2)}M NZD</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
          {CONVEYOR_FUNDING_PIPELINE.map((fund) => (
            <div key={fund.id} className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex justify-between items-start">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {fund.category}
                </span>
                <span className="font-mono text-sm font-bold text-emerald-400">
                  ${(fund.targetAmountNZD / 1000).toFixed(0)}k NZD
                </span>
              </div>

              <h4 className="text-sm font-bold text-white font-mono">{fund.organization}</h4>
              <p className="text-xs text-slate-400">{fund.focusArea}</p>

              <div className="pt-2 border-t border-slate-800/80 space-y-1 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Decision Window:</span>
                  <span className="text-slate-200">{fund.expectedDecisionMonth}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Probability:</span>
                  <span className="text-cyan-400">{fund.probabilityPercent}%</span>
                </div>
                <div className="text-[11px] text-slate-500 pt-1 line-clamp-2">
                  Req: {fund.keyRequirement}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 10. GRANT & R&D REBATE OUTREACH HUB                                       */
/* ========================================================================= */
const ConveyorOutreachHubView: React.FC<{ onShowToast: (m: string, t?: any) => void }> = ({ onShowToast }) => {
  const [labCost, setLabCost] = useState(180000);
  const [engineerCost, setEngineerCost] = useState(65000);
  const [trialsCost, setTrialsCost] = useState(85000);
  const [materialsCost, setMaterialsCost] = useState(120000);

  const [aiProposal, setAiProposal] = useState<string>('');
  const [isGeneratingGrant, setIsGeneratingGrant] = useState(false);

  const totalSpend = labCost + engineerCost + trialsCost + materialsCost;
  const callaghanRebate = Math.round(totalSpend * 0.4);

  const handleGenerateAiGrant = async () => {
    setIsGeneratingGrant(true);
    onShowToast('Connecting to Gemini 3.8 Flash to write Callaghan R&D grant proposal...', 'info');

    try {
      const res = await fetch('/api/conveyor/generate-grant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organization: 'Callaghan Innovation & Outset Ventures (Pukekohe)',
          focusArea: 'Atlantic Meridional Overturning Circulation (AMOC) Stabilization & Subsurface Brine Downwelling',
          targetAmountNZD: callaghanRebate,
        }),
      });

      if (!res.ok) throw new Error('Grant generation failed');
      const data = await res.json();
      if (data.proposal) {
        setAiProposal(data.proposal);
        onShowToast('Generated new AI Grant Proposal draft!', 'success');
      } else {
        throw new Error('No proposal content returned');
      }
    } catch (err: any) {
      console.error(err);
      onShowToast('Error generating proposal. Check server connection.', 'error');
    } finally {
      setIsGeneratingGrant(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">Government Co-Funding Rebate</span>
          <h2 className="text-xl font-bold text-white mt-1">Callaghan Innovation 40% R&D Rebate Calculator</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white font-mono">Eligible R&D Expenditure Categories (NZD)</h4>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Pukekohe Wet-Lab & Pressure Tank Prototyping</span>
                <span className="text-white">${labCost.toLocaleString()}</span>
              </div>
              <input type="range" min="50000" max="400000" step="10000" value={labCost} onChange={(e) => setLabCost(Number(e.target.value))} className="w-full accent-cyan-500" />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Marine & Electrical Engineering Salaries</span>
                <span className="text-white">${engineerCost.toLocaleString()}</span>
              </div>
              <input type="range" min="30000" max="250000" step="5000" value={engineerCost} onChange={(e) => setEngineerCost(Number(e.target.value))} className="w-full accent-cyan-500" />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Hauraki Gulf Vessel Charter & Sea Trials</span>
                <span className="text-white">${trialsCost.toLocaleString()}</span>
              </div>
              <input type="range" min="20000" max="200000" step="5000" value={trialsCost} onChange={(e) => setTrialsCost(Number(e.target.value))} className="w-full accent-cyan-500" />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Grade 5 Titanium & Ceramic Impeller Materials</span>
                <span className="text-white">${materialsCost.toLocaleString()}</span>
              </div>
              <input type="range" min="30000" max="300000" step="10000" value={materialsCost} onChange={(e) => setMaterialsCost(Number(e.target.value))} className="w-full accent-cyan-500" />
            </div>
          </div>

          <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase">Total Qualifying R&D Spend</span>
              <div className="text-3xl font-extrabold font-mono text-white mt-1">${totalSpend.toLocaleString()} NZD</div>
            </div>

            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-xs font-mono text-emerald-400 uppercase font-bold">Callaghan 40% Non-Dilutive Cash Rebate</span>
              <div className="text-3xl font-extrabold font-mono text-emerald-400 mt-1">+${callaghanRebate.toLocaleString()} NZD</div>
              <p className="text-[11px] text-slate-300 mt-2">
                Eligible under Callaghan Innovation New Partnered R&D Grant rules for New Zealand incorporated deep tech entities.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onShowToast('Exported Callaghan Innovation R&D grant expenditure schedule', 'success')}
                className="flex-1 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono text-xs font-bold transition-all cursor-pointer"
              >
                Export Claim File
              </button>
              <button
                onClick={handleGenerateAiGrant}
                disabled={isGeneratingGrant}
                className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono text-xs font-bold transition-all shadow-md shadow-purple-600/30 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <i className={`fas ${isGeneratingGrant ? 'fa-spinner fa-spin' : 'fa-brain'}`}></i>
                <span>{isGeneratingGrant ? 'Generating...' : 'AI Grant Proposal (Gemini)'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* AI Proposal Display Area */}
        {aiProposal && (
          <div className="mt-6 p-6 rounded-xl bg-slate-950 border border-purple-500/30 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                <span className="text-xs font-mono text-purple-300 font-bold uppercase">
                  Gemini Generated Callaghan / Outset Ventures Grant Draft
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(aiProposal);
                    onShowToast('Copied proposal to clipboard!', 'success');
                  }}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-mono"
                >
                  <i className="fas fa-copy mr-1"></i> Copy
                </button>
                <button
                  onClick={() => setAiProposal('')}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded text-xs font-mono"
                >
                  Close
                </button>
              </div>
            </div>
            <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto pr-2">
              {aiProposal}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 11. FLEET FINANCIAL MODEL & UNIT ECONOMICS                                 */
/* ========================================================================= */
const ConveyorFleetEconomicsView: React.FC<{ onShowToast: (m: string, t?: any) => void }> = ({ onShowToast }) => {
  const [fleetUnits, setFleetUnits] = useState(50);
  const [creditPriceUSD, setCreditPriceUSD] = useState(45);

  const capexPerBuoy = 42000;
  const opexPerBuoy = 3500;
  const creditsPerBuoyYear = 1250;

  const totalCapex = capexPerBuoy * fleetUnits;
  const totalAnnualOpex = opexPerBuoy * fleetUnits;
  const annualCredits = creditsPerBuoyYear * fleetUnits;
  const annualRevUSD = annualCredits * creditPriceUSD;
  const annualRevNZD = Math.round(annualRevUSD / 0.61);
  const netAnnualCashFlow = annualRevNZD - totalAnnualOpex;
  const paybackYears = (totalCapex / Math.max(1, netAnnualCashFlow)).toFixed(1);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">10-Year Unit Economics</span>
          <h2 className="text-xl font-bold text-white mt-1">Fleet Financial & Ocean Cryo-Credit Revenue Model</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-xs font-mono text-slate-400">Total Fleet CAPEX</span>
            <div className="text-2xl font-bold font-mono text-white mt-1">${(totalCapex / 1000).toLocaleString()}k NZD</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-xs font-mono text-slate-400">Annual Revenue (Credits)</span>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">${(annualRevNZD / 1000).toLocaleString()}k NZD</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-xs font-mono text-slate-400">Net Annual Cashflow</span>
            <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">${(netAnnualCashFlow / 1000).toLocaleString()}k NZD</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-xs font-mono text-slate-400">Payback Period</span>
            <div className="text-2xl font-bold font-mono text-purple-400 mt-1">{paybackYears} Years</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Fleet Units Deployed</span>
              <span className="text-cyan-400 font-bold">{fleetUnits} Buoys</span>
            </div>
            <input type="range" min="10" max="300" step="5" value={fleetUnits} onChange={(e) => setFleetUnits(Number(e.target.value))} className="w-full accent-cyan-500" />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Ocean Cryo-Credit Price (USD)</span>
              <span className="text-emerald-400 font-bold">${creditPriceUSD} / ton CO2-eq</span>
            </div>
            <input type="range" min="20" max="120" step="5" value={creditPriceUSD} onChange={(e) => setCreditPriceUSD(Number(e.target.value))} className="w-full accent-emerald-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 12. SEA TRIALS & ASSEMBLY CHECKLIST                                       */
/* ========================================================================= */
const ConveyorTrialsLogisticsView: React.FC<{ onShowToast: (m: string, t?: any) => void }> = ({ onShowToast }) => {
  const [checklist, setChecklist] = useState(CONVEYOR_ASSEMBLY_CHECKLIST);

  const toggleCheck = (id: string) => {
    setChecklist((prev) =>
      prev.map((c) => (c.id === id ? { ...c, completed: !c.completed } : c))
    );
    onShowToast('Updated assembly step status', 'info');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">Offshore Proving Grounds</span>
          <h2 className="text-xl font-bold text-white mt-1">Hauraki Gulf & Southern Ocean Sea Trials Checklist</h2>
        </div>

        <div className="space-y-3 pt-6">
          {checklist.map((step) => (
            <div
              key={step.id}
              onClick={() => toggleCheck(step.id)}
              className={`p-4 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                step.completed ? 'bg-slate-950/40 border-emerald-500/30 text-slate-300' : 'bg-slate-950 border-slate-800 text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-mono ${step.completed ? 'bg-emerald-500 text-slate-950 font-bold' : 'border border-slate-700 bg-slate-900'}`}>
                  {step.completed && <i className="fas fa-check"></i>}
                </div>
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase">{step.subsystem}</span>
                  <div className="text-xs sm:text-sm font-semibold">{step.stepTitle}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{step.specification}</div>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${step.completed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                {step.completed ? 'VERIFIED' : 'PENDING'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 13. NZ BUSINESS & SOLE TRADER SETUP                                       */
/* ========================================================================= */
const ConveyorNzBusinessView: React.FC<{ onShowToast: (m: string, t?: any) => void }> = ({ onShowToast }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">Corporate & IP Governance</span>
          <h2 className="text-xl font-bold text-white mt-1">New Zealand Entity, Sole Trader & Patent Setup</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
          {CONVEYOR_NZ_BUSINESS.map((biz) => (
            <div key={biz.id} className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono text-cyan-400">{biz.category}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${biz.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : biz.status === 'In Progress' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-slate-800 text-slate-400'}`}>
                  {biz.status}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white font-mono">{biz.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{biz.description}</p>
              <div className="text-[11px] text-slate-400 font-mono pt-1">Authority: {biz.authorityOrPortal}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 14. MARITIME & EPA COMPLIANCE                                             */
/* ========================================================================= */
const ConveyorRegulatoryView: React.FC<{ onShowToast: (m: string, t?: any) => void }> = ({ onShowToast }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">Regulatory Framework</span>
          <h2 className="text-xl font-bold text-white mt-1">Maritime NZ COLREGS & EPA Coastal Discharge Permitted Activity</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="font-bold text-cyan-400 font-mono">1. Maritime NZ COLREGS</div>
            <p>Moored buoy compliance with IALA maritime navigation marking standards, radar reflectors, and yellow flashing strobe lights (Fl(5) Y 20s).</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="font-bold text-emerald-400 font-mono">2. EPA EEZ Permitted Activity</div>
            <p>Non-toxic natural seawater concentrate qualifies under marine scientific research exemptions with zero chemical polymer additives.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="font-bold text-purple-400 font-mono">3. UNCLOS Marine Research</div>
            <p>Conducting subsea oceanographic measurement and cryo-restoration trials in accordance with the United Nations Convention on the Law of the Sea.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 15. ECOLOGICAL SAFETY AUDIT                                               */
/* ========================================================================= */
const ConveyorEcoAuditView: React.FC<{ onShowToast: (m: string, t?: any) => void }> = ({ onShowToast }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">Environmental Protection</span>
          <h2 className="text-xl font-bold text-white mt-1">Marine Ecological Safety & Toxicity Audit</h2>
        </div>

        <div className="divide-y divide-slate-800 pt-4">
          {CONVEYOR_ECO_AUDIT.map((eco) => (
            <div key={eco.id} className="py-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase">{eco.category}</span>
                  <h4 className="text-sm font-bold text-white font-mono">{eco.parameterName}</h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {eco.status}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-400">
                <div>Limit: {eco.thresholdLimit}</div>
                <div className="text-emerald-400 font-semibold">Measured: {eco.measuredSaliBuoyVal}</div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{eco.mitigationStrategy}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 16. VC PITCH DECK SLIDE VIEWER                                            */
/* ========================================================================= */
const ConveyorPitchDeckView: React.FC<{ onShowToast: (m: string, t?: any) => void }> = ({ onShowToast }) => {
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const slide = CONVEYOR_PITCH_SLIDES[currentSlideIdx];

  const handleExportMarkdown = () => {
    const md = CONVEYOR_PITCH_SLIDES.map(
      (s) => `# Slide ${s.id}: ${s.title}\n**Subtitle:** ${s.subtitle}\n**Metric:** ${s.highlightMetric.value} (${s.highlightMetric.label})\n\n${s.bulletPoints.map((b) => `- ${b}`).join('\n')}\n\n> Takeaway: ${s.calloutNote}\n\n---\n`
    ).join('\n');

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'SaliBuoy_Systems_VC_Pitch_Deck.md';
    link.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded VC Pitch Deck Markdown', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">Investor Presentation</span>
            <h2 className="text-xl font-bold text-white mt-1">VC Pitch Deck (Slide {slide.id} of {CONVEYOR_PITCH_SLIDES.length})</h2>
          </div>
          <button
            onClick={handleExportMarkdown}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <i className="fas fa-file-download text-cyan-400"></i>
            Export Pitch (.md)
          </button>
        </div>

        {/* Slide Canvas */}
        <div className="my-6 p-8 rounded-xl bg-slate-950 border border-slate-800 min-h-[340px] flex flex-col justify-between space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono text-cyan-400 uppercase font-bold tracking-wider">SLIDE 0{slide.id}</span>
            <h3 className="text-2xl font-extrabold text-white">{slide.title}</h3>
            <p className="text-sm text-slate-300 font-mono">{slide.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              {slide.bulletPoints.map((b, bIdx) => (
                <div key={bIdx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <span className="text-cyan-400 font-bold mt-1">▸</span>
                  <span>{b}</span>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-center space-y-1">
              <div className="text-3xl font-extrabold font-mono text-cyan-300">{slide.highlightMetric.value}</div>
              <div className="text-xs font-mono text-slate-400">{slide.highlightMetric.label}</div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono text-cyan-300 italic">
            💡 Takeaway: {slide.calloutNote}
          </div>
        </div>

        {/* Slide Navigation Controls */}
        <div className="flex justify-between items-center pt-2">
          <button
            disabled={currentSlideIdx === 0}
            onClick={() => setCurrentSlideIdx((prev) => Math.max(0, prev - 1))}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white text-xs font-mono flex items-center gap-2 transition-all cursor-pointer"
          >
            <i className="fas fa-chevron-left"></i> Previous Slide
          </button>

          <div className="flex items-center gap-1.5">
            {CONVEYOR_PITCH_SLIDES.map((_, sIdx) => (
              <button
                key={sIdx}
                onClick={() => setCurrentSlideIdx(sIdx)}
                className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                  currentSlideIdx === sIdx ? 'bg-cyan-400 scale-125' : 'bg-slate-700 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>

          <button
            disabled={currentSlideIdx === CONVEYOR_PITCH_SLIDES.length - 1}
            onClick={() => setCurrentSlideIdx((prev) => Math.min(CONVEYOR_PITCH_SLIDES.length - 1, prev + 1))}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 text-white text-xs font-mono flex items-center gap-2 transition-all cursor-pointer"
          >
            Next Slide <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};
