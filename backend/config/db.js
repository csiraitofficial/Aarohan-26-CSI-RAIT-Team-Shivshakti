import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;

        if (!uri) {
            throw new Error("MONGO_URI is not defined in environment variables.");
        }

        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
        });

        console.log("MongoDB connected successfully.");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);

        if (error.message.includes("querySrv")) {
            console.error(
                "DNS SRV lookup failed. Try using a non-SRV MongoDB connection string from Atlas."
            );
        }

        process.exit(1);
    }
};

export default connectDB;
