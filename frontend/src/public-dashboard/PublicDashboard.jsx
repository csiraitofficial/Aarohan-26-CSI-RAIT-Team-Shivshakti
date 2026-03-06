import React, { useState, useEffect } from 'react';
import './PublicDashboard.css';

const MOCK_ZONES = [
    { id: "z1", name: "Main Entrance", currentCapacity: 120, maxCapacity: 1000, densityPercentage: 12 },
    { id: "z2", name: "Food Court", currentCapacity: 880, maxCapacity: 1000, densityPercentage: 88 },
    { id: "z3", name: "Platform 1", currentCapacity: 950, maxCapacity: 1000, densityPercentage: 95 },
    { id: "z4", name: "Ticketing", currentCapacity: 400, maxCapacity: 1000, densityPercentage: 40 },
    { id: "z5", name: "Restrooms", currentCapacity: 60, maxCapacity: 100, densityPercentage: 60 },
    { id: "z6", name: "Exit Gate 2", currentCapacity: 200, maxCapacity: 1000, densityPercentage: 20 }
];

const MOCK_ALERTS = [
    { id: "a1", timestamp: new Date(Date.now() - 120000), severity: "Critical", headline: "Platform 1 Overcrowded", description: "Avoid Platform 1. Extreme congestion reported." },
    { id: "a2", timestamp: new Date(Date.now() - 300000), severity: "Warning", headline: "Food Court Filling Up", description: "Capacity nearing limit at Food Court. Expect delays." },
    { id: "a3", timestamp: new Date(Date.now() - 600000), severity: "Info", headline: "All entrances open", description: "Main Entrance operating normally." }
];

const MOCK_WAIT_TIMES = [
    { id: "w1", serviceName: "Security Check", estimatedMinutes: 15, maxMinutes: 60, trend: "increasing" },
    { id: "w2", serviceName: "Ticketing Queue", estimatedMinutes: 5, maxMinutes: 60, trend: "stable" },
    { id: "w3", serviceName: "Restrooms", estimatedMinutes: 8, maxMinutes: 60, trend: "decreasing" }
];

const MapGeometries = {
    "z1": { points: "50,50 250,50 250,200 50,200", center: {x: 150, y: 125} },
    "z2": { points: "280,50 550,50 550,300 280,300", center: {x: 415, y: 175} },
    "z3": { points: "580,50 780,50 780,450 580,450", center: {x: 680, y: 250} },
    "z4": { points: "50,230 250,230 250,450 50,450", center: {x: 150, y: 340} },
    "z5": { points: "280,330 400,330 400,450 280,450", center: {x: 340, y: 390} },
    "z6": { points: "430,330 550,330 550,450 430,450", center: {x: 490, y: 390} }
};

// Utilities
function getRiskLevel(density) {
    if (density < 50) return 'Safe';
    if (density < 75) return 'Moderate';
    if (density < 90) return 'High';
    return 'Critical';
}

function getRiskColorClass(level) {
    switch(level) {
        case 'Safe': return 'color-safe';
        case 'Moderate': return 'color-moderate';
        case 'High': return 'color-high';
        case 'Critical': return 'color-critical';
        default: return 'color-safe';
    }
}

function getRiskColorHex(level) {
    switch(level) {
        case 'Safe': return '#10B981';
        case 'Moderate': return '#F59E0B';
        case 'High': return '#F97316';
        case 'Critical': return '#EF4444';
        default: return '#10B981';
    }
}

function formatTime(date) {
    const diff = Math.floor((new Date() - date) / 60000);
    if (diff < 1) return "Just now";
    if (diff === 1) return "1 min ago";
    return `${diff} mins ago`;
}

