"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Ban, TrendingUp, TrendingDown, Plus, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getCloseVaultTx } from "@/lib/api/transaction";
import { useNotification } from "@/contexts/NotificationContext";

// Modals:
import { StrategyCreateModal } from "@/components/strategy/StrategyCreateModal";
import { StrategyJupiterModal } from "@/components/strategy/StrategyJupiterModal";
import { MeteoraDAMMModal } from "@/components/strategy/MeteoraDAMMModal";
import { deposit } from "@kamino-finance/klend-sdk"

interface VaultBalancesProps {
  depositData?: any;
  vaultData?: any;
  strategiesData?: any[];
  isLoading?: boolean;
}

function SkeletonRow() {
  return (
    <div className="flex items-center border-b border-gray-700/50 py-4">
      <div className="flex-1 flex items-center gap-3 px-6">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="flex-1 px-6">
        <Skeleton className="h-4 w-24 mb-1" />
        <Skeleton className="h-3 w-16" />
      </div>
      <div className="flex-1 px-6">
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="flex-1 px-6 text-right">
        <Skeleton className="h-4 w-20 ml-auto" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Ban className="h-12 w-12 text-slate-500 mb-3" />
      <h3 className="text-lg font-medium text-white mb-1">No Positions</h3>
      <p className="text-sm text-slate-400 max-w-xs">There are no active positions in this vault yet.</p>
    </div>
  );
}

