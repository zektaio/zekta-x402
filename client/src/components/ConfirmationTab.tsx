import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, Loader2, Shield, ExternalLink, Clock, RefreshCw, Copy } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { formatCommitBase58 } from '@/lib/zkid';
import { motion } from 'framer-motion';

interface SwapRecord {
  orderId?: string;
  id?: string;
  zkId?: string;
  fromChain?: string;
  fromToken?: string;
  toChain?: string;
  toToken?: string;
  receiver?: string;
  amount?: string;
  proofHash?: string;
  timestamp: number;
  status?: string;
  txHash?: string;
  verifiedAt?: number;
}

export default function ConfirmationTab() {
  const { toast } = useToast();
  const [swaps, setSwaps] = useState<SwapRecord[]>([]);
  const [verifyingIds, setVerifyingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadSwaps();
    
    const interval = setInterval(() => {
      refreshActiveSwapStatuses();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadSwaps = () => {
    const stored = localStorage.getItem('zekta_swaps');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSwaps([...parsed].reverse()); // Show newest first
      } catch {
        setSwaps([]);
      }
    }
  };

  const refreshActiveSwapStatuses = async () => {
    const stored = localStorage.getItem('zekta_swaps');
    if (!stored) return;
    
    let currentSwaps: SwapRecord[] = [];
    try {
      currentSwaps = JSON.parse(stored);
    } catch {
      return;
    }

    const activeSwaps = currentSwaps.filter(s => {
      const status = s.status?.toLowerCase();
      return status !== 'finished' && status !== 'failed' && status !== 'refunded' && status !== 'expired';
    });

    if (activeSwaps.length === 0) return;

    for (const swap of activeSwaps) {
      const orderId = swap.orderId || swap.id;
      if (!orderId) continue;

      try {
        const res = await fetch(`/api/swap/exchange/${orderId}`);
        const data = await res.json();
        
        if (data.ok && data.exchange) {
          const updated = currentSwaps.map(s => {
            const sId = s.orderId || s.id;
            return sId === orderId 
              ? { ...s, status: data.exchange.status || s.status }
              : s;
          });
          
          localStorage.setItem('zekta_swaps', JSON.stringify(updated));
          currentSwaps = updated;
          setSwaps([...updated].reverse());
        }
      } catch (error) {
        console.error(`Failed to refresh status for ${orderId}:`, error);
      }
    }
  };

  const refreshSingleStatus = async (orderId: string) => {
    try {
      const res = await fetch(`/api/swap/exchange/${orderId}`);
      const data = await res.json();
      
      if (data.ok && data.exchange) {
        const stored = localStorage.getItem('zekta_swaps');
        if (!stored) return;
        
        let currentSwaps: SwapRecord[] = [];
        try {
          currentSwaps = JSON.parse(stored);
        } catch {
          console.error('Failed to parse swaps from localStorage');
          return;
        }
        const updated = currentSwaps.map(s => {
          const sId = s.orderId || s.id;
          return sId === orderId 
            ? { ...s, status: data.exchange.status || s.status }
            : s;
        });
        
        localStorage.setItem('zekta_swaps', JSON.stringify(updated));
        setSwaps([...updated].reverse());
        
        toast({
          title: "Status Updated",
          description: `Current status: ${data.exchange.status}`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Refresh Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleVerifyProof = async (swap: SwapRecord) => {
    const orderId = swap.orderId || swap.id || 'unknown';
    setVerifyingIds(prev => new Set(prev).add(orderId));
    
    try {
      const res = await apiRequest('POST', '/api/zk/confirm', {
        orderId: orderId,
        proofHash: swap.proofHash,
        zkId: swap.zkId
      });

      const data = await res.json();

      if (data.ok) {
        const stored = localStorage.getItem('zekta_swaps');
        if (!stored) return;
        
        let currentSwaps: SwapRecord[] = [];
        try {
          currentSwaps = JSON.parse(stored);
        } catch {
          console.error('Failed to parse swaps from localStorage');
          return;
        }
        const updated = currentSwaps.map(s => {
          const sId = s.orderId || s.id || 'unknown';
          return sId === orderId 
            ? { ...s, status: data.status || 'confirmed', verifiedAt: Date.now(), txHash: data.txHash }
            : s;
        });
        
        localStorage.setItem('zekta_swaps', JSON.stringify(updated));
        setSwaps([...updated].reverse());

        toast({
          title: "Proof Verified",
          description: `Status: ${data.status || 'confirmed'}`,
        });
      } else {
        toast({
          title: "Verification Failed",
          description: data.error || 'Unable to verify proof',
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Verification Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setVerifyingIds(prev => {
        const next = new Set(prev);
        next.delete(orderId);
        return next;
      });
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${label} copied to clipboard.` });
  };

  const getStatusColor = (status?: string) => {
    const s = status?.toLowerCase();
    switch (s) {
      case 'finished': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'completed': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'sending': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'exchanging': return 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20';
      case 'confirmed': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'waiting': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'failed': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'refunded': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'expired': return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      default: return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatRelativeTime = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (swaps.length === 0) {
    return (
      <Card className="glow-border">
        <CardContent className="py-12 text-center">
          <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Swaps Yet</h3>
          <p className="text-sm md:text-base text-muted-foreground">
            Your anonymous swap confirmations will appear here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3 md:space-y-4">
      {swaps.map((swap, index) => {
        const orderId = swap.orderId || swap.id || 'unknown';
        const isVerifying = verifyingIds.has(orderId);
        const zkIdBase58 = swap.zkId ? formatCommitBase58(swap.zkId).slice(0, 8) : 'N/A';

        return (
          <motion.div
            key={orderId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className="glow-border">
              <CardHeader className="pb-3 md:pb-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div className="space-y-1">
                    <CardTitle className="text-sm md:text-base flex items-center gap-2 flex-wrap">
                      <span>Order #{orderId.slice(0, 8)}</span>
                      <Badge variant="outline" className={`${getStatusColor(swap.status)} text-[10px] md:text-xs`}>
                        {swap.status || 'pending'}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-[10px] md:text-xs flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      {formatRelativeTime(swap.timestamp)}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="font-mono text-[10px] md:text-xs w-fit" data-testid={`badge-zkid-${orderId}`}>
                    ZK: {zkIdBase58}...
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                {/* Swap Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm">
                  <div className="p-2 md:p-3 rounded-md bg-muted/50 border border-border">
                    <div className="text-muted-foreground mb-1 text-[10px] md:text-xs">From</div>
                    <div className="font-mono font-semibold" data-testid={`text-from-${orderId}`}>
                      {swap.amount} {swap.fromToken?.toUpperCase() || 'N/A'}
                    </div>
                    <div className="text-[10px] md:text-xs text-muted-foreground">{swap.fromChain || 'N/A'}</div>
                  </div>
                  <div className="p-2 md:p-3 rounded-md bg-muted/50 border border-border">
                    <div className="text-muted-foreground mb-1 text-[10px] md:text-xs">To</div>
                    <div className="font-mono font-semibold" data-testid={`text-to-${orderId}`}>
                      {swap.toToken?.toUpperCase() || 'N/A'}
                    </div>
                    <div className="text-[10px] md:text-xs text-muted-foreground">{swap.toChain || 'N/A'}</div>
                  </div>
                </div>

                {/* Receiver */}
                <div>
                  <div className="text-[10px] md:text-xs text-muted-foreground mb-1.5 flex items-center gap-1.5">
                    <span>Receiver Address</span>
                  </div>
                  <div className="font-mono text-[10px] md:text-xs break-all p-2 md:p-2.5 rounded bg-muted/50 border border-border flex items-center gap-2" data-testid={`text-receiver-${orderId}`}>
                    <span className="flex-1">{swap.receiver || 'N/A'}</span>
                    {swap.receiver && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(swap.receiver!, 'Receiver')}
                        className="flex-shrink-0 min-h-[36px] md:min-h-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Proof Receipt Card */}
                <div className="p-3 md:p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs md:text-sm font-semibold text-primary flex items-center gap-1.5">
                      <Shield className="w-3 h-3 md:w-4 md:h-4" />
                      Proof Receipt
                    </div>
                    {swap.verifiedAt && (
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-[10px]">
                        Verified
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <div className="text-[10px] md:text-xs text-muted-foreground mb-1">HMAC Signature</div>
                      <div className="font-mono text-[10px] md:text-xs break-all p-2 rounded bg-black/30 border border-primary/10 flex items-center gap-2" data-testid={`text-proof-${orderId}`}>
                        <span className="flex-1">{swap.proofHash || 'N/A'}</span>
                        {swap.proofHash && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(swap.proofHash!, 'Proof Hash')}
                            className="flex-shrink-0 min-h-[36px] md:min-h-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="text-[10px] md:text-xs text-muted-foreground flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Linked to ZK ID: {zkIdBase58}...</span>
                    </div>

                    {swap.verifiedAt && (
                      <div className="text-[10px] md:text-xs text-primary flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        <span>Verified {formatDate(swap.verifiedAt)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* TX Hash if available */}
                {swap.txHash && (
                  <div>
                    <div className="text-[10px] md:text-xs text-muted-foreground mb-1.5">Transaction Hash</div>
                    <div className="font-mono text-[10px] md:text-xs break-all p-2 md:p-2.5 rounded bg-muted/50 border border-border">
                      {swap.txHash}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                  {/* Verify Button */}
                  {swap.status === 'pending' && (
                    <Button
                      onClick={() => handleVerifyProof(swap)}
                      disabled={isVerifying}
                      variant="default"
                      className="flex-1 min-h-[44px]"
                      data-testid={`button-verify-${orderId}`}
                    >
                      {isVerifying ? (
                        <>
                          <Loader2 className="mr-2 h-3 w-3 md:h-4 md:w-4 animate-spin" />
                          <span className="text-xs md:text-sm">Verifying...</span>
                        </>
                      ) : (
                        <>
                          <Shield className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                          <span className="text-xs md:text-sm">Verify Proof</span>
                        </>
                      )}
                    </Button>
                  )}

                  {/* Refresh Status Button */}
                  {swap.status?.toLowerCase() !== 'finished' && 
                   swap.status?.toLowerCase() !== 'failed' && 
                   swap.status?.toLowerCase() !== 'refunded' && 
                   swap.status?.toLowerCase() !== 'expired' && (
                    <Button
                      onClick={() => refreshSingleStatus(orderId)}
                      variant="outline"
                      className={`${swap.status === 'pending' ? '' : 'flex-1'} min-h-[44px]`}
                      data-testid={`button-refresh-${orderId}`}
                    >
                      <RefreshCw className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                      <span className="text-xs md:text-sm">Refresh Status</span>
                    </Button>
                  )}
                </div>

                {/* Timestamp */}
                <div className="text-[10px] md:text-xs text-muted-foreground flex items-center gap-1.5 pt-2 border-t border-border">
                  <Clock className="w-3 h-3" />
                  <span>Created {formatDate(swap.timestamp)}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
