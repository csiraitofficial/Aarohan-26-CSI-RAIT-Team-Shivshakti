import React, { useRef, useEffect } from 'react';
import h337 from 'heatmap.js';

// 16 stadium zones with normalized coordinates
const STADIUM_ZONES = [
  { name: 'Gate1', xPct: 0.18, yPct: 0.35 },
  { name: 'Gate2', xPct: 0.14, yPct: 0.50 },
  { name: 'Gate3', xPct: 0.18, yPct: 0.65 },
  { name: 'Gate4', xPct: 0.25, yPct: 0.78 },
  { name: 'Gate5', xPct: 0.40, yPct: 0.90 },
  { name: 'Gate6', xPct: 0.60, yPct: 0.90 },
  { name: 'Gate7', xPct: 0.75, yPct: 0.78 },
  { name: 'Gate8', xPct: 0.82, yPct: 0.65 },
  { name: 'Gate9', xPct: 0.86, yPct: 0.40 },
  { name: 'NorthWing', xPct: 0.50, yPct: 0.10 },
  { name: 'SouthWing', xPct: 0.50, yPct: 0.90 },
  { name: 'EastWing', xPct: 0.85, yPct: 0.50 },
  { name: 'WestWing', xPct: 0.15, yPct: 0.50 },
  { name: 'FoodCourt', xPct: 0.55, yPct: 0.40 },
  { name: 'Parking', xPct: 0.80, yPct: 0.20 },
  { name: 'PressBox', xPct: 0.50, yPct: 0.20 },
];

function _getRiskLabel(value) {
  if (value <= 40) return { label: 'SAFE', color: '#22c55e' };
  if (value <= 70) return { label: 'MODERATE', color: '#eab308' };
  return { label: 'CONGESTED', color: '#ef4444' };
}

function generateDemoData(width, height, scenario = 'NORMAL') {
  const points = [];

  STADIUM_ZONES.forEach((zone) => {
    const x = Math.round(zone.xPct * width);
    const y = Math.round(zone.yPct * height);

    // Determine the color 'cluster' for this zone based on scenario probability
    const rand = Math.random();
    let clusterType; // 'GREEN', 'YELLOW', 'RED'

    if (scenario === 'NORMAL') {
      // Normal: 70% Green, 20% Yellow, 10% Red
      if (rand < 0.70) clusterType = 'GREEN';
      else if (rand < 0.90) clusterType = 'YELLOW';
      else clusterType = 'RED';
    } else if (scenario === 'SURGE') {
      // Surge: 15% Green, 60% Yellow, 25% Red
      if (rand < 0.15) clusterType = 'GREEN';
      else if (rand < 0.75) clusterType = 'YELLOW';
      else clusterType = 'RED';
    } else {
      // EMERGENCY: 5% Green, 15% Yellow, 80% Red
      if (rand < 0.05) clusterType = 'GREEN';
      else if (rand < 0.20) clusterType = 'YELLOW';
      else clusterType = 'RED';
    }

    let minBase, maxBase;
    if (clusterType === 'GREEN') {
      minBase = 15; maxBase = 40;     // Targets the 0.1 to 0.45 gradient map
    } else if (clusterType === 'YELLOW') {
      minBase = 50; maxBase = 70;     // Targets the 0.55 to 0.7 gradient map
    } else {
      minBase = 85; maxBase = 110;    // Targets the > 0.85 gradient map
    }

    const value = Math.floor(Math.random() * (maxBase - minBase + 1)) + minBase;

    // Main point
    points.push({ x, y, value });

    // 2-5 organic subpoints nearby to create real 'heatwaves' and intensity
    const subCount = 2 + Math.floor(Math.random() * 4);
    for (let i = 0; i < subCount; i++) {
      const dx = (Math.random() - 0.5) * 0.12 * width;
      const dy = (Math.random() - 0.5) * 0.12 * height;
      const subValue = Math.round(value * (0.4 + Math.random() * 0.6));
      points.push({
        x: Math.round(Math.max(0, Math.min(width, x + dx))),
        y: Math.round(Math.max(0, Math.min(height, y + dy))),
        value: subValue,
      });
    }
  });

  return { max: 100, data: points };
}

