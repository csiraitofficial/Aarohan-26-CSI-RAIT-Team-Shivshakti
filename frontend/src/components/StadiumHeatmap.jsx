import React, { useEffect, useRef, useState } from 'react';
import h337 from '../lib/heatmap.js';

export default function StadiumHeatmap({ heatData, scenario = 'NORMAL' }) {
    const containerRef = useRef(null);
    const heatmapInstance = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // Define 16 stadium zones using normalized coordinates
    const zones = [
        { name: "Gate1", xPct: 0.18, yPct: 0.35 },
        { name: "Gate2", xPct: 0.14, yPct: 0.50 },
        { name: "Gate3", xPct: 0.18, yPct: 0.65 },
        { name: "Gate4", xPct: 0.25, yPct: 0.78 },
        { name: "Gate5", xPct: 0.40, yPct: 0.90 },
        { name: "Gate6", xPct: 0.60, yPct: 0.90 },
        { name: "Gate7", xPct: 0.75, yPct: 0.78 },
        { name: "Gate8", xPct: 0.82, yPct: 0.65 },
        { name: "Gate9", xPct: 0.86, yPct: 0.40 },
        { name: "NorthWing", xPct: 0.50, yPct: 0.10 },
        { name: "SouthWing", xPct: 0.50, yPct: 0.90 },
        { name: "EastWing", xPct: 0.85, yPct: 0.50 },
        { name: "WestWing", xPct: 0.15, yPct: 0.50 },
        { name: "FoodCourt", xPct: 0.55, yPct: 0.40 },
        { name: "Parking", xPct: 0.80, yPct: 0.20 },
        { name: "PressBox", xPct: 0.50, yPct: 0.20 }
    ];

    // Measure container size once it mounts
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const { clientWidth, clientHeight } = containerRef.current;
                if (clientWidth > 0 && clientHeight > 0) {
                    setDimensions({ width: clientWidth, height: clientHeight });
                } else {
                    setTimeout(updateDimensions, 100);
                }
            }
        };

        // Initial delay to let CSS load
        const timer = setTimeout(updateDimensions, 100);

        const handleResize = () => {
            updateDimensions();
        };
        window.addEventListener('resize', handleResize);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    // Creates heatmap and sets data whenever dimensions, scenario, or heatData change
    useEffect(() => {
        if (dimensions.width === 0 || dimensions.height === 0 || !containerRef.current) return;

        // Clean up previous instance on recreation for resizes
        if (heatmapInstance.current) {
            // heatmap.js doesn't have a clean destroy method, but we can remove the canvas
            const canvas = containerRef.current.querySelector('canvas');
            if (canvas) {
                canvas.remove();
            }
            heatmapInstance.current = null;
        }

        // Create fresh heatmap instance
        heatmapInstance.current = h337.create({
            container: containerRef.current,
            radius: dimensions.width < 600 ? 50 : 70, // dynamic radius
            maxOpacity: 0.8,
            minOpacity: 0.1,
            blur: 0.9,
            gradient: {
                '0.1': '#00ff00',
                '0.3': '#32ff00',
                '0.5': '#ffff00',
                '0.7': '#ff9900',
                '0.9': '#ff0000',
                '1.0': '#cc0000'
            }
        });

        // Ensure canvas CSS width/height doesn't distort
        const canvas = containerRef.current.querySelector('canvas');
        if (canvas) {
            canvas.style.width = '100%';
            canvas.style.height = '100%';
        }

        let points = [];
        if (heatData && heatData.length > 0) {
            points = heatData;
        } else {
            // Generate demo random data based on SCENARIO
            zones.forEach(zone => {
                const x = Math.round(zone.xPct * dimensions.width);
                const y = Math.round(zone.yPct * dimensions.height);

                let mainValue;
                if (scenario === 'NORMAL') {
                    mainValue = Math.floor(Math.random() * 35) + 5; // 5 - 40 (mostly Green)
                } else if (scenario === 'SURGE') {
                    mainValue = Math.floor(Math.random() * 30) + 40; // 40 - 70 (mostly Yellow)
                } else if (scenario === 'EMERGENCY') {
                    mainValue = Math.floor(Math.random() * 25) + 75; // 75 - 100 (mostly Red)
                } else {
                    mainValue = Math.floor(Math.random() * 101); // 0-100 fallback
                }

                points.push({ x, y, value: mainValue });

                // Add 2-4 nearby subpoints for spread effect
                const numSubpoints = Math.floor(Math.random() * 3) + 2;
                for (let i = 0; i < numSubpoints; i++) {
                    const offsetX = Math.round((Math.random() - 0.5) * 0.15 * dimensions.width);
                    const offsetY = Math.round((Math.random() - 0.5) * 0.15 * dimensions.height);

                    // Slightly lower value for organic spread
                    const subValue = Math.round(mainValue * (0.4 + Math.random() * 0.4));
                    points.push({ x: x + offsetX, y: y + offsetY, value: subValue });
                }
            });
        }

        heatmapInstance.current.setData({
            max: 100,
            min: 0,
            data: points
        });

    }, [dimensions, heatData, scenario]);

    return (
        <div
            style={{
                width: '100%',
                height: '650px',
                position: 'relative',
                overflow: 'hidden',
                background: 'radial-gradient(circle at center, #1a1a2e 0%, #0f0f1a 60%, #050510 100%)'
            }}
        >
            <div
                ref={containerRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 10 // heatmap canvas
                }}
            />
            {/* SVG Stadium Wireframe Overlay */}
            <svg
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 20, // above heatmap
                    pointerEvents: 'none',
                    opacity: 0.15
                }}
                viewBox="0 0 1000 1000"
                preserveAspectRatio="xMidYMid meet"
            >
                <circle cx="500" cy="500" r="450" fill="none" stroke="white" strokeWidth="4" />
                <circle cx="500" cy="500" r="300" fill="none" stroke="white" strokeWidth="3" />
                <circle cx="500" cy="500" r="100" fill="none" stroke="white" strokeWidth="2" />

                {/* Radial seating sections (8 sections) */}
                <line x1="500" y1="50" x2="500" y2="400" stroke="white" strokeWidth="2" />
                <line x1="500" y1="950" x2="500" y2="600" stroke="white" strokeWidth="2" />
                <line x1="50" y1="500" x2="400" y2="500" stroke="white" strokeWidth="2" />
                <line x1="950" y1="500" x2="600" y2="500" stroke="white" strokeWidth="2" />

                <line x1="181" y1="181" x2="429" y2="429" stroke="white" strokeWidth="2" />
                <line x1="819" y1="819" x2="571" y2="571" stroke="white" strokeWidth="2" />
                <line x1="819" y1="181" x2="571" y2="429" stroke="white" strokeWidth="2" />
                <line x1="181" y1="819" x2="429" y2="571" stroke="white" strokeWidth="2" />

                {/* Pitch / Center Field */}
                <rect x="400" y="320" width="200" height="360" rx="20" fill="none" stroke="white" strokeWidth="3" />
            </svg>
        </div>
    );
}
