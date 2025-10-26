import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { ZektaSDK } from '@/lib/zekta-sdk';
import { Link } from 'wouter';
import Logo from '@/components/Logo';
import {
  ArrowLeft, Shield, Download, Upload, CheckCircle2, 
  Copy, Check, Play, Globe, CreditCard, Repeat, Loader2,
  Code2, AlertCircle
} from 'lucide-react';

export default function SDKDocs() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('sdk');

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white">
        <div className="flex items-center justify-between h-11 px-3 border-b border-gray-200">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <Logo size="sm" showText={false} />
              <span className="text-sm font-bold text-blue-600">ZEKTA</span>
              <span className="text-gray-300 text-xs">/</span>
              <span className="text-xs font-medium text-gray-700">Playground</span>
            </div>
          </Link>

          <div className="flex items-center gap-1">
            <Link href="/developer">
              <Button variant="ghost" size="sm" className="text-gray-600 h-7 text-xs px-2" data-testid="button-view-docs">
                <Code2 className="h-3 w-3 mr-1" />
                Docs
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-gray-600 h-7 text-xs px-2" data-testid="button-back-home">
                <ArrowLeft className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-11 overflow-x-hidden">
        <div className="w-full px-2 py-3 sm:px-4 sm:py-4 lg:max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-3">
            <h1 className="text-base sm:text-lg font-bold text-gray-900 mb-1" data-testid="text-page-title">
              Developer Playground
            </h1>
            <p className="text-xs text-gray-600">
              Interactive testing environment
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-3">
            <TabsList className="grid w-full grid-cols-4 h-8 bg-gray-50 p-0.5">
              <TabsTrigger value="sdk" className="text-xs h-7" data-testid="tab-sdk">
                <Shield className="h-3 w-3 mr-1" />
                SDK
              </TabsTrigger>
              <TabsTrigger value="domains" className="text-xs h-7" data-testid="tab-domains">
                <Globe className="h-3 w-3 mr-1" />
                Domain
              </TabsTrigger>
              <TabsTrigger value="giftcards" className="text-xs h-7" data-testid="tab-giftcards">
                <CreditCard className="h-3 w-3 mr-1" />
                Cards
              </TabsTrigger>
              <TabsTrigger value="swaps" className="text-xs h-7" data-testid="tab-swaps">
                <Repeat className="h-3 w-3 mr-1" />
                Swap
              </TabsTrigger>
            </TabsList>

            {/* SDK Demo Tab */}
            <TabsContent value="sdk">
              <SDKDemoTab />
            </TabsContent>

            {/* Domain API Tab */}
            <TabsContent value="domains">
              <DomainAPITab />
            </TabsContent>

            {/* Gift Card API Tab */}
            <TabsContent value="giftcards">
              <GiftCardAPITab />
            </TabsContent>

            {/* Swap API Tab */}
            <TabsContent value="swaps">
              <SwapAPITab />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8">
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

