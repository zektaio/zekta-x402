interface PriceCache {
  price: number;
  timestamp: number;
}

const CACHE_TTL = 30000;
const priceCache = new Map<string, PriceCache>();

const TICKER_TO_COINGECKO_ID: Record<string, string> = {
  'btc': 'bitcoin',
  'eth': 'ethereum',
  'sol': 'solana',
  'usdt': 'tether',
  'usdc': 'usd-coin',
  'bnb': 'binancecoin',
  'xrp': 'ripple',
  'ada': 'cardano',
  'doge': 'dogecoin',
  'matic': 'matic-network',
  'dot': 'polkadot',
  'dai': 'dai',
  'trx': 'tron',
  'avax': 'avalanche-2',
  'link': 'chainlink',
  'atom': 'cosmos',
  'uni': 'uniswap',
  'ltc': 'litecoin',
  'etc': 'ethereum-classic',
  'xlm': 'stellar',
  'bch': 'bitcoin-cash',
  'wbtc': 'wrapped-bitcoin',
  'arb': 'arbitrum',
  'op': 'optimism',
};

export class PriceOracle {
  private baseUrl = 'https://api.coingecko.com/api/v3';

  private getCoinGeckoId(ticker: string): string | null {
    const normalizedTicker = ticker.toLowerCase().trim();
    return TICKER_TO_COINGECKO_ID[normalizedTicker] || null;
  }

  private getCachedPrice(coinId: string): number | null {
    const cached = priceCache.get(coinId);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > CACHE_TTL) {
      priceCache.delete(coinId);
      return null;
    }

    return cached.price;
  }

  private setCachedPrice(coinId: string, price: number): void {
    priceCache.set(coinId, {
      price,
      timestamp: Date.now()
    });
  }

  async getPrice(ticker: string): Promise<number | null> {
    try {
      const coinId = this.getCoinGeckoId(ticker);
      if (!coinId) {
        console.warn(`Price oracle: Unknown ticker "${ticker}"`);
        return null;
      }

      const cachedPrice = this.getCachedPrice(coinId);
      if (cachedPrice !== null) {
        return cachedPrice;
      }

      const url = `${this.baseUrl}/simple/price?ids=${coinId}&vs_currencies=usd`;
      const response = await fetch(url);

      if (!response.ok) {
        console.error(`Price oracle: CoinGecko API error ${response.status}`);
        return null;
      }

      const data = await response.json();
      const price = data[coinId]?.usd;

      if (typeof price !== 'number') {
        console.error(`Price oracle: Invalid price data for ${ticker}`);
        return null;
      }

      this.setCachedPrice(coinId, price);
      console.log(`✓ Fetched price: ${ticker.toUpperCase()} = $${price.toFixed(2)}`);

      return price;
    } catch (error: any) {
      console.error(`Price oracle: Failed to fetch price for ${ticker}:`, error.message);
      return null;
    }
  }

  async calculateVolumeUSD(amount: string, ticker: string): Promise<number> {
    const cryptoAmount = parseFloat(amount);
    if (isNaN(cryptoAmount) || cryptoAmount <= 0) {
      return 0;
    }

    if (ticker.toLowerCase() === 'usd') {
      return cryptoAmount;
    }

    const price = await this.getPrice(ticker);
    if (price === null) {
      console.warn(`Price oracle: Could not calculate volume for ${amount} ${ticker}`);
      return 0;
    }

    const volumeUSD = cryptoAmount * price;
    return volumeUSD;
  }

  async getPriceInEUR(ticker: string): Promise<number | null> {
    try {
      const coinId = this.getCoinGeckoId(ticker);
      if (!coinId) {
        console.warn(`Price oracle: Unknown ticker "${ticker}"`);
        return null;
      }

      const cacheKey = `${coinId}_eur`;
      const cachedPrice = this.getCachedPrice(cacheKey);
      if (cachedPrice !== null) {
        return cachedPrice;
      }

      const url = `${this.baseUrl}/simple/price?ids=${coinId}&vs_currencies=eur`;
      const response = await fetch(url);

      if (!response.ok) {
        console.error(`Price oracle: CoinGecko API error ${response.status}`);
        return null;
      }

      const data = await response.json();
      const price = data[coinId]?.eur;

      if (typeof price !== 'number') {
        console.error(`Price oracle: Invalid EUR price data for ${ticker}`);
        return null;
      }

      this.setCachedPrice(cacheKey, price);
      console.log(`✓ Fetched price: ${ticker.toUpperCase()} = €${price.toFixed(2)}`);

      return price;
    } catch (error: any) {
      console.error(`Price oracle: Failed to fetch EUR price for ${ticker}:`, error.message);
      return null;
    }
  }

  async calculateCryptoFromEUR(eurAmount: number, cryptoTicker: string): Promise<number | null> {
    const cryptoPriceInEUR = await this.getPriceInEUR(cryptoTicker);
    
    if (cryptoPriceInEUR === null || cryptoPriceInEUR <= 0) {
      console.error(`Failed to get ${cryptoTicker} price in EUR`);
      return null;
    }

    const cryptoAmount = eurAmount / cryptoPriceInEUR;
    console.log(`💰 Conversion: €${eurAmount.toFixed(2)} = ${cryptoAmount.toFixed(6)} ${cryptoTicker.toUpperCase()}`);
    
    return cryptoAmount;
  }
}

export const priceOracle = new PriceOracle();