export function VaultBalancesManager({ depositData, vaultData, strategiesData = [], isLoading = false }: VaultBalancesProps) {
    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();
    const { showNotification } = useNotification();
    const [totalValue, setTotalValue] = useState<number>(0);
    const [hasError, setHasError] = useState<boolean>(false);
  
    const isMobile = useIsMobile();
    const [estimatedYield, setEstimatedYield] = useState<number>(0);
  
    const [isCreateStrategy, setIsCreateStrategy] = useState<boolean>(false);
    const [isOpenJupiter, setIsOpenJupiter] = useState<string>("");
    const [isOpenDAMM, setIsOpenDAMM] = useState<string>("");
    const [openStrategyData, setOpenStrategyData] = useState<any>(null);
  
    const [positions, setPositions] = useState<any[]>([]);
  const [totals, setTotals] = useState({ capital: 0, pnl: 0, value: 0 });

  useEffect(() => {
    if (depositData || strategiesData.length > 0) {
      const allPositions = [];
      
      // Add deposit as first position
      if (depositData) {
        allPositions.push({
          name: depositData.tokenInfo?.symbol || "Deposit",
          icon: depositData.tokenInfo?.icon || "/PNG/usdc-logo.png",
          capital: depositData.capital || 0,
          value: depositData.value || 0,
          pnl: (depositData.value || 0) - (depositData.capital || 0),
        });
      }

      // Add all strategies
      strategiesData.forEach((strategy) => {
        allPositions.push({
          name: strategy.strategyName || strategy.strategyType || "Strategy",
          icon: strategy.icon || strategy.tokenInfo?.icon || "/PNG/usdc-logo.png",
          capital: strategy.capital || 0,
          value: strategy.value || 0,
          pnl: (strategy.value || 0) - (strategy.capital || 0),
        });
      });

      setPositions(allPositions);

      // Calculate totals
      const totalCapital = allPositions.reduce((sum, pos) => sum + pos.capital, 0);
      const totalValue = allPositions.reduce((sum, pos) => sum + pos.value, 0);
      const totalPnl = totalValue - totalCapital;

      setTotals({ capital: totalCapital, pnl: totalPnl, value: totalValue });
    }
  }, [depositData, strategiesData]);

  const formatValue = (value: number) => {
    return value.toFixed(3);
  };

  const isEmpty = !depositData && strategiesData.length === 0;
  const isClosable = vaultData && vaultData.userDeposits === 0 && (!vaultData.depositsInStrategies || vaultData.depositsInStrategies === 0);

  const handleCreateStrategy = (strategyType: string) => {
      console.log('Creating strategy:', strategyType);
      if (strategyType === "jupiterYieldToken") {
        handleOpenJupiter("newYield", null);
      }
      else if (strategyType === "jupiterSwap") {
        handleOpenJupiter("new", null);
      }
      else if (strategyType === "meteora-damm") {
        setIsOpenDAMM("add");
      }
      // TODO: Implement strategy creation logic
    };
  
    const handleOpenCreateModal = () => {
      setIsCreateStrategy(true);
    };
  
    const handleOpenJupiter = (action: string, strategyData: any) => {
      setIsOpenJupiter(action);
      setOpenStrategyData(strategyData);
    };
    const handleCloseJupiter = () => { setIsOpenJupiter(""); }
    const handleCloseDAMM = () => { setIsOpenDAMM(""); }
  
    const handleCloseCreateStrategy = () => {
      setIsCreateStrategy(false);
    };
  
    const handleOpenStrategy = (data: any) => {
      console.log('Opening strategy action:', data);
      if (data.strategyType === "jupiterSwap") {
        handleOpenJupiter(data.action, data.strategyData);
      }
    }
  
    const handleCloseVault = async () => {
        if (!vaultData) return;
        if (!publicKey || !sendTransaction) {
        alert("Please connect your wallet")
        return
        }
        if (publicKey.toBase58() !== vaultData.authority) {
        alert("Only the vault manager can close the vault.")
        return
        }
        const versionedTx = await getCloseVaultTx({
        authority: publicKey.toBase58(),
        vault: vaultData.publicKey,
        });
        const { blockhash } = await connection.getLatestBlockhash();
        versionedTx.message.recentBlockhash = blockhash;
        const txid = await sendTransaction(versionedTx, connection);
        await connection.confirmTransaction(txid);
        console.log("Transaction ID:", txid);

        showNotification({
        title: `Vault Closed!`,
        message: `Your vault has been closed successfully.`,
        txId: txid,
        type: "success"
        });

    }

  return (
    <>
    <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">Positions</h2>
        <div className="flex items-center">
            {isClosable && <Button
                variant="outline"
                onClick={handleCloseVault}
                className="text-xs text-gray-400 bg-slate-800/60 hover:bg-slate-700/60 mr-2 pt-2.5 pb-2 px-4"
            >
                <Trash className="h-4 w-4" />
                Close Vault
            </Button>}
            <Button
                variant="outline"
                onClick={handleOpenCreateModal}
                className="text-xs text-gray-400 bg-slate-800/60 hover:bg-slate-700/60 pt-2.5 pb-2 px-4"
            >
                <Plus className="h-4 w-4" />
                Add Strategy
            </Button>
        </div>
    </div>
    <Card className="rounded-xl bg-[#101018] border border-[#16161f] overflow-hidden py-0 gap-0">
      {/* Table Header */}
      <div className="flex items-center border-b border-[#16161f] py-4 bg-[#0d0d14]">
        <div className="flex-1 px-6">
          <span className="text-xs font-semibold text-gray-400">Active Position</span>
        </div>
        <div className="flex-1 px-6">
          <span className="text-xs font-semibold text-gray-400">Deposited Capital</span>
        </div>
        <div className="flex-1 px-6">
          <span className="text-xs font-semibold text-gray-400">Position Value</span>
        </div>
        <div className="flex-1 px-6 text-center">
          <span className="text-xs font-semibold text-gray-400">Manage Position</span>
        </div>
      </div>

      {/* Table Body */}
      {isLoading ? (
        <>
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </>
      ) : isEmpty ? (
        <EmptyState />
      ) : (
        <>
          {/* Main Deposit */}
          {depositData && (
            <PositionRow
              icon={depositData.tokenInfo.icon}
              name={depositData.tokenInfo.symbol}
              capitalValue={depositData.balance * depositData.tokenInfo.usdPrice}
              capitalAmount={depositData.balance}
              capitalSymbol="USDC"
              pnl={0.00}
              positionValue={depositData.balance * depositData.tokenInfo.usdPrice}
              isDeposit={true}
              strategyData={depositData}
              handleOpenStrategy={handleOpenStrategy}
            />
          )}
          
          {depositData && strategiesData && strategiesData.map((position, idx) => (
            <PositionRow
              key={idx}
              icon={position.tokenInfo.icon}
              name={position.tokenInfo.symbol}
              capitalValue={position.initialCapital * depositData.tokenInfo.usdPrice}
              capitalAmount={position.initialCapital}
              capitalSymbol={depositData.tokenInfo.symbol}
              pnl={position.value - position.initialCapital}
              positionValue={position.value}
              strategyData={position}
              handleOpenStrategy={handleOpenStrategy}
            />
          ))}

          {/* Total Row */}
          <div className="flex items-center py-4 bg-[#0d0d14]">
            <div className="flex-1 px-6">
              <span className="text-white font-semibold text-sm">Total</span>
            </div>
            <div className="flex-1 px-6">
            </div>
            <div className="flex-1 px-6">
              <span className="text-white font-semibold text-sm">${formatValue(totals.value)}</span>
            </div>
            <div className="flex-1 px-6">
            </div>
          </div>
        </>
      )}
    </Card>
    {/* Strategy Modals */}
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
        vaultData={vaultData}
    />
    <MeteoraDAMMModal
        action={isOpenDAMM as "add" | "reduce" | "new"}
        isOpen={isOpenDAMM === "add" || isOpenDAMM === "reduce"}
        onClose={handleCloseDAMM}
    />
    </>
  );
}

