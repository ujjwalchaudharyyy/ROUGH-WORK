import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Mission } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { History, CheckCircle2, MapPin, Users, FileText } from 'lucide-react';

export const MissionHistoryPage: React.FC = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.getMissions();
        setMissions(res.missions?.filter((m: any) => m.status === 'COMPLETED' || m.completedAt) || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
          <History className="w-6 h-6 text-slate-400" />
          <span>Completed Mission Log & Rescue Outcomes</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Archived debrief records of completed emergency operations, victim counts assisted, and field responder reports.
        </p>
      </div>

      <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase bg-slate-950/60">
                <th className="py-3 px-3">Mission Incident</th>
                <th className="py-3 px-3">Completed Timestamp</th>
                <th className="py-3 px-3">Assigned Squad</th>
                <th className="py-3 px-3 text-center">Victims Assisted</th>
                <th className="py-3 px-3">Field Report & Notes</th>
                <th className="py-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {missions.map((m) => (
                <tr key={m.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 px-3">
                    <div className="font-mono font-bold text-cyan-400 text-xs">
                      {m.incident?.incidentCode}
                    </div>
                    <div className="font-semibold text-slate-200 line-clamp-1">{m.incident?.title}</div>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-400">
                    {m.completedAt ? new Date(m.completedAt).toLocaleString() : 'Recent'}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-300">
                    {m.team?.callSign} ({m.team?.vehicleType})
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-emerald-400 text-sm">
                    {m.victimsAssisted}
                  </td>
                  <td className="py-3 px-3 text-slate-300 text-xs max-w-sm truncate">
                    {m.responderNotes || 'Operation executed without casualties.'}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <StatusBadge status={m.status} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
