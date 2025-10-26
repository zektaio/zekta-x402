import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Globe, Shield, Lock, Zap, CheckCircle2, Server, Key, Eye, ArrowRight, Search, Mail, FileText, Link as LinkIcon } from "lucide-react";
import FeatureHeader from "@/components/FeatureHeader";

export default function DomainPurchase() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <FeatureHeader />
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5" />
        
        <div className="max-w-5xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
              <Globe className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold text-blue-400">Anonymous Domain Registration</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
              Register Domains <span className="gradient-text">Anonymously</span>
              <br />with ZK Proof DNS Management
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Buy domains with cryptocurrency. No personal information. Zero-knowledge proof authentication 
              for complete DNS control without revealing your identity.
            </p>

            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Button asChild size="lg" className="gap-2" data-testid="button-buy-domain">
                <Link href="/buy-domain">
                  <Globe className="w-5 h-5" />
                  Buy Domain Now
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" data-testid="button-my-domains">
                <Link href="/my-domains">
                  <Server className="w-5 h-5" />
                  Manage My Domains
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
              Why Choose <span className="gradient-text">Zekta Domains</span>?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The most private way to own and manage domains
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: "Zero-Knowledge Auth",
                description: "Manage DNS with cryptographic proofs instead of traditional logins",
                color: "text-green-500"
              },
              {
                icon: Eye,
                title: "Complete Anonymity",
                description: "No wallet addresses stored, no identity linkage between domains",
                color: "text-blue-500"
              },
              {
                icon: Lock,
                title: "Secret-Based Control",
                description: "Only you have the domain secret - complete ownership guarantee",
                color: "text-purple-500"
              },
              {
                icon: Zap,
                title: "Instant Setup",
                description: "Automated payment flow with instant domain registration",
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
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How Domain Purchase Works</h2>
            <p className="text-lg text-muted-foreground">
              Anonymous domain registration in four simple steps
            </p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                step: 1,
                title: "Search and select domain",
                description: "Check domain availability and see real-time pricing in cryptocurrency."
              },
              {
                step: 2,
                title: "Pay with cryptocurrency",
                description: "Send payment in BTC, ETH, SOL, or other supported cryptocurrencies."
              },
              {
                step: 3,
                title: "Receive domain secret",
                description: "Get a unique ZK identity secret - save it securely as it's the only way to manage your domain."
              },
              {
                step: 4,
                title: "Manage DNS records",
                description: "Use your domain secret to add, update, or delete DNS records with zero-knowledge proof authentication."
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
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
                      <span className="text-blue-400 font-bold">{item.step}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DNS Management Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Full <span className="gradient-text">DNS Control</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Manage all DNS record types with zero-knowledge proof authentication
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                type: "A Record",
                description: "Point your domain to IPv4 addresses",
                icon: Server
              },
              {
                type: "AAAA Record",
                description: "Point your domain to IPv6 addresses",
                icon: Server
              },
              {
                type: "CNAME Record",
                description: "Create aliases for your domain",
                icon: LinkIcon
              },
              {
                type: "MX Record",
                description: "Configure email servers for your domain",
                icon: Mail
              },
              {
                type: "TXT Record",
                description: "Add text records for verification and SPF",
                icon: FileText
              },
              {
                type: "NS Record",
                description: "Delegate DNS to custom nameservers",
                icon: Server
              }
            ].map((record, index) => (
              <motion.div
                key={record.type}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-5 hover-elevate border-border/40 bg-card/50">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <Server className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{record.type}</h4>
                      <p className="text-sm text-muted-foreground">{record.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-border/40 bg-card/20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold mb-4">Privacy-First Architecture</h2>
            <p className="text-lg text-muted-foreground">
              How Zekta ensures your domain ownership remains completely anonymous
            </p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                icon: Shield,
                title: "No Wallet Addresses Stored",
                description: "We never store your cryptocurrency wallet addresses - only ZK commitments"
              },
              {
                icon: Key,
                title: "Secret-Only Authentication",
                description: "Backend verifies secrets transiently by deriving commitment - secrets are never stored"
              },
              {
                icon: Lock,
                title: "HTTPS Protection",
                description: "Secret transmission protected by HTTPS - only correct secret holders can manage DNS"
              },
              {
                icon: Eye,
                title: "Zero Identity Linkage",
                description: "No connection between domains, no tracking across purchases"
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
              Own Domains <span className="gradient-text">Anonymously</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Register and manage domains with complete privacy using zero-knowledge proofs. 
              No personal information, no identity disclosure.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-6">
              <Button asChild size="lg" className="gap-2" data-testid="button-launch-domain">
                <Link href="/buy-domain">
                  <Search className="w-5 h-5" />
                  Search Domains
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" data-testid="button-learn-more">
                <Link href="/docs">
                  Learn More
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
