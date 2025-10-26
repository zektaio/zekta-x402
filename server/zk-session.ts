import crypto from 'crypto';
import { SignJWT, jwtVerify, generateKeyPair, exportJWK, importJWK } from 'jose';
import { verifyProof } from '@semaphore-protocol/proof';

interface ZKSessionPayload {
  sub: string; // zk:<commitment>
  amr: string[]; // ["zk"]
  nonce: string;
  iat: number;
  exp: number;
}

interface NonceCache {
  [nonce: string]: {
    expiresAt: number;
  };
}

export class ZKSessionService {
  private nonces: NonceCache = {};
  private privateKey: CryptoKey | null = null;
  private publicKey: CryptoKey | null = null;
  private readonly NONCE_TTL = 2 * 60 * 1000; // 2 minutes
  private readonly SESSION_TTL = 30 * 24 * 60 * 60; // 30 days (in seconds)
  private readonly ISS = 'https://api.zekta.io';
  private readonly AUD = 'zekta.zksession';

  constructor() {
    this.cleanupExpiredNonces();
  }

  async initialize(): Promise<void> {
    if (this.privateKey) return;

    // Try to load persistent keys from environment
    const storedPrivateKeyJWK = process.env.ZK_SESSION_PRIVATE_KEY;
    const storedPublicKeyJWK = process.env.ZK_SESSION_PUBLIC_KEY;

    if (storedPrivateKeyJWK && storedPublicKeyJWK) {
      // Load existing keys from environment
      try {
        const privateKeyJWK = JSON.parse(storedPrivateKeyJWK);
        const publicKeyJWK = JSON.parse(storedPublicKeyJWK);
        
        this.privateKey = await importJWK(privateKeyJWK, 'EdDSA') as CryptoKey;
        this.publicKey = await importJWK(publicKeyJWK, 'EdDSA') as CryptoKey;
        
        console.log('✅ ZK Session service initialized with persistent EdDSA keys');
        return;
      } catch (error) {
        console.error('⚠️  Failed to load persistent keys, generating new ones:', error);
      }
    }

    // Generate new EdDSA key pair (extractable so we can export to JWK)
    const { publicKey, privateKey } = await generateKeyPair('EdDSA', { extractable: true });
    this.privateKey = privateKey;
    this.publicKey = publicKey;

    // Export keys to JWK format for storage
    const privateKeyJWK = await exportJWK(privateKey);
    const publicKeyJWK = await exportJWK(publicKey);

    console.log('⚠️  NEW ZK SESSION KEYS GENERATED!');
    console.log('📝 To persist sessions across restarts, add these to your secrets:');
    console.log('');
    console.log('ZK_SESSION_PRIVATE_KEY=');
    console.log(JSON.stringify(privateKeyJWK));
    console.log('');
    console.log('ZK_SESSION_PUBLIC_KEY=');
    console.log(JSON.stringify(publicKeyJWK));
    console.log('');
    console.log('✅ ZK Session service initialized with new EdDSA keys (sessions will reset on restart until keys are saved)');
  }

  generateNonce(): string {
    const randomBytes = crypto.randomBytes(16);
    const hash = crypto.createHash('sha256').update(randomBytes).digest();
    const nonceBigInt = BigInt('0x' + hash.toString('hex').slice(0, 32));
    const nonce = nonceBigInt.toString();
    const expiresAt = Date.now() + this.NONCE_TTL;

    this.nonces[nonce] = { expiresAt };

    return nonce;
  }

  private isNonceValid(nonce: string): boolean {
    const cached = this.nonces[nonce];
    if (!cached) return false;

    if (Date.now() > cached.expiresAt) {
      delete this.nonces[nonce];
      return false;
    }

    return true;
  }

  private consumeNonce(nonce: string): void {
    delete this.nonces[nonce];
  }

  private cleanupExpiredNonces(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [nonce, data] of Object.entries(this.nonces)) {
        if (now > data.expiresAt) {
          delete this.nonces[nonce];
        }
      }
    }, 60 * 1000); // Cleanup every minute
  }

  async verifyProofAndMintSession(
    proof: any,
    commitment: string,
    nonce: string,
    merkleTreeRoot?: string
  ): Promise<string> {
    if (!this.privateKey) {
      throw new Error('ZK Session service not initialized');
    }

    // Verify nonce is valid and not expired
    if (!this.isNonceValid(nonce)) {
      throw new Error('Invalid or expired nonce');
    }

    // Prepare proof for verification
    const fullProof: any = {
      merkleTreeDepth: proof.merkleTreeDepth || 16,
      merkleTreeRoot: merkleTreeRoot || proof.merkleTreeRoot || proof.publicSignals?.[0],
      message: nonce, // Bind proof to nonce
      nullifier: proof.nullifier || proof.publicSignals?.[1],
      scope: proof.scope || proof.publicSignals?.[2] || '1',
      points: proof.proof || proof.points,
    };

    // Verify the Semaphore proof
    try {
      await verifyProof(fullProof);
    } catch (error) {
      console.error('❌ ZK proof verification failed:', error);
      throw new Error('Invalid ZK proof');
    }

    // Consume nonce (prevent replay)
    this.consumeNonce(nonce);

    // Mint JWT session
    const now = Math.floor(Date.now() / 1000);
    const zkSession = await new SignJWT({
      sub: `zk:${commitment}`,
      amr: ['zk'],
      nonce,
    })
      .setProtectedHeader({ alg: 'EdDSA' })
      .setIssuer(this.ISS)
      .setAudience(this.AUD)
      .setIssuedAt(now)
      .setExpirationTime(now + this.SESSION_TTL)
      .sign(this.privateKey);

    return zkSession;
  }

  async verifySession(token: string): Promise<ZKSessionPayload> {
    if (!this.publicKey) {
      throw new Error('ZK Session service not initialized');
    }

    try {
      const { payload } = await jwtVerify(token, this.publicKey, {
        issuer: this.ISS,
        audience: this.AUD,
      });

      return payload as unknown as ZKSessionPayload;
    } catch (error) {
      throw new Error('Invalid or expired session token');
    }
  }

  extractCommitment(session: ZKSessionPayload): string {
    // Extract commitment from sub (format: "zk:<commitment>")
    const match = session.sub.match(/^zk:(.+)$/);
    if (!match) {
      throw new Error('Invalid session subject format');
    }
    return match[1];
  }
}

// Singleton instance
export const zkSessionService = new ZKSessionService();
