import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Link, useLocation } from 'wouter';
import { 
  Search,
  Book,
  Repeat,
  Globe,
  Shield,
  MessageSquare,
  DollarSign,
  HelpCircle,
  ChevronRight,
  Home,
  Zap,
  Lock,
  Key,
  Database,
  Terminal,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  Menu,
  X,
  ArrowUp,
  ExternalLink,
  Code,
  Bitcoin,
  Coins,
  Users,
  FileText,
  ArrowLeft,
  Info
} from 'lucide-react';

export default function Docs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('introduction');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [, setLocation] = useLocation();

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
      icon: Code,
      title: 'x402 Marketplace',
      description: 'Access premium AI/data services anonymously with any cryptocurrency',
      sectionId: 'x402-marketplace'
    },
    {
      icon: Repeat,
      title: 'Swap Guide',
      description: 'Learn how to swap cryptocurrencies anonymously',
      sectionId: 'anonymous-swaps'
    },
    {
      icon: Globe,
      title: 'Domain Guide',
      description: 'Purchase and manage domains with zero-knowledge privacy',
      sectionId: 'domain-purchase'
    },
    {
      icon: Shield,
      title: 'Zekta zkID',
      description: 'Create anonymous identities with zero-knowledge proofs',
      sectionId: 'zekta-zkid'
    },
    {
      icon: Terminal,
      title: 'x402 Integration',
      description: 'Integrate x402 protocol into your application',
      sectionId: 'x402-integration'
    },
    {
      icon: HelpCircle,
      title: 'FAQ',
      description: 'Common questions and answers',
      sectionId: 'faq'
    }
  ];

  const allSidebarSections = [
    { id: 'introduction', label: 'Introduction', icon: Home },
    { id: 'quick-start', label: 'Quick Start', icon: Zap },
    { id: 'zekta-zkid', label: 'Zekta zkID', icon: Shield },
    { id: 'zkid-create', label: 'Creating an Identity', icon: Key },
    { id: 'zkid-authentication', label: 'ZK Authentication', icon: Lock },
    { id: 'zkid-best-practices', label: 'zkID Best Practices', icon: CheckCircle2 },
    { id: 'x402-marketplace', label: 'x402 Marketplace', icon: Code },
    { id: 'x402-services', label: 'Available Services', icon: Database },
    { id: 'x402-payments', label: 'x402 Payments & Credits', icon: DollarSign },
    { id: 'x402-playground', label: 'Using the Playground', icon: Terminal },
    { id: 'x402scan-verification', label: 'Transaction Verification', icon: ExternalLink },
    { id: 'x402-integration', label: 'x402 Integration', icon: Code },
    { id: 'x402-sdk-setup', label: 'SDK Setup', icon: Terminal },
    { id: 'x402-api-reference', label: 'API Reference', icon: Book },
    { id: 'anonymous-swaps', label: 'Anonymous Swaps', icon: Repeat },
    { id: 'supported-cryptocurrencies', label: 'Supported Cryptocurrencies', icon: Database },
    { id: 'domain-purchase', label: 'Domain Purchase', icon: Globe },
    { id: 'supported-tlds', label: 'Supported TLDs', icon: Globe },
    { id: 'dns-management', label: 'DNS Management', icon: Terminal },
    { id: 'my-domains', label: 'My Domains', icon: Key },
    { id: 'telegram-bot', label: 'Telegram Bot', icon: MessageSquare },
    { id: 'revenue-distribution', label: 'Revenue Distribution', icon: DollarSign },
    { id: 'security-privacy', label: 'Security & Privacy', icon: Shield },
    { id: 'platform-limitations', label: 'Platform Limitations', icon: Lock },
    { id: 'track-orders', label: 'Track Orders', icon: Search },
    { id: 'order-status-reference', label: 'Order Status Reference', icon: CheckCircle2 },
    { id: 'troubleshooting', label: 'Troubleshooting', icon: AlertCircle },
    { id: 'best-practices', label: 'Best Practices', icon: CheckCircle2 },
    { id: 'backup-recovery', label: 'Backup & Recovery', icon: Lock },
    { id: 'use-cases', label: 'Use Cases', icon: Book },
    { id: 'glossary', label: 'Glossary', icon: Book },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'coming-soon', label: 'Coming Soon', icon: Zap },
    { id: 'contact-support', label: 'Contact & Support', icon: MessageSquare },
    { id: 'changelog', label: 'Changelog', icon: FileText }
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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Clean Documentation Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity" data-testid="link-home">
                <img src="/logo.png" alt="Zekta Logo" className="w-10 h-10" />
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent tracking-tight">
                  ZEKTA
                </span>
              </Link>
              <div className="hidden md:flex items-center gap-2">
                <div className="h-6 w-px bg-gray-300"></div>
                <span className="text-sm font-medium text-gray-600">Documentation</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm" className="text-gray-700" data-testid="button-back-home">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-20 left-4 z-50 lg:hidden bg-white shadow-md border border-gray-200"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        data-testid="button-sidebar-toggle"
      >
        {sidebarOpen ? <X className="h-5 w-5 text-gray-700" /> : <Menu className="h-5 w-5 text-gray-700" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto z-40 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Documentation</h2>
          <nav className="space-y-1">
            {sidebarSections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors text-left ${
                  activeSection === section.id 
                    ? 'bg-blue-50 text-blue-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                data-testid={`nav-${section.id}`}
              >
                <section.icon className="h-4 w-4 flex-shrink-0" />
                <span>{section.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 border-b border-gray-200 -mt-16 pt-16">
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />
          <div className="relative max-w-4xl mx-auto px-6 py-16 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Zekta Documentation
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Complete guide to x402 marketplace, anonymous swaps, zero-knowledge domains, and privacy-first services
            </p>
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-base text-gray-900 bg-white border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-400"
                data-testid="input-search-docs"
              />
            </div>
          </div>
        </section>

        {/* Quick Access Cards */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickAccessCards.map((card, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white border-gray-200 hover:border-blue-300"
                onClick={() => scrollToSection(card.sectionId)}
                data-testid={`card-${card.sectionId}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <card.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{card.title}</h3>
                    <p className="text-sm text-gray-600">{card.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Content Sections */}
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-16 pb-24">
          
          {/* INTRODUCTION */}
          <section id="introduction" data-section="introduction" className="scroll-mt-28">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Introduction</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">What is Zekta?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Zekta is a privacy-focused blockchain platform that enables truly anonymous cryptocurrency swaps and domain purchases. 
                  Using zero-knowledge proofs and decentralized infrastructure, Zekta allows you to interact with blockchain applications 
                  without revealing your identity, wallet addresses, or transaction history.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Core Principles
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-blue-800">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span><strong>Privacy-First:</strong> Your identity and transaction data remain completely private</span>
                  </li>
                  <li className="flex items-start gap-2 text-blue-800">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span><strong>No KYC Required:</strong> No email, phone number, or personal information needed</span>
                  </li>
                  <li className="flex items-start gap-2 text-blue-800">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span><strong>No Wallet Connection:</strong> Use cryptocurrency addresses directly, no MetaMask or wallet signatures required</span>
                  </li>
                  <li className="flex items-start gap-2 text-blue-800">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span><strong>Zero-Knowledge Architecture:</strong> Cryptographic proofs ensure security without revealing secrets</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Why It Matters</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  In traditional crypto platforms, every transaction is publicly visible and tied to your wallet address. 
                  This creates a permanent, traceable record of your financial activities. Zekta breaks this chain by enabling:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-gray-700">
                    <ChevronRight className="h-5 w-5 flex-shrink-0 mt-0.5 text-blue-600" />
                    <span>Anonymous cryptocurrency swaps across 9 blockchain networks</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <ChevronRight className="h-5 w-5 flex-shrink-0 mt-0.5 text-blue-600" />
                    <span>Private domain registration with no identity linkage</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <ChevronRight className="h-5 w-5 flex-shrink-0 mt-0.5 text-blue-600" />
                    <span>Zero-knowledge DNS management using cryptographic secrets</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <ChevronRight className="h-5 w-5 flex-shrink-0 mt-0.5 text-blue-600" />
                    <span>Conversational swaps via Telegram bot</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Key Differentiators</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4 bg-white border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">True Anonymity</h4>
                    <p className="text-sm text-gray-600">
                      Unlike mixers or tumblers, Zekta uses zero-knowledge proofs to mathematically guarantee privacy without trusted intermediaries.
                    </p>
                  </Card>
                  <Card className="p-4 bg-white border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">No Account System</h4>
                    <p className="text-sm text-gray-600">
                      No usernames, passwords, or account recovery. Your cryptographic secrets are the only keys to your domains and actions.
                    </p>
                  </Card>
                  <Card className="p-4 bg-white border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Multi-Chain Support</h4>
                    <p className="text-sm text-gray-600">
                      Swap between SOL, BTC, ETH, USDT, USDC, BNB, MATIC, AVAX, and ZEC with consistent privacy guarantees.
                    </p>
                  </Card>
                  <Card className="p-4 bg-white border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Provable Security</h4>
                    <p className="text-sm text-gray-600">
                      Based on Semaphore Protocol, battle-tested cryptography used by Ethereum Foundation and privacy-focused projects worldwide.
                    </p>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* QUICK START */}
          <section id="quick-start" data-section="quick-start" className="scroll-mt-28">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Quick Start</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Your First Swap (3 Minutes)</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">1</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Visit Swap Page</h4>
                      <p className="text-gray-600">Go to the homepage and find the swap interface. No registration needed.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">2</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Select Cryptocurrencies</h4>
                      <p className="text-gray-600">Choose what you want to send (e.g., BTC) and what you want to receive (e.g., SOL).</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">3</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Enter Destination Address</h4>
                      <p className="text-gray-600">Provide the wallet address where you want to receive your swapped cryptocurrency.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">4</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Send Cryptocurrency</h4>
                      <p className="text-gray-600">You'll receive a unique deposit address. Send your crypto there and wait for confirmation.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">5</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Receive Your Swap</h4>
                      <p className="text-gray-600">Your swapped cryptocurrency will arrive at your destination address within minutes.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Your First Domain Purchase (5 Minutes)</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold">1</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Visit Buy Domain Page</h4>
                      <p className="text-gray-600">Navigate to <code className="px-2 py-1 bg-gray-100 rounded text-sm">/buy-domain</code> to start.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold">2</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Search for Domain</h4>
                      <p className="text-gray-600">Enter your desired domain name and select from 300+ TLDs (.com, .org, .ai, .io, etc.).</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold">3</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Choose Payment Cryptocurrency</h4>
                      <p className="text-gray-600">Pay with any of our 9 supported cryptocurrencies. Real-time pricing displayed.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold">4</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Complete Payment</h4>
                      <p className="text-gray-600">Send cryptocurrency to the provided address. Track order status in real-time.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold">5</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                        Save Your Domain Secret
                        <Badge variant="destructive" className="text-xs">CRITICAL</Badge>
                      </h4>
                      <p className="text-gray-600 mb-2">After payment confirmation, you'll receive a <strong>domain secret</strong> (long number sequence).</p>
                      <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-800">
                        <strong>⚠️ WARNING:</strong> This secret CANNOT be recovered if lost. Write it down and store it securely. 
                        You need it to manage DNS records.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">💡 Pro Tips for Beginners</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5 text-green-600" />
                    <span>Start with a small test swap to familiarize yourself with the process</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5 text-green-600" />
                    <span>Always double-check destination addresses before confirming swaps</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5 text-green-600" />
                    <span>Save your order IDs and domain secrets in a password manager</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5 text-green-600" />
                    <span>Use the Track Orders page to monitor swap and domain order status</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* ZEKTA ZKID */}
          <section id="zekta-zkid" data-section="zekta-zkid" className="scroll-mt-28">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Zekta zkID</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">What is Zekta zkID?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Zekta zkID is a zero-knowledge identity system built on Semaphore Protocol v4.13.1. It enables completely anonymous 
                  authentication and actions without revealing your identity, using cutting-edge cryptographic proofs instead of 
                  usernames, passwords, or wallet signatures.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
                <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Core Capabilities
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-purple-800">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <span><strong>Anonymous Login:</strong> Prove you're a member without revealing who you are</span>
                      </li>
                      <li className="flex items-start gap-2 text-purple-800">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <span><strong>No Personal Data:</strong> No email, phone, name, or KYC required</span>
                      </li>
                      <li className="flex items-start gap-2 text-purple-800">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <span><strong>Cryptographic Security:</strong> Based on Baby JubJub curve and Poseidon hash</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-purple-800">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <span><strong>Client-Side Generation:</strong> Identity created in your browser, never sent to server</span>
                      </li>
                      <li className="flex items-start gap-2 text-purple-800">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <span><strong>Tamper-Proof:</strong> Cannot be forged, duplicated, or stolen</span>
                      </li>
                      <li className="flex items-start gap-2 text-purple-800">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <span><strong>Self-Sovereign:</strong> You control your identity, no central authority</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">How zkID Works</h3>
                <p className="text-gray-700 mb-4">
                  Your zkID consists of three components generated from cryptographic randomness:
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="p-4 bg-white border-purple-200">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Key className="h-5 w-5 text-purple-600" />
                      Trapdoor
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Your secret key. A large random number (256-bit) that you must store securely.
                    </p>
                    <Badge variant="destructive" className="text-xs">NEVER SHARE</Badge>
                  </Card>
                  <Card className="p-4 bg-white border-purple-200">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Lock className="h-5 w-5 text-purple-600" />
                      Nullifier
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Another secret (256-bit) used to prevent double-actions. Keeps actions unlinkable.
                    </p>
                    <Badge variant="destructive" className="text-xs">NEVER SHARE</Badge>
                  </Card>
                  <Card className="p-4 bg-white border-purple-200">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Users className="h-5 w-5 text-green-600" />
                      Commitment
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Your public identifier. A hash of trapdoor + nullifier. Safe to share publicly.
                    </p>
                    <Badge variant="outline" className="text-xs border-green-500 text-green-700">PUBLIC</Badge>
                  </Card>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-semibold text-blue-900 mb-3">Use Cases for zkID</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-semibold text-blue-900 mb-2">Current:</h5>
                    <ul className="space-y-1 text-blue-800">
                      <li>• x402 Marketplace authentication</li>
                      <li>• Anonymous domain management</li>
                      <li>• Private gift card purchases</li>
                      <li>• Anonymous Twitter posting</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-blue-900 mb-2">Coming Soon:</h5>
                    <ul className="space-y-1 text-blue-800">
                      <li>• DAO voting (prove membership, hide identity)</li>
                      <li>• Anonymous surveys and polls</li>
                      <li>• Private messaging with group verification</li>
                      <li>• Reputation systems without doxxing</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button asChild className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Link href="/x402">Create Your zkID</Link>
                </Button>
              </div>
            </div>
          </section>

          {/* CREATING AN IDENTITY */}
          <section id="zkid-create" data-section="zkid-create" className="scroll-mt-28">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Creating an Identity</h2>
            
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                Creating your Zekta zkID is simple and happens entirely in your browser. No data is sent to any server during generation.
              </p>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Step-by-Step Guide</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold">1</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Visit x402 Marketplace</h4>
                      <p className="text-gray-600">Navigate to <code className="px-2 py-1 bg-gray-100 rounded text-sm">/x402</code> on Zekta platform.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold">2</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Click "Create Identity"</h4>
                      <p className="text-gray-600">Your browser generates cryptographically secure random values for trapdoor and nullifier.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold">3</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                        Save Your Trapdoor
                        <Badge variant="destructive" className="text-xs">CRITICAL</Badge>
                      </h4>
                      <p className="text-gray-600 mb-2">You'll see a long number sequence - this is your trapdoor (secret key).</p>
                      <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-800">
                        <strong>⚠️ WARNING:</strong> This cannot be recovered if lost. Write it down, store in password manager, or download the backup file.
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold">4</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Identity Created!</h4>
                      <p className="text-gray-600">Your commitment is registered. You can now use x402 services anonymously.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Example Identity</h4>
                <div className="space-y-3 text-sm font-mono">
                  <div>
                    <p className="text-gray-600 mb-1"><strong>Trapdoor (secret):</strong></p>
                    <div className="bg-white border border-gray-200 rounded p-3 text-xs text-red-700 overflow-x-auto">
                      123456789012345678901234567890123456789012345678901234567890
                    </div>
                    <p className="text-xs text-gray-500 mt-1">🔒 Store this securely - never share</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1"><strong>Nullifier (secret):</strong></p>
                    <div className="bg-white border border-gray-200 rounded p-3 text-xs text-red-700 overflow-x-auto">
                      987654321098765432109876543210987654321098765432109876543210
                    </div>
                    <p className="text-xs text-gray-500 mt-1">🔒 Store this securely - never share</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1"><strong>Commitment (public):</strong></p>
                    <div className="bg-white border border-gray-200 rounded p-3 text-xs text-green-700 overflow-x-auto">
                      0x2f7a8b9c1d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9
                    </div>
                    <p className="text-xs text-gray-500 mt-1">✅ This is your public identifier - safe to share</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Backup Options</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="p-4 bg-white border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      Download File
                    </h4>
                    <p className="text-sm text-gray-600">
                      Save as JSON file with trapdoor and nullifier. Store in encrypted drive.
                    </p>
                  </Card>
                  <Card className="p-4 bg-white border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Key className="h-5 w-5 text-green-600" />
                      Password Manager
                    </h4>
                    <p className="text-sm text-gray-600">
                      Copy trapdoor to 1Password, Bitwarden, or LastPass as secure note.
                    </p>
                  </Card>
                  <Card className="p-4 bg-white border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Lock className="h-5 w-5 text-purple-600" />
                      Physical Backup
                    </h4>
                    <p className="text-sm text-gray-600">
                      Write on paper, store in safe. Useful for high-security scenarios.
                    </p>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* ZK AUTHENTICATION */}
          <section id="zkid-authentication" data-section="zkid-authentication" className="scroll-mt-28">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">ZK Authentication</h2>
            
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                Zero-knowledge authentication allows you to prove membership in a group (e.g., "I'm a registered user") 
                without revealing which specific member you are. This is the foundation of Zekta's privacy guarantees.
              </p>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">How Authentication Works</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">1</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Request Login</h4>
                      <p className="text-gray-600">You want to access x402 marketplace. Click "Login with zkID".</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">2</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Enter Trapdoor</h4>
                      <p className="text-gray-600">Provide your secret trapdoor (either manually or from browser storage).</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">3</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Generate Proof</h4>
                      <p className="text-gray-600">Your browser creates a zero-knowledge proof: "I know a secret that's in the registered members group."</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">4</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Server Verifies</h4>
                      <p className="text-gray-600">Server checks: "This proof is valid and matches our member group" - without knowing WHO you are.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">5</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Session Created</h4>
                      <p className="text-gray-600">You're logged in anonymously. Server only knows your commitment (public ID), not your secrets.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
                <h4 className="font-semibold text-green-900 mb-3">Privacy Guarantees</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-semibold text-green-900 mb-2">What Server Knows:</h5>
                    <ul className="space-y-1 text-green-800">
                      <li>✅ You're a valid member</li>
                      <li>✅ Your public commitment ID</li>
                      <li>✅ Timestamp of login</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-green-900 mb-2">What Server Doesn't Know:</h5>
                    <ul className="space-y-1 text-green-800">
                      <li>🔒 Your trapdoor (secret key)</li>
                      <li>🔒 Your nullifier (secret)</li>
                      <li>🔒 Which specific member you are</li>
                      <li>🔒 Your wallet address or payment source</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Session Management</h3>
                <p className="text-gray-700 mb-4">
                  After successful authentication, you receive a session token (JWT) valid for 7 days:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-gray-700">
                    <ChevronRight className="h-5 w-5 flex-shrink-0 mt-0.5 text-blue-600" />
                    <span><strong>Auto-logout:</strong> Sessions expire after 7 days for security</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <ChevronRight className="h-5 w-5 flex-shrink-0 mt-0.5 text-blue-600" />
                    <span><strong>Multiple devices:</strong> You can login from different browsers/devices simultaneously</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <ChevronRight className="h-5 w-5 flex-shrink-0 mt-0.5 text-blue-600" />
                    <span><strong>Persistent data:</strong> Your credits and purchase history persist across sessions</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <ChevronRight className="h-5 w-5 flex-shrink-0 mt-0.5 text-blue-600" />
                    <span><strong>Manual logout:</strong> Clear session anytime from dashboard</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* ZKID BEST PRACTICES */}
          <section id="zkid-best-practices" data-section="zkid-best-practices" className="scroll-mt-28">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">zkID Best Practices</h2>
            
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h4 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Security Guidelines
                </h4>
                <ul className="space-y-2 text-sm text-yellow-800">
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span><strong>Never share your trapdoor:</strong> Anyone with your trapdoor can access your zkID and impersonate you</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span><strong>Multiple backups:</strong> Store trapdoor in 2-3 different secure locations (password manager + physical backup)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span><strong>Test recovery:</strong> Before adding significant credits, test that you can restore your identity from backup</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span><strong>Avoid screenshots:</strong> Don't screenshot your trapdoor - text backups are safer</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Recommended Storage Solutions</h3>
                <div className="space-y-3">
                  <Card className="p-4 bg-white border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">Password Manager</h4>
                      <Badge className="bg-green-100 text-green-700 border-green-300">Recommended</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Store as secure note in 1Password, Bitwarden, LastPass, or Dashlane. Encrypted, synced, accessible.
                    </p>
                    <p className="text-xs text-green-700">✅ Best for most users</p>
                  </Card>

                  <Card className="p-4 bg-white border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">Encrypted USB Drive</h4>
                      <Badge className="bg-blue-100 text-blue-700 border-blue-300">High Security</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Save JSON backup file to encrypted USB (e.g., BitLocker, FileVault). Store offline.
                    </p>
                    <p className="text-xs text-blue-700">✅ Good for high-value accounts</p>
                  </Card>

                  <Card className="p-4 bg-white border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">Physical Paper Backup</h4>
                      <Badge className="bg-purple-100 text-purple-700 border-purple-300">Maximum Security</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Write trapdoor on paper, store in fireproof safe or safety deposit box. Offline, unhackable.
                    </p>
                    <p className="text-xs text-purple-700">✅ Ultimate security, slower access</p>
                  </Card>

                  <Card className="p-4 bg-red-50 border-red-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-red-900">Browser Storage Only</h4>
                      <Badge variant="destructive">Not Recommended</Badge>
                    </div>
                    <p className="text-sm text-red-800 mb-2">
                      Relying only on browser localStorage is risky - clearing cookies or browser data will lose your identity permanently.
                    </p>
                    <p className="text-xs text-red-700">❌ Always create additional backups</p>
                  </Card>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">💡 Pro Tips</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5 text-green-600" />
                    <span><strong>Label your backups:</strong> Name them clearly (e.g., "Zekta zkID - Created Oct 2025")</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5 text-green-600" />
                    <span><strong>Test small first:</strong> Before adding large amounts of crypto, test with $5-10</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5 text-green-600" />
                    <span><strong>Separate identities:</strong> Consider different zkIDs for different use cases (marketplace vs domains)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5 text-green-600" />
                    <span><strong>Recovery drill:</strong> Periodically test that you can restore from backup</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* X402 INTEGRATION */}
          <section id="x402-integration" data-section="x402-integration" className="scroll-mt-28">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">x402 Integration</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">For Developers</h3>
                <p className="text-gray-700 leading-relaxed">
                  Integrate x402 protocol into your own applications to accept anonymous payments and provide services 
                  through Zekta's privacy-first marketplace. Perfect for AI APIs, data services, or any pay-per-use offering.
                </p>
              </div>

              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg p-6">
                <h4 className="font-semibold text-cyan-900 mb-3 flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Why Integrate x402?
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-cyan-800">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <span><strong>Anonymous Users:</strong> No KYC, email signup, or user management needed</span>
                      </li>
                      <li className="flex items-start gap-2 text-cyan-800">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <span><strong>Instant Payments:</strong> Get paid in USDC on Base network automatically</span>
                      </li>
                      <li className="flex items-start gap-2 text-cyan-800">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <span><strong>No Payment Processing:</strong> x402 facilitators handle all crypto conversions</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-cyan-800">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <span><strong>Marketplace Exposure:</strong> Listed on Zekta + x402index.com</span>
                      </li>
                      <li className="flex items-start gap-2 text-cyan-800">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <span><strong>Multi-Crypto Support:</strong> Users can pay with 8+ cryptocurrencies</span>
                      </li>
                      <li className="flex items-start gap-2 text-cyan-800">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <span><strong>Simple HTTP API:</strong> Just return 402 status code with payment details</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Integration Overview</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center font-semibold">1</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Client Requests Service</h4>
                      <p className="text-gray-600">User calls your API endpoint (e.g., POST /ai/generate)</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center font-semibold">2</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Return 402 Payment Required</h4>
                      <p className="text-gray-600">Your server responds with HTTP 402 + payment requirements (amount, recipient, facilitator)</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center font-semibold">3</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Client Pays via x402</h4>
                      <p className="text-gray-600">Zekta operator creates ERC-3009 signature and submits to facilitator</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center font-semibold">4</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Payment Verified</h4>
                      <p className="text-gray-600">Facilitator verifies payment and returns proof to client</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center font-semibold">5</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Service Executed</h4>
                      <p className="text-gray-600">Client retries request with payment proof - you verify and return service response</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Example: 402 Response</h4>
                <pre className="bg-gray-900 text-gray-100 rounded p-4 overflow-x-auto text-xs font-mono">
{`HTTP/1.1 402 Payment Required
Content-Type: application/json

{
  "x402Version": 1,
  "accepts": [{
    "token": "USDC",
    "network": "base",
    "maxAmountRequired": "30000",
    "recipient": "0xYourWalletAddress...",
    "facilitator": "https://x402.org/facilitator"
  }]
}`}
                </pre>
              </div>

              <div className="flex gap-3">
                <Button asChild variant="outline" className="gap-2">
                  <a href="https://x402.org/docs" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    x402 Protocol Docs
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/blog/x402-documentation">Read Technical Guide</Link>
                </Button>
              </div>
            </div>
          </section>

          {/* SDK SETUP */}
          <section id="x402-sdk-setup" data-section="x402-sdk-setup" className="scroll-mt-28">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">SDK Setup</h2>
            
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                Use the official x402 SDK (@coinbase/x402) to handle payment verification and facilitator communication.
              </p>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Installation</h3>
                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 rounded p-4 overflow-x-auto text-sm font-mono">
npm install @coinbase/x402 ethers@6
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 h-8 w-8 p-0"
                    onClick={() => copyToClipboard('npm install @coinbase/x402 ethers@6', 'sdk-install')}
                    data-testid="button-copy-sdk-install"
                  >
                    {copiedCode === 'sdk-install' ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Basic Server Example</h3>
                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 rounded p-4 overflow-x-auto text-xs font-mono">
{`import express from 'express';
import { Wallet } from 'ethers';

const app = express();
const RECIPIENT_WALLET = '0xYourWallet...';

app.post('/ai/generate', async (req, res) => {
  const { prompt, paymentProof } = req.body;

  // No payment proof? Return 402
  if (!paymentProof) {
    return res.status(402).json({
      x402Version: 1,
      accepts: [{
        token: "USDC",
        network: "base",
        maxAmountRequired: "30000", // 0.03 USDC
        recipient: RECIPIENT_WALLET,
        facilitator: "https://x402.org/facilitator"
      }]
    });
  }

  // Verify payment proof here
  // (See API Reference section)

  // Payment verified - execute service
  const response = await callOpenAI(prompt);
  res.json({ result: response });
});

app.listen(3000);`}
                  </pre>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-semibold text-blue-900 mb-3">Environment Variables</h4>
                <div className="space-y-2 text-sm font-mono">
                  <div>
                    <p className="text-blue-800"><strong>RECIPIENT_WALLET=</strong>0xYour...Address</p>
                    <p className="text-xs text-blue-600">Your Base network wallet to receive USDC</p>
                  </div>
                  <div>
                    <p className="text-blue-800"><strong>FACILITATOR_URL=</strong>https://x402.org/facilitator</p>
                    <p className="text-xs text-blue-600">CDP facilitator for payment verification</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* API REFERENCE */}
          <section id="x402-api-reference" data-section="x402-api-reference" className="scroll-mt-28">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">API Reference</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Payment Requirements Schema</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Field</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3 text-sm font-mono text-gray-700">x402Version</td>
                        <td className="px-4 py-3 text-sm text-gray-600">number</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Protocol version (always 1)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-mono text-gray-700">accepts</td>
                        <td className="px-4 py-3 text-sm text-gray-600">array</td>
                        <td className="px-4 py-3 text-sm text-gray-600">List of accepted payment methods</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-mono text-gray-700">accepts[].token</td>
                        <td className="px-4 py-3 text-sm text-gray-600">string</td>
                        <td className="px-4 py-3 text-sm text-gray-600">"USDC" (only supported token)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-mono text-gray-700">accepts[].network</td>
                        <td className="px-4 py-3 text-sm text-gray-600">string</td>
                        <td className="px-4 py-3 text-sm text-gray-600">"base" or "base-sepolia"</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-mono text-gray-700">accepts[].maxAmountRequired</td>
                        <td className="px-4 py-3 text-sm text-gray-600">string</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Amount in smallest unit (e.g., "30000" = $0.03)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-mono text-gray-700">accepts[].recipient</td>
                        <td className="px-4 py-3 text-sm text-gray-600">string</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Your Base wallet address (0x...)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-mono text-gray-700">accepts[].facilitator</td>
                        <td className="px-4 py-3 text-sm text-gray-600">string</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Facilitator URL (e.g., CDP)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Common Price Examples</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="p-4 bg-white border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">AI Model Call</h4>
                    <p className="text-sm text-gray-600 mb-2">OpenAI GPT-4o, Claude, Gemini</p>
                    <p className="text-sm font-mono text-blue-600">maxAmountRequired: "30000"</p>
                    <p className="text-xs text-gray-500 mt-1">= $0.03 USDC</p>
                  </Card>
                  <Card className="p-4 bg-white border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Web Scraping</h4>
                    <p className="text-sm text-gray-600 mb-2">Firecrawl single page</p>
                    <p className="text-sm font-mono text-blue-600">maxAmountRequired: "10000"</p>
                    <p className="text-xs text-gray-500 mt-1">= $0.01 USDC</p>
                  </Card>
                  <Card className="p-4 bg-white border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">IPFS Storage</h4>
                    <p className="text-sm text-gray-600 mb-2">Pinata 1GB/month</p>
                    <p className="text-sm font-mono text-blue-600">maxAmountRequired: "20000"</p>
                    <p className="text-xs text-gray-500 mt-1">= $0.02 USDC</p>
                  </Card>
                  <Card className="p-4 bg-white border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Custom Service</h4>
                    <p className="text-sm text-gray-600 mb-2">Your pricing</p>
                    <p className="text-sm font-mono text-blue-600">maxAmountRequired: "50000"</p>
                    <p className="text-xs text-gray-500 mt-1">= $0.05 USDC</p>
                  </Card>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">💡 Integration Tips</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5 text-green-600" />
                    <span><strong>Test on Sepolia first:</strong> Use base-sepolia network for development</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5 text-green-600" />
                    <span><strong>Register on x402index.com:</strong> Get your service listed for discovery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5 text-green-600" />
                    <span><strong>Keep prices competitive:</strong> x402 marketplace users compare prices across providers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5 text-green-600" />
                    <span><strong>Monitor facilitator health:</strong> CDP facilitator should respond in &lt;2 seconds</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button asChild className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700">
                  <a href="https://x402index.com" target="_blank" rel="noopener noreferrer">
                    Submit Your Service
                  </a>
                </Button>
                <Button asChild variant="outline" className="gap-2">
                  <a href="https://github.com/coinbase/x402" target="_blank" rel="noopener noreferrer">
                    <Code className="h-4 w-4" />
                    View on GitHub
                  </a>
                </Button>
              </div>
            </div>
          </section>

          {/* X402 MARKETPLACE */}
          <section id="x402-marketplace" data-section="x402-marketplace" className="scroll-mt-28">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">x402 Marketplace</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">What is x402 Marketplace?</h3>
                <p className="text-gray-700 leading-relaxed">
                  The x402 Marketplace is Zekta's privacy-first platform for accessing premium AI, data, and Web3 services anonymously. 
                  Using the x402 protocol and zero-knowledge authentication, you can use services like OpenAI GPT-4o, Claude, Gemini, 
                  Firecrawl, and more - all without KYC, email signup, or revealing your identity.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Key Features
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-blue-800">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <span><strong>Anonymous Access:</strong> No KYC, email, or personal information required</span>
                      </li>
                      <li className="flex items-start gap-2 text-blue-800">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <span><strong>Multi-Crypto Payments:</strong> Pay with SOL, BTC, ETH, BNB, MATIC, AVAX, ZEC, or ZEKTA</span>
                      </li>
                      <li className="flex items-start gap-2 text-blue-800">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <span><strong>Zero-Knowledge Auth:</strong> Powered by Semaphore Protocol for privacy</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-blue-800">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <span><strong>Instant Playground:</strong> Test services immediately with credits</span>
                      </li>
                      <li className="flex items-start gap-2 text-blue-800">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <span><strong>On-Chain Verification:</strong> View all payments on x402scan.com</span>
                      </li>
                      <li className="flex items-start gap-2 text-blue-800">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <span><strong>14+ Services:</strong> AI, data scraping, IPFS, blockchain APIs</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">How It Works</h3>
                <p className="text-gray-700 mb-4">
                  The x402 marketplace uses a two-stage payment architecture for maximum privacy and flexibility:
                </p>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold">1</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Create ZK Identity</h4>
                      <p className="text-gray-600">Generate a zero-knowledge identity in your browser. No personal info needed - just math.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold">2</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Add Credits</h4>
                      <p className="text-gray-600">Top up your account with any supported cryptocurrency. Automatic conversion to USDC for services.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold">3</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Browse Services</h4>
                      <p className="text-gray-600">Explore 14+ x402-compatible services - AI models, data APIs, Web3 services.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold">4</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Use Playground</h4>
                      <p className="text-gray-600">Try services instantly in the playground. Pay-per-use model with transparent pricing.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold">5</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Verify On-Chain</h4>
                      <p className="text-gray-600">All x402 payments are recorded on Base network. View on x402scan.com for transparency.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h4 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Privacy Guarantee
                </h4>
                <p className="text-yellow-800 text-sm">
                  Your ZK identity commitment is the only identifier stored. We never see your wallet address, payment source, 
                  or personal information. The x402 protocol ensures service providers only receive payment, not your identity.
                </p>
              </div>

              <div className="flex gap-3">
                <Button asChild className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                  <Link href="/x402">Try x402 Marketplace</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/blog/x402-documentation">Read Technical Docs</Link>
                </Button>
              </div>
            </div>
          </section>

          {/* X402 AVAILABLE SERVICES */}
          <section id="x402-services" data-section="x402-services" className="scroll-mt-28">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Available Services</h2>
            
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                The x402 marketplace offers 14+ premium services across AI, data, and Web3 categories. 
                All services are x402-protocol compatible and can be accessed anonymously.
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Code className="h-6 w-6 text-blue-600" />
                    AI / Text Generation
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="p-4 bg-white border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-2">OpenAI GPT-4o</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Latest GPT-4o model with vision, reasoning, and function calling. $0.03/call.
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Badge variant="secondary" className="text-xs">Most Popular</Badge>
                        <span>• Daydreams Router</span>
                      </div>
                    </Card>
                    <Card className="p-4 bg-white border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-2">Anthropic Claude 3.5 Sonnet</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Advanced reasoning, long context windows, coding assistance. $0.04/call.
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Badge variant="secondary" className="text-xs">High Quality</Badge>
                        <span>• Daydreams Router</span>
                      </div>
                    </Card>
                    <Card className="p-4 bg-white border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-2">Google Gemini 1.5 Pro</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        1M token context, multimodal input, fast responses. $0.03/call.
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Badge variant="secondary" className="text-xs">Long Context</Badge>
                        <span>• Daydreams Router</span>
                      </div>
                    </Card>
                    <Card className="p-4 bg-white border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-2">OpenAI o3-mini</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Reasoning-focused model, multi-step problem solving. $0.02/call.
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Badge variant="secondary" className="text-xs">Budget</Badge>
                        <span>• Daydreams Router</span>
                      </div>
                    </Card>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Database className="h-6 w-6 text-green-600" />
                    Data & Web Scraping
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="p-4 bg-white border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-2">Firecrawl Web Scraper</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Extract clean markdown from any webpage, handle JavaScript rendering. $0.01/page.
                      </p>
                      <div className="text-xs text-gray-500">Mendable.ai Provider</div>
                    </Card>
                    <Card className="p-4 bg-white border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-2">Web Search API</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Real-time web search results, filtered by date and relevance. $0.005/query.
                      </p>
                      <div className="text-xs text-gray-500">Multiple Providers</div>
                    </Card>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Globe className="h-6 w-6 text-purple-600" />
                    Web3 & Blockchain
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="p-4 bg-white border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-2">Pinata IPFS Storage</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Decentralized file storage on IPFS with guaranteed availability. $0.02/GB/month.
                      </p>
                      <div className="text-xs text-gray-500">Pinata Cloud</div>
                    </Card>
                    <Card className="p-4 bg-white border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-2">Blockchain RPC Nodes</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        High-performance RPC access to Ethereum, Solana, Polygon. $0.01/1000 requests.
                      </p>
                      <div className="text-xs text-gray-500">Alchemy, QuickNode</div>
                    </Card>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">💡 Service Discovery</h4>
                <p className="text-sm text-gray-700 mb-3">
                  New x402-compatible services are added regularly. The marketplace automatically discovers services 
                  from x402index.com and displays them sorted by popularity.
                </p>
                <p className="text-sm text-gray-700">
                  Can't find a service? Services are pulled from the x402 protocol registry. Any x402-compatible 
                  service can be accessed through Zekta's marketplace.
                </p>
              </div>
            </div>
          </section>

          {/* X402 PAYMENTS & CREDITS */}
          <section id="x402-payments" data-section="x402-payments" className="scroll-mt-28">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">x402 Payments & Credits</h2>
            
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                The x402 marketplace uses a credit-based system for maximum privacy and flexibility. 
                Top up with any supported cryptocurrency, use credits for any service.
              </p>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">How Credits Work</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">1</div>
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">Top Up with Crypto</h4>
                        <p className="text-blue-800 text-sm">
                          Send SOL, BTC, ETH, BNB, MATIC, AVAX, ZEC, or ZEKTA to your unique deposit address. 
                          Minimum $5 equivalent.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">2</div>
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">Automatic Conversion</h4>
                        <p className="text-blue-800 text-sm">
                          Your crypto is swapped to USDC on Base network via zkSwap. Operator wallet handles conversions.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">3</div>
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">Credits Added</h4>
                        <p className="text-blue-800 text-sm">
                          Your account is credited in USD. $10 of BTC = $10 credits. Use for any service.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">4</div>
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">Pay-Per-Use</h4>
                        <p className="text-blue-800 text-sm">
                          Each service call deducts credits. OpenAI GPT-4o = $0.03, Claude = $0.04, etc.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Supported Cryptocurrencies</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="p-4 bg-white border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Bitcoin className="h-6 w-6 text-orange-500" />
                      <h4 className="font-semibold text-gray-900">Bitcoin (BTC)</h4>
                    </div>
                    <p className="text-sm text-gray-600">Min: $5 • Conf: ~10 mins</p>
                  </Card>
                  <Card className="p-4 bg-white border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Coins className="h-6 w-6 text-blue-500" />
                      <h4 className="font-semibold text-gray-900">Ethereum (ETH)</h4>
                    </div>
                    <p className="text-sm text-gray-600">Min: $5 • Conf: ~2 mins</p>
                  </Card>
                  <Card className="p-4 bg-white border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Coins className="h-6 w-6 text-purple-500" />
                      <h4 className="font-semibold text-gray-900">Solana (SOL)</h4>
                    </div>
                    <p className="text-sm text-gray-600">Min: $5 • Conf: ~30 secs</p>
                  </Card>
                  <Card className="p-4 bg-white border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Coins className="h-6 w-6 text-green-500" />
                      <h4 className="font-semibold text-gray-900">USDC / USDT</h4>
                    </div>
                    <p className="text-sm text-gray-600">Min: $5 • Conf: ~2 mins</p>
                  </Card>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  Also supported: BNB, MATIC, AVAX, ZEC, ZEKTA
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Credit Balance & History</h3>
                <p className="text-gray-700 mb-4">
                  Your credit balance and transaction history are viewable in your dashboard:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-gray-700">
                    <ChevronRight className="h-5 w-5 flex-shrink-0 mt-0.5 text-blue-600" />
                    <span><strong>Current Balance:</strong> See available credits in USD</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <ChevronRight className="h-5 w-5 flex-shrink-0 mt-0.5 text-blue-600" />
                    <span><strong>Top-up History:</strong> Track all crypto deposits and conversions</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <ChevronRight className="h-5 w-5 flex-shrink-0 mt-0.5 text-blue-600" />
                    <span><strong>Purchase Logs:</strong> View every service call with pricing and timestamps</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <ChevronRight className="h-5 w-5 flex-shrink-0 mt-0.5 text-blue-600" />
                    <span><strong>x402 Transactions:</strong> On-chain verification links for all payments</span>
                  </li>
                </ul>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h4 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Important Notes
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2 text-red-800">
                    <span>•</span>
                    <span><strong>Non-refundable:</strong> Credits cannot be withdrawn or converted back to cryptocurrency</span>
                  </li>
                  <li className="flex items-start gap-2 text-red-800">
                    <span>•</span>
                    <span><strong>Account-bound:</strong> Credits are tied to your ZK identity commitment</span>
                  </li>
                  <li className="flex items-start gap-2 text-red-800">
                    <span>•</span>
                    <span><strong>No expiry:</strong> Credits never expire, use them at your own pace</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* X402 PLAYGROUND */}
          <section id="x402-playground" data-section="x402-playground" className="scroll-mt-28">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Using the Playground</h2>
            
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                The x402 Playground lets you test services instantly without API integration. 
                Perfect for exploring AI models, testing prompts, or quick one-off tasks.
              </p>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">How to Use Playground</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold">1</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Select Service</h4>
                      <p className="text-gray-600">Browse services and click "Try in Playground" on any service card.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold">2</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Configure Request</h4>
                      <p className="text-gray-600">Enter your prompt, select model parameters (temperature, max tokens, etc.).</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold">3</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Review Cost</h4>
                      <p className="text-gray-600">See exact cost before calling. Example: "OpenAI GPT-4o - $0.03"</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold">4</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Execute</h4>
                      <p className="text-gray-600">Click "Generate" - credits are deducted and service is called via x402 protocol.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold">5</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">View Response</h4>
                      <p className="text-gray-600">Results appear in real-time. Copy, export, or start a new request.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Example: Using OpenAI GPT-4o</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600 mb-2"><strong>Step 1:</strong> Navigate to Playground → Select "OpenAI GPT-4o"</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-2"><strong>Step 2:</strong> Enter prompt:</p>
                    <div className="bg-white border border-gray-200 rounded p-3 font-mono text-xs text-gray-800">
                      "Write a Python function to calculate Fibonacci sequence"
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-2"><strong>Step 3:</strong> Set parameters:</p>
                    <ul className="text-gray-600 ml-4">
                      <li>• Model: gpt-4o</li>
                      <li>• Temperature: 0.7</li>
                      <li>• Max Tokens: 500</li>
                      <li>• Cost: $0.03</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-2"><strong>Step 4:</strong> Click "Generate" - Response arrives in ~3 seconds</p>
                  </div>
                  <div>
                    <p className="text-gray-600"><strong>Step 5:</strong> View x402 transaction on x402scan.com for verification</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Playground Features</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="p-4 bg-white border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Terminal className="h-5 w-5 text-blue-600" />
                      Request History
                    </h4>
                    <p className="text-sm text-gray-600">
                      All playground requests are logged. View past prompts, responses, and costs in History tab.
                    </p>
                  </Card>
                  <Card className="p-4 bg-white border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Copy className="h-5 w-5 text-green-600" />
                      Export Results
                    </h4>
                    <p className="text-sm text-gray-600">
                      Copy responses to clipboard or export as JSON/Markdown for documentation.
                    </p>
                  </Card>
                  <Card className="p-4 bg-white border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Code className="h-5 w-5 text-purple-600" />
                      Syntax Highlighting
                    </h4>
                    <p className="text-sm text-gray-600">
                      Code responses are automatically highlighted with proper formatting and themes.
                    </p>
                  </Card>
                  <Card className="p-4 bg-white border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      Real-time Status
                    </h4>
                    <p className="text-sm text-gray-600">
                      See live status: "Creating order → Calling service → Receiving response → Completed"
                    </p>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* X402SCAN VERIFICATION */}
          <section id="x402scan-verification" data-section="x402scan-verification" className="scroll-mt-28">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Transaction Verification</h2>
            
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                All x402 payment settlements are recorded on-chain (Base network) and can be publicly verified for transparency. 
                Use x402scan.com to view payment details, service information, and on-chain proofs.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    What's Public
                  </h4>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-center gap-2">✅ Transaction hash</li>
                    <li className="flex items-center gap-2">✅ Payment amount (USDC)</li>
                    <li className="flex items-center gap-2">✅ Service provider address</li>
                    <li className="flex items-center gap-2">✅ Facilitator used (CDP/PayAI)</li>
                    <li className="flex items-center gap-2">✅ Timestamp & block number</li>
                  </ul>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                  <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    What's Private
                  </h4>
                  <ul className="space-y-2 text-sm text-green-800">
                    <li className="flex items-center gap-2">🔒 User identity (ZK commitment)</li>
                    <li className="flex items-center gap-2">🔒 User wallet address</li>
                    <li className="flex items-center gap-2">🔒 Request data (prompts)</li>
                    <li className="flex items-center gap-2">🔒 Response data (outputs)</li>
                    <li className="flex items-center gap-2">🔒 Credit balance</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">How to View Your Transactions</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">1</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Get Transaction Hash</h4>
                      <p className="text-gray-600">After a service purchase, find the x402 transaction hash in your purchase history.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">2</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Visit x402scan.com</h4>
                      <p className="text-gray-600">Navigate to <code className="px-2 py-1 bg-gray-100 rounded text-sm">x402scan.com/tx/0x...</code></p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">3</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">View Details</h4>
                      <p className="text-gray-600">See payment amount, service info, facilitator activity, and on-chain proof.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">x402scan vs Basescan</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Feature</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">x402scan.com</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">basescan.org</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700">x402-specific UI</td>
                        <td className="px-4 py-3 text-sm text-green-700">✅ Yes</td>
                        <td className="px-4 py-3 text-sm text-red-700">❌ No</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700">Service details</td>
                        <td className="px-4 py-3 text-sm text-green-700">✅ Full context</td>
                        <td className="px-4 py-3 text-sm text-red-700">❌ Raw transaction</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700">Facilitator info</td>
                        <td className="px-4 py-3 text-sm text-green-700">✅ Highlighted</td>
                        <td className="px-4 py-3 text-sm text-red-700">❌ Just addresses</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700">User-friendly</td>
                        <td className="px-4 py-3 text-sm text-green-700">✅ For x402 users</td>
                        <td className="px-4 py-3 text-sm text-yellow-700">⚠️ For blockchain devs</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  <strong>Recommendation:</strong> Use x402scan.com for better UX and x402-specific details. 
                  Use basescan.org for low-level blockchain verification.
                </p>
              </div>

              <div className="bg-gray-100 border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Use Cases for x402scan</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">For Users:</h5>
                    <ul className="space-y-1 text-gray-700">
                      <li>• Verify payment settlements</li>
                      <li>• Track purchase history</li>
                      <li>• Dispute resolution proof</li>
                      <li>• Transparency verification</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">For Developers:</h5>
                    <ul className="space-y-1 text-gray-700">
                      <li>• Debug x402 integration</li>
                      <li>• Monitor service activity</li>
                      <li>• Audit payment flows</li>
                      <li>• Analyze usage patterns</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button asChild variant="outline" className="gap-2">
                  <a href="https://x402scan.com" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Visit x402scan.com
                  </a>
                </Button>
                <Button asChild variant="outline" className="gap-2">
                  <a href="https://basescan.org" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Visit Basescan
                  </a>
                </Button>
              </div>
            </div>
          </section>

          {/* ANONYMOUS SWAPS */}
          <section id="anonymous-swaps" data-section="anonymous-swaps" className="scroll-mt-28">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Anonymous Swaps</h2>
            
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                Zekta enables completely anonymous cryptocurrency swaps across 9 blockchain networks. 
                No account required, no KYC, no wallet connection, just simple private swaps.
              </p>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">How to Create a Swap</h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm">1</div>
                    <div>
                      <p className="text-gray-700"><strong>Select currencies:</strong> Choose which cryptocurrency you're sending and which you want to receive.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm">2</div>
                    <div>
                      <p className="text-gray-700"><strong>Enter amount:</strong> Specify how much you want to swap. Real-time exchange rates are displayed.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm">3</div>
                    <div>
                      <p className="text-gray-700"><strong>Provide destination address:</strong> Enter the wallet address where you want to receive your swapped crypto.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm">4</div>
                    <div>
                      <p className="text-gray-700"><strong>Get deposit address:</strong> You'll receive a unique deposit address to send your cryptocurrency.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm">5</div>
                    <div>
                      <p className="text-gray-700"><strong>Send and track:</strong> Send your crypto and track the swap status using your order ID.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                <h4 className="font-semibold text-blue-900 mb-3">✨ Key Features</h4>
                <ul className="space-y-2 text-blue-800 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span><strong>No Registration:</strong> Start swapping immediately without creating an account</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span><strong>Real-Time Rates:</strong> Live exchange rates with transparent fees</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span><strong>Fast Processing:</strong> Most swaps complete within 5-30 minutes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span><strong>Order Tracking:</strong> Monitor swap progress with unique order ID</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Tracking Your Swap</h3>
                <p className="text-gray-700 mb-3">
                  After creating a swap, you'll receive an <strong>Order ID</strong>. Use this to track your swap status on the Track Orders page.
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded p-4">
                  <p className="text-sm text-gray-700 mb-2"><strong>Example Order ID:</strong></p>
                  <code className="text-sm bg-white px-3 py-2 rounded border border-gray-300 inline-block">
                    swap_a1b2c3d4e5f6
                  </code>
                </div>
              </div>
            </div>
          </section>

          {/* SUPPORTED CRYPTOCURRENCIES */}
          <section id="supported-cryptocurrencies" data-section="supported-cryptocurrencies" className="scroll-mt-28">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Supported Cryptocurrencies</h2>
            
            <p className="text-gray-700 mb-6 leading-relaxed">
              Zekta supports anonymous swaps between 9 major cryptocurrencies across multiple blockchain networks. 
              All swaps maintain complete privacy regardless of which chains you're using.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-5 bg-white border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <Bitcoin className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Bitcoin (BTC)</h4>
                    <p className="text-xs text-gray-500">Bitcoin Network</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">The original cryptocurrency, widely accepted and highly liquid.</p>
              </Card>

              <Card className="p-5 bg-white border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Coins className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Solana (SOL)</h4>
                    <p className="text-xs text-gray-500">Solana Network</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">High-performance blockchain with fast, low-cost transactions.</p>
              </Card>

              <Card className="p-5 bg-white border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Coins className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Ethereum (ETH)</h4>
                    <p className="text-xs text-gray-500">Ethereum Network</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Leading smart contract platform and DeFi ecosystem.</p>
              </Card>

              <Card className="p-5 bg-white border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Coins className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Tether (USDT)</h4>
                    <p className="text-xs text-gray-500">Multi-Chain Stablecoin</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">USD-pegged stablecoin for price stability during swaps.</p>
              </Card>

              <Card className="p-5 bg-white border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Coins className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">USD Coin (USDC)</h4>
                    <p className="text-xs text-gray-500">Multi-Chain Stablecoin</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Regulated USD-backed stablecoin with high liquidity.</p>
              </Card>

              <Card className="p-5 bg-white border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Coins className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Binance Coin (BNB)</h4>
                    <p className="text-xs text-gray-500">BNB Chain</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Native token of Binance ecosystem and BNB Chain.</p>
              </Card>

              <Card className="p-5 bg-white border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Coins className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Polygon (MATIC)</h4>
                    <p className="text-xs text-gray-500">Polygon Network</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Ethereum scaling solution with low fees and fast transactions.</p>
              </Card>

              <Card className="p-5 bg-white border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <Coins className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Avalanche (AVAX)</h4>
                    <p className="text-xs text-gray-500">Avalanche Network</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Fast, eco-friendly blockchain platform for DeFi applications.</p>
              </Card>

              <Card className="p-5 bg-white border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Zcash (ZEC)</h4>
                    <p className="text-xs text-gray-500">Zcash Network</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Privacy-focused cryptocurrency with shielded transactions.</p>
              </Card>
            </div>

            <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-5">
              <h4 className="font-semibold text-gray-900 mb-2">Zcash Address Support</h4>
              <p className="text-sm text-gray-700 mb-3">
                Zekta currently supports transparent Zcash addresses:
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <Code className="h-4 w-4 flex-shrink-0 mt-0.5 text-gray-600" />
                  <span><strong>Transparent (t-addr):</strong> Public addresses starting with 't1' (similar to Bitcoin)</span>
                </li>
              </ul>
              <p className="text-xs text-gray-500 mt-3 italic">
                Note: Shielded addresses (z-addr) are not currently supported. Use transparent addresses only.
              </p>
            </div>
          </section>

          {/* DOMAIN PURCHASE */}
          <section id="domain-purchase" data-section="domain-purchase" className="scroll-mt-28">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Domain Purchase</h2>
            
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                Purchase domains anonymously with cryptocurrency. No email, no personal information, no identity verification required. 
                Just pay with crypto and manage your domains using zero-knowledge proofs.
              </p>

              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
                <div className="flex items-start gap-3 mb-3">
                  <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-red-900 text-lg mb-2">⚠️ CRITICAL: Save Your Domain Secret</h4>
                    <p className="text-red-800 leading-relaxed">
                      After purchasing a domain, you'll receive a <strong>domain secret</strong>, which is a long sequence of numbers. 
                      This secret is your ONLY way to manage DNS records. We CANNOT recover it if lost. 
                      There is NO account recovery, NO password reset, NO backup system.
                    </p>
                  </div>
                </div>
                <div className="bg-white border border-red-300 rounded p-4 mt-3">
                  <p className="text-sm text-red-900 font-semibold mb-2">Example domain secret format:</p>
                  <code className="text-xs bg-red-100 px-2 py-1 rounded block overflow-x-auto">
                    50,223,180,81,197,44,75,129,63,112...
                  </code>
                  <p className="text-xs text-red-800 mt-2">
                    This is a cryptographic secret, so treat it like a private key. Write it down, store it in a password manager, and keep multiple backups.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Purchase Process</h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-semibold text-sm">1</div>
                    <div>
                      <p className="text-gray-700"><strong>Search for domain:</strong> Enter your desired domain name and select a TLD (.com, .org, .ai, etc.).</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-semibold text-sm">2</div>
                    <div>
                      <p className="text-gray-700"><strong>View pricing:</strong> Real-time pricing in EUR with crypto conversion rates displayed.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-semibold text-sm">3</div>
                    <div>
                      <p className="text-gray-700"><strong>Choose payment crypto:</strong> Select from 9 supported cryptocurrencies.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-semibold text-sm">4</div>
                    <div>
                      <p className="text-gray-700"><strong>Send payment:</strong> Transfer cryptocurrency to the provided address.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-semibold text-sm">5</div>
                    <div>
                      <p className="text-gray-700"><strong>Receive domain secret:</strong> Save this immediately! You'll need it to manage DNS.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-semibold text-sm">6</div>
                    <div>
                      <p className="text-gray-700"><strong>Track registration:</strong> Monitor domain registration status with your order ID.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                <h4 className="font-semibold text-blue-900 mb-3">💳 Payment Details</h4>
                <ul className="space-y-2 text-blue-800 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>Pay with any of our 9 supported cryptocurrencies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>Automatic conversion and forwarding to domain registrar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>Registration typically completes within 1-24 hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>Real-time order status tracking available</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Privacy Guarantees</h3>
                <p className="text-gray-700 mb-3">
                  Your domain purchase is completely anonymous:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-gray-700">
                    <Lock className="h-5 w-5 flex-shrink-0 mt-0.5 text-green-600" />
                    <span><strong>No identity linkage:</strong> Domains are not connected to any personal information</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <Lock className="h-5 w-5 flex-shrink-0 mt-0.5 text-green-600" />
                    <span><strong>No wallet tracking:</strong> Payment addresses are one-time use</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <Lock className="h-5 w-5 flex-shrink-0 mt-0.5 text-green-600" />
                    <span><strong>Zero-knowledge DNS:</strong> Only you can manage records using your secret</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <Lock className="h-5 w-5 flex-shrink-0 mt-0.5 text-green-600" />
                    <span><strong>Platform cannot access:</strong> We cannot view or modify your DNS records</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* SUPPORTED TLDs */}
          <section id="supported-tlds" data-section="supported-tlds" className="scroll-mt-28">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Supported TLDs</h2>
            
            <p className="text-gray-700 mb-6 leading-relaxed">
              Choose from 300+ top-level domains (TLDs) for your anonymous domain registration. 
              Prices are fetched in real-time from our domain registrar and converted to your chosen cryptocurrency.
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular TLDs</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['.com', '.org', '.net', '.io', '.ai', '.xyz', '.app', '.dev', '.co', '.me', '.tech', '.online', '.store', '.blog', '.info', '.biz'].map((tld) => (
                  <div key={tld} className="bg-white border border-gray-300 rounded px-3 py-2 text-center font-mono text-sm text-gray-800">
                    {tld}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">All Available TLDs</h3>
              <p className="text-sm text-gray-600 mb-4">
                We support 300+ TLDs including country-code domains (.uk, .de, .jp), generic TLDs (.website, .site, .space), 
                and specialized extensions (.tech, .ai, .crypto). Exact pricing is displayed during checkout based on real-time registrar rates.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <p className="text-sm text-blue-800">
                  💡 <strong>Tip:</strong> Search for your desired domain on the Buy Domain page to see if your preferred TLD is available and view current pricing.
                </p>
              </div>
            </div>
          </section>

          {/* DNS MANAGEMENT */}
          <section id="dns-management" data-section="dns-management" className="scroll-mt-28">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">DNS Management</h2>
            
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                Manage your domain's DNS records using zero-knowledge proof authentication. 
                Only someone with the correct domain secret can add, modify, or delete DNS records.
              </p>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-5">
                <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  How DNS Authentication Works
                </h4>
                <ol className="space-y-2 text-purple-800 text-sm">
                  <li className="flex gap-2">
                    <span className="font-semibold">1.</span>
                    <span>You provide your domain secret when managing DNS</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold">2.</span>
                    <span>Platform derives cryptographic commitment from secret</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold">3.</span>
                    <span>Commitment is matched against domain purchase record</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold">4.</span>
                    <span>If match succeeds, DNS operation is authorized</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold">5.</span>
                    <span>Secret is never stored, only verified transiently</span>
                  </li>
                </ol>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Supported DNS Record Types</h3>
                <div className="space-y-3">
                  <Card className="p-4 bg-white border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Code className="h-4 w-4 text-blue-600" />
                      A Record
                    </h4>
                    <p className="text-sm text-gray-600">
                      Map your domain to an IPv4 address. Example: <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">192.168.1.1</code>
                    </p>
                  </Card>

                  <Card className="p-4 bg-white border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Code className="h-4 w-4 text-blue-600" />
                      CNAME Record
                    </h4>
                    <p className="text-sm text-gray-600">
                      Alias your domain to another domain. Example: <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">example.com</code>
                    </p>
                  </Card>

                  <Card className="p-4 bg-white border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Code className="h-4 w-4 text-blue-600" />
                      MX Record
                    </h4>
                    <p className="text-sm text-gray-600">
                      Configure mail servers for your domain with priority levels.
                    </p>
                  </Card>

                  <Card className="p-4 bg-white border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Code className="h-4 w-4 text-blue-600" />
                      TXT Record
                    </h4>
                    <p className="text-sm text-gray-600">
                      Add text data for verification, SPF, DKIM, or other purposes.
                    </p>
                  </Card>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Managing DNS Records</h3>
                <p className="text-gray-700 mb-3">
                  Navigate to <Link href="/my-domains" className="text-blue-600 hover:underline">/my-domains</Link> and enter your domain secret to:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-gray-700">
                    <ChevronRight className="h-5 w-5 flex-shrink-0 mt-0.5 text-blue-600" />
                    <span><strong>View existing records:</strong> See all current DNS configurations</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <ChevronRight className="h-5 w-5 flex-shrink-0 mt-0.5 text-blue-600" />
                    <span><strong>Add new records:</strong> Create A, CNAME, MX, or TXT records</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <ChevronRight className="h-5 w-5 flex-shrink-0 mt-0.5 text-blue-600" />
                    <span><strong>Edit records:</strong> Modify existing DNS entries</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <ChevronRight className="h-5 w-5 flex-shrink-0 mt-0.5 text-blue-600" />
                    <span><strong>Delete records:</strong> Remove unwanted DNS configurations</span>
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-5">
                <h4 className="font-semibold text-yellow-900 mb-3">⚠️ Platform Limitations</h4>
                <p className="text-yellow-800 text-sm mb-3">
                  Due to our privacy-first architecture, certain DNS operations are NOT supported:
                </p>
                <ul className="space-y-2 text-yellow-800 text-sm">
                  <li className="flex items-start gap-2">
                    <X className="h-4 w-4 flex-shrink-0 mt-0.5 text-red-600" />
                    <span><strong>Cannot view DNS without secret:</strong> Read-only access requires your domain secret</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-4 w-4 flex-shrink-0 mt-0.5 text-red-600" />
                    <span><strong>Cannot recover lost secrets:</strong> If you lose your secret, DNS management is impossible</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-4 w-4 flex-shrink-0 mt-0.5 text-red-600" />
                    <span><strong>Cannot link domains to accounts:</strong> No account system means no domain ownership dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-4 w-4 flex-shrink-0 mt-0.5 text-red-600" />
                    <span><strong>DNS propagation delays:</strong> Changes may take 1-48 hours to propagate globally</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* MY DOMAINS */}
          <section id="my-domains" data-section="my-domains" className="scroll-mt-28">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">My Domains</h2>
            
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                Access and manage all your anonymously purchased domains from one place. 
                Enter your domain secret to view DNS records and make changes.
              </p>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Accessing Your Domains</h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm">1</div>
                    <div>
                      <p className="text-gray-700">Navigate to <code className="px-2 py-1 bg-gray-100 rounded text-sm">/my-domains</code></p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm">2</div>
                    <div>
                      <p className="text-gray-700">Enter your domain name and domain secret</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm">3</div>
                    <div>
                      <p className="text-gray-700">View and manage DNS records for that domain</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                <h4 className="font-semibold text-gray-900 mb-3">Managing Multiple Domains</h4>
                <p className="text-gray-700 text-sm mb-3">
                  Each domain has its own unique secret. To manage multiple domains:
                </p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5 text-green-600" />
                    <span>Store each domain secret separately in your password manager</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5 text-green-600" />
                    <span>Label secrets clearly with domain names for easy identification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5 text-green-600" />
                    <span>Keep encrypted backups of all secrets in multiple secure locations</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Domain Secret Management Tips</h3>
                <div className="space-y-3">
                  <Card className="p-4 bg-white border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">✍️ Write It Down</h4>
                    <p className="text-sm text-gray-600">
                      Keep a physical, handwritten copy in a secure location (safe, safety deposit box).
                    </p>
                  </Card>
                  <Card className="p-4 bg-white border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">🔐 Password Manager</h4>
                    <p className="text-sm text-gray-600">
                      Store secrets in encrypted password managers (1Password, Bitwarden, KeePass).
                    </p>
                  </Card>
                  <Card className="p-4 bg-white border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">💾 Encrypted Backups</h4>
                    <p className="text-sm text-gray-600">
                      Create encrypted file backups stored across multiple devices and cloud storage.
                    </p>
                  </Card>
                  <Card className="p-4 bg-white border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">🚫 Never Share</h4>
                    <p className="text-sm text-gray-600">
                      Anyone with your domain secret has full control over DNS. Never share it.
                    </p>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* TELEGRAM BOT */}
          <section id="telegram-bot" data-section="telegram-bot" className="scroll-mt-28">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Telegram Bot</h2>
            
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                Access Zekta's swap functionality through our Telegram bot <code className="px-2 py-1 bg-gray-100 rounded text-sm">@zektaswapbot</code>. 
                Create cryptocurrency swaps directly from Telegram with a simple conversational interface.
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  Getting Started
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">1</span>
                    <p className="text-gray-700">Search for <code className="bg-white px-2 py-1 rounded text-sm">@zektaswapbot</code> on Telegram</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">2</span>
                    <p className="text-gray-700">Start a conversation with the bot by clicking "Start"</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">3</span>
                    <p className="text-gray-700">Follow the 5-step guided swap flow to complete your transaction</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Swap Flow</h3>
                <p className="text-gray-700 mb-4">The bot guides you through a simple 5-step process:</p>
                <div className="space-y-3">
                  {['Select cryptocurrency to send', 'Select cryptocurrency to receive', 'Enter amount to swap', 'Provide destination address', 'Complete payment'].map((step, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <Badge variant="outline" className="w-16 justify-center">Step {i+1}</Badge>
                      <span className="text-gray-700">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                <h4 className="font-semibold text-blue-900 mb-3">📱 Features</h4>
                <ul className="space-y-2 text-blue-800 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>Inline keyboard navigation with back buttons</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>Real-time price previews before confirming swap</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>Chain-specific address validation (BTC, ETH, SOL, etc.)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>Support for Zcash transparent addresses (t-addr)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>Session management with automatic reset</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>Blockchain explorer links for tracking deposits</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* REVENUE DISTRIBUTION */}
          <section id="revenue-distribution" data-section="revenue-distribution" className="scroll-mt-28">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Revenue Distribution</h2>
            
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                Zekta token holders participate in protocol revenue through a continuous accumulation distribution system. 
                All holders with ≥1 token are eligible for pure proportional rewards.
              </p>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-4">How It Works</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-semibold text-sm">1</div>
                    <div>
                      <p className="font-semibold text-purple-900">Revenue Accumulation</p>
                      <p className="text-sm text-purple-800">Platform fees from swaps and domain purchases accumulate in the Distribution Pool</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-semibold text-sm">2</div>
                    <div>
                      <p className="font-semibold text-purple-900">Eligibility Check</p>
                      <p className="text-sm text-purple-800">All wallets holding ≥1 token qualify for proportional distribution (no tier multipliers)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-semibold text-sm">3</div>
                    <div>
                      <p className="font-semibold text-purple-900">Distribution</p>
                      <p className="text-sm text-purple-800">When distribution occurs, rewards are sent from the revenue wallet proportionally to all holders</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-semibold text-sm">4</div>
                    <div>
                      <p className="font-semibold text-purple-900">Pool Reset</p>
                      <p className="text-sm text-purple-800">Distribution pool resets to zero only after actual distribution completes</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Distribution Formula</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                  <code className="text-sm block mb-3 text-gray-800 font-mono">
                    Estimated Reward = Pool Size × (Your Holdings / Total Eligible Amount)
                  </code>
                  <p className="text-sm text-gray-600 mb-3">
                    This is a pure proportional distribution. If you hold 1% of eligible tokens, you receive 1% of the pool. 
                    If you hold 10% of eligible tokens, you receive 10% of the pool.
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded px-3 py-2">
                    <p className="text-sm text-green-900 font-semibold">
                      ✓ The more tokens you hold, the more rewards you earn. Higher tier holders naturally earn more than lower tier holders because they hold more tokens.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Tier Classification</h3>
                <p className="text-gray-700 mb-4">
                  The system classifies holders into 8 tiers based on token holdings. <strong>Higher tiers earn more rewards</strong> because they hold more tokens:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { name: 'Bronze', range: '1 to 99,999', color: 'bg-orange-100 text-orange-800', earning: 'Lowest earnings' },
                    { name: 'Silver', range: '100K to 499K', color: 'bg-gray-100 text-gray-800', earning: 'Low earnings' },
                    { name: 'Gold', range: '500K to 999K', color: 'bg-yellow-100 text-yellow-800', earning: 'Medium earnings' },
                    { name: 'Diamond', range: '1M to 1.99M', color: 'bg-blue-100 text-blue-800', earning: 'Good earnings' },
                    { name: 'Elite', range: '2M to 4.99M', color: 'bg-purple-100 text-purple-800', earning: 'High earnings' },
                    { name: 'Legend', range: '5M to 9.99M', color: 'bg-pink-100 text-pink-800', earning: 'Very high earnings' },
                    { name: 'Master', range: '10M to 19.99M', color: 'bg-red-100 text-red-800', earning: 'Massive earnings' },
                    { name: 'Whale', range: '20M+', color: 'bg-indigo-100 text-indigo-800', earning: 'Maximum earnings' }
                  ].map((tier) => (
                    <div key={tier.name} className={`${tier.color} rounded-lg p-3`}>
                      <div className="font-semibold">{tier.name} Tier</div>
                      <div className="text-xs opacity-80">{tier.range} tokens</div>
                      <div className="text-xs font-semibold mt-1 opacity-90">{tier.earning}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <p className="text-sm text-blue-900 font-semibold mb-2">💡 How Tiers Affect Earnings</p>
                  <p className="text-sm text-blue-800">
                    Whale tier holders earn significantly more than Bronze tier holders because they hold more tokens. 
                    For example, if a Whale holds 20M tokens and a Bronze holds 50K tokens, the Whale will receive 400x more rewards (20M ÷ 50K = 400x). 
                    There are no tier bonuses or multipliers, earnings are purely proportional to your holdings.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SECURITY & PRIVACY */}
          <section id="security-privacy" data-section="security-privacy" className="scroll-mt-28">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Security & Privacy</h2>
            
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                Zekta is built on zero-knowledge cryptography to ensure your privacy and security. 
                Here's how we protect you and what you need to know.
              </p>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h4 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy Guarantees
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Lock className="h-5 w-5 flex-shrink-0 mt-0.5 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-900">No Personal Information</p>
                      <p className="text-sm text-green-800">We never collect names, emails, phone numbers, or any personally identifiable information</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Lock className="h-5 w-5 flex-shrink-0 mt-0.5 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-900">No Wallet Tracking</p>
                      <p className="text-sm text-green-800">Swap deposit addresses are one-time use and not linked to any identity</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Lock className="h-5 w-5 flex-shrink-0 mt-0.5 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-900">Zero-Knowledge DNS</p>
                      <p className="text-sm text-green-800">Domain secrets use ZK proofs, so we cannot access or modify your DNS records</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Lock className="h-5 w-5 flex-shrink-0 mt-0.5 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-900">No Transaction Logs</p>
                      <p className="text-sm text-green-800">We don't maintain logs linking user identities to transaction history</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Your Responsibilities</h3>
                <div className="space-y-3">
                  <Card className="p-4 bg-white border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Key className="h-4 w-4 text-blue-600" />
                      Protect Your Domain Secrets
                    </h4>
                    <p className="text-sm text-gray-600">
                      Domain secrets are permanent cryptographic keys. If lost, there is NO recovery. 
                      Store them securely using password managers and encrypted backups.
                    </p>
                  </Card>

                  <Card className="p-4 bg-white border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      Verify Addresses
                    </h4>
                    <p className="text-sm text-gray-600">
                      Always double-check destination addresses before sending crypto. 
                      Transactions are irreversible and cannot be refunded if sent to wrong address.
                    </p>
                  </Card>

                  <Card className="p-4 bg-white border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      Use Secure Connections
                    </h4>
                    <p className="text-sm text-gray-600">
                      Always access Zekta over HTTPS. Avoid public WiFi when entering domain secrets or creating swaps.
                    </p>
                  </Card>

                  <Card className="p-4 bg-white border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-purple-600" />
                      Save Order IDs
                    </h4>
                    <p className="text-sm text-gray-600">
                      Keep your swap and domain order IDs to track status. Without these, you cannot monitor your orders.
                    </p>
                  </Card>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-5">
                <h4 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Security Limitations
                </h4>
                <p className="text-sm text-yellow-800 mb-3">
                  While we implement industry-leading privacy technology, you should be aware of these limitations:
                </p>
                <ul className="space-y-2 text-sm text-yellow-800">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>Blockchain transactions are public, so swap destinations are visible on-chain</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>Domain WHOIS data may be publicly visible depending on TLD registrar policies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>No protection against phishing, so always verify you're on the official Zekta domain</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>Your device security is your responsibility, so use updated software and antivirus</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* PLATFORM LIMITATIONS */}
          <section id="platform-limitations" data-section="platform-limitations" className="scroll-mt-28">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Platform Limitations</h2>
            
            <p className="text-gray-700 mb-6 leading-relaxed">
              Zekta's privacy-first architecture means certain features common on traditional platforms are NOT available. 
              Understanding these limitations helps set proper expectations.
            </p>

            <div className="space-y-4">
              <Card className="p-5 bg-white border-red-200 border-2">
                <div className="flex items-start gap-3 mb-2">
                  <X className="h-6 w-6 flex-shrink-0 text-red-600" />
                  <div>
                    <h4 className="font-bold text-red-900 mb-1">No Account Recovery</h4>
                    <p className="text-sm text-gray-700">
                      Lost domain secrets cannot be recovered. There is no password reset, no account recovery email, no customer support bypass. 
                      If you lose your secret, you permanently lose DNS management access.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-5 bg-white border-red-200 border-2">
                <div className="flex items-start gap-3 mb-2">
                  <X className="h-6 w-6 flex-shrink-0 text-red-600" />
                  <div>
                    <h4 className="font-bold text-red-900 mb-1">No Transaction Refunds</h4>
                    <p className="text-sm text-gray-700">
                      Cryptocurrency transactions are irreversible. If you send funds to the wrong address or incorrect amount, 
                      we cannot issue refunds. Always verify addresses before sending.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-5 bg-white border-yellow-200 border-2">
                <div className="flex items-start gap-3 mb-2">
                  <X className="h-6 w-6 flex-shrink-0 text-yellow-600" />
                  <div>
                    <h4 className="font-bold text-yellow-900 mb-1">No Domain Dashboard</h4>
                    <p className="text-sm text-gray-700">
                      We don't have a dashboard showing "all your domains" because we don't track ownership. 
                      You must remember which domains you own and save their secrets separately.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-5 bg-white border-yellow-200 border-2">
                <div className="flex items-start gap-3 mb-2">
                  <X className="h-6 w-6 flex-shrink-0 text-yellow-600" />
                  <div>
                    <h4 className="font-bold text-yellow-900 mb-1">Limited DNS Operations</h4>
                    <p className="text-sm text-gray-700">
                      You cannot view DNS records without providing your domain secret. Read-only access requires authentication. 
                      DNS changes may take 1-48 hours to propagate globally.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-5 bg-white border-blue-200 border-2">
                <div className="flex items-start gap-3 mb-2">
                  <Info className="h-6 w-6 flex-shrink-0 text-blue-600" />
                  <div>
                    <h4 className="font-bold text-blue-900 mb-1">Swap Time Variability</h4>
                    <p className="text-sm text-gray-700">
                      Swap completion times depend on blockchain network congestion, exchange liquidity, and confirmation requirements. 
                      Most swaps complete within 5-30 minutes, but some may take several hours during high traffic.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-5 bg-white border-blue-200 border-2">
                <div className="flex items-start gap-3 mb-2">
                  <Info className="h-6 w-6 flex-shrink-0 text-blue-600" />
                  <div>
                    <h4 className="font-bold text-blue-900 mb-1">Domain Registration Delays</h4>
                    <p className="text-sm text-gray-700">
                      After payment, domain registration typically completes within 1-24 hours but may take longer depending on registrar processing times. 
                      Track your order status using the order ID provided.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mt-6">
              <h4 className="font-semibold text-blue-900 mb-2">💡 Why These Limitations Exist</h4>
              <p className="text-sm text-blue-800">
                These limitations are not bugs. They are intentional design choices that enable true privacy and anonymity. 
                Traditional platforms with account recovery and transaction reversals require identity verification and centralized control. 
                Zekta sacrifices convenience for privacy.
              </p>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" data-section="faq" className="scroll-mt-28">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <Card className="p-5 bg-white border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">What cryptocurrencies can I use?</h4>
                <p className="text-sm text-gray-700">
                  Zekta supports 9 cryptocurrencies: Solana (SOL), Bitcoin (BTC), Ethereum (ETH), Tether (USDT), 
                  USD Coin (USDC), Binance Coin (BNB), Polygon (MATIC), Avalanche (AVAX), and Zcash (ZEC).
                </p>
              </Card>

              <Card className="p-5 bg-white border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Do I need to create an account?</h4>
                <p className="text-sm text-gray-700">
                  No! Zekta requires no account, no registration, no email, and no personal information. 
                  Just use the platform directly with cryptocurrency addresses.
                </p>
              </Card>

              <Card className="p-5 bg-white border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">What happens if I lose my domain secret?</h4>
                <p className="text-sm text-gray-700 mb-2">
                  <strong className="text-red-600">You permanently lose DNS management access.</strong> There is NO recovery mechanism. 
                  We cannot reset secrets, verify ownership through other means, or access your DNS records.
                </p>
                <p className="text-sm text-gray-700">
                  This is why we strongly emphasize: write it down, use a password manager, keep multiple encrypted backups.
                </p>
              </Card>

              <Card className="p-5 bg-white border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">How long does a swap take?</h4>
                <p className="text-sm text-gray-700">
                  Most swaps complete within 5-30 minutes, but timing depends on:
                </p>
                <ul className="text-sm text-gray-600 mt-2 space-y-1 ml-4">
                  <li>• Blockchain network congestion</li>
                  <li>• Number of confirmations required</li>
                  <li>• Exchange liquidity for the trading pair</li>
                  <li>• Time of day and network load</li>
                </ul>
              </Card>

              <Card className="p-5 bg-white border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Can I cancel a swap after sending crypto?</h4>
                <p className="text-sm text-gray-700">
                  No. Once you send cryptocurrency to the deposit address, the transaction cannot be reversed or cancelled. 
                  The swap will proceed automatically once confirmations are received.
                </p>
              </Card>

              <Card className="p-5 bg-white border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">What if I sent the wrong amount?</h4>
                <p className="text-sm text-gray-700">
                  If you send less than the expected amount, the swap may be rejected or partially executed. 
                  If you send more, you may lose the excess. Always send the exact amount shown in the swap interface.
                </p>
              </Card>

              <Card className="p-5 bg-white border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Can I buy domains with cash or credit card?</h4>
                <p className="text-sm text-gray-700">
                  No. Zekta only accepts cryptocurrency payments to maintain anonymity. 
                  Credit cards and bank transfers require identity verification, which defeats the purpose of anonymous domain registration.
                </p>
              </Card>

              <Card className="p-5 bg-white border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Is my domain registration truly anonymous?</h4>
                <p className="text-sm text-gray-700">
                  Yes. We don't collect or store any personal information with domain purchases. 
                  However, WHOIS privacy depends on the TLD registrar's policies. Some TLDs may display registrar information publicly.
                </p>
              </Card>

              <Card className="p-5 bg-white border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Can I transfer my domain to another registrar?</h4>
                <p className="text-sm text-gray-700">
                  Domain transfer policies depend on the underlying registrar (Njalla). 
                  Contact support for specific transfer requirements and procedures.
                </p>
              </Card>

              <Card className="p-5 bg-white border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">What DNS record types are supported?</h4>
                <p className="text-sm text-gray-700">
                  Zekta supports A records (IPv4), CNAME records (aliases), MX records (mail servers), and TXT records (verification and SPF).
                </p>
              </Card>

              <Card className="p-5 bg-white border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">How do I track my swap or domain order?</h4>
                <p className="text-sm text-gray-700">
                  Save your order ID when creating a swap or purchasing a domain. 
                  Visit the Track Orders page and enter your order ID to view real-time status updates.
                </p>
              </Card>

              <Card className="p-5 bg-white border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Is Zekta a mixer or tumbler?</h4>
                <p className="text-sm text-gray-700">
                  No. Zekta is a privacy-focused swap and domain platform using zero-knowledge proofs. 
                  Unlike mixers that pool funds, Zekta uses direct cryptocurrency conversions with privacy guarantees.
                </p>
              </Card>

              <Card className="p-5 bg-white border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Are there minimum or maximum swap amounts?</h4>
                <p className="text-sm text-gray-700">
                  Yes, exchange limits apply based on liquidity and trading pair. 
                  The swap interface will display min/max amounts when you select cryptocurrencies and enter an amount.
                </p>
              </Card>
            </div>
          </section>

          {/* COMING SOON */}
          <section id="coming-soon" data-section="coming-soon" className="scroll-mt-28">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Coming Soon</h2>
            
            <p className="text-gray-700 mb-6 leading-relaxed">
              We're constantly working on new features to enhance privacy and expand functionality. 
              Here's what's on the roadmap:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-5 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                <div className="flex items-start gap-3 mb-2">
                  <Code className="h-6 w-6 text-blue-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Developer API & SDK</h4>
                    <p className="text-sm text-gray-700">
                      Programmatic access to Zekta's swap and domain services. 
                      Build privacy-focused dApps with our RESTful API and JavaScript/Python SDKs.
                    </p>
                    <Badge variant="secondary" className="mt-2 text-xs">In Development</Badge>
                  </div>
                </div>
              </Card>

              <Card className="p-5 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
                <div className="flex items-start gap-3 mb-2">
                  <Coins className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">More Cryptocurrencies</h4>
                    <p className="text-sm text-gray-700">
                      Expanding support to include Monero (XMR), Dash (DASH), Litecoin (LTC), and other privacy-focused assets.
                    </p>
                    <Badge variant="secondary" className="mt-2 text-xs">Planned</Badge>
                  </div>
                </div>
              </Card>

              <Card className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                <div className="flex items-start gap-3 mb-2">
                  <Shield className="h-6 w-6 text-purple-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Enhanced ZK Features</h4>
                    <p className="text-sm text-gray-700">
                      Anonymous DAO voting, private token transfers, and gasless transactions using zero-knowledge proofs.
                    </p>
                    <Badge variant="secondary" className="mt-2 text-xs">Research Phase</Badge>
                  </div>
                </div>
              </Card>

              <Card className="p-5 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                <div className="flex items-start gap-3 mb-2">
                  <Globe className="h-6 w-6 text-yellow-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Hosting Services</h4>
                    <p className="text-sm text-gray-700">
                      Anonymous web hosting with cryptocurrency payments. Deploy sites without revealing identity.
                    </p>
                    <Badge variant="secondary" className="mt-2 text-xs">Planned</Badge>
                  </div>
                </div>
              </Card>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mt-6">
              <p className="text-sm text-blue-800">
                <strong>Want to see a feature?</strong> Join our community and share your ideas. 
                We prioritize features based on user feedback and privacy enhancement.
              </p>
            </div>
          </section>

        </div>

        {/* Back to Top Button */}
        {showBackToTop && (
          <Button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 rounded-full w-12 h-12 shadow-lg bg-blue-600 hover:bg-blue-700 text-white"
            size="icon"
            data-testid="button-back-to-top"
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        )}

        {/* Clean Documentation Footer */}
        <footer className="border-t border-gray-200 bg-white lg:ml-0">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
              <div className="text-center md:text-left">
                © 2025 Zekta. Zero-Knowledge Action Layer.
              </div>
              <div className="flex items-center gap-6">
                <Link href="/privacy" className="hover:text-gray-900 transition-colors" data-testid="link-privacy">
                  Privacy
                </Link>
                <Link href="/terms" className="hover:text-gray-900 transition-colors" data-testid="link-terms">
                  Terms
                </Link>
                <Link href="/" className="hover:text-gray-900 transition-colors" data-testid="link-home-footer">
                  Home
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
