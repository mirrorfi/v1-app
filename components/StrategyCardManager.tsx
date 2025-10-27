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
import { useIsMobile } from "@/lib/hooks/useIsMobile"

export function StrategyCardManager({strategyData, handleOpenStrategy}: {strategyData: any, handleOpenStrategy: (data: any) => void}) {
  const isMobile = useIsMobile()
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
    <Card className="relative bg-slate-800/80 border border-slate-600/30 rounded-xl p-4 md:p-6 backdrop-blur-sm hover:bg-slate-800/90 transition-all duration-200 overflow-hidden">
      {/* Background token image on the left */}
      <div className="absolute left-0 top-0 w-128 h-full opacity-25 overflow-hidden">
        <div 
          className="w-50 h-50 md:w-70 md:h-70 bg-contain bg-no-repeat bg-center transform -translate-x-8 -translate-y-8 md:-translate-y-12 rounded-full"
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
            <h3 className={`${isMobile? "flex" : "flex"} text-white font-semibold text-lg md:text-xl items-center gap-2`}>
              {strategyData.tokenInfo?.symbol || ''}
              <div className="text-xs md:text-sm mt-1">
                {strategyData.strategyType === "deposit" ? "(Main Deposit)" : 
                 apy == 0 ? "(Trade)" : "(Yield)"
                }
              </div>
            </h3>
            <p className="text-gray-400 text-base">
              APY: {apy > 0 ? <span className="text-green-400 font-medium">{apy.toFixed(2)}%</span> : '-'}
            </p>
          </div>
          
          <div className={`${isMobile? "flex-col items-center" : "flex items-center"} justify-end gap-2`}>
            <div className="flex gap-2 items-center">
              <span className="text-slate-400 text-sm md:text-lg">NAV:</span>
              <span className="text-white font-bold text-lg md:text-2xl">
                ${strategyData.value.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-end">
              <span className={`text-sm md: text-lg text-base font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                ({isPositive ? '+' : ''}{percentageChange.toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Middle and Bottom rows - Aligned buttons with metrics */}
        <div className={`flex ${isMobile? "justify-end":"justify-between"} items-center mt-10`}>
          {/* Left side - Action buttons */}
          <div className="flex gap-3">
            {strategyData.strategyType !== "deposit" && 
                <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-transparent border-slate-500 text-slate-300 hover:bg-white/10 hover:text-white hover:border-slate-400 rounded-lg px-4 py-2 font-medium"
                    onClick={() => handleOpenStrategy({
                        strategyType: strategyData.strategyType,
                        tokenMint: strategyData.targetMint,
                        action: "add",
                        strategyData: strategyData
                    })}
                >
                Add
                </Button>
            }
            {strategyData.strategyType !== "deposit" && 
                <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-transparent border-slate-500 text-slate-300 hover:bg-white/10 hover:text-white hover:border-slate-400 rounded-lg px-4 py-2 font-medium"
                    onClick={() => handleOpenStrategy({
                        strategyType: strategyData.strategyType,
                        tokenMint: strategyData.targetMint,
                        action: "reduce",
                        strategyData: strategyData
                    })}
                >
                Reduce
                </Button>
            }
          </div>

          {/* Right side - Financial metrics */}
          {!isMobile && <div className="flex gap-8 text-base">
            <span className="text-slate-400">
              Initial Capital: <span className="text-white font-medium">{strategyData.strategyType === "deposit"? "-" : `$${(strategyData.initialCapital || 0).toFixed(3)}`}</span>
            </span>
            <span className="flex text-slate-400">
              Unrealized Profit: <span className={`font-semibold ${unrealizedProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {strategyData.strategyType === "deposit"? <div className="text-white ml-1">-</div> : `${unrealizedProfit < 0 ? "-" : ""}$${Math.abs(unrealizedProfit).toFixed(5)}`}
              </span>
            </span>
          </div>}
        </div>
      </div>
    </Card>
  );
}