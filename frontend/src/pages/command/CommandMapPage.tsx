import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { LeafletMap } from '../../components/LeafletMap';
import { IncidentDetailDrawer } from '../../components/IncidentDetailDrawer';
import { Incident, Shelter, RescueTeam, HazardAlert, RoadBlockage } from '../../types';
import {
  MapPin,
  Layers,
  Navigation,
  Compass,
  AlertOctagon,
  Tent,
  Truck,
  RotateCcw,
} from 'lucide-react';

export const CommandMapPage: React.FC = () => {
  const [mapData, setMapData] = useState<{
    incidents: Incident[];
    shelters: Shelter[];
    teams: RescueTeam[];
    hazards: HazardAlert[];
    roadBlockages: RoadBlockage[];
  }>({
    incidents: [],
    shelters: [],
    teams: [],
    hazards: [],
    roadBlockages: [],
  });

  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [routeInfo, setRouteInfo] = useState<any>(null);
  const [routeWaypoints, setRouteWaypoints] = useState<[number, number][]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadMapLayers = async () => {
    try {
      const data = await api.getMapLayers();
      setMapData(data);
      if (data.teams?.length > 0) {
        setSelectedTeamId(data.teams[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMapLayers();
  }, []);

  const handleCalculateRoute = async () => {
    if (!selectedIncident || !selectedTeamId) return;

    const team = mapData.teams.find((t) => t.id === selectedTeamId);
    if (!team) return;

    setIsCalculatingRoute(true);
    try {
      const res = await api.getRouteEstimate(
        team.currentLat,
        team.currentLng,
        selectedIncident.latitude,
        selectedIncident.longitude
      );
      setRouteInfo(res);
      setRouteWaypoints(res.waypoints || []);
    } catch (err: any) {
      alert(`Route calculation error: ${err.message}`);
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Route Tools */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <Compass className="w-6 h-6 text-emerald-400" />
            <span>Disaster Intelligence Geospatial Map</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time emergency GIS telemetry: Incident clusters, responder vehicles, shelters, road blockages, and flood zones.
          </p>
        </div>

        {/* Route Planning Bar */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800 text-xs">
          <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">Route Preview:</span>

          <select
            value={selectedTeamId}
            onChange={(e) => setSelectedTeamId(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs"
          >
            {mapData.teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.callSign})
              </option>
            ))}
          </select>

          <span className="text-slate-500 font-mono">&rarr;</span>

          <span className="text-xs font-mono text-cyan-300">
            {selectedIncident ? selectedIncident.incidentCode : 'Click Incident Marker'}
          </span>

          <button
            onClick={handleCalculateRoute}
            disabled={!selectedIncident || isCalculatingRoute}
            className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold font-mono rounded text-xs transition disabled:opacity-50"
          >
            {isCalculatingRoute ? 'Calculating...' : 'Plot Route'}
          </button>

          {routeInfo && (
            <div className="text-[11px] font-mono text-emerald-400 pl-2 border-l border-slate-700">
              Est: <b>{routeInfo.distanceKm} km</b> (~<b>{routeInfo.estimatedMinutes} min</b>)
            </div>
          )}
        </div>
      </div>

      {/* Main Map Frame */}
      <div className="relative">
        <LeafletMap
          incidents={mapData.incidents}
          shelters={mapData.shelters}
          teams={mapData.teams}
          hazards={mapData.hazards}
          roadBlockages={mapData.roadBlockages}
          routeWaypoints={routeWaypoints}
          onSelectIncident={(inc) => {
            setSelectedIncident(inc);
          }}
          height="calc(100vh - 220px)"
        />
      </div>

      {/* Selected Incident Drawer */}
      <IncidentDetailDrawer
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
        onUpdated={loadMapLayers}
      />
    </div>
  );
};
