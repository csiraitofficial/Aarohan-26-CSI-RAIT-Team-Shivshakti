export const getFAQs = (req, res) => {
    const faqs = [
        {
            id: 1,
            question: "How do I resolve a critical alert?",
            answer: "To resolve a critical alert, navigate to the Safety Alerts dashboard, expand the alert card, and click the 'Mark as Resolved' button after ensuring the area is safe or staff has been dispatched."
        },
        {
            id: 2,
            question: "Why is the camera feed delayed?",
            answer: "Minor delays (1-3 seconds) in camera feeds are typical due to real-time AI processing and edge-to-cloud data transmission. Significant delays may indicate network congestion."
        },
        {
            id: 3,
            question: "How does predictive routing work?",
            answer: "Our AI analyzes real-time density metrics from multiple sensors to calculate paths that bypass high-traffic and critical-risk zones, prioritizing user safety and flow efficiency."
        }
    ];
    res.json(faqs);
};

export const getSystemStatus = (req, res) => {
    res.json({
        version: "v1.0.0-beta",
        status: "operational",
        uptime: "99.99%",
        lastUpdate: new Date().toISOString()
    });
};
