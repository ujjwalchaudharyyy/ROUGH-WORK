import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Incident } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import {
  ShieldAlert,
  MapPin,
  Clock,
  Radio,
  CheckCircle2,
  AlertCircle,
  Truck,
  Compass,
  ArrowLeft,
} from 'lucide-react';

export const MyRequestsPage: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const res = await api.getIncidents({ myReportsOnly: 'true' });
        setIncidents(res.incidents || []);
        if (res.incidents?.length > 0) {
          setSelectedIncident(res.incidents[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchIncidents();
  }, []);

  const timelineSteps = [
    { key: 'REPORTED', label: 'Report Received' },
    { key: 'VERIFIED', label: 'Verified by EOC' },
    { key: 'ASSIGNED', label: 'Rescue Team Dispatched' },
    { key: 'ACCEPTED', label: 'Team En Route' },
    { key: 'ON_SCENE', label: 'Responders On Scene' },
    { key: 'RESOLVED', label: 'Rescue Completed' },
  ];

  const getStepStatus = (stepKey: string, currentStatus: string) => {
    const order = ['REPORTED', 'VERIFIED', 'ASSIGNED', 'ACCEPTED', 'EN_ROUTE', 'ON_SCENE', 'RESOLVED'];
    const curIdx = order.indexOf(currentStatus);
    const stepIdx = order.indexOf(stepKey);

    if (currentStatus === 'RESOLVED') return 'COMPLETED';
    if (curIdx >= stepIdx) return 'COMPLETED';
    if (curIdx + 1 === stepIdx) return 'ACTIVE';
    return 'PENDING';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <Compass className="w-6 h-6 text-cyan-400" />
            <span>Track My Emergency Requests</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time status tracking and dispatch telemetry for your submitted emergency reports.
          </p>
        </div>
        <Link
          to="/citizen/report"
          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg transition font-mono uppercase"
        >
          + New Report
        </Link>
      </div>

      {loading ? (
        <div className="p-12 text-center font-mono text-xs text-slate-400">Loading request telemetry...</div>
      ) : incidents.length === 0 ? (
        <div className="p-12 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-slate-500 mx-auto" />
          <div className="text-base font-semibold text-slate-300">No Active Reports Found</div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You have not submitted any emergency requests under this session.
          </p>
          <Link
            to="/citizen/report"
            className="inline-block mt-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg font-mono transition"
          >
            Submit an Emergency Report
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Requests List */}
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase text-slate-400 font-bold px-1">
              Your Requests ({incidents.length})
            </div>
            {incidents.map((inc) => (
              <div
                key={inc.id}
                onClick={() => setSelectedIncident(inc)}
                className={`p-4 rounded-xl border cursor-pointer transition space-y-2 ${
                  selectedIncident?.id === inc.id
                    ? 'border-cyan-500 bg-cyan-950/20 shadow-lg'
                    : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-cyan-400">{inc.incidentCode}</span>
                  <StatusBadge priority={inc.priorityLevel} />
                </div>
                <h3 className="font-semibold text-slate-100 text-xs line-clamp-1">{inc.title}</h3>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800">
                  <span className="text-slate-300 font-medium">{inc.category.replace(/_/g, ' ')}</span>
                  <StatusBadge status={inc.status} size="sm" />
                </div>
              </div>
            ))}
          </div>

          {/* Active Request Detail & Live Timeline */}
          {selectedIncident && (
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-cyan-400">{selectedIncident.incidentCode}</span>
                      <StatusBadge priority={selectedIncident.priorityLevel} />
                      <StatusBadge status={selectedIncident.status} />
                    </div>
                    <h2 className="text-lg font-bold text-white mt-1">{selectedIncident.title}</h2>
                  </div>
                  <div className="text-right text-[11px] font-mono text-slate-400">
                    <div>Logged: {new Date(selectedIncident.createdAt).toLocaleTimeString()}</div>
                    <div className="text-cyan-400">{selectedIncident.category.replace(/_/g, ' ')}</div>
                  </div>
                </div>

                {/* Progress Status Timeline */}
                <div>
                  <div className="text-xs font-mono uppercase text-slate-400 font-bold mb-4">
                    Live Operational Progression
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                    {timelineSteps.map((step, idx) => {
                      const stepState = getStepStatus(step.key, selectedIncident.status);
                      return (
                        <div key={step.key} className="text-center space-y-1.5">
                          <div
                            className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center font-mono text-xs font-bold border transition ${
                              stepState === 'COMPLETED'
                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                                : stepState === 'ACTIVE'
                                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 animate-pulse'
                                : 'bg-slate-950 border-slate-800 text-slate-600'
                            }`}
                          >
                            {stepState === 'COMPLETED' ? '✓' : idx + 1}
                          </div>
                          <div className={`text-[11px] font-medium leading-tight ${stepState === 'COMPLETED' ? 'text-slate-200' : 'text-slate-500'}`}>
                            {step.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Description & Impact */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span>{selectedIncident.address}</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed bg-slate-900/60 p-2.5 rounded border border-slate-800/80">
                    {selectedIncident.description}
                  </p>
                  <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] font-mono text-slate-400">
                    <div>Affected: <b className="text-slate-200">{selectedIncident.affectedPeople}</b></div>
                    <div>Trapped: <b className="text-amber-300">{selectedIncident.trappedCount}</b></div>
                    <div>Injured: <b className="text-red-300">{selectedIncident.injuredCount}</b></div>
                  </div>
                </div>

                {/* Assigned Team Telemetry */}
                {selectedIncident.missions && selectedIncident.missions.length > 0 ? (
                  <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-indigo-300 font-mono">
                        <Truck className="w-4 h-4 text-indigo-400" />
                        <span>Assigned Rescue Squad</span>
                      </div>
                      <span className="font-mono text-emerald-400 font-bold">
                        {selectedIncident.missions[0].status}
                      </span>
                    </div>

                    <div className="text-slate-200 font-semibold">
                      {selectedIncident.missions[0].team?.name || 'NDRF Tactical Unit'} (
                      {selectedIncident.missions[0].team?.callSign || 'RESCUE-01'})
                    </div>

                    <div className="text-[11px] text-slate-400">
                      Vehicle: {selectedIncident.missions[0].team?.vehicleType} | Distance: ~
                      {selectedIncident.missions[0].routeDistanceKm || 3.5} km
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center gap-2 font-mono">
                    <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                    <span>Your incident is verified and queued for nearest rescue squad dispatch.</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
