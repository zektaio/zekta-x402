import { Link } from 'wouter';

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            © 2025 Zekta. Zero-Knowledge Identity for x402 Protocol.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <Link 
              href="/x402"
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="link-marketplace"
            >
              x402 Marketplace
            </Link>
            
            <Link 
              href="/blog/x402-documentation"
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="link-blog-x402"
            >
              x402 Documentation
            </Link>
            
            <Link 
              href="/privacy"
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="link-privacy"
            >
              Privacy
            </Link>
            
            <Link 
              href="/terms"
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="link-terms"
            >
              Terms
            </Link>
            
            <a 
              href="mailto:hello@zekta.io"
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="link-contact"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
