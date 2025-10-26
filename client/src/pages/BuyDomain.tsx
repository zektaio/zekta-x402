import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Shield, CheckCircle2, Copy, Globe, Lock, RotateCw, AlertCircle, CheckCircle, XCircle, Zap, ArrowRight, Clock, Download, AlertTriangle, Search, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useLocation } from 'wouter';

export default function BuyDomain() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [domainName, setDomainName] = useState('');
  const [selectedTld, setSelectedTld] = useState('.com');
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [orderData, setOrderData] = useState<any>(null);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [domainPrice, setDomainPrice] = useState<number | null>(null);
  const [savedOrders, setSavedOrders] = useState<any[]>([]);
  const [lastOrderAttempt, setLastOrderAttempt] = useState<number>(0);

  // Load saved orders from localStorage
  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem('zekta_orders') || '[]');
    setSavedOrders(orders);
  }, [orderData]); // Refresh when new order is created

  // Check domain availability
  const checkAvailabilityMutation = useMutation({
    mutationFn: async (data: { domainName: string; tld: string }) => {
      const response = await apiRequest('POST', '/api/domains/check', data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.ok) {
        setAvailabilityChecked(true);
        setIsAvailable(data.available);
        setDomainPrice(data.price);
        if (data.available) {
          toast({
            title: "Domain Available!",
            description: `${data.domain} is available for purchase at €${data.price.toFixed(2)}/year`
          });
        } else {
          toast({
            title: "Domain Taken",
            description: `${data.domain} is not available`,
            variant: "destructive"
          });
        }
      } else if (data.unsupportedTld) {
        // Special handling for unsupported TLDs
        setAvailabilityChecked(false);
        setIsAvailable(false);
        toast({
          title: "Extension Not Supported",
          description: data.error || "This domain extension is not supported by Njalla. Please choose from available extensions in the dropdown.",
          variant: "destructive"
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to check availability",
        variant: "destructive"
      });
    }
  });

  // Poll order status after payment is generated
  const { data: orderStatus } = useQuery({
    queryKey: ['/api/domains/order', orderData?.orderId],
    enabled: !!orderData?.orderId,
    refetchInterval: 5000, // Poll every 5 seconds
    queryFn: async () => {
      const response = await fetch(`/api/domains/order/${orderData.orderId}`);
      const data = await response.json();
      return data.ok ? data.order : null;
    }
  });

  // Reset availability check when domain name or TLD changes
  useEffect(() => {
    setAvailabilityChecked(false);
    setIsAvailable(false);
    setDomainPrice(null);
  }, [domainName, selectedTld]);

  const handleCheckAvailability = () => {
    if (!domainName) {
      toast({
        title: "Missing Information",
        description: "Please enter a domain name",
        variant: "destructive"
      });
      return;
    }

    checkAvailabilityMutation.mutate({
      domainName,
      tld: selectedTld
    });
  };

  const createOrderMutation = useMutation({
    mutationFn: async (data: { domainName: string; tld: string; currency: string }) => {
      const response = await apiRequest('POST', '/api/domains/order', data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.ok) {
        setOrderData(data);
        
        // CRITICAL: Auto-save domain secret permanently to prevent loss
        if (data.domainSecret) {
          try {
            // Import Identity for commitment calculation
            const { Identity } = require('@semaphore-protocol/identity');
            
            // Create identity from secret string
            const identity = new Identity(data.domainSecret);
            const commitment = identity.commitment.toString();
            
            // Load existing saved domains
            const saved = JSON.parse(localStorage.getItem('zekta_saved_domains') || '[]');
            
            // Add new domain - save the SECRET STRING (not the object)
            saved.push({
              orderId: data.orderId,
              domain: data.domain,
              secret: data.domainSecret, // This is already a string from API
              commitment,
              createdAt: new Date().toISOString()
            });
            
            // Save permanently
            localStorage.setItem('zekta_saved_domains', JSON.stringify(saved));
            
            // Also save individual for backward compatibility
            localStorage.setItem(`zekta_domain_secret_${data.orderId}`, data.domainSecret);
            
            console.log('✅ Domain secret permanently saved:', data.orderId);
          } catch (error) {
            console.error('Error saving domain secret:', error);
          }
        }
        
        // Save order to localStorage for tracking
        const savedOrders = JSON.parse(localStorage.getItem('zekta_orders') || '[]');
        savedOrders.unshift({
          orderId: data.orderId,
          domain: data.domain,
          createdAt: new Date().toISOString(),
          hasSecret: !!data.domainSecret // Track if secret exists
        });
        // Keep only last 10 orders
        localStorage.setItem('zekta_orders', JSON.stringify(savedOrders.slice(0, 10)));
        
        toast({
          title: "Payment Request Created",
          description: "Send crypto to the address below to complete your purchase"
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

  const handleGeneratePayment = () => {
    // Prevent rapid clicking (cooldown: 10 seconds)
    const now = Date.now();
    const cooldown = 10000; // 10 seconds
    if (now - lastOrderAttempt < cooldown) {
      const remainingSeconds = Math.ceil((cooldown - (now - lastOrderAttempt)) / 1000);
      toast({
        title: "Please Wait",
        description: `Please wait ${remainingSeconds} seconds before creating another order.`,
        variant: "default"
      });
      return;
    }

    if (!availabilityChecked || !isAvailable) {
      toast({
        title: "Check Availability First",
        description: "Please check domain availability before proceeding",
        variant: "destructive"
      });
      return;
    }

    if (!selectedCrypto) {
      toast({
        title: "Missing Information",
        description: "Please select payment currency",
        variant: "destructive"
      });
      return;
    }

    // Set timestamp BEFORE making request
    setLastOrderAttempt(now);

    createOrderMutation.mutate({
      domainName,
      tld: selectedTld,
      currency: selectedCrypto
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Anonymous Domain Services
            </h1>
            <p className="text-xl text-muted-foreground">
              Buy, track, and manage domains anonymously with cryptocurrency. No KYC required.
            </p>
          </motion.div>

          <Card className="p-8 max-w-3xl mx-auto">
            <Tabs defaultValue="buy" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="buy" data-testid="tab-buy-domain">
                  <Globe className="w-4 h-4 mr-2" />
                  Buy Domain
                </TabsTrigger>
                <TabsTrigger 
                  value="track" 
                  data-testid="tab-track-order"
                  onClick={() => setLocation('/track-order')}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Track Order
                </TabsTrigger>
                <TabsTrigger 
                  value="manage" 
                  data-testid="tab-my-domains"
                  onClick={() => setLocation('/my-domains')}
                >
                  <Key className="w-4 h-4 mr-2" />
                  My Domains
                </TabsTrigger>
              </TabsList>

              <TabsContent value="buy">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Domain Purchase</h3>
                <p className="text-muted-foreground mb-6">
                  Buy your domain with private cryptocurrency payment. Your wallet address remains hidden with zero-knowledge protection.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="domain-name" data-testid="label-domain">Domain Name</Label>
                  <div className="flex gap-2">
                    <Input
                      id="domain-name"
                      data-testid="input-domain"
                      placeholder="myawesomesite"
                      value={domainName}
                      onChange={(e) => setDomainName(e.target.value)}
                      className="flex-1"
                    />
                    <Select value={selectedTld} onValueChange={setSelectedTld}>
                      <SelectTrigger className="w-32" data-testid="select-tld-trigger">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value=".com" data-testid="option-tld-com">.com (€15)</SelectItem>
                        <SelectItem value=".org" data-testid="option-tld-org">.org (€15)</SelectItem>
                        <SelectItem value=".net" data-testid="option-tld-net">.net (€15)</SelectItem>
                        <SelectItem value=".io" data-testid="option-tld-io">.io (€60)</SelectItem>
                        <SelectItem value=".dev" data-testid="option-tld-dev">.dev (€30)</SelectItem>
                        <SelectItem value=".app" data-testid="option-tld-app">.app (€30)</SelectItem>
                        <SelectItem value=".xyz" data-testid="option-tld-xyz">.xyz (€30)</SelectItem>
                        <SelectItem value=".tech" data-testid="option-tld-tech">.tech (€60)</SelectItem>
                        <SelectItem value=".co" data-testid="option-tld-co">.co (€30)</SelectItem>
                        <SelectItem value=".me" data-testid="option-tld-me">.me (€30)</SelectItem>
                        <SelectItem value=".online" data-testid="option-tld-online">.online (€30)</SelectItem>
                        <SelectItem value=".site" data-testid="option-tld-site">.site (€30)</SelectItem>
                        <SelectItem value=".space" data-testid="option-tld-space">.space (€30)</SelectItem>
                        <SelectItem value=".fun" data-testid="option-tld-fun">.fun (€30)</SelectItem>
                        <SelectItem value=".store" data-testid="option-tld-store">.store (€45)</SelectItem>
                        <SelectItem value=".cloud" data-testid="option-tld-cloud">.cloud (€30)</SelectItem>
                        <SelectItem value=".info" data-testid="option-tld-info">.info (€30)</SelectItem>
                        <SelectItem value=".blog" data-testid="option-tld-blog">.blog (€30)</SelectItem>
                        <SelectItem value=".club" data-testid="option-tld-club">.club (€30)</SelectItem>
                        <SelectItem value=".live" data-testid="option-tld-live">.live (€30)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="crypto-select" data-testid="label-payment-currency">Payment Currency</Label>
                  <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                    <SelectTrigger id="crypto-select" data-testid="select-crypto-trigger">
                      <SelectValue placeholder="Select cryptocurrency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SOL" data-testid="option-crypto-sol">Solana (SOL)</SelectItem>
                      <SelectItem value="USDT" data-testid="option-crypto-usdt">Tether (USDT)</SelectItem>
                      <SelectItem value="USDC" data-testid="option-crypto-usdc">USD Coin (USDC)</SelectItem>
                      <SelectItem value="ETH" data-testid="option-crypto-eth">Ethereum (ETH)</SelectItem>
                      <SelectItem value="BTC" data-testid="option-crypto-btc">Bitcoin (BTC)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>


              {/* Check Availability Button */}
              {domainName && !orderData && (
                <Button
                  onClick={handleCheckAvailability}
                  className="w-full"
                  size="lg"
                  variant="outline"
                  disabled={checkAvailabilityMutation.isPending}
                  data-testid="button-check-availability"
                >
                  {checkAvailabilityMutation.isPending ? (
                    <>
                      <RotateCw className="w-4 h-4 mr-2 animate-spin" />
                      Checking Availability...
                    </>
                  ) : availabilityChecked ? (
                    isAvailable ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        Available
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 mr-2 text-red-500" />
                        Not Available
                      </>
                    )
                  ) : (
                    <>
                      <Globe className="w-4 h-4 mr-2" />
                      Check Availability
                    </>
                  )}
                </Button>
              )}

              {/* Availability Status */}
              {availabilityChecked && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg border ${
                    isAvailable 
                      ? 'bg-green-500/10 border-green-500/20' 
                      : 'bg-red-500/10 border-red-500/20'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isAvailable ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="font-semibold text-green-500">
                          {domainName}{selectedTld} is available!
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-red-500" />
                        <span className="font-semibold text-red-500">
                          {domainName}{selectedTld} is already taken
                        </span>
                      </>
                    )}
                  </div>
                </motion.div>
              )}

              {domainName && selectedCrypto && availabilityChecked && isAvailable && (
                <div className="bg-muted/30 rounded-lg p-4 space-y-2" data-testid="payment-summary">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Domain:</span>
                    <span className="font-semibold" data-testid="text-domain-selected">{domainName}{selectedTld}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-semibold" data-testid="text-price">€{domainPrice?.toFixed(2) || '0.00'}/year</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Payment Method:</span>
                    <span className="font-semibold" data-testid="text-payment-method">{selectedCrypto}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Privacy:</span>
                    <span className="font-semibold text-green-500 flex items-center gap-1" data-testid="text-privacy-status">
                      <Shield className="w-3 h-3" />
                      Zero-Knowledge Protected
                    </span>
                  </div>
                </div>
              )}

              {availabilityChecked && isAvailable && (
                <Button
                  onClick={handleGeneratePayment}
                  className="w-full"
                  size="lg"
                  disabled={!selectedCrypto || createOrderMutation.isPending}
                  data-testid="button-generate-payment"
                >
                  {createOrderMutation.isPending ? (
                    <>
                      <RotateCw className="w-4 h-4 mr-2 animate-spin" />
                      Creating Payment...
                    </>
                  ) : orderData ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Payment Request Generated
                    </>
                  ) : (
                    <>
                      <Globe className="w-4 h-4 mr-2" />
                      Generate Payment
                    </>
                  )}
                </Button>
              )}

              {orderData && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 space-y-4"
                  data-testid="payment-generated-result"
                >
                  <div className="flex items-center gap-2 text-green-500 font-semibold" data-testid="status-payment-created">
                    <CheckCircle2 className="w-5 h-5" />
                    Payment Request Created
                  </div>

                  {/* CRITICAL: Domain Secret Display - HUGE WARNING */}
                  {orderData.domainSecret && (
                    <div className="bg-red-500/20 dark:bg-red-500/10 border-4 border-red-500 dark:border-red-400 rounded-lg p-6 space-y-4 animate-pulse">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                        <div className="space-y-2 flex-1">
                          <h3 className="text-xl font-bold text-red-600 dark:text-red-400">
                            ⚠️ CRITICAL: SAVE YOUR DOMAIN SECRET NOW! ⚠️
                          </h3>
                          <div className="space-y-1 text-sm">
                            <p className="font-semibold text-foreground">
                              • You MUST save this secret to manage DNS for your domain
                            </p>
                            <p className="font-semibold text-foreground">
                              • We CANNOT recover it if you lose it
                            </p>
                            <p className="font-semibold text-foreground">
                              • Your domain will be USELESS without this secret
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              ✅ Auto-saved to browser (but download it too!)
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="bg-background/90 p-4 rounded-lg border-2 border-red-500/50">
                          <p className="font-mono text-sm break-all font-bold select-all" data-testid="text-domain-secret">
                            {orderData.domainSecret}
                          </p>
                        </div>
                        
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            variant="outline"
                            className="flex-1 border-red-500 hover:bg-red-500/20"
                            onClick={() => {
                              navigator.clipboard.writeText(orderData.domainSecret);
                              toast({ 
                                title: "✅ Secret Copied!", 
                                description: "Paste it somewhere safe NOW - email, password manager, etc."
                              });
                            }}
                            data-testid="button-copy-secret"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Secret
                          </Button>
                          
                          <Button
                            variant="outline"
                            className="flex-1 border-red-500 hover:bg-red-500/20"
                            onClick={() => {
                              const blob = new Blob(
                                [
                                  `ZEKTA DOMAIN SECRET - KEEP THIS SAFE!\n\n`,
                                  `Domain: ${orderData.domain}\n`,
                                  `Order ID: ${orderData.orderId}\n`,
                                  `Created: ${new Date().toISOString()}\n\n`,
                                  `Domain Secret (for DNS management):\n`,
                                  `${orderData.domainSecret}\n\n`,
                                  `⚠️ WARNING: We cannot recover this secret if you lose it!\n`,
                                  `Store it in a password manager or secure location.`
                                ], 
                                { type: 'text/plain' }
                              );
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `zekta-secret-${orderData.orderId}.txt`;
                              a.click();
                              URL.revokeObjectURL(url);
                              toast({ 
                                title: "✅ Secret Downloaded!", 
                                description: "File saved. Store it securely!" 
                              });
                            }}
                            data-testid="button-download-secret"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download as File
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Deposit Address</p>
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-sm bg-background/50 p-2 rounded break-all flex-1" data-testid="text-deposit-address">
                          {orderData.depositAddress}
                        </p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            navigator.clipboard.writeText(orderData.depositAddress);
                            toast({ title: "Copied", description: "Deposit address copied to clipboard" });
                          }}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Amount Required</p>
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-sm bg-background/50 p-2 rounded flex-1" data-testid="text-amount-required">
                          {orderData.amountCrypto.toFixed(8)} {orderData.currency}
                        </p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            navigator.clipboard.writeText(orderData.amountCrypto.toFixed(8));
                            toast({ title: "Copied", description: "Amount copied to clipboard" });
                          }}
                          data-testid="button-copy-amount"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Amount (EUR)</p>
                      <p className="font-semibold" data-testid="text-amount-eur">€{orderData.priceEUR.toFixed(2)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Order ID</p>
                      <p className="font-mono text-sm" data-testid="text-order-id">{orderData.orderId}</p>
                    </div>
                  </div>

                  {/* Order Status from Polling */}
                  {orderStatus && (
                    <div className="border-t pt-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Payment Status:</span>
                          <span className={`font-semibold ${
                            orderStatus.paymentStatus === 'paid' ? 'text-green-500' : 
                            orderStatus.paymentStatus === 'pending' ? 'text-yellow-500' : 
                            'text-muted-foreground'
                          }`}>
                            {orderStatus.paymentStatus}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Order Status:</span>
                          <span className={`font-semibold ${
                            orderStatus.orderStatus === 'delivered' ? 'text-green-500' : 
                            orderStatus.orderStatus === 'processing' ? 'text-blue-500' : 
                            'text-muted-foreground'
                          }`}>
                            {orderStatus.orderStatus}
                          </span>
                        </div>
                        {orderStatus.deliveredAt && (
                          <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg space-y-3">
                            <div>
                              <div className="flex items-center gap-2 text-green-500 font-semibold">
                                <CheckCircle2 className="w-5 h-5" />
                                <span>Domain Delivered!</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                Your domain is ready to use
                              </p>
                            </div>
                            <Button 
                              onClick={() => setLocation('/my-domains')}
                              className="w-full"
                              data-testid="button-manage-dns"
                            >
                              <ArrowRight className="w-4 h-4 mr-2" />
                              Manage DNS Now
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <p className="text-sm text-muted-foreground flex items-start gap-2" data-testid="text-privacy-note">
                      <Shield className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-500" />
                      <span>Your wallet address remains private. Only the zero-knowledge proof is verified on-chain.</span>
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
              </TabsContent>

              <TabsContent value="track" className="space-y-6">
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-semibold">Track Your Order</h3>
                  <p className="text-muted-foreground">
                    Enter your Order ID or Exchange ID to check the status of your domain purchase
                  </p>
                  <Button 
                    onClick={() => setLocation('/track-order')}
                    className="mt-4"
                    size="lg"
                    data-testid="button-go-track-order"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Go to Track Order
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="manage" className="space-y-6">
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-semibold">My Domains</h3>
                  <p className="text-muted-foreground">
                    Access your domains and manage DNS records using your domain secret
                  </p>
                  <Button 
                    onClick={() => setLocation('/my-domains')}
                    className="mt-4"
                    size="lg"
                    data-testid="button-go-my-domains"
                  >
                    <Key className="w-4 h-4 mr-2" />
                    Go to My Domains
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </section>

      {/* Your Orders Section */}
      {savedOrders.length > 0 && (
        <section className="py-12 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6" data-testid="text-your-orders-title">Your Recent Orders</h2>
              <div className="space-y-3">
                {savedOrders.map((order, index) => (
                  <Card key={index} className="p-4 hover-elevate" data-testid={`card-order-${index}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium" data-testid={`text-order-domain-${index}`}>{order.domain}</p>
                        <p className="text-sm text-muted-foreground" data-testid={`text-order-id-${index}`}>
                          {order.orderId}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1" data-testid={`text-order-date-${index}`}>
                          <Clock className="w-3 h-3 inline mr-1" />
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLocation(`/track-order?id=${order.orderId}`)}
                        data-testid={`button-track-order-${index}`}
                      >
                        Track Order
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button
                  variant="ghost"
                  onClick={() => setLocation('/track-order')}
                  data-testid="button-view-all-orders"
                >
                  View All Orders
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-3"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">No KYC Required</h3>
            <p className="text-sm text-muted-foreground">
              Purchase domains anonymously without identity verification
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-center space-y-3"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Zero-Knowledge Privacy</h3>
            <p className="text-sm text-muted-foreground">
              Your wallet address is never exposed on-chain
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center space-y-3"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Instant Delivery</h3>
            <p className="text-sm text-muted-foreground">
              Domain delivered immediately after payment confirmation
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
