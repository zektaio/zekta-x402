// @ts-ignore - no type definitions available
import njalla from 'njalla-dns';
import { promises as dns } from 'dns';

interface NjallaClient {
  getDomains: () => Promise<any[]>;
  getRecords: (domain: string) => Promise<any[]>;
  add: (domain: string, type: string, name: string, content: string, ttl: number) => Promise<any>;
  remove: (domain: string, recordId: string) => Promise<any>;
  update: (domain: string, recordId: string, content: string, ttl?: number) => Promise<any>;
}

interface TLDPricing {
  price: number; // in EUR (Euros) - Njalla API returns prices in EUR
  maxYear: number;
  dnssec: boolean;
}

export class NjallaService {
  private client: NjallaClient | null = null;
  private apiToken: string;
  private isInitialized = false;
  private tldPricing: Map<string, TLDPricing> = new Map();
  private pricingLastFetched: number = 0;
  private readonly PRICING_CACHE_TTL = 3600000; // 1 hour cache

  constructor() {
    this.apiToken = process.env.NJALLA_API_TOKEN || '';
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    if (!this.apiToken) {
      console.warn('⚠️  NJALLA_API_TOKEN not found - using mock mode');
      this.isInitialized = true;
      return;
    }

    try {
      this.client = await njalla(this.apiToken);
      console.log('✅ Njalla client initialized');
      this.isInitialized = true;
    } catch (error) {
      console.error('❌ Njalla initialization failed:', error);
      this.isInitialized = true; // Still mark as initialized to use mock mode
    }
  }

  private async checkViaDNS(domain: string): Promise<{ available: boolean; owned: false }> {
    // Use DNS lookup with timeout - check if domain has any DNS records
    const DNS_TIMEOUT = 3000; // 3 seconds

    try {
      // Wrap DNS calls in Promise.race with timeout
      const dnsCheck = async () => {
        // Try to resolve NS records - most reliable indicator of registration
        try {
          await dns.resolveNs(domain);
          console.log(`🌐 DNS check: ${domain} has NS records (taken)`);
          return { available: false, owned: false as const };
        } catch (error: any) {
          // No NS records - try A records as secondary check
          try {
            await dns.resolve4(domain);
            console.log(`🌐 DNS check: ${domain} has A records (taken)`);
            return { available: false, owned: false as const };
          } catch {
            // No A or NS records = likely available
            console.log(`✅ DNS check: ${domain} has no DNS records (likely available)`);
            return { available: true, owned: false as const };
          }
        }
      };

      const timeoutPromise = new Promise<{ available: boolean; owned: false }>((_, reject) => {
        setTimeout(() => reject(new Error('DNS_TIMEOUT')), DNS_TIMEOUT);
      });

      return await Promise.race([dnsCheck(), timeoutPromise]);
    } catch (error: any) {
      if (error.message === 'DNS_TIMEOUT') {
        console.log(`⏱️ DNS check timeout for ${domain}, assuming taken`);
      } else {
        console.error('DNS check error:', error);
      }
      // On error/timeout, assume not available to be safe
      return { available: false, owned: false };
    }
  }

