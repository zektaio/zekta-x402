import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';
import { storage } from './storage';

// Use fixed secret from environment or generate one for development
const JWT_SECRET = process.env.JWT_SECRET || 'zekta_dev_secret_change_in_production_2k9mK3nP8qR4sT7vX1zY6wB5cD8fG2hJkkqlqekrio';
const SALT_ROUNDS = 10;

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 60; // 60 requests per minute per key

// In-memory rate limiting (should use Redis/DB in production)
const rateLimitStore = new Map<number, { count: number; resetTime: number }>();

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateJWT(developerId: number, username: string): string {
  return jwt.sign(
    { developerId, username },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyJWT(token: string): { developerId: number; username: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { developerId: number; username: string };
  } catch {
    return null;
  }
}

export function generateApiKey(): string {
  const randomBytes = crypto.randomBytes(24);
  const key = randomBytes.toString('base64url');
  return `zekta_live_${key}`;
}

export function hashApiKey(apiKey: string): string {
  return crypto.createHash('sha256').update(apiKey).digest('hex');
}

export interface AuthenticatedRequest extends Request {
  apiKeyId?: number;
  developerId?: number;
}

export async function validateApiKey(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const apiKey = req.headers['x-api-key'] as string;
    
    if (!apiKey) {
      res.status(401).json({ ok: false, error: 'Missing API key' });
      return;
    }
    
    if (!apiKey.startsWith('zekta_live_')) {
      res.status(401).json({ ok: false, error: 'Invalid API key format' });
      return;
    }
    
    const keyHash = hashApiKey(apiKey);
    const apiKeyRecord = await storage.getApiKeyByHash(keyHash);
    
    if (!apiKeyRecord) {
      res.status(401).json({ ok: false, error: 'Invalid API key' });
      return;
    }
    
    if (apiKeyRecord.isActive !== 1) {
      res.status(401).json({ ok: false, error: 'API key is inactive' });
      return;
    }
    
    // Rate limiting check
    const now = Date.now();
    const keyId = apiKeyRecord.id;
    const rateLimit = rateLimitStore.get(keyId);
    
    if (rateLimit && rateLimit.resetTime > now) {
      // Within rate limit window
      if (rateLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
        res.status(429).json({
          ok: false,
          error: 'Rate limit exceeded',
          retryAfter: Math.ceil((rateLimit.resetTime - now) / 1000)
        });
        return;
      }
      rateLimit.count++;
    } else {
      // Start new rate limit window
      rateLimitStore.set(keyId, {
        count: 1,
        resetTime: now + RATE_LIMIT_WINDOW_MS
      });
    }
    
    req.apiKeyId = apiKeyRecord.id;
    req.developerId = apiKeyRecord.developerId;
    
    await storage.trackApiKeyUsage(apiKeyRecord.id);
    
    next();
  } catch (error) {
    console.error('API key validation error:', error);
    res.status(500).json({ ok: false, error: 'Authentication error' });
  }
}
