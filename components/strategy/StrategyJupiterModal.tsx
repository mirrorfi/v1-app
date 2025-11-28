"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ChevronDown, ArrowUpDown, Search } from "lucide-react"
import { getTokenInfos, getExecuteStrategyJupiterSwap, getInitializeAndExecuteStrategyJupiterSwap, getExitStrategyJupiterSwap, sendTx } from "@/lib/api";
import { Skeleton } from "./ui/skeleton";
import { useNotification } from "@/contexts/NotificationContext"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"

interface TokenOption {
  mint:string;
  symbol: string;
  icon: string;
  balance?: number;
  price: number;
  value?: number;
  decimals?: number;
}

interface StrategyJupiterModalProps {
  isOpen: boolean;
  action: string;
  onClose: () => void;
  strategyData: any;
  depositData: any;
  vaultData: any;
}

// Predefined token options for quick selection
const TOKEN_OPTIONS: TokenOption[] = [
  {
    mint: "27G8MtK7VtTcCHkpASjSDdkWWYfoqT6ggEuKidVJidD4",
    symbol: "JLP",
    icon: "https://wsrv.nl/?w=32&h=32&url=https%3A%2F%2Fstatic.jup.ag%2Fjlp%2Ficon.png&dpr=2&quality=80",
    price: 1,
  },
  {
    mint: "So11111111111111111111111111111111111111112",
    symbol: "SOL",
    icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
    price: 1,
  },
  {
    mint: "cbbtcf3aa214zXHbiAZQwf4122FBYbraNdFqgw4iMij",
    symbol: "cbBTC",
    icon: "https://wsrv.nl/?w=32&h=32&url=https%3A%2F%2Fipfs.io%2Fipfs%2FQmZ7L8yd5j36oXXydUiYFiFsRHbi3EdgC4RuFwvM7dcqge&dpr=2&quality=80",
    price: 1,
  },
  {
    mint: "METvsvVRapdj9cFLzq4Tr43xK4tAjQfwX76z3n6mWQL",
    symbol: "MET",
    icon: "https://wsrv.nl/?w=32&h=32&url=https%3A%2F%2Fassets.meteora.ag%2Fmet-token.svg&dpr=2&quality=80",
    price: 1,
  }
];

