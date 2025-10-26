"use client";
import { Navbar } from '@/components/Navbar';
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { VaultCard, VaultCardData } from "@/components/VaultCard";
import { getConnection } from "@/lib/solana"
import { GridStyleBackground } from "@/components/ui/GridStyleBackground"
import { StrategyFlow } from '@/components/StrategyFlow';
import { getAllVaultBalances } from '@/lib/api';
import { TrendingUp, DollarSign, Users, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { AccessCodeGate } from '@/components/AccessCodeGate';
import { TermsOfService } from '@/components/TermsOfService';
import { useWallet } from "@solana/wallet-adapter-react";
import { registerUser } from '@/lib/utils/activity-logger';

const connection = getConnection();

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [vaultCardsData, setVaultCardsData] = useState<VaultCardData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasAccessCode, setHasAccessCode] = useState(false);
  const [hasSignedTerms, setHasSignedTerms] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();
  const { connected, publicKey } = useWallet();

  useEffect(() => {
    // Check if access code has been entered
    const accessGranted = localStorage.getItem("mirrorfi_access_granted");
    if (accessGranted === "true") {
      setHasAccessCode(true);
    }

    const checkLocalSignature = async () => {
      if (!publicKey) {
        setChecking(false);
        return;
      }

      // Register user in database when they connect
      await registerUser(publicKey.toBase58());

      // Check local signature
      const storedSignatures = localStorage.getItem("termsSignatures") || "{}";
      const signatures = JSON.parse(storedSignatures);
      if (signatures[publicKey.toBase58()]) {
        setHasSignedTerms(true);
        setChecking(false);
        return;
      }

      setChecking(false);
    };

    checkLocalSignature();
  }, [publicKey]);

  useEffect(() => {
    setIsLoading(true);
    async function fetchAllVaults() {
      let vaultBalances = await getAllVaultBalances();
      vaultBalances.sort((a:any, b:any) => b.vault.totalNav - a.vault.totalNav);
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
  }, [hasAccessCode, hasSignedTerms, connected])

  const handleAccessGranted = () => {
    setHasAccessCode(true);
  };

  const handleTermsSigned = () => {
    setHasSignedTerms(true);
  };

  // First check: Access code
  if (!hasAccessCode) {
    return <AccessCodeGate onAccessGranted={handleAccessGranted} />;
  }

  // Second check: Terms of service (only if wallet is connected)
  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  // if (connected && !hasSignedTerms) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
  //       <TermsOfService onSign={handleTermsSigned} />
  //     </div>
  //   );
  // }

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

          {/* Loading Interface */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-6">
              {/* Loading Spinner */}
              <div className="relative">
                <div className="w-16 h-16 border-4 border-slate-600/30 border-t-blue-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                </div>
              </div>
              
              {/* Loading Text */}
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-white">Loading Vaults</h3>
                <p className="text-slate-400">Fetching MirrorFi Vault Data...</p>
              </div>

              {/* Loading Skeleton Cards */}
              <div className="w-full max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Card key={index} className="bg-slate-800/30 border-slate-600/20 rounded-xl p-6 backdrop-blur-sm">
                      <CardContent className="p-0 space-y-4">
                        {/* Header Skeleton */}
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-6 w-32" />
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-8" />
                            <Skeleton className="h-6 w-16" />
                          </div>
                        </div>

                        {/* Deposit Token Skeleton */}
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-16" />
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-slate-700/30 rounded-lg px-3 py-2">
                              <Skeleton className="w-6 h-6 rounded-full" />
                              <Skeleton className="h-4 w-12" />
                            </div>
                            <Skeleton className="h-6 w-16 rounded-full" />
                          </div>
                        </div>

                        {/* Strategies Skeleton */}
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-20" />
                          <div className="flex flex-wrap gap-2">
                            <Skeleton className="h-8 w-16 rounded-lg" />
                            <Skeleton className="h-8 w-20 rounded-lg" />
                            <Skeleton className="h-8 w-14 rounded-lg" />
                          </div>
                        </div>

                        {/* Footer Skeleton */}
                        <div className="flex items-center justify-between pt-4">
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                          <Skeleton className="h-8 w-24 rounded" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Vault Dashboard Section */
            <>
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

              {/* Empty State when no vaults and not loading */}
              {vaultCardsData.length === 0 && !error && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="p-4 bg-slate-800/50 rounded-full mb-4">
                    <DollarSign className="h-12 w-12 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Wait a sec...</h3>
                  {/*<p className="text-slate-400 max-w-md">
                    There are currently no vaults available. Please check back later.
                  </p>*/}
                </div>
              )}
            </>
          )}

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