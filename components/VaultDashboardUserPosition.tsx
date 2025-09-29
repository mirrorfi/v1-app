// This Component will load and show the position that the user has
// A position is simply reflected by how many share they have, and what is the total value of that in $
// TO DO:
// 1. Creates a card that show user position and a list of transaction activity history (e.g. deposit, withdraw at what date n amount)
// 2. Use skeleton to simulate loading data when component is loaded while fetching data
// 3. If no position exists, vault display must have an icon and a message indicating user has no active position

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { CoinsIcon, HistoryIcon, AlertCircle } from "lucide-react"
import { formatNumber } from "@/lib/display"

// Define types for transaction history
interface Transaction {
  date: string
  type: "deposit" | "withdraw"
  amount: string
  value: string
  timestamp: number // Unix timestamp for sorting
}

interface UserPosition {
  shares: string
  totalValue: string
  apy: string
  transactions: Transaction[]
  loading: boolean
  exists: boolean
}

export function VaultDashboardUserPosition({vaultDepositor, positionBalance, tokenPrice}: {vaultDepositor: any, positionBalance: number, tokenPrice: number}) {
  // Mock state for user position - in a real implementation, this would be fetched from an API
  const [positionInfo, setPositionInfo] = useState<any>({
    shares: 0,
    value: 0,
    pnl: 0,
  });
  
  const [userPosition, setUserPosition] = useState<UserPosition>({
    shares: positionBalance.toString(),
    totalValue: "$2,453.20",
    apy: "7.15%",
    exists: true,
    loading: false,
    transactions: [
      {
        date: "25 Jul 2025",
        type: "deposit",
        amount: "200.00",
        value: "$2,000.00",
        timestamp: 1753142400 // July 25, 2025
      },
      {
        date: "28 Jul 2025",
        type: "deposit",
        amount: "50.00",
        value: "$500.00",
        timestamp: 1753401600 // July 28, 2025
      },
      {
        date: "05 Aug 2025",
        type: "withdraw",
        amount: "4.68",
        value: "$46.80",
        timestamp: 1754006400 // August 5, 2025
      }
    ]
  })

  useEffect(() => {
    if(vaultDepositor && positionBalance) {
      setPositionInfo({
        shares: Number(vaultDepositor.total_shares) / 1e8,
        value: positionBalance,
        pnl: positionBalance + (Number(vaultDepositor.realized_pnl) - Number(vaultDepositor.total_cost)) / 1e6 * tokenPrice
      })
    }
  }, [vaultDepositor, positionBalance])

  // Simulate loading state
  const [isLoading, setIsLoading] = useState(false)

  // Sort transactions by timestamp (newest first)
  const sortedTransactions = [...userPosition.transactions].sort((a, b) => b.timestamp - a.timestamp)

  // Empty state content
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
      <AlertCircle className="h-16 w-16 text-blue-400 opacity-70" />
      <div>
        <h3 className="text-xl font-semibold text-white mb-1">No active position</h3>
        <p className="text-slate-400 max-w-sm">
          You don't have any active position in this vault yet. 
          Use the deposit form to start earning yield.
        </p>
      </div>
    </div>
  )

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-4 gap-1">
      <div className="flex justify-between mb-6 w-full gap-2">
        <Skeleton className="h-20 w-1/3" />
        <Skeleton className="h-20 w-1/3" />
        <Skeleton className="h-20 w-1/3" />
      </div>
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
    </div>
  )

  return (
    <Card className={`bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-700/30 backdrop-blur-sm rounded-lg shadow-lg transition-all duration-200`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center gap-2">
          <CoinsIcon className="h-5 w-5 text-blue-400" />
          Your Position
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 pb-4">
        {isLoading ? (
          <LoadingSkeleton />
        ) : !positionInfo.shares || positionInfo.shares == 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Position Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
              <div className="bg-[#0F1218] p-4 sm:p-3 rounded-lg border border-[#2D3748]/30">
                <div className="text-slate-400 text-xs mb-1">Shares</div>
                <div className="text-white font-semibold text-2xl sm:text-xl">{positionInfo.shares}</div>
              </div>
              <div className="bg-[#0F1218] p-4 sm:p-3 rounded-lg border border-[#2D3748]/30">
                <div className="text-slate-400 text-xs mb-1">Total Value</div>
                <div className="text-white font-semibold text-2xl sm:text-xl">{formatNumber(positionInfo.value)}</div>
              </div>
              <div className="bg-[#0F1218] p-4 sm:p-3 rounded-lg border border-[#2D3748]/30">
                <div className="text-slate-400 text-xs mb-1">Current PnL</div>
                <div className="text-emerald-400 font-semibold text-2xl sm:text-xl">{positionInfo.pnl.toFixed(2)}</div>
              </div>
            </div>
            
            {/* Transaction History */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <HistoryIcon className="h-4 w-4 text-slate-400" />
                <h3 className="text-sm font-medium text-slate-300">Transaction History</h3>
              </div>
              
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {sortedTransactions.map((tx, index) => (
                  <div 
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center justify-between text-sm bg-[#0F1218] rounded p-3 border border-[#2D3748]/30 gap-2"
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        className={`${
                          tx.type === "deposit"
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-red-500/20 text-red-400 border-red-500/30"
                        } text-xs`}
                      >
                        {tx.type === "deposit" ? "Deposit" : "Withdraw"}
                      </Badge>
                      <span className="text-slate-300 text-xs sm:text-sm">{tx.date}</span>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="text-right">
                        <div className="text-white font-medium">{tx.amount} shares</div>
                        <div className="text-slate-400 text-xs">{tx.value}</div>
                      </div>
                    </div>
                  </div>
                ))}

                {sortedTransactions.length === 0 && (
                  <div className="text-center py-4 text-slate-400 text-sm">
                    No transactions yet
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}