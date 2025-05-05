import { users, type User, type InsertUser, type News, type InsertNews, type Service, type InsertService, type Document, type InsertDocument, type Page, type InsertPage, type MapData, type InsertMapData, type Contact, type InsertContact, news, services, documents, pages, mapData, contacts } from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc } from "drizzle-orm";
import { IStorage } from "./storage";

// Database implementation of the IStorage interface
export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }
  
  // News methods
  async getNews(id: number): Promise<News | undefined> {
    const result = await db.select().from(news).where(eq(news.id, id));
    return result[0];
  }
  
  async getNewsBySlug(slug: string): Promise<News | undefined> {
    const result = await db.select().from(news).where(eq(news.slug, slug));
    return result[0];
  }
  
  async getNewsList(limit?: number, language = "en"): Promise<News[]> {
    let query = db.select().from(news);
    
    // Apply filters
    query = query.where(eq(news.language, language));
    query = query.where(eq(news.isPublished, true));
    
    // Apply sort
    query = query.orderBy(desc(news.publishDate));
    
    // Execute query
    let result = await query;
    
    // Apply limit in JS since some DB drivers might handle it differently
    if (limit && limit > 0) {
      result = result.slice(0, limit);
    }
    
    return result;
  }
  
  async createNews(newsItem: InsertNews): Promise<News> {
    const result = await db.insert(news).values(newsItem).returning();
    return result[0];
  }
  
  async updateNews(id: number, newsUpdate: Partial<InsertNews>): Promise<News | undefined> {
    const result = await db
      .update(news)
      .set(newsUpdate)
      .where(eq(news.id, id))
      .returning();
    
    return result[0];
  }
  
  async deleteNews(id: number): Promise<boolean> {
    const result = await db.delete(news).where(eq(news.id, id)).returning({ id: news.id });
    return result.length > 0;
  }
  
  // Service methods
  async getService(id: number): Promise<Service | undefined> {
    const result = await db.select().from(services).where(eq(services.id, id));
    return result[0];
  }
  
  async getServiceBySlug(slug: string): Promise<Service | undefined> {
    const result = await db.select().from(services).where(eq(services.slug, slug));
    return result[0];
  }
  
  async getServicesList(language = "en"): Promise<Service[]> {
    let query = db.select().from(services);
    query = query.where(eq(services.language, language));
    query = query.where(eq(services.isActive, true));
    query = query.orderBy(asc(services.order));
    
    return query;
  }
  
  async createService(service: InsertService): Promise<Service> {
    const result = await db.insert(services).values(service).returning();
    return result[0];
  }
  
  async updateService(id: number, serviceUpdate: Partial<InsertService>): Promise<Service | undefined> {
    const result = await db
      .update(services)
      .set(serviceUpdate)
      .where(eq(services.id, id))
      .returning();
    
    return result[0];
  }
  
  async deleteService(id: number): Promise<boolean> {
    const result = await db.delete(services).where(eq(services.id, id)).returning({ id: services.id });
    return result.length > 0;
  }
  
  // Document methods
  async getDocument(id: number): Promise<Document | undefined> {
    const result = await db.select().from(documents).where(eq(documents.id, id));
    return result[0];
  }
  
  async getDocumentsList(category?: string, language = "en"): Promise<Document[]> {
    let query = db.select().from(documents);
    
    query = query.where(eq(documents.language, language));
    query = query.where(eq(documents.isPublic, true));
    
    if (category) {
      query = query.where(eq(documents.category, category));
    }
    
    query = query.orderBy(desc(documents.uploadedAt));
    
    return query;
  }
  
  async createDocument(document: InsertDocument): Promise<Document> {
    const now = new Date();
    const result = await db.insert(documents).values({
      ...document,
      uploadedAt: now
    }).returning();
    
    return result[0];
  }
  
  async updateDocument(id: number, documentUpdate: Partial<InsertDocument>): Promise<Document | undefined> {
    const result = await db
      .update(documents)
      .set(documentUpdate)
      .where(eq(documents.id, id))
      .returning();
    
    return result[0];
  }
  
  async deleteDocument(id: number): Promise<boolean> {
    const result = await db.delete(documents).where(eq(documents.id, id)).returning({ id: documents.id });
    return result.length > 0;
  }
  
  // Page methods
  async getPage(id: number): Promise<Page | undefined> {
    const result = await db.select().from(pages).where(eq(pages.id, id));
    return result[0];
  }
  
  async getPageBySlug(slug: string, language = "en"): Promise<Page | undefined> {
    const result = await db.select()
      .from(pages)
      .where(eq(pages.slug, slug))
      .where(eq(pages.language, language));
    
    return result[0];
  }
  
  async getPagesList(language = "en"): Promise<Page[]> {
    let query = db.select().from(pages);
    query = query.where(eq(pages.language, language));
    query = query.where(eq(pages.isPublished, true));
    
    return query;
  }
  
  async createPage(page: InsertPage): Promise<Page> {
    const now = new Date();
    const result = await db.insert(pages).values({
      ...page,
      updatedAt: now
    }).returning();
    
    return result[0];
  }
  
  async updatePage(id: number, pageUpdate: Partial<InsertPage>): Promise<Page | undefined> {
    const now = new Date();
    const result = await db
      .update(pages)
      .set({
        ...pageUpdate,
        updatedAt: now
      })
      .where(eq(pages.id, id))
      .returning();
    
    return result[0];
  }
  
  async deletePage(id: number): Promise<boolean> {
    const result = await db.delete(pages).where(eq(pages.id, id)).returning({ id: pages.id });
    return result.length > 0;
  }
  
  // Map data methods
  async getMapData(id: number): Promise<MapData | undefined> {
    const result = await db.select().from(mapData).where(eq(mapData.id, id));
    return result[0];
  }
  
  async getMapDataList(layerType?: string): Promise<MapData[]> {
    let query = db.select().from(mapData);
    query = query.where(eq(mapData.isActive, true));
    
    if (layerType) {
      query = query.where(eq(mapData.layerType, layerType));
    }
    
    return query;
  }
  
  async createMapData(data: InsertMapData): Promise<MapData> {
    const now = new Date();
    const result = await db.insert(mapData).values({
      ...data,
      createdAt: now,
      updatedAt: now
    }).returning();
    
    return result[0];
  }
  
  async updateMapData(id: number, dataUpdate: Partial<InsertMapData>): Promise<MapData | undefined> {
    const now = new Date();
    const result = await db
      .update(mapData)
      .set({
        ...dataUpdate,
        updatedAt: now
      })
      .where(eq(mapData.id, id))
      .returning();
    
    return result[0];
  }
  
  async deleteMapData(id: number): Promise<boolean> {
    const result = await db.delete(mapData).where(eq(mapData.id, id)).returning({ id: mapData.id });
    return result.length > 0;
  }
  
  // Contact methods
  async getContact(id: number): Promise<Contact | undefined> {
    const result = await db.select().from(contacts).where(eq(contacts.id, id));
    return result[0];
  }
  
  async getContactsList(): Promise<Contact[]> {
    let query = db.select().from(contacts);
    query = query.orderBy(desc(contacts.createdAt));
    
    return query;
  }
  
  async createContact(contact: InsertContact): Promise<Contact> {
    const now = new Date();
    const result = await db.insert(contacts).values({
      ...contact,
      createdAt: now,
      isRead: false
    }).returning();
    
    return result[0];
  }
  
  async updateContact(id: number, contactUpdate: Partial<InsertContact>): Promise<Contact | undefined> {
    const result = await db
      .update(contacts)
      .set(contactUpdate)
      .where(eq(contacts.id, id))
      .returning();
    
    return result[0];
  }
  
  async deleteContact(id: number): Promise<boolean> {
    const result = await db.delete(contacts).where(eq(contacts.id, id)).returning({ id: contacts.id });
    return result.length > 0;
  }
}

// Export an instance
export const dbStorage = new DatabaseStorage();