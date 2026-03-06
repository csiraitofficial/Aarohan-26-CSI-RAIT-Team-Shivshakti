import React, { useState, useEffect } from 'react';
import { useDashboardContext } from '../context/DashboardContext';

export default function OverviewPage() {
    const { zones, alerts, user, getUserLocationZone, getZoneById, getRiskColorInfo } = useDashboardContext();
    const [mapSrc, setMapSrc] = useState("https://maps.google.com/maps?q=stadium&t=&z=16&ie=UTF8&iwloc=&output=embed");

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setMapSrc(`https://maps.google.com/maps?q=${lat},${lng}&t=&z=16&ie=UTF8&iwloc=&output=embed`);
                },
                (error) => console.warn("Geolocation permission denied/failed", error)
            );
        }
    }, []);

    const locationZone = getUserLocationZone();
    const activeAlerts = alerts.filter(a => a.type === 'Critical' || a.type === 'Warning');
    const highRiskZones = zones.filter(z => z.riskLevel === 'High' || z.riskLevel === 'Critical');
    
    const avgDensity = Math.round(zones.reduce((acc, z) => acc + z.density, 0) / zones.length);

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Top KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Active Zones</span>
                        <svg className="w-5 h-5 text-[#00AEEF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                    </div>
                    <div className="text-3xl font-bold text-[#002868]">{zones.length} monitored</div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">High Risk Zones</span>
                        <svg className="w-5 h-5 text-[#FF6B35]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-[#F97316]">{highRiskZones.length}</span>
                        <span className="text-sm font-medium text-gray-500">Require caution</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Avg. Crowd Level</span>
                        <svg className="w-5 h-5 text-[#00AEEF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-[#002868]">{avgDensity}%</span>
                        <span className="text-sm font-medium text-gray-500">Across all zones</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Active Alerts</span>
                        <svg className="w-5 h-5 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-[#EF4444]">{activeAlerts.length}</span>
                        <span className="text-sm font-medium text-gray-500">Unread</span>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Personalized Panel */}
                <div className="lg:col-span-2 space-y-6">
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-[#002868] px-6 py-4 flex items-center gap-3 text-white">
                            <span className="p-2 bg-white/10 rounded-lg">
                                <svg className="w-5 h-5 shrink-0 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            </span>
                            <h2 className="text-lg font-bold">Your Surroundings</h2>
                        </div>
                        <div className="flex flex-col">
                            {/* Embedded Google Map Section */}
                            <div className="relative w-full h-[400px] bg-gray-100 border-b border-gray-100">
                                <iframe 
                                    src={mapSrc} 
                                    className="absolute inset-0 w-full h-full border-0 z-0 opacity-80"
                                    title="Surroundings Map"
                                    style={{ filter: 'grayscale(0.3) contrast(1.1) brightness(1.05)' }}
                                    allow="geolocation"
                                />
                                
                                {/* Map User Pin (Center) */}
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center pointer-events-none">
                                    <span className="absolute inline-flex h-12 w-12 rounded-full bg-blue-400 opacity-40 animate-ping"></span>
                                    <span className="absolute inline-flex h-20 w-20 rounded-full bg-blue-100 opacity-20"></span>
                                    <span className="relative inline-flex rounded-full h-5 w-5 bg-blue-600 border-2 border-white shadow-xl"></span>
                                </div>
                            </div>

                            {/* Info Panel Below Map */}
                            <div className="w-full bg-white p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                
                                {/* Left/Top - Current Location & History */}
                                <div className="space-y-6 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Current Location</h3>
                                        <p className="text-2xl font-black text-[#002868] leading-tight mb-2">{locationZone.name}</p>
                                        <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold ${locationZone.colorInfo.bgClass}/10 ${locationZone.colorInfo.textClass} border ${locationZone.colorInfo.textClass.replace('text', 'border')}/20`}>
                                            <span className={`w-2 h-2 rounded-full mr-2 ${locationZone.colorInfo.bgClass} flex-shrink-0 animate-pulse`}></span>
                                            {locationZone.riskLevel} Risk
                                        </div>
                                    </div>
                                    
                                    <div className="pt-4 border-t border-gray-100 mt-auto">
                                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Location History</h3>
                                        <ul className="space-y-2">
                                            {user.history.map((id, index) => {
                                                const z = getZoneById(id);
                                                const times = ["12:00 PM", "12:15 PM", "12:45 PM"];
                                                return z ? (
                                                    <li key={index} className="flex items-center gap-3 text-sm">
                                                        <span className="text-gray-400 font-bold w-20">{times[index] || "1:00 PM"}</span>
                                                        <span className="text-gray-700 font-semibold">- {z.name}</span>
                                                    </li>
                                                ) : null;
                                            })}
                                        </ul>
                                    </div>
                                </div>

                                {/* Right/Bottom - Suggestions */}
                                <div className="space-y-6">
                                    {/* Avoid Areas */}
                                    <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                                        <h3 className="text-sm font-bold text-orange-800 uppercase tracking-widest flex items-center gap-2 mb-3">
                                            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                                            Avoid Places
                                        </h3>
                                        <ul className="space-y-2">
                                            {highRiskZones.slice(0, 2).map(z => (
                                                <li key={z.id} className="flex flex-col text-sm border-l-2 border-orange-500 pl-3">
                                                    <span className="text-gray-900 font-bold">{z.name}</span>
                                                    <span className="text-orange-600 font-semibold">{z.density}% Full</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Suggested Areas */}
                                    <div className="bg-[#00AEEF]/5 p-4 rounded-xl border border-[#00AEEF]/20">
                                        <h3 className="text-sm font-bold text-[#002868] uppercase tracking-widest flex items-center gap-2 mb-3">
                                            <svg className="w-4 h-4 shrink-0 text-[#00AEEF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/></svg>
                                            Suggested
                                        </h3>
                                        <ul className="space-y-2">
                                            {zones.filter(z => z.riskLevel === 'Low').slice(0, 2).map(z => (
                                                <li key={z.id} className="flex flex-col text-sm border-l-2 border-[#00AEEF] pl-3">
                                                    <span className="text-gray-900 font-bold">{z.name}</span>
                                                    <span className="text-[#00AEEF] font-semibold">Only {z.density}% Full</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column: Zone Progress Bars */}
                <div className="lg:col-span-1 space-y-6">
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full flex flex-col">
                        <h2 className="text-lg font-bold text-[#002868] mb-6 flex items-center gap-2">
                            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10"></path><path d="M12 20V4"></path><path d="M6 20v-6"></path></svg>
                            Live Zone Status
                        </h2>
                        
                        <div className="space-y-5">
                            {zones.map(z => (
                                <div key={z.id} className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-sm font-bold text-gray-800">{z.name}</span>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${z.colorInfo.bgClass}/10 ${z.colorInfo.textClass}`}>
                                            {z.riskLevel}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                        <div className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${z.colorInfo.bgClass}`} style={{ width: `${z.density}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

            </div>
        </div>
    );
}
