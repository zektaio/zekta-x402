import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { 
  ArrowLeft, 
  Shield, 
  Key, 
  Send, 
  Eye, 
  Lock, 
  Zap,
  Download,
  CheckCircle2,
  ArrowRightLeft,
  Globe,
  Code,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AnonymousTwitterArticle() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-12 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="container mx-auto max-w-4xl relative">
          <Link href="/">
            <Button variant="ghost" className="mb-8" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <time dateTime="2025-10-24">October 24, 2025</time>
                <span className="mx-2">•</span>
                <span>8 min read</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
                <span className="gradient-text">ZK 𝕏</span>: One Account,<br />
                Infinite Anonymous Identities
              </h1>

              <p className="text-xl text-muted-foreground">
                Anyone can log in to our zektabro twitter account using their Zekta ID. No email. No password. No OAuth. 
                Just cryptographic proof that it's you, verified privately on-chain through the Zekta Protocol.
              </p>
            </div>

            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-primary/20 bg-primary/5">
              <div className="text-2xl font-bold">𝕏</div>
              <span className="text-sm font-medium">Zero-Knowledge Twitter Access</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/anonymousx">
                <Button size="lg" className="gap-2" data-testid="button-try-now">
                  <Shield className="h-5 w-5" />
                  Try ZK 𝕏 Now
                </Button>
              </Link>
              <Link href="/sdk">
                <Button size="lg" variant="outline" className="gap-2" data-testid="button-view-sdk">
                  <Code className="h-5 w-5" />
                  View SDK
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Stay Invisible. <span className="gradient-text">Stay Verified.</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The first Twitter account controlled by zero-knowledge proofs instead of passwords
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="h-full hover-elevate">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                      <Key className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl">Generate Your ZK ID</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Your Zekta identity is generated <strong className="text-foreground">completely client-side</strong> using Semaphore Protocol. 
                    No servers see your private key. No databases store your identity.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Cryptographically unique identity commitment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Download your passkey for future access</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Upload from any device, anytime</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="h-full hover-elevate">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                      <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl">Prove & Post</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Generate a zero-knowledge proof that you own your identity <strong className="text-foreground">without revealing who you are</strong>. 
                    The backend verifies your proof and posts on your behalf.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Zero-knowledge session tokens (5-minute validity)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Each tweet tagged with unique proof hash</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Unlimited tweets, unlimited identities</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Technical Flow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <Card className="hover-elevate">
              <CardHeader>
                <CardTitle className="text-2xl">The Protocol Flow</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center space-y-3">
                    <div className="p-4 rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mx-auto">
                      <span className="text-2xl font-bold text-primary">1</span>
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base">Client-Side Generation</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Semaphore identity created in your browser using WebCrypto
                    </p>
                  </div>
                  <div className="text-center space-y-3">
                    <div className="p-4 rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mx-auto">
                      <span className="text-2xl font-bold text-primary">2</span>
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base">ZK Proof</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Generate proof of identity ownership without revealing private key
                    </p>
                  </div>
                  <div className="text-center space-y-3">
                    <div className="p-4 rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mx-auto">
                      <span className="text-2xl font-bold text-primary">3</span>
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base">Session Minting</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Backend verifies proof and issues EdDSA-signed JWT session
                    </p>
                  </div>
                  <div className="text-center space-y-3">
                    <div className="p-4 rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mx-auto">
                      <span className="text-2xl font-bold text-primary">4</span>
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base">Tweet Posted</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Action executed via @zektabro with your unique proof tag
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* What You Can Do */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">ZK ID</span> = Universal Access
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Through Twitter, users will be able to swap, send, and act completely anonymously
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="h-full hover-elevate">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <ArrowRightLeft className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                    <CardTitle className="text-base sm:text-lg">Swap Crypto</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Execute cryptocurrency swaps directly through Twitter DMs using your ZK ID. 
                    No wallet connection required, just prove you're you.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="h-full hover-elevate">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Send className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                    <CardTitle className="text-base sm:text-lg">Send Payments</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Transfer funds anonymously while maintaining cryptographic proof of authorization. 
                    Privacy-preserving transactions at scale.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="h-full hover-elevate">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                    <CardTitle className="text-base sm:text-lg">Act & Execute</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Trigger on-chain actions, vote in DAOs, claim airdrops, all through your ZK ID. 
                    The possibilities are endless.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <Card className="bg-primary/5 border-primary/20 hover-elevate">
              <CardContent className="py-6 px-4 sm:py-8 sm:px-6">
                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
                  <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                  <h3 className="text-lg sm:text-xl font-bold">ZK ID verified.</h3>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground mb-4">
                  Powered by <strong className="text-foreground">@Zektaio</strong> ZKID Protocol
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <Badge variant="outline" className="text-xs sm:text-sm whitespace-nowrap">
                    <Lock className="h-3 w-3 mr-1" />
                    Semaphore v4
                  </Badge>
                  <Badge variant="outline" className="text-xs sm:text-sm whitespace-nowrap">
                    EdDSA Sessions
                  </Badge>
                  <Badge variant="outline" className="text-xs sm:text-sm whitespace-nowrap">
                    On-Chain
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Build Your Own */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              You Can Run This <span className="gradient-text">Too</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The Zekta SDK is open source. Build your own ZK-powered applications.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="h-full hover-elevate">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Quick Start</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                        <Download className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Generate your ZK ID</h4>
                        <p className="text-sm text-muted-foreground">
                          Create a Semaphore identity in your browser
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                        <Key className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Download your passkey</h4>
                        <p className="text-sm text-muted-foreground">
                          Save your private key securely as a JSON file
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                        <Code className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Connect via SDK</h4>
                        <p className="text-sm text-muted-foreground">
                          Integrate Zekta Protocol into your application
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                        <Globe className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Control your agent</h4>
                        <p className="text-sm text-muted-foreground">
                          Execute actions anonymously across platforms
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="h-full bg-muted/50 hover-elevate">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">SDK Example</CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-6">
                  <div className="bg-background/50 rounded-lg p-3 sm:p-4 overflow-hidden">
                    <pre className="text-muted-foreground font-mono text-xs sm:text-sm overflow-x-auto">
{`import { Identity } from '@semaphore-protocol/identity'
import { generateProof } from '@semaphore-protocol/proof'

// Generate identity
const identity = new Identity()

// Create ZK proof
const proof = await generateProof(
  identity,
  group,
  message,
  scope
)

// Verify & execute
await fetch('/api/twitter/tweet', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${session}\`
  },
  body: JSON.stringify({
    text: 'Posted via ZK proof!'
  })
})`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Link href="/sdk">
              <Button size="lg" variant="outline" className="gap-2" data-testid="button-view-full-docs">
                <Code className="h-5 w-5" />
                View Full SDK Documentation
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 to-background">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-5xl font-bold">
              Ready to Go <span className="gradient-text">Anonymous</span>?
            </h2>
            <p className="text-xl text-muted-foreground">
              Generate your ZK ID and start posting to @zektabro right now.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/anonymousx">
                <Button size="lg" className="gap-2" data-testid="button-get-started">
                  <Shield className="h-5 w-5" />
                  Get Started
                </Button>
              </Link>
              <Link href="/developer">
                <Button size="lg" variant="outline" className="gap-2" data-testid="button-developer-docs">
                  <Code className="h-5 w-5" />
                  Developer Docs
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
