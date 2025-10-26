import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp, Users, DollarSign, Clock, CheckCircle2 } from 'lucide-react';
import { Link } from 'wouter';

export default function RevenueShareTestCompleted() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/">
          <Button variant="ghost" className="mb-8" data-testid="button-back-home">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <article className="space-y-8">
          <header className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <time dateTime="2025-10-18">October 18, 2025</time>
              <span className="mx-2">•</span>
              <span>5 min read</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold gradient-text leading-tight">
              Revenue Share Test Successfully Completed
            </h1>
            
            <p className="text-xl text-muted-foreground">
              Over $1,400 distributed to 22 eligible ZEKTA holders in our first revenue sharing milestone
            </p>
          </header>

          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <DollarSign className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold" data-testid="text-total-distributed">$1,426.48</div>
                <div className="text-sm text-muted-foreground">Total Distributed</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold" data-testid="text-eligible-holders">22</div>
                <div className="text-sm text-muted-foreground">Eligible Holders</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold" data-testid="text-supply-coverage">35.1%</div>
                <div className="text-sm text-muted-foreground">Supply Coverage</div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-2">Thank You for Your Participation</h3>
                  <p className="text-sm text-muted-foreground">
                    We are excited to share that our first revenue distribution test has been successfully completed. 
                    This milestone marks an important step toward building a sustainable revenue sharing model for the ZEKTA community.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold">How Revenue Sharing Works</h2>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                ZEKTA implements a transparent revenue sharing model that rewards long-term holders. 
                Here is how the system operates:
              </p>
            </div>

            <Card>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Revenue Collection Sources</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        ZEKTA protocol collects revenue from two primary sources, creating a sustainable revenue stream for holders:
                      </p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span><strong>Trading Fees Revenue:</strong> 0.2% of ZEKTA trading volume across all DEX pairs (PumpSwap, Meteora, PumpFun) tracked via Dexscreener API</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span><strong>ZK Platform Revenue:</strong> 0.4% protocol fee from all ZEKTA zero-knowledge swaps executed through our dApp and Telegram bot</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="h-px bg-border" />

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Revenue Calculation</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Total protocol revenue is calculated automatically from both sources and accumulates continuously without automatic resets:
                      </p>
                      <div className="space-y-2">
                        <div className="p-3 bg-muted rounded-lg font-mono text-xs">
                          Trading Fees = DEX Volume 24h × 0.002
                        </div>
                        <div className="p-3 bg-muted rounded-lg font-mono text-xs">
                          ZK Platform Fees = ZEKTA Swap Volume × 0.004
                        </div>
                        <div className="p-3 bg-primary/10 rounded-lg font-mono text-xs font-semibold">
                          Total Revenue = Trading Fees + ZK Platform Fees
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-border" />

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Eligibility Requirements</h4>
                      <p className="text-sm text-muted-foreground">
                        To qualify for revenue sharing, wallets must hold at least 1% of total ZEKTA supply 
                        (10,000,000 ZEKTA tokens). This ensures distributions benefit committed long-term holders.
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-border" />

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Proportional Distribution</h4>
                      <p className="text-sm text-muted-foreground">
                        The distribution pool is divided proportionally among eligible holders based on their 
                        percentage of total eligible supply.
                      </p>
                      <div className="mt-2 p-3 bg-muted rounded-lg font-mono text-xs">
                        Your Reward = Pool Size × (Your Holdings / Total Eligible Supply)
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold">Distribution Flow</h2>
            
            <Card>
              <CardContent className="p-8">
                <div className="relative">
                  <div className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="w-32 text-right font-semibold text-sm">Revenue Sources</div>
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center border-2 border-primary/30">
                        <TrendingUp className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-muted-foreground font-semibold mb-1">Dual Revenue Streams</div>
                        <div className="text-xs text-muted-foreground">DEX Trading (0.2%): PumpSwap + Meteora + PumpFun</div>
                        <div className="text-xs text-muted-foreground mt-0.5">ZK Swaps (0.4%): dApp + Telegram Bot</div>
                      </div>
                    </div>

                    <div className="pl-32 ml-6">
                      <div className="h-12 border-l-2 border-primary/30 border-dashed" />
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-32 text-right font-semibold text-sm">Creator Wallet</div>
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center border-2 border-primary/30">
                        <DollarSign className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-muted-foreground">All protocol fees accumulated</div>
                        <div className="text-xs text-muted-foreground mt-1 font-mono break-all">
                          EqviQin8eBKfTxRq6iAiNUufnUEMRHR3SJ9NZcjBxKdm
                        </div>
                      </div>
                    </div>

                    <div className="pl-32 ml-6">
                      <div className="h-12 border-l-2 border-primary/30 border-dashed" />
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-32 text-right font-semibold text-sm">Distribution Pool</div>
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center border-2 border-primary/30">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-muted-foreground">Funds transferred to distributor wallet</div>
                        <div className="text-xs text-muted-foreground mt-1 font-mono break-all">
                          HGqcFDAhXc6zdVgoag88oVQdtbYL5GWUATcnbLEzTKrg
                        </div>
                      </div>
                    </div>

                    <div className="pl-32 ml-6">
                      <div className="h-12 border-l-2 border-primary/30 border-dashed" />
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-32 text-right font-semibold text-sm">Eligible Holders</div>
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center border-2 border-primary/30">
                        <CheckCircle2 className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-muted-foreground">Automatic proportional distribution</div>
                        <div className="text-xs text-muted-foreground mt-1">22 wallets holding ≥1% supply</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold">Current Implementation</h2>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                This revenue sharing test operates in a semi-automated centralized model. Here is the current workflow:
              </p>
            </div>

            <Card className="border-amber-500/20 bg-amber-500/5">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-2">Semi-Automated Distribution</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 mt-1">•</span>
                        <span>Team manually transfers creator rewards from token creator wallet to distributor wallet</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 mt-1">•</span>
                        <span>System automatically fetches all eligible holders via Helius DAS API</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 mt-1">•</span>
                        <span>Proportional calculations are computed automatically based on on-chain holdings</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 mt-1">•</span>
                        <span>Distribution is executed automatically via blockchain transactions to all eligible wallets</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold">Future Roadmap</h2>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                We are committed to evolving this system into a fully decentralized and automated solution. 
                Here is what we are working on:
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                      Q1
                    </div>
                    Smart Contract Integration
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Implement on-chain smart contracts to automatically collect and distribute revenue without 
                    manual intervention. All distributions will be verifiable on-chain.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                      Q2
                    </div>
                    Scheduled Automation
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Deploy automated distribution schedules (weekly/monthly) triggered by on-chain events, 
                    eliminating the need for manual execution.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                      Q3
                    </div>
                    Governance Integration
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Allow token holders to vote on distribution parameters such as eligibility thresholds 
                    and distribution frequency through decentralized governance.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                      Q4
                    </div>
                    Multi-Chain Expansion
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Extend revenue sharing to support multiple blockchain networks, enabling cross-chain 
                    distributions for a truly decentralized ecosystem.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <Card className="border-primary/30 bg-primary/10">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-3">Thank You</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                This successful test demonstrates our commitment to building a sustainable and transparent 
                revenue sharing model. We appreciate the trust and support of our community as we continue 
                to innovate and improve the ZEKTA ecosystem.
              </p>
              <div className="mt-6">
                <Link href="/revenue">
                  <Button size="lg" data-testid="button-check-eligibility">
                    Check Your Eligibility
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </article>
      </div>
    </div>
  );
}
