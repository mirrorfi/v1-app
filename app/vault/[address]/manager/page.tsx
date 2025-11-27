"use client"
import { useState, useEffect } from "react"
import { VaultDashboard } from "@/components/VaultDashboard"
import { MobileVaultDashboard } from "@/components/MobileVaultDashboard"
import { Navbar } from "@/components/Navbar"
import { useParams } from "next/navigation"
import { useIsMobile } from "@/lib/hooks/useIsMobile"
import { PublicKey, Keypair } from "@solana/web3.js"
import { getAssociatedTokenAddressSync } from "@solana/spl-token"
import { mirrorfiClient } from '@/lib/client/solana';
import { getVaultBalance, ParsedVaultBalanceData, parseVaultBalanceData} from "@/lib/api";
import { parseVault, ParsedVault } from '@/types/accounts';
import { getConnection } from "@/lib/solana"
import { useWallet } from "@solana/wallet-adapter-react"
import { TOKEN_INFO } from "@/lib/utils/tokens"
import { getVaultStrategies } from "@/lib/api/accounts";
import { VaultManagerDashboard } from "@/components/VaultManagerDashboard"
import { GridStyleBackground } from "@/components/ui/GridStyleBackground"

export default function VaultPage() {
  const isMobile = useIsMobile()
  const { address: vault } = useParams<{ address: string }>();

  const connection = getConnection();
  const { publicKey } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vaultData, setVaultData] = useState<any>(null);
  const [reload, setReload] = useState(false);
  const [depositData, setDepositData] = useState<any>(null);
  const [strategiesData, setStrategiesData] = useState<any[]>([]);

  const handleReload = () => {
    setReload(!reload);
  }

  async function fetchVaultBalances(vaultKey: PublicKey) {
    // 1. Fetch Vault Balances from API
    const vaultBalances = (await getVaultBalance(vaultKey.toBase58()))[0];
    // 2. Parse Deposit Data
    const vaultBalanceData = vaultBalances.vault;
    const depositData: ParsedVaultBalanceData = parseVaultBalanceData(vaultBalanceData, "deposit");
    // 3. Parse Strategies Data
    const strategiesData: ParsedVaultBalanceData[] = [];
    const depositTokenInfo = depositData.tokenInfo;
    for(const strategy of vaultBalances.strategies){
      const strategyTypeKey = Object.keys(strategy.strategyType)[0];
      let strategyData = parseVaultBalanceData(strategy, strategyTypeKey);
      strategyData.initialCapital = Number(strategy.depositsDeployed) * (depositTokenInfo.usdPrice || 0) / 10**depositTokenInfo.decimals;
      strategiesData.push(strategyData);
    }
    // 4. Parse Vault Account Data
    const vaultData: ParsedVault = {
      id: vaultBalanceData.id,
      authority: vaultBalanceData.authority,
      name: vaultBalanceData.name,
      description: vaultBalanceData.description,
      depositMint: vaultBalanceData.depositMint,
      depositCap: vaultBalanceData.depositCap,
      userDeposits: vaultBalanceData.userDeposits,
      realizedPnl: vaultBalanceData.realizedPnl,
      depositsInStrategies: vaultBalanceData.depositsInStrategies,
      lockedProfit: vaultBalanceData.lockedProfit,
      lockedProfitDuration: vaultBalanceData.lockedProfitDuration,
      lastProfitLockTs: vaultBalanceData.lastProfitLockTs,
      totalShares: vaultBalanceData.totalShares,
      unclaimedManagerFee: vaultBalanceData.unclaimedManagerFee,
      performanceFeeBps: vaultBalanceData.performanceFeeBps,
      status: vaultBalanceData.status,
      nextStrategyId: vaultBalanceData.nextStrategyId,
      publicKey: vaultKey.toBase58(),
    }
    setVaultData(vaultData);
    setDepositData(depositData);
    setStrategiesData(strategiesData);
    return {vaultNav: vaultBalances.vault.totalNav, vaultData};
  }

  useEffect(() => {
    setIsLoading(true);
    setError(null); // Reset error state

    async function loadVault() {
      // Try Loading vault key and check if it's valid
      try {
        const vaultKey = new PublicKey(vault);
      } catch (e: any) {
        setError(`Invalid vault address: "${vault}" is not a valid Solana public key.`);
        setIsLoading(false);
        return;
      }

      try {
        const vaultKey = new PublicKey(vault);
        fetchVaultBalances(vaultKey);
      } catch (error: any) {
        console.error("Error loading vault:", error);

        // Handle specific errors
        if (error.message && error.message.includes('Vault not found')) {
          setError(`Vault not found: The vault "${vault}" does not exist or is not accessible.`);
        } else {
          setError(`Failed to load vault data: ${error.message || 'Unknown error occurred'}`);
        }
      }
      setIsLoading(false);
      // wait 60s
      // await new Promise(resolve => setTimeout(resolve, 60000));
      // loadVault();
    }
    loadVault();
  }, [vault, publicKey, reload]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <GridStyleBackground />
      {/* Only show Navbar on desktop */}
      {!isMobile && <Navbar />}

      {/* Conditional rendering based on screen size */}
      {isMobile ? (
        <div className="w-full h-full">
          <VaultManagerDashboard
            vault={vault}
            vaultData={vaultData}
            isLoading={isLoading}
            error={error}
            handleReload={handleReload}
            depositData={depositData}
            strategiesData={strategiesData}
          />
        </div>
      ) : (
        <VaultManagerDashboard
          vault={vault}
          vaultData={vaultData}
          isLoading={isLoading}
          error={error}
          handleReload={handleReload}
          depositData={depositData}
          strategiesData={strategiesData}
        />
      )}
    </main>
  )
}