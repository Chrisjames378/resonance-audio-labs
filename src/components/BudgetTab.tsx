import React, { useState } from 'react';
import { EquipmentItem } from '../types';

export const INITIAL_EQUIPMENT_DATA: EquipmentItem[] = [
  { id: 'eq1', category: 'Electronics Tools', name: 'Temperature-controlled Soldering Station & Fume Extractor', purpose: 'Safe assembly of synth circuit boards & audio jacks', cost: 450.00, enabled: true },
  { id: 'eq2', category: 'Test Equipment', name: 'Digital Bench Multimeter & USB Logic Analyzer / Oscilloscope', purpose: 'Signal testing & troubleshooting synth audio paths', cost: 650.00, enabled: true },
  { id: 'eq3', category: 'Component Inventory', name: 'Bulk Passives & Audio Hardware (ICs, Pots, Jacks, Switches)', purpose: 'Initial stock to build first production batches', cost: 1200.00, enabled: true },
  { id: 'eq4', category: 'Enclosure Tools', name: 'Bench Precision Rotary Tool & Hand Fabrication Tools', purpose: 'Machining custom aluminium and wooden enclosures', cost: 450.00, enabled: true },
  { id: 'eq5', category: 'Prototyping', name: '3D Printer Filament & Fabrication Materials', purpose: 'Producing custom knobs, faceplates, and skiff cases', cost: 350.00, enabled: true },
  { id: 'eq6', category: 'Safety & Bench', name: 'ESD Antistatic Mat, Safety Glasses, Wire Organizers', purpose: 'Maintaining safe, compliant workshop conditions', cost: 250.00, enabled: true },
  { id: 'eq7', category: 'Digital Setup', name: 'Web Domain, Security, SSL Hosting & PWA Infrastructure (1 Year)', purpose: 'Digital storefront and interactive web app hosting', cost: 300.00, enabled: true },
  { id: 'eq8', category: 'Business Setup', name: 'Public Liability Insurance & Initial Enterprise Branding', purpose: 'Professional operation & trade safety compliance', cost: 650.00, enabled: true },
];

