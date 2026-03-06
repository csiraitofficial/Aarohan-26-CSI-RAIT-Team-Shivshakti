import React, { useState, useEffect, useMemo } from 'react';
import '../Theme.css';

const PredictionWidget = ({ zones }) => {
    // Find the zone with the highest risk (closest to 90% or above)
    const criticalZone = useMemo(() => {
        if (!zones || zones.length === 0) return null;
        return zones.reduce((prev, current) => {
            const prevDensity = prev.capacity > 0 ? (prev.currentOccupancy / prev.capacity) : 0;
            const currentDensity = current.capacity > 0 ? (current.currentOccupancy / current.capacity) : 0;
            return (prevDensity > currentDensity) ? prev : current;
        });
    }, [zones]);

    const [prediction, setPrediction] = useState(null);

    useEffect(() => {
        if (!criticalZone) return;

        const density = criticalZone.capacity > 0 ? (criticalZone.currentOccupancy / criticalZone.capacity) : 0;

        // AI Prediction generation logic (Mocked for demo)
        // Formula: take current occupancy and compound it based on perceived threat
        let multiplier = 1.1; // Normal growth
        let trend = "Steady";
        let alertColor = "text-emerald-400";

        if (density >= 0.9) {
            multiplier = 1.05; // Already critical, growth slows
            trend = "Critical Mass Maintained";
            alertColor = "text-red-500";
        } else if (density >= 0.75) {
            multiplier = 1.3; // Rapid rise
            trend = "Rapid Rise";
            alertColor = "text-orange-400";
        } else if (density >= 0.5) {
            multiplier = 1.2; // Elevated
            trend = "Elevated Inflow";
            alertColor = "text-amber-400";
        }

        const projectedOccupancy = Math.min(
            criticalZone.capacity,
            Math.round(criticalZone.currentOccupancy * multiplier)
        );
        const projectedDensity = Math.round((projectedOccupancy / criticalZone.capacity) * 100);

        setPrediction({ projectedOccupancy, projectedDensity, trend, alertColor });

    }, [criticalZone]);

    if (!criticalZone || !prediction) {
        return (
            <div className="glass-card flex flex-col justify-center items-center h-full p-6 text-center border-gray-200">
                <h2 className="text-xl font-bold text-gray-600 mb-2">AI Forecast Engine</h2>
                <p className="text-sm text-gray-500">Awaiting telemetry...</p>
            </div>
        );
    }

    const { projectedOccupancy, projectedDensity, trend, alertColor } = prediction;

    return (
        <div className={`glass - card flex flex - col justify - between relative overflow - hidden transition - colors border - opacity - 40 border - l - 4 ${projectedDensity >= 90 ? 'border-l-red-500' : projectedDensity >= 75 ? 'border-l-orange-500' : 'border-l-[var(--color-secondary)]'
            } `}>
            {/* Background Graphic */}
            <div className="absolute right-0 top-0 w-32 h-32 bg-[var(--color-secondary)] opacity-5 rounded-bl-[100px] pointer-events-none"></div>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        <h2 className="text-lg font-black text-[var(--color-primary)] uppercase tracking-wide">AI Prediction</h2>
                    </div>
                    <span className="text-[10px] font-mono text-gray-500 border border-gray-300 px-2 py-0.5 rounded">AUTO-REFRESH</span>
                </div>

                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 mt-2 border-b border-gray-200 pb-1">Highest Risk Vector</p>
                <h3 className="text-lg font-bold text-[var(--color-primary)] truncate" title={criticalZone.zoneName}>
                    {criticalZone.zoneName}
                </h3>
            </div>

            <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Future Prediction (10 Min)</span>
                    <span className={`text - xs font - black uppercase ${alertColor} animate - pulse`}>
                        {trend}
                    </span>
                </div>

                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[10px] text-gray-500 font-semibold mb-1">Projected Occupancy</p>
                        <p className="text-3xl font-black text-[var(--color-primary)]">{projectedOccupancy.toLocaleString()}</p>
                    </div>

                    <div className="text-right">
                        <p className="text-[10px] text-gray-500 font-semibold mb-1">Projected Density</p>
                        <p className={`text - 2xl font - bold ${alertColor} `}>{projectedDensity}%</p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default PredictionWidget;
