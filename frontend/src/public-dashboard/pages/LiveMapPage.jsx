import React, { useState } from 'react';
import { useDashboardContext } from '../context/DashboardContext';

export default function LiveMapPage() {
    const { zones, getUserLocationZone } = useDashboardContext();
    const userLocationZone = getUserLocationZone();
    const [selectedZone, setSelectedZone] = useState(null);
    const [showRouteModal, setShowRouteModal] = useState(false);
    const [isCalculating, setIsCalculating] = useState(false);
    const [routeInfo, setRouteInfo] = useState(null);

    const handleFindRoute = async () => {
        setIsCalculating(true);
        setShowRouteModal(true);
        setRouteInfo(null);

        try {
            const res = await fetch('http://localhost:5000/api/routes/calculate-safe-path', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    destinationId: selectedZone.id,
                    startLocation: userLocationZone.id
                })
            });
            const result = await res.json();
            if (result.success) {
                setRouteInfo(result.data);
            }
        } catch (error) {
            console.error("Routing error", error);
            // Fallback mock if backend is down
            setTimeout(() => {
                setRouteInfo({
                    eta: "4 mins", distance: "250m", safetyScore: 92,
                    routePath: "M80,350 L150,350 L150,150 L300,150 L380,220",
                    turnByTurn: [
                        "1. Head north from your current location, purposely avoiding the Gate 1 congestion.",
                        "2. Take a right before the Food Court (South) to avoid Critical crowding.",
                        "3. Walk past the North Stand level (Moderate Traffic).",
                        "4. Arrive at Merchandise Stall A."
                    ]
                });
            }, 800);
        } finally {
            setIsCalculating(false);
        }
    };

    // Architectural SVGs mapped to zone IDs
    const renderArchitecturalMap = () => {
        return (
            <div className="w-full h-full bg-slate-50 p-4 lg:p-6 rounded-xl border border-slate-100 shadow-inner grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 overflow-y-auto content-start">
                {zones.map(z => {
                    const isSelected = selectedZone?.id === z.id;
                    const isDark = z.riskLevel === 'High' || z.riskLevel === 'Critical';

                    return (
                        <div
                            key={z.id}
                            onClick={() => setSelectedZone(z)}
                            className={`cursor-pointer transition-all duration-300 rounded-xl p-6 flex flex-col justify-between min-h-[160px] shadow-sm hover:shadow-md border-2 
                                ${isSelected ? 'border-secondary ring-4 ring-secondary/10 shadow-lg scale-[1.02]' : 'border-transparent hover:border-secondary/50'}
                            `}
                            style={{ backgroundColor: z.colorInfo.hex }}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className={`font-bold text-lg leading-tight pr-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                    {z.name}
                                </h3>
                                {userLocationZone.id === z.id && (
                                    <span className="flex h-4 w-4 shrink-0 relative" title="You are here">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                        <span className={`relative inline-flex rounded-full h-4 w-4 ${isDark ? 'bg-white' : 'bg-primary'}`}></span>
                                    </span>
                                )}
                            </div>

                            <div className="mt-auto">
                                <div className={`text-4xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {z.density}% <span className={`text-sm font-semibold tracking-normal ${isDark ? 'text-white/80' : 'text-gray-600'}`}>Full</span>
                                </div>
                                <div className={`mt-1 text-sm font-bold uppercase tracking-wider ${isDark ? 'text-white/90' : 'text-gray-700'}`}>
                                    {z.riskLevel} Risk
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderRouteModal = () => {
        if (!showRouteModal) return null;

        return (
            <div className="fixed inset-0 z-50 bg-[#002868]/60 backdrop-blur-md flex items-center justify-center pt-20 p-4 lg:p-10 transition-opacity">
                <div className="bg-white w-full max-w-6xl h-full max-h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row animate-in fade-in zoom-in-95 duration-300 relative">

                    {/* Interactive 2D Map Area */}
                    <div className="flex-1 bg-[#F8FAFC] p-8 relative flex items-center justify-center overflow-hidden border-r border-gray-100">
                        {/* Mock 2D SVG Venue Floor Plan */}
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]"></div>

                        <div className="relative w-full max-w-lg aspect-square bg-white rounded-2xl shadow-sm border border-gray-200">
                            <svg viewBox="0 0 500 500" className="w-full h-full text-gray-300 drop-shadow-sm">
                                {/* Floorplan Base Lines */}
                                <rect x="40" y="40" width="420" height="420" rx="30" fill="none" stroke="currentColor" strokeWidth="6" />
                                <circle cx="250" cy="250" r="120" fill="none" stroke="currentColor" strokeWidth="4" />
                                <line x1="250" y1="40" x2="250" y2="130" stroke="currentColor" strokeWidth="4" />
                                <line x1="250" y1="370" x2="250" y2="460" stroke="currentColor" strokeWidth="4" />
                                <line x1="40" y1="250" x2="130" y2="250" stroke="currentColor" strokeWidth="4" />
                                <line x1="370" y1="250" x2="460" y2="250" stroke="currentColor" strokeWidth="4" />

                                {/* Zones Overlay based on live data */}
                                <circle cx="80" cy="350" r="30" fill={zones.find(z => z.id === userLocationZone.id)?.colorInfo?.hex || '#F59E0B'} opacity="0.8" />
                                <text x="80" y="395" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#4B5563">Start</text>

                                <rect x="250" y="80" width="100" height="80" rx="10" fill={zones.find(z => z.id === 'z4')?.colorInfo?.hex || '#EF4444'} opacity="0.6" />
                                <text x="300" y="125" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#7F1D1D">Food Court</text>

                                <rect x="180" y="350" width="100" height="60" rx="10" fill={zones.find(z => z.id === 'z1')?.colorInfo?.hex || '#F97316'} opacity="0.6" />
                                <text x="230" y="385" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#9A3412">Gate 1</text>

                                <circle cx="380" cy="220" r="30" fill={selectedZone?.colorInfo?.hex || '#10B981'} opacity="0.8" />
                                <text x="380" y="270" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#065F46">Destination</text>

                                {/* Animated Route Path */}
                                {routeInfo && (
                                    <>
                                        <path d={routeInfo.routePath} fill="none" stroke="#002868" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="10 10" className="animate-[dash_1s_linear_infinite]" />
                                        <style>{`@keyframes dash { to { stroke-dashoffset: -20; } }`}</style>
                                    </>
                                )}
                            </svg>

                            {/* Live Calculating Overlay */}
                            {isCalculating && (
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center rounded-2xl flex-col gap-3">
                                    <div className="w-10 h-10 border-4 border-[#002868] border-t-transparent rounded-full animate-spin"></div>
                                    <p className="font-bold text-[#002868] animate-pulse">Computing Crowd-Safe Route...</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Routing Control Panel */}
                    <div className="w-full lg:w-[400px] shrink-0 bg-white p-8 flex flex-col overflow-y-auto relative">
                        {/* Close button */}
                        <button onClick={() => setShowRouteModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-[#002868] hover:bg-gray-100 rounded-full p-2 transition-colors z-10 bg-white shadow-sm border border-gray-100">
                            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>

                        <h2 className="text-2xl font-black text-[#002868] mb-8 pr-8">Navigation Details</h2>

                        {/* Input Fields */}
                        <div className="space-y-4 mb-8">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">From</label>
                                <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-blue-500 shrink-0"></div>
                                    <div className="font-bold text-gray-900">{userLocationZone.name}</div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">To</label>
                                <div className="bg-[#F0F9FF] border border-blue-200 rounded-xl px-4 py-3 flex items-center gap-3 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 bottom-0 w-1 bg-[#00AEEF]"></div>
                                    <div className="w-3 h-3 rounded-full bg-[#10B981] shrink-0"></div>
                                    <div className="font-bold text-[#002868]">{selectedZone.name}</div>
                                </div>
                            </div>
                        </div>

                        {/* Results */}
                        {routeInfo ? (
                            <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Metrics Group */}
                                <div className="grid grid-cols-2 gap-3 mb-8">
                                    <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 flex flex-col justify-center">
                                        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Estimated Time</div>
                                        <div className="text-2xl font-black text-gray-900">{routeInfo.eta}</div>
                                    </div>
                                    <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 flex flex-col justify-center">
                                        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Distance</div>
                                        <div className="text-2xl font-black text-gray-900">{routeInfo.distance}</div>
                                    </div>
                                    <div className="col-span-2 bg-[#ECFDF5] border border-green-200 rounded-xl p-4 flex items-center justify-between">
                                        <div>
                                            <div className="text-[11px] font-bold text-green-700 uppercase tracking-wider mb-1">Route Safety Score</div>
                                            <div className="text-sm font-semibold text-green-800">Avoiding High Traffic Zones</div>
                                        </div>
                                        <div className="text-4xl font-black text-green-600">{routeInfo.safetyScore}%</div>
                                    </div>
                                </div>

                                {/* Turn by Turn */}
                                <div>
                                    <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-4">Turn-by-turn Directions</h3>
                                    <ul className="space-y-4 relative before:absolute before:inset-y-2 before:left-[11px] before:w-0.5 before:bg-gray-100">
                                        {routeInfo.turnByTurn.map((step, idx) => (
                                            <li key={idx} className="relative pl-8 text-[15px] font-medium text-gray-700 leading-snug">
                                                <span className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-400 z-10">{idx + 1}</span>
                                                {step}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center">
                                {/* Connecting Placeholder */}
                                <div className="text-center opacity-50">
                                    <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
                                    <p className="font-semibold text-gray-400">Route details will appear here</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)] relative">
            {/* Modal Overlay */}
            {renderRouteModal()}

            {/* Map Area */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6 flex flex-col relative overflow-hidden">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h2 className="text-xl font-bold text-[#002868]">Live Venue Status</h2>
                    <div className="flex flex-wrap gap-4 text-sm font-semibold text-gray-600 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full shrink-0 bg-[#10B981]"></div> Low</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full shrink-0 bg-[#F59E0B]"></div> Moderate</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full shrink-0 bg-[#F97316]"></div> High</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full shrink-0 bg-[#EF4444]"></div> Critical</div>
                    </div>
                </div>
                <div className="flex-1 relative w-full overflow-hidden rounded-xl">
                    {renderArchitecturalMap()}
                </div>
            </div>

            {/* Interaction Panel */}
            <div className={`w-full lg:w-96 shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col transition-all duration-300 overflow-y-auto ${selectedZone ? 'opacity-100 lg:translate-x-0' : 'opacity-50 lg:translate-x-4'}`}>
                {selectedZone ? (
                    <div className="p-6 h-full flex flex-col">
                        <div className="flex justify-between items-start mb-6 w-full gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-[#002868] mb-2 leading-tight">{selectedZone.name}</h3>
                                <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${selectedZone.colorInfo.bgClass}/20 ${selectedZone.colorInfo.textClass}`}>
                                    {selectedZone.riskLevel} RISK
                                </div>
                            </div>
                            <button onClick={() => setSelectedZone(null)} className="text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full p-2 transition-colors focus:outline-none shrink-0">
                                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        <div className="space-y-6 flex-1">
                            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                                <div className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Live Occupancy</div>
                                <div className="text-4xl font-black text-gray-900">{selectedZone.current.toLocaleString()} <span className="text-lg font-bold text-gray-400">/ {selectedZone.maxCapacity.toLocaleString()}</span></div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4 overflow-hidden">
                                    <div className={`h-2.5 rounded-full transition-all duration-700 ${selectedZone.colorInfo.bgClass}`} style={{ width: `${selectedZone.density}%` }}></div>
                                </div>
                            </div>

                            <div className="bg-red-50/50 p-5 rounded-xl border border-red-100 flex gap-4">
                                <div className="text-red-500 mt-0.5 shrink-0 bg-white p-2 rounded-full shadow-sm border border-red-100">
                                    <svg className="w-5 h-5 shrink-0 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-red-900 uppercase tracking-wide">Live Sensor Readout</div>
                                    <div className="text-sm font-medium text-red-700 mt-1.5 leading-relaxed">Density oscillating rapidly. Heavy foot traffic detected near central ingress points.</div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100 space-y-4 mt-8 w-full">
                            <button onClick={handleFindRoute} className="w-full py-3.5 px-4 bg-[#002868] hover:bg-[#001f52] shadow-md text-white font-bold inline-flex justify-center items-center gap-2 rounded-xl transition-colors shrink-0">
                                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                                Find Route {selectedZone.riskLevel === 'Critical' || selectedZone.riskLevel === 'High' ? 'Away From Here' : 'Here'}
                            </button>
                            {selectedZone.id === userLocationZone.id && (
                                <p className="text-sm text-center text-gray-500 font-bold bg-gray-50 py-2 rounded-lg border border-gray-100">📍 You are currently here.</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-400">
                        <svg className="w-16 h-16 shrink-0 mb-6 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
                        <p className="text-base font-medium max-w-[250px] mx-auto text-gray-500 leading-relaxed">Select any zone on the architectural grid to view live sensor data and navigation options.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
