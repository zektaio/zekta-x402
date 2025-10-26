import crypto from 'crypto';
import { db } from './db';
import { twitterOAuthState, twitterOAuthTokens } from '@shared/schema';
import { eq, desc } from 'drizzle-orm';

interface TwitterTokens {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

interface TwitterUser {
  id: string;
  name: string;
  username: string;
}

export class TwitterOAuthService {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private isInitialized = false;
  private botAccessToken: string | null = null;
  private botTokenExpiry: number = 0;
  private refreshTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.clientId = process.env.TWITTER_CLIENT_ID || '';
    this.clientSecret = process.env.TWITTER_CLIENT_SECRET || '';
    this.redirectUri = process.env.TWITTER_REDIRECT_URI || '';
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    if (!this.clientId || !this.clientSecret) {
      console.warn('⚠️  Twitter OAuth credentials not configured');
      this.isInitialized = true;
      return;
    }

    // Load existing token from database
    await this.loadTokenFromDatabase();

    // Check and refresh token immediately if needed (within 30-min window)
    try {
      await this.ensureValidToken();
    } catch (error) {
      console.warn('⚠️  Initial token check failed:', error);
    }

    // Start background token refresh timer
    this.startBackgroundRefresh();

    console.log('✅ Twitter OAuth service initialized');
    this.isInitialized = true;
  }

  private async loadTokenFromDatabase(): Promise<void> {
    try {
      const tokens = await db
        .select()
        .from(twitterOAuthTokens)
        .orderBy(desc(twitterOAuthTokens.createdAt))
        .limit(1);

      if (tokens.length > 0) {
        const token = tokens[0];
        const expiresAt = new Date(token.expiresAt).getTime();

        if (expiresAt > Date.now()) {
          this.botAccessToken = token.accessToken;
          this.botTokenExpiry = expiresAt;
          console.log(`✅ Loaded Twitter token for @${token.accountUsername} (expires: ${new Date(expiresAt).toLocaleString()})`);
        } else {
          console.warn(`⚠️  Twitter token for @${token.accountUsername} has expired`);
          // Try to refresh the token on startup
          if (token.refreshToken) {
            try {
              console.log('🔄 Attempting to refresh expired token on startup...');
              // Set temporary values for refresh to work
              this.botAccessToken = token.accessToken;
              this.botTokenExpiry = expiresAt;
              await this.refreshAccessToken();
            } catch (refreshError) {
              console.error('❌ Failed to refresh token on startup:', refreshError);
            }
          }
        }
      }
    } catch (error) {
      console.error('❌ Failed to load Twitter token from database:', error);
    }
  }

  private generateCodeVerifier(): string {
    return crypto.randomBytes(32).toString('base64url');
  }

  private generateCodeChallenge(verifier: string): string {
    return crypto
      .createHash('sha256')
      .update(verifier)
      .digest('base64url');
  }

  private generateState(): string {
    return crypto.randomBytes(32).toString('base64url');
  }

  async getAuthorizationUrl(): Promise<{ url: string; state: string }> {
    if (!this.clientId) {
      throw new Error('Twitter Client ID not configured');
    }

    const state = this.generateState();
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = this.generateCodeChallenge(codeVerifier);

    // Store state and verifier in database
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await db.insert(twitterOAuthState).values({
      state,
      codeVerifier,
      used: false,
      expiresAt,
    });

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: 'tweet.read tweet.write users.read offline.access',
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    const url = `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
    return { url, state };
  }

  async exchangeCodeForTokens(code: string, state: string): Promise<TwitterTokens> {
    // Verify state and get code verifier
    const stateRecord = await db
      .select()
      .from(twitterOAuthState)
      .where(eq(twitterOAuthState.state, state))
      .limit(1);

    if (!stateRecord.length) {
      throw new Error('Invalid OAuth state');
    }

    const { codeVerifier, used, expiresAt } = stateRecord[0];

    if (used) {
      throw new Error('OAuth state already used');
    }

    if (new Date() > new Date(expiresAt)) {
      throw new Error('OAuth state expired');
    }

    // Mark state as used
    await db
      .update(twitterOAuthState)
      .set({ used: true })
      .where(eq(twitterOAuthState.state, state));

    // Exchange code for tokens
    const params = new URLSearchParams({
      code,
      grant_type: 'authorization_code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      code_verifier: codeVerifier,
    });

    const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

    const response = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${credentials}`,
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Twitter token exchange failed:', error);
      throw new Error(`Token exchange failed: ${error}`);
    }

    const tokens: TwitterTokens = await response.json();
    
    // Store bot access token in memory
    this.botAccessToken = tokens.access_token;
    this.botTokenExpiry = Date.now() + (tokens.expires_in * 1000);

    // Get user info to save username
    const userInfo = await this.getUserInfo(tokens.access_token);

    // Save token to database for persistence
    await this.saveTokenToDatabase(tokens, userInfo.username);

