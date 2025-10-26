import { randomUUID } from "crypto";
import { db } from "./db";
import { protocolStats, dailyRevenue, uniqueWallets, developers, apiKeys, paymentRequests, domainOrders, giftCardOrders, loyalHolders, x402Services, type ProtocolStats as DBProtocolStats, type DailyRevenue as DBDailyRevenue } from "@shared/schema";
import { eq, sql, count, and, or, isNotNull } from "drizzle-orm";

export interface Deposit {
  id: string;
  commitment: string;
  amount: number;
  signature: string;
  timestamp: number;
}

export interface ProofRecord {
  orderId: string;
  proofHash: string;
  zkId: string;
  status: string;
  timestamp: number;
}

export interface ProtocolStats {
  totalSwaps: number;
  proofsVerified: number;
  activeWallets: number;
  crossChainBridges: number;
  totalVolumeUSD: number;
}

export interface SwapCreationRecord {
  orderId: string;
  timestamp: number;
  fromChain: string;
  toChain: string;
}

export interface DailyRevenueData {
  todayTotalRevenue: number;
  todayCreatorRewards: number;
  yesterdayTotalRevenue: number;
  yesterdayCreatorRewards: number;
  cumulativeTotalRevenue: number;
  cumulativeCreatorRewards: number;
  cumulativeDistributedUSD: number;
  totalZKSwapVolumeUSD: number;
  lockedDexVolumeBaseline: number;
  lockedZKVolumeBaseline: number;
  lastDexVolume24h: number;
  accumulatedDexIncrement: number;
  lastProcessedSignature?: string;
  lastProcessedTimestamp?: number;
  lastObservedDexscreenerRevenue: number;
  lastResetTime: number;
  nextClaimTime?: number;
}

export interface IStorage {
  addDeposit(commitment: string, amount: number, signature: string): Promise<Deposit>;
  getDeposit(commitment: string): Promise<Deposit | undefined>;
  getAllDeposits(): Promise<Deposit[]>;
  markWithdrawn(commitment: string): Promise<void>;
  isNullifierUsed(nullifier: string): Promise<boolean>;
  markNullifierUsed(nullifier: string): Promise<void>;
  storeProofRecord(record: ProofRecord): Promise<void>;
  getProofRecord(orderId: string): Promise<ProofRecord | undefined>;
  trackSwapCreation(orderId: string, fromChain: string, toChain: string): Promise<void>;
  getProtocolStats(): Promise<ProtocolStats>;
  updateSwapVolume(amountUSD: number): Promise<void>;
  incrementProofCount(): Promise<void>;
  initializeStats(): Promise<void>;
  getDailyRevenue(): Promise<DailyRevenueData>;
  updateDailyRevenue(totalRevenue: number, actualDistributed?: number): Promise<void>;
  resetAfterDistribution(): Promise<void>;
  executeDistribution(distributedAmount: number): Promise<void>;
  incrementZKSwapVolume(amountUSD: number): Promise<void>;
  updateDexVolumeSnapshot(currentVol24h: number, deltaToAdd: number): Promise<void>;
  addTransactionVolume(signature: string, timestamp: number, volumeUSD: number): Promise<void>;
  trackUniqueWallet(zkId: string): Promise<void>;
  
  // Developer API Management
  createDeveloper(username: string, email: string, passwordHash: string): Promise<{ id: number }>;
  getDeveloperByUsername(username: string): Promise<{ id: number; username: string; email: string; passwordHash: string; createdAt: Date } | undefined>;
  getDeveloperByEmail(email: string): Promise<{ id: number; username: string; email: string; passwordHash: string; createdAt: Date } | undefined>;
  
  // API Key Management
  createApiKey(developerId: number, name: string, keyHash: string): Promise<{ id: number; key: string }>;
  getApiKeysByDeveloper(developerId: number): Promise<Array<{ id: number; name: string; isActive: number; usageCount: number; lastUsedAt: Date | null; createdAt: Date }>>;
  validateApiKey(keyHash: string): Promise<{ valid: boolean; developerId?: number; keyId?: number }>;
  getApiKeyByHash(keyHash: string): Promise<{ id: number; developerId: number; isActive: number } | undefined>;
  incrementApiKeyUsage(keyId: number): Promise<void>;
  trackApiKeyUsage(keyId: number): Promise<void>;
  deactivateApiKey(keyId: number): Promise<void>;
  
  // Payment Requests Management
  createPaymentRequest(developerId: number, apiKeyId: number, domainName: string, currency: string, amount: number, amountUSD: number, depositAddress: string): Promise<{ id: number }>;
  getPaymentRequest(id: number): Promise<{ id: number; developerId: number; apiKeyId: number; domainName: string; currency: string; amount: number; amountUSD: number; depositAddress: string; status: string; zkProof: string | null; completedAt: Date | null; createdAt: Date } | undefined>;
  updatePaymentStatus(id: number, status: string, zkProof?: string): Promise<void>;
  
  // Domain Orders Management
  createDomainOrder(orderId: string, domainName: string, tld: string, priceUSD: number, currency: string, amountCrypto: number, depositAddress: string, customerEmail: string | null, zkCommitment: string, domainSecret: string, expiresAt: Date, exchangeId?: string): Promise<{ id: number }>;
  getDomainOrder(orderId: string): Promise<any | undefined>;
  getDomainOrderByExchangeId(exchangeId: string): Promise<any | undefined>;
  getDomainOrderByDomain(domain: string): Promise<any | undefined>;
  getDomainOrderByCommitment(zkCommitment: string): Promise<any[]>;
  updateDomainOrderPayment(orderId: string, paymentStatus: string, txHash?: string, zkProof?: string): Promise<void>;
  updateDomainOrderStatus(orderId: string, paymentStatus: string | null, updates: any): Promise<void>;
  getPaidUndeliveredOrders(): Promise<any[]>;
  getPendingDomainOrders(): Promise<any[]>;
  
