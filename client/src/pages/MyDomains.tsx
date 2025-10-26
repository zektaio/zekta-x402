import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Globe, Plus, Trash2, Edit, Save, X, Shield, Server, Key, Download, Copy, AlertTriangle, Search, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Identity } from '@semaphore-protocol/identity';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLocation } from 'wouter';

interface DNSRecord {
  id: string;
  name: string;
  type: string;
  content: string;
  ttl: number;
}

interface SavedDomain {
  orderId: string;
  domain: string;
  secret: string;
  createdAt: string;
  commitment: string;
}

export default function MyDomains() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [domainSecret, setDomainSecret] = useState('');
  const [zkCommitment, setZkCommitment] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [editingRecord, setEditingRecord] = useState<DNSRecord | null>(null);
  const [newRecord, setNewRecord] = useState({ name: '', type: 'A', content: '', ttl: 3600 });
  const [savedDomains, setSavedDomains] = useState<SavedDomain[]>([]);
  const [showSecretManager, setShowSecretManager] = useState(false);

  // Load all saved domain secrets from localStorage
  const loadSavedDomains = () => {
    const saved = localStorage.getItem('zekta_saved_domains');
    if (saved) {
      try {
        const domains = JSON.parse(saved) as SavedDomain[];
        setSavedDomains(domains);
        return domains;
      } catch (error) {
        console.error('Error loading saved domains:', error);
        return [];
      }
    }
    return [];
  };

  // Save domain secret permanently
  const saveDomainSecret = (orderId: string, domain: string, secret: string) => {
    try {
      // Create identity from secret string
      // Secret is comma-separated numbers - convert to Uint8Array
      const privateKeyArray = new Uint8Array(
        secret.split(',').map(n => parseInt(n.trim(), 10))
      );
      const identity = new Identity(privateKeyArray);
      const commitment = identity.commitment.toString();
      
      const saved = loadSavedDomains();
      
      // Check if already exists
      const existingIndex = saved.findIndex(d => d.orderId === orderId);
      
      const newDomain: SavedDomain = {
        orderId,
        domain,
        secret,
        commitment,
        createdAt: new Date().toISOString()
      };
      
      if (existingIndex >= 0) {
        saved[existingIndex] = newDomain;
      } else {
        saved.push(newDomain);
      }
      
      localStorage.setItem('zekta_saved_domains', JSON.stringify(saved));
      setSavedDomains(saved);
      console.log('✅ Domain secret saved permanently:', orderId);
    } catch (error) {
      console.error('Error saving domain secret:', error);
    }
  };

  // Delete saved domain secret
  const deleteDomainSecret = (orderId: string) => {
    const saved = loadSavedDomains();
    const filtered = saved.filter(d => d.orderId !== orderId);
    localStorage.setItem('zekta_saved_domains', JSON.stringify(filtered));
    setSavedDomains(filtered);
    
    // Also remove individual storage
    localStorage.removeItem(`zekta_domain_secret_${orderId}`);
    
    toast({
      title: "Secret Deleted",
      description: "Domain secret has been permanently deleted"
    });
  };

  // File upload handler for domain secret
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      let secret = '';
      
      // Try JSON format first
      try {
        const data = JSON.parse(content);
        if (data.domainSecret) {
          secret = String(data.domainSecret).trim();
        }
      } catch (jsonError) {
        // Try plain text format - extract comma-separated numbers from any line
        const lines = content.split('\n');
        for (const line of lines) {
          const trimmedLine = line.trim();
          // Look for lines that contain comma-separated numbers (the actual secret)
          // Secret format: "76,1,58,111,13,115,170,44,37,3,70,195,111,93,..."
          if (trimmedLine.match(/^\d+(?:,\d+)+$/)) {
            secret = trimmedLine;
            break;
          }
        }
        
        // If no line matches, try the whole content as comma-separated numbers
        if (!secret) {
          const trimmed = content.trim();
          if (trimmed.match(/^[\d,\s]+$/)) {
            secret = trimmed.replace(/\s+/g, ''); // Remove whitespace
          }
        }
      }
      
      if (secret && secret.length > 20) {
        setDomainSecret(secret);
        toast({
          title: "Secret Loaded!",
          description: "Domain secret uploaded successfully"
        });
      } else {
        console.error('Invalid secret:', { secret, length: secret?.length });
        toast({
          title: "Upload Failed",
          description: `Could not find valid domain secret in file${secret ? ` (length: ${secret.length})` : ''}`,
          variant: "destructive"
        });
      }
    };
    
    reader.readAsText(file);
    event.target.value = '';
  };

  // Load saved domains on mount
  useEffect(() => {
    loadSavedDomains();
  }, []);

  // Derive commitment from secret when user connects
  const handleConnect = () => {
    if (!domainSecret) {
      toast({
        title: "Missing Secret",
        description: "Please enter your domain secret",
        variant: "destructive"
      });
      return;
    }

    try {
      // Recreate identity from secret to get commitment
      // Secret is comma-separated numbers (Uint8Array.toString() format)
      // Convert back to Uint8Array: "1,2,3,4" -> Uint8Array([1,2,3,4])
      const privateKeyArray = new Uint8Array(
        domainSecret.split(',').map(n => parseInt(n.trim(), 10))
      );
      const identity = new Identity(privateKeyArray);
      const commitment = identity.commitment.toString();
      setZkCommitment(commitment);
    } catch (error) {
      toast({
        title: "Invalid Secret",
        description: "Could not derive identity from secret. Please check your domain secret.",
        variant: "destructive"
      });
    }
  };

  // Fetch user's domains using ZK commitment
  const { data: domainsData, isLoading: loadingDomains } = useQuery({
    queryKey: ['/api/domains/my-domains', zkCommitment],
    enabled: !!zkCommitment,
    queryFn: async () => {
      const res = await fetch(`/api/domains/my-domains?zkCommitment=${encodeURIComponent(zkCommitment)}`);
      return res.json();
    }
  });

  // Fetch DNS records for selected domain
  const { data: dnsData, isLoading: loadingDNS } = useQuery({
    queryKey: ['/api/domains', selectedDomain, 'dns', zkCommitment],
    enabled: !!selectedDomain && !!zkCommitment,
    queryFn: async () => {
      const res = await fetch(`/api/domains/${selectedDomain}/dns?zkCommitment=${encodeURIComponent(zkCommitment)}`);
      return res.json();
    }
  });

  // Add DNS record mutation
  const addRecordMutation = useMutation({
    mutationFn: async (data: { name: string; type: string; content: string; ttl: number }) => {
      if (!selectedDomain) throw new Error("No domain selected");
      
      const response = await apiRequest('POST', `/api/domains/${selectedDomain}/dns`, {
        ...data,
        domainSecret
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/domains', selectedDomain, 'dns'] });
      setNewRecord({ name: '', type: 'A', content: '', ttl: 3600 });
      toast({
        title: "DNS Record Added",
        description: "Your DNS record has been created successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add DNS record",
        variant: "destructive"
      });
    }
  });

  // Update DNS record mutation
  const updateRecordMutation = useMutation({
    mutationFn: async (data: { recordId: string; content: string; ttl: number }) => {
      if (!selectedDomain) throw new Error("No domain selected");
      
      const response = await apiRequest('PUT', `/api/domains/${selectedDomain}/dns/${data.recordId}`, {
        content: data.content,
        ttl: data.ttl,
        domainSecret
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/domains', selectedDomain, 'dns'] });
      setEditingRecord(null);
      toast({
        title: "DNS Record Updated",
        description: "Your DNS record has been updated successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update DNS record",
        variant: "destructive"
      });
    }
  });

  // Delete DNS record mutation
  const deleteRecordMutation = useMutation({
    mutationFn: async (recordId: string) => {
      if (!selectedDomain) throw new Error("No domain selected");
      
      const response = await apiRequest('DELETE', `/api/domains/${selectedDomain}/dns/${recordId}`, {
        domainSecret
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/domains', selectedDomain, 'dns'] });
      toast({
        title: "DNS Record Deleted",
        description: "Your DNS record has been removed successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete DNS record",
        variant: "destructive"
      });
    }
  });

  const handleAddRecord = () => {
    if (!newRecord.name || !newRecord.content) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    addRecordMutation.mutate(newRecord);
  };

  const handleUpdateRecord = () => {
    if (!editingRecord) return;
    updateRecordMutation.mutate({
      recordId: editingRecord.id,
      content: editingRecord.content,
      ttl: editingRecord.ttl
    });
  };

  const domains = domainsData?.domains || [];
  const dnsRecords = dnsData?.records || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Anonymous Domain Services
            </h1>
            <p className="text-xl text-muted-foreground">
              Buy, track, and manage domains anonymously with cryptocurrency
            </p>
          </motion.div>

          {/* Tabs Navigation */}
          <div className="max-w-3xl mx-auto mb-12">
            <Tabs value="manage" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger 
                  value="buy" 
                  onClick={() => setLocation('/buy-domain')}
                  data-testid="tab-buy-domain"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Buy Domain
                </TabsTrigger>
                <TabsTrigger 
                  value="track" 
                  onClick={() => setLocation('/track-order')}
                  data-testid="tab-track-order"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Track Order
                </TabsTrigger>
                <TabsTrigger value="manage" data-testid="tab-my-domains">
                  <Key className="w-4 h-4 mr-2" />
                  My Domains
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Saved Domain Secrets Manager */}
          {savedDomains.length > 0 && !zkCommitment && (
            <Card className="p-6 max-w-2xl mx-auto mb-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">Saved Domain Secrets ({savedDomains.length})</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSecretManager(!showSecretManager)}
                    data-testid="button-toggle-secrets"
                  >
                    {showSecretManager ? 'Hide' : 'Show'}
                  </Button>
                </div>

                {showSecretManager && (
                  <div className="space-y-3">
                    {savedDomains.map((savedDomain) => (
                      <div
                        key={savedDomain.orderId}
                        className="p-4 bg-muted/30 rounded-lg border border-muted space-y-2"
                        data-testid={`saved-domain-${savedDomain.orderId}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4 text-primary" />
                              <p className="font-semibold">{savedDomain.domain}</p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Order ID: {savedDomain.orderId}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Saved: {new Date(savedDomain.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setDomainSecret(savedDomain.secret);
                                setZkCommitment(savedDomain.commitment);
                                toast({
                                  title: "Secret Loaded",
                                  description: `Connected to ${savedDomain.domain}`
                                });
                              }}
                              data-testid={`button-load-${savedDomain.orderId}`}
                            >
                              Use
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                navigator.clipboard.writeText(savedDomain.secret);
                                toast({
                                  title: "Secret Copied",
                                  description: "Domain secret copied to clipboard"
                                });
                              }}
                              data-testid={`button-copy-${savedDomain.orderId}`}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const blob = new Blob(
                                  [
                                    `ZEKTA DOMAIN SECRET\n\n`,
                                    `Domain: ${savedDomain.domain}\n`,
                                    `Order ID: ${savedDomain.orderId}\n`,
                                    `Saved: ${new Date(savedDomain.createdAt).toISOString()}\n\n`,
                                    `Domain Secret:\n${savedDomain.secret}\n\n`,
                                    `⚠️ Keep this safe - we cannot recover it!`
                                  ],
                                  { type: 'text/plain' }
                                );
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `zekta-${savedDomain.domain}-secret.txt`;
                                a.click();
                                URL.revokeObjectURL(url);
                              }}
                              data-testid={`button-download-${savedDomain.orderId}`}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                if (confirm(`Delete secret for ${savedDomain.domain}? This cannot be undone!`)) {
                                  deleteDomainSecret(savedDomain.orderId);
                                }
                              }}
                              data-testid={`button-delete-${savedDomain.orderId}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Alert className="mt-4">
                      <AlertTriangle className="w-4 h-4" />
                      <AlertDescription className="text-xs">
                        These secrets are stored locally in your browser. Clear browser data will delete them permanently.
                        Always keep a backup in a password manager!
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Domain Secret Input */}
          {!zkCommitment && (
            <Card className="p-8 max-w-2xl mx-auto">
              <div className="space-y-4">
                <div className="flex items-start gap-2 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-500">Zero-Knowledge Privacy</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter your domain secret (provided when you purchased the domain). Your privacy is maintained through zero-knowledge proofs - we never store your secret.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                    <Key className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      Upload the secret file you downloaded when purchasing your domain
                    </p>
                  </div>
                  
                  <input
                    type="file"
                    accept=".json,.txt"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    id="domain-secret-upload"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('domain-secret-upload')?.click()}
                    className="w-full"
                    data-testid="button-upload-secret"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Secret File
                  </Button>
                </div>
                
                <Button 
                  onClick={handleConnect}
                  className="w-full"
                  data-testid="button-connect-secret"
                >
                  Access My Domains
                </Button>
              </div>
            </Card>
          )}

          {/* Domains List */}
          {zkCommitment && (
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Header */}
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Anonymous Access</p>
                    <p className="font-mono text-sm">Commitment: {zkCommitment.substring(0, 20)}...</p>
                  </div>
                  <Button variant="outline" onClick={() => { setZkCommitment(''); setDomainSecret(''); }} data-testid="button-disconnect">
                    Disconnect
                  </Button>
                </div>
              </Card>

              {loadingDomains ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">Loading your domains...</p>
                </Card>
              ) : domains.length === 0 ? (
                <Card className="p-8 text-center">
                  <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No Domains Found</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't purchased any domains with this secret
                  </p>
                  <Button onClick={() => window.location.href = '/buy-domain'} data-testid="button-buy-domain">
                    Buy a Domain
                  </Button>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {domains.map((domain: any) => (
                    <Card 
                      key={domain.orderId} 
                      className={`p-6 cursor-pointer hover-elevate ${selectedDomain === domain.domain ? 'border-primary' : ''}`}
                      onClick={() => setSelectedDomain(domain.domain)}
                      data-testid={`card-domain-${domain.domain}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{domain.domain}</h3>
                          <p className="text-sm text-muted-foreground">
                            Delivered: {new Date(domain.deliveredAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Globe className="w-6 h-6 text-primary" />
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* DNS Management for Selected Domain */}
              {selectedDomain && (
                <Card className="p-8">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-semibold mb-2">DNS Records</h2>
                      <p className="text-sm text-muted-foreground">
                        Managing DNS for <span className="font-mono font-semibold text-foreground">{selectedDomain}</span>
                      </p>
                    </div>

                    {/* Add New Record */}
                    <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
                      <h3 className="font-semibold">Add New DNS Record</h3>
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                        <div>
                          <Label className="text-xs">Type</Label>
                          <Select value={newRecord.type} onValueChange={(val) => setNewRecord({ ...newRecord, type: val })}>
                            <SelectTrigger data-testid="select-record-type">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A">A</SelectItem>
                              <SelectItem value="AAAA">AAAA</SelectItem>
                              <SelectItem value="CNAME">CNAME</SelectItem>
                              <SelectItem value="MX">MX</SelectItem>
                              <SelectItem value="TXT">TXT</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs">Name</Label>
                          <Input 
                            placeholder="@, www, mail"
                            value={newRecord.name}
                            onChange={(e) => setNewRecord({ ...newRecord, name: e.target.value })}
                            data-testid="input-record-name"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label className="text-xs">Content</Label>
                          <Input 
                            placeholder="192.168.1.1"
                            value={newRecord.content}
                            onChange={(e) => setNewRecord({ ...newRecord, content: e.target.value })}
                            data-testid="input-record-content"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">TTL</Label>
                          <Input 
                            type="number"
                            value={newRecord.ttl}
                            onChange={(e) => setNewRecord({ ...newRecord, ttl: parseInt(e.target.value) })}
                            data-testid="input-record-ttl"
                          />
                        </div>
                      </div>
                      <Button 
                        onClick={handleAddRecord} 
                        disabled={addRecordMutation.isPending}
                        className="w-full"
                        data-testid="button-add-record"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Record
                      </Button>
                    </div>

                    {/* Existing Records */}
                    <div className="space-y-2">
                      <h3 className="font-semibold">Existing Records</h3>
                      {loadingDNS ? (
                        <p className="text-sm text-muted-foreground">Loading DNS records...</p>
                      ) : dnsRecords.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No DNS records found</p>
                      ) : (
                        <div className="space-y-2">
                          {dnsRecords.map((record: DNSRecord) => (
                            <div key={record.id} className="border rounded-lg p-4" data-testid={`dns-record-${record.id}`}>
                              {editingRecord?.id === record.id ? (
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                                  <div>
                                    <Label className="text-xs">Type</Label>
                                    <Input value={record.type} disabled className="bg-muted" />
                                  </div>
                                  <div>
                                    <Label className="text-xs">Name</Label>
                                    <Input value={record.name} disabled className="bg-muted" />
                                  </div>
                                  <div className="md:col-span-2">
                                    <Label className="text-xs">Content</Label>
                                    <Input 
                                      value={editingRecord.content}
                                      onChange={(e) => setEditingRecord({ ...editingRecord, content: e.target.value })}
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <Button size="sm" onClick={handleUpdateRecord} disabled={updateRecordMutation.isPending}>
                                      <Save className="w-4 h-4" />
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => setEditingRecord(null)}>
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
                                  <div>
                                    <p className="text-xs text-muted-foreground">Type</p>
                                    <p className="font-semibold">{record.type}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Name</p>
                                    <p className="font-mono text-sm">{record.name}</p>
                                  </div>
                                  <div className="md:col-span-2">
                                    <p className="text-xs text-muted-foreground">Content</p>
                                    <p className="font-mono text-sm break-all">{record.content}</p>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button size="sm" variant="outline" onClick={() => setEditingRecord(record)}>
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="destructive" 
                                      onClick={() => deleteRecordMutation.mutate(record.id)}
                                      disabled={deleteRecordMutation.isPending}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