  async getTLDPricing(): Promise<Map<string, TLDPricing>> {
    // Return cached pricing if still valid
    const now = Date.now();
    if (this.tldPricing.size > 0 && (now - this.pricingLastFetched) < this.PRICING_CACHE_TTL) {
      return this.tldPricing;
    }

    if (!this.apiToken) {
      console.warn('⚠️ Njalla API token not configured, using mock pricing');
      // Return mock pricing for common TLDs (in EUR) - ONLY include TLDs that Njalla actually supports
      const mockPricing = new Map<string, TLDPricing>();
      mockPricing.set('.com', { price: 15, maxYear: 10, dnssec: true });
      mockPricing.set('.dev', { price: 14, maxYear: 10, dnssec: true });
      mockPricing.set('.io', { price: 39, maxYear: 10, dnssec: true });
      mockPricing.set('.org', { price: 15, maxYear: 10, dnssec: true });
      // NOTE: .ai is NOT supported by Njalla - removed from mock
      return mockPricing;
    }

    try {
      const response = await fetch('https://njal.la/api/1/', {
        method: 'POST',
        headers: {
          'Authorization': `Njalla ${this.apiToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'get-tlds',
          params: {},
          id: '1'
        })
      });

      const data = await response.json();

      if (data.error) {
        console.error('Njalla get-tlds error:', data.error);
        return this.tldPricing; // Return old cache or empty
      }

      // Response: {result: {".com": {price: int (EUR), max_year: int, dnssec: bool}}}
      const tlds = data.result || {};
      this.tldPricing.clear();
      
      for (const [tld, info] of Object.entries(tlds)) {
        const pricing = info as any;
        this.tldPricing.set(tld, {
          price: pricing.price, // Njalla returns prices in EUR
          maxYear: pricing.max_year || 10,
          dnssec: pricing.dnssec || false
        });
      }

      this.pricingLastFetched = now;
      console.log(`✅ Fetched pricing for ${this.tldPricing.size} TLDs (in EUR)`);
      
      return this.tldPricing;
    } catch (error) {
      console.error('Failed to fetch TLD pricing:', error);
      return this.tldPricing; // Return old cache or empty
    }
  }

  async isTLDSupported(tld: string): Promise<boolean> {
    const pricing = await this.getTLDPricing();
    return pricing.has(tld);
  }

  async checkDomainAvailability(domain: string): Promise<{ available: boolean; owned: boolean; priceEUR?: number; error?: string; unsupportedTld?: boolean }> {
    await this.initialize();

    // Use DNS-only check for speed and reliability
    console.log(`🔍 Checking domain availability: ${domain}`);
    
    // Extract TLD from domain (e.g., "google.com" -> ".com")
    const tldMatch = domain.match(/(\.[^.]+)$/);
    const tld = tldMatch ? tldMatch[1] : '';
    
    // Get pricing for this TLD (Njalla API returns prices in EUR)
    let priceEUR: number | undefined;
    
    if (tld) {
      const pricing = await this.getTLDPricing();
      const tldInfo = pricing.get(tld);
      
      // CRITICAL: Validate TLD is supported by Njalla BEFORE checking availability
      if (!tldInfo) {
        console.error(`❌ TLD ${tld} is NOT supported by Njalla (domain: ${domain})`);
        return {
          available: false,
          owned: false,
          error: `The ${tld} domain extension is not supported. Please choose a different extension like .com, .org, .io, or .dev`,
          unsupportedTld: true
        };
      }
      
      priceEUR = tldInfo.price; // Already in EUR from Njalla API
    }
    
    // First check if we already own this domain (if API configured)
    if (this.client && this.apiToken) {
      try {
        const ownedDomains = await this.client.getDomains();
        const owned = ownedDomains.some((d: any) => d.name === domain);
        
        if (owned) {
          console.log(`✅ Domain check: ${domain} - owned by us`);
          return { available: false, owned: true, priceEUR };
        }
      } catch (error) {
        console.log(`⚠️ Could not check owned domains, continuing with DNS check`);
      }
    }

    // Use DNS check for fast, reliable availability detection
    const result = await this.checkViaDNS(domain);
    return { ...result, priceEUR };
  }

  async registerDomain(domain: string, years: number = 1): Promise<{ success: boolean; taskId?: string; error?: string }> {
    await this.initialize();

    if (!this.client) {
      console.log('📝 [MOCK] Domain registration:', domain);
      return { 
        success: true, 
        taskId: `MOCK-TASK-${Date.now()}` 
      };
    }

    try {
      // Note: njalla-dns package doesn't expose register-domain method
      // Use direct API call with JSON-RPC 2.0 format
      const response = await fetch('https://njal.la/api/1/', {
        method: 'POST',
        headers: {
          'Authorization': `Njalla ${this.apiToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'register-domain',
          params: {
            domain,
            years
          },
          id: '1'
        })
      });

      const data = await response.json();

      if (data.error) {
        console.error('Njalla registration error:', data.error);
        return { success: false, error: data.error.message || 'Registration failed' };
      }

      if (data.result && data.result.task) {
        console.log('✅ Domain registration task created:', data.result.task);
        return { success: true, taskId: data.result.task };
      }

      return { success: false, error: 'No task ID returned' };
    } catch (error: any) {
      console.error('Njalla registration error:', error);
      return { success: false, error: error.message || 'Registration failed' };
    }
  }

