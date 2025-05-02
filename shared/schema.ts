import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull().default("user"),
  fullName: text("full_name"),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  role: true,
  fullName: true,
});

// News/Announcements model
export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  imageUrl: text("image_url"),
  category: text("category").notNull(),
  publishDate: timestamp("publish_date").notNull().defaultNow(),
  isPublished: boolean("is_published").notNull().default(false),
  author: integer("author").notNull(),
  language: text("language").notNull().default("en"),
});

export const insertNewsSchema = createInsertSchema(news).pick({
  title: true,
  slug: true,
  content: true,
  excerpt: true,
  imageUrl: true,
  category: true,
  publishDate: true,
  isPublished: true,
  author: true,
  language: true,
});

// Services model
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  icon: text("icon"),
  imageUrl: text("image_url"),
  order: integer("order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  language: text("language").notNull().default("en"),
});

export const insertServiceSchema = createInsertSchema(services).pick({
  title: true,
  slug: true,
  description: true,
  content: true,
  icon: true,
  imageUrl: true,
  order: true,
  isActive: true,
  language: true,
});

// Documents model
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  category: text("category").notNull(),
  tags: text("tags").array(),
  uploadedBy: integer("uploaded_by").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  isPublic: boolean("is_public").notNull().default(true),
  language: text("language").notNull().default("en"),
});

export const insertDocumentSchema = createInsertSchema(documents).pick({
  title: true,
  description: true,
  fileUrl: true,
  fileType: true,
  fileSize: true,
  category: true,
  tags: true,
  uploadedBy: true,
  isPublic: true,
  language: true,
});

// Pages model (for CMS)
export const pages = pgTable("pages", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  isPublished: boolean("is_published").notNull().default(false),
  publishedAt: timestamp("published_at"),
  updatedAt: timestamp("updated_at").defaultNow(),
  language: text("language").notNull().default("en"),
});

export const insertPageSchema = createInsertSchema(pages).pick({
  title: true,
  slug: true,
  content: true,
  metaTitle: true,
  metaDescription: true,
  isPublished: true,
  publishedAt: true,
  language: true,
});

// Map data model
export const mapData = pgTable("map_data", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  layerType: text("layer_type").notNull(),
  geojson: jsonb("geojson").notNull(),
  style: jsonb("style"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertMapDataSchema = createInsertSchema(mapData).pick({
  title: true,
  description: true,
  layerType: true,
  geojson: true,
  style: true,
  isActive: true,
});

// Contacts model
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
  isRead: boolean("is_read").notNull().default(false),
});

export const insertContactSchema = createInsertSchema(contacts).pick({
  name: true,
  email: true,
  subject: true,
  message: true,
  phone: true,
});

// Types for the models
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertNews = z.infer<typeof insertNewsSchema>;
export type News = typeof news.$inferSelect;

export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

export type InsertPage = z.infer<typeof insertPageSchema>;
export type Page = typeof pages.$inferSelect;

export type InsertMapData = z.infer<typeof insertMapDataSchema>;
export type MapData = typeof mapData.$inferSelect;

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;
