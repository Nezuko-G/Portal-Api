import { CorsOptions } from "cors";

export const corsOptions: CorsOptions = {
  origin: ["https://nezuko-portal.vercel.app", "http://localhost:5173","https://nezuko-system.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
