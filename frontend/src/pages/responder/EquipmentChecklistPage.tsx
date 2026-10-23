import React, { useState } from 'react';
import { ClipboardList, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

export const EquipmentChecklistPage: React.FC = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'Adult USCG-Approved Life Jackets (x8)', category: 'WATER', checked: true },
    { id: 2, name: 'Child Life Vests with Whistles (x4)', category: 'WATER', checked: true },
    { id: 3, name: 'Tactical Trauma First-Aid Backpack & Tourniquets', category: 'MEDICAL', checked: true },
    { id: 4, name: 'Portable Automated External Defibrillator (AED)', category: 'MEDICAL', checked: true },
    { id: 5, name: 'Rechargeable LED Searchlights (x4) & Spare Batteries', category: 'GEAR', checked: true },
    { id: 6, name: 'Heavy-Duty Synthetic Tow Straps & 8000lb Winch', category: 'VEHICLE', checked: true },
    { id: 7, name: 'VHF Emergency Waterproof Handheld Radios (x4)', category: 'COMM', checked: false },
    { id: 8, name: 'Thermal Insulation Emergency Space Blankets (x20)', category: 'GEAR', checked: true },
    { id: 9, name: 'Spill Kit & 2-Stroke Boat Motor Fuel Reserve (20L)', category: 'VEHICLE', checked: false },
    { id: 10, name: 'Water-Sampling Turbidity Kit & Purification Tabs', category: 'MEDICAL', checked: true },
  ]);

  const toggleCheck = (id: number) => {
    setItems(items.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)));
  };

  const completedCount = items.filter((i) => i.checked).length;
  const isReady = completedCount === items.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-amber-400" />
            <span>Pre-Deployment Operational Equipment Checklist</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Mandatory readiness sign-off prior to departing staging camp for active disaster rescue sectors.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-400">Readiness Score:</span>
          <span className={`px-2 py-0.5 rounded font-bold ${isReady ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' : 'bg-amber-950 text-amber-400 border border-amber-500/40'}`}>
            {completedCount} / {items.length} Ready
          </span>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleCheck(item.id)}
            className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
              item.checked
                ? 'bg-slate-950/60 border-slate-800 text-slate-200'
                : 'bg-amber-950/20 border-amber-500/30 text-amber-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => {}}
                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-0"
              />
              <span className={`text-xs font-semibold ${item.checked ? 'text-slate-200' : 'text-amber-200'}`}>
                {item.name}
              </span>
            </div>

            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
              {item.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
