import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Shield, Lock, Eye, Key, Server, CheckCircle2, AlertCircle, Code, FileCode, ArrowRight, Github } from "lucide-react";
import FeatureHeader from "@/components/FeatureHeader";

export default function SecurityPrivacy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <FeatureHeader />
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-cyan-500/5" />
        
        <div className="max-w-5xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-sm font-semibold text-green-400">Security & Privacy</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
              How <span className="gradient-text">ZK Proofs</span>
              <br />Protect Your Identity
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Understanding the cryptographic foundations that make Zekta the most private 
              cryptocurrency platform. Zero-knowledge proofs ensure complete anonymity.
            </p>

            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Button asChild size="lg" className="gap-2" data-testid="button-read-docs">
                <Link href="/docs">
                  <FileCode className="w-5 h-5" />
                  Read Documentation
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" data-testid="button-github">
                <a href="https://github.com/zektaio/zekta-sdk" target="_blank" rel="noopener noreferrer">
                  <Github className="w-5 h-5" />
                  View Source Code
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Zero-Knowledge Proofs Explained */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              What are <span className="gradient-text">Zero-Knowledge Proofs</span>?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              A zero-knowledge proof allows you to prove you know something without revealing what that something is.
            </p>
          </motion.div>

          <div className="space-y-6">
            <Card className="p-6 hover-elevate border-border/40 bg-card/50">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Shield className="w-6 h-6 text-green-500" />
                The Core Concept
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Imagine proving you're over 18 without revealing your exact age, or proving you have enough money for a purchase 
                without showing your bank balance. That's the power of zero-knowledge proofs.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                In Zekta, ZK proofs allow you to prove you're authorized to perform actions (swaps, DNS changes, gift card access) 
                without revealing your identity, wallet address, or any personal information.
              </p>
            </Card>

            <Card className="p-6 hover-elevate border-border/40 bg-card/50">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Code className="w-6 h-6 text-blue-500" />
                How Zekta Uses ZK Proofs
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Semaphore Protocol</p>
                    <p className="text-sm text-muted-foreground">Industry-standard ZK identity system for anonymous group membership</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Client-Side Proof Generation</p>
                    <p className="text-sm text-muted-foreground">Proofs generated in your browser - your secrets never leave your device</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Server-Side Verification</p>
                    <p className="text-sm text-muted-foreground">Backend verifies proofs without learning your identity</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Privacy Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Zekta's <span className="gradient-text">Privacy Guarantees</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Multiple layers of privacy protection
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Eye,
                title: "No Wallet Tracking",
                description: "We never store your cryptocurrency wallet addresses - only ZK commitments",
                color: "text-purple-500"
              },
              {
                icon: Key,
                title: "Secret-Only Auth",
                description: "Authentication uses cryptographic proofs, not passwords or email",
                color: "text-blue-500"
              },
              {
                icon: Lock,
                title: "Zero Data Collection",
                description: "No email, no KYC, no personal information ever required or stored",
                color: "text-green-500"
              },
              {
                icon: Server,
                title: "Decentralized Identity",
                description: "Your identity is a cryptographic commitment you control entirely",
                color: "text-yellow-500"
              },
              {
                icon: Shield,
                title: "HTTPS Protection",
                description: "All communications encrypted end-to-end with TLS",
                color: "text-red-500"
              },
              {
                icon: AlertCircle,
                title: "No Analytics Tracking",
                description: "We don't track your usage, behavior, or link activities across sessions",
                color: "text-cyan-500"
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

      {/* Technical Architecture */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
              Privacy <span className="gradient-text">Architecture</span>
            </h2>
            <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto">
              How different Zekta features implement privacy protection
            </p>
          </motion.div>

          <div className="space-y-6">
            <Card className="p-6 hover-elevate border-border/40">
              <h3 className="text-xl font-semibold mb-4">Anonymous Swaps</h3>
              <div className="space-y-2 text-muted-foreground">
                <p>• No account registration - create swaps instantly without identity</p>
                <p>• Unique deposit addresses for each swap prevent address reuse tracking</p>
                <p>• Order IDs use random generation - no linkage between swaps</p>
                <p>• Exchange partner cannot link swaps to users</p>
              </div>
            </Card>

            <Card className="p-6 hover-elevate border-border/40">
              <h3 className="text-xl font-semibold mb-4">Domain Management</h3>
              <div className="space-y-2 text-muted-foreground">
                <p>• Server-side Semaphore identity generation with only ZK commitment stored</p>
                <p>• Domain secret (Identity trapdoor) given to user - never stored on server</p>
                <p>• DNS operations require domain secret proof - backend verifies transiently</p>
                <p>• No wallet addresses stored - complete anonymity between domain purchases</p>
              </div>
            </Card>

            <Card className="p-6 hover-elevate border-border/40">
              <h3 className="text-xl font-semibold mb-4">Gift Card Access</h3>
              <div className="space-y-2 text-muted-foreground">
                <p>• Client-side Semaphore identity generation - you control your identity</p>
                <p>• Identity serialized and saved to localStorage under your control</p>
                <p>• ZK proof verification ensures only legitimate owners can access cards</p>
                <p>• No identity linkage - each purchase is completely separate</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-border/40 bg-card/20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold mb-4">Privacy Best Practices</h2>
            <p className="text-lg text-muted-foreground">
              Maximize your privacy when using Zekta
            </p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                icon: Key,
                title: "Secure Secret Storage",
                description: "Store domain secrets and gift card identities in a password manager, not plain text files"
              },
              {
                icon: Shield,
                title: "Use Privacy-Focused Wallets",
                description: "Consider using fresh wallet addresses for each swap to prevent blockchain analysis"
              },
              {
                icon: Lock,
                title: "VPN Recommended",
                description: "Use a VPN to hide your IP address when accessing Zekta for maximum privacy"
              },
              {
                icon: Eye,
                title: "Don't Reuse Secrets",
                description: "Each domain and gift card gets a unique secret - never share or reuse them"
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-5 hover-elevate border-border/40">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
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
              Experience True <span className="gradient-text">Privacy</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Zekta's zero-knowledge architecture ensures your identity remains completely anonymous. 
              No data collection, no tracking, complete privacy.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-6">
              <Button asChild size="lg" className="gap-2" data-testid="button-try-now">
                <Link href="/swap">
                  <Shield className="w-5 h-5" />
                  Try Anonymous Swap
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" data-testid="button-read-more">
                <Link href="/docs">
                  Read Full Documentation
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
