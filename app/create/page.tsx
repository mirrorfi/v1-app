"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { GridStyleBackground } from "@/components/ui/GridStyleBackground"
import { Navbar } from "@/components/Navbar"
import { useIsMobile } from "@/lib/hooks/useIsMobile"
import { ChevronDown } from "lucide-react"
import { getInitializeVaultTx, sendTx } from "@/lib/api/transaction"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { useNotification } from "@/contexts/NotificationContext"
import { TOKEN_INFO } from "@/lib/utils/tokens"
import { mirrorfiClient } from "@/lib/client/solana"
import { BN } from "@coral-xyz/anchor"
import { useRouter } from "next/navigation";
import { createVault } from "@/lib/utils/vault-manager"

const tokenOptions = [
    { 
        symbol: 'USDC', 
        name: 'USD Coin', 
        mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        icon: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
        decimals: 6
    },
    { 
        symbol: 'SOL', 
        name: 'Solana', 
        mint: 'So11111111111111111111111111111111111111112',
        icon: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
        decimals: 9
    }
]

export default function CreatePage() {
    const isMobile = useIsMobile()
    const router = useRouter();
    const {showNotification} = useNotification();
    const {publicKey, signTransaction} = useWallet();
    const { connection } = useConnection();
    const dropdownRef = useRef<HTMLDivElement>(null)
    const [isLoading, setIsLoading] = useState(false)
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        capitalToken: 'USDC',
        commissionRate: '',
        maxDeposit: ''
    })
    
    const [isTokenDropdownOpen, setIsTokenDropdownOpen] = useState(false)
    
    const commissionRates = ['1%', '2%', '5%', '10%']
    
    const handleInputChange = (field: string, value: string) => {
        if (field === 'description' && value.length > 64) return
        setFormData(prev => ({ ...prev, [field]: value }))
    }
    
    const handleCommissionSelect = (rate: string) => {
        setFormData(prev => ({ ...prev, commissionRate: rate }))
    }
    
    const handleTokenSelect = (token: string) => {
        setFormData(prev => ({ ...prev, capitalToken: token }))
        setIsTokenDropdownOpen(false)
    }

    const createAllowed = formData.name && formData.description && formData.commissionRate && formData.maxDeposit
    const handleCreate = async () => {
        setIsLoading(true);
        try{
            if (!publicKey || !signTransaction) {
                showNotification({
                    title: `Wallet Not Connected!`,
                    message: `Please connect your wallet to continue.`,
                    type: "error"
                });
                return;
            }
            if (formData.description.length > 64) {
                showNotification({
                    title: `Description Too Long!`,
                    message: `Please limit your description to 64 characters.`,
                    type: "error"
                });
                return;
            }
            if (Number(formData.commissionRate) > 30) {
                showNotification({
                    title: `Notification Rate Too High!`,
                    message: `Please select a lower commission rate.`,
                    type: "error"
                });
                return;
            }
            const {pythOracle, tokenDecimals, tokenProgram} = TOKEN_INFO[tokenOptions.find(token => token.symbol === formData.capitalToken)!.mint];
            if (!pythOracle || !tokenDecimals || !tokenProgram) {
                showNotification({
                    title: `Token Information Missing!`,
                    message: `Token Information Unknown. Please Try Again.`,
                    type: "error"
                });
                return;
            }
            console.log('Creating vault with data:', formData);
            const nextVaultId = await mirrorfiClient.getNextVaultId();
            const nextVaultPda = mirrorfiClient.getVaultPda(new BN(nextVaultId), publicKey);

            const res = await getInitializeVaultTx({
                name: formData.name,
                description: formData.description,
                managerFeeBps: parseInt(formData.commissionRate.replace('%', '')) * 100,
                depositCap: (BigInt(parseFloat(formData.maxDeposit) * 10 ** tokenDecimals)).toString(),
                lockedProfitDuration: "3600",
                depositMint: tokenOptions.find(token => token.symbol === formData.capitalToken)!.mint,
                priceUpdateV2: pythOracle.toBase58(),
                authority: publicKey.toString(),
            });
            const versionedTx = res;
            const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
            versionedTx.message.recentBlockhash = blockhash;
            const signedTx = await signTransaction(versionedTx);
            const txid = await sendTx(signedTx);
            console.log("Transaction ID:", txid);

            showNotification({
                title: `Successful!`,
                message: `Your vault has been created successfully!`,
                txId: txid,
                type: "success"
            });

            await createVault(
                nextVaultPda.toBase58(),
                formData.description
            );

            router.push(`/vault/${nextVaultPda.toBase58()}`);
        } catch (error: any) {
            console.error("Error creating vault:", error);
            showNotification({
                title: `Error Creating Vault!`,
                message: error?.message || 'An unknown error occurred.',
                type: "error"
            });
        }
        setIsLoading(false);
    }
    
    const selectedToken = tokenOptions.find(token => token.symbol === formData.capitalToken)
    
    return (
        <main className="relative min-h-screen w-full overflow-hidden bg-background">
            <GridStyleBackground />
            <Navbar />
            
            <div className="relative z-20 flex flex-col items-center justify-center">
                {/* Create Vault Form Card */}
                <Card className="w-full max-w-md bg-slate-800/50 border-slate-600/30 rounded-xl backdrop-blur-sm">
                    <CardContent className="p-8">
                        <div className="space-y-6">
                            <h1 className="text-2xl font-bold text-white text-center">Create MirrorFi Vault</h1>
                            
                            {/* Vault Name */}
                            <div className="space-y-2">
                                <label className="text-slate-400 text-sm font-medium">Vault Name</label>
                                <div className="relative">
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className="bg-slate-700/50 border-slate-600/30 text-white placeholder:text-slate-500"
                                        placeholder="Enter vault name"
                                    />
                                </div>
                            </div>

                            {/* Short Description */}
                            <div className="space-y-2">
                                <label className="text-slate-400 text-sm font-medium">Short Description:</label>
                                <div className="relative">
                                    <Textarea
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        className="bg-slate-700/50 border-slate-600/30 text-white placeholder:text-slate-500 resize-none h-20"
                                        placeholder="Describe your vault strategy"
                                        maxLength={64}
                                    />
                                    <div className="absolute bottom-2 right-2 text-xs text-slate-500">
                                        {formData.description.length}/64
                                    </div>
                                </div>
                            </div>
                            
                            {/* Select Capital Token */}
                            <div className="space-y-2">
                                <label className="text-slate-400 text-sm font-medium">Select Capital Token:</label>
                                <div className="relative" ref={dropdownRef}>
                                    <Button
                                        variant="outline"
                                        className="w-full h-12 justify-between bg-slate-700/50 border-slate-600/30 text-white hover:bg-slate-600/50"
                                        onClick={() => setIsTokenDropdownOpen(!isTokenDropdownOpen)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <img 
                                                src={selectedToken?.icon} 
                                                alt={selectedToken?.symbol} 
                                                className="w-6 h-6 rounded-full" 
                                            />
                                            <span>{selectedToken?.symbol}</span>
                                        </div>
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                    
                                    {isTokenDropdownOpen && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600/30 rounded-lg shadow-lg z-50">
                                            {tokenOptions.map((token) => (
                                                <button
                                                    key={token.symbol}
                                                    className="w-full flex items-center gap-3 p-3 hover:bg-slate-700/50 first:rounded-t-lg last:rounded-b-lg text-left"
                                                    onClick={() => handleTokenSelect(token.symbol)}
                                                >
                                                    <img src={token.icon} alt={token.symbol} className="w-6 h-6 rounded-full" />
                                                    <div className="flex-1">
                                                        <div className="text-white font-medium">{token.symbol}</div>
                                                        <div className="text-slate-400 text-sm">{token.name}</div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Commission Rate */}
                            <div className="space-y-3">
                                <label className="text-slate-400 text-sm font-medium">Commission Rate:</label>
                                <div className="flex gap-2">
                                    {/* Custom Input */}
                                    <div className="relative">
                                        <Input
                                            value={formData.commissionRate.replace('%', '')}
                                            onChange={(e) => {
                                                const value = e.target.value
                                                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                                    handleInputChange('commissionRate', value ? `${value}%` : '')
                                                }
                                            }}
                                            className="flex-1 bg-slate-700/50 border-slate-600/30 text-white text-xs placeholder:text-slate-500"
                                            placeholder="Custom %"
                                        />
                                    </div>
                                    
                                    {/* Quick Select Buttons */}
                                    {commissionRates.map((rate) => (
                                        <Button
                                            key={rate}
                                            variant="outline"
                                            size="sm"
                                            className={`px-4 ${
                                                formData.commissionRate === rate
                                                    ? 'bg-blue-600 border-blue-500 text-white'
                                                    : 'bg-slate-700/50 border-slate-600/30 text-slate-300 hover:bg-slate-600/50'
                                            }`}
                                            onClick={() => handleCommissionSelect(rate)}
                                        >
                                            {rate}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Max User Deposit Cap */}
                            <div className="space-y-2">
                                <label className="text-slate-400 text-sm font-medium">Max Deposit per User Cap:</label>
                                <div className="relative">
                                    <Input
                                        value={formData.maxDeposit}
                                        onChange={(e) => {
                                            const value = e.target.value
                                            if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                                handleInputChange('maxDeposit', value)
                                            }
                                        }}
                                        className="bg-slate-700/50 border-slate-600/30 text-white placeholder:text-slate-500 pr-16"
                                        placeholder="10"
                                    />
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm">
                                        {selectedToken?.symbol}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Create Button */}
                            <Button
                                onClick={handleCreate}
                                className="w-full py-6 text-xl font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-200 mt-8"
                                disabled={!createAllowed || isLoading}
                            >
                                {isLoading ? 'Creating...' : 'Create'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}