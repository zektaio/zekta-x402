import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { AlertCircle, CheckCircle2, Loader2, Lock, Users, DollarSign, Wallet } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

const ADMIN_PASSWORD = 'admin_2k9mK3nP8qR4sT7vX1zY6admin_2k9mK3nP8qR4sT7vX1zY6wB5cD8fG2hJkkqlqwB5cD8fG2hJkkqlqekrio';

interface DistributionPreview {
  ok: boolean;
  canDistribute: boolean;
  poolSize: number;
  recipientCount: number;
  totalSOL: number;
  totalUSD: number;
  walletBalance: number;
  walletAddress?: string;
  sufficientBalance: boolean;
  onChainTransfersEnabled: boolean;
  solPrice: number;
  reason?: string;
}

export default function Admin() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const { data: holderData, isLoading: loadingHolders } = useQuery<{
    ok: boolean;
    holders: Array<{ address: string; balance: number; percentage: number }>;
    totalEligibleAmount: number;
    eligibleCount: number;
  }>({
    queryKey: ['/api/admin/eligible-holders'],
    enabled: isAuthenticated,
  });

  const { data: statsData } = useQuery<{
    ok: boolean;
    stats: {
      currentPoolUSD: number;
      cumulativeDistributedUSD: number;
    };
  }>({
    queryKey: ['/api/stats/pumpfun'],
    enabled: isAuthenticated,
    refetchInterval: 5000,
  });

  const { data: previewData, isLoading: loadingPreview } = useQuery<DistributionPreview>({
    queryKey: ['/api/admin/distribution-preview'],
    enabled: isAuthenticated,
    refetchInterval: 10000,
  });

  const distributeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/admin/distribute', {
        password: ADMIN_PASSWORD,
      });
      return await response.json();
    },
    onSuccess: (data: any) => {
      if (data.ok) {
        toast({
          title: 'Distribution Complete',
          description: `Distributed $${data.totalDistributed.toFixed(2)} to ${data.recipientCount} holders`,
        });
        queryClient.invalidateQueries({ queryKey: ['/api/admin/eligible-holders'] });
        queryClient.invalidateQueries({ queryKey: ['/api/stats/protocol'] });
        queryClient.invalidateQueries({ queryKey: ['/api/stats/pumpfun'] });
        queryClient.invalidateQueries({ queryKey: ['/api/admin/distribution-preview'] });
      } else {
        toast({
          title: 'Distribution Failed',
          description: data.error || 'Unknown error occurred',
          variant: 'destructive',
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Distribution Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
      toast({
        title: 'Authentication Success',
        description: 'Welcome to admin panel',
      });
    } else {
      setError('Invalid password');
    }
  };

  const handleDistribute = () => {
    if (!previewData) return;
    
    const confirmMessage = `Will send ${(previewData.totalSOL ?? 0).toFixed(4)} SOL ($${(previewData.totalUSD ?? 0).toFixed(2)}) to ${previewData.recipientCount ?? 0} wallets.\n\nWallet balance: ${(previewData.walletBalance ?? 0).toFixed(4)} SOL\n\nContinue?`;
    
    if (window.confirm(confirmMessage)) {
      distributeMutation.mutate();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-6 h-6 text-primary" />
              <CardTitle>Admin Access</CardTitle>
            </div>
            <CardDescription>Enter password to access distribution panel</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  data-testid="input-admin-password"
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full" data-testid="button-admin-login">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const poolSize = statsData?.stats?.currentPoolUSD || 0;
  const cumulativeDistributed = statsData?.stats?.cumulativeDistributedUSD || 0;
  const totalEligible = holderData?.totalEligibleAmount || 0;
  
  const canDistribute = previewData?.canDistribute && previewData?.sufficientBalance && !distributeMutation.isPending;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Admin Panel</h1>
            <p className="text-muted-foreground mt-1">Manage reward distributions</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsAuthenticated(false)}
            data-testid="button-admin-logout"
          >
            Logout
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Distribution Pool</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text" data-testid="text-pool-size">
                ${poolSize.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Available for distribution</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Eligible Holders</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingHolders ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold" data-testid="text-eligible-count">
                    {holderData?.eligibleCount || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">All holders (≥1 token eligible)</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Cumulative Paid Distributions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-500" data-testid="text-cumulative-distributed">
                ${cumulativeDistributed.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">To token holders</p>
            </CardContent>
          </Card>
        </div>

        {/* Distribution Preview */}
        {loadingPreview ? (
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ) : previewData && previewData.onChainTransfersEnabled && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Distribution Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">Total SOL</div>
                  <div className="text-lg font-bold" data-testid="text-total-sol">
                    {(previewData.totalSOL ?? 0).toFixed(4)} SOL
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Total USD</div>
                  <div className="text-lg font-bold" data-testid="text-total-usd">
                    ${(previewData.totalUSD ?? 0).toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Recipients</div>
                  <div className="text-lg font-bold" data-testid="text-recipients">
                    {previewData.recipientCount ?? 0}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Wallet Balance</div>
                  <div className={`text-lg font-bold ${previewData.sufficientBalance ? 'text-emerald-500' : 'text-destructive'}`} data-testid="text-wallet-balance">
                    {(previewData.walletBalance ?? 0).toFixed(4)} SOL
                  </div>
                </div>
              </div>
              
              {!previewData.sufficientBalance && (previewData.walletBalance ?? 0) > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Insufficient wallet balance! Need {(previewData.totalSOL ?? 0).toFixed(4)} SOL but only have {(previewData.walletBalance ?? 0).toFixed(4)} SOL.
                  </AlertDescription>
                </Alert>
              )}
              
              {previewData.sufficientBalance && (
                <Alert>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <AlertDescription>
                    Ready to distribute! Wallet has sufficient balance.
                  </AlertDescription>
                </Alert>
              )}
              
              {previewData.walletAddress && (
                <div className="text-xs text-muted-foreground">
                  <span className="font-semibold">Wallet:</span> {previewData.walletAddress}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Distribution Control</CardTitle>
                <CardDescription>Execute manual distribution to all eligible holders</CardDescription>
              </div>
              <Button
                onClick={handleDistribute}
                disabled={!canDistribute}
                className="min-w-32"
                data-testid="button-execute-distribution"
              >
                {distributeMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Distributing
                  </>
                ) : (
                  <>
                    <DollarSign className="w-4 h-4 mr-2" />
                    Distribute Now
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {poolSize === 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>No funds available for distribution</AlertDescription>
              </Alert>
            )}

            {loadingHolders ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <h3 className="font-semibold">Eligible Holders ({holderData?.eligibleCount || 0})</h3>
                </div>
                {holderData?.holders && holderData.holders.length > 0 ? (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {holderData.holders.map((holder, index) => {
                      const estimatedReward = totalEligible > 0 ? (poolSize * (holder.balance ?? 0)) / totalEligible : 0;
                      return (
                        <Card key={holder.address} className="hover-elevate">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="font-mono text-sm truncate" data-testid={`text-holder-address-${index}`}>
                                  {holder.address}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {((holder.balance ?? 0) / 1_000_000).toFixed(2)}M ZEKTA ({(holder.percentage ?? 0).toFixed(2)}%)
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-semibold gradient-text" data-testid={`text-estimated-reward-${index}`}>
                                  ${(estimatedReward ?? 0).toFixed(2)}
                                </div>
                                <div className="text-xs text-muted-foreground">Estimated</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>No eligible holders found</AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
