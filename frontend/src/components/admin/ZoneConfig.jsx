import React, { useState } from 'react';
import { Plus, Edit2, LayoutDashboard, MapPin, Users, AlertTriangle } from 'lucide-react';

export default function ZoneConfig({ setActiveTab }) {
    const [zones, setZones] = useState(() => {
        const savedHistory = JSON.parse(localStorage.getItem('crowdHistory') || '[]');

        const defaultZones = [
            { id: 1, name: 'Mumbai CST Station', location: 'Platform 1 & 2', capacity: 15000, current: 14200, type: 'Transit' },
            { id: 2, name: 'DY Patil Stadium', location: 'North Stand', capacity: 35000, current: 28000, type: 'Stadium' },
            { id: 3, name: 'Gateway of India', location: 'Main Plaza', capacity: 5000, current: 3200, type: 'Public Square' },
            { id: 4, name: 'Wankhede Stadium', location: 'Garware Pavilion', capacity: 12000, current: 4500, type: 'Stadium' },
            { id: 5, name: 'Bandra Bandstand', location: 'Promenade', capacity: 8000, current: 7500, type: 'Public Space' },
            { id: 6, name: 'Dadar Market', location: 'Flower Market Area', capacity: 10000, current: 9800, type: 'Market' },
        ];

        return [...savedHistory, ...defaultZones];
    });

    const handleAddZone = () => {
        // As requested by user: Add Zone button routes back to Manage Crowd
        setActiveTab('crowd');
    };

    // Helper functions for dynamic styling based on Capacity vs Current
    const getZoneMetrics = (current, capacity) => {
        const percentage = (current / capacity) * 100;

        let status = 'Low';
        let badgeColor = 'bg-green-100 text-green-800 border-green-200';
        let barColor = 'bg-green-500';

        if (percentage >= 90) {
            status = 'Critical';
            badgeColor = 'bg-red-100 text-red-800 border-red-200 animate-pulse';
            barColor = 'bg-red-600';
        } else if (percentage >= 75) {
            status = 'High';
            badgeColor = 'bg-orange-100 text-orange-800 border-orange-200';
            barColor = 'bg-orange-500';
        } else if (percentage >= 50) {
            status = 'Moderate';
            badgeColor = 'bg-yellow-100 text-yellow-800 border-yellow-200';
            barColor = 'bg-yellow-400';
        }

        return { percentage: percentage.toFixed(1), status, badgeColor, barColor };
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Zone Monitoring Console</h2>
                    <p className="text-[10px] text-slate-400 font-medium uppercase mt-0.5 tracking-wider">Configure monitoring sectors and safety thresholds</p>
                </div>
                <button
                    onClick={handleAddZone}
                    className="btn-primary !py-2 !px-4 text-xs flex items-center gap-2"
                >
                    <Plus size={16} />
                    Add Sector
                </button>
            </div>

            {/* Grid of Zone Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {zones.map((zone) => {
                    const metrics = getZoneMetrics(zone.current, zone.capacity);

                    return (
                        <div key={zone.id} className="card-base !p-0 overflow-hidden group hover:border-secondary transition-all">
                            {/* Card Header */}
                            <div className="p-5 border-b border-slate-50">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-slate-800 text-lg tracking-tight group-hover:text-primary transition-colors">{zone.name}</h3>
                                    <button
                                        onClick={() => setActiveTab('command-center')}
                                        className="text-slate-300 hover:text-secondary transition-colors bg-slate-50 p-1.5 rounded-lg"
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 uppercase tracking-wider">
                                    <MapPin size={12} />
                                    <span className="truncate">{zone.location}</span>
                                </div>
                            </div>

                            {/* Card Body (Metrics) */}
                            <div className="p-5 bg-slate-50/30">
                                <div className="flex justify-between items-end mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-[10px] font-bold tracking-[0.1em] text-slate-400 uppercase">Current Capacity</p>
                                            {zone.isHistory && (
                                                <span className="text-[9px] font-bold bg-secondary/10 text-secondary px-1.5 py-0.5 rounded uppercase tracking-wider">
                                                    Tracked
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-bold text-slate-800 tracking-tight">{zone.current.toLocaleString()}</span>
                                            <span className="text-xs font-medium text-slate-400">/ {zone.capacity.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest rounded border ${metrics.badgeColor}`}>
                                        {metrics.status}
                                    </span>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-3">
                                    <div
                                        className={`h-full transition-all duration-1000 ease-out ${metrics.barColor} shadow-inner`}
                                        style={{ width: `${Math.min(Number(metrics.percentage), 100)}%` }}
                                    ></div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{metrics.percentage}% Density</span>
                                    {metrics.status === 'Critical' && (
                                        <span className="flex items-center gap-1 text-critical font-bold text-[10px] uppercase tracking-widest animate-pulse">
                                            <AlertTriangle size={10} /> Critical Load
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
