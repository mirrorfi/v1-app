"use client"

import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { formatNumber } from "@/lib/display"

interface MobileVaultPNLProps {
  positionBalance: number
  tokenPrice: number
  isLoading?: boolean
  depositData: any
}

export function MobileVaultPNL({ positionBalance, tokenPrice, isLoading = false, depositData }: MobileVaultPNLProps) {
  const [currentValue, setCurrentValue] = useState(0)
  const [tokenAmount, setTokenAmount] = useState(0)

  useEffect(() => {
    if (positionBalance && tokenPrice) {
      const value = positionBalance * tokenPrice
      setCurrentValue(value)
      setTokenAmount(value)
    }
  }, [positionBalance, tokenPrice])

  if (isLoading) {
    return null;
    return (
      <div className="p-3 bg-[#101018]/50 border-b border-[#16161f]">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-2 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="space-y-1 text-right">
            <Skeleton className="h-2 w-20 ml-auto" />
            <Skeleton className="h-3 w-20 ml-auto" />
          </div>
        </div>
      </div>
    )
  }

  if (!positionBalance || positionBalance === 0) {
    return null
  }

  const tokenSymbol = depositData?.tokenInfo?.symbol || "USDC"
  const pnl = 0 // TODO: Calculate from initial deposit vs current value
  const pnlPercent = 0 // TODO: Calculate percentage
  const isProfit = pnl >= 0

  return (
    <div className="p-3 bg-[#101018]/50 border-b border-[#16161f]">
      <div className="flex items-center justify-between">
        {/* Left: Position Value */}
        <div className="space-y-0.5">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Your Position</div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-white tabular-nums">
              {formatNumber(tokenAmount, 2)} {tokenSymbol}
            </span>
            <span className="text-xs text-slate-400 tabular-nums">
              (${formatNumber(currentValue, 2)})
            </span>
          </div>
        </div>
        
        {/* Right: PnL */}
        <div className="text-right space-y-0.5">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Unrealized P/L</div>
          <div className="flex items-center justify-end gap-1">
            {isProfit ? (
              <TrendingUp className="h-3 w-3 text-[#10b981]" />
            ) : (
              <TrendingDown className="h-3 w-3 text-[#ef4444]" />
            )}
            <span className={`text-xs font-medium tabular-nums ${
              isProfit ? "text-[#10b981]" : "text-[#ef4444]"
            }`}>
              {isProfit ? "+" : ""}${Math.abs(pnl).toFixed(2)}
            </span>
            <span className={`text-[10px] tabular-nums ${
              isProfit ? "text-[#10b981]/70" : "text-[#ef4444]/70"
            }`}>
              ({isProfit ? "+" : ""}{pnlPercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
