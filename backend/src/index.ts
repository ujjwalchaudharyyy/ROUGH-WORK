import http from 'http';
import express from 'express';
import cors from 'cors';
import { WebSocketServer, WebSocket } from 'ws';
import { config } from './config';
import { registerClient } from './services/notificationService';

// Route imports
import authRoutes from './routes/auth';
import incidentRoutes from './routes/incidents';
import mapRoutes from './routes/map';
import teamRoutes from './routes/teams';
import missionRoutes from './routes/missions';
import shelterRoutes from './routes/shelters';
import inventoryRoutes from './routes/inventory';
import missingPersonRoutes from './routes/missingPersons';
import alertRoutes from './routes/alerts';
import analyticsRoutes from './routes/analytics';
import auditRoutes from './routes/audit';
import simulationRoutes from './routes/simulation';

const app = express();

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'DisplaceOS Core Engine',
    version: '1.0.0',
    mode: 'EOC_ACTIVE',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/map', mapRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/shelters', shelterRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/missing-persons', missingPersonRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/simulation', simulationRoutes);

// Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('API Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    code: err.code || 'INTERNAL_ERROR',
  });
});

const server = http.createServer(app);

// WebSocket Server for real-time mission & incident streaming
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws: WebSocket, req) => {
  // Parse optional userId or role from query string
  try {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const userId = url.searchParams.get('userId') || undefined;
    const role = url.searchParams.get('role') || undefined;
    registerClient(ws, userId, role);

    ws.send(JSON.stringify({
      event: 'CONNECTED',
      message: 'DisplaceOS Live EOC Telemetry Stream Connected',
      timestamp: new Date().toISOString(),
    }));
  } catch (err) {
    registerClient(ws);
  }

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      if (msg.type === 'PING') {
        ws.send(JSON.stringify({ type: 'PONG', timestamp: new Date().toISOString() }));
      }
    } catch {
      // Ignore malformed messages
    }
  });
});

server.listen(config.port, () => {
  console.log(`=======================================================`);
  console.log(`🚨 DisplaceOS Core API & Dispatch Server Online`);
  console.log(`🌐 Port: ${config.port}`);
  console.log(`🛰️  WebSocket Path: ws://localhost:${config.port}/ws`);
  console.log(`🛡️  Mode: ${config.nodeEnv.toUpperCase()}`);
  console.log(`=======================================================`);
});