export default function StadiumHeatmap({ heatData, scenario = 'NORMAL' }) {
  const containerRef = useRef(null);
  const heatmapRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;

    // Delay initialization to ensure the container has painted and has dimensions
    const initTimer = setTimeout(() => {
      if (cancelled || !containerRef.current) return;

      try {
        const container = containerRef.current;
        const width = container.offsetWidth;
        const height = container.offsetHeight;

        // Bail out if the container has no dimensions yet
        if (width === 0 || height === 0) return;

        // Clean up any previous heatmap canvas
        const oldCanvas = container.querySelector('canvas.heatmap-canvas');
        if (oldCanvas) oldCanvas.remove();

        // Create the heatmap instance
        const heatmapInstance = h337.create({
          container,
          radius: 70,
          maxOpacity: 0.7,
          minOpacity: 0.05,
          blur: 0.9,
          gradient: {
            '0.1': '#00ff00',
            '0.25': '#66ff00',
            '0.45': '#ccff00',
            '0.55': '#ffff00',
            '0.7': '#ffa500',
            '0.85': '#ff4500',
            '1.0': '#ff0000',
          },
        });

        heatmapRef.current = heatmapInstance;

        // Use provided data or generate demo data
        const data = heatData || generateDemoData(width, height, scenario);
        heatmapInstance.setData(data);
      } catch (err) {
        console.warn('StadiumHeatmap: initialization error', err);
      }
    }, 100);

    return () => {
      cancelled = true;
      clearTimeout(initTimer);
    };
  }, [heatData, scenario]);

  return (
    <div
      ref={containerRef}
      className="w-full relative overflow-hidden"
      style={{
        height: '650px',
        background:
          'radial-gradient(circle at center, #1a1a2e 0%, #0f0f1a 60%, #050510 100%)',
      }}
    >
      <style>{`
        .heatmap-canvas {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          z-index: 1 !important;
          pointer-events: none !important;
          opacity: 1 !important;
        }
      `}</style>

      {/* SVG Stadium Wireframe Overlay */}
      <svg
        viewBox="0 0 500 500"
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 2 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer stadium wall */}
        <ellipse
          cx="250"
          cy="250"
          rx="230"
          ry="220"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          opacity="0.08"
        />
        {/* Middle concourse ring */}
        <ellipse
          cx="250"
          cy="250"
          rx="170"
          ry="160"
          fill="none"
          stroke="white"
          strokeWidth="1"
          opacity="0.08"
        />
        {/* Inner bowl ring */}
        <ellipse
          cx="250"
          cy="250"
          rx="110"
          ry="100"
          fill="none"
          stroke="white"
          strokeWidth="1"
          opacity="0.08"
        />
        {/* Playing field */}
        <ellipse
          cx="250"
          cy="250"
          rx="60"
          ry="50"
          fill="none"
          stroke="white"
          strokeWidth="0.8"
          opacity="0.08"
        />

        {/* Radial section dividers (16 spokes) */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 360) / 16;
          const rad = (angle * Math.PI) / 180;
          const x1 = 250 + 60 * Math.cos(rad);
          const y1 = 250 + 50 * Math.sin(rad);
          const x2 = 250 + 230 * Math.cos(rad);
          const y2 = 250 + 220 * Math.sin(rad);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="white"
              strokeWidth="0.5"
              opacity="0.08"
            />
          );
        })}

        {/* Zone labels */}
        {STADIUM_ZONES.map((zone) => {
          const tx = zone.xPct * 500;
          const ty = zone.yPct * 500;
          return (
            <text
              key={zone.name}
              x={tx}
              y={ty}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(255,255,255,0.35)"
              fontSize="9"
              fontWeight="700"
              fontFamily="monospace"
            >
              {zone.name}
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div
        className="absolute bottom-4 left-4 flex items-center gap-4 px-3 py-2 rounded-lg"
        style={{ zIndex: 3, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
      >
        {[
          { label: 'Safe', color: '#22c55e' },
          { label: 'Moderate', color: '#eab308' },
          { label: 'Congested', color: '#ef4444' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: item.color, boxShadow: `0 0 6px ${item.color}` }}
            />
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: item.color }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
