import mongoose from "mongoose";
import ENV from "../ENV.js";

async function connectDB() {
    try {
        if (!ENV.DB_URL) {
            throw new Error("DB_URL is not set");
        }

        await mongoose.connect(ENV.DB_URL);
        
    } catch (error) {
        console.log("There was some error connecting database");
    }
    
}

export default connectDB;
