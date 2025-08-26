"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

import { VaultDashboardExecuteCard } from "@/components/VaultDashboardExecuteCard"
import { VaultDashboardChart } from "@/components/VaultDashboardChart";
import { VaultDashboardFlow } from "@/components/VaultDashboardFlow";
import { VaultDashboardBalances } from "@/components/VaultDashboardBalances"
import { VaultDashboardUserPosition } from "@/components/VaultDashboardUserPosition"

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
    { id: "overview", label: "Overview" },
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
          {/* TO DO: Change Display based on which tab is opened */}
          {activeTab == "vault-stats" && (
            <div className="lg:col-span-2 space-y-4">
              <VaultDashboardFlow />
              <VaultDashboardChart />
              <VaultDashboardBalances />
          </div>
          )}
          {activeTab == "your-position" && (
            <div className="lg:col-span-2 space-y-4">
              <VaultDashboardUserPosition />
            </div>
          )}
          {activeTab == "overview" && (
            <div className="lg:col-span-2 space-y-4">
              <VaultDashboardBalances />
            </div>
          )}

          {/* Right Column - Execute Position Card */}
          <div className="lg:col-span-1">
            <VaultDashboardExecuteCard />
          </div>
        </div>
      </div>
    </div>
  )
}