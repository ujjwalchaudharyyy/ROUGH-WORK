import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { authenticate, optionalAuthenticate, requireRole } from '../middleware/auth';
import { assessIncident } from '../services/aiTriage';
import { logAudit } from '../services/auditLogger';
import { broadcastEvent, sendNotification } from '../services/notificationService';
import { recommendTeamsForIncident } from '../services/dispatchEngine';

const router = Router();

const createIncidentSchema = z.object({
  category: z.string(),
  title: z.string().min(3),
  description: z.string().min(5),
  latitude: z.number(),
  longitude: z.number(),
  address: z.string(),
  affectedPeople: z.number().int().min(1).default(1),
  injuredCount: z.number().int().min(0).default(0),
  trappedCount: z.number().int().min(0).default(0),
  requiredAssistance: z.string().default('EVACUATION'),
  accessibilityNeeds: z.string().optional().nullable(),
  reporterName: z.string().optional(),
  reporterContact: z.string().optional(),
});

// GET /api/incidents - List incidents with filtering & pagination
router.get('/', optionalAuthenticate, async (req: Request, res: Response) => {
  try {
    const { category, priority, status, search, limit = '50', offset = '0', myReportsOnly } = req.query;

    const where: any = {};

    if (myReportsOnly === 'true' && req.user) {
      where.reporterId = req.user.id;
    }

    if (category && category !== 'ALL') {
      where.category = String(category);
    }

    if (priority && priority !== 'ALL') {
      where.priorityLevel = String(priority);
    }

    if (status && status !== 'ALL') {
      where.status = String(status);
    }

    if (search) {
      const q = String(search);
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
        { address: { contains: q } },
        { incidentCode: { contains: q } },
      ];
    }

    const [incidents, total] = await Promise.all([
      prisma.incident.findMany({
        where,
        take: parseInt(String(limit), 10),
        skip: parseInt(String(offset), 10),
        orderBy: [{ priorityLevel: 'asc' }, { createdAt: 'desc' }],
        include: {
          missions: {
            include: {
              team: true,
            },
          },
        },
      }),
      prisma.incident.count({ where }),
    ]);

    res.json({ incidents, total });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/incidents/:id - Single incident detail
router.get('/:id', optionalAuthenticate, async (req: Request, res: Response) => {
  try {
    const incident = await prisma.incident.findUnique({
      where: { id: req.params.id },
      include: {
        reporter: { select: { id: true, fullName: true, phone: true } },
        verifiedBy: { select: { id: true, fullName: true } },
        attachments: true,
        statusHistory: { orderBy: { createdAt: 'desc' } },
        aiRecommendations: { orderBy: { createdAt: 'desc' }, take: 1 },
        missions: {
          include: {
            team: true,
            updates: { orderBy: { createdAt: 'desc' } },
          },
        },
      },
    });

    if (!incident) {
      res.status(404).json({ error: 'Incident not found' });
      return;
    }

    // Role-based privacy protection: non-command center users should not see private contact details
    if (!req.user || (req.user.role === 'CITIZEN' && incident.reporterId !== req.user.id)) {
      incident.reporterContact = '***-***-**** (Protected)';
    }

    res.json(incident);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/incidents - Report a new incident (Guided citizen reporting & command center creation)
router.post('/', optionalAuthenticate, async (req: Request, res: Response) => {
  try {
    const data = createIncidentSchema.parse(req.body);

    // AI Emergency Triage Assessment
    const triage = await assessIncident({
      category: data.category,
      title: data.title,
      description: data.description,
      affectedPeople: data.affectedPeople,
      injuredCount: data.injuredCount,
      trappedCount: data.trappedCount,
      requiredAssistance: data.requiredAssistance,
      accessibilityNeeds: data.accessibilityNeeds,
      latitude: data.latitude,
      longitude: data.longitude,
    });

    // Generate readable code e.g. "INC-2026-XXXX"
    const count = await prisma.incident.count();
    const incidentCode = `INC-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const incident = await prisma.incident.create({
      data: {
        incidentCode,
        category: data.category,
        title: data.title,
        description: data.description,
        latitude: data.latitude,
        longitude: data.longitude,
        address: data.address,
        affectedPeople: data.affectedPeople,
        injuredCount: data.injuredCount,
        trappedCount: data.trappedCount,
        requiredAssistance: data.requiredAssistance,
        accessibilityNeeds: data.accessibilityNeeds,
        priorityLevel: triage.recommendedPriority,
        priorityExplanation: triage.explanation,
        aiAssessed: true,
        aiConfidence: triage.confidence,
        identifiedRisks: triage.identifiedRisks.join('; '),
        suggestedActions: triage.suggestedActions.join('; '),
        status: 'REPORTED',
        reporterId: req.user?.id || null,
        reporterName: data.reporterName || req.user?.fullName || 'Anonymous Citizen',
        reporterContact: data.reporterContact || (req.user as any)?.phone || 'Unspecified',
      },
    });

    // Save initial status history
    await prisma.incidentStatusHistory.create({
      data: {
        incidentId: incident.id,
        previousStatus: null,
        newStatus: 'REPORTED',
        changedById: req.user?.id || null,
        notes: 'Initial emergency incident reported via DisplaceOS portal',
      },
    });

    // Save AI Recommendation snapshot
    await prisma.aIRecommendation.create({
      data: {
        incidentId: incident.id,
        recommendedPriority: triage.recommendedPriority,
        explanation: triage.explanation,
        identifiedRisks: triage.identifiedRisks.join('; '),
        suggestedActions: triage.suggestedActions.join('; '),
        confidence: triage.confidence,
        missingInformation: triage.missingInformation,
      },
    });

    // Broadcast live event to Command Center & active dispatchers
    broadcastEvent('NEW_INCIDENT', incident);

    res.status(201).json({
      message: 'Emergency incident reported successfully',
      incident,
      triage,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.errors ? err.errors[0].message : err.message });
  }
});

// POST /api/incidents/:id/verify - Verify incoming report (Command Center)
router.post('/:id/verify', authenticate, requireRole(['COMMAND_CENTER']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const incident = await prisma.incident.findUnique({ where: { id } });

    if (!incident) {
      res.status(404).json({ error: 'Incident not found' });
      return;
    }

    const updated = await prisma.incident.update({
      where: { id },
      data: {
        status: 'VERIFIED',
        verifiedById: req.user!.id,
        verifiedAt: new Date(),
      },
    });

    await prisma.incidentStatusHistory.create({
      data: {
        incidentId: id,
        previousStatus: incident.status,
        newStatus: 'VERIFIED',
        changedById: req.user!.id,
        notes: `Incident verified by Command Center officer ${req.user!.fullName}`,
      },
    });

    await logAudit({
      action: 'INCIDENT_VERIFY',
      entityType: 'INCIDENT',
      entityId: id,
      performedById: req.user!.id,
      details: { previousStatus: incident.status, newStatus: 'VERIFIED' },
    });

    broadcastEvent('INCIDENT_VERIFIED', updated);
    res.json({ message: 'Incident verified', incident: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/incidents/:id/override-priority - Human override of AI priority recommendation
router.post('/:id/override-priority', authenticate, requireRole(['COMMAND_CENTER', 'MEDICAL_RESPONDER']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { priorityLevel, overrideReason } = req.body;

    if (!['P0', 'P1', 'P2', 'P3'].includes(priorityLevel)) {
      res.status(400).json({ error: 'Invalid priority level. Must be P0, P1, P2, or P3.' });
      return;
    }

    if (!overrideReason || overrideReason.trim().length < 5) {
      res.status(400).json({ error: 'A specific operational override reason must be provided.' });
      return;
    }

    const incident = await prisma.incident.findUnique({ where: { id } });
    if (!incident) {
      res.status(404).json({ error: 'Incident not found' });
      return;
    }

    const updated = await prisma.incident.update({
      where: { id },
      data: {
        priorityLevel,
        isPriorityOverridden: true,
        overrideReason,
      },
    });

    await logAudit({
      action: 'PRIORITY_OVERRIDE',
      entityType: 'INCIDENT',
      entityId: id,
      performedById: req.user!.id,
      details: {
        previousPriority: incident.priorityLevel,
        newPriority: priorityLevel,
        reason: overrideReason,
      },
    });

    broadcastEvent('PRIORITY_OVERRIDDEN', updated);
    res.json({ message: 'Priority overridden successfully', incident: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/incidents/:id/recommend-teams - Smart rescue dispatch recommendations
router.get('/:id/recommend-teams', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const recommendations = await recommendTeamsForIncident(id);
    res.json({ recommendations });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/incidents/:id/assign - Assign rescue team to incident
router.post('/:id/assign', authenticate, requireRole(['COMMAND_CENTER']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { teamId, dispatcherNotes } = req.body;

    const incident = await prisma.incident.findUnique({ where: { id } });
    if (!incident) {
      res.status(404).json({ error: 'Incident not found' });
      return;
    }

    const team = await prisma.rescueTeam.findUnique({ where: { id: teamId } });
    if (!team) {
      res.status(404).json({ error: 'Rescue team not found' });
      return;
    }

    // Check if team is resting or already assigned to maximum concurrent missions
    const activeMissions = await prisma.mission.count({
      where: { teamId, status: { in: ['ASSIGNED', 'ACCEPTED', 'EN_ROUTE', 'ON_SCENE'] } },
    });

    if (activeMissions >= 3) {
      res.status(400).json({ error: 'Rescue team already has 3 active missions. Reassignment requires supervisor clearance.' });
      return;
    }

    const mission = await prisma.$transaction(async (tx) => {
      const createdMission = await tx.mission.create({
        data: {
          incidentId: id,
          teamId,
          dispatcherNotes,
          status: 'ASSIGNED',
        },
      });

      await tx.incident.update({
        where: { id },
        data: { status: 'ASSIGNED' },
      });

      await tx.rescueTeam.update({
        where: { id: teamId },
        data: { status: 'DISPATCHED' },
      });

      await tx.incidentStatusHistory.create({
        data: {
          incidentId: id,
          previousStatus: incident.status,
          newStatus: 'ASSIGNED',
          changedById: req.user!.id,
          notes: `Assigned to team ${team.name} (${team.callSign}). Notes: ${dispatcherNotes || 'None'}`,
        },
      });

      return createdMission;
    });

    await logAudit({
      action: 'MISSION_ASSIGN',
      entityType: 'MISSION',
      entityId: mission.id,
      performedById: req.user!.id,
      details: { incidentId: id, teamId, teamName: team.name },
    });

    // Notify team leader if leader user exists
    if (team.leaderId) {
      await sendNotification({
        userId: team.leaderId,
        title: `🚨 New Mission Assigned: ${incident.incidentCode}`,
        message: `Your team (${team.callSign}) has been dispatched to: ${incident.title} (${incident.address}).`,
        type: 'ASSIGNMENT',
        link: `/responder/missions/${mission.id}`,
      });
    }

    broadcastEvent('MISSION_ASSIGNED', { mission, incidentId: id, team });
    res.status(201).json({ message: 'Team successfully assigned', mission });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
