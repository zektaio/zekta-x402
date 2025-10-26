import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle2, Loader2, Copy, FileJson } from "lucide-react";

export default function TestApi() {
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [swapResult, setSwapResult] = useState<any>(null);
  const [statusResult, setStatusResult] = useState<any>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const { toast } = useToast();

  const [swapForm, setSwapForm] = useState({
    from: "SOL",
    to: "USDC",
    amount: "0.1",
    address: ""
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Copied to clipboard"
    });
  };

  const createSwap = async () => {
    if (!apiKey) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter your API key"
      });
      return;
    }

    if (!swapForm.from || !swapForm.to) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter both source and destination tokens"
      });
      return;
    }

    const amount = parseFloat(swapForm.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Amount must be a positive number"
      });
      return;
    }

    if (!swapForm.address) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter destination address"
      });
      return;
    }

    setLoading(true);
    setSwapResult(null);
    setStatusResult(null);

    try {
      const response = await fetch("/api/v1/swap/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey
        },
        body: JSON.stringify(swapForm)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      setSwapResult(data);
      toast({
        title: "Success!",
        description: `Swap created: ${data.orderId}`
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
      setSwapResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async () => {
    if (!apiKey) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter your API key"
      });
      return;
    }

    if (!swapResult?.orderId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Create a swap first"
      });
      return;
    }

    setStatusLoading(true);
    setStatusError(null);

    try {
      const response = await fetch(`/api/v1/swap/${swapResult.orderId}`, {
        headers: {
          "X-API-Key": apiKey
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      setStatusResult(data);
      toast({
        title: "Status Updated",
        description: `Current status: ${data.status}`
      });
    } catch (error: any) {
      setStatusError(error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    } finally {
      setStatusLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
            API Integration Test
          </h1>
          <p className="text-muted-foreground">
            Test your API key and create real swaps
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>1. Enter API Key</CardTitle>
            <CardDescription>
              Get your API key from the Developer Dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="zekta_live_..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                data-testid="input-api-key"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Create Test Swap</CardTitle>
            <CardDescription>
              Create a real cryptocurrency swap using the API
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="from">From</Label>
                <Input
                  id="from"
                  value={swapForm.from}
                  onChange={(e) => setSwapForm({ ...swapForm, from: e.target.value })}
                  data-testid="input-from"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="to">To</Label>
                <Input
                  id="to"
                  value={swapForm.to}
                  onChange={(e) => setSwapForm({ ...swapForm, to: e.target.value })}
                  data-testid="input-to"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                value={swapForm.amount}
                onChange={(e) => setSwapForm({ ...swapForm, amount: e.target.value })}
                data-testid="input-amount"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Destination Address</Label>
              <Input
                id="address"
                placeholder="Enter your wallet address"
                value={swapForm.address}
                onChange={(e) => setSwapForm({ ...swapForm, address: e.target.value })}
                data-testid="input-address"
              />
            </div>

            <Button
              onClick={createSwap}
              disabled={loading}
              className="w-full"
              data-testid="button-create-swap"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Swap...
                </>
              ) : (
                "Create Swap"
              )}
            </Button>

            {swapResult && (
              <div className="mt-4 p-4 bg-muted rounded-lg space-y-3">
                {swapResult.error ? (
                  <div className="flex items-start gap-2 text-destructive">
                    <AlertCircle className="w-5 h-5 mt-0.5" />
                    <div>
                      <p className="font-medium">Error</p>
                      <p className="text-sm">{swapResult.error}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start gap-2 text-green-500">
                      <CheckCircle2 className="w-5 h-5 mt-0.5" />
                      <div>
                        <p className="font-medium">Swap Created Successfully</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm font-mono">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Order ID:</span>
                        <div className="flex items-center gap-2">
                          <span data-testid="text-order-id">{swapResult.orderId}</span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(swapResult.orderId)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Deposit Address:</span>
                        <div className="flex items-center gap-2">
                          <span className="truncate max-w-[200px]" data-testid="text-deposit-address">
                            {swapResult.depositAddress}
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(swapResult.depositAddress)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Expected Amount:</span>
                        <span data-testid="text-expected-amount">{swapResult.expectedAmount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant="secondary" data-testid="badge-status">
                          {swapResult.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileJson className="w-4 h-4" />
                          <span className="text-sm font-medium">Full API Response</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(JSON.stringify(swapResult, null, 2))}
                        >
                          <Copy className="w-3 h-3 mr-2" />
                          Copy JSON
                        </Button>
                      </div>
                      <pre className="bg-background p-3 rounded border text-xs overflow-x-auto">
                        {JSON.stringify(swapResult, null, 2)}
                      </pre>
                    </div>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {swapResult && !swapResult.error && (
          <Card>
            <CardHeader>
              <CardTitle>3. Check Swap Status</CardTitle>
              <CardDescription>
                Query the swap status using GET endpoint
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={checkStatus}
                disabled={statusLoading}
                className="w-full"
                variant="secondary"
                data-testid="button-check-status"
              >
                {statusLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Checking Status...
                  </>
                ) : (
                  "Check Status"
                )}
              </Button>

              {statusError && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="flex items-start gap-2 text-destructive">
                    <AlertCircle className="w-5 h-5 mt-0.5" />
                    <div>
                      <p className="font-medium">Status Check Failed</p>
                      <p className="text-sm">{statusError}</p>
                    </div>
                  </div>
                </div>
              )}

              {statusResult && (
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg space-y-2 text-sm font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge data-testid="badge-current-status">{statusResult.status}</Badge>
                    </div>
                    {statusResult.amountFrom && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Amount From:</span>
                        <span>{statusResult.amountFrom}</span>
                      </div>
                    )}
                    {statusResult.amountTo && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Amount To:</span>
                        <span>{statusResult.amountTo}</span>
                      </div>
                    )}
                    {statusResult.addressFrom && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Deposit Address:</span>
                        <span className="truncate max-w-[200px]">{statusResult.addressFrom}</span>
                      </div>
                    )}
                    {statusResult.addressTo && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Destination Address:</span>
                        <span className="truncate max-w-[200px]">{statusResult.addressTo}</span>
                      </div>
                    )}
                    {statusResult.txFrom && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Deposit Tx:</span>
                        <span className="truncate max-w-[200px]">{statusResult.txFrom}</span>
                      </div>
                    )}
                    {statusResult.txTo && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Payout Tx:</span>
                        <span className="truncate max-w-[200px]">{statusResult.txTo}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileJson className="w-4 h-4" />
                        <span className="text-sm font-medium">Full API Response</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(JSON.stringify(statusResult, null, 2))}
                      >
                        <Copy className="w-3 h-3 mr-2" />
                        Copy JSON
                      </Button>
                    </div>
                    <pre className="bg-background p-3 rounded border text-xs overflow-x-auto">
                      {JSON.stringify(statusResult, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Common Error Codes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <Badge variant="destructive">401</Badge>
              <span className="text-muted-foreground">Invalid or missing API key</span>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="destructive">400</Badge>
              <span className="text-muted-foreground">Bad request - invalid parameters</span>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="destructive">429</Badge>
              <span className="text-muted-foreground">Rate limit exceeded (60 req/min)</span>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="destructive">503</Badge>
              <span className="text-muted-foreground">Service unavailable</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
