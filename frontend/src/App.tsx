import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { TopCommandBar } from './components/TopCommandBar';
import { LeftSidebar } from './components/LeftSidebar';
import { BackgroundMusicPlayer } from './components/BackgroundMusicPlayer';
import { useAuth } from './context/AuthContext';

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

/** Guard: redirect unauthenticated users to /login */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#07090D]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-volt border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-400 font-mono text-sm uppercase tracking-widest">
            Authenticating...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// The full authenticated workspace layout (sidebar + main)
const WorkspaceLayout: React.FC<{ children: React.ReactNode; fullscreen?: boolean }> = ({
  children,
  fullscreen,
}) => (
  <div className="flex-1 flex overflow-hidden">
    {!fullscreen && <LeftSidebar />}
    <main
      className={`flex-1 overflow-y-auto bg-[#0A0B0E] ${
        fullscreen ? 'p-0' : 'p-3 md:p-6 pt-14 md:pt-6'
      }`}
    >
      {children}
    </main>
  </div>
);

export const App: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Paths that use a standalone full-screen layout (no sidebar/topbar)
  const normalizedPath = location.pathname.replace(/\/+$/, '') || '/';
  const isPublicPage = [
    '/',
    '/index.html',
    '/about',
    '/features',
    '/safety',
    '/emergency-resources',
    '/login',
    '/register',
  ].includes(normalizedPath);

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col font-sans">
      {/* Background Audio Ambient Player with 1-click toggle */}
      <BackgroundMusicPlayer />

      {/* Top command bar only on authenticated workspace */}
      {!isPublicPage && user && <TopCommandBar />}

      <Routes>
        {/* Public standalone pages — full screen, no sidebar */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/index.html" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/safety" element={<SafetyPage />} />
        <Route path="/emergency-resources" element={<EmergencyResourcesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<LoginPage />} />

        {/* Citizen Routes */}
        <Route
          path="/citizen/dashboard"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <CitizenDashboard />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/citizen/report"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <EmergencyReportPage />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/citizen/requests"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <MyRequestsPage />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/citizen/requests/:id"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <MyRequestsPage />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/citizen/missing-person"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <MissingPersonsPage />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/citizen/shelters"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <SheltersFinderPage />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/citizen/alerts"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <CitizenAlertsPage />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />

        {/* Command Center Routes */}
        <Route
          path="/command/dashboard"
          element={
            <ProtectedRoute>
              <WorkspaceLayout fullscreen>
                <CommandDashboard />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/command/incidents"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <IncidentsListPage />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/command/incidents/:id"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <IncidentsListPage />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/command/map"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <CommandMapPage />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/command/dispatch"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <SmartDispatchPage />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/command/teams"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <TeamsManagementPage />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/command/shelters"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <SheltersManagementPage />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/command/inventory"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <InventoryLogisticsPage />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/command/alerts"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <AlertsCenterPage />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/command/analytics"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <AnalyticsWorkspacePage />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/command/audit"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <AuditLogsPage />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/command/thermal-recon"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <ThermalReconPortal />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />

        {/* Responder Routes */}
        <Route
          path="/responder/dashboard"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <ResponderDashboard />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/responder/missions"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <MissionsListPage />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/responder/missions/:id"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <MissionsListPage />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/responder/team"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <TeamStatusPage />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/responder/equipment"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <EquipmentChecklistPage />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/responder/history"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <MissionHistoryPage />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />

        {/* Shelter Manager Routes */}
        <Route
          path="/shelter/dashboard"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <ShelterDashboard />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/shelter/capacity"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <CapacityManagerPage />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/shelter/supplies"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <ShelterSuppliesPage />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/shelter/registrations"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <ShelterRegistrationsPage />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />

        {/* Fallback for unknown paths → ALWAYS redirect to Landing Page (/) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};
