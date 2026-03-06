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
        <div className="space-y-6 font-sans animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h2 className="text-2xl font-bold text-[#002868] flex items-center gap-2">
                        <LayoutDashboard className="w-6 h-6 text-[#00AEEF]" />
                        Zone Configuration
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Manage monitoring sectors, capacity limits, and alert thresholds.</p>
                </div>
                <button
                    onClick={handleAddZone}
                    className="flex items-center gap-2 bg-[#002868] text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-[#001f52] transition-colors font-bold text-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add Zone
                </button>
            </div>

            {/* Grid of Zone Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {zones.map((zone) => {
                    const metrics = getZoneMetrics(zone.current, zone.capacity);

                    return (
                        <div key={zone.id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            {/* Card Header */}
                            <div className="p-5 border-b border-gray-50">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-gray-800 text-lg line-clamp-1">{zone.name}</h3>
                                    <button
                                        onClick={() => setActiveTab('command-center')}
                                        className="text-gray-400 hover:text-[#00AEEF] transition-colors bg-gray-50 p-1.5 rounded-md"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span className="truncate">{zone.location}</span>
                                </div>
                            </div>

                            {/* Card Body (Metrics) */}
                            <div className="p-5 bg-gray-50/50">
                                <div className="flex justify-between items-end mb-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Live Occupancy</p>
                                            {zone.isHistory && (
                                                <span className="text-[9px] font-bold bg-[#002868]/10 text-[#002868] px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                                                    Manage Crowd Tracker
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-black text-[#002868] tracking-tight">{zone.current.toLocaleString()}</span>
                                            <span className="text-xs font-bold text-gray-500">/ {zone.capacity.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded border ${metrics.badgeColor}`}>
                                        {metrics.status}
                                    </span>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden mb-2">
                                    <div
                                        className={`h-full transition-all duration-1000 ease-out ${metrics.barColor}`}
                                        style={{ width: `${Math.min(Number(metrics.percentage), 100)}%` }}
                                    ></div>
                                </div>

                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-bold text-gray-400">{metrics.percentage}% Full</span>
                                    {metrics.status === 'Critical' && (
                                        <span className="flex items-center gap-1 text-red-600 font-bold">
                                            <AlertTriangle className="w-3 h-3" /> Overload Warning
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
