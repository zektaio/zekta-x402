import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Search, AlertCircle, CheckCircle2, ExternalLink, TrendingUp, Award, Medal, Trophy, Gem, Crown, Rocket, Flame, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { InlineCountdown } from '@/components/InlineCountdown';
import type { LucideIcon } from 'lucide-react';

interface TierInfo {
  tier: string;
  label: string;
  icon: string;
}

interface TierBreakdown {
  tier: string;
  label: string;
  icon: string;
  holderCount: number;
  totalTokens: number;
  percentageOfSupply: number;
}

interface RevshareEstimate {
  ok: boolean;
  eligible: boolean;
  holdings: number;
  percentage: number;
  tier?: TierInfo;
  estimatedReward: number;
  poolSize: number;
  totalEligibleHolders: number;
  totalEligibleAmount: number;
  tierBreakdown?: TierBreakdown[];
  userShare: number;
  nextClaimTime: number | null;
  minRequired?: number;
}

const TIER_ICON_MAP: Record<string, LucideIcon> = {
  'Medal': Medal,
  'Award': Award,
  'Trophy': Trophy,
  'Gem': Gem,
  'Crown': Crown,
  'Rocket': Rocket,
  'Flame': Flame,
  'Zap': Zap
};

function getTierIcon(iconName: string): LucideIcon {
  return TIER_ICON_MAP[iconName] || Medal;
}

