import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ParticleBackground } from "@/components/ParticleBackground";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Landing from "@/pages/Landing";
import Docs from "@/pages/Docs";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import X402DocumentationUpdate from "@/pages/X402DocumentationUpdate";
import X402Marketplace from "@/pages/X402Marketplace";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/docs" component={Docs} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/blog/x402-documentation" component={X402DocumentationUpdate} />
      <Route path="/x402" component={X402Marketplace} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [location] = useLocation();
  const isDocsPage = location === '/docs';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      {!isDocsPage && <ParticleBackground />}
      <div className="flex flex-col min-h-screen">
        {!isDocsPage && <Header />}
        <main className="flex-1">
          <Router />
        </main>
        {!isDocsPage && <Footer />}
      </div>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <AppContent />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
