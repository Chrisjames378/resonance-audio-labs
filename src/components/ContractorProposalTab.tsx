import React, { useState } from 'react';
import { ProjectTimelineManager, Milestone } from './ProjectTimelineManager';
import { WorkerOnboardingWizard } from './WorkerOnboardingWizard';

interface ContractorProposalTabProps {
  onShowToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const ContractorProposalTab: React.FC<ContractorProposalTabProps> = ({ onShowToast }) => {
  // Hub Tab state
  const [activeHubTab, setActiveHubTab] = useState<'proposal' | 'timeline' | 'onboarding'>('proposal');

  // Form State
  const [contractorName, setContractorName] = useState('Alex Taylor');
  const [contractorEmail, setContractorEmail] = useState('alex.taylor.dev@example.com');
  const [contractorAddress, setContractorAddress] = useState('Auckland, New Zealand');
  const [roleTitle, setRoleTitle] = useState('Junior Full-Stack Web Developer & Maintenance Specialist');
  
  const [engagementType, setEngagementType] = useState<'hourly' | 'retainer'>('hourly');
  const [hourlyRate, setHourlyRate] = useState('35.00');
  const [weeklyHours, setWeeklyHours] = useState('15');
  const [weeklyRetainer, setWeeklyRetainer] = useState('500.00');
  const [startDate, setStartDate] = useState('2026-10-01');
  const [paymentSchedule, setPaymentSchedule] = useState('Bi-weekly (Every fortnight on Friday)');

  // Milestones Timeline State
  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('resonance_hiring_milestones_v1');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load milestones from storage:', e);
      }
    }
    return [
      {
        id: 'm1',
        title: 'Phase 1: Environment Setup & Architecture Scaffolding',
        projectName: 'New Web App Sprint',
        targetDate: '2026-10-07',
        deliverables: 'Git repo setup, Vite React + TypeScript structure, Tailwind styling, and CI build verification.',
        status: 'completed',
        estimatedHours: 12,
      },
      {
        id: 'm2',
        title: 'Phase 2: Core Feature Implementation & UI Components',
        projectName: 'New Web App Sprint',
        targetDate: '2026-10-14',
        deliverables: 'Primary interactive views, state management hooks, form validations, and user flow integrations.',
        status: 'in_progress',
        estimatedHours: 20,
      },
      {
        id: 'm3',
        title: 'Phase 3: PWA Offline Capabilities & Audio Engine Hooks',
        projectName: 'New Web App Sprint',
        targetDate: '2026-10-21',
        deliverables: 'Web App Manifest, Service Worker caching, offline state handling, and Web Audio thread sync.',
        status: 'not_started',
        estimatedHours: 15,
      },
      {
        id: 'm4',
        title: 'Phase 4: Staging Deployment, QA & Final Client Approval',
        projectName: 'New Web App Sprint',
        targetDate: '2026-10-28',
        deliverables: 'Bug fixes, performance profiling, mobile audit, staging preview deployment, and handover documentation.',
        status: 'not_started',
        estimatedHours: 10,
      },
    ];
  });

  const [includeMilestonesInContract, setIncludeMilestonesInContract] = useState(true);

  const handleMilestonesChange = (updated: Milestone[]) => {
    setMilestones(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('resonance_hiring_milestones_v1', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save milestones to storage:', e);
      }
    }
  };

  // Scope Checklist
  const [responsibilities, setResponsibilities] = useState({
    newAppBuilds: true,
    codeUpdates: true,
    bugFixes: true,
    pwaOptimization: true,
    audioEngineSupport: true,
    gitWorkflow: true,
    documentation: true,
  });

  // Clause Toggles
  const [includeIPClause, setIncludeIPClause] = useState(true);
  const [includeNDA, setIncludeNDA] = useState(true);
  const [includeTrialPeriod, setIncludeTrialPeriod] = useState(true);
  const [trialDurationDays, setTrialDurationDays] = useState('30');
  const [terminationNoticeDays, setTerminationNoticeDays] = useState('14');

  const handleToggleResp = (key: keyof typeof responsibilities) => {
    setResponsibilities((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCopyContract = () => {
    const docEl = document.getElementById('contract-document-preview');
    if (docEl) {
      navigator.clipboard.writeText(docEl.innerText);
      onShowToast('Contract Proposal text copied to clipboard!', 'success');
    }
  };

  const handlePrintContract = () => {
    window.print();
  };

  return (
    <section id="tab-hiring" className="tab-content space-y-8">
      {/* Top Banner & Hiring Strategy Guide */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 print-card">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-semibold">
                HR & Operations Suite
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-mono">
                Contract Generator
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Worker Hiring & Business Contract Proposal Hub
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Guide and contract generator for hiring a contractor or daily assistant to help build apps, maintain updates, and scale operations.
            </p>
          </div>

          <div className="flex items-center gap-3 no-print">
            <button
              onClick={handleCopyContract}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-2 transition-all shadow-sm"
            >
              <i className="fas fa-copy text-indigo-400"></i>
              Copy Contract Text
            </button>
            <button
              onClick={handlePrintContract}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20"
            >
              <i className="fas fa-print"></i>
              Print / Export Contract
            </button>
          </div>
        </div>

        {/* Strategic Onboarding Roadmap */}
        <div className="space-y-4 no-print">
          <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
            <i className="fas fa-map-signs"></i> 4-Step Strategy: Hiring & Managing a Technical Assistant
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center font-mono">
                01
              </div>
              <h4 className="font-bold text-white text-sm">Define Scope & Trial Task</h4>
              <p className="text-slate-400 leading-relaxed">
                Start with a small, paid trial task (e.g., 5–10 hours fixing a UI component or updating a feature) to evaluate code quality, communication, and speed.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center font-mono">
                02
              </div>
              <h4 className="font-bold text-white text-sm">Secure Access & SOPs</h4>
              <p className="text-slate-400 leading-relaxed">
                Grant GitHub repository collaborator access with branch protection. Never share main production credentials or API secrets directly. Use staging environments.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center font-mono">
                03
              </div>
              <h4 className="font-bold text-white text-sm">Task Management & Communication</h4>
              <p className="text-slate-400 leading-relaxed">
                Use Trello/GitHub Issues for task boards. Set up daily async standups (e.g. 3 bullet points: completed today, doing tomorrow, blockers).
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center font-mono">
                04
              </div>
              <h4 className="font-bold text-white text-sm">Legal Contract & IP Protection</h4>
              <p className="text-slate-400 leading-relaxed">
                Sign an Independent Contractor Proposal & Work-for-Hire Agreement ensuring 100% IP ownership belongs to Resonance Audio Labs before granting full codebase access.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Hub Mode Selector Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-3 no-print">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveHubTab('proposal')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              activeHubTab === 'proposal'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 border border-indigo-500'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <i className="fas fa-file-contract text-indigo-300"></i>
            1. Contract Proposal Agreement
          </button>

          <button
            onClick={() => setActiveHubTab('timeline')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              activeHubTab === 'timeline'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 border border-indigo-500'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <i className="fas fa-stream text-indigo-300"></i>
            2. Project Timeline & Milestones
            <span className="ml-1 px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px]">
              {milestones.length}
            </span>
          </button>

          <button
            onClick={() => setActiveHubTab('onboarding')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              activeHubTab === 'onboarding'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 border border-emerald-500'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <i className="fas fa-user-check text-emerald-400"></i>
            3. Onboarding Wizard & Getting Started
            <span className="ml-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
              NEW
            </span>
          </button>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-2 pr-2 hidden lg:flex">
          <i className="fas fa-user-circle text-indigo-400"></i>
          <span>Worker: <strong className="text-slate-200">{contractorName || 'Alex Taylor'}</strong></span>
        </div>
      </div>

      {/* Tab 1: Contract Proposal Form & Agreement Preview */}
      {activeHubTab === 'proposal' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Customization Form Controls */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 no-print">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <i className="fas fa-sliders-h text-indigo-400"></i> Contract & Proposal Generator Form
          </h3>

          {/* Worker Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Worker / Candidate Information</h4>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Worker Full Name</label>
              <input
                type="text"
                value={contractorName}
                onChange={(e) => setContractorName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                placeholder="e.g. Jane Doe"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                value={contractorEmail}
                onChange={(e) => setContractorEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Address / Location</label>
              <input
                type="text"
                value={contractorAddress}
                onChange={(e) => setContractorAddress(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Role Title</label>
              <input
                type="text"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Remuneration & Schedule */}
          <div className="space-y-4 border-t border-slate-800 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Payment & Engagement Structure</h4>
            
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  name="engagementType"
                  checked={engagementType === 'hourly'}
                  onChange={() => setEngagementType('hourly')}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                Hourly Rate ($/hr)
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  name="engagementType"
                  checked={engagementType === 'retainer'}
                  onChange={() => setEngagementType('retainer')}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                Weekly Fixed Retainer
              </label>
            </div>

            {engagementType === 'hourly' ? (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hourly Rate (NZD $)</label>
                  <input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Estimated Hours/Week</label>
                  <input
                    type="number"
                    value={weeklyHours}
                    onChange={(e) => setWeeklyHours(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Weekly Retainer Fee (NZD $)</label>
                <input
                  type="number"
                  value={weeklyRetainer}
                  onChange={(e) => setWeeklyRetainer(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Proposed Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Frequency</label>
                <select
                  value={paymentSchedule}
                  onChange={(e) => setPaymentSchedule(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Weekly (Every Friday)">Weekly (Every Friday)</option>
                  <option value="Bi-weekly (Every fortnight on Friday)">Bi-weekly (Every fortnight)</option>
                  <option value="Monthly (End of month)">Monthly (End of month)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Core Responsibilities Checklist */}
          <div className="space-y-3 border-t border-slate-800 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Included Scope of Work</h4>
            <div className="space-y-2 text-xs">
              {[
                { key: 'newAppBuilds', label: 'New Web App Builds & Feature Scaffolding' },
                { key: 'codeUpdates', label: 'Day-to-day Code Updates & Maintenance' },
                { key: 'bugFixes', label: 'Bug Fixes, Refactoring & Error Diagnostics' },
                { key: 'pwaOptimization', label: 'PWA, Offline Support & Mobile Optimization' },
                { key: 'audioEngineSupport', label: 'Audio Engine / Web Audio DSP Optimization' },
                { key: 'gitWorkflow', label: 'Git Branch Management & Pull Request Reviews' },
                { key: 'documentation', label: 'System Documentation & Technical Notes' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 text-slate-300 cursor-pointer hover:text-white">
                  <input
                    type="checkbox"
                    checked={responsibilities[key as keyof typeof responsibilities]}
                    onChange={() => handleToggleResp(key as keyof typeof responsibilities)}
                    className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Clauses & Protection */}
          <div className="space-y-3 border-t border-slate-800 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Legal Terms & Protections</h4>
            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeIPClause}
                  onChange={(e) => setIncludeIPClause(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Include 100% IP Assignment & Work-For-Hire Clause</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeNDA}
                  onChange={(e) => setIncludeNDA(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Include Strict Confidentiality & Non-Disclosure (NDA)</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeTrialPeriod}
                  onChange={(e) => setIncludeTrialPeriod(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Include Initial Probationary Trial Period</span>
              </label>

              {includeTrialPeriod && (
                <div className="pl-6 pt-1 flex items-center gap-2">
                  <span className="text-slate-400">Trial Period Days:</span>
                  <input
                    type="number"
                    value={trialDurationDays}
                    onChange={(e) => setTrialDurationDays(e.target.value)}
                    className="w-16 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                  />
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <span className="text-slate-400">Termination Notice Period:</span>
                <input
                  type="number"
                  value={terminationNoticeDays}
                  onChange={(e) => setTerminationNoticeDays(e.target.value)}
                  className="w-16 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                />
                <span className="text-slate-400">days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contract Preview Document */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 print-card">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4 no-print">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <i className="fas fa-file-contract text-emerald-400"></i> Generated Contract Proposal Preview
            </h3>
            <span className="text-xs font-mono text-slate-400">Format: Standard NZ Commercial Agreement</span>
          </div>

          <div
            id="contract-document-preview"
            className="bg-slate-950 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6 text-slate-300 text-xs leading-relaxed font-sans print-card print-text"
          >
            {/* Document Header */}
            <div className="border-b border-slate-800 pb-6 space-y-2">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <h2 className="text-base font-bold text-white uppercase tracking-wider print-text">
                    INDEPENDENT CONTRACTOR AGREEMENT & WORK PROPOSAL
                  </h2>
                  <p className="text-xs text-slate-400 print-text">
                    Resonance Audio Labs Ltd • Software Engineering & Application Development
                  </p>
                </div>
                <div className="text-right text-xs text-slate-400 font-mono print-text">
                  <p>Ref: RAL-CON-2026-01</p>
                  <p>Date: {new Date().toLocaleDateString('en-NZ', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
            </div>

            {/* Parties */}
            <div className="space-y-3 bg-slate-900/50 p-4 rounded-lg border border-slate-800/80">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">1. Parties To This Agreement</h3>
              <p>
                This Independent Contractor Agreement ("Agreement") is entered into by and between:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 font-mono text-[11px]">
                <div>
                  <strong className="text-white block">PRINCIPAL / CLIENT:</strong>
                  <p>Resonance Audio Labs Ltd</p>
                  <p>Represented by: Christopher James McKay</p>
                  <p>43 Ostrich Farm Road, Pukekohe 2676, NZ</p>
                  <p>Email: resonanceaudiolabs@gmail.com</p>
                  <p>Domain: https://uniagant.website</p>
                </div>
                <div>
                  <strong className="text-white block">CONTRACTOR / WORKER:</strong>
                  <p>Name: {contractorName || '[Contractor Name]'}</p>
                  <p>Title: {roleTitle || '[Role Title]'}</p>
                  <p>Address: {contractorAddress || '[Contractor Address]'}</p>
                  <p>Email: {contractorEmail || '[Contractor Email]'}</p>
                </div>
              </div>
            </div>

            {/* Scope of Engagement */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">2. Scope of Services & Key Responsibilities</h3>
              <p>
                The Contractor shall provide professional software development, technical assistance, and daily application maintenance services for Resonance Audio Labs. Specific duties include, but are not limited to:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-300">
                {responsibilities.newAppBuilds && (
                  <li>Assisting in building new web applications, progressive web apps (PWAs), and frontend user interfaces using React, TypeScript, and Tailwind CSS.</li>
                )}
                {responsibilities.codeUpdates && (
                  <li>Performing regular application updates, feature enhancements, and maintenance across active digital assets.</li>
                )}
                {responsibilities.bugFixes && (
                  <li>Diagnosing runtime issues, bug tracking, code refactoring, and quality assurance.</li>
                )}
                {responsibilities.pwaOptimization && (
                  <li>Optimizing mobile responsiveness, service worker caching, and offline PWA capability.</li>
                )}
                {responsibilities.audioEngineSupport && (
                  <li>Supporting web audio synthesis engines, DSP code modules, and Web Audio API performance.</li>
                )}
                {responsibilities.gitWorkflow && (
                  <li>Participating in Git version control workflows, creating clean pull requests, and following developer branch guidelines.</li>
                )}
                {responsibilities.documentation && (
                  <li>Maintaining technical notes, inline code documentation, and operational changelogs.</li>
                )}
              </ul>
            </div>

            {/* Engagement Terms & Compensation */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">3. Compensation & Schedule</h3>
              <p>
                In consideration for the performance of the Services, Resonance Audio Labs agrees to compensate the Contractor as follows:
              </p>
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 space-y-1 font-mono text-[11px]">
                {engagementType === 'hourly' ? (
                  <>
                    <p>• <strong className="text-white">Rate of Pay:</strong> NZD ${hourlyRate} / hour</p>
                    <p>• <strong className="text-white">Estimated Allocation:</strong> ~{weeklyHours} hours per week</p>
                    <p>• <strong className="text-white">Estimated Weekly Earnings:</strong> NZD ${(parseFloat(hourlyRate || '0') * parseFloat(weeklyHours || '0')).toFixed(2)}</p>
                  </>
                ) : (
                  <p>• <strong className="text-white">Fixed Retainer Fee:</strong> NZD ${weeklyRetainer} / week</p>
                )}
                <p>• <strong className="text-white">Commencement Date:</strong> {startDate}</p>
                <p>• <strong className="text-white">Payment Schedule:</strong> {paymentSchedule}</p>
              </div>
            </div>

            {/* Probation / Trial Period */}
            {includeTrialPeriod && (
              <div className="space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">4. Probationary Trial Period</h3>
                <p>
                  The first <strong className="text-white">{trialDurationDays} days</strong> from the Commencement Date shall serve as an initial probationary evaluation period. During this period, either party may evaluate suitability and terminate the agreement with <strong className="text-white">3 days written notice</strong>.
                </p>
              </div>
            )}

            {/* Intellectual Property Rights */}
            {includeIPClause && (
              <div className="space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  {includeTrialPeriod ? '5' : '4'}. Intellectual Property & Work-For-Hire
                </h3>
                <p>
                  All work created, authored, developed, or contributed by the Contractor under this Agreement—including but not limited to source code, software architecture, DSP algorithms, UI graphics, and design assets—shall be deemed a <strong className="text-white">"Work Made for Hire"</strong>. All Intellectual Property rights immediately and exclusively vest in <strong className="text-white">Resonance Audio Labs Ltd</strong>. The Contractor waives any and all moral rights.
                </p>
              </div>
            )}

            {/* Confidentiality & Non-Disclosure */}
            {includeNDA && (
              <div className="space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  {includeTrialPeriod && includeIPClause ? '6' : '5'}. Confidentiality & Non-Disclosure
                </h3>
                <p>
                  The Contractor agrees to keep strictly confidential all proprietary information, codebase access, trade secrets, business strategies, customer data, and API keys. This obligation survives the termination of this Agreement indefinitely.
                </p>
              </div>
            )}

            {/* Independent Contractor Status */}
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Independent Contractor Status
              </h3>
              <p>
                The Contractor is an independent contractor and not an employee of Resonance Audio Labs. The Contractor is solely responsible for managing their own taxes, ACC levies, and insurance.
              </p>
            </div>

            {/* Schedule A: Project Milestones Schedule */}
            {includeMilestonesInContract && milestones.length > 0 && (
              <div className="space-y-2 border-t border-slate-800/80 pt-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  SCHEDULE A: PROJECT DEVELOPMENT MILESTONES & TARGET TIMELINE
                </h3>
                <p>
                  The Contractor agrees to work towards achieving the following project milestones and key deliverables in accordance with the target timeline below:
                </p>
                <div className="bg-slate-900/60 rounded-lg border border-slate-800 overflow-hidden font-mono text-[11px]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/80">
                        <th className="p-2">Milestone / Deliverable</th>
                        <th className="p-2">Target Date</th>
                        <th className="p-2">Est. Hours</th>
                        <th className="p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {milestones.map((m) => (
                        <tr key={m.id} className="hover:bg-slate-900/40">
                          <td className="p-2 font-semibold">
                            <div>{m.title}</div>
                            <div className="text-[10px] text-slate-400 font-sans">{m.deliverables}</div>
                          </td>
                          <td className="p-2 whitespace-nowrap text-indigo-300">{m.targetDate}</td>
                          <td className="p-2 whitespace-nowrap">{m.estimatedHours} hrs</td>
                          <td className="p-2 whitespace-nowrap uppercase text-[10px] font-bold">
                            <span className={m.status === 'completed' ? 'text-emerald-400' : m.status === 'in_progress' ? 'text-indigo-400' : 'text-slate-400'}>
                              {m.status.replace('_', ' ')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Termination */}
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Termination
              </h3>
              <p>
                Following any initial probationary period, either party may terminate this Agreement by providing <strong className="text-white">{terminationNoticeDays} days written notice</strong> to the other party.
              </p>
            </div>

            {/* Signatures */}
            <div className="border-t border-slate-800 pt-6 mt-6 space-y-4">
              <p className="font-semibold text-white">IN WITNESS WHEREOF, the parties have executed this Agreement as of the date written above.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                <div className="space-y-4">
                  <p className="text-xs text-slate-400 font-mono">FOR: Resonance Audio Labs Ltd</p>
                  <div className="border-b border-slate-700 h-10 flex items-end font-serif italic text-indigo-300">
                    Christopher James McKay
                  </div>
                  <div>
                    <p className="font-bold text-white">Christopher James McKay</p>
                    <p className="text-[11px] text-slate-400">Principal Founder & Engineering Director</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-xs text-slate-400 font-mono">FOR CONTRACTOR:</p>
                  <div className="border-b border-slate-700 h-10 flex items-end font-serif italic text-slate-400">
                    [Signature of {contractorName || 'Contractor'}]
                  </div>
                  <div>
                    <p className="font-bold text-white">{contractorName || '[Contractor Name]'}</p>
                    <p className="text-[11px] text-slate-400">{roleTitle || 'Independent Contractor'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Tab 2: Project Timeline & Development Milestones */}
      {activeHubTab === 'timeline' && (
        <ProjectTimelineManager
          milestones={milestones}
          onChangeMilestones={handleMilestonesChange}
          includeInContract={includeMilestonesInContract}
          onToggleIncludeInContract={setIncludeMilestonesInContract}
          onShowToast={onShowToast}
        />
      )}

      {/* Tab 3: Onboarding Wizard & Getting Started Guide */}
      {activeHubTab === 'onboarding' && (
        <WorkerOnboardingWizard
          contractorName={contractorName}
          contractorEmail={contractorEmail}
          roleTitle={roleTitle}
          startDate={startDate}
          onShowToast={onShowToast}
        />
      )}
    </section>
  );
};
