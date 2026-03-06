import React, { useMemo } from 'react';

const ZoneCard = ({ zone }) => {
  const { zoneName, currentOccupancy, capacity } = zone;

  // Calculate density
  const density = capacity > 0 ? (currentOccupancy / capacity) : 0;
  const densityPercentage = Math.round(density * 100);

  // Determine Risk Level and Color Classes
  const getRiskDetails = (densityValue) => {
    if (densityValue < 0.50) return { level: 'LOW', color: 'text-emerald-500', bg: 'bg-emerald-500', border: 'border-emerald-100', bgSoft: 'bg-emerald-50' };
    if (densityValue < 0.75) return { level: 'MEDIUM', color: 'text-amber-500', bg: 'bg-amber-500', border: 'border-amber-100', bgSoft: 'bg-amber-50' };
    if (densityValue < 0.90) return { level: 'HIGH', color: 'text-orange-500', bg: 'bg-orange-500', border: 'border-orange-100', bgSoft: 'bg-orange-50' };
    return { level: 'CRITICAL', color: 'text-critical', bg: 'bg-critical', border: 'border-critical/20', bgSoft: 'bg-critical/5' };
  };

  const riskDetails = useMemo(() => getRiskDetails(density), [density]);

  // Mock calculation for time to critical
  const getTimeToCritical = (densityValue) => {
    if (densityValue >= 0.9) return "CRITICAL REACHED";
    if (densityValue >= 0.75) return "12m to Critical";
    if (densityValue >= 0.5) return "38m to Critical";
    return "Stable";
  };

  const timeToCriticalText = getTimeToCritical(density);

  return (
    <div className={`card-base hover:border-slate-200 transition-all duration-300 relative overflow-hidden group`}>
      {/* Risk Indicator Bar (Side) */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${riskDetails.bg}`}></div>

      <div className="flex justify-between items-start mb-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
            {zoneName}
            {density >= 0.5 && (
              <span className={`w-1.5 h-1.5 rounded-full ${riskDetails.bg} ${density >= 0.75 ? 'animate-pulse' : ''}`}></span>
            )}
          </h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <span className={`px-1.5 py-0.5 rounded ${riskDetails.bgSoft} ${riskDetails.color} border ${riskDetails.border}`}>
              {riskDetails.level}
            </span>
            {density >= 0.5 && (
              <span className="flex items-center gap-1">
                <span className="text-slate-300">•</span>
                {timeToCriticalText}
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Occupancy</p>
          <p className="text-sm font-bold text-slate-700">
            {currentOccupancy.toLocaleString()}
            <span className="text-slate-300 ml-1">/ {capacity.toLocaleString()}</span>
          </p>
        </div>
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Density</p>
          <div className="flex items-baseline gap-1">
            <p className={`text-sm font-bold ${riskDetails.color}`}>{densityPercentage}%</p>
            <p className="text-[9px] text-slate-300 font-medium">Cap. Util</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <div className="flex gap-3">
            <div className="flex flex-col">
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Inflow</span>
              <span className="text-[10px] font-bold text-emerald-600">+{Math.floor(density * 40)}/m</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Outflow</span>
              <span className="text-[10px] font-bold text-slate-400">-{Math.max(2, Math.floor(density * 15))}/m</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${riskDetails.bg}`}
            style={{ width: `${Math.min(densityPercentage, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ZoneCard;
