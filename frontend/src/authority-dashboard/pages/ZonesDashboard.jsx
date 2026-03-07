import React, { useState, useEffect } from 'react';
import ZoneCard from '../components/ZoneCard';
import SimulatedLiveMap from '../components/SimulatedLiveMap';
import API_BASE_URL from '../../config';

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
                fetch(`${API_BASE_URL}/api/authority/zones`, { headers }),
                fetch(`${API_BASE_URL}/api/authority/alerts`, { headers })
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
        <div className="space-y-6">
            {/* Header */}
            <header className="mb-4">
                <div className="flex justify-between items-center w-full">
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 tracking-tight uppercase">Zones Monitoring</h1>
                        <p className="text-[10px] font-medium text-slate-400 mt-1 tracking-wider uppercase">Live tracking of all zones assigned to your authority node.</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="flex items-center space-x-2 bg-white border border-emerald-100 shadow-sm px-3 py-1.5 rounded-lg">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Live Monitoring</span>
                        </div>
                        <span className="text-[9px] text-slate-400 mt-1 font-bold tracking-widest uppercase">Updating every 5 seconds</span>
                    </div>
                </div>
            </header>

            <main className="flex flex-col lg:flex-row gap-6">
                {/* Simulated Live Map (Digital Twin) */}
                <div className="flex-1 min-h-[500px] flex flex-col card-base !p-0 overflow-hidden hover:border-slate-200">
                    <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Digital Twin View</h3>
                            <p className="text-[10px] text-slate-400 font-medium uppercase mt-0.5 tracking-wider">Interactive spatial crowd simulation</p>
                        </div>
                    </div>
                    <div className="flex-1 relative">
                        <SimulatedLiveMap zones={zones} alerts={alerts} />
                    </div>
                </div>

                {/* Zone Cards Grid */}
                <div className="w-full lg:w-[400px] card-base !p-0 overflow-hidden flex flex-col hover:border-slate-200">
                    <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50">
                        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Live Zone Details</h2>
                        <p className="text-[10px] text-slate-400 font-medium uppercase mt-0.5 tracking-wider">Assigned area telemetry</p>
                    </div>
                    <div className="flex-1 overflow-y-auto max-h-[700px] p-4 space-y-4 bg-slate-50/30">
                        {zones.map(zone => (
                            <ZoneCard key={zone._id} zone={zone} />
                        ))}
                        {zones.length === 0 && (
                            <div className="py-12 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                Loading assigned zones...
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ZonesDashboard;
