import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  Smartphone, 
  Gamepad2, 
  Music,
  ArrowLeft,
  Wallet,
  Clock,
  CheckCircle2,
  Copy,
  ExternalLink,
  Shield,
  AlertCircle,
  Download,
  Key,
  Loader2,
  XCircle,
  Eye,
  EyeOff,
  Gift,
  Trash2,
  Upload
} from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { Identity } from '@semaphore-protocol/identity';
import { generateProof } from '@semaphore-protocol/proof';
import { Group } from '@semaphore-protocol/group';
import { QRCodeSVG } from 'qrcode.react';

interface GiftCardOption {
  id: string;
  name: string;
  description: string;
  category: string;
  denominations: number[];
  icon: string;
  imageUrl?: string;
  popular?: boolean;
  country: string;
  countryCode: string;
  countryFlag: string;
}

const iconMap: Record<string, any> = {
  'shopping-bag': ShoppingBag,
  'smartphone': Smartphone,
  'gamepad-2': Gamepad2,
  'music': Music
};

const cryptoOptions = [
  { value: 'BTC', label: 'Bitcoin (BTC)' },
  { value: 'ETH', label: 'Ethereum (ETH)' },
  { value: 'SOL', label: 'Solana (SOL)' },
  { value: 'USDT', label: 'Tether (USDT)' },
  { value: 'USDC', label: 'USD Coin (USDC)' },
  { value: 'BNB', label: 'BNB' },
  { value: 'MATIC', label: 'Polygon (MATIC)' },
];

