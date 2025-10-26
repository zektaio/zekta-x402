import { motion } from 'framer-motion';
import { Code, Zap, Users, TrendingUp, Shield, Boxes, Wallet, Gamepad2, ShoppingCart, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ApiSdkVision() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/95">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container mx-auto px-4 py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center space-y-6"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-3 flex-wrap justify-center">
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Zekta API & SDK Vision
                </h1>
                <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20 text-sm px-3 py-1">
                  Coming Soon
                </Badge>
              </div>
              <p className="text-xl md:text-2xl text-muted-foreground">
                What Happens After the API & SDK Go Live
              </p>
            </div>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-primary" />
                <span>Public API</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-muted-foreground/50" />
              <div className="flex items-center gap-2">
                <Boxes className="w-4 h-4 text-accent" />
                <span>Developer SDK</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-muted-foreground/50" />
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span>Revenue Sharing</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Opening Statement */}
      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="prose prose-lg dark:prose-invert mx-auto"
        >
          <p className="text-xl leading-relaxed text-foreground/90">
            Once our API and SDK are released, any developer will be able to build on top of Zekta, integrating private swaps, anonymous payments, and zero-knowledge verifications directly into their own dApps, wallets, or bots.
          </p>
        </motion.div>
      </section>

      {/* The Problem */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">The Challenge</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Building privacy infrastructure from scratch takes months of cryptographic expertise and infrastructure setup
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg border bg-card hover-elevate">
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="font-semibold mb-2">Complex Cryptography</h3>
              <p className="text-sm text-muted-foreground">
                Zero-knowledge proofs require deep mathematical understanding and careful implementation
              </p>
            </div>
            
            <div className="p-6 rounded-lg border bg-card hover-elevate">
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="font-semibold mb-2">Infrastructure Costs</h3>
              <p className="text-sm text-muted-foreground">
                Running relayers, maintaining uptime, and managing gas fees adds significant overhead
              </p>
            </div>
            
            <div className="p-6 rounded-lg border bg-card hover-elevate">
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="font-semibold mb-2">Development Time</h3>
              <p className="text-sm text-muted-foreground">
                Building a production-ready privacy layer from scratch can take 6-12 months
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* The Solution */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Privacy Made Simple</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Build privacy-first applications without building privacy infrastructure
            </p>
          </div>

          <div className="bg-card border rounded-lg p-8">
            <h3 className="text-xl font-semibold mb-6 text-center">Developer Integration Flow</h3>
            <IntegrationFlowDiagram />
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-2">Free Basic Access</h3>
                <p className="text-muted-foreground">
                  Developers can use the public API for free basic functions, making it easy to experiment and build proof-of-concepts without upfront costs.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-semibold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-2">Premium Features with $ZEKTA</h3>
                <p className="text-muted-foreground">
                  Advanced features like custom privacy routes, higher throughput, priority relaying, and branded experiences require $ZEKTA tokens as payment.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 font-semibold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-2">Protocol Revenue</h3>
                <p className="text-muted-foreground">
                  All transactions made through partner apps still use our Zekta relayer, which means we earn protocol fees from their platforms.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 font-semibold">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-2">Community Distribution</h3>
                <p className="text-muted-foreground">
                  From collected fees, 60-70% will be distributed back to $ZEKTA holders through the weekly revenue sharing system.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Revenue Loop Diagram */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card border rounded-lg p-8"
        >
          <h3 className="text-2xl font-semibold mb-8 text-center">Self-Sustaining Revenue Loop</h3>
          <RevenueLoopDiagram />
        </motion.div>
      </section>

      {/* Use Cases */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Real-World Applications</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Developers can integrate Zekta into any application requiring privacy
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <UseCaseCard
              icon={<Wallet className="w-6 h-6" />}
              title="DeFi Wallets"
              description="Integrate private swaps directly into wallet interfaces, allowing users to trade without exposing their holdings or trading patterns."
              color="from-blue-500/10 to-blue-600/10"
            />
            
            <UseCaseCard
              icon={<Gamepad2 className="w-6 h-6" />}
              title="Gaming Marketplaces"
              description="Enable anonymous NFT and in-game asset trading where players can buy, sell, and trade without revealing wallet balances or purchase history."
              color="from-purple-500/10 to-purple-600/10"
            />
            
            <UseCaseCard
              icon={<ShoppingCart className="w-6 h-6" />}
              title="E-Commerce Platforms"
              description="Accept cryptocurrency payments with built-in privacy, protecting both merchant and customer transaction details from public blockchain analysis."
              color="from-green-500/10 to-green-600/10"
            />
            
            <UseCaseCard
              icon={<Users className="w-6 h-6" />}
              title="Social & DAO Tools"
              description="Build voting systems, reward distributions, and community treasury management with verifiable privacy using zero-knowledge proofs."
              color="from-orange-500/10 to-orange-600/10"
            />
          </div>
        </motion.div>
      </section>

      {/* Growth Projections */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Ecosystem Growth Potential</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              As more developers integrate Zekta, protocol revenue and holder rewards scale exponentially
            </p>
          </div>

          <div className="bg-card border rounded-lg p-8">
            <GrowthProjectionChart />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <ProjectionCard
              apps="10 Apps"
              volume="$500K/week"
              holderReward="$2,100/week"
              color="text-blue-500"
            />
            <ProjectionCard
              apps="50 Apps"
              volume="$2.5M/week"
              holderReward="$10,500/week"
              color="text-purple-500"
            />
            <ProjectionCard
              apps="100 Apps"
              volume="$5M/week"
              holderReward="$21,000/week"
              color="text-green-500"
            />
          </div>
        </motion.div>
      </section>

      {/* For Developers */}
      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-primary/5 to-accent/5 border rounded-lg p-8 md:p-12 space-y-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Code className="w-8 h-8 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold">For Developers</h2>
          </div>
          
          <ul className="space-y-4 text-foreground/90">
            <li className="flex gap-3">
              <span className="text-primary">●</span>
              <span>Integrate privacy features in hours instead of months</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary">●</span>
              <span>No need to maintain relayer infrastructure or manage gas fees</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary">●</span>
              <span>Free tier for testing and basic implementations</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary">●</span>
              <span>Scale to premium features as your user base grows</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary">●</span>
              <span>Comprehensive documentation and support from the Zekta team</span>
            </li>
          </ul>

          <div className="pt-4 space-y-4">
            <div className="bg-background/50 border rounded-lg p-4 font-mono text-sm">
              <div className="text-muted-foreground">// Example: Integrate Zekta in 3 lines</div>
              <div className="mt-2">
                <span className="text-purple-500">import</span> {'{ ZektaSDK }'} <span className="text-purple-500">from</span> <span className="text-green-500">'@zekta/sdk'</span>;
              </div>
              <div className="mt-1">
                <span className="text-purple-500">const</span> zekta = <span className="text-purple-500">new</span> <span className="text-blue-500">ZektaSDK</span>({'{ apiKey }'}); 
              </div>
              <div className="mt-1">
                <span className="text-purple-500">await</span> zekta.<span className="text-blue-500">swap</span>({'{ from, to, amount }'});
              </div>
            </div>
            
            <Link href="/integration-example">
              <Button size="lg" className="w-full" data-testid="button-view-integration-example">
                View Complete Integration Guide
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* For Holders */}
      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 border rounded-lg p-8 md:p-12 space-y-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8 text-green-500" />
            <h2 className="text-2xl md:text-3xl font-bold">For $ZEKTA Holders</h2>
          </div>
          
          <ul className="space-y-4 text-foreground/90">
            <li className="flex gap-3">
              <span className="text-green-500">●</span>
              <span>Earn from every integration built on Zekta protocol</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-500">●</span>
              <span>Passive income that scales with ecosystem adoption</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-500">●</span>
              <span>60-70% of protocol fees distributed weekly</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-500">●</span>
              <span>Rewards proportional to your token holdings</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-500">●</span>
              <span>No staking, no lockup - hold and earn automatically</span>
            </li>
          </ul>
        </motion.div>
      </section>

      {/* Closing Statement */}
      <section className="container mx-auto px-4 py-20 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-6"
        >
          <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            This creates a real, self-sustaining revenue loop
          </p>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Builders use the API, the protocol earns, and the community benefits.
          </p>
          <p className="text-2xl font-semibold">
            Zekta is not just a privacy layer, it is an economy built on proof.
          </p>
        </motion.div>
      </section>
    </div>
  );
}

