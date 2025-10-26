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
import MVP from "@/pages/MVP";
import Docs from "@/pages/Docs";
import Token from "@/pages/Token";
import Revenue from "@/pages/Revenue";
import Admin from "@/pages/Admin";
import Developer from "@/pages/Developer";
import ApiDocs from "@/pages/ApiDocs";
import TestApi from "@/pages/TestApi";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Devs from "@/pages/Devs";
import RevenueShareTestCompleted from "@/pages/BlogPost";
import ZecAnnouncementBlog from "@/pages/ZecAnnouncementBlog";
import RevenueSystemMigration from "@/pages/RevenueSystemMigration";
import X402DocumentationUpdate from "@/pages/X402DocumentationUpdate";
import ApiSdkVision from "@/pages/ApiSdkVision";
import BuyDomain from "@/pages/BuyDomain";
import IntegrationExample from "@/pages/IntegrationExample";
import MyDomains from "@/pages/MyDomains";
import TrackOrder from "@/pages/TrackOrder";
import DomainFeature from "@/pages/DomainFeature";
import ZektaUpdate from "@/pages/ZektaUpdate";
import ZektaZKID from "@/pages/ZektaZKID";
import AnonymousPayments from "@/pages/AnonymousPayments";
import GiftCards from "@/pages/GiftCards";
import MyGiftCards from "@/pages/MyGiftCards";
import SDKDocs from "@/pages/SDKDocs";
import DeveloperDocs from "@/pages/DeveloperDocs";
import AnonymousSwaps from "@/pages/AnonymousSwaps";
import DomainPurchase from "@/pages/DomainPurchase";
import TelegramBot from "@/pages/TelegramBot";
import SecurityPrivacy from "@/pages/SecurityPrivacy";
import AnonymousTwitter from "@/pages/AnonymousTwitter";
import AnonymousTwitterArticle from "@/pages/AnonymousTwitterArticle";
import ZKXTechExplained from "@/pages/TwitterTechExplained";
import ReportBug from "@/pages/ReportBug";
import Bugs from "@/pages/Bugs";
import BugsAdmin from "@/pages/BugsAdmin";
import X402Marketplace from "@/pages/X402Marketplace";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/mvp" component={MVP} />
      <Route path="/docs" component={Docs} />
      <Route path="/token" component={Token} />
      <Route path="/revenue" component={Revenue} />
      <Route path="/admin" component={Admin} />
      <Route path="/developer" component={DeveloperDocs} />
      <Route path="/developer/keys" component={Developer} />
      <Route path="/api-docs" component={ApiDocs} />
      <Route path="/test-api" component={TestApi} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/devs" component={Devs} />
      <Route path="/blog/revenue-share-test-completed" component={RevenueShareTestCompleted} />
      <Route path="/blog/zcash-support-announcement" component={ZecAnnouncementBlog} />
      <Route path="/blog/revenue-system-update" component={RevenueSystemMigration} />
      <Route path="/blog/x402-documentation" component={X402DocumentationUpdate} />
      <Route path="/api-sdk-vision" component={ApiSdkVision} />
      <Route path="/buy-domain" component={BuyDomain} />
      <Route path="/my-domains" component={MyDomains} />
      <Route path="/track-order" component={TrackOrder} />
      <Route path="/domain-feature" component={DomainFeature} />
      <Route path="/integration-example" component={IntegrationExample} />
      <Route path="/zekta-update" component={ZektaUpdate} />
      <Route path="/zekta-zkid" component={ZektaZKID} />
      <Route path="/anonymous-payments" component={AnonymousPayments} />
      <Route path="/gift-cards" component={GiftCards} />
      <Route path="/my-gift-cards" component={MyGiftCards} />
      <Route path="/sdk" component={SDKDocs} />
      <Route path="/anonymous-swaps" component={AnonymousSwaps} />
      <Route path="/domain-purchase" component={DomainPurchase} />
      <Route path="/telegram-bot" component={TelegramBot} />
      <Route path="/security-privacy" component={SecurityPrivacy} />
      <Route path="/anonymousx" component={AnonymousTwitter} />
      <Route path="/zk-twitter" component={AnonymousTwitterArticle} />
      <Route path="/zkx-tech-explained" component={ZKXTechExplained} />
      <Route path="/report-bug" component={ReportBug} />
      <Route path="/bugs/admin" component={BugsAdmin} />
      <Route path="/bugs" component={Bugs} />
      <Route path="/x402marketplace" component={X402Marketplace} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [location] = useLocation();
  const isBugPage = location === '/bugs' || location === '/report-bug' || location === '/bugs/admin';
  const isZKXPage = location === '/zkx-tech-explained';
  const isDocsPage = location === '/docs' || location === '/zekta-zkid' || location === '/anonymous-payments' || location === '/developer' || location === '/sdk' || location === '/anonymous-swaps' || location === '/domain-purchase' || location === '/telegram-bot' || location === '/security-privacy' || isBugPage || isZKXPage;

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
