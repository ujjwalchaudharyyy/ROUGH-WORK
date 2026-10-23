import React, { useState } from 'react';
import { Incident, RescueTeam } from '../types';
import { StatusBadge } from './StatusBadge';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  X,
  AlertTriangle,
  Bot,
  CheckCircle2,
  Send,
  Sparkles,
  ShieldCheck,
  UserCheck,
  Clock,
  MapPin,
  Users,
  Activity,
} from 'lucide-react';

interface IncidentDetailDrawerProps {
  incident: Incident | null;
  onClose: () => void;
  onUpdated?: () => void;
}

export const IncidentDetailDrawer: React.FC<IncidentDetailDrawerProps> = ({
  incident,
  onClose,
  onUpdated,
}) => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loadingRecs, setLoadingRecs] = useState<boolean>(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [dispatcherNotes, setDispatcherNotes] = useState<string>('');
  const [isAssigning, setIsAssigning] = useState<boolean>(false);

  // Priority override state
  const [isOverriding, setIsOverriding] = useState<boolean>(false);
  const [overridePriority, setOverridePriority] = useState<string>('P1');
  const [overrideReason, setOverrideReason] = useState<string>('');

  const [message, setMessage] = useState<string | null>(null);

  if (!incident) return null;

  const handleFetchRecommendations = async () => {
    setLoadingRecs(true);
    try {
      const res = await api.getRecommendedTeams(incident.id);
      setRecommendations(res.recommendations || []);
      if (res.recommendations?.length > 0) {
        setSelectedTeamId(res.recommendations[0].teamId);
      }
    } catch (err: any) {
      setMessage(`Failed to get recommendations: ${err.message}`);
    } finally {
      setLoadingRecs(false);
    }
  };

  const handleVerify = async () => {
    try {
      await api.verifyIncident(incident.id);
      setMessage('✅ Incident verified by Command Center.');
      if (onUpdated) onUpdated();
    } catch (err: any) {
      setMessage(`Verification failed: ${err.message}`);
    }
  };

  const handleOverridePriority = async () => {
    if (!overrideReason || overrideReason.length < 5) {
      alert('Please enter an operational reason for the priority override.');
      return;
    }
    try {
      await api.overridePriority(incident.id, overridePriority, overrideReason);
      setMessage('✅ Priority overridden and audit log recorded.');
      setIsOverriding(false);
      if (onUpdated) onUpdated();
    } catch (err: any) {
      setMessage(`Override failed: ${err.message}`);
    }
  };

  const handleAssign = async () => {
    if (!selectedTeamId) {
      alert('Please select a rescue team.');
      return;
    }
    setIsAssigning(true);
    try {
      await api.assignIncident(incident.id, selectedTeamId, dispatcherNotes);
      setMessage('🚀 Team successfully dispatched to incident scene.');
      if (onUpdated) onUpdated();
    } catch (err: any) {
      setMessage(`Assignment failed: ${err.message}`);
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-[#0F172A] border-l border-slate-800 shadow-2xl z-[1500] flex flex-col justify-between overflow-y-auto animate-slide-left">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/80 sticky top-0 z-10 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-cyan-400">{incident.incidentCode}</span>
            <StatusBadge priority={incident.priorityLevel} />
            <StatusBadge status={incident.status} />
          </div>
          <h2 className="text-sm font-bold text-slate-100 mt-1 line-clamp-1">{incident.title}</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4 flex-1 text-xs">
        {message && (
          <div className="p-2.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-200 font-mono text-xs">
            {message}
          </div>
        )}

        {/* Essential Info Cards */}
        <div className="grid grid-cols-2 gap-2 text-slate-300">
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Victims Impacted</div>
            <div className="text-base font-bold text-slate-100 mt-0.5">
              {incident.affectedPeople} Persons
            </div>
            <div className="text-[10px] text-rose-400 mt-0.5">
              Trapped: {incident.trappedCount} | Injured: {incident.injuredCount}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Assistance Needed</div>
            <div className="text-xs font-bold text-cyan-300 mt-0.5">
              {incident.requiredAssistance.replace(/,/g, ', ')}
            </div>
            <div className="text-[10px] text-slate-400 truncate mt-0.5">
              {incident.accessibilityNeeds || 'No special mobility equipment'}
            </div>
          </div>
        </div>

        {/* Location & Details */}
        <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800 space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-slate-200">{incident.address}</div>
              <div className="text-[10px] font-mono text-slate-400">
                Coords: {incident.latitude.toFixed(4)}, {incident.longitude.toFixed(4)}
              </div>
            </div>
          </div>

          <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded border border-slate-800/80">
            {incident.description}
          </p>

          <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
            <span>Reported by: <b>{incident.reporterName || 'Citizen'}</b></span>
            <span>Contact: <b>{incident.reporterContact || 'Protected'}</b></span>
          </div>
        </div>

        {/* AI Emergency Triage Section */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-indigo-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-indigo-300">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>AI Emergency Triage Assessment</span>
            </div>
            <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/40">
              Confidence: {Math.round((incident.aiConfidence || 0.85) * 100)}%
            </span>
          </div>

          <p className="text-slate-300 text-[11px] leading-relaxed">
            {incident.priorityExplanation || 'Safety assessment computed using multi-variable threat model.'}
          </p>

          {incident.identifiedRisks && (
            <div className="space-y-1 pt-1">
              <div className="text-[10px] uppercase font-mono text-amber-400 font-bold">Identified Perils:</div>
              <div className="text-[11px] text-amber-200/90 bg-amber-950/30 p-2 rounded border border-amber-500/20">
                {incident.identifiedRisks}
              </div>
            </div>
          )}

          {incident.suggestedActions && (
            <div className="space-y-1">
              <div className="text-[10px] uppercase font-mono text-cyan-400 font-bold">Recommended Protocols:</div>
              <div className="text-[11px] text-cyan-200/90 bg-cyan-950/30 p-2 rounded border border-cyan-500/20">
                {incident.suggestedActions}
              </div>
            </div>
          )}

          {/* Override Priority Button (Human in the Loop) */}
          <div className="pt-2 flex items-center justify-between border-t border-indigo-500/20">
            <span className="text-[10px] text-slate-400">Human Oversight Required</span>
            <button
              onClick={() => setIsOverriding(!isOverriding)}
              className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 underline"
            >
              {isOverriding ? 'Cancel Override' : 'Override Priority Level'}
            </button>
          </div>

          {isOverriding && (
            <div className="p-2.5 rounded bg-slate-900 border border-slate-700 space-y-2 mt-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-200">New Priority:</span>
                <select
                  value={overridePriority}
                  onChange={(e) => setOverridePriority(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs"
                >
                  <option value="P0">P0 - Immediate Life Threat</option>
                  <option value="P1">P1 - Urgent</option>
                  <option value="P2">P2 - Essential</option>
                  <option value="P3">P3 - Non-Urgent Support</option>
                </select>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Mandatory operational override reason..."
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs text-slate-100 placeholder-slate-500"
                />
              </div>

              <button
                onClick={handleOverridePriority}
                className="w-full py-1 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded text-xs transition"
              >
                Confirm Priority Override
              </button>
            </div>
          )}
        </div>

        {/* Verification Action if still REPORTED */}
        {incident.status === 'REPORTED' && (
          <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-500/40 flex items-center justify-between">
            <div>
              <div className="font-bold text-blue-300">Pending Verification</div>
              <div className="text-[10px] text-slate-400">Authorize incident for dispatch queue</div>
            </div>
            <button
              onClick={handleVerify}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs transition flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verify Report</span>
            </button>
          </div>
        )}

        {/* Dispatch Management */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-200 uppercase font-mono text-xs">Rescue Team Dispatch</span>
            <button
              onClick={handleFetchRecommendations}
              disabled={loadingRecs}
              className="text-[11px] font-mono text-purple-400 hover:text-purple-300 underline"
            >
              {loadingRecs ? 'Calculating Match...' : 'Load Smart Recommendations'}
            </button>
          </div>

          {recommendations.length > 0 ? (
            <div className="space-y-2">
              <label className="text-[10px] text-slate-400 font-mono">RECOMMENDED RESCUE TEAMS:</label>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {recommendations.slice(0, 4).map((rec: any) => (
                  <div
                    key={rec.teamId}
                    onClick={() => setSelectedTeamId(rec.teamId)}
                    className={`p-2 rounded-lg border cursor-pointer transition flex items-center justify-between ${
                      selectedTeamId === rec.teamId
                        ? 'border-cyan-400 bg-cyan-950/40'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-200 text-xs">
                        {rec.name} ({rec.callSign})
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {rec.distanceKm} km away (~{rec.estimatedArrivalMinutes} min) | {rec.vehicleType}
                      </div>
                      <div className="text-[10px] text-emerald-400 mt-0.5">
                        {rec.matchReasons[0] || 'Matches required capabilities'}
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-xs font-bold text-cyan-400">{rec.matchScore}%</div>
                      <div className="text-[9px] text-slate-500">MATCH</div>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Dispatcher guidance / special rescue notes..."
                  value={dispatcherNotes}
                  onChange={(e) => setDispatcherNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500"
                />
              </div>

              <button
                onClick={handleAssign}
                disabled={isAssigning}
                className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-lg text-xs transition shadow-lg flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isAssigning ? 'Transmitting Dispatch Order...' : 'Assign & Dispatch Selected Team'}</span>
              </button>
            </div>
          ) : (
            <p className="text-[11px] text-slate-400 italic">
              Click &ldquo;Load Smart Recommendations&rdquo; to calculate nearest available rescue squads.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
