import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import {
  Download,
  Upload,
  Send,
  Shield,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Key,
  MessageCircle,
  ArrowLeft,
  Hash
} from 'lucide-react';
import { Link } from 'wouter';
import { Identity } from '@semaphore-protocol/identity';
import { generateProof } from '@semaphore-protocol/proof';
import { Group } from '@semaphore-protocol/group';

interface TweetAction {
  id: number;
  kind: string;
  content: string;
  proofHash: string;
  tweetId: string | null;
  status: string;
  createdAt: string;
}

const STORAGE_KEY = 'zekta_twitter_passkey';
const SESSION_KEY = 'zekta_twitter_session';

export default function AnonymousTwitter() {
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<"post" | "history">("post");
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [commitment, setCommitment] = useState<string>('');
  const [zkSession, setZkSession] = useState<string>('');
  const [tweetText, setTweetText] = useState('');
  const [replyToTweetId, setReplyToTweetId] = useState('');
  const [tweetHistory, setTweetHistory] = useState<TweetAction[]>([]);

  // Load saved passkey on mount
  useEffect(() => {
    const savedPasskey = localStorage.getItem(STORAGE_KEY);
    const savedSession = localStorage.getItem(SESSION_KEY);
    
    if (savedPasskey) {
      try {
        const data = JSON.parse(savedPasskey);
        const privateKeyArray = new Uint8Array(
          data.identitySecret.split(',').map((n: string) => parseInt(n.trim(), 10))
        );
        const loadedIdentity = new Identity(privateKeyArray);
        setIdentity(loadedIdentity);
        setCommitment(loadedIdentity.commitment.toString());
      } catch (error) {
        console.error('Failed to load saved passkey:', error);
      }
    }

    if (savedSession) {
      setZkSession(savedSession);
    }
  }, []);

  // Generate new ZK identity
  const handleGenerateIdentity = () => {
    const newIdentity = new Identity();
    const newCommitment = newIdentity.commitment.toString();
    
    setIdentity(newIdentity);
    setCommitment(newCommitment);
    
    toast({
      title: "✅ Identity Generated!",
      description: "Download your passkey to save it securely"
    });
  };

  // Download passkey file
  const handleDownloadPasskey = () => {
    if (!identity) return;

    const passkeyData = {
      identitySecret: identity.export()
    };

    const blob = new Blob([JSON.stringify(passkeyData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zekta-twitter-passkey-${commitment.slice(0, 8)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(passkeyData));

    toast({
      title: "Passkey Downloaded",
      description: "Keep this file safe! You'll need it to post tweets."
    });
  };

  // Upload passkey file
  const handleUploadPasskey = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      const privateKeyArray = new Uint8Array(
        data.identitySecret.split(',').map((n: string) => parseInt(n.trim(), 10))
      );
      const loadedIdentity = new Identity(privateKeyArray);
      const loadedCommitment = loadedIdentity.commitment.toString();
      
      setIdentity(loadedIdentity);
      setCommitment(loadedCommitment);
      
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

      toast({
        title: "✅ Passkey Loaded!",
        description: "You can now post tweets anonymously"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid passkey file",
        variant: "destructive"
      });
    }
  };

  // Get nonce from backend
  const getNonceMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/twitter/session/nonce');
      return response.json();
    }
  });

  // Verify proof and get session
  const verifySessionMutation = useMutation({
    mutationFn: async ({ proof, commitment, nonce }: any) => {
      const response = await apiRequest('POST', '/api/twitter/session/verify', {
        proof,
        commitment,
        nonce
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.ok && data.zkSession) {
        setZkSession(data.zkSession);
        localStorage.setItem(SESSION_KEY, data.zkSession);
        toast({
          title: "✅ Session Created!",
          description: "You can now post tweets"
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Session Error",
        description: error.message || "Failed to create session",
        variant: "destructive"
      });
    }
  });

  // Post tweet mutation
  const postTweetMutation = useMutation({
    mutationFn: async ({ text, replyToTweetId }: { text: string; replyToTweetId?: string }) => {
      const response = await fetch('/api/twitter/tweet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${zkSession}`
        },
        body: JSON.stringify({
          text,
          replyToTweetId
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to post tweet');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      if (data.ok) {
        setTweetText('');
        setReplyToTweetId('');
        toast({
          title: "✅ Tweet Posted!",
          description: `Proof tag: (zk:${data.proofHash})`
        });
        // Refresh history
        fetchHistoryMutation.mutate();
      }
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Post",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
    }
  });

  // Fetch tweet history
  const fetchHistoryMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/twitter/my-actions', {
        headers: {
          'Authorization': `Bearer ${zkSession}`
        }
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.ok && data.actions) {
        setTweetHistory(data.actions);
      }
    }
  });

  // Connect (create session)
  const handleConnect = async () => {
    if (!identity) {
      toast({
        title: "No Identity",
        description: "Please generate or upload a passkey first",
        variant: "destructive"
      });
      return;
    }

    try {
      // Get nonce
      const nonceData = await getNonceMutation.mutateAsync();
      const nonce = nonceData.nonce;

      // Create a dummy group (backend doesn't verify membership for Twitter)
      const group = new Group([BigInt(commitment)]);

      // Generate ZK proof with nonce as message (convert to BigInt)
      const nonceBigInt = BigInt(nonce);
      const proof = await generateProof(identity, group, nonceBigInt, nonceBigInt);

      // Verify proof and get session
      await verifySessionMutation.mutateAsync({
        proof: {
          merkleTreeDepth: proof.merkleTreeDepth,
          merkleTreeRoot: proof.merkleTreeRoot,
          nullifier: proof.nullifier,
          message: proof.message,
          scope: proof.scope,
          points: proof.points
        },
        commitment,
        nonce
      });
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to create session",
        variant: "destructive"
      });
    }
  };

  // Post tweet
  const handlePostTweet = () => {
    if (!tweetText.trim()) {
      toast({
        title: "Empty Tweet",
        description: "Please enter tweet text",
        variant: "destructive"
      });
      return;
    }

    postTweetMutation.mutate({
      text: tweetText,
      replyToTweetId: replyToTweetId || undefined
    });
  };

  const isConnected = !!zkSession;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" data-testid="link-home">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <div className="h-6 w-6 text-primary font-bold text-xl flex items-center justify-center">𝕏</div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Anonymous 𝕏 (Twitter)</h1>
                  <p className="text-sm text-muted-foreground">Post tweets with zero-knowledge proofs</p>
                </div>
              </div>
            </div>
            {isConnected && (
              <Badge variant="outline" className="gap-2">
                <Shield className="h-4 w-4" />
                Connected
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Identity Management */}
          {!isConnected && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  ZK Identity
                </CardTitle>
                <CardDescription>
                  Generate a new identity or upload your existing passkey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!identity ? (
                  <div className="space-y-4">
                    <Button
                      onClick={handleGenerateIdentity}
                      className="w-full"
                      size="lg"
                      data-testid="button-generate-identity"
                    >
                      <Shield className="mr-2 h-5 w-5" />
                      Generate New Identity
                    </Button>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or</span>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="passkey-upload">Upload Existing Passkey</Label>
                      <Input
                        id="passkey-upload"
                        type="file"
                        accept=".json"
                        onChange={handleUploadPasskey}
                        className="mt-2"
                        data-testid="input-upload-passkey"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Alert>
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertDescription>
                        Identity loaded: {commitment.slice(0, 8)}...{commitment.slice(-8)}
                      </AlertDescription>
                    </Alert>

                    <div className="flex gap-2">
                      <Button
                        onClick={handleDownloadPasskey}
                        variant="outline"
                        className="flex-1"
                        data-testid="button-download-passkey"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Passkey
                      </Button>
                      <Button
                        onClick={handleConnect}
                        className="flex-1"
                        disabled={verifySessionMutation.isPending || getNonceMutation.isPending}
                        data-testid="button-connect"
                      >
                        {(verifySessionMutation.isPending || getNonceMutation.isPending) ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <Shield className="mr-2 h-4 w-4" />
                            Connect
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Main Content */}
          {isConnected && (
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="post" data-testid="tab-post">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Post Tweet
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  data-testid="tab-history"
                  onClick={() => fetchHistoryMutation.mutate()}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="post" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Compose Tweet</CardTitle>
                    <CardDescription>
                      All tweets posted via @zektabro with your unique proof tag
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="tweet-text">Tweet Text</Label>
                      <Textarea
                        id="tweet-text"
                        placeholder="What's happening?"
                        value={tweetText}
                        onChange={(e) => setTweetText(e.target.value)}
                        maxLength={280}
                        rows={4}
                        data-testid="input-tweet-text"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{tweetText.length}/280</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reply-to">Reply to Tweet ID (optional)</Label>
                      <Input
                        id="reply-to"
                        placeholder="1234567890"
                        value={replyToTweetId}
                        onChange={(e) => setReplyToTweetId(e.target.value)}
                        data-testid="input-reply-to"
                      />
                    </div>

                    <Button
                      onClick={handlePostTweet}
                      className="w-full"
                      size="lg"
                      disabled={postTweetMutation.isPending || !tweetText.trim()}
                      data-testid="button-post-tweet"
                    >
                      {postTweetMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Posting...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Post Anonymously
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Tweet History</CardTitle>
                    <CardDescription>
                      All tweets posted with this ZK identity
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {fetchHistoryMutation.isPending ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : tweetHistory.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>No tweets yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {tweetHistory.map((action) => (
                          <motion.div
                            key={action.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border rounded-lg p-4 space-y-2"
                            data-testid={`tweet-${action.id}`}
                          >
                            <div className="flex items-center justify-between">
                              <Badge variant={action.status === 'posted' ? 'default' : 'secondary'}>
                                {action.kind}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(action.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm">{action.content}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="font-mono">zk:{action.proofHash}</span>
                              {action.tweetId && (
                                <a
                                  href={`https://twitter.com/i/web/status/${action.tweetId}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                  data-testid={`link-tweet-${action.id}`}
                                >
                                  View on 𝕏 →
                                </a>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}
