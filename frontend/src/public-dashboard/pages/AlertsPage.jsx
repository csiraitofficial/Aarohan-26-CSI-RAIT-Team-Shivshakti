import React, { useState } from 'react';
import { useDashboardContext } from '../context/DashboardContext';

const MiniMap = () => {
    return (
        <div className="relative w-full h-64 bg-[#F8FAFC] rounded-xl border border-gray-200 overflow-hidden flex items-center justify-center">
            {/* Mock SVG Floor Plan */}
            <svg viewBox="0 0 400 200" className="w-full h-full text-gray-300 drop-shadow-sm">
                <rect x="20" y="20" width="360" height="160" rx="10" fill="none" stroke="currentColor" strokeWidth="4" />
                
                {/* Critical Zone */}
                <rect x="80" y="50" width="100" height="100" rx="6" className="fill-red-500 animate-[pulse_2s_ease-in-out_infinite]" opacity="0.4" />
                <text x="130" y="105" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#7F1D1D">South Zone</text>
                
                {/* Safe Zone */}
                <rect x="220" y="50" width="100" height="100" rx="6" className="fill-green-500" opacity="0.3" />
                <text x="270" y="105" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#065F46">North Zone</text>

                {/* Arrow */}
                <path d="M 170 100 Q 200 80 230 100" fill="none" stroke="#10B981" strokeWidth="3" strokeDasharray="5 5" markerEnd="url(#arrowhead)" className="animate-[dash_1s_linear_infinite]" />
                <style>{`@keyframes dash { to { stroke-dashoffset: -10; } }`}</style>
                <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#10B981" />
                    </marker>
                </defs>
            </svg>
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm border border-red-100 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-xs font-bold text-red-900">93% Capacity</span>
            </div>
        </div>
    );
};

const PredictiveChart = () => {
    return (
        <div className="relative w-full h-64 bg-white rounded-xl border border-gray-200 overflow-hidden p-8 flex flex-col">
            <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-6">15-Min Predictive Forecast</h4>
            <div className="flex-1 relative w-full flex items-end mt-2">
                {/* Line Chart */}
                <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    <line x1="0" y1="0" x2="100" y2="0" stroke="#EF4444" strokeWidth="0.5" strokeDasharray="2 2" className="opacity-50" />
                    <line x1="0" y1="25" x2="100" y2="25" stroke="#E5E7EB" strokeWidth="0.5" />
                    <line x1="0" y1="50" x2="100" y2="50" stroke="#E5E7EB" strokeWidth="0.5" />
                    
                    <polyline points="0,40 20,35 40,25 60,15 80,10 100,0" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="100" cy="0" r="2.5" fill="#F59E0B" className="animate-pulse" />
                    <polygon points="0,50 0,40 20,35 40,25 60,15 80,10 100,0 100,50" fill="#F59E0B" opacity="0.05" />
                </svg>
                <div className="absolute top-0 right-0 transform translate-x-3 -translate-y-3 px-2 py-0.5 text-[10px] font-bold text-red-600 bg-red-50 rounded border border-red-100 shadow-sm">100%</div>
                <div className="absolute top-full left-0 mt-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Now</div>
                <div className="absolute top-full right-0 mt-3 text-xs font-bold text-orange-500 uppercase tracking-widest">+15m</div>
            </div>
        </div>
    );
};

