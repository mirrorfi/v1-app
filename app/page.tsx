"use client";
import { Navbar } from '@/components/Navbar';
import { useEffect, useState } from "react";
import { getAllVaults } from '@/lib/api/vault';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TrendingUp, DollarSign, Users, ArrowRight } from "lucide-react";
import { formatNumber } from "@/lib/display";
import { useRouter } from "next/navigation";

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

  const getVaultName = (vault: VaultData) => {
    // Generate a name based on vault properties
    let name = "Vault";
    if (vault.is_kamino && vault.is_meteora) {
      name = "Kamino-Meteora Vault";
    } else if (vault.is_kamino) {
      name = "Kamino Vault";
    } else if (vault.is_meteora) {
      name = "Meteora Vault";
    }
    return name;
  };

  const getVaultStrategy = (vault: VaultData) => {
    const strategies = [];
    if (vault.is_kamino) strategies.push("Kamino");
    if (vault.is_meteora) strategies.push("Meteora");
    return strategies.length > 0 ? strategies.join(" + ") + " Strategy" : "Multi-Strategy";
  };

  const getVaultStatus = (vault: VaultData) => {
    if (vault.is_closed) return { label: "Closed", color: "bg-red-500/20 text-red-400 border-red-500/30" };
    if (vault.is_frozen) return { label: "Frozen", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" };
    if (!vault.is_initialized) return { label: "Initializing", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" };
    return { label: "Active", color: "bg-green-500/20 text-green-400 border-green-500/30" };
  };

  const getRiskColor = (risk?: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'High': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const VaultCard = ({ vault }: { vault: VaultData }) => {
    const vaultName = getVaultName(vault);
    const vaultStrategy = getVaultStrategy(vault);
    const vaultStatus = getVaultStatus(vault);
    const netDeposits = vault.total_deposit - vault.total_withdrawal;

    return (
      <Card 
        className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-700/30 backdrop-blur-sm rounded-lg shadow-lg hover:bg-blue-900/30 transition-all duration-200 cursor-pointer group"
        onClick={() => handleVaultClick(vault.pubkey)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 bg-gradient-to-br from-pink-500 to-rose-400">
                <AvatarFallback className="text-white font-bold">
                  {vaultName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-white text-lg group-hover:text-blue-300 transition-colors">
                  {vaultName}
                </CardTitle>
                <p className="text-slate-400 text-sm">
                  {vaultStrategy}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={vaultStatus.color}>
                {vaultStatus.label}
              </Badge>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-300 transition-colors" />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0F1218] p-3 rounded-lg border border-[#2D3748]/30">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="h-4 w-4 text-green-400" />
                <span className="text-slate-400 text-xs">Net Deposits</span>
              </div>
              <div className="text-white font-semibold text-lg">
                {formatNumber(netDeposits / Math.pow(10, vault.deposit_token_decimals))}
              </div>
            </div>
            
            <div className="bg-[#0F1218] p-3 rounded-lg border border-[#2D3748]/30">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-blue-400" />
                <span className="text-slate-400 text-xs">Version</span>
              </div>
              <div className="text-emerald-400 font-semibold text-lg">
                v{vault.version}
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-slate-400">
              <Users className="h-4 w-4" />
              <span>Decimals: {vault.deposit_token_decimals}</span>
            </div>
            <div className="text-slate-400">
              Fees: {formatNumber(vault.total_claimed_protocol_fee / Math.pow(10, vault.deposit_token_decimals))}
            </div>
          </div>

          {/* Vault Address */}
          <div className="bg-[#0F1218] p-2 rounded border border-[#2D3748]/30">
            <p className="text-slate-400 text-xs mb-1">Vault Address</p>
            <p className="text-slate-300 text-xs font-mono break-all">
              {vault.pubkey}
            </p>
          </div>
        </CardContent>
      </Card>
    );
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
              Discover and invest in high-yield DeFi strategies
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
                        {formatNumber(
                          vaults.reduce((sum, vault) => {
                            const netDeposits = (vault.total_deposit - vault.total_withdrawal) / Math.pow(10, vault.deposit_token_decimals);
                            return sum + netDeposits;
                          }, 0)
                        )}
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
                        {vaults.filter(v => v.is_initialized && !v.is_closed).length}
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
                <VaultCard key={vault.pubkey || `vault-${index}`} vault={vault} />
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