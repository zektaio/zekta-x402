import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code2, Lock, Zap, Shield, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function ApiDocs() {
  const codeExamples = {
    javascript: `// Initialize Zekta API client
const ZEKTA_API_KEY = 'your_api_key_here';
const BASE_URL = 'https://api.zekta.io';

// Create a swap
async function createSwap() {
  const response = await fetch(\`\${BASE_URL}/api/v1/swap/create\`, {
    method: 'POST',
    headers: {
      'X-API-Key': ZEKTA_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'SOL',
      to: 'ETH',
      amount: '0.5',
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
    })
  });
  
  const data = await response.json();
  console.log('Swap created:', data.orderId);
  console.log('Deposit to:', data.depositAddress);
  return data;
}

// Check swap status
async function checkSwap(orderId) {
  const response = await fetch(\`\${BASE_URL}/api/v1/swap/\${orderId}\`, {
    headers: { 'X-API-Key': ZEKTA_API_KEY }
  });
  
  const data = await response.json();
  console.log('Status:', data.status);
  console.log('Amount from:', data.amountFrom);
  console.log('Amount to:', data.amountTo);
  console.log('Deposit address:', data.addressFrom);
  console.log('Destination address:', data.addressTo);
  if (data.txTo) console.log('Tx hash:', data.txTo);
  return data;
}`,
    python: `import requests

ZEKTA_API_KEY = 'your_api_key_here'
BASE_URL = 'https://api.zekta.io'

# Create a swap
def create_swap():
    response = requests.post(
        f'{BASE_URL}/api/v1/swap/create',
        headers={
            'X-API-Key': ZEKTA_API_KEY,
            'Content-Type': 'application/json'
        },
        json={
            'from': 'SOL',
            'to': 'ETH',
            'amount': '0.5',
            'address': '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
        }
    )
    
    data = response.json()
    print(f"Swap created: {data['orderId']}")
    print(f"Deposit to: {data['depositAddress']}")
    return data

# Check swap status
def check_swap(order_id):
    response = requests.get(
        f'{BASE_URL}/api/v1/swap/{order_id}',
        headers={'X-API-Key': ZEKTA_API_KEY}
    )
    
    data = response.json()
    print(f"Status: {data['status']}")
    print(f"Amount from: {data['amountFrom']}")
    print(f"Amount to: {data['amountTo']}")
    print(f"Deposit address: {data['addressFrom']}")
    print(f"Destination address: {data['addressTo']}")
    if data.get('txTo'):
        print(f"Transaction hash: {data['txTo']}")
    return data`,
    curl: `# Create a swap
curl -X POST https://api.zekta.io/api/v1/swap/create \\
  -H "X-API-Key: your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "from": "SOL",
    "to": "ETH",
    "amount": "0.5",
    "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
  }'

# Check swap status
curl https://api.zekta.io/api/v1/swap/ORDER_ID \\
  -H "X-API-Key: your_api_key_here"`
  };

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="max-w-7xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
            <Code2 className="w-10 h-10 text-primary" />
            <h1 className="text-5xl font-bold">API Documentation</h1>
            <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20">
              Coming Soon
            </Badge>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Integrate privacy-first cryptocurrency swaps into your application with the Zekta API
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link href="/developer">
              <Button size="lg" data-testid="button-get-api-key">
                Get API Key
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6"
        >
          <Card>
            <CardHeader>
              <Lock className="w-8 h-8 mb-2 text-primary" />
              <CardTitle>Privacy-First</CardTitle>
              <CardDescription>
                All swaps use zero-knowledge proofs to protect user identity
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="w-8 h-8 mb-2 text-primary" />
              <CardTitle>Simple Integration</CardTitle>
              <CardDescription>
                REST API with straightforward endpoints and clear responses
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="w-8 h-8 mb-2 text-primary" />
              <CardTitle>Secure by Default</CardTitle>
              <CardDescription>
                API key authentication with usage tracking and monitoring
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Start</CardTitle>
              <CardDescription>Get started with Zekta API in minutes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">Register for Developer Account</h3>
                    <p className="text-sm text-muted-foreground">
                      Create a free account on the{" "}
                      <Link href="/developer" className="text-primary hover:underline">
                        Developer Portal
                      </Link>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">Generate API Key</h3>
                    <p className="text-sm text-muted-foreground">
                      Create an API key from your dashboard. Save it securely - you will only see it once.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">Make Your First Request</h3>
                    <p className="text-sm text-muted-foreground">
                      Use your API key to create swaps and check their status
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
              <CardDescription>All requests require an API key in the X-API-Key header</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Badge variant="default" className="mt-1">POST</Badge>
                  <div className="flex-1">
                    <code className="text-sm bg-muted px-2 py-1 rounded">/api/v1/swap/create</code>
                    <p className="text-sm text-muted-foreground mt-2">Create a new cryptocurrency swap</p>
                    
                    <div className="mt-4 space-y-3">
                      <h4 className="font-medium text-sm">Request Body</h4>
                      <div className="bg-muted p-4 rounded-lg space-y-2 text-sm font-mono">
                        <div><span className="text-primary">from</span>: string - Source token (e.g., SOL, ETH, BTC)</div>
                        <div><span className="text-primary">to</span>: string - Destination token</div>
                        <div><span className="text-primary">amount</span>: string - Amount to swap</div>
                        <div><span className="text-primary">address</span>: string - Destination wallet address</div>
                        <div><span className="text-muted-foreground">refundAddress</span>: string - Optional refund address</div>
                        <div><span className="text-muted-foreground">extraId</span>: string - Optional memo/tag for certain chains</div>
                      </div>

                      <h4 className="font-medium text-sm mt-4">Response</h4>
                      <div className="bg-muted p-4 rounded-lg space-y-2 text-sm font-mono">
                        <div><span className="text-primary">ok</span>: boolean</div>
                        <div><span className="text-primary">orderId</span>: string - Unique swap identifier</div>
                        <div><span className="text-primary">depositAddress</span>: string - Address to send funds</div>
                        <div><span className="text-primary">expectedAmount</span>: string - Expected output amount</div>
                        <div><span className="text-primary">status</span>: string - Swap status</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-start gap-4">
                    <Badge variant="secondary" className="mt-1">GET</Badge>
                    <div className="flex-1">
                      <code className="text-sm bg-muted px-2 py-1 rounded">/api/v1/swap/:exchangeId</code>
                      <p className="text-sm text-muted-foreground mt-2">Get swap status and details</p>
                      
                      <div className="mt-4 space-y-3">
                        <h4 className="font-medium text-sm">Response</h4>
                        <div className="bg-muted p-4 rounded-lg space-y-2 text-sm font-mono">
                          <div><span className="text-primary">ok</span>: boolean</div>
                          <div><span className="text-primary">orderId</span>: string - Swap identifier</div>
                          <div><span className="text-primary">status</span>: string - waiting, confirming, exchanging, sending, finished</div>
                          <div><span className="text-primary">amountFrom</span>: string - Source amount</div>
                          <div><span className="text-primary">amountTo</span>: string - Destination amount</div>
                          <div><span className="text-primary">addressFrom</span>: string - Deposit address</div>
                          <div><span className="text-primary">addressTo</span>: string - Destination address</div>
                          <div><span className="text-primary">txFrom</span>: string - Deposit transaction hash (when available)</div>
                          <div><span className="text-primary">txTo</span>: string - Payout transaction hash (when available)</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Code Examples</CardTitle>
              <CardDescription>Integration examples in popular languages</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="javascript">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                </TabsList>
                
                <TabsContent value="javascript">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{codeExamples.javascript}</code>
                  </pre>
                </TabsContent>
                
                <TabsContent value="python">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{codeExamples.python}</code>
                  </pre>
                </TabsContent>
                
                <TabsContent value="curl">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{codeExamples.curl}</code>
                  </pre>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Supported Tokens</CardTitle>
              <CardDescription>Currently supported cryptocurrencies for swaps</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
                {['SOL', 'ETH', 'BTC', 'USDT', 'USDC', 'BNB', 'MATIC', 'AVAX', 'ARB', 'OP', 'TRX', 'ZEC'].map(token => (
                  <div key={token} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span className="font-medium">{token}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Rate Limiting</CardTitle>
              <CardDescription>API usage limits and throttling</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-primary" />
                    <span className="font-medium">60 requests per minute per API key</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Rate limits are enforced per API key using a sliding window. Exceeding the limit results in 429 responses.
                  </p>
                </div>
                <div className="text-sm">
                  <p className="font-medium mb-2">Rate Limit Headers</p>
                  <div className="bg-muted p-3 rounded-lg font-mono text-xs space-y-1">
                    <div>429 Too Many Requests</div>
                    <div>&#123; error: "Rate limit exceeded", retryAfter: 45 &#125;</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Error Handling</CardTitle>
              <CardDescription>Common error codes and how to handle them</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                  <div>
                    <code className="text-sm bg-muted px-2 py-1 rounded">401 Unauthorized</code>
                    <p className="text-sm text-muted-foreground mt-1">
                      Invalid or missing API key. Check your X-API-Key header.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                  <div>
                    <code className="text-sm bg-muted px-2 py-1 rounded">400 Bad Request</code>
                    <p className="text-sm text-muted-foreground mt-1">
                      Missing required fields or invalid parameters. Check request body.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                  <div>
                    <code className="text-sm bg-muted px-2 py-1 rounded">429 Too Many Requests</code>
                    <p className="text-sm text-muted-foreground mt-1">
                      Rate limit exceeded. Wait for the duration specified in retryAfter field.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                  <div>
                    <code className="text-sm bg-muted px-2 py-1 rounded">503 Service Unavailable</code>
                    <p className="text-sm text-muted-foreground mt-1">
                      Exchange service temporarily unavailable. Retry with exponential backoff.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-center"
        >
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="py-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join developers building privacy-first applications with Zekta
              </p>
              <Link href="/developer">
                <Button size="lg" data-testid="button-start-building">
                  Start Building
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
