// Import or define CustomNodeWrapper
//import { CustomNode } from "@/components/custom-node"
import ReactFlow, { addEdge, Background, Controls, MarkerType, useEdgesState, useNodesState } from "reactflow"

// Define types that match ReactFlow's API
type Node = {
  id: string
  type?: string
  data: any
  position: { x: number; y: number }
}

type Edge = {
  id: string
  source: string
  target: string
  animated?: boolean
  style?: React.CSSProperties
  markerEnd?: { type: MarkerType }
}

type Connection = {
  source: string
  target: string
}

export async function getStrategyFlow(vaultId: string): Promise<any> {
  // Mock implementation - replace with actual logic to fetch strategy flow
  return {
    steps: [
      { step: 1, action: "Deposit", details: "User deposits tokens into the vault." },
      { step: 2, action: "Invest", details: "Vault invests tokens into various strategies." },
      { step: 3, action: "Harvest", details: "Earnings are harvested from investments." },
      { step: 4, action: "Withdraw", details: "User withdraws tokens from the vault." },
    ]
  };
}