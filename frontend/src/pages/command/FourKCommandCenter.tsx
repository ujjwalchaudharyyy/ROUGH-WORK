import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { api } from '../../services/api';
import { Incident, Shelter, RescueTeam } from '../../types';
import {
  Search,
  Bell,
  Maximize2,
  Minimize2,
  Layers,
  MapPin,
  Brain,
  Shield,
  MessageSquare,
  Settings,
  LayoutDashboard,
  AlertOctagon,
  Users,
  Tent,
  Boxes,
  Users2,
  FileSpreadsheet,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Activity,
  CheckCircle2,
  ExternalLink,
  Flame,
  Radio,
  Clock,
  Sparkles,
} from 'lucide-react';

// Custom Pin Markers with vibrant colors matching the reference
const createCustomPin = (color: string, label: string) => {
  return L.divIcon({
    className: 'custom-4k-pin',
    html: `
      <div style="position: relative; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 22px; height: 22px; border-radius: 50%; background: ${color}; opacity: 0.35; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="width: 18px; height: 18px; border-radius: 50%; background: #0B1120; border: 2.5px solid ${color}; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px ${color}aa;">
          <div style="width: 6px; height: 6px; border-radius: 50%; background: ${color};"></div>
        </div>
      </div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
};

const redPin = createCustomPin('#EF4444', 'Affected');
const bluePin = createCustomPin('#38BDF8', 'Rescue');
const amberPin = createCustomPin('#F59E0B', 'Shelter');
const greenPin = createCustomPin('#10B981', 'Supplies');
const purplePin = createCustomPin('#A855F7', 'Medical');

export const FourKCommandCenter: React.FC = () => {
  const navigate = useNavigate();

  // State
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'Dashboard' | 'Incidents' | 'People' | 'Shelters' | 'Supplies' | 'Rescue Teams' | 'Communication' | 'Reports' | 'Settings'>('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [mapTileMode, setMapTileMode] = useState<'satellite' | 'dark'>('satellite');
  const [showLiveOverview, setShowLiveOverview] = useState(true);
  const [showRecentUpdates, setShowRecentUpdates] = useState(true);
  const [selectedCardModal, setSelectedCardModal] = useState<string | null>(null);

  // Live overview metrics (default to reference numbers, can sync with DB)
  const [metrics, setMetrics] = useState({
    affectedPeople: 12458,
    rescueTeams: 24,
    shelters: 18,
    reliefSuppliesTons: 56,
  });

  // Recent operational updates
  const [updates, setUpdates] = useState([
    { id: 1, text: 'Rescue team reached Karanpur', time: '2 mins ago', icon: 'responder' },
    { id: 2, text: 'New shelter set up at Govt. School', time: '12 mins ago', icon: 'shelter' },
    { id: 3, text: 'Medical supplies delivered', time: '18 mins ago', icon: 'supplies' },
  ]);

  // Fetch real database records to enrich the overview
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const overview = await api.getAnalyticsOverview();
        if (overview?.kpis) {
          setMetrics(prev => ({
            affectedPeople: Math.max(12458, (overview.kpis.activeIncidents * 38) + 12000),
            rescueTeams: Math.max(24, overview.kpis.deployedTeams || 24),
            shelters: Math.max(18, overview.kpis.totalShelters || 18),
            reliefSuppliesTons: 56,
          }));
        }
      } catch (err) {
        // Fallback to reference values
      }
    };
    fetchStats();
  }, []);

  // Center coordinate over flood valley
  const mapCenter: [number, number] = [19.076, 72.8777];

  // Flood affected hazard polygon coordinates
  const floodPolygon: [number, number][] = [
    [19.098, 72.845],
    [19.092, 72.875],
    [19.078, 72.898],
    [19.055, 72.905],
    [19.048, 72.870],
    [19.062, 72.840],
    [19.082, 72.835],
  ];

  // Safe route waypoints
  const safeRoute: [number, number][] = [
    [19.048, 72.835],
    [19.060, 72.850],
    [19.072, 72.862],
    [19.085, 72.880],
    [19.102, 72.895],
  ];

  // Tactical markers
  const tacticalPoints = [
    { id: 1, pos: [19.075, 72.868] as [number, number], type: 'affected', label: 'River Basin Flash Inundation', icon: redPin },
    { id: 2, pos: [19.065, 72.882] as [number, number], type: 'affected', label: 'Sector 4 Residential Breach', icon: redPin },
    { id: 3, pos: [19.088, 72.855] as [number, number], type: 'affected', label: 'Bridge Approach Submerged', icon: redPin },
    { id: 4, pos: [19.082, 72.872] as [number, number], type: 'rescue', label: 'Alpha Squad 01 (NDRF Boat)', icon: bluePin },
    { id: 5, pos: [19.058, 72.858] as [number, number], type: 'rescue', label: 'Bravo Squad 04 (ALS Medic)', icon: bluePin },
    { id: 6, pos: [19.095, 72.885] as [number, number], type: 'rescue', label: 'Delta Squad 02 (Air Evac)', icon: bluePin },
    { id: 7, pos: [19.050, 72.840] as [number, number], type: 'shelter', label: 'Metro Community Shelter #1 (Cap: 450)', icon: amberPin },
    { id: 8, pos: [19.102, 72.892] as [number, number], type: 'shelter', label: 'Govt. Higher Secondary Camp (Cap: 600)', icon: amberPin },
    { id: 9, pos: [19.092, 72.835] as [number, number], type: 'supplies', label: 'Central Logistics Depot Alpha', icon: greenPin },
    { id: 10, pos: [19.068, 72.898] as [number, number], type: 'supplies', label: 'Field Rations Distribution #3', icon: greenPin },
    { id: 11, pos: [19.084, 72.860] as [number, number], type: 'medical', label: 'Mobile Trauma Triage Center', icon: purplePin },
  ];

  const handleSidebarClick = (tab: typeof activeTab) => {
    setActiveTab(tab);
    if (tab === 'Incidents') navigate('/command/incidents');
    if (tab === 'People') navigate('/command/incidents');
    if (tab === 'Shelters') navigate('/command/shelters');
    if (tab === 'Supplies') navigate('/command/inventory');
    if (tab === 'Rescue Teams') navigate('/command/teams');
    if (tab === 'Communication') navigate('/command/alerts');
    if (tab === 'Reports') navigate('/command/analytics');
    if (tab === 'Settings') navigate('/command/audit');
  };

  return (
    <div className="w-full min-h-screen bg-[#060A14] text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden font-sans">
      
      {/* 4K ULTRA CONTAINER: Max 2400px centered */}
      <div className="w-full max-w-[2160px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-5">
        
        {/* ========================================================
            TOP HEADER SECTION
            ======================================================== */}
        <header className="relative w-full rounded-2xl overflow-hidden border border-slate-800/80 bg-gradient-to-r from-[#070F1E] via-[#09152A] to-[#0A162D] p-5 sm:p-6 lg:p-7 shadow-2xl">
          {/* Helicopter & Flood Background on Right */}
          <div className="absolute right-0 top-0 bottom-0 w-full md:w-3/5 lg:w-1/2 pointer-events-none select-none overflow-hidden opacity-35 md:opacity-90">
            <img
              src="/images/hero_disaster_helicopter.jpg"
              alt="Disaster Rescue Helicopter"
              className="w-full h-full object-cover object-center filter saturate-110 contrast-105"
            />
            {/* Smooth gradient blend to deep dark navy */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#070F1E] via-[#070F1E]/80 md:via-[#070F1E]/40 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#070F1E] via-transparent to-transparent"></div>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Left Branding */}
            <div className="max-w-2xl space-y-3">
              {/* Top Subtitle Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-medium tracking-wide">
                <AlertTriangle className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-semibold text-white">Disaster Management</span>
                <span className="text-cyan-500/60">|</span>
                <span className="text-slate-300 text-[11px]">Faster Response | Better Coordination | Lives Saved</span>
              </div>

              {/* Main Brand Title & Icon */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-volt flex items-center justify-center p-[2px] shadow-sm">
                  <div className="w-full h-full rounded-[10px] bg-[#070F1E] flex items-center justify-center overflow-hidden">
                    <img src="/images/displaceos_icon.jpg" alt="Logo" className="w-9 h-9 object-contain" />
                  </div>
                </div>
                <div>
                  <h1 className="font-heading uppercase tracking-wide text-4xl sm:text-5xl lg:text-6xl text-white font-normal leading-none">
                    DISPLACE<span className="text-volt">OS</span>
                  </h1>
                  <h2 className="font-heading uppercase tracking-wider text-xs sm:text-sm text-slate-300 font-normal mt-1">
                    Disaster Relief Coordination Platform
                  </h2>
                </div>
              </div>

              {/* Paragraph */}
              <p className="text-xs sm:text-sm text-slate-300 font-body leading-relaxed font-normal max-w-xl">
                AI-powered, blockchain-secured platform to coordinate affected people, rescue teams, shelters and relief supplies during natural disasters.
              </p>

              {/* 5 Feature Badges Row */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={() => navigate('/command/thermal-recon')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600/30 hover:bg-red-600 border border-red-500/60 text-white text-xs font-heading tracking-wider uppercase font-bold transition shadow-md hover:scale-105 cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5 text-volt animate-pulse" />
                  <span>🔥 THERMOPS FLIR RECON</span>
                </button>
                {[
                  { icon: MapPin, text: 'Real-time Coordination' },
                  { icon: Brain, text: 'AI-Powered Insights' },
                  { icon: Shield, text: 'Blockchain Security' },
                  { icon: MessageSquare, text: 'Multi-Channel Communication' },
                  { icon: Settings, text: 'Resource Optimization' },
                ].map((badge, idx) => {
                  const Icon = badge.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedCardModal(badge.text)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#10131B] hover:bg-[#181B26] border border-[#202433] hover:border-volt/50 text-slate-200 text-xs font-heading tracking-wider uppercase font-bold transition shadow-sm cursor-pointer"
                    >
                      <Icon className="w-3.5 h-3.5 text-volt" />
                      <span>{badge.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Slogan */}
            <div className="hidden lg:flex flex-col items-end justify-center self-end md:self-auto text-right pr-6 space-y-0.5">
              <span className="font-heading uppercase tracking-wide text-base text-slate-400 font-normal">IN CRISIS,</span>
              <span className="font-heading uppercase tracking-wide text-3xl sm:text-4xl text-volt font-normal">
                COORDINATION SAVES LIVES.
              </span>
            </div>
          </div>
        </header>

        {/* ========================================================
            MAIN OPERATIONAL STAGE: 3-COLUMN 4K ARCHITECTURE
            - Left: 3 Category Cards
            - Center: Central Console with Dark Leaflet Map
            - Right: 3 Category Cards
            ======================================================== */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* --------------------------------------------------------
              LEFT COLUMN: 3 FLANKING FEATURE CARDS
              -------------------------------------------------------- */}
          <div className="lg:col-span-3 flex flex-col gap-4 justify-between">
            
            {/* Card 1: Affected People */}
            <div
              onClick={() => navigate('/command/incidents')}
              className="group relative rounded-2xl bg-gradient-to-br from-[#0D182E] to-[#0A1324] border border-slate-800 hover:border-red-500/50 p-4 transition-all duration-300 shadow-xl hover:shadow-red-500/10 cursor-pointer flex gap-4 items-center"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-700/60 shadow-md">
                <img
                  src="/images/card_affected_people.jpg"
                  alt="Affected People"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-6 h-6 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                    <Users className="w-3.5 h-3.5" />
                  </span>
                  <h3 className="font-heading text-lg text-white group-hover:text-volt tracking-wide uppercase font-normal transition-colors">
                    AFFECTED PEOPLE
                  </h3>
                </div>
                <ul className="text-xs text-slate-300 space-y-1 font-body">
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                    Report location & needs
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                    Get real-time updates
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                    Find nearby shelters
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 2: Rescue Teams */}
            <div
              onClick={() => navigate('/command/teams')}
              className="group relative rounded-2xl bg-[#0F1117] border border-[#1E212B] hover:border-volt/50 p-4 transition-all duration-300 shadow-xl cursor-pointer flex gap-4 items-center"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-700/60 shadow-md">
                <img
                  src="/images/card_rescue_teams.jpg"
                  alt="Rescue Teams"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                    <Users2 className="w-3.5 h-3.5" />
                  </span>
                  <h3 className="font-heading text-lg text-white group-hover:text-volt tracking-wide uppercase font-normal transition-colors">
                    RESCUE TEAMS
                  </h3>
                </div>
                <ul className="text-xs text-slate-300 space-y-1 font-body">
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    Receive alerts & assignments
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    Track affected areas
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    Coordinate on-ground efforts
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 3: Shelters */}
            <div
              onClick={() => navigate('/command/shelters')}
              className="group relative rounded-2xl bg-[#0F1117] border border-[#1E212B] hover:border-volt/50 p-4 transition-all duration-300 shadow-xl cursor-pointer flex gap-4 items-center"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-700/60 shadow-md">
                <img
                  src="/images/card_shelters.jpg"
                  alt="Shelters"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Tent className="w-3.5 h-3.5" />
                  </span>
                  <h3 className="font-heading text-lg text-white group-hover:text-volt tracking-wide uppercase font-normal transition-colors">
                    SHELTERS
                  </h3>
                </div>
                <ul className="text-xs text-slate-300 space-y-1 font-body">
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Manage capacity
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Track occupancy
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Share resources needed
                  </li>
                </ul>
              </div>
            </div>

          </div>

          {/* --------------------------------------------------------
              CENTER: CENTRAL COMMAND LAPTOP CONSOLE
              -------------------------------------------------------- */}
          <div className={`transition-all duration-500 ${isFullscreen ? 'fixed inset-0 z-50 p-4 bg-black/90 flex items-center justify-center' : 'lg:col-span-6 flex flex-col'}`}>
            
            {/* Realistic Hardware Frame / Laptop Chassis */}
            <div className={`relative w-full rounded-2xl bg-[#091122] border-2 border-slate-700/70 shadow-[0_0_50px_rgba(15,23,42,0.9)] overflow-hidden flex flex-col ${isFullscreen ? 'h-full max-w-7xl' : 'h-[520px] lg:h-[580px]'}`}>
              
              {/* Laptop Camera Eye */}
              <div className="h-4 bg-[#070D1B] flex items-center justify-center shrink-0 border-b border-slate-800/80">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700/80"></span>
              </div>

              {/* Console Inner Display */}
              <div className="flex-1 flex flex-col overflow-hidden bg-[#070F1E]">
                
                {/* 1. Terminal Topbar */}
                <div className="h-11 bg-[#0A1428] border-b border-slate-800 px-3.5 flex items-center justify-between gap-3 shrink-0">
                  {/* Brand */}
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center overflow-hidden">
                      <img src="/images/displaceos_icon.jpg" alt="Icon" className="w-5 h-5 object-contain" />
                    </div>
                    <span className="font-bold text-xs tracking-wider text-white">DisplaceOS</span>
                  </div>

                  {/* Search Bar */}
                  <div className="flex-1 max-w-xs sm:max-w-md mx-2">
                    <div className="relative flex items-center">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search location, people, or resources..."
                        className="w-full h-7 pl-8 pr-3 bg-[#111E38] border border-[#1E3259] rounded-lg text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 transition"
                      />
                    </div>
                  </div>

                  {/* Actions & Avatar */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setMapTileMode(m => m === 'satellite' ? 'dark' : 'satellite')}
                      title="Toggle Satellite / Dark Terrain"
                      className="p-1 rounded bg-[#111E38] text-slate-300 hover:text-white border border-[#1E3259]"
                    >
                      <Layers className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      title={isFullscreen ? 'Exit Fullscreen' : 'Expand Terminal'}
                      className="p-1 rounded bg-[#111E38] text-slate-300 hover:text-cyan-300 border border-[#1E3259]"
                    >
                      {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                    </button>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 border border-cyan-400/50 flex items-center justify-center text-[10px] font-bold text-white">
                      EOC
                    </div>
                  </div>
                </div>

                {/* 2. Terminal Body: Sidebar + Map + Right Panel */}
                <div className="flex-1 flex overflow-hidden">
                  
                  {/* Console Left Nav */}
                  <div className="w-36 sm:w-40 bg-[#091325] border-r border-slate-800 p-2 flex flex-col justify-between shrink-0 select-none overflow-y-auto">
                    <div className="space-y-1">
                      {[
                        { label: 'Dashboard', icon: LayoutDashboard },
                        { label: 'Incidents', icon: AlertOctagon },
                        { label: 'People', icon: Users },
                        { label: 'Shelters', icon: Tent },
                        { label: 'Supplies', icon: Boxes },
                        { label: 'Rescue Teams', icon: Users2 },
                        { label: 'Communication', icon: Radio },
                        { label: 'Reports', icon: FileSpreadsheet },
                        { label: 'Settings', icon: Settings },
                      ].map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.label;
                        return (
                          <button
                            key={item.label}
                            onClick={() => handleSidebarClick(item.label as any)}
                            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition ${
                              isActive
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                            }`}
                          >
                            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                            <span className="truncate">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2 border-t border-slate-800 text-[9px] text-slate-400 text-center font-mono">
                      SEC-ALPHA • ONLINE
                    </div>
                  </div>

                  {/* Center Map View */}
                  <div className="flex-1 relative overflow-hidden bg-[#0A1222]">
                    
                    {/* Leaflet Map */}
                    <MapContainer
                      center={mapCenter}
                      zoom={12}
                      style={{ height: '100%', width: '100%', background: '#0B1120' }}
                      zoomControl={false}
                    >
                      {/* Satellite / Dark Tile Layer */}
                      {mapTileMode === 'satellite' ? (
                        <TileLayer
                          attribution='&copy; Esri &mdash; Earthstar Geographics'
                          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                          maxZoom={18}
                        />
                      ) : (
                        <TileLayer
                          attribution='&copy; CARTO'
                          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                          maxZoom={19}
                        />
                      )}

                      {/* Red Flood Hazard Polygon */}
                      <Polygon
                        positions={floodPolygon}
                        pathOptions={{
                          color: '#EF4444',
                          fillColor: '#DC2626',
                          fillOpacity: 0.38,
                          weight: 2,
                          dashArray: '3, 6',
                        }}
                      >
                        <Tooltip sticky className="dark-leaflet-tooltip">
                          <span className="font-bold text-red-500">Critical Flood Risk Zone</span>
                        </Tooltip>
                      </Polygon>

                      {/* Safe Route Polyline */}
                      <Polyline
                        positions={safeRoute}
                        pathOptions={{
                          color: '#06B6D4',
                          weight: 3.5,
                          dashArray: '6, 8',
                          opacity: 0.9,
                        }}
                      >
                        <Tooltip sticky>Safe Evacuation Corridor Alpha</Tooltip>
                      </Polyline>

                      {/* Tactical Points */}
                      {tacticalPoints.map((pt) => (
                        <Marker key={pt.id} position={pt.pos} icon={pt.icon}>
                          <Popup className="dark-popup">
                            <div className="p-1 text-slate-900 font-sans text-xs">
                              <p className="font-bold text-slate-900">{pt.label}</p>
                              <p className="text-[10px] text-slate-600 font-mono">
                                Lat: {pt.pos[0].toFixed(3)} | Lng: {pt.pos[1].toFixed(3)}
                              </p>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                    </MapContainer>

                    {/* Floating Hazard Label (Exact from reference) */}
                    <div className="absolute top-10 right-4 z-[400] pointer-events-none">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#091122]/90 border border-red-500/60 shadow-xl backdrop-blur-md">
                        <span className="w-5 h-5 rounded-md bg-red-600/30 flex items-center justify-center text-red-400">
                          <AlertTriangle className="w-3.5 h-3.5 fill-red-500 text-[#091122]" />
                        </span>
                        <div>
                          <div className="text-xs font-bold text-white">Flood Affected</div>
                          <div className="text-[10px] text-red-400 italic font-medium -mt-0.5">High priority</div>
                        </div>
                      </div>
                    </div>

                    {/* Top-Left Expand Control */}
                    <button
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="absolute top-3 left-3 z-[400] p-1.5 rounded-lg bg-[#0A1428]/85 hover:bg-[#111F3C] border border-slate-700 text-slate-300 hover:text-white shadow-lg backdrop-blur"
                      title="Expand View"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Bottom Floating Legend Bar (Exact from reference) */}
                    <div className="absolute bottom-2 left-3 right-3 z-[400] bg-[#0A1428]/90 border border-slate-700/80 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between text-[10px] text-slate-300 backdrop-blur-md shadow-lg">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        <span>Affected Area</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                        <span>Rescue Teams</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                        <span>Shelters</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span>Supplies</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-cyan-400 font-bold font-mono">──&gt;</span>
                        <span className="text-cyan-300">Safe Route</span>
                      </div>
                    </div>

                  </div>

                  {/* Right Sub-Panel inside Laptop: Live Overview & Recent Updates */}
                  <div className="w-48 sm:w-56 bg-[#091325] border-l border-slate-800 p-2.5 flex flex-col gap-3 shrink-0 overflow-y-auto select-none">
                    
                    {/* Live Overview Card */}
                    <div className="rounded-xl bg-[#0D182E] border border-slate-800 p-2.5 space-y-2">
                      <div
                        onClick={() => setShowLiveOverview(!showLiveOverview)}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <span className="font-bold text-xs text-white">Live Overview</span>
                        {showLiveOverview ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                      </div>

                      {showLiveOverview && (
                        <div className="space-y-2 text-xs pt-1">
                          {/* Affected People */}
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                              <Users className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="text-[10px] text-slate-400">Affected People</div>
                              <div className="font-bold text-white text-xs">{metrics.affectedPeople.toLocaleString()}</div>
                            </div>
                          </div>

                          {/* Rescue Teams */}
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                              <Users2 className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="text-[10px] text-slate-400">Rescue Teams</div>
                              <div className="font-bold text-white text-xs">{metrics.rescueTeams}</div>
                            </div>
                          </div>

                          {/* Shelters */}
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                              <Tent className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="text-[10px] text-slate-400">Shelters</div>
                              <div className="font-bold text-white text-xs">{metrics.shelters}</div>
                            </div>
                          </div>

                          {/* Relief Supplies */}
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                              <Boxes className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="text-[10px] text-slate-400">Relief Supplies</div>
                              <div className="font-bold text-white text-xs">{metrics.reliefSuppliesTons} Tons</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Recent Updates Card */}
                    <div className="rounded-xl bg-[#0D182E] border border-slate-800 p-2.5 space-y-2">
                      <div
                        onClick={() => setShowRecentUpdates(!showRecentUpdates)}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <span className="font-bold text-xs text-white">Recent Updates</span>
                        {showRecentUpdates ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                      </div>

                      {showRecentUpdates && (
                        <div className="space-y-2 text-[11px] pt-1">
                          {updates.map((up) => (
                            <div key={up.id} className="flex items-start gap-2 border-b border-slate-800/60 pb-1.5 last:border-0 last:pb-0">
                              <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                                {up.icon === 'responder' && <Users className="w-3 h-3 text-cyan-400" />}
                                {up.icon === 'shelter' && <Tent className="w-3 h-3 text-emerald-400" />}
                                {up.icon === 'supplies' && <Boxes className="w-3 h-3 text-amber-400" />}
                              </span>
                              <div className="min-w-0">
                                <p className="text-slate-200 leading-tight text-[10px] font-medium">{up.text}</p>
                                <span className="text-[9px] text-slate-400 font-mono">{up.time}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>

                </div>

              </div>
            </div>

            {/* Laptop Base Stand / Chin Shadow */}
            <div className="w-3/4 mx-auto h-2 bg-gradient-to-r from-transparent via-slate-600/40 to-transparent rounded-b-xl blur-[1px]"></div>
          </div>

          {/* --------------------------------------------------------
              RIGHT COLUMN: 3 FLANKING FEATURE CARDS
              -------------------------------------------------------- */}
          <div className="lg:col-span-3 flex flex-col gap-4 justify-between">
            
            {/* Card 4: Relief Supplies */}
            <div
              onClick={() => navigate('/command/inventory')}
              className="group relative rounded-2xl bg-[#0F1117] border border-[#1E212B] hover:border-volt/50 p-4 transition-all duration-300 shadow-xl cursor-pointer flex gap-4 items-center"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-700/60 shadow-md">
                <img
                  src="/images/card_relief_supplies.jpg"
                  alt="Relief Supplies"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <Boxes className="w-3.5 h-3.5" />
                  </span>
                  <h3 className="font-heading text-lg text-white group-hover:text-volt tracking-wide uppercase font-normal transition-colors">
                    RELIEF SUPPLIES
                  </h3>
                </div>
                <ul className="text-xs text-slate-300 space-y-1 font-body">
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    Track inventory
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    Monitor distribution
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    Ensure timely delivery
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 5: Communication */}
            <div
              onClick={() => navigate('/command/alerts')}
              className="group relative rounded-2xl bg-[#0F1117] border border-[#1E212B] hover:border-volt/50 p-4 transition-all duration-300 shadow-xl cursor-pointer flex gap-4 items-center"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-700/60 shadow-md">
                <img
                  src="/images/card_communication.jpg"
                  alt="Communication"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </span>
                  <h3 className="font-heading text-lg text-white group-hover:text-volt tracking-wide uppercase font-normal transition-colors">
                    COMMUNICATION
                  </h3>
                </div>
                <ul className="text-xs text-slate-300 space-y-1 font-body">
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                    Multi-channel alerts
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                    Connect stakeholders
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                    Share live information
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 6: AI & Analytics */}
            <div
              onClick={() => navigate('/command/analytics')}
              className="group relative rounded-2xl bg-[#0F1117] border border-[#1E212B] hover:border-volt/50 p-4 transition-all duration-300 shadow-xl cursor-pointer flex gap-4 items-center"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-700/60 shadow-md">
                <img
                  src="/images/card_ai_analytics.jpg"
                  alt="AI & Analytics"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                    <Brain className="w-3.5 h-3.5" />
                  </span>
                  <h3 className="font-heading text-lg text-white group-hover:text-volt tracking-wide uppercase font-normal transition-colors">
                    AI & ANALYTICS
                  </h3>
                </div>
                <ul className="text-xs text-slate-300 space-y-1 font-body">
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    Predict risk zones
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    Optimize resource allocation
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    Support data-driven decisions
                  </li>
                </ul>
              </div>
            </div>

          </div>

        </div>

        {/* ========================================================
            BOTTOM PIPELINE & SLOGAN
            ======================================================== */}
        <footer className="w-full rounded-2xl bg-[#0F1015] border border-[#1E2028] px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          
          {/* 4 Process Steps */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 text-xs text-slate-300">
            
            {/* Step 1 */}
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <div>
                <div className="font-heading text-sm text-white tracking-wide uppercase font-normal">Disaster Occurs</div>
                <div className="text-[10px] text-slate-400 font-body">Real-time alerts & data collection</div>
              </div>
            </div>

            <span className="text-slate-600 font-bold hidden sm:inline">──&gt;</span>

            {/* Step 2 */}
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Users className="w-4 h-4" />
              </span>
              <div>
                <div className="font-heading text-sm text-white tracking-wide uppercase font-normal">Coordinate</div>
                <div className="text-[10px] text-slate-400 font-body">People, teams & resources</div>
              </div>
            </div>

            <span className="text-slate-600 font-bold hidden sm:inline">──&gt;</span>

            {/* Step 3 */}
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Settings className="w-4 h-4" />
              </span>
              <div>
                <div className="font-heading text-sm text-white tracking-wide uppercase font-normal">Respond</div>
                <div className="text-[10px] text-slate-400 font-body">Rescue, relief & medical support</div>
              </div>
            </div>

            <span className="text-slate-600 font-bold hidden sm:inline">──&gt;</span>

            {/* Step 4 */}
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Shield className="w-4 h-4" />
              </span>
              <div>
                <div className="font-heading text-sm text-white tracking-wide uppercase font-normal">Recover</div>
                <div className="text-[10px] text-slate-400 font-body">Rebuild stronger, safer communities</div>
              </div>
            </div>

          </div>

          {/* Slogan on Right */}
          <div className="flex flex-col items-center md:items-end select-none">
            <span className="font-heading uppercase tracking-wide text-2xl sm:text-3xl text-volt font-normal">
              TECHNOLOGY FOR A SAFER TOMORROW
            </span>
            <div className="w-36 h-1 bg-volt rounded-full mt-1"></div>
          </div>

        </footer>

      </div>

      {/* Feature Details Modal */}
      {selectedCardModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0D182E] border border-cyan-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-cyan-300 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                {selectedCardModal}
              </h3>
              <button
                onClick={() => setSelectedCardModal(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              DisplaceOS operational capability: <strong>{selectedCardModal}</strong> is active in this EOC cluster with deterministic failover and low-latency synchronization across tactical responder radios and municipal servers.
            </p>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedCardModal(null)}
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
