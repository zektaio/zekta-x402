import { storage } from "./storage";
import { SimpleSwapClient } from "./simpleswap";

export class PaymentMonitor {
  private monitoringInterval: NodeJS.Timeout | null = null;
  private isMonitoring = false;
  private swapClient: SimpleSwapClient | null = null;

  constructor(swapClient: SimpleSwapClient | null) {
    this.swapClient = swapClient;
  }

  start() {
    if (this.monitoringInterval) {
      return; // Already running
    }

    if (!this.swapClient) {
      console.log("⚠️ Payment monitor not started - swap client not available");
      return;
    }

    console.log("🔍 Payment monitor started - checking swap status every 30s");

    // Check every 30 seconds for pending payments
    this.monitoringInterval = setInterval(() => {
      this.checkPendingPayments();
    }, 30000); // 30 seconds

    // Run immediately on start
    this.checkPendingPayments();
  }

  stop() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log("⏸️  Payment monitor stopped");
    }
  }

  private async checkPendingPayments() {
    if (this.isMonitoring || !this.swapClient) {
      return; // Skip if already monitoring or no swap client
    }

    this.isMonitoring = true;

    try {
      // Get all orders with pending payment that have an exchangeId
      const pendingOrders = await storage.getPendingDomainOrders();

      for (const order of pendingOrders) {
        if (order.exchangeId) {
          await this.checkPaymentStatus(order);
        }
      }
    } catch (error) {
      console.error("Error monitoring payments:", error);
    } finally {
      this.isMonitoring = false;
    }
  }

  private async checkPaymentStatus(order: any) {
    if (!this.swapClient) return;

    try {
      // Check SimpleSwap exchange status
      const exchange = await this.swapClient.getExchange(order.exchangeId);
      
      const fullDomain = `${order.domainName}${order.tld}`;

      // SimpleSwap statuses: 
      // 'waiting' - waiting for user deposit
      // 'confirming' - deposit received, confirming
      // 'exchanging' - exchanging
      // 'sending' - sending to destination
      // 'finished' - completed successfully
      // 'failed', 'refunded', 'expired' - failed states

      if (exchange.status === 'finished') {
        console.log(`✅ Payment confirmed for domain ${fullDomain} (Order: ${order.orderId})`);
        
        // Mark as paid - domain processor will pick it up
        await storage.updateDomainOrderPayment(
          order.orderId,
          'paid',
          exchange.txTo || exchange.transactionTo || exchange.hashOut || 'swap_completed'
        );
      } else if (exchange.status === 'failed' || exchange.status === 'refunded' || exchange.status === 'expired') {
        console.log(`❌ Payment failed for domain ${fullDomain} (Order: ${order.orderId}, Status: ${exchange.status})`);
        
        await storage.updateDomainOrderPayment(
          order.orderId,
          'failed'
        );
      } else if (exchange.status === 'confirming' || exchange.status === 'exchanging' || exchange.status === 'sending') {
        // Still processing - log for visibility
        console.log(`⏳ Payment processing for ${fullDomain} (Status: ${exchange.status})`);
      }
      // 'waiting' status - no logging needed, waiting for user deposit
    } catch (error: any) {
      // Don't log error if it's just "exchange not found" - it might be too early
      if (!error.message?.includes('not found')) {
        console.error(`Error checking payment for order ${order.orderId}:`, error.message);
      }
    }
  }
}
