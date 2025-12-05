import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  DollarSign,
  Activity,
  Wallet,
  Info,
  ChevronRight,
  ExternalLink,
  Coins,
  Percent,
  UserRound,
  BanknoteArrowUp,
  Link2,
} from "lucide-react"

interface VaultDataProps {
  depositData?: any;
  vaultData?: any;
}

export function VaultData({depositData, vaultData}: VaultDataProps) {

    function handleClickVault() {
        const url = `https://solscan.io/account/${vaultData ? vaultData.publicKey : ""}?cluster=mainnet-beta`;
        window.open(url, "_blank");
    }

    function handleClickCreator() {
        const url = `https://solscan.io/account/${vaultData ? vaultData.authority : ""}?cluster=mainnet-beta`;
        window.open(url, "_blank");
    }

    const maxDeposit = (vaultData && depositData)?
      (Number.parseFloat(vaultData.depositCap) / 10 ** depositData.tokenInfo.decimals)
      : 0;

    return (
        <>
        <Card className="rounded-xl bg-[#101018] border border-[#16161f] overflow-hidden z-50 py-0 gap-0">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#16161f]">
                <div className="flex items-center gap-3">
                    <Coins className="h-4 w-4 text-[#4a4a5a]" />
                    <span className="text-sm text-[#6b6b7b]">Deposit Asset</span>
                </div>
                <div className="flex items-center gap-2">
                    <img src={depositData ? depositData.tokenInfo.icon : `/PNG/usdc-logo.png`} alt="Deposit Mint Logo" className="w-6 h-6 rounded-full" />
                    <span className="text-sm font-medium text-[#ffffff]">{depositData? depositData.tokenInfo.symbol : ""}</span>
                </div>
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#16161f]">
                <div className="flex items-center gap-3">
                    <BanknoteArrowUp className="h-4 w-4 text-[#4a4a5a]" />
                    <span className="text-sm text-[#6b6b7b]">Max Deposit</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#ffffff]">{maxDeposit} {depositData? depositData.tokenInfo.symbol : ""}</span>
                </div>
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#16161f]">
                <div className="flex items-center gap-3">
                    <Percent className="h-4 w-4 text-[#4a4a5a]" />
                    <span className="text-sm text-[#6b6b7b]">Management Fee</span>
                </div>
                <span className="text-sm font-medium text-[#ffffff]">{vaultData ? (vaultData.managerFeeBps / 100).toFixed(2) + " %" : "Loading..."}</span>
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#16161f]">
                <div className="flex items-center gap-3">
                    <Link2 className="h-4 w-4 text-[#4a4a5a]" />
                    <span className="text-sm text-[#6b6b7b]">Vault Address</span>
                </div>
                <button className="flex items-center gap-1.5 text-sm font-mono text-[#6b6b7b] hover:text-[#2563eb] transition-colors group" onClick={handleClickVault}>
                    {vaultData ? vaultData.publicKey : "Loading..."}
                    {/*<ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />*/}
                </button>
            </div>
            <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                    <UserRound className="h-4 w-4 text-[#4a4a5a]" />
                    <span className="text-sm text-[#6b6b7b]">Creator Address</span>
                </div>
                <button className="flex items-center gap-1.5 text-sm font-mono text-[#6b6b7b] hover:text-[#2563eb] transition-colors group" onClick={handleClickCreator}>
                    {vaultData ? vaultData.authority : "Loading..."}
                    {/*<ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />*/}
                </button>
            </div>
        </Card>
        </>
    )
}