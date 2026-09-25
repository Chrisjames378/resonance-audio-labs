import React, { useState, useEffect } from 'react';

export interface OnboardingAccessItem {
  id: string;
  category: 'code' | 'design' | 'communication' | 'staging' | 'tasks';
  title: string;
  description: string;
  isGranted: boolean;
  linkOrNotes?: string;
}

const DEFAULT_ACCESS_ITEMS: OnboardingAccessItem[] = [
  {
    id: 'acc_git',
    category: 'code',
    title: 'GitHub Repository Collaborator Invite',
    description: 'Grant write access to main app repository with branch protection rules on main branch.',
    isGranted: true,
    linkOrNotes: 'github.com/resonance-audio-labs/core-platform',
  },
  {
    id: 'acc_tasks',
    category: 'tasks',
    title: 'Trello / GitHub Issues Project Board',
    description: 'Invite worker to active sprint task board for task assignment and daily status updates.',
    isGranted: true,
    linkOrNotes: 'trello.com/b/resonance-sprints',
  },
  {
    id: 'acc_comm',
    category: 'communication',
    title: 'Discord / Slack Channel Invite',
    description: 'Add worker to #dev-standup and #announcements channels for daily async updates.',
    isGranted: false,
    linkOrNotes: 'discord.gg/resonance-devs',
  },
  {
    id: 'acc_staging',
    category: 'staging',
    title: 'Staging Environment & Demo Link Access',
    description: 'Provide access URL to latest staging build preview for QA and feature testing.',
    isGranted: true,
    linkOrNotes: 'https://ais-dev-preview.app',
  },
  {
    id: 'acc_env',
    category: 'staging',
    title: 'Development Environment Variables (.env.local)',
    description: 'Share non-production API keys, mock endpoints, and client-side config parameters.',
    isGranted: false,
    linkOrNotes: 'VITE_API_ENDPOINT=https://staging.api.resonance.com',
  },
  {
    id: 'acc_figma',
    category: 'design',
    title: 'Figma UI Mockups & Asset Guidelines',
    description: 'Provide view access to component design tokens, color palette, and wireframes.',
    isGranted: true,
    linkOrNotes: 'figma.com/file/resonance-design-system',
  },
];

export interface EnvironmentStep {
  id: string;
  title: string;
  commandOrDetail: string;
  isCompleted: boolean;
}

const DEFAULT_ENV_STEPS: EnvironmentStep[] = [
  {
    id: 'env_node',
    title: 'Install Node.js (v20+ LTS) & npm / pnpm',
    commandOrDetail: 'node -v && npm -v',
    isCompleted: true,
  },
  {
    id: 'env_clone',
    title: 'Clone Repository & Checkout Work Branch',
    commandOrDetail: 'git clone https://github.com/resonance-audio-labs/core-platform.git && git checkout -b feature/your-name-onboarding',
    isCompleted: true,
  },
  {
    id: 'env_install',
    title: 'Install Project Dependencies',
    commandOrDetail: 'npm install',
    isCompleted: false,
  },
  {
    id: 'env_run',
    title: 'Launch Local Dev Server & Verify HMR Port 3000',
    commandOrDetail: 'npm run dev',
    isCompleted: false,
  },
  {
    id: 'env_lint',
    title: 'Run TypeScript Type Check & Linter Audit',
    commandOrDetail: 'npm run lint',
    isCompleted: false,
  },
];

