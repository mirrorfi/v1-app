"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import { ArrowLeft, AlertCircle, RefreshCw, TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react"
import { useRouter } from "next/navigation"

import { VaultDashboardChart } from "@/components/VaultDashboardChart"
import { VaultDashboardBalances } from "@/components/VaultDashboardBalances"
import { VaultDashboardPNLCard } from "@/components/VaultDashboardPNLCard"
import { VaultDashboardExecuteCard } from "@/components/VaultDashboardExecuteCard"
import { MobileExecuteCard } from "./MobileExecuteCard"
import { getConnection } from "@/lib/solana"
import { useWallet } from "@solana/wallet-adapter-react"
import { formatNumber } from "@/lib/display"

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
const connection = getConnection();


export function MobileVaultDashboard({ vault, vaultData, positionBalance, sharePrice, tokenBalance, tokenPrice, isLoading, error, handleReload, depositData, strategiesData }: MobileVaultDashboardProps) {
  const { publicKey } = useWallet();
  const router = useRouter();
  const [showExecuteCard, setShowExecuteCard] = useState(false);
  const [executeMode, setExecuteMode] = useState<'deposit' | 'withdraw'>('deposit');

  const handleBackClick = () => {
    router.push('/');
  }

  const hasManagingAuthority = publicKey && vaultData && publicKey.toString() === vaultData.authority;
  const handleManageVault = () => {
    router.push(`/vault/${vault}/manager`);
  }

  const handleDeposit = () => {
    setExecuteMode('deposit');
    setShowExecuteCard(true);
  }

  const handleWithdraw = () => {
    setExecuteMode('withdraw');
    setShowExecuteCard(true);
  }

  const handleCloseExecuteCard = () => {
    setShowExecuteCard(false);
  }

  return (
    <div className="relative w-full max-w-md mx-auto pb-20"> {/* Added bottom padding for sticky buttons */}
      {/* Error Display */}
      {error && (
        <div className="bg-gradient-to-br from-red-900/20 to-red-800/10 border border-red-700/30 backdrop-blur-sm rounded-lg shadow-lg p-4">
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
        <div className="p-4 space-y-4">
          {/* Vault Title */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-white">{vaultData?.name || 'Loading...'}</h1>
              {vaultData?.description && (
                <p className="text-sm text-slate-400 mt-1">{vaultData.description}</p>
              )}
            </div>
            <Button
              variant="ghost"
              onClick={handleBackClick}
              className="text-slate-400 hover:text-white hover:bg-slate-800/50 p-2 h-auto"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          {/* PNL Card */}
          {positionBalance ? 
            <VaultDashboardPNLCard
              positionBalance={positionBalance} 
              tokenPrice={tokenPrice}
              isLoading={isLoading}
            /> : ""
          }

          {hasManagingAuthority && (
            <div className="bg-orange-600/20 border border-orange-500/30 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-orange-400 text-sm font-medium whitespace-nowrap">
                  You have managing authority
                </span>
                <Button
                  onClick={handleManageVault}
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700 text-white text-sm px-3 py-1 h-8"
                >
                  Open <ArrowUpRight/>
                </Button>
              </div>
            </div>
          )}

          {/* Positions */}
          <VaultDashboardBalances depositData={depositData} strategiesData={strategiesData} isLoading={isLoading} />

        </div>
      )}

      {/* Sticky Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 via-gray-900/95 to-transparent p-4 backdrop-blur-sm">
        <div className="max-w-md mx-auto grid grid-cols-2 gap-3">
          <Button 
            onClick={handleDeposit}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition-colors shadow-lg"
          >
            Deposit
          </Button>
          <Button 
            onClick={handleWithdraw}
            variant="outline"
            className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500/70 font-semibold py-4 rounded-lg transition-colors shadow-lg bg-gray-900/80 backdrop-blur-sm"
          >
            Withdraw
          </Button>
        </div>
      </div>

      {/* Execute Card Overlay */}
      {showExecuteCard && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={handleCloseExecuteCard}
          />
          
          {/* Slide-up Execute Card */}
          <div className={`fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-300 ease-out ${
            showExecuteCard ? 'translate-y-0' : 'translate-y-full'
          }`}>
            <div className="bg-gray-900 rounded-t-2xl shadow-2xl">
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1 bg-slate-600 rounded-full"></div>
              </div>
              
              {/* Execute Card Content */}
              <div className="p-4 h-[500px]">
                {vaultData.depositMint && (
                  <MobileExecuteCard 
                    vault={vault} 
                    vaultData={vaultData}
                    tokenMint={vaultData.depositMint} 
                    positionBalance={positionBalance} 
                    sharePrice={sharePrice}
                    handleReload={handleReload}
                    initialMode={executeMode}
                    tokenBalance={tokenBalance}
                    tokenPrice={tokenPrice}
                  />
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}