interface PositionRowProps {
  icon: string;
  name: string;
  capitalValue: number;
  capitalAmount: number;
  capitalSymbol: string;
  pnl: number;
  positionValue: number;
  isDeposit?: boolean;
  strategyData: any;
  handleOpenStrategy: (data: any) => void;
}

function PositionRow({ icon, name, capitalValue, capitalAmount, capitalSymbol, pnl, positionValue, isDeposit=false, strategyData, handleOpenStrategy}: PositionRowProps) {
    const formatValue = (value: number) => value.toFixed(2);
    const isProfit = pnl >= 0;
    const pnlPercent = capitalValue > 0 ? (pnl / capitalValue) * 100 : 0;

    const handleAddPosition = () => {
        handleOpenStrategy({
            strategyType: strategyData.strategyType,
            tokenMint: strategyData.targetMint,
            action: "add",
            strategyData: strategyData
        })
    }
    const handleReducePosition = () => {
        handleOpenStrategy({
            strategyType: strategyData.strategyType,
            tokenMint: strategyData.targetMint,
            action: "reduce",
            strategyData: strategyData
        })
    }

    return (
    <div className="flex items-center py-4 border-b border-[#16161f] hover:bg-[#1a1a2e] transition-colors">
        <div className="flex-1 flex items-center gap-3 px-6">
            <img 
            src={icon} 
            alt={name} 
            className="w-6 h-6 rounded-full"
            />
            <span className="text-white font-medium text-sm">{name}</span>
        </div>
        <div className="flex-1 px-6">
            <div className="text-white font-medium text-sm">${formatValue(capitalValue)}</div>
            <div className="text-slate-400 text-xs">{formatValue(capitalAmount)} {capitalSymbol}</div>
        </div>
        <div className="flex-1 px-6">
            <span className="text-sm font-bold text-[#ffffff] tabular-nums mr-2">${formatValue(positionValue)}</span>
            <span className={`text-xs tabular-nums ${isProfit ? "text-[#10b981]" : "text-[#ef4444]"}`}>
                ({isProfit ? "+" : ""}{pnlPercent.toFixed(2)}%)
            </span>
        </div>
        <div className="flex-1 px-6 text-center gap-3 w-[100px]">
            <>
            <Button
                size="sm"
                disabled={strategyData.strategyType === "deposit"}
                onClick={handleAddPosition}
                className="text-xs bg-slate-800/60 hover:bg-slate-700/60 mr-2"
            >
                Add
            </Button> 
            <Button 
                size="sm"
                disabled={strategyData.strategyType === "deposit"}
                onClick={handleReducePosition}
                className={`text-xs bg-slate-800/60 hover:bg-slate-700/60`}
            >
                Reduce
            </Button>
            </>
        </div>
    </div>
    );
}