import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  LayoutDashboard,
  AlertOctagon,
  MapPin,
  SendHorizontal,
  Users2,
  Tent,
  Boxes,
  BellRing,
  LineChart,
  History,
  FileSpreadsheet,
  Search,
  Radio,
  ClipboardList,
  Compass,
  FileQuestion,
  HelpCircle,
  ShieldCheck,
  BookOpen,
  LifeBuoy,
  Flame,
} from 'lucide-react';

export const LeftSidebar: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const role = user?.role || 'COMMAND_CENTER';

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-heading tracking-wider uppercase transition ${
      isActive
        ? 'bg-volt text-black font-bold shadow-sm'
        : 'text-slate-400 hover:text-slate-200 hover:bg-[#151720]'
    }`;

  return (
    <aside className="w-[250px] shrink-0 bg-[#0C0D11] border-r border-[#1A1C24] flex flex-col justify-between overflow-y-auto select-none min-h-[calc(100vh-64px-34px)]">
      <div className="p-3 space-y-4">
        {/* Command Center Navigation */}
        {role === 'COMMAND_CENTER' && (
          <div>
            <div className="text-[11px] font-heading uppercase tracking-wider text-slate-500 px-3 py-1 font-normal">
              Command Operations
            </div>
            <nav className="space-y-1">
              <NavLink to="/command/dashboard" className={linkClass}>
                <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                <span>Executive Command</span>
              </NavLink>
              <NavLink to="/command/thermal-recon" className={linkClass}>
                <Flame className="w-4 h-4 text-volt" />
                <span>ThermOps FLIR Recon</span>
              </NavLink>
              <NavLink to="/command/incidents" className={linkClass}>
                <AlertOctagon className="w-4 h-4 text-red-400" />
                <span>Incident Triage</span>
              </NavLink>
              <NavLink to="/command/map" className={linkClass}>
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Disaster Intelligence Map</span>
              </NavLink>
              <NavLink to="/command/dispatch" className={linkClass}>
                <SendHorizontal className="w-4 h-4 text-purple-400" />
                <span>Smart Rescue Dispatch</span>
              </NavLink>
              <NavLink to="/command/teams" className={linkClass}>
                <Users2 className="w-4 h-4 text-blue-400" />
                <span>Rescue Fleet Tracking</span>
              </NavLink>
              <NavLink to="/command/shelters" className={linkClass}>
                <Tent className="w-4 h-4 text-amber-400" />
                <span>Relief Shelters</span>
              </NavLink>
              <NavLink to="/command/inventory" className={linkClass}>
                <Boxes className="w-4 h-4 text-rose-400" />
                <span>Relief Logistics & Stock</span>
              </NavLink>
              <NavLink to="/command/alerts" className={linkClass}>
                <BellRing className="w-4 h-4 text-amber-500" />
                <span>Hazard Alerts Center</span>
              </NavLink>
              <NavLink to="/command/analytics" className={linkClass}>
                <LineChart className="w-4 h-4 text-sky-400" />
                <span>Risk & Impact Analytics</span>
              </NavLink>
              <NavLink to="/command/audit" className={linkClass}>
                <History className="w-4 h-4 text-slate-400" />
                <span>System Audit Logs</span>
              </NavLink>
            </nav>
          </div>
        )}

        {/* Responder Navigation */}
        {role === 'RESCUE_TEAM' && (
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-3 py-1 font-bold">
              Field Responder
            </div>
            <nav className="space-y-1">
              <NavLink to="/responder/dashboard" className={linkClass}>
                <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                <span>Responder Dashboard</span>
              </NavLink>
              <NavLink to="/responder/missions" className={linkClass}>
                <Radio className="w-4 h-4 text-red-400" />
                <span>Active Missions</span>
              </NavLink>
              <NavLink to="/responder/team" className={linkClass}>
                <Users2 className="w-4 h-4 text-blue-400" />
                <span>My Team & Vehicle</span>
              </NavLink>
              <NavLink to="/responder/equipment" className={linkClass}>
                <ClipboardList className="w-4 h-4 text-amber-400" />
                <span>Equipment Checklist</span>
              </NavLink>
              <NavLink to="/responder/history" className={linkClass}>
                <History className="w-4 h-4 text-slate-400" />
                <span>Mission History</span>
              </NavLink>
            </nav>
          </div>
        )}

        {/* Shelter Manager Navigation */}
        {role === 'SHELTER_MANAGER' && (
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-3 py-1 font-bold">
              Shelter Operations
            </div>
            <nav className="space-y-1">
              <NavLink to="/shelter/dashboard" className={linkClass}>
                <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                <span>Shelter Dashboard</span>
              </NavLink>
              <NavLink to="/shelter/capacity" className={linkClass}>
                <Tent className="w-4 h-4 text-emerald-400" />
                <span>Occupancy & Capacity</span>
              </NavLink>
              <NavLink to="/shelter/supplies" className={linkClass}>
                <Boxes className="w-4 h-4 text-rose-400" />
                <span>Shelter Supplies</span>
              </NavLink>
              <NavLink to="/shelter/registrations" className={linkClass}>
                <Users2 className="w-4 h-4 text-blue-400" />
                <span>Citizen Check-In/Out</span>
              </NavLink>
            </nav>
          </div>
        )}

        {/* Citizen Navigation */}
        {role === 'CITIZEN' && (
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-3 py-1 font-bold">
              Citizen Portal
            </div>
            <nav className="space-y-1">
              <NavLink to="/citizen/dashboard" className={linkClass}>
                <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                <span>Citizen Dashboard</span>
              </NavLink>
              <NavLink to="/citizen/report" className={linkClass}>
                <AlertOctagon className="w-4 h-4 text-red-400" />
                <span>Report Emergency</span>
              </NavLink>
              <NavLink to="/citizen/requests" className={linkClass}>
                <Compass className="w-4 h-4 text-purple-400" />
                <span>Track My Requests</span>
              </NavLink>
              <NavLink to="/citizen/missing-person" className={linkClass}>
                <Search className="w-4 h-4 text-amber-400" />
                <span>Missing Persons</span>
              </NavLink>
              <NavLink to="/citizen/shelters" className={linkClass}>
                <Tent className="w-4 h-4 text-emerald-400" />
                <span>Verified Shelters</span>
              </NavLink>
              <NavLink to="/citizen/alerts" className={linkClass}>
                <BellRing className="w-4 h-4 text-rose-400" />
                <span>Hazard Alerts</span>
              </NavLink>
            </nav>
          </div>
        )}

        {/* Shared Public / Knowledge Links */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-3 py-1 font-bold">
            Public Info & Safety
          </div>
          <nav className="space-y-1">
            <NavLink to="/emergency-resources" className={linkClass}>
              <LifeBuoy className="w-4 h-4 text-red-400" />
              <span>Emergency Helplines</span>
            </NavLink>
            <NavLink to="/safety" className={linkClass}>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Safety & AI Protocols</span>
            </NavLink>
            <NavLink to="/features" className={linkClass}>
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>System Features</span>
            </NavLink>
            <NavLink to="/about" className={linkClass}>
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>About DisplaceOS</span>
            </NavLink>
          </nav>
        </div>
      </div>

      {/* System Status Footer */}
      <div className="p-3 bg-slate-950/80 border-t border-slate-800 text-[10px] text-slate-400 font-mono">
        <div className="flex items-center justify-between">
          <span>PLATFORM:</span>
          <span className="text-emerald-400 font-bold">DISPLACE-OS v1.0</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span>AI TRIAGE:</span>
          <span className="text-cyan-400">HYBRID SAFETY CORE</span>
        </div>
      </div>
    </aside>
  );
};
