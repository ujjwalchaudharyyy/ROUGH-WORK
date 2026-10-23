import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Incident, OverviewKPIs, HazardAlert } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { IncidentDetailDrawer } from '../../components/IncidentDetailDrawer';
import { FourKCommandCenter } from './FourKCommandCenter';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  AlertOctagon,
  Users,
  ShieldAlert,
  Tent,
  Truck,
  Droplets,
  Clock,
  BellRing,
  TrendingUp,
  Activity,
  ArrowRight,
  Filter,
  PlusCircle,
  FileSpreadsheet,
} from 'lucide-react';

export const CommandDashboard: React.FC = () => {
  const [kpis, setKpis] = useState<OverviewKPIs | null>(null);
  const [charts, setCharts] = useState<any>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [alerts, setAlerts] = useState<HazardAlert[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'4k' | 'detailed'>('4k');

  const loadData = async () => {
    try {
      const [overviewRes, incRes, alertRes] = await Promise.all([
        api.getAnalyticsOverview(),
        api.getIncidents({ limit: '10', category: filterCategory !== 'ALL' ? filterCategory : undefined }),
        api.getAlerts({ status: 'PUBLISHED' }),
      ]);
      setKpis(overviewRes.kpis);
      setCharts(overviewRes.charts);
      setIncidents(incRes.incidents || []);
      setAlerts(alertRes.alerts || []);
    } catch (err) {
      console.error('Command dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000); // 15s refresh
    return () => clearInterval(interval);
  }, [filterCategory]);

  if (viewMode === '4k') {
    return (
      <div className="w-full min-h-screen bg-[#07090D] flex flex-col font-sans">
        {/* Top Control Switcher Bar */}
        <div className="bg-[#0A0C11] border-b border-[#1A1C24] px-4 py-2 flex items-center justify-between text-xs select-none">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-volt animate-pulse"></span>
            <span className="font-heading tracking-wide uppercase text-white text-xs font-normal">
              EOC TACTICAL COMMAND CENTER • 4K ULTRA VIEW
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('4k')}
              className="px-3 py-1 rounded-full text-xs font-heading tracking-wider uppercase font-bold transition bg-volt text-black shadow-sm"
            >
              4K COMMAND VIEW
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              className="px-3 py-1 rounded-full text-xs font-heading tracking-wider uppercase font-bold transition bg-[#14161E] text-slate-400 hover:text-white"
            >
              INCIDENT QUEUE & ANALYTICS
            </button>
          </div>
        </div>

        {/* 4K Panoramic Command View */}
        <FourKCommandCenter />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 bg-[#0A0B0E] min-h-screen">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-volt animate-pulse"></span>
            <h1 className="text-3xl font-heading tracking-wide uppercase text-white font-normal">
              EXECUTIVE COMMAND OPERATIONS CENTER
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Operational Region: Sector Alpha (Metro Coastal Valley) | Threat Level: RED
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Switcher back to 4K view */}
          <button
            onClick={() => setViewMode('4k')}
            className="px-3.5 py-1.5 rounded-full bg-volt text-black font-heading tracking-wider text-xs uppercase font-bold shadow-sm hover:scale-105 transition"
          >
            ← 4K ULTRA COMMAND VIEW
          </button>
          {/* Quick Filter */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-transparent text-slate-200 text-xs focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="FLOOD">Floods</option>
              <option value="BUILDING_COLLAPSE">Collapse</option>
              <option value="LANDSLIDE">Landslides</option>
              <option value="MEDICAL_EMERGENCY">Medical</option>
              <option value="FOOD_WATER_SHORTAGE">Supplies Shortage</option>
            </select>
          </div>

          <Link
            to="/citizen/report"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg transition font-mono shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Incident</span>
          </Link>

          <Link
            to="/command/dispatch"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg transition font-mono shadow-md"
          >
            <Truck className="w-4 h-4" />
            <span>Smart Dispatch</span>
          </Link>

          <a
            href="/api/analytics/export-csv"
            download
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-lg border border-slate-700 transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>CSV Export</span>
          </a>
        </div>
      </div>

      {/* Primary KPI Stats Grid (12 Live Metrics calculated from DB) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* P0 Critical */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-red-500/40 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-slate-400 font-mono text-[10px] uppercase">
            <span>P0 Critical Life Threats</span>
            <AlertOctagon className="w-4 h-4 text-red-500 animate-pulse" />
          </div>
          <div className="text-2xl font-extrabold text-red-400 font-mono mt-1">
            {kpis?.p0Count ?? 0}
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
            Immediate dispatch queue
          </div>
        </div>

        {/* People Awaiting Assistance */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-amber-500/40 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-slate-400 font-mono text-[10px] uppercase">
            <span>People Awaiting Help</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400 font-mono mt-1">
            {kpis?.peopleAwaitingHelp ?? 0}
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
            Trapped: <b className="text-slate-200">{kpis?.trappedTotal ?? 0}</b> | Injured: <b className="text-slate-200">{kpis?.injuredTotal ?? 0}</b>
          </div>
        </div>

        {/* Rescue Teams Deployed */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/40 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-slate-400 font-mono text-[10px] uppercase">
            <span>Rescue Fleet Active</span>
            <Truck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-cyan-300 font-mono mt-1">
            {kpis?.teamsDeployed ?? 0} <span className="text-xs text-slate-500 font-normal">/ {kpis?.totalTeams ?? 0}</span>
          </div>
          <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
            {kpis?.teamsAvailable ?? 0} Available on Standby
          </div>
        </div>

        {/* Open Shelter Capacity */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-emerald-500/40 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-slate-400 font-mono text-[10px] uppercase">
            <span>Open Shelter Beds</span>
            <Tent className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">
            {kpis?.openShelterCapacity ?? 0}
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
            Occupancy: {kpis?.shelterOccupancyRate ?? 0}% Full
          </div>
        </div>

        {/* Food & Water Reserves */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-slate-400 font-mono text-[10px] uppercase">
            <span>Relief Logistics Stock</span>
            <Droplets className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-blue-400 font-mono mt-1">
            {kpis?.foodPacketsTotal ?? 0}
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
            MRE Packets | {kpis?.waterLitersTotal ?? 0}L Water
          </div>
        </div>

        {/* Avg Response Time */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-slate-400 font-mono text-[10px] uppercase">
            <span>Avg Response Speed</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-indigo-400 font-mono mt-1">
            {kpis?.avgResponseTimeMinutes ?? 18}m
          </div>
          <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
            Resolved Today: {kpis?.resolvedToday ?? 0}
          </div>
        </div>
      </div>

      {/* Visual Analytics Row: Severity & Category Breakdown Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Incident Severity Breakdown Chart */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-slate-200 font-mono uppercase">Incident Severity Distribution</span>
            <span className="text-[10px] font-mono text-slate-500">REAL-TIME</span>
          </div>

          <div className="h-44 w-full">
            {charts?.severityBreakdown ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.severityBreakdown} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#94A3B8', fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {charts.severityBreakdown.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500 font-mono">
                Loading telemetry charts...
              </div>
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-slate-200 font-mono uppercase">Disaster Category Distribution</span>
            <span className="text-[10px] font-mono text-cyan-400">SECTOR ALPHA</span>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            {charts?.categoryBreakdown ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.categoryBreakdown}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={65}
                    innerRadius={35}
                    paddingAngle={3}
                  >
                    {charts.categoryBreakdown.map((_: any, index: number) => {
                      const colors = ['#EF4444', '#F59E0B', '#38BDF8', '#10B981', '#8B5CF6', '#EC4899'];
                      return <Cell key={`pie-${index}`} fill={colors[index % colors.length]} />;
                    })}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-slate-500 font-mono">Loading telemetry...</div>
            )}
          </div>
        </div>

        {/* Hazard Bulletins Active */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-slate-200 font-mono uppercase flex items-center gap-1.5">
              <BellRing className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              <span>Active Hazard Warnings ({alerts.length})</span>
            </span>
            <Link to="/command/alerts" className="text-[10px] text-cyan-400 font-mono hover:underline">
              Manage &rarr;
            </Link>
          </div>

          <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
            {alerts.map((alt) => (
              <div key={alt.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-red-400 font-mono">{alt.alertCode}</span>
                  <span className="font-mono text-slate-500">{alt.severity}</span>
                </div>
                <div className="font-bold text-xs text-slate-200 line-clamp-1">{alt.title}</div>
                <div className="text-[10px] text-slate-400 truncate">{alt.instructions}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Operational Feed & Pending Verification Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Active Emergency Incidents Feed</span>
            </h2>
            <p className="text-xs text-slate-400">Click any incident to open AI triage assessment and dispatch squads</p>
          </div>

          <Link
            to="/command/incidents"
            className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
          >
            <span>Full Incident Roster</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase">
                <th className="py-2.5 px-3">Code</th>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Incident Title</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3 text-center">Impacted</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {incidents.map((inc) => (
                <tr
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className="hover:bg-slate-800/50 cursor-pointer transition group"
                >
                  <td className="py-3 px-3 font-mono font-bold text-cyan-400 text-xs">{inc.incidentCode}</td>
                  <td className="py-3 px-3">
                    <StatusBadge priority={inc.priorityLevel} size="sm" />
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-300">
                    {inc.category.replace(/_/g, ' ')}
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-100 max-w-xs truncate">
                    {inc.title}
                  </td>
                  <td className="py-3 px-3 text-slate-400 max-w-xs truncate">
                    {inc.address}
                  </td>
                  <td className="py-3 px-3 text-center font-mono">
                    <span className="font-bold text-slate-200">{inc.affectedPeople}</span>
                    {inc.trappedCount > 0 && <span className="text-red-400 ml-1">({inc.trappedCount}t)</span>}
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={inc.status} size="sm" />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedIncident(inc);
                      }}
                      className="px-2.5 py-1 rounded bg-slate-800 group-hover:bg-cyan-600 group-hover:text-slate-950 font-mono text-[11px] text-slate-300 transition"
                    >
                      Triage &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Incident Drawer */}
      <IncidentDetailDrawer
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
        onUpdated={loadData}
      />
    </div>
  );
};
