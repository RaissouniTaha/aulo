import type { Request, Response } from "express";
import { storage } from "../storage";

export const getDocuments = async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string;
    const language = req.query.lang as string || "en";
    const documents = await storage.getDocumentsList(category, language);
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: "Error fetching documents" });
  }
};

export const getDocumentById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid document ID" });
    }
    
    const document = await storage.getDocument(id);
    
    if (!document || !document.isPublic) {
      return res.status(404).json({ message: "Document not found" });
    }
    
    res.json(document);
  } catch (error) {
    res.status(500).json({ message: "Error fetching document" });
  }
};
