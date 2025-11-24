"use client";
import { Navbar } from '@/components/Navbar';
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
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
  const [filteredVaults, setFilteredVaults] = useState<VaultCardData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
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
    if (publicKey) {
      registerUser(publicKey.toBase58());
    }
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
      setFilteredVaults(vaultCardsData);
      // console.log("Fetched vaults:", vaultCardsData);
    }
    fetchAllVaults();
    setIsLoading(false);
  }, [hasAccessCode, hasSignedTerms, connected])

  // Filter vaults based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredVaults(vaultCardsData);
    } else {
      const filtered = vaultCardsData.filter((vault) =>
        vault.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredVaults(filtered);
    }
  }, [searchQuery, vaultCardsData]);

  const handleAccessGranted = () => {
    setHasAccessCode(true);
  };

  // First check: Access code
  if (!hasAccessCode) {
    return <AccessCodeGate onAccessGranted={handleAccessGranted} />;
  }

  // Second check: Terms of service (only if wallet is connected)
  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-900 via-black to-gray-800">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

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
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
      <GridStyleBackground />
      <Navbar />
      <main className="flex-1 w-full relative z-10">
        <div className="w-full max-w-10xl mx-auto p-6 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
              Vault Dashboard
            </h1>
            <p className="text-slate-400 text-sm md:text-lg">
              Discover and invest in Solana DeFi strategies
            </p>
          </div>

          {/* Search Bar */}
          {!isLoading && vaultCardsData.length > 0 && (
            <div className="mb-6">
              <Input
                type="text"
                placeholder="Search vaults by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-md bg-slate-800/50 border-slate-600/30 text-white placeholder:text-slate-500"
              />
            </div>
          )}

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
              {filteredVaults.length > 0 && 
                <div className="mb-12">            
                  {/* Vault Cards Grid - 3 columns on desktop, responsive */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVaults.map((vault, index) => (
                      <VaultCard
                        key={index}
                        vault={vault}
                        onViewDetails={handleViewVaultDetails}
                      />
                    ))}
                  </div>
                </div>
              }

              {/* No results state when search returns empty */}
              {filteredVaults.length === 0 && vaultCardsData.length > 0 && !error && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="p-4 bg-slate-800/50 rounded-full mb-4">
                    <DollarSign className="h-12 w-12 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No vaults found</h3>
                  <p className="text-slate-400 max-w-md">
                    No vaults match your search. Try a different search term.
                  </p>
                </div>
              )}

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