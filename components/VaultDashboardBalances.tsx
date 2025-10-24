"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, ArrowUpCircle, ArrowDownCircle, CircleDollarSign, ChevronDown, ChevronRight, AlertCircle, Ban, Plus, Minus, TrendingUp, Target, DollarSign } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Skeleton } from "@/components/ui/skeleton"
import { StrategyCard } from "@/components/StrategyCard";
import { StrategyCardManager } from "@/components/StrategyCardManager";
import { StrategyCreateModal } from "@/components/StrategyCreateModal";
import { StrategyJupiterModal } from "@/components/StrategyJupiterModal"
import { useRouter } from "next/navigation";

interface VaultDashboardBalancesProps {
  depositData: any;
  strategiesData: any[];
  isLoading: boolean;
  isManager?: boolean;
  vaultData?: any;
}

// Skeleton loading components
function SkeletonCategorySummary() {
  return (
    <div className="grid grid-cols-3 gap-2 mb-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-[#0F1218] p-2 rounded-lg border border-[#2D3748]/30">
          <Skeleton className="h-3 w-16 mb-1" />
          <Skeleton className="h-4 w-12" />
        </div>
      ))}
    </div>
  );
}

function SkeletonSummaryRow() {
  return (
    <div className="flex items-center justify-between text-sm bg-blue-900/30 p-2 rounded-md mb-3">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-3 w-12" />
      <Skeleton className="h-4 w-14" />
    </div>
  );
}

