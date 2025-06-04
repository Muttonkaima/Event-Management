import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  elements: jsonb("elements").notNull().$type<BadgeElement[]>(),
  backgroundColor: text("background_color").notNull().default("#ffffff"),
  width: integer("width").notNull().default(350),
  height: integer("height").notNull().default(220),
  createdAt: text("created_at").notNull().default("now()"),
});

export interface BadgeElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  style?: {
    fontSize?: number;
    fontWeight?: string;
    textAlign?: string;
    color?: string;
    backgroundColor?: string;
    borderRadius?: number;
    imageUrl?: string;
  };
}

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertBadgeSchema = createInsertSchema(badges).pick({
  name: true,
  elements: true,
  backgroundColor: true,
  width: true,
  height: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertBadge = z.infer<typeof insertBadgeSchema>;
export type Badge = typeof badges.$inferSelect;
