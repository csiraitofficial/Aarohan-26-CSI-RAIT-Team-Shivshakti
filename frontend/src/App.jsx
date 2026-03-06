import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import Admin Dashboard directly
import AdminDashboard from './components/admin/AdminDashboard';

// Commenting out missing imports to prevent Vite crashes during UI development
// import PublicDashboard from './components/public/PublicDashboard';
// import AuthorityDashboard from './components/authority/AuthorityDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Force Admin Dashboard to load by default on the root path */}
        <Route path="/" element={<AdminDashboard />} />

        {/* Catch-all route: Redirects any unknown or error page back to the Admin Dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
