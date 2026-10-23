import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Shelter } from '../../types';
import { Tent, Save, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const CapacityManagerPage: React.FC = () => {
  const [shelter, setShelter] = useState<Shelter | null>(null);
  const [occupancy, setOccupancy] = useState<number>(340);
  const [totalCap, setTotalCap] = useState<number>(800);
  const [notes, setNotes] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchShelter = async () => {
      try {
        const res = await api.getShelters();
        const active = res.shelters?.find((s: any) => s.code === 'SHL-01') || res.shelters?.[0] || null;
        if (active) {
          setShelter(active);
          setOccupancy(active.currentOccupancy);
          setTotalCap(active.totalCapacity);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchShelter();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shelter) return;
    setSubmitting(true);
    setSuccessMsg(null);
    try {
      await api.updateShelterCapacity(shelter.id, occupancy, notes || 'Routine capacity recount by shelter officer');
      setSuccessMsg('✅ Shelter bed capacity updated live and verified across Command Center dispatch.');
    } catch (err: any) {
      alert(`Update failed: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const freeBeds = Math.max(0, totalCap - occupancy);
  const percentFull = Math.round((occupancy / totalCap) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
          <Tent className="w-6 h-6 text-emerald-400" />
          <span>Shelter Occupancy & Capacity Adjustment</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Update verified bed occupancy and report near-capacity conditions to emergency dispatchers.
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
          {successMsg}
        </div>
      )}

      {shelter && (
        <form onSubmit={handleSave} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 text-xs shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="font-mono text-xs font-bold text-slate-500">{shelter.code}</span>
              <h2 className="text-base font-bold text-white">{shelter.name}</h2>
            </div>
            <div className="text-right font-mono">
              <span className="text-cyan-400 font-bold">{freeBeds} Free Beds</span>
            </div>
          </div>

          {/* Sliders and Counters */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between font-mono text-xs mb-1">
                <span className="text-slate-300 font-bold">Current Verified Occupants:</span>
                <span className="text-cyan-400 font-bold text-sm">{occupancy} Persons</span>
              </div>
              <input
                type="range"
                min={0}
                max={totalCap}
                value={occupancy}
                onChange={(e) => setOccupancy(parseInt(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1">Precise Occupancy Count</label>
                <input
                  type="number"
                  min={0}
                  max={totalCap}
                  value={occupancy}
                  onChange={(e) => setOccupancy(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Total Bed Capacity Limit</label>
                <input
                  type="number"
                  disabled
                  value={totalCap}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-400 font-mono font-bold text-sm cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Shelter Headcount Notes</label>
              <input
                type="text"
                placeholder="e.g. 40 evacuees arrived from Sector 4 causeway at 11:00..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg font-mono uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow-lg"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? 'Updating...' : 'Publish Verified Capacity'}</span>
          </button>
        </form>
      )}
    </div>
  );
};
