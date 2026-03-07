import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layout & Design
import DashboardLayout from './components/layout/DashboardLayout';

// Auth & Landing Pages
import LandingPage from './LandingPage';
import Login from './pages/Login';
import Signup from './Signup.jsx';
import SignupAuthority from './SignupAuthority.jsx';

// Admin Dashboard & Pages
import AdminDashboard from './components/admin/AdminDashboard';
import ManageCrowd from './components/admin/ManageCrowd';
import ZoneConfig from './components/admin/ZoneConfig';
import ZoneAssignment from './components/admin/ZoneAssignment';
import UserManagement from './components/admin/UserManagement';
import SystemSettings from './components/admin/SystemSettings';
import IncidentManagement from './components/admin/IncidentManagement';
import AIPredictions from './components/admin/AIPredictions';
import VenueSetup from './components/admin/VenueSetup';
import VenueConfigPanel from './components/admin/VenueConfigPanel';

// Authority Dashboard & Pages
import AuthorityDashboard from './authority-dashboard/pages/AuthorityDashboard';
import AlertsDashboard from './authority-dashboard/pages/AlertsDashboard';
import ZonesDashboard from './authority-dashboard/pages/ZonesDashboard';
import CrowdFlowDashboard from './authority-dashboard/pages/CrowdFlowDashboard';
import ReportsDashboard from './authority-dashboard/pages/ReportsDashboard';
import ProfileDashboard from './authority-dashboard/pages/ProfileDashboard';

// Public Dashboard & Pages
import { DashboardProvider } from './public-dashboard/context/DashboardContext';
import OverviewPage from './public-dashboard/pages/OverviewPage';
import LiveMapPage from './public-dashboard/pages/LiveMapPage';
import AlertsPage from './public-dashboard/pages/AlertsPage';
import SafeRoutePage from './public-dashboard/pages/SafeRoutePage';
import WaitTimesPage from './public-dashboard/pages/WaitTimesPage';
import HelpCenter from './public-dashboard/pages/HelpCenter';
import About from './public-dashboard/pages/About';

function App() {
  return (
    <AuthProvider>
      <Router>
        <DashboardProvider>
          <Routes>
            {/* Public Landing & Auth */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signup-authority" element={<SignupAuthority />} />

            {/* Admin Protected Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="map" element={<ManageCrowd />} />
              <Route path="predictions" element={<AIPredictions />} />
              <Route path="incidents" element={<IncidentManagement />} />
              <Route path="zones" element={<ZoneConfig />} />
              <Route path="deployment" element={<ZoneAssignment />} />
              <Route path="analytics" element={<AdminDashboard />} /> {/* Placeholder to avoid errors */}
              <Route path="users" element={<UserManagement />} />
              <Route path="settings" element={<SystemSettings />} />
              <Route path="setup" element={<VenueSetup />} />
              <Route path="venue-config" element={<VenueConfigPanel />} />
            </Route>

            {/* Authority Protected Routes */}
            <Route
              path="/authority"
              element={
                <ProtectedRoute allowedRoles={['authority', 'admin']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AuthorityDashboard />} />
              <Route path="alerts" element={<AlertsDashboard />} />
              <Route path="flow" element={<CrowdFlowDashboard />} />
              <Route path="zones" element={<ZonesDashboard />} />
              <Route path="reports" element={<ReportsDashboard />} />
              <Route path="profile" element={<ProfileDashboard />} />
              <Route path="status" element={<AuthorityDashboard />} /> {/* Placeholder */}
              <Route path="safe-route" element={<SafeRoutePage />} />
            </Route>

            {/* Public Dashboard Protected Routes */}
            <Route
              path="/public"
              element={
                <ProtectedRoute allowedRoles={['public', 'authority', 'admin']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<OverviewPage />} />
              <Route path="map" element={<LiveMapPage />} />
              <Route path="alerts" element={<AlertsPage />} />
              <Route path="routes" element={<SafeRoutePage />} />
              <Route path="waittimes" element={<WaitTimesPage />} />
              <Route path="help" element={<HelpCenter />} />
              <Route path="about" element={<About />} />
            </Route>

            {/* Catch-all Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </DashboardProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
