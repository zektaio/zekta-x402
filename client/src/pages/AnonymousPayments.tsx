import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Clock,
  Gift,
  ShoppingBag,
  Smartphone,
  Gamepad2,
  Music,
  EyeOff,
  Coins,
  Zap,
  CheckCircle2,
  Code,
  Terminal,
  Lock,
  ShieldCheck,
  Wallet,
  ArrowRight,
  FileKey,
  DollarSign,
  Send,
  Download
} from 'lucide-react';
import { Link } from 'wouter';

export default function AnonymousPayments() {
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
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <time dateTime="2025-10-22">October 22, 2025</time>
              <span className="mx-2">•</span>
              <span>6 min read</span>
              <span className="mx-2">•</span>
              <Badge className="bg-primary/20 text-primary border-primary/30" data-testid="badge-coming-soon">
                <Zap className="w-3 h-3 mr-1" />
                Coming Soon
              </Badge>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold gradient-text leading-tight">
              Anonymous Digital Payments
            </h1>
            
            <p className="text-xl text-muted-foreground">
              Buy gift cards with zero-knowledge identity. No email. No KYC. No personal data required.
            </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <EyeOff className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold" data-testid="text-privacy">100% Private</div>
                <div className="text-sm text-muted-foreground">Zero personal info</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Coins className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold" data-testid="text-cryptocurrencies">9 Cryptocurrencies</div>
                <div className="text-sm text-muted-foreground">BTC, ETH, SOL & more</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Zap className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold" data-testid="text-delivery">Instant Delivery</div>
                <div className="text-sm text-muted-foreground">Gift codes in seconds</div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Gift className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-2">The Future of Private Purchases</h3>
                  <p className="text-sm text-muted-foreground">
                    Once our API and SDK are released, you will be able to purchase gift cards for Amazon, Google Play, Steam, and Spotify 
                    using cryptocurrency with complete privacy. Just upload your passkey and receive your gift card code instantly.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold">Supported Gift Cards</h2>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Buy digital gift cards anonymously with cryptocurrency. No email verification, no KYC, no personal data collection.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">Amazon Gift Cards</h4>
                      <Badge variant="secondary" className="mb-2">Most Popular</Badge>
                      <p className="text-sm text-muted-foreground mb-3">
                        Shop millions of products on Amazon without revealing your identity.
                      </p>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>$10, $25, $50, $100, $200, $500</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>Instant delivery</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Smartphone className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">Google Play Gift Cards</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Access apps, games, movies, and books on Google Play privately.
                      </p>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>$10, $25, $50, $100</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>Valid globally</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Gamepad2 className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">Steam Gift Cards</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Purchase games and downloadable content on Steam anonymously.
                      </p>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>$20, $50, $100</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>Worldwide redemption</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Music className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">Spotify Gift Cards</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Enjoy premium music streaming without linking your identity.
                      </p>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>1, 3, 6, 12 month subscriptions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>No personal data required</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold">Purchase Flow</h2>
            
            <Card>
              <CardContent className="p-4 sm:p-8">
                <div className="relative">
                  <div className="space-y-6 sm:space-y-8">
                    {/* Step 1 */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                      <div className="hidden sm:block w-24 md:w-32 text-left sm:text-right font-semibold text-sm flex-shrink-0">Select Product</div>
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center border-2 border-primary/30 flex-shrink-0">
                        <ShoppingBag className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="sm:hidden font-semibold text-sm mb-1 text-primary">Step 1: Select Product</div>
                        <div className="text-sm text-muted-foreground font-semibold mb-1">Choose Gift Card & Amount</div>
                        <div className="text-xs text-muted-foreground">Amazon ($10-$500), Google Play ($10-$100), Steam, Spotify</div>
                      </div>
                    </div>

                    <div className="pl-6 sm:pl-24 md:pl-32 sm:ml-6">
                      <div className="h-8 sm:h-12 border-l-2 border-primary/30 border-dashed" />
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                      <div className="hidden sm:block w-24 md:w-32 text-left sm:text-right font-semibold text-sm flex-shrink-0">Pay with Crypto</div>
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center border-2 border-primary/30 flex-shrink-0">
                        <Wallet className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="sm:hidden font-semibold text-sm mb-1 text-primary">Step 2: Pay with Crypto</div>
                        <div className="text-sm text-muted-foreground font-semibold mb-1">Send Cryptocurrency Payment</div>
                        <div className="text-xs text-muted-foreground">BTC, ETH, SOL, USDT, USDC, BNB, MATIC, AVAX, ZEC</div>
                      </div>
                    </div>

                    <div className="pl-6 sm:pl-24 md:pl-32 sm:ml-6">
                      <div className="h-8 sm:h-12 border-l-2 border-primary/30 border-dashed" />
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                      <div className="hidden sm:block w-24 md:w-32 text-left sm:text-right font-semibold text-sm flex-shrink-0">Upload Passkey</div>
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center border-2 border-primary/30 flex-shrink-0">
                        <FileKey className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="sm:hidden font-semibold text-sm mb-1 text-primary">Step 3: Upload Passkey</div>
                        <div className="text-sm text-muted-foreground font-semibold mb-1">Zero-Knowledge Authentication</div>
                        <div className="text-xs text-muted-foreground">Prove ownership without revealing identity. No email or KYC</div>
                      </div>
                    </div>

                    <div className="pl-6 sm:pl-24 md:pl-32 sm:ml-6">
                      <div className="h-8 sm:h-12 border-l-2 border-primary/30 border-dashed" />
                    </div>

                    {/* Step 4 */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                      <div className="hidden sm:block w-24 md:w-32 text-left sm:text-right font-semibold text-sm flex-shrink-0">Receive Code</div>
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center border-2 border-primary/30 flex-shrink-0">
                        <Download className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="sm:hidden font-semibold text-sm mb-1 text-primary">Step 4: Receive Code</div>
                        <div className="text-sm text-muted-foreground font-semibold mb-1">Instant Gift Card Delivery</div>
                        <div className="text-xs text-muted-foreground">Get your code in seconds, redeem immediately</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold">Payment Processing</h2>
            
            <Card>
              <CardContent className="p-4 sm:p-8">
                <div className="relative">
                  <div className="space-y-6 sm:space-y-8">
                    {/* Your Wallet */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                      <div className="hidden sm:block w-24 md:w-32 text-left sm:text-right font-semibold text-sm flex-shrink-0">Your Wallet</div>
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center border-2 border-primary/30 flex-shrink-0">
                        <Wallet className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="sm:hidden font-semibold text-sm mb-1 text-primary">Your Wallet</div>
                        <div className="text-sm text-muted-foreground">Send cryptocurrency from any wallet</div>
                        <div className="text-xs text-muted-foreground mt-1">No wallet connection required</div>
                      </div>
                    </div>

                    <div className="pl-6 sm:pl-24 md:pl-32 sm:ml-6">
                      <div className="h-8 sm:h-12 border-l-2 border-primary/30 border-dashed" />
                    </div>

                    {/* Zekta Platform */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                      <div className="hidden sm:block w-24 md:w-32 text-left sm:text-right font-semibold text-sm flex-shrink-0">Zekta Platform</div>
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center border-2 border-primary/30 flex-shrink-0">
                        <ShieldCheck className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="sm:hidden font-semibold text-sm mb-1 text-primary">Zekta Platform</div>
                        <div className="text-sm text-muted-foreground">Payment verified & ZK proof validated</div>
                        <div className="text-xs text-muted-foreground mt-1">Semaphore Protocol ensures complete anonymity</div>
                      </div>
                    </div>

                    <div className="pl-6 sm:pl-24 md:pl-32 sm:ml-6">
                      <div className="h-8 sm:h-12 border-l-2 border-primary/30 border-dashed" />
                    </div>

                    {/* Gift Card Provider */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                      <div className="hidden sm:block w-24 md:w-32 text-left sm:text-right font-semibold text-sm flex-shrink-0">Provider API</div>
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center border-2 border-primary/30 flex-shrink-0">
                        <Send className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="sm:hidden font-semibold text-sm mb-1 text-primary">Provider API</div>
                        <div className="text-sm text-muted-foreground">Gift card purchased from trusted provider</div>
                        <div className="text-xs text-muted-foreground mt-1">Tremendous, Giftbit, or IppoCLoud API</div>
                      </div>
                    </div>

                    <div className="pl-6 sm:pl-24 md:pl-32 sm:ml-6">
                      <div className="h-8 sm:h-12 border-l-2 border-primary/30 border-dashed" />
                    </div>

                    {/* Delivery */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                      <div className="hidden sm:block w-24 md:w-32 text-left sm:text-right font-semibold text-sm flex-shrink-0">Delivery</div>
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center border-2 border-primary/30 flex-shrink-0">
                        <CheckCircle2 className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="sm:hidden font-semibold text-sm mb-1 text-primary">Delivery</div>
                        <div className="text-sm text-muted-foreground">Gift card code delivered instantly</div>
                        <div className="text-xs text-muted-foreground mt-1">No personal data stored or linked to purchase</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold">Privacy Guarantees</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">No Personal Data</h4>
                      <p className="text-sm text-muted-foreground">
                        No email, no phone number, no identity verification. Just your ZK passkey.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">Zero-Knowledge Proofs</h4>
                      <p className="text-sm text-muted-foreground">
                        Powered by Semaphore Protocol. Prove ownership without revealing your identity.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <EyeOff className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">No Transaction Linking</h4>
                      <p className="text-sm text-muted-foreground">
                        Each purchase is independent. No correlation between your different gift card orders.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Coins className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">Multi-Chain Support</h4>
                      <p className="text-sm text-muted-foreground">
                        Pay with your preferred cryptocurrency across 9 different blockchain networks.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold">Built on Zekta API</h2>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Anonymous digital payments will be available through Zekta's REST API and TypeScript SDK, 
                allowing any developer to integrate privacy-first gift card purchases into their applications.
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Terminal className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Example API Integration</h4>
                    <p className="text-sm text-muted-foreground">
                      Simple REST API call to purchase gift cards anonymously
                    </p>
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                  <pre className="text-muted-foreground">{`POST /api/gift-cards/purchase

{
  "type": "amazon",
  "amount": 50,
  "currency": "SOL",
  "passkey": "your-zk-passkey"
}

Response:
{
  "success": true,
  "giftCardCode": "XXXX-XXXX-XXXX",
  "expiresAt": "2026-10-22T00:00:00Z"
}`}</pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Code className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">TypeScript SDK</h4>
                    <p className="text-sm text-muted-foreground">
                      Type-safe SDK for easy integration
                    </p>
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                  <pre className="text-muted-foreground">{`import { ZektaClient } from '@zekta/sdk';

const zekta = new ZektaClient();

const giftCard = await zekta.giftCards.purchase({
  type: 'amazon',
  amount: 50,
  currency: 'SOL',
  passkey: yourPasskey
});

console.log(giftCard.code); // XXXX-XXXX-XXXX`}</pre>
                </div>
              </CardContent>
            </Card>
          </section>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-2">Coming Soon</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Anonymous digital payments will be available when our API and SDK are released. 
                    Stay tuned for updates on our official launch date.
                  </p>
                  <Link href="/docs">
                    <Button variant="outline" size="sm" data-testid="button-view-docs">
                      <Code className="w-4 h-4 mr-2" />
                      View Documentation
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </article>
      </div>
    </div>
  );
}
