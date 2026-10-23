const API_BASE = '/api';

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('displaceos_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Auth
  async login(credentials: { email: string; password?: string }) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  async demoLogin(role: string) {
    const res = await fetch(`${API_BASE}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Demo login failed');
    }
    return res.json();
  },

  async register(data: any) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Registration failed');
    }
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Session expired');
    return res.json();
  },

  // Incidents
  async getIncidents(params: Record<string, any> = {}) {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) cleanParams[k] = String(v);
    }
    const qs = new URLSearchParams(cleanParams).toString();
    const res = await fetch(`${API_BASE}/incidents?${qs}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch incidents');
    return res.json();
  },

  async getIncidentById(id: string) {
    const res = await fetch(`${API_BASE}/incidents/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch incident');
    return res.json();
  },

  async createIncident(data: any) {
    const res = await fetch(`${API_BASE}/incidents`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit report');
    }
    return res.json();
  },

  async verifyIncident(id: string) {
    const res = await fetch(`${API_BASE}/incidents/${id}/verify`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to verify incident');
    return res.json();
  },

  async overridePriority(id: string, priorityLevel: string, overrideReason: string) {
    const res = await fetch(`${API_BASE}/incidents/${id}/override-priority`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ priorityLevel, overrideReason }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to override priority');
    }
    return res.json();
  },

  async getRecommendedTeams(incidentId: string) {
    const res = await fetch(`${API_BASE}/incidents/${incidentId}/recommend-teams`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch team recommendations');
    return res.json();
  },

  async assignIncident(incidentId: string, teamId: string, dispatcherNotes?: string) {
    const res = await fetch(`${API_BASE}/incidents/${incidentId}/assign`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ teamId, dispatcherNotes }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to assign team');
    }
    return res.json();
  },

  // Map & Layers
  async getMapLayers() {
    const res = await fetch(`${API_BASE}/map/all-layers`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch map layers');
    return res.json();
  },

  async getRouteEstimate(originLat: number, originLng: number, destLat: number, destLng: number) {
    const res = await fetch(`${API_BASE}/map/route-estimate?originLat=${originLat}&originLng=${originLng}&destLat=${destLat}&destLng=${destLng}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to estimate route');
    return res.json();
  },

  // Teams & Missions
  async getTeams() {
    const res = await fetch(`${API_BASE}/teams`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch rescue teams');
    return res.json();
  },

  async updateTeamStatus(teamId: string, status: string) {
    const res = await fetch(`${API_BASE}/teams/${teamId}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update team status');
    return res.json();
  },

  async updateTeamLocation(teamId: string, latitude: number, longitude: number) {
    const res = await fetch(`${API_BASE}/teams/${teamId}/location`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ latitude, longitude }),
    });
    if (!res.ok) throw new Error('Failed to update location');
    return res.json();
  },

  async getMissions(params: Record<string, any> = {}) {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) cleanParams[k] = String(v);
    }
    const qs = new URLSearchParams(cleanParams).toString();
    const res = await fetch(`${API_BASE}/missions?${qs}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch missions');
    return res.json();
  },

  async getMissionById(id: string) {
    const res = await fetch(`${API_BASE}/missions/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch mission');
    return res.json();
  },

  async acceptMission(id: string) {
    const res = await fetch(`${API_BASE}/missions/${id}/accept`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to accept mission');
    return res.json();
  },

  async declineMission(id: string, declineReason: string) {
    const res = await fetch(`${API_BASE}/missions/${id}/decline`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ declineReason }),
    });
    if (!res.ok) throw new Error('Failed to decline mission');
    return res.json();
  },

  async markMissionEnRoute(id: string) {
    const res = await fetch(`${API_BASE}/missions/${id}/en-route`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to set en route');
    return res.json();
  },

  async markMissionOnScene(id: string) {
    const res = await fetch(`${API_BASE}/missions/${id}/on-scene`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to set on scene');
    return res.json();
  },

  async completeMission(id: string, victimsAssisted: number, responderNotes?: string) {
    const res = await fetch(`${API_BASE}/missions/${id}/complete`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ victimsAssisted, responderNotes }),
    });
    if (!res.ok) throw new Error('Failed to complete mission');
    return res.json();
  },

  // Shelters
  async getShelters(params: Record<string, any> = {}) {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) cleanParams[k] = String(v);
    }
    const qs = new URLSearchParams(cleanParams).toString();
    const res = await fetch(`${API_BASE}/shelters?${qs}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch shelters');
    return res.json();
  },

  async getShelterById(id: string) {
    const res = await fetch(`${API_BASE}/shelters/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch shelter');
    return res.json();
  },

  async updateShelterCapacity(id: string, currentOccupancy: number, notes?: string) {
    const res = await fetch(`${API_BASE}/shelters/${id}/capacity`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentOccupancy, notes }),
    });
    if (!res.ok) throw new Error('Failed to update shelter capacity');
    return res.json();
  },

  async shelterCheckIn(shelterId: string, data: any) {
    const res = await fetch(`${API_BASE}/shelters/${shelterId}/check-in`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to check in party');
    return res.json();
  },

  // Inventory
  async getInventory(params: Record<string, any> = {}) {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) cleanParams[k] = String(v);
    }
    const qs = new URLSearchParams(cleanParams).toString();
    const res = await fetch(`${API_BASE}/inventory?${qs}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch inventory');
    return res.json();
  },

  async recordInventoryTransaction(itemId: string, type: string, quantityChange: number, notes?: string) {
    const res = await fetch(`${API_BASE}/inventory/transactions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ itemId, type, quantityChange, notes }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to record inventory change');
    }
    return res.json();
  },

  // Missing Persons
  async getMissingPersons(params: Record<string, any> = {}) {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) cleanParams[k] = String(v);
    }
    const qs = new URLSearchParams(cleanParams).toString();
    const res = await fetch(`${API_BASE}/missing-persons?${qs}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch missing persons');
    return res.json();
  },

  async reportMissingPerson(data: any) {
    const res = await fetch(`${API_BASE}/missing-persons`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to report missing person');
    return res.json();
  },

  // Alerts
  async getAlerts(params: Record<string, any> = {}) {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) cleanParams[k] = String(v);
    }
    const qs = new URLSearchParams(cleanParams).toString();
    const res = await fetch(`${API_BASE}/alerts?${qs}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch alerts');
    return res.json();
  },

  async createAlert(data: any) {
    const res = await fetch(`${API_BASE}/alerts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to publish alert');
    return res.json();
  },

  async revokeAlert(id: string) {
    const res = await fetch(`${API_BASE}/alerts/${id}/revoke`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to revoke alert');
    return res.json();
  },

  // Analytics
  async getAnalyticsOverview() {
    const res = await fetch(`${API_BASE}/analytics/overview`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  },

  // Audit Logs
  async getAuditLogs(params: Record<string, any> = {}) {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) cleanParams[k] = String(v);
    }
    const qs = new URLSearchParams(cleanParams).toString();
    const res = await fetch(`${API_BASE}/audit?${qs}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch audit logs');
    return res.json();
  },

  // Simulation Controller triggers
  async triggerSpike(count: number = 3) {
    const res = await fetch(`${API_BASE}/simulation/spike`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ count }),
    });
    return res.json();
  },

  async triggerMoveTeams() {
    const res = await fetch(`${API_BASE}/simulation/move-teams`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async triggerConsumeSupplies() {
    const res = await fetch(`${API_BASE}/simulation/consume-supplies`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async triggerRoadClosure() {
    const res = await fetch(`${API_BASE}/simulation/road-closure`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async triggerResolveIncident() {
    const res = await fetch(`${API_BASE}/simulation/resolve-incident`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return res.json();
  },
};
