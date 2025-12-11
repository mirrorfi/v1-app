"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useNotification } from "@/contexts/NotificationContext"
import { getDepositVaultTx, getWithdrawVaultTx } from "@/lib/api"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { formatNumber, formatAddress } from "@/lib/display"
import { X, ArrowUpRight } from "lucide-react"
import { logActivity } from '@/lib/utils/activity-logger'
import { useRouter } from "next/navigation"

interface MobileVaultExecuteCardProps {
  vault: string
  vaultData: any
  depositData: any
  positionBalance: number
  sharePrice: number
  handleReload: () => void
  tokenBalance: number
  tokenPrice: number
  initialMode?: "deposit" | "withdraw"
  onClose: () => void
}

export function MobileVaultExecuteCard({ 
  vault, 
  vaultData, 
  depositData, 
  positionBalance, 
  sharePrice, 
  handleReload, 
  tokenBalance, 
  tokenPrice, 
  initialMode = "deposit",
  onClose 
}: MobileVaultExecuteCardProps) {
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeAction, setActiveAction] = useState<"deposit" | "withdraw">(initialMode)

  const router = useRouter()
  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()
  const { showNotification } = useNotification()

  // Check if current user has managing authority
  const hasManagingAuthority = publicKey && vaultData && publicKey.toString() === vaultData.authority
  const handleManageVault = () => {
    router.push(`/vault/${vault}/manager`)
  }

  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value)
    }
  }

  const handlePercent = (percent: number) => {
    let amount = 0
    if (activeAction === "deposit") {
      amount = tokenBalance // For deposit, use wallet balance
    } else {
      amount = positionBalance * sharePrice
      console.log("User Maximum Withdraw Amount (USDC):", amount)
    }

    const computed = Math.floor(amount * percent * 10**depositData.tokenInfo.decimals) / 10**depositData.tokenInfo.decimals
    setAmount(computed.toString())
  }

  const usdValue = amount ? (Number.parseFloat(amount) * tokenPrice).toFixed(2) : "0"

  const handleConfirm = async () => {
    console.log("Confirming Action")
    if (!amount || Number.parseFloat(amount) <= 0) return
    if (!depositData) return
    if (!publicKey || !sendTransaction) {
      alert("Please connect your wallet")
      return
    }

    if (activeAction === "deposit" && Number.parseFloat(amount) > vaultData.depositCap / 10 ** depositData.tokenInfo.decimals) {
      showNotification({
        title: "Deposit Failed",
        message: `Deposit amount exceeds deposit cap.`,
        type: "error"
      })
      return
    }

    setIsLoading(true)
    try {
      let res
      // Fetch Transaction Details from API
      if (activeAction === "deposit") {
        res = await getDepositVaultTx({
          amount: Math.floor(Number.parseFloat(amount) * 10 ** depositData.tokenInfo.decimals).toString(),
          depositor: publicKey.toString(),
          vault,
        })
      } else {
        let withdrawAmount = Math.floor(Number.parseFloat(amount) / sharePrice * 10 ** depositData.tokenInfo.decimals).toString()
        // Precision Fix during Withdraw All
        if (Number(withdrawAmount) * 1.00001 > positionBalance * 10 ** depositData.tokenInfo.decimals) {
          withdrawAmount = (positionBalance * 10 ** depositData.tokenInfo.decimals).toString()
        }
        console.log("Withdraw Amount (in shares):", withdrawAmount)
        res = await getWithdrawVaultTx({
          amount: withdrawAmount,
          withdrawer: publicKey.toString(),
          vault,
        })
      }
      const versionedTx = res
      // Prompt user to sign and send transaction
      const { blockhash } = await connection.getLatestBlockhash()
      versionedTx.message.recentBlockhash = blockhash
      const txid = await sendTransaction(versionedTx, connection)
      await connection.confirmTransaction(txid)
      console.log("Transaction ID:", txid)

      // Show success notification
      showNotification({
        title: `${activeAction === "deposit" ? "Deposit" : "Withdrawal"} Successful`,
        message: `Your ${activeAction} of ${amount} ${depositData.tokenInfo.symbol} has been processed successfully.`,
        txId: txid,
        type: "success"
      })

      await logActivity({
        wallet: publicKey.toString(),
        activity: activeAction,
        vault: vault,
        token: depositData.tokenInfo.symbol,
        amount: activeAction === "deposit" ? (Number.parseFloat(amount) * 10 ** depositData.tokenInfo.decimals).toString() : (positionBalance * 10 ** depositData.tokenInfo.decimals).toString(),
        amountInUsd: Number.parseFloat(usdValue).toString(),
        txHash: txid,
      })

      handleReload()
      onClose() // Close the modal after successful transaction
    } catch (error) {
      // Show error notification
      showNotification({
        title: `${activeAction === "deposit" ? "Deposit" : "Withdrawal"} Failed`,
        message: `There was an error processing your ${activeAction}. Please try again.`,
        type: "error"
      })
      console.error("Error during transaction processing:", error)
    }
    setIsLoading(false)
    setAmount("")
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
      {/* Modal Container */}
      <div className="bg-[#101018] w-full sm:max-w-md sm:rounded-xl rounded-t-2xl min-h-[75vh] max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header with Close Button */}
        <div className="sticky top-0 bg-[#101018] p-5 flex justify-end z-10">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:bg-slate-800/50 p-2 h-auto"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 space-y-6 flex-1">
          {/* Management Authority Banner */}
          {hasManagingAuthority && (
            <div className="bg-orange-600/20 border border-orange-500/30 rounded-lg p-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-orange-400 text-xs font-medium">
                  You have managing authority
                </span>
                <Button
                  onClick={handleManageVault}
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-2 py-1 h-7"
                >
                  Open <ArrowUpRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}

          {/* Deposit/Withdraw Toggle */}
          <div className="flex rounded-lg overflow-hidden border border-[#16161f]">
            <button
              onClick={() => setActiveAction("deposit")}
              className={`flex-1 py-4 text-base font-semibold transition-all ${
                activeAction === "deposit"
                  ? "bg-blue-600 text-white"
                  : "bg-[#0d0d14] text-gray-400"
              }`}
            >
              Deposit
            </button>
            <button
              onClick={() => setActiveAction("withdraw")}
              className={`flex-1 py-4 text-base font-semibold transition-all ${
                activeAction === "withdraw"
                  ? "bg-blue-600 text-white"
                  : "bg-[#0d0d14] text-gray-400"
              }`}
            >
              Withdraw
            </button>
          </div>

          {/* Amount Input */}
          <div className="bg-[#0d0d14] rounded-lg border border-[#16161f] p-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <img 
                  src={depositData ? depositData.tokenInfo.icon : `/PNG/usdc-logo.png`} 
                  alt="Token Logo" 
                  className="w-7 h-7 rounded-full" 
                />
                <div>
                  <div className="text-white font-medium text-sm">
                    {depositData ? depositData.tokenInfo.symbol : ""}
                  </div>
                  <div className="text-slate-400 text-xs">
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

            <div className="flex items-center justify-between pt-2">
              <input
                type="text"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0.0"
                className="bg-transparent text-white text-xl font-bold outline-none flex-1"
              />
              <span className="text-gray-400 text-base ml-2">${formatNumber(Number(usdValue), 2)}</span>
            </div>
          </div>

          {/* Confirm Button */}
          <Button
            onClick={handleConfirm}
            disabled={!amount || Number.parseFloat(amount) <= 0 || isLoading}
            className="w-full text-white font-semibold text-lg py-7 disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg"
          >
            {isLoading ? "Processing..." : activeAction === "deposit" ? "Confirm Deposit" : "Confirm Withdraw"}
          </Button>
        </div>
      </div>
    </div>
  )
}
