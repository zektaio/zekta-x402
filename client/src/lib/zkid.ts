// Client-side ZK Identity system using Semaphore Protocol
// No backend dependency - pure browser crypto

import { Identity } from '@semaphore-protocol/identity';

const ZK_ID_KEY = 'zekta_zk_id';
const ZK_GROUP_ID = 42; // Anonymous group for all users

interface ZKIdentity {
  idSecret: string; // Semaphore private key (BigInt as string)
  idCommit: string; // Semaphore commitment (hex)
  publicKey: string; // Semaphore public key (hex)
  groupId: number; // Anonymous group ID
  createdAt: number;
}

// Convert hex to Base58 (Bitcoin style)
const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

function hexToBase58(hex: string): string {
  const bytes = hex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || [];
  let num = BigInt('0x' + hex);
  let base58 = '';
  
  while (num > 0) {
    const remainder = num % 58n;
    base58 = BASE58_ALPHABET[Number(remainder)] + base58;
    num = num / 58n;
  }
  
  // Add leading '1's for leading zero bytes
  for (const byte of bytes) {
    if (byte !== 0) break;
    base58 = '1' + base58;
  }
  
  return base58;
}

// Load existing identity from localStorage
export function loadIdentity(): ZKIdentity | null {
  const stored = localStorage.getItem(ZK_ID_KEY);
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

// Generate new Semaphore identity
export async function generateIdentity(): Promise<ZKIdentity> {
  // Create Semaphore identity
  const semaphoreId = new Identity();
  
  // Serialize public key points to hex
  const pubKey = `${semaphoreId.publicKey[0].toString(16)},${semaphoreId.publicKey[1].toString(16)}`;
  
  const identity: ZKIdentity = {
    idSecret: semaphoreId.privateKey.toString(),
    idCommit: semaphoreId.commitment.toString(16).padStart(64, '0'),
    publicKey: pubKey,
    groupId: ZK_GROUP_ID,
    createdAt: Date.now()
  };
  
  // Persist to localStorage
  localStorage.setItem(ZK_ID_KEY, JSON.stringify(identity));
  
  return identity;
}

// Regenerate identity (delete old one)
export async function regenerateIdentity(): Promise<ZKIdentity> {
  localStorage.removeItem(ZK_ID_KEY);
  return generateIdentity();
}

// Format commit as Base58
export function formatCommitBase58(commit: string): string {
  return hexToBase58(commit);
}

// Format public key as readable string
export function formatPublicKey(pubKey: string): string {
  const [x, y] = pubKey.split(',');
  return `(${x.slice(0, 8)}..., ${y.slice(0, 8)}...)`;
}

// Generate HMAC signature for swap proof
export async function generateSwapProof(
  idSecret: string,
  orderId: string,
  fromChain: string,
  fromToken: string,
  toChain: string,
  toToken: string,
  receiver: string,
  amount: string
): Promise<string> {
  const message = `ZEKTA_SWAP|${orderId}|${fromChain}|${fromToken}|${toChain}|${toToken}|${receiver}|${amount}`;
  
  // Import secret as HMAC key
  const encoder = new TextEncoder();
  const keyData = encoder.encode(idSecret);
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  // Generate signature
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(message)
  );
  
  // Convert to hex
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
