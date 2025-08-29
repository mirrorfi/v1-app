"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, ArrowUpCircle, ArrowDownCircle, CircleDollarSign, ChevronDown, ChevronRight, AlertCircle, Ban } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Skeleton } from "@/components/ui/skeleton"

const MOCK_DATA = {
  "spot": {
    "totalNAV": 603.5568164462218,
    "tokens": [
      {
        "token": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        "amount": 3.618457,
        "tokenPrice": 0.9997154076174277,
        "tokenPriceChange24h": -0.006127811787221399,
        "value": 3.6174272147011344
      },
      {
        "token": "So11111111111111111111111111111111111111112",
        "amount": 0,
        "tokenPrice": 203.48165636210445,
        "tokenPriceChange24h": -2.365840257826531,
        "value": 0
      },
      {
        "token": "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
        "amount": 600,
        "tokenPrice": 0.9998989820525345,
        "tokenPriceChange24h": -0.004928174520440394,
        "value": 599.9393892315206
      }
    ]
  },
  "kamino": [
    {
      "obligation": "Vnaq7vbHuwHHHSTzDYVnMf2WzFPdAzQA1iAa5NtpXNw",
      "totalNAV": 7.294131454890394,
      "deposits": [
        {
          "token": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
          "amount": 5.017756601895915,
          "tokenPrice": 0.9997154076174277,
          "tokenPriceChange24h": -0.006127811787221399,
          "value": 5.016328586589414,
          "yield": 0.028205881805429687
        },
        {
          "token": "jupSoLaHXQiZZTSfEWMTRRgpnyFm8f6sZdosWBjx93v",
          "amount": 0.0056159734490792545,
          "tokenPrice": 230.81289393179938,
          "tokenPriceChange24h": -2.4852886481251417,
          "value": 1.2962390840261315,
          "yield": 2.6705914336563715e-7
        },
        {
          "token": "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
          "amount": 1.0067630648534336,
          "tokenPrice": 0.9998989820525345,
          "tokenPriceChange24h": -0.004928174520440394,
          "value": 1.0066613637150381,
          "yield": 0.041429798428957096
        }
      ],
      "borrows": [
        {
          "token": "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
          "amount": 4.5649850928e-10,
          "tokenPrice": 268.4628244886504,
          "tokenPriceChange24h": -2.277255528113643,
          "value": 1.225528791761672e-7,
          "yield": 0
        },
        {
          "token": "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn",
          "amount": 0.00010018898769186949,
          "tokenPrice": 250.20129173962027,
          "tokenPriceChange24h": -2.2126911203036204,
          "value": 0.025067414138590663,
          "yield": 0
        },
        {
          "token": "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo",
          "amount": 0.00003004775709838606,
          "tokenPrice": 0.9998333193964987,
          "tokenPriceChange24h": -0.026603544099213006,
          "value": 0.00003004274872009904,
          "yield": 0
        }
      ]
    }
  ]
}

// Define types for the data structure
interface TokenData {
  token: string;
  amount: number;
  tokenPrice: number;
  tokenPriceChange24h: number;
  value: number;
  yield?: number;
}

interface SpotPosition {
  totalNAV: number;
  tokens: TokenData[];
}

interface KaminoPosition {
  obligation: string;
  totalNAV: number;
  deposits: TokenData[];
  borrows: TokenData[];
}

interface BalanceData {
  spot: SpotPosition;
  kamino: KaminoPosition[];
}

// Token name mapping - ideally this would come from a more comprehensive source
const tokenNameMap: Record<string, string> = {
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": "USDC",
  "So11111111111111111111111111111111111111112": "SOL",
  "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB": "USDT",
  "jupSoLaHXQiZZTSfEWMTRRgpnyFm8f6sZdosWBjx93v": "JUP",
  "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So": "mSOL",
  "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn": "JitoSOL",
  "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo": "bSOL"
};

