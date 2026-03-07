// Using built-in fetch (Node 18+)
(async () => {
    try {
        console.log("=== 1. Checking Initial Zones ===");
        let res = await fetch('http://localhost:5000/api/zones');
        let zones = await res.json();

        if (Array.isArray(zones)) {
            zones.forEach(z => {
                const density = z.capacity > 0 ? z.currentOccupancy / z.capacity : 0;
                console.log(`- ${z.zoneName}: occ=${z.currentOccupancy}, cap=${z.capacity}, density=${(density * 100).toFixed(1)}%`);
            });
        }

        console.log("\n=== 2. Triggering SURGE Simulation ===");
        let simRes = await fetch('http://localhost:5000/api/simulate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mode: 'SURGE' })
        });
        let simData = await simRes.json();
        console.log("Response:", JSON.stringify(simData, null, 2));

        console.log("\n=== 3. Checking Zones Again ===");
        res = await fetch('http://localhost:5000/api/zones');
        zones = await res.json();

        let anyOvercrowded = false;
        if (Array.isArray(zones)) {
            zones.forEach(z => {
                const density = z.capacity > 0 ? z.currentOccupancy / z.capacity : 0;
                console.log(`- ${z.zoneName}: occ=${z.currentOccupancy}, cap=${z.capacity}, density=${(density * 100).toFixed(1)}%`);
                if (density > 1.0) anyOvercrowded = true;
            });
        }

        console.log(`\nResult: Overcrowded Zone detected = ${anyOvercrowded}`);

    } catch (err) {
        console.error("Script Error:", err);
    }
})();
