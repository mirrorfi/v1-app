"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import { ArrowLeft, AlertCircle, RefreshCw, ArrowUpRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { Skeleton } from "./ui/skeleton"
import { VaultDashboardFlow } from "@/components/VaultDashboardFlow";
import { VaultDashboardBalances } from "@/components/VaultDashboardBalances"
import { useWallet } from "@solana/wallet-adapter-react"

import { VaultData } from "@/components/vault/VaultData";
import { VaultChart } from "@/components/vault/VaultChart";
import { VaultBalances } from "@/components/vault/VaultBalances";
import { VaultBalancesManager } from "@/components/vault/VaultBalancesManager"

interface StrategyDashboardProps {
  vault: string;
  vaultData:any;
  isLoading: boolean;
  error: string | null;
  handleReload: () => void;
  depositData: any;
  strategiesData: any[];
}

export function VaultManagerDashboard({ vault, vaultData, isLoading, error, handleReload, depositData, strategiesData }: StrategyDashboardProps) {
  const router = useRouter();
  
  const handleBackClick = () => {
    router.push(vaultData ? `/vault/${vaultData.publicKey}` : "/");
  }

  return (
    <div className="w-full max-w-9xl p-8 md:p-6">
      {/* Back Button */}
      <div className="mb-4 flex items-center">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">
            {vaultData?.name || depositData?.tokenInfo?.symbol + " Vault" || "Vault Dashboard"}
          </h1>
          {vaultData?.description && (
            <p className="text-sm text-slate-400 mt-1">
              {vaultData.description}
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          onClick={handleBackClick}
          className="text-xs text-slate-400 bg-slate-800/60 hover:bg-slate-700/60 hover:text-white p-3 px-5"
        >
          <ArrowUpRight className="h-4 w-4" />
          Vault Page
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="bg-gradient-to-br from-red-900/20 to-red-800/10 border-red-700/30 backdrop-blur-sm rounded-lg shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-red-500/20 rounded-lg flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-red-400 font-semibold text-lg mb-2">Error Loading Vault</h3>
                <p className="text-red-300 mb-4">{error}</p>
                <div className="flex gap-3">
                  <Button
                    onClick={handleReload}
                    variant="outline"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                  <Button
                    onClick={handleBackClick}
                    variant="outline"
                    className="border-slate-500/30 text-slate-400 hover:bg-slate-500/10 hover:border-slate-500/50"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Go Back
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Dashboard Content - Only show if no error */}
      {!error && (
        <>
        <div className="space-y-4">
            {/* Mobile: Stack all content vertically */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
                {/* Left Part */}
                <div className="xl:col-span-2 space-y-4 order-2 xl:order-1">
                  <VaultChart vaultAddress={vault} />
                  <VaultData depositData={depositData} vaultData={vaultData}/>
                </div>

                {/* Right Part */}
                <div className="xl:col-span-2 space-y-4 order-1 xl:order-2">
                  <VaultBalancesManager depositData={depositData} vaultData={vaultData} strategiesData={strategiesData} isLoading={isLoading} />
                  {/*<VaultDashboardBalances depositData={depositData} strategiesData={strategiesData} isLoading={isLoading} isManager={true} vaultData={vaultData} />*/}
                </div>
            </div>
        </div>
        </>
      )}
    </div>
  )
}