import React from 'react';
import { useDashboardContext } from '../context/DashboardContext';

export default function WaitTimesPage() {
    const { waitTimes, getZoneById, getRiskColorInfo } = useDashboardContext();

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-[#002868]">Estimated Wait Times</h1>
                <p className="text-sm font-semibold text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm">
                    Synced with Live Sensors
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {waitTimes.map(wt => {
                    const zone = getZoneById(wt.zoneId);
                    if (!zone) return null;

                    const colorInfo = getRiskColorInfo(Math.min((wt.currentWait / 60) * 100, 100) > 50 ? 'High' : 'Low'); // Simple logic for color

                    return (
                        <div key={wt.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col transition-transform hover:-translate-y-1 hover:shadow-md">
                            <div className={`px-5 py-4 flex justify-between items-start border-b border-gray-100 ${colorInfo.bgClass}/5`}>
                                <div>
                                    <h3 className="font-bold text-[#002868] text-sm leading-tight">{wt.name}</h3>
                                    <p className="text-xs text-gray-500 font-medium mt-0.5">{zone.name}</p>
                                </div>
                                <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${colorInfo.bgClass}/10 ${colorInfo.textClass}`}>
                                    {wt.currentWait > 20 ? 'Busy' : 'Normal'}
                                </div>
                            </div>
                            
                            <div className="p-6 flex-1 flex flex-col justify-center items-center text-center">
                                <div className={`text-5xl font-black mb-1 ${colorInfo.textClass}`}>
                                    {wt.currentWait}
                                </div>
                                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Minutes</div>
                            </div>

                            <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className={`flex items-center justify-center w-6 h-6 rounded-full ${wt.trend === 'increasing' ? 'bg-red-100 text-red-600' : wt.trend === 'decreasing' ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-600'}`}>
                                        {wt.trend === 'increasing' && <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="18 15 12 9 6 15"></polyline></svg>}
                                        {wt.trend === 'decreasing' && <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"></polyline></svg>}
                                        {wt.trend === 'stable' && <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="5" y1="12" x2="19" y2="12"></line></svg>}
                                    </span>
                                    <span className="text-xs font-bold text-gray-600 capitalize">{wt.trend}</span>
                                </div>
                                <div className="text-xs font-semibold text-gray-400">
                                    Peak: {wt.peakTime}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
