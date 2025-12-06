"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function VaultDashboardHeaderSkeleton() {
  return (
    <div className="mb-6 flex items-center gap-4">
      <Skeleton className="h-10 w-10 rounded-lg" />
      <div className="flex-1">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>
    </div>
  )
}

export function VaultChartSkeleton() {
  return (
    <Card className="bg-[#101018] border border-[#16161f] rounded-xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-8 w-16" />
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}

export function VaultDataSkeleton() {
  return (
    <Card className="bg-[#101018] border border-[#16161f] rounded-xl">
      <CardHeader className="border-b border-[#16161f]">
        <CardTitle className="text-lg font-semibold text-white">Vault Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-[#16161f] last:border-0">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-40" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function VaultBalancesSkeleton() {
  return (
    <Card className="bg-[#101018] border border-[#16161f] rounded-xl overflow-hidden">
      <CardHeader className="border-b border-[#16161f]">
        <CardTitle className="text-lg font-semibold text-white">Positions</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center border-b border-[#16161f] py-4 px-6 last:border-0">
            <div className="flex-1 flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex-1">
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="flex-1 text-right">
              <Skeleton className="h-4 w-20 ml-auto" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function VaultExecuteCardSkeleton() {
  return (
    <Card className="bg-[#101018] border border-[#16161f] rounded-xl">
      <CardHeader className="border-b border-[#16161f]">
        <CardTitle className="text-lg font-semibold text-white">Deposit / Withdraw</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="flex gap-2">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="flex-1 h-10 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-12 w-full rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-full" />
        </div>
        <div className="flex gap-2 justify-between">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="flex-1 h-8 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-10 w-full rounded-lg" />
      </CardContent>
    </Card>
  )
}

export function VaultPNLCardSkeleton() {
  return (
    <Card className="bg-[#101018] border border-[#16161f] rounded-xl">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="space-y-2 text-right">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-5 w-28" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function VaultTransactionHistorySkeleton() {
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

export function VaultDashboardSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto p-8 md:p-6">
      {/* Header */}
      <VaultDashboardHeaderSkeleton />

      {/* Main Content */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
          {/* Left Column - Charts and Data */}
          <div className="xl:col-span-3 space-y-4 order-2 xl:order-1">
            <VaultChartSkeleton />
            <VaultDataSkeleton />
            <VaultBalancesSkeleton />
          </div>

          {/* Right Column - Actions and Info */}
          <div className="xl:col-span-2 space-y-4 order-1 xl:order-2">
            <VaultExecuteCardSkeleton />
            <VaultPNLCardSkeleton />
            <VaultTransactionHistorySkeleton />
          </div>
        </div>
      </div>
    </div>
  )
}
