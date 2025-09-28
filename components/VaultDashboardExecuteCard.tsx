import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getVaultDepositTx, getVaultWithdrawTx } from "@/lib/api"
import { useWallet } from "@solana/wallet-adapter-react"
import { PublicKey, VersionedTransaction } from "@solana/web3.js"
import { TOKEN_INFO, TokenInfo } from "@/lib/utils/tokens"
import * as bs58 from "bs58"
import { getConnection } from "@/lib/solana"
import { getAssociatedTokenAddressSync } from "@solana/spl-token"

const connection = getConnection();

export function VaultDashboardExecuteCard({vault, tokenMint}: {vault: string, tokenMint: string}) {
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeAction, setActiveAction] = useState<"deposit" | "withdraw">("deposit")

  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);

  const [tokenBalance, setTokenBalance] = useState<number>(0);

  const { publicKey, signTransaction } = useWallet()

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
        console.log("User ATA:", userAta.toBase58());
        console.log("User Token Balance:", accountInfo.value.uiAmount);
        if (accountInfo.value.uiAmount) setTokenBalance(accountInfo.value.uiAmount);
      }
    }
    fetchUserBalance();
  }, [tokenMint, publicKey])

  // Mock data - replace with real data
  const tokenPrice = 180 // SOL price in USD
  const apy = 6.8

  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value)
    }
  }

  const handleHalf = () => {
    setAmount((tokenBalance / 2).toString())
  }

  const handleMax = () => {
    setAmount(tokenBalance.toString())
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
    // Simulate API call
    try {
      const tokenInfo = TOKEN_INFO[tokenMint];
      let res;
      if (activeAction === "deposit") {
        res = await getVaultDepositTx(publicKey, new PublicKey(vault), Number.parseFloat(amount) * 10 ** tokenInfo.tokenDecimals, tokenInfo.tokenProgram);
      } else {
        const withdrawAll = false;
        res = await getVaultWithdrawTx(publicKey, new PublicKey(vault), Number.parseFloat(amount) * 10 ** tokenInfo.tokenDecimals, withdrawAll, tokenInfo.tokenProgram);
      }
      console.log("Raw API Response:", res);
      const encodedTx = res.tx;
      const instruction  = bs58.default.decode(encodedTx);
      const versionedTx = VersionedTransaction.deserialize(instruction);
      console.log("Versioned Transaction:", versionedTx);

      const { value } = await connection.simulateTransaction(versionedTx);
      console.log("Simulation result:", value);

      // Prompt user to sign and send transaction
      const signedTx = await signTransaction(versionedTx);
      console.log("Signed Transaction:", signedTx);
      const txid = await connection.sendRawTransaction(signedTx.serialize());
      console.log("Transaction ID:", txid);
      alert(`Transaction submitted: ${txid}`);

      await new Promise((resolve) => setTimeout(resolve, 2000))
    } catch (error) {
      console.error("Error during transaction processing:", error);
    }
    setIsLoading(false)

    // Reset form or show success message
    setAmount("")
  }

  return (
    <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-700/30 backdrop-blur-sm rounded-lg shadow-lg hover:bg-blue-900/30 transition-all duration-200">
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
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{tokenInfo?.symbol.charAt(0)}</span>
                </div>
                <span className="text-white font-medium">{tokenInfo?.symbol}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleHalf}
                  className="h-6 px-2 text-xs bg-[#2D3748] border-[#4A5568] text-gray-300 hover:bg-[#4A5568] hover:text-white"
                >
                  HALF
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleMax}
                  className="h-6 px-2 text-xs bg-[#2D3748] border-[#4A5568] text-gray-300 hover:bg-[#4A5568] hover:text-white"
                >
                  MAX
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <input
                type="text"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder={`0 ${tokenInfo?.symbol}`}
                className="bg-transparent text-white text-lg font-medium outline-none flex-1 placeholder-gray-500"
              />
            </div>

            <div className="flex items-center justify-between mt-2 text-sm">
              <span className="text-gray-400">{amount || "0.00"}</span>
              <span className="text-gray-400">${usdValue}</span>
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
  )
}