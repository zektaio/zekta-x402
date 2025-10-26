import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Lock, TrendingUp, Code, Users, DollarSign, Clock, ExternalLink, PieChart, BarChart3, Coins, Activity, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

export default function Token() {
  const { data: pumpData, isLoading } = useQuery<{
    ok: boolean;
    stats: {
      currentPoolUSD: number;
      cumulativeDistributedUSD: number;
      dexVolumeUSD: number;
      dexRevenueUSD: number;
      zkSwapVolumeUSD: number;
      zkSwapRevenueUSD: number;
      lastUpdated: string;
    };
  }>({
    queryKey: ['/api/stats/pumpfun'],
    refetchInterval: 60000,
  });
  const tokenDistribution = [
    { name: 'Community and Ecosystem', value: 40, color: '#10B981' },
    { name: 'Development Team', value: 20, color: '#3B82F6' },
    { name: 'Treasury and Operations', value: 25, color: '#8B5CF6' },
    { name: 'Liquidity Pool', value: 15, color: '#F59E0B' },
  ];

  const revenueFlow = [
    { source: 'Swap Fees', holders: 60, treasury: 25, liquidity: 15 },
    { source: 'API Revenue', holders: 70, treasury: 20, liquidity: 10 },
  ];

  const vestingTimeline = [
    { month: 'Month 0', amount: 0 },
    { month: 'Month 3', amount: 25 },
    { month: 'Month 6', amount: 50 },
    { month: 'Month 9', amount: 75 },
    { month: 'Month 12', amount: 100 },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
            {/* Quick Stats Grid */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Weekly stats</h2>
              {isLoading ? (
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-20" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                  <Card className="hover-elevate" data-testid="card-hero-total-revenue">
                    <CardContent className="p-4">
                      <div className="text-xs text-muted-foreground mb-1">Current Pool</div>
                      <div className="text-lg font-bold gradient-text">
                        ${(pumpData?.stats?.currentPoolUSD || 0).toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Available for distribution
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover-elevate" data-testid="card-hero-trading-fees">
                    <CardContent className="p-4">
                      <div className="text-xs text-muted-foreground mb-1">Total Distributed</div>
                      <div className="text-lg font-bold gradient-text">
                        ${(pumpData?.stats?.cumulativeDistributedUSD || 0).toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Paid to token holders
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover-elevate border-blue-500/30 bg-blue-500/5" data-testid="card-hero-zk-swap-volume">
                    <CardContent className="p-4">
                      <div className="text-xs text-muted-foreground mb-1">ZK Swap Volume</div>
                      <div className="text-lg font-bold gradient-text">
                        ${(pumpData?.stats?.zkSwapVolumeUSD || 0).toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Platform trading volume
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover-elevate" data-testid="card-hero-platform-volume">
                    <CardContent className="p-4">
                      <div className="text-xs text-muted-foreground mb-1">DEX Volume</div>
                      <div className="text-lg font-bold gradient-text">
                        ${((pumpData?.stats?.dexVolumeUSD || 0) / 1000).toFixed(1)}k
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        External DEX trading
                      </div>
                    </CardContent>
                  </Card>

                  <Link href="/revenue">
                    <Card className="hover-elevate cursor-pointer bg-emerald-500/10 border-emerald-500/50" data-testid="card-hero-check-eligibility">
                      <CardContent className="p-4 flex flex-col items-center justify-center h-full">
                        <Wallet className="w-5 h-5 text-emerald-500 mb-1" />
                        <div className="text-xs font-semibold text-emerald-400">Check Eligibility</div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              )}
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="gradient-text">ZEKTA Token</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Token holders receive automated revenue distributions from zero-knowledge protocol fees and decentralized exchange trading volume.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <a 
                href="https://pump.fun/coin/CA6DpicXuJUsSWziuV4oHmqpHTSMZLz9EGjYPyXJpump"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="text-lg px-8 py-6 group" data-testid="button-buy-zekta">
                  Buy ZEKTA
                  <ExternalLink className="ml-2 w-5 h-5" />
                </Button>
              </a>
              <a 
                href="https://lock.jup.ag/escrow/4YAcMZCs3n42KDxFeGDYhdyFWuz7G8iKrQfyG6WSyJ3r"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 group" data-testid="button-view-vesting">
                  View Vesting Contract
                  <ExternalLink className="ml-2 w-5 h-5" />
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Revenue Estimates Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-emerald-500/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Revenue Breakdown</h2>
              <p className="text-muted-foreground">Real-time protocol revenue and distribution metrics</p>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-10 w-24 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <Card className="hover-elevate" data-testid="card-current-pool">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Wallet className="w-5 h-5 text-blue-500" />
                      Current Pool
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold gradient-text">
                      ${pumpData?.stats?.currentPoolUSD?.toFixed(2) || '0.00'}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      DEX trading 0.2 percent plus ZK swaps 0.4 percent
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover-elevate border-purple-500/30 bg-purple-500/5" data-testid="card-zk-swap-revenue">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BarChart3 className="w-5 h-5 text-purple-500" />
                      ZK Swap Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold gradient-text">
                      ${pumpData?.stats?.zkSwapRevenueUSD?.toFixed(2) || '0.00'}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      0.4 percent protocol fee on platform swaps
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover-elevate border-emerald-500/30 bg-emerald-500/5" data-testid="card-cumulative-distributions">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <DollarSign className="w-5 h-5 text-emerald-500" />
                      Total Distributed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold gradient-text">
                      ${pumpData?.stats?.cumulativeDistributedUSD?.toFixed(2) || '0.00'}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      All-time distributions to token holders
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Active Volume & Revenue */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-purple-500/5 to-cyan-500/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Active Trading Volume</h2>
              <p className="text-muted-foreground">Real-time platform activity and revenue generation</p>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {[...Array(2)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-10 w-24 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <Card className="hover-elevate border-blue-500/30 bg-blue-500/5" data-testid="card-active-volume">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Activity className="w-5 h-5 text-blue-500" />
                      Total Volume
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold gradient-text">
                      ${((pumpData?.stats?.dexVolumeUSD || 0) + (pumpData?.stats?.zkSwapVolumeUSD || 0)).toFixed(2)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Combined DEX and ZK Swap trading volume
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover-elevate border-emerald-500/30 bg-emerald-500/5" data-testid="card-active-revenue">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <TrendingUp className="w-5 h-5 text-emerald-500" />
                      Total Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold gradient-text">
                      ${((pumpData?.stats?.dexRevenueUSD || 0) + (pumpData?.stats?.zkSwapRevenueUSD || 0)).toFixed(2)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Combined DEX fees and platform swap revenue
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Token Metrics Overview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-border/40">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover-elevate" data-testid="card-swap-fee">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-500" />
                  Platform Fee
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold gradient-text">0.4 percent</div>
                <p className="text-muted-foreground mt-2">On every crypto swap</p>
              </CardContent>
            </Card>

            <Card className="hover-elevate" data-testid="card-vesting-period">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  Vesting Period
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold gradient-text">12 Months</div>
                <p className="text-muted-foreground mt-2">Team tokens locked</p>
              </CardContent>
            </Card>

            <Card className="hover-elevate" data-testid="card-holder-rewards">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                  Holder Rewards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold gradient-text">60 to 70 percent</div>
                <p className="text-muted-foreground mt-2">Revenue share</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Revenue Model */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Zero-Knowledge Protocol Revenue Model</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Every anonymous swap executed through our ZK-proof infrastructure generates protocol fees automatically distributed to token holders and ecosystem sustainability.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card data-testid="card-swap-fees">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coins className="w-6 h-6 text-emerald-500" />
                    ZK Protocol Fee Distribution
                  </CardTitle>
                  <CardDescription>
                    Anonymous swaps processed through our zero-knowledge infrastructure incur a 0.4 percent protocol fee automatically redistributed to the ecosystem
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Token Holders</span>
                        <span className="text-sm text-emerald-500">60 percent</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Treasury and Development</span>
                        <span className="text-sm text-blue-500">25 percent</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Liquidity Pool</span>
                        <span className="text-sm text-purple-500">15 percent</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-revenue-chart">
                <CardHeader>
                  <CardTitle>Revenue Share Comparison</CardTitle>
                  <CardDescription>Distribution across different revenue streams</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={revenueFlow}>
                      <XAxis dataKey="source" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                      <Bar dataKey="holders" fill="#10B981" name="Holders percent" />
                      <Bar dataKey="treasury" fill="#3B82F6" name="Treasury percent" />
                      <Bar dataKey="liquidity" fill="#8B5CF6" name="Liquidity percent" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* API Program */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-y border-border/40">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Developer API Program</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Build on Zekta swap infrastructure and share in the revenue. Developers who integrate our API earn a portion of platform fees from swaps they facilitate.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="hover-elevate" data-testid="card-api-benefits">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-6 h-6 text-emerald-500" />
                    API Integration Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-2 rounded-lg bg-emerald-500/20">
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Revenue Sharing</h4>
                        <p className="text-sm text-muted-foreground">
                          Earn a percentage of platform fees from every cryptocurrency swap your integration processes
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-2 rounded-lg bg-blue-500/20">
                        <Users className="w-4 h-4 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Growing Ecosystem</h4>
                        <p className="text-sm text-muted-foreground">
                          Access to our expanding network of privacy focused users and applications
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-2 rounded-lg bg-purple-500/20">
                        <Lock className="w-4 h-4 text-purple-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Privacy First</h4>
                        <p className="text-sm text-muted-foreground">
                          Built in zero knowledge infrastructure for anonymous transaction processing
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-elevate" data-testid="card-api-revenue">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-emerald-500" />
                    API Revenue Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Token Holders</span>
                        <span className="text-sm text-emerald-500">70 percent</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        API revenue provides even higher returns to token holders
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Treasury and Development</span>
                        <span className="text-sm text-blue-500">20 percent</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Liquidity Pool</span>
                        <span className="text-sm text-purple-500">10 percent</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 text-center">
              <Link href="/docs">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6" data-testid="button-api-docs">
                  <Code className="mr-2 w-5 h-5" />
                  View API Documentation
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vesting & Lock Details */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Team Tokens Locked and Vested</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Transparency first. All developer tokens are officially locked and vested for 12 months to ensure long-term alignment and commitment to protocol growth.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="hover-elevate" data-testid="card-vesting-details">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-6 h-6 text-emerald-500" />
                    Vesting Contract Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-secondary/50">
                      <div className="text-sm text-muted-foreground mb-1">Contract Address</div>
                      <div className="font-mono text-sm break-all">
                        4YAcMZCs3n42KDxFeGDYhdyFWuz7G8iKrQfyG6WSyJ3r
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-secondary/50">
                        <div className="text-sm text-muted-foreground mb-1">Duration</div>
                        <div className="text-2xl font-bold gradient-text">12 Months</div>
                      </div>
                      <div className="p-4 rounded-lg bg-secondary/50">
                        <div className="text-sm text-muted-foreground mb-1">Network</div>
                        <div className="text-2xl font-bold gradient-text">Solana</div>
                      </div>
                    </div>
                    <a 
                      href="https://lock.jup.ag/escrow/4YAcMZCs3n42KDxFeGDYhdyFWuz7G8iKrQfyG6WSyJ3r"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full"
                    >
                      <Button className="w-full" variant="outline" data-testid="button-verify-lock">
                        Verify on Jupiter Lock
                        <ExternalLink className="ml-2 w-4 h-4" />
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-elevate" data-testid="card-vesting-timeline">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-6 h-6 text-emerald-500" />
                    Vesting Timeline
                  </CardTitle>
                  <CardDescription>Progressive unlock schedule over 12 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={vestingTimeline}>
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} unit=" percent" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Bar dataKey="amount" fill="#10B981" name="Unlocked percent" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 p-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <Lock className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Built to Last</h3>
                  <p className="text-muted-foreground">
                    Zekta is built to last with privacy, performance, and proof based trust at its core. Our vesting schedule ensures the team is committed to long term success and aligned with community interests.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Token Distribution */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border/40">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Token Distribution</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Fair and balanced allocation designed to support ecosystem growth and community participation.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <Card data-testid="card-distribution-chart">
                <CardHeader>
                  <CardTitle>Allocation Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <ResponsiveContainer width="100%" height={280}>
                    <RePieChart>
                      <Pie
                        data={tokenDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={false}
                        outerRadius={90}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {tokenDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                        formatter={(value: any) => `${value} percent`}
                      />
                    </RePieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="space-y-4" data-testid="distribution-details">
                {tokenDistribution.map((item, index) => (
                  <Card key={index} className="hover-elevate">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div 
                            className="w-4 h-4 rounded-full mt-1 flex-shrink-0" 
                            style={{ backgroundColor: item.color }}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold">{item.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {item.name === 'Community and Ecosystem' && 'Airdrops, rewards, and ecosystem grants'}
                              {item.name === 'Development Team' && 'Locked for 12 months with linear vesting'}
                              {item.name === 'Treasury and Operations' && 'Protocol development and operations'}
                              {item.name === 'Liquidity Pool' && 'DEX liquidity and market making'}
                            </div>
                          </div>
                        </div>
                        <div className="text-xl md:text-2xl font-bold flex-shrink-0" style={{ color: item.color }}>
                          {item.value} percent
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-5xl font-bold">
              Join the Privacy Revolution
            </h2>
            <p className="text-xl text-muted-foreground">
              Hold ZEKTA tokens and earn from every transaction in the ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/mvp">
                <Button size="lg" className="text-lg px-8 py-6" data-testid="button-start-swapping">
                  Start Swapping
                </Button>
              </Link>
              <Link href="/docs">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6" data-testid="button-learn-more">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
