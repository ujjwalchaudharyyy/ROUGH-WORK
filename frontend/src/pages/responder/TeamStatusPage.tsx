import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { RescueTeam } from '../../types';
import { Users2, Truck, Phone, Navigation, ShieldCheck, Crosshair } from 'lucide-react';

export const TeamStatusPage: React.FC = () => {
  const [team, setTeam] = useState<RescueTeam | null>(null);
  const [isUpdatingGps, setIsUpdatingGps] = useState(false);
  const [gpsMsg, setGpsMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await api.getTeams();
        const active = res.teams?.find((t: any) => t.callSign === 'ALPHA-01') || res.teams?.[0] || null;
        setTeam(active);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTeam();
  }, []);

  const handleShareGps = () => {
    if (!navigator.geolocation || !team) return;
    setIsUpdatingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          await api.updateTeamLocation(team.id, pos.coords.latitude, pos.coords.longitude);
          setGpsMsg(`📡 GPS Live Telemetry updated: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
          setIsUpdatingGps(false);
        } catch (e: any) {
          alert(`GPS update failed: ${e.message}`);
          setIsUpdatingGps(false);
        }
      },
      (err) => {
        setIsUpdatingGps(false);
        alert(`Location permission denied: ${err.message}`);
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <Users2 className="w-6 h-6 text-indigo-400" />
            <span>Squad Profile & Vehicle Telemetry</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Personnel roster, specialized technical capabilities, and authorized on-duty GPS telemetry.
          </p>
        </div>

        <button
          onClick={handleShareGps}
          disabled={isUpdatingGps}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold font-mono text-xs rounded-lg transition flex items-center gap-1.5 shadow-md"
        >
          <Crosshair className={`w-4 h-4 ${isUpdatingGps ? 'animate-spin' : ''}`} />
          <span>{isUpdatingGps ? 'Transmitting GPS...' : 'Transmit On-Duty GPS'}</span>
        </button>
      </div>

      {gpsMsg && (
        <div className="p-3 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
          {gpsMsg}
        </div>
      )}

      {team && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Squad Specs */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-indigo-400">{team.callSign}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 uppercase font-bold">
                {team.status}
              </span>
            </div>

            <h2 className="text-xl font-bold text-white">{team.name}</h2>

            <div className="space-y-2 text-xs font-mono text-slate-300 pt-2 border-t border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Squad Leader:</span>
                <span className="text-slate-100 font-bold">Sub-Inspector Rajesh Rao</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Crew Strength:</span>
                <span className="text-slate-100 font-bold">{team.memberCount} Certified Responders</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Emergency VHF Radio:</span>
                <span className="text-cyan-400 font-bold">Channel 14 Alpha (156.700 MHz)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Base Dispatch Contact:</span>
                <span className="text-slate-100 font-bold">{team.contactPhone}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <div className="text-[10px] uppercase font-mono text-slate-400 font-bold mb-2">Technical Certifications:</div>
              <div className="flex flex-wrap gap-1.5">
                {team.capabilities.split(',').map((c, i) => (
                  <span key={i} className="text-xs font-mono bg-slate-950 border border-slate-800 text-slate-300 px-2 py-0.5 rounded">
                    {c.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Vehicle Specs */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold">
              <Truck className="w-4 h-4" />
              <span>Assigned Rapid Tactical Vehicle</span>
            </div>

            <h3 className="text-lg font-bold text-white">{team.vehicleType}</h3>

            <div className="space-y-2 text-xs font-mono text-slate-300 pt-2 border-t border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">License Plate:</span>
                <span className="text-cyan-300 font-bold">{team.vehiclePlate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Fuel Level:</span>
                <span className="text-emerald-400 font-bold">88% (Diesel Tank Full)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Current GPS Fix:</span>
                <span className="text-slate-100 font-bold">{team.currentLat.toFixed(4)}, {team.currentLng.toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Water Clearance Depth:</span>
                <span className="text-slate-100 font-bold">1.2 Meters Passable</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 space-y-1">
              <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold">Pre-Flight Vehicle Inspection:</div>
              <div>Battery 24V nominal, high-draw winch operational, marine propeller cleared of debris.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
