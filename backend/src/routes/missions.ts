import { Router, Request, Response } from 'express';
import prisma from '../prisma';
import { authenticate } from '../middleware/auth';
import { broadcastEvent, sendNotification } from '../services/notificationService';
import { logAudit } from '../services/auditLogger';

const router = Router();

// GET /api/missions - List missions with filter
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const { status, teamId } = req.query;
    const where: any = {};

    if (status && status !== 'ALL') {
      where.status = String(status);
    }

    if (teamId) {
      where.teamId = String(teamId);
    }

    // If logged in as responder, automatically filter to their team's missions
    if (req.user?.role === 'RESCUE_TEAM') {
      const myTeam = await prisma.rescueTeam.findFirst({
        where: { leaderId: req.user.id },
      });
      if (myTeam) {
        where.teamId = myTeam.id;
      }
    }

    const missions = await prisma.mission.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        incident: true,
        team: true,
        updates: { orderBy: { createdAt: 'desc' } },
      },
    });

    res.json({ missions });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/missions/:id - Mission detail
router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const mission = await prisma.mission.findUnique({
      where: { id: req.params.id },
      include: {
        incident: {
          include: {
            attachments: true,
            statusHistory: true,
          },
        },
        team: true,
        updates: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!mission) {
      res.status(404).json({ error: 'Mission not found' });
      return;
    }

    res.json(mission);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/missions/:id/accept - Responder accepts mission
router.post('/:id/accept', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const mission = await prisma.mission.findUnique({
      where: { id },
      include: { incident: true, team: true },
    });

    if (!mission) {
      res.status(404).json({ error: 'Mission not found' });
      return;
    }

    const updated = await prisma.$transaction(async (tx) => {
      const m = await tx.mission.update({
        where: { id },
        data: {
          status: 'ACCEPTED',
          acceptedAt: new Date(),
        },
      });

      await tx.incident.update({
        where: { id: mission.incidentId },
        data: { status: 'ACCEPTED' },
      });

      await tx.incidentStatusHistory.create({
        data: {
          incidentId: mission.incidentId,
          previousStatus: 'ASSIGNED',
          newStatus: 'ACCEPTED',
          changedById: req.user!.id,
          notes: `Mission accepted by team ${mission.team.callSign}`,
        },
      });

      return m;
    });

    broadcastEvent('MISSION_STATUS_UPDATED', { mission: updated, newStatus: 'ACCEPTED' });
    res.json({ message: 'Mission accepted', mission: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/missions/:id/decline - Responder declines mission
router.post('/:id/decline', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { declineReason } = req.body;

    if (!declineReason) {
      res.status(400).json({ error: 'A valid operational reason for declining must be provided.' });
      return;
    }

    const mission = await prisma.mission.findUnique({
      where: { id },
      include: { incident: true, team: true },
    });

    if (!mission) {
      res.status(404).json({ error: 'Mission not found' });
      return;
    }

    const updated = await prisma.$transaction(async (tx) => {
      const m = await tx.mission.update({
        where: { id },
        data: {
          status: 'DECLINED',
          declineReason,
        },
      });

      // Revert incident to VERIFIED so dispatchers can reassign
      await tx.incident.update({
        where: { id: mission.incidentId },
        data: { status: 'VERIFIED' },
      });

      await tx.rescueTeam.update({
        where: { id: mission.teamId },
        data: { status: 'AVAILABLE' },
      });

      await tx.incidentStatusHistory.create({
        data: {
          incidentId: mission.incidentId,
          previousStatus: 'ASSIGNED',
          newStatus: 'VERIFIED',
          changedById: req.user!.id,
          notes: `Team ${mission.team.callSign} declined mission. Reason: ${declineReason}. Incident requeued.`,
        },
      });

      return m;
    });

    await logAudit({
      action: 'MISSION_DECLINED',
      entityType: 'MISSION',
      entityId: id,
      performedById: req.user!.id,
      details: { reason: declineReason, teamId: mission.teamId },
    });

    broadcastEvent('MISSION_DECLINED', { mission: updated, incidentId: mission.incidentId });
    res.json({ message: 'Mission declined and incident requeued', mission: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/missions/:id/en-route - Responder moves en route
router.post('/:id/en-route', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const mission = await prisma.mission.findUnique({ where: { id }, include: { team: true } });
    if (!mission) {
      res.status(404).json({ error: 'Mission not found' });
      return;
    }

    const updated = await prisma.$transaction(async (tx) => {
      const m = await tx.mission.update({
        where: { id },
        data: { status: 'EN_ROUTE' },
      });

      await tx.incident.update({
        where: { id: mission.incidentId },
        data: { status: 'EN_ROUTE' },
      });

      await tx.incidentStatusHistory.create({
        data: {
          incidentId: mission.incidentId,
          previousStatus: 'ACCEPTED',
          newStatus: 'EN_ROUTE',
          changedById: req.user!.id,
          notes: `Team ${mission.team.callSign} is now EN ROUTE to destination.`,
        },
      });

      return m;
    });

    broadcastEvent('MISSION_STATUS_UPDATED', { mission: updated, newStatus: 'EN_ROUTE' });
    res.json({ message: 'Status updated to EN_ROUTE', mission: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/missions/:id/on-scene - Responder arrives on scene
router.post('/:id/on-scene', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const mission = await prisma.mission.findUnique({ where: { id }, include: { team: true } });
    if (!mission) {
      res.status(404).json({ error: 'Mission not found' });
      return;
    }

    const updated = await prisma.$transaction(async (tx) => {
      const m = await tx.mission.update({
        where: { id },
        data: {
          status: 'ON_SCENE',
          arrivedAt: new Date(),
        },
      });

      await tx.incident.update({
        where: { id: mission.incidentId },
        data: { status: 'ON_SCENE' },
      });

      await tx.rescueTeam.update({
        where: { id: mission.teamId },
        data: { status: 'ON_SCENE' },
      });

      await tx.incidentStatusHistory.create({
        data: {
          incidentId: mission.incidentId,
          previousStatus: 'EN_ROUTE',
          newStatus: 'ON_SCENE',
          changedById: req.user!.id,
          notes: `Team ${mission.team.callSign} arrived ON SCENE. Operations underway.`,
        },
      });

      return m;
    });

    broadcastEvent('MISSION_STATUS_UPDATED', { mission: updated, newStatus: 'ON_SCENE' });
    res.json({ message: 'Status updated to ON_SCENE', mission: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/missions/:id/complete - Responder completes mission
router.post('/:id/complete', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { victimsAssisted = 0, responderNotes } = req.body;

    const mission = await prisma.mission.findUnique({ where: { id }, include: { team: true } });
    if (!mission) {
      res.status(404).json({ error: 'Mission not found' });
      return;
    }

    const updated = await prisma.$transaction(async (tx) => {
      const m = await tx.mission.update({
        where: { id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          victimsAssisted: parseInt(String(victimsAssisted), 10) || 0,
          responderNotes,
        },
      });

      await tx.incident.update({
        where: { id: mission.incidentId },
        data: {
          status: 'RESOLVED',
          resolvedAt: new Date(),
        },
      });

      // Free the team back to AVAILABLE
      await tx.rescueTeam.update({
        where: { id: mission.teamId },
        data: { status: 'AVAILABLE' },
      });

      await tx.incidentStatusHistory.create({
        data: {
          incidentId: mission.incidentId,
          previousStatus: 'ON_SCENE',
          newStatus: 'RESOLVED',
          changedById: req.user!.id,
          notes: `Mission completed by ${mission.team.callSign}. ${victimsAssisted} victim(s) assisted. Report: ${responderNotes || 'None'}`,
        },
      });

      return m;
    });

    await logAudit({
      action: 'MISSION_COMPLETED',
      entityType: 'MISSION',
      entityId: id,
      performedById: req.user!.id,
      details: { victimsAssisted, notes: responderNotes },
    });

    broadcastEvent('MISSION_COMPLETED', { mission: updated, incidentId: mission.incidentId });
    res.json({ message: 'Mission completed successfully', mission: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/missions/:id/updates - Post a situation update
router.post('/:id/updates', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { updateText, latitude, longitude } = req.body;

    if (!updateText) {
      res.status(400).json({ error: 'Update text is required' });
      return;
    }

    const mission = await prisma.mission.findUnique({ where: { id } });
    if (!mission) {
      res.status(404).json({ error: 'Mission not found' });
      return;
    }

    const update = await prisma.missionUpdate.create({
      data: {
        missionId: id,
        status: mission.status,
        updateText,
        latitude: typeof latitude === 'number' ? latitude : null,
        longitude: typeof longitude === 'number' ? longitude : null,
      },
    });

    broadcastEvent('MISSION_UPDATE_ADDED', { missionId: id, update });
    res.status(201).json({ message: 'Update recorded', update });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