function TokenSelector({ 
  selectedToken, 
  setToken, 
  disabled = false,
  label 
}: { 
  selectedToken: TokenOption | null; 
  setToken: (token: TokenOption) => void;
  disabled?: boolean;
  label: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [mintAddress, setMintAddress] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState('');

  const validateToken = async (mint: string) => {
    if (!mint.trim()) return;
    
    setIsValidating(true);
    setValidationError('');
    
    try {
      const tokenInfo = await getTokenInfos([mint]);
      
      if (!tokenInfo || Object.keys(tokenInfo).length === 0 || !tokenInfo[mint] || !tokenInfo[mint].icon) {
        setValidationError('Invalid token or not allowed');
        setIsValidating(false);
        return;
      }

      // Create token object with fetched price
      const newToken: TokenOption = {
        mint: mint,
        symbol: tokenInfo[mint].symbol,
        icon: tokenInfo[mint].icon,
        balance: 0,
        price: tokenInfo[mint].usdPrice || 0,
        decimals: tokenInfo[mint].decimals,
      };

      setToken(newToken);
      setMintAddress('');
      setIsOpen(false);
    } catch (error) {
      setValidationError('Failed to validate token');
    }
    
    setIsValidating(false);
  };

  return (
    <div className="space-y-2">
      <label className="text-slate-400 text-sm font-medium">{label}</label>
      <div className="relative">
        {selectedToken || !disabled ?
          <Button
            variant="outline"
            className={`w-full h-12 justify-between bg-slate-800/50 border-slate-600/30 text-white hover:bg-slate-700/50 ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
          >
            {selectedToken ? 
              <div className="flex items-center gap-3">
                <img src={selectedToken.icon} alt={selectedToken.symbol} className="w-7 h-7 rounded-full" />
                <span>{selectedToken.symbol}</span>
              </div>
              : <span>Select a token</span>
            }
            <ChevronDown className="h-4 w-4" />
          </Button>
          : <Skeleton className="w-full h-10 rounded-lg" />
        }
        
        {isOpen && !disabled && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600/30 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
            {/* Manual Token Input Section */}
            <div className="p-3 border-b border-slate-600/30">
              <div className="text-slate-400 text-xs font-medium mb-2">Enter Token Mint Address</div>
              <div className="flex gap-2">
                <Input
                  value={mintAddress}
                  onChange={(e) => setMintAddress(e.target.value)}
                  placeholder="Token mint address..."
                  className="bg-slate-700/50 border-slate-600/30 text-white text-sm"
                />
                <Button
                  size="sm"
                  onClick={() => validateToken(mintAddress)}
                  disabled={isValidating || !mintAddress.trim()}
                  className="bg-blue-600 hover:bg-blue-700 px-3"
                >
                  {isValidating ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {validationError && (
                <div className="text-red-400 text-xs mt-1">{validationError}</div>
              )}
            </div>

            {/* Predefined Token Options */}
            <div className="text-slate-400 text-xs font-medium p-3 pb-1">Popular Tokens</div>
            {TOKEN_OPTIONS.map((token) => (
              <button
                key={token.symbol}
                className="w-full flex items-center gap-3 p-3 hover:bg-slate-700/50 text-left"
                onClick={() => {validateToken(token.mint)}}
              >
                <img src={token.icon} alt={token.symbol} className="w-6 h-6 rounded-full" />
                <div className="flex-1">
                  <div className="text-white font-medium">{token.symbol}</div>
                  {/*<div className="text-slate-400 text-sm">{token.name}</div>*/}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function StrategyJupiterModal({ isOpen, action, onClose, strategyData, depositData, vaultData}: StrategyJupiterModalProps) {
  const [activeTab, setActiveTab] = useState<'add' | 'reduce'>('add');
  const [amount, setAmount] = useState<string>('100');
  const [selectDisabled, setSelectDisabled] = useState<boolean>(false);
  const [strategyToken, setStrategyToken] = useState<TokenOption | null>(null); 
  const [depositToken, setDepositToken] = useState<TokenOption | null>(null);
  const [strategyPosition, setStrategyPosition] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fromToken = activeTab === 'add' ? depositToken : strategyToken;
  const toToken = activeTab === 'add' ? strategyToken : depositToken;
  const { showNotification } = useNotification()
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    if(strategyData) {
      setSelectDisabled(true);
      if(action === "reduce") {setActiveTab('reduce')}
      else {setActiveTab('add')}
      console.log("Strategy Data:", strategyData);  

      setStrategyToken({
        mint: strategyData.targetMint as string,
        symbol: strategyData.tokenInfo.symbol as string,
        icon: strategyData.tokenInfo.icon as string,
        balance: strategyData.balance as number,
        price: strategyData.tokenInfo.usdPrice as number,
        value: strategyData.value.toFixed(2) as number,
        decimals: strategyData.tokenInfo.decimals as number,
      });
      setStrategyPosition({
        strategyPda: strategyData.publicKey,
        amount: strategyData.balance,
        initialCapital: strategyData.initialCapital.toFixed(2),
        initialCapitalValue: (strategyData.initialCapital * depositData.tokenInfo.usdPrice).toFixed(2),
      });
      console.log("Strategy Token:", strategyToken);
    }
    else{
      setStrategyToken(null);
      setDepositToken(null);
      setStrategyPosition(null);
      setAmount('');
      setSelectDisabled(false);
    }
    if(depositData) {
      setDepositToken({
        mint: depositData.tokenInfo.mint,
        symbol: depositData.tokenInfo.symbol,
        icon: depositData.tokenInfo.icon,
        balance: depositData.balance,
        price: depositData.tokenInfo.usdPrice,
        value: depositData.value.toFixed(2),
        decimals: depositData.tokenInfo.decimals,
      });
    }
  }, [strategyData, action]);

  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value)
    }
  }

  const handleExecuteStrategy = async () => {
    setIsLoading(true);
    try {
      if(!publicKey || !signTransaction){
        showNotification({
          title: `Wallet Not Connected!`,
          message: `Please connect your wallet to continue.`,
          type: "error"
        });
        setIsLoading(false);
        return;
      }
      if(!fromToken || !toToken || !fromToken.decimals || !vaultData){
        showNotification({
          title: `Execute Strategy Failed!`,
          message: `Data has not been successfully loaded.`,
          type: "error"
        });
        setIsLoading(false);
        return;
      }
      const numAmount = parseFloat(amount);
      if(!numAmount || numAmount <= 0){
        showNotification({
          title: `Execute Strategy Failed!`,
          message: `Invalid amount.`,
          type: "error"
        });
        setIsLoading(false);
        return;
      }
      let res;
      if( action === "new" || action === "newYield" ) {
        res = await getInitializeAndExecuteStrategyJupiterSwap({
          strategyType: "JupiterSwap",
          authority: publicKey.toString(),
          destinationMint: toToken.mint,
          vault: vaultData.publicKey,
          amount: (Number.parseFloat(amount) * 10 ** fromToken.decimals).toFixed(0).toString(),
          slippageBps: 100,
        });
      }
      else if (activeTab === 'add') {
        res = await getExecuteStrategyJupiterSwap({
          amount: (Number.parseFloat(amount) * 10 ** fromToken.decimals).toFixed(0).toString(),
          slippageBps: 100,
          authority: publicKey.toString(),
          strategy: strategyPosition.strategyPda,
        });
      }else {
        res = await getExitStrategyJupiterSwap({
          amount: (Number.parseFloat(amount) * 10 ** fromToken.decimals).toFixed(0).toString(),
          slippageBps: 100,
          authority: publicKey.toString(),
          strategy: strategyPosition.strategyPda,
          all: amount === fromToken.balance?.toString(),
        });
      }
      const versionedTx = res;
      // Prompt user to sign and send transaction
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      versionedTx.message.recentBlockhash = blockhash;
      const signedTx = await signTransaction(versionedTx);
      const txid = await sendTx(signedTx);
      console.log("Transaction ID:", txid);

      showNotification({
        title: `Strategy Successfully ${activeTab === "add" ? "Increased" : "Reduced"}!`,
        message: `Your strategy has been processed successfully.`,
        txId: txid,
        type: "success"
      });
      
      // Close Modal
      onClose();
    } catch (error: any) {
      showNotification({
        title: `Action Failed`,
        message: `There was an error processing your transaction. Please try again.`,
        type: "error"
      });
      console.error("Error during transaction processing:", error);
    }
    setIsLoading(false);
  };

  const handleTabChange = (tab: 'add' | 'reduce') => {
    if(action === "newYield" || action === 'new' || action === '') return;
    setActiveTab(tab);
    setAmount('');
  };
  const handleSwitch = () => {
    if (activeTab === 'add') { handleTabChange('reduce'); }
    else { handleTabChange('add'); }
  }

  const getQuickAmountPercentage = (percentage: number) => {
    if(!fromToken || !fromToken.balance) return "0";
    const baseAmount = activeTab === 'add' ? fromToken.balance : fromToken.balance;
    if (percentage === 100) { return baseAmount.toString(); }
    return ((baseAmount * percentage) / 100).toString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md md:max-w-lg bg-slate-900/95 border-slate-700/50 backdrop-blur-sm">
        <DialogHeader>
          {/* Title and Profit in same row */}
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-white">
              Jupiter Strategy
            </DialogTitle>
            {/*<div className="text-right">
              <div className="text-green-400 text-xl font-bold">+${data.profit.toFixed(2)}</div>
              <div className="text-green-400 text-sm">(+{data.profitPercentage.toFixed(2)}%)</div>
            </div>*/}
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Token Selection and Price in one row */}
          <div className="text-slate-400 text-sm font-medium mb-2">Token</div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <TokenSelector
                selectedToken={strategyToken}
                setToken={setStrategyToken}
                disabled={selectDisabled}
                label=""
              />
            </div>
            {strategyToken ? 
              <div className="text-slate-400 text-sm">1 {strategyToken.symbol} = {strategyToken.price.toFixed(2)} USDC</div>:
              <Skeleton className="w-24 h-6 rounded-lg" />
            }
          </div>

          {(action === "add" || action === "reduce") ? <>
            {/* Position Summary - Clean design without cards */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-slate-400 text-sm font-medium mb-1">Initial Capital</div>
                {strategyPosition&&strategyToken&&depositToken?
                  <div className="flex items-start gap-2">
                    <div className="text-white font-semibold text-md md:text-lg">{strategyPosition.initialCapital} {depositToken.symbol}</div>
                    <div className="text-slate-400 text-sm">(${strategyPosition.initialCapitalValue})</div>
                  </div> :
                  <Skeleton className="w-32 h-6 rounded-lg" />
                }
              </div>
              <div>
                <div className="text-slate-400 text-sm font-medium mb-1">Current Position</div>
                {strategyPosition&&strategyToken?
                  <div className="flex items-start gap-2">
                    <div className="text-white font-semibold text-md md:text-lg">{strategyToken.balance} {strategyToken.symbol}</div>
                    <div className="text-slate-400 text-sm">(${strategyToken.value})</div>
                  </div> :
                  <Skeleton className="w-32 h-6 rounded-lg" />
                }
              </div>
            </div>

            {/* Add/Reduce Tabs */}
            <div className="flex bg-slate-800/50 rounded-lg p-1">
              <button
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                  activeTab === 'add' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}
                `}
                onClick={() => handleTabChange('add')}
              >
                Add
              </button>
              <button
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                  activeTab === 'reduce' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                onClick={() => handleTabChange('reduce')}
              >
                Reduce
              </button>
            </div>
          </>:null}

          {/* Swap Interface */}
          <div className="relative">
            {/* From Token with Amount Input */}
            {fromToken ?
            <div className="bg-slate-800/50 border border-slate-600/30 rounded-lg p-4">
             
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3"> 
                  <img src={fromToken.icon} alt={fromToken.symbol} className="w-8 h-8 rounded-full" />
                  <div>
                    <div className="text-white font-medium">{fromToken.symbol}</div>
                    <div className="text-slate-400 text-sm">Balance: {fromToken.balance}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {[25, 50, 100].map((percentage) => (
                    <button
                      key={percentage}
                      className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-700/50"
                      onClick={() => setAmount(getQuickAmountPercentage(percentage))}
                    >
                      {percentage}%
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between relative z-10">
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder={fromToken.symbol}
                  className="bg-transparent text-white text-lg font-medium outline-none flex-1 placeholder-gray-500 cursor-text relative z-20"
                  style={{ pointerEvents: 'auto' }}
                />
                <span className="text-gray-400 text-sm pointer-events-none">${(Number(amount) * fromToken.price).toFixed(2)}</span>
              </div>
            </div>
            : <Skeleton className="w-full h-20 rounded-lg" />
            }

            {/* Arrow in the middle */}
            <div className="absolute left-1/2 transform -translate-x-1/2  top-1/2 z-10">
              <div className="bg-slate-700 rounded-full p-2 border-2 border-slate-900" onClick={handleSwitch}>
                <ArrowUpDown className="h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* To Token */}
            {fromToken && toToken? 
            <div className="h-20 bg-slate-800/50 border border-slate-600/30 rounded-lg p-4 mt-2">
              <div className="mt-2 flex items-center gap-3">
                <img src={toToken.icon} alt={toToken.symbol} className="w-8 h-8 rounded-full" />
                <div>
                  <div className="text-white font-medium">{(Number(amount) * fromToken.price / toToken.price).toFixed(5)} {toToken.symbol}</div>
                </div>
              </div>
            </div>
            : <Skeleton className="w-full h-20 rounded-lg mt-2" />
            }
          </div>

          {/* Execute Button */}
          <Button
            onClick={handleExecuteStrategy}
            disabled={!amount || parseFloat(amount) <= 0 || isLoading}
            className="w-full h-14 py-6 text-xl font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-200"
          >
            {isLoading ? "Executing..." : 
              action === "new" || action === "newYield" ? "Create and Execute" : "Execute Strategy"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}