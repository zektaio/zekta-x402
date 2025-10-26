import { ethers } from 'ethers';

export class ETHWalletService {
  private wallet: ethers.Wallet;
  private provider: ethers.JsonRpcProvider;
  public address: string;

  constructor() {
    const privateKey = process.env.EVM_HOT_WALLET_KEY;
    
    if (!privateKey) {
      throw new Error('EVM_HOT_WALLET_KEY not configured');
    }

    // Initialize wallet from private key
    this.wallet = new ethers.Wallet(privateKey);
    this.address = this.wallet.address;

    // Connect to Ethereum mainnet via public RPC
    this.provider = new ethers.JsonRpcProvider('https://eth.llamarpc.com');
    this.wallet = this.wallet.connect(this.provider);

    console.log(`💰 ETH Wallet initialized: ${this.address}`);
  }

  async getBalance(): Promise<string> {
    const balance = await this.provider.getBalance(this.address);
    return ethers.formatEther(balance);
  }

  async sendETH(toAddress: string, amountEth: string): Promise<string> {
    try {
      console.log(`📤 Sending ${amountEth} ETH to ${toAddress}`);
      
      const tx = await this.wallet.sendTransaction({
        to: toAddress,
        value: ethers.parseEther(amountEth)
      });

      console.log(`⏳ Transaction sent: ${tx.hash}`);
      
      const receipt = await tx.wait();
      console.log(`✅ Transaction confirmed: ${receipt?.hash}`);
      
      return receipt?.hash || tx.hash;
    } catch (error: any) {
      console.error(`❌ ETH transfer failed:`, error);
      throw new Error(`Failed to send ETH: ${error.message}`);
    }
  }

  async estimateGas(toAddress: string, amountEth: string): Promise<string> {
    const gasEstimate = await this.provider.estimateGas({
      to: toAddress,
      value: ethers.parseEther(amountEth)
    });
    
    return ethers.formatEther(gasEstimate);
  }
}

export const ethWalletService = new ETHWalletService();
