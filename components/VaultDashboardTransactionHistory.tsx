"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowDownCircle, ArrowUpCircle, ExternalLink } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export type TransactionType = "deposit" | "withdraw"

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  token: string
  timestamp: Date
  signature?: string
  decimals: number
  status: "completed" | "pending" | "failed"
}

interface VaultDashboardTransactionHistoryProps {
  transactions: Transaction[]
  isLoading?: boolean
}

export function VaultDashboardTransactionHistory({
  transactions,
  isLoading = false,
}: VaultDashboardTransactionHistoryProps) {
  if (isLoading) {
    return <VaultDashboardTransactionHistorySkeleton />
  }

  const formatAmount = (amount: number, token: string, decimal: number) => {
    let numAmount = Number(amount);
    let numDecimal = Number(decimal);
    
    if (isNaN(numAmount) || isNaN(numDecimal)) {
      numDecimal = 6; // default to 6 decimals if invalid
      return `0.00 ${token}`;
    }
    
    return `${(numAmount / (10 ** numDecimal)).toFixed(2)} ${token}`
  }

  const getTransactionIcon = (type: TransactionType) => {
    if (type === "deposit") {
      return <ArrowDownCircle className="h-5 w-5 text-green-400" />
    }
    return <ArrowUpCircle className="h-5 w-5 text-blue-400" />
  }

  const getStatusBadge = (status: Transaction["status"]) => {
    const variants = {
      completed: "bg-green-500/20 text-green-400 border-green-500/30",
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      failed: "bg-red-500/20 text-red-400 border-red-500/30",
    }

    return (
      <Badge variant="outline" className={`${variants[status]} text-xs capitalize`}>
        {status}
      </Badge>
    )
  }

  const truncateSignature = (signature?: string) => {
    if (!signature) return "N/A"
    return `${signature.slice(0, 6)}...${signature.slice(-4)}`
  }

  return (
    <Card className="bg-[#101018] border-[#16161f] backdrop-blur-sm rounded-lg shadow-lg z-10">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-400">No transactions yet</p>
            <p className="text-sm text-slate-500 mt-2">Your deposit and withdrawal history will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                onClick={(e) => {
                  e.preventDefault();
                  if (transaction.signature) {
                    window.open(`https://solscan.io/tx/${transaction.signature}`, '_blank');
                  }
                }}
                className="relative flex items-center justify-between p-4 bg-[#101018] rounded-lg border border-slate-700/30 hover:bg-slate-800/60 transition-colors cursor-pointer"
                style={{ pointerEvents: 'auto' }}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-shrink-0">{getTransactionIcon(transaction.type)}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white font-medium capitalize">{transaction.type}</p>
                      {getStatusBadge(transaction.status)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <span>
                        {formatDistanceToNow(transaction.timestamp, {
                          addSuffix: true,
                        })}
                      </span>
                      {transaction.signature && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-slate-400">
                            {truncateSignature(transaction.signature)}
                            <ExternalLink className="h-3 w-3" />
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 ml-4">
                  <p className={`font-semibold ${transaction.type === "deposit" ? "text-green-400" : "text-blue-400"}`}>
                    {transaction.type === "deposit" ? "+" : "-"}
                    {formatAmount(transaction.amount, transaction.token, transaction.decimals)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function VaultDashboardTransactionHistorySkeleton() {
  return (
    <Card className="bg-[#101018] border-slate-700/50 backdrop-blur-sm rounded-lg shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white">Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 bg-[#101018] rounded-lg border border-slate-700/30"
            >
              <div className="flex items-center gap-4 flex-1">
                <Skeleton className="h-5 w-5 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