export default function AlertsPage() {
    const { alerts } = useDashboardContext();
    const [expandedAlert, setExpandedAlert] = useState(null);

    const criticalCount = alerts.filter(a => a.type === 'Critical').length;
    const warningCount = alerts.filter(a => a.type === 'Warning').length;
    const resolvedCount = alerts.filter(a => a.type === 'Resolved').length;

    const formatTime = (date) => {
        return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }).format(date);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Summary Headers */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
                    <span className="text-4xl font-black text-red-600 mb-1">{criticalCount}</span>
                    <span className="text-sm font-bold text-red-800 uppercase tracking-wide">Critical</span>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
                    <span className="text-4xl font-black text-orange-600 mb-1">{warningCount}</span>
                    <span className="text-sm font-bold text-orange-800 uppercase tracking-wide">Warnings</span>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
                    <span className="text-4xl font-black text-gray-600 mb-1">{resolvedCount}</span>
                    <span className="text-sm font-bold text-gray-800 uppercase tracking-wide">Resolved</span>
                </div>
            </div>

            {/* Categorized Feed */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-[#002868]">Live Safety Broadcasts</h2>
                    <div className="flex items-center gap-2">
                        <span className="flex h-2.5 w-2.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981]"></span>
                        </span>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Syncing</span>
                    </div>
                </div>

                <div className="divide-y divide-gray-100">
                    {alerts.map(alert => {
                        let config = { border: 'border-l-gray-400', bg: 'bg-white', icon: null, text: 'text-gray-900' };
                        
                        if (alert.type === 'Critical') {
                            config = { border: 'border-l-[#EF4444]', bg: 'bg-red-50/30', text: 'text-red-900' };
                            config.icon = <svg className="w-6 h-6 text-[#EF4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>;
                        } else if (alert.type === 'Warning') {
                            config = { border: 'border-l-[#F59E0B]', bg: 'bg-orange-50/30', text: 'text-orange-900' };
                            config.icon = <svg className="w-6 h-6 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>;
                        } else {
                            config.icon = <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
                        }

                        const isExpanded = expandedAlert === alert.id;
                        const expandedBgStyle = isExpanded ? config.bg.replace('/30', '') : config.bg;

                        return (
                            <div key={alert.id} className={`p-6 border-l-4 ${config.border} ${expandedBgStyle} transition-colors hover:bg-gray-50`}>
                                <div className="flex gap-4">
                                    <div className="shrink-0 mt-1">{config.icon}</div>
                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                                            <h3 className={`font-bold ${config.text} text-lg leading-tight`}>{alert.title}</h3>
                                            <span className="text-xs font-semibold text-gray-500 whitespace-nowrap bg-white px-2 py-1 rounded border border-gray-100">{formatTime(alert.time)}</span>
                                        </div>
                                        <p className="text-gray-600 text-sm leading-relaxed mb-4">{alert.message}</p>
                                        
                                        {alert.type !== 'Resolved' && (
                                            <div>
                                                <button 
                                                    onClick={() => setExpandedAlert(isExpanded ? null : alert.id)}
                                                    className="text-sm font-bold text-[#002868] hover:text-[#00AEEF] transition-colors flex items-center gap-1"
                                                >
                                                    {isExpanded ? 'Hide Details' : 'View Details'}
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-4 h-4 shrink-0 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                                                        <polyline points="6 9 12 15 18 9"></polyline>
                                                    </svg>
                                                </button>

                                                {isExpanded && (
                                                    <div className="mt-6 border-t border-gray-100/50 pt-6 animate-in slide-in-from-top-2 duration-200">
                                                        {alert.type === 'Critical' ? <MiniMap /> : <PredictiveChart />}
                                                        
                                                        <div className="mt-6 flex flex-wrap gap-3">
                                                            <button className="px-5 py-2.5 bg-[#002868] text-white text-sm font-bold rounded-lg shadow hover:bg-[#001f52] transition-colors flex items-center gap-2">
                                                                View on Live Map
                                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"></path></svg>
                                                            </button>
                                                            <button className="px-5 py-2.5 bg-[#FF6B35] text-white text-sm font-bold rounded-lg shadow hover:bg-[#e65a2a] transition-colors">
                                                                Trigger PA Announcement
                                                            </button>
                                                            <button className="px-5 py-2.5 bg-gray-100 text-[#002868] hover:bg-gray-200 border border-gray-200 text-sm font-bold rounded-lg transition-colors">
                                                                Dispatch Staff
                                                            </button>
                                                            <button className="px-5 py-2.5 bg-transparent text-gray-500 hover:text-green-600 hover:bg-green-50 border border-transparent hover:border-green-200 text-sm font-bold rounded-lg transition-colors ml-auto mr-0">
                                                                Mark as Resolved
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
