import { 
  type User, 
  type InsertUser,
  type ProposalResponse,
  type InsertProposalResponse,
  type SiteVisit,
  type InsertSiteVisit,
  type SurpriseConfig,
  type InsertSurpriseConfig,
  type SiteContent,
  type InsertSiteContent,
  users,
  proposalResponses,
  siteVisits,
  surpriseConfigs,
  siteContent
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createProposalResponse(response: InsertProposalResponse): Promise<ProposalResponse>;
  getProposalResponses(): Promise<ProposalResponse[]>;
  getLatestProposalResponse(): Promise<ProposalResponse | undefined>;
  resetProposalResponses(): Promise<void>;
  
  createSiteVisit(visit: InsertSiteVisit): Promise<SiteVisit>;
  getSiteVisits(): Promise<SiteVisit[]>;

  getSurpriseConfigs(): Promise<SurpriseConfig[]>;
  getSurpriseConfig(id: number): Promise<SurpriseConfig | undefined>;
  updateSurpriseUrl(id: number, url: string): Promise<SurpriseConfig | undefined>;
  updateSurprise(id: number, data: { url?: string; name?: string; password?: string; content?: string; timerText?: string; imagePath?: string; unlockDate?: Date }): Promise<SurpriseConfig | undefined>;
  initializeSurprises(): Promise<void>;

  getSiteContent(): Promise<SiteContent[]>;
  getSiteContentByKey(key: string): Promise<SiteContent | undefined>;
  updateSiteContent(key: string, value: string): Promise<SiteContent>;
  initializeSiteContent(): Promise<void>;
}

export const defaultSurprises: InsertSurpriseConfig[] = [
  { id: 1, name: "the day u happned", url: "", content: "", timerText: "", unlockDate: new Date("2026-01-12T00:00:00"), imagePath: "/surprises/photo_2025-12-14_21-18-15.jpg" },
  { id: 2, name: "soft things i Never say", url: "", content: "", timerText: "", unlockDate: new Date("2026-01-16T00:00:00"), imagePath: "/surprises/photo_2025-12-14_21-18-08.jpg" },
  // swapped 3 <-> 4 as requested
  { id: 3, name: "Us , since that day", url: "", content: "", timerText: "", unlockDate: new Date("2026-01-20T00:00:00"), imagePath: "/surprises/photo_2025-12-14_21-18-19.jpg" },
  { id: 4, name: "it felt like u", url: "", content: "", timerText: "", unlockDate: new Date("2026-01-23T00:00:00"), imagePath: "/surprises/photo_2025-12-14_21-18-11.jpg" },
  // swapped 5 <-> 6 as requested
  { id: 5, name: "almost a secret", url: "", content: "", timerText: "", unlockDate: new Date("2026-01-26T00:00:00"), imagePath: "/surprises/photo_2025-12-14_21-18-13.jpg" },
  { id: 6, name: "Nothing loud, just true", url: "", content: "", timerText: "", unlockDate: new Date("2026-01-29T00:00:00"), imagePath: "/surprises/photo_2025-12-14_21-18-17.jpg" },
  { id: 7, name: "if i am being honest", url: "", content: "", timerText: "", unlockDate: new Date("2026-02-01T00:00:00"), imagePath: "/surprises/surprise7_new.jpg" },
  { id: 8, name: "Something i' been saving", url: "", content: "", timerText: "", unlockDate: new Date("2026-02-05T00:00:00"), imagePath: "/surprises/photo_2025-12-14_21-18-24.jpg" },
  { id: 9, name: "More than imagination", url: "", content: "", timerText: "", unlockDate: new Date("2026-02-05T00:00:00"), imagePath: "/surprises/surprise9_new.jpg" },
];

