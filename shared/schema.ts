import { z } from "zod";
import { pgTable, serial, doublePrecision, integer, timestamp, varchar, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

// Zekta Group State Schema
export const groupStateSchema = z.object({
  root: z.string(),
  commitments: z.array(z.string()),
  groupId: z.string(),
});

export type GroupState = z.infer<typeof groupStateSchema>;

// ZK Proof Schema
export const zkProofSchema = z.object({
  proof: z.any(),
  publicSignals: z.array(z.string()),
});

export type ZKProof = z.infer<typeof zkProofSchema>;

// Transfer Action Schema
export const transferActionSchema = z.object({
  to: z.string().min(32, "Invalid Solana address"),
  lamports: z.number().min(1, "Amount must be greater than 0"),
  proof: z.any(),
  publicSignals: z.array(z.string()),
});

export type TransferAction = z.infer<typeof transferActionSchema>;

// Transfer Response Schema
export const transferResponseSchema = z.object({
  ok: z.boolean(),
  signature: z.string().optional(),
  explorer: z.string().optional(),
  error: z.string().optional(),
});

export type TransferResponse = z.infer<typeof transferResponseSchema>;

// Identity State (client-side only)
export interface IdentityState {
  identity: any | null;
  commitment: string | null;
  groupRoot: string | null;
}

// Protocol Stats Table (Database)
export const protocolStats = pgTable("protocol_stats", {
  id: serial("id").primaryKey(),
  totalVolumeUSD: doublePrecision("total_volume_usd").notNull().default(0),
  swapCount: integer("swap_count").notNull().default(0),
  proofCount: integer("proof_count").notNull().default(0),
  activeWallets: integer("active_wallets").notNull().default(0),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const insertProtocolStatsSchema = createInsertSchema(protocolStats).omit({ id: true });
export type InsertProtocolStats = z.infer<typeof insertProtocolStatsSchema>;
export type ProtocolStats = typeof protocolStats.$inferSelect;

// Daily Revenue Table (Database)
export const dailyRevenue = pgTable("daily_revenue", {
  id: serial("id").primaryKey(),
  todayTotalRevenue: doublePrecision("today_total_revenue").notNull().default(0),
  todayCreatorRewards: doublePrecision("today_creator_rewards").notNull().default(0),
  yesterdayTotalRevenue: doublePrecision("yesterday_total_revenue").notNull().default(0),
  yesterdayCreatorRewards: doublePrecision("yesterday_creator_rewards").notNull().default(0),
  cumulativeTotalRevenue: doublePrecision("cumulative_total_revenue").notNull().default(0),
  cumulativeCreatorRewards: doublePrecision("cumulative_creator_rewards").notNull().default(0),
  cumulativeDistributedUSD: doublePrecision("cumulative_distributed_usd").notNull().default(1426.48),
  totalZKSwapVolumeUSD: doublePrecision("total_zk_swap_volume_usd").notNull().default(5120),
  lockedDexVolumeBaseline: doublePrecision("locked_dex_volume_baseline").notNull().default(86000),
  lockedZKVolumeBaseline: doublePrecision("locked_zk_volume_baseline").notNull().default(5120),
  lastDexVolume24h: doublePrecision("last_dex_volume_24h").notNull().default(0),
  accumulatedDexIncrement: doublePrecision("accumulated_dex_increment").notNull().default(0),
  lastProcessedSignature: varchar("last_processed_signature", { length: 255 }),
  lastProcessedTimestamp: timestamp("last_processed_timestamp"),
  lastKnownDistributed: doublePrecision("last_known_distributed").notNull().default(0),
  lastObservedDexscreenerRevenue: doublePrecision("last_observed_dexscreener_revenue").notNull().default(0),
  nextClaimTime: timestamp("next_claim_time"),
  lastResetTime: timestamp("last_reset_time").notNull().defaultNow(),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const insertDailyRevenueSchema = createInsertSchema(dailyRevenue).omit({ id: true });
export type InsertDailyRevenue = z.infer<typeof insertDailyRevenueSchema>;
export type DailyRevenue = typeof dailyRevenue.$inferSelect;

// Unique Wallets Table (Database) - Track all unique wallet addresses permanently
export const uniqueWallets = pgTable("unique_wallets", {
  id: serial("id").primaryKey(),
  zkId: varchar("zk_id", { length: 255 }).notNull().unique(),
  firstSeenAt: timestamp("first_seen_at").notNull().defaultNow(),
});

export const insertUniqueWalletsSchema = createInsertSchema(uniqueWallets).omit({ id: true });
export type InsertUniqueWallets = z.infer<typeof insertUniqueWalletsSchema>;
export type UniqueWallets = typeof uniqueWallets.$inferSelect;

// Developers Table (Database) - Developer accounts for API access
export const developers = pgTable("developers", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertDevelopersSchema = createInsertSchema(developers).omit({ id: true, createdAt: true });
export type InsertDevelopers = z.infer<typeof insertDevelopersSchema>;
export type Developer = typeof developers.$inferSelect;

// API Keys Table (Database) - API keys for developer access
export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  developerId: integer("developer_id").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  keyHash: varchar("key_hash", { length: 255 }).notNull().unique(),
  isActive: integer("is_active").notNull().default(1),
  usageCount: integer("usage_count").notNull().default(0),
  lastUsedAt: timestamp("last_used_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertApiKeysSchema = createInsertSchema(apiKeys).omit({ id: true, createdAt: true });
export type InsertApiKeys = z.infer<typeof insertApiKeysSchema>;
export type ApiKey = typeof apiKeys.$inferSelect;

// Payment Requests Table (Database) - Track payment requests for Integration Example
export const paymentRequests = pgTable("payment_requests", {
  id: serial("id").primaryKey(),
  developerId: integer("developer_id").notNull(),
  apiKeyId: integer("api_key_id").notNull(),
  domainName: varchar("domain_name", { length: 255 }).notNull(),
  currency: varchar("currency", { length: 10 }).notNull(),
  amount: doublePrecision("amount").notNull(),
  amountUSD: doublePrecision("amount_usd").notNull(),
  depositAddress: varchar("deposit_address", { length: 255 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default('pending'),
  zkProof: varchar("zk_proof", { length: 5000 }),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPaymentRequestsSchema = createInsertSchema(paymentRequests).omit({ id: true, createdAt: true });
export type InsertPaymentRequest = z.infer<typeof insertPaymentRequestsSchema>;
export type PaymentRequest = typeof paymentRequests.$inferSelect;

// Domain Orders Table (Database) - Track domain purchases with Zekta payment
export const domainOrders = pgTable("domain_orders", {
  id: serial("id").primaryKey(),
  orderId: varchar("order_id", { length: 50 }).notNull().unique(),
  domainName: varchar("domain_name", { length: 255 }).notNull(),
  tld: varchar("tld", { length: 20 }).notNull(),
  priceUSD: doublePrecision("price_usd").notNull(),
  currency: varchar("currency", { length: 10 }).notNull(),
  amountCrypto: doublePrecision("amount_crypto").notNull(),
  depositAddress: varchar("deposit_address", { length: 255 }).notNull(),
  exchangeId: varchar("exchange_id", { length: 100 }),
  paymentStatus: varchar("payment_status", { length: 20 }).notNull().default('pending'),
  orderStatus: varchar("order_status", { length: 20 }).notNull().default('awaiting_payment'),
  customerEmail: varchar("customer_email", { length: 255 }),
  zkCommitment: varchar("zk_commitment", { length: 255 }),
  domainSecret: varchar("domain_secret", { length: 1000 }),
  zkProof: varchar("zk_proof", { length: 5000 }),
  txHash: varchar("tx_hash", { length: 255 }),
  njallaTaskId: varchar("njalla_task_id", { length: 100 }),
  njallaPaymentId: varchar("njalla_payment_id", { length: 100 }),
  njallaPaymentAddress: varchar("njalla_payment_address", { length: 255 }),
  njallaPaymentTxHash: varchar("njalla_payment_tx_hash", { length: 255 }),
  njallaPaymentAmount: doublePrecision("njalla_payment_amount"),
  njallaPaymentConfirmed: boolean("njalla_payment_confirmed").default(false),
  unsupportedTld: boolean("unsupported_tld").default(false),
  refundStatus: varchar("refund_status", { length: 20 }).default('not_needed'),
  paidAt: timestamp("paid_at"),
  deliveredAt: timestamp("delivered_at"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertDomainOrdersSchema = createInsertSchema(domainOrders).omit({ id: true, createdAt: true });
export type InsertDomainOrder = z.infer<typeof insertDomainOrdersSchema>;
export type DomainOrder = typeof domainOrders.$inferSelect;

// Gift Card Orders Table (Database) - Track gift card purchases with crypto payment (Reloadly)
export const giftCardOrders = pgTable("gift_card_orders", {
  id: serial("id").primaryKey(),
  orderId: varchar("order_id", { length: 50 }).notNull().unique(),
  giftCardType: varchar("gift_card_type", { length: 50 }).notNull(),
  denomination: integer("denomination").notNull(),
  priceUSD: doublePrecision("price_usd").notNull(),
  currency: varchar("currency", { length: 10 }).notNull(),
  amountCrypto: doublePrecision("amount_crypto").notNull(),
  depositAddress: varchar("deposit_address", { length: 255 }).notNull(),
  exchangeId: varchar("exchange_id", { length: 100 }),
  paymentStatus: varchar("payment_status", { length: 20 }).notNull().default('pending'),
  orderStatus: varchar("order_status", { length: 20 }).notNull().default('awaiting_payment'),
  zkCommitment: varchar("zk_commitment", { length: 255 }).notNull(),
  // Reloadly-specific fields
  reloadlyProductId: integer("reloadly_product_id"),
  reloadlyTransactionId: integer("reloadly_transaction_id"),
  cardNumber: varchar("card_number", { length: 500 }),
  cardPin: varchar("card_pin", { length: 500 }),
  redeemInstructions: varchar("redeem_instructions", { length: 2000 }),
  // Common fields
  zkProof: varchar("zk_proof", { length: 5000 }),
  txHash: varchar("tx_hash", { length: 255 }),
  paidAt: timestamp("paid_at"),
  deliveredAt: timestamp("delivered_at"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertGiftCardOrdersSchema = createInsertSchema(giftCardOrders).omit({ id: true, createdAt: true });
export type InsertGiftCardOrder = z.infer<typeof insertGiftCardOrdersSchema>;
export type GiftCardOrder = typeof giftCardOrders.$inferSelect;

// ZK Twitter Users Table (Database) - Track ZK identities for Twitter posting
export const zkTwitterUsers = pgTable("zk_twitter_users", {
  id: serial("id").primaryKey(),
  commitment: varchar("commitment", { length: 255 }).notNull().unique(),
  reputationScore: integer("reputation_score").notNull().default(0),
  banned: boolean("banned").notNull().default(false),
  firstSeenAt: timestamp("first_seen_at").notNull().defaultNow(),
});

export const insertZkTwitterUsersSchema = createInsertSchema(zkTwitterUsers).omit({ id: true, firstSeenAt: true });
export type InsertZkTwitterUser = z.infer<typeof insertZkTwitterUsersSchema>;
export type ZkTwitterUser = typeof zkTwitterUsers.$inferSelect;

// ZK Twitter Actions Table (Database) - Track all tweets posted via ZK proof
export const zkTwitterActions = pgTable("zk_twitter_actions", {
  id: serial("id").primaryKey(),
  commitment: varchar("commitment", { length: 255 }).notNull(),
  kind: varchar("kind", { length: 20 }).notNull(), // 'tweet', 'reply', 'retweet'
  content: varchar("content", { length: 5000 }),
  replyToTweetId: varchar("reply_to_tweet_id", { length: 100 }),
  proofHash: varchar("proof_hash", { length: 255 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default('pending'), // 'pending', 'posted', 'failed'
  tweetId: varchar("tweet_id", { length: 100 }),
  errorMessage: varchar("error_message", { length: 500 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertZkTwitterActionsSchema = createInsertSchema(zkTwitterActions).omit({ id: true, createdAt: true });
export type InsertZkTwitterAction = z.infer<typeof insertZkTwitterActionsSchema>;
export type ZkTwitterAction = typeof zkTwitterActions.$inferSelect;

// Twitter OAuth State Table (Database) - Track OAuth state for security
export const twitterOAuthState = pgTable("twitter_oauth_state", {
  id: serial("id").primaryKey(),
  state: varchar("state", { length: 255 }).notNull().unique(),
  codeVerifier: varchar("code_verifier", { length: 255 }).notNull(),
  used: boolean("used").notNull().default(false),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTwitterOAuthStateSchema = createInsertSchema(twitterOAuthState).omit({ id: true, createdAt: true });
export type InsertTwitterOAuthState = z.infer<typeof insertTwitterOAuthStateSchema>;
export type TwitterOAuthState = typeof twitterOAuthState.$inferSelect;

// Twitter OAuth Tokens Table (Database) - Persist bot access token
export const twitterOAuthTokens = pgTable("twitter_oauth_tokens", {
  id: serial("id").primaryKey(),
  accountUsername: varchar("account_username", { length: 100 }).notNull(),
  accessToken: varchar("access_token", { length: 500 }).notNull(),
  refreshToken: varchar("refresh_token", { length: 500 }),
  tokenType: varchar("token_type", { length: 50 }).notNull().default('bearer'),
  scope: varchar("scope", { length: 500 }),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertTwitterOAuthTokensSchema = createInsertSchema(twitterOAuthTokens).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertTwitterOAuthToken = z.infer<typeof insertTwitterOAuthTokensSchema>;
export type TwitterOAuthToken = typeof twitterOAuthTokens.$inferSelect;

// Bug Reports Table (Database) - Track user-reported bugs and issues
export const bugReports = pgTable("bug_reports", {
  id: serial("id").primaryKey(),
  twitterHandle: varchar("twitter_handle", { length: 100 }),
  bugDescription: varchar("bug_description", { length: 5000 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default('new'), // 'new', 'in_progress', 'fixed'
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBugReportsSchema = createInsertSchema(bugReports).omit({ id: true, createdAt: true });
export type InsertBugReport = z.infer<typeof insertBugReportsSchema>;
export type BugReport = typeof bugReports.$inferSelect;

// Loyal Holders Table (Database) - Track holders with >150 hours hold time
export const loyalHolders = pgTable("loyal_holders", {
  id: serial("id").primaryKey(),
  address: varchar("address", { length: 100 }).notNull().unique(),
  balance: doublePrecision("balance").notNull(),
  holdDurationHours: doublePrecision("hold_duration_hours").notNull(),
  firstBuyTime: timestamp("first_buy_time").notNull(),
  lastCheckTime: timestamp("last_check_time").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertLoyalHoldersSchema = createInsertSchema(loyalHolders).omit({ id: true, updatedAt: true });
export type InsertLoyalHolder = z.infer<typeof insertLoyalHoldersSchema>;
export type LoyalHolder = typeof loyalHolders.$inferSelect;

// x402 Services Table (Database) - Catalog of available x402-compatible services
export const x402Services = pgTable("x402_services", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: varchar("description", { length: 500 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(), // 'AI', 'Data', 'Web3', 'Infrastructure'
  priceUSD: doublePrecision("price_usd").notNull(),
  x402Endpoint: varchar("x402_endpoint", { length: 500 }).notNull(),
  logoUrl: varchar("logo_url", { length: 500 }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertX402ServicesSchema = createInsertSchema(x402Services).omit({ id: true, createdAt: true });
export type InsertX402Service = z.infer<typeof insertX402ServicesSchema>;
export type X402Service = typeof x402Services.$inferSelect;

// x402 Purchases Table (Database) - Track user purchases of x402 services
export const x402Purchases = pgTable("x402_purchases", {
  id: serial("id").primaryKey(),
  serviceId: integer("service_id").notNull(),
  zkCommitment: varchar("zk_commitment", { length: 255 }),
  walletAddress: varchar("wallet_address", { length: 255 }),
  paymentCurrency: varchar("payment_currency", { length: 10 }).notNull(),
  amountCrypto: doublePrecision("amount_crypto").notNull(),
  amountUSD: doublePrecision("amount_usd").notNull(),
  exchangeId: varchar("exchange_id", { length: 100 }),
  paymentStatus: varchar("payment_status", { length: 20 }).notNull().default('pending'),
  txHash: varchar("tx_hash", { length: 255 }),
  x402Response: varchar("x402_response", { length: 5000 }),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertX402PurchasesSchema = createInsertSchema(x402Purchases).omit({ id: true, createdAt: true });
export type InsertX402Purchase = z.infer<typeof insertX402PurchasesSchema>;
export type X402Purchase = typeof x402Purchases.$inferSelect;
