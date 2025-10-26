/**
 * Zekta Protocol SDK
 * Zero-Knowledge Identity & Authentication SDK for privacy-preserving applications
 * 
 * @example
 * // Generate and download identity
 * const identity = ZektaSDK.generateIdentity();
 * ZektaSDK.downloadIdentity(identity, 'my-app-user-123');
 * 
 * // Upload and authenticate
 * const secret = await ZektaSDK.uploadIdentityFile(fileInput);
 * const proof = await ZektaSDK.generateProof(secret, group, message);
 */

import { Identity } from '@semaphore-protocol/identity';
import { Group } from '@semaphore-protocol/group';
import { generateProof as semaphoreGenerateProof } from '@semaphore-protocol/proof';

export interface ZektaIdentity {
  secret: string;
  commitment: string;
}

export interface ZektaProof {
  merkleTreeDepth: number;
  merkleTreeRoot: string;
  nullifier: string;
  message: string;
  scope: string;
  points: string[];
}

export class ZektaSDK {
  /**
   * Generate a new zero-knowledge identity (CLIENT-SIDE)
   * Use this when you want client to generate their own identity
   * 
   * @returns Identity secret as comma-separated string
   */
  static generateIdentity(): string {
    const identity = new Identity();
    // @ts-ignore - accessing private field for serialization
    return identity._privateKey ? identity._privateKey.toString() : String(identity);
  }

  /**
   * Reconstruct identity from secret string
   * Secret format: "25,90,166,4,76,102..." (comma-separated numbers)
   * 
   * @param secret - Identity secret string
   * @returns Semaphore Identity object
   */
  static reconstructIdentity(secret: string): Identity {
    const privateKeyArray = new Uint8Array(
      secret.split(',').map(n => parseInt(n.trim(), 10))
    );
    return new Identity(privateKeyArray);
  }

  /**
   * Get commitment from secret
   * 
   * @param secret - Identity secret string
   * @returns Commitment as bigint string
   */
  static getCommitment(secret: string): string {
    const identity = this.reconstructIdentity(secret);
    return identity.commitment.toString();
  }

  /**
   * Download identity as JSON file
   * 
   * @param secret - Identity secret string
   * @param userId - Unique identifier for this identity (e.g., order ID, user ID)
   * @param appName - Your application name
   * @param metadata - Additional metadata to include in file
   */
  static downloadIdentity(
    secret: string,
    userId: string,
    appName: string = 'Zekta',
    metadata: Record<string, any> = {}
  ): void {
    const identityData = {
      zkPasskey: secret,
      userId,
      app: appName,
      created: new Date().toISOString(),
      warning: "WARNING: Keep this file safe! We cannot recover this passkey if you lose it.",
      ...metadata
    };
    
    const blob = new Blob(
      [JSON.stringify(identityData, null, 2)],
      { type: 'application/json' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${appName.toLowerCase()}-passkey-${userId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Parse identity from uploaded file
   * Supports JSON format with 'zkPasskey', 'giftCardPasskey', or 'domainSecret' fields
   * Also supports plain text comma-separated format
   * 
   * @param file - File object from input[type="file"]
   * @returns Promise<string> - Identity secret string
   * @throws Error if file is invalid or secret not found
   */
  static async uploadIdentityFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target?.result as string;
        let secret = '';
        
        // Try JSON format first
        try {
          const data = JSON.parse(content);
          // Support multiple field names for compatibility
          secret = data.zkPasskey || data.giftCardPasskey || data.domainSecret || '';
          secret = String(secret).trim();
        } catch (jsonError) {
          // Try plain text format (comma-separated numbers)
          const trimmed = content.trim();
          if (trimmed.match(/^[\d,\s]+$/)) {
            secret = trimmed;
          }
        }
        
        if (secret && secret.length > 20) {
          resolve(secret);
        } else {
          reject(new Error(`Invalid passkey file. Secret length: ${secret?.length || 0}`));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  /**
   * Generate zero-knowledge proof for authentication
   * 
   * @param secret - Identity secret string
   * @param groupMembers - Array of commitment strings (group members)
   * @param message - Message to sign (usually commitment or unique identifier)
   * @param externalNullifier - External nullifier (usually commitment or app-specific ID)
   * @returns ZK proof object
   */
  static async generateProof(
    secret: string,
    groupMembers: string[],
    message: string,
    externalNullifier: string
  ): Promise<ZektaProof> {
    const identity = this.reconstructIdentity(secret);
    const group = new Group(groupMembers);
    
    const proof = await semaphoreGenerateProof(
      identity,
      group,
      externalNullifier,
      message
    );
    
    return {
      merkleTreeDepth: proof.merkleTreeDepth,
      merkleTreeRoot: proof.merkleTreeRoot,
      nullifier: proof.nullifier,
      message: proof.message,
      scope: proof.scope,
      points: proof.points
    };
  }

  /**
   * Save identity to localStorage
   * 
   * @param storageKey - LocalStorage key
   * @param identity - Identity object with secret and metadata
   */
  static saveToLocalStorage(storageKey: string, identity: Record<string, any>): void {
    const existing = localStorage.getItem(storageKey);
    const identities = existing ? JSON.parse(existing) : [];
    identities.push(identity);
    localStorage.setItem(storageKey, JSON.stringify(identities));
  }

  /**
   * Load identities from localStorage
   * 
   * @param storageKey - LocalStorage key
   * @returns Array of saved identities
   */
  static loadFromLocalStorage(storageKey: string): any[] {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  }
}

/**
 * Server-side helper for generating identity
 * Use this in your backend API to generate identity server-side
 * 
 * @example
 * import { Identity } from '@semaphore-protocol/identity';
 * 
 * const identity = new Identity();
 * const commitment = identity.commitment.toString();
 * // @ts-ignore
 * const secret = identity._privateKey ? identity._privateKey.toString() : String(identity);
 * 
 * res.json({ zkCommitment: commitment, zkSecret: secret });
 */
export const serverGenerateIdentity = () => {
  const identity = new Identity();
  const commitment = identity.commitment.toString();
  // @ts-ignore - accessing private field for serialization
  const secret = identity._privateKey ? identity._privateKey.toString() : String(identity);
  
  return { commitment, secret };
};
