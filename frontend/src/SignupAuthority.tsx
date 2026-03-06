import React from 'react';
import logo from './assets/logo.png'; 

const SignupAuthority = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-bgMain py-12 px-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-10 border-t-8 border-accent">
        
        {/* ---> CHANGED: justify-center puts the logo right in the middle <--- */}
        <div className="flex justify-center mb-8">
          <img src={logo} alt="TroubleFree AI Logo" className="h-20 object-contain" />
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-primary uppercase">Full Name</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-secondary" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-primary uppercase">Official Email</label>
            <input type="email" className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-secondary" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-primary uppercase">Phone Number</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-secondary" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-primary uppercase">Department</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-secondary" placeholder="e.g., Mumbai Police" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-primary uppercase">Designation</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-secondary" placeholder="e.g., Sub-Inspector" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-primary uppercase">Password</label>
            <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-secondary" />
          </div>

          <div className="md:col-span-2 pt-6">
            <button className="w-full py-4 bg-accent text-white font-bold rounded-lg hover:bg-opacity-90 transition shadow-md uppercase tracking-widest">
              Submit Request for Approval
            </button>
            <p className="text-center mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
              Verification will be handled by the TroubleFree AI Admin Panel
            </p>
          </div>
        </form>
        
      </div>
    </div>
  );
};

export default SignupAuthority;