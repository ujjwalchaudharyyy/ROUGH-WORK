import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../prisma';
import { config } from '../config';
import { authenticate } from '../middleware/auth';
import { logAudit } from '../services/auditLogger';

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(2),
  phone: z.string().optional(),
  role: z.enum(['CITIZEN', 'RESCUE_TEAM', 'SHELTER_MANAGER', 'MEDICAL_RESPONDER', 'COMMAND_CENTER']).default('CITIZEN'),
  organization: z.string().optional(),
  preferredLanguage: z.enum(['en', 'hi']).default('en'),
});

router.post('/register', async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      res.status(400).json({ error: 'An account with this email already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        fullName: data.fullName,
        phone: data.phone,
        role: data.role,
        organization: data.organization,
        preferredLanguage: data.preferredLanguage,
      },
    });

    if (data.role === 'CITIZEN') {
      await prisma.citizenProfile.create({
        data: { userId: user.id },
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        phone: user.phone,
        preferredLanguage: user.preferredLanguage,
        organization: user.organization,
      },
    });
  } catch (err: any) {
    res.status(400).json({ error: err.errors ? err.errors[0].message : err.message });
  }
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        phone: user.phone,
        preferredLanguage: user.preferredLanguage,
        organization: user.organization,
      },
    });
  } catch (err: any) {
    res.status(400).json({ error: err.errors ? err.errors[0].message : err.message });
  }
});

// Demo login helper for seamless role switching during evaluations
router.post('/demo-login', async (req: Request, res: Response) => {
  try {
    const role = (req.body.role || 'COMMAND_CENTER').toUpperCase();
    const user = await prisma.user.findFirst({
      where: { role },
    });

    if (!user) {
      res.status(404).json({ error: `Demo account for role ${role} not found. Please seed the database.` });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        phone: user.phone,
        preferredLanguage: user.preferredLanguage,
        organization: user.organization,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/me', authenticate, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        citizenProfile: true,
        rescueTeam: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        phone: user.phone,
        organization: user.organization,
        preferredLanguage: user.preferredLanguage,
        citizenProfile: user.citizenProfile,
        rescueTeam: user.rescueTeam,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