  // Gift Card Orders Management
  createGiftCardOrder(orderId: string, giftCardType: string, denomination: number, priceUSD: number, currency: string, amountCrypto: number, depositAddress: string, zkCommitment: string, expiresAt: Date, exchangeId?: string): Promise<{ id: number }>;
  getGiftCardOrder(orderId: string): Promise<any | undefined>;
  getGiftCardOrderByExchangeId(exchangeId: string): Promise<any | undefined>;
  getGiftCardOrdersByCommitment(zkCommitment: string): Promise<any[]>;
  getAllGiftCardOrders(): Promise<any[]>;
  updateGiftCardOrderPayment(orderId: string, paymentStatus: string, txHash?: string, zkProof?: string): Promise<void>;
  updateGiftCardOrderStatus(orderId: string, paymentStatus: string | null, updates: any): Promise<void>;
  updateGiftCardReloadly(orderId: string, transactionId: number, productId: number): Promise<void>;
  updateGiftCardDelivery(orderId: string, cardNumber: string, cardPin: string, redeemInstructions: string | null): Promise<void>;
  getPaidUndeliveredGiftCardOrders(): Promise<any[]>;
  
  // Loyal Holders Management
  getLoyalHolders(): Promise<Array<{ address: string; balance: number; holdDurationHours: number; firstBuyTime: Date; updatedAt: Date }>>;
  upsertLoyalHolder(address: string, balance: number, holdDurationHours: number, firstBuyTime: Date, lastCheckTime: Date): Promise<void>;
  
  // x402 Services Management
  getAllX402Services(): Promise<any[]>;
  getX402Service(id: number): Promise<any | undefined>;
}

export class MemStorage implements IStorage {
  private deposits: Map<string, Deposit>;
  private withdrawnCommitments: Set<string>;
  private usedNullifiers: Set<string>;
  private proofRecords: Map<string, ProofRecord>;
  private swapCreations: Map<string, SwapCreationRecord>;
  private zkSwapVolumeUSD: number;
  private cumulativeDistributedUSD: number;
  private lastObservedDexscreenerRevenue: number;
  private accumulatedDexIncrement: number;

  constructor() {
    this.deposits = new Map();
    this.withdrawnCommitments = new Set();
    this.usedNullifiers = new Set();
    this.proofRecords = new Map();
    this.swapCreations = new Map();
    this.zkSwapVolumeUSD = 0;
    this.cumulativeDistributedUSD = 1426.48;
    this.lastObservedDexscreenerRevenue = 0;
    this.accumulatedDexIncrement = 0;
  }

  async addDeposit(commitment: string, amount: number, signature: string): Promise<Deposit> {
    const deposit: Deposit = {
      id: randomUUID(),
      commitment,
      amount,
      signature,
      timestamp: Date.now()
    };
    this.deposits.set(commitment, deposit);
    return deposit;
  }

  async getDeposit(commitment: string): Promise<Deposit | undefined> {
    return this.deposits.get(commitment);
  }

  async getAllDeposits(): Promise<Deposit[]> {
    return Array.from(this.deposits.values());
  }

  async markWithdrawn(commitment: string): Promise<void> {
    this.withdrawnCommitments.add(commitment);
  }

  async isNullifierUsed(nullifier: string): Promise<boolean> {
    return this.usedNullifiers.has(nullifier);
  }

  async markNullifierUsed(nullifier: string): Promise<void> {
    this.usedNullifiers.add(nullifier);
  }

  async storeProofRecord(record: ProofRecord): Promise<void> {
    this.proofRecords.set(record.orderId, record);
  }

  async getProofRecord(orderId: string): Promise<ProofRecord | undefined> {
    return this.proofRecords.get(orderId);
  }

  async trackSwapCreation(orderId: string, fromChain: string, toChain: string): Promise<void> {
    this.swapCreations.set(orderId, {
      orderId,
      fromChain,
      toChain,
      timestamp: Date.now()
    });
  }

  async getProtocolStats(): Promise<ProtocolStats> {
    const proofRecords = Array.from(this.proofRecords.values());
    const swapCreations = Array.from(this.swapCreations.values());
    const uniqueWallets = new Set(proofRecords.map(r => r.zkId)).size;
    
    // Count unique cross-chain swaps (different fromChain and toChain)
    const crossChainCount = swapCreations.filter(s => s.fromChain !== s.toChain).length;
    
    return {
      totalSwaps: swapCreations.length,
      proofsVerified: proofRecords.length,
      activeWallets: uniqueWallets,
      crossChainBridges: crossChainCount,
      totalVolumeUSD: 0
    };
  }

  async updateSwapVolume(amountUSD: number): Promise<void> {
    // No-op for in-memory storage
  }

  async incrementProofCount(): Promise<void> {
    // No-op for in-memory storage
  }

  async initializeStats(): Promise<void> {
    // No-op for in-memory storage
  }

  async getDailyRevenue(): Promise<DailyRevenueData> {
    return {
      todayTotalRevenue: 0,
      todayCreatorRewards: 0,
      yesterdayTotalRevenue: 0,
      yesterdayCreatorRewards: 0,
      cumulativeTotalRevenue: 0,
      cumulativeCreatorRewards: 0,
      cumulativeDistributedUSD: this.cumulativeDistributedUSD,
      totalZKSwapVolumeUSD: this.zkSwapVolumeUSD,
      lockedDexVolumeBaseline: 86000,
      lockedZKVolumeBaseline: 5120,
      lastDexVolume24h: 0,
      accumulatedDexIncrement: 0,
      lastObservedDexscreenerRevenue: this.lastObservedDexscreenerRevenue,
      lastResetTime: Date.now()
    };
  }

  async updateDailyRevenue(totalRevenue: number, actualDistributed: number = 0): Promise<void> {
    // No-op for in-memory storage
  }

  async resetAfterDistribution(): Promise<void> {
    // No-op for in-memory storage
  }

