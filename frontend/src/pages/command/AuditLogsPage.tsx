import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { History, Shield, Filter, Search, UserCheck } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [actionFilter, setActionFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await api.getAuditLogs({
        action: actionFilter !== 'ALL' ? actionFilter : undefined,
      });
      setLogs(res.logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <History className="w-6 h-6 text-slate-400" />
            <span>Operational Audit Trail & Compliance Log</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable log of priority overrides, team assignments, alert issuances, and logistics mutations.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-transparent text-slate-200 text-xs focus:outline-none"
          >
            <option value="ALL">All Actions</option>
            <option value="PRIORITY_OVERRIDE">Priority Override</option>
            <option value="MISSION_ASSIGN">Mission Assignment</option>
            <option value="ALERT_PUBLISH">Alert Publication</option>
            <option value="INVENTORY_MUTATION">Inventory Mutation</option>
            <option value="SHELTER_UPDATE">Shelter Update</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase bg-slate-950/60">
                <th className="py-3 px-3">Timestamp (UTC)</th>
                <th className="py-3 px-3">Action Type</th>
                <th className="py-3 px-3">Entity Type</th>
                <th className="py-3 px-3">Entity Identifier</th>
                <th className="py-3 px-3">Officer / Actor</th>
                <th className="py-3 px-3">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {logs.map((log) => {
                let actionBadge = 'text-cyan-400 bg-cyan-950/60 border-cyan-500/40';
                if (log.action === 'PRIORITY_OVERRIDE') actionBadge = 'text-amber-400 bg-amber-950/60 border-amber-500/40';
                if (log.action === 'ALERT_PUBLISH') actionBadge = 'text-red-400 bg-red-950/60 border-red-500/40';

                return (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-400">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${actionBadge}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300">{log.entityType}</td>
                    <td className="py-3 px-3 font-mono text-cyan-400 truncate max-w-[120px]">{log.entityId}</td>
                    <td className="py-3 px-3 font-medium text-slate-200">
                      {log.performedBy?.fullName || 'System Automated Agent'}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-400 max-w-sm truncate">
                      {log.details}
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
