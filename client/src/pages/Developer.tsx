import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Copy, Key, Trash2, Code2, Terminal, Lock, AlertTriangle, CheckCircle2, ChevronDown, Shield, Zap, Book, HelpCircle, RotateCw, Eye, EyeOff, FileCode, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

interface ApiKey {
  id: number;
  name: string;
  isActive: boolean;
  usageCount: number;
  lastUsedAt: string | null;
  createdAt: string;
}

export default function Developer() {
  const { toast } = useToast();
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem('dev_token'));
  const [view, setView] = useState<'login' | 'register'>('login');
  
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', email: '', password: '' });
  const [newKeyName, setNewKeyName] = useState('');
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { data: apiKeys } = useQuery<ApiKey[]>({
    queryKey: ['/api/dev/keys'],
    enabled: !!authToken,
    queryFn: async () => {
      const res = await fetch('/api/dev/keys', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (!res.ok) throw new Error('Failed to fetch API keys');
      const data = await res.json();
      return data.keys;
    }
  });

  const loginMutation = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const res = await fetch('/api/dev/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Login failed');
      return res.json();
    },
    onSuccess: (data: any) => {
      setAuthToken(data.token);
      localStorage.setItem('dev_token', data.token);
      toast({ title: "Login successful", description: `Welcome back, ${data.developer.username}` });
      queryClient.invalidateQueries({ queryKey: ['/api/dev/keys'] });
    },
    onError: () => {
      toast({ title: "Login failed", description: "Invalid credentials", variant: "destructive" });
    }
  });

  const registerMutation = useMutation({
    mutationFn: async (data: { username: string; email: string; password: string }) => {
      const res = await fetch('/api/dev/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Registration failed');
      return res.json();
    },
    onSuccess: (data: any) => {
      setAuthToken(data.token);
      localStorage.setItem('dev_token', data.token);
      toast({ title: "Registration successful", description: `Welcome, ${data.developer.username}` });
      queryClient.invalidateQueries({ queryKey: ['/api/dev/keys'] });
    },
    onError: (error: any) => {
      toast({ 
        title: "Registration failed", 
        description: error.message || "Unable to create account", 
        variant: "destructive" 
      });
    }
  });

  const generateKeyMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch('/api/dev/keys/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
      });
      if (!res.ok) throw new Error('Failed to generate key');
      return res.json();
    },
    onSuccess: (data) => {
      setGeneratedKey(data.apiKey);
      setNewKeyName('');
      queryClient.invalidateQueries({ queryKey: ['/api/dev/keys'] });
      toast({ title: "API key generated", description: "Save it now - you will not see it again" });
    },
    onError: () => {
      toast({ title: "Generation failed", description: "Unable to create API key", variant: "destructive" });
    }
  });

  const deleteKeyMutation = useMutation({
    mutationFn: async (keyId: number) => {
      const res = await fetch(`/api/dev/keys/${keyId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (!res.ok) throw new Error('Failed to delete key');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dev/keys'] });
      toast({ title: "API key deactivated", description: "Key has been successfully removed" });
    },
    onError: () => {
      toast({ title: "Delete failed", description: "Unable to deactivate API key", variant: "destructive" });
    }
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginForm);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(registerForm);
  };

  const handleGenerateKey = () => {
    if (!newKeyName.trim()) {
      toast({ title: "Name required", description: "Please provide a name for your API key", variant: "destructive" });
      return;
    }
    generateKeyMutation.mutate(newKeyName);
  };

  const copyToClipboard = (text: string, label: string = "API key") => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: `${label} copied to clipboard` });
  };

  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem('dev_token');
    toast({ title: "Logged out", description: "You have been logged out successfully" });
  };

  if (!authToken) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <Terminal className="w-6 h-6 text-primary" />
                <CardTitle className="text-2xl">Developer Portal</CardTitle>
                <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20">
                  Coming Soon
                </Badge>
              </div>
              <CardDescription>
                Access Zekta privacy-first swap APIs for your applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={view} onValueChange={(v) => setView(v as 'login' | 'register')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login" data-testid="tab-login">Login</TabsTrigger>
                  <TabsTrigger value="register" data-testid="tab-register">Register</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-username">Username</Label>
                      <Input
                        id="login-username"
                        data-testid="input-login-username"
                        value={loginForm.username}
                        onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          data-testid="input-login-password"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loginMutation.isPending}
                      data-testid="button-login"
                    >
                      {loginMutation.isPending ? 'Logging in...' : 'Login'}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-username">Username</Label>
                      <Input
                        id="register-username"
                        data-testid="input-register-username"
                        value={registerForm.username}
                        onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        data-testid="input-register-email"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input
                        id="register-password"
                        type="password"
                        data-testid="input-register-password"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={registerMutation.isPending}
                      data-testid="button-register"
                    >
                      {registerMutation.isPending ? 'Creating account...' : 'Create Account'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Developer Dashboard</h1>
              <p className="text-muted-foreground">Manage your API keys and integrate Zekta into your applications</p>
            </div>
            <Button variant="outline" onClick={handleLogout} data-testid="button-logout">
              Logout
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Key className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active API Keys</p>
                    <p className="text-2xl font-bold">{apiKeys?.filter(k => k.isActive).length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Activity className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Requests</p>
                    <p className="text-2xl font-bold">
                      {apiKeys?.reduce((sum, key) => sum + key.usageCount, 0) || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rate Limit</p>
                    <p className="text-2xl font-bold">60/min</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Getting Started Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="w-5 h-5" />
                Getting Started
              </CardTitle>
              <CardDescription>Follow these steps to integrate Zekta API</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground text-xl font-bold">
                    1
                  </div>
                  <h3 className="font-semibold">Generate API Key</h3>
                  <p className="text-sm text-muted-foreground">
                    Create an API key from the management panel below. Save it securely - it is only shown once.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground text-xl font-bold">
                    2
                  </div>
                  <h3 className="font-semibold">Review Documentation</h3>
                  <p className="text-sm text-muted-foreground">
                    Check the{" "}
                    <Link href="/api-docs" className="text-primary hover:underline">
                      API Documentation
                    </Link>{" "}
                    for endpoints, code examples, and integration guides.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground text-xl font-bold">
                    3
                  </div>
                  <h3 className="font-semibold">Start Building</h3>
                  <p className="text-sm text-muted-foreground">
                    Add the X-API-Key header to your requests and start creating privacy-first swaps.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* API Keys Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    API Keys
                  </CardTitle>
                  <CardDescription>Generate and manage your API keys</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button data-testid="button-generate-key">
                      <Key className="w-4 h-4 mr-2" />
                      Generate New Key
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Generate API Key</DialogTitle>
                      <DialogDescription>
                        Create a new API key for integrating Zekta swaps
                      </DialogDescription>
                    </DialogHeader>
                    {generatedKey ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="text-sm font-medium mb-2">Your API Key</p>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 p-2 bg-background rounded text-xs font-mono break-all">
                              {generatedKey}
                            </code>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(generatedKey)}
                              data-testid="button-copy-key"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                          <div className="flex gap-2">
                            <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-destructive mb-1">
                                Save this key now
                              </p>
                              <p className="text-sm text-destructive/80">
                                This key will never be shown again for security reasons. Store it in your environment variables or secrets manager.
                              </p>
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => setGeneratedKey(null)}
                          className="w-full"
                          data-testid="button-close-key-dialog"
                        >
                          Done - I have saved the key
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="key-name">Key Name</Label>
                          <Input
                            id="key-name"
                            placeholder="e.g., Production API Key, Staging Environment"
                            value={newKeyName}
                            onChange={(e) => setNewKeyName(e.target.value)}
                            data-testid="input-key-name"
                          />
                          <p className="text-xs text-muted-foreground">
                            Choose a descriptive name to identify where this key is used
                          </p>
                        </div>
                        <Button
                          onClick={handleGenerateKey}
                          disabled={generateKeyMutation.isPending}
                          className="w-full"
                          data-testid="button-create-key"
                        >
                          {generateKeyMutation.isPending ? 'Generating...' : 'Generate Key'}
                        </Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {apiKeys && apiKeys.length > 0 ? (
                <div className="space-y-4">
                  {apiKeys.map((key) => (
                    <div
                      key={key.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover-elevate"
                      data-testid={`api-key-${key.id}`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium" data-testid={`text-key-name-${key.id}`}>{key.name}</p>
                          {key.isActive ? (
                            <Badge variant="default" className="gap-1" data-testid={`badge-active-${key.id}`}>
                              <CheckCircle2 className="w-3 h-3" />
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary" data-testid={`badge-inactive-${key.id}`}>Inactive</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p data-testid={`text-usage-${key.id}`}>
                            <Activity className="w-3 h-3 inline mr-1" />
                            {key.usageCount} requests
                          </p>
                          <p data-testid={`text-created-${key.id}`}>
                            Created: {new Date(key.createdAt).toLocaleDateString()}
                          </p>
                          {key.lastUsedAt && (
                            <p data-testid={`text-last-used-${key.id}`}>
                              Last used: {new Date(key.lastUsedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      {key.isActive && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteKeyMutation.mutate(key.id)}
                          disabled={deleteKeyMutation.isPending}
                          data-testid={`button-delete-${key.id}`}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Deactivate
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Lock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">No API keys yet. Generate your first key to get started.</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Key className="w-4 h-4 mr-2" />
                        Generate Your First Key
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Generate API Key</DialogTitle>
                        <DialogDescription>
                          Create your first API key to start integrating
                        </DialogDescription>
                      </DialogHeader>
                      {generatedKey ? (
                        <div className="space-y-4">
                          <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm font-medium mb-2">Your API Key</p>
                            <div className="flex items-center gap-2">
                              <code className="flex-1 p-2 bg-background rounded text-xs font-mono break-all">
                                {generatedKey}
                              </code>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard(generatedKey)}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                            <div className="flex gap-2">
                              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-destructive mb-1">
                                  Save this key now
                                </p>
                                <p className="text-sm text-destructive/80">
                                  This is the only time you will see this key. Store it securely.
                                </p>
                              </div>
                            </div>
                          </div>
                          <Button onClick={() => setGeneratedKey(null)} className="w-full">
                            Done - I have saved the key
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="key-name-empty">Key Name</Label>
                            <Input
                              id="key-name-empty"
                              placeholder="Production API Key"
                              value={newKeyName}
                              onChange={(e) => setNewKeyName(e.target.value)}
                            />
                          </div>
                          <Button
                            onClick={handleGenerateKey}
                            disabled={generateKeyMutation.isPending}
                            className="w-full"
                          >
                            {generateKeyMutation.isPending ? 'Generating...' : 'Generate Key'}
                          </Button>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Best Practices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-orange-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-500" />
                Security Best Practices
              </CardTitle>
              <CardDescription>Keep your API keys secure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Use Environment Variables</p>
                      <p className="text-sm text-muted-foreground">
                        Store keys in environment variables, never hardcode them
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Never Commit to Git</p>
                      <p className="text-sm text-muted-foreground">
                        Add API keys to .gitignore, use .env files
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Use Different Keys per Environment</p>
                      <p className="text-sm text-muted-foreground">
                        Separate keys for development, staging, and production
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Rotate Keys Regularly</p>
                      <p className="text-sm text-muted-foreground">
                        Generate new keys periodically for security
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Monitor Usage</p>
                      <p className="text-sm text-muted-foreground">
                        Track request counts for unusual activity
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Deactivate Compromised Keys</p>
                      <p className="text-sm text-muted-foreground">
                        Immediately disable any exposed or suspicious keys
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted rounded-lg hover-elevate">
                  <span className="font-medium">What if I lose my API key?</span>
                  <ChevronDown className="w-4 h-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4 px-4 pb-2">
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>
                      API keys are hashed using SHA-256 and cannot be retrieved. If you lose your key:
                    </p>
                    <ol className="list-decimal list-inside space-y-2 ml-2">
                      <li>Generate a new API key with a descriptive name</li>
                      <li>Update your application with the new key</li>
                      <li>Test the integration to ensure it works</li>
                      <li>Deactivate the old key from your dashboard</li>
                    </ol>
                    <p className="text-xs italic">
                      Tip: Store keys in a secure password manager or secrets management service
                    </p>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted rounded-lg hover-elevate">
                  <span className="font-medium">How do I rotate API keys in production?</span>
                  <ChevronDown className="w-4 h-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4 px-4 pb-2">
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p className="font-medium">Safe key rotation process:</p>
                    <ol className="list-decimal list-inside space-y-2 ml-2">
                      <li>Generate a new API key (keep the old one active)</li>
                      <li>Deploy your application with both keys configured</li>
                      <li>Gradually migrate traffic to the new key</li>
                      <li>Monitor for any errors or issues</li>
                      <li>Once stable, deactivate the old key</li>
                    </ol>
                    <div className="p-3 bg-primary/10 border border-primary/20 rounded mt-3">
                      <p className="text-xs">
                        <strong>Zero-downtime tip:</strong> Use feature flags or gradual rollouts to switch keys without service interruption
                      </p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted rounded-lg hover-elevate">
                  <span className="font-medium">What are the rate limits?</span>
                  <ChevronDown className="w-4 h-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4 px-4 pb-2">
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>
                      Each API key has a rate limit of <strong>60 requests per minute</strong>.
                    </p>
                    <p>
                      If you exceed this limit, you will receive a 429 error with a retryAfter value indicating when you can make requests again.
                    </p>
                    <div className="p-3 bg-muted rounded font-mono text-xs mt-3">
                      &#123;<br />
                      &nbsp;&nbsp;"ok": false,<br />
                      &nbsp;&nbsp;"error": "Rate limit exceeded",<br />
                      &nbsp;&nbsp;"retryAfter": 45<br />
                      &#125;
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted rounded-lg hover-elevate">
                  <span className="font-medium">Can I see my API key again after creation?</span>
                  <ChevronDown className="w-4 h-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4 px-4 pb-2">
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>
                      <strong>No.</strong> For security reasons, API keys are only displayed once during creation. They are hashed (SHA-256) before being stored in our database, making it impossible to retrieve the original value.
                    </p>
                    <p>
                      This is industry standard practice used by GitHub, Stripe, AWS, and other major platforms to protect your keys.
                    </p>
                    <div className="flex items-start gap-2 p-3 bg-orange-500/10 border border-orange-500/20 rounded mt-3">
                      <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs">
                        Always save your API key immediately after generation. If lost, you must generate a new one.
                      </p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted rounded-lg hover-elevate">
                  <span className="font-medium">How do I debug API integration issues?</span>
                  <ChevronDown className="w-4 h-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4 px-4 pb-2">
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>Common troubleshooting steps:</p>
                    <ol className="list-decimal list-inside space-y-2 ml-2">
                      <li>Verify the API key is correctly set in X-API-Key header</li>
                      <li>Check that the key is active in your dashboard</li>
                      <li>Monitor the usage count to confirm requests are reaching the server</li>
                      <li>Review error responses for specific error codes</li>
                      <li>Check the{" "}
                        <Link href="/api-docs" className="text-primary hover:underline">
                          API documentation
                        </Link>{" "}
                        for correct request format
                      </li>
                    </ol>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Start Code Example */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileCode className="w-5 h-5" />
                    Quick Start Example
                  </CardTitle>
                  <CardDescription>Copy and paste to get started</CardDescription>
                </div>
                <Link href="/api-docs">
                  <Button variant="outline" size="sm">
                    View Full Documentation
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="javascript">
                <TabsList>
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                </TabsList>

                <TabsContent value="javascript">
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`// Create a swap
const response = await fetch('https://api.zekta.io/api/v1/swap/create', {
  method: 'POST',
  headers: {
    'X-API-Key': 'your_api_key_here',
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
console.log('Order ID:', data.orderId);
console.log('Deposit to:', data.depositAddress);
console.log('Expected amount:', data.expectedAmount);
console.log('Status:', data.status);`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(`const response = await fetch('https://api.zekta.io/api/v1/swap/create', {
  method: 'POST',
  headers: {
    'X-API-Key': 'your_api_key_here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    from: 'SOL',
    to: 'ETH',
    amount: '0.5',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
  })
});`, "Code")}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="python">
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`import requests

response = requests.post(
    'https://api.zekta.io/api/v1/swap/create',
    headers={'X-API-Key': 'your_api_key_here'},
    json={
        'from': 'SOL',
        'to': 'ETH',
        'amount': '0.5',
        'address': '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
    }
)

data = response.json()
print(f"Order ID: {data['orderId']}")
print(f"Deposit to: {data['depositAddress']}")
print(f"Expected amount: {data['expectedAmount']}")
print(f"Status: {data['status']}")`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(`import requests

response = requests.post(
    'https://api.zekta.io/api/v1/swap/create',
    headers={'X-API-Key': 'your_api_key_here'},
    json={
        'from': 'SOL',
        'to': 'ETH',
        'amount': '0.5',
        'address': '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
    }
)`, "Code")}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="curl">
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`curl -X POST https://api.zekta.io/api/v1/swap/create \\
  -H "X-API-Key: your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "from": "SOL",
    "to": "ETH",
    "amount": "0.5",
    "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
  }'`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(`curl -X POST https://api.zekta.io/api/v1/swap/create \\
  -H "X-API-Key: your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"from": "SOL", "to": "ETH", "amount": "0.5", "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"}'`, "Code")}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Resources</CardTitle>
              <CardDescription>Additional documentation and guides</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Link href="/api-docs">
                  <div className="p-4 border rounded-lg hover-elevate cursor-pointer">
                    <div className="flex items-start gap-3">
                      <Code2 className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">API Documentation</p>
                        <p className="text-sm text-muted-foreground">
                          Complete endpoint reference with examples
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link href="/docs">
                  <div className="p-4 border rounded-lg hover-elevate cursor-pointer">
                    <div className="flex items-start gap-3">
                      <Book className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Protocol Documentation</p>
                        <p className="text-sm text-muted-foreground">
                          Learn about Zekta's ZK architecture
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
