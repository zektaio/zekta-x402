import { Connection, PublicKey } from "@solana/web3.js";

const ZEKTA_TOKEN = "CA6DpicXuJUsSWziuV4oHmqpHTSMZLz9EGjYPyXJpump";
const TOTAL_SUPPLY = 1_000_000_000; // 1 billion ZEKTA
const MIN_ELIGIBLE_AMOUNT = 1; // Changed: Now minimum 1 token (was 10M)
const SOLANA_RPC = process.env.HELIUS_RPC_URL || "https://api.mainnet-beta.solana.com";

const EXCLUDED_WALLETS = new Set([
  "4YAcMZCs3n42KDxFeGDYhdyFWuz7G8iKrQfyG6WSyJ3r",
  "4VgwQnEiLNq1HRmdDiRos8gn2wwMzWUU83G1cTbhCSAy"
]);

// Tier thresholds - icons reference Lucide React icon names
export const TIER_THRESHOLDS = {
  BRONZE: { min: 1, max: 99_999, label: "Bronze", icon: "Medal" },
  SILVER: { min: 100_000, max: 499_999, label: "Silver", icon: "Award" },
  GOLD: { min: 500_000, max: 999_999, label: "Gold", icon: "Trophy" },
  DIAMOND: { min: 1_000_000, max: 1_999_999, label: "Diamond", icon: "Gem" },
  ELITE: { min: 2_000_000, max: 4_999_999, label: "Elite", icon: "Crown" },
  LEGEND: { min: 5_000_000, max: 9_999_999, label: "Legend", icon: "Rocket" },
  MASTER: { min: 10_000_000, max: 19_999_999, label: "Master", icon: "Flame" },
  WHALE: { min: 20_000_000, max: Infinity, label: "Whale", icon: "Zap" }
} as const;

export type TierType = keyof typeof TIER_THRESHOLDS;

export interface TierInfo {
  tier: TierType;
  label: string;
  icon: string;
}

export interface TokenHolder {
  address: string;
  amount: number;
  percentage: number;
  tier: TierInfo;
}

export interface EligibilityResult {
  eligible: boolean;
  holdings: number;
  percentage: number;
  minRequired: number;
  tier?: TierInfo;
}

export interface TierBreakdown {
  tier: TierType;
  label: string;
  icon: string;
  holderCount: number;
  totalTokens: number;
  percentageOfSupply: number;
}

export function getTierForAmount(amount: number): TierInfo {
  for (const [tierKey, tierData] of Object.entries(TIER_THRESHOLDS)) {
    if (amount >= tierData.min && amount <= tierData.max) {
      return {
        tier: tierKey as TierType,
        label: tierData.label,
        icon: tierData.icon
      };
    }
  }
  
  return {
    tier: "BRONZE",
    label: TIER_THRESHOLDS.BRONZE.label,
    icon: TIER_THRESHOLDS.BRONZE.icon
  };
}

export class HolderService {
  private cache: {
    eligibleHolders: TokenHolder[];
    totalEligibleAmount: number;
    tierBreakdown: TierBreakdown[];
    timestamp: number;
  } | null = null;
  
  private readonly CACHE_TTL = 3600000; // 1 hour
  private connection: Connection;

  constructor() {
    this.connection = new Connection(SOLANA_RPC, 'confirmed');
    const rpcProvider = process.env.HELIUS_RPC_URL ? 'Helius (Premium)' : 'Free Public RPC';
    console.log(`🔗 HolderService using: ${rpcProvider}`);
  }

  async checkEligibility(walletAddress: string): Promise<EligibilityResult> {
    try {
      const walletPubkey = new PublicKey(walletAddress);
      const tokenMintPubkey = new PublicKey(ZEKTA_TOKEN);
      
      const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(
        walletPubkey,
        { mint: tokenMintPubkey }
      );

      let holdings = 0;
      for (const account of tokenAccounts.value) {
        const accountInfo = account.account.data.parsed.info;
        const balance = parseFloat(accountInfo.tokenAmount.uiAmount) || 0;
        holdings += balance;
      }

      const percentage = (holdings / TOTAL_SUPPLY) * 100;
      const eligible = holdings >= MIN_ELIGIBLE_AMOUNT;
      const tier = eligible ? getTierForAmount(holdings) : undefined;

      return {
        eligible,
        holdings,
        percentage,
        minRequired: MIN_ELIGIBLE_AMOUNT,
        tier
      };
    } catch (error) {
      console.error('Error checking eligibility:', error);
      return {
        eligible: false,
        holdings: 0,
        percentage: 0,
        minRequired: MIN_ELIGIBLE_AMOUNT
      };
    }
  }

