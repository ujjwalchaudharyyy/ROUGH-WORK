import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { SimulationBanner } from './components/SimulationBanner';
import { TopCommandBar } from './components/TopCommandBar';
import { LeftSidebar } from './components/LeftSidebar';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { AboutPage } from './pages/public/AboutPage';
import { FeaturesPage } from './pages/public/FeaturesPage';
import { SafetyPage } from './pages/public/SafetyPage';
import { EmergencyResourcesPage } from './pages/public/EmergencyResourcesPage';
import { LoginPage } from './pages/public/LoginPage';

// Citizen Pages
import { CitizenDashboard } from './pages/citizen/CitizenDashboard';
import { EmergencyReportPage } from './pages/citizen/EmergencyReportPage';
import { MyRequestsPage } from './pages/citizen/MyRequestsPage';
import { MissingPersonsPage } from './pages/citizen/MissingPersonsPage';
import { SheltersFinderPage } from './pages/citizen/SheltersFinderPage';
import { CitizenAlertsPage } from './pages/citizen/CitizenAlertsPage';

// Command Center Pages
import { CommandDashboard } from './pages/command/CommandDashboard';
import { IncidentsListPage } from './pages/command/IncidentsListPage';
import { CommandMapPage } from './pages/command/CommandMapPage';
import { SmartDispatchPage } from './pages/command/SmartDispatchPage';
import { TeamsManagementPage } from './pages/command/TeamsManagementPage';
import { SheltersManagementPage } from './pages/command/SheltersManagementPage';
import { InventoryLogisticsPage } from './pages/command/InventoryLogisticsPage';
import { AlertsCenterPage } from './pages/command/AlertsCenterPage';
import { AnalyticsWorkspacePage } from './pages/command/AnalyticsWorkspacePage';
import { AuditLogsPage } from './pages/command/AuditLogsPage';
import { ThermalReconPortal } from './pages/command/ThermalReconPortal';

// Responder Pages
import { ResponderDashboard } from './pages/responder/ResponderDashboard';
import { MissionsListPage } from './pages/responder/MissionsListPage';
import { TeamStatusPage } from './pages/responder/TeamStatusPage';
import { EquipmentChecklistPage } from './pages/responder/EquipmentChecklistPage';
import { MissionHistoryPage } from './pages/responder/MissionHistoryPage';

// Shelter Manager Pages
import { ShelterDashboard } from './pages/shelter/ShelterDashboard';
import { CapacityManagerPage } from './pages/shelter/CapacityManagerPage';
import { ShelterSuppliesPage } from './pages/shelter/ShelterSuppliesPage';
import { ShelterRegistrationsPage } from './pages/shelter/ShelterRegistrationsPage';

export const App: React.FC = () => {
  const location = useLocation();

  const isPublicStandalone = [
    '/',
    '/about',
    '/features',
    '/safety',
    '/emergency-resources',
    '/login',
    '/register',
  ].includes(location.pathname);

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col font-sans">
      {/* Top Demo Simulation Banner (Always visible for testing & evaluation) */}
      <SimulationBanner />

      {/* Top 68px Command Header */}
      <TopCommandBar />

      {isPublicStandalone ? (
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/safety" element={<SafetyPage />} />
            <Route path="/emergency-resources" element={<EmergencyResourcesPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      ) : (
        /* Operational EOC Workspace Layout: 250px Left Sidebar + Responsive Main Grid */
        <div className="flex-1 flex overflow-hidden">
          {location.pathname !== '/command/dashboard' && <LeftSidebar />}

          <main className={`flex-1 overflow-y-auto bg-[#0A0B0E] ${location.pathname === '/command/dashboard' ? 'p-0' : 'p-4 md:p-6'}`}>
            <Routes>
              {/* Citizen Routes */}
              <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
              <Route path="/citizen/report" element={<EmergencyReportPage />} />
              <Route path="/citizen/requests" element={<MyRequestsPage />} />
              <Route path="/citizen/requests/:id" element={<MyRequestsPage />} />
              <Route path="/citizen/missing-person" element={<MissingPersonsPage />} />
              <Route path="/citizen/shelters" element={<SheltersFinderPage />} />
              <Route path="/citizen/alerts" element={<CitizenAlertsPage />} />

              {/* Command Center Routes */}
              <Route path="/command/dashboard" element={<CommandDashboard />} />
              <Route path="/command/incidents" element={<IncidentsListPage />} />
              <Route path="/command/incidents/:id" element={<IncidentsListPage />} />
              <Route path="/command/map" element={<CommandMapPage />} />
              <Route path="/command/dispatch" element={<SmartDispatchPage />} />
              <Route path="/command/teams" element={<TeamsManagementPage />} />
              <Route path="/command/shelters" element={<SheltersManagementPage />} />
              <Route path="/command/inventory" element={<InventoryLogisticsPage />} />
              <Route path="/command/alerts" element={<AlertsCenterPage />} />
              <Route path="/command/analytics" element={<AnalyticsWorkspacePage />} />
              <Route path="/command/audit" element={<AuditLogsPage />} />
              <Route path="/command/thermal-recon" element={<ThermalReconPortal />} />

              {/* Responder Routes */}
              <Route path="/responder/dashboard" element={<ResponderDashboard />} />
              <Route path="/responder/missions" element={<MissionsListPage />} />
              <Route path="/responder/missions/:id" element={<MissionsListPage />} />
              <Route path="/responder/team" element={<TeamStatusPage />} />
              <Route path="/responder/equipment" element={<EquipmentChecklistPage />} />
              <Route path="/responder/history" element={<MissionHistoryPage />} />

              {/* Shelter Manager Routes */}
              <Route path="/shelter/dashboard" element={<ShelterDashboard />} />
              <Route path="/shelter/capacity" element={<CapacityManagerPage />} />
              <Route path="/shelter/supplies" element={<ShelterSuppliesPage />} />
              <Route path="/shelter/registrations" element={<ShelterRegistrationsPage />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/command/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      )}
    </div>
  );
};
