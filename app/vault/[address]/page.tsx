"use client"
import { useState } from "react"
import { VaultDashboard } from "@/components/VaultDashboard"
import { Navbar } from "@/components/Navbar"
import { useParams } from "next/navigation"

export default function VaultPage() {
  const [activeTab, setActiveTab] = useState("vault-stats")
  const {address: vault } = useParams<{ address: string }>();

  const strategy = {
    name: "My Super Hyped Strategy",
    icon: "🚀",
    status: "active" as const,
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <Navbar />
      <VaultDashboard vault={vault} strategy={strategy} activeTab={activeTab} onTabChange={setActiveTab} />
    </main>
  )
}