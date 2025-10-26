import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowRightLeft, Shield, Clock, Eye, CheckCircle2, Bitcoin, Coins, Zap, Users, ArrowRight, Key, Fingerprint } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import FeatureHeader from "@/components/FeatureHeader";

export default function AnonymousSwaps() {
  const { data: statsData } = useQuery<{
    ok: boolean;
    stats: {
      totalSwaps: number;
      proofsVerified: number;
      activeWallets: number;
      crossChainBridges: number;
      totalVolumeUSD: number;
    };
  }>({
    queryKey: ['/api/stats/protocol'],
    refetchInterval: 60000,
  });
  return (
    <div className="min-h-screen bg-background text-foreground">
      <FeatureHeader />
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        
        <div className="max-w-5xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <ArrowRightLeft className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Anonymous Cryptocurrency Swaps</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
              Swap Crypto Across <span className="gradient-text">9 Chains</span>
              <br />with Zero Identity Disclosure
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              No account. No KYC. No wallet connection. Just simple, private cryptocurrency swaps 
              powered by zero-knowledge proofs.
            </p>

            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Button asChild size="lg" className="gap-2" data-testid="button-start-swap">
                <Link href="/swap">
                  <ArrowRightLeft className="w-5 h-5" />
                  Start Anonymous Swap
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" data-testid="button-view-docs">
                <Link href="/docs">
                  View Documentation
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Choose <span className="gradient-text">Zekta Swaps</span>?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the future of private crypto trading
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: "No Registration",
                description: "Start swapping immediately without creating an account or providing personal information",
                color: "text-green-500"
              },
              {
                icon: Eye,
                title: "Complete Privacy",
                description: "Zero-knowledge proofs ensure your identity remains completely anonymous",
                color: "text-blue-500"
              },
              {
                icon: Clock,
                title: "Fast Processing",
                description: "Most swaps complete within 5-30 minutes with real-time status tracking",
                color: "text-purple-500"
              },
              {
                icon: Zap,
                title: "Real-Time Rates",
                description: "Live exchange rates with transparent fees and no hidden charges",
                color: "text-yellow-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover-elevate border-border/40 bg-card/50" data-testid={`card-feature-${index}`}>
                  <div className={`w-12 h-12 rounded-lg bg-background/80 flex items-center justify-center mb-4 ${feature.color}`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How ZK Anonymous Swaps Work</h2>
            <p className="text-lg text-muted-foreground">
              Zero-knowledge proofs ensure complete anonymity throughout the process
            </p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                step: 1,
                title: "Generate ZK Identity",
                description: "Create a Semaphore identity client-side. Your secret never leaves your browser.",
                icon: Key
              },
              {
                step: 2,
                title: "Join Semaphore Group",
                description: "Your commitment is added to the group anonymity set. No personal data stored.",
                icon: Users
              },
              {
                step: 3,
                title: "Configure Swap Details",
                description: "Select cryptocurrencies, amount, and destination address. Get real-time rates.",
                icon: ArrowRightLeft
              },
              {
                step: 4,
                title: "Generate ZK Proof",
                description: "Prove you're in the group without revealing which member you are.",
                icon: Fingerprint
              },
              {
                step: 5,
                title: "Execute & Track",
                description: "Submit proof, send crypto, and track swap status anonymously via order ID.",
                icon: CheckCircle2
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover-elevate border-border/40">
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="rounded-full px-2 py-0.5 text-xs">Step {item.step}</Badge>
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Cryptocurrencies */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Supported <span className="gradient-text">Cryptocurrencies</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Swap between 9 major cryptocurrencies across multiple blockchain networks
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "Bitcoin", symbol: "BTC", network: "Bitcoin Network", icon: Bitcoin, color: "orange" },
              { name: "Solana", symbol: "SOL", network: "Solana Network", icon: Coins, color: "purple" },
              { name: "Ethereum", symbol: "ETH", network: "Ethereum Network", icon: Coins, color: "blue" },
              { name: "Tether", symbol: "USDT", network: "Multi-Chain", icon: Coins, color: "green" },
              { name: "USD Coin", symbol: "USDC", network: "Multi-Chain", icon: Coins, color: "blue" },
              { name: "BNB", symbol: "BNB", network: "BNB Chain", icon: Coins, color: "yellow" },
              { name: "Polygon", symbol: "MATIC", network: "Polygon Network", icon: Coins, color: "purple" },
              { name: "Avalanche", symbol: "AVAX", network: "Avalanche Network", icon: Coins, color: "red" },
              { name: "Zcash", symbol: "ZEC", network: "Zcash Network", icon: Shield, color: "yellow" }
            ].map((crypto, index) => (
              <motion.div
                key={crypto.symbol}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-5 hover-elevate border-border/40 bg-card/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-full bg-${crypto.color}-500/10 flex items-center justify-center`}>
                      <crypto.icon className={`h-6 w-6 text-${crypto.color}-500`} />
                    </div>
                    <div>
                      <h4 className="font-semibold">{crypto.name} ({crypto.symbol})</h4>
                      <p className="text-xs text-muted-foreground">{crypto.network}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Real-Time Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-border/40 bg-card/20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Live Protocol <span className="gradient-text">Statistics</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Real-time data from Zekta's anonymous swap protocol
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                icon: ArrowRightLeft, 
                label: "Anonymous Transactions", 
                value: (statsData?.stats?.totalSwaps || 0).toLocaleString(),
                color: "text-emerald-500" 
              },
              { 
                icon: Shield, 
                label: "Privacy Proofs Verified", 
                value: (statsData?.stats?.proofsVerified || 0).toLocaleString(),
                color: "text-cyan-500" 
              },
              { 
                icon: Users, 
                label: "Stealth Wallets", 
                value: (statsData?.stats?.activeWallets || 0).toLocaleString(),
                color: "text-purple-500" 
              },
              { 
                icon: Coins, 
                label: "Shielded Swap Processed", 
                value: `$${(statsData?.stats?.totalVolumeUSD || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                color: "text-emerald-500" 
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 text-center hover-elevate border-border/40 bg-card/50" data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>
                  <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              Ready to Swap <span className="gradient-text">Anonymously</span>?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience truly private crypto trading with zero-knowledge proofs. 
              No registration, no KYC, complete anonymity.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-6">
              <Button asChild size="lg" className="gap-2" data-testid="button-launch-swap">
                <Link href="/swap">
                  <ArrowRightLeft className="w-5 h-5" />
                  Launch Swap Now
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" data-testid="button-telegram">
                <a href="https://t.me/zektaswapbot" target="_blank" rel="noopener noreferrer">
                  Try Telegram Bot
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
