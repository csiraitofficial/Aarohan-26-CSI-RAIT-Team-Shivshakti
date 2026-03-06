import React, { useState, useEffect, useRef } from 'react';
import '../Theme.css';
import Sidebar from '../components/Sidebar';

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
            const token = localStorage.getItem('token');
            const headers = {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            };
            const [zonesRes, alertsRes] = await Promise.all([
                fetch('http://localhost:5000/api/authority/zones', { headers }),
                fetch('http://localhost:5000/api/authority/alerts', { headers })
            ]);

            if (zonesRes.ok) {
                const zData = await zonesRes.json();
                setZones(zData.data || []);
            }
            if (alertsRes.ok) {
                const aData = await alertsRes.json();
                setAlerts(aData.data || []);
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
            const response = await fetch('http://localhost:5000/api/simulate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ mode: mode }) // Global mode, no zoneId
            });

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const data = await response.json();
            setLastTickData(data);
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
    const entryRate = zones.reduce((sum, z) => sum + (z.entryCount || 0), 0);
    const exitRate = zones.reduce((sum, z) => sum + (z.exitCount || 0), 0);
    const netFlow = entryRate - exitRate;

    const activeAlerts = alerts.filter(a => a.status !== 'RESOLVED').length;
    const highRiskZones = zones.filter(z => (z.capacity ? (z.currentOccupancy / z.capacity) : 0) >= 0.75).length;
    const criticalZones = zones.filter(z => (z.capacity ? (z.currentOccupancy / z.capacity) : 0) >= 0.90).length;
    const totalCrowd = zones.reduce((sum, z) => sum + (z.currentOccupancy || 0), 0);

    return (
        <div className="flex w-full h-full authority-dashboard-container overflow-hidden bg-[var(--color-background)]">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-y-auto w-full relative">
                <header className="px-6 py-6 mb-4 border-b border-gray-200 bg-white sticky top-0 z-40 shadow-sm">
                    <div className="flex justify-between items-center max-w-[1600px] mx-auto w-full">
                        <div>
                            <h1 className="text-2xl font-black text-[var(--color-primary)] tracking-tight uppercase">Crowd Flow (Simulation Control)</h1>
                            <p className="text-sm font-medium text-gray-500 mt-1">Control the simulation engine to project crowd conditions and test resilience.</p>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200">
                                <span className={`flex h-2.5 w-2.5 relative ${isSimulating ? '' : 'hidden'}`}>
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                                </span>
                                <span className="text-xs font-bold text-blue-700 tracking-wider">
                                    {isSimulating ? 'ENGINE ACTIVE' : 'ENGINE STANDBY'}
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 max-w-[1600px] mx-auto w-full px-6 pb-8 flex flex-col space-y-6">
                    {/* Top Row: Controls & Flow Rates */}
                    <div className="flex flex-col xl:flex-row space-y-6 xl:space-y-0 xl:space-x-6">
                        {/* Controls Column */}
                        <div className="w-full xl:w-1/3 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
                            <h2 className="text-lg font-black text-[var(--color-primary)] uppercase tracking-wide mb-4 flex items-center">
                                <svg className="w-6 h-6 mr-2 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                                Engine Parameters
                            </h2>
                            <div className="space-y-4 flex-1">
                                <div className="flex flex-col">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Simulated Condition</label>
                                    <div className="grid grid-cols-1 gap-2">
                                        <button
                                            onClick={() => setMode('NORMAL')}
                                            disabled={isSimulating}
                                            className={`py-3 px-4 rounded-lg font-bold text-sm tracking-wider uppercase border-2 transition-all ${mode === 'NORMAL' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'} ${isSimulating && mode !== 'NORMAL' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            Normal Mode
                                        </button>
                                        <button
                                            onClick={() => setMode('RISING')}
                                            disabled={isSimulating}
                                            className={`py-3 px-4 rounded-lg font-bold text-sm tracking-wider uppercase border-2 transition-all ${mode === 'RISING' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'} ${isSimulating && mode !== 'RISING' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            Rising Mode
                                        </button>
                                        <button
                                            onClick={() => setMode('CRITICAL')}
                                            disabled={isSimulating}
                                            className={`py-3 px-4 rounded-lg font-bold text-sm tracking-wider uppercase border-2 transition-all ${mode === 'CRITICAL' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'} ${isSimulating && mode !== 'CRITICAL' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            Critical Mode
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <button
                                    onClick={handleToggleSimulation}
                                    className={`w-full font-black uppercase tracking-widest py-4 px-4 rounded-lg shadow-lg transition-transform transform active:scale-95 ${isSimulating
                                        ? 'bg-red-500 hover:bg-red-600 text-white shadow-[0_4px_15px_rgba(239,68,68,0.4)]'
                                        : 'bg-[var(--color-secondary)] hover:bg-[#008bc0] text-white shadow-[0_4px_15px_rgba(0,174,239,0.4)]'
                                        }`}
                                >
                                    {isSimulating ? 'STOP SIMULATION' : 'START SIMULATION'}
                                </button>
                            </div>
                        </div>

                        {/* Metrics Visualization */}
                        <div className="w-full xl:w-2/3 flex flex-col space-y-6">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col items-center justify-center text-center">
                                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Active Alerts</h3>
                                    <p className="text-3xl font-black text-[var(--color-primary)]">{activeAlerts}</p>
                                </div>
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col items-center justify-center text-center">
                                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">High Risk Zones</h3>
                                    <p className="text-3xl font-black text-orange-500">{highRiskZones}</p>
                                </div>
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col items-center justify-center text-center">
                                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Critical Zones</h3>
                                    <p className="text-3xl font-black text-red-600">{criticalZones}</p>
                                </div>
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col items-center justify-center text-center">
                                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Crowd</h3>
                                    <p className="text-3xl font-black text-emerald-600">{totalCrowd.toLocaleString()}</p>
                                </div>
                            </div>

                            {/* Flow Rate Cards */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400"></div>
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Total Entry Rate</h3>
                                    <p className="text-4xl font-black text-emerald-500">{entryRate}<span className="text-sm text-gray-400 ml-1">/min</span></p>
                                </div>
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-400"></div>
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Total Exit Rate</h3>
                                    <p className="text-4xl font-black text-gray-600">{exitRate}<span className="text-sm text-gray-400 ml-1">/min</span></p>
                                </div>
                                <div className={`bg-white rounded-xl shadow-sm border p-6 flex flex-col items-center justify-center text-center relative overflow-hidden transition-colors ${netFlow > 50 ? 'border-red-200 bg-red-50' : 'border-[var(--color-primary)] bg-[var(--color-primary)] bg-opacity-5'}`}>
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${netFlow > 50 ? 'bg-red-500' : 'bg-[var(--color-primary)]'}`}></div>
                                    <h3 className={`text-xs font-bold uppercase tracking-widest mb-2 ${netFlow > 50 ? 'text-red-600' : 'text-[var(--color-primary)]'}`}>Net Crowd Flow</h3>
                                    <p className={`text-4xl font-black ${netFlow > 50 ? 'text-red-600' : 'text-[var(--color-primary)]'}`}>{netFlow > 0 ? `+${netFlow}` : netFlow}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row: Zone Details & Event Log */}
                    <div className="flex flex-col xl:flex-row space-y-6 xl:space-y-0 xl:space-x-6 h-[400px]">
                        {/* Live Zone Details */}
                        <div className="w-full xl:w-1/2 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
                                <h2 className="text-sm font-black text-[var(--color-primary)] uppercase tracking-widest">Live Zone Details</h2>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                <ul className="divide-y divide-gray-100">
                                    {zones.map(zone => {
                                        const density = zone.capacity ? (zone.currentOccupancy / zone.capacity) : 0;
                                        const isHighRisk = density >= 0.75;
                                        return (
                                            <li key={zone._id} className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center">
                                                <div>
                                                    <h4 className="text-sm font-bold text-gray-800">{zone.zoneName}</h4>
                                                    <div className="flex space-x-3 mt-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                        <span>In: <span className="text-emerald-500">{zone.entryCount || 0}</span></span>
                                                        <span>Out: <span className="text-gray-600">{zone.exitCount || 0}</span></span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`text-sm font-black ${isHighRisk ? 'text-red-600' : 'text-[var(--color-primary)]'}`}>
                                                        {Math.round(density * 100)}% Full
                                                    </p>
                                                    <p className="text-[10px] font-medium text-gray-400">
                                                        {zone.currentOccupancy} / {zone.capacity}
                                                    </p>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>

                        {/* Event Log */}
                        <div className="w-full xl:w-1/2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                                <h3 className="text-sm font-black text-[var(--color-primary)] uppercase tracking-wider">Simulation Output Stream</h3>
                                {isSimulating && <span className="text-[10px] text-gray-500 font-mono animate-pulse">Running live hooks...</span>}
                            </div>
                            <div className="flex-1 p-6 bg-gray-900 overflow-y-auto font-mono text-xs">
                                {isSimulating && lastTickData ? (
                                    <div className="space-y-3 text-emerald-400">
                                        <div className="border-l-2 border-emerald-500 pl-3">
                                            <p>[{new Date().toLocaleTimeString()}] TICK: {mode} ENGINE V2</p>
                                        </div>
                                        <p className="pl-4 text-emerald-200">&gt; GLOBAL RESPONSE: {lastTickData.message}</p>
                                        <p className="pl-4 text-emerald-200">&gt; ALERTS SPAWNED: {lastTickData.alertsGenerated || 0}</p>
                                        <p className="pl-4 text-emerald-200">&gt; POLLING SYNCHRONIZED ACROSS {zones.length} ZONES.</p>
                                        <p className="pl-4 text-emerald-200">&gt; OVERRIDING NET CAPACITIES GLOBALLY.</p>
                                        {lastTickData.alertsGenerated > 0 && (
                                            <p className="pl-4 text-red-400 animate-pulse">&gt; WARNING: CRITICAL THRESHOLDS BREACHED IN ROUTING LOOP!</p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-gray-600 italic">Simulation halted. Engine is holding patterns.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CrowdFlowDashboard;
