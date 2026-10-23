import { Router, Request, Response } from 'express';
import prisma from '../prisma';
import { authenticate, requireRole } from '../middleware/auth';
import { broadcastEvent } from '../services/notificationService';

const router = Router();

// GET /api/teams - List all teams
router.get('/', async (req: Request, res: Response) => {
  try {
    const teams = await prisma.rescueTeam.findMany({
      include: {
        leader: { select: { id: true, fullName: true, phone: true } },
        missions: {
          where: { status: { in: ['ASSIGNED', 'ACCEPTED', 'EN_ROUTE', 'ON_SCENE'] } },
          include: {
            incident: {
              select: { id: true, incidentCode: true, title: true, priorityLevel: true, address: true },
            },
          },
        },
      },
    });

    res.json({ teams });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/teams/:id - Single team detail
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const team = await prisma.rescueTeam.findUnique({
      where: { id: req.params.id },
      include: {
        leader: { select: { id: true, fullName: true, phone: true, email: true } },
        missions: {
          orderBy: { createdAt: 'desc' },
          include: {
            incident: true,
            updates: true,
          },
        },
      },
    });

    if (!team) {
      res.status(404).json({ error: 'Team not found' });
      return;
    }

    res.json(team);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/teams/:id/status - Update team operational status
router.patch('/:id/status', authenticate, async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const allowed = ['AVAILABLE', 'DISPATCHED', 'ON_SCENE', 'RESTING', 'UNAVAILABLE'];

    if (!allowed.includes(status)) {
      res.status(400).json({ error: `Invalid status. Must be one of: ${allowed.join(', ')}` });
      return;
    }

    const updated = await prisma.rescueTeam.update({
      where: { id: req.params.id },
      data: { status },
    });

    broadcastEvent('TEAM_STATUS_CHANGED', updated);
    res.json({ message: 'Team status updated', team: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/teams/:id/location - Update authorized responder location
router.post('/:id/location', authenticate, async (req: Request, res: Response) => {
  try {
    const { latitude, longitude } = req.body;

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      res.status(400).json({ error: 'Valid latitude and longitude are required' });
      return;
    }

    const updated = await prisma.rescueTeam.update({
      where: { id: req.params.id },
      data: {
        currentLat: latitude,
        currentLng: longitude,
        lastLocationUpdate: new Date(),
      },
    });

    broadcastEvent('TEAM_LOCATION_UPDATED', {
      teamId: updated.id,
      latitude,
      longitude,
      lastLocationUpdate: updated.lastLocationUpdate,
    });

    res.json({ message: 'Location updated', team: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
