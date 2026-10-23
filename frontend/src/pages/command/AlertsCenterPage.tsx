import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { HazardAlert } from '../../types';
import {
  BellRing,
  PlusCircle,
  AlertTriangle,
  Radio,
  Trash2,
  CheckCircle2,
  Send,
} from 'lucide-react';

export const AlertsCenterPage: React.FC = () => {
  const [alerts, setAlerts] = useState<HazardAlert[]>([]);
  const [isDrafting, setIsDrafting] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('FLOOD_WARNING');
  const [severity, setSeverity] = useState('HIGH');
  const [affectedArea, setAffectedArea] = useState('');
  const [instructions, setInstructions] = useState('');
  const [radiusKm, setRadiusKm] = useState<number>(12);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchAlerts = async () => {
    try {
      const res = await api.getAlerts({ status: 'ALL' });
      setAlerts(res.alerts || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createAlert({
        title,
        category,
        severity,
        affectedArea,
        instructions,
        radiusKm: Number(radiusKm),
        latitude: 19.0760,
        longitude: 72.8777,
        status: 'PUBLISHED',
      });
      setSuccessMsg('🚨 Emergency hazard alert broadcasted across all active channels!');
      setIsDrafting(false);
      setTitle('');
      setAffectedArea('');
      setInstructions('');
      fetchAlerts();
    } catch (err: any) {
      alert(`Alert creation failed: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevoke = async (alertId: string) => {
    if (!confirm('Are you sure you want to revoke this emergency hazard bulletin?')) return;
    try {
      await api.revokeAlert(alertId);
      fetchAlerts();
    } catch (err: any) {
      alert(`Revocation failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <BellRing className="w-6 h-6 text-amber-500" />
            <span>Hazard Alerts & Early-Warning Center</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Broadcast emergency evacuation orders, meteorology alerts, and flood bulletins to field responders and citizens.
          </p>
        </div>

        <button
          onClick={() => setIsDrafting(!isDrafting)}
          className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs rounded-lg transition font-mono uppercase flex items-center gap-1.5 shadow-md"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{isDrafting ? 'Cancel Draft' : 'Draft New Alert'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
          {successMsg}
        </div>
      )}

      {/* Draft Form */}
      {isDrafting && (
        <form onSubmit={handleCreateAlert} className="p-6 rounded-2xl bg-slate-900 border border-red-500/40 space-y-4 text-xs shadow-2xl">
          <h3 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
            <Radio className="w-4 h-4 text-red-500 animate-pulse" />
            <span>Emergency Hazard Bulletin Dispatch</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Alert Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100"
              >
                <option value="FLOOD_WARNING">Flash Flood Warning</option>
                <option value="LANDSLIDE_RISK">Landslide Slope Risk</option>
                <option value="EVACUATION_ORDER">Mandatory Evacuation Order</option>
                <option value="CYCLONE">Severe Cyclonic Storm</option>
                <option value="FIRE_ALERT">Wildfire / Industrial Smoke Alert</option>
                <option value="ROAD_CLOSURE">Critical Artery Road Closure</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Severity Classification</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100 font-bold"
              >
                <option value="CRITICAL">CRITICAL (Immediate Peril to Life)</option>
                <option value="HIGH">HIGH (Urgent Precautions Required)</option>
                <option value="MODERATE">MODERATE (Advisory Notice)</option>
                <option value="LOW">LOW (Informational)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Impact Radius (KM)</label>
              <input
                type="number"
                min={1}
                max={100}
                value={radiusKm}
                onChange={(e) => setRadiusKm(parseInt(e.target.value) || 12)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Headline Bulletin Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 🔴 RED ALERT: Severe Flash Flooding in Dharavi Creek Basin"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-semibold"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Target Geographical Area *</label>
            <input
              type="text"
              required
              value={affectedArea}
              onChange={(e) => setAffectedArea(e.target.value)}
              placeholder="e.g. Sector 3-B, Low-Lying Wards 7 & 8, Kalina Valley Corridor"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Protective Instructions for Citizens & Responders *</label>
            <textarea
              required
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Exact actions to take, evacuation muster points, free transit buses, and hazards to avoid..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg font-mono uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow-lg disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Broadcasting Alert...' : 'Broadcast Emergency Hazard Bulletin'}</span>
          </button>
        </form>
      )}

      {/* Alerts Roster */}
      <div className="space-y-4">
        {alerts.map((a) => {
          const isPublished = a.status === 'PUBLISHED';
          const isCritical = a.severity === 'CRITICAL';

          return (
            <div
              key={a.id}
              className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
                isCritical && isPublished
                  ? 'bg-red-950/20 border-red-500/50'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-red-400">{a.alertCode}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.2 rounded font-bold uppercase ${
                      isCritical ? 'bg-red-500 text-white' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {a.severity}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Status: <b className={isPublished ? 'text-emerald-400' : 'text-slate-500'}>{a.status}</b>
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-100">{a.title}</h3>
                <div className="text-xs text-slate-300">
                  Target: <b>{a.affectedArea}</b> (Radius: {a.radiusKm} km)
                </div>
                <div className="text-[11px] text-slate-400 italic bg-slate-950/60 p-2 rounded border border-slate-800">
                  {a.instructions}
                </div>
              </div>

              {isPublished && (
                <div className="shrink-0 flex items-center gap-2">
                  <button
                    onClick={() => handleRevoke(a.id)}
                    className="px-3 py-1.5 rounded bg-slate-800 hover:bg-red-900 text-red-300 border border-slate-700 hover:border-red-500 text-xs font-mono transition flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Revoke Alert</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
