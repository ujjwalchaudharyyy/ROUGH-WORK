import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { UserRole } from '../types';
import {
  AlertTriangle,
  Play,
  RotateCcw,
  TrendingUp,
  Navigation,
  PackageMinus,
  Ban,
  CheckCircle2,
  Users,
} from 'lucide-react';

export const SimulationBanner: React.FC = () => {
  const {
    isSimulating,
    statusMessage,
    triggerSpike,
    triggerMoveTeams,
    triggerConsumeSupplies,
    triggerRoadClosure,
    triggerResolveIncident,
  } = useSimulation();

  const { user, switchRole } = useAuth();
  const { t } = useLanguage();

  const roles: { key: UserRole; label: string }[] = [
    { key: 'COMMAND_CENTER', label: 'Command Center' },
    { key: 'RESCUE_TEAM', label: 'Rescue Team' },
    { key: 'SHELTER_MANAGER', label: 'Shelter Manager' },
    { key: 'MEDICAL_RESPONDER', label: 'Medical Team' },
    { key: 'CITIZEN', label: 'Citizen' },
  ];

  return (
    <div className="bg-[#090A0E] border-b border-[#1A1C24] text-xs px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 z-50">
      {/* Demo Warning Pill */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/40 text-amber-400 font-bold px-2 py-0.5 rounded tracking-wider uppercase text-[11px]">
          <AlertTriangle className="w-3.5 h-3.5 animate-pulse text-amber-400" />
          {t('simulatedDataBanner')}
        </span>

        {statusMessage && (
          <span className="text-cyan-300 font-mono text-[11px] animate-fade-in truncate max-w-xs md:max-w-md">
            {statusMessage}
          </span>
        )}
      </div>

      {/* Simulation Actions */}
      <div className="flex items-center flex-wrap gap-1.5">
        <span className="text-slate-400 text-[10px] uppercase font-mono mr-1">Simulate:</span>

        <button
          onClick={triggerSpike}
          disabled={isSimulating}
          title="Inject 3 new emergency incidents into the region"
          className="inline-flex items-center gap-1 bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 text-red-300 px-2 py-0.5 rounded transition disabled:opacity-50"
        >
          <TrendingUp className="w-3 h-3 text-red-400" />
          <span>{t('simulateSurge')}</span>
        </button>

        <button
          onClick={triggerMoveTeams}
          disabled={isSimulating}
          title="Advance responder GPS locations toward incidents"
          className="inline-flex items-center gap-1 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 px-2 py-0.5 rounded transition disabled:opacity-50"
        >
          <Navigation className="w-3 h-3 text-cyan-400" />
          <span>{t('simulateMovement')}</span>
        </button>

        <button
          onClick={triggerConsumeSupplies}
          disabled={isSimulating}
          title="Deduct relief stock to simulate field camp consumption"
          className="inline-flex items-center gap-1 bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/40 text-purple-300 px-2 py-0.5 rounded transition disabled:opacity-50"
        >
          <PackageMinus className="w-3 h-3 text-purple-400" />
          <span>{t('simulateSupplies')}</span>
        </button>

        <button
          onClick={triggerRoadClosure}
          disabled={isSimulating}
          title="Simulate flash-flood road cut in highway corridor"
          className="inline-flex items-center gap-1 bg-amber-950/60 hover:bg-amber-900/80 border border-amber-500/40 text-amber-300 px-2 py-0.5 rounded transition disabled:opacity-50"
        >
          <Ban className="w-3 h-3 text-amber-400" />
          <span>{t('simulateBlockage')}</span>
        </button>

        <button
          onClick={triggerResolveIncident}
          disabled={isSimulating}
          title="Mark an active mission as completed"
          className="inline-flex items-center gap-1 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 px-2 py-0.5 rounded transition disabled:opacity-50"
        >
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span>{t('simulateResolve')}</span>
        </button>
      </div>

      {/* Instant 1-Click Role Switcher */}
      <div className="flex items-center gap-1">
        <span className="text-slate-400 text-[10px] uppercase font-mono mr-1">Role:</span>
        <div className="flex bg-slate-950 p-0.5 rounded border border-slate-700/60">
          {roles.map((r) => {
            const isActive = user?.role === r.key;
            return (
              <button
                key={r.key}
                onClick={() => switchRole(r.key)}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
