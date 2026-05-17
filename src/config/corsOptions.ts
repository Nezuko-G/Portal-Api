import { CorsOptions } from "cors";

export const corsOptions: CorsOptions = {
  origin: "https://nezuko-portal.vercel.app/",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