  async executeDistribution(distributedAmount: number): Promise<void> {
    this.cumulativeDistributedUSD += distributedAmount;
    this.zkSwapVolumeUSD = 0;
    this.accumulatedDexIncrement = 0;
    console.log(`💰 MemStorage distribution executed - Amount: $${distributedAmount.toFixed(2)}, Total all-time distributed: $${this.cumulativeDistributedUSD.toFixed(2)}, Pool reset`);
  }

  async incrementZKSwapVolume(amountUSD: number): Promise<void> {
    this.zkSwapVolumeUSD += amountUSD;
  }

  async updateDexVolumeSnapshot(currentVol24h: number, deltaToAdd: number): Promise<void> {
    // No-op for in-memory storage
  }

  async addTransactionVolume(signature: string, timestamp: number, volumeUSD: number): Promise<void> {
    // No-op for in-memory storage
  }

  async trackUniqueWallet(zkId: string): Promise<void> {
    // No-op for in-memory storage - wallet counting is done in getProtocolStats
  }

  // Developer API Management (stub implementations - use DBStorage in production)
  async createDeveloper(username: string, email: string, passwordHash: string): Promise<{ id: number }> {
    throw new Error("Developer API not supported in MemStorage - use DBStorage");
  }

  async getDeveloperByUsername(username: string): Promise<{ id: number; username: string; email: string; passwordHash: string; createdAt: Date } | undefined> {
    throw new Error("Developer API not supported in MemStorage - use DBStorage");
  }

  async getDeveloperByEmail(email: string): Promise<{ id: number; username: string; email: string; passwordHash: string; createdAt: Date } | undefined> {
    throw new Error("Developer API not supported in MemStorage - use DBStorage");
  }

  async createApiKey(developerId: number, name: string, keyHash: string): Promise<{ id: number; key: string }> {
    throw new Error("Developer API not supported in MemStorage - use DBStorage");
  }

  async getApiKeysByDeveloper(developerId: number): Promise<Array<{ id: number; name: string; isActive: number; usageCount: number; lastUsedAt: Date | null; createdAt: Date }>> {
    throw new Error("Developer API not supported in MemStorage - use DBStorage");
  }

  async validateApiKey(keyHash: string): Promise<{ valid: boolean; developerId?: number; keyId?: number }> {
    throw new Error("Developer API not supported in MemStorage - use DBStorage");
  }

  async getApiKeyByHash(keyHash: string): Promise<{ id: number; developerId: number; isActive: number } | undefined> {
    throw new Error("Developer API not supported in MemStorage - use DBStorage");
  }

  async incrementApiKeyUsage(keyId: number): Promise<void> {
    throw new Error("Developer API not supported in MemStorage - use DBStorage");
  }

  async trackApiKeyUsage(keyId: number): Promise<void> {
    throw new Error("Developer API not supported in MemStorage - use DBStorage");
  }

  async deactivateApiKey(keyId: number): Promise<void> {
    throw new Error("Developer API not supported in MemStorage - use DBStorage");
  }

  async createPaymentRequest(developerId: number, apiKeyId: number, domainName: string, currency: string, amount: number, amountUSD: number, depositAddress: string): Promise<{ id: number }> {
    throw new Error("Payment Requests not supported in MemStorage - use DBStorage");
  }

  async getPaymentRequest(id: number): Promise<{ id: number; developerId: number; apiKeyId: number; domainName: string; currency: string; amount: number; amountUSD: number; depositAddress: string; status: string; zkProof: string | null; completedAt: Date | null; createdAt: Date } | undefined> {
    throw new Error("Payment Requests not supported in MemStorage - use DBStorage");
  }

  async updatePaymentStatus(id: number, status: string, zkProof?: string): Promise<void> {
    throw new Error("Payment Requests not supported in MemStorage - use DBStorage");
  }

  async createDomainOrder(orderId: string, domainName: string, tld: string, priceUSD: number, currency: string, amountCrypto: number, depositAddress: string, customerEmail: string | null, zkCommitment: string, domainSecret: string, expiresAt: Date, exchangeId?: string): Promise<{ id: number }> {
    throw new Error("Domain Orders not supported in MemStorage - use DBStorage");
  }

  async getDomainOrder(orderId: string): Promise<any | undefined> {
    throw new Error("Domain Orders not supported in MemStorage - use DBStorage");
  }

  async getDomainOrderByExchangeId(exchangeId: string): Promise<any | undefined> {
    throw new Error("Domain Orders not supported in MemStorage - use DBStorage");
  }

  async getDomainOrderByDomain(domain: string): Promise<any | undefined> {
    throw new Error("Domain Orders not supported in MemStorage - use DBStorage");
  }

  async getDomainOrderByCommitment(zkCommitment: string): Promise<any[]> {
    throw new Error("Domain Orders not supported in MemStorage - use DBStorage");
  }

  async getPendingDomainOrders(): Promise<any[]> {
    throw new Error("Domain Orders not supported in MemStorage - use DBStorage");
  }

  async updateDomainOrderPayment(orderId: string, paymentStatus: string, txHash?: string, zkProof?: string): Promise<void> {
    throw new Error("Domain Orders not supported in MemStorage - use DBStorage");
  }

  async updateDomainOrderStatus(orderId: string, paymentStatus: string | null, updates: any): Promise<void> {
    throw new Error("Domain Orders not supported in MemStorage - use DBStorage");
  }

  async createGiftCardOrder(orderId: string, giftCardType: string, denomination: number, priceUSD: number, currency: string, amountCrypto: number, depositAddress: string, zkCommitment: string, expiresAt: Date, exchangeId?: string): Promise<{ id: number }> {
    throw new Error("Gift Card Orders not supported in MemStorage - use DBStorage");
  }

  async getGiftCardOrder(orderId: string): Promise<any | undefined> {
    throw new Error("Gift Card Orders not supported in MemStorage - use DBStorage");
  }

  async getGiftCardOrderByExchangeId(exchangeId: string): Promise<any | undefined> {
    throw new Error("Gift Card Orders not supported in MemStorage - use DBStorage");
  }

