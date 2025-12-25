/**
 * Update existing surprise records in database with new dates and swapped positions
 * Run with: npx tsx script/update-surprises.ts
 */

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { surpriseConfigs } from "@shared/schema";
import { eq } from "drizzle-orm";

// Load .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

const updates = [
  { id: 1, unlockDate: new Date("2026-01-12T00:00:00") },
  { id: 2, unlockDate: new Date("2026-01-16T00:00:00") },
  // Swapped 3 <-> 4
  {
    id: 3,
    name: "Us , since that day",
    imagePath: "/surprises/photo_2025-12-14_21-18-19.jpg",
    unlockDate: new Date("2026-01-20T00:00:00"),
  },
  {
    id: 4,
    name: "it felt like u",
    imagePath: "/surprises/photo_2025-12-14_21-18-11.jpg",
    unlockDate: new Date("2026-01-23T00:00:00"),
  },
  // Swapped 5 <-> 6
  {
    id: 5,
    name: "almost a secret",
    imagePath: "/surprises/photo_2025-12-14_21-18-13.jpg",
    unlockDate: new Date("2026-01-26T00:00:00"),
  },
  {
    id: 6,
    name: "Nothing loud, just true",
    imagePath: "/surprises/photo_2025-12-14_21-18-17.jpg",
    unlockDate: new Date("2026-01-29T00:00:00"),
  },
  { id: 7, unlockDate: new Date("2026-02-01T00:00:00") },
  { id: 8, unlockDate: new Date("2026-02-05T00:00:00") },
  { id: 9, unlockDate: new Date("2026-02-08T00:00:00") },
];

async function updateSurprises() {
  console.log("🔄 Starting surprise updates...");

  for (const update of updates) {
    const updateData: Record<string, any> = {};
    if (update.unlockDate) updateData.unlockDate = update.unlockDate;
    if (update.name) updateData.name = update.name;
    if (update.imagePath) updateData.imagePath = update.imagePath;

    await db
      .update(surpriseConfigs)
      .set(updateData)
      .where(eq(surpriseConfigs.id, update.id));

    console.log(`✅ Updated surprise ${update.id}`);
  }

  console.log("🎉 All surprises updated successfully!");
  process.exit(0);
}

updateSurprises().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
