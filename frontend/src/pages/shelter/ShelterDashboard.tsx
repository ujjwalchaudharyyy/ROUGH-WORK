import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Shelter } from '../../types';
import {
  Tent,
  Users2,
  Boxes,
  ClipboardList,
  AlertTriangle,
  Droplets,
  Utensils,
  HeartPulse,
  Zap,
} from 'lucide-react';

export const ShelterDashboard: React.FC = () => {
  const [shelter, setShelter] = useState<Shelter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShelter = async () => {
      try {
        const res = await api.getShelters();
        const active = res.shelters?.find((s: any) => s.code === 'SHL-01') || res.shelters?.[0] || null;
        setShelter(active);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchShelter();
  }, []);

  if (!shelter) {
    return <div className="p-12 text-center text-slate-500 font-mono text-xs">Loading shelter data...</div>;
  }

  const freeBeds = Math.max(0, shelter.totalCapacity - shelter.currentOccupancy);
  const percentFull = Math.round((shelter.currentOccupancy / shelter.totalCapacity) * 100);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/40 font-bold">
              Shelter Operations Hub
            </span>
            <span className="text-xs font-mono text-slate-400">ID: {shelter.code}</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">{shelter.name}</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">{shelter.address}</p>
        </div>

        <Link
          to="/shelter/registrations"
          className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs uppercase font-mono tracking-wider shadow-lg flex items-center gap-2 shrink-0 transition"
        >
          <Users2 className="w-4 h-4" />
          <span>Check-In Family / Citizen</span>
        </Link>
      </div>

      {/* Capacity & Logistics KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400 text-[10px] uppercase">Current Occupancy</div>
          <div className="text-2xl font-extrabold text-cyan-400 mt-1">
            {shelter.currentOccupancy} <span className="text-xs text-slate-500">/ {shelter.totalCapacity}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400 text-[10px] uppercase">Available Free Beds</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">{freeBeds}</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400 text-[10px] uppercase">Absorption Rate</div>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">{percentFull}% Full</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400 text-[10px] uppercase">Shelter Condition</div>
          <div className="text-base font-extrabold text-slate-200 mt-1">{shelter.status.replace(/_/g, ' ')}</div>
        </div>
      </div>

      {/* Facilities Status Strip */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-slate-200 font-mono uppercase">Critical Shelter Life Support Systems</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${shelter.hasDrinkingWater ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-300' : 'bg-red-950/40 border-red-500/30 text-red-400'}`}>
            <Droplets className="w-5 h-5 shrink-0" />
            <div>
              <div className="font-bold">Potable Water</div>
              <div className="text-[10px] text-slate-400">{shelter.hasDrinkingWater ? 'Reservoir Online' : 'DEPLETED'}</div>
            </div>
          </div>

          <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${shelter.hasFood ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300' : 'bg-red-950/40 border-red-500/30 text-red-400'}`}>
            <Utensils className="w-5 h-5 shrink-0" />
            <div>
              <div className="font-bold">Meal Supplies</div>
              <div className="text-[10px] text-slate-400">{shelter.hasFood ? 'Community Kitchen Active' : 'Rations Required'}</div>
            </div>
          </div>

          <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${shelter.hasMedicalSupport ? 'bg-purple-950/40 border-purple-500/30 text-purple-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
            <HeartPulse className="w-5 h-5 shrink-0" />
            <div>
              <div className="font-bold">Medical Triage</div>
              <div className="text-[10px] text-slate-400">{shelter.hasMedicalSupport ? 'First-Aid Post Active' : 'No On-Site Nurse'}</div>
            </div>
          </div>

          <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${shelter.hasPower ? 'bg-amber-950/40 border-amber-500/30 text-amber-300' : 'bg-red-950/40 border-red-500/30 text-red-400'}`}>
            <Zap className="w-5 h-5 shrink-0" />
            <div>
              <div className="font-bold">Power Supply</div>
              <div className="text-[10px] text-slate-400">{shelter.hasPower ? 'Generator Backed Up' : 'Grid Blackout'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
