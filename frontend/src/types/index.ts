export type UserRole = 'CITIZEN' | 'RESCUE_TEAM' | 'SHELTER_MANAGER' | 'MEDICAL_RESPONDER' | 'COMMAND_CENTER';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  organization?: string;
  preferredLanguage: string;
}

export type PriorityLevel = 'P0' | 'P1' | 'P2' | 'P3';

export type IncidentCategory =
  | 'FLOOD'
  | 'EARTHQUAKE'
  | 'LANDSLIDE'
  | 'FIRE'
  | 'BUILDING_COLLAPSE'
  | 'MEDICAL_EMERGENCY'
  | 'MISSING_PERSON'
  | 'ROAD_BLOCKAGE'
  | 'FOOD_WATER_SHORTAGE'
  | 'EVACUATION_REQUEST'
  | 'OTHER';

export type IncidentStatus =
  | 'REPORTED'
  | 'VERIFIED'
  | 'PRIORITIZED'
  | 'ASSIGNED'
  | 'ACCEPTED'
  | 'EN_ROUTE'
  | 'ON_SCENE'
  | 'RESOLVED'
  | 'CANCELLED';

export interface Incident {
  id: string;
  incidentCode: string;
  category: IncidentCategory;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  affectedPeople: number;
  injuredCount: number;
  trappedCount: number;
  requiredAssistance: string;
  accessibilityNeeds?: string | null;
  priorityLevel: PriorityLevel;
  priorityExplanation?: string;
  aiAssessed: boolean;
  aiConfidence?: number;
  identifiedRisks?: string;
  suggestedActions?: string;
  isPriorityOverridden?: boolean;
  overrideReason?: string;
  status: IncidentStatus;
  reporterId?: string;
  reporterName?: string;
  reporterContact?: string;
  verifiedById?: string;
  verifiedAt?: string;
  resolvedAt?: string;
  isSimulated?: boolean;
  createdAt: string;
  updatedAt: string;
  missions?: Mission[];
  statusHistory?: IncidentStatusHistory[];
}

export interface IncidentStatusHistory {
  id: string;
  incidentId: string;
  previousStatus: string | null;
  newStatus: string;
  changedById?: string;
  notes?: string;
  createdAt: string;
}

export interface RescueTeam {
  id: string;
  name: string;
  callSign: string;
  status: 'AVAILABLE' | 'DISPATCHED' | 'ON_SCENE' | 'RESTING' | 'UNAVAILABLE';
  currentLat: number;
  currentLng: number;
  lastLocationUpdate: string;
  capabilities: string;
  vehicleType: string;
  vehiclePlate: string;
  contactPhone: string;
  memberCount: number;
  isSimulated?: boolean;
  missions?: Mission[];
}

export interface Mission {
  id: string;
  incidentId: string;
  teamId: string;
  status: 'ASSIGNED' | 'ACCEPTED' | 'DECLINED' | 'EN_ROUTE' | 'ON_SCENE' | 'COMPLETED' | 'CANCELLED';
  assignedAt: string;
  acceptedAt?: string;
  arrivedAt?: string;
  completedAt?: string;
  declineReason?: string;
  dispatcherNotes?: string;
  responderNotes?: string;
  routeDistanceKm?: number;
  estimatedDurationMin?: number;
  victimsAssisted: number;
  incident?: Incident;
  team?: RescueTeam;
  updates?: MissionUpdate[];
}

export interface MissionUpdate {
  id: string;
  missionId: string;
  status: string;
  updateText: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
}

export interface Shelter {
  id: string;
  code: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  shelterType: string;
  totalCapacity: number;
  currentOccupancy: number;
  status: 'OPEN' | 'LIMITED_CAPACITY' | 'FULL' | 'TEMPORARILY_CLOSED' | 'NEEDS_SUPPLIES';
  hasDrinkingWater: boolean;
  hasFood: boolean;
  hasMedicalSupport: boolean;
  hasSanitation: boolean;
  hasPower: boolean;
  contactPhone: string;
  lastVerifiedAt: string;
  isSimulated?: boolean;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: 'FOOD' | 'WATER' | 'MEDICAL' | 'HYGIENE' | 'SHELTER_EQUIPMENT' | 'FUEL' | 'BABY_CARE';
  quantity: number;
  unit: string;
  minStockLevel: number;
  storageLocation: string;
  expiryDate?: string;
  lastUpdated: string;
}

export interface MissingPersonCase {
  id: string;
  caseCode: string;
  fullName: string;
  age?: number;
  gender?: string;
  lastSeenLocation: string;
  lastSeenLat?: number;
  lastSeenLng?: number;
  physicalDescription?: string;
  clothingDescription?: string;
  photoUrl?: string;
  emergencyContact: string;
  reporterName: string;
  reporterPhone: string;
  reporterRelation: string;
  status: 'REPORTED' | 'INVESTIGATING' | 'POTENTIAL_MATCH' | 'LOCATED' | 'CLOSED';
  createdAt: string;
  updates?: { id: string; updateText: string; reportedBy?: string; createdAt: string }[];
}

export interface HazardAlert {
  id: string;
  alertCode: string;
  title: string;
  category: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  affectedArea: string;
  latitude: number;
  longitude: number;
  radiusKm: number;
  startsAt: string;
  expiresAt: string;
  issuingAuthority: string;
  verificationStatus: string;
  instructions: string;
  status: 'DRAFT' | 'APPROVED' | 'PUBLISHED' | 'REVOKED';
}

export interface RoadBlockage {
  id: string;
  locationName: string;
  latitude: number;
  longitude: number;
  severity: 'IMPASSABLE' | 'PASSABLE_4X4_ONLY' | 'PARTIALLY_BLOCKED';
  reason: string;
  isVerified: boolean;
  notes?: string;
}

export interface OverviewKPIs {
  totalIncidents: number;
  activeIncidents: number;
  p0Count: number;
  p1Count: number;
  p2Count: number;
  p3Count: number;
  peopleAwaitingHelp: number;
  trappedTotal: number;
  injuredTotal: number;
  teamsAvailable: number;
  teamsDeployed: number;
  teamsResting: number;
  totalTeams: number;
  totalShelterCapacity: number;
  currentShelterOccupancy: number;
  openShelterCapacity: number;
  shelterOccupancyRate: number;
  foodPacketsTotal: number;
  waterLitersTotal: number;
  lowStockCount: number;
  resolvedToday: number;
  awaitingVerification: number;
  activeAlerts: number;
  avgResponseTimeMinutes: number;
}
