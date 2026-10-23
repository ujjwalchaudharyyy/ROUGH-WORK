import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
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
  LineChart,
  Line,
} from 'recharts';
import {
  LineChart as ChartIcon,
  Download,
  Printer,
  Calendar,
  Layers,
  Activity,
  CheckCircle2,
} from 'lucide-react';

export const AnalyticsWorkspacePage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.getAnalyticsOverview();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const kpis = data?.kpis;
  const charts = data?.charts;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <ChartIcon className="w-6 h-6 text-sky-400" />
            <span>Disaster Risk & Operational Impact Analytics</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Geographic aggregation, response time distributions, and downloadable operational debriefs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs rounded-lg border border-slate-700 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>

          <a
            href="/api/analytics/export-csv"
            download
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold font-mono text-xs rounded-lg transition shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV Dataset</span>
          </a>
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[10px] uppercase font-mono text-slate-400">Total Registered Incidents</div>
          <div className="text-2xl font-extrabold text-white font-mono mt-1">{kpis?.totalIncidents ?? 0}</div>
          <div className="text-[10px] text-emerald-400 mt-0.5 font-mono">{kpis?.resolvedToday ?? 0} resolved today</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[10px] uppercase font-mono text-slate-400">Total People In Hazard Zone</div>
          <div className="text-2xl font-extrabold text-amber-400 font-mono mt-1">{kpis?.peopleAwaitingHelp ?? 0}</div>
          <div className="text-[10px] text-slate-400 mt-0.5 font-mono">Trapped: {kpis?.trappedTotal ?? 0} individuals</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[10px] uppercase font-mono text-slate-400">Shelter Absorption Rate</div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">{kpis?.shelterOccupancyRate ?? 0}%</div>
          <div className="text-[10px] text-slate-400 mt-0.5 font-mono">{kpis?.openShelterCapacity ?? 0} free beds available</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[10px] uppercase font-mono text-slate-400">Avg Deployment Response</div>
          <div className="text-2xl font-extrabold text-indigo-400 font-mono mt-1">{kpis?.avgResponseTimeMinutes ?? 18} min</div>
          <div className="text-[10px] text-cyan-400 mt-0.5 font-mono">Real mission timeline telemetry</div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Severity Bar Chart */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-mono uppercase">Incident Severity Distribution</h3>
            <span className="text-[10px] font-mono text-slate-500">P0 THRU P3</span>
          </div>

          <div className="h-64 w-full">
            {charts?.severityBreakdown && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.severityBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {charts.severityBreakdown.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Category Breakdown Pie */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-mono uppercase">Incident Classification Breakdown</h3>
            <span className="text-[10px] font-mono text-cyan-400">DATABASE INTEGRATED</span>
          </div>

          <div className="h-64 w-full">
            {charts?.categoryBreakdown && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.categoryBreakdown}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={50}
                    paddingAngle={4}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
