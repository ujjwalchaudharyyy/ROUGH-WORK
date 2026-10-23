import { Router, Request, Response } from 'express';
import {
  triggerIncidentSpike,
  advanceSimulatedTeams,
  consumeSuppliesSimulation,
  triggerSimulatedRoadClosure,
  resolveRandomActiveIncident,
} from '../services/simulationEngine';

const router = Router();

router.post('/spike', async (req: Request, res: Response) => {
  try {
    const count = parseInt(String(req.body.count || '3'), 10);
    const incidents = await triggerIncidentSpike(count);
    res.json({ message: `Simulated surge: ${incidents.length} emergency incidents generated`, incidents });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/move-teams', async (req: Request, res: Response) => {
  try {
    const teams = await advanceSimulatedTeams();
    res.json({ message: `Simulated GPS coordinates updated for ${teams.length} teams`, teams });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/consume-supplies', async (req: Request, res: Response) => {
  try {
    const items = await consumeSuppliesSimulation();
    res.json({ message: 'Simulated supply consumption applied to depot inventory', items });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/road-closure', async (req: Request, res: Response) => {
  try {
    const blockage = await triggerSimulatedRoadClosure();
    res.json({ message: 'Simulated road blockage created', blockage });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/resolve-incident', async (req: Request, res: Response) => {
  try {
    const resolved = await resolveRandomActiveIncident();
    if (!resolved) {
      res.json({ message: 'No active simulated incidents eligible for auto-resolution.' });
      return;
    }
    res.json({ message: `Incident ${resolved.incidentCode} marked as resolved via rescue field report`, incident: resolved });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
