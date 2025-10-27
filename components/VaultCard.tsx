"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, ExternalLink, ArrowRight } from "lucide-react"
import { useIsMobile } from "@/lib/hooks/useIsMobile"
import { useWallet } from "@solana/wallet-adapter-react"

interface VaultStrategy {
  symbol: string;
  icon: string;
  apy?: number;
}

export interface VaultCardData {
  name: string;
  nav: number;
  depositToken: {
    symbol: string;
    icon: string;
    apy: number;
  };
  strategies: VaultStrategy[];
  createdBy: string;
  address: string;
}

interface VaultCardProps {
  vault: VaultCardData;
  onViewDetails: (vaultAddress: string) => void;
}

export function VaultCard({ vault, onViewDetails }: VaultCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxVisibleStrategies = 3;
  const isMobile = useIsMobile();
  const { publicKey } = useWallet();
  
  const hasMoreStrategies = vault.strategies.length > maxVisibleStrategies;
  const visibleStrategies = isExpanded 
    ? vault.strategies 
    : vault.strategies.slice(0, maxVisibleStrategies);

  // Check if current user owns this vault
  const isUserVault = publicKey && publicKey.toString() === vault.createdBy;
  
  // Check if vault is verified (specific authority and user is not the creator)
  const VERIFIED_AUTHORITY = "H1ZpCkCHJR9HxwLQSGYdCDt7pkqJAuZx5FhLHzWHdiEw";
  const isVerifiedVault = vault.createdBy === VERIFIED_AUTHORITY && !isUserVault;

  const handleCreatorClick = () => {
    window.open(`https://solscan.io/account/${vault.createdBy}`, '_blank');
  };

  console.log("Loading:", vault);

  return (
    <Card  onClick={() => onViewDetails(vault.address)} className="bg-slate-800/50 border-slate-600/30 rounded-xl p-6 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-200">
      <CardContent className="p-0 space-y-4">
        {/* Header Row - Vault Name and NAV */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={isMobile ? "flex-col gap-5": "flex gap-2 items-center"}>
              <h3 className="text-sm md:text-lg font-semibold text-white">{vault.name}</h3>
              {isUserVault && (
                <Badge className="bg-orange-600/20 text-orange-400 border-orange-500/30 text-xs px-2 py-1">
                  Your Vault
                </Badge>
              )}
              {isVerifiedVault && (
                <Badge className="bg-green-600/20 text-green-400 border-green-500/30 text-xs px-2 py-1">
                  Verified
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 ml-2">
            <div className="text-sm text-slate-400">NAV</div>
            <div className="text-lg font-bold text-white">${vault.nav.toFixed(2)}</div>
          </div>
        </div>

        {/* Deposit Token Section */}
        <div className="space-y-2">
          <div className="text-sm text-slate-400 font-medium">Deposit</div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-700/50 rounded-lg px-3 py-2">
              <img 
                src={vault.depositToken.icon} 
                alt={vault.depositToken.symbol} 
                className="w-4 h-4 md:w-6 md:h-6  rounded-full" 
              />
              <span className="text-white font-medium text-xs sm:text-sm">{vault.depositToken.symbol}</span>
            </div>
            {vault.depositToken.apy && 
              <Badge variant="secondary" className="bg-green-600/20 text-green-400 border-green-500/30">
                {vault.depositToken.apy}% APY
              </Badge>
            }
          </div>
        </div>

        {/* Strategies Section */}
        <div className="space-y-2 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-400 font-medium">Strategies</div>
            {hasMoreStrategies && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                {isExpanded ? (
                  <>
                    <span>Show Less</span>
                    <ChevronUp className="h-3 w-3" />
                  </>
                ) : (
                  <>
                    <span>+{vault.strategies.length - maxVisibleStrategies} more</span>
                    <ChevronDown className="h-3 w-3" />
                  </>
                )}
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 flex-1">
            {visibleStrategies.length > 0 ? (
              visibleStrategies.map((strategy, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-slate-700/50 rounded-lg px-2 md:px-3 py-2 border border-slate-600/30"
                >
                  <img 
                    src={strategy.icon} 
                    alt={strategy.symbol} 
                    className="w-3 h-3 md:w-5 md:h-5 rounded-full" 
                  />
                  <span className="text-white text-xs md:text-sm font-medium">{strategy.symbol}</span>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-start w-full h-12 text-slate-500 text-sm">
                (X) No strategies configured yet.
              </div>
            )}
          </div>
        </div>

        {/* Footer - Creator and Action */}
        <div className="flex items-end justify-between pt-1 md:pt-4 -mb-1">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">{isMobile? "By:" : "Created By:"}</span>
            <button
              onClick={handleCreatorClick}
              className="flex items-center gap-1 text-xs lg:text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span className="font-mono">
                {vault.createdBy.slice(0, 4)}...{vault.createdBy.slice(-4)}
              </span>
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
          
          <Button
            onClick={() => onViewDetails(vault.address)}
            variant="outline"
            size="sm"
            className="bg-transparent border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400"
          >
            {isMobile? "View" : "View Strategy"}
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}