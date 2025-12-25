import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { pgTable, text, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { sql, eq, desc, asc } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

const { Pool } = pg;

// Schema definitions
const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

const proposalResponses = pgTable("proposal_responses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  accepted: boolean("accepted").notNull().default(true),
  respondedAt: timestamp("responded_at").notNull().defaultNow(),
  message: text("message"),
});

const siteVisits = pgTable("site_visits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  visitedAt: timestamp("visited_at").notNull().defaultNow(),
  userAgent: text("user_agent"),
});

const surpriseConfigs = pgTable("surprise_configs", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull().default(""),
  content: text("content").notNull().default(""),
  unlockDate: timestamp("unlock_date").notNull(),
  imagePath: text("image_path").notNull(),
  password: text("password").notNull().default(""),
});

const siteContent = pgTable("site_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
});

const insertProposalResponseSchema = createInsertSchema(proposalResponses).omit({
  id: true,
  respondedAt: true,
});

const insertSiteVisitSchema = createInsertSchema(siteVisits).omit({
  id: true,
  visitedAt: true,
});

const updateSurpriseConfigSchema = createInsertSchema(surpriseConfigs).pick({
  url: true,
  name: true,
  password: true,
  content: true,
});

// Database connection
let pool: pg.Pool | null = null;
let db: ReturnType<typeof drizzle> | null = null;

function getDb() {
  if (!db) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL must be set");
    }
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle(pool);
  }
  return db;
}

// Default data
const defaultSurprises = [
  { id: 1, name: "the day u happned", url: "", content: "", unlockDate: new Date("2026-01-12T00:00:00"), imagePath: "/surprises/photo_2025-12-14_21-18-15.jpg", password: "" },
  { id: 2, name: "soft things i Never say", url: "", content: "", unlockDate: new Date("2026-01-16T00:00:00"), imagePath: "/surprises/photo_2025-12-14_21-18-08.jpg", password: "" },
  { id: 3, name: "Us , since that day", url: "", content: "", unlockDate: new Date("2026-01-20T00:00:00"), imagePath: "/surprises/photo_2025-12-14_21-18-19.jpg", password: "" },
  { id: 4, name: "it felt like u", url: "", content: "", unlockDate: new Date("2026-01-23T00:00:00"), imagePath: "/surprises/photo_2025-12-14_21-18-11.jpg", password: "" },
  { id: 5, name: "almost a secret", url: "", content: "", unlockDate: new Date("2026-01-26T00:00:00"), imagePath: "/surprises/photo_2025-12-14_21-18-13.jpg", password: "" },
  { id: 6, name: "Nothing loud, just true", url: "", content: "", unlockDate: new Date("2026-01-29T00:00:00"), imagePath: "/surprises/photo_2025-12-14_21-18-17.jpg", password: "" },
  { id: 7, name: "if i am being honest", url: "", content: "", unlockDate: new Date("2026-02-01T00:00:00"), imagePath: "/surprises/surprise7_new.jpg", password: "" },
  { id: 8, name: "Something i' been saving", url: "", content: "", unlockDate: new Date("2026-02-05T00:00:00"), imagePath: "/surprises/photo_2025-12-14_21-18-24.jpg", password: "" },
  { id: 9, name: "More than imagination", url: "", content: "", unlockDate: new Date("2026-02-08T00:00:00"), imagePath: "/surprises/surprise9_new.jpg", password: "" },
];

const defaultSiteContent = [
  { key: "hero_title", value: "Happy Birthday" },
  { key: "hero_name", value: "Aradhya" },
  { key: "hero_subtitle", value: "From someone who thinks you're absolutely wonderful" },
  { key: "hero_signature", value: "With all my love, Jeet" },
  { key: "message_greeting", value: "Dear Aradhya," },
  { key: "message_para1", value: "On this beautiful day, I wanted to create something special just for you. A place where I could express how much you mean to me and celebrate the incredible person you are." },
  { key: "message_para2", value: "Every day with you is a blessing, and today, on your birthday, I want the whole world to know how lucky I am to have you in my life." },
  { key: "message_quote", value: "You are my today and all of my tomorrows." },
  { key: "message_quote_attribution", value: "For my dearest Aradhya" },
  { key: "memories_title", value: "Precious Memories" },
  { key: "memories_subtitle", value: "Our Journey Together" },
  { key: "things_title", value: "Things I Want You to Know" },
  { key: "things_subtitle", value: "Just a few of the countless reasons why you're so special" },
  { key: "surprises_title", value: "A Little Love Archive" },
  { key: "surprises_subtitle", value: "Click to reveal each surprise. Each one unlocks on a special day." },
  { key: "surprises_rules", value: "Each surprise is locked with a special key. To get the key, you need to complete a little challenge or wait for the right moment. The key will be revealed through our special moments together. Keep exploring and stay curious, my love!" },
  { key: "proposal_title", value: "Will you be mine forever?" },
  { key: "proposal_message", value: "Every moment with you feels like a dream come true. You make my life complete in ways I never knew possible. I want to spend every birthday, every day, every moment with you by my side." },
  { key: "footer_signature", value: "Made with love by Jeet for Aradhya" },
];

const app = express();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let initialized = false;

async function ensureInitialized() {
  if (!initialized) {
    const database = getDb();
    
    // Initialize surprises
    const existingSurprises = await database.select().from(surpriseConfigs);
    if (existingSurprises.length === 0) {
      for (const surprise of defaultSurprises) {
        await database.insert(surpriseConfigs).values(surprise).onConflictDoNothing();
      }
    }
    
    // Initialize site content
    const existingContent = await database.select().from(siteContent);
    if (existingContent.length === 0) {
      for (const content of defaultSiteContent) {
        await database.insert(siteContent).values(content).onConflictDoNothing();
      }
    }
    
    initialized = true;
  }
}

