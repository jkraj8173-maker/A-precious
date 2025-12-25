import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { surpriseConfigs } from "@shared/schema";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

const results = await db.select().from(surpriseConfigs);
console.log("✅ Current surprises in DB:");
results.forEach((s) => {
  console.log(`ID ${s.id}: ${s.name} | Date: ${s.unlockDate}`);
});
process.exit(0);
