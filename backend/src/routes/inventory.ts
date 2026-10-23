import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { authenticate, requireRole } from '../middleware/auth';
import { broadcastEvent } from '../services/notificationService';
import { logAudit } from '../services/auditLogger';

const router = Router();

// GET /api/inventory - List inventory items
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const { category, lowStockOnly, location, search } = req.query;
    const where: any = {};

    if (category && category !== 'ALL') {
      where.category = String(category);
    }
    if (location && location !== 'ALL') {
      where.storageLocation = String(location);
    }
    if (search) {
      where.OR = [
        { name: { contains: String(search) } },
        { sku: { contains: String(search) } },
        { storageLocation: { contains: String(search) } },
      ];
    }

    let items = await prisma.inventoryItem.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    if (lowStockOnly === 'true') {
      items = items.filter((i) => i.quantity <= i.minStockLevel);
    }

    res.json({ items });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/inventory/low-stock - Fast query for low-stock items
router.get('/low-stock', authenticate, async (req: Request, res: Response) => {
  try {
    const items = await prisma.inventoryItem.findMany();
    const lowStock = items.filter((i) => i.quantity <= i.minStockLevel);
    res.json({ lowStock, count: lowStock.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/inventory/:id - Single item with transaction history
router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const item = await prisma.inventoryItem.findUnique({
      where: { id: req.params.id },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 30,
        },
      },
    });

    if (!item) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }

    res.json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/inventory/items - Create new inventory item (Command Center / Logistics Manager)
router.post('/items', authenticate, requireRole(['COMMAND_CENTER', 'SHELTER_MANAGER']), async (req: Request, res: Response) => {
  try {
    const { name, sku, category, quantity, unit, minStockLevel, storageLocation, expiryDate, supplierOrDonor } = req.body;

    if (!name || !sku || !category || !unit) {
      res.status(400).json({ error: 'Name, SKU, category, and unit are required' });
      return;
    }

    const item = await prisma.inventoryItem.create({
      data: {
        name,
        sku: sku.toUpperCase(),
        category,
        quantity: parseFloat(String(quantity)) || 0,
        unit,
        minStockLevel: parseFloat(String(minStockLevel)) || 50,
        storageLocation: storageLocation || 'CENTRAL_DEPOT_A',
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        supplierOrDonor,
      },
    });

    res.status(201).json({ message: 'Inventory item created', item });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/inventory/transactions - Record stock change (Restock, Consumption, Donation, Transfer)
router.post('/transactions', authenticate, async (req: Request, res: Response) => {
  try {
    const { itemId, type, quantityChange, notes } = req.body;

    const delta = parseFloat(String(quantityChange));
    if (isNaN(delta) || delta === 0) {
      res.status(400).json({ error: 'Valid non-zero quantity change is required' });
      return;
    }

    const item = await prisma.inventoryItem.findUnique({ where: { id: itemId } });
    if (!item) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }

    // Prevent negative balance
    if (item.quantity + delta < 0) {
      res.status(400).json({
        error: `Insufficient stock! Current available balance is ${item.quantity} ${item.unit}. Requested deduction is ${Math.abs(delta)} ${item.unit}.`,
      });
      return;
    }

    const result = await prisma.$transaction(async (tx) => {
      const newBalance = item.quantity + delta;

      const updatedItem = await tx.inventoryItem.update({
        where: { id: itemId },
        data: {
          quantity: newBalance,
          lastUpdated: new Date(),
        },
      });

      const transaction = await tx.inventoryTransaction.create({
        data: {
          itemId,
          type: type || (delta > 0 ? 'RESTOCK' : 'CONSUMPTION'),
          quantityChange: delta,
          remainingBalance: newBalance,
          notes,
          performedById: req.user!.id,
        },
      });

      return { updatedItem, transaction };
    });

    await logAudit({
      action: 'INVENTORY_MUTATION',
      entityType: 'INVENTORY',
      entityId: itemId,
      performedById: req.user!.id,
      details: { delta, type, newBalance: result.updatedItem.quantity },
    });

    broadcastEvent('INVENTORY_UPDATED', result);
    res.status(201).json({
      message: 'Inventory transaction logged successfully',
      item: result.updatedItem,
      transaction: result.transaction,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
