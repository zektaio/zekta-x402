import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, Database, Globe, Cpu, Wallet, User, LogIn, DollarSign, History, ExternalLink, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Identity } from '@semaphore-protocol/identity';

interface X402Service {
  id: number;
  name: string;
  description: string;
  category: string;
  priceUSD: number;
  x402Endpoint: string;
  logoUrl: string | null;
  isActive: boolean;
}

interface X402User {
  id: number;
  zkCommitment: string;
  creditBalanceUSD: number;
  createdAt: Date;
}

interface X402Purchase {
  id: number;
  service: X402Service;
  priceUSDPaid: number;
  purchaseDate: string;
  txHash: string | null;
}

interface CreditTransaction {
  id: number;
  amountUSD: number;
  type: 'topup' | 'spend';
  description: string;
  txHash: string | null;
  createdAt: string;
}

const CATEGORY_ICONS: Record<string, any> = {
  AI: Sparkles,
  Data: Database,
  Web3: Globe,
  Infrastructure: Cpu,
};

const CATEGORY_COLORS: Record<string, string> = {
  AI: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
  Data: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  Web3: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
  Infrastructure: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
};

export default function X402Marketplace() {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState<X402User | null>(null);
  const [zkCommitment, setZkCommitment] = useState('');
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showTopUpDialog, setShowTopUpDialog] = useState(false);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [selectedService, setSelectedService] = useState<X402Service | null>(null);
  const [copied, setCopied] = useState(false);

  const { data: servicesResponse, isLoading } = useQuery<{ ok: boolean; services: X402Service[] }>({
    queryKey: ['/api/x402/services'],
  });

  const { data: purchasesResponse } = useQuery<{ ok: boolean; purchases: X402Purchase[] }>({
    queryKey: ['/api/x402/purchases'],
    enabled: !!currentUser,
  });

  const { data: transactionsResponse } = useQuery<{ ok: boolean; transactions: CreditTransaction[] }>({
    queryKey: ['/api/x402/credits/transactions'],
    enabled: !!currentUser,
  });

  const services = servicesResponse?.services || [];
  const purchases = purchasesResponse?.purchases || [];
  const transactions = transactionsResponse?.transactions || [];
  const categories = ['All', ...new Set(services.map(s => s.category))];

  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && service.isActive;
  });

  // Generate new zkID
  const generateZkId = () => {
    const identity = new Identity();
    const commitment = identity.commitment.toString();
    setZkCommitment(commitment);
    
    // Save identity to localStorage for later use (simplified - just store commitment)
    const identityData = {
      commitment: commitment,
      created: new Date().toISOString()
    };
    localStorage.setItem('zkIdentity', JSON.stringify(identityData));
    
    toast({
      title: "zkID Generated",
      description: "Your anonymous identity has been created. Save it securely!",
    });
  };

  // Load existing zkID
  const loadZkId = () => {
    const stored = localStorage.getItem('zkIdentity');
    if (stored) {
      const identity = JSON.parse(stored);
      setZkCommitment(identity.commitment);
      toast({
        title: "zkID Loaded",
        description: "Your identity has been loaded from local storage",
      });
    } else {
      toast({
        title: "No zkID Found",
        description: "Generate a new zkID to get started",
        variant: "destructive"
      });
    }
  };

  // Copy commitment
  const copyCommitment = () => {
    navigator.clipboard.writeText(zkCommitment);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "zkID commitment copied to clipboard",
    });
  };

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/x402/auth/register', {
        zkCommitment
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Registration Successful",
        description: "Your zkID has been registered on-chain",
      });
      loginMutation.mutate();
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register zkID",
        variant: "destructive"
      });
    }
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/x402/auth/login', {
        zkCommitment
      });
    },
    onSuccess: (data: any) => {
      setCurrentUser(data.user);
      setShowAuthDialog(false);
      toast({
        title: "Login Successful",
        description: `Welcome! Balance: $${data.user.creditBalanceUSD.toFixed(2)}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed", 
        description: error.message || "User not found. Please register first.",
        variant: "destructive"
      });
    }
  });

  // Top-up mutation
  const topUpMutation = useMutation({
    mutationFn: async (amount: number) => {
      return apiRequest('POST', '/api/x402/credits/topup', {
        zkCommitment: currentUser?.zkCommitment,
        amountUSD: amount,
        paymentMethod: 'crypto',
        currency: 'SOL',
        amountCrypto: amount / 100 // Mock conversion
      });
    },
    onSuccess: () => {
      toast({
        title: "Top-Up Initiated",
        description: "Payment processing. Credits will be added shortly.",
      });
      setShowTopUpDialog(false);
      queryClient.invalidateQueries({ queryKey: ['/api/x402/auth/me'] });
    }
  });

  // Purchase mutation
  const purchaseMutation = useMutation({
    mutationFn: async (serviceId: number) => {
      return apiRequest('POST', `/api/x402/purchase/${serviceId}`, {
        zkCommitment: currentUser?.zkCommitment
      });
    },
    onSuccess: (data: any) => {
      toast({
        title: "Purchase Successful!",
        description: `${data.service.name} access granted. New balance: $${data.newBalance.toFixed(2)}`,
      });
      setShowPurchaseDialog(false);
      setCurrentUser(prev => prev ? { ...prev, creditBalanceUSD: data.newBalance } : null);
    },
    onError: (error: any) => {
      toast({
        title: "Purchase Failed",
        description: error.message || "Insufficient credits or service unavailable",
        variant: "destructive"
      });
    }
  });

  const handlePurchase = (service: X402Service) => {
    if (!currentUser) {
      setShowAuthDialog(true);
      toast({
        title: "Login Required",
        description: "Please login with your zkID to purchase services",
      });
      return;
    }

    setSelectedService(service);
    setShowPurchaseDialog(true);
  };

  return (
    <div className="relative min-h-screen">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Top Bar - zkID & Credits */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Card className="bg-card/50 backdrop-blur">
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
                      <User className="w-3 h-3 mr-1 flex-shrink-0" />
                      zkID
                    </Badge>
                    {currentUser ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {currentUser.zkCommitment.slice(0, 10)}...{currentUser.zkCommitment.slice(-8)}
                        </span>
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">
                          Connected
                        </Badge>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Not connected</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {currentUser && (
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="font-semibold gradient-text text-lg">
                          ${currentUser.creditBalanceUSD.toFixed(2)}
                        </span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setShowTopUpDialog(true)}
                          data-testid="button-topup"
                        >
                          <DollarSign className="w-3 h-3 mr-1 flex-shrink-0" />
                          Top Up
                        </Button>
                      </div>
                    )}
                    
                    <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
                      <DialogTrigger asChild>
                        <Button variant="default" data-testid="button-login">
                          <LogIn className="w-4 h-4 mr-2 flex-shrink-0" />
                          {currentUser ? 'Switch zkID' : 'Login / Register'}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-lg" data-testid="dialog-auth">
                        <DialogHeader>
                          <DialogTitle>zkID Authentication</DialogTitle>
                          <DialogDescription>
                            Create or login with your anonymous Semaphore identity
                          </DialogDescription>
                        </DialogHeader>
                        
                        <Tabs defaultValue="login" className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="register">Register</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="login" className="space-y-4">
                            <div className="space-y-2">
                              <Label>zkID Commitment</Label>
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Enter your zkID commitment..."
                                  value={zkCommitment}
                                  onChange={(e) => setZkCommitment(e.target.value)}
                                  data-testid="input-commitment"
                                />
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={loadZkId}
                                  data-testid="button-load-zkid"
                                >
                                  Load
                                </Button>
                              </div>
                            </div>
                            <Button 
                              className="w-full" 
                              onClick={() => loginMutation.mutate()}
                              disabled={!zkCommitment || loginMutation.isPending}
                              data-testid="button-login-submit"
                            >
                              {loginMutation.isPending ? 'Logging in...' : 'Login'}
                            </Button>
                          </TabsContent>
                          
                          <TabsContent value="register" className="space-y-4">
                            <div className="space-y-4">
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  className="flex-1"
                                  onClick={generateZkId}
                                  data-testid="button-generate-zkid"
                                >
                                  <Sparkles className="w-4 h-4 mr-2 flex-shrink-0" />
                                  Generate New zkID
                                </Button>
                                <Button 
                                  variant="outline"
                                  onClick={loadZkId}
                                  data-testid="button-load-existing"
                                >
                                  Load Existing
                                </Button>
                              </div>
                              
                              {zkCommitment && (
                                <div className="p-4 bg-muted rounded-md space-y-2">
                                  <Label className="text-xs text-muted-foreground">Your zkID Commitment:</Label>
                                  <div className="flex items-center gap-2">
                                    <code className="flex-1 text-xs break-all">{zkCommitment}</code>
                                    <Button 
                                      size="icon" 
                                      variant="ghost"
                                      onClick={copyCommitment}
                                      data-testid="button-copy-commitment"
                                    >
                                      {copied ? <Check className="w-4 h-4 flex-shrink-0" /> : <Copy className="w-4 h-4 flex-shrink-0" />}
                                    </Button>
                                  </div>
                                  <p className="text-xs text-orange-400">
                                    ⚠️ Save this securely! It's stored in your browser but back it up.
                                  </p>
                                </div>
                              )}
                              
                              <Button 
                                className="w-full"
                                onClick={() => registerMutation.mutate()}
                                disabled={!zkCommitment || registerMutation.isPending}
                                data-testid="button-register-submit"
                              >
                                {registerMutation.isPending ? 'Registering...' : 'Register zkID'}
                              </Button>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6 mb-12"
          >
            <Badge className="px-6 py-2 text-base bg-purple-500/20 text-purple-400 border-purple-500/50">
              <Globe className="w-4 h-4 mr-2 flex-shrink-0" />
              x402 Protocol Marketplace
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              <span className="gradient-text">x402 Service Marketplace</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Access AI, data, and Web3 services instantly. Pay with any cryptocurrency via zkSwap.
            </p>

            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {['ZEKTA', 'SOL', 'BTC', 'ETH', 'BNB', 'MATIC', 'AVAX', 'ZEC'].map(crypto => (
                <Badge key={crypto} variant="outline" className="px-3 py-1">
                  {crypto}
                </Badge>
              ))}
            </div>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground flex-shrink-0" />
                <Input
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-services"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Badge
                  key={category}
                  className={`cursor-pointer px-4 py-2 ${
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover-elevate'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                  data-testid={`badge-category-${category.toLowerCase()}`}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </motion.div>

          {/* Services Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          ) : filteredServices.length === 0 ? (
            <Card className="p-12 text-center">
              <CardContent>
                <p className="text-muted-foreground">No services found matching your criteria</p>
              </CardContent>
            </Card>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredServices.map((service, index) => {
                const CategoryIcon = CATEGORY_ICONS[service.category] || Cpu;
                const categoryColor = CATEGORY_COLORS[service.category] || 'bg-gray-500/20 text-gray-400 border-gray-500/50';

                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="hover-elevate h-full flex flex-col" data-testid={`card-service-${service.id}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <Badge className={categoryColor}>
                            <CategoryIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                            {service.category}
                          </Badge>
                          <span className="text-xl font-bold gradient-text">
                            ${service.priceUSD.toFixed(3)}
                          </span>
                        </div>
                        <CardTitle className="text-xl">{service.name}</CardTitle>
                        <CardDescription className="text-sm line-clamp-3">
                          {service.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col justify-end">
                        <Button
                          className="w-full"
                          onClick={() => handlePurchase(service)}
                          disabled={!!(currentUser && currentUser.creditBalanceUSD < service.priceUSD)}
                          data-testid={`button-purchase-${service.id}`}
                        >
                          <Sparkles className="w-4 h-4 mr-2 flex-shrink-0" />
                          {currentUser && currentUser.creditBalanceUSD < service.priceUSD 
                            ? 'Insufficient Credits' 
                            : 'Purchase Access'}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Purchase Confirmation Dialog */}
          <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
            <DialogContent data-testid="dialog-purchase">
              <DialogHeader>
                <DialogTitle>Confirm Purchase</DialogTitle>
                <DialogDescription>
                  Review your purchase details
                </DialogDescription>
              </DialogHeader>
              
              {selectedService && (
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-md space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Service:</span>
                      <span className="font-semibold">{selectedService.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Price:</span>
                      <span className="font-semibold gradient-text">${selectedService.priceUSD.toFixed(3)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Current Balance:</span>
                      <span className="font-semibold">${currentUser?.creditBalanceUSD.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">After Purchase:</span>
                      <span className="font-semibold text-emerald-400">
                        ${((currentUser?.creditBalanceUSD || 0) - selectedService.priceUSD).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={() => purchaseMutation.mutate(selectedService.id)}
                    disabled={purchaseMutation.isPending}
                    data-testid="button-confirm-purchase"
                  >
                    {purchaseMutation.isPending ? 'Processing...' : 'Confirm Purchase'}
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Top-Up Dialog */}
          <Dialog open={showTopUpDialog} onOpenChange={setShowTopUpDialog}>
            <DialogContent data-testid="dialog-topup">
              <DialogHeader>
                <DialogTitle>Top-Up Credits</DialogTitle>
                <DialogDescription>
                  Add credits to your account using $ZEKTA or any supported cryptocurrency
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[10, 25, 50, 100].map(amount => (
                    <Button
                      key={amount}
                      variant="outline"
                      onClick={() => topUpMutation.mutate(amount)}
                      disabled={topUpMutation.isPending}
                      data-testid={`button-topup-${amount}`}
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>
                
                <div className="p-4 bg-muted rounded-md text-sm text-muted-foreground">
                  <p>💡 Credits can be purchased with:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>$ZEKTA token (direct payment)</li>
                    <li>SOL, BTC, ETH, USDC (via zkSwap)</li>
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Transaction History Section */}
          {currentUser && transactions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-16"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-blue-400 flex-shrink-0" />
                    Transaction History
                  </CardTitle>
                  <CardDescription>
                    Your credit top-ups and spending activity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {transactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between p-4 border border-border rounded-md hover-elevate"
                        data-testid={`transaction-${tx.id}`}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 ${
                            tx.type === 'topup' 
                              ? 'bg-emerald-500/20' 
                              : 'bg-red-500/20'
                          }`}>
                            <DollarSign className={`w-5 h-5 ${
                              tx.type === 'topup' 
                                ? 'text-emerald-400' 
                                : 'text-red-400'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">
                              {tx.type === 'topup' ? 'Credit Top-Up' : 'Service Purchase'}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {tx.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(tx.createdAt).toLocaleDateString()} at{' '}
                              {new Date(tx.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge 
                            variant="outline" 
                            className={`font-mono ${
                              tx.type === 'topup'
                                ? 'border-emerald-500/50 text-emerald-400'
                                : 'border-red-500/50 text-red-400'
                            }`}
                          >
                            {tx.type === 'topup' ? '+' : '-'}${Math.abs(tx.amountUSD).toFixed(2)}
                          </Badge>
                          {tx.txHash && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => window.open(`https://basescan.org/tx/${tx.txHash}`, '_blank')}
                              data-testid={`button-view-tx-${tx.id}`}
                            >
                              <ExternalLink className="w-4 h-4 flex-shrink-0" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Purchase History Section */}
          {currentUser && purchases.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-16"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                    Purchase History
                  </CardTitle>
                  <CardDescription>
                    Your recent service purchases and transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {purchases.map((purchase) => (
                      <div
                        key={purchase.id}
                        className="flex items-center justify-between p-4 border border-border rounded-md hover-elevate"
                        data-testid={`purchase-${purchase.id}`}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                            {CATEGORY_ICONS[purchase.service.category] && (
                              <div className="w-5 h-5 text-primary">
                                {(() => {
                                  const Icon = CATEGORY_ICONS[purchase.service.category];
                                  return <Icon className="w-5 h-5" />;
                                })()}
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{purchase.service.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(purchase.purchaseDate).toLocaleDateString()} at{' '}
                              {new Date(purchase.purchaseDate).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className="font-mono">
                            ${purchase.priceUSDPaid.toFixed(4)}
                          </Badge>
                          {purchase.txHash && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => window.open(`https://basescan.org/tx/${purchase.txHash}`, '_blank')}
                              data-testid={`button-view-tx-${purchase.id}`}
                            >
                              <ExternalLink className="w-4 h-4 flex-shrink-0" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16"
          >
            <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-6 h-6 text-purple-400 flex-shrink-0" />
                  How it works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">1</Badge>
                      <h3 className="font-semibold">Create zkID</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Generate your anonymous Semaphore identity for privacy-first authentication
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">2</Badge>
                      <h3 className="font-semibold">Top-Up Credits</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Add credits using $ZEKTA token or any supported cryptocurrency via zkSwap
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">3</Badge>
                      <h3 className="font-semibold">Purchase Services</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Buy AI, data, and Web3 services instantly with your credits
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    All transactions are processed via x402 protocol on Base. Your zkID keeps you anonymous while enabling seamless service access. 
                    Payments are converted to USDC automatically. No KYC, no accounts, just pure decentralized access.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
