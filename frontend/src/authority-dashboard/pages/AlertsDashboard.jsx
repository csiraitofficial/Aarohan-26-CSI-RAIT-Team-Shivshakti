import React, { useState, useEffect } from 'react';
import '../Theme.css';
import Sidebar from '../components/Sidebar';

const AlertsDashboard = () => {
    // State
    const [alerts, setAlerts] = useState([]);
    const [zones, setZones] = useState([]);
    const [selectedAlert, setSelectedAlert] = useState(null);

    // Fetch data
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
                const zData = await zonesRes.json();
                setZones(zData.data || []);
            }
            if (alertsRes.ok) {
                const aData = await alertsRes.json();
                setAlerts(aData.data || []);
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Polling
    useEffect(() => {
        fetchDashboardData();
        const interval = setInterval(() => {
            fetchDashboardData();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Summary calculations
    const activeAlerts = alerts.filter(a => a.status !== 'RESOLVED').length;

    // Zones mapped dynamically
    // High Risk Zones: density >= 75%
    const highRiskZones = zones.filter(z => (z.capacity ? (z.currentOccupancy / z.capacity) : 0) >= 0.75).length;

    // Critical Alerts: zones >= 90%
    const criticalAlerts = alerts.filter(a => a.severity === 'CRITICAL' && a.status !== 'RESOLVED').length;

    // Surge Warnings (type SURGE)
    const surgeWarnings = alerts.filter(a => (a.alertType === 'SURGE' || a.alertType === 'DENSITY') && a.status !== 'RESOLVED').length;

    const getSeverityDetails = (severity) => {
        switch (severity) {
            case 'CRITICAL': return { color: 'text-red-600', bg: 'bg-red-100', dot: 'bg-red-500' };
            case 'HIGH': return { color: 'text-orange-600', bg: 'bg-orange-100', dot: 'bg-orange-500' };
            case 'WARNING': return { color: 'text-yellow-600', bg: 'bg-yellow-100', dot: 'bg-yellow-500' };
            default: return { color: 'text-emerald-600', bg: 'bg-emerald-100', dot: 'bg-emerald-500' };
        }
    };

    return (
        <div className="flex w-full h-full authority-dashboard-container overflow-hidden bg-[var(--color-background)]">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-y-auto w-full relative">
                {/* 1. Page Header */}
                <header className="px-6 py-6 mb-4 border-b border-gray-200 bg-white sticky top-0 z-40 shadow-sm">
                    <div className="flex justify-between items-center max-w-[1600px] mx-auto w-full">
                        <div>
                            <h1 className="text-2xl font-black text-[var(--color-primary)] tracking-tight uppercase">Crowd Alerts Monitoring</h1>
                            <p className="text-sm font-medium text-gray-500 mt-1">Real-time alerts for crowd density and surge detection across zones.</p>
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

                <main className="flex-1 max-w-[1600px] mx-auto w-full px-6 pb-8 flex space-x-6">

                    <div className={`flex-1 flex flex-col space-y-6 transition-all duration-300 ${selectedAlert ? 'w-2/3' : 'w-full'}`}>
                        {/* 2. Alert Summary Cards */}
                        <div className="grid grid-cols-4 gap-4">
                            {/* Card 1 */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 relative overflow-hidden transition-shadow hover:shadow-md">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-full -z-10"></div>
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                                    </div>
                                    <h3 className="text-sm font-bold text-gray-700">Active Alerts</h3>
                                </div>
                                <p className="text-4xl font-black text-[var(--color-primary)] tracking-tight">{activeAlerts}</p>
                                <p className="text-xs font-medium text-gray-500 mt-1">Currently open alerts</p>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 relative overflow-hidden transition-shadow hover:shadow-md">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-orange-50 rounded-bl-full -z-10"></div>
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                    </div>
                                    <h3 className="text-sm font-bold text-gray-700">High Risk Zones</h3>
                                </div>
                                <p className="text-4xl font-black text-orange-500 tracking-tight">{highRiskZones}</p>
                                <p className="text-xs font-medium text-gray-500 mt-1">Density above 75%</p>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 relative overflow-hidden transition-shadow hover:shadow-md">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-red-50 rounded-bl-full -z-10"></div>
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="p-2 bg-red-100 rounded-lg text-red-600">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    </div>
                                    <h3 className="text-sm font-bold text-gray-700">Critical Alerts</h3>
                                </div>
                                <p className="text-4xl font-black text-red-600 tracking-tight">{criticalAlerts}</p>
                                <p className="text-xs font-medium text-gray-500 mt-1">Zones nearing capacity</p>
                            </div>

                            {/* Card 4 */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 relative overflow-hidden transition-shadow hover:shadow-md">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-50 rounded-bl-full -z-10"></div>
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                                    </div>
                                    <h3 className="text-sm font-bold text-gray-700">Surge Warnings</h3>
                                </div>
                                <p className="text-4xl font-black text-[var(--color-primary)] tracking-tight">{surgeWarnings}</p>
                                <p className="text-xs font-medium text-gray-500 mt-1">Entry &gt; Exit flow</p>
                            </div>
                        </div>

                        {/* 3 & 4. Real-Time Alerts Table */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1 flex flex-col">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <h3 className="text-sm font-black text-[var(--color-primary)] uppercase tracking-wider">Live Event Log</h3>
                            </div>
                            <div className="overflow-auto flex-1">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-6 py-3 font-bold border-b border-gray-200">Time</th>
                                            <th className="px-6 py-3 font-bold border-b border-gray-200">Zone Name</th>
                                            <th className="px-6 py-3 font-bold border-b border-gray-200">Type</th>
                                            <th className="px-6 py-3 font-bold border-b border-gray-200">Severity</th>
                                            <th className="px-6 py-3 font-bold border-b border-gray-200">Message</th>
                                            <th className="px-6 py-3 font-bold border-b border-gray-200">Status</th>
                                            <th className="px-6 py-3 font-bold border-b border-gray-200 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {alerts.map((alert, idx) => {
                                            const sevInfo = getSeverityDetails(alert.severity);
                                            const isCritical = alert.severity === 'CRITICAL';
                                            return (
                                                <tr key={alert._id} className={`hover:bg-gray-50 transition-colors ${isCritical ? 'animate-[pulse_2s_ease-in-out_infinite]' : ''}`}>
                                                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                                                        {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                    </td>
                                                    <td className="px-6 py-4 font-bold text-[var(--color-primary)]">{alert.zoneName}</td>
                                                    <td className="px-6 py-4 text-gray-600 font-medium">{alert.alertType}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${sevInfo.bg} ${sevInfo.color}`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${sevInfo.dot} mr-1.5`}></span>
                                                            {alert.severity}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500 truncate max-w-xs">{alert.message}</td>
                                                    <td className="px-6 py-4">
                                                        <span className="font-bold text-[10px] tracking-wider text-[var(--color-primary)] border border-gray-200 bg-white px-2 py-1 rounded">
                                                            {alert.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => setSelectedAlert(alert)}
                                                            className="text-xs font-bold text-[var(--color-secondary)] hover:text-[#008bc0] hover:underline px-3 py-1.5 rounded bg-[#00AEEF] bg-opacity-10 transition-colors"
                                                        >
                                                            View
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {alerts.length === 0 && (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-8 text-center text-gray-400 font-medium">No alerts available. Systems nominal.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* 5. Alert Details Panel */}
                    {selectedAlert && (
                        <div className="w-1/3 bg-white rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.05)] border border-gray-200 flex flex-col overflow-hidden animate-[fade-in_0.2s_ease-out]">
                            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-[var(--color-primary)]">
                                <h3 className="text-white font-bold uppercase tracking-wider text-sm flex items-center space-x-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    <span>Alert Details</span>
                                </h3>
                                <button onClick={() => setSelectedAlert(null)} className="text-white opacity-80 hover:opacity-100 transition-opacity">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>

                            <div className="p-6 flex-1 overflow-y-auto space-y-6">
                                {/* Details Core */}
                                <div>
                                    <h4 className="text-lg font-black text-[var(--color-primary)] mb-1 uppercase tracking-tight">{selectedAlert.zoneName}</h4>
                                    <p className="text-xs font-mono text-gray-500 font-bold">{new Date(selectedAlert.createdAt).toLocaleString()}</p>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Occupancy</span>
                                        <span className="text-sm font-black text-gray-800">
                                            {zones.find(z => z._id === selectedAlert.zoneId)?.currentOccupancy || '---'} / {zones.find(z => z._id === selectedAlert.zoneId)?.capacity || '---'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Density</span>
                                        <span className={`text-sm font-black ${getSeverityDetails(selectedAlert.severity).color}`}>
                                            {zones.find(z => z._id === selectedAlert.zoneId) ?
                                                Math.round((zones.find(z => z._id === selectedAlert.zoneId).currentOccupancy / zones.find(z => z._id === selectedAlert.zoneId).capacity) * 100) : '--'}%
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Entry Rate</span>
                                        <span className="text-xs font-bold text-gray-700">
                                            {zones.find(z => z._id === selectedAlert.zoneId)?.entryCount || 0} people/min
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Exit Rate</span>
                                        <span className="text-xs font-bold text-gray-700">
                                            {zones.find(z => z._id === selectedAlert.zoneId)?.exitCount || 0} people/min
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4 bg-[var(--color-primary)] bg-opacity-5 rounded-lg border border-[var(--color-primary)] border-opacity-20">
                                    <h4 className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest mb-2 border-b border-[var(--color-primary)] border-opacity-20 pb-1">Recommended Action</h4>
                                    <ul className="text-xs text-gray-700 space-y-2 list-disc pl-4 mt-2 font-medium">
                                        <li>Redirect visitors to Gate B alternate entry points.</li>
                                        <li>Dispatch ground security for crowd pacing.</li>
                                        {selectedAlert.severity === 'CRITICAL' && (
                                            <li className="text-red-600 font-bold">Open emergency bypass lanes immediately.</li>
                                        )}
                                    </ul>
                                </div>
                            </div>

                            {/* 6. Alert Status Controls */}
                            <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-2">
                                <button className="w-full bg-[var(--color-secondary)] hover:bg-[#008bc0] text-white font-bold py-3 px-4 rounded shadow-sm text-sm transition-colors uppercase tracking-wider">
                                    Resolve Alert
                                </button>
                                <div className="flex space-x-2">
                                    <button className="flex-1 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold py-2.5 px-2 rounded shadow-sm text-xs transition-colors uppercase tracking-wider">
                                        Investigating
                                    </button>
                                    <button className="flex-1 bg-white border border-red-200 hover:bg-red-50 text-red-600 font-bold py-2.5 px-2 rounded shadow-sm text-xs transition-colors uppercase tracking-wider">
                                        Escalate Alert
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
};

export default AlertsDashboard;
