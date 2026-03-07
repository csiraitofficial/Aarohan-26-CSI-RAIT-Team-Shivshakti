import React, { useState, useEffect } from 'react';
import { Bell, Shield, AlertTriangle, Zap, Info, CheckCircle, Clock, ChevronRight, X, XCircle, CheckCheck } from 'lucide-react';
import { getAuthorityAlerts, getAuthorityZones, resolveAuthorityAlert, resolveAuthorityIncident, resolveAllAlerts } from '../../services/api';

const AlertsDashboard = () => {
    const [alerts, setAlerts] = useState([]);
    const [zones, setZones] = useState([]);
    const [selectedAlert, setSelectedAlert] = useState(null);
    const [resolving, setResolving] = useState(null); // Track which alert is being resolved
    const [resolvingAll, setResolvingAll] = useState(false);
    const [toast, setToast] = useState(null);

    const fetchDashboardData = async () => {
        try {
            const [zonesRes, alertsRes] = await Promise.all([
                getAuthorityZones(),
                getAuthorityAlerts()
            ]);
            if (zonesRes.success) setZones(zonesRes.data || []);
            if (alertsRes.success) setAlerts(alertsRes.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 5000);
        return () => clearInterval(interval);
    }, []);

    // Resolve a single alert or incident
    const handleResolve = async (item) => {
        setResolving(item._id);
        try {
            let res;
            if (item.source === 'Incident') {
                res = await resolveAuthorityIncident(item._id);
            } else {
                res = await resolveAuthorityAlert(item._id);
            }

            if (res.success) {
                showToast(`✅ ${item.source || 'Alert'} resolved successfully`);
                if (selectedAlert?._id === item._id) setSelectedAlert(null);
                fetchDashboardData();
            } else {
                showToast(`❌ Failed to resolve: ${res.message}`);
            }
        } catch {
            showToast('❌ Network error while resolving');
        } finally {
            setResolving(null);
        }
    };

    // Resolve all active alerts and incidents
    const handleResolveAll = async () => {
        setResolvingAll(true);
        try {
            const res = await resolveAllAlerts();
            if (res.success) {
                showToast(`✅ Resolved ${res.alertsResolved} alerts and ${res.incidentsResolved} incidents`);
                setSelectedAlert(null);
                fetchDashboardData();
            } else {
                showToast('❌ Failed to resolve all');
            }
        } catch {
            showToast('❌ Network error');
        } finally {
            setResolvingAll(false);
        }
    };

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 4000);
    };

    // Summary calculations
    const activeAlerts = alerts.filter(a => a.status !== 'RESOLVED').length;
    const resolvedAlerts = alerts.filter(a => a.status === 'RESOLVED').length;
    const highRiskZones = zones.filter(z => (z.capacity ? (z.currentOccupancy / z.capacity) : 0) >= 0.75).length;
    const criticalAlerts = alerts.filter(a => a.severity === 'CRITICAL' && a.status !== 'RESOLVED').length;
    const surgeWarnings = alerts.filter(a => (a.alertType === 'SURGE' || a.alertType === 'DENSITY') && a.status !== 'RESOLVED').length;

    const getSeverityDetails = (severity) => {
        switch (severity) {
            case 'CRITICAL': return { color: 'text-red-600', bg: 'bg-red-50', dot: 'bg-red-500', border: 'border-red-200' };
            case 'HIGH': return { color: 'text-orange-600', bg: 'bg-orange-50', dot: 'bg-orange-500', border: 'border-orange-200' };
            case 'WARNING': return { color: 'text-yellow-600', bg: 'bg-yellow-50', dot: 'bg-yellow-500', border: 'border-yellow-200' };
            default: return { color: 'text-emerald-600', bg: 'bg-emerald-50', dot: 'bg-emerald-500', border: 'border-emerald-200' };
        }
    };

    const getStatusStyle = (status) => {
        if (status === 'RESOLVED') return 'bg-emerald-50 text-emerald-600 border-emerald-200';
        if (status === 'IN-PROGRESS') return 'bg-blue-50 text-blue-600 border-blue-200';
        return 'bg-red-50 text-red-600 border-red-200';
    };

    return (
        <div className="space-y-6 relative">
            {/* Toast Notification */}
            {toast && (
                <div className="fixed top-6 right-6 z-[100] animate-in slide-in-from-right-4 fade-in duration-300 bg-white border border-slate-200 shadow-2xl px-5 py-3.5 rounded-xl flex items-center gap-3 max-w-sm">
                    <p className="text-sm font-bold text-slate-700">{toast}</p>
                    <button onClick={() => setToast(null)} className="text-slate-400 hover:text-slate-600">
                        <X size={14} />
                    </button>
                </div>
            )}

            <header className="mb-4">
                <div className="flex justify-between items-center w-full">
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 tracking-tight uppercase">Alert & Incident Management</h1>
                        <p className="text-[10px] font-medium text-slate-400 mt-1 tracking-wider uppercase">Resolve alerts, manage incidents, and track live events from admin simulation engine.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {activeAlerts > 0 && (
                            <button
                                onClick={handleResolveAll}
                                disabled={resolvingAll}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
                            >
                                <CheckCheck size={14} />
                                {resolvingAll ? 'Resolving...' : 'Resolve All'}
                            </button>
                        )}
                        <div className="flex flex-col items-end">
                            <div className="flex items-center space-x-2 bg-white border border-emerald-100 shadow-sm px-3 py-1.5 rounded-lg">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Live Monitoring</span>
                            </div>
                            <span className="text-[9px] text-slate-400 mt-1 font-bold tracking-widest uppercase">Updating every 5 seconds</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="card-base group hover:border-slate-200">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-red-50 border border-red-100 rounded-lg text-red-500">
                                <Bell size={18} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active</span>
                        </div>
                        <div className="flex items-end justify-between">
                            <p className="text-3xl font-bold text-slate-800 tracking-tight">{activeAlerts}</p>
                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Open</span>
                        </div>
                    </div>

                    <div className="card-base group hover:border-emerald-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-500">
                                <CheckCircle size={18} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resolved</span>
                        </div>
                        <div className="flex items-end justify-between">
                            <p className="text-3xl font-bold text-slate-800 tracking-tight">{resolvedAlerts}</p>
                            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Closed</span>
                        </div>
                    </div>

                    <div className="card-base group hover:border-orange-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-orange-50 border border-orange-100 rounded-lg text-orange-500">
                                <Shield size={18} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">High Risk</span>
                        </div>
                        <div className="flex items-end justify-between">
                            <p className="text-3xl font-bold text-slate-800 tracking-tight">{highRiskZones}</p>
                            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">75%+ Density</span>
                        </div>
                    </div>

                    <div className="card-base group hover:border-red-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-red-50 border border-red-100 rounded-lg text-red-500">
                                <AlertTriangle size={18} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Critical</span>
                        </div>
                        <div className="flex items-end justify-between">
                            <p className="text-3xl font-bold text-slate-800 tracking-tight">{criticalAlerts}</p>
                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Immediate</span>
                        </div>
                    </div>

                    <div className="card-base group hover:border-secondary/20">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-secondary/5 border border-secondary/10 rounded-lg text-secondary">
                                <Zap size={18} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Surges</span>
                        </div>
                        <div className="flex items-end justify-between">
                            <p className="text-3xl font-bold text-slate-800 tracking-tight">{surgeWarnings}</p>
                            <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">Inflow</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-6 items-start">
                    <div className="flex-1 flex flex-col space-y-6 transition-all duration-300">
                        {/* Alerts & Incidents Table */}
                        <div className="card-base !p-0 overflow-hidden flex-1 flex flex-col hover:border-slate-200">
                            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Live Event Log</h3>
                                    <p className="text-[10px] text-slate-400 font-medium uppercase mt-0.5 tracking-wider">Alerts & incidents from simulation engine</p>
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
                                            <th className="px-6 py-3 font-bold border-b border-slate-100">Time</th>
                                            <th className="px-6 py-3 font-bold border-b border-slate-100">Zone</th>
                                            <th className="px-6 py-3 font-bold border-b border-slate-100">Type</th>
                                            <th className="px-6 py-3 font-bold border-b border-slate-100">Source</th>
                                            <th className="px-6 py-3 font-bold border-b border-slate-100">Severity</th>
                                            <th className="px-6 py-3 font-bold border-b border-slate-100">Status</th>
                                            <th className="px-6 py-3 font-bold border-b border-slate-100 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50/50">
                                        {alerts.map((alert) => {
                                            const sevInfo = getSeverityDetails(alert.severity);
                                            const isCritical = alert.severity === 'CRITICAL' && alert.status !== 'RESOLVED';
                                            const isResolved = alert.status === 'RESOLVED';
                                            return (
                                                <tr key={alert._id} className={`transition-colors group ${isCritical ? 'bg-red-50/30' : isResolved ? 'bg-emerald-50/20 opacity-60' : 'hover:bg-slate-50/50'}`}>
                                                    <td className="px-6 py-4 font-bold text-slate-400">
                                                        {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                    </td>
                                                    <td className="px-6 py-4 font-bold text-slate-700">{alert.zoneName}</td>
                                                    <td className="px-6 py-4 text-slate-500 font-medium uppercase tracking-wider text-[10px]">{alert.alertType}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${alert.source === 'Incident' ? 'bg-purple-50 text-purple-600 border border-purple-200' : 'bg-blue-50 text-blue-600 border border-blue-200'}`}>
                                                            {alert.source || 'Alert'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[9px] font-bold tracking-widest uppercase ${sevInfo.bg} ${sevInfo.color} ${sevInfo.border}`}>
                                                            <span className={`w-1 h-1 rounded-full ${sevInfo.dot} mr-1.5`}></span>
                                                            {alert.severity}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-0.5 rounded font-bold tracking-widest text-[9px] uppercase border ${getStatusStyle(alert.status)}`}>
                                                            {alert.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-1">
                                                            {!isResolved && (
                                                                <button
                                                                    onClick={() => handleResolve(alert)}
                                                                    disabled={resolving === alert._id}
                                                                    className="p-1.5 text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg border border-transparent hover:border-emerald-200 transition-all disabled:opacity-50"
                                                                    title="Resolve"
                                                                >
                                                                    {resolving === alert._id ? (
                                                                        <div className="w-3.5 h-3.5 border-2 border-emerald-300 border-t-emerald-600 rounded-full animate-spin"></div>
                                                                    ) : (
                                                                        <CheckCircle size={14} />
                                                                    )}
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => setSelectedAlert(alert)}
                                                                className="p-1.5 text-slate-400 hover:text-primary hover:bg-white rounded-lg border border-transparent hover:border-slate-200 hover:shadow-sm transition-all"
                                                                title="Details"
                                                            >
                                                                <ChevronRight size={14} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {alerts.length === 0 && (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-12 text-center text-slate-400 font-bold tracking-widest uppercase text-[10px]">No alerts available. Systems nominal.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Alert Details Panel */}
                    {selectedAlert && (
                        <div className="w-[400px] shrink-0 card-base !p-0 overflow-hidden flex flex-col hover:border-slate-200 shadow-xl animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="p-4 bg-slate-800 flex justify-between items-center">
                                <h3 className="text-white font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                                    <Info size={14} className="text-secondary" />
                                    {selectedAlert.source === 'Incident' ? 'Incident' : 'Alert'} Details
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
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${selectedAlert.source === 'Incident' ? 'bg-purple-50 text-purple-600 border border-purple-200' : 'bg-blue-50 text-blue-600 border border-blue-200'}`}>
                                            {selectedAlert.source || 'Alert'}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded font-bold tracking-widest text-[9px] uppercase border ${getStatusStyle(selectedAlert.status)}`}>
                                            {selectedAlert.status}
                                        </span>
                                    </div>
                                </div>

                                {selectedAlert.message && (
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-2">Message</p>
                                        <p className="text-xs font-medium text-slate-600 leading-relaxed">{selectedAlert.message}</p>
                                    </div>
                                )}

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

                                {/* Recommended Actions */}
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1 h-3 bg-secondary rounded-full"></div>
                                        Recommended Actions
                                    </h4>
                                    <div className="space-y-2">
                                        {(selectedAlert.recommendedActions && selectedAlert.recommendedActions.length > 0
                                            ? selectedAlert.recommendedActions
                                            : [
                                                'Maintain general zone supervision',
                                                'Ensure all pathways remain clear',
                                                'Monitor situation closely'
                                            ]
                                        ).map((action, i) => (
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
                                {selectedAlert.status !== 'RESOLVED' ? (
                                    <button
                                        onClick={() => handleResolve(selectedAlert)}
                                        disabled={resolving === selectedAlert._id}
                                        className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {resolving === selectedAlert._id ? (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <CheckCircle size={14} />
                                        )}
                                        {resolving === selectedAlert._id ? 'Resolving...' : 'Resolve & Close'}
                                    </button>
                                ) : (
                                    <div className="w-full py-3 flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200 font-bold text-sm uppercase tracking-widest">
                                        <CheckCircle size={14} />
                                        Already Resolved
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AlertsDashboard;
