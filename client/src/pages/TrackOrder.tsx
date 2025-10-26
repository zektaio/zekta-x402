import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Search, Clock, CheckCircle2, XCircle, Loader2, ExternalLink, Copy, Check, Key, Download, Globe, Gift } from "lucide-react";

export default function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [searchId, setSearchId] = useState("");
  const [orderType, setOrderType] = useState<"domain" | "giftcard">("domain");
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Check URL params for order ID and type
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idFromUrl = params.get('id');
    const typeFromUrl = params.get('type') as "domain" | "giftcard" | null;
    
    if (idFromUrl) {
      setOrderId(idFromUrl);
      setSearchId(idFromUrl);
    }
    if (typeFromUrl) {
      setOrderType(typeFromUrl);
    }
  }, []);

  const { data, isLoading, error, refetch } = useQuery<any>({
    queryKey: orderType === "giftcard" ? ["/api/giftcards/order", searchId] : ["/api/domains/order", searchId],
    enabled: !!searchId,
  });

  const handleSearch = () => {
    if (orderId.trim()) {
      setSearchId(orderId.trim());
    }
  };

  // Mock payment mutation for gift cards
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
      refetch();
      queryClient.invalidateQueries({ queryKey: ["/api/giftcards/order", searchId] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to mark payment",
        variant: "destructive"
      });
    }
  });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
    
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const downloadDomainSecret = () => {
    if (!data?.order?.domainSecret) return;

    const blob = new Blob([data.order.domainSecret], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.order.domain}-secret.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Domain secret saved as text file",
    });
  };

  const getStatusBadge = (orderStatus: string, paymentStatus: string, unsupportedTld?: boolean) => {
    if (orderStatus === 'delivered') {
      return <Badge className="bg-green-600 hover:bg-green-700" data-testid="badge-status-delivered">Delivered</Badge>;
    }
    if (orderStatus === 'failed') {
      return <Badge variant="destructive" data-testid="badge-status-failed">Failed</Badge>;
    }
    if ((orderStatus === 'error' || orderStatus === 'manual_review') && unsupportedTld) {
      return <Badge variant="destructive" data-testid="badge-status-error">Manual Review Required</Badge>;
    }
    if (orderStatus === 'processing' || orderStatus === 'error' || orderStatus === 'manual_review') {
      return <Badge className="bg-blue-600 hover:bg-blue-700" data-testid="badge-status-processing">Processing</Badge>;
    }
    if (paymentStatus === 'paid') {
      return <Badge className="bg-yellow-600 hover:bg-yellow-700" data-testid="badge-status-paid">Payment Received</Badge>;
    }
    if (paymentStatus === 'pending') {
      return <Badge variant="outline" data-testid="badge-status-pending">Awaiting Payment</Badge>;
    }
    return <Badge variant="secondary" data-testid="badge-status-unknown">Unknown</Badge>;
  };

  const getProgressSteps = (order: any) => {
    const steps = [
      { 
        label: "Order Created", 
        completed: true, 
        timestamp: order.createdAt 
      },
      { 
        label: "Payment Received", 
        completed: order.paymentStatus === 'paid', 
        timestamp: order.paidAt 
      },
      { 
        label: "Njalla Payment", 
        completed: order.njallaPaymentConfirmed, 
        timestamp: null 
      },
      { 
        label: "Domain Registration", 
        completed: order.orderStatus === 'delivered', 
        timestamp: order.deliveredAt 
      },
    ];
    return steps;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container max-width-4xl mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4" data-testid="text-page-title">
              {orderType === "giftcard" ? "Gift Card Order Tracking" : "Anonymous Domain Services"}
            </h1>
            <p className="text-muted-foreground" data-testid="text-page-description">
              {orderType === "giftcard" 
                ? "Track your gift card purchase status" 
                : "Buy, track, and manage domains anonymously with cryptocurrency"
              }
            </p>
          </div>

          {/* Tabs Navigation - Only show for domains */}
          {orderType === "domain" && (
            <div className="mb-8">
              <Tabs value="track" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger 
                    value="buy" 
                    onClick={() => setLocation('/buy-domain')}
                    data-testid="tab-buy-domain"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Buy Domain
                  </TabsTrigger>
                  <TabsTrigger value="track" data-testid="tab-track-order">
                    <Search className="w-4 h-4 mr-2" />
                    Track Order
                  </TabsTrigger>
                  <TabsTrigger 
                    value="manage" 
                    onClick={() => setLocation('/my-domains')}
                    data-testid="tab-my-domains"
                  >
                    <Key className="w-4 h-4 mr-2" />
                    My Domains
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          )}

          {/* Search */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle data-testid="text-search-title">Enter Order ID or Exchange ID</CardTitle>
              <CardDescription data-testid="text-search-description">
                {orderType === "giftcard" 
                  ? "Use your Order ID (ZK-GC-...) or Exchange ID to track your gift card purchase"
                  : "Use your Order ID (ZK-DOM-...) or Exchange ID to track your purchase"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder={orderType === "giftcard" ? "ZK-GC-... or Exchange ID" : "ZK-DOM-... or Exchange ID"}
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  data-testid="input-order-id"
                />
                <Button 
                  onClick={handleSearch} 
                  disabled={!orderId.trim() || isLoading}
                  data-testid="button-search"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Error */}
          {error && (
            <Alert variant="destructive" className="mb-8" data-testid="alert-error">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                Order not found. Please check your Order ID and try again.
              </AlertDescription>
            </Alert>
          )}

          {/* Results */}
          {data?.order && (
            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle data-testid="text-order-domain">
                      {orderType === "giftcard" 
                        ? `${data.order.giftCardType?.replace(/_/g, ' ')} - $${data.order.denomination}` 
                        : data.order.domain
                      }
                    </CardTitle>
                    {getStatusBadge(data.order.orderStatus, data.order.paymentStatus, data.order.unsupportedTld)}
                  </div>
                  <CardDescription data-testid="text-order-id">Order ID: {data.order.orderId}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Price</p>
                      <p className="font-medium" data-testid="text-price">
                        {orderType === "giftcard" 
                          ? `$${data.order.denomination}` 
                          : `€${data.order.priceUSD.toFixed(2)}`
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Currency</p>
                      <p className="font-medium" data-testid="text-currency">{data.order.currency}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Amount</p>
                      <p className="font-medium" data-testid="text-amount">{data.order.amountCrypto.toFixed(8)} {data.order.currency}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Created</p>
                      <p className="font-medium" data-testid="text-created">{new Date(data.order.createdAt).toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Mock Payment Button for Gift Cards */}
                  {orderType === "giftcard" && data.order.paymentStatus !== "paid" && (
                    <div className="pt-4 border-t">
                      <Alert className="mb-4 bg-amber-500/10 border-amber-500/50">
                        <AlertDescription>
                          <strong className="text-amber-600">Demo Mode:</strong> Click the button below to simulate payment completion
                        </AlertDescription>
                      </Alert>
                      <Button
                        onClick={() => mockPaymentMutation.mutate(data.order.orderId)}
                        disabled={mockPaymentMutation.isPending}
                        className="w-full"
                        data-testid="button-mock-payment"
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
                  {orderType === "giftcard" && data.order.orderStatus === "delivered" && (
                    <div className="pt-4 border-t">
                      <Alert className="bg-green-500/10 border-green-500/50">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-700">
                          <strong>Gift Card Delivered!</strong> Upload your passkey at <strong>/my-gift-cards</strong> to view your card details
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Progress Steps */}
              <Card>
                <CardHeader>
                  <CardTitle data-testid="text-progress-title">Order Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getProgressSteps(data.order).map((step, index) => (
                      <div key={index} className="flex items-start gap-3" data-testid={`step-${index}`}>
                        <div className="mt-1">
                          {step.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" data-testid={`icon-step-${index}-completed`} />
                          ) : (
                            <Clock className="h-5 w-5 text-muted-foreground" data-testid={`icon-step-${index}-pending`} />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={step.completed ? "font-medium" : "text-muted-foreground"} data-testid={`text-step-${index}-label`}>
                            {step.label}
                          </p>
                          {step.timestamp && (
                            <p className="text-xs text-muted-foreground" data-testid={`text-step-${index}-timestamp`}>
                              {new Date(step.timestamp).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Details */}
              {data.order.paymentStatus === 'paid' && (
                <Card>
                  <CardHeader>
                    <CardTitle data-testid="text-payment-title">Payment Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {data.order.txHash && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">User Payment Transaction</p>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate" data-testid="text-tx-hash">
                            {data.order.txHash}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(data.order.txHash, 'txHash')}
                            data-testid="button-copy-tx-hash"
                          >
                            {copied === 'txHash' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    )}

                    {data.order.njallaPaymentTxHash && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Njalla Payment Transaction</p>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate" data-testid="text-njalla-tx-hash">
                            {data.order.njallaPaymentTxHash}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(data.order.njallaPaymentTxHash, 'njallaTxHash')}
                            data-testid="button-copy-njalla-tx-hash"
                          >
                            {copied === 'njallaTxHash' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            asChild
                            data-testid="button-view-njalla-tx"
                          >
                            <a 
                              href={`https://etherscan.io/tx/${data.order.njallaPaymentTxHash}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    )}

                    {data.order.exchangeId && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Exchange ID</p>
                        <code className="text-xs bg-muted px-2 py-1 rounded block" data-testid="text-exchange-id">
                          {data.order.exchangeId}
                        </code>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Error Status - ONLY show for unsupported TLDs */}
              {(data.order.orderStatus === 'error' || data.order.orderStatus === 'manual_review') && data.order.unsupportedTld && (
                <Alert variant="destructive" data-testid="alert-error-status">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Unsupported Domain Extension:</strong> The TLD <strong>{data.order.tld}</strong> is not supported by Njalla. Your payment has been received and a refund will be processed manually. Please contact support with Order ID: <strong>{data.order.orderId}</strong>
                  </AlertDescription>
                </Alert>
              )}

              {/* MY DOMAINS - DNS MANAGEMENT */}
              {data.order.paymentStatus === 'paid' && (
                <Card className="border-2 border-primary bg-primary/5">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Key className="h-5 w-5 text-primary" />
                      <CardTitle className="text-primary" data-testid="text-manage-title">Manage Your Domain</CardTitle>
                    </div>
                    <CardDescription data-testid="text-manage-description">
                      Configure DNS records, set up email forwarding, and manage nameservers for your domain.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Use our DNS management interface to:
                      </p>
                      <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>Add and manage DNS records (A, AAAA, CNAME, MX, TXT)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>Configure custom nameservers</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>Set up email forwarding</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>Complete privacy - no account required</span>
                        </li>
                      </ul>
                    </div>

                    <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-600">
                      <AlertDescription className="text-blue-900 dark:text-blue-100 text-sm">
                        💡 You'll need your Order ID to access your domain management page
                      </AlertDescription>
                    </Alert>

                    <Button
                      onClick={() => window.location.href = '/my-domains'}
                      variant="default"
                      className="w-full"
                      data-testid="button-manage-domains"
                    >
                      <Key className="h-4 w-4 mr-2" />
                      Go to My Domains
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Delivered */}
              {data.order.orderStatus === 'delivered' && (
                <Alert className="border-green-600 bg-green-50 dark:bg-green-950" data-testid="alert-delivered">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-900 dark:text-green-100">
                    Your domain has been successfully registered! You can manage DNS records using your domain secret.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
