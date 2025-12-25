import mongoose from "mongoose";

import { ENV } from "./env.js";


export const connectDb = async () => {
    try {
         const conn = await mongoose.connect(ENV.DB_URL)
         console.log("✅DB Connected Successfully" , conn.connection.host);
    }
    catch (e) {
        console.error(" ❌❌ Connection Faild Due To :" , e);
        process.exit(1)
        
    }
}