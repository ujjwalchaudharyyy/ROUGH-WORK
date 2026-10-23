import { Router, Request, Response } from 'express';
import prisma from '../prisma';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

// GET /api/audit - List audit logs
router.get('/', authenticate, requireRole(['COMMAND_CENTER']), async (req: Request, res: Response) => {
  try {
    const { action, entityType, limit = '50', offset = '0' } = req.query;
    const where: any = {};

    if (action && action !== 'ALL') {
      where.action = String(action);
    }
    if (entityType && entityType !== 'ALL') {
      where.entityType = String(entityType);
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        take: parseInt(String(limit), 10),
        skip: parseInt(String(offset), 10),
        orderBy: { createdAt: 'desc' },
        include: {
          performedBy: { select: { id: true, fullName: true, role: true, email: true } },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    res.json({ logs, total });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
