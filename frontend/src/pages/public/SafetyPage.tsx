import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Lock, AlertTriangle, Eye, CheckCircle2 } from 'lucide-react';

export const SafetyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-slate-200 space-y-8">
      <Link to="/" className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:underline">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
      </Link>

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white">Safety Protocols & Responsible AI</h1>
        <p className="text-sm text-cyan-400 font-mono">
          Strict operational guidelines governing algorithmic prioritization and life-critical emergency decisions.
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
            <CheckCircle2 className="w-5 h-5" />
            <span>1. Deterministic Safety Fallback Baseline</span>
          </div>
          <p className="text-xs text-slate-400">
            Emergency prioritization cannot rely solely on opaque statistical language models. DisplaceOS implements
            a strict deterministic rule engine as the foundational baseline. If keywords indicating entrapment, severe bleeding,
            structural collapse, or children/elderly vulnerability are detected, the system immediately forces a P0 or P1
            safety classification regardless of external API connectivity.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-base">
            <Eye className="w-5 h-5" />
            <span>2. Human-in-the-Loop Override Policy</span>
          </div>
          <p className="text-xs text-slate-400">
            No incident can be closed or downgraded solely by artificial intelligence. Authorized dispatchers in the Command
            Center have full authority to override any AI suggestion. Every override requires an explicit, recorded reason
            stored permanently in the system audit log.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
            <Lock className="w-5 h-5" />
            <span>3. Zero-Trust Privacy & PII Protection</span>
          </div>
          <p className="text-xs text-slate-400">
            Affected citizens in distress entrust sensitive information, including exact indoor locations, medical diagnoses,
            and personal phone numbers. DisplaceOS redacts private contact details for unauthorized or public users. Only
            authorized Command Center officers and deployed rescue squad leaders can access verified responder contact details.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-red-400 font-bold text-base">
            <AlertTriangle className="w-5 h-5" />
            <span>4. Verification Transparency</span>
          </div>
          <p className="text-xs text-slate-400">
            Community-submitted reports are clearly designated as <code>REPORTED</code> until verified by emergency coordinators.
            Road blockages, hazard warnings, and missing person sightings remain explicitly flagged until field confirmation,
            preventing misinformation panics during high-stress operational periods.
          </p>
        </div>
      </div>
    </div>
  );
};
