import React from 'react';
import { PriorityLevel, IncidentStatus } from '../types';

interface StatusBadgeProps {
  priority?: PriorityLevel;
  status?: IncidentStatus | string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ priority, status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  }[size];

  if (priority) {
    switch (priority) {
      case 'P0':
        return (
          <span className={`inline-flex items-center font-bold tracking-wider rounded border border-red-500/50 bg-red-500/10 text-red-400 animate-pulse ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5 shadow-[0_0_8px_#ef4444]"></span>
            P0 CRITICAL
          </span>
        );
      case 'P1':
        return (
          <span className={`inline-flex items-center font-semibold rounded border border-amber-500/50 bg-amber-500/10 text-amber-400 ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 shadow-[0_0_8px_#f59e0b]"></span>
            P1 URGENT
          </span>
        );
      case 'P2':
        return (
          <span className={`inline-flex items-center font-medium rounded border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-1.5"></span>
            P2 ESSENTIAL
          </span>
        );
      case 'P3':
        return (
          <span className={`inline-flex items-center font-medium rounded border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 ${sizeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5"></span>
            P3 SUPPORT
          </span>
        );
    }
  }

  if (status) {
    const s = status.toUpperCase();
    let colorClass = 'border-slate-700 bg-slate-800 text-slate-300';

    if (s === 'REPORTED') {
      colorClass = 'border-rose-500/40 bg-rose-950/40 text-rose-300';
    } else if (s === 'VERIFIED') {
      colorClass = 'border-blue-500/40 bg-blue-950/40 text-blue-300';
    } else if (s === 'ASSIGNED') {
      colorClass = 'border-purple-500/40 bg-purple-950/40 text-purple-300';
    } else if (s === 'ACCEPTED' || s === 'EN_ROUTE') {
      colorClass = 'border-amber-500/40 bg-amber-950/40 text-amber-300';
    } else if (s === 'ON_SCENE') {
      colorClass = 'border-cyan-500/40 bg-cyan-950/40 text-cyan-300';
    } else if (s === 'RESOLVED' || s === 'COMPLETED' || s === 'OPEN') {
      colorClass = 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300';
    } else if (s === 'FULL' || s === 'IMPASSABLE') {
      colorClass = 'border-red-500/40 bg-red-950/40 text-red-300';
    }

    return (
      <span className={`inline-flex items-center font-mono uppercase tracking-wider rounded border ${colorClass} ${sizeClasses}`}>
        {status.replace(/_/g, ' ')}
      </span>
    );
  }

  return null;
};
