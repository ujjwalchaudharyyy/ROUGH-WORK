import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  ArrowRight,
  ExternalLink,
  Shield,
  Users,
  Tent,
  Boxes,
  Activity,
  AlertTriangle,
  Radio,
  Flame,
  Droplets,
  LifeBuoy,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Active states
  const [activeTab, setActiveTab] = useState<'timeline' | 'catalog'>('timeline');
  const [activePhase, setActivePhase] = useState<1 | 2 | 3>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOperation, setSelectedOperation] = useState<any | null>(null);

  // Quick Demo Login Handler
  const handleQuickLogin = async (roleEmail: string) => {
    try {
      await login(roleEmail, 'EmergencyPass2026!');
      navigate('/command/dashboard');
    } catch (err) {
      console.error(err);
      navigate('/login');
    }
  };

  // Disaster Relief Operational Timeline Data (3 Phases)
  const operationalData = {
    1: [
      {
        id: 'op-1',
        time: '09:00 AM',
        category: 'Flood Rescue',
        location: 'Kurla River Basin Sector 4',
        badgeColor: 'border-cyan-400 text-cyan-300',
        title: 'ROOFTOP CITIZEN EXTRACTION & SQUAD ALPHA MOBILIZATION',
        subtitle: '"NDRF Motorboat Unit Alpha-01 Dispatched to Inundated Residential Sector"',
        desc: 'Severe flash flood breach detected via Leaflet GIS telemetry. 18 citizens trapped on residential rooftop terraces safely extracted via motorized inflatable rafts and tactical lifejackets.',
        link: '/command/teams',
        linkText: 'VIEW SQUAD TELEMETRY',
      },
      {
        id: 'op-2',
        time: '11:30 AM',
        category: 'Wildfire Recon',
        location: 'Sector 7 Pine Ridge Valley',
        badgeColor: 'border-red-400 text-red-300',
        title: 'THERMOPS FLIR RECON & HEAT SIGNATURE LIFE-DETECTION',
        subtitle: '"UAV Drone DR-04 Identifies 4 Trapped Citizens Through Dense Canopy Smoke"',
        desc: 'FLIR infrared thermal drone cameras locate 4 individuals with body heat signatures (37.2°C) surrounded by advancing flame front. Evacuation corridor coordinates beamed directly to field responders.',
        link: '/command/thermal-recon',
        linkText: 'LAUNCH THERMAL HUD',
      },
      {
        id: 'op-3',
        time: '02:15 PM',
        category: 'Earthquake Rubble',
        location: 'Commercial Center Sector 2',
        badgeColor: 'border-amber-400 text-amber-300',
        title: 'STRUCTURAL COLLAPSE & ACOUSTIC VOID RADAR SEARCH',
        subtitle: '"Micro-Doppler Sensor Detects Survivor Distress Tapping in Concrete Cavity"',
        desc: 'Heavy collapse rescue squad deploys concrete cutting shears and micro-Doppler acoustic life-sign radar. Trapped survivor acoustic tap localized at 4.2m depth with vital signs confirmed stable.',
        link: '/command/incidents',
        linkText: 'VIEW INCIDENT TRIAGE',
      },
      {
        id: 'op-4',
        time: '04:45 PM',
        category: 'Relief Logistics',
        location: 'Govt. Higher Secondary Camp',
        badgeColor: 'border-volt text-volt',
        title: 'MASS SHELTER MOBILIZATION & NEGATIVE-BALANCE RATIONS',
        subtitle: '"56 Tons Potable Water Sachets, Trauma Kits & High-Protein Meals Dispatched"',
        desc: 'Shelter capacity updated in real time (600 bed capacity, 420 occupied). Verified humanitarian aid dispatched from Central Logistics Depot Alpha with zero negative-stock integrity guarantees.',
        link: '/command/shelters',
        linkText: 'VIEW SHELTER ROSTER',
      },
    ],
    2: [
      {
        id: 'op-5',
        time: '08:00 AM',
        category: 'Air Evac',
        location: 'Sector 9 Mountain Isolation Ridge',
        badgeColor: 'border-blue-400 text-blue-300',
        title: 'HEAVY-LIFT HELICOPTER WINCH EXTRACTION',
        subtitle: '"Airlift of Critical Trauma Casualties to State Referral Hospital"',
        desc: 'Air force Mi-17 and civil defense helicopters complete winch extraction of 14 severely injured citizens from landslide-cut highway. Mobile trauma medics provide in-flight stabilization.',
        link: '/command/dispatch',
        linkText: 'SMART FLEET DISPATCH',
      },
      {
        id: 'op-6',
        time: '01:00 PM',
        category: 'Medical Triage',
        location: 'Central Field Hospital Sector 1',
        badgeColor: 'border-purple-400 text-purple-300',
        title: 'P0/P1 TRAUMA TRIAGE & ALS AMBULANCE COORDINATION',
        subtitle: '"Algorithmic Priority Sorting for Severe Inhalation & Fracture Cases"',
        desc: 'AI triage engine deterministically escalates active entrapments and respiratory trauma. ALS ambulances auto-routed via clear, non-blocked highway corridors.',
        link: '/command/incidents',
        linkText: 'VIEW AI TRIAGE QUEUE',
      },
    ],
    3: [
      {
        id: 'op-7',
        time: '10:00 AM',
        category: 'Rehabilitation',
        location: 'District Civil Defense Headquarters',
        badgeColor: 'border-emerald-400 text-emerald-300',
        title: 'FAMILY REUNIFICATION & MISSING PERSONS MATCHING',
        subtitle: '"Zero-Trust Biometric & Photo Identification System"',
        desc: 'Privacy-conscious missing persons registry matches 86 displaced children and elderly citizens with verified family rosters across 18 operational shelters.',
        link: '/command/shelters',
        linkText: 'FAMILY REUNIFICATION',
      },
      {
        id: 'op-8',
        time: '03:30 PM',
        category: 'Restoration',
        location: 'Submerged Highway NH-48 Corridor',
        badgeColor: 'border-slate-300 text-slate-200',
        title: 'ROAD BLOCKAGE CLEARANCE & SAFE CORRIDOR RECOVERY',
        subtitle: '"Heavy Excavators Remove Landslide Debris and Restore Municipal Access"',
        desc: 'Road accessibility GIS matrix updated live. 4 critical arterial roads cleared for heavy supply convoy transit into remote relief sub-depots.',
        link: '/command/map',
        linkText: 'VIEW DISASTER MAP',
      },
    ],
  };

  const currentOps = operationalData[activePhase].filter((op) =>
    op.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    op.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    op.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    op.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-body selection:bg-volt selection:text-black">
      
      {/* ========================================================
          CLEAN MINIMALIST NAVBAR (Pure Disaster Management)
          ======================================================== */}
      <nav className="w-full border-b border-[#1A1D27] bg-[#0A0C12] px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link
            to="/command/dashboard"
            className="w-8 h-8 rounded-full bg-[#151821] border border-[#232736] flex items-center justify-center text-slate-300 hover:text-white transition"
            title="EOC Command"
          >
            ←
          </Link>
          <span className="font-heading text-xl sm:text-2xl text-white tracking-wider uppercase font-normal">
            DISPLACEOS 2026
          </span>
          <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-[#14151B] border border-[#262833] text-[11px] font-heading tracking-wider uppercase text-volt font-bold">
            EOC RAPID RESPONSE • ACTIVE
          </span>
        </div>

        {/* Disaster Management Nav Links */}
        <div className="hidden md:flex items-center gap-6 text-xs font-heading tracking-wider uppercase text-slate-300">
          <Link to="/" className="text-volt transition">OPERATIONS TIMELINE</Link>
          <Link to="/command/map" className="hover:text-volt transition">DISASTER MAP</Link>
          <Link to="/command/teams" className="hover:text-volt transition">RESCUE SQUADS</Link>
          <Link to="/command/thermal-recon" className="hover:text-volt text-red-400 flex items-center gap-1 transition">
            <Flame className="w-3.5 h-3.5" /> THERMOPS FLIR
          </Link>
          <Link to="/command/shelters" className="hover:text-volt transition">RELIEF SHELTERS</Link>
          <Link to="/command/inventory" className="hover:text-volt transition">SUPPLIES</Link>
          <Link to="/command/dashboard" className="hover:text-volt transition">4K COMMAND CENTER</Link>
        </div>

        {/* Right Action */}
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="px-4 py-1.5 rounded-full bg-volt hover:bg-volt-hover text-black font-heading tracking-wider text-xs uppercase font-bold transition shadow-sm hover:scale-105"
          >
            LOGIN / ACCESS EOC
          </Link>
        </div>
      </nav>

      {/* ========================================================
          HERO HEADER (Strictly Impact/Anton Fonts, 100% Disaster Content)
          ======================================================== */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-20">
        
        {/* Top Tag */}
        <div className="flex items-center gap-2.5 mb-3">
          <span className="px-2.5 py-0.5 rounded-md bg-volt text-black text-xs font-heading font-black tracking-wider uppercase">
            DISPLACEOS 2026
          </span>
          <span className="text-xs font-mono tracking-wider uppercase text-slate-400 font-semibold">
            NATIONAL CIVIL DEFENSE & DISASTER RESPONSE TIMELINE
          </span>
        </div>

        {/* Big Bold Compressed Heading */}
        <h1 className="font-heading uppercase tracking-wide text-5xl sm:text-6xl lg:text-7xl font-normal text-white leading-none mb-3">
          CRISIS RESPONSE & DISASTER OPERATIONS
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-400 font-body max-w-3xl leading-relaxed mb-6">
          Explore the real-time operational disaster timeline, active rescue squad brackets, thermal FLIR reconnaissance feeds, live shelter bed capacities, and direct emergency dispatch links.
        </p>

        {/* Primary Filter Tabs */}
        <div className="flex flex-wrap items-center gap-3 mb-10">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-heading tracking-wider text-xs uppercase font-bold transition shadow-sm ${
              activeTab === 'timeline'
                ? 'bg-volt text-black'
                : 'bg-[#14161D] text-slate-300 border border-[#252834] hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>ACTIVE OPERATIONS & SQUAD TIMELINE</span>
          </button>

          <Link
            to="/command/thermal-recon"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1C151B] border border-red-500/50 text-red-400 hover:text-white font-heading tracking-wider text-xs uppercase font-bold transition"
          >
            <Flame className="w-4 h-4 text-volt" />
            <span>THERMOPS THERMAL FLIR & LIFE-SIGNS</span>
          </Link>

          <Link
            to="/command/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#181B24] border border-[#2B2F3D] text-cyan-300 hover:text-white font-heading tracking-wider text-xs uppercase font-bold transition ml-auto"
          >
            <span>LIVE 4K COMMAND DASHBOARD</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* ========================================================
            PHASE SELECTOR & SEARCH BAR
            ======================================================== */}
        <div className="rounded-2xl bg-[#0F1014] border border-[#1E2028] p-3 sm:p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Phase Pills */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {[
              { phase: 1, label: 'PHASE 1: SEARCH & EXTRACTION (0-24 HRS)' },
              { phase: 2, label: 'PHASE 2: MASS AIRLIFT & TRIAGE (24-48 HRS)' },
              { phase: 3, label: 'PHASE 3: RELIEF & RESTORATION (48-72 HRS)' },
            ].map((p) => (
              <button
                key={p.phase}
                onClick={() => setActivePhase(p.phase as any)}
                className={`px-4 py-1.5 rounded-full text-xs font-heading tracking-wider uppercase font-bold transition whitespace-nowrap ${
                  activePhase === p.phase
                    ? 'bg-volt text-black shadow-md'
                    : 'bg-[#161820] text-slate-400 border border-[#242733] hover:text-slate-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search active missions, squads, locations..."
              className="w-full h-9 pl-9 pr-4 bg-[#14161D] border border-[#242733] rounded-full text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-volt transition"
            />
          </div>
        </div>

        {/* ========================================================
            PHASE SECTION BANNER
            ======================================================== */}
        <div className="rounded-xl bg-[#111318] border border-[#1E2029] px-4 py-3 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-volt text-black text-xs font-heading font-black tracking-wider uppercase">
              PHASE {activePhase}
            </span>
            <span className="font-heading text-sm sm:text-base text-white tracking-wide uppercase font-normal">
              {activePhase === 1 && 'IMMEDIATE SEARCH & RESCUE, BOAT EXTRACTIONS & TRAUMA TRIAGE'}
              {activePhase === 2 && 'AIR FORCE WINCH RESCUE, AMBULANCE EVACUATION & MASS LOGISTICS'}
              {activePhase === 3 && 'FAMILY REUNIFICATION, ROAD CLEARANCE & COMMUNITY REBUILD'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{currentOps.length} Active Operational Missions</span>
          </div>
        </div>

        {/* ========================================================
            OPERATIONAL TIMELINE WITH LEFT ACCENT LINE & YELLOW NODES
            ======================================================== */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-volt/60 space-y-5">
          {currentOps.map((op) => (
            <div key={op.id} className="relative group">
              
              {/* Yellow Node Dot on Vertical Line */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-6 w-3.5 h-3.5 rounded-full bg-volt border-2 border-[#0A0B0E] shadow-[0_0_8px_rgba(212,249,51,0.6)]"></div>

              {/* Mission Card */}
              <div className="rounded-2xl bg-[#0F1116] border border-[#1E212A] hover:border-[#343847] p-5 sm:p-6 transition-all duration-200 shadow-md">
                
                {/* Badges: Time, Category, Location */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#171922] border border-volt/40 text-volt text-xs font-mono font-bold">
                    <Clock className="w-3 h-3 text-volt" />
                    <span>{op.time}</span>
                  </span>

                  <span className="px-2.5 py-1 rounded-md bg-[#14161F] border border-slate-700 text-slate-300 text-xs font-mono">
                    {op.category}
                  </span>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#14161F] border border-slate-700 text-slate-300 text-xs font-mono">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{op.location}</span>
                  </span>
                </div>

                {/* Main Card Content */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1.5 max-w-3xl">
                    <h2 className="font-heading uppercase tracking-wide text-2xl sm:text-3xl text-white font-normal group-hover:text-volt transition-colors">
                      {op.title}
                    </h2>
                    
                    <p className="text-xs sm:text-sm text-yellow-300/80 italic font-body">
                      {op.subtitle}
                    </p>

                    <p className="text-xs sm:text-sm text-slate-300 font-body leading-relaxed pt-1">
                      {op.desc}
                    </p>
                  </div>

                  {/* Action Link Button */}
                  <Link
                    to={op.link}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#161820] hover:bg-[#20232E] border border-[#2B2F3D] hover:border-volt/50 text-slate-200 hover:text-white text-xs font-heading tracking-wider uppercase font-bold transition shrink-0 cursor-pointer shadow-sm"
                  >
                    <span>{op.linkText || 'DETAILS'}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-volt" />
                  </Link>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* ========================================================
            QUICK ROLE DEMO BAR (EOC ACCESS)
            ======================================================== */}
        <section className="mt-16 rounded-2xl bg-[#0F1116] border border-[#1E212A] p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-heading uppercase tracking-wide text-2xl text-white">
                DISASTER COMMAND ROLES & LIVE ACCESS
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-body">
                Select any civil defense operational profile to evaluate live triage, dispatch routing, and shelter capacity.
              </p>
            </div>
            <Link
              to="/command/dashboard"
              className="px-5 py-2.5 rounded-full bg-volt hover:bg-volt-hover text-black font-heading tracking-wider text-xs uppercase font-bold transition shadow-md hover:scale-105"
            >
              LAUNCH 4K COMMAND CENTER
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {[
              { role: 'Command Center (Admin)', email: 'commander@displaceos.org', icon: Shield, badge: 'Full EOC Control' },
              { role: 'Rescue Team Leader', email: 'team.alpha@displaceos.org', icon: Users, badge: 'Active Fleet' },
              { role: 'Shelter Manager', email: 'shelter.metro@displaceos.org', icon: Tent, badge: 'Capacity Roster' },
              { role: 'Affected Citizen', email: 'citizen.rahul@gmail.com', icon: Activity, badge: 'Guided SOS' },
            ].map((account, i) => {
              const Icon = account.icon;
              return (
                <button
                  key={i}
                  onClick={() => handleQuickLogin(account.email)}
                  className="p-3.5 rounded-xl bg-[#14161D] hover:bg-[#1A1D27] border border-[#232632] hover:border-volt/40 transition text-left flex flex-col justify-between gap-2 group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <Icon className="w-4 h-4 text-volt" />
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1D202B] text-slate-400">
                      {account.badge}
                    </span>
                  </div>
                  <div>
                    <div className="font-heading text-sm text-white group-hover:text-volt tracking-wide">
                      {account.role}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono truncate">{account.email}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

      </main>

    </div>
  );
};