// SDK Demo Tab Component
function SDKDemoTab() {
  const { toast } = useToast();
  const [generatedSecret, setGeneratedSecret] = useState('');
  const [uploadedSecret, setUploadedSecret] = useState('');
  const [commitment, setCommitment] = useState('');

  const handleGenerate = () => {
    const secret = ZektaSDK.generateIdentity();
    setGeneratedSecret(secret);
    toast({
      title: "Identity Generated!",
      description: "ZK identity created successfully"
    });
  };

  const handleDownload = () => {
    if (!generatedSecret) return;
    ZektaSDK.downloadIdentity(
      generatedSecret,
      'demo-user-' + Date.now(),
      'DeveloperPlayground',
      { timestamp: new Date().toISOString() }
    );
    toast({
      title: "Downloaded!",
      description: "Identity file saved"
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const secret = await ZektaSDK.uploadIdentityFile(file);
      setUploadedSecret(secret);
      const comm = ZektaSDK.getCommitment(secret);
      setCommitment(comm);
      toast({
        title: "Identity Loaded!",
        description: "Successfully parsed identity file"
      });
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive"
      });
    }
    e.target.value = '';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      {/* Left: Interactive Testing */}
      <div className="space-y-3">
        <Card className="border-gray-200">
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-900">Generate Identity</h3>
            <p className="text-xs text-gray-600 mt-0.5">
              Create a new zero-knowledge identity
            </p>
          </div>
          <div className="p-3 space-y-2">
            <Button onClick={handleGenerate} size="sm" className="w-full h-9" data-testid="button-generate">
              <Shield className="mr-2 h-3 w-3" />
              Generate New Identity
            </Button>
            
            {generatedSecret && (
              <div className="space-y-2">
                <div className="p-2 bg-blue-50 rounded border border-blue-200">
                  <p className="text-xs text-blue-700 mb-1 font-medium">Secret:</p>
                  <p className="font-mono text-xs text-blue-900 break-all" data-testid="text-generated-secret">
                    {generatedSecret.substring(0, 80)}...
                  </p>
                </div>
                <Button onClick={handleDownload} variant="outline" size="sm" className="w-full h-8" data-testid="button-download-identity">
                  <Download className="mr-2 h-3 w-3" />
                  Download
                </Button>
              </div>
            )}
          </div>
        </Card>

        <Card className="border-gray-200">
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-900">Upload & Verify</h3>
            <p className="text-xs text-gray-600 mt-0.5">
              Load identity file
            </p>
          </div>
          <div className="p-3 space-y-2">
            <input
              type="file"
              accept=".json,.txt"
              onChange={handleUpload}
              style={{ display: 'none' }}
              id="demo-upload"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('demo-upload')?.click()}
              className="w-full h-9"
              data-testid="button-upload"
            >
              <Upload className="mr-2 h-3 w-3" />
              Upload Identity File
            </Button>

            {uploadedSecret && (
              <div className="p-2 bg-green-50 border border-green-200 rounded" data-testid="card-identity-verified">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="h-3 w-3 text-green-600" />
                  <p className="text-xs font-semibold text-green-900">Verified</p>
                </div>
                <div>
                  <p className="text-xs text-green-700 mb-1 font-medium">Commitment:</p>
                  <p className="font-mono text-xs text-green-900 break-all" data-testid="text-commitment">{commitment}</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Right: Code Examples */}
      <div className="space-y-3">
        <CodeExample
          title="Generate Identity"
          code={`import { ZektaSDK } from '@/lib/zekta-sdk';

const secret = ZektaSDK.generateIdentity();
console.log(secret);

// Download for user
ZektaSDK.downloadIdentity(secret, 'user-123', 'MyApp');`}
        />

        <CodeExample
          title="Upload & Parse"
          code={`const handleUpload = async (file: File) => {
  const secret = await ZektaSDK.uploadIdentityFile(file);
  const commitment = ZektaSDK.getCommitment(secret);
  console.log('Commitment:', commitment);
};`}
        />

        <CodeExample
          title="Generate ZK Proof"
          code={`const proof = await ZektaSDK.generateProof(
  secret,
  groupMembers,
  commitment,
  commitment
);

await fetch('/api/verify', {
  method: 'POST',
  body: JSON.stringify({ proof, commitment })
});`}
        />
      </div>
    </div>
  );
}

