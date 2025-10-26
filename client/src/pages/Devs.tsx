import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowLeft, Code2, Rocket, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Devs() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center space-y-8"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-500/10 mb-8">
            <Code2 className="w-12 h-12 text-emerald-500" />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold">
            Developer <span className="gradient-text">Program</span>
          </h1>

          <p className="text-3xl md:text-4xl font-bold text-muted-foreground">
            Coming Soon
          </p>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            We are building something special for developers. Stay tuned for exclusive access to the Zekta ecosystem.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <Card className="p-6 text-center">
              <Rocket className="w-8 h-8 mx-auto mb-4 text-emerald-500" />
              <h3 className="text-lg font-semibold mb-2">Early Access</h3>
              <p className="text-sm text-muted-foreground">
                Get priority access to new features and APIs
              </p>
            </Card>

            <Card className="p-6 text-center">
              <Zap className="w-8 h-8 mx-auto mb-4 text-cyan-500" />
              <h3 className="text-lg font-semibold mb-2">Dev Resources</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive documentation and SDK support
              </p>
            </Card>

            <Card className="p-6 text-center">
              <Code2 className="w-8 h-8 mx-auto mb-4 text-purple-500" />
              <h3 className="text-lg font-semibold mb-2">Community</h3>
              <p className="text-sm text-muted-foreground">
                Join a community of privacy focused builders
              </p>
            </Card>
          </div>

          <div className="flex flex-wrap gap-4 justify-center mt-12">
            <Link href="/">
              <Button size="lg" variant="outline" data-testid="button-back-home">
                <ArrowLeft className="mr-2" />
                Back to Home
              </Button>
            </Link>
            <a href="https://t.me/zektaswapbot" target="_blank" rel="noopener noreferrer">
              <Button size="lg" data-testid="button-join-telegram">
                Join Telegram
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
