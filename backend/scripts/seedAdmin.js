import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import connectDB from "../config/db.js";

dotenv.config();

const seedAdmin = async () => {
    try {
        await connectDB();

        const adminEmail = "siddhi@gmail.com";
        const adminPassword = "12345678";

        // Check if admin already exists
        let user = await User.findOne({ email: adminEmail });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        if (user) {
            console.log(`User ${adminEmail} already exists. Updating to Admin role...`);
            user.role = "admin";
            user.password = hashedPassword;
            await user.save();
            console.log("Admin user updated successfully.");
        } else {
            console.log(`Creating new Admin user: ${adminEmail}...`);
            await User.create({
                name: "Siddhi Admin",
                email: adminEmail,
                password: hashedPassword,
                role: "admin",
            });
            console.log("Admin user created successfully.");
        }

        console.log("-----------------------------------");
        console.log("Email: " + adminEmail);
        console.log("Password: " + adminPassword);
        console.log("Role: admin");
        console.log("-----------------------------------");

        process.exit(0);
    } catch (error) {
        console.error("Error seeding admin:", error.message);
        process.exit(1);
    }
};

seedAdmin();
