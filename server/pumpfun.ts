interface DexScreenerPair {
  chainId: string;
  dexId: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceUsd: string;
  volume: {
    h24: number;
    h6: number;
    h1: number;
    m5: number;
  };
  priceChange: {
    h24: number;
  };
  liquidity: {
    usd: number;
  };
  fdv: number;
  marketCap: number;
  txns: {
    h24: {
      buys: number;
      sells: number;
    };
  };
}

interface DexScreenerResponse {
  schemaVersion: string;
  pairs: DexScreenerPair[];
}

interface CreatorStats {
  creatorRewards: number;
  volume24h: number;
  marketCap: number;
  tokenAddress: string;
  lastUpdated: number;
}

export class PumpFunService {
  private readonly tokenAddress = 'CA6DpicXuJUsSWziuV4oHmqpHTSMZLz9EGjYPyXJpump';
  private readonly dexscreenerApiUrl = 'https://api.dexscreener.com/latest/dex/tokens';
  private cache: {
    data: CreatorStats | null;
    timestamp: number;
  } = {
    data: null,
    timestamp: 0
  };
  private readonly cacheTimeout = 60000; // 1 minute cache

  async initialize(): Promise<void> {
    console.log('✅ PumpFun service initialized (Dexscreener real-time mode)');
    console.log(`📊 Fetching volume data from Dexscreener...`);
    
    const stats = await this.getCreatorStats();
    if (stats) {
      console.log(`💰 Current 24h volume: $${stats.volume24h.toFixed(2)}`);
      console.log(`💵 Creator rewards (0.2% of volume): $${stats.creatorRewards.toFixed(2)}`);
    }
  }

  async fetchDexscreenerData(): Promise<DexScreenerResponse | null> {
    try {
      const response = await fetch(`${this.dexscreenerApiUrl}/${this.tokenAddress}`);
      
      if (!response.ok) {
        console.error(`Dexscreener API error: ${response.status}`);
        return null;
      }

      const data: DexScreenerResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch Dexscreener data:', error);
      return null;
    }
  }

  async getCreatorStats(): Promise<CreatorStats | null> {
    const now = Date.now();
    
    if (this.cache.data && (now - this.cache.timestamp < this.cacheTimeout)) {
      return this.cache.data;
    }

    const dexData = await this.fetchDexscreenerData();
    
    if (!dexData || !dexData.pairs || dexData.pairs.length === 0) {
      console.log('⚠️ No Dexscreener data available, using cached/default values');
      return this.cache.data;
    }

    let totalVolume24h = 0;
    let highestMarketCap = 0;

    for (const pair of dexData.pairs) {
      if (pair.volume && pair.volume.h24) {
        totalVolume24h += pair.volume.h24;
      }
      if (pair.marketCap && pair.marketCap > highestMarketCap) {
        highestMarketCap = pair.marketCap;
      }
    }

    const creatorRewards = totalVolume24h * 0.002;

    const stats: CreatorStats = {
      creatorRewards,
      volume24h: totalVolume24h,
      marketCap: highestMarketCap,
      tokenAddress: this.tokenAddress,
      lastUpdated: now
    };

    this.cache = {
      data: stats,
      timestamp: now
    };

    return stats;
  }

  calculateRevenue(creatorStats: CreatorStats, platformVolumeUSD: number): {
    creatorRewards: number;
    platformRevenue: number;
    totalRevenue: number;
  } {
    const platformRevenue = platformVolumeUSD * 0.004; // 0.4% of platform fees
    
    return {
      creatorRewards: creatorStats.creatorRewards,
      platformRevenue,
      totalRevenue: creatorStats.creatorRewards + platformRevenue
    };
  }

}