  async getGiftCardOrdersByCommitment(zkCommitment: string): Promise<any[]> {
    throw new Error("Gift Card Orders not supported in MemStorage - use DBStorage");
  }

  async getAllGiftCardOrders(): Promise<any[]> {
    throw new Error("Gift Card Orders not supported in MemStorage - use DBStorage");
  }

  async updateGiftCardOrderPayment(orderId: string, paymentStatus: string, txHash?: string, zkProof?: string): Promise<void> {
    throw new Error("Gift Card Orders not supported in MemStorage - use DBStorage");
  }

  async updateGiftCardOrderStatus(orderId: string, paymentStatus: string | null, updates: any): Promise<void> {
    throw new Error("Gift Card Orders not supported in MemStorage - use DBStorage");
  }

  async updateGiftCardReloadly(orderId: string, transactionId: number, productId: number): Promise<void> {
    throw new Error("Gift Card Orders not supported in MemStorage - use DBStorage");
  }

  async updateGiftCardDelivery(orderId: string, cardNumber: string, cardPin: string, redeemInstructions: string | null): Promise<void> {
    throw new Error("Gift Card Orders not supported in MemStorage - use DBStorage");
  }

  async getPaidUndeliveredGiftCardOrders(): Promise<any[]> {
    throw new Error("Gift Card Orders not supported in MemStorage - use DBStorage");
  }

  async getPaidUndeliveredOrders(): Promise<any[]> {
    throw new Error("Domain Orders not supported in MemStorage - use DBStorage");
  }

  async getLoyalHolders(): Promise<Array<{ address: string; balance: number; holdDurationHours: number; firstBuyTime: Date; updatedAt: Date }>> {
    throw new Error("Loyal Holders not supported in MemStorage - use DBStorage");
  }

  async upsertLoyalHolder(address: string, balance: number, holdDurationHours: number, firstBuyTime: Date, lastCheckTime: Date): Promise<void> {
    throw new Error("Loyal Holders not supported in MemStorage - use DBStorage");
  }

  async getAllX402Services(): Promise<any[]> {
    throw new Error("x402 Services not supported in MemStorage - use DBStorage");
  }

  async getX402Service(id: number): Promise<any | undefined> {
    throw new Error("x402 Services not supported in MemStorage - use DBStorage");
  }

}

// Database-backed storage implementation
export class DBStorage implements IStorage {
  private deposits: Map<string, Deposit>;
  private withdrawnCommitments: Set<string>;
  private usedNullifiers: Set<string>;
  private proofRecords: Map<string, ProofRecord>;
  private swapCreations: Map<string, SwapCreationRecord>;

  constructor() {
    this.deposits = new Map();
    this.withdrawnCommitments = new Set();
    this.usedNullifiers = new Set();
    this.proofRecords = new Map();
    this.swapCreations = new Map();
  }

  async addDeposit(commitment: string, amount: number, signature: string): Promise<Deposit> {
    const deposit: Deposit = {
      id: randomUUID(),
      commitment,
      amount,
      signature,
      timestamp: Date.now()
    };
    this.deposits.set(commitment, deposit);
    return deposit;
  }

  async getDeposit(commitment: string): Promise<Deposit | undefined> {
    return this.deposits.get(commitment);
  }

  async getAllDeposits(): Promise<Deposit[]> {
    return Array.from(this.deposits.values());
  }

  async markWithdrawn(commitment: string): Promise<void> {
    this.withdrawnCommitments.add(commitment);
  }

  async isNullifierUsed(nullifier: string): Promise<boolean> {
    return this.usedNullifiers.has(nullifier);
  }

  async markNullifierUsed(nullifier: string): Promise<void> {
    this.usedNullifiers.add(nullifier);
  }

  async storeProofRecord(record: ProofRecord): Promise<void> {
    this.proofRecords.set(record.orderId, record);
    // Track unique wallet and increment proof count in database
    await this.trackUniqueWallet(record.zkId);
    await this.incrementProofCount();
  }

  async getProofRecord(orderId: string): Promise<ProofRecord | undefined> {
    return this.proofRecords.get(orderId);
  }

  async trackSwapCreation(orderId: string, fromChain: string, toChain: string): Promise<void> {
    this.swapCreations.set(orderId, {
      orderId,
      fromChain,
      toChain,
      timestamp: Date.now()
    });
  }

  async getProtocolStats(): Promise<ProtocolStats> {
    // Fetch from database
    const stats = await db.select().from(protocolStats).limit(1);
    
    if (stats.length === 0) {
      return {
        totalSwaps: 0,
        proofsVerified: 0,
        activeWallets: 0,
        crossChainBridges: 0,
        totalVolumeUSD: 0
      };
    }

    const dbStats = stats[0];
    const swapCreations = Array.from(this.swapCreations.values());
    const crossChainCount = swapCreations.filter(s => s.fromChain !== s.toChain).length;
    
    return {
      totalSwaps: dbStats.swapCount,
      proofsVerified: dbStats.proofCount,
      activeWallets: dbStats.activeWallets,
      crossChainBridges: crossChainCount,
      totalVolumeUSD: dbStats.totalVolumeUSD
    };
  }

  async updateSwapVolume(amountUSD: number): Promise<void> {
    // Get existing stats or create if not exists
    const existing = await db.select().from(protocolStats).limit(1);
    
    if (existing.length === 0) {
      await db.insert(protocolStats).values({
        totalVolumeUSD: amountUSD,
        swapCount: 1,
        proofCount: 0,
        activeWallets: 0,
        lastUpdated: new Date()
      });
    } else {
      await db.update(protocolStats)
        .set({
          totalVolumeUSD: sql`${protocolStats.totalVolumeUSD} + ${amountUSD}`,
          swapCount: sql`${protocolStats.swapCount} + 1`,
          lastUpdated: new Date()
        })
        .where(eq(protocolStats.id, existing[0].id));
    }
  }

