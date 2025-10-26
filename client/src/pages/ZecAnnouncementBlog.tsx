import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Shield, Lock, Zap, Code2, ArrowRight, CheckCircle2, Clock, Terminal, Database, Network, Key } from 'lucide-react';
import { Link } from 'wouter';

export default function ZecAnnouncementBlog() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/">
          <Button variant="ghost" className="mb-8" data-testid="button-back-home">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <article className="space-y-8">
          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-xs sm:text-sm" data-testid="badge-t-address-live">
                T-Address Live
              </Badge>
              <Badge variant="outline" className="text-xs sm:text-sm" data-testid="badge-z-address-coming">
                Z & U Addresses Coming Soon
              </Badge>
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <time dateTime="2025-10-19">October 19, 2025</time>
                <span className="mx-1 sm:mx-2">•</span>
                <span>12 min read</span>
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text leading-tight">
              Zcash Integration: Building Privacy-First Cryptocurrency Swaps
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed">
              Deep dive into ZEKTA protocol's Zcash integration architecture. T-addresses are production-ready today, 
              with shielded Z-addresses (sapling) and unified U-addresses (orchard) on the technical roadmap.
            </p>
          </header>

          <Card className="border-emerald-500/20 bg-emerald-500/5">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">T-Address Support Production Ready</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    As of October 19, 2025, ZEKTA protocol supports Zcash (ZEC) transparent addresses (T-addresses) 
                    for anonymous cross-chain swaps across 8+ blockchain networks. Users maintain zero-knowledge privacy 
                    through our Semaphore Protocol v4 EdDSA identity system, decoupling swap activity from blockchain identities.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold">Understanding Zcash Address Architecture</h2>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Zcash implements a multi-tier address system, each offering different privacy guarantees and cryptographic protocols. 
                Understanding these address types is critical for building privacy-preserving swap infrastructure.
              </p>
            </div>

            <div className="grid gap-4">
              <Card className="border-emerald-500/20">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h4 className="font-semibold text-sm sm:text-base">T-Addresses (Transparent)</h4>
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-xs">LIVE</Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-3 leading-relaxed">
                        Bitcoin-compatible UTXO model with public transaction visibility. Addresses start with <code className="px-1.5 py-0.5 bg-muted rounded text-xs">t1</code> or <code className="px-1.5 py-0.5 bg-muted rounded text-xs">t3</code>. 
                        While transactions are visible on-chain, ZEKTA's Semaphore Protocol provides off-chain identity anonymization.
                      </p>
                      <div className="p-3 bg-background rounded-lg border border-border overflow-x-auto">
                        <code className="text-xs text-muted-foreground whitespace-nowrap">
                          t1YourZcashTransparentAddress...
                        </code>
                      </div>
                      <div className="mt-3 text-xs text-emerald-500 font-medium">
                        ✓ Supported in production • Swap-ready across all chains
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-amber-500/20">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-amber-500 flex-shrink-0" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h4 className="font-semibold text-sm sm:text-base">Z-Addresses (Shielded - Sapling)</h4>
                        <Badge variant="outline" className="text-xs">Coming Soon</Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-3 leading-relaxed">
                        Full privacy through zk-SNARKs (Sapling protocol). Sender, receiver, and amount completely encrypted on-chain. 
                        Addresses start with <code className="px-1.5 py-0.5 bg-muted rounded text-xs">zs1</code>. Integration requires implementing 
                        Sapling proving system for note commitment verification.
                      </p>
                      <div className="p-3 bg-background rounded-lg border border-border overflow-x-auto">
                        <code className="text-xs text-muted-foreground whitespace-nowrap">
                          zs1YourZcashShieldedSaplingAddress...
                        </code>
                      </div>
                      <div className="mt-3 text-xs text-amber-500 font-medium">
                        ⏳ Technical roadmap Q1 2026 • Sapling prover integration required
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-500/20">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-blue-500 flex-shrink-0" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h4 className="font-semibold text-sm sm:text-base">U-Addresses (Unified - Orchard + Sapling)</h4>
                        <Badge variant="outline" className="text-xs">Coming Soon</Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-3 leading-relaxed">
                        Next-generation unified addresses combining Orchard (Halo 2 protocol) and Sapling pools. 
                        Addresses start with <code className="px-1.5 py-0.5 bg-muted rounded text-xs">u1</code>. Supports cross-pool transactions 
                        with recursive zero-knowledge proofs for enhanced privacy and scalability.
                      </p>
                      <div className="p-3 bg-background rounded-lg border border-border overflow-x-auto">
                        <code className="text-xs text-muted-foreground whitespace-nowrap">
                          u1YourZcashUnifiedOrchardSaplingAddress...
                        </code>
                      </div>
                      <div className="mt-3 text-xs text-blue-500 font-medium">
                        ⏳ Research phase • Orchard + Sapling dual-pool architecture
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold">Double-Layer Privacy Architecture</h2>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                ZEKTA protocol implements a unique dual-privacy architecture by combining Semaphore Protocol's 
                zkSNARK identity proofs with Zcash's blockchain-native privacy primitives. This creates unprecedented 
                anonymity guarantees for cross-chain swaps.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                    <h4 className="font-semibold text-sm sm:text-base">Layer 1: ZEKTA Semaphore Protocol</h4>
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary" />
                      <span>EdDSA identity generation (client-side)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary" />
                      <span>Merkle tree anonymity set (commitment pool)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary" />
                      <span>zkSNARK membership proofs (no identity leak)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary" />
                      <span>Nullifier mechanism (prevent double-spend)</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Network className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                    <h4 className="font-semibold text-sm sm:text-base">Layer 2: Zcash Privacy Primitives</h4>
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary" />
                      <span>T-address: UTXO transparency (current)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary" />
                      <span>Z-address: Sapling shielding (roadmap)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary" />
                      <span>U-address: Orchard + Sapling (research)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary" />
                      <span>Note encryption for receiver anonymity</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start gap-3">
                  <Key className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-2 text-sm sm:text-base">Why Double-Layer Privacy Matters</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Even with T-addresses (which expose transaction amounts on-chain), ZEKTA's Semaphore layer ensures 
                      your swap activity cannot be linked to your real identity. The protocol generates disposable zkIDs 
                      for each swap session, breaking the connection between your wallet and swap history. 
                      When Z/U-addresses are integrated, both layers will provide cryptographic privacy guarantees.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold">Technical Implementation: T-Address Swaps</h2>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Here's the complete technical workflow for executing anonymous Zcash T-address swaps through ZEKTA protocol.
              </p>
            </div>

            <Card>
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold">
                      1
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold mb-2 text-sm sm:text-base">Client-Side Identity Generation</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-3 leading-relaxed">
                        User generates Semaphore v4 EdDSA identity locally using cryptographically secure randomness. 
                        Identity never leaves the client, ensuring no server-side tracking.
                      </p>
                      <div className="p-3 sm:p-4 bg-background rounded-lg border border-border font-mono text-xs space-y-2 overflow-x-auto">
                        <div className="text-muted-foreground">// Client-side TypeScript</div>
                        <div><span className="text-blue-400">import</span> {'{Identity}'} <span className="text-blue-400">from</span> <span className="text-green-400">'@semaphore-protocol/identity'</span>;</div>
                        <div className="h-px bg-border my-2" />
                        <div><span className="text-blue-400">const</span> identity = <span className="text-blue-400">new</span> <span className="text-yellow-400">Identity</span>();</div>
                        <div><span className="text-blue-400">const</span> commitment = identity.<span className="text-yellow-400">commitment</span>;</div>
                        <div className="text-muted-foreground">// commitment: Poseidon hash of private key</div>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-border" />

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold">
                      2
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold mb-2 text-sm sm:text-base">Merkle Tree Commitment Registration</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-3 leading-relaxed">
                        Server inserts commitment into incremental Merkle tree (depth 20, ~1M capacity). 
                        Merkle root anchors anonymity set on-chain for verifiable group membership.
                      </p>
                      <div className="p-3 sm:p-4 bg-background rounded-lg border border-border font-mono text-xs space-y-2 overflow-x-auto">
                        <div className="text-muted-foreground">// Server-side Node.js</div>
                        <div><span className="text-blue-400">import</span> {'{Group}'} <span className="text-blue-400">from</span> <span className="text-green-400">'@semaphore-protocol/core'</span>;</div>
                        <div className="h-px bg-border my-2" />
                        <div><span className="text-blue-400">const</span> group = <span className="text-blue-400">new</span> <span className="text-yellow-400">Group</span>(<span className="text-purple-400">20</span>);</div>
                        <div>group.<span className="text-yellow-400">addMember</span>(commitment);</div>
                        <div><span className="text-blue-400">const</span> merkleRoot = group.<span className="text-yellow-400">root</span>;</div>
                        <div className="text-muted-foreground">// Root stored on Solana for verification</div>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-border" />

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold">
                      3
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold mb-2 text-sm sm:text-base">Swap Initiation with T-Address</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-3 leading-relaxed">
                        User specifies source token (BTC, ETH, SOL, etc.), target ZEC amount, and Zcash T-address. 
                        Exchange API validates address format and generates swap order.
                      </p>
                      <div className="p-3 sm:p-4 bg-background rounded-lg border border-border font-mono text-xs space-y-2 overflow-x-auto">
                        <div className="text-muted-foreground">// API Request</div>
                        <div><span className="text-blue-400">POST</span> /api/swap/create</div>
                        <div className="h-px bg-border my-2" />
                        <div>{'{'}</div>
                        <div className="pl-4"><span className="text-green-400">"currencyFrom"</span>: <span className="text-green-400">"btc"</span>,</div>
                        <div className="pl-4"><span className="text-green-400">"currencyTo"</span>: <span className="text-green-400">"zec"</span>,</div>
                        <div className="pl-4"><span className="text-green-400">"addressTo"</span>: <span className="text-green-400">"t1abc...xyz"</span>,</div>
                        <div className="pl-4"><span className="text-green-400">"zkId"</span>: commitment</div>
                        <div>{'}'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-border" />

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold">
                      4
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold mb-2 text-sm sm:text-base">Zero-Knowledge Proof Generation</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-3 leading-relaxed">
                        Client generates zkSNARK proof demonstrating Merkle tree membership without revealing which 
                        commitment belongs to user. Proof includes nullifier to prevent double-spending.
                      </p>
                      <div className="p-3 sm:p-4 bg-background rounded-lg border border-border font-mono text-xs space-y-2 overflow-x-auto">
                        <div className="text-muted-foreground">// Client generates proof</div>
                        <div><span className="text-blue-400">import</span> {'{generateProof}'} <span className="text-blue-400">from</span> <span className="text-green-400">'@semaphore-protocol/proof'</span>;</div>
                        <div className="h-px bg-border my-2" />
                        <div><span className="text-blue-400">const</span> proof = <span className="text-blue-400">await</span> <span className="text-yellow-400">generateProof</span>(identity, group, signal);</div>
                        <div className="text-muted-foreground">// Proof: {'{merkleRoot, nullifier, snark}'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-border" />

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold">
                      5
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold mb-2 text-sm sm:text-base">Server-Side Proof Verification</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-3 leading-relaxed">
                        Backend verifies zkSNARK proof cryptographically. If valid, confirms user is legitimate group member 
                        without learning their identity. Nullifier checked against database to prevent replay attacks.
                      </p>
                      <div className="p-3 sm:p-4 bg-background rounded-lg border border-border font-mono text-xs space-y-2 overflow-x-auto">
                        <div className="text-muted-foreground">// Server verification</div>
                        <div><span className="text-blue-400">import</span> {'{verifyProof}'} <span className="text-blue-400">from</span> <span className="text-green-400">'@semaphore-protocol/proof'</span>;</div>
                        <div className="h-px bg-border my-2" />
                        <div><span className="text-blue-400">const</span> isValid = <span className="text-blue-400">await</span> <span className="text-yellow-400">verifyProof</span>(proof);</div>
                        <div><span className="text-blue-400">if</span> (isValid) executeSwap();</div>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-border" />

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold">
                      6
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold mb-2 text-sm sm:text-base">Anonymous ZEC Delivery</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-3 leading-relaxed">
                        Exchange executes swap and sends ZEC to user's T-address. While T-address transactions are 
                        visible on Zcash blockchain, the link to user's original identity is cryptographically broken 
                        by Semaphore's anonymity set.
                      </p>
                      <div className="p-3 sm:p-4 bg-primary/10 rounded-lg border border-primary/20 font-mono text-xs overflow-x-auto">
                        <div>✓ Swap complete • Identity protected • No linking possible</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold">Backend Integration: Real Implementation Code</h2>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Here's the actual backend implementation code powering ZEKTA's T-address swap integration, 
                demonstrating how Semaphore EdDSA identities integrate with Zcash transaction relaying.
              </p>
            </div>

            <Card>
              <CardContent className="p-4 sm:p-6">
                <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                  T-Address Swap API Endpoint (Production Code)
                </h4>
                <div className="p-3 sm:p-4 bg-background rounded-lg border border-border font-mono text-xs space-y-2 overflow-x-auto">
                  <div className="text-muted-foreground">// server/routes.ts - Real production endpoint</div>
                  <div><span className="text-blue-400">import</span> {'{verifyProof}'} <span className="text-blue-400">from</span> <span className="text-green-400">'@semaphore-protocol/proof'</span>;</div>
                  <div><span className="text-blue-400">import</span> {'{Connection, Keypair, PublicKey}'} <span className="text-blue-400">from</span> <span className="text-green-400">'@solana/web3.js'</span>;</div>
                  <div className="h-px bg-border my-2" />
                  <div><span className="text-blue-400">app</span>.<span className="text-yellow-400">post</span>(<span className="text-green-400">'/api/swap/create'</span>, <span className="text-blue-400">async</span> (req, res) =&gt; {'{'}</div>
                  <div className="pl-4"><span className="text-blue-400">const</span> {'{'} currencyFrom, currencyTo, addressTo, zkId, proof {'}'} = req.body;</div>
                  <div className="pl-4 text-muted-foreground">// Step 1: Verify EdDSA-based zkSNARK proof</div>
                  <div className="pl-4"><span className="text-blue-400">const</span> isValid = <span className="text-blue-400">await</span> <span className="text-yellow-400">verifyProof</span>(proof);</div>
                  <div className="pl-4"><span className="text-blue-400">if</span> (!isValid) <span className="text-blue-400">return</span> res.<span className="text-yellow-400">status</span>(<span className="text-purple-400">403</span>).<span className="text-yellow-400">json</span>({'{'}error: <span className="text-green-400">'Invalid proof'</span>{'}'});</div>
                  <div className="h-px bg-border my-2" />
                  <div className="pl-4 text-muted-foreground">// Step 2: Validate Zcash T-address format</div>
                  <div className="pl-4"><span className="text-blue-400">const</span> isZcashTAddress = addressTo.<span className="text-yellow-400">match</span>(<span className="text-red-400">/^t[13][a-zA-Z0-9]{'{'}33{'}'}$/</span>);</div>
                  <div className="pl-4"><span className="text-blue-400">if</span> (currencyTo === <span className="text-green-400">'zec'</span> && !isZcashTAddress) {'{'}</div>
                  <div className="pl-8"><span className="text-blue-400">return</span> res.<span className="text-yellow-400">status</span>(<span className="text-purple-400">400</span>).<span className="text-yellow-400">json</span>({'{'}error: <span className="text-green-400">'Invalid ZEC T-address'</span>{'}'});</div>
                  <div className="pl-4">{'}'}</div>
                  <div className="h-px bg-border my-2" />
                  <div className="pl-4 text-muted-foreground">// Step 3: Create swap order with exchange API</div>
                  <div className="pl-4"><span className="text-blue-400">const</span> swap = <span className="text-blue-400">await</span> swapClient.<span className="text-yellow-400">createSwap</span>({'{'}currencyFrom, currencyTo, addressTo{'}'});</div>
                  <div className="pl-4 text-muted-foreground">// Step 4: Store zkId for anonymity tracking</div>
                  <div className="pl-4"><span className="text-blue-400">await</span> storage.<span className="text-yellow-400">recordSwap</span>({'{'}zkId, orderId: swap.id, network: <span className="text-green-400">'zcash'</span>{'}'});</div>
                  <div className="pl-4"><span className="text-blue-400">return</span> res.<span className="text-yellow-400">json</span>(swap);</div>
                  <div>{'}'});</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 sm:p-6">
                <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <Key className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                  EdDSA Identity Generation (Client-Side)</h4>
                <div className="p-3 sm:p-4 bg-background rounded-lg border border-border font-mono text-xs space-y-2 overflow-x-auto">
                  <div className="text-muted-foreground">// client/src/lib/semaphore.ts - EdDSA keypair generation</div>
                  <div><span className="text-blue-400">import</span> {'{Identity}'} <span className="text-blue-400">from</span> <span className="text-green-400">'@semaphore-protocol/identity'</span>;</div>
                  <div><span className="text-blue-400">import</span> {'{deriveSecretScalar}'} <span className="text-blue-400">from</span> <span className="text-green-400">'@zk-kit/eddsa-poseidon'</span>;</div>
                  <div className="h-px bg-border my-2" />
                  <div><span className="text-blue-400">export function</span> <span className="text-yellow-400">generateZkIdentity</span>() {'{'}</div>
                  <div className="pl-4 text-muted-foreground">// Generate EdDSA keypair using 32-byte random secret</div>
                  <div className="pl-4"><span className="text-blue-400">const</span> identity = <span className="text-blue-400">new</span> <span className="text-yellow-400">Identity</span>();</div>
                  <div className="pl-4 text-muted-foreground">// EdDSA private key (Fr scalar in Baby Jubjub curve)</div>
                  <div className="pl-4"><span className="text-blue-400">const</span> privateKey = <span className="text-yellow-400">deriveSecretScalar</span>(identity.<span className="text-yellow-400">secret</span>);</div>
                  <div className="pl-4 text-muted-foreground">// Poseidon hash commitment for Merkle tree</div>
                  <div className="pl-4"><span className="text-blue-400">const</span> commitment = identity.<span className="text-yellow-400">commitment</span>;</div>
                  <div className="pl-4"><span className="text-blue-400">return</span> {'{'} identity, privateKey, commitment {'}'};</div>
                  <div>{'}'}</div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold">Roadmap: Z-Address & U-Address Integration</h2>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Our engineering roadmap prioritizes integrating Zcash's advanced shielded address protocols to provide 
                triple-layer privacy: Semaphore EdDSA identity proofs + Sapling/Orchard note encryption + on-chain shielding.
              </p>
            </div>

            <div className="grid gap-4">
              <Card className="border-amber-500/20 bg-amber-500/5">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                        <Code2 className="w-6 h-6 text-amber-500 flex-shrink-0" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h4 className="font-semibold text-sm sm:text-base">Phase 1: Z-Address (Sapling Protocol)</h4>
                        <Badge variant="outline" className="text-xs">Q1 2026</Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-4 leading-relaxed">
                        Integrate Zcash Sapling shielded addresses (zs1) to encrypt transaction amounts and receiver identities on-chain. 
                        Requires implementing Sapling proving system with Groth16 zkSNARKs for note commitments and spend authorization.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2 text-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                          <span className="text-muted-foreground leading-relaxed"><strong>Task 1.1:</strong> Integrate librustzcash for Sapling prover and verifier functions</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                          <span className="text-muted-foreground leading-relaxed"><strong>Task 1.2:</strong> Implement note commitment scheme using Pedersen hash</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                          <span className="text-muted-foreground leading-relaxed"><strong>Task 1.3:</strong> Build note encryption layer with ChaCha20Poly1305 AEAD</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                          <span className="text-muted-foreground leading-relaxed"><strong>Task 1.4:</strong> Implement spend/output Groth16 proof generation pipeline</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                          <span className="text-muted-foreground leading-relaxed"><strong>Task 1.5:</strong> Add Merkle anchor synchronization with Zcash full nodes</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                          <span className="text-muted-foreground leading-relaxed"><strong>Task 1.6:</strong> Security audit for shielded pool integration and note handling</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-500/20 bg-blue-500/5">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <Database className="w-6 h-6 text-blue-500 flex-shrink-0" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h4 className="font-semibold text-sm sm:text-base">Phase 2: U-Address (Orchard + Sapling Unified)</h4>
                        <Badge variant="outline" className="text-xs">Research Phase</Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-4 leading-relaxed">
                        Implement Zcash unified addresses (u1) supporting both Orchard protocol (Halo 2 recursive proofs, no trusted setup) 
                        and Sapling pools. Enables cross-pool transactions with superior scalability through proof composition.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2 text-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                          <span className="text-muted-foreground leading-relaxed"><strong>Task 2.1:</strong> Research Halo 2 IPA polynomial commitment scheme architecture</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                          <span className="text-muted-foreground leading-relaxed"><strong>Task 2.2:</strong> Integrate halo2 crate for recursive zkSNARK proof composition</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                          <span className="text-muted-foreground leading-relaxed"><strong>Task 2.3:</strong> Implement Orchard action circuit for spend/output verification</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                          <span className="text-muted-foreground leading-relaxed"><strong>Task 2.4:</strong> Build unified address parser supporting Orchard + Sapling receivers</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                          <span className="text-muted-foreground leading-relaxed"><strong>Task 2.5:</strong> Design cross-pool transaction routing (Orchard ↔ Sapling)</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                          <span className="text-muted-foreground leading-relaxed"><strong>Task 2.6:</strong> Implement Sinsemilla commitment tree for Orchard note anchoring</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-2 text-sm sm:text-base">Architectural Alignment with Zero-Knowledge Principles</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Integrating Z/U-addresses aligns perfectly with ZEKTA's zero-knowledge architecture. 
                      Both Semaphore Protocol and Zcash's Sapling/Orchard use zk-SNARKs for privacy, creating a cohesive 
                      cryptographic stack. The proving systems can potentially share trusted setups and circuit optimizations, 
                      reducing computational overhead while maximizing privacy guarantees.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold">Supported Networks</h2>
            
            <p className="text-muted-foreground">
              Swap Zcash (ZEC) with any of these blockchain networks while maintaining zero-knowledge privacy:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-sm font-semibold mb-1">ZEC</div>
                  <div className="text-xs text-muted-foreground">Zcash</div>
                  <Badge className="mt-2 bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-xs">T-Address Live</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-sm font-semibold mb-1">BTC</div>
                  <div className="text-xs text-muted-foreground">Bitcoin</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-sm font-semibold mb-1">ETH</div>
                  <div className="text-xs text-muted-foreground">Ethereum</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-sm font-semibold mb-1">SOL</div>
                  <div className="text-xs text-muted-foreground">Solana</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-sm font-semibold mb-1">USDT</div>
                  <div className="text-xs text-muted-foreground">Multi-chain</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-sm font-semibold mb-1">USDC</div>
                  <div className="text-xs text-muted-foreground">Multi-chain</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-sm font-semibold mb-1">BNB</div>
                  <div className="text-xs text-muted-foreground">BSC</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-sm font-semibold mb-1">TRX</div>
                  <div className="text-xs text-muted-foreground">Tron</div>
                </CardContent>
              </Card>
            </div>
          </section>

          <Card className="border-primary/30 bg-primary/10">
            <CardContent className="p-4 sm:p-6 lg:p-8 text-center">
              <h3 className="text-xl sm:text-2xl font-bold mb-3">Start Swapping with Zcash T-Addresses Today</h3>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto mb-6 leading-relaxed">
                Experience privacy-first cryptocurrency swaps with Zcash T-address support now available on ZEKTA protocol. 
                Swap ZEC with BTC, ETH, SOL, and 5+ other networks while maintaining complete anonymity through 
                Semaphore Protocol's zero-knowledge identity proofs.
              </p>
              <div className="flex gap-2 sm:gap-3 justify-center flex-wrap">
                <Link href="/mvp">
                  <Button size="lg" data-testid="button-try-zec-swaps">
                    <Zap className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="hidden sm:inline">Try ZEC Swaps Now</span>
                    <span className="sm:hidden">Try Swaps</span>
                  </Button>
                </Link>
                <Link href="/docs">
                  <Button size="lg" variant="outline" data-testid="button-read-technical-docs">
                    <Terminal className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="hidden sm:inline">Read Technical Docs</span>
                    <span className="sm:hidden">Read Docs</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </article>
      </div>
    </div>
  );
}
