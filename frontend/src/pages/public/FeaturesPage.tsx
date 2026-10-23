import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Bot,
  Map,
  Truck,
  Boxes,
  Languages,
  WifiOff,
  Bell,
  LineChart,
  Shield,
  Search,
  Navigation,
  CheckCircle,
} from 'lucide-react';

export const FeaturesPage: React.FC = () => {
  const modules = [
    {
      title: 'Module 1: Executive Command Dashboard',
      icon: LineChart,
      color: 'text-cyan-400',
      description: 'Comprehensive operational overview presenting live KPIs calculated directly from application records: P0 critical threats, deployed teams, open shelter beds, depot inventory reserves, and average response times.',
    },
    {
      title: 'Module 2: Interactive Disaster Intelligence Map',
      icon: Map,
      color: 'text-emerald-400',
      description: 'High-performance Leaflet GIS visualization with cluster markers, severity color coding, flood perimeter overlays, impassable road cuts, shelter capacities, and routing previews.',
    },
    {
      title: 'Module 3: Emergency Incident Reporting',
      icon: Shield,
      color: 'text-red-400',
      description: 'Guided reporting form with one-click GPS geolocation capture, victim & trapped individual tally, accessibility needs flagging, draft storage, and offline retry queue.',
    },
    {
      title: 'Module 4: AI Emergency Triage Engine',
      icon: Bot,
      color: 'text-purple-400',
      description: 'Deterministic rule engine baseline combined with LLM assessment that structures incidents into P0 (Immediate life threat), P1 (Urgent), P2 (Essential), and P3 (Support) with confidence scores and identified risks.',
    },
    {
      title: 'Module 5: Smart Rescue Dispatch',
      icon: Truck,
      color: 'text-indigo-400',
      description: 'Automated squad recommendation scoring travel distance, specialized capabilities (water rescue, collapse search, ALS medical), and active workload to prevent double assignment.',
    },
    {
      title: 'Module 6: Rescue Team Tracking & Responder Portal',
      icon: Navigation,
      color: 'text-blue-400',
      description: 'Dedicated field interface for rescue squads: mission acceptance/rejection, en route/on-scene status transitions, live coordinates updates, and completion reports with victim assistance counts.',
    },
    {
      title: 'Module 7: Shelter Management',
      icon: Boxes,
      color: 'text-amber-400',
      description: 'Real-time shelter directory tracking capacity, occupancy percentages, essential supplies (potable water, food, power, sanitation), and family check-in/out registration.',
    },
    {
      title: 'Module 8: Relief Inventory & Logistics',
      icon: Boxes,
      color: 'text-rose-400',
      description: 'Multi-depot inventory tracking food, water, medical trauma kits, fuel, and blankets with zero-negative-stock protection, transaction history, and automatic low-stock alerts.',
    },
    {
      title: 'Module 9: Missing Persons & Family Reunification',
      icon: Search,
      color: 'text-yellow-400',
      description: 'Privacy-conscious missing person reporting, authorized case review, leads and sightings updates, and contact protection.',
    },
    {
      title: 'Module 10: Alerts & Early-Warning Center',
      icon: Bell,
      color: 'text-orange-400',
      description: 'Draft, publish, and revoke verified hazard notices and evacuation orders across broadcast and in-app channels.',
    },
    {
      title: 'Module 11: Low-Network & Offline-First Resilience',
      icon: WifiOff,
      color: 'text-slate-400',
      description: 'Persistent local storage queue with automatic background sync and idempotency keys to safeguard emergency reports during cellular dead zones.',
    },
    {
      title: 'Module 12: Multilingual & Accessible Interface',
      icon: Languages,
      color: 'text-teal-400',
      description: 'Bilingual support in English and Hindi, high-contrast visual styling, and WCAG 2.2 AA accessibility principles.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 text-slate-200 space-y-8">
      <Link to="/" className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:underline">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
      </Link>

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white">Platform Modules & Features</h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          DisplaceOS is structured as a unified operational suite combining 16 production modules designed for life-saving resilience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {modules.map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-2 rounded-lg bg-slate-800 border border-slate-700 ${m.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-100">{m.title}</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{m.description}</p>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono font-semibold pt-2 border-t border-slate-800/80">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Fully Implemented & Interactive</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
