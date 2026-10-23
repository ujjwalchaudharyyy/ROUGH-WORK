import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, PhoneCall, ShieldAlert, BookOpen, AlertTriangle, CheckSquare } from 'lucide-react';

export const EmergencyResourcesPage: React.FC = () => {
  const helplines = [
    { name: 'National Disaster Response Force (NDRF)', number: '1078', alt: '+91-11-24363260', desc: 'Centralized 24/7 disaster helpline for floods, earthquakes, and landslides' },
    { name: 'National Emergency Response System', number: '112', alt: 'Unified All-India SOS', desc: 'Single emergency phone number for police, fire, and ambulance services' },
    { name: 'Disaster Management Helpline (State)', number: '1070', alt: 'Toll-free 24x7', desc: 'Direct state emergency operations control center dispatch' },
    { name: 'Ambulance Emergency Medical Services', number: '108', alt: 'Immediate ALS Dispatch', desc: 'Government advanced & basic life support medical ambulance network' },
    { name: 'Child Emergency Helpline', number: '1098', alt: 'CHILDLINE India', desc: 'Dedicated 24-hour emergency phone outreach service for children in distress' },
    { name: 'Women Helpline in Distress', number: '1091', alt: 'National Commission for Women', desc: 'Immediate emergency shelter and safety intervention' },
  ];

  const checklist = [
    'Maintain a sealed waterproof pouch with official identity cards and land deeds.',
    'Keep a 72-hour supply of essential chronic medications (insulin, inhalers, blood pressure tablets).',
    'Store 3 liters of potable drinking water per person per day.',
    'Keep a battery-operated radio and heavy-duty LED flashlight with spare batteries.',
    'Establish a designated high-ground meeting point for all separated family members.',
    'Never walk, swim, or drive through moving flood waters — 15 cm of moving water can knock you down.',
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-slate-200 space-y-8">
      <Link to="/" className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:underline">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
      </Link>

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white">Emergency Resources & Helplines</h1>
        <p className="text-sm text-cyan-400 font-mono">
          Immediate contact hotlines, standard operating procedures, and 72-hour survival checklists.
        </p>
      </div>

      {/* Helplines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {helplines.map((h, i) => (
          <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-100">{h.name}</span>
              <a
                href={`tel:${h.number}`}
                className="inline-flex items-center gap-1 font-mono font-bold text-xs bg-red-500/20 text-red-400 border border-red-500/40 px-2 py-0.5 rounded"
              >
                <PhoneCall className="w-3 h-3" />
                <span>{h.number}</span>
              </a>
            </div>
            <div className="text-xs text-slate-400">{h.desc}</div>
            <div className="text-[11px] font-mono text-cyan-400 pt-1 border-t border-slate-800">{h.alt}</div>
          </div>
        ))}
      </div>

      {/* Survival SOP Checklist */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
          <CheckSquare className="w-5 h-5" />
          <span>72-Hour Family Emergency Preparedness SOP</span>
        </div>

        <ul className="space-y-2 text-xs text-slate-300">
          {checklist.map((item, index) => (
            <li key={index} className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
