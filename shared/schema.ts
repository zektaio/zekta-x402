import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// X402 Users Table - stores anonymous user identities
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  zkCommitment: text("zk_commitment").notNull().unique(),
  creditBalanceUSD: real("credit_balance_usd").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// X402 Services Table - available services in marketplace
export const x402Services = pgTable("x402_services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  priceUSD: real("price_usd").notNull(),
  x402Endpoint: text("x402_endpoint").notNull(),
  logoUrl: text("logo_url"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// X402 Purchases Table - user service purchases
export const x402Purchases = pgTable("x402_purchases", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  serviceId: integer("service_id").notNull().references(() => x402Services.id),
  priceUSDPaid: real("price_usd_paid").notNull(),
  txHash: text("tx_hash"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Credit Transactions Table - topups and spending history
export const creditTransactions = pgTable("credit_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  amountUSD: real("amount_usd").notNull(),
  type: text("type").notNull(), // 'topup' or 'spend'
  description: text("description").notNull(),
  txHash: text("tx_hash"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Zod Schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertX402ServiceSchema = createInsertSchema(x402Services).omit({ id: true, createdAt: true });
export const insertX402PurchaseSchema = createInsertSchema(x402Purchases).omit({ id: true, createdAt: true });
export const insertCreditTransactionSchema = createInsertSchema(creditTransactions).omit({ id: true, createdAt: true });

// TypeScript Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type X402Service = typeof x402Services.$inferSelect;
export type InsertX402Service = z.infer<typeof insertX402ServiceSchema>;

export type X402Purchase = typeof x402Purchases.$inferSelect;
export type InsertX402Purchase = z.infer<typeof insertX402PurchaseSchema>;

export type CreditTransaction = typeof creditTransactions.$inferSelect;
export type InsertCreditTransaction = z.infer<typeof insertCreditTransactionSchema>;