export default function Revenue() {
  const [walletAddress, setWalletAddress] = useState('');
  const [checkingWallet, setCheckingWallet] = useState('');
  const [revshareData, setRevshareData] = useState<RevshareEstimate | null>(null);

  // Load saved eligibility data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('zekta_eligibility_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Only restore if countdown is still in the future
        if (parsed.nextClaimTime && parsed.nextClaimTime > Date.now()) {
          setRevshareData(parsed);
          setCheckingWallet(parsed.walletAddress || 'saved');
        } else {
          // Clear expired data
          localStorage.removeItem('zekta_eligibility_data');
        }
      } catch (e) {
        localStorage.removeItem('zekta_eligibility_data');
      }
    }
  }, []);

  const { data: pumpData, refetch: refetchPumpData } = useQuery<{
    ok: boolean;
    stats: {
      currentPoolUSD: number;
      cumulativeDistributedUSD: number;
      lastUpdated: string;
    };
  }>({
    queryKey: ['/api/stats/pumpfun'],
    refetchInterval: 60000,
  });

  const { data: walletData } = useQuery<{
    ok: boolean;
    balance: {
      address: string;
      balanceSOL: number;
      balanceUSD: number;
      lastUpdated: number;
    };
  }>({
    queryKey: ['/api/wallet/balance'],
    refetchInterval: 300000, // 5 minutes
  });

  const handleCheckWallet = async () => {
    if (!walletAddress || walletAddress.length < 32) {
      return;
    }
    
    setCheckingWallet(walletAddress);
    setRevshareData(null);
    
    // Set 7-day countdown from now
    const sevenDaysFromNow = Date.now() + (7 * 24 * 60 * 60 * 1000);
    
    try {
      const response = await fetch(`/api/revshare/estimate/${walletAddress}`);
      const data = await response.json();
      
      if (data.ok && data.eligible) {
        // Save full data with 7-day countdown to localStorage
        const dataWithCountdown = {
          ...data,
          nextClaimTime: sevenDaysFromNow,
          walletAddress: walletAddress
        };
        setRevshareData(dataWithCountdown);
        localStorage.setItem('zekta_eligibility_data', JSON.stringify(dataWithCountdown));
      } else {
        // Not eligible - clear localStorage and show not eligible message
        localStorage.removeItem('zekta_eligibility_data');
        setRevshareData({
          ok: false,
          eligible: false,
          holdings: data.holdings || 0,
          percentage: data.percentage || 0,
          estimatedReward: 0,
          poolSize: 0,
          totalEligibleHolders: 0,
          totalEligibleAmount: 0,
          userShare: 0,
          nextClaimTime: null,
          minRequired: data.minRequired
        });
      }
    } catch (error) {
      console.error("Error checking wallet:", error);
      localStorage.removeItem('zekta_eligibility_data');
      setRevshareData({
        ok: false,
        eligible: false,
        holdings: 0,
        percentage: 0,
        estimatedReward: 0,
        poolSize: 0,
        totalEligibleHolders: 0,
        totalEligibleAmount: 0,
        userShare: 0,
        nextClaimTime: null
      });
    }
  };

  const formatWalletShort = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const getTierColor = (tierLabel: string) => {
    const colors: Record<string, string> = {
      'Bronze': 'bg-orange-500/20 text-orange-400 border-orange-500/50',
      'Silver': 'bg-gray-400/20 text-gray-300 border-gray-400/50',
      'Gold': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      'Diamond': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50',
      'Elite': 'bg-purple-500/20 text-purple-400 border-purple-500/50',
      'Legend': 'bg-red-500/20 text-red-400 border-red-500/50',
      'Master': 'bg-orange-600/20 text-orange-500 border-orange-600/50',
      'Whale': 'bg-blue-500/20 text-blue-400 border-blue-500/50'
    };
    return colors[tierLabel] || 'bg-gray-500/20 text-gray-400 border-gray-500/50';
  };

  return (
    <div className="relative min-h-screen">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6 mb-12"
          >
            <Badge className="px-6 py-2 text-base bg-purple-500/20 text-purple-400 border-purple-500/50">
              <TrendingUp className="w-4 h-4 mr-2 flex-shrink-0" />
              Protocol Revenue Distribution
            </Badge>

            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              <span className="gradient-text">Revenue Eligibility</span>
            </h1>

            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Verify wallet eligibility for ZEKTA revenue distributions
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                  Wallet Eligibility Checker
                </CardTitle>
                <CardDescription className="text-sm">
                  All holders with 1+ ZEKTA tokens are eligible. Higher tier holders earn more rewards because they hold more tokens. Pure proportional distribution.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    placeholder="Enter your Solana wallet address"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="flex-1"
                    data-testid="input-wallet-address"
                  />
                  <Button 
                    onClick={handleCheckWallet}
                    disabled={!walletAddress || walletAddress.length < 32}
                    data-testid="button-check-wallet"
                  >
                    <Search className="w-4 h-4 mr-2 flex-shrink-0" />
                    Check Wallet
                  </Button>
                </div>

                {checkingWallet && revshareData && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {revshareData.eligible ? (
                      <Alert className="bg-emerald-500/10 border-emerald-500/50" data-testid="alert-eligible">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                        <AlertDescription className="ml-2">
                          <div className="space-y-4">
                            <div>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                <p className="font-semibold text-emerald-400 text-sm md:text-base">
                                  Wallet {formatWalletShort(checkingWallet)} is eligible
                                </p>
                                {revshareData.tier && (() => {
                                  const TierIcon = getTierIcon(revshareData.tier.icon);
                                  return (
                                    <Badge className={getTierColor(revshareData.tier.label)}>
                                      <TierIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                                      {revshareData.tier.label} Tier
                                    </Badge>
                                  );
                                })()}
                              </div>
                              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                                Your holdings: {revshareData.holdings.toLocaleString()} ZEKTA ({revshareData.percentage.toFixed(2)} percent of supply)
                              </p>
                            </div>

                            <div className="bg-card/50 rounded-lg p-4 space-y-3 border border-emerald-500/20">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Next Distribution</span>
                                <InlineCountdown targetTime={revshareData.nextClaimTime} />
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Distribution Pool</span>
                                <span className="font-mono font-semibold text-emerald-400">
                                  ${revshareData.poolSize.toFixed(2)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Your Share</span>
                                <span className="font-mono font-semibold text-emerald-400">
                                  {revshareData.userShare.toFixed(4)} percent
                                </span>
                              </div>
                              <div className="pt-3 border-t border-emerald-500/20">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-semibold">Estimated Reward</span>
                                  <span className="font-mono text-lg font-bold text-emerald-400">
                                    ${revshareData.estimatedReward.toFixed(2)}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Based on {revshareData.totalEligibleHolders} eligible holders with {revshareData.totalEligibleAmount.toLocaleString()} total ZEKTA
                                </p>
                              </div>
                            </div>

                            {revshareData.tierBreakdown && revshareData.tierBreakdown.length > 0 && (
                              <div className="bg-card/30 rounded-lg p-4 border border-emerald-500/10">
                                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                  <Award className="w-4 h-4 flex-shrink-0" />
                                  Tier Distribution
                                </h4>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                  {revshareData.tierBreakdown.filter(t => t.holderCount > 0).map(tier => {
                                    const TierIcon = getTierIcon(tier.icon);
                                    return (
                                      <div key={tier.tier} className="text-center p-2 bg-card/50 rounded border border-border/50">
                                        <div className="flex justify-center">
                                          <TierIcon className="w-6 h-6" />
                                        </div>
                                        <div className="text-xs font-semibold mt-1">{tier.label}</div>
                                        <div className="text-xs text-muted-foreground">{tier.holderCount} holders</div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-2">
                              <a 
                                href="https://pump.fun/coin/CA6DpicXuJUsSWziuV4oHmqpHTSMZLz9EGjYPyXJpump"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1"
                              >
                                <Button size="sm" variant="outline" className="text-xs md:text-sm w-full">
                                  Buy ZEKTA
                                  <ExternalLink className="ml-2 w-3 h-3 flex-shrink-0" />
                                </Button>
                              </a>
                              <a 
                                href={`https://solscan.io/account/${checkingWallet}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1"
                              >
                                <Button size="sm" variant="outline" className="text-xs md:text-sm w-full">
                                  View on Solscan
                                  <ExternalLink className="ml-2 w-3 h-3 flex-shrink-0" />
                                </Button>
                              </a>
                            </div>
                          </div>
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Alert className="bg-red-500/10 border-red-500/50" data-testid="alert-not-eligible">
                        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                        <AlertDescription className="ml-2">
                          <div className="space-y-2">
                            <p className="font-semibold text-red-400 text-sm md:text-base">
                              Not eligible
                            </p>
                            <p className="text-xs md:text-sm text-muted-foreground">
                              {revshareData.holdings > 0 
                                ? `Your holdings: ${revshareData.holdings.toLocaleString()} ZEKTA (${revshareData.percentage.toFixed(2)} percent). Minimum required: ${(revshareData.minRequired || 1).toLocaleString()} ZEKTA`
                                : 'Wallet does not hold any ZEKTA tokens. Minimum 1 token required for revenue distribution.'}
                            </p>
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}
                  </motion.div>
                )}

                <div className="pt-6 border-t border-border">
                  <h3 className="font-semibold mb-4">Real-Time Revenue Analytics</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card className="bg-emerald-500/5 border-emerald-500/30">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Distribution Pool</p>
                          <p className="text-2xl font-bold gradient-text">
                            ${pumpData?.stats?.currentPoolUSD?.toFixed(2) || '0.00'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Distributed proportionally to all holders (minimum 1 token)
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-purple-500/5 border-purple-500/30">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Total Distributed Revenue</p>
                          <p className="text-2xl font-bold gradient-text">
                            ${pumpData?.stats?.cumulativeDistributedUSD?.toFixed(2) || '0.00'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Total rewards already distributed to holders
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Distribution Pool accumulates protocol revenue continuously until distribution occurs. When actual distribution happens from REVSHARE_PRIVATE wallet, the pool amount is sent to eligible holders proportionally based on their holdings, Distribution Pool resets to zero, and Total Distributed Revenue increases by the distributed amount. All holders with 1 or more tokens are eligible.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 text-center">
              <Link href="/token">
                <Button variant="outline" data-testid="button-back-tokenomics">
                  Back to Tokenomics
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