  async incrementProofCount(): Promise<void> {
    const existing = await db.select().from(protocolStats).limit(1);
    
    if (existing.length === 0) {
      await db.insert(protocolStats).values({
        totalVolumeUSD: 0,
        swapCount: 0,
        proofCount: 1,
        activeWallets: 0,
        lastUpdated: new Date()
      });
    } else {
      await db.update(protocolStats)
        .set({
          proofCount: sql`${protocolStats.proofCount} + 1`,
          lastUpdated: new Date()
        })
        .where(eq(protocolStats.id, existing[0].id));
    }
  }

  async initializeStats(): Promise<void> {
    const existing = await db.select().from(protocolStats).limit(1);
    
    if (existing.length === 0) {
      await db.insert(protocolStats).values({
        totalVolumeUSD: 0,
        swapCount: 0,
        proofCount: 0,
        activeWallets: 0,
        lastUpdated: new Date()
      });
      console.log("✅ Database stats initialized");
    }

    const existingRevenue = await db.select().from(dailyRevenue).limit(1);
    
    if (existingRevenue.length === 0) {
      await db.insert(dailyRevenue).values({
        todayTotalRevenue: 0,
        todayCreatorRewards: 0,
        yesterdayTotalRevenue: 0,
        yesterdayCreatorRewards: 0,
        cumulativeTotalRevenue: 0,
        cumulativeCreatorRewards: 0,
        lastResetTime: new Date(),
        lastUpdated: new Date()
      });
    }
  }

  async getDailyRevenue(): Promise<DailyRevenueData> {
    const revenue = await db.select().from(dailyRevenue).limit(1);
    
    if (revenue.length === 0) {
      return {
        todayTotalRevenue: 0,
        todayCreatorRewards: 0,
        yesterdayTotalRevenue: 0,
        yesterdayCreatorRewards: 0,
        cumulativeTotalRevenue: 0,
        cumulativeCreatorRewards: 0,
        cumulativeDistributedUSD: 1426.48,
        totalZKSwapVolumeUSD: 5120,
        lockedDexVolumeBaseline: 86000,
        lockedZKVolumeBaseline: 5120,
        lastDexVolume24h: 0,
        accumulatedDexIncrement: 0,
        lastObservedDexscreenerRevenue: 0,
        lastResetTime: Date.now()
      };
    }

    const data = revenue[0];
    return {
      todayTotalRevenue: data.todayTotalRevenue,
      todayCreatorRewards: data.todayCreatorRewards,
      yesterdayTotalRevenue: data.yesterdayTotalRevenue,
      yesterdayCreatorRewards: data.yesterdayCreatorRewards,
      cumulativeTotalRevenue: data.cumulativeTotalRevenue,
      cumulativeCreatorRewards: data.cumulativeCreatorRewards,
      cumulativeDistributedUSD: data.cumulativeDistributedUSD,
      totalZKSwapVolumeUSD: data.totalZKSwapVolumeUSD,
      lockedDexVolumeBaseline: data.lockedDexVolumeBaseline,
      lockedZKVolumeBaseline: data.lockedZKVolumeBaseline,
      lastDexVolume24h: data.lastDexVolume24h,
      accumulatedDexIncrement: data.accumulatedDexIncrement,
      lastProcessedSignature: data.lastProcessedSignature || undefined,
      lastProcessedTimestamp: data.lastProcessedTimestamp ? data.lastProcessedTimestamp.getTime() : undefined,
      lastObservedDexscreenerRevenue: data.lastObservedDexscreenerRevenue,
      lastResetTime: data.lastResetTime.getTime(),
      nextClaimTime: data.nextClaimTime ? data.nextClaimTime.getTime() : undefined
    };
  }

  async updateDailyRevenue(totalRevenue: number, actualDistributed: number = 0): Promise<void> {
    const existing = await db.select().from(dailyRevenue).limit(1);
    
    if (existing.length === 0) {
      await db.insert(dailyRevenue).values({
        todayTotalRevenue: totalRevenue,
        todayCreatorRewards: 0,
        yesterdayTotalRevenue: 0,
        yesterdayCreatorRewards: 0,
        cumulativeTotalRevenue: 0,
        cumulativeCreatorRewards: actualDistributed,
        lastKnownDistributed: actualDistributed,
        lastObservedDexscreenerRevenue: totalRevenue,
        lastResetTime: new Date(),
        lastUpdated: new Date()
      });
    } else {
      const incrementalRevenue = Math.max(0, totalRevenue - existing[0].lastObservedDexscreenerRevenue);
      
      await db.update(dailyRevenue)
        .set({
          todayTotalRevenue: existing[0].todayTotalRevenue + incrementalRevenue,
          todayCreatorRewards: 0,
          cumulativeCreatorRewards: actualDistributed,
          lastKnownDistributed: actualDistributed,
          lastObservedDexscreenerRevenue: totalRevenue,
          lastUpdated: new Date()
        })
        .where(eq(dailyRevenue.id, existing[0].id));
    }
  }

  async resetAfterDistribution(): Promise<void> {
    const existing = await db.select().from(dailyRevenue).limit(1);
    
    if (existing.length === 0) {
      return;
    }

    const data = existing[0];
    const distributedAmount = data.todayTotalRevenue;
    const newClaimTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    await db.update(dailyRevenue)
      .set({
        yesterdayTotalRevenue: data.todayTotalRevenue,
        yesterdayCreatorRewards: data.todayCreatorRewards,
        todayTotalRevenue: 0,
        todayCreatorRewards: 0,
        cumulativeTotalRevenue: data.cumulativeTotalRevenue + distributedAmount,
        cumulativeCreatorRewards: data.cumulativeCreatorRewards,
        nextClaimTime: newClaimTime,
        lastResetTime: new Date(),
        lastUpdated: new Date()
      })
      .where(eq(dailyRevenue.id, data.id));
    
    console.log(`💰 Distribution completed - Distributed: $${distributedAmount.toFixed(2)}, Total distributed all-time: $${(data.cumulativeTotalRevenue + distributedAmount).toFixed(2)}, Next claim: ${newClaimTime.toISOString()}`);
  }

