import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 1. IMPORT YOUR PAGES
// We are bringing in the UI files you just built.
import LandingPage from './LandingPage';
import Login from './Login';
import Signup from './Signup';
import SignupAuthority from './SignupAuthority';

// 2. CREATE PLACEHOLDERS FOR YOUR TEAMMATES
// Your team hasn't built these yet, so we just make quick fake pages so the links don't crash.
const AdminDashboard = () => <div className="p-10 text-center text-3xl font-bold">Admin Dashboard Placeholder</div>;
const AuthorityDashboard = () => <div className="p-10 text-center text-3xl font-bold">Authority Dashboard Placeholder</div>;
const PublicDashboard = () => <div className="p-10 text-center text-3xl font-bold text-green-500">Public Dashboard Placeholder</div>;

// 3. THE TRAFFIC COP (The main App component)
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* If the URL is exactly "/", show the LandingPage component */}
        <Route path="/" element={<LandingPage />} />
        
        {/* If the URL is "/login", clear the screen and show the Login component */}
        <Route path="/login" element={<Login />} />
        
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup-authority" element={<SignupAuthority />} />
        
        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<PublicDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/authority-dashboard" element={<AuthorityDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;