import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft } from 'lucide-react';
import logo from '../assets/logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Update global auth state
        loginUser(data);

        // Redirect based on role
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else if (data.user.role === 'authority') {
          navigate('/authority');
        } else {
          navigate('/public');
        }
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An error occurred. Please make sure the backend is running.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-bg-main px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-10 border-t-8 border-primary relative overflow-hidden">

        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16"></div>

        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="absolute left-6 top-10 p-2 hover:bg-gray-100 rounded-lg text-primary transition-all group z-10"
          title="Back to Landing"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </button>

        <div className="flex justify-center mb-8 relative">
          <img src={logo} alt="TroubleFree AI Logo" className="h-20 object-contain" />
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center font-bold animate-shake">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-black text-primary mb-2 uppercase tracking-widest">Official Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all font-medium"
              placeholder="officer@dept.gov.in"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-primary mb-2 uppercase tracking-widest">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all font-medium"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 bg-primary text-white font-black rounded-lg hover:bg-primary/90 transition shadow-lg uppercase tracking-widest active:scale-[0.98] ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Verifying...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Don't have an account?</p>
          <div className="flex justify-center gap-4 mt-1">
            <Link to="/signup" className="text-primary font-black hover:underline tracking-tight">Public Sign Up</Link>
            <span className="text-gray-300">|</span>
            <Link to="/signup-authority" className="text-secondary font-black hover:underline tracking-tight">Apply for Verification</Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;