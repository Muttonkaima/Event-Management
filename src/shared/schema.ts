import { pgTable, text, serial, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const emailTemplates = pgTable("email_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  blocks: jsonb("blocks").notNull().$type<EmailBlock[]>(),
});

export const emailBlockSchema = z.object({
  id: z.string(),
  type: z.enum(['header', 'text', 'image', 'button', 'divider']),
  properties: z.record(z.any()),
});

export type EmailBlock = z.infer<typeof emailBlockSchema>;

export const insertEmailTemplateSchema = createInsertSchema(emailTemplates).pick({
  name: true,
  blocks: true,
});

export type InsertEmailTemplate = z.infer<typeof insertEmailTemplateSchema>;
export type EmailTemplate = typeof emailTemplates.$inferSelect;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
