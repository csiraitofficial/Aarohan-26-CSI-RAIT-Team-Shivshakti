/**
 * TroubleFree AI - Public Dashboard Logic
 * Part 2 & Part 3 Implementation
 */

// 1. Core Data State & Mock Data Injection
const AppState = {
    user: {
        currentLocationId: "z1", // Main Entrance
        destinationId: "z5", // Restrooms
    },
    zones: [
        { id: "z1", name: "Main Entrance", currentCapacity: 120, maxCapacity: 1000, densityPercentage: 12 },
        { id: "z2", name: "Food Court", currentCapacity: 880, maxCapacity: 1000, densityPercentage: 88 }, // Orange (High)
        { id: "z3", name: "Platform 1", currentCapacity: 950, maxCapacity: 1000, densityPercentage: 95 }, // Red (Critical)
        { id: "z4", name: "Ticketing", currentCapacity: 400, maxCapacity: 1000, densityPercentage: 40 }, // Green (Safe)
        { id: "z5", name: "Restrooms", currentCapacity: 60, maxCapacity: 100, densityPercentage: 60 }, // Yellow (Moderate)
        { id: "z6", name: "Exit Gate 2", currentCapacity: 200, maxCapacity: 1000, densityPercentage: 20 } // Green (Safe)
    ],
    alerts: [
        { id: "a1", timestamp: new Date(Date.now() - 120000), severity: "Critical", headline: "Platform 1 Overcrowded", description: "Avoid Platform 1. Extreme congestion reported." },
        { id: "a2", timestamp: new Date(Date.now() - 300000), severity: "Warning", headline: "Food Court Filling Up", description: "Capacity nearing limit at Food Court. Expect delays." },
        { id: "a3", timestamp: new Date(Date.now() - 600000), severity: "Info", headline: "All entrances open", description: "Main Entrance operating normally." }
    ],
    waitTimes: [
        { id: "w1", serviceName: "Security Check", estimatedMinutes: 15, maxMinutes: 60, trend: "increasing" },
        { id: "w2", serviceName: "Ticketing Queue", estimatedMinutes: 5, maxMinutes: 60, trend: "stable" },
        { id: "w3", serviceName: "Restrooms", estimatedMinutes: 8, maxMinutes: 60, trend: "decreasing" }
    ]
};

// Map geometries for the abstract stylized map
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

// Flags to render DOM elements once, then only update values
let appInitialized = false;

// Module Initialization
function initDashboard() {
    updateGreeting();
    renderAll();
    setupRouteTabs();
    startSimulation();
    appInitialized = true;
}

function updateGreeting() {
    const hour = new Date().getHours();
    let greeting = "Good Evening";
    if (hour < 12) greeting = "Good Morning";
    else if (hour < 18) greeting = "Good Afternoon";
    document.getElementById('greeting-text').innerText = `${greeting}, Traveler`;
}

function renderAll() {
    // Decorate zones with calculated risk
    AppState.zones.forEach(z => {
        z.riskLevel = getRiskLevel(z.densityPercentage);
    });

    renderOverview();
    renderNearbyZones();
    renderMap();
    renderRouteEndpoints();
    renderWaitTimes();
    renderAlerts();
    updateAIInsight();
}

// Module 1: Overview
function renderOverview() {
    const userZone = AppState.zones.find(z => z.id === AppState.user.currentLocationId);
    if (!userZone) return;

    const badgeObj = document.getElementById('safety-badge');
    const textObj = document.getElementById('badge-text');
    const iconContainer = document.getElementById('badge-icon-container');

    // Reset classes
    badgeObj.className = 'safety-badge';

    if (userZone.riskLevel === 'Safe' || userZone.riskLevel === 'Moderate') {
        badgeObj.classList.add('status-safe');
        textObj.innerText = "You are in a Safe Zone";
        iconContainer.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    } else {
        badgeObj.classList.add(userZone.riskLevel === 'Critical' ? 'status-critical' : 'status-warning');
        textObj.innerText = "High Congestion Warning: Consider Relocating";
        iconContainer.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
    }
}

function renderNearbyZones() {
    const container = document.getElementById('nearby-zones-list');
    
    // Sort: Critical -> High -> Moderate -> Safe
    const order = { 'Critical': 4, 'High': 3, 'Moderate': 2, 'Safe': 1 };
    const sortedZones = [...AppState.zones]
        .filter(z => z.id !== AppState.user.currentLocationId) // Exclude current
        .sort((a, b) => order[b.riskLevel] - order[a.riskLevel]);

    if (!appInitialized) {
        container.innerHTML = '';
        sortedZones.forEach(z => {
            const div = document.createElement('div');
            div.className = 'zone-chip';
            div.id = `chip-${z.id}`;
            div.innerHTML = `
                <div class="zone-chip-header">
                    <span class="status-dot ${getRiskColorClass(z.riskLevel)}" id="chip-dot-${z.id}"></span>
                    <span>${z.name}</span>
                </div>
                <div class="zone-chip-density" id="chip-dens-${z.id}">
                    Capacity: ${z.densityPercentage}%
                </div>
            `;
            container.appendChild(div);
        });
    } else {
        // Update existing chips and reorder DOM
        sortedZones.forEach(z => {
            const dot = document.getElementById(`chip-dot-${z.id}`);
            const dens = document.getElementById(`chip-dens-${z.id}`);
            const chip = document.getElementById(`chip-${z.id}`);
            if(dot) dot.className = `status-dot ${getRiskColorClass(z.riskLevel)}`;
            if(dens) dens.innerText = `Capacity: ${z.densityPercentage}%`;
            if(chip) container.appendChild(chip); // Move to correct sorted position
        });
    }
}