interface BudgetTabProps {
  onShowToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const BudgetTab: React.FC<BudgetTabProps> = ({ onShowToast }) => {
  const [items, setItems] = useState<EquipmentItem[]>(INITIAL_EQUIPMENT_DATA);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCat, setNewCat] = useState('Digital Setup');
  const [newName, setNewName] = useState('');
  const [newPurpose, setNewPurpose] = useState('');
  const [newCost, setNewCost] = useState(150);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
  };

  const totalCost = items.reduce((acc, curr) => (curr.enabled ? acc + curr.cost : acc), 0);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newItem: EquipmentItem = {
      id: `eq_${Date.now()}`,
      category: newCat,
      name: newName.trim(),
      purpose: newPurpose.trim() || 'Capital equipment asset allocation',
      cost: Math.max(0, Number(newCost)),
      enabled: true,
    };

    setItems((prev) => [...prev, newItem]);
    setNewName('');
    setNewPurpose('');
    setShowAddForm(false);
    onShowToast(`Added '${newItem.name}' to allocation table`, 'success');
  };

  const handleExportCSV = () => {
    const enabledItems = items.filter((item) => item.enabled);
    if (enabledItems.length === 0) {
      onShowToast('No items selected for CSV export.', 'warning');
      return;
    }

    let csvContent = 'Category,Item Description,Operational Purpose,Cost (NZD)\n';
    enabledItems.forEach((item) => {
      const cleanCat = `"${item.category.replace(/"/g, '""')}"`;
      const cleanName = `"${item.name.replace(/"/g, '""')}"`;
      const cleanPurpose = `"${item.purpose.replace(/"/g, '""')}"`;
      csvContent += `${cleanCat},${cleanName},${cleanPurpose},${item.cost.toFixed(2)}\n`;
    });

    csvContent += `\n"TOTAL ALLOCATED GRANT REQUEST","","","${totalCost.toFixed(2)} NZD"\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'WINZ_Capital_Equipment_Quote_ResonanceAudioLabs.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onShowToast('Exported CSV Quote for WINZ case manager submission!', 'success');
  };

  const handleExportPDF = () => {
    onShowToast('Preparing formatted PDF quote. Use browser print settings to save as PDF.', 'info');
    setTimeout(() => {
      window.print();
    }, 400);
  };

  return (
    <section id="tab-budget" className="tab-content space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl print-card">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-5">
          <div>
            <h2 className="text-xl font-bold text-white print-text flex items-center gap-2 screen-only">
              <i className="fas fa-tools text-amber-400"></i>
              Capital Equipment & Asset Allocation Breakdown
            </h2>
            <h2 className="text-xl font-bold text-white print-text flex items-center gap-2 print-only">
              <i className="fas fa-tools text-amber-400"></i>
              WINZ Start-Up Grant Itemized Equipment Builder
            </h2>
            <p className="text-xs text-slate-400 mt-1 print-text screen-only">
              Itemized capital budget breakdown for hardware assembly tooling, test benches, and digital infrastructure ($4,300.00 NZD Cap).
            </p>
            <p className="text-xs text-slate-400 mt-1 print-text print-only">
              Itemized quote breakdown for official submission under WINZ Self-Employment Start-Up Assistance ($4,300.00 NZD Cap).
            </p>
          </div>

          {/* Action buttons & Total Counter */}
          <div className="flex items-center gap-2 flex-wrap no-print">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
            >
              <i className="fas fa-file-csv text-sm"></i>
              <span>Export CSV Quote</span>
            </button>
            <button
              onClick={handleExportPDF}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/20 flex items-center gap-1.5 transition-all"
            >
              <i className="fas fa-file-pdf text-sm"></i>
              <span>Print / Export PDF</span>
            </button>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <i className="fas fa-plus-circle"></i>
              <span>{showAddForm ? 'Cancel Add' : 'Add Item'}</span>
            </button>
            <button
              onClick={() => {
                setItems(INITIAL_EQUIPMENT_DATA);
                onShowToast('Reset equipment allocations to default $4,300 NZD list', 'info');
              }}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <i className="fas fa-rotate-left"></i>
              <span>Reset</span>
            </button>
            <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 flex items-center gap-3">
              <span className="text-[11px] text-slate-400 font-mono">GRANT TOTAL:</span>
              <span id="grant-total-display" className="text-xl font-bold font-mono text-emerald-400">
                ${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} NZD
              </span>
            </div>
          </div>
        </div>

        {/* Optional Add Item Form */}
        {showAddForm && (
          <form onSubmit={handleAddItem} className="bg-slate-950 p-4 rounded-xl border border-indigo-500/30 space-y-3 no-print">
            <h4 className="text-xs font-bold text-indigo-300 font-mono">Add New Equipment Quote</h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Category</label>
                <input
                  type="text"
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-slate-400 mb-1">Item Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. High precision audio signal generator"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Cost (NZD)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newCost}
                  onChange={(e) => setNewCost(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-400 text-xs mb-1">Function / Operational Purpose</label>
              <input
                type="text"
                placeholder="e.g. Calibrating output voltage curves"
                value={newPurpose}
                onChange={(e) => setNewPurpose(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-xs"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded text-xs"
            >
              Add Item to Matrix
            </button>
          </form>
        )}

        {/* Interactive Itemized Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase border-b border-slate-800">
              <tr>
                <th className="p-3">Category</th>
                <th className="p-3">Item Description</th>
                <th className="p-3">Function / Operational Purpose</th>
                <th className="p-3 text-right">Cost (NZD)</th>
                <th className="p-3 text-center no-print">Include</th>
              </tr>
            </thead>
            <tbody id="equipment-table-body" className="divide-y divide-slate-800/60 font-mono">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 text-indigo-400 font-semibold">{item.category}</td>
                  <td className={`p-3 ${item.enabled ? 'text-white' : 'text-slate-500 line-through'}`}>{item.name}</td>
                  <td className="p-3 text-slate-400 font-sans">{item.purpose}</td>
                  <td className="p-3 text-right font-bold text-slate-200">
                    ${item.cost.toFixed(2)}
                  </td>
                  <td className="p-3 text-center no-print">
                    <input
                      type="checkbox"
                      checked={item.enabled}
                      onChange={() => toggleItem(item.id)}
                      className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-950 font-mono font-bold border-t-2 border-slate-800">
              <tr>
                <td colSpan={3} className="p-3.5 text-right text-slate-400">
                  SUM TOTAL ALLOCATED:
                </td>
                <td id="equipment-sum-cell" className="p-3.5 text-right text-emerald-400 text-sm">
                  ${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="p-3.5 text-center text-slate-500 no-print">100%</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* WINZ Policy Note */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-200">
          <i className="fas fa-info-circle text-amber-400 text-base mt-0.5"></i>
          <div>
            <strong>WINZ Submission Guideline:</strong> All listed items are backed by standard New Zealand retail market quotes. Upon case manager approval, funds are paid directly to verified suppliers or reimbursed upon tax invoice presentation.
          </div>
        </div>
      </div>
    </section>
  );
};