  async getEligibleHolders(): Promise<{ holders: TokenHolder[], totalAmount: number, tierBreakdown: TierBreakdown[] }> {
    const now = Date.now();
    
    if (this.cache && (now - this.cache.timestamp) < this.CACHE_TTL) {
      return {
        holders: this.cache.eligibleHolders,
        totalAmount: this.cache.totalEligibleAmount,
        tierBreakdown: this.cache.tierBreakdown
      };
    }

    try {
      if (process.env.HELIUS_RPC_URL) {
        return await this.getEligibleHoldersHelius();
      } else {
        return await this.getEligibleHoldersStandard();
      }
    } catch (error) {
      console.error('Error fetching eligible holders:', error);
      
      if (this.cache) {
        console.log('⚠️ Using cached holder data');
        return {
          holders: this.cache.eligibleHolders,
          totalAmount: this.cache.totalEligibleAmount,
          tierBreakdown: this.cache.tierBreakdown
        };
      }
      
      console.log('⚠️ RPC rate limited, returning empty data');
      return {
        holders: [],
        totalAmount: 0,
        tierBreakdown: []
      };
    }
  }

  private async getEligibleHoldersHelius(): Promise<{ holders: TokenHolder[], totalAmount: number, tierBreakdown: TierBreakdown[] }> {
    const now = Date.now();
    console.log('🔍 Fetching ALL token holders (≥1 token) via Helius DAS API...');
    
    const heliusUrl = process.env.HELIUS_RPC_URL!;
    let page = 1;
    let allHolders: Array<{ owner: string; amount: number }> = [];
    
    while (true) {
      const response = await fetch(heliusUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'helius-holders',
          method: 'getTokenAccounts',
          params: {
            mint: ZEKTA_TOKEN,
            page,
            limit: 1000
          }
        })
      });

      const data = await response.json();
      
      if (data.error || !data.result || !data.result.token_accounts) {
        console.log(`⚠️ Helius DAS API not available, falling back to standard method`);
        return await this.getEligibleHoldersStandard();
      }

      const accounts = data.result.token_accounts || [];
      
      for (const acc of accounts) {
        const amount = parseFloat(acc.amount) / Math.pow(10, acc.decimals || 6);
        if (amount >= MIN_ELIGIBLE_AMOUNT) {
          allHolders.push({
            owner: acc.owner,
            amount
          });
        }
      }

      if (accounts.length < 1000) break;
      page++;
      
      if (page > 100) {
        console.log('⚠️ Max pages reached (100), stopping pagination');
        break;
      }
    }

    console.log(`📊 Fetched ${allHolders.length} token accounts with ≥1 token via Helius`);

    const ownerMap = new Map<string, number>();
    for (const holder of allHolders) {
      const existing = ownerMap.get(holder.owner) || 0;
      ownerMap.set(holder.owner, existing + holder.amount);
    }

    const eligibleHolders: TokenHolder[] = [];
    let totalEligibleAmount = 0;

    for (const [address, amount] of ownerMap.entries()) {
      if (EXCLUDED_WALLETS.has(address)) {
        console.log(`🚫 Excluding wallet from distribution: ${address} (${amount.toLocaleString()} ZEKTA)`);
        continue;
      }
      
      totalEligibleAmount += amount;
      const percentage = (amount / TOTAL_SUPPLY) * 100;
      const tier = getTierForAmount(amount);
      
      eligibleHolders.push({
        address,
        amount,
        percentage,
        tier
      });
    }

    eligibleHolders.sort((a, b) => b.amount - a.amount);

    const tierBreakdown = this.calculateTierBreakdown(eligibleHolders);

    this.cache = {
      eligibleHolders,
      totalEligibleAmount,
      tierBreakdown,
      timestamp: now
    };

    console.log(`✅ Found ${eligibleHolders.length} eligible holders with total ${totalEligibleAmount.toLocaleString()} ZEKTA`);
    console.log(`📊 Tier breakdown: ${tierBreakdown.map(t => `${t.icon}${t.label}:${t.holderCount}`).join(', ')}`);

    return {
      holders: eligibleHolders,
      totalAmount: totalEligibleAmount,
      tierBreakdown
    };
  }

  private async getEligibleHoldersStandard(): Promise<{ holders: TokenHolder[], totalAmount: number, tierBreakdown: TierBreakdown[] }> {
    const now = Date.now();
    const tokenMintPubkey = new PublicKey(ZEKTA_TOKEN);
    
    console.warn('⚠️ WARNING: Standard RPC fallback ONLY returns top 20 holders!');
    console.warn('⚠️ This violates the inclusive ≥1 token requirement and skews revenue calculations.');
    console.warn('⚠️ Configure HELIUS_RPC_URL to fetch ALL holders for accurate distribution.');
    
    const largestAccounts = await this.connection.getTokenLargestAccounts(tokenMintPubkey);
    
    console.log(`📋 Fetched ${largestAccounts.value.length} token accounts from standard RPC (limited to top 20)`);
    
    const eligibleAccountsData = largestAccounts.value.filter(acc => {
      const amount = parseFloat(acc.uiAmount?.toString() || '0');
      return amount >= MIN_ELIGIBLE_AMOUNT;
    });

    if (eligibleAccountsData.length === 0) {
      console.log('⚠️ No eligible holders found');
      return { holders: [], totalAmount: 0, tierBreakdown: [] };
    }

    const accountAddresses = eligibleAccountsData.map(acc => acc.address);
    
    const rpcEndpoint = process.env.HELIUS_RPC_URL || "https://api.mainnet-beta.solana.com";
    const response = await fetch(rpcEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getMultipleAccounts',
        params: [
          accountAddresses.map(addr => addr.toBase58()),
          { encoding: 'jsonParsed' }
        ]
      })
    });

    const result = await response.json();
    const accountsInfo = result.result?.value || [];
    
    const eligibleHolders: TokenHolder[] = [];
    const ownerMap = new Map<string, number>();

    for (let i = 0; i < eligibleAccountsData.length; i++) {
      const amount = parseFloat(eligibleAccountsData[i].uiAmount?.toString() || '0');
      const accountInfo = accountsInfo[i];
      
      let ownerAddress = eligibleAccountsData[i].address.toBase58();
      
      if (accountInfo && accountInfo.data && accountInfo.data.parsed) {
        const parsed = accountInfo.data.parsed;
        if (parsed.info && parsed.info.owner) {
          ownerAddress = parsed.info.owner;
        }
      }
      
      const existing = ownerMap.get(ownerAddress) || 0;
      ownerMap.set(ownerAddress, existing + amount);
    }

    let totalEligibleAmount = 0;
    for (const [address, amount] of ownerMap.entries()) {
      if (EXCLUDED_WALLETS.has(address)) {
        console.log(`🚫 Excluding wallet from distribution: ${address} (${amount.toLocaleString()} ZEKTA)`);
        continue;
      }
      
      totalEligibleAmount += amount;
      const percentage = (amount / TOTAL_SUPPLY) * 100;
      const tier = getTierForAmount(amount);
      
      eligibleHolders.push({
        address,
        amount,
        percentage,
        tier
      });
    }

    const tierBreakdown = this.calculateTierBreakdown(eligibleHolders);

    this.cache = {
      eligibleHolders,
      totalEligibleAmount,
      tierBreakdown,
      timestamp: now
    };

    console.log(`✅ Found ${eligibleHolders.length} eligible holders (standard RPC) with total ${totalEligibleAmount.toLocaleString()} ZEKTA`);

    return {
      holders: eligibleHolders,
      totalAmount: totalEligibleAmount,
      tierBreakdown
    };
  }

  private calculateTierBreakdown(holders: TokenHolder[]): TierBreakdown[] {
    const breakdown = new Map<TierType, { count: number; total: number }>();
    
    for (const tierKey of Object.keys(TIER_THRESHOLDS) as TierType[]) {
      breakdown.set(tierKey, { count: 0, total: 0 });
    }
    
    for (const holder of holders) {
      const tierData = breakdown.get(holder.tier.tier)!;
      tierData.count++;
      tierData.total += holder.amount;
    }
    
    const result: TierBreakdown[] = [];
    for (const [tierKey, tierInfo] of Object.entries(TIER_THRESHOLDS)) {
      const data = breakdown.get(tierKey as TierType)!;
      result.push({
        tier: tierKey as TierType,
        label: tierInfo.label,
        icon: tierInfo.icon,
        holderCount: data.count,
        totalTokens: data.total,
        percentageOfSupply: (data.total / TOTAL_SUPPLY) * 100
      });
    }
    
    return result;
  }

  clearCache(): void {
    this.cache = null;
  }
}
