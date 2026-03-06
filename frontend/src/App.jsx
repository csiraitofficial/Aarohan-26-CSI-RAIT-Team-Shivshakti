import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// New Architecture
import { DashboardProvider } from './public-dashboard/context/DashboardContext';
import DashboardLayout from './public-dashboard/layout/DashboardLayout';

// Pages
import OverviewPage from './public-dashboard/pages/OverviewPage';
import LiveMapPage from './public-dashboard/pages/LiveMapPage';
import AlertsPage from './public-dashboard/pages/AlertsPage';
import RoutesPage from './public-dashboard/pages/RoutesPage';
import WaitTimesPage from './public-dashboard/pages/WaitTimesPage';
import HelpCenter from './public-dashboard/pages/HelpCenter';
import About from './public-dashboard/pages/About';

export default function App() {
  return (
    <Router>
      <DashboardProvider>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<OverviewPage />} />
            <Route path="map" element={<LiveMapPage />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="routes" element={<RoutesPage />} />
            <Route path="waittimes" element={<WaitTimesPage />} />
            <Route path="help" element={<HelpCenter />} />
            <Route path="about" element={<About />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </DashboardProvider>
    </Router>
  );
}
