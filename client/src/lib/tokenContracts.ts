export interface TokenContract {
  symbol: string;
  name: string;
  contractAddress: string;
  chainId: string;
  isPriority: boolean; // Show at top of list
  isComingSoon?: boolean; // Show "Coming Soon" badge and disable swaps
}

// Top priority tokens per chain (native + stablecoins)
export const tokenContracts: TokenContract[] = [
  // Ethereum - Top tokens
  { symbol: 'eth', name: 'Ethereum', contractAddress: '0x0000000000000000000000000000000000000000', chainId: 'ethereum', isPriority: true },
  { symbol: 'usdt', name: 'Tether USD', contractAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7', chainId: 'ethereum', isPriority: true },
  { symbol: 'usdc', name: 'USD Coin', contractAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', chainId: 'ethereum', isPriority: true },
  { symbol: 'dai', name: 'Dai Stablecoin', contractAddress: '0x6b175474e89094c44da98b954eedeac495271d0f', chainId: 'ethereum', isPriority: true },
  { symbol: 'weth', name: 'Wrapped Ether', contractAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', chainId: 'ethereum', isPriority: false },
  { symbol: 'link', name: 'Chainlink', contractAddress: '0x514910771af9ca656af840dff83e8264ecf986ca', chainId: 'ethereum', isPriority: false },
  { symbol: 'uni', name: 'Uniswap', contractAddress: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', chainId: 'ethereum', isPriority: false },

  // BSC - Top tokens
  { symbol: 'bnb', name: 'BNB', contractAddress: '0x0000000000000000000000000000000000000000', chainId: 'bsc', isPriority: true },
  { symbol: 'usdt', name: 'Tether USD', contractAddress: '0x55d398326f99059ff775485246999027b3197955', chainId: 'bsc', isPriority: true },
  { symbol: 'busd', name: 'Binance USD', contractAddress: '0xe9e7cea3dedca5984780bafc599bd69add087d56', chainId: 'bsc', isPriority: true },
  { symbol: 'usdc', name: 'USD Coin', contractAddress: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', chainId: 'bsc', isPriority: true },
  { symbol: 'wbnb', name: 'Wrapped BNB', contractAddress: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c', chainId: 'bsc', isPriority: false },
  { symbol: 'cake', name: 'PancakeSwap', contractAddress: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82', chainId: 'bsc', isPriority: false },

  // Polygon - Top tokens
  { symbol: 'matic', name: 'Polygon', contractAddress: '0x0000000000000000000000000000000000000000', chainId: 'polygon', isPriority: true },
  { symbol: 'usdt', name: 'Tether USD', contractAddress: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f', chainId: 'polygon', isPriority: true },
  { symbol: 'usdc', name: 'USD Coin', contractAddress: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', chainId: 'polygon', isPriority: true },
  { symbol: 'dai', name: 'Dai Stablecoin', contractAddress: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063', chainId: 'polygon', isPriority: true },
  { symbol: 'wmatic', name: 'Wrapped Matic', contractAddress: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', chainId: 'polygon', isPriority: false },
  { symbol: 'weth', name: 'Wrapped Ether', contractAddress: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619', chainId: 'polygon', isPriority: false },

  // Arbitrum - Top tokens
  { symbol: 'eth', name: 'Ethereum', contractAddress: '0x0000000000000000000000000000000000000000', chainId: 'arbitrum', isPriority: true },
  { symbol: 'usdt', name: 'Tether USD', contractAddress: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9', chainId: 'arbitrum', isPriority: true },
  { symbol: 'usdc', name: 'USD Coin', contractAddress: '0xaf88d065e77c8cc2239327c5edb3a432268e5831', chainId: 'arbitrum', isPriority: true },
  { symbol: 'dai', name: 'Dai Stablecoin', contractAddress: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', chainId: 'arbitrum', isPriority: true },
  { symbol: 'arb', name: 'Arbitrum', contractAddress: '0x912ce59144191c1204e64559fe8253a0e49e6548', chainId: 'arbitrum', isPriority: false },

  // Optimism - Top tokens
  { symbol: 'eth', name: 'Ethereum', contractAddress: '0x0000000000000000000000000000000000000000', chainId: 'optimism', isPriority: true },
  { symbol: 'usdt', name: 'Tether USD', contractAddress: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58', chainId: 'optimism', isPriority: true },
  { symbol: 'usdc', name: 'USD Coin', contractAddress: '0x7f5c764cbc14f9669b88837ca1490cca17c31607', chainId: 'optimism', isPriority: true },
  { symbol: 'dai', name: 'Dai Stablecoin', contractAddress: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', chainId: 'optimism', isPriority: true },
  { symbol: 'op', name: 'Optimism', contractAddress: '0x4200000000000000000000000000000000000042', chainId: 'optimism', isPriority: false },

  // Base - Top tokens
  { symbol: 'eth', name: 'Ethereum', contractAddress: '0x0000000000000000000000000000000000000000', chainId: 'base', isPriority: true },
  { symbol: 'usdc', name: 'USD Coin', contractAddress: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', chainId: 'base', isPriority: true },
  { symbol: 'dai', name: 'Dai Stablecoin', contractAddress: '0x50c5725949a6f0c72e6c4a641f24049a917db0cb', chainId: 'base', isPriority: true },
  { symbol: 'weth', name: 'Wrapped Ether', contractAddress: '0x4200000000000000000000000000000000000006', chainId: 'base', isPriority: false },

  // Avalanche - Top tokens
  { symbol: 'avax', name: 'Avalanche', contractAddress: '0x0000000000000000000000000000000000000000', chainId: 'avalanche', isPriority: true },
  { symbol: 'usdt', name: 'Tether USD', contractAddress: '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7', chainId: 'avalanche', isPriority: true },
  { symbol: 'usdc', name: 'USD Coin', contractAddress: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e', chainId: 'avalanche', isPriority: true },
  { symbol: 'dai', name: 'Dai Stablecoin', contractAddress: '0xd586e7f844cea2f87f50152665bcbc2c279d8d70', chainId: 'avalanche', isPriority: true },
  { symbol: 'wavax', name: 'Wrapped AVAX', contractAddress: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7', chainId: 'avalanche', isPriority: false },

  // Solana - Top tokens (Note: Solana uses different address format)
  { symbol: 'sol', name: 'Solana', contractAddress: 'So11111111111111111111111111111111111111112', chainId: 'solana', isPriority: true },
  { symbol: 'usdt', name: 'Tether USD', contractAddress: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', chainId: 'solana', isPriority: true },
  { symbol: 'usdc', name: 'USD Coin', contractAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', chainId: 'solana', isPriority: true },
  { symbol: 'wsol', name: 'Wrapped SOL', contractAddress: 'So11111111111111111111111111111111111111112', chainId: 'solana', isPriority: false },

  // Zcash - Privacy-focused cryptocurrency
  { symbol: 'zec', name: 'Zcash', contractAddress: 'native', chainId: 'zcash', isPriority: true },

  // Tron - Top tokens
  { symbol: 'trx', name: 'TRON', contractAddress: 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb', chainId: 'tron', isPriority: true },
  { symbol: 'usdt', name: 'Tether USD', contractAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t', chainId: 'tron', isPriority: true },
  { symbol: 'usdc', name: 'USD Coin', contractAddress: 'TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8', chainId: 'tron', isPriority: true },

  // Bitcoin - Special case (no smart contracts, but include for display)
  { symbol: 'btc', name: 'Bitcoin', contractAddress: 'native', chainId: 'bitcoin', isPriority: true },
];

// Helper function to get contract address by symbol and chain
export function getContractAddress(symbol: string, chainId: string): string | undefined {
  const token = tokenContracts.find(
    t => t.symbol.toLowerCase() === symbol.toLowerCase() && t.chainId === chainId
  );
  return token?.contractAddress;
}

// Helper function to get priority tokens for a chain
export function getPriorityTokens(chainId: string): TokenContract[] {
  return tokenContracts.filter(t => t.chainId === chainId && t.isPriority);
}

// Helper function to find token by contract address
export function findTokenByContract(contractAddress: string, chainId?: string): TokenContract | undefined {
  const normalizedAddress = contractAddress.toLowerCase();
  
  if (chainId) {
    return tokenContracts.find(
      t => t.contractAddress.toLowerCase() === normalizedAddress && t.chainId === chainId
    );
  }
  
  return tokenContracts.find(
    t => t.contractAddress.toLowerCase() === normalizedAddress
  );
}

// Helper function to check if string is a contract address
export function isContractAddress(value: string): boolean {
  // EVM address format (0x + 40 hex chars)
  const evmPattern = /^0x[a-fA-F0-9]{40}$/;
  
  // Solana address format (Base58, 32-44 chars)
  const solanaPattern = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  
  // Tron address format (T + Base58, 34 chars)
  const tronPattern = /^T[1-9A-HJ-NP-Za-km-z]{33}$/;
  
  return evmPattern.test(value) || solanaPattern.test(value) || tronPattern.test(value);
}
