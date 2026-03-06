import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
// import PublicDashboard from './public-dashboard/PublicDashboard';
import AuthorityDashboard from './authority-dashboard/pages/AuthorityDashboard';
import AlertsDashboard from './authority-dashboard/pages/AlertsDashboard';
import ZonesDashboard from './authority-dashboard/pages/ZonesDashboard';
import CrowdFlowDashboard from './authority-dashboard/pages/CrowdFlowDashboard';
import ReportsDashboard from './authority-dashboard/pages/ReportsDashboard';
import ProfileDashboard from './authority-dashboard/pages/ProfileDashboard';
// import AdminDashboard from './admin-dashboard/AdminDashboard';

const PublicDashboard = () => <div>Public Dashboard (Currently on Authority Branch)</div>;
const AdminDashboard = () => <div>Admin Dashboard (Currently on Authority Branch)</div>;

export default function App() {
  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col bg-[var(--color-background)]">
      <Router>
        <Routes>
          <Route path="/public" element={<PublicDashboard />} />
          <Route path="/authority" element={<AuthorityDashboard />} />
          <Route path="/authority/zones" element={<ZonesDashboard />} />
          <Route path="/authority/alerts" element={<AlertsDashboard />} />
          <Route path="/authority/flow" element={<CrowdFlowDashboard />} />
          <Route path="/authority/reports" element={<ReportsDashboard />} />
          <Route path="/authority/profile" element={<ProfileDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/" element={<Navigate to="/authority" replace />} />
        </Routes>
      </Router>
    </div>
  );
}
