import { storage } from "./storage";
import { njallaService } from "./njalla-client";
import { njallaPaymentService } from "./njalla-payment";
import { ethWalletService } from "./eth-wallet";
import { priceOracle } from "./priceOracle";

export class DomainProcessor {
  private static instance: DomainProcessor | null = null;
  private processingInterval: NodeJS.Timeout | null = null;
  private isProcessing = false;
  private instanceId: string;

  constructor() {
    // Generate unique instance ID for debugging
    this.instanceId = `processor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  start() {
    if (this.processingInterval) {
      console.log(`⚠️ Processor ${this.instanceId} already running - skipping duplicate start`);
      return; // Already running
    }

    // Singleton protection: Stop any existing processor instance
    if (DomainProcessor.instance && DomainProcessor.instance !== this) {
      console.log(`⚠️ Stopping old processor instance before starting new one`);
      DomainProcessor.instance.stop();
    }
    DomainProcessor.instance = this;

    console.log(`🔄 Domain processor ${this.instanceId} started - checking for paid orders every 30s`);

    // Check every 30 seconds for paid orders that need processing
    this.processingInterval = setInterval(() => {
      this.processPaidOrders();
    }, 30000); // 30 seconds

    // Run immediately on start
    this.processPaidOrders();
  }

  stop() {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
      console.log("⏸️  Domain processor stopped");
    }
  }

  private async processPaidOrders() {
    if (this.isProcessing) {
      return; // Skip if already processing
    }

    this.isProcessing = true;

    try {
      // Get all paid orders that haven't been delivered yet
      const orders = await storage.getPaidUndeliveredOrders();

      for (const order of orders) {
        await this.processOrder(order);
      }
    } catch (error) {
      console.error("Error processing paid orders:", error);
    } finally {
      this.isProcessing = false;
    }
  }

  private async processOrder(order: any) {
    const fullDomain = `${order.domainName}${order.tld}`;

    try {
      // Skip processing for unsupported TLDs - these need manual intervention
      if (order.unsupportedTld) {
        console.log(`⚠️ Skipping ${fullDomain} - unsupported TLD (status: ${order.refundStatus})`);
        return;
      }

      // IDEMPOTENCY GUARD: If payment already sent (has TX hash), skip creating new payment
      // This prevents double payment from duplicate processor instances during hot reload
      if (order.njallaPaymentTxHash && order.njallaPaymentId) {
        // Payment already sent - let it proceed through confirmation flow only
        // Don't skip entirely, as we still need to poll for confirmation
      } else if (order.njallaPaymentTxHash && !order.njallaPaymentId) {
        // Edge case: TX hash exists but no payment ID - data inconsistency
        console.log(`⚠️ ${fullDomain} has TX hash but no payment ID - data inconsistency, skipping`);
        return;
      }

      // If we already have a task ID, check domain registration status
      if (order.njallaTaskId) {
        const taskResult = await njallaService.checkTask(order.njallaTaskId);
        
        if (taskResult.completed) {
          if (taskResult.success) {
            console.log(`✅ Domain ${fullDomain} registration completed`);
            await storage.updateDomainOrderStatus(
              order.orderId, 
              'delivered',
              { deliveredAt: new Date(), orderStatus: 'delivered' }
            );
          } else {
            console.error(`❌ Domain ${fullDomain} registration failed`);
            await storage.updateDomainOrderStatus(
              order.orderId,
              'failed',
              { orderStatus: 'failed' }
            );
          }
        } else {
          console.log(`⏳ Domain ${fullDomain} registration in progress...`);
        }
        return;
      }

      // If payment sent but not yet confirmed by Njalla, poll for confirmation
      if (order.njallaPaymentId && !order.njallaPaymentConfirmed) {
        // Idempotency: If we have payment ID but no tx hash yet, we need to send ETH
        if (!order.njallaPaymentTxHash) {
          console.log(`⚠️ Payment ID exists but no TX hash - validating payment before retry for ${fullDomain}`);
          
          // First, check if Njalla payment is still valid
          try {
            const paymentStatus = await njallaPaymentService.getPayment(order.njallaPaymentId);
            
            if (paymentStatus.status === 'cancelled' || paymentStatus.status === 'expired') {
              console.log(`❌ Njalla payment ${order.njallaPaymentId} is ${paymentStatus.status} - clearing and will recreate`);
              // Clear invalid payment data to force recreation
              await storage.updateDomainOrderStatus(
                order.orderId,
                null,
                { 
                  njallaPaymentId: null,
                  njallaPaymentAddress: null,
                  njallaPaymentAmount: null,
                  orderStatus: 'processing'
                }
              );
              return;
            } else if (paymentStatus.status === 'pending' || paymentStatus.status === 'confirmed') {
              console.log(`⚠️ Njalla payment ${order.njallaPaymentId} already ${paymentStatus.status} - ETH was likely sent but TX hash not persisted`);
              console.log(`⚠️ Manual reconciliation required - skipping resend to avoid double payment`);
              // Mark as error for manual review - do not resend ETH
              await storage.updateDomainOrderStatus(
                order.orderId,
                null,
                { 
                  orderStatus: 'error' // Requires manual intervention
                }
              );
              return;
            }
          } catch (error: any) {
            console.error(`Error checking Njalla payment status before retry:`, error);
            console.log(`⚠️ Cannot verify payment status - skipping ETH send to avoid double payment risk`);
            // Do NOT continue with retry if we can't verify status
            return;
          }
          
          // Use stored payment amount if available, otherwise calculate fresh
          let ethAmount = order.njallaPaymentAmount;
          if (!ethAmount || ethAmount <= 0) {
            console.log(`⚠️ No stored payment amount, recalculating...`);
            const ethPriceInEUR = await priceOracle.getPriceInEUR('eth');
            if (!ethPriceInEUR || ethPriceInEUR <= 0) {
              throw new Error('Failed to get ETH price in EUR');
            }
            const priceEUR = order.priceUSD;
            ethAmount = (priceEUR / ethPriceInEUR) * 1.01;
          }
          
          console.log(`💸 Retrying ETH send: ${ethAmount} ETH to ${order.njallaPaymentAddress}`);
          const txHash = await ethWalletService.sendETH(order.njallaPaymentAddress!, ethAmount.toString());
          console.log(`✅ ETH sent to Njalla (retry) - TX: ${txHash}`);

          await storage.updateDomainOrderStatus(
            order.orderId,
            null,
            { 
              njallaPaymentTxHash: txHash,
              orderStatus: 'processing'
            }
          );
          return;
        }

        console.log(`⏳ Polling Njalla payment status for ${fullDomain}...`);
        
        try {
          const paymentStatus = await njallaPaymentService.getPayment(order.njallaPaymentId);
          
          // Check if payment is confirmed or already added (Njalla uses "Added X € via Ethereum" format)
          const isConfirmed = paymentStatus.status === 'confirmed' || 
                             paymentStatus.status.toLowerCase().includes('added') ||
                             paymentStatus.status.toLowerCase().includes('€');
          
          if (isConfirmed) {
            console.log(`✅ Njalla confirmed payment for ${fullDomain} (status: ${paymentStatus.status})`);
            await storage.updateDomainOrderStatus(
              order.orderId,
              null,
              { 
                njallaPaymentConfirmed: true,
                orderStatus: 'processing'
              }
            );
          } else if (paymentStatus.status === 'cancelled') {
            console.error(`❌ Njalla payment cancelled for ${fullDomain}`);
            await storage.updateDomainOrderStatus(
              order.orderId,
              'failed',
              { orderStatus: 'failed' }
            );
          } else {
            console.log(`⏳ Njalla payment still pending for ${fullDomain} (status: ${paymentStatus.status})`);
          }
        } catch (error: any) {
          console.error(`Error checking Njalla payment status:`, error);
          // Don't fail order, will retry next cycle
        }
        return;
      }

      // If Njalla payment is confirmed but domain not registered yet
      if (order.njallaPaymentConfirmed && !order.njallaTaskId) {
        console.log(`📝 Njalla payment confirmed - registering domain ${fullDomain}`);
        
        const result = await njallaService.registerDomain(fullDomain, 1);

        if (result.success && result.taskId) {
          console.log(`✅ Domain registration initiated, task ID: ${result.taskId}`);
          await storage.updateDomainOrderStatus(
            order.orderId,
            null,
            { 
              njallaTaskId: result.taskId,
              orderStatus: 'processing'
            }
          );
        } else {
          console.error(`❌ Failed to initiate domain registration: ${result.error}`);
          await storage.updateDomainOrderStatus(
            order.orderId,
            'failed',
            { orderStatus: 'failed' }
          );
        }
        return;
      }

      // No Njalla payment yet - initiate payment to Njalla
      // Note: order.priceUSD actually stores EUR (naming is historical)
      const priceEUR = order.priceUSD;
      
      // CRITICAL: Final check before creating payment - prevent race condition
      // Re-fetch order from database to ensure another processor hasn't already created payment
      const freshOrder = await storage.getDomainOrder(order.orderId);
      if (freshOrder?.njallaPaymentId) {
        console.log(`⚠️ ${fullDomain} - Payment already created by another processor (ID: ${freshOrder.njallaPaymentId}), skipping`);
        return;
      }
      
      console.log(`💳 Creating Njalla payment for ${fullDomain} (€${priceEUR}) - Processor: ${this.instanceId}`);
      
      // Step 1: Create payment request to Njalla
      const paymentRequest = await njallaPaymentService.addPayment(priceEUR, 'ethereum');
      const njallaPaymentId = paymentRequest.id;
      const njallaEthAddress = paymentRequest.address;
      
      console.log(`💰 Njalla payment ID: ${njallaPaymentId}, ETH address: ${njallaEthAddress}`);

      // Step 2: Calculate ETH amount to send (with safety margin to avoid underpayment)
      const ethPriceInEUR = await priceOracle.getPriceInEUR('eth');
      if (!ethPriceInEUR || ethPriceInEUR <= 0) {
        throw new Error('Failed to get ETH price in EUR');
      }

      // Add 1% safety margin to ensure we don't underpay due to price fluctuations
      const ethAmount = (priceEUR / ethPriceInEUR) * 1.01;
      console.log(`💸 Will send ${ethAmount} ETH (€${priceEUR} + 1% margin) to Njalla`);

      // Step 3: PERSIST payment intent BEFORE sending funds (idempotency guard)
      await storage.updateDomainOrderStatus(
        order.orderId,
        null,
        { 
          njallaPaymentId: njallaPaymentId,
          njallaPaymentAddress: njallaEthAddress,
          njallaPaymentAmount: ethAmount, // Store exact amount to use on retries
          orderStatus: 'processing'
        }
      );
      console.log(`✅ Payment intent saved - proceeding to send ETH`);

      // Step 4: Send ETH from Zekta wallet to Njalla
      const txHash = await ethWalletService.sendETH(njallaEthAddress, ethAmount.toString());
      
      console.log(`✅ ETH sent to Njalla - TX: ${txHash}`);

      // Step 5: Update order with transaction hash
      await storage.updateDomainOrderStatus(
        order.orderId,
        null,
        { 
          njallaPaymentTxHash: txHash,
          njallaPaymentConfirmed: false, // Will be confirmed by polling
          orderStatus: 'processing'
        }
      );

      console.log(`✅ Payment sent - will poll for Njalla confirmation in next cycle`);
      
    } catch (error: any) {
      console.error(`Error processing order ${order.orderId}:`, error);
      
      // Don't permanently fail order for transient errors
      // Keep in 'processing' state to allow retry on next cycle
      // Only explicit Njalla cancellation should fail the order
      console.log(`⚠️ Error encountered - will retry on next cycle`);
      
      // Optionally update status to 'error' to track problematic orders
      // but don't set paymentStatus to 'failed' which would prevent retries
      try {
        await storage.updateDomainOrderStatus(
          order.orderId,
          null,
          { orderStatus: 'error' }
        );
      } catch (updateError) {
        console.error(`Failed to update order status:`, updateError);
      }
    }
  }

  // Manual trigger for testing
  async processOrderNow(orderId: string) {
    const order = await storage.getDomainOrder(orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    await this.processOrder(order);
  }
}

export const domainProcessor = new DomainProcessor();
