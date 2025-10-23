"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react"
import { formatNumber } from "@/lib/display"
import Image from "next/image"
import { useIsMobile } from "@/lib/hooks/useIsMobile"

interface PNLCardProps {
  vaultDepositor: any
  positionBalance: number
  tokenPrice: number
  isLoading?: boolean
}

export function VaultDashboardPNLCard({ vaultDepositor, positionBalance, tokenPrice, isLoading = false }: PNLCardProps) {
  const isMobile = useIsMobile()
  const [pnlData, setPnlData] = useState<{
    totalPnl: number
    pnlPercentage: number
    totalCost: number
    currentValue: number
    realizedPnl: number
    unrealizedPnl: number
  }>({
    totalPnl: 0,
    pnlPercentage: 0,
    totalCost: 0,
    currentValue: 0,
    realizedPnl: 0,
    unrealizedPnl: 0
  })

  useEffect(() => {
    if (vaultDepositor && positionBalance && tokenPrice) {
      const totalCost = Number(vaultDepositor.total_cost) / 1e6 * tokenPrice
      const realizedPnl = Number(vaultDepositor.realized_pnl) / 1e6 * tokenPrice
      const currentValue = positionBalance
      const unrealizedPnl = currentValue - totalCost + realizedPnl
      const totalPnl = realizedPnl + unrealizedPnl
      const pnlPercentage = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0

      setPnlData({
        totalPnl,
        pnlPercentage,
        totalCost,
        currentValue,
        realizedPnl,
        unrealizedPnl
      })
    }
  }, [vaultDepositor, positionBalance, tokenPrice])

  //const isPositive = pnlData.totalPnl >= -0.01
  const isPositive = true;
  const isSignificant = Math.abs(pnlData.totalPnl) > 0.01

  // Loading skeleton
  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-slate-700/50 backdrop-blur-sm rounded-xl shadow-2xl">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <Skeleton className="h-8 w-32 mx-auto" />
            <Skeleton className="h-20 w-48 mx-auto" />
            <div className="flex justify-center gap-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Empty state when no position
  if (!vaultDepositor || !positionBalance) {
    return (
      <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-slate-700/50 backdrop-blur-sm rounded-xl shadow-2xl">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="p-4 bg-slate-800/50 rounded-full w-fit mx-auto">
              <DollarSign className="h-8 w-8 text-slate-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-300 mb-2">No Position Data</h3>
              <p className="text-slate-400">
                Deposit into the vault to start tracking your PNL
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`bg-gradient-to-br ${
      isPositive 
        ? 'from-emerald-900/20 to-green-800/10 border-emerald-700/30' 
        : 'from-red-900/20 to-red-800/10 border-red-700/30'
    } backdrop-blur-sm rounded-xl shadow-lg transition-all duration-300`}>
      <CardContent className="">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image 
              src="/PNG/mirrorfi-logo.png" 
              alt="MirrorFi Logo" 
              width={120} 
              height={35} 
            />
          </div>
        </div>

        {/* Main Metrics Grid */}
        <div className="grid grid-cols-2 gap-6 mt-5 mb-6">
          {/* Current Position Value */}
          <div className="space-y-2">
            <div className="text-slate-400 text-sm font-medium">Position Value</div>
            <div className="flex justify-start items-center gap-3">
               <div className={`${isMobile?"text-2xl":"text-4xl"} font-bold text-white`}>
                ${formatNumber(pnlData.currentValue)}
              </div>
              <Badge className={`${
                isPositive 
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                  : 'bg-red-500/20 text-red-400 border-red-500/30'
              } ${isMobile?"text-xs":"text-sm"} px-2 py-1 w-fit`}>
                {isPositive ? '+' : ''}{pnlData.pnlPercentage.toFixed(2)}%
              </Badge>
            </div>
            
            {/*<div className="text-slate-500 text-sm">
              Cost: {formatNumber(pnlData.totalCost)}
            </div>*/}
          </div>

          {/* Total PNL */}
          <div className={`${isMobile?"ml-6":""} space-y-2`}>
            <div className={`flex gap-2 text-slate-400 ${isMobile?"text-xs":"text-sm"} font-medium`}>
              {isPositive ? (
                <TrendingUp className={`${isMobile?"h-4 w-4":"h-5 w-5"} text-emerald-400`} />
              ) : (
                <TrendingDown className={`${isMobile?"h-4 w-4":"h-5 w-5"} text-red-400`} />
              )}
              Total PNL
            </div>
            <div className={`${isMobile?"text-2xl":"text-4xl"} font-bold ${
              isPositive ? 'text-emerald-400' : 'text-red-400'
            } transition-all duration-300`}>
              {isPositive ? '+' : ''}{formatNumber(pnlData.totalPnl)}
            </div>
          </div>
        </div>

        {/* PNL Breakdown - Simplified */}
        {/*<div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/20 rounded-lg p-3 text-center">
            <div className="text-slate-400 text-xs mb-1">Realized</div>
            <div className={`text-lg font-semibold ${
              pnlData.realizedPnl >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {pnlData.realizedPnl >= 0 ? '+' : ''}{formatNumber(pnlData.realizedPnl)}
            </div>
          </div>
          
          <div className="bg-slate-800/20 rounded-lg p-3 text-center">
            <div className="text-slate-400 text-xs mb-1">Unrealized</div>
            <div className={`text-lg font-semibold ${
              pnlData.unrealizedPnl >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {pnlData.unrealizedPnl >= 0 ? '+' : ''}{formatNumber(pnlData.unrealizedPnl)}
            </div>
          </div>
        </div>*/}
      </CardContent>
    </Card>
  )
}
