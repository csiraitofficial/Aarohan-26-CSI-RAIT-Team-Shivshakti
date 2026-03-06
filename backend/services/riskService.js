export const classifyRiskLevel = (density) => {
    if (density < 0.5) return "LOW";
    if (density >= 0.5 && density < 0.75) return "MEDIUM";
    if (density >= 0.75 && density < 0.9) return "HIGH";
    if (density >= 0.9) return "CRITICAL";
};
