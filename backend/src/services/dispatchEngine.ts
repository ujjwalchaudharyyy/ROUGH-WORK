import prisma from '../prisma';

export interface DispatchRecommendation {
  teamId: string;
  name: string;
  callSign: string;
  status: string;
  vehicleType: string;
  capabilities: string[];
  distanceKm: number;
  estimatedArrivalMinutes: number;
  matchScore: number; // 0 - 100
  matchReasons: string[];
  activeMissionsCount: number;
}

// Calculate Haversine distance in KM
export const calculateDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
};

export const recommendTeamsForIncident = async (incidentId: string): Promise<DispatchRecommendation[]> => {
  const incident = await prisma.incident.findUnique({
    where: { id: incidentId },
  });

  if (!incident) {
    throw new Error('Incident not found');
  }

  const teams = await prisma.rescueTeam.findMany({
    include: {
      missions: {
        where: {
          status: { in: ['ASSIGNED', 'ACCEPTED', 'EN_ROUTE', 'ON_SCENE'] },
        },
      },
    },
  });

  const recommendations: DispatchRecommendation[] = [];

  for (const team of teams) {
    const caps = team.capabilities.split(',').map((c) => c.trim().toUpperCase());
    const matchReasons: string[] = [];
    let score = 50;

    // Status weighting
    if (team.status === 'AVAILABLE') {
      score += 30;
      matchReasons.push('Team is currently available on standby');
    } else if (team.status === 'ON_SCENE') {
      score += 5;
      matchReasons.push('Team currently on-scene, could be tasked next');
    } else if (team.status === 'UNAVAILABLE' || team.status === 'RESTING') {
      score -= 40;
      matchReasons.push(`Team currently ${team.status.toLowerCase()}`);
    }

    // Distance calculation
    const distanceKm = calculateDistanceKm(team.currentLat, team.currentLng, incident.latitude, incident.longitude);
    // Estimated arrival: assume 35 km/h emergency speed in disaster terrain
    const travelTimeMinutes = Math.max(3, Math.round((distanceKm / 35) * 60));

    if (distanceKm < 5) {
      score += 25;
      matchReasons.push(`Very close proximity: ${distanceKm} km (~${travelTimeMinutes} min)`);
    } else if (distanceKm < 15) {
      score += 15;
      matchReasons.push(`Accessible distance: ${distanceKm} km (~${travelTimeMinutes} min)`);
    } else {
      score -= 10;
      matchReasons.push(`Moderate transit distance: ${distanceKm} km`);
    }

    // Capability matching
    const cat = incident.category;
    if (cat === 'FLOOD' && caps.includes('WATER_RESCUE')) {
      score += 25;
      matchReasons.push('Equipped with specialized flood & water rescue capabilities');
    }
    if ((cat === 'BUILDING_COLLAPSE' || cat === 'LANDSLIDE') && caps.includes('COLLAPSE_SEARCH')) {
      score += 25;
      matchReasons.push('Certified for structural collapse search and heavy extrication');
    }
    if ((cat === 'MEDICAL_EMERGENCY' || incident.injuredCount > 0) && (caps.includes('FIRST_AID') || caps.includes('MEDICAL_TRANSPORT'))) {
      score += 25;
      matchReasons.push('Advanced life support and emergency medical transport ready');
    }

    // Active workload penalty
    const activeCount = team.missions.length;
    if (activeCount > 0) {
      score -= activeCount * 15;
      matchReasons.push(`Has ${activeCount} active mission(s) assigned`);
    }

    // Clamping
    const finalScore = Math.max(5, Math.min(99, score));

    recommendations.push({
      teamId: team.id,
      name: team.name,
      callSign: team.callSign,
      status: team.status,
      vehicleType: team.vehicleType,
      capabilities: caps,
      distanceKm,
      estimatedArrivalMinutes: travelTimeMinutes,
      matchScore: finalScore,
      matchReasons,
      activeMissionsCount: activeCount,
    });
  }

  // Sort by highest match score first
  return recommendations.sort((a, b) => b.matchScore - a.matchScore);
};
