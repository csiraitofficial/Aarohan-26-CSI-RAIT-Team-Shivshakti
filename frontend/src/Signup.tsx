import React from 'react';
import { Link } from 'react-router-dom';
import logo from './assets/logo.png';

const Signup = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-bgMain px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-10 border-t-8 border-secondary">
        
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="TroubleFree AI Logo" className="h-20 mb-4 object-contain" />
          <h1 className="text-2xl font-bold text-primary tracking-tight">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Join for real-time crowd safety alerts</p>
        </div>

        <form className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-widest">Full Name</label>
            <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-secondary outline-none transition-all" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-widest">Email Address</label>
            <input type="email" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-secondary outline-none transition-all" placeholder="user@example.com" />
          </div>
          <div>
            <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-widest">Password</label>
            <input type="password" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-secondary outline-none transition-all" placeholder="••••••••" />
          </div>
          
          <button className="w-full py-4 mt-2 bg-secondary text-white font-bold rounded-lg hover:bg-opacity-90 transition shadow-lg uppercase tracking-widest">
            Sign Up
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-600">Already have an account?</p>
          <Link to="/login" className="text-primary font-bold hover:underline">Log in here</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;