import React from 'react';
import '../Theme.css';

const RouteSuggestions = ({ zones }) => {
    // Mock logic to determine a "safe route" based on density
    const safeNodes = zones ? zones.filter(z => (z.currentOccupancy / z.capacity) < 0.75) : [];

    return (
        <div className="glass-card flex flex-col h-full border-opacity-40">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                    <h2 className="text-lg font-black text-[var(--color-primary)] uppercase tracking-wide">AI Routing</h2>
                </div>
                <span className="text-[10px] font-mono text-gray-500">DIJKSTRA ON</span>
            </div>

            <div className="flex-1 flex flex-col pt-2 pb-4">
                <p className="text-xs text-gray-500 mb-4 font-medium leading-relaxed">
                    Dynamic optimal pathing generated to bypass critical density clusters.
                </p>

                {/* Abstract Path Visualization */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex-1 flex flex-col justify-center items-center relative overflow-hidden">

                    {/* The Route SVG */}
                    <svg viewBox="0 0 200 100" className="w-full h-auto drop-shadow-lg z-10">
                        <defs>
                            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#00AEEF" />
                                <stop offset="50%" stopColor="#10B981" />
                                <stop offset="100%" stopColor="#00AEEF" />
                            </linearGradient>
                        </defs>

                        {/* Background Connections (Congested) */}
                        <path d="M 20 50 Q 60 10 100 50 T 180 50" fill="none" stroke="rgba(239, 68, 68, 0.3)" strokeWidth="2" strokeDasharray="4,4" />
                        <circle cx="60" cy="30" r="4" fill="#EF4444" className="animate-pulse" />
                        <text x="60" y="20" fill="#EF4444" fontSize="8" textAnchor="middle" className="font-bold">Bypassed</text>

                        {/* Optimal Route (Safe) */}
                        <path d="M 20 50 Q 80 90 140 50 T 180 50" fill="none" stroke="url(#routeGradient)" strokeWidth="4" className="animate-[dash_2s_linear_infinite]" strokeDasharray="10,5" />

                        {/* Nodes */}
                        <circle cx="20" cy="50" r="6" fill="#00AEEF" />
                        <circle cx="80" cy="70" r="5" fill="#10B981" />
                        <circle cx="140" cy="50" r="5" fill="#10B981" />
                        <circle cx="180" cy="50" r="6" fill="#00AEEF" />

                        <text x="20" y="70" fill="var(--color-primary)" fontSize="8" textAnchor="middle">Origin</text>
                        <text x="180" y="70" fill="var(--color-primary)" fontSize="8" textAnchor="middle">Exit</text>
                    </svg>

                    <style>{`
               @keyframes dash {
                 to { stroke-dashoffset: -15; }
               }
            `}</style>
                </div>
            </div>

            <button className="w-full bg-[var(--color-primary)] hover:bg-[#1a3675] border border-[var(--color-secondary)] border-opacity-50 text-white font-bold py-3 px-4 rounded transition-all flex justify-center items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6.632l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                <span className="text-sm tracking-wider">BROADCAST ROUTE</span>
            </button>

        </div>
    );
};

export default RouteSuggestions;
