import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Users, Target, ArrowLeft, Heart, Sparkles, Building2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-slate-200 space-y-8">
      <Link to="/" className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:underline">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
      </Link>

      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold text-white">About DisplaceOS</h1>
        <p className="text-base text-cyan-400 font-mono font-medium">
          “When Disaster Strikes, Every Second Matters.”
        </p>
      </div>

      <div className="prose prose-invert max-w-none text-slate-300 space-y-4 text-sm leading-relaxed">
        <p>
          DisplaceOS is an open, resilient disaster relief coordination platform designed for civil defense authorities,
          national disaster response teams, municipal emergency operations centers, NGOs, and affected citizens.
        </p>
        <p>
          During major floods, earthquakes, landslides, and forest fires, conventional communication infrastructure frequently
          falters under extreme network congestion. Relief coordinators face fragmented visibility, duplicate requests, and
          logistical bottlenecks.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <Target className="w-6 h-6 text-red-400 mb-2" />
            <h3 className="font-bold text-slate-100 text-sm">Mission</h3>
            <p className="text-xs text-slate-400 mt-1">
              Reduce emergency response latency by over 60% through AI-assisted multi-variable triage and unified GIS dispatch.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <Users className="w-6 h-6 text-cyan-400 mb-2" />
            <h3 className="font-bold text-slate-100 text-sm">Collaboration</h3>
            <p className="text-xs text-slate-400 mt-1">
              Bridge the operational gap between citizens on the ground, tactical rescue teams, and centralized command officers.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <Sparkles className="w-6 h-6 text-emerald-400 mb-2" />
            <h3 className="font-bold text-slate-100 text-sm">Responsible Tech</h3>
            <p className="text-xs text-slate-400 mt-1">
              Human-in-the-loop validation ensures that life-critical decisions are verified and auditable.
            </p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-white pt-4">Operational Architecture</h2>
        <p>
          DisplaceOS combines five core functional layers:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-300">
          <li><b>Citizen Telemetry Layer:</b> Guided reporting with GPS capture, offline sync queues, and multilingual translation.</li>
          <li><b>AI Prioritization Engine:</b> Deterministic safety rule assessment analyzing trapped victims, injuries, vulnerable demographics, and hazard proximity into P0–P3 triage classifications.</li>
          <li><b>Geospatial Command Map:</b> Real-time Leaflet GIS overlays linking rescue teams, incident density, shelters, and impassable roads.</li>
          <li><b>Smart Dispatch & Fleet Engine:</b> Capability-aware squad matching, workload balancing, and live mission lifecycle status tracking.</li>
          <li><b>Logistics & Shelter Management:</b> Zero-negative-stock relief inventory, capacity indicators, and family reunification rosters.</li>
        </ul>
      </div>
    </div>
  );
};
