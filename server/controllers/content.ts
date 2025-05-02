import type { Request, Response } from "express";
import { storage } from "../storage";

export const getServices = async (req: Request, res: Response) => {
  try {
    const language = req.query.lang as string || "en";
    const services = await storage.getServicesList(language);
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "Error fetching services" });
  }
};

export const getServiceBySlug = async (req: Request, res: Response) => {
  try {
    const service = await storage.getServiceBySlug(req.params.slug);
    
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: "Error fetching service" });
  }
};

export const getPages = async (req: Request, res: Response) => {
  try {
    const language = req.query.lang as string || "en";
    const pages = await storage.getPagesList(language);
    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pages" });
  }
};

export const getPageBySlug = async (req: Request, res: Response) => {
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
};

export const getMapData = async (req: Request, res: Response) => {
  try {
    const layerType = req.query.layerType as string;
    const mapData = await storage.getMapDataList(layerType);
    res.json(mapData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching map data" });
  }
};
