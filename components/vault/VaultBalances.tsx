"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Ban, TrendingUp, TrendingDown } from "lucide-react"

interface VaultBalancesProps {
  depositData?: any;
  vaultData?: any;
  strategiesData?: any[];
  isLoading?: boolean;
}

function SkeletonRow() {
  return (
    <div className="flex items-center border-b border-gray-700/50 py-4">
      <div className="flex-1 flex items-center gap-3 px-6">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="flex-1 px-6">
        <Skeleton className="h-4 w-24 mb-1" />
        <Skeleton className="h-3 w-16" />
      </div>
      <div className="flex-1 px-6">
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="flex-1 px-6 text-right">
        <Skeleton className="h-4 w-20 ml-auto" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Ban className="h-12 w-12 text-slate-500 mb-3" />
      <h3 className="text-lg font-medium text-white mb-1">No Positions</h3>
      <p className="text-sm text-slate-400 max-w-xs">There are no active positions in this vault yet.</p>
    </div>
  );
}

export function VaultBalances({ depositData, vaultData, strategiesData = [], isLoading = false }: VaultBalancesProps) {
  const [positions, setPositions] = useState<any[]>([]);
  const [totals, setTotals] = useState({ capital: 0, pnl: 0, value: 0 });

  useEffect(() => {
    if (depositData || strategiesData.length > 0) {
      const allPositions = [];
      
      // Add deposit as first position
      if (depositData) {
        allPositions.push({
          name: depositData.tokenInfo?.symbol || "Deposit",
          icon: depositData.tokenInfo?.icon || "/PNG/usdc-logo.png",
          capital: depositData.capital || 0,
          value: depositData.value || 0,
          pnl: (depositData.value || 0) - (depositData.capital || 0),
        });
      }

      // Add all strategies
      strategiesData.forEach((strategy) => {
        allPositions.push({
          name: strategy.strategyName || strategy.strategyType || "Strategy",
          icon: strategy.icon || strategy.tokenInfo?.icon || "/PNG/usdc-logo.png",
          capital: strategy.capital || 0,
          value: strategy.value || 0,
          pnl: (strategy.value || 0) - (strategy.capital || 0),
        });
      });

      setPositions(allPositions);

      // Calculate totals
      const totalCapital = allPositions.reduce((sum, pos) => sum + pos.capital, 0);
      const totalValue = allPositions.reduce((sum, pos) => sum + pos.value, 0);
      const totalPnl = totalValue - totalCapital;

      setTotals({ capital: totalCapital, pnl: totalPnl, value: totalValue });
    }
  }, [depositData, strategiesData]);

  const formatValue = (value: number) => {
    return value.toFixed(2);
  };

  const formatPnL = (pnl: number) => {
    const sign = pnl >= 0 ? "+" : "";
    return `${sign}$${formatValue(Math.abs(pnl))}`;
  };

  const isEmpty = !depositData && strategiesData.length === 0;

  return (
    <Card className="rounded-xl bg-[#101018] border border-[#16161f] overflow-hidden py-0 gap-0">
      {/* Table Header */}
      <div className="flex items-center border-b border-[#16161f] py-4 bg-[#0d0d14]">
        <div className="flex-1 px-6">
          <span className="text-xs font-semibold text-gray-400">Active Position</span>
        </div>
        <div className="flex-1 px-6">
          <span className="text-xs font-semibold text-gray-400">Deposited Capital</span>
        </div>
        <div className="flex-1 px-6">
          <div className="text-xs font-semibold text-gray-400 whitespace-nowrap">Unrealized Profit</div>
        </div>
        <div className="flex-1 px-6 text-center">
          <span className="text-xs font-semibold text-gray-400">Position Value</span>
        </div>
      </div>

      {/* Table Body */}
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
              capitalValue={depositData.balance * depositData.tokenInfo.usdPrice}
              capitalAmount={depositData.balance}
              capitalSymbol="USDC"
              pnl={0.00}
              positionValue={depositData.balance * depositData.tokenInfo.usdPrice}
              isDeposit={true}
            />
          )}
          
          {depositData && strategiesData && strategiesData.map((position, idx) => (
            <PositionRow
              key={idx}
              icon={position.tokenInfo.icon}
              name={position.tokenInfo.symbol}
              capitalValue={position.initialCapital * depositData.tokenInfo.usdPrice}
              capitalAmount={position.initialCapital}
              capitalSymbol={depositData.tokenInfo.symbol}
              pnl={position.value - position.initialCapital}
              positionValue={position.value}
            />
          ))}

          {/* Total Row */}
          <div className="flex items-center py-4 bg-[#0d0d14]">
            <div className="flex-1 px-6">
              <span className="text-white font-semibold text-sm">Total</span>
            </div>
            <div className="flex-1 px-6">
            </div>
            <div className="flex-1 px-6">
              <span className={`font-semibold text-sm`}> 
              </span>
            </div>
            <div className="flex-1 px-6 text-center">
              <span className="text-white font-semibold text-sm">${formatValue(totals.value)}</span>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}

interface PositionRowProps {
  icon: string;
  name: string;
  capitalValue: number;
  capitalAmount: number;
  capitalSymbol: string;
  pnl: number;
  positionValue: number;
  isDeposit?: boolean;
}

function PositionRow({ icon, name, capitalValue, capitalAmount, capitalSymbol, pnl, positionValue, isDeposit=false }: PositionRowProps) {
  const formatValue = (value: number) => value.toFixed(2);
  const isProfit = pnl >= 0;
  const pnlPercent = capitalValue > 0 ? (pnl / capitalValue) * 100 : 0;

  return (
    <div className="flex items-center py-4 border-b border-[#16161f] hover:bg-[#1a1a2e] transition-colors">
      <div className="flex-1 flex items-center gap-3 px-6">
        <img 
          src={icon} 
          alt={name} 
          className="w-6 h-6 rounded-full"
        />
        <span className="text-white font-medium text-sm">{name}</span>
      </div>
      <div className="flex-1 px-6">
        <div className="text-white font-medium text-sm">${formatValue(capitalValue)}</div>
        <div className="text-slate-400 text-xs">{formatValue(capitalAmount)} {capitalSymbol}</div>
      </div>
      <div className="flex-1 px-6">
        {isDeposit ? 
          <span className="text-sm font-bold text-[#ffffff] tabular-nums mr-2">-</span>
          :(
          <div className="flex items-center justify-start gap-1.5">
            {isProfit ? (
              <TrendingUp className="h-3.5 w-3.5 text-[#10b981]" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-[#ef4444]" />
            )}
            <span
              className={`text-sm font-medium tabular-nums ${
                isProfit ? "text-[#10b981]" : "text-[#ef4444]"
              }`}
            >
              {isProfit ? "+" : ""}${Math.abs(pnl).toFixed(2)}
            </span>
            <span
              className={`text-xs tabular-nums ${isProfit ? "text-[#10b981]/70" : "text-[#ef4444]/70"}`}
            >
              ({isProfit ? "+" : ""}
              {pnlPercent.toFixed(2)}%)
            </span>
          </div>
        )}
      </div>
      <div className="flex-1 px-6 text-center">
        <span className="text-sm font-bold text-[#ffffff] tabular-nums">${formatValue(positionValue)}</span>
      </div>
    </div>
  );
}