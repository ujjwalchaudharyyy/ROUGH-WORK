import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

interface SimulationContextType {
  isSimulating: boolean;
  statusMessage: string | null;
  triggerSpike: () => Promise<void>;
  triggerMoveTeams: () => Promise<void>;
  triggerConsumeSupplies: () => Promise<void>;
  triggerRoadClosure: () => Promise<void>;
  triggerResolveIncident: () => Promise<void>;
  lastEvent: any;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [lastEvent, setLastEvent] = useState<any>(null);

  // Connect to backend WebSocket for live event telemetry
  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: any = null;

    const connectWs = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;

      try {
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          console.log('📡 Connected to DisplaceOS Telemetry WebSocket');
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            setLastEvent(data);
            if (data.event) {
              console.log('⚡ DisplaceOS Realtime Event:', data.event, data.data);
            }
          } catch (e) {
            // ignore
          }
        };

        ws.onclose = () => {
          reconnectTimeout = setTimeout(connectWs, 3000);
        };
      } catch (err) {
        reconnectTimeout = setTimeout(connectWs, 5000);
      }
    };

    connectWs();

    return () => {
      if (ws) ws.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, []);

  const showFeedback = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const triggerSpike = async () => {
    setIsSimulating(true);
    try {
      const res = await api.triggerSpike(3);
      showFeedback(`⚡ Simulation: Surge triggered! 3 new critical incidents logged.`);
    } catch (err: any) {
      showFeedback(`Error: ${err.message}`);
    } finally {
      setIsSimulating(false);
    }
  };

  const triggerMoveTeams = async () => {
    setIsSimulating(true);
    try {
      const res = await api.triggerMoveTeams();
      showFeedback(`🚜 Simulation: Responders advanced along live coordinates.`);
    } catch (err: any) {
      showFeedback(`Error: ${err.message}`);
    } finally {
      setIsSimulating(false);
    }
  };

  const triggerConsumeSupplies = async () => {
    setIsSimulating(true);
    try {
      const res = await api.triggerConsumeSupplies();
      showFeedback(`📦 Simulation: Relief supply distribution applied to field camps.`);
    } catch (err: any) {
      showFeedback(`Error: ${err.message}`);
    } finally {
      setIsSimulating(false);
    }
  };

  const triggerRoadClosure = async () => {
    setIsSimulating(true);
    try {
      const res = await api.triggerRoadClosure();
      showFeedback(`🚧 Simulation: Road closure registered in sector corridor.`);
    } catch (err: any) {
      showFeedback(`Error: ${err.message}`);
    } finally {
      setIsSimulating(false);
    }
  };

  const triggerResolveIncident = async () => {
    setIsSimulating(true);
    try {
      const res = await api.triggerResolveIncident();
      showFeedback(res.message || 'Simulation: Incident resolved.');
    } catch (err: any) {
      showFeedback(`Error: ${err.message}`);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <SimulationContext.Provider
      value={{
        isSimulating,
        statusMessage,
        triggerSpike,
        triggerMoveTeams,
        triggerConsumeSupplies,
        triggerRoadClosure,
        triggerResolveIncident,
        lastEvent,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error('useSimulation must be used within SimulationProvider');
  return ctx;
};
