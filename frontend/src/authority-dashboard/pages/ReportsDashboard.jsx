import React, { useState, useEffect } from 'react';
import '../Theme.css';
import Sidebar from '../components/Sidebar';

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

    // Analytics Computations

    // 1. Most Congested Zone (current)
    const mostCongested = zones.length > 0 ? zones.reduce((prev, current) => {
        const prevDensity = prev.capacity ? (prev.currentOccupancy / prev.capacity) : 0;
        const currentDensity = current.capacity ? (current.currentOccupancy / current.capacity) : 0;
        return (currentDensity > prevDensity) ? current : prev;
    }, zones[0]) : null;

    // 2. Zone with most alerts historically
    const alertCountsByZone = {};
    alerts.forEach(a => {
        alertCountsByZone[a.zoneName] = (alertCountsByZone[a.zoneName] || 0) + 1;
    });
    const maxAlertZoneName = Object.keys(alertCountsByZone).reduce((a, b) => alertCountsByZone[a] > alertCountsByZone[b] ? a : b, 'None');

    // 3. Total alerts
    const totalAlertsIssued = alerts.length;

    // Derived Reports Table (mapping zones to their alert frequencies)
    const reportsList = zones.map(z => ({
        id: z._id,
        date: new Date().toLocaleDateString(),
        zone: z.zoneName,
        maxOccupancy: `${z.currentOccupancy}/${z.capacity}`,
        alerts: alertCountsByZone[z.zoneName] || 0,
        risk: z.riskLevel
    })).sort((a, b) => b.alerts - a.alerts);

    return (
        <div className="flex w-full h-full authority-dashboard-container overflow-hidden bg-gray-50">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-y-auto w-full relative">
                <header className="px-6 py-6 border-b border-gray-200 bg-white sticky top-0 z-40 shadow-sm">
                    <div className="max-w-[1600px] mx-auto w-full">
                        <h1 className="text-2xl font-black text-[var(--color-primary)] tracking-tight uppercase">Historical Reports</h1>
                        <p className="text-sm font-medium text-gray-500 mt-1">Analyze past event telemetry for better predictive crowd routing.</p>
                    </div>
                </header>

                <main className="flex-1 max-w-[1600px] mx-auto w-full px-6 py-8">
                    {/* Visual Overview Charts Panel (Mocked) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center">
                            <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mr-4">
                                <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Most Alerted Zone</p>
                                <p className="text-2xl font-black text-[var(--color-primary)] truncate max-w-[150px]">{maxAlertZoneName}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row items-center cursor-pointer hover:shadow-md transition-all">
                            <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mr-4 mb-4 md:mb-0">
                                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Most Congested</p>
                                <p className="text-2xl font-black text-[var(--color-primary)] truncate max-w-[150px]">{mostCongested ? mostCongested.zoneName : '---'}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row items-center cursor-pointer hover:shadow-md transition-all">
                            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mr-4 mb-4 md:mb-0">
                                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Alerts Issued</p>
                                <p className="text-2xl font-black text-[var(--color-primary)]">{totalAlertsIssued}</p>
                            </div>
                        </div>
                    </div>

                    {/* Log Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h2 className="text-sm font-black text-[var(--color-primary)] uppercase tracking-wider">Historical Crowd Data Logs</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Date</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Zone</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Max Occupancy</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Alerts Generated</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {reportsList.map(report => (
                                        <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6 text-sm font-medium text-gray-600">{report.date}</td>
                                            <td className="py-4 px-6 text-sm font-bold text-[var(--color-primary)]">{report.zone}</td>
                                            <td className="py-4 px-6 text-sm font-mono font-semibold text-gray-700">{report.maxOccupancy}</td>
                                            <td className="py-4 px-6 text-sm">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${report.alerts > 0 ? (report.alerts > 3 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700') : 'bg-gray-100 text-gray-600'}`}>
                                                    {report.alerts} Triggered
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {reportsList.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="py-8 text-center text-gray-400 font-medium">No recorded analytical data sets.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center text-sm">
                            <span className="text-gray-500 font-medium">Evaluating <span className="font-bold text-gray-700">{reportsList.length}</span> total zone analytics matrices.</span>
                            <button className="text-[var(--color-secondary)] font-bold hover:underline">Export to CSV</button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ReportsDashboard;
