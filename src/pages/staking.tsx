import type { NextPage } from 'next';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Info,
  Filter,
  ChevronUp,
  ChevronDown,
  RefreshCcw
} from 'lucide-react';

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
  SheetTitle,
  SheetFooter
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useStaking } from '@/hooks/query/useStaking';
import { useBalance } from '@/hooks/query/useBalance';
import { Label } from '@/components/ui/label';
import { FilterSection } from '@/components/filter/filter-staking';
import { useStake } from '@/hooks/mutation/useStake';
import { useToast } from '@chakra-ui/react';
import { Input } from '@/components/ui/input';

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
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { sData, sLoading: isLoading } = useStaking();

  const filteredAndSortedProtocols = useMemo(() => {
    if (!sData) return [];

    return sData
      .filter(protocol =>
        (search === '' ||
          protocol.nameProject.toLowerCase().includes(search.toLowerCase()) ||
          protocol.nameToken.toLowerCase().includes(search.toLowerCase())
        ) &&
        (chainFilter === 'all' || protocol.chain === chainFilter) &&
        (categoryFilter === 'all' || protocol.categories.includes(categoryFilter))
      )
      .sort((a, b) => {
        const modifier = sortOrder === 'desc' ? -1 : 1;
        return modifier * (a[sortBy] - b[sortBy]);
      });
  }, [search, chainFilter, categoryFilter, sortBy, sortOrder, sData]);

  const availableChains = useMemo(() =>
    [...new Set(sData?.map(p => p.chain) || [])],
    [sData]
  );

  const availableCategories = useMemo(() =>
    [...new Set(sData?.flatMap(p => p.categories) || [])],
    [sData]
  );

  const clearFilters = () => {
    setSearch('');
    setChainFilter('all');
    setCategoryFilter('all');
    setSortBy('apy');
    setSortOrder('desc');
  };

  const renderSortIcon = () => {
    return sortOrder === 'desc' ?
      <ChevronDown className="h-4 w-4" /> :
      <ChevronUp className="h-4 w-4" />;
  };

  const getLogoUrl = (chain) => {
    return chainLogos.find(c => c.name === chain)?.logo || '/default-logo.png';
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
            <Filter className="h-4 w-4 text-black" />
            Filters
            {(search || chainFilter !== 'all' || categoryFilter !== 'all') && (
              <Badge variant="default" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                !
              </Badge>
            )}
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
            renderSortIcon={renderSortIcon}
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
                onClearFilters={clearFilters}
                renderSortIcon={renderSortIcon}
                isMobile
              />
            </div>
            <SheetFooter className="mt-4">
              <Button onClick={() => setIsFilterOpen(false)}>Apply Filters</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {isLoading ? (
          [...Array(6)].map((_, index) => (
            <SkeletonCard key={index} />
          ))
        ) : filteredAndSortedProtocols.length > 0 ? (
          filteredAndSortedProtocols.map(protocol => (
            <StakingCard
              key={protocol.idProtocol}
              protocol={protocol}
              getLogoUrl={getLogoUrl}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-muted-foreground">
            No staking protocols found matching your filters.
            <Button
              variant="link"
              onClick={clearFilters}
              className="block mx-auto mt-2"
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const StakingCard = ({ protocol, getLogoUrl }) => {
  const toast = useToast();
  const [amount, setAmount] = useState("");
  const { mutation } = useStake();
  const { balance, loading, error, refresh } = useBalance({
    chainName: protocol.chain
  });


  const handleStake = async () => {
    if (!amount || Number(amount) <= 0 || balance === null || balance < amount) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to stake.",
        status: "error"
      });
      return;
    }

    try {
      await mutation.mutateAsync(
        {
          addressStaking: protocol.addressStaking,
          amount: amount,
          decimals: 18
        },
        {
          onSuccess: () => {
            toast({
              title: "Staking Successful",
              description: `You have staked ${amount} ETH on ${protocol.chain}.`,
              status: "success"
            });

            setTimeout(() => {
              refresh();
            }, 2000);
          },
          onError: (error) => {
            toast({
              title: "Staking Error",
              description: `Error: ${error.message}`,
              status: "error"
            });
          }
        }
      );
    } catch (error) {
      toast({
        title: "Staking Error",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: "error"
      });
    }
  };

  return (
    <Card
      key={protocol.idProtocol}
      className="hover:shadow-lg transition-shadow flex flex-col min-w-[230px] relative group"
    >
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        <div className="flex min-w-20 relative -mt-8 sm:-mt-12">
          <div className="absolute z-0 top-0">
            <div className="relative h-8 w-8 sm:h-12 sm:w-12">
              <Image
                src={getLogoUrl(protocol.chain)}
                alt={`${protocol.chain} logo`}
                fill
                className="object-contain rounded-full"
              />
            </div>
          </div>
          <div className='absolute z-10 left-5 sm:left-7 top-0'>
            <div className="relative h-8 w-8 sm:h-12 sm:w-12">
              <Image
                src={protocol.logo}
                alt={`${protocol.nameProject} logo`}
                fill
                className="object-contain rounded-full"
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
              {protocol.apy.toFixed(2)}%
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
      <CardFooter className='flex flex-col gap-3'>
        <div className="w-full flex justify-between items-center">
          <Label className="block">
            Balance: {loading ? "Loading..." : error ? "Error loading balance" : balance ? `${parseFloat(balance).toFixed(6)} ETH` : "0 ETH"}
          </Label>
          <Button
            variant="outline"
            size="sm"
            onClick={refresh}
            disabled={loading}
          >
            <RefreshCcw className='w-5 h-5' />
          </Button>
        </div>
        <Input
          id="amount"
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1"
        />
        <div className="flex w-full justify-between">
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
          <Button size="sm" className="text-xs sm:text-sm" onClick={handleStake} disabled={!balance || balance < amount}>
            Stake Now
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const SkeletonCard = () => (
  <Card className="flex flex-col min-w-[230px]">
    <CardHeader className="flex flex-row items-center space-x-4 pb-2">
      <div className="flex min-w-20 relative -mt-8 sm:-mt-12">
        <Skeleton className="h-8 w-8 sm:h-12 sm:w-12 rounded-full" />
        <Skeleton className="h-8 w-8 sm:h-12 sm:w-12 rounded-full absolute left-5 sm:left-7" />
      </div>
      <div className="flex-grow">
        <Skeleton className="h-6 w-24 mb-2" />
        <Skeleton className="h-4 w-32" />
      </div>
    </CardHeader>
    <Separator />
    <CardContent className="pt-4 space-y-3 flex-grow">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-4 w-8 mb-2" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div>
          <Skeleton className="h-4 w-8 mb-2" />
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </CardContent>
    <CardFooter className="flex justify-between">
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-8 w-24" />
    </CardFooter>
  </Card>
);

export default Staking;