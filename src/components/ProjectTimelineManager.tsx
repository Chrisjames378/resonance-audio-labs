import React, { useState, useEffect } from 'react';

export type MilestoneStatus = 'not_started' | 'in_progress' | 'under_review' | 'completed';
export type ProjectCategory = 'audio' | 'saas' | 'ecommerce' | 'mobile_pwa' | 'client_work' | 'general';

export interface Milestone {
  id: string;
  title: string;
  projectName: string;
  category?: ProjectCategory;
  targetDate: string;
  deliverables: string;
  status: MilestoneStatus;
  estimatedHours: number;
}

const DEFAULT_MILESTONES: Milestone[] = [
  {
    id: 'm1',
    title: 'Phase 1: Environment Setup & Architecture Scaffolding',
    projectName: 'SaaS Platform App',
    category: 'saas',
    targetDate: '2026-10-07',
    deliverables: 'Git repo setup, Vite React + TypeScript structure, Tailwind styling, and CI build verification.',
    status: 'completed',
    estimatedHours: 12,
  },
  {
    id: 'm2',
    title: 'Phase 2: Core Feature Implementation & UI Components',
    projectName: 'SaaS Platform App',
    category: 'saas',
    targetDate: '2026-10-14',
    deliverables: 'Primary interactive views, state management hooks, form validations, and user flow integrations.',
    status: 'in_progress',
    estimatedHours: 20,
  },
  {
    id: 'm3',
    title: 'Phase 3: PWA Offline Capabilities & Multi-Tenant Support',
    projectName: 'Mobile PWA App',
    category: 'mobile_pwa',
    targetDate: '2026-10-21',
    deliverables: 'Web App Manifest, Service Worker caching, offline state handling, and PWA install prompt.',
    status: 'not_started',
    estimatedHours: 15,
  },
  {
    id: 'm4',
    title: 'Phase 4: Staging Deployment, QA & Final Client Approval',
    projectName: 'Client Web Build',
    category: 'client_work',
    targetDate: '2026-10-28',
    deliverables: 'Bug fixes, performance profiling, mobile audit, staging preview deployment, and handover documentation.',
    status: 'not_started',
    estimatedHours: 10,
  },
];

const TEMPLATES: { name: string; items: Milestone[] }[] = [
  {
    name: '💻 General SaaS / Web App Build (4-Week Sprint)',
    items: DEFAULT_MILESTONES,
  },
  {
    name: '🛒 E-Commerce & Client Portal Build',
    items: [
      {
        id: 'm_ecom_1',
        title: 'Product Catalog & Shopping Cart State',
        projectName: 'E-Commerce Storefront',
        category: 'ecommerce',
        targetDate: '2026-10-10',
        deliverables: 'Grid view, category filter, cart persistence in localStorage, and price calculator.',
        status: 'completed',
        estimatedHours: 14,
      },
      {
        id: 'm_ecom_2',
        title: 'Checkout Flow & Stripe/PayPal API Gateway',
        projectName: 'E-Commerce Storefront',
        category: 'ecommerce',
        targetDate: '2026-10-18',
        deliverables: 'Payment intent API routes, webhook handling, receipt generation, and order confirmation UI.',
        status: 'in_progress',
        estimatedHours: 18,
      },
    ],
  },
  {
    name: '🔧 Ongoing Maintenance & Daily Site Updates',
    items: [
      {
        id: 'm_maint_1',
        title: 'Weekly Bug Triage & UI Refactoring',
        projectName: 'Cross-App Maintenance',
        category: 'general',
        targetDate: '2026-10-10',
        deliverables: 'Fix reported edge-case bugs, improve contrast/accessibility, and update dependencies.',
        status: 'in_progress',
        estimatedHours: 8,
      },
      {
        id: 'm_maint_2',
        title: 'Performance & Bundle Size Optimization',
        projectName: 'Cross-App Maintenance',
        category: 'general',
        targetDate: '2026-10-20',
        deliverables: 'Optimize asset loading, reduce JavaScript chunk sizes, and verify Lighthouse 95+ score.',
        status: 'not_started',
        estimatedHours: 10,
      },
    ],
  },
  {
    name: '⚡ Audio Synth / Music Software Upgrade',
    items: [
      {
        id: 'm_dsp_1',
        title: 'PolyBLEP Anti-Aliased Oscillator Module',
        projectName: 'Resonance DAW',
        category: 'audio',
        targetDate: '2026-10-12',
        deliverables: 'Implement residual PolyBLEP correction math in Audio Worklet for smooth sawtooth & square waves.',
        status: 'completed',
        estimatedHours: 15,
      },
      {
        id: 'm_dsp_2',
        title: 'Preset Management & Sound Bank JSON Export',
        projectName: 'Resonance DAW',
        category: 'audio',
        targetDate: '2026-10-18',
        deliverables: 'Local storage sound bank, factory patch presets, and user JSON file export.',
        status: 'completed',
        estimatedHours: 12,
      },
    ],
  },
];

