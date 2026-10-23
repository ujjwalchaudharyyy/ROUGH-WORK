import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { authenticate, optionalAuthenticate, requireRole } from '../middleware/auth';
import { broadcastEvent } from '../services/notificationService';
import { logAudit } from '../services/auditLogger';

const router = Router();

// GET /api/shelters - List shelters
router.get('/', optionalAuthenticate, async (req: Request, res: Response) => {
  try {
    const { status, type, hasMedical, search } = req.query;
    const where: any = {};

    if (status && status !== 'ALL') {
      where.status = String(status);
    }
    if (type && type !== 'ALL') {
      where.shelterType = String(type);
    }
    if (hasMedical === 'true') {
      where.hasMedicalSupport = true;
    }
    if (search) {
      where.OR = [
        { name: { contains: String(search) } },
        { address: { contains: String(search) } },
        { code: { contains: String(search) } },
      ];
    }

    const shelters = await prisma.shelter.findMany({
      where,
      orderBy: { currentOccupancy: 'desc' },
      include: {
        manager: { select: { id: true, fullName: true, phone: true } },
      },
    });

    res.json({ shelters });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/shelters/:id - Shelter detail
router.get('/:id', optionalAuthenticate, async (req: Request, res: Response) => {
  try {
    const shelter = await prisma.shelter.findUnique({
      where: { id: req.params.id },
      include: {
        manager: { select: { id: true, fullName: true, phone: true, email: true } },
        registrations: {
          where: { status: 'ACTIVE' },
          orderBy: { checkInAt: 'desc' },
          take: 20,
        },
        occupancyHistory: {
          orderBy: { recordedAt: 'desc' },
          take: 15,
        },
      },
    });

    if (!shelter) {
      res.status(404).json({ error: 'Shelter not found' });
      return;
    }

    res.json(shelter);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/shelters/:id/capacity - Shelter manager updates capacity/occupancy
router.patch('/:id/capacity', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { currentOccupancy, totalCapacity, notes } = req.body;

    const shelter = await prisma.shelter.findUnique({ where: { id } });
    if (!shelter) {
      res.status(404).json({ error: 'Shelter not found' });
      return;
    }

    const newOccupancy = typeof currentOccupancy === 'number' ? currentOccupancy : shelter.currentOccupancy;
    const newTotal = typeof totalCapacity === 'number' ? totalCapacity : shelter.totalCapacity;

    if (newOccupancy < 0 || newOccupancy > newTotal) {
      res.status(400).json({ error: 'Occupancy cannot be negative or exceed total capacity' });
      return;
    }

    // Determine status automatically
    let status = 'OPEN';
    const ratio = newOccupancy / newTotal;
    if (ratio >= 1.0) {
      status = 'FULL';
    } else if (ratio >= 0.85) {
      status = 'LIMITED_CAPACITY';
    }

    const updated = await prisma.$transaction(async (tx) => {
      const s = await tx.shelter.update({
        where: { id },
        data: {
          currentOccupancy: newOccupancy,
          totalCapacity: newTotal,
          status,
          lastVerifiedAt: new Date(),
        },
      });

      await tx.shelterOccupancyRecord.create({
        data: {
          shelterId: id,
          occupancy: newOccupancy,
          notes: notes || 'Routine capacity check by shelter manager',
        },
      });

      return s;
    });

    await logAudit({
      action: 'SHELTER_UPDATE',
      entityType: 'SHELTER',
      entityId: id,
      performedById: req.user!.id,
      details: { occupancy: newOccupancy, totalCapacity: newTotal, status },
    });

    broadcastEvent('SHELTER_UPDATED', updated);
    res.json({ message: 'Shelter occupancy updated', shelter: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/shelters/:id/check-in - Citizen or family check-in
router.post('/:id/check-in', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { citizenName, citizenPhone, familyMembersCount = 1, medicalNeeds, notes } = req.body;

    if (!citizenName || citizenName.trim().length === 0) {
      res.status(400).json({ error: 'Citizen name is required' });
      return;
    }

    const shelter = await prisma.shelter.findUnique({ where: { id } });
    if (!shelter) {
      res.status(404).json({ error: 'Shelter not found' });
      return;
    }

    const count = parseInt(String(familyMembersCount), 10) || 1;
    if (shelter.currentOccupancy + count > shelter.totalCapacity) {
      res.status(400).json({ error: 'Insufficient shelter capacity available for this party size.' });
      return;
    }

    const result = await prisma.$transaction(async (tx) => {
      const reg = await tx.shelterRegistration.create({
        data: {
          shelterId: id,
          citizenName,
          citizenPhone,
          familyMembersCount: count,
          medicalNeeds,
          notes,
          status: 'ACTIVE',
        },
      });

      const newOccupancy = shelter.currentOccupancy + count;
      let newStatus = shelter.status;
      if (newOccupancy >= shelter.totalCapacity) {
        newStatus = 'FULL';
      } else if (newOccupancy / shelter.totalCapacity >= 0.85) {
        newStatus = 'LIMITED_CAPACITY';
      }

      const updatedShelter = await tx.shelter.update({
        where: { id },
        data: {
          currentOccupancy: newOccupancy,
          status: newStatus,
          lastVerifiedAt: new Date(),
        },
      });

      return { reg, updatedShelter };
    });

    broadcastEvent('SHELTER_CHECK_IN', result);
    res.status(201).json({ message: 'Party checked in successfully', registration: result.reg });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/shelters/:id/check-out - Check-out registration
router.post('/:id/check-out', authenticate, async (req: Request, res: Response) => {
  try {
    const { registrationId } = req.body;
    const reg = await prisma.shelterRegistration.findUnique({ where: { id: registrationId } });

    if (!reg || reg.status !== 'ACTIVE') {
      res.status(404).json({ error: 'Active registration record not found' });
      return;
    }

    const shelter = await prisma.shelter.findUnique({ where: { id: reg.shelterId } });
    if (!shelter) {
      res.status(404).json({ error: 'Shelter not found' });
      return;
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedReg = await tx.shelterRegistration.update({
        where: { id: registrationId },
        data: {
          status: 'CHECKED_OUT',
          checkOutAt: new Date(),
        },
      });

      const newOccupancy = Math.max(0, shelter.currentOccupancy - reg.familyMembersCount);
      let newStatus = 'OPEN';
      if (newOccupancy / shelter.totalCapacity >= 0.85) {
        newStatus = 'LIMITED_CAPACITY';
      }

      const updatedShelter = await tx.shelter.update({
        where: { id: shelter.id },
        data: {
          currentOccupancy: newOccupancy,
          status: newStatus,
          lastVerifiedAt: new Date(),
        },
      });

      return { updatedReg, updatedShelter };
    });

    broadcastEvent('SHELTER_CHECK_OUT', result);
    res.json({ message: 'Checked out successfully', registration: result.updatedReg });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
