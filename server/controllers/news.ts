import type { Request, Response } from "express";
import { storage } from "../storage";

export const getNews = async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const language = req.query.lang as string || "en";
    const newsItems = await storage.getNewsList(limit, language);
    res.json(newsItems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching news" });
  }
};

export const getNewsBySlug = async (req: Request, res: Response) => {
  try {
    const newsItem = await storage.getNewsBySlug(req.params.slug);
    
    if (!newsItem) {
      return res.status(404).json({ message: "News item not found" });
    }
    
    res.json(newsItem);
  } catch (error) {
    res.status(500).json({ message: "Error fetching news item" });
  }
};
