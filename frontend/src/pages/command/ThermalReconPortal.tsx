import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  Eye,
  Radio,
  Search,
  Crosshair,
  AlertTriangle,
  Activity,
  Wind,
  Droplets,
  Thermometer,
  Shield,
  Users,
  Compass,
  Volume2,
  Navigation,
  Layers,
  ChevronRight,
  Sparkles,
  Maximize2,
  Minimize2,
  RefreshCw,
  Cpu,
  Zap,
} from 'lucide-react';

export const ThermalReconPortal: React.FC = () => {
  // Disaster Vision Mode: Wildfire vs Earthquake Rubble vs Flood vs Industrial
  const [visionMode, setVisionMode] = useState<'wildfire' | 'earthquake' | 'flood'>('wildfire');
  const [sensorFilter, setSensorFilter] = useState<'thermal' | 'nightvision' | 'rgb' | 'acoustic'>('thermal');
  const [activeDrone, setActiveDrone] = useState<'DR-01' | 'DR-02' | 'DR-04'>('DR-04');
  const [isAutoTracking, setIsAutoTracking] = useState(true);
  const [payloadDropped, setPayloadDropped] = useState(false);
  const [transcriptionProgress, setTranscriptionProgress] = useState(38);

  // Dynamic heat readings simulation
  const [peakTemp, setPeakTemp] = useState(712);
  const [survivorCount, setSurvivorCount] = useState(4);

  useEffect(() => {
    const timer = setInterval(() => {
      setPeakTemp(prev => Math.floor(710 + Math.random() * 8));
      setTranscriptionProgress(prev => Math.min(100, prev + Math.floor(Math.random() * 3)));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#07090E] text-slate-100 font-body selection:bg-volt selection:text-black p-3 sm:p-6 flex flex-col gap-4">
      
      {/* ========================================================
          TOP HEADER & MODE SWITCHER
          ======================================================== */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-2 border-b border-[#1A1D27]">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <Flame className="w-5 h-5 text-red-500 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-2xl sm:text-3xl text-white tracking-wider uppercase font-normal">
                  THERM-OPS: AI THERMAL RECON & LIFE-DETECTION
                </h1>
                <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40 text-[10px] font-mono uppercase font-bold">
                  HIGH DANGER
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Real-time FLIR infrared heat-energy survivor identification, fire propagation vectors & rubble acoustic radar.
              </p>
            </div>
          </div>
        </div>

        {/* Vision Mode Buttons */}
        <div className="flex items-center gap-2 bg-[#0E1017] p-1.5 rounded-xl border border-[#202330]">
          <button
            onClick={() => { setVisionMode('wildfire'); setSensorFilter('thermal'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading tracking-wider uppercase transition ${
              visionMode === 'wildfire'
                ? 'bg-red-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>FOREST WILDFIRE</span>
          </button>

          <button
            onClick={() => { setVisionMode('earthquake'); setSensorFilter('acoustic'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading tracking-wider uppercase transition ${
              visionMode === 'earthquake'
                ? 'bg-amber-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>EARTHQUAKE RUBBLE</span>
          </button>

          <button
            onClick={() => { setVisionMode('flood'); setSensorFilter('nightvision'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading tracking-wider uppercase transition ${
              visionMode === 'flood'
                ? 'bg-cyan-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>FLOOD INUNDATION</span>
          </button>

          <Link
            to="/command/dashboard"
            className="px-3 py-1.5 rounded-lg bg-[#181B26] text-slate-300 hover:text-white text-xs font-heading tracking-wider uppercase border border-[#2C3042]"
          >
            ← BACK TO EOC
          </Link>
        </div>
      </div>

      {/* ========================================================
          MAIN TACTICAL TABLET CONSOLE (Matching Uploaded Thermal UI)
          ======================================================== */}
      <div className="relative rounded-2xl bg-[#0B0D14] border-2 border-[#1E2333] shadow-2xl overflow-hidden flex flex-col">
        
        {/* Tablet Top Telemetry Bar */}
        <div className="h-11 bg-[#0E111B] border-b border-[#1E2333] px-4 flex items-center justify-between text-xs font-mono text-slate-300 select-none">
          <div className="flex items-center gap-4">
            <span className="font-heading tracking-wider text-sm text-white uppercase flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-volt" /> THERMOPS FLIR-V9
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">Coords: <strong className="text-cyan-300">40.7128°N, 74.0060°W</strong></span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1"><Thermometer className="w-3.5 h-3.5 text-amber-400" /> 24°C</span>
            <span className="flex items-center gap-1"><Wind className="w-3.5 h-3.5 text-cyan-400" /> 32 km/h</span>
            <span className="flex items-center gap-1"><Droplets className="w-3.5 h-3.5 text-blue-400" /> 15%</span>
            <span className="flex items-center gap-1 text-emerald-400"><Activity className="w-3.5 h-3.5" /> 42ms LATENCY</span>
            <span className="px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 font-bold uppercase text-[10px]">
              CRITICAL THREAT
            </span>
          </div>
        </div>

        {/* Main View Area (Tactical Drone Aerial Feed + HUD) */}
        <div className="relative h-[480px] lg:h-[540px] w-full bg-[#080B12] overflow-hidden select-none">
          
          {/* Background Aerial Disaster Imagery */}
          {visionMode === 'wildfire' && (
            <div className="absolute inset-0">
              <img
                src="/images/thermal_recon_tablet.png"
                alt="Wildfire Aerial Drone Feed"
                className="w-full h-full object-cover filter contrast-110 saturate-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D14] via-transparent to-[#0B0D14]/40"></div>
            </div>
          )}

          {visionMode === 'earthquake' && (
            <div className="absolute inset-0 bg-[#0E121C] flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(#262F48_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
              {/* Synthetic seismic collapse grid */}
              <div className="text-center space-y-2 z-10">
                <Activity className="w-16 h-16 text-amber-500 mx-auto animate-pulse" />
                <h3 className="font-heading text-2xl text-white tracking-wider">COLLAPSED STRUCTURE SECTOR 4 VOID SCAN</h3>
                <p className="text-xs text-slate-400 font-mono">Micro-Doppler Acoustic Life-Sign Radar • Penetration Depth: 4.8m</p>
              </div>
            </div>
          )}

          {visionMode === 'flood' && (
            <div className="absolute inset-0">
              <img
                src="/images/hero_disaster_helicopter.jpg"
                alt="Flood Aerial Feed"
                className="w-full h-full object-cover filter saturate-120"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D14] via-transparent to-transparent"></div>
            </div>
          )}

          {/* Crosshair Tactical Grid Overlay */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="relative w-64 h-64 border border-cyan-400/25 rounded-full flex items-center justify-center">
              <div className="w-40 h-40 border border-dashed border-red-500/40 rounded-full animate-spin [animation-duration:15s]"></div>
              <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
              <div className="absolute top-0 w-px h-8 bg-cyan-400/50"></div>
              <div className="absolute bottom-0 w-px h-8 bg-cyan-400/50"></div>
              <div className="absolute left-0 h-px w-8 bg-cyan-400/50"></div>
              <div className="absolute right-0 h-px w-8 bg-cyan-400/50"></div>
              <span className="absolute -top-6 text-[10px] font-mono text-cyan-300">FOV: 110° • ALT: 340m</span>
            </div>
          </div>

          {/* Floating Tactical Badges Over Aerial Scene */}
          <div className="absolute top-6 left-6 z-20 space-y-2 pointer-events-none">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/85 border border-red-500/70 text-red-400 text-xs shadow-xl backdrop-blur">
              <AlertTriangle className="w-4 h-4 fill-red-500 text-black" />
              <div>
                <div className="font-bold font-mono uppercase text-white">EXTREME DANGER</div>
                <div className="text-[10px] text-red-300 font-sans">Immediate Evacuation Perimeter Active</div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/85 border border-amber-500/60 text-amber-400 text-xs shadow-xl backdrop-blur">
              <Volume2 className="w-4 h-4 text-amber-400" />
              <div>
                <div className="font-bold font-mono uppercase text-white">LOCALIZED AUDIO SIGNATURE</div>
                <div className="text-[10px] text-amber-200 font-sans">Acoustic distress tap nearby. Signal: 24% (45° W)</div>
              </div>
            </div>
          </div>

          {/* Top-Right Mission 3D Heat Topography Map Card */}
          <div className="absolute top-6 right-6 z-20 w-60 rounded-xl bg-[#0D101A]/90 border border-slate-700/80 p-3 shadow-2xl backdrop-blur select-none">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
              <span className="font-heading text-xs text-white uppercase tracking-wider">MISSION HEAT MAP</span>
              <span className="text-[10px] font-mono text-red-400 font-bold">RISK: CRITICAL</span>
            </div>

            <div className="relative h-24 rounded-lg overflow-hidden border border-slate-800 bg-[#090C14] mb-2">
              <img
                src="/images/thermal_3d_terrain.jpg"
                alt="3D Thermal Map"
                className="w-full h-full object-cover filter contrast-125 saturate-150"
              />
              <div className="absolute bottom-1 left-2 text-[10px] font-mono text-volt bg-black/70 px-1 rounded">
                Spread: 1.9 m/s (NE)
              </div>
            </div>

            <div className="space-y-1 text-[11px] font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Peak Thermal:</span>
                <span className="text-red-400 font-bold">{peakTemp}°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Flame Front:</span>
                <span className="text-amber-400">Propagation Detected</span>
              </div>
            </div>
          </div>

          {/* Sensor Filter Mode Selector Overlay */}
          <div className="absolute bottom-6 left-6 z-20 flex items-center gap-2 bg-black/80 p-1.5 rounded-xl border border-slate-700/80 backdrop-blur">
            <span className="text-[10px] font-mono text-slate-400 uppercase px-2">SENSOR:</span>
            {[
              { id: 'thermal', label: 'FLIR THERMAL', icon: Thermometer },
              { id: 'nightvision', label: 'NIGHT VISION', icon: Eye },
              { id: 'acoustic', label: 'ACOUSTIC RADAR', icon: Volume2 },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <button
                  key={f.id}
                  onClick={() => setSensorFilter(f.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold transition ${
                    sensorFilter === f.id
                      ? 'bg-volt text-black shadow-sm'
                      : 'text-slate-300 hover:text-white bg-[#141724]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* ========================================================
            BOTTOM 3-COLUMN TACTICAL MODULES (Exact from Reference)
            - Module 1: AI Analytics (Infrared Body Heat Signatures)
            - Module 2: Equip Drone Control
            - Module 3: Rescue Team Tactical Link
            ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-[#090C14] border-t border-[#1C2030]">
          
          {/* 1. AI ANALYTICS: HUMAN BODY HEAT SIGNATURE DETECTION */}
          <div className="md:col-span-4 rounded-xl bg-[#0F1320] border border-[#22283C] p-3.5 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between border-b border-[#22283C] pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-volt animate-ping"></span>
                <h3 className="font-heading text-sm text-white tracking-wider uppercase">
                  AI ANALYTICS • HEAT DETECTION
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                TRANSCRIPTION {transcriptionProgress}%
              </span>
            </div>

            {/* Infrared Video Feed Preview with Human Heat Silhouettes */}
            <div className="relative rounded-lg overflow-hidden border border-[#2B334D] bg-black p-2 flex gap-3 items-center">
              <div className="w-24 h-20 rounded bg-[#0A0D17] border border-cyan-500/40 overflow-hidden shrink-0 relative flex items-center justify-center">
                <img
                  src="/images/thermal_infrared_people.jpg"
                  alt="FLIR Heat Signature Body Detection"
                  className="w-full h-full object-cover filter contrast-125"
                />
                <span className="absolute bottom-0.5 right-1 text-[9px] font-mono text-volt bg-black/80 px-1 rounded">
                  37.2°C
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-heading text-sm text-volt tracking-wide uppercase">
                  PEOPLE LOCATED: {survivorCount} INDIVIDUALS
                </div>
                <p className="text-[11px] text-slate-300 font-body leading-tight pt-0.5">
                  AI identifies <strong>4 individuals</strong> inside the building near drone <strong>{activeDrone}</strong>. Infrared body heat signatures confirmed. Surrounding heat rising.
                </p>
                <div className="flex items-center gap-2 pt-1.5 text-[10px] font-mono text-cyan-300">
                  <span>Pulse: 84 bpm</span> • <span>Respiration: Normal</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 font-mono">
              <span>Bio-Signature Radar: <strong>LOCKED</strong></span>
              <span className="text-volt font-bold">STATUS: EVAC READY</span>
            </div>
          </div>

          {/* 2. DRONE EQUIPMENT CONTROL */}
          <div className="md:col-span-5 rounded-xl bg-[#0F1320] border border-[#22283C] p-3.5 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between border-b border-[#22283C] pb-2">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400" />
                <h3 className="font-heading text-sm text-white tracking-wider uppercase">
                  EQUIP CONTROL • FLEET DRONES (4 ACTIVE)
                </h3>
              </div>
              <div className="flex items-center gap-1">
                {(['DR-01', 'DR-02', 'DR-04'] as const).map(d => (
                  <button
                    key={d}
                    onClick={() => setActiveDrone(d)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition ${
                      activeDrone === d ? 'bg-cyan-500 text-black' : 'bg-[#181D2D] text-slate-400'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Drone Specs & Tactical Buttons */}
            <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
              <div className="p-1.5 rounded bg-[#141825] border border-slate-800">
                <span className="text-slate-400 block">SPEED</span>
                <strong className="text-white">12 m/s</strong>
              </div>
              <div className="p-1.5 rounded bg-[#141825] border border-slate-800">
                <span className="text-slate-400 block">ALTITUDE</span>
                <strong className="text-white">340 m</strong>
              </div>
              <div className="p-1.5 rounded bg-[#141825] border border-slate-800">
                <span className="text-slate-400 block">SIGNAL</span>
                <strong className="text-emerald-400">98%</strong>
              </div>
              <div className="p-1.5 rounded bg-[#141825] border border-slate-800">
                <span className="text-slate-400 block">BATTERY</span>
                <strong className="text-volt">78%</strong>
              </div>
            </div>

            {/* Interactive Control Toggles */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setIsAutoTracking(!isAutoTracking)}
                className={`py-1.5 rounded-lg text-[11px] font-heading tracking-wider uppercase transition border font-bold ${
                  isAutoTracking
                    ? 'bg-volt text-black border-volt'
                    : 'bg-[#141825] text-slate-300 border-[#2A3147]'
                }`}
              >
                Auto-Track
              </button>

              <button
                onClick={() => {
                  setPayloadDropped(true);
                  setTimeout(() => setPayloadDropped(false), 3000);
                }}
                className={`py-1.5 rounded-lg text-[11px] font-heading tracking-wider uppercase transition border font-bold ${
                  payloadDropped
                    ? 'bg-emerald-500 text-black border-emerald-400'
                    : 'bg-[#141825] text-slate-300 border-[#2A3147] hover:text-white'
                }`}
              >
                {payloadDropped ? 'PAYLOAD RELEASED!' : 'DROP PAYLOAD'}
              </button>

              <button
                onClick={() => setSensorFilter(s => s === 'thermal' ? 'nightvision' : 'thermal')}
                className="py-1.5 rounded-lg bg-[#141825] text-slate-300 border border-[#2A3147] hover:text-white text-[11px] font-heading tracking-wider uppercase font-bold"
              >
                THERMAL SCAN
              </button>
            </div>
          </div>

          {/* 3. RESCUE TEAM COMMS & WAYPOINT */}
          <div className="md:col-span-3 rounded-xl bg-[#0F1320] border border-[#22283C] p-3.5 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between border-b border-[#22283C] pb-2">
              <h3 className="font-heading text-sm text-white tracking-wider uppercase">
                RESCUE SQUAD ALPHA
              </h3>
              <span className="text-[10px] font-mono text-cyan-400">UNITS: 4 • MEN: 16</span>
            </div>

            {/* Team Leader Badge */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg bg-[#181D2D] border border-cyan-500/40 overflow-hidden shrink-0">
                <img
                  src="/images/card_rescue_teams.jpg"
                  alt="Team Leader"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 block">SQUAD LEADER</span>
                <h4 className="font-heading text-sm text-white tracking-wider">CPT. JHON HENDERSON</h4>
                <span className="text-[10px] font-mono text-emerald-400">RADIO: EN ROUTE (2m)</span>
              </div>
            </div>

            {/* Squad Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => alert('Radio Comms Opened: Channel 4 (Rescue Squad Alpha)')}
                className="py-1.5 rounded-lg bg-[#181D2D] hover:bg-[#22283E] text-slate-200 text-[11px] font-heading tracking-wider uppercase font-bold border border-[#2B334B]"
              >
                PUSH TO TALK
              </button>
              <button
                onClick={() => alert('Survivor Waypoint coordinates beamed to NDRF Tablet!')}
                className="py-1.5 rounded-lg bg-volt hover:bg-volt-hover text-black text-[11px] font-heading tracking-wider uppercase font-bold shadow-sm"
              >
                BEAM WAYPOINT
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
