import Venue from "../models/Venue.js";
import Zone from "../models/Zone.js";

// Setup Venue and Zones in one go
export const setupVenue = async (req, res) => {
    try {
        const { name, location, zones } = req.body;
        const adminId = req.user.id;

        // 1. Create Venue
        const venue = new Venue({
            name,
            location,
            adminId
        });
        await venue.save();

        // 2. Create Zones
        const createdZones = await Promise.all(zones.map(async (z) => {
            const zone = new Zone({
                zoneName: z.name,
                capacity: z.capacity,
                venueId: venue._id,
                coordinates: z.coordinates || { latitude: 0, longitude: 0 },
                threshold: {
                    medium: 0.6,
                    high: 0.8,
                    critical: 0.95
                }
            });
            return await zone.save();
        }));

        res.status(201).json({ success: true, venue, zones: createdZones });
    } catch (error) {
        console.error("Venue Setup Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Get Admin's Venue
export const getMyVenue = async (req, res) => {
    try {
        const venue = await Venue.findOne({ adminId: req.user.id });
        if (!venue) {
            return res.status(200).json({ success: true, exists: false });
        }
        const zones = await Zone.find({ venueId: venue._id });
        res.status(200).json({ success: true, exists: true, venue, zones });
    } catch (error) {
        console.error("Get My Venue Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Delete Admin's Venue and Zones
export const deleteVenue = async (req, res) => {
    try {
        const venue = await Venue.findOne({ adminId: req.user.id });
        if (!venue) {
            return res.status(404).json({ success: false, message: "No venue found" });
        }

        // Delete all zones associated with the venue
        await Zone.deleteMany({ venueId: venue._id });

        // Delete the venue
        await venue.deleteOne();

        res.status(200).json({ success: true, message: "Venue and all associated zones deleted" });
    } catch (error) {
        console.error("Delete Venue Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
