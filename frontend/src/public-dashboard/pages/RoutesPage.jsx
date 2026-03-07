import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDashboardContext } from '../context/DashboardContext';

export default function RoutesPage() {
    const { getUserLocationZone } = useDashboardContext();
    const locationZone = getUserLocationZone();
    const location = useLocation();

    // Retrieve dynamic destination from router state
    const destinationName = location.state?.destinationName || 'Platform 1-4';

    const [activeTab, setActiveTab] = useState('fastest');
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);

    const routes = {
        fastest: [],
        safest: [],
        accessible: []
    };

    const getTimelineIcon = (type) => {
        switch (type) {
            case 'start': return <svg className="w-5 h-5 text-[#002868]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4" fill="currentColor"></circle></svg>;
            case 'end': return <svg className="w-5 h-5 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>;
            case 'transit': return <svg className="w-5 h-5 text-[#00AEEF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>;
            default: return <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="12 5 12 19"></polyline></svg>;
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 relative">
            {/* Map Modal Overlay */}
            {isMapModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-5xl h-[85vh] flex flex-col relative animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black text-[#002868]">Live Route Map</h2>
                            <button
                                onClick={() => setIsMapModalOpen(false)}
                                className="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-gray-100 rounded-full p-2 transition-all"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="flex-1 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center p-12">
                            <div className="w-20 h-20 bg-white shadow-sm border border-gray-100 rounded-2xl flex items-center justify-center mb-6 text-gray-300">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Interactive 2D Map Loadpoint</h3>
                            <p className="max-w-md text-gray-500 font-medium">The interactive architectural floorplan for {selectedRoute?.to} will be initialized here, showing live crowd heatmaps and your calculated path bypasses.</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Safe Route Suggestions</h1>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Automated AI pathfinding</p>
                </div>
                <div className="flex bg-white rounded-xl p-1 shadow-sm border border-slate-100">
                    <button onClick={() => { setActiveTab('fastest'); setSelectedRoute(null); }} className={`px-5 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${activeTab === 'fastest' ? 'bg-secondary text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}>Fastest</button>
                    <button onClick={() => { setActiveTab('safest'); setSelectedRoute(null); }} className={`px-5 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${activeTab === 'safest' ? 'bg-safe text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}>Safest</button>
                    <button onClick={() => { setActiveTab('accessible'); setSelectedRoute(null); }} className={`px-5 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${activeTab === 'accessible' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}>Accessible</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Side: Route Options */}
                <div className="space-y-4">
                    {routes[activeTab].map(route => (
                        <div
                            key={route.id}
                            onClick={() => setSelectedRoute(route)}
                            className={`bg-white rounded-2xl p-6 cursor-pointer transition-all border-2 ${selectedRoute?.id === route.id ? 'border-[#002868] shadow-lg ring-4 ring-[#002868]/5' : 'border-gray-100 shadow-sm hover:border-[#00AEEF]'}`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Destination</div>
                                    <div className="text-xl font-black text-[#002868]">{route.to}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-black text-[#002868] tracking-tighter">{route.time}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-[11px] font-bold border border-green-200 uppercase tracking-wide">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                    {route.crowdBadge} Crowds
                                </span>
                                {activeTab === 'safest' && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200 uppercase tracking-wide">
                                        <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                                        Safe-Path Pathfinding
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Side: Timeline Details */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col min-h-[500px] relative overflow-hidden">
                    {selectedRoute ? (
                        <div className="w-full h-full p-10 flex flex-col">
                            <div className="flex justify-between items-center mb-8 border-b border-gray-50 pb-6">
                                <h2 className="text-2xl font-black text-[#002868]">Trip Details</h2>
                                <span className="text-xs font-bold text-gray-400 uppercase bg-gray-50 px-3 py-1 rounded-full tracking-widest">To {selectedRoute.to}</span>
                            </div>

                            <div className="flex-1 relative pl-6 border-l-2 border-gray-100 space-y-10 py-2">
                                {selectedRoute.steps.map((step, idx) => (
                                    <div key={idx} className="relative">
                                        <div className="absolute -left-[37px] top-0 bg-white shadow-md rounded-full p-1.5 border border-gray-50 z-10 transition-transform hover:scale-110">
                                            {getTimelineIcon(step.type)}
                                        </div>
                                        <div className={`pl-8 ${step.type === 'start' || step.type === 'end' ? 'font-black text-gray-900 text-lg' : 'text-gray-500 font-bold'}`}>
                                            {step.desc}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => setIsMapModalOpen(true)}
                                className="mt-10 w-full py-4.5 bg-[#002868] hover:bg-blue-800 cursor-pointer transition-all text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-blue-900/10 scale-100 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
                                View on Map
                            </button>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-200 mb-6">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No route selected</h3>
                            <p className="max-w-[280px] text-gray-400 font-medium leading-relaxed">Select a destination from the list on the left to see your personalized safe-path directions.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
