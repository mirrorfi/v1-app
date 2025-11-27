"use client"
import { useState, useEffect } from "react"
import { VaultDashboard } from "@/components/VaultDashboard"
import { MobileVaultDashboard } from "@/components/MobileVaultDashboard"
import { Navbar } from "@/components/Navbar"
import { useParams } from "next/navigation"
import { useIsMobile } from "@/lib/hooks/useIsMobile"
import { PublicKey } from "@solana/web3.js"
import { getAssociatedTokenAddressSync, NATIVE_MINT } from "@solana/spl-token"
import { mirrorfiClient } from '@/lib/client/solana';
import { getPrices, getVaultBalance, parseVaultBalanceData, ParsedVaultBalanceData } from "@/lib/api";
import { parseVault, parseVaultDepositor, ParsedVault, ParsedVaultDepositor } from '@/types/accounts';
import { getConnection } from "@/lib/solana"
import { useWallet } from "@solana/wallet-adapter-react"
import { GridStyleBackground } from "@/components/ui/GridStyleBackground"

export default function VaultPage() {
  const isMobile = useIsMobile()
  const {address: vault } = useParams<{ address: string }>();

  const connection = getConnection();
  const { publicKey } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(false);
  const [positionBalance, setPositionBalance] = useState<number>(0);
  const [sharePrice, setSharePrice] = useState<number>(0);
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [tokenPrice, setTokenPrice] = useState<number>(0);
  // Vault Informations
  const [vaultData, setVaultData] = useState<ParsedVault | null>(null);
  const [depositData, setDepositData] = useState<ParsedVaultBalanceData | null>(null);
  const [strategiesData, setStrategiesData] = useState<ParsedVaultBalanceData[]>([]);

  const handleReload = () => {
    setReload(!reload);
  }

  async function fetchUserBalance(depositData: ParsedVaultBalanceData, user: PublicKey) {
    if(!depositData){ return; }
    setTokenPrice(depositData.tokenInfo.usdPrice);
    if (depositData.mint === NATIVE_MINT.toBase58()) {
      const userBalance = await connection.getBalance(user);
      const userUiBalance = userBalance / 10**depositData.tokenInfo.decimals;
      const userDisplayedBalance = Math.max(0, userUiBalance - 0.01); 
      setTokenBalance(userDisplayedBalance);
    } else {
      const tokenMint = depositData.mint;
      const userAta = getAssociatedTokenAddressSync(new PublicKey(tokenMint), user, false, new PublicKey(depositData.tokenInfo.tokenProgram) );
      const accountInfo = await connection.getTokenAccountBalance(userAta);
      if (accountInfo.value.uiAmount) {
        setTokenBalance(accountInfo.value.uiAmount);
      }
    }
  }

  async function fetchUserReceiptBalance(vaultData: ParsedVault, depositData: ParsedVaultBalanceData, user: PublicKey) {
    if(!vaultData.publicKey){ throw new Error("Invalid vault data: missing publicKey"); }
    if(!vaultData.depositMint){ throw new Error("Invalid vault data: missing depositMint"); }
    // Fetch Vault Depositor Account
    const vaultDepositorPda = mirrorfiClient.getVaultDepositorPda(user, new PublicKey(vaultData.publicKey));
    const vaultDepositor = await mirrorfiClient.fetchProgramAccount(vaultDepositorPda.toBase58(), "vaultDepositor", parseVaultDepositor);
    const userShares = vaultDepositor ? vaultDepositor.shares : "0";
    // Calculate Share Price
    const vaultRealizedValuation = Number(vaultData.userDeposits) + Number(vaultData.realizedPnl);
    const sharePrice = Number(vaultData.totalShares) > 0 ? vaultRealizedValuation / Number(vaultData.totalShares) : 0;
    console.log("Vault Realized Valuation:", vaultRealizedValuation);
    console.log("Calculated Share Price:", sharePrice);
    setPositionBalance(Number(userShares) / 10**depositData.tokenInfo.decimals);
    setSharePrice(sharePrice);
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
    return {vaultData, depositData};
  }

  useEffect(() => {
    setIsLoading(true);
    setError(null); // Reset error state
    
    async function loadVault(){
      // Try Loading vault key and check if it's valid
      try {
        const vaultKey = new PublicKey(vault);
      } catch(e: any){
        console.error("Invalid vault address:", e);
        setError(`Invalid vault address: "${vault}" is not a valid Solana public key.`);
        setIsLoading(false);
        return;
      }

      try{
        const vaultKey = new PublicKey(vault);
        const {depositData, vaultData} = await fetchVaultBalances(vaultKey);
        if(publicKey){
          fetchUserBalance(depositData, publicKey); // Fetch User's Deposit Token Balance
          fetchUserReceiptBalance(vaultData, depositData, publicKey); // Fetch User's Share Token Balance
        }
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
      <Navbar />
      
      {/* Conditional rendering based on screen size */}
      {isMobile ? (
        <div className="w-full h-full">
          <MobileVaultDashboard 
            vault={vault} 
            vaultData={vaultData} 
            positionBalance={positionBalance}
            sharePrice={sharePrice}
            tokenBalance={tokenBalance}
            tokenPrice={tokenPrice}
            isLoading={isLoading}
            error={error}
            handleReload={handleReload}
            depositData={depositData}
            strategiesData={strategiesData}
          />
        </div>
      ) : (
        <VaultDashboard 
          vault={vault} 
          vaultData={vaultData} 
          positionBalance={positionBalance}
          sharePrice={sharePrice}
          tokenBalance={tokenBalance}
          tokenPrice={tokenPrice}
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