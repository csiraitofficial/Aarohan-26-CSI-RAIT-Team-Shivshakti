import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Bell, Search, ChevronDown, User, Lock, FileText, LogOut, X, AlertTriangle, ShieldCheck, Activity, Users } from 'lucide-react';

export default function TopBar({ activeTab, setActiveTab, navHistory = [] }) {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const notifRef = useRef(null);
    const profileRef = useRef(null);

    const [notifications] = useState([
        { id: 1, type: 'critical', message: 'Gate 3 congestion detected', zone: 'North Stand', time: '2 min ago', icon: AlertTriangle },
        { id: 2, type: 'warning', message: 'Authority deployed to Zone B', zone: 'East Wing', time: '5 min ago', icon: ShieldCheck },
        { id: 3, type: 'critical', message: 'Critical crowd density alert', zone: 'South Gate', time: '8 min ago', icon: Activity },
        { id: 4, type: 'info', message: 'System backup completed', zone: 'System', time: '15 min ago', icon: Activity },
        { id: 5, type: 'warning', message: 'Entry flow overload at Gate 2', zone: 'West Wing', time: '20 min ago', icon: Users },
    ]);

    const unreadCount = notifications.length;

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
            if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleBack = () => {
        if (navHistory.length > 1) {
            setActiveTab(navHistory[navHistory.length - 2]);
        }
    };

    const getNotifColor = (type) => {
        if (type === 'critical') return 'bg-red-500';
        if (type === 'warning') return 'bg-orange-500';
        return 'bg-blue-500';
    };

    const getNotifBorder = (type) => {
        if (type === 'critical') return 'border-l-red-500';
        if (type === 'warning') return 'border-l-orange-500';
        return 'border-l-blue-500';
    };

    const TAB_LABELS = {
        'crowd': 'Manage Crowd',
        'command-center': 'Command Center',
        'zoneconfig': 'Zone Config',
        'zoneassign': 'Zone Assignment',
        'users': 'User Management',
        'settings': 'System Settings',
        'incidents': 'Incidents',
        'predictions': 'AI Predictions',
        'venue': 'Venue Setup',
    };

    return (
        <div className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0 shadow-sm z-20">
            {/* Left: Back + Breadcrumb */}
            <div className="flex items-center gap-4">
                <button
                    onClick={handleBack}
                    disabled={navHistory.length <= 1}
                    className="flex items-center gap-1.5 text-sm font-bold text-gray-400 hover:text-[#002868] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Back</span>
                </button>
                <div className="h-5 w-px bg-gray-200 hidden sm:block"></div>
                <span className="text-sm font-black text-[#002868] uppercase tracking-wider hidden sm:block">
                    {TAB_LABELS[activeTab] || 'Dashboard'}
                </span>
            </div>

            {/* Center: Search */}
            <div className="flex-1 max-w-md mx-4 hidden md:block">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search zones, authorities, incidents, users..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                            <X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
                        </button>
                    )}
                </div>
            </div>

            {/* Right: Notifications + Profile */}
            <div className="flex items-center gap-3">
                {/* Mobile Search Toggle */}
                <button onClick={() => setShowSearch(!showSearch)} className="md:hidden p-2 text-gray-400 hover:text-[#002868] transition-colors">
                    <Search className="w-5 h-5" />
                </button>

                {/* Notification Bell */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
                        className="relative p-2 text-gray-400 hover:text-[#002868] transition-colors"
                    >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 top-12 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                            <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                                <h4 className="font-black text-[#002868] text-sm uppercase tracking-wider">Alerts</h4>
                                <span className="text-[10px] font-black text-white bg-red-500 px-2 py-0.5 rounded-full">{unreadCount} NEW</span>
                            </div>
                            <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                                {notifications.map((notif) => {
                                    const Icon = notif.icon;
                                    return (
                                        <div key={notif.id} className={`p-4 hover:bg-gray-50/50 transition-colors border-l-4 ${getNotifBorder(notif.type)} cursor-pointer`}>
                                            <div className="flex items-start gap-3">
                                                <div className={`w-8 h-8 rounded-lg ${getNotifColor(notif.type)} bg-opacity-10 flex items-center justify-center shrink-0 mt-0.5`}>
                                                    <Icon className={`w-4 h-4 ${notif.type === 'critical' ? 'text-red-500' : notif.type === 'warning' ? 'text-orange-500' : 'text-blue-500'}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-gray-800 leading-snug">{notif.message}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{notif.zone}</span>
                                                        <span className="text-gray-300">•</span>
                                                        <span className="text-[10px] font-bold text-gray-400">{notif.time}</span>
                                                    </div>
                                                </div>
                                                <div className={`w-2 h-2 rounded-full ${getNotifColor(notif.type)} shrink-0 mt-2`}></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="p-3 border-t border-gray-50 text-center">
                                <button className="text-[11px] font-black text-[#00AEEF] uppercase tracking-widest hover:text-[#002868] transition-colors">
                                    View All Alerts
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
                        className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00AEEF] to-blue-600 text-white flex items-center justify-center text-xs font-black shadow-sm">
                            AD
                        </div>
                        <div className="hidden sm:block text-left">
                            <p className="text-xs font-black text-gray-800 leading-none">System Admin</p>
                            <p className="text-[10px] font-bold text-gray-400 leading-none mt-0.5">Level 5</p>
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
                    </button>

                    {showProfile && (
                        <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                            <div className="p-4 border-b border-gray-50">
                                <p className="text-sm font-black text-gray-800">System Admin</p>
                                <p className="text-xs font-medium text-gray-400 mt-0.5">admin@troublefree.ai</p>
                            </div>
                            <div className="py-2">
                                {[
                                    { icon: User, label: 'Admin Profile' },
                                    { icon: Lock, label: 'Change Password' },
                                    { icon: FileText, label: 'System Logs' },
                                ].map((item) => (
                                    <button key={item.label} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-[#002868] transition-colors">
                                        <item.icon className="w-4 h-4 text-gray-400" />
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                            <div className="border-t border-gray-50 py-2">
                                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors">
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
