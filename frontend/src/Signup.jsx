import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import API_BASE_URL from './config';
import logo from './assets/logo.png';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'public' // Default for this page
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { loginUser } = useAuth();
  const navigate = useNavigate();

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
        // Redirect to public dashboard
        navigate('/public');
      } else {
        setError(data.message || 'Registration failed.');
      }
    } catch (err) {
      setError('An error occurred. Make sure backend is running.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-bgMain px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-10 border-t-8 border-secondary">

        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="TroubleFree AI Logo" className="h-20 mb-4 object-contain" />
          <h1 className="text-2xl font-bold text-primary tracking-tight">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Join for real-time crowd safety alerts</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm text-center font-bold">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-widest">Full Name</label>
            <input
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-secondary outline-none transition-all"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-widest">Email Address</label>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-secondary outline-none transition-all"
              placeholder="user@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-widest">Password</label>
            <input
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-secondary outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 mt-2 bg-secondary text-white font-bold rounded-lg hover:bg-secondary/90 transition shadow-lg uppercase tracking-widest ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-600">Already have an account?</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link to="/login" className="text-primary font-bold hover:underline">Log in here</Link>
            <span className="text-gray-300">|</span>
            <Link to="/" className="text-gray-500 font-bold hover:underline">Back to Landing</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
