"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ChevronDown, Search, ExternalLink } from "lucide-react"
import { getTokenInfos, getDAMMV2PoolsByMints } from "@/lib/api"
import { MeteoraDAMMV2PoolData } from "@/types/api"
import { Skeleton } from "@/components/ui/skeleton"

interface TokenOption {
  mint: string;
  symbol: string;
  icon: string;
  decimals?: number;
}

interface PoolInfo {
  address: string;
  tokenA: TokenOption;
  tokenB: TokenOption;
  priceRange?: string;
  baseFee: string;
  totalLiquidity: number;
  volume24h: number;
  feeToTVL24h: number;
}

interface MeteoraDAMMModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Predefined token options
const TOKEN_OPTIONS: TokenOption[] = [
  {
    mint: "So11111111111111111111111111111111111111112",
    symbol: "SOL",
    icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
  },
  {
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    symbol: "USDC",
    icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
  },
  {
    mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    symbol: "USDT",
    icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg",
  },
  {
    mint: "METvsvVRapdj9cFLzq4Tr43xK4tAjQfwX76z3n6mWQL",
    symbol: "MET",
    icon: "https://wsrv.nl/?w=32&h=32&url=https%3A%2F%2Fassets.meteora.ag%2Fmet-token.svg&dpr=2&quality=80",
  }
];

// Mock pool data for demonstration
const MOCK_POOLS: PoolInfo[] = [
  {
    address: "8szGkuLTAux9XMgZ2vtY39jVSowEcpBfFfD8hXSEqdGC",
    tokenA: TOKEN_OPTIONS[0], // SOL
    tokenB: TOKEN_OPTIONS[1], // USDC
    priceRange: "100 - 200",
    baseFee: "1.00%",
    totalLiquidity: 2000000.00,
    volume24h: 2000000.00,
    feeToTVL24h: 0.1,
  },
  {
    address: "9XdqFvH8vPGj8jjZxXxG9Wq5zYvD8xUZxZxZxZxZxZx",
    tokenA: TOKEN_OPTIONS[0], // SOL
    tokenB: TOKEN_OPTIONS[1], // USDC
    priceRange: "100 - 200",
    baseFee: "1.00%",
    totalLiquidity: 2000000.00,
    volume24h: 2000000.00,
    feeToTVL24h: 0.1,
  }
];

