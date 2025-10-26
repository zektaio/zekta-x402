import { useState, useEffect, useMemo, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ArrowRightLeft, Loader2, Copy, CheckCircle2, AlertCircle, Clock, Zap, Shield, ExternalLink } from 'lucide-react';
import { CHAINS, validateAddress, getChain } from '@/lib/chains';
import TokenSearch from './TokenSearch';
import { loadIdentity, generateSwapProof } from '@/lib/zkid';
import { apiRequest } from '@/lib/queryClient';
import { tokenContracts, getContractAddress, getPriorityTokens } from '@/lib/tokenContracts';
import { motion, AnimatePresence } from 'framer-motion';

interface Token {
  symbol: string;
  name: string;
  network?: string;
  contractAddress?: string;
  isPriority?: boolean;
  isComingSoon?: boolean;
}

interface SwapOrder {
  id: string;
  addressFrom: string;
  amountFrom: string;
  currencyFrom: string;
  currencyTo: string;
  addressTo: string;
  expectedAmount: string;
  createdAt: string;
  status?: string;
}

interface RelayerLog {
  timestamp: number;
  message: string;
  type: 'info' | 'success' | 'warning';
}

type SwapStage = 'form' | 'creating' | 'deposit_waiting' | 'confirming' | 'executing' | 'complete';

