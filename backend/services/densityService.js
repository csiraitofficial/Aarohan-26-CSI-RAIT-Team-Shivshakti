export const calculateDensityAndRisk = (zone) => {
    const density = zone.currentOccupancy / zone.capacity;

    let riskLevel;
    if (density < 0.5) {
        riskLevel = "LOW";
    } else if (density >= 0.5 && density < 0.75) {
        riskLevel = "MEDIUM";
    } else if (density >= 0.75 && density < 0.9) {
        riskLevel = "HIGH";
    } else if (density >= 0.9) {
        riskLevel = "CRITICAL";
    }

    return {
        density,
        riskLevel,
    };
};
