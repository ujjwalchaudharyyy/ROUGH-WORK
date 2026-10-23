import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { Incident, Shelter, HazardAlert } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import {
  ShieldAlert,
  MapPin,
  Tent,
  Search,
  Bell,
  Clock,
  ArrowRight,
  PhoneCall,
  CheckCircle2,
  Activity,
} from 'lucide-react';

export const CitizenDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [myIncidents, setMyIncidents] = useState<Incident[]>([]);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [alerts, setAlerts] = useState<HazardAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [incRes, shlRes, altRes] = await Promise.all([
          api.getIncidents({ myReportsOnly: 'true', limit: '5' }),
          api.getShelters({ limit: '4' }),
          api.getAlerts({ status: 'PUBLISHED' }),
        ]);
        setMyIncidents(incRes.incidents || []);
        setShelters(shlRes.shelters?.slice(0, 3) || []);
        setAlerts(altRes.alerts?.slice(0, 2) || []);
      } catch (err) {
        console.error('Citizen dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome & Primary Action Hero */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-red-950/40 border border-red-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/40 font-bold">
              Citizen Emergency Portal
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">
            Hello, {user?.fullName || 'Citizen'}
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            {t('taglinePrimary')} Submit immediate requests for rescue, medical evacuation, food rations, or find verified safe shelters.
          </p>
        </div>

        <Link
          to="/citizen/report"
          className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-sm uppercase font-mono tracking-wider shadow-[0_0_20px_rgba(239,68,68,0.5)] flex items-center gap-2 shrink-0 animate-pulse transition"
        >
          <ShieldAlert className="w-5 h-5" />
          <span>{t('reportEmergency')}</span>
        </Link>
      </div>

      {/* Active Alerts Banner */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 flex items-start justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-2.5">
                <Bell className="w-4 h-4 text-red-400 shrink-0 mt-0.5 animate-bounce" />
                <div>
                  <span className="font-bold text-red-300 font-mono mr-2">{alert.alertCode}</span>
                  <span className="font-semibold text-slate-100">{alert.title}</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">{alert.instructions}</p>
                </div>
              </div>
              <Link to="/citizen/alerts" className="text-cyan-400 hover:underline shrink-0 font-mono text-[11px]">
                Details &rarr;
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Grid: My Requests & Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: My Active Reports */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-100 font-mono flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>My Emergency Requests</span>
            </h2>
            <Link to="/citizen/requests" className="text-xs text-cyan-400 hover:underline font-mono">
              View All ({myIncidents.length})
            </Link>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-500 text-xs font-mono">Loading telemetry...</div>
          ) : myIncidents.length === 0 ? (
            <div className="p-8 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <div className="text-sm font-semibold text-slate-200">No Active Emergency Requests</div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                You have not submitted any active emergency reports. If you or someone nearby is in danger, press the button below.
              </p>
              <Link
                to="/citizen/report"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-medium border border-slate-700 transition"
              >
                Submit Emergency Report
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myIncidents.map((inc) => (
                <div
                  key={inc.id}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-400">{inc.incidentCode}</span>
                      <StatusBadge priority={inc.priorityLevel} />
                    </div>
                    <StatusBadge status={inc.status} />
                  </div>

                  <h3 className="font-semibold text-slate-100 text-sm">{inc.title}</h3>
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{inc.address}</span>
                  </div>

                  {/* Status Progress Mini Tracker */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>
                      People: <b>{inc.affectedPeople}</b> | Assistance: <b>{inc.requiredAssistance}</b>
                    </span>
                    <Link to={`/citizen/requests`} className="text-cyan-400 hover:underline">
                      Track Live &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Quick Links & Shelters */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
            <h3 className="text-xs font-bold text-slate-200 uppercase font-mono">Quick Citizen Actions</h3>
            <div className="grid grid-cols-1 gap-2">
              <Link
                to="/citizen/missing-person"
                className="p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500 text-left transition flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <Search className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="font-semibold text-xs text-slate-200">Missing Person Report</div>
                    <div className="text-[10px] text-slate-400">Search roster & report separated family</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </Link>

              <Link
                to="/citizen/shelters"
                className="p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500 text-left transition flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <Tent className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="font-semibold text-xs text-slate-200">Find Safe Shelters</div>
                    <div className="text-[10px] text-slate-400">View real-time bed capacity and food/water</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </Link>

              <Link
                to="/emergency-resources"
                className="p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-rose-500 text-left transition flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <PhoneCall className="w-4 h-4 text-rose-400" />
                  <div>
                    <div className="font-semibold text-xs text-slate-200">Emergency Hotlines</div>
                    <div className="text-[10px] text-slate-400">Dial 112, 1078 (NDRF), 108 (Ambulance)</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </Link>
            </div>
          </div>

          {/* Nearby Shelters Snapshot */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-200 uppercase font-mono">Open Shelters Nearby</h3>
              <Link to="/citizen/shelters" className="text-[11px] text-cyan-400 hover:underline font-mono">
                All
              </Link>
            </div>

            <div className="space-y-2">
              {shelters.map((s) => (
                <div key={s.id} className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">{s.name}</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                      {s.totalCapacity - s.currentOccupancy} beds free
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">{s.address}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
