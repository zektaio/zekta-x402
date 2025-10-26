import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Rocket, Clock, Sparkles, Send, MessageCircle, Globe, BookOpen, Activity, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function ZektaUpdate() {
  const { data: pumpData, isLoading } = useQuery<{
    ok: boolean;
    stats: {
      currentPoolUSD: number;
      cumulativeDistributedUSD: number;
      dexVolumeUSD: number;
      dexRevenueUSD: number;
      zkSwapVolumeUSD: number;
      zkSwapRevenueUSD: number;
      lastUpdated: string;
    };
  }>({
    queryKey: ['/api/stats/pumpfun'],
    refetchInterval: 60000,
  });
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container max-w-4xl mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <Badge className="mb-3 bg-primary/10 text-primary border-primary/20 text-xs md:text-sm" data-testid="badge-new">
            1 Week Live 🚀
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-primary via-purple-400 to-cyan-400 bg-clip-text text-transparent" data-testid="text-page-title">
            Zekta Platform Update
          </h1>
          <p className="text-base md:text-xl text-muted-foreground mb-4 md:mb-8 px-2" data-testid="text-page-subtitle">
            Building the Future of Privacy-Focused Blockchain Interactions
          </p>
          <p className="text-xs md:text-sm text-muted-foreground">
            Published: October 25, 2025
          </p>
        </div>

        {/* Social Links */}
        <Card className="mb-6 md:mb-8 border-primary/20">
          <CardHeader className="pb-3 md:pb-6">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg" data-testid="text-social-title">
              <MessageCircle className="h-4 w-4 md:h-5 md:w-5" />
              Connect With Zekta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 md:gap-3">
              <a href="https://twitter.com/zekta_io" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-1 md:gap-2 h-8 md:h-9" data-testid="button-x">
                  <span className="text-sm md:text-base">𝕏</span>
                </Button>
              </a>
              <a href="/">
                <Button variant="outline" size="sm" className="gap-1 md:gap-2 h-8 md:h-9 text-xs md:text-sm" data-testid="button-website">
                  <Globe className="h-3 w-3 md:h-4 md:w-4" />
                  Website
                </Button>
              </a>
              <a href="/docs">
                <Button variant="outline" size="sm" className="gap-1 md:gap-2 h-8 md:h-9 text-xs md:text-sm" data-testid="button-docs">
                  <BookOpen className="h-3 w-3 md:h-4 md:w-4" />
                  Docs
                </Button>
              </a>
              <a href="https://twitter.com/i/communities/1979587814489792978" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-1 md:gap-2 h-8 md:h-9 text-xs md:text-sm" data-testid="button-x-community">
                  <span className="text-sm md:text-base">𝕏</span> Community
                </Button>
              </a>
              <a href="https://www.coingecko.com/en/coins/zekta" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-1 md:gap-2 h-8 md:h-9 text-xs md:text-sm" data-testid="button-coingecko">
                  CoinGecko
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Stats */}
        <Card className="mb-6 md:mb-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
          <CardHeader className="pb-3 md:pb-6">
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400 text-base md:text-lg" data-testid="text-revenue-title">
              💰 Revenue Distributed to Holders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400" data-testid="text-total-usd">
                  $1,426.48
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">Total Distributed (USD)</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400" data-testid="text-total-sol">
                  8.29 SOL
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">Total Distributed (SOL)</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400" data-testid="text-eligible-holders">
                  22
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">Eligible Holders</p>
              </div>
            </div>
            <div className="mt-4 md:mt-6 p-3 md:p-4 bg-green-100/50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-xs md:text-sm text-green-800 dark:text-green-200 text-center">
                🔄 <strong>Continuous Distribution Model:</strong> Revenue accumulates in the pool and is distributed proportionally to all holders with ≥1 token. No tier multipliers - pure proportional rewards based on holdings.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Active Revenue */}
        <Card className="mb-6 md:mb-8 bg-gradient-to-br from-primary/5 via-purple-500/5 to-cyan-500/5 border-primary/20">
          <CardHeader className="pb-3 md:pb-6">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg" data-testid="text-active-revenue-title">
              <Activity className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              Active Trading Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="text-center">
                    <Skeleton className="h-8 md:h-10 w-32 mb-2 mx-auto" />
                    <Skeleton className="h-3 md:h-4 w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold gradient-text" data-testid="text-active-volume">
                    ${((pumpData?.stats?.dexVolumeUSD || 0) + (pumpData?.stats?.zkSwapVolumeUSD || 0)).toFixed(2)}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1 md:mt-2">Total Volume</p>
                  <p className="text-xs text-muted-foreground">Combined DEX and ZK Swap</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold gradient-text" data-testid="text-active-revenue">
                    ${((pumpData?.stats?.dexRevenueUSD || 0) + (pumpData?.stats?.zkSwapRevenueUSD || 0)).toFixed(2)}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1 md:mt-2">Total Revenue</p>
                  <p className="text-xs text-muted-foreground">Combined fees and swap revenue</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Core Features Live */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" data-testid="text-features-live-title">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Core Features Live
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1" data-testid="text-feature-zk">Zero-Knowledge Identity Generation</h3>
                  <p className="text-sm text-muted-foreground">
                    Client-side ZK identity creation using Semaphore Protocol v4. Users generate cryptographic identities in browser without revealing personal data. Available on <strong>/mvp</strong> page with interactive demo.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1" data-testid="text-feature-swap">Zekta ZK Private Swap</h3>
                  <p className="text-sm text-muted-foreground">
                    Support for 9 chains: SOL, BTC, ETH, USDT, USDC, BNB, MATIC, AVAX, and ZEC (Zcash). Real-time pricing, swap estimates, and order tracking. No KYC required.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1" data-testid="text-feature-telegram">Zekta ZK Private Swap Bot</h3>
                  <p className="text-sm text-muted-foreground">
                    <strong>@zektaswapbot</strong> - Conversational swap interface with inline keyboards, real-time price previews, chain-specific address validation, swap history tracking, and status monitoring. 5-step guided flow.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1" data-testid="text-feature-revenue">Revenue Distribution System</h3>
                  <p className="text-sm text-muted-foreground">
                    Tier-based holder classification (8 tiers: Bronze to Whale). Pure proportional distribution - all holders with ≥1 token are eligible. Continuous accumulation model with permanent pool tracking. Helius DAS API for holder tracking.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1" data-testid="text-feature-tracking">Real-Time Volume Tracking</h3>
                  <p className="text-sm text-muted-foreground">
                    Integration with Helius DAS API for comprehensive holder tracking (up to 100k holders). Dexscreener real-time mode for 24h volume monitoring. Creator rewards calculated as 0.2% of volume. Protocol stats dashboard.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1" data-testid="text-feature-domain">Anonymous Domain Purchase</h3>
                  <p className="text-sm text-muted-foreground">
                    Buy domains with ANY cryptocurrency without KYC. Automated payment flow: User pays crypto → Converted to Zcash → Forwarded to Njalla → Domain registered. Zero-knowledge DNS management using Semaphore Protocol where users prove ownership with domain secrets. Complete privacy: no wallet addresses stored, no email required. Available at <strong>/buy-domain</strong> with full DNS management at <strong>/my-domains</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1" data-testid="text-feature-twitter">Anonymous Twitter Posting (NEW)</h3>
                  <p className="text-sm text-muted-foreground">
                    Post anonymous tweets to <strong>@zektabro</strong> using zero-knowledge session authentication. Features OAuth 2.0 auto-refresh system for Twitter API tokens and persistent ZK session keys with 30-day validity. Users prove identity without revealing wallet addresses or personal data. Complete privacy for social media engagement.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1" data-testid="text-feature-bugs">Bug Bounty Program (NEW)</h3>
                  <p className="text-sm text-muted-foreground">
                    Found a bug? Get paid crypto. Report issues at <strong>/bugs</strong> or <strong>/report-bug</strong> and earn rewards based on severity. Critical bugs get bigger payouts. We're paying the community to make Zekta stronger. Simple process: submit bug, we verify it, you get paid. No bureaucracy, just fast crypto payments for legit reports. Admin panel at <strong>/bugs/admin</strong> tracks everything from new reports to fixed issues.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* In Progress */}
        <Card className="mb-8 border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400" data-testid="text-features-progress-title">
              <Clock className="h-5 w-5" />
              Currently In Development
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1" data-testid="text-progress-docs">Documentation Portal</h3>
                  <p className="text-sm text-muted-foreground">
                    Building comprehensive developer documentation at <strong>/docs</strong>, <strong>/developer</strong>, and <strong>/sdk</strong>. Will feature interactive playground for testing ZK proofs, detailed API references, integration examples, and SDK guides. Professional design with code syntax highlighting, responsive layouts, and real-time examples for developers building on Zekta protocol.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1" data-testid="text-progress-giftcards">Anonymous Gift Card Purchase</h3>
                  <p className="text-sm text-muted-foreground">
                    Will enable users to purchase Amazon and Google Play gift cards anonymously using cryptocurrency with ZK proof authentication. Planned integration with Reloadly API for real-time fulfillment. Designed to deliver complete privacy from payment to redemption - no identity required. Will support multiple cryptocurrencies with instant delivery.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1" data-testid="text-progress-api">Developer API Portal</h3>
                  <p className="text-sm text-muted-foreground">
                    Developer registration, API key generation and management, RESTful API for swap creation/tracking, rate limiting (60 req/min per key), JWT authentication, and comprehensive API documentation at <strong>/api-docs</strong>. Production-ready REST API with language-specific SDKs (JavaScript/TypeScript, Python, Rust).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1" data-testid="text-progress-integration">Enterprise Integration Tools</h3>
                  <p className="text-sm text-muted-foreground">
                    Webhook system for payment notifications, batch operations API, and white-label solutions for businesses wanting to integrate privacy-focused blockchain features.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1" data-testid="text-progress-mobile">Mobile Application</h3>
                  <p className="text-sm text-muted-foreground">
                    Native iOS and Android apps with full ZK proof generation on-device, biometric authentication, and push notifications for swap/domain updates.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Future Vision */}
        <Card className="mb-8 bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" data-testid="text-vision-title">
              <Sparkles className="h-5 w-5 text-primary" />
              Team Vision: The Future of Zekta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3 text-primary">Privacy-First Blockchain Infrastructure</h3>
              <p className="text-muted-foreground mb-4">
                Our vision is to become the leading platform for privacy-focused blockchain interactions. We're building infrastructure that makes zero-knowledge proofs accessible to everyone - from individual users to enterprise developers.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-background rounded-lg border">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Rocket className="h-4 w-4 text-primary" />
                  Decentralized Anonymous Services
                </h4>
                <p className="text-sm text-muted-foreground">
                  Expand beyond domains to hosting, email, VPN, and cloud storage - all purchasable with crypto, managed with ZK proofs, completely anonymous.
                </p>
              </div>

              <div className="p-4 bg-background rounded-lg border">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Rocket className="h-4 w-4 text-primary" />
                  Cross-Chain ZK Protocol
                </h4>
                <p className="text-sm text-muted-foreground">
                  Extend Semaphore Protocol integration to Ethereum, Polygon, Arbitrum, and other EVM chains. Enable private voting, anonymous donations, and confidential transactions across all major blockchains.
                </p>
              </div>

              <div className="p-4 bg-background rounded-lg border">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Rocket className="h-4 w-4 text-primary" />
                  Developer Ecosystem
                </h4>
                <p className="text-sm text-muted-foreground">
                  Build a thriving ecosystem of developers creating privacy-focused dApps using Zekta APIs. Hackathons, grants, and education programs to accelerate ZK adoption.
                </p>
              </div>

              <div className="p-4 bg-background rounded-lg border">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Rocket className="h-4 w-4 text-primary" />
                  Sustainable Revenue Model
                </h4>
                <p className="text-sm text-muted-foreground">
                  Continuous growth through DEX trading fees, swap commissions, domain sales, and API usage. 100% of protocol revenue flows to token holders - creating sustainable passive income.
                </p>
              </div>
            </div>

            <div className="mt-6 p-6 bg-gradient-to-r from-primary/10 via-purple-500/10 to-cyan-500/10 rounded-lg border border-primary/20">
              <h4 className="font-semibold text-lg mb-2">Why Privacy Matters</h4>
              <p className="text-muted-foreground">
                In an era of increasing surveillance and data breaches, financial privacy is not just a feature - it's a fundamental right. Zekta is built on the belief that users should control their data, their identity, and their transactions. Zero-knowledge proofs make this possible without sacrificing security or compliance.
              </p>
            </div>

            <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-lg mb-2 text-green-700 dark:text-green-400">Community-Driven Growth</h4>
              <p className="text-muted-foreground">
                Every feature we build is shaped by community feedback. Our Telegram bot isn't just a swap interface - it's a direct line to our users. We listen, iterate, and deliver. The next 3 months will see explosive growth as we onboard developers, expand integrations, and launch mobile apps.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="bg-gradient-to-br from-primary via-purple-600 to-cyan-600 text-white border-0">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4" data-testid="text-cta-title">
              Join the Privacy Revolution
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Be part of the future. Hold Zekta tokens, earn passive income, and help build the infrastructure for anonymous blockchain interactions.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="/mvp">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100" data-testid="button-mvp">
                  Launch MVP
                </Button>
              </a>
              <a href="/token">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" data-testid="button-tokenomics">
                  Tokenomics
                </Button>
              </a>
              <a href="https://twitter.com/i/communities/1979587814489792978" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" data-testid="button-x-community">
                  X Community
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
