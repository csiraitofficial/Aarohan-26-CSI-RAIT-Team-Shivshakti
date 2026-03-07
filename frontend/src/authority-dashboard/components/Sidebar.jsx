import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getMe } from '../../services/api';
import '../Theme.css';

const Sidebar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getMe();
                if (res.success) {
                    setUser(res.user);
                }
            } catch (err) {
                console.error("Sidebar User Fetch Error:", err);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <aside className="w-68 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col justify-between hidden md:flex">
            <div>
                <div className="p-6 border-b border-gray-200 flex items-center justify-center">
                    <div className="max-w-[200px] w-full flex items-center justify-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--color-secondary)] flex items-center justify-center shadow-md">
                            <span className="text-white font-black text-xs uppercase">TF</span>
                        </div>
                        <span className="text-lg font-black text-[var(--color-primary)] tracking-widest uppercase">Authority</span>
                    </div>
                </div>

                <nav className="p-4 space-y-2">
                    <NavLink to="/authority" end className={({ isActive }) => `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-[var(--color-secondary)] bg-opacity-10 text-[var(--color-secondary)] border border-[var(--color-secondary)] border-opacity-30' : 'text-gray-500 hover:text-[var(--color-primary)] hover:bg-gray-100'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                        <span className="font-bold text-sm uppercase tracking-wider">Dashboard</span>
                    </NavLink>
                    <NavLink to="/authority/zones" className={({ isActive }) => `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-[var(--color-secondary)] bg-opacity-10 text-[var(--color-secondary)] border border-[var(--color-secondary)] border-opacity-30' : 'text-gray-500 hover:text-[var(--color-primary)] hover:bg-gray-100'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
                        <span className="font-bold text-sm uppercase tracking-wider">Zones Monitoring</span>
                    </NavLink>
                    <NavLink to="/authority/alerts" className={({ isActive }) => `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-[var(--color-secondary)] bg-opacity-10 text-[var(--color-secondary)] border border-[var(--color-secondary)] border-opacity-30' : 'text-gray-500 hover:text-[var(--color-primary)] hover:bg-gray-100'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                        <span className="font-bold text-sm uppercase tracking-wider">Alerts</span>
                    </NavLink>
                    <NavLink to="/authority/flow" className={({ isActive }) => `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-[var(--color-secondary)] bg-opacity-10 text-[var(--color-secondary)] border border-[var(--color-secondary)] border-opacity-30' : 'text-gray-500 hover:text-[var(--color-primary)] hover:bg-gray-100'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                        <span className="font-bold text-sm uppercase tracking-wider">Crowd Flow</span>
                    </NavLink>
                    <NavLink to="/authority/reports" className={({ isActive }) => `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-[var(--color-secondary)] bg-opacity-10 text-[var(--color-secondary)] border border-[var(--color-secondary)] border-opacity-30' : 'text-gray-500 hover:text-[var(--color-primary)] hover:bg-gray-100'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        <span className="font-bold text-sm uppercase tracking-wider">Reports</span>
                    </NavLink>
                    <NavLink to="/authority/profile" className={({ isActive }) => `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-[var(--color-secondary)] bg-opacity-10 text-[var(--color-secondary)] border border-[var(--color-secondary)] border-opacity-30' : 'text-gray-500 hover:text-[var(--color-primary)] hover:bg-gray-100'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        <span className="font-bold text-sm uppercase tracking-wider">Profile</span>
                    </NavLink>
                    <button onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 w-full rounded-lg transition-colors mt-4">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        <span className="font-bold text-sm uppercase tracking-wider">Logout</span>
                    </button>
                </nav>
            </div>

            <div className="p-6 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 uppercase font-black text-xs">
                        {user ? user.name.slice(0, 2) : 'AU'}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-[var(--color-primary)] truncate uppercase">{user ? user.name : 'Unit Pending...'}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${user?.zoneAssigned ? 'bg-emerald-500' : 'bg-red-500 pulse'}`}></div>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter truncate">
                                {user?.zoneAssigned ? user.zoneAssigned.zoneName : 'Awaiting Orders'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
