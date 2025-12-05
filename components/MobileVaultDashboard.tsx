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
import { useWallet } from "@solana/wallet-adapter-react"

interface MobileVaultDashboardProps {
  vault: string;
  vaultData:any;
  positionBalance:number;
  sharePrice: number;
  tokenBalance:number;
  tokenPrice:number;
  isLoading: boolean;
  error: string | null;
  handleReload: () => void;
  depositData: any;
  strategiesData: any[];
}

export function MobileVaultDashboard({ vault, vaultData, positionBalance, sharePrice, tokenBalance, tokenPrice, isLoading, error, handleReload, depositData, strategiesData }: MobileVaultDashboardProps) {
  const { publicKey } = useWallet();
  const router = useRouter();

  const handleBackClick = () => {
    router.push('/');
  }

  const hasManagingAuthority = publicKey && vaultData && publicKey.toString() === vaultData.authority;
  const handleManageVault = () => {
    router.push(`/vault/${vault}/manager`);
  }

  const handleDeposit = () => {
    // Scroll to execute card or open deposit modal
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          {/* Managing Authority Banner */}
          {hasManagingAuthority && (
            <div className="bg-orange-600/20 border-x-0 border-y border-orange-500/30 px-3 py-2.5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-orange-400 text-xs font-medium">
                  You have managing authority
                </span>
                <Button
                  onClick={handleManageVault}
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-2 py-1 h-7"
                >
                  Open <ArrowUpRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}

          {/* User Position - Mobile Optimized */}
          <MobileVaultPNL
            positionBalance={positionBalance}
            tokenPrice={sharePrice}
            isLoading={isLoading}
            depositData={depositData}
          />

          {/* Vault Chart - Mobile Optimized */}
          <MobileVaultChart vaultAddress={vault} />

          {/* Asset Allocation - Mobile Optimized */}
          <MobileVaultAllocation
            depositData={depositData}
            strategiesData={strategiesData}
            isLoading={isLoading}
          />

          {/* Vault Balances - Mobile Optimized */}
          {/*<MobileVaultBalances
            depositData={depositData}
            vaultData={vaultData}
            strategiesData={strategiesData}
          />*/}

          {/* Vault Data - Mobile Optimized */}
          <MobileVaultData depositData={depositData} vaultData={vaultData} />
        </div>
      )}

      {/* Sticky Deposit Button */}
      {!error && vaultData && depositData && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 via-gray-900/95 to-transparent p-4 backdrop-blur-sm z-50">
          <Button 
            onClick={handleDeposit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition-colors shadow-lg"
          >
            Deposit
          </Button>
        </div>
      )}
    </div>
  )
}