function SkeletonCategorySection() {
  return (
    <div className="bg-[#111827]/50 rounded-lg border border-blue-900/30 overflow-hidden mb-3">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4" />
        </div>
      </div>
      <div className="px-3 pb-3">
        <div className="space-y-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between text-xs bg-[#0F1218] rounded p-2 border border-[#2D3748]/30">
              <div className="flex items-center gap-2 w-[50%]">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-3 w-14" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// KPI Card component
function KPICard({ title, value, icon: Icon, color = "blue" }: { 
  title: string; 
  value: string; 
  icon: any; 
  color?: "blue" | "green" | "purple" 
}) {
  const colorClasses = {
    blue: "from-blue-900/20 to-blue-800/10 border-blue-700/30 text-blue-400",
    green: "from-green-900/20 to-green-800/10 border-green-700/30 text-green-400", 
    purple: "from-purple-900/20 to-purple-800/10 border-purple-700/30 text-purple-400"
  };

  return (
    <Card className={`bg-gradient-to-br ${colorClasses[color].split(' ').slice(0, 2).join(' ')} border ${colorClasses[color].split(' ')[2]} backdrop-blur-sm rounded-lg shadow-lg transition-all duration-200 hover:scale-105`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <p className="text-slate-400 text-sm font-medium">{title}</p>
            <p className="text-white text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className={`p-3 rounded-full bg-white/10 ${colorClasses[color].split(' ')[3]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Error and empty state components
function ErrorState() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <AlertCircle className="h-12 w-12 text-red-500 mb-3" />
      <h3 className="text-lg font-medium text-white mb-1">Failed to load balance data</h3>
      <p className="text-sm text-slate-400 max-w-xs">There was an issue loading your balance information. Please try again later.</p>
    </div>
  );
}

function EmptyState({vault}: {vault?: string}) {
  const router = useRouter();
  const openDepositPage = () => {
    router.push(`/vault/${vault}`);
  }
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <Ban className="h-12 w-12 text-slate-500 mb-3" />
      <h3 className="text-lg font-medium text-white mb-1">No balance data available</h3>
      <p className="text-sm text-slate-400 max-w-xs">There are no active positions in this vault. Create a position or deposit to vault to see balance data.</p>
      {vault &&
      <Button onClick={openDepositPage} variant="outline" className="mt-4 bg-transparent border-slate-600/30 text-slate-300 hover:bg-white/10 hover:text-white hover:border-slate-400 font-medium px-4 py-2 rounded-lg transition-all duration-200 shadow-lg backdrop-blur-sm">
        Deposit to Vault
      </Button>}
    </div>
  );
}

export function VaultDashboardBalances({ depositData, strategiesData, isLoading, isManager=false, vaultData }: VaultDashboardBalancesProps) {
  const [totalValue, setTotalValue] = useState<number>(0);
  const [hasError, setHasError] = useState<boolean>(false);

  const isEmpty = depositData && depositData.balance == 0;
  const [estimatedYield, setEstimatedYield] = useState<number>(0);

  const [isCreateStrategy, setIsCreateStrategy] = useState<boolean>(false);
  const [isOpenJupiter, setIsOpenJupiter] = useState<string>("");
  const [openStrategyData, setOpenStrategyData] = useState<any>(null);

  useEffect(() => {
    if (depositData && strategiesData) {
      let total = depositData.value || 0;
      strategiesData.forEach(strategy => {
        total += strategy.value || 0;
      });
      setTotalValue(total);
    }
  }, [depositData, strategiesData]);

  const handleCreateStrategy = (strategyType: string) => {
    console.log('Creating strategy:', strategyType);
    if (strategyType === "jupiterYieldToken") {
      handleOpenJupiter("newYield", null);
    }
    else if (strategyType === "jupiterSwap") {
      handleOpenJupiter("new", null);
    }
    // TODO: Implement strategy creation logic
  };

  const handleOpenCreateModal = () => {
    setIsCreateStrategy(true);
  };

  const handleOpenJupiter = (action:string, strategyData:any) => {
    setIsOpenJupiter(action);
    setOpenStrategyData(strategyData);
  };
  const handleCloseJupiter = () => {setIsOpenJupiter("");}

  const handleCloseCreateStrategy = () => {
    setIsCreateStrategy(false);
  };

  const handleOpenStrategy = (data: any) => {
    console.log('Opening strategy action:', data);
    if (data.strategyType === "jupiterSwap") {
      handleOpenJupiter(data.action, data.strategyData);
    }
  }

  return (
    <Card className="z--50 bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-700/30 backdrop-blur-sm rounded-lg shadow-lg transition-all duration-200">
      {/*<CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Wallet className="h-5 w-5 text-blue-400" />
          Strategy Positions
        </CardTitle>
      </CardHeader>*/}
      <CardContent className="space-y-4 pb-4">
        {isLoading ? (
          /* Loading State */
          <>
            <SkeletonCategorySummary />
            <SkeletonSummaryRow />
            <SkeletonCategorySection />
            <SkeletonCategorySection />
          </>
        ) : hasError ? (
          /* Error State */
          <ErrorState />
        ) : isEmpty ? (
          /* Empty State */
          <EmptyState vault={vaultData ? vaultData.publicKey : null} />
        ) : (
          /* Data Loaded State */
          <>
          {/* KPI Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <KPICard 
              title="Total NAV" 
              value={`$${totalValue.toFixed(2)}`} 
              icon={DollarSign} 
              color="blue" 
            />
            <KPICard 
              title="Total Strategies" 
              value={strategiesData.length.toString()} 
              icon={Target} 
              color="purple" 
            />
            <KPICard 
              title="Estimated Yield" 
              value={`${estimatedYield.toFixed(2)}%`} 
              icon={TrendingUp} 
              color="green" 
            />
          </div>
          
          {/* Add New Strategy Button - Only for Managers */}
          {isManager && (
            <div className="flex justify-end mb-4">
              <Button 
                variant="outline" 
                onClick={handleOpenCreateModal}
                className="bg-transparent border-slate-600/30 text-slate-300 hover:bg-white/10 hover:text-white hover:border-slate-400 font-medium px-4 py-2 rounded-lg transition-all duration-200 shadow-lg backdrop-blur-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Strategy
              </Button>
            </div>
          )}
          
          {/* Strategy Cards */}
          <div className="space-y-4">
            {depositData && (
              <div>
              {isManager ? 
                <StrategyCardManager strategyData={depositData} handleOpenStrategy={handleOpenStrategy} />
               : (
                <StrategyCard strategyData={depositData} />
              )}
              </div>
            )}
            {strategiesData.map((strategy, idx) => (
              <div key={`strategy-${idx}`}>
                {isManager ? (
                  <StrategyCardManager key={`strategy-${idx}`} strategyData={strategy} handleOpenStrategy={handleOpenStrategy} />
                ) : (
                  <StrategyCard key={`strategy-${idx}`} strategyData={strategy} />
                )}
              </div>
            ))}
          </div>
          </>
        )}
      </CardContent>

      {/* Strategy Create Modal */}
      <StrategyCreateModal
        isOpen={isCreateStrategy}
        onClose={handleCloseCreateStrategy}
        onCreateStrategy={handleCreateStrategy}
      />
      <StrategyJupiterModal
        isOpen={isOpenJupiter === "add" || isOpenJupiter === "reduce" || isOpenJupiter === "new" || isOpenJupiter === "newYield"}
        action={isOpenJupiter}
        onClose={handleCloseJupiter}
        strategyData={openStrategyData}
        depositData={depositData} 
      />
    </Card>
  )
}