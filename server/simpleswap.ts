interface Currency {
  symbol: string;
  name: string;
  network: string;
  hasExtraId: boolean;
  image: string;
  warnings?: string[];
}

interface SwapEstimate {
  estimatedAmount: string;
  rate: string;
}

interface CreateExchangeRequest {
  fixed: boolean;
  tickerFrom: string;
  tickerTo: string;
  networkFrom?: string;
  networkTo?: string;
  amount: string;
  addressTo: string;
  extraIdTo?: string;
  userRefundAddress?: string;
  userRefundExtraId?: string;
}

interface Exchange {
  id?: string;
  publicId?: string;
  status: string;
  currencyFrom?: string;
  currencyTo?: string;
  tickerFrom?: string;
  tickerTo?: string;
  networkFrom?: string;
  networkTo?: string;
  amountFrom: string;
  expectedAmount?: string;
  amountTo: string;
  addressFrom: string;
  addressTo: string;
  extraIdFrom?: string;
  extraIdTo?: string;
  transactionFrom?: string;
  transactionTo?: string;
  txFrom?: string;
  txTo?: string;
  hashOut?: string;
  createdAt: string;
  userRefundAddress?: string;
  userRefundExtraId?: string;
}

interface RangeResponse {
  min: string;
  max: string;
}

interface PairInfo {
  from: string;
  to: string;
  networkFrom?: string;
  networkTo?: string;
}

const SIMPLESWAP_API_BASE = "https://api.simpleswap.io";

// Cache configuration
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export class SimpleSwapClient {
  private apiKey: string;
  private estimateCache: Map<string, CacheEntry<any>> = new Map();
  private rangeCache: Map<string, CacheEntry<any>> = new Map();
  private currencyCache: CacheEntry<any> | null = null;
  private CACHE_TTL = 2 * 60 * 1000; // 2 minutes cache
  private CURRENCY_CACHE_TTL = 10 * 60 * 1000; // 10 minutes for currency list

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private getCacheKey(obj: any): string {
    return JSON.stringify(obj);
  }

  private isValidCache<T>(entry: CacheEntry<T> | null | undefined, ttl: number): boolean {
    if (!entry) return false;
    return Date.now() - entry.timestamp < ttl;
  }

  async getAllCurrencies(): Promise<Currency[]> {
    // Check cache first
    if (this.isValidCache(this.currencyCache, this.CURRENCY_CACHE_TTL)) {
      return this.currencyCache!.data;
    }

    const url = new URL(`${SIMPLESWAP_API_BASE}/v3/currencies`);
    url.searchParams.append('api_key', this.apiKey);

    const response = await fetch(url.toString());
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Exchange service error: ${error}`);
    }
    const data = await response.json();
    const result = data.result || data;
    
    // Cache result
    this.currencyCache = {
      data: result,
      timestamp: Date.now()
    };
    
    return result;
  }

  async getCurrency(ticker: string, network?: string): Promise<Currency> {
    const path = network ? `/v3/currencies/${ticker}/${network}` : `/v3/currencies/${ticker}`;
    const url = new URL(`${SIMPLESWAP_API_BASE}${path}`);
    url.searchParams.append('api_key', this.apiKey);

    const response = await fetch(url.toString());
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Exchange service error: ${error}`);
    }
    return response.json();
  }

  async getEstimate(params: {
    currencyFrom: string;
    currencyTo: string;
    amountFrom?: string;
    amountTo?: string;
  }): Promise<SwapEstimate> {
    // Check cache
    const cacheKey = this.getCacheKey(params);
    const cached = this.estimateCache.get(cacheKey);
    if (this.isValidCache(cached, this.CACHE_TTL)) {
      return cached!.data;
    }

    const url = new URL(`${SIMPLESWAP_API_BASE}/v3/estimates`);
    url.searchParams.append('api_key', this.apiKey);
    url.searchParams.append('currencyFrom', params.currencyFrom);
    url.searchParams.append('currencyTo', params.currencyTo);
    
    if (params.amountFrom) {
      url.searchParams.append('amountFrom', params.amountFrom);
    }
    if (params.amountTo) {
      url.searchParams.append('amountTo', params.amountTo);
    }

    const response = await fetch(url.toString());
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Exchange service error: ${error}`);
    }

    const result = await response.json();
    
    // Cache result
    this.estimateCache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });

    return result;
  }

  async getRange(currencyFrom: string, currencyTo: string): Promise<RangeResponse> {
    // Check cache
    const cacheKey = this.getCacheKey({ currencyFrom, currencyTo });
    const cached = this.rangeCache.get(cacheKey);
    if (this.isValidCache(cached, this.CACHE_TTL)) {
      return cached!.data;
    }

    const url = new URL(`${SIMPLESWAP_API_BASE}/v3/ranges`);
    url.searchParams.append('api_key', this.apiKey);
    url.searchParams.append('currencyFrom', currencyFrom);
    url.searchParams.append('currencyTo', currencyTo);

    const response = await fetch(url.toString());
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Exchange service error: ${error}`);
    }

    const result = await response.json();
    
    // Cache result
    this.rangeCache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });

    return result;
  }

  async getAllPairs(): Promise<PairInfo[]> {
    const url = new URL(`${SIMPLESWAP_API_BASE}/v3/pairs`);
    url.searchParams.append('api_key', this.apiKey);

    const response = await fetch(url.toString());
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Exchange service error: ${error}`);
    }

    return response.json();
  }

  async getPairsFrom(ticker: string, network?: string): Promise<string[]> {
    const path = network ? `/v3/pairs/${ticker}/${network}` : `/v3/pairs/${ticker}`;
    const url = new URL(`${SIMPLESWAP_API_BASE}${path}`);
    url.searchParams.append('api_key', this.apiKey);

    const response = await fetch(url.toString());
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Exchange service error: ${error}`);
    }

    return response.json();
  }

  async createExchange(params: CreateExchangeRequest): Promise<Exchange> {
    const response = await fetch(`${SIMPLESWAP_API_BASE}/v3/exchanges?api_key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Exchange service error: ${error}`);
    }

    const data = await response.json();
    // SimpleSwap v3 API wraps response in "result" object
    return data.result || data;
  }

  async getExchange(exchangeId: string): Promise<Exchange> {
    const url = new URL(`${SIMPLESWAP_API_BASE}/v3/exchanges/${exchangeId}`);
    url.searchParams.append('api_key', this.apiKey);

    const response = await fetch(url.toString());
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Exchange service error: ${error}`);
    }

    const data = await response.json();
    return data.result || data;
  }

  async getAllExchanges(): Promise<Exchange[]> {
    const url = new URL(`${SIMPLESWAP_API_BASE}/v3/exchanges`);
    url.searchParams.append('api_key', this.apiKey);

    const response = await fetch(url.toString());
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Exchange service error: ${error}`);
    }

    const data = await response.json();
    return data.result || data;
  }
}
