import type { Express } from "express";
import { createServer, type Server } from "http";
import { createHmac } from "crypto";
import { 
  Connection, 
  Keypair, 
  PublicKey,
  SystemProgram, 
  TransactionMessage, 
  VersionedTransaction,
  LAMPORTS_PER_SOL
} from "@solana/web3.js";
import { verifyProof } from "@semaphore-protocol/proof";
import { Group } from "@semaphore-protocol/core";
import { Identity } from "@semaphore-protocol/identity";
import bs58 from "bs58";
import { getAddress } from "ethers";
import { 
  initializeVaultClient, 
  getVaultBalance, 
  buildInitializeVaultInstruction,
  buildWithdrawInstruction,
  buildRegisterMerkleRootInstruction,
  type VaultClient 
} from "./vault";
import { storage } from "./storage";
import deployRouter from "./deploy";
import { SimpleSwapClient } from "./simpleswap";
import { db } from "./db";
import { protocolStats, dailyRevenue } from "@shared/schema";
import { priceOracle } from "./priceOracle";
import { PumpFunService } from "./pumpfun";
import { RevshareService } from "./revshare";
import { HolderService } from "./holders";
import { walletService } from "./wallet";
import { hashPassword, verifyPassword, generateJWT, verifyJWT, generateApiKey, hashApiKey, validateApiKey, type AuthenticatedRequest } from "./auth";
import { njallaService } from "./njalla-client";
import { getReloadlyClient } from "./reloadly-client";
import { twitterOAuthService } from "./twitter-oauth";
import { zkSessionService } from "./zk-session";
import { zkTwitterUsers, zkTwitterActions, bugReports, x402Purchases } from "@shared/schema";
import { desc, eq, and, gte, sql } from "drizzle-orm";
import { X402Client } from "./x402-client";

function loadKeypair(): Keypair {
  const b58 = process.env.SOLANA_PRIVATE_KEY_B58;
  if (!b58) {
    throw new Error("Missing SOLANA_PRIVATE_KEY_B58 in environment variables");
  }
  return Keypair.fromSecretKey(bs58.decode(b58));
}

// Generate mock card details for demo mode
function generateMockCardDetails(giftCardType: string, denomination: number) {
  const mockCardNumber = `MOCK-${Math.random().toString(36).substring(2, 15).toUpperCase()}`;
  const mockPin = `${Math.floor(1000 + Math.random() * 9000)}`;
  
  const redeemInstructions: Record<string, string> = {
    'amazon_us': 'Go to Amazon.com, sign in, click "Account & Lists", select "Gift cards", click "Redeem a gift card", enter code',
    'amazon_uk': 'Go to Amazon.co.uk, sign in, click "Account & Lists", select "Gift cards", click "Redeem a gift card", enter code',
    'google_play_us': 'Open Google Play Store app, tap Menu icon, select "Redeem", enter code',
    'google_play_uk': 'Open Google Play Store app, tap Menu icon, select "Redeem", enter code',
  };
  
  const defaultInstructions = 'This is a demo gift card. In production, real redemption instructions will be provided.';
  
  return {
    cardNumber: mockCardNumber,
    cardPin: mockPin,
    redeemInstructions: redeemInstructions[giftCardType] || defaultInstructions
  };
}

const GROUP_ID = 42n;
let vaultClient: VaultClient;
let semaphoreGroup: Group;
let simpleSwapClient: SimpleSwapClient | null = null;
export const pumpFunService = new PumpFunService();
let revshareService: RevshareService;
let holderService: HolderService;

