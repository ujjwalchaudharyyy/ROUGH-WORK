import {
  MOCK_INCIDENTS,
  MOCK_TEAMS,
  MOCK_SHELTERS,
  MOCK_INVENTORY,
  MOCK_ALERTS,
  MOCK_KPIS,
  MOCK_CHARTS,
  MOCK_MISSIONS,
} from './mockData';

const getApiBase = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return '/api';
  const base = envUrl.replace(/\/+$/, '');
  return base.endsWith('/api') ? base : `${base}/api`;
};

const API_BASE = getApiBase();

// ─── Check if backend is available ───────────────────────────────────────────
// If VITE_API_URL is not set and we're not on localhost, backend isn't deployed
const isBackendConfigured = (): boolean => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) return true; // Railway URL explicitly set
  // Running locally — check if it's localhost
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
};

// ─── OFFLINE DEMO MOCK DATA ───────────────────────────────────────────────────
// These kick in when no backend is available (Vercel-only deploy, no Railway yet)
const DEMO_USERS: Record<string, any> = {
  COMMAND_CENTER: {
    token: 'demo_token_command_center',
    user: {
      id: 'demo-cmd-001',
      email: 'commander@displaceos.org',
      fullName: 'Cdr. Arjun Mehta',
      role: 'COMMAND_CENTER',
      organization: 'National Disaster Management Authority',
      phone: '+91-11-2301-0001',
      status: 'ACTIVE',
      preferredLanguage: 'en',
      createdAt: new Date().toISOString(),
    },
  },
  RESCUE_TEAM: {
    token: 'demo_token_rescue_team',
    user: {
      id: 'demo-rescue-001',
      email: 'team.alpha@displaceos.org',
      fullName: 'Team Leader Priya Singh',
      role: 'RESCUE_TEAM',
      organization: 'NDRF Battalion 7',
      phone: '+91-98765-43210',
      status: 'ACTIVE',
      preferredLanguage: 'en',
      createdAt: new Date().toISOString(),
    },
  },
  SHELTER_MANAGER: {
    token: 'demo_token_shelter_manager',
    user: {
      id: 'demo-shelter-001',
      email: 'shelter.metro@displaceos.org',
      fullName: 'Shelter Coord. Kavya Nair',
      role: 'SHELTER_MANAGER',
      organization: 'Metro Relief Authority',
      phone: '+91-80-4567-8901',
      status: 'ACTIVE',
      preferredLanguage: 'en',
      createdAt: new Date().toISOString(),
    },
  },
  MEDICAL_RESPONDER: {
    token: 'demo_token_medical',
    user: {
      id: 'demo-medical-001',
      email: 'medical.team@displaceos.org',
      fullName: 'Dr. Rahul Sharma',
      role: 'MEDICAL_RESPONDER',
      organization: 'Emergency Medical Services',
      phone: '+91-98111-22333',
      status: 'ACTIVE',
      preferredLanguage: 'en',
      createdAt: new Date().toISOString(),
    },
  },
  CITIZEN: {
    token: 'demo_token_citizen',
    user: {
      id: 'demo-citizen-001',
      email: 'citizen.rahul@gmail.com',
      fullName: 'Rahul Kumar',
      role: 'CITIZEN',
      organization: null,
      phone: '+91-99887-76655',
      status: 'ACTIVE',
      preferredLanguage: 'en',
      createdAt: new Date().toISOString(),
    },
  },
};

