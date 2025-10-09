"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, DollarSign, BarChart3, ChartNoAxesCombined } from "lucide-react"

import { useState, useEffect } from "react"

import { Area, AreaChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Dot, ReferenceLine } from "recharts"
import { getChartData, ChartDataItem } from "@/lib/utils/chartData"

// Define types for data selection
type DataType = "APY History" | "Share Price" | "Vault NAV"
type TimeFrame = "24H" | "7D" | "30D" | "90D"

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
    
    // Format value based on data type
    const formattedValue = (() => {
      switch(dataType) {
        case "APY History":
          return `${value.toFixed(2)}%`
        case "Share Price":
          return `$${value.toFixed(3)}`
        case "Vault NAV":
          if (value >= 1000000) {
            return `$${(value / 1000000).toFixed(2)}M`
          } else if (value >= 1000) {
            return `$${(value / 1000).toFixed(1)}k`
          } else {
            return `$${value.toFixed(0)}`
          }
        default:
          return `${value}`
      }
    })()
    
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-lg">
        <div className="text-sm text-slate-400">{data.fullDate}</div>
        <div className="text-emerald-400 font-semibold">{formattedValue}</div>
      </div>
    )
  }
  return null
}

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props
  // Check if payload exists and has isActive property
  if (payload && payload.isActive) {
    return <Dot cx={cx} cy={cy} r={4} fill="#10b981" stroke="#1e293b" strokeWidth={2} />
  }
  return null
}

interface VaultDashboardChartProps {
  vaultAddress?: string;
}

export function VaultDashboardChart({ vaultAddress }: VaultDashboardChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [selectedDataType, setSelectedDataType] = useState<DataType>("APY History")
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeFrame>("90D")
  const [data, setData] = useState<ChartDataItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch real data when vault address, data type, or timeframe changes
  useEffect(() => {
    if (!vaultAddress) {
      // Clear data when no vault address is provided
      setData([])
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const chartData = await getChartData(vaultAddress, selectedDataType, selectedTimeframe);
        setData(chartData);
      } catch (err) {
        console.error('Error fetching chart data:', err);
        setError('Failed to load chart data');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [vaultAddress, selectedDataType, selectedTimeframe])
  
  // Determine stroke and fill colors based on final value
  const getChartColors = () => {
    if (data.length === 0) {
      return {
        stroke: "#10b981", 
        fill: "url(#colorValuePositive)"
      }
    }
    
    // Get the final (last) value in the dataset
    const finalValue = data[data.length - 1].value
    
    if (finalValue < 0) {
      return {
        stroke: "#ef4444",
        fill: "url(#colorValueNegative)"
      }
    }
    
    return {
      stroke: "#10b981", 
      fill: "url(#colorValuePositive)"
    }
  }
  
  const chartColors = getChartColors()

  // Get appropriate unit formatter based on data type
  const getYAxisFormatter = (dataType: DataType) => {
    switch(dataType) {
      case "APY History":
        return (value: number) => `${value}%`
      case "Share Price":
        return (value: number) => `$${value.toFixed(3)}`
      case "Vault NAV":
        return (value: number) => {
          if (value >= 1000000) {
            return `$${(value / 1000000).toFixed(1)}M`
          } else if (value >= 1000) {
            return `$${(value / 1000).toFixed(0)}k`
          } else {
            return `$${value.toFixed(0)}`
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
    
    // For Share Price and Vault NAV, start from 0 (not normalized)
    if (dataType === "Vault NAV") {
      return [0, max]; // Always start from 0 to show full scale
    }
    
    // For APY History, use normalized range to emphasize fluctuations
    const range = max - min;
    const avgValue = (max + min) / 2;
    
    if (range < Math.abs(avgValue) * 0.05) { // If range is less than 5% of average value
      // Create a domain that's centered on the average with at least ±2.5% range
      const buffer = Math.max(Math.abs(avgValue) * 0.025, range);
      return [min - buffer, max + buffer];
    }
    
    // Add a small buffer on top and bottom for better visualization
    const buffer = range * 0.1;
    return [min, max + buffer];
  }
  
  // Calculate the y-axis domain based on current data
  const yAxisDomain = calculateYAxisDomain(data, selectedDataType);


  // Get appropriate icon based on data type
  const getDataTypeIcon = (dataType: DataType) => {
    switch(dataType) {
      case "APY History":
        return <TrendingUp className="h-4 w-4" />
      case "Share Price":
        return <DollarSign className="h-4 w-4" />
      case "Vault NAV":
        return <BarChart3 className="h-4 w-4" />
      default:
        return <TrendingUp className="h-4 w-4" />
    }
  }

  // Get title based on data type
  const getChartTitle = (dataType: DataType) => {
    switch(dataType) {
      case "APY History":
        return "Yield Performance"
      case "Share Price":
        return "Share Value"
      case "Vault NAV":
        return "Total Value"
      default:
        return "Statistics"
    }
  }

  return (
    <Card className={`bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-700/30 backdrop-blur-sm rounded-lg shadow-lg ${/*hover:bg-blue-900/30*/""} transition-all duration-200`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center gap-2">
          <ChartNoAxesCombined className="h-5 w-5 text-blue-400"/> 
          Vault Performance
          {loading && <span className="text-sm text-blue-400 animate-pulse">Loading...</span>}
          {error && <span className="text-sm text-red-400">{error}</span>}
          {vaultAddress && (
            <span className="text-xs text-slate-400">
              ({vaultAddress.slice(0, 8)}...)
            </span>
          )}
        </CardTitle>
        
        {/* Data type and timeframe selector row */}
        <div className="flex flex-col sm:flex-row sm:justify-between mt-3 gap-3 sm:gap-2">
          {/* Data type selector */}
          <div className="flex gap-1 overflow-x-auto">
            {(["APY History", "Share Price", "Vault NAV"] as const).map((dataType) => (
              <Button
                key={dataType}
                variant={selectedDataType === dataType ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDataType(dataType)}
                className={`text-xs whitespace-nowrap ${selectedDataType === dataType ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-800/60 hover:bg-slate-700/60'}`}
              >
                <span className="hidden sm:inline">{getDataTypeIcon(dataType)}</span>
                <span className={selectedDataType === dataType ? "ml-1" : ""}>{dataType}</span>
              </Button>
            ))}
          </div>
          
          {/* Timeframe selector */}
          <div className="flex gap-1 justify-center sm:justify-end">
            {(["24H", "7D", "30D", "90D"] as const).map((timeframe) => (
              <Button
                key={timeframe}
                variant={selectedTimeframe === timeframe ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`text-xs ${selectedTimeframe === timeframe ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-800/60 hover:bg-slate-700/60'}`}
              >
                {timeframe}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
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
              {selectedDataType === "APY History" ? (
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
                  <linearGradient id="colorValuePositive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorValueNegative" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
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
                  padding={{ bottom: 10 }}
                />
                <ReferenceLine y={0} stroke="#64748b" strokeDasharray="2 2" strokeOpacity={0.5} />
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
                  stroke={chartColors.stroke}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill={chartColors.fill}
                  activeDot={{
                    r: 4,
                    fill: chartColors.stroke,
                    stroke: "#1e293b",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            ) : (
              <LineChart
                data={data}
                onMouseMove={(e: any) => {
                  if (e && e.activeTooltipIndex !== undefined) {
                    setActiveIndex(e.activeTooltipIndex)
                  }
                }}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <XAxis 
                  dataKey="date" 
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
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={chartColors.stroke}
                  strokeWidth={3}
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: chartColors.stroke,
                    stroke: "#1e293b",
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            )}
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
