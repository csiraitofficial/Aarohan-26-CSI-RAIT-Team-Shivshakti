const API_URL = "http://localhost:5000/api";

// Private helper for authorized requests
async function request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
        const data = await response.json();

        // Handle Session Expiry / Unauthorized Access
        if (response.status === 401) {
            console.warn("🔒 Session expired or unauthorized. Clearing credentials.");
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // A simple page reload will force the AuthContext to re-evaluate and redirect
            window.location.reload();
        }

        return data;
    } catch (error) {
        console.error(`📡 API Request Error [${endpoint}]:`, error);
        return { success: false, message: "Network connectivity lost." };
    }
}

export async function testBackendConnection() {
    return request('/test', { method: 'GET' });
}

// Admin / Venue Setup
export async function getMyVenue() {
    return request('/venues/my-venue');
}

export async function setupVenue(venueData) {
    return request('/venues/setup', {
        method: "POST",
        body: JSON.stringify(venueData)
    });
}

export async function deleteVenue() {
    return request('/venues', { method: "DELETE" });
}

// Zones
export async function getZones() {
    return request('/zones');
}

export async function updateZoneOccupancy(id, data) {
    return request(`/zones/${id}/occupancy`, {
        method: "PATCH",
        body: JSON.stringify(data)
    });
}

// Simulation
export async function triggerSimulation(mode) {
    return request('/simulate', {
        method: "POST",
        body: JSON.stringify({ mode })
    });
}

// Incidents & Alerts
export async function getIncidents() {
    return request('/incidents');
}

export async function getAlerts() {
    return request('/authority/alerts');
}

// Assignments & Authorities
export async function getAuthorities() {
    return request('/assignments/authorities');
}

export async function createAssignment(userId, zoneId) {
    return request('/assignments', {
        method: "POST",
        body: JSON.stringify({ userId, zoneId })
    });
}

export async function getAssignments() {
    return request('/assignments');
}

export async function getMe() {
    return request('/auth/me');
}

export async function setupNode(nodeDetails) {
    return request('/auth/node-setup', {
        method: "PATCH",
        body: JSON.stringify({ nodeDetails })
    });
}

export async function getAuthorityZones() {
    return request('/authority/zones');
}

export async function getAuthorityAlerts() {
    return request('/authority/alerts');
}
