import React, { useState, useEffect } from 'react';
import { Search, Map as MapIcon, Navigation, Clock, Shield, AlertTriangle, ArrowRight, CheckCircle2, Info } from 'lucide-react';
import { getNavigationRoute, getVenueConfig } from '../../services/api';

export default function RoutesPage() {
    const [zones, setZones] = useState([]);
    const [startZone, setStartZone] = useState('');
    const [destZone, setDestZone] = useState('');
    const [routeData, setRouteData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState(null);

    useEffect(() => {
        const fetchInitial = async () => {
            const res = await getVenueConfig();
            if (res.success && res.config) {
                setZones(res.config.zones);
                setConfig(res.config);
                if (res.config.zones.length >= 2) {
                    setStartZone(res.config.zones[0].name);
                    setDestZone(res.config.zones[res.config.zones.length - 1].name);
                }
            }
        };
        fetchInitial();
    }, []);

    const findRoute = async () => {
        if (!startZone || !destZone) return;
        setLoading(true);
        try {
            const res = await getNavigationRoute(startZone, destZone);
            if (res.success) {
                setRouteData(res);
            } else {
                setRouteData({ error: res.message });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getRiskColor = (risk) => {
        switch (risk?.toLowerCase()) {
            case 'high': return 'text-red-500 bg-red-50 border-red-100';
            case 'moderate': return 'text-orange-500 bg-orange-50 border-orange-100';
            case 'low': return 'text-emerald-500 bg-emerald-50 border-emerald-100';
            default: return 'text-slate-500 bg-slate-50 border-slate-100';
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">AI Navigation Guidance</h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Real-time safest path calculation engine</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Search & Inputs */}
                <div className="space-y-6">
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Search size={18} className="text-[#002868]" />
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Plan Your Route</h3>
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Start Point</label>
                            <select
                                value={startZone}
                                onChange={(e) => setStartZone(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#00AEEF]/20 transition-all"
                            >
                                {zones.map(z => <option key={z.name} value={z.name}>{z.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Destination</label>
                            <select
                                value={destZone}
                                onChange={(e) => setDestZone(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#00AEEF]/20 transition-all"
                            >
                                {zones.map(z => <option key={z.name} value={z.name}>{z.name}</option>)}
                            </select>
                        </div>

                        <button
                            onClick={findRoute}
                            disabled={loading}
                            className="w-full py-4 bg-[#002868] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-900/10 flex items-center justify-center gap-3 hover:bg-blue-800 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? <Navigation size={18} className="animate-pulse" /> : <Navigation size={18} />}
                            {loading ? 'CALCULATING...' : 'GENERATE SAFE PATH'}
                        </button>
                    </div>

                    {routeData && !routeData.error && (
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Info size={16} className="text-[#00AEEF]" />
                                Route Analytics
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-2xl">
                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Distance</p>
                                    <p className="text-lg font-black text-slate-800">{routeData.distance}m</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl">
                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Estimated Time</p>
                                    <p className="text-lg font-black text-slate-800">{routeData.estimated_time}</p>
                                </div>
                                <div className={`col-span-2 p-4 rounded-2xl border ${getRiskColor(routeData.risk_level)}`}>
                                    <p className="text-[8px] font-black uppercase tracking-widest mb-1">Safe-Path Index</p>
                                    <p className="text-lg font-black uppercase">{routeData.risk_level} Risk</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Main View: Map or List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-900 rounded-[2.5rem] p-6 shadow-2xl border border-white/5 relative overflow-hidden min-h-[600px]">
                        <div className="absolute top-8 left-8 z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/10">
                                    <MapIcon size={20} className="text-[#00AEEF]" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-black text-white uppercase tracking-widest">Live Architectural Feed</h3>
                                    <p className="text-[8px] font-bold text-emerald-400 uppercase tracking-[0.2em] mt-0.5 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        AI Guidance Active
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Interactive SVG Stadium Feed */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e293b_0%,#0f172a_100%)]">
                            <div className="absolute inset-0 opacity-20 pointer-events-none">
                                <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
                            </div>

                            <svg className="w-full h-full">
                                {/* Render All Paths from Config if available */}
                                {config?.paths?.map((path, idx) => {
                                    const fromZone = zones.find(z => z.name === path.from);
                                    const toZone = zones.find(z => z.name === path.to);
                                    if (!fromZone || !toZone) return null;
                                    return (
                                        <line
                                            key={idx}
                                            x1={`${fromZone.coordinates.x}%`} y1={`${fromZone.coordinates.y}%`}
                                            x2={`${toZone.coordinates.x}%`} y2={`${toZone.coordinates.y}%`}
                                            stroke="rgba(255,255,255,0.05)" strokeWidth="1"
                                        />
                                    );
                                })}

                                {/* Active AI Path Highlight */}
                                {routeData && routeData.path && config && (
                                    <polyline
                                        points={routeData.path.map(zName => {
                                            const z = config.zones.find(zone => zone.name === zName);
                                            return z ? `${(z.coordinates.x / 100) * 1536},${(z.coordinates.y / 100) * 800}` : '';
                                        }).join(' ')}
                                        fill="none"
                                        stroke="#00AEEF"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeDasharray="12 12"
                                        className="animate-[dash_20s_linear_infinite]"
                                    />
                                )}
                            </svg>

                            {/* Zones */}
                            {zones.map((zone, idx) => {
                                const density = zone.currentOccupancy / (zone.capacity || 1);
                                const color = density > 0.8 ? 'bg-red-500 shadow-red-500/50' : density > 0.5 ? 'bg-orange-400 shadow-orange-400/50' : 'bg-emerald-500 shadow-emerald-500/50';
                                const isPartByPath = routeData?.path?.includes(zone.name);

                                return (
                                    <div
                                        key={idx}
                                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ${isPartByPath ? 'z-20 scale-110' : 'z-10 opacity-60'}`}
                                        style={{ top: `${zone.coordinates.y}%`, left: `${zone.coordinates.x}%` }}
                                    >
                                        <div className={`w-4 h-4 rounded-full ${color} shadow-lg border-2 border-white/20`}></div>
                                        <div className={`mt-3 px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/10 text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${isPartByPath ? 'bg-white text-[#002868] scale-110' : 'bg-black/30 text-white/40'}`}>
                                            {zone.name}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Path Steps */}
                    {routeData && !routeData.error && (
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 animate-in fade-in duration-700">
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-8 border-b border-slate-50 pb-6 flex items-center justify-between">
                                <span>Guidance Matrix Checklist</span>
                                <span className="text-[9px] text-[#00AEEF] bg-[#00AEEF]/5 px-3 py-1 rounded-full">{routeData.path.length} Vector Nodes</span>
                            </h3>

                            <div className="space-y-8 relative pl-6 border-l-2 border-slate-50">
                                {routeData.path.map((step, idx) => (
                                    <div key={idx} className="relative">
                                        <div className={`absolute -left-[35px] top-0 w-5 h-5 rounded-full border-4 border-white shadow-md flex items-center justify-center ${idx === 0 ? 'bg-slate-400' : idx === routeData.path.length - 1 ? 'bg-emerald-500' : 'bg-[#002868]'}`}>
                                        </div>
                                        <div>
                                            <p className={`text-xs font-black tracking-widest uppercase ${idx === 0 || idx === routeData.path.length - 1 ? 'text-slate-800' : 'text-slate-500'}`}>
                                                {idx === 0 ? 'Initialize at' : idx === routeData.path.length - 1 ? 'Arrive at' : 'Pass through'}
                                            </p>
                                            <p className="text-lg font-black text-[#002868] mt-1">{step}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {routeData?.error && (
                        <div className="bg-red-50 rounded-3xl p-12 text-center border border-red-100 border-dashed">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-red-50 flex items-center justify-center mx-auto mb-6">
                                <AlertTriangle size={32} className="text-red-500" />
                            </div>
                            <h3 className="text-xl font-black text-slate-800 mb-2 uppercase tracking-tight">Navigation System Error</h3>
                            <p className="text-sm font-bold text-red-600 uppercase tracking-widest opacity-60">{routeData.error}</p>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes dash {
                    to {
                        stroke-dashoffset: -1000;
                    }
                }
            `}</style>
        </div>
    );
}
