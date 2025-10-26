import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Database, Eye, Server, AlertTriangle, Mail } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last updated: October 13, 2025
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Our Privacy Commitment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Zekta is built on zero-knowledge cryptography principles. We prioritize your privacy 
                by design, ensuring that your identity and transaction details remain confidential.
              </p>
              <p>
                This policy explains how we handle data in our MVP demonstration platform.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                Data We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Client-Side Data Only</h3>
                <p>
                  Your cryptographic identity (private key, commitment) is generated and stored 
                  exclusively in your browser's localStorage. This data never leaves your device.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Zero-Knowledge Proofs</h3>
                <p>
                  When you execute a swap, we receive only the cryptographic proof - not your identity, 
                  wallet address, or transaction details. The proof demonstrates membership without 
                  revealing who you are.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Technical Logs</h3>
                <p>
                  Our servers maintain minimal technical logs for operational purposes (error tracking, 
                  performance monitoring). These logs do not contain personally identifiable information.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                What We Don't Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <p>✓ We do not collect your name, email, or personal information</p>
              <p>✓ We do not track your wallet addresses</p>
              <p>✓ We do not store your transaction history</p>
              <p>✓ We do not link swaps to individual users</p>
              <p>✓ We do not use cookies for tracking or analytics</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5 text-primary" />
                Third-Party Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Blockchain Networks</h3>
                <p>
                  Transactions are executed on public blockchains (Solana, Ethereum, etc.). 
                  These networks have their own data retention policies. Blockchain data is 
                  public and permanent by design.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Exchange API</h3>
                <p>
                  Swap requests are proxied through our relayer to a third-party exchange API. 
                  The exchange sees only the destination address you provide - not your identity 
                  or source wallet.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                Your Privacy Rights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Since we operate on zero-knowledge principles and don't collect personal data, 
                there's no user account or profile to delete. You maintain complete control:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Your identity exists only in your browser's localStorage</li>
                <li>You can delete your identity anytime by clearing browser data</li>
                <li>No server-side account exists for you</li>
                <li>Proofs are anonymous and cannot be traced back to you</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-primary" />
                MVP Disclaimer
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>
                Zekta is currently in MVP (Minimum Viable Product) stage. This is a demonstration 
                platform for educational and testing purposes. Do not use it for large-value 
                transactions or as a production service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>
                If you have questions about this privacy policy, please contact us at{' '}
                <a 
                  href="mailto:hello@zekta.io" 
                  className="text-primary hover:underline"
                  data-testid="link-contact-email"
                >
                  hello@zekta.io
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