// Integration Flow Diagram Component
function IntegrationFlowDiagram() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <svg viewBox="0 0 800 300" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        {/* Developer */}
        <g>
          <rect x="50" y="120" width="120" height="60" rx="8" fill="hsl(var(--primary) / 0.1)" stroke="hsl(var(--primary))" strokeWidth="2"/>
          <text x="110" y="155" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="16" fontWeight="600">Developer</text>
        </g>

        {/* Arrow 1 */}
        <g>
          <line x1="170" y1="150" x2="230" y2="150" stroke="hsl(var(--primary))" strokeWidth="2" markerEnd="url(#arrowhead)"/>
          <text x="200" y="140" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="12">Install SDK</text>
        </g>

        {/* Zekta SDK */}
        <g>
          <rect x="230" y="120" width="120" height="60" rx="8" fill="hsl(var(--accent) / 0.1)" stroke="hsl(var(--accent))" strokeWidth="2"/>
          <text x="290" y="155" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="16" fontWeight="600">Zekta SDK</text>
        </g>

        {/* Arrow 2 */}
        <g>
          <line x1="350" y1="150" x2="410" y2="150" stroke="hsl(var(--accent))" strokeWidth="2" markerEnd="url(#arrowhead2)"/>
          <text x="380" y="140" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="12">API Call</text>
        </g>

        {/* Zekta Protocol */}
        <g>
          <rect x="410" y="120" width="140" height="60" rx="8" fill="hsl(217 91% 60% / 0.1)" stroke="hsl(217 91% 60%)" strokeWidth="2"/>
          <text x="480" y="155" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="16" fontWeight="600">Zekta Protocol</text>
        </g>

        {/* Arrow 3 */}
        <g>
          <line x1="550" y1="150" x2="610" y2="150" stroke="hsl(217 91% 60%)" strokeWidth="2" markerEnd="url(#arrowhead3)"/>
          <text x="580" y="140" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="12">Execute</text>
        </g>

        {/* Private Swap */}
        <g>
          <rect x="610" y="120" width="140" height="60" rx="8" fill="hsl(142 76% 36% / 0.1)" stroke="hsl(142 76% 36%)" strokeWidth="2"/>
          <text x="680" y="155" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="16" fontWeight="600">Private Swap</text>
        </g>

        {/* Arrow markers */}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="hsl(var(--primary))" />
          </marker>
          <marker id="arrowhead2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="hsl(var(--accent))" />
          </marker>
          <marker id="arrowhead3" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="hsl(217 91% 60%)" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}