// Domain API Tab Component
function DomainAPITab() {
  const { toast } = useToast();
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const handleCheckPrice = async () => {
    if (!domain) {
      toast({
        title: "Enter Domain",
        description: "Please enter a domain name",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/domains/pricing?domain=${domain}`);
      const data = await res.json();
      setResponse(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      <div className="space-y-3">
        <Card className="border-gray-200">
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-900">Check Domain Price</h3>
            <p className="text-xs text-gray-600 mt-0.5">
              Get real-time pricing
            </p>
          </div>
          <div className="p-3 space-y-2">
            <div>
              <Label htmlFor="domain" className="text-xs">Domain Name</Label>
              <Input
                id="domain"
                placeholder="example.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="mt-1 h-9 text-sm"
                data-testid="input-domain-name"
              />
            </div>

            <Button 
              onClick={handleCheckPrice}
              size="sm"
              className="w-full h-9"
              disabled={loading}
              data-testid="button-check-domain-price"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Check Price
                </>
              )}
            </Button>
          </div>
        </Card>

        {response && <ResponseViewer response={response} />}
      </div>

      <div className="space-y-4">
        <CodeExample
          title="Check Pricing"
          code={`const res = await fetch(
  '/api/domains/pricing?domain=${domain || 'example.com'}'
);
const data = await res.json();
// { ok: true, domain, priceEUR, currencies }`}
        />

        <CodeExample
          title="Purchase Domain"
          code={`const res = await fetch('/api/domains/order', {
  method: 'POST',
  body: JSON.stringify({
    domain: "${domain || 'example.com'}",
    currency: "SOL",
    years: 1
  })
});
// { orderId, paymentAddress, zkSecret }`}
        />
      </div>
    </div>
  );
}

// Gift Card API Tab Component
function GiftCardAPITab() {
  const { toast } = useToast();
  const [cardType, setCardType] = useState('amazon');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const handleGetProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/giftcards/products?brand=${cardType}`);
      const data = await res.json();
      setResponse(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      <div className="space-y-3">
        <Card className="border-gray-200">
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-900">Browse Gift Cards</h3>
            <p className="text-xs text-gray-600 mt-0.5">
              Explore products
            </p>
          </div>
          <div className="p-3 space-y-2">
            <div>
              <Label htmlFor="card-type" className="text-xs">Gift Card Type</Label>
              <Select value={cardType} onValueChange={setCardType}>
                <SelectTrigger id="card-type" className="mt-1 h-9" data-testid="select-card-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="amazon" data-testid="select-item-card-type-amazon">Amazon</SelectItem>
                  <SelectItem value="google" data-testid="select-item-card-type-google">Google Play</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleGetProducts}
              size="sm"
              className="w-full h-9"
              disabled={loading}
              data-testid="button-get-giftcard-products"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Get Products
                </>
              )}
            </Button>
          </div>
        </Card>

        {response && <ResponseViewer response={response} />}
      </div>

      <div className="space-y-4">
        <CodeExample
          title="Get Products"
          code={`const res = await fetch(
  '/api/giftcards/products?brand=${cardType}'
);
const data = await res.json();
// Returns available products`}
        />

        <CodeExample
          title="Purchase Card"
          code={`const res = await fetch('/api/giftcards/order', {
  method: 'POST',
  body: JSON.stringify({
    giftCardType: "${cardType}",
    denomination: 25,
    currency: "SOL"
  })
});
// { orderId, paymentAddress, giftCardSecret }`}
        />

        <CodeExample
          title="Retrieve with ZK Proof"
          code={`const proof = await ZektaSDK.generateProof(...);

const res = await fetch('/api/giftcards/verify-and-get', {
  method: 'POST',
  body: JSON.stringify({ proof, commitment })
});
// { cardNumber, cardPin, redeemInstructions }`}
        />
      </div>
    </div>
  );
}

// Swap API Tab Component
function SwapAPITab() {
  const { toast } = useToast();
  const [fromCurrency, setFromCurrency] = useState('SOL');
  const [toCurrency, setToCurrency] = useState('BTC');
  const [amount, setAmount] = useState('1');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const handleEstimate = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/swap/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: fromCurrency,
          to: toCurrency,
          amount: parseFloat(amount)
        })
      });
      const data = await res.json();
      setResponse(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      <div className="space-y-3">
        <Card className="border-gray-200">
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-900">Swap Estimator</h3>
            <p className="text-xs text-gray-600 mt-0.5">
              Get real-time estimates
            </p>
          </div>
          <div className="p-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="from" className="text-xs">From</Label>
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger id="from" className="mt-1 h-9" data-testid="select-from-currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SOL" data-testid="select-item-from-sol">SOL</SelectItem>
                    <SelectItem value="BTC" data-testid="select-item-from-btc">BTC</SelectItem>
                    <SelectItem value="ETH" data-testid="select-item-from-eth">ETH</SelectItem>
                    <SelectItem value="USDT" data-testid="select-item-from-usdt">USDT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="to" className="text-xs">To</Label>
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger id="to" className="mt-1 h-9" data-testid="select-to-currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BTC" data-testid="select-item-to-btc">BTC</SelectItem>
                    <SelectItem value="ETH" data-testid="select-item-to-eth">ETH</SelectItem>
                    <SelectItem value="SOL" data-testid="select-item-to-sol">SOL</SelectItem>
                    <SelectItem value="USDT" data-testid="select-item-to-usdt">USDT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="amount" className="text-xs">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="1.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 h-9 text-sm"
                data-testid="input-swap-amount"
              />
            </div>

            <Button 
              onClick={handleEstimate}
              size="sm"
              className="w-full h-9"
              disabled={loading}
              data-testid="button-estimate-swap"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Get Estimate
                </>
              )}
            </Button>
          </div>
        </Card>

        {response && <ResponseViewer response={response} />}
      </div>

      <div className="space-y-4">
        <CodeExample
          title="Estimate Swap"
          code={`const res = await fetch('/api/swap/estimate', {
  method: 'POST',
  body: JSON.stringify({
    from: "${fromCurrency}",
    to: "${toCurrency}",
    amount: ${amount}
  })
});
// { estimatedAmount, rate, fee }`}
        />

        <CodeExample
          title="Create Swap"
          code={`const res = await fetch('/api/swap/create', {
  method: 'POST',
  body: JSON.stringify({
    from: "${fromCurrency}",
    to: "${toCurrency}",
    amount: ${amount},
    recipientAddress: "your-address"
  })
});
// { swapId, paymentAddress }`}
        />

        <CodeExample
          title="ZK Swap (Anonymous)"
          code={`const proof = await ZektaSDK.generateProof(...);

const res = await fetch('/api/zkswap/create', {
  method: 'POST',
  body: JSON.stringify({
    from: "${fromCurrency}",
    to: "${toCurrency}",
    amount: ${amount},
    recipientAddress: "address",
    proof,
    commitment
  })
});
// Completely anonymous swap`}
        />
      </div>
    </div>
  );
}

