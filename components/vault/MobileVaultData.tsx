"use client"

import {
  Coins,
  Percent,
  UserRound,
  BanknoteArrowUp,
  Link2,
} from "lucide-react"

interface MobileVaultDataProps {
  depositData?: any;
  vaultData?: any;
}

export function MobileVaultData({ depositData, vaultData }: MobileVaultDataProps) {

  function handleClickVault() {
    const url = `https://solscan.io/account/${vaultData ? vaultData.publicKey : ""}?cluster=mainnet-beta`;
    window.open(url, "_blank");
  }

  function handleClickCreator() {
    const url = `https://solscan.io/account/${vaultData ? vaultData.authority : ""}?cluster=mainnet-beta`;
    window.open(url, "_blank");
  }

  const maxDeposit = (vaultData && depositData) ?
    (Number.parseFloat(vaultData.depositCap) / 10 ** depositData.tokenInfo.decimals)
    : 0;

  return (
    <div className="bg-[#101018]/50 border-y border-[#16161f] divide-y divide-[#16161f]">
      {/* Deposit Asset */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2">
          <Coins className="h-3.5 w-3.5 text-[#4a4a5a]" />
          <span className="text-xs text-[#6b6b7b]">Deposit Asset</span>
        </div>
        <div className="flex items-center gap-1.5">
          <img 
            src={depositData ? depositData.tokenInfo.icon : `/PNG/usdc-logo.png`} 
            alt="Deposit Mint Logo" 
            className="w-4 h-4 rounded-full" 
          />
          <span className="text-xs font-medium text-[#ffffff]">
            {depositData ? depositData.tokenInfo.symbol : ""}
          </span>
        </div>
      </div>

      {/* Max Deposit */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2">
          <BanknoteArrowUp className="h-3.5 w-3.5 text-[#4a4a5a]" />
          <span className="text-xs text-[#6b6b7b]">Max Deposit</span>
        </div>
        <span className="text-xs font-medium text-[#ffffff]">
          {maxDeposit} {depositData ? depositData.tokenInfo.symbol : ""}
        </span>
      </div>

      {/* Management Fee */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2">
          <Percent className="h-3.5 w-3.5 text-[#4a4a5a]" />
          <span className="text-xs text-[#6b6b7b]">Management Fee</span>
        </div>
        <span className="text-xs font-medium text-[#ffffff]">
          {vaultData ? (vaultData.managerFeeBps / 100).toFixed(2) + " %" : "Loading..."}
        </span>
      </div>

      {/* Vault Address */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2">
          <Link2 className="h-3.5 w-3.5 text-[#4a4a5a]" />
          <span className="text-xs text-[#6b6b7b]">Vault Address</span>
        </div>
        <button 
          className="text-xs font-mono text-[#6b6b7b] hover:text-[#2563eb] transition-colors truncate max-w-[140px]" 
          onClick={handleClickVault}
        >
          {vaultData ? vaultData.publicKey : "Loading..."}
        </button>
      </div>

      {/* Creator Address */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2">
          <UserRound className="h-3.5 w-3.5 text-[#4a4a5a]" />
          <span className="text-xs text-[#6b6b7b]">Creator Address</span>
        </div>
        <button 
          className="text-xs font-mono text-[#6b6b7b] hover:text-[#2563eb] transition-colors truncate max-w-[140px]" 
          onClick={handleClickCreator}
        >
          {vaultData ? vaultData.authority : "Loading..."}
        </button>
      </div>
    </div>
  )
}
