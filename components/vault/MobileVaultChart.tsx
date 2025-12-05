"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect, useCallback, useRef } from "react"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { getChartData, ChartDataItem } from "@/lib/utils/chartData"

// Define types for data selection
export type DataType = "TokenNav" | "UsdNav" | "UserDeposits"
export type TimeFrame = "24H" | "7D" | "30D" | "90D"

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  dataType: DataType;
}

const CustomTooltip = ({ active, payload, label, dataType }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    const value = payload[0].value
    
    console.log("Tooltip data:", data, value);

    // Format value based on data type
    const formattedValue = (() => {
      switch(dataType) {
        case "TokenNav":
          // Token NAV in USDC
          return `${value.toLocaleString('en-US', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 6
          })} USDC`
        case "UsdNav":
          // USD NAV as dollar value
          return `$${value.toLocaleString('en-US', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 6
          })}`
        case "UserDeposits":
          // User deposits (token amount)
          return `${value.toLocaleString('en-US', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 6
          })}`
        default:
          return `${value}`
      }
    })()
    
    const formattedTimestamp = (() => {
      return new Date(data.timestamp).toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'short',
        day: 'numeric', 
        hour: 'numeric', 
        minute: 'numeric',
        hour12: true 
      })
    })()



    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-lg">
        <div>{formattedTimestamp}</div>
        <div className="text-emerald-400 font-semibold">{formattedValue}</div>
      </div>
    )
  }
  return null
}

interface MobileVaultChartProps {
  vaultAddress: string;
}

export function MobileVaultChart({ vaultAddress }: MobileVaultChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [selectedDataType, setSelectedDataType] = useState<DataType>("TokenNav")
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeFrame>("24H")
  const [data, setData] = useState<ChartDataItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Memoize fetchData to prevent recreation on every render
  const fetchData = useCallback(async ({
    vaultAddress,
    selectedDataType,
    selectedTimeframe,
    updateData = false
  }: {
    vaultAddress: string;
    selectedDataType: DataType;
    selectedTimeframe: TimeFrame;
    updateData?: boolean;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const chartData = await getChartData(vaultAddress, selectedDataType, selectedTimeframe, updateData);
      setData(chartData);
    } catch (err) {
      console.error('Error fetching chart data:', err);
      setError('Failed to load chart data');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies needed since we pass all values as parameters

  // Track previous values to detect what changed
  const prevVaultRef = useRef(vaultAddress);
  const prevTimeframeRef = useRef(selectedTimeframe);
  const prevDataTypeRef = useRef(selectedDataType);

  // Single unified useEffect for all data fetching logic
  useEffect(() => {
    if (!vaultAddress) {
      setData([]);
      return;
    }

    // Determine if we need to fetch fresh data from API
    const vaultChanged = prevVaultRef.current !== vaultAddress;
    const timeframeChanged = prevTimeframeRef.current !== selectedTimeframe;
    const dataTypeChanged = prevDataTypeRef.current !== selectedDataType;

    // Update refs for next render
    prevVaultRef.current = vaultAddress;
    prevTimeframeRef.current = selectedTimeframe;
    prevDataTypeRef.current = selectedDataType;

    // Fetch fresh data if vault or timeframe changed
    // Use cached data if only data type changed
    const shouldFetchFresh = vaultChanged || timeframeChanged;
    
    fetchData({
      vaultAddress,
      selectedDataType,
      selectedTimeframe,
      updateData: shouldFetchFresh
    });

    // Set up interval for auto-refresh (only refetches, doesn't change selection)
    const interval = setInterval(() => {
      fetchData({
        vaultAddress,
        selectedDataType,
        selectedTimeframe,
        updateData: true
      });
    }, 60000); // 60,000 ms = 1 minute

    // Cleanup interval when dependencies change or component unmounts
    return () => clearInterval(interval);
  }, [vaultAddress, selectedDataType, selectedTimeframe, fetchData]);

  // Get appropriate unit formatter based on data type
  const getYAxisFormatter = (dataType: DataType) => {
    switch(dataType) {
      case "TokenNav":
        // Format token NAV with appropriate scale (USDC)
        return (value: number) => {
          if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)}M`
          } else if (value >= 1000) {
            return `${(value / 1000).toFixed(0)}k`
          } else {
            return `${value.toFixed(2)}`
          }
        }
      case "UsdNav":
        // Format USD NAV as dollar value with appropriate scale
        return (value: number) => {
          if (value >= 1000000) {
            return `$${(value / 1000000).toFixed(1)}M`
          } else if (value >= 1000) {
            return `$${(value / 1000).toFixed(0)}k`
          } else {
            return `$${value.toFixed(2)}`
          }
        }
      case "UserDeposits":
        // Format user deposits (token amount)
        return (value: number) => {
          if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)}M`
          } else if (value >= 1000) {
            return `${(value / 1000).toFixed(0)}k`
          } else {
            return `${value.toFixed(2)}`
          }
        }
      default:
        return (value: number) => `${value}`
    }
  }

  // Calculate Y-axis domain based on data type
  const calculateYAxisDomain = (data: ChartDataItem[], dataType: DataType): [number, number] => {
    if (!data || data.length === 0) return [0, 0];
    
    // Find min and max values
    const values = data.map(item => item.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    
    // Add 20% padding on both sides for a centered, stable view
    const padding = range > 0 ? range * 0.2 : max * 0.1;
    return [Math.max(0, min - padding), max + padding];
  }
  
  // Calculate the y-axis domain based on current data
  const yAxisDomain = calculateYAxisDomain(data, selectedDataType);
  
  return (
    <div className="bg-[#101018]/50 border-y border-[#16161f] py-3 px-3 space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between ml-2">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Performance</span>
        {/* Timeframe selector */}
        <div className="flex gap-1 justify-center sm:justify-end">
          {(["24H", "7D", "30D", "90D"] as const).map((timeframe) => (
            <Button
              key={timeframe}
              variant={selectedTimeframe === timeframe ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`text-xs ${selectedTimeframe === timeframe ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-800/60 hover:bg-slate-700/60'}`}
            >
              {timeframe}
            </Button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-[180px] -mx-4">
        <div className="h-48 sm:h-64 w-full relative">
          {data.length === 0 && !loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-slate-400 text-lg mb-2">📊</div>
                <div className="text-slate-400 text-sm">No data available</div>
                <div className="text-slate-500 text-xs">
                  {!vaultAddress ? "Select a vault to view chart data" : "No historical data found for this timeframe"}
                </div>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                onMouseMove={(e: any) => {
                  if (e && e.activeTooltipIndex !== undefined) {
                    setActiveIndex(e.activeTooltipIndex)
                  }
                }}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="50%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#334155" 
                  opacity={0.3}
                  horizontal={true}
                  vertical={false}
                />
                <XAxis 
                  dataKey="X-Axis" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#64748b", fontSize: 12 }} 
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  tickFormatter={getYAxisFormatter(selectedDataType)}
                  domain={yAxisDomain}
                  allowDataOverflow={false}
                />
                <Tooltip
                  content={(props) => <CustomTooltip {...props} dataType={selectedDataType} />}
                  cursor={{
                    stroke: "#64748b",
                    strokeWidth: 1,
                    strokeDasharray: "4 4",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="url(#colorValue)"
                  fillOpacity={1}
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: "#10b981",
                    stroke: "#1e293b",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
