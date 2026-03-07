import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import API_BASE_URL from './config';
import logo from './assets/logo.png';

const SignupAuthority = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    password: '',
    role: 'authority' // Fixed for this page
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        loginUser(data);
        // Redirect to authority dashboard
        navigate('/authority');
      } else {
        setError(data.message || 'Verification request failed.');
      }
    } catch (err) {
      setError('An error occurred. Make sure backend is running.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-bgMain py-12 px-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-10 border-t-8 border-accent">

        {/* ---> CHANGED: justify-center puts the logo right in the middle <--- */}
        <div className="flex justify-center mb-8">
          <img src={logo} alt="TroubleFree AI Logo" className="h-20 object-contain" />
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm text-center font-bold">
            {error}
          </div>
        )}

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-xs font-bold text-primary uppercase">Full Name</label>
            <input
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-secondary"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-primary uppercase">Official Email</label>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-secondary"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-primary uppercase">Phone Number</label>
            <input
              name="phone"
              type="text"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-secondary"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-primary uppercase">Department</label>
            <input
              name="department"
              type="text"
              required
              value={formData.department}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-secondary"
              placeholder="e.g., Mumbai Police"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-primary uppercase">Designation</label>
            <input
              name="designation"
              type="text"
              required
              value={formData.designation}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-secondary"
              placeholder="e.g., Sub-Inspector"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-primary uppercase">Password</label>
            <input
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-secondary"
            />
          </div>

          <div className="md:col-span-2 pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 bg-accent text-white font-bold rounded-lg hover:bg-accent/90 transition shadow-md uppercase tracking-widest ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Processing Request...' : 'Apply for Verification'}
            </button>
            <p className="text-center mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
              Verification will be handled by the TroubleFree AI Admin Panel
            </p>
          </div>
        </form>

        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-600">Representing a different role?</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link to="/signup" className="text-secondary font-bold hover:underline">Public Sign Up</Link>
            <span className="text-gray-300">|</span>
            <Link to="/" className="text-primary font-bold hover:underline">Back to Landing</Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SignupAuthority;