import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Shelter } from '../../types';
import {
  Tent,
  MapPin,
  CheckCircle2,
  Droplets,
  Utensils,
  HeartPulse,
  Zap,
  Edit2,
  Save,
  Search,
} from 'lucide-react';

export const SheltersManagementPage: React.FC = () => {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editOccupancy, setEditOccupancy] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchShelters = async () => {
    try {
      const res = await api.getShelters();
      setShelters(res.shelters || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShelters();
  }, []);

  const handleSaveOccupancy = async (shelterId: string) => {
    try {
      await api.updateShelterCapacity(shelterId, editOccupancy, 'Updated via Command Center Shelter Console');
      setEditingId(null);
      fetchShelters();
    } catch (err: any) {
      alert(`Capacity update failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
          <Tent className="w-6 h-6 text-amber-400" />
          <span>Shelter Network & Capacity Coordination</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Live monitoring of designated municipal and Red Cross shelters, bed occupancies, and resource supplies.
        </p>
      </div>

      <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase bg-slate-950/60">
                <th className="py-3 px-3">Code</th>
                <th className="py-3 px-3">Shelter Name & Type</th>
                <th className="py-3 px-3">Location Address</th>
                <th className="py-3 px-3 text-center">Occupancy / Capacity</th>
                <th className="py-3 px-3">Essential Supplies</th>
                <th className="py-3 px-3">Operating Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {shelters.map((s) => {
                const percentFull = Math.round((s.currentOccupancy / s.totalCapacity) * 100);
                const isEditing = editingId === s.id;

                let statusBadge = 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40';
                if (s.status === 'FULL') statusBadge = 'text-red-400 bg-red-950/60 border-red-500/40';
                if (s.status === 'LIMITED_CAPACITY') statusBadge = 'text-amber-400 bg-amber-950/60 border-amber-500/40';

                return (
                  <tr key={s.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-3 font-mono font-bold text-cyan-400">{s.code}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-100">{s.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{s.shelterType}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-400 max-w-xs truncate">{s.address}</td>
                    <td className="py-3 px-3 text-center font-mono">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="number"
                            min={0}
                            max={s.totalCapacity}
                            value={editOccupancy}
                            onChange={(e) => setEditOccupancy(parseInt(e.target.value) || 0)}
                            className="w-16 bg-slate-950 border border-cyan-500 rounded px-1.5 py-0.5 text-center text-xs font-bold"
                          />
                          <span className="text-slate-400">/ {s.totalCapacity}</span>
                        </div>
                      ) : (
                        <div>
                          <span className="font-bold text-slate-200">{s.currentOccupancy}</span> / {s.totalCapacity} (
                          <span className={percentFull >= 90 ? 'text-red-400 font-bold' : 'text-cyan-400'}>{percentFull}%</span>)
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        {s.hasDrinkingWater && <span title="Drinking Water"><Droplets className="w-3.5 h-3.5 text-cyan-400" /></span>}
                        {s.hasFood && <span title="Food Rations"><Utensils className="w-3.5 h-3.5 text-emerald-400" /></span>}
                        {s.hasMedicalSupport && <span title="Medical Support"><HeartPulse className="w-3.5 h-3.5 text-purple-400" /></span>}
                        {s.hasPower && <span title="Generator Power"><Zap className="w-3.5 h-3.5 text-amber-400" /></span>}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${statusBadge}`}>
                        {s.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleSaveOccupancy(s.id)}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-mono text-[10px] flex items-center gap-1"
                          >
                            <Save className="w-3 h-3" /> Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-2 py-1 bg-slate-800 text-slate-400 rounded font-mono text-[10px]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingId(s.id);
                            setEditOccupancy(s.currentOccupancy);
                          }}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 font-mono text-[10px] inline-flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" /> Edit
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
