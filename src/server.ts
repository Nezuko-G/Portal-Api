import "./config/env.js";
import { Server } from "node:http";
import mongoose from "mongoose";
import app from "./app.js";
import dbconnect from "./config/dbConnect.js";

// Global handler for uncaught synchronous exceptions
process.on("uncaughtException", (error: Error) => {
  console.error("CRITICAL: Uncaught Exception detected:", error);
  process.exit(1);
});

const PORT = Number(process.env.PORT) || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

let server: Server;

// Graceful shutdown logic
const gracefulShutdown = async (signal: string) => {
  console.log(`\nReceived ${signal}. Starting graceful shutdown...`);

  // Force shutdown after timeout if pending connections hang
  const forceExitTimeout = setTimeout(() => {
    console.error("Forcefully shutting down due to timeout (10s)");
    process.exit(1);
  }, 10000);
  forceExitTimeout.unref();

  try {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server.close((err) => {
          if (err) return reject(err);
          console.log("HTTP server closed.");
          resolve();
        });
      });
    }

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close(false);
      console.log("MongoDB connection closed.");
    }

    console.log("Graceful shutdown completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error during graceful shutdown:", error);
    process.exit(1);
  }
};

// Global handler for unhandled promise rejections
process.on("unhandledRejection", (reason: unknown) => {
  console.error("CRITICAL: Unhandled Promise Rejection:", reason);
  gracefulShutdown("unhandledRejection");
});

// Process termination signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

const startServer = async (): Promise<void> => {
  try {
    // Connect to Database
    await dbconnect();

    // Start HTTP Server
    server = app.listen(PORT, () => {
      console.log("==================================================");
      console.log(`Nezuko API Server running in [${NODE_ENV}] mode`);
      console.log(`URL: http://localhost:${PORT}`);
      console.log(`Swagger Docs: http://localhost:${PORT}/api-docs`);
      console.log("==================================================");
    });

    // Handle server errors 
    server.on("error", (error: NodeJS.ErrnoException) => {
      if (error.code === "EADDRINUSE") {
        console.error(`Error: Port ${PORT} is already in use.`);
      } else {
        console.error("Server error:", error.message);
      }
      process.exit(1);
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to start server:", message);
    process.exit(1);
  }
};

startServer();
