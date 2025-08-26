"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, DollarSign, BarChart3, ChartNoAxesCombined } from "lucide-react"

import { useState } from "react"

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Dot } from "recharts"

// Define types for data selection
type DataType = "APY History" | "Share Price" | "Vault NAV"
type TimeFrame = "24H" | "7D" | "30D" | "90D"

// Define chart data item type
interface ChartDataItem {
  date: string;
  fullDate: string;
  value: number;
}

// Mock data for different data types and timeframes
const mockData: Record<DataType, Record<TimeFrame, Array<ChartDataItem>>> = {
  "APY History": {
    "24H": [
      { date: "00:00", fullDate: "25 Jul 2025", value: 6.8 },
      { date: "04:00", fullDate: "25 Jul 2025", value: 6.9 },
      { date: "08:00", fullDate: "25 Jul 2025", value: 7.1 },
      { date: "12:00", fullDate: "25 Jul 2025", value: 7.0 },
      { date: "16:00", fullDate: "25 Jul 2025", value: 7.2 },
      { date: "20:00", fullDate: "25 Jul 2025", value: 7.15 },
    ],
    "7D": [
      { date: "19/07", fullDate: "19 Jul 2025", value: 6.2 },
      { date: "20/07", fullDate: "20 Jul 2025", value: 6.4 },
      { date: "21/07", fullDate: "21 Jul 2025", value: 6.6 },
      { date: "22/07", fullDate: "22 Jul 2025", value: 6.8 },
      { date: "23/07", fullDate: "23 Jul 2025", value: 7.0 },
      { date: "24/07", fullDate: "24 Jul 2025", value: 7.1 },
      { date: "25/07", fullDate: "25 Jul 2025", value: 7.15 },
    ],
    "30D": [
      { date: "26/06", fullDate: "26 Jun 2025", value: 4.8 },
      { date: "01/07", fullDate: "01 Jul 2025", value: 5.1 },
      { date: "06/07", fullDate: "06 Jul 2025", value: 5.4 },
      { date: "11/07", fullDate: "11 Jul 2025", value: 5.8 },
      { date: "16/07", fullDate: "16 Jul 2025", value: 6.2 },
      { date: "21/07", fullDate: "21 Jul 2025", value: 6.8 },
      { date: "25/07", fullDate: "25 Jul 2025", value: 7.15 },
    ],
    "90D": [
      { date: "22/05", fullDate: "22 May 2025", value: 0.2 },
      { date: "27/05", fullDate: "27 May 2025", value: 0.8 },
      { date: "01/06", fullDate: "01 Jun 2025", value: 1.2 },
      { date: "06/06", fullDate: "06 Jun 2025", value: 1.4 },
      { date: "11/06", fullDate: "11 Jun 2025", value: 1.6 },
      { date: "16/06", fullDate: "16 Jun 2025", value: 1.8 },
      { date: "21/06", fullDate: "21 Jun 2025", value: 2.0 },
      { date: "26/06", fullDate: "26 Jun 2025", value: 2.2 },
      { date: "01/07", fullDate: "01 Jul 2025", value: 2.4 },
      { date: "06/07", fullDate: "06 Jul 2025", value: 2.8 },
      { date: "11/07", fullDate: "11 Jul 2025", value: 3.2 },
      { date: "16/07", fullDate: "16 Jul 2025", value: 4.1 },
      { date: "21/07", fullDate: "21 Jul 2025", value: 5.2 },
      { date: "25/07", fullDate: "25 Jul 2025", value: 7.15 },
      { date: "17/08", fullDate: "17 Aug 2025", value: 7.2 },
    ],
  },
  "Share Price": {
    "24H": [
      { date: "00:00", fullDate: "25 Jul 2025", value: 1.105 },
      { date: "04:00", fullDate: "25 Jul 2025", value: 1.107 },
      { date: "08:00", fullDate: "25 Jul 2025", value: 1.109 },
      { date: "12:00", fullDate: "25 Jul 2025", value: 1.112 },
      { date: "16:00", fullDate: "25 Jul 2025", value: 1.115 },
      { date: "20:00", fullDate: "25 Jul 2025", value: 1.118 },
    ],
    "7D": [
      { date: "19/07", fullDate: "19 Jul 2025", value: 1.090 },
      { date: "20/07", fullDate: "20 Jul 2025", value: 1.095 },
      { date: "21/07", fullDate: "21 Jul 2025", value: 1.100 },
      { date: "22/07", fullDate: "22 Jul 2025", value: 1.105 },
      { date: "23/07", fullDate: "23 Jul 2025", value: 1.109 },
      { date: "24/07", fullDate: "24 Jul 2025", value: 1.115 },
      { date: "25/07", fullDate: "25 Jul 2025", value: 1.118 },
    ],
    "30D": [
      { date: "26/06", fullDate: "26 Jun 2025", value: 1.040 },
      { date: "01/07", fullDate: "01 Jul 2025", value: 1.050 },
      { date: "06/07", fullDate: "06 Jul 2025", value: 1.060 },
      { date: "11/07", fullDate: "11 Jul 2025", value: 1.070 },
      { date: "16/07", fullDate: "16 Jul 2025", value: 1.080 },
      { date: "21/07", fullDate: "21 Jul 2025", value: 1.100 },
      { date: "25/07", fullDate: "25 Jul 2025", value: 1.118 },
    ],
    "90D": [
      { date: "22/05", fullDate: "22 May 2025", value: 1.000 },
      { date: "27/05", fullDate: "27 May 2025", value: 1.010 },
      { date: "01/06", fullDate: "01 Jun 2025", value: 1.015 },
      { date: "06/06", fullDate: "06 Jun 2025", value: 1.020 },
      { date: "11/06", fullDate: "11 Jun 2025", value: 1.025 },
      { date: "16/06", fullDate: "16 Jun 2025", value: 1.030 },
      { date: "21/06", fullDate: "21 Jun 2025", value: 1.035 },
      { date: "26/06", fullDate: "26 Jun 2025", value: 1.040 },
      { date: "01/07", fullDate: "01 Jul 2025", value: 1.050 },
      { date: "06/07", fullDate: "06 Jul 2025", value: 1.060 },
      { date: "11/07", fullDate: "11 Jul 2025", value: 1.070 },
      { date: "16/07", fullDate: "16 Jul 2025", value: 1.080 },
      { date: "21/07", fullDate: "21 Jul 2025", value: 1.100 },
      { date: "25/07", fullDate: "25 Jul 2025", value: 1.118 },
      { date: "17/08", fullDate: "17 Aug 2025", value: 1.120 },
    ],
  },
  "Vault NAV": {
    "24H": [
      { date: "00:00", fullDate: "25 Jul 2025", value: 22500 },
      { date: "04:00", fullDate: "25 Jul 2025", value: 22550 },
      { date: "08:00", fullDate: "25 Jul 2025", value: 22600 },
      { date: "12:00", fullDate: "25 Jul 2025", value: 22700 },
      { date: "16:00", fullDate: "25 Jul 2025", value: 22800 },
      { date: "20:00", fullDate: "25 Jul 2025", value: 22900 },
    ],
    "7D": [
      { date: "19/07", fullDate: "19 Jul 2025", value: 21000 },
      { date: "20/07", fullDate: "20 Jul 2025", value: 21300 },
      { date: "21/07", fullDate: "21 Jul 2025", value: 21700 },
      { date: "22/07", fullDate: "22 Jul 2025", value: 22000 },
      { date: "23/07", fullDate: "23 Jul 2025", value: 22300 },
      { date: "24/07", fullDate: "24 Jul 2025", value: 22600 },
      { date: "25/07", fullDate: "25 Jul 2025", value: 22900 },
    ],
    "30D": [
      { date: "26/06", fullDate: "26 Jun 2025", value: 18000 },
      { date: "01/07", fullDate: "01 Jul 2025", value: 18500 },
      { date: "06/07", fullDate: "06 Jul 2025", value: 19000 },
      { date: "11/07", fullDate: "11 Jul 2025", value: 19500 },
      { date: "16/07", fullDate: "16 Jul 2025", value: 20500 },
      { date: "21/07", fullDate: "21 Jul 2025", value: 22000 },
      { date: "25/07", fullDate: "25 Jul 2025", value: 22900 },
    ],
    "90D": [
      { date: "22/05", fullDate: "22 May 2025", value: 10000 },
      { date: "27/05", fullDate: "27 May 2025", value: 11000 },
      { date: "01/06", fullDate: "01 Jun 2025", value: 12000 },
      { date: "06/06", fullDate: "06 Jun 2025", value: 13000 },
      { date: "11/06", fullDate: "11 Jun 2025", value: 14000 },
      { date: "16/06", fullDate: "16 Jun 2025", value: 15000 },
      { date: "21/06", fullDate: "21 Jun 2025", value: 16000 },
      { date: "26/06", fullDate: "26 Jun 2025", value: 17000 },
      { date: "01/07", fullDate: "01 Jul 2025", value: 18000 },
      { date: "06/07", fullDate: "06 Jul 2025", value: 19000 },
      { date: "11/07", fullDate: "11 Jul 2025", value: 20000 },
      { date: "16/07", fullDate: "16 Jul 2025", value: 21000 },
      { date: "21/07", fullDate: "21 Jul 2025", value: 22000 },
      { date: "25/07", fullDate: "25 Jul 2025", value: 22900 },
      { date: "17/08", fullDate: "17 Aug 2025", value: 23500 },
    ],
  },
}

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
          return `$${(value / 1000).toFixed(1)}k`
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
  // Optional props can be added here
}

