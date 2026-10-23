import { describe, it, expect } from 'vitest';
import { runDeterministicTriage } from '../services/aiTriage';
import { calculateDistanceKm } from '../services/dispatchEngine';

describe('AI Emergency Triage Engine', () => {
  it('should assign P0 priority for entrapment or severe life peril', () => {
    const result = runDeterministicTriage({
      category: 'FLOOD',
      title: 'Water rising fast, family trapped on roof',
      description: 'Water has reached roof level, 3 people trapped including 1 infant.',
      affectedPeople: 4,
      injuredCount: 0,
      trappedCount: 3,
      requiredAssistance: 'WATER_RESCUE',
    });

    expect(result.recommendedPriority).toBe('P0');
    expect(result.identifiedRisks.some(r => r.includes('Active entrapment'))).toBe(true);
    expect(result.suggestedActions.length).toBeGreaterThan(0);
  });

  it('should assign P1 priority for casualties requiring urgent medical assistance', () => {
    const result = runDeterministicTriage({
      category: 'MEDICAL_EMERGENCY',
      title: 'Deep lacerations and wound contamination',
      description: 'Patient bleeding from lower limb cut by flood debris.',
      affectedPeople: 1,
      injuredCount: 1,
      trappedCount: 0,
      requiredAssistance: 'FIRST_AID,MEDICAL_TRANSPORT',
    });

    expect(['P0', 'P1']).toContain(result.recommendedPriority);
    expect(result.confidence).toBeGreaterThanOrEqual(0.8);
  });

  it('should assign P2 or P3 for non-urgent food/water supply or property reports', () => {
    const result = runDeterministicTriage({
      category: 'FOOD_WATER_SHORTAGE',
      title: 'Community requesting supplemental rations',
      description: 'Roads dry, store stock running low in sector market.',
      affectedPeople: 5,
      injuredCount: 0,
      trappedCount: 0,
      requiredAssistance: 'FOOD_WATER',
    });

    expect(['P2', 'P3']).toContain(result.recommendedPriority);
  });
});

describe('Geospatial Dispatch Engine', () => {
  it('should accurately calculate Haversine distance between coordinates', () => {
    // Mumbai CST to Kurla (approx 13-14 km)
    const dist = calculateDistanceKm(18.9401, 72.8347, 19.0657, 72.8794);
    expect(dist).toBeGreaterThan(12);
    expect(dist).toBeLessThan(16);
  });
});
