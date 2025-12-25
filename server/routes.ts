import type { Express } from "express";
import { type Server } from "http";
import { storage, defaultSurprises } from "./storage";
import { insertProposalResponseSchema, insertSiteVisitSchema, updateSurpriseConfigSchema } from "@shared/schema";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  await storage.initializeSurprises();
  await storage.initializeSiteContent();
  
  app.post("/api/proposal/accept", async (req, res) => {
    try {
      const parsed = insertProposalResponseSchema.safeParse({
        accepted: true,
        message: req.body.message || null,
      });
      
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid request data" });
      }
      
      const response = await storage.createProposalResponse(parsed.data);
      return res.json(response);
    } catch (error) {
      console.error("Error recording proposal response:", error);
      return res.status(500).json({ error: "Failed to record response" });
    }
  });

  app.get("/api/proposal/status", async (_req, res) => {
    try {
      const latestResponse = await storage.getLatestProposalResponse();
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
      const { password } = req.body;
      if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      await storage.resetProposalResponses();
      return res.json({ success: true });
    } catch (error) {
      console.error("Error resetting proposal:", error);
      return res.status(500).json({ error: "Failed to reset" });
    }
  });

  app.post("/api/visits", async (req, res) => {
    try {
      const userAgent = req.headers["user-agent"] || null;
      const parsed = insertSiteVisitSchema.safeParse({ userAgent });
      
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid request data" });
      }
      
      const visit = await storage.createSiteVisit(parsed.data);
      return res.json(visit);
    } catch (error) {
      console.error("Error recording visit:", error);
      return res.status(500).json({ error: "Failed to record visit" });
    }
  });

  app.get("/api/visits", async (_req, res) => {
    try {
      const visits = await storage.getSiteVisits();
      return res.json({ count: visits.length, visits });
    } catch (error) {
      console.error("Error getting visits:", error);
      return res.status(500).json({ error: "Failed to get visits" });
    }
  });

  app.post("/api/admin/login", async (req, res) => {
    try {
      const { password } = req.body;
      if (password === ADMIN_PASSWORD) {
        return res.json({ success: true });
      }
      return res.status(401).json({ error: "Invalid password" });
    } catch (error) {
      console.error("Error during admin login:", error);
      return res.status(500).json({ error: "Login failed" });
    }
  });

  app.get("/api/surprises", async (req, res) => {
    try {
      const adminPassword = req.headers["x-admin-password"];
      const isAdmin = adminPassword === ADMIN_PASSWORD;
      
      const surprises = await storage.getSurpriseConfigs();
      
      // Don't expose passwords to non-admin users
      const sanitizedSurprises = surprises.map(s => ({
        ...s,
        password: isAdmin ? s.password : (s.password ? "***" : ""),
      }));
      
      return res.json(sanitizedSurprises);
    } catch (error) {
      console.error("Error getting surprises:", error);
      return res.status(500).json({ error: "Failed to get surprises" });
    }
  });

  app.post("/api/surprises/:id/verify", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { password } = req.body;
      
      const surprise = await storage.getSurpriseConfig(id);
      if (!surprise) {
        return res.status(404).json({ error: "Surprise not found" });
      }
      
      // Check if timer has expired (unlocked)
      const isUnlocked = new Date(surprise.unlockDate).getTime() <= new Date().getTime();
      if (!isUnlocked) {
        return res.status(403).json({ error: "Surprise is still locked" });
      }
      
      // If no password is set, allow access
      if (!surprise.password || surprise.password === "") {
        return res.json({ 
          success: true, 
          content: surprise.content, 
          url: surprise.url 
        });
      }
      
      // Verify password
      if (password === surprise.password) {
        return res.json({ 
          success: true, 
          content: surprise.content, 
          url: surprise.url 
        });
      }
      
      return res.status(401).json({ error: "Incorrect key" });
    } catch (error) {
      console.error("Error verifying surprise:", error);
      return res.status(500).json({ error: "Failed to verify" });
    }
  });

  app.put("/api/surprises/:id", async (req, res) => {
    try {
      const { adminPassword } = req.body;
      if (adminPassword !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const id = parseInt(req.params.id);
      const updateData: { url?: string; name?: string; password?: string; content?: string; timerText?: string; imagePath?: string; unlockDate?: Date } = {};
      
      if (req.body.url !== undefined) updateData.url = req.body.url;
      if (req.body.name !== undefined) updateData.name = req.body.name;
      if (req.body.content !== undefined) updateData.content = req.body.content;
      if (req.body.timerText !== undefined) updateData.timerText = req.body.timerText;
      if (req.body.imagePath !== undefined) updateData.imagePath = req.body.imagePath;
      if (req.body.surprisePassword !== undefined && req.body.surprisePassword !== null) {
        updateData.password = req.body.surprisePassword;
      }
      if (req.body.unlockNow) updateData.unlockDate = new Date();
      if (req.body.relockNow) {
        // When relocking, prefer the original/default scheduled date for this surprise
        const def = defaultSurprises.find(s => s.id === id);
        if (def && def.unlockDate) {
          updateData.unlockDate = def.unlockDate;
        } else {
          const futureDate = new Date();
          futureDate.setDate(futureDate.getDate() + 30);
          updateData.unlockDate = futureDate;
        }
      }

      const updated = await storage.updateSurprise(id, updateData);
      if (!updated) {
        return res.status(404).json({ error: "Surprise not found" });
      }
      return res.json(updated);
    } catch (error) {
      console.error("Error updating surprise:", error);
      return res.status(500).json({ error: "Failed to update surprise" });
    }
  });

  // Site content routes
  app.get("/api/content", async (_req, res) => {
    try {
      const content = await storage.getSiteContent();
      const contentMap: Record<string, string> = {};
      content.forEach(item => {
        contentMap[item.key] = item.value;
      });
      return res.json(contentMap);
    } catch (error) {
      console.error("Error getting site content:", error);
      return res.status(500).json({ error: "Failed to get content" });
    }
  });

  app.put("/api/content/:key", async (req, res) => {
    try {
      const { adminPassword } = req.body;
      if (adminPassword !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { key } = req.params;
      const { value } = req.body;
      const updated = await storage.updateSiteContent(key, value);
      return res.json(updated);
    } catch (error) {
      console.error("Error updating site content:", error);
      return res.status(500).json({ error: "Failed to update content" });
    }
  });

  return httpServer;
}
