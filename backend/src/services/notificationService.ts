import { WebSocket } from 'ws';
import prisma from '../prisma';

interface ConnectedClient {
  ws: WebSocket;
  userId?: string;
  role?: string;
}

const clients = new Set<ConnectedClient>();

export const registerClient = (ws: WebSocket, userId?: string, role?: string) => {
  const client: ConnectedClient = { ws, userId, role };
  clients.add(client);

  ws.on('close', () => {
    clients.delete(client);
  });
};

export const broadcastEvent = (eventType: string, payload: any) => {
  const message = JSON.stringify({ event: eventType, data: payload, timestamp: new Date().toISOString() });
  for (const client of clients) {
    if (client.ws.readyState === WebSocket.OPEN) {
      try {
        client.ws.send(message);
      } catch (e) {
        clients.delete(client);
      }
    }
  }
};

export const sendNotification = async (params: {
  userId: string;
  title: string;
  message: string;
  type?: string;
  link?: string;
}) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: params.userId,
        title: params.title,
        message: params.message,
        type: params.type || 'INFO',
        link: params.link,
      },
    });

    // Notify connected user if online
    const message = JSON.stringify({
      event: 'NOTIFICATION',
      data: notification,
      timestamp: new Date().toISOString(),
    });

    for (const client of clients) {
      if (client.userId === params.userId && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(message);
      }
    }

    return notification;
  } catch (err) {
    console.error('Failed to create/send notification:', err);
    return null;
  }
};
