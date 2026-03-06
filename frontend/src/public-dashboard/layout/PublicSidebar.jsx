import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDashboardContext } from '../context/DashboardContext';

export default function PublicSidebar() {
    const { user } = useDashboardContext();

    const navItems = [
        { path: '/', label: 'Overview', icon: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z' },
        { path: '/map', label: 'Live Map', icon: 'M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z' },
        { path: '/alerts', label: 'Alerts', icon: 'M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z' },
        { path: '/routes', label: 'Safe Routes', icon: 'M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z' },
        { path: '/waittimes', label: 'Wait Times', icon: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z' },
        { path: '/help', label: 'Help Center', icon: 'M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z' },
        { path: '/about', label: 'About', icon: 'M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z' }
    ];

    return (
        <aside className="w-64 flex-shrink-0 border-r border-gray-200 bg-white flex flex-col hidden md:flex h-full z-10">
            <nav className="flex-1 py-6 overflow-y-auto">
                <ul className="space-y-1">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink 
                                to={item.path} 
                                className={({ isActive }) => 
                                    `flex items-center gap-3 px-6 py-3 text-[15px] font-semibold transition-colors duration-200 ${
                                        isActive 
                                        ? 'bg-[#00AEEF]/10 text-[#002868] border-l-4 border-[#FF6B35]' 
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <svg className={`w-5 h-5 shrink-0 transition-colors ${isActive ? "text-[#00AEEF]" : "text-gray-400"}`} viewBox="0 0 24 24" fill="currentColor">
                                            <path d={item.icon}/>
                                        </svg>
                                        <span className="truncate">{item.label}</span>
                                    </>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="p-4 border-t border-gray-100 flex-shrink-0">
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-200">
                    <div className="w-10 h-10 rounded-full bg-[#002868] flex items-center justify-center text-white font-bold shrink-0">
                        {user.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-[#002868] truncate">{user.name}</div>
                        <div className="text-xs text-gray-500 truncate">{user.email}</div>
                    </div>
                    <button className="text-gray-400 hover:text-red-500 p-1 shrink-0" title="Logout">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                    </button>
                </div>
            </div>
        </aside>
    );
}