// Module 2: Map
function renderMap() {
    const mapShapes = document.getElementById('map-shapes');
    const tooltip = document.getElementById('map-tooltip');
    const ttName = document.getElementById('tt-name');
    const ttDetails = document.getElementById('tt-details');
    const ttBar = document.getElementById('tt-bar');
    
    // Only generate polygons on first load
    if (mapShapes.children.length === 0) {
        AppState.zones.forEach(z => {
            const geo = MapGeometries[z.id];
            const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            polygon.setAttribute('points', geo.points);
            polygon.setAttribute('class', 'map-zone');
            polygon.setAttribute('data-id', z.id);
            polygon.setAttribute('role', 'button');
            polygon.setAttribute('aria-label', `${z.name}, ${z.riskLevel} Risk, ${z.densityPercentage}% full`);
            polygon.setAttribute('tabindex', '0'); // Keyboard access
            
            // Interaction
            const showTooltip = (e) => {
                const currentZone = AppState.zones.find(x => x.id === z.id);
                ttName.innerText = currentZone.name;
                ttName.style.color = getRiskColorHex(currentZone.riskLevel);
                ttDetails.innerText = `${Math.floor(currentZone.maxCapacity * (currentZone.densityPercentage/100))} / ${currentZone.maxCapacity} people`;
                ttBar.style.width = `${currentZone.densityPercentage}%`;
                ttBar.style.backgroundColor = getRiskColorHex(currentZone.riskLevel);
                
                // Position relative to map container
                const mapRect = document.getElementById('venue-map').getBoundingClientRect();
                const x = e.clientX - mapRect.left;
                const y = e.clientY - mapRect.top;
                
                tooltip.style.left = `${x}px`;
                tooltip.style.top = `${y}px`;
                tooltip.classList.add('visible');
            };

            const hideTooltip = () => {
                tooltip.classList.remove('visible');
            };

            polygon.addEventListener('mousemove', showTooltip);
            polygon.addEventListener('mouseleave', hideTooltip);
            polygon.addEventListener('focus', (e) => showTooltip({clientX: document.getElementById('venue-map').getBoundingClientRect().left + 100, clientY: document.getElementById('venue-map').getBoundingClientRect().top + 100 })); // Approx for focus
            polygon.addEventListener('blur', hideTooltip);

            mapShapes.appendChild(polygon);
        });
    }

    // Update colors smoothly
    AppState.zones.forEach(z => {
        const poly = document.querySelector(`polygon[data-id="${z.id}"]`);
        if (poly) {
            poly.style.fill = getRiskColorHex(z.riskLevel);
            poly.setAttribute('aria-label', `${z.name}, ${z.riskLevel} Risk, ${z.densityPercentage}% full`);
        }
    });

    // Update user marker if not initialized
    if (!appInitialized) {
        const userGeo = MapGeometries[AppState.user.currentLocationId];
        if (userGeo) {
            const marker = document.getElementById('user-location-marker');
            marker.setAttribute('cx', userGeo.center.x);
            marker.setAttribute('cy', userGeo.center.y);
        }
    }
}

// Module 3: Routes endpoints injection
function renderRouteEndpoints() {
    if (appInitialized) return; // Only need this once
    const userZone = AppState.zones.find(z => z.id === AppState.user.currentLocationId);
    const destZone = AppState.zones.find(z => z.id === AppState.user.destinationId);
    
    if(userZone && destZone) {
        document.getElementById('rt-fast-start').innerText = `Start: ${userZone.name}`;
        document.getElementById('rt-fast-end').innerText = `Destination: ${destZone.name}`;
        
        document.getElementById('rt-safe-start').innerText = `Start: ${userZone.name}`;
        document.getElementById('rt-safe-end').innerText = `Destination: ${destZone.name}`;
        
        document.getElementById('rt-acc-start').innerText = `Start: ${userZone.name}`;
        document.getElementById('rt-acc-end').innerText = `Destination: ${destZone.name}`;
    }
}

function setupRouteTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active from all
            tabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active', 'fade-in'));
            
            // Add to current
            tab.classList.add('active');
            const pane = document.getElementById(tab.getAttribute('data-target'));
            pane.classList.add('active');
            // Trigger reflow for animation
            void pane.offsetWidth;
            pane.classList.add('fade-in');
        });
    });
}

