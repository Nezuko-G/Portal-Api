import { config } from "dotenv";
import path from "node:path";
import fs from "node:fs";

/**
 * Determine the current runtime environment.
 * Default is 'development' if NODE_ENV is not specified.
 */
export const NODE_ENV: string = process.env.NODE_ENV || "development";

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = NODE_ENV;
}

// 1. Try to load environment-specific file (.env.development, .env.production, etc.)
const specificEnvPath = path.resolve(process.cwd(), `.env.${NODE_ENV}`);
if (fs.existsSync(specificEnvPath)) {
  config({ path: specificEnvPath });
}

// 2. Load base .env as fallback for any shared or unset variables (does not overwrite existing)
const defaultEnvPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(defaultEnvPath)) {
  config({ path: defaultEnvPath });
}
