import type { Config } from "drizzle-kit";
import dotenv from "dotenv";
dotenv.config();

const config = {
  schema: "./src/server/db/schema/index.ts",
  out: "./src/server/db/migrations/",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.MIGRATE_URL!,
  },
} satisfies Config;

export { config };
export default config;
