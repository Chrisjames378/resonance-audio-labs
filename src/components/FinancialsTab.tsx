import React, { useState } from 'react';

export const FinancialsTab: React.FC = () => {
  const [subscribers, setSubscribers] = useState(500);
  const [fee, setFee] = useState(15);

  const mrr = subscribers * fee;
  const arr = mrr * 12;
  const valMin = arr * 3.0;
  const valMax = arr * 5.0;

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
    </section>
  );
};
