import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import AuthorityDashboard from './authority-dashboard/pages/AuthorityDashboard';
import AlertsDashboard from './authority-dashboard/pages/AlertsDashboard';
import ZonesDashboard from './authority-dashboard/pages/ZonesDashboard';
import CrowdFlowDashboard from './authority-dashboard/pages/CrowdFlowDashboard';
import ReportsDashboard from './authority-dashboard/pages/ReportsDashboard';
import ProfileDashboard from './authority-dashboard/pages/ProfileDashboard';
import AdminDashboard from './components/admin/AdminDashboard';

// Placeholder until public-dashboard branch is merged
const PublicDashboard = () => (
  <div className="flex items-center justify-center h-screen bg-gray-50">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-700">Public Dashboard</h2>
      <p className="text-gray-500 mt-2">Will be available after merging public-dashboard branch</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/public" element={<PublicDashboard />} />

        {/* Authority routes */}
        <Route path="/authority" element={<AuthorityDashboard />} />
        <Route path="/authority/zones" element={<ZonesDashboard />} />
        <Route path="/authority/alerts" element={<AlertsDashboard />} />
        <Route path="/authority/flow" element={<CrowdFlowDashboard />} />
        <Route path="/authority/reports" element={<ReportsDashboard />} />
        <Route path="/authority/profile" element={<ProfileDashboard />} />

        {/* Admin route */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
