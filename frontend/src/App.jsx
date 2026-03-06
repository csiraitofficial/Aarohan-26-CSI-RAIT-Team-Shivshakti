import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import PublicDashboard from './public-dashboard/PublicDashboard';
import AuthorityDashboard from './authority-dashboard/AuthorityDashboard';
import AdminDashboard from './admin-dashboard/AdminDashboard';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center text-2xl font-bold flex-col">
      Tailwind is working
      <div className="w-full text-base font-normal mt-4">
        <Router>
          <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
            <nav style={{ marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #ccc' }}>
              <ul style={{ listStyle: 'none', display: 'flex', gap: '20px', padding: 0, margin: 0, justifyContent: 'center' }}>
                <li><Link to="/public" style={{ textDecoration: 'none', color: '#007bff' }}>Public</Link></li>
                <li><Link to="/authority" style={{ textDecoration: 'none', color: '#007bff' }}>Authority</Link></li>
                <li><Link to="/admin" style={{ textDecoration: 'none', color: '#007bff' }}>Admin</Link></li>
              </ul>
            </nav>

            <main className="text-center">
              <Routes>
                <Route path="/public" element={<PublicDashboard />} />
                <Route path="/authority" element={<AuthorityDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/" element={<Navigate to="/public" replace />} />
              </Routes>
            </main>
          </div>
        </Router>
      </div>
    </div>
  );
}