// Revenue Loop Diagram Component
function RevenueLoopDiagram() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <svg viewBox="0 0 900 400" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        {/* Center circle - Protocol */}
        <g>
          <circle cx="450" cy="200" r="80" fill="hsl(var(--primary) / 0.1)" stroke="hsl(var(--primary))" strokeWidth="3"/>
          <text x="450" y="195" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="18" fontWeight="700">Zekta</text>
          <text x="450" y="215" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="18" fontWeight="700">Protocol</text>
        </g>

        {/* Developers - Top Left */}
        <g>
          <rect x="100" y="50" width="150" height="80" rx="8" fill="hsl(217 91% 60% / 0.1)" stroke="hsl(217 91% 60%)" strokeWidth="2"/>
          <text x="175" y="80" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="16" fontWeight="600">Developers</text>
          <text x="175" y="100" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="13">Build on SDK</text>
          <text x="175" y="118" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="13">Pay with $ZEKTA</text>
        </g>

        {/* Arrow: Developers to Protocol */}
        <g>
          <path d="M 250 90 Q 350 100 390 160" stroke="hsl(217 91% 60%)" strokeWidth="3" fill="none" markerEnd="url(#arrow-blue)"/>
          <text x="310" y="110" fill="hsl(var(--muted-foreground))" fontSize="12">Premium Features</text>
        </g>

        {/* Users - Top Right */}
        <g>
          <rect x="650" y="50" width="150" height="80" rx="8" fill="hsl(142 76% 36% / 0.1)" stroke="hsl(142 76% 36%)" strokeWidth="2"/>
          <text x="725" y="80" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="16" fontWeight="600">End Users</text>
          <text x="725" y="100" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="13">Use dApps</text>
          <text x="725" y="118" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="13">Generate Fees</text>
        </g>

        {/* Arrow: Protocol to Users */}
        <g>
          <path d="M 510 160 Q 610 100 650 90" stroke="hsl(142 76% 36%)" strokeWidth="3" fill="none" markerEnd="url(#arrow-green)"/>
          <text x="570" y="110" fill="hsl(var(--muted-foreground))" fontSize="12">Privacy Services</text>
        </g>

        {/* Holders - Bottom */}
        <g>
          <rect x="375" y="320" width="150" height="80" rx="8" fill="hsl(47 96% 53% / 0.1)" stroke="hsl(47 96% 53%)" strokeWidth="2"/>
          <text x="450" y="350" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="16" fontWeight="600">$ZEKTA Holders</text>
          <text x="450" y="370" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="13">Hold Tokens</text>
          <text x="450" y="388" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="13">Earn 60-70%</text>
        </g>

        {/* Arrow: Protocol to Holders */}
        <g>
          <path d="M 450 280 L 450 320" stroke="hsl(47 96% 53%)" strokeWidth="3" fill="none" markerEnd="url(#arrow-yellow)"/>
          <text x="470" y="305" fill="hsl(var(--muted-foreground))" fontSize="12">Weekly Distribution</text>
        </g>

        {/* Arrow: Users back to Protocol */}
        <g>
          <path d="M 725 130 Q 680 200 530 200" stroke="hsl(var(--accent))" strokeWidth="3" fill="none" markerEnd="url(#arrow-accent)"/>
          <text x="640" y="180" fill="hsl(var(--muted-foreground))" fontSize="12">Protocol Fees</text>
        </g>

        {/* Arrow markers */}
        <defs>
          <marker id="arrow-blue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="hsl(217 91% 60%)" />
          </marker>
          <marker id="arrow-green" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="hsl(142 76% 36%)" />
          </marker>
          <marker id="arrow-yellow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="hsl(47 96% 53%)" />
          </marker>
          <marker id="arrow-accent" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="hsl(var(--accent))" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}

