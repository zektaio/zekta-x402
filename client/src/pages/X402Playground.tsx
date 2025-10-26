import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, ArrowLeft, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'wouter';

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

interface Purchase {
  id: number;
  service: X402Service;
  purchaseDate: Date;
  txHash: string | null;
}

export default function X402Playground() {
  const [selectedService, setSelectedService] = useState<X402Service | null>(null);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data: purchasesResponse } = useQuery<{ ok: boolean; purchases: Purchase[] }>({
    queryKey: ['/api/x402/purchases'],
  });

  const purchases = purchasesResponse?.purchases || [];

  const handleTest = async () => {
    if (!selectedService || !prompt) return;

    setIsLoading(true);
    setResponse('');

    try {
      // Simulate API call
      setTimeout(() => {
        if (selectedService.category === 'AI') {
          setResponse(`# Response from ${selectedService.name}\n\nThis is a simulated response. In production, this would call the x402 endpoint:\n\`${selectedService.x402Endpoint}\`\n\n**Your prompt:** ${prompt}\n\n**Sample AI response:**\nI understand you want to test ${selectedService.name}. This marketplace uses the x402 protocol for anonymous, pay-per-use API access. Your payment was processed via USDC on Base network, and this request was authenticated using your zkID commitment without revealing your identity.\n\nCost: $${selectedService.priceUSD.toFixed(4)} (deducted from your credit balance)`);
        } else if (selectedService.category === 'Data') {
          setResponse(`# Data Response from ${selectedService.name}\n\n\`\`\`json\n{\n  "status": "success",\n  "data": {\n    "query": "${prompt}",\n    "results": [\n      "Sample data point 1",\n      "Sample data point 2",\n      "Sample data point 3"\n    ],\n    "metadata": {\n      "timestamp": "${new Date().toISOString()}",\n      "cost_usd": ${selectedService.priceUSD}\n    }\n  }\n}\n\`\`\`\n\nThis is simulated data. In production, actual data would be fetched from ${selectedService.x402Endpoint}`);
        } else {
          setResponse(`# Response from ${selectedService.name}\n\nService category: ${selectedService.category}\nEndpoint: ${selectedService.x402Endpoint}\n\nThis is a test response. Your request has been processed anonymously via x402 protocol.`);
        }
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      setResponse('Error: Failed to process request');
      setIsLoading(false);
    }
  };

  const copyResponse = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-screen">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Link href="/x402marketplace">
              <Button variant="ghost" className="mb-4" data-testid="button-back">
                <ArrowLeft className="w-4 h-4 mr-2 flex-shrink-0" />
                Back to Marketplace
              </Button>
            </Link>

            <div className="text-center space-y-4">
              <Badge className="px-6 py-2 text-base bg-emerald-500/20 text-emerald-400 border-emerald-500/50">
                <Sparkles className="w-4 h-4 mr-2 flex-shrink-0" />
                x402 Playground
              </Badge>

              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                <span className="gradient-text">Test Your Services</span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Try out your purchased services with real API calls. Pay-per-use, anonymous, instant.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Service Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Your Purchased Services</CardTitle>
                  <CardDescription>
                    Select a service to test in the playground
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {purchases.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground mb-4">
                        No services purchased yet
                      </p>
                      <Link href="/x402marketplace">
                        <Button variant="outline" size="sm" data-testid="button-browse">
                          Browse Services
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    purchases.map((purchase) => (
                      <div
                        key={purchase.id}
                        onClick={() => setSelectedService(purchase.service)}
                        className={`p-3 rounded-md border cursor-pointer transition-colors ${
                          selectedService?.id === purchase.service.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover-elevate'
                        }`}
                        data-testid={`service-${purchase.service.id}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">{purchase.service.name}</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {purchase.service.category}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            ${purchase.service.priceUSD.toFixed(3)}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Right: Playground Interface */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-2"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {selectedService ? (
                      <>
                        <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
                        {selectedService.name}
                      </>
                    ) : (
                      'Select a Service'
                    )}
                  </CardTitle>
                  <CardDescription>
                    {selectedService ? selectedService.description : 'Choose a service from the list to get started'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedService ? (
                    <>
                      {/* Input */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          {selectedService.category === 'AI' ? 'Prompt' : 'Request Parameters'}
                        </label>
                        <Textarea
                          placeholder={
                            selectedService.category === 'AI'
                              ? 'Enter your prompt here...'
                              : 'Enter request parameters in JSON format...'
                          }
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          className="min-h-[120px]"
                          data-testid="input-prompt"
                        />
                      </div>

                      <Button
                        onClick={handleTest}
                        disabled={!prompt || isLoading}
                        className="w-full"
                        data-testid="button-test-service"
                      >
                        {isLoading ? (
                          <>Processing...</>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2 flex-shrink-0" />
                            Test Service (${selectedService.priceUSD.toFixed(4)})
                          </>
                        )}
                      </Button>

                      {/* Response */}
                      {(response || isLoading) && (
                        <>
                          <Separator />
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-sm font-medium">Response</label>
                              {response && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={copyResponse}
                                  data-testid="button-copy-response"
                                >
                                  {copied ? (
                                    <Check className="w-4 h-4 flex-shrink-0" />
                                  ) : (
                                    <Copy className="w-4 h-4 flex-shrink-0" />
                                  )}
                                </Button>
                              )}
                            </div>
                            <div className="p-4 bg-muted rounded-md">
                              {isLoading ? (
                                <div className="space-y-2">
                                  <Skeleton className="h-4 w-full" />
                                  <Skeleton className="h-4 w-3/4" />
                                  <Skeleton className="h-4 w-5/6" />
                                </div>
                              ) : (
                                <pre className="text-xs whitespace-pre-wrap font-mono">{response}</pre>
                              )}
                            </div>
                          </div>
                        </>
                      )}

                      {/* Service Info */}
                      <Separator />
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Category:</span>
                          <p className="font-medium">{selectedService.category}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Price per request:</span>
                          <p className="font-medium">${selectedService.priceUSD.toFixed(4)}</p>
                        </div>
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Endpoint:</span>
                          <p className="font-mono text-xs break-all">{selectedService.x402Endpoint}</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground flex-shrink-0" />
                      <p className="text-muted-foreground">
                        Select a service from the left panel to start testing
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8"
          >
            <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-lg">💡 How it Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">1. Anonymous Authentication</h4>
                    <p className="text-muted-foreground">
                      Your zkID commitment proves you purchased the service without revealing your identity
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">2. Instant Payment</h4>
                    <p className="text-muted-foreground">
                      Credits are deducted from your balance. Payments processed via x402 protocol on Base
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">3. Real-time Response</h4>
                    <p className="text-muted-foreground">
                      Get instant API responses without API keys or accounts. Pure pay-per-use model
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