  async checkTask(taskId: string): Promise<{ completed: boolean; success?: boolean; result?: any }> {
    await this.initialize();

    if (!this.client || taskId.startsWith('MOCK-')) {
      // Mock mode - simulate completion after delay
      return { completed: true, success: true, result: { status: 'completed' } };
    }

    try {
      const response = await fetch('https://njal.la/api/1/', {
        method: 'POST',
        headers: {
          'Authorization': `Njalla ${this.apiToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'check-task',
          params: {
            id: taskId
          },
          id: '1'
        })
      });

      const data = await response.json();

      if (data.error) {
        return { completed: true, success: false };
      }

      if (data.result) {
        const isCompleted = data.result.status === 'completed';
        return { 
          completed: isCompleted, 
          success: isCompleted && !data.result.error,
          result: data.result 
        };
      }

      return { completed: false };
    } catch (error) {
      console.error('Njalla task check error:', error);
      return { completed: false };
    }
  }

  async getDomainInfo(domain: string): Promise<any> {
    await this.initialize();

    if (!this.client) {
      return null;
    }

    try {
      const response = await fetch('https://njal.la/api/1/', {
        method: 'POST',
        headers: {
          'Authorization': `Njalla ${this.apiToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          method: 'get-domain',
          params: {
            domain
          }
        })
      });

      const data = await response.json();
      return data.result || null;
    } catch (error) {
      console.error('Njalla get domain error:', error);
      return null;
    }
  }

  async listDNSRecords(domain: string): Promise<any[]> {
    await this.initialize();

    if (!this.client) {
      // Mock mode - return sample records
      return [
        { id: '1', name: '@', type: 'A', content: '192.168.1.1', ttl: 3600 },
        { id: '2', name: 'www', type: 'CNAME', content: domain, ttl: 3600 }
      ];
    }

    try {
      const records = await this.client.getRecords(domain);
      return records;
    } catch (error) {
      console.error('Njalla list DNS records error:', error);
      return [];
    }
  }

  async addDNSRecord(domain: string, type: string, name: string, content: string, ttl: number = 3600): Promise<{ success: boolean; error?: string; record?: any }> {
    await this.initialize();

    if (!this.client) {
      // Mock mode
      console.log(`📝 [MOCK] Add DNS record: ${name}.${domain} ${type} ${content}`);
      return { 
        success: true, 
        record: { id: Date.now().toString(), name, type, content, ttl } 
      };
    }

    try {
      const result = await this.client.add(domain, type, name, content, ttl);
      console.log(`✅ DNS record added: ${name}.${domain} ${type} ${content}`);
      return { success: true, record: result };
    } catch (error: any) {
      console.error('Njalla add DNS record error:', error);
      return { success: false, error: error.message || 'Failed to add DNS record' };
    }
  }

  async updateDNSRecord(domain: string, recordId: string, content: string, ttl?: number): Promise<{ success: boolean; error?: string }> {
    await this.initialize();

    if (!this.client) {
      // Mock mode
      console.log(`📝 [MOCK] Update DNS record: ${recordId} → ${content}`);
      return { success: true };
    }

    try {
      await this.client.update(domain, recordId, content, ttl);
      console.log(`✅ DNS record updated: ${recordId}`);
      return { success: true };
    } catch (error: any) {
      console.error('Njalla update DNS record error:', error);
      return { success: false, error: error.message || 'Failed to update DNS record' };
    }
  }

  async removeDNSRecord(domain: string, recordId: string): Promise<{ success: boolean; error?: string }> {
    await this.initialize();

    if (!this.client) {
      // Mock mode
      console.log(`📝 [MOCK] Remove DNS record: ${recordId}`);
      return { success: true };
    }

    try {
      await this.client.remove(domain, recordId);
      console.log(`✅ DNS record removed: ${recordId}`);
      return { success: true };
    } catch (error: any) {
      console.error('Njalla remove DNS record error:', error);
      return { success: false, error: error.message || 'Failed to remove DNS record' };
    }
  }
}

export const njallaService = new NjallaService();
