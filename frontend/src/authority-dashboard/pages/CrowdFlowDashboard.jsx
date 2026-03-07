import React, { useState, useEffect, useRef } from 'react';
import { Activity, Play, Square, AlertTriangle, Shield, User, Zap, Terminal } from 'lucide-react';
import { getNavigationZones, runSimulationTick, getAuthorityAlerts } from '../../services/api';

const CrowdFlowDashboard = () => {
    const [mode, setMode] = useState('NORMAL');
    const [isSimulating, setIsSimulating] = useState(false);
    const [lastTickData, setLastTickData] = useState(null);
    const [zones, setZones] = useState([]);
    const [alerts, setAlerts] = useState([]);

    const intervalRef = useRef(null);
    const pollIntervalRef = useRef(null);

    // Fetch data
    const fetchData = async () => {
        try {
            const [zonesRes, alertsRes] = await Promise.all([
                getNavigationZones(),
                getAuthorityAlerts()
            ]);

            if (zonesRes.success && Array.isArray(zonesRes.zones)) {
                setZones(zonesRes.zones);
            }
            if (alertsRes.success && Array.isArray(alertsRes.alerts)) {
                setAlerts(alertsRes.alerts);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
        pollIntervalRef.current = setInterval(fetchData, 5000);
        return () => clearInterval(pollIntervalRef.current);
    }, []);

    const handleToggleSimulation = () => {
        if (isSimulating) {
            stopSimulation();
        } else {
            startSimulation();
        }
    };

    const startSimulation = () => {
        setIsSimulating(true);
        triggerSimulationTick();
        intervalRef.current = setInterval(() => {
            triggerSimulationTick();
        }, 5000);
    };

    const stopSimulation = () => {
        setIsSimulating(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setLastTickData({ message: 'Simulation Halted' });
    };

    const triggerSimulationTick = async () => {
        try {
            const response = await runSimulationTick(mode);

            if (!response.success) {
                throw new Error(`HTTP Error`);
            }

            setLastTickData({
                message: 'Tick processed',
                alertsGenerated: response.logs ? response.logs.filter(l => l.includes('[ALERT]')).length : 0,
                logs: response.logs || []
            });
            if (response.config && response.config.zones) {
                setZones(response.config.zones);
            }
        } catch (error) {
            console.error("Simulation error", error);
            stopSimulation();
        }
    };

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        };
    }, []);

    // Live Analytics Computations
    // Live Analytics Computations
    const entryRate = isSimulating ? Math.floor(Math.random() * 50) + 10 : 0;
    const exitRate = isSimulating ? Math.floor(Math.random() * 30) + 5 : 0;
    const netFlow = entryRate - exitRate;
    const activeAlerts = alerts.filter(a => a.status !== 'RESOLVED').length;
    const highRiskZones = zones.filter(z => (z.capacity ? (z.currentOccupancy / z.capacity) : 0) >= 0.75).length;
    const criticalZonesCount = zones.filter(z => (z.capacity ? (z.currentOccupancy / z.capacity) : 0) >= 0.90).length;
    const totalCrowd = zones.reduce((sum, z) => sum + (z.currentOccupancy || 0), 0);

    return (
        <div className="space-y-6">
            <header className="mb-4">
                <div className="flex justify-between items-center w-full">
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 tracking-tight uppercase">Crowd Flow Projection</h1>
                        <p className="text-[10px] font-medium text-slate-400 mt-1 tracking-wider uppercase">Project conditions and test system resilience across nodes.</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className={`flex items-center space-x-2 bg-white border shadow-sm px-3 py-1.5 rounded-lg transition-colors ${isSimulating ? 'border-secondary/20' : 'border-slate-100'}`}>
                            <span className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-secondary animate-pulse shadow-[0_0_8px_rgba(0,174,239,0.5)]' : 'bg-slate-300'}`}></span>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${isSimulating ? 'text-secondary font-black' : 'text-slate-400'}`}>
                                {isSimulating ? 'Engine Running' : 'Engine Standby'}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full space-y-6">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Controls Column */}
                    <div className="card-base flex flex-col h-full hover:border-slate-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Activity size={14} className="text-secondary" />
                                Engine Parameters
                            </h2>
                            {isSimulating && (
                                <span className="bg-emerald-50 text-emerald-600 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter animate-pulse">Live Tick</span>
                            )}
                        </div>

                        <div className="space-y-6 flex-1">
                            <div className="space-y-3">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Simulation Mode</label>
                                <div className="grid grid-cols-1 gap-2">
                                    {[
                                        { id: 'NORMAL', label: 'Nominal Flow', color: 'emerald', desc: 'Typical crowd behavior and density' },
                                        { id: 'RISING', label: 'Rapid Inflow', color: 'orange', desc: 'Accelerated entry across all gates' },
                                        { id: 'CRITICAL', label: 'Critical Surge', color: 'critical', desc: 'Breach-level density simulation' }
                                    ].map((m) => (
                                        <button
                                            key={m.id}
                                            onClick={() => setMode(m.id)}
                                            disabled={isSimulating}
                                            className={`p-3 rounded-xl border-2 text-left transition-all group ${mode === m.id
                                                ? `border-${m.color === 'critical' ? 'critical' : m.color + '-500'} bg-${m.id === 'NORMAL' ? 'emerald-50' : m.id === 'RISING' ? 'orange-50' : 'critical/5'}`
                                                : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'
                                                } ${isSimulating && mode !== m.id ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${mode === m.id ? `text-${m.color === 'critical' ? 'critical' : m.color + '-600'}` : 'text-slate-500'}`}>
                                                    {m.label}
                                                </span>
                                                {mode === m.id && <div className={`w-1.5 h-1.5 rounded-full bg-${m.color === 'critical' ? 'critical' : m.color + '-500'}`}></div>}
                                            </div>
                                            <p className="text-[9px] text-slate-400 font-medium mt-0.5">{m.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-50">
                            <button
                                onClick={handleToggleSimulation}
                                className={`w-full group relative overflow-hidden font-black uppercase tracking-widest py-4 px-4 rounded-xl transition-all active:scale-[0.98] ${isSimulating
                                    ? 'bg-critical text-white shadow-lg shadow-critical/20'
                                    : 'bg-secondary text-white shadow-lg shadow-secondary/20 hover:bg-secondary/90'
                                    }`}
                            >
                                <div className="relative z-10 flex items-center justify-center gap-2">
                                    {isSimulating ? <Square size={16} fill="white" /> : <Play size={16} fill="white" />}
                                    <span>{isSimulating ? 'Stop Engine' : 'Energize Simulation'}</span>
                                </div>
                                {isSimulating && <div className="absolute inset-0 bg-white/10 animate-pulse"></div>}
                            </button>
                        </div>
                    </div>

                    {/* Metrics Visualization */}
                    <div className="xl:col-span-2 space-y-6">
                        {/* Summary Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Active Alerts', val: activeAlerts, color: 'text-slate-800', icon: AlertTriangle, iconColor: 'text-amber-500' },
                                { label: 'High Risk', val: highRiskZones, icon: Shield, iconColor: 'text-orange-500' },
                                { label: 'Critical Area', val: criticalZonesCount, icon: Zap, iconColor: 'text-critical' },
                                { label: 'Total Volume', val: totalCrowd.toLocaleString(), icon: User, iconColor: 'text-emerald-500' }
                            ].map((card, i) => (
                                <div key={i} className="card-base hover:border-slate-200">
                                    <div className="flex justify-between items-start mb-2">
                                        <card.icon size={14} className={card.iconColor} />
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{card.label}</span>
                                    </div>
                                    <p className={`text-2xl font-bold text-slate-800 tracking-tight`}>{card.val}</p>
                                </div>
                            ))}
                        </div>

                        {/* Flow Dynamics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="card-base border-l-4 border-l-emerald-500 hover:border-slate-200">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic ml-1">Total Inflow</span>
                                <div className="flex items-baseline gap-1 mt-1">
                                    <p className="text-4xl font-black text-slate-800 tracking-tighter">{entryRate}</p>
                                    <span className="text-[10px] font-bold text-emerald-500 uppercase">p/min</span>
                                </div>
                            </div>
                            <div className="card-base border-l-4 border-l-slate-300 hover:border-slate-200">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic ml-1">Total Outflow</span>
                                <div className="flex items-baseline gap-1 mt-1">
                                    <p className="text-4xl font-black text-slate-800 tracking-tighter">{exitRate}</p>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">p/min</span>
                                </div>
                            </div>
                            <div className={`card-base border-l-4 transition-colors hover:border-slate-200 ${netFlow > 50 ? 'border-l-critical bg-critical/5' : 'border-l-secondary bg-secondary/5'}`}>
                                <span className={`text-[10px] font-bold uppercase tracking-widest italic ml-1 ${netFlow > 50 ? 'text-critical' : 'text-secondary'}`}>Net Dynamics</span>
                                <div className="flex items-baseline gap-1 mt-1">
                                    <p className={`text-4xl font-black tracking-tighter ${netFlow > 50 ? 'text-critical' : 'text-secondary'}`}>
                                        {netFlow > 0 ? `+${netFlow}` : netFlow}
                                    </p>
                                    <span className={`text-[10px] font-bold uppercase ${netFlow > 50 ? 'text-critical' : 'text-secondary'}`}>Net</span>
                                </div>
                            </div>
                        </div>

                        {/* Output Stream Console */}
                        <div className="card-base !p-0 overflow-hidden bg-slate-900 border-slate-900 hover:border-slate-800 shadow-2xl">
                            <div className="px-4 py-2 bg-slate-800 border-b border-white/5 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Terminal size={12} className="text-secondary" />
                                    <span className="text-[9px] font-black text-white/50 uppercase tracking-widest">Kernel Output Stream</span>
                                </div>
                                <div className="flex gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/10"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/10"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/10"></div>
                                </div>
                            </div>
                            <div className="h-[250px] p-4 overflow-y-auto font-mono text-[10px] space-y-2 selection:bg-secondary/30">
                                {isSimulating && lastTickData ? (
                                    <div className="space-y-1.5 animate-in fade-in duration-500">
                                        <p className="text-secondary font-bold">[{new Date().toLocaleTimeString()}] INF: Syncing with Cluster Authority {localStorage.getItem('userNode') || 'NODE-01'}</p>
                                        <p className="text-emerald-400/80">&gt; GLOBAL TICK: MODE={mode} | POLLING=5.0s</p>
                                        <p className="text-white/60">&gt; RESPONSE RECEIVED FROM AI CORE: OK (200)</p>
                                        {lastTickData.logs && lastTickData.logs.map((log, i) => (
                                            <p key={i} className={`text-white/60 ${log.includes('[ALERT]') ? 'text-critical font-bold' : log.includes('[WARN]') ? 'text-orange-400' : ''}`}>&gt; {log}</p>
                                        ))}
                                        {lastTickData.alertsGenerated > 0 ? (
                                            <p className="text-critical font-bold mt-2 animate-pulse">&gt; WARNING: {lastTickData.alertsGenerated} NEW INCIDENTS DISPATCHED TO ACTIVE FEED</p>
                                        ) : (
                                            <p className="text-emerald-500/50 mt-2">&gt; MONITOR: All thresholds within safety margins.</p>
                                        )}
                                        <p className="text-secondary/50 border-t border-white/5 pt-2 mt-4 italic font-sans uppercase tracking-[0.2em] text-[8px] text-center">Simulation Stream Active</p>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center space-y-2 opacity-30">
                                        <Activity size={32} className="text-white" />
                                        <p className="text-white font-bold uppercase tracking-widest italic">Simulation Standing By</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Zone Delta List */}
                <div className="card-base !p-0 overflow-hidden hover:border-slate-200">
                    <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                        <div>
                            <h2 className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">Zone Telemetry Delta</h2>
                            <p className="text-[8px] text-slate-400 font-bold uppercase mt-0.5 tracking-wider">Per-sector simulation influence</p>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs whitespace-nowrap">
                            <thead className="text-[9px] text-slate-400 uppercase tracking-widest bg-slate-50/50">
                                <tr>
                                    <th className="px-6 py-3 font-bold border-b border-slate-100">Zone Designation</th>
                                    <th className="px-6 py-3 font-bold border-b border-slate-100">Current Occupancy</th>
                                    <th className="px-6 py-3 font-bold border-b border-slate-100 text-center">Inflow/min</th>
                                    <th className="px-6 py-3 font-bold border-b border-slate-100 text-center">Outflow/min</th>
                                    <th className="px-6 py-3 font-bold border-b border-slate-100 text-right">Capacity Util.</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50/50">
                                {zones.map(zone => {
                                    const density = zone.capacity ? (zone.currentOccupancy / zone.capacity) : 0;
                                    const isHighRisk = density >= 0.75;
                                    const randIn = Math.floor(Math.random() * 10);
                                    const randOut = Math.floor(Math.random() * 10);
                                    return (
                                        <tr key={zone._id || zone.name} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4 font-bold text-slate-700">{zone.name}</td>
                                            <td className="px-6 py-4">
                                                <span className="text-slate-800 font-bold">{zone.currentOccupancy}</span>
                                                <span className="text-slate-300 ml-1">/ {zone.capacity}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center font-bold text-emerald-500">+{isSimulating ? randIn : 0}</td>
                                            <td className="px-6 py-4 text-center font-bold text-slate-400">-{isSimulating ? randOut : 0}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <span className={`text-[10px] font-black tracking-widest uppercase ${isHighRisk ? 'text-critical' : 'text-secondary'}`}>
                                                        {Math.round(density * 100)}%
                                                    </span>
                                                    <div className="w-16 bg-slate-100 rounded-full h-1 overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${isHighRisk ? 'bg-critical' : 'bg-secondary'}`}
                                                            style={{ width: `${Math.min(density * 100, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CrowdFlowDashboard;
