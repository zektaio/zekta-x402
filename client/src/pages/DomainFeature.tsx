import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';
import { 
  Shield, 
  Globe, 
  Key, 
  Lock, 
  Wallet, 
  Mail, 
  User, 
  CheckCircle2, 
  ArrowRight,
  Code,
  Database,
  Zap,
  Eye,
  EyeOff,
  Server,
  Fingerprint,
  ShieldCheck,
  Bitcoin,
  Coins,
  Network,
  FileKey,
  AlertCircle
} from 'lucide-react';

export default function DomainFeature() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4 md:mb-6 text-sm md:text-lg px-3 md:px-4 py-1.5 md:py-2" data-testid="badge-new-feature">
              <Zap className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" />
              Revolutionary Domain Management
            </Badge>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent px-4">
              Own Domains Completely Anonymously
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-6 md:mb-8 leading-relaxed px-4">
              The world's first domain registration and management platform powered by 
              <span className="text-primary font-semibold"> Zero-Knowledge Identity</span>. 
              No wallet connection. No KYC. No email. Complete privacy.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 justify-center mb-8 md:mb-12 px-4">
              <Button 
                size="lg" 
                className="text-base md:text-lg px-6 md:px-8 w-full sm:w-auto"
                onClick={() => setLocation('/buy-domain')}
                data-testid="button-get-started"
              >
                Get Your Domain Now
                <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-base md:text-lg px-6 md:px-8 w-full sm:w-auto"
                onClick={() => setLocation('/docs')}
                data-testid="button-learn-more"
              >
                <Code className="mr-2 w-4 h-4 md:w-5 md:h-5" />
                View Documentation
              </Button>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto px-4">
              <Card className="p-4 md:p-6 hover-elevate">
                <EyeOff className="w-8 h-8 md:w-10 md:h-10 text-primary mb-2 md:mb-3 mx-auto" />
                <h3 className="text-lg md:text-2xl font-bold mb-1">100% Anonymous</h3>
                <p className="text-sm md:text-base text-muted-foreground">Zero personal data collected</p>
              </Card>
              <Card className="p-4 md:p-6 hover-elevate">
                <Coins className="w-8 h-8 md:w-10 md:h-10 text-primary mb-2 md:mb-3 mx-auto" />
                <h3 className="text-lg md:text-2xl font-bold mb-1">9 Cryptocurrencies</h3>
                <p className="text-sm md:text-base text-muted-foreground">Pay with BTC, ETH, SOL & more</p>
              </Card>
              <Card className="p-4 md:p-6 hover-elevate sm:col-span-2 md:col-span-1">
                <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-primary mb-2 md:mb-3 mx-auto" />
                <h3 className="text-lg md:text-2xl font-bold mb-1">Zero-Knowledge Proofs</h3>
                <p className="text-sm md:text-base text-muted-foreground">Cryptographic privacy guarantee</p>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-12 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12 md:mb-16 px-4"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">
                Traditional Domain Registration is Broken
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground">
                Every domain registrar today forces you to sacrifice your privacy
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
              <Card className="p-8 border-2 border-destructive/20">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-destructive/10 rounded-lg">
                    <User className="w-6 h-6 text-destructive" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Identity Exposure</h3>
                    <p className="text-muted-foreground">
                      Registrars require your full name, address, phone number, and email in WHOIS databases
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-8 border-2 border-destructive/20">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-destructive/10 rounded-lg">
                    <Wallet className="w-6 h-6 text-destructive" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Payment Tracking</h3>
                    <p className="text-muted-foreground">
                      Credit cards and bank transfers create permanent financial trails linking you to domains
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-8 border-2 border-destructive/20">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-destructive/10 rounded-lg">
                    <Mail className="w-6 h-6 text-destructive" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Account Dependencies</h3>
                    <p className="text-muted-foreground">
                      Must create accounts with email verification, linking domains to your digital identity
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-8 border-2 border-destructive/20">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-destructive/10 rounded-lg">
                    <Eye className="w-6 h-6 text-destructive" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Surveillance Risk</h3>
                    <p className="text-muted-foreground">
                      Governments and corporations can easily track domain ownership to individuals
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Zero-Knowledge Identity Solution */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16 px-4"
          >
            <Badge className="mb-3 md:mb-4 text-sm" data-testid="badge-zk-identity">
              <Fingerprint className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" />
              Powered by Semaphore Protocol
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">
              Zero-Knowledge Identity: The Solution
            </h2>
            <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Zekta uses cryptographic zero-knowledge proofs to let you own and manage domains 
              without revealing <span className="text-primary font-semibold">any personal information</span> whatsoever.
            </p>
          </motion.div>

          {/* ZK Identity Workflow Diagram */}
          <div className="max-w-5xl mx-auto mb-12 md:mb-16">
            <Card className="p-4 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-center">How Zero-Knowledge Login Works</h3>
              
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 relative">
                {/* Step 1 */}
                <div className="text-center">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                      <Key className="w-12 h-12 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                      1
                    </div>
                  </div>
                  <h4 className="text-base md:text-lg font-bold mb-2 md:mb-3">Domain Secret Generated</h4>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    When you purchase a domain, a unique cryptographic secret is generated. 
                    Only you have this secret; we never store it.
                  </p>
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg font-mono text-xs">
                    Secret: 256-bit random
                  </div>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex items-center justify-center">
                  <ArrowRight className="w-8 h-8 text-muted-foreground" />
                </div>

                {/* Step 2 */}
                <div className="text-center">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-accent/20 to-accent/10 rounded-full flex items-center justify-center">
                      <Shield className="w-12 h-12 text-accent" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-bold">
                      2
                    </div>
                  </div>
                  <h4 className="text-base md:text-lg font-bold mb-2 md:mb-3">ZK Commitment Created</h4>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Your secret generates a public "commitment", which is a cryptographic fingerprint. 
                    We store only this commitment, not your secret.
                  </p>
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg font-mono text-xs">
                    Commitment: hash(Secret)
                  </div>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex items-center justify-center md:col-span-3 -my-4">
                  <ArrowRight className="w-8 h-8 text-muted-foreground rotate-90 md:rotate-0" />
                </div>

                {/* Step 3 */}
                <div className="text-center sm:col-span-2 md:col-span-1 md:col-start-2">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                      <ShieldCheck className="w-12 h-12 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                      3
                    </div>
                  </div>
                  <h4 className="text-base md:text-lg font-bold mb-2 md:mb-3">Prove Without Revealing</h4>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    To manage your domain, you prove you know the secret without revealing it. 
                    No wallet. No email. No KYC. Pure cryptography.
                  </p>
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg font-mono text-xs">
                    ZK Proof: I know Secret ✓
                  </div>
                </div>
              </div>

              <div className="mt-6 md:mt-8 p-4 md:p-6 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-start gap-2 md:gap-3">
                  <Lock className="w-5 h-5 md:w-6 md:h-6 text-primary flex-shrink-0 mt-0.5 md:mt-1" />
                  <div>
                    <h4 className="text-sm md:text-base font-bold mb-1 md:mb-2">The Privacy Guarantee</h4>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Unlike traditional logins (email/password) or Web3 logins (wallet signatures), 
                      zero-knowledge proofs mean we <strong>mathematically cannot</strong> link your 
                      domain to any identity, email, wallet address, or personal information. 
                      It's cryptographically impossible.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Comparison Table */}
          <div className="max-w-5xl mx-auto">
            <Card className="p-4 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-center">Identity Comparison</h3>
              
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 md:py-4 px-2 md:px-4 text-xs md:text-sm">Feature</th>
                      <th className="text-center py-3 md:py-4 px-2 md:px-4 text-xs md:text-sm">Traditional</th>
                      <th className="text-center py-3 md:py-4 px-2 md:px-4 text-xs md:text-sm">Web3</th>
                      <th className="text-center py-3 md:py-4 px-2 md:px-4 text-xs md:text-sm text-primary">Zekta (ZK)</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs md:text-sm">
                    <tr className="border-b">
                      <td className="py-3 md:py-4 px-2 md:px-4 font-medium">Email Required</td>
                      <td className="text-center py-3 md:py-4 px-2 md:px-4 text-destructive">✗ Yes</td>
                      <td className="text-center py-3 md:py-4 px-2 md:px-4 text-primary">✓ No</td>
                      <td className="text-center py-3 md:py-4 px-2 md:px-4 text-primary font-bold">✓ No</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 md:py-4 px-2 md:px-4 font-medium">Wallet Connection</td>
                      <td className="text-center py-3 md:py-4 px-2 md:px-4 text-primary">✓ No</td>
                      <td className="text-center py-3 md:py-4 px-2 md:px-4 text-destructive">✗ Yes</td>
                      <td className="text-center py-3 md:py-4 px-2 md:px-4 text-primary font-bold">✓ No</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 md:py-4 px-2 md:px-4 font-medium">KYC Verification</td>
                      <td className="text-center py-3 md:py-4 px-2 md:px-4 text-destructive">✗ Often</td>
                      <td className="text-center py-3 md:py-4 px-2 md:px-4 text-primary">✓ No</td>
                      <td className="text-center py-3 md:py-4 px-2 md:px-4 text-primary font-bold">✓ No</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 md:py-4 px-2 md:px-4 font-medium">On-Chain Trail</td>
                      <td className="text-center py-3 md:py-4 px-2 md:px-4 text-primary">✓ No</td>
                      <td className="text-center py-3 md:py-4 px-2 md:px-4 text-destructive">✗ Public</td>
                      <td className="text-center py-3 md:py-4 px-2 md:px-4 text-primary font-bold">✓ Private</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 md:py-4 px-2 md:px-4 font-medium">Identity Linkage</td>
                      <td className="text-center py-3 md:py-4 px-2 md:px-4 text-destructive">✗ Full</td>
                      <td className="text-center py-3 md:py-4 px-2 md:px-4 text-destructive">✗ Wallet</td>
                      <td className="text-center py-3 md:py-4 px-2 md:px-4 text-primary font-bold">✓ Zero</td>
                    </tr>
                    <tr>
                      <td className="py-3 md:py-4 px-2 md:px-4 font-medium">Privacy Level</td>
                      <td className="text-center py-3 md:py-4 px-2 md:px-4 text-destructive font-bold">Low</td>
                      <td className="text-center py-3 md:py-4 px-2 md:px-4 text-yellow-600 font-bold">Medium</td>
                      <td className="text-center py-3 md:py-4 px-2 md:px-4 text-primary font-bold">Maximum</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Complete Workflow */}
      <section className="py-12 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16 px-4"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">
              How It Works: End-to-End
            </h2>
            <p className="text-base md:text-xl text-muted-foreground">
              From purchase to DNS management, completely anonymous
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {/* Step 1: Select Domain */}
              <Card className="p-4 md:p-6 hover-elevate">
                <div className="text-center">
                  <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <Globe className="w-7 h-7 md:w-8 md:h-8 text-primary" />
                  </div>
                  <div className="w-7 h-7 md:w-8 md:h-8 mx-auto mb-2 md:mb-3 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm">
                    1
                  </div>
                  <h3 className="text-base md:text-lg font-bold mb-2 md:mb-3">Select Domain</h3>
                  <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">
                    Choose your desired domain name and TLD. Real-time pricing in crypto.
                  </p>
                  <div className="text-xs font-mono bg-muted p-2 rounded">
                    example.com
                  </div>
                </div>
              </Card>

              {/* Step 2: Pay with Crypto */}
              <Card className="p-4 md:p-6 hover-elevate">
                <div className="text-center">
                  <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 bg-accent/10 rounded-full flex items-center justify-center">
                    <Bitcoin className="w-7 h-7 md:w-8 md:h-8 text-accent" />
                  </div>
                  <div className="w-7 h-7 md:w-8 md:h-8 mx-auto mb-2 md:mb-3 bg-accent rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm">
                    2
                  </div>
                  <h3 className="text-base md:text-lg font-bold mb-2 md:mb-3">Pay Anonymously</h3>
                  <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">
                    Pay with BTC, ETH, SOL, USDT, or 5 other cryptocurrencies. No account needed.
                  </p>
                  <div className="flex gap-1 justify-center flex-wrap">
                    <Badge variant="secondary" className="text-xs">BTC</Badge>
                    <Badge variant="secondary" className="text-xs">ETH</Badge>
                    <Badge variant="secondary" className="text-xs">SOL</Badge>
                    <Badge variant="secondary" className="text-xs">+6</Badge>
                  </div>
                </div>
              </Card>

              {/* Step 3: ZK Identity */}
              <Card className="p-4 md:p-6 hover-elevate">
                <div className="text-center">
                  <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <FileKey className="w-7 h-7 md:w-8 md:h-8 text-primary" />
                  </div>
                  <div className="w-7 h-7 md:w-8 md:h-8 mx-auto mb-2 md:mb-3 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm">
                    3
                  </div>
                  <h3 className="text-base md:text-lg font-bold mb-2 md:mb-3">Receive Secret</h3>
                  <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">
                    Get your unique domain secret. This is your key; save it securely.
                  </p>
                  <div className="text-xs font-mono bg-muted p-2 rounded truncate">
                    50,223,180,81...
                  </div>
                </div>
              </Card>

              {/* Step 4: Manage DNS */}
              <Card className="p-4 md:p-6 hover-elevate">
                <div className="text-center">
                  <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 bg-accent/10 rounded-full flex items-center justify-center">
                    <Server className="w-7 h-7 md:w-8 md:h-8 text-accent" />
                  </div>
                  <div className="w-7 h-7 md:w-8 md:h-8 mx-auto mb-2 md:mb-3 bg-accent rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm">
                    4
                  </div>
                  <h3 className="text-base md:text-lg font-bold mb-2 md:mb-3">Manage DNS</h3>
                  <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">
                    Use your secret to prove ownership and manage DNS records. No login required.
                  </p>
                  <div className="flex gap-1 justify-center flex-wrap">
                    <Badge variant="secondary" className="text-xs">A</Badge>
                    <Badge variant="secondary" className="text-xs">CNAME</Badge>
                    <Badge variant="secondary" className="text-xs">MX</Badge>
                  </div>
                </div>
              </Card>
            </div>

            <div className="mt-8 md:mt-12 text-center px-4">
              <Card className="p-4 md:p-8 inline-block max-w-full">
                <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4">
                  <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12 text-primary flex-shrink-0" />
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg md:text-xl font-bold mb-1">Total Time: Under 10 Minutes</h3>
                    <p className="text-sm md:text-base text-muted-foreground">From selection to full DNS control</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Stack */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16 px-4"
          >
            <Badge className="mb-3 md:mb-4 text-sm">
              <Code className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" />
              Built for Developers
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">
              Powered by Zekta Infrastructure
            </h2>
            <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto">
              This anonymous domain service is built entirely on the Zekta API and SDK, 
              demonstrating the power of our zero-knowledge platform.
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
            <Card className="p-6 md:p-8">
              <div className="w-16 h-16 mb-6 bg-primary/10 rounded-lg flex items-center justify-center">
                <Network className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Zekta API & SDK</h3>
              <p className="text-muted-foreground mb-6">
                Our zero-knowledge infrastructure handles identity generation, proof verification, 
                and anonymous transaction relaying. All cryptographic operations use battle-tested libraries.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Semaphore Protocol v4 integration</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Client-side proof generation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Server-side proof verification</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Gas-free transactions (we pay fees)</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8">
              <div className="w-16 h-16 mb-6 bg-accent/10 rounded-lg flex items-center justify-center">
                <Globe className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Njalla API</h3>
              <p className="text-muted-foreground mb-6">
                We integrate with Njalla, a privacy-focused domain registrar, to handle actual 
                domain registration and DNS management. They never see your information—only ours.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <span>500+ TLDs supported</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <span>Real-time domain availability</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <span>Full DNS record management</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <span>WHOIS privacy included</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8">
              <div className="w-16 h-16 mb-6 bg-primary/10 rounded-lg flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Semaphore ZK Protocol</h3>
              <p className="text-muted-foreground mb-6">
                The cryptographic foundation for our zero-knowledge identity system. 
                Industry-standard protocol used by privacy-focused applications worldwide.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>256-bit identity secrets</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Non-interactive zero-knowledge proofs</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Merkle tree group membership</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Audited cryptography</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* Architecture Diagram */}
          <Card className="p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-8 text-center">System Architecture</h3>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <ArrowRight className="w-6 h-6 text-muted-foreground flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-bold mb-1">User (Browser)</p>
                  <p className="text-sm text-muted-foreground">Generates ZK identity locally, creates proofs client-side</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Database className="w-6 h-6 text-accent" />
                </div>
                <ArrowRight className="w-6 h-6 text-muted-foreground flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-bold mb-1">Zekta Backend</p>
                  <p className="text-sm text-muted-foreground">Verifies proofs, relays transactions, manages crypto payments</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <ArrowRight className="w-6 h-6 text-muted-foreground flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-bold mb-1">Njalla Registrar</p>
                  <p className="text-sm text-muted-foreground">Receives payment from Zekta, registers domain, manages DNS</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm">
                <strong>Privacy Layer:</strong> Njalla only sees Zekta as the customer, not your information. 
                Your ZK commitment is stored in our database, but it cannot be reverse-engineered 
                to reveal your identity. Only someone with the original secret can prove ownership.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-12 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Built for Privacy-Conscious Users
            </h2>
          </motion.div>

          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
            <Card className="p-8">
              <Shield className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-4">Whistleblowers & Journalists</h3>
              <p className="text-muted-foreground">
                Host sensitive information without revealing your identity. No personal 
                data trail that could be subpoenaed or leaked. Perfect for investigative journalism 
                and anonymous publishing platforms.
              </p>
            </Card>

            <Card className="p-8">
              <Lock className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-4">Privacy Advocates</h3>
              <p className="text-muted-foreground">
                Own domains without sacrificing privacy. No WHOIS exposure, no email tracking, 
                no financial trails. Your online presence remains truly yours.
              </p>
            </Card>

            <Card className="p-8">
              <Code className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-4">Web3 Developers</h3>
              <p className="text-muted-foreground">
                Build decentralized applications with traditional domains but without centralized 
                identity requirements. Bridge Web2 infrastructure with Web3 privacy principles.
              </p>
            </Card>

            <Card className="p-8">
              <Bitcoin className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-4">Crypto Projects</h3>
              <p className="text-muted-foreground">
                Register project domains using crypto without linking them to founders' identities. 
                Maintain operational security while building in public.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Security Deep Dive */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4">
              <ShieldCheck className="w-4 h-4 mr-2" />
              Security & Privacy
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Cryptographic Guarantees
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-8">
            <Card className="p-6 md:p-8 border-2 border-yellow-500/20 bg-yellow-500/5">
              <div className="flex items-start gap-3 mb-6">
                <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-yellow-800 dark:text-yellow-300 mb-2">Important: Storage ≠ Access</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    We store these items to make the service work, but we <strong>CANNOT access, modify, or manage your domain</strong> without your secret. Even our own administrators cannot control your domain.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold mb-2 flex items-center gap-3">
                <Key className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                What's In Our Database
              </h3>
              <p className="text-sm text-muted-foreground mb-6">(But platform has ZERO control)</p>
              
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-green-500">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <p className="font-mono text-sm font-semibold">ZK Commitment (Public)</p>
                    <Badge variant="secondary" className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 text-xs">
                      Platform Access: NONE
                    </Badge>
                  </div>
                  <code className="text-xs text-muted-foreground block mb-2">
                    21498...63842 (cryptographic hash of your secret)
                  </code>
                  <p className="text-xs text-muted-foreground">
                    This is a meaningless number. Cannot be reversed to reveal your secret. Useless to attackers.
                  </p>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <p className="font-mono text-sm font-semibold">Domain Name</p>
                    <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20 text-xs">
                      Platform Access: READ ONLY
                    </Badge>
                  </div>
                  <code className="text-xs text-muted-foreground block mb-2">
                    example.com
                  </code>
                  <p className="text-xs text-muted-foreground">
                    We know which domain exists, but <strong>cannot transfer, modify, or manage it</strong> without your secret.
                  </p>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-purple-500">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <p className="font-mono text-sm font-semibold">DNS Records</p>
                    <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20 text-xs">
                      Platform Access: READ ONLY
                    </Badge>
                  </div>
                  <code className="text-xs text-muted-foreground block mb-2">
                    A, CNAME, MX records you configure
                  </code>
                  <p className="text-xs text-muted-foreground">
                    We display your DNS settings, but <strong>cannot add, edit, or delete records</strong> without your secret.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <EyeOff className="w-8 h-8 text-primary" />
                What We Never Store
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong>Your Domain Secret</strong> - Generated client-side, never transmitted to our servers</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong>Email Address</strong> - We don't ask for it, we don't need it</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong>Wallet Address</strong> - No wallet connection required at any point</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong>Personal Information</strong> - No name, address, phone, or ID</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong>Payment Source</strong> - We see crypto payments, but can't link them to you</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 md:p-8 border-2 border-red-500/20 bg-red-500/5">
              <h3 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-3">
                <Lock className="w-6 h-6 md:w-8 md:h-8 text-red-600 dark:text-red-400" />
                What Platform CANNOT Do
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                For complete transparency, here's what even we (platform administrators) cannot do:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">✕</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Cannot manage your DNS records</p>
                    <p className="text-xs text-muted-foreground">Only you can add, modify, or delete DNS entries with your secret</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">✕</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Cannot transfer your domain</p>
                    <p className="text-xs text-muted-foreground">Domain ownership is cryptographically bound to your secret only</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">✕</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Cannot recover your access if you lose your secret</p>
                    <p className="text-xs text-muted-foreground">No password reset, no account recovery. Your secret is the only key.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">✕</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Cannot link your domain to your identity</p>
                    <p className="text-xs text-muted-foreground">We have no way to determine who owns which domain</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">✕</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Cannot view or decrypt your domain secret</p>
                    <p className="text-xs text-muted-foreground">The commitment in our database is mathematically impossible to reverse</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">✕</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Cannot assist if you forget your secret</p>
                    <p className="text-xs text-muted-foreground">Support cannot help. This is by design for your security.</p>
                  </div>
                </li>
              </ul>
            </Card>

            <Card className="p-8">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <Shield className="w-8 h-8 text-primary" />
                How Zero-Knowledge Proofs Protect You
              </h3>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  When you want to manage your domain, you generate a zero-knowledge proof on your device 
                  that proves you know the secret without revealing it. Here's what makes it secure:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">1</span>
                    </div>
                    <div>
                      <p className="font-bold mb-1">Completeness</p>
                      <p className="text-sm text-muted-foreground">If you know the secret, the proof will always verify</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">2</span>
                    </div>
                    <div>
                      <p className="font-bold mb-1">Soundness</p>
                      <p className="text-sm text-muted-foreground">If you don't know the secret, you cannot create a valid proof (cryptographically impossible)</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">3</span>
                    </div>
                    <div>
                      <p className="font-bold mb-1">Zero-Knowledge</p>
                      <p className="text-sm text-muted-foreground">The proof reveals nothing about the secret itself; we learn only that you know it</p>
                    </div>
                  </li>
                </ul>
              </div>
            </Card>

            <Card className="p-6 md:p-8 border-2 border-primary/20 bg-primary/5">
              <div className="flex items-start gap-4">
                <ShieldCheck className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="text-lg md:text-xl font-bold mb-3">The Bottom Line: True Privacy</h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-4">
                    Even if our servers were compromised, an attacker would only see cryptographic commitments, 
                    which are meaningless numbers that cannot be reversed to reveal identities. <strong>Even we cannot determine 
                    who owns which domain or access your DNS settings.</strong>
                  </p>
                  <p className="text-sm md:text-base text-muted-foreground">
                    This is <strong>privacy by mathematics</strong>, not by policy. Your domain is truly yours, and only yours.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 px-4">
              Ready to Own Your Domain Anonymously?
            </h2>
            <p className="text-base md:text-xl text-muted-foreground mb-6 md:mb-8 px-4">
              Join the privacy revolution. Register your first domain with zero-knowledge identity today.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 justify-center px-4">
              <Button 
                size="lg" 
                className="text-base md:text-lg px-6 md:px-8 w-full sm:w-auto"
                onClick={() => setLocation('/buy-domain')}
                data-testid="button-cta-buy"
              >
                <Globe className="mr-2 w-4 h-4 md:w-5 md:h-5" />
                Buy Your Domain Now
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-base md:text-lg px-6 md:px-8 w-full sm:w-auto"
                onClick={() => setLocation('/docs')}
                data-testid="button-cta-docs"
              >
                <Code className="mr-2 w-4 h-4 md:w-5 md:h-5" />
                Read Full Documentation
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