  async executeDistribution(distributedAmount: number): Promise<void> {
    const existing = await db.select().from(dailyRevenue).limit(1);
    
    if (existing.length === 0) {
      return;
    }

    const data = existing[0];
    const newClaimTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    await db.update(dailyRevenue)
      .set({
        yesterdayTotalRevenue: data.todayTotalRevenue,
        yesterdayCreatorRewards: data.todayCreatorRewards,
        todayTotalRevenue: 0,
        todayCreatorRewards: 0,
        totalZKSwapVolumeUSD: 0,
        accumulatedDexIncrement: 0,
        cumulativeTotalRevenue: data.cumulativeTotalRevenue + distributedAmount,
        cumulativeCreatorRewards: data.cumulativeCreatorRewards,
        cumulativeDistributedUSD: data.cumulativeDistributedUSD + distributedAmount,
        nextClaimTime: newClaimTime,
        lastResetTime: new Date(),
        lastUpdated: new Date()
      })
      .where(eq(dailyRevenue.id, data.id));
    
    console.log(`💰 Distribution executed - Amount: $${distributedAmount.toFixed(2)}, Total all-time distributed: $${(data.cumulativeDistributedUSD + distributedAmount).toFixed(2)}, Pool reset, Next claim: ${newClaimTime.toISOString()}`);
  }

  async incrementZKSwapVolume(amountUSD: number): Promise<void> {
    const existing = await db.select().from(dailyRevenue).limit(1);
    
    if (existing.length === 0) {
      await db.insert(dailyRevenue).values({
        todayTotalRevenue: 0,
        todayCreatorRewards: 0,
        yesterdayTotalRevenue: 0,
        yesterdayCreatorRewards: 0,
        cumulativeTotalRevenue: 0,
        cumulativeCreatorRewards: 0,
        cumulativeDistributedUSD: 1426.48,
        totalZKSwapVolumeUSD: amountUSD,
        lastResetTime: new Date(),
        lastUpdated: new Date()
      });
    } else {
      await db.update(dailyRevenue)
        .set({
          totalZKSwapVolumeUSD: sql`${dailyRevenue.totalZKSwapVolumeUSD} + ${amountUSD}`,
          lastUpdated: new Date()
        })
        .where(eq(dailyRevenue.id, existing[0].id));
    }
  }

  async updateDexVolumeSnapshot(currentVol24h: number, deltaToAdd: number): Promise<void> {
    const existing = await db.select().from(dailyRevenue).limit(1);
    
    if (existing.length > 0) {
      await db.update(dailyRevenue)
        .set({
          lastDexVolume24h: currentVol24h,
          accumulatedDexIncrement: sql`${dailyRevenue.accumulatedDexIncrement} + ${deltaToAdd}`,
          lastUpdated: new Date()
        })
        .where(eq(dailyRevenue.id, existing[0].id));
    }
  }

  async addTransactionVolume(signature: string, timestamp: number, volumeUSD: number): Promise<void> {
    const existing = await db.select().from(dailyRevenue).limit(1);
    
    if (existing.length > 0) {
      await db.update(dailyRevenue)
        .set({
          lastProcessedSignature: signature,
          lastProcessedTimestamp: new Date(timestamp),
          accumulatedDexIncrement: sql`${dailyRevenue.accumulatedDexIncrement} + ${volumeUSD}`,
          lastUpdated: new Date()
        })
        .where(eq(dailyRevenue.id, existing[0].id));
      
      console.log(`📈 Added transaction volume: +$${volumeUSD.toFixed(2)} (sig: ${signature.slice(0, 8)}...)`);
    }
  }

  async trackUniqueWallet(zkId: string): Promise<void> {
    try {
      // Try to insert the zkId - will fail silently if already exists due to UNIQUE constraint
      await db.insert(uniqueWallets).values({
        zkId,
        firstSeenAt: new Date()
      }).onConflictDoNothing();
      
      // Count total unique wallets and update protocol stats
      const walletCountResult = await db.select({ count: count() }).from(uniqueWallets);
      const totalUniqueWallets = walletCountResult[0]?.count || 0;
      
      // Update activeWallets count in protocol stats
      const existing = await db.select().from(protocolStats).limit(1);
      
      if (existing.length === 0) {
        await db.insert(protocolStats).values({
          totalVolumeUSD: 0,
          swapCount: 0,
          proofCount: 0,
          activeWallets: Number(totalUniqueWallets),
          lastUpdated: new Date()
        });
      } else {
        await db.update(protocolStats)
          .set({
            activeWallets: Number(totalUniqueWallets),
            lastUpdated: new Date()
          })
          .where(eq(protocolStats.id, existing[0].id));
      }
    } catch (error) {
      console.error("Error tracking unique wallet:", error);
    }
  }

  // Developer API Management
  async createDeveloper(username: string, email: string, passwordHash: string): Promise<{ id: number }> {
    const result = await db.insert(developers).values({
      username,
      email,
      passwordHash
    }).returning({ id: developers.id });
    
    return result[0];
  }

  async getDeveloperByUsername(username: string): Promise<{ id: number; username: string; email: string; passwordHash: string; createdAt: Date } | undefined> {
    const result = await db.select().from(developers).where(eq(developers.username, username)).limit(1);
    return result[0];
  }

  async getDeveloperByEmail(email: string): Promise<{ id: number; username: string; email: string; passwordHash: string; createdAt: Date } | undefined> {
    const result = await db.select().from(developers).where(eq(developers.email, email)).limit(1);
    return result[0];
  }

  // API Key Management
  async createApiKey(developerId: number, name: string, keyHash: string): Promise<{ id: number; key: string }> {
    const result = await db.insert(apiKeys).values({
      developerId,
      name,
      keyHash,
      isActive: 1,
      usageCount: 0
    }).returning({ id: apiKeys.id });
    
    return { id: result[0].id, key: keyHash };
  }

