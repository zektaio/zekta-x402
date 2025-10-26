import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Link } from 'wouter';
import { ArrowRight, Lock, Zap, Puzzle, Globe, ShieldCheck, Coins, ArrowRightLeft, Vote, Eye, Shield, Activity, Users, DollarSign, Code, TrendingUp, Gift, MessageSquare, ChevronRight, Key, FileText, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useQuery } from '@tanstack/react-query';

const AnimatedCounter = ({ value, duration = 2000 }: { value: number; duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
};

export default function Landing() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  const [timelineProgress, setTimelineProgress] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleScroll = () => {
      if (timelineRef.current) {
        const rect = timelineRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const elementTop = rect.top;
        const elementHeight = rect.height;
        
        if (elementTop < viewportHeight && elementTop + elementHeight > 0) {
          const progress = Math.max(0, Math.min(1, (viewportHeight - elementTop) / (viewportHeight + elementHeight)));
          setTimelineProgress(progress);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const codeExample = `const proof = await zekta.prove(identity, action);
await zekta.execute(proof);`;

  const features = [
    {
      icon: Lock,
      title: "Proof-Based Authentication",
      description: "Validate without revealing."
    },
    {
      icon: Zap,
      title: "On-Chain Speed",
      description: "Verified off-chain, executed instantly."
    },
    {
      icon: Puzzle,
      title: "Composable",
      description: "Plug into any DEX, wallet, or DAO."
    },
    {
      icon: Globe,
      title: "Public Proof Receipts",
      description: "Transparent verification, invisible identity."
    }
  ];

  const useCases = [
    {
      icon: Coins,
      title: "Private Payments",
      description: "Send tokens anonymously while maintaining verifiability.",
      detail: "Build this with Zekta SDK"
    },
    {
      icon: ArrowRightLeft,
      title: "Stealth Swaps",
      description: "Execute trades through a relayer without exposing origin wallets.",
      detail: "Build this with Zekta SDK"
    },
    {
      icon: Lock,
      title: "ZK-Login for dApps",
      description: "Authenticate with zero-knowledge proofs instead of wallet signatures.",
      detail: "Build this with Zekta SDK"
    },
    {
      icon: Vote,
      title: "Anonymous DAO Voting",
      description: "One-member-one-vote without identity disclosure.",
      detail: "Build this with Zekta SDK"
    },
    {
      icon: Eye,
      title: "Proof-Based Access",
      description: "Allow or restrict actions based on verified conditions, not addresses.",
      detail: "Build this with Zekta SDK"
    }
  ];

  const timeline = [
    { step: "1", title: "Identity generated locally", active: timelineProgress > 0.1 },
    { step: "2", title: "Proof constructed", active: timelineProgress > 0.3 },
    { step: "3", title: "Proof verified", active: timelineProgress > 0.5 },
    { step: "4", title: "Action executed", active: timelineProgress > 0.7 },
    { step: "5", title: "Result confirmed", active: timelineProgress > 0.9 }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div 
          style={{ opacity, scale }}
          className="max-w-6xl mx-auto text-center space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <div className="inline-block">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="text-5xl sm:text-7xl md:text-9xl font-bold tracking-tighter"
              >
                <span className="gradient-text">ZEKTA</span>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-sm md:text-base text-muted-foreground mt-2"
              >
                Zero-Knowledge Action Layer
              </motion.p>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight px-4"
          >
            Transactions and proofs without disclosure.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-base sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto px-4"
          >
            Prove. Execute. Stay unseen.<br />
            Privacy and performance, finally united.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center px-4"
          >
            <Link href="/token">
              <Button
                size="lg"
                className="text-base md:text-lg px-6 md:px-8 py-5 md:py-6 group w-full sm:w-auto"
                data-testid="button-zekta-token"
              >
                ZEKTA Token
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform flex-shrink-0 h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </Link>
            <Link href="/mvp">
              <Button
                size="lg"
                variant="outline"
                className="text-base md:text-lg px-6 md:px-8 py-5 md:py-6 backdrop-blur-sm bg-background/50 w-full sm:w-auto"
                data-testid="button-launch-mvp"
              >
                Launch MVP
              </Button>
            </Link>
            <Link href="/buy-domain">
              <Button
                size="lg"
                variant="outline"
                className="text-base md:text-lg px-6 md:px-8 py-5 md:py-6 backdrop-blur-sm bg-background/50 group relative w-full sm:w-auto"
                data-testid="button-buy-domain"
              >
                Buy Domains
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform flex-shrink-0 h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </Link>
            <Link href="/gift-cards">
              <Button
                size="lg"
                variant="outline"
                className="text-base md:text-lg px-6 md:px-8 py-5 md:py-6 backdrop-blur-sm bg-background/50 group relative w-full sm:w-auto"
                data-testid="button-buy-giftcards"
              >
                <div className="flex items-center gap-2">
                  <Gift className="h-4 w-4 md:h-5 md:w-5" />
                  <span>Buy Gift Cards</span>
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform flex-shrink-0 h-4 w-4 md:h-5 md:w-5" />
                </div>
              </Button>
            </Link>
            <Link href="/anonymousx">
              <Button
                size="lg"
                variant="default"
                className="text-base md:text-lg px-6 md:px-8 py-5 md:py-6 group relative w-full sm:w-auto"
                data-testid="button-anonymous-twitter"
              >
                <div className="flex items-center gap-2">
                  <span>ZK 𝕏</span>
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform flex-shrink-0 h-4 w-4 md:h-5 md:w-5" />
                </div>
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Quick Access Documentation Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Explore <span className="gradient-text">Zekta</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Jump to key features and documentation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: ArrowRightLeft,
                title: 'Anonymous Swaps',
                description: 'Swap crypto across 9 chains with zero identity disclosure',
                link: '/anonymous-swaps',
                color: 'text-emerald-500'
              },
              {
                icon: Globe,
                title: 'Domain Purchase',
                description: 'Register domains anonymously with ZK proof DNS management',
                link: '/domain-purchase',
                color: 'text-blue-500'
              },
              {
                icon: Gift,
                title: 'Gift Cards',
                description: 'Buy Amazon & Google Play cards anonymously',
                link: '/gift-cards',
                color: 'text-purple-500',
                badge: 'Coming Soon'
              },
              {
                icon: DollarSign,
                title: 'Revenue Distribution',
                description: 'Earn rewards proportional to your token holdings',
                link: '/revenue',
                color: 'text-yellow-500'
              },
              {
                icon: MessageSquare,
                title: 'Telegram Bot',
                description: 'Swap instantly via @zektaswapbot conversational interface',
                link: '/telegram-bot',
                color: 'text-cyan-500'
              },
              {
                icon: Shield,
                title: 'Security & Privacy',
                description: 'Learn how ZK proofs protect your identity',
                link: '/security-privacy',
                color: 'text-red-500'
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={item.link}>
                  <Card className="p-6 hover-elevate border-border/40 bg-card/50 backdrop-blur-sm h-full cursor-pointer group">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg bg-background/80 ${item.color}`}>
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg">{item.title}</h3>
                          {item.badge && (
                            <Badge variant="default" className="text-xs bg-primary text-primary-foreground">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                        <div className="mt-3 flex items-center text-sm text-primary group-hover:translate-x-1 transition-transform">
                          Learn more <ChevronRight className="w-4 h-4 ml-1" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Protocol Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative border-y border-border/40">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[
                { 
                  icon: Activity, 
                  label: 'Anonymous Transactions', 
                  value: statsData?.stats?.totalSwaps || 0,
                  color: 'text-emerald-500',
                  formatter: (v: number) => v.toLocaleString()
                },
                { 
                  icon: Shield, 
                  label: 'Privacy Proofs Verified', 
                  value: statsData?.stats?.proofsVerified || 0,
                  color: 'text-cyan-500',
                  formatter: (v: number) => v.toLocaleString()
                },
                { 
                  icon: Users, 
                  label: 'Stealth Wallets', 
                  value: statsData?.stats?.activeWallets || 0,
                  color: 'text-purple-500',
                  formatter: (v: number) => v.toLocaleString()
                },
                { 
                  icon: DollarSign, 
                  label: 'Shielded Swap Processed', 
                  value: statsData?.stats?.totalVolumeUSD || 0,
                  color: 'text-emerald-500',
                  formatter: (v: number) => `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="p-4 md:p-6 text-center hover-elevate border-border/40 bg-card/50 backdrop-blur-sm">
                    <stat.icon className={`w-6 h-6 md:w-8 md:h-8 mx-auto mb-3 ${stat.color}`} />
                    <div className="text-2xl md:text-4xl font-bold mb-2">
                      {stat.formatter ? stat.formatter(stat.value) : <AnimatedCounter value={stat.value} />}
                    </div>
                    <div className="text-xs md:text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Overview Section */}
      <section id="overview" className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">
              What is <span className="gradient-text">Zero-Knowledge Action</span>?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 mt-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-4 text-lg text-muted-foreground"
            >
              <p>
                Zekta introduces the concept of a <strong className="text-foreground">Zero-Knowledge Action (ZKA)</strong>, 
                a verifiable, privacy-preserving way to interact with blockchain systems.
              </p>
              <p>
                Instead of directly signing a transaction, users generate a zero-knowledge proof that validates 
                their right to act without disclosing identity or wallet data.
              </p>
              <p>
                Once verified, the Zekta relayer executes the action on-chain, creating a public transaction 
                whose origin remains unlinkable to the user.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="glow-border rounded-lg p-8 space-y-6">
                {['User', 'Proof', 'Verifier', 'Chain'].map((step, index) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary flex items-center justify-center">
                      <span className="text-primary font-bold">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-lg font-semibold">{step}</div>
                      <div className="text-sm text-muted-foreground">
                        {index === 0 && "identity hidden"}
                        {index === 1 && "cryptographically proven"}
                        {index === 2 && "proof verified"}
                        {index === 3 && "action confirmed"}
                      </div>
                    </div>
                    {index < 3 && (
                      <div className="h-px w-8 bg-gradient-to-r from-primary to-accent" />
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-16 text-center"
          >
            Privacy, <span className="gradient-text">Proven.</span>
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 h-full glow-border hover-elevate active-elevate-2 transition-all duration-300" data-testid={`card-feature-${index}`}>
                  <feature.icon className="w-10 h-10 text-primary mb-4 flex-shrink-0" />
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Timeline */}
      <section ref={timelineRef} className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-16 text-center"
          >
            How <span className="gradient-text">ZEKTA</span> Works
          </motion.h2>

          <div className="space-y-8 relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-primary opacity-30" />
            
            {timeline.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -30 }}
                animate={{ 
                  opacity: item.active ? 1 : 0.3,
                  x: 0 
                }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-6 relative"
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl transition-all duration-500 z-10 ${
                  item.active 
                    ? 'bg-primary text-primary-foreground neon-glow scale-110' 
                    : 'bg-card border-2 border-border text-muted-foreground'
                }`}>
                  {item.step}
                </div>
                <div className={`flex-1 p-4 rounded-lg transition-all duration-500 ${
                  item.active ? 'glow-border bg-card/50' : 'bg-card/30'
                }`}>
                  <div className="text-lg font-semibold">{item.title}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {timelineProgress > 0.9 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-12 text-center"
            >
              <ShieldCheck className="w-16 h-16 text-primary mx-auto mb-4 flex-shrink-0" />
              <p className="text-xl text-primary font-semibold">Proof verified ✓</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Use Cases Horizontal Scroll */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-16 text-center"
          >
            Built for Privacy at <span className="gradient-text">Scale</span>
          </motion.h2>

          <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex-shrink-0 w-80 snap-center group"
              >
                <div className="h-full glow-border rounded-lg p-6 hover-elevate active-elevate-2 transition-all duration-300 perspective-1000">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {(() => {
                        const IconComponent = useCase.icon;
                        return <IconComponent className="w-6 h-6 text-primary flex-shrink-0" />;
                      })()}
                    </div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold">{useCase.title}</h3>
                      {(useCase as any).comingSoon && (
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">Coming Soon</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">{useCase.description}</p>
                    <div className="pt-4 border-t border-border">
                      <Link href="/integration-example">
                        <p className="text-sm text-primary cursor-pointer hover:underline">{useCase.detail}</p>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Diagram */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-16 text-center"
          >
            <span className="gradient-text">Proof-to-Action</span> Pipeline
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glow-border rounded-lg p-8 md:p-12"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {['User', 'ZK Proof Engine', 'Verification Layer', 'Blockchain Action'].map((step, index) => (
                <div key={step} className="flex items-center gap-4">
                  <div className="text-center space-y-2">
                    <div className="w-24 h-24 mx-auto rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/50 flex items-center justify-center">
                      <span className="text-sm font-semibold px-2">{step}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {index === 0 && "Unlinkable"}
                      {index === 1 && "Cryptographic"}
                      {index === 2 && "Verifiable"}
                      {index === 3 && "Transparent"}
                    </p>
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block w-16 h-px bg-gradient-to-r from-primary to-accent" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Developer Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Build with <span className="gradient-text">Zekta</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="my-12 glow-border rounded-lg overflow-hidden"
          >
            <SyntaxHighlighter
              language="typescript"
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                borderRadius: '0.5rem',
                fontSize: '1.1rem',
                padding: '2rem',
              }}
            >
              {codeExample}
            </SyntaxHighlighter>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-xl text-muted-foreground mb-8"
          >
            Simple API. Advanced privacy.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link href="/docs">
              <Button size="lg" variant="outline" data-testid="button-docs">
                Docs
              </Button>
            </Link>
            <a href="https://t.me/zektaswapbot" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" data-testid="button-telegram">
                Telegram Bot
              </Button>
            </a>
            <Link href="/devs">
              <Button size="lg" data-testid="button-join-dev">
                Join Developer Group
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4"
          >
            <h2 className="text-4xl md:text-6xl font-bold gradient-text">
              Latest Updates
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Stay informed with the latest developments from the ZEKTA ecosystem
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-6">
            {/* x402 Documentation - Oct 26 (NEWEST) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.0 }}
            >
              <Link href="/blog/x402-documentation">
                <Card className="hover-elevate active-elevate-2 cursor-pointer overflow-hidden border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-indigo-500/5" data-testid="card-x402-docs">
                  <div className="p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500/30 to-indigo-500/20 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-8 h-8 text-blue-500 flex-shrink-0" />
                      </div>
                      <div className="flex-1 space-y-3 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                          <Activity className="w-4 h-4 flex-shrink-0" />
                          <time dateTime="2025-10-26">October 26, 2025</time>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-xl sm:text-2xl font-bold leading-tight">
                            Complete x402 Marketplace Technical Documentation
                          </h3>
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">Documentation</Badge>
                        </div>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                          60+ page comprehensive reference covering tech stack, database schema, payment flows, API specs, and complete implementation guide for the x402 marketplace.
                        </p>
                        <div className="flex flex-wrap items-center gap-3 sm:gap-6 pt-2">
                          <div className="flex items-center gap-2">
                            <Database className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">5 Database Tables</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Code className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">15+ API Endpoints</span>
                          </div>
                        </div>
                        <div className="pt-2">
                          <span className="text-sm sm:text-base text-blue-500 font-semibold inline-flex items-center gap-2">
                            Read Documentation
                            <ArrowRight className="w-4 h-4 flex-shrink-0" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>

            {/* Revenue System Update - Oct 26 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Link href="/blog/revenue-system-update">
                <Card className="hover-elevate active-elevate-2 cursor-pointer overflow-hidden border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-green-500/5" data-testid="card-revenue-system">
                  <div className="p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-emerald-500/30 to-green-500/20 flex items-center justify-center flex-shrink-0">
                        <DollarSign className="w-8 h-8 text-emerald-500 flex-shrink-0" />
                      </div>
                      <div className="flex-1 space-y-3 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                          <Activity className="w-4 h-4 flex-shrink-0" />
                          <time dateTime="2025-10-26">October 26, 2025</time>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-xl sm:text-2xl font-bold leading-tight">
                            Revenue Distribution Complete & System Migration
                          </h3>
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">Distribution</Badge>
                        </div>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                          First major distribution complete: $4,436 (22.88 SOL) to 708 holders. Plus, we're migrating from unfair snapshot-based rewards to real-time 10-minute accumulation that rewards loyalty.
                        </p>
                        <div className="flex flex-wrap items-center gap-3 sm:gap-6 pt-2">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">Fair Rewards</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">Real-Time Tracking</span>
                          </div>
                        </div>
                        <div className="pt-2">
                          <span className="text-sm sm:text-base text-emerald-500 font-semibold inline-flex items-center gap-2">
                            Read Full Update
                            <ArrowRight className="w-4 h-4 flex-shrink-0" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>

            {/* ZK𝕏 Tech Explained - Oct 25 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link href="/zkx-tech-explained">
                <Card className="hover-elevate active-elevate-2 cursor-pointer overflow-hidden border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/5" data-testid="card-zkx-tech">
                  <div className="p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-cyan-500/30 to-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <Code className="w-8 h-8 text-cyan-500 flex-shrink-0" />
                      </div>
                      <div className="flex-1 space-y-3 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                          <Activity className="w-4 h-4 flex-shrink-0" />
                          <time dateTime="2025-10-25">October 25, 2025</time>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-xl sm:text-2xl font-bold leading-tight">
                            ZK𝕏 Tech Explained: How Anonymous Posting Actually Works
                          </h3>
                          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs">Tech Deep Dive</Badge>
                        </div>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                          Clearing up misconceptions: ZK𝕏 uses official OAuth 2.0 API, not browser automation or bots. 
                          Learn how ZK proofs authenticate users anonymously while staying fully compliant with 𝕏's Terms of Service.
                        </p>
                        <div className="flex flex-wrap items-center gap-3 sm:gap-6 pt-2">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">Official 𝕏 API</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Code className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">ZK Authentication</span>
                          </div>
                        </div>
                        <div className="pt-2">
                          <span className="text-sm sm:text-base text-cyan-500 font-semibold inline-flex items-center gap-2">
                            Read Tech Explanation
                            <ArrowRight className="w-4 h-4 flex-shrink-0" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>

            {/* ZK Twitter Feature - Oct 24 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Link href="/zk-twitter">
                <Card className="hover-elevate active-elevate-2 cursor-pointer overflow-hidden border-primary/30 bg-gradient-to-br from-primary/10 to-purple-500/5" data-testid="card-zk-twitter">
                  <div className="p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/30 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <div className="text-3xl font-bold">𝕏</div>
                      </div>
                      <div className="flex-1 space-y-3 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                          <Activity className="w-4 h-4 flex-shrink-0" />
                          <time dateTime="2025-10-24">October 24, 2025</time>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-xl sm:text-2xl font-bold leading-tight">
                            ZK 𝕏: One Account, Infinite Anonymous Identities
                          </h3>
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">New</Badge>
                        </div>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                          Anyone can log in to this Twitter account using their Zekta ID. No email, no password, no OAuth.
                          Just cryptographic proof that it's you, verified privately on-chain through the Zekta Protocol.
                        </p>
                        <div className="flex flex-wrap items-center gap-3 sm:gap-6 pt-2">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">Zero-Knowledge Sessions</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Key className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">Unlimited Identities</span>
                          </div>
                        </div>
                        <div className="pt-2">
                          <span className="text-sm sm:text-base text-primary font-semibold inline-flex items-center gap-2">
                            Read Article
                            <ArrowRight className="w-4 h-4 flex-shrink-0" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>

            {/* Anonymous Gift Cards Feature - Oct 23 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Link href="/gift-cards">
                <Card className="hover-elevate active-elevate-2 cursor-pointer overflow-hidden border-green-500/30 bg-gradient-to-br from-green-500/10 to-blue-500/5" data-testid="card-gift-cards">
                  <div className="p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-green-500/30 to-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <Gift className="w-8 h-8 text-green-500 flex-shrink-0" />
                      </div>
                      <div className="flex-1 space-y-3 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                          <Activity className="w-4 h-4 flex-shrink-0" />
                          <time dateTime="2025-10-23">October 23, 2025</time>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-xl sm:text-2xl font-bold leading-tight">
                            Anonymous Gift Cards: Privacy-First Digital Purchases
                          </h3>
                          <Badge className="bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30 text-xs">Coming Soon</Badge>
                        </div>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                          Buy Amazon, Google Play, Steam, and Spotify gift cards with cryptocurrency. No email, no account, complete privacy.
                          Powered by zero-knowledge proofs - only you can access your gift cards.
                        </p>
                        <div className="flex flex-wrap items-center gap-3 sm:gap-6 pt-2">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">Zero-Knowledge Access</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Gift className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">Instant Delivery</span>
                          </div>
                        </div>
                        <div className="pt-2">
                          <span className="text-sm sm:text-base text-green-500 font-semibold inline-flex items-center gap-2">
                            Browse Gift Cards
                            <ArrowRight className="w-4 h-4 flex-shrink-0" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>

            {/* Anonymous Payments Feature - Oct 22 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Link href="/anonymous-payments">
                <Card className="hover-elevate active-elevate-2 cursor-pointer overflow-hidden border-primary/30 bg-gradient-to-br from-primary/10 to-blue-500/5" data-testid="card-anonymous-payments">
                  <div className="p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/30 to-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <Gift className="w-8 h-8 text-primary flex-shrink-0" />
                      </div>
                      <div className="flex-1 space-y-3 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                          <Activity className="w-4 h-4 flex-shrink-0" />
                          <time dateTime="2025-10-22">October 22, 2025</time>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-xl sm:text-2xl font-bold leading-tight">
                            Anonymous Payments: Buy Gift Cards with Zero-Knowledge Identity
                          </h3>
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">Knowledge</Badge>
                        </div>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                          Buy Amazon and Google Play gift cards anonymously using cryptocurrency. No email, no KYC, no personal data. 
                          Built on Zekta API/SDK, this feature demonstrates the power of privacy-first digital payments with instant delivery.
                        </p>
                        <div className="flex flex-wrap items-center gap-3 sm:gap-6 pt-2">
                          <div className="flex items-center gap-2">
                            <Gift className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">Amazon & Google Play</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Coins className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">9 Cryptocurrencies</span>
                          </div>
                        </div>
                        <div className="pt-2">
                          <span className="text-sm sm:text-base text-primary font-semibold inline-flex items-center gap-2">
                            Learn More
                            <ArrowRight className="w-4 h-4 flex-shrink-0" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>

            {/* ZK ID Explained - Oct 22 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link href="/zekta-zkid">
                <Card className="hover-elevate active-elevate-2 cursor-pointer overflow-hidden border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-cyan-500/5" data-testid="card-zk-id">
                  <div className="p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500/30 to-cyan-400/20 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-8 h-8 text-blue-500 flex-shrink-0" />
                      </div>
                      <div className="flex-1 space-y-3 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                          <Activity className="w-4 h-4 flex-shrink-0" />
                          <time dateTime="2025-10-22">October 22, 2025</time>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-xl sm:text-2xl font-bold leading-tight">
                            Understanding ZK ID: The Heart of Anonymous Operations
                          </h3>
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">Knowledge</Badge>
                        </div>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                          Your cryptographic identity. No signup. No email. No KYC. Just privacy-preserving proof that you're authorized to act. 
                          Power anonymous swaps, domain ownership, and payments without revealing who you are.
                        </p>
                        <div className="flex flex-wrap items-center gap-3 sm:gap-6 pt-2">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">Zero-Knowledge Proofs</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Lock className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">Privacy-First</span>
                          </div>
                        </div>
                        <div className="pt-2">
                          <span className="text-sm sm:text-base text-blue-500 font-semibold inline-flex items-center gap-2">
                            Learn How It Works
                            <ArrowRight className="w-4 h-4 flex-shrink-0" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>

            {/* Anonymous Domain Feature - Oct 21 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Link href="/domain-feature">
                <Card className="hover-elevate active-elevate-2 cursor-pointer overflow-hidden border-primary/30 bg-gradient-to-br from-primary/10 to-accent/5" data-testid="card-domain-feature">
                  <div className="p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center flex-shrink-0">
                        <Globe className="w-8 h-8 text-primary flex-shrink-0" />
                      </div>
                      <div className="flex-1 space-y-3 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                          <Activity className="w-4 h-4 flex-shrink-0" />
                          <time dateTime="2025-10-21">October 21, 2025</time>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-xl sm:text-2xl font-bold leading-tight">
                            Anonymous Domain Registration: Zero-Knowledge Identity in Action
                          </h3>
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Live Now</Badge>
                        </div>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                          Own and manage domains completely anonymously with zero-knowledge proofs. No wallet connection, no KYC, no email required. 
                          Built on Zekta API/SDK, powered by Semaphore Protocol. The first domain registrar using ZK identity for complete privacy.
                        </p>
                        <div className="flex flex-wrap items-center gap-3 sm:gap-6 pt-2">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">Zero-Knowledge Login</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">9 Cryptocurrencies</span>
                          </div>
                        </div>
                        <div className="pt-2">
                          <span className="text-sm sm:text-base text-primary font-semibold inline-flex items-center gap-2">
                            Read Full Article
                            <ArrowRight className="w-4 h-4 flex-shrink-0" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>

            {/* API & SDK Vision Article - Oct 20 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Link href="/api-sdk-vision">
                <Card className="hover-elevate active-elevate-2 cursor-pointer overflow-hidden border-accent/30 bg-gradient-to-br from-accent/10 to-primary/5" data-testid="card-api-sdk-vision">
                  <div className="p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-accent/30 to-primary/20 flex items-center justify-center flex-shrink-0">
                        <Code className="w-8 h-8 text-accent flex-shrink-0" />
                      </div>
                      <div className="flex-1 space-y-3 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                          <Activity className="w-4 h-4 flex-shrink-0" />
                          <time dateTime="2025-10-20">October 20, 2025</time>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-xl sm:text-2xl font-bold leading-tight">
                            Zekta API & SDK Vision: What Happens After Launch
                          </h3>
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">Coming Soon</Badge>
                        </div>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                          Once our API and SDK are released, any developer will be able to build privacy-first applications on top of Zekta. 
                          Discover the self-sustaining revenue loop, developer benefits, real-world use cases, and how the ecosystem scales with every integration.
                        </p>
                        <div className="flex flex-wrap items-center gap-3 sm:gap-6 pt-2">
                          <div className="flex items-center gap-2">
                            <Code className="w-4 h-4 text-accent flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">Developer Ecosystem</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">Revenue Growth Model</span>
                          </div>
                        </div>
                        <div className="pt-2">
                          <span className="text-sm sm:text-base text-accent font-semibold inline-flex items-center gap-2">
                            Read Full Article
                            <ArrowRight className="w-4 h-4 flex-shrink-0" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>

            {/* ZEC T-Address Support Announcement - Oct 19 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <Link href="/blog/zcash-support-announcement">
                <Card className="hover-elevate active-elevate-2 cursor-pointer overflow-hidden border-primary/30 bg-primary/5" data-testid="card-zec-article">
                  <div className="p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                      <div className="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-8 h-8 text-primary flex-shrink-0" />
                      </div>
                      <div className="flex-1 space-y-3 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                          <Activity className="w-4 h-4 flex-shrink-0" />
                          <time dateTime="2025-10-19">October 19, 2025</time>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold leading-tight">
                          Introducing Zcash Support: T-Address Swaps Now Available
                        </h3>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                          ZEKTA protocol now supports Zcash (ZEC) transparent addresses (T-addresses) for private cross-chain swaps. 
                          Users can swap between ZEC T-addresses and 8+ blockchain networks while maintaining zero-knowledge privacy through our Semaphore-based proof system. 
                          Shielded Z-addresses (private transactions) and unified U-addresses (sapling + orchard) will be integrated in future updates, 
                          fully aligned with ZEKTA's zero-knowledge cryptographic architecture.
                        </p>
                        <div className="flex flex-wrap items-center gap-3 sm:gap-6 pt-2">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">T-Address Support Live</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">8+ Chains</span>
                          </div>
                        </div>
                        <div className="pt-2">
                          <span className="text-sm sm:text-base text-primary font-semibold inline-flex items-center gap-2">
                            Read Full Article
                            <ArrowRight className="w-4 h-4 flex-shrink-0" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>

            {/* Revenue Share Article - Oct 18 (OLDEST) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <Link href="/blog/revenue-share-test-completed">
                <Card className="hover-elevate active-elevate-2 cursor-pointer overflow-hidden" data-testid="card-revenue-article">
                  <div className="p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                      <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <DollarSign className="w-8 h-8 text-primary flex-shrink-0" />
                      </div>
                      <div className="flex-1 space-y-3 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                          <Activity className="w-4 h-4 flex-shrink-0" />
                          <time dateTime="2025-10-18">October 18, 2025</time>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold leading-tight">
                          Revenue Share Test Successfully Completed
                        </h3>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                          Over $1,400 distributed to 22 eligible ZEKTA holders in our first revenue sharing milestone. 
                          Learn how our transparent revenue distribution model works and what is coming next.
                        </p>
                        <div className="flex flex-wrap items-center gap-3 sm:gap-6 pt-2">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">$1,426.48 Distributed</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">22 Holders</span>
                          </div>
                        </div>
                        <div className="pt-2">
                          <span className="text-sm sm:text-base text-primary font-semibold inline-flex items-center gap-2">
                            Read Full Article
                            <ArrowRight className="w-4 h-4 flex-shrink-0" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Closing Banner */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto text-center space-y-8"
        >
          <h2 className="text-5xl md:text-7xl font-bold">
            Proof of <span className="gradient-text">Trust.</span>
          </h2>
          
          <div className="space-y-4">
            <p className="text-3xl md:text-4xl font-bold">ZEKTA</p>
            <p className="text-xl md:text-2xl text-muted-foreground">
              The invisible layer of blockchain action.
            </p>
            <p className="text-lg md:text-xl gradient-text font-semibold">
              Zero-Knowledge. Full Velocity.
            </p>
          </div>

          <Link href="/developer">
            <Button size="lg" className="text-lg px-12 py-6 mt-8" data-testid="button-start-building">
              Start Building
              <Badge className="ml-2 bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">Coming Soon</Badge>
              <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </motion.div>
      </section>

    </div>
  );
}
