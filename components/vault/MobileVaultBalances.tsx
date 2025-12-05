"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Ban, TrendingUp, TrendingDown } from "lucide-react"

interface MobileVaultBalancesProps {
  depositData?: any;
  vaultData?: any;
  strategiesData?: any[];
  isLoading?: boolean;
}

function SkeletonRow() {
  return (
    <div className="flex items-center justify-between py-2.5 px-3 border-b border-[#16161f]">
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center px-3">
      <Ban className="h-8 w-8 text-slate-500 mb-2" />
      <h3 className="text-sm font-medium text-white mb-0.5">No Positions</h3>
      <p className="text-xs text-slate-400">No active positions in this vault yet.</p>
    </div>
  );
}

export function MobileVaultBalances({ depositData, vaultData, strategiesData = [], isLoading = false }: MobileVaultBalancesProps) {
  
  const formatValue = (value: number) => {
    return value.toFixed(2);
  };

  const isEmpty = !depositData && strategiesData.length === 0;

  // Calculate total
  let totalValue = 0;
  if (depositData) {
    totalValue += depositData.balance * depositData.tokenInfo.usdPrice;
  }
  if (strategiesData) {
    totalValue += strategiesData.reduce((sum, strategy) => sum + (strategy.value || 0), 0);
  }

  return (
    <div className="bg-[#101018]/50 border-y border-[#16161f]">
      {/* Header */}
      <div className="px-3 py-2 bg-[#0d0d14] border-b border-[#16161f]">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Active Positions</span>
      </div>

      {/* Body */}
      {isLoading ? (
        <>
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </>
      ) : isEmpty ? (
        <EmptyState />
      ) : (
        <>
          {/* Main Deposit */}
          {depositData && (
            <PositionRow
              icon={depositData.tokenInfo.icon}
              name={depositData.tokenInfo.symbol}
              capitalAmount={depositData.balance}
              capitalSymbol={depositData.tokenInfo.symbol}
              pnl={0.00}
              positionValue={depositData.balance * depositData.tokenInfo.usdPrice}
            />
          )}
          
          {/* Strategy Positions */}
          {depositData && strategiesData && strategiesData.map((position, idx) => (
            <PositionRow
              key={idx}
              icon={position.tokenInfo.icon}
              name={position.tokenInfo.symbol}
              capitalAmount={position.initialCapital}
              capitalSymbol={depositData.tokenInfo.symbol}
              pnl={position.value - position.initialCapital}
              positionValue={position.value}
            />
          ))}

          {/* Total Row */}
          <div className="flex items-center justify-between py-2.5 px-3 bg-[#0d0d14]">
            <span className="text-white font-semibold text-xs">Total Value</span>
            <span className="text-white font-semibold text-xs tabular-nums">${formatValue(totalValue)}</span>
          </div>
        </>
      )}
    </div>
  );
}

interface PositionRowProps {
  icon: string;
  name: string;
  capitalAmount: number;
  capitalSymbol: string;
  pnl: number;
  positionValue: number;
}

function PositionRow({ icon, name, capitalAmount, capitalSymbol, pnl, positionValue }: PositionRowProps) {
  const formatValue = (value: number) => value.toFixed(2);
  const isProfit = pnl >= 0;
  const capitalValue = positionValue - pnl;
  const pnlPercent = capitalValue > 0 ? (pnl / capitalValue) * 100 : 0;

  return (
    <div className="py-2.5 px-3 border-b border-[#16161f]">
      {/* Top Row: Name and Value */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <img 
            src={icon} 
            alt={name} 
            className="w-5 h-5 rounded-full"
          />
          <span className="text-white font-medium text-xs">{name}</span>
        </div>
        <span className="text-xs font-bold text-white tabular-nums">${formatValue(positionValue)}</span>
      </div>
      
      {/* Bottom Row: Capital and PnL */}
      <div className="flex items-center justify-between text-[10px] ml-7">
        <span className="text-slate-400 tabular-nums">
          {formatValue(capitalAmount)} {capitalSymbol}
        </span>
        <div className="flex items-center gap-1">
          {isProfit ? (
            <TrendingUp className="h-2.5 w-2.5 text-[#10b981]" />
          ) : (
            <TrendingDown className="h-2.5 w-2.5 text-[#ef4444]" />
          )}
          <span className={`font-medium tabular-nums ${isProfit ? "text-[#10b981]" : "text-[#ef4444]"}`}>
            {isProfit ? "+" : ""}${Math.abs(pnl).toFixed(2)}
          </span>
          <span className={`tabular-nums ${isProfit ? "text-[#10b981]/70" : "text-[#ef4444]/70"}`}>
            ({isProfit ? "+" : ""}{pnlPercent.toFixed(2)}%)
          </span>
        </div>
      </div>
    </div>
  );
}
