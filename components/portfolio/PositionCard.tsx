import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, ChevronRight } from "lucide-react";
import { UserPosition } from "@/app/portfolio/page";

export function PositionCard({ 
    position, 
    onClick 
}: { 
    position: UserPosition; 
    onClick: () => void;
}) {
    const changeIsPositive = (position.change24h || 0) >= 0;
    
    return (
        <Card 
            onClick={onClick}
            className="bg-slate-800/50 border-slate-600/30 rounded-xl backdrop-blur-sm hover:bg-slate-800/70 hover:border-blue-500/50 transition-all duration-200 cursor-pointer group"
        >
            <CardContent className="p-4 md:p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <img 
                            src={position.depositToken.icon} 
                            alt={position.depositToken.symbol}
                            className="w-10 h-10 rounded-full shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm md:text-base font-semibold text-white truncate">
                                {position.vaultName}
                            </h3>
                            <p className="text-xs text-slate-400">
                                {position.depositToken.symbol}
                            </p>
                        </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-400 transition-colors shrink-0" />
                </div>

                {/* Value */}
                <div className="mb-3">
                    <p className="text-xs text-slate-400 mb-1">Position Value</p>
                    <p className="text-xl md:text-2xl font-bold text-white">
                        ${position.value.toFixed(2)}
                    </p>
                </div>

                {/* 24h Change */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                    <span className="text-xs text-slate-400">24h Change</span>
                    <div className={`flex items-center gap-1 text-sm font-semibold ${
                        changeIsPositive ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                        {changeIsPositive ? (
                            <ArrowUpRight className="h-4 w-4" />
                        ) : (
                            <ArrowDownRight className="h-4 w-4" />
                        )}
                        {changeIsPositive ? '+' : ''}{position.change24h?.toFixed(2)}%
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}