// Token logo mapping for visual display
const tokenLogoMap: Record<string, string> = {
  "USDC": "U",
  "USDT": "T",
  "SOL": "S",
  "JUP": "J",
  "mSOL": "M",
  "JitoSOL": "J",
  "bSOL": "B"
};

// Market name mapping
const marketNameMap: Record<string, string> = {
  "Vnaq7vbHuwHHHSTzDYVnMf2WzFPdAzQA1iAa5NtpXNw": "Kamino Main Market"
};

// Token item component for consistent styling
interface TokenItemProps {
  token: TokenData;
  type: 'spot' | 'deposit' | 'borrow';
}

function TokenItem({ token, type }: TokenItemProps) {
  const tokenName = tokenNameMap[token.token] || token.token.slice(0, 4);
  const logoChar = tokenLogoMap[tokenName] || tokenName[0];
  
  const gradientClass = {
    spot: "from-blue-500 to-cyan-500",
    deposit: "from-green-500 to-emerald-500",
    borrow: "from-red-500 to-pink-500"
  }[type];
  
  const amountDisplay = token.amount.toFixed(
    token.amount < 0.01 ? 6 : token.amount < 0.1 ? 4 : 2
  );
  
  return (
    <div className="flex items-center justify-between text-xs bg-[#0F1218] rounded p-2 border border-[#2D3748]/30">
      <div className="flex items-center gap-2 w-[50%] min-w-0">
        <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${gradientClass} flex items-center justify-center flex-shrink-0`}>
          <span className="text-white text-[10px] font-bold">{logoChar}</span>
        </div>
        <span className="text-gray-300 truncate">{tokenName}</span>
      </div>
      
      <div className="flex items-center gap-1 w-[20%] justify-start">
        <span className="text-white font-medium">{amountDisplay}</span>
      </div>
      
      <div className="flex flex-col items-end w-[30%]">
        <span className="text-white font-medium">${token.value.toFixed(token.value < 0.01 ? 6 : 2)}</span>
        {type === 'spot' && (
          <span className={token.tokenPriceChange24h >= 0 ? "text-green-400 text-[10px]" : "text-red-400 text-[10px]"}>
            {token.tokenPriceChange24h >= 0 ? "+" : ""}{(token.tokenPriceChange24h * 100).toFixed(2)}%
          </span>
        )}
        {type === 'deposit' && (
          <span className="text-emerald-400 text-[10px]">
            APY: {((token.yield || 0) * 100).toFixed(2)}%
          </span>
        )}
        {type === 'borrow' && (
          <span className="text-red-400 text-[10px]">
            Rate: {((token.yield || 0) * 100).toFixed(2)}%
          </span>
        )}
      </div>
    </div>
  );
}

// Category section component for collapsible sections
interface CategorySectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  totalValue: number;
  defaultOpen?: boolean;
}

function CategorySection({ title, icon, children, totalValue, defaultOpen = true }: CategorySectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="bg-[#111827]/50 rounded-lg border border-blue-900/30 overflow-hidden">
      <div 
        className="flex items-center justify-between p-3 cursor-pointer" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-sm font-medium text-white">{title}</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white font-medium">${totalValue.toFixed(2)}</span>
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-blue-400" />
          ) : (
            <ChevronRight className="h-4 w-4 text-blue-400" />
          )}
        </div>
      </div>
      {isOpen && (
        <div className="px-3 pb-3">
          {children}
        </div>
      )}
    </div>
  );
}

// Kamino Obligation component
interface ObligationProps {
  obligation: KaminoPosition;
}

function ObligationSection({ obligation }: ObligationProps) {
  const [isOpen, setIsOpen] = useState(true);
  const marketName = marketNameMap[obligation.obligation] || "Unknown Market";
  
  // Filter out tokens with very small amounts
  const deposits = obligation.deposits.filter(d => d.amount > 0.000001);
  const borrows = obligation.borrows.filter(b => b.amount > 0.000001);
  
  return (
    <div className="mb-2">
      <div 
        className="flex items-center justify-between py-2 px-1 cursor-pointer bg-[#172033]/50 rounded mb-1" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">K</span>
          </div>
          <span className="text-sm font-medium text-slate-300">{marketName}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white text-xs font-medium">${obligation.totalNAV.toFixed(2)}</span>
          {isOpen ? (
            <ChevronDown className="h-3 w-3 text-slate-400" />
          ) : (
            <ChevronRight className="h-3 w-3 text-slate-400" />
          )}
        </div>
      </div>
      
      {isOpen && (
        <div className="space-y-1">
          {deposits.length > 0 && (
            <div className="mb-2">
              <div className="flex items-center mb-1">
                <ArrowUpCircle className="h-3 w-3 text-green-400 mr-1" />
                <span className="text-xs text-slate-400">Deposits</span>
              </div>
              <div className="space-y-1">
                {deposits.map((deposit, idx) => (
                  <TokenItem key={`deposit-${idx}`} token={deposit} type="deposit" />
                ))}
              </div>
            </div>
          )}
          
          {borrows.length > 0 && (
            <div>
              <div className="flex items-center mb-1">
                <ArrowDownCircle className="h-3 w-3 text-red-400 mr-1" />
                <span className="text-xs text-slate-400">Borrows</span>
              </div>
              <div className="space-y-1">
                {borrows.map((borrow, idx) => (
                  <TokenItem key={`borrow-${idx}`} token={borrow} type="borrow" />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface VaultDashboardBalancesProps {
  vaultBalances: any;
  isLoading: boolean;
}

// Skeleton loading components
function SkeletonCategorySummary() {
  return (
    <div className="grid grid-cols-3 gap-2 mb-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-[#0F1218] p-2 rounded-lg border border-[#2D3748]/30">
          <Skeleton className="h-3 w-16 mb-1" />
          <Skeleton className="h-4 w-12" />
        </div>
      ))}
    </div>
  );
}

function SkeletonSummaryRow() {
  return (
    <div className="flex items-center justify-between text-sm bg-blue-900/30 p-2 rounded-md mb-3">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-3 w-12" />
      <Skeleton className="h-4 w-14" />
    </div>
  );
}

function SkeletonCategorySection() {
  return (
    <div className="bg-[#111827]/50 rounded-lg border border-blue-900/30 overflow-hidden mb-3">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4" />
        </div>
      </div>
      <div className="px-3 pb-3">
        <div className="space-y-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between text-xs bg-[#0F1218] rounded p-2 border border-[#2D3748]/30">
              <div className="flex items-center gap-2 w-[50%]">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-3 w-14" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Error and empty state components
function ErrorState() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <AlertCircle className="h-12 w-12 text-red-500 mb-3" />
      <h3 className="text-lg font-medium text-white mb-1">Failed to load balance data</h3>
      <p className="text-sm text-slate-400 max-w-xs">There was an issue loading your balance information. Please try again later.</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <Ban className="h-12 w-12 text-slate-500 mb-3" />
      <h3 className="text-lg font-medium text-white mb-1">No balance data available</h3>
      <p className="text-sm text-slate-400 max-w-xs">There are no active positions in this vault. Create a position to see your balance data.</p>
    </div>
  );
}

export function VaultDashboardBalances({ vaultBalances, isLoading }: VaultDashboardBalancesProps) {
  // Use the MOCK_DATA as fallback
  const [balanceData, setBalanceData] = useState<any>(null);
  const [spotValue, setSpotValue] = useState<number>(0);
  const [kaminoValue, setKaminoValue] = useState<number>(0);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoading && vaultBalances) {
      try {
        setBalanceData(vaultBalances);
        
        // Check if the data has the expected structure
        if (vaultBalances.spot && vaultBalances.kamino) {
          const vaultSpotValue = vaultBalances.spot.totalNAV || 0;
          const vaultKaminoValue = vaultBalances.kamino.reduce((sum: number, pos: any) => sum + (pos.totalNAV || 0), 0);
          
          setSpotValue(vaultSpotValue);
          setKaminoValue(vaultKaminoValue);
          setTotalValue(vaultSpotValue + vaultKaminoValue);
          setHasError(false);
        } else {
          console.log("Incomplete vault data structure");
          setHasError(true);
        }
      } catch (error) {
        console.log("Vault Data Error", error);
        setHasError(true);
      }
    }
  }, [vaultBalances, isLoading]);

  // Check if the data is empty (has structure but no values)
  const isEmpty = balanceData && 
    (!balanceData.spot?.tokens?.some((t: any) => t.amount > 0) && 
     !balanceData.kamino?.some((k: any) => k.deposits?.length > 0 || k.borrows?.length > 0));

  // For demo purposes, assume a 5% gain over the last week
  const totalGain = totalValue * 0.05;
  const duration = "1 week";
  
  // Get active tokens from spot positions (amount > 0)
  const activeSpotTokens = balanceData?.spot?.tokens?.filter((token: any) => token.amount > 0) || [];

  return (
    <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-700/30 backdrop-blur-sm rounded-lg shadow-lg transition-all duration-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center gap-2">
          <Wallet className="h-5 w-5 text-blue-400" />
          Balance Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pb-4">
        {isLoading ? (
          /* Loading State */
          <>
            <SkeletonCategorySummary />
            <SkeletonSummaryRow />
            <SkeletonCategorySection />
            <SkeletonCategorySection />
          </>
        ) : hasError ? (
          /* Error State */
          <ErrorState />
        ) : isEmpty ? (
          /* Empty State */
          <EmptyState />
        ) : (
          /* Data Loaded State */
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-[#0F1218] p-2 rounded-lg border border-[#2D3748]/30">
                <div className="text-slate-400 text-xs">Spot</div>
                <div className="text-white font-medium">${spotValue.toFixed(2)}</div>
              </div>
              <div className="bg-[#0F1218] p-2 rounded-lg border border-[#2D3748]/30">
                <div className="text-slate-400 text-xs">Kamino</div>
                <div className="text-white font-medium">${kaminoValue.toFixed(2)}</div>
              </div>
              <div className="bg-[#0F1218] p-2 rounded-lg border border-[#2D3748]/30">
                <div className="text-slate-400 text-xs">Total</div>
                <div className="text-emerald-400 font-medium">${totalValue.toFixed(2)}</div>
              </div>
            </div>

            {/* Summary Row */}
            <div className="flex items-center justify-between text-sm bg-blue-900/30 p-2 rounded-md mb-3">
              <span className="text-white font-semibold">${totalValue.toFixed(2)}</span>
              <span className="text-gray-400">{duration}</span>
              <span className="text-green-400 font-medium">+${totalGain.toFixed(2)}</span>
            </div>

            {/* Main Categories */}
            <div className="space-y-3">
              {/* Spot Category */}
              <CategorySection 
                title="Spot Positions"
                icon={<CircleDollarSign className="h-4 w-4 text-blue-400" />}
                totalValue={spotValue}
              >
                <div className="space-y-1">
                  {activeSpotTokens.length > 0 ? (
                    activeSpotTokens.map((token: any, index: number) => (
                      <TokenItem key={`spot-${index}`} token={token} type="spot" />
                    ))
                  ) : (
                    <div className="text-center py-2 text-slate-400 text-xs">
                      No active spot positions
                    </div>
                  )}
                </div>
              </CategorySection>
              
              {/* Kamino Category */}
              <CategorySection
                title="Kamino Lending Positions"
                icon={<Wallet className="h-4 w-4 text-purple-400" />}
                totalValue={kaminoValue}
              >
                <div className="space-y-2">
                  {balanceData?.kamino?.length > 0 ? (
                    balanceData.kamino.map((obligation: any, index: number) => (
                      <ObligationSection key={`obligation-${index}`} obligation={obligation} />
                    ))
                  ) : (
                    <div className="text-center py-2 text-slate-400 text-xs">
                      No active Kamino positions
                    </div>
                  )}
                </div>
              </CategorySection>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}