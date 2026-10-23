import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Shelter } from '../../types';
import {
  Tent,
  MapPin,
  PhoneCall,
  CheckCircle2,
  Droplets,
  Utensils,
  HeartPulse,
  Zap,
  Search,
  Filter,
} from 'lucide-react';

export const SheltersFinderPage: React.FC = () => {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [search, setSearch] = useState('');
  const [hasMedical, setHasMedical] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShelters = async () => {
      try {
        const res = await api.getShelters({
          search,
          hasMedical: hasMedical ? 'true' : undefined,
        });
        setShelters(res.shelters || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchShelters();
  }, [search, hasMedical]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
          <Tent className="w-6 h-6 text-emerald-400" />
          <span>Verified Relief Shelters Directory</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Government and Red Cross designated safe camps with live bed capacity, drinking water, and medical resources.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search shelters by name, area, or school..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <button
          onClick={() => setHasMedical(!hasMedical)}
          className={`px-3 py-2.5 rounded-xl border text-xs font-mono transition flex items-center gap-1.5 ${
            hasMedical
              ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300 font-bold'
              : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
          }`}
        >
          <HeartPulse className="w-3.5 h-3.5" />
          <span>Medical Support Station Required</span>
        </button>
      </div>

      {/* Shelters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shelters.map((s) => {
          const freeBeds = Math.max(0, s.totalCapacity - s.currentOccupancy);
          const percentFull = Math.round((s.currentOccupancy / s.totalCapacity) * 100);

          let statusColor = 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40';
          if (s.status === 'FULL') statusColor = 'text-red-400 bg-red-950/60 border-red-500/40';
          if (s.status === 'LIMITED_CAPACITY') statusColor = 'text-amber-400 bg-amber-950/60 border-amber-500/40';

          return (
            <div key={s.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-bold text-slate-500">{s.code}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${statusColor}`}>
                    {s.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-100">{s.name}</h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="line-clamp-1">{s.address}</span>
                </div>

                {/* Capacity Progress Bar */}
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Available Space:</span>
                    <span className="font-bold text-cyan-300">
                      {freeBeds} Free ({percentFull}% Full)
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        percentFull >= 95 ? 'bg-red-500' : percentFull >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, percentFull)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Facilities Badges */}
                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-800/80">
                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono ${
                      s.hasDrinkingWater ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30' : 'bg-slate-950 text-slate-500'
                    }`}
                  >
                    <Droplets className="w-3 h-3" /> Potable Water
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono ${
                      s.hasFood ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' : 'bg-slate-950 text-slate-500'
                    }`}
                  >
                    <Utensils className="w-3 h-3" /> Meal Rations
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono ${
                      s.hasMedicalSupport ? 'bg-purple-950 text-purple-300 border border-purple-500/30' : 'bg-slate-950 text-slate-500'
                    }`}
                  >
                    <HeartPulse className="w-3 h-3" /> Medical Annex
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono ${
                      s.hasPower ? 'bg-amber-950 text-amber-300 border border-amber-500/30' : 'bg-slate-950 text-slate-500'
                    }`}
                  >
                    <Zap className="w-3 h-3" /> Generator Power
                  </span>
                </div>
              </div>

              {/* Action Hotline */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[10px] font-mono">Verified Live</span>
                <a
                  href={`tel:${s.contactPhone}`}
                  className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-mono font-semibold"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>{s.contactPhone}</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
