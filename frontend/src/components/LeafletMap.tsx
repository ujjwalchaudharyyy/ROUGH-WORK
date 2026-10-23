import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Incident, Shelter, RescueTeam, HazardAlert, RoadBlockage } from '../types';
import { StatusBadge } from './StatusBadge';
import { ShieldAlert, Navigation, Tent, AlertTriangle, Layers, Eye, Compass } from 'lucide-react';

interface LeafletMapProps {
  incidents?: Incident[];
  shelters?: Shelter[];
  teams?: RescueTeam[];
  hazards?: HazardAlert[];
  roadBlockages?: RoadBlockage[];
  routeWaypoints?: [number, number][];
  onSelectIncident?: (incident: Incident) => void;
  center?: [number, number];
  zoom?: number;
  height?: string;
}

// Custom Leaflet DivIcons using styled SVG HTML strings
const createIncidentIcon = (priority: string) => {
  let color = '#38BDF8';
  let pulse = false;
  if (priority === 'P0') {
    color = '#EF4444';
    pulse = true;
  } else if (priority === 'P1') {
    color = '#F59E0B';
  } else if (priority === 'P3') {
    color = '#10B981';
  }

  return L.divIcon({
    className: 'custom-pin',
    html: `
      <div style="position: relative; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
        ${pulse ? `<div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: ${color}; opacity: 0.4; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>` : ''}
        <div style="width: 24px; height: 24px; border-radius: 50%; background: #0F172A; border: 2.5px solid ${color}; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px ${color}88;">
          <div style="width: 8px; height: 8px; border-radius: 50%; background: ${color};"></div>
        </div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

const shelterIcon = L.divIcon({
  className: 'custom-shelter',
  html: `
    <div style="width: 26px; height: 26px; border-radius: 6px; background: #064E3B; border: 2px solid #10B981; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px #10B98166;">
      <span style="font-size: 14px;">🏕️</span>
    </div>
  `,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
});

const teamIcon = L.divIcon({
  className: 'custom-team',
  html: `
    <div style="width: 26px; height: 26px; border-radius: 50%; background: #1E1B4B; border: 2px solid #818CF8; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px #818CF866;">
      <span style="font-size: 13px;">🚒</span>
    </div>
  `,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
});

const blockageIcon = L.divIcon({
  className: 'custom-blockage',
  html: `
    <div style="width: 24px; height: 24px; border-radius: 4px; background: #7F1D1D; border: 2px solid #EF4444; display: flex; align-items: center; justify-content: center;">
      <span style="font-size: 12px;">🚧</span>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Map recenter controller component
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  incidents = [],
  shelters = [],
  teams = [],
  hazards = [],
  roadBlockages = [],
  routeWaypoints = [],
  onSelectIncident,
  center = [19.0760, 72.8777],
  zoom = 13,
  height = '500px',
}) => {
  // Layer controls state
  const [showIncidents, setShowIncidents] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [showTeams, setShowTeams] = useState(true);
  const [showHazards, setShowHazards] = useState(true);
  const [showBlockages, setShowBlockages] = useState(true);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-800 shadow-2xl" style={{ height }}>
      {/* Floating Layer Controls */}
      <div className="absolute top-3 right-3 z-[1000] bg-slate-900/90 backdrop-blur-md p-2.5 rounded-lg border border-slate-700/80 text-xs shadow-xl space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold font-mono text-[11px] text-slate-300 pb-1 border-b border-slate-800">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>MAP LAYERS</span>
        </div>

        <label className="flex items-center gap-2 cursor-pointer hover:text-slate-100 text-slate-300">
          <input
            type="checkbox"
            checked={showIncidents}
            onChange={(e) => setShowIncidents(e.target.checked)}
            className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-0"
          />
          <span>Incidents ({incidents.length})</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer hover:text-slate-100 text-slate-300">
          <input
            type="checkbox"
            checked={showShelters}
            onChange={(e) => setShowShelters(e.target.checked)}
            className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-0"
          />
          <span>Shelters ({shelters.length})</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer hover:text-slate-100 text-slate-300">
          <input
            type="checkbox"
            checked={showTeams}
            onChange={(e) => setShowTeams(e.target.checked)}
            className="rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-0"
          />
          <span>Responders ({teams.length})</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer hover:text-slate-100 text-slate-300">
          <input
            type="checkbox"
            checked={showHazards}
            onChange={(e) => setShowHazards(e.target.checked)}
            className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-0"
          />
          <span>Hazard Zones ({hazards.length})</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer hover:text-slate-100 text-slate-300">
          <input
            type="checkbox"
            checked={showBlockages}
            onChange={(e) => setShowBlockages(e.target.checked)}
            className="rounded border-slate-700 bg-slate-800 text-red-500 focus:ring-0"
          />
          <span>Road Cuts ({roadBlockages.length})</span>
        </label>
      </div>

      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%', background: '#0B1120' }}
        scrollWheelZoom={true}
      >
        <ChangeView center={center} zoom={zoom} />

        {/* High-contrast CartoDB Dark Matter tiles or OpenStreetMap */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

        {/* Hazard Risk Zones (Circles) */}
        {showHazards &&
          hazards.map((h) => (
            <Circle
              key={h.id}
              center={[h.latitude, h.longitude]}
              radius={h.radiusKm * 1000}
              pathOptions={{
                color: h.severity === 'CRITICAL' ? '#EF4444' : '#F59E0B',
                fillColor: h.severity === 'CRITICAL' ? '#EF4444' : '#F59E0B',
                fillOpacity: 0.12,
                weight: 1.5,
                dashArray: '4, 6',
              }}
            >
              <Popup className="dark-popup">
                <div className="p-2 space-y-1 text-slate-900">
                  <div className="font-bold text-xs text-red-600">{h.title}</div>
                  <div className="text-[11px] text-slate-700">Area: {h.affectedArea}</div>
                  <div className="text-[11px] text-slate-600 italic">{h.instructions}</div>
                </div>
              </Popup>
            </Circle>
          ))}

        {/* Road Blockages */}
        {showBlockages &&
          roadBlockages.map((rb) => (
            <Marker key={rb.id} position={[rb.latitude, rb.longitude]} icon={blockageIcon}>
              <Popup className="dark-popup">
                <div className="p-2 text-slate-900 space-y-1">
                  <div className="font-bold text-xs text-red-600">🚧 ROAD IMPASSABLE</div>
                  <div className="text-[11px] font-semibold">{rb.locationName}</div>
                  <div className="text-[11px] text-slate-600">Reason: {rb.reason.replace(/_/g, ' ')}</div>
                  {rb.notes && <div className="text-[10px] text-slate-500">{rb.notes}</div>}
                </div>
              </Popup>
            </Marker>
          ))}

        {/* Shelters */}
        {showShelters &&
          shelters.map((s) => (
            <Marker key={s.id} position={[s.latitude, s.longitude]} icon={shelterIcon}>
              <Popup className="dark-popup">
                <div className="p-2 text-slate-900 space-y-1 min-w-[180px]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-emerald-700">{s.name}</span>
                    <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1 rounded">
                      {s.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600">{s.address}</div>
                  <div className="text-[11px] font-mono">
                    Capacity: <b>{s.currentOccupancy}</b> / {s.totalCapacity} (
                    {Math.round((s.currentOccupancy / s.totalCapacity) * 100)}% Full)
                  </div>
                  <div className="text-[10px] text-slate-500">Contact: {s.contactPhone}</div>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* Rescue Teams */}
        {showTeams &&
          teams.map((t) => (
            <Marker key={t.id} position={[t.currentLat, t.currentLng]} icon={teamIcon}>
              <Popup className="dark-popup">
                <div className="p-2 text-slate-900 space-y-1 min-w-[180px]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-indigo-700">{t.name}</span>
                    <span className="text-[10px] font-mono bg-indigo-100 text-indigo-800 px-1 rounded">
                      {t.callSign}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-700">Vehicle: {t.vehicleType} ({t.vehiclePlate})</div>
                  <div className="text-[10px] text-slate-500">Capabilities: {t.capabilities.replace(/,/g, ', ')}</div>
                  <div className="text-[10px] font-mono text-emerald-600">Status: {t.status}</div>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* Incidents */}
        {showIncidents &&
          incidents.map((inc) => (
            <Marker
              key={inc.id}
              position={[inc.latitude, inc.longitude]}
              icon={createIncidentIcon(inc.priorityLevel)}
              eventHandlers={{
                click: () => {
                  if (onSelectIncident) onSelectIncident(inc);
                },
              }}
            >
              <Popup className="dark-popup">
                <div className="p-2 text-slate-900 space-y-1.5 min-w-[200px]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] font-bold text-slate-500">{inc.incidentCode}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        inc.priorityLevel === 'P0'
                          ? 'bg-red-100 text-red-700'
                          : inc.priorityLevel === 'P1'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {inc.priorityLevel}
                    </span>
                  </div>

                  <div className="font-bold text-xs text-slate-900 leading-snug">{inc.title}</div>
                  <div className="text-[11px] text-slate-600 truncate">{inc.address}</div>

                  <div className="flex items-center gap-3 text-[10px] text-slate-700 font-mono pt-1 border-t border-slate-200">
                    <span>Affected: <b>{inc.affectedPeople}</b></span>
                    <span>Trapped: <b>{inc.trappedCount}</b></span>
                    <span>Status: <b>{inc.status}</b></span>
                  </div>

                  {onSelectIncident && (
                    <button
                      onClick={() => onSelectIncident(inc)}
                      className="w-full mt-2 py-1 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-[11px] rounded transition"
                    >
                      Open Full Triage Details
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

        {/* Route Preview Polyline */}
        {routeWaypoints.length > 0 && (
          <Polyline
            positions={routeWaypoints}
            pathOptions={{
              color: '#06B6D4',
              weight: 4,
              dashArray: '8, 8',
              opacity: 0.9,
            }}
          />
        )}
      </MapContainer>
    </div>
  );
};
