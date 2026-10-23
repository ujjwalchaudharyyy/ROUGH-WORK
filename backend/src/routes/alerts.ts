import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { authenticate, optionalAuthenticate, requireRole } from '../middleware/auth';
import { broadcastEvent } from '../services/notificationService';
import { logAudit } from '../services/auditLogger';

const router = Router();

// GET /api/alerts - List alerts
router.get('/', optionalAuthenticate, async (req: Request, res: Response) => {
  try {
    const { category, severity, status = 'PUBLISHED' } = req.query;
    const where: any = {};

    if (status && status !== 'ALL') {
      where.status = String(status);
    }
    if (category && category !== 'ALL') {
      where.category = String(category);
    }
    if (severity && severity !== 'ALL') {
      where.severity = String(severity);
    }

    const alerts = await prisma.hazardAlert.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json({ alerts });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/alerts - Create alert (Command Center)
router.post('/', authenticate, requireRole(['COMMAND_CENTER']), async (req: Request, res: Response) => {
  try {
    const {
      title,
      category,
      severity,
      affectedArea,
      latitude,
      longitude,
      radiusKm = 15.0,
      startsAt,
      expiresAt,
      issuingAuthority,
      source,
      verificationStatus,
      instructions,
      status = 'PUBLISHED',
    } = req.body;

    if (!title || !category || !affectedArea || !instructions) {
      res.status(400).json({ error: 'Title, category, affected area, and instructions are required.' });
      return;
    }

    const count = await prisma.hazardAlert.count();
    const alertCode = `ALT-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const alert = await prisma.hazardAlert.create({
      data: {
        alertCode,
        title,
        category,
        severity: severity || 'HIGH',
        affectedArea,
        latitude: parseFloat(String(latitude)) || 19.0760,
        longitude: parseFloat(String(longitude)) || 72.8777,
        radiusKm: parseFloat(String(radiusKm)) || 15.0,
        startsAt: startsAt ? new Date(startsAt) : new Date(),
        expiresAt: expiresAt ? new Date(expiresAt) : new Date(Date.now() + 24 * 60 * 60 * 1000),
        issuingAuthority: issuingAuthority || 'State Disaster Management Authority',
        source: source || 'OFFICIAL_FEEDS',
        verificationStatus: verificationStatus || 'OFFICIAL',
        instructions,
        status,
      },
    });

    await logAudit({
      action: 'ALERT_PUBLISH',
      entityType: 'ALERT',
      entityId: alert.id,
      performedById: req.user!.id,
      details: { title, category, severity, affectedArea },
    });

    if (status === 'PUBLISHED') {
      broadcastEvent('NEW_HAZARD_ALERT', alert);
    }

    res.status(201).json({ message: 'Alert created and issued', alert });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/alerts/:id/revoke - Revoke active alert
router.post('/:id/revoke', authenticate, requireRole(['COMMAND_CENTER']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const alert = await prisma.hazardAlert.update({
      where: { id },
      data: { status: 'REVOKED' },
    });

    await logAudit({
      action: 'ALERT_REVOKE',
      entityType: 'ALERT',
      entityId: id,
      performedById: req.user!.id,
      details: { code: alert.alertCode, title: alert.title },
    });

    broadcastEvent('HAZARD_ALERT_REVOKED', alert);
    res.json({ message: 'Alert successfully revoked', alert });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
