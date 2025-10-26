import { storage } from "./storage";
import { getReloadlyClient } from "./reloadly-client";

export class GiftCardProcessor {
  private processingInterval: NodeJS.Timeout | null = null;
  private isProcessing = false;
  private productCache: Map<string, any> = new Map();
  private lastCacheUpdate: number = 0;
  private CACHE_TTL = 60 * 60 * 1000; // 1 hour

  async start() {
    console.log("🎁 [GIFT-CARD-PROCESSOR] Starting gift card processor...");
    
    // Load product catalog on start
    await this.updateProductCache();
    
    // Run immediately on start
    await this.processOrders();
    
    // Then run every 30 seconds
    this.processingInterval = setInterval(async () => {
      await this.processOrders();
    }, 30000);
  }

  stop() {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
      console.log("🎁 [GIFT-CARD-PROCESSOR] Stopped gift card processor");
    }
  }

  private async updateProductCache() {
    const now = Date.now();
    if (now - this.lastCacheUpdate < this.CACHE_TTL && this.productCache.size > 0) {
      return; // Cache still valid
    }

    try {
      const reloadlyClient = getReloadlyClient();
      
      // Fetch ALL products without country filter
      // Reloadly account may have products from various countries
      console.log(`📦 [GIFT-CARD-PROCESSOR] Fetching all available products...`);
      
      const page1 = await reloadlyClient.getProducts(1, 100);
      const page2 = await reloadlyClient.getProducts(2, 100);
      const page3 = await reloadlyClient.getProducts(3, 100);
      
      const allProducts = [...page1, ...page2, ...page3];
      
      console.log(`📦 [GIFT-CARD-PROCESSOR] Fetched ${allProducts.length} total products`);
      
      // Log unique brands and countries
      const uniqueBrands = new Set(allProducts.map((p: any) => p.brand.brandName));
      const uniqueCountries = new Set(allProducts.map((p: any) => p.countryCode).filter(Boolean));
      console.log(`📦 [GIFT-CARD-PROCESSOR] Available brands:`, Array.from(uniqueBrands).slice(0, 20).join(', '));
      console.log(`📦 [GIFT-CARD-PROCESSOR] Available countries:`, Array.from(uniqueCountries).join(', '));
      
      // Log sample Amazon/Google Play products
      const amazonProducts = allProducts.filter((p: any) => p.brand.brandName.toLowerCase().includes('amazon'));
      const googleProducts = allProducts.filter((p: any) => p.brand.brandName.toLowerCase().includes('google') || p.brand.brandName.toLowerCase().includes('app store'));
      console.log(`📦 [GIFT-CARD-PROCESSOR] Amazon products: ${amazonProducts.length}, Google/AppStore: ${googleProducts.length}`);
      
      // Cache ALL products by brand + denomination for comprehensive lookup
      this.productCache.clear();
      
      for (const product of allProducts) {
        const brandName = product.brand.brandName.toLowerCase();
        
        // Only cache Amazon and Google Play
        let brandKey = '';
        if (brandName.includes('amazon')) {
          brandKey = 'amazon';
        } else if (brandName.includes('google play')) {
          brandKey = 'google_play';
        }
        
        if (!brandKey) continue;
        
        // Cache by brand + denomination (store all variants)
        if (product.denominationType === 'FIXED' && product.fixedRecipientDenominations) {
          for (const denom of product.fixedRecipientDenominations) {
            const cacheKey = `${brandKey}-${denom}`;
            // Store ALL matching products (not just first)
            const existing = this.productCache.get(cacheKey) || [];
            existing.push(product);
            this.productCache.set(cacheKey, existing);
          }
        } else if (product.denominationType === 'RANGE') {
          // For range products, cache separately
          const cacheKey = `${brandKey}-range`;
          const existing = this.productCache.get(cacheKey) || [];
          existing.push(product);
          this.productCache.set(cacheKey, existing);
        }
      }
      
      this.lastCacheUpdate = now;
      console.log(`✅ [GIFT-CARD-PROCESSOR] Cached ${this.productCache.size} product variations`);
    } catch (error) {
      console.error(`❌ [GIFT-CARD-PROCESSOR] Failed to update product cache:`, error);
    }
  }

  private async processOrders() {
    if (this.isProcessing) {
      return; // Prevent concurrent processing
    }

    this.isProcessing = true;

    try {
      // Refresh cache if needed
      await this.updateProductCache();
      
      const orders = await storage.getPaidUndeliveredGiftCardOrders();
      
      if (orders.length > 0) {
        console.log(`🎁 [GIFT-CARD-PROCESSOR] Found ${orders.length} paid order(s) to process`);
      }

      for (const order of orders) {
        await this.processOrder(order);
      }
    } catch (error) {
      console.error("🎁 [GIFT-CARD-PROCESSOR] Error during processing:", error);
    } finally {
      this.isProcessing = false;
    }
  }

  private async processOrder(order: any) {
    const orderId = order.orderId;

    try {
      console.log(`🎁 [GIFT-CARD-PROCESSOR] Processing order ${orderId}`);

      // Check if we already have a Reloadly transaction ID
      if (order.reloadlyTransactionId) {
        // Order already placed with Reloadly, check status
        await this.checkOrderStatus(order);
        return;
      }

      // Place order with Reloadly
      await this.placeReloadlyOrder(order);

    } catch (error: any) {
      console.error(`🎁 [GIFT-CARD-PROCESSOR] Error processing order ${orderId}:`, error);
      
      // Mark as error with proper update object
      await storage.updateGiftCardOrderStatus(orderId, null, {
        orderStatus: 'error',
        errorMessage: error.message || 'Unknown error during processing'
      });
    }
  }

  private async placeReloadlyOrder(order: any) {
    const orderId = order.orderId;
    
    console.log(`🎁 [GIFT-CARD-PROCESSOR] Placing Reloadly order for ${orderId}`);

    const reloadlyClient = getReloadlyClient();

    // Find matching products from cache
    const cacheKey = `${order.giftCardType}-${order.denomination}`;
    let products = this.productCache.get(cacheKey);
    
    // If not found in fixed denominations, try range products
    if (!products || products.length === 0) {
      const rangeKey = `${order.giftCardType}-range`;
      const rangeProducts = this.productCache.get(rangeKey) || [];
      products = rangeProducts.filter((p: any) => 
        order.denomination >= (p.minRecipientDenomination || 0) &&
        order.denomination <= (p.maxRecipientDenomination || 1000)
      );
    }

    if (!products || products.length === 0) {
      throw new Error(`No matching Reloadly product found for ${order.giftCardType} $${order.denomination}`);
    }
    
    // Pick first available product (could add logic to prefer certain variants)
    const selectedProduct = products[0];

    const productId = selectedProduct.productId;

    // Place order with Reloadly
    const transaction = await reloadlyClient.createOrder(
      productId,
      1, // quantity
      selectedProduct.unitPrice,
      orderId // custom identifier
    );

    if (!transaction) {
      throw new Error('Failed to create Reloadly order');
    }

    console.log(`✅ [GIFT-CARD-PROCESSOR] Reloadly order placed for ${orderId}. Transaction ID: ${transaction.transactionId}`);

    // Store transaction ID and product ID in database
    await storage.updateGiftCardReloadly(orderId, transaction.transactionId, productId);

    // Check if card details are immediately available
    if (transaction.status === 'SUCCESSFUL') {
      await this.retrieveCardDetails(orderId, transaction.transactionId, productId);
    } else {
      console.log(`⏳ [GIFT-CARD-PROCESSOR] Reloadly order ${orderId} pending. Status: ${transaction.status}`);
    }
  }

  private async checkOrderStatus(order: any) {
    const orderId = order.orderId;
    const transactionId = order.reloadlyTransactionId;
    const productId = order.reloadlyProductId;

    if (!transactionId) {
      console.error(`🎁 [GIFT-CARD-PROCESSOR] Order ${orderId} has no transaction ID`);
      return;
    }

    console.log(`🎁 [GIFT-CARD-PROCESSOR] Checking status for order ${orderId}, transaction ${transactionId}`);

    const reloadlyClient = getReloadlyClient();
    
    try {
      const transaction = await reloadlyClient.getTransaction(transactionId);

      if (!transaction) {
        console.error(`🎁 [GIFT-CARD-PROCESSOR] Transaction ${transactionId} not found`);
        // Don't mark as error - might be temporary API issue, retry next cycle
        return;
      }

      if (transaction.status === 'SUCCESSFUL') {
        console.log(`✅ [GIFT-CARD-PROCESSOR] Transaction ${transactionId} successful, retrieving card details`);
        await this.retrieveCardDetails(orderId, transactionId, productId);
      } else if (transaction.status === 'FAILED' || transaction.status === 'REFUNDED') {
        console.error(`❌ [GIFT-CARD-PROCESSOR] Transaction ${transactionId} failed. Status: ${transaction.status}`);
        await storage.updateGiftCardOrderStatus(orderId, null, {
          orderStatus: 'error',
          errorMessage: `Reloadly transaction ${transaction.status}`
        });
      } else {
        console.log(`⏳ [GIFT-CARD-PROCESSOR] Transaction ${transactionId} still pending. Status: ${transaction.status}`);
        // Don't change status, just log and retry next cycle
      }
    } catch (error: any) {
      console.error(`🎁 [GIFT-CARD-PROCESSOR] Error checking transaction ${transactionId}:`, error);
      // Don't mark as permanent error - might be transient network issue
      // Will retry on next cycle
    }
  }

  private async retrieveCardDetails(orderId: string, transactionId: number, productId: number | null) {
    console.log(`🎁 [GIFT-CARD-PROCESSOR] Retrieving card details for order ${orderId}`);

    const reloadlyClient = getReloadlyClient();
    
    try {
      const cardDetails = await reloadlyClient.getRedemptionCodes(transactionId);

      if (!cardDetails || cardDetails.length === 0) {
        throw new Error('No card details returned from Reloadly');
      }

      // Use first card (usually there's only one)
      const card = cardDetails[0];

      // Get product details for redemption instructions
      let redeemInstructions: string | null = null;
      if (productId) {
        const product = await reloadlyClient.getProduct(productId);
        if (product?.redeemInstruction) {
          redeemInstructions = product.redeemInstruction.verbose || product.redeemInstruction.concise;
        }
      }

      // Update database with card details
      await storage.updateGiftCardDelivery(
        orderId,
        card.cardNumber,
        card.pinCode,
        redeemInstructions
      );

      console.log(`✅ [GIFT-CARD-PROCESSOR] Gift card ${orderId} delivered successfully`);

    } catch (error: any) {
      console.error(`🎁 [GIFT-CARD-PROCESSOR] Error retrieving card details for ${orderId}:`, error);
      
      // Don't mark as permanent error if 404 - Reloadly might need time to generate codes
      if (error.message?.includes('404')) {
        console.log(`⏳ [GIFT-CARD-PROCESSOR] Card details not yet available for ${orderId}, will retry`);
      } else {
        await storage.updateGiftCardOrderStatus(orderId, null, {
          orderStatus: 'error',
          errorMessage: error.message || 'Failed to retrieve card details'
        });
      }
    }
  }
}

export const giftCardProcessor = new GiftCardProcessor();
