import { Link } from "wouter";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function RevenueSystemMigration() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* White Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
        <div className="container flex h-14 items-center justify-between px-3">
          <Link href="/" className="flex items-center" data-testid="link-home">
            <Logo size="md" />
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">Home</Link>
            <Link href="/docs" className="text-sm font-medium text-gray-600 hover:text-gray-900">Docs</Link>
            <Link href="/mvp" className="text-sm font-medium text-gray-600 hover:text-gray-900">Launch MVP</Link>
            <Link href="/bugs" className="text-sm font-medium text-gray-600 hover:text-gray-900">Bug Reports</Link>
            <Link href="/zekta-update">
              <Button size="sm" variant="default" className="gap-2" data-testid="button-project-update">
                <Sparkles className="h-4 w-4" />
                Project Update
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1">
        <div className="container max-w-3xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900" data-testid="text-page-title">
              Revenue Distribution Complete & System Migration
            </h1>
            <p className="text-base text-gray-600" data-testid="text-page-subtitle">
              First major distribution: $4,436 to 708 holders + switching to fair time-weighted rewards
            </p>
          </div>

          {/* TL;DR */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-lg font-bold mb-3 text-gray-900" data-testid="text-tldr-title">TL;DR</h2>
            <div className="space-y-1.5 text-sm text-gray-700">
              <p><strong>1.</strong> Distributed $4,436 USD (22.88 SOL) to 708 token holders on Oct 25, 2025</p>
              <p><strong>2.</strong> Old system was unfair: 7-day holder = 10-minute holder (snapshot-based)</p>
              <p><strong>3.</strong> New system: Real-time 10-minute tracking rewards loyalty (1,008x more for 7-day holder)</p>
            </div>
          </div>

          {/* Distribution Recap */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-lg font-bold mb-3 text-gray-900">Distribution Recap</h2>
            <p className="text-sm text-gray-700 mb-4">
              On October 25, 2025, we executed our main revenue distribution. This follows our initial test distribution on October 18, 2025.
            </p>

            {/* Distribution Comparison Table */}
            <div className="overflow-x-auto mb-4">
              <table className="w-full border border-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-200 px-4 py-2 text-left text-gray-900 font-bold">Distribution</th>
                    <th className="border border-gray-200 px-4 py-2 text-left text-gray-900 font-bold">Date</th>
                    <th className="border border-gray-200 px-4 py-2 text-right text-gray-900 font-bold">Amount (USD)</th>
                    <th className="border border-gray-200 px-4 py-2 text-right text-gray-900 font-bold">Holders</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr>
                    <td className="border border-gray-200 px-4 py-2">Test Distribution</td>
                    <td className="border border-gray-200 px-4 py-2">Oct 18, 2025</td>
                    <td className="border border-gray-200 px-4 py-2 text-right font-mono">$1,426.48</td>
                    <td className="border border-gray-200 px-4 py-2 text-right">22</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2">Main Distribution</td>
                    <td className="border border-gray-200 px-4 py-2">Oct 25, 2025</td>
                    <td className="border border-gray-200 px-4 py-2 text-right font-mono">$4,436.93</td>
                    <td className="border border-gray-200 px-4 py-2 text-right">708</td>
                  </tr>
                  <tr className="bg-gray-50 font-bold">
                    <td className="border border-gray-200 px-4 py-2 text-gray-900">Total</td>
                    <td className="border border-gray-200 px-4 py-2"></td>
                    <td className="border border-gray-200 px-4 py-2 text-right font-mono text-gray-900">$5,863.41</td>
                    <td className="border border-gray-200 px-4 py-2 text-right text-gray-900">730</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-sm text-gray-700 mb-3">
              <strong>Main Distribution Details:</strong>
            </p>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• <strong>Distribution Amount:</strong> 22.88 SOL (converted at real-time CoinGecko price: $193.92/SOL)</li>
              <li>• <strong>Eligibility:</strong> ≥1 token minimum (708 holders qualified)</li>
              <li>• <strong>Distribution Wallet:</strong> <code className="px-1.5 py-0.5 bg-gray-100 rounded font-mono text-xs">HGqcFDAhXc6zdVgoag88oVQdtbYL5GWUATcnbLEzTKrg</code></li>
            </ul>
            <p className="text-sm text-gray-700 mt-3">
              All distributions were executed on-chain via Solana network. Holders can verify receipts directly in their wallets or via Solscan block explorer.
            </p>
          </div>

          {/* The Problem with the Old System */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-lg font-bold mb-3 text-gray-900">The Problem with the Old System</h2>
            <p className="text-sm text-gray-700 mb-2">
              Our previous system used periodic snapshots (e.g., weekly) to determine reward allocation. This created a critical fairness issue.
            </p>
            <p className="text-sm text-gray-900 font-semibold mb-3">
              Here's the problem:
            </p>
            <ul className="space-y-1 text-sm text-gray-700 mb-3">
              <li>• <strong>Holder A:</strong> Purchased 1,000,000 ZEKTA tokens 7 days ago and held continuously</li>
              <li>• <strong>Holder B:</strong> Purchased 1,000,000 ZEKTA tokens 10 minutes before distribution snapshot</li>
            </ul>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Result:</strong> Both holders received <strong>identical rewards</strong> despite drastically different holding durations.
            </p>
            <p className="text-sm text-gray-700">
              This snapshot-based approach failed to reward loyalty. Early supporters and long-term holders were not compensated for their commitment, 
              while opportunistic buyers could "snipe" distributions by timing purchases immediately before snapshots.
            </p>
          </div>

          {/* Old vs New System */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-lg font-bold mb-4 text-gray-900">Old System vs New System</h2>
            
            <div className="space-y-4">
              {/* OLD SYSTEM */}
              <div className="pl-3 border-l-4 border-gray-300">
                <h3 className="font-bold text-sm text-gray-900 mb-2">OLD SYSTEM (Snapshot-Based)</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Weekly or periodic snapshots</li>
                  <li>• 7-day holder = 10-minute holder (same rewards)</li>
                  <li>• Loyalty not rewarded</li>
                  <li>• Enables "distribution sniping"</li>
                </ul>
              </div>

              {/* NEW SYSTEM */}
              <div className="pl-3 border-l-4 border-gray-900">
                <h3 className="font-bold text-sm text-gray-900 mb-2">NEW SYSTEM (Real-Time 10-Minute Accumulation)</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• <strong>Continuous tracking every 10 minutes</strong></li>
                  <li>• <strong>7-day holder gets 1,008x more rewards</strong> (1,008 cycles vs 1 cycle)</li>
                  <li>• <strong>Loyalty rewarded proportionally</strong></li>
                  <li>• <strong>Fair time-weighted distribution</strong></li>
                </ul>
              </div>
            </div>
          </div>

          {/* How the New System Works */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-lg font-bold mb-4 text-gray-900">
              How the New System Works
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs">1</div>
                <div>
                  <h4 className="font-bold text-sm mb-1 text-gray-900">Continuous Tracking</h4>
                  <p className="text-sm text-gray-700">
                    Every 10 minutes, the system records each holder's token balance via Helius DAS API
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs">2</div>
                <div>
                  <h4 className="font-bold text-sm mb-1 text-gray-900">Accumulation Points</h4>
                  <p className="text-sm text-gray-700">
                    Holders accumulate "balance-time" units every cycle. For example: holding 1M tokens for one 10-minute cycle = 1M points
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs">3</div>
                <div>
                  <h4 className="font-bold text-sm mb-1 text-gray-900">Proportional Distribution</h4>
                  <p className="text-sm text-gray-700">
                    When revenue is distributed, each holder's share is calculated based on total accumulated points
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs">✓</div>
                <div>
                  <h4 className="font-bold text-sm mb-1 text-gray-900">Fair Rewards</h4>
                  <p className="text-sm text-gray-700">
                    Long-term holders receive proportionally more rewards based on their actual commitment
                  </p>
                </div>
              </div>
            </div>

            {/* Example Calculation */}
            <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded">
              <p className="text-xs text-gray-600 mb-2 font-mono">Example Calculation:</p>
              <pre className="text-xs overflow-x-auto text-gray-800 font-mono">
                <code>{`Holder A: 1M tokens × 1,008 cycles (7 days) = 1,008,000,000 points
Holder B: 1M tokens × 1 cycle (10 min)   = 1,000,000 points

Result: Holder A receives 1,008x more rewards
(accurately reflects 1,008x longer commitment)`}</code>
              </pre>
            </div>
          </div>

          {/* Technical Implementation */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-lg font-bold mb-3 text-gray-900">
              Technical Implementation
            </h2>
            
            <p className="text-sm text-gray-700 mb-4">
              The new system required several key architecture changes:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-3 border border-gray-200 rounded">
                <h4 className="font-bold mb-2 text-sm text-gray-900">Price Oracle</h4>
                <ul className="text-gray-700 space-y-1 text-xs">
                  <li>• CoinGecko API integration</li>
                  <li>• Real-time SOL/USD conversion</li>
                  <li>• Replaces static pricing</li>
                  <li>• Used at distribution time</li>
                </ul>
              </div>

              <div className="p-3 border border-gray-200 rounded">
                <h4 className="font-bold mb-2 text-sm text-gray-900">Holder Tracking</h4>
                <ul className="text-gray-700 space-y-1 text-xs">
                  <li>• Helius DAS API queries</li>
                  <li>• Every 10-minute snapshots</li>
                  <li>• PostgreSQL storage</li>
                  <li>• Balance-time accumulation</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded">
              <p className="text-xs text-gray-700">
                <strong className="text-gray-900">Note:</strong> The 10-minute cycle interval balances precision with computational efficiency. 
                More frequent snapshots would increase accuracy marginally but impose higher infrastructure costs.
              </p>
            </div>
          </div>

          {/* Migration Timeline */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-lg font-bold mb-3 text-gray-900">Migration Timeline</h2>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-bold text-sm mb-1 text-gray-900">October 25, 2025</h4>
                <p className="text-sm text-gray-700">
                  Final snapshot-based distribution executed ($4,436 USD / 22.88 SOL to 708 holders)
                </p>
              </div>

              <div>
                <h4 className="font-bold text-sm mb-1 text-gray-900">October 26, 2025</h4>
                <p className="text-sm text-gray-700">
                  New 10-minute accumulation system activated
                </p>
              </div>

              <div>
                <h4 className="font-bold text-sm mb-1 text-gray-900">Ongoing</h4>
                <p className="text-sm text-gray-700">
                  All future distributions will use time-weighted accumulation model
                </p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-lg font-bold mb-3 text-gray-900">Benefits Summary</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-3 border border-gray-200 rounded">
                <h4 className="font-bold mb-2 text-sm text-gray-900">For Long-Term Holders</h4>
                <ul className="text-gray-700 space-y-1 text-xs">
                  <li>• Loyalty is financially rewarded</li>
                  <li>• No risk of dilution from late entrants</li>
                  <li>• Predictable, proportional returns</li>
                </ul>
              </div>

              <div className="p-3 border border-gray-200 rounded">
                <h4 className="font-bold mb-2 text-sm text-gray-900">For the Protocol</h4>
                <ul className="text-gray-700 space-y-1 text-xs">
                  <li>• Incentivizes holding over speculation</li>
                  <li>• Reduces volatility from sniping</li>
                  <li>• Aligns rewards with contribution</li>
                </ul>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 text-gray-900">
              What's Next
            </h2>
            
            <p className="text-sm text-gray-700 mb-3">
              The new system is now live. Holders can check their eligibility and estimated rewards at any time via our Revenue Checker. 
              The next distribution cycle begins immediately, with all holders accumulating time-weighted points starting now.
            </p>
            <p className="text-sm text-gray-700">
              We're committed to building a fair, transparent, and sustainable revenue-sharing model. This migration represents a significant step toward rewarding the community that makes ZEKTA possible.
            </p>
          </div>

          {/* Footer Links */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap gap-3">
            <Link href="/revenue">
              <button className="px-5 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-800 font-medium" data-testid="button-check-revenue">
                Check Your Revenue
              </button>
            </Link>
            <Link href="/docs">
              <button className="px-5 py-2 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 font-medium" data-testid="button-docs">
                Read Docs
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* White Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-2">
              <Logo size="sm" />
              <span className="text-xs text-gray-600">© 2025 Zekta Protocol</span>
            </div>
            <div className="flex gap-4">
              <Link href="/privacy" className="text-xs text-gray-600 hover:text-gray-900">Privacy</Link>
              <Link href="/terms" className="text-xs text-gray-600 hover:text-gray-900">Terms</Link>
              <Link href="/docs" className="text-xs text-gray-600 hover:text-gray-900">Docs</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
