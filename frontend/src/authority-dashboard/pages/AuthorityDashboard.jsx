import React, { useState, useEffect } from 'react';
import '../Theme.css';
import Sidebar from '../components/Sidebar';
import TelemetryFooter from '../components/TelemetryFooter';

const AuthorityDashboard = () => {
    const [zones, setZones] = useState([]);
    const [alerts, setAlerts] = useState([]);

    // Fetch live data from backend
    const fetchDashboardData = async () => {
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
                const zonesData = await zonesRes.json();
                setZones(zonesData.data || []);
            }
            if (alertsRes.ok) {
                const alertsData = await alertsRes.json();
                setAlerts(alertsData.data || []);
            }
        } catch (error) {
            console.error("Error fetching dashboard telemetry:", error);
        }
    };

    // Initial load & Polling
    useEffect(() => {
        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 5000);
        return () => clearInterval(interval);
    }, []);

    // Derived Metrics
    const activeAlerts = alerts.filter(a => a.status !== 'RESOLVED').length;
    const highRiskZones = zones.filter(z => (z.capacity ? (z.currentOccupancy / z.capacity) : 0) >= 0.75).length;
    const criticalZones = zones.filter(z => (z.capacity ? (z.currentOccupancy / z.capacity) : 0) >= 0.90).length;
    const totalCrowd = zones.reduce((sum, z) => sum + (z.currentOccupancy || 0), 0);

    const getRiskLevel = (density) => {
        if (density >= 0.9) return { label: 'CRITICAL', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' };
        if (density >= 0.75) return { label: 'HIGH', color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' };
        if (density >= 0.5) return { label: 'MEDIUM', color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' };
        return { label: 'SAFE', color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    };

    return (
        <div className="flex w-full h-full authority-dashboard-container overflow-hidden">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-y-auto w-full relative">
                {/* Header */}
                <header className="px-6 py-4 mb-4 border-b border-gray-200 bg-white bg-opacity-80 backdrop-blur-md sticky top-0 z-50">
                    <div className="flex justify-between items-center max-w-[1600px] mx-auto w-full">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-[var(--color-primary)] rounded-lg flex items-center justify-center shadow-md">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                            </div>
                            <div>
                                <h1 className="text-xl font-black text-[var(--color-primary)] tracking-tight uppercase">Authority Command Center</h1>
                                <p className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Real-time crowd monitoring and alert system</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-1 text-emerald-700 border border-emerald-200 rounded-full mb-1">
                                <span className="flex h-2.5 w-2.5 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                </span>
                                <span className="text-xs font-bold tracking-widest">System Status: LIVE</span>
                            </div>
                            <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">Updating every 5 seconds</span>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 max-w-[1600px] mx-auto w-full px-6 pb-8 flex flex-col space-y-6">

                    {/* 4 Summary Cards */}
                    <div className="grid grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col justify-center">
                            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-1">Active Alerts</h3>
                            <p className="text-4xl font-black text-[var(--color-primary)]">{activeAlerts}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col justify-center">
                            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-1">High Risk Zones</h3>
                            <p className="text-4xl font-black text-orange-500">{highRiskZones}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col justify-center">
                            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-1">Critical Zones</h3>
                            <p className="text-4xl font-black text-red-500">{criticalZones}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col justify-center">
                            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-1">Total Crowd</h3>
                            <p className="text-4xl font-black text-[var(--color-primary)]">{totalCrowd.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="flex flex-1 min-h-0">
                        {/* Live Zone Status Panel */}
                        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                            <div className="px-5 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                                <h2 className="text-sm font-black text-[var(--color-primary)] uppercase tracking-widest">Zone Status Overview</h2>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {zones.map(zone => {
                                        const density = zone.capacity > 0 ? (zone.currentOccupancy / zone.capacity) : 0;
                                        const risk = getRiskLevel(density);
                                        const netFlow = (zone.entryCount || 0) - (zone.exitCount || 0);
                                        return (
                                            <div key={zone._id} className={`p-5 rounded-lg border ${risk.bg} ${risk.border} flex flex-col justify-between shadow-sm`}>
                                                <div className="flex justify-between items-center mb-4">
                                                    <h3 className="font-bold text-gray-800 text-lg">{zone.zoneName}</h3>
                                                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider bg-white ${risk.color} border ${risk.border}`}>{risk.label}</span>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 mb-4">
                                                    <div>
                                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Occupancy</p>
                                                        <p className="font-mono font-black text-gray-800 text-lg">{zone.currentOccupancy} <span className="text-xs text-gray-500 font-medium">/ {zone.capacity}</span></p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Density</p>
                                                        <p className={`font-black text-lg ${risk.color}`}>{Math.round(density * 100)}%</p>
                                                    </div>
                                                </div>

                                                <div className="bg-white bg-opacity-60 rounded-lg p-3 border border-gray-100 flex justify-between items-center">
                                                    <div className="text-center">
                                                        <p className="text-[9px] uppercase tracking-widest text-emerald-600 font-bold">Entry</p>
                                                        <p className="text-sm font-bold text-gray-800">+{zone.entryCount || 0}/m</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">Exit</p>
                                                        <p className="text-sm font-bold text-gray-800">-{zone.exitCount || 0}/m</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-[9px] uppercase tracking-widest text-[var(--color-primary)] font-bold">Net Flow</p>
                                                        <p className={`text-sm font-black ${netFlow > 0 ? 'text-[var(--color-primary)]' : 'text-gray-500'}`}>{netFlow > 0 ? `+${netFlow}` : netFlow}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                {zones.length === 0 && <p className="text-center text-gray-400 text-sm py-10">Loading zones...</p>}
                            </div>
                        </div>
                    </div>

                </main>

                <TelemetryFooter />
            </div>

        </div>
    );
};

export default AuthorityDashboard;
