"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowRight } from "lucide-react"
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts'

interface VaultData {
  pubkey: string;
  is_initialized: boolean;
  is_closed: boolean;
  is_frozen: boolean;
  version: number;
  bump: number;
  is_kamino: boolean;
  is_meteora: boolean;
  lookup_table: string;
  manager: string;
  deposit_token_mint: string;
  deposit_token_decimals: number;
  share_token_mint: string;
  total_deposit: number;
  total_withdrawal: number;
  total_claimed_protocol_fee: number;
}

interface VaultCardProps {
  vault: VaultData;
  onClick: (vaultPubkey: string) => void;
}

// Demo chart data
const generateDemoChartData = () => {
  const data = [];
  let basePrice = 100;
  for (let i = 0; i < 100; i++) {
    basePrice += (Math.random() - 0.5) * 5;
    data.push({
      day: i,
      price: Math.max(basePrice, i) // Keep price above 80
    });
  }
  console.log("Demo Chart Data:", data);
  return data;
};

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `$${(num / 1000).toFixed(1)}K`;
  }
  return `$${num.toFixed(2)}`;
};

const getVaultName = (vault: VaultData) => {
  let name = "Vault";
  if (vault.is_kamino && vault.is_meteora) {
    name = "Kamino-Meteora Vault";
  } else if (vault.is_kamino) {
    name = "Kamino Vault";
  } else if (vault.is_meteora) {
    name = "Meteora Vault";
  }
  return name;
};

const getRiskLevel = (vault: VaultData) => {
  // Demo risk calculation based on vault properties
  if (vault.is_kamino && vault.is_meteora) {
    return { level: "High", color: "bg-red-500/20 text-red-400 border-red-500/30" };
  } else if (vault.is_kamino || vault.is_meteora) {
    return { level: "Medium", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" };
  }
  return { level: "Low", color: "bg-green-500/20 text-green-400 border-green-500/30" };
};

const getDemoAPY = (vault: VaultData) => {
  // Demo APY calculation
  const baseAPY = 5.5;
  const multiplier = vault.is_kamino ? 1.2 : 1.0;
  const meteora = vault.is_meteora ? 1.1 : 1.0;
  return (baseAPY * multiplier * meteora).toFixed(2);
};

export function VaultCard({ vault, onClick }: VaultCardProps) {
  const vaultName = getVaultName(vault);
  const netDeposits = vault.total_deposit - vault.total_withdrawal;
  const totalNAV = netDeposits / Math.pow(10, vault.deposit_token_decimals);
  const riskLevel = getRiskLevel(vault);
  const apy = getDemoAPY(vault);
  const chartData = generateDemoChartData();
  
  // Calculate min and max values for efficient chart space usage
  const prices = chartData.map(d => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const padding = (maxPrice - minPrice) * 0.1; // 10% padding
  const yAxisMin = Math.max(0, minPrice - padding);
  const yAxisMax = maxPrice + padding;
  
  // Get creator address (first 4 and last 4 characters of manager)
  const creatorAddress = `${vault.manager.slice(0, 4)}...${vault.manager.slice(-4)}`;

  return (
    <Card 
      className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-700/30 backdrop-blur-sm rounded-lg shadow-lg hover:bg-blue-900/30 transition-all duration-200 cursor-pointer group"
      onClick={() => onClick(vault.pubkey)}
    >
      <CardHeader>
        {/* Top Section */}
        <div className="flex items-start justify-between">
          {/* Top Left: Circle Image & Title + Creator Address */}
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 bg-gradient-to-br from-pink-500 to-rose-400">
              <AvatarFallback className="text-white font-bold text-sm">
                {vaultName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-white text-base font-semibold group-hover:text-blue-300 transition-colors leading-tight">
                {vaultName}
              </h3>
              <p className="text-slate-400 text-xs font-mono">
                created by: {creatorAddress}
              </p>
            </div>
          </div>
          
          {/* Top Right: APY */}
          <div className="text-right">
            <div className="text-emerald-400 font-bold text-xl">
              {apy}%
            </div>
            <div className="text-slate-400 text-xs">
              APY
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Middle: Chart - More space allocated */}
        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <YAxis 
                domain={[yAxisMin, yAxisMax]} 
                hide={true}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={false}
                strokeDasharray="0"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom Section - Compact */}
        <div className="flex items-center justify-between">
          {/* Bottom Left: Total NAV & Risk - More compact */}
          <div className="space-y-1">
            <div>
              <div className="text-slate-400 text-xs">Total NAV</div>
              <div className="text-white font-semibold text-base">
                {formatNumber(totalNAV)}
              </div>
            </div>
          </div>
          {/* Risk badge moved to right side for better balance */}
          <div>
            <Badge className={`text-xs ${riskLevel.color}`}>
              Risk: {riskLevel.level}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}