import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const proposalResponses = pgTable("proposal_responses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  accepted: boolean("accepted").notNull().default(true),
  respondedAt: timestamp("responded_at").notNull().defaultNow(),
  message: text("message"),
});

export const insertProposalResponseSchema = createInsertSchema(proposalResponses).omit({
  id: true,
  respondedAt: true,
});

export type InsertProposalResponse = z.infer<typeof insertProposalResponseSchema>;
export type ProposalResponse = typeof proposalResponses.$inferSelect;

export const siteVisits = pgTable("site_visits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  visitedAt: timestamp("visited_at").notNull().defaultNow(),
  userAgent: text("user_agent"),
});

export const insertSiteVisitSchema = createInsertSchema(siteVisits).omit({
  id: true,
  visitedAt: true,
});

export type InsertSiteVisit = z.infer<typeof insertSiteVisitSchema>;
export type SiteVisit = typeof siteVisits.$inferSelect;

export const surpriseConfigs = pgTable("surprise_configs", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull().default(""),
  content: text("content").notNull().default(""),
  unlockDate: timestamp("unlock_date").notNull(),
  imagePath: text("image_path").notNull(),
  password: text("password").notNull().default(""),
});

export const insertSurpriseConfigSchema = createInsertSchema(surpriseConfigs);
export const updateSurpriseConfigSchema = createInsertSchema(surpriseConfigs).pick({
  url: true,
  name: true,
  password: true,
  content: true,
});

export const siteContent = pgTable("site_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
});

export const insertSiteContentSchema = createInsertSchema(siteContent).omit({
  id: true,
});

export type InsertSiteContent = z.infer<typeof insertSiteContentSchema>;
export type SiteContent = typeof siteContent.$inferSelect;

export type InsertSurpriseConfig = z.infer<typeof insertSurpriseConfigSchema>;
export type SurpriseConfig = typeof surpriseConfigs.$inferSelect;
