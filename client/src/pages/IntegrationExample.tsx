import { motion } from 'framer-motion';
import { useState } from 'react';
import { Code, Shield, CheckCircle2, Copy, Check, ArrowRight, Globe, AlertCircle, Zap, Key, Lock, Workflow, Database, Server, FileCode, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

export default function IntegrationExample() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    toast({
      title: "Copied to clipboard",
      description: "Code snippet copied successfully",
    });
  };

  const codeExamples = [
    {
      title: "Create Domain Order",
      language: "typescript",
      code: `// POST /api/domains/order
const response = await fetch('/api/domains/order', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    domainName: 'mysite',
    tld: '.org',
    currency: 'BTC'
  })
});

const order = await response.json();
// {
//   ok: true,
//   orderId: "ord_abc123",
//   domain: "mysite.org",
//   depositAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
//   amount: 0.00042,
//   currency: "BTC",
//   priceUSD: 12.99,
//   domainSecret: "0x..." // ZK identity trapdoor
// }`
    },
    {
      title: "Zero-Knowledge DNS Management",
      language: "typescript",
      code: `// User never provides wallet address - only ZK proof
import { Identity } from '@semaphore-protocol/identity';

// User creates identity from their domain secret
const identity = new Identity(domainSecret);
const commitment = identity.commitment.toString();

// Add DNS record with ZK proof (no personal data exposed)
const response = await fetch('/api/domains/dns', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    commitment,  // ZK commitment (not revealing secret)
    domainSecret, // Verified transiently, never stored
    record: {
      type: 'A',
      name: '@',
      value: '192.0.2.1',
      ttl: 3600
    }
  })
});

// Backend verifies commitment matches, never stores secret`
    },
    {
      title: "Payment Flow Architecture",
      language: "typescript",
      code: `// Automated Multi-Currency to Zcash Pipeline
// User pays ANY crypto → Auto-converts to Zcash → Pays Njalla

// 1. User deposits any cryptocurrency
depositAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
amount: 0.00042 BTC

// 2. Exchange converts BTC → Zcash automatically
conversionRate: "BTC to ZEC at market rate"
outputCurrency: "ZEC"

// 3. Zekta receives Zcash in hot wallet
hotWallet: "t1YourZcashAddressHere..."

// 4. Domain processor auto-pays Njalla
// - Fetches real-time EUR/ZEC price from CoinGecko
// - Creates Njalla payment request
// - Sends exact Zcash amount to Njalla address
// - Confirms payment with Njalla API
// - Registers domain via Njalla API

// 5. Domain registered - user gets domain secret`
    },
    {
      title: "Track Order Status",
      language: "typescript",
      code: `// GET /api/domains/order/:orderId
const response = await fetch(\`/api/domains/order/\${orderId}\`);
const order = await response.json();

// Order status lifecycle:
// - 'pending': Waiting for crypto payment
// - 'paid': Payment received, processing Njalla payment
// - 'njalla_payment_pending': Paying Njalla registrar
// - 'njalla_payment_confirmed': Njalla payment confirmed
// - 'registering': Domain registration in progress
// - 'completed': Domain fully registered and active
// - 'error': Payment or registration failed

console.log('Order status:', order.status);
console.log('Domain:', order.domain);
console.log('Blockchain explorer:', order.txHash);`
    }
  ];

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
            <div className="inline-block">
              <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
                <Code className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold">Integration Guide</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-3 flex-wrap justify-center">
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Anonymous Domain Purchase API
                </h1>
                <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20 text-sm px-3 py-1">
                  Coming Soon
                </Badge>
              </div>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                Build privacy-first domain services powered by zero-knowledge proofs and cryptocurrency payments
              </p>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground flex-wrap pt-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span>Zero-Knowledge Proofs</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-muted-foreground/50" />
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-accent" />
                <span>Njalla Registrar</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-muted-foreground/50" />
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-500" />
                <span>Multi-Crypto Support</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Overview */}
      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <p className="text-xl leading-relaxed text-foreground/90">
            This integration enables <strong>completely anonymous domain purchases</strong> using cryptocurrency payments. 
            Users can buy domains without providing email, name, or wallet addresses. Identity is managed through 
            <strong> Semaphore Protocol's zero-knowledge proofs</strong>, ensuring privacy while maintaining ownership verification.
          </p>
          
          <Card className="p-6 bg-primary/5 border-primary/20">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Privacy-First Architecture</h3>
                <p className="text-muted-foreground">
                  No personal data collected. No wallet addresses stored. DNS management via ZK proofs. 
                  Domain secrets stored client-side only. Complete anonymity guaranteed.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Technical Stack */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Technology Stack</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built on proven privacy and blockchain technologies
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Semaphore Protocol</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Zero-knowledge identity system for anonymous authentication. Users prove domain ownership without revealing their secret.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                    <span>Cryptographic commitments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                    <span>ZK-SNARK proof generation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                    <span>Client-side verification</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Globe className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Njalla Registrar</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Privacy-focused domain registrar that doesn't require personal information. Supports 300+ TLDs.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                    <span>Anonymous registration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                    <span>Crypto payment support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                    <span>DNS management API</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Multi-Crypto Exchange</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Accept payments in 9+ cryptocurrencies with automatic conversion to Zcash for Njalla payments.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                    <span>BTC, ETH, SOL, USDT support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                    <span>Real-time price oracles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                    <span>Automated conversions</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </section>

      {/* Flow Diagram */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Payment & Registration Flow</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Fully automated pipeline from crypto payment to domain registration
            </p>
          </div>

          <Card className="p-8">
            <div className="space-y-8">
              {/* Flow Steps */}
              <div className="grid md:grid-cols-5 gap-4">
                {[
                  { icon: Globe, label: "Domain Request", desc: "User selects domain & crypto", color: "text-primary" },
                  { icon: Wallet, label: "Crypto Payment", desc: "Pays with any coin", color: "text-accent" },
                  { icon: Workflow, label: "Auto Convert", desc: "Exchange → ZEC", color: "text-green-500" },
                  { icon: Server, label: "Pay Njalla", desc: "ZEC → Registrar", color: "text-blue-500" },
                  { icon: CheckCircle2, label: "Domain Ready", desc: "ZK secret issued", color: "text-green-500" }
                ].map((step, i) => (
                  <div key={i} className="relative">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center">
                        <step.icon className={`w-8 h-8 ${step.color}`} />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{step.label}</div>
                        <div className="text-xs text-muted-foreground mt-1">{step.desc}</div>
                      </div>
                    </div>
                    {i < 4 && (
                      <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-muted to-transparent" />
                    )}
                  </div>
                ))}
              </div>

              {/* Technical Details */}
              <div className="grid md:grid-cols-2 gap-6 pt-6 border-t">
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Key className="w-4 h-4 text-primary" />
                    Zero-Knowledge Identity
                  </h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>1. Server generates Semaphore identity on order creation</p>
                    <p>2. Domain secret (trapdoor) sent to user once</p>
                    <p>3. Server stores only ZK commitment (public hash)</p>
                    <p>4. User proves ownership via ZK proofs for DNS ops</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Database className="w-4 h-4 text-accent" />
                    Payment Processing
                  </h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>1. Generate unique deposit address for user's crypto</p>
                    <p>2. Monitor blockchain for incoming payment</p>
                    <p>3. Auto-convert to Zcash via exchange API</p>
                    <p>4. Send Zcash to Njalla + confirm registration</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-500 mb-2">Privacy Guarantee</h4>
                <p className="text-sm text-muted-foreground">
                  The domain secret is shown exactly once and never stored on our servers. Users must save it locally 
                  to manage DNS records. This ensures zero-knowledge: we cannot link domains to users or wallets.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Try It Live CTA */}
      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 border-primary/20">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                <Globe className="w-10 h-10 text-primary" />
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl md:text-4xl font-bold">Try It Live</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Experience the full anonymous domain purchase flow. Real crypto payments, zero personal data required.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button 
                  size="lg"
                  onClick={() => setLocation('/buy-domain')}
                  data-testid="button-try-live"
                  className="text-base px-8"
                >
                  <Globe className="w-5 h-5 mr-2" />
                  Buy Anonymous Domain
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                No account needed • Pay with BTC, ETH, SOL, or USDT • Get domain secret instantly
              </p>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Code Examples */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Implementation Guide</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Copy-paste ready code examples for your integration
            </p>
          </div>

          <div className="space-y-6">
            {codeExamples.map((example, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="p-6 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileCode className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-semibold">{example.title}</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(example.code, index)}
                    data-testid={`button-copy-${index}`}
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <SyntaxHighlighter
                  language={example.language}
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    borderRadius: 0,
                    fontSize: '0.875rem',
                    padding: '1.5rem'
                  }}
                >
                  {example.code}
                </SyntaxHighlighter>
              </Card>
            ))}
          </div>
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
              Build privacy-focused services on top of anonymous domain infrastructure
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Whistleblower Platforms</h3>
                  <p className="text-sm text-muted-foreground">
                    Anonymous tip submission sites where sources can purchase domains without identity exposure, 
                    protecting both platform operators and users.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Privacy-First Marketplaces</h3>
                  <p className="text-sm text-muted-foreground">
                    E-commerce platforms where vendors can establish anonymous storefronts with custom domains, 
                    protecting seller identities while maintaining trust.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <Lock className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Activist Organizations</h3>
                  <p className="text-sm text-muted-foreground">
                    Human rights groups operating in restrictive regions can maintain web presence without 
                    exposing organizer identities through domain registration records.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Server className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Decentralized Publishing</h3>
                  <p className="text-sm text-muted-foreground">
                    Blog and media platforms where writers can publish under pseudonyms with verified domain 
                    ownership, without revealing real-world identities.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 border-primary/20">
          <div className="text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Start Building Today</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Integrate anonymous domain purchases into your platform with zero-knowledge privacy guarantees.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Button 
                size="lg"
                onClick={() => setLocation('/buy-domain')}
                data-testid="button-buy-domain"
              >
                <Globe className="w-5 h-5 mr-2" />
                Buy Anonymous Domain
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => setLocation('/docs')}
                data-testid="button-docs"
              >
                <FileCode className="w-5 h-5 mr-2" />
                View Full Docs
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
