import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { syncOfflineQueue, getOfflineQueue } from '../services/offlineQueue';
import {
  ShieldAlert,
  Flame,
  Globe,
  Wifi,
  WifiOff,
  RefreshCw,
  LogOut,
} from 'lucide-react';

export const TopCommandBar: React.FC = () => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [timeStr, setTimeStr] = useState<string>('');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [offlineCount, setOfflineCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const queue = getOfflineQueue();
    setOfflineCount(queue.filter((q) => q.status === 'PENDING').length);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      await syncOfflineQueue(() => {
        setOfflineCount(getOfflineQueue().filter((q) => q.status === 'PENDING').length);
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <header className="h-[64px] bg-[#0C0D11] border-b border-[#1A1C24] px-3 md:px-6 flex items-center justify-between select-none z-40 sticky top-0">
      {/* Brand */}
      <Link to="/" className="flex items-center gap-2 group shrink-0">
        <div className="w-8 h-8 rounded-lg bg-volt flex items-center justify-center group-hover:scale-105 transition">
          <Flame className="w-4 h-4 text-black" />
        </div>
        <div className="hidden sm:block">
          <div className="flex items-center gap-1.5">
            <span className="font-heading text-base md:text-lg tracking-wider text-white uppercase">DisplaceOS</span>
            <span className="bg-volt/10 text-volt text-[9px] font-mono px-1.5 py-0.5 rounded border border-volt/30 uppercase font-bold hidden md:inline">
              EOC
            </span>
          </div>
        </div>
      </Link>

      {/* Center — time + status (desktop only) */}
      <div className="hidden lg:flex items-center gap-3 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800/80">
        <div className="flex items-center gap-1.5 font-mono text-xs text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-400 uppercase text-[10px]">TIME:</span>
          <span className="font-bold text-cyan-300">{timeStr} IST</span>
        </div>
        <div className="h-3 w-px bg-slate-800" />
        <div className="flex items-center gap-1 font-mono text-xs">
          {isOnline ? (
            <span className="text-emerald-400 flex items-center gap-1">
              <Wifi className="w-3 h-3" /> ONLINE
            </span>
          ) : (
            <span className="text-rose-400 flex items-center gap-1">
              <WifiOff className="w-3 h-3" /> OFFLINE
            </span>
          )}
        </div>
        {offlineCount > 0 && (
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="flex items-center gap-1 text-[10px] text-amber-300 hover:text-amber-200 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 transition"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{offlineCount} queued</span>
          </button>
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Online dot — mobile only */}
        <span className={`lg:hidden w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-rose-400'}`} />

        {/* SOS Button */}
        <Link
          to="/citizen/report"
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] md:text-xs rounded-lg shadow-[0_0_10px_rgba(239,68,68,0.4)] transition"
        >
          <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
          <span className="uppercase font-mono tracking-wide hidden xs:inline">{t('reportEmergency')}</span>
          <span className="uppercase font-mono tracking-wide xs:hidden">SOS</span>
        </Link>

        {/* Language */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 transition"
          title="Toggle Language"
        >
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-mono font-medium hidden sm:inline">{language.toUpperCase()}</span>
        </button>

        {/* User + Logout */}
        {user && (
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-800">
            <div className="hidden md:block text-right">
              <div className="text-xs font-semibold text-slate-200 truncate max-w-[100px]">{user.fullName}</div>
              <div className="text-[9px] text-cyan-400 font-mono uppercase">{user.role.replace(/_/g, ' ')}</div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 transition border border-slate-700/60"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
