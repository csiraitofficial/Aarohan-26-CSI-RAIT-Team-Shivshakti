import React, { useState, useEffect } from 'react';
import '../Theme.css';
import Sidebar from '../components/Sidebar';
import ZoneCard from '../components/ZoneCard';
import SimulatedLiveMap from '../components/SimulatedLiveMap';

const ZonesDashboard = () => {
    const [zones, setZones] = useState([]);
    const [alerts, setAlerts] = useState([]);

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
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex w-full h-full authority-dashboard-container overflow-hidden bg-[var(--color-background)]">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-y-auto w-full relative">
                {/* Header */}
                <header className="px-6 py-6 mb-4 border-b border-gray-200 bg-white sticky top-0 z-40 shadow-sm">
                    <div className="flex justify-between items-center max-w-[1600px] mx-auto w-full">
                        <div>
                            <h1 className="text-2xl font-black text-[var(--color-primary)] tracking-tight uppercase">Zones Monitoring</h1>
                            <p className="text-sm font-medium text-gray-500 mt-1">Live tracking of all zones assigned to your authority node.</p>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                                <span className="flex h-2.5 w-2.5 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                </span>
                                <span className="text-xs font-bold text-emerald-700 tracking-wider">Live Monitoring</span>
                            </div>
                            <span className="text-[10px] text-gray-400 mt-1 font-mono font-bold tracking-widest uppercase">Updating every 5 seconds</span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 max-w-[1700px] mx-auto w-full px-6 pb-8 flex flex-col xl:flex-row gap-6">
                    {/* Simulated Live Map (Digital Twin) */}
                    <div className="w-full xl:w-2/3 h-[500px] xl:h-auto min-h-[500px] flex flex-col">
                        <SimulatedLiveMap zones={zones} alerts={alerts} />
                    </div>

                    {/* Zone Cards Grid */}
                    <div className="w-full xl:w-1/3 flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                            <h2 className="text-sm font-black text-[var(--color-primary)] uppercase tracking-widest">Live Zone Details</h2>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {zones.map(zone => (
                                <ZoneCard key={zone._id} zone={zone} />
                            ))}
                            {zones.length === 0 && (
                                <div className="py-12 text-center text-gray-400 font-bold uppercase tracking-widest">
                                    Loading assigned zones...
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ZonesDashboard;
