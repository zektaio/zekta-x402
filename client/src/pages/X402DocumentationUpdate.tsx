import { Link } from "wouter";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { FileText, Database, Code2, Network, Shield, Zap, ExternalLink } from "lucide-react";

export default function X402DocumentationUpdate() {
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
            <Link href="/x402" className="text-sm font-medium text-gray-600 hover:text-gray-900">x402 Marketplace</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1">
        <div className="container max-w-3xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900" data-testid="text-page-title">
              Complete x402 Marketplace Technical Documentation
            </h1>
            <p className="text-base text-gray-600" data-testid="text-page-subtitle">
              60+ page comprehensive reference covering architecture, payment flows, API specs, and implementation guide
            </p>
          </div>

          {/* TL;DR */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-lg font-bold mb-3 text-gray-900" data-testid="text-tldr-title">TL;DR</h2>
            <div className="space-y-1.5 text-sm text-gray-700">
              <p><strong>1.</strong> Created comprehensive technical documentation at <code className="px-1.5 py-0.5 bg-gray-100 rounded font-mono text-xs">zekta-zkid-x402.md</code></p>
              <p><strong>2.</strong> Covers complete tech stack: React 18, Express, Semaphore ZK, x402 protocol</p>
              <p><strong>3.</strong> Includes database schema, payment flows, API endpoints, and development workflow</p>
              <p><strong>4.</strong> Added x402scan.com integration for transparent on-chain transaction verification</p>
            </div>
          </div>

          {/* What's New */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-lg font-bold mb-3 text-gray-900">What's Included</h2>
            <p className="text-sm text-gray-700 mb-4">
              We've created a single source of truth for the x402 marketplace implementation. This documentation combines all architectural decisions, payment flows, and integration patterns in one comprehensive reference.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-3 border border-gray-200 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <Code2 className="w-5 h-5 text-gray-900" />
                  <h4 className="font-bold text-sm text-gray-900">Tech Stack</h4>
                </div>
                <ul className="text-gray-700 space-y-1 text-xs">
                  <li>• React 18 + TypeScript + Vite</li>
                  <li>• Express + Node.js backend</li>
                  <li>• Semaphore Protocol v4.13.1</li>
                  <li>• x402 protocol integration</li>
                </ul>
              </div>

              <div className="p-3 border border-gray-200 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-5 h-5 text-gray-900" />
                  <h4 className="font-bold text-sm text-gray-900">Database Schema</h4>
                </div>
                <ul className="text-gray-700 space-y-1 text-xs">
                  <li>• 5 tables with relationships</li>
                  <li>• users, credit_transactions</li>
                  <li>• x402_services, x402_purchases</li>
                  <li>• purchase_logs (detailed tracking)</li>
                </ul>
              </div>

              <div className="p-3 border border-gray-200 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <Network className="w-5 h-5 text-gray-900" />
                  <h4 className="font-bold text-sm text-gray-900">Payment Flow</h4>
                </div>
                <ul className="text-gray-700 space-y-1 text-xs">
                  <li>• Two-stage payment architecture</li>
                  <li>• User→Zekta credit top-up</li>
                  <li>• Zekta→x402 service purchase</li>
                  <li>• ERC-3009 authorization</li>
                </ul>
              </div>

              <div className="p-3 border border-gray-200 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-gray-900" />
                  <h4 className="font-bold text-sm text-gray-900">API Endpoints</h4>
                </div>
                <ul className="text-gray-700 space-y-1 text-xs">
                  <li>• 15+ endpoint specifications</li>
                  <li>• Request/response examples</li>
                  <li>• Authentication flows</li>
                  <li>• Error handling patterns</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Documentation Sections */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-lg font-bold mb-4 text-gray-900">
              Documentation Sections
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs">1</div>
                <div>
                  <h4 className="font-bold text-sm mb-1 text-gray-900">System Architecture</h4>
                  <p className="text-sm text-gray-700">
                    High-level diagrams, component breakdown, and integration layer overview
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs">2</div>
                <div>
                  <h4 className="font-bold text-sm mb-1 text-gray-900">Technology Stack</h4>
                  <p className="text-sm text-gray-700">
                    Complete breakdown of frontend, backend, blockchain, and external services
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs">3</div>
                <div>
                  <h4 className="font-bold text-sm mb-1 text-gray-900">Database Schema</h4>
                  <p className="text-sm text-gray-700">
                    Entity relationships, table definitions, example records, and foreign keys
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs">4</div>
                <div>
                  <h4 className="font-bold text-sm mb-1 text-gray-900">Payment Flow</h4>
                  <p className="text-sm text-gray-700">
                    Two-stage payment architecture with step-by-step implementation code
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs">5</div>
                <div>
                  <h4 className="font-bold text-sm mb-1 text-gray-900">API Endpoints</h4>
                  <p className="text-sm text-gray-700">
                    15+ endpoints with request/response examples and implementation details
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs">6</div>
                <div>
                  <h4 className="font-bold text-sm mb-1 text-gray-900">User Journey</h4>
                  <p className="text-sm text-gray-700">
                    7-step walkthrough from landing page to service usage with wireframes
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs">7</div>
                <div>
                  <h4 className="font-bold text-sm mb-1 text-gray-900">Security Architecture</h4>
                  <p className="text-sm text-gray-700">
                    Semaphore ZK authentication, ERC-3009 payments, and data protection
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs">8</div>
                <div>
                  <h4 className="font-bold text-sm mb-1 text-gray-900">Service Catalog</h4>
                  <p className="text-sm text-gray-700">
                    14+ services (OpenAI, Claude, Gemini, Firecrawl) with pricing and use cases
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs">9</div>
                <div>
                  <h4 className="font-bold text-sm mb-1 text-gray-900">Environment Setup</h4>
                  <p className="text-sm text-gray-700">
                    Prerequisites, installation steps, database configuration, and deployment
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs">10</div>
                <div>
                  <h4 className="font-bold text-sm mb-1 text-gray-900">x402scan Transaction Explorer</h4>
                  <p className="text-sm text-gray-700">
                    Complete guide to viewing x402 payments on-chain, privacy considerations, and comparison with Basescan
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs">11</div>
                <div>
                  <h4 className="font-bold text-sm mb-1 text-gray-900">Development Workflow</h4>
                  <p className="text-sm text-gray-700">
                    Project structure, code style guide, and testing checklist
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-lg font-bold mb-3 text-gray-900">Key Features Documented</h2>
            
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 border border-gray-200 rounded">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-gray-900" />
                  <h4 className="font-bold text-sm text-gray-900">Zero-Knowledge Authentication</h4>
                </div>
                <p className="text-xs text-gray-700">
                  Complete Semaphore Protocol implementation with identity generation, proof creation, and verification flows
                </p>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 rounded">
                <div className="flex items-center gap-2 mb-1">
                  <Network className="w-4 h-4 text-gray-900" />
                  <h4 className="font-bold text-sm text-gray-900">Multi-Crypto Payments</h4>
                </div>
                <p className="text-xs text-gray-700">
                  Support for 8+ cryptocurrencies (SOL, BTC, ETH, BNB, MATIC, AVAX, ZEC, ZEKTA) with automatic USDC Base conversion
                </p>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 rounded">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4 text-gray-900" />
                  <h4 className="font-bold text-sm text-gray-900">x402 Protocol Integration</h4>
                </div>
                <p className="text-xs text-gray-700">
                  ERC-3009 payment authorization, CDP Facilitator integration, and Base network settlement
                </p>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 rounded">
                <div className="flex items-center gap-2 mb-1">
                  <Database className="w-4 h-4 text-gray-900" />
                  <h4 className="font-bold text-sm text-gray-900">Detailed Transaction Logging</h4>
                </div>
                <p className="text-xs text-gray-700">
                  12-step purchase flow tracking with status updates, error handling, and recovery patterns
                </p>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 rounded">
                <div className="flex items-center gap-2 mb-1">
                  <ExternalLink className="w-4 h-4 text-gray-900" />
                  <h4 className="font-bold text-sm text-gray-900">x402scan.com Integration</h4>
                </div>
                <p className="text-xs text-gray-700">
                  View all x402 payments on-chain with transaction explorer, verify settlements, and track facilitator activity
                </p>
              </div>
            </div>
          </div>

          {/* x402scan Transaction Transparency */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-lg font-bold mb-3 text-gray-900">
              Transaction Transparency with x402scan
            </h2>
            
            <p className="text-sm text-gray-700 mb-4">
              All x402 payment settlements are recorded on-chain (Base network) and can be publicly verified for transparency. The documentation includes a complete guide to using x402scan.com for transaction verification.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="p-3 border border-blue-200 bg-blue-50 rounded">
                <h4 className="font-bold text-sm mb-2 text-gray-900">What's Public</h4>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>✅ Transaction hash</li>
                  <li>✅ Payment amount (USDC)</li>
                  <li>✅ Service provider address</li>
                  <li>✅ Facilitator used (CDP/PayAI)</li>
                  <li>✅ Timestamp & block number</li>
                </ul>
              </div>

              <div className="p-3 border border-green-200 bg-green-50 rounded">
                <h4 className="font-bold text-sm mb-2 text-gray-900">What's Private</h4>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>🔒 User identity (ZK commitment)</li>
                  <li>🔒 User wallet address</li>
                  <li>🔒 Request data (prompts)</li>
                  <li>🔒 Response data (outputs)</li>
                  <li>🔒 Credit balance</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-gray-100 border border-gray-200 rounded">
              <h4 className="font-bold text-sm mb-2 text-gray-900">How to Use x402scan</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>1.</strong> After a service purchase, copy the transaction hash from your purchase history</p>
                <p><strong>2.</strong> Visit <code className="px-1.5 py-0.5 bg-white border border-gray-300 rounded font-mono text-xs">x402scan.com/tx/0x...</code></p>
                <p><strong>3.</strong> View payment details, service information, and on-chain verification</p>
              </div>
            </div>

            <div className="mt-4 p-3 border border-gray-200 rounded">
              <h4 className="font-bold text-sm mb-2 text-gray-900">x402scan vs Basescan</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-2 font-bold text-gray-900">Feature</th>
                      <th className="text-left py-2 px-2 font-bold text-gray-900">x402scan.com</th>
                      <th className="text-left py-2 px-2 font-bold text-gray-900">basescan.org</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="border-b border-gray-100">
                      <td className="py-2 px-2">x402-specific UI</td>
                      <td className="py-2 px-2">✅ Yes</td>
                      <td className="py-2 px-2">❌ No</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 px-2">Service details</td>
                      <td className="py-2 px-2">✅ Full context</td>
                      <td className="py-2 px-2">❌ Raw transaction</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 px-2">Facilitator info</td>
                      <td className="py-2 px-2">✅ Highlighted</td>
                      <td className="py-2 px-2">❌ Just addresses</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2">User-friendly</td>
                      <td className="py-2 px-2">✅ For x402 users</td>
                      <td className="py-2 px-2">⚠️ For blockchain devs</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                <strong>Recommendation:</strong> Use x402scan.com for better UX and x402-specific details. Use basescan.org for low-level blockchain verification.
              </p>
            </div>
          </div>

          {/* Code Examples */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-lg font-bold mb-3 text-gray-900">
              Includes Implementation Examples
            </h2>
            
            <p className="text-sm text-gray-700 mb-3">
              The documentation includes production-ready code examples for:
            </p>

            <div className="grid md:grid-cols-2 gap-3">
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• ZK identity creation & verification</li>
                <li>• Credit top-up flow</li>
                <li>• x402 service calls</li>
                <li>• Payment authorization signing</li>
              </ul>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Database transactions</li>
                <li>• Error handling & recovery</li>
                <li>• API endpoint implementations</li>
                <li>• Frontend state management</li>
              </ul>
            </div>

            <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded">
              <p className="text-xs text-gray-700">
                <strong className="text-gray-900">Note:</strong> All code examples are TypeScript with full type safety and follow best practices for React 18, Express, and Drizzle ORM.
              </p>
            </div>
          </div>

          {/* For Developers */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-lg font-bold mb-3 text-gray-900">
              For Developers
            </h2>
            
            <p className="text-sm text-gray-700 mb-3">
              This documentation serves multiple purposes:
            </p>

            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-gray-900 mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-700">
                  <strong>Onboarding:</strong> New developers can understand the entire system architecture in one read
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-gray-900 mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-700">
                  <strong>Reference:</strong> Quick lookup for API endpoints, database schema, and payment flows
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-gray-900 mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-700">
                  <strong>Implementation:</strong> Copy-paste ready code examples for common operations
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-gray-900 mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-700">
                  <strong>Debugging:</strong> Understand transaction flows and error handling patterns
                </p>
              </div>
            </div>
          </div>

          {/* Access the Documentation */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 text-gray-900">
              Access the Documentation
            </h2>
            
            <p className="text-sm text-gray-700 mb-3">
              The complete documentation is available at the root of the project repository:
            </p>

            <div className="p-3 bg-gray-900 rounded font-mono text-xs text-white overflow-x-auto">
              /zekta-zkid-x402.md
            </div>

            <p className="text-sm text-gray-700 mt-3">
              This Markdown file can be viewed directly on GitHub, exported to PDF, or opened in any Markdown viewer for easy navigation.
            </p>
          </div>

          {/* Footer Links */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap gap-3">
            <Link href="/x402">
              <button className="px-5 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-800 font-medium" data-testid="button-x402-marketplace">
                Try x402 Marketplace
              </button>
            </Link>
            <Link href="/docs">
              <button className="px-5 py-2 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 font-medium" data-testid="button-docs">
                Read User Docs
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
