"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import { getVaultBalances } from "@/lib/api/vault"
import { ArrowLeft, AlertCircle, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { Skeleton } from "./ui/skeleton"
import { mirrorfiClient } from '@/lib/solana-server';
import { fetchJupiterPrices } from "@/lib/utils/jupiter"
import { parseVault, parseVaultDepositor } from '@/types/accounts';

import { VaultDashboardExecuteCard, VaultDashboardExecuteCardSkeleton } from "@/components/VaultDashboardExecuteCard"
import { VaultDashboardChart } from "@/components/VaultDashboardChart";
import { VaultDashboardFlow } from "@/components/VaultDashboardFlow";
import { VaultDashboardBalances } from "@/components/VaultDashboardBalances"
import { VaultDashboardUserPosition } from "@/components/VaultDashboardUserPosition"
import { VaultDashboardPNLCard } from "@/components/VaultDashboardPNLCard"
import { getConnection } from "@/lib/solana"
import { useWallet } from "@solana/wallet-adapter-react"
import { TOKEN_INFO } from "@/lib/utils/tokens"

interface StrategyDashboardProps {
  vault: string;
  vaultData:any;
  isLoading: boolean;
  error: string | null;
  handleReload: () => void;
  depositData: any;
  strategiesData: any[];
}

const connection = getConnection();

const strategy = {
  icon: "🚀",
  status: "Active" as const,
}

export function VaultManagerDashboard({ vault, vaultData, isLoading, error, handleReload, depositData, strategiesData }: StrategyDashboardProps) {
  const [activeTab, setActiveTab] = useState("vault-stats")
  const tabs = [
    { id: "vault-stats", label: "Vault Stats" },
    { id: "your-position", label: "Your Position" },
    //{ id: "overview", label: "Overview" },
  ]

  const { publicKey } = useWallet();
  const router = useRouter();
  const [vaultBalances, setVaultBalances] = useState<any>(null);

  const onTabChange = (tabName: string) => {
    setActiveTab(tabName)
  }

  const handleBackClick = () => {
    router.push(vaultData ? `/vault/${vaultData.publicKey}` : "/");
  }

  return (
    <div className="w-full max-w-9xl p-8 md:p-6">
      {/* Back Button */}
      <div className="mb-4">
        <Button
          variant="ghost"
          onClick={handleBackClick}
          className="text-slate-400 hover:text-white hover:bg-slate-800/50 p-2 h-auto"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Vault
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
                {/* Main Content */}
                {activeTab == "vault-stats" && (
                    <div className="xl:col-span-2 space-y-4 order-2 xl:order-1">
                    <VaultDashboardFlow vaultData={vaultData} depositData={depositData} strategyData={strategiesData} />
                    {/*<VaultDashboardChart vaultAddress={vault} />*/}
                    </div>
                )}

                {/* Execute Card - Show first on mobile */}
                <div className="xl:col-span-2 order-1 xl:order-2">
                    <VaultDashboardBalances depositData={depositData} strategiesData={strategiesData} isLoading={isLoading} isManager={true} vaultData={vaultData} />
                </div>
            </div>
        </div>
        </>
      )}
    </div>
  )
}