import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, Database, Globe, Cpu, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

interface X402Service {
  id: number;
  name: string;
  description: string;
  category: string;
  priceUSD: number;
  x402Endpoint: string;
  logoUrl: string | null;
  isActive: boolean;
}

const CATEGORY_ICONS: Record<string, any> = {
  AI: Sparkles,
  Data: Database,
  Web3: Globe,
  Infrastructure: Cpu,
};

const CATEGORY_COLORS: Record<string, string> = {
  AI: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
  Data: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  Web3: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
  Infrastructure: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
};

export default function X402Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: servicesResponse, isLoading } = useQuery<{ ok: boolean; services: X402Service[] }>({
    queryKey: ['/api/x402/services'],
  });

  const services = servicesResponse?.services || [];
  const categories = ['All', ...new Set(services.map(s => s.category))];

  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && service.isActive;
  });

  return (
    <div className="relative min-h-screen">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6 mb-12"
          >
            <Badge className="px-6 py-2 text-base bg-purple-500/20 text-purple-400 border-purple-500/50">
              <Globe className="w-4 h-4 mr-2 flex-shrink-0" />
              x402 Protocol Marketplace
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              <span className="gradient-text">x402 Service Marketplace</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Access AI, data, and Web3 services instantly. Pay with any cryptocurrency via zkSwap.
            </p>

            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {['ZEKTA', 'SOL', 'BTC', 'ETH', 'BNB', 'MATIC', 'AVAX', 'ZEC'].map(crypto => (
                <Badge key={crypto} variant="outline" className="px-3 py-1">
                  {crypto}
                </Badge>
              ))}
            </div>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-services"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Badge
                  key={category}
                  className={`cursor-pointer px-4 py-2 ${
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover-elevate'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                  data-testid={`badge-category-${category.toLowerCase()}`}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </motion.div>

          {/* Services Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          ) : filteredServices.length === 0 ? (
            <Card className="p-12 text-center">
              <CardContent>
                <p className="text-muted-foreground">No services found matching your criteria</p>
              </CardContent>
            </Card>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredServices.map((service, index) => {
                const CategoryIcon = CATEGORY_ICONS[service.category] || Cpu;
                const categoryColor = CATEGORY_COLORS[service.category] || 'bg-gray-500/20 text-gray-400 border-gray-500/50';

                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="hover-elevate h-full flex flex-col" data-testid={`card-service-${service.id}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <Badge className={categoryColor}>
                            <CategoryIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                            {service.category}
                          </Badge>
                          <span className="text-xl font-bold gradient-text">
                            ${service.priceUSD.toFixed(3)}
                          </span>
                        </div>
                        <CardTitle className="text-xl">{service.name}</CardTitle>
                        <CardDescription className="text-sm line-clamp-3">
                          {service.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col justify-end">
                        <Button
                          className="w-full"
                          data-testid={`button-purchase-${service.id}`}
                        >
                          <Sparkles className="w-4 h-4 mr-2 flex-shrink-0" />
                          Purchase Access
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16"
          >
            <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-6 h-6 text-purple-400 flex-shrink-0" />
                  How it works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">1</Badge>
                      <h3 className="font-semibold">Choose Service</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Browse AI, data, and Web3 services from the x402 ecosystem
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">2</Badge>
                      <h3 className="font-semibold">Pay with ZEKTA</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Pay using $ZEKTA token or any supported cryptocurrency
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">3</Badge>
                      <h3 className="font-semibold">Instant Access</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Get immediate access to the service via x402 protocol
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    All payments are converted to USDC on Base via Zekta's anonymous zkSwap protocol, then forwarded to the x402 service provider. 
                    No accounts, no API keys required. Instant settlement in 2 seconds.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
