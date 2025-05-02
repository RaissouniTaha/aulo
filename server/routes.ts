import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertContactSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create server
  const httpServer = createServer(app);

  // API Routes - prefix with /api
  
  // Get all services
  app.get("/api/services", async (req: Request, res: Response) => {
    try {
      const language = req.query.lang as string || "en";
      const services = await storage.getServicesList(language);
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Error fetching services" });
    }
  });
  
  // Get a specific service by slug
  app.get("/api/services/:slug", async (req: Request, res: Response) => {
    try {
      const service = await storage.getServiceBySlug(req.params.slug);
      
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      res.json(service);
    } catch (error) {
      res.status(500).json({ message: "Error fetching service" });
    }
  });
  
  // Get news items
  app.get("/api/news", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const language = req.query.lang as string || "en";
      const newsItems = await storage.getNewsList(limit, language);
      res.json(newsItems);
    } catch (error) {
      res.status(500).json({ message: "Error fetching news" });
    }
  });
  
  // Get a specific news item by slug
  app.get("/api/news/:slug", async (req: Request, res: Response) => {
    try {
      const newsItem = await storage.getNewsBySlug(req.params.slug);
      
      if (!newsItem) {
        return res.status(404).json({ message: "News item not found" });
      }
      
      res.json(newsItem);
    } catch (error) {
      res.status(500).json({ message: "Error fetching news item" });
    }
  });
  
  // Get documents
  app.get("/api/documents", async (req: Request, res: Response) => {
    try {
      const category = req.query.category as string;
      const language = req.query.lang as string || "en";
      const documents = await storage.getDocumentsList(category, language);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Error fetching documents" });
    }
  });
  
  // Get map data
  app.get("/api/map-data", async (req: Request, res: Response) => {
    try {
      const layerType = req.query.layerType as string;
      const mapData = await storage.getMapDataList(layerType);
      res.json(mapData);
    } catch (error) {
      res.status(500).json({ message: "Error fetching map data" });
    }
  });
  
  // Get a specific page by slug
  app.get("/api/pages/:slug", async (req: Request, res: Response) => {
    try {
      const language = req.query.lang as string || "en";
      const page = await storage.getPageBySlug(req.params.slug, language);
      
      if (!page || !page.isPublished) {
        return res.status(404).json({ message: "Page not found" });
      }
      
      res.json(page);
    } catch (error) {
      res.status(500).json({ message: "Error fetching page" });
    }
  });
  
  // Submit contact form
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      res.status(201).json({ message: "Contact form submitted successfully", id: contact.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Error submitting contact form" });
    }
  });

  return httpServer;
}
