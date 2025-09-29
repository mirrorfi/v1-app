import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNotification } from "@/contexts/NotificationContext"
import { getVaultDepositTx, getVaultWithdrawTx } from "@/lib/api"
import { useWallet } from "@solana/wallet-adapter-react"
import { PublicKey, VersionedTransaction } from "@solana/web3.js"
import { TOKEN_INFO, TokenInfo } from "@/lib/utils/tokens"
import * as bs58 from "bs58"
import { getConnection } from "@/lib/solana"
import { fetchJupiterPrices } from "@/lib/utils/jupiter"
import { getAssociatedTokenAddressSync } from "@solana/spl-token"
import { formatNumber } from "@/lib/display"
import Image from "next/image"

const connection = getConnection();

export function VaultDashboardExecuteCard({vault, tokenMint, positionBalance, handleReload}: {vault: string, tokenMint: string, positionBalance: number, handleReload: () => void}) {
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeAction, setActiveAction] = useState<"deposit" | "withdraw">("deposit")

  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);

  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [tokenPrice, setTokenPrice] = useState<number>(0); 

  const { publicKey, signTransaction } = useWallet()
  const { showNotification } = useNotification()

  // Load Token Information
  useEffect(() => {
    const info = TOKEN_INFO[tokenMint]
    if (info) {
      setTokenInfo(info)
    }
    async function fetchUserBalance() {
      if (publicKey && tokenInfo) {
        const userAta = getAssociatedTokenAddressSync(
          new PublicKey(tokenMint),
          publicKey,
          false,
          tokenInfo.tokenProgram
        );
        const accountInfo = await connection.getTokenAccountBalance(userAta);
        const tokenPriceData = await fetchJupiterPrices([tokenMint]);
        if (tokenPriceData[tokenMint]) {
          setTokenPrice(tokenPriceData[tokenMint].usdPrice);
        }
        console.log("User ATA:", userAta.toBase58());
        console.log("User Token Balance:", accountInfo.value.uiAmount);
        if (accountInfo.value.uiAmount) setTokenBalance(accountInfo.value.uiAmount);
      }
    }
    fetchUserBalance();
  }, [tokenMint, publicKey])

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
        res = await getVaultDepositTx(publicKey, new PublicKey(vault), Number.parseFloat(amount) * 10 ** tokenInfo.tokenDecimals, tokenInfo.tokenProgram);
      } else {
        const withdrawAll = positionBalance.toString() === amount;
        res = await getVaultWithdrawTx(publicKey, new PublicKey(vault), Number.parseFloat(amount) * 10 ** tokenInfo.tokenDecimals, withdrawAll, tokenInfo.tokenProgram);
      }
      // Convert API Response to VersionedTransaction
      const encodedTx = res.tx;
      const instruction  = bs58.default.decode(encodedTx);
      const versionedTx = VersionedTransaction.deserialize(instruction);
      // Testing: Simulate Transaction
      // const { value } = await connection.simulateTransaction(versionedTx);
      // console.log("Simulation result:", value);

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
      <Card className={`bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-700/30 backdrop-blur-sm rounded-lg shadow-lg ${/*hover:bg-blue-900/30*/""} transition-all duration-200`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-lg">Kamino Lending Strategy</CardTitle>
          </div>
          <div className="text-green-400 font-medium">APY: {apy}%</div>
        </CardHeader>

        <CardContent className="space-y-4 pb-6">
          <div className="text-sm text-gray-300 leading-relaxed">
            USDC yield strategy comibining USDC Lending to Kamino Main Market for secure yield + future yield strategy 
          </div>

          <div className="inline-flex items-center px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-full border border-blue-500/30">
            Lending
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
        </CardContent>
      </Card>
    </>
  )
}