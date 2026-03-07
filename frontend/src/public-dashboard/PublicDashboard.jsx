import React, { useState, useEffect } from 'react';
import { Activity, Clock, Navigation, AlertTriangle, Shield, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOCK_ZONES = [
    { id: "z1", name: "Main Entrance", currentCapacity: 120, maxCapacity: 1000, densityPercentage: 12 },
    { id: "z2", name: "Food Court", currentCapacity: 880, maxCapacity: 1000, densityPercentage: 88 },
    { id: "z3", name: "Platform 1", currentCapacity: 950, maxCapacity: 1000, densityPercentage: 95 },
    { id: "z4", name: "Ticketing", currentCapacity: 400, maxCapacity: 1000, densityPercentage: 40 },
    { id: "z5", name: "Restrooms", currentCapacity: 60, maxCapacity: 100, densityPercentage: 60 },
    { id: "z6", name: "Exit Gate 2", currentCapacity: 200, maxCapacity: 1000, densityPercentage: 20 }
];

const MOCK_ALERTS = [
    { id: "a1", timestamp: new Date(Date.now() - 120000), severity: "Critical", headline: "Platform 1 Overcrowded", description: "Avoid Platform 1. Extreme congestion reported." },
    { id: "a2", timestamp: new Date(Date.now() - 300000), severity: "Warning", headline: "Food Court Filling Up", description: "Capacity nearing limit at Food Court. Expect delays." },
    { id: "a3", timestamp: new Date(Date.now() - 600000), severity: "Info", headline: "All entrances open", description: "Main Entrance operating normally." }
];

const MOCK_WAIT_TIMES = [
    { id: "w1", serviceName: "Security Check", estimatedMinutes: 15, maxMinutes: 60, trend: "increasing" },
    { id: "w2", serviceName: "Ticketing Queue", estimatedMinutes: 5, maxMinutes: 60, trend: "stable" },
    { id: "w3", serviceName: "Restrooms", estimatedMinutes: 8, maxMinutes: 60, trend: "decreasing" }
];

const MapGeometries = {
    "z1": { points: "50,50 250,50 250,200 50,200", center: { x: 150, y: 125 } },
    "z2": { points: "280,50 550,50 550,300 280,300", center: { x: 415, y: 175 } },
    "z3": { points: "580,50 780,50 780,450 580,450", center: { x: 680, y: 250 } },
    "z4": { points: "50,230 250,230 250,450 50,450", center: { x: 150, y: 340 } },
    "z5": { points: "280,330 400,330 400,450 280,450", center: { x: 340, y: 390 } },
    "z6": { points: "430,330 550,330 550,450 430,450", center: { x: 490, y: 390 } }
};

// Utilities
function getRiskLevel(density) {
    if (density < 50) return 'Safe';
    if (density < 75) return 'Moderate';
    if (density < 90) return 'High';
    return 'Critical';
}

function getRiskColorHex(level, tw = false) {
    if (tw) {
        switch (level) {
            case 'Safe': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            case 'Moderate': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            case 'High': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
            case 'Critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
            default: return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
        }
    }
    switch (level) {
        case 'Safe': return '#10B981';
        case 'Moderate': return '#F59E0B';
        case 'High': return '#F97316';
        case 'Critical': return '#EF4444';
        default: return '#10B981';
    }
}

function formatTime(date) {
    const diff = Math.floor((new Date() - date) / 60000);
    if (diff < 1) return "Just now";
    if (diff === 1) return "1 min ago";
    return `${diff} mins ago`;
}

export default function PublicDashboard() {
    const navigate = useNavigate();
    const [zones, setZones] = useState(MOCK_ZONES.map(z => ({ ...z, riskLevel: getRiskLevel(z.densityPercentage) })));
    const [waitTimes, setWaitTimes] = useState([...MOCK_WAIT_TIMES]);
    const [alerts, setAlerts] = useState([...MOCK_ALERTS].sort((a, b) => b.timestamp - a.timestamp));
    const [activeTab, setActiveTab] = useState('fastest');
    const [greeting, setGreeting] = useState('');
    const [tooltipState, setTooltipState] = useState({ visible: false, x: 0, y: 0, title: '', titleColor: '', details: '', barWidth: '0%', barColor: '' });
    const [predictedTime, setPredictedTime] = useState(45);

    const userLocationId = "z1";
    const userDestinationId = "z5";

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good Morning");
        else if (hour < 18) setGreeting("Good Afternoon");
        else setGreeting("Good Evening");

        // Simulation Interval
        const intervalId = setInterval(() => {
            setZones(prevZones => {
                const newZones = [...prevZones];
                const numToUpdate = Math.random() > 0.5 ? 2 : 1;
                for (let i = 0; i < numToUpdate; i++) {
                    const zIdx = Math.floor(Math.random() * newZones.length);
                    const zone = { ...newZones[zIdx] };
                    const change = Math.floor(Math.random() * 7) - 3;
                    let newDens = zone.densityPercentage + change;
                    if (newDens < 0) newDens = 0;
                    if (newDens > 100) newDens = 100;
                    zone.densityPercentage = newDens;
                    zone.riskLevel = getRiskLevel(newDens);
                    newZones[zIdx] = zone;
                }
                return newZones;
            });

            setWaitTimes(prev => {
                const newWT = [...prev];
                const wtIdx = Math.floor(Math.random() * newWT.length);
                const wt = { ...newWT[wtIdx] };
                const wtChange = Math.floor(Math.random() * 3) - 1;
                wt.estimatedMinutes += wtChange;
                if (wt.estimatedMinutes < 0) wt.estimatedMinutes = 0;

                if (wtChange > 0) wt.trend = 'increasing';
                else if (wtChange < 0) wt.trend = 'decreasing';
                else wt.trend = 'stable';
                newWT[wtIdx] = wt;
                return newWT;
            });

            if (Math.random() < 0.1) {
                setPredictedTime(Math.floor(Math.random() * 30) + 15);
            }
        }, 6000);

        return () => clearInterval(intervalId);
    }, []);

    const userZone = zones.find(z => z.id === userLocationId) || zones[0];
    const destZone = zones.find(z => z.id === userDestinationId) || zones[4];
    const worstZone = [...zones].sort((a, b) => b.densityPercentage - a.densityPercentage)[0];

    // Sorted zones for nearby list
    const order = { 'Critical': 4, 'High': 3, 'Moderate': 2, 'Safe': 1 };
    const nearbyZones = [...zones]
        .filter(z => z.id !== userLocationId)
        .sort((a, b) => order[b.riskLevel] - order[a.riskLevel]);

    const handleMapHover = (e, zone) => {
        const svgRect = e.currentTarget.closest('svg').getBoundingClientRect();
        setTooltipState({
            visible: true,
            x: e.clientX - svgRect.left,
            y: e.clientY - svgRect.top,
            title: zone.name,
            titleColor: getRiskColorHex(zone.riskLevel),
            details: `${Math.floor(zone.maxCapacity * (zone.densityPercentage / 100))} / ${zone.maxCapacity} people`,
            barWidth: `${zone.densityPercentage}%`,
            barColor: getRiskColorHex(zone.riskLevel)
        });
    };

    const handleMapLeave = () => {
        setTooltipState(prev => ({ ...prev, visible: false }));
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Minimalist Top Nav matched to App.jsx */}
            <nav className="bg-[#002868] text-white px-6 py-4 flex items-center justify-between shadow-xl z-50 sticky top-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                        <Activity size={18} className="text-[#00AEEF]" />
                    </div>
                    <div>
                        <h1 className="text-sm font-black tracking-widest uppercase">TroubleFree AI</h1>
                        <p className="text-[10px] text-[#00AEEF] font-bold tracking-[0.2em] uppercase mt-0.5">Live Public Overview</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => navigate('/routes')} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors border border-white/10 flex items-center gap-2">
                        <Navigation size={14} className="text-[#00AEEF]" /> Route Finding
                    </button>
                    <button onClick={() => navigate('/login')} className="px-4 py-2 bg-[#00AEEF] hover:bg-cyan-400 text-[#002868] text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg hover:shadow-cyan-400/20 transition-all flex items-center gap-2">
                        Authority Login <ArrowRight size={14} />
                    </button>
                </div>
            </nav>

            <main className="flex-1 max-w-7xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column (Main Information and Map) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Welcome Hero / Status */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00AEEF]/5 rounded-full blur-3xl -mx-10 -my-10 pointer-events-none"></div>
                        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <h2 className="text-3xl font-black text-[#002868] tracking-tight">{greeting}, Traveler</h2>
                                <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">Your dynamic crowd navigation portal.</p>

                                <div className={`mt-6 inline-flex items-center gap-3 px-4 py-3 rounded-2xl border ${userZone.riskLevel === 'Safe' || userZone.riskLevel === 'Moderate' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                    {userZone.riskLevel === 'Safe' || userZone.riskLevel === 'Moderate' ? (
                                        <Shield size={20} />
                                    ) : (
                                        <AlertTriangle size={20} className="animate-pulse" />
                                    )}
                                    <span className="text-xs font-black uppercase tracking-widest">
                                        {userZone.riskLevel === 'Safe' || userZone.riskLevel === 'Moderate' ? `You are in a ${userZone.riskLevel} Zone` : "High Congestion: Relocate Soon"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Nearby Zones Mini-Grid */}
                        <div className="mt-8 pt-6 border-t border-slate-50">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Nearby Zones Status</h3>
                            <div className="flex flex-wrap gap-3">
                                {nearbyZones.map(z => (
                                    <div key={z.id} className={`px-4 py-2 rounded-xl flex items-center gap-3 border ${getRiskColorHex(z.riskLevel, true)}`}>
                                        <div className={`w-2 h-2 rounded-full ${z.riskLevel === 'Critical' ? 'bg-red-500 animate-pulse' : z.riskLevel === 'High' ? 'bg-orange-500' : z.riskLevel === 'Moderate' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                                        <span className="text-xs font-bold text-slate-700">{z.name}</span>
                                        <span className="text-[10px] font-black opacity-80">{z.densityPercentage}% FULL</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Interactive Stadium Map */}
                    <div className="bg-slate-900 rounded-3xl p-1 overflow-hidden shadow-2xl border border-white/5 relative">
                        <div className="absolute top-6 left-6 z-10">
                            <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                Live Heatmap V2
                            </h3>
                            <p className="text-[10px] font-bold text-[#00AEEF] uppercase tracking-[0.2em] mt-0.5">Sensor-Driven Topography</p>
                        </div>

                        <div className="h-[450px] bg-[radial-gradient(circle_at_20%_30%,#1e293b_0%,#0f172a_100%)] relative">
                            <svg viewBox="0 0 800 500" className="w-full h-full drop-shadow-2xl" preserveAspectRatio="xMidYMid meet">
                                <g className="opacity-90">
                                    {zones.map(z => {
                                        const geo = MapGeometries[z.id];
                                        return (
                                            <polygon
                                                key={z.id}
                                                points={geo.points}
                                                className="transition-all duration-1000 origin-center cursor-pointer hover:stroke-white hover:stroke-[3px] hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                                                style={{ fill: getRiskColorHex(z.riskLevel) }}
                                                onMouseMove={(e) => handleMapHover(e, z)}
                                                onMouseLeave={handleMapLeave}
                                            />
                                        );
                                    })}
                                </g>
                                {/* User Location Pulse */}
                                <g transform={`translate(${MapGeometries[userLocationId].center.x}, ${MapGeometries[userLocationId].center.y})`}>
                                    <circle cx="0" cy="0" r="25" className="fill-[#00AEEF]/20 animate-ping"></circle>
                                    <circle cx="0" cy="0" r="10" className="fill-[#00AEEF] stroke-white stroke-2"></circle>
                                </g>
                            </svg>

                            {/* Tooltip */}
                            {tooltipState.visible && (
                                <div
                                    className="absolute pointer-events-none bg-[#0a0f18]/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-4 min-w-[180px] z-50 transform -translate-x-1/2 -translate-y-full mt-[-10px] animate-in slide-in-from-bottom-2 fade-in"
                                    style={{ left: tooltipState.x, top: tooltipState.y }}
                                >
                                    <h4 className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: tooltipState.titleColor }}>{tooltipState.title}</h4>
                                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-2">
                                        <div className="h-full transition-all duration-500" style={{ width: tooltipState.barWidth, backgroundColor: tooltipState.barColor }}></div>
                                    </div>
                                    <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">{tooltipState.details}</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Right Column (Info / Alerts) */}
                <div className="space-y-6">

                    {/* Wait Times Box */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col h-[320px]">
                        <div className="flex items-center gap-2 mb-6">
                            <Clock size={16} className="text-[#002868]" />
                            <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Network Services</h3>
                        </div>

                        <div className="space-y-4 flex-1">
                            {waitTimes.map(wt => {
                                const pct = Math.min((wt.estimatedMinutes / wt.maxMinutes) * 100, 100);
                                return (
                                    <div key={wt.id} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-bold text-slate-700">{wt.serviceName}</span>
                                            <div className="flex items-center gap-1">
                                                <span className="text-xs font-black text-slate-800">{wt.estimatedMinutes} min</span>
                                            </div>
                                        </div>
                                        <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-[#002868] transition-all duration-500" style={{ width: `${pct}%` }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* AI Insights & Alerts */}
                    <div className="bg-[#0a0f18] rounded-3xl p-6 border border-white/5 shadow-2xl flex-1 max-h-[500px] flex flex-col">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                            <div className="flex items-center gap-2">
                                <AlertTriangle size={16} className="text-orange-400" />
                                <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Live Alert Stream</h3>
                            </div>
                            <span className="bg-white/10 text-white/50 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest">Polling...</span>
                        </div>

                        {/* AI Summary Box */}
                        <div className="mb-6 bg-secondary/10 border border-secondary/20 rounded-2xl p-4">
                            <p className="text-[10px] text-white/80 leading-relaxed font-medium">
                                <span className="text-secondary font-black tracking-widest uppercase mr-2">SYSTEM PREDICTION: </span>
                                Peak congestion at {worstZone.name} is scheduled to stabilize in
                                <span className="text-secondary font-black text-xs mx-1">{predictedTime}</span> mins. Maintain current routes.
                            </p>
                        </div>

                        {/* Alert List */}
                        <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                            {alerts.map((alert, index) => (
                                <div key={alert.id} className={`p-4 rounded-2xl border ${alert.severity === 'Critical' ? 'bg-red-500/10 border-red-500/20' : alert.severity === 'Warning' ? 'bg-amber-500/10 border-amber-500/20' : 'bg-white/5 border-white/10'}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className={`text-[10px] font-black uppercase tracking-widest ${alert.severity === 'Critical' ? 'text-red-400' : alert.severity === 'Warning' ? 'text-amber-400' : 'text-slate-300'}`}>{alert.headline}</h4>
                                        <span className="text-[8px] font-bold text-white/40 uppercase">{formatTime(alert.timestamp)}</span>
                                    </div>
                                    <p className="text-[10px] text-white/70">{alert.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
