import React, { useState, useEffect } from 'react';
import { FileText, MapPin, AlertCircle, Download, Clock, BarChart3 } from 'lucide-react';
import API_BASE_URL from '../../config';

const ReportsDashboard = () => {
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

    // Analytics Computations
    const mostCongested = zones.length > 0 ? zones.reduce((prev, current) => {
        const prevDensity = prev.capacity ? (prev.currentOccupancy / prev.capacity) : 0;
        const currentDensity = current.capacity ? (current.currentOccupancy / current.capacity) : 0;
        return (currentDensity > prevDensity) ? current : prev;
    }, zones[0]) : null;

    const alertCountsByZone = {};
    alerts.forEach(a => {
        alertCountsByZone[a.zoneName] = (alertCountsByZone[a.zoneName] || 0) + 1;
    });
    const maxAlertZoneName = Object.keys(alertCountsByZone).reduce((a, b) => alertCountsByZone[a] > alertCountsByZone[b] ? a : b, 'None');

    const totalAlertsIssued = alerts.length;

    const reportsList = zones.map(z => ({
        id: z._id,
        date: new Date().toLocaleDateString(),
        zone: z.zoneName,
        maxOccupancy: `${z.currentOccupancy}/${z.capacity}`,
        alerts: alertCountsByZone[z.zoneName] || 0,
        risk: z.riskLevel
    })).sort((a, b) => b.alerts - a.alerts);

    return (
        <div className="space-y-6">
            <header className="mb-4">
                <div className="flex justify-between items-center w-full">
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 tracking-tight uppercase">Historical Reports</h1>
                        <p className="text-[10px] font-medium text-slate-400 mt-1 tracking-wider uppercase">Analyze past event telemetry for better predictive crowd routing.</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:border-slate-300 transition-colors shadow-sm">
                            <Download size={12} />
                            Export Data
                        </button>
                    </div>
                </div>
            </header>

            <main className="space-y-6">
                {/* Visual Overview cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="card-base hover:border-slate-200">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 border border-indigo-100 flex-shrink-0">
                                <AlertCircle size={20} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Impact Hotspot</p>
                                <p className="text-lg font-bold text-slate-800 truncate">{maxAlertZoneName}</p>
                                <p className="text-[10px] text-slate-400 font-medium">Most alerted sector</p>
                            </div>
                        </div>
                    </div>

                    <div className="card-base hover:border-slate-200">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100 flex-shrink-0">
                                <MapPin size={20} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Peak Congestion</p>
                                <p className="text-lg font-bold text-slate-800 truncate">{mostCongested ? mostCongested.zoneName : '---'}</p>
                                <p className="text-[10px] text-slate-400 font-medium">Current density leader</p>
                            </div>
                        </div>
                    </div>

                    <div className="card-base hover:border-slate-200">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-100 flex-shrink-0">
                                <FileText size={20} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Incident Registry</p>
                                <p className="text-lg font-bold text-slate-800">{totalAlertsIssued}</p>
                                <p className="text-[10px] text-slate-400 font-medium">Total alerts in cluster</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Log Table */}
                <div className="card-base !p-0 overflow-hidden hover:border-slate-200">
                    <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Clock size={14} className="text-slate-400" />
                            <h2 className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">Telemetry History Matrix</h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <BarChart3 size={14} className="text-secondary" />
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Cluster Metrics v1.4</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left whitespace-nowrap">
                            <thead className="bg-slate-50/50 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                <tr>
                                    <th className="px-6 py-4 border-b border-slate-100">Timestamp</th>
                                    <th className="px-6 py-4 border-b border-slate-100">Zone Designation</th>
                                    <th className="px-6 py-4 border-b border-slate-100">Peak Occupancy</th>
                                    <th className="px-6 py-4 border-b border-slate-100">Alert Frequency</th>
                                    <th className="px-6 py-4 border-b border-slate-100 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50/50">
                                {reportsList.map(report => (
                                    <tr key={report.id} className="hover:bg-slate-50/30 transition-colors group">
                                        <td className="px-6 py-4 text-[11px] font-medium text-slate-400 group-hover:text-slate-600 transition-colors">{report.date}</td>
                                        <td className="px-6 py-4 text-[11px] font-bold text-slate-700">{report.zone}</td>
                                        <td className="px-6 py-4">
                                            <span className="text-[11px] font-mono font-bold text-slate-600">{report.maxOccupancy}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-1.5 h-1.5 rounded-full ${report.alerts > 0 ? (report.alerts > 3 ? 'bg-critical' : 'bg-orange-500') : 'bg-slate-300'}`}></span>
                                                <span className="text-[11px] font-bold text-slate-600">{report.alerts} Alerts</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter border ${report.alerts > 0
                                                ? report.alerts > 3 ? 'bg-critical/5 text-critical border-critical/20' : 'bg-orange-50 text-orange-600 border-orange-100'
                                                : 'bg-slate-50 text-slate-400 border-slate-100'
                                                }`}>
                                                {report.alerts > 0 ? 'Actionable' : 'Nominal'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {reportsList.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                            No recorded telemetry batches found for this cluster node
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-6 py-3 border-t border-slate-50 flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-slate-400">
                        <span>Cluster Analysis: <span className="text-slate-800">{reportsList.length} matrices mapped</span></span>
                        <div className="flex gap-4">
                            <button className="hover:text-secondary transition-colors">Documentation</button>
                            <button className="hover:text-secondary transition-colors">API Endpoint</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ReportsDashboard;
