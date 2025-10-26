import { Connection, PublicKey, LAMPORTS_PER_SOL, ParsedTransactionWithMeta, ConfirmedSignatureInfo } from "@solana/web3.js";

const REVSHARE_WALLET = "H5LT5g7mSFU3X3TL399jBiACfReBXZp1c7nJuJeVgAMB";
const ZEKTA_MINT = "CA6DpicXuJUsSWziuV4oHmqpHTSMZLz9EGjYPyXJpump";
const SOLANA_RPC = process.env.HELIUS_RPC_URL || "https://api.mainnet-beta.solana.com";

export interface WalletBalance {
  address: string;
  balanceSOL: number;
  balanceUSD: number;
  lastUpdated: number;
}

export interface TokenTransaction {
  signature: string;
  timestamp: number;
  volumeSOL: number;
  volumeUSD: number;
}

export interface TransactionFetchResult {
  transactions: TokenTransaction[];
  signatureFound: boolean;
}

export class WalletService {
  private cache: {
    balance: WalletBalance;
    timestamp: number;
  } | null = null;
  
  private readonly CACHE_TTL = 300000; // 5 minutes cache
  private connection: Connection;
  private solPriceUSD: number = 0;

  constructor() {
    this.connection = new Connection(SOLANA_RPC, 'confirmed');
    const rpcProvider = process.env.HELIUS_RPC_URL ? 'Helius (Premium)' : 'Free Public RPC';
    console.log(`🔗 WalletService using: ${rpcProvider}`);
  }

  async getSOLPrice(): Promise<number> {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
      const data = await response.json();
      this.solPriceUSD = data.solana?.usd || 0;
      return this.solPriceUSD;
    } catch (error) {
      console.error('Error fetching SOL price:', error);
      return this.solPriceUSD || 150; // Fallback to cached price or estimate
    }
  }

  async getWalletBalance(): Promise<WalletBalance> {
    const now = Date.now();
    
    if (this.cache && (now - this.cache.timestamp) < this.CACHE_TTL) {
      return this.cache.balance;
    }

    try {
      const walletPubkey = new PublicKey(REVSHARE_WALLET);
      const balance = await this.connection.getBalance(walletPubkey);
      const balanceSOL = balance / LAMPORTS_PER_SOL;
      
      const solPrice = await this.getSOLPrice();
      const balanceUSD = balanceSOL * solPrice;

      const walletBalance: WalletBalance = {
        address: REVSHARE_WALLET,
        balanceSOL,
        balanceUSD,
        lastUpdated: now
      };

      this.cache = {
        balance: walletBalance,
        timestamp: now
      };

      console.log(`💰 Revshare wallet balance: ${balanceSOL.toFixed(4)} SOL ($${balanceUSD.toFixed(2)})`);

      return walletBalance;
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      
      if (this.cache) {
        console.log('⚠️ Using cached wallet balance');
        return this.cache.balance;
      }
      
      return {
        address: REVSHARE_WALLET,
        balanceSOL: 0,
        balanceUSD: 0,
        lastUpdated: now
      };
    }
  }

  clearCache(): void {
    this.cache = null;
  }

  async getRecentTokenTransactions(lastSignature?: string, limit: number = 100): Promise<TransactionFetchResult> {
    try {
      const mintPubkey = new PublicKey(ZEKTA_MINT);
      const allTransactions: TokenTransaction[] = [];
      const solPrice = await this.getSOLPrice();
      let beforeSignature: string | undefined = undefined;
      let foundLastSignature = false;
      let pageCount = 0;
      let reachedEnd = false;

      while (!reachedEnd) {
        if (lastSignature && foundLastSignature) {
          break;
        }
        
        // On first run (no lastSignature), just grab first page to establish baseline
        // This avoids rate limiting from processing thousands of historical transactions
        if (!lastSignature && pageCount >= 1) {
          console.log(`✅ First run: Processed 1 page to establish baseline. Future runs will track incrementally.`);
          reachedEnd = true;
          break;
        }
        
        const signatures = await this.connection.getSignaturesForAddress(
          mintPubkey,
          beforeSignature ? { limit, before: beforeSignature } : { limit }
        );

        if (signatures.length === 0) {
          reachedEnd = true;
          break;
        }

        for (const sig of signatures) {
          if (lastSignature && sig.signature === lastSignature) {
            foundLastSignature = true;
            break;
          }

          if (!sig.blockTime) continue;

          try {
            // Add delay to avoid rate limiting (50ms between requests)
            await new Promise(resolve => setTimeout(resolve, 50));
            
            const tx = await this.connection.getParsedTransaction(sig.signature, {
              maxSupportedTransactionVersion: 0
            });

            if (!tx || !tx.meta) continue;

            const volumeSOL = this.extractSwapVolume(tx);
            if (volumeSOL > 0) {
              allTransactions.push({
                signature: sig.signature,
                timestamp: sig.blockTime * 1000,
                volumeSOL,
                volumeUSD: volumeSOL * solPrice
              });
            }
          } catch (error) {
            console.error(`Error parsing transaction ${sig.signature}:`, error);
          }
        }

        beforeSignature = signatures[signatures.length - 1]?.signature;
        pageCount++;

        if (pageCount > 50) {
          console.warn(`⚠️ Transaction pagination depth exceeded 50 pages (${pageCount * limit} signatures)! Consider investigation.`);
        }
      }

      if (lastSignature && !foundLastSignature && reachedEnd) {
        console.warn(`⚠️ WARNING: lastProcessedSignature (${lastSignature.slice(0, 8)}...) not found in RPC history! Likely garbage-collected. Starting fresh from current transactions.`);
      }

      console.log(`📊 Fetched ${pageCount} page(s), found ${allTransactions.length} swap transactions`);
      return { transactions: allTransactions, signatureFound: foundLastSignature };
    } catch (error) {
      console.error('Error fetching token transactions:', error);
      return { transactions: [], signatureFound: false };
    }
  }

  private extractSwapVolume(tx: ParsedTransactionWithMeta): number {
    if (!tx.meta) return 0;

    const preBalances = tx.meta.preBalances;
    const postBalances = tx.meta.postBalances;

    let maxChange = 0;

    for (let i = 0; i < preBalances.length; i++) {
      const change = Math.abs(postBalances[i] - preBalances[i]);
      if (change > maxChange) {
        maxChange = change;
      }
    }

    return maxChange / LAMPORTS_PER_SOL;
  }
}

export const walletService = new WalletService();
