import Image from 'next/image';
import {
  Search,
  X,
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const chainLogos = [
  { name: 'Arbitrum Sepolia', logo: '/chains/arbitrum-logo.png' },
  { name: 'Base Sepolia', logo: '/chains/base-logo.png' },
  { name: 'Decaf Testnet', logo: '/chains/decaf-logo.png' },
];

export const FilterSection = ({
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
  renderSortIcon,
  isMobile = false
}) => {
  const hasActiveFilters = search || chainFilter !== 'all' || categoryFilter !== 'all';

  return (
    <div className={`${isMobile ? 'space-y-4' : 'flex flex-row gap-4 items-center flex-wrap'}`}>
      <div className="relative flex-grow max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
        <Input
          placeholder="Search protocols, tokens..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            onClick={() => setSearch('')}
          >
            <X size={16} />
          </button>
        )}
      </div>

      <Select
        value={chainFilter}
        onValueChange={setChainFilter}
      >
        <SelectTrigger className={`w-full sm:w-[180px] ${chainFilter !== 'all' ? 'border-primary' : ''}`}>
          <SelectValue placeholder="All Chains" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Chains</SelectItem>
          {availableChains.map(chain => (
            <SelectItem key={chain} value={chain}>
              <div className="flex items-center gap-2">
                <div className="relative h-4 w-4">
                  <Image
                    src={chainLogos.find(c => c.name === chain)?.logo || '/default-logo.png'}
                    alt={chain}
                    width={16}
                    height={16}
                    className="rounded-full"
                  />
                </div>
                <span>{chain}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={categoryFilter}
        onValueChange={setCategoryFilter}
      >
        <SelectTrigger className={`w-full sm:w-[180px] ${categoryFilter !== 'all' ? 'border-primary' : ''}`}>
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
          className="relative"
          aria-label={`Sort ${sortOrder === 'desc' ? 'ascending' : 'descending'}`}
        >
          {renderSortIcon()}
        </Button>
      </div>

      {hasActiveFilters && (
        <Button
          variant="destructive"
          size="sm"
          onClick={onClearFilters}
          className="flex items-center gap-2"
        >
          <X className="h-4 w-4" /> Clear
        </Button>
      )}
    </div>
  );
};