const STORAGE_KEY = 'resonance_hiring_milestones_v1';

interface ProjectTimelineManagerProps {
  milestones: Milestone[];
  onChangeMilestones: (updated: Milestone[]) => void;
  includeInContract: boolean;
  onToggleIncludeInContract: (val: boolean) => void;
  onShowToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const ProjectTimelineManager: React.FC<ProjectTimelineManagerProps> = ({
  milestones,
  onChangeMilestones,
  includeInContract,
  onToggleIncludeInContract,
  onShowToast,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);

  // Form fields
  const [formTitle, setFormTitle] = useState('');
  const [formProject, setFormProject] = useState('New Web App');
  const [formCategory, setFormCategory] = useState<ProjectCategory>('saas');
  const [formDate, setFormDate] = useState('2026-10-15');
  const [formDeliverables, setFormDeliverables] = useState('');
  const [formHours, setFormHours] = useState('10');
  const [formStatus, setFormStatus] = useState<MilestoneStatus>('not_started');

  const completedCount = milestones.filter((m) => m.status === 'completed').length;
  const totalCount = milestones.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const totalHours = milestones.reduce((sum, m) => sum + (m.estimatedHours || 0), 0);

  const handleOpenAddModal = () => {
    setEditingMilestoneId(null);
    setFormTitle('');
    setFormProject('New Web App');
    setFormCategory('saas');
    setFormDate(new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10));
    setFormDeliverables('');
    setFormHours('10');
    setFormStatus('not_started');
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (m: Milestone) => {
    setEditingMilestoneId(m.id);
    setFormTitle(m.title);
    setFormProject(m.projectName);
    setFormCategory(m.category || 'saas');
    setFormDate(m.targetDate);
    setFormDeliverables(m.deliverables);
    setFormHours(m.estimatedHours.toString());
    setFormStatus(m.status);
    setIsAddModalOpen(true);
  };

  const handleSaveMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      onShowToast('Please provide a milestone title', 'warning');
      return;
    }

    if (editingMilestoneId) {
      const updated = milestones.map((m) =>
        m.id === editingMilestoneId
          ? {
              ...m,
              title: formTitle.trim(),
              projectName: formProject.trim(),
              category: formCategory,
              targetDate: formDate,
              deliverables: formDeliverables.trim(),
              estimatedHours: parseFloat(formHours) || 0,
              status: formStatus,
            }
          : m
      );
      onChangeMilestones(updated);
      onShowToast(`Milestone updated`, 'success');
    } else {
      const newM: Milestone = {
        id: `ms_${Date.now()}`,
        title: formTitle.trim(),
        projectName: formProject.trim(),
        category: formCategory,
        targetDate: formDate,
        deliverables: formDeliverables.trim(),
        estimatedHours: parseFloat(formHours) || 0,
        status: formStatus,
      };
      onChangeMilestones([...milestones, newM]);
      onShowToast(`New milestone added`, 'success');
    }

