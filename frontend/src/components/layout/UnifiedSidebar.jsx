import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Map,
    BrainCircuit,
    AlertTriangle,
    Settings,
    Users,
    PieChart,
    ShieldAlert,
    MapPin,
    Navigation,
    Activity,
    LogOut,
    ChevronRight,
    Menu,
    X,
    HelpCircle,
    Bell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

const UnifiedSidebar = ({ isOpen, toggleSidebar }) => {
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    const menuConfigs = {
        admin: [
            { name: 'Command Center', icon: <LayoutDashboard size={20} />, path: '/admin' },
            { name: 'Live Crowd Map', icon: <Map size={20} />, path: '/admin/map' },
            { name: 'AI Predictions', icon: <BrainCircuit size={20} />, path: '/admin/predictions' },
            { name: 'Incidents', icon: <AlertTriangle size={20} />, path: '/admin/incidents' },
            { name: 'Zone Configuration', icon: <Settings size={20} />, path: '/admin/zones' },
            { name: 'Authority Deployment', icon: <ShieldAlert size={20} />, path: '/admin/deployment' },
            { name: 'Analytics', icon: <PieChart size={20} />, path: '/admin/analytics' },
            { name: 'User Management', icon: <Users size={20} />, path: '/admin/users' },
            { name: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' },
        ],
        authority: [
            { name: 'Assigned Zones', icon: <MapPin size={20} />, path: '/authority' },
            { name: 'Live Alerts', icon: <AlertTriangle size={20} />, path: '/authority/alerts' },
            { name: 'Navigation Guidance', icon: <Navigation size={20} />, path: '/authority/flow' },
            { name: 'Deployment Status', icon: <Activity size={20} />, path: '/authority/status' },
        ],
        public: [
            { name: 'Crowd Map', icon: <LayoutDashboard size={20} />, path: '/public' },
            { name: 'Safe Routes', icon: <Navigation size={20} />, path: '/public/routes' },
            { name: 'Live Map', icon: <Map size={20} />, path: '/public/map' },
            { name: 'Alerts', icon: <Bell size={20} />, path: '/public/alerts' },
            { name: 'Help Center', icon: <HelpCircle size={20} />, path: '/public/help' },
        ]
    };

    const isPublic = user?.role === 'public';
    const currentMenu = menuConfigs[user?.role] || menuConfigs.public;

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 transition-transform duration-300 ease-in-out transform
                ${isPublic ? 'bg-white border-r border-slate-100 text-slate-600' : 'bg-primary text-white'}
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:relative lg:translate-x-0 flex flex-col shadow-2xl
            `}>
                {/* Logo Section */}
                <div className={`h-20 flex items-center justify-between px-6 border-b ${isPublic ? 'border-slate-50' : 'border-white/10'}`}>
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="TroubleFree AI" className="h-8 object-contain" />
                        <span className={`font-bold text-xl tracking-tight hidden lg:block ${isPublic ? 'text-slate-800' : 'text-white'}`}>TroubleFree AI</span>
                    </div>
                    <button onClick={toggleSidebar} className={`lg:hidden p-2 rounded-lg ${isPublic ? 'hover:bg-slate-50' : 'hover:bg-white/10'}`}>
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 custom-scrollbar">
                    <div className={`mb-4 px-2 text-[10px] font-bold uppercase tracking-[0.2em] ${isPublic ? 'text-slate-400' : 'text-white/30'}`}>
                        Main Menu
                    </div>
                    {currentMenu.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            end={item.path === '/admin' || item.path === '/authority' || item.path === '/public'}
                            className={({ isActive }) => `
                                flex items-center gap-4 px-4 py-3 rounded-xl transition-all group
                                ${isActive
                                    ? (isPublic ? 'bg-secondary/10 text-secondary shadow-none' : 'bg-secondary text-white shadow-lg shadow-black/10')
                                    : (isPublic ? 'text-slate-500 hover:bg-slate-50 hover:text-secondary' : 'text-white/60 hover:bg-white/5 hover:text-white')}
                            `}
                            onClick={() => {
                                if (window.innerWidth < 1024) toggleSidebar();
                            }}
                        >
                            {({ isActive }) => (
                                <>
                                    <span className={`shrink-0 transition-transform group-hover:scale-110 ${isActive
                                            ? (isPublic ? 'text-secondary' : 'text-white')
                                            : (isPublic ? 'text-slate-400 group-hover:text-secondary' : 'text-white/50 group-hover:text-white')
                                        }`}>{item.icon}</span>
                                    <span className="font-medium text-sm whitespace-nowrap">{item.name}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* User Profile / Status */}
                <div className={`p-4 border-t ${isPublic ? 'bg-slate-50/50 border-slate-100' : 'bg-black/5 border-white/10'}`}>
                    <div className={`flex items-center gap-4 p-3 rounded-xl mb-4 ${isPublic ? 'bg-white border border-slate-100' : 'bg-white/5'}`}>
                        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center font-bold text-lg shadow-inner text-white">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-bold truncate leading-tight ${isPublic ? 'text-slate-800' : 'text-white'}`}>{user?.name || 'Guest User'}</p>
                            <p className={`text-[10px] font-medium uppercase tracking-widest mt-0.5 ${isPublic ? 'text-slate-400' : 'text-white/40'}`}>{user?.role || 'Visitor'}</p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-bold text-sm ${isPublic ? 'text-slate-400 hover:bg-red-50 hover:text-red-500' : 'text-white/50 hover:bg-red-500/10 hover:text-red-400'
                            }`}
                    >
                        <LogOut size={20} />
                        LOGOUT
                    </button>
                </div>
            </aside>
        </>
    );
};

export default UnifiedSidebar;
