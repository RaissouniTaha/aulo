import { users, type User, type InsertUser, type News, type InsertNews, type Service, type InsertService, type Document, type InsertDocument, type Page, type InsertPage, type MapData, type InsertMapData, type Contact, type InsertContact, news, services, documents, pages, mapData, contacts } from "@shared/schema";

// Storage interface with CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // News operations
  getNews(id: number): Promise<News | undefined>;
  getNewsBySlug(slug: string): Promise<News | undefined>;
  getNewsList(limit?: number, language?: string): Promise<News[]>;
  createNews(news: InsertNews): Promise<News>;
  updateNews(id: number, news: Partial<InsertNews>): Promise<News | undefined>;
  deleteNews(id: number): Promise<boolean>;
  
  // Service operations
  getService(id: number): Promise<Service | undefined>;
  getServiceBySlug(slug: string): Promise<Service | undefined>;
  getServicesList(language?: string): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: number): Promise<boolean>;
  
  // Document operations
  getDocument(id: number): Promise<Document | undefined>;
  getDocumentsList(category?: string, language?: string): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: number, document: Partial<InsertDocument>): Promise<Document | undefined>;
  deleteDocument(id: number): Promise<boolean>;
  
  // Page operations
  getPage(id: number): Promise<Page | undefined>;
  getPageBySlug(slug: string, language?: string): Promise<Page | undefined>;
  getPagesList(language?: string): Promise<Page[]>;
  createPage(page: InsertPage): Promise<Page>;
  updatePage(id: number, page: Partial<InsertPage>): Promise<Page | undefined>;
  deletePage(id: number): Promise<boolean>;
  
  // Map data operations
  getMapData(id: number): Promise<MapData | undefined>;
  getMapDataList(layerType?: string): Promise<MapData[]>;
  createMapData(data: InsertMapData): Promise<MapData>;
  updateMapData(id: number, data: Partial<InsertMapData>): Promise<MapData | undefined>;
  deleteMapData(id: number): Promise<boolean>;
  
  // Contact operations
  getContact(id: number): Promise<Contact | undefined>;
  getContactsList(): Promise<Contact[]>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContact(id: number, contact: Partial<InsertContact>): Promise<Contact | undefined>;
  deleteContact(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private newsItems: Map<number, News>;
  private serviceItems: Map<number, Service>;
  private documentItems: Map<number, Document>;
  private pageItems: Map<number, Page>;
  private mapDataItems: Map<number, MapData>;
  private contactItems: Map<number, Contact>;
  
  currentId: {
    users: number;
    news: number;
    services: number;
    documents: number;
    pages: number;
    mapData: number;
    contacts: number;
  };

  constructor() {
    this.users = new Map();
    this.newsItems = new Map();
    this.serviceItems = new Map();
    this.documentItems = new Map();
    this.pageItems = new Map();
    this.mapDataItems = new Map();
    this.contactItems = new Map();
    
    this.currentId = {
      users: 1,
      news: 1,
      services: 1,
      documents: 1,
      pages: 1,
      mapData: 1,
      contacts: 1,
    };
    
    // Seed with initial data
    this.seedData();
  }

  private seedData() {
    // Seed with some initial services
    const serviceSeed: InsertService[] = [
      {
        title: "Building Permits",
        slug: "building-permits",
        description: "Apply for construction and renovation permits",
        content: "Detailed information about building permits process...",
        icon: "fa-file-signature",
        imageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e",
        order: 1,
        isActive: true,
        language: "en"
      },
      {
        title: "Zoning Information",
        slug: "zoning-information",
        description: "Check zoning regulations for properties",
        content: "Detailed information about zoning regulations...",
        icon: "fa-map-marked-alt",
        imageUrl: "https://images.unsplash.com/photo-1570339012089-0e9cc418ebae",
        order: 2,
        isActive: true,
        language: "en"
      },
      {
        title: "Urban Planning",
        slug: "urban-planning",
        description: "View ongoing and future urban development plans",
        content: "Detailed information about urban planning process...",
        icon: "fa-city",
        imageUrl: "https://images.unsplash.com/photo-1495954902533-b8594cb5c7a1",
        order: 3,
        isActive: true,
        language: "en"
      }
    ];
    
    serviceSeed.forEach(service => this.createService(service));
    
    // Seed with some initial news
    const newsSeed: InsertNews[] = [
      {
        title: "Downtown Revitalization Plan Up for Public Review",
        slug: "downtown-revitalization",
        content: "Detailed content about downtown revitalization...",
        excerpt: "Join us for a series of community engagement sessions to discuss the proposed downtown revitalization project.",
        imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
        category: "Public Hearing",
        publishDate: new Date("2023-06-15"),
        isPublished: true,
        author: 1,
        language: "en"
      },
      {
        title: "New Online Permit System Launches Next Month",
        slug: "online-permit-system",
        content: "Detailed content about the new permit system...",
        excerpt: "Our new digital platform will streamline the permit application process, reducing wait times and paperwork.",
        imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd",
        category: "Announcement",
        publishDate: new Date("2023-05-28"),
        isPublished: true,
        author: 1,
        language: "en"
      },
      {
        title: "Workshop: Sustainable Urban Development Practices",
        slug: "sustainable-workshop",
        content: "Detailed content about the sustainable development workshop...",
        excerpt: "Learn about green building techniques, sustainable urban planning, and environmental conservation in city development.",
        imageUrl: "https://images.unsplash.com/photo-1544984243-ec57ea16fe25",
        category: "Event",
        publishDate: new Date("2023-05-10"),
        isPublished: true,
        author: 1,
        language: "en"
      }
    ];
    
    newsSeed.forEach(item => this.createNews(item));
    
    // Create admin user
    this.createUser({
      username: "admin",
      password: "admin123", // In a real app, this would be hashed
      email: "admin@govagency.gov",
      role: "admin",
      fullName: "Admin User"
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = { ...insertUser, id, lastLogin: null, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }
  
  // News methods
  async getNews(id: number): Promise<News | undefined> {
    return this.newsItems.get(id);
  }
  
  async getNewsBySlug(slug: string): Promise<News | undefined> {
    return Array.from(this.newsItems.values()).find(
      (item) => item.slug === slug,
    );
  }
  
  async getNewsList(limit?: number, language = "en"): Promise<News[]> {
    let newsList = Array.from(this.newsItems.values())
      .filter(item => item.language === language && item.isPublished)
      .sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
    
    if (limit) {
      newsList = newsList.slice(0, limit);
    }
    
    return newsList;
  }
  
  async createNews(newsItem: InsertNews): Promise<News> {
    const id = this.currentId.news++;
    const item: News = { ...newsItem, id };
    this.newsItems.set(id, item);
    return item;
  }
  
  async updateNews(id: number, newsUpdate: Partial<InsertNews>): Promise<News | undefined> {
    const existingNews = this.newsItems.get(id);
    if (!existingNews) return undefined;
    
    const updatedNews = { ...existingNews, ...newsUpdate };
    this.newsItems.set(id, updatedNews);
    return updatedNews;
  }
  
  async deleteNews(id: number): Promise<boolean> {
    return this.newsItems.delete(id);
  }
  
  // Service methods
  async getService(id: number): Promise<Service | undefined> {
    return this.serviceItems.get(id);
  }
  
  async getServiceBySlug(slug: string): Promise<Service | undefined> {
    return Array.from(this.serviceItems.values()).find(
      (item) => item.slug === slug,
    );
  }
  
  async getServicesList(language = "en"): Promise<Service[]> {
    return Array.from(this.serviceItems.values())
      .filter(item => item.language === language && item.isActive)
      .sort((a, b) => a.order - b.order);
  }
  
  async createService(service: InsertService): Promise<Service> {
    const id = this.currentId.services++;
    const item: Service = { ...service, id };
    this.serviceItems.set(id, item);
    return item;
  }
  
  async updateService(id: number, serviceUpdate: Partial<InsertService>): Promise<Service | undefined> {
    const existingService = this.serviceItems.get(id);
    if (!existingService) return undefined;
    
    const updatedService = { ...existingService, ...serviceUpdate };
    this.serviceItems.set(id, updatedService);
    return updatedService;
  }
  
  async deleteService(id: number): Promise<boolean> {
    return this.serviceItems.delete(id);
  }
  
  // Document methods
  async getDocument(id: number): Promise<Document | undefined> {
    return this.documentItems.get(id);
  }
  
  async getDocumentsList(category?: string, language = "en"): Promise<Document[]> {
    let docs = Array.from(this.documentItems.values())
      .filter(item => item.language === language && item.isPublic);
    
    if (category) {
      docs = docs.filter(item => item.category === category);
    }
    
    return docs.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
  }
  
  async createDocument(document: InsertDocument): Promise<Document> {
    const id = this.currentId.documents++;
    const item: Document = { ...document, id, uploadedAt: new Date() };
    this.documentItems.set(id, item);
    return item;
  }
  
  async updateDocument(id: number, documentUpdate: Partial<InsertDocument>): Promise<Document | undefined> {
    const existingDocument = this.documentItems.get(id);
    if (!existingDocument) return undefined;
    
    const updatedDocument = { ...existingDocument, ...documentUpdate };
    this.documentItems.set(id, updatedDocument);
    return updatedDocument;
  }
  
  async deleteDocument(id: number): Promise<boolean> {
    return this.documentItems.delete(id);
  }
  
  // Page methods
  async getPage(id: number): Promise<Page | undefined> {
    return this.pageItems.get(id);
  }
  
  async getPageBySlug(slug: string, language = "en"): Promise<Page | undefined> {
    return Array.from(this.pageItems.values()).find(
      (item) => item.slug === slug && item.language === language,
    );
  }
  
  async getPagesList(language = "en"): Promise<Page[]> {
    return Array.from(this.pageItems.values())
      .filter(item => item.language === language && item.isPublished);
  }
  
  async createPage(page: InsertPage): Promise<Page> {
    const id = this.currentId.pages++;
    const item: Page = { ...page, id, updatedAt: new Date() };
    this.pageItems.set(id, item);
    return item;
  }
  
  async updatePage(id: number, pageUpdate: Partial<InsertPage>): Promise<Page | undefined> {
    const existingPage = this.pageItems.get(id);
    if (!existingPage) return undefined;
    
    const updatedPage = { 
      ...existingPage, 
      ...pageUpdate,
      updatedAt: new Date() 
    };
    this.pageItems.set(id, updatedPage);
    return updatedPage;
  }
  
  async deletePage(id: number): Promise<boolean> {
    return this.pageItems.delete(id);
  }
  
  // Map data methods
  async getMapData(id: number): Promise<MapData | undefined> {
    return this.mapDataItems.get(id);
  }
  
  async getMapDataList(layerType?: string): Promise<MapData[]> {
    let mapItems = Array.from(this.mapDataItems.values())
      .filter(item => item.isActive);
    
    if (layerType) {
      mapItems = mapItems.filter(item => item.layerType === layerType);
    }
    
    return mapItems;
  }
  
  async createMapData(data: InsertMapData): Promise<MapData> {
    const id = this.currentId.mapData++;
    const item: MapData = { 
      ...data, 
      id, 
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mapDataItems.set(id, item);
    return item;
  }
  
  async updateMapData(id: number, dataUpdate: Partial<InsertMapData>): Promise<MapData | undefined> {
    const existingData = this.mapDataItems.get(id);
    if (!existingData) return undefined;
    
    const updatedData = { 
      ...existingData, 
      ...dataUpdate,
      updatedAt: new Date() 
    };
    this.mapDataItems.set(id, updatedData);
    return updatedData;
  }
  
  async deleteMapData(id: number): Promise<boolean> {
    return this.mapDataItems.delete(id);
  }
  
  // Contact methods
  async getContact(id: number): Promise<Contact | undefined> {
    return this.contactItems.get(id);
  }
  
  async getContactsList(): Promise<Contact[]> {
    return Array.from(this.contactItems.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async createContact(contact: InsertContact): Promise<Contact> {
    const id = this.currentId.contacts++;
    const item: Contact = { 
      ...contact, 
      id, 
      createdAt: new Date(),
      isRead: false
    };
    this.contactItems.set(id, item);
    return item;
  }
  
  async updateContact(id: number, contactUpdate: Partial<InsertContact>): Promise<Contact | undefined> {
    const existingContact = this.contactItems.get(id);
    if (!existingContact) return undefined;
    
    const updatedContact = { ...existingContact, ...contactUpdate };
    this.contactItems.set(id, updatedContact);
    return updatedContact;
  }
  
  async deleteContact(id: number): Promise<boolean> {
    return this.contactItems.delete(id);
  }
}

export const storage = new MemStorage();