export default function GiftCards() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const [activeTab, setActiveTab] = useState<"buy" | "track" | "mycards">("buy");
  const [selectedCard, setSelectedCard] = useState<string>('');
  const [selectedDenomination, setSelectedDenomination] = useState<number>(0);
  const [selectedCrypto, setSelectedCrypto] = useState<string>('');
  const [orderData, setOrderData] = useState<any>(null);
  const [savedIdentity, setSavedIdentity] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  
  // Track order states
  const [trackOrderId, setTrackOrderId] = useState<string>('');
  const [searchOrderId, setSearchOrderId] = useState<string>('');
  
  // My gift cards states
  const [myCardsIdentitySecret, setMyCardsIdentitySecret] = useState('');
  const [savedGiftCards, setSavedGiftCards] = useState<any[]>([]);
  const [showSecretManager, setShowSecretManager] = useState(false);
  const [showRedemptionCodes, setShowRedemptionCodes] = useState<Record<string, boolean>>({});
  const [myCardsOrders, setMyCardsOrders] = useState<any[]>([]);
  const [isMyCardsConnected, setIsMyCardsConnected] = useState(false);

  // Fetch gift card catalog
  const { data: catalogData, isLoading: catalogLoading } = useQuery({
    queryKey: ['/api/giftcards/catalog'],
    enabled: true
  });

  const allCatalog: GiftCardOption[] = (catalogData as any)?.catalog || [];
  
  // Get unique brands and countries
  const brands = ['All', ...Array.from(new Set(allCatalog.map(card => card.category)))];
  const countries = ['All', ...Array.from(new Set(allCatalog.map(card => card.country)))];
  
  // Filter catalog by brand and country
  let catalog = allCatalog;
  if (selectedBrand !== 'All') {
    catalog = catalog.filter(card => card.category === selectedBrand);
  }
  if (selectedCountry !== 'All') {
    catalog = catalog.filter(card => card.country === selectedCountry);
  }

  // Poll order status (for payment phase in buy tab)
  const { data: orderStatus } = useQuery({
    queryKey: ['/api/giftcards/order', orderData?.orderId],
    enabled: !!orderData?.orderId && activeTab === "buy",
    refetchInterval: 5000, // Poll every 5 seconds
    queryFn: async () => {
      const response = await fetch(`/api/giftcards/order/${orderData.orderId}`);
      const data = await response.json();
      return data.ok ? data.order : null;
    }
  });

  // Track order query (for track tab)
  const { data: trackedOrder, isLoading: trackLoading, error: trackError, refetch: refetchTracked } = useQuery<any>({
    queryKey: ["/api/giftcards/order", searchOrderId],
    enabled: !!searchOrderId && activeTab === "track",
    refetchInterval: 1000, // Auto-refresh every 1 second
    queryFn: async () => {
      const response = await fetch(`/api/giftcards/order/${searchOrderId}`);
      const data = await response.json();
      return data.ok ? data : null;
    }
  });

  // Mock payment mutation
  const mockPaymentMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const response = await apiRequest('POST', `/api/giftcards/mock-payment/${orderId}`, {});
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Payment Marked as Sent!",
        description: "Gift card has been delivered"
      });
      refetchTracked();
      queryClient.invalidateQueries({ queryKey: ["/api/giftcards/order", searchOrderId] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to mark payment",
        variant: "destructive"
      });
    }
  });

  // My Cards: Verify proof and fetch gift cards
  const verifyAndFetchMyCardsMutation = useMutation({
    mutationFn: async (secret: string) => {
      // Convert secret string to Uint8Array (same as Buy Domain)
      // Secret is stored as comma-separated numbers: "1,2,3,4" -> Uint8Array([1,2,3,4])
      const privateKeyArray = new Uint8Array(
        secret.split(',').map(n => parseInt(n.trim(), 10))
      );
      const identity = new Identity(privateKeyArray);
      const commitment = identity.commitment.toString();

      // Fetch current Semaphore group
      const groupResponse = await fetch('/api/giftcards/group');
      const groupData = await groupResponse.json();
      
      if (!groupData.ok) {
        throw new Error('Failed to fetch group data');
      }

      const group = new Group(groupData.members);
      
      // Generate ZK proof (externalNullifier=commitment, message=commitment)
      const proof = await generateProof(identity, group, commitment, commitment);
      
      // Verify proof and get gift cards
      const response = await apiRequest('POST', '/api/giftcards/verify-and-get', {
        proof: {
          merkleTreeDepth: proof.merkleTreeDepth,
          merkleTreeRoot: proof.merkleTreeRoot,
          nullifier: proof.nullifier,
          message: proof.message,
          scope: proof.scope,
          points: proof.points
        },
        signal: commitment,
        zkCommitment: commitment
      });
      
      return response.json();
    },
    onSuccess: (data) => {
      if (data.ok && data.orders) {
        setMyCardsOrders(data.orders);
        setIsMyCardsConnected(true);
        
        // Auto-save gift card secrets for each order
        data.orders.forEach((order: any) => {
          saveGiftCardSecret(order, myCardsIdentitySecret);
        });
        
        toast({
          title: "✅ Authenticated!",
          description: `Found ${data.orders.length} gift card(s)`
        });
      } else {
        toast({
          title: "No Gift Cards Found",
          description: "No gift cards found for this passkey",
          variant: "destructive"
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Authentication Failed",
        description: error.message || "Invalid passkey or proof verification failed",
        variant: "destructive"
      });
    }
  });

  // Create gift card order
  const createOrderMutation = useMutation({
    mutationFn: async (data: { giftCardType: string; denomination: number; currency: string }) => {
      const response = await apiRequest('POST', '/api/giftcards/order', data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.ok) {
        // Set order data so download button works
        setOrderData(data);
        
        // Save gift card secret from backend
        if (data.giftCardSecret) {
          setSavedIdentity(data.giftCardSecret);
        }
        
        // Save to localStorage for auto-tracking
        localStorage.setItem('zekta_last_order_id', data.orderId);
        
        // Auto-save ZK identity to localStorage
        if (data.zkCommitment && data.giftCardSecret) {
          try {
            // Save to localStorage for later retrieval
            const savedCards = JSON.parse(localStorage.getItem('zekta_saved_giftcards') || '[]');
            savedCards.push({
              orderId: data.orderId,
              giftCardType: data.giftCardType,
              denomination: data.denomination,
              identitySecret: data.giftCardSecret,
              createdAt: new Date().toISOString()
            });
            localStorage.setItem('zekta_saved_giftcards', JSON.stringify(savedCards));
            
            console.log('✅ Gift card identity saved:', data.orderId);
          } catch (error) {
            console.error('Error saving identity:', error);
          }
        }
        
        toast({
          title: "Order Created!",
          description: "Download your passkey now - you'll need it to access your gift card!"
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create order",
          variant: "destructive"
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create order",
        variant: "destructive"
      });
    }
  });

  const handlePurchase = () => {
    console.log('Purchase attempt:', { 
      selectedCard, 
      selectedDenomination, 
      selectedCrypto,
      hasCard: !!selectedCard,
      hasDenom: !!selectedDenomination,
      hasCrypto: !!selectedCrypto
    });
    
    if (!selectedCard || !selectedDenomination || !selectedCrypto) {
      toast({
        title: "Missing Information",
        description: "Please select gift card, denomination, and payment currency",
        variant: "destructive"
      });
      return;
    }

    const payload = {
      giftCardType: selectedCard,
      denomination: selectedDenomination,
      currency: selectedCrypto
    };
    
    console.log('Sending payload to backend:', payload);
    
    // Backend generates ZK identity and returns secret
    createOrderMutation.mutate(payload);
  };

  const handleCopyAddress = () => {
    if (orderData?.depositAddress) {
      navigator.clipboard.writeText(orderData.depositAddress);
      toast({
        title: "Copied!",
        description: "Deposit address copied to clipboard"
      });
    }
  };

  const handleCopyAmount = () => {
    if (orderData?.amountCrypto) {
      navigator.clipboard.writeText(orderData.amountCrypto.toString());
      toast({
        title: "Copied!",
        description: "Amount copied to clipboard"
      });
    }
  };

  const handleDownloadIdentity = () => {
    if (savedIdentity && orderData) {
      // savedIdentity is already a proper string from backend
      console.log('Downloading passkey:', {
        type: typeof savedIdentity,
        length: savedIdentity.length,
        preview: savedIdentity.substring(0, 80)
      });
      
      // Use JSON format for reliable parsing (no line-break issues)
      const passkeyData = {
        giftCardPasskey: savedIdentity,
        giftCard: selectedGiftCard?.name,
        amount: orderData.denomination,
        orderId: orderData.orderId,
        created: new Date().toISOString(),
        warning: "WARNING: Keep this file safe! We cannot recover this passkey if you lose it."
      };
      
      const blob = new Blob(
        [JSON.stringify(passkeyData, null, 2)],
        { type: 'application/json' }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `zekta-giftcard-${orderData.orderId}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Passkey Downloaded!",
        description: "JSON file saved. Store it securely!"
      });
    }
  };

  const handleGoToTracking = () => {
    setActiveTab("track");
  };

  // Auto-load last order ID when switching to Track tab
  useEffect(() => {
    if (activeTab === "track") {
      const lastOrderId = localStorage.getItem('zekta_last_order_id');
      if (lastOrderId) {
        setTrackOrderId(lastOrderId);
        setSearchOrderId(lastOrderId); // Auto-trigger search
      }
    }
  }, [activeTab]);

  const selectedGiftCard = catalog.find(c => c.id === selectedCard);
  const Icon = selectedGiftCard ? iconMap[selectedGiftCard.icon] : ShoppingBag;

  // Reset when starting over
  const handleStartOver = () => {
    setOrderData(null);
    setSelectedCard('');
    setSelectedDenomination(0);
    setSelectedCrypto('');
    setSavedIdentity('');
  };

  // My Cards: Load saved gift cards from localStorage
  const loadSavedGiftCards = () => {
    const saved = localStorage.getItem('zekta_saved_giftcards');
    if (saved) {
      try {
        const cards = JSON.parse(saved) as any[];
        setSavedGiftCards(cards);
        return cards;
      } catch (error) {
        console.error('Error loading saved gift cards:', error);
        return [];
      }
    }
    return [];
  };

  // My Cards: Save gift card secret permanently (with full order data)
  const saveGiftCardSecret = (order: any, secret: string) => {
    try {
      const saved = loadSavedGiftCards();
      
      const existingIndex = saved.findIndex(d => d.orderId === order.orderId);
      
      const newCard = {
        orderId: order.orderId,
        giftCardType: order.giftCardType,
        denomination: order.denomination,
        identitySecret: secret,
        createdAt: order.createdAt,
        // Include redemption payload if available
        cardNumber: order.cardNumber,
        cardPin: order.cardPin,
        redeemInstructions: order.redeemInstructions,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus
      };
      
      if (existingIndex >= 0) {
        saved[existingIndex] = newCard;
      } else {
        saved.push(newCard);
      }
      
      localStorage.setItem('zekta_saved_giftcards', JSON.stringify(saved));
      setSavedGiftCards(saved);
    } catch (error) {
      console.error('Error saving gift card secret:', error);
    }
  };

  // My Cards: Delete saved gift card
  const deleteGiftCard = (orderId: string) => {
    const saved = loadSavedGiftCards();
    const filtered = saved.filter(d => d.orderId !== orderId);
    localStorage.setItem('zekta_saved_giftcards', JSON.stringify(filtered));
    setSavedGiftCards(filtered);
    
    toast({
      title: "Gift Card Removed",
      description: "Gift card has been removed from your saved list"
    });
  };

  // My Cards: Load saved gift cards on tab switch
  useEffect(() => {
    if (activeTab === "mycards") {
      loadSavedGiftCards();
    }
  }, [activeTab]);

  // My Cards: Connect handler
  const handleMyCardsConnect = () => {
    if (!myCardsIdentitySecret) {
      toast({
        title: "Missing Secret",
        description: "Please enter your gift card passkey",
        variant: "destructive"
      });
      return;
    }
    verifyAndFetchMyCardsMutation.mutate(myCardsIdentitySecret);
  };

  // My Cards: Select saved handler
  const handleSelectSaved = (secret: string) => {
    setMyCardsIdentitySecret(secret);
    verifyAndFetchMyCardsMutation.mutate(secret);
  };

  // My Cards: Disconnect handler
  const handleMyCardsDisconnect = () => {
    setMyCardsIdentitySecret('');
    setMyCardsOrders([]);
    setIsMyCardsConnected(false);
  };

  // My Cards: File upload handler
  const handleMyCardsFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      let passkey = '';
      
      // Try JSON format first
      try {
        const data = JSON.parse(content);
        if (data.giftCardPasskey) {
          passkey = String(data.giftCardPasskey).trim(); // Ensure string and trim
        }
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError);
      }
      
      if (passkey && passkey.length > 50) {
        setMyCardsIdentitySecret(passkey);
        toast({
          title: "Passkey Loaded!",
          description: "File uploaded successfully"
        });
      } else {
        console.error('Invalid passkey:', { passkey, length: passkey?.length });
        toast({
          title: "Upload Failed",
          description: `Could not find valid passkey in file${passkey ? ` (length: ${passkey.length})` : ''}`,
          variant: "destructive"
        });
      }
    };
    
    reader.readAsText(file);
    event.target.value = '';
  };

  // My Cards: Toggle show code
  const toggleShowCode = (orderId: string) => {
    setShowRedemptionCodes(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  // My Cards: Copy handlers
  const handleCopyCardNumber = (cardNumber: string) => {
    navigator.clipboard.writeText(cardNumber);
    toast({ title: "Copied!", description: "Card number copied to clipboard" });
  };

  const handleCopyPin = (pin: string) => {
    navigator.clipboard.writeText(pin);
    toast({ title: "Copied!", description: "PIN code copied to clipboard" });
  };

  const giftCardNames: Record<string, string> = {
    'amazon_us': 'Amazon US',
    'google_play_us': 'Google Play US',
    'steam': 'Steam',
    'spotify': 'Spotify'
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
        
        <div className="container mx-auto px-4 relative z-10 max-w-5xl">
          <Link href="/">
            <Button variant="ghost" className="mb-6" data-testid="button-back">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Anonymous Gift Cards
                </h1>
                <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20 text-xs">
                  Coming Soon
                </Badge>
              </div>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
                Purchase Amazon & Google Play gift cards with cryptocurrency. Complete privacy with zero-knowledge proofs.
              </p>
              
              {(catalogData as any)?.demo && (
                <Card className="max-w-2xl mx-auto border-amber-500/50 bg-amber-500/5 mb-6">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div className="text-left flex-1">
                        <p className="font-semibold text-amber-500 mb-1">Demo Mode Active</p>
                        <p className="text-sm text-muted-foreground">
                          This is a demonstration of the gift card system. Mock gift cards are shown for testing. 
                          Real gift cards will be available once the Reloadly account is fully activated.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Tabs Navigation */}
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full max-w-2xl mx-auto">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="buy" data-testid="tab-buy-giftcard">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Buy Gift Card
                  </TabsTrigger>
                  <TabsTrigger value="track" data-testid="tab-track-giftcard">
                    <Clock className="w-4 h-4 mr-2" />
                    Track Order
                  </TabsTrigger>
                  <TabsTrigger value="mycards" data-testid="tab-my-giftcards">
                    <Key className="w-4 h-4 mr-2" />
                    My Gift Cards
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Tab Content */}
            {activeTab === "buy" && !orderData ? (
              // Selection Phase
              <Card className="p-8">
                <div className="space-y-8">
                  {/* Gift Card Selection */}
                  <div>
                    <Label className="text-lg font-semibold mb-4 block" htmlFor="select-giftcard">
                      Select Gift Card
                    </Label>
                    
                    {catalogLoading ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Loading catalog...
                      </div>
                    ) : allCatalog.length === 0 ? (
                      <div className="text-center py-8">
                        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">No gift cards available at this time</p>
                      </div>
                    ) : (
                      <div>
                        {/* Brand & Country Filters */}
                        <div className="mb-6 flex flex-wrap gap-4">
                          <div className="flex-1 min-w-[200px]">
                            <Label className="text-sm mb-2 block">Brand</Label>
                            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                              <SelectTrigger data-testid="select-brand">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {brands.map((brand) => (
                                  <SelectItem key={brand} value={brand}>
                                    {brand} {brand !== 'All' && `(${allCatalog.filter(c => c.category === brand).length})`}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="flex-1 min-w-[200px]">
                            <Label className="text-sm mb-2 block">Country</Label>
                            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                              <SelectTrigger data-testid="select-country">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {countries.map((country) => (
                                  <SelectItem key={country} value={country}>
                                    {country}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Gift Cards Grid */}
                        {catalog.length === 0 ? (
                          <div className="text-center py-8">
                            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-muted-foreground">No gift cards in this category</p>
                          </div>
                        ) : (
                      <div className="grid md:grid-cols-2 gap-6">
                        {catalog.map((card) => {
                          const CardIcon = iconMap[card.icon] || ShoppingBag;
                          return (
                            <Card
                              key={card.id}
                              className={`cursor-pointer transition-all hover-elevate overflow-hidden ${
                                selectedCard === card.id ? 'ring-2 ring-primary shadow-lg' : ''
                              }`}
                              onClick={() => {
                                setSelectedCard(card.id);
                                setSelectedDenomination(0);
                              }}
                              data-testid={`card-giftcard-${card.id}`}
                            >
                              {card.imageUrl && (
                                <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10">
                                  <img 
                                    src={card.imageUrl} 
                                    alt={card.name}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
                                    <Badge variant="secondary" className="text-base px-3 py-1 font-medium">
                                      {card.countryFlag} {card.countryCode}
                                    </Badge>
                                    {card.popular && (
                                      <Badge 
                                        variant="default" 
                                        className="bg-primary text-primary-foreground"
                                      >
                                        Popular
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              )}
                              <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                  <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                                    <CardIcon className="h-6 w-6 text-primary" />
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-xl mb-1">{card.name}</h3>
                                    <p className="text-sm text-muted-foreground mb-3">{card.country}</p>
                                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{card.description}</p>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      {card.denominations.slice(0, 4).map((denom, idx) => (
                                        <Badge key={idx} variant="outline" className="text-xs">
                                          ${denom}
                                        </Badge>
                                      ))}
                                      {card.denominations.length > 4 && (
                                        <Badge variant="outline" className="text-xs">
                                          +{card.denominations.length - 4} more
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Denomination Selection */}
                  {selectedCard && selectedGiftCard && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <Label className="text-lg font-semibold" htmlFor="select-denomination">
                        Select Amount (USD)
                      </Label>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                        {selectedGiftCard.denominations.map((denom) => (
                          <Button
                            key={denom}
                            variant={selectedDenomination === denom ? 'default' : 'outline'}
                            onClick={() => setSelectedDenomination(denom)}
                            className="h-16 text-lg font-semibold"
                            data-testid={`button-denom-${denom}`}
                          >
                            ${denom}
                          </Button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Cryptocurrency Selection */}
                  {selectedDenomination > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <Label className="text-lg font-semibold" htmlFor="select-crypto">
                        Pay With
                      </Label>
                      <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                        <SelectTrigger className="w-full h-14" id="select-crypto" data-testid="select-crypto">
                          <SelectValue placeholder="Select cryptocurrency" />
                        </SelectTrigger>
                        <SelectContent>
                          {cryptoOptions.map((crypto) => (
                            <SelectItem key={crypto.value} value={crypto.value}>
                              {crypto.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </motion.div>
                  )}

                  {/* Purchase Button */}
                  {selectedCrypto && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="pt-4"
                    >
                      <Button
                        onClick={handlePurchase}
                        disabled={createOrderMutation.isPending}
                        className="w-full h-14 text-lg"
                        size="lg"
                        data-testid="button-create-order"
                      >
                        {createOrderMutation.isPending ? (
                          'Creating Order...'
                        ) : (
                          <>
                            <Shield className="mr-2 h-5 w-5" />
                            Create Anonymous Order
                          </>
                        )}
                      </Button>
                      
                      <div className="mt-4 p-4 bg-primary/5 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Shield className="h-5 w-5 text-primary mt-0.5" />
                          <div className="text-sm">
                            <p className="font-medium mb-1">Zero-Knowledge Privacy</p>
                            <p className="text-muted-foreground">
                              Your identity will be protected by cryptographic proofs. No personal information required.
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </Card>
            ) : activeTab === "buy" && orderData ? (
              // Payment Phase
              <div className="space-y-6">
                {/* Payment Status */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl">Payment Required</CardTitle>
                        <CardDescription className="mt-2">
                          Send exactly {orderData.amountCrypto} {orderData.currency} to the address below
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-primary">
                          ${orderData.denomination}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {selectedGiftCard?.name}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Demo Mode Warning */}
                    {(orderData as any)?.demo && (
                      <Card className="border-amber-500/50 bg-amber-500/5">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="font-semibold text-amber-500 mb-1">Demo Mode - No Payment Required</p>
                              <p className="text-sm text-muted-foreground">
                                {(orderData as any)?.demoMessage || 'This is a demonstration. Real gift cards will be available after system activation.'}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    
                    {/* QR Code */}
                    <div className="flex justify-center p-6 bg-white rounded-lg">
                      <QRCodeSVG
                        value={orderData.depositAddress}
                        size={200}
                        level="H"
                        includeMargin={true}
                      />
                    </div>

                    {/* Deposit Address */}
                    <div>
                      <Label className="mb-2 block">Deposit Address</Label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={orderData.depositAddress}
                          readOnly
                          className="flex-1 px-4 py-3 bg-muted rounded-lg font-mono text-sm"
                          data-testid="input-deposit-address"
                        />
                        <Button onClick={handleCopyAddress} variant="outline" data-testid="button-copy-address">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Amount */}
                    <div>
                      <Label className="mb-2 block">Amount to Send</Label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={`${orderData.amountCrypto} ${orderData.currency}`}
                          readOnly
                          className="flex-1 px-4 py-3 bg-muted rounded-lg font-mono text-sm"
                          data-testid="input-amount"
                        />
                        <Button onClick={handleCopyAmount} variant="outline" data-testid="button-copy-amount">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Order Status */}
                    <div className="p-4 rounded-lg bg-muted">
                      <div className="flex items-center gap-3">
                        {orderStatus?.paymentStatus === 'paid' ? (
                          <>
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            <div className="flex-1">
                              <p className="font-medium text-green-500">Payment Confirmed!</p>
                              <p className="text-sm text-muted-foreground">
                                {orderStatus?.orderStatus === 'delivered' 
                                  ? 'Your gift card is ready!'
                                  : 'Processing your gift card...'}
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <Clock className="h-5 w-5 text-orange-500 animate-pulse" />
                            <div className="flex-1">
                              <p className="font-medium">Waiting for Payment</p>
                              <p className="text-sm text-muted-foreground">
                                Expires: {new Date(orderData.expiresAt).toLocaleString()}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Identity Security Warning */}
                    <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                      <div className="flex items-start gap-3">
                        <Key className="h-5 w-5 text-orange-500 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium text-orange-500 mb-2">Save Your Identity</p>
                          <p className="text-sm text-muted-foreground mb-3">
                            Your zero-knowledge identity is required to access your gift card. Save it now - you won't be able to retrieve it later!
                          </p>
                          <Button
                            onClick={handleDownloadIdentity}
                            variant="outline"
                            size="sm"
                            className="border-orange-500/50 hover:bg-orange-500/10"
                            data-testid="button-download-identity"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download Identity File
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleStartOver}
                        variant="outline"
                        className="flex-1"
                        data-testid="button-start-over"
                      >
                        Start Over
                      </Button>
                      <Button
                        onClick={handleGoToTracking}
                        className="flex-1"
                        data-testid="button-go-tracking"
                      >
                        Track Order
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : activeTab === "track" ? (
              // Track Order Tab
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Track Gift Card Order</CardTitle>
                    <CardDescription>Enter your Order ID (ZK-GC-...) or Exchange ID to track your gift card purchase</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Input
                        placeholder="ZK-GC-... or Exchange ID"
                        value={trackOrderId}
                        onChange={(e) => setTrackOrderId(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && setSearchOrderId(trackOrderId.trim())}
                        data-testid="input-track-order-id"
                      />
                      <Button 
                        onClick={() => setSearchOrderId(trackOrderId.trim())} 
                        disabled={!trackOrderId.trim() || trackLoading}
                        data-testid="button-track-search"
                      >
                        {trackLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ExternalLink className="h-4 w-4" />}
                        Search
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {trackError && (
                  <Alert variant="destructive" data-testid="alert-track-error">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      Order not found. Please check your Order ID and try again.
                    </AlertDescription>
                  </Alert>
                )}

                {trackedOrder?.order && (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle data-testid="text-tracked-order-title">
                            {trackedOrder.order.giftCardType?.replace(/_/g, ' ')} - ${trackedOrder.order.denomination}
                          </CardTitle>
                          <Badge 
                            className={trackedOrder.order.orderStatus === 'delivered' ? 'bg-green-600' : 'bg-yellow-600'}
                            data-testid="badge-tracked-status"
                          >
                            {trackedOrder.order.orderStatus === 'delivered' ? 'Delivered' : 'Awaiting Payment'}
                          </Badge>
                        </div>
                        <CardDescription data-testid="text-tracked-order-id">
                          Order ID: {trackedOrder.order.orderId}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Price</p>
                            <p className="font-medium" data-testid="text-tracked-price">
                              ${trackedOrder.order.denomination}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Currency</p>
                            <p className="font-medium" data-testid="text-tracked-currency">
                              {trackedOrder.order.currency}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Amount</p>
                            <p className="font-medium" data-testid="text-tracked-amount">
                              {trackedOrder.order.amountCrypto.toFixed(8)} {trackedOrder.order.currency}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Created</p>
                            <p className="font-medium" data-testid="text-tracked-created">
                              {new Date(trackedOrder.order.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Mock Payment Button */}
                        {trackedOrder.order.paymentStatus !== "paid" && (
                          <div className="pt-4 border-t">
                            <Alert className="mb-4 bg-amber-500/10 border-amber-500/50">
                              <AlertDescription>
                                <strong className="text-amber-600">Demo Mode:</strong> Click the button below to simulate payment completion
                              </AlertDescription>
                            </Alert>
                            <Button
                              onClick={() => mockPaymentMutation.mutate(trackedOrder.order.orderId)}
                              disabled={mockPaymentMutation.isPending}
                              className="w-full"
                              data-testid="button-tracked-mock-payment"
                            >
                              {mockPaymentMutation.isPending ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  Mark as Sent (Mock Payment)
                                </>
                              )}
                            </Button>
                          </div>
                        )}

                        {/* Gift Card Delivered Message */}
                        {trackedOrder.order.orderStatus === "delivered" && (
                          <div className="pt-4 border-t">
                            <Alert className="bg-green-500/10 border-green-500/50">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              <AlertDescription className="text-green-700">
                                <strong>Gift Card Delivered!</strong> Go to <strong>My Gift Cards</strong> tab and upload your passkey to view card details
                              </AlertDescription>
                            </Alert>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            ) : activeTab === "mycards" ? (
              // My Gift Cards Tab - full embedded UI
              <div className="space-y-6">
                {!isMyCardsConnected ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Key className="w-5 h-5" />
                        Enter Your ZK Passkey
                      </CardTitle>
                      <CardDescription>
                        Enter the identity secret you saved when purchasing your gift card
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <Alert>
                        <Gift className="w-4 h-4" />
                        <AlertDescription>
                          Your ZK passkey is the identity secret you saved when purchasing. Upload the JSON file or paste the secret.
                        </AlertDescription>
                      </Alert>

                      <div className="space-y-2">
                        <Label htmlFor="my-cards-passkey">Identity Secret (ZK Passkey)</Label>
                        <Input
                          id="my-cards-passkey"
                          type="password"
                          placeholder="Paste your identity secret here..."
                          value={myCardsIdentitySecret}
                          onChange={(e) => setMyCardsIdentitySecret(e.target.value)}
                          data-testid="input-mycards-passkey"
                          className="font-mono text-sm"
                        />
                        <div className="flex items-center gap-2 pt-2">
                          <div className="h-px bg-border flex-1" />
                          <span className="text-xs text-muted-foreground">or</span>
                          <div className="h-px bg-border flex-1" />
                        </div>
                        <div>
                          <input
                            type="file"
                            accept=".json,.txt"
                            onChange={handleMyCardsFileUpload}
                            className="hidden"
                            id="mycards-passkey-file-upload"
                            data-testid="input-mycards-file-upload"
                          />
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => document.getElementById('mycards-passkey-file-upload')?.click()}
                            data-testid="button-mycards-upload-passkey"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Passkey File
                          </Button>
                        </div>
                      </div>

                      <Button 
                        onClick={handleMyCardsConnect} 
                        className="w-full"
                        disabled={verifyAndFetchMyCardsMutation.isPending}
                        data-testid="button-mycards-connect"
                      >
                        {verifyAndFetchMyCardsMutation.isPending ? 'Generating ZK Proof...' : 'Authenticate & Load Gift Cards'}
                      </Button>

                      {savedGiftCards.length > 0 && (
                        <div className="pt-6 border-t">
                          <Button
                            variant="ghost"
                            onClick={() => setShowSecretManager(!showSecretManager)}
                            className="w-full justify-between"
                            data-testid="button-mycards-toggle-saved"
                          >
                            <span>Saved Gift Cards ({savedGiftCards.length})</span>
                            {showSecretManager ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>

                          {showSecretManager && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="space-y-2 mt-4"
                            >
                              {savedGiftCards.map((card) => (
                                <Card key={card.orderId} className="hover-elevate active-elevate-2">
                                  <CardContent className="p-4">
                                    <div className="flex items-center justify-between gap-4">
                                      <div className="flex-1 min-w-0">
                                        <div className="font-semibold">
                                          {giftCardNames[card.giftCardType] || card.giftCardType} ${card.denomination}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                          Order: {card.orderId}
                                        </div>
                                      </div>
                                      <div className="flex gap-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleSelectSaved(card.identitySecret)}
                                          disabled={verifyAndFetchMyCardsMutation.isPending}
                                          data-testid={`button-mycards-select-${card.orderId}`}
                                        >
                                          Load
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => deleteGiftCard(card.orderId)}
                                          data-testid={`button-mycards-delete-${card.orderId}`}
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </motion.div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                              <Key className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Authenticated with ZK Proof</div>
                              <div className="font-semibold text-green-500">Identity Verified ✓</div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleMyCardsDisconnect}
                            data-testid="button-mycards-disconnect"
                          >
                            Disconnect
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {myCardsOrders.length === 0 ? (
                      <Card>
                        <CardContent className="p-12 text-center">
                          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                          <h3 className="text-xl font-semibold mb-2">No Gift Cards Found</h3>
                          <p className="text-muted-foreground mb-6">
                            No gift cards found for this passkey. Purchase your first gift card!
                          </p>
                          <Button onClick={() => setActiveTab("buy")} data-testid="button-mycards-purchase-first">
                            Purchase Gift Card
                          </Button>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold">Your Gift Cards ({myCardsOrders.length})</h2>
                        </div>

                        {myCardsOrders.map((order) => (
                          <Card key={order.orderId} data-testid={`card-mycards-order-${order.orderId}`}>
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div>
                                  <CardTitle className="flex items-center gap-2">
                                    <Gift className="w-5 h-5" />
                                    {giftCardNames[order.giftCardType] || order.giftCardType} ${order.denomination}
                                  </CardTitle>
                                  <CardDescription>Order ID: {order.orderId}</CardDescription>
                                </div>
                                <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                                  {order.paymentStatus}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <div className="text-muted-foreground">Amount Paid</div>
                                  <div className="font-mono">{order.amountCrypto} {order.currency}</div>
                                </div>
                                <div>
                                  <div className="text-muted-foreground">Purchase Date</div>
                                  <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                                </div>
                              </div>

                              {order.cardNumber && order.cardPin ? (
                                <div className="space-y-3 p-4 bg-green-500/10 border-2 border-green-500 rounded-lg">
                                  <div className="flex items-center gap-2 text-green-500 font-semibold">
                                    <Gift className="w-5 h-5" />
                                    Gift Card Delivered!
                                  </div>
                                  
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => toggleShowCode(order.orderId)}
                                    className="w-full"
                                    data-testid={`button-mycards-toggle-code-${order.orderId}`}
                                  >
                                    {showRedemptionCodes[order.orderId] ? (
                                      <>
                                        <EyeOff className="w-4 h-4 mr-2" />
                                        Hide Details
                                      </>
                                    ) : (
                                      <>
                                        <Eye className="w-4 h-4 mr-2" />
                                        Show Details
                                      </>
                                    )}
                                  </Button>

                                  {showRedemptionCodes[order.orderId] && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      className="space-y-3 pt-3 border-t border-green-500/20"
                                    >
                                      <div>
                                        <Label className="text-xs text-green-700">Card Number</Label>
                                        <div className="flex gap-2 mt-1">
                                          <Input
                                            value={order.cardNumber}
                                            readOnly
                                            className="font-mono text-sm bg-background"
                                            data-testid={`input-mycards-card-number-${order.orderId}`}
                                          />
                                          <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleCopyCardNumber(order.cardNumber)}
                                            data-testid={`button-mycards-copy-number-${order.orderId}`}
                                          >
                                            <Copy className="w-4 h-4" />
                                          </Button>
                                        </div>
                                      </div>

                                      <div>
                                        <Label className="text-xs text-green-700">PIN Code</Label>
                                        <div className="flex gap-2 mt-1">
                                          <Input
                                            value={order.cardPin}
                                            readOnly
                                            className="font-mono text-sm bg-background"
                                            data-testid={`input-mycards-pin-${order.orderId}`}
                                          />
                                          <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleCopyPin(order.cardPin)}
                                            data-testid={`button-mycards-copy-pin-${order.orderId}`}
                                          >
                                            <Copy className="w-4 h-4" />
                                          </Button>
                                        </div>
                                      </div>

                                      {order.redeemInstructions && (
                                        <div className="text-xs text-green-700 pt-2 border-t border-green-500/20">
                                          <strong>How to Redeem:</strong>
                                          <p className="mt-1 text-muted-foreground">{order.redeemInstructions}</p>
                                        </div>
                                      )}
                                    </motion.div>
                                  )}
                                </div>
                              ) : (
                                <Alert className="bg-amber-500/10 border-amber-500/50">
                                  <Clock className="h-4 w-4 text-amber-600" />
                                  <AlertDescription className="text-amber-700">
                                    Awaiting payment confirmation. Your gift card will be delivered shortly after payment is confirmed.
                                  </AlertDescription>
                                </Alert>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : null}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
