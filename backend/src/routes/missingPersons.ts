import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { authenticate, optionalAuthenticate, requireRole } from '../middleware/auth';
import { broadcastEvent } from '../services/notificationService';
import { logAudit } from '../services/auditLogger';

const router = Router();

// GET /api/missing-persons - List missing person cases
router.get('/', optionalAuthenticate, async (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;
    const where: any = {};

    if (status && status !== 'ALL') {
      where.status = String(status);
    }
    if (search) {
      where.OR = [
        { fullName: { contains: String(search) } },
        { caseCode: { contains: String(search) } },
        { lastSeenLocation: { contains: String(search) } },
      ];
    }

    const cases = await prisma.missingPersonCase.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        updates: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
    });

    // Privacy filter: redact reporter phone & exact contact unless COMMAND_CENTER or owner
    const sanitized = cases.map((c) => {
      if (!req.user || req.user.role === 'CITIZEN') {
        return {
          ...c,
          reporterPhone: '***-***-**** (Protected)',
          emergencyContact: 'Available via Authorized Operations Center',
        };
      }
      return c;
    });

    res.json({ cases: sanitized });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/missing-persons/:id - Case detail
router.get('/:id', optionalAuthenticate, async (req: Request, res: Response) => {
  try {
    const mpCase = await prisma.missingPersonCase.findUnique({
      where: { id: req.params.id },
      include: {
        updates: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!mpCase) {
      res.status(404).json({ error: 'Case not found' });
      return;
    }

    if (!req.user || req.user.role === 'CITIZEN') {
      mpCase.reporterPhone = '***-***-**** (Protected)';
      mpCase.emergencyContact = 'Contact Command Center for official verification';
    }

    res.json(mpCase);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/missing-persons - Report missing person
router.post('/', optionalAuthenticate, async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      age,
      gender,
      lastSeenLocation,
      lastSeenLat,
      lastSeenLng,
      physicalDescription,
      clothingDescription,
      photoUrl,
      emergencyContact,
      reporterName,
      reporterPhone,
      reporterRelation,
    } = req.body;

    if (!fullName || !lastSeenLocation || !emergencyContact) {
      res.status(400).json({ error: 'Full name, last seen location, and emergency contact are required.' });
      return;
    }

    const count = await prisma.missingPersonCase.count();
    const caseCode = `MP-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const newCase = await prisma.missingPersonCase.create({
      data: {
        caseCode,
        fullName,
        age: age ? parseInt(String(age), 10) : null,
        gender,
        lastSeenLocation,
        lastSeenLat: lastSeenLat ? parseFloat(String(lastSeenLat)) : null,
        lastSeenLng: lastSeenLng ? parseFloat(String(lastSeenLng)) : null,
        physicalDescription,
        clothingDescription,
        photoUrl,
        emergencyContact,
        reporterName: reporterName || req.user?.fullName || 'Anonymous Citizen',
        reporterPhone: reporterPhone || (req.user as any)?.phone || 'Unspecified',
        reporterRelation: reporterRelation || 'FAMILY',
        status: 'REPORTED',
      },
    });

    broadcastEvent('MISSING_PERSON_REPORTED', newCase);
    res.status(201).json({ message: 'Missing person case registered', case: newCase });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/missing-persons/:id/status - Update status (POTENTIAL_MATCH, LOCATED, CLOSED)
router.patch('/:id/status', authenticate, requireRole(['COMMAND_CENTER', 'RESCUE_TEAM']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, updateNote } = req.body;

    const allowed = ['REPORTED', 'INVESTIGATING', 'POTENTIAL_MATCH', 'LOCATED', 'CLOSED'];
    if (!allowed.includes(status)) {
      res.status(400).json({ error: `Invalid status. Must be one of: ${allowed.join(', ')}` });
      return;
    }

    const updated = await prisma.$transaction(async (tx) => {
      const c = await tx.missingPersonCase.update({
        where: { id },
        data: {
          status,
          verifiedAt: status === 'LOCATED' ? new Date() : undefined,
        },
      });

      if (updateNote) {
        await tx.missingPersonUpdate.create({
          data: {
            caseId: id,
            updateText: updateNote,
            reportedBy: req.user!.fullName,
          },
        });
      }

      return c;
    });

    await logAudit({
      action: 'MISSING_PERSON_STATUS_UPDATE',
      entityType: 'MISSING_PERSON',
      entityId: id,
      performedById: req.user!.id,
      details: { newStatus: status, note: updateNote },
    });

    broadcastEvent('MISSING_PERSON_UPDATED', updated);
    res.json({ message: 'Case status updated', case: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/missing-persons/:id/updates - Add situation lead or sighting note
router.post('/:id/updates', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { updateText } = req.body;

    if (!updateText) {
      res.status(400).json({ error: 'Update details are required' });
      return;
    }

    const update = await prisma.missingPersonUpdate.create({
      data: {
        caseId: id,
        updateText,
        reportedBy: req.user!.fullName,
      },
    });

    res.status(201).json({ message: 'Update added to case record', update });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
