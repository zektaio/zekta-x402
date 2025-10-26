import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Link } from 'wouter';
import Logo from '@/components/Logo';
import { 
  Search, Book, Terminal, Package, Code, Shield, Zap, 
  ChevronRight, Copy, Check, Menu, X, ArrowUp, ArrowLeft,
  Globe, CreditCard, Repeat, Key, Database, ExternalLink,
  Lock, CheckCircle2
} from 'lucide-react';

export default function DeveloperDocs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('introduction');
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
      
      const sections = document.querySelectorAll('[data-section]');
      let currentSection = 'introduction';
      
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          currentSection = section.getAttribute('data-section') || 'introduction';
        }
      });
      
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const elementPosition = element.offsetTop;
      const headerHeight = 64;
      const additionalOffset = 20;

      window.scrollTo({
        top: elementPosition - headerHeight - additionalOffset,
        behavior: 'smooth'
      });
      setSidebarOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickAccessCards = [
    {
      icon: Zap,
      title: 'Quick Start',
      description: 'Get started in under 5 minutes',
      sectionId: 'quick-start'
    },
    {
      icon: Terminal,
      title: 'API Reference',
      description: 'Complete endpoint documentation',
      sectionId: 'api-domains'
    },
    {
      icon: Package,
      title: 'SDK',
      description: 'TypeScript SDK for ZK identities',
      sectionId: 'sdk-overview'
    },
    {
      icon: Code,
      title: 'Examples',
      description: 'Full working code examples',
      sectionId: 'example-domain'
    }
  ];

  const allSidebarSections = [
    { id: 'introduction', label: 'Introduction', icon: Book },
    { id: 'authentication', label: 'Authentication', icon: Key },
    { id: 'quick-start', label: 'Quick Start', icon: Zap },
    { id: 'api-domains', label: 'Domain API', icon: Globe },
    { id: 'api-giftcards', label: 'Gift Card API', icon: CreditCard },
    { id: 'api-swaps', label: 'Swap API', icon: Repeat },
    { id: 'api-zkswap', label: 'ZK Swap API', icon: Shield },
    { id: 'sdk-overview', label: 'SDK Overview', icon: Package },
    { id: 'sdk-methods', label: 'SDK Methods', icon: Code },
    { id: 'example-domain', label: 'Domain Purchase Example', icon: Globe },
    { id: 'example-giftcard', label: 'Gift Card Example', icon: CreditCard },
    { id: 'example-zkauth', label: 'ZK Authentication Example', icon: Shield },
    { id: 'best-practices', label: 'Best Practices', icon: CheckCircle2 },
    { id: 'security', label: 'Security', icon: Lock }
  ];

  // Filter sidebar sections based on search query
  const sidebarSections = searchQuery.trim()
    ? allSidebarSections.filter(section =>
        section.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allSidebarSections;

  // Auto-scroll to first matching section when search query changes
  useEffect(() => {
    if (searchQuery.trim() && sidebarSections.length > 0) {
      const firstMatch = sidebarSections[0];
      scrollToSection(firstMatch.id);
    }
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header - Clean & Simple */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="flex items-center justify-between h-12 px-3">
          <div className="flex items-center gap-2">
            {/* Mobile Menu Toggle */}
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden h-8 w-8 border-gray-400 text-gray-900"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              data-testid="button-menu-toggle"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <Logo size="sm" showText={false} />
                <span className="text-base sm:text-lg font-bold text-blue-600">
                  ZEKTA
                </span>
              </div>
            </Link>
          </div>

          {/* Back Button */}
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-gray-700 h-8 text-xs sm:text-sm">
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Back to Home</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Mobile Sheet Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-[280px] p-0 lg:hidden">
          <SheetHeader className="border-b border-gray-200 px-4 py-3">
            <SheetTitle className="text-left text-base font-bold text-blue-600">Navigation</SheetTitle>
          </SheetHeader>
          <div className="flex h-[calc(100vh-60px)] flex-col">
            {/* Search */}
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search..."
                  className="pl-9 h-9 bg-white border-gray-200 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search-mobile"
                />
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4">
              <div className="space-y-1">
                {sidebarSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    data-testid={`nav-mobile-${section.id}`}
                  >
                    <section.icon className="h-4 w-4 flex-shrink-0" />
                    <span>{section.label}</span>
                  </button>
                ))}
              </div>
            </nav>

            {/* Bottom Links */}
            <div className="border-t border-gray-200 p-4">
              <div className="space-y-2">
                <Link href="/developer/keys">
                  <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-50" size="sm">
                    <Key className="mr-2 h-4 w-4" />
                    API Keys
                  </Button>
                </Link>
                <Link href="/sdk">
                  <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-50" size="sm">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    SDK Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="fixed left-0 top-12 bottom-0 z-40 w-64 border-r border-gray-200 bg-white hidden lg:block">
          <div className="flex h-full flex-col">
            {/* Search */}
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search..."
                  className="pl-9 h-9 bg-white border-gray-200 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search-desktop"
                />
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4">
              <div className="space-y-1">
                {sidebarSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    data-testid={`nav-desktop-${section.id}`}
                  >
                    <section.icon className="h-4 w-4 flex-shrink-0" />
                    <span>{section.label}</span>
                  </button>
                ))}
              </div>
            </nav>

            {/* Bottom Links */}
            <div className="border-t border-gray-200 p-4">
              <div className="space-y-2">
                <Link href="/developer/keys">
                  <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-50" size="sm">
                    <Key className="mr-2 h-4 w-4" />
                    API Keys
                  </Button>
                </Link>
                <Link href="/sdk">
                  <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-50" size="sm">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    SDK Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="w-full lg:ml-64 pt-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {/* Hero */}
            <div className="mb-6" data-section="introduction" id="introduction">
              <div className="mb-4">
                <h1 className="mb-2 text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                  Developer Documentation
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  Complete API reference and SDK guide for integrating Zekta Protocol
                </p>
              </div>

              {/* Quick Access Cards */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {quickAccessCards.map((card, index) => (
                  <Card
                    key={index}
                    className="cursor-pointer p-4 transition-colors hover:bg-gray-50 bg-white border-gray-200"
                    onClick={() => scrollToSection(card.sectionId)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded bg-blue-50 p-2 flex-shrink-0">
                        <card.icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-gray-900 mb-1">{card.title}</h3>
                        <p className="text-sm text-gray-600 leading-snug">{card.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Authentication Section */}
            <Section id="authentication" title="Authentication">
              <p className="mb-4 text-gray-600">
                Zekta Protocol uses zero-knowledge proofs for authentication, not traditional API keys.
              </p>
              
              <div className="space-y-4">
                <Card className="p-4 bg-white border-gray-200">
                  <h4 className="mb-2 font-semibold flex items-center gap-2 text-gray-900">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Public API (No Keys Required)
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    All core endpoints are publicly accessible:
                  </p>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center gap-2 text-gray-600">
                      <ChevronRight className="h-4 w-4 text-blue-600" />
                      Domain Purchase, Gift Cards, Crypto Swaps
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <ChevronRight className="h-4 w-4 text-blue-600" />
                      Pricing APIs, Order Tracking
                    </li>
                  </ul>
                </Card>

                <Card className="p-4 bg-white border-gray-200">
                  <h4 className="mb-2 font-semibold flex items-center gap-2 text-gray-900">
                    <Shield className="h-5 w-5 text-blue-600" />
                    Zero-Knowledge Authentication
                  </h4>
                  <p className="text-sm text-gray-600">
                    For protected actions (DNS management, gift card retrieval), users generate ZK proofs to prove ownership without revealing secrets.
                  </p>
                </Card>

                <Card className="p-4 bg-blue-50 border-blue-200">
                  <h4 className="mb-2 font-semibold flex items-center gap-2 text-gray-900">
                    <Key className="h-5 w-5 text-blue-600" />
                    Need API Keys for Analytics?
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    For advanced usage tracking and analytics, visit the Developer Portal to generate and manage API keys.
                  </p>
                  <Link href="/developer/keys">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Key className="mr-2 h-4 w-4" />
                      Go to Developer Portal
                    </Button>
                  </Link>
                </Card>
              </div>
            </Section>

            {/* Quick Start */}
            <Section id="quick-start" title="Quick Start">
              <p className="mb-6 text-muted-foreground">
                Get started with Zekta Protocol in under 5 minutes.
              </p>

              <div className="space-y-6">
                <div>
                  <h4 className="mb-3 font-semibold">1. Install Dependencies</h4>
                  <CodeBlock
                    code="npm install @semaphore-protocol/identity @semaphore-protocol/group @semaphore-protocol/proof"
                    language="bash"
                    onCopy={(code) => copyToClipboard(code, 'install')}
                    copied={copiedCode === 'install'}
                  />
                </div>

                <div>
                  <h4 className="mb-3 font-semibold">2. Copy Zekta SDK</h4>
                  <p className="mb-3 text-sm text-muted-foreground">
                    Copy <code className="rounded bg-muted px-1.5 py-0.5 text-xs">client/src/lib/zekta-sdk.ts</code> to your project.
                  </p>
                  <Link href="/sdk">
                    <Button variant="outline">
                      <Package className="mr-2 h-4 w-4" />
                      View SDK Documentation
                    </Button>
                  </Link>
                </div>

                <div>
                  <h4 className="mb-3 font-semibold">3. Start Building</h4>
                  <CodeBlock
                    code={`import { ZektaSDK } from '@/lib/zekta-sdk';

// Generate identity
const secret = ZektaSDK.generateIdentity();

// Download for user to save
ZektaSDK.downloadIdentity(secret, 'user-123', 'MyApp');`}
                    language="typescript"
                    onCopy={(code) => copyToClipboard(code, 'quickstart')}
                    copied={copiedCode === 'quickstart'}
                  />
                </div>
              </div>
            </Section>

            {/* API Reference: Domains */}
            <Section id="api-domains" title="Domain API">
              <APIEndpoint
                method="POST"
                path="/api/domains/order"
                title="Create Domain Order"
                description="Purchase a domain anonymously with cryptocurrency"
                requestCode={`{
  "domainName": "mysite",
  "tld": ".org",
  "currency": "BTC"
}`}
                responseCode={`{
  "ok": true,
  "orderId": "ZK-DOM-1234567890-ABC123XY",
  "domain": "mysite.org",
  "priceEUR": 14.99,
  "currency": "BTC",
  "amountCrypto": 0.00042,
  "depositAddress": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  "expiresAt": "2024-10-23T15:30:00.000Z",
  "paymentStatus": "pending",
  "domainSecret": "25,90,166,4,76...",
  "zkCommitment": "12345678901234567890..."
}`}
                copyCode={copyToClipboard}
                copiedCode={copiedCode}
              />

              <APIEndpoint
                method="POST"
                path="/api/domains/:domain/dns"
                title="Add DNS Record"
                description="Add DNS record using domain secret authentication"
                requestCode={`{
  "type": "A",
  "name": "@",
  "content": "192.0.2.1",
  "ttl": 3600,
  "domainSecret": "25,90,166,4,76..."
}`}
                responseCode={`{
  "ok": true,
  "record": {
    "id": "123",
    "type": "A",
    "name": "@",
    "content": "192.0.2.1",
    "ttl": 3600
  }
}`}
                copyCode={copyToClipboard}
                copiedCode={copiedCode}
              />

              <APIEndpoint
                method="GET"
                path="/api/domains/pricing"
                title="Get Domain Pricing"
                description="Fetch real-time domain prices in EUR"
                responseCode={`{
  "pricing": {
    ".com": { "usd": 12.99, "eur": 11.99 },
    ".org": { "usd": 14.99, "eur": 13.99 },
    ".net": { "usd": 13.99, "eur": 12.99 }
  }
}`}
                copyCode={copyToClipboard}
                copiedCode={copiedCode}
              />
            </Section>

            {/* API Reference: Gift Cards */}
            <Section id="api-giftcards" title="Gift Card API">
              <APIEndpoint
                method="POST"
                path="/api/giftcards/order"
                title="Create Gift Card Order"
                description="Purchase Amazon or Google Play gift cards with cryptocurrency"
                requestCode={`{
  "giftCardType": "amazon",
  "denomination": 25,
  "currency": "BTC"
}`}
                responseCode={`{
  "ok": true,
  "orderId": "gc_xyz789",
  "giftCardType": "amazon",
  "denomination": 25,
  "priceUSD": 25,
  "currency": "BTC",
  "amountCrypto": 0.00025,
  "depositAddress": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  "expiresAt": "2024-10-23T15:30:00.000Z",
  "paymentStatus": "pending",
  "zkCommitment": "67890123456789012345...",
  "giftCardSecret": "180,45,200,88...",
  "demo": true
}`}
                copyCode={copyToClipboard}
                copiedCode={copiedCode}
              />

              <APIEndpoint
                method="POST"
                path="/api/giftcards/verify-and-get"
                title="Retrieve Gift Card"
                description="Get gift card details using ZK proof (anonymous authentication)"
                requestCode={`{
  "proof": {
    "merkleTreeDepth": 16,
    "merkleTreeRoot": "789...",
    "nullifier": "456...",
    "message": "67890...",
    "scope": "67890...",
    "points": ["0x123...", "0x456..."]
  },
  "signal": "67890...",
  "zkCommitment": "67890..."
}`}
                responseCode={`{
  "ok": true,
  "giftCard": {
    "orderId": "gc_xyz789",
    "giftCardType": "amazon",
    "denomination": 25,
    "cardNumber": "XXXX-XXXX-XXXX-1234",
    "cardPin": "5678",
    "redeemInstructions": "Visit amazon.com/redeem"
  }
}`}
                copyCode={copyToClipboard}
                copiedCode={copiedCode}
              />

              <APIEndpoint
                method="GET"
                path="/api/giftcards/group"
                title="Get Semaphore Group"
                description="Fetch current group members for ZK proof generation"
                responseCode={`{
  "members": ["12345...", "67890...", "11111..."]
}`}
                copyCode={copyToClipboard}
                copiedCode={copiedCode}
              />
            </Section>

            {/* API Reference: Swaps */}
            <Section id="api-swaps" title="Swap API">
              <APIEndpoint
                method="POST"
                path="/api/swap/estimate"
                title="Get Swap Quote"
                description="Get real-time exchange rate for cryptocurrency swap"
                requestCode={`{
  "currencyFrom": "BTC",
  "currencyTo": "ETH",
  "amountFrom": 0.1
}`}
                responseCode={`{
  "ok": true,
  "estimate": {
    "currencyFrom": "BTC",
    "currencyTo": "ETH",
    "amountFrom": 0.1,
    "amountTo": 2.45,
    "rate": 24.5
  }
}`}
                copyCode={copyToClipboard}
                copiedCode={copiedCode}
              />

              <APIEndpoint
                method="GET"
                path="/api/swap/exchange/:exchangeId"
                title="Get Swap Status"
                description="Check the status of a specific swap"
                responseCode={`{
  "ok": true,
  "exchange": {
    "id": "swap_123",
    "status": "finished",
    "currencyFrom": "BTC",
    "currencyTo": "ETH",
    "amountFrom": 0.1,
    "amountTo": 2.45,
    "addressTo": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
  }
}`}
                copyCode={copyToClipboard}
                copiedCode={copiedCode}
              />
            </Section>

            {/* API Reference: ZK Swaps */}
            <Section id="api-zkswap" title="ZK Swap API">
              <p className="mb-6 text-muted-foreground">
                Zero-knowledge swap endpoint with optional ZK proof for enhanced privacy.
              </p>

              <APIEndpoint
                method="POST"
                path="/api/zekta/swap"
                title="Create ZK Swap"
                description="Execute anonymous swap with optional ZK proof verification"
                requestCode={`{
  "from": "SOL",
  "to": "ETH",
  "amount": 10,
  "zkProof": {
    "proof": ["0x123...", "0x456..."],
    "publicSignals": ["0x789..."]
  }
}`}
                responseCode={`{
  "ok": true,
  "orderId": "ZEKTA-1234567890-ABC123XY",
  "status": "processing",
  "from": "SOL",
  "to": "ETH",
  "amount": 10,
  "estimatedArrival": "2024-10-23T15:30:00.000Z",
  "privacyGuaranteed": true
}`}
                copyCode={copyToClipboard}
                copiedCode={copiedCode}
              />

              <Card className="mt-4 p-4 bg-primary/5 border-primary/20">
                <p className="text-sm">
                  <strong className="text-primary">Privacy Note:</strong> The <code className="px-1.5 py-0.5 bg-muted rounded text-xs">zkProof</code> parameter is optional. When provided, it enables fully anonymous swaps with cryptographic privacy guarantees.
                </p>
              </Card>
            </Section>

            {/* SDK Overview */}
            <Section id="sdk-overview" title="SDK Overview">
              <p className="mb-6 text-muted-foreground">
                The Zekta SDK provides helper methods for zero-knowledge identity management.
              </p>

              <Card className="p-6">
                <h4 className="mb-4 font-semibold">Installation</h4>
                <p className="mb-3 text-sm text-muted-foreground">
                  Copy <code className="rounded bg-muted px-1.5 py-0.5 text-xs">client/src/lib/zekta-sdk.ts</code> to your project:
                </p>
                <CodeBlock
                  code={`import { ZektaSDK } from '@/lib/zekta-sdk';`}
                  language="typescript"
                  onCopy={(code) => copyToClipboard(code, 'sdk-import')}
                  copied={copiedCode === 'sdk-import'}
                />
              </Card>
            </Section>

            {/* SDK Methods */}
            <Section id="sdk-methods" title="SDK Methods">
              <div className="space-y-6">
                <SDKMethod
                  name="generateIdentity()"
                  description="Generate a new zero-knowledge identity"
                  code={`const secret = ZektaSDK.generateIdentity();
// Returns: "25,90,166,4,76,102..."`}
                  copyCode={copyToClipboard}
                  copiedCode={copiedCode}
                  id="gen-identity"
                />

                <SDKMethod
                  name="getCommitment(secret)"
                  description="Extract commitment from identity secret"
                  code={`const commitment = ZektaSDK.getCommitment(secret);
// Returns: "12345678901234567890..."`}
                  copyCode={copyToClipboard}
                  copiedCode={copiedCode}
                  id="get-commitment"
                />

                <SDKMethod
                  name="downloadIdentity(...)"
                  description="Download identity as JSON file for user"
                  code={`ZektaSDK.downloadIdentity(
  secret,
  'user-123',
  'MyApp',
  { email: 'user@example.com' }
);`}
                  copyCode={copyToClipboard}
                  copiedCode={copiedCode}
                  id="download-identity"
                />

                <SDKMethod
                  name="uploadIdentityFile(file)"
                  description="Parse identity from uploaded file"
                  code={`const file = event.target.files[0];
const secret = await ZektaSDK.uploadIdentityFile(file);`}
                  copyCode={copyToClipboard}
                  copiedCode={copiedCode}
                  id="upload-identity"
                />

                <SDKMethod
                  name="generateProof(...)"
                  description="Generate ZK proof for authentication"
                  code={`const proof = await ZektaSDK.generateProof(
  secret,
  groupMembers,
  message,
  externalNullifier
);`}
                  copyCode={copyToClipboard}
                  copiedCode={copiedCode}
                  id="generate-proof"
                />
              </div>
            </Section>

            {/* Examples */}
            <Section id="example-domain" title="Domain Purchase Example">
              <p className="mb-4 text-muted-foreground">
                Complete flow for purchasing a domain anonymously.
              </p>
              <CodeBlock
                code={`import { ZektaSDK } from '@/lib/zekta-sdk';

async function purchaseDomain(domainName: string, tld: string) {
  // 1. Create order
  const orderRes = await fetch('/api/domains/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      domainName,
      tld,
      currency: 'BTC'
    })
  });
  
  const order = await orderRes.json();
  
  // 2. Download secret for user (CRITICAL!)
  ZektaSDK.downloadIdentity(
    order.domainSecret,
    order.orderId,
    'MyApp',
    { domain: order.domain }
  );
  
  // 3. Show payment instructions
  alert(\`Send \${order.amountCrypto} \${order.currency} to \${order.depositAddress}\`);
  
  // 4. Later: Manage DNS with secret
  const file = await selectFile();
  const secret = await ZektaSDK.uploadIdentityFile(file);
  
  await fetch(\`/api/domains/\${order.domain}/dns\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'A',
      name: '@',
      content: '192.0.2.1',
      ttl: 3600,
      domainSecret: secret
    })
  });
}`}
                language="typescript"
                onCopy={(code) => copyToClipboard(code, 'example-domain-full')}
                copied={copiedCode === 'example-domain-full'}
              />
            </Section>

            <Section id="example-giftcard" title="Gift Card Purchase Example">
              <p className="mb-4 text-muted-foreground">
                Complete flow for purchasing and retrieving gift cards with ZK proofs.
              </p>
              <CodeBlock
                code={`import { ZektaSDK } from '@/lib/zekta-sdk';

async function purchaseAndRetrieveGiftCard() {
  // 1. Create order
  const orderRes = await fetch('/api/giftcards/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      giftCardType: 'amazon',
      denomination: 25,
      currency: 'BTC'
    })
  });
  
  const order = await orderRes.json();
  
  // 2. Save identity
  ZektaSDK.downloadIdentity(
    order.giftCardSecret,
    order.orderId,
    'MyApp'
  );
  
  // 3. User pays crypto...
  
  // 4. Retrieve card with ZK proof
  const file = await selectFile();
  const secret = await ZektaSDK.uploadIdentityFile(file);
  
  // Fetch group
  const groupRes = await fetch('/api/giftcards/group');
  const { members } = await groupRes.json();
  
  // Generate proof
  const commitment = ZektaSDK.getCommitment(secret);
  const proof = await ZektaSDK.generateProof(
    secret,
    members,
    commitment,
    commitment
  );
  
  // Get card
  const cardRes = await fetch('/api/giftcards/verify-and-get', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      proof,
      signal: commitment,
      zkCommitment: commitment
    })
  });
  
  const { giftCard } = await cardRes.json();
  console.log('Card:', giftCard.cardNumber, giftCard.cardPin);
}`}
                language="typescript"
                onCopy={(code) => copyToClipboard(code, 'example-giftcard-full')}
                copied={copiedCode === 'example-giftcard-full'}
              />
            </Section>

            <Section id="example-zkauth" title="ZK Authentication Example">
              <p className="mb-4 text-muted-foreground">
                Implement anonymous authentication using zero-knowledge proofs.
              </p>
              <CodeBlock
                code={`import { ZektaSDK } from '@/lib/zekta-sdk';

// On signup: Generate identity
const secret = ZektaSDK.generateIdentity();
const commitment = ZektaSDK.getCommitment(secret);

// Store commitment in database (never store secret!)
await db.users.create({ zkCommitment: commitment });

// Download for user
ZektaSDK.downloadIdentity(secret, userId, 'MyApp');

// On login: User uploads identity
const file = event.target.files[0];
const secret = await ZektaSDK.uploadIdentityFile(file);

// Fetch group members
const groupRes = await fetch('/api/auth/group');
const { members } = await groupRes.json();

// Generate proof
const commitment = ZektaSDK.getCommitment(secret);
const proof = await ZektaSDK.generateProof(
  secret,
  members,
  commitment,
  commitment
);

// Authenticate
const authRes = await fetch('/api/auth/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ proof, commitment })
});

if (authRes.ok) {
  console.log('Authenticated anonymously!');
}`}
                language="typescript"
                onCopy={(code) => copyToClipboard(code, 'example-zkauth-full')}
                copied={copiedCode === 'example-zkauth-full'}
              />
            </Section>

            {/* Best Practices */}
            <Section id="best-practices" title="Best Practices">
              <div className="space-y-4">
                <Card className="p-4">
                  <h4 className="mb-2 font-semibold flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    Identity Secret Management
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Never store secrets on backend</strong>. Only store commitments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Always use HTTPS</strong>. Secrets transmitted must be encrypted</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Force user downloads</strong>. User must save identity file immediately</span>
                    </li>
                  </ul>
                </Card>

                <Card className="p-4">
                  <h4 className="mb-2 font-semibold flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    ZK Proof Verification
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Always verify server-side</strong>. Never trust client verification</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Use fresh group members</strong>. Fetch current group before proof</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Check nullifiers</strong>. Prevent double-spend attacks</span>
                    </li>
                  </ul>
                </Card>

                <Card className="p-4">
                  <h4 className="mb-2 font-semibold flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    Data Privacy
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>No wallet addresses</strong>. Only store ZK commitments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>No identity linkage</strong>. Each order gets unique identity</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Minimal logging</strong>. Avoid logging sensitive user data</span>
                    </li>
                  </ul>
                </Card>
              </div>
            </Section>

            {/* Security */}
            <Section id="security" title="Security">
              <div className="space-y-4">
                <Card className="p-4 bg-red-50 border-red-200">
                  <h4 className="mb-3 font-semibold text-red-600">Critical Security Rules</h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-900">Secrets returned from API are <strong className="text-gray-900">one-time only</strong>. User must save immediately</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-900">Lost secrets <strong className="text-gray-900">cannot be recovered</strong>. Warn users explicitly</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-900">Backend must <strong className="text-gray-900">never</strong> store secrets. Only commitments</span>
                    </li>
                  </ul>
                </Card>

                <Card className="p-4 bg-green-50 border-green-200">
                  <h4 className="mb-3 font-semibold text-green-600">Privacy Guarantees</h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-900">No wallet addresses stored anywhere in the system</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-900">ZK proofs provide cryptographic anonymity</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-900">Each transaction uses unique identity (no linkage)</span>
                    </li>
                  </ul>
                </Card>
              </div>
            </Section>
          </div>
        </main>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          className="fixed bottom-3 right-3 z-50 h-9 w-9 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white"
          onClick={scrollToTop}
          data-testid="button-back-to-top"
        >
          <ArrowUp className="h-3.5 w-3.5" />
        </Button>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Logo & Tagline */}
            <div>
              <Link href="/">
                <div className="flex items-center gap-2 mb-2 cursor-pointer">
                  <Logo size="sm" showText={false} />
                  <span className="text-lg font-bold text-blue-600">ZEKTA</span>
                </div>
              </Link>
              <p className="text-sm text-gray-600">
                Zero-Knowledge Action Layer for Private Blockchain Transactions
              </p>
            </div>

            {/* Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Resources</h3>
              <div className="space-y-2">
                <Link href="/developer" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Documentation
                </Link>
                <Link href="/sdk" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Playground
                </Link>
                <Link href="/docs" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Protocol Docs
                </Link>
              </div>
            </div>

            {/* Social */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Community</h3>
              <div className="space-y-2">
                <a 
                  href="https://twitter.com/zekta_io" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Twitter
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              © 2025 Zekta. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}

// Helper Components
function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8 scroll-mt-14" data-section={id} id={id}>
      <h2 className="mb-4 text-xl sm:text-2xl font-bold tracking-tight text-gray-900">{title}</h2>
      {children}
    </section>
  );
}

function APIEndpoint({
  method,
  path,
  title,
  description,
  requestCode,
  responseCode,
  copyCode,
  copiedCode
}: {
  method: string;
  path: string;
  title: string;
  description: string;
  requestCode?: string;
  responseCode: string;
  copyCode: (code: string, id: string) => void;
  copiedCode: string | null;
}) {
  const methodColors: Record<string, string> = {
    GET: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    POST: 'bg-green-500/10 text-green-500 border-green-500/20',
    PUT: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    DELETE: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  const id = `${method}-${path}`.replace(/[^a-zA-Z0-9]/g, '-');

  return (
    <Card className="mb-4 overflow-hidden bg-white border-gray-200">
      <div className="border-b border-gray-200 bg-gray-50 p-4">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge className={`${methodColors[method]} text-xs`}>{method}</Badge>
          <code className="text-xs sm:text-sm text-gray-700 break-all">{path}</code>
        </div>
        <h4 className="font-semibold text-sm text-gray-900 mb-1">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div className="p-4 space-y-4">
        {requestCode && (
          <div>
            <h5 className="mb-2 text-sm font-semibold text-gray-900">Request Body</h5>
            <CodeBlock
              code={requestCode}
              language="json"
              onCopy={(code) => copyCode(code, `${id}-req`)}
              copied={copiedCode === `${id}-req`}
            />
          </div>
        )}
        <div>
          <h5 className="mb-2 text-sm font-semibold text-gray-900">Response</h5>
          <CodeBlock
            code={responseCode}
            language="json"
            onCopy={(code) => copyCode(code, `${id}-res`)}
            copied={copiedCode === `${id}-res`}
          />
        </div>
      </div>
    </Card>
  );
}

function SDKMethod({
  name,
  description,
  code,
  copyCode,
  copiedCode,
  id
}: {
  name: string;
  description: string;
  code: string;
  copyCode: (code: string, id: string) => void;
  copiedCode: string | null;
  id: string;
}) {
  return (
    <Card className="p-4 bg-white border-gray-200">
      <h4 className="mb-2 font-mono text-sm font-semibold text-gray-900">{name}</h4>
      <p className="mb-3 text-sm text-gray-600">{description}</p>
      <CodeBlock
        code={code}
        language="typescript"
        onCopy={(code) => copyCode(code, id)}
        copied={copiedCode === id}
      />
    </Card>
  );
}

function CodeBlock({
  code,
  language,
  onCopy,
  copied
}: {
  code: string;
  language: string;
  onCopy: (code: string) => void;
  copied: boolean;
}) {
  return (
    <div className="relative">
      <pre className="overflow-x-auto rounded bg-gray-50 border border-gray-200 p-4 text-sm text-gray-800">
        <code className="text-sm">{code}</code>
      </pre>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-8 w-8 bg-white hover:bg-gray-100"
        onClick={() => onCopy(code)}
      >
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-gray-600" />}
      </Button>
    </div>
  );
}
