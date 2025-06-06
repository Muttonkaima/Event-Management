import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  template: text("template").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  timezone: text("timezone").notNull(),
  eventType: text("event_type").notNull(), // 'in-person', 'virtual', 'hybrid'
  
  // Location fields
  address: text("address"),
  city: text("city"),
  state: text("state"),
  country: text("country"),
  zipCode: text("zip_code"),
  meetingLink: text("meeting_link"),
  
  // Branding
  logoUrl: text("logo_url"),
  bannerUrl: text("banner_url"),
  colorTheme: text("color_theme").default("professional"),
  fontStyle: text("font_style").default("modern"),
  
  // Element visibility
  visibility: json("visibility").default({
    showLogo: true,
    showBanner: true,
    showDescription: true,
    showSchedule: true,
    showSpeakers: true,
    showLocation: true,
    showRegistration: true
  }),
  
  // Registration settings
  registrationOpen: timestamp("registration_open"),
  registrationClose: timestamp("registration_close"),
  maxAttendees: integer("max_attendees"),
  paymentType: text("payment_type").default("free"), // 'free', 'paid'
  ticketPrice: integer("ticket_price"),
  currency: text("currency").default("USD"),
  
  // Email content
  confirmationEmail: text("confirmation_email"),
  termsConditions: text("terms_conditions"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull().references(() => events.id),
  title: text("title").notNull(),
  speaker: text("speaker").notNull(),
  startTime: text("start_time").notNull(),
  duration: integer("duration").notNull(), // in minutes
  description: text("description"),
  tags: json("tags").default([]),
  createdAt: timestamp("created_at").defaultNow()
});

export const registrationFields = pgTable("registration_fields", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull().references(() => events.id),
  fieldName: text("field_name").notNull(),
  fieldType: text("field_type").notNull(), // 'text', 'email', 'number', 'select', etc.
  required: boolean("required").default(false),
  options: json("options"), // for select fields
  order: integer("order").notNull()
});

// Insert schemas
export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertSessionSchema = createInsertSchema(sessions).omit({
  id: true,
  createdAt: true
});

export const insertRegistrationFieldSchema = createInsertSchema(registrationFields).omit({
  id: true
});

// Types
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type RegistrationField = typeof registrationFields.$inferSelect;
export type InsertRegistrationField = z.infer<typeof insertRegistrationFieldSchema>;

// Wizard data types
export type EventTemplate = 'professional' | 'workshop' | 'social' | 'webinar';
export type EventType = 'in-person' | 'virtual' | 'hybrid';
export type ColorTheme = 'professional' | 'ocean' | 'sunset' | 'forest';
export type FontStyle = 'modern' | 'classic' | 'minimal' | 'creative' | 'elegant';

export interface SessionData {
  id?: number;
  title: string;
  speaker: string;
  startTime: string;
  duration: number;
  description?: string;
  tags: string[];
}

export interface Ticket {
  id: string;
  name: string;
  type: 'free' | 'paid';
  price?: number;
  currency?: string;
}

export interface EventWizardData {
  currentStep: number;
  template: EventTemplate;
  templateImage: string;
  event: {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    timezone: string;
    eventType: EventType;
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    meetingLink: string;
    templateImage: string;
  };
  branding: {
    logoUrl?: string;
    bannerUrl?: string;
    colorTheme: ColorTheme;
    fontStyle: FontStyle;
    visibility: {
      showLogo: boolean;
      showBanner: boolean;
      showDescription: boolean;
      showSchedule: boolean;
      showSpeakers: boolean;
      showLocation: boolean;
      showRegistration: boolean;
    };
  };
  sessions: SessionData[];
  registration: {
    registrationOpen: string;
    registrationClose: string;
    updateDeadline?: string;
    maxAttendees?: number;
    tickets: Ticket[];
    confirmationEmail: string;
    termsConditions: string;
    fields: Array<{
      fieldName: string;
      fieldType: string;
      required: boolean;
      options?: string[];
    }>;
  };
}
