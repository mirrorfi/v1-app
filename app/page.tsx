"use client";
import { Navbar } from '@/components/Navbar';
import { useEffect, useState } from "react";
import { getAllVaults } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TrendingUp, DollarSign, Users, ArrowRight } from "lucide-react";
import { formatNumber } from "@/lib/display";
import { useRouter } from "next/navigation";
import { VaultCard } from "@/components/VaultCard";

interface VaultData {
  pubkey: string;
  is_initialized: boolean;
  is_closed: boolean;
  is_frozen: boolean;
  version: number;
  bump: number;
  is_kamino: boolean;
  is_meteora: boolean;
  lookup_table: string;
  manager: string;
  deposit_token_mint: string;
  deposit_token_decimals: number;
  share_token_mint: string;
  total_deposit: number;
  total_withdrawal: number;
  total_claimed_protocol_fee: number;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [vaults, setVaults] = useState<VaultData[]>([]);
  const router = useRouter();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const vaultData = await getAllVaults();
        console.log(vaultData);
        setVaults(vaultData || []);
      } catch (error) {
        console.error("Error fetching vaults:", error);
        setVaults([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleVaultClick = (vaultPubkey: string) => {
    router.push(`/vault/${vaultPubkey}`);
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
      <Navbar />
      <main className="flex-1 w-full">
        <div className="w-full max-w-7xl mx-auto p-6 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Vault Dashboard
            </h1>
            <p className="text-slate-400 text-lg">
              Discover and invest in Solana DeFi strategies
            </p>
          </div>

          {/* Stats Overview */}
          {!isLoading && vaults.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="bg-gradient-to-br from-green-900/20 to-green-800/10 border-green-700/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <DollarSign className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Total Net Deposits</p>
                      <p className="text-white font-semibold text-xl">
                        {/*formatNumber(
                          vaults.reduce((sum, vault) => {
                            const netDeposits = (vault.total_deposit - vault.total_withdrawal) / Math.pow(10, vault.deposit_token_decimals);
                            return sum + netDeposits;
                          }, 0)
                        )*/} 0
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-700/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Active Vaults</p>
                      <p className="text-white font-semibold text-xl">
                        {/*vaults.filter(v => v.is_initialized && !v.is_closed).length*/}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-700/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Users className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Total Vaults</p>
                      <p className="text-white font-semibold text-xl">
                        {vaults.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Vaults Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 6 }).map((_, index) => (
                <LoadingSkeleton key={index} />
              ))
            ) : vaults.length > 0 ? (
              // Vault cards
              vaults.map((vault, index) => (
                <div key={vault.pubkey || `vault-${index}`}>
                  {JSON.stringify(vault)}
                  {/*<VaultCard key={vault.pubkey || `vault-${index}`} vault={vault} onClick={handleVaultClick} />*/}
                </div>
              ))
            ) : (
              // Empty state
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                <div className="p-4 bg-slate-800/50 rounded-full mb-4">
                  <DollarSign className="h-12 w-12 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Vaults Available</h3>
                <p className="text-slate-400 max-w-md">
                  There are currently no vaults available. Please check back later or contact support.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}