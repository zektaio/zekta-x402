import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, AlertTriangle, Scale, UserCheck, Copyright, RefreshCw, XCircle, Mail } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">
            Last updated: October 13, 2025
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Agreement to Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                By accessing or using Zekta ("the Service"), you agree to be bound by these 
                Terms of Service. If you disagree with any part of these terms, you may not 
                access the Service.
              </p>
            </CardContent>
          </Card>

          <Card className="border-yellow-500/20 bg-yellow-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500">
                <AlertTriangle className="w-5 h-5" />
                MVP Status - Important Notice
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p className="font-semibold text-foreground">
                This is a Minimum Viable Product (MVP) for demonstration and testing purposes only.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>The Service is provided "as-is" without any guarantees</li>
                <li>Features may be incomplete, unstable, or subject to change</li>
                <li>Not intended for production use or large-value transactions</li>
                <li>May be discontinued or modified at any time without notice</li>
                <li>No service level agreements (SLAs) or uptime guarantees</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-primary" />
                User Responsibilities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Identity Management</h3>
                <p>
                  You are solely responsible for securing your cryptographic identity. 
                  Your private key is stored only in your browser's localStorage. 
                  We cannot recover lost keys or identities.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Transaction Verification</h3>
                <p>
                  You must verify all transaction details (amounts, addresses, networks) 
                  before confirming. Blockchain transactions are irreversible.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Compliance</h3>
                <p>
                  You are responsible for complying with all applicable laws in your jurisdiction, 
                  including tax reporting, anti-money laundering (AML), and know-your-customer (KYC) 
                  regulations.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Prohibited Uses</h3>
                <p>You may not use the Service to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                  <li>Violate any laws or regulations</li>
                  <li>Engage in fraudulent or deceptive activities</li>
                  <li>Interfere with or disrupt the Service</li>
                  <li>Attempt to gain unauthorized access to systems</li>
                  <li>Launder money or finance illegal activities</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-primary" />
                Disclaimers and Limitations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">No Warranties</h3>
                <p>
                  The Service is provided "as is" and "as available" without warranties of any kind, 
                  whether express or implied, including but not limited to warranties of merchantability, 
                  fitness for a particular purpose, or non-infringement.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Third-Party Services</h3>
                <p>
                  The Service integrates with third-party blockchain networks and exchange APIs. 
                  We are not responsible for the operation, security, or availability of these 
                  external services.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Financial Risks</h3>
                <p>
                  Cryptocurrency transactions involve significant financial risk. Prices are volatile, 
                  transactions are irreversible, and you may lose all funds. Never invest more than 
                  you can afford to lose.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Limitation of Liability</h3>
                <p>
                  To the maximum extent permitted by law, Zekta shall not be liable for any indirect, 
                  incidental, special, consequential, or punitive damages, or any loss of profits or 
                  revenues, whether incurred directly or indirectly, or any loss of data, use, or 
                  goodwill arising out of your use of the Service.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Copyright className="w-5 h-5 text-primary" />
                Intellectual Property
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                The Service and its original content, features, and functionality are owned by 
                Zekta and are protected by international copyright, trademark, and other 
                intellectual property laws.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-primary" />
                Changes to Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We reserve the right to modify these terms at any time. We will notify users of 
                material changes by updating the "Last updated" date. Your continued use of the 
                Service after changes constitutes acceptance of the modified terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-primary" />
                Termination
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We reserve the right to terminate or suspend access to the Service immediately, 
                without prior notice, for any reason, including breach of these Terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-primary" />
                Governing Law
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                These Terms shall be governed by and construed in accordance with applicable 
                international laws, without regard to conflict of law provisions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>
                For questions about these Terms of Service, please contact us at{' '}
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
