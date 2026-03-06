import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Theme.css';
import Sidebar from '../components/Sidebar';

const ProfileDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="flex w-full h-full authority-dashboard-container overflow-hidden bg-gray-50">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-y-auto w-full relative">
                <header className="px-6 py-6 border-b border-gray-200 bg-white sticky top-0 z-40 shadow-sm">
                    <div className="max-w-[1600px] mx-auto w-full">
                        <h1 className="text-2xl font-black text-[var(--color-primary)] tracking-tight uppercase">Authority Profile</h1>
                        <p className="text-sm font-medium text-gray-500 mt-1">Manage your command node access and credentials.</p>
                    </div>
                </header>

                <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                        <div className="bg-[var(--color-primary)] h-32 relative">
                            {/* Decorative background */}
                            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0,transparent_100%)]"></div>
                        </div>

                        <div className="px-8 pb-8 relative">
                            {/* Avatar */}
                            <div className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-lg absolute -top-12 flex items-center justify-center overflow-hidden">
                                <span className="text-4xl">👮</span>
                            </div>

                            <div className="mt-14 flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-800">Officer John Doe</h2>
                                    <p className="text-[var(--color-secondary)] font-bold mb-4">Command Node Operator</p>
                                </div>
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase flex items-center shadow-sm">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    Active Duty
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Authority ID</p>
                                        <p className="text-gray-900 font-medium">AUTH-2026-X94J</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Department</p>
                                        <p className="text-gray-900 font-medium">Crowd Safety & Response</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Assigned Zones</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <span className="bg-gray-100 text-gray-600 px-2 py-1 flex items-center rounded text-xs font-semibold"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2"></span>Gate A</span>
                                            <span className="bg-gray-100 text-gray-600 px-2 py-1 flex items-center rounded text-xs font-semibold"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2"></span>Gate B</span>
                                            <span className="bg-gray-100 text-gray-600 px-2 py-1 flex items-center rounded text-xs font-semibold"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2"></span>Food Court</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 md:border-l border-gray-100 md:pl-8">
                                    <h3 className="text-sm font-black text-gray-700 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Account Actions</h3>
                                    <button className="w-full text-left py-3 px-4 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold text-sm transition-colors flex items-center justify-between">
                                        Change Password
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                    </button>
                                    <button onClick={handleLogout} className="w-full text-left py-3 px-4 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold text-sm transition-colors flex items-center justify-between">
                                        End Shift (Logout)
                                        <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default ProfileDashboard;
