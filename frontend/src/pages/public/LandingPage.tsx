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
  FileText,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Active states
  const [activeTab, setActiveTab] = useState<'timeline' | 'catalog'>('timeline');
  const [activeDay, setActiveDay] = useState<1 | 2 | 3>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

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

  // Schedule Data for 3 Days
  const scheduleData = {
    1: [
      {
        id: 'ev-1',
        time: '9:00 AM',
        category: 'Desk',
        location: 'Central Registration Desk',
        badgeColor: 'border-yellow-400 text-yellow-300',
        title: 'REGISTRATION VERIFICATION',
        subtitle: '"Verify Credentials & Collect Fest & Response Kits"',
        desc: 'All registered participants, team captains, and pass holders must report to the Central Registration Desk to verify student IDs, validate registration forms/exclusive passes, and receive official Prayukti & DisplaceOS credentials.',
        tags: ['Mandatory', 'Credentials', 'Desk'],
      },
      {
        id: 'ev-2',
        time: '11:00 AM',
        category: 'Ceremony',
        location: 'Auditorium / OAT',
        badgeColor: 'border-blue-400 text-blue-300',
        title: 'OPENING CEREMONY',
        subtitle: '"The Grand Inauguration of Prayukti & Crisis Response 2026"',
        desc: 'Official grand commencement featuring auspicious lamp lighting, keynote addresses by distinguished chief guests, unveiling of the hackathon problem statements, and live simulation kickoff.',
        tags: ['Keynote', 'Kickoff', 'Auditorium'],
      },
      {
        id: 'ev-3',
        time: '1:30 PM',
        category: 'Technical',
        location: 'Lab Complex 3 & 4',
        badgeColor: 'border-purple-400 text-purple-300',
        title: 'FLAGSHIP HACKATHON: ARENA BATTLES ROUND 1',
        subtitle: '"AI-Powered Disaster Relief & Vibeathon Prototyping"',
        desc: 'Participating developer teams begin their 36-hour continuous build sprint. Mentorship check-ins for algorithmic triage, live GIS dispatch mapping, and decentralized offline synchronization.',
        tags: ['Hackathon', 'Coding', 'Round 1'],
      },
      {
        id: 'ev-4',
        time: '4:00 PM',
        category: 'Simulation',
        location: 'EOC Command Theater',
        badgeColor: 'border-emerald-400 text-emerald-300',
        title: 'LIVE DISASTER SIMULATION & EVACUATION DRILL',
        subtitle: '"Simulated Flash Flood Surge & Squad Dispatch Verification"',
        desc: 'Hands-on civil defense demonstration simulating 12,000+ affected citizens, autonomous rescue team route calculation, and real-time relief ration logistics.',
        tags: ['Live Demo', 'EOC', 'Simulation'],
      },
    ],
    2: [
      {
        id: 'ev-5',
        time: '10:00 AM',
        category: 'Technical',
        location: 'Main Seminar Hall',
        badgeColor: 'border-cyan-400 text-cyan-300',
        title: 'AI ETHICS & DISASTER TRIAGE WORKSHOP',
        subtitle: '"Deterministic Safety Baselines in Emergency ML Systems"',
        desc: 'Technical workshop exploring P0/P1 emergency triage algorithms, human-in-the-loop validation, and privacy-preserving missing persons biometric models.',
        tags: ['Workshop', 'AI Safety', 'Ethics'],
      },
      {
        id: 'ev-6',
        time: '2:00 PM',
        category: 'Tournament',
        location: 'Sports Arena Complex',
        badgeColor: 'border-amber-400 text-amber-300',
        title: 'DRONE RECONNAISSANCE TOURNAMENT',
        subtitle: '"Autonomous Flood Search & Obstacle Navigation"',
        desc: 'Competitive UAV drone obstacle navigation and survivor beacon localization within a simulated obstacle and fog perimeter.',
        tags: ['Robotics', 'Hardware', 'Tournament'],
      },
      {
        id: 'ev-7',
        time: '6:00 PM',
        category: 'Cultural',
        location: 'Open Air Amphitheatre',
        badgeColor: 'border-pink-400 text-pink-300',
        title: 'FEST NIGHT & CULTURAL SHOWCASE',
        subtitle: '"Music, Performance & Community Celebration"',
        desc: 'An evening of musical performances, live band showcases, and community gathering for participants, faculty, and guests.',
        tags: ['Cultural', 'Music', 'Celebration'],
      },
    ],
    3: [
      {
        id: 'ev-8',
        time: '11:00 AM',
        category: 'Finals',
        location: 'Auditorium',
        badgeColor: 'border-red-400 text-red-300',
        title: 'GRAND FINALE: CODE DEMOS & EVALUATION',
        subtitle: '"Jury Review, Live Benchmarking & Scalability Tests"',
        desc: 'Top finalist teams pitch their working software solutions to the grand jury panel, demonstrating low-bandwidth resilience and 4K command visualization.',
        tags: ['Jury', 'Final Pitch', 'Awards'],
      },
      {
        id: 'ev-9',
        time: '4:00 PM',
        category: 'Valedictory',
        location: 'Auditorium',
        badgeColor: 'border-volt text-volt',
        title: 'VALEDICTORY & PRIZE DISTRIBUTION',
        subtitle: '"Honoring Winners, Responders & Innovators"',
        desc: 'Official closing ceremony, trophy presentations, cash prize disbursements, and announcement of open-source deployment partnerships.',
        tags: ['Prizes', 'Closing', 'Awards'],
      },
    ],
  };

  const currentEvents = scheduleData[activeDay].filter((ev) =>
    ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ev.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ev.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-slate-100 font-body selection:bg-volt selection:text-black">
      
      {/* ========================================================
          CLEAN MINIMALIST NAVBAR (Matching Uploaded Screenshot)
          ======================================================== */}
      <nav className="w-full border-b border-[#1A1C23] bg-[#0A0B0E] px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40">
        {/* Left: Back / Title / Closed badge */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="w-8 h-8 rounded-full bg-[#16181F] border border-[#232630] flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#20232B] transition"
          >
            ←
          </Link>
          <span className="font-heading text-xl sm:text-2xl text-white tracking-wider font-normal">
            PRAYUKTI 2026
          </span>
          <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-[#14151B] border border-[#262833] text-[11px] font-heading tracking-wider uppercase text-slate-400">
            REGISTRATION CLOSED
          </span>
        </div>

        {/* Center/Right Nav Links */}
        <div className="hidden md:flex items-center gap-6 text-xs font-heading tracking-wider uppercase text-slate-300">
          <Link to="/" className="text-white hover:text-volt transition">HOME</Link>
          <a href="#schedule" className="text-volt transition">EVENTS</a>
          <Link to="/features" className="hover:text-volt transition">EXCLUSIVE PASSES</Link>
          <Link to="/about" className="hover:text-volt transition">RESULTS</Link>
          <Link to="/safety" className="hover:text-volt transition">SPONSORS</Link>
          <Link to="/emergency-resources" className="hover:text-volt transition">GALLERY</Link>
          <Link to="/command/dashboard" className="hover:text-volt transition">COMMAND CENTER</Link>
        </div>

        {/* Right Action */}
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="px-4 py-1.5 rounded-full bg-volt hover:bg-volt-hover text-black font-heading tracking-wider text-xs uppercase font-bold transition shadow-sm hover:scale-105"
          >
            LOGIN / ACCESS
          </Link>
        </div>
      </nav>

      {/* ========================================================
          MAIN HERO / HEADER SECTION (Exact Typography & Layout)
          ======================================================== */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-20">
        
        {/* Top Tag */}
        <div className="flex items-center gap-2.5 mb-3">
          <span className="px-2.5 py-0.5 rounded-md bg-volt text-black text-xs font-heading font-black tracking-wider uppercase">
            PRAYUKTI 2026
          </span>
          <span className="text-xs font-mono tracking-wider uppercase text-slate-400 font-semibold">
            OFFICIAL TECHNICAL & CULTURAL EVENTS
          </span>
        </div>

        {/* Big Bold Compressed Heading (Exact Anton/Impact style) */}
        <h1 className="font-heading uppercase tracking-wide text-5xl sm:text-6xl lg:text-7xl font-normal text-white leading-none mb-3">
          ALL EVENTS & SCHEDULE
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-400 font-body max-w-3xl leading-relaxed mb-6">
          Explore the official 3-day event timeline, tournament brackets, departmental rulebooks, and direct Google Form registration links.
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
            <span>3-DAY SCHEDULE & TIMELINE</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-heading tracking-wider text-xs uppercase font-bold transition ${
              activeTab === 'catalog'
                ? 'bg-volt text-black'
                : 'bg-[#14161D] text-slate-300 border border-[#252834] hover:text-white'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>DEPARTMENT CATALOG</span>
          </button>

          <Link
            to="/command/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#181B24] border border-[#2B2F3D] text-cyan-300 hover:text-white font-heading tracking-wider text-xs uppercase font-bold transition ml-auto"
          >
            <span>LIVE 4K COMMAND DASHBOARD</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* ========================================================
            DAY SELECTOR & SEARCH BAR
            ======================================================== */}
        <div className="rounded-2xl bg-[#0F1014] border border-[#1E2028] p-3 sm:p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Day Pills */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {[
              { day: 1, label: 'DAY 1 (22 OCT 2026)' },
              { day: 2, label: 'DAY 2 (23 OCT 2026)' },
              { day: 3, label: 'DAY 3 (24 OCT 2026)' },
            ].map((d) => (
              <button
                key={d.day}
                onClick={() => setActiveDay(d.day as any)}
                className={`px-4 py-1.5 rounded-full text-xs font-heading tracking-wider uppercase font-bold transition whitespace-nowrap ${
                  activeDay === d.day
                    ? 'bg-volt text-black shadow-md'
                    : 'bg-[#161820] text-slate-400 border border-[#242733] hover:text-slate-200'
                }`}
              >
                {d.label}
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
              placeholder="Search schedule, events..."
              className="w-full h-9 pl-9 pr-4 bg-[#14161D] border border-[#242733] rounded-full text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-volt transition"
            />
          </div>
        </div>

        {/* ========================================================
            DAY 1 SECTION BANNER
            ======================================================== */}
        <div className="rounded-xl bg-[#111318] border border-[#1E2029] px-4 py-3 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-volt text-black text-xs font-heading font-black tracking-wider uppercase">
              DAY {activeDay}
            </span>
            <span className="font-heading text-sm sm:text-base text-white tracking-wide uppercase font-normal">
              {activeDay === 1 && 'INAUGURATION, PRELIMS & FLAGSHIP TOURNAMENTS'}
              {activeDay === 2 && 'TECHNICAL KEYNOTES, WORKSHOPS & ARENA SPRINT'}
              {activeDay === 3 && 'GRAND FINALE, JURY PITCH & VALEDICTORY AWARDS'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{currentEvents.length} Events Scheduled</span>
          </div>
        </div>

        {/* ========================================================
            SCHEDULE TIMELINE WITH LEFT ACCENT LINE & YELLOW NODES
            ======================================================== */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-volt/60 space-y-5">
          {currentEvents.map((event, idx) => (
            <div key={event.id} className="relative group">
              
              {/* Yellow Node Dot on Vertical Line */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-6 w-3.5 h-3.5 rounded-full bg-volt border-2 border-[#0A0B0E] shadow-[0_0_8px_rgba(212,249,51,0.6)]"></div>

              {/* Event Card */}
              <div className="rounded-2xl bg-[#0F1116] border border-[#1E212A] hover:border-[#343847] p-5 sm:p-6 transition-all duration-200 shadow-md">
                
                {/* Top Badges: Time, Category, Location */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {/* Time Badge */}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#171922] border border-volt/40 text-volt text-xs font-mono font-bold">
                    <Clock className="w-3 h-3 text-volt" />
                    <span>{event.time}</span>
                  </span>

                  {/* Category Badge */}
                  <span className="px-2.5 py-1 rounded-md bg-[#14161F] border border-slate-700 text-slate-300 text-xs font-mono">
                    {event.category}
                  </span>

                  {/* Location Badge */}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#14161F] border border-slate-700 text-slate-300 text-xs font-mono">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{event.location}</span>
                  </span>

                  {/* Secondary Tag */}
                  <span className="px-2 py-0.5 rounded bg-[#1D202B] text-slate-400 text-[10px] font-mono uppercase">
                    {event.category.toUpperCase()}
                  </span>
                </div>

                {/* Main Card Content */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1.5 max-w-3xl">
                    <h2 className="font-heading uppercase tracking-wide text-2xl sm:text-3xl text-white font-normal group-hover:text-volt transition-colors">
                      {event.title}
                    </h2>
                    
                    <p className="text-xs sm:text-sm text-yellow-300/80 italic font-body">
                      {event.subtitle}
                    </p>

                    <p className="text-xs sm:text-sm text-slate-300 font-body leading-relaxed pt-1">
                      {event.desc}
                    </p>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#161820] hover:bg-[#20232E] border border-[#2B2F3D] hover:border-volt/50 text-slate-200 hover:text-white text-xs font-heading tracking-wider uppercase font-bold transition shrink-0 cursor-pointer shadow-sm"
                  >
                    <span>DETAILS</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-volt" />
                  </button>
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
                DISASTER COMMAND SIMULATION & EOC ACCESS
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-body">
                Quick-access live role accounts for hackathon evaluation and field dispatch demonstration.
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

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#101217] border border-[#282B37] rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded bg-volt text-black text-xs font-heading font-black tracking-wider uppercase">
                {selectedEvent.category}
              </span>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div>
              <h3 className="font-heading text-2xl text-white tracking-wide uppercase">
                {selectedEvent.title}
              </h3>
              <p className="text-xs text-yellow-300 italic pt-0.5 font-body">
                {selectedEvent.subtitle}
              </p>
            </div>

            <p className="text-xs text-slate-300 font-body leading-relaxed">
              {selectedEvent.desc}
            </p>

            <div className="flex items-center gap-3 pt-2 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-volt" /> {selectedEvent.time}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-volt" /> {selectedEvent.location}
              </span>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-[#1F222C]">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-1.5 rounded-lg bg-[#181A22] hover:bg-[#20232E] text-slate-300 text-xs font-heading tracking-wider"
              >
                CLOSE
              </button>
              <button
                onClick={() => {
                  setSelectedEvent(null);
                  navigate('/command/dashboard');
                }}
                className="px-4 py-1.5 rounded-lg bg-volt hover:bg-volt-hover text-black text-xs font-heading tracking-wider font-bold"
              >
                VIEW LIVE TELEMETRY
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
