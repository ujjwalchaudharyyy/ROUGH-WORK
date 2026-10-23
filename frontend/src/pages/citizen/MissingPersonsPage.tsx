import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { MissingPersonCase } from '../../types';
import {
  Search,
  UserPlus,
  ShieldCheck,
  MapPin,
  Clock,
  Phone,
  AlertTriangle,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const MissingPersonsPage: React.FC = () => {
  const [cases, setCases] = useState<MissingPersonCase[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isReporting, setIsReporting] = useState(false);

  // Form state
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState('MALE');
  const [lastSeenLocation, setLastSeenLocation] = useState('');
  const [physicalDescription, setPhysicalDescription] = useState('');
  const [clothingDescription, setClothingDescription] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [reporterRelation, setReporterRelation] = useState('FAMILY');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchCases = async () => {
    try {
      const res = await api.getMissingPersons({ search });
      setCases(res.cases || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.reportMissingPerson({
        fullName,
        age: age ? Number(age) : null,
        gender,
        lastSeenLocation,
        physicalDescription,
        clothingDescription,
        emergencyContact,
        reporterName,
        reporterPhone,
        reporterRelation,
      });

      setSuccessMsg(`✅ Missing person report registered successfully. Command center alerted.`);
      setIsReporting(false);
      setFullName('');
      setLastSeenLocation('');
      setEmergencyContact('');
      fetchCases();
    } catch (err: any) {
      alert(`Submission failed: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <Search className="w-6 h-6 text-amber-400" />
            <span>Missing Persons & Family Reunification</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Privacy-conscious reporting and search registry to help locate separated loved ones during disaster crises.
          </p>
        </div>

        <button
          onClick={() => setIsReporting(!isReporting)}
          className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-lg transition font-mono uppercase flex items-center gap-1.5"
        >
          <UserPlus className="w-4 h-4" />
          <span>{isReporting ? 'Close Form' : 'Report Missing Person'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
          {successMsg}
        </div>
      )}

      {/* Privacy Guarantee Pill */}
      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center gap-2 font-mono">
        <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>
          <b>Data Protection:</b> Precise home addresses and personal telephone contacts are redacted to protect vulnerable individuals from fraud or harassment.
        </span>
      </div>

      {/* Report Form Drawer/Modal */}
      {isReporting && (
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-slate-900 border border-amber-500/40 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-amber-300 font-mono uppercase">
            New Missing Person Investigation File
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Full Legal Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Approximate Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value === '' ? '' : parseInt(e.target.value))}
                placeholder="e.g. 34"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other / Non-Binary</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Last Seen Location & Time *</label>
            <input
              type="text"
              required
              value={lastSeenLocation}
              onChange={(e) => setLastSeenLocation(e.target.value)}
              placeholder="e.g. Kurla Station Platform 1 subway, approx 14:30 during cloudburst"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Physical Description & Features</label>
              <textarea
                rows={2}
                value={physicalDescription}
                onChange={(e) => setPhysicalDescription(e.target.value)}
                placeholder="Height, build, spectacles, scars, tattoos, hair color..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Clothing & Belongings Last Worn</label>
              <textarea
                rows={2}
                value={clothingDescription}
                onChange={(e) => setClothingDescription(e.target.value)}
                placeholder="Color of shirt, footwear, jacket, backpack, umbrella..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Emergency Contact Info *</label>
              <input
                type="text"
                required
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="Phone & relationship to contact"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Your Name</label>
              <input
                type="text"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="Reporter full name"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Relationship to Missing</label>
              <select
                value={reporterRelation}
                onChange={(e) => setReporterRelation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100"
              >
                <option value="PARENT">Parent</option>
                <option value="SPOUSE">Spouse</option>
                <option value="CHILD">Child / Offspring</option>
                <option value="SIBLING">Sibling</option>
                <option value="COMMUNITY_MEMBER">Neighbor / Colleague</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg uppercase tracking-wider font-mono transition"
          >
            {submitting ? 'Registering File...' : 'Submit Missing Person Case to Operations Center'}
          </button>
        </form>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by person name, case code, or last known landmark..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cases.map((c) => {
          let badgeColor = 'bg-blue-950 text-blue-300 border-blue-500/40';
          if (c.status === 'LOCATED') badgeColor = 'bg-emerald-950 text-emerald-300 border-emerald-500/40';
          if (c.status === 'POTENTIAL_MATCH') badgeColor = 'bg-amber-950 text-amber-300 border-amber-500/40';

          return (
            <div key={c.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-amber-400">{c.caseCode}</span>
                  <h3 className="font-bold text-sm text-slate-100">{c.fullName}</h3>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${badgeColor}`}>
                  {c.status.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 font-mono">
                <div>Age: <b>{c.age || 'Unknown'}</b></div>
                <div>Gender: <b>{c.gender || 'Unknown'}</b></div>
              </div>

              <div className="text-xs space-y-1">
                <div className="flex items-start gap-1.5 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Last Seen: <b className="text-slate-200">{c.lastSeenLocation}</b></span>
                </div>
                {c.clothingDescription && (
                  <div className="text-[11px] text-slate-400">
                    Clothing: <span className="text-slate-300">{c.clothingDescription}</span>
                  </div>
                )}
                {c.physicalDescription && (
                  <div className="text-[11px] text-slate-400">
                    Features: <span className="text-slate-300">{c.physicalDescription}</span>
                  </div>
                )}
              </div>

              {/* Updates lead */}
              {c.updates && c.updates.length > 0 && (
                <div className="p-2 rounded bg-slate-950/80 border border-slate-800 text-[11px] text-cyan-300 space-y-1">
                  <div className="text-[9px] uppercase font-mono text-slate-500 font-bold">Investigation Lead:</div>
                  <div>{c.updates[0].updateText}</div>
                </div>
              )}

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Reporter: {c.reporterName}</span>
                <span className="text-slate-400">{c.emergencyContact}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
