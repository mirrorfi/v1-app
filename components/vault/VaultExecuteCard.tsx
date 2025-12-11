import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useNotification } from "@/contexts/NotificationContext"
import { getDepositVaultTx, getWithdrawVaultTx } from "@/lib/api"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { formatNumber, formatAddress } from "@/lib/display"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowUpRight } from "lucide-react"
import { logActivity, LogActivityParams } from '@/lib/utils/activity-logger';

export function VaultExecuteCard({ vault, vaultData, depositData, positionBalance, sharePrice, handleReload, tokenPrice, tokenBalance }: { vault: string, vaultData: any, depositData: any, positionBalance: number, sharePrice: number, handleReload: () => void, tokenPrice: number, tokenBalance: number }) {
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeAction, setActiveAction] = useState<"deposit" | "withdraw">("deposit")

  const router = useRouter();
  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection();
  const { showNotification } = useNotification()

  // Check if current user has managing authority
  const hasManagingAuthority = publicKey && vaultData && publicKey.toString() === vaultData.authority;
  const handleManageVault = () => {
    router.push(`/vault/${vault}/manager`);
  }

  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value)
    }
  }

  const handlePercent = (percent: number) => {
    let amount = 0;
    if (activeAction === "deposit") {
      amount = tokenBalance; // For deposit, use wallet balance
    } else {
      amount = positionBalance * sharePrice;
      console.log("User Maximum Withdraw Amount (USDC):", amount);
    }

    const computed = Math.floor(amount * percent * 10**depositData.tokenInfo.decimals) / 10**depositData.tokenInfo.decimals;
    setAmount(computed.toString())
  }

  const usdValue = amount ? (Number.parseFloat(amount) * tokenPrice).toFixed(2) : "0"

  const handleConfirm = async () => {
    console.log("Confirming Action")
    if (!amount || Number.parseFloat(amount) <= 0) return;
    if (!depositData) return;
    if (!publicKey || !sendTransaction) {
      alert("Please connect your wallet")
      return
    }

    if (activeAction === "deposit" && Number.parseFloat(amount) > vaultData.depositCap / 10 ** depositData.tokenInfo.decimals) {
      showNotification({
        title: "Deposit Failed",
        message: `Deposit amount exceeds deposit cap.`,
        type: "error"
      });
      return
    }

    setIsLoading(true)
    try {
      let res;
      // Fetch Transaction Details from API
      if (activeAction === "deposit") {
        res = await getDepositVaultTx({
          amount: Math.floor(Number.parseFloat(amount) * 10 ** depositData.tokenInfo.decimals).toString(),
          depositor: publicKey.toString(),
          vault,
        })
      } else {
        let withdrawAmount = Math.floor(Number.parseFloat(amount) / sharePrice * 10 ** depositData.tokenInfo.decimals).toString();
        // Precision Fix during Withdraw All
        if (Number(withdrawAmount) * 1.00001 > positionBalance * 10 ** depositData.tokenInfo.decimals) {
          withdrawAmount = (positionBalance * 10 ** depositData.tokenInfo.decimals).toString();
        }
        console.log("Withdraw Amount (in shares):", withdrawAmount);
        res = await getWithdrawVaultTx({
          amount: withdrawAmount,
          withdrawer: publicKey.toString(),
          vault,
        })
      }
      const versionedTx = res;
      // Prompt user to sign and send transaction
      const { blockhash } = await connection.getLatestBlockhash();
      versionedTx.message.recentBlockhash = blockhash;
      const txid = await sendTransaction(versionedTx, connection);
      await connection.confirmTransaction(txid);
      console.log("Transaction ID:", txid);

      // Show success notification
      showNotification({
        title: `${activeAction === "deposit" ? "Deposit" : "Withdrawal"} Successful`,
        message: `Your ${activeAction} of ${amount} ${depositData.tokenInfo.symbol} has been processed successfully.`,
        txId: txid,
        type: "success"
      });

      await logActivity({
        wallet: publicKey.toString(),
        activity: activeAction,
        vault: vault,
        token: depositData.tokenInfo.symbol,
        amount: activeAction === "deposit" ? (Number.parseFloat(amount) * 10 ** depositData.tokenInfo.decimals).toString() : (positionBalance * 10 ** depositData.tokenInfo.decimals).toString(),
        amountInUsd: Number.parseFloat(usdValue).toString(),
        txHash: txid,
      })

      handleReload();
    } catch (error) {
      // Show error notification
      showNotification({
        title: `${activeAction === "deposit" ? "Deposit" : "Withdrawal"} Failed`,
        message: `There was an error processing your ${activeAction}. Please try again.`,
        type: "error"
      });
      console.error("Error during transaction processing:", error);
    }
    setIsLoading(false)
    setAmount("")
  }

  return (
    <>
      {/* Management Authority Label - Right side */}
      {hasManagingAuthority && (
        <div className="bg-orange-600/20 border border-orange-500/30 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-orange-400 text-sm font-medium whitespace-nowrap">
              You have managing authority to this vault
            </span>
            <Button
              onClick={handleManageVault}
              size="sm"
              className="bg-orange-600 hover:bg-orange-700 text-white text-sm px-3 py-1 h-8"
            >
              Open <ArrowUpRight />
            </Button>
          </div>
        </div>
      )}
      <Card className="bg-[#101018] border border-[#16161f] rounded-xl py-0">
        {/* Deposit/Withdraw Toggle - Top Section */}
        <div className="flex w-full">
          <button
            onClick={() => setActiveAction("deposit")}
            className={`flex-1 py-4 text-xl font-semibold transition-all relative ${
              activeAction === "deposit"
                ? "text-white bg-[#101018] border-b-2 border-blue-500"
                : "text-gray-500 bg-[#05050a] border-b-2 border-[#16161f]"
            }`}
          >
            Deposit
          </button>
          <button
            onClick={() => setActiveAction("withdraw")}
            className={`flex-1 py-4 text-xl font-semibold transition-all relative ${
              activeAction === "withdraw"
                ? "text-white bg-[#101018] border-b-2 border-blue-500"
                : "text-gray-500 bg-[#05050a] border-b-2 border-[#16161f]"
            }`}
          >
            Withdraw
          </button>
        </div>

        <CardContent className="space-y-4 pb-6">
          {/*<div className="inline-flex items-center px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-full border border-blue-500/30">
            {/*Lending
          </div>*/}

          {/* Max Deposit Label */}
          {vaultData && false && <div className="mt-3 bg-amber-500/20 border-2 border-amber-500/50 rounded-lg p-3">
            <div className="text-amber-300 font-semibold text-sm">
              ⚠️ Max Deposit: {Number(vaultData.depositCap) / 10 ** depositData.tokenInfo.decimals} {depositData?.tokenInfo.symbol || ""}
            </div>
            <div className="text-amber-200/50 text-xs mt-1 font-normal">
              This app is currently in beta
            </div>
          </div>}
          <div className="space-y-5">
            <div className="bg-[#0d0d14] rounded-lg border border-[#16161f] p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img src={depositData ? depositData.tokenInfo.icon : `/PNG/usdc-logo.png`} alt="Deposit Mint Logo" className="w-8 h-8 rounded-full" />
                  <div>
                    <div className="text-white font-medium">{depositData ? depositData.tokenInfo.symbol : ""}</div>
                    <div className="text-slate-400 text-sm">
                      Balance: {activeAction === "deposit" 
                        ? formatNumber(tokenBalance, 2)
                        : formatNumber(positionBalance * sharePrice, 2)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePercent(0.25)}
                    className="h-6 px-1.5 text-xs bg-[#1a1a2e] border-[#16161f] text-gray-300 hover:bg-[#2a2a3e] hover:text-white"
                  >
                    25%
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePercent(0.5)}
                    className="h-6 px-1.5 text-xs bg-[#1a1a2e] border-[#16161f] text-gray-300 hover:bg-[#2a2a3e] hover:text-white"
                  >
                    50%
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePercent(1)}
                    className="h-6 px-1.5 text-xs bg-[#1a1a2e] border-[#16161f] text-gray-300 hover:bg-[#2a2a3e] hover:text-white"
                  >
                    100%
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between relative">
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="0.0"
                  className="bg-transparent text-white text-lg font-medium outline-none flex-1 relative z-10 pointer-events-auto"
                />
                <span className="text-gray-400 text-sm ml-2">${formatNumber(Number(usdValue), 2)}</span>
              </div>
            </div>

            <Button
              onClick={handleConfirm}
              disabled={!amount || Number.parseFloat(amount) <= 0 || isLoading}
              className="w-full text-white font-semibold text-xl py-6 disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? "Processing..." : activeAction === "deposit" ? "Deposit" : "Withdraw"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export function VaultDashboardExecuteCardSkeleton() {
  return <>
    <Card className="bg-[#101018] border border-[#16161f] rounded-xl py-0">
      <div className="flex w-full border-b border-[#16161f]">
        <Skeleton className="h-14 flex-1" />
        <Skeleton className="h-14 flex-1" />
      </div>
      <CardContent className="space-y-4 pb-6">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-12 w-full" />
      </CardContent>
    </Card>
  </>
}