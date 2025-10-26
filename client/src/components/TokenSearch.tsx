import { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { isContractAddress } from '@/lib/tokenContracts';

interface Token {
  symbol: string;
  name: string;
  network?: string;
  contractAddress?: string;
  isPriority?: boolean;
  isComingSoon?: boolean;
}

interface TokenSearchProps {
  chainId: string | null;
  value: string;
  onChange: (value: string) => void;
  label: string;
  tokens: Token[];
  isLoading?: boolean;
  testId?: string;
}

export default function TokenSearch({
  chainId,
  value,
  onChange,
  label,
  tokens,
  isLoading = false,
  testId
}: TokenSearchProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sort tokens: priority tokens first, then others
  const sortedTokens = useMemo(() => {
    return [...tokens].sort((a, b) => {
      if (a.isPriority && !b.isPriority) return -1;
      if (!a.isPriority && b.isPriority) return 1;
      return 0;
    });
  }, [tokens]);

  // Filter tokens by search query (supports contract address)
  const filteredTokens = useMemo(() => {
    if (!searchQuery) return sortedTokens;
    
    const query = searchQuery.toLowerCase().trim();
    
    // Check if query is a contract address
    const isAddress = isContractAddress(query);
    
    return sortedTokens.filter(token => {
      // Search by symbol or name
      const matchesText = token.symbol.toLowerCase().includes(query) ||
                         token.name.toLowerCase().includes(query);
      
      // Search by contract address (exact match)
      const matchesContract = isAddress && token.contractAddress?.toLowerCase() === query;
      
      return matchesText || matchesContract;
    });
  }, [sortedTokens, searchQuery]);

  // Get selected token label
  const selectedToken = tokens.find(t => t.symbol === value);
  const displayValue = selectedToken 
    ? `${selectedToken.symbol.toUpperCase()} - ${selectedToken.name}`
    : 'Select token...';

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={!chainId || isLoading}
            data-testid={testId}
          >
            <span className="truncate">{displayValue}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput 
              placeholder="Search tokens..." 
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandEmpty>No token found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {filteredTokens.map((token) => (
                <CommandItem
                  key={token.symbol + (token.network || '')}
                  value={token.symbol}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? '' : currentValue);
                    setOpen(false);
                    setSearchQuery('');
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === token.symbol ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{token.symbol.toUpperCase()}</span>
                      {token.isPriority && !token.isComingSoon && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                          TOP
                        </span>
                      )}
                      {token.isComingSoon && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 font-semibold border border-cyan-500/40 animate-pulse">
                          COMING SOON
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{token.name}</span>
                    {token.contractAddress && token.contractAddress !== 'native' && (
                      <span className="text-[10px] text-muted-foreground/70 truncate mt-0.5 font-mono">
                        {token.contractAddress}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {!chainId && (
        <p className="text-xs text-muted-foreground">Select a chain first</p>
      )}
    </div>
  );
}
