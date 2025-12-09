"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, TrendingDown } from "lucide-react"
import { formatNumber } from "@/lib/display"

interface PNLCardProps {
  positionBalance: number
  tokenPrice: number
  isLoading?: boolean
  depositData?: any
}

export function VaultPNLCard({positionBalance, tokenPrice, isLoading = false, depositData }: PNLCardProps) {
  const [currentValue, setCurrentValue] = useState(0)
  const [tokenAmount, setTokenAmount] = useState(0)

  useEffect(() => {
    if (positionBalance && tokenPrice) {
      // tokenPrice here is actually sharePrice from parent
      const value = positionBalance * tokenPrice
      setCurrentValue(value)
      setTokenAmount(value) // In USDC/token terms
    }
  }, [positionBalance, tokenPrice])

  // Loading skeleton
  if (isLoading) {
    return (
      <Card className="bg-[#101018] border border-[#16161f] rounded-xl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="space-y-2 text-right">
              <Skeleton className="h-3 w-24 ml-auto" />
              <Skeleton className="h-5 w-28 ml-auto" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Don't show anything when no position
  if (!positionBalance || positionBalance === 0) {
    return null
  }

  const tokenSymbol = depositData?.tokenInfo?.symbol || "USDC"
  const pnl = 0 // TODO: Calculate from initial deposit vs current value
  const pnlPercent = 0 // TODO: Calculate percentage
  const isProfit = pnl >= 0

  return (
    <Card className="bg-[#101018] border border-[#16161f] rounded-xl">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {/* Left: Position Value */}
          <div className="space-y-1">
            <div className="text-xs font-semibold text-gray-400">Your Position</div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-white tabular-nums">
                {formatNumber(tokenAmount, 2)} {tokenSymbol}
              </span>
              <span className="text-sm text-slate-400 tabular-nums">
                (${formatNumber(currentValue, 2)})
              </span>
            </div>
          </div>
          
          {/* Right: PnL */}
          <div className="text-right space-y-1">
            <div className="text-xs font-semibold text-gray-400">Unrealized P/L</div>
            <div className="flex items-center justify-end gap-1.5">
              {isProfit ? (
                <TrendingUp className="h-3.5 w-3.5 text-[#10b981]" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-[#ef4444]" />
              )}
              <span className={`text-sm font-medium tabular-nums ${
                isProfit ? "text-[#10b981]" : "text-[#ef4444]"
              }`}>
                {isProfit ? "+" : ""}${Math.abs(pnl).toFixed(2)}
              </span>
              <span className={`text-xs tabular-nums ${
                isProfit ? "text-[#10b981]/70" : "text-[#ef4444]/70"
              }`}>
                ({isProfit ? "+" : ""}{pnlPercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
