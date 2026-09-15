import React from 'react';

export const ProposalTab: React.FC = () => {
  return (
    <section id="tab-proposal" className="tab-content space-y-8">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8 print-card">
        {/* Cover Letter Header */}
        <div className="border-b border-slate-800 pb-6 space-y-3">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-bold text-white print-text screen-only">
                Enterprise Business Proposal & Operational Strategy
              </h2>
              <h2 className="text-xl font-bold text-white print-text print-only">
                WINZ Application Cover Letter & Business Proposal
              </h2>
              <p className="text-xs text-slate-400 print-text screen-only">
                Resonance Audio Labs • Executive Overview & Commercial Framework
              </p>
              <p className="text-xs text-slate-400 print-text print-only">
                Work and Income New Zealand • Pukekohe Service Centre
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-mono screen-only">
              Status: Audit & Transfer Ready
            </span>
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-mono print-only">
              Status: WINZ Audit Ready
            </span>
          </div>
        </div>

        {/* Letter Content */}
        <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4 font-sans print-text">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-400 space-y-1 print-card">
            <p>
              <strong>Applicant:</strong> Christopher James McKay
            </p>
            <p>
              <strong>Address:</strong> 43 Ostrich Farm Road, Pukekohe 2676, Auckland, NZ
            </p>
            <p>
              <strong>Date:</strong> 15 September 2026
            </p>
            <p>
              <strong>Email:</strong> resonanceaudiolabs@gmail.com
            </p>
            <p>
              <strong>Target Enterprise Domain:</strong> https://uniagant.website
            </p>
          </div>

          <p className="font-semibold text-white print-text">
            Subject: Business Proposal and Application for Self-Employment Start-up Assistance & Flexi-Wage
          </p>

          <p>To Whom It May Concern,</p>

          <p>
            Please find enclosed the formal business plan and architectural blueprint for my self-employment venture, trading under the registered entity <strong>Resonance Audio Labs</strong>. Following my recent Jobseeker Support reapplication and work assessment criteria, I am submitting this comprehensive proposal to formally request programmatic enterprise support and startup grant funding options, such as the Flexi-wage scheme and Self-Employment Start-up assistance.
          </p>

          <p>
            My venture operates entirely online within the digital music technology sector. The business focuses on the development, optimization, and commercial licensing of web-native Progressive Web Applications (PWAs)—specifically browser-accessible software synthesizers and digital audio workstation (DAW) tools. By leveraging modern web engineering stacks (React, TypeScript, Node.js) alongside scalable cloud data engines, the platform targets global consumers directly from Pukekohe with zero physical manufacturing or shipping overhead.
          </p>

          <p>
            As detailed in the attached documentation, the software architecture is meticulously engineered with a strict commercial focus. All core computing assets, automated processing matrices, and relational database layers are explicitly decoupled from external API keys. This ensures zero technical friction, positioning the proprietary software engines for both ongoing subscription revenue and long-term asset value realization.
          </p>

          <p>
            Given the exceptionally low fixed operational overhead built into this cloud framework (~$65 NZD/month), Resonance Audio Labs is structured to achieve rapid, sustained revenue independent of local economic shifts. This venture presents an immediate, viable pathway to phase out benefit dependency and achieve full self-sufficiency.
          </p>

          <p>
            Thank you for your time and consideration. I look forward to presenting the live web-staging interface and database matrices during our upcoming review session.
          </p>

          <p className="pt-4">
            Yours sincerely,<br />
            <strong className="text-white print-text">Christopher James McKay</strong><br />
            <span className="text-xs text-slate-400 font-mono print-text">
              Principal Founder, Resonance Audio Labs • resonanceaudiolabs@gmail.com • info@uniagant.website
            </span>
          </p>
        </div>

        {/* Executive Summary Sub-Block */}
        <div className="border-t border-slate-800 pt-6 space-y-4">
          <h3 className="text-lg font-bold text-white print-text">Executive Summary & Commercial Framework</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 print-card">
              <h4 className="font-bold text-indigo-400 flex items-center gap-2">
                <i className="fas fa-bullseye"></i> Core Objective
              </h4>
              <p className="text-slate-300 leading-relaxed print-text">
                Commercialize web-native audio synthesis tools to establish a global subscription userbase ($15 NZD/mo per user) while building high-value proprietary intellectual property (DSP code & neural audio matrices).
              </p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 print-card">
              <h4 className="font-bold text-emerald-400 flex items-center gap-2">
                <i className="fas fa-shield-alt"></i> Risk & Overhead Mitigation
              </h4>
              <p className="text-slate-300 leading-relaxed print-text">
                Operating purely as a Progressive Web App eliminates inventory cost, physical shipping, component decay, and localized retail lease liabilities. Server infrastructure scales pay-as-you-go based on active usage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
