import prisma from '../prisma';
import { broadcastEvent } from './notificationService';
import { runDeterministicTriage } from './aiTriage';

export const triggerIncidentSpike = async (count: number = 3) => {
  const categories = ['FLOOD', 'LANDSLIDE', 'BUILDING_COLLAPSE', 'MEDICAL_EMERGENCY', 'FOOD_WATER_SHORTAGE'];
  const titles = [
    'Rising flood waters surrounding residential cluster',
    'Severe hill slope displacement blocking valley road',
    'Old masonry building partial collapse with trapped occupants',
    'Elderly patient requiring emergency oxygen supply in flooded block',
    'Stranded rooftop group signaling with flashlights'
  ];

  const baseLat = 19.0760; // Sector Alpha (Metro Coastal Valley)
  const baseLng = 72.8777;

  const createdIncidents = [];

  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * categories.length);
    const category = categories[idx];
    const latOffset = (Math.random() - 0.5) * 0.08;
    const lngOffset = (Math.random() - 0.5) * 0.08;
    const affectedPeople = Math.floor(Math.random() * 8) + 2;
    const trappedCount = Math.random() > 0.5 ? Math.floor(Math.random() * 3) + 1 : 0;
    const injuredCount = Math.random() > 0.4 ? Math.floor(Math.random() * 2) + 1 : 0;

    const triage = runDeterministicTriage({
      category,
      title: titles[idx],
      description: `Simulated live emergency event reported via emergency monitoring network. Water depth or debris obstructing evacuation. ${affectedPeople} people at scene.`,
      affectedPeople,
      injuredCount,
      trappedCount,
      requiredAssistance: 'RESCUE,MEDICAL,EVACUATION',
      latitude: baseLat + latOffset,
      longitude: baseLng + lngOffset,
    });

    const code = `INC-SIM-${Date.now().toString().slice(-4)}-${i + 1}`;

    const incident = await prisma.incident.create({
      data: {
        incidentCode: code,
        category,
        title: `[SIMULATED] ${titles[idx]}`,
        description: `Automated emergency simulation event generated to test command center triage and surge capability.`,
        latitude: baseLat + latOffset,
        longitude: baseLng + lngOffset,
        address: `Sector 4-B North, Block ${i + 1}, Metro Valley`,
        affectedPeople,
        injuredCount,
        trappedCount,
        requiredAssistance: 'RESCUE,EVACUATION',
        priorityLevel: triage.recommendedPriority,
        priorityExplanation: triage.explanation,
        aiAssessed: true,
        aiConfidence: triage.confidence,
        identifiedRisks: triage.identifiedRisks.join('; '),
        suggestedActions: triage.suggestedActions.join('; '),
        status: 'REPORTED',
        isSimulated: true,
      },
    });

    createdIncidents.push(incident);
  }

  broadcastEvent('SIMULATION_INCIDENT_SPIKE', { incidents: createdIncidents });
  return createdIncidents;
};

export const advanceSimulatedTeams = async () => {
  const teams = await prisma.rescueTeam.findMany({
    where: { isSimulated: true },
  });

  const updatedTeams = [];

  for (const team of teams) {
    // Nudge latitude/longitude slightly towards or around incident area
    const dLat = (Math.random() - 0.5) * 0.005;
    const dLng = (Math.random() - 0.5) * 0.005;

    const updated = await prisma.rescueTeam.update({
      where: { id: team.id },
      data: {
        currentLat: team.currentLat + dLat,
        currentLng: team.currentLng + dLng,
        lastLocationUpdate: new Date(),
      },
    });

    updatedTeams.push(updated);
  }

  broadcastEvent('SIMULATION_TEAMS_MOVED', { teams: updatedTeams });
  return updatedTeams;
};

export const consumeSuppliesSimulation = async () => {
  const items = await prisma.inventoryItem.findMany({
    take: 5,
  });

  const updatedItems = [];

  for (const item of items) {
    const consumption = Math.floor(Math.random() * 15) + 5;
    const newQty = Math.max(0, item.quantity - consumption);

    const updated = await prisma.$transaction(async (tx) => {
      const up = await tx.inventoryItem.update({
        where: { id: item.id },
        data: {
          quantity: newQty,
          lastUpdated: new Date(),
        },
      });

      await tx.inventoryTransaction.create({
        data: {
          itemId: item.id,
          type: 'CONSUMPTION',
          quantityChange: -consumption,
          remainingBalance: newQty,
          notes: 'Simulated field shelter distribution run',
        },
      });

      return up;
    });

    updatedItems.push(updated);
  }

  broadcastEvent('SIMULATION_SUPPLIES_CONSUMED', { items: updatedItems });
  return updatedItems;
};

export const triggerSimulatedRoadClosure = async () => {
  const reasons = ['FLASH_FLOOD_OVERWASH', 'MUD_SLUMP_BLOCKAGE', 'POWER_POLE_DOWN'];
  const reason = reasons[Math.floor(Math.random() * reasons.length)];

  const blockage = await prisma.roadBlockageReport.create({
    data: {
      locationName: `Highway Access Link ${Math.floor(Math.random() * 50) + 10}`,
      latitude: 19.0760 + (Math.random() - 0.5) * 0.06,
      longitude: 72.8777 + (Math.random() - 0.5) * 0.06,
      severity: 'IMPASSABLE',
      reason,
      isVerified: true,
      notes: 'Generated via Emergency Response Scenario Simulator.',
      isSimulated: true,
    },
  });

  broadcastEvent('SIMULATION_ROAD_CLOSURE', { blockage });
  return blockage;
};

export const resolveRandomActiveIncident = async () => {
  const activeIncident = await prisma.incident.findFirst({
    where: {
      status: { in: ['ASSIGNED', 'EN_ROUTE', 'ON_SCENE', 'VERIFIED'] },
      isSimulated: true,
    },
  });

  if (!activeIncident) return null;

  const resolved = await prisma.incident.update({
    where: { id: activeIncident.id },
    data: {
      status: 'RESOLVED',
      resolvedAt: new Date(),
    },
  });

  // Also complete any attached active mission
  await prisma.mission.updateMany({
    where: { incidentId: activeIncident.id, status: { not: 'COMPLETED' } },
    data: {
      status: 'COMPLETED',
      completedAt: new Date(),
      victimsAssisted: activeIncident.affectedPeople,
      responderNotes: 'Field rescue operation concluded successfully. All victims evacuated safely to shelter.',
    },
  });

  broadcastEvent('SIMULATION_INCIDENT_RESOLVED', { incident: resolved });
  return resolved;
};
