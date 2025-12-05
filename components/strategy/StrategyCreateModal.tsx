"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X } from "lucide-react"

interface StrategyOption {
  id: string;
  name: string;
  platform: string;
  description?: string;
  icon: string;
  active: boolean;
}

interface StrategyCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateStrategy: (strategyId: string) => void;
}

// Hardcoded strategy options data
const STRATEGY_OPTIONS: StrategyOption[] = [
  {
    id: "jupiterSwap",
    name: "Trade",
    platform: "Jupiter",
    description: "Automated trading strategies",
    icon: "https://static1.tokenterminal.com//jupiter/logo.png?logo_hash=6745b324c298242676b7eab38db2c28901075b4f",
    active: true
  },
  {
    id: "jupiterYieldToken",
    name: "Yield Tokens",
    platform: "Jupiter",
    description: "Yield farming with tokens",
    icon: "https://static1.tokenterminal.com//jupiter/logo.png?logo_hash=6745b324c298242676b7eab38db2c28901075b4f",
    active: true
  },
  {
    id: "meteora-damm",
    name: "LP",
    platform: "Meteora DAMM V2",
    description: "Alternative DLMM strategy",
    icon: "https://docs.meteora.ag/images/logo/meteora.png",
    active: true
  },
  {
    id: "meteora-dlmm",
    name: "LP",
    platform: "Meteora DLMM",
    description: "Dynamic liquidity market making",
    icon: "https://docs.meteora.ag/images/logo/meteora.png",
    active: false
  },
  {
    id: "borrow-lend-kamino",
    name: "Lend",
    platform: "Kamino",
    description: "Lending and borrowing strategies",
    icon: "https://s2.coinmarketcap.com/static/img/coins/200x200/30986.png",
    active: false
  },
  {
    id: "borrow-lend-jupiter-lend",
    name: "Lend",
    platform: "Jupiter Lend",
    description: "Jupiter lending protocols",
    icon: "https://static1.tokenterminal.com//jupiter/logo.png?logo_hash=6745b324c298242676b7eab38db2c28901075b4f",
    active: false
  },
  {
    id: "earn-perps-drift",
    name: "Lend",
    platform: "Drift",
    description: "Perpetual futures strategies",
    icon: "https://resources.cryptocompare.com/asset-management/13777/1713255929886.png",
    active: false
  },
  {
    id: "vaults-drift",
    name: "Vaults",
    platform: "Drift",
    description: "Automated vault strategies",
    icon: "https://resources.cryptocompare.com/asset-management/13777/1713255929886.png",
    active: false
  }
];

function StrategyOptionCard({
  option,
  isSelected,
  onClick
}: {
  option: StrategyOption;
  isSelected: boolean;
  onClick: () => void;
}) {
  const isInactive = !option.active;

  return (
    <Card
      className={`relative transition-all duration-200 overflow-hidden ${isInactive
          ? 'bg-slate-900/50 border-slate-700/30 opacity-60 cursor-not-allowed'
          : `cursor-pointer hover:scale-102 ${isSelected
            ? 'bg-blue-600/20 border-blue-500/50 shadow-lg shadow-blue-500/20'
            : 'bg-slate-800/50 border-slate-600/30 hover:bg-slate-700/50'
          }`
        }`}
      onClick={isInactive ? undefined : onClick}
    >
      {/* Background token image on the right */}
      <div className="absolute right-0 top-0 w-40 h-full opacity-50 overflow-hidden">
        <div
          className="w-40 h-40 bg-contain bg-no-repeat bg-center transform translate-x-2 -translate-y-3 rounded-full"
          style={{
            backgroundImage: `url(${option.icon})`,
            filter: isInactive ? 'brightness(0.5) grayscale(1)' : 'brightness(0.9)'
          }}
        />
      </div>

      <CardContent className="relative z-10 p-3 sm:p-4">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`font-medium text-base ${isInactive ? 'text-slate-500' : 'text-white'}`}>
                {option.name}
              </h3>
              {isInactive && (
                <span className="px-2 py-1 bg-orange-600/20 text-orange-400 text-xs font-semibold rounded-full border border-orange-500/30">
                  COMING SOON
                </span>
              )}
            </div>
            <p className={`text-sm ${isInactive ? 'text-slate-600' : 'text-slate-400'}`}>
              ({option.platform})
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StrategyCreateModal({ isOpen, onClose, onCreateStrategy }: StrategyCreateModalProps) {
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);

  const handleCreateStrategy = () => {
    if (selectedStrategy) {
      onCreateStrategy(selectedStrategy);
      setSelectedStrategy(null);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedStrategy(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl pb-0 pl-4.5 pr-2.5 bg-slate-900/95 border-slate-700/50 backdrop-blur-sm flex flex-col min-h-screen sm:min-h-[80vh] sm:max-h-[85vh] z-[200] md:mt-10 w-full">
        {/* Fixed Header */}
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-white">
              Create Strategy
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Scrollable Content Area */}
        <div className="h-[600px] flex-1 overflow-y-auto pt-2 sm:pt-4 pb-0 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {STRATEGY_OPTIONS.map((option) => (
              <StrategyOptionCard
                key={option.id}
                option={option}
                isSelected={selectedStrategy === option.id}
                onClick={() => option.active && setSelectedStrategy(option.id)}
              />
            ))}
          </div>
        </div>

        {/* Sticky Footer with Create Button */}
        <div className="sticky bottom-0 flex-shrink-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700/50 pt-4 pb-4 mt-4">
          <Button
            onClick={handleCreateStrategy}
            disabled={!selectedStrategy}
            className={`w-full h-12 sm:h-15 py-3 sm:py-4 text-lg sm:text-xl font-semibold rounded-xl transition-all duration-200 ${selectedStrategy
                ? 'bg-blue-600 hover:bg-blue-800 text-white shadow-lg shadow-blue-500/20'
                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
          >
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}