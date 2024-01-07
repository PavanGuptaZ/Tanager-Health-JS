import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config()


const connectDB = async () => {
    try {
        mongoose.connect(process.env.DATABASE_URL)
    } catch (error) {
        console.log(error)
    }
}

export default connectDB