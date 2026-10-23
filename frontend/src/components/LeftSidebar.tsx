import React, { useState } from 'react';
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
  Search,
  Radio,
  ClipboardList,
  Compass,
  ShieldCheck,
  BookOpen,
  LifeBuoy,
  Flame,
  Shield,
  User,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { UserRole } from '../types';

export const LeftSidebar: React.FC = () => {
  const { user, logout, switchRole } = useAuth();
  const { t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  const role = user?.role || 'CITIZEN';

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-heading tracking-wider uppercase transition ${
      isActive
        ? 'bg-volt text-black font-bold shadow-sm'
        : 'text-slate-400 hover:text-slate-200 hover:bg-[#151720]'
    }`;

  const roleOptions: { label: string; role: UserRole; icon: any; color: string }[] = [
    { label: 'Command Center', role: 'COMMAND_CENTER', icon: Shield, color: 'text-cyan-400' },
    { label: 'Rescue Team', role: 'RESCUE_TEAM', icon: Radio, color: 'text-red-400' },
    { label: 'Shelter Manager', role: 'SHELTER_MANAGER', icon: Tent, color: 'text-amber-400' },
    { label: 'Medical Team', role: 'MEDICAL_RESPONDER', icon: Users2, color: 'text-emerald-400' },
    { label: 'Citizen', role: 'CITIZEN', icon: User, color: 'text-slate-300' },
  ];

  const sidebarContent = (
    <aside className="w-full h-full bg-[#0C0D11] border-r border-[#1A1C24] flex flex-col justify-between overflow-y-auto">
      <div className="p-3 space-y-4">

        {/* Mobile close button row */}
        <div className="flex items-center justify-between md:hidden pb-2 border-b border-slate-800">
          <span className="font-heading text-sm text-white uppercase tracking-wide">Navigation</span>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command Center Navigation */}
        {role === 'COMMAND_CENTER' && (
          <div>
            <div className="text-[11px] font-heading uppercase tracking-wider text-slate-500 px-3 py-1">
              Command Operations
            </div>
            <nav className="space-y-1">
              <NavLink to="/command/dashboard" className={linkClass} onClick={() => setMobileOpen(false)}>
                <LayoutDashboard className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Executive Command</span>
              </NavLink>
              <NavLink to="/command/thermal-recon" className={linkClass} onClick={() => setMobileOpen(false)}>
                <Flame className="w-4 h-4 text-volt shrink-0" />
                <span>ThermOps FLIR Recon</span>
              </NavLink>
              <NavLink to="/command/incidents" className={linkClass} onClick={() => setMobileOpen(false)}>
                <AlertOctagon className="w-4 h-4 text-red-400 shrink-0" />
                <span>Incident Triage</span>
              </NavLink>
              <NavLink to="/command/map" className={linkClass} onClick={() => setMobileOpen(false)}>
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Disaster Map</span>
              </NavLink>
              <NavLink to="/command/dispatch" className={linkClass} onClick={() => setMobileOpen(false)}>
                <SendHorizontal className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Smart Dispatch</span>
              </NavLink>
              <NavLink to="/command/teams" className={linkClass} onClick={() => setMobileOpen(false)}>
                <Users2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Rescue Fleet</span>
              </NavLink>
              <NavLink to="/command/shelters" className={linkClass} onClick={() => setMobileOpen(false)}>
                <Tent className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Shelters</span>
              </NavLink>
              <NavLink to="/command/inventory" className={linkClass} onClick={() => setMobileOpen(false)}>
                <Boxes className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Logistics & Stock</span>
              </NavLink>
              <NavLink to="/command/alerts" className={linkClass} onClick={() => setMobileOpen(false)}>
                <BellRing className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Hazard Alerts</span>
              </NavLink>
              <NavLink to="/command/analytics" className={linkClass} onClick={() => setMobileOpen(false)}>
                <LineChart className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Analytics</span>
              </NavLink>
              <NavLink to="/command/audit" className={linkClass} onClick={() => setMobileOpen(false)}>
                <History className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Audit Logs</span>
              </NavLink>
            </nav>
          </div>
        )}

        {/* Responder Navigation */}
        {(role === 'RESCUE_TEAM' || role === 'MEDICAL_RESPONDER') && (
          <div>
            <div className="text-[11px] font-heading uppercase tracking-wider text-slate-500 px-3 py-1">
              {role === 'MEDICAL_RESPONDER' ? 'Medical Response' : 'Field Responder'}
            </div>
            <nav className="space-y-1">
              <NavLink to="/responder/dashboard" className={linkClass} onClick={() => setMobileOpen(false)}>
                <LayoutDashboard className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/responder/missions" className={linkClass} onClick={() => setMobileOpen(false)}>
                <Radio className="w-4 h-4 text-red-400 shrink-0" />
                <span>Active Missions</span>
              </NavLink>
              <NavLink to="/responder/team" className={linkClass} onClick={() => setMobileOpen(false)}>
                <Users2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>My Team</span>
              </NavLink>
              <NavLink to="/responder/equipment" className={linkClass} onClick={() => setMobileOpen(false)}>
                <ClipboardList className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Equipment</span>
              </NavLink>
              <NavLink to="/responder/history" className={linkClass} onClick={() => setMobileOpen(false)}>
                <History className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Mission History</span>
              </NavLink>
            </nav>
          </div>
        )}

        {/* Shelter Manager Navigation */}
        {role === 'SHELTER_MANAGER' && (
          <div>
            <div className="text-[11px] font-heading uppercase tracking-wider text-slate-500 px-3 py-1">
              Shelter Operations
            </div>
            <nav className="space-y-1">
              <NavLink to="/shelter/dashboard" className={linkClass} onClick={() => setMobileOpen(false)}>
                <LayoutDashboard className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/shelter/capacity" className={linkClass} onClick={() => setMobileOpen(false)}>
                <Tent className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Capacity</span>
              </NavLink>
              <NavLink to="/shelter/supplies" className={linkClass} onClick={() => setMobileOpen(false)}>
                <Boxes className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Supplies</span>
              </NavLink>
              <NavLink to="/shelter/registrations" className={linkClass} onClick={() => setMobileOpen(false)}>
                <Users2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Check-In / Out</span>
              </NavLink>
            </nav>
          </div>
        )}

        {/* Citizen Navigation */}
        {role === 'CITIZEN' && (
          <div>
            <div className="text-[11px] font-heading uppercase tracking-wider text-slate-500 px-3 py-1">
              Citizen Portal
            </div>
            <nav className="space-y-1">
              <NavLink to="/citizen/dashboard" className={linkClass} onClick={() => setMobileOpen(false)}>
                <LayoutDashboard className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/citizen/report" className={linkClass} onClick={() => setMobileOpen(false)}>
                <AlertOctagon className="w-4 h-4 text-red-400 shrink-0" />
                <span>Report Emergency</span>
              </NavLink>
              <NavLink to="/citizen/requests" className={linkClass} onClick={() => setMobileOpen(false)}>
                <Compass className="w-4 h-4 text-purple-400 shrink-0" />
                <span>My Requests</span>
              </NavLink>
              <NavLink to="/citizen/missing-person" className={linkClass} onClick={() => setMobileOpen(false)}>
                <Search className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Missing Persons</span>
              </NavLink>
              <NavLink to="/citizen/shelters" className={linkClass} onClick={() => setMobileOpen(false)}>
                <Tent className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Find Shelters</span>
              </NavLink>
              <NavLink to="/citizen/alerts" className={linkClass} onClick={() => setMobileOpen(false)}>
                <BellRing className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Hazard Alerts</span>
              </NavLink>
            </nav>
          </div>
        )}

        {/* Shared Links */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="text-[11px] font-heading uppercase tracking-wider text-slate-500 px-3 py-1">
            Info & Safety
          </div>
          <nav className="space-y-1">
            <NavLink to="/emergency-resources" className={linkClass} onClick={() => setMobileOpen(false)}>
              <LifeBuoy className="w-4 h-4 text-red-400 shrink-0" />
              <span>Helplines</span>
            </NavLink>
            <NavLink to="/safety" className={linkClass} onClick={() => setMobileOpen(false)}>
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Safety Protocols</span>
            </NavLink>
            <NavLink to="/about" className={linkClass} onClick={() => setMobileOpen(false)}>
              <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
              <span>About</span>
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Role Switcher + Logout */}
      <div className="p-3 space-y-2 border-t border-slate-800">
        {/* Current User */}
        <div className="px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-0.5">Logged in as</div>
          <div className="text-xs font-semibold text-white truncate">{user?.fullName || 'Guest'}</div>
          <div className="text-[10px] text-volt font-mono uppercase">{role.replace(/_/g, ' ')}</div>
        </div>

        {/* Switch Role */}
        <div>
          <div className="text-[10px] font-heading uppercase tracking-wider text-slate-500 px-1 mb-1">
            Switch Role (Demo)
          </div>
          <div className="space-y-0.5">
            {roleOptions.map((opt) => {
              const Icon = opt.icon;
              const isActive = role === opt.role;
              return (
                <button
                  key={opt.role}
                  onClick={() => { if (!isActive) { switchRole(opt.role); setMobileOpen(false); } }}
                  disabled={isActive}
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-heading tracking-wider uppercase transition text-left ${
                    isActive
                      ? 'bg-volt/10 text-volt border border-volt/30 cursor-default'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-volt' : opt.color}`} />
                  <span>{opt.label}</span>
                  {isActive && <ChevronRight className="w-3 h-3 ml-auto" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => { logout(); setMobileOpen(false); }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-heading tracking-wider uppercase text-rose-400 hover:text-white hover:bg-rose-600/20 border border-transparent hover:border-rose-500/30 transition cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5 shrink-0" />
          <span>Sign Out</span>
        </button>

        <div className="px-3 py-1 text-[10px] text-slate-600 font-mono flex items-center justify-between">
          <span>DISPLACE-OS v1.0</span>
          <span className="text-emerald-500">● LIVE</span>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Mobile hamburger toggle button — sits in top-left of workspace */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-[68px] left-3 z-50 p-2 rounded-xl bg-[#0C0D11] border border-slate-700 text-slate-300 hover:text-white shadow-lg"
        aria-label="Open navigation"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`md:hidden fixed top-0 left-0 z-50 h-full w-[280px] transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>

      {/* Desktop sidebar — always visible */}
      <div className="hidden md:block w-[240px] shrink-0 h-[calc(100vh-64px)] sticky top-[64px]">
        {sidebarContent}
      </div>
    </>
  );
};
