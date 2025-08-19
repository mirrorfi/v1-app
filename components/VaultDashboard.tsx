"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { TrendingUp, BarChart3, Wallet, X } from "lucide-react"
import { useState } from "react"

import { VaultDashboardExecuteCard } from "@/components/VaultDashboardExecuteCard"
import { VaultDashboardChart } from "@/components/VaultDashboardChart";
import { VaultDashboardFlow } from "@/components/VaultDashboardFlow";

interface StrategyDashboardProps {
  strategy: {
    name: string
    icon?: string
    status: "active" | "inactive" | "pending"
  }
  activeTab: string
  onTabChange?: (tab: string) => void
}

export function VaultDashboard({ strategy, activeTab = "vault-stats", onTabChange }: StrategyDashboardProps) {
  const tabs = [
    { id: "vault-stats", label: "Vault Stats" },
    { id: "your-position", label: "Your Position" },
    { id: "analytics", label: "Overview" },
  ]

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="flex items-start gap-3 mb-3">
        <Avatar className="h-10 w-10 bg-gradient-to-br from-pink-500 to-rose-400">
          <AvatarFallback className="text-white font-bold">{strategy.icon || strategy.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-white">{strategy.name}</h2>
          <Badge
            variant={strategy.status === "active" ? "default" : "secondary"}
            className={`mt-1 ${
              strategy.status === "active"
                ? "bg-green-500/20 text-green-400 border-green-500/30"
                : "bg-gray-500/20 text-gray-400 border-gray-500/30"
            }`}
          >
            {strategy.status}
          </Badge>
        </div>
      </div>

      {/* Navigation Tabs - Moved below title */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "outline"}
            size="sm"
            onClick={() => onTabChange?.(tab.id)}
            className={
              activeTab === tab.id
                ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-500"
                : "bg-transparent border-blue-700/50 text-blue-300 hover:bg-blue-800/30 hover:text-white"
            }
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-[500px]">
          {/* Left Column - cards stacked */}
          <div className="lg:col-span-2 space-y-4">
            <VaultDashboardFlow />
            <VaultDashboardChart />
            <VaultBalancesCard />
          </div>

          {/* Right Column - Execute Position Card */}
          <div className="lg:col-span-1">
            <VaultDashboardExecuteCard />
          </div>
        </div>
      </div>
    </div>
  )
}

function VaultBalancesCard() {
  const positions = [
    {
      protocol: "Kamino Main Market",
      protocolLogo: "K",
      token: "USDC",
      tokenLogo: "U",
      amount: "1,000",
      action: "Supply",
      value: "$9,999",
      isPositive: true,
    },
    {
      protocol: "Kamino Main Market",
      protocolLogo: "K",
      token: "SOL",
      tokenLogo: "S",
      amount: "800",
      action: "Borrow",
      value: "$8,999",
      isPositive: false,
    },
    {
      protocol: "Meteora SOL-USDC",
      protocolLogo: "M",
      token: "LP",
      tokenLogo: "L",
      amount: "100",
      action: "DLMM",
      value: "$9,999",
      isPositive: true,
    },
    {
      protocol: "Meteora SOL-USDC",
      protocolLogo: "M",
      token: "SOL",
      tokenLogo: "S",
      amount: "3,000",
      action: "Supply",
      value: "$9,999",
      isPositive: true,
    },
  ]

  const totalValue = 1000
  const duration = "2 days"
  const totalGain = 100

  return (
    <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-700/30 backdrop-blur-sm rounded-lg shadow-lg hover:bg-blue-900/30 transition-all duration-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center gap-2">
          <Wallet className="h-5 w-5 text-blue-400" />
          Active Positions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pb-4">
        {/* Summary Row */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-white font-semibold">${totalValue.toLocaleString()}</span>
          <span className="text-gray-400">{duration}</span>
          <span className="text-green-400 font-medium">+${totalGain}</span>
        </div>

        {/* Positions List */}
        <div className="space-y-1 max-h-24 overflow-y-auto">
          {positions.slice(0, 2).map((position, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-xs bg-[#0F1218] rounded p-2 border border-[#2D3748]/30"
            >
              <div className="flex items-center gap-2 w-[50%] min-w-0">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-lg font-bold">{position.protocolLogo}</span>
                </div>
                <span className="text-gray-300 truncate text-lg">{position.protocol}</span>
              </div>

              <div className="flex items-center gap-1 w-[30%] justify-start">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <span className="text-white text-lg font-bold">{position.tokenLogo}</span>
                </div>
                <span className="text-white text-lg font-medium">{position.amount}</span>
              </div>

              <div className="flex items-center gap-1 w-[30%] justify-between">
                <Badge
                  className={`text-md px-1 py-0 h-4 ${
                    position.action === "Supply"
                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                      : position.action === "Borrow"
                        ? "bg-red-500/20 text-red-400 border-red-500/30"
                        : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                  }`}
                >
                  {position.action}
                </Badge>
                <span className={`text-lg font-medium ${position.isPositive ? "text-green-400" : "text-red-400"}`}>
                  {position.isPositive ? "" : "-"}
                  {position.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}