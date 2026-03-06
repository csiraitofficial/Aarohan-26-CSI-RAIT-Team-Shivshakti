import React from 'react';
import logo from './assets/logo.png'; 

const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-bgMain px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-10 border-t-8 border-primary">
        
        {/* ---> CHANGED: justify-center puts the logo right in the middle <--- */}
        <div className="flex justify-center mb-8">
          <img src={logo} alt="TroubleFree AI Logo" className="h-20 object-contain" /> 
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-widest">Official Email</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-secondary outline-none transition-all" 
              placeholder="officer@dept.gov.in" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-widest">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-secondary outline-none transition-all" 
              placeholder="••••••••" 
            />
          </div>
          <button className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:bg-opacity-90 transition shadow-lg uppercase tracking-widest">
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-600">Need Authority Access?</p>
          <a href="/signup-authority" className="text-secondary font-bold hover:underline">Apply for Verification</a>
        </div>
        
      </div>
    </div>
  );
};

export default Login;