export async function registerRoutes(app: Express, swapClient: SimpleSwapClient | null = null): Promise<Server> {
  
  const rpcUrl = process.env.HELIUS_RPC_URL || "https://api.mainnet-beta.solana.com";
  
  vaultClient = await initializeVaultClient(rpcUrl);
  semaphoreGroup = new Group();
  revshareService = new RevshareService(rpcUrl);
  holderService = new HolderService();

  // Load existing gift card commitments into Semaphore group on startup
  // This ensures users can still access their gift cards after server restarts
  try {
    const allGiftCardOrders = await storage.getAllGiftCardOrders();
    const commitments = new Set<string>(); // Use Set to avoid duplicates
    
    for (const order of allGiftCardOrders) {
      if (order.zkCommitment) {
        commitments.add(order.zkCommitment);
      }
    }
    
    // Add unique commitments to Semaphore group
    for (const commitment of commitments) {
      try {
        semaphoreGroup.addMember(BigInt(commitment));
      } catch (error) {
        console.error(`⚠️ [GIFT-CARD-INIT] Failed to add commitment ${commitment}:`, error);
      }
    }
    
    console.log(`✅ [GIFT-CARD-INIT] Loaded ${commitments.size} gift card commitment(s) into Semaphore group`);
  } catch (error) {
    console.error(`❌ [GIFT-CARD-INIT] Failed to load gift card commitments:`, error);
  }
  
  // Use provided swap client
  simpleSwapClient = swapClient;

  // Initialize database stats
  await storage.initializeStats();
  console.log("✅ Database stats initialized");

  // Initialize PumpFun scraper
  await pumpFunService.initialize();

  // Initialize Twitter OAuth and ZK Session services
  await twitterOAuthService.initialize();
  await zkSessionService.initialize();

  app.get("/api/health", async (req, res) => {
    const balanceLamports = await vaultClient.connection.getBalance(vaultClient.vaultPda);
    const balance = balanceLamports / LAMPORTS_PER_SOL;
    
    res.json({ 
      ok: true, 
      vaultAddress: vaultClient.vaultPda.toBase58(),
      vaultBalance: balance,
      groupId: GROUP_ID.toString(),
      groupSize: semaphoreGroup.members.length,
      programId: vaultClient.programId.toBase58()
    });
  });

  app.get("/api/stats/protocol", async (req, res) => {
    try {
      const stats = await storage.getProtocolStats();
      
      // Fetch total volume from database
      const dbStats = await db.select().from(protocolStats).limit(1);
      const volumeUSD = dbStats.length > 0 ? dbStats[0].totalVolumeUSD : 0;
      
      res.json({ 
        ok: true, 
        stats: {
          ...stats,
          totalVolumeUSD: volumeUSD
        }
      });
    } catch (error: any) {
      console.error("Get protocol stats error:", error);
      res.status(500).json({ ok: false, error: error.message });
    }
  });

  app.get("/api/stats/pumpfun", async (req, res) => {
    try {
      // Get revenue data from database
      const revenueData = await storage.getDailyRevenue();
      
      // NEW SYSTEM: Transaction-based tracking using Helius RPC
      // Fetch all new transactions since last processed signature
      let lastSignature = revenueData.lastProcessedSignature;
      let result = await walletService.getRecentTokenTransactions(lastSignature, 100);
      
      // Check if signature was found in RPC history
      if (lastSignature && !result.signatureFound) {
        console.warn(`⚠️ CRITICAL: Last processed signature not found in RPC history! Resetting and reprocessing from scratch to avoid gaps.`);
        lastSignature = undefined;
        result = await walletService.getRecentTokenTransactions(undefined, 100);
      }
      
      // Process new transactions in reverse order (oldest to newest)
      // This ensures lastProcessedSignature is set to the NEWEST transaction
      if (result.transactions.length > 0) {
        console.log(`🔍 Found ${result.transactions.length} new transactions since last check`);
        
        const reversedTxs = [...result.transactions].reverse();
        for (const tx of reversedTxs) {
          await storage.addTransactionVolume(tx.signature, tx.timestamp, tx.volumeUSD);
        }
      }
      
      // Get updated accumulated value
      const updatedRevenueData = await storage.getDailyRevenue();
      const totalAccumulated = updatedRevenueData.accumulatedDexIncrement || 0;
      
      // DEX Trading Volume = Locked baseline ($86k) + accumulated increments
      const lockedDexBaseline = revenueData.lockedDexVolumeBaseline || 86000;
      const totalDexVolumeUSD = lockedDexBaseline + totalAccumulated;
      
      // ZK Swap Volume = Locked baseline ($5.12k) + platform swap increments
      const lockedZKBaseline = revenueData.lockedZKVolumeBaseline || 5120;
      const zkSwapIncrement = revenueData.totalZKSwapVolumeUSD || 0;
      const totalZKSwapVolumeUSD = lockedZKBaseline + zkSwapIncrement;
      
      // Calculate revenues as percentages of total volumes
      const dexRevenueUSD = totalDexVolumeUSD * 0.002; // 0.2% of DEX volume
      const zkSwapRevenueUSD = totalZKSwapVolumeUSD * 0.004; // 0.4% of ZK volume
      
      // Current Pool = DEX revenue + ZK revenue
      const currentPoolUSD = dexRevenueUSD + zkSwapRevenueUSD;
      
      console.log(`💰 Pool - DEX Vol: $${totalDexVolumeUSD.toFixed(2)} (${lockedDexBaseline.toFixed(0)} + ${totalAccumulated.toFixed(2)}), DEX Rev: $${dexRevenueUSD.toFixed(2)}, ZK Vol: $${totalZKSwapVolumeUSD.toFixed(2)} (${lockedZKBaseline.toFixed(0)} + ${zkSwapIncrement.toFixed(2)}), ZK Rev: $${zkSwapRevenueUSD.toFixed(2)}, Pool: $${currentPoolUSD.toFixed(2)}`);
      
      // Get cumulative distributed from database (permanent, never resets)
      const cumulativeDistributedUSD = revenueData.cumulativeDistributedUSD;

      res.json({ 
        ok: true, 
        stats: {
          currentPoolUSD,
          cumulativeDistributedUSD,
          dexVolumeUSD: totalDexVolumeUSD,     // Total DEX trading volume (baseline + accumulated)
          dexRevenueUSD,                       // DEX trading revenue (0.2%)
          zkSwapVolumeUSD: totalZKSwapVolumeUSD, // Total ZK swap volume (baseline + increments)
          zkSwapRevenueUSD,                    // ZK platform revenue (0.4%)
          lastUpdated: new Date().toISOString()
        }
      });
    } catch (error: any) {
      console.error("Get revenue stats error:", error);
      res.status(500).json({ ok: false, error: error.message });
    }
  });

  app.get("/api/wallet/check/:address", async (req, res) => {
    try {
      const { address } = req.params;

      if (!address || address.length < 32) {
        return res.status(400).json({
          ok: false,
          error: "Invalid wallet address"
        });
      }

      const result = await holderService.checkEligibility(address);

      res.json({
        ok: true,
        eligible: result.eligible,
        balance: result.holdings,
        percentage: result.percentage,
        minRequired: result.minRequired,
        tier: result.tier
      });
    } catch (error: any) {
      console.error("Check wallet error:", error);
      res.json({
        ok: true,
        eligible: false,
        balance: 0,
        percentage: 0,
        reason: "Error checking wallet"
      });
    }
  });

  app.get("/api/revshare/estimate/:address", async (req, res) => {
    try {
      const { address } = req.params;

      if (!address || address.length < 32) {
        return res.status(400).json({
          ok: false,
          error: "Invalid wallet address"
        });
      }

      const eligibility = await holderService.checkEligibility(address);
      
      if (!eligibility.eligible) {
        return res.json({
          ok: true,
          eligible: false,
          holdings: eligibility.holdings,
          percentage: eligibility.percentage,
          minRequired: eligibility.minRequired,
          tier: eligibility.tier,
          estimatedReward: 0,
          poolSize: 0
        });
      }

      const revenueData = await storage.getDailyRevenue();
      const { holders, totalAmount, tierBreakdown } = await holderService.getEligibleHolders();
      
      // Calculate poolSize using the SAME formula as /api/stats/pumpfun
      const totalAccumulated = revenueData.accumulatedDexIncrement || 0;
      const lockedDexBaseline = revenueData.lockedDexVolumeBaseline || 86000;
      const totalDexVolumeUSD = lockedDexBaseline + totalAccumulated;
      
      const lockedZKBaseline = revenueData.lockedZKVolumeBaseline || 5120;
      const zkSwapIncrement = revenueData.totalZKSwapVolumeUSD || 0;
      const totalZKSwapVolumeUSD = lockedZKBaseline + zkSwapIncrement;
      
      const dexRevenueUSD = totalDexVolumeUSD * 0.002; // 0.2% of DEX volume
      const zkSwapRevenueUSD = totalZKSwapVolumeUSD * 0.004; // 0.4% of ZK volume
      const poolSize = dexRevenueUSD + zkSwapRevenueUSD; // Same as currentPoolUSD in /api/stats/pumpfun
      
      console.log(`💎 Revshare Estimate - DEX Vol: $${totalDexVolumeUSD.toFixed(2)}, DEX Rev: $${dexRevenueUSD.toFixed(2)}, ZK Vol: $${totalZKSwapVolumeUSD.toFixed(2)}, ZK Rev: $${zkSwapRevenueUSD.toFixed(2)}, Pool: $${poolSize.toFixed(2)}`);
      
      const userShare = totalAmount > 0 ? (eligibility.holdings / totalAmount) : 0;
      const estimatedReward = poolSize * userShare;

      const nextClaim = await db.select().from(dailyRevenue).limit(1);
      const nextClaimTime = nextClaim.length > 0 && nextClaim[0].nextClaimTime 
        ? nextClaim[0].nextClaimTime.getTime()
        : null;

      res.json({
        ok: true,
        eligible: true,
        holdings: eligibility.holdings,
        percentage: eligibility.percentage,
        tier: eligibility.tier,
        estimatedReward,
        poolSize,
        totalEligibleHolders: holders.length,
        totalEligibleAmount: totalAmount,
        tierBreakdown,
        userShare: userShare * 100,
        nextClaimTime
      });
    } catch (error: any) {
      console.error("Estimate revshare error:", error);
      res.status(500).json({
        ok: false,
        error: "Error calculating revshare estimate"
      });
    }
  });

  app.get("/api/wallet/balance", async (req, res) => {
    try {
      const balance = await walletService.getWalletBalance();
      
      res.json({
        ok: true,
        balance
      });
    } catch (error: any) {
      console.error("Get wallet balance error:", error);
      res.status(500).json({
        ok: false,
        error: "Error fetching wallet balance"
      });
    }
  });

  app.get("/api/admin/eligible-holders", async (req, res) => {
    try {
      const { holders, totalAmount, tierBreakdown } = await holderService.getEligibleHolders();
      
      res.json({
        ok: true,
        holders: holders.map(h => ({
          address: h.address,
          balance: h.amount,
          percentage: h.percentage,
          tier: h.tier.label,
          tierIcon: h.tier.icon
        })),
        totalEligibleAmount: totalAmount,
        eligibleCount: holders.length,
        tierBreakdown
      });
    } catch (error: any) {
      console.error("Get eligible holders error:", error);
      res.status(500).json({
        ok: false,
        error: "Error fetching eligible holders"
      });
    }
  });

  app.post("/api/admin/clear-cache", async (req, res) => {
    try {
      holderService.clearCache();
      console.log("🗑️ Holder cache cleared");
      
      res.json({
        ok: true,
        message: "Cache cleared successfully"
      });
    } catch (error: any) {
      console.error("Error clearing cache:", error);
      res.status(500).json({
        ok: false,
        error: "Error clearing cache"
      });
    }
  });

  app.get("/api/admin/distribution-preview", async (req, res) => {
    try {
      const { holders, totalAmount, tierBreakdown } = await holderService.getEligibleHolders();
      
      // Calculate current pool using SAME formula as /api/stats/pumpfun
      const revenueData = await storage.getDailyRevenue();
      const totalAccumulated = revenueData.accumulatedDexIncrement || 0;
      
      // DEX Trading Volume = Locked baseline ($86k) + accumulated increments
      const lockedDexBaseline = revenueData.lockedDexVolumeBaseline || 86000;
      const totalDexVolumeUSD = lockedDexBaseline + totalAccumulated;
      
      // ZK Swap Volume = Locked baseline ($5.12k) + platform swap increments
      const lockedZKBaseline = revenueData.lockedZKVolumeBaseline || 5120;
      const zkSwapIncrement = revenueData.totalZKSwapVolumeUSD || 0;
      const totalZKSwapVolumeUSD = lockedZKBaseline + zkSwapIncrement;
      
      // Calculate revenues as percentages of total volumes
      const dexRevenueUSD = totalDexVolumeUSD * 0.002; // 0.2% of DEX volume
      const zkSwapRevenueUSD = totalZKSwapVolumeUSD * 0.004; // 0.4% of ZK volume
      
      // Current Pool = DEX revenue + ZK revenue
      const poolSize = dexRevenueUSD + zkSwapRevenueUSD;

      if (poolSize <= 0 || holders.length === 0) {
        return res.json({
          ok: true,
          canDistribute: false,
          poolSize,
          recipientCount: holders.length,
          totalSOL: 0,
          totalUSD: 0,
          walletBalance: 0,
          sufficientBalance: false,
          reason: poolSize <= 0 ? "No new revenue available" : "No eligible holders"
        });
      }

      // Fetch real-time SOL price from CoinGecko
      const solPrice = await priceOracle.getPrice('sol');
      if (!solPrice || solPrice <= 0) {
        return res.status(500).json({
          ok: false,
          error: "Failed to fetch SOL price from CoinGecko"
        });
      }

      let totalLamports = 0;
      let totalUSD = 0;
      let actualRecipientCount = 0;

      // Calculate total lamports needed using same logic as actual distribution
      for (const holder of holders) {
        const share = totalAmount > 0 ? (holder.amount / totalAmount) : 0;
        const rewardUSD = poolSize * share;
        const rewardSOL = rewardUSD / solPrice;
        const lamports = Math.floor(rewardSOL * LAMPORTS_PER_SOL);
        
        // Only count if lamports > 0 (same as actual distribution)
        if (lamports > 0) {
          totalLamports += lamports;
          totalUSD += rewardUSD;
          actualRecipientCount++;
        }
      }

      // Check revshare wallet balance
      const enableOnChainTransfers = !!process.env.REVSHARE_PRIVATE_KEY;
      let walletBalanceLamports = 0;
      let walletAddress = '';
      
      if (enableOnChainTransfers) {
        try {
          const privateKeyEnv = process.env.REVSHARE_PRIVATE_KEY!;
          let revshareKeypair: Keypair;
          
          if (privateKeyEnv.startsWith('[')) {
            const keyArray = JSON.parse(privateKeyEnv);
            revshareKeypair = Keypair.fromSecretKey(new Uint8Array(keyArray));
          } else {
            revshareKeypair = Keypair.fromSecretKey(bs58.decode(privateKeyEnv));
          }
          
          walletAddress = revshareKeypair.publicKey.toBase58();
          walletBalanceLamports = await vaultClient.connection.getBalance(revshareKeypair.publicKey);
        } catch (error) {
          console.error('Failed to load REVSHARE wallet:', error);
        }
      }

      const sufficientBalance = enableOnChainTransfers ? walletBalanceLamports >= totalLamports : true;
      const totalSOL = totalLamports / LAMPORTS_PER_SOL;
      const walletBalance = walletBalanceLamports / LAMPORTS_PER_SOL;

      res.json({
        ok: true,
        canDistribute: sufficientBalance,
        poolSize,
        recipientCount: actualRecipientCount, // Use actual count (excluding 0-lamport recipients)
        totalSOL,
        totalUSD,
        walletBalance,
        walletAddress,
        sufficientBalance,
        onChainTransfersEnabled: enableOnChainTransfers,
        solPrice
      });
    } catch (error: any) {
      console.error("Distribution preview error:", error);
      res.status(500).json({
        ok: false,
        error: "Error calculating distribution preview"
      });
    }
  });

  app.post("/api/admin/distribute", async (req, res) => {
    try {
      const { password } = req.body;
      const REVSHARE_ADMIN_PASSWORD = "admin_2k9mK3nP8qR4sT7vX1zY6admin_2k9mK3nP8qR4sT7vX1zY6wB5cD8fG2hJkkqlqwB5cD8fG2hJkkqlqekrio";
      
      if (password !== REVSHARE_ADMIN_PASSWORD) {
        return res.status(401).json({
          ok: false,
          error: "Invalid password"
        });
      }

      const { holders, totalAmount, tierBreakdown } = await holderService.getEligibleHolders();
      
      // Calculate current pool using SAME formula as /api/stats/pumpfun and /api/admin/distribution-preview
      const revenueData = await storage.getDailyRevenue();
      const totalAccumulated = revenueData.accumulatedDexIncrement || 0;
      
      // DEX Trading Volume = Locked baseline ($86k) + accumulated increments
      const lockedDexBaseline = revenueData.lockedDexVolumeBaseline || 86000;
      const totalDexVolumeUSD = lockedDexBaseline + totalAccumulated;
      
      // ZK Swap Volume = Locked baseline ($5.12k) + platform swap increments
      const lockedZKBaseline = revenueData.lockedZKVolumeBaseline || 5120;
      const zkSwapIncrement = revenueData.totalZKSwapVolumeUSD || 0;
      const totalZKSwapVolumeUSD = lockedZKBaseline + zkSwapIncrement;
      
      // Calculate revenues as percentages of total volumes
      const dexRevenueUSD = totalDexVolumeUSD * 0.002; // 0.2% of DEX volume
      const zkSwapRevenueUSD = totalZKSwapVolumeUSD * 0.004; // 0.4% of ZK volume
      
      // Current Pool = DEX revenue + ZK revenue
      const poolSize = dexRevenueUSD + zkSwapRevenueUSD;

      if (poolSize <= 0) {
        return res.status(400).json({
          ok: false,
          error: "No new revenue available for distribution"
        });
      }

      if (holders.length === 0) {
        return res.status(400).json({
          ok: false,
          error: "No eligible holders found"
        });
      }

      console.log(`🚀 Starting inclusive tier-based distribution of $${poolSize.toFixed(2)} to ${holders.length} holders (all ≥1 token)`);
      console.log(`📊 Tier distribution: ${tierBreakdown.map(t => `${t.icon}${t.holderCount}`).join(' | ')}`);

      const distributions: Array<{ address: string; amount: number; usdAmount: number; tier: string; tierIcon: string }> = [];
      let totalDistributed = 0;

      const enableOnChainTransfers = !!process.env.REVSHARE_PRIVATE_KEY;
      let revshareKeypair: Keypair | null = null;

      if (enableOnChainTransfers) {
        try {
          const privateKeyEnv = process.env.REVSHARE_PRIVATE_KEY!;
          
          if (privateKeyEnv.startsWith('[')) {
            const keyArray = JSON.parse(privateKeyEnv);
            revshareKeypair = Keypair.fromSecretKey(new Uint8Array(keyArray));
          } else {
            revshareKeypair = Keypair.fromSecretKey(bs58.decode(privateKeyEnv));
          }
          
          console.log(`🔑 Loaded REVSHARE keypair: ${revshareKeypair.publicKey.toBase58()}`);
          
          const balance = await vaultClient.connection.getBalance(revshareKeypair.publicKey);
          const balanceSOL = balance / LAMPORTS_PER_SOL;
          console.log(`💰 REVSHARE wallet balance: ${balanceSOL.toFixed(4)} SOL`);
        } catch (error) {
          console.error('Failed to load REVSHARE keypair:', error);
          return res.status(500).json({
            ok: false,
            error: "Failed to load distribution wallet"
          });
        }
      }

      // Fetch real-time SOL price from CoinGecko
      const solPrice = await priceOracle.getPrice('sol');
      if (!solPrice || solPrice <= 0) {
        return res.status(500).json({
          ok: false,
          error: "Failed to fetch SOL price from CoinGecko"
        });
      }
      
      // Pure proportional distribution: each holder gets (holdings / total) × pool
      // Calculate lamports consistently to match actual transfer logic
      let totalLamportsNeeded = 0;
      for (const holder of holders) {
        const share = totalAmount > 0 ? (holder.amount / totalAmount) : 0;
        const rewardUSD = poolSize * share;
        const rewardSOL = rewardUSD / solPrice;
        const lamports = Math.floor(rewardSOL * LAMPORTS_PER_SOL);
        
        // Only include if lamports > 0 (same logic as actual transfer)
        if (lamports > 0) {
          distributions.push({
            address: holder.address,
            amount: lamports / LAMPORTS_PER_SOL, // Store actual SOL amount that will be sent
            usdAmount: rewardUSD,
            tier: holder.tier.label,
            tierIcon: holder.tier.icon
          });
          totalDistributed += rewardUSD;
          totalLamportsNeeded += lamports;
          
          console.log(`  ${holder.tier.icon} ${holder.address}: $${rewardUSD.toFixed(2)} (${(lamports / LAMPORTS_PER_SOL).toFixed(6)} SOL = ${lamports} lamports, ${(share * 100).toFixed(4)}%) [${holder.tier.label}]`);
        }
      }

      // Check if wallet has enough balance BEFORE distributing
      if (enableOnChainTransfers && revshareKeypair) {
        const balanceLamports = await vaultClient.connection.getBalance(revshareKeypair.publicKey);
        
        if (balanceLamports < totalLamportsNeeded) {
          const balanceSOL = balanceLamports / LAMPORTS_PER_SOL;
          const neededSOL = totalLamportsNeeded / LAMPORTS_PER_SOL;
          console.error(`❌ Insufficient balance: wallet has ${balanceSOL.toFixed(4)} SOL (${balanceLamports} lamports) but needs ${neededSOL.toFixed(4)} SOL (${totalLamportsNeeded} lamports)`);
          return res.status(400).json({
            ok: false,
            error: `Insufficient wallet balance. Has ${balanceSOL.toFixed(4)} SOL but needs ${neededSOL.toFixed(4)} SOL`,
            walletBalance: balanceSOL,
            totalNeeded: neededSOL
          });
        }
        const balanceSOL = balanceLamports / LAMPORTS_PER_SOL;
        const neededSOL = totalLamportsNeeded / LAMPORTS_PER_SOL;
        console.log(`✅ Sufficient balance: wallet has ${balanceSOL.toFixed(4)} SOL (${balanceLamports} lamports), needs ${neededSOL.toFixed(4)} SOL (${totalLamportsNeeded} lamports)`);
      }

      if (enableOnChainTransfers && revshareKeypair) {
        console.log('💸 Executing on-chain SOL transfers...');
        let successCount = 0;
        let failCount = 0;

        for (const dist of distributions) {
          try {
            const recipientPubkey = new PublicKey(dist.address);
            const lamports = Math.floor(dist.amount * LAMPORTS_PER_SOL);
            
            const instruction = SystemProgram.transfer({
              fromPubkey: revshareKeypair.publicKey,
              toPubkey: recipientPubkey,
              lamports
            });

            const { blockhash, lastValidBlockHeight } = await vaultClient.connection.getLatestBlockhash();
            const message = new TransactionMessage({
              payerKey: revshareKeypair.publicKey,
              recentBlockhash: blockhash,
              instructions: [instruction]
            }).compileToV0Message();

            const transaction = new VersionedTransaction(message);
            transaction.sign([revshareKeypair]);

            const signature = await vaultClient.connection.sendTransaction(transaction);
            await vaultClient.connection.confirmTransaction({
              signature,
              blockhash,
              lastValidBlockHeight
            });

            console.log(`  ✅ Sent ${dist.amount.toFixed(6)} SOL to ${dist.address} - TX: ${signature}`);
            successCount++;
          } catch (error: any) {
            console.error(`  ❌ Failed to send to ${dist.address}:`, error.message);
            failCount++;
          }
        }

        console.log(`📊 Transfer summary: ${successCount} success, ${failCount} failed`);
      } else {
        console.log('ℹ️  On-chain transfers disabled (no REVSHARE_PRIVATE_KEY found) - accounting only');
      }

      // Reset pool after distribution (accumulatedDexIncrement and totalZKSwapVolumeUSD reset to 0)
      await storage.executeDistribution(poolSize);
      
      console.log(`✅ Distribution complete: $${totalDistributed.toFixed(2)} to ${distributions.length} recipients`);

      res.json({
        ok: true,
        totalDistributed,
        recipientCount: distributions.length,
        distributions,
        tierBreakdown,
        onChainTransfersExecuted: enableOnChainTransfers
      });
    } catch (error: any) {
      console.error("Distribution error:", error);
      res.status(500).json({
        ok: false,
        error: "Error executing distribution"
      });
    }
  });

  // Developer API Routes
  app.post("/api/dev/register", async (req, res) => {
    try {
      const { username, email, password } = req.body;
      
      if (!username || !email || !password) {
        return res.status(400).json({ ok: false, error: "Missing required fields" });
      }
      
      // Check if username or email already exists
      const existingUser = await storage.getDeveloperByUsername(username);
      if (existingUser) {
        return res.status(400).json({ ok: false, error: "Username already exists" });
      }
      
      const existingEmail = await storage.getDeveloperByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ ok: false, error: "Email already exists" });
      }
      
      // Hash password and create developer
      const passwordHash = await hashPassword(password);
      const result = await storage.createDeveloper(username, email, passwordHash);
      
      // Generate JWT token
      const token = generateJWT(result.id, username);
      
      res.json({
        ok: true,
        token,
        developer: { id: result.id, username, email }
      });
    } catch (error: any) {
      console.error("Developer registration error:", error);
      res.status(500).json({ ok: false, error: "Registration failed" });
    }
  });

  app.post("/api/dev/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ ok: false, error: "Missing username or password" });
      }
      
      // Get developer by username
      const developer = await storage.getDeveloperByUsername(username);
      if (!developer) {
        return res.status(401).json({ ok: false, error: "Invalid credentials" });
      }
      
      // Verify password
      const validPassword = await verifyPassword(password, developer.passwordHash);
      if (!validPassword) {
        return res.status(401).json({ ok: false, error: "Invalid credentials" });
      }
      
      // Generate JWT token
      const token = generateJWT(developer.id, developer.username);
      
      res.json({
        ok: true,
        token,
        developer: { id: developer.id, username: developer.username, email: developer.email }
      });
    } catch (error: any) {
      console.error("Developer login error:", error);
      res.status(500).json({ ok: false, error: "Login failed" });
    }
  });

  app.post("/api/dev/keys/generate", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ ok: false, error: "No authorization token provided" });
      }
      
      const token = authHeader.substring(7);
      const decoded = verifyJWT(token);
      
      if (!decoded) {
        return res.status(401).json({ ok: false, error: "Invalid or expired token" });
      }
      
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ ok: false, error: "API key name is required" });
      }
      
      // Generate new API key
      const apiKey = generateApiKey();
      const keyHash = hashApiKey(apiKey);
      
      // Store in database
      const result = await storage.createApiKey(decoded.developerId, name, keyHash);
      
      res.json({
        ok: true,
        apiKey, // Only shown once!
        keyId: result.id,
        name
      });
    } catch (error: any) {
      console.error("API key generation error:", error);
      res.status(500).json({ ok: false, error: "Failed to generate API key" });
    }
  });

  app.get("/api/dev/keys", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ ok: false, error: "No authorization token provided" });
      }
      
      const token = authHeader.substring(7);
      const decoded = verifyJWT(token);
      
      if (!decoded) {
        return res.status(401).json({ ok: false, error: "Invalid or expired token" });
      }
      
      const keys = await storage.getApiKeysByDeveloper(decoded.developerId);
      
      res.json({
        ok: true,
        keys: keys.map(k => ({
          id: k.id,
          name: k.name,
          isActive: k.isActive === 1,
          usageCount: k.usageCount,
          lastUsedAt: k.lastUsedAt,
          createdAt: k.createdAt
        }))
      });
    } catch (error: any) {
      console.error("Get API keys error:", error);
      res.status(500).json({ ok: false, error: "Failed to fetch API keys" });
    }
  });

  app.delete("/api/dev/keys/:id", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ ok: false, error: "No authorization token provided" });
      }
      
      const token = authHeader.substring(7);
      const decoded = verifyJWT(token);
      
      if (!decoded) {
        return res.status(401).json({ ok: false, error: "Invalid or expired token" });
      }
      
      const keyId = parseInt(req.params.id);
      
      // Verify key belongs to this developer
      const keys = await storage.getApiKeysByDeveloper(decoded.developerId);
      const keyExists = keys.find(k => k.id === keyId);
      
      if (!keyExists) {
        return res.status(404).json({ ok: false, error: "API key not found" });
      }
      
      await storage.deactivateApiKey(keyId);
      
      res.json({ ok: true, message: "API key deactivated successfully" });
    } catch (error: any) {
      console.error("Deactivate API key error:", error);
      res.status(500).json({ ok: false, error: "Failed to deactivate API key" });
    }
  });

  // Zekta API Endpoints (Protected by API Key)
  app.post("/api/zekta/payments/create", validateApiKey, async (req: AuthenticatedRequest, res) => {
    try {
      const { domainName, currency } = req.body;
      
      if (!domainName || !currency) {
        return res.status(400).json({ ok: false, error: "Missing required fields: domainName, currency" });
      }

      // Generate mock deposit address based on currency
      let depositAddress = '';
      const mockSuffix = Math.random().toString(36).substring(2, 15);
      
      if (currency === 'SOL') {
        depositAddress = `${mockSuffix}XxYrLayer2BZx`;
      } else if (currency === 'BTC') {
        depositAddress = `bc1q${mockSuffix}`;
      } else if (currency === 'ETH' || currency === 'USDT' || currency === 'USDC') {
        depositAddress = `0x${mockSuffix}${mockSuffix}`;
      } else if (currency === 'BNB') {
        depositAddress = `bnb1${mockSuffix}`;
      } else if (currency === 'MATIC') {
        depositAddress = `0x${mockSuffix}${mockSuffix}`;
      } else if (currency === 'AVAX') {
        depositAddress = `X-avax1${mockSuffix}`;
      } else if (currency === 'ZEC') {
        depositAddress = `zs1${mockSuffix}${mockSuffix}`;
      } else {
        return res.status(400).json({ ok: false, error: "Unsupported currency" });
      }

      // Mock pricing (domain costs ~$22 USD equivalent)
      const priceUSD = 22;
      const rates: Record<string, number> = {
        SOL: 140, ETH: 2500, BTC: 45000, USDT: 1, USDC: 1,
        BNB: 300, MATIC: 0.5, AVAX: 25, ZEC: 30
      };
      const amount = priceUSD / rates[currency];

      // Create payment request
      const payment = await storage.createPaymentRequest(
        req.developerId!,
        req.apiKeyId!,
        domainName,
        currency,
        amount,
        priceUSD,
        depositAddress
      );

      res.json({
        ok: true,
        paymentId: payment.id,
        depositAddress,
        amount,
        currency,
        amountUSD: priceUSD,
        expiresIn: 3600
      });
    } catch (error: any) {
      console.error("Create payment error:", error);
      res.status(500).json({ ok: false, error: "Failed to create payment request" });
    }
  });

  app.get("/api/zekta/payments/:id", validateApiKey, async (req: AuthenticatedRequest, res) => {
    try {
      const paymentId = parseInt(req.params.id);
      const payment = await storage.getPaymentRequest(paymentId);

      if (!payment) {
        return res.status(404).json({ ok: false, error: "Payment not found" });
      }

      // Verify payment belongs to requesting developer
      if (payment.developerId !== req.developerId) {
        return res.status(403).json({ ok: false, error: "Access denied" });
      }

      res.json({
        ok: true,
        payment: {
          id: payment.id,
          domainName: payment.domainName,
          currency: payment.currency,
          amount: payment.amount,
          amountUSD: payment.amountUSD,
          depositAddress: payment.depositAddress,
          status: payment.status,
          createdAt: payment.createdAt,
          completedAt: payment.completedAt
        }
      });
    } catch (error: any) {
      console.error("Get payment error:", error);
      res.status(500).json({ ok: false, error: "Failed to fetch payment" });
    }
  });

  app.post("/api/zekta/swap", validateApiKey, async (req: AuthenticatedRequest, res) => {
    try {
      const { from, to, amount, zkProof } = req.body;
      
      if (!from || !to || !amount) {
        return res.status(400).json({ ok: false, error: "Missing required fields: from, to, amount" });
      }

      // Verify ZK proof if provided (simplified for demo)
      if (zkProof && (!zkProof.proof || !zkProof.publicSignals)) {
        return res.status(400).json({ ok: false, error: "Invalid ZK proof format" });
      }

      // Mock swap execution
      const orderId = `ZEKTA-${Date.now()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      
      // Track swap volume
      const mockRateUSD = from === 'SOL' ? 140 : from === 'ETH' ? 2500 : 1;
      const volumeUSD = amount * mockRateUSD;
      await storage.incrementZKSwapVolume(volumeUSD);

      res.json({
        ok: true,
        orderId,
        status: 'processing',
        from,
        to,
        amount,
        estimatedArrival: new Date(Date.now() + 600000).toISOString(),
        privacyGuaranteed: !!zkProof
      });
    } catch (error: any) {
      console.error("Swap error:", error);
      res.status(500).json({ ok: false, error: "Failed to execute swap" });
    }
  });

  // Domain Order Routes (Public - No API Key Required)
  app.post("/api/domains/check", async (req, res) => {
    try {
      console.log("[DOMAIN-CHECK] Received request:", req.body);
      const { domainName, tld } = req.body;
      
      if (!domainName || !tld) {
        return res.status(400).json({ ok: false, error: "Missing required fields: domainName, tld" });
      }

      const fullDomain = `${domainName}${tld}`;
      console.log("[DOMAIN-CHECK] Checking:", fullDomain);
      
      // Check domain availability and get real Njalla pricing (in EUR)
      const { available, owned, priceEUR, error, unsupportedTld } = await njallaService.checkDomainAvailability(fullDomain);
      
      console.log("[DOMAIN-CHECK] Result:", { available, owned, priceEUR, error, unsupportedTld });
      
      // If TLD is not supported, return error immediately
      if (unsupportedTld) {
        return res.status(400).json({
          ok: false,
          error,
          unsupportedTld: true,
          domain: fullDomain
        });
      }
      
      res.json({
        ok: true,
        available,
        domain: fullDomain,
        price: priceEUR || 12.99, // EUR price for display
        priceEUR, // EUR price from Njalla API
        owned // true if we already own this domain
      });
    } catch (error: any) {
      console.error("[DOMAIN-CHECK] Error:", error);
      res.status(500).json({ ok: false, error: "Failed to check domain" });
    }
  });

  app.post("/api/domains/order", async (req, res) => {
    try {
      const { domainName, tld, currency, customerEmail } = req.body;
      
      if (!domainName || !tld || !currency) {
        return res.status(400).json({ ok: false, error: "Missing required fields" });
      }

      // Check if SimpleSwap client is available
      if (!simpleSwapClient) {
        return res.status(503).json({ 
          ok: false, 
          error: "Payment service temporarily unavailable. Please try again later." 
        });
      }

      // Generate unique order ID
      const orderId = `ZK-DOM-${Date.now()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      
      // Generate Semaphore identity for domain ownership (fully anonymous)
      const identity = new Identity();
      const commitment = identity.commitment.toString();
      // Export secret - use the private key (works with new Identity(secret))
      // @ts-ignore - accessing private field for serialization
      const secret = identity._privateKey ? identity._privateKey.toString() : String(identity);
      
      // Get real domain pricing from Njalla (in EUR) and validate TLD support
      const fullDomain = `${domainName}${tld}`;
      const { priceEUR: domainPriceEUR, error, unsupportedTld } = await njallaService.checkDomainAvailability(fullDomain);
      
      // CRITICAL: Block order creation if TLD is not supported
      if (unsupportedTld) {
        return res.status(400).json({
          ok: false,
          error: error || `The ${tld} domain extension is not supported by our registrar`,
          unsupportedTld: true
        });
      }
      
      const priceEUR = domainPriceEUR || 15; // Fallback to 15 EUR if pricing unavailable
      
      // Calculate crypto amount from EUR using CoinGecko
      const cryptoPriceInEUR = await priceOracle.getPriceInEUR(currency);
      
      if (cryptoPriceInEUR === null || cryptoPriceInEUR <= 0) {
        return res.status(500).json({ 
          ok: false, 
          error: `Unable to fetch ${currency} price in EUR. Please try again later.` 
        });
      }
      
      const amountCrypto = priceEUR / cryptoPriceInEUR;

      // Zekta receives payment in ETH (ERC20) - will be used to pay Njalla
      const receiveCurrency = 'ETH';
      const { ethWalletService } = await import('./eth-wallet');
      const receiveAddress = ethWalletService.address; // Zekta's ETH wallet address
      
      // Map currency to network (required by SimpleSwap v3 API)
      const getNetwork = (ticker: string): string => {
        const networks: Record<string, string> = {
          'SOL': 'sol',
          'BTC': 'btc',
          'ETH': 'eth',
          'USDT': 'trc20',
          'USDC': 'trc20',
          'BNB': 'bsc',
          'MATIC': 'matic',
          'AVAX': 'avaxc',
          'ZEC': 'zec'
        };
        return networks[ticker.toUpperCase()] || ticker.toLowerCase();
      };
      
      // Create real SimpleSwap exchange with network specification
      const exchange = await simpleSwapClient.createExchange({
        fixed: false,
        tickerFrom: currency.toLowerCase(),
        tickerTo: receiveCurrency.toLowerCase(),
        networkFrom: getNetwork(currency),
        networkTo: 'eth', // ETH on Ethereum mainnet
        amount: amountCrypto.toFixed(8),
        addressTo: receiveAddress,
      });

      const depositAddress = exchange.addressFrom;
      const exchangeId = exchange.id || exchange.publicId || '';
      
      // Set expiration (30 minutes from now)
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
      
      // Create domain order in database with ZK commitment, secret, and exchangeId
      await storage.createDomainOrder(
        orderId,
        domainName,
        tld,
        priceEUR,
        currency,
        amountCrypto,
        depositAddress,
        customerEmail || null,
        commitment,
        secret,
        expiresAt,
        exchangeId
      );

      console.log(`✓ Domain order created: ${orderId} | Exchange: ${exchangeId} | Domain: ${domainName}${tld} | Price: €${priceEUR.toFixed(2)}`);

      res.json({
        ok: true,
        orderId,
        domain: `${domainName}${tld}`,
        priceEUR,
        currency,
        amountCrypto,
        depositAddress,
        expiresAt: expiresAt.toISOString(),
        paymentStatus: 'pending',
        // CRITICAL: Return secret to user - they need this for DNS management
        domainSecret: secret,
        zkCommitment: commitment
      });
    } catch (error: any) {
      console.error("Create domain order error:", error);
      
      // Sanitize and categorize error message
      let userMessage = error.message
        ?.replace(/SimpleSwap/gi, 'exchange service')
        ?.replace(/simpleswap\.io/gi, 'exchange service');
      
      // Handle specific error types
      if (userMessage?.toLowerCase().includes('rate limit')) {
        userMessage = "Our payment service is experiencing high traffic. Please wait 30 seconds and try again.";
      } else if (userMessage?.toLowerCase().includes('timeout')) {
        userMessage = "Payment service timeout. Please try again in a moment.";
      } else if (userMessage?.toLowerCase().includes('network')) {
        userMessage = "Network error. Please check your connection and try again.";
      }
      
      res.status(500).json({ ok: false, error: userMessage || "Failed to create domain order" });
    }
  });

  app.get("/api/domains/order/:orderId", async (req, res) => {
    try {
      const { orderId } = req.params;
      
      // Try to find by Order ID first, then by Exchange ID
      let order = await storage.getDomainOrder(orderId);
      
      if (!order) {
        // Try looking up by exchange ID
        order = await storage.getDomainOrderByExchangeId(orderId);
      }

      if (!order) {
        return res.status(404).json({ ok: false, error: "Order not found" });
      }

      res.json({
        ok: true,
        order: {
          orderId: order.orderId,
          domain: `${order.domainName}${order.tld}`,
          domainName: order.domainName,
          tld: order.tld,
          priceUSD: order.priceUSD,
          currency: order.currency,
          amountCrypto: order.amountCrypto,
          depositAddress: order.depositAddress,
          paymentStatus: order.paymentStatus,
          orderStatus: order.orderStatus,
          txHash: order.txHash,
          njallaPaymentId: order.njallaPaymentId,
          njallaPaymentAddress: order.njallaPaymentAddress,
          njallaPaymentTxHash: order.njallaPaymentTxHash,
          njallaPaymentConfirmed: order.njallaPaymentConfirmed,
          domainSecret: order.domainSecret,
          createdAt: order.createdAt,
          paidAt: order.paidAt,
          deliveredAt: order.deliveredAt,
          expiresAt: order.expiresAt,
          exchangeId: order.exchangeId
        }
      });
    } catch (error: any) {
      console.error("Get domain order error:", error);
      res.status(500).json({ ok: false, error: "Failed to fetch order" });
    }
  });

  // DEV ONLY: Simulate payment for testing
  app.post("/api/domains/order/:orderId/simulate-payment", async (req, res) => {
    try {
      const { orderId } = req.params;
      const order = await storage.getDomainOrder(orderId);

      if (!order) {
        return res.status(404).json({ ok: false, error: "Order not found" });
      }

      // Simulate payment by updating order status to paid
      await storage.updateDomainOrderPayment(
        orderId,
        'paid',
        `MOCK-TX-${Date.now()}`,
        undefined
      );

      console.log(`💰 [DEMO] Simulated payment for order ${orderId}`);

      res.json({
        ok: true,
        message: "Payment simulated successfully",
        orderId: orderId
      });
    } catch (error: any) {
      console.error("Simulate payment error:", error);
      res.status(500).json({ ok: false, error: "Failed to simulate payment" });
    }
  });

  // Get user's domains (anonymous - using ZK commitment)
  app.get("/api/domains/my-domains", async (req, res) => {
    try {
      const { zkCommitment } = req.query;

      if (!zkCommitment || typeof zkCommitment !== 'string') {
        return res.status(400).json({ ok: false, error: "Missing ZK commitment" });
      }

      const domains = await storage.getDomainOrderByCommitment(zkCommitment);

      res.json({
        ok: true,
        domains: domains.map(d => ({
          orderId: d.orderId,
          domain: `${d.domainName}${d.tld}`,
          domainName: d.domainName,
          tld: d.tld,
          createdAt: d.createdAt,
          deliveredAt: d.deliveredAt
        }))
      });
    } catch (error: any) {
      console.error("Get user domains error:", error);
      res.status(500).json({ ok: false, error: "Failed to fetch domains" });
    }
  });

  // Helper function to verify domain ownership via secret
  async function verifyDomainOwnership(domain: string, domainSecret: string): Promise<{ valid: boolean; error?: string }> {
    try {
      // Get the domain order to check stored commitment
      const domainOrder = await storage.getDomainOrderByDomain(domain);
      if (!domainOrder) {
        return { valid: false, error: "Domain not found" };
      }

      // Recreate identity from provided secret
      // Secret is stored as comma-separated numbers (Uint8Array.toString() format)
      // Convert back to Uint8Array: "1,2,3,4" -> Uint8Array([1,2,3,4])
      const privateKeyArray = new Uint8Array(
        domainSecret.split(',').map(n => parseInt(n.trim(), 10))
      );
      const identity = new Identity(privateKeyArray);
      
      const derivedCommitment = identity.commitment.toString();

      // Verify derived commitment matches stored commitment
      if (derivedCommitment !== domainOrder.zkCommitment) {
        return { valid: false, error: "Invalid domain secret - commitment mismatch" };
      }

      return { valid: true };
    } catch (error: any) {
      console.error("Domain ownership verification error:", error);
      return { valid: false, error: "Invalid secret format" };
    }
  }

  // DNS Management Routes (ZK-based anonymous ownership)
  app.get("/api/domains/:domain/dns", async (req, res) => {
    try {
      const { domain } = req.params;
      const { zkCommitment } = req.query;

      if (!zkCommitment) {
        return res.status(401).json({ ok: false, error: "ZK commitment required for read access" });
      }

      // For GET requests, we allow commitment-based access (read-only doesn't need full proof)
      const domainOrder = await storage.getDomainOrderByDomain(domain);
      if (!domainOrder || domainOrder.zkCommitment !== zkCommitment) {
        return res.status(403).json({ ok: false, error: "Unauthorized: Invalid domain ownership" });
      }

      const records = await njallaService.listDNSRecords(domain);

      res.json({
        ok: true,
        records
      });
    } catch (error: any) {
      console.error("List DNS records error:", error);
      res.status(500).json({ ok: false, error: "Failed to fetch DNS records" });
    }
  });

  app.post("/api/domains/:domain/dns", async (req, res) => {
    try {
      const { domain } = req.params;
      const { type, name, content, ttl, domainSecret } = req.body;

      if (!type || !name || !content) {
        return res.status(400).json({ ok: false, error: "Missing required fields" });
      }

      if (!domainSecret) {
        return res.status(401).json({ ok: false, error: "Domain secret required for DNS modifications" });
      }

      // Verify domain ownership via secret
      const verification = await verifyDomainOwnership(domain, domainSecret);
      if (!verification.valid) {
        return res.status(403).json({ ok: false, error: verification.error || "Invalid domain secret" });
      }

      const result = await njallaService.addDNSRecord(domain, type, name, content, ttl || 3600);

      if (result.success) {
        res.json({
          ok: true,
          record: result.record
        });
      } else {
        res.status(500).json({ ok: false, error: result.error });
      }
    } catch (error: any) {
      console.error("Add DNS record error:", error);
      res.status(500).json({ ok: false, error: "Failed to add DNS record" });
    }
  });

  app.put("/api/domains/:domain/dns/:recordId", async (req, res) => {
    try {
      const { domain, recordId } = req.params;
      const { content, ttl, domainSecret } = req.body;

      if (!content) {
        return res.status(400).json({ ok: false, error: "Missing content field" });
      }

      if (!domainSecret) {
        return res.status(401).json({ ok: false, error: "Domain secret required for DNS modifications" });
      }

      // Verify domain ownership via secret
      const verification = await verifyDomainOwnership(domain, domainSecret);
      if (!verification.valid) {
        return res.status(403).json({ ok: false, error: verification.error || "Invalid domain secret" });
      }

      const result = await njallaService.updateDNSRecord(domain, recordId, content, ttl);

      if (result.success) {
        res.json({ ok: true });
      } else {
        res.status(500).json({ ok: false, error: result.error });
      }
    } catch (error: any) {
      console.error("Update DNS record error:", error);
      res.status(500).json({ ok: false, error: "Failed to update DNS record" });
    }
  });

  app.delete("/api/domains/:domain/dns/:recordId", async (req, res) => {
    try {
      const { domain, recordId } = req.params;
      const { domainSecret } = req.body;

      if (!domainSecret) {
        return res.status(401).json({ ok: false, error: "Domain secret required for DNS modifications" });
      }

      // Verify domain ownership via secret
      const verification = await verifyDomainOwnership(domain, domainSecret);
      if (!verification.valid) {
        return res.status(403).json({ ok: false, error: verification.error || "Invalid domain secret" });
      }

      const result = await njallaService.removeDNSRecord(domain, recordId);

      if (result.success) {
        res.json({ ok: true });
      } else {
        res.status(500).json({ ok: false, error: result.error });
      }
    } catch (error: any) {
      console.error("Remove DNS record error:", error);
      res.status(500).json({ ok: false, error: "Failed to remove DNS record" });
    }
  });


  app.post("/api/vault/initialize", async (req, res) => {
    try {
      const mockSignature = 'MOCK-INIT-' + Date.now().toString(36);
      
      console.log(`✓ Vault initialized (MOCK MODE): ${mockSignature}`);
      
      res.json({
        ok: true,
        signature: mockSignature,
        vaultAddress: vaultClient.vaultPda.toBase58(),
        explorer: `https://explorer.solana.com/tx/${mockSignature}?cluster=devnet`,
        mode: 'mock'
      });
    } catch (error: any) {
      console.error('Initialize vault failed:', error);
      res.status(500).json({ 
        ok: false, 
        error: error.message || 'Failed to initialize vault'
      });
    }
  });

  app.post("/api/deposit/track", async (req, res) => {
    try {
      const { signature, commitment } = req.body;
      
      if (!signature || !commitment) {
        return res.status(400).json({ 
          ok: false, 
          error: "Missing required fields (signature, commitment)" 
        });
      }

      const tx = await vaultClient.connection.getTransaction(signature, {
        maxSupportedTransactionVersion: 0,
        commitment: 'confirmed'
      });

      if (!tx || !tx.meta) {
        return res.status(404).json({
          ok: false,
          error: "Transaction not found or not confirmed"
        });
      }

      if (tx.meta.err) {
        return res.status(400).json({
          ok: false,
          error: "Transaction failed on-chain"
        });
      }

      const programIds = tx.transaction.message.getAccountKeys().staticAccountKeys.map(k => k.toBase58());
      if (!programIds.includes(vaultClient.programId.toBase58())) {
        return res.status(400).json({
          ok: false,
          error: "Transaction is not for this vault program"
        });
      }

      const commitmentHash = Buffer.from(commitment.slice(2), 'hex');
      const [depositPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('deposit'), vaultClient.vaultPda.toBuffer(), commitmentHash],
        vaultClient.programId
      );

      const depositAccount = await vaultClient.connection.getAccountInfo(depositPda);
      if (!depositAccount) {
        return res.status(400).json({
          ok: false,
          error: "Deposit PDA not found on-chain. Invalid commitment or transaction."
        });
      }

      const onChainCommitment = depositAccount.data.slice(8, 40);
      if (!onChainCommitment.equals(commitmentHash)) {
        return res.status(400).json({
          ok: false,
          error: "Commitment mismatch: client commitment does not match on-chain data"
        });
      }

      const onChainAmount = depositAccount.data.readBigUInt64LE(40);
      const amountInSol = Number(onChainAmount) / LAMPORTS_PER_SOL;

      const deposit = await storage.addDeposit(commitment, amountInSol, signature);
      
      semaphoreGroup.addMember(BigInt(commitment));

      return res.json({ 
        ok: true, 
        deposit,
        commitment,
        amount: amountInSol,
        groupRoot: semaphoreGroup.root.toString(),
        groupSize: semaphoreGroup.members.length
      });
    } catch (error: any) {
      console.error("Deposit tracking error:", error);
      return res.status(500).json({ 
        ok: false, 
        error: error.message 
      });
    }
  });

  app.get("/api/group/info", (req, res) => {
    res.json({
      ok: true,
      groupId: GROUP_ID.toString(),
      root: semaphoreGroup.root.toString(),
      size: semaphoreGroup.members.length,
      members: semaphoreGroup.members.map(m => m.toString())
    });
  });

  app.post("/api/merkle/register", async (req, res) => {
    try {
      const { root } = req.body;
      
      if (!root) {
        return res.status(400).json({
          ok: false,
          error: "Missing merkle root"
        });
      }

      const mockSignature = 'MOCK-ROOT-' + Date.now().toString(36);

      console.log(`✓ Merkle root registered (MOCK MODE): ${root}`);

      return res.json({
        ok: true,
        signature: mockSignature,
        root: root,
        explorer: `https://explorer.solana.com/tx/${mockSignature}?cluster=devnet`,
        mode: 'mock'
      });

    } catch (error: any) {
      console.error("Merkle root registration error:", error);
      return res.status(500).json({
        ok: false,
        error: error.message || "Failed to register merkle root"
      });
    }
  });

  app.post("/api/withdraw", async (req, res) => {
    try {
      const { to, amount, proof } = req.body;
      
      if (!to || !amount || !proof) {
        return res.status(400).json({ 
          ok: false, 
          error: "Missing required fields (to, amount, proof)" 
        });
      }

      const nullifierStr = proof.nullifier;
      const isUsed = await storage.isNullifierUsed(nullifierStr);
      
      if (isUsed) {
        return res.status(400).json({
          ok: false,
          error: "Proof already used. Cannot reuse same identity for multiple withdrawals."
        });
      }
      
      const rootFromProof = BigInt(proof.merkleTreeRoot);
      const currentRoot = semaphoreGroup.root;
      
      if (rootFromProof !== currentRoot) {
        return res.status(400).json({ 
          ok: false, 
          error: "Invalid proof: root mismatch with current group state" 
        });
      }

      const isValid = await verifyProof(proof);
      
      if (!isValid) {
        return res.status(400).json({ 
          ok: false, 
          error: "Invalid ZK proof: verification failed" 
        });
      }

      const mockSignature = 'MOCK-WITHDRAW-' + Date.now().toString(36);
      
      await storage.markNullifierUsed(nullifierStr);

      console.log(`✓ Anonymous withdrawal (MOCK MODE): ${amount} SOL to ${to}`);

      return res.json({
        ok: true,
        signature: mockSignature,
        explorer: `https://explorer.solana.com/tx/${mockSignature}?cluster=devnet`,
        mode: 'mock'
      });

    } catch (error: any) {
      console.error("Withdrawal error:", error);
      return res.status(500).json({ 
        ok: false, 
        error: error.message || "Withdrawal failed" 
      });
    }
  });

  // Crypto exchange API endpoints
  app.get("/api/swap/currencies", async (req, res) => {
    try {
      if (!simpleSwapClient) {
        return res.status(503).json({
          ok: false,
          error: "Exchange service not available. Please contact support."
        });
      }

      const currencies = await simpleSwapClient.getAllCurrencies();
      return res.json({ ok: true, currencies });
    } catch (error: any) {
      console.error("Get currencies error:", error);
      return res.status(500).json({ ok: false, error: error.message });
    }
  });

  app.get("/api/swap/currency/:ticker/:network?", async (req, res) => {
    try {
      if (!simpleSwapClient) {
        return res.status(503).json({
          ok: false,
          error: "Exchange service not available. Please contact support."
        });
      }

      const { ticker, network } = req.params;
      const currency = await simpleSwapClient.getCurrency(ticker, network);
      return res.json({ ok: true, currency });
    } catch (error: any) {
      console.error("Get currency error:", error);
      return res.status(500).json({ ok: false, error: error.message });
    }
  });

  app.post("/api/swap/estimate", async (req, res) => {
    try {
      if (!simpleSwapClient) {
        return res.status(503).json({
          ok: false,
          error: "Exchange service not available. Please contact support."
        });
      }

      const { currencyFrom, currencyTo, amountFrom, amountTo } = req.body;
      
      if (!currencyFrom || !currencyTo || (!amountFrom && !amountTo)) {
        return res.status(400).json({
          ok: false,
          error: "Missing required fields: currencyFrom, currencyTo, and either amountFrom or amountTo"
        });
      }

      const estimate = await simpleSwapClient.getEstimate({
        currencyFrom,
        currencyTo,
        amountFrom,
        amountTo
      });
      return res.json({ ok: true, estimate });
    } catch (error: any) {
      console.error("Get estimate error:", error);
      return res.status(500).json({ ok: false, error: error.message });
    }
  });

  app.get("/api/swap/range", async (req, res) => {
    try {
      if (!simpleSwapClient) {
        return res.status(503).json({
          ok: false,
          error: "Exchange service not available. Please contact support."
        });
      }

      const { currencyFrom, currencyTo } = req.query;
      
      if (!currencyFrom || !currencyTo) {
        return res.status(400).json({
          ok: false,
          error: "Missing required query params: currencyFrom, currencyTo"
        });
      }

      const range = await simpleSwapClient.getRange(
        currencyFrom as string,
        currencyTo as string
      );
      return res.json({ ok: true, range });
    } catch (error: any) {
      console.error("Get range error:", error);
      return res.status(500).json({ ok: false, error: error.message });
    }
  });

  app.post("/api/swap/create", async (req, res) => {
    const { fromChain, toChain, currencyFrom, currencyTo, amountFrom, addressTo, userRefundAddress, extraIdTo } = req.body;
    
    try {
      if (!simpleSwapClient) {
        return res.status(503).json({
          ok: false,
          error: "Exchange service not available. Please contact support."
        });
      }
      
      if (!fromChain || !toChain || !currencyFrom || !currencyTo || !amountFrom || !addressTo) {
        return res.status(400).json({
          ok: false,
          error: "Missing required fields: fromChain, toChain, currencyFrom, currencyTo, amountFrom, addressTo"
        });
      }

      // Block coming soon tokens (backend safety layer)
      const comingSoonTokens: string[] = []; // All tokens now available
      const currencyFromLower = currencyFrom.toLowerCase();
      const currencyToLower = currencyTo.toLowerCase();
      
      if (comingSoonTokens.includes(currencyFromLower) || comingSoonTokens.includes(currencyToLower)) {
        return res.status(400).json({
          ok: false,
          error: "Selected token is not yet available for swaps. Please choose a different token."
        });
      }

      // Chain ID to exchange service network mapping
      const networkMap: Record<string, string> = {
        'solana': 'sol',
        'zcash': 'zec',
        'ethereum': 'eth',
        'bsc': 'bsc', // BSC uses 'bsc' network code
        'polygon': 'matic', // Polygon uses 'matic' identifier
        'avalanche': 'avaxc',
        'arbitrum': 'arbitrum',
        'optimism': 'optimism',
        'base': 'base',
        'tron': 'trx',
        'bitcoin': 'btc'
      };

      const networkFrom = networkMap[fromChain];
      const networkTo = networkMap[toChain];

      if (!networkFrom || !networkTo) {
        return res.status(400).json({
          ok: false,
          error: "Invalid chain ID provided"
        });
      }

      // Exchange API format: ticker should be clean symbol (no chain suffix)
      // Extract clean ticker by removing any chain suffix (e.g., "bnb_bsc" → "bnb")
      const cleanTicker = (currency: string) => {
        const lower = currency.toLowerCase();
        // Remove common chain suffixes
        return lower
          .replace(/_bsc$/, '')
          .replace(/_eth$/, '')
          .replace(/_sol$/, '')
          .replace(/_matic$/, '')
          .replace(/_polygon$/, '')
          .replace(/_avax$/, '')
          .replace(/_arbitrum$/, '')
          .replace(/_optimism$/, '')
          .replace(/_base$/, '')
          .replace(/_trx$/, '')
          .replace(/_btc$/, '');
      };

      let tickerFrom = cleanTicker(currencyFrom);
      let tickerTo = cleanTicker(currencyTo);

      // Exchange service uses special ticker format for some multi-chain tokens
      // BNB on BSC uses "bnb-bsc" ticker instead of just "bnb"
      if (tickerFrom === 'bnb' && networkFrom === 'bsc') {
        tickerFrom = 'bnb-bsc';
      }
      if (tickerTo === 'bnb' && networkTo === 'bsc') {
        tickerTo = 'bnb-bsc';
      }

      // Convert EVM addresses to checksum format for proper validation
      const evmChains = ['ethereum', 'bsc', 'polygon', 'avalanche', 'arbitrum', 'optimism', 'base'];
      let finalAddressTo = addressTo;
      
      if (evmChains.includes(toChain)) {
        try {
          // Normalize to lowercase first, then convert to checksum
          // This ensures getAddress() works even with mixed-case input
          finalAddressTo = getAddress(addressTo.toLowerCase());
          console.log(`✓ Converted address to checksum: ${addressTo} → ${finalAddressTo}`);
        } catch (error: any) {
          throw new Error(`Invalid EVM address format: ${addressTo}`);
        }
      }

      // Build request payload - ALWAYS include network params (exchange service requires them)
      const requestPayload: any = {
        fixed: false,
        tickerFrom: tickerFrom,
        tickerTo: tickerTo,
        amount: amountFrom,
        addressTo: finalAddressTo,
        networkFrom: networkFrom,
        networkTo: networkTo
      };

      if (userRefundAddress) {
        requestPayload.userRefundAddress = userRefundAddress;
      }
      if (extraIdTo) {
        requestPayload.extraIdTo = extraIdTo;
      }

      console.log("🔍 Exchange API Create Exchange:");
      console.log("  tickerFrom:", tickerFrom, `(network: ${networkFrom})`);
      console.log("  tickerTo:", tickerTo, `(network: ${networkTo})`);
      console.log("  amount:", amountFrom);
      console.log("  addressTo:", finalAddressTo);
      console.log("  Full payload:", JSON.stringify(requestPayload, null, 2));
      
      const exchange = await simpleSwapClient.createExchange(requestPayload);

      console.log("✅ Exchange Created:", exchange.publicId || exchange.id);
      
      // Transform exchange API v3 response to frontend-compatible format
      const orderId = exchange.publicId || exchange.id || "unknown";
      const transformedExchange = {
        ...exchange,
        id: orderId,
        orderId: orderId,  // Explicitly add orderId for frontend
        currencyFrom: exchange.tickerFrom || currencyFrom,
        currencyTo: exchange.tickerTo || currencyTo,
        expectedAmount: exchange.amountTo,
        addressFrom: exchange.addressFrom,
        addressTo: exchange.addressTo,
        amountFrom: exchange.amountFrom || amountFrom,
        status: exchange.status || 'waiting',
        // Keep v3 fields for compatibility
        tickerFrom: exchange.tickerFrom,
        tickerTo: exchange.tickerTo,
        networkFrom: exchange.networkFrom,
        networkTo: exchange.networkTo
      };

      // Track swap creation for protocol stats
      await storage.trackSwapCreation(orderId, fromChain!, toChain!);
      
      // Track swap volume using real-time price oracle
      const volumeUSD = await priceOracle.calculateVolumeUSD(amountFrom, currencyFrom);
      await storage.updateSwapVolume(volumeUSD);
      
      // Track ZK swap volume for revenue sharing (0.4% protocol fee)
      if (volumeUSD > 0) {
        await storage.incrementZKSwapVolume(volumeUSD);
        console.log(`✓ Tracked swap: ${amountFrom} ${currencyFrom.toUpperCase()} = $${volumeUSD.toFixed(2)} USD (ZK revenue pool updated)`);
      } else {
        console.log(`✓ Tracked swap: ${amountFrom} ${currencyFrom.toUpperCase()} (price unavailable, volume not tracked)`);
      }
      
      return res.json({ ok: true, exchange: transformedExchange });
    } catch (error: any) {
      console.error("Create exchange error:", error);
      
      // Sanitize error message - remove any third-party service references
      let userMessage = error.message
        ?.replace(/SimpleSwap/gi, 'exchange service')
        ?.replace(/simpleswap\.io/gi, 'exchange service')
        ?.replace(/Replit/gi, 'platform')
        ?.replace(/replit\.app/gi, 'platform');
      
      // Parse error message for user-friendly response
      if (userMessage?.includes("Pair is unavailable")) {
        userMessage = `This swap pair is not available. The combination of ${currencyFrom.toUpperCase()} on ${fromChain} to ${currencyTo.toUpperCase()} on ${toChain} is not supported. Try a different token pair or network.`;
      } else if (userMessage?.includes("should not be empty")) {
        userMessage = "Invalid swap request. Please check your token selection and try again.";
      } else if (userMessage?.includes("Insufficient")) {
        userMessage = "Insufficient balance or amount too small for this swap.";
      } else if (userMessage?.includes("Exchange service error")) {
        // Generic exchange service errors
        userMessage = "Swap service is temporarily unavailable. Please try again later.";
      }
      
      return res.status(500).json({ ok: false, error: userMessage || "Swap creation failed" });
    }
  });

  app.get("/api/swap/exchange/:exchangeId", async (req, res) => {
    try {
      if (!simpleSwapClient) {
        return res.status(503).json({
          ok: false,
          error: "Exchange service not available. Please contact support."
        });
      }

      const { exchangeId } = req.params;
      const exchange = await simpleSwapClient.getExchange(exchangeId);
      
      return res.json({ ok: true, exchange });
    } catch (error: any) {
      console.error("Get exchange error:", error);
      
      // Sanitize error message - remove third-party service references
      let userMessage = error.message
        ?.replace(/SimpleSwap/gi, 'exchange service')
        ?.replace(/simpleswap\.io/gi, 'exchange service')
        ?.replace(/Replit/gi, 'platform')
        ?.replace(/replit\.app/gi, 'platform');
      
      return res.status(500).json({ ok: false, error: userMessage || "Failed to fetch exchange" });
    }
  });

  app.get("/api/swap/exchanges", async (req, res) => {
    try {
      if (!simpleSwapClient) {
        return res.status(503).json({
          ok: false,
          error: "Exchange service not available. Please contact support."
        });
      }

      const exchanges = await simpleSwapClient.getAllExchanges();
      
      return res.json({ ok: true, exchanges });
    } catch (error: any) {
      console.error("Get exchanges error:", error);
      
      // Sanitize error message - remove third-party service references
      let userMessage = error.message
        ?.replace(/SimpleSwap/gi, 'exchange service')
        ?.replace(/simpleswap\.io/gi, 'exchange service')
        ?.replace(/Replit/gi, 'platform')
        ?.replace(/replit\.app/gi, 'platform');
      
      return res.status(500).json({ ok: false, error: userMessage || "Failed to fetch exchanges" });
    }
  });

  // ZK Confirmation endpoint - validates proof exists and gets exchange status
  app.post("/api/zk/confirm", async (req, res) => {
    try {
      const { orderId, proofHash, zkId } = req.body;
      
      if (!orderId || !proofHash || !zkId) {
        return res.status(400).json({
          ok: false,
          error: "Missing required fields: orderId, proofHash, zkId"
        });
      }

      if (!simpleSwapClient) {
        return res.status(503).json({
          ok: false,
          error: "Zekta Relayer not configured"
        });
      }

      // Get exchange status from exchange service
      const exchange = await simpleSwapClient.getExchange(orderId);
      
      // Check if we've seen this proof before (prevents replay)
      const existingProof = await storage.getProofRecord(orderId);
      
      if (existingProof && existingProof.proofHash !== proofHash) {
        return res.status(400).json({
          ok: false,
          error: "Proof mismatch - possible fraud attempt"
        });
      }

      // Store proof record for first-time verification
      if (!existingProof) {
        await storage.storeProofRecord({
          orderId,
          proofHash,
          zkId,
          status: exchange.status,
          timestamp: Date.now()
        });
      }

      return res.json({
        ok: true,
        status: exchange.status,
        orderId: exchange.id,
        txHash: exchange.transactionTo || exchange.transactionFrom,
        verified: true
      });
    } catch (error: any) {
      console.error("ZK confirm error:", error);
      
      // Sanitize error message - remove third-party service references
      let userMessage = error.message
        ?.replace(/SimpleSwap/gi, 'exchange service')
        ?.replace(/simpleswap\.io/gi, 'exchange service')
        ?.replace(/Replit/gi, 'platform')
        ?.replace(/replit\.app/gi, 'platform');
      
      return res.status(500).json({ 
        ok: false, 
        error: userMessage || "Confirmation failed" 
      });
    }
  });

  // Developer API v1 - Protected by API Key
  app.post("/api/v1/swap/create", validateApiKey, async (req: AuthenticatedRequest, res) => {
    try {
      if (!simpleSwapClient) {
        return res.status(503).json({
          ok: false,
          error: "Exchange service unavailable"
        });
      }

      const { from, to, amount, address, refundAddress, extraId } = req.body;

      if (!from || !to || !amount || !address) {
        return res.status(400).json({
          ok: false,
          error: "Missing required fields: from, to, amount, address"
        });
      }

      // Parse chain and network from token symbols
      const [fromToken, fromNetwork] = from.split(':').length > 1 ? from.split(':') : [from, null];
      const [toToken, toNetwork] = to.split(':').length > 1 ? to.split(':') : [to, null];

      // Convert token symbols to lowercase for API
      let tickerFrom = fromToken.toLowerCase();
      let tickerTo = toToken.toLowerCase();
      let networkFrom = fromNetwork?.toLowerCase();
      let networkTo = toNetwork?.toLowerCase();

      // Handle BNB special case
      if (tickerFrom === 'bnb' && networkFrom === 'bsc') {
        tickerFrom = 'bnb-bsc';
      }
      if (tickerTo === 'bnb' && networkTo === 'bsc') {
        tickerTo = 'bnb-bsc';
      }

      // Build request payload
      const requestPayload: any = {
        fixed: false,
        tickerFrom,
        tickerTo,
        amount: amount.toString(),
        addressTo: address,
        networkFrom,
        networkTo
      };

      if (refundAddress) {
        requestPayload.userRefundAddress = refundAddress;
      }
      if (extraId) {
        requestPayload.extraIdTo = extraId;
      }

      console.log(`[API v1] Creating swap for developer ${req.developerId}:`, requestPayload);

      const exchange = await simpleSwapClient.createExchange(requestPayload);
      const orderId = exchange.publicId || exchange.id || "unknown";

      // Track swap creation
      await storage.trackSwapCreation(orderId, fromToken, toToken);

      res.json({
        ok: true,
        orderId,
        depositAddress: exchange.addressFrom,
        expectedAmount: exchange.amountTo,
        status: exchange.status || 'waiting'
      });
    } catch (error: any) {
      console.error("[API v1] Swap creation error:", error);
      
      // Sanitize error message - remove third-party service references
      let userMessage = error.message
        ?.replace(/SimpleSwap/gi, 'exchange service')
        ?.replace(/simpleswap\.io/gi, 'exchange service')
        ?.replace(/Replit/gi, 'platform')
        ?.replace(/replit\.app/gi, 'platform');
      
      // Provide user-friendly error messages
      if (userMessage?.includes("Exchange service error")) {
        userMessage = "Swap service temporarily unavailable";
      }
      
      res.status(500).json({
        ok: false,
        error: userMessage || "Swap creation failed"
      });
    }
  });

  app.get("/api/v1/swap/:exchangeId", validateApiKey, async (req: AuthenticatedRequest, res) => {
    try {
      if (!simpleSwapClient) {
        return res.status(503).json({
          ok: false,
          error: "Exchange service unavailable"
        });
      }

      const { exchangeId } = req.params;
      console.log(`[API v1] Fetching swap status for developer ${req.developerId}:`, exchangeId);

      const exchange = await simpleSwapClient.getExchange(exchangeId);

      res.json({
        ok: true,
        orderId: exchange.id,
        status: exchange.status,
        amountFrom: exchange.amountFrom,
        amountTo: exchange.amountTo,
        addressFrom: exchange.addressFrom,
        addressTo: exchange.addressTo,
        txFrom: exchange.transactionFrom,
        txTo: exchange.transactionTo
      });
    } catch (error: any) {
      console.error("[API v1] Swap status error:", error);
      
      // Sanitize error message - remove third-party service references
      let userMessage = error.message
        ?.replace(/SimpleSwap/gi, 'exchange service')
        ?.replace(/simpleswap\.io/gi, 'exchange service')
        ?.replace(/Replit/gi, 'platform')
        ?.replace(/replit\.app/gi, 'platform');
      
      res.status(500).json({
        ok: false,
        error: userMessage || "Failed to fetch swap status"
      });
    }
  });

  // ========================================
  // GIFT CARD ROUTES
  // ========================================

  app.get("/api/giftcards/catalog", async (req, res) => {
    try {
      // REAL MODE: Fetch actual products from Reloadly
      console.log(`🎁 [REAL] Fetching gift card catalog from Reloadly...`);
      
      const reloadlyClient = getReloadlyClient();
      
      // Get all available products
      const allProducts = await reloadlyClient.getProducts(1, 200);
      console.log(`📦 Fetched ${allProducts.length} products from Reloadly`);
      
      // Transform to catalog format
      const catalog = allProducts
        .filter(p => {
          // Only include products with fixed denominations or valid range
          return (p.denominationType === 'FIXED' && p.fixedRecipientDenominations?.length > 0) ||
                 (p.denominationType === 'RANGE' && p.minRecipientDenomination && p.maxRecipientDenomination);
        })
        .map(p => {
          // Map country codes to flags
          const countryFlags: Record<string, string> = {
            'US': '🇺🇸', 'UK': '🇬🇧', 'GB': '🇬🇧', 'DE': '🇩🇪', 'FR': '🇫🇷',
            'IT': '🇮🇹', 'ES': '🇪🇸', 'CA': '🇨🇦', 'AU': '🇦🇺', 'AT': '🇦🇹',
            'NL': '🇳🇱', 'BE': '🇧🇪', 'SE': '🇸🇪', 'NO': '🇳🇴', 'DK': '🇩🇰',
            'FI': '🇫🇮', 'PL': '🇵🇱', 'PT': '🇵🇹', 'IE': '🇮🇪', 'CH': '🇨🇭'
          };
          
          // Determine icon based on category/brand
          let icon = 'shopping-bag';
          const brandLower = p.brand.brandName.toLowerCase();
          if (brandLower.includes('google') || brandLower.includes('play')) icon = 'smartphone';
          else if (brandLower.includes('game') || brandLower.includes('xbox') || brandLower.includes('playstation')) icon = 'gamepad-2';
          else if (brandLower.includes('spotify') || brandLower.includes('music') || brandLower.includes('itunes')) icon = 'music';
          
          // Get denominations
          let denominations: number[] = [];
          if (p.denominationType === 'FIXED' && p.fixedRecipientDenominations) {
            denominations = p.fixedRecipientDenominations.slice(0, 6); // Limit to 6
          } else if (p.denominationType === 'RANGE') {
            // Generate sample denominations for range products
            const min = p.minRecipientDenomination || 10;
            const max = p.maxRecipientDenomination || 100;
            denominations = [min, Math.floor((min + max) / 2), max];
          }
          
          return {
            id: `reloadly_${p.productId}`,
            productId: p.productId,
            name: p.brand.brandName,
            description: p.productName,
            category: p.productCategory || p.brand.brandName,
            icon,
            imageUrl: p.logoUrls?.[0] || undefined,
            country: p.countryCode,
            countryCode: p.countryCode,
            countryFlag: countryFlags[p.countryCode] || '🌍',
            denominations,
            popular: ['Amazon', 'Google Play', 'iTunes', 'Spotify', 'Netflix'].some(brand => 
              p.brand.brandName.includes(brand)
            ),
            unitPrice: p.unitPrice,
            currency: p.currencyCode
          };
        })
        // Sort: popular first, then by brand name
        .sort((a, b) => {
          if (a.popular && !b.popular) return -1;
          if (!a.popular && b.popular) return 1;
          return a.name.localeCompare(b.name);
        });
      
      console.log(`✅ Catalog ready: ${catalog.length} gift cards`);
      
      res.json({
        ok: true,
        catalog,
        mode: 'production'
      });
    } catch (error: any) {
      console.error("Get gift card catalog error:", error);
      res.status(500).json({ ok: false, error: "Failed to fetch catalog" });
    }
  });

  // Get Semaphore group members for proof generation
  // Accepts optional zkCommitment parameter to ensure user's commitment is in group
  app.get("/api/giftcards/group", async (req, res) => {
    try {
      const { zkCommitment } = req.query;
      
      // If commitment provided, ensure it's in the group
      if (zkCommitment && typeof zkCommitment === 'string') {
        const commitmentBigInt = BigInt(zkCommitment);
        const isInGroup = semaphoreGroup.members.some(m => m === commitmentBigInt);
        
        if (!isInGroup) {
          // Commitment not in memory - check database and reload if exists
          console.log(`⚠️ [GIFT-CARD-GROUP] Commitment ${zkCommitment} not in memory, checking database...`);
          
          const orders = await storage.getGiftCardOrdersByCommitment(zkCommitment);
          const order = orders.length > 0 ? orders[0] : null;
          if (order) {
            // Order exists in DB, add to group
            semaphoreGroup.addMember(commitmentBigInt);
            console.log(`✅ [GIFT-CARD-GROUP] Reloaded commitment ${zkCommitment} from database`);
          } else {
            // Commitment doesn't exist anywhere - user error
            return res.status(404).json({ 
              ok: false, 
              error: "No gift card found for this identity. Please check your passkey." 
            });
          }
        }
      }
      
      const members = semaphoreGroup.members.map((m: bigint) => m.toString());
      res.json({ 
        ok: true, 
        members,
        groupId: Number(GROUP_ID)
      });
    } catch (error: any) {
      console.error("Get gift card group error:", error);
      res.status(500).json({ ok: false, error: "Failed to fetch group" });
    }
  });

  app.post("/api/giftcards/order", async (req, res) => {
    try {
      const { giftCardType, denomination, currency } = req.body;
      
      if (!giftCardType || !denomination || !currency) {
        return res.status(400).json({ ok: false, error: "Missing required fields" });
      }

      // Generate ZK identity for anonymous gift card ownership
      const identity = new Identity();
      const zkCommitment = identity.commitment.toString();
      const giftCardSecret = identity.toString();

      // Create unique order ID
      const orderId = crypto.randomUUID();

      // Check if simpleSwapClient is available
      if (!simpleSwapClient) {
        return res.status(500).json({ 
          ok: false, 
          error: "Exchange service not available" 
        });
      }

      // Create exchange for gift card payment
      const exchange = await simpleSwapClient.createExchange({
        currencyFrom: currency.toLowerCase(),
        currencyTo: 'usd',
        amountFrom: denomination.toString(),
        addressTo: walletService.getEVMAddress(), // Operator wallet receives USD
      });

      if (!exchange || !exchange.addressFrom) {
        return res.status(500).json({ 
          ok: false, 
          error: "Failed to create exchange. Please try again." 
        });
      }

      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Create gift card order in database
      const order = await storage.createGiftCardOrder(
        orderId,
        giftCardType,
        denomination,
        denomination, // priceUSD
        currency,
        parseFloat(exchange.amountFrom || '0'),
        exchange.addressFrom, // depositAddress
        zkCommitment,
        expiresAt,
        exchange.id // exchangeId
      );

      // Add commitment to Semaphore group
      try {
        const commitmentBigInt = BigInt(zkCommitment);
        semaphoreGroup.addMember(commitmentBigInt);
        console.log(`✅ [GIFT-CARD-ORDER] Added commitment to Semaphore group (${semaphoreGroup.members.length} total)`);
      } catch (error) {
        console.error(`⚠️ [GIFT-CARD-ORDER] Failed to add commitment to group:`, error);
      }

      console.log(`🎁 Gift card order created: ${orderId} - ${giftCardType} $${denomination}`);

      res.json({
        ok: true,
        order: {
          orderId,
          giftCardType,
          denomination,
          priceUSD: denomination,
          currency,
          amountCrypto: parseFloat(exchange.amountFrom || '0'),
          depositAddress: exchange.addressFrom,
          expiresAt,
          paymentStatus: 'pending',
          zkCommitment,
          giftCardSecret,
          exchangeId: exchange.id
        }
      });
    } catch (error: any) {
      console.error("Create gift card order error:", error);
      res.status(500).json({ ok: false, error: "Failed to create order" });
    }
  });

  app.get("/api/giftcards/order/:orderId", async (req, res) => {
    try {
      const { orderId } = req.params;

      const order = await storage.getGiftCardOrder(orderId);

      if (!order) {
        return res.status(404).json({ ok: false, error: "Order not found" });
      }

      res.json({
        ok: true,
        order: {
          orderId: order.orderId,
          giftCardType: order.giftCardType,
          denomination: order.denomination,
          priceUSD: order.priceUSD,
          currency: order.currency,
          amountCrypto: order.amountCrypto,
          depositAddress: order.depositAddress,
          paymentStatus: order.paymentStatus,
          orderStatus: order.orderStatus,
          expiresAt: order.expiresAt,
          createdAt: order.createdAt,
          paidAt: order.paidAt,
          deliveredAt: order.deliveredAt
        }
      });
    } catch (error: any) {
      console.error("Get gift card order error:", error);
      res.status(500).json({ ok: false, error: "Failed to fetch order" });
    }
  });

  app.post("/api/giftcards/verify-and-get", async (req, res) => {
    try {
      const { proof, signal, zkCommitment } = req.body;

      if (!proof || !signal || !zkCommitment) {
        return res.status(400).json({ ok: false, error: "Missing required fields" });
      }

      // Verify ZK proof
      try {
        const fullProof = {
          ...proof,
          merkleTreeDepth: semaphoreGroup.depth,
          merkleTreeRoot: semaphoreGroup.root
        };

        await verifyProof(fullProof);
      } catch (error) {
        console.error("ZK proof verification failed:", error);
        return res.status(401).json({ ok: false, error: "Invalid proof" });
      }

      // Get all delivered gift cards for this commitment
      const orders = await storage.getGiftCardOrdersByCommitment(zkCommitment);
      
      // Filter only delivered orders
      const deliveredOrders = orders.filter(o => o.orderStatus === 'delivered' && o.cardNumber);

      if (deliveredOrders.length === 0) {
        return res.status(404).json({ 
          ok: false, 
          error: "No delivered gift cards found for this identity" 
        });
      }

      res.json({
        ok: true,
        cards: deliveredOrders.map(order => ({
          orderId: order.orderId,
          giftCardType: order.giftCardType,
          denomination: order.denomination,
          cardNumber: order.cardNumber,
          cardPin: order.cardPin,
          redeemInstructions: order.redeemInstructions,
          deliveredAt: order.deliveredAt
        }))
      });
    } catch (error: any) {
      console.error("Verify and get gift cards error:", error);
      res.status(500).json({ ok: false, error: "Failed to retrieve gift cards" });
    }
  });

  app.post("/api/giftcards/my-cards", async (req, res) => {
    try {
      const { zkCommitment } = req.body;

      if (!zkCommitment) {
        return res.status(400).json({ ok: false, error: "Missing ZK commitment" });
      }

      // Get all delivered gift cards for this commitment
      const cards = await storage.getGiftCardOrdersByCommitment(zkCommitment);

      res.json({
        ok: true,
        cards: cards.map(card => ({
          orderId: card.orderId,
          giftCardType: card.giftCardType,
          denomination: card.denomination,
          giftCardCode: card.giftCardCode,
          giftCardUrl: card.giftCardUrl,
          deliveredAt: card.deliveredAt,
          createdAt: card.createdAt
        }))
      });
    } catch (error: any) {
      console.error("Get my gift cards error:", error);
      res.status(500).json({ ok: false, error: "Failed to fetch gift cards" });
    }
  });

  // TEST RELOADLY ACCOUNT STATUS
  app.get("/api/giftcards/test-reloadly", async (req, res) => {
    try {
      const reloadlyClient = getReloadlyClient();
      
      console.log("🧪 Testing Reloadly account...");
      
      // Test 1: Get balance
      const balance = await reloadlyClient.getBalance();
      console.log("💰 Balance:", balance);
      
      // Test 2: Get all products (paginated)
      const allProducts = await reloadlyClient.getProducts(1, 200);
      console.log(`📦 Total products available: ${allProducts.length}`);
      
      // Test 3: Get US products specifically
      const usProducts = await reloadlyClient.getProductsByCountry('US');
      console.log(`📦 US products: ${usProducts.length}`);
      
      // Test 4: Try specific product IDs
      const testProduct = await reloadlyClient.getProduct(10);
      console.log("🧪 Test product ID 10:", testProduct?.productName || "Not found");
      
      res.json({
        ok: true,
        balance,
        totalProducts: allProducts.length,
        usProducts: usProducts.length,
        testProduct: testProduct ? {
          id: testProduct.productId,
          name: testProduct.productName,
          brand: testProduct.brand.brandName
        } : null,
        sampleProducts: allProducts.slice(0, 5).map(p => ({
          id: p.productId,
          name: p.productName,
          brand: p.brand.brandName,
          country: p.countryCode
        }))
      });
    } catch (error: any) {
      console.error("❌ Reloadly test failed:", error);
      res.status(500).json({
        ok: false,
        error: error.message
      });
    }
  });

  // MOCK PAYMENT ENDPOINT FOR GIFT CARDS (DEMO MODE ONLY)
  app.post("/api/giftcards/mock-payment/:orderId", async (req, res) => {
    try {
      const { orderId } = req.params;
      
      console.log(`🎨 [MOCK] Marking gift card order as paid: ${orderId}`);
      
      const order = await storage.getGiftCardOrder(orderId);
      if (!order) {
        return res.status(404).json({ ok: false, error: "Order not found" });
      }

      // Generate mock card details based on gift card type
      const cardDetails = generateMockCardDetails(order.giftCardType, order.denomination);

      // Update payment status
      await storage.updateGiftCardOrderPayment(orderId, 'paid');
      
      // Update delivery with mock card details
      await storage.updateGiftCardDelivery(
        orderId,
        cardDetails.cardNumber,
        cardDetails.cardPin,
        cardDetails.redeemInstructions
      );
      
      // Update order status to delivered
      await storage.updateGiftCardOrderStatus(orderId, null, {
        orderStatus: 'delivered',
        deliveredAt: new Date()
      });

      console.log(`✅ [MOCK] Gift card order marked as paid and delivered: ${orderId}`);

      res.json({
        ok: true,
        message: "Payment marked as received. Gift card delivered!",
        order: {
          ...order,
          paymentStatus: 'paid',
          orderStatus: 'delivered',
          paidAt: new Date(),
          deliveredAt: new Date(),
          cardNumber: cardDetails.cardNumber,
          cardPin: cardDetails.cardPin,
          redeemInstructions: cardDetails.redeemInstructions
        }
      });
    } catch (error: any) {
      console.error("Mock payment error:", error);
      res.status(500).json({ ok: false, error: "Failed to process mock payment" });
    }
  });

  // ===== TWITTER ANONYMOUS POSTING ROUTES =====

  // Generate nonce for ZK proof
  app.get("/api/twitter/session/nonce", async (req, res) => {
    try {
      const nonce = zkSessionService.generateNonce();
      res.json({ nonce });
    } catch (error: any) {
      console.error("❌ Failed to generate nonce:", error);
      res.status(500).json({ ok: false, error: error.message });
    }
  });

  // Verify ZK proof and mint session JWT
  app.post("/api/twitter/session/verify", async (req, res) => {
    try {
      const { proof, commitment, nonce } = req.body;

      if (!proof || !commitment || !nonce) {
        return res.status(400).json({ ok: false, error: "Missing required fields" });
      }

      // Verify proof and mint session
      const zkSession = await zkSessionService.verifyProofAndMintSession(
        proof,
        commitment,
        nonce
      );

      // Ensure user exists in database
      try {
        await db.insert(zkTwitterUsers).values({
          commitment,
          reputationScore: 0,
          banned: false,
        }).onConflictDoNothing();
      } catch (error) {
        console.error("⚠️ Failed to create user record (may already exist):", error);
      }

      res.json({
        ok: true,
        zkSession,
        sub: `zk:${commitment}`,
      });
    } catch (error: any) {
      console.error("❌ Session verification failed:", error);
      res.status(401).json({ ok: false, error: error.message });
    }
  });

  // Post tweet anonymously with ZK proof
  app.post("/api/twitter/tweet", async (req, res) => {
    try {
      const authHeader = req.headers.authorization || "";
      const token = authHeader.replace("Bearer ", "");

      if (!token) {
        return res.status(401).json({ ok: false, error: "No session token provided" });
      }

      // Verify session
      const session = await zkSessionService.verifySession(token);
      const commitment = zkSessionService.extractCommitment(session);

      // Check if user is banned
      const user = await db
        .select()
        .from(zkTwitterUsers)
        .where(eq(zkTwitterUsers.commitment, commitment))
        .limit(1);

      if (user.length && user[0].banned) {
        return res.status(403).json({ ok: false, error: "User is banned" });
      }

      const { text, replyToTweetId } = req.body;

      if (!text || text.length === 0) {
        return res.status(400).json({ ok: false, error: "Tweet text is required" });
      }

      if (text.length > 280) {
        return res.status(400).json({ ok: false, error: "Tweet text too long (max 280 characters)" });
      }

      // Generate proof hash from session nonce
      const proofHash = session.nonce.slice(0, 8);

      // Add proof tag to tweet
      const tweetText = `${text} (zk:${proofHash})`;

      // Post tweet via Twitter OAuth service
      const tweet = await twitterOAuthService.postTweet(tweetText, replyToTweetId);

      // Store action in database
      await db.insert(zkTwitterActions).values({
        commitment,
        kind: replyToTweetId ? 'reply' : 'tweet',
        content: text,
        replyToTweetId: replyToTweetId || null,
        proofHash,
        status: 'posted',
        tweetId: tweet.id,
      });

      res.json({
        ok: true,
        tweetId: tweet.id,
        proofHash,
        text: tweet.text,
      });
    } catch (error: any) {
      console.error("❌ Failed to post tweet:", error);
      res.status(500).json({ ok: false, error: error.message });
    }
  });

  // Get user's tweet history
  app.get("/api/twitter/my-actions", async (req, res) => {
    try {
      const authHeader = req.headers.authorization || "";
      const token = authHeader.replace("Bearer ", "");

      if (!token) {
        return res.status(401).json({ ok: false, error: "No session token provided" });
      }

      // Verify session
      const session = await zkSessionService.verifySession(token);
      const commitment = zkSessionService.extractCommitment(session);

      // Get user's actions
      const actions = await db
        .select()
        .from(zkTwitterActions)
        .where(eq(zkTwitterActions.commitment, commitment))
        .orderBy(desc(zkTwitterActions.createdAt))
        .limit(50);

      res.json({ ok: true, actions });
    } catch (error: any) {
      console.error("❌ Failed to get actions:", error);
      res.status(500).json({ ok: false, error: error.message });
    }
  });

  // OAuth: Start authorization flow (admin only, one-time setup)
  app.get("/api/twitter/oauth/authorize", async (req, res) => {
    try {
      const { url, state } = await twitterOAuthService.getAuthorizationUrl();
      res.redirect(url);
    } catch (error: any) {
      console.error("❌ OAuth authorization failed:", error);
      res.status(500).json({ ok: false, error: error.message });
    }
  });

  // OAuth: Handle callback from Twitter
  app.get("/api/twitter/oauth/callback", async (req, res) => {
    try {
      const { code, state } = req.query;

      if (!code || !state) {
        return res.status(400).send("Missing code or state parameter");
      }

      const tokens = await twitterOAuthService.exchangeCodeForTokens(
        code as string,
        state as string
      );

      const userInfo = await twitterOAuthService.getUserInfo(tokens.access_token);

      res.send(`
        <html>
          <head><title>Authorization Successful</title></head>
          <body style="font-family: system-ui; max-width: 600px; margin: 100px auto; padding: 20px;">
            <h1>✅ Authorization Successful!</h1>
            <p>Bot account <strong>@${userInfo.username}</strong> is now authorized.</p>
            <p>You can now close this window and start accepting anonymous tweets.</p>
            <p style="margin-top: 40px; padding: 15px; background: #f0f0f0; border-radius: 8px;">
              <strong>Note:</strong> This authorization should only be done once during initial setup.
            </p>
          </body>
        </html>
      `);
    } catch (error: any) {
      console.error("❌ OAuth callback failed:", error);
      res.status(500).send(`Authorization failed: ${error.message}`);
    }
  });

  // ===== BUG REPORT ROUTES =====

  // Submit a bug report
  app.post("/api/bugs", async (req, res) => {
    try {
      const { twitterHandle, bugDescription } = req.body;

      if (!bugDescription || bugDescription.trim().length === 0) {
        return res.status(400).json({ ok: false, error: "Bug description is required" });
      }

      if (bugDescription.length > 5000) {
        return res.status(400).json({ ok: false, error: "Bug description too long (max 5000 characters)" });
      }

      // Check for duplicate (case-insensitive exact match)
      const normalizedDescription = bugDescription.trim().toLowerCase();
      const existingBugs = await db
        .select()
        .from(bugReports)
        .where(sql`LOWER(TRIM(${bugReports.bugDescription})) = ${normalizedDescription}`)
        .limit(1);

      if (existingBugs.length > 0) {
        return res.status(409).json({ 
          ok: false, 
          error: "This bug has already been reported. Check the bug list.",
          duplicateId: existingBugs[0].id
        });
      }

      // Insert new bug report
      const [newBug] = await db.insert(bugReports).values({
        twitterHandle: twitterHandle?.trim() || null,
        bugDescription: bugDescription.trim(),
        status: 'new',
      }).returning();

      res.json({ ok: true, bug: newBug });
    } catch (error: any) {
      console.error("❌ Failed to submit bug report:", error);
      res.status(500).json({ ok: false, error: error.message });
    }
  });

  // Get all bug reports (with optional status filter)
  app.get("/api/bugs", async (req, res) => {
    try {
      const { status } = req.query;

      let bugs;
      
      if (status && typeof status === 'string' && ['new', 'in_progress', 'fixed'].includes(status)) {
        bugs = await db.select()
          .from(bugReports)
          .where(eq(bugReports.status, status as any))
          .orderBy(desc(bugReports.createdAt));
      } else {
        bugs = await db.select()
          .from(bugReports)
          .orderBy(desc(bugReports.createdAt));
      }

      res.json({ ok: true, bugs });
    } catch (error: any) {
      console.error("❌ Failed to get bug reports:", error);
      res.status(500).json({ ok: false, error: error.message });
    }
  });

  // Update bug status (admin only)
  app.patch("/api/bugs/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { status, adminPassword } = req.body;

      // Admin password check
      const correctPassword = process.env.ADMIN_PASSWORD || "zekta2025";
      if (adminPassword !== correctPassword) {
        return res.status(401).json({ ok: false, error: "Unauthorized: Invalid admin password" });
      }

      // Validate status
      if (!status || !['new', 'in_progress', 'fixed'].includes(status)) {
        return res.status(400).json({ ok: false, error: "Invalid status. Must be 'new', 'in_progress', or 'fixed'" });
      }

      // Update bug status
      const result = await db
        .update(bugReports)
        .set({ status })
        .where(eq(bugReports.id, parseInt(id)))
        .returning();

      if (result.length === 0) {
        return res.status(404).json({ ok: false, error: "Bug report not found" });
      }

      res.json({ ok: true, bug: result[0] });
    } catch (error: any) {
      console.error("❌ Failed to update bug status:", error);
      res.status(500).json({ ok: false, error: error.message });
    }
  });

  // Delete bug report (admin only)
  app.delete("/api/bugs/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { adminPassword } = req.body;

      // Admin password check
      const correctPassword = process.env.ADMIN_PASSWORD || "zekta2025";
      if (adminPassword !== correctPassword) {
        return res.status(401).json({ ok: false, error: "Unauthorized: Invalid admin password" });
      }

      // Delete bug report
      const result = await db
        .delete(bugReports)
        .where(eq(bugReports.id, parseInt(id)))
        .returning();

      if (result.length === 0) {
        return res.status(404).json({ ok: false, error: "Bug report not found" });
      }

      res.json({ ok: true, message: "Bug report deleted successfully" });
    } catch (error: any) {
      console.error("❌ Failed to delete bug report:", error);
      res.status(500).json({ ok: false, error: error.message });
    }
  });

  // Initialize x402 client with operator wallet
  const x402Client = process.env.EVM_HOT_WALLET_KEY 
    ? new X402Client(process.env.EVM_HOT_WALLET_KEY)
    : null;

  // x402 Marketplace Routes
  app.get("/api/x402/services", async (req, res) => {
    try {
      // Fetch real services from OFFICIAL Coinbase x402 Bazaar
      const response = await fetch('https://bazaar.x402.org/list');
      
      if (!response.ok) {
        throw new Error(`x402 Bazaar API returned ${response.status}`);
      }
      
      const bazaarData = await response.json();
      const x402Services = bazaarData.services || bazaarData;
      
      // Log response shape for debugging
      console.log(`✅ Fetched ${x402Services.length} services from x402 Bazaar (Official Coinbase API)`);
      if (x402Services.length > 0) {
        console.log('Sample service structure:', JSON.stringify(x402Services[0], null, 2).substring(0, 500));
      }
      
      // Transform to our frontend format
      let services = x402Services.map((service: any, index: number) => ({
        id: index + 1,
        name: service.name || service.description?.split(':')[0] || 'Unnamed Service',
        description: service.description || 'No description available',
        category: categorizeService(service.name || service.description, service.capabilities?.join(', ') || ''),
        priceUSD: parseFloat(service.price?.replace('$', '') || service.accepts?.price || '0.001'),
        x402Endpoint: service.endpoint || service.url || '',
        logoUrl: service.logo_url || null,
        isActive: service.discoverable !== false,
      }));
      
      // Sort by popularity (popular services first)
      services = sortByPopularity(services);
      
      res.json({ ok: true, services });
    } catch (error: any) {
      console.error("❌ Failed to fetch x402 services:", error);
      // Fallback to database if Bazaar API is down
      try {
        let fallbackServices = await storage.getAllX402Services();
        // Sort fallback services by popularity too
        fallbackServices = sortByPopularity(fallbackServices);
        res.json({ ok: true, services: fallbackServices, source: 'fallback' });
      } catch (dbError) {
        res.status(500).json({ ok: false, error: error.message });
      }
    }
  });

  // ============================================================================
  // x402 zkID Authentication System
  // ============================================================================

  // Register new zkID user with Semaphore commitment
  app.post("/api/x402/auth/register", async (req, res) => {
    try {
      const { zkCommitment } = req.body;
      
      if (!zkCommitment) {
        return res.status(400).json({ ok: false, error: "zkCommitment required" });
      }

      // Check if user already exists
      const existingUser = await storage.getX402UserByCommitment(zkCommitment);
      if (existingUser) {
        return res.status(400).json({ ok: false, error: "User already registered" });
      }

      // Create new user
      const { id } = await storage.createX402User(zkCommitment);
      
      res.json({ 
        ok: true, 
        userId: id,
        message: "zkID registered successfully" 
      });

    } catch (error: any) {
      console.error("❌ zkID registration failed:", error);
      res.status(500).json({ ok: false, error: error.message });
    }
  });

  // Login with zkID commitment (simplified - no ZK proof verification yet)
  app.post("/api/x402/auth/login", async (req, res) => {
    try {
      const { zkCommitment } = req.body;
      
      if (!zkCommitment) {
        return res.status(400).json({ ok: false, error: "zkCommitment required" });
      }

      // Get user
      const user = await storage.getX402UserByCommitment(zkCommitment);
      if (!user) {
        return res.status(404).json({ ok: false, error: "User not found" });
      }

      res.json({ 
        ok: true, 
        user: {
          id: user.id,
          zkCommitment: user.zkCommitment,
          creditBalanceUSD: user.creditBalanceUSD,
          createdAt: user.createdAt
        }
      });

    } catch (error: any) {
      console.error("❌ zkID login failed:", error);
      res.status(500).json({ ok: false, error: error.message });
    }
  });

  // Get user info by commitment
  app.get("/api/x402/auth/me/:zkCommitment", async (req, res) => {
    try {
      const { zkCommitment } = req.params;
      
      const user = await storage.getX402UserByCommitment(zkCommitment);
      if (!user) {
        return res.status(404).json({ ok: false, error: "User not found" });
      }

      res.json({ ok: true, user });

    } catch (error: any) {
      console.error("❌ Failed to get user info:", error);
      res.status(500).json({ ok: false, error: error.message });
    }
  });

  // ============================================================================
  // x402 Credit Management System
  // ============================================================================

  // Top-up credits with dual payment options
  app.post("/api/x402/credits/topup", async (req, res) => {
    try {
      const { zkCommitment, amountUSD, paymentMethod, currency, amountCrypto, amountZekta } = req.body;
      
      if (!zkCommitment || !amountUSD || !paymentMethod) {
        return res.status(400).json({ ok: false, error: "Missing required fields" });
      }

      // Get user
      const user = await storage.getX402UserByCommitment(zkCommitment);
      if (!user) {
        return res.status(404).json({ ok: false, error: "User not found" });
      }

      // Create credit transaction
      const { id: txId } = await storage.createX402CreditTransaction(
        user.id,
        amountUSD,
        paymentMethod,
        currency || null,
        amountCrypto || null,
        amountZekta || null
      );

      // TODO: Process payment based on method
      // For now, simulate pending transaction
      
      res.json({ 
        ok: true, 
        transactionId: txId,
        status: 'pending',
        message: `Awaiting ${paymentMethod} payment confirmation...`
      });

    } catch (error: any) {
      console.error("❌ Credit top-up failed:", error);
      res.status(500).json({ ok: false, error: error.message });
    }
  });

  // Get transaction history
  app.get("/api/x402/credits/transactions/:zkCommitment", async (req, res) => {
    try {
      const { zkCommitment } = req.params;
      
      const user = await storage.getX402UserByCommitment(zkCommitment);
      if (!user) {
        return res.status(404).json({ ok: false, error: "User not found" });
      }

      const transactions = await storage.getX402CreditTransactions(user.id);
      
      res.json({ ok: true, transactions });

    } catch (error: any) {
      console.error("❌ Failed to get transactions:", error);
      res.status(500).json({ ok: false, error: error.message });
    }
  });

  // ============================================================================
  // x402 Service Purchase Flow
  // ============================================================================

  // Purchase x402 service with credits
  app.post("/api/x402/purchase/:serviceId", async (req, res) => {
    try {
      const { serviceId } = req.params;
      const { zkCommitment } = req.body;

      if (!zkCommitment) {
        return res.status(400).json({ ok: false, error: "zkCommitment required" });
      }

      // Get user
      const user = await storage.getX402UserByCommitment(zkCommitment);
      if (!user) {
        return res.status(404).json({ ok: false, error: "User not found" });
      }

      // Get service
      const service = await storage.getX402Service(parseInt(serviceId));
      if (!service) {
        return res.status(404).json({ ok: false, error: "Service not found" });
      }

      // Check balance
      if (user.creditBalanceUSD < service.priceUSD) {
        return res.status(400).json({ 
          ok: false, 
          error: "Insufficient credits",
          required: service.priceUSD,
          available: user.creditBalanceUSD
        });
      }

      // Create purchase
      const { id: purchaseId } = await storage.createX402Purchase(
        user.id,
        service.id,
        service.priceUSD
      );

      // Deduct credits
      await storage.updateX402UserBalance(
        user.id, 
        user.creditBalanceUSD - service.priceUSD
      );

      // Log purchase initiation
      await storage.createX402PurchaseLog(
        purchaseId,
        'info',
        'Purchase initiated',
        JSON.stringify({ service: service.name, price: service.priceUSD })
      );

      // TODO: Process x402 payment with x402Client
      // For now, simulate pending
      
      res.json({ 
        ok: true, 
        purchaseId,
        status: 'pending',
        message: "Processing x402 payment...",
        service: {
          name: service.name,
          price: service.priceUSD
        },
        newBalance: user.creditBalanceUSD - service.priceUSD
      });

    } catch (error: any) {
      console.error("❌ Purchase failed:", error);
      res.status(500).json({ ok: false, error: error.message });
    }
  });

  // Get purchase history
  app.get("/api/x402/purchases/:zkCommitment", async (req, res) => {
    try {
      const { zkCommitment } = req.params;
      
      const user = await storage.getX402UserByCommitment(zkCommitment);
      if (!user) {
        return res.status(404).json({ ok: false, error: "User not found" });
      }

      const purchases = await storage.getX402PurchasesByUser(user.id);
      
      res.json({ ok: true, purchases });

    } catch (error: any) {
      console.error("❌ Failed to get purchases:", error);
      res.status(500).json({ ok: false, error: error.message });
    }
  });
  
  // Helper function to sort services by popularity
  function sortByPopularity(services: any[]): any[] {
    const popularityScore = (service: any): number => {
      const name = service.name.toLowerCase();
      
      // Top-tier AI services (score 100+)
      if (name.includes('openai') || name.includes('gpt')) return 100;
      if (name.includes('claude') || name.includes('anthropic')) return 99;
      if (name.includes('gemini') || name.includes('google')) return 98;
      if (name.includes('stability') || name.includes('stable diffusion')) return 95;
      if (name.includes('elevenlabs')) return 94;
      if (name.includes('replicate')) return 93;
      
      // Popular specialized services (score 80-90)
      if (name.includes('midjourney')) return 90;
      if (name.includes('dall-e') || name.includes('dalle')) return 89;
      if (name.includes('whisper')) return 88;
      if (name.includes('cohere')) return 87;
      if (name.includes('hugging')) return 86;
      
      // Well-known tools (score 60-79)
      if (name.includes('firecrawl')) return 75;
      if (name.includes('apexti')) return 74;
      if (name.includes('daydreams')) return 73;
      if (name.includes('gloria')) return 72;
      
      // Others (score based on category)
      if (service.category === 'AI') return 50;
      if (service.category === 'Data') return 40;
      if (service.category === 'Web3') return 30;
      return 20;
    };
    
    return services.sort((a, b) => popularityScore(b) - popularityScore(a));
  }
  
  // Helper function to categorize services
  function categorizeService(name: string, description: string): string {
    const text = `${name} ${description}`.toLowerCase();
    if (text.includes('ai') || text.includes('llm') || text.includes('gpt') || text.includes('claude') || text.includes('gemini') || text.includes('intelligence')) {
      return 'AI';
    }
    if (text.includes('data') || text.includes('scraping') || text.includes('analytics') || text.includes('news')) {
      return 'Data';
    }
    if (text.includes('web3') || text.includes('blockchain') || text.includes('crypto') || text.includes('nft') || text.includes('defi')) {
      return 'Web3';
    }
    return 'Infrastructure';
  }
  
  // Helper function to extract price from x402 service
  function extractPrice(service: any): number {
    // x402 services have 'accepts' array with max_amount_required (snake_case)
    if (service.accepts && service.accepts.length > 0) {
      const firstAccept = service.accepts[0];
      // Try both snake_case and camelCase for compatibility
      const atomicAmount = parseInt(
        firstAccept.max_amount_required || 
        firstAccept.maxAmountRequired || 
        firstAccept.min_amount_required ||
        firstAccept.minAmountRequired ||
        '0'
      );
      
      if (atomicAmount > 0) {
        // Convert from atomic units (assume 6 decimals for USDC)
        return atomicAmount / 1000000; // USDC has 6 decimals
      }
    }
    
    // Fallback: try to extract from price field if exists
    if (service.price && typeof service.price === 'number') {
      return service.price;
    }
    
    return 0.01; // Default price
  }

  app.use(deployRouter);

  const httpServer = createServer(app);

  console.log("✓ Zekta API routes registered");
  console.log(`  Vault Address: ${vaultClient.vaultPda.toBase58()}`);
  console.log(`  Group ID: ${GROUP_ID.toString()}`);

  return httpServer;
}

