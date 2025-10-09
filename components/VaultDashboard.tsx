"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import { getVaultBalances } from "@/lib/api/vault"
import { PublicKey, Keypair } from "@solana/web3.js"
import { getVaultAccountInfo, getVaultDepositorAccountInfo } from "@/lib/utils/mirrorfi/accounts"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

import { VaultDashboardExecuteCard } from "@/components/VaultDashboardExecuteCard"
import { VaultDashboardChart } from "@/components/VaultDashboardChart";
import { VaultDashboardFlow } from "@/components/VaultDashboardFlow";
import { VaultDashboardBalances } from "@/components/VaultDashboardBalances"
import { VaultDashboardUserPosition } from "@/components/VaultDashboardUserPosition"
import { getConnection } from "@/lib/solana"
import { useWallet } from "@solana/wallet-adapter-react"

interface StrategyDashboardProps {
  vault: string;
  strategy: {
    name: string
    icon?: string
    status: "active" | "inactive" | "pending"
  }
  activeTab: string
  onTabChange?: (tab: string) => void
}

const connection = getConnection();

export function VaultDashboard({ vault, strategy, activeTab = "vault-stats", onTabChange }: StrategyDashboardProps) {
  const tabs = [
    { id: "vault-stats", label: "Vault Stats" },
    { id: "your-position", label: "Your Position" },
    { id: "overview", label: "Overview" },
  ]
  const { publicKey } = useWallet();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [vaultBalances, setVaultBalances] = useState<any>(null);
  const [positionBalance, setPositionBalance] = useState<number>(0);
  const [vaultDepositTokenMint, setVaultDepositTokenMint] = useState<string | null>("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
  const [vaultDepositorInfo, setVaultDepositorInfo] = useState<any>(null);
  const handleReload = () => {
    setReload(!reload);
  }

  const handleBackClick = () => {
    router.push('/');
  }


  useEffect(() => {
    setIsLoading(true);
    async function loadVault(){
      // Try Loading vault key and check if it's valid
      // try {
      //   const vaultKey 
      // }


      try{
        const vaultKey = new PublicKey(vault);
        // Process that can be compiled together
        // Batch 1: Get Balances
        const balances = await getVaultBalances(vaultKey);
        setVaultBalances(balances);
        // Batch 2: Get Vault Account Info
        const vaultData = await getVaultAccountInfo(connection, vaultKey);
        setVaultDepositTokenMint(vaultData.deposit_token_mint.toBase58());
        // Batch 3: Get User Position Info
        if(publicKey){
          const vaultDepositor = await getVaultDepositorAccountInfo(connection, vaultKey, publicKey);
          if(vaultDepositor) {
            setVaultDepositorInfo(vaultDepositor);
            const positionShareToken = Number(vaultDepositor.total_shares) / 10**8;
            const ownershipRatio = positionShareToken / balances.shareTokenSupply;
            const positionBalance = ownershipRatio * balances.totalNAV;
            setPositionBalance(positionBalance);
          }
        }
        // if()
        // const vaultDepositor = await getVaultAccountInfo(connection, vaultKey, publicKey);
      } catch (error) {
        console.error("Error fetching vault balances:", error);
      } 
      setIsLoading(false);
    }
    loadVault();
  }, [vault, publicKey, reload]);

  return (
    <div className="w-full max-w-7xl mx-auto p-8 md:p-6">
      {/* Back Button */}
      <div className="mb-4">
        <Button
          variant="ghost"
          onClick={handleBackClick}
          className="text-slate-400 hover:text-white hover:bg-slate-800/50 p-2 h-auto"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <div className="flex items-start gap-3 mb-4">
        <Avatar className="h-8 w-8 md:h-10 md:w-10 bg-gradient-to-br from-pink-500 to-rose-400">
          <AvatarFallback className="text-white font-bold text-sm md:text-base">{strategy.icon || strategy.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="text-lg md:text-xl font-semibold text-white">{strategy.name}</h2>
          <Badge
            variant={strategy.status === "active" ? "default" : "secondary"}
            className={`mt-1 text-xs ${
              strategy.status === "active"
                ? "bg-green-500/20 text-green-400 border-green-500/30"
                : "bg-gray-500/20 text-gray-400 border-gray-500/30"
            }`}
          >
            {strategy.status}
          </Badge>
        </div>
      </div>

      {/* Navigation Tabs - Mobile responsive */}
      <div className="flex flex-wrap gap-2 mb-4 overflow-x-auto">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "outline"}
            size="sm"
            onClick={() => onTabChange?.(tab.id)}
            className={`whitespace-nowrap text-xs md:text-sm ${
              activeTab === tab.id
                ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-500"
                : "bg-transparent border-blue-700/50 text-blue-300 hover:bg-blue-800/30 hover:text-white"
            }`}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        {/* Mobile: Stack all content vertically */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Main Content */}
          {activeTab == "vault-stats" && (
            <div className="xl:col-span-2 space-y-4 order-2 xl:order-1">
              <VaultDashboardFlow />
              <VaultDashboardChart vaultAddress={vault} />
              <VaultDashboardBalances vaultBalances={vaultBalances} isLoading={isLoading} />
            </div>
          )}
          {activeTab == "your-position" && (
            <div className="xl:col-span-2 space-y-4 order-2 xl:order-1">
              <VaultDashboardUserPosition vaultDepositor={vaultDepositorInfo} positionBalance={positionBalance} tokenPrice={vaultBalances?.depositTokenPrice}/>
            </div>
          )}
          {activeTab == "overview" && (
            <div className="xl:col-span-2 space-y-4 order-2 xl:order-1">
              <VaultDashboardBalances vaultBalances={vaultBalances} isLoading={isLoading} />
            </div>
          )}

          {/* Execute Card - Show first on mobile */}
          <div className="xl:col-span-1 order-1 xl:order-2">
            {vaultDepositTokenMint && <VaultDashboardExecuteCard vault={vault} tokenMint={vaultDepositTokenMint} positionBalance={positionBalance} handleReload={handleReload} /> }
          </div>
        </div>
      </div>
    </div>
  )
}