import type { NextPage } from 'next';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  ArrowUpDown,
  Search,
  Info,
  Filter,
  X
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { useStaking } from '@/hooks/query/useStaking';
import DialogStake from '@/components/dialog/dialog-stake';

const chainLogos = [
  { name: 'Arbitrum Sepolia', logo: '/chains/arbitrum-logo.png' },
  { name: 'Base Sepolia', logo: '/chains/base-logo.png' },
  { name: 'Decaf Testnet', logo: '/chains/decaf-logo.png' },
];

const Staking: NextPage = () => {
  const [search, setSearch] = useState('');
  const [chainFilter, setChainFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'apy' | 'tvl'>('apy');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [open, setOpen] = useState(false)

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

  const clearFilters = () => {
    setSearch('');
    setChainFilter('all');
    setCategoryFilter('all');
    setSortBy('apy');
    setSortOrder('asc');
  };

  return (
    <div className="md:container mx-auto p-4 sm:p-6 space-y-6 text-white">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-bold">Staking Protocols</h1>

        <div className="md:hidden w-full flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 text-black"
          >
            <Filter className="h-4 w-4 text-black" /> Filters
          </Button>
        </div>

        <div className="hidden md:flex flex-wrap gap-4 items-center">
          <FilterSection
            search={search}
            setSearch={setSearch}
            chainFilter={chainFilter}
            setChainFilter={setChainFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            availableChains={availableChains}
            availableCategories={availableCategories}
            onClearFilters={clearFilters}
          />
        </div>

        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetContent className="w-full max-w-md">
            <SheetHeader>
              <SheetTitle>Filter Staking Protocols</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-4">
              <FilterSection
                search={search}
                setSearch={setSearch}
                chainFilter={chainFilter}
                setChainFilter={setChainFilter}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                availableChains={availableChains}
                availableCategories={availableCategories}
                onClearFilters={() => {
                  clearFilters();
                  setIsFilterOpen(false);
                }}
                isMobile
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredAndSortedProtocols ? filteredAndSortedProtocols.map(protocol => (
          <Card
            key={protocol.idProtocol}
            className="hover:shadow-lg transition-shadow flex flex-col min-w-[230px]"
          >
            <DialogStake
              open={open}
              onClose={() => setOpen(false)}
              addressStaking={typeof protocol === "object" ? protocol?.addressStaking : ""}
              addressToken={typeof protocol === "object" ? protocol?.addressToken : ""}
            />
            <CardHeader className="flex flex-row items-center space-x-4 pb-2 relative">
              <div className="flex min-w-20 relative -mt-8 sm:-mt-12">
                <div className="absolute z-0 top-0">
                  <div className="relative h-8 w-8 sm:h-12 sm:w-12">
                    {chainLogos.find(chain => chain.name === protocol.chain)?.logo && (
                      <Image
                        src={chainLogos.find(chain => chain.name === protocol.chain)?.logo || '/default-logo.png'}
                        alt={`${protocol.chain} logo`}
                        fill
                        className="object-contain"
                      />
                    )}
                  </div>
                </div>
                <div className='absolute z-10 left-5 sm:left-7 top-0'>
                  <div className="relative h-8 w-8 sm:h-12 sm:w-12">
                    <Image
                      src={protocol.logo}
                      alt={`${protocol.nameProject} logo`}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
              <div className="flex-grow">
                <CardTitle className="text-base sm:text-lg">{protocol.nameProject}</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  {protocol.nameToken} • {protocol.chain}
                </CardDescription>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4 space-y-3 flex-grow">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">APY</p>
                  <p className="font-semibold text-green-600 text-sm sm:text-base">
                    {protocol.apy}%
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">TVL</p>
                  <p className="font-semibold text-sm sm:text-base">
                    ${(protocol.tvl / 1_000_000).toFixed(1)}M
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {protocol.categories.map(category => (
                  <Badge
                    key={category}
                    variant="secondary"
                    className="text-xs"
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                      <Info className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> Details
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View Protocol Details</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button size="sm" className="text-xs sm:text-sm" onClick={() => setOpen(true)}>Stake Now</Button>
            </CardFooter>
          </Card>
        )) : (
          [...Array(6)].map((_, index) => (
            <Card key={index} className="animate-pulse bg-white/50 flex flex-col min-w-[230px]">
              <CardHeader className="h-16 rounded-md"></CardHeader>
              <Separator />
              <CardContent className="pt-4 space-y-3 flex-grow">
                <div className="h-6 rounded-md"></div>
                <div className="h-4 rounded-md w-3/4"></div>
                <div className="h-4 rounded-md w-1/2"></div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="h-8 rounded-md w-1/3"></div>
                <div className="h-8 rounded-md w-1/3"></div>
              </CardFooter>
            </Card>
          )))}
      </div>

      {filteredAndSortedProtocols?.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          No staking protocols found matching your filters.
        </div>
      )}
    </div>
  );
};

const FilterSection = ({
  search,
  setSearch,
  chainFilter,
  setChainFilter,
  categoryFilter,
  setCategoryFilter,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  availableChains,
  availableCategories,
  onClearFilters,
  isMobile = false
}) => {
  return (
    <div className={`flex md:flex-row flex-col ${isMobile ? 'space-y-4' : 'flex-row gap-4 items-center flex-wrap'}`}>
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
        <SelectTrigger className="w-full sm:w-[180px]">
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
        <SelectTrigger className="w-full sm:w-[180px]">
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
          <SelectTrigger className="w-full sm:w-[120px]">
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

      <Button
        variant="destructive"
        size="sm"
        onClick={onClearFilters}
        className="flex items-center gap-2"
      >
        <X className="h-4 w-4" /> Clear Filters
      </Button>
    </div>
  );
};

export default Staking;