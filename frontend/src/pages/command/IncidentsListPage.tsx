import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Incident, PriorityLevel, IncidentStatus } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { IncidentDetailDrawer } from '../../components/IncidentDetailDrawer';
import {
  AlertOctagon,
  Search,
  Filter,
  CheckCircle2,
  Send,
  PlusCircle,
  Eye,
  MapPin,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const IncidentsListPage: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const fetchIncidents = async () => {
    try {
      const res = await api.getIncidents({
        search,
        priority: priorityFilter !== 'ALL' ? priorityFilter : undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        category: categoryFilter !== 'ALL' ? categoryFilter : undefined,
      });
      setIncidents(res.incidents || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [search, priorityFilter, statusFilter, categoryFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <AlertOctagon className="w-6 h-6 text-red-500" />
            <span>Incident Triage & Verification Center</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational queue of incoming citizen emergency reports, AI safety assessments, and dispatcher authorizations.
          </p>
        </div>

        <Link
          to="/citizen/report"
          className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg transition font-mono shadow-md uppercase"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Incident</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search incident code, street address, or title..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1">
          <span className="text-slate-400 font-mono text-[11px]">PRIORITY:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-slate-200"
          >
            <option value="ALL">All Priorities</option>
            <option value="P0">P0 — Critical Life Peril</option>
            <option value="P1">P1 — Urgent Priority</option>
            <option value="P2">P2 — Essential Aid</option>
            <option value="P3">P3 — Non-Urgent Support</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1">
          <span className="text-slate-400 font-mono text-[11px]">STATUS:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-slate-200"
          >
            <option value="ALL">All Statuses</option>
            <option value="REPORTED">Awaiting Verification</option>
            <option value="VERIFIED">Verified (Ready)</option>
            <option value="ASSIGNED">Assigned to Team</option>
            <option value="EN_ROUTE">Team En Route</option>
            <option value="ON_SCENE">Responders On Scene</option>
            <option value="RESOLVED">Resolved / Complete</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1">
          <span className="text-slate-400 font-mono text-[11px]">TYPE:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-slate-200"
          >
            <option value="ALL">All Types</option>
            <option value="FLOOD">Flood</option>
            <option value="BUILDING_COLLAPSE">Collapse</option>
            <option value="LANDSLIDE">Landslide</option>
            <option value="MEDICAL_EMERGENCY">Medical</option>
            <option value="FIRE">Fire</option>
            <option value="FOOD_WATER_SHORTAGE">Supplies</option>
          </select>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase bg-slate-950/60">
                <th className="py-3 px-3">Code</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Title & Overview</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3 text-center">Impacted</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {incidents.map((inc) => (
                <tr
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className="hover:bg-slate-800/40 cursor-pointer transition group"
                >
                  <td className="py-3 px-3 font-mono font-bold text-cyan-400">{inc.incidentCode}</td>
                  <td className="py-3 px-3">
                    <StatusBadge priority={inc.priorityLevel} size="sm" />
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-300">
                    {inc.category.replace(/_/g, ' ')}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-100 max-w-sm truncate">{inc.title}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-1">{inc.description}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-400 max-w-xs truncate">
                    {inc.address}
                  </td>
                  <td className="py-3 px-3 text-center font-mono">
                    <span className="font-bold text-slate-200">{inc.affectedPeople}</span>
                    {inc.trappedCount > 0 && (
                      <span className="text-red-400 ml-1">({inc.trappedCount}t)</span>
                    )}
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
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-600 hover:text-slate-950 font-mono text-[11px] text-slate-300 transition"
                    >
                      Inspect &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <IncidentDetailDrawer
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
        onUpdated={fetchIncidents}
      />
    </div>
  );
};
