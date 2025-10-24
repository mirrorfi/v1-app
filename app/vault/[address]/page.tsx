"use client"
import { useState, useEffect } from "react"
import { VaultDashboard } from "@/components/VaultDashboard"
import { MobileVaultDashboard } from "@/components/MobileVaultDashboard"
import { Navbar } from "@/components/Navbar"
import { useParams } from "next/navigation"
import { useIsMobile } from "@/lib/hooks/useIsMobile"
import { PublicKey, Keypair } from "@solana/web3.js"
import { getAssociatedTokenAddressSync } from "@solana/spl-token"
import { ArrowLeft, AlertCircle, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { mirrorfiClient } from '@/lib/solana-server';
import { getPrices, getTokenInfos } from "@/lib/api";
import { parseVault, parseVaultDepositor } from '@/types/accounts';
import { getConnection } from "@/lib/solana"
import { useWallet } from "@solana/wallet-adapter-react"
import { TOKEN_INFO } from "@/lib/utils/tokens"
import { getVaultStrategies } from "@/lib/api/accounts";
import { mintTo } from "@solana/spl-token"
import { deposit } from "@kamino-finance/klend-sdk"

export default function VaultPage() {
  const isMobile = useIsMobile()
  const {address: vault } = useParams<{ address: string }>();

  const strategy = {
    name: "My Super Hyped Strategy",
    icon: "🚀",
    status: "active" as const,
  }

  const connection = getConnection();
  const { publicKey } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vaultData, setVaultData] = useState<any>(null);
  const [reload, setReload] = useState(false);
  const [vaultBalances, setVaultBalances] = useState<any>(null);
  const [positionBalance, setPositionBalance] = useState<number>(0);
  const [vaultDepositTokenMint, setVaultDepositTokenMint] = useState<string | null>("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
  const [vaultDepositorInfo, setVaultDepositorInfo] = useState<any>(null);
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [tokenPrice, setTokenPrice] = useState<number>(0); 
  const [depositData, setDepositData] = useState<any>(null);
  const [strategiesData, setStrategiesData] = useState<any[]>([]);

  const handleReload = () => {
    setReload(!reload);
  }

  async function fetchUserBalance(tokenMint: string, user: PublicKey) {
    const info = TOKEN_INFO[tokenMint]
    const userAta = getAssociatedTokenAddressSync(new PublicKey(tokenMint), user, false, info.tokenProgram);
    const accountInfo = await connection.getTokenAccountBalance(userAta);
    const tokenPriceData = await getPrices([tokenMint]);
    console.log("Token Price Data:", tokenPriceData);
    if (tokenPriceData[tokenMint]) setTokenPrice(tokenPriceData[tokenMint]);
    if (accountInfo.value.uiAmount) setTokenBalance(accountInfo.value.uiAmount);
  }

  async function fetchUserVaultDepositor(vaultKey: PublicKey, user: PublicKey, tokenMint: string) {
    const info = TOKEN_INFO[tokenMint]
    const vaultDepositorPda = await mirrorfiClient.getVaultDepositorPda(vaultKey, user);
    const vaultDepositorData = await mirrorfiClient.fetchProgramAccount(vaultDepositorPda.toBase58(), "vaultDepositor", parseVaultDepositor);
    console.log("Vault Depositor Data:", vaultDepositorData);
    setVaultDepositorInfo(vaultDepositorData);
    if(vaultDepositorData) {
      setVaultDepositorInfo(vaultDepositorData);
      const positionShareToken = Number(vaultDepositorData.totalShares) / 10**info.tokenDecimals;
      // TODO: Fetch Share Token Balance using Share Token Price
      // const ownershipRatio = positionShareToken / balances.shareTokenSupply;
      // const positionBalance = ownershipRatio * balances.totalNAV;
      setPositionBalance(positionShareToken);
    }
  }

  async function fetchVaultStrategies(vaultKey: PublicKey, vaultData: any) {
    let tokenInfo = TOKEN_INFO[vaultData.depositMint];
    
    // 1. Fetch Deposit ATAs and Balances
    let vaultDepositAta = getAssociatedTokenAddressSync(new PublicKey(vaultData.depositMint), vaultKey, true, tokenInfo.tokenProgram);
    let vaultDepositMintBalanceRes = await connection.getTokenAccountBalance(vaultDepositAta);
    let vaultDepositMintBalance = vaultDepositMintBalanceRes.value.uiAmount || 0;
    console.log("TOKEN BALANCE:", vaultDepositMintBalance);

    // 2. Fetch Strategies
    const strategies = await getVaultStrategies(vaultKey);
    console.log("Vault Strategies:", strategies);

    // 3. Get all token addresses involved
    const tokens = [vaultData.depositMint];
    const added = {[vaultData.depositMint]: true};
    for (const strategy of strategies) {
      if(strategy.strategyType.jupiterSwap) {
        const targetMint = strategy.strategyType.jupiterSwap.targetMint;
        tokens.push(targetMint);
        added[targetMint] = true;
      }
      // TO DO: Fetching for other strategies
    }
    console.log("tokens:", tokens);

    // 4. Fetch Token Prices and Infos from Jupiter for all tokens
    const tokenInfos = await getTokenInfos(tokens);
    console.log("Token Prices:", Object.entries(tokenInfos).map(([mint, info]) => ({ mint, usdPrice: info.usdPrice })));
    console.log("Jupiter Token Infos:", tokenInfos);

    // 5. Fetch ATAs for all Jupiter Strategies
    const jupStrategyAtas = [];
    for (const strategy of strategies) {
      if(strategy.strategyType.jupiterSwap) {
        const tokenMint = strategy.strategyType.jupiterSwap.targetMint;
        const ata = getAssociatedTokenAddressSync(
          new PublicKey(tokenMint), 
          vaultKey, 
          true, 
          new PublicKey(tokenInfos[tokenMint].tokenProgram)
        );
        jupStrategyAtas.push(ata);
      }
    }
    const jupBalancesRes = await connection.getMultipleParsedAccounts(jupStrategyAtas);
    console.log("Jupiter Strategy ATAs Balances:", jupBalancesRes);

    // 6. Parse Collected Data
    const depositTokenInfo = tokenInfos[vaultData.depositMint];
    const depositData = {
      strategyType: "deposit",
      tokenInfo: tokenInfos[vaultData.depositMint],
      mint: vaultData.depositMint,
      balance: vaultDepositMintBalance,
      value: vaultDepositMintBalance * (depositTokenInfo.usdPrice || 0),
      //change24h: 100 * (tokenPrices[vaultData.depositMint]?.priceChange24h || 0) / (tokenPrices[vaultData.depositMint]?.usdPrice || 1),
      change24h: depositTokenInfo.priceChange24h || 0,
    }
    const strategiesData = [];
    for (let i = 0; i < strategies.length; i++) {
      const strategy = strategies[i];
      const strategyTypeKey = Object.keys(strategy.strategyType)[0];

      if(strategyTypeKey === "jupiterSwap") {
        const tokenMint = strategy.strategyType.jupiterSwap.targetMint;
        const tokenInfo = tokenInfos[tokenMint];
        const ataInfo = jupBalancesRes.value[i] as any;
        const ataBalance = ataInfo?.data.parsed.info.tokenAmount.uiAmount || 0;

        console.log("Strategy ATA Balance:", ataBalance);
        console.log("Strategy Deployed:", strategy.depositsDeployed);

        strategiesData.push({
          strategyType: strategyTypeKey,
          tokenInfo: tokenInfos[tokenMint],
          mint: tokenMint,
          balance: ataBalance,
          value: ataBalance * (tokenInfo.usdPrice || 0),
          initialCapital: (strategy.depositsDeployed || 0) * (depositTokenInfo.usdPrice || 0) / 10**depositTokenInfo.decimals,
          percentChange24h: tokenInfo.priceChange24h || 0,
        });
      }else {
        throw new Error(`Strategy Type Not Integrated: ${strategyTypeKey}`);
      }
    }
    console.log("Deposit Data:", depositData);
    console.log("Strategies Data:", strategiesData);
    setDepositData(depositData);
    setStrategiesData(strategiesData);
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
        // Process that can be compiled together
        // Batch 1: Get Balances
        // const balances = await getVaultBalances(vaultKey);
        // setVaultBalances(balances);
        // Step 2: Get Vault Account Info
        const vaultData = await mirrorfiClient.fetchProgramAccount(vault, "vault", parseVault);
        if(!vaultData){
          throw new Error("Vault not found");
        }
        console.log("Vault Data:", vaultData);
        setVaultData(vaultData);
        setVaultDepositTokenMint(vaultData.depositMint);
        fetchVaultStrategies(vaultKey, vaultData);
        // Step 3: Get User Position Info
        if(publicKey){
          // Fetch Deposit Token Balance
          fetchUserBalance(vaultData.depositMint, publicKey);
          // Fetch Share Token Balance
          fetchUserVaultDepositor(vaultKey, publicKey, vaultData.depositMint);
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
      await new Promise(resolve => setTimeout(resolve, 60000));
      loadVault();
    }
    loadVault();
  }, [vault, publicKey, reload]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Only show Navbar on desktop */}
      {!isMobile && <Navbar />}
      
      {/* Conditional rendering based on screen size */}
      {isMobile ? (
        <div className="w-full h-full">
          <MobileVaultDashboard 
            vault={vault} 
            vaultData={vaultData} 
            vaultDepositorInfo={vaultDepositorInfo}
            positionBalance={positionBalance}
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
          vaultDepositorInfo={vaultDepositorInfo}
          positionBalance={positionBalance}
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