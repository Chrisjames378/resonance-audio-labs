import React from 'react';
import { TabId } from '../types';

interface NavigationTabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs: Array<{ id: TabId; label: string; icon: string }> = [
    { id: 'tab-landing', label: '0. Platform Landing & Overview', icon: 'fa-home' },
    { id: 'tab-sandbox', label: '1. Interactive Synth Sandbox & AI', icon: 'fa-sliders-h' },
    { id: 'tab-proposal', label: '2. Strategic Proposal & Plan', icon: 'fa-file-contract' },
    { id: 'tab-budget', label: '3. Capital Equipment Allocations', icon: 'fa-calculator' },
    { id: 'tab-financials', label: '4. Financial Projections & Exit Model', icon: 'fa-chart-line' },
    { id: 'tab-architecture', label: '5. Technical Architecture & Schema', icon: 'fa-database' },
    { id: 'tab-hiring', label: '6. Worker Hiring & Proposal Hub', icon: 'fa-user-check' },
    { id: 'tab-portfolio', label: '7. Multi-Platform Project Dashboard', icon: 'fa-cubes' },
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
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
