import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Mission, RescueTeam } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import {
  Radio,
  Truck,
  CheckCircle2,
  Navigation,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Send,
} from 'lucide-react';

export const ResponderDashboard: React.FC = () => {
  const { user } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [myTeam, setMyTeam] = useState<RescueTeam | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [mRes, tRes] = await Promise.all([
        api.getMissions(),
        api.getTeams(),
      ]);
      setMissions(mRes.missions || []);
      const activeTeam = tRes.teams?.find((t: any) => t.callSign === 'ALPHA-01') || tRes.teams?.[0] || null;
      setMyTeam(activeTeam);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const activeMissions = missions.filter((m) => ['ASSIGNED', 'ACCEPTED', 'EN_ROUTE', 'ON_SCENE'].includes(m.status));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/40 font-bold">
              Field Responder Telemetry
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> ON DUTY
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">
            {myTeam?.name || 'NDRF Rapid Water Rescue Alpha'} ({myTeam?.callSign || 'ALPHA-01'})
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Vehicle: <b>{myTeam?.vehicleType}</b> ({myTeam?.vehiclePlate}) | Capabilities: {myTeam?.capabilities.replace(/,/g, ', ')}
          </p>
        </div>

        <Link
          to="/responder/missions"
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs uppercase font-mono tracking-wider shadow-lg flex items-center gap-2 shrink-0 transition"
        >
          <Radio className="w-4 h-4 animate-pulse" />
          <span>Active Mission Console ({activeMissions.length})</span>
        </Link>
      </div>

      {/* Responder Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400 text-[10px] uppercase">My Active Missions</div>
          <div className="text-2xl font-extrabold text-cyan-400 mt-1">{activeMissions.length}</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400 text-[10px] uppercase">Squad Operational Status</div>
          <div className="text-base font-extrabold text-emerald-400 mt-1">{myTeam?.status || 'AVAILABLE'}</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400 text-[10px] uppercase">Squad Personnel</div>
          <div className="text-2xl font-extrabold text-indigo-400 mt-1">{myTeam?.memberCount || 6} Crew</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400 text-[10px] uppercase">Victims Assisted (Today)</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">
            {missions.reduce((sum, m) => sum + (m.victimsAssisted || 0), 0)}
          </div>
        </div>
      </div>

      {/* Active Mission Spotlight */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono uppercase text-slate-400 font-bold px-1">
          <span>Active Mission Queue</span>
          <Link to="/responder/missions" className="text-cyan-400 hover:underline">
            All Missions &rarr;
          </Link>
        </div>

        {activeMissions.length === 0 ? (
          <div className="p-8 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <div className="text-sm font-semibold text-slate-200">No Pending Emergency Dispatches</div>
            <p className="text-xs text-slate-400">Team is currently on standby in Sector Alpha staging zone.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeMissions.map((m) => (
              <div
                key={m.id}
                className="p-5 rounded-2xl bg-slate-900 border border-indigo-500/40 space-y-3 shadow-xl"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400">
                      {m.incident?.incidentCode}
                    </span>
                    <StatusBadge priority={m.incident?.priorityLevel} />
                    <StatusBadge status={m.status} />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Dispatched: {new Date(m.assignedAt).toLocaleTimeString()}
                  </span>
                </div>

                <h3 className="font-bold text-base text-white">{m.incident?.title}</h3>

                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{m.incident?.address}</span>
                </div>

                {m.dispatcherNotes && (
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-amber-200 font-mono">
                    <b>Dispatcher Directive:</b> {m.dispatcherNotes}
                  </div>
                )}

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-xs font-mono text-slate-400">
                    People to Rescue: <b className="text-white">{m.incident?.affectedPeople}</b>
                  </div>

                  <Link
                    to={`/responder/missions`}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg font-mono uppercase tracking-wider transition flex items-center gap-1.5"
                  >
                    <span>Manage Mission Status &rarr;</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
