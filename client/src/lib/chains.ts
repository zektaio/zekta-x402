// Multi-chain configuration for swap interface

export interface Chain {
  id: string;
  name: string;
  symbol: string;
  network: string; // Network identifier for exchange service
  type: 'EVM' | 'Solana' | 'Bitcoin' | 'Tron' | 'Other';
  addressFormat: string; // Regex or description
  explorer: string;
  isComingSoon?: boolean; // Show "Coming Soon" badge
}

export const CHAINS: Chain[] = [
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    network: 'sol',
    type: 'Solana',
    addressFormat: '^[1-9A-HJ-NP-Za-km-z]{32,44}$', // Base58
    explorer: 'https://explorer.solana.com'
  },
  {
    id: 'zcash',
    name: 'Zcash',
    symbol: 'ZEC',
    network: 'zec',
    type: 'Other',
    addressFormat: '^(t1|t3|zs1)[a-zA-Z0-9]{33,94}$', // t-addresses and z-addresses
    explorer: 'https://zcashblockexplorer.com'
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    network: 'eth',
    type: 'EVM',
    addressFormat: '^0x[a-fA-F0-9]{40}$',
    explorer: 'https://etherscan.io'
  },
  {
    id: 'bsc',
    name: 'Binance Smart Chain',
    symbol: 'BNB',
    network: 'bsc',
    type: 'EVM',
    addressFormat: '^0x[a-fA-F0-9]{40}$',
    explorer: 'https://bscscan.com'
  },
  {
    id: 'polygon',
    name: 'Polygon',
    symbol: 'MATIC',
    network: 'polygon',
    type: 'EVM',
    addressFormat: '^0x[a-fA-F0-9]{40}$',
    explorer: 'https://polygonscan.com'
  },
  {
    id: 'avalanche',
    name: 'Avalanche',
    symbol: 'AVAX',
    network: 'avaxc',
    type: 'EVM',
    addressFormat: '^0x[a-fA-F0-9]{40}$',
    explorer: 'https://snowtrace.io'
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum',
    symbol: 'ARB',
    network: 'arbitrum',
    type: 'EVM',
    addressFormat: '^0x[a-fA-F0-9]{40}$',
    explorer: 'https://arbiscan.io'
  },
  {
    id: 'optimism',
    name: 'Optimism',
    symbol: 'OP',
    network: 'optimism',
    type: 'EVM',
    addressFormat: '^0x[a-fA-F0-9]{40}$',
    explorer: 'https://optimistic.etherscan.io'
  },
  {
    id: 'base',
    name: 'Base',
    symbol: 'BASE',
    network: 'base',
    type: 'EVM',
    addressFormat: '^0x[a-fA-F0-9]{40}$',
    explorer: 'https://basescan.org'
  },
  {
    id: 'tron',
    name: 'Tron',
    symbol: 'TRX',
    network: 'trx',
    type: 'Tron',
    addressFormat: '^T[1-9A-HJ-NP-Za-km-z]{33}$',
    explorer: 'https://tronscan.org'
  },
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    network: 'btc',
    type: 'Bitcoin',
    addressFormat: '^(1|3|bc1)[a-zA-HJ-NP-Z0-9]{25,62}$',
    explorer: 'https://blockchain.com'
  }
];

// Validate address format for a given chain
export function validateAddress(address: string, chain: Chain): boolean {
  if (!address) return false;
  
  try {
    const regex = new RegExp(chain.addressFormat);
    return regex.test(address);
  } catch {
    return false;
  }
}

// Get chain by ID
export function getChain(chainId: string): Chain | undefined {
  return CHAINS.find(c => c.id === chainId);
}

// Auto-detect chain from address format
export function detectChain(address: string): Chain | null {
  for (const chain of CHAINS) {
    if (validateAddress(address, chain)) {
      return chain;
    }
  }
  return null;
}