interface WorkerOnboardingWizardProps {
  contractorName: string;
  contractorEmail: string;
  roleTitle: string;
  startDate: string;
  onShowToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

const STORAGE_KEY = 'resonance_onboarding_wizard_v1';

export const WorkerOnboardingWizard: React.FC<WorkerOnboardingWizardProps> = ({
  contractorName,
  contractorEmail,
  roleTitle,
  startDate,
  onShowToast,
}) => {
  const [currentWizardStep, setCurrentWizardStep] = useState<number>(1);
  const [accessItems, setAccessItems] = useState<OnboardingAccessItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`${STORAGE_KEY}_access`);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_ACCESS_ITEMS;
  });

  const [envSteps, setEnvSteps] = useState<EnvironmentStep[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`${STORAGE_KEY}_env`);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_ENV_STEPS;
  });

  const [standupTime, setStandupTime] = useState('09:30 AM NZST');
  const [repoUrl, setRepoUrl] = useState('github.com/resonance-audio-labs/core-platform');

  const saveAccessItems = (items: OnboardingAccessItem[]) => {
    setAccessItems(items);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${STORAGE_KEY}_access`, JSON.stringify(items));
    }
  };

  const saveEnvSteps = (steps: EnvironmentStep[]) => {
    setEnvSteps(steps);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${STORAGE_KEY}_env`, JSON.stringify(steps));
    }
  };

  const handleToggleAccess = (id: string) => {
    const updated = accessItems.map((item) =>
      item.id === id ? { ...item, isGranted: !item.isGranted } : item
    );
    saveAccessItems(updated);
  };

  const handleToggleEnvStep = (id: string) => {
    const updated = envSteps.map((step) =>
      step.id === id ? { ...step, isCompleted: !step.isCompleted } : step
    );
    saveEnvSteps(updated);
  };

  const handleCopyGuideText = () => {
    const guideEl = document.getElementById('onboarding-guide-preview-doc');
    if (guideEl) {
      navigator.clipboard.writeText(guideEl.innerText);
      onShowToast('Getting Started Guide text copied to clipboard!', 'success');
    }
  };

  const handlePrintGuide = () => {
    window.print();
  };

  const grantedCount = accessItems.filter((a) => a.isGranted).length;
  const accessTotal = accessItems.length;
  const accessPercent = accessTotal > 0 ? Math.round((grantedCount / accessTotal) * 100) : 0;

  const completedEnvCount = envSteps.filter((e) => e.isCompleted).length;
  const envTotal = envSteps.length;
  const envPercent = envTotal > 0 ? Math.round((completedEnvCount / envTotal) * 100) : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl print-card">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-mono font-semibold">
              Worker Onboarding Engine
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono">
              Access & Setup Wizard
            </span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <i className="fas fa-user-astronaut text-indigo-400"></i> New Hire Onboarding & Access Credentials Wizard
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Automate environment setup, grant project access credentials, and generate a standardized "Getting Started Guide" for{' '}
            <strong className="text-indigo-300">{contractorName || 'New Hire'}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 no-print">
          <button
            onClick={handleCopyGuideText}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-all"
          >
            <i className="fas fa-copy text-indigo-400"></i> Copy Guide Text
          </button>
          <button
            onClick={handlePrintGuide}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
          >
            <i className="fas fa-print"></i> Export / Print Guide
          </button>
        </div>
      </div>

      {/* Step Indicator Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs no-print">
        {[
          { step: 1, title: '1. Access Checklist', icon: 'fa-key', count: `${grantedCount}/${accessTotal}` },
          { step: 2, title: '2. Local Dev Setup', icon: 'fa-terminal', count: `${completedEnvCount}/${envTotal}` },
          { step: 3, title: '3. SOPs & Standups', icon: 'fa-book-reader', count: 'Configured' },
          { step: 4, title: '4. Generated Guide', icon: 'fa-file-alt', count: 'Ready' },
        ].map((s) => (
          <button
            key={s.step}
            onClick={() => setCurrentWizardStep(s.step)}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
              currentWizardStep === s.step
                ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-lg shadow-indigo-600/20 ring-1 ring-indigo-500/40'
                : 'bg-slate-950/60 hover:bg-slate-950 border-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <i className={`fas ${s.icon} ${currentWizardStep === s.step ? 'text-indigo-400' : 'text-slate-500'}`}></i>
              <span className="text-[10px] text-slate-500 font-bold">{s.count}</span>
            </div>
            <span className="font-bold text-xs mt-2">{s.title}</span>
          </button>
        ))}
      </div>

      {/* STEP 1: Project Credentials & Access Checklist */}
      {currentWizardStep === 1 && (
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4 no-print">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <i className="fas fa-shield-alt text-emerald-400"></i> Credentials & Project Access Authorization
              </h4>
              <p className="text-xs text-slate-400">
                Mark each platform credential as granted before handing off the codebase to {contractorName || 'the candidate'}.
              </p>
            </div>
            <div className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-lg">
              {grantedCount} of {accessTotal} Credentials Granted ({accessPercent}%)
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {accessItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleToggleAccess(item.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  item.isGranted
                    ? 'bg-emerald-950/10 border-emerald-500/40 text-slate-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.isGranted}
                  onChange={() => {}} // handled by parent div click
                  className="mt-1 rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-emerald-500"
                />
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h5 className={`text-xs font-bold ${item.isGranted ? 'text-emerald-300' : 'text-slate-200'}`}>
                      {item.title}
                    </h5>
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">{item.description}</p>
                  {item.linkOrNotes && (
                    <p className="text-[10px] font-mono text-indigo-400 truncate pt-1">
                      <i className="fas fa-link text-[8px] mr-1"></i> {item.linkOrNotes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: Local Development Environment Verification */}
      {currentWizardStep === 2 && (
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4 no-print">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <i className="fas fa-terminal text-indigo-400"></i> Local Development Environment Setup Checklist
              </h4>
              <p className="text-xs text-slate-400">
                Step-by-step commands for setting up local Node.js runtime, cloning repository, and launching dev server.
              </p>
            </div>
            <div className="text-xs font-mono text-indigo-300 bg-indigo-950/40 border border-indigo-500/30 px-3 py-1 rounded-lg">
              {completedEnvCount} of {envTotal} Steps Verified ({envPercent}%)
            </div>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {envSteps.map((step, idx) => (
              <div
                key={step.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  step.isCompleted
                    ? 'bg-indigo-950/20 border-indigo-500/40 text-slate-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() => handleToggleEnvStep(step.id)}
                      className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 transition-transform ${
                        step.isCompleted
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                          : 'bg-slate-900 text-slate-500 border border-slate-800 hover:border-indigo-500'
                      }`}
                    >
                      {step.isCompleted ? <i className="fas fa-check text-[10px]"></i> : idx + 1}
                    </button>

                    <div className="space-y-1">
                      <h5 className={`text-xs font-bold font-sans ${step.isCompleted ? 'text-indigo-300' : 'text-slate-200'}`}>
                        {step.title}
                      </h5>
                      <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-indigo-300 text-[11px] flex items-center justify-between gap-2">
                        <code className="truncate">{step.commandOrDetail}</code>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(step.commandOrDetail);
                            onShowToast(`Command copied: ${step.commandOrDetail}`, 'info');
                          }}
                          className="hover:text-white p-1 text-[10px]"
                          title="Copy command"
                        >
                          <i className="fas fa-copy"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: SOPs & Communication Settings */}
      {currentWizardStep === 3 && (
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4 no-print font-sans text-xs">
          <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <i className="fas fa-book-reader text-amber-400"></i> Standard Operating Procedures (SOPs) & Communication Rules
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-slate-300 font-semibold">Primary GitHub Repository URL</label>
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-slate-300 font-semibold">Daily Async Standup Window</label>
              <input
                type="text"
                value={standupTime}
                onChange={(e) => setStandupTime(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider text-indigo-400">
              <i className="fas fa-code-branch mr-1"></i> Git Branching & Pull Request Rules
            </h5>
            <ul className="list-disc pl-5 space-y-1 text-slate-300 leading-relaxed text-[11px]">
              <li>Never commit directly to <strong className="text-white">`main`</strong> or <strong className="text-white">`production`</strong> branches.</li>
              <li>Always branch off <strong className="text-white">`main`</strong> using format: <code className="bg-slate-950 px-1 py-0.5 rounded text-indigo-300">feature/short-description</code> or <code className="bg-slate-950 px-1 py-0.5 rounded text-indigo-300">fix/issue-description</code>.</li>
              <li>Every Pull Request (PR) must pass <code className="bg-slate-950 px-1 py-0.5 rounded text-emerald-300">npm run lint</code> and <code className="bg-slate-950 px-1 py-0.5 rounded text-emerald-300">npm run build</code> without errors.</li>
              <li>Tag Christopher (<strong className="text-indigo-300">@resonance-lead</strong>) on PRs for code review before merging.</li>
            </ul>
          </div>
        </div>
      )}

      {/* STEP 4: Generated "Getting Started" Guide Document */}
      {(currentWizardStep === 4 || true) && (
        <div
          id="onboarding-guide-preview-doc"
          className="bg-slate-950 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6 text-slate-300 text-xs leading-relaxed font-sans print-card print-text"
        >
          {/* Document Header */}
          <div className="border-b border-slate-800 pb-4 space-y-1">
            <div className="flex justify-between items-start flex-wrap gap-2">
              <div>
                <h2 className="text-base font-bold text-white uppercase tracking-wider print-text">
                  DEVELOPER ONBOARDING & GETTING STARTED GUIDE
                </h2>
                <p className="text-xs text-slate-400 print-text">
                  Resonance Audio Labs Ltd • Software Engineering & Application Development
                </p>
              </div>
              <div className="text-right text-xs text-slate-400 font-mono print-text">
                <p>Welcome, {contractorName || '[Worker Name]'}</p>
                <p>Date: {startDate || new Date().toISOString().slice(0, 10)}</p>
              </div>
            </div>
          </div>

          {/* Candidate Welcome & Role Summary */}
          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800/80 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">1. Welcome to Resonance Audio Labs</h3>
            <p>
              Hi <strong className="text-white">{contractorName || 'Developer'}</strong>, welcome aboard! As our <strong className="text-white">{roleTitle || 'Full-Stack Developer'}</strong>, this guide outlines your access credentials, environment setup steps, and day-to-day workflow SOPs.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px] text-slate-300">
              <p>• <strong className="text-white">Email:</strong> {contractorEmail || 'N/A'}</p>
              <p>• <strong className="text-white">Start Date:</strong> {startDate}</p>
              <p>• <strong className="text-white">Lead Director:</strong> Christopher James McKay</p>
              <p>• <strong className="text-white">Primary Repository:</strong> {repoUrl}</p>
            </div>
          </div>

          {/* Project Access Credentials Schedule */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">2. Project Credentials & Access Matrix</h3>
            <p>Below is your project authorization and access status for our active digital assets:</p>
            <div className="bg-slate-900/60 rounded-lg border border-slate-800 overflow-hidden font-mono text-[11px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/80">
                    <th className="p-2">Access Item</th>
                    <th className="p-2">Category</th>
                    <th className="p-2">Link / Endpoint / Notes</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {accessItems.map((item) => (
                    <tr key={item.id}>
                      <td className="p-2 font-semibold text-white">{item.title}</td>
                      <td className="p-2 uppercase text-[10px] text-slate-400">{item.category}</td>
                      <td className="p-2 font-mono text-[10px] text-indigo-300">{item.linkOrNotes || '—'}</td>
                      <td className="p-2 font-bold text-[10px]">
                        <span className={item.isGranted ? 'text-emerald-400' : 'text-amber-400'}>
                          {item.isGranted ? '✓ GRANTED' : '⏳ PENDING'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Local Dev Environment Quick Start */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">3. Local Development Quick Start Commands</h3>
            <p>Run the following terminal commands to bootstrap your local dev server on port 3000:</p>
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-[11px] space-y-1 text-indigo-300">
              <p className="text-slate-500"># 1. Clone repo & create work branch</p>
              <p className="text-slate-200">git clone https://{repoUrl}.git</p>
              <p className="text-slate-200">git checkout -b feature/your-feature-name</p>
              <p className="text-slate-500 mt-2"># 2. Install dependencies & launch local Vite dev server</p>
              <p className="text-slate-200">npm install</p>
              <p className="text-slate-200">npm run dev</p>
              <p className="text-slate-500 mt-2"># 3. Verify TypeScript build and linter prior to PR submission</p>
              <p className="text-slate-200">npm run lint && npm run build</p>
            </div>
          </div>

          {/* SOPs & Communication Schedule */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">4. Daily Standups & Code Review Workflow</h3>
            <p>
              Send an async daily standup message by <strong className="text-white">{standupTime}</strong> with:
            </p>
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 space-y-1 text-[11px] font-mono">
              <p>1. <strong className="text-emerald-300">Completed Today:</strong> What PRs or features were completed.</p>
              <p>2. <strong className="text-indigo-300">Working On Next:</strong> Tasks planned for tomorrow.</p>
              <p>3. <strong className="text-rose-300">Blockers:</strong> Any technical blockers or missing access credentials.</p>
            </div>
          </div>

          {/* Signoff */}
          <div className="border-t border-slate-800 pt-4 text-slate-400 text-[11px] flex justify-between items-center flex-wrap gap-2">
            <span>Guide Generated by Resonance Operations Hub</span>
            <span>Lead Engineer: Christopher James McKay</span>
          </div>
        </div>
      )}
    </div>
  );
};