    setIsAddModalOpen(false);
  };

  const handleDeleteMilestone = (id: string) => {
    const updated = milestones.filter((m) => m.id !== id);
    onChangeMilestones(updated);
    onShowToast('Milestone removed', 'info');
  };

  const handleCycleStatus = (m: Milestone) => {
    const order: MilestoneStatus[] = ['not_started', 'in_progress', 'under_review', 'completed'];
    const currentIndex = order.indexOf(m.status);
    const nextStatus = order[(currentIndex + 1) % order.length];
    
    const updated = milestones.map((item) => (item.id === m.id ? { ...item, status: nextStatus } : item));
    onChangeMilestones(updated);
  };

  const handleApplyTemplate = (tpl: typeof TEMPLATES[0]) => {
    onChangeMilestones(tpl.items);
    onShowToast(`Loaded template: ${tpl.name}`, 'success');
  };

  const filteredMilestones = milestones.filter((m) => {
    if (filterStatus === 'all') return true;
    return m.status === filterStatus;
  });

  const getStatusBadge = (status: MilestoneStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
            <i className="fas fa-check-circle text-emerald-400"></i> Completed
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
            <i className="fas fa-spinner animate-spin text-indigo-400"></i> In Progress
          </span>
        );
      case 'under_review':
        return (
          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
            <i className="fas fa-search text-amber-400"></i> Under Review
          </span>
        );
      case 'not_started':
      default:
        return (
          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-mono font-bold flex items-center gap-1">
            <i className="fas fa-clock text-slate-500"></i> Pending
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl no-print">
      {/* Header & Control Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <i className="fas fa-tasks text-emerald-400"></i> Project Milestones & Development Timeline
            </h3>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700 text-[10px] font-mono">
              {completedCount}/{totalCount} Completed ({progressPercent}%)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Track app development phases, task status, due dates, and deliverables for worker accountability.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Include in contract checkbox */}
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors">
            <input
              type="checkbox"
              checked={includeInContract}
              onChange={(e) => onToggleIncludeInContract(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Include Schedule in Contract Proposal</span>
          </label>

          <button
            onClick={handleOpenAddModal}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all"
          >
            <i className="fas fa-plus"></i> Add Milestone
          </button>
        </div>
      </div>

      {/* Progress Bar & Summary Stats */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <i className="fas fa-chart-line text-indigo-400"></i> Milestone Progress Gauge
          </span>
          <span className="text-indigo-300 font-bold">{progressPercent}% Completed • {totalHours} Est. Hours</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 flex">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        {/* Quick Filter & Template Presets */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 text-xs">
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-slate-500 text-[10px] uppercase font-bold mr-1">Filter:</span>
            {[
              { id: 'all', label: `All (${totalCount})` },
              { id: 'in_progress', label: 'In Progress' },
              { id: 'completed', label: 'Completed' },
              { id: 'not_started', label: 'Pending' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterStatus(f.id)}
                className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
                  filterStatus === f.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Template presets dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-[10px] uppercase font-bold">Presets:</span>
            <select
              onChange={(e) => {
                const tpl = TEMPLATES.find((t) => t.name === e.target.value);
                if (tpl) handleApplyTemplate(tpl);
              }}
              defaultValue=""
              className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-indigo-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="" disabled>Load Milestone Template...</option>
              {TEMPLATES.map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Interactive Milestones Timeline List */}
      <div className="space-y-3">
        {filteredMilestones.length === 0 ? (
          <div className="text-center py-8 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs text-slate-500 font-mono">
            No milestones match the selected filter.
          </div>
        ) : (
          filteredMilestones.map((m, index) => (
            <div
              key={m.id}
              className={`bg-slate-950 border rounded-xl p-4 transition-all hover:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4 font-sans ${
                m.status === 'completed'
                  ? 'border-emerald-500/30 bg-emerald-950/10'
                  : m.status === 'in_progress'
                  ? 'border-indigo-500/40 bg-indigo-950/10'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1">
                {/* Status Toggle Button */}
                <button
                  onClick={() => handleCycleStatus(m)}
                  className="mt-0.5 shrink-0 hover:scale-110 transition-transform"
                  title="Click to cycle status (Pending -> In Progress -> Under Review -> Completed)"
                >
                  {getStatusBadge(m.status)}
                </button>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-white">{m.title}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-900 text-indigo-300 border border-slate-800">
                      {m.projectName}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">{m.deliverables}</p>
                </div>
              </div>

              {/* Due Date, Hours & Actions */}
              <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 font-mono text-xs border-t md:border-t-0 border-slate-800 pt-2 md:pt-0">
                <div className="text-left md:text-right space-y-0.5">
                  <div className="text-slate-300 font-bold flex items-center gap-1 md:justify-end">
                    <i className="far fa-calendar-alt text-slate-500 text-[10px]"></i>
                    <span>Target: {m.targetDate}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Est: {m.estimatedHours} hrs
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEditModal(m)}
                    className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    title="Edit milestone"
                  >
                    <i className="fas fa-edit text-xs"></i>
                  </button>
                  <button
                    onClick={() => handleDeleteMilestone(m.id)}
                    className="p-1.5 rounded bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Delete milestone"
                  >
                    <i className="fas fa-trash-alt text-xs"></i>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ADD / EDIT MILESTONE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative font-sans text-xs">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <i className="fas fa-times text-sm"></i>
            </button>

            <div className="flex items-center gap-2 text-white font-bold text-base">
              <i className="fas fa-flag text-emerald-400"></i>
              <h3>{editingMilestoneId ? 'Edit Project Milestone' : 'Add New Project Milestone'}</h3>
            </div>

            <form onSubmit={handleSaveMilestone} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Milestone Phase Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Phase 2: Core Feature Implementation"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Project Name</label>
                  <input
                    type="text"
                    value={formProject}
                    onChange={(e) => setFormProject(e.target.value)}
                    placeholder="e.g. Resonator App"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ProjectCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="saas">💻 Web SaaS</option>
                    <option value="ecommerce">🛒 E-Commerce</option>
                    <option value="mobile_pwa">📱 Mobile PWA</option>
                    <option value="client_work">🤝 Client Build</option>
                    <option value="audio">🎵 Audio / Synth</option>
                    <option value="general">🛠️ General Work</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Due Date</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Est. Hours</label>
                  <input
                    type="number"
                    value={formHours}
                    onChange={(e) => setFormHours(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as MilestoneStatus)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="not_started">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="under_review">Under Review</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Deliverables & Scope Description</label>
                <textarea
                  rows={3}
                  value={formDeliverables}
                  onChange={(e) => setFormDeliverables(e.target.value)}
                  placeholder="Detail the specific code modules, features, or updates required..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/20"
                >
                  {editingMilestoneId ? 'Update Milestone' : 'Save Milestone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
