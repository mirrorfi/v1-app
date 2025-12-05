"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import { getVaultBalance } from "@/lib/api/vault"
import { ArrowLeft, AlertCircle, RefreshCw, Settings } from "lucide-react"
import { useRouter } from "next/navigation"

import { VaultExecuteCard} from "@/components/vault/VaultExecuteCard"
import { VaultData } from "@/components/vault/VaultData"
import { VaultChart } from "@/components/vault/VaultChart";
import { VaultBalances } from "@/components/vault/VaultBalances"
import { VaultAllocation } from "@/components/vault/VaultAllocation"
import { VaultDashboardFlow } from "@/components/VaultDashboardFlow";
import { VaultDashboardBalances } from "@/components/VaultDashboardBalances"
import { VaultDashboardUserPosition } from "@/components/VaultDashboardUserPosition"
import { VaultDashboardPNLCard } from "@/components/VaultDashboardPNLCard"
import { useWallet } from "@solana/wallet-adapter-react"
import { TOKEN_INFO } from "@/lib/utils/tokens"

interface StrategyDashboardProps {
  vault: string;
  vaultData:any;
  positionBalance:number;
  sharePrice:number;
  tokenBalance:number;
  tokenPrice:number;
  isLoading: boolean;
  error: string | null;
  handleReload: () => void;
  depositData: any;
  strategiesData: any[];
}

const strategy = {
  name: "My Super Hyped Strategy",
  icon: "🚀",
  status: "Active" as const,
}

export function VaultDashboard({ vault, vaultData, positionBalance, sharePrice, tokenBalance, tokenPrice, isLoading, error, handleReload, depositData, strategiesData }: StrategyDashboardProps) {
  const { publicKey } = useWallet();
  const router = useRouter();
  const [vaultBalances, setVaultBalances] = useState<any>(null);

  // Check if current user has managing authority
  const hasManagingAuthority = publicKey && vaultData && publicKey.toString() === vaultData.authority;

  const handleBackClick = () => {
    router.push('/');
  }

  const handleManageVault = () => {
    router.push(`/vault/${vault}/manager`);
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-8 md:p-6">
      {/* Header with Back Button and Vault Info */}
      <div className="mb-6 flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={handleBackClick}
          className="text-slate-400 hover:text-white hover:bg-slate-800/50 p-2 h-auto"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
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
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-4 order-2 xl:order-1">
            {/*<VaultDashboardFlow vaultData={vaultData} depositData={depositData} strategyData={strategiesData} />*/}
            <VaultChart vaultAddress={vault} />
            <VaultData depositData={depositData} vaultData={vaultData}/>
            <VaultBalances  depositData={depositData} vaultData={vaultData} strategiesData={strategiesData}/>
            {/*<VaultDashboardBalances depositData={depositData} strategiesData={strategiesData} isLoading={isLoading} />*/}
          </div>
          
          {/* Execute Card - Show first on mobile */}
          <div className="xl:col-span-2 space-y-4 order-1 xl:order-1">
            {/*Deposit/Withdraw Section*/}
            {vaultData && depositData && <VaultExecuteCard 
              vault={vault} 
              vaultData={vaultData} 
              depositData={depositData}
              positionBalance={positionBalance} 
              sharePrice={sharePrice}
              handleReload={handleReload} 
              tokenPrice={tokenPrice} 
              tokenBalance={tokenBalance} 
            />}
            {/*Show User Position*/}
            <VaultDashboardPNLCard 
              positionBalance={positionBalance} 
              tokenPrice={sharePrice}
              isLoading={isLoading}
              depositData={depositData}
            />
            {/*Asset Allocation*/}
            {/*<VaultAllocation
              depositData={depositData}
              strategiesData={strategiesData}
              isLoading={isLoading}
            />*/}
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  )
}