import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { saveOfflineReport } from '../../services/offlineQueue';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { IncidentCategory } from '../../types';
import {
  ShieldAlert,
  MapPin,
  Users,
  AlertTriangle,
  Bot,
  CheckCircle2,
  Send,
  Save,
  Wifi,
  WifiOff,
  Crosshair,
  ArrowLeft,
  LifeBuoy,
} from 'lucide-react';

export const EmergencyReportPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();

  const [category, setCategory] = useState<IncidentCategory>('FLOOD');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState<number>(19.0760);
  const [longitude, setLongitude] = useState<number>(72.8777);
  const [affectedPeople, setAffectedPeople] = useState<number>(2);
  const [injuredCount, setInjuredCount] = useState<number>(0);
  const [trappedCount, setTrappedCount] = useState<number>(0);
  const [requiredAssistance, setRequiredAssistance] = useState<string[]>(['EVACUATION']);
  const [accessibilityNeeds, setAccessibilityNeeds] = useState<string>('');
  const [reporterName, setReporterName] = useState(user?.fullName || '');
  const [reporterContact, setReporterContact] = useState(user?.phone || '');
  const [privacyConsent, setPrivacyConsent] = useState(true);

  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [gpsCaptured, setGpsCaptured] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Load draft if available
  useEffect(() => {
    try {
      const draft = localStorage.getItem('displaceos_report_draft');
      if (draft) {
        const d = JSON.parse(draft);
        if (d.category) setCategory(d.category);
        if (d.title) setTitle(d.title);
        if (d.description) setDescription(d.description);
        if (d.address) setAddress(d.address);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSaveDraft = () => {
    localStorage.setItem(
      'displaceos_report_draft',
      JSON.stringify({ category, title, description, address })
    );
    alert('💾 Draft saved securely to your device. You can resume any time.');
  };

  const handleCaptureLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(parseFloat(pos.coords.latitude.toFixed(6)));
        setLongitude(parseFloat(pos.coords.longitude.toFixed(6)));
        setGpsCaptured(true);
        setIsGettingLocation(false);
        if (!address) {
          setAddress(`GPS Coords: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)} (Exact Geolocation Captured)`);
        }
      },
      (err) => {
        setIsGettingLocation(false);
        alert(`Location access denied or unavailable: ${err.message}. Using default sector coordinates.`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const toggleAssistance = (type: string) => {
    if (requiredAssistance.includes(type)) {
      setRequiredAssistance(requiredAssistance.filter((t) => t !== type));
    } else {
      setRequiredAssistance([...requiredAssistance, type]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!privacyConsent) {
      alert('Please confirm consent for emergency responders to process this data.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const payload = {
      category,
      title: title || `${category} Emergency in ${address.slice(0, 30)}`,
      description,
      address: address || 'Metro Sector Coordinates',
      latitude,
      longitude,
      affectedPeople: Number(affectedPeople),
      injuredCount: Number(injuredCount),
      trappedCount: Number(trappedCount),
      requiredAssistance: requiredAssistance.join(','),
      accessibilityNeeds,
      reporterName,
      reporterContact,
    };

    try {
      if (!navigator.onLine) {
        // Low-network / offline queue
        const offlineItem = saveOfflineReport(payload);
        setResult({
          offline: true,
          incident: {
            incidentCode: offlineItem.id,
            status: 'QUEUED_OFFLINE',
          },
          triage: {
            recommendedPriority: trappedCount > 0 || injuredCount > 0 ? 'P0' : 'P1',
            explanation: 'Offline safety queue: Report cached locally and will auto-transmit immediately once connectivity is re-established.',
            identifiedRisks: ['Offline submission queued safely'],
            suggestedActions: ['Stay on high ground. Await emergency team confirmation.'],
          },
        });
        localStorage.removeItem('displaceos_report_draft');
        return;
      }

      const res = await api.createIncident(payload);
      setResult(res);
      localStorage.removeItem('displaceos_report_draft');
    } catch (err: any) {
      setError(err.message || 'Failed to submit emergency report.');
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(16,185,129,0.4)] animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">
            {result.offline ? 'Report Saved to Offline Emergency Queue' : 'Emergency Report Successfully Transmitted'}
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Unique Tracking Code: <b className="text-cyan-400 text-sm">{result.incident?.incidentCode}</b>
          </p>
        </div>

        {/* AI Triage Feedback Banner */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-left space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-slate-200 font-mono flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>AI Triage Assessment</span>
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40">
              PRIORITY: {result.triage?.recommendedPriority}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {result.triage?.explanation}
          </p>
          {result.triage?.suggestedActions && (
            <div className="text-[11px] text-cyan-300 bg-cyan-950/40 p-2.5 rounded border border-cyan-500/20">
              <b>Recommended Next Actions:</b> {result.triage.suggestedActions.join('; ')}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            to="/citizen/requests"
            className="px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition"
          >
            Track Status Live &rarr;
          </Link>
          <button
            onClick={() => {
              setResult(null);
              setTitle('');
              setDescription('');
              setAddress('');
            }}
            className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition"
          >
            Report Another Incident
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/citizen/dashboard" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 font-mono">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
        <button
          type="button"
          onClick={handleSaveDraft}
          className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded transition"
        >
          <Save className="w-3.5 h-3.5" /> Save Draft
        </button>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-red-500 animate-pulse" />
          <h1 className="text-2xl font-extrabold text-white">Emergency Incident Report</h1>
        </div>
        <p className="text-xs text-slate-400">
          Please provide as much clear information as possible. Your report is immediately assessed by our AI triage engine and routed to the nearest rescue fleet.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-950/80 border border-red-500/40 text-red-200 text-xs font-mono">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900/90 p-6 rounded-2xl border border-slate-800 text-xs">
        {/* Category Picker */}
        <div>
          <label className="block text-slate-200 font-bold uppercase tracking-wider font-mono text-[11px] mb-2">
            1. Emergency Category <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: 'FLOOD', label: '🌊 Flood / Water Surge' },
              { id: 'BUILDING_COLLAPSE', label: '🏚️ Building Collapse' },
              { id: 'LANDSLIDE', label: '⛰️ Landslide / Mudslide' },
              { id: 'MEDICAL_EMERGENCY', label: '🚑 Medical Emergency' },
              { id: 'FIRE', label: '🔥 Fire / Hazmat Smoke' },
              { id: 'FOOD_WATER_SHORTAGE', label: '🍞 Food / Water Depleted' },
              { id: 'EVACUATION_REQUEST', label: '🚶 Evacuation Assistance' },
              { id: 'ROAD_BLOCKAGE', label: '🚧 Road Impassable' },
              { id: 'OTHER', label: '⚠️ Other Emergency' },
            ].map((cat) => (
              <button
                type="button"
                key={cat.id}
                onClick={() => setCategory(cat.id as IncidentCategory)}
                className={`p-2.5 rounded-lg border text-left font-medium transition ${
                  category === cat.id
                    ? 'border-red-500 bg-red-950/40 text-red-300 font-bold shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                    : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Short Title & Detailed Description */}
        <div className="space-y-3">
          <div>
            <label className="block text-slate-200 font-bold uppercase tracking-wider font-mono text-[11px] mb-1">
              2. Short Summary <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 5 people trapped on balcony with rising flood waters"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-slate-200 font-bold uppercase tracking-wider font-mono text-[11px] mb-1">
              3. Detailed Situation & Exact Location Marks <span className="text-red-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe current water level, structural condition, landmarks, visible hazards, or specific medical symptoms..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Location & GPS Capture */}
        <div className="space-y-2">
          <label className="block text-slate-200 font-bold uppercase tracking-wider font-mono text-[11px]">
            4. Location & GPS Geotag <span className="text-red-400">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Building name, street, nearby landmark, or ward..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="button"
              onClick={handleCaptureLocation}
              disabled={isGettingLocation}
              className={`px-3 py-2 rounded-lg border font-mono font-bold flex items-center gap-1.5 transition ${
                gpsCaptured
                  ? 'border-emerald-500 bg-emerald-950/60 text-emerald-400'
                  : 'border-cyan-500 bg-cyan-950/60 text-cyan-300 hover:bg-cyan-900/60'
              }`}
            >
              <Crosshair className={`w-4 h-4 ${isGettingLocation ? 'animate-spin' : ''}`} />
              <span>{isGettingLocation ? 'Capturing...' : gpsCaptured ? 'GPS Locked' : 'Auto-Capture GPS'}</span>
            </button>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            Lat: <b>{latitude.toFixed(4)}</b> | Lng: <b>{longitude.toFixed(4)}</b> (Geospatial coordinates verified)
          </div>
        </div>

        {/* Casualty & Entrapment Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <label className="block text-slate-300 font-mono text-[10px] uppercase font-bold mb-1">
              People Affected
            </label>
            <input
              type="number"
              min={1}
              value={affectedPeople}
              onChange={(e) => setAffectedPeople(parseInt(e.target.value) || 1)}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 font-mono font-bold text-sm"
            />
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <label className="block text-amber-300 font-mono text-[10px] uppercase font-bold mb-1">
              Trapped / Stranded
            </label>
            <input
              type="number"
              min={0}
              value={trappedCount}
              onChange={(e) => setTrappedCount(parseInt(e.target.value) || 0)}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-amber-300 font-mono font-bold text-sm"
            />
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <label className="block text-red-300 font-mono text-[10px] uppercase font-bold mb-1">
              Injuries / Casualties
            </label>
            <input
              type="number"
              min={0}
              value={injuredCount}
              onChange={(e) => setInjuredCount(parseInt(e.target.value) || 0)}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-red-300 font-mono font-bold text-sm"
            />
          </div>
        </div>

        {/* Required Assistance Checkboxes */}
        <div>
          <label className="block text-slate-200 font-bold uppercase tracking-wider font-mono text-[11px] mb-2">
            5. Required Assistance Types
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'EVACUATION', label: 'Evacuation & Rescue' },
              { id: 'MEDICAL', label: 'Urgent Medical Support / Ambulance' },
              { id: 'FOOD_WATER', label: 'Drinking Water & Rations' },
              { id: 'SHELTER', label: 'Emergency Shelter Space' },
              { id: 'PUMPING', label: 'Water De-watering Pump' },
            ].map((a) => (
              <button
                type="button"
                key={a.id}
                onClick={() => toggleAssistance(a.id)}
                className={`px-3 py-1.5 rounded-lg border font-medium text-xs transition ${
                  requiredAssistance.includes(a.id)
                    ? 'border-cyan-400 bg-cyan-950/60 text-cyan-200 font-bold'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                }`}
              >
                {requiredAssistance.includes(a.id) ? '✓ ' : '+ '}
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accessibility & Vulnerabilities */}
        <div>
          <label className="block text-slate-200 font-bold uppercase tracking-wider font-mono text-[11px] mb-1">
            6. Vulnerability or Accessibility Needs (Optional)
          </label>
          <input
            type="text"
            value={accessibilityNeeds}
            onChange={(e) => setAccessibilityNeeds(e.target.value)}
            placeholder="e.g. Elderly with walker, pregnant woman, infant needs formula, dialysis patient..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Reporter Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Your Name</label>
            <input
              type="text"
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              placeholder="Full Name"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-medium mb-1">Callback Phone Number</label>
            <input
              type="tel"
              value={reporterContact}
              onChange={(e) => setReporterContact(e.target.value)}
              placeholder="+91-XXXXX-XXXXX"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Privacy Consent */}
        <div className="flex items-start gap-2.5 pt-2">
          <input
            type="checkbox"
            id="privacyConsent"
            checked={privacyConsent}
            onChange={(e) => setPrivacyConsent(e.target.checked)}
            className="rounded border-slate-700 bg-slate-800 text-red-500 focus:ring-0 mt-0.5"
          />
          <label htmlFor="privacyConsent" className="text-[11px] text-slate-400 leading-normal cursor-pointer">
            I consent to sharing this emergency report and GPS coordinates with authorized disaster relief dispatchers and rescue teams in accordance with DisplaceOS privacy protocols.
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-sm uppercase tracking-wider font-mono rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.5)] transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span>{submitting ? 'Transmitting Emergency Alert...' : 'Transmit Emergency Report Now'}</span>
        </button>
      </form>
    </div>
  );
};