// Reusable Components
function CodeExample({ title, code }: { title: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-2 py-1.5 border-b border-gray-200 flex items-center justify-between">
        <h4 className="text-xs font-semibold text-gray-900" data-testid={`text-code-title-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          {title}
        </h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyCode}
          className="h-6 px-1.5"
          data-testid={`button-copy-code-${title.toLowerCase().replace(/\s+/g, '-')}`}
        >
          {copied ? (
            <Check className="h-3 w-3 text-green-600" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>
      </div>
      <pre className="p-2 overflow-x-auto text-xs bg-white max-w-full" data-testid={`code-block-${title.toLowerCase().replace(/\s+/g, '-')}`}>
        <code className="text-gray-800 break-all whitespace-pre-wrap">{code}</code>
      </pre>
    </Card>
  );
}

function ResponseViewer({ response }: { response: any }) {
  const [copied, setCopied] = useState(false);

  const copyResponse = () => {
    navigator.clipboard.writeText(JSON.stringify(response, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isSuccess = response.ok !== false;

  return (
    <Card className="border-gray-200 overflow-hidden" data-testid="card-response-viewer">
      <div className={`px-2 py-1.5 border-b flex items-center justify-between ${
        isSuccess ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-center gap-1.5">
          {isSuccess ? (
            <CheckCircle2 className="h-3 w-3 text-green-600" />
          ) : (
            <AlertCircle className="h-3 w-3 text-red-600" />
          )}
          <h4 className={`text-xs font-semibold ${
            isSuccess ? 'text-green-900' : 'text-red-900'
          }`} data-testid="text-response-status">
            Response
          </h4>
          <Badge variant={isSuccess ? "default" : "destructive"} className="text-xs h-4 px-1" data-testid="badge-response-status">
            {isSuccess ? 'OK' : 'Error'}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyResponse}
          className="h-6 px-1.5"
          data-testid="button-copy-response"
        >
          {copied ? (
            <Check className="h-3 w-3 text-green-600" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>
      </div>
      <pre className="p-2 overflow-x-auto text-xs bg-white max-h-60 overflow-y-auto max-w-full" data-testid="text-response-body">
        <code className="text-gray-800 break-all">{JSON.stringify(response, null, 2)}</code>
      </pre>
    </Card>
  );
}
