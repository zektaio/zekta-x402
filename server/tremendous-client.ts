/**
 * Tremendous API Client
 * 
 * Manages gift card purchases via Tremendous API
 * - Amazon, Google Play, Steam, Spotify gift cards
 * - Instant digital delivery
 * - Free API (only pay face value)
 */

interface TremendousProduct {
  id: string;
  name: string;
  category: string;
  currency_codes: string[];
  min_price_in_cents: number;
  max_price_in_cents: number;
}

interface TremendousOrderRequest {
  payment: {
    funding_source_id: string;
  };
  reward: {
    value: {
      denomination: number; // in dollars (will convert to cents)
      currency_code: string;
    };
    delivery: {
      method: string; // "LINK" for API delivery
    };
    products: string[]; // Product IDs like "AMAZON_US", "GOOGLE_PLAY_US"
  };
  external_id?: string; // Our order ID for tracking
}

interface TremendousOrderResponse {
  order: {
    id: string;
    external_id: string;
    status: string;
    created_at: string;
    rewards: Array<{
      id: string;
      order_id: string;
      value: {
        denomination: number;
        currency_code: string;
      };
      delivery: {
        method: string;
        status: string;
        link: string; // Gift card redemption URL
      };
      custom_fields: any[];
    }>;
  };
}

export class TremendousClient {
  private apiKey: string;
  private baseUrl: string;
  private fundingSourceId: string | null = null;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.TREMENDOUS_API_KEY || '';
    
    // Use sandbox for testing if no API key or if API key starts with TEST
    this.baseUrl = this.apiKey.startsWith('TEST') || !this.apiKey
      ? 'https://testflight.tremendous.com/api/v2'
      : 'https://www.tremendous.com/api/v2';
    
    console.log(`🎁 Tremendous Client initialized (${this.baseUrl.includes('testflight') ? 'SANDBOX' : 'PRODUCTION'})`);
  }

  private async makeRequest<T>(method: string, endpoint: string, body?: any): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Tremendous API error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      return data as T;
    } catch (error: any) {
      console.error(`❌ Tremendous API request failed:`, error.message);
      throw error;
    }
  }

  /**
   * Get available funding sources (required to place orders)
   */
  async getFundingSources(): Promise<any> {
    try {
      const response = await this.makeRequest<any>('GET', '/funding_sources');
      
      if (response.funding_sources && response.funding_sources.length > 0) {
        // Cache the first funding source ID
        this.fundingSourceId = response.funding_sources[0].id;
        console.log(`✅ Funding source: ${this.fundingSourceId}`);
      }
      
      return response.funding_sources || [];
    } catch (error) {
      console.error('Failed to get funding sources:', error);
      return [];
    }
  }

  /**
   * Get available products (gift card brands)
   */
  async getProducts(): Promise<TremendousProduct[]> {
    try {
      const response = await this.makeRequest<any>('GET', '/products');
      return response.products || [];
    } catch (error) {
      console.error('Failed to get products:', error);
      return [];
    }
  }

  /**
   * Create a gift card order
   */
  async createOrder(
    giftCardType: string,
    denomination: number,
    externalId: string
  ): Promise<TremendousOrderResponse | null> {
    try {
      // Ensure we have a funding source
      if (!this.fundingSourceId) {
        await this.getFundingSources();
      }

      if (!this.fundingSourceId) {
        throw new Error('No funding source available. Please add funds to your Tremendous account.');
      }

      // Map gift card type to Tremendous product ID
      const productId = this.getProductId(giftCardType);

      const orderRequest: TremendousOrderRequest = {
        payment: {
          funding_source_id: this.fundingSourceId,
        },
        reward: {
          value: {
            denomination: denomination,
            currency_code: 'USD',
          },
          delivery: {
            method: 'LINK', // API delivery (no email sent)
          },
          products: [productId],
        },
        external_id: externalId,
      };

      console.log(`🎁 Creating Tremendous order: ${giftCardType} $${denomination}`);
      
      const response = await this.makeRequest<TremendousOrderResponse>(
        'POST',
        '/orders',
        orderRequest
      );

      console.log(`✅ Order created: ${response.order.id}`);
      return response;
    } catch (error: any) {
      console.error(`❌ Failed to create gift card order:`, error.message);
      return null;
    }
  }

  /**
   * Get order status
   */
  async getOrder(orderId: string): Promise<TremendousOrderResponse | null> {
    try {
      const response = await this.makeRequest<TremendousOrderResponse>(
        'GET',
        `/orders/${orderId}`
      );
      return response;
    } catch (error) {
      console.error(`Failed to get order ${orderId}:`, error);
      return null;
    }
  }

  /**
   * Map our gift card type to Tremendous product ID
   */
  private getProductId(giftCardType: string): string {
    const mapping: Record<string, string> = {
      'amazon': 'AMAZON_US',
      'google_play': 'GOOGLE_PLAY_US',
      'steam': 'STEAM_WALLET',
      'spotify': 'SPOTIFY_US',
    };

    return mapping[giftCardType.toLowerCase()] || 'AMAZON_US';
  }

  /**
   * Extract gift card code/URL from order response
   */
  extractGiftCardInfo(orderResponse: TremendousOrderResponse): { code: string | null; url: string | null } {
    try {
      const reward = orderResponse.order.rewards[0];
      
      if (!reward || !reward.delivery) {
        return { code: null, url: null };
      }

      // Tremendous delivers via link
      const url = reward.delivery.link || null;
      
      // Note: Actual gift card code might be in the link content
      // For now, we'll store the redemption URL
      return { code: null, url };
    } catch (error) {
      console.error('Failed to extract gift card info:', error);
      return { code: null, url: null };
    }
  }
}

// Singleton instance
let tremendousClient: TremendousClient | null = null;

export function getTremendousClient(): TremendousClient {
  if (!tremendousClient) {
    tremendousClient = new TremendousClient();
  }
  return tremendousClient;
}
