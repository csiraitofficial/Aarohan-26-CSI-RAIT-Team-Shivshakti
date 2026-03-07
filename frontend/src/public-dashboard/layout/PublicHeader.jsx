import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useDashboardContext } from '../context/DashboardContext';

export default function PublicHeader() {
    const { alerts } = useDashboardContext();
    const location = useLocation();
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    const getPageTitle = () => {
        switch (location.pathname) {
            case '/': return 'Overview';
            case '/map': return 'Live Map';
            case '/alerts': return 'Safety Alerts';
            case '/routes': return 'Safe Routes';
            case '/waittimes': return 'Estimated Wait Times';
            case '/help': return 'Help Center';
            case '/about': return 'About';
            default: return 'Overview';
        }
    };

    const unreadAlerts = alerts.filter(a => a.type === 'Critical' || a.type === 'Warning').length;

    return (
        <header className="w-full h-16 bg-[#002868] text-white flex items-center justify-between px-4 lg:px-6 shadow-md z-20 shrink-0">
            {/* Left: Title */}
            <div className="flex items-center gap-4 w-1/4">
                <div className="md:hidden">
                    <button className="p-2 text-white hover:bg-white/10 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <h1 className="text-xl font-bold tracking-wide hidden sm:block whitespace-nowrap">
                    {getPageTitle()}
                </h1>
            </div>

            {/* Center: Search */}
            <div className="flex-1 max-w-xl mx-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 shrink-0 text-[#002868]/50" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search zones or locations..." 
                        className="block w-full pl-10 pr-3 py-2 border-0 rounded-full bg-white text-[#111827] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00AEEF] sm:text-sm transition-shadow"
                    />
                </div>
            </div>

            {/* Right: Status & Notification */}
            <div className="flex justify-end items-center gap-6 w-1/4">
                <div className="hidden lg:flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full border border-white/20 shrink-0">
                    <span className="relative flex h-3 w-3 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#10B981]"></span>
                    </span>
                    <span className="text-sm font-semibold tracking-wide text-[#F5F7FB]">Live System</span>
                </div>

                <div className="relative">
                    <button 
                        onClick={() => setIsNotifOpen(!isNotifOpen)}
                        className="relative p-2 text-white hover:bg-white/10 rounded-full transition-colors flex items-center justify-center shrink-0"
                    >
                        <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                        {unreadAlerts > 0 && (
                            <span className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-[#FF6B35] rounded-full border-2 border-[#002868]">
                                {unreadAlerts}
                            </span>
                        )}
                    </button>

                    {isNotifOpen && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl z-50 border border-gray-100 overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-sm font-bold text-[#002868] uppercase tracking-wider">Notifications</h3>
                                <span className="bg-[#FF6B35] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{unreadAlerts} New</span>
                            </div>
                            <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                                {alerts.filter(a => a.type === 'Critical' || a.type === 'Warning').slice(0, 3).map(alert => (
                                    <div key={alert.id} className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-l-4 border-transparent hover:border-[#002868]">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className={`text-sm font-bold ${alert.type === 'Critical' ? 'text-red-600' : 'text-orange-600'}`}>{alert.title}</h4>
                                        </div>
                                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{alert.message}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-100 p-2">
                                <Link to="/alerts" onClick={() => setIsNotifOpen(false)} className="block w-full text-center py-2 text-sm font-bold text-[#00AEEF] hover:bg-[#F0F9FF] rounded-lg transition-colors">
                                    View All Alerts
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
