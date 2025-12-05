"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"

interface VaultAllocationProps {
  depositData?: any;
  strategiesData?: any[];
  isLoading?: boolean;
}

interface AllocationData {
  name: string;
  value: number;
  percentage: number;
  icon: string;
  color: string;
}

const COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Green
  "#8b5cf6", // Purple
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#ec4899", // Pink
  "#14b8a6", // Teal
  "#f97316", // Orange
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#101018] border border-[#16161f] rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <img src={data.icon} alt={data.name} className="w-5 h-5 rounded-full" />
          <span className="text-white text-sm font-semibold">{data.name}</span>
        </div>
        <p className="text-white text-sm">${data.value.toFixed(2)}</p>
        <p className="text-gray-400 text-xs">{data.percentage.toFixed(2)}%</p>
      </div>
    );
  }
  return null;
};

const CustomLegendContent = (props: any) => {
  const { payload } = props;
  return (
    <div className="flex flex-col gap-1.5 pl-3 pr-2">
      {payload.map((entry: any, index: number) => (
        <div key={`legend-${index}`} className="flex items-center gap-1.5">
          <div 
            className="w-3 h-3 rounded-full flex-shrink-0" 
            style={{ backgroundColor: entry.color }}
          />
          <img 
            src={entry.payload.icon} 
            alt={entry.payload.name} 
            className="w-5 h-5 rounded-full flex-shrink-0"
          />
          <div className="flex flex-col">
            <span className="text-xs text-gray-300">{entry.payload.name}</span>
            <span className="text-[10px] text-white font-medium tabular-nums">
              ${entry.payload.value.toFixed(2)} ({entry.payload.percentage.toFixed(1)}%)
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export function VaultAllocation({ depositData, strategiesData = [], isLoading = false }: VaultAllocationProps) {
  const [allocationData, setAllocationData] = useState<AllocationData[]>([]);
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    if (depositData || strategiesData.length > 0) {
      const allocations: AllocationData[] = [];
      let total = 0;

      // Add deposit allocation
      if (depositData) {
        const depositValue = depositData.balance * depositData.tokenInfo.usdPrice;
        total += depositValue;
        allocations.push({
          name: depositData.tokenInfo?.symbol || "Deposit",
          value: depositValue,
          percentage: 0,
          icon: depositData.tokenInfo?.icon || "/PNG/usdc-logo.png",
          color: COLORS[0],
        });
      }

      // Add strategy allocations
      strategiesData.forEach((strategy, idx) => {
        const strategyValue = strategy.value || 0;
        total += strategyValue;
        allocations.push({
          name: strategy.tokenInfo?.symbol || strategy.strategyName || strategy.strategyType || "Strategy",
          value: strategyValue,
          percentage: 0,
          icon: strategy.tokenInfo?.icon || strategy.icon || "/PNG/usdc-logo.png",
          color: COLORS[(allocations.length) % COLORS.length],
        });
      });

      // Calculate percentages
      allocations.forEach((allocation) => {
        allocation.percentage = total > 0 ? (allocation.value / total) * 100 : 0;
      });

      setAllocationData(allocations);
      setTotalValue(total);
    }
  }, [depositData, strategiesData]);

  if (isLoading) {
    return (
      <Card className="rounded-xl bg-[#101018] border border-[#16161f] overflow-hidden p-5">
        {/* Header */}
        <div className="mb-3">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-4 w-24 mt-0.5" />
        </div>
        {/* Chart and Legend side by side */}
        <div className="flex items-center h-[220px]">
          {/* Donut Chart */}
          <div className="flex-none flex items-center justify-center" style={{ width: '40%' }}>
            <Skeleton className="h-[160px] w-[160px] rounded-full" />
          </div>
          {/* Legend */}
          <div className="flex-1 space-y-1.5 pl-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/5" />
          </div>
        </div>
      </Card>
    );
  }

  if (allocationData.length === 0) {
    return null;
  }

  return (
    <Card className="rounded-xl bg-[#101018] border border-[#16161f] overflow-hidden p-5">
      {/* Header */}
      <div className="mb-3">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          Asset Allocation
        </h3>
        <div className="text-sm text-white font-bold tabular-nums mt-0.5">
          Total: ${totalValue.toFixed(2)}
        </div>
      </div>

      {/* Donut Chart with Legend on Right */}
      <div className="w-full h-[220px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
            <Pie
              data={allocationData}
              cx="35%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {allocationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <RechartsTooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="middle"
              align="right"
              layout="vertical"
              content={<CustomLegendContent />}
              wrapperStyle={{ paddingLeft: '10px', paddingRight: '8px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
