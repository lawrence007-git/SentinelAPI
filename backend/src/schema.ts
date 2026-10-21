import {
  pgTable, uuid, text, jsonb, integer, boolean, timestamp, check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const monitors = pgTable(
  "monitors",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    url: text("url").notNull(),
    method: text("method").notNull().default("GET"),
    headers: jsonb("headers").$type<Record<string, string>>().notNull().default({}),
    body: text("body"),
    intervalSeconds: integer("interval_seconds").notNull().default(300),
    timeoutMs: integer("timeout_ms").notNull().default(10000),
    expectedStatus: integer("expected_status").notNull().default(200),
    enabled: boolean("enabled").notNull().default(true),
    status: text("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    check("monitors_method_check", sql`${t.method} IN ('GET','POST','PUT','PATCH','DELETE','HEAD')`),
    check("monitors_interval_check", sql`${t.intervalSeconds} BETWEEN 60 AND 86400`),
    check("monitors_timeout_check", sql`${t.timeoutMs} BETWEEN 1000 AND 60000`),
    check("monitors_status_code_check", sql`${t.expectedStatus} BETWEEN 100 AND 599`),
    check("monitors_status_check", sql`${t.status} IN ('pending','up','down')`),
  ]
);