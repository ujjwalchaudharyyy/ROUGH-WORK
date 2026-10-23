import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { HazardAlert } from '../../types';
import { BellRing, ShieldAlert, AlertTriangle, Calendar, Building, Radio } from 'lucide-react';

export const CitizenAlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<HazardAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await api.getAlerts({ status: 'PUBLISHED' });
        setAlerts(res.alerts || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
          <BellRing className="w-6 h-6 text-red-500 animate-pulse" />
          <span>Active Hazard Warnings & Evacuation Orders</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Official disaster bulletins issued by State Disaster Management Authorities and IMD meteorological feeds.
        </p>
      </div>

      <div className="space-y-4">
        {alerts.map((a) => {
          const isCritical = a.severity === 'CRITICAL';
          return (
            <div
              key={a.id}
              className={`p-5 rounded-2xl border transition space-y-3 ${
                isCritical
                  ? 'bg-red-950/30 border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-red-400">{a.alertCode}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                      isCritical ? 'bg-red-500 text-white animate-pulse' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    }`}
                  >
                    {a.severity} HAZARD
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Authority: {a.issuingAuthority}</span>
                </div>
              </div>

              <h2 className="text-lg font-bold text-white">{a.title}</h2>

              <div className="text-xs text-slate-300">
                <span className="text-slate-400 font-mono">Affected Geographical Zone:</span>{' '}
                <b className="text-cyan-300">{a.affectedArea}</b> (Radius: {a.radiusKm} km)
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 space-y-1">
                <div className="text-[10px] uppercase font-mono text-amber-400 font-bold">Mandatory Citizen Instructions:</div>
                <p className="leading-relaxed">{a.instructions}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400">
                <span>Valid from: {new Date(a.startsAt).toLocaleDateString()}</span>
                <span>Verification: <b className="text-emerald-400">{a.verificationStatus}</b></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
