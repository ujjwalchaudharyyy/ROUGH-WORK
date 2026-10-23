import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Shelter } from '../../types';
import { Users2, UserPlus, LogOut, CheckCircle2, ShieldAlert } from 'lucide-react';

export const ShelterRegistrationsPage: React.FC = () => {
  const [shelter, setShelter] = useState<Shelter | null>(null);
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [familyCount, setFamilyCount] = useState<number>(1);
  const [medicalNeeds, setMedicalNeeds] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchShelter = async () => {
    try {
      const res = await api.getShelters();
      const active = res.shelters?.find((s: any) => s.code === 'SHL-01') || res.shelters?.[0] || null;
      setShelter(active);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchShelter();
  }, []);

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shelter) return;
    setSubmitting(true);
    setSuccessMsg(null);

    try {
      await api.shelterCheckIn(shelter.id, {
        citizenName,
        citizenPhone,
        familyMembersCount: Number(familyCount),
        medicalNeeds,
      });

      setSuccessMsg(`✅ Party (${citizenName} + ${familyCount - 1} family members) successfully checked in!`);
      setIsRegistering(false);
      setCitizenName('');
      setCitizenPhone('');
      setMedicalNeeds('');
      fetchShelter();
    } catch (err: any) {
      alert(`Check-in failed: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <Users2 className="w-6 h-6 text-blue-400" />
            <span>Shelter Citizen & Family Registry</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Log incoming evacuee arrivals, allocate bed space, record chronic medical needs, and manage departures.
          </p>
        </div>

        <button
          onClick={() => setIsRegistering(!isRegistering)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg transition font-mono uppercase flex items-center gap-1.5 shadow-md"
        >
          <UserPlus className="w-4 h-4" />
          <span>{isRegistering ? 'Cancel' : 'Check-In New Family'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
          {successMsg}
        </div>
      )}

      {/* Check-In Form */}
      {isRegistering && shelter && (
        <form onSubmit={handleCheckIn} className="p-6 rounded-2xl bg-slate-900 border border-emerald-500/40 space-y-4 text-xs shadow-xl">
          <h3 className="text-sm font-bold text-white font-mono uppercase">
            Evacuee Arrival Check-In for {shelter.name}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">Primary Citizen / Head of Household *</label>
              <input
                type="text"
                required
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                placeholder="Full Name"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Phone Number (Optional)</label>
              <input
                type="tel"
                value={citizenPhone}
                onChange={(e) => setCitizenPhone(e.target.value)}
                placeholder="+91-XXXXX-XXXXX"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Party Size (Including Head) *</label>
              <input
                type="number"
                min={1}
                max={15}
                required
                value={familyCount}
                onChange={(e) => setFamilyCount(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100 font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1">Special Medical or Dietary Needs</label>
            <input
              type="text"
              value={medicalNeeds}
              onChange={(e) => setMedicalNeeds(e.target.value)}
              placeholder="e.g. Diabetics needing insulin storage, infant formula required, wheelchair user..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg font-mono uppercase tracking-wider transition"
          >
            {submitting ? 'Registering Party...' : 'Confirm Shelter Check-In & Allocate Beds'}
          </button>
        </form>
      )}

      {/* Registrations List */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-3">
        <h3 className="text-xs font-bold text-slate-200 font-mono uppercase">
          Active Shelter Inhabitants Roster ({shelter?.name})
        </h3>

        <div className="space-y-2">
          {[
            { name: 'Kavita Shinde', phone: '***-***-2291', party: 4, medical: 'Elderly mother with asthma', checkIn: 'Today, 08:30' },
            { name: 'Mohammed Farooq', phone: '***-***-8843', party: 3, medical: 'Infant formula needed', checkIn: 'Today, 09:15' },
            { name: 'Sunil Rao', phone: '***-***-5510', party: 2, medical: 'None', checkIn: 'Today, 10:45' },
          ].map((reg, i) => (
            <div key={i} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="font-bold text-slate-100">{reg.name}</span>
                <span className="text-slate-400 ml-2">({reg.party} members)</span>
                {reg.medical && <div className="text-[10px] text-purple-300 mt-0.5">Medical: {reg.medical}</div>}
              </div>
              <div className="text-right text-[10px] text-slate-400">
                <div>Checked In: {reg.checkIn}</div>
                <div className="text-emerald-400 font-bold">STATUS: ACTIVE</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
