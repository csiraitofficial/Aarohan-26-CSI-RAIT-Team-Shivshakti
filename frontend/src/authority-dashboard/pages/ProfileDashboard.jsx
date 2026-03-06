import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Shield, Lock, LogOut, CheckCircle, MapPin, Briefcase } from 'lucide-react';

const ProfileDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="space-y-6">
            <header className="mb-4">
                <div className="flex justify-between items-center w-full">
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 tracking-tight uppercase">Authority Profile</h1>
                        <p className="text-[10px] font-medium text-slate-400 mt-1 tracking-wider uppercase">Manage your command node access and credentials.</p>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto w-full">
                <div className="card-base !p-0 overflow-hidden hover:border-slate-200 group">
                    {/* Profile Header Banner */}
                    <div className="h-32 bg-gradient-to-r from-primary to-secondary relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.8)_0,transparent_100%)]"></div>
                        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
                    </div>

                    <div className="px-8 pb-10 relative">
                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-2xl border-4 border-white bg-slate-50 shadow-xl absolute -top-12 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 duration-300">
                            <div className="flex items-center justify-center w-full h-full bg-slate-100 text-slate-400">
                                <User size={48} strokeWidth={1.5} />
                            </div>
                        </div>

                        <div className="mt-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Officer John Doe</h2>
                                <div className="flex items-center gap-2">
                                    <span className="text-secondary font-bold text-xs uppercase tracking-widest">Command Node Operator</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                    <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Node ID: AUTH-2026-X94J</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1.5 rounded-xl">
                                <CheckCircle size={14} className="animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Active Duty</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-10 pt-8 border-t border-slate-50">
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 mt-1">
                                        <Briefcase size={14} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Department</p>
                                        <p className="text-sm font-bold text-slate-700">Crowd Safety & Emergency Response</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 mt-1">
                                        <MapPin size={14} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Primary Jurisdiction</p>
                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                            {['Gate A', 'Gate B', 'Food Court', 'Main Arena'].map(zone => (
                                                <span key={zone} className="bg-slate-50 text-slate-500 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight hover:bg-white transition-colors cursor-default">
                                                    {zone}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Shield size={12} className="text-secondary" />
                                    Access Management
                                </h3>

                                <button className="w-full group flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-secondary group-hover:border-secondary/20 transition-colors">
                                            <Lock size={14} />
                                        </div>
                                        <span className="text-xs font-bold text-slate-600">Update Access Credentials</span>
                                    </div>
                                    <div className="text-slate-300 group-hover:translate-x-1 transition-transform">
                                        <svg size={16} fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg>
                                    </div>
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="w-full group flex items-center justify-between p-3 rounded-xl border border-critical/10 bg-critical/5 hover:bg-critical hover:border-critical transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white border border-critical/20 flex items-center justify-center text-critical group-hover:bg-white/20 group-hover:text-white group-hover:border-white/20 transition-all">
                                            <LogOut size={14} />
                                        </div>
                                        <span className="text-xs font-bold text-critical group-hover:text-white">End Shift & Logout</span>
                                    </div>
                                    <div className="text-critical/30 group-hover:text-white transition-colors">
                                        <LogOut size={14} />
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfileDashboard;
