import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Gift, Eye, EyeOff, Copy, ExternalLink, Trash2, Key, ArrowLeft, ShoppingBag, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Link } from 'wouter';
import { Identity } from '@semaphore-protocol/identity';
import { generateProof } from '@semaphore-protocol/proof';
import { Group } from '@semaphore-protocol/group';

interface SavedGiftCard {
  orderId: string;
  giftCardType: string;
  denomination: number;
  identitySecret: string;
  createdAt: string;
}

interface GiftCardOrder {
  orderId: string;
  giftCardType: string;
  denomination: number;
  currency: string;
  amountCrypto: string;
  paymentStatus: string;
  orderStatus: string;
  cardNumber?: string;
  cardPin?: string;
  redeemInstructions?: string;
  createdAt: string;
  deliveredAt?: string;
}

const GROUP_ID = 42;

export default function MyGiftCards() {
  const { toast } = useToast();
  const [identitySecret, setIdentitySecret] = useState('');
  const [savedGiftCards, setSavedGiftCards] = useState<SavedGiftCard[]>([]);
  const [showSecretManager, setShowSecretManager] = useState(false);
  const [showRedemptionCodes, setShowRedemptionCodes] = useState<Record<string, boolean>>({});
  const [orders, setOrders] = useState<GiftCardOrder[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Load saved gift card secrets from localStorage
  const loadSavedGiftCards = () => {
    const saved = localStorage.getItem('zekta_saved_giftcards');
    if (saved) {
      try {
        const cards = JSON.parse(saved) as SavedGiftCard[];
        setSavedGiftCards(cards);
        return cards;
      } catch (error) {
        console.error('Error loading saved gift cards:', error);
        return [];
      }
    }
    return [];
  };

  // Save gift card secret permanently
  const saveGiftCardSecret = (order: GiftCardOrder, secret: string) => {
    try {
      const saved = loadSavedGiftCards();
      
      // Check if already exists
      const existingIndex = saved.findIndex(d => d.orderId === order.orderId);
      
      const newCard: SavedGiftCard = {
        orderId: order.orderId,
        giftCardType: order.giftCardType,
        denomination: order.denomination,
        identitySecret: secret,
        createdAt: order.createdAt
      };
      
      if (existingIndex >= 0) {
        saved[existingIndex] = newCard;
      } else {
        saved.push(newCard);
      }
      
      localStorage.setItem('zekta_saved_giftcards', JSON.stringify(saved));
      setSavedGiftCards(saved);
      console.log('✅ Gift card secret saved:', order.orderId);
    } catch (error) {
      console.error('Error saving gift card secret:', error);
    }
  };

  // Delete saved gift card
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

  // Load saved gift cards on mount
  useEffect(() => {
    loadSavedGiftCards();
  }, []);

  // Verify proof and fetch gift cards
  const verifyAndFetchMutation = useMutation({
    mutationFn: async (secret: string) => {
      // Recreate identity from secret (Identity.toString() format)
      const identity = new Identity(secret);
      const commitment = identity.commitment.toString();

      console.log('🔐 Fetching Semaphore group from backend...');

      // Fetch current Semaphore group members from backend
      // Pass commitment to ensure it's in the group (handles sync issues, server restarts)
      const groupResponse = await fetch(`/api/giftcards/group?zkCommitment=${encodeURIComponent(commitment)}`);
      const groupData = await groupResponse.json();
      
      if (!groupData.ok || !groupData.members) {
        throw new Error(groupData.error || 'Failed to fetch Semaphore group');
      }

      // Create group with all members (including this identity)
      const members = groupData.members.map((m: string) => BigInt(m));
      const group = new Group(members);

      console.log(`🔐 Generating ZK proof with group of ${members.length} member(s)...`);

      // Generate proof
      const signal = `gift-card-access-${Date.now()}`;
      const proof = await generateProof(identity, group, signal, GROUP_ID);

      console.log('✅ ZK proof generated, verifying with backend...');

      // Send proof to backend for verification
      const response = await apiRequest('POST', '/api/giftcards/verify-and-get', {
        proof,
        signal,
        zkCommitment: commitment
      });

      return response.json();
    },
    onSuccess: (data) => {
      if (data.ok && data.orders) {
        setOrders(data.orders);
        setIsConnected(true);
        
        // Auto-save gift cards
        data.orders.forEach((order: GiftCardOrder) => {
          saveGiftCardSecret(order, identitySecret);
        });

        toast({
          title: "Connected!",
          description: `Found ${data.orders.length} gift card(s)`
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Authentication Failed",
        description: error.message || "Failed to verify ZK proof",
        variant: "destructive"
      });
    }
  });

  const handleConnect = () => {
    if (!identitySecret) {
      toast({
        title: "Missing Secret",
        description: "Please enter your gift card passkey",
        variant: "destructive"
      });
      return;
    }

    verifyAndFetchMutation.mutate(identitySecret);
  };

  const handleSelectSaved = (secret: string) => {
    setIdentitySecret(secret);
    verifyAndFetchMutation.mutate(secret);
  };

  const handleDisconnect = () => {
    setIdentitySecret('');
    setOrders([]);
    setIsConnected(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      let passkey = '';
      
      // Strategy 1: Try JSON format first (new format)
      try {
        const data = JSON.parse(content);
        if (data.giftCardPasskey) {
          passkey = data.giftCardPasskey;
        }
      } catch (jsonError) {
        // Not JSON, try other strategies
      }
      
      // Strategy 2: Legacy text format - regex extraction
      if (!passkey) {
        const regexMatch = content.match(/Passkey \(for gift card access\):\s*\n\s*([^\n]+)/);
        if (regexMatch && regexMatch[1]) {
          passkey = regexMatch[1].trim();
        }
      }
      
      // Strategy 3: Legacy text format - line-by-line
      if (!passkey) {
        const lines = content.split(/\r?\n/);
        const passkeyLineIndex = lines.findIndex(line => line.includes('Passkey (for gift card access):'));
        
        if (passkeyLineIndex !== -1 && passkeyLineIndex + 1 < lines.length) {
          passkey = lines[passkeyLineIndex + 1].trim();
        }
      }
      
      // Strategy 4: Look for any long Identity string
      if (!passkey) {
        const lines = content.split(/\r?\n/);
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.length > 100 && trimmed.includes('[') && trimmed.includes(']')) {
            passkey = trimmed;
            break;
          }
        }
      }
      
      if (passkey && passkey.length > 50) {
        setIdentitySecret(passkey);
        toast({
          title: "✅ Passkey Loaded!",
          description: "File uploaded successfully"
        });
      } else {
        toast({
          title: "Upload Failed",
          description: "Could not find valid passkey in file. Please check the file.",
          variant: "destructive"
        });
      }
    };
    
    reader.readAsText(file);
    event.target.value = '';
  };

  const toggleShowCode = (orderId: string) => {
    setShowRedemptionCodes(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const giftCardNames: Record<string, string> = {
    'amazon': 'Amazon',
    'google_play': 'Google Play',
    'steam': 'Steam',
    'spotify': 'Spotify'
  };

  const handleCopyCardNumber = (cardNumber: string) => {
    navigator.clipboard.writeText(cardNumber);
    toast({ title: "Copied!", description: "Card number copied to clipboard" });
  };

  const handleCopyPin = (pin: string) => {
    navigator.clipboard.writeText(pin);
    toast({ title: "Copied!", description: "PIN code copied to clipboard" });
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <Link href="/gift-cards">
              <Button variant="ghost" className="mb-6" data-testid="button-back">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Gift Cards
              </Button>
            </Link>

            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold gradient-text mb-4">
                My Gift Cards
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Access your purchased gift cards using your ZK passkey. Zero-knowledge proof required.
              </p>
            </div>

            {!isConnected ? (
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
                      Your ZK passkey is the identity secret you saved when purchasing your gift card. 
                      It looks like a long string of characters. Keep it secure - it's the only way to access your gift cards.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label htmlFor="passkey">Identity Secret (ZK Passkey)</Label>
                    <Input
                      id="passkey"
                      type="password"
                      placeholder="Paste your identity secret here..."
                      value={identitySecret}
                      onChange={(e) => setIdentitySecret(e.target.value)}
                      data-testid="input-passkey"
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
                        onChange={handleFileUpload}
                        className="hidden"
                        id="passkey-file-upload"
                        data-testid="input-file-upload"
                      />
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => document.getElementById('passkey-file-upload')?.click()}
                        data-testid="button-upload-passkey"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Passkey File
                      </Button>
                    </div>
                  </div>

                  <Button 
                    onClick={handleConnect} 
                    className="w-full"
                    disabled={verifyAndFetchMutation.isPending}
                    data-testid="button-connect"
                  >
                    {verifyAndFetchMutation.isPending ? 'Generating ZK Proof...' : 'Authenticate & Load Gift Cards'}
                  </Button>

                  {savedGiftCards.length > 0 && (
                    <div className="pt-6 border-t">
                      <Button
                        variant="ghost"
                        onClick={() => setShowSecretManager(!showSecretManager)}
                        className="w-full justify-between"
                        data-testid="button-toggle-saved"
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
                                      disabled={verifyAndFetchMutation.isPending}
                                      data-testid={`button-select-${card.orderId}`}
                                    >
                                      Load
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => deleteGiftCard(card.orderId)}
                                      data-testid={`button-delete-${card.orderId}`}
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
                        onClick={handleDisconnect}
                        data-testid="button-disconnect"
                      >
                        Disconnect
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {orders.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <h3 className="text-xl font-semibold mb-2">No Gift Cards Found</h3>
                      <p className="text-muted-foreground mb-6">
                        No gift cards found for this passkey. Purchase your first gift card!
                      </p>
                      <Link href="/gift-cards">
                        <Button data-testid="button-purchase-first">
                          Purchase Gift Card
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold">Your Gift Cards ({orders.length})</h2>
                    </div>

                    {orders.map((order) => (
                      <Card key={order.orderId} data-testid={`card-order-${order.orderId}`}>
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
                                data-testid={`button-toggle-code-${order.orderId}`}
                              >
                                {showRedemptionCodes[order.orderId] ? (
                                  <>
                                    <EyeOff className="w-4 h-4 mr-2" />
                                    Hide Details
                                  </>
                                ) : (
                                  <>
                                    <Eye className="w-4 h-4 mr-2" />
                                    Show Card Details
                                  </>
                                )}
                              </Button>

                              {showRedemptionCodes[order.orderId] && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  className="space-y-4 pt-2"
                                >
                                  {/* Card Number */}
                                  <div className="p-3 bg-background rounded border">
                                    <div className="text-xs text-muted-foreground mb-1">Card Number</div>
                                    <div className="flex items-center justify-between gap-2">
                                      <code className="text-lg font-mono font-bold" data-testid={`text-card-number-${order.orderId}`}>
                                        {order.cardNumber}
                                      </code>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleCopyCardNumber(order.cardNumber!)}
                                        data-testid={`button-copy-card-${order.orderId}`}
                                      >
                                        <Copy className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>

                                  {/* PIN Code */}
                                  <div className="p-3 bg-background rounded border">
                                    <div className="text-xs text-muted-foreground mb-1">PIN Code</div>
                                    <div className="flex items-center justify-between gap-2">
                                      <code className="text-lg font-mono font-bold" data-testid={`text-pin-${order.orderId}`}>
                                        {order.cardPin}
                                      </code>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleCopyPin(order.cardPin!)}
                                        data-testid={`button-copy-pin-${order.orderId}`}
                                      >
                                        <Copy className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>

                                  {/* Redemption Instructions */}
                                  {order.redeemInstructions && (
                                    <div className="p-3 bg-muted rounded border">
                                      <div className="text-xs font-semibold text-muted-foreground mb-2">How to Redeem</div>
                                      <p className="text-sm whitespace-pre-wrap" data-testid={`text-instructions-${order.orderId}`}>
                                        {order.redeemInstructions}
                                      </p>
                                    </div>
                                  )}

                                  {order.deliveredAt && (
                                    <div className="text-xs text-muted-foreground text-center">
                                      Delivered on {new Date(order.deliveredAt).toLocaleString()}
                                    </div>
                                  )}
                                </motion.div>
                              )}
                            </div>
                          ) : (
                            <Alert>
                              <AlertDescription>
                                {order.paymentStatus === 'pending' 
                                  ? 'Waiting for payment confirmation...' 
                                  : order.orderStatus === 'processing'
                                  ? 'Payment confirmed! Processing your gift card...'
                                  : 'Gift card will be delivered once payment is confirmed'}
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
          </motion.div>
        </div>
      </section>
    </div>
  );
}
