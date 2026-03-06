import React, { useMemo } from 'react';
import '../Theme.css';

const ZoneCard = ({ zone }) => {
  const { zoneName, currentOccupancy, capacity } = zone;

  // Calculate density
  const density = capacity > 0 ? (currentOccupancy / capacity) : 0;
  const densityPercentage = Math.round(density * 100);

  // Determine Risk Level and Color Classes
  const getRiskDetails = (densityValue) => {
    if (densityValue < 0.50) return { level: 'LOW', colorClass: 'status-glow-low', textClass: 'text-emerald-400', bgClass: 'bg-emerald-500' };
    if (densityValue < 0.75) return { level: 'MEDIUM', colorClass: 'status-glow-medium', textClass: 'text-amber-400', bgClass: 'bg-amber-500' };
    if (densityValue < 0.90) return { level: 'HIGH', colorClass: 'status-glow-high', textClass: 'text-orange-400', bgClass: 'bg-orange-500' };
    return { level: 'CRITICAL', colorClass: 'status-glow-critical', textClass: 'text-red-400', bgClass: 'bg-red-500' };
  };

  const riskDetails = useMemo(() => getRiskDetails(density), [density]);

  // Mock calculation for demo purposes
  const getTimeToCritical = (densityValue) => {
    if (densityValue >= 0.9) return "CRITICAL REACHED";
    if (densityValue >= 0.75) return "12m to Critical";
    if (densityValue >= 0.5) return "38m to Critical";
    return "Stable";
  };

  const timeToCriticalText = getTimeToCritical(density);

  return (
    <div className={`glass-card ${riskDetails.colorClass} flex flex-col justify-between p-4 relative overflow-hidden transition-all duration-300`}>
      {/* Background abstract shape */}
      <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-[40px] opacity-10 ${riskDetails.bgClass} pointer-events-none`}></div>

      <div className="flex justify-between items-start z-10">
        <div>
          <h3 className="text-lg font-bold text-[var(--color-primary)] truncate pr-2" title={zoneName}>{zoneName}</h3>
          {density >= 0.5 && (
            <div className="flex items-center space-x-1 mt-1 text-[10px] font-mono tracking-wider">
              <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span className={`${density >= 0.75 ? 'text-red-400 animate-pulse' : 'text-amber-400'}`}>{timeToCriticalText}</span>
            </div>
          )}
        </div>

        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-white bg-opacity-80 border border-opacity-20 ${riskDetails.textClass} border-current`}>
          {riskDetails.level}
        </span>
      </div>

      <div className="flex flex-col mt-4 z-10">
        <div className="flex items-end justify-between mb-1">
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">Occupancy</span>
            <span className="text-2xl font-black text-[var(--color-primary)] tracking-tighter">
              {currentOccupancy.toLocaleString()} <span className="text-xs font-medium text-gray-500">/ {capacity.toLocaleString()}</span>
            </span>
          </div>
          <div className="flex space-x-4 px-4 bg-gray-50 border border-gray-100 rounded-lg py-1.5 shadow-inner">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-gray-400 tracking-widest uppercase">Entry</span>
              <span className="text-sm font-bold text-emerald-600">+{Math.floor(density * 40)}/m</span>
            </div>
            <div className="w-px bg-gray-200"></div>
            <div className="flex flex-col text-right">
              <span className="text-[9px] font-bold text-gray-400 tracking-widest uppercase">Exit</span>
              <span className="text-sm font-bold text-gray-500">-{Math.max(2, Math.floor(density * 15))}/m</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#8BA3CB]">Density</span>
            <span className={`text-xl font-bold ${riskDetails.textClass}`}>
              {densityPercentage}%
            </span>
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden shadow-inner mt-2">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out`}
            style={{
              width: `${Math.min(densityPercentage, 100)}%`,
              backgroundColor: density < 0.5 ? 'var(--risk-low)' :
                density < 0.75 ? 'var(--risk-medium)' :
                  density < 0.9 ? 'var(--risk-high)' : 'var(--risk-critical)'
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ZoneCard;
