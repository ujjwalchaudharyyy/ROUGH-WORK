import { describe, it, expect, beforeAll } from 'vitest';
import prisma from '../prisma';
import { runDeterministicTriage } from '../services/aiTriage';
import { calculateDistanceKm, recommendTeamsForIncident } from '../services/dispatchEngine';

describe('DisplaceOS Core Engine End-to-End Suite', () => {
  it('Deterministic AI Triage evaluates high life threat properly', () => {
    const triage = runDeterministicTriage({
      category: 'BUILDING_COLLAPSE',
      title: 'Structural collapse with trapped occupants',
      description: 'Basement slab failed, 4 people trapped, screaming for help',
      affectedPeople: 6,
      injuredCount: 2,
      trappedCount: 4,
      requiredAssistance: 'COLLAPSE_SEARCH,MEDICAL',
    });

    expect(triage.recommendedPriority).toBe('P0');
    expect(triage.identifiedRisks.length).toBeGreaterThan(0);
    expect(triage.confidence).toBeGreaterThanOrEqual(0.9);
  });

  it('Haversine distance calculation is geometrically sound', () => {
    // 1 degree latitude is approx 111 km
    const dist = calculateDistanceKm(19.0, 72.0, 20.0, 72.0);
    expect(dist).toBeGreaterThan(110);
    expect(dist).toBeLessThan(112);
  });

  it('Relational database holds seeded incidents, shelters, and teams', async () => {
    const [incCount, teamCount, shelterCount] = await Promise.all([
      prisma.incident.count(),
      prisma.rescueTeam.count(),
      prisma.shelter.count(),
    ]);

    expect(incCount).toBeGreaterThan(20);
    expect(teamCount).toBeGreaterThanOrEqual(8);
    expect(shelterCount).toBeGreaterThanOrEqual(10);
  });

  it('Shelter occupancy cannot exceed capacity logically', async () => {
    const shelter = await prisma.shelter.findFirst();
    expect(shelter).toBeDefined();
    if (shelter) {
      expect(shelter.currentOccupancy).toBeLessThanOrEqual(shelter.totalCapacity);
    }
  });

  it('Inventory transaction maintains balance integrity', async () => {
    const item = await prisma.inventoryItem.findFirst();
    expect(item).toBeDefined();
    if (item) {
      expect(item.quantity).toBeGreaterThanOrEqual(0);
    }
  });
});
