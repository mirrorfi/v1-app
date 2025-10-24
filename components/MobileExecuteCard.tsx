import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNotification } from "@/contexts/NotificationContext"
import { getDepositVaultTx, getWithdrawVaultTx } from "@/lib/api"
import { useWallet } from "@solana/wallet-adapter-react"
import { PublicKey, VersionedTransaction } from "@solana/web3.js"
import { TOKEN_INFO, TokenInfo } from "@/lib/utils/tokens"
import * as bs58 from "bs58"
import { getConnection } from "@/lib/solana"
import { formatAddress, formatNumber } from "@/lib/display"
import Image from "next/image"

const connection = getConnection();

interface MobileExecuteCardProps {
  vault: string,
  vaultData: any,
  tokenMint: string, 
  positionBalance: number, 
  handleReload: () => void,
  tokenBalance: number,
  tokenPrice: number, 
  initialMode?: "deposit" | "withdraw"
}

export function MobileExecuteCard({vault, vaultData, tokenMint, positionBalance, handleReload, tokenBalance, tokenPrice, initialMode = "deposit"}: MobileExecuteCardProps) {
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeAction, setActiveAction] = useState<"deposit" | "withdraw">(initialMode)

  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);

  const { publicKey, signTransaction } = useWallet()
  const { showNotification } = useNotification()

  // Mock data - replace with real data
  const apy = 6.8

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
      amount = positionBalance;
    }
    
    const computed = amount * percent
    setAmount(computed.toString())
  }

  const usdValue = amount ? (Number.parseFloat(amount) * tokenPrice).toFixed(2) : "0"

  const handleConfirm = async () => {
    console.log("Confirming Action")
    if (!amount || Number.parseFloat(amount) <= 0) return
    if (!publicKey || !signTransaction) {
      alert("Please connect your wallet")
      return
    }

    setIsLoading(true)
    try {
      const tokenInfo = TOKEN_INFO[tokenMint];
      let res;
      // Fetch Transaction Details from API
      if (activeAction === "deposit") {
        res = await getDepositVaultTx({
          amount: (Number.parseFloat(amount) * 10 ** tokenInfo.tokenDecimals).toString(),
          depositor: publicKey.toString(),
          vault,
        })
      } else {
        const withdrawAll = positionBalance.toString() === amount;
        // res = await getVaultWithdrawTx(publicKey, new PublicKey(vault), Number.parseFloat(amount) * 10 ** tokenInfo.tokenDecimals, withdrawAll, tokenInfo.tokenProgram);
        res = await getWithdrawVaultTx({
          amount: (Number.parseFloat(amount) * 10 ** tokenInfo.tokenDecimals).toString(),
          withdrawer: publicKey.toString(),
          vault,
        })
      }
      const versionedTx = res;

      // Prompt user to sign and send transaction
      const signedTx = await signTransaction(versionedTx);
      const txid = await connection.sendRawTransaction(signedTx.serialize());
      console.log("Transaction ID:", txid);
      
      // Show success notification
      showNotification({
        title: `${activeAction === "deposit" ? "Deposit" : "Withdrawal"} Successful`,
        message: `Your ${activeAction} of ${amount} ${tokenInfo?.symbol} has been processed successfully.`,
        txId: txid,
        type: "success"
      });

      handleReload();
    } catch (error) {
      console.error("Error during transaction processing:", error);
      
      // Show error notification
      showNotification({
        title: `${activeAction === "deposit" ? "Deposit" : "Withdrawal"} Failed`,
        message: `There was an error processing your ${activeAction}. Please try again.`,
        type: "error"
      });
    }
    setIsLoading(false)

    // Reset form or show success message
    setAmount("")
  }

  return (
    <>
        <div className="pb-4">
          <div className="text-sm text-gray-300 leading-relaxed">
            {vaultData? vaultData.name : "Loading..."} 
          </div>
          <div className="flex mb-2 text-xs text-gray-400">
            Created By: <div className="ml-2 mt-[1px] text-md font-mono">{vaultData ? formatAddress(vaultData.authority.toString()) : "Loading..."}</div>
          </div>
          <div className="text-sm text-gray-300 leading-relaxed font-normal">
            {vaultData ? vaultData.description : "Loading..."}
          </div>
          
          <div className="space-y-3 mt-6">
            {/* Deposit/Withdraw Toggle */}
            <div className="flex rounded-md overflow-hidden">
              <button
                onClick={() => setActiveAction("deposit")}
                className={`flex-1 py-2 text-sm font-medium ${activeAction === "deposit" 
                  ? "bg-blue-600 text-white" 
                  : "bg-[#1A202C] text-gray-400 hover:bg-[#2D3748] hover:text-gray-300"}`}
              >
                Deposit
              </button>
              <button
                onClick={() => setActiveAction("withdraw")}
                className={`flex-1 py-2 text-sm font-medium ${activeAction === "withdraw" 
                  ? "bg-blue-600 text-white" 
                  : "bg-[#1A202C] text-gray-400 hover:bg-[#2D3748] hover:text-gray-300"}`}
              >
                Withdraw
              </button>
            </div>

            {/* Amount Input */}
            <div className="bg-[#0F1218] rounded-lg border border-[#2D3748]/50 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Image src={`/PNG/usdc-logo.png`} alt="USDC Logo" width={25} height={25} />
                  <span className="text-white font-medium">{tokenInfo?.symbol}</span>
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
                  placeholder={`0 ${tokenInfo ? tokenInfo?.symbol : ""}`}
                  className="bg-transparent text-white text-lg font-medium outline-none flex-1 placeholder-gray-500 cursor-text relative z-20"
                  style={{ pointerEvents: 'auto' }}
                />
                <span className="text-gray-400 text-sm pointer-events-none">${formatNumber(Number(usdValue), 2)}</span>
              </div>
            </div>

            <Button
              onClick={handleConfirm}
              disabled={!amount || Number.parseFloat(amount) <= 0 || isLoading}
              className={`w-full text-white font-medium py-3 disabled:opacity-50 disabled:cursor-not-allowed ${activeAction === "deposit" ? "bg-blue-600 hover:bg-blue-700" : "bg-red-500 hover:bg-red-600"}`}
            >
              {isLoading ? "Processing..." : activeAction === "deposit" ? "Deposit" : "Withdraw"}
            </Button>
          </div>
        </div>
    </>
  )
}