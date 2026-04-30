import mongoose from "mongoose";
import { config } from "dotenv";

config();

const dbconnect = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URL as string);
    console.log("MongoDB Connected Successfully");
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    throw new Error("Database Connection Failed: " + errorMessage);
  }
};
export default dbconnect;