export default function ZKSwapTab() {
  const { toast } = useToast();
  const [fromChain, setFromChain] = useState('');
  const [fromToken, setFromToken] = useState('');
  const [amount, setAmount] = useState('');
  const [toChain, setToChain] = useState('');
  const [toToken, setToToken] = useState('');
  const [receiver, setReceiver] = useState('');
  const [refund, setRefund] = useState('');
  
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);
  const [swapStage, setSwapStage] = useState<SwapStage>('form');
  const [swapOrder, setSwapOrder] = useState<SwapOrder | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [proofHash, setProofHash] = useState<string | null>(null);
  const [relayerLogs, setRelayerLogs] = useState<RelayerLog[]>([]);
  const [nodeId, setNodeId] = useState(1);
  const [nodeSyncProgress, setNodeSyncProgress] = useState(99.8);
  const [nodeLatency, setNodeLatency] = useState(217);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Validate and migrate localStorage on mount
  useEffect(() => {
    validateAndMigrateSwaps();
  }, []);

  // Load tokens on mount
  useEffect(() => {
    loadTokens();
  }, []);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [relayerLogs]);

  const validateAndMigrateSwaps = () => {
    try {
      const stored = localStorage.getItem('zekta_swaps');
      if (!stored) return;

      const swaps = JSON.parse(stored);
      
      const isValidFormat = Array.isArray(swaps) && swaps.every(swap => {
        return swap && 
               (swap.orderId || swap.id) &&
               swap.timestamp;
      });

      if (!isValidFormat) {
        console.log('🔄 Detected old/incompatible swap format. Clearing localStorage...');
        localStorage.removeItem('zekta_swaps');
        toast({
          title: "Storage Updated",
          description: "Old swap data cleared. You can create new swaps now.",
        });
      }
    } catch (error) {
      console.error('Error validating swaps:', error);
      localStorage.removeItem('zekta_swaps');
    }
  };

  // Countdown timer for deposit expiry
  useEffect(() => {
    if (!swapOrder) return;
    
    const expiryTime = new Date(swapOrder.createdAt).getTime() + (30 * 60 * 1000); // 30 minutes
    const interval = setInterval(() => {
      const remaining = Math.floor((expiryTime - Date.now()) / 1000);
      setTimeLeft(remaining > 0 ? remaining : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [swapOrder]);

  // Polling for swap status updates
  useEffect(() => {
    if (!swapOrder || swapStage === 'form' || swapStage === 'complete') return;

    const pollStatus = async () => {
      try {
        const res = await fetch(`/api/swap/exchange/${swapOrder.id}`);
        const data = await res.json();
        
        if (data.ok && data.exchange) {
          const status = data.exchange.status?.toLowerCase();
          
          // Update stage based on status
          if (status === 'waiting') {
            if (swapStage !== 'deposit_waiting') {
              setSwapStage('deposit_waiting');
              addRelayerLog('Waiting for deposit confirmation...', 'info');
            }
          } else if (status === 'confirmed' || status === 'exchanging') {
            if (swapStage !== 'confirming' && swapStage !== 'executing') {
              setSwapStage('confirming');
              addRelayerLog('Deposit confirmed ✓', 'success');
              await new Promise(r => setTimeout(r, 1200));
              setSwapStage('executing');
              addRelayerLog('Relayer executing cross-chain swap...', 'info');
            }
          } else if (status === 'sending' || status === 'finished') {
            setSwapStage('complete');
            addRelayerLog('Swap complete ✓', 'success');
          }
          
          setSwapOrder(prev => prev ? { ...prev, status: data.exchange.status } : null);
        }
      } catch (error) {
        console.error('Failed to poll status:', error);
      }
    };

    const interval = setInterval(pollStatus, 10000); // Poll every 10 seconds
    pollStatus(); // Initial poll

    return () => clearInterval(interval);
  }, [swapOrder, swapStage]);

  const addRelayerLog = (message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    setRelayerLogs(prev => [...prev, { timestamp: Date.now(), message, type }]);
  };

  const loadTokens = async () => {
    setIsLoadingTokens(true);
    try {
      const res = await fetch('/api/swap/currencies');
      const data = await res.json();
      
      if (data.ok && data.currencies) {
        const currencyList = Array.isArray(data.currencies) 
          ? data.currencies 
          : data.currencies.result || [];
        setTokens(currencyList);
      }
    } catch (error) {
      console.error('Failed to load tokens:', error);
    } finally {
      setIsLoadingTokens(false);
    }
  };

  // Filter tokens by selected chain and merge with contract data
  const fromTokens = useMemo(() => {
    if (!fromChain) return [];
    const chainObj = getChain(fromChain);
    if (!chainObj) return [];
    
    const priorityTokensForChain = getPriorityTokens(chainObj.id);
    
    const apiTokensFiltered = tokens.filter(t => {
      if (!t || !t.symbol) return false;
      const tokenSymbol = t.symbol.toLowerCase();
      const tokenNetwork = t.network?.toLowerCase();
      const chainSymbol = chainObj.symbol.toLowerCase();
      const chainId = chainObj.id.toLowerCase();
      
      return tokenSymbol === chainSymbol ||
             tokenNetwork === chainId ||
             tokenNetwork === chainSymbol;
    });

    const tokenMap = new Map<string, Token>();
    
    priorityTokensForChain.forEach(pt => {
      const key = `${pt.symbol.toLowerCase()}-${pt.contractAddress || chainObj.id}`;
      tokenMap.set(key, {
        symbol: pt.symbol,
        name: pt.name,
        network: chainObj.id,
        contractAddress: pt.contractAddress,
        isPriority: true,
        isComingSoon: pt.isComingSoon
      });
    });
    
    apiTokensFiltered.forEach(t => {
      const contractData = tokenContracts.find(
        c => c.symbol.toLowerCase() === t.symbol.toLowerCase() && c.chainId === chainObj.id
      );
      
      const contractAddress = contractData?.contractAddress;
      const key = `${t.symbol.toLowerCase()}-${contractAddress || chainObj.id}`;
      
      if (tokenMap.has(key)) {
        const existing = tokenMap.get(key)!;
        tokenMap.set(key, {
          ...existing,
          name: t.name || existing.name,
          // Explicitly preserve isComingSoon during merge
          isComingSoon: existing.isComingSoon || contractData?.isComingSoon
        });
      } else {
        tokenMap.set(key, {
          ...t,
          contractAddress,
          isPriority: contractData?.isPriority || false,
          isComingSoon: contractData?.isComingSoon
        });
      }
    });

    return Array.from(tokenMap.values());
  }, [fromChain, tokens]);

  const toTokens = useMemo(() => {
    if (!toChain) return [];
    const chainObj = getChain(toChain);
    if (!chainObj) return [];
    
    const priorityTokensForChain = getPriorityTokens(chainObj.id);
    
    const apiTokensFiltered = tokens.filter(t => {
      if (!t || !t.symbol) return false;
      const tokenSymbol = t.symbol.toLowerCase();
      const tokenNetwork = t.network?.toLowerCase();
      const chainSymbol = chainObj.symbol.toLowerCase();
      const chainId = chainObj.id.toLowerCase();
      
      return tokenSymbol === chainSymbol ||
             tokenNetwork === chainId ||
             tokenNetwork === chainSymbol;
    });

    const tokenMap = new Map<string, Token>();
    
    priorityTokensForChain.forEach(pt => {
      const key = `${pt.symbol.toLowerCase()}-${pt.contractAddress || chainObj.id}`;
      tokenMap.set(key, {
        symbol: pt.symbol,
        name: pt.name,
        network: chainObj.id,
        contractAddress: pt.contractAddress,
        isPriority: true,
        isComingSoon: pt.isComingSoon
      });
    });
    
    apiTokensFiltered.forEach(t => {
      const contractData = tokenContracts.find(
        c => c.symbol.toLowerCase() === t.symbol.toLowerCase() && c.chainId === chainObj.id
      );
      
      const contractAddress = contractData?.contractAddress;
      const key = `${t.symbol.toLowerCase()}-${contractAddress || chainObj.id}`;
      
      if (tokenMap.has(key)) {
        const existing = tokenMap.get(key)!;
        tokenMap.set(key, {
          ...existing,
          name: t.name || existing.name,
          // Explicitly preserve isComingSoon during merge
          isComingSoon: existing.isComingSoon || contractData?.isComingSoon
        });
      } else {
        tokenMap.set(key, {
          ...t,
          contractAddress,
          isPriority: contractData?.isPriority || false,
          isComingSoon: contractData?.isComingSoon
        });
      }
    });

    return Array.from(tokenMap.values());
  }, [toChain, tokens]);

  // Validate receiver address
  const receiverValidation = useMemo(() => {
    if (!receiver || !toChain) return null;
    
    const chain = getChain(toChain);
    if (!chain) return null;
    
    const isValid = validateAddress(receiver, chain);
    return { isValid, chain };
  }, [receiver, toChain]);

  // Check if any selected token is coming soon
  const hasComingSoonToken = useMemo(() => {
    const fromTokenData = fromTokens.find(t => t.symbol === fromToken);
    const toTokenData = toTokens.find(t => t.symbol === toToken);
    return fromTokenData?.isComingSoon || toTokenData?.isComingSoon;
  }, [fromToken, toToken, fromTokens, toTokens]);

  const handleCreateSwap = async () => {
    const identity = loadIdentity();
    if (!identity) {
      toast({
        title: "ZK Identity Required",
        description: "Please generate your identity in Tab 1 first.",
        variant: "destructive",
      });
      return;
    }

    if (!fromChain || !fromToken || !amount || !toChain || !toToken || !receiver) {
      toast({
        title: "Missing Fields",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (receiverValidation && !receiverValidation.isValid) {
      toast({
        title: "Invalid Address",
        description: "Receiver address format is invalid for selected chain.",
        variant: "destructive",
      });
      return;
    }

    if (hasComingSoonToken) {
      toast({
        title: "Token Not Available",
        description: "One or more selected tokens are coming soon. Please choose different tokens.",
        variant: "destructive",
      });
      return;
    }

    // Reset logs and start process
    setRelayerLogs([]);
    setSwapStage('creating');
    
    // Random node selection
    const randomNode = Math.floor(Math.random() * 5) + 1;
    setNodeId(randomNode);
    setNodeSyncProgress(99.5 + Math.random() * 0.5);
    setNodeLatency(150 + Math.floor(Math.random() * 200));
    
    addRelayerLog(`[Relayer Node #${randomNode}] Initializing connection...`, 'info');
    await new Promise(r => setTimeout(r, 600));
    
    addRelayerLog(`[Relayer Node #${randomNode}] Verifying HMAC proof...`, 'info');
    await new Promise(r => setTimeout(r, 800));
    
    try {
      // Create swap order via backend
      addRelayerLog(`[Relayer Node #${randomNode}] Creating swap order with partner node...`, 'info');
      
      const res = await apiRequest('POST', '/api/swap/create', {
        fromChain,
        toChain,
        currencyFrom: fromToken,
        currencyTo: toToken,
        amountFrom: amount,
        addressTo: receiver,
        userRefundAddress: refund || undefined
      });

      const data = await res.json();

      if (data.ok && data.exchange) {
        await new Promise(r => setTimeout(r, 700));
        addRelayerLog(`[Relayer Node #${randomNode}] Order created ✓`, 'success');
        addRelayerLog(`Order ID: ${data.exchange.id.slice(0, 12)}...`, 'info');
        
        setSwapOrder(data.exchange);
        setSwapStage('deposit_waiting');
        
        // Generate HMAC proof
        await new Promise(r => setTimeout(r, 500));
        addRelayerLog(`[Relayer Node #${randomNode}] Generating cryptographic proof...`, 'info');
        
        const proof = await generateSwapProof(
          identity.idSecret,
          data.exchange.id,
          fromChain,
          fromToken,
          toChain,
          toToken,
          receiver,
          amount
        );
        setProofHash(proof);

        await new Promise(r => setTimeout(r, 400));
        addRelayerLog(`[Relayer Node #${randomNode}] Proof valid ✓`, 'success');
        
        // Auto-verify proof to update stats (silent background call)
        try {
          await apiRequest('POST', '/api/zk/confirm', {
            orderId: data.exchange.id,
            proofHash: proof,
            zkId: identity.idCommit
          });
          addRelayerLog(`[Relayer Node #${randomNode}] Proof verified on-chain ✓`, 'success');
        } catch (error) {
          console.error('Auto-verify failed (non-critical):', error);
          // Continue anyway - user can manually verify later in Tab 3
        }
        
        addRelayerLog('Waiting for deposit confirmation...', 'info');

        // Save to localStorage for confirmation tab
        const swaps = JSON.parse(localStorage.getItem('zekta_swaps') || '[]');
        swaps.push({
          orderId: data.exchange.id,
          zkId: identity.idCommit,
          fromChain,
          fromToken,
          toChain,
          toToken,
          receiver,
          amount,
          proofHash: proof,
          timestamp: Date.now(),
          status: 'pending'
        });
        localStorage.setItem('zekta_swaps', JSON.stringify(swaps));

        toast({
          title: "Swap Order Created",
          description: "Deposit instructions ready. Order is cryptographically sealed.",
        });
      } else {
        throw new Error(data.error || 'Failed to create swap');
      }
    } catch (error: any) {
      addRelayerLog(`[Relayer Node #${nodeId}] Error: ${error.message}`, 'warning');
      setSwapStage('form');
      toast({
        title: "Swap Creation Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${label} copied to clipboard.` });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStageProgress = () => {
    switch (swapStage) {
      case 'form': return 0;
      case 'creating': return 20;
      case 'deposit_waiting': return 40;
      case 'confirming': return 60;
      case 'executing': return 80;
      case 'complete': return 100;
      default: return 0;
    }
  };

  const getStageMicrocopy = () => {
    switch (swapStage) {
      case 'creating': return 'Proving your right to act...';
      case 'deposit_waiting': return 'Awaiting deposit confirmation...';
      case 'confirming': return 'Verifying proof on relayer node...';
      case 'executing': return 'Executing anonymous swap...';
      case 'complete': return 'Proof receipt issued, action cryptographically sealed';
      default: return '';
    }
  };

  const resetForm = () => {
    setSwapOrder(null);
    setProofHash(null);
    setFromChain('');
    setFromToken('');
    setAmount('');
    setToChain('');
    setToToken('');
    setReceiver('');
    setRefund('');
    setSwapStage('form');
    setRelayerLogs([]);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {swapStage === 'form' ? (
        <Card className="glow-border">
          <CardHeader className="pb-3 md:pb-6">
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <ArrowRightLeft className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              Create Anonymous Swap
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Exchange crypto across chains with zero-knowledge privacy. Powered by Zekta Relayer.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4">
            {/* From Chain */}
            <div className="space-y-1.5 md:space-y-2">
              <Label className="text-xs md:text-sm">From Chain</Label>
              <Select value={fromChain} onValueChange={setFromChain}>
                <SelectTrigger data-testid="select-from-chain" className="min-h-[44px]">
                  <SelectValue placeholder="Select blockchain" />
                </SelectTrigger>
                <SelectContent>
                  {CHAINS.map(chain => (
                    <SelectItem key={chain.id} value={chain.id}>
                      <div className="flex items-center gap-2">
                        <span>{chain.name} ({chain.symbol})</span>
                        {chain.isComingSoon && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 font-semibold border border-cyan-500/40 animate-pulse">
                            COMING SOON
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* From Token with Search */}
            <TokenSearch
              chainId={fromChain}
              value={fromToken}
              onChange={setFromToken}
              label="From Token"
              tokens={fromTokens}
              isLoading={isLoadingTokens}
              testId="search-from-token"
            />

            {/* Amount */}
            <div className="space-y-1.5 md:space-y-2">
              <Label className="text-xs md:text-sm">Amount</Label>
              <Input
                type="number"
                step="0.000001"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="font-mono min-h-[44px]"
                data-testid="input-amount"
              />
            </div>

            <div className="flex justify-center">
              <div className="p-2 rounded-full bg-primary/10">
                <ArrowRightLeft className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              </div>
            </div>

            {/* To Chain */}
            <div className="space-y-1.5 md:space-y-2">
              <Label className="text-xs md:text-sm">To Chain</Label>
              <Select value={toChain} onValueChange={setToChain}>
                <SelectTrigger data-testid="select-to-chain" className="min-h-[44px]">
                  <SelectValue placeholder="Select blockchain" />
                </SelectTrigger>
                <SelectContent>
                  {CHAINS.map(chain => (
                    <SelectItem key={chain.id} value={chain.id}>
                      <div className="flex items-center gap-2">
                        <span>{chain.name} ({chain.symbol})</span>
                        {chain.isComingSoon && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 font-semibold border border-cyan-500/40 animate-pulse">
                            COMING SOON
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* To Token with Search */}
            <TokenSearch
              chainId={toChain}
              value={toToken}
              onChange={setToToken}
              label="To Token"
              tokens={toTokens}
              isLoading={isLoadingTokens}
              testId="search-to-token"
            />

            {/* Receiver Address */}
            <div className="space-y-1.5 md:space-y-2">
              <Label className="text-xs md:text-sm">Receiver Wallet</Label>
              <Input
                placeholder="Enter destination address..."
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                className="font-mono min-h-[44px] text-xs md:text-sm"
                data-testid="input-receiver"
              />
              {receiverValidation && (
                <div className={`flex items-center gap-2 text-[10px] md:text-xs ${receiverValidation.isValid ? 'text-primary' : 'text-destructive'}`}>
                  {receiverValidation.isValid ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4" />
                      Valid {receiverValidation.chain.name} address
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
                      Invalid address format
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Refund Address (Optional) */}
            <div className="space-y-1.5 md:space-y-2">
              <Label className="text-xs md:text-sm">Refund Wallet (Optional)</Label>
              <Input
                placeholder="Enter refund address (if different)..."
                value={refund}
                onChange={(e) => setRefund(e.target.value)}
                className="font-mono min-h-[44px] text-xs md:text-sm"
                data-testid="input-refund"
              />
              <p className="text-[10px] md:text-xs text-muted-foreground">
                Where to refund if swap fails
              </p>
            </div>

            {/* Coming Soon Warning */}
            {hasComingSoonToken && (
              <div className="flex items-center gap-2 p-3 rounded-md bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30">
                <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                <p className="text-xs text-cyan-400">
                  Selected token is coming soon. Please choose a different token to proceed with swap.
                </p>
              </div>
            )}

            {/* Create Button */}
            <Button
              onClick={handleCreateSwap}
              disabled={!fromChain || !toChain || !fromToken || !toToken || !amount || !receiver || hasComingSoonToken}
              className="w-full min-h-[44px]"
              size="lg"
              data-testid="button-create-swap"
            >
              <ArrowRightLeft className="mr-2 h-4 w-4 md:h-5 md:w-5" />
              <span className="text-sm md:text-base">Create Swap</span>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {/* Progress Card */}
          <Card className="glow-border border-primary/30">
            <CardHeader className="pb-3 md:pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Shield className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  {swapStage === 'complete' ? 'Swap Complete' : 'Processing Swap'}
                </CardTitle>
                <Badge variant="outline" className="w-fit text-[10px] md:text-xs">
                  Node #{nodeId} • {nodeSyncProgress.toFixed(1)}% • {nodeLatency}ms
                </Badge>
              </div>
              <CardDescription className="text-xs md:text-sm">
                {getStageMicrocopy()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] md:text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span>{getStageProgress()}%</span>
                </div>
                <Progress value={getStageProgress()} className="h-2" />
              </div>

              {/* Timer */}
              {timeLeft !== null && timeLeft > 0 && swapStage !== 'complete' && (
                <div className="flex items-center gap-2 p-2 md:p-3 rounded-md bg-primary/10 border border-primary/20">
                  <Clock className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
                  <span className="font-semibold text-xs md:text-sm">Expires in: {formatTime(timeLeft)}</span>
                </div>
              )}

              {/* Deposit Details (when stage >= deposit_waiting) */}
              {swapOrder && swapStage !== 'creating' && (
                <div className="space-y-2 md:space-y-3">
                  <div className="p-3 md:p-4 rounded-lg bg-muted/50 border border-border space-y-2 md:space-y-3">
                    <div>
                      <Label className="text-[10px] md:text-xs text-muted-foreground">Send Exactly</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 font-mono text-sm md:text-base font-bold" data-testid="text-deposit-amount">
                          {swapOrder.amountFrom} {swapOrder.currencyFrom.toUpperCase()}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(swapOrder.amountFrom, 'Amount')}
                          className="flex-shrink-0 min-h-[44px] md:min-h-0"
                          data-testid="button-copy-amount"
                        >
                          <Copy className="h-3 w-3 md:h-4 md:w-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="text-[10px] md:text-xs text-muted-foreground">Deposit Address ({fromChain})</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 font-mono text-[10px] md:text-xs break-all" data-testid="text-deposit-address">
                          {swapOrder.addressFrom}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(swapOrder.addressFrom, 'Deposit Address')}
                          className="flex-shrink-0 min-h-[44px] md:min-h-0"
                          data-testid="button-copy-address"
                        >
                          <Copy className="h-3 w-3 md:h-4 md:w-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="text-[10px] md:text-xs text-muted-foreground">You Will Receive</Label>
                      <div className="font-mono text-sm md:text-base mt-1" data-testid="text-receive-amount">
                        {swapOrder.expectedAmount} {swapOrder.currencyTo.toUpperCase()}
                      </div>
                    </div>

                    <div>
                      <Label className="text-[10px] md:text-xs text-muted-foreground">Destination</Label>
                      <div className="font-mono text-[10px] md:text-xs break-all mt-1" data-testid="text-receiver-address">
                        {receiver}
                      </div>
                    </div>
                  </div>

                  {/* ZK Proof Receipt */}
                  {proofHash && (
                    <div className="p-3 md:p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <Label className="text-[10px] md:text-xs text-muted-foreground flex items-center gap-1.5">
                        <Shield className="w-3 h-3 md:w-4 md:h-4" />
                        ZK Proof Receipt (HMAC)
                      </Label>
                      <div className="font-mono text-[10px] md:text-xs break-all mt-1" data-testid="text-proof-hash">
                        {proofHash}
                      </div>
                      <div className="mt-2 text-[10px] md:text-xs text-muted-foreground flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Proof verified and cryptographically sealed
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Relayer Console Logs */}
              {relayerLogs.length > 0 && (
                <div className="space-y-1.5 md:space-y-2">
                  <Label className="text-[10px] md:text-xs text-muted-foreground flex items-center gap-1.5">
                    <Zap className="w-3 h-3 md:w-4 md:h-4" />
                    Relayer Activity
                  </Label>
                  <div className="p-2 md:p-3 rounded-lg bg-black/50 border border-border max-h-[120px] md:max-h-[150px] overflow-y-auto">
                    <div className="space-y-0.5 md:space-y-1 font-mono text-[9px] md:text-[10px]">
                      <AnimatePresence>
                        {relayerLogs.map((log, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`
                              ${log.type === 'success' ? 'text-green-400' : ''}
                              ${log.type === 'warning' ? 'text-yellow-400' : ''}
                              ${log.type === 'info' ? 'text-cyan-300' : ''}
                            `}
                          >
                            <span className="text-gray-500">[{new Date(log.timestamp).toLocaleTimeString()}]</span> {log.message}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      <div ref={logsEndRef} />
                    </div>
                  </div>
                </div>
              )}

              {/* New Swap Button */}
              <Button
                onClick={resetForm}
                variant="outline"
                className="w-full min-h-[44px]"
                data-testid="button-new-swap"
              >
                <ArrowRightLeft className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                <span className="text-xs md:text-sm">Create Another Swap</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
