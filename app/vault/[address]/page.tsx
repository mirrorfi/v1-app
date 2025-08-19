"use client"
import { useState } from "react"
import { VaultDashboard } from "@/components/VaultDashboard"
import { Navbar } from "@/components/Navbar"

export default function VaultPage() {
  const [activeTab, setActiveTab] = useState("vault-stats")

  const strategy = {
    name: "My Super Hyped Strategy",
    icon: "🚀",
    status: "active" as const,
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <Navbar />
      <VaultDashboard strategy={strategy} activeTab={activeTab} onTabChange={setActiveTab} />
    </main>
  )
}