import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import Logo from '@/components/Logo';
import { 
  Shield,
  Lock,
  Key,
  Repeat,
  Globe,
  ArrowRight,
  Check,
  X,
  Eye,
  EyeOff,
  ArrowLeft,
  Zap,
  FileText,
  Database,
  AlertCircle,
  CreditCard,
  Wallet,
  Download,
  Upload
} from 'lucide-react';

export default function ZektaZKID() {
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
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Clean Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity" data-testid="link-home">
                <Logo size="md" />
              </Link>
              <div className="hidden md:flex items-center gap-2 text-sm">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  ZK ID Explained
                </Badge>
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

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Hero Section */}
        <div className="text-center mb-20" id="hero">
          <div className="relative">
            {/* Background Gradient */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-br from-blue-100 via-cyan-50 to-purple-100 rounded-full blur-3xl opacity-50"></div>
            </div>
            
            <div className="inline-flex items-center justify-center w-24 h-24 mb-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg">
              <Shield className="h-12 w-12 text-white" />
            </div>
            
            <div className="mb-4">
              <Badge className="bg-blue-100 text-blue-700 border-blue-200 mb-4">Zero-Knowledge Identity Protocol</Badge>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 bg-clip-text text-transparent">
                What is ZK ID?
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-4">
              Your cryptographic identity. No signup. No email. No KYC.
            </p>
            
            <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
              Just privacy-preserving proof that you're authorized to act. Power anonymous swaps, domain ownership, and payments without revealing who you are.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg"
                onClick={() => scrollToSection('how-it-works')} 
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                data-testid="button-learn-how"
              >
                Learn How It Works
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Link href="/docs">
                <Button variant="outline" size="lg" data-testid="button-read-docs">
                  <FileText className="h-5 w-5 mr-2" />
                  Read Full Docs
                </Button>
              </Link>
            </div>

            {/* Quick Links */}
            <div className="mt-12 flex flex-wrap justify-center gap-4 text-sm">
              <button 
                onClick={() => scrollToSection('zk-swap')}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                <Repeat className="h-4 w-4" />
                ZK Swap
              </button>
              <span className="text-gray-300">|</span>
              <button 
                onClick={() => scrollToSection('buy-domain')}
                className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
              >
                <Globe className="h-4 w-4" />
                Buy Domain
              </button>
              <span className="text-gray-300">|</span>
              <button 
                onClick={() => scrollToSection('zk-payment')}
                className="text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1"
              >
                <CreditCard className="h-4 w-4" />
                ZK Payment
              </button>
            </div>
          </div>
        </div>

        {/* Traditional vs ZK ID Comparison */}
        <section className="mb-16 sm:mb-20" id="comparison">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center px-4">
            Traditional Identity vs ZK ID
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Traditional Identity */}
            <Card className="p-4 sm:p-6 border-red-200 bg-red-50">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                  <EyeOff className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Traditional Identity</h3>
              </div>
              <ul className="space-y-3 sm:space-y-4">
                <li className="flex items-start gap-2 sm:gap-3">
                  <X className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-gray-700">Requires email and password signup</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <X className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-gray-700">KYC verification with personal documents</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <X className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-gray-700">Data stored on centralized servers</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <X className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-gray-700">Wallet provider controls your identity</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <X className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-gray-700">Every action linked to your personal info</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <X className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-gray-700">Transactions tracked and traced</span>
                </li>
              </ul>
            </Card>

            {/* ZK ID */}
            <Card className="p-4 sm:p-6 border-green-200 bg-green-50">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                  <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">ZK ID (Zekta)</h3>
              </div>
              <ul className="space-y-3 sm:space-y-4">
                <li className="flex items-start gap-2 sm:gap-3">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-gray-700">Generate identity instantly, no signup</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-gray-700">No KYC, no email, no personal documents</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-gray-700">Stored locally on your device only</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-gray-700">You own your identity completely</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-gray-700">Actions are anonymous and unlinkable</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-gray-700">Cryptographic privacy guarantees</span>
                </li>
              </ul>
            </Card>
          </div>
        </section>

        {/* How ZK ID Works */}
        <section className="mb-16 sm:mb-20" id="how-it-works">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 text-center px-4">
            How ZK ID Works
          </h2>
          <p className="text-base sm:text-lg text-gray-600 text-center mb-8 sm:mb-12 max-w-3xl mx-auto px-4">
            ZK ID uses the Semaphore Protocol to create cryptographic identities. Here's the simple flow:
          </p>

          {/* Visual Workflow */}
          <div className="relative px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8 sm:mb-12">
              {/* Step 1 */}
              <div className="text-center">
                <div className="relative">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                    <Key className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                  </div>
                  <div className="hidden md:block absolute top-6 sm:top-8 left-full w-full">
                    <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 mx-auto" />
                  </div>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 sm:mb-2">1. Generate Identity</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Create cryptographic identity locally on your device. No server involved.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="relative">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                    <Database className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
                  </div>
                  <div className="hidden md:block absolute top-6 sm:top-8 left-full w-full">
                    <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 mx-auto" />
                  </div>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 sm:mb-2">2. Commit to Group</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Your commitment goes on-chain. Your actual identity stays private.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="relative">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-green-100 flex items-center justify-center">
                    <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                  </div>
                  <div className="hidden md:block absolute top-6 sm:top-8 left-full w-full">
                    <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 mx-auto" />
                  </div>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 sm:mb-2">3. Generate Proof</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Prove you're in the group without revealing which member you are.
                </p>
              </div>

              {/* Step 4 */}
              <div className="text-center">
                <div className="relative">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-cyan-100 flex items-center justify-center">
                    <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-600" />
                  </div>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 sm:mb-2">4. Execute Action</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Swap crypto, buy domains, or take any action anonymously.
                </p>
              </div>
            </div>
          </div>

          {/* Technical Explanation */}
          <Card className="p-4 sm:p-6 bg-gray-50">
            <h4 className="font-bold text-gray-900 mb-3">The Technology Behind It</h4>
            <p className="text-sm sm:text-base text-gray-700 mb-4">
              ZK ID is powered by the <strong>Semaphore Protocol</strong>, a zero-knowledge proof system. When you generate an identity, you create two secret numbers called a trapdoor and nullifier. These combine to form your unique identity commitment.
            </p>
            <p className="text-sm sm:text-base text-gray-700 mb-4">
              Your commitment is added to a Merkle tree, which is basically a cryptographic group structure. When you want to take an action, you generate a zero-knowledge proof that proves you're a member of this group without revealing which specific member you are.
            </p>
            <p className="text-sm sm:text-base text-gray-700">
              The proof is verified mathematically. If it checks out, your action is authorized. But nobody can link the action back to your specific identity. This is real cryptographic privacy, not just marketing talk.
            </p>
          </Card>
        </section>

        {/* User Flow Section */}
        <section className="mb-20" id="user-flow">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 text-center">
            Using ZK ID: The Practical Flow
          </h2>
          <p className="text-base sm:text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Here's exactly how you interact with ZK ID when using Zekta. No theory, just the real user flow.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            {/* Step 1 */}
            <Card className="p-4 sm:p-6 border-blue-200 bg-blue-50">
              <div className="flex items-start gap-3 sm:gap-4 mb-4">
                <div className="p-2 sm:p-3 bg-blue-100 rounded-lg flex-shrink-0">
                  <Key className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">1. Generate ZK ID</h3>
                  <p className="text-sm sm:text-base text-gray-700">
                    Created locally on your device. Happens automatically when you start a swap, buy a domain, or purchase a gift card. Zero interaction with servers.
                  </p>
                </div>
              </div>
            </Card>

            {/* Step 2 */}
            <Card className="p-4 sm:p-6 border-purple-200 bg-purple-50">
              <div className="flex items-start gap-3 sm:gap-4 mb-4">
                <div className="p-2 sm:p-3 bg-purple-100 rounded-lg flex-shrink-0">
                  <Download className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">2. Download Your Passkey</h3>
                  <p className="text-sm sm:text-base text-gray-700">
                    Save the passkey file offline. Store it on a USB drive, password manager, or secure storage. This is your only proof of ownership.
                  </p>
                </div>
              </div>
            </Card>

            {/* Step 3 */}
            <Card className="p-4 sm:p-6 border-green-200 bg-green-50">
              <div className="flex items-start gap-3 sm:gap-4 mb-4">
                <div className="p-2 sm:p-3 bg-green-100 rounded-lg flex-shrink-0">
                  <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">3. Execute Actions</h3>
                  <p className="text-sm sm:text-base text-gray-700">
                    Use your ZK ID to swap crypto, buy domains, purchase gift cards, or use any Zekta SDK feature. Proofs are generated locally and submitted for verification.
                  </p>
                </div>
              </div>
            </Card>

            {/* Step 4 */}
            <Card className="p-4 sm:p-6 border-cyan-200 bg-cyan-50">
              <div className="flex items-start gap-3 sm:gap-4 mb-4">
                <div className="p-2 sm:p-3 bg-cyan-100 rounded-lg flex-shrink-0">
                  <Upload className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">4. Access Your Data</h3>
                  <p className="text-sm sm:text-base text-gray-700">
                    When you need to view orders, receipts, or manage assets, upload your passkey to recreate the proof and access your data. Simple as that.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Key Point */}
          <div className="mt-8 sm:mt-10 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">All Proofs Generated On Your Device</h4>
                <p className="text-sm sm:text-base text-gray-700">
                  We never receive your secret. Proofs are created locally in your browser and only the proof is submitted to Zekta. This keeps your identity private while letting you use real services like swaps, domains, and gift cards.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ZK ID in Action: Zekta ZK Swap */}
        <section className="mb-16 sm:mb-20 px-4" id="zk-swap">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="p-2 sm:p-3 bg-blue-100 rounded-xl flex-shrink-0">
              <Repeat className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              ZK ID in Action: Zekta ZK Swap
            </h2>
          </div>

          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
            ZK ID enables truly anonymous cryptocurrency swaps. Trade between 9 different cryptocurrencies without revealing your identity or wallet address.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">How It Works</h3>
              <ol className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
                <li className="flex gap-2 sm:gap-3">
                  <span className="font-bold text-blue-600 flex-shrink-0">1.</span>
                  <span>Your browser generates a ZK identity locally when you visit the swap page.</span>
                </li>
                <li className="flex gap-2 sm:gap-3">
                  <span className="font-bold text-blue-600 flex-shrink-0">2.</span>
                  <span>Select the cryptocurrencies you want to swap (SOL, BTC, ETH, USDT, USDC, BNB, MATIC, AVAX, or ZEC).</span>
                </li>
                <li className="flex gap-2 sm:gap-3">
                  <span className="font-bold text-blue-600 flex-shrink-0">3.</span>
                  <span>The system creates a swap order without linking it to your personal information.</span>
                </li>
                <li className="flex gap-2 sm:gap-3">
                  <span className="font-bold text-blue-600 flex-shrink-0">4.</span>
                  <span>You deposit to the provided address and receive your swapped crypto at your chosen destination.</span>
                </li>
                <li className="flex gap-2 sm:gap-3">
                  <span className="font-bold text-blue-600 flex-shrink-0">5.</span>
                  <span>Track your swap using the order ID. No account needed.</span>
                </li>
              </ol>
            </div>

            <Card className="p-4 sm:p-6 bg-green-50 border-green-200">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                Privacy Guarantees
              </h3>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
                <li className="flex items-start gap-2 sm:gap-3">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>No wallet address tracking or monitoring</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>No email or personal information required</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Swap history not linked to your identity</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Zero-knowledge proofs verify legitimacy</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Complete anonymity preserved throughout</span>
                </li>
              </ul>
            </Card>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
            <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-2">Real World Example</h4>
            <p className="text-sm sm:text-base text-gray-700">
              Alice wants to swap Bitcoin for Ethereum. She visits Zekta, selects BTC to ETH, enters her ETH receiving address, and gets a BTC deposit address. She sends her Bitcoin, and within minutes receives ETH at her destination. No signup. No KYC. No identity exposure. Just a swap.
            </p>
          </div>
        </section>

        {/* ZK ID in Action: Zekta Buy Domain */}
        <section className="mb-16 sm:mb-20 px-4" id="buy-domain">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="p-2 sm:p-3 bg-purple-100 rounded-xl flex-shrink-0">
              <Globe className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              ZK ID in Action: Zekta Buy Domain
            </h2>
          </div>

          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
            ZK ID enables anonymous domain ownership. Register and manage domains without providing any personal information, email, or wallet address.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">How It Works</h3>
              <ol className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
                <li className="flex gap-2 sm:gap-3">
                  <span className="font-bold text-purple-600 flex-shrink-0">1.</span>
                  <span>Search for your desired domain name across 300+ supported TLDs.</span>
                </li>
                <li className="flex gap-2 sm:gap-3">
                  <span className="font-bold text-purple-600 flex-shrink-0">2.</span>
                  <span>The system generates a unique cryptographic domain secret (your ZK identity for this domain).</span>
                </li>
                <li className="flex gap-2 sm:gap-3">
                  <span className="font-bold text-purple-600 flex-shrink-0">3.</span>
                  <span>Pay with any supported cryptocurrency (BTC, ETH, SOL, USDT, and more).</span>
                </li>
                <li className="flex gap-2 sm:gap-3">
                  <span className="font-bold text-purple-600 flex-shrink-0">4.</span>
                  <span>Receive your domain secret. Save it securely because this is your only proof of ownership.</span>
                </li>
                <li className="flex gap-2 sm:gap-3">
                  <span className="font-bold text-purple-600 flex-shrink-0">5.</span>
                  <span>Manage DNS records using zero-knowledge proofs. Provide your domain secret to prove ownership.</span>
                </li>
              </ol>
            </div>

            <Card className="p-4 sm:p-6 bg-green-50 border-green-200">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                Privacy Guarantees
              </h3>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
                <li className="flex items-start gap-2 sm:gap-3">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>No email address stored or required</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>No wallet address linked to domain</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Domain secret is your only credential</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>DNS management via ZK proof verification</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Complete ownership privacy preserved</span>
                </li>
              </ul>
            </Card>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-2">Real World Example</h4>
            <p className="text-sm sm:text-base text-gray-700">
              Bob wants to register a domain for his privacy-focused project. He searches "myproject.org" on Zekta, pays with Bitcoin, and receives a domain secret (a long cryptographic string). He saves this secret in his password manager. Later, when he needs to add DNS records, he enters the domain secret to prove ownership. No registrar has his email or personal information.
            </p>
          </div>

          <div className="bg-red-50 border border-red-300 rounded-lg p-4 sm:p-6">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm sm:text-base font-bold text-red-900 mb-2">CRITICAL: Save Your Domain Secret</h4>
                <p className="text-sm sm:text-base text-red-800">
                  Your domain secret is your ONLY proof of ownership. If you lose it, you lose access to your domain permanently. There is no recovery process because we don't store your personal information. Save it in multiple secure locations immediately after purchase.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ZK Payment */}
        <section className="mb-16 sm:mb-20 px-4" id="zk-payment">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="p-2 sm:p-3 bg-cyan-100 rounded-xl flex-shrink-0">
              <CreditCard className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-600" />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              ZK ID in Action: Zekta ZK Payment
            </h2>
          </div>

          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
            ZK Payment powers anonymous domain purchases. Pay with any cryptocurrency, and the system handles conversion and registration without ever storing your payment details or wallet address.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-4 text-lg">How ZK Payment Works</h3>
              <ol className="space-y-3 text-gray-700">
                <li className="flex gap-3">
                  <span className="font-bold text-cyan-600">1.</span>
                  <span>You select a domain and choose your preferred cryptocurrency for payment.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-cyan-600">2.</span>
                  <span>The system generates a ZK identity and provides a unique payment address.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-cyan-600">3.</span>
                  <span>You send payment from any wallet. Your wallet address is never linked to the domain.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-cyan-600">4.</span>
                  <span>Behind the scenes, Zekta converts your payment to the required currency and completes registration.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-cyan-600">5.</span>
                  <span>You receive your domain secret. The payment trail cannot be traced back to you.</span>
                </li>
              </ol>
            </div>

            <Card className="p-6 bg-cyan-50 border-cyan-200">
              <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                <Wallet className="h-5 w-5 text-cyan-600" />
                Payment Privacy
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <span>Pay with BTC, ETH, SOL, USDT, USDC, BNB, MATIC, AVAX, or ZEC</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <span>Your payment wallet never linked to domain ownership</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <span>Automatic currency conversion handled privately</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <span>No KYC or identity verification required</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <span>Payment history not stored or tracked</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* Visual Workflow */}
          <div className="mb-8">
            <h3 className="font-bold text-gray-900 mb-6 text-lg text-center">Anonymous Payment Flow</h3>
            <div className="grid md:grid-cols-5 gap-4">
              {/* Step 1 */}
              <div className="text-center">
                <div className="relative">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-100 flex items-center justify-center">
                    <Globe className="h-8 w-8 text-cyan-600" />
                  </div>
                  <div className="hidden md:block absolute top-8 left-full w-full">
                    <ArrowRight className="h-6 w-6 text-gray-400 mx-auto" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 font-medium">Select Domain</p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="relative">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                    <CreditCard className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="hidden md:block absolute top-8 left-full w-full">
                    <ArrowRight className="h-6 w-6 text-gray-400 mx-auto" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 font-medium">Choose Crypto</p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="relative">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                    <Wallet className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="hidden md:block absolute top-8 left-full w-full">
                    <ArrowRight className="h-6 w-6 text-gray-400 mx-auto" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 font-medium">Send Payment</p>
              </div>

              {/* Step 4 */}
              <div className="text-center">
                <div className="relative">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                    <Zap className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="hidden md:block absolute top-8 left-full w-full">
                    <ArrowRight className="h-6 w-6 text-gray-400 mx-auto" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 font-medium">Auto Convert</p>
              </div>

              {/* Step 5 */}
              <div className="text-center">
                <div className="relative">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Key className="h-8 w-8 text-yellow-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 font-medium">Receive Secret</p>
              </div>
            </div>
          </div>

          <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 sm:p-6">
            <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-2">Why This Matters</h4>
            <p className="text-sm sm:text-base text-gray-700">
              Traditional domain registrars require credit cards or PayPal, linking your identity to domain ownership. With Zekta ZK Payment, you can pay with cryptocurrency from any wallet, and the payment cannot be traced back to you or the domain. You maintain complete privacy while still owning and controlling your domain.
            </p>
          </div>
        </section>

        {/* Privacy Guarantees */}
        <section className="mb-16 sm:mb-20 px-4" id="privacy-guarantees">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
            What ZK ID Protects
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            <Card className="p-4 sm:p-6 border-green-200 bg-green-50">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                What We Protect
              </h3>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
                <li className="flex items-start gap-2 sm:gap-3">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Your Identity:</strong> No one knows who you are</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Your Wallet:</strong> Addresses are never tracked or stored</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Your Actions:</strong> Swaps and purchases are unlinkable</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Your History:</strong> No transaction logs tied to you</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Your Data:</strong> Nothing stored on centralized servers</span>
                </li>
              </ul>
            </Card>

            <Card className="p-4 sm:p-6 border-blue-200 bg-blue-50">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <Key className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                What We Prove
              </h3>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
                <li className="flex items-start gap-2 sm:gap-3">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Authorization:</strong> You're allowed to perform this action</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Group Membership:</strong> You're part of the authorized set</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Legitimacy:</strong> Your proof is cryptographically valid</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Uniqueness:</strong> You can't double-spend or duplicate actions</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Commitment:</strong> Your action is binding and verifiable</span>
                </li>
              </ul>
            </Card>
          </div>
        </section>

        {/* Why It Matters */}
        <section className="mb-16 sm:mb-20 px-4" id="why-it-matters">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
            Why ZK ID Matters
          </h2>

          <div className="space-y-4 sm:space-y-6">
            <Card className="p-4 sm:p-6 bg-white border-gray-200">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">Financial Privacy is a Right</h3>
              <p className="text-sm sm:text-base text-gray-700">
                Your financial activities should be private by default. Traditional crypto platforms link every transaction to your identity through wallet addresses and KYC requirements. ZK ID breaks this link, giving you the privacy you deserve.
              </p>
            </Card>

            <Card className="p-4 sm:p-6 bg-white border-gray-200">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">Anonymous Business Operations</h3>
              <p className="text-sm sm:text-base text-gray-700">
                Run online services without exposing your personal information. Register domains anonymously, accept cryptocurrency payments privately, and operate without fear of doxxing or targeted attacks.
              </p>
            </Card>

            <Card className="p-4 sm:p-6 bg-white border-gray-200">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">Censorship Resistance</h3>
              <p className="text-sm sm:text-base text-gray-700">
                When you control your identity cryptographically, no one can revoke your access or freeze your accounts. You own your credentials, not a centralized platform. This is true digital sovereignty.
              </p>
            </Card>

            <Card className="p-4 sm:p-6 bg-white border-gray-200">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">Protection from Surveillance</h3>
              <p className="text-sm sm:text-base text-gray-700">
                Mass surveillance thrives on linking actions to identities. ZK ID makes this mathematically impossible while still allowing you to prove you're authorized. Privacy without sacrificing security.
              </p>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center px-4">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl sm:rounded-2xl p-6 sm:p-12 text-white">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              Experience Privacy in Action
            </h2>
            <p className="text-base sm:text-xl mb-6 sm:mb-8 text-blue-50 max-w-2xl mx-auto">
              ZK ID isn't just a concept. It's live and working right now on Zekta. Try it yourself.
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <Link href="/mvp">
                <Button size="lg" variant="secondary" data-testid="button-try-zk-swap">
                  <Repeat className="h-5 w-5 mr-2" />
                  Try ZK Swap
                </Button>
              </Link>
              <Link href="/buy-domain">
                <Button size="lg" variant="secondary" data-testid="button-buy-domain">
                  <Globe className="h-5 w-5 mr-2" />
                  Buy Anonymous Domain
                </Button>
              </Link>
              <Link href="/docs">
                <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-blue-50 border-white" data-testid="button-documentation">
                  <FileText className="h-5 w-5 mr-2" />
                  Read Full Documentation
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2025 Zekta. Privacy-focused blockchain protocol.</p>
            <div className="flex justify-center gap-6 mt-4">
              <Link href="/docs" className="hover:text-gray-700" data-testid="link-footer-docs">
                Documentation
              </Link>
              <Link href="/privacy" className="hover:text-gray-700" data-testid="link-footer-privacy">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-gray-700" data-testid="link-footer-terms">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
