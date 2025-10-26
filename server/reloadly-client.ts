/**
 * Reloadly API Client
 * 
 * Manages gift card purchases via Reloadly API
 * - Amazon, Google Play gift cards
 * - Instant digital delivery
 * - Sandbox mode for testing
 */

interface ReloadlyProduct {
  productId: number;
  productName: string;
  countryCode: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  currencyCode: string;
  productCategory: string;
  brand: {
    brandId: number;
    brandName: string;
  };
  denominationType: 'FIXED' | 'RANGE';
  recipientCurrencyCode: string;
  minRecipientDenomination: number | null;
  maxRecipientDenomination: number | null;
  senderFee: number;
  discountPercentage: number;
  fixedRecipientDenominations: number[];
  logoUrls: string[];
  redeemInstruction: {
    concise: string;
    verbose: string;
  };
}

interface ReloadlyOrderRequest {
  productId: number;
  quantity: number;
  unitPrice: number;
  customIdentifier: string;
  senderName?: string;
  recipientEmail?: string;
}

interface ReloadlyOrderResponse {
  transactionId: number;
  amount: number;
  discount: number;
  currencyCode: string;
  fee: number;
  recipientEmail: string;
  customIdentifier: string;
  status: string;
  product: {
    productId: number;
    productName: string;
    countryCode: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  };
  smsFee: number;
  transactionCreatedTime: string;
}

interface ReloadlyCardInfo {
  cardNumber: string;
  pinCode: string;
}

export class ReloadlyClient {
  private clientId: string;
  private clientSecret: string;
  private baseUrl: string;
  private authUrl: string;
  private audience: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;
  private isSandbox: boolean;

  constructor(clientId?: string, clientSecret?: string, sandbox: boolean = true) {
    this.clientId = clientId || process.env.RELOADLY_CLIENT_ID || '';
    this.clientSecret = clientSecret || process.env.RELOADLY_CLIENT_SECRET || '';
    this.isSandbox = sandbox;
    
    // Sandbox vs Production URLs
    this.baseUrl = sandbox 
      ? 'https://giftcards-sandbox.reloadly.com'
      : 'https://giftcards.reloadly.com';
    
    this.audience = sandbox
      ? 'https://giftcards-sandbox.reloadly.com'
      : 'https://giftcards.reloadly.com';
    
    this.authUrl = 'https://auth.reloadly.com/oauth/token';
    
    console.log(`🎁 Reloadly Client initialized (${sandbox ? 'SANDBOX' : 'PRODUCTION'})`);
  }

  /**
   * Get OAuth access token (cached for 24 hours)
   */
  private async getAccessToken(): Promise<string> {
    // Return cached token if still valid
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await fetch(this.authUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'client_credentials',
          audience: this.audience,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Reloadly OAuth error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      
      // Token expires in 24 hours (86400 seconds), cache for 23 hours to be safe
      this.tokenExpiry = Date.now() + (23 * 60 * 60 * 1000);
      
      console.log(`✅ Reloadly access token obtained (expires in ${data.expires_in}s)`);
      return this.accessToken!;
    } catch (error: any) {
      console.error(`❌ Reloadly OAuth failed:`, error.message);
      throw error;
    }
  }

