import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Incident, RescueTeam } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import {
  SendHorizontal,
  Truck,
  AlertOctagon,
  CheckCircle2,
  MapPin,
  Clock,
  Sparkles,
  Bot,
  ShieldAlert,
} from 'lucide-react';

export const SmartDispatchPage: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [teams, setTeams] = useState<RescueTeam[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [dispatcherNotes, setDispatcherNotes] = useState('');
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [incRes, teamRes] = await Promise.all([
        api.getIncidents({ status: 'VERIFIED' }),
        api.getTeams(),
      ]);
      setIncidents(incRes.incidents || []);
      setTeams(teamRes.teams || []);
      if (incRes.incidents?.length > 0 && !selectedIncident) {
        handleSelectIncident(incRes.incidents[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectIncident = async (inc: Incident) => {
    setSelectedIncident(inc);
    setLoadingRecs(true);
    setSuccessMsg(null);
    try {
      const recsRes = await api.getRecommendedTeams(inc.id);
      setRecommendations(recsRes.recommendations || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRecs(false);
    }
  };

  const handleDispatch = async (teamId: string) => {
    if (!selectedIncident) return;
    setIsAssigning(true);
    try {
      await api.assignIncident(selectedIncident.id, teamId, dispatcherNotes);
      setSuccessMsg(`🚀 Mission successfully transmitted! Team dispatched to ${selectedIncident.incidentCode}.`);
      setDispatcherNotes('');
      loadData();
    } catch (err: any) {
      alert(`Assignment failed: ${err.message}`);
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
          <SendHorizontal className="w-6 h-6 text-purple-400" />
          <span>Smart Rescue Dispatch Operations Board</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Algorithmic squad matching: Evaluates proximity distance, specialized capabilities, and active mission workloads.
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Incidents Awaiting Dispatch (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono uppercase text-slate-400 font-bold px-1">
            <span>Verified Incidents Awaiting Dispatch ({incidents.length})</span>
            <span className="text-red-400">P0 First</span>
          </div>

          <div className="space-y-2.5 max-h-[calc(100vh-250px)] overflow-y-auto pr-1">
            {incidents.map((inc) => (
              <div
                key={inc.id}
                onClick={() => handleSelectIncident(inc)}
                className={`p-4 rounded-xl border cursor-pointer transition space-y-2 ${
                  selectedIncident?.id === inc.id
                    ? 'border-purple-500 bg-purple-950/20 shadow-lg'
                    : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-cyan-400">{inc.incidentCode}</span>
                  <StatusBadge priority={inc.priorityLevel} />
                </div>

                <h3 className="font-bold text-slate-100 text-xs">{inc.title}</h3>
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{inc.address}</span>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Impacted: <b className="text-slate-200">{inc.affectedPeople}</b> (Trapped: {inc.trappedCount})</span>
                  <span className="text-purple-400 font-semibold">{inc.category.replace(/_/g, ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Recommended Rescue Squads (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedIncident ? (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400">{selectedIncident.incidentCode}</span>
                    <StatusBadge priority={selectedIncident.priorityLevel} />
                  </div>
                  <h2 className="text-base font-bold text-white mt-1">{selectedIncident.title}</h2>
                </div>
                <div className="text-right text-[11px] font-mono text-slate-400">
                  <div>Needs: <b className="text-cyan-300">{selectedIncident.requiredAssistance}</b></div>
                </div>
              </div>

              {/* Dispatcher Notes Input */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Tactical Instructions / Dispatcher Mission Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Approach from North Ridge bypass; water depth 3ft; bring power skiff..."
                  value={dispatcherNotes}
                  onChange={(e) => setDispatcherNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Recommendations List */}
              <div className="space-y-2">
                <div className="text-xs font-mono uppercase text-slate-300 font-bold flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-cyan-400" />
                  <span>AI & Geospatial Match Recommendations</span>
                </div>

                {loadingRecs ? (
                  <div className="p-8 text-center text-xs font-mono text-slate-500">
                    Calculating distance matrices and capability scores...
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recommendations.map((rec) => (
                      <div
                        key={rec.teamId}
                        className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-100 text-sm">{rec.name}</span>
                            <span className="text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.2 rounded font-bold">
                              {rec.callSign}
                            </span>
                          </div>

                          <div className="text-xs text-slate-400">
                            Vehicle: <b>{rec.vehicleType}</b> | Distance: <b>{rec.distanceKm} km</b> (~{rec.estimatedArrivalMinutes} min)
                          </div>

                          <div className="text-[11px] text-emerald-400">
                            ✓ {rec.matchReasons.join(' • ')}
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                          <div className="text-right font-mono">
                            <div className="text-base font-extrabold text-cyan-400">{rec.matchScore}%</div>
                            <div className="text-[9px] text-slate-500 uppercase">Match Score</div>
                          </div>

                          <button
                            onClick={() => handleDispatch(rec.teamId)}
                            disabled={isAssigning}
                            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-lg font-mono uppercase tracking-wider transition shadow-md disabled:opacity-50"
                          >
                            Dispatch Team
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 font-mono text-xs">
              Select an incident from the left queue to compute smart squad recommendations.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
