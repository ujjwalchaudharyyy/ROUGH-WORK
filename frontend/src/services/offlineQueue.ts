import { api } from './api';

export interface OfflineReport {
  id: string; // client UUID/timestamp
  timestamp: string;
  data: any;
  status: 'PENDING' | 'SYNCED' | 'FAILED';
  error?: string;
}

const STORAGE_KEY = 'displaceos_offline_reports';

export const getOfflineQueue = (): OfflineReport[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveOfflineReport = (reportData: any): OfflineReport => {
  const queue = getOfflineQueue();
  const newReport: OfflineReport = {
    id: `offline-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    timestamp: new Date().toISOString(),
    data: reportData,
    status: 'PENDING',
  };

  queue.push(newReport);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  return newReport;
};

export const syncOfflineQueue = async (onSynced?: (syncedCount: number) => void) => {
  const queue = getOfflineQueue();
  const pending = queue.filter((r) => r.status === 'PENDING' || r.status === 'FAILED');

  if (pending.length === 0) return 0;

  let synced = 0;
  const updatedQueue = [...queue];

  for (const item of pending) {
    try {
      await api.createIncident(item.data);
      const index = updatedQueue.findIndex((q) => q.id === item.id);
      if (index !== -1) {
        updatedQueue[index].status = 'SYNCED';
        synced++;
      }
    } catch (err: any) {
      const index = updatedQueue.findIndex((q) => q.id === item.id);
      if (index !== -1) {
        updatedQueue[index].status = 'FAILED';
        updatedQueue[index].error = err.message;
      }
    }
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedQueue));
  if (onSynced) onSynced(synced);
  return synced;
};