export default function PublicDashboard() {
    const [zones, setZones] = useState(MOCK_ZONES.map(z => ({...z, riskLevel: getRiskLevel(z.densityPercentage)})));
    const [waitTimes, setWaitTimes] = useState([...MOCK_WAIT_TIMES]);
    const [alerts, setAlerts] = useState([...MOCK_ALERTS].sort((a,b) => b.timestamp - a.timestamp));
    const [activeTab, setActiveTab] = useState('fastest');
    const [greeting, setGreeting] = useState('');
    const [tooltipState, setTooltipState] = useState({ visible: false, x: 0, y: 0, title: '', titleColor: '', details: '', barWidth: '0%', barColor: '' });
    const [predictedTime, setPredictedTime] = useState(45);
    
    const userLocationId = "z1";
    const userDestinationId = "z5";

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good Morning");
        else if (hour < 18) setGreeting("Good Afternoon");
        else setGreeting("Good Evening");

        // Simulation Interval
        const intervalId = setInterval(() => {
            setZones(prevZones => {
                const newZones = [...prevZones];
                const numToUpdate = Math.random() > 0.5 ? 2 : 1;
                for(let i=0; i<numToUpdate; i++) {
                    const zIdx = Math.floor(Math.random() * newZones.length);
                    const zone = {...newZones[zIdx]};
                    const change = Math.floor(Math.random() * 7) - 3; 
                    let newDens = zone.densityPercentage + change;
                    if (newDens < 0) newDens = 0;
                    if (newDens > 100) newDens = 100;
                    zone.densityPercentage = newDens;
                    zone.riskLevel = getRiskLevel(newDens);
                    newZones[zIdx] = zone;
                }
                return newZones;
            });

            setWaitTimes(prev => {
                const newWT = [...prev];
                const wtIdx = Math.floor(Math.random() * newWT.length);
                const wt = {...newWT[wtIdx]};
                const wtChange = Math.floor(Math.random() * 3) - 1; 
                wt.estimatedMinutes += wtChange;
                if(wt.estimatedMinutes < 0) wt.estimatedMinutes = 0;
                
                if (wtChange > 0) wt.trend = 'increasing';
                else if (wtChange < 0) wt.trend = 'decreasing';
                else wt.trend = 'stable';
                newWT[wtIdx] = wt;
                return newWT;
            });

            if (Math.random() < 0.1) {
                setPredictedTime(Math.floor(Math.random() * 30) + 15);
            }
        }, 6000);

        return () => clearInterval(intervalId);
    }, []);

    const userZone = zones.find(z => z.id === userLocationId) || zones[0];
    const destZone = zones.find(z => z.id === userDestinationId) || zones[4];
    const worstZone = [...zones].sort((a,b) => b.densityPercentage - a.densityPercentage)[0];

    // Sorted zones for nearby list
    const order = { 'Critical': 4, 'High': 3, 'Moderate': 2, 'Safe': 1 };
    const nearbyZones = [...zones]
        .filter(z => z.id !== userLocationId)
        .sort((a, b) => order[b.riskLevel] - order[a.riskLevel]);

    const handleMapHover = (e, zone) => {
        const svgRect = e.currentTarget.closest('svg').getBoundingClientRect();
        setTooltipState({
            visible: true,
            x: e.clientX - svgRect.left,
            y: e.clientY - svgRect.top,
            title: zone.name,
            titleColor: getRiskColorHex(zone.riskLevel),
            details: `${Math.floor(zone.maxCapacity * (zone.densityPercentage/100))} / ${zone.maxCapacity} people`,
            barWidth: `${zone.densityPercentage}%`,
            barColor: getRiskColorHex(zone.riskLevel)
        });
    };

    const handleMapLeave = () => {
        setTooltipState(prev => ({ ...prev, visible: false }));
    };

    return (
        <div className="public-dashboard-wrapper">
            <header className="global-header">
                <div className="header-content">
                    <div className="logo-area">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="#FFFFFF" strokeWidth="2"/>
                            <path d="M12 6V12L16 16" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <h1>TroubleFree AI</h1>
                    </div>
                    <div className="header-info">
                        Live Public Dashboard
                    </div>
                </div>
            </header>

            <main className="dashboard-container">
                {/* Left / Center Column */}
                <div className="main-column">
                    {/* Module 1: Overview & Safety Hero Section */}
                    <section className="card module-overview" aria-label="Overview and Status">
                        <h2>{greeting}, Traveler</h2>
                        
                        <div className={`safety-badge ${userZone.riskLevel === 'Safe' || userZone.riskLevel === 'Moderate' ? 'status-safe' : (userZone.riskLevel === 'Critical' ? 'status-critical' : 'status-warning')}`}>
                            <span className="badge-icon">
                                {userZone.riskLevel === 'Safe' || userZone.riskLevel === 'Moderate' ? (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                ) : (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                                )}
                            </span>
                            <span className="badge-text">
                                {userZone.riskLevel === 'Safe' || userZone.riskLevel === 'Moderate' ? "You are in a Safe Zone" : "High Congestion Warning: Consider Relocating"}
                            </span>
                        </div>

                        <div className="nearby-zones-wrapper">
                            <h3>Nearby Zones</h3>
                            <div className="nearby-zones-list">
                                {nearbyZones.map(z => (
                                    <div className="zone-chip" key={`chip-${z.id}`}>
                                        <div className="zone-chip-header">
                                            <span className={`status-dot ${getRiskColorClass(z.riskLevel)}`}></span>
                                            <span>{z.name}</span>
                                        </div>
                                        <div className="zone-chip-density">
                                            Capacity: {z.densityPercentage}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Module 2: The Interactive Live Crowd Map */}
                    <section className="card module-map" aria-label="Live Venue Map">
                        <h2>Live Crowd Map</h2>
                        <div className="map-container" role="group" aria-label="Abstract Map of Venue Zones">
                            <svg viewBox="0 0 800 500" className="abstract-map" preserveAspectRatio="xMidYMid meet">
                                <g>
                                    {zones.map(z => {
                                        const geo = MapGeometries[z.id];
                                        return (
                                            <polygon 
                                                key={z.id}
                                                points={geo.points} 
                                                className="map-zone" 
                                                role="button"
                                                aria-label={`${z.name}, ${z.riskLevel} Risk, ${z.densityPercentage}% full`}
                                                tabIndex="0"
                                                style={{ fill: getRiskColorHex(z.riskLevel) }}
                                                onMouseMove={(e) => handleMapHover(e, z)}
                                                onMouseLeave={handleMapLeave}
                                                onFocus={(e) => handleMapHover(e, z)}
                                                onBlur={handleMapLeave}
                                            />
                                        );
                                    })}
                                </g>
                                <circle cx={MapGeometries[userLocationId].center.x} cy={MapGeometries[userLocationId].center.y} r="10" className="pulse-dot"></circle>
                            </svg>
                            
                            {/* Hover Tooltip */}
                            <div className={`map-tooltip ${tooltipState.visible ? 'visible' : ''}`} style={{ left: tooltipState.x, top: tooltipState.y }}>
                                <div className="tooltip-title" style={{ color: tooltipState.titleColor }}>{tooltipState.title}</div>
                                <div className="tooltip-bar-bg">
                                    <div className="tooltip-bar-fill" style={{ width: tooltipState.barWidth, backgroundColor: tooltipState.barColor }}></div>
                                </div>
                                <div className="tooltip-details">{tooltipState.details}</div>
                            </div>
                        </div>
                        <div className="map-legend">
                            <div className="legend-item"><span className="legend-dot color-safe"></span> Safe (0-50%)</div>
                            <div className="legend-item"><span className="legend-dot color-moderate"></span> Moderate (50-75%)</div>
                            <div className="legend-item"><span className="legend-dot color-high"></span> High Risk (75-90%)</div>
                            <div className="legend-item"><span className="legend-dot color-critical"></span> Critical (90%+)</div>
                        </div>
                    </section>

                    {/* Module 3: Safe Route Suggestion Engine */}
                    <section className="card module-route" aria-label="Route Suggestions">
                        <h2>Suggested Routes to Destination</h2>
                        <nav className="route-tabs" aria-label="Route options">
                            <button className={`tab-btn ${activeTab === 'fastest' ? 'active' : ''}`} onClick={() => setActiveTab('fastest')}>Fastest</button>
                            <button className={`tab-btn ${activeTab === 'safest' ? 'active' : ''}`} onClick={() => setActiveTab('safest')}>Safest</button>
                            <button className={`tab-btn ${activeTab === 'accessible' ? 'active' : ''}`} onClick={() => setActiveTab('accessible')}>Accessible</button>
                        </nav>

                        <div className="tab-content-container">
                            <div className={`tab-pane ${activeTab === 'fastest' ? 'active fade-in' : ''}`}>
                                <div className="route-info">
                                    <span className="route-time">Estimated: 4 mins</span>
                                </div>
                                <ul className="route-timeline">
                                    <li><span className="timeline-dot"></span><span className="route-loc">Start: {userZone.name}</span></li>
                                    <li><span className="timeline-dot"></span>Ticketing</li>
                                    <li><span className="timeline-dot"></span><span className="route-loc">Destination: {destZone.name}</span></li>
                                </ul>
                            </div>

                            <div className={`tab-pane ${activeTab === 'safest' ? 'active fade-in' : ''}`}>
                                <div className="route-info">
                                    <span className="route-badge badge-safe">Bypasses Food Court Congestion</span>
                                    <span className="route-time">Estimated: 6 mins</span>
                                </div>
                                <ul className="route-timeline">
                                    <li><span className="timeline-dot"></span><span className="route-loc">Start: {userZone.name}</span></li>
                                    <li><span className="timeline-dot"></span>Exit Gate 2</li>
                                    <li><span className="timeline-dot"></span><span className="route-loc">Destination: {destZone.name}</span></li>
                                </ul>
                            </div>

                            <div className={`tab-pane ${activeTab === 'accessible' ? 'active fade-in' : ''}`}>
                                <div className="route-info">
                                    <span className="route-badge badge-info">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/><path d="M12 7v8M8 11h8M10 22v-7l-2-2M14 22v-7l2-2"/></svg>
                                        Stair-free route
                                    </span>
                                    <span className="route-time">Estimated: 7 mins</span>
                                </div>
                                <ul className="route-timeline">
                                    <li><span className="timeline-dot"></span><span className="route-loc">Start: {userZone.name}</span></li>
                                    <li><span className="timeline-dot"></span>Elevator C</li>
                                    <li><span className="timeline-dot"></span><span className="route-loc">Destination: {destZone.name}</span></li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right SideBar Column */}
                <div className="sidebar-column">
                    {/* Module 5: Wait Time Estimation & Predictive Analytics */}
                    <section className="card module-wait-times" aria-label="Wait Time Estimation">
                        <h2>Current Queues</h2>
                        <div className="wait-times-list">
                            {waitTimes.map(wt => {
                                const pct = Math.min((wt.estimatedMinutes / wt.maxMinutes) * 100, 100);
                                return (
                                    <div className="wait-time-item" key={wt.id}>
                                        <div className="wt-header">
                                            <span>{wt.serviceName}</span>
                                            <div>
                                                <span className="wt-minutes">{wt.estimatedMinutes} min</span>
                                                <span className={`wt-trend trend-${wt.trend}`} aria-label={`Trend: ${wt.trend}`}>
                                                    {wt.trend === 'increasing' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>}
                                                    {wt.trend === 'decreasing' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>}
                                                    {wt.trend === 'stable' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line></svg>}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="wt-bar-bg">
                                            <div className="wt-bar-fill" style={{ width: `${pct}%` }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        
                        <div className="ai-insight-box">
                            <div className="ai-sparkle">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/>
                                </svg>
                            </div>
                            <p className="ai-text"><strong>TroubleFree AI</strong> predicts peak congestion at the <span>{worstZone.name}</span> will clear up in approximately <span>{predictedTime}</span> minutes.</p>
                        </div>
                    </section>

                    {/* Module 4: Real-Time Alerts Feed */}
                    <section className="card module-alerts" aria-label="Live Alerts Feed">
                        <div className="alerts-header">
                            <h2>Live Alerts Feed</h2>
                            <span className="live-indicator"><span className="dot-pulse-small"></span> Live</span>
                        </div>
                        <div className="alerts-feed">
                            {alerts.map((alert, index) => (
                                <div key={alert.id} className={`alert-card alert-${alert.severity} ${index === 0 && new Date() - alert.timestamp < 10000 ? 'alert-entering' : ''}`}>
                                    <div className="alert-header">
                                        <span className="alert-icon">
                                            {alert.severity === 'Critical' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>}
                                            {alert.severity === 'Warning' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>}
                                            {alert.severity === 'Info' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>}
                                        </span>
                                        <span className="alert-headline">{alert.headline}</span>
                                        <span className="alert-time">{formatTime(alert.timestamp)}</span>
                                    </div>
                                    <div className="alert-desc">{alert.description}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