function TokenSelector({ 
  selectedToken, 
  setToken, 
  label 
}: { 
  selectedToken: TokenOption | null; 
  setToken: (token: TokenOption) => void;
  label: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [mintAddress, setMintAddress] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState('');

  const validateToken = async (mint: string) => {
    if (!mint.trim()) return;
    
    setIsValidating(true);
    setValidationError('');
    
    try {
      const tokenInfo = await getTokenInfos([mint]);
      
      if (!tokenInfo || Object.keys(tokenInfo).length === 0 || !tokenInfo[mint] || !tokenInfo[mint].icon) {
        setValidationError('Invalid token or not allowed');
        setIsValidating(false);
        return;
      }

      const newToken: TokenOption = {
        mint: mint,
        symbol: tokenInfo[mint].symbol,
        icon: tokenInfo[mint].icon,
        decimals: tokenInfo[mint].decimals,
      };

      setToken(newToken);
      setMintAddress('');
      setIsOpen(false);
    } catch (error) {
      setValidationError('Failed to validate token');
    }
    
    setIsValidating(false);
  };

  return (
    <div className="relative flex-1">
      <Button
        variant="outline"
        className="w-full h-12 justify-between bg-slate-800/50 border-slate-600/30 text-white hover:bg-slate-700/50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedToken ? 
          <div className="flex items-center gap-2">
            <img src={selectedToken.icon} alt={selectedToken.symbol} className="w-6 h-6 rounded-full" />
            <span>{selectedToken.symbol}</span>
          </div>
          : <span className="text-slate-400">Select token</span>
        }
        <ChevronDown className="h-4 w-4" />
      </Button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600/30 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {/* Manual Token Input Section */}
          <div className="p-3 border-b border-slate-600/30">
            <div className="text-slate-400 text-xs font-medium mb-2">Enter Token Mint Address</div>
            <div className="flex gap-2">
              <Input
                value={mintAddress}
                onChange={(e) => setMintAddress(e.target.value)}
                placeholder="Token mint address..."
                className="bg-slate-700/50 border-slate-600/30 text-white text-sm"
              />
              <Button
                size="sm"
                onClick={() => validateToken(mintAddress)}
                disabled={isValidating || !mintAddress.trim()}
                className="bg-blue-600 hover:bg-blue-700 px-3"
              >
                {isValidating ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
            {validationError && (
              <div className="text-red-400 text-xs mt-1">{validationError}</div>
            )}
          </div>

          {/* Predefined Token Options */}
          <div className="text-slate-400 text-xs font-medium p-3 pb-1">Popular Tokens</div>
          {TOKEN_OPTIONS.map((token) => (
            <button
              key={token.symbol}
              className="w-full flex items-center gap-3 p-3 hover:bg-slate-700/50 text-left"
              onClick={() => {validateToken(token.mint)}}
            >
              <img src={token.icon} alt={token.symbol} className="w-6 h-6 rounded-full" />
              <div className="flex-1">
                <div className="text-white font-medium">{token.symbol}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function PoolCard({ pool, onSelect }: { pool: PoolInfo; onSelect: (pool: PoolInfo) => void }) {
  return (
    <Card className="bg-slate-800/50 border-slate-600/30 hover:bg-slate-700/50 transition-colors cursor-pointer p-3">
      <CardContent className="px-0">
        {/* Header with token pair and fee badge */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center -space-x-3">
              <img src={pool.tokenA.icon} alt={pool.tokenA.symbol} className="w-8 h-8 rounded-full border-2 border-slate-800" />
              <img src={pool.tokenB.icon} alt={pool.tokenB.symbol} className="w-8 h-8 rounded-full border-2 border-slate-800" />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-white font-medium">{pool.tokenA.symbol}-{pool.tokenB.symbol}</span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`https://www.meteora.ag/dammv2/${pool.address}`, '_blank');
                }}
                className="hover:text-blue-400 transition-colors"
              >
                <ExternalLink className="h-4 w-4 text-slate-400 hover:text-blue-400" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">24h Fee/TVL:</span>
            <span className="bg-blue-500/20 text-blue-400 text-xs font-medium px-2 py-1 rounded">
              {pool.feeToTVL24h.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Pool details */}
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Total Liquidity:</span>
            <span className="text-white font-medium">${pool.totalLiquidity.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">24h Vol:</span>
            <span className="text-white font-medium">${pool.volume24h.toLocaleString()}</span>
          </div>
          {pool.priceRange && (
            <div className="flex justify-between">
              <span className="text-slate-400">Price Range:</span>
              <span className="text-white font-medium">{pool.priceRange}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-slate-400">Base Fee:</span>
            <span className="text-white font-medium">{pool.baseFee}</span>
          </div>
        </div>

        {/* View button */}
        <Button 
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => onSelect(pool)}
        >
          Select
        </Button>
      </CardContent>
    </Card>
  );
}

function CompactPoolCard({ pool, onSelect }: { pool: PoolInfo; onSelect: (pool: PoolInfo) => void }) {
  return (
    <Card className="bg-slate-800/50 border-slate-600/30 hover:bg-slate-700/50 transition-colors cursor-pointer">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center -space-x-2">
              <img src={pool.tokenA.icon} alt={pool.tokenA.symbol} className="w-6 h-6 rounded-full border-2 border-slate-800" />
              <img src={pool.tokenB.icon} alt={pool.tokenB.symbol} className="w-6 h-6 rounded-full border-2 border-slate-800" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white font-medium text-sm">{pool.tokenA.symbol}-{pool.tokenB.symbol}</span>
              {pool.priceRange && (
                <span className="text-slate-400 text-xs">Price Range: {pool.priceRange}</span>
              )}
              <span className="text-slate-400 text-xs">Base Fee: {pool.baseFee}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-white text-sm font-medium">${pool.totalLiquidity.toLocaleString()}</div>
              <div className="text-slate-400 text-xs">Total Liquidity</div>
            </div>
            <div className="text-right">
              <div className="text-white text-sm font-medium">${pool.volume24h.toLocaleString()}</div>
              <div className="text-slate-400 text-xs">24h Vol</div>
            </div>
            <div className="text-right">
              <div className="bg-blue-500/20 text-blue-400 text-xs font-medium px-2 py-1 rounded">
                {pool.feeToTVL24h.toFixed(2)}%
              </div>
              <div className="text-slate-400 text-xs">24h Fee/TVL</div>
            </div>
            <Button 
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => onSelect(pool)}
            >
              View
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function MeteoraDAMMModal({ isOpen, onClose }: MeteoraDAMMModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [tokenA, setTokenA] = useState<TokenOption | null>(null);
  const [tokenB, setTokenB] = useState<TokenOption | null>(null);
  const [filteredPools, setFilteredPools] = useState<PoolInfo[]>([]);

  // Filter pools based on search query and selected tokens
  // const handleSearch = () => {
  //   let filtered = pools;

  //   if (tokenA && tokenB) {
  //     filtered = filtered.filter(pool => 
  //       (pool.tokenA.mint === tokenA.mint && pool.tokenB.mint === tokenB.mint) ||
  //       (pool.tokenA.mint === tokenB.mint && pool.tokenB.mint === tokenA.mint)
  //     );
  //   } else if (tokenA) {
  //     filtered = filtered.filter(pool => 
  //       pool.tokenA.mint === tokenA.mint || pool.tokenB.mint === tokenA.mint
  //     );
  //   } else if (tokenB) {
  //     filtered = filtered.filter(pool => 
  //       pool.tokenA.mint === tokenB.mint || pool.tokenB.mint === tokenB.mint
  //     );
  //   }

  //   if (searchQuery.trim()) {
  //     filtered = filtered.filter(pool => 
  //       pool.tokenA.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       pool.tokenB.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       pool.address.toLowerCase().includes(searchQuery.toLowerCase())
  //     );
  //   }

  //   setFilteredPools(filtered);
  // };

  async function fetchPoolByPairs(tokenA: TokenOption, tokenB: TokenOption) {
    let poolData: MeteoraDAMMV2PoolData[] = await getDAMMV2PoolsByMints(tokenA.mint, tokenB.mint);
    if(!poolData){
      setFilteredPools([]);
      return;
    }
    // Filter the first 10 only:
    poolData = poolData.slice(0, 10);
    poolData = poolData.filter(data => data.tvl > 0);
    const parsedPoolData: PoolInfo[] = poolData.map((data) => {
        const feeToTVL24h = data.tvl > 0 ? (data.fee24h * 100) / data.tvl : 0;
        return {
            address: data.pool_address,
            tokenA: tokenA,
            tokenB: tokenB,
            priceRange: "100-200",
            baseFee: `${data.base_fee.toFixed(2)}%`,
            totalLiquidity: data.tvl,
            volume24h: data.volume24h,
            feeToTVL24h: Number(feeToTVL24h.toFixed(2)),
        }
    })
    setFilteredPools(parsedPoolData);
  }
  
  // Search Pool
  useEffect(() => {
    if(tokenA && tokenB){
      fetchPoolByPairs(tokenA, tokenB);
    }

  }, [tokenA, tokenB])

  const handlePoolSelect = (pool: PoolInfo) => {
    console.log("Selected pool:", pool);
    // TODO: Navigate to deposit amount selection
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl pb-0 pl-4.5 pr-2.5 bg-slate-900/95 border-slate-700/50 backdrop-blur-sm flex flex-col min-h-screen sm:min-h-[80vh] sm:max-h-[85vh] z-[200] md:mt-10 w-full">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
            <img 
              src="https://docs.meteora.ag/images/logo/meteora.png" 
              alt="Meteora" 
              className="w-8 h-8"
            />
            Meteora DAMM V2
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto flex-1 pt-4 min-h-[60vh]">
          {/* Search Pool */}
          {/*<div className="space-y-2">
            <label className="text-slate-400 text-sm font-medium">Search Pool:</label>
            <div className="flex gap-2">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by token or address..."
                className="flex-1 bg-slate-800/50 border-slate-600/30 text-white"
              />
              <Button
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>*/}

          {/* Select Pair */}
          <div className="space-y-2">
            <label className="text-slate-400 text-sm font-medium">Select Pair:</label>
            <div className="flex gap-3">
              <TokenSelector
                selectedToken={tokenA}
                setToken={setTokenA}
                label=""
              />
              <TokenSelector
                selectedToken={tokenB}
                setToken={setTokenB}
                label=""
              />
            </div>
          </div>

          {/* Available Pools */}
          <div className="space-y-3">
            <label className="text-slate-400 text-sm font-medium">Available Pools:</label>
            {filteredPools.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                No pools found matching your criteria
              </div>
            ) : (
              <div className="space-y-3 h-full">
                {/* Desktop view - Expanded cards */}
                <div className="space-y-3">
                  {filteredPools.map((pool) => (
                    <PoolCard key={pool.address} pool={pool} onSelect={handlePoolSelect} />
                  ))}
                </div>
                
                {/* Mobile view - Compact cards 
                <div className="md:hidden space-y-2">
                  {filteredPools.map((pool) => (
                    <CompactPoolCard key={pool.address} pool={pool} onSelect={handlePoolSelect} />
                  ))}
                </div>*/}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
