import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { UserRole } from '../../types';
import {
  Flame,
  Droplets,
  Activity,
  Shield,
  Users,
  Tent,
  User,
  Users2,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  AlertTriangle,
  Radio,
  CheckCircle2,
  Zap,
} from 'lucide-react';

export const DisplaceOSAuthPortal: React.FC = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { t } = useLanguage();

  // Disaster scenarios for dynamic hero cycling
  const scenarios = [
    {
      id: 'wildfire',
      name: 'MOUNTAIN FOREST WILDFIRE',
      icon: Flame,
      tag: '🔥 712°C THERMAL HEAT FRONT',
      location: 'Sector 7 Himalayan Pine Ridge',
      threat: 'EXTREME HAZARD',
      image: '/images/thermal_recon_tablet.png',
      desc: 'High-velocity flame propagation detected by thermal drones. FLIR night-vision infrared sensors identifying trapped individuals through heavy smoke haze.',
      badgeColor: 'border-red-500 text-red-400 bg-red-500/10',
    },
    {
      id: 'flood',
      name: 'FLASH FLOOD & RIVER BASIN SURGE',
      icon: Droplets,
      tag: '🌊 12,458 AFFECTED CITIZENS',
      location: 'Metro Coastal Valley & Causeway Basin',
      threat: 'CRITICAL INUNDATION',
      image: '/images/hero_disaster_helicopter.jpg',
      desc: 'NDRF motorized rescue boat squads and winch helicopters executing tactical rooftop extractions along the rising river corridor.',
      badgeColor: 'border-cyan-400 text-cyan-300 bg-cyan-500/10',
    },
    {
      id: 'earthquake',
      name: '7.2M EARTHQUAKE & COLLAPSED VOIDS',
      icon: Activity,
      tag: '🏚️ ACOUSTIC LIFE-SIGN RADAR',
      location: 'Commercial Center Sector 4 Rubble',
      threat: 'MASS COLLAPSE',
      image: '/images/card_shelters.jpg',
      desc: 'Acoustic micro-Doppler radar listening for survivor tapping signals through concrete voids. Trauma field triage station active.',
      badgeColor: 'border-amber-400 text-amber-300 bg-amber-500/10',
    },
  ];

  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);

  // Auto-cycle disaster background every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveScenarioIdx((prev) => (prev + 1) % scenarios.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [scenarios.length]);

  const currentScenario = scenarios[activeScenarioIdx];

  // Auth Form State
  const [email, setEmail] = useState('commander@displaceos.org');
  const [password, setPassword] = useState('EmergencyPass2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Quick Demo Accounts
  const demoAccounts = [
    { role: 'Command Center (Admin)', email: 'commander@displaceos.org', icon: Shield, dest: '/command/dashboard', tag: 'Full EOC' },
    { role: 'Rescue Team Leader', email: 'team.alpha@displaceos.org', icon: Users2, dest: '/responder/dashboard', tag: 'NDRF Fleet' },
    { role: 'Shelter Manager', email: 'shelter.metro@displaceos.org', icon: Tent, dest: '/shelter/dashboard', tag: 'Relief Beds' },
    { role: 'Affected Citizen', email: 'citizen.rahul@gmail.com', icon: User, dest: '/citizen/dashboard', tag: 'SOS Request' },
  ];

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await login(email, password);
      if (email.includes('commander')) navigate('/command/dashboard');
      else if (email.includes('team')) navigate('/responder/dashboard');
      else if (email.includes('shelter')) navigate('/shelter/dashboard');
      else navigate('/citizen/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDirectDemoLogin = async (demoEmail: string, dest: string) => {
    setIsLoading(true);
    setEmail(demoEmail);
    try {
      await login(demoEmail, 'EmergencyPass2026!');
      navigate(dest);
    } catch (err: any) {
      setErrorMsg('Demo access failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090D] text-slate-100 font-body selection:bg-volt selection:text-black flex flex-col justify-between">
      
      {/* ========================================================
          CLEAN TOPBAR (Matching Minimalist Brutalist Screenshot)
          ======================================================== */}
      <header className="w-full border-b border-[#1A1D27] bg-[#0A0C12] px-4 sm:px-8 py-3.5 flex items-center justify-between select-none sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="w-8 h-8 rounded-full bg-[#151821] border border-[#232736] flex items-center justify-center text-slate-300 hover:text-white transition"
          >
            ←
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-heading text-xl sm:text-2xl text-white tracking-wider uppercase font-normal">
              DISPLACEOS 2026
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-volt text-black text-[10px] font-heading font-black tracking-wider uppercase">
              PORTAL ACTIVE
            </span>
          </div>
        </div>

        {/* Disaster Scenario Switcher Pills in Navbar */}
        <div className="hidden md:flex items-center gap-2 bg-[#12141D] p-1 rounded-full border border-[#222533]">
          {scenarios.map((s, idx) => {
            const Icon = s.icon;
            const isActive = idx === activeScenarioIdx;
            return (
              <button
                key={s.id}
                onClick={() => setActiveScenarioIdx(idx)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading tracking-wider uppercase transition font-bold ${
                  isActive ? 'bg-volt text-black shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{s.id.toUpperCase()}</span>
              </button>
            );
          })}
        </div>

        <div>
          <Link
            to="/command/dashboard"
            className="px-3.5 py-1.5 rounded-full bg-[#171A24] border border-[#2B3042] text-xs font-heading tracking-wider uppercase text-cyan-300 hover:text-white transition"
          >
            4K EOC OVERVIEW →
          </Link>
        </div>
      </header>

      {/* ========================================================
          MAIN 2-COLUMN STAGE:
          - Left: Dynamic Natural Disaster Scene (Wildfire / Flood / Earthquake)
          - Right: Clean, Crisp, Human Login Form
          ======================================================== */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1">
        
        {/* LEFT COLUMN: DYNAMIC DISASTER VISUALS & TELEMETRY */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Main Visual Display Frame */}
          <div className="relative rounded-2xl overflow-hidden border border-[#222636] bg-[#0E1119] shadow-2xl h-[420px] sm:h-[460px] flex flex-col justify-between p-6 select-none transition-all duration-700">
            
            {/* Background Disaster Image with smooth fade */}
            <div className="absolute inset-0 z-0">
              <img
                src={currentScenario.image}
                alt={currentScenario.name}
                className="w-full h-full object-cover filter contrast-110 saturate-120 transition-all duration-700 transform scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D15] via-[#0A0D15]/50 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A0D15]/80 via-transparent to-transparent"></div>
            </div>

            {/* Top Scene Badges */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
              <div className={`px-3 py-1 rounded-full border text-xs font-mono font-bold flex items-center gap-2 backdrop-blur-md ${currentScenario.badgeColor}`}>
                <span className="w-2 h-2 rounded-full bg-volt animate-ping"></span>
                <span>{currentScenario.tag}</span>
              </div>

              <span className="px-2.5 py-0.5 rounded bg-black/75 border border-slate-700 text-slate-300 text-[10px] font-mono">
                {currentScenario.location}
              </span>
            </div>

            {/* Bottom Scene Content */}
            <div className="relative z-10 space-y-2 max-w-xl">
              <span className="text-[11px] font-heading tracking-widest uppercase text-volt">
                LIVE DISASTER SIMULATION STREAM
              </span>

              <h2 className="font-heading text-3xl sm:text-4xl text-white tracking-wide uppercase font-normal leading-none drop-shadow-md">
                {currentScenario.name}
              </h2>

              <p className="text-xs sm:text-sm text-slate-200 font-body leading-relaxed drop-shadow">
                {currentScenario.desc}
              </p>

              {/* Scenario Indicator Dots */}
              <div className="flex items-center gap-2 pt-2">
                {scenarios.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveScenarioIdx(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === activeScenarioIdx ? 'w-8 bg-volt' : 'w-2 bg-slate-600 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* Quick Scenario Toggles below image */}
          <div className="grid grid-cols-3 gap-2">
            {scenarios.map((s, idx) => {
              const Icon = s.icon;
              const isActive = idx === activeScenarioIdx;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveScenarioIdx(idx)}
                  className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 ${
                    isActive
                      ? 'bg-[#151926] border-volt text-volt font-bold shadow-sm'
                      : 'bg-[#0E1017] border-[#1E2230] text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <div className="min-w-0">
                    <div className="font-heading text-xs tracking-wider uppercase truncate">{s.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono truncate">{s.threat}</div>
                  </div>
                </button>
              );
            })}
          </div>

        </div>

        {/* RIGHT COLUMN: CLEAN, PUNCHY LOGIN FORM */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          <div className="rounded-2xl bg-[#0F1117] border border-[#202432] p-6 sm:p-7 shadow-2xl space-y-5">
            
            <div>
              <span className="px-2.5 py-0.5 rounded bg-volt text-black text-xs font-heading font-black tracking-wider uppercase">
                DISASTER COMMAND LOGIN
              </span>
              <h2 className="font-heading text-3xl text-white tracking-wide uppercase font-normal mt-2">
                AUTHENTICATE ROLE
              </h2>
              <p className="text-xs text-slate-400 font-body">
                Select your assigned civil defense or citizen profile to enter the operational workspace.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Standard Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-heading tracking-wider uppercase text-slate-300 mb-1">
                  OFFICIAL EMAIL / CALLSIGN
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-10 pl-9 pr-3 bg-[#151722] border border-[#262A3B] rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-volt transition"
                    placeholder="officer@displaceos.org"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-heading tracking-wider uppercase text-slate-300 mb-1">
                  SECURITY PASSPHRASE
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full h-10 pl-9 pr-9 bg-[#151722] border border-[#262A3B] rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-volt transition"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-volt hover:bg-volt-hover text-black font-heading tracking-wider text-sm uppercase font-bold transition flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] cursor-pointer"
              >
                {isLoading ? (
                  <span>AUTHENTICATING TELEMETRY...</span>
                ) : (
                  <>
                    <span>SIGN IN TO OPERATIONAL SECTOR</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* ONE-CLICK INSTANT DEMO ROLES */}
            <div className="pt-2 border-t border-[#1C202D] space-y-2">
              <span className="text-[10px] font-heading tracking-widest uppercase text-slate-400 block">
                ONE-CLICK INSTANT EVALUATION PROFILES:
              </span>

              <div className="grid grid-cols-2 gap-2">
                {demoAccounts.map((acc, i) => {
                  const Icon = acc.icon;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleDirectDemoLogin(acc.email, acc.dest)}
                      className="p-2 rounded-xl bg-[#141620] hover:bg-[#1D2130] border border-[#242838] hover:border-volt/50 text-left transition flex items-center gap-2 group cursor-pointer"
                    >
                      <Icon className="w-3.5 h-3.5 text-volt shrink-0" />
                      <div className="min-w-0">
                        <div className="font-heading text-xs text-white group-hover:text-volt tracking-wide truncate">
                          {acc.role}
                        </div>
                        <div className="text-[9px] text-slate-500 font-mono truncate">{acc.tag}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Clean Footer Bar */}
      <footer className="w-full border-t border-[#181B24] bg-[#0A0C11] px-6 py-3 text-center text-xs text-slate-500 font-mono">
        DisplaceOS Platform • High-Resilience Emergency Civil Defense • Deterministic Failover Active
      </footer>

    </div>
  );
};
