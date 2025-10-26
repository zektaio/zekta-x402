import { Link } from "wouter";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function TwitterTechExplained() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* White Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
        <div className="container flex h-14 items-center justify-between px-3">
          <Link href="/" className="flex items-center" data-testid="link-home">
            <Logo size="md" />
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">Home</Link>
            <Link href="/docs" className="text-sm font-medium text-gray-600 hover:text-gray-900">Docs</Link>
            <Link href="/mvp" className="text-sm font-medium text-gray-600 hover:text-gray-900">Launch MVP</Link>
            <Link href="/bugs" className="text-sm font-medium text-gray-600 hover:text-gray-900">Bug Reports</Link>
            <Link href="/zekta-update">
              <Button size="sm" variant="default" className="gap-2" data-testid="button-project-update">
                <Sparkles className="h-4 w-4" />
                Project Update
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1">
        <div className="container max-w-3xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900" data-testid="text-page-title">
              ZKX Tech Explained + Upcoming Encryption Upgrade
            </h1>
            <p className="text-base text-gray-600" data-testid="text-page-subtitle">
              Clearing up confusion about 𝕏 automation + announcing encrypted identity files
            </p>
          </div>

          {/* TL;DR */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-lg font-bold mb-3 text-gray-900" data-testid="text-tldr-title">TL;DR</h2>
            <div className="space-y-1.5 text-sm text-gray-700">
              <p><strong>1.</strong> Anonymous 𝕏 posting uses official OAuth 2.0 API (not bots)</p>
              <p><strong>2.</strong> ZK proofs authenticate users anonymously. That's the whole thing.</p>
              <p><strong>3.</strong> Coming Soon: Encrypted identity files (no passwords needed)</p>
            </div>
          </div>

          {/* Community Context */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <p className="text-sm text-gray-700 mb-3">
              We've been reading community comments and saw people asking how Zekta's anonymous 𝕏 posting works. Some folks thought it uses headless browser automation or web scraping. Makes sense, ZK identity systems are pretty new.
            </p>
            <p className="text-sm text-gray-700">
              Here's the deal: <strong>Anonymous 𝕏 posting is built on Zekta's ZK identity system (zkID)</strong>. It uses cryptographic proofs to authenticate users without revealing who they are. The 𝕏 integration uses official OAuth 2.0 API. No automation, no ToS violations.
            </p>
          </div>

          {/* Common Misconception */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-lg font-bold mb-3 text-gray-900" data-testid="text-myth-title">Common Misconception</h2>
            <p className="text-sm text-gray-700 mb-2">
              <strong>The Assumption:</strong> "This runs automated servers that maintain persistent logged-in X sessions using headless browser automation and token reuse."
            </p>
            <p className="text-sm text-gray-900 font-semibold">
              Let's clear up how it actually works.
            </p>
          </div>

          {/* Myth vs Reality */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-lg font-bold mb-4 text-gray-900" data-testid="text-comparison-title">Myth vs Reality</h2>
            
            <div className="space-y-4">
              {/* MYTH Section */}
              <div className="pl-3 border-l-4 border-gray-300">
                <h3 className="font-bold text-sm text-gray-900 mb-2">MYTH (What People Think)</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Headless browser automation (Puppeteer/Playwright)</li>
                  <li>• Scraping/bypassing 𝕏 with fake browser sessions</li>
                  <li>• Violates 𝕏 Terms of Service</li>
                  <li>• Will get shut down by 𝕏/Elon</li>
                </ul>
              </div>

              {/* REALITY Section */}
              <div className="pl-3 border-l-4 border-gray-900">
                <h3 className="font-bold text-sm text-gray-900 mb-2">REALITY (What Actually Happens)</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• <strong>Official 𝕏 OAuth 2.0 API</strong> (fully legit)</li>
                  <li>• Admin authorizes @zektabro once via standard OAuth</li>
                  <li>• Tokens stored in DB (standard practice, recommended by 𝕏)</li>
                  <li>• Auto-refresh every 2 hours using OAuth refresh flow</li>
                  <li>• ZK proofs only authenticate users anonymously</li>
                </ul>
              </div>
            </div>
          </div>

          {/* How It Actually Works */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-lg font-bold mb-4 text-gray-900" data-testid="text-how-it-works-title">
              How It Actually Works
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs">1</div>
                <div>
                  <h4 className="font-bold text-sm mb-1 text-gray-900">User Submits Anonymous Tweet</h4>
                  <p className="text-sm text-gray-700">
                    User generates a ZK proof client-side using their Semaphore identity. Proves they're legit without revealing who they are.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs">2</div>
                <div>
                  <h4 className="font-bold text-sm mb-1 text-gray-900">Backend Verifies ZK Proof</h4>
                  <p className="text-sm text-gray-700">
                    Server validates the proof using Semaphore Protocol. If valid, user is authenticated <strong>without</strong> revealing their identity.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs">3</div>
                <div>
                  <h4 className="font-bold text-sm mb-1 text-gray-900">Backend Uses Stored OAuth Tokens</h4>
                  <p className="text-sm text-gray-700">
                    Server grabs the 𝕏 OAuth 2.0 access token from the DB. This token was obtained when @zektabro authorized the app via 𝕏's official OAuth flow.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs">4</div>
                <div>
                  <h4 className="font-bold text-sm mb-1 text-gray-900">Post via Official 𝕏 API v2</h4>
                  <p className="text-sm text-gray-700">
                    Server makes a <code className="px-1.5 py-0.5 bg-gray-100 rounded font-mono text-xs">POST</code> to <code className="px-1.5 py-0.5 bg-gray-100 rounded font-mono text-xs">api.twitter.com/2/tweets</code>. This is 𝕏's official, documented API endpoint.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs">✓</div>
                <div>
                  <h4 className="font-bold text-sm mb-1 text-gray-900">Tweet Appears on @zektabro</h4>
                  <p className="text-sm text-gray-700">
                    Tweet posted. User's identity stays private. 𝕏 sees a normal API request from an authorized app.
                  </p>
                </div>
              </div>
            </div>

            {/* Code Example */}
            <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded">
              <p className="text-xs text-gray-600 mb-2 font-mono">Backend Flow:</p>
              <pre className="text-xs overflow-x-auto text-gray-800 font-mono">
                <code>{`// Verify ZK proof
const isValid = await verifyZKProof(proof);
if (!isValid) throw new Error('Invalid proof');

// Get 𝕏 OAuth token from DB
const token = await db.getTwitterToken();

// Post via official 𝕏 API
await fetch('https://api.twitter.com/2/tweets', {
  method: 'POST',
  headers: { 'Authorization': \`Bearer \${token}\` },
  body: JSON.stringify({ text: userTweet })
});`}</code>
              </pre>
            </div>
          </div>

          {/* OAuth Token Management */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-lg font-bold mb-3 text-gray-900" data-testid="text-oauth-title">
              OAuth Token Management
            </h2>
            
            <p className="text-sm text-gray-700 mb-4">
              Storing OAuth tokens is <strong>not</strong> automation. It's the recommended way to build 𝕏 integrations.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-3 border border-gray-200 rounded">
                <h4 className="font-bold mb-2 text-sm text-gray-900">Token Lifecycle</h4>
                <ul className="text-gray-700 space-y-1 text-xs">
                  <li>• Access token expires every 2 hours</li>
                  <li>• Refresh token gets new access token</li>
                  <li>• Auto-refresh 30 min before expiry</li>
                  <li>• Background checks every 5 min</li>
                </ul>
              </div>

              <div className="p-3 border border-gray-200 rounded">
                <h4 className="font-bold mb-2 text-sm text-gray-900">OAuth Security</h4>
                <ul className="text-gray-700 space-y-1 text-xs">
                  <li>• PKCE (Proof Key for Code Exchange)</li>
                  <li>• State parameter for CSRF protection</li>
                  <li>• Persistent token storage in DB</li>
                  <li>• Scopes: tweet.read, tweet.write, offline.access</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded">
              <p className="text-xs text-gray-700">
                <strong className="text-gray-900">Industry Standard:</strong> Buffer, Hootsuite, TweetDeck, Zapier all work this way. OAuth token storage + refresh flow. This is 𝕏's intended design for third-party apps.
              </p>
            </div>
          </div>

          {/* Why It Won't Get Shut Down */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-lg font-bold mb-3 text-gray-900" data-testid="text-legal-title">
              Why It Won't Get Shut Down
            </h2>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-bold text-sm mb-1 text-gray-900">Official 𝕏 API</h4>
                <p className="text-sm text-gray-700">
                  Uses <code className="px-1.5 py-0.5 bg-gray-100 rounded font-mono text-xs">api.twitter.com/2/tweets</code>. This is literally what 𝕏 designed OAuth for.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-sm mb-1 text-gray-900">Respects Rate Limits</h4>
                <p className="text-sm text-gray-700">
                  All API calls follow 𝕏's rate limits. No aggressive scraping.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-sm mb-1 text-gray-900">No ToS Violation</h4>
                <p className="text-sm text-gray-700">
                  OAuth token storage is explicitly recommended by 𝕏's dev docs. Thousands of apps do this.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-sm mb-1 text-gray-900">Same as Social Media Tools</h4>
                <p className="text-sm text-gray-700">
                  Buffer schedules tweets using OAuth tokens. Hootsuite manages multiple accounts. TweetDeck (owned by 𝕏!) uses persistent sessions. Zekta just adds privacy.
                </p>
              </div>
            </div>
          </div>

          {/* The Zero-Knowledge Proof Innovation */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-lg font-bold mb-3 text-gray-900" data-testid="text-zk-title">
              The ZK Innovation
            </h2>
            
            <p className="text-sm text-gray-700 mb-4">
              The <strong>only</strong> difference between Zekta and traditional tools is the privacy layer:
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="p-3 border border-gray-200 rounded">
                <h4 className="font-bold text-sm mb-1 text-gray-600">Traditional Tools</h4>
                <p className="text-xs text-gray-700">
                  User logs in, identifies themselves, app posts on their behalf
                </p>
              </div>

              <div className="p-3 border-2 border-gray-900 rounded">
                <h4 className="font-bold text-sm mb-1 text-gray-900">Zekta (ZK-Enhanced)</h4>
                <p className="text-xs text-gray-700">
                  User proves membership <strong>anonymously</strong>, app posts without knowing who they are
                </p>
              </div>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-200 rounded">
              <p className="text-xs text-gray-700">
                <strong className="text-gray-900">Key Point:</strong> ZK proofs handle user authentication privacy, not to bypass 𝕏. Backend still uses legitimate OAuth credentials, exactly as 𝕏 intended.
              </p>
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-lg font-bold mb-4 text-gray-900" data-testid="text-faq-title">FAQ</h2>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-sm mb-1 text-gray-900">Q: Is this headless browser automation?</h4>
                <p className="text-sm text-gray-700">
                  <strong>No.</strong> Zero Puppeteer, zero Playwright. Only official 𝕏 API v2.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-sm mb-1 text-gray-900">Q: How does token refresh work?</h4>
                <p className="text-sm text-gray-700">
                  OAuth 2.0 refresh tokens let apps get new access tokens without re-authorization. 𝕏 API returns refresh tokens when you request <code className="px-1.5 py-0.5 bg-gray-100 rounded font-mono text-xs">offline.access</code>.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-sm mb-1 text-gray-900">Q: Can 𝕏 detect this?</h4>
                <p className="text-sm text-gray-700">
                  𝕏 already knows because we're using their official API. When @zektabro authorized the app, 𝕏 recorded it. Every API call includes our app credentials. This is transparent to 𝕏.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-sm mb-1 text-gray-900">Q: What if 𝕏 changes their API?</h4>
                <p className="text-sm text-gray-700">
                  We adapt, just like Buffer, Hootsuite, and every other 𝕏 integration. Using official APIs means we follow 𝕏's migration paths.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-sm mb-1 text-gray-900">Q: Why don't users authorize their own accounts?</h4>
                <p className="text-sm text-gray-700">
                  That would link tweets to specific accounts, breaking anonymity. Users post through a shared account (@zektabro) while proving they're legit via ZK proofs.
                </p>
              </div>
            </div>
          </div>

          {/* Upcoming Feature: Encrypted Identity Files */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-lg font-bold mb-3 text-gray-900" data-testid="text-encryption-title">
              Coming Soon: Encrypted Identity Files
            </h2>
            
            <p className="text-sm text-gray-700 mb-4">
              Right now, when you generate a zkID, it's exported as a plain <code className="px-1.5 py-0.5 bg-gray-100 rounded font-mono text-xs">.json</code> file. Works great for testing, but we're adding encryption for production.
            </p>

            <div className="p-3 border border-gray-200 rounded mb-4">
              <h4 className="font-bold text-sm mb-2 text-gray-900">How It Works</h4>
              <ul className="text-gray-700 space-y-1 text-xs">
                <li>• <strong>Commitment-derived key:</strong> Your ZK commitment generates an AES-256-GCM key (no passwords)</li>
                <li>• <strong>Client-side encryption:</strong> File encrypted in browser before download</li>
                <li>• <strong>Still a .json file:</strong> Mobile-friendly, works on all devices</li>
                <li>• <strong>Backward compatible:</strong> Old unencrypted files still work</li>
              </ul>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-200 rounded mb-4">
              <p className="text-xs text-gray-600 mb-2 font-mono">Encryption Flow:</p>
              <pre className="text-xs overflow-x-auto text-gray-800 font-mono">
                <code>{`const commitment = poseidon([identity.trapdoor, identity.nullifier]);
const key = deriveKey(commitment);
const encrypted = AES256GCM.encrypt(identityJSON, key);
downloadFile('zkid-encrypted.json', encrypted);`}</code>
              </pre>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-200 rounded">
              <p className="text-xs text-gray-700">
                <strong className="text-gray-900">Why .json not .zekta?</strong> Custom extensions don't work on mobile browsers. Your phone needs to recognize the file. <code className="px-1.5 py-0.5 bg-gray-100 rounded font-mono text-xs">.json</code> works everywhere.
              </p>
            </div>
          </div>

          {/* Why We Didn't Start With Encryption */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 text-gray-900" data-testid="text-note-title">
              Why We Didn't Start With Encryption
            </h2>
            
            <p className="text-sm text-gray-700 mb-3">
              Encryption was planned from day one, but we launched MVP without it. Here's why:
            </p>
            <p className="text-sm text-gray-700 mb-3">
              ZK identity systems are new. We wanted people to experiment, learn how commitments work, and understand the privacy model without dealing with encryption complexity. Plain .json files make it easy to inspect, understand, and debug.
            </p>
            <p className="text-sm text-gray-700">
              Now that people are using it for real stuff (domains, 𝕏, gift cards), we're adding encryption. Core system hasn't changed, just hardening it for production.
            </p>
          </div>

          {/* Footer Links */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap gap-3">
            <Link href="/anonymousx">
              <button className="px-5 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-800 font-medium" data-testid="button-try-it">
                Try Anonymous Tweeting
              </button>
            </Link>
            <Link href="/docs">
              <button className="px-5 py-2 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 font-medium" data-testid="button-docs">
                Read Docs
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* White Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-2">
              <Logo size="sm" />
              <span className="text-xs text-gray-600">© 2025 Zekta Protocol</span>
            </div>
            <div className="flex gap-4">
              <Link href="/privacy" className="text-xs text-gray-600 hover:text-gray-900">Privacy</Link>
              <Link href="/terms" className="text-xs text-gray-600 hover:text-gray-900">Terms</Link>
              <Link href="/docs" className="text-xs text-gray-600 hover:text-gray-900">Docs</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