// Growth Projection Chart Component
function GrowthProjectionChart() {
  // Each app generates $50K/week volume
  // Protocol fees: 0.6% (0.2% DEX + 0.4% ZK)
  // So $50K × 0.006 = $300 protocol revenue per app per week
  const data = [
    { apps: 0, volume: 0, protocolRevenue: 0 },
    { apps: 10, volume: 500, protocolRevenue: 3 },
    { apps: 25, volume: 1250, protocolRevenue: 7.5 },
    { apps: 50, volume: 2500, protocolRevenue: 15 },
    { apps: 75, volume: 3750, protocolRevenue: 22.5 },
    { apps: 100, volume: 5000, protocolRevenue: 30 },
  ];

  const maxRevenue = 30;
  const maxApps = 100;

  return (
    <div className="w-full">
      <div className="mb-4 text-center">
        <h4 className="text-lg font-semibold mb-2">Projected Weekly Protocol Revenue</h4>
        <p className="text-sm text-muted-foreground">Based on average app generating $50K/week in volume (0.6% protocol fee)</p>
      </div>
      
      <svg viewBox="0 0 800 400" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        {/* Grid lines */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line
            key={i}
            x1="80"
            y1={350 - i * 60}
            x2="750"
            y2={350 - i * 60}
            stroke="hsl(var(--border))"
            strokeWidth="1"
            strokeDasharray="4"
          />
        ))}

        {/* Y-axis labels */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <text
            key={i}
            x="70"
            y={355 - i * 60}
            textAnchor="end"
            fill="hsl(var(--muted-foreground))"
            fontSize="12"
          >
            ${i * 6}K
          </text>
        ))}

        {/* X-axis labels */}
        {data.map((point, i) => (
          <text
            key={i}
            x={80 + (i * 670) / (data.length - 1)}
            y="375"
            textAnchor="middle"
            fill="hsl(var(--muted-foreground))"
            fontSize="12"
          >
            {point.apps}
          </text>
        ))}

        {/* Axes */}
        <line x1="80" y1="50" x2="80" y2="350" stroke="hsl(var(--foreground))" strokeWidth="2"/>
        <line x1="80" y1="350" x2="750" y2="350" stroke="hsl(var(--foreground))" strokeWidth="2"/>

        {/* Area under curve */}
        <path
          d={`M 80 350 ${data.map((point, i) => {
            const x = 80 + (i * 670) / (data.length - 1);
            const y = 350 - (point.protocolRevenue / maxRevenue) * 300;
            return `L ${x} ${y}`;
          }).join(' ')} L 750 350 Z`}
          fill="url(#gradient)"
          opacity="0.3"
        />

        {/* Line */}
        <path
          d={`M ${data.map((point, i) => {
            const x = 80 + (i * 670) / (data.length - 1);
            const y = 350 - (point.protocolRevenue / maxRevenue) * 300;
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
          }).join(' ')}`}
          stroke="hsl(var(--primary))"
          strokeWidth="3"
          fill="none"
        />

        {/* Data points */}
        {data.map((point, i) => {
          const x = 80 + (i * 670) / (data.length - 1);
          const y = 350 - (point.protocolRevenue / maxRevenue) * 300;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="5"
              fill="hsl(var(--primary))"
              stroke="hsl(var(--background))"
              strokeWidth="2"
            />
          );
        })}

        {/* Gradient */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Axis labels */}
        <text x="400" y="395" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="14" fontWeight="600">
          Number of Integrated Apps
        </text>
        <text x="30" y="200" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="14" fontWeight="600" transform="rotate(-90 30 200)">
          Weekly Revenue ($K)
        </text>
      </svg>
    </div>
  );
}

// Use Case Card Component
function UseCaseCard({ icon, title, description, color }: { icon: React.ReactNode; title: string; description: string; color: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-6 rounded-lg border bg-card hover-elevate"
    >
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </motion.div>
  );
}

// Projection Card Component
function ProjectionCard({ apps, volume, holderReward, color }: { apps: string; volume: string; holderReward: string; color: string }) {
  return (
    <div className="p-6 rounded-lg border bg-card hover-elevate">
      <div className={`text-2xl font-bold mb-2 ${color}`}>{apps}</div>
      <div className="space-y-2 text-sm">
        <div>
          <div className="text-muted-foreground">Weekly Volume</div>
          <div className="font-semibold">{volume}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Pool Distribution</div>
          <div className="font-semibold text-green-500">{holderReward}</div>
        </div>
      </div>
    </div>
  );
}
