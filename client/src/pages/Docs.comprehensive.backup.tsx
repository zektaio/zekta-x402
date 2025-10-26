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
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
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
      title: 'Security',
      description: 'Understand our zero-knowledge architecture',
      sectionId: 'security-privacy'
    },
    {
      icon: MessageSquare,
      title: 'Telegram Bot',
      description: 'Use @zektaswapbot for conversational swaps',
      sectionId: 'telegram-bot'
    },
    {
      icon: DollarSign,
      title: 'Revenue System',
      description: 'Learn about tier-based revenue distribution',
      sectionId: 'revenue-distribution'
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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Clean Documentation Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/">
                <a className="flex items-center gap-2 hover:opacity-80 transition-opacity" data-testid="link-home">
                  <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    ZEKTA
                  </div>
                </a>
              </Link>
              <div className="hidden md:block text-sm text-gray-500">
                Documentation
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-gray-700" data-testid="button-back-home">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
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
        <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 border-b border-gray-200">
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
              Complete guide to anonymous cryptocurrency swaps and zero-knowledge domain management
            </p>
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-base bg-white border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
          <section id="introduction" data-section="introduction" className="scroll-mt-20">
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
                      Based on Semaphore Protocol - battle-tested cryptography used by Ethereum Foundation and privacy-focused projects worldwide.
                    </p>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* QUICK START */}
          <section id="quick-start" data-section="quick-start" className="scroll-mt-20">
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

          {/* ANONYMOUS SWAPS */}
          <section id="anonymous-swaps" data-section="anonymous-swaps" className="scroll-mt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Anonymous Swaps</h2>
            
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                Zekta enables completely anonymous cryptocurrency swaps across 9 blockchain networks. 
                No account required, no KYC, no wallet connection - just simple, private swaps.
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
          <section id="supported-cryptocurrencies" data-section="supported-cryptocurrencies" className="scroll-mt-20">
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
                Zekta supports both transparent and shielded Zcash addresses:
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <Code className="h-4 w-4 flex-shrink-0 mt-0.5 text-gray-600" />
                  <span><strong>Transparent (t-addr):</strong> Public addresses starting with 't1' (similar to Bitcoin)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="h-4 w-4 flex-shrink-0 mt-0.5 text-gray-600" />
                  <span><strong>Shielded (z-addr):</strong> Private addresses starting with 'zs1' or 'zc' (enhanced privacy)</span>
                </li>
              </ul>
            </div>
          </section>

          {/* DOMAIN PURCHASE */}
          <section id="domain-purchase" data-section="domain-purchase" className="scroll-mt-20">
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
                      After purchasing a domain, you'll receive a <strong>domain secret</strong> - a long sequence of numbers. 
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
                    This is a cryptographic secret - treat it like a private key. Write it down, store it in a password manager, keep multiple backups.
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
          <section id="supported-tlds" data-section="supported-tlds" className="scroll-mt-20">
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
          <section id="dns-management" data-section="dns-management" className="scroll-mt-20">
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
                    <span>Secret is never stored - only verified transiently</span>
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
                  Navigate to <Link href="/my-domains"><a className="text-blue-600 hover:underline">/my-domains</a></Link> and enter your domain secret to:
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
          <section id="my-domains" data-section="my-domains" className="scroll-mt-20">
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
          <section id="telegram-bot" data-section="telegram-bot" className="scroll-mt-20">
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
                    <span>Support for Zcash transparent and shielded addresses</span>
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
          <section id="revenue-distribution" data-section="revenue-distribution" className="scroll-mt-20">
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
                  <p className="text-sm text-gray-600">
                    This is a pure proportional distribution. If you hold 1% of eligible tokens, you receive 1% of the pool. 
                    No tier bonuses, no multipliers - just fair proportional rewards.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Tier Classification</h3>
                <p className="text-gray-700 mb-4">
                  The system classifies holders into 8 tiers for organizational purposes only (no tier multipliers):
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { name: 'Bronze', range: '1 - 99,999', color: 'bg-orange-100 text-orange-800' },
                    { name: 'Silver', range: '100K - 499K', color: 'bg-gray-100 text-gray-800' },
                    { name: 'Gold', range: '500K - 999K', color: 'bg-yellow-100 text-yellow-800' },
                    { name: 'Diamond', range: '1M - 1.99M', color: 'bg-blue-100 text-blue-800' },
                    { name: 'Elite', range: '2M - 4.99M', color: 'bg-purple-100 text-purple-800' },
                    { name: 'Legend', range: '5M - 9.99M', color: 'bg-pink-100 text-pink-800' },
                    { name: 'Master', range: '10M - 19.99M', color: 'bg-red-100 text-red-800' },
                    { name: 'Whale', range: '20M+', color: 'bg-indigo-100 text-indigo-800' }
                  ].map((tier) => (
                    <div key={tier.name} className={`${tier.color} rounded-lg p-3`}>
                      <div className="font-semibold">{tier.name} Tier</div>
                      <div className="text-xs opacity-80">{tier.range} tokens</div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-4 italic">
                  * Tiers are labels only - all holders receive rewards based purely on their token holdings with no tier-based multipliers.
                </p>
              </div>
            </div>
          </section>

          {/* SECURITY & PRIVACY */}
          <section id="security-privacy" data-section="security-privacy" className="scroll-mt-20">
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
                      <p className="text-sm text-green-800">Domain secrets use ZK proofs - we cannot access or modify your DNS records</p>
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
                    <span>Blockchain transactions are public - swap destinations are visible on-chain</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>Domain WHOIS data may be publicly visible depending on TLD registrar policies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>No protection against phishing - always verify you're on the official Zekta domain</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>Your device security is your responsibility - use updated software and antivirus</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* PLATFORM LIMITATIONS */}
          <section id="platform-limitations" data-section="platform-limitations" className="scroll-mt-20">
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
                These limitations are not bugs - they are intentional design choices that enable true privacy and anonymity. 
                Traditional platforms with account recovery and transaction reversals require identity verification and centralized control. 
                Zekta sacrifices convenience for privacy.
              </p>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" data-section="faq" className="scroll-mt-20">
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
          <section id="coming-soon" data-section="coming-soon" className="scroll-mt-20">
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
                <Link href="/privacy">
                  <a className="hover:text-gray-900 transition-colors" data-testid="link-privacy">
                    Privacy
                  </a>
                </Link>
                <Link href="/terms">
                  <a className="hover:text-gray-900 transition-colors" data-testid="link-terms">
                    Terms
                  </a>
                </Link>
                <Link href="/">
                  <a className="hover:text-gray-900 transition-colors" data-testid="link-home-footer">
                    Home
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
