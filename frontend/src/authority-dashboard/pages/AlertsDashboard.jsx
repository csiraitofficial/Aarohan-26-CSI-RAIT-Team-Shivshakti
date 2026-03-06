import React, { useState, useEffect } from 'react';
import { Bell, Shield, AlertTriangle, Zap, Info, CheckCircle, Clock, ChevronRight, X } from 'lucide-react';

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
    const highRiskZones = zones.filter(z => (z.capacity ? (z.currentOccupancy / z.capacity) : 0) >= 0.75).length;
    const criticalAlerts = alerts.filter(a => a.severity === 'CRITICAL' && a.status !== 'RESOLVED').length;
    const surgeWarnings = alerts.filter(a => (a.alertType === 'SURGE' || a.alertType === 'DENSITY') && a.status !== 'RESOLVED').length;

    const getSeverityDetails = (severity) => {
        switch (severity) {
            case 'CRITICAL': return { color: 'text-critical', bg: 'bg-critical/10', dot: 'bg-critical' };
            case 'HIGH': return { color: 'text-orange-600', bg: 'bg-orange-50', dot: 'bg-orange-500' };
            case 'WARNING': return { color: 'text-yellow-600', bg: 'bg-yellow-50', dot: 'bg-yellow-500' };
            default: return { color: 'text-emerald-600', bg: 'bg-emerald-50', dot: 'bg-emerald-500' };
        }
    };

    return (
        <div className="space-y-6">
            <header className="mb-4">
                <div className="flex justify-between items-center w-full">
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 tracking-tight uppercase">Crowd Alerts Monitoring</h1>
                        <p className="text-[10px] font-medium text-slate-400 mt-1 tracking-wider uppercase">Real-time alerts for crowd density and surge detection across zones.</p>
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

            <main className="flex-1 w-full space-y-6">
                {/* 2. Alert Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Card 1: Active Alerts */}
                    <div className="card-base group hover:border-slate-200">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-500 group-hover:text-primary transition-colors">
                                <Bell size={18} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Alerts</span>
                        </div>
                        <div className="flex items-end justify-between">
                            <p className="text-3xl font-bold text-slate-800 tracking-tight">{activeAlerts}</p>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Open</span>
                        </div>
                    </div>

                    {/* Card 2: High Risk Zones */}
                    <div className="card-base group hover:border-orange-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-orange-50 border border-orange-100 rounded-lg text-orange-500">
                                <Shield size={18} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">High Risk Zones</span>
                        </div>
                        <div className="flex items-end justify-between">
                            <p className="text-3xl font-bold text-slate-800 tracking-tight">{highRiskZones}</p>
                            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">75%+ Density</span>
                        </div>
                    </div>

                    {/* Card 3: Critical Alerts */}
                    <div className="card-base group hover:border-critical/20">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-critical/5 border border-critical/10 rounded-lg text-critical">
                                <AlertTriangle size={18} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Critical Alerts</span>
                        </div>
                        <div className="flex items-end justify-between">
                            <p className="text-3xl font-bold text-slate-800 tracking-tight">{criticalAlerts}</p>
                            <span className="text-[10px] font-bold text-critical uppercase tracking-wider">Immediate Attn</span>
                        </div>
                    </div>

                    {/* Card 4: Surge Warnings */}
                    <div className="card-base group hover:border-secondary/20">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-secondary/5 border border-secondary/10 rounded-lg text-secondary">
                                <Zap size={18} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Surge Warnings</span>
                        </div>
                        <div className="flex items-end justify-between">
                            <p className="text-3xl font-bold text-slate-800 tracking-tight">{surgeWarnings}</p>
                            <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">Inflow Surge</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-6 items-start">
                    <div className={`flex-1 flex flex-col space-y-6 transition-all duration-300`}>
                        {/* 3 & 4. Real-Time Alerts Table */}
                        <div className="card-base !p-0 overflow-hidden flex-1 flex flex-col hover:border-slate-200">
                            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Live Event Log</h3>
                                    <p className="text-[10px] text-slate-400 font-medium uppercase mt-0.5 tracking-wider">System-wide critical incident stream</p>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-lg shadow-sm">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Active</span>
                                </div>
                            </div>
                            <div className="overflow-auto flex-1 max-h-[600px]">
                                <table className="w-full text-left text-xs whitespace-nowrap">
                                    <thead className="text-[10px] text-slate-400 uppercase tracking-widest bg-slate-50/50 sticky top-0 z-10">
                                        <tr>
                                            <th className="px-6 py-3 font-bold border-b border-slate-100 uppercase">Time</th>
                                            <th className="px-6 py-3 font-bold border-b border-slate-100 uppercase">Zone</th>
                                            <th className="px-6 py-3 font-bold border-b border-slate-100 uppercase">Type</th>
                                            <th className="px-6 py-3 font-bold border-b border-slate-100 uppercase">Severity</th>
                                            <th className="px-6 py-3 font-bold border-b border-slate-100 uppercase">Status</th>
                                            <th className="px-6 py-3 font-bold border-b border-slate-100 text-right uppercase">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50/50">
                                        {alerts.map((alert) => {
                                            const sevInfo = getSeverityDetails(alert.severity);
                                            const isCritical = alert.severity === 'CRITICAL';
                                            return (
                                                <tr key={alert._id} className={`hover:bg-slate-50/50 transition-colors group ${isCritical ? 'bg-critical/[0.02]' : ''}`}>
                                                    <td className="px-6 py-4 font-bold text-slate-400">
                                                        {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                    </td>
                                                    <td className="px-6 py-4 font-bold text-slate-700">{alert.zoneName}</td>
                                                    <td className="px-6 py-4 text-slate-500 font-medium uppercase tracking-wider text-[10px]">{alert.alertType}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[9px] font-bold tracking-widest uppercase ${sevInfo.bg} ${sevInfo.color} border-current/20`}>
                                                            <span className={`w-1 h-1 rounded-full ${sevInfo.dot} mr-1.5`}></span>
                                                            {alert.severity}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-bold tracking-widest text-[9px] uppercase border border-slate-200">
                                                            {alert.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => setSelectedAlert(alert)}
                                                            className="p-1.5 text-slate-400 hover:text-primary hover:bg-white rounded-lg border border-transparent hover:border-slate-200 hover:shadow-sm transition-all"
                                                        >
                                                            <ChevronRight size={14} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {alerts.length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-12 text-center text-slate-400 font-bold tracking-widest uppercase text-[10px]">No alerts available. Systems nominal.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* 5. Alert Details Panel */}
                    {selectedAlert && (
                        <div className="w-[400px] shrink-0 card-base !p-0 overflow-hidden flex flex-col hover:border-slate-200 shadow-xl animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="p-4 bg-slate-800 flex justify-between items-center">
                                <h3 className="text-white font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                                    <Info size={14} className="text-secondary" />
                                    Alert Details
                                </h3>
                                <button onClick={() => setSelectedAlert(null)} className="p-1 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors">
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="p-6 flex-1 overflow-y-auto space-y-6">
                                <div>
                                    <h4 className="text-lg font-bold text-slate-800 tracking-tight">{selectedAlert.zoneName}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Clock size={12} className="text-slate-400" />
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(selectedAlert.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">Occupancy</p>
                                        <p className="text-sm font-bold text-slate-700">
                                            {zones.find(z => z._id === selectedAlert.zoneId)?.currentOccupancy || '---'}
                                            <span className="text-slate-300 ml-1">/ {zones.find(z => z._id === selectedAlert.zoneId)?.capacity || '---'}</span>
                                        </p>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">Density</p>
                                        <p className={`text-sm font-bold ${getSeverityDetails(selectedAlert.severity).color}`}>
                                            {zones.find(z => z._id === selectedAlert.zoneId) ?
                                                Math.round((zones.find(z => z._id === selectedAlert.zoneId).currentOccupancy / zones.find(z => z._id === selectedAlert.zoneId).capacity) * 100) : '--'}%
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1 h-3 bg-secondary rounded-full"></div>
                                        Recommended Actions
                                    </h4>
                                    <div className="space-y-2">
                                        {[
                                            'Redirect visitors to alternate entry points',
                                            'Dispatch ground security for crowd pacing',
                                            selectedAlert.severity === 'CRITICAL' ? 'Open emergency bypass lanes' : 'Increase monitoring frequency'
                                        ].map((action, i) => (
                                            <div key={i} className="flex gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-secondary/20 group transition-all">
                                                <div className="w-4 h-4 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 mt-0.5 text-slate-300 group-hover:text-secondary group-hover:border-secondary transition-colors">
                                                    <CheckCircle size={10} />
                                                </div>
                                                <p className="text-xs font-medium text-slate-600 leading-tight">{action}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border-t border-slate-50 bg-slate-50/50 space-y-2">
                                <button className="w-full btn-primary py-3 flex items-center justify-center gap-2">
                                    <CheckCircle size={14} />
                                    Resolve Alert
                                </button>
                                <div className="grid grid-cols-2 gap-2">
                                    <button className="py-2.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors shadow-sm">
                                        Escalate
                                    </button>
                                    <button className="py-2.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors shadow-sm">
                                        Notify Unit
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AlertsDashboard;

