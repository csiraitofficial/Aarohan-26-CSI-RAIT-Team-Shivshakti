import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

// Authority Dashboard imports
import AuthorityDashboard from './authority-dashboard/pages/AuthorityDashboard';
import AlertsDashboard from './authority-dashboard/pages/AlertsDashboard';
import ZonesDashboard from './authority-dashboard/pages/ZonesDashboard';
import CrowdFlowDashboard from './authority-dashboard/pages/CrowdFlowDashboard';
import ReportsDashboard from './authority-dashboard/pages/ReportsDashboard';
import ProfileDashboard from './authority-dashboard/pages/ProfileDashboard';

// Admin Dashboard import
import AdminDashboard from './components/admin/AdminDashboard';

// Public Dashboard imports
import { DashboardProvider } from './public-dashboard/context/DashboardContext';
import DashboardLayout from './public-dashboard/layout/DashboardLayout';
import OverviewPage from './public-dashboard/pages/OverviewPage';
import LiveMapPage from './public-dashboard/pages/LiveMapPage';
import AlertsPage from './public-dashboard/pages/AlertsPage'
import RoutesPage from './public-dashboard/pages/RoutesPage';
import WaitTimesPage from './public-dashboard/pages/WaitTimesPage';
import HelpCenter from './public-dashboard/pages/HelpCenter';
import About from './public-dashboard/pages/About';

function App() {
  return (
    <Router>
      <DashboardProvider>
        <Routes>
          {/* Public Dashboard routes (nested under DashboardLayout) */}
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<OverviewPage />} />
            <Route path="map" element={<LiveMapPage />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="routes" element={<RoutesPage />} />
            <Route path="waittimes" element={<WaitTimesPage />} />
            <Route path="help" element={<HelpCenter />} />
            <Route path="about" element={<About />} />
          </Route>

          {/* Authority Dashboard routes */}
          <Route path="/authority" element={<AuthorityDashboard />} />
          <Route path="/authority/zones" element={<ZonesDashboard />} />
          <Route path="/authority/alerts" element={<AlertsDashboard />} />
          <Route path="/authority/flow" element={<CrowdFlowDashboard />} />
          <Route path="/authority/reports" element={<ReportsDashboard />} />
          <Route path="/authority/profile" element={<ProfileDashboard />} />

          {/* Admin Dashboard route */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DashboardProvider>
    </Router>
  );
}

export default App;
