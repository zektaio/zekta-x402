interface NjallaPaymentRequest {
  amount: number; // in EUR
  via: string; // 'ethereum', 'bitcoin', etc
}

interface NjallaPaymentResponse {
  id: string; // Payment ID for polling status
  amount: number;
  address: string; // Njalla's crypto wallet address
  url?: string;
}

interface NjallaPaymentStatus {
  id: string;
  amount: number;
  status: string; // 'pending', 'confirmed', 'cancelled'
  address: string;
  url?: string;
}

export class NjallaPaymentService {
  private apiToken: string;
  private baseUrl = 'https://njal.la/api/1/';

  constructor() {
    this.apiToken = process.env.NJALLA_API_TOKEN || '';
    if (!this.apiToken) {
      console.warn('⚠️ NJALLA_API_TOKEN not configured');
    }
  }

  async addPayment(amount: number, crypto: string = 'ethereum'): Promise<NjallaPaymentResponse> {
    console.log(`💳 Creating Njalla payment: €${amount} via ${crypto}`);

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Njalla ${this.apiToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'add-payment',
          params: {
            amount,
            via: crypto
          },
          id: '1'
        })
      });

      if (!response.ok) {
        throw new Error(`Njalla API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(`Njalla error: ${data.error.message}`);
      }

      const result = data.result as NjallaPaymentResponse;
      console.log(`✅ Njalla payment created - Address: ${result.address}`);

      return result;
    } catch (error: any) {
      console.error('Failed to create Njalla payment:', error);
      throw error;
    }
  }

  async getPayment(paymentId: string): Promise<NjallaPaymentStatus> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Njalla ${this.apiToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'get-payment',
          params: {
            id: paymentId
          },
          id: '1'
        })
      });

      if (!response.ok) {
        throw new Error(`Njalla API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(`Njalla error: ${data.error.message}`);
      }

      return data.result as NjallaPaymentStatus;
    } catch (error: any) {
      console.error('Failed to get Njalla payment status:', error);
      throw error;
    }
  }

  async getBalance(): Promise<number> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Njalla ${this.apiToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'get-balance',
          params: {},
          id: '1'
        })
      });

      if (!response.ok) {
        throw new Error(`Njalla API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(`Njalla error: ${data.error.message}`);
      }

      const balance = data.result.balance || 0;
      console.log(`💰 Njalla balance: €${balance}`);
      
      return balance;
    } catch (error: any) {
      console.error('Failed to get Njalla balance:', error);
      throw error;
    }
  }
}

export const njallaPaymentService = new NjallaPaymentService();
