import { config } from "dotenv";
config();
import pg from "pg";

export function getClient() {
  // Connect to postgres db
  const pgClient = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  pgClient.connect();
  //require("./setup_table").setup(pgClient);
  return pgClient;
}
