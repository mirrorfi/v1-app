import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useNotification } from "@/contexts/NotificationContext"
import { getDepositVaultTx, getWithdrawVaultTx } from "@/lib/api"
import { useWallet } from "@solana/wallet-adapter-react"
import { getConnection } from "@/lib/solana"
import { formatNumber, formatAddress } from "@/lib/display"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowUpRight } from "lucide-react"
import { logActivity, LogActivityParams } from '@/lib/utils/activity-logger';

const connection = getConnection();

export function VaultDashboardExecuteCard({vault, vaultData, depositData, positionBalance, sharePrice, handleReload, tokenPrice, tokenBalance}: {vault: string, vaultData: any, depositData: any, positionBalance: number, sharePrice: number, handleReload: () => void, tokenPrice: number, tokenBalance: number}) {
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeAction, setActiveAction] = useState<"deposit" | "withdraw">("deposit")

  const router = useRouter();
  const { publicKey, signTransaction } = useWallet()
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
      amount = positionBalance*sharePrice;
      console.log("User Maximum Withdraw Amount (USDC):", amount);
    }
    
    const computed = amount * percent
    setAmount(computed.toString())
  }

  const usdValue = amount ? (Number.parseFloat(amount) * tokenPrice).toFixed(2) : "0"

  const handleConfirm = async () => {
    console.log("Confirming Action")
    if (!amount || Number.parseFloat(amount) <= 0) return;
    if (!depositData) return;
    if (!publicKey || !signTransaction) {
      alert("Please connect your wallet")
      return
    }

    setIsLoading(true)
    try {
      let res;
      // Fetch Transaction Details from API
      if (activeAction === "deposit") {
        res = await getDepositVaultTx({
          amount: (Number.parseFloat(amount) * 10 ** depositData.tokenInfo.decimals).toString(),
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
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      versionedTx.message.recentBlockhash = blockhash;
      const signedTx = await signTransaction(versionedTx);
      const txid = await connection.sendRawTransaction(signedTx.serialize());
      const latest = await connection.getLatestBlockhash();
      await connection.confirmTransaction(
        {
          signature: txid,
          blockhash: latest.blockhash,
          lastValidBlockHeight: latest.lastValidBlockHeight,
        },
        "confirmed"
      );
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
              Open <ArrowUpRight/>
            </Button>
          </div>
        </div>
      )}
      <Card className={`bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-700/30 backdrop-blur-sm rounded-lg shadow-lg ${/*hover:bg-blue-900/30*/""} transition-all duration-200`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-lg">{vaultData? vaultData.name : "Loading..."}</CardTitle>
            {/*<div className="text-lg text-green-400 font-medium">APY: {apy}%</div>*/}
          </div>
          <div className="mb-2 text-xs text-gray-400">
            Created By: {vaultData ? formatAddress(vaultData.authority.toString()) : "Loading..."}
          </div>
          <div className="text-sm text-gray-300 leading-relaxed">
           {vaultData ? vaultData.description : "Loading..."}
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pb-6">
          {/*<div className="inline-flex items-center px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-full border border-blue-500/30">
            {/*Lending
          </div>*/}

          <div className="space-y-3 mt-6">
            {/* Deposit/Withdraw Toggle */}
            <div className="flex rounded-md overflow-hidden">
              <Button
                onClick={() => setActiveAction("deposit")}
                className={`flex-1 py-2 text-sm font-medium ${activeAction === "deposit" 
                  ? "bg-orange-600 text-white hover:bg-orange-700" 
                  : "bg-[#1A202C] text-gray-400 hover:bg-[#2D3748] hover:text-gray-300"}`}
              >
                Deposit
              </Button>
              <Button
                onClick={() => setActiveAction("withdraw")}
                className={`flex-1 py-2 text-sm font-medium ${activeAction === "withdraw" 
                  ? "bg-orange-600 text-white hover:bg-orange-700" 
                  : "bg-[#1A202C] text-gray-400 hover:bg-[#2D3748] hover:text-gray-300"}`}
              >
                Withdraw
              </Button>
            </div>
            
            <div className="bg-[#0F1218] rounded-lg border border-[#2D3748]/50 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Image src={depositData? depositData.tokenInfo.icon : `/PNG/usdc-logo.png`} alt="Deposit Mint Logo" width={25} height={25} />
                  <span className="text-white font-medium">{depositData? depositData.tokenInfo.symbol : ""}</span>
                </div>
                <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePercent(0.25)}
                  className="h-6 px-1.5 text-xs bg-[#2D3748] border-[#4A5568] text-gray-300 hover:bg-[#4A5568] hover:text-white"
                >
                  25%
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePercent(0.5)}
                  className="h-6 px-1.5 text-xs bg-[#2D3748] border-[#4A5568] text-gray-300 hover:bg-[#4A5568] hover:text-white"
                >
                  50%
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePercent(1)}
                  className="h-6 px-1.5 text-xs bg-[#2D3748] border-[#4A5568] text-gray-300 hover:bg-[#4A5568] hover:text-white"
                >
                  100%
                </Button>
              </div>
            </div>

              <div className="flex items-center justify-between pt-3 relative z-10">
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder={`${depositData? depositData.tokenInfo.symbol : ""}`}
                  className="bg-transparent text-white text-lg font-medium outline-none flex-1 placeholder-gray-500 cursor-text relative z-20"
                  style={{ pointerEvents: 'auto' }}
                />
                <span className="text-gray-400 text-sm pointer-events-none">${formatNumber(Number(usdValue), 2)}</span>
              </div>
            </div>

            <Button
              onClick={handleConfirm}
              disabled={!amount || Number.parseFloat(amount) <= 0 || isLoading}
              className="w-full text-white font-medium py-3 disabled:opacity-50 disabled:cursor-not-allowed bg-orange-600 hover:bg-orange-700"
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
     <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-slate-700/50 backdrop-blur-sm rounded-xl shadow-2xl p-6">
        <Skeleton className="h-38 w-full" />
        <Skeleton className="h-28 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </Card>
  </>
}