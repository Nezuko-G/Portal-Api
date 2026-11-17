import mongoose from "mongoose";
import { config } from "dotenv";

config();

const dbconnect = async (): Promise<void> => {
  const url = process.env.MONGODB_URL;
  if (!url) {
    throw new Error("MONGODB_URL is not defined in environment variables");
  }

  try {
    await mongoose.connect(url, {
      serverSelectionTimeoutMS: 5000, 
    });
    console.log("MongoDB Connected Successfully");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    throw new Error("Database Connection Failed: " + message, { cause: err });
  }
};

mongoose.connection.on("disconnected", () => console.warn("MongoDB disconnected"));
mongoose.connection.on("error", (err) => console.error("MongoDB error:", err));

export default dbconnect;