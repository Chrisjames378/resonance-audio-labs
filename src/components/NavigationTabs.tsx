import React from 'react';
import { TabId } from '../types';

interface NavigationTabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs: Array<{ id: TabId; label: string; icon: string; badge?: string; badgeColor?: string }> = [
    { id: 'tab-landing', label: '0. Platform Landing & Overview', icon: 'fa-home' },
    {
      id: 'tab-conveyor',
      label: '🌍 Project Conveyor (AMOC Hub)',
      icon: 'fa-globe-americas',
      badge: '★ #1 PRIORITY',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    },
    { id: 'tab-portfolio', label: '1. Multi-Platform Project Dashboard', icon: 'fa-cubes' },
    { id: 'tab-sandbox', label: '2. Interactive Synth Sandbox & AI', icon: 'fa-sliders-h' },
    { id: 'tab-proposal', label: '3. Strategic Proposal & Plan', icon: 'fa-file-contract' },
    { id: 'tab-budget', label: '4. Capital Equipment Allocations', icon: 'fa-calculator' },
    { id: 'tab-financials', label: '5. Financial Projections & Exit Model', icon: 'fa-chart-line' },
    { id: 'tab-architecture', label: '6. Technical Architecture & Schema', icon: 'fa-database' },
    { id: 'tab-hiring', label: '7. Worker Hiring & Proposal Hub', icon: 'fa-user-check' },
  ];

  return (
    <div className="bg-slate-900 border-b border-slate-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto py-2 scrollbar-none" id="navigation-tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                id={`btn-${tab.id}`}
                className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <i className={`fas ${tab.icon}`}></i>
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono border font-bold ${tab.badgeColor || 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
