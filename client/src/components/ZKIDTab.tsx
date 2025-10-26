import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Key, Copy, RefreshCw, CheckCircle2, Users, Shield, Sparkles } from 'lucide-react';
import { loadIdentity, generateIdentity, regenerateIdentity, formatCommitBase58, formatPublicKey } from '@/lib/zkid';
import { motion } from 'framer-motion';

export default function ZKIDTab() {
  const { toast } = useToast();
  const [idSecret, setIdSecret] = useState<string | null>(null);
  const [idCommit, setIdCommit] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [groupId, setGroupId] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTypingAnimation, setShowTypingAnimation] = useState(false);

  useEffect(() => {
    // Load existing identity on mount
    const existing = loadIdentity();
    if (existing) {
      setIdSecret(existing.idSecret);
      setIdCommit(existing.idCommit);
      setPublicKey(existing.publicKey || null);
      setGroupId(existing.groupId ?? 42);
    }
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setShowTypingAnimation(true);
    
    // Simulate cryptographic processing delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      const identity = await generateIdentity();
      
      // Simulate hash computation with typing effect
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setIdSecret(identity.idSecret);
      setIdCommit(identity.idCommit);
      setPublicKey(identity.publicKey);
      setGroupId(identity.groupId);
      
      toast({
        title: "Identity Generated",
        description: "Your ZK identity is secured locally in your browser.",
      });
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setTimeout(() => setShowTypingAnimation(false), 1000);
    }
  };

  const handleRegenerate = async () => {
    if (!confirm('This will delete your current identity and create a new one. Continue?')) {
      return;
    }
    
    setIsGenerating(true);
    setShowTypingAnimation(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      const identity = await regenerateIdentity();
      
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setIdSecret(identity.idSecret);
      setIdCommit(identity.idCommit);
      setPublicKey(identity.publicKey);
      setGroupId(identity.groupId);
      
      toast({
        title: "Identity Regenerated",
        description: "New ZK identity created and secured locally.",
      });
    } catch (error: any) {
      toast({
        title: "Regeneration Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setTimeout(() => setShowTypingAnimation(false), 1000);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard.`,
    });
  };

  const commitBase58 = idCommit ? formatCommitBase58(idCommit) : '';

  return (
    <div className="space-y-4 md:space-y-6">
      <Card className="glow-border">
        <CardHeader className="pb-3 md:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Key className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            Zero-Knowledge Identity
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Generate Semaphore identity locally. Prove group membership anonymously.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          {!idSecret ? (
            <div className="space-y-3">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                size="lg"
                className="w-full min-h-[44px]"
                data-testid="button-generate-zkid"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 md:h-5 md:w-5 animate-spin" />
                    <span className="text-sm md:text-base">Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                    <span className="text-sm md:text-base">Generate ZK Identity</span>
                  </>
                )}
              </Button>
              
              {showTypingAnimation && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 rounded-md bg-primary/5 border border-primary/20"
                >
                  <div className="flex items-center gap-2 text-xs md:text-sm text-primary">
                    <Sparkles className="w-3 h-3 md:w-4 md:h-4 animate-pulse" />
                    <span className="font-mono">Computing Poseidon hash...</span>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {/* Created Locally Badge */}
              <div className="flex items-center gap-2 p-2 md:p-3 rounded-md bg-primary/10 border border-primary/20">
                <Shield className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-xs md:text-sm text-primary">Proof created on your device, not stored on servers</span>
              </div>

              {/* Identity Secret */}
              <div className="space-y-1.5 md:space-y-2">
                <Label className="text-xs md:text-sm text-muted-foreground">Identity Secret (Private Key)</Label>
                <div className="p-2 md:p-3 rounded-md bg-destructive/10 border border-destructive/30">
                  <div className="flex items-start gap-2">
                    <div className="flex-1 font-mono text-[10px] md:text-xs break-all" data-testid="text-id-secret">
                      {idSecret}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(idSecret, 'Secret')}
                      className="flex-shrink-0 min-h-[44px] md:min-h-0"
                      data-testid="button-copy-secret"
                    >
                      <Copy className="h-3 w-3 md:h-4 md:w-4" />
                    </Button>
                  </div>
                  <div className="mt-1.5 md:mt-2 text-[10px] md:text-xs text-destructive flex items-center gap-1">
                    <span>⚠️</span>
                    <span>Keep this secret! Never share it.</span>
                  </div>
                </div>
              </div>

              {/* Identity Commitment - Base58 (Primary Display) */}
              <div className="space-y-1.5 md:space-y-2">
                <Label className="text-xs md:text-sm text-muted-foreground flex items-center gap-1.5">
                  <Key className="w-3 h-3 md:w-4 md:h-4" />
                  Poseidon Commitment (Base58)
                </Label>
                <div className="p-2 md:p-3 rounded-md bg-muted/50 border border-border">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 font-mono text-[10px] md:text-xs break-all" data-testid="text-id-commit-base58">
                      {commitBase58}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(commitBase58, 'Commitment')}
                      className="flex-shrink-0 min-h-[44px] md:min-h-0"
                      data-testid="button-copy-commit-base58"
                    >
                      <Copy className="h-3 w-3 md:h-4 md:w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Public Key */}
              {publicKey && (
                <div className="space-y-1.5 md:space-y-2">
                  <Label className="text-xs md:text-sm text-muted-foreground flex items-center gap-1.5">
                    <Shield className="w-3 h-3 md:w-4 md:h-4" />
                    EdDSA Public Key
                  </Label>
                  <div className="p-2 md:p-3 rounded-md bg-muted/50 border border-border">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 font-mono text-[10px] md:text-xs" data-testid="text-public-key">
                        {formatPublicKey(publicKey)}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(publicKey, 'Public Key')}
                        className="flex-shrink-0 min-h-[44px] md:min-h-0"
                        data-testid="button-copy-pubkey"
                      >
                        <Copy className="h-3 w-3 md:h-4 md:w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Group Membership */}
              {groupId !== null && (
                <div className="space-y-1.5 md:space-y-2">
                  <Label className="text-xs md:text-sm text-muted-foreground flex items-center gap-1.5">
                    <Users className="w-3 h-3 md:w-4 md:h-4" />
                    Anonymous Group Membership
                  </Label>
                  <div className="p-2 md:p-3 rounded-md bg-cyan-500/10 border border-cyan-500/30">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-cyan-500/20 border-cyan-500/50 text-cyan-400 text-[10px] md:text-xs">
                            Group #{groupId}
                          </Badge>
                          <span className="text-[10px] md:text-xs text-muted-foreground">Active Member</span>
                        </div>
                        <p className="text-[10px] md:text-xs text-muted-foreground">
                          Prove membership without revealing identity
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Status */}
              <div className="flex items-center gap-2 p-2 md:p-3 rounded-md bg-primary/10 border border-primary/20">
                <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
                <span className="text-xs md:text-sm">Identity active and secured in browser storage</span>
              </div>

              {/* Regenerate Button */}
              <Button
                onClick={handleRegenerate}
                disabled={isGenerating}
                variant="outline"
                className="w-full min-h-[44px]"
                data-testid="button-regenerate-zkid"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-3 w-3 md:h-4 md:w-4 animate-spin" />
                    <span className="text-xs md:text-sm">Regenerating...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                    <span className="text-xs md:text-sm">Regenerate Identity</span>
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card - Compact */}
      <Card className="bg-muted/30">
        <CardContent className="pt-4 md:pt-6 p-3 md:p-6">
          <h3 className="font-semibold mb-2 flex items-center gap-2 text-sm md:text-base">
            <Shield className="w-3 h-3 md:w-4 md:h-4 text-cyan-400" />
            How it works:
          </h3>
          <ul className="space-y-1.5 md:space-y-2 text-[10px] md:text-sm text-muted-foreground">
            <li>• <strong>EdDSA Identity:</strong> Uses Edwards-curve Digital Signature Algorithm for ZK proofs</li>
            <li>• <strong>Poseidon Hash:</strong> Commitment proves group membership without revealing which member</li>
            <li>• <strong>Anonymous Groups:</strong> Join Group #{groupId || 42} to prove membership privately</li>
            <li>• <strong>Client-Side:</strong> All operations happen locally in your browser - no servers</li>
            <li>• <strong>Persistent:</strong> Stored in localStorage across sessions</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
