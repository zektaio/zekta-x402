import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Shield, Zap, ArrowRightLeft, CheckCircle2, Bot, Lock, Clock, ArrowRight, ExternalLink } from "lucide-react";
import FeatureHeader from "@/components/FeatureHeader";

export default function TelegramBot() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <FeatureHeader />
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5" />
        
        <div className="max-w-5xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              <MessageSquare className="w-4 h-4 text-cyan-500" />
              <span className="text-sm font-semibold text-cyan-400">Telegram Swap Bot</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
              Swap Crypto Instantly via <span className="gradient-text">@zektaswapbot</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Anonymous cryptocurrency swaps through a conversational interface. 
              5-step flow with inline keyboards, real-time prices, and complete privacy.
            </p>

            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Button asChild size="lg" className="gap-2" data-testid="button-open-bot">
                <a href="https://t.me/zektaswapbot" target="_blank" rel="noopener noreferrer">
                  <MessageSquare className="w-5 h-5" />
                  Open @zektaswapbot
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" data-testid="button-view-demo">
                View Demo
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
              Why Use <span className="gradient-text">Telegram Bot</span>?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The fastest way to swap crypto privately
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Bot,
                title: "Conversational UI",
                description: "Natural conversation flow with inline keyboards for easy navigation",
                color: "text-cyan-500"
              },
              {
                icon: Zap,
                title: "Real-Time Prices",
                description: "Live exchange rates and price previews before confirming swaps",
                color: "text-yellow-500"
              },
              {
                icon: Shield,
                title: "Address Validation",
                description: "Chain-specific address validation ensures your crypto goes to the right wallet",
                color: "text-green-500"
              },
              {
                icon: Lock,
                title: "Session Management",
                description: "Secure session handling with back navigation and state persistence",
                color: "text-purple-500"
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
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">5-Step Swap Flow</h2>
            <p className="text-lg text-muted-foreground">
              Complete anonymous swaps in five simple steps
            </p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                step: 1,
                title: "Start the bot",
                description: "Send /start to @zektaswapbot and you'll see a welcome message with swap options."
              },
              {
                step: 2,
                title: "Select currencies",
                description: "Choose which cryptocurrency to send and which to receive using inline keyboards."
              },
              {
                step: 3,
                title: "Enter amount",
                description: "Specify swap amount and see real-time exchange rate preview."
              },
              {
                step: 4,
                title: "Provide destination",
                description: "Enter your wallet address - automatic chain-specific validation ensures it's correct."
              },
              {
                step: 5,
                title: "Get deposit address",
                description: "Receive unique deposit address with blockchain explorer link to track your transaction."
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
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                      <span className="text-cyan-400 font-bold">{item.step}</span>
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
              Swap between 9 major cryptocurrencies with proper address validation
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {["SOL", "BTC", "ETH", "USDT", "USDC", "BNB", "MATIC", "AVAX", "ZEC"].map((crypto, index) => (
              <motion.div
                key={crypto}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-4 text-center hover-elevate border-border/40 bg-card/50">
                  <div className="text-xl font-bold text-primary">{crypto}</div>
                  <div className="text-xs text-muted-foreground mt-1">Validated</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* UX Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-border/40 bg-card/20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold mb-4">Enhanced UX Features</h2>
            <p className="text-lg text-muted-foreground">
              Built for convenience and security
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                icon: ArrowRight,
                title: "Back Navigation",
                description: "Go back to previous steps using inline Back buttons"
              },
              {
                icon: Lock,
                title: "Monospace Addresses",
                description: "Crypto addresses displayed in monospace for easy verification"
              },
              {
                icon: ExternalLink,
                title: "Explorer Links",
                description: "Direct blockchain explorer links to track transactions"
              },
              {
                icon: CheckCircle2,
                title: "Direct API Integration",
                description: "Seamless integration with Zekta swap APIs"
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-5 hover-elevate border-border/40">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-5 w-5 text-cyan-500" />
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
              Start Swapping on <span className="gradient-text">Telegram</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The fastest, most convenient way to swap crypto anonymously. 
              No registration, no KYC, complete privacy.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-6">
              <Button asChild size="lg" className="gap-2" data-testid="button-launch-bot">
                <a href="https://t.me/zektaswapbot" target="_blank" rel="noopener noreferrer">
                  <Bot className="w-5 h-5" />
                  Launch Bot
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" data-testid="button-web-swap">
                Try Web Swap
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