  async getApiKeysByDeveloper(developerId: number): Promise<Array<{ id: number; name: string; isActive: number; usageCount: number; lastUsedAt: Date | null; createdAt: Date }>> {
    return await db.select({
      id: apiKeys.id,
      name: apiKeys.name,
      isActive: apiKeys.isActive,
      usageCount: apiKeys.usageCount,
      lastUsedAt: apiKeys.lastUsedAt,
      createdAt: apiKeys.createdAt
    }).from(apiKeys).where(eq(apiKeys.developerId, developerId));
  }

  async validateApiKey(keyHash: string): Promise<{ valid: boolean; developerId?: number; keyId?: number }> {
    const result = await db.select({
      id: apiKeys.id,
      developerId: apiKeys.developerId,
      isActive: apiKeys.isActive
    }).from(apiKeys).where(eq(apiKeys.keyHash, keyHash)).limit(1);
    
    if (result.length === 0 || result[0].isActive === 0) {
      return { valid: false };
    }
    
    return { 
      valid: true, 
      developerId: result[0].developerId,
      keyId: result[0].id
    };
  }

  async getApiKeyByHash(keyHash: string): Promise<{ id: number; developerId: number; isActive: number } | undefined> {
    const result = await db.select({
      id: apiKeys.id,
      developerId: apiKeys.developerId,
      isActive: apiKeys.isActive
    }).from(apiKeys).where(eq(apiKeys.keyHash, keyHash)).limit(1);
    
    return result.length > 0 ? result[0] : undefined;
  }

  async incrementApiKeyUsage(keyId: number): Promise<void> {
    await db.update(apiKeys)
      .set({
        usageCount: sql`${apiKeys.usageCount} + 1`,
        lastUsedAt: new Date()
      })
      .where(eq(apiKeys.id, keyId));
  }

  async trackApiKeyUsage(keyId: number): Promise<void> {
    await this.incrementApiKeyUsage(keyId);
  }

  async deactivateApiKey(keyId: number): Promise<void> {
    await db.update(apiKeys)
      .set({
        isActive: 0
      })
      .where(eq(apiKeys.id, keyId));
  }

  async createPaymentRequest(developerId: number, apiKeyId: number, domainName: string, currency: string, amount: number, amountUSD: number, depositAddress: string): Promise<{ id: number }> {
    const result = await db.insert(paymentRequests).values({
      developerId,
      apiKeyId,
      domainName,
      currency,
      amount,
      amountUSD,
      depositAddress,
      status: 'pending'
    }).returning({ id: paymentRequests.id });
    
    return result[0];
  }

