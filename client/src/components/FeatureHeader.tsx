import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

export default function FeatureHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Home</span>
            </Button>
          </Link>
          
          <Link href="/">
            <span className="text-2xl font-bold gradient-text cursor-pointer">ZEKTA</span>
          </Link>
        </div>

        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" data-testid="button-nav-home">
            <Link href="/">
              <Home className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm" data-testid="button-nav-docs">
            <Link href="/docs">Docs</Link>
          </Button>
          <Button asChild variant="default" size="sm" data-testid="button-nav-swap">
            <Link href="/swap">Launch App</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
