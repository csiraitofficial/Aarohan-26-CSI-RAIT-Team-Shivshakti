import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Menu,
    Search,
    Bell,
    ChevronLeft,
    User,
    LogOut,
    Settings,
    X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UnifiedTopBar = ({ toggleSidebar, title, description }) => {
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    // Mock Notifications for design UI demonstration
    const notifications = [
        { id: 1, type: 'critical', msg: 'Zone 4 Congestion Detected', time: '2m ago' },
        { id: 2, type: 'warning', msg: 'Surge predicted in South Gate', time: '10m ago' },
        { id: 3, type: 'info', msg: 'Authority deployment updated', time: '1h ago' },
    ];

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-white/90">
            <div className="flex items-center gap-4">
                {/* Mobile Toggle */}
                <button
                    onClick={toggleSidebar}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors text-primary"
                >
                    <Menu size={24} />
                </button>

                {/* Back Button (Only if not on root dashboard) */}
                {!['/admin', '/authority', '/public'].includes(location.pathname) && (
                    <button
                        onClick={handleBack}
                        className="hidden md:flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-all text-primary font-bold group"
                    >
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs uppercase tracking-widest">Back</span>
                    </button>
                )}

                <div className="hidden sm:block ml-2 border-l border-gray-100 pl-6">
                    <h2 className="font-bold text-primary text-xl tracking-tight leading-none mb-1">
                        {title || 'Dashboard'}
                    </h2>
                    {description && (
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest leading-none">
                            {description}
                        </p>
                    )}
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-2 md:gap-4">
                {/* Global Search */}
                <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 w-64 focus-within:border-secondary focus-within:ring-1 focus-within:ring-secondary transition-all">
                    <Search size={18} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search analytics..."
                        className="ml-3 bg-transparent outline-none w-full text-sm font-medium text-slate-700"
                    />
                </div>

                {/* Notification Bell */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all relative group"
                    >
                        <Bell size={20} className="text-slate-600 group-hover:scale-110 transition-transform" />
                        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-critical border-2 border-white rounded-full"></span>
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 overflow-hidden transform animate-fade-in">
                            <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <span className="font-bold text-xs text-primary uppercase tracking-widest">Recent Alarms</span>
                                <span className="text-[10px] text-secondary font-bold hover:underline cursor-pointer">Mark all read</span>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.map(n => (
                                    <div key={n.id} className="px-4 py-4 hover:bg-gray-50 transition-colors flex gap-4 cursor-pointer group">
                                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.type === 'critical' ? 'bg-critical' : n.type === 'warning' ? 'bg-warning' : 'bg-secondary'
                                            }`}></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-slate-800 leading-tight group-hover:text-primary transition-colors">{n.msg}</p>
                                            <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-wider">{n.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-3 bg-gray-50 text-center">
                                <button className="text-xs font-bold text-primary uppercase tracking-widest hover:text-secondary transition-colors">View All Notifications</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowProfile(!showProfile)}
                        className="flex items-center gap-3 p-1 pr-3 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-100 transition-all group"
                    >
                        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:bg-secondary transition-all">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="text-left hidden md:block">
                            <p className="text-xs font-bold text-slate-800 leading-none mb-0.5">{user?.name || 'User'}</p>
                            <p className="text-[9px] font-bold text-secondary uppercase tracking-wider">{user?.role || 'Visitor'}</p>
                        </div>
                    </button>

                    {showProfile && (
                        <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50 overflow-hidden transform animate-fade-in">
                            <div className="px-4 py-2 border-b border-gray-100 pb-3 mb-2">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Signed in as</p>
                                <p className="text-sm font-bold text-slate-800 truncate">{user?.email}</p>
                            </div>
                            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-gray-50 hover:text-primary transition-all">
                                <User size={18} /> My Profile
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-gray-50 hover:text-primary transition-all">
                                <Settings size={18} /> Account Settings
                            </button>
                            <div className="my-2 border-t border-gray-100 mx-2"></div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-critical hover:bg-critical/5 transition-all text-left"
                            >
                                <LogOut size={18} /> Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default UnifiedTopBar;