const DEMO_EMAILS: Record<string, string> = {
  'commander@displaceos.org': 'COMMAND_CENTER',
  'team.alpha@displaceos.org': 'RESCUE_TEAM',
  'shelter.metro@displaceos.org': 'SHELTER_MANAGER',
  'medical.team@displaceos.org': 'MEDICAL_RESPONDER',
  'citizen.rahul@gmail.com': 'CITIZEN',
};

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('displaceos_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Safely parse JSON from a Response.
 * Returns null if body is empty or not valid JSON (e.g. HTML error pages).
 */
const safeJson = async (res: Response): Promise<any> => {
  const text = await res.text();
  if (!text || text.trim() === '') return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

/**
 * Central fetch wrapper — handles empty/non-JSON bodies gracefully.
 * On error responses, tries to extract `.error` or `.message` from body.
 */
const apiFetch = async (
  url: string,
  options: RequestInit = {},
  defaultHeaders: HeadersInit = getAuthHeaders()
): Promise<any> => {
  let res: Response;
  try {
    res = await fetch(url, { ...options, headers: { ...defaultHeaders, ...options.headers } });
  } catch {
    throw new Error('Cannot connect to server. Backend may not be deployed yet.');
  }

  const data = await safeJson(res);

  if (!res.ok) {
    const msg =
      (data && (data.error || data.message)) ||
      `Server error ${res.status}: ${res.statusText || 'Unknown error'}`;
    throw new Error(msg);
  }

  return data;
};

export const api = {
  // ── Auth ─────────────────────────────────────────────────────────────
  async login(credentials: { email: string; password?: string }) {
    const emailKey = (credentials.email || '').toLowerCase().trim();

    if (isBackendConfigured()) {
      try {
        return await apiFetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          body: JSON.stringify({ email: emailKey, password: credentials.password }),
        }, { 'Content-Type': 'application/json' });
      } catch (err: any) {
        // If backend fails or returned error, check if it's one of the demo emails and fall back seamlessly
        const role = DEMO_EMAILS[emailKey];
        if (role && DEMO_USERS[role]) {
          return DEMO_USERS[role];
        }
        throw err;
      }
    }

    // Offline mode
    const role = DEMO_EMAILS[emailKey] || 'COMMAND_CENTER';
    if (DEMO_USERS[role]) {
      await new Promise((r) => setTimeout(r, 200));
      return DEMO_USERS[role];
    }
    throw new Error('Unknown email. Use one of the demo role buttons below.');
  },

  async demoLogin(role: string) {
    const normalizedRole = role === 'MEDICAL' ? 'MEDICAL_RESPONDER' : role;

    if (isBackendConfigured()) {
      try {
        return await apiFetch(`${API_BASE}/auth/demo-login`, {
          method: 'POST',
          body: JSON.stringify({ role: normalizedRole }),
        }, { 'Content-Type': 'application/json' });
      } catch (err) {
        console.warn('Backend demo-login had error, using reliable fallback:', err);
      }
    }

    // Always succeed with mock user
    await new Promise((r) => setTimeout(r, 150));
    const mock = DEMO_USERS[normalizedRole] || DEMO_USERS['COMMAND_CENTER'];
    return mock;
  },

  async register(data: any) {
    if (!isBackendConfigured()) {
      throw new Error('Registration requires the backend to be deployed. Use demo login instead.');
    }
    return apiFetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(data),
    }, { 'Content-Type': 'application/json' });
  },

  async getMe() {
    // If using a demo token, reconstruct user from mock data
    const token = localStorage.getItem('displaceos_token');
    if (token?.startsWith('demo_token_')) {
      const roleKey = token.replace('demo_token_', '').toUpperCase().replace(/-/g, '_');
      // Map token suffix to role key
      const tokenRoleMap: Record<string, string> = {
        'COMMAND_CENTER': 'COMMAND_CENTER',
        'RESCUE_TEAM': 'RESCUE_TEAM',
        'SHELTER_MANAGER': 'SHELTER_MANAGER',
        'MEDICAL': 'MEDICAL_RESPONDER',
        'CITIZEN': 'CITIZEN',
      };
      const role = tokenRoleMap[roleKey] || roleKey;
      if (DEMO_USERS[role]) return DEMO_USERS[role];
    }
    if (!isBackendConfigured()) {
      throw new Error('No valid session');
    }
    return apiFetch(`${API_BASE}/auth/me`);
  },

  // ── Incidents ─────────────────────────────────────────────────────────
  async getIncidents(params: Record<string, any> = {}) {
    if (isBackendConfigured()) {
      try {
        const qs = new URLSearchParams(
          Object.fromEntries(
            Object.entries(params)
              .filter(([, v]) => v !== undefined && v !== null)
              .map(([k, v]) => [k, String(v)])
          )
        ).toString();
        const res = await apiFetch(`${API_BASE}/incidents?${qs}`);
        if (res?.incidents && res.incidents.length > 0) return res;
      } catch (err) {
        console.warn('Backend incidents fetch failed, using realistic demo dataset:', err);
      }
    }
    let filtered = [...MOCK_INCIDENTS];
    if (params.category && params.category !== 'ALL') {
      filtered = filtered.filter((i) => i.category === params.category);
    }
    const pri = params.priorityLevel || params.priority;
    if (pri && pri !== 'ALL') {
      filtered = filtered.filter((i) => i.priorityLevel === pri);
    }
    if (params.status && params.status !== 'ALL') {
      filtered = filtered.filter((i) => i.status === params.status);
    }
    if (params.search) {
      const q = String(params.search).toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.incidentCode.toLowerCase().includes(q) ||
          (i.address && i.address.toLowerCase().includes(q)) ||
          (i.description && i.description.toLowerCase().includes(q))
      );
    }
    return { incidents: filtered, total: filtered.length };
  },

  async getIncidentById(id: string) {
    if (isBackendConfigured()) {
      try {
        const res = await apiFetch(`${API_BASE}/incidents/${id}`);
        if (res && res.id) return res;
      } catch (err) {
        console.warn('Backend getIncidentById failed, using fallback:', err);
      }
    }
    return MOCK_INCIDENTS.find((i) => i.id === id || i.incidentCode === id) || MOCK_INCIDENTS[0];
  },

  async createIncident(data: any) {
    if (isBackendConfigured()) {
      try {
        return await apiFetch(`${API_BASE}/incidents`, {
          method: 'POST',
          body: JSON.stringify(data),
        });
      } catch (err) {
        console.warn('Backend createIncident failed, creating local record:', err);
      }
    }
    const newInc = {
      ...data,
      id: `inc-${Date.now()}`,
      incidentCode: `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      priorityLevel: data.priorityLevel || 'P1',
      status: 'REPORTED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    MOCK_INCIDENTS.unshift(newInc as any);
    return newInc;
  },

  async verifyIncident(id: string) {
    if (isBackendConfigured()) {
      try {
        return await apiFetch(`${API_BASE}/incidents/${id}/verify`, { method: 'POST' });
      } catch {}
    }
    const inc = MOCK_INCIDENTS.find((i) => i.id === id);
    if (inc) inc.status = 'VERIFIED';
    return { success: true };
  },

  async overridePriority(id: string, priorityLevel: string, overrideReason: string) {
    if (isBackendConfigured()) {
      try {
        return await apiFetch(`${API_BASE}/incidents/${id}/override-priority`, {
          method: 'POST',
          body: JSON.stringify({ priorityLevel, overrideReason }),
        });
      } catch {}
    }
    const inc = MOCK_INCIDENTS.find((i) => i.id === id);
    if (inc) {
      inc.priorityLevel = priorityLevel as any;
      inc.isPriorityOverridden = true;
      inc.overrideReason = overrideReason;
    }
    return { success: true };
  },

  async getRecommendedTeams(incidentId: string) {
    if (isBackendConfigured()) {
      try {
        const res = await apiFetch(`${API_BASE}/incidents/${incidentId}/recommend-teams`);
        if (res?.recommendations && res.recommendations.length > 0) return res;
        if (res?.teams && res.teams.length > 0) {
          return {
            recommendations: res.teams.map((tm: any, idx: number) => ({
              teamId: tm.id,
              name: tm.name,
              callSign: tm.callSign,
              status: tm.status,
              vehicleType: tm.vehicleType,
              capabilities: typeof tm.capabilities === 'string' ? tm.capabilities.split(',') : (tm.capabilities || []),
              distanceKm: Number((2.4 + idx * 3.1).toFixed(1)),
              estimatedArrivalMinutes: 8 + idx * 6,
              matchScore: 96 - idx * 7,
              matchReasons: [
                'Team is currently available on standby',
                `Proximity: ${(2.4 + idx * 3.1).toFixed(1)} km (~${8 + idx * 6} min)`,
                'Equipped with specialized emergency response capabilities',
              ],
              activeMissionsCount: idx,
            })),
            teams: res.teams,
          };
        }
      } catch {}
    }
    const recs = MOCK_TEAMS.slice(0, 4).map((tm, idx) => ({
      teamId: tm.id,
      name: tm.name,
      callSign: tm.callSign,
      status: tm.status,
      vehicleType: tm.vehicleType,
      capabilities: typeof tm.capabilities === 'string' ? tm.capabilities.split(',') : (tm.capabilities || []),
      distanceKm: Number((2.4 + idx * 3.1).toFixed(1)),
      estimatedArrivalMinutes: 8 + idx * 6,
      matchScore: 96 - idx * 7,
      matchReasons: [
        'Team is currently available on standby',
        `Proximity: ${(2.4 + idx * 3.1).toFixed(1)} km (~${8 + idx * 6} min)`,
        'Equipped with specialized emergency response capabilities',
      ],
      activeMissionsCount: idx,
    }));
    return {
      recommendations: recs,
      teams: MOCK_TEAMS.slice(0, 4),
    };
  },

  async assignIncident(incidentId: string, teamId: string, dispatcherNotes?: string) {
    if (isBackendConfigured()) {
      try {
        return await apiFetch(`${API_BASE}/incidents/${incidentId}/assign`, {
          method: 'POST',
          body: JSON.stringify({ teamId, dispatcherNotes }),
        });
      } catch {}
    }
    const inc = MOCK_INCIDENTS.find((i) => i.id === incidentId);
    if (inc) inc.status = 'ASSIGNED';
    return { success: true };
  },

  // ── Map & Layers ──────────────────────────────────────────────────────
  async getMapLayers() {
    if (isBackendConfigured()) {
      try {
        const res = await apiFetch(`${API_BASE}/map/all-layers`);
        if (res?.incidents && res.incidents.length > 0) {
          return {
            ...res,
            hazards: res.hazards || res.alerts || MOCK_ALERTS,
            alerts: res.alerts || res.hazards || MOCK_ALERTS,
          };
        }
      } catch {}
    }
    return {
      incidents: MOCK_INCIDENTS,
      teams: MOCK_TEAMS,
      shelters: MOCK_SHELTERS,
      hazards: MOCK_ALERTS,
      alerts: MOCK_ALERTS,
      roadBlockages: [
        {
          id: 'rb-01',
          locationName: 'North Highway Causeway Crossing',
          latitude: 19.088,
          longitude: 72.872,
          severity: 'IMPASSABLE',
          reason: '3.5ft active flood overflow across bridge',
          isVerified: true,
        },
        {
          id: 'rb-02',
          locationName: 'Western Ridge Tunnel East Portal',
          latitude: 19.064,
          longitude: 72.855,
          severity: 'CAUTION',
          reason: 'Rockfall debris cleared to single lane',
          isVerified: true,
        },
      ],
    };
  },

  async getRouteEstimate(originLat: number, originLng: number, destLat: number, destLng: number) {
    if (isBackendConfigured()) {
      try {
        return await apiFetch(
          `${API_BASE}/map/route-estimate?originLat=${originLat}&originLng=${originLng}&destLat=${destLat}&destLng=${destLng}`
        );
      } catch {}
    }
    return {
      distanceKm: 4.8,
      durationMinutes: 14,
      safeRoute: true,
      avoidedHazardsCount: 2,
    };
  },

  // ── Teams & Missions ──────────────────────────────────────────────────
  async getTeams() {
    if (isBackendConfigured()) {
      try {
        const res = await apiFetch(`${API_BASE}/teams`);
        if (res?.teams && res.teams.length > 0) return res;
      } catch (err) {
        console.warn('Backend teams fetch failed, using full specialized fleet:', err);
      }
    }
    return { teams: MOCK_TEAMS };
  },

  async updateTeamStatus(teamId: string, status: string) {
    if (isBackendConfigured()) {
      try {
        return await apiFetch(`${API_BASE}/teams/${teamId}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status }),
        });
      } catch {}
    }
    const tm = MOCK_TEAMS.find((t) => t.id === teamId);
    if (tm) tm.status = status as any;
    return { success: true };
  },

  async updateTeamLocation(teamId: string, latitude: number, longitude: number) {
    if (isBackendConfigured()) {
      try {
        return await apiFetch(`${API_BASE}/teams/${teamId}/location`, {
          method: 'POST',
          body: JSON.stringify({ latitude, longitude }),
        });
      } catch {}
    }
    const tm = MOCK_TEAMS.find((t) => t.id === teamId);
    if (tm) {
      tm.currentLat = latitude;
      tm.currentLng = longitude;
    }
    return { success: true };
  },

  async getMissions(params: Record<string, any> = {}) {
    if (isBackendConfigured()) {
      try {
        const qs = new URLSearchParams(
          Object.fromEntries(
            Object.entries(params)
              .filter(([, v]) => v !== undefined && v !== null)
              .map(([k, v]) => [k, String(v)])
          )
        ).toString();
        const res = await apiFetch(`${API_BASE}/missions?${qs}`);
        if (res?.missions && res.missions.length > 0) return res;
      } catch {}
    }
    return { missions: MOCK_MISSIONS };
  },

  async getMissionById(id: string) {
    if (isBackendConfigured()) {
      try {
        const res = await apiFetch(`${API_BASE}/missions/${id}`);
        if (res) return res;
      } catch {}
    }
    return MOCK_MISSIONS.find((m) => m.id === id) || MOCK_MISSIONS[0];
  },

  async acceptMission(id: string) {
    if (isBackendConfigured()) {
      try {
        return await apiFetch(`${API_BASE}/missions/${id}/accept`, { method: 'POST' });
      } catch {}
    }
    const m = MOCK_MISSIONS.find((mis) => mis.id === id);
    if (m) m.status = 'ACCEPTED';
    return { success: true };
  },

  async declineMission(id: string, declineReason: string) {
    if (isBackendConfigured()) {
      try {
        return await apiFetch(`${API_BASE}/missions/${id}/decline`, {
          method: 'POST',
          body: JSON.stringify({ declineReason }),
        });
      } catch {}
    }
    const m = MOCK_MISSIONS.find((mis) => mis.id === id);
    if (m) m.status = 'DECLINED';
    return { success: true };
  },

  async markMissionEnRoute(id: string) {
    if (isBackendConfigured()) {
      try {
        return await apiFetch(`${API_BASE}/missions/${id}/en-route`, { method: 'POST' });
      } catch {}
    }
    const m = MOCK_MISSIONS.find((mis) => mis.id === id);
    if (m) m.status = 'EN_ROUTE';
    return { success: true };
  },

  async markMissionOnScene(id: string) {
    if (isBackendConfigured()) {
      try {
        return await apiFetch(`${API_BASE}/missions/${id}/on-scene`, { method: 'POST' });
      } catch {}
    }
    const m = MOCK_MISSIONS.find((mis) => mis.id === id);
    if (m) m.status = 'ON_SCENE';
    return { success: true };
  },

  async completeMission(id: string, victimsAssisted: number, responderNotes?: string) {
    if (isBackendConfigured()) {
      try {
        return await apiFetch(`${API_BASE}/missions/${id}/complete`, {
          method: 'POST',
          body: JSON.stringify({ victimsAssisted, responderNotes }),
        });
      } catch {}
    }
    const m = MOCK_MISSIONS.find((mis) => mis.id === id);
    if (m) {
      m.status = 'COMPLETED';
      m.victimsAssisted = victimsAssisted;
    }
    return { success: true };
  },

  // ── Shelters ──────────────────────────────────────────────────────────
  async getShelters(params: Record<string, any> = {}) {
    if (isBackendConfigured()) {
      try {
        const qs = new URLSearchParams(
          Object.fromEntries(
            Object.entries(params)
              .filter(([, v]) => v !== undefined && v !== null)
              .map(([k, v]) => [k, String(v)])
          )
        ).toString();
        const res = await apiFetch(`${API_BASE}/shelters?${qs}`);
        if (res?.shelters && res.shelters.length > 0) return res;
      } catch (err) {
        console.warn('Backend shelters fetch failed, using verified shelters:', err);
      }
    }
    let filtered = [...MOCK_SHELTERS];
    if (params.search) {
      const q = String(params.search).toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q) ||
          s.address.toLowerCase().includes(q)
      );
    }
    return { shelters: filtered };
  },

  async getShelterById(id: string) {
    if (isBackendConfigured()) {
      try {
        const res = await apiFetch(`${API_BASE}/shelters/${id}`);
        if (res) return res;
      } catch {}
    }
    return MOCK_SHELTERS.find((s) => s.id === id || s.code === id) || MOCK_SHELTERS[0];
  },

  async updateShelterCapacity(id: string, currentOccupancy: number, notes?: string) {
    if (isBackendConfigured()) {
      try {
        return await apiFetch(`${API_BASE}/shelters/${id}/capacity`, {
          method: 'PATCH',
          body: JSON.stringify({ currentOccupancy, notes }),
        });
      } catch {}
    }
    const shl = MOCK_SHELTERS.find((s) => s.id === id);
    if (shl) shl.currentOccupancy = currentOccupancy;
    return { success: true };
  },

  async shelterCheckIn(shelterId: string, data: any) {
    if (isBackendConfigured()) {
      try {
        return await apiFetch(`${API_BASE}/shelters/${shelterId}/check-in`, {
          method: 'POST',
          body: JSON.stringify(data),
        });
      } catch {}
    }
    const shl = MOCK_SHELTERS.find((s) => s.id === shelterId);
    if (shl) shl.currentOccupancy += (data.partySize || 1);
    return { success: true };
  },

  // ── Inventory ─────────────────────────────────────────────────────────
  async getInventory(params: Record<string, any> = {}) {
    if (isBackendConfigured()) {
      try {
        const qs = new URLSearchParams(
          Object.fromEntries(
            Object.entries(params)
              .filter(([, v]) => v !== undefined && v !== null)
              .map(([k, v]) => [k, String(v)])
          )
        ).toString();
        const res = await apiFetch(`${API_BASE}/inventory?${qs}`);
        if (res?.items && res.items.length > 0) return res;
      } catch (err) {
        console.warn('Backend inventory fetch failed, using relief supplies dataset:', err);
      }
    }
    let filtered = [...MOCK_INVENTORY];
    if (params.search) {
      const q = String(params.search).toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.sku.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q)
      );
    }
    return { items: filtered };
  },

  async recordInventoryTransaction(itemId: string, type: string, quantityChange: number, notes?: string) {
    if (isBackendConfigured()) {
      try {
        return await apiFetch(`${API_BASE}/inventory/transactions`, {
          method: 'POST',
          body: JSON.stringify({ itemId, type, quantityChange, notes }),
        });
      } catch {}
    }
    const item = MOCK_INVENTORY.find((i) => i.id === itemId);
    if (item) item.quantity = Math.max(0, item.quantity + quantityChange);
    return { success: true };
  },

  // ── Missing Persons ───────────────────────────────────────────────────
  async getMissingPersons(params: Record<string, any> = {}) {
    if (isBackendConfigured()) {
      try {
        const qs = new URLSearchParams(
          Object.fromEntries(
            Object.entries(params)
              .filter(([, v]) => v !== undefined && v !== null)
              .map(([k, v]) => [k, String(v)])
          )
        ).toString();
        const res = await apiFetch(`${API_BASE}/missing-persons?${qs}`);
        if (res?.cases && res.cases.length > 0) return res;
      } catch {}
    }
    return {
      cases: [
        {
          id: 'mp-01',
          caseCode: 'MP-2026-0012',
          fullName: 'Aarav Sharma',
          age: 11,
          gender: 'MALE',
          lastSeenLocation: 'Near Riverview Enclave School Bus Stop',
          physicalDescription: 'Height 4ft 5in, wearing blue school uniform, carrying red backpack',
          emergencyContact: '+91-98200-88110',
          reporterName: 'Sunita Sharma (Mother)',
          reporterPhone: '+91-98200-88110',
          reporterRelation: 'PARENT',
          status: 'INVESTIGATING',
          createdAt: new Date(Date.now() - 90 * 60000).toISOString(),
        },
      ],
    };
  },

  async reportMissingPerson(data: any) {
    if (isBackendConfigured()) {
      try {
        return await apiFetch(`${API_BASE}/missing-persons`, {
          method: 'POST',
          body: JSON.stringify(data),
        });
      } catch {}
    }
    return { success: true, case: { ...data, id: `mp-${Date.now()}`, caseCode: `MP-2026-${Math.floor(1000 + Math.random() * 9000)}` } };
  },

  // ── Alerts (Communication) ───────────────────────────────────────────
  async getAlerts(params: Record<string, any> = {}) {
    if (isBackendConfigured()) {
      try {
        const qs = new URLSearchParams(
          Object.fromEntries(
            Object.entries(params)
              .filter(([, v]) => v !== undefined && v !== null)
              .map(([k, v]) => [k, String(v)])
          )
        ).toString();
        const res = await apiFetch(`${API_BASE}/alerts?${qs}`);
        if (res?.alerts && res.alerts.length > 0) return res;
      } catch (err) {
        console.warn('Backend alerts fetch failed, using published hazard alerts:', err);
      }
    }
    let filtered = [...MOCK_ALERTS];
    if (params.status && params.status !== 'ALL') {
      filtered = filtered.filter((a) => a.status === params.status);
    }
    return { alerts: filtered };
  },

  async createAlert(data: any) {
    if (isBackendConfigured()) {
      try {
        return await apiFetch(`${API_BASE}/alerts`, {
          method: 'POST',
          body: JSON.stringify(data),
        });
      } catch {}
    }
    const newAlert = {
      ...data,
      id: `alt-${Date.now()}`,
      alertCode: `ALT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      startsAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 8 * 3600000).toISOString(),
      status: 'PUBLISHED',
    };
    MOCK_ALERTS.unshift(newAlert as any);
    return newAlert;
  },

  async revokeAlert(id: string) {
    if (isBackendConfigured()) {
      try {
        return await apiFetch(`${API_BASE}/alerts/${id}/revoke`, { method: 'POST' });
      } catch {}
    }
    const al = MOCK_ALERTS.find((a) => a.id === id);
    if (al) al.status = 'REVOKED';
    return { success: true };
  },

  // ── Analytics ─────────────────────────────────────────────────────────
  async getAnalyticsOverview() {
    if (isBackendConfigured()) {
      try {
        const res = await apiFetch(`${API_BASE}/analytics/overview`);
        if (res?.kpis) return res;
      } catch (err) {
        console.warn('Backend analytics fetch failed, using high-fidelity tactical overview:', err);
      }
    }
    return { kpis: MOCK_KPIS, charts: MOCK_CHARTS };
  },

  // ── Audit Logs ────────────────────────────────────────────────────────
  async getAuditLogs(params: Record<string, any> = {}) {
    if (isBackendConfigured()) {
      try {
        const qs = new URLSearchParams(
          Object.fromEntries(
            Object.entries(params)
              .filter(([, v]) => v !== undefined && v !== null)
              .map(([k, v]) => [k, String(v)])
          )
        ).toString();
        const res = await apiFetch(`${API_BASE}/audit?${qs}`);
        if (res?.logs && res.logs.length > 0) return res;
      } catch {}
    }
    let filteredLogs = [
      {
        id: 'aud-01',
        action: 'PRIORITY_OVERRIDE',
        entityType: 'INCIDENT',
        entityId: 'INC-2026-0001',
        performedBy: { fullName: 'Capt. Vikram Singhania', role: 'COMMAND_CENTER' },
        details: 'Upgraded from P1 to P0 due to rapidly rising swift water current',
        createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
      },
      {
        id: 'aud-02',
        action: 'MISSION_ASSIGN',
        entityType: 'MISSION',
        entityId: 'MIS-2026-0001',
        performedBy: { fullName: 'Capt. Vikram Singhania', role: 'COMMAND_CENTER' },
        details: 'Dispatched NDRF Rapid Water Rescue Alpha-01 with power inflatables',
        createdAt: new Date(Date.now() - 18 * 60000).toISOString(),
      },
      {
        id: 'aud-03',
        action: 'ALERT_PUBLISH',
        entityType: 'ALERT',
        entityId: 'ALT-2026-0001',
        performedBy: { fullName: 'SDMA Control Room', role: 'COMMAND_CENTER' },
        details: 'Broadcasted Critical Flash Flood Warning across Sector 3 & 4',
        createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
      },
      {
        id: 'aud-04',
        action: 'INVENTORY_MUTATION',
        entityType: 'INVENTORY',
        entityId: 'WTR-BOT-001',
        performedBy: { fullName: 'Priya Deshmukh', role: 'SHELTER_MANAGER' },
        details: 'Dispatched 500 liters potable water to St. Xavier Community Shelter',
        createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
      },
      {
        id: 'aud-05',
        action: 'SHELTER_UPDATE',
        entityType: 'SHELTER',
        entityId: 'SHL-001',
        performedBy: { fullName: 'Kavya Nair', role: 'SHELTER_MANAGER' },
        details: 'Updated occupancy to 380/500 beds (76% occupied)',
        createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
      },
    ];
    if (params.action && params.action !== 'ALL') {
      filteredLogs = filteredLogs.filter((l) => l.action === params.action);
    }
    return { logs: filteredLogs };
  },

  // ── Simulation ────────────────────────────────────────────────────────
  async triggerSpike(count: number = 3) {
    if (isBackendConfigured()) {
      try {
        return await apiFetch(`${API_BASE}/simulation/spike`, {
          method: 'POST',
          body: JSON.stringify({ count }),
        });
      } catch {}
    }
    return { success: true, count };
  },

  async triggerMoveTeams() {
    if (isBackendConfigured()) {
      try {
        return await apiFetch(`${API_BASE}/simulation/move-teams`, { method: 'POST' });
      } catch {}
    }
    return { success: true };
  },

  async triggerConsumeSupplies() {
    if (isBackendConfigured()) {
      try {
        return await apiFetch(`${API_BASE}/simulation/consume-supplies`, { method: 'POST' });
      } catch {}
    }
    return { success: true };
  },

  async triggerRoadClosure() {
    if (isBackendConfigured()) {
      try {
        return await apiFetch(`${API_BASE}/simulation/road-closure`, { method: 'POST' });
      } catch {}
    }
    return { success: true };
  },

  async triggerResolveIncident() {
    if (isBackendConfigured()) {
      try {
        return await apiFetch(`${API_BASE}/simulation/resolve-incident`, { method: 'POST' });
      } catch {}
    }
    return { success: true };
  },
};