export function VaultDashboardChart() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [selectedDataType, setSelectedDataType] = useState<DataType>("APY History")
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeFrame>("90D")
  
  // Get the data based on selected data type and timeframe
  const data: ChartDataItem[] = mockData[selectedDataType][selectedTimeframe]

  // Get appropriate unit formatter based on data type
  const getYAxisFormatter = (dataType: DataType) => {
    switch(dataType) {
      case "APY History":
        return (value: number) => `${value}%`
      case "Share Price":
        return (value: number) => `$${value.toFixed(3)}`
      case "Vault NAV":
        return (value: number) => `$${(value / 1000).toFixed(0)}k`
      default:
        return (value: number) => `${value}`
    }
  }

  // Calculate normalized domain for Y-axis to emphasize fluctuations
  const calculateYAxisDomain = (data: ChartDataItem[]): [number, number] => {
    if (!data || data.length === 0) return [0, 0];
    
    // Find min and max values
    const values = data.map(item => item.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    // If values are very close together (stable), create a normalized range
    const range = max - min;
    const avgValue = (max + min) / 2;
    
    if (range < avgValue * 0.05) { // If range is less than 5% of average value
      // Create a domain that's centered on the average with at least ±2.5% range
      const buffer = Math.max(avgValue * 0.025, range);
      return [min - buffer, max + buffer];
    }
    
    // Add a small buffer on top and bottom for better visualization
    const buffer = range * 0.1;
    return [min - buffer, max + buffer];
  }
  
  // Calculate the y-axis domain based on current data
  const yAxisDomain = calculateYAxisDomain(data);


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
          {/*getDataTypeIcon(selectedDataType)*/}
          {/*getChartTitle(selectedDataType)*/}
        </CardTitle>
        
        {/* Data type and timeframe selector row */}
        <div className="flex flex-wrap justify-between mt-3 gap-2">
          {/* Data type selector */}
          <div className="flex gap-1">
            {(["APY History", "Share Price", "Vault NAV"] as const).map((dataType) => (
              <Button
                key={dataType}
                variant={selectedDataType === dataType ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDataType(dataType)}
                className={`text-xs ${selectedDataType === dataType ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-800/60 hover:bg-slate-700/60'}`}
              >
                {getDataTypeIcon(dataType)}
                <span className="ml-1">{dataType}</span>
              </Button>
            ))}
          </div>
          
          {/* Timeframe selector */}
          <div className="flex gap-1">
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
        <div className="h-64 w-full relative">
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
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
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
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorValue)"
                activeDot={{
                  r: 4,
                  fill: "#10b981",
                  stroke: "#1e293b",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