app.post("/api/proposal/accept", async (req, res) => {
  try {
    await ensureInitialized();
    const database = getDb();
    const parsed = insertProposalResponseSchema.safeParse({
      accepted: true,
      message: req.body.message || null,
    });
    
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid request data" });
    }
    
    const [response] = await database.insert(proposalResponses).values(parsed.data).returning();
    return res.json(response);
  } catch (error) {
    console.error("Error recording proposal response:", error);
    return res.status(500).json({ error: "Failed to record response" });
  }
});

app.get("/api/proposal/status", async (_req, res) => {
  try {
    await ensureInitialized();
    const database = getDb();
    const [latestResponse] = await database
      .select()
      .from(proposalResponses)
      .orderBy(desc(proposalResponses.respondedAt))
      .limit(1);
    return res.json({ 
      hasResponded: !!latestResponse,
      response: latestResponse || null 
    });
  } catch (error) {
    console.error("Error getting proposal status:", error);
    return res.status(500).json({ error: "Failed to get status" });
  }
});

app.post("/api/admin/reset-proposal", async (req, res) => {
  try {
    await ensureInitialized();
    const database = getDb();
    const { password } = req.body;
    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    await database.delete(proposalResponses);
    return res.json({ success: true });
  } catch (error) {
    console.error("Error resetting proposal:", error);
    return res.status(500).json({ error: "Failed to reset" });
  }
});

app.post("/api/visits", async (req, res) => {
  try {
    await ensureInitialized();
    const database = getDb();
    const userAgent = req.headers["user-agent"] || null;
    const parsed = insertSiteVisitSchema.safeParse({ userAgent });
    
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid request data" });
    }
    
    const [visit] = await database.insert(siteVisits).values(parsed.data).returning();
    return res.json(visit);
  } catch (error) {
    console.error("Error recording visit:", error);
    return res.status(500).json({ error: "Failed to record visit" });
  }
});

app.get("/api/visits/count", async (_req, res) => {
  try {
    await ensureInitialized();
    const database = getDb();
    const visits = await database.select().from(siteVisits);
    return res.json({ count: visits.length });
  } catch (error) {
    console.error("Error getting visit count:", error);
    return res.status(500).json({ error: "Failed to get count" });
  }
});

app.get("/api/surprises", async (_req, res) => {
  try {
    await ensureInitialized();
    const database = getDb();
    const surprises = await database.select().from(surpriseConfigs).orderBy(asc(surpriseConfigs.id));
    return res.json(surprises);
  } catch (error) {
    console.error("Error getting surprises:", error);
    return res.status(500).json({ error: "Failed to get surprises" });
  }
});

app.get("/api/surprises/:id", async (req, res) => {
  try {
    await ensureInitialized();
    const database = getDb();
    const id = parseInt(req.params.id);
    const [surprise] = await database.select().from(surpriseConfigs).where(eq(surpriseConfigs.id, id));
    if (!surprise) {
      return res.status(404).json({ error: "Surprise not found" });
    }
    return res.json(surprise);
  } catch (error) {
    console.error("Error getting surprise:", error);
    return res.status(500).json({ error: "Failed to get surprise" });
  }
});

app.post("/api/admin/surprises/:id", async (req, res) => {
  try {
    await ensureInitialized();
    const database = getDb();
    const { password, ...config } = req.body;
    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const id = parseInt(req.params.id);
    const parsed = updateSurpriseConfigSchema.safeParse(config);
    
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid config data" });
    }
    
    const updateData: any = {};
    if (parsed.data.url !== undefined) updateData.url = parsed.data.url;
    if (parsed.data.name !== undefined) updateData.name = parsed.data.name;
    if (parsed.data.password !== undefined) updateData.password = parsed.data.password;
    if (parsed.data.content !== undefined) updateData.content = parsed.data.content;
    
    const [updated] = await database
      .update(surpriseConfigs)
      .set(updateData)
      .where(eq(surpriseConfigs.id, id))
      .returning();
      
    if (!updated) {
      return res.status(404).json({ error: "Surprise not found" });
    }
    return res.json(updated);
  } catch (error) {
    console.error("Error updating surprise:", error);
    return res.status(500).json({ error: "Failed to update" });
  }
});

app.get("/api/content", async (_req, res) => {
  try {
    await ensureInitialized();
    const database = getDb();
    const content = await database.select().from(siteContent);
    return res.json(content);
  } catch (error) {
    console.error("Error getting content:", error);
    return res.status(500).json({ error: "Failed to get content" });
  }
});

app.post("/api/admin/content", async (req, res) => {
  try {
    await ensureInitialized();
    const database = getDb();
    const { password, key, value } = req.body;
    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const [existing] = await database.select().from(siteContent).where(eq(siteContent.key, key));
    
    if (existing) {
      const [updated] = await database
        .update(siteContent)
        .set({ value })
        .where(eq(siteContent.key, key))
        .returning();
      return res.json(updated);
    } else {
      const [created] = await database
        .insert(siteContent)
        .values({ key, value })
        .returning();
      return res.json(created);
    }
  } catch (error) {
    console.error("Error updating content:", error);
    return res.status(500).json({ error: "Failed to update" });
  }
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

export default app;
