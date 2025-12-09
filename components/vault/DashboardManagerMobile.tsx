"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, AlertCircle, RefreshCw, ArrowUpRight } from "lucide-react"
import { useRouter } from "next/navigation"

// Mobile-optimized components
import { MobileVaultPNL } from "@/components/vault/MobileVaultPNL"
import { MobileVaultAllocation } from "@/components/vault/MobileVaultAllocation"
import { MobileVaultChart } from "@/components/vault/MobileVaultChart"
import { MobileVaultData } from "@/components/vault/MobileVaultData"
import { MobileVaultBalances } from "@/components/vault/MobileVaultBalances"
import { VaultData } from "./VaultData"

interface MobileVaultManagerDashboardProps {
  vault: string;
  vaultData:any;
  isLoading: boolean;
  error: string | null;
  handleReload: () => void;
  depositData: any;
  strategiesData: any[];
}

export function MobileVaultManagerDashboard({ vault, vaultData, isLoading, error, handleReload, depositData, strategiesData }: MobileVaultManagerDashboardProps) {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
    //router.push(`/vault/${vault}`);
  }

  return (
    <div className="w-full min-h-screen pb-24 bg-[#101018]">
      {/* Header with Back Button and Vault Info */}
      <div className="flex items-center gap-3 mb-2 p-3">
        <Button
          variant="ghost"
          onClick={handleBackClick}
          className="text-slate-400 hover:text-white hover:bg-slate-800/50 p-2 h-auto"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">
            {vaultData?.name || depositData?.tokenInfo?.symbol + " Vault" || "Vault Dashboard"}
          </h1>
          {vaultData?.description && (
            <p className="text-xs text-slate-400 mt-0.5">
              {vaultData.description}
            </p>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-gradient-to-br from-red-900/20 to-red-800/10 border border-red-700/30 rounded-lg p-4 mx-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-red-400 font-semibold text-sm mb-1">Error Loading Vault</h3>
              <p className="text-red-300 text-sm mb-3">{error}</p>
              <Button
                onClick={handleReload}
                variant="outline"
                size="sm"
                className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Only show if no error */}
      {!error && (
        <div className="space-y-0">
          {/* Vault Chart - Mobile Optimized */}
          <MobileVaultChart vaultAddress={vault} />

          {/* Asset Allocation - Mobile Optimized */}
          <MobileVaultAllocation
            depositData={depositData}
            strategiesData={strategiesData}
            isLoading={isLoading}
          />

          {/* Vault Balances */}
          <MobileVaultBalances
            depositData={depositData}
            vaultData={vaultData}
            strategiesData={strategiesData}
            isLoading={isLoading}
          />

          {/* Vault Data - Mobile Optimized */}
          <VaultData depositData={depositData} vaultData={vaultData} />
        </div>
      )}
    </div>
  )
}