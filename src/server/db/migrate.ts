import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";
import { config } from "@root/drizzle.config.js";

const sql = new pg.Pool({
  connectionString: config.dbCredentials.connectionString,
  max: 1,
  ssl: process.env.NODE_ENV !== "development",
});
const db = drizzle(sql);

const main = async () => {
  await migrate(db, {
    migrationsFolder: config.out,
  });
  process.exit(0);
};

main().catch((err) => {
  console.log(err);
  console.log("migrations failed");
  process.exit(1);
});
