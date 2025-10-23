"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, ArrowUpCircle, ArrowDownCircle, CircleDollarSign, ChevronDown, ChevronRight, AlertCircle, Ban, Plus, Minus } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Skeleton } from "@/components/ui/skeleton"
import { tokenLogos } from "@/constants/nodeOptions"
import Image from "next/image"
import { getStrategyAPY } from "@/lib/apy"

interface VaultDashboardBalancesProps {
  depositData: any;
  strategiesData: any[];
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

function StrategyCard({strategyData}: {strategyData: any}) {

  const [apy, setAPY] = useState<number>(0);

  useEffect(() => {
    async function fetchAPY() {
      const apy = await getStrategyAPY(strategyData);
      setAPY(apy);
    }
    fetchAPY();
  }, [strategyData]);


  // Calculate percentage change (mock data for now)
  const percentageChange = strategyData.initialCapital ? 
    ((strategyData.value - strategyData.initialCapital) / strategyData.initialCapital * 100) : 0;
  const isPositive = percentageChange >= 0;
  const unrealizedProfit = strategyData.value - (strategyData.initialCapital || 0);

  // Get token icon for background
  const tokenIcon = strategyData.tokenInfo?.icon || '/PNG/usdc-logo.png';

  

  return (
    <Card className="relative bg-slate-800/80 border border-slate-600/30 rounded-xl p-6 backdrop-blur-sm hover:bg-slate-800/90 transition-all duration-200 overflow-hidden">
      {/* Background token image on the left */}
      <div className="absolute left-0 top-0 w-128 h-full opacity-10 overflow-hidden">
        <div 
          className="w-70 h-70 bg-contain bg-no-repeat bg-center transform -translate-x-8 -translate-y-12 rounded-full"
          style={{
            backgroundImage: `url(${tokenIcon})`,
            filter: 'brightness(0.9)'
          }}
        />
      </div>

      <div className="relative z-10 space-y-4">
        {/* Top row - Strategy name/APY and Value/Change */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <h3 className="flex text-white font-semibold text-xl items-center gap-2">
              {strategyData.tokenInfo?.symbol || ''}
              <div className="text-sm mt-1">
              {strategyData.strategyType === "deposit" ? "(Main Deposit)" : "(Yield)"}
              </div>
            </h3>
            <p className="text-gray-400 text-base">
              APY: {apy > 0 ? <span className="text-green-400 font-medium">{apy.toFixed(2)}%</span> : '-'}
            </p>
          </div>
          
          <div className="flex justify-end items-center gap-2">
            <span className="text-white font-bold text-2xl">
              ${strategyData.value.toFixed(2)}
            </span>
            <span className={`text-base font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              ({isPositive ? '+' : ''}{percentageChange.toFixed(1)}%)
            </span>
          </div>
        </div>

        {/* Middle and Bottom rows - Aligned buttons with metrics */}
        <div className="flex justify-between items-center mt-10">
          {/* Left side - Action buttons */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="sm"
              className="bg-transparent border-slate-500 text-slate-300 hover:bg-white/10 hover:text-white hover:border-slate-400 rounded-lg px-4 py-2 font-medium"
            >
              Add
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-transparent border-slate-500 text-slate-300 hover:bg-white/10 hover:text-white hover:border-slate-400 rounded-lg px-4 py-2 font-medium"
            >
              Reduce
            </Button>
          </div>

          {/* Right side - Financial metrics */}
          <div className="flex gap-8 text-base">
            <span className="text-slate-400">
              Initial Capital: <span className="text-white font-medium">{strategyData.strategyType === "deposit"? "-" : `$${(strategyData.initialCapital || 0).toFixed(3)}`}</span>
            </span>
            <span className="flex text-slate-400">
              Unrealized Profit: <span className={`font-semibold ${unrealizedProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {strategyData.strategyType === "deposit"? <div className="text-white ml-1">-</div> : `${unrealizedProfit < 0 ? "-" : ""}$${Math.abs(unrealizedProfit).toFixed(5)}`}
              </span>
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function VaultDashboardBalances({ depositData, strategiesData, isLoading }: VaultDashboardBalancesProps) {
  const [totalValue, setTotalValue] = useState<number>(0);
  const [hasError, setHasError] = useState<boolean>(false);

  const isEmpty = depositData && depositData.balance == 0;

  useEffect(() => {
    if (depositData && strategiesData) {
      let total = depositData.value || 0;
      strategiesData.forEach(strategy => {
        total += strategy.value || 0;
      });
      setTotalValue(total);
    }
  }, [depositData, strategiesData]);

  return (
    <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-700/30 backdrop-blur-sm rounded-lg shadow-lg transition-all duration-200">
      {/*<CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Wallet className="h-5 w-5 text-blue-400" />
          Strategy Positions
        </CardTitle>
      </CardHeader>*/}
      <CardContent className="space-y-4 pb-4">
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
          <div className="font-medium text-lg mb-4">Total NAV: ${totalValue.toFixed(2)}</div>
          <div className="space-y-4">
            {depositData && (
              <StrategyCard strategyData={depositData} />
            )}
            {strategiesData.map((strategy, idx) => (
              <StrategyCard key={`strategy-${idx}`} strategyData={strategy} />
            ))}
          </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}