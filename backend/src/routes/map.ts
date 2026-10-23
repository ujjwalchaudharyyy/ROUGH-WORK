import { Router, Request, Response } from 'express';
import prisma from '../prisma';
import { calculateDistanceKm } from '../services/dispatchEngine';

const router = Router();

// GET /api/map/all-layers - Returns all geospatial layers in one fast call
router.get('/all-layers', async (req: Request, res: Response) => {
  try {
    const [incidents, shelters, teams, hazards, roadBlockages] = await Promise.all([
      prisma.incident.findMany({
        where: { status: { not: 'CANCELLED' } },
        select: {
          id: true,
          incidentCode: true,
          category: true,
          title: true,
          description: true,
          latitude: true,
          longitude: true,
          address: true,
          affectedPeople: true,
          injuredCount: true,
          trappedCount: true,
          priorityLevel: true,
          status: true,
          isSimulated: true,
          createdAt: true,
        },
      }),
      prisma.shelter.findMany({
        select: {
          id: true,
          code: true,
          name: true,
          address: true,
          latitude: true,
          longitude: true,
          shelterType: true,
          totalCapacity: true,
          currentOccupancy: true,
          status: true,
          hasDrinkingWater: true,
          hasFood: true,
          hasMedicalSupport: true,
          hasSanitation: true,
          hasPower: true,
          contactPhone: true,
          lastVerifiedAt: true,
        },
      }),
      prisma.rescueTeam.findMany({
        select: {
          id: true,
          name: true,
          callSign: true,
          status: true,
          currentLat: true,
          currentLng: true,
          lastLocationUpdate: true,
          capabilities: true,
          vehicleType: true,
          contactPhone: true,
          memberCount: true,
          isSimulated: true,
        },
      }),
      prisma.hazardAlert.findMany({
        where: { status: 'PUBLISHED' },
        select: {
          id: true,
          alertCode: true,
          title: true,
          category: true,
          severity: true,
          affectedArea: true,
          latitude: true,
          longitude: true,
          radiusKm: true,
          startsAt: true,
          expiresAt: true,
          instructions: true,
          verificationStatus: true,
        },
      }),
      prisma.roadBlockageReport.findMany({
        select: {
          id: true,
          locationName: true,
          latitude: true,
          longitude: true,
          severity: true,
          reason: true,
          isVerified: true,
          notes: true,
          createdAt: true,
        },
      }),
    ]);

    res.json({
      incidents,
      shelters,
      teams,
      hazards,
      roadBlockages,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/map/route-estimate - Route distance & ETA calculation
router.get('/route-estimate', async (req: Request, res: Response) => {
  try {
    const { originLat, originLng, destLat, destLng } = req.query;

    if (!originLat || !originLng || !destLat || !destLng) {
      res.status(400).json({ error: 'Origin and destination coordinates are required' });
      return;
    }

    const oLat = parseFloat(String(originLat));
    const oLng = parseFloat(String(originLng));
    const dLat = parseFloat(String(destLat));
    const dLng = parseFloat(String(destLng));

    const directDistanceKm = calculateDistanceKm(oLat, oLng, dLat, dLng);
    // Real emergency road transit usually adds 25-35% road winding factor
    const roadDistanceKm = parseFloat((directDistanceKm * 1.3).toFixed(2));
    // Estimated time at average speed of 35 km/h
    const estimatedMinutes = Math.max(2, Math.round((roadDistanceKm / 35) * 60));

    // Provide straight-line polyline coordinates preview for Leaflet map render
    const waypoints = [
      [oLat, oLng],
      [oLat + (dLat - oLat) * 0.33 + 0.002, oLng + (dLng - oLng) * 0.33 - 0.001],
      [oLat + (dLat - oLat) * 0.66 - 0.001, oLng + (dLng - oLng) * 0.66 + 0.002],
      [dLat, dLng],
    ];

    res.json({
      distanceKm: roadDistanceKm,
      estimatedMinutes,
      waypoints,
      disclaimer: 'Calculated using emergency route approximation. Check live road blockage layer before dispatch.',
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
