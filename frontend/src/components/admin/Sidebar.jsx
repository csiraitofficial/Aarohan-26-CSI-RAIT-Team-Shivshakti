import React from 'react';
import { Users, LayoutDashboard, Shield, Sliders, Monitor, AlertOctagon, Brain, MapPin, Menu, X, LayoutGrid } from 'lucide-react';
import logo from '../../assets/logo.png';

const MENU_ITEMS = [
    { id: 'command-center', label: 'Command Center', icon: Monitor },
    { id: 'crowd', label: 'Manage Crowd', icon: Users },
    { id: 'zoneconfig', label: 'Zone Config', icon: LayoutDashboard },
    { id: 'zoneassign', label: 'Zone Assignment', icon: Shield },
    { id: 'incidents', label: 'Incidents', icon: AlertOctagon },
    { id: 'predictions', label: 'AI Predictions', icon: Brain },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'venue', label: 'Venue Setup', icon: MapPin },
    { id: 'venue-config', label: 'Venue Configuration', icon: LayoutGrid },
    { id: 'settings', label: 'Settings', icon: Sliders },
];

export default function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }) {
    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-30 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed lg:relative inset-y-0 left-0 z-40
                w-64 bg-[#002868] h-full flex flex-col shrink-0 text-white shadow-xl
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Logo Header */}
                <div className="p-5 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="TroubleFree AI" className="h-12 object-contain" />
                    </div>
                    <button onClick={() => setIsOpen(false)} className="lg:hidden p-1 text-indigo-300 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4 overflow-y-auto">
                    <ul className="space-y-1 px-3">
                        {MENU_ITEMS.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;

                            return (
                                <li key={item.id}>
                                    <button
                                        onClick={() => {
                                            setActiveTab(item.id);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-bold rounded-xl transition-all duration-200
                                            ${isActive
                                                ? 'bg-white/10 shadow-inner text-white'
                                                : 'text-indigo-200 hover:text-white hover:bg-white/5'
                                            }
                                        `}
                                    >
                                        <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-[#00AEEF]' : 'text-indigo-400'}`} />
                                        {item.label}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Admin Footer */}
                <div className="p-4 bg-black/10 border-t border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00AEEF] to-blue-600 text-white flex items-center justify-center text-xs font-black shadow-md">
                            AD
                        </div>
                        <div>
                            <p className="text-xs font-bold text-white leading-none">System Admin</p>
                            <p className="text-[10px] font-medium text-indigo-300 leading-none mt-1">Level 5 Access</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
