"use client";
import { Navbar } from '@/components/Navbar';
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { VaultCard, VaultCardData } from "@/components/VaultCard";
import { parseVault, parseVaultDepositor } from '@/types/accounts';
import { getConnection } from "@/lib/solana"
import { GridStyleBackground } from "@/components/ui/GridStyleBackground"
import { StrategyFlow } from '@/components/StrategyFlow';
import { getAllVaultBalances } from '@/lib/api';
import { AlertCircle } from 'lucide-react';

const connection = getConnection();

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [vaultCardsData, setVaultCardsData] = useState<VaultCardData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();


  useEffect(() => {
    setIsLoading(true);
    async function fetchAllVaults() {
      console.log("Fetching Balances")
      const vaultBalances = await getAllVaultBalances();
      console.log(vaultBalances);
      if(!vaultBalances) {
        setError("Somehow something is wrong. Our team might be locking in...");
        return;
      }

      const vaultCardsData = vaultBalances.map((vaultData:any) => {
        const vaultStrategies = vaultData.strategies.map((strategy:any) => {
          const strategyTypeKey = Object.keys(strategy.strategyType)[0];
          if (strategyTypeKey === "jupiterSwap") {
            return {
              symbol: strategy.symbol,
              icon: strategy.icon,
              apy: undefined,
            };
          }
          else{
            setError(`Tell the team to go and integrate: ${strategyTypeKey}`)
            return;
          }
        });
        return {
          name: vaultData.vault.name,
          nav: vaultData.vault.totalNav,
          depositToken: {
            symbol: vaultData.vault.symbol,
            icon: vaultData.vault.icon,
            apy: undefined,
          },
          strategies: vaultStrategies,
          createdBy: vaultData.vault.authority,
          address: vaultData.vault.publicKey,
        }
      });
      setVaultCardsData(vaultCardsData);
    }
    fetchAllVaults();
    setIsLoading(false);
  }, [])

  const handleVaultClick = (vaultPubkey: string) => {
    router.push(`/vault/${vaultPubkey}`);
  };

  // Mock vault data for the dashboard
  const mockVaults = [
    {
      name: "Vault Name",
      nav: 100.00,
      depositToken: {
        symbol: "USDC",
        icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
        apy: 5.0
      },
      strategies: [
        {
          symbol: "SOL",
          name: "Solana",
          icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
          apy: 6.0
        
        },
        {
          symbol: "MET",
          name: "Meteora",
          icon: "https://docs.meteora.ag/images/logo/meteora.png"
        },
        {
          symbol: "ETH",
          name: "Ethereum",
          icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs/logo.png",
          apy: 8.0
        },
        {
          symbol: "BTC",
          name: "Bitcoin",
          icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E/logo.png"
        }
      ],
      createdBy: "ABC1...434w44",
      address: "So11111111111111111111111111111111111111112"
    },
    {
      name: "DeFi Yield Vault",
      nav: 250.75,
      depositToken: {
        symbol: "USDT",
        icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.png",
        apy: 7.2
      },
      strategies: [
        {
          symbol: "JUP",
          name: "Jupiter",
          icon: "https://static1.tokenterminal.com//jupiter/logo.png?logo_hash=6745b324c298242676b7eab38db2c28901075b4f"
        },
        {
          symbol: "RAY",
          name: "Raydium",
          icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R/logo.png"
        }
      ],
      createdBy: "DEF2...567x88",
      address: "6wFQF8A7cWs7wuVD7YF3vQ7LBKA8YxjDutGGhRzyjTBl"
    },
    {
      name: "Stable Yield Strategy",
      nav: 500.00,
      depositToken: {
        symbol: "USDC",
        icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
        apy: 4.5
      },
      strategies: [
        {
          symbol: "ORCA",
          name: "Orca",
          icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE/logo.png"
        }
      ],
      createdBy: "GHI3...789z99",
      address: "7xGQF8A7cWs7wuVD7YF3vQ7LBKA8YxjDutGGhRzyjTBm"
    },
    {
      name: "Growth Portfolio",
      nav: 150.25,
      depositToken: {
        symbol: "SOL",
        icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
        apy: 12.8
      },
      strategies: [
        {
          symbol: "MNGO",
          icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac/logo.png"
        },
        {
          symbol: "SRM",
          icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt/logo.png"
        },
        {
          symbol: "FTT",
          icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/AGFEad2et2ZJif9jaGpdMixQqvW5i81aBdvKe7PHNfz3/logo.png"
        }
      ],
      createdBy: "JKL4...012a11",
      address: "8yHQF8A7cWs7wuVD7YF3vQ7LBKA8YxjDutGGhRzyjTBn"
    },
    {
      name: "Multi-Asset Vault",
      nav: 75.50,
      depositToken: {
        symbol: "USDC",
        icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
        apy: 6.3
      },
      strategies: [
        {
          symbol: "STEP",
          name: "Step Finance",
          icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/StepAscQoEioFxxWGnh2sLBDFp9d8rvKz2Yp39iDpyT/logo.png"
        },
        {
          symbol: "COPE",
          name: "Cope",
          icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/8HGyAAB1yoM1ttS7pXjHMa3dukTFGQggnFFH3hJZgzQh/logo.png"
        }
      ],
      createdBy: "MNO5...345b22",
      address: "9zIQF8A7cWs7wuVD7YF3vQ7LBKA8YxjDutGGhRzyjTBo"
    },
    {
      name: "Conservative Fund",
      nav: 300.00,
      depositToken: {
        symbol: "USDT",
        icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.png",
        apy: 3.8
      },
      strategies: [
        {
          symbol: "USDC",
          name: "USD Coin",
          icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png"
        }
      ],
      createdBy: "PQR6...678c33",
      address: "1aJQF8A7cWs7wuVD7YF3vQ7LBKA8YxjDutGGhRzyjTBp"
    }
  ];

  const handleViewVaultDetails = (vaultAddress: string) => {
    router.push(`/vault/${vaultAddress}`);
  };

  const LoadingSkeleton = () => (
    <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-700/30 backdrop-blur-sm rounded-lg shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-8 w-full" />
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background/95 to-blue-950/20 text-foreground overflow-x-hidden">
      <GridStyleBackground />
      <Navbar />
      <main className="flex-1 w-full">
        <div className="w-full max-w-10xl mx-auto p-6 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Vault Dashboard
            </h1>
            <p className="text-slate-400 text-lg">
              Discover and invest in Solana DeFi strategies
            </p>
          </div>

          {/* New Vault Dashboard Section */}
          {vaultCardsData.length > 0 && 
            <div className="mb-12">            
              {/* Vault Cards Grid - 3 columns on desktop, responsive */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {vaultCardsData.map((vault, index) => (
                  <VaultCard
                    key={index}
                    vault={vault}
                    onViewDetails={handleViewVaultDetails}
                  />
                ))}
              </div>
            </div>
          }

          {/* Error Display */}
          {error && (
            <Card className="bg-gradient-to-br from-red-900/20 to-red-800/10 border-red-700/30 backdrop-blur-sm rounded-lg shadow-lg mb-6">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-red-500/20 rounded-lg flex-shrink-0">
                    <AlertCircle className="h-6 w-6 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-red-400 font-semibold text-lg mb-2">Error Loading Data:</h3>
                    <p className="text-red-300 mb-4">{error}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}