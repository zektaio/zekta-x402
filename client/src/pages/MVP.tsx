import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Key, ArrowRightLeft, CheckCircle2 } from 'lucide-react';
import ZKIDTab from '@/components/ZKIDTab';
import ZKSwapTab from '@/components/ZKSwapTab';
import ConfirmationTab from '@/components/ConfirmationTab';

export default function MVP() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold">
            <span className="gradient-text">ZEKTA</span> Protocol
          </h1>
          <p className="text-xl text-muted-foreground">
            Zero-Knowledge Action Layer for Anonymous Cryptocurrency Swaps
          </p>
          <Badge variant="outline" className="text-sm">
            Client-Side Privacy • Zekta ZK Private Swap
          </Badge>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="zkid" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="zkid" className="gap-2" data-testid="tab-zkid">
              <Key className="w-4 h-4" />
              ZK ID
            </TabsTrigger>
            <TabsTrigger value="swap" className="gap-2" data-testid="tab-swap">
              <ArrowRightLeft className="w-4 h-4" />
              ZK Swap
            </TabsTrigger>
            <TabsTrigger value="confirmation" className="gap-2" data-testid="tab-confirmation">
              <CheckCircle2 className="w-4 h-4" />
              Confirmation
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: ZK Identity */}
          <TabsContent value="zkid">
            <ZKIDTab />
          </TabsContent>

          {/* Tab 2: ZK Swap */}
          <TabsContent value="swap">
            <ZKSwapTab />
          </TabsContent>

          {/* Tab 3: Confirmation */}
          <TabsContent value="confirmation">
            <ConfirmationTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
