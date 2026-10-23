import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Mission } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import {
  Radio,
  CheckCircle2,
  XCircle,
  Truck,
  MapPin,
  Clock,
  Send,
  Navigation,
  FileCheck,
  AlertTriangle,
} from 'lucide-react';

export const MissionsListPage: React.FC = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [declineReason, setDeclineReason] = useState('');
  const [isDeclining, setIsDeclining] = useState(false);
  const [victimsAssisted, setVictimsAssisted] = useState<number>(4);
  const [responderNotes, setResponderNotes] = useState('');
  const [isCompleting, setIsCompleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const fetchMissions = async () => {
    try {
      const res = await api.getMissions();
      setMissions(res.missions || []);
      if (res.missions?.length > 0 && !selectedMission) {
        setSelectedMission(res.missions[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  const handleAccept = async (id: string) => {
    try {
      await api.acceptMission(id);
      setActionMsg('✅ Mission accepted by rescue squad! Status: ACCEPTED');
      fetchMissions();
    } catch (err: any) {
      alert(`Accept failed: ${err.message}`);
    }
  };

  const handleDecline = async (id: string) => {
    if (!declineReason || declineReason.length < 5) {
      alert('Please provide an operational reason for declining.');
      return;
    }
    try {
      await api.declineMission(id, declineReason);
      setActionMsg('⚠️ Mission declined and incident returned to Command Center dispatch queue.');
      setIsDeclining(false);
      setDeclineReason('');
      fetchMissions();
    } catch (err: any) {
      alert(`Decline failed: ${err.message}`);
    }
  };

  const handleEnRoute = async (id: string) => {
    try {
      await api.markMissionEnRoute(id);
      setActionMsg('🚜 Squad is now EN ROUTE to destination.');
      fetchMissions();
    } catch (err: any) {
      alert(`Update failed: ${err.message}`);
    }
  };

  const handleOnScene = async (id: string) => {
    try {
      await api.markMissionOnScene(id);
      setActionMsg('🚨 Squad has arrived ON SCENE. Operations underway.');
      fetchMissions();
    } catch (err: any) {
      alert(`Update failed: ${err.message}`);
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await api.completeMission(id, Number(victimsAssisted), responderNotes || 'All victims evacuated safely.');
      setActionMsg('🎉 Mission successfully marked as COMPLETED. Incident marked RESOLVED.');
      setIsCompleting(false);
      fetchMissions();
    } catch (err: any) {
      alert(`Completion failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
          <Radio className="w-6 h-6 text-red-500" />
          <span>Tactical Mission Management Console</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Execute status progression, record on-scene victim assistance, and upload field completion reports.
        </p>
      </div>

      {actionMsg && (
        <div className="p-3.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-200 text-xs font-mono">
          {actionMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Missions List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-mono uppercase text-slate-400 font-bold px-1">
            Squad Missions ({missions.length})
          </div>

          <div className="space-y-2.5 max-h-[calc(100vh-230px)] overflow-y-auto pr-1">
            {missions.map((m) => (
              <div
                key={m.id}
                onClick={() => setSelectedMission(m)}
                className={`p-4 rounded-xl border cursor-pointer transition space-y-2 ${
                  selectedMission?.id === m.id
                    ? 'border-indigo-500 bg-indigo-950/20 shadow-lg'
                    : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-cyan-400">{m.incident?.incidentCode}</span>
                  <StatusBadge status={m.status} />
                </div>

                <h3 className="font-bold text-slate-100 text-xs line-clamp-1">{m.incident?.title}</h3>
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{m.incident?.address}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Selected Mission Action Card */}
        <div className="lg:col-span-7 space-y-4">
          {selectedMission ? (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400">
                      {selectedMission.incident?.incidentCode}
                    </span>
                    <StatusBadge priority={selectedMission.incident?.priorityLevel} />
                    <StatusBadge status={selectedMission.status} />
                  </div>
                  <h2 className="text-base font-bold text-white mt-1">{selectedMission.incident?.title}</h2>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{selectedMission.incident?.address}</span>
                </div>
                <p className="text-slate-400 leading-relaxed bg-slate-900/60 p-2.5 rounded border border-slate-800">
                  {selectedMission.incident?.description}
                </p>
                {selectedMission.dispatcherNotes && (
                  <div className="p-2 rounded bg-amber-950/40 border border-amber-500/30 text-amber-200 font-mono text-[11px]">
                    <b>Dispatcher Directive:</b> {selectedMission.dispatcherNotes}
                  </div>
                )}
              </div>

              {/* Responder Mission Control Actions */}
              <div className="space-y-3">
                <div className="text-xs font-mono uppercase text-slate-400 font-bold">
                  Tactical Action Stepper
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedMission.status === 'ASSIGNED' && (
                    <>
                      <button
                        onClick={() => handleAccept(selectedMission.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg font-mono uppercase transition flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Accept Mission</span>
                      </button>

                      <button
                        onClick={() => setIsDeclining(!isDeclining)}
                        className="px-4 py-2 bg-slate-800 hover:bg-red-950 text-red-400 border border-slate-700 hover:border-red-500 font-bold text-xs rounded-lg font-mono uppercase transition flex items-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Decline Assignment</span>
                      </button>
                    </>
                  )}

                  {selectedMission.status === 'ACCEPTED' && (
                    <button
                      onClick={() => handleEnRoute(selectedMission.id)}
                      className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg font-mono uppercase transition flex items-center gap-1.5 shadow-lg"
                    >
                      <Truck className="w-4 h-4" />
                      <span>Depart: Move En Route</span>
                    </button>
                  )}

                  {selectedMission.status === 'EN_ROUTE' && (
                    <button
                      onClick={() => handleOnScene(selectedMission.id)}
                      className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-lg font-mono uppercase transition flex items-center gap-1.5 shadow-lg"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Arrived: Mark On Scene</span>
                    </button>
                  )}

                  {selectedMission.status === 'ON_SCENE' && (
                    <button
                      onClick={() => setIsCompleting(true)}
                      className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-lg font-mono uppercase transition flex items-center gap-1.5 shadow-lg"
                    >
                      <FileCheck className="w-4 h-4" />
                      <span>Conclude Rescue & File Report</span>
                    </button>
                  )}

                  {selectedMission.status === 'COMPLETED' && (
                    <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mission completed. {selectedMission.victimsAssisted} victim(s) assisted.</span>
                    </div>
                  )}
                </div>

                {/* Decline Drawer */}
                {isDeclining && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-red-500/40 space-y-2 mt-2">
                    <label className="block text-[11px] text-red-300 font-mono">
                      Mandatory Reason for Declining Assignment:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Current water level exceeds vehicle clearance; impassable bridge..."
                      value={declineReason}
                      onChange={(e) => setDeclineReason(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100"
                    />
                    <button
                      onClick={() => handleDecline(selectedMission.id)}
                      className="py-1.5 px-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded font-mono text-xs transition"
                    >
                      Confirm Rejection & Requeue
                    </button>
                  </div>
                )}

                {/* Completion Modal */}
                {isCompleting && (
                  <div className="p-5 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-3 mt-2 text-xs">
                    <h4 className="font-bold text-white font-mono uppercase text-xs">
                      Post-Operation Rescue Report
                    </h4>

                    <div>
                      <label className="block text-slate-300 mb-1">Total Victims Evacuated / Assisted</label>
                      <input
                        type="number"
                        min={0}
                        value={victimsAssisted}
                        onChange={(e) => setVictimsAssisted(parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1">Field Operation Summary & Notes</label>
                      <textarea
                        rows={2}
                        value={responderNotes}
                        onChange={(e) => setResponderNotes(e.target.value)}
                        placeholder="e.g. All 4 family members evacuated via boat to Metro Indoor Sports Arena Shelter..."
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleComplete(selectedMission.id)}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded font-mono uppercase transition"
                      >
                        Submit Completion & Free Squad
                      </button>
                      <button
                        onClick={() => setIsCompleting(false)}
                        className="px-4 py-2 bg-slate-800 text-slate-400 rounded font-mono transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 font-mono text-xs">
              Select a mission from the queue to view tactical details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