const defaultSiteContent: { key: string; value: string }[] = [
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

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createProposalResponse(response: InsertProposalResponse): Promise<ProposalResponse> {
    const [proposalResponse] = await db
      .insert(proposalResponses)
      .values(response)
      .returning();
    return proposalResponse;
  }

  async getProposalResponses(): Promise<ProposalResponse[]> {
    return await db.select().from(proposalResponses).orderBy(desc(proposalResponses.respondedAt));
  }

  async getLatestProposalResponse(): Promise<ProposalResponse | undefined> {
    const [response] = await db
      .select()
      .from(proposalResponses)
      .orderBy(desc(proposalResponses.respondedAt))
      .limit(1);
    return response || undefined;
  }

  async resetProposalResponses(): Promise<void> {
    await db.delete(proposalResponses);
  }

  async createSiteVisit(visit: InsertSiteVisit): Promise<SiteVisit> {
    const [siteVisit] = await db
      .insert(siteVisits)
      .values(visit)
      .returning();
    return siteVisit;
  }

  async getSiteVisits(): Promise<SiteVisit[]> {
    return await db.select().from(siteVisits).orderBy(desc(siteVisits.visitedAt));
  }

  async getSurpriseConfigs(): Promise<SurpriseConfig[]> {
    try {
      return await db.select().from(surpriseConfigs).orderBy(asc(surpriseConfigs.id));
    } catch (err) {
      // If the DB schema hasn't been migrated yet (new column), fall back
      // to selecting known columns and provide a default for `timerText`.
      console.warn("getSurpriseConfigs: falling back due to DB schema mismatch", err);
      const rows = await db
        .select({
          id: surpriseConfigs.id,
          name: surpriseConfigs.name,
          url: surpriseConfigs.url,
          content: surpriseConfigs.content,
          unlockDate: surpriseConfigs.unlockDate,
          imagePath: surpriseConfigs.imagePath,
          password: surpriseConfigs.password,
        })
        .from(surpriseConfigs)
        .orderBy(asc(surpriseConfigs.id));

      return rows.map((r: any) => ({ ...r, timerText: "" }));
    }
  }

  async getSurpriseConfig(id: number): Promise<SurpriseConfig | undefined> {
    const [config] = await db.select().from(surpriseConfigs).where(eq(surpriseConfigs.id, id));
    return config || undefined;
  }

  async updateSurpriseUrl(id: number, url: string): Promise<SurpriseConfig | undefined> {
    const [updated] = await db
      .update(surpriseConfigs)
      .set({ url })
      .where(eq(surpriseConfigs.id, id))
      .returning();
    return updated || undefined;
  }

  async updateSurprise(id: number, data: { url?: string; name?: string; password?: string; content?: string; timerText?: string; imagePath?: string; unlockDate?: Date }): Promise<SurpriseConfig | undefined> {
    const updateData: Partial<{ url: string; name: string; password: string; content: string; timerText: string; imagePath: string; unlockDate: Date }> = {};
    if (data.url !== undefined) updateData.url = data.url;
    if (data.name !== undefined) updateData.name = data.name;
    if (data.password !== undefined) updateData.password = data.password;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.timerText !== undefined) updateData.timerText = data.timerText;
    if (data.imagePath !== undefined) updateData.imagePath = data.imagePath;
    if (data.unlockDate !== undefined) updateData.unlockDate = data.unlockDate;
    
    const [updated] = await db
      .update(surpriseConfigs)
      .set(updateData)
      .where(eq(surpriseConfigs.id, id))
      .returning();
    return updated || undefined;
  }

  async initializeSurprises(): Promise<void> {
    const existing = await this.getSurpriseConfigs();
    if (existing.length === 0) {
      for (const surprise of defaultSurprises) {
        await db.insert(surpriseConfigs).values(surprise).onConflictDoNothing();
      }
    }
  }

  async getSiteContent(): Promise<SiteContent[]> {
    return await db.select().from(siteContent);
  }

  async getSiteContentByKey(key: string): Promise<SiteContent | undefined> {
    const [content] = await db.select().from(siteContent).where(eq(siteContent.key, key));
    return content || undefined;
  }

  async updateSiteContent(key: string, value: string): Promise<SiteContent> {
    const existing = await this.getSiteContentByKey(key);
    if (existing) {
      const [updated] = await db
        .update(siteContent)
        .set({ value })
        .where(eq(siteContent.key, key))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(siteContent)
        .values({ key, value })
        .returning();
      return created;
    }
  }

  async initializeSiteContent(): Promise<void> {
    const existing = await this.getSiteContent();
    if (existing.length === 0) {
      for (const content of defaultSiteContent) {
        await db.insert(siteContent).values(content).onConflictDoNothing();
      }
    }
  }
}

export const storage = new DatabaseStorage();