// Module 4: Alerts
function renderAlerts() {
    const container = document.getElementById('alerts-feed');
    
    if (!appInitialized) {
        container.innerHTML = '';
        AppState.alerts.sort((a,b) => b.timestamp - a.timestamp).forEach((alert, index) => {
            const div = document.createElement('div');
            div.className = `alert-card alert-${alert.severity}`;
            if (index === 0 && new Date() - alert.timestamp < 10000) {
               div.classList.add('alert-entering'); 
            }

            let iconSvg = '';
            if (alert.severity === 'Critical') {
                iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
            } else if (alert.severity === 'Warning') {
                iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
            } else {
                iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
            }

            div.innerHTML = `
                <div class="alert-header">
                    <span class="alert-icon">${iconSvg}</span>
                    <span class="alert-headline">${alert.headline}</span>
                    <span class="alert-time ${alert.id}-time">${formatTime(alert.timestamp)}</span>
                </div>
                <div class="alert-desc">${alert.description}</div>
            `;
            container.appendChild(div);
        });
    } else {
        // Just update timestamps for existing alerts
        AppState.alerts.forEach(alert => {
            const timeEl = container.querySelector(`.${alert.id}-time`);
            if (timeEl) timeEl.innerText = formatTime(alert.timestamp);
        });
    }
}

// Module 5: Wait Times
function renderWaitTimes() {
    const container = document.getElementById('wait-times-list');
    
    if (!appInitialized) {
        container.innerHTML = '';
        AppState.waitTimes.forEach(wt => {
            const pct = Math.min((wt.estimatedMinutes / wt.maxMinutes) * 100, 100);

            const div = document.createElement('div');
            div.className = 'wait-time-item';
            div.id = `wt-${wt.id}`;
            div.innerHTML = `
                <div class="wt-header">
                    <span>${wt.serviceName}</span>
                    <div>
                        <span class="wt-minutes" id="wt-min-${wt.id}">${wt.estimatedMinutes} min</span>
                        <span class="wt-trend" id="wt-trend-${wt.id}" aria-label="Trend: ${wt.trend}"></span>
                    </div>
                </div>
                <div class="wt-bar-bg">
                    <div class="wt-bar-fill" id="wt-fill-${wt.id}" style="width: ${pct}%"></div>
                </div>
            `;
            container.appendChild(div);
            updateWaitTimeItem(wt);
        });
    } else {
        // Update in place smoothly
        AppState.waitTimes.forEach(updateWaitTimeItem);
    }
}

function updateWaitTimeItem(wt) {
    const pct = Math.min((wt.estimatedMinutes / wt.maxMinutes) * 100, 100);
    const minEl = document.getElementById(`wt-min-${wt.id}`);
    const trendEl = document.getElementById(`wt-trend-${wt.id}`);
    const fillEl = document.getElementById(`wt-fill-${wt.id}`);
    
    if(minEl) minEl.innerText = `${wt.estimatedMinutes} min`;
    if(fillEl) fillEl.style.width = `${pct}%`;
    
    if(trendEl) {
        trendEl.className = `wt-trend trend-${wt.trend}`;
        if (wt.trend === 'increasing') trendEl.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>`;
        else if (wt.trend === 'decreasing') trendEl.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>`;
        else trendEl.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
    }
}

function updateAIInsight() {
    // Find highest risk zone
    const worstZone = [...AppState.zones].sort((a,b) => b.densityPercentage - a.densityPercentage)[0];
    document.getElementById('ai-pred-zone').innerText = worstZone.name;
    // Update prediction time only randomly (10% chance) so it doesn't flicker too much
    if (!appInitialized || Math.random() < 0.1) {
        const predMin = Math.floor(Math.random() * 30) + 15;
        document.getElementById('predicted-clear-time').innerText = predMin;
    }
}

// Simulation Interval (5-8 Seconds)
function startSimulation() {
    setInterval(() => {
        // Pick 1 or 2 random zones
        const numToUpdate = Math.random() > 0.5 ? 2 : 1;
        for(let i=0; i<numToUpdate; i++) {
            const zIdx = Math.floor(Math.random() * AppState.zones.length);
            const zone = AppState.zones[zIdx];
            
            // Random change between -3 and +3
            const change = Math.floor(Math.random() * 7) - 3; 
            let newDens = zone.densityPercentage + change;
            
            // Clamp 0-100
            if (newDens < 0) newDens = 0;
            if (newDens > 100) newDens = 100;
            
            zone.densityPercentage = newDens;
        }

        // Randomly update a wait time
        const wtIdx = Math.floor(Math.random() * AppState.waitTimes.length);
        const wt = AppState.waitTimes[wtIdx];
        const wtChange = Math.floor(Math.random() * 3) - 1; // -1, 0, +1
        wt.estimatedMinutes += wtChange;
        if(wt.estimatedMinutes < 0) wt.estimatedMinutes = 0;
        
        if (wtChange > 0) wt.trend = 'increasing';
        else if (wtChange < 0) wt.trend = 'decreasing';
        else wt.trend = 'stable';

        // Re-render components relying on this data smoothly
        renderAll();
    }, 6000); // 6 seconds
}

// Kickoff
document.addEventListener('DOMContentLoaded', initDashboard);
