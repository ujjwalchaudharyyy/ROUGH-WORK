import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { RescueTeam } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import {
  Users2,
  Truck,
  PhoneCall,
  MapPin,
  CheckCircle2,
  Clock,
  Radio,
  RefreshCw,
} from 'lucide-react';

export const TeamsManagementPage: React.FC = () => {
  const [teams, setTeams] = useState<RescueTeam[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeams = async () => {
    try {
      const res = await api.getTeams();
      setTeams(res.teams || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleUpdateStatus = async (teamId: string, status: string) => {
    try {
      await api.updateTeamStatus(teamId, status);
      fetchTeams();
    } catch (err: any) {
      alert(`Status update failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <Users2 className="w-6 h-6 text-blue-400" />
            <span>Rescue Fleet & Taskforce Tracking</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time status, vehicle specifications, and tactical telemetry for active emergency responder units.
          </p>
        </div>

        <button
          onClick={fetchTeams}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs rounded-lg border border-slate-700 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Fleet Telemetry</span>
        </button>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((t) => {
          let statusColor = 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40';
          if (t.status === 'DISPATCHED' || t.status === 'ON_SCENE') {
            statusColor = 'text-cyan-400 bg-cyan-950/60 border-cyan-500/40';
          } else if (t.status === 'RESTING' || t.status === 'UNAVAILABLE') {
            statusColor = 'text-amber-400 bg-amber-950/60 border-amber-500/40';
          }

          return (
            <div key={t.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-indigo-400">{t.callSign}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${statusColor}`}>
                    {t.status}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-100 mt-1">{t.name}</h3>

                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400">
                  <div>Vehicle: <b className="text-slate-200">{t.vehicleType}</b></div>
                  <div>Plate: <b className="text-slate-200">{t.vehiclePlate}</b></div>
                  <div>Personnel: <b className="text-slate-200">{t.memberCount} Responders</b></div>
                  <div>Leader: <b className="text-slate-200">{t.callSign.slice(0, 5)}</b></div>
                </div>

                <div className="mt-2 text-xs">
                  <div className="text-[10px] uppercase font-mono text-slate-400 font-bold mb-1">Capabilities:</div>
                  <div className="flex flex-wrap gap-1">
                    {t.capabilities.split(',').map((cap, i) => (
                      <span key={i} className="text-[10px] font-mono bg-slate-950 text-slate-300 border border-slate-800 px-1.5 py-0.2 rounded">
                        {cap.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status Selector & Contact */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <select
                  value={t.status}
                  onChange={(e) => handleUpdateStatus(t.id, e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs font-mono"
                >
                  <option value="AVAILABLE">AVAILABLE (Standby)</option>
                  <option value="DISPATCHED">DISPATCHED</option>
                  <option value="ON_SCENE">ON SCENE</option>
                  <option value="RESTING">RESTING</option>
                  <option value="UNAVAILABLE">UNAVAILABLE</option>
                </select>

                <a
                  href={`tel:${t.contactPhone}`}
                  className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-mono"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Squad</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
