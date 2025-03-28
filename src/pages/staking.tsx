import type { NextPage } from 'next';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  ArrowUpDown,
  Search,
  Info
} from 'lucide-react';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useStaking } from '@/hooks/query/useStaking';

const Staking: NextPage = () => {
  const [search, setSearch] = useState('');
  const [chainFilter, setChainFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'apy' | 'tvl'>('apy');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const { sData } = useStaking();

  const filteredAndSortedProtocols = useMemo(() => {
    return sData && sData
      .filter(protocol =>
        (search === '' ||
          protocol.nameProject.toLowerCase().includes(search.toLowerCase()) ||
          protocol.nameToken.toLowerCase().includes(search.toLowerCase())
        ) &&
        (chainFilter === 'all' || protocol.chain === chainFilter) &&
        (categoryFilter === 'all' || protocol.categories.includes(categoryFilter))
      )
      .sort((a, b) => {
        const modifier = sortOrder === 'desc' ? 1 : -1;
        return modifier * (a[sortBy] - b[sortBy]);
      });
  }, [search, chainFilter, categoryFilter, sortBy, sortOrder, sData]);

  const availableChains = [...new Set(sData && sData.map(p => p.chain))];
  const availableCategories = [...new Set(sData && sData.flatMap(p => p.categories))];

  return (
    <div className="container mx-auto p-6 space-y-6 text-white">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <h1 className="text-3xl font-bold">Staking Protocols</h1>

        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder="Search protocols, tokens..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select
            value={chainFilter}
            onValueChange={setChainFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Chains" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Chains</SelectItem>
              {availableChains.map(chain => (
                <SelectItem key={chain} value={chain}>{chain}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={categoryFilter}
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {availableCategories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Select
              value={sortBy}
              onValueChange={(value: 'apy' | 'tvl') => setSortBy(value)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apy">APY</SelectItem>
                <SelectItem value="tvl">TVL</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            >
              <ArrowUpDown className={`h-4 w-4 text-black ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedProtocols && filteredAndSortedProtocols.map(protocol => (
          <Card key={protocol.idProtocol} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <div className="relative h-12 w-12">
                <Image
                  src={protocol.logo}
                  alt={`${protocol.nameProject} logo`}
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <CardTitle>{protocol.nameProject}</CardTitle>
                <CardDescription>{protocol.nameToken} • {protocol.chain}</CardDescription>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4 space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">APY</p>
                  <p className="font-semibold text-green-600">{protocol.apy}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">TVL</p>
                  <p className="font-semibold">
                    ${(protocol.tvl / 1_000_000).toFixed(1)}M
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {protocol.categories.map(category => (
                  <Badge key={category} variant="secondary">
                    {category}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Info className="h-4 w-4 mr-2" /> Details
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View Protocol Details</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button size="sm">Stake Now</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredAndSortedProtocols?.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          No staking protocols found matching your filters.
        </div>
      )}
    </div>
  );
};

export default Staking;