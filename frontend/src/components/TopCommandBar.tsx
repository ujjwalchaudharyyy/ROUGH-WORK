import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { syncOfflineQueue, getOfflineQueue } from '../services/offlineQueue';
import {
  ShieldAlert,
  Flame,
  Globe,
  Wifi,
  WifiOff,
  Bell,
  RefreshCw,
  LogOut,
  User,
  PlusCircle,
  Eye,
} from 'lucide-react';

interface TopCommandBarProps {
  onOpenReportModal?: () => void;
}

export const TopCommandBar: React.FC<TopCommandBarProps> = ({ onOpenReportModal }) => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const [timeStr, setTimeStr] = useState<string>('');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [offlineCount, setOfflineCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check offline queue
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
      await syncOfflineQueue((count) => {
        setOfflineCount(getOfflineQueue().filter((q) => q.status === 'PENDING').length);
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <header className="h-[64px] bg-[#0C0D11] border-b border-[#1A1C24] px-4 md:px-6 flex items-center justify-between select-none z-40">
      {/* Brand & Mission Tag */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-volt flex items-center justify-center shadow-sm group-hover:scale-105 transition">
            <Flame className="w-5 h-5 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-xl tracking-wider text-white uppercase font-normal">DisplaceOS</span>
              <span className="bg-volt/10 text-volt text-[10px] font-mono px-2 py-0.5 rounded border border-volt/30 uppercase font-bold">
                EOC ACTIVE
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono hidden md:block">
              “When Disaster Strikes, Every Second Matters.”
            </p>
          </div>
        </Link>
      </div>

      {/* Center Metrics & Telemetry */}
      <div className="hidden lg:flex items-center gap-4 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800/80">
        <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-400 uppercase text-[10px]">TIME:</span>
          <span className="font-bold text-cyan-300">{timeStr} IST</span>
        </div>

        <div className="h-4 w-px bg-slate-800"></div>

        <div className="flex items-center gap-1.5 font-mono text-xs">
          {isOnline ? (
            <span className="text-emerald-400 flex items-center gap-1">
              <Wifi className="w-3.5 h-3.5" /> ONLINE
            </span>
          ) : (
            <span className="text-rose-400 flex items-center gap-1">
              <WifiOff className="w-3.5 h-3.5" /> OFFLINE
            </span>
          )}
        </div>

        {offlineCount > 0 && (
          <>
            <div className="h-4 w-px bg-slate-800"></div>
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="flex items-center gap-1 text-[11px] text-amber-300 hover:text-amber-200 transition bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{offlineCount} queued reports</span>
            </button>
          </>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Language Switcher */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 transition"
          title="Toggle Language (English / हिंदी)"
        >
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-mono font-medium">{language.toUpperCase()}</span>
        </button>

        {/* Emergency SOS Quick Report Button */}
        <button
          onClick={() => {
            if (onOpenReportModal) {
              onOpenReportModal();
            } else {
              navigate('/citizen/report');
            }
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs rounded-lg shadow-[0_0_12px_rgba(239,68,68,0.5)] transition"
        >
          <ShieldAlert className="w-4 h-4 animate-pulse" />
          <span className="tracking-wide uppercase font-mono">{t('reportEmergency')}</span>
        </button>

        {/* User Role Indicator & Logout */}
        {user ? (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="hidden sm:block text-right">
              <div className="text-xs font-semibold text-slate-200 truncate max-w-[120px]">{user.fullName}</div>
              <div className="text-[10px] text-cyan-400 font-mono uppercase">{user.role.replace(/_/g, ' ')}</div>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 transition border border-slate-700/60"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
          >
            {t('login')}
          </Link>
        )}
      </div>
    </header>
  );
};
