import React, { createContext, useContext, useState, useEffect } from 'react';

const DashboardContext = createContext();

export const useDashboardContext = () => useContext(DashboardContext);

// Initial Mock Data Structure for DY Patil Stadium
const INITIAL_ZONES = [
    { id: "z1", name: "Gate 1 (Main Entry)", maxCapacity: 10000, current: 8900 }, // High/Critical - Avoid Location 
    { id: "z2", name: "North Stand (Level 1)", maxCapacity: 8000, current: 4200 }, // Moderate (Current Location)
    { id: "z3", name: "VIP Lounge Lobby", maxCapacity: 3000, current: 1100 }, // Low
    { id: "z4", name: "Food Court (South)", maxCapacity: 3000, current: 2800 }, // Critical
    { id: "z5", name: "Gate 4 (Exit Corridor)", maxCapacity: 7000, current: 5600 }, // High
    { id: "z6", name: "Merchandise Stall A", maxCapacity: 1500, current: 585 } // Low - Suggested Location
];

const INITIAL_ALERTS = [
    { id: "a1", type: "Critical", title: "Food Court (South) - OVERCROWDING", message: "Zone has reached 93% capacity. Please use North Food Court.", time: new Date(Date.now() - 50000) },
    { id: "a2", type: "Warning", title: "Gate 1 - CONGESTION", message: "Surge predicted in next 15 minutes. Divert to Gate 2.", time: new Date(Date.now() - 300000) },
    { id: "a3", type: "Warning", title: "Gate 4 Slowdown", message: "Foot traffic is moving approx 20% slower than usual.", time: new Date(Date.now() - 900000) },
    { id: "a4", type: "Resolved", title: "North Stand Clear", message: "Previous congestion has cleared.", time: new Date(Date.now() - 3600000) },
    { id: "a5", type: "Resolved", title: "Merchandise Stall Normal", message: "Wait times have returned to under 5 minutes.", time: new Date(Date.now() - 7200000) }
];

const INITIAL_WAIT_TIMES = [
    { id: "w1", zoneId: "z3", name: "VIP Entrances", currentWait: 5, trend: "stable", peakTime: "17:45" },
    { id: "w2", zoneId: "z4", name: "Food Court Lines", currentWait: 25, trend: "increasing", peakTime: "13:30" },
    { id: "w3", zoneId: "z1", name: "Gate 1 Security", currentWait: 18, trend: "decreasing", peakTime: "09:00" },
    { id: "w4", zoneId: "z5", name: "Gate 4 Exits", currentWait: 12, trend: "increasing", peakTime: "18:30" }
];

const USER_STATE = {
    name: "Siddhesh",
    email: "siddhesh@user.io",
    locationId: "z2", // North Stand
    history: ["z5", "z4"] // History
};

// Utilities for Context
const calculateDensity = (current, max) => Math.round((current / max) * 100);

const getRiskLevel = (density) => {
    if (density < 50) return 'Low';
    if (density < 75) return 'Moderate';
    if (density < 90) return 'High';
    return 'Critical';
};

const getRiskColorInfo = (level) => {
    switch (level) {
        case 'Low': return { hex: '#10B981', bgClass: 'bg-[#10B981]', textClass: 'text-[#10B981]' };
        case 'Moderate': return { hex: '#F59E0B', bgClass: 'bg-[#F59E0B]', textClass: 'text-[#F59E0B]' };
        case 'High': return { hex: '#F97316', bgClass: 'bg-[#F97316]', textClass: 'text-[#F97316]' };
        case 'Critical': return { hex: '#EF4444', bgClass: 'bg-[#EF4444]', textClass: 'text-[#EF4444]' };
        default: return { hex: '#10B981', bgClass: 'bg-[#10B981]', textClass: 'text-[#10B981]' };
    }
};

import { getNavigationZones } from '../../services/api';

export const DashboardProvider = ({ children }) => {
    const [zones, setZones] = useState(() =>
        INITIAL_ZONES.map(z => {
            const density = calculateDensity(z.current, z.maxCapacity);
            const level = getRiskLevel(density);
            return { ...z, density, riskLevel: level, colorInfo: getRiskColorInfo(level) };
        })
    );

    useEffect(() => {
        const fetchLiveZones = async () => {
            try {
                const res = await getNavigationZones();
                if (res.success && Array.isArray(res.zones)) {
                    setZones(res.zones.map(z => {
                        const density = calculateDensity(z.currentOccupancy, z.capacity);
                        const level = getRiskLevel(density);
                        return {
                            id: z._id,
                            name: z.name,
                            maxCapacity: z.capacity,
                            current: z.currentOccupancy,
                            density,
                            riskLevel: level,
                            colorInfo: getRiskColorInfo(level)
                        };
                    }));
                }
            } catch (err) {
                console.warn("Could not fetch live zones, using mock data fallback.");
            }
        };
        fetchLiveZones();
        const interval = setInterval(fetchLiveZones, 5000);
        return () => clearInterval(interval);
    }, []);

    const [alerts, setAlerts] = useState(INITIAL_ALERTS);
    const [waitTimes, setWaitTimes] = useState(INITIAL_WAIT_TIMES);
    const [user] = useState(USER_STATE);

    // Live Data Feed Simulation Engine
    useEffect(() => {
        const intervalId = setInterval(() => {
            setZones(currentZones => {
                const updated = [...currentZones];

                // Pick 2 random zones to mutate by +/- 2%
                for (let i = 0; i < 2; i++) {
                    const idx = Math.floor(Math.random() * updated.length);
                    const zone = { ...updated[idx] };

                    const changePercent = (Math.random() * 4) - 2; // -2 to +2
                    const changeAmount = Math.floor(zone.maxCapacity * (changePercent / 100));

                    let newCurrent = zone.current + changeAmount;
                    if (newCurrent < 0) newCurrent = 0;
                    if (newCurrent > zone.maxCapacity) newCurrent = zone.maxCapacity;

                    const newDensity = calculateDensity(newCurrent, zone.maxCapacity);
                    const newLevel = getRiskLevel(newDensity);

                    zone.current = newCurrent;
                    zone.density = newDensity;
                    zone.riskLevel = newLevel;
                    zone.colorInfo = getRiskColorInfo(newLevel);

                    updated[idx] = zone;
                }
                return updated;
            });

            // Randomly oscillate wait times a tiny bit
            setWaitTimes(prev => {
                const updated = [...prev];
                const idx = Math.floor(Math.random() * updated.length);
                const wt = { ...updated[idx] };
                const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1 minute
                wt.currentWait = Math.max(0, wt.currentWait + change);

                if (change > 0) wt.trend = "increasing";
                else if (change < 0) wt.trend = "decreasing";
                else wt.trend = "stable";

                updated[idx] = wt;
                return updated;
            });

        }, 10000); // Every 10 seconds

        return () => clearInterval(intervalId);
    }, []);

    // Helper functions for components
    const getUserLocationZone = () => zones.find(z => z.id === user.locationId) || zones[0];
    const getZoneById = (id) => zones.find(z => z.id === id);

    const value = {
        zones,
        alerts,
        waitTimes,
        user,
        getUserLocationZone,
        getZoneById,
        getRiskColorInfo
    };

    return (
        <DashboardContext.Provider value={value}>
            {children}
        </DashboardContext.Provider>
    );
};
