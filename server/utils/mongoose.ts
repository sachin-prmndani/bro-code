import mongoose from "mongoose";
import ENV from "../ENV.js";

async function connectDB() {
    try {
        const connection = mongoose.connect(ENV.DB_URL);
        
    } catch (error) {
        console.log("There was some error connecting database");
    }
    
}

export default connectDB;