  /**
   * Make authenticated API request
   */
  private async makeRequest<T>(method: string, endpoint: string, body?: any): Promise<T> {
    const token = await this.getAccessToken();
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Reloadly API error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      return data as T;
    } catch (error: any) {
      console.error(`❌ Reloadly API request failed:`, error.message);
      throw error;
    }
  }

  /**
   * Get available products (gift cards catalog)
   */
  async getProducts(page: number = 1, size: number = 100): Promise<ReloadlyProduct[]> {
    try {
      const response = await this.makeRequest<any>(
        'GET',
        `/products?page=${page}&size=${size}`
      );
      return response.content || [];
    } catch (error) {
      console.error('Failed to get products:', error);
      return [];
    }
  }

  /**
   * Get product by ID
   */
  async getProduct(productId: number): Promise<ReloadlyProduct | null> {
    try {
      const product = await this.makeRequest<ReloadlyProduct>(
        'GET',
        `/products/${productId}`
      );
      return product;
    } catch (error) {
      console.error(`Failed to get product ${productId}:`, error);
      return null;
    }
  }

  /**
   * Get products by country
   */
  async getProductsByCountry(countryCode: string): Promise<ReloadlyProduct[]> {
    try {
      const response = await this.makeRequest<any>(
        'GET',
        `/countries/${countryCode}/products`
      );
      
      const products = response.content || [];
      console.log(`📦 Reloadly ${countryCode}: ${products.length} total products`);
      
      if (products.length > 0) {
        const brands = products.slice(0, 50).map((p: any) => p.brand.brandName);
        console.log(`📦 First 50 brands:`, brands.join(', '));
      }
      
      return products;
    } catch (error) {
      console.error(`Failed to get products for ${countryCode}:`, error);
      return [];
    }
  }

  /**
   * Get account balance
   */
  async getBalance(): Promise<{ balance: number; currencyCode: string } | null> {
    try {
      const response = await this.makeRequest<any>(
        'GET',
        '/accounts/balance'
      );
      return {
        balance: response.balance || 0,
        currencyCode: response.currencyCode || 'USD'
      };
    } catch (error) {
      console.error('Failed to get balance:', error);
      return null;
    }
  }

  /**
   * Create a gift card order
   */
  async createOrder(
    productId: number,
    quantity: number,
    unitPrice: number,
    customIdentifier: string,
    recipientEmail?: string
  ): Promise<ReloadlyOrderResponse | null> {
    try {
      const orderRequest: ReloadlyOrderRequest = {
        productId,
        quantity,
        unitPrice,
        customIdentifier,
        senderName: 'Zekta',
      };

      // Add email if provided
      if (recipientEmail) {
        orderRequest.recipientEmail = recipientEmail;
      }

      console.log(`🎁 Creating Reloadly order: Product ${productId} x${quantity} @ $${unitPrice}`);
      
      const response = await this.makeRequest<ReloadlyOrderResponse>(
        'POST',
        '/orders',
        orderRequest
      );

      console.log(`✅ Order created: Transaction ${response.transactionId}`);
      return response;
    } catch (error: any) {
      console.error(`❌ Failed to create gift card order:`, error.message);
      return null;
    }
  }

  /**
   * Get transaction details
   */
  async getTransaction(transactionId: number): Promise<ReloadlyOrderResponse | null> {
    try {
      const response = await this.makeRequest<ReloadlyOrderResponse>(
        'GET',
        `/reports/transactions/${transactionId}`
      );
      return response;
    } catch (error) {
      console.error(`Failed to get transaction ${transactionId}:`, error);
      return null;
    }
  }

  /**
   * Get redemption codes for a transaction
   */
  async getRedemptionCodes(transactionId: number): Promise<ReloadlyCardInfo[]> {
    try {
      const response = await this.makeRequest<any>(
        'GET',
        `/orders/transactions/${transactionId}/cards`
      );
      
      // Response is array of card objects
      if (Array.isArray(response)) {
        return response.map(card => ({
          cardNumber: card.cardNumber || '',
          pinCode: card.pinCode || card.pin || '',
        }));
      }
      
      return [];
    } catch (error) {
      console.error(`Failed to get redemption codes for ${transactionId}:`, error);
      return [];
    }
  }

  /**
   * Test get specific product by ID (from quickstart guide)
   */
  async testGetProductById(productId: number): Promise<void> {
    try {
      console.log(`🧪 Testing getProduct(${productId})...`);
      const product = await this.getProduct(productId);
      if (product) {
        console.log(`✅ Product found:`, {
          id: product.productId,
          name: product.productName,
          brand: product.brand.brandName,
          denominations: product.fixedRecipientDenominations || 'RANGE'
        });
      } else {
        console.log(`❌ Product ${productId} not found`);
      }
    } catch (error) {
      console.error(`❌ Error testing product ${productId}:`, error);
    }
  }

  /**
   * Get Amazon & Google Play products for US
   */
  async getPopularProducts(): Promise<ReloadlyProduct[]> {
    try {
      // Test direct product IDs from Reloadly quickstart docs
      console.log(`🧪 Testing known product IDs from Reloadly docs...`);
      await this.testGetProductById(10);  // Amazon US from quickstart
      await this.testGetProductById(5);   // Another Amazon from quickstart response
      await this.testGetProductById(1);   // First product
      
      // Get US products
      const products = await this.getProductsByCountry('US');
      
      // Filter for Amazon and Google Play
      const filtered = products.filter(p => {
        const name = p.productName.toLowerCase();
        const brand = p.brand.brandName.toLowerCase();
        return (
          name.includes('amazon') || 
          brand.includes('amazon') ||
          name.includes('google play') ||
          brand.includes('google play')
        );
      });

      console.log(`✅ Found ${filtered.length} Amazon/Google Play products`);
      return filtered;
    } catch (error) {
      console.error('Failed to get popular products:', error);
      return [];
    }
  }
}

// Singleton instance
let reloadlyClient: ReloadlyClient | null = null;

export function getReloadlyClient(): ReloadlyClient {
  if (!reloadlyClient) {
    // Use PRODUCTION mode by default (sandbox has no products)
    // Set RELOADLY_SANDBOX=true in env to force sandbox mode
    const isSandbox = process.env.RELOADLY_SANDBOX === 'true';
    reloadlyClient = new ReloadlyClient(undefined, undefined, isSandbox);
  }
  return reloadlyClient;
}
