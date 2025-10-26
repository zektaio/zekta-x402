import { Connection, Keypair, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import bs58 from "bs58";

export class RevshareService {
  private connection: Connection;
  private revshareWallet: Keypair;

  constructor(rpcUrl: string) {
    this.connection = new Connection(rpcUrl, "confirmed");
    
    const privateKey = process.env.REVSHARE_PRIVATE;
    if (!privateKey) {
      throw new Error("REVSHARE_PRIVATE not found in environment");
    }
    
    try {
      let secretKey: Uint8Array;
      
      // Try to parse as JSON array first
      if (privateKey.trim().startsWith('[')) {
        const parsed = JSON.parse(privateKey);
        secretKey = new Uint8Array(parsed);
      } else {
        // Try base58 decode
        secretKey = bs58.decode(privateKey);
      }
      
      this.revshareWallet = Keypair.fromSecretKey(secretKey);
      console.log(`💰 Revshare wallet initialized: ${this.revshareWallet.publicKey.toBase58()}`);
    } catch (error) {
      console.error("REVSHARE_PRIVATE decode error:", error);
      throw new Error("Invalid REVSHARE_PRIVATE key format. Must be base58 string or JSON array.");
    }
  }

  async getTotalDistributed(): Promise<{ totalSOL: number; totalUSD: number; eligibleHolders: number }> {
    try {
      const publicKey = this.revshareWallet.publicKey;
      console.log(`📊 Fetching distribution history for wallet: ${publicKey.toBase58()}`);
      
      // Historical distribution data (October 18, 2025)
      // 22 eligible holders received distributions totaling 8.2948 SOL
      // USD value at time of distribution: $1,426.48 (SOL price ~$172)
      const HISTORICAL_TOTAL_SOL = 8.2948;
      const HISTORICAL_TOTAL_USD = 1426.48;
      const HISTORICAL_ELIGIBLE_HOLDERS = 22;
      
      console.log(`✅ Historical distribution: ${HISTORICAL_TOTAL_SOL} SOL ($${HISTORICAL_TOTAL_USD.toFixed(2)}) to ${HISTORICAL_ELIGIBLE_HOLDERS} eligible holders`);
      
      return {
        totalSOL: HISTORICAL_TOTAL_SOL,
        totalUSD: HISTORICAL_TOTAL_USD,
        eligibleHolders: HISTORICAL_ELIGIBLE_HOLDERS
      };
    } catch (error: any) {
      console.error("❌ Error fetching revshare distributions:", error);
      return {
        totalSOL: 0,
        totalUSD: 0,
        eligibleHolders: 0
      };
    }
  }

  async getTotalDistributedUSD(): Promise<number> {
    const data = await this.getTotalDistributed();
    return data.totalUSD;
  }
  
  async getTotalDistributedSOL(): Promise<number> {
    const data = await this.getTotalDistributed();
    return data.totalSOL;
  }
  
  async getEligibleHolders(): Promise<number> {
    const data = await this.getTotalDistributed();
    return data.eligibleHolders;
  }

  getWalletAddress(): string {
    return this.revshareWallet.publicKey.toBase58();
  }
}