  async getPaymentRequest(id: number): Promise<{ id: number; developerId: number; apiKeyId: number; domainName: string; currency: string; amount: number; amountUSD: number; depositAddress: string; status: string; zkProof: string | null; completedAt: Date | null; createdAt: Date } | undefined> {
    const result = await db.select().from(paymentRequests).where(eq(paymentRequests.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async updatePaymentStatus(id: number, status: string, zkProof?: string): Promise<void> {
    const updateData: any = { status };
    if (status === 'completed') {
      updateData.completedAt = new Date();
    }
    if (zkProof) {
      updateData.zkProof = zkProof;
    }
    
    await db.update(paymentRequests)
      .set(updateData)
      .where(eq(paymentRequests.id, id));
  }

  async createDomainOrder(orderId: string, domainName: string, tld: string, priceUSD: number, currency: string, amountCrypto: number, depositAddress: string, customerEmail: string | null, zkCommitment: string, domainSecret: string, expiresAt: Date, exchangeId?: string): Promise<{ id: number }> {
    const result = await db.insert(domainOrders).values({
      orderId,
      domainName,
      tld,
      priceUSD,
      currency,
      amountCrypto,
      depositAddress,
      exchangeId,
      customerEmail,
      zkCommitment,
      domainSecret,
      expiresAt,
      paymentStatus: 'pending',
      orderStatus: 'awaiting_payment'
    }).returning({ id: domainOrders.id });
    
    return result[0];
  }

  async getDomainOrder(orderId: string): Promise<any | undefined> {
    const result = await db.select().from(domainOrders).where(eq(domainOrders.orderId, orderId)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async getDomainOrderByExchangeId(exchangeId: string): Promise<any | undefined> {
    const result = await db.select().from(domainOrders).where(eq(domainOrders.exchangeId, exchangeId)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async getDomainOrderByDomain(domain: string): Promise<any | undefined> {
    // Parse domain to get name and TLD
    const parts = domain.split('.');
    if (parts.length < 2) return undefined;
    
    const tld = '.' + parts[parts.length - 1];
    const name = parts.slice(0, -1).join('.');
    
    const result = await db.select().from(domainOrders)
      .where(and(
        eq(domainOrders.domainName, name),
        eq(domainOrders.tld, tld)
      ))
      .limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async getDomainOrderByCommitment(zkCommitment: string): Promise<any[]> {
    const result = await db.select().from(domainOrders)
      .where(and(
        eq(domainOrders.zkCommitment, zkCommitment),
        or(
          eq(domainOrders.orderStatus, 'delivered'),
          eq(domainOrders.paymentStatus, 'paid'),
          isNotNull(domainOrders.njallaTaskId)
        )
      ));
    return result;
  }

  async updateDomainOrderPayment(orderId: string, paymentStatus: string, txHash?: string, zkProof?: string): Promise<void> {
    const updateData: any = { paymentStatus };
    
    if (paymentStatus === 'paid') {
      updateData.paidAt = new Date();
      updateData.orderStatus = 'processing';
    }
    if (txHash) {
      updateData.txHash = txHash;
    }
    if (zkProof) {
      updateData.zkProof = zkProof;
    }
    
    await db.update(domainOrders)
      .set(updateData)
      .where(eq(domainOrders.orderId, orderId));
  }

  async updateDomainOrderStatus(orderId: string, paymentStatus: string | null, updates: any): Promise<void> {
    const updateData: any = { ...updates };
    
    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }
    
    await db.update(domainOrders)
      .set(updateData)
      .where(eq(domainOrders.orderId, orderId));
  }

  async getPaidUndeliveredOrders(): Promise<any[]> {
    const orders = await db.select()
      .from(domainOrders)
      .where(
        sql`${domainOrders.paymentStatus} = 'paid' AND ${domainOrders.deliveredAt} IS NULL`
      );
    
    return orders;
  }

  async getPendingDomainOrders(): Promise<any[]> {
    const orders = await db.select()
      .from(domainOrders)
      .where(
        sql`${domainOrders.paymentStatus} = 'pending' AND ${domainOrders.exchangeId} IS NOT NULL`
      );
    
    return orders;
  }

  async createGiftCardOrder(orderId: string, giftCardType: string, denomination: number, priceUSD: number, currency: string, amountCrypto: number, depositAddress: string, zkCommitment: string, expiresAt: Date, exchangeId?: string): Promise<{ id: number }> {
    const result = await db.insert(giftCardOrders).values({
      orderId,
      giftCardType,
      denomination,
      priceUSD,
      currency,
      amountCrypto,
      depositAddress,
      exchangeId: exchangeId || null,
      zkCommitment,
      expiresAt,
    }).returning({ id: giftCardOrders.id });
    
    return result[0];
  }

  async getGiftCardOrder(orderId: string): Promise<any | undefined> {
    const result = await db.select().from(giftCardOrders).where(eq(giftCardOrders.orderId, orderId)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async getGiftCardOrderByExchangeId(exchangeId: string): Promise<any | undefined> {
    const result = await db.select().from(giftCardOrders).where(eq(giftCardOrders.exchangeId, exchangeId)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async getGiftCardOrdersByCommitment(zkCommitment: string): Promise<any[]> {
    const result = await db.select().from(giftCardOrders)
      .where(and(
        eq(giftCardOrders.zkCommitment, zkCommitment),
        or(
          eq(giftCardOrders.orderStatus, 'delivered'),
          eq(giftCardOrders.orderStatus, 'completed')
        )
      ));
    return result;
  }

  async getAllGiftCardOrders(): Promise<any[]> {
    const result = await db.select().from(giftCardOrders);
    return result;
  }

  async updateGiftCardOrderPayment(orderId: string, paymentStatus: string, txHash?: string, zkProof?: string): Promise<void> {
    const updateData: any = {
      paymentStatus,
      orderStatus: paymentStatus === 'paid' ? 'processing' : 'awaiting_payment',
    };

    if (txHash) updateData.txHash = txHash;
    if (zkProof) updateData.zkProof = zkProof;
    if (paymentStatus === 'paid') updateData.paidAt = new Date();

    await db.update(giftCardOrders)
      .set(updateData)
      .where(eq(giftCardOrders.orderId, orderId));
  }

  async updateGiftCardOrderStatus(orderId: string, paymentStatus: string | null, updates: any): Promise<void> {
    const updateData: any = { ...updates };
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    await db.update(giftCardOrders)
      .set(updateData)
      .where(eq(giftCardOrders.orderId, orderId));
  }

  async updateGiftCardReloadly(orderId: string, transactionId: number, productId: number): Promise<void> {
    await db.update(giftCardOrders)
      .set({
        reloadlyTransactionId: transactionId,
        reloadlyProductId: productId,
        orderStatus: 'processing'
      })
      .where(eq(giftCardOrders.orderId, orderId));
  }

  async updateGiftCardDelivery(orderId: string, cardNumber: string, cardPin: string, redeemInstructions: string | null): Promise<void> {
    await db.update(giftCardOrders)
      .set({
        cardNumber,
        cardPin,
        redeemInstructions,
        orderStatus: 'delivered',
        deliveredAt: new Date()
      })
      .where(eq(giftCardOrders.orderId, orderId));
  }

  async getPaidUndeliveredGiftCardOrders(): Promise<any[]> {
    const orders = await db.select()
      .from(giftCardOrders)
      .where(
        and(
          eq(giftCardOrders.paymentStatus, 'paid'),
          or(
            eq(giftCardOrders.orderStatus, 'processing'),
            eq(giftCardOrders.orderStatus, 'paid')
          )
        )
      );
    
    return orders;
  }

  async getLoyalHolders(): Promise<Array<{ address: string; balance: number; holdDurationHours: number; firstBuyTime: Date; updatedAt: Date }>> {
    const result = await db.select({
      address: loyalHolders.address,
      balance: loyalHolders.balance,
      holdDurationHours: loyalHolders.holdDurationHours,
      firstBuyTime: loyalHolders.firstBuyTime,
      updatedAt: loyalHolders.updatedAt
    })
    .from(loyalHolders)
    .where(sql`${loyalHolders.holdDurationHours} >= 125`)
    .orderBy(sql`${loyalHolders.holdDurationHours} DESC`);
    
    return result;
  }

  async upsertLoyalHolder(address: string, balance: number, holdDurationHours: number, firstBuyTime: Date, lastCheckTime: Date): Promise<void> {
    const existing = await db.select()
      .from(loyalHolders)
      .where(eq(loyalHolders.address, address))
      .limit(1);
    
    if (existing.length > 0) {
      await db.update(loyalHolders)
        .set({
          balance,
          holdDurationHours,
          lastCheckTime,
          updatedAt: new Date()
        })
        .where(eq(loyalHolders.address, address));
    } else {
      await db.insert(loyalHolders).values({
        address,
        balance,
        holdDurationHours,
        firstBuyTime,
        lastCheckTime
      });
    }
  }

  async getAllX402Services(): Promise<any[]> {
    const services = await db.select().from(x402Services).where(eq(x402Services.isActive, true));
    return services;
  }

  async getX402Service(id: number): Promise<any | undefined> {
    const service = await db.select().from(x402Services).where(eq(x402Services.id, id)).limit(1);
    return service[0];
  }

}

export const storage = new DBStorage();