    console.log(`✅ Twitter OAuth tokens obtained for @${userInfo.username}`);
    return tokens;
  }

  async getUserInfo(accessToken: string): Promise<TwitterUser> {
    const response = await fetch('https://api.twitter.com/2/users/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get user info: ${error}`);
    }

    const data = await response.json();
    return data.data;
  }

  private async refreshAccessToken(): Promise<void> {
    // Retry with exponential backoff: 3 attempts (0s, 2s, 4s delays)
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 1) {
          const delay = (attempt - 1) * 2000; // 2s, 4s
          console.log(`🔄 Retry ${attempt}/${maxRetries} after ${delay}ms delay...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          console.log('🔄 Attempting to refresh Twitter access token...');
        }

        // Get latest token from database (to get refresh_token)
        const tokens = await db
          .select()
          .from(twitterOAuthTokens)
          .orderBy(desc(twitterOAuthTokens.createdAt))
          .limit(1);

        if (!tokens.length || !tokens[0].refreshToken) {
          throw new Error('No refresh token available. Please re-authorize the Twitter account.');
        }

        const { refreshToken, accountUsername } = tokens[0];

        // Exchange refresh token for new access token
        const params = new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        });

        // Use Basic Auth (same as initial token exchange)
        const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

        const response = await fetch('https://api.twitter.com/2/oauth2/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${credentials}`,
          },
          body: params.toString(),
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(`Twitter API error: ${error}`);
        }

        const newTokens: TwitterTokens = await response.json();

        // Update in-memory token
        this.botAccessToken = newTokens.access_token;
        this.botTokenExpiry = Date.now() + (newTokens.expires_in * 1000);

        // Save new token to database
        await this.saveTokenToDatabase(newTokens, accountUsername);

        console.log(`✅ Twitter token refreshed successfully for @${accountUsername} (expires: ${new Date(this.botTokenExpiry).toLocaleString()})`);
        return; // Success - exit retry loop
      } catch (error: any) {
        lastError = error;
        console.error(`❌ Token refresh attempt ${attempt}/${maxRetries} failed:`, error.message);
        
        // If it's a "no refresh token" error, don't retry
        if (error.message.includes('No refresh token available')) {
          throw error;
        }
      }
    }

    // All retries exhausted
    console.error('❌ All token refresh attempts failed');
    throw new Error('Failed to refresh Twitter token after multiple attempts. Please re-authorize the Twitter account.');
  }

  private async ensureValidToken(): Promise<void> {
    // Check if token is missing or expired
    if (!this.botAccessToken || Date.now() >= this.botTokenExpiry) {
      console.log('⚠️  Twitter token expired, attempting refresh...');
      await this.refreshAccessToken();
      return;
    }

    // Check if token expires in less than 30 minutes - proactively refresh
    const thirtyMinutes = 30 * 60 * 1000;
    if (Date.now() + thirtyMinutes >= this.botTokenExpiry) {
      console.log('⚠️  Twitter token expires soon, proactively refreshing...');
      await this.refreshAccessToken();
    }
  }

  private startBackgroundRefresh(): void {
    // Clear existing timer if any
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }

    // Check token validity every 5 minutes (more aggressive)
    const checkInterval = 5 * 60 * 1000; // 5 minutes

    this.refreshTimer = setInterval(async () => {
      try {
        await this.ensureValidToken();
      } catch (error) {
        console.error('❌ Background token refresh failed:', error);
        // Continue anyway - next check will retry
      }
    }, checkInterval);

    console.log('🔄 Background token refresh started (checks every 5 minutes)');
  }

  async postTweet(text: string, replyToTweetId?: string): Promise<{ id: string; text: string }> {
    // Ensure we have a valid token before posting
    try {
      await this.ensureValidToken();
    } catch (error: any) {
      throw new Error('Decentralized posting relay offline. Your ZK identity remains secure. Please try again later - if issue persists, contact support to restore the gateway.');
    }

    const body: any = { text };
    
    if (replyToTweetId) {
      body.reply = {
        in_reply_to_tweet_id: replyToTweetId,
      };
    }

    const response = await fetch('https://api.twitter.com/2/tweets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.botAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // Handle 401 (unauthorized) - token might have been revoked, try refresh once
    if (response.status === 401) {
      console.log('⚠️  Received 401 from Twitter API, attempting token refresh and retry...');
      try {
        await this.refreshAccessToken();
        
        // Retry the request with new token
        const retryResponse = await fetch('https://api.twitter.com/2/tweets', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.botAccessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        if (!retryResponse.ok) {
          const error = await retryResponse.text();
          console.error('❌ Twitter post failed after refresh:', error);
          throw new Error(`Failed to post tweet: ${error}`);
        }

        const data = await retryResponse.json();
        return data.data;
      } catch (refreshError: any) {
        throw new Error('Decentralized posting relay offline. Your ZK identity remains secure. Please try again later - if issue persists, contact support to restore the gateway.');
      }
    }

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Twitter post failed:', error);
      throw new Error(`Failed to post tweet: ${error}`);
    }

    const data = await response.json();
    return data.data;
  }

  isTokenValid(): boolean {
    return this.botAccessToken !== null && Date.now() < this.botTokenExpiry;
  }

  getBotAccessToken(): string | null {
    return this.isTokenValid() ? this.botAccessToken : null;
  }

  private async saveTokenToDatabase(tokens: TwitterTokens, username: string): Promise<void> {
    try {
      const expiresAt = new Date(Date.now() + (tokens.expires_in * 1000));

      await db.insert(twitterOAuthTokens).values({
        accountUsername: username,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || null,
        tokenType: tokens.token_type,
        scope: tokens.scope,
        expiresAt,
      });

      console.log(`✅ Twitter token saved to database for @${username}`);
    } catch (error) {
      console.error('❌ Failed to save Twitter token to database:', error);
    }
  }
}

// Singleton instance
export const twitterOAuthService = new TwitterOAuthService();
