"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

import { useState } from "react"

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Dot } from "recharts"

// Mock data for different timeframes
const mockData = {
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
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-lg">
        <div className="text-sm text-slate-400">{data.fullDate}</div>
        <div className="text-emerald-400 font-semibold">{payload[0].value.toFixed(2)}%</div>
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

interface PerformanceChartProps {
  selectedPeriod: string
}

export function VaultDashboardChart() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  
  
  const data = mockData["90D"]

  return (
    <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-700/30 backdrop-blur-sm rounded-lg shadow-lg hover:bg-blue-900/30 transition-all duration-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-400" />
          Price Statistics
        </CardTitle>
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
          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 12 }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            content={<CustomTooltip />}
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
